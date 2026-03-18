import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Cloud, Sparkles, Trophy, Info, Star } from 'lucide-react';
import sindhuImg from '../assets/sindhu.jpeg';

const Level12 = ({ onNext, onPenalty }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameState, setGameState] = useState('playing'); // playing, won
  const [score, setScore] = useState(0);
  const [basketX, setBasketX] = useState(50);
  
  const WIN_SCORE = 15; // Slightly easier
  const arenaRef = useRef(null);
  
  const internalState = useRef({
    items: [],
    lastTime: 0,
    score: 0,
    active: false,
    combo: 0
  });

  const [renderItems, setRenderItems] = useState([]);
  const [pops, setPops] = useState([]);
  const [shake, setShake] = useState(false);
  const [negativeFlash, setNegativeFlash] = useState(false);
  const [comboText, setComboText] = useState('');
  const [boomText, setBoomText] = useState('');

  useEffect(() => {
    if (!gameStarted || gameState === 'won') return;

    internalState.current.active = true;
    let animationFrame;

    const gameLoop = (time) => {
      if (!internalState.current.active) return;

      const deltaTime = time - internalState.current.lastTime;
      internalState.current.lastTime = time;

      // Spawn items - Increased rate
      if (Math.random() < 0.12) { 
        const isObstacle = Math.random() < 0.12; 
        const isGolden = !isObstacle && Math.random() < 0.08; 
        
        internalState.current.items.push({
          id: Math.random(),
          x: Math.random() * 88 + 6,
          y: -15,
          speed: isObstacle ? (Math.random() * 0.1 + 0.07) : (Math.random() * 0.14 + 0.12),
          type: isObstacle ? 'obstacle' : (isGolden ? 'golden' : 'heart'),
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
          sway: Math.random() * 0.1,
          scale: isGolden ? 1.4 : (0.7 + Math.random() * 0.6),
          color: isObstacle ? '#ff4d00' : (isGolden ? '#FFD700' : (Math.random() > 0.5 ? '#ff4d6d' : '#ff758f'))
        });
      }

      // Move items
      internalState.current.items.forEach(item => {
        item.y += item.speed * (deltaTime || 16);
        item.rotation += item.rotationSpeed;
        item.x += Math.sin(item.y / 20) * 0.6; 
      });

      // Collision detection
      const newItems = [];
      const colWidth = 14; 
      internalState.current.items.forEach(item => {
        let caught = false;
        if (item.y > 78 && item.y < 94) {
           if (Math.abs(item.x - basketX) < colWidth) {
             caught = true;
             if (item.type !== 'obstacle') {
               const points = item.type === 'golden' ? 2 : 1;
               internalState.current.score += points;
               internalState.current.combo += 1;
               setScore(internalState.current.score);
               spawnPops(item.x, item.y, item.color);
               
               if (item.type === 'golden') {
                 setComboText(`GOLDEN +2!`);
                 setTimeout(() => setComboText(''), 1000);
               } else if (internalState.current.combo % 5 === 0) {
                 setComboText(`COMBO x${internalState.current.combo}!`);
                 setTimeout(() => setComboText(''), 1000);
               }
             } else {
               // Firecracker Boom
               internalState.current.score = Math.max(0, internalState.current.score - 1);
               internalState.current.combo = 0;
               setScore(internalState.current.score);
               
               spawnPops(item.x, item.y, '#ff4400', true); 
               setShake(true);
               setNegativeFlash(true);
               setBoomText('POP! 🧨');
               onPenalty && onPenalty();
               
               setTimeout(() => {
                 setShake(false);
                 setNegativeFlash(false);
                 setBoomText('');
               }, 400);
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
        setTimeout(onNext, 3500);
      }

      animationFrame = requestAnimationFrame(gameLoop);
    };

    const spawnPops = (x, y, color, isExplosive = false) => {
      const count = isExplosive ? 35 : 15;
      const newPops = Array.from({ length: count }).map(() => ({
        id: Math.random(),
        x,
        y,
        vx: (Math.random() - 0.5) * (isExplosive ? 14 : 8),
        vy: (Math.random() - 0.5) * (isExplosive ? 14 : 8),
        color,
        size: isExplosive ? (Math.random() * 12 + 6) : (Math.random() * 6 + 4)
      }));
      setPops(prev => [...prev.slice(-60), ...newPops]);
      setTimeout(() => {
        setPops(current => current.filter(p => !newPops.includes(p)));
      }, 700);
    };

    animationFrame = requestAnimationFrame(gameLoop);

    return () => {
      internalState.current.active = false;
      cancelAnimationFrame(animationFrame);
    };
  }, [gameStarted, gameState, basketX, onNext, onPenalty]);

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
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="glass-card full-arena-card"
      style={{ 
        padding: 0, 
        overflow: 'hidden', 
        background: '#fff0f3', 
        border: '8px solid rgba(255, 255, 255, 0.8)', 
        borderRadius: '44px',
        boxShadow: '0 30px 60px rgba(255, 77, 109, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.5)',
        position: 'relative'
      }}
    >
      {/* Header HUD */}
      <div style={{ 
        padding: '25px 35px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: 'rgba(255, 255, 255, 0.95)', 
        borderBottom: '4px solid #ffdeeb',
        backdropFilter: 'blur(10px)',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            borderRadius: '18px', 
            background: 'linear-gradient(135deg, #ff4d6d, #ff85a1)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 8px 15px rgba(255, 77, 109, 0.3)'
          }}>
            <Heart size={28} color="white" fill="white" />
          </div>
          <div>
            <h2 style={{ color: '#ff4d6d', margin: 0, fontSize: '1.6rem', fontFamily: 'Outfit, sans-serif', fontWeight: 900, letterSpacing: '-0.5px' }}>Heart Catcher</h2>
            <div style={{ color: '#ff85a1', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Level 12 • Blissful Bloom</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.9rem', color: '#ff4d6d', fontWeight: 800 }}>GOAL: {WIN_SCORE}</span>
            <div style={{ 
                padding: '8px 20px', 
                background: '#ff4d6d', 
                color: 'white', 
                borderRadius: '20px',
                fontWeight: 900,
                fontSize: '1.4rem',
                boxShadow: '0 10px 20px rgba(255, 77, 109, 0.3)',
                minWidth: '70px',
                textAlign: 'center'
            }}>
              {score}
            </div>
          </div>
          <div style={{ width: '120px', height: '6px', background: '#ffeef2', borderRadius: '3px', overflow: 'hidden' }}>
            <motion.div 
              animate={{ width: `${(score / WIN_SCORE) * 100}%` }}
              style={{ height: '100%', background: 'linear-gradient(to right, #ff85a1, #ff4d6d)' }}
            />
          </div>
        </div>
      </div>

      <div 
        ref={arenaRef}
        onPointerMove={handlePointerMove}
        className="shooter-arena"
        style={{ 
          position: 'relative', 
          background: 'linear-gradient(180deg, #ffc2d1 0%, #ffe5ec 40%, #c1f2e1 100%)',
          cursor: gameStarted && gameState === 'playing' ? 'none' : 'default',
          touchAction: 'none',
          overflow: 'hidden'
        }}
      >
        {/* Dynamic Background Elements */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
           {/* Moving Clouds */}
           {[...Array(5)].map((_, i) => (
             <motion.div
               key={`cloud-${i}`}
               initial={{ x: `${i * 30}%`, y: `${10 + (i % 3) * 15}%`, opacity: 0.4 }}
               animate={{ x: ['-20%', '120%'] }}
               transition={{ duration: 25 + i * 10, repeat: Infinity, ease: 'linear' }}
               style={{ position: 'absolute' }}
             >
               <Cloud size={60 + (i * 20)} color="white" fill="white" style={{ filter: 'blur(2px)' }} />
             </motion.div>
           ))}

           {/* Distant Hills */}
           <div style={{ position: 'absolute', bottom: '0', left: '-10%', width: '60%', height: '35%', background: 'linear-gradient(to top, #7ed492, #a8e6cf)', borderRadius: '100% 100% 0 0', opacity: 0.8, filter: 'blur(1px)' }} />
           <div style={{ position: 'absolute', bottom: '0', right: '-15%', width: '70%', height: '45%', background: 'linear-gradient(to top, #66bb6a, #9ccc65)', borderRadius: '100% 100% 0 0', opacity: 0.7, filter: 'blur(1px)' }} />
           
           {/* Detailed Garden Floor */}
           <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '120px', background: 'linear-gradient(to top, #4db6ac, transparent)', opacity: 0.3 }} />
           
           {[...Array(30)].map((_, i) => (
              <motion.div 
                key={i} 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
                style={{ 
                  position: 'absolute', 
                  bottom: `${Math.random() * 20}%`, 
                  left: `${Math.random() * 100}%`,
                  fontSize: `${1 + Math.random()}rem`,
                  filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.1))`
                }}
              >
                {['🌷', '🌻', '🌼', '🌹', '🌿', '🌱'][i % 6]}
              </motion.div>
           ))}
           
           {/* Floating Sparkles */}
           {[...Array(12)].map((_, i) => (
             <motion.div
              key={`sparkle-${i}`}
              animate={{ 
                y: [0, -40, 0],
                opacity: [0.2, 0.6, 0.2],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{ duration: 3 + Math.random() * 4, repeat: Infinity }}
              style={{ position: 'absolute', top: `${Math.random() * 80}%`, left: `${Math.random() * 100}%` }}
             >
               <Sparkles size={16} color="#ffdeeb" />
             </motion.div>
           ))}
        </div>

        <motion.div
           animate={shake ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
           transition={{ duration: 0.3 }}
           style={{ width: '100%', height: '100%', position: 'absolute' }}
        >
           {/* Dark Negative Flash */}
           <AnimatePresence>
             {negativeFlash && (
               <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 0.5 }} 
                 exit={{ opacity: 0 }} 
                 style={{ position: 'absolute', inset: 0, background: 'black', zIndex: 100, pointerEvents: 'none' }}
               />
             )}
           </AnimatePresence>

           {/* Combo / Boom Text Overlay */}
           <AnimatePresence>
             {(comboText || boomText) && (
               <motion.div
                 key={comboText || boomText}
                 initial={{ opacity: 0, scale: 0.5, y: 120 }}
                 animate={{ 
                    opacity: 1, 
                    scale: boomText ? 2.5 : 1.5, 
                    y: 60,
                    color: boomText ? '#000' : '#ff4d6d'
                 }}
                 exit={{ opacity: 0, scale: 3, y: -20 }}
                 style={{ 
                   position: 'absolute', 
                   width: '100%', 
                   textAlign: 'center', 
                   fontWeight: 900, 
                   fontSize: '2rem', 
                   textShadow: boomText ? '0 0 20px #cc0000' : '0 0 20px white', 
                   zIndex: 110 
                 }}
               >
                 {boomText || comboText}
               </motion.div>
             )}
           </AnimatePresence>

          {/* Render Pops */}
          {pops.map(p => (
            <motion.div
              key={p.id}
              initial={{ x: `${p.x}%`, y: `${p.y}%`, scale: 1, opacity: 1 }}
              animate={{ x: `${p.x + p.vx * 3}%`, y: `${p.y + p.vy * 3}%`, scale: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ 
                position: 'absolute', 
                width: p.size, 
                height: p.size, 
                background: p.color, 
                borderRadius: '50%', 
                zIndex: 30, 
                boxShadow: `0 0 15px ${p.color}, 0 0 5px white` 
              }}
            />
          ))}

          {/* Falling Items */}
          {renderItems.map(item => (
            <motion.div 
              key={item.id}
              style={{
                position: 'absolute',
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale})`,
                pointerEvents: 'none',
                zIndex: item.type === 'golden' ? 45 : 40
              }}
            >
              {item.type === 'heart' || item.type === 'golden' ? (
                <div style={{ position: 'relative' }}>
                  <Heart size={item.type === 'golden' ? 52 : 44} color={item.color} fill={item.color} style={{ filter: `drop-shadow(0 0 ${item.type === 'golden' ? '20px' : '15px'} ${item.color})` }} />
                  {item.type === 'golden' && (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: -10, border: '2px dashed gold', borderRadius: '50%', opacity: 0.5 }} />
                  )}
                  <motion.div 
                    animate={{ scale: [1, 1.4, 1], opacity: [0, 0.4, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    style={{ position: 'absolute', inset: -5, borderRadius: '50%', background: item.color, filter: 'blur(10px)', zIndex: -1 }}
                  />
                </div>
              ) : (
                <div style={{ position: 'relative', fontSize: '3rem', filter: 'drop-shadow(0 8px 15px rgba(0,0,0,0.3))', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <div style={{ fontSize: '2.5rem' }}>🧨</div>
                   <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 0.2 }} style={{ width: '4px', height: '10px', background: 'gold', filter: 'blur(2px)', position: 'absolute', top: -5 }} />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Purely Decorative Background Heart Rain */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.15 }}>
           {[...Array(8)].map((_, i) => (
             <motion.div
               key={`bg-heart-${i}`}
               initial={{ y: -100, x: `${Math.random() * 100}%` }}
               animate={{ y: 600 }}
               transition={{ duration: 8 + Math.random() * 5, repeat: Infinity, ease: 'linear', delay: Math.random() * 5 }}
               style={{ position: 'absolute' }}
             >
               <Heart size={20 + Math.random() * 20} color="#ff85a1" fill="#ff85a1" />
             </motion.div>
           ))}
        </div>

        {!gameStarted && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 240, 243, 0.4)', backdropFilter: 'blur(8px)', zIndex: 100 }}>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              style={{ 
                background: 'white', 
                padding: '40px', 
                borderRadius: '50px', 
                border: '8px solid #ffdeeb', 
                boxShadow: '0 40px 100px rgba(255, 77, 109, 0.3)',
                textAlign: 'center',
                maxWidth: '400px',
                width: '85%'
              }}
            >
              <div style={{ width: '100px', height: '100px', background: '#fff0f3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', border: '5px solid #ffdeeb' }}>
                <Heart size={50} color="#ff4d6d" fill="#ff4d6d" />
              </div>
              <h1 style={{ color: '#ff4d6d', fontSize: '2.5rem', fontFamily: 'Outfit, sans-serif', fontWeight: 900, marginBottom: '15px' }}>Floral Rain</h1>
              <p style={{ color: '#888', fontWeight: 600, fontSize: '1.1rem', lineHeight: 1.5, marginBottom: '30px' }}>
                Britto's love is blooming! Catch the hearts in your basket. <br/>
                <span style={{ color: '#ff85a1' }}>Beware of the cracked hearts!</span>
              </p>
              <button 
                onClick={() => setGameStarted(true)} 
                style={{ 
                  width: '100%', 
                  padding: '20px 0', 
                  fontSize: '1.4rem', 
                  fontWeight: 900, 
                  background: 'linear-gradient(135deg, #ff4d6d, #ff85a1)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '30px', 
                  cursor: 'pointer', 
                  boxShadow: '0 15px 30px rgba(255, 77, 109, 0.4)',
                  transition: 'transform 0.2s',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'relative', zIndex: 2 }}>LET'S BLOOM!</div>
                <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', skewX: '-20deg' }} />
              </button>
            </motion.div>
          </div>
        )}

        <AnimatePresence>
          {gameState === 'won' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', zIndex: 120 }}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }} 
                animate={{ opacity: 1, scale: 1, rotate: 0 }} 
                style={{ 
                  background: 'white', 
                  padding: '50px', 
                  borderRadius: '60px', 
                  border: '10px solid #00ff88', 
                  textAlign: 'center',
                  boxShadow: '0 50px 100px rgba(0, 255, 136, 0.3)'
                }}
              >
                  <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 30px' }}>
                     <Trophy size={120} color="#00ff88" style={{ filter: 'drop-shadow(0 0 20px #00ff88)' }} />
                     <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: -20, border: '4px dashed #00ff88', borderRadius: '50%', opacity: 0.3 }} />
                  </div>
                  <h1 style={{ color: '#00cc66', fontSize: '3.5rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif', margin: '0 0 10px 0' }}>Breathtaking!</h1>
                  <p style={{ fontWeight: 800, color: '#666', fontSize: '1.2rem' }}>You filled the garden with love! ❤️</p>
                  
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '30px' }}>
                    {[...Array(3)].map((_, i) => (
                      <motion.div key={i} animate={{ y: [0, -10, 0] }} transition={{ delay: i * 0.2, repeat: Infinity }}>
                        <Star size={30} fill="#FFD700" color="#FFD700" />
                      </motion.div>
                    ))}
                  </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Player Basket */}
        <div style={{ position: 'absolute', left: `${basketX}%`, bottom: '50px', transform: 'translateX(-50%)', width: '100px', height: '110px', zIndex: 50, pointerEvents: 'none' }}>
           <motion.div 
             animate={{ y: [0, -5, 0] }}
             transition={{ repeat: Infinity, duration: 2 }}
             style={{ position: 'relative', width: '100%', height: '100%' }}
           >
              {/* Basket Icon */}
              <div style={{ 
                position: 'absolute', 
                bottom: 0, 
                width: '100%', 
                height: '70px', 
                background: 'linear-gradient(to bottom, #d4a373, #bc8a5f)', 
                borderRadius: '12px 12px 50px 50px', 
                border: '4px solid #a37a50', 
                boxShadow: '0 15px 30px rgba(0,0,0,0.2)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                zIndex: 2,
                overflow: 'visible'
              }}>
                  {/* Decorative Woven Pattern */}
                  <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 11px)' }} />
                  
                  <div style={{ 
                    position: 'absolute', 
                    top: '-35px', 
                    width: '75px', 
                    height: '75px', 
                    borderRadius: '50%', 
                    overflow: 'hidden', 
                    border: '5px solid white', 
                    boxShadow: '0 8px 20px rgba(255, 77, 109, 0.4)',
                    background: 'white'
                  }}>
                      <img src={sindhuImg} alt="Sindhu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  
                  {/* Catch Glow Effect */}
                  {score > 0 && (
                    <motion.div 
                      key={score}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: [0, 1, 0], scale: 1.5 }}
                      style={{ position: 'absolute', top: '-40px', width: '100px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle, #ffcbd5, transparent)', zIndex: -1 }}
                    />
                  )}
              </div>
              
              {/* Basket Handle */}
              <div style={{ 
                position: 'absolute', 
                bottom: '35px', 
                left: '50%', 
                transform: 'translateX(-50%)', 
                width: '90px', 
                height: '80px', 
                border: '6px solid #bc8a5f', 
                borderRadius: '50% 50% 0 0', 
                zIndex: 1,
                boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.1)'
              }} />
              
              {/* "YOU" Label */}
              <div style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', background: '#ff4d6d', color: 'white', padding: '2px 10px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 900, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                YOU
              </div>
           </motion.div>
        </div>

        {/* Dynamic Controls Tip */}
        <div style={{ position: 'absolute', bottom: '15px', width: '100%', display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
           <div style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(4px)', padding: '5px 15px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(255,255,255,0.4)' }}>
             <Info size={14} color="#ff4d6d" />
             <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 700 }}>Slide or move mouse to collect hearts</span>
           </div>
        </div>
      </div>

      <div style={{ 
        padding: '20px 30px', 
        textAlign: 'center', 
        fontSize: '0.95rem', 
        color: '#ff85a1', 
        fontWeight: 800, 
        background: 'white',
        borderTop: '2px solid #fff0f3',
        fontFamily: 'Outfit, sans-serif'
      }}>
        "Love is a garden where every heart caught is a flower in bloom." 🌸
      </div>
    </motion.div>
  );
};

export default Level12;
