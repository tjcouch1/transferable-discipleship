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

/**
 * Shared utility functions
 */

import Constants from 'expo-constants';
import { Platform } from 'react-native';

export const APP_VERSION = '0.0.0';

export function isWeb() {
  return Platform.OS === 'web';
}

/** Returns true if running in expo go (or toggled on/off since then) */
export function isDev() {
  // Constants.debugMode is true only on web in expo go
  // Constants.expoGoConfig is populated in expo go on any device but null in builds
  // Constants.executionEnvironment is 'bare' on web in expo go and when built preview
  //  but 'storeClient' when on android in expo go
  return !!Constants.expoGoConfig;
}

/**
 * Transforms the string into its superscript unicode equivalent. Currently only works with 0-9.
 *
 * Thanks for the idea to sinewave440hz at https://stackoverflow.com/a/45832410
 * Thanks to https://en.wikipedia.org/wiki/Unicode_subscripts_and_superscripts for the unicodes
 */
export function sup(str: string) {
  return str
    .replace(/0/g, '\u2070')
    .replace(/1/g, '\u00B9')
    .replace(/2/g, '\u00B2')
    .replace(/3/g, '\u00B3')
    .replace(/4/g, '\u2074')
    .replace(/5/g, '\u2075')
    .replace(/6/g, '\u2076')
    .replace(/7/g, '\u2077')
    .replace(/8/g, '\u2078')
    .replace(/9/g, '\u2079');
}

/**
 * Determine whether the object is a string
 * @param o object to determine if it is a string
 * @returns true if the object is a string; false otherwise
 *
 * Thanks to DRAX at https://stackoverflow.com/a/9436948
 */
export function isString(o: unknown): o is string {
  return typeof o === 'string' || o instanceof String;
}
