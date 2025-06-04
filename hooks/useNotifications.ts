import { useState, useEffect } from "react";

// Define types for our notifications
interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  markAsRead: (id: string) => void;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => void;
  clearAll: () => void;
  resetToInitial: () => void;
}

// Sample mock notifications data
const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "New Message",
    message: "You have received a message from Jane Smith",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    read: false,
  },
  {
    id: "2",
    title: "Friend Request",
    message: "Alex Johnson sent you a friend request",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: false,
  },
  {
    id: "3",
    title: "Meeting Reminder",
    message: "Your team meeting starts in 30 minutes",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    read: true,
  },
  {
    id: "4",
    title: "System Update",
    message: "The system will be updated tomorrow at 2:00 AM",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: true,
  },
  {
    id: "5",
    title: "New Feature",
    message: "Check out the new dashboard features we just launched!",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    read: false,
  },
];

/**
 * Custom hook to manage notifications
 * @returns {UseNotificationsReturn} - Notifications, loading status, error status, and functions to manage notifications
 */
export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate fetching notifications from an API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Load notifications from localStorage if available, otherwise use initial data
        const storedNotifications = localStorage.getItem("mockNotifications");

        if (storedNotifications) {
          setNotifications(JSON.parse(storedNotifications));
        } else {
          setNotifications(initialNotifications);
          // Store initial notifications in localStorage
          localStorage.setItem(
            "mockNotifications",
            JSON.stringify(initialNotifications)
          );
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to load notifications");
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Mark a notification as read
  const markAsRead = (id: string): void => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      );

      // Update localStorage
      localStorage.setItem(
        "mockNotifications",
        JSON.stringify(updatedNotifications)
      );

      return updatedNotifications;
    });
  };

  // Add a new notification
  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ): void => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };

    setNotifications((prevNotifications) => {
      const updatedNotifications = [newNotification, ...prevNotifications];

      // Update localStorage
      localStorage.setItem(
        "mockNotifications",
        JSON.stringify(updatedNotifications)
      );

      return updatedNotifications;
    });
  };

  // Clear all notifications
  const clearAll = (): void => {
    setNotifications([]);
    localStorage.removeItem("mockNotifications");
  };

  // Reset to initial notifications (for testing)
  const resetToInitial = (): void => {
    setNotifications(initialNotifications);
    localStorage.setItem(
      "mockNotifications",
      JSON.stringify(initialNotifications)
    );
  };

  return {
    notifications,
    loading,
    error,
    markAsRead,
    addNotification,
    clearAll,
    resetToInitial,
  };
};

// Optional: Helper function to generate a random notification (for testing)
interface RandomNotification {
  title: string;
  message: string;
}

export const generateRandomNotification = (): RandomNotification => {
  const titles: string[] = [
    "New Message",
    "Friend Request",
    "System Alert",
    "Update Available",
    "Security Notice",
    "Calendar Event",
    "Task Reminder",
  ];

  const messages: string[] = [
    "You have a new message from a team member",
    "Someone sent you a friend request",
    "System maintenance scheduled for tonight",
    "A new update is available for your account",
    "Your password will expire in 3 days",
    "You have an upcoming meeting tomorrow",
    "Don't forget to complete your pending tasks",
  ];

  const randomTitle = titles[Math.floor(Math.random() * titles.length)];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return {
    title: randomTitle,
    message: randomMessage,
  };
};
