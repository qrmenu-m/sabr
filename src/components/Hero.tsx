import React from 'react';

interface HeroProps {
  onScrollToMenu?: () => void;
  scrollOffset: number;
}

export const Hero: React.FC<HeroProps> = ({ scrollOffset }) => {
  // Точная формула из вашего скрипта: document.querySelector('h1').style.letterSpacing = (10 + scroll / 10) + 'px';
  const letterSpacing = 10 + scrollOffset / 10;
  const opacity = Math.max(0, 1 - scrollOffset / 550);
  const translateY = -scrollOffset * 0.45;

  return (
    <section 
      className="hero relative h-screen flex items-center justify-center text-center select-none"
      style={{ perspective: '1000px' }}
    >
      <div 
        className="flex items-center justify-center pointer-events-none will-change-transform"
        style={{
          transform: `translate3d(0, ${translateY}px, 0) translateZ(50px)`,
          opacity: opacity
        }}
      >
        <h1 
          className="font-bold uppercase select-none text-[#4a4a4a]"
          style={{ 
            fontSize: '5rem',
            letterSpacing: `${letterSpacing}px`,
            paddingLeft: `${letterSpacing}px`,
            color: 'var(--text)',
            fontFamily: "'Inter', sans-serif"
          }}
          data-parallax="0.2"
        >
          S A B R
        </h1>
      </div>
    </section>
  );
};
