import React, { useState, useEffect, useRef, useCallback } from "react";
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
import ErrorBox from "../components/ErrorBox"; // Adjust the import path as necessary
import { debounce } from 'lodash';

// https://chat.openai.com/c/26276fd5-f14d-4b63-b3cb-fc18c57d2a34
const numberOfCellsPerRow = 15; // Assuming 11 cells per row

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
  for (let i = 0; i < numberOfCellsPerRow; i++) {
    grid[i] = [];
    for (let j = 0; j < numberOfCellsPerRow; j++) {
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
      userInputs[cell.id] = " ";
    }
  });

  return userInputs;
}

const Crossword = () => {
  const [activeClueBoxes, setActiveClueBoxes] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [cursorPositions, setCursorPositions] = useState({}); // State to keep track of cursor positions

  const [activeClue, setActiveClue] = useState(null);
  const [boxInFocus, setBoxInFocus] = useState(null);
  const [focusDirection, setFocusDirection] = useState(null); // New state to track focus direction
  const [correctness, setCorrectness] = useState({});
  const [CLUE_DATA, setCLUE_DATA] = useState(null);
  const [GRID_DATA, setGRID_DATA] = useState([]);
  const [userInputs, setUserInputs] = useState({});
  const scrollViewRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const resetFocusAndHighlight = () => {
    setActiveClue(null);
    setActiveClueBoxes([]); // Clear active clue boxes
    setBoxInFocus(null); // Clear box focus
    setFocusDirection(null);
  };

  const loadUserInputs = async () => {
    try {
      const savedInputs = await JSON.parse(
        await AsyncStorage.getItem("crosswordInputs")
      );
      if (savedInputs) {
        console.log(savedInputs);
        await setUserInputs(savedInputs);
      } else {
        const resetInputs = {};
        await Object.keys(userInputs).forEach((key) => {
          resetInputs[key] = " "; // Set each input to an empty string
        });
        await setUserInputs(resetInputs);
        await saveUserInputs(resetInputs);
      }
    } catch (error) {}
  };
  const renderClueDetail = () => {
    if (activeClue && CLUE_DATA && CLUE_DATA[activeClue]) {
      return (
        <View
          style={[
            styles.clueItem,
            styles.activeClue,
            { justifyContent: "center" },
          ]}
        >
          <Text
            style={[styles.clueItemText, { fontSize: 18.2, margin: 4 }]}
            // textAlign: 'center'
          >
            {CLUE_DATA[activeClue].clue}
          </Text>
        </View>
      );
    }
    return (
      <View
        style={[
          styles.clueItem,
          styles.activeClue,
          { justifyContent: "center" },
        ]}
      >
        <Text
          style={[
            styles.clueItemText,
            { fontSize: 18.2, color: "transparent", margin: 4 },
          ]}
        >
          {" |S"}
        </Text>
      </View>
    );
  };

  // Save user inputs to storage
  const saveUserInputs = async (input = userInputs) => {
    try {
      AsyncStorage.setItem("crosswordInputs", JSON.stringify(input)); // removed await
    } catch (error) {
      console.error("Failed to save user inputs:", error);
    }
  };
  const isEqual = (data1, data2) => {
    // This is a simplistic comparison function; adapt it to your needs
    if (!data1 || !data2) {
      return false;
    }

    return JSON.stringify(data1) === JSON.stringify(data2);
  };

  const fetchAndProcessCrossword = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCrossword();
      const oldData = JSON.parse(await AsyncStorage.getItem("crosswordData1"));

      if (!isEqual(oldData, data)) {
        // If the crossword data is different, reset the userInputs
        await AsyncStorage.removeItem("crosswordInputs");
        setUserInputs({});
      }

      await setCLUE_DATA(data); // Save the fetched data
      await AsyncStorage.setItem("crosswordData", JSON.stringify(data)); // Store the current crossword data for future comparisons
      const gridData = createGridData(data); // Process fetched data to create grid
      gridData.forEach((cell) => {
        cell.ref = React.createRef();
      });

      await setGRID_DATA(gridData); // Set the grid data
      await loadUserInputs(); // Load user inputs whether new or from storage

      const keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        resetFocusAndHighlight
      );
      setIsLoading(false);

      return () => {
        // Clean up the listener when the component unmounts
        keyboardDidHideListener.remove();
      };
    } catch (error) {
      setError(error.toString());
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndProcessCrossword();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAndProcessCrossword();
    setRefreshing(false);
  }, []);

  const handleClueSelectionFromBox = useCallback((boxId, clueKey) => {
    if (!CLUE_DATA[clueKey]) return;
    setActiveClueBoxes(CLUE_DATA[clueKey].boxes);
    setActiveClue(clueKey);
    setBoxInFocus(boxId);
    const firstBoxRef = GRID_DATA.find((cell) => cell.id === boxId).ref;
    firstBoxRef.current.focus();
  });
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
  const handleClueSelection = useCallback((clueKey) => {
    // make it scroll all the way to the top
    scrollViewRef.current.scrollTo({ y: 0, animated: true }); // Scroll to the top of the ScrollView

    setActiveClueBoxes(CLUE_DATA[clueKey].boxes);
    setActiveClue(clueKey);
    setBoxInFocus(CLUE_DATA[clueKey].boxes[0]);
    setFocusDirection(CLUE_DATA[clueKey].direction); // Update focus direction when clue is selected
    const firstBoxRef = GRID_DATA.find(
      (cell) => cell.id === CLUE_DATA[clueKey].boxes[0]
    ).ref;
    firstBoxRef.current.focus();
  });
  const debouncedSaveUserInputs = useCallback(debounce((inputs) => {
    AsyncStorage.setItem("crosswordInputs", JSON.stringify(inputs))
      .then(() => console.log("Inputs saved successfully!"))
      .catch(error => console.error("Failed to save user inputs:", error));
  }, 2000), []);
  
  const handleInputChange = useCallback((id, text) => {
    // Ensure the input text is handled as a non-null string and converted to upper case
    const currentInput = (text || "").toUpperCase();
    const previousInput = (userInputs[id] || " ").toUpperCase();
  
    // Determine the operation: insertion or deletion
    const operationType = currentInput.length > previousInput.length ? 'insert' : 'delete';
    newText = currentInput[currentInput.length - 1] || " "; // Just get the new character, ensure it is uppercase

    // Update the userInputs state
    setUserInputs((prevInputs) => {
      const updatedInputs = { ...prevInputs, [id]:newText };
      debouncedSaveUserInputs(updatedInputs);
      return updatedInputs;
    });
  
    // Find the current index in the active clue boxes
    const currentIndex = activeClueBoxes.indexOf(id);
    let nextIndex = currentIndex;
    
    if (operationType === 'insert' && currentInput.length > previousInput.length) {
      nextIndex = currentIndex + 1;
    } else if (operationType === 'delete' && currentInput.length < previousInput.length) {
      nextIndex = currentIndex - 1;
    }
  
    // Focus the next appropriate box if within valid range
    if (nextIndex >= 0 && nextIndex < activeClueBoxes.length) {
      const nextBoxId = activeClueBoxes[nextIndex];
      const nextBoxRef = GRID_DATA.find((c) => c.id === nextBoxId).ref;
      nextBoxRef.current.focus();
    }
  }, [activeClueBoxes, GRID_DATA, userInputs, debouncedSaveUserInputs]);
  
  
  /*
  useEffect(() => {
    // Cleanup function to cancel the debounced call if the component unmounts
    return () => {
      debouncedSaveUserInputs.cancel();
    };
  }, [debouncedSaveUserInputs]);
  */
  const revealAnswers = () => {
    Alert.alert(
      "Reveal All Answers", // Title of the alert
      "Are you sure you want to reveal all answers? This action cannot be undone.", // Message shown to the user
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Reveal",
          onPress: () => {
            const newInputs = { ...userInputs };
            GRID_DATA.forEach((cell) => {
              if (cell.letter) {
                newInputs[cell.id] = cell.letter.toUpperCase();
              }
            });
            setUserInputs(newInputs); // Update state to show all answers
            saveUserInputs(newInputs);
            setCorrectness({}); // Optionally clear correctness state if you don't want to validate after revealing answers
          },
        },
      ],
      { cancelable: false } // This means the user must tap one of the buttons to dismiss the alert
    );
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
              style={[styles.clueItem, false && styles.activeClue]}
            >
              <Text style={styles.clueItemNumber }>{clue.number}.{clue.number <= 9 && " "}</Text>
              <Text style={styles.clueItemText}>{clue.clue}</Text>
            </TouchableOpacity>
          ))}
      </View>
    );
  };










  
  const renderGrid = () => {
    return GRID_DATA.map((cell, index) => {
      const isLastRow = Math.floor(index / numberOfCellsPerRow) === numberOfCellsPerRow - 1;
      const isLastColumn = (index % numberOfCellsPerRow) === numberOfCellsPerRow - 1;
      return (
        <View
          key={index}
          style={[
            styles.box,
            !cell.letter && styles.blank,
            activeClueBoxes.includes(cell.id) && styles.highlight,
            boxInFocus === cell.id && styles.focus,
            isLastRow && styles.lastRowBox,
            isLastColumn && styles.lastColumnBox,
          ]}
        >
        {cell.label && <Text style={styles.boxLabel}>{cell.label}</Text>}
        <Text style={styles.boxLetter}>{userInputs[cell.id] || " "}</Text>

        {!!cell.letter && (
          <TextInput
            selectTextOnFocus={true} // Automatically select all text on focus, making it easy to replace
            ref={cell.ref}
            caretHidden={true}
            style={[styles.boxInput, { textTransform: "uppercase" }]} // Set selection color to transparent
            maxLength={2}
            selection={cursorPositions[cell.id]} // Keep cursor to the right
            autoCorrect={false} // Disable auto-correction
            keyboardType="ascii-capable" // Restricts input to ASCII characters
            autoCapitalize={"characters"}
            selectionColor="transparent" // Set selection color to transparent to hide it
            autoCompleteType="off"
            value={userInputs[cell.id] || " "} // Controlled component
            onChangeText={(text) => {
              handleInputChange(cell.id, text.toUpperCase());
              // Update the cell's letter in your state or context if you're managing the grid data dynamically (this is not shown here)
              // Move focus to the next box in activeClueBoxes
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
        <View styles>

          </View>
      </View>
      );
  });
  
  };
  


















  const checkAnswers = () => {
    let isCorrect = true;
    const newCorrectness = {};

    GRID_DATA.forEach((cell) => {
      const userInput = userInputs[cell.id] || " ";
      const correctAnswer = cell.letter || " ";
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
    Alert.alert(
      "Clear All Answers", // Title of the alert
      "Are you sure you want to clear all answers? This will remove all entered data.", // Message shown to the user
      [
        {
          text: "Cancel",
          onPress: () => console.log("Clear Cancelled"), // Optionally handle a cancel press
          style: "cancel",
        },
        {
          text: "Clear",
          onPress: () => {
            const resetInputs = {};
            Object.keys(userInputs).forEach((key) => {
              resetInputs[key] = " "; // Set each input to an empty string
            });
            setUserInputs(resetInputs);
            saveUserInputs(resetInputs); // Save the reset state
          },
        },
      ],
      { cancelable: false } // This ensures the user must tap one of the buttons to dismiss the alert
    );
  };

  if (isLoading && !refreshing) {
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
  if (error || !CLUE_DATA) {
    return (
      <SafeAreaView style={[{ flex: 1 }, { backgroundColor: "#fff" }]}>
        <Header title="Crossword" />
        <ScrollView
          // Style your ScrollView as needed
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Display the ErrorBox if there's an error */}
          {error && <ErrorBox errorMessage={error} />}
        </ScrollView>
      </SafeAreaView>
    );
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
    >
      <ScrollView ref={scrollViewRef}>
        <Header title="Crossword" />

        <View style={styles.container}>
          <View style={{ height: theme.spacing.medium }}></View>

          <View style={styles.grid}>{renderGrid()}</View>
          <View style={{ height: theme.spacing.medium }}></View>

          {renderClueDetail()}
          <View style={{ height: 0, marginBottom: -9 }}></View>
          {true && ( // Show these only when keyboard is down
            <>
              <View style={styles.cluesContainer}>
                <Text style={styles.clueHeader}>Across</Text>
                {renderClues("across")}
                <Text style={styles.clueHeader}>Down</Text>
                {renderClues("down")}
              </View>
              <View style={{ height: theme.spacing.medium }}></View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={revealAnswers}
                  style={[styles.button, styles.revealButton]}
                >
                  <Text style={styles.revealButtonText}>Reveal</Text>
                </TouchableOpacity>
                {/*<TouchableOpacity
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
                </TouchableOpacity>*/}
              </View>
              <View style={{ height: theme.spacing.medium }}></View>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const padding1 = theme.spacing.medium;
const { width } = Dimensions.get("window");
const boxSize = (width - padding1 * 2 - 4.001 ) / numberOfCellsPerRow; // 40 is the total horizontal padding
const SPACING = 12; // Consistent spacing for layout coherence
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: padding1,
    paddingBottom: 0,
    paddingTop: 0,
    backgroundColor: "#fff",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#000",
    backgroundColor: "#fff",
  },
  box: {
    width: boxSize,
    height: boxSize,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8E8E8", // Slightly lighter gray for a softer look
  },
  lastRowBox: {
    borderBottomWidth: 0, // No border at the bottom for the last row
  },
  lastColumnBox: {
    borderRightWidth: 0, // No border on the right for the last column
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "50%",
    alignSelf: "center",
    alignSelf: "center",

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
    position: 'absolute',

    width: "100%",
    height: "100%",
    textAlign: "center",
    color: "transparent",
    backgroundColor: "transparent", // Ensure input background doesn't distract
  },
  boxLetter: {

    top: 2.2,
    textAlign: "center",
    fontSize: 15.8,
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
    top: -0.3,
    left: 1,
    fontSize: 6.5,
    color: "#333",
    fontWeight: "bold",
  },
  clueListContainer: {
    marginTop: 1,
  },
  clueItem: {
    flexDirection: "row",

    alignItems: "flex-start", // Ensure the numbers align with the first line of the clue text
    paddingVertical: 3.8,
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
    fontSize: 15.5,
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
