import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { QuestionPrompt } from '../src/components/contents/QuestionPrompt';
import { Contents } from '../src/components/contents/Contents';

it('is registered as a content type', () => {
  expect(Contents.QuestionPrompt).toBe(QuestionPrompt);
});

it('renders its text', async () => {
  await render(<QuestionPrompt text="Which of these feels most needed?" />);
  expect(screen.getByText('Which of these feels most needed?')).toBeTruthy();
});

it('has no press handler (not a button)', async () => {
  await render(<QuestionPrompt text="A prompt" />);
  expect(screen.queryByRole('button')).toBeNull();
});
