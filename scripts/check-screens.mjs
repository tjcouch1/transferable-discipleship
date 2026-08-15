// Structural sanity checks for assets/data/screens.json.
//
// Catches hierarchy/flow mistakes that are easy to introduce when content is
// edited by tools or AI sessions:
//   1. navigate actions whose target screen doesn't exist
//   2. subscreens that their own parent never links to (suspicious nesting —
//      a screen should normally be a child of the screen that navigates to it)
//   3. cross-links: navigate actions targeting a screen that is not a direct
//      child of the navigating screen (sometimes legitimate, always worth eyes)
//
// Usage:
//   node scripts/check-screens.mjs [path-to-screens.json]   (defaults to assets/data/screens.json)
// Exits 1 if checks 1 or 2 find problems (cross-links are informational only),
// so it can run in CI. See also __tests__/ for the Jest version of these rules.

import fs from 'node:fs';

const file = process.argv[2] ?? 'assets/data/screens.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

// Screens added programmatically by ScreenService, not present in the JSON
const KNOWN_EXTERNAL_TARGETS = new Set(['app:/__licenses']);

const screens = {};
(function walk(list, prefix) {
  (list ?? []).forEach(screen => {
    const path = prefix ? `${prefix}/${screen.id}` : screen.id;
    screens[path] = screen;
    walk(screen.subscreens, path);
  });
})(data.screens, '');

// Every navigate action: where it lives and what it points at
const links = [];
for (const [path, screen] of Object.entries(screens)) {
  (function walkContents(value) {
    if (Array.isArray(value)) return value.forEach(walkContents);
    if (value && typeof value === 'object') {
      if (value.action?.type === 'navigate' && value.action.to)
        links.push({ from: path, to: value.action.to, label: value.text });
      Object.entries(value).forEach(([key, v]) => key !== 'subscreens' && walkContents(v));
    }
  })(screen.contents);
}

// Resolve a target the way the app does (relative to the current screen),
// with a fallback for root-relative targets used on the Home screen.
function resolve(from, to) {
  if (screens[`${from}/${to}`]) return `${from}/${to}`;
  if (screens[to]) return to;
  if (screens[`Home/${to}`]) return `Home/${to}`;
  return undefined;
}

let failures = 0;

console.log(`Checking ${file} (${Object.keys(screens).length} screens, ${links.length} navigate links)`);

console.log('\n-- Unresolved navigate targets --');
links.forEach(link => {
  link.resolved = resolve(link.from, link.to);
  if (!link.resolved && !KNOWN_EXTERNAL_TARGETS.has(link.to)) {
    console.log(`  FAIL ${link.from} --[${link.label}]--> ${link.to}`);
    failures += 1;
  }
});

console.log('\n-- Subscreens not linked from their own parent --');
for (const [path, screen] of Object.entries(screens)) {
  (screen.subscreens ?? []).forEach(child => {
    const childPath = `${path}/${child.id}`;
    if (links.some(link => link.from === path && link.resolved === childPath)) return;
    const linkedFrom = links.filter(link => link.resolved === childPath).map(link => link.from);
    console.log(`  FAIL ${childPath}`);
    console.log(`       linked from: ${linkedFrom.length ? linkedFrom.join(', ') : 'NOWHERE (unreachable)'}`);
    failures += 1;
  });
}

console.log('\n-- Cross-links (informational) --');
links.forEach(link => {
  if (!link.resolved) return;
  const isDirectChild =
    link.resolved.startsWith(`${link.from}/`) &&
    link.resolved.split('/').length === link.from.split('/').length + 1;
  if (!isDirectChild) console.log(`  note ${link.from} --[${link.label}]--> ${link.resolved}`);
});

if (failures) {
  console.error(`\n${failures} problem(s) found`);
  process.exit(1);
}
console.log('\nAll checks passed');
