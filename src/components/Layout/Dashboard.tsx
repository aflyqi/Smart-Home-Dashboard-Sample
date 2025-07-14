import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

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
`;

interface DashboardProps {
  children: React.ReactNode;
  onChatToggle: (isOpen: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ children, onChatToggle }) => {
  const rooms = ['Living Room', 'Kitchen', 'Bedroom', 'Office'];
  const [activeRoom, setActiveRoom] = React.useState('Living Room');

  return (
    <DashboardContainer>
      <Header>
        <h1>Smart Home</h1>
        <HeaderRight>
          <ChatButton onClick={() => onChatToggle(true)}>
            <ChatIcon />
          </ChatButton>
        </HeaderRight>
      </Header>
      
      <RoomTabs>
        {rooms.map(room => (
          <RoomTab
            key={room}
            active={activeRoom === room}
            onClick={() => setActiveRoom(room)}
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
  );
};

export default Dashboard; 