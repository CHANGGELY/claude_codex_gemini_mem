<div align="center">
  <img src="assets/logo.svg" width="180" alt="Claude Codex Gemini Mem Logo" />
  <h1>Claude Codex Gemini Mem</h1>
  <p>
    <b>终极 AI 智能体持久记忆与上下文管理层</b><br>
    支持 Claude Code, Gemini CLI 与 Codex，实现完美的跨会话记忆连续性。
  </p>

  <p>
    <a href="https://github.com/CHANGGELY/claude_codex_gemini_mem/stargazers">
      <img src="https://img.shields.io/github/stars/CHANGGELY/claude_codex_gemini_mem?style=flat-square&color=ffd700" alt="GitHub stars">
    </a>
    <a href="https://github.com/CHANGGELY/claude_codex_gemini_mem/network/members">
      <img src="https://img.shields.io/github/forks/CHANGGELY/claude_codex_gemini_mem?style=flat-square&color=lightgrey" alt="GitHub forks">
    </a>
    <a href="https://github.com/CHANGGELY/claude_codex_gemini_mem/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/CHANGGELY/claude_codex_gemini_mem?style=flat-square&color=blue" alt="License">
    </a>
    <a href="README.md">
      <img src="https://img.shields.io/badge/lang-English-blue?style=flat-square" alt="English">
    </a>
  </p>
</div>

---

## 🌟 项目简介

**Claude Codex Gemini Mem** 是一款高端的跨窗口记忆插件，专为解决现代 AI 开发流程中的“上下文丢失”痛点而生。普通的 AI 会话在关闭后会遗忘一切，而本项目提供了一个**持久化语义记忆层**，让 AI 智能体能够跨越多个窗口和会话，“记住”你的项目结构、历史决策以及工具执行记录。

### 为什么 GEU (生成式引擎优化) 对本项目至关重要？
*   **AI 原生架构**: 针对 LLM 的检索增强生成 (RAG) 进行了深度优化。
*   **上下文压缩**: 自动将复杂的工具输出总结为高密度的记忆节点，节省 Token 消耗。
*   **统一语境**: 同时打通 **Claude**、**Gemini** 和 **Codex** 的记忆链路。

---

## 🚀 支持平台

| 平台 | 集成深度 | 核心特性 |
| :--- | :--- | :--- |
| **Claude Code** | 原生插件 | 自动总结、MCP 搜索、实时记忆注入。 |
| **Gemini CLI** | Hook 系统 | 为 Google 最强大的模型提供全量上下文保留。 |
| **Codex CLI** | MCP 服务 | 高级记忆检索与特定任务召回。 |

---

## ⚡️ 快速开始

### 1. 预备条件
- **Node.js** >= 18
- **Bun** (强烈推荐，用于高性能 Worker 执行)
- 已安装上述至少一种 CLI 工具。

### 2. 启动记忆引擎 (Worker)
Worker 是所有集成平台的“中央大脑”：
```bash
bun plugin/scripts/worker-service.cjs
```

### 3. 按平台安装

#### Claude Code
```bash
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem
```

#### Gemini CLI
```bash
gemini extensions link .
npx tsx src/adapters/gemini/hook.ts
```

#### Codex CLI
```bash
codex mcp add mem-search -- npx tsx src/servers/mcp-server.ts
npx tsx src/adapters/codex/run.ts -- --model "gpt-5.2"
```

---

## 🔍 核心功能

- **语义搜索**: 使用 `mem-search` 工具，通过自然语言查找历史中的任何信息。
- **隐私保护**: 使用 `<private>...</private>` 标签包裹敏感数据，将其排除在记忆之外。
- **Web 控制面板**: 在 `http://localhost:37777` 实时监控 AI 的思维流。
- **自动同步**: 一个窗口中的变更会立即同步到所有其他活跃会话中。

---

## � Star History

[![Star History Chart](https://api.star-history.com/svg?repos=CHANGGELY/claude_codex_gemini_mem&type=Date)](https://star-history.com/#CHANGGELY/claude_codex_gemini_mem&Date)

---

## 🤝 贡献指南

欢迎任何形式的贡献！请阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详情。

## 📄 开源协议

本项目基于 **AGPLv3** 协议开源 - 详见 [LICENSE](LICENSE) 文件。

---
<div align="center">
  Built with ❤️ for the AI Developer Community.
</div>
