import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { handleNotificationAction } from './useNotifications';


const handleNotifications = () => {
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  useEffect(() => {
    if (lastNotificationResponse) {
      console.log("lastNotificationResponse",lastNotificationResponse)
      handleNotificationAction(lastNotificationResponse);
    }
  }, [lastNotificationResponse]);
};

export default handleNotifications;
