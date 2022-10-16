import React, { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActionData, ActionFactory } from './screens/Screens';
import { TdButton, TdButtonData } from './TdButton';

/** The data that defines the ActionButton */
export interface ActionButtonData extends TdButtonData {
    action?: ActionData;
}

/** Props the ActionButton needs to function */
export interface ActionButtonProps extends ActionButtonData {
    navigation: NativeStackNavigationProp<any>;
}

/** Button that performs an action when clicked */
export const ActionButton = (props: ActionButtonProps) => {
    const { action, navigation, ...tdButtonData } = props;

    /** Keep button state so we can toggle with toggle action */
    const [buttonData, setButtonData] = useState(tdButtonData);

    let onPress = action
        ? ActionFactory[action.type]({ ...action, navigation })
        : undefined;
    if (action?.type === 'toggle') {
        onPress = () =>
            ActionFactory[action.type]({ ...action, navigation })(
                setButtonData,
            );
    }

    return <TdButton {...buttonData} onPress={onPress} />;
};
