import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, CloudRain, Sparkles, User, Trophy } from 'lucide-react';
import sindhuImg from '../assets/sindhu.jpeg';

const Level12 = ({ onNext, onPenalty }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameState, setGameState] = useState('playing'); // playing, won
  const [score, setScore] = useState(0);
  const [basketX, setBasketX] = useState(50);
  const [highScore, setHighScore] = useState(0);
  
  const WIN_SCORE = 20;
  const arenaRef = useRef(null);
  
  const internalState = useRef({
    items: [],
    lastTime: 0,
    score: 0,
    active: false
  });

  const [renderItems, setRenderItems] = useState([]);

  useEffect(() => {
    if (!gameStarted || gameState === 'won') return;

    internalState.current.active = true;
    let animationFrame;

    const gameLoop = (time) => {
      if (!internalState.current.active) return;

      const deltaTime = time - internalState.current.lastTime;
      internalState.current.lastTime = time;

      // Spawn items
      if (Math.random() < 0.05) {
        const isHeart = Math.random() > 0.2;
        internalState.current.items.push({
          id: Math.random(),
          x: Math.random() * 90 + 5,
          y: -10,
          speed: Math.random() * 0.2 + 0.1,
          type: isHeart ? 'heart' : 'obstacle',
          rotation: Math.random() * 360
        });
      }

      // Move items
      internalState.current.items.forEach(item => {
        item.y += item.speed * (deltaTime || 16);
        item.rotation += 2;
      });

      // Collision detection
      const newItems = [];
      internalState.current.items.forEach(item => {
        let caught = false;
        if (item.y > 85 && item.y < 95) {
           if (Math.abs(item.x - basketX) < 15) {
             caught = true;
             if (item.type === 'heart') {
               internalState.current.score += 1;
               setScore(internalState.current.score);
             } else {
               internalState.current.score = Math.max(0, internalState.current.score - 2);
               setScore(internalState.current.score);
             }
           }
        }

        if (!caught && item.y < 110) {
          newItems.push(item);
        }
      });

      internalState.current.items = newItems;
      setRenderItems([...newItems]);

      if (internalState.current.score >= WIN_SCORE) {
        setGameState('won');
        internalState.current.active = false;
        setTimeout(onNext, 3000);
      }

      animationFrame = requestAnimationFrame(gameLoop);
    };

    animationFrame = requestAnimationFrame(gameLoop);

    return () => {
      internalState.current.active = false;
      cancelAnimationFrame(animationFrame);
    };
  }, [gameStarted, gameState, basketX, onNext]);

  const handlePointerMove = (e) => {
    if (!arenaRef.current || gameState === 'won') return;
    const rect = arenaRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    if (clientX === undefined) return;
    const x = ((clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(10, Math.min(90, x)));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="glass-card full-arena-card"
      style={{ padding: 0, overflow: 'hidden', background: '#0f050a' }}
    >
      {/* Game Header */}
      <div style={{ padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 77, 109, 0.1)', borderBottom: '1px solid rgba(255, 77, 109, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Heart size={20} color="var(--primary)" fill="var(--primary)" />
          <span style={{ color: 'white', fontWeight: 'bold' }}>Heart Catcher</span>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Score</div>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>{score}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Goal</div>
            <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>{WIN_SCORE}</div>
          </div>
        </div>
      </div>

      <div 
        ref={arenaRef}
        onPointerMove={handlePointerMove}
        style={{ 
          height: '400px', 
          position: 'relative', 
          background: 'radial-gradient(circle at 50% 100%, #200a15 0%, #050203 100%)',
          cursor: 'none',
          touchAction: 'none'
        }}
      >
        {/* Background Sparkles */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
           {[...Array(20)].map((_, i) => (
             <motion.div
               key={i}
               animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
               transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
               style={{
                 position: 'absolute',
                 left: `${Math.random() * 100}%`,
                 top: `${Math.random() * 100}%`,
                 width: '2px',
                 height: '2px',
                 background: 'white',
                 borderRadius: '50%',
                 boxShadow: '0 0 5px white'
               }}
             />
           ))}
        </div>

        {!gameStarted && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 100, width: '80%' }}>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <Sparkles size={48} color="var(--primary)" style={{ marginBottom: '15px' }} />
              <h2 style={{ color: 'white', textShadow: '0 0 10px var(--primary)' }}>Level 12: Catch the Love</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Britto is sending hearts! Move your avatar to catch them. Avoid the dark clouds!
              </p>
              <button 
                onClick={() => setGameStarted(true)}
                style={{ background: 'var(--primary)', color: 'white', padding: '12px 30px', borderRadius: '25px', fontWeight: 'bold', border: 'none', boxShadow: '0 0 20px rgba(255, 58, 113, 0.4)' }}
              >
                Start Game
              </button>
            </motion.div>
          </div>
        )}

        <AnimatePresence>
          {gameState === 'won' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }} 
              animate={{ opacity: 1, scale: 1 }}
              style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 100 }}
            >
              <Trophy size={60} color="#ffd700" style={{ filter: 'drop-shadow(0 0 20px #ffd700)' }} />
              <h2 style={{ color: 'white', fontSize: '2rem', margin: '10px 0' }}>Perfect!</h2>
              <p style={{ color: '#00ff88', fontWeight: 'bold' }}>You've captured all the love!</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Falling Items */}
        {renderItems.map(item => (
          <div 
            key={item.id}
            style={{
              position: 'absolute',
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
              pointerEvents: 'none'
            }}
          >
            {item.type === 'heart' ? (
              <Heart size={24} color="var(--primary)" fill="var(--primary)" style={{ filter: 'drop-shadow(0 0 10px var(--primary))' }} />
            ) : (
              <CloudRain size={28} color="#444" style={{ filter: 'drop-shadow(0 0 5px #000)' }} />
            )}
          </div>
        ))}

        {/* Player Avatar */}
        <div 
          style={{
            position: 'absolute',
            left: `${basketX}%`,
            bottom: '20px',
            transform: 'translateX(-50%)',
            width: '70px',
            height: '70px',
            zIndex: 10
          }}
        >
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Glow effect */}
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ position: 'absolute', top: '-10%', left: '-10%', width: '120%', height: '120%', borderRadius: '50%', background: 'var(--primary)', filter: 'blur(15px)', zIndex: -1 }}
            />
            
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '2px solid var(--primary)', overflow: 'hidden', boxShadow: '0 0 20px var(--primary)' }}>
              <img src={sindhuImg} alt="Sindhu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: 'white', fontSize: '0.6rem', padding: '2px 8px', borderRadius: '10px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>
              YOU
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '15px', textAlign: 'center', background: 'rgba(0,0,0,0.3)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
        Tip: Slide or move your mouse to catch hearts. Dark clouds reduce score!
      </div>
    </motion.div>
  );
};

export default Level12;
