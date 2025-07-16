import React, { useRef } from 'react';
import styled from 'styled-components';
import { 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Switch, 
  Divider,
  TextField,
  Button,
  Avatar,
  Box,
  Link,
  IconButton
} from '@mui/material';
import { motion } from 'framer-motion';
import { PhotoCamera, Edit, Person, Notifications, DarkMode, Update } from '@mui/icons-material';
import { User } from '../../services/type';

// 使用相对路径引用背景图片
const defaultBgImage = process.env.PUBLIC_URL + '/assets/bg.png';

const PageContainer = styled(motion.div)`
  padding: 20px;
  width: 100%;
  grid-column: 1 / -1;
`;

const ContentPaper = styled(Paper)`
  padding: 24px;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  max-width: 800px;
  margin: 0 auto;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const SettingsList = styled(List)`
  width: 100%;
`;

const SettingsItem = styled(ListItem)`
  border-radius: 15px;
  margin-bottom: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
  }
`;

const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

const StyledAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.05);
  }
`;

const PreviewImage = styled('img')`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
  margin-top: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const ProfileHeader = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
  position: relative;
  padding: 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
`;

const AvatarContainer = styled(Box)`
  position: relative;
  margin-bottom: 16px;
`;

const EditButton = styled(IconButton)`
  position: absolute;
  bottom: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.9) !important;
  padding: 8px !important;
  transition: all 0.3s ease !important;

  &:hover {
    background: white !important;
    transform: scale(1.1);
  }
`;

const StyledButton = styled(Button)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 24px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.4);
  }
`;

const SettingIcon = styled(Box)`
  margin-right: 16px;
  color: rgba(255, 255, 255, 0.7);
