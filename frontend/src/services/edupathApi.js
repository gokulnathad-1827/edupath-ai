import { edupathApiClient, aiApiClient } from '../config/apiConfig';

export const edupathApi = {

  // Student endpoints
  createStudent: async (studentData) => {
    const res = await edupathApiClient.post('/api/students', studentData);
    return res.data;
  },

  updateStudent: async (id, studentData) => {
    const res = await edupathApiClient.put(`/api/students/${id}`, studentData);
    return res.data;
  },

  getStudentById: async (id) => {
    const res = await edupathApiClient.get(`/api/students/${id}`);
    return res.data;
  },

  getAllStudents: async () => {
    const res = await edupathApiClient.get('/api/students');
    return res.data;
  },

  getStudentByStudentId: async (studentId) => {
    const res = await edupathApiClient.get(`/api/students/student-id/${studentId}`);
    return res.data;
  },

  getStudentByAdmissionNumber: async (admissionNumber) => {
    const res = await edupathApiClient.get(`/api/students/admission/${admissionNumber}`);
    return res.data;
  },

  getStudentsByClass: async (className, section) => {
    const res = await edupathApiClient.get('/api/students/class', {
      params: { className, section },
    });
    return res.data;
  },

  getStudentByUserId: async (userId) => {
    const res = await edupathApiClient.get(`/api/students/user/${userId}`);
    return res.data;
  },

  getStudentByEmail: async (email) => {
    const res = await edupathApiClient.get(`/api/students/email/${email}`);
    return res.data;
  },

  assignTeacher: async (studentId, teacherId) => {
    const res = await edupathApiClient.post('/api/students/assign-teacher', null, {
      params: { studentId, teacherId },
    });
    return res.data;
  },

  assignCounselor: async (studentId, counselorId) => {
    const res = await edupathApiClient.post('/api/students/assign-counselor', null, {
      params: { studentId, counselorId },
    });
    return res.data;
  },

  deleteStudent: async (id) => {
    const res = await edupathApiClient.delete(`/api/students/${id}`);
    return res.data;
  },

  getStudentOverallPercentage: async (studentId) => {
    const res = await edupathApiClient.get(`/api/students/${studentId}/overall-percentage`);
    return res.data;
  },

  getStudentClassRank: async (studentId) => {
    const res = await edupathApiClient.get(`/api/students/${studentId}/class-rank`);
    return res.data;
  },

  getStudentAttendanceSummary: async (studentId) => {
    const res = await edupathApiClient.get(`/api/students/${studentId}/attendance-summary`);
    return res.data;
  },

  getStudentSubjectAttendance: async (studentId) => {
    const res = await edupathApiClient.get(`/api/students/${studentId}/attendance/subjects`);
    return res.data;
  },

  getStudentMarks: async (studentId) => {
    const res = await edupathApiClient.get(`/api/students/${studentId}/marks`);
    return res.data;
  },

  // Dropout Risk AI endpoints
  getStudentDropoutRisk: async (studentId) => {
    const res = await edupathApiClient.get(`/api/ai/students/${studentId}/dropout-risk`);
    return res.data;
  },

  getDropoutRiskSummary: async (params = {}) => {
    const res = await edupathApiClient.get('/api/ai/students/dropout-risk/summary', { params });
    return res.data;
  },

  getDropoutExplanation: async (payload) => {
    const res = await aiApiClient.post('/api/ai/dropout-explanation', payload);
    return res.data;
  },

  // Parent endpoints
  getParentById: async (id) => {
    const res = await edupathApiClient.get(`/api/parents/${id}`);
    return res.data;
  },

  getParentByUserId: async (userId) => {
    const res = await edupathApiClient.get(`/api/parents/user/${userId}`);
    return res.data;
  },

  getParentByEmail: async (email) => {
    const res = await edupathApiClient.get(`/api/parents/email/${email}`);
    return res.data;
  },

  getParentChildDropoutRisk: async (parentId) => {
    const res = await edupathApiClient.get(`/api/ai/students/parent/${parentId}/dropout-risk`);
    return res.data;
  },

  // Counselor endpoints
  getAllCounselors: async () => {
    const res = await edupathApiClient.get('/api/counselors');
    return res.data;
  },

  getCounselorById: async (id) => {
    const res = await edupathApiClient.get(`/api/counselors/${id}`);
    return res.data;
  },

  getCounselorByUserId: async (userId) => {
    const res = await edupathApiClient.get(`/api/counselors/user/${userId}`);
    return res.data;
  },

  getCounselorByEmail: async (email) => {
    const res = await edupathApiClient.get(`/api/counselors/email/${email}`);
    return res.data;
  },

  getCounselorStudentsDropoutRisk: async (counselorId) => {
    const res = await edupathApiClient.get(`/api/ai/students/counselor/${counselorId}/dropout-risk`);
    return res.data;
  },

  getCounselorReport: async (counselorId) => {
    const res = await edupathApiClient.get(`/api/counselors/${counselorId}/report`);
    return res.data;
  },

  getCounselorReportByUser: async (userId) => {
    const res = await edupathApiClient.get(`/api/counselors/user/${userId}/report`);
    return res.data;
  },



  // Teacher endpoints
  getAllTeachers: async () => {
    const res = await edupathApiClient.get('/api/teachers');
    return res.data;
  },

  getTeacherById: async (id) => {
    const res = await edupathApiClient.get(`/api/teachers/${id}`);
    return res.data;
  },

  getTeacherByUserId: async (userId) => {
    const res = await edupathApiClient.get(`/api/teachers/user/${userId}`);
    return res.data;
  },

  getTeacherByEmail: async (email) => {
    const res = await edupathApiClient.get(`/api/teachers/email/${email}`);
    return res.data;
  },

  getTeacherReport: async (teacherId) => {
    const res = await edupathApiClient.get(`/api/teachers/${teacherId}/report`);
    return res.data;
  },

  getTeacherReportByUser: async (userId) => {
    const res = await edupathApiClient.get(`/api/teachers/user/${userId}/report`);
    return res.data;
  },

  getTeacherStudentsDropoutRisk: async (teacherId) => {
    const res = await edupathApiClient.get(`/api/ai/students/teacher/${teacherId}/dropout-risk`);
    return res.data;
  },

  getAdminStudentsDropoutRisk: async () => {
    const res = await edupathApiClient.get('/api/ai/students/admin/dropout-risk');
    return res.data;
  },

  getAdminStudentGrowth: async () => {
    const res = await edupathApiClient.get('/api/admin/dashboard/student-growth');
    return res.data;
  },

  getAdminGradeDistribution: async () => {
    const res = await edupathApiClient.get('/api/admin/dashboard/grade-distribution');
    return res.data;
  },

  getAdminPerformanceAverage: async () => {
    const res = await edupathApiClient.get('/api/admin/dashboard/performance');
    return res.data;
  },

  getAdminAttendanceDistribution: async () => {
    const res = await edupathApiClient.get('/api/admin/dashboard/attendance-distribution');
    return res.data;
  },



  createTeacher: async (teacherData) => {
    const res = await edupathApiClient.post('/api/teachers', teacherData);
    return res.data;
  },

  updateTeacher: async (id, teacherData) => {
    const res = await edupathApiClient.put(`/api/teachers/${id}`, teacherData);
    return res.data;
  },

  deleteTeacher: async (id) => {
    const res = await edupathApiClient.delete(`/api/teachers/${id}`);
    return res.data;
  },

  // Parent endpoints
  getAllParents: async () => {
    const res = await edupathApiClient.get('/api/parents');
    return res.data;
  },

  getParentById: async (id) => {
    const res = await edupathApiClient.get(`/api/parents/${id}`);
    return res.data;
  },

  getParentLinkedStudent: async (parentId) => {
    const res = await edupathApiClient.get(`/api/parents/${parentId}/child`);
    return res.data;
  },

  getParentByUserId: async (userId) => {
    const res = await edupathApiClient.get(`/api/parents/user/${userId}`);
    return res.data;
  },

  getParentByEmail: async (email) => {
    const res = await edupathApiClient.get(`/api/parents/email/${email}`);
    return res.data;
  },

  createParent: async (parentData) => {
    const res = await edupathApiClient.post('/api/parents', parentData);
    return res.data;
  },

  updateParent: async (id, parentData) => {
    const res = await edupathApiClient.put(`/api/parents/${id}`, parentData);
    return res.data;
  },

  deleteParent: async (id) => {
    const res = await edupathApiClient.delete(`/api/parents/${id}`);
    return res.data;
  },

  // Counselor endpoints
  getAllCounselors: async () => {
    const res = await edupathApiClient.get('/api/counselors');
    return res.data;
  },

  getCounselorById: async (id) => {
    const res = await edupathApiClient.get(`/api/counselors/${id}`);
    return res.data;
  },

  getCounselorByUserId: async (userId) => {
    const res = await edupathApiClient.get(`/api/counselors/user/${userId}`);
    return res.data;
  },

  getCounselorByEmail: async (email) => {
    const res = await edupathApiClient.get(`/api/counselors/email/${email}`);
    return res.data;
  },

  getCounselorStudentsDropoutRisk: async (counselorId) => {
    const res = await edupathApiClient.get(`/api/ai/students/counselor/${counselorId}/dropout-risk`);
    return res.data;
  },


  createCounselor: async (counselorData) => {
    const res = await edupathApiClient.post('/api/counselors', counselorData);
    return res.data;
  },

  updateCounselor: async (id, counselorData) => {
    const res = await edupathApiClient.put(`/api/counselors/${id}`, counselorData);
    return res.data;
  },

  deleteCounselor: async (id) => {
    const res = await edupathApiClient.delete(`/api/counselors/${id}`);
    return res.data;
  },

  // Counseling Session endpoints
  getAllCounselingSessions: async () => {
    const res = await edupathApiClient.get('/api/counseling/sessions');
    return res.data;
  },

  createCounselingSession: async (sessionData) => {
    const res = await edupathApiClient.post('/api/counseling/sessions', sessionData);
    return res.data;
  },

  updateCounselingSession: async (id, sessionData) => {
    const res = await edupathApiClient.put(`/api/counseling/sessions/${id}`, sessionData);
    return res.data;
  },

  deleteCounselingSession: async (id) => {
    const res = await edupathApiClient.delete(`/api/counseling/sessions/${id}`);
    return res.data;
  },

  // Notification endpoints
  getAllNotifications: async () => {
    const res = await edupathApiClient.get('/api/notifications');
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

  // Attendance endpoints
  getAllAttendance: async () => {
    const res = await edupathApiClient.get('/api/attendance');
    return res.data;
  },

  markAttendance: async (attendanceData) => {
    const res = await edupathApiClient.post('/api/attendance', attendanceData);
    return res.data;
  },

  updateAttendance: async (id, attendanceData) => {
    const res = await edupathApiClient.put(`/api/attendance/${id}`, attendanceData);
    return res.data;
  },

  deleteAttendance: async (id) => {
    const res = await edupathApiClient.delete(`/api/attendance/${id}`);
    return res.data;
  },

  // Marks endpoints
  getAllMarks: async () => {
    const res = await edupathApiClient.get('/api/marks');
    return res.data;
  },

  addMarks: async (marksData) => {
    const res = await edupathApiClient.post('/api/marks', marksData);
    return res.data;
  },

  updateMarks: async (id, marksData) => {
    const res = await edupathApiClient.put(`/api/marks/${id}`, marksData);
    return res.data;
  },

  deleteMarks: async (id) => {
    const res = await edupathApiClient.delete(`/api/marks/${id}`);
    return res.data;
  },
  // Admin endpoints
  getAdminClassSummaries: async () => {
    const res = await edupathApiClient.get('/api/admin/dashboard/classes');
    return res.data;
  },

  getAdminStudentReports: async () => {
    const res = await edupathApiClient.get('/api/admin/dashboard/reports/students');
    return res.data;
  },

  getAdminTeacherReports: async () => {
    const res = await edupathApiClient.get('/api/admin/dashboard/reports/teachers');
    return res.data;
  },
};

export default edupathApi;
