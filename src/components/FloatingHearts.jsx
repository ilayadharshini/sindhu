import React, { useState, useEffect } from 'react';

const FloatingHearts = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const items = ['❤️', '💖', '💗', '💓', '💞', '💕', '💘', '🌸', '🌺', '🌻', '🌼', '🌷', '🥀', '✨', '🌸', '🌺'];
    
    // Pre-populate background on load
    const initialParticles = Array.from({ length: 120 }).map((_, i) => ({
        id: i,
        char: items[Math.floor(Math.random() * items.length)],
        left: Math.random() * 100,
        bottom: Math.random() * 100, // Randomized starting vertical position
        size: Math.random() * 25 + 12,
        duration: Math.random() * 15 + 10,
        delay: -Math.random() * 30 // Negative delay so they are mid-animation
    }));
    setParticles(initialParticles);

    const spawnInterval = setInterval(() => {
        setParticles(prev => {
          const newParticle = {
            id: Date.now() + Math.random(),
            char: items[Math.floor(Math.random() * items.length)],
            left: Math.random() * 100,
            bottom: -5, // Start below viewport
            size: Math.random() * 25 + 12,
            duration: Math.random() * 15 + 10,
            delay: 0
          };
          return [...prev.slice(-150), newParticle]; // Keep up to 150 particles
        });
      }, 350);

    return () => clearInterval(spawnInterval);
  }, []);

  return (
    <div className="particles-container">
      {particles.map(p => (
        <span 
          key={p.id} 
          className="floating-heart-particle"
          style={{ 
            left: `${p.left}%`, 
            bottom: `${p.bottom}%`,
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
