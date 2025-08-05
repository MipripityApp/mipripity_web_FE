import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaHome, FaSearch, FaExclamationTriangle } from 'react-icons/fa';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled components
const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 2rem;
  text-align: center;
  animation: ${fadeIn} 0.5s ease-out;
  
  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
  }
`;

const ErrorIcon = styled.div`
  color: ${props => props.theme.secondary};
  font-size: 5rem;
  margin-bottom: 2rem;
  animation: ${pulse} 2s infinite ease-in-out;
  
  @media (max-width: 768px) {
    font-size: 4rem;
  }
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  font-weight: 800;
  margin: 0;
  color: ${props => props.theme.primary};
  line-height: 1;
  background: linear-gradient(to right, 
    ${props => props.theme.primary}, 
    ${props => props.theme.secondary}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 6rem;
  }
`;

const ErrorTitle = styled.h2`
  font-size: 2.5rem;
  margin: 1rem 0 2rem;
  color: ${props => props.theme.text};
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ErrorMessage = styled.p`
  font-size: 1.2rem;
  margin-bottom: 3rem;
  color: ${props => props.theme.textSecondary};
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ActionButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.$primary ? props.theme.secondary : 'transparent'};
  color: ${props => props.$primary ? 'white' : props.theme.text};
  border: 2px solid ${props => props.$primary ? props.theme.secondary : props.theme.border};
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background-color: ${props => props.$primary ? props.theme.primary : props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
    border-color: ${props => props.$primary ? props.theme.primary : props.theme.secondary};
  }
  
  @media (max-width: 480px) {
    width: 100%;
  }
`;

/**
 * 404 Not Found page component
 */
const NotFoundPage = () => {
  return (
    <PageContainer>
      <ErrorIcon>
        <FaExclamationTriangle />
      </ErrorIcon>
      
      <ErrorCode>404</ErrorCode>
      <ErrorTitle>Page Not Found</ErrorTitle>
      
      <ErrorMessage>
        The page you are looking for doesn't exist or has been moved.
        <br />
        Let's get you back on track.
      </ErrorMessage>
      
      <ButtonsContainer>
        <ActionButton to="/" $primary>
          <FaHome /> Go to Home
        </ActionButton>
        <ActionButton to="/properties">
          <FaSearch /> Browse Properties
        </ActionButton>
      </ButtonsContainer>
    </PageContainer>
  );
};

export default NotFoundPage;