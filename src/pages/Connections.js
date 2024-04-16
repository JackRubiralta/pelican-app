import React, { useState, useEffect, useCallback } from 'react';
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
} from 'react-native';
import ErrorBox from '../components/ErrorBox';
import Header from '../components/Header';
import { fetchConnections } from '../API';

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
        Alert.alert('Error', 'You must select exactly 4 items to make a connection.');
        return;
      }
  
      const foundConnectionKey = Object.keys(data).find((key) => {
        const connection = data[key];
        const sortedConnection = [...connection].sort();
        const sortedSelectedItems = [...selectedItems].sort();
        return sortedConnection.every((item, index) => item === sortedSelectedItems[index]);
      });
  
      if (foundConnectionKey) {
        setSolvedConnections((prevSolved) => ({
          ...prevSolved,
          [foundConnectionKey]: data[foundConnectionKey],
        }));
        Alert.alert('Success', 'A connection has been found!');
        setSelectedItems([]);
      } else {
        Alert.alert('Try Again', 'No valid connection with the selected items.');
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
          <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
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
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <Text style={styles.instructions}>Create four groups of four!</Text>
          {Object.keys(solvedConnections).map((key) => (
            <View key={key} style={styles.solvedConnectionContainer}>
              <Text style={styles.solvedConnectionTitle}>{key.toUpperCase()}</Text>
              <Text style={styles.solvedConnectionItems}>{solvedConnections[key].join(", ").toUpperCase()}</Text>
            </View>
          ))}
          <View style={styles.grid}>
            {unsolvedItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.item, selectedItems.includes(item) && styles.selectedItem]}
                onPress={() => selectItem(item)}
              >
                <Text style={styles.itemText}>{item}</Text></TouchableOpacity>
          ))}
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.button,
              selectedItems.length !== CONNECTIONS_COUNT ? styles.buttonDisabled : styles.checkButton,
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

const { width } = Dimensions.get('window');
const padding = 20;
const marginPerSide = 3;
const borderWidth = 1;
const itemPaddingHorizontal = 10;
const numberOfCellsPerRow = 4;
const totalMargin = marginPerSide * 2 * numberOfCellsPerRow;
const totalBorderWidth = borderWidth * 2 * numberOfCellsPerRow;
const availableWidth = width - (padding * 2) - totalMargin - totalBorderWidth - 2;
const boxSize = availableWidth / numberOfCellsPerRow;
const boxHeight = 60; // Increased height for better visibility and consistency

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: padding,
  },
  scrollViewContent: {
    justifyContent: 'flex-start',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: 5,
    marginBottom: 10,
  },
  item: {
    width: boxSize,
    height: boxHeight, // Updated height
    margin: marginPerSide,
    paddingVertical: 15, // Adjusted padding
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: borderWidth,
    borderColor: '#000',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    elevation: 2,
  },
  selectedItem: {
    backgroundColor: '#ccc',
  },
  solvedConnectionContainer: {
    width: availableWidth + 15 ,
    height: boxHeight, // Consistent with item height
    flexDirection: 'column',
    alignSelf: 'center',
    justifyContent: 'center', // Adjusted for vertical alignment
    alignItems: 'center',
    marginVertical: 3,
    paddingHorizontal: 10,
    borderWidth: borderWidth,
    borderColor: '#000',
    backgroundColor: '#e8eaf6',
    borderRadius: 10,
    elevation: 2,
  },
  solvedConnectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#3f51b5',
  },
  solvedConnectionItems: {
    fontSize: 16,
    color: '#6a1b9a',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    marginHorizontal: 75,
    borderRadius: 10,
  },
  checkButton: {
    backgroundColor: '#4caf50',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  footer: {
    marginTop: 10,
  },
  instructions: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
  },
});

export default Connections;
  