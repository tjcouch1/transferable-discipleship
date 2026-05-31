/**
 * ThemeService.ts - Manages theme preference storage
 */

import { saveData, loadData } from './StorageService';

const THEME_CATEGORY = 'settings';
const THEME_NAME = 'theme';

export type ThemeMode = 'light' | 'dark';

/**
 * Get the saved theme preference, or return null if not set
 */
export async function getThemePreference(): Promise<ThemeMode | null> {
  const theme = await loadData<ThemeMode>(THEME_CATEGORY, THEME_NAME);
  return theme || null;
}

/**
 * Save the theme preference
 */
export async function setThemePreference(theme: ThemeMode): Promise<boolean> {
  return await saveData(THEME_CATEGORY, THEME_NAME, theme);
}

