/**
 * ThemeContext.tsx - Provides theme state and actions
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeMode, getThemePreference, setThemePreference } from '../services/ThemeService';
import { getTheme, Colors } from '../Theme';

interface ThemeContextType {
  themeMode: ThemeMode;
  isDarkMode: boolean;
  theme: Colors;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');

  // Load theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await getThemePreference();
      if (savedTheme) {
        setThemeModeState(savedTheme);
      } else {
        // Default to system preference if no saved preference
        setThemeModeState(systemColorScheme === 'dark' ? 'dark' : 'light');
      }
    };
    loadTheme();
  }, [systemColorScheme]);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    await setThemePreference(mode);
    setThemeModeState(mode);
  }, []);

  const toggleTheme = useCallback(async () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    await setThemeMode(newMode);
  }, [themeMode, setThemeMode]);

  const isDarkMode = themeMode === 'dark';
  const theme = getTheme(themeMode);

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        isDarkMode,
        theme,
        setThemeMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Hook to get current theme colors
 * Use this in components that need to access theme colors dynamically
 */
export const useThemeColors = (): Colors => {
  const { theme } = useTheme();
  return theme;
};

