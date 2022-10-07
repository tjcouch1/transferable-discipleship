/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
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
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { getAppScreens } from './src/services/ScreenService';
import { Screens } from './src/components/screens/Screens';

const App = () => {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    const Stack = createNativeStackNavigator();

    const appScreens = getAppScreens();

    return (
        <SafeAreaView style={[backgroundStyle, styles.safeAreaView]}>
            <NavigationContainer>
                <StatusBar
                    barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                    backgroundColor={backgroundStyle.backgroundColor}
                />
                <Stack.Navigator initialRouteName={appScreens.initialScreen}>
                    {appScreens.screens.map(screen => (
                        <Stack.Screen
                            name={screen.id}
                            key={screen.id}
                            component={Screens[screen.type]}
                            options={{ title: screen.title || screen.id }}
                        />
                    ))}
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
    },
});

export default App;
