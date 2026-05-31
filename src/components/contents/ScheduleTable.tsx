/**
 * Copyright (C) 2023 TJ Couch
 * This file is part of discipleship‑app‑template.
 *
 * ScheduleTable — simple 3-column bordered grid (e.g. sample discipleship schedule).
 */

import React from 'react';
import { StyleSheet, Text as RNText, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { PropsWithNavigation } from '../../util/ActionFactory';
import { Text } from './Text';

export type ScheduleCellFormatted = {
  text: string;
  bold?: boolean;
  italic?: boolean;
};

export type ScheduleTableRowData = {
  week: string;
  focus: string | ScheduleCellFormatted;
  notes: string | ScheduleCellFormatted;
};

export interface ScheduleTableContentData {
  type: 'ScheduleTable';
  headers: [string, string, string];
  rows: ScheduleTableRowData[];
}

export type ScheduleTableProps = ScheduleTableContentData;

function cellText(
  value: string | ScheduleCellFormatted,
): { text: string; bold: boolean; italic: boolean } {
  if (typeof value === 'string') {
    return { text: value, bold: false, italic: false };
  }
  return {
    text: value.text,
    bold: !!value.bold,
    italic: !!value.italic,
  };
}

export const ScheduleTable = ({
  headers,
  rows,
}: PropsWithNavigation<ScheduleTableProps>) => {
  const { theme, isDarkMode } = useTheme();
  const border = isDarkMode ? '#8a8a8a' : '#1a1a1a';
  const cellBg = theme.slide.background;
  const textColor = theme.text.lineText;

  const renderCell = (
    value: string | ScheduleCellFormatted,
    col: 'week' | 'focus' | 'notes',
    header: boolean,
  ) => {
    const { text, bold, italic } = cellText(value);
    const centered = header || col === 'week';
    const bodyTextStyle = [
      styles.cellText,
      { color: textColor },
      centered && styles.textCentered,
      (header || bold) && styles.bold,
      italic && styles.italic,
    ];
    const weekTextStyle = [
      ...bodyTextStyle,
      { fontFamily: 'OpenSauceOne', width: '100%' as const },
    ];

    return (
      <View
        style={[
          styles.cell,
          col === 'week' && styles.cellWeek,
          col === 'focus' && styles.cellFocus,
          col === 'notes' && styles.cellNotes,
          { borderColor: border, backgroundColor: cellBg },
        ]}>
        {col === 'week' ? (
          <RNText
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.82}
            style={weekTextStyle}
          >
            {text}
          </RNText>
        ) : (
          <Text design="small" text={text} style={bodyTextStyle} />
        )}
      </View>
    );
  };

  return (
    <View style={[styles.table, { borderColor: border }]}>
      <View style={styles.row}>
        {renderCell(headers[0], 'week', true)}
        {renderCell(headers[1], 'focus', true)}
        {renderCell(headers[2], 'notes', true)}
      </View>
      {rows.map((r, i) => (
        <View key={i} style={styles.row}>
          {renderCell(r.week, 'week', false)}
          {renderCell(r.focus, 'focus', false)}
          {renderCell(r.notes, 'notes', false)}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    alignSelf: 'stretch',
    marginHorizontal: 2,
    borderLeftWidth: 1,
    borderTopWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  cell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    justifyContent: 'center',
    minHeight: 40,
  },
  cellWeek: {
    width: 64,
    maxWidth: 64,
    flexGrow: 0,
    flexShrink: 0,
    paddingHorizontal: 4,
  },
  cellFocus: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
  },
  cellNotes: {
    flex: 1.15,
    flexBasis: 0,
    minWidth: 0,
  },
  cellText: {
    fontSize: 14,
    lineHeight: 20,
  },
  textCentered: {
    textAlign: 'center',
  },
  bold: {
    fontWeight: '700',
  },
  italic: {
    fontStyle: 'italic',
  },
});
