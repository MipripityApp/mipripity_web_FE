import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaInfoCircle, 
  FaExclamationTriangle,
  FaTimes
} from 'react-icons/fa';

// Generate a unique ID for each toast
const generateId = () => `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Animation keyframes
const slideIn = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideOut = keyframes`
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(100%); opacity: 0; }
`;

// Styled components
const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 350px;
  
  @media (max-width: 480px) {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: calc(100% - 20px);
  }
`;

const ToastItem = styled.div`
  display: flex;
  align-items: flex-start;
  background-color: ${props => {
    switch (props.type) {
      case 'success': return props.theme.isDark ? 'rgba(46, 125, 50, 0.9)' : 'rgba(46, 125, 50, 0.95)';
      case 'error': return props.theme.isDark ? 'rgba(211, 47, 47, 0.9)' : 'rgba(211, 47, 47, 0.95)';
      case 'warning': return props.theme.isDark ? 'rgba(237, 108, 2, 0.9)' : 'rgba(237, 108, 2, 0.95)';
      case 'info': return props.theme.isDark ? 'rgba(2, 136, 209, 0.9)' : 'rgba(2, 136, 209, 0.95)';
      default: return props.theme.isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(66, 66, 66, 0.95)';
    }
  }};
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 100%;
  backdrop-filter: blur(5px);
  animation: ${props => props.isExiting ? slideOut : slideIn} 0.3s ease-out;
  
  ${props => props.variant === 'glass' && css`
    background-color: ${props => {
      switch (props.type) {
        case 'success': return props.theme.isDark ? 'rgba(46, 125, 50, 0.7)' : 'rgba(46, 125, 50, 0.8)';
        case 'error': return props.theme.isDark ? 'rgba(211, 47, 47, 0.7)' : 'rgba(211, 47, 47, 0.8)';
        case 'warning': return props.theme.isDark ? 'rgba(237, 108, 2, 0.7)' : 'rgba(237, 108, 2, 0.8)';
        case 'info': return props.theme.isDark ? 'rgba(2, 136, 209, 0.7)' : 'rgba(2, 136, 209, 0.8)';
        default: return props.theme.isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(66, 66, 66, 0.8)';
      }
    }};
  `}
`;

const IconContainer = styled.div`
  margin-right: 12px;
  font-size: 20px;
  display: flex;
  align-items: center;
`;

const ContentContainer = styled.div`
  flex: 1;
`;

const ToastTitle = styled.div`
  font-weight: 600;
  margin-bottom: ${props => props.hasMessage ? '4px' : '0'};
`;

const ToastMessage = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  opacity: 0.7;
  cursor: pointer;
  padding: 4px;
  margin-left: 8px;
  display: flex;
  align-items: center;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 1;
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.5);
  width: ${props => props.progress}%;
  border-radius: 0 0 0 8px;
  transition: width 0.1s linear;
`;

// Create context
const ToastContext = createContext();

// Toast types and their icons
const toastIcons = {
  success: <FaCheckCircle />,
  error: <FaExclamationCircle />,
  warning: <FaExclamationTriangle />,
  info: <FaInfoCircle />
};

/**
 * Toast Provider Component
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  
  // Add toast
  const addToast = useCallback((options) => {
    const id = generateId();
    const toast = {
      id,
      type: options.type || 'info',
      title: options.title || '',
      message: options.message || '',
      duration: options.duration || 5000, // Default 5 seconds
      variant: options.variant || 'default',
      isExiting: false,
      progress: 100 // For progress bar animation
    };
    
    setToasts(prev => [...prev, toast]);
    return id; // Return id for potential manual removal
  }, []);
  
  // Remove toast
  const removeToast = useCallback((id) => {
    // Mark as exiting for animation
    setToasts(prev => 
      prev.map(toast => 
        toast.id === id ? { ...toast, isExiting: true } : toast
      )
    );
    
    // Remove after animation completes
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 300);
  }, []);
  
  // Shorthand methods for different toast types
  const success = useCallback((options) => {
    return addToast({ ...options, type: 'success' });
  }, [addToast]);
  
  const error = useCallback((options) => {
    return addToast({ ...options, type: 'error' });
  }, [addToast]);
  
  const warning = useCallback((options) => {
    return addToast({ ...options, type: 'warning' });
  }, [addToast]);
  
  const info = useCallback((options) => {
    return addToast({ ...options, type: 'info' });
  }, [addToast]);
  
  // Handle automatic toast removal and progress bar
  useEffect(() => {
    if (toasts.length === 0) return;
    
    const intervals = {};
    const timeouts = {};
    
    toasts.forEach(toast => {
      if (toast.isExiting) return;
      
      // Update progress bar
      const updateInterval = 100; // Update every 100ms
      const steps = toast.duration / updateInterval;
      let currentStep = 0;
      
      intervals[toast.id] = setInterval(() => {
        currentStep++;
        const progress = 100 - (currentStep / steps * 100);
        
        setToasts(prev => 
          prev.map(t => 
            t.id === toast.id ? { ...t, progress: Math.max(progress, 0) } : t
          )
        );
        
        if (currentStep >= steps) {
          clearInterval(intervals[toast.id]);
        }
      }, updateInterval);
      
      // Set timeout for removal
      timeouts[toast.id] = setTimeout(() => {
        removeToast(toast.id);
      }, toast.duration);
    });
    
    // Cleanup
    return () => {
      Object.values(intervals).forEach(clearInterval);
      Object.values(timeouts).forEach(clearTimeout);
    };
  }, [toasts, removeToast]);
  
  // Render toasts
  const renderToasts = () => {
    return (
      <ToastContainer>
        {toasts.map(toast => (
          <ToastItem 
            key={toast.id}
            type={toast.type}
            isExiting={toast.isExiting}
            variant={toast.variant}
          >
            <IconContainer>
              {toastIcons[toast.type]}
            </IconContainer>
            
            <ContentContainer>
              {toast.title && (
                <ToastTitle hasMessage={!!toast.message}>
                  {toast.title}
                </ToastTitle>
              )}
              
              {toast.message && (
                <ToastMessage>
                  {toast.message}
                </ToastMessage>
              )}
            </ContentContainer>
            
            <CloseButton 
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
            >
              <FaTimes />
            </CloseButton>
            
            <ProgressBar progress={toast.progress} />
          </ToastItem>
        ))}
      </ToastContainer>
    );
  };
  
  // Context value
  const value = {
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };
  
  return (
    <ToastContext.Provider value={value}>
      {children}
      {renderToasts()}
    </ToastContext.Provider>
  );
};

/**
 * Hook to use toast functionality
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};

export default ToastContext;