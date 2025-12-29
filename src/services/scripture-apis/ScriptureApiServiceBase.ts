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

import { VerseRef } from "@sillsdev/scripture";
import {
  BibleTranslationInfo,
  IScriptureApiService,
  ScriptureVerseContent,
  ScriptureVerseRangeContent,
} from "./IScriptureApiService";
import { englishNameToBookId } from "../../util/ScriptureUtils";
import { debounce, deepClone, isDev, isWeb } from "../../util/Util";

/**
 * Regex to run on Scripture references to get Scripture reference details
 *
 * Matches:
 * - 0: the whole reference match
 * - 1: Book string
 * - 2: The rest of the Scripture reference
 */
const SCRIPTURE_REFERENCE_REGEX = /([1-9]?[0-9]* ?[\w \(\)*\.-]+) (\d.+)/;

// #region handling verses

/**
 * Get the set of verses in a list of verse refs (possibly verse ref ranges) if they are in the provided verses
 *
 * @param verses verses to get the verses in the verse refs from
 * @param verseRefs verse refs (possibly ranges) to get verses from in order
 * @returns ordered list of all verses in the verse refs or `undefined` if any were not found
 */
function extractVerseContentsFromVerses(
  verses: ScriptureVerseContentByVerseRef,
  verseRefs: VerseRef[]
): ScriptureVerseContent[] | undefined {
  const verseContents: ScriptureVerseContent[] = [];
  // Flatten out all the verse refs and ranges into individual verse refs in the same order
  // Note: these verses could come from different chapters (maybe even different books in the future). We do not
  // capture this information in `ScriptureVerseContent`. We may need to do so one day.
  const allVerses = verseRefs.flatMap((verseRef) => verseRef.allVerses());
  for (const currentVerseRef of allVerses) {
    const verseContent =
      verses[currentVerseRef.book]?.[currentVerseRef.chapterNum]?.[
        currentVerseRef.verseNum
      ];

    if (verseContent) verseContents.push(verseContent);
    // Didn't find the verse, so the verses don't have everything we need. Return undefined
    else return undefined;
  }

  return verseContents;
}

// #endregion

// #region caching

/** Only fetch and cache if this is `true` */
export const SHOULD_FETCH = isWeb() && isDev();

/**
 * Verses retrieved from a Scripture API divided into each verse ref and with the URLs used to get
 * those verses
 */
export type VersesFromApi = {
  /** List of URLs used to fetch all the verses */
  urls: string[];
  /** Verses retrieved from the Scripture API at the URLs specified by {@link VersesFromApi.urls} */
  verses: ScriptureVerseContentByVerseRef;
};

/** Scripture verses mapped by book ID, chapter number, and verse number */
export type ScriptureVerseContentByVerseRef = {
  [bookId: string]:
    | {
        [chapterNum: number | string]:
          | {
              [verseNum: number | string]: ScriptureVerseContent | undefined;
            }
          | undefined;
      }
    | undefined;
};

/** Object containing information about a Bible translation and known verses from that translation */
type ScriptureCache = BibleTranslationInfo & VersesFromApi;

/** Multiple sets of Bible translation info and verse contents mapped by Bible translation short name */
export type MultiScriptureCache = {
  [shortName: string]: ScriptureCache | undefined;
};

// #endregion caching

/**
 * Abstract class that provides parsing references, one-at-a-time retrieval (to avoid breaking rate
 * limits), and caching for a Scripture API service
 */
export abstract class ScriptureApiServiceBase implements IScriptureApiService {
  /**
   * Whether we have sent an alert to the user that any Scripture API cache has been changed. Just want to send
   * one per load
   */
  private static hasAlerted = false;

  /** Used to determine if new verses have been cached. Only populated if {@link SHOULD_FETCH} is `true` */
  private readonly initialScriptureCache: MultiScriptureCache;
  /**
   * Up-to-date cache of all retrieved Scripture verses in this service. Used for local retrieval and storing
   * newly retrieved Scripture verses if {@link SHOULD_FETCH} is `true`.
   */
  private readonly scriptureCache: MultiScriptureCache;

  constructor() {
    this.scriptureCache = this.getInitialCache();

    this.initialScriptureCache = SHOULD_FETCH
      ? deepClone(this.scriptureCache)
      : {};
  }

