import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  Lock, 
  ShieldCheck, 
  Gamepad2, 
  Scan, 
  Zap, 
  MessageCircleHeart, 
  Smile, 
  Frown, 
  Ghost,
  Trophy,
  Loader2,
  Sparkles,
  RotateCcw,
  Send,
  Share2,
  Copy
} from 'lucide-react';
import './App.css';
import sindhuImg from './assets/sindhu.jpeg';
import brittoImg from './assets/britto.png';

// --- Level 1: Authorization ---
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
      setError('❌ Incorrect identity! Penalty: 1 Chocolate. Try again, Trouble Queen! 🍫');
      onPenalty();
      // No longer proceeding automatically on failure
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card">
      <ShieldCheck className="icon-header" size={48} color="#ff3a71" />
      <h2>Level 1: Authorization Check</h2>
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
          <p style={{ fontSize: '1.4rem' }}>✅ Identity Verified.</p>
          <p>Welcome, Trouble Queen 😜</p>
        </motion.div>
      )}
    </motion.div>
  );
};

// --- Level 2: Bond Strength Test ---
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
      <h2>Level 2: Bond Strength Test</h2>
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

// --- Level 3: Pattern Match Challenge ---
// --- Level 3: Pattern Lock Challenge ---
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
      <h2>Level 3: Sister Bond Code</h2>
      <p className="system-msg">“Swipe the Secret Pattern ❤️”</p>
      <p>Connect your nickname: <span style={{ color: '#ff4d6d', fontWeight: '800' }}>S ➔ U ➔ M ➔ U</span></p>

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

