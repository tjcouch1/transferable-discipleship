// Semantic diff for assets/data/screens.json between two versions.
//
// Why this exists: screens.json is often edited by tools (or AI sessions) that
// re-serialize the whole file and reorder object keys, making `git diff` useless
// for judging what actually changed. This script compares two versions
// *semantically*: screens are keyed by their ID path in the tree (e.g.
// "Home/Basics/Prayer"), object key order is ignored, and each screen is
// compared separately from its subscreens so a moved-but-unchanged screen is
// reported as a pure move rather than a giant delete+add.
//
// When to use:
// - Reviewing a content drop from a non-developer (e.g. a branch of AI edits)
// - Verifying a port/refactor preserved content ("must differ only in X")
// - Any time `git diff assets/data/screens.json` looks suspiciously large
//
// Usage:
//   node scripts/compare-screens.mjs <old-screens.json> <new-screens.json>
// Handy with git:
//   git show main:assets/data/screens.json > /tmp/old.json
//   node scripts/compare-screens.mjs /tmp/old.json assets/data/screens.json
//
// Output sections:
//   TOP-LEVEL     — changes outside the screens tree (version, initialScreen)
//   REMOVED/ADDED — screens by path; added screens whose ID exists among the
//                   removed ones are flagged as moves (identical or changed)
//   CHANGED       — same-path screens whose own content differs, with a
//                   pointer-level diff of what changed
//   CHILD ORDER   — sibling reordering among screens present in both versions

import fs from 'node:fs';

const [, , oldFile, newFile] = process.argv;
if (!oldFile || !newFile) {
  console.error('Usage: node scripts/compare-screens.mjs <old-screens.json> <new-screens.json>');
  process.exit(2);
}
const oldData = JSON.parse(fs.readFileSync(oldFile, 'utf8'));
const newData = JSON.parse(fs.readFileSync(newFile, 'utf8'));

/** Collect screens keyed by ID path, with subscreens stripped from each entry */
function collectScreens(screens, prefix, out, order) {
  (screens ?? []).forEach(screen => {
    const path = prefix ? `${prefix}/${screen.id}` : screen.id;
    const { subscreens, ...own } = screen;
    out[path] = own;
    order.push(path);
    collectScreens(subscreens, path, out, order);
  });
}

/** Recursively sort object keys so serialization is key-order-insensitive */
function normalize(value) {
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map(key => [key, normalize(value[key])]),
    );
  return value;
}
const canon = value => JSON.stringify(normalize(value));

/** Deep diff reporting JSON-pointer-ish paths of changed leaves */
function deepDiff(a, b, path, out) {
  if (canon(a) === canon(b)) return;
  const typeA = Array.isArray(a) ? 'array' : typeof a;
  const typeB = Array.isArray(b) ? 'array' : typeof b;
  if (typeA !== typeB || (typeA !== 'object' && typeA !== 'array')) {
    out.push({ path, a, b });
    return;
  }
  if (typeA === 'array') {
    if (a.length !== b.length) {
      out.push({ path: `${path} [array length ${a.length}->${b.length}]`, a, b });
      return;
    }
    a.forEach((item, i) => deepDiff(item, b[i], `${path}[${i}]`, out));
    return;
  }
  for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (!(key in a)) out.push({ path: `${path}.${key}`, a: undefined, b: b[key] });
    else if (!(key in b)) out.push({ path: `${path}.${key}`, a: a[key], b: undefined });
    else deepDiff(a[key], b[key], `${path}.${key}`, out);
  }
}

const short = value => {
  if (value === undefined) return '(absent)';
  let s = JSON.stringify(value);
  if (s.length > 300) s = `${s.slice(0, 300)}…(${s.length} chars)`;
  return s;
};

const oldScreens = {};
const oldOrder = [];
const newScreens = {};
const newOrder = [];
collectScreens(oldData.screens, '', oldScreens, oldOrder);
collectScreens(newData.screens, '', newScreens, newOrder);

const { screens: _o, ...oldTop } = oldData;
const { screens: _n, ...newTop } = newData;
const topDiffs = [];
deepDiff(oldTop, newTop, '$', topDiffs);
console.log('=== TOP-LEVEL ===');
topDiffs.forEach(d => console.log(`  ${d.path}: ${short(d.a)} -> ${short(d.b)}`));

const oldPaths = new Set(oldOrder);
const newPaths = new Set(newOrder);
const oldById = {};
oldOrder.forEach(path => {
  const id = path.split('/').pop();
  (oldById[id] ??= []).push(path);
});

console.log('\n=== REMOVED SCREENS ===');
oldOrder.filter(path => !newPaths.has(path)).forEach(path => console.log(`  - ${path}`));

console.log('\n=== ADDED SCREENS ===');
newOrder
  .filter(path => !oldPaths.has(path))
  .forEach(path => {
    const id = path.split('/').pop();
    const movedFrom = (oldById[id] ?? []).filter(oldPath => !newPaths.has(oldPath));
    let note = '';
    if (movedFrom.length) {
      const identical = movedFrom.some(oldPath => canon(oldScreens[oldPath]) === canon(newScreens[path]));
      note = ` (id exists in old at ${movedFrom.join(', ')} — ${identical ? 'content IDENTICAL, pure move' : 'content differs'})`;
    }
    console.log(`  + ${path}${note}`);
  });

let unchangedCount = 0;
console.log('\n=== CHANGED SCREENS (same path) ===');
oldOrder.forEach(path => {
  if (!newPaths.has(path)) return;
  if (canon(oldScreens[path]) === canon(newScreens[path])) {
    unchangedCount += 1;
    return;
  }
  const diffs = [];
  deepDiff(oldScreens[path], newScreens[path], '', diffs);
  console.log(`\n--- ${path} (${diffs.length} diffs) ---`);
  diffs.slice(0, 60).forEach(d => console.log(`  ${d.path}: ${short(d.a)} -> ${short(d.b)}`));
  if (diffs.length > 60) console.log(`  ...and ${diffs.length - 60} more`);
});
console.log(`\n(${unchangedCount} same-path screens semantically identical)`);

console.log('\n=== CHILD ORDER CHANGES (among screens present in both) ===');
function childOrder(screens, prefix, out) {
  (screens ?? []).forEach(screen => {
    const path = prefix ? `${prefix}/${screen.id}` : screen.id;
    out[path] = (screen.subscreens ?? []).map(child => child.id);
    childOrder(screen.subscreens, path, out);
  });
}
const oldChildren = { '': oldData.screens.map(s => s.id) };
const newChildren = { '': newData.screens.map(s => s.id) };
childOrder(oldData.screens, '', oldChildren);
childOrder(newData.screens, '', newChildren);
for (const path of Object.keys(oldChildren)) {
  if (!(path in newChildren)) continue;
  const shared = oldChildren[path].filter(id => newChildren[path].includes(id));
  const sharedNew = newChildren[path].filter(id => oldChildren[path].includes(id));
  if (JSON.stringify(shared) !== JSON.stringify(sharedNew))
    console.log(`  ${path || '(root)'}:\n    old: ${shared.join(', ')}\n    new: ${sharedNew.join(', ')}`);
}
