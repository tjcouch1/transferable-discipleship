import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from '../src/components/contents/Text';

it('renders segments as one flowing paragraph with per-span styles', async () => {
  await render(
    <Text
      text=""
      segments={[
        { text: 'God cares ' },
        {
          text: 'that',
          style: { fontStyle: 'italic', textDecorationLine: 'underline' },
        },
        { text: ' you talk with Him' },
      ]}
    />,
  );
  const styledSpan = screen.getByText('that');
  expect(styledSpan).toBeTruthy();
  const flatStyle = JSON.stringify(styledSpan.props.style);
  expect(flatStyle).toContain('italic');
  expect(flatStyle).toContain('underline');
  expect(screen.getByText('God cares ')).toBeTruthy();
});
