import React from 'react';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import {
  ProgressProvider,
  useProgress,
  useMarkVisitedOnFocus,
} from '../src/contexts/ProgressContext';

jest.mock('../src/services/ProgressService', () => {
  const actual = jest.requireActual('../src/services/ProgressService');
  return {
    ...actual,
    loadProgress: jest.fn().mockResolvedValue({}),
    saveProgress: jest.fn().mockResolvedValue(true),
  };
});

const ROUTE = 'app:/Home/Basics/Prayer/OpeningReflection';
jest.mock('@react-navigation/native', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const react = require('react');
  return {
    useRoute: () => ({ name: ROUTE }),
    // Simulate the screen gaining focus once on mount
    useFocusEffect: (cb: () => void) => react.useEffect(() => cb(), [cb]),
  };
});

const Probe = () => {
  useMarkVisitedOnFocus();
  const { isVisited } = useProgress();
  return <Text>{`visited:${isVisited(ROUTE)}`}</Text>;
};

it('marks the current screen visited when it gains focus', async () => {
  await render(
    <ProgressProvider>
      <Probe />
    </ProgressProvider>,
  );
  expect(await screen.findByText('visited:true')).toBeTruthy();
});
