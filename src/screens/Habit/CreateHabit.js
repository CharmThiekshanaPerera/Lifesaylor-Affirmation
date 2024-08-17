import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const [habitName, setHabitName] = useState('');

  const handleSaveUserName = async () => {
    try {
      // Generate a habitId (you can use any suitable method to generate this)
      const habitId = Math.random().toString(36).substr(2, 9); // Example of generating a random habitId

      // Save the habit name and habitId to AsyncStorage
      await AsyncStorage.setItem('habitId', habitId);
      await AsyncStorage.setItem('habitName', habitName);

      // Navigate to the Create Reminder page with habitId and habitName
      navigation.navigate('Create Reminder', { 
        categoryId: habitId, 
        categoryName: habitName, 
        categoryDescription: 'Habit' 
      });
    } catch (error) {
      console.error('Error saving habit details:', error);
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/background/c.jpeg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Create Habit Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Habit Name"
          onChangeText={text => setHabitName(text)}
          value={habitName}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveUserName}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    marginTop: 10,
    marginBottom: 20,
    color: '#4CAF50',
  },
  input: {
    width: '60%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 2,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 10,
    borderColor: '#4CAF50',
    backgroundColor: '#FFF', // Set a background color to make text input visible
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    //width: '80%',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 5,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProfileScreen;
