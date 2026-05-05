import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useGameTimer } from '../hooks/useGameTimer';
import { TopBar } from './TopBar';
import { StockWaste } from './StockWaste';
import { Foundation } from './Foundation';
import { Tableau } from './Tableau';
import { MenuOverlay } from './MenuOverlay';
import { WinOverlay } from './WinOverlay';
import { GardenBackground } from './GardenBackground';
import { GardenFacts } from './GardenFacts';

export const GameBoard: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const gameStatus = useGameStore((s) => s.gameStatus);
  const newGame = useGameStore((s) => s.newGame);
  const checkAutoWin = useGameStore((s) => s.checkAutoWin);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [lastActivity, setLastActivity] = React.useState(Date.now());

  useGameTimer();

  const updateActivity = () => setLastActivity(Date.now());

  React.useEffect(() => {
    if (gameStatus === 'idle') {
      newGame();
    }
  }, [gameStatus, newGame]);

  const handleNewGame = () => {
    newGame();
  };

  // Auto-detect solvable states and auto-play to foundation
  React.useEffect(() => {
    if (gameStatus !== 'playing') return;
    const interval = setInterval(() => {
      checkAutoWin();
    }, 2000);
    return () => clearInterval(interval);
  }, [gameStatus, checkAutoWin]);

  return (
    <motion.div
      className="garden-bg"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onClick={updateActivity}
      onTouchStart={updateActivity}
    >
      <GardenBackground />
      <TopBar onMenuOpen={() => { updateActivity(); setMenuOpen(true); }} onAutoSolve={checkAutoWin} />

      <motion.div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: '12px clamp(8px, 2.5vw, 16px) 4px',
          gap: 8,
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        <StockWaste compact={compact} />
        <Foundation compact={compact} />
      </motion.div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 20, position: 'relative', zIndex: 1 }}>
        <Tableau compact={compact} />
      </div>

      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <WinOverlay isOpen={gameStatus === 'won'} onNewGame={handleNewGame} />
      <GardenFacts lastActivity={lastActivity} />
    </motion.div>
  );
};

export default GameBoard;
