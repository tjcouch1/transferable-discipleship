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
 * ProgressService.ts - Handles tracking reading progress through screens
 */

import { saveData, loadData } from './StorageService';
import { getAppScreens, getScreenData } from './ScreenService';
import { PATH_DELIMITER, pathJoin } from '../util/PathUtil';

const PROGRESS_CATEGORY = 'progress';
const PROGRESS_NAME = 'screens';

export type ScreenProgress = {
  screenPath: string;
  visitedAt: number; // timestamp of first visit
  lastVisitedAt: number; // timestamp of most recent visit
  visitCount: number;
  completed: boolean; // whether all subscreens/content has been completed
};

export type ProgressData = {
  [screenPath: string]: ScreenProgress;
};

/**
 * Get all direct child screen paths for a given screen
 */
export function getChildScreenPaths(parentPath: string): string[] {
  const screenData = getScreenData(parentPath);
  if (!screenData || !screenData.subscreens) {
    return [];
  }
  
  return screenData.subscreens.map(subscreen => 
    pathJoin(parentPath, subscreen.id)
  );
}

/**
 * Calculate completion percentage for a screen based on visited child screens
 */
export async function getScreenCompletionPercentage(screenPath: string): Promise<number> {
  const childPaths = getChildScreenPaths(screenPath);
  
  // If no children, return 100% if visited, 0% if not
  if (childPaths.length === 0) {
    const progress = await getScreenProgress(screenPath);
    return progress !== null ? 100 : 0;
  }
  
  // Calculate percentage based on how many children have been visited
  const progress = await getProgress();
  const visitedCount = childPaths.filter(childPath => {
    return progress[childPath] !== undefined;
  }).length;
  
  return Math.round((visitedCount / childPaths.length) * 100);
}

/**
 * Check if a screen is completed (all child screens have been visited)
 */
export async function checkScreenCompletion(screenPath: string): Promise<boolean> {
  const childPaths = getChildScreenPaths(screenPath);
  
  // If no children, screen is completed when visited
  if (childPaths.length === 0) {
    const progress = await getScreenProgress(screenPath);
    return progress !== null;
  }
  
  // Check if all child screens have been visited
  const progress = await getProgress();
  const allChildrenVisited = childPaths.every(childPath => {
    return progress[childPath] !== undefined;
  });
  
  return allChildrenVisited;
}

/**
 * Get all progress data
 */
export async function getProgress(): Promise<ProgressData> {
  const progress = await loadData<ProgressData>(PROGRESS_CATEGORY, PROGRESS_NAME);
  return progress || {};
}

/**
 * Get progress for a specific screen
 */
export async function getScreenProgress(screenPath: string): Promise<ScreenProgress | null> {
  const progress = await getProgress();
  return progress[screenPath] || null;
}

/**
 * Mark a screen as visited (with progress tracking)
 * Also checks and updates completion status for parent screens
 */
export async function markScreenProgress(screenPath: string): Promise<boolean> {
  const progress = await getProgress();
  const now = Date.now();
  const childPaths = getChildScreenPaths(screenPath);
  
  // Determine if this screen is completed:
  // - If no children (leaf screen), completed when visited
  // - If has children, completed when all children have been visited
  const isLeafScreen = childPaths.length === 0;
  const allChildrenVisited = childPaths.length > 0 && childPaths.every(childPath => {
    return progress[childPath] !== undefined;
  });
  const completed = isLeafScreen || allChildrenVisited;
  
  const existingProgress = progress[screenPath];
  if (existingProgress) {
    // Update existing progress
    progress[screenPath] = {
      ...existingProgress,
      lastVisitedAt: now,
      visitCount: existingProgress.visitCount + 1,
      completed,
    };
  } else {
    // Create new progress entry
    progress[screenPath] = {
      screenPath,
      visitedAt: now,
      lastVisitedAt: now,
      visitCount: 1,
      completed,
    };
  }
  
  const saved = await saveData(PROGRESS_CATEGORY, PROGRESS_NAME, progress);
  
  // After marking progress, check if parent screens should be marked as completed
  if (saved) {
    await updateParentCompletions(screenPath);
  }
  
  return saved;
}

/**
 * Update completion status for parent screens recursively
 */
async function updateParentCompletions(screenPath: string): Promise<void> {
  const progress = await getProgress();
  
  // Find parent path
  const pathParts = screenPath.split(PATH_DELIMITER);
  if (pathParts.length <= 1) {
    return; // No parent
  }
  
  // Check each parent level
  for (let i = pathParts.length - 1; i > 0; i--) {
    const parentPath = pathParts.slice(0, i).join(PATH_DELIMITER);
    const parentProgress = progress[parentPath];
    
    if (parentProgress) {
      const isCompleted = await checkScreenCompletion(parentPath);
      if (parentProgress.completed !== isCompleted) {
        progress[parentPath] = {
          ...parentProgress,
          completed: isCompleted,
        };
        await saveData(PROGRESS_CATEGORY, PROGRESS_NAME, progress);
      }
    }
  }
}

/**
 * Clear all progress
 */
export async function clearProgress(): Promise<boolean> {
  return await saveData(PROGRESS_CATEGORY, PROGRESS_NAME, {});
}

