import React, {ReactNode} from 'react';
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

export interface TdButtonProps {
    onPress?: (event: GestureResponderEvent) => void;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    title?: string;
    children?: ReactNode;
}

// TODO: Consider reworking with Pressable https://reactnative.dev/docs/pressable

export const TdButton = ({
    onPress,
    style,
    textStyle,
    title,
    children,
}: TdButtonProps) => {
    return (
        <TouchableOpacity
            style={[style, styles.navButton]}
            onPress={onPress || undefined}>
            {children ? (
                children
            ) : (
                <Text style={[textStyle, styles.navButtonText]}>{title}</Text>
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
