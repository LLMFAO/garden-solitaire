import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  emoji: string;
}

const PLANT_EMOJIS = ['🌸', '🌺', '🌻', '🌷', '🌹', '🍀', '🌿', '🌱', '🌲', '🌳'];

export const WinParticles: React.FC<{ active: boolean }> = ({ active }) => {
  const [particles] = React.useState<Particle[]>(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 4 + Math.random() * 4,
      size: 16 + Math.random() * 24,
      emoji: PLANT_EMOJIS[Math.floor(Math.random() * PLANT_EMOJIS.length)],
    }));
  });

  return (
    <AnimatePresence>
      {active && (
        <>
          {/* Growing vines overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              overflow: 'hidden',
              zIndex: 200,
            }}
          >
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ y: '110vh', x: `${p.x}vw`, opacity: 0, scale: 0, rotate: -30 }}
                animate={{
                  y: '-20vh',
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1.2, 1],
                  rotate: [0, 20, -20, 0],
                  x: [`${p.x}vw`, `${p.x + (Math.random() * 20 - 10)}vw`],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
                style={{
                  position: 'absolute',
                  fontSize: p.size,
                  top: 0,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                }}
              >
                {p.emoji}
              </motion.div>
            ))}

            {/* Blooming flowers at bottom */}
            {Array.from({ length: 12 }, (_, i) => (
              <motion.div
                key={`flower-${i}`}
                initial={{ scale: 0, y: 50 }}
                animate={{
                  scale: [0, 1.3, 1],
                  y: [50, 0, 0],
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.15,
                  type: 'spring',
                  stiffness: 200,
                }}
                style={{
                  position: 'absolute',
                  bottom: `${10 + Math.random() * 20}%`,
                  left: `${5 + i * 8}%`,
                  fontSize: 30 + Math.random() * 20,
                }}
              >
                {['🌸', '🌺', '🌻', '🌷', '🌹', '🌼'][i % 6]}
              </motion.div>
            ))}

            {/* Fireflies */}
            {Array.from({ length: 15 }, (_, i) => (
              <motion.div
                key={`firefly-${i}`}
                animate={{
                  x: [0, Math.random() * 100 - 50, 0],
                  y: [0, Math.random() * -80 - 20, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 3,
                  repeat: Infinity,
                }}
                style={{
                  position: 'absolute',
                  bottom: `${20 + Math.random() * 30}%`,
                  left: `${Math.random() * 100}%`,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#FFD600',
                  boxShadow: '0 0 10px #FFD600',
                }}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WinParticles;
