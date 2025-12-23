# Gemini 迁移分析报告

## 1. 依赖扫描结果
经过扫描，项目中直接依赖 `@anthropic-ai/claude-agent-sdk` 的文件主要集中在：

- `src/services/worker/SDKAgent.ts`: 使用了 `query` 函数进行 AI 调用。
- `src/services/worker-types.ts`: 使用了 `SDKUserMessage` 类型定义。

## 2. 核心耦合点
- **数据结构**: 系统当前的 `Transcript` 解析逻辑可能假定了 Claude 的日志格式。
- **生命周期**: `plugin/scripts/` 下的钩子（如 `context-hook.js`, `summary-hook.js`）虽然没有直接 import SDK，但其运行环境是由 Claude CLI 提供的，接收的参数也是 Claude 特定的。

## 3. 解耦建议
1.  **抽象 Agent 层**: 将 `SDKAgent.ts` 抽象为通用的 AI 调用接口，使其既能支持 Claude 也能支持 Gemini。
2.  **通用数据模型**: 定义一组不依赖特定 SDK 的 `MemoryObservation` 和 `SessionSummary` 类型。
3.  **适配器模式**: 为不同的 CLI 工具（Claude Code, Gemini CLI）提供独立的入口脚本。
