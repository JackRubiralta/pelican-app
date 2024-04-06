import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ErrorBox = ({ errorMessage, onRetry }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorMessage}>{errorMessage}</Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryButtonText}>Try Again</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  errorMessage: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14,
  },
  retryButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ErrorBox;
