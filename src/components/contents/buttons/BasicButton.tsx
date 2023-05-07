import React, { ReactNode } from 'react';
import {
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import Theme from '../../../Theme';
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
      backgroundColor: Theme.default.backgroundColor,
      padding: 15,
      borderRadius: 12,
    },
    navButtonText: {
      color: Theme.default.color,
      fontSize: 25,
      textAlign: 'center',
    },
  },
  {
    answer: {
      navButton: {
        backgroundColor: Theme.default.color,
        padding: 5,
        borderRadius: 4,
      },
      navButtonText: {
        color: Theme.default.backgroundColor,
        fontSize: 17,
      },
    },
  },
);
