import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles.css';

// Error boundary component to catch rendering errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          margin: '20px', 
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          backgroundColor: '#f8d7da', 
          color: '#721c24' 
        }}>
          <h1>Something went wrong.</h1>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Show error details</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Function to initialize the React application
function initializeApp() {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    console.error('Could not find root element. Make sure there is a div with id="root" in your HTML.');
    return;
  }

  try {
    const root = createRoot(rootElement);

    root.render(
      <ErrorBoundary>
        <React.StrictMode>
          <BrowserRouter>
            <AuthProvider>
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </AuthProvider>
          </BrowserRouter>
        </React.StrictMode>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Error initializing React application:', error);
    
    // Fallback rendering in case of error
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; margin: 20px; border: 1px solid #f5c6cb; border-radius: 4px; background-color: #f8d7da; color: #721c24;">
          <h1>Failed to initialize the application</h1>
          <p>Error: ${error.message}</p>
          <p>Please check the console for more details.</p>
        </div>
      `;
    }
  }
}

// Initialize the application
initializeApp();