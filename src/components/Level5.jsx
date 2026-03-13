import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Scan } from 'lucide-react';

const Level5 = ({ onNext }) => {
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

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
      <h2>Pure Bond Scanner</h2>
      
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

export default Level5;
