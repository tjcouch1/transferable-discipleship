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
  /** ID that is unique among this screen's siblings */
  id: string;
  /** Text to show on the navigation bar */
  title?: string;
  /** Whether to show the navigation bar. Defaults to true */
  showNavigationBar?: boolean;
  /** Type of Screen */
  type: ScreenType;
  /** Screens that are children of this screen. Can navigate to them with an `ActionButton` */
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
