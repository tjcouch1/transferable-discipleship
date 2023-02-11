/**
 * ScriptureService.ts - Handles getting Scripture text
 */

const defaultShortName = 'WEB';

/** Example query from https://bible-api.com/romans+12:1-2 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const bibleApiScriptureContentExample: ApiScriptureContent = {
  reference: 'Romans 12:1-2',
  verses: [
    {
      book_id: 'ROM',
      book_name: 'Romans',
      chapter: 12,
      verse: 1,
      text: 'Therefore I urge you, brothers, by the mercies of God, to present your bodies a living sacrifice, holy, acceptable to God, which is your spiritual service.\n',
    },
    {
      book_id: 'ROM',
      book_name: 'Romans',
      chapter: 12,
      verse: 2,
      text: 'Don’t be conformed to this world, but be transformed by the renewing of your mind, so that you may prove what is the good, well-pleasing, and perfect will of God.\n',
    },
  ],
  text: 'Therefore I urge you, brothers, by the mercies of God, to present your bodies a living sacrifice, holy, acceptable to God, which is your spiritual service.\nDon’t be conformed to this world, but be transformed by the renewing of your mind, so that you may prove what is the good, well-pleasing, and perfect will of God.\n',
  translation_id: 'web',
  translation_name: 'World English Bible',
  translation_note: 'Public Domain',
};

const bibleApiAvailableTranslations: ScriptureResourceInfo[] = [
  {
    shortName: 'CHR',
    name: 'Cherokee New Testament',
    id: 'cherokee',
    language: 'Cherokee',
    license: 'Public Domain',
  },
  {
    shortName: 'BBE',
    name: 'Bible in Basic English',
    id: 'bbe',
    language: 'English',
    license: 'Public Domain',
  },
  {
    shortName: 'KJV',
    name: 'King James Version',
    id: 'kjv',
    language: 'English',
    license: 'Public Domain',
  },
  {
    shortName: 'WEB',
    name: 'World English Bible',
    id: 'web',
    language: 'English',
    license: 'Public Domain',
  },
  {
    shortName: 'OEBCW',
    name: 'Open English Bible, Commonwealth Edition',
    id: 'oeb-cw',
    language: 'English (UK)',
    license: 'Public Domain',
  },
  // listed at https://bible-api.com/. Did not finish
];

/** Information about the Scripture Resource */
export type ScriptureResourceInfo = {
  /** Translation shortName */
  shortName: string;
  /** Translation long name */
  name: string;
  /** Translation id that is used to look up references */
  id: string;
  /** Translation language */
  language: string;
  /** Translation license */
  license: string;
};

/** Verse contents and metadata from bible-api.com */
type ApiVerseContent = {
  /** book short name index */
  book_id: string;
  /** book long name */
  book_name: string;
  /** chapter number */
  chapter: number;
  /** verse number */
  verse: number;
  /** Scripture text at this verse */
  text: string;
};

/** Scripture contents and metadata from bible-api.com */
type ApiScriptureContent = {
  /** Scripture reference as a string */
  reference: string;
  /** verse contents */
  verses: ApiVerseContent[];
  /** Concatenated Scripture text at each verse in the range */
  text: string;
  /** Translation shortName */
  translation_id: string;
  /** Translation long name */
  translation_name: string;
  /** Translation license */
  translation_note: string;
};

/** Contents of the verse */
export type ScriptureVerseContent = {
  /** verse number */
  verse: number;
  /** Scripture text at this verse */
  text: string;
};

/** Range of Scripture verses */
export type ScriptureVerseRangeContent = {
  /** Information about the Scripture resource with this verse range */
  resourceInfo: ScriptureResourceInfo;
  /** Scripture reference as a string */
  reference: string;
  /** verse contents */
  verses: ScriptureVerseContent[];
};

/**
 * Get a list of information about available translations
 * TODO: make some kind of initialize function that grabs these from server. Or just make all this lazy-load async, which is probably better
 */
export const getTranslations = (): ScriptureResourceInfo[] =>
  bibleApiAvailableTranslations;

/**
 * Get information about a translation by short name
 * @param shortName which translation to get information about
 * @returns information about the translation requested
 */
export const getTranslation = (shortName: string): ScriptureResourceInfo => {
  const resourceInfo = bibleApiAvailableTranslations.find(
    resInfo => resInfo.shortName === shortName,
  );
  if (!resourceInfo)
    throw new Error(`Translation shortName ${shortName} not found`);
  return resourceInfo;
};

/**
 * Get information about a translation by id
 * @param id which translation to get information about by api translation id
 * @returns information about the translation requested
 */
export const getTranslationById = (id: string): ScriptureResourceInfo => {
  const resourceInfo = bibleApiAvailableTranslations.find(
    resInfo => resInfo.id === id,
  );
  if (!resourceInfo) throw new Error(`Translation id ${id} not found`);
  return resourceInfo;
};

const mapApiVerseToContent = (
  apiVerse: ApiVerseContent,
): ScriptureVerseContent => ({ verse: apiVerse.verse, text: apiVerse.text });

const mapApiVerseRangeToContent = (
  apiVerseRange: ApiScriptureContent,
): ScriptureVerseRangeContent => ({
  resourceInfo: getTranslationById(apiVerseRange.translation_id),
  reference: apiVerseRange.reference,
  verses: apiVerseRange.verses.map(apiVerse => mapApiVerseToContent(apiVerse)),
});

/**
 * Get Scripture verses from a string reference
 * @param reference reference to get verses from like 'Romans 12:1-2', 'Romans 3:5', 'Mark 3:5,6,7-12'
 * @param shortName which translation to get verses from
 */
export const getScripture = async (
  reference: string,
  shortName = defaultShortName,
): Promise<ScriptureVerseRangeContent> => {
  const response = await fetch(
    `https://bible-api.com/${reference}?translation=${
      getTranslation(shortName).id
    }`,
  );
  if (!response.ok)
    throw new Error(
      `Failed to get Scripture for ${reference} ${shortName}. Error: ${await response.json()}`,
    );

  const apiVerses: ApiScriptureContent = await response.json();
  return mapApiVerseRangeToContent(apiVerses);
};
