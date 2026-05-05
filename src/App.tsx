import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { SplashScreen } from './components/SplashScreen';
import { GameBoard } from './components/GameBoard';
import { useCompactMode } from './hooks/useCompactMode';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = React.useState(true);
  const isCompact = useCompactMode();

  return (
    <div className="app-shell">
      <div className="app-frame">
        <AnimatePresence mode="wait">
          {showSplash ? (
            <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
          ) : (
            <GameBoard key="game" compact={isCompact} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;
