import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaExpand, 
  FaCompress,
  FaTimes
} from 'react-icons/fa';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const zoomIn = keyframes`
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

// Styled components
const GalleryContainer = styled.div`
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  background-color: ${props => props.theme.isDark ? '#1a1a1a' : '#f0f0f0'};
`;

const MainImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
  cursor: pointer;
  
  @media (max-width: 768px) {
    aspect-ratio: 4/3;
  }
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  animation: ${fadeIn} 0.3s ease-out;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const NoImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.direction === 'left' ? 'left: 1rem;' : 'right: 1rem;'}
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.3s ease;
  z-index: 1;
  
  &:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.6);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
`;

const FullscreenButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.3s ease;
  z-index: 1;
  
  &:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.6);
  }
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
`;

const ThumbnailsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  scrollbar-width: thin;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.secondary};
    border-radius: 10px;
  }
`;

const Thumbnail = styled.div`
  position: relative;
  width: 80px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid ${props => props.isActive ? props.theme.secondary : 'transparent'};
    transition: all 0.3s ease;
  }
  
  &:hover::after {
    border-color: ${props => props.isActive ? props.theme.secondary : 'rgba(255, 255, 255, 0.5)'};
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.3s ease;
    opacity: ${props => props.isActive ? 1 : 0.7};
  }
  
  &:hover img {
    opacity: 1;
  }
`;

const ImageCounter = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  z-index: 1;
`;

const FullscreenOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.3s ease-out;
`;

const FullscreenImageContainer = styled.div`
  position: relative;
  width: 90vw;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${zoomIn} 0.3s ease-out;
`;

const FullscreenImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const FullscreenCloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10000;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const FullscreenNavButton = styled(NavigationButton)`
  position: absolute;
  z-index: 10000;
  width: 50px;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.6);
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const FullscreenThumbnailsContainer = styled(ThumbnailsContainer)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 1rem;
  justify-content: center;
`;

/**
 * PropertyImageGallery component - Displays property images in a gallery
 */
const PropertyImageGallery = ({ images = [], title = 'Property' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Use first image or find primary image
  useEffect(() => {
    if (images.length > 0) {
      const primaryIndex = images.findIndex(img => img.is_primary);
      setCurrentIndex(primaryIndex !== -1 ? primaryIndex : 0);
    }
  }, [images]);
  
  // Go to previous image
  const prevImage = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  // Go to next image
  const nextImage = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  // Go to specific image
  const goToImage = (index) => {
    setCurrentIndex(index);
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
    
    // When entering fullscreen, prevent body scroll
    if (!isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };
  
  // Close fullscreen when ESC key is pressed
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
      }
      
      // Arrow key navigation
      if (isFullscreen) {
        if (e.key === 'ArrowLeft') {
          prevImage();
        } else if (e.key === 'ArrowRight') {
          nextImage();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Ensure body scroll is restored when component unmounts
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);
  
  // Handle no images case
  if (!images || images.length === 0) {
    return (
      <GalleryContainer>
        <MainImageContainer>
          <NoImage>No images available</NoImage>
        </MainImageContainer>
      </GalleryContainer>
    );
  }
  
  // Get current image
  const currentImage = images[currentIndex];
  
  return (
    <>
      <GalleryContainer>
        <MainImageContainer onClick={toggleFullscreen}>
          <MainImage 
            src={currentImage.image_url} 
            alt={`${title} - Image ${currentIndex + 1}`} 
          />
          
          <ImageCounter>
            {currentIndex + 1} / {images.length}
          </ImageCounter>
          
          <FullscreenButton onClick={(e) => {
            e.stopPropagation();
            toggleFullscreen();
          }}>
            <FaExpand />
          </FullscreenButton>
        </MainImageContainer>
        
        {images.length > 1 && (
          <>
            <NavigationButton 
              direction="left" 
              onClick={prevImage}
              aria-label="Previous image"
            >
              <FaChevronLeft />
            </NavigationButton>
            
            <NavigationButton 
              direction="right" 
              onClick={nextImage}
              aria-label="Next image"
            >
              <FaChevronRight />
            </NavigationButton>
            
            <ThumbnailsContainer>
              {images.map((image, index) => (
                <Thumbnail 
                  key={index}
                  isActive={index === currentIndex}
                  onClick={() => goToImage(index)}
                >
                  <img 
                    src={image.image_url} 
                    alt={`${title} - Thumbnail ${index + 1}`} 
                  />
                </Thumbnail>
              ))}
            </ThumbnailsContainer>
          </>
        )}
      </GalleryContainer>
      
      {isFullscreen && (
        <FullscreenOverlay>
          <FullscreenCloseButton onClick={toggleFullscreen}>
            <FaTimes />
          </FullscreenCloseButton>
          
          <FullscreenImageContainer>
            <FullscreenImage 
              src={currentImage.image_url} 
              alt={`${title} - Image ${currentIndex + 1}`} 
            />
            
            {images.length > 1 && (
              <>
                <FullscreenNavButton 
                  direction="left" 
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  <FaChevronLeft />
                </FullscreenNavButton>
                
                <FullscreenNavButton 
                  direction="right" 
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  <FaChevronRight />
                </FullscreenNavButton>
              </>
            )}
          </FullscreenImageContainer>
          
          {images.length > 1 && (
            <FullscreenThumbnailsContainer>
              {images.map((image, index) => (
                <Thumbnail 
                  key={index}
                  isActive={index === currentIndex}
                  onClick={() => goToImage(index)}
                >
                  <img 
                    src={image.image_url} 
                    alt={`${title} - Thumbnail ${index + 1}`} 
                  />
                </Thumbnail>
              ))}
            </FullscreenThumbnailsContainer>
          )}
        </FullscreenOverlay>
      )}
    </>
  );
};

export default PropertyImageGallery;