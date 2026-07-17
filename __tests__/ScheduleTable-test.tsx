import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ScheduleTable } from '../src/components/contents/ScheduleTable';
import { Contents } from '../src/components/contents/Contents';

it('is registered as a content type', () => {
  expect(Contents.ScheduleTable).toBe(ScheduleTable);
});

it('renders headers and all rows', async () => {
  await render(
    <ScheduleTable
      headers={['Week', 'Main Focus', 'Notes']}
      rows={[
        { week: '1', focus: 'The Challenge', notes: 'Download TD app' },
        {
          week: '2',
          focus: { text: 'TD #1 (Gospel Review)', bold: true },
          notes: { text: 'Can break this up', italic: true },
        },
      ]}
    />,
  );
  expect(screen.getByText('Week')).toBeTruthy();
  expect(screen.getByText('The Challenge')).toBeTruthy();
  expect(screen.getByText('TD #1 (Gospel Review)')).toBeTruthy();
  expect(screen.getByText('Can break this up')).toBeTruthy();
});
