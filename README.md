# Garden Solitaire

Garden Solitaire is a mobile-first Klondike Solitaire game built with React, TypeScript, Vite, Zustand, Framer Motion, and Capacitor. The game pairs standard solitaire rules with a growing British-garden backdrop: successful card moves grow the garden, spawn collectible sunshine/water bubbles, reveal new plants, and attract bees as the border matures.

## Features

- Standard Klondike Solitaire tableau, stock, waste, and four suit foundations.
- Draw 1 or draw 3 mode selected when starting a new game.
- Touch-friendly tap interactions with animated card movement.
- Double-tap auto-move for top tableau or waste cards.
- Auto-finish button for safe foundation play when the remaining state allows it.
- Foundation slots are suit-locked: hearts, diamonds, clubs, spades.
- Draw-three waste fan shows the visible waste cards while only the top card is playable.
- Garden grows only when the player makes a valid card move.
- One collectible bubble appears per played move; popping it or letting it land adds extra garden growth.
- Mature garden stages add white/cream flowers, orchid-style plants, a centerpiece flower, and SVG bees.
- Expert gardening fact cards appear during idle moments.
- Desktop browsers show the app inside a mobile-sized frame.
- PWA output and Capacitor iOS wrapper are included.

## Quick Start

Install dependencies:

```bash
npm install
```

Run the web app:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run logic tests:

```bash
npm test
```

Preview the production build:

```bash
npm run preview
```

## iOS / Capacitor

Build the web app and sync Capacitor:

```bash
npm run build
npx cap sync ios
npx cap open ios
```

Then build and run from Xcode.

## Gameplay Notes

The game follows classic Klondike rules:

- Tableau builds downward by alternating color.
- Empty tableau columns accept Kings only.
- Foundations build upward from Ace to King by suit.
- Only the top waste card is playable.
- Moving a tableau card reveals and flips the next face-down card automatically.
- Draw mode is fixed for the current deal and can be changed for the next new game from the menu.

Garden progression is intentionally tied to meaningful play:

- Drawing from stock does not grow the garden.
- Recycling waste does not grow the garden.
- Valid card moves increment the move count and spawn one bubble.
- Collecting a bubble adds an additional growth boost.

## Project Structure

```text
src/
  components/
    Card.tsx             Card face/back rendering and card tap handling
    Foundation.tsx       Suit-locked foundation piles
    GameBoard.tsx        Main game layout
    GardenBackground.tsx Growing garden, bubbles, bees, centerpiece flower
    GardenFacts.tsx      Idle gardening fact cards
    MenuOverlay.tsx      New game and draw-mode selection
    StockWaste.tsx       Stock and visible waste fan
    Tableau.tsx          Seven tableau columns
    TopBar.tsx           Score, timer, progress, menu, auto-finish
    WinOverlay.tsx       End-game overlay
  engine/
    deck.ts              Deck creation, shuffle, deal
    moves.ts             Move validation and win checks
    autoPlay.ts          Foundation auto-play helpers
    scoring.ts           Score calculation helpers
    types.ts             Card, suit, rank, pile types
  store/
    gameStore.ts         Zustand game state and actions
    settingsStore.ts     Settings and stats state
  hooks/
    useGameTimer.ts
    useHaptics.ts
```

## Verification

The project has a small Node test harness for core game logic:

```bash
npm test
```

The tests currently cover:

- Legal 52-card Klondike deal shape.
- Foundation suit-slot validation.
- Tableau-to-foundation move behavior and exposed-card flipping.
- Rejection of malformed multi-card move selections.

Use `npm run build` before shipping to verify TypeScript and production bundling.

## Tech Stack

- React 18
- TypeScript
- Vite
- Zustand
- Framer Motion
- Capacitor 6
- Vite PWA plugin

## Notes

- The app is designed for mobile first. On desktop, CSS constrains the game to a phone-like frame so layout and card sizing remain realistic.
- The garden is implemented with inline SVG/CSS and Framer Motion rather than bitmap assets.
- The iOS project and built web output are present in the repository, but source changes should generally happen under `src/`.
