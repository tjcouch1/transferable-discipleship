/**
 *
 * Transferable Discipleship -
 *
 */

import React from 'react';
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
import ContentsContext from './src/components/contents/ContentsContext';
import { Contents } from './src/components/contents/Contents';

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'black' : 'white',
  };

  const Stack = createNativeStackNavigator();

  const appScreens = getAppScreens();
  // Get an array of the screens in the app
  const screens = [...appScreens.screens.values()];

  return (
    <SafeAreaView style={[backgroundStyle, styles.safeAreaView]}>
      <ContentsContext.Provider value={Contents}>
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
                  options={{ title: screen.title || screen.id }}
                />
              ))}
            </Stack.Navigator>
          </NavigationContainer>
        </WebWrapper>
      </ContentsContext.Provider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
});
