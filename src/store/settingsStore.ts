import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Stats {
  gamesPlayed: number;
  gamesWon: number;
  bestTime: number | null;
  bestScore: number | null;
  currentStreak: number;
  bestStreak: number;
}

interface SettingsState {
  drawMode: 1 | 3;
  autoMoveToFoundation: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  theme: 'flower' | 'zen';
  stats: Stats;

  setDrawMode: (mode: 1 | 3) => void;
  toggleAutoMove: () => void;
  toggleSound: () => void;
  toggleHaptics: () => void;
  toggleTheme: () => void;
  recordGameResult: (won: boolean, time: number, score: number) => void;
  resetStats: () => void;
}

const initialStats: Stats = {
  gamesPlayed: 0,
  gamesWon: 0,
  bestTime: null,
  bestScore: null,
  currentStreak: 0,
  bestStreak: 0,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      drawMode: 3,
      autoMoveToFoundation: true,
      soundEnabled: false,
      hapticsEnabled: true,
      theme: 'flower' as const,
      stats: initialStats,

      setDrawMode: (mode) => set({ drawMode: mode }),
      toggleAutoMove: () => set((s) => ({ autoMoveToFoundation: !s.autoMoveToFoundation })),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      toggleHaptics: () => set((s) => ({ hapticsEnabled: !s.hapticsEnabled })),
      toggleTheme: () => set((s) => ({
        theme: s.theme === 'flower' ? 'zen' : 'flower'
      })),

      recordGameResult: (won, time, score) => {
        const stats = get().stats;
        const newStats: Stats = {
          gamesPlayed: stats.gamesPlayed + 1,
          gamesWon: stats.gamesWon + (won ? 1 : 0),
          bestTime: won ? (stats.bestTime === null ? time : Math.min(stats.bestTime, time)) : stats.bestTime,
          bestScore: won ? (stats.bestScore === null ? score : Math.max(stats.bestScore, score)) : stats.bestScore,
          currentStreak: won ? stats.currentStreak + 1 : 0,
          bestStreak: won ? Math.max(stats.bestStreak, stats.currentStreak + 1) : stats.bestStreak,
        };
        set({ stats: newStats });
      },

      resetStats: () => set({ stats: initialStats }),
    }),
    {
      name: 'solitaire-settings',
      partialize: (state) => ({
        drawMode: state.drawMode,
        autoMoveToFoundation: state.autoMoveToFoundation,
        soundEnabled: state.soundEnabled,
        hapticsEnabled: state.hapticsEnabled,
        theme: state.theme,
        stats: state.stats,
      }),
    }
  )
);
