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

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { pathJoin } from './PathUtil';
import { openURL } from 'expo-linking';
import { isWeb } from './Util';
import { shareScreen, shareScripture } from '../services/ShareService';
import { toggleBookmark } from '../services/BookmarkService';
import { markScreenProgress } from '../services/ProgressService';

// Global visited screens tracker
let visitedScreensSet: Set<string> = new Set();
let markVisitedCallback: ((screenPath: string) => void) | null = null;
let resetVisitedCallback: (() => void) | null = null;
let refreshProgressCallback: (() => Promise<void>) | null = null;

export const setVisitedScreensCallback = (callback: (screenPath: string) => void) => {
  markVisitedCallback = callback;
};

export const setResetVisitedScreensCallback = (callback: () => void) => {
  resetVisitedCallback = callback;
};

export const setRefreshProgressCallback = (callback: () => Promise<void>) => {
  refreshProgressCallback = callback;
};

export const markScreenAsVisited = (screenPath: string) => {
  visitedScreensSet.add(screenPath);
  if (markVisitedCallback) {
    markVisitedCallback(screenPath);
  }
};

export const resetVisitedScreens = () => {
  visitedScreensSet.clear();
  if (resetVisitedCallback) {
    resetVisitedCallback();
  }
};

//----- ACTION TYPES -----//

/** The base data for an action to perform. All action types should extend ActionDataBase */
export type ActionDataBase = {
  type: ActionType;
};

/** Generic props passed down that allow access to navigation */
export type PropsWithNavigation<T> = T & {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<any>;
};

/** Mapping from an action type to a function factory for that action given the ActionProps provided */
export const ActionFactory: {
  // Note on PropsWithNavigation<any>: I tried <T extends ActionDataBase> and making this PropsWithNavigation<T>, but TypeScript
  // currently does not narrow generic types according to their use: https://stackoverflow.com/a/67378667
  // All action parameters should be PropsWithNavigation<T extends ActionDataBase>.
  [actionType: string]: (
    action: PropsWithNavigation<any>,
  ) => (params: any) => void;
} = {
  navigate:
    ({ to, navigation, route }: PropsWithNavigation<NavigateActionData>) =>
      async () => {
        const targetPath = pathJoin(route.name, to);
        markScreenAsVisited(targetPath);
        // Track progress and refresh context
        try {
          await markScreenProgress(targetPath);
          if (refreshProgressCallback) {
            await refreshProgressCallback();
          }
        } catch (err) {
          console.error('Failed to mark screen progress:', err);
        }
        navigation.navigate(targetPath);
      },
  link:
    ({ to }: PropsWithNavigation<LinkActionData>) =>
      async () => {
        if (to) {
          // Fix the discipleship%2Dapp%2Dtemplate link that is encoded to prevent accidental replacement when customizing the template
          const toUrl = to?.includes('discipleship%2Dapp%2Dtemplate')
            ? to.replace(/%2D/g, '-')
            : to;
          if (isWeb()) window.open(toUrl, '_blank');
          else openURL(toUrl);
        }
      },
  share:
    ({ shareType, target, title, includeText, route }: PropsWithNavigation<ShareActionData>) =>
      async () => {
        if (shareType === 'screen' && target) {
          await shareScreen(target, title);
        } else if (shareType === 'scripture' && target) {
          await shareScripture(target, includeText ?? true);
        } else if (shareType === 'currentScreen') {
          // Share the current screen - route.name is already the full screen path
          const screenPath = target || route.name;
          await shareScreen(screenPath, title);
        }
      },
  resetVisited:
    () =>
      () => {
        resetVisitedScreens();
      },
  bookmark:
    ({ screenPath, route }: PropsWithNavigation<BookmarkActionData>) =>
      async () => {
        const targetPath = screenPath || route.name;
        await toggleBookmark(targetPath);
        // Trigger bookmark state update by reloading if needed
        // This will be handled by BookmarksContext
      },
};

/** All available action types. An action is a function that does something based on the data that defines it */
export type ActionType = keyof typeof ActionFactory;

/** The data that defines an action that navigates to the specified screen */
export type NavigateActionData = {
  type: 'navigate';
  to: string;
} & ActionDataBase;

/** The data that defines an action to open a link */
export type LinkActionData = {
  type: 'link';
  to: string;
} & ActionDataBase;

/** The data that defines an action to share content */
export type ShareActionData = {
  type: 'share';
  shareType: 'screen' | 'scripture' | 'currentScreen';
  /** Target to share (screen path or scripture reference). For 'currentScreen', this can be empty to use current route */
  target?: string;
  /** Optional title for the share dialog */
  title?: string;
  /** For scripture sharing, whether to include the text (default: true) */
  includeText?: boolean;
} & ActionDataBase;

/** The data that defines an action to reset visited screens */
export type ResetVisitedActionData = {
  type: 'resetVisited';
} & ActionDataBase;

/** The data that defines an action to bookmark/unbookmark a screen */
export type BookmarkActionData = {
  type: 'bookmark';
  /** Screen path to bookmark. If not provided, uses current route */
  screenPath?: string;
} & ActionDataBase;

/** Defining data for every action type. All action types should extend ActionDataBase  */
export type ActionData = NavigateActionData | LinkActionData | ShareActionData | ResetVisitedActionData | BookmarkActionData;
