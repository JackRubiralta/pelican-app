import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { fetchSearchResults } from '../API';
import ArticleList from '../components/ArticleList';
import LoadingIndicator from '../components/LoadingIndicator'; // Ensure path is correct
import ErrorBox from '../components/ErrorBox'; // Ensure path is correct

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchArticles();
  }, [query]);

  // Modify article data
  articles.forEach(article => {
    article.summary.show = true;
    article.image.show = false;
    article.title.size = 'medium';
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search articles..."
          value={query}
          onChangeText={text => setQuery(text)}
        />
      </View>
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
    // Add other styling properties as needed, like flex, width, height, etc.
  },
  searchBarContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#dedede',
  },
  searchBar: {
    margin: 10,
    padding: 10,
    fontSize: 18,
    borderWidth: 3,
    borderColor: '#d5a64a',
    borderRadius: 5,
  },
  infoMessage: {
    margin: 20,
    textAlign: 'center',
    color: 'gray',
  },
});

export default SearchPage;
