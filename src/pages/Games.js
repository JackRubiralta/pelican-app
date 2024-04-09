import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Header from '../components/Header'; // Ensure this path matches your project structure

const GamesPage = () => {
  const navigation = useNavigation();

  const navigateToSpellingBee = () => {
    navigation.navigate('GamesTabs', {
      screen: 'SpellingBees',
    });
  };

  return (
    <View style={[{backgroundColor: '#ffff'}, { flex: 1}]}>
      <Header title="Games" />
    
    <View style={styles.container}>
      

      <View style={styles.contentContainer}>
        <TouchableOpacity 
          style={styles.spellingBeeBox} 
          onPress={navigateToSpellingBee}
        >
          <Text style={styles.boxText}>Spelling Bee</Text>
        </TouchableOpacity>
      </View>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffff',
  },
  contentContainer: {
    marginTop: 60, // Adjust based on your header's height to ensure content does not overlap with the header
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spellingBeeBox: {
    borderWidth: 2, // Defines the thickness of the border
    borderColor: '#007BFF', // A pleasant blue shade for the border
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4, // Slightly rounded corners for a refined look
  },
  boxText: {
    color: '#007BFF', // Matching the border color for consistency
    fontSize: 18, // Reasonable font size for readability
    textAlign: 'center', // Ensures the text is centered within the box
  },
});

export default GamesPage;
