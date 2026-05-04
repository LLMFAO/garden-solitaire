import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { SplashScreen } from './components/SplashScreen';
import { GameBoard } from './components/GameBoard';
import { useCompactMode } from './hooks/useCompactMode';
import { useSettingsStore } from './store/settingsStore';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = React.useState(true);
  const isCompact = useCompactMode();
  const theme = useSettingsStore((s) => s.theme);

  return (
    <div className="app-shell" data-theme={theme}>
      <div className="app-frame">
        <AnimatePresence mode="wait">
          {showSplash ? (
            <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
          ) : (
            <GameBoard key={`game-${theme}`} theme={theme} compact={isCompact} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;
