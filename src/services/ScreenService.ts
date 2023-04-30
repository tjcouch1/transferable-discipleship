/**
 * ScreenService.ts - Handles getting the page structure
 */

import { AppData, ScreenData } from '../components/screens/Screens';

const appScreens: AppData = {
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

export const getAppScreens = () => appScreens;

/**
 * Get the information a screen needs to display
 * @param id The screen id to get
 * @returns Screen information
 */
export const getScreenData = (id: string): ScreenData =>
  appScreens.screens.find(screen => screen.id === id) ||
  ({ id: 'NOT_FOUND' } as ScreenData);
