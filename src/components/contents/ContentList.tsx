import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import Theme from '../../Theme';
import { createDesignStyleSheets } from '../../util/DesignStyleSheets';
import { ContentData, ContentDataBase, Contents } from './Contents';
import { HeaderText, HeaderTextData } from './HeaderText';
import { SubheaderText, SubheaderTextData } from './SubheaderText';
import { Text, TextData } from './Text';

export interface ContentListContentData extends ContentDataBase {
  type: 'ContentList';
  contents: ContentData[];
  style?: StyleProp<ViewStyle>;
}

/**
 * Data that defines ContentList but without the type
 * (useful when you want to use ContentList in another component)
 */
export type ContentListData = Omit<ContentListContentData, 'type'>;

/** Props the Slide needs to function */
export interface ContentListProps extends ContentListData {}

export const ContentList = ({ contents = [], style }: ContentListProps) => {
  const designStyle = designStyles['default'];
  return (
    <View style={[designStyle.layout, style]}>
      {contents.map((content, i) =>
        React.createElement(Contents[content.type], {
          // TODO: Consider adding a key to ContentDataBase?
          key: i,
          ...content,
        }),
      )}
    </View>
  );
};

const designStyles = createDesignStyleSheets(
  {
    layout: {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  },
  {},
);
