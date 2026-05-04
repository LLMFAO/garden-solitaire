# Theme Selector Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two selectable visual themes (Flower Garden, Zen Garden) driven by CSS custom properties. Theme toggle replaces the hint button in TopBar. Both themes have distinct backgrounds but identical gameplay.

**Architecture:** CSS custom properties keyed off `data-theme="flower|zen"` on `.app-shell`. Theme stored in `settingsStore`. Background component branches via `useSettingsStore` theme selector. Game state is separate per theme (two independent game stores).

**Tech Stack:** Vanilla CSS variables, Zustand persist, React conditional rendering, SVG art for zen elements

---

## File Map

- **Modify:** `src/store/settingsStore.ts` — add `theme: 'flower' | 'zen'`
- **Modify:** `src/App.tsx` — apply `data-theme` attribute to `.app-shell`, pass theme to children
- **Modify:** `src/index.css` — add `[data-theme="zen"]` CSS variable overrides, add zen background texture
- **Modify:** `src/components/TopBar.tsx` — replace hint button with theme toggle button
- **Modify:** `src/components/GameBoard.tsx` — read theme, render either `GardenBackground` or `ZenBackground`
- **Modify:** `src/components/CardBack` — use different emoji/pattern per theme (via compact-style theme prop)
- **Modify:** `src/components/GardenBackground.tsx` — accept `theme` prop, render nothing if `theme === 'zen'`
- **Create:** `src/components/ZenBackground.tsx` — sand, water ripple, bamboo, rocks — grows on progress like the flower garden does
- **Modify:** `vite.config.ts` — update `appName` to "Garden Solitaire" (umbrella)
- **Modify:** `capacitor.config.ts` — update `appName` to "Garden Solitaire"

---

## Phase 1: Settings store & theme prop infrastructure

### Task 1: Add theme to settingsStore

**Files:**
- Modify: `src/store/settingsStore.ts`

- [ ] **Step 1: Add theme to SettingsState interface**

Add `theme: 'flower' | 'zen'` to the `SettingsState` interface (after `hapticsEnabled`).

- [ ] **Step 2: Add toggleTheme action**

```ts
toggleTheme: () => void;
```

- [ ] **Step 3: Add theme to initial state and persist**

```ts
theme: 'flower' as const,
```

And in `persist` config's `partialize`, add `theme: state.theme`.

- [ ] **Step 4: Implement toggleTheme**

```ts
toggleTheme: () => set((s) => ({
  theme: s.theme === 'flower' ? 'zen' : 'flower'
})),
```

**Run:** `npx tsc --noEmit` — expect no errors.

---

### Task 2: Wire theme into App and apply data-theme attribute

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Read theme from settingsStore**

```ts
const theme = useSettingsStore((s) => s.theme);
```

- [ ] **Step 2: Apply data-theme to .app-shell div**

```tsx
<div className="app-shell" data-theme={theme}>
```

- [ ] **Step 3: Pass theme to GameBoard**

```tsx
<GameBoard key={`game-${theme}`} theme={theme} />
```

**Run:** `npx tsc --noEmit` — expect no errors.

---

### Task 3: Update GameBoard to accept theme and render backgrounds

**Files:**
- Modify: `src/components/GameBoard.tsx`

- [ ] **Step 1: Update GameBoardProps interface**

```ts
interface GameBoardProps {
  compact?: boolean;
  theme: 'flower' | 'zen';
}
```

- [ ] **Step 2: Destructure theme from props**

```ts
export const GameBoard: React.FC<GameBoardProps> = ({ compact, theme }) => {
```

- [ ] **Step 3: Conditionally render background**

Replace `<GardenBackground />` with:

```tsx
{theme === 'flower' ? <GardenBackground /> : <ZenBackground />}
```

**Run:** `npx tsc --noEmit` — expect no errors.

---

## Phase 2: CSS variable theming

### Task 4: Add zen CSS variable overrides

**Files:**
- Modify: `src/index.css`

Add a new CSS block at the end of the file:

