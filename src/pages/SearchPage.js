import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { fetchSearchResults } from '../API';
import ArticleList from '../components/ArticleList';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorBox from '../components/ErrorBox';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollY = new Animated.Value(0);

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
      setError(error.toString());
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, [query]);

  articles.forEach(article => {
    article.summary.show = true;
    article.image.show = false;
    article.title.size = 'medium';
  });

  const searchBarTranslateY = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -70],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{
        transform: [{ translateY: searchBarTranslateY }],
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#dedede',
        backgroundColor: '#ffff', // match container bg to avoid seeing content scroll behind
      }}>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search articles..."
            value={query}
            onChangeText={text => setQuery(text)}
          />
        </View>
      </Animated.View>
      <Animated.ScrollView
        style={{ flex: 1, paddingTop: 60 }} // Start content below the search bar
        contentContainerStyle={{ paddingTop: 10 }} // Extra padding at the top of the scroll content
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={[styles.centeredView]}>
          {isLoading ? (
            <LoadingIndicator/>
          ) : error ? (
            <ErrorBox errorMessage={error} onRetry={fetchArticles} />
          ) : query.length === 0 ? (
            <Text style={styles.infoMessage}>Enter a query to start searching.</Text>
          ) : articles.length === 0 ? (
            <Text style={styles.infoMessage}>No articles found. Try a different search.</Text>
          ) : (
            <ArticleList articles={articles} />
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  searchBarContainer: {
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  searchBar: {
    height: 40,
    paddingHorizontal: 10,
    fontSize: 18,
    borderWidth: 3,
    borderColor: '#d5a64a',
    borderRadius: 5,
    backgroundColor: 'white', // Ensure the searchBar background matches
    marginHorizontal: 10,
  },
  infoMessage: {
    margin: 20,
    textAlign: 'center',
    color: 'gray',
  },
});

export default SearchPage;
