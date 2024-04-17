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
      </ScrollView>
    </SafeAreaView>
  );
};

const borderWidth = 3;
const numberOfCellsPerRow = 4;
const boxHeight = 75; // Increased height for better visibility and consistency
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // Bright white background
  },
  scrollViewContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 10,
  },
  itemText: {
    textTransform: "uppercase",
    fontSize: 15,
  },
  item: {
    width: "23%", 
    height: boxHeight, 
    margin: 3,
    
    marginHorizontal: "1%",
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: borderWidth,
    borderColor: "#3A3A3C", // Consistent dark border for better contrast
    backgroundColor: "#EAEAEA", // Light grey for default state
    borderRadius: 10,
    elevation: 2,
  },
  selectedItem: {
    backgroundColor: "#AED581", // Light green for selected items
  },
  solvedConnectionContainer: {
    width: "98%",
    flex: 1,
    marginHorizontal: "1%",
    height: boxHeight,
    flexDirection: "column",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 3,
    paddingHorizontal: 10,
    borderWidth: borderWidth,
    borderColor: "#3A3A3C",
    backgroundColor: "#C5E1A5", // Soft green for solved connections
    borderRadius: 10,
    elevation: 2,
  },
  solvedConnectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#1B5E20", // Deep green for headers
    textTransform: "uppercase",
  },
  solvedConnectionItems: {
    fontSize: 16,
    color: "#33691E", // Dark green to match item text
    textAlign: "center",
    textTransform: "uppercase",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
  },
  button: {
    width: "50%",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#66BB6A",
  },
  checkButton: {
    backgroundColor: "#66BB6A",
  },
  buttonDisabled: {
    backgroundColor: "#BDBDBD",
  },
  footer: {
    marginTop: 10,
    marginBottom: 10,
    justifyContent: "center",
    width: "100%",
  },
  instructions: {
    textAlign: "center",
    fontSize: 16,
    color: "#424242", // Added color to make text more visible and consistent with overall design
    fontWeight: "bold", // Added bold to make instructions stand out
    marginVertical: 10, // Added vertical margin for better spacing
  },
});
export default Connections;
