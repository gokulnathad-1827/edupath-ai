import { careerApiClient } from '../config/apiConfig';

export const careerApi = {
  getAllCareers: async () => {
    const res = await careerApiClient.get('/api/careers');
    return res.data;
  },

  getCareerById: async (id) => {
    const res = await careerApiClient.get(`/api/careers/${id}`);
    return res.data;
  },

  createCareer: async (careerData) => {
    const res = await careerApiClient.post('/api/careers', careerData);
    return res.data;
  },

  updateCareer: async (id, careerData) => {
    const res = await careerApiClient.put(`/api/careers/${id}`, careerData);
    return res.data;
  },

  deleteCareer: async (id) => {
    const res = await careerApiClient.delete(`/api/careers/${id}`);
    return res.data;
  },
};

export default careerApi;
