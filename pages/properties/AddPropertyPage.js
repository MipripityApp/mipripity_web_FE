import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import api from '../../utils/api';
import {
  FaBuilding, 
  FaMapMarkerAlt, 
  FaDollarSign, 
  FaCalendarAlt, 
  FaImage, 
  FaPlus, 
  FaSave, 
  FaTimes, 
  FaExclamationCircle,
  FaArrowLeft,
  FaTrash
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
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  animation: ${fadeIn} 0.5s ease-out;
  
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

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.text};
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const PageSubtitle = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.textSecondary};
`;

const FormCard = styled.div`
  background-color: ${props => props.theme.surface};
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Form = styled.form`
  display: grid;
  gap: 1.5rem;
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${props => props.theme.border};
  
  svg {
    margin-right: 0.75rem;
    color: ${props => props.theme.secondary};
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || '1fr 1fr'};
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${props => props.theme.text};
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.hasError ? props.theme.error : props.theme.border};
  border-radius: 5px;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'white'};
  color: ${props => props.theme.text};
  transition: all 0.3s ease;
  
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

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.hasError ? props.theme.error : props.theme.border};
  border-radius: 5px;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'white'};
  color: ${props => props.theme.text};
  transition: all 0.3s ease;
  min-height: 150px;
  resize: vertical;
  
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

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.hasError ? props.theme.error : props.theme.border};
  border-radius: 5px;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'white'};
  color: ${props => props.theme.text};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? props.theme.error : props.theme.secondary};
    box-shadow: 0 0 0 2px ${props => props.hasError ? 
      'rgba(211, 47, 47, 0.2)' : 
      'rgba(243, 147, 34, 0.2)'
    };
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

const ImageUploadSection = styled.div``;

const ImageUploadContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ImageUploadBox = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  border: 2px dashed ${props => props.isDragging ? props.theme.secondary : props.theme.border};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  overflow: hidden;
  
  &:hover {
    border-color: ${props => props.theme.secondary};
    background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }
  
  input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
  
  svg {
    font-size: 2rem;
    color: ${props => props.theme.textSecondary};
    margin-bottom: 0.5rem;
  }
`;

const UploadText = styled.span`
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
  text-align: center;
`;

