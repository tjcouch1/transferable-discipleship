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

import React, { useMemo } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { getScreenData } from '../../services/ScreenService';
import { ROOT_PATH, PATH_DELIMITER, pathJoin } from '../../util/PathUtil';
import { markScreenAsVisited } from '../../util/ActionFactory';
import { markScreenProgress } from '../../services/ProgressService';
import { useProgress } from '../../contexts/ProgressContext';

interface BreadcrumbProps {
  style?: ViewStyle;
}

interface BreadcrumbItem {
  path: string;
  title: string;
  isLast: boolean;
}

/**
 * Breadcrumb component that shows navigation path
 * Only displays if path has more than one segment (not on Home)
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({ style }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const { refreshProgress } = useProgress();

  const breadcrumbItems = useMemo<BreadcrumbItem[]>(() => {
    const currentPath = route.name as string;
    
    // Filter out ROOT_PATH and empty segments
    const pathParts = currentPath.split(PATH_DELIMITER).filter(p => p && p !== 'app:');
    
    // Don't show breadcrumb on root/home screen (only one segment)
    if (pathParts.length <= 1) {
      return [];
    }
    
    // Build breadcrumb items
    const items: BreadcrumbItem[] = [];
    let hasShownStartHere = false;
    
    for (let i = 0; i < pathParts.length; i++) {
      // Build path up to current segment
      const segmentPath = pathJoin(ROOT_PATH, ...pathParts.slice(0, i + 1));
      
      // Get screen data to retrieve title
      const screenData = getScreenData(segmentPath);
      let title = screenData.title || pathParts[i];
      
      // If this title is "Start Here" and we've already shown "Start Here", use the screen ID instead
      // This prevents duplicate "Start Here" entries in breadcrumbs
      if (title === 'Start Here' && hasShownStartHere) {
        // Use the path segment ID as fallback, or try to get headerText from screen contents
        title = pathParts[i];
        
        // Try to get a better title from the screen's headerText if available
        if (screenData && 'contents' in screenData && Array.isArray(screenData.contents)) {
          const headerContent = screenData.contents.find(
            (content: any) => content.type === 'Header' && content.headerText
          );
          if (headerContent && headerContent.headerText) {
            title = headerContent.headerText;
          }
        }
      }
      
      // Track if we've shown "Start Here"
      if (title === 'Start Here') {
        hasShownStartHere = true;
      }
      
      items.push({
        path: segmentPath,
        title,
        isLast: i === pathParts.length - 1,
      });
    }
    
    // Filter out "Start Here" when it's an intermediate segment leading directly to Basics, top-level lessons, About, or Resources
    // Keep "Start Here" when navigating through it to other screens like "Why use TD" or "The Challenge"
    const filteredItems = items.filter((item, index) => {
      // Always keep if it's not "Start Here"
      if (item.title !== 'Start Here') {
        return true;
      }
      
      // Always keep if it's the last item
      if (index === items.length - 1) {
        return true;
      }
      
      // If so, skip "Start Here" since these can be navigated to directly from Home
      const nextItem = items[index + 1];
      const directNavigationTargets = ['Basics', 'Resources', 'About'];
      
      if (nextItem && directNavigationTargets.includes(nextItem.title)) {
        return false; // Skip "Start Here" for direct navigation paths
      }
      
      // Keep "Start Here" for other navigation paths (like Why use TD, The Challenge, etc.)
      return true;
    });
    
    // Update isLast for the filtered items
    if (filteredItems.length > 0) {
      filteredItems[filteredItems.length - 1].isLast = true;
      // Ensure other items are not marked as last
      for (let i = 0; i < filteredItems.length - 1; i++) {
        filteredItems[i].isLast = false;
      }
    }
    
    return filteredItems;
  }, [route.name]);

  // Don't render if no breadcrumb items (e.g., on Home screen)
  if (breadcrumbItems.length === 0) {
    return null;
  }

  const handlePress = async (item: BreadcrumbItem) => {
    // Don't navigate if it's the current screen
    if (item.isLast) {
      return;
    }
    
    // Mark screen as visited and track progress
    markScreenAsVisited(item.path);
    try {
      await markScreenProgress(item.path);
      await refreshProgress();
    } catch (err) {
      console.error('Failed to mark screen progress:', err);
    }
    navigation.navigate(item.path as never);
  };

  return (
    <View style={[styles.container, style]}>
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.path}>
          {index > 0 && (
            <Text style={[styles.separator, { color: theme.text.subheaderText }]}>
              {' › '}
            </Text>
          )}
          <TouchableOpacity
            onPress={() => handlePress(item)}
            disabled={item.isLast}
            activeOpacity={item.isLast ? 1 : 0.7}>
            <Text
              style={[
                styles.text,
                {
                  color: item.isLast
                    ? theme.text.headerText
                    : theme.slide.headerText, // Cru orange for clickable items
                  fontWeight: item.isLast ? '600' : '500',
                },
              ]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
  },
  separator: {
    fontSize: 13,
    opacity: 0.5,
    marginHorizontal: 4,
  },
});

