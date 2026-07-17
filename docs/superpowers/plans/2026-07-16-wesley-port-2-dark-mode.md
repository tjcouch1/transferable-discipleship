# Wesley Port Plan 2: Dark Mode (full consistent theming)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** App-wide light/dark theming with a persisted user preference (OS fallback) and a Dark Mode toggle on the About screen — replacing Wesley's partial version where only some components re-themed.

**Architecture:** `colors.json` gains Wesley's `dark` palette. `Theme.ts` exposes `getTheme(mode)` and drops the static default export so the compiler forces every consumer through the new `useTheme()` context hook. Module-level `createDesignStyleSheets(...)` calls become theme-keyed factories memoized by a WeakMap, called inside render. `ThemeService` persists the preference via StorageService with a fixed version key (survives app updates). The About screen's Dark Mode slide (deferred in Plan 1) is restored.

**Tech Stack:** React context, RN `useColorScheme`, `Switch`; RNTL tests.

**Consumers to convert (from grep):** `BasicButton.tsx`, `Header.tsx`, `QuestionPrompt.tsx`, `ScheduleTable.tsx`, `Slide.tsx`, `Text.tsx`, `App.tsx`.

---

### Task 1: Palette + Theme.ts + ThemeService + ThemeContext

**Files:**
- Modify: `assets/data/colors.json` (append Wesley's `dark` palette verbatim from `git show wesley-updates:assets/data/colors.json`)
- Modify: `src/Theme.ts`
- Create: `src/services/ThemeService.ts`, `src/contexts/ThemeContext.tsx`
- Test: `__tests__/ThemeContext-test.tsx`

- [ ] **Step 1:** `Theme.ts`: export `type ThemeMode = 'light' | 'dark'`, export `Colors` type, `getTheme(mode: ThemeMode): Colors` (fallback to light if a mode is missing), REMOVE the default export (build errors then enumerate all remaining static consumers — the conversion checklist).
- [ ] **Step 2:** `ThemeService.ts`: `getThemePreference(): Promise<ThemeMode | undefined>` / `setThemePreference(mode: ThemeMode)` using StorageService `loadData`/`saveData` with category `settings`, name `theme`, and a FIXED version string (`'settings'`-style constant, NOT the app version, so the preference survives updates — check StorageService's signature for how version is used).
- [ ] **Step 3:** `ThemeContext.tsx`: `ThemeProvider` holds `mode` state initialized to OS scheme (`useColorScheme()`), loads persisted preference on mount (overrides OS), exposes `{ theme, mode, isDark, setMode }`; `setMode` persists via ThemeService. `useTheme()` throws outside provider.
- [ ] **Step 4:** Test: mock `../src/services/ThemeService`; render a probe component under `ThemeProvider`; assert light default, `setMode('dark')` switches `theme.app.background` to the dark value and calls the persistence mock.
- [ ] **Step 5:** Run test → PASS. Commit.

### Task 2: Convert all static theme consumers

**Files:**
- Modify: `src/util/DesignStyleSheets.ts` (add memoized themed factory helper), the 6 component files, `App.tsx`

- [ ] **Step 1:** In `DesignStyleSheets.ts` add:

```ts
/** Memoize a theme-dependent style factory by theme object (one per mode) */
export function themedStyles<T>(factory: (theme: Colors) => T): (theme: Colors) => T {
  const cache = new WeakMap<object, T>();
  return theme => {
    let styles = cache.get(theme);
    if (!styles) {
      styles = factory(theme);
      cache.set(theme, styles);
    }
    return styles;
  };
}
```

- [ ] **Step 2:** Each component: `const getDesignStyles = themedStyles(theme => createDesignStyleSheets({...}, {...}))`, and inside the component `const designStyles = getDesignStyles(useTheme().theme)[design]`-style usage. Preserve styles exactly; only the color sources change.
- [ ] **Step 3:** `App.tsx`: split `App` (providers incl. `ThemeProvider`) from `AppContent` (existing body); `AppContent` uses `useTheme()` for `backgroundStyle`, StatusBar `barStyle` (`isDark ? 'light-content' : 'dark-content'`), and navigator `screenOptions` colors.
- [ ] **Step 4:** `npx tsc --noEmit` — zero references to the removed default export remain. Full jest suite passes.
- [ ] **Step 5:** Commit.

### Task 3: DarkModeToggle content type + About slide

**Files:**
- Create: `src/components/contents/DarkModeToggle.tsx`
- Modify: `src/components/contents/Contents.ts`, `__tests__/screens-data-test.ts` (register), `assets/data/screens.json` (restore slide)
- Test: `__tests__/DarkModeToggle-test.tsx`

- [ ] **Step 1:** Failing test: render `ThemeProvider` + `DarkModeToggle`; toggling the switch flips `useTheme().isDark` (probe) and calls persistence mock.
- [ ] **Step 2:** Implement: label ("Dark Mode") + RN `Switch` bound to `isDark`/`setMode`, colors from `theme` (no hardcoded hex). Register in Contents union/map + test type list.
- [ ] **Step 3:** Restore the About "Dark Mode" slide: extract the exact slide JSON from Wesley's screens.json (`git show wesley-updates:assets/data/screens.json`) and insert at its original position (index 1 of About contents). Verify with `scripts/compare-screens.mjs` (only remaining About delta vs Wesley = Reset Progress slide) and jest.
- [ ] **Step 4:** Commit.

### Task 4: Verify end-to-end

- [ ] **Step 1:** Full jest suite green; `scripts/check-screens.mjs` passes.
- [ ] **Step 2:** Browser smoke (scratchpad `smoke-web.mjs` pattern): About → toggle Dark Mode → screenshot: dark background app-wide (Home, a lesson slide, Sample Schedule table); reload → preference persisted; 0 console errors. LOOK at the screenshots.
- [ ] **Step 3:** Mark plan complete; commit.
