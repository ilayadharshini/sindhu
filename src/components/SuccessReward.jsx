import React from 'react';
import { motion } from 'framer-motion';

const SuccessReward = ({ imagePath }) => {
  const flowers = Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 4,
    size: 15 + Math.random() * 30,
    rotation: Math.random() * 360
  }));

  const stars = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    size: 10 + Math.random() * 20
  }));

  return (
    <div style={{ position: 'relative', width: '100%', height: '380px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      {/* Shimmering Stars */}
      {stars.map((star) => (
        <motion.div
          key={`star-${star.id}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
          transition={{ duration: 1.5 + Math.random(), repeat: Infinity, delay: star.delay }}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            fontSize: `${star.size}px`,
            zIndex: 2,
            pointerEvents: 'none'
          }}
        >
          ✨
        </motion.div>
      ))}
      {/* Falling Flowers */}
      {flowers.map((flower) => (
        <motion.div
          key={flower.id}
          initial={{ y: -50, x: `${flower.x}%`, opacity: 0, rotate: 0 }}
          animate={{ 
            y: 400, 
            opacity: [0, 1, 1, 0],
            rotate: flower.rotation + 360
          }}
          transition={{ 
            duration: flower.duration, 
            repeat: Infinity, 
            delay: flower.delay,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            fontSize: `${flower.size}px`,
            zIndex: 10,
            pointerEvents: 'none'
          }}
        >
          {['🌸', '🌺', '🌻', '🌼', '🌷'][flower.id % 5]}
        </motion.div>
      ))}

      {/* Girl Avatar */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 100 }}
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          border: '8px solid white',
          boxShadow: '0 20px 50px rgba(255, 77, 109, 0.4)',
          overflow: 'hidden',
          background: 'white',
          zIndex: 5,
          position: 'relative'
        }}
      >
        <img 
          src={imagePath} 
          alt="Success Avatar" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      {/* Glow Effect */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          position: 'absolute',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,107,0.3) 0%, transparent 70%)',
          zIndex: 1
        }}
      />

      {/* Floating Word */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ 
          y: [-10, 10, -10],
          opacity: 1,
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 1 }
        }}
        style={{
          position: 'absolute',
          bottom: '10px',
          zIndex: 15,
          textAlign: 'center',
          width: '100%',
          pointerEvents: 'none'
        }}
      >
        {(() => {
          const compliments = [
            "YOU ARE THE\nBEST SISTER",
            "YOU ARE TRULY\nSPECIAL",
            "MY PARTNER\nIN CRIME",
            "ONE IN A\nMILLION",
            "ALWAYS MY\nFAVORITE"
          ];
          const text = compliments[Math.floor(Math.random() * compliments.length)];
          return (
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              margin: 0,
              background: 'linear-gradient(45deg, #ff3a71, #ff8da1, #ff3a71)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 10px 20px rgba(255, 58, 113, 0.2)',
              fontFamily: "'Playfair Display', serif",
              letterSpacing: '1px',
              textAlign: 'center',
              lineHeight: '1.1',
              whiteSpace: 'pre-line'
            }}>
              {text}
            </h1>
          );
        })()}
        <div style={{
          height: '4px',
          width: '60px',
          background: '#ff3a71',
          margin: '5px auto',
          borderRadius: '2px',
          boxShadow: '0 0 10px #ff3a71'
        }} />
      </motion.div>
    </div>
  );
};

export default SuccessReward;
