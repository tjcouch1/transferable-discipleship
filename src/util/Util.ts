/**
 * Shared utility functions
 */

import { Platform } from 'react-native';

export function isWeb() {
  return Platform.OS === 'web';
}

/**
 * Transforms the string into its superscript unicode equivalent. Currently only works with 0-9.
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
