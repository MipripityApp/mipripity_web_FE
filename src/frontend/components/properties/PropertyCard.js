import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { 
  FaMapMarkerAlt, 
  FaDollarSign, 
  FaCalendarAlt, 
  FaThumbsUp, 
  FaRegHeart, 
  FaHeart,
  FaTag
} from 'react-icons/fa';
import Card from '../common/Card';
import Button from '../common/Button';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled components
const PropertyCardContainer = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.5s ease-out;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 200px;
  width: 100%;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
`;

const PropertyImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  ${PropertyCardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 50%,
    rgba(0, 0, 0, 0.7) 100%
  );
`;

const CategoryBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: ${props => props.theme.secondary};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  svg {
    font-size: 0.7rem;
  }
`;

const PriceBadge = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ContentContainer = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const PropertyTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  transition: color 0.3s ease;
  
  ${PropertyCardContainer}:hover & {
    color: ${props => props.theme.secondary};
  }
  
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 2.8rem;
`;

const PropertyMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  
  svg {
    color: ${props => props.theme.secondary};
    font-size: 0.85rem;
  }
`;

const PropertyDescription = styled.p`
  margin: 0 0 1.5rem 0;
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const FavoriteButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  margin: -0.5rem;
  cursor: pointer;
  color: ${props => props.isFavorited ? props.theme.error : props.theme.textSecondary};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  
  &:hover {
    color: ${props => props.theme.error};
    transform: scale(1.1);
  }
`;

const VoteCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  
  svg {
    color: ${props => props.theme.secondary};
  }
`;

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'Price on request';
  
  // Format price with commas for thousands
  return `$${value.toLocaleString()}`;
};

const truncateText = (text, maxLength = 120) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};

/**
 * PropertyCard component - Displays a property card in a grid
 */
const PropertyCard = ({ 
  property, 
  onFavoriteToggle,
  isFeatured = false,
  className
}) => {
  const {
    id,
    title,
    description,
    location,
    current_worth,
    year_of_construction,
    category,
    images,
    vote_count
  } = property;
  
  // Get primary image or fallback
  const primaryImage = images && images.length > 0
    ? images.find(img => img.is_primary)?.image_url || images[0].image_url
    : 'https://via.placeholder.com/300x200?text=No+Image';
  
  // Check if property is favorited (would come from user context/state in a real app)
  const isFavorited = property.isFavorited || false;
  
  // Handle favorite toggle
  const handleFavoriteClick = (e) => {
    e.preventDefault(); // Prevent navigation
    if (onFavoriteToggle) {
      onFavoriteToggle(id, !isFavorited);
    }
  };
  
  return (
    <PropertyCardContainer
      as={Link}
      to={`/properties/${id}`}
      hoverable
      elevation={isFeatured ? "high" : "medium"}
      accentTop={isFeatured}
      className={className}
      style={{ textDecoration: 'none' }}
    >
      <ImageContainer>
        <PropertyImage src={primaryImage} alt={title} />
        <ImageOverlay />
        
        {category && (
          <CategoryBadge>
            <FaTag />
            {category.name}
          </CategoryBadge>
        )}
        
        {current_worth !== undefined && current_worth !== null && (
          <PriceBadge>
            <FaDollarSign />
            {formatCurrency(current_worth)}
          </PriceBadge>
        )}
      </ImageContainer>
      
      <ContentContainer>
        <PropertyTitle>{title}</PropertyTitle>
        
        <PropertyMeta>
          {location && (
            <MetaItem>
              <FaMapMarkerAlt />
              {location}
            </MetaItem>
          )}
          
          {year_of_construction && (
            <MetaItem>
              <FaCalendarAlt />
              Built {year_of_construction}
            </MetaItem>
          )}
        </PropertyMeta>
        
        <PropertyDescription>
          {truncateText(description)}
        </PropertyDescription>
        
        <CardActions>
          <VoteCount>
            <FaThumbsUp />
            {vote_count || 0} votes
          </VoteCount>
          
          <div>
            <FavoriteButton
              onClick={handleFavoriteClick}
              isFavorited={isFavorited}
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
              title={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorited ? <FaHeart /> : <FaRegHeart />}
            </FavoriteButton>
            
            <Button
              as="span" // Using span since this is inside a Link
              variant="text"
              size="small"
              onClick={(e) => e.preventDefault()} // Prevent navigation from button click
            >
              View Details
            </Button>
          </div>
        </CardActions>
      </ContentContainer>
    </PropertyCardContainer>
  );
};

export default PropertyCard;