import React from 'react';
import { View, StyleSheet } from 'react-native';

const SectionSeperator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  separator: {
    height: 2,
    backgroundColor: '#565656',
    width: '90%',
    alignSelf: 'center',
    marginVertical: 7,

  },
});

export default SectionSeperator;
