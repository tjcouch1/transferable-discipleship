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
 * ScreenService.ts - Handles getting the page structure
 */

import { ViewStyle } from 'react-native';
import { ContentListData } from '../components/contents/ContentList';
import { ContentData } from '../components/contents/Contents';
import { HeaderContentData } from '../components/contents/Header';
import { ContentListScreenData } from '../components/screens/ContentListScreen';
import {
  SerializedAppData,
  ScreenData,
  AppData,
  ScreenMap,
} from '../components/screens/Screens';
import { ROOT_PATH, PATH_DELIMITER, pathJoin } from '../util/PathUtil';
import { APP_VERSION, isDev } from '../util/Util';

const serializedAppDataNew: SerializedAppData = require('../../assets/data/screens.json');

/** Screen data for software license info. Accessed on path `app:/__licenses` */
const licensesScreen = require('../../assets/data/licenses/licenses.json');

//----- CONTENT SUGAR -----//
// Compact content forms in screens.json that expand to regular contents at
// load time. They never reach the component registry, so rendering behavior
// (including ContentList's one-open-slide-at-a-time control) is unchanged.

/**
 * A run of ScriptureSlides that all pose the same tap-to-reveal question.
 * Expands to one ScriptureSlide per entry with the question as its
 * hiddenButton ("(tap to reveal)" is appended automatically by ToggleButton).
 */
export type ScriptureQuestionListContentData = {
  type: 'ScriptureQuestionList';
  /** The question every slide's tap-to-reveal button asks */
  question: string;
  /** ScriptureSlide data (without type); hiddenButton is filled from question */
  slides: Omit<Extract<ContentData, { type: 'ScriptureSlide' }>, 'type'>[];
};

/**
 * A standard "next steps" reveal. Expands to the answer-styled ToggleButton
 * used throughout the Intentionality content.
 */
export type NextStepsContentData = {
  type: 'NextSteps';
  /** The action steps revealed on tap, shown one per line */
  steps: string[];
};

/** Content sugar types (see above) */
export type SugarContentData =
  ScriptureQuestionListContentData | NextStepsContentData;

function expandContent(content: ContentData | SugarContentData): ContentData[] {
  if (!content || typeof content === 'string' || !('type' in content))
    return [content];

  if (content.type === 'ScriptureQuestionList') {
    const { question, slides } = content as ScriptureQuestionListContentData;
    // Attach the shared question as the tap-to-reveal hiddenButton (a slide's
    // own hiddenButton still wins via spread order). For a multi-passage
    // (array) slide, put it on the last passage so it renders once after them.
    const addQuestion = (scr: object) => ({
      hiddenButton: { text: question },
      ...scr,
    });
    return slides.map(slide => ({
      ...slide,
      type: 'ScriptureSlide',
      scripture: Array.isArray(slide.scripture)
        ? slide.scripture.map((scr, i, arr) =>
            i === arr.length - 1 ? addQuestion(scr) : scr,
          )
        : addQuestion(slide.scripture),
    })) as ContentData[];
  }

  if (content.type === 'NextSteps') {
    const { steps } = content as NextStepsContentData;
    return [
      {
        type: 'ToggleButton',
        design: 'answer',
        text: 'next steps',
        altButtons: [{ design: 'answer', text: steps.join('\n') }],
      } as ContentData,
    ];
  }

  // Recursively expand nested contents (e.g. NextSteps inside a Slide)
  const withContents = content as ContentData &
    object & { contents?: unknown[] };
  if (Array.isArray(withContents.contents))
    return [
      {
        ...withContents,
        contents: withContents.contents.flatMap(nested =>
          expandContent(nested as ContentData | SugarContentData),
        ),
      } as ContentData,
    ];

  return [content as ContentData];
}

