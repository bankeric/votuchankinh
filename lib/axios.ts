import axios from 'axios';
import Cookies from 'js-cookie';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('buddha-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeAuthToken();
      // Redirect to login page if we're on the client side
      const currentPath = window.location.pathname;
      if (typeof window !== 'undefined' && !currentPath.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth helper functions
export const setAuthToken = (token: string) => {
  // Set token in cookie with 7 days expiry
  Cookies.set('buddha-token', token, { expires: 7, secure: true, sameSite: 'strict' });
  // Also set it in axios default headers
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeAuthToken = () => {
  // Remove token from cookie
  Cookies.remove('buddha-token');
  // Remove from axios default headers
  delete axiosInstance.defaults.headers.common['Authorization'];
};

export const getAuthToken = () => {
  return Cookies.get('buddha-token');
};


export default axiosInstance; 