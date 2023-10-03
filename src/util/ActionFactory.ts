import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ButtonDataBase } from '../components/contents/buttons/Buttons';
import { BasicButtonData } from '../components/contents/buttons/BasicButton';
import { RouteProp } from '@react-navigation/native';
import { pathJoin } from './PathUtil';
import { Linking } from 'react-native';

//----- ACTION TYPES -----//

/** The base data for an action to perform. All action types should extend ActionDataBase */
export type ActionDataBase = {
  type: ActionType;
};

/** Generic props passed down that allow access to navigation */
export type PropsWithNavigation<T> = T & {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<any>;
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
    ({ to, navigation, route }: PropsWithNavigation<NavigateActionData>) =>
    () => {
      navigation.navigate(pathJoin(route.name, to));
    },
  link:
    ({ to }: PropsWithNavigation<LinkActionData>) =>
    async () => {
      if (await Linking.canOpenURL(to)) Linking.openURL(to);
    },
};

/** All available action types. An action is a function that does something based on the data that defines it */
export type ActionType = keyof typeof ActionFactory;

/** The data that defines an action that navigates to the specified screen */
export type NavigateActionData = {
  type: 'navigate';
  to: string;
} & ActionDataBase;

/** The data that defines an action to open a link */
export type LinkActionData = {
  type: 'link';
  to: string;
} & ActionDataBase;

/** Defining data for every action type. All action types should extend ActionDataBase  */
export type ActionData = NavigateActionData | LinkActionData;
