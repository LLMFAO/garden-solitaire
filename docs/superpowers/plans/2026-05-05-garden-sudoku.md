# Garden Sudoku Implementation Plan

**Date:** 2026-05-05
**Project:** Garden Sudoku
**Starting point:** Existing Garden Solitaire React/TypeScript/Capacitor app
**Goal:** Build a similarly themed mobile-first Sudoku app with difficulty levels 1, 2, and 3, common Sudoku controls, and the same soft garden/zen visual language.

---

## 1. Current App Review

The existing app is a good base for a Sudoku variant because the visual shell and game logic are already separated.

Reusable pieces:

- `src/App.tsx` handles the splash-to-game transition and applies the active theme through `data-theme`.
- `src/index.css` owns the app frame, mobile-first layout, garden palette, zen palette, and responsive sizing.
- `src/components/SplashScreen.tsx` provides the animated loading screen style.
- `src/components/GameBoard.tsx` owns the full-screen garden layout and renders either `GardenBackground` or `ZenBackground`.
- `src/components/TopBar.tsx` provides the glassy top controls, timer, progress display, menu button, and theme toggle.
- `src/components/MenuOverlay.tsx` provides the modal menu style, toggles, stats area, and new-game action.
- `src/components/WinOverlay.tsx` provides the end-game celebration pattern.
- `src/components/GardenBackground.tsx` and `src/components/ZenBackground.tsx` provide the growing visual theme.
- `src/hooks/useGameTimer.ts`, `src/hooks/useHaptics.ts`, and `src/hooks/useCompactMode.ts` are reusable.
- `src/store/settingsStore.ts` already persists theme, haptics, and stats.

Solitaire-specific pieces to replace:

- `src/components/Card.tsx`
- `src/components/StockWaste.tsx`
- `src/components/Foundation.tsx`
- `src/components/Tableau.tsx`
- Most of `src/store/gameStore.ts`
- Most of `src/engine/*`
- Solitaire-specific tests in `tests/gameLogic.test.ts`

Important cleanup opportunity:

- `recordGameResult` exists in `settingsStore`, but no current caller was found. The Sudoku version should record completed games when the win condition is reached.
- `undo()` in the current game store is a stub. Sudoku should ship with a real undo history because it is a common expected control.

---

## 2. Product Direction

Working title: **Garden Sudoku**

Core positioning:

- A calm, garden-themed Sudoku app.
- Mobile-first, playable one-handed.
- Same soft, rounded, animated feel as Garden Solitaire.
- Three clear difficulty levels:
  - `1`: Easy
  - `2`: Medium
  - `3`: Hard

Suggested copy changes:

- App name: `Garden Sudoku`
- Splash subtitle: `Grow your garden one number at a time`
- Loading text: `Planting numbers...`
- New game button: `New Puzzle`
- Win title: `Garden Complete!` or `Puzzle Complete!`
- Stats label changes: `Played`, `Solved`, `Best Time`, `Best Streak`

Use `Sudoku` spelling in app text and identifiers unless the misspelling `Suduko` is intentionally part of the brand.

---

## 3. Licensing And Commercial Use

The planned open source dependency is `sudoku-gen`:

- npm: https://www.npmjs.com/package/sudoku-gen
- GitHub: https://github.com/petewritescode/sudoku-gen
- License listed on GitHub/npm: MIT

MIT license is compatible with selling an app, including in the Apple App Store, as long as the required copyright and license notice is preserved.

Implementation requirements:

- Add `sudoku-gen` to dependencies only if using it:
  - `npm install sudoku-gen`
- Include its MIT license notice in an acknowledgements/license file, for example:
  - `THIRD_PARTY_NOTICES.md`
  - an in-app `Licenses` screen
  - App Store metadata support URL or legal page, if one exists
- Do not copy README text, examples, or generated docs verbatim into marketing copy beyond short attribution.
- Keep the Sudoku generator behind a local adapter so it can be replaced later without touching UI components.

Recommended dependency decision:

- Use `sudoku-gen` for v1 because it is small, fast, TypeScript-friendly, browser-friendly, and MIT licensed.
- Map app difficulty levels to library difficulties:
  - `1 -> easy`
  - `2 -> medium`
  - `3 -> hard`
- Keep `expert` out of v1 unless a fourth difficulty is added later.

---

## 4. Target Architecture

Create a Sudoku-specific engine while preserving the visual shell.

Suggested file map:

