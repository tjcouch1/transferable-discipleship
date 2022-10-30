import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ButtonDataBase } from '../components/contents/buttons/Buttons';
import { BasicButtonData } from '../components/contents/buttons/BasicButton';

//----- ACTION TYPES -----//

/** The base data for an action to perform. All action types should extend ActionDataBase */
export type ActionDataBase = {
    type: ActionType;
};

/** Generic props passed down that allow access to navigation */
export type PropsWithNavigation<T> = T & {
    navigation: NativeStackNavigationProp<any>;
};

/** Mapping from an action type to a function factory for that action given the ActionProps provided */
export const ActionFactory: {
    // Note on PropsWithNavigation<any>: I tried <T extends ActionDataBase> and making this PropsWithNavigation<T>, but TypeScript
    // currently does not narrow generic types according to their use: https://stackoverflow.com/a/67378667
    // All action parameters should be PropsWithNavigation<T extends ActionDataBase>.
    [actionType: string]: (
        action: PropsWithNavigation<any>,
    ) => (params: any) => void;
} = {
    navigate:
        ({ to, navigation }: PropsWithNavigation<NavigateActionData>) =>
        () => {
            navigation.navigate(to);
        },
    toggle:
        ({ altButtons }: PropsWithNavigation<ToggleActionData>) =>
        (
            setButtonData: React.Dispatch<
                React.SetStateAction<Omit<BasicButtonData, 'type'>>
            >,
        ) => {
            setButtonData(buttonData => {
                let ind = altButtons.indexOf(buttonData);
                // We will assume that, if the buttonData is not found, it is the 0th index as its object is copied and the reference will not match
                if (ind < 0) {
                    ind = 0;
                }
                const newButtonData = altButtons[(ind + 1) % altButtons.length];
                return {
                    ...newButtonData,
                    style: [buttonData.style, newButtonData.style],
                };
            });
        },
};

/** All available action types. An action is a function that does something based on the data that defines it */
export type ActionType = keyof typeof ActionFactory;

/** The data that defines an action that navigates to the specified screen */
export type NavigateActionData = {
    type: 'navigate';
    to: string;
} & ActionDataBase;

// TODO: Consider removing toggle action and making actions parameter-less and not allowed to affect state.
// Could make a new ButtonType and all that type infrastructure to make a toggleable button instead of toggle action.
/** The data that defines an action that toggles the button to alternate button looks */
export type ToggleActionData = {
    type: 'toggle';
    altButtons: Omit<ButtonDataBase, 'type'>[];
} & ActionDataBase;

/** Defining data for every action type. All action types should extend ActionDataBase  */
export type ActionData = NavigateActionData | ToggleActionData;
