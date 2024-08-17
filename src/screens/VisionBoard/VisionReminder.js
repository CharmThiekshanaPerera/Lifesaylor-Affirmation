import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { FontAwesome5 } from '@expo/vector-icons';
import VisionSlideshow from './VisionSlideshow'; // Import the VisionSlideshow component

const VisionReminder = ({ route, navigation }) => {
  const { visionBoardName, visionSectionName, description, images } = route.params;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [reminderDate, setReminderDate] = useState(null);
  const [reminderTime, setReminderTime] = useState(null);
  const [loading, setLoading] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date) => {
    setReminderDate(date);
    hideDatePicker();
  };

  const showTimePicker = () => {
    setTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };

  const handleConfirmTime = (time) => {
    setReminderTime(time);
    hideTimePicker();
  };

  const setReminder = async () => {
    if (!reminderDate || !reminderTime) {
      Alert.alert('Please select both date and time for the reminder.');
      return;
    }

    try {
      setLoading(true);

      const reminderData = {
        visionBoardName,
        visionSectionName,
        description,
        images,
        reminderDate: reminderDate.toLocaleDateString(),
        reminderTime: reminderTime.toLocaleTimeString(),
      };

      await AsyncStorage.setItem('reminderData', JSON.stringify(reminderData));

      const customReminderId = await scheduleRecurringNotification(
        `Vision Reminder`,
        `Don't forget to check your vision board: ${visionBoardName}`,
        reminderTime
      );

      await AsyncStorage.setItem('customReminderId', customReminderId);

      Alert.alert('Reminder set successfully!');
      handleReminderListClick();
    } catch (error) {
      console.error('Error setting reminder:', error);
      Alert.alert('Error setting reminder. Please try again.');
    } finally {
      setLoading(false);
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

  const handleReminderClick = () => {
    navigation.navigate('VisionSlideshow', {
      visionBoardName,
      visionSectionName,
      description,
      images,
    });
  };

  const handleReminderListClick = () => {
    navigation.navigate('BoardReminderList');
  };

  return (
    <View style={styles.container}>
    <View style={styles.subContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.header}>{visionBoardName}</Text>
          <Text style={styles.subHeader}>{visionSectionName}</Text>
        </View>
        <View style={styles.viewReminderButtonContainer}>
          <TouchableOpacity style={styles.viewReminderButton} onPress={handleReminderListClick}>
            <FontAwesome5 name="list" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.description}>{description}</Text>
      <ScrollView horizontal style={styles.imageContainer}>
        {images.map((image, i) => (
          <Image key={i} source={{ uri: image }} style={styles.image} />
        ))}
      </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.reminderButton} onPress={showDatePicker}>
          <FontAwesome5 name="calendar-alt" size={20} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>Set Date</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reminderButton} onPress={showTimePicker}>
          <FontAwesome5 name="clock" size={20} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>Set Time</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.reminderInfoContainer}>
        {reminderDate && (
          <View style={styles.reminderInfoRow}>
            <Text style={styles.reminderInfoLabel}>Date:</Text>
            <Text style={styles.reminderInfoValue}>{reminderDate.toLocaleDateString()}</Text>
          </View>
        )}
        {reminderTime && (
          <View style={styles.reminderInfoRow}>
            <Text style={styles.reminderInfoLabel}>Time:</Text>
            <Text style={styles.reminderInfoValue}>{reminderTime.toLocaleTimeString()}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.setReminderButton} onPress={setReminder}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <FontAwesome5 name="bell" size={20} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>Set Reminder</Text>
          </>
        )}
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
      />

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmTime}
        onCancel={hideTimePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  subContainer:{
    marginBottom:'10%',
    marginTop:'50%'
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  viewReminderButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  viewReminderButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 50,
  },
  headerTextContainer: {
    flex: 3,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  subHeader: {
    fontSize: 18,
    color: '#666',
  },
  description: {
    fontSize: 16,
    color: '#444',
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    marginHorizontal: 5,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  reminderInfoContainer: {
    marginBottom: 20,
  },
  reminderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  reminderInfoLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  reminderInfoValue: {
    fontSize: 16,
    color: '#007BFF',
  },
  setReminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28A745',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    justifyContent: 'center',
  },
});

export default VisionReminder;
