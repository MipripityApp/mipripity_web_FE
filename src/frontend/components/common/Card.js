import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

// Styled components
const CardContainer = styled.div`
  background-color: ${props => props.theme.surface};
  border-radius: ${props => props.rounded ? '16px' : '8px'};
  overflow: hidden;
  transition: all 0.3s ease;
  height: ${props => props.fullHeight ? '100%' : 'auto'};
  
  /* Elevation variants */
  ${props => {
    switch (props.elevation) {
      case 'none':
        return css`
          box-shadow: none;
          border: 1px solid ${props.theme.border};
        `;
      case 'low':
        return css`
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        `;
      case 'medium':
        return css`
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        `;
      case 'high':
        return css`
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        `;
      default:
        return css`
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        `;
    }
  }}
  
  /* Hover effect */
  ${props => props.hoverable && css`
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    }
  `}
  
  /* Interactive effect */
  ${props => props.interactive && css`
    cursor: pointer;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    }
    
    &:active {
      transform: translateY(-2px);
    }
  `}
  
  /* Border styles */
  ${props => props.bordered && css`
    border: 1px solid ${props.theme.border};
  `}
  
  /* Special accent border on top */
  ${props => props.accentTop && css`
    border-top: 4px solid ${props.theme.secondary};
  `}
  
  /* Special accent border on left */
  ${props => props.accentLeft && css`
    border-left: 4px solid ${props.theme.secondary};
  `}
  
  /* Customization for dark/light mode */
  ${props => props.theme.isDark && css`
    background-color: ${props.variant === 'glass' ? 'rgba(30, 30, 40, 0.7)' : props.theme.surface};
    backdrop-filter: ${props.variant === 'glass' ? 'blur(10px)' : 'none'};
  `}
  
  ${props => !props.theme.isDark && css`
    background-color: ${props.variant === 'glass' ? 'rgba(255, 255, 255, 0.7)' : props.theme.surface};
    backdrop-filter: ${props.variant === 'glass' ? 'blur(10px)' : 'none'};
  `}
`;

const CardHeader = styled.div`
  padding: ${props => {
    switch (props.padding) {
      case 'none': return '0';
      case 'small': return '0.75rem';
      case 'large': return '1.5rem';
      default: return '1rem';
    }
  }};
  border-bottom: ${props => props.divider ? `1px solid ${props.theme.border}` : 'none'};
  display: flex;
  align-items: center;
  justify-content: ${props => props.centered ? 'center' : 'space-between'};
`;

const CardContent = styled.div`
  padding: ${props => {
    switch (props.padding) {
      case 'none': return '0';
      case 'small': return '0.75rem';
      case 'large': return '1.5rem';
      default: return '1rem';
    }
  }};
`;

const CardFooter = styled.div`
  padding: ${props => {
    switch (props.padding) {
      case 'none': return '0';
      case 'small': return '0.75rem';
      case 'large': return '1.5rem';
      default: return '1rem';
    }
  }};
  border-top: ${props => props.divider ? `1px solid ${props.theme.border}` : 'none'};
  display: flex;
  align-items: center;
  justify-content: ${props => props.centered ? 'center' : 'flex-end'};
`;

/**
 * Card component - A versatile container for content
 */
const Card = ({
  children,
  variant = 'default',
  elevation = 'medium',
  padding = 'medium',
  hoverable = false,
  interactive = false,
  bordered = false,
  rounded = false,
  fullHeight = false,
  accentTop = false,
  accentLeft = false,
  header,
  headerProps = {},
  footer,
  footerProps = {},
  onClick,
  className,
  ...rest
}) => {
  return (
    <CardContainer
      variant={variant}
      elevation={elevation}
      hoverable={hoverable}
      interactive={interactive}
      bordered={bordered}
      rounded={rounded}
      fullHeight={fullHeight}
      accentTop={accentTop}
      accentLeft={accentLeft}
      onClick={onClick}
      className={className}
      {...rest}
    >
      {header && (
        <CardHeader padding={padding} {...headerProps}>
          {header}
        </CardHeader>
      )}
      
      <CardContent padding={padding}>
        {children}
      </CardContent>
      
      {footer && (
        <CardFooter padding={padding} {...footerProps}>
          {footer}
        </CardFooter>
      )}
    </CardContainer>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'glass']),
  elevation: PropTypes.oneOf(['none', 'low', 'medium', 'high']),
  padding: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  hoverable: PropTypes.bool,
  interactive: PropTypes.bool,
  bordered: PropTypes.bool,
  rounded: PropTypes.bool,
  fullHeight: PropTypes.bool,
  accentTop: PropTypes.bool,
  accentLeft: PropTypes.bool,
  header: PropTypes.node,
  headerProps: PropTypes.object,
  footer: PropTypes.node,
  footerProps: PropTypes.object,
  onClick: PropTypes.func,
  className: PropTypes.string
};

export default Card;