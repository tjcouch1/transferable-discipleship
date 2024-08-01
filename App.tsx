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

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { NavigationContainer, Route } from '@react-navigation/native';
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

/** Web only: sessionStorage key used to save and to restore the route stack on refresh */
const ROUTE_STACK_KEY = 'route-stack';

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

  // Web only: Restore the route stack on refresh if in same session
  const restoredRoutes = useMemo<Route<string>[] | undefined>(() => {
    if (!isWeb()) return undefined;

    const routeStackJson = sessionStorage.getItem(ROUTE_STACK_KEY);
    if (!routeStackJson) return undefined;

    console.log('Restoring route stack!', routeStackJson);

    return JSON.parse(routeStackJson).map((route: string) => ({ name: route }));
  }, []);

  // WARNING: Because iOS does not support fonts well, we are using special naming conventions
  // here to add bold and italic. If you want a font family to support bold and italic on iOS,
  // you must add `<font_family>_bold`, `<font_family>_italic`, and `<font_family>_bold_italic`
  // Read more at https://github.com/expo/expo/issues/9149
  const [fontsLoaded, fontError] = useFonts({
    LibreFranklin: require('./assets/fonts/LibreFranklin-VariableFont_wght.ttf'),
    LibreFranklin_bold: require('./assets/fonts/LibreFranklin-Bold.ttf'),
    LibreFranklin_italic: require('./assets/fonts/LibreFranklin-Italic.ttf'),
    LibreFranklin_bold_italic: require('./assets/fonts/LibreFranklin-BoldItalic.ttf'),
    OpenSauceOne: require('./assets/fonts/OpenSauceOne-Regular.ttf'),
    OpenSauceOne_bold: require('./assets/fonts/OpenSauceOne-Bold.ttf'),
    OpenSauceOne_italic: require('./assets/fonts/OpenSauceOne-Italic.ttf'),
    OpenSauceOne_bold_italic: require('./assets/fonts/OpenSauceOne-BoldItalic.ttf'),
  });

  // Wait a few seconds to see if the fonts will load before just showing the app
  // Unfortunately, it seems `useFonts` doesn't throw an error if the fonts don't
  // come through over websocket from webpack (for example, if you're running the
  // app over the network, and you didn't port forward the webpack port). So let's
  // just set a timeout fail-safe.
  const [isWaitingForFontLoading, setIsWaitingForFontLoading] = useState(true);
  // Only run the timer once
  useEffect(() => {
    setTimeout(() => {
      setIsWaitingForFontLoading(false);
    }, 5000);
  }, []);

  const onLayoutRootView = useCallback(async () => {
    // When the timer runs out, if the fonts haven't responded, throw an error and let the app load
    if (!isWaitingForFontLoading && !fontsLoaded && !fontError)
      console.error('Timed out waiting for fonts to load!');
    // If the timer runs out or the fonts respond, show the app
    if (!isWaitingForFontLoading || fontsLoaded || fontError) {
      if (fontError) console.error(fontError);
      await hideAsync();
    }
  }, [fontsLoaded, fontError, isWaitingForFontLoading]);

  if (isWaitingForFontLoading && !fontsLoaded && !fontError) return;

  return (
    <SafeAreaView
      style={[backgroundStyle, styles.safeAreaView]}
      onLayout={onLayoutRootView}>
      <ContentsModuleContext.Provider value={ContentsModule}>
        <WebWrapper>
          <NavigationContainer
            initialState={
              restoredRoutes
                ? {
                    routes: restoredRoutes,
                  }
                : undefined
            }>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              backgroundColor={backgroundStyle.backgroundColor}
            />
            <Stack.Navigator
              initialRouteName={appScreens.initialScreen}
              screenListeners={
                // Web only: Persist the route stack on changes so we can restore it later
                isWeb()
                  ? {
                      // Looks like the types for this event are wrong :( so just use any
                      state: (e: any) => {
                        const routeStack = e?.data?.state?.routes?.map(
                          (route: Route<string>) => route.name,
                        );
                        sessionStorage.setItem(
                          ROUTE_STACK_KEY,
                          JSON.stringify(
                            !routeStack || routeStack.length === 0
                              ? null
                              : routeStack,
                          ),
                        );
                      },
                    }
                  : undefined
              }>
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
