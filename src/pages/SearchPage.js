import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Animated, RefreshControl } from 'react-native';
import { fetchSearchResults } from '../API';
import ArticleList from '../components/ArticleList';
import LoadingIndicator from '../components/LoadingIndicator'; // Ensure path is correct
import ErrorBox from '../components/ErrorBox'; // Ensure path is correct

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollY = new Animated.Value(0);
  const [refreshing, setRefreshing] = useState(false);



  const fetchArticles = async () => {
    if (query.length === 0) {
      setArticles([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchSearchResults(query);
      setArticles(data);
    } catch (error) {
      //console.error("Failed to fetch articles:", error);
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
  // Modify article data
  articles.forEach(article => {
    article.summary.show = true;
    article.image.show = false;
    article.title.size = 'medium';
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
        <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search articles..."
          value={query}
          onChangeText={text => setQuery(text)}
        />
      </View>
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
        <ErrorBox errorMessage={error}/>
      ) : (
        <ArticleList
          articles={articles}
          refreshControl={
            <RefreshControl refreshing={refreshing} />
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
 
  searchBarContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#dedede',
    height: 60, // Maintain the explicit height setting for the container
    justifyContent: 'center', // Centers the searchBar vertically within the container
    paddingHorizontal: 10, // Optional: add some horizontal padding to the container if desired
  },
  
  searchBar: {
    height: 40, // Adjust the height as needed to fit within the container, considering border and padding
    paddingHorizontal: 10, // Adjust horizontal padding to control the text input area size
    fontSize: 18,
    borderWidth: 3,
    borderColor: '#d5a64a',
    borderRadius: 5,
    marginHorizontal: 10,
    fontFamily: 'times',
    letterSpacing: 0.3,
  },
  
  
  infoMessage: {
    margin: 20,
    textAlign: 'center',
    color: 'gray',
  },
});

export default SearchPage;
