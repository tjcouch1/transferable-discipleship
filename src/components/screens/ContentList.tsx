import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { ScreenDataBase } from './Screens';
import { getScreenData } from '../../services/ScreenService';
import { ContentData, Contents } from '../contents/Contents';
import TScrollView from '../TScrollView';

/** The data that defines the ContentList screen */
export type ContentListData = {
  type: 'ContentList';
  contents: ContentData[];
  style?: StyleProp<ViewStyle>;
} & ScreenDataBase;

/** Screen with a header and a list of buttons */
export const ContentList = ({
  navigation,
  route,
}: NativeStackScreenProps<any>) => {
  const { contents, style } = getScreenData(route.name) as ContentListData;

  return (
    <TScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={[styles.layout, style]}>
        {contents.map((content, i) =>
          React.createElement(Contents[content.type], {
            // TODO: Consider adding a key to ContentDataBase?
            key: i,
            ...content,
            navigation,
          }),
        )}
      </View>
    </TScrollView>
  );
};

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