  abstract getServiceId(): string;
  abstract getTranslations(): Promise<BibleTranslationInfo[]>;

  /** Get the initial state of the cache as known at startup */
  protected abstract getInitialCache(): MultiScriptureCache;

  /**
   * Method for fetching verses from the API and transforming them into a format usable throughout the application.
   * This will be called only after determining not all necessary verses are cached. It will only be called once at
   * a time per service. It will not be called if fetching and caching is disabled.
   *
   * @param verseRef the verse ref requested. This method must support verse ranges
   * @param shortName the shortName of the translation to get verses for
   * @returns set of verses indexed by book, chapter, and verse (each verse must be split into its own entry) and
   * the URLs used to retrieve those verses. The returned set of verses must include verse text for at least each
   * requested verse in the `verseRef`, but it may contain more than the requested verses; all verses returned will
   * be cached.
   */
  protected abstract getVersesFromApi(
    verseRef: VerseRef,
    shortName: string
  ): Promise<VersesFromApi>;

  /**
   * Do not use directly; see {@link getVerseContentsSerial}.
   *
   * Fetch verses from the API and save them to the cache.
   *
   * @param verseRef the verse ref requested. Properly supports verse ranges
   * @param translationInfo information about the translation whose verses we are caching
   * @returns set of verses indexed by book, chapter, and verse (each verse is split into its own entry) and
   * the URLs used to retrieve those verses
   */
  private async getVerseContentsInternal(
    verseRef: VerseRef,
    translationInfo: BibleTranslationInfo
  ): Promise<ScriptureVerseContent[]> {
    let verses: VersesFromApi;
    try {
      verses = await this.getVersesFromApi(verseRef, translationInfo.shortName);
    } catch (e) {
      throw new Error(
        `Failed to get Scripture for ${verseRef} ${translationInfo.shortName}. Error: ${e}`
      );
    }

    // Save verses to cache
    this.setVersesInCache(verses, translationInfo);

    // Get the verse contents at the verse ref from the API's verses. If they aren't all present,
    // throw
    const verseContents = extractVerseContentsFromVerses(verses.verses, [
      verseRef,
    ]);
    if (!verseContents)
      throw new Error(
        `Did not find all verses in returned verses from ${this.getServiceId()} API at ${verseRef} ${
          translationInfo.shortName
        }: ${JSON.stringify(verses)}`
      );

    return verseContents;
  }

  /**
   * A queue of verse contents promises used to make sure verse contents API calls are executed one-at-a-time.
   * The promise at index 0 is the one that should be currently executing. Subsequent promises are waiting on
   * entries before them
   */
  private verseContentsQueue: {
    verseContentsCallId: number;
    queuePromise: Promise<ScriptureVerseContent[]>;
  }[] = [];
  /** Identifying number for tracking which verse contents call is which */
  private nextVerseContentsCallId = 0;

