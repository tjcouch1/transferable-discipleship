import { StyleProp, ViewStyle } from 'react-native';
import { PropsWithNavigation } from '../../../util/ActionFactory';
import { TextData } from '../Text';
import { ActionButton, ActionButtonData } from './ActionButton';
import { BasicButton, BasicButtonData } from './BasicButton';
import { ToggleButton, ToggleButtonData } from './ToggleButton';

//----- BUTTON TYPES -----//

export const Buttons: {
  [contentType: string]: (props: PropsWithNavigation<any>) => JSX.Element;
} = {
  ActionButton,
  BasicButton,
  ToggleButton,
};

/** Defining data for every button type. All button types should extend ButtonDataBase */
export type ButtonData = ActionButtonData | BasicButtonData | ToggleButtonData;

/** All button types available */
export type ButtonType = keyof typeof Buttons;

/** The base data that every button must have. All button data types should extend ButtonDataBase */
export type ButtonDataBase = {
  type: ButtonType;
  design?: ButtonDesign;
  style?: StyleProp<ViewStyle>;
  text?: TextData;
};

type ButtonDesign = 'normal' | 'answer';
