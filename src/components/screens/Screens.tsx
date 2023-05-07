import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HeaderWithButtons, HeaderWithButtonsData } from './HeaderWithButtons';
import { ContentListScreen, ContentListScreenData } from './ContentListScreen';

//----- SCREEN TYPES -----//

/** All available screen components */
export const Screens: {
  [pageType: string]: (props: NativeStackScreenProps<any>) => JSX.Element;
} = {
  HeaderWithButtons,
  ContentListScreen,
};

/** Defining data for every screen type. All screen types should extend ScreenDataBase */
export type ScreenData = HeaderWithButtonsData | ContentListScreenData;

/** All screen types available. A screen is a set of components that the Navigation handles */
export type ScreenType = keyof typeof Screens;

/** The base data that every screen must have. All screen types should extend ScreenDataBase */
export interface ScreenDataBase {
  id: string;
  title?: string;
  type: ScreenType;
  subscreens?: ScreenData[];
}

//----- APP TYPES -----//

/** Map of screen path to screen data at that path */
export type ScreenMap = Map<string, ScreenData>;

/**
 * Saved data that defines the whole app.
 * Gets transformed into AppData on load.
 */
export interface SerializedAppData {
  /** Version of the AppData object following https://semver.org/ rules */
  version: string;
  initialScreen: string;
  screens: ScreenData[];
}

/**
 * Data that defines the whole app.
 * Transformed from SerializedAppData for use in the app.
 */
export interface AppData extends Omit<SerializedAppData, 'screens'> {
  screens: ScreenMap;
}
