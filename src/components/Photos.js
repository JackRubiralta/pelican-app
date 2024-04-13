// Photos.js
import React, { useState, useEffect } from "react";
import { Image, Dimensions } from "react-native";
import { API_BASE_URL } from "../API"; // Adjust the import path as needed
const Photos = ({ imageInfo, isSquare = false }) => {
  const [imageHeight, setImageHeight] = useState(200); // Default height
  const imageUrl = imageInfo ? `${API_BASE_URL}/images/${imageInfo.source}` : null;

  useEffect(() => {
    if (imageUrl && !isSquare) { // Only adjust height if not square
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
    return ( // Ensure return statement is here
      <Image
        style={{
          width: '100%', // Set both width and height to the same value
          aspectRatio: 1,
        }}
        source={{ uri: imageUrl }} // Ensure you use imageUrl here
      />
    );
  }

  return (
    <Image
      style={{ height: imageHeight, width: "100%" }}
      source={{ uri: imageUrl }}
    />
  );
};

export default Photos;
