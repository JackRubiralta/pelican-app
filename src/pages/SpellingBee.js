import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Define today's letters, with the first letter being the one in the middle
const TODAYS_LETTERS = ['O', 'N', 'U', 'L', 'A', 'P', 'R']; // Replace these with actual letters of the day

const SpellingBeeGame = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [createdWords, setCreatedWords] = useState(new Set());

  const addLetter = (letter) => {
    setCurrentWord(currentWord + letter);
  };

  const deleteLastLetter = () => {
    setCurrentWord(currentWord.slice(0, -1));
  };

  const submitWord = () => {
    if (!currentWord.includes(TODAYS_LETTERS[0])) {
      // Word is too short, already found, or does not include the center letter
      setCurrentWord('');
      return;
    }
    setCreatedWords(new Set(createdWords).add(currentWord));
    setCurrentWord('');
  };

  const renderLetterButton = (letter, index) => {
    return (
      <TouchableOpacity
        key={`${letter}-${index}`}
        style={[styles.letter, false && styles.centerLetter]}
        onPress={() => addLetter(letter)}
      >
        <Text style={styles.letterText}>{letter}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.wordDisplayContainer}>
        <Text style={styles.wordDisplay}>{currentWord}</Text>
      </View>

      <View style={styles.letterContainer}>
        {TODAYS_LETTERS.map(renderLetterButton)}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={deleteLastLetter}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      <TouchableOpacity style={styles.submitButton} onPress={submitWord}>
        <Text style={styles.buttonText}>Enter</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  letterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '80%'
  },
  letter: {
    width: 60,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    margin: 4,
    // Additional styles needed to create hexagon shape
  },
  centerLetter: {
    backgroundColor: 'gold',
  },
  letterText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  wordDisplay: {
    fontSize: 24,
    margin: 20,
  },
  submitButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
});

export default SpellingBeeGame;
