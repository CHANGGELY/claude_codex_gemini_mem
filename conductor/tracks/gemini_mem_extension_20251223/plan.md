# 执行计划 (Implementation Plan): Gemini Mem 扩展

## 阶段 1: 分析与环境准备 (Analysis & Setup)
此阶段重点是理解现有代码库对 Claude SDK 的依赖程度，并建立 Gemini 的开发调试环境。

- [ ] 任务: 分析 `worker-service` 对 Claude SDK 的依赖
    - [ ] 子任务: 扫描 `src/` 目录，列出所有引入 `@anthropic-ai/claude-agent-sdk` 的文件。
    - [ ] 子任务: 编写分析报告，确定需要解耦的模块。
    - [ ] 子任务: 提交分析报告到 `docs/architecture/gemini-migration-analysis.md`。

- [ ] 任务: 建立 Gemini 调试环境
    - [ ] 子任务: 确认 Gemini CLI 的扩展/插件机制或 Hook 点。
    - [ ] 子任务: 创建一个简单的 "Hello World" Gemini 扩展脚本，验证拦截输入输出的能力。

- [ ] 任务: Conductor - 用户手册验证 '阶段 1: 分析与环境准备' (按此协议执行)

## 阶段 2: 核心服务解耦 (Core Decoupling)
将核心业务逻辑（数据库、搜索、摘要）从 Claude 特定代码中分离。

- [ ] 任务: 抽象 Memory Service 接口
    - [ ] 子任务: 定义通用的 `IMemoryService` 接口（包含 `createSession`, `addObservation`, `search` 等方法）。
    - [ ] 子任务: 创建 `CoreMemoryService` 类，迁移原有的业务逻辑，移除对 Claude 类型的直接依赖。

- [ ] 任务: 重构 Worker API
    - [ ] 子任务: 确保 HTTP 端点 (`/api/*`) 接受通用的 JSON 数据结构，而非仅接受 Claude Transcript 对象。
    - [ ] 子任务: 编写测试用例，验证通过纯 HTTP 请求能否成功存储和检索记忆。

- [ ] 任务: Conductor - 用户手册验证 '阶段 2: 核心服务解耦' (按此协议执行)

## 阶段 3: Gemini 适配器开发 (Gemini Adapter)
实现 Gemini 侧的集成逻辑。

- [ ] 任务: 实现 Gemini 会话管理器
    - [ ] 子任务: 编写脚本，用于在 Gemini 启动时检测或生成 `session_id`。
    - [ ] 子任务: 实现与 Worker Service 的握手（Session Start）。

- [ ] 任务: 实现上下文注入机制
    - [ ] 子任务: 开发 `context-injector`，在用户 Prompt 发送前，调用 Worker 的 Search API。
    - [ ] 子任务: 将检索到的 Context 格式化为 Gemini 易读的格式（System Prompt 或 User Message 前缀）。

- [ ] 任务: 实现观察捕获 (Observation Capture)
    - [ ] 子任务: 拦截 Gemini 的工具执行结果和对话历史。
    - [ ] 子任务: 异步发送捕获的数据到 Worker Service。

- [ ] 任务: Conductor - 用户手册验证 '阶段 3: Gemini 适配器开发' (按此协议执行)

## 阶段 4: 整合与品牌化 (Integration & Branding)
完成端到端的整合测试。

- [ ] 任务: 集成测试
    - [ ] 子任务: 在本地运行 Gemini CLI，模拟完整的开发流程（提问 -> 工具使用 -> 结束）。
    - [ ] 子任务: 重启 Gemini，询问上次操作，验证记忆是否生效。

- [ ] 任务: 更新文档与品牌
    - [ ] 子任务: 更新 `README.md`，添加 Gemini CLI 的安装和使用指南。
    - [ ] 子任务: (可选) 如果需要，调整 Web Viewer 的 UI 以适配通用品牌。

- [ ] 任务: Conductor - 用户手册验证 '阶段 4: 整合与品牌化' (按此协议执行)
