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

  const { screens } = getAppScreens();
  if (!screens.has(route.name)) return null;

  // e.g. 'app:/Home/Basics/Prayer' -> ['app:', 'Home', 'Basics', 'Prayer']
  const segments = route.name.split(PATH_DELIMITER);
  if (segments.length <= 2) return null; // Home (or shallower): no trail

  // Ancestors and current screen (skip the 'app:' root segment)
  const crumbs = segments.slice(1).map((segment, i) => {
    const path = segments.slice(0, i + 2).join(PATH_DELIMITER);
    return { path, title: screens.get(path)?.title ?? segment };
  });

  return (
    <View style={[styles.row, { backgroundColor: theme.header.background }]}>
      {crumbs.map((crumb, i) => (
        <React.Fragment key={crumb.path}>
          {i > 0 && (
            <ReactText
              style={[styles.separator, { color: 'white' }]}>
              ›
            </ReactText>
          )}
          <ReactText
            style={[
              styles.crumb,
              styles.linkCrumb,
              { color: i === crumbs.length - 1 ? 'white' : theme.slide.headerText },
            ]}
            onPress={() => navigation.navigate(crumb.path)}>
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
    paddingVertical: 12,
  },
  crumb: {
    fontSize: 15,
  },
  linkCrumb: {
    fontWeight: '600',
  },
  separator: {
    fontSize: 15,
    paddingHorizontal: 5,
  },
});
