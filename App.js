import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { ToastProvider } from './contexts/ToastContext';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';
import TestComponent from './TestComponent'; // Import TestComponent for debugging

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import Loader from './components/common/Loader';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/auth/ProfilePage'));
const PropertiesPage = lazy(() => import('./pages/properties/PropertiesPage'));
const PropertyDetailsPage = lazy(() => import('./pages/properties/PropertyDetailsPage'));
const AddPropertyPage = lazy(() => import('./pages/properties/AddPropertyPage'));
const EditPropertyPage = lazy(() => import('./pages/properties/EditPropertyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Styled components for layout
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
`;

const MainContent = styled.main`
  display: flex;
  flex: 1;
  padding: 0;
  position: relative;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  margin-left: ${props => (props.sidebarOpen ? '250px' : '0')};
  transition: margin-left 0.3s ease;
  width: 100%;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 15px;
  }
`;

// Private route component
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <Loader size="large" />;
  }

  return currentUser ? children : <Navigate to="/login" />;
};

// Main App component
const App = () => {
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = React.useState(window.innerWidth > 768);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar on small screens when navigating
  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  // Handle window resize
  React.useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <AppContainer>
          <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

          <MainContent>
            <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebarOnMobile} />

            <ContentArea sidebarOpen={sidebarOpen}>
              {/* Test component to verify React rendering */}
              <TestComponent />
              
              <Suspense fallback={<Loader size="large" />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/properties" element={<PropertiesPage />} />
                  <Route path="/properties/:id" element={<PropertyDetailsPage />} />

                  {/* Protected routes */}
                  <Route 
                    path="/profile" 
                    element={
                      <PrivateRoute>
                        <ProfilePage />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/properties/add" 
                    element={
                      <PrivateRoute>
                        <AddPropertyPage />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/properties/edit/:id" 
                    element={
                      <PrivateRoute>
                        <EditPropertyPage />
                      </PrivateRoute>
                    } 
                  />

                  {/* Catch-all route */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </ContentArea>
          </MainContent>

          <Footer />
        </AppContainer>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;