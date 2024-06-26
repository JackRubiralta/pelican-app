import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,SafeAreaView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Header from '../components/Header'; // Ensure this path matches your project structure
import { theme } from "../theme";

const GamesPage = () => {
  const navigation = useNavigation();

  const navigateToSpellingBee = () => {
    navigation.navigate('GamesTabs', {
      screen: 'SpellingBees',
    });
  };

  const navigateToCrossword = () => {
    navigation.navigate('GamesTabs', {
      screen: 'Crossword',
    });
  };

  const navigateToConnections = () => {
    navigation.navigate('GamesTabs', {
      screen: 'Connections',
    });
  };

  return (
    <SafeAreaView style={[{backgroundColor: '#ffff'}, { flex: 1}]}>
      <Header title="Games" />
      <View style={styles.container}>
        <View style={{height: theme.spacing.medium}}></View>
        <TouchableOpacity 
          style={styles.gameButton} 
          onPress={navigateToCrossword}
        >
          <Text style={styles.buttonText}>Play Crossword</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.gameButton} 
          onPress={navigateToConnections}
        >
          <Text style={styles.buttonText}>Play Connections</Text>
        </TouchableOpacity>
        {/*<TouchableOpacity 
          style={styles.gameButton} 
          onPress={navigateToSpellingBee}
        >
          <Text style={styles.buttonText}>Play Spelling Bee</Text>
        </TouchableOpacity>
        
       


       */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'top',
    padding: theme.spacing.medium,
    paddingTop: 0,
    backgroundColor: '#ffff',
  },
  gameButton: {
    width: '100%', // Ensures the button stretches across the whole container width
    backgroundColor: '#E8E8E8', // Light grey background
    paddingVertical: 20, // Increased padding for a taller button
    paddingHorizontal: 20,
    borderRadius: 10, // Rounded corners for a smoother look
    marginVertical: theme.spacing.medium, // Increases space between buttons
    marginTop: 0,
    elevation: 6,
    fontFamily: "roboto", // Common font family

  },
  buttonText: {
    fontSize: 24, // Larger font size for better visibility and touch
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});

export default GamesPage;
