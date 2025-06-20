import axios from 'axios';

// Create a base axios instance with common configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Get token from local storage (browser only)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized (token expired)
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // In development, if dev bypass is active, suppress automatic redirect
      const devBypass = localStorage.getItem('devBypassAuth') === 'true';
      if (!devBypass) {
        // Clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/sign-in';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
