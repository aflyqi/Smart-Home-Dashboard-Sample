import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  ElectricBolt,
  Speed,
  Bolt,
  Power,
  DeviceHub,
} from '@mui/icons-material';
import { MetricsData } from '../../services/type';

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
  grid-column: 1 / -1;
  
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
  margin-bottom: 10px;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  margin: 0;
`;

const UpdateTime = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 15px;
  
  @media (max-width: 1400px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
  
  @media (max-width: 1000px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const MetricItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  min-height: 110px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
`;

const IconContainer = styled.div`
  margin-bottom: 8px;
  
  svg {
    font-size: 1.8rem;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  }
`;

const MetricLabel = styled.span`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin-bottom: 6px;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  line-height: 1.2;
  font-weight: 500;
`;

const MetricValue = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: white;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

interface MetricsCardProps {
  data: MetricsData;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ data }) => {
  const metrics = [
    {
      label: 'Global Active Power',
      value: `${data.global_active_power} kW`,
      icon: <ElectricBolt sx={{ color: '#ffa726' }} />,
    },
    {
      label: 'Global Reactive Power',
      value: `${data.global_reactive_power} kW`,
      icon: <Power sx={{ color: '#ffcc02' }} />,
    },
    {
      label: 'Voltage',
      value: `${data.voltage} V`,
      icon: <Bolt sx={{ color: '#42a5f5' }} />,
    },
    {
      label: 'Global Intensity',
      value: `${data.global_intensity} A`,
      icon: <Speed sx={{ color: '#ffcc02' }} />,
    },
    {
      label: 'Sub Metering',
      value: `${data.sub_metering_1} kWh`,
      icon: <DeviceHub sx={{ color: '#ab9b8e' }} />,
    },
    {
      label: 'Sub Metering 2',
      value: `${data.sub_metering_2} kWh`,
      icon: <DeviceHub sx={{ color: '#ab9b8e' }} />,
    },
    {
      label: 'Sub Metering 3',
      value: `${data.sub_metering_3} kWh`,
      icon: <DeviceHub sx={{ color: '#ab9b8e' }} />,
    },
  ];

  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <Title>Real-time Metrics</Title>
        <UpdateTime>
          Updated: {new Date(data.timestamp).toLocaleString('en-US')}
        </UpdateTime>
      </Header>
      
      <MetricsGrid>
        {metrics.map((metric, index) => (
          <MetricItem key={index}>
            <IconContainer>
              {metric.icon}
            </IconContainer>
            <MetricLabel>{metric.label}</MetricLabel>
            <MetricValue>{metric.value}</MetricValue>
          </MetricItem>
        ))}
      </MetricsGrid>
    </Card>
  );
};

export default MetricsCard; 