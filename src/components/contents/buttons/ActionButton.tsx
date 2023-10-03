import React, { useMemo } from 'react';
import { BasicButton } from './BasicButton';
import { ActionData, ActionFactory } from '../../../util/ActionFactory';
import { ButtonDataBase } from './Buttons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TextData, getTextDataObject } from '../Text';

/** The data that defines the ActionButton */
export interface ActionButtonData extends ButtonDataBase {
  type: 'ActionButton';
  action?: ActionData;
}

/** Props the ActionButton needs to function */
export interface ActionButtonProps extends Omit<ActionButtonData, 'type'> {}

/** Button that performs an action when clicked */
export const ActionButton = (props: ActionButtonProps) => {
  const { action, ...buttonData } = props;
  const navigation = useNavigation();
  const route = useRoute();

  // Set up text style with underline for `link` action type
  const textObject = useMemo<TextData | undefined>(() => {
    if (!action || action.type !== 'link' || !buttonData.text)
      return buttonData.text;

    const buttonTextObject = getTextDataObject(buttonData.text);
    return {
      text: buttonTextObject.text,
      style: {
        textDecorationLine: 'underline',
        // StyleProp won't spread, so I'm just going to assert this
        ...(buttonTextObject.style as object),
      },
    };
  }, []);

  let onPress = action
    ? ActionFactory[action.type]({ ...action, navigation, route })
    : undefined;

  return <BasicButton {...buttonData} text={textObject} onPress={onPress} />;
};
