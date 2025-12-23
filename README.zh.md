# claude-mem（跨窗口记忆插件）

这是一个让 AI 在**跨窗口 / 跨会话**中保持项目记忆的插件系统。  
本仓库基于 `thedotmack/claude-mem` 修改，现已支持：

- **Claude Code**
- **Gemini CLI**
- **Codex CLI**

它会自动捕获工具调用与关键上下文，生成可复用的记忆，并在新会话启动时注入相关内容。

---

## 预备条件

- Node.js >= 18
- Bun（用于启动 worker）
- 已安装相应 CLI：Claude Code / Gemini CLI / Codex CLI（至少其中一个）

---

## 一键概览（推荐顺序）

1. **启动 worker（所有平台共用）**
   ```bash
   bun plugin/scripts/worker-service.cjs
   ```

2. **按所用平台执行对应安装与使用步骤**

---

## Claude Code 安装与使用

在 Claude Code 终端中执行：

```
/plugin marketplace add thedotmack/claude-mem

/plugin install claude-mem
```

重启 Claude Code，即可自动注入跨会话记忆。  
默认 Web Viewer：`http://localhost:37777`

---

## Gemini CLI 安装与使用

1) 绑定扩展（在仓库根目录执行）  
```bash
gemini extensions link .
```

2) 初始化会话（确保 worker 已启动）  
```bash
npx tsx src/adapters/gemini/hook.ts
```

此后 Gemini CLI 会自动读取并写入记忆。

---

## Codex CLI 安装与使用

1) 添加 MCP 服务（一次性）  
```bash
codex mcp add mem-search -- npx tsx src/servers/mcp-server.ts
```

2) 启动 Codex 并自动注入记忆  
```bash
npx tsx src/adapters/codex/run.ts -- --model "gpt-5.2"
```

3) （可选）手动导入最近一次 Codex 会话  
```bash
npx tsx src/adapters/codex/import-session.ts --last
```

---

## 常用功能

- **记忆注入**：新会话自动加载历史上下文  
- **mem-search 搜索**：可检索历史行为、总结、工具调用  
- **Web Viewer**：`http://localhost:37777` 查看实时记忆流  
- **隐私控制**：用 `<private>...</private>` 包裹内容将被忽略

---

## 说明

- 本项目是跨窗口 / 跨会话记忆的统一入口，支持 Claude Code、Gemini CLI、Codex CLI 三端共用记忆。
- 记忆存储在本地数据库中，默认端口为 `37777`。

如需更深入配置与原理，可参考 `docs/` 或 `README.md`。
