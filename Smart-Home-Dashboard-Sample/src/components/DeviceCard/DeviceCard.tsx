import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Switch } from '@mui/material';
import { DeviceType } from '../../types';

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
`;

const StatusText = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
`;

interface DeviceCardProps {
  device: DeviceType;
  onToggle: (isOn: boolean) => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onToggle }) => {
  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <Title>{device.name}</Title>
        <Switch
          checked={device.isOn}
          onChange={(e) => onToggle(e.target.checked)}
          color="primary"
        />
      </Header>
      
      <Details>
        <StatusText>
          {device.devices} devices • {device.powerUsage} kWh
        </StatusText>
        {device.powerOnTime && (
          <StatusText>
            Power on time: {device.powerOnTime}
          </StatusText>
        )}
      </Details>
    </Card>
  );
};

export default DeviceCard; 