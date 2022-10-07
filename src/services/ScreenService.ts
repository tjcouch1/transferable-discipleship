/**
 * ScreenService.ts - Handles getting the page structure
 */

import { AppScreens, ScreenData } from '../components/screens/Screens';

const appScreens: AppScreens = {
    initialScreen: 'Home',
    screens: [
        {
            id: 'Home',
            title: 'TD Home',
            type: 'HeaderWithButtons',
            headerData: {
                headerText: 'Transferable Discipleship',
                subHeaderText:
                    'A tool for simple, reproducible Christian discipleship',
                lineTexts: [
                    {
                        text: 'Please select an option below or swipe from the right anytime if you get lost',
                    },
                ],
            },
            buttonListData: {
                buttons: [
                    {
                        text: { text: 'Basics' },
                        action: {
                            type: 'navigate',
                            to: 'Basics',
                        },
                    },
                    {
                        text: { text: 'Essentials' },
                        action: {
                            type: 'navigate',
                            to: 'Essentials',
                        },
                    },
                ],
            },
        },
        {
            id: 'Basics',
            type: 'HeaderWithButtons',
            headerData: {
                headerText: 'Basics',
                subHeaderText: 'Here is some stuff to read',
            },
            buttonListData: {
                buttons: [
                    {
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
export const getScreen = (id: string): ScreenData =>
    appScreens.screens.find(screen => screen.id === id) ||
    ({ id: 'NOT_FOUND' } as ScreenData);
