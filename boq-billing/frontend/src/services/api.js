import axios from 'axios';

// Create axios instance with base URL and default headers
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://0.0.0.0:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication (temporarily disabled)
API.interceptors.request.use(
  (config) => {
    // Authentication temporarily disabled for development
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling (temporarily disabled redirect)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (temporarily disabled)
    // if (error.response && error.response.status === 401) {
    //   localStorage.removeItem('token');
    //   localStorage.removeItem('user');
    //   window.location.href = '/login';
    // }
    return Promise.reject(error);
  }
);

export default API;