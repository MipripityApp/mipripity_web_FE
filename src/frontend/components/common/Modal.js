import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes, css } from 'styled-components';
import { FaTimes } from 'react-icons/fa';
import Button from './Button';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateY(-30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const slideOut = keyframes`
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(-30px); opacity: 0; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

// Styled components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: ${props => props.isClosing ? fadeOut : fadeIn} 0.2s ease-out;
`;

const ModalContainer = styled.div`
  background-color: ${props => props.theme.surface};
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: ${props => {
    switch (props.size) {
      case 'small': return '400px';
      case 'large': return '800px';
      case 'fullwidth': return '90%';
      default: return '600px';
    }
  }};
  max-height: ${props => props.size === 'fullheight' ? '90vh' : '85vh'};
  display: flex;
  flex-direction: column;
  animation: ${props => props.isClosing ? slideOut : slideIn} 0.3s ease-out;
  
  ${props => props.variant === 'glass' && css`
    background-color: ${props.theme.isDark ? 'rgba(30, 30, 40, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
    backdrop-filter: blur(10px);
  `}
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  color: ${props => props.theme.text};
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
    color: ${props => props.theme.text};
  }
`;

const ModalContent = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex-grow: 1;
  color: ${props => props.theme.text};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: ${props => props.align || 'flex-end'};
  padding: 1.25rem 1.5rem;
  gap: 1rem;
  border-top: 1px solid ${props => props.theme.border};
  
  @media (max-width: 480px) {
    flex-direction: column-reverse;
  }
`;

/**
 * Modal component for dialogs, alerts, and confirmations
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  footerAlign = 'flex-end',
  size = 'medium',
  variant = 'default',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  onConfirm,
  onCancel,
  isConfirmLoading,
  confirmButtonVariant = 'primary',
  cancelButtonVariant = 'text',
  confirmButtonDisabled = false,
  autoFocusConfirmButton = false
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const confirmButtonRef = useRef(null);
  const modalRef = useRef(null);
  
  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true);
    
    // Wait for animation to complete
    setTimeout(() => {
      setIsClosing(false);
      if (onClose) {
        onClose();
      }
    }, 200);
  };
  
  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      handleClose();
    }
  };
  
  // Handle cancel button click
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    handleClose();
  };
  
  // Handle confirm button click
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };
  
  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && closeOnEsc && isOpen) {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeOnEsc, isOpen]);
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Auto focus confirm button if needed
  useEffect(() => {
    if (isOpen && autoFocusConfirmButton && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, [isOpen, autoFocusConfirmButton]);
  
  // If not open, don't render
  if (!isOpen) {
    return null;
  }
  
  // Render modal portal
  return createPortal(
    <ModalOverlay 
      onClick={handleOverlayClick}
      isClosing={isClosing}
    >
      <ModalContainer 
        size={size} 
        variant={variant}
        isClosing={isClosing}
        ref={modalRef}
      >
        {title && (
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            {showCloseButton && (
              <CloseButton onClick={handleClose} aria-label="Close">
                <FaTimes />
              </CloseButton>
            )}
          </ModalHeader>
        )}
        
        <ModalContent>
          {children}
        </ModalContent>
        
        {(footer || onConfirm || onCancel) && (
          <ModalFooter align={footerAlign}>
            {footer ? (
              footer
            ) : (
              <>
                {onCancel && (
                  <Button
                    variant={cancelButtonVariant}
                    onClick={handleCancel}
                  >
                    {cancelButtonText}
                  </Button>
                )}
                
                {onConfirm && (
                  <Button
                    variant={confirmButtonVariant}
                    onClick={handleConfirm}
                    isLoading={isConfirmLoading}
                    disabled={confirmButtonDisabled || isConfirmLoading}
                    ref={confirmButtonRef}
                  >
                    {confirmButtonText}
                  </Button>
                )}
              </>
            )}
          </ModalFooter>
        )}
      </ModalContainer>
    </ModalOverlay>,
    document.body
  );
};

export default Modal;