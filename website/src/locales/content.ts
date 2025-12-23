import { Brain, Cpu, Database, Globe, Layers, Zap } from 'lucide-react';
import React from 'react';

export interface Content {
  hero: {
    title: string;
    subtitle: string;
    cta: {
      text: string;
      url: string;
    };
  };
  features: {
    id: string;
    title: string;
    desc: string;
    iconName: 'Brain' | 'Globe' | 'Layers' | 'Database' | 'Zap' | 'Cpu';
    colSpan?: 1 | 2;
  }[];
  seo: {
    title: string;
    text: string;
  };
}

export const content: Record<'en' | 'zh', Content> = {
  en: {
    hero: {
      title: "Claude Codex Gemini Mem",
      subtitle: "The Ultimate Persistent Memory Layer for AI Agents. Stop context loss. Start building truly intelligent workflows.",
      cta: {
        text: "View on GitHub",
        url: "https://github.com/CHANGGELY/claude_codex_gemini_mem"
      }
    },
    features: [
      {
        id: 'feat-1',
        title: "Persistent Memory",
        desc: "Your AI never forgets. Context is preserved across sessions, windows, and even machine restarts.",
        iconName: 'Brain',
        colSpan: 2
      },
      {
        id: 'feat-2',
        title: "Multi-Model Sync",
        desc: "Unified state between Claude, Gemini, and Codex.",
        iconName: 'Globe'
      },
      {
        id: 'feat-3',
        title: "Context Compression",
        desc: "Intelligent summarization algorithms reduce token usage by up to 60% without losing semantic meaning.",
        iconName: 'Layers'
      },
      {
        id: 'feat-4',
        title: "Local First",
        desc: "Data lives on your machine. Privacy by design. No cloud dependency required.",
        iconName: 'Database'
      },
      {
        id: 'feat-5',
        title: "Lightning Fast",
        desc: "Built with Bun and optimized TypeScript for <10ms latency.",
        iconName: 'Zap'
      },
      {
        id: 'feat-6',
        title: "Agentic Workflow",
        desc: "Designed for autonomous agents that need to maintain state over long-running tasks.",
        iconName: 'Cpu',
        colSpan: 2
      }
    ],
    seo: {
      title: "How to enable cross-window memory for AI?",
      text: "Claude Codex Gemini Mem is an open-source solution based on the MCP protocol. It persistently stores AI context via the file system, solving the memory loss problem across different LLM sessions. It supports automated context compression and retrieval, serving as the infrastructure for advanced Agentic Workflows."
    }
  },
  zh: {
    hero: {
      title: "Claude Codex Gemini Mem",
      subtitle: "AI Agent 的终极持久化记忆层。告别上下文丢失，构建真正的智能工作流。",
      cta: {
        text: "查看 GitHub",
        url: "https://github.com/CHANGGELY/claude_codex_gemini_mem"
      }
    },
    features: [
      {
        id: 'feat-1',
        title: "持久化记忆",
        desc: "你的 AI 永远不会忘记。上下文在会话、窗口甚至机器重启之间完美保留。",
        iconName: 'Brain',
        colSpan: 2
      },
      {
        id: 'feat-2',
        title: "多模型同步",
        desc: "在 Claude、Gemini 和 Codex 之间实现统一的状态管理。",
        iconName: 'Globe'
      },
      {
        id: 'feat-3',
        title: "上下文压缩",
        desc: "智能摘要算法可减少高达 60% 的 Token 消耗，且不丢失语义。",
        iconName: 'Layers'
      },
      {
        id: 'feat-4',
        title: "本地优先",
        desc: "数据存储在本地。隐私设计。无需云端依赖。",
        iconName: 'Database'
      },
      {
        id: 'feat-5',
        title: "极速响应",
        desc: "基于 Bun 和优化的 TypeScript 构建，延迟 <10ms。",
        iconName: 'Zap'
      },
      {
        id: 'feat-6',
        title: "Agent 工作流",
        desc: "专为需要长期维护状态的自主 Agent 任务设计。",
        iconName: 'Cpu',
        colSpan: 2
      }
    ],
    seo: {
      title: "如何让 AI 跨窗口记忆？",
      text: "Claude Codex Gemini Mem 是一个基于 MCP 协议的开源解决方案。它通过文件系统持久化存储 AI 的上下文信息，解决了 LLM 在不同会话间丢失记忆的问题。支持自动化的上下文压缩与检索，是构建高级 Agentic Workflow 的基础设施。"
    }
  }
};

export const getIcon = (name: Content['features'][0]['iconName']) => {
  const icons = { Brain, Globe, Layers, Database, Zap, Cpu };
  const Icon = icons[name];
  return React.createElement(Icon, { size: 24 });
};
