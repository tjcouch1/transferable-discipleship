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

const serializedAppData: SerializedAppData = {
  version: '0.0.0',
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
              reference: 'Romans 12:1-2',
            },
            {
              type: 'ScriptureSlide',
              headerText: 'What is true of God?',
              reference: 'Acts 17:24-28',
              revealedButton: {
                text: 'Creator, Desires to be known',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'Basics',
      type: 'ContentListScreen',
      design: 'no-padding',
      contents: [
        {
          type: 'Header',
          headerText: 'Basics',
          subheaderText: 'Here is some basic stuff to read',
        },
        {
          type: 'ButtonList',
          buttons: [
            {
              type: 'ActionButton',
              text: 'Gospel Review',
              action: {
                type: 'navigate',
                to: 'Basics>GospelReview',
              },
            },
            {
              type: 'ActionButton',
              text: 'Scripture 1.0',
              action: {
                type: 'navigate',
                to: 'Basics>Scripture1.0',
              },
            },
            {
              type: 'ActionButton',
              text: 'Assurance of Salvation',
              action: {
                type: 'navigate',
                to: 'Basics>AssuranceOfSalvation',
              },
            },
            {
              type: 'ActionButton',
              text: 'Holy Spirit',
              action: {
                type: 'navigate',
                to: 'Basics>HolySpirit',
              },
            },
            {
              type: 'ActionButton',
              text: 'Prayer',
              action: {
                type: 'navigate',
                to: 'Basics>Prayer',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'Basics>GospelReview',
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
            to: 'Basics>GospelReview>RelGodMan',
          },
        },
        {
          type: 'ActionButton',
          text: {
            text: "What is God's plan to restore our relationship?",
          },
          action: {
            type: 'navigate',
            to: 'Basics>GospelReview>RestReln',
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
            to: 'Basics>GospelReview>WhatJesusDo',
          },
        },
        {
          type: 'ActionButton',
          text: 'How should I respond?',
          action: {
            type: 'navigate',
            to: 'Basics>GospelReview>HowRespond',
          },
        },
        {
          type: 'ActionButton',
          text: 'The whole story',
          action: {
            type: 'navigate',
            to: 'Basics>GospelReview>WholeStory',
          },
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
              to: 'Home',
            },
          },
        ],
      },
    },
  ],
};

const serializedAppDataNew: SerializedAppData = {
  version: '0.0.0',
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
              reference: 'Romans 12:1-2',
            },
            {
              type: 'ScriptureSlide',
              headerText: 'What is true of God?',
              reference: 'Acts 17:24-28',
              revealedButton: {
                text: 'Creator, Desires to be known',
              },
            },
          ],
        },
      ],
      subscreens: [
        {
          id: 'Basics',
          type: 'ContentListScreen',
          design: 'no-padding',
          contents: [
            {
              type: 'Header',
              headerText: 'Basics',
              subheaderText: 'Here is some basic stuff to read',
            },
            {
              type: 'ButtonList',
              buttons: [
                {
                  type: 'ActionButton',
                  text: 'Gospel Review',
                  action: {
                    type: 'navigate',
                    to: 'Basics>GospelReview',
                  },
                },
                {
                  type: 'ActionButton',
                  text: 'Scripture 1.0',
                  action: {
                    type: 'navigate',
                    to: 'Basics>Scripture1.0',
                  },
                },
                {
                  type: 'ActionButton',
                  text: 'Assurance of Salvation',
                  action: {
                    type: 'navigate',
                    to: 'Basics>AssuranceOfSalvation',
                  },
                },
                {
                  type: 'ActionButton',
                  text: 'Holy Spirit',
                  action: {
                    type: 'navigate',
                    to: 'Basics>HolySpirit',
                  },
                },
                {
                  type: 'ActionButton',
                  text: 'Prayer',
                  action: {
                    type: 'navigate',
                    to: 'Basics>Prayer',
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
                    to: 'Basics>GospelReview>RelGodMan',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: "What is God's plan to restore our relationship?",
                  },
                  action: {
                    type: 'navigate',
                    to: 'Basics>GospelReview>RestReln',
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
                    to: 'Basics>GospelReview>WhatJesusDo',
                  },
                },
                {
                  type: 'ActionButton',
                  text: 'How should I respond?',
                  action: {
                    type: 'navigate',
                    to: 'Basics>GospelReview>HowRespond',
                  },
                },
                {
                  type: 'ActionButton',
                  text: 'The whole story',
                  action: {
                    type: 'navigate',
                    to: 'Basics>GospelReview>WholeStory',
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
                  to: 'Home',
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

    screenMap.set(screenPath, screen);

    addSubscreensToMap(screenMap, screenPath, screen.subscreens);
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
    screens: addSubscreensToMap(
      new Map<string, ScreenData>(),
      ROOT_PATH,
      appData.screens,
    ),
  };
}

const appScreens = deserializeAppData(serializedAppDataNew);
console.log('serializedAppData', serializedAppData)
console.log('appScreens', appScreens);

export const getAppScreens = () => serializedAppData;

/**
 * Get the information a screen needs to display
 * @param id The screen id to get
 * @returns Screen information
 */
export const getScreenData = (id: string): ScreenData =>
  serializedAppData.screens.find(screen => screen.id === id) ||
  ({ id: 'NOT_FOUND' } as ScreenData);
