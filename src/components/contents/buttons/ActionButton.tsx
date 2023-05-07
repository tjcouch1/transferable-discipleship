import React from 'react';
import { BasicButton } from './BasicButton';
import { ActionData, ActionFactory } from '../../../util/ActionFactory';
import { ButtonDataBase } from './Buttons';
import { useNavigation, useRoute } from '@react-navigation/native';

/** The data that defines the ActionButton */
export interface ActionButtonData extends ButtonDataBase {
    type: 'ActionButton';
    action?: ActionData;
}

/** Props the ActionButton needs to function */
export interface ActionButtonProps extends Omit<ActionButtonData, 'type'> {
}

/** Button that performs an action when clicked */
export const ActionButton = (props: ActionButtonProps) => {
    const { action, ...buttonData } = props;
    const navigation = useNavigation();
    const route = useRoute();

    let onPress = action
        ? ActionFactory[action.type]({ ...action, navigation, route })
        : undefined;

    return <BasicButton {...buttonData} onPress={onPress} />;
};
