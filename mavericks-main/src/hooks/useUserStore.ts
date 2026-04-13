import { useState, useEffect, useCallback } from 'react';

export interface UserData {
  id: string;
  name: string;
  email: string;
  department: string;
  year: string;
  role: 'student' | 'faculty' | 'admin';
  interests: string[];
  savedEvents: string[];
  registeredEvents: string[];
  attendance: number;
}

export interface Notification {
  id: string;
  type: 'event' | 'registration' | 'priority' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  eventId?: string;
}

const DEFAULT_USER: UserData = {
  id: 'user-1',
  name: 'Alex Johnson',
  email: 'alex@university.edu',
  department: 'Computer Science',
  year: '3rd Year',
  role: 'student',
  interests: ['Technology', 'Placements', 'Workshops'],
  savedEvents: [],
  registeredEvents: [],
  attendance: 78,
};

const STORAGE_KEYS = {
  user: 'campus_hub_user',
  notifications: 'campus_hub_notifications',
  isLoggedIn: 'campus_hub_logged_in',
};

// Initial notifications
const getInitialNotifications = (): Notification[] => [
  {
    id: 'notif-1',
    type: 'priority',
    title: 'High Priority Event',
    message: 'Campus Tech Fest 2024 registration opens tomorrow. Don\'t miss out!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    read: false,
    eventId: '1',
  },
  {
    id: 'notif-2',
    type: 'event',
    title: 'New Event Added',
    message: 'AI & Machine Learning Workshop has been added for your department.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    eventId: '2',
  },
  {
    id: 'notif-3',
    type: 'reminder',
    title: 'Registration Closing Soon',
    message: 'Only 2 days left to register for Industry Connect 2024.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    read: true,
    eventId: '3',
  },
];

export const useUserStore = () => {
  const [user, setUser] = useState<UserData | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.user);
    const isLoggedIn = localStorage.getItem(STORAGE_KEYS.isLoggedIn);
    if (stored && isLoggedIn === 'true') {
      return JSON.parse(stored);
    }
    return null;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.notifications);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) }));
    }
    return getInitialNotifications();
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.isLoggedIn) === 'true';
  });

  // Persist user data
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    }
  }, [user]);

  // Persist notifications
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notifications));
  }, [notifications]);

  const login = useCallback((userData: Partial<UserData>) => {
    const newUser = { ...DEFAULT_USER, ...userData };
    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem(STORAGE_KEYS.isLoggedIn, 'true');
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem(STORAGE_KEYS.isLoggedIn);
  }, []);

  const saveEvent = useCallback((eventId: string) => {
    if (!user) return false;
    if (user.savedEvents.includes(eventId)) return false;
    
    const updatedUser = {
      ...user,
      savedEvents: [...user.savedEvents, eventId],
    };
    setUser(updatedUser);
    
    // Add notification
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: 'event',
      title: 'Event Saved',
      message: 'Event has been added to your saved events.',
      timestamp: new Date(),
      read: false,
      eventId,
    };
    setNotifications(prev => [newNotification, ...prev]);
    
    return true;
  }, [user]);

  const unsaveEvent = useCallback((eventId: string) => {
    if (!user) return;
    setUser({
      ...user,
      savedEvents: user.savedEvents.filter(id => id !== eventId),
    });
  }, [user]);

  const registerForEvent = useCallback((eventId: string) => {
    if (!user) return false;
    if (user.registeredEvents.includes(eventId)) return false;
    
    const updatedUser = {
      ...user,
      registeredEvents: [...user.registeredEvents, eventId],
    };
    setUser(updatedUser);
    
    // Add notification
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: 'registration',
      title: 'Registration Successful',
      message: 'You have successfully registered for the event.',
      timestamp: new Date(),
      read: false,
      eventId,
    };
    setNotifications(prev => [newNotification, ...prev]);
    
    return true;
  }, [user]);

  const isEventSaved = useCallback((eventId: string) => {
    return user?.savedEvents.includes(eventId) ?? false;
  }, [user]);

  const isEventRegistered = useCallback((eventId: string) => {
    return user?.registeredEvents.includes(eventId) ?? false;
  }, [user]);

  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return {
    user,
    isLoggedIn,
    notifications,
    unreadNotificationsCount,
    login,
    logout,
    saveEvent,
    unsaveEvent,
    registerForEvent,
    isEventSaved,
    isEventRegistered,
    markNotificationRead,
    markAllNotificationsRead,
    addNotification,
  };
};
