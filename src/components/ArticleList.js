import React from "react";
import { FlatList } from "react-native";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { RefreshControl, Animated, StyleSheet } from "react-native";

import NewsBlock from "./NewsBlock"; // Adjust the import path as necessary
import NewsSeperator from "./NewsSeperator"; // Import the new NewsSeperator component
const ArticleList = ({
  articles,
  refreshing,
  onRefresh,
  scrollY,
  headerHeight,
}) => {
  if (!articles || articles.length === 0) {
    return (
      <View style={styles.centeredView}>
        <Text>Can't connect to server. Please try again later.</Text>
      </View>
    );
  }


  // parse the articles array
  // into the different sections
  // articles = ["section_name": [ ... list of the articles data ]]
  // now have a componet called NewsSection which is the news blocks for the articles in those section
  // but instead each article is seprated by a smaller NewsSeperator 
  // then belovew instead have it display these article section blocks
  return (
    <Animated.FlatList
      data={articles}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <NewsBlock article={item} />}
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
        { useNativeDriver: true } // Leveraging native driver for performance
      )}
      scrollEventThrottle={16} // Good default value for smooth scrolling
      ItemSeparatorComponent={NewsSeperator}
    />
  );
};

const styles = StyleSheet.create({
  listBackground: {
    backgroundColor: "#fff", // Sets the background color of the list to white
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20, // Add padding for aesthetic spacing
  },
});

export default ArticleList;
