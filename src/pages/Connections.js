import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  Alert,
  Dimensions,
} from "react-native";
import { theme } from "../theme";
// Other imports remain unchanged...



import ErrorBox from "../components/ErrorBox";
import Header from "../components/Header";
import { fetchConnections } from "../API";
const padding = 20;

const CONNECTIONS_COUNT = 4;


const Connections = () => {
  const [data, setData] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [solvedConnections, setSolvedConnections] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedData = await fetchConnections();
      setData(fetchedData);
    } catch (e) {
      setError(e.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

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

  const checkConnection = useCallback(() => {
    if (selectedItems.length !== CONNECTIONS_COUNT) {
      Alert.alert(
        "Error",
        "You must select exactly 4 items to make a connection."
      );
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
      setSolvedConnections((prevSolved) => ({
        ...prevSolved,
        [foundConnectionKey]: data[foundConnectionKey],
      }));
      Alert.alert("Success", "A connection has been found!");
      setSelectedItems([]);
    } else {
      Alert.alert("Try Again", "No valid connection with the selected items.");
    }
  }, [selectedItems, data]);

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.instructions}>Create four groups of four!</Text>
        {Object.keys(solvedConnections).map((key) => (
          <View key={key} style={styles.solvedConnectionContainer}>
            <Text style={styles.solvedConnectionTitle}>
              {key.toUpperCase()}
            </Text>
            <Text style={styles.solvedConnectionItems}>
              {solvedConnections[key].join(", ").toUpperCase()}
            </Text>
          </View>
        ))}
        <View style={styles.grid}>
          {unsolvedItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.item,
                selectedItems.includes(item) && styles.selectedItem,
              ]}
              onPress={() => selectItem(item)}
            >
              <Text style={styles.itemText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              selectedItems.length !== CONNECTIONS_COUNT
                ? styles.buttonDisabled
                : styles.checkButton,
            ]}
            onPress={checkConnection}
            disabled={selectedItems.length !== CONNECTIONS_COUNT}
          >
            <Text style={styles.checkButtonText}>Submit</Text>
          
          </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


const boxMargin = 10; // Margin for each box
const gridSize = 4; // Number of items in each row and column
const screenWidth = Dimensions.get('window').width; // Get the screen width
const boxSize = (screenWidth - padding * 2 - boxMargin * (gridSize)) / gridSize; // Calculate the size for each box


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Light grey background for subtle texture
  },
  scrollViewContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "50%",
    alignSelf: "center",
    alignSelf: "center",

  },
  solvedConnectionContainer: {
    height: boxSize,
    margin: boxMargin / 2,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: boxSize * 4 + boxMargin * (gridSize - 1),
    backgroundColor: '#E8F5E9', // A lighter shade for solved connections
    borderWidth: 1,
    borderColor: '#E0E0E0', // Softer border color
    borderRadius: 8, // Rounded corners
    

  },
  checkButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  solvedConnectionItems: {
    // ... other styles remain unchanged ...
    fontSize: 16, // Match fontSize with itemText
    fontWeight: 'bold', // Match fontWeight with itemText
    color: '#424242', // Match color with itemText
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
  buttonDisabled: {
    backgroundColor: "#BDBDBD", // Grey color when disabled
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  footer: {
    marginTop: 20,
    marginBottom: 20,
    justifyContent: "center",
    width: "100%",
  },
  instructions: {
    textAlign: "center",
    fontSize: 18,
    color: "#424242",
    fontWeight: "bold",
    marginVertical: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  item: {
    width: boxSize,
    height: boxSize,
    margin: boxMargin / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8, // Rounded corners for items
      // ... other styles remain unchanged ...
      backgroundColor: '#E0E0E0', // Light grey background color
      borderRadius: 10, // Rounded corners
      elevation: 1, // Subtle shadow on Android
      // For iOS, use shadow properties:
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    
  
  },
  selectedItem: {
    backgroundColor: '#A5D6A7', // Change to a green color to indicate selection
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    color: '#424242',
  },
  // ... Add other styles that might be needed ...
});

export default Connections;