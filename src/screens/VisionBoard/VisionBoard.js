import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, StyleSheet, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VisionInstruction from '../Documentation/VisionInstruction'; // Import InstructionDoc component

const VisionBoardScreen = ({ navigation }) => {
  const [visionBoardName, setVisionBoardName] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  const checkInstructionsSeen = useCallback(async () => {
    try {
      const instructionsSeen = await AsyncStorage.getItem('instructionsSeenVision');
      if (!instructionsSeen) {
        setShowInstructions(true);
        await AsyncStorage.setItem('instructionsSeenVision', 'true');
      }
    } catch (error) {
      console.error('Error checking instructions seen:', error);
    }
  }, []);

  useEffect(() => {
    checkInstructionsSeen();
  }, [checkInstructionsSeen]);

  const [suggestions, setSuggestions] = useState([
    'Travel the World',
    'Start a Business',
    'Learn a New Skill',
    'Write a Book',
    'Get Fit and Healthy'
  ]);

  const handleSuggestionPress = (suggestion) => {
    setVisionBoardName(suggestion);
  };

  const closeModal = () => {
    setShowInstructions(false);
  };

  const handleContinue = async () => {
    // Save vision board name to AsyncStorage
    await AsyncStorage.setItem('visionBoardName', visionBoardName);
    // Navigate to VisionSectionScreen
    navigation.navigate('VisionSection');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Enter Your Vision Board Name</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Enter your vision board name"
        value={visionBoardName}
        onChangeText={setVisionBoardName}
      />
      <Text style={styles.pickText}>Pick the name below</Text>
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={showInstructions}
        onRequestClose={() => setShowInstructions(false)}
      >
        <VisionInstruction closeModal={closeModal} />
      </Modal>
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

export default VisionBoardScreen;
