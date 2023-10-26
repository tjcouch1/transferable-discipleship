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

import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { isDev, isWeb } from '../util/Util';

/**
 * Wraps the application in a "phone" layout on web for easy preview
 */
export default function WebWrapper({ children }: PropsWithChildren) {
  return isWeb() && isDev() ? (
    <View style={[styles.screen]}>
      <View style={[styles.phone]}>{children}</View>
    </View>
  ) : (
    <>{children}</>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  phone: {
    width: 360,
    height: 720,
    borderWidth: 3,
    borderRadius: 3,
  },
});
