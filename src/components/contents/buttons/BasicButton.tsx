import React, { ReactNode } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    GestureResponderEvent,
} from 'react-native';
import Theme from '../../../Theme';
import { Text, TextData } from '../Text';
import { ButtonDataBase } from './Buttons';

/** The data that defines the BasicButton */
export interface BasicButtonData extends ButtonDataBase {
    type: 'BasicButton';
}

/** Props the BasicButton needs to function */
export interface BasicButtonProps extends Omit<BasicButtonData, 'type'> {
    onPress?: (event: GestureResponderEvent) => void;
    children?: ReactNode;
}

// TODO: Consider reworking with Pressable https://reactnative.dev/docs/pressable

export const BasicButton = ({
    onPress,
    style,
    text = {} as TextData,
    children,
}: BasicButtonProps) => {
    return (
        <TouchableOpacity style={[styles.navButton, style]} onPress={onPress}>
            {children ? (
                children
            ) : (
                <Text {...text} style={[styles.navButtonText, text.style]} />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    navButton: {
        backgroundColor: Theme.default.backgroundColor,
        padding: 15,
        borderRadius: 12,
    },
    navButtonText: {
        color: Theme.default.color,
        fontSize: 25,
    },
});
