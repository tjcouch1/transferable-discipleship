import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { DarkModeToggle } from '../src/components/contents/DarkModeToggle';
import { Contents } from '../src/components/contents/Contents';

jest.mock('../src/services/ThemeService', () => ({
  getThemePreference: jest.fn().mockResolvedValue(undefined),
  setThemePreference: jest.fn().mockResolvedValue(true),
}));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const themeService = require('../src/services/ThemeService');

it('is registered as a content type', () => {
  expect(Contents.DarkModeToggle).toBe(DarkModeToggle);
});

it('toggles and persists the theme', async () => {
  await render(
    <ThemeProvider>
      <DarkModeToggle />
    </ThemeProvider>,
  );
  const toggle = screen.getByRole('switch');
  expect(toggle.props.value).toBe(false);

  await fireEvent(toggle, 'valueChange', true);
  expect(themeService.setThemePreference).toHaveBeenCalledWith('dark');
  expect(screen.getByRole('switch').props.value).toBe(true);
});
