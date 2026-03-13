import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircleHeart } from 'lucide-react';

const Level7 = ({ onNext, onPenalty }) => {
  const [val, setVal] = useState(50);
  const getReaction = () => {
    if (val < 33) return { text: "Scold Britto", res: "Britto feels sad. 😢" };
    if (val < 66) return { text: "Smile at him", res: "He forgets why he was angry. 😊" };
    return { text: "Be angry back", res: "He will cry. 😭" };
  };

  const reaction = getReaction();

  return (
    <motion.div className="glass-card">
      <MessageCircleHeart className="icon-header" size={48} color="#ff3a71" />
      <h2>What If Britto Is Angry?</h2>
      <p>Adjust your reaction:</p>
      
      <div className="slider-container">
        <input 
          type="range" 
          min="0" max="100" 
          value={val} 
          onChange={(e) => setVal(e.target.value)} 
          className="reaction-slider"
        />
        <div className="reaction-label">{reaction.text}</div>
        <div className="reaction-result">{reaction.res}</div>
      </div>

      <p className="system-msg" style={{ marginTop: '20px' }}>Recommended Option: Smile 😌</p>
      <button onClick={() => {
        if (val > 66) onPenalty();
        onNext();
      }}>Continue</button>
    </motion.div>
  );
};

export default Level7;