  /**
   * Get verses from the cache if they are available. Otherwise, fetch verses from the API one-at-a-time,
   * re-checking the cache every time new verses are retrieved.
   *
   * @param verseRefs the verse refs requested. Properly supports verse ranges
   * @param translationInfo information about the translation whose verses we are caching
   * @returns set of verses indexed by book, chapter, and verse (each verse is split into its own entry) and
   * the URLs used to retrieve those verses
   */
  private async getVerseContentsSerial(
    verseRefs: VerseRef[],
    translationInfo: BibleTranslationInfo
  ): Promise<ScriptureVerseContent[]> {
    // Try to get verses for all the verse refs from the cache
    let cachedVerseContents = this.getVersesFromCache(
      verseRefs,
      translationInfo.shortName
    );
    if (cachedVerseContents) return cachedVerseContents;

    // The verses weren't in the cache. Quit now or fetch from API if allowed
    if (!SHOULD_FETCH)
      throw new Error(
        `Failed to get Scripture from ${this.getServiceId()} cache at ${verseRefs.join()} ${
          translationInfo.shortName
        }. Fetching is disabled.`
      );

    // Get the verses from the API
    console.log(
      `Did not find ${verseRefs.join()} ${
        translationInfo.shortName
      } in ${this.getServiceId()} cache. Retrieving from API and caching`
    );

    // Make a separate single-verse-ref API call for each verse ref in verseRefs and concat them together
    const allVerseContents = (
      await Promise.all(
        verseRefs.map(async (verseRef) => {
          // Add this call to the queue of verse content calls
          const verseContentsCallId = this.nextVerseContentsCallId;
          this.nextVerseContentsCallId += 1;
          let resolve: (
            value:
              | ScriptureVerseContent[]
              | PromiseLike<ScriptureVerseContent[]>
          ) => void = () => {
            throw new Error(
              "This resolve is temporary and should not be called"
            );
          };
          let reject: (reason?: any) => void = () => {
            throw new Error(
              "This reject is temporary and should not be called"
            );
          };
          const queuePromise = new Promise<
            Awaited<ReturnType<typeof this.getVerseContentsInternal>>
          >((resolvePromise, rejectPromise) => {
            resolve = resolvePromise;
            reject = rejectPromise;
          });

          this.verseContentsQueue.push({
            verseContentsCallId,
            queuePromise,
          });

          let verseContents: ScriptureVerseContent[] | undefined;
          try {
            // Wait for other API calls to finish
            let currentVerseContentsPromise = this.verseContentsQueue[0];
            while (
              currentVerseContentsPromise &&
              currentVerseContentsPromise.verseContentsCallId !==
                verseContentsCallId
            ) {
              await currentVerseContentsPromise.queuePromise;
              currentVerseContentsPromise = this.verseContentsQueue[0];
            }

            // Check the cache again - maybe the other promises loaded the verses we need
            verseContents = this.getVersesFromCache(
              [verseRef],
              translationInfo.shortName
            );

            if (!verseContents)
              // Retrieve verses from one verse ref from the API
              verseContents = await this.getVerseContentsInternal(
                verseRef,
                translationInfo
              );
          } catch (e) {
            reject(e);
            throw e;
          } finally {
            // Remove this queue promise from the queue and resolve it so the next call can start
            const verseContentsCallIndexInQueue =
              this.verseContentsQueue.findIndex(
                (queueCall) =>
                  queueCall.verseContentsCallId === verseContentsCallId
              );
            if (verseContentsCallIndexInQueue === -1)
              throw new Error(
                `Something went wrong! Verse Contents call not found in queue`
              );
            this.verseContentsQueue.splice(verseContentsCallIndexInQueue, 1);
          }

          // Resolve the verse contents promise so other API calls can start. Must do this after removing this call from
          // the queue.
          resolve(verseContents);
          return verseContents;
        })
      )
    ).flat();

    return allVerseContents;
  }

  async getScripture(
    reference: string,
    shortName: string
  ): Promise<ScriptureVerseRangeContent> {
    const translationInfo = await this.getTranslation(shortName);

    // Parse the reference into a list of verse ref objects
    const [, englishBookName, chapterVerse] =
      reference.match(SCRIPTURE_REFERENCE_REGEX) ?? [];
    const bookId = englishNameToBookId(englishBookName);

    let currentChapterNum = "";
    // Split the chapter and verse specification into each chapter/verse(range) pair
    // Each part has a verse or verse range and maybe a chapter
    const chapterVerseParts = chapterVerse.split(",");

    const verseRefs = chapterVerseParts.map((chapterVerse) => {
      // Figure out the verse range
      let verseRange = chapterVerse.trim();

      // Split the chapter off from the verse range if there is a new chapter number
      if (verseRange.includes(":"))
        [currentChapterNum, verseRange] = verseRange.split(":");

      // Make the verse ref with the book, chapter, and verse or verse range
      return new VerseRef(`${bookId} ${currentChapterNum}:${verseRange}`);
    });

    const verseContents = await this.getVerseContentsSerial(
      verseRefs,
      translationInfo
    );

    // Return retrieved verses
    return {
      resourceInfo: translationInfo,
      reference,
      verses: verseContents,
    };
  }

