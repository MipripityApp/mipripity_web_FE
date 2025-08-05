import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import api from '../../utils/api';
import { FaCheck, FaVoteYea, FaPoll, FaExclamationCircle, FaLock } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../common/Card';
import Button from '../common/Button';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled components
const VoteCardContainer = styled(Card)`
  animation: ${fadeIn} 0.5s ease-out;
`;

const VoteCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: ${props => props.theme.secondary};
    font-size: 1.5rem;
  }
`;

const VoteTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  color: ${props => props.theme.text};
`;

const VoteDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
  margin-top: 0.5rem;
`;

const VoteOptionsContainer = styled.div`
  margin-top: 1.5rem;
  display: grid;
  gap: 1rem;
`;

const VoteOptionCard = styled.div`
  position: relative;
  padding: 1rem;
  border-radius: 8px;
  background-color: ${props => 
    props.isSelected 
      ? props.theme.isDark 
        ? 'rgba(243, 147, 34, 0.2)' 
        : 'rgba(243, 147, 34, 0.1)'
      : props.theme.isDark 
        ? 'rgba(255, 255, 255, 0.05)' 
        : 'rgba(0, 0, 0, 0.03)'
  };
  border: 1px solid ${props => 
    props.isSelected 
      ? props.theme.secondary
      : 'transparent'
  };
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  transition: all 0.3s ease;
  overflow: hidden;
  
  ${props => !props.disabled && !props.isSelected && `
    &:hover {
      transform: translateY(-2px);
      background-color: ${props.theme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'};
      border-color: ${props.theme.border};
    }
  `}
  
  ${props => props.isSelected && `
    animation: ${pulse} 0.5s ease-out;
  `}
  
  ${props => props.disabled && `
    opacity: 0.7;
    cursor: not-allowed;
  `}
`;

const OptionContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const OptionName = styled.div`
  font-weight: ${props => props.isSelected ? '600' : '500'};
  color: ${props => props.isSelected ? props.theme.secondary : props.theme.text};
`;

const OptionDescription = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.textSecondary};
  margin-top: 0.25rem;
`;

const SelectedIcon = styled.div`
  color: ${props => props.theme.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VoteProgressBar = styled.div`
  height: 0.5rem;
  width: 100%;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 999px;
  margin-top: 0.75rem;
  overflow: hidden;
  position: relative;
`;

const VoteProgress = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${props => `${props.percentage}%`};
  background: linear-gradient(to right, ${props => props.theme.primary}, ${props => props.theme.secondary});
  border-radius: 999px;
  transition: width 0.5s ease-out;
`;

const VoteStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.25rem;
  font-size: 0.8rem;
`;

const VoteCount = styled.span`
  color: ${props => props.theme.textSecondary};
`;

const VotePercentage = styled.span`
  font-weight: 600;
  color: ${props => props.isLeading ? props.theme.secondary : props.theme.textSecondary};
`;

const LoginPrompt = styled.div`
  text-align: center;
  padding: 1.5rem;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
  border-radius: 8px;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  
  svg {
    font-size: 2rem;
    color: ${props => props.theme.textSecondary};
  }
