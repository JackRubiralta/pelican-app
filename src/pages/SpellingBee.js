import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from "react-native";
import Header from '../components/Header'; // Ensure this path matches your project structure
//import fetchSpellingData from "../API"
const { width } = Dimensions.get("window");
const SQUARE_SIZE = width * 0.2; // 20% of the screen width
const SPACING = 10;

const TODAYS_LETTERS = ["O", "N", "U", "L", "A", "P", "R"]; // Example letters

const SpellingBeeGame = () => {
  const [currentWord, setCurrentWord] = useState("");
  const [createdWords, setCreatedWords] = useState(new Set());
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success', 'error', 'info'
  const cursorOpacity = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const addLetter = (letter) => setCurrentWord(currentWord + letter);

  const deleteLastLetter = () => setCurrentWord(currentWord.slice(0, -1));

  const submitWord = () => {
    if (!currentWord.includes(TODAYS_LETTERS[0])) {
      setMessage("Missing center word!");
      setMessageType("error");
    } else if (createdWords.has(currentWord)) {
      setMessage("Word already found");
      setMessageType("info");
    } else if (currentWord.length < 4) {
      setMessage("Too short");
      setMessageType("error");
    } else {
      // Assuming you have a function or a way to check if the word is in a valid word list
      // if (!isValidWord(currentWord)) {
      //   setMessage("Not in word list");
      //   setMessageType("error");
      // } else {
        setMessage("Good job!");
        setMessageType("success");
        setCreatedWords(new Set(createdWords).add(currentWord));
      // }
    }
    setCurrentWord("");
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000); // Hide the message after 3 seconds
  };
  

  const renderLetterButton = (letter, index) => (
    <View key={`${letter}-${index}`} style={styles.letterWrapper}>
      <TouchableOpacity
        style={[styles.letter, letter === TODAYS_LETTERS[0] && styles.centerLetter]}
        onPress={() => addLetter(letter)}
      >
        <Text style={styles.letterText}>{letter}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.mContainer}>
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        {message ? (
          <Text
            style={[
              styles.message,
              messageType === "error" && styles.errorMessage,
              messageType === "info" && styles.infoMessage,
            ]}
          >
            {message}
          </Text>
        ) : <Text style={styles.placeholderMessage}></Text>}
      </View>
      <View style={styles.wordDisplayContainer}>
        <Text style={styles.wordDisplay}>
          {currentWord}
          <Animated.View style={[styles.cursor, { opacity: cursorOpacity }]} />
        </Text>
      </View>
      <View style={styles.row}>{TODAYS_LETTERS.slice(1, 3).map(renderLetterButton)}</View>
      <View style={styles.row}>
        {TODAYS_LETTERS.slice(3, 4).map(renderLetterButton)}
        {TODAYS_LETTERS.slice(0, 1).map(renderLetterButton)}
        {TODAYS_LETTERS.slice(4, 5).map(renderLetterButton)}
      </View>
      <View style={styles.row}>{TODAYS_LETTERS.slice(5).map(renderLetterButton)}</View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={submitWord}>
          <Text style={styles.buttonText}>Enter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={deleteLastLetter}>
          <Text style={styles.buttonText}>Delete</Text>
       
 </TouchableOpacity>
      </View>
    </View>
    </View>
  );
};


const styles = StyleSheet.create({
  mContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    padding: SPACING,
  },
  cursor: {
    width: 2,
    height: '100%', // This will be adjusted in the wordDisplay to match the text height
    backgroundColor: '#000',
    marginLeft: 5,
  },
  wordDisplayContainer: {
    marginBottom: SPACING,
  },
  wordDisplay: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: SPACING,
    flexDirection: 'row', // Adjusted to align text and cursor
    alignItems: 'center', // Ensure the cursor aligns properly with the text
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterWrapper: {
    margin: SPACING / 2,
  },
  letter: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    margin: SPACING,
  },
  centerLetter: {
    backgroundColor: 'gold',
  },
  letterText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: SPACING * 2,
  },
  controlButton: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: '#333',
    fontSize: 20,
  },
  message: {
    fontSize: 16,
    color: 'green',
    padding: SPACING,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: 'red',
    padding: SPACING,
    textAlign: 'center',
  },
  infoMessage: {
    fontSize: 16,
    color: '#555',
    padding: SPACING,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: SPACING,
    },
    messageContainer: {
    height: 30, // Fixed height for the message container
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SPACING,
    },
    placeholderMessage: {
    height: 30, // Ensures the container maintains its size even when empty
    },
    // Oth
});
export default SpellingBeeGame;