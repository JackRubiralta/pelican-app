// ArticleList.js
import React from "react";
import { View, Text, Animated, StyleSheet, RefreshControl } from "react-native";
import NewsSection from "./NewsSection"; // Adjust the import path as necessary
import SectionSeparator from "./SectionSeparator"; // Make sure this path is correct
import { theme } from "../theme"; // Adjust the import path to where you've saved theme.js

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

  // Assuming 'articles' is now an object with section names as keys
  const sections = Object.keys(articles);

  return (
    <Animated.FlatList
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      data={sections}
      keyExtractor={(item, index) => item + index.toString()}
      renderItem={({ item, index }) => (
        <View>
          {item !== "search" && (
            <SectionSeparator
              sectionName={item}
              style={
                index === 0 ? { marginTop: 0 } : { marginTop: "default value" }
              }
            />
          )}

          <NewsSection sectionTitle={item} articles={articles[item]} />
        </View>
      )}
      contentContainerStyle={{
        paddingTop: headerHeight + theme.spacing.medium,
        paddingBottom: theme.spacing.medium,
      }}
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
    />
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default ArticleList;
