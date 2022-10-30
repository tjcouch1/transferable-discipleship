import { StyleProp, ViewStyle } from 'react-native';
import { PropsWithNavigation } from '../../../util/ActionFactory';
import { TextData } from '../Text';
import { ActionButton, ActionButtonData } from './ActionButton';
import { BasicButton, BasicButtonData } from './BasicButton';

//----- BUTTON TYPES -----//

export const Buttons: {
    [contentType: string]: (props: PropsWithNavigation<any>) => JSX.Element;
} = {
    ActionButton,
    BasicButton,
};

/** Defining data for every button type. All button types should extend ScreenDataBase */
export type ButtonData = ActionButtonData | BasicButtonData;

/** All button types available */
export type ButtonType = keyof typeof Buttons;

/** The base data that every button must have. All button data types should extend ButtonDataBase */
export type ButtonDataBase = {
    type: ButtonType;
    style?: StyleProp<ViewStyle>;
    text?: TextData;
};
