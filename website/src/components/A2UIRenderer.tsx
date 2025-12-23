import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

export type A2UIComponentType = 'card' | 'hero' | 'grid';

export interface A2UIHeroProps {
  title: string;
  subtitle: string;
  cta: {
    text: string;
    url: string;
  };
  logo: string;
}

export interface A2UICardProps {
  title: string;
  desc: string;
  icon: ReactNode;
  colSpan?: 1 | 2;
}

export interface A2UIHeroComponent {
  id: string;
  type: 'hero';
  props: A2UIHeroProps;
}

export interface A2UICardComponent {
  id: string;
  type: 'card';
  props: A2UICardProps;
}

export interface A2UIGridComponent {
  id: string;
  type: 'grid';
  props: Record<string, never>;
  children: A2UIComponent[];
}

export type A2UIComponent = A2UIHeroComponent | A2UIGridComponent | A2UICardComponent;

export interface A2UIRendererProps {
  component: A2UIComponent;
}
const HeroRenderer = ({ title, subtitle, cta, logo }: A2UIHeroProps) => (
  <div className="hero">
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="hero-logo"
    >
      <div className="hero-logo-glow" />
      <img src={logo} alt="Logo" className="hero-logo-img" />
    </motion.div>
    
    <motion.h1 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="hero-title"
    >
      <span className="chrome-text">{title}</span>
    </motion.h1>
    
    <motion.p 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="hero-subtitle"
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
      className="cta-button"
    >
      <span className="cta-content">
        {cta.text}
        <span className="cta-arrow">→</span>
      </span>
    </motion.button>
  </div>
);

const CardRenderer = ({ title, desc, icon, colSpan = 1 }: A2UICardProps) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`glass-panel card ${colSpan === 2 ? 'card--span2' : ''}`}
  >
    <div>
      <div className="card-icon">
        {icon}
      </div>
      <h3 className="card-title">{title}</h3>
      <p className="card-desc">{desc}</p>
    </div>
  </motion.div>
);

const GridRenderer = ({ children }: { children: ReactNode }) => (
  <section className="bento-section">
    <div className="container">
      <div className="bento-grid">{children}</div>
    </div>
  </section>
);

export const A2UIRenderer = ({ component }: A2UIRendererProps) => {
  switch (component.type) {
    case 'hero':
      return <HeroRenderer {...component.props} />;
    case 'grid':
      return (
        <GridRenderer>
          {component.children.map(child => (
            <A2UIRenderer key={child.id} component={child} />
          ))}
        </GridRenderer>
      );
    case 'card':
      return <CardRenderer {...component.props} />;
    default:
      return null;
  }
};
