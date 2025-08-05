import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { FaEnvelope, FaLock, FaSignInAlt, FaExclamationCircle } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 147, 34, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(255, 147, 34, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 147, 34, 0); }
`;

// Styled components
const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 2rem;
  animation: ${css`${fadeIn}`} 0.5s ease-out;
`;

const LoginCard = styled.div`
  background-color: ${props => props.theme.surface};
  border-radius: 10px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  width: 100%;
  max-width: 450px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  }
`;

const CardHeader = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  padding: 2rem;
  text-align: center;
  color: white;
`;

const CardTitle = styled.h1`
  margin: 0;
  font-weight: 600;
  font-size: 1.8rem;
`;

const CardSubtitle = styled.p`
  margin-top: 0.5rem;
  opacity: 0.9;
`;

const CardBody = styled.div`
  padding: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 1px solid ${props => props.hasError ? props.theme.error : props.theme.border};
  border-radius: 5px;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'white'};
  color: ${props => props.theme.text};
  transition: all 0.3s ease;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? props.theme.error : props.theme.secondary};
    box-shadow: 0 0 0 2px ${props => props.hasError ? 
      'rgba(211, 47, 47, 0.2)' : 
      'rgba(243, 147, 34, 0.2)'
    };
  }
  
  &::placeholder {
    color: ${props => props.theme.textSecondary};
    opacity: 0.7;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: ${props => props.hasError ? props.theme.error : props.theme.textSecondary};
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.error};
  font-size: 0.85rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SubmitButton = styled.button`
  background: ${props => props.isLoading ? 
    props.theme.textSecondary : 
    `linear-gradient(135deg, ${props.theme.primary}, ${props.theme.secondary})`
  };
  color: white;
  border: none;
  border-radius: 5px;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${props => props.isLoading ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: ${props => props.isLoading ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.isLoading ? 'none' : '0 5px 15px rgba(0, 0, 0, 0.1)'};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  ${props => props.isLoading ? '' : css`
    &:hover {
      animation: ${pulse} 1.5s infinite;
    }
  `}
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 2px solid white;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ForgotPassword = styled(Link)`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  text-decoration: none;
  display: block;
  text-align: right;
  margin-top: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${props => props.theme.secondary};
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 2rem 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid ${props => props.theme.border};
  }
  
  span {
    padding: 0 1rem;
    color: ${props => props.theme.textSecondary};
    font-size: 0.9rem;
  }
`;

const RegisterLink = styled.div`
  text-align: center;
  margin-top: 1rem;
  
  a {
    color: ${props => props.theme.secondary};
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

/**
 * Login page component
 */
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';
  
  // Clear auth errors when component mounts
  useEffect(() => {
    return () => {
      // Clean up any error state when unmounting
    };
  }, []);
  
  // Update errors when auth context error changes
  useEffect(() => {
    if (error) {
      setErrors({ general: error });
    }
  }, [error]);
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setErrors({});
      
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setErrors({ general: 'Invalid email or password' });
      } else if (error.code === 'auth/too-many-requests') {
        setErrors({ general: 'Too many login attempts. Please try again later.' });
      } else if (!errors.general) {
        setErrors({ general: 'Failed to log in. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <PageContainer>
      <LoginCard>
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardSubtitle>Sign in to your Mipripity account</CardSubtitle>
        </CardHeader>
        
        <CardBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <InputIcon hasError={errors.email}>
                <FaEnvelope />
              </InputIcon>
              <Input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                hasError={errors.email}
              />
              {errors.email && (
                <ErrorMessage>
                  <FaExclamationCircle />
                  {errors.email}
                </ErrorMessage>
              )}
            </FormGroup>
            
            <FormGroup>
              <InputIcon hasError={errors.password}>
                <FaLock />
              </InputIcon>
              <Input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                hasError={errors.password}
              />
              {errors.password && (
                <ErrorMessage>
                  <FaExclamationCircle />
                  {errors.password}
                </ErrorMessage>
              )}
            </FormGroup>
            
            {errors.general && (
              <ErrorMessage>
                <FaExclamationCircle />
                {errors.general}
              </ErrorMessage>
            )}
            
            <SubmitButton type="submit" isLoading={loading}>
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <FaSignInAlt />
                  Sign In
                </>
              )}
            </SubmitButton>
            
            <ForgotPassword to="/forgot-password">
              Forgot your password?
            </ForgotPassword>
          </Form>
          
          <Divider>
            <span>OR</span>
          </Divider>
          
          <RegisterLink>
            Don't have an account? <Link to="/register">Sign Up</Link>
          </RegisterLink>
        </CardBody>
      </LoginCard>
    </PageContainer>
  );
};

export default LoginPage;