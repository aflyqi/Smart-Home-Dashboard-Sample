import React, { memo } from 'react';
import styled from 'styled-components';
import { EnvironmentData } from '../../types';

const Card = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const DataRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9em;
`;

const Value = styled.span`
  color: white;
  font-size: 1.2em;
  font-weight: 500;
`;

interface EnvironmentCardProps {
  data: EnvironmentData;
}

const EnvironmentCard = memo(function EnvironmentCard({ data }: EnvironmentCardProps) {
  return (
    <Card>
      <DataRow>
        <Label>Temperature</Label>
        <Value>{data.temperature}°C</Value>
      </DataRow>
      <DataRow>
        <Label>Humidity</Label>
        <Value>{data.humidity}%</Value>
      </DataRow>
    </Card>
  );
});

EnvironmentCard.displayName = 'EnvironmentCard';

export default EnvironmentCard; 