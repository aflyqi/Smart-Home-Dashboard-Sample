import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from './components/Layout/Dashboard';
import DeviceCard from './components/DeviceCard/DeviceCard';
import EnvironmentCard from './components/EnvironmentCard/EnvironmentCard';
import EnergyChart from './components/EnergyChart/EnergyChart';
import MetricsCard from './components/MetricsCard/MetricsCard';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import SuggestionLogs from './components/Pages/SuggestionLogs';
import Tips from './components/Pages/Tips';
import UserSettings from './components/Pages/UserSettings';
import GlobalStyles from './styles/GlobalStyles';
import { DeviceType, EnvironmentData, EnergyUsageData } from './types';
import { MetricsData, User } from './services/type';
import { authAPI, metricsAPI, dashboardAPI, apiUtils, userSettingsAPI } from './services/api';
import { Alert, Snackbar } from '@mui/material';

type AuthMode = 'login' | 'register';
type PageMode = 'dashboard' | 'suggestion logs' | 'tips' | 'User settings';

function App() {
  const [devices, setDevices] = useState<DeviceType[]>([]);
  const [environmentData, setEnvironmentData] = useState<EnvironmentData>({ humidity: 0, temperature: 0 });
  const [energyData, setEnergyData] = useState<EnergyUsageData[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [metricsData, setMetricsData] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<PageMode>('dashboard');

  // 获取用户信息
  const fetchUserProfile = useCallback(async () => {
    try {
      const user = await authAPI.getProfile();
      // 添加时间戳以防止缓存
      const updatedUser = {
        ...user,
        avatar_url: user.avatar_url ? user.avatar_url + '?t=' + new Date().getTime() : undefined,
        background_image: user.background_image ? user.background_image + '?t=' + new Date().getTime() : undefined
      };
      setCurrentUser(updatedUser);
      // 如果用户有自定义背景，设置背景
      if (updatedUser.background_image) {
        document.body.style.backgroundImage = `url(${updatedUser.background_image})`;
      }
      console.log('User profile fetched:', updatedUser);
    } catch (error: any) {
      console.error('Failed to fetch user profile:', error);
      setError('Failed to fetch user profile: ' + (error.response?.data?.detail || error.message));
      handleLogout();
    }
  }, []);

  // 检查用户是否已登录
  useEffect(() => {
    const token = apiUtils.getAuthToken();
    if (token) {
      setIsAuthenticated(true);
      fetchUserProfile();
    }
  }, [fetchUserProfile]);

  // 获取指标数据
  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const data = await metricsAPI.getMetrics();
      setMetricsData(data);
    } catch (error: any) {
      console.error('Failed to fetch metrics:', error);
      setError('Failed to obtain indicator data: ' + (error.response?.data?.detail || error.message));
      // 如果是认证错误，清除认证状态
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  // 获取仪表板数据
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardAPI.getDashboardData();
      setDevices(data.devices);
      setEnvironmentData(data.environment);
      setEnergyData(data.energyData);
    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to obtain dashboard data: ' + (error.response?.data?.detail || error.message));
      // 如果是认证错误，清除认证状态
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  // 定期获取数据
  useEffect(() => {
    if (isAuthenticated) {
      fetchMetrics();
      fetchDashboardData();
      const interval = setInterval(() => {
        fetchMetrics();
        fetchDashboardData();
      }, 30000); // 每30秒更新一次
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleDeviceToggle = async (deviceId: string, isOn: boolean) => {
    try {
      await dashboardAPI.toggleDevice(deviceId);
      setDevices(prevDevices =>
        prevDevices.map(device =>
          device.id === deviceId ? { ...device, isOn } : device
        )
      );
      setSuccess('设备状态已更新');
    } catch (error: any) {
      setError('设备控制失败: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleLoginSuccess = async (token: string) => {
    try {
      // 先设置token
      apiUtils.setAuthToken(token);
      setIsAuthenticated(true);
      // 然后获取用户信息
      await fetchUserProfile();
      setSuccess('Login successfully！');
      // 获取仪表板数据
      fetchMetrics();
      fetchDashboardData();
    } catch (error: any) {
      console.error('Login process failed:', error);
      setError('Login process failed: ' + (error.response?.data?.detail || error.message));
      handleLogout();
    }
  };

  const handleRegisterSuccess = () => {
    setAuthMode('login');
    setSuccess('Register successfully！Please login');
  };

  const handleLogout = () => {
    apiUtils.clearAuth();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setMetricsData(null);
    setDevices([]);
    setEnvironmentData({ humidity: 0, temperature: 0 });
    setEnergyData([]);
    setSuccess('Logout successfully！');
  };

  const handleSwitchAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  };

  const handleRefreshData = () => {
    fetchMetrics();
    fetchDashboardData();
  };

  const handleUpdateSettings = async (settings: any) => {
    try {
      const updatedUser = await userSettingsAPI.updateSettings(settings);
      setCurrentUser(updatedUser);
      setSuccess('Settings updated successfully');

      // 如果更新了用户名，延迟1.5秒后自动退出登录
      if (settings.username && settings.username !== currentUser?.username) {
        setSuccess('Username updated successfully. You will be logged out in 2 seconds...');
        setTimeout(() => {
          handleLogout();
          setAuthMode('login');  // 切换到登录模式
        }, 2000);
      }
    } catch (error: any) {
      setError('Failed to update settings: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleUpdateAvatar = async (file: File) => {
    try {
      const updatedUser = await userSettingsAPI.updateAvatar(file);
      // 强制刷新头像
      const avatarUrl = updatedUser.avatar_url + '?t=' + new Date().getTime();
      const newUser = {
        ...updatedUser,
        avatar_url: avatarUrl,
        // 保持现有的背景图片
        background_image: currentUser?.background_image || updatedUser.background_image
      };
      setCurrentUser(newUser);
      setSuccess('Avatar updated successfully');
    } catch (error: any) {
      setError('Failed to update avatar: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleUpdateBackground = async (file: File) => {
    try {
      const updatedUser = await userSettingsAPI.updateBackground(file);
      // 强制刷新背景图片
      const backgroundUrl = updatedUser.background_image + '?t=' + new Date().getTime();
      const newUser = {
        ...updatedUser,
        background_image: backgroundUrl,
        // 保持现有的头像
        avatar_url: currentUser?.avatar_url || updatedUser.avatar_url
      };
      setCurrentUser(newUser);
      // 更新全局样式中的背景图片
      document.body.style.backgroundImage = `url(${backgroundUrl})`;
      setSuccess('Background updated successfully');
    } catch (error: any) {
      setError('Failed to update background: ' + (error.response?.data?.detail || error.message));
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <>
            {devices.map(device => (
              <DeviceCard
                key={device.id}
                device={device}
                onToggle={(isOn) => handleDeviceToggle(device.id, isOn)}
              />
            ))}
            <EnvironmentCard data={environmentData} />
            {metricsData && <MetricsCard data={metricsData} />}
            <EnergyChart data={energyData} />
          </>
        );
      case 'suggestion logs':
        return <SuggestionLogs />;
      case 'tips':
        return <Tips />;
      case 'User settings':
        return currentUser ? (
          <UserSettings
            currentUser={currentUser}
            onUpdateSettings={handleUpdateSettings}
            onUpdateAvatar={handleUpdateAvatar}
            onUpdateBackground={handleUpdateBackground}
          />
        ) : null;
      default:
        return null;
    }
  };

  const handlePageChange = (page: PageMode) => {
    setCurrentPage(page);
    // 切换到仪表板时刷新数据
    if (page === 'dashboard') {
      fetchMetrics();
      fetchDashboardData();
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <GlobalStyles />
        {authMode === 'login' ? (
          <LoginForm
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={handleSwitchAuthMode}
          />
        ) : (
          <RegisterForm
            onRegisterSuccess={handleRegisterSuccess}
            onSwitchToLogin={handleSwitchAuthMode}
          />
        )}
        <Snackbar
          open={!!success}
          autoHideDuration={3000}
          onClose={() => setSuccess('')}
        >
          <Alert severity="success" onClose={() => setSuccess('')}>
            {success}
          </Alert>
        </Snackbar>
      </>
    );
  }

  return (
    <>
      <GlobalStyles />
      <Dashboard 
        currentUser={currentUser}
        onRefreshData={handleRefreshData}
        onLogout={handleLogout}
        loading={loading}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      >
        {renderCurrentPage()}
      </Dashboard>

      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess('')}
      >
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>
    </>
  );
}

export default App;
