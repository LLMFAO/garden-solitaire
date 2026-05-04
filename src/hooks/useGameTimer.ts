import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export function useGameTimer() {
  const gameStatus = useGameStore((s) => s.gameStatus);
  const tickTimer = useGameStore((s) => s.tickTimer);

  useEffect(() => {
    if (gameStatus !== 'playing') return;
    const interval = setInterval(() => {
      tickTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [gameStatus, tickTimer]);
}
