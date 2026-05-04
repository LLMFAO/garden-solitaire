import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useSettingsStore } from '../store/settingsStore';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MenuOverlay: React.FC<MenuOverlayProps> = ({ isOpen, onClose }) => {
  const newGame = useGameStore((s) => s.newGame);
  const drawMode = useGameStore((s) => s.drawMode);
  const [selectedDrawMode, setSelectedDrawMode] = React.useState<1 | 3>(drawMode);

  React.useEffect(() => {
    if (isOpen) setSelectedDrawMode(drawMode);
  }, [drawMode, isOpen]);

  const { autoMoveToFoundation, toggleAutoMove, stats, resetStats, hapticsEnabled, toggleHaptics } = useSettingsStore();

  const handleNewGame = () => {
    newGame(selectedDrawMode);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(27, 94, 32, 0.4)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              zIndex: 150,
              touchAction: 'none',
            }}
          />

          <div
            style={{
              position: 'absolute',
              zIndex: 160,
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
              pointerEvents: 'none',
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 'min(340px, 90vw)',
                maxHeight: '85vh',
                overflowY: 'auto',
                background: 'linear-gradient(135deg, #fff 0%, #F1F8E9 50%, #E8F5E9 100%)',
                borderRadius: 28,
                padding: 28,
                boxShadow: '0 25px 80px rgba(27, 94, 32, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                border: '2px solid rgba(129, 199, 132, 0.3)',
                touchAction: 'auto',
                pointerEvents: 'auto',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: 4 }}>
              <div style={{ fontSize: 48, marginBottom: 4 }}>🌻</div>
              <h2 style={{ margin: 0, fontSize: 24, color: 'var(--text-primary)' }}>
                Garden Solitaire
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)', opacity: 0.7 }}>
                Flower Garden & Zen Garden
              </p>
            </div>

            <motion.button
              onTap={handleNewGame}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: '100%',
                padding: 14,
                borderRadius: 18,
                border: 'none',
                background: 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)',
                color: 'white',
                fontSize: 16,
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: '0 4px 16px rgba(67, 160, 71, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <span>🌱</span>
              <span>New Garden</span>
            </motion.button>

            {/* Draw Mode Toggle */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                background: 'rgba(129, 199, 132, 0.15)',
                borderRadius: 14,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>🌿 New Game Draw</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {[1, 3].map((n) => (
                  <motion.button
                    key={n}
                    onTap={() => setSelectedDrawMode(n as 1 | 3)}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 10,
                      border: 'none',
                      background: selectedDrawMode === n ? '#43A047' : 'white',
                      color: selectedDrawMode === n ? 'white' : 'var(--text-primary)',
                      fontWeight: 800,
                      fontSize: 14,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      boxShadow: selectedDrawMode === n ? '0 2px 8px rgba(67, 160, 71, 0.3)' : 'none',
                    }}
                  >
                    {n}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {<ToggleRow label="🌸 Auto-Move" value={autoMoveToFoundation} onToggle={toggleAutoMove} />}
              {<ToggleRow label="🌺 Haptics" value={hapticsEnabled} onToggle={toggleHaptics} />}
            </div>

            {/* Stats */}
            <div
              style={{
                background: 'rgba(129, 199, 132, 0.15)',
                borderRadius: 14,
                padding: 16,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
              }}
            >
              <Stat label="🌳 Played" value={stats.gamesPlayed} />
              <Stat label="🌹 Won" value={stats.gamesWon} />
              <Stat label="⏱️ Best Time" value={stats.bestTime ? `${Math.floor(stats.bestTime / 60)}:${(stats.bestTime % 60).toString().padStart(2, '0')}` : '--:--'} />
              <Stat label="⭐ Best Score" value={stats.bestScore ?? '--'} />
            </div>

            <motion.button
              onTap={resetStats}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: 10,
                borderRadius: 12,
                border: 'none',
                background: 'transparent',
                color: '#7C4DFF',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Reset Garden Stats
            </motion.button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

const ToggleRow: React.FC<{ label: string; value: boolean; onToggle: () => void }> = ({ label, value, onToggle }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 16px',
      background: 'rgba(129, 199, 132, 0.15)',
      borderRadius: 14,
    }}
  >
    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{label}</span>
    <motion.button
      onTap={onToggle}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        border: 'none',
        background: value ? '#43A047' : '#ccc',
        position: 'relative',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      <motion.div
        animate={{ x: value ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          background: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      />
    </motion.button>
  </div>
);

const Stat: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: 18, fontWeight: 800, color: '#43A047' }}>{value}</div>
    <div style={{ fontSize: 11, color: 'var(--text-primary)', opacity: 0.6, marginTop: 2 }}>{label}</div>
  </div>
);

export default MenuOverlay;
