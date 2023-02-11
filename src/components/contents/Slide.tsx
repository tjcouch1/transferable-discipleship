import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import Theme from '../../Theme';
import { createDesignStyleSheets } from '../../util/DesignStyleSheets';
import { ContentList, ContentListData } from './ContentList';
import { ContentData, ContentDataBase } from './Contents';
import { HeaderText, HeaderTextData } from './HeaderText';
import { SubheaderText, SubheaderTextData } from './SubheaderText';
import { Text, TextData } from './Text';

export type SlideContentData = ContentDataBase & {
  type: 'Slide';
  headerText?: HeaderTextData;
  style?: StyleProp<ViewStyle>;
} & ContentListData;

/**
 * Data that defines Slide but without the type
 * (useful when you want to use Slide in another component)
 */
export type SlideData = Omit<SlideContentData, 'type'>;

/** Props the Slide needs to function */
export interface SlideProps extends SlideData {}

export const Slide = (slideProps: SlideProps) => {
  const { headerText, style, ...contentListProps } = slideProps;

  const designStyle = designStyles[''];
  return (
    <View style={[designStyle.headerView, style]}>
      {headerText && (
        <HeaderText
          {...headerText}
          style={[designStyle.headerText, headerText.style]}
        />
      )}
      <ContentList {...contentListProps} />
    </View>
  );
};

const designStyles = createDesignStyleSheets(
  {
    headerView: {
      paddingVertical: 10,
      backgroundColor: Theme.default.backgroundColor,
      paddingHorizontal: 15,
      width: '90%',
      borderBottomWidth: 10,
      borderBottomColor: Theme.dimmed.backgroundColor,
    },
    headerText: {
      fontSize: 25,
      fontWeight: '600',
    },
  },
  {},
);
