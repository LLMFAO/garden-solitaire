import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { Preferences } from '@capacitor/preferences';
import { Card, PileRef, Move, checkWin, findAutoMove, canMoveToTableauSequence, canMoveToFoundation } from '../engine';
import { dealGame } from '../engine/deck';
import { calculateMoveScore } from '../engine/scoring';
import { autoPlayToFoundation } from '../engine/autoPlay';

const MAX_HISTORY = 80;
const testStorage = new Map<string, string>();
const canUseCapacitorPreferences = () => typeof window !== 'undefined';

const capacitorStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (!canUseCapacitorPreferences()) return testStorage.get(name) ?? null;
    const { value } = await Preferences.get({ key: name });
    return value ?? null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (!canUseCapacitorPreferences()) {
      testStorage.set(name, value);
      return;
    }
    await Preferences.set({ key: name, value });
  },
  removeItem: async (name: string): Promise<void> => {
    if (!canUseCapacitorPreferences()) {
      testStorage.delete(name);
      return;
    }
    await Preferences.remove({ key: name });
  },
};

type GameStatus = 'idle' | 'playing' | 'won';

interface GameSnapshot {
  stock: Card[];
  waste: Card[];
  tableau: Card[][];
  foundation: Card[][];
  score: number;
  moves: number;
  gameStatus: GameStatus;
  lastMove: Move | null;
}

interface GameState {
  stock: Card[];
  waste: Card[];
  tableau: Card[][];
  foundation: Card[][];
  score: number;
  moves: number;
  gardenBoosts: number;
  timeElapsed: number;
  gameStatus: GameStatus;
  drawMode: 1 | 3;
  lastMove: Move | null;
  history: GameSnapshot[];
  selectedCard: { pile: PileRef; cardIndex: number; cards: Card[] } | null;

  // Actions
  newGame: (drawMode?: 1 | 3) => void;
  drawFromStock: () => void;
  moveCard: (from: PileRef, to: PileRef, cardIds?: string[]) => boolean;
  autoMoveCard: (from: PileRef) => boolean;
  selectCard: (pile: PileRef, cardIndex: number) => void;
  clearSelection: () => void;
  undo: () => void;
  setDrawMode: (mode: 1 | 3) => void;
  tickTimer: () => void;
  checkAutoWin: () => void;
  popGardenBoost: () => void;
}

const initialState = {
  stock: [],
  waste: [],
  tableau: [[], [], [], [], [], [], []],
  foundation: [[], [], [], []],
  score: 0,
  moves: 0,
  gardenBoosts: 0,
  timeElapsed: 0,
  gameStatus: 'idle' as const,
  drawMode: 3 as const,
  lastMove: null,
  history: [],
  selectedCard: null,
};

function isValidPileRef(pile: PileRef): boolean {
  if (pile.type === 'tableau') return pile.index >= 0 && pile.index < 7;
  if (pile.type === 'foundation') return pile.index >= 0 && pile.index < 4;
  return pile.index === 0;
}

function isSamePile(a: PileRef, b: PileRef): boolean {
  return a.type === b.type && a.index === b.index;
}

function idsMatch(cards: Card[], cardIds?: string[]): boolean {
  if (!cardIds || cardIds.length === 0) return true;
  return cards.length === cardIds.length && cards.every((card, index) => card.id === cardIds[index]);
}

function cloneCards(cards: Card[]): Card[] {
  return cards.map(card => ({ ...card }));
}

function clonePiles(piles: Card[][]): Card[][] {
  return piles.map(cloneCards);
}

function clonePileRef(pile: PileRef): PileRef {
  return { ...pile };
}

function cloneMove(move: Move | null): Move | null {
  if (!move) return null;
  return {
    cards: cloneCards(move.cards),
    from: clonePileRef(move.from),
    to: clonePileRef(move.to),
    flipCard: move.flipCard
      ? { pile: clonePileRef(move.flipCard.pile), cardIndex: move.flipCard.cardIndex }
      : undefined,
  };
}

function createUndoSnapshot(state: GameState): GameSnapshot {
  return {
    stock: cloneCards(state.stock),
    waste: cloneCards(state.waste),
    tableau: clonePiles(state.tableau),
    foundation: clonePiles(state.foundation),
    score: state.score,
    moves: state.moves,
    gameStatus: state.gameStatus,
    lastMove: cloneMove(state.lastMove),
  };
}

