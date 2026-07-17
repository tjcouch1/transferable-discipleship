import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import { Breadcrumb } from '../src/components/Breadcrumb';

const mockNavigate = jest.fn();
let mockRouteName = 'app:/Home/Basics/Prayer/OpeningReflection';
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useRoute: () => ({ name: mockRouteName }),
}));

beforeEach(() => {
  mockNavigate.mockClear();
});

it('renders the ancestor trail and navigates on crumb press', async () => {
  mockRouteName = 'app:/Home/Basics/Prayer/OpeningReflection';
  await render(<Breadcrumb />);
  expect(screen.getByText('TD Home')).toBeTruthy();
  expect(screen.getByText('Basics')).toBeTruthy();
  expect(screen.getByText('Prayer')).toBeTruthy();
  // Current screen is not part of the trail (its header already names it)
  expect(screen.queryByText('Opening Reflection')).toBeNull();

  const user = userEvent.setup();
  await user.press(screen.getByText('Basics'));
  expect(mockNavigate).toHaveBeenCalledWith('app:/Home/Basics');
});

it('renders nothing on Home', async () => {
  mockRouteName = 'app:/Home';
  await render(<Breadcrumb />);
  expect(screen.queryByText('TD Home')).toBeNull();
});
