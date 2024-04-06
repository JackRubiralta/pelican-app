import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../API';

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
    padding: 20,
    backgroundColor: '#fff',
    position: 'relative', /* Needed for absolute positioning of pseudo-element */

    // React Native does not support pseudo-elements (:before),
    // so you might need to add a separate View for the border if necessary.
  },
  // Removed storyLink since textDecorationLine: 'none' and color: 'inherit' are the defaults in React Native.
  storyContent: {
  },
  bigTitle: {
    fontFamily: 'nyt-cheltenham-normal', // fraunces-bold',
    fontSize: 28, // Converted from 1.68rem
    color: '#121212',
    fontWeight: 'bold', // React Native does not support numerical font weights; 'bold' is equivalent to 700
  },
  mediumTitle: {
    fontFamily: 'nyt-cheltenham-normal',
    fontSize: 24, // Converted from 1.5rem
    color: '#121212',
    fontWeight: 'bold',
  },
  smallTitle: {
    fontFamily: 'nyt-cheltenham-normal',
    fontSize: 21.5, // Converted from 1.27rem; React Native might round this value
    color: '#121212',
    fontWeight: 'bold',
  },
 
  summary: {
    color: '#5A5A5A',
    fontFamily: 'nyt-cheltenham-normal', // fraunces
    fontSize: 16.5, // Converted from 1.01rem; React Native might round this value
    lineHeight: 22, // Approximated conversion from 1.375rem
    position: 'relative',
    marginTop: 10,

    
    // React Native does not support 'margin-inline-start' and 'margin-inline-end' directly,
    // but if you are looking to ensure some spacing inside a container, paddingHorizontal can be used.
    // 'display: block;' and 'unicode-bidi: isolate;' have no direct equivalents in React Native.
    // React Native components like <Text> and <View> naturally block-level display in a flex context.
    // Additional properties for text and layout adjustment can be applied as needed.
    margin: 0,
  },
  author: {
    fontFamily: 'georgia',
    fontSize: 12, // Converted from 0.6875rem
    color: '#727272',
    marginTop: 11.5,
  },


  readTime: {
    textTransform: 'uppercase',
    color: '#727272',
  },
  
  image: {
	marginTop: 10,
    width: '100%',
  },
  // React Native does not support the CSS pseudo-class :not
  // You might need to add border logic in your component rendering based on index or condition
});

export default NewsBlock;
