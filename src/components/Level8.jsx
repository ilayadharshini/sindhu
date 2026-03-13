import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles } from 'lucide-react';

const Level8 = ({ onNext, onPenalty }) => {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState("Watch the sequence carefully...");
  const [gameStarted, setGameStarted] = useState(false);
  const [activeSquare, setActiveSquare] = useState(null);

  const colors = [
    { id: 0, color: '#ff3a71', label: 'Passion' },
    { id: 1, color: '#74ebd5', label: 'Trust' },
    { id: 2, color: '#f6d365', label: 'Joy' },
    { id: 3, color: '#a18cd1', label: 'Bond' }
  ];

  const startGame = () => {
    setGameStarted(true);
    const newSeq = [];
    for (let i = 0; i < 4; i++) {
      newSeq.push(Math.floor(Math.random() * 4));
    }
    setSequence(newSeq);
    setPlayerSequence([]);
    playSequence(newSeq);
  };

  const playSequence = async (seq) => {
    setIsPlaying(true);
    setMessage("Memorize the pattern...");
    
    // Wait for a little before starting playing
    await new Promise(r => setTimeout(r, 800));

    for (let i = 0; i < seq.length; i++) {
        setActiveSquare(seq[i]);
        await new Promise(r => setTimeout(r, 600));
        setActiveSquare(null);
        await new Promise(r => setTimeout(r, 300));
    }

    setIsPlaying(false);
    setMessage("Now repeat the sequence!");
  };

  const handleSquareClick = (id) => {
    if (isPlaying || !gameStarted) return;

    setActiveSquare(id);
    setTimeout(() => setActiveSquare(null), 300);

    const newPlayerSeq = [...playerSequence, id];
    setPlayerSequence(newPlayerSeq);

    // Check if correct so far
    if (newPlayerSeq[newPlayerSeq.length - 1] !== sequence[newPlayerSeq.length - 1]) {
      // Failed
      setMessage("❌ Sequence mismatch! Core destabilized. (+1 🍫 Penalty)");
      onPenalty();
      setIsPlaying(true);
      setTimeout(() => {
        setGameStarted(false);
        setMessage("Watch the sequence carefully...");
      }, 2000);
      return;
    }

    // Check if completed
    if (newPlayerSeq.length === sequence.length) {
      setMessage("✅ Vault unlocked! Neural link established.");
      setIsPlaying(true);
      setTimeout(() => {
        onNext();
      }, 1500);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card">
      <Lock className="icon-header" size={48} color="#ff3a71" />
      <h2>Neural Vault Sync</h2>
      <p className="system-msg">Recreate the bond frequency to unlock</p>
      
      <div style={{ minHeight: '40px', margin: '15px 0', fontWeight: 'bold', color: 'var(--primary)' }}>
        {message}
      </div>

      <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '15px',
          maxWidth: '300px',
          margin: '0 auto 30px',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.4)',
          borderRadius: '20px'
      }}>
        {colors.map((c) => (
          <motion.div
            key={c.id}
            whileTap={!isPlaying && gameStarted ? { scale: 0.95 } : {}}
            onClick={() => handleSquareClick(c.id)}
            style={{
              height: '100px',
              borderRadius: '15px',
              background: activeSquare === c.id ? c.color : '#e0e0e0',
              boxShadow: activeSquare === c.id ? `0 0 20px ${c.color}` : 'none',
              cursor: isPlaying || !gameStarted ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              transition: 'all 0.2s',
              opacity: (isPlaying && activeSquare !== c.id && activeSquare !== null) ? 0.5 : 1
            }}
          >
            {activeSquare === c.id && <span>{c.label}</span>}
          </motion.div>
        ))}
      </div>

      {!gameStarted && (
        <button onClick={startGame}>
          <Sparkles size={16} /> Initiate Sync Sequence
        </button>
      )}
    </motion.div>
  );
};

export default Level8;
