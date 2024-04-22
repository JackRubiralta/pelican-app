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
       'Arial': require('./assets/fonts/arial-regular.ttf'),  // Updated to the correct filename for Arial

       'utm-times-bold': require('./assets/fonts/UTMTimesBold.ttf'),
       'utm-times-regular': require('./assets/fonts/UTMTimesRegular.ttf'),
       'georgia': require('./assets/fonts/georgia.ttf'),  // Make sure the path matches where you've placed the file


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
