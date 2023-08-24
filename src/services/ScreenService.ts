/**
 * ScreenService.ts - Handles getting the page structure
 */

import {
  SerializedAppData,
  ScreenData,
  AppData,
  ScreenMap,
} from '../components/screens/Screens';
import { ROOT_PATH, PATH_DELIMITER, pathJoin } from '../util/PathUtil';
import { APP_VERSION } from '../util/Util';

const serializedAppDataNew: SerializedAppData = {
  version: APP_VERSION,
  initialScreen: 'Home',
  screens: [
    {
      id: 'Home',
      title: 'TD Home',
      type: 'ContentListScreen',
      design: 'loose',
      contents: [
        {
          type: 'Header',
          headerText: 'Transferable Discipleship',
          subheaderText:
            'A tool for simple, reproducible Christian discipleship',
          lineTexts: [
            'Please select an option below or swipe from the right anytime if you get lost',
          ],
          design: 'title',
        },
        {
          type: 'ActionButton',
          text: 'Basics',
          action: {
            type: 'navigate',
            to: 'Basics',
          },
        },
        {
          type: 'ActionButton',
          text: 'Essentials',
          action: {
            type: 'navigate',
            to: 'Essentials',
          },
        },
        {
          type: 'ContentList',
          openIndexDefault: 0,
          padTop: false,
          padBottom: false,
          padding: 5,
          contents: [
            'Bare Text!',
            {
              type: 'ToggleButton',
              loop: true,
              text: { text: 'Stuff', design: 'header' },
              altButtons: [{ text: 'Things' }],
            },
            {
              type: 'ScriptureSlide',
              canClose: false,
              scripture: {
                reference: 'Romans 12:1-2',
              },
            },
            {
              type: 'ScriptureSlide',
              headerText: 'What is true of God?',
              isOpenDefault: true,
              scripture: {
                reference: 'Acts 17:24-28',
                revealedButton: {
                  text: 'Creator, Desires to be known',
                },
              },
            },
            {
              type: 'ScriptureSlide',
              headerText: 'What is the nature of man?',
              scripture: [
                {
                  reference: 'Ephesians 2:1-3',
                  revealedButton: {
                    text: 'Dead',
                  },
                },
                {
                  reference: 'Romans 3:23',
                  revealedButton: {
                    text: 'All have sinned',
                  },
                },
                {
                  reference: 'Romans 6:23',
                  revealedButton: {
                    text: 'Deserve death',
                  },
                },
              ],
            },
          ],
        },
      ],
      subscreens: [
        {
          id: 'Basics',
          type: 'ContentListScreen',
          design: 'no-padding',
          controlIsOpen: false,
          contents: [
            {
              type: 'Header',
              headerText: 'Basics',
              subheaderText: 'Here is some basic stuff to read',
            },
            {
              type: 'ScriptureSlide',
              isOpenDefault: true,
              scripture: {
                reference: 'John 11:35',
              },
            },
            {
              type: 'ScriptureSlide',
              canClose: false,
              isOpenDefault: false,
              scripture: {
                reference: 'John 11:36',
              },
            },
            {
              type: 'ButtonList',
              buttons: [
                {
                  type: 'ActionButton',
                  text: 'Gospel Review',
                  action: {
                    type: 'navigate',
                    to: 'GospelReview',
                  },
                },
                {
                  type: 'ActionButton',
                  text: 'Scripture 1.0',
                  action: {
                    type: 'navigate',
                    to: 'Scripture1.0',
                  },
                },
                {
                  type: 'ActionButton',
                  text: 'Assurance of Salvation',
                  action: {
                    type: 'navigate',
                    to: 'AssuranceOfSalvation',
                  },
                },
                {
                  type: 'ActionButton',
                  text: 'Holy Spirit',
                  action: {
                    type: 'navigate',
                    to: 'HolySpirit',
                  },
                },
                {
                  type: 'ActionButton',
                  text: 'Prayer',
                  action: {
                    type: 'navigate',
                    to: 'Prayer',
                  },
                },
              ],
            },
          ],
          subscreens: [
            {
              id: 'GospelReview',
              title: 'Gospel Review',
              type: 'ContentListScreen',
              design: 'loose',
              contents: [
                {
                  type: 'Header',
                  headerText: 'Gospel Review',
                  subheaderText: 'Reviewing the Gospel',
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'What is the relationship between God & man?',
                  },
                  action: {
                    type: 'navigate',
                    to: 'RelGodMan',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: "What is God's plan to restore our relationship?",
                  },
                  action: {
                    type: 'navigate',
                    to: 'RestReln',
                  },
                },
                {
                  type: 'Header',
                  headerText: 'section title',
                  subheaderText: 'stuff here',
                  design: 'section',
                },
                {
                  type: 'ActionButton',
                  text: 'What did Jesus do?',
                  action: {
                    type: 'navigate',
                    to: 'WhatJesusDo',
                  },
                },
                {
                  type: 'ActionButton',
                  text: 'How should I respond?',
                  action: {
                    type: 'navigate',
                    to: 'HowRespond',
                  },
                },
                {
                  type: 'ActionButton',
                  text: 'The whole story',
                  action: {
                    type: 'navigate',
                    to: 'WholeStory',
                  },
                },
              ],
            },
          ],
        },
        {
          id: 'Essentials',
          type: 'HeaderWithButtons',
          headerData: {
            headerText: 'Essentials',
            subheaderText: 'Here is some essential stuff to read',
          },
          buttonListData: {
            buttons: [
              {
                type: 'ActionButton',
                text: 'Home',
                action: {
                  type: 'navigate',
                  to: '..',
                },
              },
            ],
          },
        },
      ],
    },
  ],
};

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
  return {
    ...appData,
    initialScreen: pathJoin(ROOT_PATH, appData.initialScreen),
    screens: addSubscreensToMap(
      new Map<string, ScreenData>(),
      ROOT_PATH,
      appData.screens,
    ),
  };
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
