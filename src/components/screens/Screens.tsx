import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HeaderWithButtons, HeaderWithButtonsData } from './HeaderWithButtons';

//----- SCREEN TYPES -----//

/** All available screen components */
export const Screens: {
    [pageType: string]: (props: NativeStackScreenProps<any>) => JSX.Element;
} = {
    HeaderWithButtons,
};

/** Defining data for every screen type. All screen types should extend ScreenDataBase */
export type ScreenData = HeaderWithButtonsData;

/** All screen types available. A screen is a set of components that the Navigation handles */
export type ScreenType = keyof typeof Screens;

/** The base data that every screen must have. All screen types should extend ScreenDataBase */
export interface ScreenDataBase {
    id: string;
    title?: string;
    type: ScreenType;
}

//----- APP TYPES -----//

/** Data that defines the whole app */
export interface AppData {
    /** Version of the AppData object following https://semver.org/ rules */
    version: string;
    initialScreen: string;
    screens: ScreenData[];
}
