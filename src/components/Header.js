// CustomHeader.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header = ({ title }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // or any color you want
    borderBottomWidth: 1,
    borderBottomColor: '#dedede',
    // Add shadow or elevation if you want
  },
  headerTitle: {
    fontSize: 40,
    fontFamily: 'nyt-cheltenham-bold',  
    // Add other styling as needed
  },
});

export default Header;
