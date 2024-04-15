import React from "react";
import { Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import SpellingBeeGame from "../pages/SpellingBee";
import Crossword from "../pages/Crossword";

const Tab = createBottomTabNavigator();
const backIcon = require("../../assets/back.png"); // Adjust the path as necessary

const GoBackComponent = () => {
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.navigate("Home");
  }, [navigation]);

  return null;
};

function GamesTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="GoBack"
        component={GoBackComponent}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image source={backIcon} style={{ width: size, height: size }} />
          ),
          title: "Back",
          tabBarLabel: () => null,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="SpellingBees"
        component={SpellingBeeGame}
        options={{
          tabBarButton: () => null,
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Crossword"
        component={Crossword}
        options={{
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default GamesTabs;
