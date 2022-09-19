import React from 'react';
import {StyleSheet, Text, View, ViewStyle, StyleProp} from 'react-native';
import Theme from '../Theme';

export interface TitleProps {
    style?: StyleProp<ViewStyle>;
}

export const Title = ({style}: TitleProps) => {
    return (
        <View style={[style, styles.titleView]}>
            <Text style={styles.title}>Transferable Discipleship</Text>
            <Text style={styles.subTitle}>
                A tool for simple, reproducible Christian discipleship
            </Text>
            <Text style={styles.instructions}>
                Please select an option below or swipe from the right anytime if
                you get lost
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    titleView: {
        paddingTop: 60,
        paddingBottom: 40,
        backgroundColor: Theme.default.backgroundColor,
        paddingHorizontal: 15,
        width: '100%',
        borderBottomWidth: 10,
        borderBottomColor: Theme.dimmed.backgroundColor,
    },
    title: {
        fontSize: 30,
        fontWeight: '900',
        textAlign: 'center',
        color: Theme.default.color,
    },
    subTitle: {
        marginTop: 5,
        fontSize: 15,
        textAlign: 'center',
        color: Theme.default.color,
    },
    instructions: {
        marginTop: 20,
        fontSize: 22,
        textAlign: 'center',
        color: Theme.default.color,
    },
});
