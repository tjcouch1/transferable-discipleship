import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { ActionButton } from '../src/components/contents/buttons/ActionButton';
import { ProgressProvider } from '../src/contexts/ProgressContext';

jest.mock('../src/services/ProgressService', () => {
  const actual = jest.requireActual('../src/services/ProgressService');
  return {
    ...actual,
    loadProgress: jest.fn().mockResolvedValue({}),
    saveProgress: jest.fn().mockResolvedValue(true),
  };
});
// eslint-disable-next-line @typescript-eslint/no-var-requires
const progressService = require('../src/services/ProgressService');

const mockNavigate = jest.fn();
let mockRouteName = 'app:/Home/Basics';
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useRoute: () => ({ name: mockRouteName }),
}));

const VISIT = { firstVisitedAt: 1, lastVisitedAt: 1, visitCount: 1 };

/** Flattened style JSON of the nearest ancestor that carries any style */
function buttonStyleOf(textNode: any): string {
  let node = textNode;
  while (node) {
    const style = JSON.stringify(node.props?.style ?? '');
    if (style.includes('backgroundColor')) return style;
    node = node.parent;
  }
  return '';
}

const renderButton = async (text: string, to: string) =>
  render(
    <ProgressProvider>
      <ActionButton text={text} action={{ type: 'navigate', to }} />
    </ProgressProvider>,
  );

beforeEach(() => {
  mockNavigate.mockClear();
  progressService.loadProgress.mockReset().mockResolvedValue({});
  mockRouteName = 'app:/Home/Basics';
});

it('navigates to the joined target path on press', async () => {
  await renderButton('Prayer', 'Prayer');
  await fireEvent.press(screen.getByText('Prayer'));
  expect(mockNavigate).toHaveBeenCalledWith('app:/Home/Basics/Prayer');
});

it('grays out a button whose target has been visited', async () => {
  // Visits are recorded on screen focus; seed one via the persisted store
  progressService.loadProgress.mockResolvedValueOnce({
    'app:/Home/Basics/Prayer': VISIT,
  });
  await renderButton('Prayer', 'Prayer');
  await waitFor(() =>
    expect(buttonStyleOf(screen.getByText('Prayer'))).toContain('#9c9fa1'),
  );
});

it('does not gray buttons on the Home screen', async () => {
  mockRouteName = 'app:/Home';
  progressService.loadProgress.mockResolvedValueOnce({
    'app:/Home/Basics': VISIT,
  });
  await renderButton('Basics', 'Basics');
  // Home's main navigation buttons never gray, even when their target is visited
  expect(buttonStyleOf(screen.getByText('Basics'))).not.toContain('#9c9fa1');
});

it('shows a checkmark badge for a visited leaf target', async () => {
  mockRouteName = 'app:/Home/Basics/Prayer';
  progressService.loadProgress.mockResolvedValueOnce({
    'app:/Home/Basics/Prayer/OpeningReflection': VISIT,
  });
  await renderButton('Opening Reflection', 'OpeningReflection');
  expect(await screen.findByText('✓')).toBeTruthy();
});

it('resetVisited clears progress', async () => {
  progressService.loadProgress.mockResolvedValueOnce({
    'app:/Home/Basics/Prayer': VISIT,
  });
  await render(
    <ProgressProvider>
      <ActionButton text="Go" action={{ type: 'navigate', to: 'Prayer' }} />
      <ActionButton text="Reset" action={{ type: 'resetVisited' }} />
    </ProgressProvider>,
  );
  await waitFor(() =>
    expect(buttonStyleOf(screen.getByText('Go'))).toContain('#9c9fa1'),
  );
  await fireEvent.press(screen.getByText('Reset'));
  expect(buttonStyleOf(screen.getByText('Go'))).not.toContain('#9c9fa1');
});
