import React, { useState, useEffect } from 'react';

const FloatingHearts = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const items = ['❤️', '💖', '💗', '💓', '💞', '💕', '💘', '🌸', '✨'];
    const interval = setInterval(() => {
      setParticles(prev => [...prev.slice(-50), {
        id: Date.now() + Math.random(),
        char: items[Math.floor(Math.random() * items.length)],
        left: Math.random() * 100,
        size: Math.random() * 25 + 15,
        duration: Math.random() * 8 + 6,
        delay: Math.random() * 5
      }]);
    }, 4500); // Slower interval but we spawn more per tick or keep more alive
    
    // Actually, let's just make it spawn much faster for "more hearts"
    const fastInterval = setInterval(() => {
        setParticles(prev => [...prev.slice(-60), {
          id: Date.now() + Math.random(),
          char: items[Math.floor(Math.random() * items.length)],
          left: Math.random() * 100,
          size: Math.random() * 20 + 10,
          duration: Math.random() * 12 + 8,
          delay: 0
        }]);
      }, 600);

    return () => {
        clearInterval(interval);
        clearInterval(fastInterval);
    };
  }, []);

  return (
    <div className="particles-container">
      {particles.map(p => (
        <span 
          key={p.id} 
          className="floating-heart-particle"
          style={{ 
            left: `${p.left}%`, 
            fontSize: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`
          }}
        >
          {p.char}
        </span>
      ))}
    </div>
  );
};

export default FloatingHearts;
