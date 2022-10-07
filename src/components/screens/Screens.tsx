import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleProp, TextStyle } from 'react-native';
import { HeaderWithButtons, HeaderWithButtonsProps } from './HeaderWithButtons';

export const Screens: { [pageType: string]: (props: any) => JSX.Element } = {
    HeaderWithButtons,
};

export type ScreenType = keyof typeof Screens;

/** Props for every screen type. All types should extend ScreenProps */
export type ScreenData = HeaderWithButtonsProps;

export interface AppScreens {
    initialScreen: string;
    screens: ScreenData[];
}

/** The base props that every screen must have */
export interface ScreenDataBase {
    id: string;
    title?: string;
    type: ScreenType;
}

/** Simple props for displaying text */
export interface TextData {
    text: string;
    style?: StyleProp<TextStyle>;
}

export const Actions: {
    [actionType: string]: (action: ActionProps) => () => void;
} = {
    navigate:
        ({ to, navigation }: NavigateActionProps) =>
        () => {
            navigation.navigate(to);
        },
};

export type ActionType = keyof typeof Actions;

export type NavigateActionData = {
    type: 'navigate';
    to: string;
} & ActionData;

export type NavigateActionProps = {} & NavigateActionData & ActionProps;

/** Props for an action to perform */
export interface ActionData {
    type: ActionType;
}

export interface ActionProps extends ActionData {
    navigation: NativeStackNavigationProp<any>;
}
