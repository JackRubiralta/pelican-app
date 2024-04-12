import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme'; // Adjust the import path to where you've saved theme.js
import Photos from './Photos'; // Import the new Photos component

const NewsBlock = ({ article }) => {
  const navigation = useNavigation();
  const { title, summary, author, image } = article;

  const navigateToArticle = () => {
    navigation.navigate('ArticlePage', {
      screen: 'Article',
      params: { article: article },
    });
  };

  // Adjust marginTop based on image position for the title
  const titleStyle = [
    styles[`${title.size}Title`],
    { marginTop: image.position === 'top' ? theme.spacing.small : 0 }
  ];
 return (
  <View style={styles.storyWrapper}>
    <TouchableOpacity onPress={navigateToArticle}>
      {image.position === 'top' && image.show && (
        <Photos imageInfo={image} />
      )}
      <View style={styles.storyContent}>
        <Text style={titleStyle}>{title.text}</Text>
        {summary && summary.show && <Text style={styles.summary}>{summary.content}</Text>}
        <Text style={[styles.author, { marginTop: theme.spacing.small }]}>By {author}</Text>
      </View>
      {image.position === 'bottom' && image.show && (
        <View style={{ marginTop: theme.spacing.small }}>
          <Photos imageInfo={image} />
        </View>
      )}
    </TouchableOpacity>
  </View>
);

};
const styles = StyleSheet.create({
  storyWrapper: {
    padding: theme.spacing.large,
    backgroundColor: "#fff",
    position: "relative",
    paddingVertical: 0,
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
    width: "100%",
  },
});

export default NewsBlock;
