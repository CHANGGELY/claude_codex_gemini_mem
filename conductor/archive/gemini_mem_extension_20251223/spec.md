# 规格说明书 (Specification): Gemini Mem 扩展

## 1. 概述
本项目标旨在将现有的 `claude-mem` 插件改造为支持 Gemini CLI 的跨会话记忆系统。通过解耦核心记忆逻辑与特定平台的 SDK，实现 Gemini CLI 与记忆服务的无缝集成，赋予 Gemini 代理“记住”上下文的能力。

## 2. 核心目标
1.  **核心解耦**: 将记忆存储、检索、摘要生成等核心逻辑从 Claude SDK 中剥离，形成通用的 Core Memory Service。
2.  **Gemini 适配**: 开发 Gemini CLI 专用的适配层，通过 Gemini 的工具调用或 Hook 机制与 Memory Service 通信。
3.  **通用化重构**: 重命名项目关键组件，消除对 "Claude" 的硬编码依赖，使其成为通用的 "AI Memory" 解决方案。

## 3. 技术架构变更
### 3.1 现有架构 (Claude-Mem)
- **Hooks**: 紧密绑定 Claude 生命周期 (`SessionStart`, `UserPromptSubmit` 等)。
- **Worker**: 基于 Express/Bun，但部分逻辑假定 Claude 环境。
- **SDK**: 深度依赖 `@anthropic-ai/claude-agent-sdk`。

### 3.2 目标架构 (Gemini-Mem)
- **Core Memory Service**: 独立运行的 HTTP 服务（保留现有 Worker 架构，但接口通用化）。
    - 负责：SQLite 读写、向量检索、摘要生成。
    - 接口：RESTful API (标准化)。
- **Adapters**:
    - **Claude Adapter**: 保留现有功能。
    - **Gemini Adapter**: 新增。
        - 负责：拦截 Gemini CLI 输入/输出，调用 Core Memory Service API。
        - 实现方式：利用 Gemini CLI 的扩展机制或 Wrapper 脚本。

## 4. 功能需求
1.  **会话管理**: Gemini CLI 启动时自动创建或恢复会话。
2.  **上下文注入**: 在 Gemini 处理用户提示词前，根据查询检索相关记忆并注入 Context。
3.  **自动捕获**: 自动记录 Gemini 的工具调用和用户交互到 SQLite。
4.  **记忆查看器**: 现有的 Web Viewer 应能显示 Gemini 的会话数据。

## 5. 约束条件
- 必须保持对现有 Claude 用户的功能兼容（可选，但建议逐步迁移）。
- Gemini CLI 可能没有与 Claude 完全一致的 Hook 系统，需要探索替代方案（如 Alias 包装或手动集成）。
- 确保中文支持。

## 6. 成功标准
- 可以通过 Gemini CLI 启动并连接到记忆服务。
- 在 Gemini 的新会话中，可以询问上一个会话的内容（例如：“我上次做了什么？”）。
- Web Viewer 正确显示 Gemini 的会话记录。
