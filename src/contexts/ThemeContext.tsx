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

import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import { Colors, ThemeMode, getTheme } from '../Theme';
import {
  getThemePreference,
  setThemePreference,
} from '../services/ThemeService';

type ThemeContextValue = {
  /** The active color palette */
  theme: Colors;
  mode: ThemeMode;
  isDark: boolean;
  /** Change the theme and persist the choice */
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Provides the active theme. Starts from the OS color scheme; a saved user
 * preference (set via setMode) overrides it.
 */
export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const osScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>(
    osScheme === 'dark' ? 'dark' : 'light',
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const saved = await getThemePreference();
      if (saved && !cancelled) setModeState(saved);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: getTheme(mode),
      mode,
      isDark: mode === 'dark',
      setMode: (newMode: ThemeMode) => {
        setModeState(newMode);
        // Fire-and-forget persistence; failures only affect the next launch
        setThemePreference(newMode);
      },
    }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

/** Get the active theme. Must be used under ThemeProvider. */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
