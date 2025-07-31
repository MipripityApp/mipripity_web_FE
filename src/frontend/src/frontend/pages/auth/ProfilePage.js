import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaExclamationCircle 
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import Loader from '../../components/common/Loader';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled components
const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  animation: ${fadeIn} 0.5s ease-out;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.text};
`;

const PageSubtitle = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;
`;

const ProfileCard = styled.div`
  background-color: ${props => props.theme.surface};
  border-radius: 10px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  }
`;

const ProfileHeader = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  padding: 2rem;
  color: white;
  text-align: center;
  position: relative;
`;

const ProfileAvatar = styled.div`
  width: 100px;
  height: 100px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 2.5rem;
  font-weight: bold;
  color: ${props => props.theme.primary};
  border: 3px solid white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

const ProfileName = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
`;

const ProfileEmail = styled.p`
  font-size: 1rem;
  opacity: 0.9;
`;

const EditButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: rgba(255, 255, 255, 0.2);
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
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const ProfileBody = styled.div`
  padding: 2rem;
`;

const ProfileSection = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    color: ${props => props.theme.secondary};
  }
`;

const ProfileInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  margin-bottom: 1rem;
`;

const InfoLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 0.5rem;
`;

const InfoValue = styled.div`
  font-size: 1.1rem;
  color: ${props => props.theme.text};
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
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

const ErrorMessage = styled.div`
  color: ${props => props.theme.error};
  font-size: 0.85rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  grid-column: 1 / -1;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SaveButton = styled(Button)`
  background-color: ${props => props.theme.secondary};
  color: white;
  border: none;
  
  &:hover {
    background-color: ${props => props.theme.primary};
  }
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  border: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.text};
  
  &:hover {
    background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
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
 * User profile page component
 */
const ProfilePage = () => {
  const { userData, loading, error, updateProfile, refreshUserData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: ''
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  
  // Initialize form data when user data is loaded
  useEffect(() => {
    if (userData) {
      setFormData({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        phone_number: userData.phone_number || ''
      });
    }
  }, [userData]);
  
  // Refresh user data when component mounts
  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);
  
  // Handle edit button click
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  // Handle cancel button click
  const handleCancelClick = () => {
    // Reset form data to current user data
    if (userData) {
      setFormData({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        phone_number: userData.phone_number || ''
      });
    }
    
    setErrors({});
    setIsEditing(false);
  };
  
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
    const { first_name, last_name, phone_number } = formData;
    
    // First name validation
    if (!first_name) {
      newErrors.first_name = 'First name is required';
    }
    
    // Last name validation
    if (!last_name) {
      newErrors.last_name = 'Last name is required';
    }
    
    // Phone number validation (optional)
    if (phone_number && !/^\+?[0-9]{10,15}$/.test(phone_number.replace(/\s/g, ''))) {
      newErrors.phone_number = 'Invalid phone number format';
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
      setIsSaving(true);
      
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ general: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Generate initials for avatar
  const getInitials = () => {
    if (!userData) return '';
    return userData.display_initials || '';
  };
  
  if (loading) {
    return (
      <PageContainer>
        <Loader size="large" text="Loading profile..." />
      </PageContainer>
    );
  }
  
  if (error) {
    return (
      <PageContainer>
        <ErrorMessage>
          <FaExclamationCircle />
          {error}
        </ErrorMessage>
      </PageContainer>
    );
  }
  
  if (!userData) {
    navigate('/login');
    return null;
  }
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>My Profile</PageTitle>
        <PageSubtitle>View and manage your personal information</PageSubtitle>
      </PageHeader>
      
      <ProfileCard>
        <ProfileHeader>
          <ProfileAvatar>
            {getInitials()}
          </ProfileAvatar>
          <ProfileName>
            {userData.first_name} {userData.last_name}
          </ProfileName>
          <ProfileEmail>{userData.email}</ProfileEmail>
          
          {!isEditing && (
            <EditButton onClick={handleEditClick}>
              <FaEdit />
            </EditButton>
          )}
        </ProfileHeader>
        
        <ProfileBody>
          {isEditing ? (
            <ProfileSection>
              <SectionTitle>
                <FaEdit />
                Edit Profile Information
              </SectionTitle>
              
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <InfoLabel>First Name</InfoLabel>
                  <Input 
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    hasError={errors.first_name}
                  />
                  {errors.first_name && (
                    <ErrorMessage>
                      <FaExclamationCircle />
                      {errors.first_name}
                    </ErrorMessage>
                  )}
                </FormGroup>
                
                <FormGroup>
                  <InfoLabel>Last Name</InfoLabel>
                  <Input 
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    hasError={errors.last_name}
                  />
                  {errors.last_name && (
                    <ErrorMessage>
                      <FaExclamationCircle />
                      {errors.last_name}
                    </ErrorMessage>
                  )}
                </FormGroup>
                
                <FormGroup>
                  <InfoLabel>Phone Number (Optional)</InfoLabel>
                  <Input 
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    hasError={errors.phone_number}
                  />
                  {errors.phone_number && (
                    <ErrorMessage>
                      <FaExclamationCircle />
                      {errors.phone_number}
                    </ErrorMessage>
                  )}
                </FormGroup>
                
                <FormGroup>
                  <InfoLabel>Email</InfoLabel>
                  <Input 
                    type="email"
                    value={userData.email}
                    disabled
                  />
                  <InfoLabel style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                    Email cannot be changed
                  </InfoLabel>
                </FormGroup>
                
                {errors.general && (
                  <ErrorMessage style={{ gridColumn: '1 / -1' }}>
                    <FaExclamationCircle />
                    {errors.general}
                  </ErrorMessage>
                )}
                
                <FormActions>
                  <CancelButton type="button" onClick={handleCancelClick}>
                    <FaTimes />
                    Cancel
                  </CancelButton>
                  <SaveButton type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <LoadingSpinner />
                    ) : (
                      <>
                        <FaSave />
                        Save Changes
                      </>
                    )}
                  </SaveButton>
                </FormActions>
              </Form>
            </ProfileSection>
          ) : (
            <>
              <ProfileSection>
                <SectionTitle>
                  <FaUser />
                  Personal Information
                </SectionTitle>
                <ProfileInfo>
                  <InfoItem>
                    <InfoLabel>First Name</InfoLabel>
                    <InfoValue>{userData.first_name}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Last Name</InfoLabel>
                    <InfoValue>{userData.last_name}</InfoValue>
                  </InfoItem>
                </ProfileInfo>
              </ProfileSection>
              
              <ProfileSection>
                <SectionTitle>
                  <FaEnvelope />
                  Contact Information
                </SectionTitle>
                <ProfileInfo>
                  <InfoItem>
                    <InfoLabel>Email</InfoLabel>
                    <InfoValue>{userData.email}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Phone Number</InfoLabel>
                    <InfoValue>
                      {userData.phone_number || 'Not provided'}
                    </InfoValue>
                  </InfoItem>
                </ProfileInfo>
              </ProfileSection>
            </>
          )}
        </ProfileBody>
      </ProfileCard>
    </PageContainer>
  );
};

export default ProfilePage;