```text
src/
  components/
    GameBoard.tsx              Reworked Sudoku board shell
    SudokuBoard.tsx            9x9 grid layout
    SudokuCell.tsx             Individual cell rendering
    NumberPad.tsx              1-9 input controls
    SudokuControls.tsx         Undo, erase, notes, hint, check
    TopBar.tsx                 Timer, progress, mistakes, menu, theme
    MenuOverlay.tsx            New puzzle, difficulty, settings, stats
    SplashScreen.tsx           Garden Sudoku loading screen
    WinOverlay.tsx             Completion overlay
    GardenBackground.tsx       Reused with Sudoku progress prop
    ZenBackground.tsx          Reused with Sudoku progress prop
  engine/
    sudoku/
      types.ts
      generator.ts
      validation.ts
      scoring.ts
      index.ts
  store/
    gameStore.ts               Sudoku game state
    settingsStore.ts           Theme, haptics, stats, preferences
  hooks/
    useGameTimer.ts
    useHaptics.ts
    useCompactMode.ts
tests/
  sudokuLogic.test.ts
```

Keep UI components separate from Sudoku generation:

- UI should only call store actions like `newGame`, `selectCell`, `setCellValue`, `toggleNote`, `eraseCell`, `undo`, `useHint`, and `checkPuzzle`.
- Store should call pure engine functions.
- Engine should not import React, Zustand, Framer Motion, or Capacitor.

---

## 5. Sudoku Types

Recommended core types:

```ts
export type DifficultyLevel = 1 | 2 | 3;
export type DifficultyName = 'easy' | 'medium' | 'hard';
export type CellValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface CellPosition {
  row: number;
  col: number;
}

export interface SudokuPuzzle {
  puzzle: CellValue[][];
  solution: CellValue[][];
  difficulty: DifficultyLevel;
  givens: boolean[][];
}

export interface MoveRecord {
  row: number;
  col: number;
  previousValue: CellValue;
  nextValue: CellValue;
  previousNotes: number[];
  nextNotes: number[];
}
```

Use `0` internally for empty cells. Convert `sudoku-gen` dash/string output into `0` based grids inside `generator.ts`.

---

## 6. Game Store Shape

Replace solitaire state with Sudoku state:

```ts
interface GameState {
  puzzle: CellValue[][];
  solution: CellValue[][];
  givens: boolean[][];
  values: CellValue[][];
  notes: number[][][];
  selectedCell: CellPosition | null;
  difficulty: DifficultyLevel;
  mistakes: number;
  hintsUsed: number;
  moves: number;
  timeElapsed: number;
  gameStatus: 'idle' | 'playing' | 'won';
  history: MoveRecord[];
  notesMode: boolean;
  checkMode: boolean;
  gardenBoosts: number;

  newGame: (difficulty?: DifficultyLevel) => void;
  restartGame: () => void;
  selectCell: (row: number, col: number) => void;
  setCellValue: (value: CellValue) => void;
  eraseCell: () => void;
  toggleNote: (value: number) => void;
  toggleNotesMode: () => void;
  toggleCheckMode: () => void;
  useHint: () => void;
  undo: () => void;
  tickTimer: () => void;
  checkWin: () => void;
  popGardenBoost: () => void;
}
```

Persistence:

- Persist active puzzle, solution, givens, values, notes, difficulty, mistakes, hints used, moves, timer, status, and history.
- Use a new storage key, for example `garden-sudoku-game`, to avoid loading incompatible solitaire state.
- Use `garden-sudoku-settings` or migrate `solitaire-settings` carefully if this becomes a new app bundle.

---

## 7. Core Game Rules

Cell input:

- Given cells are locked.
- Empty or player-entered cells can be changed.
- If notes mode is off, tapping a number sets the selected cell value.
- If notes mode is on, tapping a number toggles that note in the selected cell.
- Entering a final value clears notes in that cell.

Validation:

- A cell is correct when `values[row][col] === solution[row][col]`.
- A value conflicts if the same number appears in the same row, column, or 3x3 box.
- In check mode, incorrect player values should be visibly marked.
- Decide whether mistakes are counted immediately on wrong entry or only when `Check` is pressed. For v1, immediate wrong-entry counting is simplest and common.

Win condition:

- Every cell is filled.
- Every filled value matches the solution.
- On win:
  - Set `gameStatus` to `won`.
  - Record stats.
  - Trigger success haptics.
  - Show `WinOverlay`.

Scoring/progress:

- Sudoku does not need a solitaire-style score in v1.
- Use progress as `correctFilledCells / 81`.
- Top bar can show timer, mistakes, difficulty, and progress.
- Garden growth should follow correct progress, not raw taps.

---

## 8. UI Plan

### 8.1 App Shell

Keep the existing full-screen app shell:

- Mobile uses full viewport.
- Desktop uses phone-sized framed viewport.
- Use the same `app-shell`, `app-frame`, and theme CSS structure.

### 8.2 Splash Screen

Keep the same motion structure:

