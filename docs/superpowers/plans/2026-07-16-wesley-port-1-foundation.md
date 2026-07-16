# Wesley Port Plan 1: Foundation (content + data + schema features)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port all of Wesley's screens.json content onto main with the schema features it needs, verified content-preserving by semantic diff.

**Architecture:** New branch `port-wesley-updates` off `main` in an isolated worktree. Small content components/props are added first (QuestionPrompt, answerInSlide, Text segments, ToggleButton hints, shadows, ScheduleTable), the helloao NET scripture cache is extended to cover Wesley's 92 references, then a one-off transform script produces the ported screens.json from Wesley's file with exactly six known deltas (version, NET attribution, hierarchy fix, QuestionPrompt conversion, Dark Mode slide deferred to Plan 2, Reset Progress slide deferred to Plan 3). A Jest data test locks in structural invariants.

**Tech Stack:** Expo 54 / React Native 0.81, TypeScript, Jest (default config), Node ≥ 20 for scripts.

**Context:** Spec at `docs/superpowers/specs/2026-07-16-wesley-updates-port-design.md`. Wesley's content: `git show wesley-updates:assets/data/screens.json`. Plans 2 (dark mode) and 3 (progress + navigation aids + release) follow.

**Conventions:** Prettier: single quotes, trailing commas, arrow parens avoided (`.prettierrc.js`). New files carry the GPL header used by existing files. Every commit message ends with the Claude Co-Authored-By line.

---

### Task 1: Worktree, branch, tooling carry-over, baseline

**Files:** none created in-repo (worktree setup)

- [ ] **Step 1:** Create isolated worktree on new branch `port-wesley-updates` based on `main` (EnterWorktree tool, or `git worktree add ../td-port -b port-wesley-updates main`).
- [ ] **Step 2:** Cherry-pick the tooling/docs commit from wesley-updates: `git cherry-pick f4cd332` (adds `scripts/compare-screens.mjs`, `scripts/check-screens.mjs`, `CLAUDE.md`, spec, Wesley report, plans dir). All-new files; no conflicts expected.
- [ ] **Step 3:** `npm install` (runs patch-package postinstall). Expected: success with warnings OK.
- [ ] **Step 4:** Baseline: `npx jest` — record which of the 2 existing suites pass. Wesley's notes claim a pre-existing "Jest test configuration issue"; if `App-test.tsx` fails at baseline, note it and treat data/pure-function tests as the regression gate for this plan (component render tests below become best-effort).
- [ ] **Step 5:** Baseline structural checks pass on main's content: `node scripts/check-screens.mjs` → "All checks passed".

### Task 2: screens.json data invariants test

**Files:**
- Test: `__tests__/screens-data-test.ts`

- [ ] **Step 1: Write the test** (pure JSON — no React Native imports; mirrors `scripts/check-screens.mjs` rules plus type registration and scripture-cache coverage):

