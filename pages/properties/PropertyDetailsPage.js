import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import api from '../../utils/api';
import {
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaDollarSign, 
  FaBuilding, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaVoteYea, 
  FaEdit, 
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationCircle,
  FaCheckCircle,
  FaArrowLeft
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import Loader from '../../components/common/Loader';

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
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  animation: ${css`${fadeIn}`} 0.5s ease-out;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  color: ${props => props.theme.textSecondary};
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${props => props.theme.secondary};
  }
`;

const PropertyHeader = styled.div`
  margin-bottom: 2rem;
`;

const PropertyTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.text};
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const PropertyLocation = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  color: ${props => props.theme.textSecondary};
  
  svg {
    margin-right: 0.5rem;
    color: ${props => props.theme.secondary};
  }
`;

const PropertyContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const PropertyMainContent = styled.div``;

const PropertySidebar = styled.div`
  @media (max-width: 992px) {
    order: -1;
  }
`;

const PropertyImageGallery = styled.div`
  margin-bottom: 2rem;
`;

const MainImage = styled.div`
  height: 400px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  margin-bottom: 1rem;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    height: 300px;
  }
  
  @media (max-width: 480px) {
    height: 250px;
  }
`;

const ThumbnailsContainer = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.isDark ? '#2c2c2c' : '#f1f1f1'};
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.isDark ? '#555' : '#ccc'};
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.isDark ? '#777' : '#aaa'};
  }
`;

const Thumbnail = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.isActive ? props.theme.secondary : 'transparent'};
  opacity: ${props => props.isActive ? 1 : 0.7};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &:hover {
    opacity: 1;
    transform: translateY(-3px);
  }
`;

const PropertyDescription = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
    color: ${props => props.theme.secondary};
  }
`;

const PropertyText = styled.p`
  line-height: 1.6;
  color: ${props => props.theme.text};
  margin-bottom: 1.5rem;
`;

const PropertyDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  background-color: ${props => props.theme.surface};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const DetailLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 0.5rem;
`;

const DetailValue = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    color: ${props => props.theme.secondary};
  }
`;

const Card = styled.div`
  background-color: ${props => props.theme.surface};
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const PropertyInfo = styled(Card)``;

const PropertyPrice = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.secondary};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const PropertyCategory = styled.div`
  display: inline-block;
  background-color: ${props => props.theme.primary};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-weight: 500;
  margin-bottom: 1.5rem;
`;

const VotingCard = styled(Card)``;

const VoteTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
    color: ${props => props.theme.secondary};
  }
`;

const VoteOptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const VoteOption = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: ${props => props.isSelected ? 
    `${props.theme.secondary}20` : 
    props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'
  };
  border: 2px solid ${props => props.isSelected ? props.theme.secondary : 'transparent'};
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.isSelected ? 
      `${props.theme.secondary}30` : 
      props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
    };
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const VoteOptionName = styled.span`
  font-weight: ${props => props.isSelected ? '600' : '400'};
  color: ${props => props.isSelected ? props.theme.secondary : props.theme.text};
`;

const VoteCount = styled.span`
  background-color: ${props => props.isSelected ? props.theme.secondary : 'rgba(0, 0, 0, 0.1)'};
  color: ${props => props.isSelected ? 'white' : props.theme.textSecondary};
  padding: 0.25rem 0.5rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const VoteSubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: ${props => props.theme.secondary};
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: ${props => props.theme.primary};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
  
  &.loading {
    opacity: 0.7;
    cursor: wait;
  }
`;

const VoteSuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: rgba(56, 142, 60, 0.1);
  color: #388E3C;
  border-radius: 5px;
  margin-top: 1rem;
  
  svg {
    font-size: 1.2rem;
  }
`;

const LoginPrompt = styled.div`
  text-align: center;
  padding: 1.5rem;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
  border-radius: 5px;
  margin-top: 1rem;
  
  a {
    color: ${props => props.theme.secondary};
    font-weight: 500;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const OwnerCard = styled(Card)``;

const OwnerTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
    color: ${props => props.theme.secondary};
  }
`;

const OwnerInfo = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const OwnerAvatar = styled.div`
  width: 60px;
  height: 60px;
  background-color: ${props => props.theme.primary};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
`;

const OwnerDetails = styled.div`
  flex: 1;
`;

