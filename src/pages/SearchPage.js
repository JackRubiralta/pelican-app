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

  // Clamping the initial negative values to zero
  const scrollYPositive = scrollY.interpolate({
    inputRange: [-1, 0],
    outputRange: [0, 0],
    extrapolateRight: 'identity'
  });

  const scrollYClamped = Animated.diffClamp(scrollY, 0, headerHeight);

  const headerTranslateY = Animated.diffClamp(scrollYPositive, 0, headerHeight).interpolate({
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
      setError(null);

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
    setError(null);

    fetchArticles();
  }, [query]);

return (
    <SafeAreaView style={styles.container}>
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
        <SafeAreaView style={[{ flex: 1,  justifyContent: "center", alignItems: "center" }, { backgroundColor: "#fff" }]}>

          <Text>Enter query to search.</Text>
        </SafeAreaView>
      ) : isLoading && !refreshing ? (
        <SafeAreaView style={[{ flex: 1 }, { backgroundColor: "#fff" }]}>
          <View style={{ height: 60 }}></View>
          <ScrollView
            // Style your ScrollView as needed
            refreshControl={<RefreshControl refreshing={true} />}
          ></ScrollView>
        </SafeAreaView>
      ) : error ? (
        <SafeAreaView style={[{ flex: 1 }, { backgroundColor: "#fff" }]}>
          <View style={{ height: 60 }}></View>
          <ScrollView
            // Style your ScrollView as needed
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {error && <ErrorBox errorMessage={error} />}
          </ScrollView>
        </SafeAreaView>
      ) : articles.length === 0 ? (
        // Your UI component or message indicating that no query has been entered
        <SafeAreaView style={[{ flex: 1,  justifyContent: "center", alignItems: "center" }, { backgroundColor: "#fff" }]}>

          <Text>No articles found.</Text>
        </SafeAreaView>
      ) : (
        <ArticleList
          articles={articles}
          refreshing={refreshing}
          onRefresh={onRefresh}
          scrollY={scrollY}
          headerHeight={headerHeight}
        />
      )} 
    </SafeAreaView>

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
