import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import handleNotificationAction from './useNotifications';

const NotificationHandler = () => {
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      handleNotificationAction
    );

    return () => subscription.remove();
  }, []);

  return null; // Since we only want the side effect, return null
};

export default NotificationHandler;
