// Photos.js
import React, { useState, useEffect } from "react";
import { Image, Dimensions, StyleSheet, Text, View } from "react-native";
import { API_BASE_URL } from "../API"; // Adjust the import path as needed
import { theme } from "../theme"; // Adjust the import path to where you've saved theme.js
const Photos = ({ imageInfo, isSquare = false, showCaption = false }) => {
  const [imageHeight, setImageHeight] = useState(200); // Default height
  const imageUrl = imageInfo
    ? `${API_BASE_URL}/images/${imageInfo.source}`
    : null;

  useEffect(() => {
    if (imageUrl && !isSquare) {
      // Only adjust height if not square
      Image.getSize(
        imageUrl,
        (width, height) => {
          const screenWidth = Dimensions.get("window").width - 40; // Assuming 20 padding on each side
          const scaleFactor = width / screenWidth;
          const imageHeight = height / scaleFactor;
          setImageHeight(imageHeight);
        },
        (error) => {
          console.error(`Cannot fetch image dimensions: ${error}`);
        }
      );
    }
  }, [imageUrl, isSquare]); // Include isSquare in dependency array

  if (!imageInfo) {
    return null;
  }
  if (isSquare) {
    return (
      // Ensure return statement is here
      <Image
        style={{
          width: "100%", // Set both width and height to the same value
          aspectRatio: 1,
        }}
        source={{ uri: imageUrl }} // Ensure you use imageUrl here
      />
    );
  }

  return (
    <View>
      <Image
        style={{ height: imageHeight, width: "100%" }}
        source={{ uri: imageUrl }}
      />
      {showCaption && <Text style={styles.caption}>{imageInfo.caption}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  caption: {
    ...theme.fonts.author,
    marginTop: theme.spacing.small - 5,
    fontSize: 10.5,
    color: '#373737',

  },
});

export default Photos;
