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

import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getSiblingScreenPath } from '../services/NavigationService';
import { getAppScreens } from '../services/ScreenService';
import { BasicButton } from './contents/buttons/BasicButton';

/**
 * Previous/Next sibling-screen navigation shown at the bottom of content
 * screens. Only shown on leaf screens (no children) that have a sibling.
 */
export const NavigationButtons = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();

  const screen = getAppScreens().screens.get(route.name);
  if (!screen) return null;

  // A screen is a leaf if it doesn't have child subscreens
  const isLeaf = !screen.subscreens || screen.subscreens.length === 0;
  if (!isLeaf) return null;

  const previousPath = getSiblingScreenPath(route.name, -1);
  const nextPath = getSiblingScreenPath(route.name, 1);
  if (!previousPath && !nextPath) return null;

  const go = (path: string) => navigation.navigate(path);

  return (
    <View style={styles.row}>
      {previousPath ? (
        <BasicButton
          type="BasicButton"
          design="navigation"
          text={{ text: '← Previous' }}
          onPress={() => go(previousPath)}
        />
      ) : (
        <View />
      )}
      {nextPath ? (
        <BasicButton
          type="BasicButton"
          design="navigation"
          text={{ text: 'Next →' }}
          onPress={() => go(nextPath)}
        />
      ) : (
        <View />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
});
