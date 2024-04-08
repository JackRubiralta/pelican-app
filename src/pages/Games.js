import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
//import SpellingBeeGame from './SpellingBee'; // Assuming GameScreen is the default export from SpellingBee

const GamesPage = () => {
  return (
    <View style={styles.container}>
      <Text>Not implemented yet. App by Jack Rubiralta </Text>
      {/* Additional UI elements can be added here if necessary */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  // Other styles...
});

export default GamesPage;
