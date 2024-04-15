import React, { useState, useEffect, useRef } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard, // Import the Keyboard module
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { fetchCrossword } from "../API";
import { theme } from "../theme";
import Header from "../components/Header"; // Adjust the import path as necessary
import AsyncStorage from "@react-native-async-storage/async-storage";

// https://chat.openai.com/c/26276fd5-f14d-4b63-b3cb-fc18c57d2a34

function createGridData(CLUE_DATA) {
  // Assuming a grid size of 11x11 based on your provided structure
  let grid = [];

  // Helper function to convert 'A1', 'B3' to grid indices
  function parseGridRef(ref) {
    const row = ref.charCodeAt(0) - "A".charCodeAt(0);
    const col = parseInt(ref.slice(1)) - 1;
    return { row, col };
  }

  // Initialize grid with null values
  for (let i = 0; i < 11; i++) {
    grid[i] = [];
    for (let j = 0; j < 11; j++) {
      grid[i][j] = {
        id: `${String.fromCharCode(65 + i)}${j + 1}`,
        letter: null,
        clues: null,
        label: null,
      };
    }
  }

  // Populate the grid with clues data
  Object.entries(CLUE_DATA).forEach(([key, { answer, boxes, number }]) => {
    boxes.forEach((box, index) => {
      const { row, col } = parseGridRef(box);
      if (!grid[row][col].clues) {
        grid[row][col].clues = [];
      }
      grid[row][col].letter = answer[index];
      grid[row][col].clues.push(key);
      if (index === 0) {
        // Set the label only at the start of each word
        grid[row][col].label = number;
      }
    });
  });

  // Convert grid array to required structure
  const formattedGrid = [];
  grid.forEach((row, index) => {
    row.forEach((cell) => {
      formattedGrid.push(cell);
    });
  });

  return formattedGrid;
}
function generateUserInputs(gridData) {
  const userInputs = {};

  // Loop through each item in the grid data
  gridData.forEach((cell) => {
    // Check if the cell has a non-null letter
    if (cell.letter !== null) {
      // Add the cell's ID with an empty string as its initial input value
      userInputs[cell.id] = "";
    }
  });

  return userInputs;
}

