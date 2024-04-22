import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ErrorBox = ({ errorMessage, onRetry }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorMessage}>{errorMessage}</Text>
  </View>
);

const styles = StyleSheet.create({
  errorContainer: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  errorMessage: {
    fontSize: 18,
    color: 'red',
    fontFamily: "Arial", // Common font family

    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14,
  },
  
});

export default ErrorBox;
