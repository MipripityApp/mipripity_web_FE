import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

// Initialize Firebase conditionally
let auth = null;
let firebaseInitialized = false;
let firebaseFunctions = {};

try {
  // Only import Firebase if we're in a browser environment
  if (typeof window !== 'undefined') {
    // Check if all required Firebase config variables are present
    const firebaseConfig = {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID
    };
    
    // Only initialize if we have the API key at minimum
    if (firebaseConfig.apiKey) {
      const { initializeApp } = require('firebase/app');
      const { 
        getAuth, 
        createUserWithEmailAndPassword, 
        signInWithEmailAndPassword, 
        signOut, 
        onAuthStateChanged,
        updateProfile,
        sendPasswordResetEmail
      } = require('firebase/auth');

      // Store Firebase functions for later use
      firebaseFunctions = {
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        signOut,
        onAuthStateChanged,
        updateProfile,
        sendPasswordResetEmail
      };
      
      const app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      firebaseInitialized = true;
      console.log('Firebase initialized successfully');
    } else {
      console.warn('Firebase configuration is missing. Using mock authentication.');
    }
  }
} catch (error) {
  console.warn('Failed to initialize Firebase. Using mock authentication.', error);
}

// Create mock implementations for development
const createMockUser = (email, firstName, lastName) => {
  return {
    uid: 'mock-uid-' + Math.random().toString(36).substring(2, 9),
    email,
    displayName: `${firstName} ${lastName}`,
    photoURL: null,
    getIdToken: () => Promise.resolve('mock-token')
  };
};

// Create context
const AuthContext = createContext();

// Custom hook for using auth
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false); // Start with false if Firebase isn't initialized
  const [error, setError] = useState(null);
  
  // Set initial loading state based on Firebase initialization
  useEffect(() => {
    setLoading(firebaseInitialized);
  }, []);

  // Register new user
  const register = async (email, password, firstName, lastName, phoneNumber = null) => {
    try {
      setError(null);
      
      if (firebaseInitialized) {
        // Create user in Firebase
        const userCredential = await firebaseFunctions.createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Update Firebase profile
        await firebaseFunctions.updateProfile(user, {
          displayName: `${firstName} ${lastName}`
        });
        
        // Register user in our backend
        try {
          const response = await api.post('/auth/register', {
            firebase_uid: user.uid,
            email,
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber
          });
          
          setUserData(response.data.user);
          return response.data.user;
        } catch (apiError) {
          console.warn('Backend registration failed, but Firebase auth succeeded:', apiError);
          // Return basic user data even if backend fails
          const userData = {
            id: user.uid,
            email: user.email,
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`
          };
          setUserData(userData);
          return userData;
        }
      } else {
        // Mock implementation for development
        console.log('Using mock register:', email, firstName, lastName);
        const mockUser = createMockUser(email, firstName, lastName);
        setCurrentUser(mockUser);
        
        // Create mock user data
        const userData = {
          id: mockUser.uid,
          email,
          firstName,
          lastName,
          fullName: `${firstName} ${lastName}`,
          phoneNumber: phoneNumber || ''
        };
        
        setUserData(userData);
        return userData;
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };
  
  // Login user
  const login = async (email, password) => {
    try {
      setError(null);
      
      if (firebaseInitialized) {
        // Sign in with Firebase
        const userCredential = await firebaseFunctions.signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Get ID token
        const token = await user.getIdToken();
        
        // Login to our backend
        try {
          const response = await api.post('/auth/login', { token });
          setUserData(response.data.user);
          return response.data.user;
        } catch (apiError) {
          console.warn('Backend login failed, but Firebase auth succeeded:', apiError);
          // Return basic user data even if backend fails
          const userData = {
            id: user.uid,
            email: user.email,
            firstName: user.displayName ? user.displayName.split(' ')[0] : '',
            lastName: user.displayName ? user.displayName.split(' ')[1] : '',
            fullName: user.displayName || ''
          };
          setUserData(userData);
          return userData;
        }
      } else {
        // Mock implementation for development
        console.log('Using mock login:', email);
        const mockUser = createMockUser(email, 'Mock', 'User');
        setCurrentUser(mockUser);
        
        // Create mock user data
        const userData = {
          id: mockUser.uid,
          email,
          firstName: 'Mock',
          lastName: 'User',
          fullName: 'Mock User'
        };
        
        setUserData(userData);
        return userData;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };
  
  // Logout user
  const logout = async () => {
    try {
      if (firebaseInitialized) {
        await firebaseFunctions.signOut(auth);
      }
      
      // Always clear user state regardless of Firebase status
      setCurrentUser(null);
      setUserData(null);
      console.log('User logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
      throw err;
    }
  };
  
  // Profile update function moved below
  
  // Reset password
  const resetPassword = async (email) => {
    try {
      setError(null);
      
      if (firebaseInitialized) {
        await firebaseFunctions.sendPasswordResetEmail(auth, email);
        console.log('Password reset email sent to:', email);
      } else {
        // Mock implementation for development
        console.log('Mock password reset for:', email);
        // Simply log the action in development
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err.message);
      throw err;
    }
  };
  
  // Update user profile
  const updateProfile = async (data) => {
    try {
      setError(null);
      
      if (!currentUser && !firebaseInitialized) {
        // In development mode, allow profile updates without being logged in
        console.log('Mock profile update:', data);
        const updatedData = { ...userData, ...data };
        setUserData(updatedData);
        return updatedData;
      } else if (!currentUser) {
        throw new Error('No authenticated user');
      }
      
      if (firebaseInitialized) {
        // Try to update backend profile
        try {
          const response = await api.put('/auth/update-profile', data);
          setUserData(response.data.user);
          return response.data.user;
        } catch (apiError) {
          console.warn('Backend profile update failed:', apiError);
          // Update local state anyway
          const updatedData = { ...userData, ...data };
          setUserData(updatedData);
          return updatedData;
        }
      } else {
        // Mock implementation for development
        const updatedData = { ...userData, ...data };
        setUserData(updatedData);
        return updatedData;
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };
  
  // Get current user data from backend
  const refreshUserData = async () => {
    try {
      if (!currentUser && !firebaseInitialized) {
        // In development mode without Firebase, just return current userData
        return userData;
      } else if (!currentUser) {
        return null;
      }
      
      if (firebaseInitialized) {
        try {
          // The api utility handles auth headers automatically
          const response = await api.get('/auth/me');
          setUserData(response.data.user);
          return response.data.user;
        } catch (apiError) {
          console.warn('Failed to get user data from backend:', apiError);
          // Return current userData if backend fails
          return userData;
        }
      } else {
        // Mock implementation for development
        return userData;
      }
    } catch (err) {
      console.error('Error getting user data:', err);
      setError(err.response?.data?.message || err.message);
      return userData;
    }
  };
  
  // Listen for Firebase auth state changes
  useEffect(() => {
    if (!firebaseInitialized) {
      setLoading(false);
      return () => {};
    }
    
    const unsubscribe = firebaseFunctions.onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          await refreshUserData();
        } catch (err) {
          console.error('Error loading user data:', err);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);
  
  const value = {
    currentUser,
    userData,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    resetPassword,
    refreshUserData
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};