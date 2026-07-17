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
import { StyleSheet, Text as ReactText, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useProgress } from '../contexts/ProgressContext';
import { useTheme } from '../contexts/ThemeContext';
import { getAppScreens } from '../services/ScreenService';
import { PATH_DELIMITER } from '../util/PathUtil';

/**
 * Clickable trail of ancestor screens (`Home › … › parent`) derived from the
 * route path. The current screen isn't included — its name is already shown in
 * the screen header. Hidden on Home and on paths not in the screen map.
 */
export const Breadcrumb = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { theme } = useTheme();
  const { markVisited } = useProgress();

  const { screens } = getAppScreens();
  if (!screens.has(route.name)) return null;

  // e.g. 'app:/Home/Basics/Prayer' -> ['app:', 'Home', 'Basics', 'Prayer']
  const segments = route.name.split(PATH_DELIMITER);
  if (segments.length <= 2) return null; // Home (or shallower): no trail

  // Ancestors only (skip the 'app:' root segment and the current screen)
  const crumbs = segments.slice(1, -1).map((segment, i) => {
    const path = segments.slice(0, i + 2).join(PATH_DELIMITER);
    return { path, title: screens.get(path)?.title ?? segment };
  });

  return (
    <View style={styles.row}>
      {crumbs.map((crumb, i) => (
        <React.Fragment key={crumb.path}>
          {i > 0 && (
            <ReactText
              style={[styles.separator, { color: theme.text.subheaderText }]}>
              ›
            </ReactText>
          )}
          <ReactText
            style={[
              styles.crumb,
              styles.linkCrumb,
              { color: theme.slide.headerText },
            ]}
            onPress={() => {
              markVisited(crumb.path);
              navigation.navigate(crumb.path);
            }}>
            {crumb.title}
          </ReactText>
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  crumb: {
    fontSize: 13,
  },
  linkCrumb: {
    fontWeight: '600',
  },
  separator: {
    fontSize: 13,
    paddingHorizontal: 5,
  },
});