`;

const LoginPromptText = styled.p`
  margin: 0;
  color: ${props => props.theme.textSecondary};
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.error};
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: ${props => props.theme.isDark ? 'rgba(211, 47, 47, 0.1)' : 'rgba(211, 47, 47, 0.05)'};
  border-radius: 4px;
  font-size: 0.9rem;
  
  svg {
    flex-shrink: 0;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
`;

/**
 * PropertyVoteCard component - Displays voting options for a property
 */
const PropertyVoteCard = ({ property, onVoteChange }) => {
  const { userData, isAuthenticated } = useAuth();
  const [voteOptions, setVoteOptions] = useState([]);
  const [userVote, setUserVote] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);
  
  // Fetch vote options and user's current vote
  useEffect(() => {
    const fetchVoteData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real app, you would fetch this data from your API
        const voteOptionsResponse = await api.get(`/api/properties/${property.id}/vote-options`);
        let options = voteOptionsResponse.data.voteOptions;
        
        // Get current vote counts
        const voteCountsResponse = await api.get(`/api/properties/${property.id}/votes`);
        const voteCounts = voteCountsResponse.data.voteCounts;
        
        // Calculate total votes
        const total = voteCounts.reduce((sum, count) => sum + count.count, 0);
        setTotalVotes(total);
        
        // Merge vote options with vote counts
        options = options.map(option => {
          const voteCount = voteCounts.find(vc => vc.vote_option_id === option.id);
          return {
            ...option,
            count: voteCount ? voteCount.count : 0,
            percentage: total > 0 ? ((voteCount ? voteCount.count : 0) / total) * 100 : 0
          };
        });
        
        setVoteOptions(options);
        
        // If user is authenticated, get their current vote
        if (isAuthenticated && userData) {
          const userVoteResponse = await api.get(`/api/properties/${property.id}/votes/user`);
          
          if (userVoteResponse.data.vote) {
            setUserVote(userVoteResponse.data.vote);
            setSelectedOption(userVoteResponse.data.vote.vote_option_id);
          }
        }
      } catch (error) {
        console.error('Error fetching vote data:', error);
        setError('Failed to load voting options. Please try again later.');
        
        // For development purposes, use mock data if API is not available
        const mockOptions = [
          { id: 1, name: 'Excellent', description: 'Outstanding quality and value' },
          { id: 2, name: 'Good', description: 'Above average quality and fair value' },
          { id: 3, name: 'Average', description: 'Standard quality with reasonable value' },
          { id: 4, name: 'Poor', description: 'Below average quality or overpriced' }
        ];
        
        const mockCounts = [
          { vote_option_id: 1, count: 42 },
          { vote_option_id: 2, count: 28 },
          { vote_option_id: 3, count: 15 },
          { vote_option_id: 4, count: 7 }
        ];
        
        const mockTotal = mockCounts.reduce((sum, count) => sum + count.count, 0);
        setTotalVotes(mockTotal);
        
        const mockOptionsWithCounts = mockOptions.map(option => {
          const voteCount = mockCounts.find(vc => vc.vote_option_id === option.id);
          return {
            ...option,
            count: voteCount ? voteCount.count : 0,
            percentage: mockTotal > 0 ? ((voteCount ? voteCount.count : 0) / mockTotal) * 100 : 0
          };
        });
        
        setVoteOptions(mockOptionsWithCounts);
        
        // Mock user vote if authenticated
        if (isAuthenticated && userData) {
          const mockUserVote = { vote_option_id: 2 };
          setUserVote(mockUserVote);
          setSelectedOption(mockUserVote.vote_option_id);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchVoteData();
  }, [property.id, isAuthenticated, userData]);
  
  // Handle option selection
  const handleOptionSelect = (optionId) => {
    if (!isAuthenticated || submitting) return;
    
    setSelectedOption(optionId);
  };
  
  // Handle vote submission
  const handleVoteSubmit = async () => {
    if (!isAuthenticated || !selectedOption || submitting) return;
    
    try {
      setSubmitting(true);
      setError(null);
      
      const voteData = {
        property_id: property.id,
        vote_option_id: selectedOption
      };
      
      // If user already voted, update their vote
      if (userVote) {
        await api.put(`/api/votes/${userVote.id}`, voteData);
      } else {
        // Otherwise create a new vote
        await api.post('/api/votes', voteData);
      }
      
      // Update user's vote state
      setUserVote({ ...voteData, id: userVote ? userVote.id : Date.now() });
      
      // Update vote counts (in a real app, you would refetch them)
      const updatedOptions = voteOptions.map(option => {
        if (userVote && userVote.vote_option_id === option.id && option.id !== selectedOption) {
          // Decrement count for previously selected option
          return {
            ...option,
            count: Math.max(0, option.count - 1)
          };
        } else if (option.id === selectedOption && (!userVote || userVote.vote_option_id !== option.id)) {
          // Increment count for newly selected option
          return {
            ...option,
            count: option.count + 1
          };
        }
        return option;
      });
      
      // Recalculate total and percentages
      const newTotal = userVote ? totalVotes : totalVotes + 1;
      setTotalVotes(newTotal);
      
      const updatedOptionsWithPercentage = updatedOptions.map(option => ({
        ...option,
        percentage: newTotal > 0 ? (option.count / newTotal) * 100 : 0
      }));
      
      setVoteOptions(updatedOptionsWithPercentage);
      
      // Notify parent component
      if (onVoteChange) {
        onVoteChange(selectedOption);
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      setError('Failed to submit your vote. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Find the option with the highest vote count
  const findLeadingOption = () => {
    if (voteOptions.length === 0) return null;
    
    return voteOptions.reduce((leading, current) => 
      current.count > leading.count ? current : leading, voteOptions[0]);
  };
  
  const leadingOption = findLeadingOption();
  
  // Render component
  return (
    <VoteCardContainer
      elevation="medium"
      bordered
      rounded
    >
      <VoteCardHeader>
        <FaPoll />
        <div>
          <VoteTitle>Vote on this Property</VoteTitle>
          <VoteDescription>
            Share your opinion on this {property.category?.name || 'property'}
          </VoteDescription>
        </div>
      </VoteCardHeader>
      
      {loading ? (
        <div>Loading vote options...</div>
      ) : (
        <>
          {error && (
            <ErrorMessage>
              <FaExclamationCircle />
              {error}
            </ErrorMessage>
          )}
          
          {isAuthenticated ? (
            <>
              <VoteOptionsContainer>
                {voteOptions.map(option => (
                  <VoteOptionCard
                    key={option.id}
                    isSelected={selectedOption === option.id}
                    disabled={submitting}
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    <OptionContent>
                      {selectedOption === option.id && (
                        <SelectedIcon>
                          <FaCheck />
                        </SelectedIcon>
                      )}
                      <div>
                        <OptionName isSelected={selectedOption === option.id}>
                          {option.name}
                        </OptionName>
                        {option.description && (
                          <OptionDescription>
                            {option.description}
                          </OptionDescription>
                        )}
                      </div>
                    </OptionContent>
                    
                    <VoteProgressBar>
                      <VoteProgress percentage={option.percentage} />
                    </VoteProgressBar>
                    
                    <VoteStats>
                      <VoteCount>
                        {option.count} {option.count === 1 ? 'vote' : 'votes'}
                      </VoteCount>
                      <VotePercentage isLeading={leadingOption && option.id === leadingOption.id}>
                        {option.percentage.toFixed(1)}%
                      </VotePercentage>
                    </VoteStats>
                  </VoteOptionCard>
                ))}
              </VoteOptionsContainer>
              
              {selectedOption && selectedOption !== (userVote?.vote_option_id || null) && (
                <ButtonContainer>
                  <Button
                    variant="primary"
                    onClick={handleVoteSubmit}
                    isLoading={submitting}
                    disabled={submitting}
                  >
                    <FaVoteYea />
                    {userVote ? 'Update Vote' : 'Submit Vote'}
                  </Button>
                </ButtonContainer>
              )}
            </>
          ) : (
            <>
              <VoteOptionsContainer>
                {voteOptions.map(option => (
                  <VoteOptionCard
                    key={option.id}
                    disabled={true}
                  >
                    <OptionContent>
                      <div>
                        <OptionName>
                          {option.name}
                        </OptionName>
                        {option.description && (
                          <OptionDescription>
                            {option.description}
                          </OptionDescription>
                        )}
                      </div>
                    </OptionContent>
                    
                    <VoteProgressBar>
                      <VoteProgress percentage={option.percentage} />
                    </VoteProgressBar>
                    
                    <VoteStats>
                      <VoteCount>
                        {option.count} {option.count === 1 ? 'vote' : 'votes'}
                      </VoteCount>
                      <VotePercentage isLeading={leadingOption && option.id === leadingOption.id}>
                        {option.percentage.toFixed(1)}%
                      </VotePercentage>
                    </VoteStats>
                  </VoteOptionCard>
                ))}
              </VoteOptionsContainer>
              
              <LoginPrompt>
                <FaLock />
                <LoginPromptText>
                  You need to log in to vote on this property
                </LoginPromptText>
                <Button 
                  variant="outlined" 
                  to="/login" 
                  size="small"
                >
                  Log In to Vote
                </Button>
              </LoginPrompt>
            </>
          )}
        </>
      )}
    </VoteCardContainer>
  );
};

export default PropertyVoteCard;