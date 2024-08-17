import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal, } from 'react-native';
import HabitInstruction from '../Documentation/HabitInstruction'; // Import InstructionDoc component
import { prehabits } from '../../data/habits';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PrehabitsScreen = ({ navigation }) => {
  const [showInstructions, setShowInstructions] = useState(false);

  const checkInstructionsSeen = useCallback(async () => {
    try {
      const instructionsSeen = await AsyncStorage.getItem('instructionsSeenHabit');
      if (!instructionsSeen) {
        setShowInstructions(true);
        await AsyncStorage.setItem('instructionsSeenHabit', 'true');
      }
    } catch (error) {
      console.error('Error checking instructions seen:', error);
    }
  }, []);

  useEffect(() => {
    checkInstructionsSeen();
  }, [checkInstructionsSeen]);

  const renderCardItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.cardContainer}
      onPress={() => navigation.navigate('Habit Reminder', 
      {
          categoryName: item.name,
          categoryDescription: item.description
      })}
    >
      <View style={styles.card}>
        <Image source={{ uri: item.photo_url }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.habitName}>{item.name}</Text>
          <Text style={styles.habitDescription}>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const closeModal = () => {
    setShowInstructions(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={prehabits}
        renderItem={renderCardItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}  onPress={() => navigation.navigate('Create Habit')}>
          <Text style={styles.buttonText}>Create Habit</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showInstructions}
        onRequestClose={() => setShowInstructions(false)}
      >
        <HabitInstruction closeModal={closeModal} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
    top: 30
  },
  cardContainer: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 4,
  },
  card: {
    //flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  image: {
    width: 80,
    height: 80,
    //borderRadius: 40,
    marginBottom: 10,
    marginTop: 10,
  },
  infoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  habitName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  habitDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: "33%",
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PrehabitsScreen;
