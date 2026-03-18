import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

import Level1 from './components/Level1';
import Level2 from './components/Level2';
import Level3 from './components/Level3';
import Level4 from './components/Level4';
import Level5 from './components/Level5';
import Level6 from './components/Level6';
import Level7 from './components/Level7';
import Level9 from './components/Level9';
import Level10 from './components/Level10';
import Level12 from './components/Level12';
import Level13 from './components/Level13';
import ScratchCardLevel from './components/ScratchCardLevel';
import LovePuzzle from './components/LovePuzzle';
import FinalMessage from './components/FinalMessage';
import FloatingHearts from './components/FloatingHearts';

function App() {
  const [level, setLevel] = useState(1);
  const [chocolates, setChocolates] = useState(0);
  const [cheated, setCheated] = useState(false);

  const nextLevel = useCallback(() => {
    setLevel(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const addPenalty = useCallback(() => {
    setChocolates(prev => prev + 1);
  }, []);

  const addCheat = useCallback(() => {
    setCheated(true);
  }, []);

  const ChocolateBadge = () => (
    <motion.div 
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="chocolate-badge"
    >
      <div className="choco-top">Chocolate Penalty 🍫</div>
      <div className="choco-count">Count: {chocolates}</div>
      <p className="choco-sub">Britto is waiting 😜</p>
    </motion.div>
  );

  return (
    <div className="app-main">
      <FloatingHearts />
      <div className="level-indicator">
        <span>{level <= 12 ? `Level ${level}` : "Final Surprise ❤️"}</span>
         {/* {level < 13 && (
          <div style={{ display: 'flex', gap: '5px' }}>
            <button 
              onClick={nextLevel} 
              style={{ padding: '2px 8px', fontSize: '0.7rem', width: 'auto', background: '#333', color: 'white', border: 'none', borderRadius: '10px', boxShadow: 'none' }}
              title="Skip to next level"
            >
              Skip
            </button>
            <select 
              value={level} 
              onChange={(e) => setLevel(Number(e.target.value))}
              style={{ padding: '2px', fontSize: '0.7rem', background: '#333', color: 'white', border: 'none', borderRadius: '5px' }}
              title="Jump to level"
            >
              {[1,2,3,4,5,6,7,8,9,10,11,12,13].map(l => (
                <option key={l} value={l}>Lvl {l}</option>
              ))}
            </select>
          </div>
        )} */}
      </div>
      <ChocolateBadge />
      
      <AnimatePresence mode="wait">
        {/* Phase 1: Identity & Bond Verification */}
        {level === 1 && <Level1 key="l1" onNext={nextLevel} onPenalty={addPenalty} />}
        {level === 2 && <Level2 key="l2" onNext={nextLevel} onPenalty={addPenalty} />}
        {level === 3 && <Level3 key="l3" onNext={nextLevel} onPenalty={addPenalty} />}
        {level === 4 && <Level5 key="l4" onNext={nextLevel} />}

        {/* Phase 2: Memory, Emotion & Bond Tests */}
        {level === 5 && <LovePuzzle key="l5" onNext={nextLevel} />}
        {level === 6 && <Level7 key="l6" onNext={nextLevel} onPenalty={addPenalty} />}
        {level === 7 && <Level9 key="l7" onNext={nextLevel} />}

        {/* Phase 3: Fun Challenges */}
        {level === 8 && <Level6 key="l8" onNext={nextLevel} onPenalty={addPenalty} onCheat={addCheat} />}
        {level === 9 && <Level4 key="l9" onNext={nextLevel} />}

        {/* Phase 4: Action & Celebration */}
        {level === 10 && <Level12 key="l10" onNext={nextLevel} onPenalty={addPenalty} />}
        {level === 11 && <Level13 key="l11" onNext={nextLevel} />}
        {level === 12 && <ScratchCardLevel key="l12" onNext={nextLevel} />}
        {level >= 13 && <FinalMessage key="final" chocolates={chocolates} cheated={cheated} />}
      </AnimatePresence>
    </div>
  );
}

export default App;