```css
[data-theme="zen"] {
  /* Zen palette */
  --bg-primary: #E8E0D0;
  --bg-secondary: #D4C9B8;
  --bg-dark: #BEB4A4;

  /* Stone and sand accents */
  --accent-sun: #8D8375;
  --accent-sky: #89A9B8;
  --accent-rose: #A67F7A;
  --accent-lavender: #8B7FA8;
  --accent-peach: #B89A82;
  --accent-sage: #7A8A72;

  /* Text */
  --text-primary: #3D3830;
  --text-secondary: #5A5048;

  /* Card */
  --card-back: #7A7268;
  --card-back-pattern: #5C5650;

  /* Shadows */
  --shadow-soft: rgba(61, 56, 48, 0.1);
  --shadow-medium: rgba(61, 56, 48, 0.2);
  --shadow-card: 0 4px 12px rgba(61, 56, 48, 0.12), 0 1px 3px rgba(61, 56, 48, 0.08);
  --shadow-card-hover: 0 8px 24px rgba(61, 56, 48, 0.15), 0 2px 6px rgba(61, 56, 48, 0.1);

  /* Garden bg gradient override */
  --garden-bg-gradient: radial-gradient(ellipse at 20% 80%, rgba(180, 170, 155, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(200, 190, 175, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, #E8E0D0 0%, #D4C9B8 100%);
}
```

Also update the `.garden-bg` rule to use `--garden-bg-gradient` variable, so it changes per theme. Or keep it as-is since the GardenBackground component handles the visual overlay entirely — the CSS background is a fallback/base.

Actually the `.garden-bg` class is already in index.css and the GardenBackground/ZenBackground are rendered inside it. The background component handles all visuals. The CSS only sets a base color. For zen mode, change `.garden-bg` to:

```css
[data-theme="zen"] .garden-bg {
  background: var(--garden-bg-gradient, #E8E0D0);
}

[data-theme="flower"] .garden-bg,
.garden-bg {
  background:
    radial-gradient(ellipse at 20% 80%, rgba(129, 199, 132, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(165, 214, 167, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, #E8F5E9 0%, #C8E6C9 100%);
}
```

And add to root: `--garden-bg-gradient: radial-gradient(ellipse at 20% 80%, rgba(129, 199, 132, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(165, 214, 167, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, #E8F5E9 0%, #C8E6C9 100%);`

**Run:** `npx tsc --noEmit` — expect no errors.

---

## Phase 3: TopBar — hint button → theme selector

### Task 5: Replace hint button with theme toggle

**Files:**
- Modify: `src/components/TopBar.tsx`

- [ ] **Step 1: Import useSettingsStore**

```ts
import { useSettingsStore } from '../store/settingsStore';
```

- [ ] **Step 2: Read theme and toggleTheme from settingsStore**

```ts
const theme = useSettingsStore((s) => s.theme);
const toggleTheme = useSettingsStore((s) => s.toggleTheme);
```

- [ ] **Step 3: Replace the right button (hint ✨) with theme toggle**

Replace:
```tsx
<motion.button
  onTap={() => useGameStore.getState().checkAutoWin()}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  style={{
    background: 'linear-gradient(135deg, #FFD600 0%, #FFAB00 100%)',
    color: 'var(--text-primary)',
    border: 'none',
    borderRadius: 14,
    padding: '6px 14px',
    fontSize: 14,
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: '0 2px 8px rgba(255, 171, 0, 0.3)',
  }}
>
  ✨
</motion.button>
```

With:
```tsx
<motion.button
  onTap={toggleTheme}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  style={{
    background: 'linear-gradient(135deg, #8D8375 0%, #6B635A 100%)',
    color: 'white',
    border: 'none',
    borderRadius: 14,
    padding: '6px 14px',
    fontSize: 14,
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: '0 2px 8px rgba(61, 56, 48, 0.3)',
  }}
>
  {theme === 'flower' ? '🪨' : '🌸'}
</motion.button>
```

**Run:** `npx tsc --noEmit` — expect no errors.

---

## Phase 4: ZenBackground component

### Task 6: Create ZenBackground component

**Files:**
- Create: `src/components/ZenBackground.tsx`

This component mirrors the `GardenBackground` structure but renders zen elements instead. It uses the same progress calculation (foundation completion drives it). Elements include:

