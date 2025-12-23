import { useState, useEffect } from 'react';
import { Sun, Moon, Languages } from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from './components/SEO';
import { A2UIRenderer } from './components/A2UIRenderer';
import type { A2UIComponent } from './components/A2UIRenderer';
import { content, getIcon } from './locales/content';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
      if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    }
    return 'dark';
  });

  const [lang, setLang] = useState<'en' | 'zh'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lang');
      if (saved === 'en' || saved === 'zh') return saved;
      return 'zh';
    }
    return 'zh';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const toggleLang = () => setLang(prev => prev === 'zh' ? 'en' : 'zh');

  const t = content[lang];

  const pageContent: A2UIComponent[] = [
    {
      id: 'hero-section',
      type: 'hero',
      props: {
        title: t.hero.title,
        subtitle: t.hero.subtitle,
        logo: "./logo.svg",
        cta: t.hero.cta
      }
    },
    {
      id: 'features-grid',
      type: 'grid',
      props: {},
      children: t.features.map(f => ({
        id: f.id,
        type: 'card',
        props: {
          title: f.title,
          desc: f.desc,
          icon: getIcon(f.iconName),
          colSpan: f.colSpan
        }
      }))
    }
  ];

  return (
    <div className="page">
      <SEO />
      <div className="controls">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleLang} 
          className="control-btn"
          title={lang === 'zh' ? 'Switch to English' : '切换到中文'}
        >
          <Languages size={20} />
          <span className="control-label">{lang === 'zh' ? 'EN' : '中'}</span>
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme} 
          className="control-btn"
          title={theme === 'dark' ? 'Switch to Light Mode' : '切换到夜间模式'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>
      </div>

      <div className="bg-orbs">
        <div className="bg-orb bg-orb--tl" />
        <div className="bg-orb bg-orb--br" />
      </div>

      <div className="layer">
        {pageContent.map(component => (
          <A2UIRenderer key={component.id} component={component} />
        ))}

        <div className="seo-block">
          <h2 className="seo-title">{t.seo.title}</h2>
          <p className="seo-text">{t.seo.text}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
