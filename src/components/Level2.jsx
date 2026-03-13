import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

const Level2 = ({ onNext, onPenalty }) => {
  const [step, setStep] = useState(1);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [popup, setPopup] = useState(false);

  const choicesStep1 = ['Cooler', 'Gossip-holic', 'Silent', 'Angry'];

  const handleChoiceStep1 = (choice) => {
    if (choice === 'Gossip-holic') {
      setFeedback('Accurate. Damage confirmed 😜');
      setTimeout(() => {
        setFeedback('');
        setStep(2);
      }, 2000);
    } else {
      setFeedback('❌ Incorrect bond data! Penalty: 1 Chocolate. Moving to Step 2... 😜');
      onPenalty();
      setTimeout(() => {
        setFeedback('');
        setStep(2);
      }, 2500);
    }
  };

  const choicesStep3 = ['Cute', 'Toxic', 'Boring'];

  const handleStep2 = (e) => {
    e.preventDefault();
    if (!answer.trim()) return;
    setPopup(true);
    setTimeout(() => {
      setPopup(false);
      setStep(3);
    }, 2500);
  };

  const handleChoiceStep3 = (choice) => {
    if (choice === 'Toxic') {
      setFeedback('System agrees. Slightly toxic but manageable.');
      setTimeout(() => {
        onNext();
      }, 2000);
    } else {
      setFeedback('❌ Error! Evaluation mismatch but moving on. +1 Chocolate for me! 🍫');
      onPenalty();
      setTimeout(() => {
        onNext();
      }, 2500);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="glass-card">
      <Heart className="icon-header" size={48} color="#ff3a71" />
      <h2>Bond Strength Test</h2>
      <p className="system-msg">Analyzing emotional bond strength...</p>

      {step === 1 && (
        <div className="choices-container">
          <p>1. What did you make Britto become?</p>
          <div className="options-grid" style={{ marginTop: '20px' }}>
            {choicesStep1.map((choice) => (
              <button 
                key={choice} 
                onClick={() => handleChoiceStep1(choice)}
                className="outline-btn"
                style={{ marginBottom: '10px' }}
              >
                {choice}
              </button>
            ))}
          </div>
          {feedback && <p className={feedback.includes('❌') ? 'error-text' : 'success-text'}>{feedback}</p>}
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleStep2}>
          <p>2. What is the first thing Britto bought for you?</p>
          <input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type here..." />
          <button type="submit">Submit</button>
          
          <AnimatePresence>
            {popup && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="mini-popup"
              >
                Athu enakey teriyathu 😜
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      )}

      {step === 3 && (
        <div className="choices-container">
          <p>3. What do you think about Britto’s personality?</p>
          <div className="options-grid" style={{ marginTop: '20px' }}>
            {choicesStep3.map((choice) => (
              <button 
                key={choice} 
                onClick={() => handleChoiceStep3(choice)}
                className="outline-btn"
                style={{ marginBottom: '10px' }}
              >
                {choice}
              </button>
            ))}
          </div>
          {feedback && <p className={feedback.includes('❌') ? 'error-text' : 'success-text'}>{feedback}</p>}
        </div>
      )}
    </motion.div>
  );
};

export default Level2;