```ts
import screensData from '../assets/data/screens.json';
import helloaoCache from '../assets/data/bible.helloao.org/scripture.json';

// Content/screen types registered in Contents.ts / Screens.tsx. Keep in sync
// when registering new types (cheap to maintain; avoids importing RN in tests).
const REGISTERED_CONTENT_TYPES = new Set([
  'ActionButton', 'BasicButton', 'ToggleButton', 'Text', 'HeaderText',
  'SubheaderText', 'ButtonList', 'Header', 'Slide', 'ContentList',
  'ScriptureSlide', 'ScrRangeDisplay', 'Image',
]);
const REGISTERED_SCREEN_TYPES = new Set(['ContentListScreen', 'HeaderWithButtons']);
const KNOWN_EXTERNAL_TARGETS = new Set(['app:/__licenses']);

type Screen = { id: string; type: string; contents?: unknown[]; subscreens?: Screen[] };

const screensByPath: Record<string, Screen> = {};
(function walk(list: Screen[] | undefined, prefix: string) {
  (list ?? []).forEach(screen => {
    const path = prefix ? `${prefix}/${screen.id}` : screen.id;
    screensByPath[path] = screen;
    walk(screen.subscreens, path);
  });
})((screensData as { screens: Screen[] }).screens, '');

type Link = { from: string; to: string; resolved?: string };
const links: Link[] = [];
const contentTypes = new Set<string>();
const scriptureReferences = new Set<string>();
for (const [path, screen] of Object.entries(screensByPath)) {
  (function walkContents(value: any) {
    if (Array.isArray(value)) return value.forEach(walkContents);
    if (value && typeof value === 'object') {
      if (typeof value.type === 'string' && !String(value.type).endsWith('Screen'))
        contentTypes.add(value.type);
      if (value.action?.type === 'navigate' && value.action.to)
        links.push({ from: path, to: value.action.to });
      if (typeof value.reference === 'string') scriptureReferences.add(value.reference);
      Object.entries(value).forEach(([key, v]) => key !== 'subscreens' && walkContents(v));
    }
  })(screen.contents);
}

function resolve(from: string, to: string): string | undefined {
  if (screensByPath[`${from}/${to}`]) return `${from}/${to}`;
  if (screensByPath[to]) return to;
  if (screensByPath[`Home/${to}`]) return `Home/${to}`;
  return undefined;
}
links.forEach(link => { link.resolved = resolve(link.from, link.to); });

describe('screens.json data invariants', () => {
  it('screen types are registered', () => {
    Object.values(screensByPath).forEach(screen =>
      expect(REGISTERED_SCREEN_TYPES).toContain(screen.type));
  });

  it('content types are registered', () => {
    contentTypes.forEach(type => expect(REGISTERED_CONTENT_TYPES).toContain(type));
  });

  it('navigate targets resolve to real screens', () => {
    const unresolved = links
      .filter(link => !link.resolved && !KNOWN_EXTERNAL_TARGETS.has(link.to))
      .map(link => `${link.from} -> ${link.to}`);
    expect(unresolved).toEqual([]);
  });

  it('every subscreen is linked from its own parent', () => {
    const problems: string[] = [];
    for (const [path, screen] of Object.entries(screensByPath)) {
      (screen.subscreens ?? []).forEach(child => {
        const childPath = `${path}/${child.id}`;
        if (!links.some(link => link.from === path && link.resolved === childPath))
          problems.push(childPath);
      });
    }
    expect(problems).toEqual([]);
  });

  it('every scripture reference is in the bundled NET cache', () => {
    // Reference parsing mirrors ScriptureApiServiceBase: "Book C:V" or "Book C:V-V2"
    const verses = (helloaoCache as any).NET.verses;
    const missing: string[] = [];
    scriptureReferences.forEach(reference => {
      if (!referenceIsCached(reference, verses)) missing.push(reference);
    });
    expect(missing).toEqual([]);
  });
});
```

`referenceIsCached` (same file): parse `reference` with the book-name table from
`src/util/ScriptureUtils.ts` (import is safe — it only uses `@sillsdev/scripture`,
no React Native): use `englishNameToBookId(bookName)` where bookName is
`reference` up to the last space, and chapter/verse from the rest; for a range
`V1-V2` (hyphen or en dash) require every verse in `verses[bookId][chapter]`;
handle comma-separated parts by checking each part with the chapter carried over.

```ts
import { englishNameToBookId } from '../src/util/ScriptureUtils';

function referenceIsCached(reference: string, verses: any): boolean {
  const match = reference.match(/^(.+?) (\d+):(.+)$/);
  if (!match) return false;
  const [, bookName, chapter, versePart] = match;
  const bookId = englishNameToBookId(bookName);
  const chapterVerses = verses?.[bookId]?.[chapter];
  if (!chapterVerses) return false;
  return versePart.split(',').every(range => {
    const [start, end] = range.trim().split(/[-–]/).map(v => parseInt(v, 10));
    for (let v = start; v <= (end ?? start); v++) if (!chapterVerses[v]) return false;
    return true;
  });
}
```

