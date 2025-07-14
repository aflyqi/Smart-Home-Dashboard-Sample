import React, { useState, useCallback } from 'react';
import Dashboard from './components/Layout/Dashboard';
import DeviceCard from './components/DeviceCard/DeviceCard';
import EnvironmentCard from './components/EnvironmentCard/EnvironmentCard';
import EnergyChart from './components/EnergyChart/EnergyChart';
import GlobalStyles from './styles/GlobalStyles';
import { DeviceType, EnvironmentData, TimeSeriesData } from './types';

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

function App() {
  const [devices, setDevices] = useState<DeviceType[]>(initialDevices);
  const [energyData, setEnergyData] = useState<{
    history: TimeSeriesData[];
    forecast: TimeSeriesData[];
  }>({ history: [], forecast: [] });

  // 计算当前开启设备的总能耗
  const calculateTotalPowerUsage = useCallback((deviceList: DeviceType[]): number => {
    return deviceList
      .filter(device => device.isOn)
      .reduce((total, device) => total + device.powerUsage, 0);
  }, []);

  // 更新预测数据
  const updateForecastWithDevices = useCallback((
    currentForecast: TimeSeriesData[],
    additionalPower: number
  ): TimeSeriesData[] => {
    return currentForecast.map(point => ({
      ...point,
      value: point.value + additionalPower
    }));
  }, []);

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
          forecast: updateForecastWithDevices(prevData.forecast, powerChange)
        }));
      }
      
      return newDevices;
    });
  }, [updateForecastWithDevices]);

  // 处理能源数据更新
  const handleEnergyDataUpdate = useCallback((newData: {
    history: TimeSeriesData[];
    forecast: TimeSeriesData[];
  }) => {
    // 计算当前设备的总能耗
    const totalPowerUsage = calculateTotalPowerUsage(devices);
    
    // 更新预测数据，加入当前开启设备的能耗
    const updatedForecast = updateForecastWithDevices(newData.forecast, totalPowerUsage);
    
    setEnergyData({
      history: newData.history,
      forecast: updatedForecast
    });
  }, [devices, calculateTotalPowerUsage, updateForecastWithDevices]);

  return (
    <>
      <GlobalStyles />
      <Dashboard>
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
    </>
  );
}

export default App;
