import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Header, HeaderData } from '../contents/Header';
import { ScreenDataBase } from './Screens';
import { getScreenData } from '../../services/ScreenService';
import { ButtonList, ButtonListData } from '../contents/ButtonList';
import TScrollView from '../TScrollView';

/** The data that defines the HeaderWithButtons screen */
export type HeaderWithButtonsData = {
  type: 'HeaderWithButtons';
  headerData: HeaderData;
  buttonListData: ButtonListData;
} & ScreenDataBase;

/** Screen with a header and a list of buttons */
export const HeaderWithButtons = ({
  navigation,
  route,
}: NativeStackScreenProps<any>) => {
  const { headerData, buttonListData } = getScreenData(
    route.name,
  ) as HeaderWithButtonsData;

  return (
    <TScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.layout}>
        <Header {...headerData} />
        <ButtonList {...buttonListData} />
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
