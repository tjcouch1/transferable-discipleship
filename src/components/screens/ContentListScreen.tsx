import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { ScreenDataBase } from './Screens';
import { getScreenData } from '../../services/ScreenService';
import { ContentData, Contents } from '../contents/Contents';
import TScrollView from '../TScrollView';
import { ContentList } from '../contents/ContentList';

/** The data that defines the ContentListScreen screen */
export type ContentListScreenData = {
  type: 'ContentListScreen';
  contents: ContentData[];
  style?: StyleProp<ViewStyle>;
} & ScreenDataBase;

/** Screen with a header and a list of buttons */
export const ContentListScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<any>) => {
  const { contents, style } = getScreenData(route.name) as ContentListScreenData;

  return (
    <TScrollView contentInsetAdjustmentBehavior="automatic">
      <ContentList contents={contents} style={style} />
    </TScrollView>
  );
};
