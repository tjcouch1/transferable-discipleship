/**
 * Copyright (C) 2025 TJ Couch
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

import { Canon, VerseRef } from "@sillsdev/scripture";
import {
  BibleTranslationInfo,
  ScriptureVerseContent,
} from "./IScriptureApiService";
import {
  MultiScriptureCache,
  ScriptureApiServiceBase,
  ScriptureVerseContentByVerseRef,
  VersesFromApi,
} from "./ScriptureApiServiceBase";

const SCRIPTURE_URL = "https://bible-api.com/";

/** Scripture cache containing verses in our desired format and info about where we got them */
const initialScriptureCache: MultiScriptureCache = require("../../../assets/data/bible-api.com/scripture.json");

// listed at https://bible-api.com/. Did not finish
const bibleApiAvailableTranslations: BibleTranslationInfo[] = (
  require("../../../assets/data/bible-api.com/translations.json") as Omit<
    BibleTranslationInfo,
    "apiId"
  >[]
).map((translation) => ({ ...translation, apiId: SCRIPTURE_URL }));

// #region bible-api.com types and transform functions

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

/** Verse contents and metadata from bible-api.com */
type BibleApiVerseContent = {
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
type BibleApiScriptureContent = {
  /** Scripture reference as a string */
  reference: string;
  /** verse contents */
  verses: BibleApiVerseContent[];
  /** Concatenated Scripture text at each verse in the range */
  text: string;
  /** Translation ID (provided by bible-api.com. This is not the same as the short name) */
  translation_id: string;
  /** Translation long name */
  translation_name: string;
  /** Translation license */
  translation_note: string;
};

const mapBibleApiVerseToContent = (
  apiVerse: BibleApiVerseContent
): ScriptureVerseContent => ({ verse: apiVerse.verse, text: apiVerse.text });

const mapBibleApiVerseRangeToContentByVerseRef = (
  apiVerseRange: BibleApiScriptureContent
): ScriptureVerseContentByVerseRef => {
  const verses: ScriptureVerseContentByVerseRef = {};
  apiVerseRange.verses.forEach((apiVerse) => {
    const bookId = apiVerse.book_id;
    const chapterNum = apiVerse.chapter;
    const verseNum = apiVerse.verse;

    if (!verses[bookId]) verses[bookId] = {};
    if (!verses[bookId][chapterNum]) verses[bookId][chapterNum] = {};
    verses[bookId][chapterNum][verseNum] = mapBibleApiVerseToContent(apiVerse);
  });

  return verses;
};

// #endregion bible-api.com types

class BibleApiService extends ScriptureApiServiceBase {
  override getServiceId(): string {
    return SCRIPTURE_URL;
  }

  override getInitialCache(): MultiScriptureCache {
    // TODO: Fill cache
    return initialScriptureCache;
  }

  override async getTranslationsFromApi(): Promise<BibleTranslationInfo[]> {
    return bibleApiAvailableTranslations;
  }

  protected override async getVersesFromApi(
    verseRef: VerseRef,
    shortName: string
  ): Promise<VersesFromApi> {
    const reference = `${Canon.bookIdToEnglishName(verseRef.book)} ${
      verseRef.chapterNum
    }:${verseRef.verse ?? verseRef.verseNum}`;

    const translationInfo = await this.getTranslation(shortName);
    const translationId = translationInfo.id;

    const versesUrl = `${SCRIPTURE_URL}${reference}?translation=${translationId}`;

    const response = await fetch(versesUrl);
    const responseContents = await response.json();

    if (!response.ok) throw new Error(responseContents);

    const apiVerses: BibleApiScriptureContent = responseContents;
    const verses = mapBibleApiVerseRangeToContentByVerseRef(apiVerses);

    return { urls: [versesUrl], verses };
  }
}

export const bibleApiService = new BibleApiService();
