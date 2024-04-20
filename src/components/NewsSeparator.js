import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from "../theme"; // Adjust the import path to where you've saved theme.js

const NewsSeparator  = () => (<View style={styles.separatorContainer}><View style={styles.separator} /></View>);

const styles = StyleSheet.create({
  separatorContainer: {
    paddingHorizontal: theme.spacing.medium,
  },
  separator: {
    height: 1.5,
    backgroundColor: '#999999',

    width: '100%',
    alignSelf: 'center',
    marginVertical: theme.spacing.medium + 4,

  },
});

export default NewsSeparator;
