import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { ScreenDataBase } from './Screens';
import { getScreenData } from '../../services/ScreenService';
import { ContentData, Contents } from '../contents/Contents';
import TScrollView from '../TScrollView';
import { ContentList, ContentListData } from '../contents/ContentList';

/** The data that defines the ContentListScreen screen */
export type ContentListScreenData = {
  type: 'ContentListScreen';
} & ContentListData &
  ScreenDataBase;

/** Screen with a header and a list of buttons */
export const ContentListScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<any>) => {
  // Default spaceFirst and spaceLast to false instead of true like in ContentList
  const {
    spaceFirst = false,
    spaceLast = false,
    ...screenData
  } = getScreenData(route.name) as ContentListScreenData;

  return (
    <TScrollView contentInsetAdjustmentBehavior="automatic">
      <ContentList
        {...screenData}
        spaceFirst={spaceFirst}
        spaceLast={spaceLast}
      />
    </TScrollView>
  );
};
