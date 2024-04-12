// ArticleList.js
import React from 'react';
import { View, Text, Animated, StyleSheet, RefreshControl } from 'react-native';
import NewsSection from './NewsSection'; // Adjust the import path as necessary
import SectionSeperator from './SectionSeperator'; // Make sure this path is correct

const ArticleList = ({ articles, refreshing, onRefresh, scrollY, headerHeight }) => {
  if (!articles || articles.length === 0) {
    return (
      <View style={styles.centeredView}>
        <Text>Can't connect to server. Please try again later.</Text>
      </View>
    );
  }

  // Assuming 'articles' is now an object with section names as keys
  const sections = Object.keys(articles);

  return (
    <Animated.FlatList
      data={sections}
      keyExtractor={(item) => item}
      renderItem={({ item }) => ( // make item have not padding
        <NewsSection sectionTitle={item} articles={articles[item]} />
      )}
      contentContainerStyle={{ paddingTop: headerHeight }}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressViewOffset={headerHeight}
          />
        ) : null
      }
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
      ItemSeparatorComponent={SectionSeperator} // Use SectionSeperator to separate each section
    />
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default ArticleList;
