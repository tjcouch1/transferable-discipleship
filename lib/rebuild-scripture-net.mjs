/**
 * Rebuild assets/data/scripture.json with NET verses from labs.bible.org.
 * Run: node lib/rebuild-scripture-net.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const scripturePath = path.join(root, 'assets/data/scripture.json');
const screensPath = path.join(root, 'assets/data/screens.json');
const translationsPath = path.join(
  root,
  'assets/data/bible-api.com/translations.json',
);

const bibleOrgUrl = 'https://labs.bible.org/api/';

const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
const netInfo = translations.find((t) => t.shortName === 'NET');
if (!netInfo) throw new Error('NET not in translations.json');

/** Turn a stored reference into a passage string the Bible.org API returns reliably. */
function referenceToApiPassage(ref) {
  const m = ref.match(/^(.+?)\s+(\d+):(.+)$/s);
  if (!m) return ref;
  const book = m[1];
  const chapter = m[2];
  const rest = m[3];
  const parts = rest.split(',').map((p) => p.trim());
  const passages = [];
  for (const part of parts) {
    if (/^\d+:/.test(part)) {
      passages.push(`${book} ${part}`);
    } else {
      passages.push(`${book} ${chapter}:${part}`);
    }
  }
  return passages.join(';');
}

async function fetchNetVerses(apiPassage) {
  const url = `${bibleOrgUrl}?passage=${encodeURIComponent(apiPassage)}&formatting=plain&type=json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${res.status} ${await res.text()} for ${apiPassage}`);
  }
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(`Empty or invalid response for ${apiPassage}`);
  }
  return { url, rows: data };
}

function rowsToVerses(rows, reference) {
  return rows.map((v) => ({
    verse: parseInt(v.verse, 10),
    text: `${v.text.trim()}\n`,
  }));
}

function collectReferences() {
  const set = new Set();
  const current = JSON.parse(fs.readFileSync(scripturePath, 'utf8'));
  if (current.web?.verses) {
    for (const k of Object.keys(current.web.verses)) set.add(k);
  }
  const screensRaw = fs.readFileSync(screensPath, 'utf8');
  for (const m of screensRaw.matchAll(/"reference":\s*"([^"]+)"/g)) {
    set.add(m[1]);
  }
  return [...set].sort();
}

async function main() {
  const refs = collectReferences();
  const verses = {};
  let i = 0;
  for (const reference of refs) {
    i += 1;
    const apiPassage = referenceToApiPassage(reference);
    process.stderr.write(`[${i}/${refs.length}] ${reference}\n`);
    const { url, rows } = await fetchNetVerses(apiPassage);
    verses[reference] = {
      resourceInfo: { ...netInfo },
      reference,
      verses: rowsToVerses(rows, reference),
      sourceUrl: url,
    };
    await new Promise((r) => setTimeout(r, 120));
  }

  const out = {
    net: {
      ...netInfo,
      sourceUrl: bibleOrgUrl,
      verses,
    },
  };

  fs.writeFileSync(scripturePath, `${JSON.stringify(out, null, 2)}\n`);
  process.stderr.write(`Wrote ${path.relative(root, scripturePath)}\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
