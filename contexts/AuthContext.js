import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

// Create context
const AuthContext = createContext();

// Custom hook for using auth
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize by checking for existing token
  useEffect(() => {
    const checkToken = async () => {
      const savedToken = localStorage.getItem('authToken');
      if (savedToken) {
        try {
          // Set the token in the API client
          api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
          setToken(savedToken);
          
          // Fetch user data
          await refreshUserData();
        } catch (err) {
          console.error('Error loading user data:', err);
          // Clear invalid token
          localStorage.removeItem('authToken');
          setToken(null);
          setUserData(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    checkToken();
  }, []);

  // Register new user with JWT authentication
  const register = async (email, password, firstName, lastName, phoneNumber = null) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await api.post('/auth/register', {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber
      });
      
      const { token, user } = response.data.data;
      
      // Save token to localStorage
      localStorage.setItem('authToken', token);
      
      // Set token in API client
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setToken(token);
      setUserData(user);
      
      return user;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Login user with JWT authentication
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await api.post('/auth/login', { 
        email, 
        password 
      });
      
      const { token, user } = response.data.data;
      
      // Save token to localStorage
      localStorage.setItem('authToken', token);
      
      // Set token in API client
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setToken(token);
      setUserData(user);
      
      return user;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout user
  const logout = async () => {
    try {
      setError(null);
      
      // Remove token from localStorage
      localStorage.removeItem('authToken');
      
      // Remove token from API client
      delete api.defaults.headers.common['Authorization'];
      
      setToken(null);
      setUserData(null);
      
      console.log('User logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
      throw err;
    }
  };
  
  // Profile update function follows
  
  // Update user profile
  const updateProfile = async (data) => {
    try {
      setError(null);
      
      if (!token || !userData) {
        throw new Error('No authenticated user');
      }
      
      // Update backend profile
      const response = await api.put(`/users/${userData.id}`, data);
      const updatedUser = response.data.data;
      
      setUserData(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };
  
  // Get current user data from backend
  const refreshUserData = async () => {
    try {
      if (!token) {
        return null;
      }
      
      // Get user data from backend
      const response = await api.get('/auth/me');
      const user = response.data.data.user;
      
      setUserData(user);
      return user;
    } catch (err) {
      console.error('Error getting user data:', err);
      setError(err.response?.data?.message || err.message);
      
      // If unauthorized, clear token
      if (err.response?.status === 401) {
        localStorage.removeItem('authToken');
        delete api.defaults.headers.common['Authorization'];
        setToken(null);
        setUserData(null);
      }
      
      return null;
    }
  };
  
  // Reset password (simplified version)
  const resetPassword = async (email) => {
    try {
      setError(null);
      
      // In a real app, this would send a password reset email
      console.log('Password reset requested for:', email);
      
      // This is a placeholder since we don't have real email functionality
      return { success: true, message: 'Password reset instructions sent' };
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err.message);
      throw err;
    }
  };
  
  const value = {
    userData,
    loading,
    error,
    isAuthenticated: !!token,
    register,
    login,
    logout,
    updateProfile,
    resetPassword,
    refreshUserData,
    token
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};