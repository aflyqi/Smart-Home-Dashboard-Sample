import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Drawer = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 400px;
  height: calc(100vh - 40px);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  border-radius: 30px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 30px;
    z-index: -1;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const LogContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  padding: 10px;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

const ChatSession = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 15px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Message = styled.div<{ isUser: boolean }>`
  background: ${props => props.isUser ? 'rgba(46, 149, 213, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  padding: 15px;
  border-radius: 15px;
  margin: 10px 0;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  line-height: 1.5;
`;

const Timestamp = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  margin-bottom: 10px;
`;

interface LogDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogDialog: React.FC<LogDialogProps> = ({ isOpen, onClose }) => {
  // 从localStorage获取聊天记录
  const getChatHistory = () => {
    const history = localStorage.getItem('chatHistory');
    return history ? JSON.parse(history) : [];
  };

  const chatHistory = getChatHistory();

  return (
    <AnimatePresence>
      {isOpen && (
        <Drawer
          initial={{ x: 420, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 420, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <Header>
            <Title>Chat History</Title>
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Header>

          <LogContainer>
            {chatHistory.map((session: any, sessionIndex: number) => (
              <ChatSession key={sessionIndex}>
                <Timestamp>{new Date(session.timestamp).toLocaleString()}</Timestamp>
                {session.messages.map((message: any, messageIndex: number) => (
                  <Message key={messageIndex} isUser={message.isUser}>
                    {message.text}
                  </Message>
                ))}
              </ChatSession>
            ))}
          </LogContainer>
        </Drawer>
      )}
    </AnimatePresence>
  );
};

export default LogDialog; 