- Full-screen gradient.
- Floating garden elements.
- Central animated icon.
- `JozGames` title if this brand remains correct.
- Subtitle `Garden Sudoku`.
- Tagline `Grow your garden one number at a time`.
- Loading bar and animated loading text.

Optional central icon options:

- A garden house plus number grid motif.
- A simple rounded 3x3 mini Sudoku tile built in HTML/CSS.
- Avoid casino/card imagery.

### 8.3 Game Board

Replace solitaire layout with:

```text
TopBar
Garden/Zen animated background
SudokuBoard
SudokuControls
NumberPad
MenuOverlay
WinOverlay
GardenFacts or SudokuTips
```

Board requirements:

- 9x9 square grid.
- Stronger borders around each 3x3 box.
- Rounded outer border, but keep corners modest and polished.
- Given cells slightly darker/bolder.
- Selected cell highlighted with warm yellow/sun accent.
- Same row, column, and box softly tinted.
- Same number cells softly highlighted.
- Conflicts or mistakes use rose accent.
- Notes appear as tiny 3x3 mini numbers inside a cell.

### 8.4 Number Pad

Provide numbers `1` through `9` in a stable responsive grid.

Suggested layout:

- Mobile portrait: one row of 9 if it fits, otherwise 3x3.
- Desktop framed view: one row or 3x3 depending on available width.
- Use large tap targets.
- Disable numbers that are fully completed only if it feels helpful; do not hide them.

### 8.5 Common Controls

Include these controls in v1:

- New puzzle
- Restart puzzle
- Difficulty `1`, `2`, `3`
- Notes mode toggle
- Erase
- Undo
- Hint
- Check
- Timer
- Mistake count
- Theme toggle
- Haptics toggle
- Reset stats

Control placement:

- Top bar: menu, difficulty/progress/timer/mistakes, theme toggle.
- Below board: compact icon buttons for undo, erase, notes, hint, check.
- Bottom: number pad.
- Menu overlay: new puzzle, restart, difficulty selector, toggles, stats.

Use clear labels in the menu. Use icon-first buttons in the game surface where the meaning is familiar.

### 8.6 Menu Overlay

Adapt the current modal:

- Title: `Garden Sudoku`
- Subtitle: `Flower Garden & Zen Garden`
- Primary button: `New Puzzle`
- Secondary button: `Restart Puzzle`
- Difficulty segmented control: `1`, `2`, `3`
- Toggles:
  - Notes Assist, if implemented
  - Haptics
  - Highlight Conflicts
- Stats:
  - Played
  - Solved
  - Best Time
  - Best Streak
- Reset stats button.

### 8.7 Win Overlay

Adapt the current overlay:

- Keep particles and garden completion language.
- Show:
  - Time
  - Difficulty
  - Mistakes
  - Hints used
- Primary action: `New Puzzle`
- Optional secondary action: `Same Difficulty`

---

## 9. Background Progress Refactor

Currently the backgrounds import solitaire state directly and calculate progress from foundation cards and moves.

Refactor backgrounds to accept props:

```ts
interface ProgressBackgroundProps {
  progress: number;
  moves: number;
  gardenBoosts: number;
  onCollectBoost?: () => void;
}
```

Then update:

- `GardenBackground` uses Sudoku progress and move count.
- `ZenBackground` uses Sudoku progress.
- `GameBoard` computes:
  - `correctCells`
  - `progress = correctCells / 81`
  - `moves`
  - `gardenBoosts`

This keeps the garden idea while removing solitaire assumptions like `foundation.length / 52`.

---

## 10. Haptics

Reuse `useHaptics`.

Suggested patterns:

- Select cell: light
- Enter value: light
- Wrong value: soft/error
- Toggle notes: light
- Hint: medium
- Undo: light
- Complete puzzle: success

Make all haptics respect `hapticsEnabled`.

---

## 11. Stats

Update settings store stats:

```ts
interface Stats {
  gamesPlayed: number;
  gamesWon: number;
  bestTimeByDifficulty: Record<DifficultyLevel, number | null>;
  currentStreak: number;
  bestStreak: number;
  fewestMistakes: number | null;
}
```

When a new puzzle starts, increment `gamesPlayed` once.

When a puzzle is solved:

- Increment `gamesWon`.
- Update best time for that difficulty.
- Update streaks.
- Update fewest mistakes if desired.

Avoid double-counting restored games by tracking whether the current puzzle result has already been recorded.

---

## 12. Accessibility

Minimum v1 accessibility:

- Each cell is a button with an aria label like `Row 4 column 7, empty` or `Row 4 column 7, given 8`.
- Number pad buttons have labels like `Enter 5`.
- Notes mode button exposes pressed state.
- Keyboard support:
  - Arrow keys move selected cell.
  - Number keys enter values or notes.
  - Backspace/Delete erase.
  - `N` toggles notes mode.
  - `U` undo.
