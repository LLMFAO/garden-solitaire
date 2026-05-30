import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

interface TopBarProps {
  onMenuOpen: () => void;
  onAutoSolve?: () => void;
  onUndo?: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuOpen, onAutoSolve, onUndo }) => {
  const score = useGameStore((s) => s.score);
  const timeElapsed = useGameStore((s) => s.timeElapsed);
  const gameStatus = useGameStore((s) => s.gameStatus);
  const foundation = useGameStore((s) => s.foundation);
  const moves = useGameStore((s) => s.moves);
  const gardenBoosts = useGameStore((s) => s.gardenBoosts);
  const canUndo = useGameStore((s) => s.history.length > 0);

  const foundationProgress = foundation.reduce((sum, p) => sum + p.length, 0) / 52;
  const activityCount = moves;
  const activityProgress = activityCount === 0 ? 0 : Math.min(0.98, 0.04 + activityCount / 135);
  const boostProgress = Math.min(0.35, gardenBoosts * 0.025);
  const gardenProgress = Math.round(Math.min(1, Math.max(foundationProgress, activityProgress) + boostProgress) * 100);

  return (
    <motion.div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'calc(8px + env(safe-area-inset-top)) 12px 8px',
        background: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 20,
        margin: '6px 8px 0',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 12px rgba(27, 94, 32, 0.08)',
        position: 'relative',
        zIndex: 10,
        border: '1px solid rgba(129, 199, 132, 0.3)',
      }}
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
    >
      <motion.button
        onTap={onMenuOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)',
          color: 'white',
          border: 'none',
          borderRadius: 14,
          padding: '6px 14px',
          fontSize: 14,
          fontWeight: 800,
          cursor: 'pointer',
          fontFamily: 'inherit',
          boxShadow: '0 2px 8px rgba(67, 160, 71, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        🌿
      </motion.button>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <span>🌱</span>
            <span>{score}</span>
          </div>
          <div style={{ opacity: gameStatus === 'playing' ? 1 : 0.5 }}>{formatTime(timeElapsed)}</div>
        </div>

        {/* Garden progress bar */}
        <div
          style={{
            width: '100%',
            maxWidth: 120,
            height: 6,
            background: 'rgba(129, 199, 132, 0.2)',
            borderRadius: 3,
            marginTop: 4,
            overflow: 'hidden',
          }}
        >
          <motion.div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #66BB6A 0%, #00E676 100%)',
              borderRadius: 3,
            }}
            animate={{ width: `${gardenProgress}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <motion.button
          onTap={() => canUndo && onUndo?.()}
          disabled={!canUndo}
          aria-label="Undo move"
          whileHover={canUndo ? { scale: 1.05 } : undefined}
          whileTap={canUndo ? { scale: 0.95 } : undefined}
          style={{
            background: canUndo
              ? 'linear-gradient(135deg, #FFFFFF 0%, #E8F5E9 100%)'
              : 'rgba(255,255,255,0.45)',
            color: canUndo ? 'var(--text-primary)' : 'rgba(27, 94, 32, 0.35)',
            border: '1px solid rgba(129, 199, 132, 0.45)',
            borderRadius: 14,
            padding: '6px 10px',
            fontSize: 15,
            fontWeight: 900,
            cursor: canUndo ? 'pointer' : 'default',
            fontFamily: 'inherit',
            boxShadow: canUndo ? '0 2px 8px rgba(27, 94, 32, 0.12)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}
        >
          ↶
        </motion.button>

        <motion.button
          onTap={onAutoSolve}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'linear-gradient(135deg, #FFD600 0%, #FFA000 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 14,
            padding: '6px 14px',
            fontSize: 14,
            fontWeight: 800,
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: '0 2px 8px rgba(255, 214, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          ✨
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TopBar;
