/** @fileoverview Browser Notification API hook for study reminders */
import { useState, useCallback } from 'react';

const useNotifications = () => {
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  );
  const isSupported = typeof Notification !== 'undefined';

  const requestPermission = useCallback(async () => {
    if (!isSupported) return 'denied';
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, [isSupported]);

  const sendNotification = useCallback((title, options = {}) => {
    if (!isSupported || permission !== 'granted') return null;
    return new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });
  }, [isSupported, permission]);

  return { requestPermission, sendNotification, isSupported, permission };
};

export default useNotifications;
