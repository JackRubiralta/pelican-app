import React from 'react';
import { View, StyleSheet } from 'react-native';

const NewsSeperator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#999999',
    width: '90%',
    alignSelf: 'center',
    marginVertical: 3.3,

  },
});

export default NewsSeperator;