const Crossword = () => {
  const [activeClueBoxes, setActiveClueBoxes] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const [activeClue, setActiveClue] = useState(null);
  const [boxInFocus, setBoxInFocus] = useState(null);
  const [focusDirection, setFocusDirection] = useState(null); // New state to track focus direction
  const [cursorPositions, setCursorPositions] = useState({}); // State to keep track of cursor positions
  const [correctness, setCorrectness] = useState({});
  const [CLUE_DATA, setCLUE_DATA] = useState(null);
  const [GRID_DATA, setGRID_DATA] = useState([]);
  const [userInputs, setUserInputs] = useState({});
  const [temp, setTemp] = useState(false);

  const resetFocusAndHighlight = () => {
    setActiveClue(null);
    setActiveClueBoxes([]); // Clear active clue boxes
    setBoxInFocus(null); // Clear box focus
    setFocusDirection(null);
  };
  const loadUserInputs = async () => {
    try {
      const savedInputs = await AsyncStorage.getItem("crosswordInputs");
      if (savedInputs) {
        setUserInputs(JSON.parse(savedInputs));
      } else {
        setUserInputs(generateUserInputs(GRID_DATA));
      }
    } catch (error) {
      console.error("Failed to load user inputs:", error);
    }
  };

  // Save user inputs to storage
  const saveUserInputs = async () => {
    try {
      await AsyncStorage.setItem("crosswordInputs", JSON.stringify(userInputs));
    } catch (error) {
      console.error("Failed to save user inputs:", error);
    }
  };

  useEffect(() => {
    const fetchAndProcessCrossword = async () => {
      try {
        const data = await fetchCrossword();
        setCLUE_DATA(data); // Save the fetched data
        const gridData = createGridData(data); // Process fetched data to create grid
        gridData.forEach((cell) => {
          cell.ref = React.createRef();
        });

        setGRID_DATA(gridData); // Set the grid data
        if (userInputs != '') {
          loadUserInputs();

        } else {
        setUserInputs(generateUserInputs(gridData)); // Generate user inputs based on grid data
        saveUserInputs();
      }
        const keyboardDidHideListener = Keyboard.addListener(
          "keyboardDidHide",
          resetFocusAndHighlight
        );
        
        return () => {
          // Clean up the listener when the component unmounts
          keyboardDidHideListener.remove();
        };
      } catch (error) {
        console.error("Failed to fetch crossword data:", error);
        Alert.alert("Error", "Failed to load crossword data.");
      }
    };

    fetchAndProcessCrossword();
  }, []);

  useEffect(() => {
    // Initialize cursor positions based on user inputs
    const initialPositions = {};
    Object.keys(userInputs).forEach((key) => {
      initialPositions[key] = {
        start: userInputs[key].length,
        end: userInputs[key].length,
      };
    });
    setCursorPositions(initialPositions);
  }, [userInputs]);

  const handleClueSelectionFromBox = (boxId, clueKey) => {
    if (!CLUE_DATA[clueKey]) return;
    setActiveClueBoxes(CLUE_DATA[clueKey].boxes);
    setActiveClue(clueKey);
    setBoxInFocus(boxId);
    const firstBoxRef = GRID_DATA.find((cell) => cell.id === boxId).ref;
    firstBoxRef.current.focus();
  };

  if (!CLUE_DATA) {
    return (
      <SafeAreaView style={[{ flex: 1 }, { backgroundColor: "#fff" }]}>
        <Header title="Crossword" />
        <ScrollView
          // Style your ScrollView as needed
          refreshControl={<RefreshControl refreshing={true} />}
        ></ScrollView>
      </SafeAreaView>
    );
  }

  const handleClueSelection = (clueKey) => {
    setActiveClueBoxes(CLUE_DATA[clueKey].boxes);
    setActiveClue(clueKey);
    setBoxInFocus(CLUE_DATA[clueKey].boxes[0]);
    setFocusDirection(CLUE_DATA[clueKey].direction); // Update focus direction when clue is selected
    const firstBoxRef = GRID_DATA.find(
      (cell) => cell.id === CLUE_DATA[clueKey].boxes[0]
    ).ref;
    firstBoxRef.current.focus();
  };

  const handleInputChange = (id, text) => {
    let newText = text.toUpperCase().replace(userInputs[id], "");
    newText = newText.length > 1 ? newText.charAt(text.length - 1) : newText;

    setUserInputs((prevInputs) => {
      const updatedInputs = { ...prevInputs, [id]: newText };
      saveUserInputs(updatedInputs); // Save after updating
      return updatedInputs;
    });

    // Move focus to the next box in activeClueBoxes
    const currentIndex = activeClueBoxes.indexOf(id);
    if (currentIndex !== -1 && currentIndex + 1 < activeClueBoxes.length) {
      const nextBoxId = activeClueBoxes[currentIndex + 1];
      const nextBoxRef = GRID_DATA.find((c) => c.id === nextBoxId).ref;
      nextBoxRef.current.focus();
    }
  };
  const revealAnswers = () => {
    const newInputs = { ...userInputs };
    GRID_DATA.forEach((cell) => {
      if (cell.letter) {
        newInputs[cell.id] = cell.letter.toUpperCase();
      }
    });
    setUserInputs(newInputs); // Update state to show all answers
    setCorrectness({}); // Optionally clear correctness state if you don't want to validate after revealing answers
  };

  const renderClues = (direction) => {
    return (
      <View style={styles.clueListContainer}>
        {Object.entries(CLUE_DATA)
          .filter(([key, clue]) => clue.direction === direction)
          .map(([key, clue], index) => (
            <TouchableOpacity
              key={key}
              onPress={() => handleClueSelection(key)}
              style={[styles.clueItem, activeClue === key && styles.activeClue]}
            >
              <Text style={styles.clueItemNumber}>{clue.number}.</Text>
              <Text style={styles.clueItemText}>{clue.clue}</Text>
            </TouchableOpacity>
          ))}
      </View>
    );
  };

  const renderGrid = () => {
    return GRID_DATA.map((cell, index) => (
      <View
        key={index}
        style={[
          styles.box,
          !cell.letter && styles.blank,
          activeClueBoxes.includes(cell.id) && styles.highlight,
          boxInFocus === cell.id && styles.focus,
        ]}
      >
        {cell.label && <Text style={styles.boxLabel}>{cell.label}</Text>}
        {!!cell.letter && (
          <TextInput
            ref={cell.ref}
            caretHidden={true}
            style={styles.boxInput}
            selection={cursorPositions[cell.id]} // Keep cursor to the right
            maxLength={2}
            value={userInputs[cell.id]} // Controlled component
            onChangeText={(text) => {
              handleInputChange(cell.id, text);
              // Update the cell's letter in your state or context if you're managing the grid data dynamically (this is not shown here)
              // Move focus to the next box in activeClueBoxes
              const currentIndex = activeClueBoxes.indexOf(cell.id);
              if (
                currentIndex !== -1 &&
                currentIndex + 1 < activeClueBoxes.length
              ) {
                const nextBoxId = activeClueBoxes[currentIndex + 1];
                const nextBoxRef = GRID_DATA.find(
                  (c) => c.id === nextBoxId
                ).ref;
                setTemp(false);
                nextBoxRef.current.focus();
              }
            }}
            onFocus={() => {
              if (activeClueBoxes.includes(cell.id)) {
                // If the focused box is part of the currently active clue, keep everything as is
                setBoxInFocus(cell.id);
              } else {
                // Find a new clue to activate based on the focus direction or switch to the other direction if necessary
                const clueKey =
                  cell.clues.find(
                    (clue) => CLUE_DATA[clue].direction === focusDirection
                  ) ||
                  cell.clues.find(
                    (clue) => CLUE_DATA[clue].direction !== focusDirection
                  );
                handleClueSelectionFromBox(cell.id, clueKey);
                setBoxInFocus(cell.id);
              }
            }}
          />
        )}
      </View>
    ));
  };
  const checkAnswers = () => {
    let isCorrect = true;
    const newCorrectness = {};

    GRID_DATA.forEach((cell) => {
      const userInput = userInputs[cell.id] || "";
      const correctAnswer = cell.letter || "";
      const isCellCorrect =
        userInput.toUpperCase() === correctAnswer.toUpperCase();
      newCorrectness[cell.id] = isCellCorrect;
      if (!isCellCorrect) {
        isCorrect = false;
      }
    });

    setCorrectness(newCorrectness);
    Alert.alert(
      "Check Complete",
      isCorrect ? "All answers are correct!" : "Some answers are incorrect."
    );
  };

  const clearAnswers = () => {
    const resetInputs = {};
    Object.keys(userInputs).forEach((key) => {
      resetInputs[key] = ""; // Set each input to an empty string
    });
    setUserInputs(resetInputs);
    saveUserInputs(resetInputs); // Save the reset state
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView>
        <Header title="Crossword" />

        <View style={styles.container}>
          <View style={{ height: theme.spacing.medium }}></View>

          <View style={styles.grid}>{renderGrid()}</View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={revealAnswers}
              style={[styles.button, styles.revealButton]}
            >
              <Text style={styles.revealButtonText}>Reveal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={checkAnswers}
              style={[styles.button, styles.checkButton]}
            >
              <Text style={styles.checkButtonText}>Check</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={clearAnswers}
              style={[styles.button, styles.clearButton]}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cluesContainer}>
            <Text style={styles.clueHeader}>Across</Text>
            {renderClues("across")}
            <Text style={styles.clueHeader}>Down</Text>
            {renderClues("down")}
          </View>
          <View style={{ height: theme.spacing.medium }}></View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const { width } = Dimensions.get("window");
const numberOfCellsPerRow = 11; // Assuming 11 cells per row
const boxSize = (width - 40 - 2.001) / numberOfCellsPerRow; // 40 is the total horizontal padding
const SPACING = 12; // Consistent spacing for layout coherence
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,
    paddingTop: 0,
    backgroundColor: "#fff",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    borderWidth: 1,
    padding: 0,
    borderColor: "#000",
  },
  box: {
    width: boxSize,
    height: boxSize,
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8E8E8", // Slightly lighter gray for a softer look
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: theme.spacing.small,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  checkButton: {
    backgroundColor: "#4169E1",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  revealButton: {
    backgroundColor: "#32CD32",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  clearButton: {
    backgroundColor: "#FF6347", // Tomato color for the clear button
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  checkButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  revealButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  clearButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  boxInput: {
    width: "100%",
    height: "100%",
    textAlign: "center",
    fontSize: 18,
    color: "#333",
    backgroundColor: "transparent", // Ensure input background doesn't distract
  },
  blank: {
    backgroundColor: "#A9A9A9", // Dark gray for blank cells to distinguish them
  },
  highlight: {
    backgroundColor: "#FFFFA0", // Soft yellow for highlight
  },
  focus: {
    backgroundColor: "#ADD8E6", // Light blue for focused cell, easier on the eyes
  },
  boxLabel: {
    position: "absolute",
    top: 1.5,
    left: 2.5,
    fontSize: 9,
    color: "#333",
    fontWeight: "bold",
  },
  clueListContainer: {
    marginTop: 1,
  },
  clueItem: {
    flexDirection: "row",
    alignItems: "flex-start", // Ensure the numbers align with the first line of the clue text
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  clueItemNumber: {
    fontWeight: "bold",
    marginRight: 6,
    color: "#5A5A5A", // Grey for numbers
    fontSize: 16,
  },
  clueItemText: {
    flex: 1, // Allow the clue text to wrap correctly
    color: "#000", // Black for the clue text
    fontSize: 16,
    fontFamily: "Arial", // Common font family
  },
  activeClue: {
    backgroundColor: "#ADD8E6", // Light blue for active clue background
    borderRadius: 4,
    paddingHorizontal: 6,
  },
  clueHeader: {
    fontSize: 19.5, // Slightly reduced font size for a cleaner look
    fontWeight: "bold", // Keep bold for emphasis
    color: "#333", // Dark enough for good readability
    marginTop: 15, // Adequate space above the header to separate it from other content
    marginBottom: 1, // Small gap before the clues begin
  },
});

export default Crossword;
