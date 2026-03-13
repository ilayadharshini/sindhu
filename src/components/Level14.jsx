import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Moon, Sun, Cloud, Zap, Ghost, Eye } from 'lucide-react';
import sindhuImg from '../assets/sindhu.jpeg';
import brittoImg from '../assets/britto.png';

const Level14 = ({ onNext }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const icons = [
    { type: 'heart', component: <Heart size={32} color="#ff3a71" fill="#ff3a71" /> },
    { type: 'star', component: <Star size={32} color="#ffd700" fill="#ffd700" /> },
    { type: 'britto', component: <img src={brittoImg} alt="B" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} /> },
    { type: 'sindhu', component: <img src={sindhuImg} alt="S" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} /> },
    { type: 'zap', component: <Zap size={32} color="#00e5ff" fill="#00e5ff" /> },
    { type: 'moon', component: <Moon size={32} color="#ffffff" fill="#ffffff" /> },
  ];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const deck = [...icons, ...icons]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({ ...icon, id: index }));
    setCards(deck);
    setSolved([]);
    setFlipped([]);
  };

  const handleFlip = (id) => {
    if (disabled || flipped.includes(id) || solved.includes(id)) return;

    if (flipped.length === 0) {
      setFlipped([id]);
    } else {
      setFlipped([...flipped, id]);
      setDisabled(true);
      
      const firstCard = cards.find(c => c.id === flipped[0]);
      const secondCard = cards.find(c => c.id === id);

      if (firstCard.type === secondCard.type) {
        setSolved([...solved, flipped[0], id]);
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      setTimeout(onNext, 2000);
    }
  }, [solved, cards]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="glass-card"
      style={{ maxWidth: '450px', margin: '0 auto' }}
    >
      <div className="system-msg">Memory Synchronization</div>
      <h2 style={{ marginBottom: '10px' }}>Level 14: Perfect Connection</h2>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '25px' }}>
        Find the matching pairs of Britto, Sindhu, and your favorite things to proceed!
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '12px', 
        perspective: '1000px'
      }}>
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id) || solved.includes(card.id);
          return (
            <div 
              key={card.id}
              onClick={() => handleFlip(card.id)}
              style={{
                height: '100px',
                position: 'relative',
                transformStyle: 'preserve-3d',
                cursor: 'pointer',
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Front side (hidden when flipped) */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
              }}>
                <div style={{ fontSize: '1.5rem', opacity: 0.3 }}>?</div>
              </div>

              {/* Back side (content) */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                background: 'rgba(255, 77, 109, 0.15)',
                border: '2px solid var(--primary)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'rotateY(180deg)',
                boxShadow: isFlipped ? '0 0 15px rgba(255, 77, 109, 0.4)' : 'none'
              }}>
                {card.component}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '25px', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
        {solved.length / 2} / {icons.length} Pairs Found
      </div>
    </motion.div>
  );
};

export default Level14;
