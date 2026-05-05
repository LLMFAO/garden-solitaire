# Remove Zen Mode and Keep One Traditional Garden

## Goal

Remove zen mode from the app entirely and make the product a single traditional garden solitaire experience. The top-right button should no longer switch between garden themes. The app should always render the traditional garden background, and there should be no user-facing references to zen mode.

Do not replace zen mode with another theme in this task. The intended outcome is one focused garden mode that can keep improving visually over time.

## Current Context

The app currently supports two theme values:

- `flower`: traditional garden mode
- `zen`: zen garden mode

Theme selection is stored in `src/store/settingsStore.ts` and persisted under the `solitaire-settings` key. Because users may already have `theme: "zen"` saved, removal must handle old persisted settings without trapping them in a missing mode.

The main render path is:

- `src/App.tsx` reads `theme` from settings and passes it to `GameBoard`.
- `src/components/GameBoard.tsx` accepts `theme?: 'flower' | 'zen'`.
- `GameBoard` renders `<GardenBackground />` for `flower`, otherwise `<ZenBackground />`.
- `src/components/TopBar.tsx` reads `theme` and `toggleTheme`; the top-right button currently toggles between modes.
- `src/components/MenuOverlay.tsx` currently mentions both garden modes in the subtitle.
- `src/components/ZenBackground.tsx` contains the zen background implementation and should become unused, then be deleted.

There are uncommitted visual changes in `GardenBackground.tsx`, `ZenBackground.tsx`, and `MenuOverlay.tsx` from the current graphics pass. Work with those changes, do not revert unrelated files or generated/private directories.

## Implementation Plan

1. Remove theme from settings state.

   Update `src/store/settingsStore.ts`:

   - Remove `theme: 'flower' | 'zen'` from `SettingsState`.
   - Remove the initial `theme: 'flower'`.
   - Remove `toggleTheme`.
   - Remove `theme` from `partialize`.

   Add a small persistence migration if needed so old stored settings with `theme: "zen"` do not matter. Since removing `theme` from `partialize` means future saves omit it, the simplest acceptable migration is usually to ignore the extra persisted field. Verify Zustand does not require an explicit migrate function for this shape change.

2. Simplify `App`.

   Update `src/App.tsx`:

   - Remove `useSettingsStore` import if it is only used for theme.
   - Remove the `theme` read.
   - Remove `data-theme={theme}` from `.app-shell` or replace it with no theme attribute.
   - Render `<GameBoard compact={isCompact} />` with a stable key. Do not key the board by theme anymore.

3. Simplify `GameBoard`.

   Update `src/components/GameBoard.tsx`:

   - Remove the `theme?: 'flower' | 'zen'` prop.
   - Remove the `ZenBackground` import.
   - Always render `<GardenBackground />`.
   - Keep all game layout behavior unchanged.

4. Remove the top-right theme switch.

   Update `src/components/TopBar.tsx`:

   - Remove `theme` and `toggleTheme` reads from `useSettingsStore`.
   - Decide what the top-right button should do after removal.

   Recommended behavior:

   - Keep the button visually present only if it already has another clear app action.
   - If it has no useful action, remove the button and rebalance the top bar layout.
   - Do not leave a dead button, and do not show a zen icon.

   If removing the button entirely makes the top bar feel lopsided, replace the right area with a non-interactive score/progress ornament only if it improves balance. Keep it simple.

5. Remove zen user-facing copy.

   Update `src/components/MenuOverlay.tsx`:

   - Change `Traditional Garden & Zen Garden` to a single-mode phrase such as `Traditional Garden Solitaire` or remove the subtitle entirely.
   - Search for other `Zen`, `zen`, or `Flower Garden & Zen Garden` references and remove/replace them.

6. Delete zen-specific implementation and styles.

   Remove:

   - `src/components/ZenBackground.tsx`

   Update `src/index.css`:

   - Remove `[data-theme="zen"]` blocks and zen-specific CSS variables/backgrounds if no longer used.
   - Keep base garden variables and `.garden-bg` styling.

7. Search and clean imports/types.

   Run:

   ```bash
   rg "zen|Zen|toggleTheme|theme:|data-theme|ZenBackground" src
   ```

   Resolve all app-code matches unless they are intentionally retained in historical docs. There should be no runtime zen references after this task.

8. Rebuild iOS assets.

   Run:

   ```bash
   npm run build
   npx cap copy ios
   ```

   This is needed because Xcode runs the copied web assets from `ios/App/App/public`, not the raw source files.

## Validation

Run:

```bash
npm run build
git diff --check
```

Also run:

```bash
npm test
```

Known issue: at the time this task was written, `npm test` may fail from an existing Capacitor Preferences / Node `window is not defined` issue in store tests. If that failure still appears and no zen-removal-related tests fail, note it in the handoff rather than mixing a test-environment fix into this task.

Manual Xcode check:

1. Run `npx cap copy ios` after the production build.
2. In Xcode, clean build folder if needed.
3. Delete the installed app from the simulator/device if old web assets appear cached.
4. Press Command-R.
5. Confirm there is only one garden mode.
6. Confirm the top-right button no longer switches themes or shows zen/rock affordances.
7. Confirm old persisted users previously on `zen` still open into the traditional garden.

## Acceptance Criteria

- The app always renders the traditional garden background.
- There is no top-right theme toggle.
- There is no reachable zen garden UI.
- There are no runtime imports of `ZenBackground`.
- There are no user-facing references to zen mode.
- Existing saved settings with `theme: "zen"` do not break app startup.
- `npm run build` passes.
- `npx cap copy ios` has been run so Xcode sees the updated bundle.

## Notes for the Implementing Agent

Keep this task narrow. Do not redesign the traditional garden in this pass unless the removal leaves a visible layout hole. The next useful visual follow-up is improving the single traditional garden’s progression and polish, but this task is specifically about removing zen mode and its toggle cleanly.
