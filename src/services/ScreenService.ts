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
      type: 'ContentList',
      contents: [
        {
          type: 'Header',
          headerText: { text: 'Transferable Discipleship' },
          subheaderText: {
            text: 'A tool for simple, reproducible Christian discipleship',
          },
          lineTexts: [
            {
              text: 'Please select an option below or swipe from the right anytime if you get lost',
            },
          ],
          design: 'title',
        },
        {
          type: 'ButtonList',
          buttons: [
            {
              type: 'ActionButton',
              text: { text: 'Basics' },
              action: {
                type: 'navigate',
                to: 'Basics',
              },
            },
            {
              type: 'ActionButton',
              text: { text: 'Essentials' },
              action: {
                type: 'navigate',
                to: 'Essentials',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'Basics',
      type: 'ContentList',
      contents: [
        {
          type: 'Header',
          headerText: { text: 'Basics' },
          subheaderText: { text: 'Here is some basic stuff to read' },
        },
        {
          type: 'ButtonList',
          buttons: [
            {
              type: 'ActionButton',
              text: { text: 'Gospel Review' },
              action: {
                type: 'navigate',
                to: 'Basics>GospelReview',
              },
            },
            {
              type: 'ActionButton',
              text: { text: 'Scripture 1.0' },
              action: {
                type: 'navigate',
                to: 'Basics>Scripture1.0',
              },
            },
            {
              type: 'ActionButton',
              text: { text: 'Assurance of Salvation' },
              action: {
                type: 'navigate',
                to: 'Basics>AssuranceOfSalvation',
              },
            },
            {
              type: 'ActionButton',
              text: { text: 'Holy Spirit' },
              action: {
                type: 'navigate',
                to: 'Basics>HolySpirit',
              },
            },
            {
              type: 'ActionButton',
              text: { text: 'Prayer' },
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
      type: 'ContentList',
      contents: [
        {
          type: 'Header',
          headerText: { text: 'Gospel Review' },
          subheaderText: { text: 'Reviewing the Gospel' },
        },
        {
          type: 'ButtonList',
          buttons: [
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
              type: 'ActionButton',
              text: { text: 'What did Jesus do?' },
              action: {
                type: 'navigate',
                to: 'Basics>GospelReview>WhatJesusDo',
              },
            },
            {
              type: 'ActionButton',
              text: { text: 'How should I respond?' },
              action: {
                type: 'navigate',
                to: 'Basics>GospelReview>HowRespond',
              },
            },
            {
              type: 'ActionButton',
              text: { text: 'The whole story' },
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
        headerText: { text: 'Essentials' },
        subheaderText: { text: 'Here is some essential stuff to read' },
      },
      buttonListData: {
        buttons: [
          {
            type: 'ActionButton',
            text: { text: 'Home' },
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
