import React, { useEffect, useState } from 'react';
import {
  View,
  ViewStyle,
  StyleProp,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import theme from '../../Theme';
import { createDesignStyleSheets } from '../../util/DesignStyleSheets';
import { ContentList, ContentListData, ContentListDesign } from './ContentList';
import { ContentDataBase } from './Contents';
import { HeaderText, HeaderTextData } from './HeaderText';
import { Text, getTextDataObject } from './Text';

export type SlideContentData = ContentDataBase & {
  type: 'Slide';
  headerText?: HeaderTextData;
  /** Whether or not you can press the header to open and close the slide. Defaults to true */
  canClose?: boolean;
  /** Whether the slide is open by default. Only applicable if `canClose` is true */
  isOpenDefault?: boolean;
  /** The design for the slide overall */
  design?: SlideDesign;
  /** The design for the content list in the slide */
  contentDesign?: ContentListDesign
  style?: StyleProp<ViewStyle>;
} & Omit<ContentListData, 'design'>;

type SlideDesign = 'normal' | 'primary';

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
    canClose = true,
    isOpenDefault = false,
    isOpen: isOpenProp,
    onChange,
    design = 'normal',
    style,
    ...contentListProps
  } = slideProps;
  const headerTextObject = headerText
    ? getTextDataObject(headerText)
    : undefined;

  const [isOpen, setIsOpen] = useState(
    canClose ? isOpenProp ?? isOpenDefault : true,
  );

  useEffect(() => {
    if (canClose && isOpenProp !== undefined) setIsOpen(isOpenProp);
  }, [canClose, isOpenProp]);

  // Just use the one design style available
  const designStyle = designStyles[design];
  return (
    <View
      style={[
        designStyle.slideView,
        isOpen ? designStyle.slideViewOpen : undefined,
        style,
      ]}>
      <TouchableWithoutFeedback
        onPress={() => {
          if (canClose) {
            if (isOpenProp !== undefined) {
              if (onChange) onChange(!isOpen);
            } else setIsOpen(!isOpen);
          }
        }}>
        <View
          style={[
            designStyle.headerView,
            isOpen ? undefined : designStyle.headerViewClosed,
            designStyle.contentView,
            canClose ? designStyle.pressableHeaderView : undefined,
          ]}>
          {headerTextObject && (
            <HeaderText
              {...headerTextObject}
              style={[designStyle.headerText, headerTextObject.style]}
            />
          )}
          {canClose && (
            <Text
              design="small"
              style={[designStyle.chevron, isOpen ? undefined : designStyle.chevronClosed]}
              text={isOpen ? '^' : 'v'}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
      <ContentList
        style={[
          designStyle.contentView,
          isOpen ? undefined : designStyle.closedContent,
        ]}
        {...contentListProps}
        design={contentListProps.contentDesign}
      />
    </View>
  );
};

const designStyles = createDesignStyleSheets(
  {
    slideView: {
      backgroundColor: theme.fillLight,
      width: '90%',
      borderBottomWidth: 10,
      borderBottomColor: theme.fillMid,
    },
    slideViewOpen: {
      paddingBottom: 10,
    },
    headerView: {
      paddingTop: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerViewClosed: {
      paddingBottom: 10,
    },
    contentView: {
      paddingHorizontal: 15,
    },
    pressableHeaderView: {
      // Display cursor on web https://github.com/necolas/react-native-web/issues/506#issuecomment-1412166955
      // This is here to avoid errors with the next line. This is just confirming the default display
      display: 'flex',
      ...Platform.select({ web: { cursor: 'pointer' } }),
    },
    headerText: {
      fontSize: 23,
      fontWeight: '700',
      color: theme.accentDark
    },
    chevron: {
      fontWeight: '700',
    },
    chevronClosed: {
      fontWeight: '500',
    },
    closedContent: {
      // Just hide the contents if the slide is closed so it can load while hidden
      display: 'none',
    },
  },
  {
    primary: {
      headerText: {
        color: theme.primaryLight
      }
    }
  },
);
