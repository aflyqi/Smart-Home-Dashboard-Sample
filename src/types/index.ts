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

export interface EnergyUsageData {
  timestamp: string;
  usage: number;
  efficiency: number;
} 