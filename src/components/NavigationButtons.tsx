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
  Text as ReactText,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { getSiblingScreenPath } from '../services/NavigationService';
import { getAppScreens } from '../services/ScreenService';

/**
 * Previous/Next sibling-screen navigation shown at the bottom of content
 * screens. Hidden on screens with `hideNavigationButtons` (e.g. section menus)
 * and on ends without a sibling.
 */
export const NavigationButtons = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { theme } = useTheme();

  const screen = getAppScreens().screens.get(route.name);
  if (!screen || screen.hideNavigationButtons) return null;

  const previousPath = getSiblingScreenPath(route.name, -1);
  const nextPath = getSiblingScreenPath(route.name, 1);
  if (!previousPath && !nextPath) return null;

  const go = (path: string) => navigation.navigate(path);

  const linkColor = theme.slide.headerText;

  return (
    <View style={styles.row}>
      {previousPath ? (
        <TouchableOpacity onPress={() => go(previousPath)}>
          <ReactText style={[styles.link, { color: linkColor }]}>
            ← Previous
          </ReactText>
        </TouchableOpacity>
      ) : (
        <View />
      )}
      {nextPath ? (
        <TouchableOpacity onPress={() => go(nextPath)}>
          <ReactText style={[styles.link, { color: linkColor }]}>
            Next →
          </ReactText>
        </TouchableOpacity>
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
  link: {
    fontSize: 17,
    fontWeight: '600',
  },
});
