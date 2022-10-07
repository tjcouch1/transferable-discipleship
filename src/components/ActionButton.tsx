import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActionData, Actions } from './screens/Screens';
import { TdButton, TdButtonData } from './TdButton';

export interface ActionButtonData extends TdButtonData {
    action?: ActionData;
}

export interface ActionButtonProps extends ActionButtonData {
    navigation: NativeStackNavigationProp<any>;
}

export const ActionButton = (props: ActionButtonProps) => {
    const { action, navigation, ...tdButtonProps } = props;

    const onPress = action
        ? Actions[action.type]({ ...action, navigation })
        : undefined;

    return <TdButton {...tdButtonProps} onPress={onPress} />;
};
