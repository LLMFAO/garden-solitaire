import { Card, FOUNDATION_SUITS, PileRef, prevRank, nextRank, Suit } from './types';

export function canMoveToFoundation(card: Card, foundationPile: Card[], foundationIndex?: number): boolean {
  if (!card.faceUp) return false;
  const slotSuit = foundationIndex === undefined ? undefined : FOUNDATION_SUITS[foundationIndex];

  if (foundationPile.length === 0) {
    const matchesSlot = slotSuit === undefined || slotSuit === card.suit;
    return matchesSlot && card.rank === 'A';
  }

  const top = foundationPile[foundationPile.length - 1];
  if (slotSuit !== undefined && (top.suit !== slotSuit || card.suit !== slotSuit)) return false;

  // Same suit and rank is exactly one higher
  return top.suit === card.suit && nextRank(top.rank) === card.rank;
}

export function canMoveToTableau(card: Card, tableauPile: Card[]): boolean {
  if (!card.faceUp) return false;
  if (tableauPile.length === 0) {
    return card.rank === 'K';
  }
  const top = tableauPile[tableauPile.length - 1];
  // Must be face up, opposite color, and exactly one rank lower
  return top.faceUp && top.color !== card.color && prevRank(top.rank) === card.rank;
}

export function canMoveToTableauSequence(cards: Card[], tableauPile: Card[]): boolean {
  if (cards.length === 0) return false;
  if (!cards[0].faceUp) return false;

  // First, validate that the moved sequence itself is valid
  for (let i = 0; i < cards.length - 1; i++) {
    const a = cards[i];
    const b = cards[i + 1];
    if (!a.faceUp || !b.faceUp) return false;
    if (a.color === b.color) return false;
    if (prevRank(a.rank) !== b.rank) return false; // a must be exactly one higher than b
  }

  // Then, validate that the first card can land on the destination pile
  if (tableauPile.length === 0) {
    return cards[0].rank === 'K';
  }
  const top = tableauPile[tableauPile.length - 1];
  return top.faceUp && top.color !== cards[0].color && prevRank(top.rank) === cards[0].rank;
}

export function getValidDestinations(
  card: Card,
  source: PileRef,
  tableau: Card[][],
  foundation: Card[][]
): PileRef[] {
  const destinations: PileRef[] = [];

  // Check foundations
  for (let i = 0; i < 4; i++) {
    if (canMoveToFoundation(card, foundation[i], i)) {
      destinations.push({ type: 'foundation', index: i });
    }
  }

  // Check tableau (skip source pile)
  for (let i = 0; i < 7; i++) {
    if (source.type === 'tableau' && source.index === i) continue;
    if (canMoveToTableau(card, tableau[i])) {
      destinations.push({ type: 'tableau', index: i });
    }
  }

  return destinations;
}

export function isTableauSequence(cards: Card[]): boolean {
  // A single card is always a valid sequence
  if (cards.length <= 1) return true;

  for (let i = 0; i < cards.length - 1; i++) {
    const a = cards[i];
    const b = cards[i + 1];
    if (!a.faceUp || !b.faceUp) return false;
    if (a.color === b.color) return false;
    if (prevRank(a.rank) !== b.rank) return false; // a must be exactly one higher than b
  }
  return true;
}

export function findAutoMove(card: Card, tableau: Card[][], foundation: Card[][]): PileRef | null {
  // Prefer foundation
  for (let i = 0; i < 4; i++) {
    if (canMoveToFoundation(card, foundation[i], i)) {
      return { type: 'foundation', index: i };
    }
  }
  // Then tableau
  for (let i = 0; i < 7; i++) {
    if (canMoveToTableau(card, tableau[i])) {
      return { type: 'tableau', index: i };
    }
  }
  return null;
}

export function getSuitIndex(suit: Suit): number {
  return FOUNDATION_SUITS.indexOf(suit);
}

export function checkWin(foundation: Card[][]): boolean {
  return foundation.every(pile => pile.length === 13);
}
