// SearchPage.js
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  Animated,
  SafeAreaView,
  ScrollView,
  TextInput,
  Text,
} from "react-native";
import ArticleList from "../components/ArticleList"; // Adjust the import path as necessary
import ErrorBox from "../components/ErrorBox"; // Adjust the import path as necessary
import { fetchSearchResults } from "../API";

const headerHeight = 60; // Assuming the header height is 60, adjust if necessary

const SearchPage = ({}) => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");

  const scrollY = new Animated.Value(0);

  const scrollYClamped = Animated.diffClamp(scrollY, 0, headerHeight);
  const headerTranslateY = scrollYClamped.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: "clamp",
  });

  const headerComponent = (
    <View style={styles.searchBarContainer}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search articles..."
        placeholderTextColor="#808080" // This sets the placeholder text color to gray
        value={query}
        onChangeText={(text) => setQuery(text)}
        // You've already set a darker color for when typing via the color property in your styles.searchBar
      />
    </View>
  );
  const fetchArticles = async () => {
    if (query.length === 0) {
      setArticles([]);
      setError(null);
      setIsLoading(false);
      setRefreshing(false);
      return;
    }
    setIsLoading(true);
    try {
      const data = await fetchSearchResults(query);
      data["search"].forEach((article) => {
        article.summary.show = false;
        article.image.show = false;
        article.title.size = "medium";
      });
      setArticles(data);
    } catch (error) {
      setError(error.toString());
    }
    setIsLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchArticles();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [query]);

  return (
    <View style={styles.container}>
      {headerComponent && (
        <Animated.View
          style={[
            styles.header,
            {
              transform: [{ translateY: headerTranslateY }],
            },
          ]}
        >
          {headerComponent}
        </Animated.View>
      )}

      {query.length === 0 ? (
        // Your UI component or message indicating that no query has been entered
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Please enter a query to search for articles.</Text>
        </View>
      ) : isLoading && !refreshing ? (
        <SafeAreaView style={[{ flex: 1 }, { backgroundColor: "#fff" }]}>
          <View style={{ height: 60 }}></View>

          <ScrollView
            // Style your ScrollView as needed
            refreshControl={<RefreshControl refreshing={true} />}
          ></ScrollView>
        </SafeAreaView>
      ) : error || articles.length === 0 ? (
        <SafeAreaView style={[{ flex: 1 }, { backgroundColor: "#fff" }]}>
          <View style={{ height: 60 }}></View>

          <ScrollView
            // Style your ScrollView as needed
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {/* Display the ErrorBox if there's an error */}
            {error && <ErrorBox errorMessage={error} />}
          </ScrollView>
        </SafeAreaView>
      ) : (
        <ArticleList
          articles={articles}
          refreshing={false}
          onRefresh={null}
          scrollY={scrollY}
          headerHeight={headerHeight}
          refreshControl={null}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    height: headerHeight,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    width: "100%",
  },
  searchBarContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#dedede",
    height: 60, // Maintain the explicit height setting for the container
    justifyContent: "center", // Centers the searchBar vertically within the container
    paddingHorizontal: 10, // Optional: add some horizontal padding to the container if desired
    backgroundColor: "#ffff",
    width: "100%",
  },

  searchBar: {
    height: 40, // Adjust the height as needed to fit within the container, considering border and padding
    paddingHorizontal: 10, // Adjust horizontal padding to control the text input area size
    fontSize: 17.5,
    borderWidth: 3,
    borderColor: "#d5a64a",
    borderRadius: 5,
    marginHorizontal: 10,
    color: "#1c1c1c", // Dark color for typed text
    fontFamily: "georgia",
    letterSpacing: 0.3,
  },
  infoMessage: {
    margin: 20,
    textAlign: "center",
    color: "gray",
  },
});

export default SearchPage;
