import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { format } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from 'react-native-paper';

const PreHabitReminder = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const { habitId, habitName, habitDescription, habitPhotoUrl } = route.params;

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const allScheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
        const habitReminders = allScheduledNotifications.filter(notification => {
          const data = notification.content.data;
          if (data && data.habitId === habitId) {
            return true;
          }
          return false;
        });
        setReminders(habitReminders);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reminders:', error);
        setLoading(false);
      }
    };
  
    fetchReminders();
  }, [habitId]);  
  

  const deleteReminder = async (identifier) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
      const updatedReminders = reminders.filter(reminder => reminder.identifier !== identifier);
      setReminders(updatedReminders);

      // Update AsyncStorage
      const storedReminders = await AsyncStorage.getItem(`reminders_${habitId}`);
      const parsedReminders = storedReminders ? JSON.parse(storedReminders) : [];
      const updatedStoredReminders = parsedReminders.filter(reminder => reminder.identifier !== identifier);
      await AsyncStorage.setItem(`reminders_${habitId}`, JSON.stringify(updatedStoredReminders));

      Alert.alert('Reminder deleted');
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  const renderReminder = ({ item }) => (
    <View style={styles.reminderItem}>
      <Text style={styles.reminderTime}>
        {format(new Date().setHours(item.trigger.hour, item.trigger.minute), 'hh:mm a')}
      </Text>
      <TouchableOpacity onPress={() => deleteReminder(item.identifier)}>
        <MaterialIcons name="delete" size={24} color="#FF0000" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.habitName}>{habitName}</Text>
          <Image source={{ uri: habitPhotoUrl }} style={styles.image} />
          <Text style={styles.habitDescription}>{habitDescription}</Text>
        </Card.Content>
      </Card>
      <FlatList
        data={reminders}
        renderItem={renderReminder}
        keyExtractor={item => item.identifier.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No reminders set for this habit.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    elevation: 2,
  },
  habitName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 340,
    borderRadius: 10,
    marginBottom: 20,
  },
  habitDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  reminderTime: {
    fontSize: 18,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PreHabitReminder;
