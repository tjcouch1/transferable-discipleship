/**
 * SettingsScreen.tsx - Settings screen with dark mode toggle
 */

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View, Switch, Text } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Header } from '../contents/Header';
import TScrollView from '../TScrollView';

export const SettingsScreen = ({}: NativeStackScreenProps<any>) => {
  const { isDarkMode, toggleTheme, theme } = useTheme();

  return (
    <TScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.container}>
        <Header headerText="Settings" />
        <View style={[styles.settingItem, { backgroundColor: theme.slide.background }]}>
          <View style={styles.settingContent}>
            <Text style={[styles.settingLabel, { color: theme.text.headerText }]}>
              Dark Mode
            </Text>
            <Text style={[styles.settingDescription, { color: theme.text.lineText }]}>
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
      </View>
    </TScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  settingContent: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
});
