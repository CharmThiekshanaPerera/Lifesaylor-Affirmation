import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { affirmations } from '../../data/constants';
import { getRandomItem } from '../../data/utils';

const CustomReminderScreen = ({ navigation, route }) => {
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [customTime, setCustomTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const { categoryName, customReminderAffirmation } = route.params;

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const saveCustomReminder = async () => {
    try {
      const lastCustomReminderAffirmation = await AsyncStorage.getItem('lastCustomReminderAffirmation');

      let customReminderAffirmation = getRandomItem(affirmations);
      while (customReminderAffirmation === lastCustomReminderAffirmation) {
        customReminderAffirmation = getRandomItem(affirmations);
      }

      await AsyncStorage.setItem('lastCustomReminderAffirmation', customReminderAffirmation);

      const customReminderId = await scheduleRecurringNotification(
        categoryName, // Category name as title
        customReminderAffirmation, // Custom reminder affirmation as body
        customTime
      );

      await AsyncStorage.setItem('customReminderId', customReminderId);

      console.log('Custom Reminder Scheduled');

      const existingCustomReminder = await AsyncStorage.getItem('customReminder');
      const newCustomReminder = {
        customTime: format(customTime, 'hh:mm a'),
        customReminderAffirmation,
      };

      if (existingCustomReminder) {
        await AsyncStorage.setItem('customReminder', JSON.stringify(newCustomReminder));
      } else {
        await AsyncStorage.setItem('customReminder', JSON.stringify([newCustomReminder]));
      }

      console.log('New Custom Reminder:', newCustomReminder);

      navigation.navigate('Scheduled Notifications');
    } catch (error) {
      console.error('Error saving custom reminder:', error);
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

  const handleTimeEdit = () => {
    setTimePickerVisible(true);
  };

  const handleTimeChange = (date) => {
    setCustomTime(date);
    setTimePickerVisible(false);
  };

  return (
    <ImageBackground
      source={require('../../../assets/background/c.jpeg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
      <Text style={styles.header}>{categoryName} Reminder</Text>

        <View style={styles.timeContainer}>
          <Text style={styles.timeLabel}>
            <FontAwesome5 name="clock" size={22} color="green" /> Custom Time:
          </Text>
          <TouchableHighlight onPress={handleTimeEdit} underlayColor="#DDDDDD">
            <Text style={styles.editableTimeText}>{format(customTime, 'hh:mm a')}</Text>
          </TouchableHighlight>

          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleTimeChange}
            onCancel={() => setTimePickerVisible(false)}
          />
        </View>

        <View style={styles.row}>
          <TouchableHighlight
            style={styles.saveButton}
            underlayColor="#4CAF50"
            onPress={saveCustomReminder}
          >
            <Text style={styles.saveButtonText}>Save Custom Reminder</Text>
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
});

export default CustomReminderScreen;