  /**
   * Get information about a translation by short name
   *
   * @param shortName which translation to get information about
   * @returns information about the translation requested
   */
  protected async getTranslation(
    shortName: string
  ): Promise<BibleTranslationInfo> {
    // TODO: cache `this.getTranslations`
    const resourceInfo = (await this.getTranslations()).find(
      (resInfo) => resInfo.shortName === shortName
    );
    if (!resourceInfo)
      throw new Error(`Translation shortName ${shortName} not found`);
    return resourceInfo;
  }

  /**
   * Get information about a translation by id
   *
   * @param id which translation to get information about by api translation id
   * @returns information about the translation requested
   */
  protected async getTranslationById(
    id: string
  ): Promise<BibleTranslationInfo> {
    const resourceInfo = (await this.getTranslations()).find(
      (resInfo) => resInfo.id === id
    );
    if (!resourceInfo) throw new Error(`Translation id ${id} not found`);
    return resourceInfo;
  }

  /**
   * Get the verse text in the verse reference from the cache
   *
   * @param verseRefs the verse refs requested. Properly supports verse ranges
   * @param shortName the shortName of the translation to get verses for
   * @returns array of verse contents or `undefined` if any verses were not found in the cache
   */
  private getVersesFromCache(
    verseRefs: VerseRef[],
    shortName: string
  ): ScriptureVerseContent[] | undefined {
    if (!this.scriptureCache[shortName]) return undefined;

    const cachedVerses = this.scriptureCache[shortName].verses;
    if (!cachedVerses) return undefined;

    const cachedVerseContents = extractVerseContentsFromVerses(
      cachedVerses,
      verseRefs
    );

    return cachedVerseContents;
  }

  /**
   * Adds or updates verses in the cache from an API response. Handles saving the cache and alerting the user
   * that the cache has changed
   *
   * @param verses verse contents to update
   * @param translationInfo information about the translation whose verses we are caching
   */
  private setVersesInCache(
    verses: VersesFromApi,
    translationInfo: BibleTranslationInfo
  ): void {
    const shortName = translationInfo.shortName;

    if (!this.scriptureCache[shortName])
      this.scriptureCache[shortName] = {
        ...translationInfo,
        urls: [],
        verses: {},
      };

    // Add the fetch URLs to the cache without duplicates
    const existingUrls = new Set(this.scriptureCache[shortName].urls);
    verses.urls.forEach((url) => existingUrls.add(url));
    this.scriptureCache[shortName].urls = [...existingUrls];

    // Set the fetched verses in the verse cache
    Object.entries(verses.verses).forEach(([bookId, bookContents]) =>
      Object.entries(bookContents ?? {}).forEach(
        ([chapterNum, chapterContents]) =>
          Object.entries(chapterContents ?? {}).forEach(
            ([verseNum, verseContent]) => {
              if (!this.scriptureCache[shortName]!.verses[bookId])
                this.scriptureCache[shortName]!.verses[bookId] = {};
              if (!this.scriptureCache[shortName]!.verses[bookId]![chapterNum])
                this.scriptureCache[shortName]!.verses[bookId]![chapterNum] =
                  {};
              if (
                !this.scriptureCache[shortName]!.verses[bookId]![chapterNum]![
                  verseNum
                ]
              )
                this.scriptureCache[shortName]!.verses[bookId]![chapterNum]![
                  verseNum
                ] = verseContent;
            }
          )
      )
    );

    this.saveCacheDebounced();
  }

  /** Save the cache and alert if it changed */
  private saveCacheDebounced = debounce(
    this.saveCacheInternal.bind(this),
    1000
  );

  /**
   * Do not use directly; see {@link saveCacheDebounced}
   *
   * Save the cache and alert if it changed.
   */
  private saveCacheInternal() {
    if (!SHOULD_FETCH) return;

    const scriptureCacheStringified = JSON.stringify(this.scriptureCache);
    localStorage.setItem(
      `scriptureCache.${this.getServiceId()}`,
      scriptureCacheStringified
    );

    if (
      !ScriptureApiServiceBase.hasAlerted &&
      // Very quick and dirty deepEqual - rather not write a lot or import a package just for this
      JSON.stringify(this.initialScriptureCache) !== scriptureCacheStringified
    ) {
      ScriptureApiServiceBase.hasAlerted = true;
      alert(
        `Cache for ${this.getServiceId()} received updates. There may be other API services that also received updates. Please update the cache file.`
      );
    }
  }
}
