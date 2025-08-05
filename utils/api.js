import axios from 'axios';

/**
 * API configuration utility
 * 
 * This utility configures axios for API requests to the backend.
 * Uses the absolute Render URL for production with proper CORS support.
 * Implements JWT-based authentication for user management.
 */

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Base URL for API requests
// Use relative URL in development, absolute URL in production
const isLocalDev = isBrowser && window.location.hostname === 'localhost';
const RENDER_URL = isLocalDev ? '' : 'https://mipripity-web.onrender.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: RENDER_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
});

// Helper function to get the stored JWT token (internal use)
const _getToken = () => {
  if (isBrowser) {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Request interceptor: attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = _getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log API calls in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor: handle common error cases
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          console.error('Unauthorized - user not authenticated');
          // Redirect to login page if not already there
          if (!isCurrentPath('/login')) {
            navigateTo('/login');
          }
          break;
        case 403:
          console.error('Access forbidden');
          break;
        case 404:
          console.error('Resource not found:', error.config?.url);
          break;
        case 500:
          console.error('Server error:', data?.message || 'Internal server error');
          break;
        default:
          console.error(`API request failed with status ${status}:`, data?.message || error.message);
      }
    } else if (error.request) {
      // Network error - no response received
      console.error('Network error - no response received from server');
      if (!isLocalDev) {
        console.error('Check if the backend server is running at:', RENDER_URL);
      } else {
        console.error('Check if the local backend server is running');
      }
    } else {
      // Error in request setup
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Helper function to navigate safely
const navigateTo = (path) => {
  try {
    if (isBrowser && window.location) {
      window.location.href = path;
    }
  } catch (error) {
    console.error('Error navigating:', error);
  }
};

// Helper function to check current path
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

// API Service Methods
export const apiService = {
  // Health check
  async healthCheck() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  // Authentication using JWT
  auth: {
    // Register a new user
    async register(userData) {
      try {
        const { email, password, firstName, lastName, phoneNumber } = userData;
        
        // Register with backend
        const response = await api.post('/api/auth/register', {
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber
        });
        
        const { token, user } = response.data.data;
        
        // Save token
        setAuthToken(token);
        
        return { user };
      } catch (error) {
        console.error('Registration failed:', error);
        throw error;
      }
    },

    // Login user
    async login(credentials) {
      try {
        const { email, password } = credentials;
        
        // Login with backend
        const response = await api.post('/api/auth/login', { 
          email, 
          password 
        });
        
        const { token, user } = response.data.data;
        
        // Save token
        setAuthToken(token);
        
        return { user };
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },

    // Logout user
    async logout() {
      try {
        // Remove token
        setAuthToken(null);
      } catch (error) {
        console.error('Logout failed:', error);
        throw error;
      }
    },

    // Get current user from backend
    async getCurrentUser() {
      try {
        const token = _getToken();
        
        if (!token) {
          return null;
        }
        
        // Get user profile from backend
        const response = await api.get('/api/auth/me');
        return {
          user: response.data.data.user
        };
      } catch (error) {
        console.error('Error getting current user:', error);
        
        // If unauthorized, clear token
        if (error.response?.status === 401) {
          setAuthToken(null);
        }
        
        return null;
      }
    }
  },

  // Categories
  categories: {
    async getAll() {
      try {
        const response = await api.get('/api/categories');
        return response.data;
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        throw error;
      }
    },
    
    async getById(id) {
      try {
        const response = await api.get(`/api/categories/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to fetch category ${id}:`, error);
        throw error;
      }
    }
  },
  
  // Vote Options
  voteOptions: {
    async getAll() {
      try {
        const response = await api.get('/api/vote_options');
        return response.data;
      } catch (error) {
        console.error('Failed to fetch vote options:', error);
        throw error;
      }
    },
    
    async getByCategory(categoryId) {
      try {
        const response = await api.get(`/api/vote_options/category/${categoryId}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to fetch vote options for category ${categoryId}:`, error);
        throw error;
      }
    }
  },

  // Users
  users: {
    async getAll(params = {}) {
      try {
        const { limit = 100, offset = 0 } = params;
        const response = await api.get(`/api/users?limit=${limit}&offset=${offset}`);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch users:', error);
        throw error;
      }
    },

    async getById(id) {
      try {
        const response = await api.get(`/api/users/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to fetch user ${id}:`, error);
        throw error;
      }
    },

    async update(id, userData) {
      try {
        const response = await api.put(`/api/users/${id}`, userData);
        return response.data;
      } catch (error) {
        console.error(`Failed to update user ${id}:`, error);
        throw error;
      }
    },

    async getUserProperties(id, params = {}) {
      try {
        const { limit = 10, offset = 0 } = params;
        const response = await api.get(`/api/properties?user_id=${id}&limit=${limit}&offset=${offset}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to fetch properties for user ${id}:`, error);
        throw error;
      }
    },

    async getUserVotes(id) {
      try {
        const response = await api.get(`/api/votes/user/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to fetch votes for user ${id}:`, error);
        throw error;
      }
    }
  },

  // Properties
  properties: {
    async getAll(params = {}) {
      try {
        const queryString = new URLSearchParams(params).toString();
        const response = await api.get(`/api/properties?${queryString}`);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch properties:', error);
        throw error;
      }
    },

    async getById(id) {
      try {
        const response = await api.get(`/api/properties/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to fetch property ${id}:`, error);
        throw error;
      }
    },

    async create(propertyData) {
      try {
        const response = await api.post('/api/properties', propertyData);
        return response.data;
      } catch (error) {
        console.error('Failed to create property:', error);
        throw error;
      }
    },

    async update(id, propertyData) {
      try {
        const response = await api.put(`/api/properties/${id}`, propertyData);
        return response.data;
      } catch (error) {
        console.error(`Failed to update property ${id}:`, error);
        throw error;
      }
    },

    async delete(id) {
      try {
        const response = await api.delete(`/api/properties/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to delete property ${id}:`, error);
        throw error;
      }
    },

    async getPropertyStats(id) {
      try {
        const response = await api.get(`/api/properties/${id}/stats`);
        return response.data;
      } catch (error) {
        console.error(`Failed to fetch stats for property ${id}:`, error);
        throw error;
      }
    },
    
    async uploadImage(propertyId, imageFile, isPrimary = false) {
      try {
        // Create form data for file upload
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('property_id', propertyId);
        formData.append('is_primary', isPrimary);
        formData.append('alt_text', imageFile.name);
        
        // Upload the file to the backend
        const uploadResponse = await api.post('/api/property_images/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Get the image URL from the response
        const imageUrl = uploadResponse.data.data.image_url;
        
        // Save the image URL to the backend
        const saveResponse = await api.post('/api/property_images', {
          property_id: propertyId,
          image_url: imageUrl,
          alt_text: imageFile.name,
          is_primary: isPrimary
        });
        
        return saveResponse.data;
      } catch (error) {
        console.error(`Failed to upload image for property ${propertyId}:`, error);
        throw error;
      }
    }
  },

  // Votes
  votes: {
    async create(voteData) {
      try {
        const response = await api.post('/api/votes', voteData);
        return response.data;
      } catch (error) {
        console.error('Failed to create vote:', error);
        throw error;
      }
    },

    async getAll(params = {}) {
      try {
        const queryString = new URLSearchParams(params).toString();
        const response = await api.get(`/api/votes?${queryString}`);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch votes:', error);
        throw error;
      }
    },
    
    async getByProperty(propertyId) {
      try {
        const response = await api.get(`/api/votes/property/${propertyId}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to fetch votes for property ${propertyId}:`, error);
        throw error;
      }
    }
  },
  
  // Property Images
  propertyImages: {
    async getByProperty(propertyId) {
      try {
        const response = await api.get(`/api/property_images/property/${propertyId}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to fetch images for property ${propertyId}:`, error);
        throw error;
      }
    },
    
    async delete(imageId) {
      try {
        const response = await api.delete(`/api/property_images/${imageId}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to delete image ${imageId}:`, error);
        throw error;
      }
    },
    
    async setPrimary(imageId) {
      try {
        const response = await api.patch(`/api/property_images/${imageId}`, {
          is_primary: true
        });
        return response.data;
      } catch (error) {
        console.error(`Failed to set image ${imageId} as primary:`, error);
        throw error;
      }
    }
  },
  
  // Platform statistics
  stats: {
    async getPlatformStats() {
      try {
        const response = await api.get('/api/stats');
        return response.data;
      } catch (error) {
        console.error('Failed to fetch platform statistics:', error);
        throw error;
      }
    }
  }
};

// Helper functions for generating URLs
export const getApiUrl = (endpoint = '') => 
  endpoint ? `${RENDER_URL}/api/${endpoint}` : RENDER_URL;

// Export utilities for direct API access
export const getAuthToken = () => localStorage.getItem('authToken');
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
  }
};

// Default export
export default api;