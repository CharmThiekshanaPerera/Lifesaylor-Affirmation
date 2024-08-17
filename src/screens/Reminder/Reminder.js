import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  ImageBackground,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns'; // Importing format function from date-fns
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { affirmations } from '../../data/constants';
import { getRandomItem } from '../../data/utils';

const SleepTimeScreen = ({ navigation, route }) => {
  const [isSleepTimePickerVisible, setSleepTimePickerVisible] = useState(false);
  const [isWakeTimePickerVisible, setWakeTimePickerVisible] = useState(false);
  const [sleepTime, setSleepTime] = useState(new Date());
  const [wakeTime, setWakeTime] = useState(new Date());
  const [reminders, setReminders] = useState([]);
  const [isEditingSleepTime, setEditingSleepTime] = useState(false);
  const [isEditingWakeTime, setEditingWakeTime] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const storedSelectedCategory = await AsyncStorage.getItem('selectedCategory');

      if (storedSelectedCategory) {
        setSelectedCategory(storedSelectedCategory);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [route.params]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const saveReminders = async () => {
    try {
      const sleepTimeAffirmation = getRandomItem(affirmations);
      const wakeTimeAffirmation = getRandomItem(affirmations);

      {/* 
    
      // Retrieve the last selected affirmation for sleepTime
      const lastSleepTimeAffirmation = await AsyncStorage.getItem('lastSleepTimeAffirmation');

      // Get random affirmations for sleepTime and wakeTime, excluding the last selected affirmation
      let sleepTimeAffirmation = getRandomItem(affirmations);
      while (sleepTimeAffirmation === lastSleepTimeAffirmation) {
        sleepTimeAffirmation = getRandomItem(affirmations);
      }

      let wakeTimeAffirmation = getRandomItem(affirmations);
      while (wakeTimeAffirmation === sleepTimeAffirmation) {
        wakeTimeAffirmation = getRandomItem(affirmations);
      }

      // Save the current affirmation for the next comparison
      await AsyncStorage.setItem('lastSleepTimeAffirmation', sleepTimeAffirmation);
    
    */}

      // Schedule daily recurring notifications for sleepTime and wakeTime
      const sleepTimeReminderId = await scheduleRecurringNotification(
        'Sleep Time Reminder',
        ` ${sleepTimeAffirmation}`,
        sleepTime
      );

      const wakeTimeReminderId = await scheduleRecurringNotification(
        'Wake Time Reminder',
        ` ${wakeTimeAffirmation}`,
        wakeTime
      );

      // Save reminder IDs or any other necessary data in AsyncStorage
      await AsyncStorage.setItem('sleepTimeReminderId', sleepTimeReminderId);
      await AsyncStorage.setItem('wakeTimeReminderId', wakeTimeReminderId);

      console.log('Reminders Scheduled');

      // Save the reminder in AsyncStorage
      const existingReminder = await AsyncStorage.getItem('sleepWakeReminder');
      const newReminder = {
        sleepTime: format(sleepTime, 'hh:mm a'), // Format the sleepTime using date-fns format function
        wakeTime: format(wakeTime, 'hh:mm a'), // Format the wakeTime using date-fns format function
        sleepTimeAffirmation,
        wakeTimeAffirmation,
      };

      // If there's an existing reminder, replace it with the new one
      if (existingReminder) {
        await AsyncStorage.setItem('sleepWakeReminder', JSON.stringify(newReminder));
      } else {
        await AsyncStorage.setItem('sleepWakeReminder', JSON.stringify([newReminder]));
      }

      // Log the new reminder
      console.log('New Reminder:', newReminder);

      // Update the reminders state
      setReminders([newReminder]);
    } catch (error) {
      console.error('Error saving reminders:', error);
    }
  };

  const scheduleRecurringNotification = async (title, body, triggerTime) => {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: {
        hour: triggerTime.getHours(),
        minute: triggerTime.getMinutes(),
        repeats: true,
      },
    });

    return identifier;
  };

  const navigateToHome = () => {
    navigation.navigate('Random Motivation');
  };
  const navigateToCustomReminder = () => {
    navigation.navigate('Custom Reminder');
  };

  const handleSleepTimeEdit = () => {
    setEditingSleepTime(true);
  };

  const handleWakeTimeEdit = () => {
    setEditingWakeTime(true);
  };

  const handleSleepTimeChange = (date) => {
    setSleepTime(date);
    setEditingSleepTime(false);
  };

  const handleWakeTimeChange = (date) => {
    setWakeTime(date);
    setEditingWakeTime(false);
  };
  
  const navigateToScheduledNotifications = () => {
    navigation.navigate('Scheduled Notifications');
  };

  return (
    <ImageBackground
      source={require('../../../assets/background/c.jpeg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        {/* <TouchableHighlight
          style={styles.customReminderButton}
          underlayColor="#007BFF"
          onPress={navigateToCustomReminder}
        >
          <FontAwesome5 name="bell" size={22} color="#fff" />
        </TouchableHighlight> */}
{/* 
        <TouchableOpacity
          style={styles.scheduledNotificationsButton}
          onPress={navigateToScheduledNotifications}
        >
          <FontAwesome5 name="list-alt" size={22} color="#fff" />
        </TouchableOpacity> */}

        <Text style={styles.header}>Schedule Your {selectedCategory} Reminder</Text>

        <View style={styles.timeContainer}>
          <Text style={styles.timeLabel}>
            <FontAwesome5 name="bed" size={22} color="#333" /> Sleep Time:
          </Text>
          {isEditingSleepTime ? (
            <DateTimePickerModal
              isVisible={isEditingSleepTime}
              mode="time"
              onConfirm={handleSleepTimeChange}
              onCancel={() => setEditingSleepTime(false)}
            />
          ) : (
            <TouchableHighlight onPress={handleSleepTimeEdit} underlayColor="#DDDDDD">
              <Text style={styles.editableTimeText}>{format(sleepTime, 'hh:mm a')}</Text>
            </TouchableHighlight>
          )}
        </View>

        <View style={styles.timeContainer}>
          <Text style={styles.timeLabel}>
            <FontAwesome5 name="sun" size={22} color="#FFD700" /> Wake Time:
          </Text>
          {isEditingWakeTime ? (
            <DateTimePickerModal
              isVisible={isEditingWakeTime}
              mode="time"
              onConfirm={handleWakeTimeChange}
              onCancel={() => setEditingWakeTime(false)}
            />
          ) : (
            <TouchableHighlight onPress={handleWakeTimeEdit} underlayColor="#DDDDDD">
              <Text style={styles.editableTimeText}>{format(wakeTime, 'hh:mm a')}</Text>
            </TouchableHighlight>
          )}
        </View>

        <View style={styles.row}>
          <TouchableHighlight
            style={styles.saveButton}
            underlayColor="#4CAF50"
            onPress={() => {
              saveReminders();
              navigateToHome();
            }}
          >
            <Text style={styles.saveButtonText}>Save Reminders</Text>
          </TouchableHighlight>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    color: 'green',
    fontWeight: 'bold',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeLabel: {
    fontSize: 22,
    marginRight: 10,
  },
  editableTimeText: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    minWidth: 100,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  saveButton: {
    marginTop: '10%',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 15,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
  },
});

export default SleepTimeScreen;
