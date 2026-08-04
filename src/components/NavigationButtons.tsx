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
  Text,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getSiblingScreenPath } from '../services/NavigationService';
import { getAppScreens } from '../services/ScreenService';
import { BasicButton } from './contents/buttons/BasicButton';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Previous/Next sibling-screen navigation shown at the bottom of content
 * screens. Only shown on leaf screens (no children) that have a sibling.
 */
export const NavigationButtons = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { theme } = useTheme();

  const screen = getAppScreens().screens.get(route.name);
  if (!screen) return null;

  // A screen is a leaf if it doesn't have child subscreens
  const isLeaf = !screen.subscreens || screen.subscreens.length === 0;
  if (!isLeaf) return null;

  const previousPath = getSiblingScreenPath(route.name, -1);
  const nextPath = getSiblingScreenPath(route.name, 1);
  if (!previousPath && !nextPath) return null;

  const prevScreen = previousPath ? getAppScreens().screens.get(previousPath) : null;
  const nextScreen = nextPath ? getAppScreens().screens.get(nextPath) : null;

  const go = (path: string) => navigation.navigate(path);

  return (
    <View style={styles.row}>
      {previousPath && prevScreen ? (
        <BasicButton
          design="navigation"
          onPress={() => go(previousPath)}
          style={styles.buttonContainer}
        >
          <Text style={[styles.mainText, { color: theme.button.textNav }]}>
            ← Previous
          </Text>
          <Text style={[styles.subText, { color: theme.button.textNav }]} numberOfLines={1}>
            {prevScreen.title || prevScreen.id}
          </Text>
        </BasicButton>
      ) : (
        <View style={styles.buttonContainer} />
      )}
      {nextPath && nextScreen ? (
        <BasicButton
          design="navigation"
          onPress={() => go(nextPath)}
          style={styles.buttonContainer}
        >
          <Text style={[styles.mainText, { color: theme.button.textNav }]}>
            Next →
          </Text>
          <Text style={[styles.subText, { color: theme.button.textNav }]} numberOfLines={1}>
            {nextScreen.title || nextScreen.id}
          </Text>
        </BasicButton>
      ) : (
        <View style={styles.buttonContainer} />
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
    gap: 15,
  },
  buttonContainer: {
    flex: 1,
  },
  mainText: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  subText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
    opacity: 0.8,
  },
});