// --- Level 4: Heart Runner ---
const Level4 = ({ onNext }) => {
  const [count, setCount] = useState(0);
  const [hearts, setHearts] = useState([]);
  const [started, setStarted] = useState(false);
  const [displayCharX, setDisplayCharX] = useState(50);
  const charXRef = useRef(50);
  const gameAreaRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const lastCatchTime = useRef(0);

  useEffect(() => {
    if (!started || gameOver) return;

    let localCount = 0;

    const interval = setInterval(() => {
      const now = Date.now();
      if (localCount < 5) {
        const id = Math.random().toString(36).substr(2, 9);
        setHearts(prev => [...prev.filter(h => h.y < 105), { 
          id, 
          x: Math.random() * 84 + 8, 
          y: -10,
          speed: Math.random() * 1.5 + 1.5 
        }]);
      }
    }, 1500);

    const gameLoop = setInterval(() => {
      const now = Date.now();
      setHearts(prev => {
        const next = [];
        let caughtThisFrame = false;

        for (const h of prev) {
          const newY = h.y + h.speed;
          
          // Collision detection
          const isCaught = 
            !caughtThisFrame &&
            now - lastCatchTime.current > 300 && // 300ms cooldown between catches
            newY > 75 && newY < 90 && 
            Math.abs(h.x - charXRef.current) < 10;

          if (isCaught && localCount < 5) {
            localCount++;
            setCount(localCount);
            caughtThisFrame = true;
            lastCatchTime.current = now;
            
            if (localCount >= 5) {
              setGameOver(true);
              setTimeout(onNext, 1200);
            }
            continue; 
          }

          if (newY < 110) {
            next.push({ ...h, y: newY });
          }
        }
        return next;
      });
    }, 32);

    return () => {
      clearInterval(interval);
      clearInterval(gameLoop);
    };
  }, [started, gameOver, onNext]);

  const handleMove = (clientX) => {
    if (!gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const boundedX = Math.max(8, Math.min(92, x));
    charXRef.current = boundedX;
    setDisplayCharX(boundedX);
  };

  return (
    <motion.div className="glass-card game-container">
      <Gamepad2 className="icon-header" size={48} color="#ff3a71" />
      <h2>Level 4: Heart Runner</h2>
      
      {!started ? (
        <div className="game-prompt">
          <p className="system-msg">“Catch 5 hearts to move to the next level designed by Britto.”</p>
          <p>Catch the falling hearts with the girl! ❤️</p>
          <button onClick={() => setStarted(true)}>Start Game</button>
        </div>
      ) : (
        <>
          <p className="system-msg">Catch 5 hearts!</p>
          <div className="score">Hearts: {count}/5</div>
          <div 
            className="game-area" 
            ref={gameAreaRef}
            onMouseMove={(e) => handleMove(e.clientX)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX)}
            style={{ cursor: 'none', touchAction: 'none' }}
          >
            {hearts.map(h => (
              <div
                key={h.id}
                className="falling-heart"
                style={{ 
                  left: `${h.x}%`, 
                  top: `${h.y}%`,
                  position: 'absolute',
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none'
                }}
              >
                ❤️
              </div>
            ))}
            <div 
              className="character-img-container"
              style={{ 
                left: `${displayCharX}%`,
                position: 'absolute',
                bottom: '10%',
                transform: 'translateX(-50%)',
                pointerEvents: 'none'
              }}
            >
              <img src={sindhuImg} alt="Sindhu" className="game-character-img" />
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

// --- Level 5: Personality Scanner ---
const Level5 = ({ onNext }) => {
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  const videoRef = React.useRef(null);
  const streamRef = React.useRef(null);

  useEffect(() => {
    // Access Camera
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    };

    startCamera();

    const steps = [25, 45, 60, 85, 99, 100];
    let i = 0;
    const timer = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i]);
        i++;
      } else {
        clearInterval(timer);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        setTimeout(() => setComplete(true), 1000);
      }
    }, 1500);

    return () => {
      clearInterval(timer);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <motion.div className="glass-card">
      <Scan className="icon-header" size={48} color="#ff3a71" />
      <h2>Level 5: Pure Bond Scanner</h2>
      
      {!complete ? (
        <div className="scanner-ui">
          <p className="system-msg">Analyzing facial emotional bond... ❤️</p>
          
          <div className="camera-container">
            <video ref={videoRef} autoPlay playsInline muted className="camera-feed" />
            <div className="scan-line-overlay"></div>
            <div className="corner-tl"></div>
            <div className="corner-tr"></div>
            <div className="corner-bl"></div>
            <div className="corner-br"></div>
          </div>

          <div className="progress-bar" style={{ marginTop: '25px' }}>
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--primary)' }}>{progress}%</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="scan-results">
          <h3 className="success-text" style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Bond Analysis Complete ✅</h3>
          <ul className="results-list">
            <li><span>Teasing Skills:</span> Advanced 😜</li>
            <li><span>Argument Mode:</span> Strong 💪</li>
            <li><span>Laugh Impact:</span> Dangerous 😂</li>
            <li><span>Loyalty Index:</span> 100% 💖</li>
            <li><span>Hidden Care:</span> Extremely High ✨</li>
          </ul>
          <button onClick={onNext} style={{ marginTop: '20px' }}>Proceed, Sister! ❤️</button>
        </motion.div>
      )}
    </motion.div>
  );
};

// --- Level 6: Gossip Speed ---
const Level6 = ({ onNext, onPenalty, onCheat }) => {
  const [timer, setTimer] = useState(10);
  const [started, setStarted] = useState(false);
  const [input, setInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (started && timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    } else if (started && timer === 0) {
      if (input.trim().length < 20) { // Requirement increased with time
        onPenalty();
      }
      setAnalyzing(true);
      setTimeout(onNext, 4000);
    }
  }, [started, timer, input, onNext, onPenalty]);

  return (
    <motion.div className="glass-card">
      <Zap className="icon-header" size={48} color="#ff3a71" />
      <h2>Level 6: Gossip Queen Speed</h2>
      <p className="system-msg">Checking Your Daily Gossip Stats... 🎙️</p>
      
      {!started ? (
        <>
          <p>Type the fastest gossip update you know in 20 seconds. Show your power! 😂</p>
          <p style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>Note: Typing only! Pasting is forbidden. 🚫</p>
          <button onClick={() => setStarted(true)}>Start Timer</button>
        </>
      ) : analyzing ? (
        <div className="overheat">
          <p>Loading... This gossip is too spicy for Britto’s servers. 🔥</p>
          <p className="error-text">System Overload! Gossip overload detected. 🤣</p>
          <Loader2 className="spinning" />
        </div>
      ) : (
        <div className="gossip-input">
          <p className="system-msg">TYPE FAST, SINDHU SIS!!! 🚀</p>
          <p className="timer">Time left: {timer}s</p>
          <textarea 
            autoFocus
            placeholder="Type your spicy update here..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPaste={(e) => {
              e.preventDefault();
              alert("🚫 CHEAT DETECTED! No pasting gossip! Britto wants you to type it! +1 Penalty 🍫");
              onPenalty();
              onCheat();
            }}
          />
        </div>
      )}
    </motion.div>
  );
};

