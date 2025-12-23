import fs from 'fs';
import os from 'os';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { getProjectName } from '../../utils/project-name.js';

type UnknownRecord = Record<string, unknown>;

function getWorkerBaseUrl(): string {
  const port = process.env.CLAUDE_MEM_WORKER_PORT || '37777';
  const host = process.env.CLAUDE_MEM_WORKER_HOST || '127.0.0.1';
  return `http://${host}:${port}`;
}

async function postJson<T>(url: string, body: unknown): Promise<{ ok: boolean; status: number; data?: T; text?: string }> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return { ok: false, status: res.status, text: await res.text() };
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return { ok: true, status: res.status, data: (await res.json()) as T };
  }

  return { ok: true, status: res.status };
}

function safeJsonParse(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed) return value;
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return value;
  }
}

function extractTextFromContent(content: unknown): string {
  if (!Array.isArray(content)) return '';
  const chunks: string[] = [];
  for (const part of content) {
    if (!part || typeof part !== 'object') continue;
    const maybeText = (part as UnknownRecord).text;
    if (typeof maybeText === 'string' && maybeText.trim()) chunks.push(maybeText);
  }
  return chunks.join('\n').trim();
}

function isLikelyHarnessMetaPrompt(text: string): boolean {
  const trimmed = text.trim();
  return trimmed.startsWith('# AGENTS.md instructions') || trimmed.startsWith('<environment_context>');
}

async function findLatestCodexSessionFile(): Promise<string> {
  const root = path.join(os.homedir(), '.codex', 'sessions');
  const candidates: Array<{ filePath: string; mtimeMs: number }> = [];

  async function walk(dir: string): Promise<void> {
    let entries: fs.Dirent[];
    try {
      entries = await fs.promises.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    await Promise.all(entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(entryPath);
        return;
      }
      if (!entry.isFile() || !entry.name.endsWith('.jsonl')) return;
      try {
        const stat = await fs.promises.stat(entryPath);
        candidates.push({ filePath: entryPath, mtimeMs: stat.mtimeMs });
      } catch {
        return;
      }
    }));
  }

  await walk(root);

  if (candidates.length === 0) {
    throw new Error(`No Codex session files found under ${root}`);
  }

  candidates.sort((a, b) => b.mtimeMs - a.mtimeMs);
  return candidates[0].filePath;
}

interface ImportOptions {
  filePath: string;
  platform?: string;
  verbose?: boolean;
}

export async function importCodexSessionToClaudeMem(options: ImportOptions): Promise<void> {
  const workerBaseUrl = getWorkerBaseUrl();

  const stream = fs.createReadStream(options.filePath, { encoding: 'utf8' });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  let platformSessionId: string | null = null;
  let cwdFromMeta: string | null = null;
  const pendingToolCalls = new Map<string, { name: string; args: unknown }>();

  let currentCwd: string | null = null;
  let importedPrompts = 0;
  let importedObservations = 0;

  const platform = options.platform ?? 'codex';

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let event: UnknownRecord;
    try {
      event = JSON.parse(trimmed) as UnknownRecord;
    } catch {
      continue;
    }

    const type = event.type;
    const payload = event.payload;
    if (!payload || typeof payload !== 'object') continue;
    const payloadObj = payload as UnknownRecord;

    if (type === 'session_meta') {
      const id = payloadObj.id;
      const cwd = payloadObj.cwd;
      if (typeof id === 'string') platformSessionId = id;
      if (typeof cwd === 'string') cwdFromMeta = cwd;
      continue;
    }

    if (type === 'turn_context') {
      const cwd = payloadObj.cwd;
      if (typeof cwd === 'string') currentCwd = cwd;
      continue;
    }

    if (type !== 'response_item') continue;

    const payloadType = payloadObj.type;

    // User prompt
    if (payloadType === 'message' && payloadObj.role === 'user') {
      const text = extractTextFromContent(payloadObj.content);
      if (!text || isLikelyHarnessMetaPrompt(text)) continue;

      const cwd = currentCwd || cwdFromMeta || process.cwd();
      const project = getProjectName(cwd);

      if (!platformSessionId) {
        // Fallback: derive a stable ID from file name (best-effort)
        platformSessionId = path.basename(options.filePath, path.extname(options.filePath));
      }

      const initRes = await postJson<{ sessionDbId: number; promptNumber: number; skipped?: boolean; reason?: string }>(
        `${workerBaseUrl}/api/sessions/init`,
        { platformSessionId, project, prompt: text, platform }
      );

      if (!initRes.ok) {
        throw new Error(`Worker session init failed (${initRes.status}): ${initRes.text ?? ''}`);
      }

      importedPrompts += 1;
      if (options.verbose) {
        const pn = initRes.data?.promptNumber;
        console.error(`[codex-import] prompt #${pn ?? '?'} saved (${project})`);
      }
      continue;
    }

    // Tool call
    if (payloadType === 'function_call') {
      const callId = payloadObj.call_id;
      const name = payloadObj.name;
      const args = safeJsonParse(payloadObj.arguments);
      if (typeof callId === 'string' && typeof name === 'string') {
        pendingToolCalls.set(callId, { name, args });
      }
      continue;
    }

    // Tool output
    if (payloadType === 'function_call_output') {
      const callId = payloadObj.call_id;
      if (typeof callId !== 'string') continue;

      const toolCall = pendingToolCalls.get(callId);
      if (!toolCall) continue;
      pendingToolCalls.delete(callId);

      if (toolCall.name === 'update_plan') continue;

      const cwd = currentCwd || cwdFromMeta || process.cwd();

      if (!platformSessionId) {
        platformSessionId = path.basename(options.filePath, path.extname(options.filePath));
      }

      const toolResponse = payloadObj.output;
      const observationRes = await postJson(
        `${workerBaseUrl}/api/sessions/observations`,
        {
          platformSessionId,
          tool_name: toolCall.name,
          tool_input: toolCall.args ?? {},
          tool_response: typeof toolResponse === 'string' ? { output: toolResponse } : toolResponse ?? {},
          cwd,
        }
      );

      if (!observationRes.ok) {
        throw new Error(`Worker observation enqueue failed (${observationRes.status}): ${observationRes.text ?? ''}`);
      }

      importedObservations += 1;
      continue;
    }
  }

  if (!platformSessionId) {
    throw new Error('Missing platformSessionId (no session_meta.id found)');
  }

  // Best-effort session completion
  await postJson(`${workerBaseUrl}/api/sessions/complete`, { platformSessionId });

  console.error(`[codex-import] done: prompts=${importedPrompts}, tool_calls=${importedObservations}`);
}

function parseArgs(argv: string[]): { filePath?: string; last?: boolean; verbose?: boolean; platform?: string } {
  const result: { filePath?: string; last?: boolean; verbose?: boolean; platform?: string } = {};

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--file' && argv[i + 1]) {
      result.filePath = argv[++i];
      continue;
    }
    if (arg === '--last') {
      result.last = true;
      continue;
    }
    if (arg === '--platform' && argv[i + 1]) {
      result.platform = argv[++i];
      continue;
    }
    if (arg === '--verbose' || arg === '-v') {
      result.verbose = true;
      continue;
    }
  }

  return result;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const filePath = args.filePath ?? (args.last ? await findLatestCodexSessionFile() : undefined);

  if (!filePath) {
    console.error('Usage: npx tsx src/adapters/codex/import-session.ts --file <session.jsonl> | --last');
    process.exit(2);
  }

  await importCodexSessionToClaudeMem({ filePath, platform: args.platform, verbose: args.verbose });
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  main().catch((err) => {
    console.error(`[codex-import] error: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  });
}
