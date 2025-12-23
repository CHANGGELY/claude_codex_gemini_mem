import os from 'os';
import path from 'path';
import fs from 'fs';

async function initGeminiSession() {
  const workerPort = process.env.CLAUDE_MEM_WORKER_PORT || '37777';
  const projectPath = process.cwd();
  const projectName = path.basename(projectPath);
  
  // 生成或获取一个稳定的会话 ID
  // 对于 Gemini CLI，我们可以暂时使用 PID + CWD 的哈希，或者简单的随机 ID
  // 但为了实现“跨窗口”，我们需要一个持久的标识。
  // 实际上，Gemini CLI 可能并没有像 Claude 那样的持久 session_id 暴露在环境变量中。
  // 我们先用当前项目的路径作为 Session 标识的一个组成部分。
  const sessionId = `gemini-session-${Buffer.from(projectPath).toString('hex').substring(0, 16)}`;

  console.log(`[GeminiMem] Initializing session ${sessionId} for project ${projectName}...`);

  try {
    const response = await fetch(`http://127.0.0.1:${workerPort}/api/sessions/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platformSessionId: sessionId,
        project: projectName,
        prompt: 'Gemini Session Started', // 初始占位符
        platform: 'gemini'
      })
    });

    const data = await response.json();
    console.log(`[GeminiMem] Session initialized:`, data);
  } catch (error) {
    console.error(`[GeminiMem] Failed to initialize session:`, error);
  }
}

initGeminiSession();
