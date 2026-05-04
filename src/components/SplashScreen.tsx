import React from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 40%, #A5D6A7 100%)',
        zIndex: 1000,
        overflow: 'hidden',
      }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      {/* Animated background elements */}
      <motion.div
        style={{ position: 'absolute', top: '10%', left: '10%', fontSize: 40, opacity: 0.3 }}
        animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        🍃
      </motion.div>
      <motion.div
        style={{ position: 'absolute', top: '20%', right: '15%', fontSize: 30, opacity: 0.25 }}
        animate={{ y: [0, -10, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
      >
        🌿
      </motion.div>
      <motion.div
        style={{ position: 'absolute', bottom: '25%', left: '20%', fontSize: 35, opacity: 0.2 }}
        animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      >
        🍀
      </motion.div>
      <motion.div
        style={{ position: 'absolute', bottom: '15%', right: '10%', fontSize: 28, opacity: 0.25 }}
        animate={{ y: [0, -8, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, delay: 1.5 }}
      >
        🌱
      </motion.div>

      {/* Floating flowers */}
      <motion.div
        style={{ position: 'absolute', top: '15%', left: '50%', fontSize: 24, opacity: 0.3 }}
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        🌸
      </motion.div>
      <motion.div
        style={{ position: 'absolute', top: '60%', left: '15%', fontSize: 20, opacity: 0.2 }}
        animate={{ y: [0, -15, 0], x: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 2 }}
      >
        🌺
      </motion.div>

      {/* Main logo content */}
      <motion.div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, type: 'spring' }}
      >
        {/* Big garden emoji with pulse */}
        <motion.div
          style={{ fontSize: 80 }}
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          🏡
        </motion.div>

        {/* Title */}
        <motion.div
          style={{ textAlign: 'center' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 900,
              color: '#1B5E20',
              letterSpacing: '-0.5px',
            }}
          >
            JozGames
          </h1>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: '#2E7D32',
              marginTop: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              justifyContent: 'center',
            }}
          >
            <span>🌻</span>
            <span>Garden Solitaire</span>
            <span>🌻</span>
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          style={{
            margin: 0,
            fontSize: 14,
            color: '#43A047',
            opacity: 0.8,
            fontWeight: 600,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          Grow your garden one card at a time
        </motion.p>
      </motion.div>

      {/* Loading bar */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '15%',
          width: '60%',
          maxWidth: 200,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div
          style={{
            height: 6,
            background: 'rgba(129, 199, 132, 0.3)',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <motion.div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #66BB6A 0%, #43A047 50%, #66BB6A 100%)',
              borderRadius: 3,
              backgroundSize: '200% 100%',
            }}
            initial={{ width: '0%' }}
            animate={{ 
              width: '100%',
              backgroundPosition: ['0% center', '200% center'],
            }}
            transition={{ 
              width: { duration: 2.5, ease: 'easeInOut' },
              backgroundPosition: { duration: 1, repeat: Infinity, ease: 'linear' },
            }}
          />
        </div>
        <motion.p
          style={{
            textAlign: 'center',
            fontSize: 12,
            color: '#66BB6A',
            marginTop: 8,
            fontWeight: 700,
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Planting seeds...
        </motion.p>
      </motion.div>

      {/* Version */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '5%',
          fontSize: 11,
          color: '#81C784',
          opacity: 0.6,
          fontWeight: 600,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.5 }}
      >
        v1.0.0
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
