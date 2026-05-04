import { Card, Suit, suitColor, RANK_ORDER } from './types';

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
let cardIdCounter = 0;

export function createDeck(): Card[] {
  cardIdCounter = 0;
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANK_ORDER) {
      deck.push({
        id: `card-${cardIdCounter++}`,
        suit,
        rank,
        faceUp: false,
        color: suitColor(suit),
      });
    }
  }
  return deck;
}

export function shuffle(deck: Card[]): Card[] {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function dealGame(_drawMode?: 1 | 3): {
  stock: Card[];
  waste: Card[];
  tableau: Card[][];
  foundation: Card[][];
} {
  const deck = shuffle(createDeck());
  const tableau: Card[][] = [[], [], [], [], [], [], []];
  let deckIndex = 0;

  // Deal tableau: column n has n+1 cards
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = { ...deck[deckIndex] };
      if (row === col) card.faceUp = true;
      tableau[col].push(card);
      deckIndex++;
    }
  }

  // Remaining cards go to stock
  const stock = deck.slice(deckIndex).map(c => ({ ...c, faceUp: false }));

  return {
    stock,
    waste: [],
    tableau,
    foundation: [[], [], [], []],
  };
}
