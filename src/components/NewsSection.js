// NewsSection.js
// https://chat.openai.com/c/774e5860-4bcf-4ba6-a2e2-d2943ee9f136
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NewsBlock from './NewsBlock'; // Ensure the path is correct based on your project structure
import NewsSeperator from './NewsSeperator';

const NewsSection = ({ sectionTitle, articles }) => {
  return (
    <View style={styles.sectionContainer}>
      {/*<Text style={styles.sectionTitle}>{sectionTitle}</Text>*/}
      {articles.map((article, index) => (
        <React.Fragment key={article.id}>
          <NewsBlock article={article} />
          {index < articles.length - 1 && <NewsSeperator />}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default NewsSection;
