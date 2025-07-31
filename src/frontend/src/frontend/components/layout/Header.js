import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaBars, FaUser, FaMoon, FaSun, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

// Styled components
const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background: ${props => props.theme.isDark 
    ? 'linear-gradient(to right, rgba(30, 30, 30, 0.95), rgba(50, 50, 50, 0.95))'
    : 'linear-gradient(to right, rgba(255, 255, 255, 0.95), rgba(245, 245, 245, 0.95))'
  };
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${props => props.theme.border};
  transition: all 0.3s ease;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LogoText = styled(Link)`
  font-family: 'Poppins', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.primary};
  text-decoration: none;
  margin-left: 0.5rem;
  display: flex;
  align-items: center;

  span {
    color: ${props => props.theme.secondary};
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const NavContainer = styled.nav`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.text};
  text-decoration: none;
  margin: 0 1rem;
  font-weight: 500;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${props => props.theme.secondary};
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: ${props => props.theme.secondary};
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 1.25rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: ${props => props.theme.secondary};
  }
  
  ${props => props.theme.isDark && `
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  `}
`;

const MobileMenuButton = styled(IconButton)`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const UserMenuContainer = styled.div`
  position: relative;
`;

const UserMenuButton = styled.button`
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: bold;
  margin-left: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.secondary};
  }
`;

const UserMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${props => props.theme.surface};
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  margin-top: 0.5rem;
  padding: 0.5rem 0;
  z-index: 1000;
  border: 1px solid ${props => props.theme.border};
  transform-origin: top right;
  animation: growIn 0.2s ease;
  
  @keyframes growIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const UserMenuItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: ${props => props.theme.text};
  text-decoration: none;
  transition: all 0.2s ease;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
    color: ${props => props.theme.secondary};
  }
`;

const UserMenuButton2 = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 0.75rem 1rem;
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
    color: ${props => props.theme.error};
  }
`;

const UserInitials = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 16px;
  font-weight: bold;
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const AuthButton = styled(Link)`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-left: 0.5rem;
  
  &.login {
    color: ${props => props.theme.secondary};
    border: 1px solid ${props => props.theme.secondary};
    
    &:hover {
      background-color: ${props => props.theme.secondary};
      color: white;
    }
  }
  
  &.register {
    background-color: ${props => props.theme.primary};
    color: white;
    
    &:hover {
      background-color: ${props => props.theme.secondary};
    }
  }
`;

/**
 * Header component with responsive navigation
 * 
 * @param {Object} props - Component props
 * @param {Function} props.toggleSidebar - Function to toggle sidebar
 * @param {boolean} props.sidebarOpen - Whether sidebar is open
 */
const Header = ({ toggleSidebar, sidebarOpen }) => {
  const { userData, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Toggle user menu
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };
  
  // Close user menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userData) return <FaUser />;
    return userData.display_initials || <FaUser />;
  };
  
  return (
    <HeaderContainer>
      <LogoContainer>
        <MobileMenuButton onClick={toggleSidebar}>
          <FaBars />
        </MobileMenuButton>
        
        <LogoText to="/">
          Mipri<span>pity</span>
        </LogoText>
      </LogoContainer>
      
      <NavContainer>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/properties">Properties</NavLink>
        {userData && <NavLink to="/properties/add">Add Property</NavLink>}
      </NavContainer>
      
      <ActionContainer>
        <IconButton onClick={toggleTheme}>
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </IconButton>
        
        {userData ? (
          <UserMenuContainer className="user-menu-container">
            <UserMenuButton onClick={toggleUserMenu}>
              <UserInitials>{getUserInitials()}</UserInitials>
            </UserMenuButton>
            
            {userMenuOpen && (
              <UserMenu>
                <UserMenuItem to="/profile">
                  <FaUser />
                  Profile
                </UserMenuItem>
                <UserMenuItem to="/properties?user_id=${userData.id}">
                  <FaUser />
                  My Properties
                </UserMenuItem>
                <UserMenuButton2 onClick={handleLogout}>
                  <FaSignOutAlt />
                  Logout
                </UserMenuButton2>
              </UserMenu>
            )}
          </UserMenuContainer>
        ) : (
          <AuthButtons>
            <AuthButton to="/login" className="login">
              Login
            </AuthButton>
            <AuthButton to="/register" className="register">
              Register
            </AuthButton>
          </AuthButtons>
        )}
      </ActionContainer>
    </HeaderContainer>
  );
};

export default Header;