// --- Level 7: Anger ---
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
      <h2>Level 7: What If Britto Is Angry?</h2>
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

// --- Level 8: Shooter Game (Cupid Archery) ---
const Level8 = ({ onNext, onPenalty }) => {
  const [hits, setHits] = useState(0);
  const [arrows, setArrows] = useState(10);
  const [boyY, setBoyY] = useState(50);
  const [direction, setDirection] = useState(1);
  const [shots, setShots] = useState([]);
  const [impacts, setImpacts] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const arenaRef = useRef(null);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setBoyY(prev => {
        let next = prev + (direction * 3);
        if (next >= 85) setDirection(-1);
        if (next <= 15) setDirection(1);
        return next;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [direction, gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setShots(prev => {
        const nextShots = prev.map(s => ({ 
          ...s, 
          x: s.x + 8,
          y: s.y + (s.targetY - 50) * 0.05
        })).filter(s => s.x < 100);
        
        nextShots.forEach((s) => {
          if (!s.hit && s.x >= 75 && s.x <= 85) {
            if (Math.abs(s.y - boyY) < 15) {
              s.hit = true;
              handleHit(s.x, s.y);
            }
          }
        });

        return nextShots.filter(s => !s.hit);
      });
    }, 30);
    return () => clearInterval(interval);
  }, [boyY, gameOver]);

  const handleHit = (x, y) => {
    setHits(h => {
      const newHits = h + 1;
      if (newHits >= 5) {
        setGameOver(true);
        setTimeout(onNext, 1500);
      }
      return newHits;
    });
    setImpacts(prev => [...prev, { id: Date.now(), x, y }]);
    setTimeout(() => {
      setImpacts(prev => prev.slice(1));
    }, 500);
  };

  const shoot = (e) => {
    if (gameOver || arrows <= 0) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setArrows(p => p - 1);
    setShots(prev => [...prev, { id: Date.now(), x: 15, y: 50, targetY: y, hit: false }]);
  };

  const refillArrows = () => {
    onPenalty();
    setArrows(10);
  };

  const handleMouseMove = (e) => {
    if (!arenaRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const aimAngle = Math.atan2(mousePos.y - 50, mousePos.x - 15) * (180 / Math.PI);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card full-arena-card">
      <div className="arena-header">
        <Zap size={32} color="#ff3a71" />
        <div className="arena-titles">
          <h3>Tactical Heart Defense</h3>
          <p>Target Locked: Capture Britto’s Heart 🎯</p>
        </div>
      </div>

      <div className="shooter-arena" ref={arenaRef} onClick={shoot} onMouseMove={handleMouseMove}>
        <div className="shooter-header">
          <div className="heart-lives">
            {[...Array(5)].map((_, i) => (
              <span key={i} style={{ opacity: i < hits ? 1 : 0.2 }}>�</span>
            ))}
          </div>
          <div className="arrow-count">ENERGY: {arrows}</div>
        </div>

        <div className="shooter-crosshair" style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }}>
          <div className="ch-line-h"></div>
          <div className="ch-line-v"></div>
          <div className="ch-dot"></div>
        </div>

        <div className="shooter-sister aiming">
          <div className="shooter-name-tag">Operator: Sindhu</div>
          <div className="shooter-visual-avatar">
            <img src={sindhuImg} alt="Sindhu" className="hud-avatar-img" />
            <div className="hud-scan-line"></div>
          </div>
          <div className="energy-cannon" style={{ transform: `translateY(-50%) rotate(${aimAngle}deg)` }}>
            <div className="cannon-glow"></div>
            <Zap size={24} color="#fff" />
          </div>
        </div>

        {!gameOver && arrows > 0 && (
          <div 
            className="aiming-line" 
            style={{ 
              top: '50%', 
              left: '15%', 
              width: `${Math.sqrt(Math.pow(mousePos.x - 15, 2) + Math.pow(mousePos.y - 50, 2))}%`,
              transform: `rotate(${aimAngle}deg)`
            }} 
          />
        )}

        {shots.map(s => (
          <div key={s.id} className="projectile energy-bolt" style={{ left: `${s.x}%`, top: `${s.y}%`, transform: `rotate(${aimAngle}deg)` }}>
            <div className="bolt-core"></div>
            <div className="bolt-trail"></div>
          </div>
        ))}

        {impacts.map(i => (
          <div key={i.id} className="impact-effect" style={{ left: `${i.x}%`, top: `${i.y}%` }}>💥</div>
        ))}

        <div className="shooter-target running" style={{ top: `${boyY}%` }}>
          <div className="target-hud-marker">
            <div className="marker-bracket-tl"></div>
            <div className="marker-bracket-tr"></div>
            <div className="marker-bracket-bl"></div>
            <div className="marker-bracket-br"></div>
            <div className="target-name">TARGET ID: BRITTO</div>
            <div className="target-visual">
              {gameOver ? '🏳️' : <img src={brittoImg} alt="Britto" className="target-avatar-img" />}
            </div>
          </div>
        </div>

        {arrows === 0 && !gameOver && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="refill-overlay">
            <div className="refill-popup">
              <p>Energy Depleted! �</p>
              <button className="refill-btn" onClick={(e) => { e.stopPropagation(); refillArrows(); }}>Recharge (+1 🍫 Penalty)</button>
            </div>
          </motion.div>
        )}

        {gameOver && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mini-popup">Mission Success! 🏆❤️</motion.div>
        )}

        <div className="game-stats-overlay">SYSTEM STATUS: NOMINAL | HITS: {hits}/5</div>
      </div>
    </motion.div>
  );
};

