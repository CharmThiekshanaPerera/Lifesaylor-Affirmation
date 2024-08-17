//JournalPoints.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JournalPoints = () => {
  const [points, setPoints] = useState(0);

  useEffect(() => {
    // Fetch points from AsyncStorage when component mounts
    getPoints();
  }, []);

  // Function to fetch points from AsyncStorage
  const getPoints = async () => {
    try {
      const savedPoints = await AsyncStorage.getItem('journalPoints');
      if (savedPoints !== null) {
        setPoints(parseInt(savedPoints));
      }
    } catch (error) {
      console.error('Error fetching points:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Journal Points</Text>
      <Text style={styles.points}>{points}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      title: {
        fontSize: 24,
        marginBottom: 20,
        color: 'green',
        fontWeight: 'bold',
      },
      points: {
        fontSize: 28,
        color: 'black',
        color: 'green',
        fontWeight: 'bold',
      },
});

export default JournalPoints;
