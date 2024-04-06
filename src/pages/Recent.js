import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import { fetchNewArticles } from '../API';
import ArticleList from '../components/ArticleList'; // Make sure the path matches where you've saved this file
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorBox from '../components/ErrorBox';

const Recent = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

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

  return (
    <View style={styles.container}>
      {isLoading ? (
        <LoadingIndicator />
      ) : error ? (
        <ErrorBox errorMessage={error} onRetry={fetchArticles} />
      ) : (
        <ArticleList
          articles={articles}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Recent;
