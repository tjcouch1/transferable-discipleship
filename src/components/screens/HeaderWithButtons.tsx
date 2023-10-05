/**
 * Copyright (C) 2023 TJ Couch
 * This file is part of discipleship‑app‑template.
 *
 * discipleship‑app‑template is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * discipleship‑app‑template is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with discipleship‑app‑template. If not, see <http://www.gnu.org/licenses/>.
 */

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
