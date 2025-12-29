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

import Constants from "expo-constants";
import { Platform } from "react-native";

export const APP_VERSION = "0.0.0";

export function isWeb() {
  return Platform.OS === "web";
}

/** Returns true if running in expo go (or toggled on/off since then) */
export function isDev() {
  // Constants.debugMode is true only on web in expo go
  // Constants.expoGoConfig is populated in expo go on any device but null in preview builds. Populated in production build :(
  // Constants.executionEnvironment is 'bare' on web in expo go and when built preview
  //  but 'storeClient' when on android in expo go
  return !!Constants.debugMode;
}

/**
 * Returns true if this app should use variable font
 *
 * React Native does not support variable fonts. Since the target is React Native,
 * we will ignore the fact that web does support variable fonts for consistency
 *
 * More info at https://github.com/expo/expo/issues/9149
 */
export function supportsVariableFont() {
  return false; // Platform.OS === 'web';
}

/**
 * Transforms the string into its superscript unicode equivalent. Currently only works with 0-9.
 *
 * Thanks for the idea to sinewave440hz at https://stackoverflow.com/a/45832410
 * Thanks to https://en.wikipedia.org/wiki/Unicode_subscripts_and_superscripts for the unicodes
 */
export function sup(str: string) {
  return str
    .replace(/0/g, "\u2070")
    .replace(/1/g, "\u00B9")
    .replace(/2/g, "\u00B2")
    .replace(/3/g, "\u00B3")
    .replace(/4/g, "\u2074")
    .replace(/5/g, "\u2075")
    .replace(/6/g, "\u2076")
    .replace(/7/g, "\u2077")
    .replace(/8/g, "\u2078")
    .replace(/9/g, "\u2079");
}

/**
 * Determine whether the object is a string
 * @param o object to determine if it is a string
 * @returns true if the object is a string; false otherwise
 *
 * Thanks to DRAX at https://stackoverflow.com/a/9436948
 */
export function isString(o: unknown): o is string {
  return typeof o === "string" || o instanceof String;
}

/**
 * If deepClone isn't used when copying properties between objects, you may be left with dangling
 * references between the source and target of property copying operations.
 *
 * @param obj Object to clone
 * @returns Duplicate copy of `obj` without any references back to the original one
 */
export function deepClone<T>(obj: T): T {
  // Assert the return type matches what is expected
  // eslint-disable-next-line no-type-assertion/no-type-assertion
  return JSON.parse(JSON.stringify(obj)) as T;
}

/**
 * Get a function that reduces calls to the function passed in
 *
 * @template T - A function type that takes any arguments and returns void. This is the type of the
 *   function being debounced.
 * @param fn The function to debounce
 * @param delay How much delay in milliseconds after the most recent call to the debounced function
 *   to call the function
 * @returns Function that, when called, only calls the function passed in at maximum every delay ms
 */
// We don't know the parameter types since this function can be anything and can return anything
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<TFunc extends (...args: any[]) => any>(
  fn: TFunc,
  delay = 300
): (...args: Parameters<TFunc>) => Promise<ReturnType<TFunc>> {
  let timeout: ReturnType<typeof setTimeout>;
  let promise: Promise<ReturnType<TFunc>> | undefined;
  let promiseResolve: (
    value: ReturnType<TFunc> | PromiseLike<ReturnType<TFunc>>
  ) => void;
  let promiseReject: (reason?: unknown) => void;

  return (...args) => {
    clearTimeout(timeout);
    if (!promise)
      promise = new Promise((resolve, reject) => {
        promiseResolve = resolve;
        promiseReject = reject;
      });

    timeout = setTimeout(async () => {
      try {
        promiseResolve(await fn(...args));
      } catch (e) {
        promiseReject(e);
      } finally {
        promise = undefined;
      }
    }, delay);

    return promise;
  };
}
