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
 * ShareService.ts - Handles sharing content, screens, and scripture references
 */

import { Share } from 'react-native';
import * as Linking from 'expo-linking';
import { isWeb } from '../util/Util';
import { ROOT_PATH, PATH_DELIMITER } from '../util/PathUtil';
import { getScreenData } from './ScreenService';
import { getScripture, ScriptureVerseRangeContent } from './ScriptureService';

const APP_NAME = 'Transferable Discipleship';
const WEB_BASE_URL = 'https://tjcouch1.github.io/transferable-discipleship/app';

/**
 * Get a deep link URL for a screen path
 */
export function getScreenDeepLink(screenPath: string): string {
  // Remove the ROOT_PATH prefix if present
  const pathWithoutRoot = screenPath.startsWith(ROOT_PATH)
    ? screenPath.substring(ROOT_PATH.length + PATH_DELIMITER.length)
    : screenPath;

  if (isWeb()) {
    return `${WEB_BASE_URL}/#/${pathWithoutRoot}`;
  } else {
    // Use expo-linking to create a deep link
    // Linking.createURL creates a URL with the app's scheme
    return Linking.createURL(pathWithoutRoot);
  }
}

/**
 * Get shareable text for a screen
 */
export function getScreenShareText(screenPath: string, title?: string): string {
  const screenData = getScreenData(screenPath);
  const screenTitle = title || screenData.title || screenPath;
  const deepLink = getScreenDeepLink(screenPath);
  
  return `${screenTitle}\n\n${deepLink}\n\nShared from ${APP_NAME}`;
}

/**
 * Get shareable text for a scripture reference
 */
export async function getScriptureShareText(
  reference: string,
  includeText = true,
): Promise<string> {
  let shareText = reference;
  
  if (includeText) {
    try {
      const scripture = await getScripture(reference);
      const versesText = scripture.verses
        .map(v => `${v.verse} ${v.text.trim()}`)
        .join('\n');
      shareText = `${reference}\n\n${versesText}\n\n— ${scripture.resourceInfo.name}`;
    } catch (error) {
      // If we can't fetch the scripture, just share the reference
      console.warn(`Could not fetch scripture for sharing: ${reference}`, error);
    }
  }
  
  const deepLink = getScriptureDeepLink(reference);
  return `${shareText}\n\n${deepLink}\n\nShared from ${APP_NAME}`;
}

/**
 * Get a deep link URL for a scripture reference
 */
export function getScriptureDeepLink(reference: string): string {
  // Encode the reference for URL
  const encodedReference = encodeURIComponent(reference);
  
  if (isWeb()) {
    return `${WEB_BASE_URL}/#/scripture/${encodedReference}`;
  } else {
    // Use expo-linking to create a deep link
    return Linking.createURL(`scripture/${encodedReference}`);
  }
}

/**
 * Share content using the native share dialog
 */
export async function shareContent(
  message: string,
  title?: string,
): Promise<boolean> {
  try {
    if (isWeb()) {
      // Use Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: title || APP_NAME,
          text: message,
        });
        return true;
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(message);
        alert('Content copied to clipboard!');
        return true;
      }
    } else {
      // Use React Native Share
      const result = await Share.share({
        message,
        title: title || APP_NAME,
      });
      
      // Share.share returns { action: Share.sharedAction } on success
      // or { action: Share.dismissedAction } if dismissed
      return result.action === Share.sharedAction;
    }
  } catch (error: any) {
    // User cancelled or error occurred
    if (error.message !== 'User did not share') {
      console.error('Error sharing content:', error);
    }
    return false;
  }
}

/**
 * Share a screen
 */
export async function shareScreen(
  screenPath: string,
  title?: string,
): Promise<boolean> {
  const shareText = getScreenShareText(screenPath, title);
  const screenData = getScreenData(screenPath);
  const shareTitle = title || screenData.title || 'Screen';
  
  return shareContent(shareText, shareTitle);
}

/**
 * Share a scripture reference
 */
export async function shareScripture(
  reference: string,
  includeText = true,
): Promise<boolean> {
  const shareText = await getScriptureShareText(reference, includeText);
  return shareContent(shareText, reference);
}

