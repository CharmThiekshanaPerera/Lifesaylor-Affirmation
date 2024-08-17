// Update MoodTracker.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MoodInstruction from '../Documentation/MoodInstruction'; // Import InstructionDoc component

const MoodTracker = ({ navigation }) => {

  const [moods] = useState([
    { name: 'Happy', emoji: '😊' },
    { name: 'Sad', emoji: '😢' },
    { name: 'Angry', emoji: '😠' },
    { name: 'Excited', emoji: '😃' },
    { name: 'Calm', emoji: '😌' },
    { name: 'Surprised', emoji: '😲' },
    { name: 'Grateful', emoji: '🙏' },
    { name: 'Tired', emoji: '😴' },
    { name: 'Stressed', emoji: '😖' },
    { name: 'Confused', emoji: '😕' },
  ]);

  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const checkInstructionsSeen = async () => {
      try {
        const instructionsSeenMood = await AsyncStorage.getItem('instructionsSeenMood');
        if (!instructionsSeenMood) {
          setShowInstructions(true);
          await AsyncStorage.setItem('instructionsSeenMood', 'true');
        }
      } catch (error) {
        console.error('Error checking instructions seen:', error);
      }
    };

    checkInstructionsSeen();
  }, []);

  // Define feelings array
  const [feelings] = useState([
    'Great', 'Good', 'Okay', 'Fine', 'Neutral', 'Not so good', 'Bad', 'Terrible', 'Mixed', 'Other',
    'Happy', 'Sad', 'Excited', 'Anxious', 'Hopeful', 'Stressed', 'Relaxed', 'Confused', 'Content', 'Grateful'
  ]);

  const saveMood = async (moodName) => {
    try {
      const today = new Date();
      const moodData = { moodName, dateTime: today.toString() };
      await AsyncStorage.setItem('mood', JSON.stringify(moodData));
      const filteredFeelings = feelings.filter(feeling =>
        (moodName === 'Happy' && ['Great', 'Good', 'Excited', 'Hopeful', 'Content', 'Grateful'].includes(feeling)) ||
        (moodName === 'Sad' && ['Sad', 'Not so good', 'Bad', 'Terrible', 'Neutral'].includes(feeling)) ||
        (moodName === 'Angry' && ['Anxious', 'Stressed'].includes(feeling)) ||
        (moodName === 'Excited' && ['Happy', 'Excited', 'Hopeful'].includes(feeling)) ||
        (moodName === 'Calm' && ['Relaxed', 'Neutral', 'Content'].includes(feeling)) ||
        (moodName === 'Surprised' && ['Great', 'Good', 'Okay', 'Fine', 'Neutral', 'Mixed', 'Other'].includes(feeling)) ||
        (moodName === 'Grateful' && ['Happy', 'Content', 'Grateful'].includes(feeling)) ||
        (moodName === 'Tired' && ['Tired', 'Not so good', 'Bad', 'Terrible'].includes(feeling)) ||
        (moodName === 'Stressed' && ['Anxious', 'Stressed'].includes(feeling)) ||
        (moodName === 'Confused' && ['Confused', 'Mixed', 'Other'].includes(feeling))
      );
      navigation.navigate('FeelTracker', { filteredFeelings });
    } catch (error) {
      console.log('Error saving mood:', error);
    }
  };

  
  const closeModal = () => {
    setShowInstructions(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        {moods.map((mood, index) => (
          <TouchableOpacity
            key={index}
            style={styles.moodCard}
            onPress={() => saveMood(mood.name)}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text style={styles.moodName}>{mood.name}</Text>
          </TouchableOpacity>
        ))}

        <Modal
        animationType="slide"
        transparent={true}
        visible={showInstructions}
        onRequestClose={() => setShowInstructions(false)}
      >
        <MoodInstruction closeModal={closeModal} />
      </Modal>
      </View>
      
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#f0f0f0',
    marginTop:40
  },
  moodCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 8,
    width: '45%',
    height: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  emoji: {
    fontSize: 30,
    marginBottom: 8,
  },
  moodName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MoodTracker;
