import { courseApiClient } from '../config/apiConfig';

export const courseApi = {
  getAllCourses: async () => {
    const res = await courseApiClient.get('/api/courses');
    return res.data;
  },

  getCourseById: async (id) => {
    const res = await courseApiClient.get(`/api/courses/${id}`);
    return res.data;
  },

  createCourse: async (courseData) => {
    const res = await courseApiClient.post('/api/courses', courseData);
    return res.data;
  },

  updateCourse: async (id, courseData) => {
    const res = await courseApiClient.put(`/api/courses/${id}`, courseData);
    return res.data;
  },

  deleteCourse: async (id) => {
    const res = await courseApiClient.delete(`/api/courses/${id}`);
    return res.data;
  },
};

export default courseApi;
