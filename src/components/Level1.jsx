import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const Level1 = ({ onNext, onPenalty }) => {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);

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
      setTimeout(() => onNext(), 1500);
    } else {
      setError('❌ Wrong! System denied access. +1 Chocolate Penalty, Trouble Queen! 🍫 Try again...');
      onPenalty();
      // No longer proceeding automatically on failure
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card">
      <ShieldCheck className="icon-header" size={48} color="#ff3a71" />
      <h2>Authorization Check</h2>
      <p className="system-msg">Security verification required before accessing Britto’s special system.</p>
      <p><strong>Question:</strong> “What word do you use when Britto irritates you the most?”</p>
      
      {!isVerified ? (
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
      ) : (
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="success-text">
          <p style={{ fontSize: '1.4rem' }}>✅ Identity Confirmed!</p>
          <p>Welcome aboard, Trouble Queen 😜 Let's begin the journey...</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Level1;
