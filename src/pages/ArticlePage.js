import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchArticleById, API_BASE_URL } from '../API';

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
    <ScrollView style={styles.articleContainer}>
    <Text style={styles.articleTitle}>{article.title.text}</Text>
    {article.summary.content && <Text style={styles.articleSummary}>{article.summary.content}</Text>}

    {/* Move the author information above the main image */}
    <Text style={styles.author}>Published on {article.date} by {article.author}</Text>

    {/* Conditional rendering for the main image */}
    {article.image && article.image.source && mainImageHeight && (
      <Image
        source={{ uri: `${API_BASE_URL}${article.image.source}` }}
        style={[styles.articleMainImage, { height: mainImageHeight }]} // Apply dynamic height
        resizeMode="cover"
      />
    )}

    <View style={styles.articleContent}>
      {article.content.map((item, index) => (
        item.type === 'paragraph' ? (
          <Text key={index} style={styles.articleContentParagraph}>{item.text}</Text>
        ) : item.type === 'image' && contentImageHeights[index] ? (
          <Image
            key={index}
            source={{ uri: `${API_BASE_URL}${item.source}` }}
            style={[styles.articleContentImage, { height: contentImageHeights[index] }]}
            resizeMode="cover"
          />
        ) : null
      ))}
    </View>
</ScrollView>

);
};

const styles = StyleSheet.create({
  articleContainer: {
    padding: 20, // 20px
    backgroundColor: '#fff',

  },
  articleTitle: {
    fontFamily: 'times', // Make sure to load custom fonts properly in React Native
    fontSize: 31, // 2rem * 16
    lineHeight: 31.5, // Approximation for 2.25rem * 16
    color: '#121212',
    fontWeight: '700', // Bold
  },
  articleSummary: {
    color: '#5A5A5A',
    fontFamily: 'nyt-cheltenham-normal',
    fontSize: 19, // 1.3rem * 16
    lineHeight: 26, // Approximation for 1.5925rem * 16
    marginTop: 12,
  },

  author: {
    fontFamily: 'georgia',
    fontSize: 13.5, // Converted from 0.6875rem
    color: '#727272',
    marginTop: 12,
  },
  articleMainImage: {
    width: '100%',
    height: undefined, // Remove 'auto' and use undefined to allow dynamic height calculation
    marginTop: 12,
  },

  articleContentParagraph: {
    marginTop: 12 , // 0.78125rem * 16 approximation
    // overflow-wrap: break-word; Not supported, text will wrap by default in React Native
    color: '#2e2e2e', // Assuming this was the intended fallback color
    fontFamily: 'times',
    fontSize: 15.8, // 1.12rem * 16
    lineHeight: 25, // 1.5625rem * 16 approximation
  },
 
  articleContentImage: {
    width: '100%',
    marginTop: 12 ,  },
  
});




export default ArticlePage;
