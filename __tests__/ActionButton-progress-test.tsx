import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
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

const mockNavigate = jest.fn();
let mockRouteName = 'app:/Home/Basics';
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useRoute: () => ({ name: mockRouteName }),
}));

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
  mockRouteName = 'app:/Home/Basics';
});

it('marks the target visited, navigates, and grays out', async () => {
  await renderButton('Prayer', 'Prayer');
  const user = userEvent.setup();

  await user.press(screen.getByText('Prayer'));
  expect(mockNavigate).toHaveBeenCalledWith('app:/Home/Basics/Prayer');

  // Visited target -> button is grayed
  expect(buttonStyleOf(screen.getByText('Prayer'))).toContain('#9c9fa1');
});

it('does not gray buttons on the Home screen', async () => {
  mockRouteName = 'app:/Home';
  await renderButton('Basics', 'Basics');
  const user = userEvent.setup();
  await user.press(screen.getByText('Basics'));
  expect(buttonStyleOf(screen.getByText('Basics'))).not.toContain('#9c9fa1');
});

it('shows a checkmark badge for visited leaf targets', async () => {
  mockRouteName = 'app:/Home/Basics/Prayer';
  await renderButton('Opening Reflection', 'OpeningReflection');
  const user = userEvent.setup();
  await user.press(screen.getByText('Opening Reflection'));
  expect(screen.getByText('✓')).toBeTruthy();
});

it('resetVisited clears progress', async () => {
  await render(
    <ProgressProvider>
      <ActionButton text="Go" action={{ type: 'navigate', to: 'Prayer' }} />
      <ActionButton text="Reset" action={{ type: 'resetVisited' }} />
    </ProgressProvider>,
  );
  const user = userEvent.setup();
  await user.press(screen.getByText('Go'));
  expect(buttonStyleOf(screen.getByText('Go'))).toContain('#9c9fa1');
  await user.press(screen.getByText('Reset'));
  expect(buttonStyleOf(screen.getByText('Go'))).not.toContain('#9c9fa1');
});
