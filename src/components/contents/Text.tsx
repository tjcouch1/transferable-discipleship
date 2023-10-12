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
import { supportsVariableFont, isString } from '../../util/Util';
import { GestureResponderEvent } from 'react-native';

const DEFAULT_FONT_FAMILY = 'OpenSauceOne';

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
  let styles = [designStyle.lineText, style];

  // Bake font styles into the family on iOS
  if (!supportsVariableFont()) {
    // Flatten styles to make them easier to deal with
    // Assert so we don't have weird problems with readonly entries in the array
    styles = styles.flat(5) as TextStyle[];

    // Find the highest-precedence font family, weight, and italic
    let highestStyleIndex = -1;
    let highestFontFamily: TextStyle['fontFamily'] = undefined;
    let highestFontWeight: TextStyle['fontWeight'] = undefined;
    let highestFontStyle: TextStyle['fontStyle'] = undefined;
    for (let i = styles.length - 1; i >= 0; i--) {
      const styleEntry = styles[i];
      if (!styleEntry || typeof styleEntry !== 'object' || styleEntry === null)
        continue;

      // Keep track of the highest actual TextStyle so we can set the font properties on it
      if (highestStyleIndex < 0) highestStyleIndex = i;

      const { fontWeight, fontStyle, fontFamily, ...textStyle } =
        styleEntry as TextStyle;

      // Remove these extra properties because they supposedly cause issues just being on the style at all
      styles[i] = textStyle;

      if (fontFamily && !highestFontFamily) highestFontFamily = fontFamily;
      if (fontWeight && !highestFontWeight) highestFontWeight = fontWeight;
      if (fontStyle && !highestFontStyle) highestFontStyle = fontStyle;

      if (highestFontFamily && highestFontWeight && highestFontStyle) break;
    }

    // If we found some font styles to set
    if (highestFontFamily || highestFontWeight || highestFontStyle) {
      // Set font family to default if we didn't find one
      if (!highestFontFamily) highestFontFamily = DEFAULT_FONT_FAMILY;

      // Set up the font family we're supposed to use
      const weight = parseInt(highestFontWeight || '');
      // normal is 400, and bold is 700
      const isBold =
        highestFontWeight === 'bold' ||
        (!Number.isNaN(weight) && weight >= 700);
      const isItalic = highestFontStyle === 'italic';
      const styledFontFamily = `${highestFontFamily}${isBold ? '_bold' : ''}${
        isItalic ? '_italic' : ''
      }`;

      if (highestStyleIndex < 0) {
        // If we didn't find an actual TextStyle, warn that this is unexpected. Please investigate
        console.warn(
          `Unexpectedly found font styling but not an actual TextStyle object (please investigate), so adding new font style object for text ${text}`,
        );
        styles.push({
          fontFamily: styledFontFamily,
        } as TextStyle);
      } else {
        // We found a TextStyle to put the font styles on. Put them on
        styles[highestStyleIndex] = {
          ...(styles[highestStyleIndex] as TextStyle),
          fontFamily: styledFontFamily,
        } as TextStyle;
      }
    }
  }

  return (
    <ReactText onPress={onPress} style={styles}>
      {text}
    </ReactText>
  );
};

const designStyles = createDesignStyleSheets(
  {
    lineText: {
      fontFamily: DEFAULT_FONT_FAMILY,
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
