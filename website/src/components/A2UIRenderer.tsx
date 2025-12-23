import { ReactNode } from 'react';
import { motion } from 'framer-motion';

// A2UI-inspired Protocol Types
export type A2UIComponentType = 'card' | 'hero' | 'grid' | 'text' | 'button';

export interface A2UIComponent {
  id: string;
  type: A2UIComponentType;
  props: Record<string, any>;
  children?: A2UIComponent[];
}

export interface A2UIRendererProps {
  component: A2UIComponent;
}

// 1. Hero Component
const HeroRenderer = ({ title, subtitle, cta, logo }: any) => (
  <div className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center z-10">
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mb-8 relative"
    >
      <div className="absolute inset-0 bg-white/10 blur-[60px] rounded-full" />
      <img src={logo} alt="Logo" className="w-32 h-32 relative z-10 drop-shadow-2xl" />
    </motion.div>
    
    <motion.h1 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="text-6xl md:text-8xl font-bold mb-6 tracking-tighter"
    >
      <span className="chrome-text">{title}</span>
    </motion.h1>
    
    <motion.p 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
    >
      {subtitle}
    </motion.p>
    
    <motion.button
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ delay: 0.6 }}
      onClick={() => window.open(cta.url, '_blank')}
      className="group relative px-8 py-3 bg-white text-black rounded-full font-bold text-lg overflow-hidden"
    >
      <span className="relative z-10 flex items-center gap-2">
        {cta.text}
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.button>
  </div>
);

// 2. Bento Grid Item (Card)
const CardRenderer = ({ title, desc, icon, colSpan = 1 }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`glass-panel p-8 rounded-3xl h-full flex flex-col justify-between hover:border-white/20 transition-colors ${colSpan === 2 ? 'md:col-span-2' : ''}`}
  >
    <div className="mb-6">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 mb-4 text-white">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-2 text-white/90">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

// 3. Grid Container
const GridRenderer = ({ children }: { children: ReactNode }) => (
  <div className="max-w-7xl mx-auto px-6 py-20">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
      {children}
    </div>
  </div>
);

// Main Recursive Renderer
export const A2UIRenderer = ({ component }: A2UIRendererProps) => {
  const { type, props, children } = component;

  switch (type) {
    case 'hero':
      return <HeroRenderer {...props} />;
    case 'grid':
      return (
        <GridRenderer>
          {children?.map(child => (
            <A2UIRenderer key={child.id} component={child} />
          ))}
        </GridRenderer>
      );
    case 'card':
      return <CardRenderer {...props} />;
    default:
      return null;
  }
};
