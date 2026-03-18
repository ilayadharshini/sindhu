import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bomb, Heart, Sparkles, Zap } from 'lucide-react';

const Level13 = ({ onNext }) => {
  const [clicks, setClicks] = useState(0);
  const [isExploded, setIsExploded] = useState(false);
  const [particles, setParticles] = useState([]);
  const REQUIRED_CLICKS = 15;

  const handleBombClick = () => {
    if (isExploded) return;
    
    setClicks(prev => prev + 1);
    
    // Create click particles
    const newParticles = Array.from({ length: 5 }).map(() => ({
      id: Math.random(),
      x: 0,
      y: 0,
      angle: Math.random() * Math.PI * 2,
      velocity: Math.random() * 10 + 5
    }));
    setParticles(prev => [...prev, ...newParticles]);

    if (clicks + 1 >= REQUIRED_CLICKS) {
      explode();
    }
  };

  const explode = () => {
    setIsExploded(true);
    // Create massive explosion particles
    const explosionParticles = Array.from({ length: 50 }).map(() => ({
      id: Math.random(),
      x: 0,
      y: 0,
      angle: Math.random() * Math.PI * 2,
      velocity: Math.random() * 20 + 10,
      size: Math.random() * 20 + 10
    }));
    setParticles(explosionParticles);
    
    setTimeout(() => {
      onNext();
    }, 4000);
  };

  // Clean up particles
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => {
        setParticles([]);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [particles]);

  const progress = (clicks / REQUIRED_CLICKS) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="glass-card"
      style={{ 
        textAlign: 'center', 
        position: 'relative', 
        overflow: 'hidden', 
        minHeight: '500px', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1a0b12 0%, #2d0b17 100%)',
        border: '5px solid #ff3a71',
        borderRadius: '50px',
        boxShadow: '0 30px 60px rgba(0,0,0,0.4), inset 0 0 100px rgba(255, 58, 113, 0.1)'
      }}
    >
      {!isExploded ? (
        <>
          <div style={{ position: 'absolute', top: '25px', left: '50%', transform: 'translateX(-50%)', width: '90%' }}>
            <motion.div 
              animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.98, 1.02, 0.98] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ background: 'rgba(255, 58, 113, 0.2)', padding: '8px 20px', borderRadius: '20px', display: 'inline-block', border: '1px solid rgba(255, 58, 113, 0.4)' }}
            >
              <span style={{ color: '#ff3a71', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>⚠️ Emotional Overload Detected</span>
            </motion.div>
          </div>

          <h2 style={{ color: 'white', fontSize: '2.2rem', fontFamily: 'cursive', marginBottom: '10px' }}>Level 13: Heart Chamber</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', marginBottom: '40px', maxWidth: '350px', fontWeight: 'bold' }}>
            The pressure is rising! Tap the crystal heart to release the pure affection! ✨
          </p>

          <div style={{ position: 'relative', cursor: 'pointer', perspective: '1000px' }} onClick={handleBombClick}>
            {/* Pulsing Core */}
            <motion.div
              animate={{
                scale: [1, 1.4 + (clicks * 0.08), 1],
                opacity: [0.2, 0.5, 0.2],
                backgroundColor: clicks > 10 ? '#ff3a71' : 'var(--primary)'
              }}
              transition={{ duration: 1 / (1 + clicks * 0.2), repeat: Infinity }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '180px',
                height: '180px',
                transform: 'translate(-50%, -50%)',
                filter: 'blur(40px)',
                zIndex: -1,
                borderRadius: '50%'
              }}
            />

            <motion.div
              style={{ position: 'relative', zIndex: 10 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              animate={{ 
                y: [0, -10, 0],
                rotate: clicks > 10 ? [0, 2, -2, 0] : 0,
                scale: 1 + (clicks * 0.06),
              }}
              transition={{ 
                y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 0.1, repeat: Infinity }
              }}
            >
              <div style={{ position: 'relative' }}>
                {/* Crystal Heart Effect */}
                <div style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)', 
                  width: '160px', 
                  height: '160px', 
                  background: `radial-gradient(circle, rgba(255, 77, 109, ${0.1 + clicks/20}) 0%, transparent 80%)`, 
                  borderRadius: '50%', 
                  filter: 'blur(20px)',
                  zIndex: -1 
                }} />
                
                <Heart 
                  size={160} 
                  color={clicks > 10 ? "#ff3a71" : "#ff85a1"} 
                  fill={clicks > 8 ? "#ff3a71" : "transparent"}
                  strokeWidth={2} 
                  style={{ filter: clicks > 10 ? 'drop-shadow(0 0 30px #ff3a71)' : 'drop-shadow(0 0 15px rgba(255, 77, 109, 0.4))', transition: 'all 0.3s' }}
                />
                
                {/* Sparkle overlay inside heart */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
                   <Zap size={clicks * 4} color="white" style={{ opacity: clicks / 15, filter: 'blur(2px)' }} />
                </div>
              </div>
            </motion.div>

            {/* Tap Particles */}
            {particles.map(p => (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{ 
                  x: Math.cos(p.angle) * 150, 
                  y: Math.sin(p.angle) * 150,
                  opacity: 0,
                  scale: 0,
                  rotate: 180
                }}
                transition={{ duration: 0.8 }}
                style={{ position: 'absolute', top: '50%', left: '50%', pointerEvents: 'none' }}
              >
                <div style={{ color: '#ff3a71', filter: 'drop-shadow(0 0 5px white)' }}>❤️</div>
              </motion.div>
            ))}
          </div>

          <div style={{ width: '100%', maxWidth: '300px', marginTop: '50px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.9rem', color: '#ff3a71', fontWeight: '900', letterSpacing: '1px' }}>CAPACITY</span>
              <span style={{ color: 'white', fontWeight: 'bold' }}>{Math.round(progress)}%</span>
            </div>
            <div style={{ height: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', overflow: 'hidden', padding: '3px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <motion.div 
                animate={{ width: `${progress}%`, background: `linear-gradient(90deg, #ff3a71, #ff85a1)` }}
                style={{ height: '100%', borderRadius: '15px' }}
              />
            </div>
          </div>
          
          <motion.p 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ marginTop: '25px', color: 'white', fontSize: '1.1rem', fontWeight: '900' }}
          >
            TAP FAST!! {REQUIRED_CLICKS - clicks} TO BURST!
          </motion.p>
        </>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 2, 1], rotate: [0, 360, 0] }}
            transition={{ duration: 1.5 }}
          >
            <Sparkles size={120} color="#ff3a71" style={{ marginBottom: '30px', filter: 'drop-shadow(0 0 40px #ff3a71)' }} />
          </motion.div>
          
          <h1 style={{ color: 'white', fontSize: '4rem', fontFamily: 'cursive', textShadow: '0 0 40px #ff3a71', marginBottom: '15px' }}>BOOM!</h1>
          <h2 style={{ color: '#ffcbd5', fontSize: '1.8rem', fontWeight: '900', letterSpacing: '3px' }}>LOVE EXPLOSION! 💖</h2>
          
          <p style={{ fontSize: '1.3rem', color: '#eee', maxWidth: '350px', margin: '20px auto', lineWeight: '1.6' }}>
            The heart couldn't contain all that love! It has showered the world in magic! ✨
          </p>

          {/* Cinematic Particles */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            {particles.map(p => (
              <motion.div
                key={p.id}
                initial={{ x: '50%', y: '50%', opacity: 1, scale: 0 }}
                animate={{ 
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: [1, 1, 0],
                  scale: [0, 1.8, 0],
                  rotate: Math.random() * 720
                }}
                transition={{ duration: 3 + Math.random() * 2 }}
                style={{ position: 'absolute' }}
              >
                <div style={{ fontSize: `${Math.random() * 40 + 20}px`, filter: 'drop-shadow(0 0 10px #ff3a71)' }}>
                    {['❤️', '💖', '✨', '🌸', '🎁'][Math.floor(Math.random() * 5)]}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Screen Glitch intensity */}
      {clicks > 12 && !isExploded && (
        <motion.div
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{ duration: 0.05, repeat: Infinity }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'white', zIndex: 0, pointerEvents: 'none' }}
        />
      )}
    </motion.div>
  );
};

export default Level13;
