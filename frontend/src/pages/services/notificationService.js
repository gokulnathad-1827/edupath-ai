import api from "./api";

const notificationService = {
  // Get all notifications
  getNotifications: async () => {
    try {
      const response = await api.get("/notifications");
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  // Get a notification by ID
  getNotificationById: async (id) => {
    try {
      const response = await api.get(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching notification:", error);
      throw error;
    }
  },

  // Create a notification
  createNotification: async (notificationData) => {
    try {
      const response = await api.post(
        "/notifications",
        notificationData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (id) => {
    try {
      const response = await api.put(
        `/notifications/${id}/read`
      );
      return response.data;
    } catch (error) {
      console.error("Error updating notification:", error);
      throw error;
    }
  },

  // Delete notification
  deleteNotification: async (id) => {
    try {
      const response = await api.delete(
        `/notifications/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },
};

export default notificationService;