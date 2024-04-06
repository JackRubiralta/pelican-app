import React from 'react';
import { FlatList } from 'react-native';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import NewsBlock from './NewsBlock'; // Adjust the import path as necessary
import NewsSeperator from './NewsSeperator'; // Import the new NewsSeperator component

// Define your ArticleList component
const ArticleList = ({ articles, refreshControl, onScroll   }) => {
  if (!articles || articles.length === 0) {
    return (
      <View style={styles.centeredView}>
        <Text>Can't connect to server. Please try again later.</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={articles}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <NewsBlock article={item} />}
      ItemSeparatorComponent={NewsSeperator}
      style={styles.listBackground}
      refreshControl={refreshControl}
      onScroll={onScroll} // Add this to handle custom scroll logic
      scrollEventThrottle={16} // Optional but recommended for performance
    />
  );
};
const styles = StyleSheet.create({
  listBackground: {
    backgroundColor: '#fff', // Sets the background color of the list to white
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20, // Add padding for aesthetic spacing
  },
});
export default ArticleList;
