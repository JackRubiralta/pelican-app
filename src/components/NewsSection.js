import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NewsBlock from './NewsBlock'; // Ensure the path is correct based on your project structure
import NewsSeparator from './NewsSeparator'; // Typo corrected from 'Seperator' to 'Separator'

const NewsSection = ({ sectionTitle, articles }) => {
  return (
    
    <View style={styles.sectionContainer}>
      {/* Re-enabled and styled the section title to be smaller and positioned below the top bar */}
      {articles.map((article, index) => (
        <React.Fragment key={article.id}>
          {/* Conditional rendering based on section title */}
         
            <NewsBlock article={article} />
          
          {/* Render separator except after the last article */}
          {index < articles.length - 1 && <NewsSeparator />}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    // If needed, adjust padding or margin to position the section below a top bar
  },
  sectionTitle: {
    fontSize: 18, // Reduced font size for a smaller appearance
    fontWeight: 'bold',
    // Added margin for spacing and to ensure it's positioned below any top bar
    marginTop: 10, 
    marginBottom: 10, // Adjust as needed to fit your design
    // Optional: additional styling such as text alignment or color
    textAlign: 'left',
    color: '#000', // Example color
  },
});

export default NewsSection;
