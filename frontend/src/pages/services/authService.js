import { authApi } from '../../services/authApi';

// ── Fallback data for offline development mode ───────────────────────────────
const DUMMY_USER = {
  id: 'stu_001',
  name: 'Ananya Sharma',
  fullName: 'Ananya Sharma',
  email: 'ananya@student.edu',
  role: 'student',
  studentId: '24A103',
  department: 'Class 10-A',
  year: 10,
  avatar: null,
};

const DUMMY_TOKEN = 'dummy_jwt_token_edupath_2025';

export const authService = {
  login: async (emailOrUsername, password) => {
    try {
      const data = await authApi.login(emailOrUsername, password);
      // Map LoginResponse to user object
      const roleStr = (data.role || 'STUDENT').toString().toLowerCase().replace('role_', '');
      const user = {
        id: data.id,
        email: data.email,
        fullName: data.fullName,
        name: data.fullName,
        role: roleStr,
      };
      return {
        token: data.token,
        type: data.type || 'Bearer',
        user,
        role: roleStr,
      };
    } catch (err) {
      if (err?.message && !err.message.includes('Network Error') && !err.message.includes('ECONNREFUSED')) {
        // Real API returned an error message (e.g., Invalid credentials, User disabled)
        throw err;
      }
      
      // Fallback offline validation for development testing
      if (!emailOrUsername || !password) {
        throw new Error('Please fill in all fields.');
      }

      let normalizedEmail = emailOrUsername.trim().toLowerCase();
      if (normalizedEmail === 'admin') normalizedEmail = 'admin@edupath.com';
      if (normalizedEmail === 'teacher') normalizedEmail = 'teacher@edupath.com';
      if (normalizedEmail === 'student') normalizedEmail = 'student@edupath.com';
      if (normalizedEmail === 'parent') normalizedEmail = 'parent@edupath.com';
      if (normalizedEmail === 'counselor') normalizedEmail = 'counselor@edupath.com';

      const CREDENTIALS = {
        'admin@edupath.com': { password: 'admin123', role: 'admin' },
        'teacher@edupath.com': { password: 'teacher123', role: 'teacher' },
        'student@edupath.com': { password: 'student123', role: 'student' },
        'parent@edupath.com': { password: 'parent123', role: 'parent' },
        'counselor@edupath.com': { password: 'counselor123', role: 'counselor' },
      };

      const cred = CREDENTIALS[normalizedEmail];
      if (!cred || cred.password !== password) {
        throw new Error('Invalid email or password.');
      }

      const matchedRole = cred.role;
      let name = 'Ananya Sharma';
      let permissions = ['view_dashboard', 'take_assessment', 'view_performance', 'view_attendance'];
      
      if (matchedRole === 'teacher') {
        name = 'Mrs. Priya Sharma';
        permissions = ['view_students', 'manage_attendance', 'manage_marks', 'view_reports'];
      } else if (matchedRole === 'admin') {
        name = 'School Administrator';
        permissions = ['manage_users', 'manage_classes', 'view_analytics', 'view_reports'];
      } else if (matchedRole === 'counselor') {
        name = 'Ms. Deepa Nair';
        permissions = ['view_at_risk_students', 'manage_sessions', 'view_reports'];
      } else if (matchedRole === 'parent') {
        name = 'Mr. Rajesh Kumar';
        permissions = ['view_child_progress', 'view_child_attendance', 'view_child_performance'];
      }
      
      return {
        token: DUMMY_TOKEN,
        role: matchedRole,
        user: {
          ...DUMMY_USER,
          email: normalizedEmail,
          role: matchedRole,
          name,
          fullName: name,
          permissions,
          studentId: matchedRole === 'student' ? '24A103' : undefined,
        },
      };
    }
  },

  register: async (formData) => {
    try {
      const data = await authApi.register(formData);
      const roleStr = (data.role || formData.roleName || formData.role || 'STUDENT').toString().toLowerCase().replace('role_', '');
      const user = {
        id: data.id,
        email: data.email,
        fullName: data.fullName,
        name: data.fullName,
        phoneNumber: data.phoneNumber,
        role: roleStr,
      };
      return {
        user,
        role: roleStr,
      };
    } catch (err) {
      if (err?.message && !err.message.includes('Network Error') && !err.message.includes('ECONNREFUSED')) {
        throw err;
      }
      const role = (formData.roleName || formData.role || 'student').toString().toLowerCase().replace('role_', '');
      let name = formData.fullName || formData.name;
      let permissions = ['view_dashboard', 'take_assessment', 'view_performance', 'view_attendance'];
      
      if (role === 'teacher') {
        name = name || 'Mrs. Priya Sharma';
        permissions = ['view_students', 'manage_attendance', 'manage_marks', 'view_reports'];
      } else if (role === 'admin') {
        name = name || 'School Administrator';
        permissions = ['manage_users', 'manage_classes', 'view_analytics', 'view_reports'];
      } else if (role === 'counselor') {
        name = name || 'Ms. Deepa Nair';
        permissions = ['view_at_risk_students', 'manage_sessions', 'view_reports'];
      } else if (role === 'parent') {
        name = name || 'Mr. Rajesh Kumar';
        permissions = ['view_child_progress', 'view_child_attendance', 'view_child_performance'];
      } else {
        name = name || 'Ananya Sharma';
      }
      
      return {
        token: DUMMY_TOKEN,
        role,
        user: {
          ...DUMMY_USER,
          name,
          fullName: name,
          email: formData.email,
          role,
          permissions,
          studentId: role === 'student' ? (formData.studentId || '24A103') : undefined,
        },
      };
    }
  },

  forgotPassword: async (email) => {
    const res = await authApi.forgotPassword(email);
    return res;
  },

  resetPassword: async (token, newPassword) => {
    const res = await authApi.resetPassword(token, newPassword);
    return res;
  },

  getMe: async () => {
    try {
      const data = await authApi.getMe();
      const roleStr = (data.role || 'STUDENT').toString().toLowerCase().replace('role_', '');
      return {
        id: data.id,
        email: data.email,
        fullName: data.fullName,
        name: data.fullName,
        role: roleStr,
      };
    } catch {
      const storedUser = localStorage.getItem('edupath_user');
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch {}
      }
      return DUMMY_USER;
    }
  },
};

export default authService;