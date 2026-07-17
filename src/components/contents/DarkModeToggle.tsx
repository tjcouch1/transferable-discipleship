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
import { StyleSheet, Switch, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
// import type: avoids a runtime circular import (Contents.ts imports this file)
import type { ContentDataBase } from './Contents';
import { Text } from './Text';

/** A labeled switch that toggles between the light and dark theme */
export type DarkModeToggleContentData = ContentDataBase & {
  type: 'DarkModeToggle';
};

export const DarkModeToggle = () => {
  const { theme, isDark, setMode } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text
          design="small"
          text="Switch between light and dark theme"
          style={styles.description}
        />
      </View>
      <Switch
        value={isDark}
        onValueChange={value => setMode(value ? 'dark' : 'light')}
        trackColor={{ false: theme.slide.bottom, true: theme.button.background }}
        thumbColor={theme.slide.background}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    paddingVertical: 8,
  },
  content: {
    flex: 1,
    marginRight: 16,
  },
  description: {
    textAlign: 'left',
  },
});
