import React, { useContext, useState } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { createDesignStyleSheets } from '../../util/DesignStyleSheets';
import { ContentData, ContentDataBase } from './Contents';
import ContentsContext from './ContentsContext';
import { isString } from '../../util/Util';
import { TextDataObjectBase, getTextDataObject } from './Text';

export interface ContentListContentData extends ContentDataBase {
  type: 'ContentList';
  contents: ContentData[];
  controlIsOpen?: boolean;
  /** Which index to open by default. Set to -1 (default) to leave all closed. Only functional if `controlIsOpen` is true */
  isOpenDefault?: number;
  padTop?: boolean;
  padBottom?: boolean;
  padding?: number;
  design?: ContentListDesign;
  style?: StyleProp<ViewStyle>;
}

type ContentListDesign = keyof typeof ContentListDesignPadding;
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
  isOpenDefault = -1,
  padTop = true,
  padBottom = true,
  padding,
  design = 'comfortable',
  style,
}: ContentListProps) => {
  const Contents = useContext(ContentsContext);

  const designStyle = designStyles[design];
  const contentPadding = getContentListDesignPadding(padding, design);

  const [openIndex, setOpenIndex] = useState(isOpenDefault);

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
          ? {
              type: 'Text',
              ...(getTextDataObject(content) as TextDataObjectBase),
            }
          : content;

        const openObject: { isOpen?: boolean, onChange?: (isOpening: boolean) => void } = {};
        // TODO: Make this openable check a function from Contents.tsx
        if (controlIsOpen && (contentObject.type === 'Slide' || contentObject.type === 'ScriptureSlide')) {
          openableIndex += 1;
          const thisOpenableIndex = openableIndex;
          openObject.isOpen = openIndex === openableIndex;
          openObject.onChange = (isOpening) => isOpening ? setOpenIndex(thisOpenableIndex) : setOpenIndex(-1);
        }

        return React.createElement(Contents[contentObject.type], {
          // TODO: Consider adding a key to ContentDataBase?
          key: i,
          ...contentObject,
          ...openObject
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
