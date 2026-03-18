import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Sparkles } from 'lucide-react';

const PUZZLE_WORDS = [
  {
    scrambled: 'OUY',
    answer: 'YOU',
    hint: '👉 It\'s pointing at someone...',
    options: ['OUR', 'YOU', 'TOY']
  },
  {
    scrambled: 'EAR',
    answer: 'ARE',
    hint: '🔤 A simple helping verb',
    options: ['ERA', 'ARE', 'EAR']
  },
  {
    scrambled: 'TBES',
    answer: 'BEST',
    hint: '🥇 Number one!',
    options: ['BETS', 'BEST', 'STEP']
  },
  {
    scrambled: 'RESSTI',
    answer: 'SISTER',
    hint: '👭 A precious family bond',
    options: ['MISTER', 'SISTER', 'LISTER']
  },
];

const LovePuzzle = ({ onNext }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [status, setStatus] = useState('');
  const [solvedWords, setSolvedWords] = useState([]);
  const [done, setDone] = useState(false);

  const current = PUZZLE_WORDS[currentIndex];

  const handleSelect = (option) => {
    if (status === 'correct') return;
    setSelectedOption(option);

    if (option === current.answer) {
      setStatus('correct');
      const newSolved = [...solvedWords, current.answer];
      setSolvedWords(newSolved);
      setTimeout(() => {
        setSelectedOption(null);
        setStatus('');
        if (currentIndex + 1 >= PUZZLE_WORDS.length) {
          setDone(true);
        } else {
          setCurrentIndex(currentIndex + 1);
        }
      }, 1200);
    } else {
      setStatus('wrong');
      setTimeout(() => {
        setSelectedOption(null);
        setStatus('');
      }, 900);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card"
      style={{ textAlign: 'center' }}
    >
      <KeyRound className="icon-header" size={48} color="#ff3a71" />
      <h2>Love Message Decoder 💌</h2>
      <p className="system-msg">Britto encrypted a secret message. Pick the correct word!</p>

      {/* Progress Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '15px 0' }}>
        {PUZZLE_WORDS.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              background: i < solvedWords.length ? '#ff3a71' : i === currentIndex ? 'rgba(255,58,113,0.4)' : '#ddd',
              scale: i === currentIndex ? 1.3 : 1
            }}
            style={{ width: '12px', height: '12px', borderRadius: '50%' }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key={`word-${currentIndex}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            {/* Hint */}
            <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '5px' }}>
              {current.hint}
            </p>

            {/* Scrambled tiles */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '20px 0', flexWrap: 'wrap' }}>
              {current.scrambled.split('').map((letter, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    width: '46px',
                    height: '54px',
                    borderRadius: '10px',
                    background: 'white',
                    border: '2px solid #ff3a71',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    fontWeight: '900',
                    color: '#ff3a71',
                    boxShadow: '0 4px 15px rgba(255,58,113,0.2)'
                  }}
                >
                  {letter}
                </motion.div>
              ))}
            </div>

            <p style={{ color: '#555', fontWeight: '700', marginBottom: '15px', fontSize: '0.9rem' }}>
              Which word do these letters make?
            </p>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '280px', margin: '0 auto' }}>
              {current.options.map((option) => {
                const isSelected = selectedOption === option;
                const isCorrect = isSelected && status === 'correct';
                const isWrong = isSelected && status === 'wrong';

                return (
                  <motion.button
                    key={option}
                    onClick={() => handleSelect(option)}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      padding: '14px 20px',
                      borderRadius: '14px',
                      border: `2.5px solid ${isCorrect ? '#00cc66' : isWrong ? '#ff3333' : '#ff3a71'}`,
                      background: isCorrect ? '#e6fff4' : isWrong ? '#fff0f0' : 'white',
                      color: isCorrect ? '#00aa55' : isWrong ? '#cc0000' : '#ff3a71',
                      fontSize: '1.1rem',
                      fontWeight: '900',
                      letterSpacing: '4px',
                      cursor: 'pointer',
                      width: '100%',
                      boxShadow: isCorrect
                        ? '0 4px 15px rgba(0,200,100,0.2)'
                        : isWrong
                        ? '0 4px 15px rgba(255,50,50,0.2)'
                        : '0 4px 15px rgba(255,58,113,0.15)',
                    }}
                  >
                    {isCorrect ? '✅ ' : isWrong ? '❌ ' : ''}{option}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ repeat: 2, duration: 0.5 }}
            >
              <Sparkles size={60} color="#ff3a71" style={{ margin: '10px auto', filter: 'drop-shadow(0 0 15px #ff3a71)' }} />
            </motion.div>

            <h3 style={{ color: '#ff3a71', fontSize: '1.4rem', marginBottom: '15px' }}>Message Decoded! 🎉</h3>

            <div style={{
              background: 'white',
              border: '2px solid #ff3a71',
              borderRadius: '20px',
              padding: '25px',
              margin: '15px 0',
              boxShadow: '0 8px 30px rgba(255,58,113,0.15)'
            }}>
              <p style={{ fontSize: '1.3rem', color: '#ff3a71', fontWeight: '900', letterSpacing: '2px', lineHeight: 1.8 }}>
                "{solvedWords.join(' ')}" 🥹❤️
              </p>
              <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '10px' }}>
                That's Britto's secret message just for you, ka! 😊
              </p>
            </div>

            <button onClick={onNext}>Continue ❤️</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LovePuzzle;
