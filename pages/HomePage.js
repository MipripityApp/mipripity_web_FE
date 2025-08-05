
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import api from '../utils/api';
import { FaSearch, FaBuilding, FaVoteYea, FaChartLine, FaMapMarkerAlt } from 'react-icons/fa';
import Loader from '../components/common/Loader';

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
  animation: ${fadeIn} 0.5s ease-out;
`;

const HeroSection = styled.section`
  height: 80vh;
  min-height: 500px;
  max-height: 800px;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), 
              url('/src/frontend/assets/images/hero-bg.jpg') center/cover no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      ${props => props.theme.primary} 0%,
      transparent 50%,
      ${props => props.theme.secondary} 100%
    );
    opacity: 0.4;
    z-index: 1;
  }
  
  & > * {
    position: relative;
    z-index: 2;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  max-width: 800px;
  margin-bottom: 2rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  max-width: 600px;
  width: 100%;
  margin-top: 1rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  background: transparent;
  color: white;
  font-size: 1rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.8);
  }
  
  &:focus {
    outline: none;
  }
`;

const SearchButton = styled.button`
  padding: 1rem 1.5rem;
  background: ${props => props.theme.secondary};
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${props => props.theme.primary};
  }
  
  svg {
    margin-right: 0.5rem;
  }
  
  @media (max-width: 480px) {
    span {
      display: none;
    }
    
    svg {
      margin-right: 0;
    }
  }
`;

const FeaturedSection = styled.section`
  padding: 4rem 2rem;
  background-color: ${props => props.theme.background};
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background-color: ${props => props.theme.secondary};
  }
`;

const SectionSubtitle = styled.p`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 3rem;
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;
`;

const PropertyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
`;

const PropertyCard = styled.div`
  background-color: ${props => props.theme.surface};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
`;

const PropertyImageContainer = styled.div`
  height: 200px;
  overflow: hidden;
  position: relative;
`;

const PropertyImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  ${PropertyCard}:hover & {
    transform: scale(1.05);
  }
`;

const PropertyCategory = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${props => props.theme.primary};
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  z-index: 1;
`;

const PropertyDetails = styled.div`
  padding: 1.5rem;
`;

const PropertyTitle = styled.h3`
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  color: ${props => props.theme.text};
`;

const PropertyLocation = styled.p`
  display: flex;
  align-items: center;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 1rem;
  font-size: 0.9rem;
  
  svg {
    margin-right: 0.5rem;
    color: ${props => props.theme.secondary};
  }
`;

const PropertyFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.border};
`;

const PropertyPrice = styled.span`
  font-weight: bold;
  color: ${props => props.theme.secondary};
`;

const PropertyLink = styled(Link)`
  background-color: ${props => props.theme.primary};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme.secondary};
  }
`;

const VoteCount = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  
  svg {
    margin-right: 0.5rem;
    color: ${props => props.theme.secondary};
  }
`;

const CategorySection = styled.section`
  padding: 4rem 2rem;
  background-color: ${props => props.theme.isDark ? props.theme.surface : '#f5f5f5'};
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const CategoryCard = styled(Link)`
  background-color: ${props => props.theme.background};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  text-decoration: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
    
    svg {
      color: ${props => props.theme.secondary};
      animation: ${pulse} 1s infinite;
    }
  }
`;

const CategoryIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.primary};
`;

const CategoryName = styled.h3`
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
`;

const CategoryDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
`;

const FeaturesSection = styled.section`
  padding: 4rem 2rem;
  background-color: ${props => props.theme.background};
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background-color: ${props => props.theme.surface};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
    
    svg {
      color: ${props => props.theme.secondary};
      animation: ${pulse} 1s infinite;
    }
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.primary};
`;

const FeatureTitle = styled.h3`
  color: ${props => props.theme.text};
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.textSecondary};
`;

const CtaSection = styled.section`
  padding: 4rem 2rem;
  background: linear-gradient(
    135deg,
    ${props => props.theme.primary} 0%,
    ${props => props.theme.secondary} 100%
  );
  color: white;
  text-align: center;
`;

const CtaTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CtaDescription = styled.p`
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto 2rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CtaButton = styled(Link)`
  display: inline-block;
  background-color: white;
  color: ${props => props.theme.primary};
  padding: 1rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  }
`;

/**
 * Home page component with hero section, featured properties, and more
 */
