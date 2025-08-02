import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import api from '../../utils/api';
import { 
  FaSearch, 
  FaFilter, 
  FaSortAmountDown, 
  FaSortAmountDownAlt, 
  FaMapMarkerAlt, 
  FaVoteYea, 
  FaPlus, 
  FaTimes, 
  FaChevronLeft, 
  FaChevronRight
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  animation: ${fadeIn} 0.5s ease-out;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  margin: 0;
  color: ${props => props.theme.text};
`;

const SearchFilterContainer = styled.div`
  margin-bottom: 2rem;
  background-color: ${props => props.theme.surface};
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const SearchContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 5px 0 0 5px;
  font-size: 1rem;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'white'};
  color: ${props => props.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.secondary};
  }
  
  @media (max-width: 768px) {
    border-radius: 5px 5px 0 0;
  }
`;

const SearchButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme.secondary};
  }
  
  @media (max-width: 768px) {
    border-radius: 0 0 5px 5px;
  }
`;

const FiltersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div``;

const FilterLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${props => props.theme.text};
  font-size: 0.9rem;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 5px;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'white'};
  color: ${props => props.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.secondary};
  }
`;

const FilterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
  gap: 1rem;
`;

const ClearFiltersButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: ${props => props.theme.text};
  border: 1px solid ${props => props.theme.border};
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const PropertyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const PropertyCard = styled.div`
  background-color: ${props => props.theme.surface};
  border-radius: 10px;
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

const AddPropertyButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.secondary};
  color: white;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme.primary};
    transform: translateY(-2px);
  }
`;

const NoResultsContainer = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: ${props => props.theme.surface};
  border-radius: 10px;
  margin-top: 2rem;
`;

const NoResultsTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
`;

const NoResultsMessage = styled.p`
  color: ${props => props.theme.textSecondary};
  margin-bottom: 2rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3rem;
  gap: 0.5rem;
`;

const PageButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.isActive ? 
    props.theme.secondary : 
    props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'white'
  };
  color: ${props => props.isActive ? 'white' : props.theme.text};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.isActive ? 
      props.theme.primary : 
      props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
    };
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      background-color: ${props => props.isActive ? 
        props.theme.secondary : 
        props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'white'
      };
      transform: none;
    }
  }
