import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import sindhuImg from '../assets/sindhu.jpeg';

const ScratchCardLevel = ({ onNext }) => {
  const [scratched, setScratched] = useState(false);
  const canvasRef = React.useRef(null);
  const isDrawing = React.useRef(false);

  useEffect(() => {
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

export default ScratchCardLevel;