- Visual state should not rely on color alone:
  - Given cells use font weight.
  - Mistakes use icon/outline/tint.
  - Notes have distinct small placement.
- Respect `prefers-reduced-motion` for heavy animations.

---

## 13. Testing Plan

Create `tests/sudokuLogic.test.ts`.

Core tests:

- Difficulty level mapping:
  - `1 -> easy`
  - `2 -> medium`
  - `3 -> hard`
- Generator returns 9x9 puzzle and 9x9 solution.
- Given cells match solution.
- Row conflict detection works.
- Column conflict detection works.
- Box conflict detection works.
- Locked given cells cannot be changed.
- Notes can be toggled and are cleared when a value is entered.
- Erase clears player-entered values, not givens.
- Undo restores previous value and notes.
- Hint fills one correct non-given empty cell.
- Win detection only succeeds when all values match solution.
- Stats record once per completed puzzle.

Verification commands:

```bash
npm test
npm run build
```

Manual QA:

- Start a level 1 puzzle.
- Fill a correct value.
- Enter a wrong value and confirm mistake/conflict styling.
- Toggle notes and add/remove notes.
- Undo a move.
- Use erase.
- Use hint.
- Restart same puzzle.
- Start level 2 and level 3 puzzles.
- Complete a puzzle using a test fixture and verify win overlay/stats.
- Toggle flower/zen themes.
- Check desktop framed layout and mobile viewport layout.

---

## 14. Implementation Phases

### Phase 1: Metadata And Naming

- Update `package.json` name if this is becoming a separate app.
- Update `vite.config.ts` PWA manifest:
  - `name`
  - `short_name`
  - `description`
  - icons later if needed
- Update `capacitor.config.ts`:
  - `appId`
  - `appName`
- Update README title and description.

### Phase 2: Sudoku Engine

- Add `sudoku-gen` dependency if using it.
- Create `src/engine/sudoku`.
- Implement difficulty mapping.
- Implement string-to-grid conversion.
- Implement row/column/box validation.
- Implement win detection.
- Add initial logic tests.

### Phase 3: Sudoku Store

- Replace solitaire game state with Sudoku state.
- Use new persistence key.
- Implement `newGame`, `restartGame`, `selectCell`, `setCellValue`, `eraseCell`, `toggleNote`, `undo`, `useHint`, and `checkWin`.
- Wire timer.
- Wire stats recording.

### Phase 4: Board UI

- Create `SudokuBoard`.
- Create `SudokuCell`.
- Implement selected row/column/box highlighting.
- Implement same-number highlighting.
- Implement notes rendering.
- Implement conflict/mistake rendering.

### Phase 5: Controls

- Create `NumberPad`.
- Create `SudokuControls`.
- Adapt `TopBar`.
- Adapt `MenuOverlay`.
- Ensure all controls are touch-friendly and stable in the phone frame.

### Phase 6: Theme And Progress

- Refactor backgrounds to accept progress props.
- Compute progress from correct cells.
- Keep flower/zen toggle.
- Tune colors so the board remains readable over both backgrounds.

### Phase 7: Polish

- Update splash screen copy and central motif.
- Update win overlay.
- Add Sudoku tips or replace garden facts if desired.
- Add haptics.
- Add reduced-motion handling.
- Verify responsive layout with screenshots.

### Phase 8: App Store Readiness

- Add third-party license notice for `sudoku-gen`.
- Confirm no placeholder text.
- Confirm no broken links.
- Confirm app works offline.
- Confirm Capacitor build runs.
- Prepare App Store screenshots.
- Prepare privacy answers. If the app has no tracking, analytics, accounts, or network backend, keep privacy scope minimal.

---

## 15. Open Questions

- Should hints be unlimited, limited per puzzle, or monetized?
- Should wrong entries be blocked immediately or allowed with mistake marking?
- Should level 3 allow notes assist, or should notes assist be a setting?
- Should there be a daily puzzle mode in v1 or later?
- Should the app ship as a separate App Store listing from Garden Solitaire?
- Should the garden facts stay, or become Sudoku strategy tips?

---

## 16. Recommended V1 Scope

Ship v1 with:

- Flower and zen themes.
- Difficulty 1, 2, and 3.
- New puzzle and restart.
- Timer.
- Mistake counter.
- Notes mode.
- Erase.
- Undo.
- Hint.
- Check/highlight conflicts.
- Completion overlay.
- Local stats.
- Haptics.
- Offline support.
- MIT license attribution for the generator dependency.

Defer:

- Daily puzzles.
- Leaderboards.
- Cloud sync.
- Paid hint packs.
- Extra visual themes.
- Account system.
- Advanced Sudoku variants.