/** Expand all content sugar in a screen's contents (and its subscreens') */
export function expandScreenContents(screen: ScreenData): ScreenData {
  const expanded = { ...screen };
  const withContents = expanded as ScreenData & { contents?: unknown[] };
  if (Array.isArray(withContents.contents))
    withContents.contents = withContents.contents.flatMap(content =>
      expandContent(content as ContentData | SugarContentData),
    );
  if (expanded.subscreens)
    expanded.subscreens = expanded.subscreens.map(expandScreenContents);
  return expanded;
}

function assertScreenIdIsValid(screenId: string) {
  if (!screenId)
    throw new Error(
      `Screen id ${screenId} is not valid! Must provide a non-empty string`,
    );
  if (screenId === '..')
    throw new Error(
      `Screen id ${screenId} is not valid! Cannot use reserved words`,
    );
  if (screenId.includes(PATH_DELIMITER))
    throw new Error(
      `Screen id ${screenId} is not valid! Cannot use ${PATH_DELIMITER} in screen id`,
    );
}

/**
 * Recursively copies screens over to screenMap following down currentPath
 * @param screenMap map to add screens to
 * @param currentPath path to add current screens to
 * @param screens screens to add to the screenMap. Note that these are cloned and modified
 * @returns screenMap
 */
function addSubscreensToMap(
  screenMap: ScreenMap,
  currentPath: string,
  screens: ScreenData[] | undefined,
): ScreenMap {
  screens?.forEach(screen => {
    assertScreenIdIsValid(screen.id);

    const screenPath = pathJoin(currentPath, screen.id);

    if (screenMap.has(screenPath))
      throw new Error(`Duplicate screen path! ${screenPath}`);

    const screenClone = { ...screen };

    screenMap.set(screenPath, screenClone);

    // Preserve original id as title if a title was not provided
    if (!screenClone.title && screenClone.title !== '')
      screenClone.title = screenClone.id;

    // Overwrite the existing id with the full path
    screenClone.id = screenPath;

    addSubscreensToMap(screenMap, screenPath, screenClone.subscreens);
  });

  return screenMap;
}

/**
 * Transforms saved app data into a format we can use in the app.
 *
 * Primarily maps subscreens into their own screens
 *
 * @param appData the serialized app data to transform
 * @returns app data to use in the app
 */
function deserializeAppData(appData: SerializedAppData): AppData {
  const deserializedAppData = {
    ...appData,
    initialScreen: pathJoin(ROOT_PATH, appData.initialScreen),
    screens: addSubscreensToMap(new Map<string, ScreenData>(), ROOT_PATH, [
      ...appData.screens.map(expandScreenContents),
      licensesScreen,
    ]),
  };

  // If we're in development, add a red border around the title screen header
  if (isDev()) {
    const initialScreen = deserializedAppData.screens.get(
      deserializedAppData.initialScreen,
    ) as ContentListScreenData;
    if (initialScreen) {
      const header = initialScreen.contents[0] as HeaderContentData;
      header.style = {
        borderColor: '#FF0000',
        borderWidth: 5,
        ...(header.style as ViewStyle),
      };
    }
  }

  return deserializedAppData;
}

const appScreens = deserializeAppData(serializedAppDataNew);

export const getAppScreens = () => appScreens;

/**
 * Get the information a screen needs to display
 * @param path The screen path to get (aka screen id)
 * @returns Screen information
 */
export const getScreenData = (path: string): ScreenData =>
  appScreens.screens.get(path) || ({ id: 'NOT_FOUND' } as ScreenData);

function forEachContentOfContents(
  contents: ContentData[],
  callback: (content: ContentData) => void,
) {
  if (!contents) return;

  contents.forEach(content => {
    if (!content) return;

    callback(content);
    if ((content as ContentListData).contents)
      forEachContentOfContents((content as ContentListData).contents, callback);
  });
}

/** Runs a callback on every content in the screens recursively */
export function forEachContent(callback: (content: ContentData) => void) {
  appScreens.screens.forEach(screen => {
    if ((screen as ContentListScreenData).contents)
      forEachContentOfContents(
        (screen as ContentListScreenData).contents,
        callback,
      );
  });
}
