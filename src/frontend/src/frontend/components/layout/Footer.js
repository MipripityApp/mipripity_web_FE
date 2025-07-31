import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaHeart } from 'react-icons/fa';

// Styled components
const FooterContainer = styled.footer`
  background: ${props => props.theme.isDark 
    ? 'linear-gradient(to right, #1a1a2e, #16213e)' 
    : 'linear-gradient(to right, #f8f9fa, #e9ecef)'
  };
  border-top: 1px solid ${props => props.theme.border};
  padding: 2rem 1.5rem;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const FooterSection = styled.div`
  flex: 1;
  min-width: 200px;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    margin-bottom: 0;
  }
`;

const FooterTitle = styled.h3`
  color: ${props => props.theme.primary};
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -5px;
    width: 40px;
    height: 2px;
    background-color: ${props => props.theme.secondary};
  }
`;

const FooterLink = styled(Link)`
  display: block;
  color: ${props => props.theme.text};
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.secondary};
    transform: translateX(3px);
  }
`;

const ExternalLink = styled.a`
  display: block;
  color: ${props => props.theme.text};
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.secondary};
    transform: translateX(3px);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialLink = styled.a`
  color: ${props => props.theme.text};
  font-size: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${props => props.theme.secondary};
    transform: translateY(-3px);
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  width: 100%;
  
  a {
    color: ${props => props.theme.primary};
    text-decoration: none;
    
    &:hover {
      color: ${props => props.theme.secondary};
    }
  }
  
  .heart {
    color: ${props => props.theme.primary};
    margin: 0 3px;
    animation: heartbeat 1.5s infinite;
  }
  
  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;

const Newsletter = styled.div`
  margin-top: 1rem;
`;

const NewsletterForm = styled.form`
  display: flex;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 0.6rem 1rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'white'};
  color: ${props => props.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.secondary};
  }
  
  @media (max-width: 480px) {
    width: 100%;
  }
`;

const NewsletterButton = styled.button`
  padding: 0.6rem 1rem;
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  margin-left: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme.secondary};
  }
  
  @media (max-width: 480px) {
    margin-left: 0;
    width: 100%;
  }
`;

/**
 * Footer component with links, social media, and newsletter
 */
const Footer = () => {
  const [email, setEmail] = React.useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, this would subscribe the user to a newsletter
    console.log('Newsletter subscription for:', email);
    alert(`Thank you for subscribing with ${email}!`);
    setEmail('');
  };
  
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>Mipripity</FooterTitle>
          <p style={{ marginBottom: '1rem', color: 'inherit' }}>
            A modern platform for property polling and voting, helping you make informed real estate decisions.
          </p>
          <SocialLinks>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </SocialLink>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </SocialLink>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </SocialLink>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </SocialLink>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </SocialLink>
          </SocialLinks>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Quick Links</FooterTitle>
          <FooterLink to="/">Home</FooterLink>
          <FooterLink to="/properties">Properties</FooterLink>
          <FooterLink to="/properties/add">Add Property</FooterLink>
          <FooterLink to="/login">Login</FooterLink>
          <FooterLink to="/register">Register</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Categories</FooterTitle>
          <FooterLink to="/properties?category_id=1">Residential</FooterLink>
          <FooterLink to="/properties?category_id=2">Commercial</FooterLink>
          <FooterLink to="/properties?category_id=3">Land</FooterLink>
          <FooterLink to="/properties?category_id=4">Material</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Newsletter</FooterTitle>
          <p style={{ marginBottom: '1rem', color: 'inherit' }}>
            Subscribe to our newsletter for the latest property updates.
          </p>
          <Newsletter>
            <NewsletterForm onSubmit={handleSubmit}>
              <NewsletterInput 
                type="email" 
                placeholder="Your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <NewsletterButton type="submit">Subscribe</NewsletterButton>
            </NewsletterForm>
          </Newsletter>
        </FooterSection>
        
        <Copyright>
          <p>
            © {currentYear} Mipripity. All rights reserved. Made with 
            <FaHeart className="heart" /> by TechTaskerSolutions.
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            <ExternalLink href="#">Privacy Policy</ExternalLink> | 
            <ExternalLink href="#">Terms of Service</ExternalLink>
          </p>
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;