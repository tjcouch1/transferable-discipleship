import React, { ReactNode } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    GestureResponderEvent,
    StyleProp,
    TextStyle,
    ViewStyle,
} from 'react-native';
import Theme from '../Theme';
import { TextData } from './screens/Screens';

export interface TdButtonData {
    style?: StyleProp<ViewStyle>;
    text?: TextData;
}

export interface TdButtonProps extends TdButtonData {
    onPress?: (event: GestureResponderEvent) => void;
    children?: ReactNode;
}

// TODO: Consider reworking with Pressable https://reactnative.dev/docs/pressable

export const TdButton = ({
    onPress,
    style,
    text = {} as TextData,
    children,
}: TdButtonProps) => {
    return (
        <TouchableOpacity style={[styles.navButton, style]} onPress={onPress}>
            {children ? (
                children
            ) : (
                <Text style={[styles.navButtonText, text.style]}>
                    {text.text}
                </Text>
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
