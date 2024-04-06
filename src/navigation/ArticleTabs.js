import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import ArticlePage from '../pages/ArticlePage'; // Adjust the path as necessary

const Tab = createBottomTabNavigator();
const backIcon = require('../../assets/back.png'); // Adjust the path as necessary

const GoBackComponent = () => {
  const navigation = useNavigation();
  
  React.useEffect(() => {
    navigation.navigate('Home');
  }, [navigation]);

  return null;
};

function ArticleTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="GoBack" 
        component={GoBackComponent} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image 
              source={backIcon} 
              style={{ width: size, height: size }}
            />
          ),
          title: 'Back',
          tabBarLabel: () => null, 
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Article" 
        component={ArticlePage} 
        options={{ 
          tabBarButton: () => null, 
          headerShown: false,
        }} 
      />
    </Tab.Navigator>
  );
}

export default ArticleTabs;
