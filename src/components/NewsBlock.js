import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../API';
import { theme } from '../theme'; // Adjust the import path to where you've saved theme.js

const NewsBlock = ({ article }) => {
  const navigation = useNavigation();
  const { id, title, summary, image, length, author } = article;
  const [imageHeight, setImageHeight] = useState(200); // Default height
  const imageUrl = image && image.show ? `${API_BASE_URL}${image.source}` : null;

  useEffect(() => {
    if (imageUrl) {
      Image.getSize(imageUrl, (width, height) => {
        const screenWidth = Dimensions.get('window').width - 40;
        const scaleFactor = width / screenWidth;
        const imageHeight = height / scaleFactor;
        setImageHeight(imageHeight);
      }, (error) => {
        console.error(`Cannot fetch image dimensions: ${error}`);
      });
    }
  }, [imageUrl]);

  const navigateToArticle = () => {
    navigation.navigate('ArticlePage', {
      screen: 'Article',
      params: { article: article },
    });
  };

  return (
    <View style={styles.storyWrapper}>
      <TouchableOpacity style={styles.storyContent} onPress={navigateToArticle}>
        <Text style={styles[`${title.size}Title`]}>{title.text}</Text>
        {summary && summary.show && <Text style={styles.summary}>{summary.content}</Text>}
        <Text style={styles.author}>By {author}</Text>
      </TouchableOpacity>
      {image && image.show && (
        <TouchableOpacity onPress={navigateToArticle}>
          <Image
            style={[styles.image, { height: imageHeight }]} // Use the dynamically set height
            source={{ uri: imageUrl }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};




const styles = StyleSheet.create({
  storyWrapper: {
    padding: theme.spacing.large,
    backgroundColor: '#fff',
    position: 'relative',
  },
  bigTitle: {
    ...theme.fonts.title,
    ...theme.titleSizes.big,
  },
  mediumTitle: {
    ...theme.fonts.title,
    ...theme.titleSizes.medium,
  },
  smallTitle: {
    ...theme.fonts.title,
    ...theme.titleSizes.small,
  },
  summary: {
    ...theme.fonts.summary,
    marginTop: theme.spacing.small,
  },
  author: {
    ...theme.fonts.author,
    marginTop: theme.spacing.small,
  },
  image: {
    marginTop: theme.spacing.small,
    width: '100%',
  },
});

export default NewsBlock;
