import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

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

const ChatContainer = styled.div`
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

const Message = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 15px;
  margin-bottom: 15px;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  line-height: 1.5;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const StyledTextField = styled(TextField)`
  flex: 1;
  
  .MuiInputBase-root {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    color: white;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    
    &.Mui-focused {
      background: rgba(255, 255, 255, 0.15);
    }
  }
  
  .MuiOutlinedInput-notchedOutline {
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  &:hover .MuiOutlinedInput-notchedOutline {
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  &.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

const SendButton = styled(IconButton)`
  &.MuiIconButton-root {
    color: white;
    background: rgba(255, 255, 255, 0.1);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const generateRandomData = () => {
    const history = Array.from({ length: 7 }, () => (10 + Math.random()).toFixed(1));
    const forecast = Array.from({ length: 3 }, () => (10 + Math.random()).toFixed(1));
    return { history, forecast };
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const data = generateRandomData();
    
    try {
      const response = await fetch('http://127.0.0.1:8000/mock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          history: data.history,
          forecast: data.forecast,
        }),
      });

      const result = await response.json();
      setMessages(prev => [...prev, input, result.result]);
      setInput('');
    } catch (error) {
      // 模拟API响应
      const mockResponse = {
        result: "这里是模拟回复这里是模拟回复这里是模拟回复这里是模拟回复这里是模拟回复这里是模拟回复"
      };
      setMessages(prev => [...prev, input, mockResponse.result]);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
            <Title>智能助手</Title>
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Header>

          <ChatContainer>
            {messages.map((message, index) => (
              <Message
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  alignSelf: index % 2 === 0 ? 'flex-end' : 'flex-start',
                  background: index % 2 === 0 ? 'rgba(46, 149, 213, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                }}
              >
                {message}
              </Message>
            ))}
          </ChatContainer>

          <InputContainer>
            <StyledTextField
              fullWidth
              multiline
              maxRows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入消息..."
              variant="outlined"
            />
            <SendButton onClick={handleSend}>
              <SendIcon />
            </SendButton>
          </InputContainer>
        </Drawer>
      )}
    </AnimatePresence>
  );
};

export default ChatBot; 