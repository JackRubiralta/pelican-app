import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchArticleById, API_BASE_URL } from '../API';
import { SafeAreaView } from 'react-native';
import { theme } from '../theme'; // Adjust the import path to where you've saved theme.js

const ArticlePage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [error, setError] = useState('');
  const [mainImageHeight, setMainImageHeight] = useState(null);
  const [contentImageHeights, setContentImageHeights] = useState({});
  const { article } = route.params; // Destructure directly to get the article object
  console.log(article);
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        
 
        // Load main article image dimensions
        
        if (article.image.source) {
         Image.getSize(`${API_BASE_URL}${article.image.source}`, (width, height) => {
            const screenWidth = Dimensions.get('window').width - 40;
            const scaleFactor = width / screenWidth;
            const imageHeight = height / scaleFactor;
            setMainImageHeight(imageHeight);
          });
        }

        // Preload content images dimensions
        const newContentImageHeights = {};
        article.content.forEach((item, index) => {
          if (item.type === 'image') {
            Image.getSize(`${API_BASE_URL}${item.source}`, (width, height) => {
              const screenWidth = Dimensions.get('window').width - 40;
              const scaleFactor = width / screenWidth;
              const imageHeight = height / scaleFactor;
              newContentImageHeights[index] = imageHeight;

              // Update state only once all images have been processed
              if (Object.keys(newContentImageHeights).length === article.content.filter(item => item.type === 'image').length) {
                setContentImageHeights(newContentImageHeights);
              }
            });
          }
        });

      } catch (error) {
        console.error("Failed to fetch article:", error);
        setError('Failed to load the article');
      }
    };
    fetchArticle();
  }, [article]);

  if (error) {
    return <View style={styles.center}><Text>{error}</Text></View>;
  }

  if (!article) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#0000ff" /></View>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}> 
    <ScrollView style={styles.container}>
    <Text style={styles.title}>{article.title.text}</Text>
    {article.summary.content && <Text style={styles.summary}>{article.summary.content}</Text>}

    {/* Move the author information above the main image */}
    <Text style={styles.author}>Published on {article.date} by {article.author}</Text>

    {/* Conditional rendering for the main image */}
    {article.image && article.image.source && mainImageHeight && (
      <Image
        source={{ uri: `${API_BASE_URL}${article.image.source}` }}
        style={[styles.mainImage, { height: mainImageHeight }]} // Apply dynamic height
        resizeMode="cover"
      />
    )}

    <View style={styles.articleContent}>
      {article.content.map((item, index) => (
        item.type === 'paragraph' ? (
          <Text key={index} style={styles.contentParagraph}>{item.text}</Text>
        ) : item.type === 'image' && contentImageHeights[index] ? (
          <Image
            key={index}
            source={{ uri: `${API_BASE_URL}${item.source}` }}
            style={[styles.contentImage, { height: contentImageHeights[index] }]}
            resizeMode="cover"
          />
        ) : null
      ))}
    </View>
</ScrollView>
</SafeAreaView>

);
};


const SIZE_MULTIPLIER = 1.15;
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.large,
    paddingBottom: 0,
    backgroundColor: theme.colors.background,
  },
  title: {
    ...theme.fonts.title,
    fontSize: theme.titleSizes.big.fontSize * SIZE_MULTIPLIER,
    lineHeight: theme.titleSizes.big.lineHeight * SIZE_MULTIPLIER,
    marginTop: theme.spacing.medium,
  },
  summary: {
    ...theme.fonts.summary,
    fontSize: theme.fonts.summary.fontSize * SIZE_MULTIPLIER,
    lineHeight: theme.fonts.summary.lineHeight ? theme.fonts.summary.lineHeight * SIZE_MULTIPLIER : undefined, // Only scale lineHeight if it exists
    marginTop: theme.spacing.small,
  },
  author: {
    ...theme.fonts.author,
    fontSize: theme.fonts.author.fontSize * SIZE_MULTIPLIER,
    lineHeight: theme.fonts.author.lineHeight ? theme.fonts.author.lineHeight * SIZE_MULTIPLIER : undefined, // Only scale lineHeight if it exists
    marginTop: theme.spacing.small,
  },
  mainImage: {
    width: '100%',
    marginTop: theme.spacing.small,
  },
  articleContent: {},
  contentParagraph: {
    ...theme.fonts.content,
    marginTop: theme.spacing.medium,
  },
  contentImage: {
    width: '100%',
    marginTop: theme.spacing.medium,
  },
});
export default ArticlePage;
