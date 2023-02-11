import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text as ReactText,
  TextStyle,
} from 'react-native';
import Theme from '../../Theme';
import { createDesignStyleSheets } from '../../util/DesignStyleSheets';
import { ContentDataBase } from './Contents';

/** Simple defining data for displaying text */
export interface TextContentData extends ContentDataBase {
  type: 'Text';
  text: string;
  design?: TextDesign;
  style?: StyleProp<TextStyle>;
}

type TextDesign = 'normal' | 'header' | 'subheader' | 'small';

/**
 * Data that defines Text but without the type
 * (useful when you want to use Text in another component)
 */
export type TextData = Omit<TextContentData, 'type'>;

/** Props the Text needs to function */
export interface TextProps extends TextData {}

export const Text = ({ text, design = 'normal', style }: TextProps) => {
  const designStyle = designStyles[design];
  return <ReactText style={[designStyle.lineText, style]}>{text}</ReactText>;
};

const designStyles = createDesignStyleSheets(
  {
    lineText: {
      fontSize: 22,
      color: Theme.default.color,
    },
  },
  {
    header: {
      lineText: {
        fontSize: 30,
        fontWeight: '900',
        color: Theme.default.color,
      },
    },
    subheader: {
      lineText: {
        fontSize: 15,
        color: Theme.default.color,
      },
    },
    small: {
      lineText: {
        fontSize: 17,
      }
    }
  },
);
