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

import { ThemeMode } from '../Theme';
import { loadData, saveData } from './StorageService';

const CATEGORY = 'settings';
const NAME = 'theme';
// Fixed version so the preference survives app updates (not keyed to APP_VERSION)
const VERSION = '1';

/** Get the user's saved theme preference, or undefined if they never set one */
export async function getThemePreference(): Promise<ThemeMode | undefined> {
  // Default load walks backup locations (cache -> document -> bundle) on native
  const mode = await loadData<ThemeMode>(CATEGORY, NAME, VERSION);
  return mode === 'light' || mode === 'dark' ? mode : undefined;
}

/** Save the user's theme preference */
export async function setThemePreference(mode: ThemeMode): Promise<boolean> {
  return saveData(CATEGORY, NAME, mode, VERSION);
}
