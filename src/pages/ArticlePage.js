import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native";
import { theme } from "../theme";
import GestureRecognizer from "react-native-swipe-gestures";
import Photos from "../components/Photos";

const ArticlePage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [error, setError] = useState("");
  const { article } = route.params;

  const onSwipeRight = () => {
    navigation.navigate("Home");
  };

  const swipe_config = {
    velocityThreshold: 0.22,
    directionalOffsetThreshold: 100,
  };

  useEffect(() => {}, [article]);

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!article) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderFormattedText = (text) => {
    // Function to recursively parse and apply text styles
    const parseText = (text, styles = {}) => {
      // Regular expressions to find bold and italic text
      const boldPattern = /\\\*(.*?)\\\*/g; // Corrected regex for bold
      const italicPattern = /\\i(.*?)\\i/g; // Correct regex for italic

      let segments = []; // This will hold text segments with styles

      // Function to push text segments
      const pushSegment = (content, style) => {
        segments.push(
          <Text key={segments.length} style={style}>
            {content}
          </Text>
        );
      };

      // Merge all matches and sort by index
      let allMatches = [
        ...text.matchAll(boldPattern),
        ...text.matchAll(italicPattern),
      ];
      allMatches.sort((a, b) => a.index - b.index);

      let lastIndex = 0;

      allMatches.forEach((match) => {
        // Text before the match
        const textBefore = text.substring(lastIndex, match.index);
        if (textBefore) pushSegment(textBefore, styles);

        // Styled text
        const styledText = match[1]; // Captured group
        const newStyles = { ...styles }; // Clone current styles
        if (match[0].startsWith("\\*")) newStyles.fontWeight = "bold"; // Apply bold
        if (match[0].startsWith("\\i")) newStyles.fontStyle = "italic"; // Apply italic

        pushSegment(styledText, newStyles);

        lastIndex = match.index + match[0].length; // Update last index after current match
      });

      // Remaining text after the last match
      const remainingText = text.substring(lastIndex);
      if (remainingText) pushSegment(remainingText, styles);

      return segments;
    };

    return <Text>{parseText(text)}</Text>;
  };

  const renderMainImage = (position) =>
    article.image &&
    article.image.source && (
      <View
        style={
          position === "bottom"
            ? { marginTop: theme.spacing.small }
            : { marginTop: theme.spacing.large }
        }
      >
        <Photos imageInfo={article.image} showCaption={true} />
      </View>
    );

  if (article.image?.position === "side") {
    article.image.position = "bottom";
  }

  const titleStyle = [
    styles.title,
    {
      marginTop:
        article.image.position === "top"
          ? theme.spacing.small
          : theme.spacing.large -
            (theme.titleSizes.big.lineHeight - theme.titleSizes.big.fontSize) *
              SIZE_MULTIPLIER,
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffff" }}>
      <ScrollView style={styles.container}>
        <GestureRecognizer onSwipeRight={onSwipeRight} config={swipe_config}>
          {article.image.position === "top" && renderMainImage("top")}
          <Text style={titleStyle}>
            {renderFormattedText(article.title.text)}
          </Text>
          <Text style={styles.author}>
            Published on {article.date} by {article.author}
          </Text>
          {(article.image.position === "bottom") &&
            renderMainImage("bottom")}

          <View style={styles.articleContent}>
            {article.content.map((item, index) => {
              const isLastItem = index === article.content.length - 1;

              switch (item.type) {
                case "paragraph":
                  return (
                    <Text
                      key={index}
                      style={[
                        styles.contentParagraph,
                        isLastItem
                          ? { marginBottom: theme.spacing.medium }
                          : {},
                      ]}
                    >
                      {renderFormattedText(item.text)}
                    </Text>
                  );

                case "image":
                  return (
                    <View
                      key={index}
                      style={[
                        styles.contentImage,

                        isLastItem
                          ? { marginBottom: theme.spacing.medium }
                          : {},
                      ]}
                    >
                      <Photos imageInfo={item} showCaption={true} />
                    </View>
                  );
                case "list":
                  return (
                    <View key={index} style={styles.listContainer}>
                      {item.items.map((listItem, listItemIndex) => (
                        <View key={listItemIndex} style={styles.listItem}>
                          <Text style={styles.bulletPoint}> • </Text>
                          <Text style={styles.listItemText}>
                            {renderFormattedText(listItem)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  );

                case "header":
                  return (
                    <Text
                      key={index}
                      style={[
                        styles.contentHeader,
                        isLastItem
                          ? { marginBottom: theme.spacing.medium }
                          : {},
                      ]}
                    >
                      {renderFormattedText(item.text)}
                    </Text>
                  );
                case "quote":
                  return (
                    <View style={styles.contentQuoteContainer} key={index}>
                      <View style={[styles.quoteSeparator]} />
                      <Text style={styles.contentQuote}>
                        {renderFormattedText(item.text)}
                      </Text>
                      <View
                        style={[
                          styles.quoteSeparator,
                          { marginTop: 0, marginBottom: 5 },
                        ]}
                      />
                    </View>
                                    
                  );
                default:
                  return null;
              }
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
    paddingTop: 0,
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
    lineHeight: theme.fonts.summary.lineHeight
      ? theme.fonts.summary.lineHeight * SIZE_MULTIPLIER
      : undefined, // Only scale lineHeight if it exists
    marginTop: theme.spacing.small,
  },
  listContainer: {
    marginTop: theme.spacing.medium,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start", // Align items to start to handle multiline text alignment
  },
  bulletPoint: {
    fontSize: theme.fonts.content.fontSize, // Match font size of list item text or as desired
  },
  listItemText: {
    flex: 1, // Takes full width minus bullet point, allowing for proper wrapping of text
    ...theme.fonts.content, // Inherits the content font style including 'Georgia'
  },

  author: {
    ...theme.fonts.author,
    fontSize: theme.fonts.author.fontSize * SIZE_MULTIPLIER - 0.01,
    lineHeight: theme.fonts.author.lineHeight
      ? theme.fonts.author.lineHeight * SIZE_MULTIPLIER
      : undefined, // Only scale lineHeight if it exists
    marginTop: theme.spacing.small,
  },
  mainImage: {
    width: "100%",
    marginTop: theme.spacing.small,
  },
  articleContent: {},
  contentParagraph: {
    ...theme.fonts.content,
    marginTop: theme.spacing.medium,
  },
  contentQuoteContainer: {
    width: "80%",
    alignItems: "center", // Changed from 'alignContent' to 'alignItems' for horizontal alignment
    justifyContent: "center", // Added for vertical alignment
    alignSelf: "center",
    textAlign: "center",
  },
  contentQuote: {
    ...theme.fonts.content,
    marginTop: theme.spacing.small,
    marginBottom: theme.spacing.small,
    fontSize: 21,
    paddingHorizontal: 25,
    textAlign: "center",
  },
  quoteSeparator: {
    height: 2,
    backgroundColor: "#303030",
    alignSelf: "center",
    marginTop: theme.spacing.medium + 5,
    width: "90%", // Set a specific width or keep it 'auto' if you prefer it to be based on content
  },
  contentHeader: {
    ...theme.fonts.content,
    marginTop: theme.spacing.medium,

    marginBottom: -theme.spacing.medium,
  },
  contentImage: {
    width: "100%",
    marginTop: theme.spacing.medium,
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
});

export default ArticlePage;