`;

/**
 * Properties listing page component with filtering and pagination
 */
const PropertiesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = useAuth();
  
  // Parse query params
  const queryParams = new URLSearchParams(location.search);
  
  // State for properties
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for pagination
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 9
  });
  
  // State for filters
  const [filters, setFilters] = useState({
    search: queryParams.get('search') || '',
    category_id: queryParams.get('category_id') || '',
    sort_by: queryParams.get('sort_by') || 'created_at',
    sort_order: queryParams.get('sort_order') || 'DESC',
    user_id: queryParams.get('user_id') || ''
  });
  
  // State for categories
  const [categories, setCategories] = useState([]);
  
  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        
        // Prepare query parameters
        const params = new URLSearchParams();
        params.append('page', pagination.page);
        params.append('limit', pagination.limit);
        
        if (filters.search) params.append('search', filters.search);
        if (filters.category_id) params.append('category_id', filters.category_id);
        if (filters.sort_by) params.append('sort_by', filters.sort_by);
        if (filters.sort_order) params.append('sort_order', filters.sort_order);
        if (filters.user_id) params.append('user_id', filters.user_id);
        
        const response = await api.get(`/properties?${params.toString()}`);
        
        setProperties(response.data.properties);
        setPagination({
          total: response.data.total,
          page: response.data.page,
          pages: response.data.pages,
          limit: response.data.limit
        });
        
        // Update URL with new query params without reloading
        navigate({
          pathname: location.pathname,
          search: `?${params.toString()}`
        }, { replace: true });
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties. Please try again later.');
        
        // Use mock data for development
        setProperties(mockProperties);
        setPagination({
          total: mockProperties.length,
          page: 1,
          pages: 1,
          limit: 9
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, [pagination.page, filters, location.pathname, navigate]);
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/properties/categories');
        setCategories(response.data.categories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        
        // Use mock categories for development
        setCategories(mockCategories);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };
  
  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };
  
  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({
      search: '',
      category_id: '',
      sort_by: 'created_at',
      sort_order: 'DESC',
      user_id: ''
    });
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };
  
  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const { page, pages } = pagination;
    const pageNumbers = [];
    
    // Always include first page
    pageNumbers.push(1);
    
    // Add current page and pages around it
    for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) {
      pageNumbers.push(i);
    }
    
    // Always include last page if there's more than one page
    if (pages > 1) {
      pageNumbers.push(pages);
    }
    
    // Add ellipsis
    return pageNumbers.reduce((result, pageNum, index, array) => {
      result.push(pageNum);
      
      // Add ellipsis if there's a gap
      if (index < array.length - 1 && array[index + 1] - pageNum > 1) {
        result.push('...');
      }
      
      return result;
    }, []);
  };
  
  // Mock data for development
  const mockProperties = [
    {
      id: 1,
      title: "Modern Apartment in Downtown",
      location: "New York, NY",
      category_name: "Residential",
      current_worth: 350000,
      primary_image: "https://via.placeholder.com/300x200?text=Apartment",
      vote_count: 24
    },
    {
      id: 2,
      title: "Commercial Space in Business District",
      location: "San Francisco, CA",
      category_name: "Commercial",
      current_worth: 1200000,
      primary_image: "https://via.placeholder.com/300x200?text=Commercial",
      vote_count: 18
    },
    {
      id: 3,
      title: "Beachfront Villa with Ocean View",
      location: "Miami, FL",
      category_name: "Residential",
      current_worth: 750000,
      primary_image: "https://via.placeholder.com/300x200?text=Villa",
      vote_count: 32
    }
  ];
  
  const mockCategories = [
    { id: 1, name: "Residential" },
    { id: 2, name: "Commercial" },
    { id: 3, name: "Land" },
    { id: 4, name: "Material" }
  ];
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>
          {filters.user_id && userData && filters.user_id === userData.id.toString()
            ? 'My Properties'
            : filters.category_id
              ? `${categories.find(c => c.id.toString() === filters.category_id)?.name || 'Category'} Properties`
              : 'Properties'
          }
        </PageTitle>
        
        {userData && (
          <AddPropertyButton to="/properties/add">
            <FaPlus />
            Add Property
          </AddPropertyButton>
        )}
      </PageHeader>
      
      <SearchFilterContainer>
        <form onSubmit={handleSearch}>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search by title, location, or description"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
            <SearchButton type="submit">
              <FaSearch />
              Search
            </SearchButton>
          </SearchContainer>
        </form>
        
        <FiltersContainer>
          <FilterGroup>
            <FilterLabel>Category</FilterLabel>
            <FilterSelect
              name="category_id"
              value={filters.category_id}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Sort By</FilterLabel>
            <FilterSelect
              name="sort_by"
              value={filters.sort_by}
              onChange={handleFilterChange}
            >
              <option value="created_at">Date Added</option>
              <option value="title">Title</option>
              <option value="location">Location</option>
              <option value="current_worth">Price</option>
              <option value="vote_count">Vote Count</option>
            </FilterSelect>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Sort Order</FilterLabel>
            <FilterSelect
              name="sort_order"
              value={filters.sort_order}
              onChange={handleFilterChange}
            >
              <option value="DESC">Descending</option>
              <option value="ASC">Ascending</option>
            </FilterSelect>
          </FilterGroup>
        </FiltersContainer>
        
        <FilterActions>
          <ClearFiltersButton onClick={handleClearFilters}>
            <FaTimes />
            Clear Filters
          </ClearFiltersButton>
        </FilterActions>
      </SearchFilterContainer>
      
      {loading ? (
        <Loader size="large" text="Loading properties..." />
      ) : error ? (
        <div>{error}</div>
      ) : properties.length === 0 ? (
        <NoResultsContainer>
          <NoResultsTitle>No properties found</NoResultsTitle>
          <NoResultsMessage>
            Try adjusting your search or filter criteria to find properties.
          </NoResultsMessage>
          <ClearFiltersButton onClick={handleClearFilters}>
            <FaTimes />
            Clear Filters
          </ClearFiltersButton>
        </NoResultsContainer>
      ) : (
        <>
          <PropertyGrid>
            {properties.map(property => (
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
          
          {pagination.pages > 1 && (
            <Pagination>
              <PageButton 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <FaChevronLeft />
              </PageButton>
              
              {getPageNumbers().map((pageNum, index) => 
                pageNum === '...' ? (
                  <span key={`ellipsis-${index}`} style={{ margin: '0 0.5rem' }}>...</span>
                ) : (
                  <PageButton 
                    key={pageNum}
                    isActive={pageNum === pagination.page}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </PageButton>
                )
              )}
              
              <PageButton 
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
              >
                <FaChevronRight />
              </PageButton>
            </Pagination>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default PropertiesPage;