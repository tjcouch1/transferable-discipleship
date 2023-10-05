/**
 * Copyright (C) 2023 TJ Couch
 * This file is part of discipleship‑app‑template.
 *
 * discipleship‑app‑template is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * discipleship‑app‑template is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with discipleship‑app‑template. If not, see <http://www.gnu.org/licenses/>.
 */

import { PropsWithNavigation } from '../../util/ActionFactory';
import { isString } from '../../util/Util';
import { ButtonList, ButtonListContentData } from './ButtonList';
import { ButtonData, Buttons } from './buttons/Buttons';
import { ContentList, ContentListContentData } from './ContentList';
import { Header, HeaderContentData } from './Header';
import { HeaderText, HeaderTextContentData } from './HeaderText';
import { ScriptureSlide, ScriptureSlideContentData } from './ScriptureSlide';
import { ScrRangeDisplay, ScrRangeDisplayContentData } from './ScrRangeDisplay';
import { Slide, SlideContentData } from './Slide';
import { SubheaderText, SubheaderTextContentData } from './SubheaderText';
import { Text, TextContentData } from './Text';
import { Image, ImageContentData } from './Image';

//----- CONTENT TYPES -----//

/** Defining data for every content type. All content types should extend ContentDataBase */
export type ContentData =
  | ButtonData
  | TextContentData
  | HeaderTextContentData
  | SubheaderTextContentData
  | ButtonListContentData
  | HeaderContentData
  | SlideContentData
  | ContentListContentData
  | ScriptureSlideContentData
  | ScrRangeDisplayContentData
  | ImageContentData;

/** All content types available. Content is a component that does various things */
export type ContentType = keyof typeof Contents;

/** The base data that every button must have. All content types should extend ContentDataBase */
export type ContentDataBase = {
  type: ContentType;
};

//----- CONTENTS AND OTHER FUNCTIONS -----//

export const Contents: {
  [contentType: string]: (props: PropsWithNavigation<any>) => JSX.Element;
} = {
  ...Buttons,
  Text,
  HeaderText,
  SubheaderText,
  ButtonList,
  Header,
  Slide,
  ContentList,
  ScriptureSlide,
  ScrRangeDisplay,
  Image,
};

/** Determines whether the content is openable and should be considered for managing its isOpen prop */
export function isOpenable(content: ContentData) {
  return (
    !isString(content) &&
    (content.type === 'Slide' || content.type === 'ScriptureSlide') &&
    // Default is undefined, which is true meaning it can close
    (content.canClose || content.canClose === undefined)
  );
}
