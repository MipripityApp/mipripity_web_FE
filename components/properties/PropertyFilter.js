import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FaFilter, 
  FaTag, 
  FaMapMarkerAlt, 
  FaDollarSign, 
  FaCalendarAlt, 
  FaSearch,
  FaTimes,
  FaCheck,
  FaChevronDown
} from 'react-icons/fa';
import Card from '../common/Card';
import Button from '../common/Button';

// Styled components
const FilterContainer = styled(Card)`
  margin-bottom: 1.5rem;
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.border};
  
  svg {
    color: ${props => props.theme.secondary};
    font-size: 1.25rem;
  }
`;

const FilterTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  color: ${props => props.theme.text};
`;

const FilterContent = styled.div`
  padding: 1rem 0 0;
`;

const FilterSection = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  cursor: ${props => props.collapsible ? 'pointer' : 'default'};
  
  &:hover {
    color: ${props => props.collapsible ? props.theme.secondary : 'inherit'};
  }
`;

const SectionTitle = styled.h4`
  margin: 0;
  font-size: 1rem;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: ${props => props.theme.secondary};
    font-size: 0.9rem;
  }
`;

const SectionIcon = styled.span`
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
`;

const SectionContent = styled.div`
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.25rem 0;
  color: ${props => props.theme.text};
  font-size: 0.95rem;
  user-select: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.secondary};
  }
`;

const CustomCheckbox = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid ${props => props.checked ? props.theme.secondary : props.theme.border};
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  background-color: ${props => props.checked ? props.theme.secondary : 'transparent'};
  
  svg {
    color: white;
    font-size: 0.7rem;
    opacity: ${props => props.checked ? 1 : 0};
    transition: opacity 0.2s ease;
  }
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
`;

const RangeContainer = styled.div`
  padding: 0 0.5rem;
`;

const RangeControls = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const RangeInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'white'};
  color: ${props => props.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.secondary};
  }
  
  &::placeholder {
    color: ${props => props.theme.textSecondary};
    opacity: 0.7;
  }
`;

const RangeSlider = styled.div`
  position: relative;
  height: 4px;
  border-radius: 2px;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  margin: 1.5rem 0.5rem 0.5rem;
`;

const RangeProgress = styled.div`
  position: absolute;
  height: 100%;
  background-color: ${props => props.theme.secondary};
  border-radius: 2px;
`;

const RangeHandle = styled.div`
  position: absolute;
  top: 50%;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.theme.secondary};
  transform: translate(-50%, -50%);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1;
  
  &:hover {
    transform: translate(-50%, -50%) scale(1.2);
  }
  
  &:active {
    transform: translate(-50%, -50%) scale(1.1);
  }
`;

const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
`;

const RangeValues = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: ${props => props.theme.text};
`;

const SearchInput = styled.div`
  position: relative;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  padding-left: 2.5rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'white'};
  color: ${props => props.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.secondary};
  }
  
  &::placeholder {
    color: ${props => props.theme.textSecondary};
    opacity: 0.7;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.textSecondary};
  display: flex;
  align-items: center;
`;

const FilterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.border};
`;

const ActiveFiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActiveFilter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  border-radius: 4px;
  font-size: 0.85rem;
  color: ${props => props.theme.text};
  
  svg {
    color: ${props => props.theme.secondary};
    cursor: pointer;
    
    &:hover {
      color: ${props => props.theme.error};
    }
  }
`;

/**
 * PropertyFilter component - Provides filtering options for property listings
 */
