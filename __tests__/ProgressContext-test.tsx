import React from 'react';
import { Text } from 'react-native';
import { render, screen, userEvent } from '@testing-library/react-native';
import { ProgressProvider, useProgress } from '../src/contexts/ProgressContext';

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

const PRAYER = 'app:/Home/Basics/Prayer';
const OPENING = 'app:/Home/Basics/Prayer/OpeningReflection';

const Probe = () => {
  const { isVisited, completion, markVisited, resetProgress } = useProgress();
  return (
    <>
      <Text onPress={() => markVisited(OPENING)}>mark</Text>
      <Text onPress={() => resetProgress()}>reset</Text>
      <Text>{`visited:${isVisited(OPENING)}`}</Text>
      <Text>{`completion:${completion(PRAYER)}`}</Text>
      <Text>{`leaf:${completion(OPENING)}`}</Text>
    </>
  );
};

it('marks visits, computes section completion, and resets', async () => {
  await render(
    <ProgressProvider>
      <Probe />
    </ProgressProvider>,
  );
  const user = userEvent.setup();

  expect(screen.getByText('visited:false')).toBeTruthy();
  expect(screen.getByText('completion:0')).toBeTruthy();
  // Leaf screens have no completion percentage
  expect(screen.getByText('leaf:undefined')).toBeTruthy();

  await user.press(screen.getByText('mark'));
  expect(screen.getByText('visited:true')).toBeTruthy();
  // Prayer has 7 subscreens; 1 visited -> 14%
  expect(screen.getByText('completion:14')).toBeTruthy();
  expect(progressService.saveProgress).toHaveBeenCalled();

  await user.press(screen.getByText('reset'));
  expect(screen.getByText('visited:false')).toBeTruthy();
  expect(screen.getByText('completion:0')).toBeTruthy();
  expect(progressService.saveProgress).toHaveBeenLastCalledWith({});
});
