import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { EnvironmentData } from '../../types';

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  color: white;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const DataItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 15px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const Value = styled.div`
  font-size: 2.5rem;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const Label = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const Status = styled.div<{ status: 'Good' | 'Comfortable' }>`
  font-size: 0.8rem;
  padding: 4px 12px;
  border-radius: 12px;
  background: ${props => props.status === 'Good' ? 'rgba(46, 213, 115, 0.3)' : 'rgba(46, 149, 213, 0.3)'};
  color: ${props => props.status === 'Good' ? '#2ed573' : '#2e95d5'};
  backdrop-filter: blur(5px);
  border: 1px solid ${props => props.status === 'Good' ? 'rgba(46, 213, 115, 0.3)' : 'rgba(46, 149, 213, 0.3)'};
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
`;

interface EnvironmentCardProps {
  data: EnvironmentData;
}

const EnvironmentCard: React.FC<EnvironmentCardProps> = ({ data }) => {
  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <DataItem>
        <Value>{data.humidity}%</Value>
        <Label>Humidity</Label>
        <Status status="Good">Good</Status>
      </DataItem>

      <DataItem>
        <Value>{data.temperature}°C</Value>
        <Label>Temperature</Label>
        <Status status="Comfortable">Comfortable</Status>
      </DataItem>
    </Card>
  );
};

export default EnvironmentCard; 