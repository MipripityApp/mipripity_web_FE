import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaHome, 
  FaBuilding, 
  FaMapMarkedAlt, 
  FaUser, 
  FaPlus,
  FaChevronDown,
  FaChevronRight
} from 'react-icons/fa';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

// Styled components
const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background: ${props => props.theme.isDark 
    ? 'linear-gradient(to bottom, #1a1a2e, #16213e)' 
    : 'linear-gradient(to bottom, #f8f9fa, #e9ecef)'
  };
  border-right: 1px solid ${props => props.theme.border};
  z-index: 999;
  padding-top: 70px;
  transform: translateX(${props => (props.isOpen ? '0' : '-100%')});
  transition: transform 0.3s ease;
  overflow-y: auto;
  box-shadow: ${props => props.isOpen ? '0 0 20px rgba(0, 0, 0, 0.1)' : 'none'};
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  
  @media (max-width: 768px) {
    width: 240px;
  }
`;

const SidebarOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
  display: ${props => (props.isOpen && props.isMobile ? 'block' : 'none')};
  opacity: ${props => (props.isOpen && props.isMobile ? '1' : '0')};
  transition: opacity 0.3s ease;
`;

const SidebarSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SidebarSectionTitle = styled.h3`
  color: ${props => props.theme.textSecondary};
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 0 1.5rem;
  margin: 1.5rem 0 0.75rem;
  font-weight: 600;
`;

const SidebarLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: ${props => props.theme.text};
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  
  svg {
    margin-right: 0.75rem;
    color: ${props => props.theme.textSecondary};
    transition: all 0.2s ease;
  }
  
  &:hover {
    background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
    
    svg {
      color: ${props => props.theme.secondary};
    }
  }
  
  &.active {
    background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'};
    border-left: 3px solid ${props => props.theme.secondary};
    font-weight: 500;
    
    svg {
      color: ${props => props.theme.secondary};
    }
  }
`;

const CategoryContainer = styled.div`
  margin-bottom: 0.5rem;
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.theme.text};
  font-weight: 500;
  
  &:hover {
    background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
  }
  
  svg.icon {
    margin-right: 0.75rem;
    color: ${props => props.theme.textSecondary};
  }
  
  svg.chevron {
    color: ${props => props.theme.textSecondary};
    transition: transform 0.3s ease;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  }
`;

const CategoryList = styled.div`
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const CategoryItem = styled(Link)`
  display: block;
  padding: 0.6rem 1.5rem 0.6rem 3rem;
  color: ${props => props.theme.text};
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  
  &:hover {
    background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
    color: ${props => props.theme.secondary};
  }
  
  &.active {
    background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
    font-weight: 500;
    color: ${props => props.theme.secondary};
  }
`;

/**
 * Sidebar component with navigation links and categories
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether sidebar is open
 * @param {Function} props.closeSidebar - Function to close sidebar
 */
const Sidebar = ({ isOpen, closeSidebar }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { userData } = useAuth();
  const location = useLocation();
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/properties/categories');
        setCategories(response.data.categories);
        
        // Initialize expanded state for each category
        const expanded = {};
        response.data.categories.forEach(category => {
          expanded[category.id] = false;
        });
        setExpandedCategories(expanded);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  
  // Close sidebar on mobile when a link is clicked
  const handleLinkClick = () => {
    if (isMobile) {
      closeSidebar();
    }
  };
  
  // Check if a link is active
  const isLinkActive = (path) => {
    return location.pathname === path;
  };
  
  // Mock categories for initial render (will be replaced with API data)
  const mockCategories = [
    { id: 1, name: 'Residential' },
    { id: 2, name: 'Commercial' },
    { id: 3, name: 'Land' },
    { id: 4, name: 'Material' }
  ];
  
  // Use mock categories if real categories haven't loaded yet
  const displayCategories = loading ? mockCategories : categories;
  
  return (
    <>
      <SidebarOverlay 
        isOpen={isOpen} 
        isMobile={isMobile} 
        onClick={closeSidebar} 
      />
      
      <SidebarContainer isOpen={isOpen}>
        <SidebarSection>
          <SidebarLink 
            to="/" 
            className={isLinkActive('/') ? 'active' : ''} 
            onClick={handleLinkClick}
          >
            <FaHome />
            Home
          </SidebarLink>
          
          <SidebarLink 
            to="/properties" 
            className={isLinkActive('/properties') ? 'active' : ''} 
            onClick={handleLinkClick}
          >
            <FaBuilding />
            All Properties
          </SidebarLink>
          
          {userData && (
            <SidebarLink 
              to="/properties/add" 
              className={isLinkActive('/properties/add') ? 'active' : ''} 
              onClick={handleLinkClick}
            >
              <FaPlus />
              Add Property
            </SidebarLink>
          )}
        </SidebarSection>
        
        <SidebarSection>
          <SidebarSectionTitle>Categories</SidebarSectionTitle>
          
          {displayCategories.map(category => (
            <CategoryContainer key={category.id}>
              <CategoryHeader 
                onClick={() => toggleCategory(category.id)}
                isOpen={expandedCategories[category.id]}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FaBuilding className="icon" />
                  {category.name}
                </div>
                {expandedCategories[category.id] ? (
                  <FaChevronDown className="chevron" />
                ) : (
                  <FaChevronRight className="chevron" />
                )}
              </CategoryHeader>
              
              <CategoryList isOpen={expandedCategories[category.id]}>
                <CategoryItem 
                  to={`/properties?category_id=${category.id}`}
                  onClick={handleLinkClick}
                >
                  All {category.name}
                </CategoryItem>
                
                {category.vote_options && category.vote_options.map(option => (
                  <CategoryItem 
                    key={option.id}
                    to={`/properties?category_id=${category.id}&vote_option=${option.id}`}
                    onClick={handleLinkClick}
                  >
                    {option.name}
                  </CategoryItem>
                ))}
              </CategoryList>
            </CategoryContainer>
          ))}
        </SidebarSection>
        
        {userData && (
          <SidebarSection>
            <SidebarSectionTitle>My Account</SidebarSectionTitle>
            
            <SidebarLink 
              to="/profile" 
              className={isLinkActive('/profile') ? 'active' : ''} 
              onClick={handleLinkClick}
            >
              <FaUser />
              Profile
            </SidebarLink>
            
            <SidebarLink 
              to={`/properties?user_id=${userData.id}`}
              onClick={handleLinkClick}
            >
              <FaBuilding />
              My Properties
            </SidebarLink>
          </SidebarSection>
        )}
      </SidebarContainer>
    </>
  );
};

export default Sidebar;