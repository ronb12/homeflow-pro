// Browser Push Notification Utilities

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const showBrowserNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/logo192.png', // App icon
      badge: '/logo192.png',
      ...options
    });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
    
    return notification;
  }
  return null;
};

export const sendSmartNotification = (
  title: string, 
  message: string, 
  priority: 'Low' | 'Medium' | 'High' | 'Urgent',
  type: 'bill' | 'task' | 'package' | 'password' | 'budget' | 'general'
) => {
  // Only show browser notification for High and Urgent
  if (priority === 'High' || priority === 'Urgent') {
    showBrowserNotification(title, {
      body: message,
      tag: `homeflow-${type}`,
      requireInteraction: priority === 'Urgent',
      silent: false,
    });
  }
};

