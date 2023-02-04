import React from 'react';
import { StyleSheet } from 'react-native';
import Theme from '../../Theme';
import { Text, TextData } from './Text';

/** Simple defining data for displaying subheader text */
export interface SubheaderTextContentData extends Omit<TextData, 'design'> {
  type: 'SubheaderText';
}

/**
 * Data that defines SubHeaderText but without the type
 * (useful when you want to use SubHeaderText in another component)
 */
export type SubheaderTextData = Omit<SubheaderTextContentData, 'type'>;

/** Props the SubheaderText needs to function */
export interface SubheaderTextProps extends SubheaderTextData {}

export const SubheaderText = (textData: SubheaderTextProps) => (
  <Text {...textData} design="subheader" style={[textData.style]} />
);