`;

interface UserSettingsProps {
  currentUser: User;
  onUpdateSettings: (settings: any) => Promise<void>;
  onUpdateAvatar: (file: File) => Promise<void>;
  onUpdateBackground: (file: File) => Promise<void>;
}

const UserSettings: React.FC<UserSettingsProps> = ({
  currentUser,
  onUpdateSettings,
  onUpdateAvatar,
  onUpdateBackground
}) => {
  const [settings, setSettings] = React.useState({
    notifications: true,
    darkMode: true,
    autoUpdate: false,
  });
  const [username, setUsername] = React.useState(currentUser.username);
  const [usernameError, setUsernameError] = React.useState('');
  const [isUpdating, setIsUpdating] = React.useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleUsernameChange = async () => {
    if (!username.trim()) {
      setUsernameError('Username cannot be empty');
      return;
    }

    if (username === currentUser.username) {
      setUsernameError('New username is same as current username');
      return;
    }

    try {
      setIsUpdating(true);
      setUsernameError('');
      await onUpdateSettings({
        user: {
          username: username.trim(),  // 确保去除空格
          email: currentUser.email
        }
      });
    } catch (error: any) {
      console.error('Update error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      setUsernameError(
        error.response?.data?.detail || 
        error.response?.data?.message || 
        error.message || 
        'Failed to update username'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await onUpdateAvatar(file);
        // 清除文件输入，以便可以再次选择同一文件
        if (avatarInputRef.current) {
          avatarInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Failed to update avatar:', error);
      }
    }
  };

  const handleBackgroundChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await onUpdateBackground(file);
        // 清除文件输入，以便可以再次选择同一文件
        if (backgroundInputRef.current) {
          backgroundInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Failed to update background:', error);
      }
    }
  };

  const handleAvatarClick = () => {
    const avatarUrl = currentUser.avatar_url;
    console.log('Current avatar URL:', avatarUrl);
    
    // 尝试加载图片并验证是否存在
    if (avatarUrl) {
      fetch(avatarUrl)
        .then(response => {
          console.log('Avatar response status:', response.status);
          console.log('Avatar response headers:', response.headers);
          if (!response.ok) {
            console.error('Avatar image not found or inaccessible');
          }
        })
        .catch(error => {
          console.error('Error checking avatar:', error);
        });
    } else {
      console.log('No avatar URL set');
    }
  };

  const handleBackgroundClick = () => {
    const bgUrl = currentUser.background_image || defaultBgImage;
    console.log('Current background image path:', bgUrl);
    
    if (currentUser.background_image) {
      // 用户上传的背景图片
      console.log('Custom background image URL:', currentUser.background_image);
      fetch(currentUser.background_image)
        .then(response => {
          console.log('Background response status:', response.status);
          console.log('Background response headers:', response.headers);
          if (!response.ok) {
            console.error('Background image not found or inaccessible');
          }
        })
        .catch(error => {
          console.error('Error checking background:', error);
        });
    } else {
      // 默认背景图片
      console.log('Using default background image from public assets');
      console.log('Full path to default background:', defaultBgImage);
    }
  };

  return (
    <PageContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Typography 
        variant="h4" 
        sx={{ 
          color: 'white', 
          marginBottom: 3, 
          textAlign: 'center',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }}
      >
        Profile Settings
      </Typography>
      
      <ContentPaper elevation={3}>
        <ProfileHeader>
          <AvatarContainer>
            <StyledAvatar
              src={currentUser.avatar_url || undefined}
              alt={currentUser.username}
            />
            <label style={{ cursor: 'pointer' }}>
              <EditButton
                size="small"
                onClick={() => avatarInputRef.current?.click()}
              >
                <PhotoCamera fontSize="small" />
              </EditButton>
              <VisuallyHiddenInput
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </label>
          </AvatarContainer>
          
          <Typography variant="h5" sx={{ color: 'white', mb: 1 }}>
            {currentUser.username}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            {currentUser.email}
          </Typography>
        </ProfileHeader>

        <SettingsList>
          <SettingsItem>
            <SettingIcon>
              <Person />
            </SettingIcon>
            <Box width="100%">
              <Typography variant="subtitle1" sx={{ color: 'white', mb: 2 }}>
                Username
              </Typography>
              <TextField
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={!!usernameError}
                helperText={usernameError}
                disabled={isUpdating}
                sx={{
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: 'white' }
                  }
                }}
              />
              <StyledButton
                onClick={handleUsernameChange}
                disabled={isUpdating}
                startIcon={<Edit />}
                sx={{ mt: 2 }}
              >
                {isUpdating ? 'Updating...' : 'Update Username'}
              </StyledButton>
              {isUpdating && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block', 
                    mt: 1, 
                    color: 'rgba(255,255,255,0.7)',
                    fontStyle: 'italic'
                  }}
                >
                  After updating, you will be logged out automatically...
                </Typography>
              )}
            </Box>
          </SettingsItem>

          <SettingsItem>
            <SettingIcon>
              <PhotoCamera />
            </SettingIcon>
            <Box width="100%">
              <Typography variant="subtitle1" sx={{ color: 'white', mb: 2 }}>
                Background Image
              </Typography>
              <Box sx={{ 
                width: '100%', 
                height: '200px', 
                borderRadius: '15px',
                overflow: 'hidden',
                mb: 2,
                position: 'relative',
                cursor: 'pointer'
              }}>
                <PreviewImage
                  src={currentUser.background_image || defaultBgImage}
                  alt="Background Preview"
                  onClick={handleBackgroundClick}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>
              <label style={{ cursor: 'pointer', width: '100%', display: 'block' }}>
                <StyledButton
                  startIcon={<PhotoCamera />}
                  sx={{ mt: 2 }}
                  onClick={() => backgroundInputRef.current?.click()}
                  fullWidth
                >
                  Change Background
                </StyledButton>
                <VisuallyHiddenInput
                  ref={backgroundInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundChange}
                  style={{ display: 'none' }}
                />
              </label>
            </Box>
          </SettingsItem>

          <SettingsItem>
            <SettingIcon>
              <Notifications />
            </SettingIcon>
            <ListItemText 
              primary="Notifications"
              secondary="Receive alerts and notifications"
              sx={{ 
                color: 'white', 
                '.MuiListItemText-secondary': { 
                  color: 'rgba(255,255,255,0.7)',
                  mt: 0.5
                }
              }}
            />
            <Switch 
              checked={settings.notifications}
              onChange={() => handleToggle('notifications')}
              sx={{ 
                '& .MuiSwitch-switchBase.Mui-checked': { 
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
                }
              }}
            />
          </SettingsItem>

          <SettingsItem>
            <SettingIcon>
              <DarkMode />
            </SettingIcon>
            <ListItemText 
              primary="Dark Mode"
              secondary="Toggle dark/light theme"
              sx={{ 
                color: 'white', 
                '.MuiListItemText-secondary': { 
                  color: 'rgba(255,255,255,0.7)',
                  mt: 0.5
                }
              }}
            />
            <Switch 
              checked={settings.darkMode}
              onChange={() => handleToggle('darkMode')}
              sx={{ 
                '& .MuiSwitch-switchBase.Mui-checked': { 
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
                }
              }}
            />
          </SettingsItem>

          <SettingsItem>
            <SettingIcon>
              <Update />
            </SettingIcon>
            <ListItemText 
              primary="Auto Update"
              secondary="Automatically update dashboard data"
              sx={{ 
                color: 'white', 
                '.MuiListItemText-secondary': { 
                  color: 'rgba(255,255,255,0.7)',
                  mt: 0.5
                }
              }}
            />
            <Switch 
              checked={settings.autoUpdate}
              onChange={() => handleToggle('autoUpdate')}
              sx={{ 
                '& .MuiSwitch-switchBase.Mui-checked': { 
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
                }
              }}
            />
          </SettingsItem>
        </SettingsList>
      </ContentPaper>
    </PageContainer>
  );
};

export default UserSettings; 