import React from 'react';
import { StyleSheet } from 'react-native';
import { TdButton, TdButtonData, TdButtonProps } from './TdButton';

export interface ButtonListData {
    buttons: TdButtonData[];
}

export interface ButtonListProps extends ButtonListData {
    buttons: TdButtonProps[];
}

export const ButtonList = ({ buttons }: ButtonListProps) => {
    return (
        <>
            {buttons.map((button, i) => (
                <TdButton
                    key={button.text?.text || i}
                    {...button}
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
