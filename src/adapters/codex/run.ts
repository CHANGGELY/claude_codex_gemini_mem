import os from 'os';
import path from 'path';
import { spawn } from 'child_process';
import fs from 'fs';
import { getProjectName } from '../../utils/project-name.js';
import { importCodexSessionToClaudeMem } from './import-session.js';

function getWorkerBaseUrl(): string {
  const port = process.env.CLAUDE_MEM_WORKER_PORT || '37777';
  const host = process.env.CLAUDE_MEM_WORKER_HOST || '127.0.0.1';
  return `http://${host}:${port}`;
}

async function tryFetchContext(project: string): Promise<string | null> {
  const url = `${getWorkerBaseUrl()}/api/context/inject?project=${encodeURIComponent(project)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const text = (await res.text()).trim();
    return text ? text : null;
  } catch {
    return null;
  }
}

async function findLatestCodexSessionFile(afterMs: number): Promise<string | null> {
  const root = path.join(os.homedir(), '.codex', 'sessions');
  let best: { filePath: string; mtimeMs: number } | null = null;

  async function walk(dir: string): Promise<void> {
    let entries: fs.Dirent[];
    try {
      entries = await fs.promises.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(entryPath);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith('.jsonl')) continue;
      try {
        const stat = await fs.promises.stat(entryPath);
        if (stat.mtimeMs < afterMs) continue;
        if (!best || stat.mtimeMs > best.mtimeMs) best = { filePath: entryPath, mtimeMs: stat.mtimeMs };
      } catch {
        continue;
      }
    }
  }

  await walk(root);
  return best ? best.filePath : null;
}

function parseRunArgs(argv: string[]): { prompt?: string; noContext?: boolean; noImport?: boolean; codexArgs: string[] } {
  const result: { prompt?: string; noContext?: boolean; noImport?: boolean; codexArgs: string[] } = { codexArgs: [] };

  const sepIndex = argv.indexOf('--');
  const localArgs = sepIndex === -1 ? argv : argv.slice(0, sepIndex);
  const codexArgs = sepIndex === -1 ? [] : argv.slice(sepIndex + 1);

  for (let i = 0; i < localArgs.length; i++) {
    const arg = localArgs[i];
    if (arg === '--prompt' && localArgs[i + 1]) {
      result.prompt = localArgs[++i];
      continue;
    }
    if (arg === '--no-context') {
      result.noContext = true;
      continue;
    }
    if (arg === '--no-import') {
      result.noImport = true;
      continue;
    }
  }

  result.codexArgs = codexArgs;
  return result;
}

async function main() {
  const args = parseRunArgs(process.argv.slice(2));
  const cwd = process.cwd();
  const project = getProjectName(cwd);

  let initialPromptParts: string[] = [];

  if (!args.noContext) {
    const context = await tryFetchContext(project);
    if (context) {
      initialPromptParts.push(
        `下面是 claude-mem 为项目「${project}」生成的跨会话记忆上下文（请作为背景知识使用，不需要逐字复述）：\n\n${context}`
      );
    } else {
      initialPromptParts.push(
        `（提示）未能从 claude-mem 获取到记忆上下文：请确认 worker 已启动（例如在 claude-mem 仓库中运行 \`bun plugin/scripts/worker-service.cjs\`）。`
      );
    }
  }

  if (args.prompt) {
    initialPromptParts.push(`用户请求：\n${args.prompt}`);
  } else {
    initialPromptParts.push('请先确认你已读取并理解上述记忆上下文，然后询问我本次要做什么。');
  }

  const initialPrompt = initialPromptParts.filter(Boolean).join('\n\n---\n\n');

  const startMs = Date.now();

  const child = spawn('codex', [...args.codexArgs, initialPrompt], {
    stdio: 'inherit',
    cwd,
    env: process.env,
  });

  const exitCode: number = await new Promise((resolve) => {
    child.on('exit', (code) => resolve(code ?? 1));
  });

  if (!args.noImport) {
    const sessionFile = await findLatestCodexSessionFile(startMs - 2000);
    if (!sessionFile) {
      console.error('[codex-mem] warning: no session jsonl found to import');
    } else {
      await importCodexSessionToClaudeMem({ filePath: sessionFile, platform: 'codex' });
    }
  }

  process.exit(exitCode);
}

main().catch((err) => {
  console.error(`[codex-mem] error: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
