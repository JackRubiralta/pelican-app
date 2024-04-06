import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, RefreshControl, Animated } from "react-native";
import { fetchNewArticles } from "../API";
import ArticleList from "../components/ArticleList";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorBox from "../components/ErrorBox";
import Header from "../components/Header"; // Adjust this path to your Header component's location

const Recent = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = new Animated.Value(0);

  const fetchArticles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchNewArticles();
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

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [0, -60],
    extrapolate: "clamp",
  });

  const marginTopForContent = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [60, 0], // Adjust these values if your header size is different
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [
            {
              translateY: headerTranslateY,
            },
          ],
          zIndex: 1,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        <Header title="Recent" />
      </Animated.View>
      <Animated.View
        style={{
          flex: 1,
          marginTop: marginTopForContent, // Use the animated value for dynamic margin
        }}
      > 
        {isLoading ? (
          <LoadingIndicator />
        ) : error ? (
          <ErrorBox errorMessage={error} onRetry={fetchArticles} />
        ) : (
          <ArticleList
            articles={articles}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false } // useNativeDriver should be false because we are animating layout properties (marginTop)
            )}
          />
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
  },
});

export default Recent;
