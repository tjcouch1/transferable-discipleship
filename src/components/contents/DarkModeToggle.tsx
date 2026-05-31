/**
 * DarkModeToggle.tsx - Content component for dark mode toggle switch
 */

import React from 'react';
import { StyleSheet, View, Switch, Text } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { ContentDataBase } from './Contents';

/** The data that defines the DarkModeToggle */
export interface DarkModeToggleContentData extends ContentDataBase {
  type: 'DarkModeToggle';
}

/** Props the DarkModeToggle needs to function */
export interface DarkModeToggleProps extends Omit<DarkModeToggleContentData, 'type'> {}

export const DarkModeToggle = ({}: DarkModeToggleProps) => {
  const { isDarkMode, toggleTheme, theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.slide.background }]}>
      <View style={styles.content}>
        <Text style={[styles.label, { color: theme.text.headerText }]}>
          Dark Mode
        </Text>
        <Text style={[styles.description, { color: theme.text.lineText }]}>
          Switch between light and dark theme
        </Text>
      </View>
      <Switch
        value={isDarkMode}
        onValueChange={toggleTheme}
        trackColor={{ false: '#767577', true: '#007bc6' }}
        thumbColor={isDarkMode ? '#ffffff' : '#f4f3f4'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  content: {
    flex: 1,
    marginRight: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
  },
});

