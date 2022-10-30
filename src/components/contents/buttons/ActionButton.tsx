import React, { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BasicButton } from './BasicButton';
import { ActionData, ActionFactory } from '../../../util/ActionFactory';
import { ButtonDataBase } from './Buttons';

/** The data that defines the ActionButton */
export interface ActionButtonData extends ButtonDataBase {
    type: 'ActionButton';
    action?: ActionData;
}

/** Props the ActionButton needs to function */
export interface ActionButtonProps extends Omit<ActionButtonData, 'type'> {
    navigation: NativeStackNavigationProp<any>;
}

/** Button that performs an action when clicked */
export const ActionButton = (props: ActionButtonProps) => {
    const { action, navigation, ...buttonData } = props;

    /** Keep button state so we can toggle with toggle action */
    const [currentButtonData, setCurrentButtonData] = useState(buttonData);

    let onPress = action
        ? ActionFactory[action.type]({ ...action, navigation })
        : undefined;
    if (action?.type === 'toggle') {
        onPress = () =>
            ActionFactory[action.type]({ ...action, navigation })(
                setCurrentButtonData,
            );
    }

    return <BasicButton {...currentButtonData} onPress={onPress} />;
};
