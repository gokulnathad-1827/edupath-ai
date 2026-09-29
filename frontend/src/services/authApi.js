import { authApiClient } from '../config/apiConfig';

export const authApi = {
  login: async (email, password) => {
    const res = await authApiClient.post('/auth/login', { email, password });
    return res.data;
  },

  register: async (registerData) => {
    const payload = {
      fullName: registerData.fullName || registerData.name || '',
      email: registerData.email || '',
      password: registerData.password || '',
      phoneNumber: registerData.phoneNumber || registerData.phone || '0000000000',
      roleName: (registerData.roleName || registerData.role || 'STUDENT').toUpperCase(),
    };
    const res = await authApiClient.post('/auth/register', payload);
    return res.data;
  },

  refreshToken: async (token) => {
    const res = await authApiClient.post('/auth/refresh-token', { token });
    return res.data;
  },

  forgotPassword: async (email) => {
    const res = await authApiClient.post('/auth/forgot-password', { email });
    return res.data;
  },

  resetPassword: async (token, newPassword) => {
    const res = await authApiClient.post('/auth/reset-password', { token, newPassword });
    return res.data;
  },

  changePassword: async (userId, oldPassword, newPassword) => {
    const res = await authApiClient.post('/auth/change-password', {
      userId,
      oldPassword,
      newPassword,
    });
    return res.data;
  },

  getMe: async () => {
    const res = await authApiClient.get('/auth/me');
    return res.data;
  },
};

export default authApi;
