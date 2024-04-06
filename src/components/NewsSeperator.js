import React from 'react';
import { View, StyleSheet } from 'react-native';

const NewsSeperator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  separator: {
    height: 2,
    backgroundColor: '#121212',
    width: '90%',
    alignSelf: 'center',
    marginVertical: 12,

  },
});

export default NewsSeperator;
