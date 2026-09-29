import axios from 'axios';

const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'http://localhost:8081';
const EDUPATH_URL = import.meta.env.VITE_EDUPATH_URL || 'http://localhost:8080';
const CAREER_URL = import.meta.env.VITE_CAREER_URL || 'http://localhost:8083';
const COURSE_URL = import.meta.env.VITE_COURSE_URL || 'http://localhost:8082';
const AI_URL = import.meta.env.VITE_AI_URL || 'http://localhost:8084';

export const API_URLS = {
  auth: AUTH_URL,
  edupath: EDUPATH_URL,
  career: CAREER_URL,
  course: COURSE_URL,
  ai: AI_URL,
};

const PUBLIC_AUTH_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh-token',
  '/auth/change-password',
  '/auth/forgot-password',
  '/auth/reset-password',
];

const isPublicEndpoint = (url) => {
  if (!url) return false;
  return PUBLIC_AUTH_ENDPOINTS.some((ep) => url.includes(ep));
};

const isExpiredTokenError = (error) => {
  const msg = (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    ''
  ).toLowerCase();
  return (
    msg.includes('expired') ||
    msg.includes('jwt expired') ||
    msg.includes('token expired') ||
    msg.includes('invalid token')
  );
};

const clearAuthStorage = () => {
  localStorage.removeItem('edupath_token');
  localStorage.removeItem('edupath_user');
  localStorage.removeItem('edupath_role');
  localStorage.removeItem('edupath_permissions');
};

const createApiClient = (baseURL) => {
  const instance = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Attach JWT from localStorage on every request EXCEPT public auth endpoints
  instance.interceptors.request.use(
    (config) => {
      const url = config.url || '';
      if (isPublicEndpoint(url)) {
        delete config.headers.Authorization;
      } else {
        const token = localStorage.getItem('edupath_token');
        if (token && token !== 'dummy_jwt_token_edupath_2025') {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor for Error Handling (401, 403, 404, 400, 500)
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response?.status;
      const originalRequest = error.config;
      const currentRole = localStorage.getItem('edupath_role') || 'Unknown';
      const url = originalRequest?.url || 'Unknown Endpoint';

      if (status === 401) {
        // Unauthenticated / Expired token handling
        const storedToken = localStorage.getItem('edupath_token');
        if (storedToken && !originalRequest._retry && !isPublicEndpoint(url)) {
          originalRequest._retry = true;
          try {
            const refreshRes = await axios.post(`${AUTH_URL}/auth/refresh-token`, {
              token: storedToken,
            });
            if (refreshRes.data?.token) {
              const newToken = refreshRes.data.token;
              localStorage.setItem('edupath_token', newToken);
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return instance(originalRequest);
            }
          } catch (refreshErr) {
            console.warn('[API Auth] Refresh token attempt failed:', refreshErr);
          }
        }
        clearAuthStorage();
        sessionStorage.setItem('edupath_auth_message', 'Your session has expired. Please sign in again.');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } else if (status === 403) {
        if (isExpiredTokenError(error)) {
          // Token expired on 403 response
          clearAuthStorage();
          sessionStorage.setItem('edupath_auth_message', 'Your session has expired. Please sign in again.');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        } else {
          // Insufficient permissions / Forbidden (NOT token expiration)
          const tokenPresent = !!localStorage.getItem('edupath_token');
          console.error(
            `[API 403 Forbidden Mismatch Report]\n` +
            `Endpoint: ${url}\n` +
            `Current User Role: ${currentRole}\n` +
            `JWT Attached: ${tokenPresent}\n` +
            `Message: ${error.response?.data?.message || 'Access Denied / Insufficient Permissions'}`
          );
        }
      }

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'An unexpected server error occurred.';
      return Promise.reject(new Error(errorMessage));
    }
  );

  return instance;
};

export const authApiClient = createApiClient(AUTH_URL);
export const edupathApiClient = createApiClient(EDUPATH_URL);
export const careerApiClient = createApiClient(CAREER_URL);
export const courseApiClient = createApiClient(COURSE_URL);
export const aiApiClient = createApiClient(AI_URL);
