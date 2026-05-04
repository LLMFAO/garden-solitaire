import { Card } from './types';
import { canMoveToFoundation } from './moves';

export function findAutoMoveToFoundation(
  card: Card,
  foundation: Card[][]
): { index: number } | null {
  for (let i = 0; i < 4; i++) {
    if (canMoveToFoundation(card, foundation[i], i)) {
      return { index: i };
    }
  }
  return null;
}

export function findAllAutoMovesToFoundation(
  tableau: Card[][],
  waste: Card[],
  foundation: Card[][]
): { from: 'waste' | { tableauIndex: number; cardIndex: number }; toFoundation: number }[] {
  const moves: { from: 'waste' | { tableauIndex: number; cardIndex: number }; toFoundation: number }[] = [];

  // Check waste top
  if (waste.length > 0) {
    const top = waste[waste.length - 1];
    const dest = findAutoMoveToFoundation(top, foundation);
    if (dest) {
      moves.push({ from: 'waste', toFoundation: dest.index });
    }
  }

  // Check tableau tops
  for (let i = 0; i < 7; i++) {
    const pile = tableau[i];
    if (pile.length === 0) continue;
    const top = pile[pile.length - 1];
    if (!top.faceUp) continue;
    const dest = findAutoMoveToFoundation(top, foundation);
    if (dest) {
      moves.push({ from: { tableauIndex: i, cardIndex: pile.length - 1 }, toFoundation: dest.index });
    }
  }

  return moves;
}

export function autoPlayToFoundation(
  tableau: Card[][],
  waste: Card[],
  foundation: Card[][]
): { from: 'waste' | { tableauIndex: number; cardIndex: number }; toFoundation: number } | null {
  const moves = findAllAutoMovesToFoundation(tableau, waste, foundation);
  // Return the first valid move (safe auto-play only moves one at a time)
  return moves.length > 0 ? moves[0] : null;
}
