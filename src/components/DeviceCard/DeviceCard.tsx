import React, { memo, useCallback } from 'react';
import styled from 'styled-components';
import { DeviceType } from '../../types';

const Card = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const DeviceName = styled.h3`
  margin: 0;
  color: white;
  font-size: 1.2em;
  font-weight: 500;
`;

const DeviceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
  
  span {
    color: rgba(255, 255, 255, 0.7);
    
    &:last-child {
      color: white;
      font-weight: 500;
    }
  }
`;

const ToggleButton = styled.button<{ isOn: boolean }>`
  background: ${props => props.isOn ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1em;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }
`;

interface DeviceCardProps {
  device: DeviceType;
  onToggle: (isOn: boolean) => void;
}

const DeviceCard = memo(function DeviceCard({ device, onToggle }: DeviceCardProps) {
  const handleToggle = useCallback(() => {
    onToggle(!device.isOn);
  }, [device.isOn, onToggle]);

  return (
    <Card>
      <DeviceName>{device.name}</DeviceName>
      <DeviceInfo>
        <InfoItem>
          <span>Connected Devices</span>
          <span>{device.devices}</span>
        </InfoItem>
        <InfoItem>
          <span>Power Usage</span>
          <span>{device.powerUsage} kW</span>
        </InfoItem>
        {device.powerOnTime && (
          <InfoItem>
            <span>Power On Time</span>
            <span>{device.powerOnTime}</span>
          </InfoItem>
        )}
      </DeviceInfo>
      <ToggleButton
        isOn={device.isOn}
        onClick={handleToggle}
      >
        {device.isOn ? 'Turn Off' : 'Turn On'}
      </ToggleButton>
    </Card>
  );
});

DeviceCard.displayName = 'DeviceCard';

export default DeviceCard; 