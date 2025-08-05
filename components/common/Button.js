import React from 'react';
import { Link } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';

// Animation for loading spinner
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Shared styles for all button variants
const buttonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: ${props => {
    switch (props.size) {
      case 'small': return '0.5rem 1rem';
      case 'large': return '1rem 2rem';
      default: return '0.75rem 1.5rem';
    }
  }};
  font-size: ${props => {
    switch (props.size) {
      case 'small': return '0.875rem';
      case 'large': return '1.125rem';
      default: return '1rem';
    }
  }};
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.7 : 1};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.disabled ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.1)'};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  ${props => props.isLoading && css`
    color: transparent !important;
    pointer-events: none;
    
    &::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      border: 2px solid transparent;
      border-radius: 50%;
      border-top-color: currentColor;
      animation: ${spin} 0.7s linear infinite;
    }
  `}
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return css`
          background-color: ${props => props.theme.secondary};
          color: white;
          border: none;
          
          &:hover {
            background-color: ${props => !props.disabled && props.theme.primary};
          }
        `;
      case 'secondary':
        return css`
          background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
          color: ${props => props.theme.text};
          border: none;
          
          &:hover {
            background-color: ${props => !props.disabled && (props.theme.isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)')};
          }
        `;
      case 'outlined':
        return css`
          background-color: transparent;
          color: ${props => props.theme.secondary};
          border: 2px solid ${props => props.theme.secondary};
          
          &:hover {
            background-color: ${props => !props.disabled && 'rgba(243, 147, 34, 0.1)'};
          }
        `;
      case 'text':
        return css`
          background-color: transparent;
          color: ${props => props.theme.secondary};
          border: none;
          padding: ${props => {
            switch (props.size) {
              case 'small': return '0.25rem 0.5rem';
              case 'large': return '0.75rem 1rem';
              default: return '0.5rem 0.75rem';
            }
          }};
          
          &:hover {
            background-color: ${props => !props.disabled && 'rgba(243, 147, 34, 0.1)'};
          }
        `;
      case 'danger':
        return css`
          background-color: ${props => props.theme.error};
          color: white;
          border: none;
          
          &:hover {
            background-color: ${props => !props.disabled && '#c62828'};
          }
        `;
      default:
        return css`
          background-color: ${props => props.theme.secondary};
          color: white;
          border: none;
          
          &:hover {
            background-color: ${props => !props.disabled && props.theme.primary};
          }
        `;
    }
  }}
`;

// Regular button
const StyledButton = styled.button`
  ${buttonStyles}
`;

// Link styled as button
const StyledLink = styled(Link)`
  ${buttonStyles}
  text-decoration: none;
`;

// External link styled as button
const StyledExternalLink = styled.a`
  ${buttonStyles}
  text-decoration: none;
`;

/**
 * Reusable Button component
 * 
 * @param {string} variant - 'primary', 'secondary', 'outlined', 'text', 'danger'
 * @param {string} size - 'small', 'medium', 'large'
 * @param {boolean} fullWidth - If true, button takes full width of container
 * @param {boolean} isLoading - If true, shows loading spinner
 * @param {boolean} disabled - If true, button is disabled
 * @param {string} to - React Router path for internal links
 * @param {string} href - URL for external links
 * @param {string} type - HTML button type (button, submit, reset)
 * @param {function} onClick - Click handler
 * @param {node} children - Button content
 * @param {object} rest - Any other props
 */
const Button = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  to,
  href,
  type = 'button',
  onClick,
  children,
  ...rest
}) => {
  // If to prop is provided, render a Link from react-router-dom
  if (to) {
    return (
      <StyledLink
        to={to}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        isLoading={isLoading}
        disabled={disabled}
        {...rest}
      >
        {children}
      </StyledLink>
    );
  }
  
  // If href prop is provided, render an anchor tag
  if (href) {
    return (
      <StyledExternalLink
        href={href}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        isLoading={isLoading}
        disabled={disabled}
        target="_blank"
        rel="noopener noreferrer"
        {...rest}
      >
        {children}
      </StyledExternalLink>
    );
  }
  
  // Otherwise, render a regular button
  return (
    <StyledButton
      type={type}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      isLoading={isLoading}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};

export default Button;