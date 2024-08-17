import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VisionSectionScreen = ({ navigation }) => {
  const [visionBoardName, setVisionBoardName] = useState('');
  const [visionSectionName, setVisionSectionName] = useState('');
  const [suggestions, setSuggestions] = useState([
    'Health',
    'Travel',
    'Family',
    'Finance',
    'Career',
    'Personal Growth',
    'Hobbies',
    'Social Relationships'
  ]);

  useEffect(() => {
    // Fetch the saved vision board name from AsyncStorage
    const fetchVisionBoardName = async () => {
      const savedVisionBoardName = await AsyncStorage.getItem('visionBoardName');
      if (savedVisionBoardName) {
        setVisionBoardName(savedVisionBoardName);
      }
    };
    fetchVisionBoardName();
  }, []);

  const handleSuggestionPress = (suggestion) => {
    setVisionSectionName(suggestion);
  };

  const handleContinue = async () => {
    // Save vision section name to AsyncStorage
    await AsyncStorage.setItem('visionSection', visionSectionName);
    // Navigate to VisionImage.js page
    navigation.navigate('VisionImage');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Enter Your Vision Section</Text>
      </View>
      {/* <Text style={styles.pageDescription}>Enter the name for a section of your vision board:</Text> */}
      {/* <Text style={styles.visionBoardName}>Vision Board: {visionBoardName}</Text> */}
      <TextInput
        style={styles.input}
        placeholder="Enter your vision section name"
        value={visionSectionName}
        onChangeText={setVisionSectionName}
      />
      <Text style={styles.pickText}>Pick a suggestion below</Text>
      <FlatList
        data={suggestions}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSuggestionPress(item)}>
            <Text style={styles.suggestion}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 20,
    marginVertical:40
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4CAF50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff', // Added background color
  },
  pickText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  suggestion: {
    fontSize: 16,
    marginBottom: 10,
    color: '#007bff',
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default VisionSectionScreen;
