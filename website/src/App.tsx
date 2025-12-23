import { motion } from 'framer-motion';
import { Github, Brain, Zap, Layers, Globe, Database } from 'lucide-react';
import { SEO } from './components/SEO';

function App() {
  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "持久化记忆",
      desc: "让 AI 拥有长期记忆，不再因为关闭窗口而丢失上下文。"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "跨平台同步",
      desc: "在 Claude、Gemini 和 Codex 之间无缝同步记忆状态。"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "极速响应",
      desc: "基于 TypeScript 和 Bun 构建，毫秒级上下文检索。"
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "上下文压缩",
      desc: "智能压缩冗长的对话历史，节省 Token 成本。"
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "本地优先",
      desc: "数据存储在本地文件系统，确保隐私安全。"
    },
    {
      icon: <Github className="w-6 h-6" />,
      title: "完全开源",
      desc: "AGPLv3 协议开源，欢迎社区贡献。"
    }
  ];

  return (
    <div className="min-h-screen text-white selection:bg-white/20">
      <SEO />
      
      {/* Hero Section */}
      <header className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 flex justify-center"
          >
            <img src="./logo.svg" alt="Claude Codex Gemini Mem Logo" className="w-32 h-32 drop-shadow-2xl" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            <span className="chrome-text">Claude Codex Gemini Mem</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            终极 AI 智能体持久记忆与上下文管理层。<br/>
            解决 AI "金鱼记忆" 的开源方案。
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex gap-4 justify-center"
          >
            <a 
              href="https://github.com/CHANGGELY/claude_codex_gemini_mem" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors"
            >
              <Github className="w-5 h-5" />
              View on GitHub
            </a>
          </motion.div>
        </div>
      </header>

      {/* SEO Targeted Section */}
      <section className="py-20 px-6 bg-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 chrome-text">如何让 AI 跨窗口记忆？</h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-8">
            这是许多开发者面临的共同难题。当我们在使用 Claude 或 Gemini 进行复杂开发时，
            一旦关闭窗口或开启新对话，之前的上下文就会丢失。
            <strong>Claude Codex Gemini Mem</strong> 正是为了解决这个问题而生。
            它作为一个 MCP (Model Context Protocol) Server，
            能够将 AI 的记忆持久化存储在本地，并在不同会话甚至不同模型之间无缝流转。
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-8"
              >
                <div className="mb-4 text-white/80">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-gray-500 border-t border-white/10">
        <p>© 2025 Claude Codex Gemini Mem. Released under AGPL-3.0.</p>
      </footer>
    </div>
  );
}

export default App;
