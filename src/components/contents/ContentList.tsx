import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { createDesignStyleSheets } from '../../util/DesignStyleSheets';
import { ContentData, ContentDataBase, Contents } from './Contents';

export interface ContentListContentData extends ContentDataBase {
  type: 'ContentList';
  contents: ContentData[];
  spaceFirst?: boolean;
  spaceLast?: boolean;
  design?: ContentListDesign;
  style?: StyleProp<ViewStyle>;
}

type ContentListDesign = 'no-padding' | 'tight' | 'comfortable' | 'loose';

/**
 * Data that defines ContentList but without the type
 * (useful when you want to use ContentList in another component)
 */
export type ContentListData = Omit<ContentListContentData, 'type'>;

/** Props the Slide needs to function */
export interface ContentListProps extends ContentListData {}

export const ContentList = ({
  contents = [],
  spaceFirst = true,
  spaceLast = true,
  design = 'comfortable',
  style,
}: ContentListProps) => {
  const designStyle = designStyles[design];

  return (
    <View style={[designStyle.layout, style]}>
      {contents.map((content, i) => {
        // Figure out the right spacing for this content
        const contentStyles = [designStyle.content];
        if ((i !== 0 && i !== contents.length) || (spaceFirst && i === 0))
          contentStyles.push(designStyle.spacedTop);
        else if (spaceLast && i === contents.length)
          contentStyles.push(designStyle.spacedBottom);

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
    spacedTop: {
      paddingTop: 30,
    },
    spacedBottom: {
      paddingBottom: 30,
    },
    content: {
      alignItems: 'center',
    },
  },
  {
    'no-padding': {
      spacedTop: {
        paddingTop: 0,
      },
      spacedBottom: {
        paddingBottom: 0,
      },
    },
    tight: {
      spacedTop: {
        paddingTop: 15,
      },
      spacedBottom: {
        paddingBottom: 15,
      },
    },
    loose: {
      spacedTop: {
        paddingTop: 45,
      },
      spacedBottom: {
        paddingBottom: 45,
      },
    },
  },
);
