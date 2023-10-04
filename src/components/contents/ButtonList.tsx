import React from 'react';
import { StyleSheet } from 'react-native';
import { ActionButton, ActionButtonData } from './buttons/ActionButton';
import { ContentDataBase } from './Contents';
import { getTextDataObject } from './Text';

/** The data that defines the ButtonList */
export interface ButtonListContentData extends ContentDataBase {
  type: 'ButtonList';
  buttons: ActionButtonData[];
}

/**
 * Data that defines ButtonList but without the type
 * (useful when you want to use ButtonList in another component)
 */
export type ButtonListData = Omit<ButtonListContentData, 'type'>;

/** Props the ButtonList needs to function */
export interface ButtonListProps extends ButtonListData {}

export const ButtonList = ({ buttons }: ButtonListProps) => {
  return (
    <>
      {buttons.map((button, i) => (
        <ActionButton
          key={button.text ? getTextDataObject(button.text).text || i : i}
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
