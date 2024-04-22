import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import HomeTabs from './src/navigation/HomeTabs'; // Adjust the path as necessary
import ArticleTabs from './src/navigation/ArticleTabs'; // Adjust the path as necessary
import GamesTabs from './src/navigation/GamesTabs'; // Adjust the path as necessary

const Stack = createNativeStackNavigator();

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await loadFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  async function loadFonts() {
    await Font.loadAsync({
      'nyt-cheltenham-bold': require('./assets/fonts/nyt-cheltenham-bold.ttf'),
      'nyt-franklin': require('./assets/fonts/nyt-franklin.ttf'),
      'nyt-cheltenham-normal': require('./assets/fonts/nyt-cheltenham-normal.ttf'),
      'Arial': require('./assets/fonts/arial-regular.ttf'),
      'utm-times-bold': require('./assets/fonts/UTMTimesBold.ttf'),
      'utm-times-regular': require('./assets/fonts/UTMTimesRegular.ttf'),
      'georgia': require('./assets/fonts/georgia.ttf'),
      'roboto': require('./assets/fonts/Roboto-Regular.ttf'),
    });
  }

  if (!fontsLoaded) {
    return null; // Keep splash screen visible while loading fonts
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />
        <Stack.Screen name="ArticlePage" component={ArticleTabs} options={{ headerShown: false }} />
        <Stack.Screen name="GamesTabs" component={GamesTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
