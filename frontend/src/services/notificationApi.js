import { edupathApiClient } from '../config/apiConfig';

export const notificationApi = {
  getAllNotifications: async () => {
    const res = await edupathApiClient.get('/api/notifications');
    return res.data;
  },

  getNotificationsForUser: async (userId, role) => {
    const url = userId ? `/api/notifications/user/${userId}${role ? `?role=${role}` : ''}` : '/api/notifications';
    const res = await edupathApiClient.get(url);
    return res.data;
  },

  createNotification: async (notifData) => {
    const res = await edupathApiClient.post('/api/notifications', notifData);
    return res.data;
  },

  deleteNotification: async (id) => {
    const res = await edupathApiClient.delete(`/api/notifications/${id}`);
    return res.data;
  },
};

export default notificationApi;
