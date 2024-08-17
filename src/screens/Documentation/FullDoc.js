import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HabitInstruction from '../Documentation/HabitInstruction';
import MoodInstruction from '../Documentation/MoodInstruction';
import JournalInstruction from '../Documentation/JournalInstruction';
import VisionInstruction from '../Documentation/VisionInstruction';

const DocumentationPage = () => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedInstruction, setSelectedInstruction] = useState(null);
  const colors = ['lightblue', 'lightgreen', 'lightpink', 'lightyellow'];
  const [colorIndex, setColorIndex] = useState(0);

  const openModal = (instruction) => {
    setSelectedInstruction(instruction);
    setShowInstructions(true);
  };

  const closeModal = () => {
    setShowInstructions(false);
  };

  const getNextColor = () => {
    setColorIndex((colorIndex + 1) % colors.length);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>Documentation</Text>
      <Text style={styles.mainDescription}>Explore the various instructions and guidance provided in our documentation.</Text>
      
      <View style={styles.row}>
        <TouchableOpacity onPress={() => { openModal('HabitInstruction'); getNextColor(); }} style={[styles.card, { backgroundColor: colors[colorIndex] }]}>
          <MaterialCommunityIcons name="format-list-bulleted" size={50} color="#4CAF50" />
          <Text style={styles.title}>Habit Guide</Text>
          <Text style={styles.description}>Instructions for developing habits and routines.</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { openModal('MoodInstruction'); getNextColor(); }} style={[styles.card, { backgroundColor: colors[(colorIndex + 1) % colors.length] }]}>
          <MaterialCommunityIcons name="emoticon-outline" size={50} color="#4CAF50" />
          <Text style={styles.title}>Mood Guide</Text>
          <Text style={styles.description}>Guidance on managing and understanding emotions.</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity onPress={() => { openModal('JournalInstruction'); getNextColor(); }} style={[styles.card, { backgroundColor: colors[(colorIndex + 2) % colors.length] }]}>
          <MaterialCommunityIcons name="book-outline" size={50} color="#4CAF50" />
          <Text style={styles.title}>Journal Guide</Text>
          <Text style={styles.description}>Tips on maintaining a journal for reflection and growth.</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { openModal('VisionInstruction'); getNextColor(); }} style={[styles.card, { backgroundColor: colors[(colorIndex + 3) % colors.length] }]}>
          <MaterialCommunityIcons name="eye-outline" size={50} color="#4CAF50" />
          <Text style={styles.title}>Vision Guide</Text>
          <Text style={styles.description}>Steps for creating and realizing personal vision and goals.</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showInstructions}
        onRequestClose={() => closeModal()}
      >
        {selectedInstruction === 'HabitInstruction' && <HabitInstruction closeModal={closeModal} />}
        {selectedInstruction === 'MoodInstruction' && <MoodInstruction closeModal={closeModal} />}
        {selectedInstruction === 'JournalInstruction' && <JournalInstruction closeModal={closeModal} />}
        {selectedInstruction === 'VisionInstruction' && <VisionInstruction closeModal={closeModal} />}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mainDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  card: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
    //marginVertical: 5,
    marginHorizontal:5,
    elevation: 3,
    alignItems: 'center',  
    //margin: 8
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    color: 'black',
    marginTop: 5,
    textAlign: 'center'
  },
});

export default DocumentationPage;
