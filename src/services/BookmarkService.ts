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
 * BookmarkService.ts - Handles bookmarking screens and scripture references
 */

import { saveData, loadData } from './StorageService';
import { getScreenData } from './ScreenService';

const BOOKMARKS_CATEGORY = 'bookmarks';
const BOOKMARKS_NAME = 'screens';

export type Bookmark = {
  screenPath: string;
  title: string;
  bookmarkedAt: number; // timestamp
};

/**
 * Get all bookmarked screens
 */
export async function getBookmarks(): Promise<Bookmark[]> {
  const bookmarks = await loadData<Bookmark[]>(BOOKMARKS_CATEGORY, BOOKMARKS_NAME);
  return bookmarks || [];
}

/**
 * Check if a screen is bookmarked
 */
export async function isBookmarked(screenPath: string): Promise<boolean> {
  const bookmarks = await getBookmarks();
  return bookmarks.some(b => b.screenPath === screenPath);
}

/**
 * Add a bookmark for a screen
 */
export async function addBookmark(screenPath: string): Promise<boolean> {
  const bookmarks = await getBookmarks();
  
  // Check if already bookmarked
  if (bookmarks.some(b => b.screenPath === screenPath)) {
    return true; // Already bookmarked
  }

  // Get screen title
  const screenData = getScreenData(screenPath);
  const title = screenData.title || screenPath;

  const newBookmark: Bookmark = {
    screenPath,
    title,
    bookmarkedAt: Date.now(),
  };

  const updatedBookmarks = [...bookmarks, newBookmark];
  return await saveData(BOOKMARKS_CATEGORY, BOOKMARKS_NAME, updatedBookmarks);
}

/**
 * Remove a bookmark for a screen
 */
export async function removeBookmark(screenPath: string): Promise<boolean> {
  const bookmarks = await getBookmarks();
  const updatedBookmarks = bookmarks.filter(b => b.screenPath !== screenPath);
  return await saveData(BOOKMARKS_CATEGORY, BOOKMARKS_NAME, updatedBookmarks);
}

/**
 * Toggle bookmark for a screen
 */
export async function toggleBookmark(screenPath: string): Promise<boolean> {
  const isBooked = await isBookmarked(screenPath);
  if (isBooked) {
    return await removeBookmark(screenPath);
  } else {
    return await addBookmark(screenPath);
  }
}

