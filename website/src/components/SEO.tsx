import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export function SEO({ 
  title = "Claude Codex Gemini Mem - 跨窗口 AI 记忆终极方案", 
  description = "如何让 AI 跨窗口记忆？使用 Claude Codex Gemini Mem，为您的 AI 智能体提供持久化、跨平台的上下文管理能力。支持 Claude, Gemini, Codex。",
  keywords = "如何让 ai 跨窗口记忆, ai 跨窗口记忆, ai memory, claude memory, gemini context, persistent context, mcp server"
}: SEOProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Helmet>
  );
}
