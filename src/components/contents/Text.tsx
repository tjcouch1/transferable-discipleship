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
import { StyleProp, Text as ReactText, TextStyle } from 'react-native';
import theme from '../../Theme';
import { createDesignStyleSheets } from '../../util/DesignStyleSheets';
import { ContentDataBase } from './Contents';
import { isString } from '../../util/Util';
import { GestureResponderEvent } from 'react-native';

/** The base data that every text object must have. All text data object data types should extend TextDataObjectBase */
export type TextDataObjectBase = { text: string };

/** Simple defining data for displaying text */
export interface TextContentDataObject
  extends ContentDataBase,
    TextDataObjectBase {
  type: 'Text';
  design?: TextDesign;
  style?: StyleProp<TextStyle>;
}

/** Defining data for displaying text, either an object describing the text or just a string */
export type TextContentData = TextContentDataObject | string;

type TextDesign = 'normal' | 'header' | 'subheader' | 'small';

/** Data that defines Text but without the type */
export type TextDataObject = Omit<TextContentDataObject, 'type'>;

/**
 * Data that defines Text but without the type.
 * Either an object describing the text or just a string.
 * (useful when you want to use Text in another component)
 */
export type TextData = TextDataObject | string;

/** The base props that every text object should have and pass down to the text inside. All text data object props should extend TextPropsBase */
export type TextPropsBase = {
  onPress?: (event: GestureResponderEvent) => void;
};

/** Props the Text needs to function */
export type TextProps = TextData & TextPropsBase;

// Have to bake out any optional parameter into specifically defined for TypeScript to realize we provided it
const DEFAULT_PROPS: Omit<TextDataObject, 'design' | 'text'> & {
  design: TextDesign;
} = {
  design: 'normal',
};

/**
 * Format the input text data to make sure it is a TextObjectData object we can destructure
 * @param textData TextData object or string to format into a TextObjectData
 * @returns if textData is a string, returns textData wrapped to be a TextObjectData, returns textData otherwise
 *
 * WARNING: This asserts the textData string into type T. If the text data object type in use has other necessary properties, it would
 * probably be best to make a new version of this function specific to that text data object type
 */
export const getTextDataObject = <T extends TextDataObjectBase | string>(
  textData: T,
): Exclude<T, string> => {
  return (isString(textData) ? { text: textData } : textData) as Exclude<
    T,
    string
  >;
};

export const Text = (props: TextProps) => {
  const { text, design, style, onPress } = {
    ...DEFAULT_PROPS,
    ...getTextDataObject(props),
  };

  const designStyle = designStyles[design];
  return (
    <ReactText onPress={onPress} style={[designStyle.lineText, style]}>
      {text}
    </ReactText>
  );
};

const designStyles = createDesignStyleSheets(
  {
    lineText: {
      fontFamily: 'OpenSauceOne',
      fontSize: 20,
      color: theme.text.lineText,
    },
  },
  {
    header: {
      lineText: {
        fontFamily: 'LibreFranklin',
        fontSize: 30,
        fontWeight: '900',
        color: theme.text.headerText,
      },
    },
    subheader: {
      lineText: {
        fontSize: 16,
        color: theme.text.subheaderText,
      },
    },
    small: {
      lineText: {
        fontSize: 17,
      },
    },
  },
);
