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
import { TouchableOpacity, StyleSheet, Text, ViewStyle } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getPreviousSiblingScreenPath } from '../../services/NavigationService';
import { markScreenProgress } from '../../services/ProgressService';
import { markScreenAsVisited } from '../../util/ActionFactory';
import { useProgress } from '../../contexts/ProgressContext';

interface PreviousButtonProps {
  style?: ViewStyle;
}

/**
 * List of screen paths that should not show the Previous button
 */
const EXCLUDED_SCREENS = [
  'app:/Home/Start Here/WhyUseTD',
  'app:/Home/Start Here/The Challenge',
  'app:/Home/Start Here/Basics',
  'app:/Home/Start Here/Basics/Gospel Review',
  'app:/Home/Start Here/Basics/Scripture 1.0',
  'app:/Home/Start Here/Basics/Assurance of Salvation',
  'app:/Home/Start Here/Basics/Holy Spirit',
  'app:/Home/Start Here/Basics/Prayer',
];

/**
 * Previous button that navigates to the previous sibling screen
 * Only shows if there is a previous sibling screen
 */
export const PreviousButton: React.FC<PreviousButtonProps> = ({ style }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { refreshProgress } = useProgress();

  // Don't show Previous button on excluded screens
  if (EXCLUDED_SCREENS.includes(route.name)) {
    return null;
  }

  const previousScreenPath = getPreviousSiblingScreenPath(route.name);

  if (!previousScreenPath) {
    return null; // No previous screen, don't render
  }

  const handlePress = async () => {
    // Mark previous screen as visited and track progress
    markScreenAsVisited(previousScreenPath);
    try {
      await markScreenProgress(previousScreenPath);
      await refreshProgress();
    } catch (err) {
      console.error('Failed to mark screen progress:', err);
    }
    navigation.navigate(previousScreenPath as never);
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      activeOpacity={0.7}>
      <Text style={styles.text}>Previous</Text>
      <Text style={styles.arrow}>←</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 32,
    marginBottom: 16,
    alignSelf: 'flex-start',
    marginLeft: 16,
  },
  arrow: {
    fontSize: 24,
    color: '#ff9700', // Cru orange
    marginLeft: 8,
  },
  text: {
    fontSize: 18,
    color: '#ff9700', // Cru orange
    fontWeight: '600',
  },
});

