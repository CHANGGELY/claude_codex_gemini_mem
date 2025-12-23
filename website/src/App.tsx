import React from 'react';
import { Github, Brain, Zap, Layers, Globe, Database, Terminal, Cpu } from 'lucide-react';
import { SEO } from './components/SEO';
import { A2UIRenderer, A2UIComponent } from './components/A2UIRenderer';

function App() {
  // Define content as an A2UI-compatible JSON Tree
  // This simulates the "Agent-to-User" protocol
  const pageContent: A2UIComponent[] = [
    {
      id: 'hero-section',
      type: 'hero',
      props: {
        title: "Claude Codex Gemini Mem",
        subtitle: "The Ultimate Persistent Memory Layer for AI Agents. Stop context loss. Start building truly intelligent workflows.",
        logo: "./logo.svg",
        cta: {
          text: "View on GitHub",
          url: "https://github.com/CHANGGELY/claude_codex_gemini_mem"
        }
      }
    },
    {
      id: 'features-grid',
      type: 'grid',
      props: {},
      children: [
        {
          id: 'feat-1',
          type: 'card',
          props: {
            title: "Persistent Memory",
            desc: "Your AI never forgets. Context is preserved across sessions, windows, and even machine restarts.",
            icon: <Brain size={24} />,
            colSpan: 2
          }
        },
        {
          id: 'feat-2',
          type: 'card',
          props: {
            title: "Multi-Model Sync",
            desc: "Unified state between Claude, Gemini, and Codex.",
            icon: <Globe size={24} />
          }
        },
        {
          id: 'feat-3',
          type: 'card',
          props: {
            title: "Context Compression",
            desc: "Intelligent summarization algorithms reduce token usage by up to 60% without losing semantic meaning.",
            icon: <Layers size={24} />
          }
        },
        {
          id: 'feat-4',
          type: 'card',
          props: {
            title: "Local First",
            desc: "Data lives on your machine. Privacy by design. No cloud dependency required.",
            icon: <Database size={24} />
          }
        },
        {
          id: 'feat-5',
          type: 'card',
          props: {
            title: "Lightning Fast",
            desc: "Built with Bun and optimized TypeScript for <10ms latency.",
            icon: <Zap size={24} />
          }
        },
        {
          id: 'feat-6',
          type: 'card',
          props: {
            title: "Agentic Workflow",
            desc: "Designed for autonomous agents that need to maintain state over long-running tasks.",
            icon: <Cpu size={24} />,
            colSpan: 2
          }
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen text-white selection:bg-white/20 pb-20">
      <SEO />
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10">
        {pageContent.map(component => (
          <A2UIRenderer key={component.id} component={component} />
        ))}

        {/* SEO Text Block (Kept for search engines, styled minimally) */}
        <div className="max-w-4xl mx-auto px-6 mt-20 opacity-60 hover:opacity-100 transition-opacity">
          <h2 className="text-2xl font-bold mb-4">如何让 AI 跨窗口记忆？</h2>
          <p className="text-gray-400 leading-relaxed">
            Claude Codex Gemini Mem 是一个基于 MCP 协议的开源解决方案。
            它通过文件系统持久化存储 AI 的上下文信息，解决了 LLM 在不同会话间丢失记忆的问题。
            支持自动化的上下文压缩与检索，是构建高级 Agentic Workflow 的基础设施。
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
