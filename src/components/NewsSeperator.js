import React from 'react';
import { View, StyleSheet } from 'react-native';

const NewsSeperator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  separator: {
    height: 2,
    backgroundColor: '#44444',
    width: '90%',
    alignSelf: 'center',
    marginVertical: 7,

  },
});

export default NewsSeperator;
