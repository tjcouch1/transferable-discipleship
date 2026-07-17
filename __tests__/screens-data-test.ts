/**
 * Data invariants for assets/data/screens.json.
 *
 * Pure-JSON checks (no React Native imports) that guard content edits:
 * screen/content types are registered, navigation targets resolve, screens are
 * nested under the screen that links to them, and every scripture reference is
 * available in the bundled NET cache. See also scripts/check-screens.mjs for
 * the standalone-script version of the structural rules.
 */

import screensData from '../assets/data/screens.json';
import helloaoCache from '../assets/data/bible.helloao.org/scripture.json';
import { englishNameToBookId } from '../src/util/ScriptureUtils';

// Content/screen types registered in Contents.ts / Screens.tsx. Keep in sync
// when registering new types (kept as a list to avoid importing RN in tests).
const REGISTERED_CONTENT_TYPES = new Set([
  'ActionButton',
  'BasicButton',
  'ToggleButton',
  'Text',
  'HeaderText',
  'SubheaderText',
  'ButtonList',
  'Header',
  'Slide',
  'ContentList',
  'ScriptureSlide',
  'ScrRangeDisplay',
  'Image',
]);
const REGISTERED_SCREEN_TYPES = new Set(['ContentListScreen', 'HeaderWithButtons']);
// Screens added programmatically by ScreenService rather than defined in the JSON
const KNOWN_EXTERNAL_TARGETS = new Set(['app:/__licenses']);

type Screen = {
  id: string;
  type: string;
  contents?: unknown[];
  subscreens?: Screen[];
};

const screensByPath: Record<string, Screen> = {};
(function walk(list: Screen[] | undefined, prefix: string) {
  (list ?? []).forEach(screen => {
    const path = prefix ? `${prefix}/${screen.id}` : screen.id;
    screensByPath[path] = screen;
    walk(screen.subscreens, path);
  });
})((screensData as unknown as { screens: Screen[] }).screens, '');

type Link = { from: string; to: string; resolved?: string };
const links: Link[] = [];
const contentTypes = new Set<string>();
const scriptureReferences = new Set<string>();
for (const [path, screen] of Object.entries(screensByPath)) {
  (function walkContents(value: any) {
    if (Array.isArray(value)) return value.forEach(walkContents);
    if (value && typeof value === 'object') {
      if (typeof value.type === 'string') contentTypes.add(value.type);
      if (value.action?.type === 'navigate' && value.action.to)
        links.push({ from: path, to: value.action.to });
      if (typeof value.reference === 'string') scriptureReferences.add(value.reference);
      // Skip subscreens (walked separately) and action objects (their `type`
      // is an action type like "navigate", not a content type)
      Object.entries(value).forEach(
        ([key, v]) => key !== 'subscreens' && key !== 'action' && walkContents(v),
      );
    }
  })(screen.contents);
}

/** Resolve a navigate target the way the app does (relative to the screen) */
function resolve(from: string, to: string): string | undefined {
  if (screensByPath[`${from}/${to}`]) return `${from}/${to}`;
  if (screensByPath[to]) return to;
  if (screensByPath[`Home/${to}`]) return `Home/${to}`;
  return undefined;
}
links.forEach(link => {
  link.resolved = resolve(link.from, link.to);
});

/** Whether every verse of a reference like "Book C:V1-V2(,V3...)" is cached */
function referenceIsCached(reference: string, verses: any): boolean {
  const match = reference.match(/^(.+?) (\d+):(.+)$/);
  if (!match) return false;
  const [, bookName, chapter, versePart] = match;
  const bookId = englishNameToBookId(bookName);
  const chapterVerses = verses?.[bookId]?.[chapter];
  if (!chapterVerses) return false;
  return versePart.split(',').every(range => {
    const [start, end] = range
      .trim()
      .split(/[-–]/)
      .map(v => parseInt(v, 10));
    for (let verse = start; verse <= (end ?? start); verse++)
      if (!chapterVerses[verse]) return false;
    return true;
  });
}

describe('screens.json data invariants', () => {
  it('screen types are registered', () => {
    Object.entries(screensByPath).forEach(([path, screen]) =>
      expect(`${path}: ${screen.type}`).toBe(
        `${path}: ${REGISTERED_SCREEN_TYPES.has(screen.type) ? screen.type : 'UNREGISTERED'}`,
      ),
    );
  });

  it('content types are registered', () => {
    const unregistered = [...contentTypes].filter(
      type => !REGISTERED_CONTENT_TYPES.has(type),
    );
    expect(unregistered).toEqual([]);
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
    const verses = (helloaoCache as any).NET.verses;
    const missing = [...scriptureReferences].filter(
      reference => !referenceIsCached(reference, verses),
    );
    expect(missing).toEqual([]);
  });
});
