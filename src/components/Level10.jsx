import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Target, Sparkles, Crosshair, Trophy } from 'lucide-react';
import sindhuImg from '../assets/sindhu.jpeg';
import brittoImg from '../assets/britto.png';

const Level10 = ({ onNext, onPenalty }) => {
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [cupidY, setCupidY] = useState(50);
  const [renderTrigger, setRenderTrigger] = useState(0);
  const arenaRef = useRef(null);
  
  // Game constant: Hits needed to progress
  const TARGETS_TO_WIN = 5;

  // Use a Ref for the fast-changing game state to avoid Re-renders every millisecond
  const gameState = useRef({
    arrows: [],         // Active projectiles
    brittoY: 50,        // Britto's current vertical position
    brittoDirection: 1, // 1 for down, -1 for up
    brittoSpeed: 1,     // Current movement speed
    particles: [],      // Impact debris particles
    score: 0,           // Current hit count
    gameOver: false,
    brittoHitColor: false
  });

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card full-arena-card" style={{ background: '#fff', border: '5px solid #ff9eb5', padding: 0, overflow: 'hidden', borderRadius: '40px' }}>
      
      {/* Premium Grass HUD */}
      <div style={{ padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(to right, #ff9eb5, #ffcbd5)', borderBottom: '5px solid #ff9eb5', position: 'relative', zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 15px rgba(255,58,113,0.2)' }}>
                <Crosshair size={28} color="#ff3a71" />
            </div>
            <div>
                <h3 style={{ margin: 0, color: '#ff3a71', fontSize: '1.4rem', fontFamily: 'cursive' }}>Catching Britto</h3>
                <p style={{ margin: 0, color: 'white', fontSize: '0.9rem', fontWeight: 'bold' }}>Hurry! He's too fast! 🌸</p>
            </div>
        </div>
        <div style={{ textAlign: 'right', background: 'white', padding: '8px 20px', borderRadius: '20px', boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.1)' }}>
            <div style={{ color: '#ff3a71', fontWeight: '900', fontSize: '1.6rem' }}>
                {score} <span style={{ fontSize: '1rem', color: '#ccc' }}>/ {TARGETS_TO_WIN}</span>
            </div>
        </div>
      </div>

      <div 
        className="shooter-arena" 
        ref={arenaRef} 
        onPointerMove={handlePointerMove}
        onClick={fire}
        style={{ 
          background: 'linear-gradient(to bottom, #a8e6cf 0%, #dcedc1 100%)', 
          cursor: 'crosshair', 
          overflow: 'hidden', 
          position: 'relative',
          touchAction: 'none'
        }}
      >
        {/* Garden Background Elements */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            {[...Array(15)].map((_, i) => (
               <div 
                 key={`grass-${i}`} 
                 style={{ 
                   position: 'absolute', 
                   bottom: `${Math.random() * 100}%`, 
                   left: `${Math.random() * 100}%`, 
                   fontSize: '1.5rem',
                   opacity: 0.1,
                   transform: `rotate(${Math.random() * 360}deg)`
                 }}
               >
                 🍀
               </div>
            ))}
            
            {/* Moving Petals */}
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={`petal-${i}`}
                animate={{ 
                    x: ['-5%', '105%'], 
                    y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                    rotate: [0, 360] 
                }}
                transition={{ duration: 15 + Math.random() * 10, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', fontSize: '1.2rem', opacity: 0.4 }}
              >
                🌸
              </motion.div>
            ))}
        </div>

        {!started && !gameOver && (
          <motion.div initial={{ scale: 0.8, opacity: 0, x: "-50%", y: "-50%" }} animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%" }} style={{ position: 'absolute', top: '50%', left: '50%', textAlign: 'center', zIndex: 30, background: 'rgba(255, 255, 255, 0.9)', padding: '40px', borderRadius: '40px', border: '5px solid #ff9eb5', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', width: '85%', maxWidth: '350px' }}>
            <Heart size={60} color="#ff3a71" fill="#ff3a71" style={{ margin: '0 auto 15px', filter: 'drop-shadow(0 0 15px #ff3a71)' }} />
            <h2 style={{ color: '#ff3a71', marginBottom: '10px', fontFamily: 'cursive', fontSize: '2rem' }}>Chase Him!</h2>
            <p style={{ color: '#666', marginBottom: '25px', fontSize: '1.1rem', fontWeight: 'bold' }}>Britto is making a run for it! <br/> Hit him {TARGETS_TO_WIN} times with Love Bolts to win! ❤️</p>
            <button onClick={(e) => { e.stopPropagation(); setStarted(true); }} style={{ width: '100%', padding: '18px 0', fontSize: '1.2rem', fontWeight: '900', background: '#ff3a71', borderRadius: '30px', boxShadow: '0 10px 20px rgba(255,58,113,0.3)' }}>START CHASE</button>
          </motion.div>
        )}

        {gameOver && score >= TARGETS_TO_WIN && (
          <motion.div initial={{ opacity: 0, scale: 0.5, x: "-50%", y: "-50%" }} animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }} style={{ position: 'absolute', top: '50%', left: '50%', textAlign: 'center', zIndex: 30, background: 'white', padding: '30px', borderRadius: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', border: '5px solid #00ff88' }}>
            <Trophy size={80} color="#00ff88" style={{ margin: '0 auto 15px', filter: 'drop-shadow(0 0 20px #00ff88)' }} />
            <h2 style={{ color: '#00cc66', fontSize: '2.5rem', fontFamily: 'cursive', margin: 0 }}>CAUGHT!</h2>
            <p style={{ color: '#555', fontWeight: 'bold', marginTop: '10px' }}>Britto has been successfully pinned down! 🥰</p>
          </motion.div>
        )}

        {/* Sindhu (Player) */}
        {(started || gameOver) && (
          <div style={{
            position: 'absolute',
            left: '10%',
            top: `${cupidY}%`,
            width: '70px',
            height: '70px',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            pointerEvents: 'none'
          }}>
             <div style={{
               width: '100%',
               height: '100%',
               borderRadius: '50%',
               overflow: 'hidden',
               border: '4px solid white',
               boxShadow: '0 10px 25px rgba(255,58,113,0.3)',
               position: 'relative',
               zIndex: 2,
             }}>
                <img src={sindhuImg} alt="Sindhu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             </div>
             {/* Target Aura */}
             <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ position: 'absolute', top: '-10%', left: '-10%', width: '120%', height: '120%', borderRadius: '50%', background: '#ff3a71', zIndex: 1 }} />
          </div>
        )}

        {/* Britto (Target) */}
        {(started || (!started && !gameOver)) && (
          <div style={{
            position: 'absolute',
            left: '85%',
            top: `${gameState.current.brittoY}%`,
            width: '90px',
            height: '90px',
            transform: 'translate(-50%, -50%)',
            zIndex: 9,
            pointerEvents: 'none'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              overflow: 'hidden',
              zIndex: 2,
              border: '4px solid',
              borderColor: gameState.current.brittoHitColor ? 'white' : '#74ebd5',
              boxShadow: gameState.current.brittoHitColor ? '0 0 40px white' : '0 15px 35px rgba(0,0,0,0.2)',
              background: 'white',
              transition: 'all 0.1s'
            }}>
                <img src={brittoImg} alt="Britto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {/* Speed Lines for Britto */}
            <div style={{ position: 'absolute', right: '100%', top: '50%', width: '40px', height: '2px', background: 'linear-gradient(90deg, transparent, #74ebd5)', opacity: 0.6 }} />
          </div>
        )}

        {/* Energy Heart Arrows */}
        {gameState.current.arrows.map(a => (
          <div key={a.id} style={{
            position: 'absolute',
            left: `${a.x}%`,
            top: `${a.y}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 8,
            pointerEvents: 'none'
          }}>
             <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.3 }}>
                 <Heart size={28} color="#ff3a71" fill="#ff3a71" style={{ filter: 'drop-shadow(0 0 15px #ff3a71)' }} />
             </motion.div>
             {/* Trail */}
             <div style={{ position: 'absolute', right: '50%', top: '50%', width: '40px', height: '10px', background: 'linear-gradient(90deg, transparent, rgba(255,58,113,0.4))', borderRadius: '10px', transform: 'translateY(-50%)' }} />
          </div>
        ))}

        {/* Heart Impact Particles */}
        {gameState.current.particles.map(p => (
           <div key={p.id} style={{
               position: 'absolute',
               left: `${p.x}%`,
               top: `${p.y}%`,
               width: '8px',
               height: '8px',
               background: '#ff3a71',
               borderRadius: '50%',
               boxShadow: '0 0 10px white',
               opacity: p.life / 25
           }}>
              <Heart size={8} color="#ff3a71" fill="#ff3a71" />
           </div>
        ))}
        
      </div>
    </motion.div>
  );
};

export default Level10;
