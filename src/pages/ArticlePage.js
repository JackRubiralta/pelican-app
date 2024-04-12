import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';
import { theme } from '../theme'; // Adjust the import path as needed
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import Photos from '../components/Photos'; // Make sure this path is correct

const ArticlePage = () => {
  const route = useRoute();
  const [error, setError] = useState('');
  const { article } = route.params; // Destructure directly to get the article object
  const navigation = useNavigation();

  const onSwipeRight = (gestureState) => {
    navigation.navigate('Home');
  }

  const swipe_config = {
    velocityThreshold: 0.22,
    directionalOffsetThreshold: 100
  };

  useEffect(() => {
    // This useEffect now only handles fetching article by ID or other metadata operations
    // Image height calculations are moved to Photos.js
  }, [article]);

  if (error) {
    return <View style={styles.center}><Text>{error}</Text></View>;
  }

  if (!article) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#0000ff" /></View>;
  }

  // Function to render the main image using Photos component
  const renderMainImage = (position) => (
    article.image && article.image.source && (
      <View style={position === 'bottom' ? { marginTop: theme.spacing.small } : { marginTop: theme.spacing.large }}>
        <Photos imageInfo={article.image} />
      </View>
    )
  );

  const titleStyle = [
    styles.title,
    { marginTop: article.image.position === 'top' ? theme.spacing.small : (theme.spacing.large - ((theme.titleSizes.big.lineHeight - theme.titleSizes.big.fontSize) * SIZE_MULTIPLIER)) }
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffff' }}> 
     <ScrollView style={styles.container}>
      <GestureRecognizer onSwipeRight={(state) => onSwipeRight(state)} config={swipe_config}>
       
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
              ) : item.type === 'image' ? (
                <View key={index} style={isLastItem ? {marginBottom: theme.spacing.large} : {}}>
                  <Photos imageInfo={item} />
                </View>
              ) : null;
            })} 
          </View>
       
      </GestureRecognizer>
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
