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

import { loadData, saveData } from './StorageService';

const CATEGORY = 'progress';
const NAME = 'screens';

/** Record of visits to one screen */
export type ScreenVisit = {
  firstVisitedAt: number;
  lastVisitedAt: number;
  visitCount: number;
};

/** Visit records keyed by screen path */
export type ProgressMap = { [screenPath: string]: ScreenVisit };

/**
 * Load the persisted progress map. Versioned with the app version (default),
 * so progress starts fresh when the app content changes.
 */
export async function loadProgress(): Promise<ProgressMap> {
  return (await loadData<ProgressMap>(CATEGORY, NAME)) ?? {};
}

/** Persist the progress map */
export async function saveProgress(progress: ProgressMap): Promise<boolean> {
  return saveData(CATEGORY, NAME, progress);
}

/** Get a new progress map with a visit to the screen recorded */
export function withVisit(progress: ProgressMap, screenPath: string): ProgressMap {
  const now = Date.now();
  const existing = progress[screenPath];
  return {
    ...progress,
    [screenPath]: {
      firstVisitedAt: existing?.firstVisitedAt ?? now,
      lastVisitedAt: now,
      visitCount: (existing?.visitCount ?? 0) + 1,
    },
  };
}
