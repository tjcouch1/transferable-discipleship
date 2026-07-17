import React from 'react';
import { render, screen } from '@testing-library/react-native';
import * as ContentsModule from '../src/components/contents/Contents';
import ContentsModuleContext from '../src/components/contents/ContentsContext';
import { ScriptureSlide } from '../src/components/contents/ScriptureSlide';

it('renders answerInSlide as an inline non-interactive prompt', async () => {
  await render(
    <ContentsModuleContext.Provider value={ContentsModule}>
      <ScriptureSlide
        canClose={false}
        scripture={{
          reference: 'John 3:16',
          answerInSlide: 'God loved the world.',
        }}
      />
    </ContentsModuleContext.Provider>,
  );
  expect(screen.getByText('God loved the world.')).toBeTruthy();
  // No tap-to-reveal toggle should be rendered for this scripture
  expect(screen.queryByText('Tap to reveal answer')).toBeNull();
});
