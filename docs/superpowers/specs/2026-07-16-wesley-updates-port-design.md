# Porting Wesley's Updates to Main — Catalog & Implementation Plan

Date: 2026-07-16
Sources of intent: `wesley-chat-history.md` (final Cursor session only), the AI-generated
docs he committed (`IMPLEMENTATION_SUMMARY.md`, `BOOKMARKS_AND_PROGRESS.md`, `SHARING.md`),
and a semantic diff of `wesley-updates` (commit `7c5d843`) against merge-base `1e13c38`.

## Situation

- `wesley-updates` is one squashed commit on top of `1e13c38` (v2.2.1-update.1).
- `main` has since gained: multi-scripture-API refactor + NET translation (PR #31),
  `dist/` gitignore (#32), v2.2.2 (#33), Expo 54 + whole-repo Prettier re-quote (#34),
  license updates (#35).
- A rebase is not viable: main rewrote most files Wesley touched (formatting + the
  scripture layer), and much of Wesley's code should not be carried over as-is.
  **Decision: reimplement on a fresh branch off `main`.**

## Part 1 — Catalog of Wesley's changes

### A. Content changes (`assets/data/screens.json`) — the heart of the work

The semantic diff (key-order-insensitive, keyed by screen path) shows this is a
**full content overhaul**, not a set of small edits:

1. **New information architecture.** Everything now lives under a single
   `Home/Start Here` section. Home shows: Start Here, Basics, Resources, About
   (Basics/Resources/About buttons deep-link into `Start Here/...` paths).
   `Start Here` contains: The Challenge, WhyUseTD, Basics, Resources, About.
2. **Removed sections**: `Essentials` (with `The Great Commission` and
   `Discipleship (Who, Why & How)` and all their subscreens) and `How to`.
3. **New section `WhyUseTD`** ("Why use TD") — 7 subscreens; absorbs the old About
   screen's Vision/Simple/Accessible/Transferable copy.
4. **Every Basics lesson rewritten** with new subscreen IDs and largely new copy:
   - Gospel Review: 5 old subscreens → 7 new (incl. `HalfwayRecap`)
   - Scripture 1.0: 6 → 7 (incl. `ScriptureHalfwayRecap`)
   - Assurance of Salvation: 5 → 6 (incl. `AssuranceHalfwayRecap`)
   - Holy Spirit: 8 → 9 (incl. `OpeningReflection`, `HolySpiritHalfwayRecap`)
   - Prayer: 6 → 7 (incl. `OpeningReflection`, `PrayerHalfwayRecap`)
   - The Challenge: one long screen → hub with 5 subscreens
   - Heavy use of question-specific "tap to reveal" prompts (`hiddenButton` text),
     `answerInSlide` inline answers, and `Text` `segments` (italic/underline).
5. **New section `Resources`**: `Intentionality` (hub + 4 subscreens),
   `SampleSchedule` (uses new `ScheduleTable` component), `CheckInQuestions`
   (hub + 5 subscreens; Feelings Chart was added then removed on request).
6. **About screen changes**: added a "Dark Mode" slide (`DarkModeToggle`) and a
   "Reset Progress" slide (`resetVisited` action button); attribution changed
   WEB → NET (his wording differs from main's — main's NET/helloao wording must win
   for license accuracy).
7. **Only 4 content/prop additions** to the schema are needed by his data:
   `ScheduleTable` (1 use), `DarkModeToggle` (1 use), `Text.segments` (3 uses),
   `ScriptureSlide.answerInSlide` (5 uses), plus the `resetVisited` action (1 use).
8. **Noise**: his tooling re-serialized the whole file (key reordering — confirmed
   by his own chat: "JSON.stringify may have reordered keys across the whole JSON
   file"). The semantic diff cuts through this; the file's *content* is real.
9. **Hierarchy artifact (fix silently)**: Basics, Resources, and About are
   nested as children of `Start Here` but Start Here never links to them — they
   are only cross-linked from Home. The base file has zero such anomalies
   (`scripts/check-screens.mjs` verifies). The Breadcrumb code hardcodes those
   exact three names to hide the bogus "Start Here" crumb — evidence the AI
   papered over its own mistake. **Port fix**: make Basics/Resources/About
   direct children of Home (siblings of Start Here), retarget Home's buttons,
   drop the breadcrumb special-casing. Not a user-visible change; excluded from
   the content report to Wesley.
10. **Mis-fitting components (normalize)**: 44 reflection questions are
    `ToggleButton`s whose alternate text is identical to the label — tapping
    only appends "(tap to go back)". 6 more prompts are `BasicButton`s with no
    action. The base file has zero of either; its convention is that reader
    prompts are non-interactive text and ToggleButton is only for genuine
    reveals. **Port fix**: add a small non-interactive content type (working
    name `QuestionPrompt`; renders the answer-style emphasized box without
    button semantics) and mechanically convert all 50 spots.
    `ScriptureSlide.answerInSlide` should render the same component internally.

### B. Scripture data

- Wesley replaced the WEB cache in `assets/data/scripture.json` with a NET cache
  (154 refs, fetched from labs.bible.org via new `lib/rebuild-scripture-net.mjs`).
- Main independently moved to NET but via `bible.helloao.org` with a per-API cache
  format; the old `assets/data/scripture.json` no longer exists on main.
- His screens.json uses **92 unique references**, all present in his cache, none
  specifying `shortName` (so the default NET applies on main).
- **Port implication**: his scripture.json, `rebuild-scripture-net.mjs`, and
  `translations.json` edit are all obsolete; instead, regenerate
  `assets/data/bible.helloao.org/scripture.json` to cover the 92 references.

### C. Code features — keep (reachable, user-visible)

| Feature | What it does | Reimplementation notes |
|---|---|---|
| Dark mode | `dark` palette in `colors.json`; `ThemeService` persistence; `ThemeContext`; `DarkModeToggle` content (About screen); OS-scheme fallback | His version is **partial** — components importing the static `theme` don't re-theme (mixed light/dark UI). Reimplement so the whole app themes consistently. Drop dead `useThemeColors` export. |
| Visited graying + progress | Visited nav buttons gray out; green ✓/% badges on buttons; `resetVisited` action (About) | He built **two overlapping systems**: in-memory `VisitedScreensContext` (graying, reset) and persisted `ProgressService` (badges) — reset only clears the in-memory half. Consolidate into **one persisted service** powering graying, badges, and reset. Remove the ActionFactory global-callback hack and the write-only `visitedScreensSet`. |
| Next/Previous buttons | Orange Prev/Next sibling navigation at bottom of every content screen | Hardcoded 8-path `EXCLUDED_SCREENS` list duplicated in both files. Replace with a data-driven flag on screens (e.g. `hideNavigationButtons`) or derive from structure. Merge the two near-identical sibling functions in `NavigationService`. |
| Breadcrumb | Clickable `Home › … › Current` trail on every screen | Hardcoded `'Start Here'` special-casing and `directNavigationTargets` list. Reimplement data-driven (derive from screen tree/titles). |
| `ScheduleTable` | 3-column bordered grid for Sample Schedule; per-cell bold/italic | Keep; move hardcoded colors into theme; use app `Text` consistently. |
| `Text.segments` | Inline per-span styling (italic+underline words in Prayer) | Keep; route segments through the existing font-resolution logic so iOS bold/italic works. |
| `ScriptureSlide.answerInSlide` | Answer shown inline (no tap-to-reveal) in same slide | Keep; small addition to main's restructured ScriptureSlide. |
| ToggleButton tap hints | Auto-appends "(Tap to reveal)"/"(tap to go back)" when label lacks it | Keep the UX; simplify the substring-sniffing implementation. |
| BasicButton shadows | Platform shadows on nav buttons | Keep; trivial cosmetic port. |
| NET translation | Default WEB → NET | Already on main; nothing to port except the cache regeneration (B above). |

### D. Code — drop (dead/unreachable or superseded)

- **Bookmarks** (service + context + screen + `bookmark` action): screen is never
  registered in `ScreenService` and no data references it — completely unreachable.
  His own docs say "not yet added to navigation". Track as future work if wanted.
- **Sharing / deep links** (`ShareService`, `share` action, `app.json`
  scheme/linking, App.tsx deep-link handler): `share` action has 0 data uses;
  the linking config's `screens` map is empty and handlers are TODO/console.log —
  non-functional. `expo-sharing` dependency is never imported. Drop all.
- **SettingsScreen + `assets/data/settings.json`**: not navigable from anywhere;
  duplicates the About screen's DarkModeToggle inline. Drop.
- **Example files**: `EnhancedLoadingExample.tsx`,
  `ScrRangeDisplay.enhanced.example.tsx` — self-described examples, never imported.
- **`ScriptureSlide.revealAnswerInitially` / `ToggleButton.revealedInitially`**:
  added then unused (0 data uses; the Ephesians 5:18 request that motivated it was
  later reverted). Drop.
- **One-off tooling / artifacts**: `replace_holy_spirit_subscreens.py` (stale
  generator, content already applied), `lib/rebuild-scripture-net.mjs` (obsolete),
  `assets/data/screens.json.zip`, `dist/` (already removed), and the three
  AI-generated docs (`IMPLEMENTATION_SUMMARY.md`, `BOOKMARKS_AND_PROGRESS.md`,
  `SHARING.md`) which describe features we're dropping or reimplementing.
- **Wesley's `translations.json` + `scripture.json` edits**: superseded by main's
  per-API data layout.

## Part 2 — Implementation plan

Work on a new branch off `main` (suggested: `port-wesley-updates`).

### Phase 0 — Safety net (content preservation)

1. Commit the semantic-diff tooling as `scripts/` (or keep in the plan session):
   a script that compares two screens.json files keyed by screen path,
   key-order-insensitive, reporting added/removed/changed screens.
2. Add a durable Jest test, `__tests__/screens-data-test.ts`, validating
   `screens.json`: every `navigate.to` resolves to a real screen path, every
   content `type` is registered, and every `ScriptureSlide`/`ScrRangeDisplay`
   reference exists in the bundled NET cache. This guards the port and future
   content edits (Wesley's own chat asked for exactly this kind of check).

### Phase 1 — Content port (screens.json)

1. Take Wesley's `screens.json` verbatim as the content source.
2. Reconcile the intended deltas vs his file:
   - `version`: keep main's current `2.2.2` (bump happens at release prep,
     per README convention — see Phase 7).
   - About/Credits attribution: use **main's** NET + helloao wording (license text).
   - Keep his About additions (Dark Mode slide, Reset Progress slide).
   - **Hierarchy normalization** (catalog A.9): move Basics/Resources/About up
     to Home; retarget Home's navigate actions.
3. Format with Prettier to match main's JSON style.
4. **Verify**: `scripts/compare-screens.mjs` ported file vs `wesley-updates`
   file — must show zero differences besides the deltas above — and
   `scripts/check-screens.mjs` must pass.

### Phase 2 — Scripture cache

1. Regenerate `assets/data/bible.helloao.org/scripture.json` to cover all 92
   references (use the app's built-in dev-web fetch flow, or a small script
   against the helloao API following `BibleHelloAOApiService`'s mapping).
2. The screens-data test from Phase 0 verifies coverage.

### Phase 3 — Small schema/component features (TDD where practical)

Each is an independent, small PR-able change matching main's patterns:

1. `ScriptureSlide.answerInSlide` (on main's restructured ScriptureSlide).
2. `Text.segments` — implemented through the existing font-resolution path.
3. `ScheduleTable` content component (theme colors, app `Text`), registered in
   `Contents.ts`.
4. ToggleButton tap-hint behavior (clean implementation).
5. BasicButton platform shadows.
6. `QuestionPrompt` non-interactive content type (catalog A.10) + mechanical
   conversion of the 44 trivial ToggleButtons and 6 action-less BasicButtons
   (scripted transform, reviewed via semantic diff).

### Phase 4 — Dark mode (done properly)

1. `dark` palette in `colors.json` (Wesley's colors as-is).
2. `ThemeService` (StorageService persistence) + `ThemeContext` with OS fallback.
3. Make theme consumption dynamic across components currently importing the
   static `theme` (mechanical but broad; keep `Theme.ts` as single source).
4. `DarkModeToggle` content component (theme-driven colors, no hardcoded hex).

### Phase 5 — Progress tracking (consolidated)

1. One persisted `ProgressService` (visited timestamps/counts, completion %).
2. One context; graying, ✓/% badges, and `resetVisited` all read/clear the same
   store (reset actually resets everything — fixes his half-working reset).
3. No ActionFactory global callbacks — wire through context/hooks.
4. Keep his visual language: gray visited buttons, green ✓/% badges, top-level
   nav buttons exempt (data-driven exemption, not hardcoded label list).

### Phase 6 — Navigation aids

1. `NavigationService` with a single sibling-lookup helper (+ unit tests).
2. Next/Previous buttons rendered by `ContentListScreen`/`HeaderWithButtons`,
   with exclusions expressed in `screens.json` (flag on the screens Wesley's
   hardcoded list excluded), not hardcoded paths.
3. Breadcrumb derived from the screen tree — no hardcoded title lists. Preserve
   his UX: skip redundant `Start Here` crumb for sections Home links to directly.

### Phase 7 — Cleanup & finish

1. Confirm none of the dropped files/deps exist on the new branch
   (`expo-sharing`, settings.json, example files, root-level docs, .py/.mjs tools).
2. `app.json`: keep main's; do NOT port scheme/linking (dead sharing infra).
3. Run full verification: Jest suite, semantic content diff, `npm run web` smoke
   test of every new section (Resources screens, dark mode, prev/next, breadcrumb,
   reset progress), cross-check a few tap-to-reveal prompts against
   `wesley-chat-history.md` wording.
4. Version bump + CHANGELOG-style PR description mapping each of Wesley's intents
   to its implementation.

### Verification gates (every phase)

- Screens-data Jest test green.
- Semantic content diff clean (Phase 1 onward).
- App boots on web with no console errors.

## Decisions (TJ, 2026-07-16)

1. **Bookmarks & sharing**: drop entirely.
2. **Dark mode**: full consistent theming, not the partial version.
3. **Version number**: bump at release prep per README convention (suggest
   2.3.0); port stays version-neutral at 2.2.2.
4. **`Home/How to` section**: removed with no direct replacement (`Why use TD`
   covers purpose/structure but not the 1-2-3 usage instructions) — flagged in
   the content report for Wesley to decide.
5. **Tooling kept in-repo**: `scripts/compare-screens.mjs` (semantic diff) and
   `scripts/check-screens.mjs` (hierarchy/flow checks); usage documented in the
   scripts and `CLAUDE.md`. The check rules also become part of the Jest
   screens-data test in Phase 0.
6. **Shared content components** (`ScriptureQuestionList`, next-steps sugar,
   optional Q/A reveal sugar): implement AFTER the port completes, as a
   separate phase with a mechanical transform + semantic-diff verification.
7. **Hierarchy artifact + mis-fitting prompts**: fix during the port (catalog
   A.9, A.10) — not reported to Wesley as content changes, except a note that
   reflection questions become non-tappable styled text.

## Remaining open items

- Wesley's answers to the content report (`docs/2026-07-16-content-review-for-wesley.md`),
  especially the `How to` section and confirmation of the big deletions.
