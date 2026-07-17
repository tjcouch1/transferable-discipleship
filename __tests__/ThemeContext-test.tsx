import React from 'react';
import { Text } from 'react-native';
import { render, screen, userEvent } from '@testing-library/react-native';
import { ThemeProvider, useTheme } from '../src/contexts/ThemeContext';
import { themes } from '../src/Theme';

jest.mock('../src/services/ThemeService', () => ({
  getThemePreference: jest.fn().mockResolvedValue(undefined),
  setThemePreference: jest.fn().mockResolvedValue(true),
}));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const themeService = require('../src/services/ThemeService');

const Probe = () => {
  const { theme, isDark, setMode } = useTheme();
  return (
    <Text
      onPress={() => setMode(isDark ? 'light' : 'dark')}>{`${isDark}:${theme.app.background}`}</Text>
  );
};

it('defaults to light and switches to dark, persisting the choice', async () => {
  await render(
    <ThemeProvider>
      <Probe />
    </ThemeProvider>,
  );
  expect(screen.getByText(`false:${themes.light.app.background}`)).toBeTruthy();

  const user = userEvent.setup();
  await user.press(screen.getByText(`false:${themes.light.app.background}`));
  expect(screen.getByText(`true:${themes.dark.app.background}`)).toBeTruthy();
  expect(themeService.setThemePreference).toHaveBeenCalledWith('dark');
});

it('applies a saved preference on mount', async () => {
  themeService.getThemePreference.mockResolvedValueOnce('dark');
  await render(
    <ThemeProvider>
      <Probe />
    </ThemeProvider>,
  );
  expect(
    await screen.findByText(`true:${themes.dark.app.background}`),
  ).toBeTruthy();
});
