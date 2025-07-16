import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  User, 
  UserCreate, 
  UserLogin, 
  AuthResponse, 
  MetricsData,
  DashboardData
} from './type';

// 创建API客户端实例
export const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 添加完整的API URL处理
const getFullApiUrl = (path: string) => {
  if (path && (path.startsWith('/uploads/') || path.startsWith('uploads/'))) {
    return `http://localhost:8000${path.startsWith('/') ? path : `/${path}`}`;
  }
  return path;
};

// 请求拦截器 - 添加认证token
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out');
      return Promise.reject(new Error('Request timed out. Please try again.'));
    }
    
    if (!error.response) {
      console.error('Network error:', error);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    if (error.response.status === 401) {
      console.error('Authentication error');
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
    
    console.error('Response error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    
    return Promise.reject(error);
  }
);

// 认证相关API
export const authAPI = {
  // 用户注册
  register: async (username: string, email: string, password: string): Promise<User> => {
    const response = await apiClient.post<User>('/register', {
      username,
      email,
      password,
    });
    return response.data;
  },

  // 用户登录
  login: async (username: string, password: string): Promise<string> => {
    const response = await apiClient.post<{ access_token: string }>('/login', {
      username,
      password,
    });
    return response.data.access_token;
  },

  // 获取用户信息
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/user/profile');
    // 处理返回的用户数据中的URL
    if (response.data.avatar_url) {
      response.data.avatar_url = getFullApiUrl(response.data.avatar_url);
    }
    if (response.data.background_image) {
      response.data.background_image = getFullApiUrl(response.data.background_image);
    }
    return response.data;
  },
};

// 指标数据API
export const metricsAPI = {
  // 获取智能家居指标数据
  getMetrics: async (): Promise<MetricsData> => {
    const response = await apiClient.get<MetricsData>('/metrics');
    return response.data;
  },
};

// 仪表板数据API
export const dashboardAPI = {
  // 获取仪表板数据
  getDashboardData: async (): Promise<DashboardData> => {
    const response = await apiClient.get<DashboardData>('/dashboard-data');
    return response.data;
  },

  // 切换设备状态
  toggleDevice: async (deviceId: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(`/devices/${deviceId}/toggle`);
    return response.data;
  },
};

// 用户设置API
export const userSettingsAPI = {
  // 更新用户设置
  updateSettings: async (settings: any): Promise<User> => {
    console.log('Updating settings with:', settings);
    // 使用PATCH方法和正确的更新端点
    const response = await apiClient.patch<User>('/user/settings/update', {
      username: settings.user.username.trim(),  // 确保去除空格
      background_image: settings.background_image
    });
    console.log('Settings update response:', response.data);
    // 处理返回的用户数据中的URL
    if (response.data.avatar_url) {
      response.data.avatar_url = getFullApiUrl(response.data.avatar_url);
    }
    if (response.data.background_image) {
      response.data.background_image = getFullApiUrl(response.data.background_image);
    }
    return response.data;
  },

  // 更新用户头像
  updateAvatar: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<User>('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // 处理返回的用户数据中的URL
    if (response.data.avatar_url) {
      response.data.avatar_url = getFullApiUrl(response.data.avatar_url);
    }
    return response.data;
  },

  // 更新背景图片
  updateBackground: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<User>('/user/background', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // 处理返回的用户数据中的URL
    if (response.data.background_image) {
      response.data.background_image = getFullApiUrl(response.data.background_image);
    }
    return response.data;
  },
};

// 通用API工具函数
export const apiUtils = {
  // 设置认证token
  setAuthToken: (token: string) => {
    localStorage.setItem('access_token', token);
  },

  // 获取认证token
  getAuthToken: (): string | null => {
    return localStorage.getItem('access_token');
  },

  // 清除认证信息
  clearAuth: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  // 检查是否已登录
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  },
};

export default apiClient; 