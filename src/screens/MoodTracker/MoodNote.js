// MoodNote.js

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const MoodNote = () => {
  const [moodData, setMoodData] = useState(null);
  const [feeling, setFeeling] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [note, setNote] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchMoodData() {
      const savedMoodData = await AsyncStorage.getItem('mood');
      const savedFeeling = await AsyncStorage.getItem('feeling');
      const savedTags = await AsyncStorage.getItem('tags');
      setMoodData(savedMoodData ? JSON.parse(savedMoodData) : null);
      setFeeling(savedFeeling);
      setSelectedTags(savedTags ? JSON.parse(savedTags) : []);
    }
    fetchMoodData();
  }, []);

  const givePoints = async () => {
    try {
      let points = await AsyncStorage.getItem('moodPoints');
      points = points ? parseInt(points) : 0;
      points += 1; // Increment points by 1 for each mood note saved
      await AsyncStorage.setItem('moodPoints', points.toString());
    } catch (error) {
      console.error('Error giving points:', error);
    }
  };

  const handleAddNote = async () => {
    // Save each record separately with a timestamp in AsyncStorage
    const timestamp = Date.now().toString();
    const data = {
      moodData,
      feeling,
      selectedTags,
      note,
    };
    await AsyncStorage.setItem(`moodNote_${timestamp}`, JSON.stringify(data));
    await givePoints(); // Call givePoints function to give points to user
    // Navigate to MyMood page after saving the data
    navigation.navigate('MyMood');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood Data:</Text>
      {moodData && (
        <View style={styles.card}>
          <Text style={styles.cardText}>Mood Name: {moodData.moodName}</Text>
          {/* <Text style={styles.cardText}>Date & Time: {moodData.dateTime}</Text> */}
        </View>
      )}
      {feeling && (
        <View style={styles.card}>
          <Text style={styles.cardText}>Feeling: {feeling}</Text>
        </View>
      )}
      <View style={styles.tagsContainer}>
        <Text style={styles.tagsTitle}>Selected Tags:</Text>
        {selectedTags.map((tag, index) => (
          <Text key={index} style={styles.tag}>{tag}</Text>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Add a note"
        onChangeText={text => setNote(text)}
        value={note}
        multiline={true}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddNote}>
        <Text style={styles.buttonText}>Add Note</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    fontSize: 18,
    color: '#333',
  },
  tagsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  tagsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  tag: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    color: '#fff',
    textAlign: 'center', // Add this line to center-align the text
    fontSize: 17,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    width: '100%',
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    minHeight: 150,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 50,
    width: '50%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MoodNote;
