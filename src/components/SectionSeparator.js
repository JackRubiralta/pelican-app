import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../theme";

const SectionSeparator = ({ sectionName, style }) => (
  <View style={[styles.separatorContainer, style]}>
    
    <View style={styles.separator} />
    <View style={styles.textContainer}>
      <Text style={styles.separatorText}>{sectionName}</Text>
    </View>
  </View>
);
const styles = StyleSheet.create({
  separatorContainer: {
    alignSelf: "center",
    marginVertical: theme.spacing.large + 7 + 3,

    marginBottom: 5,
    paddingHorizontal: theme.spacing.medium,
    width: "100%",
  },
  separator: {
    height: 2.4,
    backgroundColor: "#303030",
    width: "100%",
  },
  textContainer: {
    // Using flexbox to center the text both horizontally and vertically
    marginTop: 3,
    display: "flex",
    justifyContent: "left", // Centers the child components along the main axis (for vertical box, this is horizontally)
    alignItems: "left", // Centers the child components along the cross axis (for vertical box, this is vertically)
    height: 'auto', // Set a fixed height to ensure the text is aligned in the center. Adjust as needed.
  },
  separatorText: {
    color: "#303030",
    fontSize: 11.3,
    textAlign: "left",
    textTransform: "uppercase",
    fontFamily: "utm-times-bold",
    letterSpacing: 0.7,
  },
});

export default SectionSeparator;
