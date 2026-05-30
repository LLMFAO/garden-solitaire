import { strict as assert } from 'node:assert';
import test from 'node:test';
import {
  canMoveToFoundation,
  dealGame,
  FOUNDATION_SUITS,
  getSuitIndex,
} from '../src/engine';
import type { Card, Rank, Suit } from '../src/engine';
import { useGameStore } from '../src/store/gameStore';

let nextId = 0;

function card(suit: Suit, rank: Rank, faceUp = true): Card {
  return {
    id: `test-card-${nextId++}`,
    suit,
    rank,
    faceUp,
    color: suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black',
  };
}

function resetStore(partial: Partial<ReturnType<typeof useGameStore.getState>> = {}) {
  useGameStore.setState({
    stock: [],
    waste: [],
    tableau: [[], [], [], [], [], [], []],
    foundation: [[], [], [], []],
    score: 0,
    moves: 0,
    gardenBoosts: 0,
    timeElapsed: 0,
    gameStatus: 'playing',
    drawMode: 3,
    lastMove: null,
    history: [],
    selectedCard: null,
    ...partial,
  });
}

test('dealGame creates a legal 52-card Klondike layout', () => {
  const game = dealGame();
  const allCards = [...game.stock, ...game.tableau.flat(), ...game.waste, ...game.foundation.flat()];

  assert.equal(allCards.length, 52);
  assert.equal(new Set(allCards.map(c => c.id)).size, 52);
  assert.equal(game.stock.length, 24);
  assert.deepEqual(game.tableau.map(pile => pile.length), [1, 2, 3, 4, 5, 6, 7]);

  for (const pile of game.tableau) {
    assert.equal(pile[pile.length - 1].faceUp, true);
    assert.equal(pile.slice(0, -1).every(c => !c.faceUp), true);
  }
});

test('foundation moves are locked to the slot suit and ascending rank', () => {
  assert.deepEqual(FOUNDATION_SUITS, ['hearts', 'diamonds', 'clubs', 'spades']);

  const spadeAce = card('spades', 'A');
  const spadeTwo = card('spades', '2');
  const clubTwo = card('clubs', '2');

  assert.equal(canMoveToFoundation(spadeAce, [], getSuitIndex('spades')), true);
  assert.equal(canMoveToFoundation(spadeAce, [], getSuitIndex('hearts')), false);
  assert.equal(canMoveToFoundation(spadeTwo, [spadeAce], getSuitIndex('spades')), true);
  assert.equal(canMoveToFoundation(clubTwo, [spadeAce], getSuitIndex('spades')), false);
});

test('store moveCard enforces foundation slot suit and flips the exposed tableau card', () => {
  const hiddenNine = card('clubs', '9', false);
  const heartAce = card('hearts', 'A');
  resetStore({
    tableau: [[hiddenNine, heartAce], [], [], [], [], [], []],
  });

  const wrongSlotMoved = useGameStore.getState().moveCard(
    { type: 'tableau', index: 0 },
    { type: 'foundation', index: getSuitIndex('diamonds') },
    [heartAce.id],
  );
  assert.equal(wrongSlotMoved, false);

  const moved = useGameStore.getState().moveCard(
    { type: 'tableau', index: 0 },
    { type: 'foundation', index: getSuitIndex('hearts') },
    [heartAce.id],
  );

  const state = useGameStore.getState();
  assert.equal(moved, true);
  assert.equal(state.foundation[getSuitIndex('hearts')][0].id, heartAce.id);
  assert.equal(state.tableau[0][0].id, hiddenNine.id);
  assert.equal(state.tableau[0][0].faceUp, true);
});

test('store moveCard rejects malformed selected card id lists', () => {
  const king = card('spades', 'K');
  const queen = card('hearts', 'Q');
  const jack = card('clubs', 'J');
  resetStore({
    tableau: [[king, queen, jack], [], [], [], [], [], []],
  });

  const malformedMoved = useGameStore.getState().moveCard(
    { type: 'tableau', index: 0 },
    { type: 'tableau', index: 1 },
    [king.id, jack.id],
  );
  assert.equal(malformedMoved, false);
  assert.equal(useGameStore.getState().tableau[0].length, 3);

  const moved = useGameStore.getState().moveCard(
    { type: 'tableau', index: 0 },
    { type: 'tableau', index: 1 },
    [king.id, queen.id, jack.id],
  );
  assert.equal(moved, true);
  assert.deepEqual(useGameStore.getState().tableau[1].map(c => c.id), [king.id, queen.id, jack.id]);
});

test('store moveCard allows foundation cards to move back to the tableau', () => {
  const heartFour = card('hearts', '4');
  const heartFive = card('hearts', '5');
  const clubSix = card('clubs', '6');
  resetStore({
    foundation: [[heartFour, heartFive], [], [], []],
    tableau: [[clubSix], [], [], [], [], [], []],
  });

  const moved = useGameStore.getState().moveCard(
    { type: 'foundation', index: getSuitIndex('hearts') },
    { type: 'tableau', index: 0 },
    [heartFive.id],
  );

  const state = useGameStore.getState();
  assert.equal(moved, true);
  assert.deepEqual(state.foundation[getSuitIndex('hearts')].map(c => c.id), [heartFour.id]);
  assert.deepEqual(state.tableau[0].map(c => c.id), [clubSix.id, heartFive.id]);
  assert.equal(state.score, -15);
  assert.equal(state.moves, 1);
});

test('store undo restores a tableau flip and moved card', () => {
  const hiddenNine = card('clubs', '9', false);
  const heartAce = card('hearts', 'A');
  resetStore({
    tableau: [[hiddenNine, heartAce], [], [], [], [], [], []],
  });

  const moved = useGameStore.getState().moveCard(
    { type: 'tableau', index: 0 },
    { type: 'foundation', index: getSuitIndex('hearts') },
    [heartAce.id],
  );
  assert.equal(moved, true);

  useGameStore.getState().undo();

  const state = useGameStore.getState();
  assert.deepEqual(state.tableau[0].map(c => c.id), [hiddenNine.id, heartAce.id]);
  assert.equal(state.tableau[0][0].faceUp, false);
  assert.equal(state.foundation[getSuitIndex('hearts')].length, 0);
  assert.equal(state.score, 0);
  assert.equal(state.moves, 0);
  assert.equal(state.history.length, 0);
});

test('store undo restores stock and waste after drawing cards', () => {
  const cards = [card('clubs', '2', false), card('diamonds', '3', false), card('spades', '4', false)];
  resetStore({ stock: cards, drawMode: 3 });

  useGameStore.getState().drawFromStock();
  assert.equal(useGameStore.getState().stock.length, 0);
  assert.deepEqual(useGameStore.getState().waste.map(c => c.id), cards.map(c => c.id));
  assert.equal(useGameStore.getState().waste.every(c => c.faceUp), true);

  useGameStore.getState().undo();

  const state = useGameStore.getState();
  assert.deepEqual(state.stock.map(c => c.id), cards.map(c => c.id));
  assert.equal(state.stock.every(c => !c.faceUp), true);
  assert.equal(state.waste.length, 0);
  assert.equal(state.history.length, 0);
});
