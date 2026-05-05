import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useSettingsStore } from '../store/settingsStore';
import { WinParticles } from './WinParticles';

interface WinOverlayProps {
  isOpen: boolean;
  onNewGame: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export const WinOverlay: React.FC<WinOverlayProps> = ({ isOpen, onNewGame }) => {
  const score = useGameStore((s) => s.score);
  const timeElapsed = useGameStore((s) => s.timeElapsed);
  const moves = useGameStore((s) => s.moves);
  const recordGameResult = useSettingsStore((s) => s.recordGameResult);

  React.useEffect(() => {
    if (isOpen) {
      recordGameResult(true, timeElapsed, score);
    }
  }, [isOpen, timeElapsed, score, recordGameResult]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {<WinParticles active={isOpen} />}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(27, 94, 32, 0.6)',
              backdropFilter: 'blur(8px)',
              zIndex: 180,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 'env(safe-area-inset-top)',
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              style={{
                width: 'min(360px, 90vw)',
                background: 'linear-gradient(135deg, #fff 0%,#F1F8E9 50%,#E8F5E9 100%)',
                borderRadius: 32,
                padding: 36,
                textAlign: 'center',
                boxShadow: '0 30px 100px rgba(27, 94, 32, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 20,
                border: '3px solid rgba(129, 199, 132, 0.4)',
              }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                style={{ fontSize: 72 }}
              >
                🏡
              </motion.div>

              <h1
                style={{
                  margin: 0,
                  fontSize: 32,
                  color: '#1B5E20',
                  fontWeight: 900,
                }}
              >
                Garden Complete!
              </h1>

              <p style={{ margin: 0, fontSize: 15, color: '#2E7D32', opacity: 0.8 }}>
                Your garden is in full bloom! 🌸🌺🌻
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 16,
                  width: '100%',
                  padding: '20px 0',
                  background: 'rgba(129, 199, 132, 0.15)',
                  borderRadius: 20,
                }}
              >
                <Stat label="🌱 Score" value={score} />
                <Stat label="⏱️ Time" value={formatTime(timeElapsed)} />
                <Stat label="🌿 Moves" value={moves} />
              </div>

              <motion.button
                onTap={onNewGame}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '16px 40px',
                  borderRadius: 22,
                  border: 'none',
                  background: 'linear-gradient(135deg, #66BB6A 0%,#43A047 100%)',
                  color: 'white',
                  fontSize: 18,
                  fontWeight: 900,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: '0 6px 24px rgba(67, 160, 71, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>🌻</span>
                <span>Plant New Garden</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Stat: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div>
    <div style={{ fontSize: 24, fontWeight: 900, color: '#43A047' }}>{value}</div>
    <div style={{ fontSize: 12, color: '#1B5E20', opacity: 0.6, marginTop: 2 }}>{label}</div>
  </div>
);

export default WinOverlay;
