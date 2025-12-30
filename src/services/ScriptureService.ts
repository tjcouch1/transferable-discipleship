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

import type { ScrRangeDisplayContentData } from "../components/contents/ScrRangeDisplay";
import type { ScriptureSlideContentData } from "../components/contents/ScriptureSlide";
import { isString } from "../util/Util";
import { forEachContent } from "./ScreenService";
import type {
  IScriptureApiService,
  BibleTranslationInfo,
  ScriptureVerseRangeContent,
} from "./scripture-apis/IScriptureApiService";
import { bibleApiService } from "./scripture-apis/BibleApiService";
import { bibleHelloAOApiService } from "./scripture-apis/BibleHelloAOApiService";
import { SHOULD_FETCH } from "./scripture-apis/ScriptureApiServiceBase";

/** The shortName of the default translation to use throughout the application */
export const DEFAULT_SHORT_NAME: string = "NET";

const SCRIPTURE_API_SERVICES = [bibleApiService, bibleHelloAOApiService];

const SCRIPTURE_API_SERVICES_BY_ID: {
  [apiId: string]: IScriptureApiService | undefined;
} = Object.fromEntries(
  SCRIPTURE_API_SERVICES.map((service) => [service.getServiceId(), service])
);

let translationsCached: BibleTranslationInfo[] | undefined;
/** Get a list of information about available translations. */
export async function getTranslations(): Promise<BibleTranslationInfo[]> {
  if (translationsCached) return translationsCached;

  translationsCached = (
    await Promise.all(
      Object.values(SCRIPTURE_API_SERVICES_BY_ID).map((service) =>
        service?.getTranslations()
      )
    )
  )
    .filter((translations) => !!translations)
    .flat();

  return translationsCached;
}

async function getScriptureApiServiceByShortName(
  shortName: string
): Promise<IScriptureApiService> {
  const translation = (await getTranslations()).find(
    (translationInfo) => translationInfo.shortName === shortName
  );

  if (!translation)
    throw new Error(
      `Could not find a Scripture API service serving shortName ${shortName}`
    );

  const service = SCRIPTURE_API_SERVICES_BY_ID[translation.apiId];

  if (!service)
    throw new Error(
      `Could not find service ${translation.apiId} that is supposed to serve shortName ${shortName}`
    );

  return service;
}

// #region retrieving and caching Scripture

/**
 * Get Scripture verses from a string reference
 * @param reference reference to get verses from like 'Romans 12:1-2', 'Romans 3:5', 'Mark 3:5,6,7-12'
 * @param shortName which translation to get verses from
 */
export async function getScripture(
  reference: string,
  shortName: string = DEFAULT_SHORT_NAME
): Promise<ScriptureVerseRangeContent> {
  const service = await getScriptureApiServiceByShortName(shortName);

  return service.getScripture(reference, shortName);
}

/* Get all Scripture References from the screens and cache the verses */
async function cacheAllScripture() {
  if (!SHOULD_FETCH) return;

  const getScripturePromises: Set<ReturnType<typeof getScripture>> = new Set();
  forEachContent((content) => {
    if (!isString(content)) {
      if ("scripture" in content) {
        const scriptureSlide = content as ScriptureSlideContentData;
        if (scriptureSlide.scripture) {
          const scriptures = Array.isArray(scriptureSlide.scripture)
            ? scriptureSlide.scripture
            : [scriptureSlide.scripture];
          scriptures.forEach((scripture) =>
            getScripturePromises.add(
              getScripture(scripture.reference, scripture.shortName)
            )
          );
        }
      } else if ("reference" in content) {
        const scrRangeDisplay = content as ScrRangeDisplayContentData;
        if (scrRangeDisplay.reference) {
          getScripturePromises.add(
            getScripture(scrRangeDisplay.reference, scrRangeDisplay.shortName)
          );
        }
      }
    }
  });

  await Promise.allSettled([...getScripturePromises.values()]);
}

// Cache all Scripture at startup
cacheAllScripture();

// #endregion
