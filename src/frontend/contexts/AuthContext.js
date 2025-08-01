import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import api from '../utils/api';

// Firebase configuration with actual values
const firebaseConfig = {
  apiKey: "AIzaSyCRAe_sI2Hawm9Vh70iWYhoO8nr38i_iWk",
  authDomain: "mipripityweb.firebaseapp.com",
  projectId: "mipripityweb",
  storageBucket: "mipripityweb.firebasestorage.app",
  messagingSenderId: "154891459103",
  appId: "1:154891459103:web:122abe66be18f5e794532a",
  measurementId: "G-LBDX7NP8P0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Create context
const AuthContext = createContext();

// Custom hook for using auth
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Register new user
  const register = async (email, password, firstName, lastName, phoneNumber = null) => {
    try {
      setError(null);
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update Firebase profile
      await firebaseUpdateProfile(user, {
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
    try {
      setError(null);
      // Sign in with Firebase
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
    try {
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
    try {
      setError(null);
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