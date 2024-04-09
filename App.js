import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import HomeTabs from './src/navigation/HomeTabs'; // Adjust the path as necessary
import ArticleTabs from './src/navigation/ArticleTabs'; // Adjust the path as necessary
import GamesTabs from './src/navigation/GamesTabs'; // Adjust the path as necessary

const Stack = createNativeStackNavigator();

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  async function loadFonts() {
    await Font.loadAsync({
       // Existing NYT fonts
       'nyt-cheltenham-bold': require('./assets/fonts/nyt-cheltenham-bold.ttf'),
       'nyt-franklin': require('./assets/fonts/nyt-franklin.ttf'),
       'nyt-cheltenham-normal': require('./assets/fonts/nyt-cheltenham-normal.ttf'),
       // Fraunces fonts
       'fraunces-black': require('./assets/fonts/Fraunces-Black.ttf'),
       'fraunces-bold': require('./assets/fonts/Fraunces-Bold.ttf'),
       'fraunces-extra-bold': require('./assets/fonts/Fraunces-ExtraBold.ttf'),
       'fraunces-extra-light': require('./assets/fonts/Fraunces-ExtraLight.ttf'),
       'fraunces-light': require('./assets/fonts/Fraunces-Light.ttf'),
       'fraunces-medium': require('./assets/fonts/Fraunces-Medium.ttf'),
       'fraunces-regular': require('./assets/fonts/Fraunces-Regular.ttf'),
       'fraunces-semi-bold': require('./assets/fonts/Fraunces-SemiBold.ttf'),
       'fraunces-thin': require('./assets/fonts/Fraunces-Thin.ttf'),
       'utm-times-bold': require('./assets/fonts/UTMTimesBold.ttf'),
       'utm-times-regular': require('./assets/fonts/UTMTimesRegular.ttf'),

       // Include any other fonts here
    });
  }

  if (!fontsLoaded) {
    return (
      <AppLoading
        startAsync={loadFonts}
        onFinish={() => setFontsLoaded(true)}
        onError={console.warn}
      />
    );
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