const ImagePreview = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PrimaryBadge = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background-color: ${props => props.theme.secondary};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const ImageControls = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.5rem;
`;

const ImageControlButton = styled.button`
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 4px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.isPrimary ? props.theme.secondary : 
      props.isDelete ? '#d32f2f' : 'rgba(0, 0, 0, 0.7)'};
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 480px) {
    width: 100%;
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

const SubmitButton = styled(Button)`
  background-color: ${props => props.theme.secondary};
  color: white;
  border: none;
  
  &:hover {
    background-color: ${props => props.theme.primary};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
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
 * Add Property page component
 */
const AddPropertyPage = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  
  // State for form
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category_id: '',
    current_worth: '',
    year_of_construction: '',
    images: []
  });
  
  // State for validation
  const [errors, setErrors] = useState({});
  
  // State for API
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categories, setCategories] = useState([]);
  
  // State for image uploading
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!userData) {
      navigate('/login');
    }
  }, [userData, navigate]);
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        
        const response = await api.get('/api/properties/categories');
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        
        // Use mock data for development
        setCategories([
          { id: 1, name: "Residential" },
          { id: 2, name: "Commercial" },
          { id: 3, name: "Land" },
          { id: 4, name: "Material" }
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Parse numeric values
    if (name === 'current_worth' || name === 'year_of_construction' || name === 'category_id') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? '' : parseFloat(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle image upload
  const handleImageUpload = (e) => {
    e.preventDefault();
    const files = e.target.files;
    
    if (!files.length) return;
    
    handleNewImages(files);
  };
  
  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (!files.length) return;
    
    handleNewImages(files);
  };
  
  // Process uploaded images
  const handleNewImages = (files) => {
    const newImages = Array.from(files).map((file) => {
      // Create a URL for the image preview
      const url = URL.createObjectURL(file);
      
      // Determine if this should be the primary image
      const isPrimary = imagePreviewUrls.length === 0;
      
      // Return image object
      return {
        file,
        url,
        isPrimary
      };
    });
    
    setImagePreviewUrls(prev => [...prev, ...newImages]);
    
    // Clear error for images if it exists
    if (errors.images) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }
  };
  
  // Set image as primary
  const setImageAsPrimary = (index) => {
    setImagePreviewUrls(prev => {
      return prev.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }));
    });
  };
  
  // Remove image
  const removeImage = (index) => {
    setImagePreviewUrls(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      
      // If we removed the primary image and there are still images left,
      // set the first one as primary
      if (prev[index].isPrimary && newImages.length > 0) {
        newImages[0].isPrimary = true;
      }
      
      return newImages;
    });
  };
  
  // Upload images to server
  const uploadImages = async () => {
    if (imagePreviewUrls.length === 0) return [];
    
    // In a real application, you would upload images to a server or cloud storage
    // and get back URLs. For this example, we'll simulate that process.
    
    // Mock upload function that returns URL
    const mockUpload = async (file) => {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock URL
      return {
        image_url: URL.createObjectURL(file),
        is_primary: file.isPrimary
      };
    };
    
    try {
      // Upload all images
      const uploadPromises = imagePreviewUrls.map(img => 
        mockUpload({
          ...img.file,
          isPrimary: img.isPrimary
        })
      );
      
      // Wait for all uploads to complete
      const uploadedImages = await Promise.all(uploadPromises);
      
      return uploadedImages;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw new Error('Failed to upload images');
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.location) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.category_id) {
      newErrors.category_id = 'Category is required';
    }
    
    if (formData.current_worth && isNaN(formData.current_worth)) {
      newErrors.current_worth = 'Price must be a number';
    }
    
    if (formData.year_of_construction) {
      const year = parseInt(formData.year_of_construction);
      const currentYear = new Date().getFullYear();
      
      if (isNaN(year)) {
        newErrors.year_of_construction = 'Year must be a number';
      } else if (year < 1800 || year > currentYear) {
        newErrors.year_of_construction = `Year must be between 1800 and ${currentYear}`;
      }
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
      
      // Upload images
      let uploadedImages = [];
      if (imagePreviewUrls.length > 0) {
        uploadedImages = await uploadImages();
      }
      
      // Prepare property data
      const propertyData = {
        ...formData,
        images: uploadedImages
      };
      
      // Create property
      const response = await api.post('/api/properties', propertyData);
      
      // Navigate to new property
      navigate(`/properties/${response.data.property.id}`);
    } catch (error) {
      console.error('Error creating property:', error);
      
      // Handle specific errors
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'Error creating property. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate('/properties');
  };
  
  if (loadingCategories) {
    return (
      <PageContainer>
        <Loader size="large" text="Loading categories..." />
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <BackLink to="/properties">
        <FaArrowLeft /> Back to Properties
      </BackLink>
      
      <PageHeader>
        <PageTitle>Add New Property</PageTitle>
        <PageSubtitle>List your property and receive votes from interested parties</PageSubtitle>
      </PageHeader>
      
      <FormCard>
        <Form onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>
              <FaBuilding />
              Property Information
            </SectionTitle>
            
            <FormGroup>
              <FormLabel htmlFor="title">Property Title*</FormLabel>
              <FormInput
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter a descriptive title for your property"
                hasError={errors.title}
              />
              {errors.title && (
                <ErrorMessage>
                  <FaExclamationCircle />
                  {errors.title}
                </ErrorMessage>
              )}
            </FormGroup>
            
            <FormGroup>
              <FormLabel htmlFor="description">Description</FormLabel>
              <FormTextarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide a detailed description of your property"
                hasError={errors.description}
              />
              {errors.description && (
                <ErrorMessage>
                  <FaExclamationCircle />
                  {errors.description}
                </ErrorMessage>
              )}
            </FormGroup>
            
            <FormRow>
              <FormGroup>
                <FormLabel htmlFor="location">Location*</FormLabel>
                <FormInput
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, State"
                  hasError={errors.location}
                />
                {errors.location && (
                  <ErrorMessage>
                    <FaExclamationCircle />
                    {errors.location}
                  </ErrorMessage>
                )}
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="category_id">Category*</FormLabel>
                <FormSelect
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  hasError={errors.category_id}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </FormSelect>
                {errors.category_id && (
                  <ErrorMessage>
                    <FaExclamationCircle />
                    {errors.category_id}
                  </ErrorMessage>
                )}
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <FormLabel htmlFor="current_worth">Price (USD)</FormLabel>
                <FormInput
                  type="number"
                  id="current_worth"
                  name="current_worth"
                  value={formData.current_worth}
                  onChange={handleInputChange}
                  placeholder="Property value in USD"
                  min="0"
                  step="0.01"
                  hasError={errors.current_worth}
                />
                {errors.current_worth && (
                  <ErrorMessage>
                    <FaExclamationCircle />
                    {errors.current_worth}
                  </ErrorMessage>
                )}
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="year_of_construction">Year Built</FormLabel>
                <FormInput
                  type="number"
                  id="year_of_construction"
                  name="year_of_construction"
                  value={formData.year_of_construction}
                  onChange={handleInputChange}
                  placeholder="Year of construction"
                  min="1800"
                  max={new Date().getFullYear()}
                  hasError={errors.year_of_construction}
                />
                {errors.year_of_construction && (
                  <ErrorMessage>
                    <FaExclamationCircle />
                    {errors.year_of_construction}
                  </ErrorMessage>
                )}
              </FormGroup>
            </FormRow>
          </FormSection>
          
          <FormSection>
            <SectionTitle>
              <FaImage />
              Property Images
            </SectionTitle>
            
            <ImageUploadSection>
              <ImageUploadContainer>
                {imagePreviewUrls.map((image, index) => (
                  <ImagePreview key={index}>
                    <img src={image.url} alt={`Property ${index + 1}`} />
                    {image.isPrimary && <PrimaryBadge>Primary</PrimaryBadge>}
                    <ImageControls>
                      {!image.isPrimary && (
                        <ImageControlButton 
                          type="button"
                          onClick={() => setImageAsPrimary(index)}
                          title="Set as primary"
                        >
                          <FaStar />
                        </ImageControlButton>
                      )}
                      <ImageControlButton 
                        type="button"
                        onClick={() => removeImage(index)}
                        title="Remove image"
                        isDelete
                      >
                        <FaTrash />
                      </ImageControlButton>
                    </ImageControls>
                  </ImagePreview>
                ))}
                
                <ImageUploadBox
                  isDragging={isDragging}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                  <FaPlus />
                  <UploadText>Add Images</UploadText>
                </ImageUploadBox>
              </ImageUploadContainer>
              {errors.images && (
                <ErrorMessage>
                  <FaExclamationCircle />
                  {errors.images}
                </ErrorMessage>
              )}
            </ImageUploadSection>
          </FormSection>
          
          {errors.general && (
            <ErrorMessage>
              <FaExclamationCircle />
              {errors.general}
            </ErrorMessage>
          )}
          
          <FormActions>
            <CancelButton type="button" onClick={handleCancel}>
              <FaTimes />
              Cancel
            </CancelButton>
            <SubmitButton type="submit" disabled={loading}>
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <FaSave />
                  Create Property
                </>
              )}
            </SubmitButton>
          </FormActions>
        </Form>
      </FormCard>
    </PageContainer>
  );
};

export default AddPropertyPage;