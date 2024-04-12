import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from "../theme"; // Adjust the import path to where you've saved theme.js

const NewsSeparator  = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  separator: {
    height: 1.5,
    backgroundColor: '#999999',
    width: '90%',
    alignSelf: 'center',
    marginVertical: theme.spacing.medium + 4,

  },
});

export default NewsSeparator;
