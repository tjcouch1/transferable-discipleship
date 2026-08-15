# Wesley Port Plan 3: Progress tracking + navigation aids + wrap-up

> **STATUS: COMPLETE (2026-07-16).** Verified: 14 jest suites / 39 tests, all
> screens.json checks pass, final semantic diff shows 69/69 screens
> content-identical to wesley-updates modulo the intended deltas, and a
> headless-Edge run exercised graying + badges + reset + Prev/Next +
> breadcrumbs end to end with 0 console errors.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** One persisted progress system (visited graying + ✓/% badges + working Reset), Previous/Next sibling navigation, and a derived Breadcrumb — replacing Wesley's two overlapping trackers, global-callback wiring, and hardcoded screen-name lists.

**Architecture:** `ProgressService` persists a visited map (`{[path]: {firstVisitedAt, lastVisitedAt, visitCount}}`, versioned by APP_VERSION like Wesley's so progress resets when content changes). `ProgressContext` holds it in state — graying, badges, completion % all compute synchronously from context + the screen map (no per-button storage reads). Navigation-marking happens in the components that navigate (no ActionFactory global callbacks). Prev/Next exclusions move into screens.json as `hideNavigationButtons: true` on exactly Wesley's 8 hub screens. Breadcrumb derives from the route path — the hierarchy fix removed the need for his special-case lists.

**Key behavior parity with wesley-updates:**
- Visited navigate-buttons gray out; buttons on the Home screen are exempt (his hardcoded `mainNavigationButtons` list ≈ Home's buttons; route-based rule also fixes his omission of Resources).
- ✓ badge for visited leaf targets, % badge for partially-visited sections.
- About → Reset Progress clears EVERYTHING (his reset only cleared the in-memory half).
- Prev/Next hidden on his 8 excluded hubs; sibling order preserved by the hierarchy fix (Basics↔Resources↔About neighbors unchanged).
- Breadcrumb: `Home › … › current`, hidden on Home, ancestors clickable.

---

### Task 1: ProgressService + ProgressContext

**Files:** Create `src/services/ProgressService.ts`, `src/contexts/ProgressContext.tsx`; test `__tests__/ProgressContext-test.tsx`; wire provider in `App.tsx`.

- [x] Service: `loadProgress()`, `saveProgress(map)` via StorageService (category `progress`, name `screens`, default APP_VERSION); pure `markVisit(map, path)` returning a new map with timestamps/count updated.
- [x] Context: `{ isVisited(path), completion(path), markVisited(path), resetProgress() }`; `completion` counts visited vs total descendant paths using `getAppScreens()`; `resetProgress` clears state AND persisted data.
- [x] Tests (mock ProgressService persistence): mark → isVisited true; completion over a known section; reset clears.
- [x] Provider added in `App` above `AppContent`. Full suite green. Commit.

### Task 2: ActionButton graying + badges + resetVisited action

**Files:** Modify `src/components/contents/buttons/ActionButton.tsx`, `src/util/ActionFactory.ts` (type only), restore About "Reset Progress" slide in `assets/data/screens.json`; test `__tests__/ActionButton-progress-test.tsx`.

- [x] Add `resetVisited` to the action data union. ActionButton handles it via `useProgress().resetProgress` (intercept before ActionFactory; no global callbacks).
- [x] Navigate buttons: on press, `markVisited(targetPath)` then navigate; visited targets get gray style (theme-derived, not `#d3d3d3`) unless rendered on the Home screen; badge = `✓` (leaf, visited) or `N%` (section, completion > 0).
- [x] Restore the Reset Progress slide from Wesley's file (original position, After Dark Mode slide).
- [x] Tests: press marks visited + grays; Home-screen button doesn't gray; resetVisited clears. Semantic diff: About now matches Wesley's except QuestionPrompt-converted content. Commit.

### Task 3: NavigationService + Previous/Next buttons

**Files:** Create `src/services/NavigationService.ts`, `src/components/contents/NavigationButtons.tsx` (one component, both buttons); modify `src/components/screens/ContentListScreen.tsx`, `src/components/screens/HeaderWithButtons.tsx`, `assets/data/screens.json` (flags), screens-data test (validate flag placement optional); test `__tests__/NavigationService-test.ts`.

- [x] `getSiblingScreenPath(path, offset: -1 | 1): string | undefined` — single function using the screen map's parent's subscreens order.
- [x] `NavigationButtons` renders ← Previous / Next → (theme colors), hidden when `screen.hideNavigationButtons`, marks visited on press. Rendered at the bottom of both screen components.
- [x] Add `hideNavigationButtons: true` to Wesley's 8 excluded screens (strip the `app:/Home/` prefix, map through hierarchy fix) + `ScreenDataBase` type.
- [x] Tests for sibling lookup (first/middle/last/root). Commit.

### Task 4: Breadcrumb

**Files:** Create `src/components/contents/Breadcrumb.tsx`; modify the two screen components; test `__tests__/Breadcrumb-test.tsx`.

- [x] Derive crumbs from `route.name` split on `/` (skip `app:` root): ancestors clickable (navigate + markVisited), current plain. Titles from each ancestor screen's Header/`id` the way the nav bar titles do (`screen.title || screen.id`). Hidden on Home.
- [x] Render at top of `ContentListScreen` and `HeaderWithButtons`.
- [x] Test: deep path renders expected crumb texts; Home renders nothing. Commit.

### Task 5: Wrap-up & full verification

- [x] Final semantic diff vs Wesley's screens.json — enumerate ALL deltas (version, attribution, hierarchy, QuestionPrompt×50, hideNavigationButtons×8, About slide positions) and confirm nothing else.
- [x] Full jest suite; `scripts/check-screens.mjs`; tsc error count == baseline (3).
- [x] Browser smoke: visited graying + ✓/% badges appear after navigating; Reset Progress restores colors; Prev/Next walk a lesson's subscreens and hide on hubs; breadcrumb trail correct + clickable; dark mode still consistent. Screenshots reviewed.
- [x] Update CLAUDE.md (progress/theming patterns), mark plan complete, tidy tmp files. Commit.
- [x] Version bump intentionally NOT done here (release-prep convention; suggest 2.3.0 at release).
