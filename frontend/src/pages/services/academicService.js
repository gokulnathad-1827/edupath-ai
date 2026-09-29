import { edupathApiClient } from '../../config/apiConfig';

export const addMarks = async (data) => {
  const payload = {
    name: data.name || data.studentName,
    studentName: data.name || data.studentName,
    subject: data.subject || 'General',
    marks: String(data.marks || '0'),
    date: data.date || new Date().toISOString().split('T')[0],
  };
  const res = await edupathApiClient.post('/api/marks', payload);
  return res.data;
};

export const getMarks = async () => {
  const res = await edupathApiClient.get('/api/marks');
  return res.data;
};

export const updateMarks = async (id, data) => {
  const payload = {
    name: data.name || data.studentName,
    studentName: data.name || data.studentName,
    subject: data.subject || 'General',
    marks: String(data.marks || '0'),
    date: data.date || new Date().toISOString().split('T')[0],
  };
  const res = await edupathApiClient.put(`/api/marks/${id}`, payload);
  return res.data;
};

export const deleteMarks = async (id) => {
  const res = await edupathApiClient.delete(`/api/marks/${id}`);
  return res.data;
};

export default {
  addMarks,
  getMarks,
  updateMarks,
  deleteMarks,
};
