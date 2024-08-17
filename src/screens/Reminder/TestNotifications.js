// TestReminderScreen.js
import { format, getHours, getMinutes } from 'date-fns';
import * as Notifications from 'expo-notifications';
import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const TestReminderScreen = ({ route, navigation }) => {
  const { categoryName, categoryId } = route.params;

  const [notificationTitle] = useState('Affirmation Slideshow Reminder');
  const [notificationBody] = useState(categoryName);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());

  const scheduleNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notificationTitle,
          body: notificationBody,
          data: { categoryId, categoryName }
        },
        trigger: {
          hour: getHours(selectedTime),
          minute: getMinutes(selectedTime),
          repeats: true,
        },
      });

      // Fetch the updated list of scheduled notifications
      const allScheduled = await Notifications.getAllScheduledNotificationsAsync();
      // Navigate to the ScheduledNotificationsScreen with the updated list
      navigation.navigate('Scheduled Notifications', { scheduledNotifications: allScheduled });
    } catch (error) {
      console.error('Error scheduling notification:', error.message);
    }
  };

  const showTimePicker = () => {
    setTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };

  const handleTimeConfirm = (date) => {
    hideTimePicker();
    setSelectedTime(date);
  };

  return (
    <ImageBackground source={require('../../../assets/background/c.jpeg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.header}>{categoryName} Reminder</Text>

        <View style={styles.timeContainer}>
          <Text style={styles.timeLabel}>Select Time:</Text>
          <TouchableOpacity onPress={showTimePicker} style={styles.editableTimeTextContainer}>
            <Text style={styles.editableTimeText}>{format(selectedTime, 'hh:mm a')}</Text>
          </TouchableOpacity>
        </View>

        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleTimeConfirm}
          onCancel={hideTimePicker}
        />

        <View style={styles.row}>
          <TouchableOpacity style={styles.saveButton} onPress={scheduleNotification}>
            <Text style={styles.saveButtonText}>Schedule Reminder</Text>
          </TouchableOpacity>
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
  editableTimeTextContainer: {
    //flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    minWidth: 100,
  },
  editableTimeText: {
    fontSize: 18,
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

export default TestReminderScreen;
