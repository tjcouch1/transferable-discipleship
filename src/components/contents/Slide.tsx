import React, { useState } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import Theme from '../../Theme';
import { createDesignStyleSheets } from '../../util/DesignStyleSheets';
import { ContentList, ContentListData } from './ContentList';
import { ContentDataBase } from './Contents';
import { HeaderText, HeaderTextData } from './HeaderText';
import { getTextDataObject } from './Text';

export type SlideContentData = ContentDataBase & {
  type: 'Slide';
  headerText?: HeaderTextData;
  isOpenDefault?: boolean;
  style?: StyleProp<ViewStyle>;
} & ContentListData;

/**
 * Data that defines Slide but without the type
 * (useful when you want to use Slide in another component)
 */
export type SlideData = Omit<SlideContentData, 'type'>;

/** Props the Slide needs to function */
export interface SlideProps extends SlideData {
  isOpen?: boolean;
  onChange?: (isOpening: boolean) => void;
}

export const Slide = (slideProps: SlideProps) => {
  const {
    headerText,
    isOpenDefault = false,
    isOpen: isOpenProp,
    onChange,
    style,
    ...contentListProps
  } = slideProps;
  const headerTextObject = headerText
    ? getTextDataObject(headerText)
    : undefined;

  const [isOpen, setIsOpen] = useState(isOpenProp ?? isOpenDefault);

  // Just use the one design style available
  const designStyle = designStyles[''];
  return (
    <View style={[designStyle.headerView, style]}>
      {headerTextObject && (
        <HeaderText
          {...headerTextObject}
          style={[designStyle.headerText, headerTextObject.style]}
          onPress={() => {
            if (isOpenProp !== undefined) {
              if (onChange) onChange(!isOpen);
            } else setIsOpen(!isOpen);
          }}
        />
      )}
      {isOpen && <ContentList {...contentListProps} />}
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
      fontSize: 23,
      fontWeight: '600',
    },
  },
  {},
);
