import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { ScreenDataBase } from './Screens';
import { getScreenData } from '../../services/ScreenService';
import { ContentData, Contents } from '../contents/Contents';
import TScrollView from '../TScrollView';

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
      <View style={[styles.layout, style]}>
        {/* TODO: Replace with ContentList once we can pass navigation down */}
        {contents.map((content, i) =>
          React.createElement(Contents[content.type], {
            // TODO: Consider adding a key to ContentDataBase?
            key: i,
            ...content,
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
