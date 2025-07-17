import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { IconButton, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

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

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
  
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

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  position: relative;
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 15px;
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.2);
`;

const AvatarUpload = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 20px;
  width: 100%;
  
  .MuiInputBase-root {
    color: white;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
    
    &.Mui-focused {
      background: rgba(255, 255, 255, 0.2);
    }
  }
  
  .MuiInputLabel-root {
    color: rgba(255, 255, 255, 0.7);
  }
  
  .MuiOutlinedInput-notchedOutline {
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const SaveButton = styled(Button)`
  &.MuiButton-root {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    padding: 10px 20px;
    margin-top: 10px;
    width: 100%;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || '/default-avatar.png');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatar(base64String);
        localStorage.setItem('avatar', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUsernameChange = async () => {
    if (!newUsername) return;

    try {
      const response = await fetch('http://127.0.0.1:8000/resetNAME', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orginNAME: username,
          newNAME: newUsername,
        }),
      });

      const data = await response.json();
      // 修改成功后更新本地存储和状态
      localStorage.setItem('username', newUsername);
      setUsername(newUsername);
      setNewUsername('');
      alert('用户名修改成功！');
      
      // 触发登录状态变化事件，通知其他组件更新
      window.dispatchEvent(new Event('login-status-change'));
    } catch (error) {
      console.error('修改用户名错误:', error);
      alert('修改失败，请检查网络连接！');
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword) return;

    try {
      const response = await fetch('http://127.0.0.1:8000/resetPWD', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          NAME: username,
          newPWD: newPassword,
        }),
      });

      const data = await response.json();
      // 修改成功后清空输入框
      setNewPassword('');
      alert('密码修改成功！');
    } catch (error) {
      console.error('修改密码错误:', error);
      alert('修改失败，请检查网络连接！');
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
            <Title>Settings</Title>
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Header>

          <Content>
            <AvatarSection>
              <AvatarContainer>
                <Avatar src={avatar} alt="User Avatar" />
                <AvatarUpload onClick={() => fileInputRef.current?.click()}>
                  <PhotoCameraIcon sx={{ color: 'white', fontSize: 20 }} />
                </AvatarUpload>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </AvatarContainer>
            </AvatarSection>

            <StyledTextField
              label="Current Username"
              value={username}
              disabled
              fullWidth
              variant="outlined"
              margin="normal"
            />

            <StyledTextField
              label="New Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
            />
            <SaveButton onClick={handleUsernameChange}>
              Update Username
            </SaveButton>

            <StyledTextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
              type="email"
            />

            <StyledTextField
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
              type="password"
            />
            <SaveButton onClick={handlePasswordChange}>
              Update Password
            </SaveButton>
          </Content>
        </Drawer>
      )}
    </AnimatePresence>
  );
};

export default SettingsDialog; 