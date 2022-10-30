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
                            text: { text: 'Click Me!' },
                            action: {
                                type: 'toggle',
                                altButtons: [
                                    {
                                        text: { text: 'You Clicked Me!' },
                                    },
                                ],
                            },
                        },
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
