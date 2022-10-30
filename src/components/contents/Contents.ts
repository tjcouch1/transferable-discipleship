import { PropsWithNavigation } from '../../util/ActionFactory';
import { ButtonList, ButtonListContentData } from './ButtonList';
import { ButtonData, Buttons } from './buttons/Buttons';
import { Header, HeaderContentData } from './Header';
import { HeaderText, HeaderTextContentData } from './HeaderText';
import { SubheaderText, SubheaderTextContentData } from './SubheaderText';
import { Text, TextContentData } from './Text';

//----- CONTENT TYPES -----//

export const Contents: {
    [contentType: string]: (props: PropsWithNavigation<any>) => JSX.Element;
} = {
    ...Buttons,
    Text,
    HeaderText,
    SubheaderText,
    ButtonList,
    Header,
};

/** Defining data for every content type. All content types should extend ContentDataBase */
export type ContentData =
    | ButtonData
    | TextContentData
    | HeaderTextContentData
    | SubheaderTextContentData
    | ButtonListContentData
    | HeaderContentData;

/** All content types available. Content is a component that does various things */
export type ContentType = keyof typeof Contents;

/** The base data that every button must have. All content types should extend ContentDataBase */
export type ContentDataBase = {
    type: ContentType;
};
