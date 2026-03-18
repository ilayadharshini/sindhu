import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Timer, RefreshCcw } from 'lucide-react';

const EMOJIS = ['👯‍♀️', '🍫', '🍕', '😂', '🎁', '📸'];

const Level4 = ({ onNext, onPenalty }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [timer, setTimer] = useState(45);
  const [isGameOver, setIsGameOver] = useState(false);

  const initGame = () => {
    const shuffledCards = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }));
    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setDisabled(false);
    setTimer(45);
    setIsGameOver(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    if (isGameOver || solved.length === EMOJIS.length * 2) return;
    
    if (timer <= 0) {
      setIsGameOver(true);
      onPenalty(); // Add penalty when time is up
      return;
    }

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, isGameOver, solved.length]);

  const handleCardClick = (index) => {
    if (disabled || flipped.includes(index) || solved.includes(index) || isGameOver) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      const firstIndex = newFlipped[0];
      const secondIndex = newFlipped[1];

      if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
        setSolved([...solved, firstIndex, secondIndex]);
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 800);
      }
    }
  };

  useEffect(() => {
    if (solved.length === EMOJIS.length * 2 && solved.length > 0) {
      setTimeout(() => onNext(), 1500);
    }
  }, [solved, onNext]);

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
      <Gamepad2 className="icon-header" size={48} color="#ff3a71" />
      <h2>Memory Match</h2>
      <p className="system-msg">“Match the pairs before time runs out!”</p>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        margin: '15px 0',
        color: timer <= 10 ? '#ff3a71' : 'var(--primary)',
        fontWeight: 'bold',
        fontSize: '1.2rem'
      }}>
        <Timer size={24} />
        <span>{timer}s</span>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginTop: '10px',
        marginBottom: '20px',
        opacity: isGameOver ? 0.3 : 1,
        pointerEvents: isGameOver ? 'none' : 'auto'
      }}>
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || solved.includes(index);
          return (
            <motion.div
              key={card.id}
              onClick={() => handleCardClick(index)}
              style={{
                background: isFlipped ? 'white' : 'var(--primary-light)',
                borderRadius: '16px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                cursor: isFlipped ? 'default' : 'pointer',
                boxShadow: isFlipped ? 'inset 0 0 10px rgba(255, 77, 109, 0.1)' : '0 8px 15px rgba(255, 77, 109, 0.2)',
                border: isFlipped ? '2px solid var(--primary)' : '2px solid transparent'
              }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
            >
              <div style={{ transform: isFlipped ? 'rotateY(180deg)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isFlipped ? card.emoji : <span style={{fontSize: '1.5rem', opacity: 0.5, color: 'white'}}>❓</span>}
              </div>
            </motion.div>
          );
        })}
      </div>

      {isGameOver && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="game-over">
          <p className="error-text" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Time's Up! ⏰ Oops!</p>
          <button onClick={initGame} style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '15px auto' }}>
            <RefreshCcw size={18} /> Try Again
          </button>
        </motion.div>
      )}
      
      {solved.length === EMOJIS.length * 2 && (
        <motion.p initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="success-text">
          Perfect match! Memory unlocked. ❤️
        </motion.p>
      )}
    </motion.div>
  );
};

export default Level4;
