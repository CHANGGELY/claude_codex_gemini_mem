<div align="center">
  <img src="assets/logo.svg" width="180" alt="Logo" />
  <h1>Claude Codex Gemini Mem</h1>
  <p>
    <b>跨窗口 / 跨会话 AI 记忆系统</b><br>
    让 AI (Claude Code / Gemini / Codex) 拥有持久记忆，不再遗忘。
  </p>

  <p>
    <a href="https://github.com/CHANGGELY/claude_codex_gemini_mem/stargazers">
      <img src="https://img.shields.io/github/stars/CHANGGELY/claude_codex_gemini_mem?style=social" alt="GitHub stars">
    </a>
    <a href="https://github.com/CHANGGELY/claude_codex_gemini_mem/network/members">
      <img src="https://img.shields.io/github/forks/CHANGGELY/claude_codex_gemini_mem?style=social" alt="GitHub forks">
    </a>
    <a href="https://github.com/CHANGGELY/claude_codex_gemini_mem/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/CHANGGELY/claude_codex_gemini_mem" alt="License">
    </a>
  </p>
</div>

---

> 🚀 **这是一个明星级的开源项目**，旨在打破 AI 会话的隔阂，构建统一的上下文记忆层。

本仓库基于 `thedotmack/claude-mem` 深度优化与扩展，现已完美支持：

- 🧠 **Claude Code** - 深度集成
- 💎 **Gemini CLI** - 无缝对接
- 💻 **Codex CLI** - 强力驱动

它会自动捕获工具调用与关键上下文，生成可复用的记忆，并在新会话启动时智能注入相关内容。

---

## ⚡️ 快速开始

### 1. 预备条件

- **Node.js** >= 18
- **Bun** (推荐，用于极速启动 worker)
- 已安装相应 CLI：Claude Code / Gemini CLI / Codex CLI

### 2. 启动核心服务 (Worker)

所有平台共用同一个记忆核心：

```bash
bun plugin/scripts/worker-service.cjs
```

---

## 🛠️ 平台接入指南

### <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png" width="20" /> Claude Code

在 Claude Code 终端中执行：

```bash
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem
```

重启 Claude Code 即可生效。  
👀 **Web Viewer**: [http://localhost:37777](http://localhost:37777)

### <img src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg" width="20" /> Gemini CLI

1. **绑定扩展** (在仓库根目录)：
   ```bash
   gemini extensions link .
   ```

2. **初始化会话**：
   ```bash
   npx tsx src/adapters/gemini/hook.ts
   ```

### <img src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg" width="20" /> Codex CLI

1. **添加 MCP 服务**：
   ```bash
   codex mcp add mem-search -- npx tsx src/servers/mcp-server.ts
   ```

2. **启动并注入记忆**：
   ```bash
   npx tsx src/adapters/codex/run.ts -- --model "gpt-5.2"
   ```

---

## 🌟 常用功能

| 功能 | 描述 |
|------|------|
| 🧠 **记忆注入** | 新会话自动加载历史关键上下文，无需重复教导 AI。 |
| 🔍 **Mem-Search** | 强大的语义检索，查找历史行为、总结与工具调用。 |
| 📺 **Web Viewer** | `http://localhost:37777` 实时查看记忆流与思维链。 |
| 🔒 **隐私控制** | 使用 `<private>...</private>` 标签包裹的内容将自动被记忆系统忽略。 |

---

## 📈 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=CHANGGELY/claude_codex_gemini_mem&type=Date)](https://star-history.com/#CHANGGELY/claude_codex_gemini_mem&Date)

---

## 📄 License

This project is licensed under the [AGPLv3 License](LICENSE).
