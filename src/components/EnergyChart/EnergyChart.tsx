import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartJSTitle,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { TimeSeriesData, HistoryResponse, ForecastResponse } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartJSTitle,
  Tooltip,
  Legend,
  Filler
);

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 20px;
  color: white;
  grid-column: 1 / -1;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
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
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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

const LoadingText = styled.div`
  color: white;
  text-align: center;
  padding: 20px;
  font-size: 1.1rem;
`;

const ErrorText = styled.div`
  color: #ff6b6b;
  text-align: center;
  padding: 20px;
  font-size: 1.1rem;
`;

const RetryButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  padding: 8px 16px;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

interface EnergyChartProps {
  energyData: {
    history: TimeSeriesData[];
    forecast: TimeSeriesData[];
  };
  onDataUpdate: (data: {
    history: TimeSeriesData[];
    forecast: TimeSeriesData[];
  }) => void;
}

const EnergyChart: React.FC<EnergyChartProps> = ({ energyData, onDataUpdate }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get historical data
      const historyResponse = await fetch('http://127.0.0.1:8000/history');
      if (!historyResponse.ok) {
        throw new Error('Failed to fetch historical data');
      }
      const historyData: HistoryResponse = await historyResponse.json();

      // Get forecast data
      const forecastResponse = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ history: historyData.history }),
      });
      if (!forecastResponse.ok) {
        throw new Error('Failed to fetch forecast data');
      }
      const forecastData: ForecastResponse = await forecastResponse.json();

      // 通知父组件数据更新
      onDataUpdate({
        history: forecastData.history,
        forecast: forecastData.forecast,
      });
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load data');
      
      // Use mock data
      const mockHistory: TimeSeriesData[] = Array.from({ length: 7 }, (_, i) => ({
        value: 9 + Math.random() * 2,
        timestamp: new Date(Date.now() - (6 - i) * 3600000).toISOString(),
      }));
      const mockForecast: TimeSeriesData[] = Array.from({ length: 3 }, (_, i) => ({
        value: 9 + Math.random() * 2,
        timestamp: new Date(Date.now() + (i + 1) * 3600000).toISOString(),
      }));
      onDataUpdate({ history: mockHistory, forecast: mockForecast });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  // Show loading state
  if (loading && energyData.history.length === 0) {
    return (
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <LoadingText>Loading data...</LoadingText>
      </Card>
    );
  }

  // Show error state
  if (error && energyData.history.length === 0) {
    return (
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ErrorText>{error}</ErrorText>
        <RetryButton onClick={fetchData}>Retry</RetryButton>
      </Card>
    );
  }

  const chartData = {
    labels: [...energyData.history, ...energyData.forecast].map(d => formatTime(d.timestamp)),
    datasets: [
      {
        label: 'Historical Data',
        data: energyData.history.map(d => d.value),
        borderColor: '#e056fd',
        backgroundColor: 'rgba(224, 86, 253, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Forecast Data',
        data: [
          ...Array(energyData.history.length - 1).fill(null), 
          ...(energyData.history.length > 0 ? [energyData.history[energyData.history.length - 1].value] : []),
          ...energyData.forecast.map(d => d.value)
        ],
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

  const currentValue = energyData.history[energyData.history.length - 1]?.value || 0;
  const predictedValue = energyData.forecast[energyData.forecast.length - 1]?.value || 0;

  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <ChartTitle>Energy Usage Trend</ChartTitle>
        <Stats>
          <StatItem>
            <StatValue>{currentValue.toFixed(2)} kWh</StatValue>
            <StatLabel>Current Usage</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{predictedValue.toFixed(2)} kWh</StatValue>
            <StatLabel>Predicted Usage</StatLabel>
          </StatItem>
        </Stats>
      </Header>
      
      <Line data={chartData} options={options} />
    </Card>
  );
};

export default EnergyChart; 