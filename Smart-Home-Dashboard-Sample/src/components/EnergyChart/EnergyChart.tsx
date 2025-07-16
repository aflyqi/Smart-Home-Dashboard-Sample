import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { EnergyUsageData } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  color: white;
  grid-column: 1 / -1;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ChartTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 500;
`;

const Stats = styled.div`
  display: flex;
  gap: 20px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const StatValue = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
`;

interface EnergyChartProps {
  data: EnergyUsageData[];
}

const EnergyChart: React.FC<EnergyChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.timestamp),
    datasets: [
      {
        label: 'Energy Usage',
        data: data.map(d => d.usage),
        borderColor: '#e056fd',
        backgroundColor: 'rgba(224, 86, 253, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Efficiency',
        data: data.map(d => d.efficiency),
        borderColor: '#2ed573',
        backgroundColor: 'rgba(46, 213, 115, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
    },
  };

  const currentUsage = data[data.length - 1]?.usage || 0;
  const currentEfficiency = data[data.length - 1]?.efficiency || 0;

  return (
    <Card
      className="glass-effect"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <ChartTitle>Energy Usage</ChartTitle>
        <Stats>
          <StatItem>
            <StatValue>{currentUsage.toFixed(1)} kWh</StatValue>
            <StatLabel>Current Usage</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{currentEfficiency.toFixed(1)}%</StatValue>
            <StatLabel>Efficiency</StatLabel>
          </StatItem>
        </Stats>
      </Header>
      
      <Line data={chartData} options={options} />
    </Card>
  );
};

export default EnergyChart; 