import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Recent from '../pages/Recent';
import Athletics from '../pages/Athletics';
import SearchPage from '../pages/SearchPage'; // Adjust the path as necessary
import Games from '../pages/Games'; // Assuming you have this component
import Header from '../components/Header'; // Adjust the path as necessary

const Tab = createBottomTabNavigator();

// Load your custom icons
const icons = {
  Recent: require('../../assets/recent.png'),
  Athletics: require('../../assets/athletics.png'),
  Search: require('../../assets/search.png'),
  Games: require('../../assets/games.png'),
};

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          return <Image source={icons[route.name]} style={{ width: size, height: size }} />;
        },
        header: () => {
          const title = route.name;
          return <Header title={title} />;
        },
        tabBarLabel: () => null, 
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Recent" component={Recent} />
      <Tab.Screen name="Athletics" component={Athletics} />
      <Tab.Screen name="Search" component={SearchPage} />
      <Tab.Screen name="Games" component={Games} />
    </Tab.Navigator>
  );
}

export default HomeTabs;
