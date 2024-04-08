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

  // Function to render the main image
  const renderMainImage = (position) => (
    article.image && article.image.source && mainImageHeight && (
      <Image
        source={{ uri: `${API_BASE_URL}${article.image.source}` }}
        style={[styles.mainImage, { height: mainImageHeight }, 
          position === 'bottom' ? { marginTop: theme.spacing.small } : { marginTop: theme.spacing.large } // same as padding on sides
        ]} // Apply dynamic height
        resizeMode="cover"
      />
    )
  );


  const titleStyle = [
    styles.title,
    { marginTop: article.image.position === 'top' ? theme.spacing.small : (theme.spacing.large - ((theme.titleSizes.big.lineHeight- theme.titleSizes.big.fontSize) * SIZE_MULTIPLIER)) } // same as padding on sides
  ];
  // Inside your ArticlePage component

return (
  <SafeAreaView style={{ flex: 1 }}> 
    <ScrollView style={styles.container}>
      {article.image.position === 'top' && renderMainImage('top')}
      
      <Text style={titleStyle}>{article.title.text}</Text>
      <Text style={styles.author}>Published on {article.date} by {article.author}</Text>

      {(!article.image.position || article.image.position === 'bottom') && renderMainImage('bottom')}

      <View style={styles.articleContent}>
        {article.content.map((item, index) => {
          const isLastItem = index === article.content.length - 1;
          return item.type === 'paragraph' ? (
            <Text key={index} style={[
              styles.contentParagraph, 
              isLastItem ? {marginBottom: (theme.spacing.large - (theme.fonts.content.lineHeight - theme.fonts.content.fontSize))} : {}
            ]}>{item.text}</Text>
          ) : item.type === 'image' && contentImageHeights[index] ? (
            <Image
              key={index}
              source={{ uri: `${API_BASE_URL}${item.source}` }}
              style={[
                styles.contentImage, 
                { height: contentImageHeights[index] }, 
                isLastItem ? {marginBottom: theme.spacing.large} : {}
              ]}
              resizeMode="cover"
            />
          ) : null;
        })} 
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
    fontSize: theme.fonts.summary.fontSize * SIZE_MULTIPLIER * 0.9,
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
