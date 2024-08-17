import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Notifications from 'expo-notifications';
import HabitInstruction from '../Documentation/HabitInstruction';
import { prehabits } from '../../data/habits';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

const PrehabitsScreen = ({ navigation }) => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState(null);

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

  const openReminderPicker = (habitId) => {
    setSelectedHabitId(habitId);
    setShowReminderPicker(true);
  };

  const closeReminderPicker = () => {
    setShowReminderPicker(false);
  };

  const handleReminderTimeConfirm = (date) => {
    closeReminderPicker();
    if (date) {
      const habit = prehabits.find(habit => habit.id === selectedHabitId);
      const trigger = new Date(date);
      const reminder = {
        id: new Date().getTime().toString(),
        habitId: habit.id,
        reminderTime: trigger,
      };
  
      console.log('Scheduling reminder for habitId:', habit.id); // Log the habitId
  
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Habit Reminder',
          body: `Time to ${habit.name.toLowerCase()}`,
          data: { habitId: habit.id } // Pass habitId in notification data
        },
        trigger: {
          hour: trigger.getHours(),
          minute: trigger.getMinutes(),
          repeats: true,
        },
      }).then(() => {
        AsyncStorage.getItem(`reminders_${habit.id}`).then(storedReminders => {
          const reminders = storedReminders ? JSON.parse(storedReminders) : [];
          reminders.push(reminder);
          AsyncStorage.setItem(`reminders_${habit.id}`, JSON.stringify(reminders));
        });
      }).catch(error => {
        console.error('Error scheduling reminder:', error);
      });
    }
  };
  

  const renderCardItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() =>
        navigation.navigate('PreHabit Reminder', {
          habitId: item.id,
          habitName: item.name,
          habitDescription: item.description,
          habitPhotoUrl: item.photo_url,
        })
      }
    >
      <View style={styles.card}>
        <Image source={{ uri: item.photo_url }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.habitName}>{item.name}</Text>
          <Text style={styles.habitDescription}>{item.description}</Text>
        </View>
        <TouchableOpacity onPress={() => openReminderPicker(item.id)}>
          <FontAwesome name="bell" size={22} color="#4CAF50" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const closeModal = () => {
    setShowInstructions(false);
  };

  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={prehabits}
        renderItem={renderCardItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Create Habit')}>
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={showReminderPicker}
        onRequestClose={closeReminderPicker}
      >
        <DateTimePickerModal
          isVisible={showReminderPicker}
          mode="time"
          onConfirm={handleReminderTimeConfirm}
          onCancel={closeReminderPicker}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
    top: 30,
  },
  cardContainer: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 4,
  },
  card: {
    alignItems: 'center',
    padding: 12,
  },
  image: {
    width: 80,
    height: 80,
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
  bellIcon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
});

export default PrehabitsScreen;
