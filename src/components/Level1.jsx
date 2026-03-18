import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

import SuccessReward from './SuccessReward';
import girlAvatar from '../assets/girl_avatar.png';

const Level1 = ({ onNext, onPenalty }) => {
  // --- State for tracking user input and verification status ---
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  // --- Logic to check the secret word ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim()) {
      setError('Identity cannot be empty!');
      return;
    }
    const cleanAnswer = answer.toLowerCase().trim();
    if (cleanAnswer.includes('mai')) {
      setIsVerified(true);
      setError('');
      // Delay jumping to next level to show the animation
      setTimeout(() => onNext(), 4000);
    } else {
      setError('❌ Wrong! System denied access. +1 Chocolate Penalty, Trouble Queen! 🍫 Try again...');
      onPenalty();
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card">
      {!isVerified ? (
        <>
          <ShieldCheck className="icon-header" size={48} color="#ff3a71" />
          <h2>Authorization Check</h2>
          <p className="system-msg">Security verification required before accessing Britto’s special system.</p>
          <p><strong>Question:</strong> “What word do you use when Britto irritates you the most?”</p>
          
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Type your secret word..." 
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            {error && <p className="error-text" style={{ fontWeight: 'bold' }}>{error}</p>}
            <button type="submit">Verify Identity</button>
          </form>
        </>
      ) : (
        <div className="success-container">
          <SuccessReward imagePath={girlAvatar} />
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="success-text"
          >
            <p style={{ fontSize: '1.2rem', fontWeight: 600, color: '#666', marginTop: '-20px' }}>
              Welcome aboard, Trouble Queen 😜
            </p>
            <p className="system-msg" style={{ marginTop: '20px', letterSpacing: '4px' }}>
              PREPARING SPECIAL ACCESS...
            </p>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Level1;
