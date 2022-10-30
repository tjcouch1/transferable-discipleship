import React from 'react';
import {
    StyleProp,
    StyleSheet,
    Text as ReactText,
    TextStyle,
} from 'react-native';
import Theme from '../../Theme';
import { ContentDataBase } from './Contents';

/** Simple defining data for displaying text */
export interface TextContentData extends ContentDataBase {
    type: 'Text';
    text: string;
    style?: StyleProp<TextStyle>;
}

/**
 * Data that defines Text but without the type
 * (useful when you want to use Text in another component)
 */
export type TextData = Omit<TextContentData, 'type'>;

/** Props the Text needs to function */
export interface TextProps extends TextData {}

export const Text = ({ text, style }: TextProps) => (
    <ReactText style={[styles.lineText, style]}>{text}</ReactText>
);

const styles = StyleSheet.create({
    lineText: {
        fontSize: 22,
        color: Theme.default.color,
    },
});
