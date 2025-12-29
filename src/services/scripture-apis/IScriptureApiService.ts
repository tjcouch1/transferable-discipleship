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

// #region our generic Scripture types that external APIs are to be translated into

/** Information about a Bible offered on an API */
export type BibleTranslationInfo = {
  /** Translation shortName */
  shortName: string;
  /** Translation long name */
  name: string;
  /** Translation language */
  language: string;
  /** Translation license */
  license: string;
  /** Translation id that is used in the URL to look up references */
  id: string;
  /**
   * Scripture API service ID where this Scripture Resource is found. Should be exactly the same as the value
   * returned from {@link IScriptureApiService.getServiceId}
   */
  apiId: string;
};

/** Contents of a verse */
export type ScriptureVerseContent = {
  /** verse number */
  verse: number;
  /** Scripture text at this verse */
  text: string;
};

/** Range of Scripture verses along with information about where they came from */
export type ScriptureVerseRangeContent = {
  /** Information about the Scripture resource with this verse range */
  resourceInfo: BibleTranslationInfo;
  /** Scripture reference as a string */
  reference: string;
  /** verse contents */
  verses: ScriptureVerseContent[];
};

// #endregion our generic Scripture types that external APIs are to be translated into

/** Interface that describes an API that serves Scripture data */
export interface IScriptureApiService {
  /** Get a unique ID to identify this Scripture API service */
  getServiceId(): string;
  /** Get information about available Bible translations on this API */
  getTranslations(): Promise<BibleTranslationInfo[]>;
  /**
   * Get verses at a particular reference
   * @param reference reference to get verses from like 'Romans 12:1-2', 'Romans 3:5', 'Mark 3:5,6,7-12',
   * 'Genesis 2:15, 3:8', '1 John 3:6, 9-10'
   * @param shortName short name of Bible translation to get text from
   */
  getScripture(
    reference: string,
    shortName: string
  ): Promise<ScriptureVerseRangeContent>;
}
