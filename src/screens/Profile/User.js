import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');

  const handleSaveUserName = async () => {
    try {
      // Save the user name to AsyncStorage
      await AsyncStorage.setItem('userName', userName);

      // Navigate to the Home page
      navigation.navigate('PageOne');
    } catch (error) {
      console.error('Error saving user name:', error);
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/background/c.jpeg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>How do we call you?</Text>
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          onChangeText={text => setUserName(text)}
          value={userName}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveUserName}>
          <Text style={styles.buttonText}>Save and Continue</Text>
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
    fontWeight: 'bold',
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
    width: '80%',
    paddingVertical: 10,
    paddingHorizontal: 75,
    borderRadius: 30,
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
