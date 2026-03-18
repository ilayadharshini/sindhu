import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircleHeart, Smile, Angry, Zap, Heart } from 'lucide-react';

const Level7 = ({ onNext, onPenalty }) => {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);

  const reactions = [
    { 
      id: 'scold', 
      text: "Scold Britto", 
      res: "Britto feels sad. 😢", 
      icon: <Zap size={24} />, 
      color: "#4dabf7", // Blue theme
      penalty: false
    },
    { 
      id: 'smile', 
      text: "Smile at him", 
      res: "He forgets why he was angry. 😊", 
      icon: <Smile size={24} />, 
      color: "#fab005", // Yellow theme (Recommended)
      penalty: false
    },
    { 
      id: 'angry', 
      text: "Be angry back", 
      res: "He will cry. 😭", 
      icon: <Angry size={24} />, 
      color: "#ff3a71", // Red theme (Penalty)
      penalty: true
    },
  ];

  // Helper to determine which reaction info to display based on hover or selection
  const currentView = hovered || selected || null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card"
      style={{ overflow: 'hidden' }}
    >
      <MessageCircleHeart className="icon-header" size={48} color="#ff3a71" />
      <h2>What If Britto Is Angry?</h2>
      <p style={{ marginBottom: '40px' }}>Harmonize the situation:</p>

      <div className="harmonizer-container" style={{ 
        height: '220px', 
        position: 'relative', 
        margin: '20px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Central Character Mood */}
        <motion.div 
          className="central-mood"
          animate={{ 
            scale: currentView ? 1.1 : 1,
            rotate: currentView?.id === 'angry' ? [0, -5, 5, 0] : 0
          }}
          transition={{ repeat: currentView?.id === 'angry' ? Infinity : 0, duration: 0.2 }}
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            zIndex: 5,
            border: '4px solid #fff0f3'
          }}
        >
          {currentView?.id === 'smile' ? '🥰' : 
           currentView?.id === 'scold' ? '🥺' : 
           currentView?.id === 'angry' ? '😖' : '😤'}
        </motion.div>

        {/* Orbiting Orbs */}
        {reactions.map((react, index) => {
          const angle = (index * (360 / reactions.length)) * (Math.PI / 180);
          const radius = 85;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={react.id}
              className="reaction-orb"
              onMouseEnter={() => setHovered(react)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelected(react)}
              initial={{ x: 0, y: 0 }}
              animate={{ 
                x: selected?.id === react.id ? 0 : x, 
                y: selected?.id === react.id ? -100 : y,
                scale: selected?.id === react.id ? 1.2 : 1,
                zIndex: selected?.id === react.id ? 10 : 2,
                // Subtle float if nothing is selected
                translateY: !selected ? [0, -5, 0] : 0
              }}
              transition={{ 
                translateY: { repeat: Infinity, duration: 2, delay: index * 0.5 }
              }}
              whileHover={{ scale: 1.3, zIndex: 10 }}
              style={{
                position: 'absolute',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: react.color,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: `0 8px 20px ${react.color}66`,
                border: selected?.id === react.id ? '4px solid white' : 'none'
              }}
            >
              {react.icon}
            </motion.div>
          );
        })}

        {/* Pulse Ring */}
        <motion.div 
          className="pulse-ring"
          animate={{ 
            scale: [1, 1.5, 1], 
            opacity: [0.3, 0, 0.3] 
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: 'absolute',
            width: '120px',
            height: '120px',
            border: `2px solid ${currentView?.color || '#ff4d6d'}`,
            borderRadius: '50%',
            pointerEvents: 'none',
            transition: 'border-color 0.3s ease'
          }}
        />

        {/* Initial Instruction */}
        {!selected && !hovered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 4,
              pointerEvents: 'none'
            }}
          >
            <p style={{ 
              color: 'var(--primary)', 
              fontWeight: '800', 
              fontSize: '0.8rem', 
              whiteSpace: 'nowrap',
              background: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
            }}>
              Tap an emoji! ✨
            </p>
          </motion.div>
        )}
      </div>

      <div style={{ minHeight: '80px', marginTop: '20px' }}>
        <AnimatePresence mode="wait">
          {currentView && (
            <motion.div
              key={currentView.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="reaction-label" style={{ color: currentView.color, marginBottom: '5px', fontSize: '1.2rem', fontWeight: 800 }}>
                {currentView.text}
              </div>
              <div className="reaction-result" style={{ fontSize: '0.95rem', opacity: 0.8 }}>
                {currentView.res}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="system-msg" style={{ marginTop: '20px', opacity: selected?.id === 'smile' ? 0.5 : 1 }}>
        {!selected && hovered ? "Click it to select! 👇" : (selected?.id === 'smile' ? "Great Choice! 😊" : "Recommended Option: Smile 😋")}
      </p>
      
      <button 
        disabled={!selected}
        className={selected?.penalty ? 'penalty-btn' : ''}
        style={{ 
          opacity: selected ? 1 : 0.5, 
          cursor: selected ? 'pointer' : 'not-allowed',
          marginTop: '10px',
          background: selected ? (selected.penalty ? '#ff4d6d' : selected.color) : '#ccc',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
        onClick={() => {
          if (selected.penalty) onPenalty();
          onNext();
        }}
      >
        {selected?.id === 'smile' ? <Heart size={20} fill="white" /> : <Zap size={20} />}
        {selected ? (
          selected.id === 'smile' ? "Choose Love" : 
          selected.penalty ? "Choose Anger anyway" : "Respond"
        ) : (hovered ? "Click to pick this!" : "Select an action")}
      </button>
    </motion.div>
  );
};

export default Level7;
