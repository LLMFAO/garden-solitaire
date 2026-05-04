# Solitaire Game Design Spec

**Date:** 2026-05-04
**Project:** Bright, Bubbly, Nature-Themed Klondike Solitaire
**Platform:** iOS PWA + Capacitor native app

---

## 1. Overview

A single-player Klondike Solitaire game built as a web app wrapped with Capacitor for iOS distribution. The visual identity is "bright, bubbly, and nature-inspired" — think watercolor gardens, rounded organic shapes, soft shadows, and satisfying spring-physics card animations.

### Success Criteria
- Runs as a PWA in Safari (Add to Home Screen)
- Runs in a Capacitor iOS wrapper with native haptics
- 60fps card drag-and-drop with spring physics
- Fully playable with touch (no mouse required)
- Works offline
- Visuals feel "addictive" and polished — every interaction rewards the player

---

## 2. Architecture & Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | React 18 + TypeScript | Component model, type safety, large ecosystem |
| Build Tool | Vite | Fast HMR, optimized builds, easy Capacitor integration |
| Animations | Framer Motion | Spring physics for drag, snap, bounce, layout animations |
| State | Zustand | Lightweight, no boilerplate, excellent for game state |
| Styling | CSS Modules + CSS Variables | Scoped styles, easy theming, hardware-accelerated transforms |
| Art | SVG + CSS Gradients | Vector-sharp at any resolution, no external image assets |
| Native Bridge | Capacitor 6 | Wrap web app as iOS app, access haptics, splash screen |
| Haptics | `capacitor-haptics` | Light impact on card drop, medium impact on win |
| Storage | `localStorage` / Capacitor Preferences | Persist game state, stats, settings |

### Why DOM over Canvas
- Free touch handling and accessibility
- CSS enables the "bubbly" visual style (shadows, gradients, rounded corners) without complex rendering code
- Hardware-accelerated `transform` gives 60fps drag with less code
- Easier to iterate on visuals quickly

### Project Structure
```
src/
  components/       # React components
    Card.tsx        # Individual card visual + drag wrapper
    Tableau.tsx     # The 7 columns
    Foundation.tsx  # The 4 suit piles
    Stock.tsx       # Draw pile + waste pile
    GameBoard.tsx   # Layout container
    WinAnimation.tsx# Celebration overlay
  engine/           # Game logic (pure functions)
    deck.ts         # Deck creation, shuffling
    moves.ts        # Move validation, auto-moves
    scoring.ts      # Score calculation, time tracking
  store/
    gameStore.ts    # Zustand store: game state, actions
    settingsStore.ts# Settings, theme preferences
  styles/
    theme.css       # CSS variables: colors, shadows, radii
    cards.css       # Card-specific styles
  hooks/
    useDragCard.ts  # Framer Motion drag logic
    useHaptics.ts   # Capacitor haptics wrapper
  assets/
    icons/          # App icons, SVG suit art
```

---

## 3. Game Rules (Klondike)

**Standard Klondike rules, no variations:**

1. **Tableau:** 7 columns. Column *n* has *n* cards, bottom card face-up.
2. **Stock:** Remaining 24 cards face-down. Tap to draw 3 (or 1) to waste.
3. **Waste:** Face-up cards from stock. Top card is playable.
4. **Foundation:** 4 piles (♠ ♥ ♦ ♣). Build Ace → King in suit.
5. **Objective:** Move all cards to foundation.

**Moves allowed:**
- Waste top card → Tableau or Foundation
- Tableau face-up card → Tableau (descending, alternating colors) or Foundation
- Foundation card → Tableau (if helpful)
- Empty tableau column: only Kings
- Auto-flip: when top face-down card is exposed, flip it face-up
- Auto-move: eligible cards automatically move to foundation (optional, toggle in settings)
- Double-tap: auto-move card to best valid destination

**Scoring:**
- Foundation: +10 points per card
- Tableau → Foundation: +10
- Waste → Foundation: +10
- Waste → Tableau: +5
- Tableau → Tableau: +5
- Foundation → Tableau: -15 (discouraged)
- Time bonus: faster wins = higher score

---

## 4. Visual Design System

### Color Palette (Nature/Watercolor Inspired)

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#F0F7EE` | Main background (soft mint-white) |
| `--bg-secondary` | `#E1F0DB` | Tableau area, subtle panels |
| `--accent-sun` | `#FFD93D` | Highlights, stars, win particles |
| `--accent-sky` | `#A8D8EA` | Buttons, interactive elements |
| `--accent-rose` | `#FFB7B2` | Hearts suit primary, soft warnings |
| `--accent-lavender` | `#D4A5A5` | Spades suit primary |
| `--accent-peach` | `#FFDAC1` | Diamonds suit primary |
| `--accent-sage` | `#B5CDA3` | Clubs suit primary |
| `--card-bg` | `#FFFFFF` | Card face |
| `--card-back` | `#A8D8EA` | Card back pattern (sky blue) |
| `--card-back-pattern` | `#8BC9E4` | Card back pattern detail |
| `--text-primary` | `#3D405B` | Dark slate for numbers/letters |
| `--shadow-soft` | `rgba(61,64,91,0.12)` | Card shadows |

