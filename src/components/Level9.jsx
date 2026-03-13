import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Level9 = ({ onNext }) => {
  const [revealStep, setRevealStep] = useState(1);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (revealStep === 1) {
      const timer = setInterval(() => {
        setPercent(prev => {
          if (prev >= 99) {
            clearInterval(timer);
            setTimeout(() => setRevealStep(2), 1000);
            return 99;
          }
          return prev + 1;
        });
      }, 30);
      return () => clearInterval(timer);
    }
  }, [revealStep]);

  return (
    <motion.div className="glass-card final-card">
      {revealStep === 1 && (
        <div className="calculation">
          <h2>Emotional Percentage</h2>
          <p>Do you know how much Sindhu means to Britto?</p>
          <div className="percent">{percent}%</div>
        </div>
      )}

      {revealStep === 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="error-text">SYSTEM GLITCH... ERROR ⚠</h2>
          <p className="giant-text">Value exceeds measurable limit ♾️</p>
          <button onClick={() => setRevealStep(3)}>Perform Final Scan</button>
        </motion.div>
      )}

      {revealStep === 3 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="final-results">
          <h2>Final Scan Results</h2>
          <ul className="results-list">
             <li><span>Argument Mode:</span> Strong</li>
             <li><span>Laugh Impact:</span> Dangerous</li>
             <li><span>Importance to Britto:</span> Extremely High</li>
             <li><span>Britto’s Priority for You:</span> First</li>
             <li><span>Loyalty Index:</span> 100%</li>
             <li><span>Hidden Care:</span> Extremely High</li>
          </ul>
          <button onClick={onNext}>Unlock Memory</button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Level9;
