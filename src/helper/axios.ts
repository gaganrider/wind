import axios from 'axios';
import type { AxiosRequestConfig, AxiosError } from 'axios';

// Base API URL - Update this with your actual API URL
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// ----------------------------------------------------------------------

// Create axios instance with secure cookie credentials
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Important: This allows cookies to be sent with requests
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor - Handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response && error.response.status === 401) {
      // Redirect to login page
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.href = '/login';
      }
    }

    return Promise.reject((error.response && error.response.data) || 'Something went wrong!');
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

// Fetcher utility for SWR or data fetching
export const fetcher = async (args: string | [string, AxiosRequestConfig?]): Promise<unknown> => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

// API Endpoints
export const endpoints = {
  // Authentication
  auth: {
    me: '/auth/verify-session',
    signIn: '/auth/login',
    signUp: '/auth/register',
    signOut: '/auth/logout',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
  },

  // User
  user: {
    profile: '/user/profile',
    updateProfile: '/user/profile',
    changePassword: '/user/change-password',
    uploadAvatar: '/user/avatar',
  },

  // Connections (Social Media)
  connections: {
    getUrl: (platform: string) => `/connections/getUrl/${platform}`,
    list: '/connections',
    create: '/connections',
    get: (id: string) => `/connections/${id}`,
    update: (id: string) => `/connections/${id}`,
    delete: (id: string) => `/connections/${id}`,
    authenticate: (platform: string) => `/connections/auth/${platform}`,
    callback: '/connections/callback',
    disconnect: (id: string) => `/connections/${id}/disconnect`,
  },
} as const;
