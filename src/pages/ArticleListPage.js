// ArticleListPage.js
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  Animated,
  SafeAreaView,
  ScrollView,
  Text,
} from "react-native";
import ArticleList from "../components/ArticleList"; // Adjust the import path as necessary
import ErrorBox from "../components/ErrorBox"; // Adjust the import path as necessary
import Header from "../components/Header"; // Adjust the import path as necessary

const headerHeight = 60; // Assuming the header height is 60, adjust if necessary

const ArticleListPage = ({ fetchArticlesFunction, pageTitle }) => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = new Animated.Value(0);

  const scrollYClamped = Animated.diffClamp(scrollY, 0, headerHeight);
  const headerTranslateY = scrollYClamped.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: "clamp",
  });

  const fetchArticles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchArticlesFunction();
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
  }, []);

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={[{ flex: 1 }, {backgroundColor: '#fff'}]}>
         <Header title={pageTitle} />
         <ScrollView
          // Style your ScrollView as needed
          refreshControl={
            <RefreshControl refreshing={true} />}>       
        </ScrollView>

      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[{ flex: 1 }, {backgroundColor: '#fff'}]}>
        <Header title={pageTitle} />

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
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.header,
          {
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, headerHeight],
                  outputRange: [0, -headerHeight],
                  extrapolate: "clamp",
                }),
              },
            ],
            opacity: scrollY.interpolate({
              inputRange: [0, headerHeight],
              outputRange: [1, 0],
              extrapolate: "clamp",
            }),
          },
        ]}
      >
        <Header title={pageTitle} />
      </Animated.View>

      <ArticleList
        articles={articles}
        refreshing={refreshing}
        onRefresh={onRefresh}
        scrollY={scrollY}
        headerHeight={60} // Assuming a fixed header height of 60 pixels
      />
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
    backgroundColor: "#f8f8f8", // Adjust the background color as needed
  },
  // Add any other style you might need here
});

export default ArticleListPage;
