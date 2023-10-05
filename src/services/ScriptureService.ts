/**
 * Copyright (C) 2023 TJ Couch
 * This file is part of discipleship‑app‑template.
 *
 * discipleship‑app‑template is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * discipleship‑app‑template is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with discipleship‑app‑template. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * ScriptureService.ts - Handles getting Scripture text
 */

import { ScriptureSlideContentData } from '../components/contents/ScriptureSlide';
import { isWeb } from '../util/Util';
import { forEachContent } from './ScreenService';

const defaultShortName = 'WEB';

/** Example query from https://bible-api.com/romans+12:1-2 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* const bibleApiScriptureContentExample: ApiScriptureContent = {
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
}; */

// listed at https://bible-api.com/. Did not finish
const bibleApiAvailableTranslations: ScriptureResourceInfo[] = require('../../assets/data/bible-api.com/translations.json');

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
  /** URL from which we fetched these verses */
  sourceUrl: string;
};

type ScriptureCache = ScriptureResourceInfo & {
  /** Base url from which we fetched these verses */
  sourceUrl: string;
  verses: {
    [reference: string]:
      | ScriptureVerseRangeContent
      | Promise<ScriptureVerseRangeContent>;
  };
};

type MultiScriptureCache = {
  [id: string]: ScriptureCache;
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
  sourceUrl: string,
): ScriptureVerseRangeContent => ({
  resourceInfo: getTranslationById(apiVerseRange.translation_id),
  reference: apiVerseRange.reference,
  verses: apiVerseRange.verses.map(apiVerse => mapApiVerseToContent(apiVerse)),
  sourceUrl,
});

// #region retrieving and caching Scripture

/** Scripture cache containing verses in our desired format and info about where we got them */
const scriptureCache: MultiScriptureCache = require('../../assets/data/scripture.json');

const scriptureUrl = 'https://bible-api.com/';

/**
 * Get Scripture verses from a string reference
 * @param reference reference to get verses from like 'Romans 12:1-2', 'Romans 3:5', 'Mark 3:5,6,7-12'
 * @param shortName which translation to get verses from
 */
export const getScripture = (
  reference: string,
  shortName = defaultShortName,
): Promise<ScriptureVerseRangeContent> => {
  // Try to get from cache
  const translationInfo = getTranslation(shortName);
  const translationId = translationInfo.id;
  if (scriptureCache[translationId]) {
    const cachedVerses = scriptureCache[translationId].verses[reference];
    if (cachedVerses) {
      console.log(
        `Found ${reference}${
          'then' in cachedVerses ? ' promise' : ''
        } in cache`,
      );
      return Promise.resolve(cachedVerses);
    }
  }

  // Get verses from server
  console.warn(`Did not find ${reference} in cache. Caching`);
  const versesUrl = `${scriptureUrl}${reference}?translation=${translationId}`;
  if (!scriptureCache[translationId])
    scriptureCache[translationId] = {
      ...translationInfo,
      sourceUrl: scriptureUrl,
      verses: {},
    };
  const versesPromise = (async () => {
    const response = await fetch(versesUrl);
    if (!response.ok)
      throw new Error(
        `Failed to get Scripture for ${reference} ${shortName}. Error: ${await response.json()}`,
      );

    const apiVerses: ApiScriptureContent = await response.json();
    const verses = mapApiVerseRangeToContent(apiVerses, versesUrl);

    // Save verses to cache
    scriptureCache[translationId].verses[reference] = verses;
    // console.log(`${reference} cached`);

    return verses;
  })();

  // Save verses promise to cache
  scriptureCache[translationId].verses[reference] = versesPromise;

  return versesPromise;
};

/* Get all Scripture References from the screens and cache the verses */
async function cacheAllScripture() {
  const getScripturePromises: Set<ReturnType<typeof getScripture>> = new Set();
  forEachContent(content => {
    const scriptureSlide = content as ScriptureSlideContentData;
    if (scriptureSlide.scripture) {
      const scriptures = Array.isArray(scriptureSlide.scripture)
        ? scriptureSlide.scripture
        : [scriptureSlide.scripture];
      scriptures.forEach(scripture =>
        getScripturePromises.add(getScripture(scripture.reference)),
      );
    }
  });

  // console.log(`Found ${getScripturePromises.size} unique Scripture references`)

  await Promise.all(getScripturePromises.values());

  if (isWeb())
    localStorage.setItem('scriptureCache', JSON.stringify(scriptureCache));
}

// Cache all Scripture at startup
cacheAllScripture();

// #endregion