const HomePage = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch featured properties
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        // In a real application, you might have an endpoint for featured properties
        // For now, we'll just get the latest properties
        const response = await api.get('/api/properties?limit=6&sort_by=created_at&sort_order=DESC');
        setFeaturedProperties(response.data.properties);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured properties:', error);
        // Use mock data if the API is not available
        setFeaturedProperties(mockProperties);
        setLoading(false);
      }
    };
    
    fetchFeaturedProperties();
  }, []);
  
  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    // Redirect to properties page with search query
    window.location.href = `/properties?search=${encodeURIComponent(searchQuery)}`;
  };
  
  // Mock data for initial render or when API is not available
  const mockProperties = [
        {
        id: 1,
        title: "Modern Apartment in Downtown",
        location: "New York, NY",
        category_name: "Residential",
        current_worth: 350000,
        primary_image: "https://picsum.photos/id/1025/300/200", // Urban Apartment
        vote_count: 24
      },
      {
        id: 2,
        title: "Commercial Space in Business District",
        location: "San Francisco, CA",
        category_name: "Commercial",
        current_worth: 1200000,
        primary_image: "https://picsum.photos/id/1003/300/200", // Skyscraper
        vote_count: 18
      },
      {
        id: 3,
        title: "Beachfront Villa with Ocean View",
        location: "Miami, FL",
        category_name: "Residential",
        current_worth: 750000,
        primary_image: "https://picsum.photos/id/1018/300/200", // Beach House
        vote_count: 32
      },
      {
        id: 4,
        title: "Development Land with Permits",
        location: "Austin, TX",
        category_name: "Land",
        current_worth: 500000,
        primary_image: "https://picsum.photos/id/1043/300/200", // Open Land
        vote_count: 15
      },
      {
        id: 5,
        title: "Retail Space in Shopping Center",
        location: "Chicago, IL",
        category_name: "Commercial",
        current_worth: 880000,
        primary_image: "https://picsum.photos/id/1032/300/200", // Storefront
        vote_count: 27
      },
      {
        id: 6,
        title: "Construction Materials Bundle",
        location: "Denver, CO",
        category_name: "Material",
        current_worth: 25000,
        primary_image: "https://picsum.photos/id/1080/300/200", // Construction supplies
        vote_count: 8
      }
  ];
  
  // Categories data
  const categories = [
    {
      id: 1,
      name: "Residential",
      description: "Houses, apartments, condos, and more",
      icon: <FaBuilding />
    },
    {
      id: 2,
      name: "Commercial",
      description: "Offices, retail spaces, and warehouses",
      icon: <FaBuilding />
    },
    {
      id: 3,
      name: "Land",
      description: "Undeveloped land plots for your next project",
      icon: <FaMapMarkerAlt />
    },
    {
      id: 4,
      name: "Material",
      description: "Construction materials and supplies",
      icon: <FaBuilding />
    }
  ];
  
  // Features data
  const features = [
    {
      title: "Discover Properties",
      description: "Browse through a wide range of properties across different categories and locations",
      icon: <FaSearch />
    },
    {
      title: "Vote on Properties",
      description: "Cast your vote on properties and see what others are interested in",
      icon: <FaVoteYea />
    },
    {
      title: "Track Market Trends",
      description: "Stay updated with the latest property market trends and insights",
      icon: <FaChartLine />
    }
  ];
  
  // Format price with commas
  const formatPrice = (price) => {
  return price
    ? new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
      }).format(price)
    : "Price on request";
};
  
  return (
    <PageContainer>
      <HeroSection>
        <HeroTitle>Find Your Perfect Property</HeroTitle>
        <HeroSubtitle>
          Discover, vote, and stay informed about real estate opportunities
        </HeroSubtitle>
        
        <form onSubmit={handleSearch}>
          <SearchContainer>
            <SearchInput 
              type="text" 
              placeholder="Search for properties..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchButton type="submit">
              <FaSearch />
              <span>Search</span>
            </SearchButton>
          </SearchContainer>
        </form>
      </HeroSection>
      
      <FeaturedSection>
        <SectionTitle>Featured Properties</SectionTitle>
        <SectionSubtitle>
          Explore our handpicked selection of outstanding properties
        </SectionSubtitle>
        
        {loading ? (
          <Loader size="large" text="Loading properties..." />
        ) : (
          <PropertyGrid>
            {(featuredProperties.length > 0 ? featuredProperties : mockProperties).map(property => (
              <PropertyCard key={property.id}>
                <PropertyImageContainer>
                  <PropertyImage 
                    src={property.primary_image || "https://via.placeholder.com/300x200?text=Property"} 
                    alt={property.title} 
                  />
                  <PropertyCategory>
                    {property.category_name}
                  </PropertyCategory>
                </PropertyImageContainer>
                
                <PropertyDetails>
                  <PropertyTitle>{property.title}</PropertyTitle>
                  <PropertyLocation>
                    <FaMapMarkerAlt />
                    {property.location}
                  </PropertyLocation>
                  
                  <PropertyFooter>
                    <PropertyPrice>
                      {formatPrice(property.current_worth)}
                    </PropertyPrice>
                    
                    <VoteCount>
                      <FaVoteYea />
                      {property.vote_count || 0} votes
                    </VoteCount>
                    
                    <PropertyLink to={`/properties/${property.id}`}>
                      View
                    </PropertyLink>
                  </PropertyFooter>
                </PropertyDetails>
              </PropertyCard>
            ))}
          </PropertyGrid>
        )}
      </FeaturedSection>
      
      <CategorySection>
        <SectionTitle>Browse by Category</SectionTitle>
        <SectionSubtitle>
          Find properties in your preferred category
        </SectionSubtitle>
        
        <CategoryGrid>
          {categories.map(category => (
            <CategoryCard 
              key={category.id}
              to={`/properties?category_id=${category.id}`}
            >
              <CategoryIcon>{category.icon}</CategoryIcon>
              <CategoryName>{category.name}</CategoryName>
              <CategoryDescription>
                {category.description}
              </CategoryDescription>
            </CategoryCard>
          ))}
        </CategoryGrid>
      </CategorySection>
      
      <FeaturesSection>
        <SectionTitle>Why Choose Mipripity</SectionTitle>
        <SectionSubtitle>
          Our platform offers unique features to enhance your property experience
        </SectionSubtitle>
        
        <FeatureGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>
                {feature.description}
              </FeatureDescription>
            </FeatureCard>
          ))}
        </FeatureGrid>
      </FeaturesSection>
      
      <CtaSection>
        <CtaTitle>Ready to Get Started?</CtaTitle>
        <CtaDescription>
          Join Mipripity today and discover the perfect property for your needs
        </CtaDescription>
        <CtaButton to="/register">Sign Up Now</CtaButton>
      </CtaSection>
    </PageContainer>
  );
};

export default HomePage;