function pushUndoSnapshot(history: GameSnapshot[], snapshot: GameSnapshot): GameSnapshot[] {
  return [...history, snapshot].slice(-MAX_HISTORY);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isUndoSnapshot(value: unknown): value is GameSnapshot {
  if (!isObject(value)) return false;
  return Array.isArray(value.stock)
    && Array.isArray(value.waste)
    && Array.isArray(value.tableau)
    && Array.isArray(value.foundation)
    && typeof value.score === 'number'
    && typeof value.moves === 'number'
    && (value.gameStatus === 'idle' || value.gameStatus === 'playing' || value.gameStatus === 'won');
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
  ...initialState,

  newGame: (drawMode?: 1 | 3) => {
    const nextDrawMode = drawMode ?? get().drawMode;
    const { tableau, stock, waste, foundation } = dealGame(nextDrawMode);
    set({
      ...initialState,
      tableau,
      stock,
      waste,
      foundation,
      gameStatus: 'playing',
      drawMode: nextDrawMode,
    });
  },

  drawFromStock: () => {
    const state = get();
    if (state.gameStatus !== 'playing') return;

    if (state.stock.length === 0) {
      // Recycle waste back to stock
      if (state.waste.length === 0) return;
      const newStock = [...state.waste].map(c => ({ ...c, faceUp: false }));
      set({
        stock: newStock,
        waste: [],
        selectedCard: null,
        lastMove: null,
        history: pushUndoSnapshot(state.history, createUndoSnapshot(state)),
      });
      return;
    }

    const count = Math.min(state.drawMode, state.stock.length);
    const drawn = state.stock.slice(0, count).map(c => ({ ...c, faceUp: true }));
    const remaining = state.stock.slice(count);

    const move: Move = {
      cards: drawn,
      from: { type: 'stock', index: 0 },
      to: { type: 'waste', index: 0 },
    };

    set({
      stock: remaining,
      waste: [...state.waste, ...drawn],
      lastMove: move,
      selectedCard: null,
      history: pushUndoSnapshot(state.history, createUndoSnapshot(state)),
    });
  },

  moveCard: (from: PileRef, to: PileRef, cardIds?: string[]) => {
    const state = get();
    if (state.gameStatus !== 'playing') return false;
    if (!isValidPileRef(from) || !isValidPileRef(to)) return false;
    if (isSamePile(from, to)) return false;

    let cardsToMove: Card[] = [];
    let sourcePile: Card[] = [];

    // Extract cards from source
    if (from.type === 'tableau') {
      sourcePile = state.tableau[from.index];
      if (cardIds && cardIds.length > 0) {
        const startIdx = sourcePile.findIndex(c => c.id === cardIds[0]);
        if (startIdx === -1) return false;
        cardsToMove = sourcePile.slice(startIdx);
      } else {
        if (sourcePile.length === 0) return false;
        cardsToMove = [sourcePile[sourcePile.length - 1]];
      }
    } else if (from.type === 'waste') {
      sourcePile = state.waste;
      if (sourcePile.length === 0) return false;
      cardsToMove = [sourcePile[sourcePile.length - 1]];
    } else if (from.type === 'foundation') {
      sourcePile = state.foundation[from.index];
      if (sourcePile.length === 0) return false;
      cardsToMove = [sourcePile[sourcePile.length - 1]];
    } else {
      return false;
    }

    if (!idsMatch(cardsToMove, cardIds)) return false;

    // Validate destination
    let valid = false;
    if (to.type === 'foundation') {
      if (cardsToMove.length === 1) {
        valid = canMoveToFoundation(cardsToMove[0], state.foundation[to.index], to.index);
      }
    } else if (to.type === 'tableau') {
      valid = canMoveToTableauSequence(cardsToMove, state.tableau[to.index]);
    }

    if (!valid) return false;

    // Execute move
    const newTableau = state.tableau.map(p => [...p]);
    const newFoundation = state.foundation.map(p => [...p]);
    const newWaste = [...state.waste];
    const newStock = [...state.stock];

    // Remove from source
    if (from.type === 'tableau') {
      newTableau[from.index] = newTableau[from.index].slice(0, newTableau[from.index].length - cardsToMove.length);
      // Flip new top card if face-down
      const pile = newTableau[from.index];
      if (pile.length > 0 && !pile[pile.length - 1].faceUp) {
        pile[pile.length - 1] = { ...pile[pile.length - 1], faceUp: true };
      }
    } else if (from.type === 'waste') {
      newWaste.pop();
    } else if (from.type === 'foundation') {
      newFoundation[from.index].pop();
    }

    // Add to destination
    if (to.type === 'tableau') {
      newTableau[to.index] = [...newTableau[to.index], ...cardsToMove];
    } else if (to.type === 'foundation') {
      newFoundation[to.index] = [...newFoundation[to.index], ...cardsToMove];
    }

    const move: Move = {
      cards: cardsToMove,
      from,
      to,
    };

    const scoreDelta = calculateMoveScore(move);
    const newScore = state.score + scoreDelta;
    const newMoves = state.moves + 1;

    const won = checkWin(newFoundation);

    set({
      tableau: newTableau,
      foundation: newFoundation,
      waste: newWaste,
      stock: newStock,
      score: newScore,
      moves: newMoves,
      lastMove: move,
      history: pushUndoSnapshot(state.history, createUndoSnapshot(state)),
      selectedCard: null,
      gameStatus: won ? 'won' : 'playing',
    });

    return true;
  },

  autoMoveCard: (from: PileRef) => {
    const state = get();
    if (state.gameStatus !== 'playing') return false;

    let card: Card | undefined;
    if (from.type === 'waste' && state.waste.length > 0) {
      card = state.waste[state.waste.length - 1];
    } else if (from.type === 'tableau' && state.tableau[from.index].length > 0) {
      const pile = state.tableau[from.index];
      card = pile[pile.length - 1];
      if (!card.faceUp) return false;
    }

    if (!card) return false;

    const dest = findAutoMove(card, state.tableau, state.foundation);
    if (!dest) return false;

    return state.moveCard(from, dest);
  },

  undo: () => {
    const state = get();
    const snapshot = state.history[state.history.length - 1];
    if (!snapshot) return;

    if (!isUndoSnapshot(snapshot)) {
      set({ history: [], selectedCard: null });
      return;
    }

    set({
      stock: cloneCards(snapshot.stock),
      waste: cloneCards(snapshot.waste),
      tableau: clonePiles(snapshot.tableau),
      foundation: clonePiles(snapshot.foundation),
      score: snapshot.score,
      moves: snapshot.moves,
      gameStatus: snapshot.gameStatus,
      lastMove: cloneMove(snapshot.lastMove),
      selectedCard: null,
      history: state.history.slice(0, -1),
    });
  },

  setDrawMode: (mode: 1 | 3) => set({ drawMode: mode }),

  selectCard: (pile, cardIndex) => {
    const state = get();
    if (!isValidPileRef(pile)) {
      set({ selectedCard: null });
      return;
    }

    let cards: Card[] = [];
    if (pile.type === 'tableau') {
      if (cardIndex < 0 || cardIndex >= state.tableau[pile.index].length) {
        set({ selectedCard: null });
        return;
      }
      cards = state.tableau[pile.index].slice(cardIndex);
    } else if (pile.type === 'waste' && state.waste.length > 0) {
      cards = [state.waste[state.waste.length - 1]];
    } else if (pile.type === 'foundation' && state.foundation[pile.index].length > 0) {
      cards = [state.foundation[pile.index][state.foundation[pile.index].length - 1]];
    }
    if (cards.length === 0 || !cards[0].faceUp) {
      set({ selectedCard: null });
      return;
    }
    set({ selectedCard: { pile, cardIndex, cards } });
  },

  clearSelection: () => set({ selectedCard: null }),

  tickTimer: () => {
    const state = get();
    if (state.gameStatus === 'playing') {
      set({ timeElapsed: state.timeElapsed + 1 });
    }
  },

  popGardenBoost: () => {
    const state = get();
    if (state.gameStatus === 'playing') {
      set({ gardenBoosts: state.gardenBoosts + 1 });
    }
  },

  checkAutoWin: () => {
    const state = get();
    if (state.gameStatus !== 'playing') return;
    if (state.stock.length > 0 || state.waste.length > 0) return;
    if (state.tableau.some(pile => pile.some(card => !card.faceUp))) return;

    const pileSizes = state.foundation.map(f => f.length);
    if (pileSizes.some(s => s === 0)) return; // Need all foundations started

    // Auto-move valid cards to foundation
    let moved = true;
    while (moved) {
      moved = false;
      const current = get();
      const auto = autoPlayToFoundation(current.tableau, current.waste, current.foundation);
      if (auto) {
        if (auto.from === 'waste') {
          moved = get().moveCard({ type: 'waste', index: 0 }, { type: 'foundation', index: auto.toFoundation });
        } else {
          moved = get().moveCard(
            { type: 'tableau', index: auto.from.tableauIndex },
            { type: 'foundation', index: auto.toFoundation }
          );
        }
      }
    }
  },
  }),
  {
    name: 'solitaire-game',
    storage: createJSONStorage(() => capacitorStorage),
    partialize: (state) => ({
      stock: state.stock,
      waste: state.waste,
      tableau: state.tableau,
      foundation: state.foundation,
      score: state.score,
      moves: state.moves,
      gardenBoosts: state.gardenBoosts,
      timeElapsed: state.timeElapsed,
      gameStatus: state.gameStatus,
      drawMode: state.drawMode,
      history: state.history,
    }),
  }
));
