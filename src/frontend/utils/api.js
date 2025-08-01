import axios from 'axios';

/**
 * API configuration utility
 * 
 * This utility configures axios for API requests to the backend.
 * In development, it uses relative paths that are proxied by webpack.
 * In production, it can use the absolute Render URL if needed.
 */

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Base URL for API requests
// In development, webpack proxies '/api' to localhost:3000
// In production, '/api' will be handled by the same server serving the static files
const API_URL = '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to safely get auth token
const getAuthToken = () => {
  try {
    if (isBrowser && localStorage) {
      return localStorage.getItem('authToken');
    }
  } catch (error) {
    console.error('Error accessing localStorage:', error);
  }
  return null;
};

// Add request interceptor to include authentication token
api.interceptors.request.use(
  async (config) => {
    // Get token from localStorage if available
    const token = getAuthToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper function to safely navigate
const navigateTo = (path) => {
  try {
    if (isBrowser && window.location) {
      window.location.href = path;
    }
  } catch (error) {
    console.error('Error navigating:', error);
  }
};

// Helper function to safely check current path
const isCurrentPath = (path) => {
  try {
    if (isBrowser && window.location) {
      return window.location.pathname === path;
    }
  } catch (error) {
    console.error('Error checking path:', error);
  }
  return false;
};

// Helper function to safely remove auth token
const removeAuthToken = () => {
  try {
    if (isBrowser && localStorage) {
      localStorage.removeItem('authToken');
    }
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific HTTP errors
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          removeAuthToken();
          if (!isCurrentPath('/login')) {
            navigateTo('/login');
          }
          break;
          
        case 403:
          // Forbidden
          console.error('Access forbidden');
          break;
          
        case 404:
          // Not found
          console.error('Resource not found');
          break;
          
        case 500:
          // Server error
          console.error('Server error');
          break;
          
        default:
          // Other errors
          console.error('API request failed');
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('No response received from server');
    } else {
      // Error in setting up request
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;