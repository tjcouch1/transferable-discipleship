import React, { ReactNode } from 'react';
import {
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import theme from '../../../Theme';
import { createDesignStyleSheets } from '../../../util/DesignStyleSheets';
import { Text, TextData, getTextDataObject } from '../Text';
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
  design = 'normal',
  style,
  text = {} as TextData,
  children,
}: BasicButtonProps) => {
  const designStyle = designStyles[design];
  const textObject = getTextDataObject(text);

  return (
    <TouchableOpacity style={[designStyle.navButton, style]} onPress={onPress}>
      {children ? (
        children
      ) : (
        <Text
          {...textObject}
          style={[designStyle.navButtonText, textObject.style]}
        />
      )}
    </TouchableOpacity>
  );
};

const designStyles = createDesignStyleSheets(
  {
    navButton: {
      backgroundColor: theme.button.background,
      padding: 12,
      borderRadius: 12,
      width: '75%'
    },
    navButtonText: {
      color: theme.button.text,
      fontSize: 22,
      textAlign: 'center',
    },
  },
  {
    answer: {
      navButton: {
        backgroundColor: theme.button.backgroundAnswer,
        padding: 5,
        borderRadius: 4,
        width: 'auto'
      },
      navButtonText: {
        color: theme.button.textAnswer,
        fontSize: 17,
      },
    },
  },
);
