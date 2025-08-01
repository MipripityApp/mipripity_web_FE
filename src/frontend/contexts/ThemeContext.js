import React, { createContext, useState, useContext, useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';

// Convert brand colors to CSS format
// 0xFF000080 = #000080 (red with 50% opacity)
// 0xFFF39322 = #F39322 (orange)
const PRIMARY_COLOR = '#000080';
const SECONDARY_COLOR = '#F39322';

// Define theme object with brand colors and light/dark variations
const lightTheme = {
  primary: PRIMARY_COLOR,
  secondary: SECONDARY_COLOR,
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  error: '#D32F2F',
  success: '#388E3C',
  warning: '#FFC107',
  info: '#2196F3',
  isDark: false
};

const darkTheme = {
  primary: PRIMARY_COLOR,
  secondary: SECONDARY_COLOR,
  background: '#121212',
  surface: '#242424',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  border: '#424242',
  error: '#EF5350',
  success: '#4CAF50',
  warning: '#FFD54F',
  info: '#64B5F6',
  isDark: true
};

// Create global styles
const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    transition: all 0.3s ease;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.isDark ? '#2c2c2c' : '#f1f1f1'};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.isDark ? '#555' : '#ccc'};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.isDark ? '#666' : '#aaa'};
  }

  /* Futuristic focus styles */
  *:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.primary}, 
                0 0 0 4px rgba(255, 255, 255, 0.2);
  }
`;

// Create theme context
const ThemeContext = createContext();

// Custom hook for using theme
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Safely check if browser APIs are available
  const isBrowser = typeof window !== 'undefined';
  
  // Safely check for saved theme and dark mode preference
  const getSavedTheme = () => {
    try {
      if (isBrowser) {
        return localStorage.getItem('theme');
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
    return null;
  };
  
  const getPrefersDark = () => {
    try {
      if (isBrowser && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    } catch (error) {
      console.error('Error checking media query:', error);
    }
    return false;
  };
  
  const savedTheme = getSavedTheme();
  const prefersDark = getPrefersDark();
  
  // Initialize theme state
  const [isDarkMode, setIsDarkMode] = useState(
    savedTheme ? savedTheme === 'dark' : prefersDark
  );
  
  // Get current theme based on mode
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  // Toggle between light and dark modes
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    try {
      if (isBrowser) {
        localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
      }
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };
  
  // Listen for system theme changes
  useEffect(() => {
    if (!isBrowser || !window.matchMedia) return;
    
    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e) => {
        try {
          const savedTheme = localStorage.getItem('theme');
          if (savedTheme === null) {
            setIsDarkMode(e.matches);
          }
        } catch (error) {
          console.error('Error checking saved theme:', error);
        }
      };
      
      // Use the appropriate event listener method
      // (newer browsers use addEventListener, older ones use addListener)
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    } catch (error) {
      console.error('Error setting up media query listener:', error);
    }
  }, [isBrowser]);
  
  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      <GlobalStyle theme={theme} />
      {children}
    </ThemeContext.Provider>
  );
};