// MoodNotesTable.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const MoodNotesTable = () => {
  const [moodNotes, setMoodNotes] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMoodNotes = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const moodNotesData = await AsyncStorage.multiGet(keys.filter(key => key.startsWith('moodNote_')));
        const formattedMoodNotes = moodNotesData.map(([key, value]) => {
          const timestamp = key.replace('moodNote_', '');
          return { timestamp: parseInt(timestamp), data: JSON.parse(value) };
        });
        setMoodNotes(formattedMoodNotes);
      } catch (error) {
        console.error('Error fetching mood notes:', error);
      }
    };
    fetchMoodNotes();
  }, []);

  const handleViewCharts = () => {
    navigation.navigate('Mood Chart');
  };

  const renderMoodNoteItem = ({ item }) => {
    const { timestamp, data } = item;
    const { moodData, feeling, selectedTags, note } = data;

    return (
      <View style={styles.moodNoteContainer}>
        <Text style={styles.timestamp}>{new Date(timestamp).toLocaleString()}</Text>
        <Text style={styles.moodData}>Mood Name: {moodData.moodName}</Text>
        <Text style={styles.feeling}>Feeling: {feeling}</Text>
        <Text style={styles.note}>Note: {note}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mood Notes Table</Text>
        <TouchableOpacity onPress={handleViewCharts}>
          <Ionicons name="bar-chart-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {moodNotes.length > 0 ? (
        <FlatList
          data={moodNotes}
          renderItem={renderMoodNoteItem}
          keyExtractor={item => item.timestamp.toString()}
          style={styles.flatList}
        />
      ) : (
        <Text style={styles.noDataText}>No mood notes available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  flatList: {
    flex: 1,
    width: '100%',
  },
  moodNoteContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timestamp: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  moodData: {
    fontSize: 16,
    color: '#333',
  },
  feeling: {
    fontSize: 16,
    color: '#333',
  },
  note: {
    fontSize: 16,
    color: '#333',
  },
  noDataText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MoodNotesTable;
