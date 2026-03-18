import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Send, MessageCircleHeart, Share2, Copy, Sparkles, Heart } from 'lucide-react';

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

  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });

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
      
      <motion.div 
        whileHover={{ scale: 1.1 }} 
        whileTap={{ scale: 0.9 }}
        style={{ marginTop: '40px', cursor: 'pointer' }}
        onClick={() => {
          sendAutoReport();
          const subject = encodeURIComponent("Sister Bond Results! 🏆");
          window.location.href = `mailto:ilayamdharshini@gmail.com?subject=${subject}&body=${encodeURIComponent(shareText)}`;
        }}
      >
        <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto' }}>
          <Heart size={80} color="#ff3a71" fill="#ff3a71" style={{ filter: 'drop-shadow(0 0 20px #ff3a71)' }} />
          <motion.div 
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#ff3a71', zIndex: -1 }}
          />
        </div>
        <p style={{ marginTop: '15px', color: '#ff3a71', fontWeight: 900, fontSize: '0.9rem' }}>TAP HEART TO SEND REPORT ❤️</p>
      </motion.div>

      <Sparkles className="sparkle-icon" />
    </motion.div>
  );
};

export default FinalMessage;
