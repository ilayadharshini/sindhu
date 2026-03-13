import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Target, Sparkles, Crosshair } from 'lucide-react';
import sindhuImg from '../assets/sindhu.jpeg';
import brittoImg from '../assets/britto.png';

const Level10 = ({ onNext, onPenalty }) => {
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [cupidY, setCupidY] = useState(50);
  
  const [renderTrigger, setRenderTrigger] = useState(0);
  const gameState = useRef({
    arrows: [],
    brittoY: 50,
    brittoDirection: 1,
    brittoSpeed: 1, // Will increase as score goes up
    particles: [],
    score: 0,
    gameOver: false,
    brittoHitColor: false
  });

  const arenaRef = useRef(null);
  
  const TARGETS_TO_WIN = 5;

  useEffect(() => {
    if (!started || gameOver) return;

    // Game loop
    const loop = setInterval(() => {
      let state = gameState.current;
      if (state.gameOver) return;

      // Move Britto
      state.brittoY += state.brittoDirection * state.brittoSpeed;
      if (state.brittoY > 85) {
        state.brittoDirection = -1;
      } else if (state.brittoY < 15) {
        state.brittoDirection = 1;
      }

      // Randomly change direction sometimes to be tricky
      if (Math.random() < 0.03) {
          state.brittoDirection *= -1;
      }

      if (state.brittoHitColor) {
          state.brittoHitColor = false; // reset color fast
      }

      // Move arrows
      state.arrows.forEach(a => a.x += 4);
      
      // Move particles
      state.particles.forEach(p => {
        p.life -= 1;
        p.x += p.vx;
        p.y += p.vy;
      });
      state.particles = state.particles.filter(p => p.life > 0);

      // Collisions
      for (let i = state.arrows.length - 1; i >= 0; i--) {
        let a = state.arrows[i];
        let hit = false;
        
        // Britto hitbox (x is around 85%)
        if (a.x >= 75 && a.x <= 95 && Math.abs(a.y - state.brittoY) < 15) {
            hit = true;
            state.score++;
            setScore(state.score);
            state.brittoHitColor = true;
            
            // Generate impact particles
            for(let k=0; k<15; k++) {
                state.particles.push({
                    id: Math.random(),
                    x: 85,
                    y: state.brittoY,
                    vx: (Math.random() - 0.5) * 6,
                    vy: (Math.random() - 0.5) * 6,
                    life: 25
                });
            }

            // Increase Britto's speed each time he gets hit!
            state.brittoSpeed += 0.4;
        }

        if (hit || a.x > 110) {
          state.arrows.splice(i, 1);
        }
      }

      setRenderTrigger(v => v + 1);

    }, 30);

    return () => clearInterval(loop);
  }, [started, gameOver]);

  // Check win/loss
  useEffect(() => {
    if (score >= TARGETS_TO_WIN && !gameOver) {
      setGameOver(true);
      gameState.current.gameOver = true;
      setTimeout(onNext, 2500);
    }
  }, [score, gameOver, onNext]);

  const handlePointerMove = (e) => {
    if (!arenaRef.current || gameOver) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    if (!clientY) return;
    const y = ((clientY - rect.top) / rect.height) * 100;
    setCupidY(Math.max(5, Math.min(95, y)));
  };

  const fire = () => {
    if (!started || gameOver) return;
    
    // Allow up to 3 arrows on screen at once
    if (gameState.current.arrows.length > 2) return;

    gameState.current.arrows.push({
      id: Date.now(),
      x: 20, 
      y: cupidY
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card full-arena-card" style={{ background: '#0a0508', border: '1px solid rgba(255, 77, 109, 0.3)', padding: 0, overflow: 'hidden' }}>
      
      {/* Modern HUD Header */}
      <div style={{ padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 77, 109, 0.1)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255, 77, 109, 0.2)', position: 'relative', zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px var(--primary)' }}>
                <Crosshair size={24} color="white" />
            </div>
            <div>
                <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', letterSpacing: '1px' }}>CHASE BRITTO</h3>
                <p style={{ margin: 0, color: 'var(--primary-light)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Target is running!</p>
            </div>
        </div>
        <div style={{ textAlign: 'right' }}>
            <div style={{ color: 'white', fontWeight: '900', fontSize: '1.4rem', textShadow: '0 0 10px var(--primary)' }}>
                {score} / {TARGETS_TO_WIN}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                HITS REQUIRED
            </div>
        </div>
      </div>

      <div 
        className="shooter-arena" 
        ref={arenaRef} 
        onPointerMove={handlePointerMove}
        onClick={fire}
        style={{ 
          height: '450px', 
          background: 'radial-gradient(circle at 50% 50%, #1a0b12 0%, #050203 100%)', 
          cursor: 'crosshair', 
          overflow: 'hidden', 
          position: 'relative',
          touchAction: 'none'
        }}
      >
        {/* Dynamic Background Grid Lines */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'linear-gradient(rgba(255, 77, 109, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 77, 109, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 1 }} />

        {!started && !gameOver && (
          <motion.div initial={{ scale: 0.8, opacity: 0, x: "-50%", y: "-50%" }} animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%" }} style={{ position: 'absolute', top: '50%', left: '50%', textAlign: 'center', zIndex: 30, background: 'rgba(20, 5, 10, 0.8)', padding: '30px', borderRadius: '30px', border: '1px solid rgba(255, 77, 109, 0.3)', backdropFilter: 'blur(20px)', width: '80%', maxWidth: '300px' }}>
            <Heart size={50} color="var(--primary)" style={{ margin: '0 auto 15px', filter: 'drop-shadow(0 0 15px var(--primary))' }} />
            <h2 style={{ color: 'white', marginBottom: '10px' }}>Catch Britto</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '20px', fontSize: '0.9rem' }}>Britto is running away! Slide to chase him and tap to fire. Hit him {TARGETS_TO_WIN} times!</p>
            <button onClick={(e) => { e.stopPropagation(); setStarted(true); }} style={{ width: '100%', padding: '12px 0', fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Initialize</button>
          </motion.div>
        )}

        {gameOver && score >= TARGETS_TO_WIN && (
          <motion.div initial={{ opacity: 0, scale: 0.5, x: "-50%", y: "-50%" }} animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }} style={{ position: 'absolute', top: '50%', left: '50%', textAlign: 'center', zIndex: 30 }}>
            <Sparkles size={60} color="#00ff88" style={{ margin: '0 auto 10px', filter: 'drop-shadow(0 0 20px #00ff88)' }} />
            <h2 style={{ color: '#00ff88', fontSize: '2rem', letterSpacing: '3px', textShadow: '0 0 20px #00ff88', margin: 0 }}>BRITTO CAUGHT</h2>
            <p style={{ color: 'white', letterSpacing: '1px', marginTop: '10px' }}>You successfully pinned him down!</p>
          </motion.div>
        )}

        {/* Sindhu (Player) */}
        {(started || gameOver) && (
          <div style={{
            position: 'absolute',
            left: '10%',
            top: `${cupidY}%`,
            width: '60px',
            height: '60px',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
             <motion.div 
               animate={{ rotate: 360 }} 
               transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
               style={{ position: 'absolute', width: '80px', height: '80px', borderRadius: '50%', border: '1px dashed var(--primary)', opacity: 0.5 }} 
             />
             
             <div style={{
               width: '60px',
               height: '60px',
               borderRadius: '50%',
               overflow: 'hidden',
               border: '2px solid var(--primary)',
               boxShadow: '0 0 20px var(--primary)',
               position: 'relative',
               zIndex: 2,
             }}>
                <img src={sindhuImg} alt="Sindhu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             </div>
             
             {/* Targeting Laser */}
             <div style={{
               position: 'absolute',
               left: '40px',
               top: '50%',
               width: '100vw',
               height: '1px',
               background: 'linear-gradient(90deg, rgba(255, 77, 109, 0.4) 0%, transparent 100%)',
               zIndex: 1,
               transform: 'translateY(-50%)'
             }} />
          </div>
        )}

        {/* Britto (Target Running Away) */}
        {(started || (!started && !gameOver)) && (
          <div style={{
            position: 'absolute',
            left: '85%',
            top: `${gameState.current.brittoY}%`,
            width: '80px',
            height: '80px',
            transform: 'translate(-50%, -50%)',
            zIndex: 9,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} 
               transition={{ duration: 1, repeat: Infinity }}
               style={{ position: 'absolute', width: '100px', height: '100px', borderRadius: '50%', border: '2px dashed rgba(116, 235, 213, 0.5)' }} 
             />

            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              overflow: 'hidden',
              zIndex: 2,
              border: '3px solid',
              borderColor: gameState.current.brittoHitColor ? 'white' : 'rgba(116, 235, 213, 0.8)', // Flashes white on hit
              boxShadow: gameState.current.brittoHitColor ? '0 0 30px white' : '0 10px 30px rgba(0,0,0,0.6), inset 0 0 20px rgba(116, 235, 213, 0.5)',
              background: 'rgba(116, 235, 213, 0.2)',
              backdropFilter: 'blur(5px)',
              transition: 'all 0.1s'
            }}>
                <img src={brittoImg} alt="Britto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            
            {/* Health/Status text near Britto */}
            <div style={{ position: 'absolute', top: '-25px', color: '#74ebd5', fontWeight: 'bold', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                BRITTO_AI
            </div>
          </div>
        )}

        {/* Energy Arrows */}
        {gameState.current.arrows.map(a => (
          <div key={a.id} style={{
            position: 'absolute',
            left: `${a.x}%`,
            top: `${a.y}%`,
            width: '40px',
            height: '4px',
            background: '#fff',
            borderRadius: '2px',
            transform: 'translate(-50%, -50%)',
            zIndex: 8,
            pointerEvents: 'none',
            boxShadow: '0 0 10px #fff, 0 0 20px var(--primary), 0 0 30px var(--primary)'
          }}>
             <div style={{ position: 'absolute', right: '100%', top: 0, width: '60px', height: '100%', background: 'linear-gradient(90deg, transparent, var(--primary))', opacity: 0.8 }} />
          </div>
        ))}

        {/* Particle Explosions */}
        {gameState.current.particles.map(p => (
           <div key={p.id} style={{
               position: 'absolute',
               left: `${p.x}%`,
               top: `${p.y}%`,
               width: '4px',
               height: '4px',
               background: '#fff',
               borderRadius: '50%',
               boxShadow: '0 0 10px var(--primary)',
               opacity: p.life / 20
           }} />
        ))}
        
      </div>
    </motion.div>
  );
};

export default Level10;
