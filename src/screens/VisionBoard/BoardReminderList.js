import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const BoardReminderList = () => {
  const [reminders, setReminders] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const storedReminders = await AsyncStorage.getItem('reminderData');
      if (storedReminders !== null) {
        setReminders([JSON.parse(storedReminders)]);
      }
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  const handleNavigateVisionBoard = () => {
    navigation.navigate('VisionBoard');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageHeader}>Board Reminder List</Text>
      <ScrollView style={styles.reminderList}>
        {reminders.map((reminder, index) => (
          <View key={index} style={styles.reminderItem}>
            <Text style={styles.boardName}>{reminder.visionBoardName}</Text>
            <Text style={styles.sectionName}>{reminder.visionSectionName}</Text>
            <Text style={styles.description}>{reminder.description}</Text>
            <Text style={styles.reminderTime}>
              <FontAwesome5 name="clock" size={16} color="#333" /> {reminder.reminderTime}
            </Text>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={handleNavigateVisionBoard}>
            <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
    marginTop:50
  },
  pageHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4CAF50',
  },
  reminderList: {
    flex: 1,
  },
  reminderItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  boardName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionName: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  description: {
    fontSize: 14,
    marginBottom: 5,
  },
  reminderTime: {
    fontSize: 14,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
    right: 20,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default BoardReminderList;
