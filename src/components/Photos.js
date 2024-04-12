// Photos.js
import React, { useState, useEffect } from 'react';
import { Image, Dimensions } from 'react-native';
import { API_BASE_URL } from '../API'; // Adjust the import path as needed

const Photos = ({ imageInfo }) => {
  const [imageHeight, setImageHeight] = useState(200); // Default height
  const imageUrl = imageInfo ? `${API_BASE_URL}/images/${imageInfo.source}` : null;

  useEffect(() => {
    if (imageUrl) {
      Image.getSize(
        imageUrl,
        (width, height) => {
          const screenWidth = Dimensions.get('window').width - 40; // Assuming 20 padding on each side
          const scaleFactor = width / screenWidth;
          const imageHeight = height / scaleFactor;
          setImageHeight(imageHeight);
        },
        (error) => {
          console.error(`Cannot fetch image dimensions: ${error}`);
        }
      );
    }
  }, [imageUrl]);

  if (!imageInfo) {
    return null;
  }

  return <Image style={{ height: imageHeight, width: '100%' }} source={{ uri: imageUrl }} />;
};

export default Photos;