// --- Level 9: Final Reveal ---
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
          <h2>Level 9: Emotional Percentage</h2>
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

const BrittoCard = () => (
  <div className="britto-reveal-card">
    <div className="card-border">
      <div className="card-header">
        <Trophy size={20} color="#d4af37" />
        <span>REWARD CARD</span>
      </div>
      <div className="card-content">
        <div className="britto-visual">
          <img src={brittoImg} alt="Britto" className="card-avatar-img" />
        </div>
        <div className="britto-name">BRITTO</div>
        <div className="britto-title">The Best Brother in the World</div>
      </div>
      <div className="card-footer">
        <Heart size={14} color="#ff3a71" fill="#ff3a71" />
        <span>Sister's Pride</span>
        <Heart size={14} color="#ff3a71" fill="#ff3a71" />
      </div>
    </div>
  </div>
);

const ScratchCardLevel = ({ onNext }) => {
  const [scratched, setScratched] = useState(false);
  const canvasRef = React.useRef(null);
  const isDrawing = React.useRef(false);

  useEffect(() => {
    // ... (Existing canvas logic remains the same)
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const initCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0) return; // Prevent 0-size canvas
      
      canvas.width = rect.width;
      canvas.height = rect.height;

      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#b0b0b0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#666';
      ctx.font = 'bold 24px Outfit';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Scratch to Reveal', canvas.width/2, canvas.height/2);
    };

    initCanvas();
    // Re-init on resize
    window.addEventListener('resize', initCanvas);

    const checkScratched = () => {
      const ctx = canvas.getContext('2d');
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let count = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i+3] === 0) count++;
      }
      if (count / (pixels.length / 4) > 0.5) { // Lower threshold for easier completion
        setScratched(true);
      }
    };

    const scratch = (e) => {
      if (!isDrawing.current) return;
      
      const rect = canvas.getBoundingClientRect();
      const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
      
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      const ctx = canvas.getContext('2d');
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 40, 0, Math.PI * 2);
      ctx.fill();
    };

    const startDrawing = (e) => {
      isDrawing.current = true;
      scratch(e);
    };

    const stopDrawing = () => {
      if (isDrawing.current) {
        isDrawing.current = false;
        checkScratched();
      }
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      scratch(e);
    }, { passive: false });
    window.addEventListener('mouseup', stopDrawing);
    window.addEventListener('touchend', stopDrawing);

    return () => {
      window.removeEventListener('resize', initCanvas);
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('mousemove', scratch);
      window.removeEventListener('mouseup', stopDrawing);
      window.removeEventListener('touchend', stopDrawing);
    };
  }, []);

  return (
    <div className="scratch-container glass-card">
      <h2 className="cursive">Final Memory Box 🎁</h2>
      <p>Scratch to reveal a special memory!</p>
      <div className="scratch-area">
        <div className="revealed-content">
          <div className="memory-frame">
            <img src={sindhuImg} alt="Memory" className="memory-img-reveal" />
            <div className="memory-tag">Sindhu Akka ✨❤️</div>
          </div>
        </div>
        {!scratched && <canvas ref={canvasRef} className="scratch-canvas" />}
      </div>
      {scratched && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="success-text">Beautiful! Now, read your message... 🥰</p>
          <button onClick={onNext} className="final-btn">Open My Heart 💌</button>
        </motion.div>
      )}
    </div>
  );
};

