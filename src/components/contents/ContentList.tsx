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

import React, { useContext, useState } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { createDesignStyleSheets } from '../../util/DesignStyleSheets';
import { ContentData, ContentDataBase } from './Contents';
import ContentsModuleContext from './ContentsContext';
import { isString } from '../../util/Util';
import {
  TextContentDataObject,
  TextDataObjectBase,
  getTextDataObject,
} from './Text';

export interface ContentListContentData extends ContentDataBase {
  type: 'ContentList';
  contents: ContentData[];
  /** Whether this content list should control which openable contents are open. Defaults to true */
  controlIsOpen?: boolean;
  /** Which index of the openable contents to open by default. Set to -1 (default) to leave all closed. Only functional if `controlIsOpen` is true */
  openIndexDefault?: number;
  padTop?: boolean;
  padBottom?: boolean;
  padding?: number;
  design?: ContentListDesign;
  style?: StyleProp<ViewStyle>;
}

export type ContentListDesign = keyof typeof ContentListDesignPadding;

const ContentListDesignPadding = {
  'no-padding': 0,
  tight: 15,
  comfortable: 30,
  loose: 45,
};
export const getContentListDesignPadding = (
  padding: number | undefined,
  design: ContentListDesign = 'comfortable',
) => (padding !== undefined ? padding : ContentListDesignPadding[design]);

/**
 * Data that defines ContentList but without the type
 * (useful when you want to use ContentList in another component)
 */
export type ContentListData = Omit<ContentListContentData, 'type'>;

/** Props the Slide needs to function */
export interface ContentListProps extends ContentListData {}

export const ContentList = ({
  contents = [],
  controlIsOpen = true,
  openIndexDefault = -1,
  padTop = true,
  padBottom = true,
  padding,
  design = 'comfortable',
  style,
}: ContentListProps) => {
  const { Contents, isOpenable } = useContext(ContentsModuleContext);

  const designStyle = designStyles[design];
  const contentPadding = getContentListDesignPadding(padding, design);

  const [openIndex, setOpenIndex] = useState(openIndexDefault);

  let openableIndex = -1;

  return (
    <View
      style={[
        designStyle.layout,
        {
          marginTop: padTop ? contentPadding : undefined,
          gap: contentPadding,
          marginBottom: padBottom ? contentPadding : undefined,
        },
        style,
      ]}>
      {contents.map((content, i) => {
        // Get full content data for this content (if it is a string, build it into a TextContentData)
        const contentObject = isString(content)
          ? ({
              type: 'Text',
              ...(getTextDataObject(content) as TextDataObjectBase),
            } as TextContentDataObject)
          : content;

        const openObject: {
          isOpen?: boolean;
          onChange?: (isOpening: boolean) => void;
        } = {};
        // TODO: Make this openable check a function from Contents.tsx
        if (controlIsOpen && isOpenable(contentObject)) {
          openableIndex += 1;
          const thisOpenableIndex = openableIndex;
          openObject.isOpen = openIndex === openableIndex;
          openObject.onChange = isOpening =>
            isOpening ? setOpenIndex(thisOpenableIndex) : setOpenIndex(-1);
        }

        return React.createElement(Contents[contentObject.type], {
          // TODO: Consider adding a key to ContentDataBase?
          key: i,
          ...contentObject,
          ...openObject,
        });
      })}
    </View>
  );
};

const designStyles = createDesignStyleSheets(
  {
    layout: { width: '100%', alignItems: 'center' },
  },
  {},
);
