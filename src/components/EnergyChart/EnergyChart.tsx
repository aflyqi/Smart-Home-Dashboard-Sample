import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TimeSeriesData, HistoryResponse, ForecastResponse } from '../../types';

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// 调整卡片样式
const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  grid-column: span 3; // 横跨3列
  min-height: 400px; // 设置最小高度
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 350px; // 图表最小高度
  position: relative;
  padding: 10px;
  flex: 1;
`;

const LoadingText = styled.div`
  text-align: center;
  font-size: 1.2em;
  color: #fff;
  margin: auto;
`;

const ErrorText = styled.div`
  color: #ff6b6b;
  text-align: center;
  margin: 20px 0;
`;

const RetryButton = styled.button`
  background: #e056fd;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1em;
  transition: all 0.3s ease;
  margin: 10px auto;
  display: block;

  &:hover {
    background: #c736e3;
    transform: translateY(-2px);
  }
`;

const ChartHeading = styled.h2`
  color: #fff;
  font-size: 1.5em;
  margin: 0 0 20px 0;
  text-align: center;
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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isInitialMount = useRef(true);

  // 生成模拟数据的辅助函数
  const generateMockData = useCallback(() => {
    const now = Date.now();
    const mockHistory = Array.from({ length: 7 }, (_, i) => ({
      value: Math.max(5, 9 + Math.random() * 2), // 确保值始终为正数
      timestamp: new Date(now - (6 - i) * 3600000).toISOString(),
    }));
    const mockForecast = Array.from({ length: 3 }, (_, i) => ({
      value: Math.max(5, 9 + Math.random() * 2), // 确保值始终为正数
      timestamp: new Date(now + (i + 1) * 3600000).toISOString(),
    }));
    return { mockHistory, mockForecast };
  }, []);

  const fetchData = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Get historical data
      const historyResponse = await fetch('http://127.0.0.1:8000/history');
      if (!historyResponse.ok) {
        throw new Error('Failed to fetch historical data');
      }
      const historyData = await historyResponse.json();

      // 验证数据格式
      if (!Array.isArray(historyData.history)) {
        throw new Error('Invalid history data format');
      }

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
      const forecastData = await forecastResponse.json();

      // 验证数据格式
      if (!Array.isArray(forecastData.forecast)) {
        throw new Error('Invalid forecast data format');
      }

      onDataUpdate({
        history: historyData.history,
        forecast: forecastData.forecast,
      });
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load data');
      
      // 只在完全没有数据时使用模拟数据
      if (!energyData.history.length && !energyData.forecast.length) {
        const { mockHistory, mockForecast } = generateMockData();
        onDataUpdate({
          history: mockHistory,
          forecast: mockForecast,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [loading, onDataUpdate, energyData.history.length, energyData.forecast.length, generateMockData]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // 只在没有数据时才获取新数据
      if (!energyData.history.length && !energyData.forecast.length) {
        fetchData();
      }
    }
    
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, [fetchData, energyData.history.length, energyData.forecast.length]);

  // 显示加载状态
  if (loading && !energyData.history.length && !energyData.forecast.length) {
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

  // 显示错误状态
  if (error && !energyData.history.length && !energyData.forecast.length) {
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
          // 确保数组长度有效
          ...Array(Math.max(0, energyData.history.length - 1)).fill(null),
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

  // 确保有数据时才渲染图表
  if (!energyData.history.length && !energyData.forecast.length) {
    return (
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <LoadingText>No data available</LoadingText>
      </Card>
    );
  }

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

  // 在渲染图表部分添加标题和容器
  return (
    <Card>
      <ChartHeading>Energy Usage Forecast</ChartHeading>
      <ChartContainer>
        <Line
          data={chartData}
          options={{
            maintainAspectRatio: false, // 允许图表填充容器
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                  color: '#fff',
                },
              },
              x: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                  color: '#fff',
                },
              },
            },
            plugins: {
              legend: {
                labels: {
                  color: '#fff',
                  font: {
                    size: 12,
                  },
                },
              },
              tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#000',
                bodyColor: '#000',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                borderWidth: 1,
              },
            },
          }}
        />
      </ChartContainer>
    </Card>
  );
};

export default EnergyChart; 