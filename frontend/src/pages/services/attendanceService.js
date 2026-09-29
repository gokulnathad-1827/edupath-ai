import { edupathApiClient } from '../../config/apiConfig';

export const markAttendance = async (data) => {
  const payload = {
    name: data.name || data.studentName,
    studentName: data.name || data.studentName,
    status: data.status || 'Present',
    date: data.date || new Date().toISOString().split('T')[0],
  };
  const res = await edupathApiClient.post('/api/attendance', payload);
  return res.data;
};

export const getAttendance = async () => {
  const res = await edupathApiClient.get('/api/attendance');
  return res.data;
};

export const updateAttendance = async (id, data) => {
  const payload = {
    name: data.name || data.studentName,
    studentName: data.name || data.studentName,
    status: data.status || 'Present',
    date: data.date || new Date().toISOString().split('T')[0],
  };
  const res = await edupathApiClient.put(`/api/attendance/${id}`, payload);
  return res.data;
};

export const deleteAttendance = async (id) => {
  const res = await edupathApiClient.delete(`/api/attendance/${id}`);
  return res.data;
};

export default {
  markAttendance,
  getAttendance,
  updateAttendance,
  deleteAttendance,
};