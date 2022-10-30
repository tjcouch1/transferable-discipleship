import React from 'react';
import { StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import Theme from '../../Theme';
import { TextData } from './Contents';

export interface HeaderData {
    type: 'Header';
    headerText: string;
    subHeaderText: string;
    lineTexts?: TextData[];
    style?: StyleProp<ViewStyle>;
}

export interface HeaderProps extends Omit<HeaderData, 'type'> {}

export const Header = ({
    headerText,
    subHeaderText,
    lineTexts = [],
    style,
}: HeaderProps) => {
    return (
        <View style={[styles.headerView, style]}>
            <Text style={styles.headerText}>{headerText}</Text>
            <Text style={styles.subHeaderText}>{subHeaderText}</Text>
            {lineTexts.map(lineText => (
                <Text
                    key={lineText.text}
                    style={[styles.lineText, lineText.style]}>
                    {lineText.text}
                </Text>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    headerView: {
        paddingTop: 60,
        paddingBottom: 40,
        backgroundColor: Theme.default.backgroundColor,
        paddingHorizontal: 15,
        width: '100%',
        borderBottomWidth: 10,
        borderBottomColor: Theme.dimmed.backgroundColor,
    },
    headerText: {
        fontSize: 30,
        fontWeight: '900',
        textAlign: 'center',
        color: Theme.default.color,
    },
    subHeaderText: {
        marginTop: 5,
        fontSize: 15,
        textAlign: 'center',
        color: Theme.default.color,
    },
    lineText: {
        marginTop: 20,
        fontSize: 22,
        textAlign: 'center',
        color: Theme.default.color,
    },
});
