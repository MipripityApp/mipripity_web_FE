  import React, { useState } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import styled, { keyframes, css } from 'styled-components';
  import { 
    FaEnvelope, 
    FaLock, 
    FaUser, 
    FaPhone, 
    FaUserPlus, 
    FaExclamationCircle 
  } from 'react-icons/fa';
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

  const RegisterCard = styled.div`
    background-color: ${props => props.theme.surface};
    border-radius: 10px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    width: 100%;
    max-width: 500px;
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

  const FormRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    
    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
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

  const LoginLink = styled.div`
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

  const PrivacyText = styled.p`
    font-size: 0.85rem;
    color: ${props => props.theme.textSecondary};
    text-align: center;
    margin-top: 1.5rem;
    
    a {
      color: ${props => props.theme.secondary};
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  `;

  /**
   * Register page component
   */
  const RegisterPage = () => {
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phoneNumber: ''
    });
    
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    
    const { register } = useAuth();
    const navigate = useNavigate();
    
    // Handle input change
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
    
    // Validate form
    const validateForm = () => {
      const newErrors = {};
      const { email, password, confirmPassword, firstName, lastName, phoneNumber } = formData;
      
      // Email validation
      if (!email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Email is invalid';
      }
      
      // Password validation
      if (!password) {
        newErrors.password = 'Password is required';
      } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      
      // Confirm password validation
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      // First name validation
      if (!firstName) {
        newErrors.firstName = 'First name is required';
      }
      
      // Last name validation
      if (!lastName) {
        newErrors.lastName = 'Last name is required';
      }
      
      // Phone number validation (optional)
      if (phoneNumber && !/^\+?[0-9]{10,15}$/.test(phoneNumber.replace(/\s/g, ''))) {
        newErrors.phoneNumber = 'Invalid phone number format';
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
        
        const { email, password, firstName, lastName, phoneNumber } = formData;
        
        await register(email, password, firstName, lastName, phoneNumber);
        navigate('/');
      } catch (error) {
        console.error('Registration error:', error);
        
        // Handle specific Firebase auth errors
        if (error.code === 'auth/email-already-in-use') {
          setErrors({ email: 'Email already in use' });
        } else if (error.code === 'auth/invalid-email') {
          setErrors({ email: 'Invalid email address' });
        } else if (error.code === 'auth/weak-password') {
          setErrors({ password: 'Password is too weak' });
        } else {
          setErrors({ general: error.message || 'Failed to register. Please try again.' });
        }
      } finally {
        setLoading(false);
      }
    };
    
    return (
      <PageContainer>
        <RegisterCard>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardSubtitle>Sign up for Mipripity to explore properties</CardSubtitle>
          </CardHeader>
          
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <FormRow>
                <FormGroup>
                  <InputIcon hasError={errors.firstName}>
                    <FaUser />
                  </InputIcon>
                  <Input 
                    type="text"
                    name="firstName"
                    placeholder="First Name" 
                    value={formData.firstName}
                    onChange={handleChange}
                    hasError={errors.firstName}
                  />
                  {errors.firstName && (
                    <ErrorMessage>
                      <FaExclamationCircle />
                      {errors.firstName}
                    </ErrorMessage>
                  )}
                </FormGroup>
                
                <FormGroup>
                  <InputIcon hasError={errors.lastName}>
                    <FaUser />
                  </InputIcon>
                  <Input 
                    type="text"
                    name="lastName" 
                    placeholder="Last Name" 
                    value={formData.lastName}
                    onChange={handleChange}
                    hasError={errors.lastName}
                  />
                  {errors.lastName && (
                    <ErrorMessage>
                      <FaExclamationCircle />
                      {errors.lastName}
                    </ErrorMessage>
                  )}
                </FormGroup>
              </FormRow>
              
              <FormGroup>
                <InputIcon hasError={errors.email}>
                  <FaEnvelope />
                </InputIcon>
                <Input 
                  type="email"
                  name="email"
                  placeholder="Email" 
                  value={formData.email}
                  onChange={handleChange}
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
                <InputIcon hasError={errors.phoneNumber}>
                  <FaPhone />
                </InputIcon>
                <Input 
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number (Optional)" 
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  hasError={errors.phoneNumber}
                />
                {errors.phoneNumber && (
                  <ErrorMessage>
                    <FaExclamationCircle />
                    {errors.phoneNumber}
                  </ErrorMessage>
                )}
              </FormGroup>
              
              <FormGroup>
                <InputIcon hasError={errors.password}>
                  <FaLock />
                </InputIcon>
                <Input 
                  type="password"
                  name="password" 
                  placeholder="Password" 
                  value={formData.password}
                  onChange={handleChange}
                  hasError={errors.password}
                />
                {errors.password && (
                  <ErrorMessage>
                    <FaExclamationCircle />
                    {errors.password}
                  </ErrorMessage>
                )}
              </FormGroup>
              
              <FormGroup>
                <InputIcon hasError={errors.confirmPassword}>
                  <FaLock />
                </InputIcon>
                <Input 
                  type="password"
                  name="confirmPassword" 
                  placeholder="Confirm Password" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  hasError={errors.confirmPassword}
                />
                {errors.confirmPassword && (
                  <ErrorMessage>
                    <FaExclamationCircle />
                    {errors.confirmPassword}
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
                    <FaUserPlus />
                    Sign Up
                  </>
                )}
              </SubmitButton>
              
              <PrivacyText>
                By signing up, you agree to our{' '}
                <a href="#" target="_blank" rel="noopener noreferrer">Terms of Service</a> and{' '}
                <a href="#" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
              </PrivacyText>
            </Form>
            
            <Divider>
              <span>OR</span>
            </Divider>
            
            <LoginLink>
              Already have an account? <Link to="/login">Sign In</Link>
            </LoginLink>
          </CardBody>
        </RegisterCard>
      </PageContainer>
    );
  };

  export default RegisterPage;