- [ ] **Step 2:** `npx jest screens-data` → expect PASS against main's current content (if a main reference is missing from the cache, investigate — the app on main works, so the parse rules in the test likely need adjusting to match, e.g. Psalm/Psalms).
- [ ] **Step 3:** Commit: `test: add screens.json data invariant tests`.

### Task 3: Extend helloao NET scripture cache to Wesley's references

**Files:**
- Create: `scripts/fetch-helloao-cache.mjs`
- Modify: `assets/data/bible.helloao.org/scripture.json`

- [ ] **Step 1:** Write `scripts/fetch-helloao-cache.mjs` (committed — it's the repeatable, README-friendlier alternative to the manual localStorage flow for *adding* references):
  - Input: a screens.json path (arg 1, default `assets/data/screens.json`).
  - Collect all `reference` strings (same walk as the Jest test).
  - Parse book/chapter with a book-name→USFM-id table (copy the name list from `src/util/ScriptureUtils.ts` `allBookEnglishNames` plus the standard 66 USFM ids `GEN…REV`; alias `Psalm`→`PSA`).
  - For each unique `(bookId, chapter)` missing from `assets/data/bible.helloao.org/scripture.json` under `NET.verses[bookId][chapter]`, fetch `https://bible.helloao.org/api/eng_net/${bookId}/${chapter}.json`, map exactly like `BibleHelloAOApiService.mapChapterToVerseContentByVerseRef`: for content items with `type === 'verse'`, store `verses[bookId][chapter][number] = { verse: number, text: content.filter(l => typeof l === 'string' || 'text' in l).map(l => typeof l === 'string' ? l : l.text).join(' ') }`.
  - Append the chapter URL to `NET.urls` if absent; write the file back pretty-printed with 2-space indent (matching the existing file); log fetched/skipped counts. Sequential fetches with a 200 ms delay (politeness; helloao has no rate limit).
- [ ] **Step 2:** Run against Wesley's content: `git show wesley-updates:assets/data/screens.json > "$SCRATCH/screens.wes.json" && node scripts/fetch-helloao-cache.mjs "$SCRATCH/screens.wes.json"`. Expected: fetches the chapters for Wesley's 92 refs not already cached; file grows; JSON valid. If network is blocked in this environment, STOP and ask TJ to run the command (or the README dev-server flow) — do not fake cache data.
- [ ] **Step 3:** `npx jest screens-data` still passes (main's refs unaffected). Sanity-check one new entry (e.g. John 16:8) exists in the file.
- [ ] **Step 4:** Commit: `feat: add scripted helloao cache fetcher; extend NET cache for new content`.

### Task 4: QuestionPrompt content component

**Files:**
- Create: `src/components/contents/QuestionPrompt.tsx`
- Modify: `src/components/contents/Contents.ts` (union + map)
- Test: `__tests__/QuestionPrompt-test.tsx`

- [ ] **Step 1: Write the failing test** (skip render assertions if Task 1 found the renderer baseline broken; keep the registration assertion either way):

```tsx
import React from 'react';
import renderer from 'react-test-renderer';
import { QuestionPrompt } from '../src/components/contents/QuestionPrompt';
import { Contents } from '../src/components/contents/Contents';

it('is registered as a content type', () => {
  expect(Contents.QuestionPrompt).toBe(QuestionPrompt);
});

it('renders its text without any touchable', () => {
  const tree = renderer.create(<QuestionPrompt type="QuestionPrompt" text="Which of these?" />).toJSON();
  expect(JSON.stringify(tree)).toContain('Which of these?');
  expect(JSON.stringify(tree)).not.toContain('Touchable');
});
```

- [ ] **Step 2:** `npx jest QuestionPrompt` → FAIL (module not found).
- [ ] **Step 3: Implement.** Non-interactive emphasized box matching the `answer` BasicButton look (colors from the static `theme` for now; Plan 2 makes theming dynamic app-wide):

```tsx
import React from 'react';
import { View } from 'react-native';
import theme from '../../Theme';
import { ContentDataBase } from './Contents';
import { Text, TextData, getTextDataObject } from './Text';

/**
 * A reader prompt / discussion question displayed in the emphasized "answer"
 * style WITHOUT button semantics. Use this instead of a button when there is
 * nothing to tap (see CLAUDE.md content conventions).
 */
export type QuestionPromptContentData = ContentDataBase & {
  type: 'QuestionPrompt';
  text: TextData;
};

export const QuestionPrompt = ({ text }: Omit<QuestionPromptContentData, 'type'>) => {
  const textObject = getTextDataObject(text);
  return (
    <View
      style={{
        backgroundColor: theme.button.backgroundAnswer,
        padding: 10,
        borderRadius: 6,
        width: 'auto',
      }}>
      <Text
        {...textObject}
        style={[{ color: theme.button.textAnswer, fontSize: 17, textAlign: 'center' }, textObject.style]}
      />
    </View>
  );
};
```

  In `Contents.ts`: import, add `QuestionPromptContentData` to the `ContentData` union, add `QuestionPrompt` to the `Contents` map, and add `'QuestionPrompt'` to `REGISTERED_CONTENT_TYPES` in `__tests__/screens-data-test.ts`.
- [ ] **Step 4:** `npx jest QuestionPrompt screens-data` → PASS.
- [ ] **Step 5:** Commit: `feat: add QuestionPrompt non-interactive content type`.

### Task 5: ScriptureSlide `answerInSlide`

**Files:**
- Modify: `src/components/contents/ScriptureSlide.tsx`

- [ ] **Step 1:** Extend `SlideScripture` and render an inline QuestionPrompt after the passage (before the toggle button block). In `ScriptureSlide.tsx`:

```ts
type SlideScripture = Omit<ScrRangeDisplayContentData, 'type'> & {
  hiddenButton?: Omit<ButtonDataBase, 'type'>;
  revealedButton?: Omit<ButtonDataBase, 'type'>;
  /** Answer text shown inline in the slide (emphasized, not interactive, no tap-to-reveal) */
  answerInSlide?: string;
};
```

  In the `scriptures.forEach` body, destructure `answerInSlide` alongside the other props, and after `contents.push(scrRangeDisplayContent);` add:

```ts
    if (answerInSlide)
      contents.push({
        type: 'QuestionPrompt',
        text: answerInSlide,
      });
```

- [ ] **Step 2:** TypeScript check: `npx tsc --noEmit` → no new errors (repo may have pre-existing ones; compare to baseline).
- [ ] **Step 3:** Commit: `feat: support answerInSlide on ScriptureSlide scriptures`.

### Task 6: Text segments (through font resolution)

**Files:**
- Modify: `src/components/contents/Text.tsx`
- Test: `__tests__/Text-segments-test.tsx`

- [ ] **Step 1: Failing test:**

```tsx
import React from 'react';
import renderer from 'react-test-renderer';
import { Text } from '../src/components/contents/Text';

it('renders segments as one flowing paragraph with per-span styles', () => {
  const tree = renderer.create(
    <Text
      type="Text"
      text=""
      segments={[
        { text: 'God cares ' },
        { text: 'that', style: { fontStyle: 'italic' } },
        { text: ' you talk with Him' },
      ]}
    />,
  ).toJSON();
  const json = JSON.stringify(tree);
  expect(json).toContain('that');
  expect(json).toContain('italic');
});
```

- [ ] **Step 2:** Run → FAIL (`segments` prop rejected / not rendered).
- [ ] **Step 3: Implement.** Add to `TextContentDataObject`:

```ts
/** Inline span of a segmented paragraph */
export type TextSegment = { text: string; style?: StyleProp<TextStyle> };
// on TextContentDataObject:
  /** When set, render one flowing paragraph of styled spans (set text: '' and use segments) */
  segments?: TextSegment[];
```

  In the `Text` component, when `segments` is non-empty, render the outer element via the normal path and each segment as a nested app `Text` so each span goes through the existing iOS bold/italic font-family resolution (unlike Wesley's version, which bypassed it):

```tsx
  const segments = (props as TextContentDataObject).segments;
  if (segments && segments.length > 0) {
    const { design = 'normal', style, onPress } = { ...DEFAULT_PROPS, ...getTextDataObject(props) } as any;
    const designStyle = designStyles[design];
    return (
      <ReactText onPress={onPress} style={[designStyle.lineText, style]}>
        {segments.map((segment, i) => (
          <Text key={i} type="Text" design={design} text={segment.text} style={[style, segment.style]} />
        ))}
      </ReactText>
    );
  }
```

  (Recursion terminates: segments are plain text objects without `segments`.)
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit: `feat: support inline styled segments in Text`.

### Task 7: ToggleButton tap hints + BasicButton shadows

**Files:**
- Modify: `src/components/contents/buttons/ToggleButton.tsx`, `src/components/contents/buttons/BasicButton.tsx`
- Test: `__tests__/ToggleButton-hints-test.ts`

- [ ] **Step 1: Failing test** for the pure hint helper:

```ts
import { applyToggleHint } from '../src/components/contents/buttons/ToggleButton';

describe('applyToggleHint', () => {
  it('appends the reveal hint when a collapsed label lacks tap wording', () =>
    expect(applyToggleHint('What does this teach?', false)).toBe('What does this teach? (Tap to reveal)'));
  it('leaves labels that already mention tap/reveal alone', () => {
    expect(applyToggleHint('Why pray? (tap to reveal)', false)).toBe('Why pray? (tap to reveal)');
    expect(applyToggleHint('Tap to reveal answer', false)).toBe('Tap to reveal answer');
  });
  it('appends the go-back hint to revealed text', () =>
    expect(applyToggleHint('The Spirit convicts us of sin.', true)).toBe('The Spirit convicts us of sin. (tap to go back)'));
  it('does not double-append the go-back hint', () =>
    expect(applyToggleHint('Done (tap to go back)', true)).toBe('Done (tap to go back)'));
});
```

- [ ] **Step 2:** Run → FAIL (no export).
- [ ] **Step 3: Implement** in `ToggleButton.tsx` (replacing Wesley's inline version; no `revealedInitially` — it was never used):

```ts
/** Append the standard tap hint to a toggle label unless it already has one */
export function applyToggleHint(text: string, isRevealed: boolean): string {
  if (isRevealed)
    return /tap to go back/i.test(text) ? text : `${text} (tap to go back)`;
  return /tap|reveal/i.test(text) ? text : `${text} (Tap to reveal)`;
}
```

  In the component, before rendering `BasicButton`, when `altButtons.length > 0`:

```ts
  const displayProps = buttonIndex === 0 ? buttonDataProps : altButtons[buttonIndex - 1];
  let { text } = displayProps;
  if (altButtons.length > 0) {
    const textObject = getTextDataObject(text ?? '');
    text = { ...textObject, text: applyToggleHint(textObject.text, buttonIndex > 0) };
  }
  return <BasicButton {...displayProps} text={text} onPress={onPress} />;
```

  (`getTextDataObject` imported from `../Text`.)
  In `BasicButton.tsx`, add Wesley's platform shadows verbatim to both `navButton` design styles (`Platform.select` blocks with iOS shadow*, android `elevation: 4`/`3`, web `boxShadow`), importing `Platform` from react-native — take the exact values from `git show wesley-updates:src/components/contents/buttons/BasicButton.tsx`.
- [ ] **Step 4:** `npx jest ToggleButton` → PASS.
- [ ] **Step 5:** Commit: `feat: standard tap hints on ToggleButton; platform shadows on buttons`.

### Task 8: ScheduleTable

**Files:**
- Create: `src/components/contents/ScheduleTable.tsx` (from `git show wesley-updates:src/components/contents/ScheduleTable.tsx`)
- Modify: `src/components/contents/Contents.ts`, `__tests__/screens-data-test.ts` (add type)

- [ ] **Step 1:** Port Wesley's component with these changes:
  - Drop `useTheme`/`ThemeContext` (Plan 2): `import theme from '../../Theme';`, border color `theme.header.bottom` (existing divider color) instead of hardcoded `#1a1a1a`/`#8a8a8a`, `cellBg = theme.slide.background`, `textColor` from `theme.text.lineText`.
  - `ScheduleTableContentData` extends `ContentDataBase` (`type: 'ScheduleTable'`), remove unused `PropsWithNavigation` wrapper.
  - Keep the week-column RNText (`numberOfLines={1}`, `adjustsFontSizeToFit`) — it's a deliberate fit fix.
- [ ] **Step 2:** Register in `Contents.ts` (union + map) and add `'ScheduleTable'` to the test's `REGISTERED_CONTENT_TYPES`.
- [ ] **Step 3:** `npx tsc --noEmit` clean vs baseline; `npx jest screens-data` PASS.
- [ ] **Step 4:** Commit: `feat: add ScheduleTable content type`.

### Task 9: Port screens.json (transform + verify)

**Files:**
- Modify: `assets/data/screens.json`
- Scratch (not committed): `$SCRATCH/port-screens.mjs`

- [ ] **Step 1:** Write the transform script. Inputs: Wesley's file (`git show wesley-updates:assets/data/screens.json`), main's current file (for attribution text). Rules, each logging a count:
  1. `version` → `"2.2.2"` (main's).
  2. Hierarchy: remove `Basics`, `Resources`, `About` from `Start Here`'s `subscreens` and insert them (same order) into `Home`'s `subscreens` after `Start Here`; rewrite Home's three navigate actions `"Start Here/Basics"`→`"Basics"`, `"Start Here/Resources"`→`"Resources"`, `"Start Here/About"`→`"About"`. Assert no other `action.to` in the whole file contains `"Start Here/Basics|Resources|About"`.
  3. Attribution: in the `About` screen contents, replace the string starting `"- Disciple-making content"` with main's exact string; replace the whole `Credits` subscreen node with main's `Home/About/Credits` node.
  4. Defer feature slides: remove from `About.contents` the slide whose `headerText` is `"Dark Mode"` (re-added in Plan 2) and the slide/button block for `"Reset Progress"` (re-added in Plan 3). Assert exactly one of each was removed.
  5. QuestionPrompt conversion: every `ToggleButton` whose `altButtons` all have text identical to its own → `{ type: 'QuestionPrompt', text }` (expect 44); every `BasicButton` without an `action` → `{ type: 'QuestionPrompt', text }` (expect 6).
  6. Write result over `assets/data/screens.json`, then `npx prettier --write assets/data/screens.json`.
- [ ] **Step 2: Verify — semantic diff:** `node scripts/compare-screens.mjs "$SCRATCH/screens.wes.json" assets/data/screens.json`. Expected output accounts for EVERY difference: version change; the three moved sections flagged as moves with content identical; Home + Start Here + About contents changes (buttons/slides per rules 2–4); Credits attribution strings; QuestionPrompt conversions inside the 30-odd affected screens. Anything unexplained = STOP and fix.
- [ ] **Step 3: Verify — invariants:** `node scripts/check-screens.mjs` → all pass (hierarchy now clean). `npx jest` → screens-data suite passes (all types registered, all refs cached).
- [ ] **Step 4:** Commit: `feat: port Wesley's content overhaul (screens.json)` with a body summarizing the six deltas.

### Task 10: Smoke test & wrap-up

- [ ] **Step 1:** `npm run web` (background), open the app; verify: Home shows Start Here/Basics/Resources/About; Resources → Sample Schedule renders the grid; a Prayer lesson slide shows italic+underline segment words; a converted reflection question renders as a non-tappable emphasized box; a ScriptureSlide with `answerInSlide` (Summary: Life in the Spirit) shows the inline answer; tap-to-reveal still works on a real Q&A slide; no console errors about screens/content types/scripture cache misses ("Did not find ___ in cache").
- [ ] **Step 2:** Fix anything found (small fixes inline; if structural, add a task).
- [ ] **Step 3:** Update the spec's plan section status; note Plans 2 & 3 remain. Commit any doc updates.