const OwnerName = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: ${props => props.theme.text};
`;

const OwnerContact = styled.div`
  margin-top: 1rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
  
  svg {
    margin-right: 0.5rem;
    color: ${props => props.theme.secondary};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const ActionButton = styled(Link)`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &.edit {
    background-color: ${props => props.theme.secondary};
    color: white;
    
    &:hover {
      background-color: ${props => props.theme.primary};
      transform: translateY(-2px);
    }
  }
  
  &.delete {
    background-color: transparent;
    border: 1px solid #d32f2f;
    color: #d32f2f;
    
    &:hover {
      background-color: rgba(211, 47, 47, 0.1);
      transform: translateY(-2px);
    }
  }
`;

const DeleteButton = styled.button`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 5px;
  border: 1px solid #d32f2f;
  background-color: transparent;
  color: #d32f2f;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(211, 47, 47, 0.1);
    transform: translateY(-2px);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${css`${fadeIn}`} 0.3s ease;
`;

const ModalContent = styled.div`
  background-color: ${props => props.theme.surface};
  border-radius: 10px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    margin: 0 1rem;
    padding: 1.5rem;
  }
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
`;

const ModalText = styled.p`
  margin-bottom: 2rem;
  line-height: 1.6;
  color: ${props => props.theme.text};
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const ModalButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.cancel {
    background-color: transparent;
    border: 1px solid ${props => props.theme.border};
    color: ${props => props.theme.text};
    
    &:hover {
      background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
    }
  }
  
  &.confirm {
    background-color: #d32f2f;
    color: white;
    border: none;
    
    &:hover {
      background-color: #b71c1c;
    }
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
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

/**
 * Property details page component
 */
const PropertyDetailsPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id;
  const auth = useAuth() || {};
  const { userData, currentUser } = auth;
  
  // State for property
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for image gallery
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // State for voting
  const [voteOptions, setVoteOptions] = useState([]);
  const [selectedVoteOption, setSelectedVoteOption] = useState(null);
  const [voteLoading, setVoteLoading] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  
  // State for deletion
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Fetch property details
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch property data
        let propertyData;
        try {
          const response = await api.get(`/api/properties/${id}`);
          propertyData = response.data.property;
          setProperty(propertyData);
          
          // Set active image to primary image if available
          if (propertyData.images && propertyData.images.length > 0) {
            const primaryIndex = propertyData.images.findIndex(img => img.is_primary);
            setActiveImageIndex(primaryIndex !== -1 ? primaryIndex : 0);
          }
          
          // Try to fetch vote options
          try {
            if (propertyData.category_id) {
              const voteOptionsResponse = await api.get(`/api/votes/options/category/${propertyData.category_id}`);
              setVoteOptions(voteOptionsResponse.data.vote_options);
              
              // If user has already voted, set the selected option
              if (propertyData.user_vote) {
                setSelectedVoteOption(propertyData.user_vote.vote_option_id);
              }
            }
          } catch (voteErr) {
            console.error('Error fetching vote options:', voteErr);
            // Just continue with mock vote options
            const mockVoteOptions = getMockVoteOptions(propertyData.category_id);
            setVoteOptions(mockVoteOptions);
          }
        } catch (propertyErr) {
          console.error('Error fetching property details:', propertyErr);
          
          // Use mock data if API fails
          const mockProperty = getMockProperty(id);
          setProperty(mockProperty);
          propertyData = mockProperty;
          
          // Set vote options for mock property
          const mockVoteOptions = getMockVoteOptions(mockProperty.category_id);
          setVoteOptions(mockVoteOptions);
        }
      } catch (err) {
        console.error('Unexpected error in property details:', err);
        setError('Failed to load property details. Showing sample data instead.');
        
        // Fallback to mock data for any unexpected errors
        const mockProperty = getMockProperty(id);
        setProperty(mockProperty);
        setVoteOptions(getMockVoteOptions(mockProperty.category_id));
      } finally {
        setLoading(false);
      }
    };
    
    fetchPropertyDetails();
  }, [id]);
  
  // Handle vote option selection
  const handleVoteOptionSelect = (optionId) => {
    setSelectedVoteOption(optionId);
  };
  
  // Handle vote submission
  const handleVoteSubmit = async () => {
    if (!selectedVoteOption) return;
    
    try {
      setVoteLoading(true);
      
      await api.post('/api/votes', {
        property_id: property.id,
        vote_option_id: selectedVoteOption
      });
      
      setVoteSuccess(true);
      
      // Update vote counts in property state
      const updatedVotes = property.votes.map(vote => {
        if (vote.id === selectedVoteOption) {
          return { ...vote, count: vote.count + 1 };
        }
        return vote;
      });
      
      setProperty(prev => ({ ...prev, votes: updatedVotes }));
      
      // Reset success message after a few seconds
      setTimeout(() => {
        setVoteSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error submitting vote:', err);
      alert('Failed to submit vote. Please try again.');
    } finally {
      setVoteLoading(false);
    }
  };
  
  // Handle property deletion
  const handleDeleteProperty = async () => {
    try {
      setDeleteLoading(true);
      
      await api.delete(`/api/properties/${id}`);
      
      navigate('/properties');
    } catch (err) {
      console.error('Error deleting property:', err);
      alert('Failed to delete property. Please try again.');
      setShowDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
  };
  
  // Format price with commas
  const formatPrice = (price) => {
  return price
    ? new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
      }).format(price)
    : "Price on request";
};
  
  // Get user initials for avatar
  const getOwnerInitials = () => {
    if (!property) return '';
    return `${property.first_name.charAt(0)}${property.last_name.charAt(0)}`;
  };
  
  // Check if current user is the owner
  const isOwner = () => {
    return userData && property && userData.id === property.user_id;
  };
  
  // Mock data for development
  const getMockProperty = (id) => {
    return {
      id: parseInt(id),
      title: "Modern Apartment in Downtown",
      description: "This beautiful apartment features modern amenities and a convenient downtown location. Perfect for professionals or small families. The apartment includes a spacious living room, fully equipped kitchen, and a comfortable bedroom with plenty of natural light. Located near public transportation, shopping centers, and restaurants.",
      location: "New York, NY",
      category_id: 1,
      category_name: "Residential",
      user_id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      phone_number: "+1 123-456-7890",
      current_worth: 350000,
      year_of_construction: 2010,
      images: [
        { id: 1, property_id: parseInt(id), image_url: "https://picsum.photos/id/1027/600/400", is_primary: true },
        { id: 2, property_id: parseInt(id), image_url: "https://picsum.photos/id/1011/600/400", is_primary: false },
        { id: 3, property_id: parseInt(id), image_url: "https://picsum.photos/id/1005/600/400", is_primary: false }
      ],
      votes: [
        { id: 1, name: "Rent", count: 15 },
        { id: 2, name: "Buy", count: 8 },
        { id: 3, name: "Lease", count: 5 },
        { id: 4, name: "Partner", count: 2 }
      ],
      created_at: "2023-01-15T12:00:00Z",
      updated_at: "2023-02-10T14:30:00Z"
    };
  };
  
  const getMockVoteOptions = (categoryId) => {
    const options = {
      1: [ // Residential
        { id: 1, name: "Rent", category_id: 1 },
        { id: 2, name: "Buy", category_id: 1 },
        { id: 3, name: "Lease", category_id: 1 },
        { id: 4, name: "Partner", category_id: 1 }
      ],
      2: [ // Commercial
        { id: 5, name: "Rent", category_id: 2 },
        { id: 6, name: "Buy", category_id: 2 },
        { id: 7, name: "Lease", category_id: 2 },
        { id: 8, name: "Invest", category_id: 2 },
        { id: 9, name: "Partner", category_id: 2 }
      ]
    };
    
    return options[categoryId] || [];
  };
  
  if (loading) {
    return (
      <PageContainer>
        <Loader size="large" text="Loading property details..." />
      </PageContainer>
    );
  }
  
  if (error) {
    return (
      <PageContainer>
        <div>{error}</div>
      </PageContainer>
    );
  }
  
  if (!property) {
    return (
      <PageContainer>
        <div>Property not found</div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <BackLink to="/properties">
        <FaArrowLeft /> Back to Properties
      </BackLink>
      
      <PropertyHeader>
        <PropertyTitle>{property.title}</PropertyTitle>
        <PropertyLocation>
          <FaMapMarkerAlt />
          {property.location}
        </PropertyLocation>
      </PropertyHeader>
      
      <PropertyContent>
        <PropertyMainContent>
          <PropertyImageGallery>
            <MainImage>
              <img 
                src={property.images && property.images.length > 0 
                  ? property.images[activeImageIndex].image_url 
                  : "https://via.placeholder.com/800x600?text=No+Image"
                } 
                alt={property.title} 
              />
            </MainImage>
            
            {property.images && property.images.length > 1 && (
              <ThumbnailsContainer>
                {property.images.map((image, index) => (
                  <Thumbnail 
                    key={image.id} 
                    isActive={index === activeImageIndex}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img src={image.image_url} alt={`Thumbnail ${index + 1}`} />
                  </Thumbnail>
                ))}
              </ThumbnailsContainer>
            )}
          </PropertyImageGallery>
          
          <PropertyDescription>
            <SectionTitle>
              <FaBuilding />
              Description
            </SectionTitle>
            <PropertyText>{property.description}</PropertyText>
          </PropertyDescription>
          
          <PropertyDetails>
            <DetailItem>
              <DetailLabel>Category</DetailLabel>
              <DetailValue>
                <FaBuilding />
                {property.category_name}
              </DetailValue>
            </DetailItem>
            
            <DetailItem>
              <DetailLabel>Price</DetailLabel>
              <DetailValue>{formatPrice(property.current_worth)}</DetailValue>
            </DetailItem>
            
            {property.year_of_construction && (
              <DetailItem>
                <DetailLabel>Year Built</DetailLabel>
                <DetailValue>
                  <FaCalendarAlt />
                  {property.year_of_construction}
                </DetailValue>
              </DetailItem>
            )}
            
            <DetailItem>
              <DetailLabel>Votes</DetailLabel>
              <DetailValue>
                <FaVoteYea />
                {property.votes.reduce((sum, vote) => sum + parseInt(vote.count), 0)}
              </DetailValue>
            </DetailItem>
          </PropertyDetails>
        </PropertyMainContent>
        
        <PropertySidebar>
          <PropertyInfo>
            <PropertyPrice>{formatPrice(property.current_worth)}</PropertyPrice>
            
            <PropertyCategory>
              {property.category_name}
            </PropertyCategory>
            
            {isOwner() && (
              <ActionButtons>
                <ActionButton to={`/properties/edit/${property.id}`} className="edit">
                  <FaEdit />
                  Edit
                </ActionButton>
                
                <DeleteButton onClick={() => setShowDeleteModal(true)} className="delete">
                  <FaTrash />
                  Delete
                </DeleteButton>
              </ActionButtons>
            )}
          </PropertyInfo>
          
          <VotingCard>
            <VoteTitle>
              <FaVoteYea />
              Vote on this Property
            </VoteTitle>
            
            <VoteOptionsList>
              {property.votes && property.votes.length > 0 ? (
                property.votes.map(vote => (
                  <VoteOption 
                    key={vote.id}
                    isSelected={selectedVoteOption === vote.id}
                    onClick={() => currentUser && handleVoteOptionSelect(vote.id)}
                    disabled={!currentUser || voteLoading}
                  >
                    <VoteOptionName isSelected={selectedVoteOption === vote.id}>
                      {vote.name}
                    </VoteOptionName>
                    <VoteCount isSelected={selectedVoteOption === vote.id}>
                      {vote.count}
                    </VoteCount>
                  </VoteOption>
                ))
              ) : (
                <div>No vote options available</div>
              )}
            </VoteOptionsList>
            
            {currentUser ? (
              <>
                <VoteSubmitButton 
                  onClick={handleVoteSubmit}
                  disabled={!selectedVoteOption || voteLoading}
                  className={voteLoading ? 'loading' : ''}
                >
                  {voteLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <FaVoteYea />
                      Submit Vote
                    </>
                  )}
                </VoteSubmitButton>
                
                {voteSuccess && (
                  <VoteSuccessMessage>
                    <FaCheckCircle />
                    Your vote has been recorded!
                  </VoteSuccessMessage>
                )}
              </>
            ) : (
              <LoginPrompt>
                <Link to="/login">Log in</Link> or <Link to="/register">Register</Link> to vote on this property
              </LoginPrompt>
            )}
          </VotingCard>
          
          <OwnerCard>
            <OwnerTitle>
              <FaUser />
              Property Owner
            </OwnerTitle>
            
            <OwnerInfo>
              <OwnerAvatar>
                {getOwnerInitials()}
              </OwnerAvatar>
              
              <OwnerDetails>
                <OwnerName>
                  {property.first_name} {property.last_name}
                </OwnerName>
              </OwnerDetails>
            </OwnerInfo>
            
            <OwnerContact>
              <ContactItem>
                <FaEnvelope />
                {property.email}
              </ContactItem>
              
              {property.phone_number && (
                <ContactItem>
                  <FaPhone />
                  {property.phone_number}
                </ContactItem>
              )}
            </OwnerContact>
          </OwnerCard>
        </PropertySidebar>
      </PropertyContent>
      
      {showDeleteModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>Confirm Deletion</ModalTitle>
            <ModalText>
              Are you sure you want to delete this property? This action cannot be undone.
            </ModalText>
            <ModalButtons>
              <ModalButton 
                className="cancel"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
              >
                Cancel
              </ModalButton>
              <ModalButton 
                className="confirm"
                onClick={handleDeleteProperty}
                disabled={deleteLoading}
              >
                {deleteLoading ? <LoadingSpinner /> : 'Delete'}
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  );
};

export default PropertyDetailsPage;