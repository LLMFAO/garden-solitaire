export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
  color: 'red' | 'black';
}

export type PileType = 'tableau' | 'foundation' | 'stock' | 'waste';

export interface PileRef {
  type: PileType;
  index: number; // 0-6 for tableau, 0-3 for foundation, 0 for stock/waste
}

export interface Move {
  cards: Card[];
  from: PileRef;
  to: PileRef;
  flipCard?: { pile: PileRef; cardIndex: number }; // card that was flipped face-up
}

export const RANK_ORDER: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
export const FOUNDATION_SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
export const RANK_VALUES: Record<Rank, number> = {
  A: 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, J: 11, Q: 12, K: 13,
};

export function suitColor(suit: Suit): 'red' | 'black' {
  return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
}

export function rankValue(rank: Rank): number {
  return RANK_VALUES[rank];
}

export function nextRank(rank: Rank): Rank | null {
  const idx = RANK_ORDER.indexOf(rank);
  return idx < RANK_ORDER.length - 1 ? RANK_ORDER[idx + 1] : null;
}

export function prevRank(rank: Rank): Rank | null {
  const idx = RANK_ORDER.indexOf(rank);
  return idx > 0 ? RANK_ORDER[idx - 1] : null;
}
