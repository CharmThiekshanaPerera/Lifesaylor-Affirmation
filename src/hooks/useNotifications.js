import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import navigation from '../navigations/RootNavigation'


export const useNotifications = () => {
  useEffect(() => {
    // Set up notification handler to display notifications when the app is in the foreground
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Create a notification channel for Android 8.0 and above
    const channelId = 'default'; // You can use any channel ID you prefer
    const channel = {
      name: 'Default',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: true, // Enable or disable sound for the channel
      icon: './assets/notification.png', // Use the correct path to your icon
    };

    Notifications.setNotificationChannelAsync(channelId, channel);
  }, []);
};

export const handleNotificationAction = async (notificationResponse) => {
  //console.log('handleNotificationAction');
  console.log('notificationResponse', notificationResponse);
  const params = notificationResponse.notification.request.content.data
  navigation.navigate('Affirmation Slideshow', {params});
};

