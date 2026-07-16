# CLAUDE.md

Transferable Discipleship — an Expo/React Native app (web + iOS + Android) for
Christian discipleship content. Almost everything user-visible is data-driven
from `assets/data/screens.json`.

## Architecture in one minute

- `assets/data/screens.json` — the whole content tree: nested screens, each with
  `contents` (typed content objects) and optional `subscreens`. `ScreenService`
  deserializes it; navigation paths are the ID path (`Home/Basics/Prayer`).
- Content components live in `src/components/contents/` and register in
  `Contents.ts` (add the data type to the `ContentData` union + the component to
  the `Contents` map). Screens register the same way in
  `src/components/screens/Screens.tsx`. The JSON `type` field selects the component.
- Actions on buttons (`navigate`, `link`, …) are created in `src/util/ActionFactory.ts`.
- Scripture: `src/services/ScriptureService.ts` is a façade over
  `src/services/scripture-apis/` (interface + base class + one service per API,
  each with a bundled cache in `assets/data/<api-host>/scripture.json`).
  Default translation is NET. Verses are fetched from the network only in web
  dev (`SHOULD_FETCH`); production reads the bundled cache.
- Persistence: `src/services/StorageService.ts` (`saveData`/`loadData`;
  localStorage on web, `expo-file-system/legacy` on native).

## Commands

- `npm start` / `npm run web` — dev server (web bundling needs
  `NODE_OPTIONS=--openssl-legacy-provider`, already in the scripts)
- `npm test` — Jest (default config; tests in `__tests__/`)
- `npm run licenses` — regenerate license attribution data
- Version bumping: done right before a release, not during development. Four
  spots (package.json via `npm version`, two semver + android code in app.json,
  one in screens.json). See README "Bump versions".
- Scripture cache update: run web dev, let it fetch, copy the `scriptureCache.*`
  localStorage value into `assets/data/<server-name>/scripture.json`. See README.

## Working with screens.json

`git diff` on screens.json is often useless: external tools/AI sessions
re-serialize the file and reorder keys, producing huge diffs with little real
change. Use the scripts:

- `node scripts/compare-screens.mjs <old.json> <new.json>` — semantic diff
  (key-order-insensitive, keyed by screen path, detects moves). Use to review
  content drops from non-developers and to verify ports preserved content.
  Get old versions with `git show <ref>:assets/data/screens.json > /tmp/old.json`.
- `node scripts/check-screens.mjs [screens.json]` — structural checks: navigate
  targets resolve; every subscreen is linked from its own parent (a screen
  belongs under the screen that navigates to it). Exits nonzero on failure.

Content conventions (learned from the pre-2.3 content; keep them):

- Reader-reflection/discussion questions are NON-interactive text (slide
  headers or plain strings) — never buttons. `ToggleButton` is only for genuine
  reveals where the alternate text differs (e.g. "Tap to reveal answer" → the
  answer). Watch for AI-authored content misusing buttons as prompts.
- `ScriptureSlide` combines reference + passage + optional hidden/revealed
  answer buttons; prefer it over hand-assembled scripture blocks.

## History notes

- 2026-07: Wesley (product director, non-developer) delivered a large
  AI-authored content overhaul on branch `wesley-updates`; it is being
  reimplemented cleanly on main. Catalog/plan:
  `docs/superpowers/specs/2026-07-16-wesley-updates-port-design.md`.
- `dist/` is Expo build output — never commit it (gitignored).
