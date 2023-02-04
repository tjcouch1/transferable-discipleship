import React from 'react';
import { StyleSheet } from 'react-native';
import Theme from '../../Theme';
import { Text, TextData } from './Text';

/** Simple defining data for displaying header text */
export interface HeaderTextContentData extends Omit<TextData, 'design'> {
  type: 'HeaderText';
}

/**
 * Data that defines HeaderText but without the type
 * (useful when you want to use HeaderText in another component)
 */
export type HeaderTextData = Omit<HeaderTextContentData, 'type'>;

/** Props the HeaderText needs to function */
export interface HeaderTextProps extends HeaderTextData {}

export const HeaderText = (textData: HeaderTextData) => (
  <Text {...textData} design="header" style={[textData.style]} />
);
