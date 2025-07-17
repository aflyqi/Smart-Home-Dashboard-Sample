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
  value: number;
  timestamp: string;
}

export interface HistoryResponse {
  history: TimeSeriesData[];
}

export interface ForecastResponse {
  history: TimeSeriesData[];
  forecast: TimeSeriesData[];
}

export interface EnergyUsageData {
  history: TimeSeriesData[];
  forecast: TimeSeriesData[];
} 