// --- Final Surprise ---
const FinalMessage = ({ chocolates, cheated }) => {
  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const reportTitle = "Sister Bond Challenge Report 🏆";
  const shareText = `Hey! I finished the Sister Bond Challenge.
Total Chocolate Penalty: ${chocolates} 🍫
${cheated ? 'Wait... I also got caught cheating! 😜🚫' : 'I played fair! ✅'}
Waiting for my gifts! ✨❤️`;

  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });

    // --- Automatic Silent Email Send ---
    const sendAutoReport = async () => {
      try {
        await fetch("https://formsubmit.co/ajax/4d3d6f213cfe57db73a76cfb4a583d0c", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            Subject: `🏆 Challenge Completed! Total Penalty: ${chocolates} Chocolates! 🍫`,
            "Chocolate Penalty": chocolates,
            "Cheated Detected": cheated ? "YES 🚫" : "NO ✅",
            Message: shareText,
            "_captcha": "false"
          })
        });
        console.log("Report sent to Britto!");
      } catch (err) {
        console.error("Auto-report failed", err);
      }
    };

    sendAutoReport();
  }, [chocolates, cheated, shareText]);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: reportTitle,
          text: shareText,
        });
      } catch (err) {
        console.log('Share failed');
      }
    } else {
      alert("Sharing not supported on this browser. Try WhatsApp or Email!");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${reportTitle}\n${shareText}`);
    alert("Report copied to clipboard! You can paste it anywhere 📋✨");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="glass-card final-letter"
    >
      <Trophy size={60} color="#ff3a71" style={{ marginBottom: '20px' }} />
      <h1 className="cursive">My dear Sindhu Akka,</h1>
      
      <div className="penalty-summary">
        Total Penalty: <span style={{ color: '#d4af37', fontWeight: '900' }}>{chocolates} Chocolates</span> 🍫
      </div>

      {cheated && (
        <p className="error-text" style={{ fontSize: '0.8rem', padding: '8px', borderStyle: 'dashed' }}>
          ⚠️ Honest confession: Cheat attempts were detected! 😜
        </p>
      )}

      <p>
        I am truly grateful for you. I don’t even know how we became this close, but today you are one of the most important people in my life. You will always be my cutest sister.
      </p>
      <p>
        No matter where life takes me or where I am, I will always be there for you. Thank you for standing by me, supporting me, and being there through everything. I honestly need you in my life forever.
      </p>
      <h2 style={{ fontSize: '1.4rem', marginTop: '10px' }}>Love you so much, Sindhu Akka ❤️</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '25px' }}>
        <button 
          className="outline-btn" 
          style={{ padding: '10px' }}
          onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')}
        >
          <Send size={16} /> WhatsApp
        </button>

        <button 
          className="outline-btn" 
          style={{ padding: '10px' }}
          onClick={() => {
            const subject = encodeURIComponent("Sister Bond Results! 🏆");
            window.location.href = `mailto:ilayamdharshini@gmail.com?subject=${subject}&body=${encodeURIComponent(shareText)}`;
          }}
        >
          <MessageCircleHeart size={16} /> Email
        </button>

        <button 
          className="outline-btn" 
          style={{ padding: '10px' }}
          onClick={handleNativeShare}
        >
          <Share2 size={16} /> Share All
        </button>

        <button 
          className="outline-btn" 
          style={{ padding: '10px' }}
          onClick={copyToClipboard}
        >
          <Copy size={16} /> Copy Report
        </button>
      </div>

      <Sparkles className="sparkle-icon" />
    </motion.div>
  );
};

const FloatingHearts = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const items = ['❤️', '💖', '💗', '💓', '💞', '💕', '💘', '🌸', '✨'];
    const interval = setInterval(() => {
      setParticles(prev => [...prev.slice(-50), {
        id: Date.now() + Math.random(),
        char: items[Math.floor(Math.random() * items.length)],
        left: Math.random() * 100,
        size: Math.random() * 25 + 15,
        duration: Math.random() * 8 + 6,
        delay: Math.random() * 5
      }]);
    }, 4500); // Slower interval but we spawn more per tick or keep more alive
    
    // Actually, let's just make it spawn much faster for "more hearts"
    const fastInterval = setInterval(() => {
        setParticles(prev => [...prev.slice(-60), {
          id: Date.now() + Math.random(),
          char: items[Math.floor(Math.random() * items.length)],
          left: Math.random() * 100,
          size: Math.random() * 20 + 10,
          duration: Math.random() * 12 + 8,
          delay: 0
        }]);
      }, 600);

    return () => {
        clearInterval(interval);
        clearInterval(fastInterval);
    };
  }, []);

  return (
    <div className="particles-container">
      {particles.map(p => (
        <span 
          key={p.id} 
          className="floating-heart-particle"
          style={{ 
            left: `${p.left}%`, 
            fontSize: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`
          }}
        >
          {p.char}
        </span>
      ))}
    </div>
  );
};

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
        {level <= 9 ? `Level ${level}` : "Final Surprise ❤️"}
      </div>
      <ChocolateBadge />
      
      <AnimatePresence mode="wait">
        {level === 1 && <Level1 key="l1" onNext={nextLevel} onPenalty={addPenalty} />}
        {level === 2 && <Level2 key="l2" onNext={nextLevel} onPenalty={addPenalty} />}
        {level === 3 && <Level3 key="l3" onNext={nextLevel} onPenalty={addPenalty} />}
        {level === 4 && <Level4 key="l4" onNext={nextLevel} />}
        {level === 5 && <Level5 key="l5" onNext={nextLevel} />}
        {level === 6 && <Level6 key="l6" onNext={nextLevel} onPenalty={addPenalty} onCheat={addCheat} />}
        {level === 7 && <Level7 key="l7" onNext={nextLevel} onPenalty={addPenalty} />}
        {level === 8 && <Level8 key="l8" onNext={nextLevel} onPenalty={addPenalty} />}
        {level === 9 && <Level9 key="l9" onNext={nextLevel} />}
        {level === 10 && <ScratchCardLevel key="l10" onNext={nextLevel} />}
        {level >= 11 && <FinalMessage key="final" chocolates={chocolates} cheated={cheated} />}
      </AnimatePresence>
    </div>
  );
}

export default App;
