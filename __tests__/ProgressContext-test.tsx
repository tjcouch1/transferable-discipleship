import React from 'react';
import { Text } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
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

const BASICS = 'app:/Home/Basics';
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
      <Text>{`section:${completion(BASICS)}`}</Text>
    </>
  );
};

it('marks visits, computes recursive completion, and resets', async () => {
  await render(
    <ProgressProvider>
      <Probe />
    </ProgressProvider>,
  );

  expect(screen.getByText('visited:false')).toBeTruthy();
  expect(screen.getByText('completion:0')).toBeTruthy();
  // Leaf screens have no completion percentage
  expect(screen.getByText('leaf:undefined')).toBeTruthy();
  expect(screen.getByText('section:0')).toBeTruthy();

  await fireEvent.press(screen.getByText('mark'));
  expect(screen.getByText('visited:true')).toBeTruthy();
  // Prayer has 7 leaf subscreens; 1 visited -> 14%
  expect(screen.getByText('completion:14')).toBeTruthy();
  // Completion is recursive: OpeningReflection is one of Basics' 36 leaf
  // descendants (across its subsections), so 1/36 -> 3% (a direct-children-only
  // count would report 0 here, since OpeningReflection is a grandchild)
  expect(screen.getByText('section:3')).toBeTruthy();
  expect(progressService.saveProgress).toHaveBeenCalled();

  await fireEvent.press(screen.getByText('reset'));
  expect(screen.getByText('visited:false')).toBeTruthy();
  expect(screen.getByText('completion:0')).toBeTruthy();
  expect(progressService.saveProgress).toHaveBeenLastCalledWith({});
});