**Static elements (always visible):**
- Raked sand ground with subtle curved line patterns (CSS/SVG)
- 3-4 strategically placed zen rocks (SVG ellipses in gray/brown tones)
- 2-3 bamboo stalks (SVG paths that grow upward with progress)

**Progress-driven elements:**
- Water ripple pool (expands as progress increases)
- Sand pattern rings that appear progressively
- Cherry blossom petals (for zen theme, pink/white petals floating)

For the bamboo: same approach as FlowerSVG — path draws upward as progress increases, leaves appear.

```tsx
// Key elements to include:
const ZEN_ROCKS = [
  { x: 15, y: 88, rx: 22, ry: 12, color: '#8A8278' },
  { x: 78, y: 85, rx: 28, ry: 14, color: '#7A756E' },
  { x: 50, y: 90, rx: 18, ry: 10, color: '#9A9288' },
  { x: 30, y: 86, rx: 15, ry: 9, color: '#857E76' },
  { x: 65, y: 87, rx: 20, ry: 11, color: '#8B857C' },
];

const BAMBOO_STALKS = [
  { x: 8, height: 180, segments: 6 },
  { x: 88, height: 140, segments: 5 },
  { x: 50, height: 200, segments: 7 },
];

const WATER_POOL = { x: 45, y: 78, maxRx: 55, maxRy: 28 };

// Sand rake lines — curved parallel lines on ground
// Render as divs with radial gradients or SVG paths
// Color: #D4C9B8 to #C8BFB0
```

The `ZenBackground` component should:
- Accept no props (reads foundation from `useGameStore` internally, same as `GardenBackground`)
- Calculate `progress` the same way: `totalFoundationCards / 52`
- Render bamboo that grows with progress (pathLength animation)
- Render water ripple that expands with progress (scale animation)
- Render sand pattern lines at ground level (opacity animation)
- Render static rocks (always visible)
- Render a few cherry blossom petals that float (motion.div animate)

**Run:** `npx tsc --noEmit` — expect no errors.

---

### Task 7: Hide GardenBackground in zen mode

**Files:**
- Modify: `src/components/GardenBackground.tsx`

GardenBackground reads its own foundation/moves/gardenBoosts — it has no idea about theme. But GameBoard now only renders GardenBackground when `theme === 'flower'`. So this is already handled by Task 3's conditional rendering. No changes needed to GardenBackground itself.

---

## Phase 5: App names and build

### Task 8: Update app display names

**Files:**
- Modify: `vite.config.ts` — `appName: 'Garden Solitaire'`
- Modify: `capacitor.config.ts` — `appName: 'Garden Solitaire'`
- Modify: `src/components/MenuOverlay.tsx` — if there's a game title, update it to show both "Flower Garden" and "Zen Garden" as theme names

Check MenuOverlay for any hardcoded game name:

```bash
rg "Garden" src/components/MenuOverlay.tsx
```

Update if needed.

**Run:** `npm run build` — expect clean build.

---

## Phase 6: Sync and verify

### Task 9: Build, sync, verify

- [ ] Run `npm run build`
- [ ] Run `npx cap sync ios`
- [ ] Verify no TypeScript errors
- [ ] Verify zen theme shows sand/rock/bamboo background
- [ ] Verify flower theme shows animated garden
- [ ] Verify toggle button switches between themes
- [ ] Verify app name shows correctly

---

## Self-Review Checklist

- [ ] All theme colors covered — bg, text, accents, card back
- [ ] ZenBackground renders without crashing
- [ ] Theme toggle works instantly (CSS-driven)
- [ ] Each theme's background persists game-to-game (same persist storage)
- [ ] No placeholder content (TODO, TBD)
- [ ] TypeScript passes cleanly
- [ ] Two separate game states maintained (same gameStore, separate by theme key — or check if theme-switching should reset. User said "just the garden" so same game, different look. But game state is per-theme... actually the user didn't say separate state. The game state already persists via capacitor storage. If user switches theme, game continues. That's probably fine.)

**Note on game state per theme:** The current gameStore persists to 'solitaire-game' key. Switching themes doesn't reset it — the same game state shows with a different visual theme. This seems correct per user intent (just aesthetic change).

---

## Execution Options

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per phase, review between phases

**2. Inline Execution** — I execute all tasks in this session, batch by phase

Which approach?