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

import { BibleTranslationInfo } from "./IScriptureApiService";
import {
  MultiScriptureCache,
  ScriptureApiServiceBase,
  ScriptureVerseContentByVerseRef,
  VersesFromApi,
} from "./ScriptureApiServiceBase";
import { VerseRef } from "@sillsdev/scripture";
import { TranslationBookChapter } from "./BibleHelloAOApiModel";

const SCRIPTURE_URL = "https://bible.helloao.org/api/";

/** Scripture cache containing verses in our desired format and info about where we got them */
const initialScriptureCache: MultiScriptureCache = require("../../../assets/data/bible.helloao.org/scripture.json");

/**
 * Listed at https://bible.helloao.org/api/available_translations.json - did not try to transform from their format;
 * just grabbed one manually. See {@link AvailableTranslations} in `BibleHelloAOApiModel.ts` or
 * https://bible-api.pages.dev/docs/reference/#available-translations for types on that API.
 *
 * WARNING: The NET Bible is listed on the API with shortname NETB for some reason. I manually changed it to NET.
 */
const bibleHelloAOAvailableTranslations: BibleTranslationInfo[] = (
  require("../../../assets/data/bible.helloao.org/translations.json") as Omit<
    BibleTranslationInfo,
    "apiId"
  >[]
).map((translation) => ({ ...translation, apiId: SCRIPTURE_URL }));

// #region transform functions

function mapChapterToVerseContentByVerseRef(
  apiChapter: TranslationBookChapter
): ScriptureVerseContentByVerseRef {
  const verses: ScriptureVerseContentByVerseRef = {};

  const bookId = apiChapter.book.id;
  if (!verses[bookId]) verses[bookId] = {};

  const chapterNum = apiChapter.chapter.number;
  if (!verses[bookId][chapterNum]) verses[bookId][chapterNum] = {};

  apiChapter.chapter.content.forEach((verseContent) => {
    // The chapter content has more than just verses, but we're only interested in verses here
    if (verseContent.type !== "verse") return;

    const verseNum = verseContent.number;

    // We just made sure verses[bookId][chapterNum] exists above, so assume they exist here
    verses[bookId]![chapterNum]![verseNum] = {
      verse: verseContent.number,
      text: verseContent.content
        .filter(
          (verseLine) => typeof verseLine === "string" || "text" in verseLine
        )
        .map((verseLine) =>
          typeof verseLine === "string" ? verseLine : verseLine.text
        )
        .join(" "),
    };
  });

  return verses;
}

// #endregion transform functions

class BibleHelloAOApiService extends ScriptureApiServiceBase {
  override getServiceId(): string {
    return SCRIPTURE_URL;
  }

  override getInitialCache(): MultiScriptureCache {
    return initialScriptureCache;
  }

  override async getTranslationsFromApi(): Promise<BibleTranslationInfo[]> {
    return bibleHelloAOAvailableTranslations;
  }

  protected override async getVersesFromApi(
    verseRef: VerseRef,
    shortName: string
  ): Promise<VersesFromApi> {
    const translationInfo = await this.getTranslation(shortName);
    const translationId = translationInfo.id;

    const versesUrl = `${SCRIPTURE_URL}${translationId}/${verseRef.book}/${verseRef.chapterNum}.json`;

    const response = await fetch(versesUrl);
    const responseContents = await response.json();

    if (!response.ok) throw new Error(responseContents);

    const apiChapter: TranslationBookChapter = responseContents;
    const verses = mapChapterToVerseContentByVerseRef(apiChapter);

    return { urls: [versesUrl], verses };
  }
}

export const bibleHelloAOApiService = new BibleHelloAOApiService();
