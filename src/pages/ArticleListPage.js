// ArticleListPage.js
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  Animated,
  SafeAreaView,
  ScrollView,
} from "react-native";

import ArticleList from "../components/ArticleList"; // Adjust the import path as necessary
import ErrorBox from "../components/ErrorBox"; // Adjust the import path as necessary
import { useSafeAreaInsets } from "react-native-safe-area-context";
const headerHeight = 60; // Assuming the header height is 60, adjust if necessary

const ArticleListPage = ({
  fetchArticlesFunction,
  pageTitle,
  headerComponent,
}) => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = new Animated.Value(0);
  const insets = useSafeAreaInsets();
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

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const data = await fetchArticlesFunction();
      setArticles(data);
      setError(null);

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
  }, []);

  const headerStyle = {
    ...styles.header,
    top: insets.top,
  }

  return (
    <SafeAreaView style={styles.container}>

      {{headerComponent} && (
        <Animated.View
          style={[
            headerStyle,
            {
              transform: [{ translateY: headerTranslateY }],
            },
          ]}
        >
          {headerComponent}
        </Animated.View>
      )}

      {isLoading && !refreshing ? (
        <View style={[{ flex: 1 }, { backgroundColor: "#fff" }]}>
          <View style={{ height: 0 }}></View>
          <ScrollView
            // Style your ScrollView as needed
            refreshControl={<RefreshControl refreshing={true} />}
          ></ScrollView>
        </View>
      ) : error ? (
        <View style={[{ flex: 1 }, { backgroundColor: "#fff" }]}>
          <View style={{ height: 0 }}></View>
          <ScrollView
            // Style your ScrollView as needed
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {error && <ErrorBox errorMessage={error} />}
          </ScrollView>
        </View>
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
  },
});

export default ArticleListPage;
