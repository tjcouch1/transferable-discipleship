// Extend the bundled bible.helloao.org NET scripture cache to cover every
// scripture reference used by a screens.json file.
//
// The app only fetches scripture from the network in web dev (see
// ScriptureApiServiceBase SHOULD_FETCH); production reads the bundled cache at
// assets/data/bible.helloao.org/scripture.json. When content adds new
// references, run this script to fetch the missing chapters — a scripted
// alternative to the manual dev-server + localStorage flow in the README.
//
// Usage:
//   node scripts/fetch-helloao-cache.mjs [screens.json path]
// Default screens path: assets/data/screens.json. Useful with another branch's
// content: git show <ref>:assets/data/screens.json > /tmp/s.json && node scripts/fetch-helloao-cache.mjs /tmp/s.json
//
// Verse mapping matches BibleHelloAOApiService.mapChapterToVerseContentByVerseRef.

import fs from 'node:fs';

const CACHE_PATH = 'assets/data/bible.helloao.org/scripture.json';
const API_BASE = 'https://bible.helloao.org/api/';
const TRANSLATION_ID = 'eng_net';
const SHORT_NAME = 'NET';

// Book English names in canon order with USFM ids (see src/util/ScriptureUtils.ts)
const BOOKS = [
  ['Genesis', 'GEN'], ['Exodus', 'EXO'], ['Leviticus', 'LEV'], ['Numbers', 'NUM'],
  ['Deuteronomy', 'DEU'], ['Joshua', 'JOS'], ['Judges', 'JDG'], ['Ruth', 'RUT'],
  ['1 Samuel', '1SA'], ['2 Samuel', '2SA'], ['1 Kings', '1KI'], ['2 Kings', '2KI'],
  ['1 Chronicles', '1CH'], ['2 Chronicles', '2CH'], ['Ezra', 'EZR'], ['Nehemiah', 'NEH'],
  ['Esther', 'EST'], ['Job', 'JOB'], ['Psalms', 'PSA'], ['Proverbs', 'PRO'],
  ['Ecclesiastes', 'ECC'], ['Song of Songs', 'SNG'], ['Isaiah', 'ISA'], ['Jeremiah', 'JER'],
  ['Lamentations', 'LAM'], ['Ezekiel', 'EZK'], ['Daniel', 'DAN'], ['Hosea', 'HOS'],
  ['Joel', 'JOL'], ['Amos', 'AMO'], ['Obadiah', 'OBA'], ['Jonah', 'JON'],
  ['Micah', 'MIC'], ['Nahum', 'NAM'], ['Habakkuk', 'HAB'], ['Zephaniah', 'ZEP'],
  ['Haggai', 'HAG'], ['Zechariah', 'ZEC'], ['Malachi', 'MAL'],
  ['Matthew', 'MAT'], ['Mark', 'MRK'], ['Luke', 'LUK'], ['John', 'JHN'],
  ['Acts', 'ACT'], ['Romans', 'ROM'], ['1 Corinthians', '1CO'], ['2 Corinthians', '2CO'],
  ['Galatians', 'GAL'], ['Ephesians', 'EPH'], ['Philippians', 'PHP'], ['Colossians', 'COL'],
  ['1 Thessalonians', '1TH'], ['2 Thessalonians', '2TH'], ['1 Timothy', '1TI'],
  ['2 Timothy', '2TI'], ['Titus', 'TIT'], ['Philemon', 'PHM'], ['Hebrews', 'HEB'],
  ['James', 'JAS'], ['1 Peter', '1PE'], ['2 Peter', '2PE'], ['1 John', '1JN'],
  ['2 John', '2JN'], ['3 John', '3JN'], ['Jude', 'JUD'], ['Revelation', 'REV'],
];
const BOOK_IDS = new Map([...BOOKS, ['Psalm', 'PSA'], ['Song of Solomon', 'SNG']]);

const screensPath = process.argv[2] ?? 'assets/data/screens.json';
const screensData = JSON.parse(fs.readFileSync(screensPath, 'utf8'));

// Collect every scripture reference string in the content tree
const references = new Set();
(function walk(value) {
  if (Array.isArray(value)) return value.forEach(walk);
  if (value && typeof value === 'object') {
    if (typeof value.reference === 'string') references.add(value.reference);
    Object.values(value).forEach(walk);
  }
})(screensData.screens);

// Reduce references to unique (bookId, chapterNum) pairs
const chapters = new Set();
const unparsed = [];
for (const reference of references) {
  const match = reference.match(/^(.+?) (\d+):/);
  const bookId = match && BOOK_IDS.get(match[1]);
  if (!bookId) {
    unparsed.push(reference);
    continue;
  }
  chapters.add(`${bookId}/${match[2]}`);
}
if (unparsed.length) {
  console.error('Could not parse references:', unparsed);
  process.exit(1);
}

const cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
const translation = cache[SHORT_NAME];
const missing = [...chapters].filter(chapterKey => {
  const [bookId, chapterNum] = chapterKey.split('/');
  return !translation.verses[bookId]?.[chapterNum];
});

console.log(
  `${references.size} references -> ${chapters.size} chapters; ${missing.length} missing from cache`,
);

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

for (const chapterKey of missing) {
  const [bookId, chapterNum] = chapterKey.split('/');
  const url = `${API_BASE}${TRANSLATION_ID}/${bookId}/${chapterNum}.json`;
  const response = await fetch(url);
  if (!response.ok) {
    console.error(`FAILED ${url}: ${response.status}`);
    process.exit(1);
  }
  const apiChapter = await response.json();

  // Same mapping as BibleHelloAOApiService.mapChapterToVerseContentByVerseRef
  translation.verses[bookId] ??= {};
  translation.verses[bookId][chapterNum] ??= {};
  apiChapter.chapter.content.forEach(verseContent => {
    if (verseContent.type !== 'verse') return;
    translation.verses[bookId][chapterNum][verseContent.number] = {
      verse: verseContent.number,
      text: verseContent.content
        .filter(line => typeof line === 'string' || 'text' in line)
        .map(line => (typeof line === 'string' ? line : line.text))
        .join(' '),
    };
  });
  if (!translation.urls.includes(url)) translation.urls.push(url);
  console.log(`fetched ${bookId} ${chapterNum}`);
  await wait(200);
}

fs.writeFileSync(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`);
console.log(`${missing.length} chapters added; wrote ${CACHE_PATH}`);
