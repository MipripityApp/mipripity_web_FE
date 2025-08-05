import React from 'react';
import styled, { keyframes } from 'styled-components';

// Define animations
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(0.8); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0.8); opacity: 0.5; }
`;

// Styled components
const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${props => (props.fullScreen ? '100vh' : '100%')};
  padding: ${props => props.padding || '20px'};
`;

const SpinnerLoader = styled.div`
  width: ${props => getSizeValue(props.size)};
  height: ${props => getSizeValue(props.size)};
  border: ${props => Math.max(2, parseInt(getSizeValue(props.size)) / 10)}px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: ${props => Math.max(2, parseInt(getSizeValue(props.size)) / 10)}px solid ${props => props.theme.secondary};
  animation: ${spin} 1s linear infinite;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const PulseLoader = styled.div`
  display: flex;
  gap: 8px;
`;

const PulseDot = styled.div`
  width: ${props => getSizeValue(props.size, 'dot')};
  height: ${props => getSizeValue(props.size, 'dot')};
  background-color: ${props => props.theme.primary};
  border-radius: 50%;
  animation: ${pulse} 1.5s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
`;

const LoadingText = styled.div`
  margin-top: 10px;
  font-size: ${props => getFontSize(props.size)};
  color: ${props => props.theme.textSecondary};
  text-align: center;
`;

// Helper functions
const getSizeValue = (size, type = 'spinner') => {
  if (type === 'spinner') {
    switch (size) {
      case 'small': return '20px';
      case 'medium': return '40px';
      case 'large': return '60px';
      default: return size || '40px';
    }
  } else {
    switch (size) {
      case 'small': return '8px';
      case 'medium': return '12px';
      case 'large': return '16px';
      default: return size ? `${parseInt(size) / 4}px` : '12px';
    }
  }
};

const getFontSize = (size) => {
  switch (size) {
    case 'small': return '12px';
    case 'medium': return '14px';
    case 'large': return '16px';
    default: return '14px';
  }
};

/**
 * Loader component for indicating loading states
 * 
 * @param {Object} props - Component props
 * @param {string} props.size - Size of the loader ('small', 'medium', 'large', or custom px value)
 * @param {string} props.type - Type of loader ('spinner' or 'pulse')
 * @param {string} props.text - Optional text to display under the loader
 * @param {boolean} props.fullScreen - Whether the loader should take up the full screen
 * @param {string} props.padding - Custom padding value
 */
const Loader = ({ 
  size = 'medium', 
  type = 'spinner', 
  text, 
  fullScreen = false,
  padding
}) => {
  return (
    <LoaderContainer fullScreen={fullScreen} padding={padding}>
      <div style={{ textAlign: 'center' }}>
        {type === 'spinner' ? (
          <SpinnerLoader size={size} />
        ) : (
          <PulseLoader>
            <PulseDot size={size} delay={0} />
            <PulseDot size={size} delay={0.2} />
            <PulseDot size={size} delay={0.4} />
          </PulseLoader>
        )}
        
        {text && <LoadingText size={size}>{text}</LoadingText>}
      </div>
    </LoaderContainer>
  );
};

export default Loader;