import React from 'react';
import { StyleSheet } from 'react-native';
import Theme from '../../Theme';
import { Text, TextData } from './Text';

/** Simple defining data for displaying header text */
export interface HeaderTextContentData extends TextData {
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
    <Text {...textData} style={[styles.headerText, textData.style]} />
);

const styles = StyleSheet.create({
    headerText: {
        fontSize: 30,
        fontWeight: '900',
        color: Theme.default.color,
    },
});
