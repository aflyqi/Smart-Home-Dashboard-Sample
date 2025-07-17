export interface DeviceType {
  id: string;
  name: string;
  isOn: boolean;
  devices: number;
  powerUsage: number;
  powerOnTime?: string;
}

export interface EnvironmentData {
  humidity: number;
  temperature: number;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
}

export interface HistoryResponse {
  history: TimeSeriesData[];
  status: string;
}

export interface ForecastResponse {
  history: TimeSeriesData[];
  forecast: TimeSeriesData[];
  status: string;
}

export interface DeviceCardProps {
  device: DeviceType;
  onToggle: (isOn: boolean) => void;
}

export interface EnvironmentCardProps {
  data: EnvironmentData;
}

export interface EnergyChartProps {
  energyData: {
    history: TimeSeriesData[];
    forecast: TimeSeriesData[];
  };
  onDataUpdate: (data: {
    history: TimeSeriesData[];
    forecast: TimeSeriesData[];
  }) => void;
}

export interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  energyData: {
    history: TimeSeriesData[];
    forecast: TimeSeriesData[];
  };
} 