import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import { ActionButton, ActionButtonData } from './ActionButton';

/** The data that defines the ButtonList */
export interface ButtonListData {
    buttons: ActionButtonData[];
}

/** Props the ButtonList needs to function */
export interface ButtonListProps extends ButtonListData {
    navigation: NativeStackNavigationProp<any>;
}

export const ButtonList = ({ buttons, navigation }: ButtonListProps) => {
    return (
        <>
            {buttons.map((button, i) => (
                <ActionButton
                    key={button.text?.text || i}
                    {...button}
                    navigation={navigation}
                    style={[styles.button, button.style]}
                />
            ))}
        </>
    );
};

const styles = StyleSheet.create({
    button: {
        marginTop: 45,
    },
});
