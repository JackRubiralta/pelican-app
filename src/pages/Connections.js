import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Animated,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  Dimensions,
} from "react-native";
import { theme } from "../theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ErrorBox from "../components/ErrorBox";
import Header from "../components/Header";
import { fetchConnections } from "../API";

const screenWidth = Dimensions.get("window").width;
const boxMargin = 10;
const gridSize = 4;
const padding = theme.spacing.medium - boxMargin;
const boxSize =
  (screenWidth - (padding + boxMargin) - boxMargin * gridSize) / gridSize;

const CONNECTIONS_COUNT = 4;
const MAX_MISTAKES = 5;

const Connections = () => {
  const [data, setData] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [solvedConnections, setSolvedConnections] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [mistakes, setMistakes] = useState(0);

  const positionRefs = useRef(new Map());

  // A utility function to compare data
  const isEqual = (data1, data2) => {
    return JSON.stringify(data1) === JSON.stringify(data2);
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);

    try {
      const fetchedData = await fetchConnections();
      const oldDataJSON = await AsyncStorage.getItem("connectionData");
      const oldData = oldDataJSON ? JSON.parse(oldDataJSON) : null;

      const savedStateJSON = await AsyncStorage.getItem("gameState");
      const savedState = savedStateJSON ? JSON.parse(savedStateJSON) : null;

      if (!isEqual(oldData, fetchedData)) {
        // If the data from the API has changed, reset the game state
        setData(fetchedData);
        setSolvedConnections({});
        setMistakes(0);
        await AsyncStorage.multiSet([
          ["connectionData", JSON.stringify(fetchedData)],
          [
            "gameState",
            JSON.stringify({
              data: fetchedData,
              solvedConnections: {},
              mistakes: 0,
            }),
          ],
        ]);
      } else if (savedState) {
        // If the data is the same, load the saved state
        setData(savedState.data);
        setSolvedConnections(savedState.solvedConnections);
        setMistakes(savedState.mistakes);
      } else {
        // No saved state, initialize with fetched data
        setData(fetchedData);
        setSolvedConnections({});
        setMistakes(0);
        await AsyncStorage.setItem(
          "gameState",
          JSON.stringify({
            data: fetchedData,
            solvedConnections: {},
            mistakes: 0,
          })
        );
      }
      setError(null);

    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
    
  }, []);

  useEffect(() => {
    setError(null);

    loadData();
  }, [loadData]);

  // Ensure that game state is saved whenever data, solvedConnections, or mistakes change
  useEffect(() => {
    if (!isLoading) {
      saveGameState().catch((error) =>
        console.error("Failed to save game state:", error)
      );
    }
  }, [data, solvedConnections, mistakes, isLoading]);

  // Assume saveGameState function is defined similarly to saveUserInputs
  const saveGameState = async () => {
    try {
      const gameState = JSON.stringify({ data, solvedConnections, mistakes });
      await AsyncStorage.setItem("gameState", gameState);
    } catch (error) {
      console.error("Failed to save game state:", error);
    }
  };
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    
    await loadData();
    setRefreshing(false);
  }, []);
  const shakeAnimation = (key) => {
    const position = positionRefs.current.get(key) || new Animated.ValueXY();
    positionRefs.current.set(key, position);
    Animated.sequence([
      Animated.timing(position, {
        toValue: { x: -theme.spacing.medium / 2, y: 0 },
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(position, {
        toValue: { x: theme.spacing.medium / 2, y: 0 },
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(position, {
        toValue: { x: 0, y: 0 },
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const mergeAnimation = (key, callback) => {
    const position = positionRefs.current.get(key) || new Animated.ValueXY();
    positionRefs.current.set(key, position);

    // Create an animation that moves the item up then down
    Animated.sequence([
      Animated.timing(position, {
        toValue: { x: 0, y: -50 }, // Move up
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(position, {
        toValue: { x: 0, y: 0 }, // Move back down
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback(); // Reset and update state after animation
      position.setValue({ x: 0, y: 0 }); // Reset position for next animation
    });
  };

  const selectItem = useCallback((item) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(item)) {
        return prevSelectedItems.filter((selected) => selected !== item);
      } else if (prevSelectedItems.length < CONNECTIONS_COUNT) {
        return [...prevSelectedItems, item];
      }
      return prevSelectedItems;
    });
  }, []);
  const animateAllItems = (callback) => {
    // Preparing two sets of animations for all items, one for moving up and one for moving down
    const moveUpAnimations = [];
    const moveDownAnimations = [];

    Object.keys(data).forEach((key) => {
      const items = data[key];
      items.forEach((item) => {
        const position =
          positionRefs.current.get(item) || new Animated.ValueXY();
        positionRefs.current.set(item, position);

        // Push the move up animation for each item
        moveUpAnimations.push(
          Animated.timing(position, {
            toValue: { x: 0, y: -theme.spacing.large },
            duration: 200,
            useNativeDriver: true,
          })
        );

        // Prepare the move down animation for each item
        moveDownAnimations.push(
          Animated.timing(position, {
            toValue: { x: 0, y: 0 },
            duration: 200,
            useNativeDriver: true,
          })
        );
      });
    });

    // First run all move up animations in parallel, then all move down animations in parallel
    Animated.sequence([
      Animated.parallel(moveUpAnimations),
      Animated.parallel(moveDownAnimations),
    ]).start(() => {
      callback(); // This callback is executed once all animations have completed
    });
  };
  const revealAllAnswers = useCallback(() => {
    animateAllItems(() => {
      const newSolvedConnections = { ...solvedConnections };

      // Loop through all connections in data
      Object.keys(data).forEach((key) => {
        // Only add to solved connections if not already solved
        if (!newSolvedConnections[key]) {
          newSolvedConnections[key] = data[key];
        }
      });

      // Update state to show all answers
      setSolvedConnections(newSolvedConnections);
      setSelectedItems([]); // Clear any selected items
    });
  }, [data, solvedConnections]);

  const checkConnection = useCallback(() => {
    if (selectedItems.length !== CONNECTIONS_COUNT) {
      selectedItems.forEach((item) => shakeAnimation(item));
      setMistakes((prevMistakes) => {
        const newMistakes = prevMistakes + 1;
        if (newMistakes >= MAX_MISTAKES) {
          setTimeout(() => {
            // Set a timeout to delay the reveal
            revealAllAnswers();
          }, 1000); // Wait for 1 second before revealing all answers
        }
        return newMistakes;
      });
      return;
    }

    const foundConnectionKey = Object.keys(data).find((key) => {
      const connection = data[key];
      const sortedConnection = [...connection].sort();
      const sortedSelectedItems = [...selectedItems].sort();
      return sortedConnection.every(
        (item, index) => item === sortedSelectedItems[index]
      );
    });

    if (foundConnectionKey) {
      animateAllItems(() => {
        setSolvedConnections((prevSolved) => ({
          ...prevSolved,
          [foundConnectionKey]: data[foundConnectionKey],
        }));
        setSelectedItems([]);
      });
    } else {
      selectedItems.forEach((item) => shakeAnimation(item));
      setMistakes((prevMistakes) => {
        const newMistakes = prevMistakes + 1;
        if (newMistakes >= MAX_MISTAKES) {
          setTimeout(() => {
            // Set a timeout to delay the reveal
            revealAllAnswers();
          }, 1000); // Wait for 1 second before revealing all answers
        }
        return newMistakes;
      });
    }
  }, [selectedItems, data, revealAllAnswers]);

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={[styles.centered, styles.container]}>
        <Header title="Connections" />
        <ScrollView refreshControl={<RefreshControl refreshing={true} />} />
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Connections" />
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {error && <ErrorBox errorMessage={error} />}
        </ScrollView>
      </SafeAreaView>
    );
  }

  const unsolvedItems = Object.keys(data)
    .filter((key) => !(key in solvedConnections))
    .reduce((acc, key) => [...acc, ...data[key]], [])
    .sort(() => 1);
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Connections" />
      <ScrollView
        style={{ padding: padding }}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={{ height: boxMargin / 2 }}></View>
        {Object.keys(solvedConnections).map((key) => (
          <Animated.View
            key={key}
            style={[styles.itemBoxContainer, styles.solvedConnectionContainer]}
          >
            <Text style={styles.solvedConnectionTitle}>
              {key.toUpperCase()}
            </Text>
            <Text style={styles.itemText}>
              {solvedConnections[key].join(", ").toUpperCase()}
            </Text>
          </Animated.View>
        ))}
        <View style={styles.grid}>
          {unsolvedItems.map((item, index) => {
            const itemPosition =
              positionRefs.current.get(item) || new Animated.ValueXY();
            positionRefs.current.set(item, itemPosition); // Ensure each item has a position ref
            return (
              <Animated.View
                key={item} // Ensure each item has a unique key at the first element of the list
                style={{ transform: itemPosition.getTranslateTransform() }}
              >
                <TouchableOpacity
                  style={[
                    styles.item,
                    styles.itemBoxContainer,
                    selectedItems.includes(item) && styles.selectedItem,
                  ]}
                  onPress={() => selectItem(item)}
                >
                  <Text
                    style={styles.itemText}
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
        <Text style={styles.mistakesRemaining}>
          {mistakes < MAX_MISTAKES
            ? `Mistakes remaining: ${"●".repeat(MAX_MISTAKES - mistakes)}`
            : "Next time!"}
        </Text>
        <View style={styles.footer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                selectedItems.length !== CONNECTIONS_COUNT ||
                mistakes >= MAX_MISTAKES
                  ? styles.buttonDisabled
                  : styles.checkButton,
              ]}
              onPress={checkConnection}
              disabled={
                selectedItems.length !== CONNECTIONS_COUNT ||
                mistakes >= MAX_MISTAKES
              }
            >
              <Text style={styles.checkButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mistakesContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    fontSize: 30,
  },
  mistakesText: {
    marginTop: 5,
    textAlign: "center",
    color: "#424242",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  container: {
    flex: 1,
    backgroundColor: "#ffff", // Light grey background for subtle texture
  },
  scrollViewContent: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 0,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "35%",
    alignSelf: "center",
    alignSelf: "center",
  },
  button: {
    flex: 1,
  },
  mistakesRemaining: {
    fontSize: 17.4,
    marginTop: 5,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
  },

  itemBoxContainer: {
    borderRadius: 3, // Rounded corners
    //borderWidth: 3,
    backgroundColor: "#E0E0E0", // A lighter shade for solved connections
    borderColor: "#E0E0E0", // Softer border color
  },

  solvedConnectionContainer: {
    height: boxSize,
    margin: boxMargin / 2,

    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    width: boxSize * 4 + boxMargin * (gridSize - 1),
    backgroundColor: "#A5D6A7", // Change to a green color to indicate selection
  },
  solvedConnectionTitle: {
    fontSize: 22,
    position: "relative",
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#424242",
  },
  checkButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  solvedConnectionItems: {
    fontSize: 16, // Match fontSize with itemText
    fontWeight: "bold", // Match fontWeight with itemText
    color: "#424242", // Match color with itemText
  },
  checkButton: {
    backgroundColor: "#4169E1",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: "#BDBDBD", // Grey color when disabled
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  footer: {
    marginTop: 2,
    justifyContent: "center",
    width: "100%",
  },
  instructions: {
    textAlign: "center",
    fontSize: 24,
    color: "#424242",
    fontWeight: "bold",
    marginBottom: theme.spacing.medium,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  item: {
    width: boxSize,
    height: boxSize,
    margin: boxMargin / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedItem: {
    backgroundColor: "#a5b5d6", // Change to a green color to indicate selection
  },
  itemText: {
    fontSize: 17,
    marginHorizontal: 4,
    fontWeight: "500",
    textTransform: "uppercase",
    textAlign: "center",

    color: "#424242",
    position: "relative",
  },
  // ... Add other styles that might be needed ...
});

export default Connections;
