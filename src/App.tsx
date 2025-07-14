import React, { useState } from 'react';
import Dashboard from './components/Layout/Dashboard';
import DeviceCard from './components/DeviceCard/DeviceCard';
import EnvironmentCard from './components/EnvironmentCard/EnvironmentCard';
import EnergyChart from './components/EnergyChart/EnergyChart';
import GlobalStyles from './styles/GlobalStyles';
import { DeviceType, EnvironmentData } from './types';

const initialDevices: DeviceType[] = [
  {
    id: '1',
    name: 'Air Conditioner',
    isOn: true,
    devices: 4,
    powerUsage: 24.9,
    powerOnTime: '14hr 32min',
  },
  {
    id: '2',
    name: 'Lamp',
    isOn: true,
    devices: 4,
    powerUsage: 24.9,
  },
  {
    id: '3',
    name: 'Audio',
    isOn: true,
    devices: 4,
    powerUsage: 24.9,
    powerOnTime: '2hr',
  },
  {
    id: '4',
    name: 'Refrigerator',
    isOn: false,
    devices: 4,
    powerUsage: 24.9,
    powerOnTime: '24hr',
  },
];

const environmentData: EnvironmentData = {
  humidity: 76,
  temperature: 24,
};

function App() {
  const [devices, setDevices] = useState<DeviceType[]>(initialDevices);

  const handleDeviceToggle = (deviceId: string, isOn: boolean) => {
    setDevices(prevDevices =>
      prevDevices.map(device =>
        device.id === deviceId ? { ...device, isOn } : device
      )
    );
  };

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
        <EnergyChart />
      </Dashboard>
    </>
  );
}

export default App;
