import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { IconButton, Typography, Button, Avatar } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { Logout, Refresh } from '@mui/icons-material';
import ChatBot from '../ChatBot/ChatBot';
import { User } from '../../services/type';

type PageMode = 'dashboard' | 'suggestion logs' | 'tips' | 'User settings';

const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  z-index: 1;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  h1 {
    font-size: 2.5rem;
    font-weight: 600;
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StyledAvatar = styled(Avatar)`
  width: 32px;
  height: 32px;
  border: 2px solid rgba(255, 255, 255, 0.2);
`;

const ChatButton = styled(IconButton)`
  &.MuiIconButton-root {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    padding: 12px;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
`;

const RoomTabs = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const RoomTab = styled(motion.button)<{ active?: boolean }>`
  padding: 10px 20px;
  border: none;
  border-radius: 15px;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
  
  & > * {
    min-width: 0; // 防止子元素溢出
  }
`;

interface DashboardProps {
  children: React.ReactNode;
  currentUser: User | null;
  onRefreshData: () => void;
  onLogout: () => void;
  loading: boolean;
  currentPage: PageMode;
  onPageChange: (page: PageMode) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  children, 
  currentUser, 
  onRefreshData, 
  onLogout, 
  loading,
  currentPage,
  onPageChange
}) => {
  const rooms: PageMode[] = ['dashboard', 'suggestion logs', 'tips', 'User settings'];
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <DashboardContainer>
        <Header>
          <h1>Smart Home Dashboard</h1>
          <HeaderRight>
            <UserInfo>
              <StyledAvatar
                src={currentUser?.avatar_url}
                alt={currentUser?.username}
              />
              <Typography variant="body2" sx={{ color: 'white' }}>
                Welcome, {currentUser?.username}
              </Typography>
            </UserInfo>
            <Button
              color="inherit"
              startIcon={<Refresh />}
              onClick={onRefreshData}
              disabled={loading}
              sx={{ color: 'white', marginRight: 1 }}
            >
              Refresh Data
            </Button>
            <Button
              color="inherit"
              startIcon={<Logout />}
              onClick={onLogout}
              sx={{ color: 'white', marginRight: 1 }}
            >
              Exit
            </Button>
            <ChatButton onClick={() => setIsChatOpen(true)}>
              <ChatIcon />
            </ChatButton>
          </HeaderRight>
        </Header>
        
        <RoomTabs>
          {rooms.map(room => (
            <RoomTab
              key={room}
              active={currentPage === room}
              onClick={() => onPageChange(room)}
              whileTap={{ scale: 0.95 }}
            >
              {room}
            </RoomTab>
          ))}
        </RoomTabs>

        <Grid>
          {children}
        </Grid>
      </DashboardContainer>
      
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default Dashboard; 