const PropertyFilter = ({ 
  categories = [], 
  locations = [], 
  onFilterChange,
  initialFilters = {}
}) => {
  // State for section collapse
  const [openSections, setOpenSections] = useState({
    categories: true,
    location: true,
    price: true,
    year: true
  });
  
  // State for filter values
  const [filters, setFilters] = useState({
    categories: initialFilters.categories || [],
    location: initialFilters.location || '',
    priceMin: initialFilters.priceMin || '',
    priceMax: initialFilters.priceMax || '',
    yearMin: initialFilters.yearMin || '',
    yearMax: initialFilters.yearMax || ''
  });
  
  // State for active filters display
  const [activeFilters, setActiveFilters] = useState([]);
  
  // Update active filters when filter values change
  useEffect(() => {
    const newActiveFilters = [];
    
    // Add category filters
    filters.categories.forEach(categoryId => {
      const category = categories.find(c => c.id === categoryId);
      if (category) {
        newActiveFilters.push({
          id: `category-${categoryId}`,
          label: category.name,
          type: 'category',
          value: categoryId
        });
      }
    });
    
    // Add location filter
    if (filters.location) {
      newActiveFilters.push({
        id: 'location',
        label: `Location: ${filters.location}`,
        type: 'location',
        value: filters.location
      });
    }
    
    // Add price range filter
    if (filters.priceMin || filters.priceMax) {
      const priceLabel = [];
      if (filters.priceMin) priceLabel.push(`Min: $${Number(filters.priceMin).toLocaleString()}`);
      if (filters.priceMax) priceLabel.push(`Max: $${Number(filters.priceMax).toLocaleString()}`);
      
      newActiveFilters.push({
        id: 'price',
        label: `Price: ${priceLabel.join(', ')}`,
        type: 'price',
        value: { min: filters.priceMin, max: filters.priceMax }
      });
    }
    
    // Add year range filter
    if (filters.yearMin || filters.yearMax) {
      const yearLabel = [];
      if (filters.yearMin) yearLabel.push(`From: ${filters.yearMin}`);
      if (filters.yearMax) yearLabel.push(`To: ${filters.yearMax}`);
      
      newActiveFilters.push({
        id: 'year',
        label: `Year: ${yearLabel.join(', ')}`,
        type: 'year',
        value: { min: filters.yearMin, max: filters.yearMax }
      });
    }
    
    setActiveFilters(newActiveFilters);
  }, [filters, categories]);
  
  // Toggle section collapse
  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Handle category checkbox change
  const handleCategoryChange = (categoryId) => {
    setFilters(prev => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId];
      
      return {
        ...prev,
        categories: newCategories
      };
    });
  };
  
  // Handle location input change
  const handleLocationChange = (e) => {
    setFilters(prev => ({
      ...prev,
      location: e.target.value
    }));
  };
  
  // Handle price range change
  const handlePriceChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  // Handle year range change
  const handleYearChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  // Remove a single filter
  const removeFilter = (filter) => {
    switch (filter.type) {
      case 'category':
        setFilters(prev => ({
          ...prev,
          categories: prev.categories.filter(id => id !== filter.value)
        }));
        break;
      case 'location':
        setFilters(prev => ({
          ...prev,
          location: ''
        }));
        break;
      case 'price':
        setFilters(prev => ({
          ...prev,
          priceMin: '',
          priceMax: ''
        }));
        break;
      case 'year':
        setFilters(prev => ({
          ...prev,
          yearMin: '',
          yearMax: ''
        }));
        break;
      default:
        break;
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      categories: [],
      location: '',
      priceMin: '',
      priceMax: '',
      yearMin: '',
      yearMax: ''
    });
  };
  
  // Apply filters
  const applyFilters = () => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };
  
  // Generate mock locations if none provided
  const locationOptions = locations.length > 0 ? locations : [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
    'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'
  ];
  
  return (
    <FilterContainer elevation="low">
      <FilterHeader>
        <FaFilter />
        <FilterTitle>Filter Properties</FilterTitle>
      </FilterHeader>
      
      <FilterContent>
        {activeFilters.length > 0 && (
          <ActiveFiltersContainer>
            {activeFilters.map(filter => (
              <ActiveFilter key={filter.id}>
                {filter.label}
                <FaTimes onClick={() => removeFilter(filter)} />
              </ActiveFilter>
            ))}
          </ActiveFiltersContainer>
        )}
        
        <FilterSection>
          <SectionHeader 
            onClick={() => toggleSection('categories')}
            collapsible
          >
            <SectionTitle>
              <FaTag />
              Categories
            </SectionTitle>
            <SectionIcon isOpen={openSections.categories}>
              <FaChevronDown />
            </SectionIcon>
          </SectionHeader>
          
          <SectionContent isOpen={openSections.categories}>
            <CheckboxGroup>
              {categories.length > 0 ? (
                categories.map(category => (
                  <CheckboxItem key={category.id}>
                    <HiddenCheckbox 
                      checked={filters.categories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                    />
                    <CustomCheckbox checked={filters.categories.includes(category.id)}>
                      <FaCheck />
                    </CustomCheckbox>
                    {category.name}
                  </CheckboxItem>
                ))
              ) : (
                // Mock categories if none provided
                ['Residential', 'Commercial', 'Land', 'Material'].map((name, index) => (
                  <CheckboxItem key={index + 1}>
                    <HiddenCheckbox 
                      checked={filters.categories.includes(index + 1)}
                      onChange={() => handleCategoryChange(index + 1)}
                    />
                    <CustomCheckbox checked={filters.categories.includes(index + 1)}>
                      <FaCheck />
                    </CustomCheckbox>
                    {name}
                  </CheckboxItem>
                ))
              )}
            </CheckboxGroup>
          </SectionContent>
        </FilterSection>
        
        <FilterSection>
          <SectionHeader 
            onClick={() => toggleSection('location')}
            collapsible
          >
            <SectionTitle>
              <FaMapMarkerAlt />
              Location
            </SectionTitle>
            <SectionIcon isOpen={openSections.location}>
              <FaChevronDown />
            </SectionIcon>
          </SectionHeader>
          
          <SectionContent isOpen={openSections.location}>
            <SearchInput>
              <SearchIcon>
                <FaSearch />
              </SearchIcon>
              <StyledInput 
                type="text"
                placeholder="Search by location..."
                value={filters.location}
                onChange={handleLocationChange}
              />
            </SearchInput>
            
            {/* Location suggestions */}
            {filters.location && (
              <CheckboxGroup style={{ marginTop: '0.5rem' }}>
                {locationOptions
                  .filter(loc => loc.toLowerCase().includes(filters.location.toLowerCase()))
                  .slice(0, 5)
                  .map((loc, index) => (
                    <CheckboxItem 
                      key={index}
                      onClick={() => setFilters(prev => ({ ...prev, location: loc }))}
                    >
                      <FaMapMarkerAlt style={{ fontSize: '0.8rem' }} />
                      {loc}
                    </CheckboxItem>
                  ))
                }
              </CheckboxGroup>
            )}
          </SectionContent>
        </FilterSection>
        
        <FilterSection>
          <SectionHeader 
            onClick={() => toggleSection('price')}
            collapsible
          >
            <SectionTitle>
              <FaDollarSign />
              Price Range
            </SectionTitle>
            <SectionIcon isOpen={openSections.price}>
              <FaChevronDown />
            </SectionIcon>
          </SectionHeader>
          
          <SectionContent isOpen={openSections.price}>
            <RangeContainer>
              <RangeControls>
                <RangeInput 
                  type="number"
                  placeholder="Min"
                  value={filters.priceMin}
                  onChange={(e) => handlePriceChange('priceMin', e.target.value)}
                />
                <RangeInput 
                  type="number"
                  placeholder="Max"
                  value={filters.priceMax}
                  onChange={(e) => handlePriceChange('priceMax', e.target.value)}
                />
              </RangeControls>
              
              <RangeValues>
                <div>{filters.priceMin ? `$${Number(filters.priceMin).toLocaleString()}` : 'Any'}</div>
                <div>{filters.priceMax ? `$${Number(filters.priceMax).toLocaleString()}` : 'Any'}</div>
              </RangeValues>
            </RangeContainer>
          </SectionContent>
        </FilterSection>
        
        <FilterSection>
          <SectionHeader 
            onClick={() => toggleSection('year')}
            collapsible
          >
            <SectionTitle>
              <FaCalendarAlt />
              Year Built
            </SectionTitle>
            <SectionIcon isOpen={openSections.year}>
              <FaChevronDown />
            </SectionIcon>
          </SectionHeader>
          
          <SectionContent isOpen={openSections.year}>
            <RangeContainer>
              <RangeControls>
                <RangeInput 
                  type="number"
                  placeholder="From"
                  value={filters.yearMin}
                  onChange={(e) => handleYearChange('yearMin', e.target.value)}
                  min="1800"
                  max={new Date().getFullYear()}
                />
                <RangeInput 
                  type="number"
                  placeholder="To"
                  value={filters.yearMax}
                  onChange={(e) => handleYearChange('yearMax', e.target.value)}
                  min="1800"
                  max={new Date().getFullYear()}
                />
              </RangeControls>
              
              <RangeValues>
                <div>{filters.yearMin || 'Any'}</div>
                <div>{filters.yearMax || 'Any'}</div>
              </RangeValues>
            </RangeContainer>
          </SectionContent>
        </FilterSection>
        
        <FilterActions>
          <Button 
            variant="text" 
            onClick={resetFilters}
          >
            <FaTimes />
            Reset
          </Button>
          <Button 
            variant="primary" 
            onClick={applyFilters}
          >
            <FaFilter />
            Apply Filters
          </Button>
        </FilterActions>
      </FilterContent>
    </FilterContainer>
  );
};

export default PropertyFilter;