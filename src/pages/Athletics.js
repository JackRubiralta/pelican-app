import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, RefreshControl, Animated } from 'react-native';
import { fetchAthleticsArticles } from '../API';
import ArticleList from '../components/ArticleList';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorBox from '../components/ErrorBox';
import Header from '../components/Header'; // Ensure this path matches your project structure

const Athletics = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = new Animated.Value(0); // Added for animation

  const fetchArticles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAthleticsArticles();
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
      <Header title="Athletics" />
    </Animated.View>
      <Animated.View
        style={{
          flex: 1,
          marginTop: marginTopForContent, // Use the animated value for dynamic margin
        }}
      > 
       {isLoading && !refreshing ? (
          
          <LoadingIndicator />
        ) : error ? (
          <SafeAreaView style={{ flex: 1 }}>
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

export default Athletics;
