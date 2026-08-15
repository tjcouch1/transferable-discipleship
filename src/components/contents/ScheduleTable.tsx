/**
 * Copyright (C) 2023 TJ Couch
 * This file is part of discipleship‑app‑template.
 *
 * discipleship‑app‑template is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * discipleship‑app‑template is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with discipleship‑app‑template. If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../Theme';
import { useTheme } from '../../contexts/ThemeContext';
import { themedStyles } from '../../util/DesignStyleSheets';
// import type: avoids a runtime circular import (Contents.ts imports this file)
import type { ContentDataBase } from './Contents';
import { Text } from './Text';

/** A cell value: plain text or text with emphasis */
export type ScheduleCell = {
  text: string;
  bold?: boolean;
  italic?: boolean;
};

export type ScheduleTableRowData = {
  week: string;
  focus: string | ScheduleCell;
  notes: string | ScheduleCell;
};

/** A three-column bordered grid (e.g. the sample discipleship schedule) */
export type ScheduleTableContentData = ContentDataBase & {
  type: 'ScheduleTable';
  headers: [string, string, string];
  rows: ScheduleTableRowData[];
};

/** Props the ScheduleTable needs to function */
export interface ScheduleTableProps extends Omit<
  ScheduleTableContentData,
  'type'
> {}

function asCell(value: string | ScheduleCell): ScheduleCell {
  return typeof value === 'string' ? { text: value } : value;
}

type Column = 'week' | 'focus' | 'notes';

export const ScheduleTable = ({ headers, rows }: ScheduleTableProps) => {
  const styles = getStyles(useTheme().theme);
  const renderCell = (
    value: string | ScheduleCell,
    column: Column,
    isHeader: boolean,
  ) => {
    const { text, bold, italic } = asCell(value);
    const centered = isHeader || column === 'week';
    const textStyle = [
      styles.cellText,
      centered && styles.textCentered,
      (isHeader || bold) && styles.bold,
      italic && styles.italic,
    ];

    return (
      <View style={[styles.cell, columnStyles[column]]}>
        {column === 'week' ? (
          // Routed through Text (not raw RN Text) so it gets the same iOS
          // bold/italic font-family baking; still a single line that shrinks
          // to fit the narrow column
          <Text
            design="small"
            text={text}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.82}
            style={[...textStyle, styles.weekText]}
          />
        ) : (
          <Text design="small" text={text} style={textStyle} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.table}>
      <View style={styles.row}>
        {renderCell(headers[0], 'week', true)}
        {renderCell(headers[1], 'focus', true)}
        {renderCell(headers[2], 'notes', true)}
      </View>
      {rows.map((row, i) => (
        <View key={i} style={styles.row}>
          {renderCell(row.week, 'week', false)}
          {renderCell(row.focus, 'focus', false)}
          {renderCell(row.notes, 'notes', false)}
        </View>
      ))}
    </View>
  );
};

const getStyles = themedStyles((theme: Colors) =>
  StyleSheet.create({
    table: {
      alignSelf: 'stretch',
      marginHorizontal: 2,
      borderLeftWidth: 1,
      borderTopWidth: 1,
      borderColor: theme.slide.bottom,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'stretch',
    },
    cell: {
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.slide.bottom,
      backgroundColor: theme.slide.background,
      paddingVertical: 8,
      paddingHorizontal: 6,
      justifyContent: 'center',
      minHeight: 40,
    },
    cellText: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.text.lineText,
    },
    weekText: {
      fontFamily: 'OpenSauceOne',
      width: '100%',
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
  }),
);

const columnStyles = StyleSheet.create({
  week: {
    width: 64,
    maxWidth: 64,
    flexGrow: 0,
    flexShrink: 0,
    paddingHorizontal: 4,
  },
  focus: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
  },
  notes: {
    flex: 1.15,
    flexBasis: 0,
    minWidth: 0,
  },
});