### Card Design
- **Size:** ~65mm × 90mm equivalent (responsive, `vmin` based)
- **Corner radius:** 12px (bubbly, rounded)
- **Face:** White background, large suit icon + rank number in corners
- **Suit art:** Stylized organic shapes — hearts like flower petals, clubs like leaves, diamonds like berries, spades like teardrop buds
- **Back:** Soft blue gradient with subtle leaf/flower watermark pattern
- **Shadow:** Soft diffuse shadow with slight offset (feels like lifting a physical card)
- **Selected/dragging:** Slight scale-up (1.05×), deeper shadow, smooth spring animation
- **Face-down:** Gentle gradient with a tiny botanical pattern

### Layout
- **Background:** Soft radial gradient from center (lighter) to edges (slightly darker mint)
- **Tableau area:** Slight rounded rectangle with dashed outline (like a garden bed)
- **Foundation:** Four gentle "slots" with faint suit icon watermarks
- **Stock/Waste:** Stacked with slight offset, rounded corners
- **Overall:** Generous whitespace, everything floats with soft shadows

### Animation Language
- **Card drag:** Follows finger with slight inertia (Framer Motion `drag`)
- **Card snap to destination:** Spring physics (stiffness 300, damping 25) — feels like a magnet pulling it in
- **Invalid drop:** Card wobbles and returns home (gentle rejection)
- **Valid drop:** Card settles with a tiny bounce, haptic "light" tap
- **Auto-flip:** Card rotates Y-axis 180° with spring, reveals face smoothly
- **Win:** Cards cascade to foundation with staggered animation, particles (sparkles, petals) burst from foundation piles, haptic "success" pattern
- **New game:** Cards deal with a satisfying shuffle-to-tableau animation

---

## 5. Game Flow & Screens

### 5.1 Game Board (Primary Screen)
Always-visible layout:
```
┌─────────────────────────────────────────┐
│  [Menu]  Score: 1,240  Time: 04:32  [?]│
├─────────────────────────────────────────┤
│  [Stock] [Waste]      [♠] [♥] [♦] [♣]  │
│                                        │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐  │
│  │K │ │Q │ │J │ │10│ │9 │ │8 │ │7 │  │
│  ├──┤ ├──┤ ├──┤ ├──┤ ├──┤ ├──┤ ├──┤  │
│  │  │ │  │ │  │ │  │ │  │ │  │ │  │  │
│  │  │ │  │ │  │ │  │ │  │ │  │ │  │  │
│  └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘  │
│                                        │
└─────────────────────────────────────────┘
```

### 5.2 Menu Overlay
- New Game
- Restart
- Settings (draw 1/3, sound, haptics, auto-move)
- How to Play (illustrated rules)
- Statistics (wins, best time, best score, win streak)

### 5.3 Win Celebration
- Semi-transparent overlay
- Foundation piles glow with pulsing gradient
- Score and time displayed with scale-in animation
- "New Game" and "Play Again" buttons
- Background particles (falling petals, sparkles) for 5 seconds

---

## 6. Interaction Design

### Touch Interactions
- **Tap stock:** Draw 3 (or 1) cards to waste. Haptic: light tick.
- **Drag card:** Card lifts, shadow deepens, follows finger. When over a valid drop zone, zone highlights with soft glow.
- **Release on valid zone:** Card snaps in with spring + haptic "light" tap.
- **Release on invalid zone:** Card wobbles (±5° rotation, 2 oscillations) and returns home.
- **Double-tap card:** Auto-move to best valid destination (foundation preferred, then tableau). If no valid move, gentle wobble "no".
- **Tap face-down top card in tableau:** If exposed, auto-flip (should happen automatically on valid moves).
- **Long-press:** Show subtle tooltip (mobile-friendly hint: "Double-tap to auto-move").

### Capacitor Haptic Patterns
| Event | Haptic |
|-------|--------|
| Card pickup | `Haptics.ImpactStyle.Light` |
| Valid card drop | `Haptics.ImpactStyle.Light` |
| Invalid drop | `Haptics.ImpactStyle.Soft` (gentle, not punishing) |
| Auto-move success | `Haptics.ImpactStyle.Medium` |
| Win! | `Haptics.NotificationType.Success` + `Haptics.ImpactStyle.Heavy` cascade |
| New game start | `Haptics.ImpactStyle.Light` |
| Stock empty tap | `Haptics.NotificationType.Error` (gentle) |

---

## 7. State Management (Zustand)

