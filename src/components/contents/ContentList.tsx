import React, { useContext } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { createDesignStyleSheets } from '../../util/DesignStyleSheets';
import { ContentData, ContentDataBase } from './Contents';
import ContentsContext from './ContentsContext';

export interface ContentListContentData extends ContentDataBase {
  type: 'ContentList';
  contents: ContentData[];
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
  padTop = true,
  padBottom = true,
  padding,
  design = 'comfortable',
  style,
}: ContentListProps) => {
  const Contents = useContext(ContentsContext);

  const designStyle = designStyles[design];
  const contentPadding = getContentListDesignPadding(padding, design);

  return (
    <View style={[designStyle.layout, style]}>
      {contents.map((content, i) => {
        // Figure out the right spacing for this content
        const contentStyles = [designStyle.content];
        if ((i !== 0 && i !== contents.length) || (padTop && i === 0))
          contentStyles.push({ paddingTop: contentPadding });
        else if (padBottom && i === contents.length)
          contentStyles.push({ paddingBottom: contentPadding });

        return (
          <View style={contentStyles} key={i}>
            {React.createElement(Contents[content.type], {
              // TODO: Consider adding a key to ContentDataBase?
              /* key: i, */
              ...content,
            })}
          </View>
        );
      })}
    </View>
  );
};

const designStyles = createDesignStyleSheets(
  {
    layout: {},
    content: {
      alignItems: 'center',
    },
  },
  {},
);
