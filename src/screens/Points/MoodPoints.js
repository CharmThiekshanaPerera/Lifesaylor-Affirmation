// MoodPoints.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MoodPoints = () => {
  const [moodPoints, setMoodPoints] = useState(0);

  useEffect(() => {
    getMoodPoints();
  }, []);

  const getMoodPoints = async () => {
    try {
      const points = await AsyncStorage.getItem('moodPoints');
      setMoodPoints(points ? parseInt(points) : 0);
    } catch (error) {
      console.error('Error getting mood points:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mood Points</Text>
      <Text style={styles.points}>{moodPoints}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
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

export default MoodPoints;
