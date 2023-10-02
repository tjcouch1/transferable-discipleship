/**
 * ScreenService.ts - Handles getting the page structure
 */

import { ContentListData } from '../components/contents/ContentList';
import { ContentData } from '../components/contents/Contents';
import { ContentListScreenData } from '../components/screens/ContentListScreen';
import {
  SerializedAppData,
  ScreenData,
  AppData,
  ScreenMap,
} from '../components/screens/Screens';
import { ROOT_PATH, PATH_DELIMITER, pathJoin } from '../util/PathUtil';
import { APP_VERSION } from '../util/Util';

// const serializedAppDataNew: SerializedAppData = require('../../assets/data/screens.json')
const serializedAppDataNew: SerializedAppData = {
  version: APP_VERSION,
  initialScreen: 'Home',
  screens: [
    {
      id: 'Home',
      title: 'TD Home',
      showNavigationBar: false,
      type: 'ContentListScreen',
      design: 'loose',
      contents: [
        {
          type: 'Header',
          headerText: 'Transferable Discipleship',
          subheaderText:
            'A tool for simple, reproducible Christian discipleship',
          lineTexts: ['Please select an option below'],
          design: 'title',
        },
        {
          type: 'Image',
          image: 'icon',
        },
        {
          type: 'Image',
          image:
            'https://images.unsplash.com/photo-1691689761201-4fe4388438b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
          attribution:
            'Photo by <a href="https://unsplash.com/@gabriellemeschini?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Gabrielle Meschini</a> on <a href="https://unsplash.com/photos/a-man-riding-a-skateboard-down-the-side-of-a-road-RZSKBsaOxVk?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>',
        },
        {
          type: 'Image',
          image:
            'data:image/png;base64,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',
          attribution: 'Converted with https://ezgif.com/image-to-datauri',
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
          type: 'ActionButton',
          text: 'How to',
          action: {
            type: 'navigate',
            to: 'How to',
          },
        },
        {
          type: 'ActionButton',
          text: 'About',
          action: {
            type: 'navigate',
            to: 'About',
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
        {
          id: 'How to',
          type: 'ContentListScreen',
          design: 'tight',
          contents: [
            {
              type: 'Header',
              headerText: 'How to use this app',
              lineTexts: [
                'To grow in your faith, there is no better place to turn than allowing the Bible to work in your heart. Scripture is the foundation for this material.',
              ],
              design: 'screen',
            },
            {
              type: 'Slide',
              canClose: false,
              headerText: 'The format of this material is simple:',
              design: 'tight',
              contents: [
                '1. Read the question.\n2. Read what the Bible says to answer the question.\n3. Discuss each question based on the Scripture given.',
                'After each passage of Scripture, some hints are given to help guide the conversation and give an idea how each verse helps answer the question.',
              ],
            },
          ],
        },
        {
          id: 'About',
          type: 'ContentListScreen',
          design: 'tight',
          contents: [
            {
              type: 'Header',
              headerText: 'About TD',
              lineTexts: [
                'Transferable Discipleship is a tool for simple, reproducible Christian discipleship.',
              ],
              design: 'screen',
            },
            {
              type: 'Slide',
              headerText: 'Feedback?',
              design: 'tight',
              contents: [
                'Found a problem? Want a feature? Other feedback?',
                {
                  type: 'ActionButton',
                  text: 'Let us know',
                  design: 'answer',
                  action: {
                    type: 'link',
                    to: 'https://github.com/tjcouch1/transferable-discipleship/issues',
                  },
                },
              ],
            },
            {
              type: 'Slide',
              headerText: 'Create Your Own Discipleship App',
              design: 'tight',
              contents: [
                'Want to make your own discipleship app like this one?',
                {
                  type: 'ActionButton',
                  design: 'answer',
                  text: 'Fork us on GitHub!',
                  action: {
                    type: 'link',
                    to: 'https://github.com/tjcouch1/transferable-discipleship',
                  },
                },
              ],
            },
            {
              type: 'Slide',
              headerText: 'Credits and Licensing',
              design: 'tight',
              contents: [
                "- Disciple-making content of the app compiled by *Content Creator*.\n- App developed by TJ Couch.\n- Scripture quoted from World English Bible (WEB).\n- Scripture data retrieved and cached from Tim Morgan's bible-api.com",
                {
                  type: 'ActionButton',
                  design: 'answer',
                  text: 'Licensing Info',
                  action: {
                    type: 'navigate',
                    to: 'Licensing',
                  },
                },
              ],
            },
          ],
          subscreens: [
            {
              id: 'Licensing',
              type: 'ContentListScreen',
              design: 'tight',
              contents: [
                {
                  type: 'Header',
                  headerText: 'Licensing Info',
                  design: 'screen',
                },
                {
                  type: 'Slide',
                  headerText: 'Transferable Discipleship',
                  design: 'tight',
                  contents: [
                    'Transferable Discipleship Copyright 2023 TJ Couch.\ntjcouch1@gmail.com\nLicensed under the GPL-3.0-only License.\nMore information on the Software Licenses page linked below.',
                  ],
                },
                {
                  type: 'Slide',
                  headerText: 'World English Bible',
                  design: 'tight',
                  contents: [
                    'The World English Bible is public domain.',
                    {
                      type: 'ActionButton',
                      design: 'answer',
                      text: 'WorldEnglish.Bible',
                      action: {
                        type: 'link',
                        to: 'https://worldenglish.bible/',
                      },
                    },
                  ],
                },
                {
                  type: 'Slide',
                  headerText: 'Fonts',
                  design: 'tight',
                  contents: [
                    '- Libre Franklin is licensed under the SIL Open Font License Version 1.1.',
                    {
                      type: 'ActionButton',
                      design: 'answer',
                      text: 'Libre Franklin GitHub',
                      action: {
                        type: 'link',
                        to: 'https://github.com/impallari/Libre-Franklin',
                      },
                    },
                    '- Open Sauce One is licensed under the SIL Open Font License Version 1.1.',
                    {
                      type: 'ActionButton',
                      design: 'answer',
                      text: 'Open Sauce GitHub',
                      action: {
                        type: 'link',
                        to: 'https://github.com/marcologous/Open-Sauce-Fonts',
                      },
                    },
                  ],
                },
                {
                  type: 'Slide',
                  headerText: 'Software Licenses',
                  design: 'tight',
                  contents: [
                    'This software was created using many amazing libraries including React Native and Expo. Beware there are many licenses to display on the following page. It will take a long time to load.',
                    {
                      type: 'ActionButton',
                      design: 'answer',
                      text: 'Software License Info',
                      action: {
                        type: 'navigate',
                        to: 'app:/__licenses',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

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
  return {
    ...appData,
    initialScreen: pathJoin(ROOT_PATH, appData.initialScreen),
    screens: addSubscreensToMap(
      new Map<string, ScreenData>(),
      ROOT_PATH,
      [...appData.screens, licensesScreen],
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
