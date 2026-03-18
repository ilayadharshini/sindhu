import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock } from 'lucide-react';

const Level3 = ({ onNext, onPenalty }) => {
  const targetPattern = ['S', 'U', 'M', 'U'];
  const [currentPattern, setCurrentPattern] = useState([]);
  const [error, setError] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineEnd, setLineEnd] = useState(null);
  const containerRef = useRef(null);

  const dots = [
    { id: 0, label: 'S' }, { id: 1, label: 'A' }, { id: 2, label: 'M' },
    { id: 3, label: 'M' }, { id: 4, label: 'A' }, { id: 5, label: 'U' }, // Second U for target pattern
    { id: 6, label: 'I' }, { id: 7, label: 'U' }, { id: 8, label: 'A' }
  ];

  const handleStart = (id) => {
    setIsDrawing(true);
    setCurrentPattern([id]);
    setError(false);
  };

  const handleEnter = (id) => {
    if (isDrawing && !currentPattern.includes(id)) {
      const newPattern = [...currentPattern, id];
      setCurrentPattern(newPattern);
    }
  };

  const handleEnd = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setLineEnd(null);

    const resultLetters = currentPattern.map(idx => dots[idx].label);
    const isCorrect = resultLetters.length === targetPattern.length && 
                      resultLetters.every((l, i) => l === targetPattern[i]);

    if (isCorrect) {
      onNext();
    } else {
      setError(true);
      onPenalty();
      setTimeout(() => {
        setCurrentPattern([]);
        setError(false);
      }, 1500);
    }
  };

  const handleMove = (e) => {
    if (!isDrawing || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setLineEnd({
      x: clientX - rect.left,
      y: clientY - rect.top
    });
  };

  const getDotPos = (index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return {
      x: 50 + col * 90,
      y: 50 + row * 90
    };
  };

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
      <Lock className="icon-header" size={40} color="#ff3a71" />
      <h2>Sister Bond Code</h2>
      <p className="system-msg">“Swipe the Secret Pattern ❤️”</p>
      <p>Most used word in our chat </p>

      <div 
        className="pattern-lock-container"
        ref={containerRef}
        onMouseMove={handleMove}
        onTouchMove={(e) => { e.preventDefault(); handleMove(e); }}
        onMouseUp={handleEnd}
        onTouchEnd={handleEnd}
        style={{ touchAction: 'none' }}
      >
        <svg className="pattern-lock-svg">
          {/* Permanent lines */}
          {currentPattern.map((dotIdx, i) => {
            if (i === 0) return null;
            const start = getDotPos(currentPattern[i - 1]);
            const end = getDotPos(dotIdx);
            return (
              <line 
                key={i} 
                x1={start.x} y1={start.y} 
                x2={end.x} y2={end.y} 
                className="pattern-line" 
              />
            );
          })}
          {/* Active line to cursor */}
          {isDrawing && currentPattern.length > 0 && lineEnd && (
            <line 
              x1={getDotPos(currentPattern[currentPattern.length - 1]).x} 
              y1={getDotPos(currentPattern[currentPattern.length - 1]).y}
              x2={lineEnd.x} 
              y2={lineEnd.y} 
              className="pattern-line-active"
            />
          )}
        </svg>

        <div className="pattern-lock-grid">
          {dots.map((dot, i) => {
            const isSelected = currentPattern.includes(i);
            return (
              <div 
                key={i} 
                className={`pattern-dot ${isSelected ? 'selected' : ''}`}
                onMouseDown={() => handleStart(i)}
                onMouseEnter={() => handleEnter(i)}
                onTouchStart={() => handleStart(i)}
                onTouchMove={(e) => {
                  const touch = e.touches[0];
                  const el = document.elementFromPoint(touch.clientX, touch.clientY);
                  const dotId = el?.getAttribute('data-dot-id');
                  if (dotId !== null && dotId !== undefined) {
                    handleEnter(parseInt(dotId));
                  }
                }}
                data-dot-id={i}
              >
                {dot.label}
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="error-text">
            😜 Try again, Pattern Queen. Correct order only! ❤️
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Level3;
