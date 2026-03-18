import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Zap, Loader2, PauseCircle, PlayCircle } from 'lucide-react';

const Level6 = ({ onNext, onPenalty, onCheat }) => {
  const [timer, setTimer] = useState(20);
  const [started, setStarted] = useState(false);
  const [input, setInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const timerDoneRef = useRef(false);
  const timerRef = useRef(20);

  useEffect(() => {
    if (!started || timerDoneRef.current) return;

    const interval = setInterval(() => {
      timerRef.current -= 1;
      setTimer(timerRef.current);

      if (timerRef.current <= 0) {
        clearInterval(interval);
        timerDoneRef.current = true;
        if (input.trim().length < 20) {
          onPenalty();
        }
        setAnalyzing(true);
        setTimeout(onNext, 4000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [started]); 

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const timerColor = timer <= 5 ? '#ff3a71' : timer <= 10 ? '#ff9500' : 'var(--primary)';

  return (
    <motion.div className="glass-card">
      <Zap className="icon-header" size={48} color="#ff3a71" />
      <h2>Gossip Queen Speed</h2>
      <p className="system-msg">Checking Your Daily Gossip Stats... 🎙️</p>

      {!started ? (
        <>
          <p>Type the fastest gossip update you know in 20 seconds. Show your power! 😂</p>
          <p style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>Note: Typing only! Pasting is forbidden. 🚫</p>
          <button onClick={() => setStarted(true)}>Start Timer</button>
        </>
      ) : analyzing ? (
        <div className="overheat">
          <p>Loading... This gossip is too spicy for Britto's servers. 🔥</p>
          <p className="error-text">System Overload! Gossip overload detected. 🤣</p>
          <Loader2 className="spinning" />
        </div>
      ) : (
        <div className="gossip-input">
          {/* Live status badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '5px' }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ff9500', fontWeight: 'bold', fontSize: '0.85rem' }}
            >
              <PlayCircle size={16} /> Timer is live — GO FAST! 🚀
            </motion.div>
          </div>

          {/* Timer display */}
          <motion.p
            animate={{ scale: timer <= 5 && !isTypingDisplay ? [1, 1.15, 1] : 1 }}
            transition={{ duration: 0.5, repeat: timer <= 5 && !isTypingDisplay ? Infinity : 0 }}
            className="timer"
            style={{ color: timerColor, textShadow: timer <= 5 ? `0 0 10px ${timerColor}` : 'none' }}
          >
            ⏱ {timer}s
          </motion.p>

          <textarea
            autoFocus
            placeholder="Type your spicy update here..."
            value={input}
            onChange={handleChange}
            onPaste={(e) => {
              e.preventDefault();
              alert("🚫 CHEAT DETECTED! No pasting gossip! Britto wants you to type it! +1 Penalty 🍫");
              onPenalty();
              onCheat();
            }}
          />

          <p style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '8px' }}>
            {input.length} characters typed
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default Level6;
