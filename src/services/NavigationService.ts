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
 * NavigationService.ts - Helper functions for navigation between screens
 */

import { getScreenData } from './ScreenService';
import { PATH_DELIMITER, pathJoin } from '../util/PathUtil';

/**
 * Get the next sibling screen path for a given screen path
 * Returns null if there is no next sibling
 */
export function getNextSiblingScreenPath(currentScreenPath: string): string | null {
  const pathParts = currentScreenPath.split(PATH_DELIMITER).filter(p => p && p !== 'app:');
  
  // If at root level or only one level deep, no next sibling
  if (pathParts.length <= 1) {
    return null;
  }
  
  // Get parent path and current screen ID (last segment)
  const parentPathParts = pathParts.slice(0, -1);
  const parentPath = 'app:' + PATH_DELIMITER + parentPathParts.join(PATH_DELIMITER);
  const currentScreenId = pathParts[pathParts.length - 1];
  
  // Get parent screen data
  const parentScreen = getScreenData(parentPath);
  if (!parentScreen || !parentScreen.subscreens) {
    return null;
  }
  
  // Find current screen index in parent's subscreens
  // Note: subscreens array still has original IDs (not full paths)
  // because the clone's subscreens is a reference to the original array
  const currentIndex = parentScreen.subscreens.findIndex(
    subscreen => {
      // Compare by original ID (subscreen.id should be the original ID)
      // or by full path if it's been processed
      return subscreen.id === currentScreenId || subscreen.id === currentScreenPath;
    }
  );
  
  // If not found or is last screen, return null
  if (currentIndex === -1 || currentIndex === parentScreen.subscreens.length - 1) {
    return null;
  }
  
  // Get next sibling
  const nextSibling = parentScreen.subscreens[currentIndex + 1];
  if (!nextSibling) {
    return null;
  }
  
  // Build full path to next sibling
  // If nextSibling.id is already a full path, use it; otherwise join with parent path
  const nextScreenPath = nextSibling.id.includes(PATH_DELIMITER) && nextSibling.id.startsWith('app:')
    ? nextSibling.id
    : pathJoin(parentPath, nextSibling.id);
  
  return nextScreenPath;
}

/**
 * Get the previous sibling screen path for a given screen path
 * Returns null if there is no previous sibling
 */
export function getPreviousSiblingScreenPath(currentScreenPath: string): string | null {
  const pathParts = currentScreenPath.split(PATH_DELIMITER).filter(p => p && p !== 'app:');
  
  // If at root level or only one level deep, no previous sibling
  if (pathParts.length <= 1) {
    return null;
  }
  
  // Get parent path and current screen ID (last segment)
  const parentPathParts = pathParts.slice(0, -1);
  const parentPath = 'app:' + PATH_DELIMITER + parentPathParts.join(PATH_DELIMITER);
  const currentScreenId = pathParts[pathParts.length - 1];
  
  // Get parent screen data
  const parentScreen = getScreenData(parentPath);
  if (!parentScreen || !parentScreen.subscreens) {
    return null;
  }
  
  // Find current screen index in parent's subscreens
  // Note: subscreens array still has original IDs (not full paths)
  const currentIndex = parentScreen.subscreens.findIndex(
    subscreen => {
      // Compare by original ID (subscreen.id should be the original ID)
      // or by full path if it's been processed
      return subscreen.id === currentScreenId || subscreen.id === currentScreenPath;
    }
  );
  
  // If not found or is first screen, return null
  if (currentIndex <= 0) {
    return null;
  }
  
  // Get previous sibling
  const previousSibling = parentScreen.subscreens[currentIndex - 1];
  if (!previousSibling) {
    return null;
  }
  
  // Build full path to previous sibling
  // If previousSibling.id is already a full path, use it; otherwise join with parent path
  const previousScreenPath = previousSibling.id.includes(PATH_DELIMITER) && previousSibling.id.startsWith('app:')
    ? previousSibling.id
    : pathJoin(parentPath, previousSibling.id);
  
  return previousScreenPath;
}

