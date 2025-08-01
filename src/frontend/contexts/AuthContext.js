import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

// Initialize Firebase conditionally
let auth = null;
let firebaseInitialized = false;

try {
  // Only import Firebase if we're in a browser environment
  if (typeof window !== 'undefined') {
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
      const app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      firebaseInitialized = true;
      console.log('Firebase initialized successfully');
    } else {
      console.warn('Firebase configuration is missing. Authentication features will be disabled.');
    }
  }
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
}

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
    if (!firebaseInitialized) {
      setError('Authentication is not available');
      throw new Error('Authentication is not available');
    }
    
    try {
      setError(null);
      // Create user in Firebase
      const { createUserWithEmailAndPassword, updateProfile } = require('firebase/auth');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update Firebase profile
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });
      
      // Register user in our backend
      const response = await api.post('/auth/register', {
        firebase_uid: user.uid,
        email,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber
      });
      
      setUserData(response.data.user);
      return response.data.user;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };
  
  // Login user
  const login = async (email, password) => {
    if (!firebaseInitialized) {
      setError('Authentication is not available');
      throw new Error('Authentication is not available');
    }
    
    try {
      setError(null);
      // Sign in with Firebase
      const { signInWithEmailAndPassword } = require('firebase/auth');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get ID token
      const token = await user.getIdToken();
      
      // Login to our backend
      const response = await api.post('/auth/login', { token });
      
      setUserData(response.data.user);
      return response.data.user;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };
  
  // Logout user
  const logout = async () => {
    if (!firebaseInitialized) {
      setError('Authentication is not available');
      throw new Error('Authentication is not available');
    }
    
    try {
      const { signOut } = require('firebase/auth');
      await signOut(auth);
      setUserData(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
      throw err;
    }
  };
  
  // Update user profile
  const updateProfile = async (data) => {
    try {
      setError(null);
      
      if (!currentUser) {
        throw new Error('No authenticated user');
      }
      
      // Update backend profile
      const response = await api.put('/auth/update-profile', data);
      
      // Update local state
      setUserData(response.data.user);
      
      return response.data.user;
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };
  
  // Reset password
  const resetPassword = async (email) => {
    if (!firebaseInitialized) {
      setError('Authentication is not available');
      throw new Error('Authentication is not available');
    }
    
    try {
      setError(null);
      const { sendPasswordResetEmail } = require('firebase/auth');
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err.message);
      throw err;
    }
  };
  
  // Get current user data from backend
  const refreshUserData = async () => {
    try {
      if (!currentUser) return null;
      
      // The api utility handles auth headers automatically
      const response = await api.get('/auth/me');
      
      setUserData(response.data.user);
      return response.data.user;
    } catch (err) {
      console.error('Error getting user data:', err);
      setError(err.response?.data?.message || err.message);
      return null;
    }
  };
  
  // Token management is now handled by the api utility
  
  // Listen for Firebase auth state changes
  useEffect(() => {
    if (!firebaseInitialized) {
      setLoading(false);
      return () => {};
    }
    
    const { onAuthStateChanged } = require('firebase/auth');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
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