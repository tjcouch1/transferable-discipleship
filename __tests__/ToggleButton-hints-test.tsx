import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import {
  ToggleButton,
  applyToggleHint,
} from '../src/components/contents/buttons/ToggleButton';

describe('applyToggleHint', () => {
  it('appends the reveal hint when a collapsed label lacks tap wording', () => {
    expect(applyToggleHint('What does this teach?', false)).toBe(
      'What does this teach? (Tap to reveal)',
    );
  });
  it('leaves labels that already mention tap/reveal alone', () => {
    expect(applyToggleHint('Why pray? (tap to reveal)', false)).toBe(
      'Why pray? (tap to reveal)',
    );
    expect(applyToggleHint('Tap to reveal answer', false)).toBe(
      'Tap to reveal answer',
    );
  });
  it('appends the go-back hint to revealed text', () => {
    expect(applyToggleHint('The Spirit convicts us of sin.', true)).toBe(
      'The Spirit convicts us of sin. (tap to go back)',
    );
  });
  it('does not double-append the go-back hint', () => {
    expect(applyToggleHint('Done (tap to go back)', true)).toBe(
      'Done (tap to go back)',
    );
  });
});

it('shows hints through a full toggle cycle', async () => {
  await render(
    <ToggleButton
      text="What is the answer?"
      altButtons={[{ text: 'The answer.' }]}
    />,
  );
  const user = userEvent.setup();
  expect(screen.getByText('What is the answer? (Tap to reveal)')).toBeTruthy();
  await user.press(screen.getByText('What is the answer? (Tap to reveal)'));
  expect(screen.getByText('The answer. (tap to go back)')).toBeTruthy();
});

it('does not add hints to a button with no alternates', async () => {
  await render(<ToggleButton text="Just a label" />);
  expect(screen.getByText('Just a label')).toBeTruthy();
});
