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
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="glass-card"
      style={{ textAlign: 'center', position: 'relative', overflow: 'hidden', minHeight: '450px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
    >
      {!isExploded ? (
        <>
          <div className="system-msg">Critical Alert: Love Overload</div>
          <h2 style={{ marginBottom: '10px' }}>Level 13: The Heart Bomb</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '30px' }}>
            Warning! This bomb is filled with too much affection. Tap it to release the pressure before it melts!
          </p>

          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={handleBombClick}>
            {/* Pulsing Aura */}
            <motion.div
              animate={{
                scale: [1, 1.2 + (clicks * 0.05), 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 1 / (1 + clicks * 0.1), repeat: Infinity }}
              style={{
                position: 'absolute',
                top: '-20%',
                left: '-20%',
                width: '140%',
                height: '140%',
                background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
                zIndex: -1,
                borderRadius: '50%'
              }}
            />

            <motion.div
              animate={{ 
                rotate: clicks % 2 === 0 ? [0, 5, -5, 0] : [0, -5, 5, 0],
                scale: 1 + (clicks * 0.05),
                filter: [
                  `drop-shadow(0 0 10px ${clicks > 10 ? '#ff3a71' : 'rgba(255,255,255,0.3)'})`,
                  `drop-shadow(0 0 30px ${clicks > 10 ? '#ff3a71' : 'rgba(255,255,255,0.5)'})`,
                  `drop-shadow(0 0 10px ${clicks > 10 ? '#ff3a71' : 'rgba(255,255,255,0.3)'})`
                ]
              }}
              transition={{ 
                rotate: { duration: 0.2, repeat: Infinity },
                scale: { type: 'spring', stiffness: 300 },
                filter: { duration: 1, repeat: Infinity }
              }}
            >
              <div style={{ position: 'relative' }}>
                {/* Glowing Background for the Bomb */}
                <div style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)', 
                  width: '100px', 
                  height: '100px', 
                  background: 'rgba(255, 77, 109, 0.1)', 
                  borderRadius: '50%', 
                  filter: 'blur(30px)',
                  zIndex: -1 
                }} />
                
                <Bomb 
                  size={150} 
                  color={clicks > 10 ? "#ff3a71" : "#ff85a1"} 
                  strokeWidth={1} 
                  style={{ filter: 'drop-shadow(0 0 20px rgba(255, 77, 109, 0.4))' }}
                />
                
                <div style={{ 
                  position: 'absolute', 
                  top: '55%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '10px',
                  borderRadius: '50%',
                  backdropFilter: 'blur(5px)'
                }}>
                   <Heart size={50} color="white" fill="white" style={{ opacity: Math.min(1, clicks / REQUIRED_CLICKS + 0.4) }} />
                </div>
              </div>
            </motion.div>

            {/* Tap Particles */}
            {particles.map(p => (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{ 
                  x: Math.cos(p.angle) * 100, 
                  y: Math.sin(p.angle) * 100,
                  opacity: 0,
                  scale: 0
                }}
                transition={{ duration: 0.8 }}
                style={{ position: 'absolute', top: '50%', left: '50%', pointerEvents: 'none' }}
              >
                <Heart size={15} color="var(--primary)" fill="var(--primary)" />
              </motion.div>
            ))}
          </div>

          <div style={{ width: '100%', maxWidth: '250px', marginTop: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>
              <span>PRESSURE</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <motion.div 
                animate={{ width: `${progress}%`, background: clicks > 10 ? "#ff3a71" : "#555" }}
                style={{ height: '100%' }}
              />
            </div>
          </div>
          <p style={{ marginTop: '20px', fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--primary-light)' }}>
            Tap rapidly! {REQUIRED_CLICKS - clicks} clicks remaining...
          </p>
        </>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 1] }}
            transition={{ duration: 1 }}
          >
            <Sparkles size={80} color="#ff3a71" style={{ marginBottom: '20px', filter: 'drop-shadow(0 0 20px var(--primary))' }} />
          </motion.div>
          
          <h1 style={{ color: 'white', fontSize: '2.5rem', textShadow: '0 0 30px var(--primary)', marginBottom: '10px' }}>BOOM!</h1>
          <h2 style={{ color: 'var(--primary-light)', marginBottom: '30px' }}>Love Explosion! ❤️✨</h2>
          
          <p style={{ fontSize: '1.2rem', color: 'white', maxWidth: '300px', margin: '0 auto' }}>
            The bomb couldn't handle your spark and exploded into pure affection!
          </p>

          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            {particles.map(p => (
              <motion.div
                key={p.id}
                initial={{ x: '50%', y: '50%', opacity: 1, scale: 0 }}
                animate={{ 
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: [1, 1, 0],
                  scale: [0, 1.5, 0.5],
                  rotate: Math.random() * 360
                }}
                transition={{ duration: 2 + Math.random() * 2 }}
                style={{ position: 'absolute' }}
              >
                <Heart size={p.size || 20} color="var(--primary)" fill="var(--primary)" style={{ filter: 'blur(1px)' }} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Background glitch effect when close to explosion */}
      {clicks > 12 && !isExploded && (
        <motion.div
          animate={{ opacity: [0, 0.2, 0] }}
          transition={{ duration: 0.1, repeat: Infinity }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'var(--primary)', zIndex: 0, pointerEvents: 'none' }}
        />
      )}
    </motion.div>
  );
};

export default Level13;
