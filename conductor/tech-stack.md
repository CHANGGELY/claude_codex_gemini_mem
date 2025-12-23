# 技术栈 (Tech Stack)

## 核心运行时与语言
- **TypeScript**: 作为主要的编程语言，确保代码的类型安全和可维护性。
- **Node.js / Bun**: 后端运行时环境。为了支持多平台（Claude/Gemini），核心服务已完成平台解耦。项目利用了 Bun 的高性能和内置的进程管理功能。

## 后端框架与 API
- **Express**: 用于构建 Web 查看器的后端 API，监听端口 37777。
- **Claude Agent SDK**: 用于集成 Claude Code 的核心插件功能和生命周期钩子。
- **Model Context Protocol (MCP) SDK**: 用于实现 MCP 服务器，支持跨工具的上下文通信。
- **Codex CLI Integration**: 实现了对 Codex CLI 的原生支持，包括通过 `.jsonl` 会话日志进行自动记忆导入和上下文注入。

## 前端技术 (Web Viewer)
- **React**: 用于构建 Web 查看器的用户界面。
- **React DOM**: 处理 Web 环境的渲染。
- **esbuild**: 用于快速构建前端资源。

## 存储与搜索
- **SQLite 3**: 作为主数据库，通过 FTS5 插件提供高性能的关键词全文搜索。
- **Chroma (Vector DB)**: 计划或已用于向量搜索，实现基于语义的上下文检索。

## 开发与构建工具
- **typescript**: 编译器。
- **tsx**: 用于直接运行 TypeScript 文件。
- **glob**: 用于文件模式匹配。
- **handlebars**: 模板引擎。
- **zod-to-json-schema**: 将 Zod 模式转换为 JSON 模式，用于工具定义。
