import { StyleProp, TextStyle } from 'react-native';
import { PropsWithNavigation } from '../../util/ActionFactory';
import { ButtonList, ButtonListData } from './ButtonList';
import { ButtonData, Buttons } from './buttons/Buttons';
import { Header, HeaderData } from './Header';

//----- CONTENT TYPES -----//

export const Contents: {
    [contentType: string]: (props: PropsWithNavigation<any>) => JSX.Element;
} = {
    ...Buttons,
    ButtonList,
    Header,
};

/** All content types available. Content is a component that does various things */
export type ContentType = keyof typeof Contents;

/** The base data that every button must have. All content types should extend ContentDataBase */
export type ContentDataBase = {
    type: ContentType;
};

/** Defining data for every content type. All content types should extend ContentDataBase */
export type ContentData = ButtonData | ButtonListData | HeaderData;

/** Simple defining data for displaying text */
export interface TextData {
    text: string;
    style?: StyleProp<TextStyle>;
}
