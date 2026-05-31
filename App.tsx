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
} from 'react-native';
import { NavigationContainer, Route, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAppScreens } from './src/services/ScreenService';
import { Screens } from './src/components/screens/Screens';
import WebWrapper from './src/components/WebWrapper';
import ContentsModuleContext from './src/components/contents/ContentsContext';
import * as ContentsModule from './src/components/contents/Contents';
import { isWeb } from './src/util/Util';
import { preventAutoHideAsync, hideAsync } from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import * as Linking from 'expo-linking';
import { ROOT_PATH, PATH_DELIMITER, pathJoin } from './src/util/PathUtil';
import { VisitedScreensProvider } from './src/contexts/VisitedScreensContext';
import { ProgressProvider } from './src/contexts/ProgressContext';
import { BookmarksProvider } from './src/contexts/BookmarksContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';

/** Web only: sessionStorage key used to save and to restore the route stack on refresh */
const ROUTE_STACK_KEY = 'route-stack';

preventAutoHideAsync();

// Inner app component that has access to ThemeContext
function AppContent() {
  const { isDarkMode, theme } = useTheme();

  const backgroundStyle = {
    backgroundColor: theme.app.background,
  };

  const Stack = useMemo(() => createNativeStackNavigator(), []);

  const appScreens = useMemo(() => getAppScreens(), []);
  // Get an array of the screens in the app
  const screens = useMemo(() => [...appScreens.screens.values()], [appScreens]);

  // Web only: Restore the route stack on refresh if in same session
  const restoredRoutes = useMemo<Route<string>[] | undefined>(() => {
    if (!isWeb()) {
      // On native, check for initial deep link
      return undefined;
    }

    // Check for hash-based routing first (for deep links)
    const hash = window.location.hash;
    if (hash && hash.startsWith('#/')) {
      const path = hash.substring(2); // Remove '#/'
      // Handle scripture deep links
      if (path.startsWith('scripture/')) {
        const reference = decodeURIComponent(path.substring('scripture/'.length));
        // For now, just navigate to root - scripture sharing can be handled differently
        // TODO: Create a scripture viewer screen or handle this differently
        return [{ name: appScreens.initialScreen }];
      }
      // Handle regular screen paths
      const screenPath = pathJoin(ROOT_PATH, path);
      if (appScreens.screens.has(screenPath)) {
        return [{ name: screenPath }];
      }
    }

    const routeStackJson = sessionStorage.getItem(ROUTE_STACK_KEY);
    if (!routeStackJson) return undefined;

    return JSON.parse(routeStackJson).map((route: string) => ({ name: route }));
  }, [appScreens]);

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

  // Handle deep links
  useEffect(() => {
    if (isWaitingForFontLoading && !fontsLoaded && !fontError) return;

    const handleDeepLink = (url: string) => {
      // Parse the URL
      const parsed = Linking.parse(url);
      const path = parsed.path || '';

      // Handle scripture deep links: scripture/:reference
      if (path.startsWith('scripture/')) {
        const reference = decodeURIComponent(path.substring('scripture/'.length));
        // TODO: Navigate to scripture viewer or show modal
        console.log('Scripture deep link:', reference);
        return;
      }

      // Handle regular screen paths
      if (path) {
        const screenPath = pathJoin(ROOT_PATH, path);
        if (appScreens.screens.has(screenPath)) {
          // Navigation will be handled by NavigationContainer's linking config
          // We could also manually navigate here if needed
        }
      }
    };

    // Handle initial deep link
    Linking.getInitialURL().then(url => {
      if (url) {
        handleDeepLink(url);
      }
    });

    // Listen for deep links while app is running
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    // Web: Handle hash changes
    if (isWeb()) {
      const handleHashChange = () => {
        const hash = window.location.hash;
        if (hash && hash.startsWith('#/')) {
          const path = hash.substring(2);
          if (path.startsWith('scripture/')) {
            // Scripture deep link - could show a modal or navigate
            // For now, we'll just log it
            console.log('Scripture deep link:', decodeURIComponent(path.substring('scripture/'.length)));
          } else {
            const screenPath = pathJoin(ROOT_PATH, path);
            if (appScreens.screens.has(screenPath)) {
              // Navigation will be handled by the NavigationContainer's linking config
            }
          }
        }
      };

      window.addEventListener('hashchange', handleHashChange);
      return () => {
        subscription.remove();
        window.removeEventListener('hashchange', handleHashChange);
      };
    }

    return () => {
      subscription.remove();
    };
  }, [isWaitingForFontLoading, fontsLoaded, fontError, appScreens]);

  if (isWaitingForFontLoading && !fontsLoaded && !fontError) return;

  return (
    <SafeAreaView
      style={[backgroundStyle, styles.safeAreaView]}
      onLayout={onLayoutRootView}>
      <VisitedScreensProvider>
        <ProgressProvider>
          <BookmarksProvider>
            <ContentsModuleContext.Provider value={ContentsModule}>
              <WebWrapper>
            <NavigationContainer
              initialState={
                restoredRoutes
                  ? {
                      routes: restoredRoutes,
                    }
                  : undefined
              }
              linking={{
                prefixes: [
                  'transferable-discipleship://',
                  'https://tjcouch1.github.io/transferable-discipleship',
                ],
                config: {
                  screens: {
                    // Map all screens for deep linking
                    // The screen paths will be matched dynamically
                  },
                },
              }}>
              <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
              />
              <Stack.Navigator
                initialRouteName={appScreens.initialScreen}
                screenOptions={{
                  headerStyle: {
                    backgroundColor: theme.navigation.background,
                  },
                  headerShadowVisible: !isWeb(),
                  headerTintColor: theme.navigation.text,
                  contentStyle: {
                    backgroundColor: theme.app.background,
                    borderTopWidth: isWeb() ? 1 : 0,
                    borderTopColor: theme.navigation.bottom,
                  },
                }}
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
                      headerShown: screen.showNavigationBar ?? true,
                    }}
                  />
                ))}
              </Stack.Navigator>
            </NavigationContainer>
              </WebWrapper>
            </ContentsModuleContext.Provider>
          </BookmarksProvider>
        </ProgressProvider>
      </VisitedScreensProvider>
    </SafeAreaView>
  );
}

// Main App component with ThemeProvider wrapper
export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
});
