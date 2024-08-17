import * as Notifications from 'expo-notifications';
import React, { useEffect } from 'react';
import AppContainer from './src/navigations/AppNavigation';
import handleNotification from './src/hooks/handleNotification';

export default function App() {
  // Call handleNotification directly, no need to put it inside useEffect
  handleNotification();

  // Set up notification handler and channel
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Create a notification channel for Android 8.0 and above

    const channelId = 'default';
    const channel = {
      name: 'Default',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: true, // Enable or disable sound for the channel
        // Specify the custom notification icon
        icon: './assets/notification.png', // Use the correct path to your icon
    };

    Notifications.setNotificationChannelAsync(channelId, channel);
  }, []);

  return <AppContainer />;
}