### Game State Shape
```typescript
interface GameState {
  deck: Card[];           // All 52 cards with positions
  stock: Card[];          // Face-down draw pile
  waste: Card[];          // Face-up drawn cards
  tableau: Card[][];      // 7 columns
  foundation: Card[][];   // 4 suit piles
  score: number;
  moves: number;
  timeElapsed: number;
  gameStatus: 'idle' | 'playing' | 'won';
  drawMode: 1 | 3;
  lastMove: Move | null;   // For undo
}
```

### Actions
- `deal()` — Shuffle and set up new game
- `drawFromStock()` — Move cards from stock to waste
- `moveCard(from, to, cardId)` — Validate and execute move
- `autoMove(cardId)` — Find best destination and move
- `undo()` — Revert last move
- `toggleDrawMode()` — Switch 1/3 card draw
- `resetScore()` — Start timer/score fresh

### Settings State
```typescript
interface SettingsState {
  drawMode: 1 | 3;
  autoMoveToFoundation: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  theme: 'nature' | 'dark'; // Future-proof
}
```

---

## 8. Data Persistence

- **Current game:** Saved to `localStorage` after every move. Restored on app launch.
- **Settings:** Saved to `localStorage` on change.
- **Statistics:** Saved to `localStorage`. Tracks: games played, games won, win percentage, best time, best score, current streak, best streak.
- **Capacitor:** Uses `@capacitor/preferences` instead of `localStorage` when running natively (seamless fallback).

---

## 9. Accessibility

- All cards are semantic buttons with `aria-label` (e.g., "Ace of Hearts, in waste pile")
- Keyboard navigation: Tab through piles, Enter to select, arrow keys to move
- Focus indicators: Soft glow outline on focused card
- `prefers-reduced-motion`: Disable spring animations, use instant transitions
- Color is not the only indicator: suit icons are distinct shapes

---

## 10. Performance Targets

- **First paint:** < 1.5s on iPhone 12
- **Interaction response:** < 100ms (drag starts immediately)
- **Animation:** 60fps during drag, snap, and win celebration
- **Bundle size:** < 200KB gzipped (excluding Capacitor runtime)
- **No jank:** Game state updates happen in < 16ms

---

## 11. Open Source Leverage

We will implement Klondike rules and game logic ourselves (well-defined, ~500 lines). We will **not** use a pre-built solitaire library because:
- The DOM animation integration is custom
- The rules are simple and well-understood
- Custom implementation gives us exact control over the "feel"

However, we **will** leverage:
- **Framer Motion** for all animations (drag, layout, springs)
- **Capacitor** ecosystem for native bridge
- **Vite PWA plugin** for service worker, offline support, manifest generation
- Standard Fisher-Yates shuffle (well-known algorithm)

---

## 12. Future Enhancements (Out of Scope for v1)

- Spider Solitaire / FreeCell variants
- Daily challenge mode
- Leaderboards
- Custom card backs / themes
- Sound effects (gentle nature sounds: leaf rustle, water droplet)
- iCloud sync for statistics
- Apple Game Center integration

---

## 13. File Structure

```
solitaire/
├── android/                  # Capacitor Android (generated)
├── ios/                      # Capacitor iOS (generated)
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-05-04-solitaire-design.md
├── public/
│   ├── icons/                # PWA icons (192, 512, maskable)
│   └── manifest.json         # PWA manifest
├── src/
│   ├── components/
│   │   ├── Card.tsx
│   │   ├── CardBack.tsx
│   │   ├── Tableau.tsx
│   │   ├── Foundation.tsx
│   │   ├── StockWaste.tsx
│   │   ├── GameBoard.tsx
│   │   ├── TopBar.tsx
│   │   ├── MenuOverlay.tsx
│   │   ├── WinOverlay.tsx
│   │   └── ParticleField.tsx
│   ├── engine/
│   │   ├── types.ts          # Card, Suit, Rank, Pile types
│   │   ├── deck.ts           # createDeck(), shuffle()
│   │   ├── moves.ts          # validateMove(), getValidDestinations()
│   │   ├── scoring.ts        # calculateScore()
│   │   └── autoPlay.ts       # findAutoMove(), autoPlayToFoundation()
│   ├── store/
│   │   ├── gameStore.ts
│   │   └── settingsStore.ts
│   ├── hooks/
│   │   ├── useDragCard.ts
│   │   ├── useHaptics.ts
│   │   └── useGameTimer.ts
│   ├── styles/
│   │   ├── theme.css
│   │   ├── cards.css
│   │   └── animations.css
│   ├── assets/
│   │   └── suits.tsx         # SVG suit components
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── capacitor.config.ts
├── vite.config.ts
├── index.html
├── package.json
└── tsconfig.json
```

---

*Spec self-reviewed: No placeholders, no contradictions, scope is focused on Klondike v1 with clear boundaries, all requirements are explicit.*
