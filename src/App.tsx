import React, { useState, useCallback, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, CircularProgress } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Dashboard from './components/Layout/Dashboard';
import DeviceCard from './components/DeviceCard/DeviceCard';
import EnvironmentCard from './components/EnvironmentCard/EnvironmentCard';
import EnergyChart from './components/EnergyChart/EnergyChart';
import GlobalStyles from './styles/GlobalStyles';
import { DeviceType, EnvironmentData, TimeSeriesData } from './types';
import ChatBot from './components/ChatBot/ChatBot';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

const initialDevices: DeviceType[] = [
  {
    id: '1',
    name: 'Air Conditioner',
    isOn: false,
    devices: 4,
    powerUsage: 2.5,
    powerOnTime: '14hr 32min',
  },
  {
    id: '2',
    name: 'Lamp',
    isOn: false,
    devices: 4,
    powerUsage: 0.8,
  },
  {
    id: '3',
    name: 'Audio',
    isOn: false,
    devices: 4,
    powerUsage: 1.2,
    powerOnTime: '2hr',
  },
  {
    id: '4',
    name: 'Refrigerator',
    isOn: false,
    devices: 4,
    powerUsage: 1.5,
    powerOnTime: '24hr',
  },
];

const environmentData: EnvironmentData = {
  humidity: 76,
  temperature: 24,
};

// 创建暗色主题
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: 'transparent',
      paper: 'rgba(255, 255, 255, 0.1)',
    },
  },
});

// 加载指示器组件
const LoadingSpinner = () => (
  <div style={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }}>
    <CircularProgress />
  </div>
);

function App() {
  const [devices, setDevices] = useState<DeviceType[]>(initialDevices);
  const [energyData, setEnergyData] = useState<{
    history: TimeSeriesData[];
    forecast: TimeSeriesData[];
  }>({ history: [], forecast: [] });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 监听登录状态变化
  useEffect(() => {
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loginStatus);
    };

    // 初始检查
    checkLoginStatus();

    // 监听storage变化
    window.addEventListener('storage', checkLoginStatus);
    window.addEventListener('login-status-change', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('login-status-change', checkLoginStatus);
    };
  }, []);

  // 处理设备状态更新
  const handleDeviceToggle = useCallback((deviceId: string, isOn: boolean) => {
    setDevices(prevDevices => {
      const newDevices = prevDevices.map(device =>
        device.id === deviceId ? { ...device, isOn } : device
      );
      
      // 找到被切换的设备
      const toggledDevice = prevDevices.find(d => d.id === deviceId);
      if (toggledDevice) {
        const powerChange = isOn ? toggledDevice.powerUsage : -toggledDevice.powerUsage;
        
        // 更新预测数据
        setEnergyData(prevData => ({
          ...prevData,
          forecast: prevData.forecast.map(point => ({
            ...point,
            value: point.value + powerChange
          }))
        }));
      }
      
      return newDevices;
    });
  }, []);

  // 处理能源数据更新
  const handleEnergyDataUpdate = useCallback((newData: {
    history: TimeSeriesData[];
    forecast: TimeSeriesData[];
  }) => {
    setEnergyData(prevEnergyData => {
      return {
        history: newData.history,
        forecast: newData.forecast.map(point => ({
          ...point,
          value: point.value
        }))
      };
    });
  }, []);

  const MainContent = () => (
    <Suspense fallback={<LoadingSpinner />}>
      <GlobalStyles />
      <Dashboard onChatToggle={setIsChatOpen}>
        {devices.map(device => (
          <DeviceCard
            key={device.id}
            device={device}
            onToggle={(isOn) => handleDeviceToggle(device.id, isOn)}
          />
        ))}
        <EnvironmentCard data={environmentData} />
        <EnergyChart 
          energyData={energyData}
          onDataUpdate={handleEnergyDataUpdate}
        />
      </Dashboard>
      <ChatBot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
        energyData={energyData}
      />
    </Suspense>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <MainContent /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/login"
            element={!isLoggedIn ? <Login /> : <Navigate to="/" replace />}
          />
          <Route
            path="/register"
            element={!isLoggedIn ? <Register /> : <Navigate to="/" replace />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
