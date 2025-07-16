// API相关类型定义
export interface User {
  id: number;
  username: string;
  email: string;
  avatar_url?: string;
  background_image?: string;
  created_at: string;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface MetricsData {
  global_active_power: number;
  global_reactive_power: number;
  voltage: number;
  global_intensity: number;
  sub_metering_1: number;
  sub_metering_2: number;
  sub_metering_3: number;
  timestamp: string;
}

export interface DeviceData {
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

export interface DashboardData {
  devices: DeviceData[];
  environment: EnvironmentData;
  energyData: EnergyUsageData[];
}

export interface ApiError {
  detail: string;
} 