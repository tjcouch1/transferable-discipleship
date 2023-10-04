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
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { ScreenDataBase } from './Screens';
import { getScreenData } from '../../services/ScreenService';
import { ContentData, Contents } from '../contents/Contents';
import TScrollView from '../TScrollView';
import {
  ContentList,
  ContentListData,
  getContentListDesignPadding,
} from '../contents/ContentList';

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
    padTop = false,
    padBottom = false,
    ...screenData
  } = getScreenData(route.name) as ContentListScreenData;

  return (
    <TScrollView
      bottomPadding={getContentListDesignPadding(
        screenData.padding,
        screenData.design,
      )}
      contentInsetAdjustmentBehavior="automatic">
      <ContentList {...screenData} padTop={padTop} padBottom={padBottom} />
    </TScrollView>
  );
};
