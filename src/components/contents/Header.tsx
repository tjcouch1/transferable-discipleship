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
import { View, ViewStyle, StyleProp } from 'react-native';
import theme from '../../Theme';
import { createDesignStyleSheets } from '../../util/DesignStyleSheets';
import { ContentDataBase } from './Contents';
import { HeaderText, HeaderTextData } from './HeaderText';
import { SubheaderText, SubheaderTextData } from './SubheaderText';
import { Text, TextData, getTextDataObject } from './Text';

export interface HeaderContentData extends ContentDataBase {
  type: 'Header';
  headerText: HeaderTextData;
  subheaderText?: SubheaderTextData;
  lineTexts?: TextData[];
  design?: HeaderDesign;
  style?: StyleProp<ViewStyle>;
}

type HeaderDesign = 'screen' | 'section' | 'title';

/**
 * Data that defines Header but without the type
 * (useful when you want to use Header in another component)
 */
export type HeaderData = Omit<HeaderContentData, 'type'>;

/** Props the Header needs to function */
export interface HeaderProps extends HeaderData {}

export const Header = ({
  headerText,
  subheaderText,
  lineTexts = [],
  design = 'screen',
  style,
}: HeaderProps) => {
  const designStyle = designStyles[design];
  const headerTextObject = getTextDataObject(headerText);
  const subheaderTextObject = subheaderText
    ? getTextDataObject(subheaderText)
    : undefined;
  return (
    <View style={[designStyle.headerView, style]}>
      <HeaderText
        {...headerTextObject}
        style={[designStyle.headerText, headerTextObject.style]}
      />
      {subheaderTextObject && (
        <SubheaderText
          {...subheaderTextObject}
          style={[designStyle.subheaderText, subheaderTextObject.style]}
        />
      )}
      {lineTexts.map(lineText => {
        const lineTextObject = getTextDataObject(lineText);
        return (
          <Text
            key={lineTextObject.text}
            {...lineTextObject}
            style={[designStyle.lineText, lineTextObject.style]}
          />
        );
      })}
    </View>
  );
};

const designStyles = createDesignStyleSheets(
  {
    headerView: {
      paddingTop: 60,
      paddingBottom: 40,
      backgroundColor: theme.header.background,
      paddingHorizontal: 15,
      width: '100%',
      borderBottomWidth: 10,
      borderBottomColor: theme.header.bottom,
    },
    headerText: {
      textAlign: 'center',
      color: theme.header.headerText,
    },
    subheaderText: {
      marginTop: 5,
      textAlign: 'center',
      color: theme.header.subheaderText,
    },
    lineText: {
      marginTop: 20,
      textAlign: 'center',
      color: theme.header.lineText,
    },
  },
  {
    screen: {
      headerView: {
        paddingTop: 15,
        paddingBottom: 15,
      },
      headerText: {
        fontWeight: '700',
        fontSize: 25,
      },
    },
    section: {
      extends: ['screen'],
      headerView: {
        width: '90%',
      },
    },
  },
);
