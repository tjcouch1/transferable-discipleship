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
      ...appData.screens,
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
