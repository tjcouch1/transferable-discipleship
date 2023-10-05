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

import React, { useCallback, useMemo } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAppScreens } from './src/services/ScreenService';
import { Screens } from './src/components/screens/Screens';
import WebWrapper from './src/components/WebWrapper';
import ContentsModuleContext from './src/components/contents/ContentsContext';
import * as ContentsModule from './src/components/contents/Contents';
import theme from './src/Theme';
import { isWeb } from './src/util/Util';
import { preventAutoHideAsync, hideAsync } from 'expo-splash-screen';
import { useFonts } from 'expo-font';

preventAutoHideAsync();

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'black' : 'white',
  };

  const Stack = useMemo(() => createNativeStackNavigator(), []);

  const appScreens = useMemo(() => getAppScreens(), []);
  // Get an array of the screens in the app
  const screens = useMemo(() => [...appScreens.screens.values()], [appScreens]);

  const [fontsLoaded] = useFonts({
    LibreFranklin: require('./assets/fonts/LibreFranklin-VariableFont_wght.ttf'),
    OpenSauceOne: require('./assets/fonts/OpenSauceOne-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return;

  return (
    <SafeAreaView
      style={[backgroundStyle, styles.safeAreaView]}
      onLayout={onLayoutRootView}>
      <ContentsModuleContext.Provider value={ContentsModule}>
        <WebWrapper>
          <NavigationContainer>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              backgroundColor={backgroundStyle.backgroundColor}
            />
            <Stack.Navigator initialRouteName={appScreens.initialScreen}>
              {screens.map(screen => (
                <Stack.Screen
                  name={screen.id}
                  key={screen.id}
                  component={Screens[screen.type]}
                  options={{
                    title: screen.title || screen.id,
                    // Header background
                    headerStyle: {
                      backgroundColor: theme.navigation.background,
                    },
                    // Remove the white line at the bottom of the header
                    headerShadowVisible: !isWeb(),
                    // Back button and header text color
                    headerTintColor: theme.navigation.text,
                    // App background
                    contentStyle: {
                      backgroundColor: theme.app.background,
                      borderTopWidth: isWeb() ? 1 : 0,
                      borderTopColor: theme.navigation.bottom,
                    },
                    headerShown: screen.showNavigationBar ?? true,
                  }}
                />
              ))}
            </Stack.Navigator>
          </NavigationContainer>
        </WebWrapper>
      </ContentsModuleContext.Provider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
});
