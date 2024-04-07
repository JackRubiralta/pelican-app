import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GamesPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.messageText}>Not implemented yet. App by Jack Rubiralta</Text>
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
  messageText: {
    color: 'black', 
    textAlign: 'center',
  },
});

export default GamesPage;
