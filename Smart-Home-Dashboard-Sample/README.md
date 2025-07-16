# Smart Home Dashboard Frontend

这是一个基于React和TypeScript的智能家居仪表板前端应用，集成了FastAPI后端API。

## 功能特性

- 用户注册和登录系统
- JWT令牌认证
- 实时智能家居指标数据展示
- 设备状态管理
- 环境数据监控
- 能源使用图表
- 响应式设计

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm start
```

应用将在 `http://localhost:3000` 上运行。

## API集成

### 后端API要求

确保后端API服务器在 `http://localhost:8000` 上运行，并提供以下接口：

- `POST /register` - 用户注册
- `POST /login` - 用户登录
- `GET /metrics` - 获取指标数据（需要认证）
- `GET /user/profile` - 获取用户信息（需要认证）

### API配置

API配置位于 `src/services/api.ts` 文件中，可以根据需要修改 `API_BASE_URL`。

## 项目结构

```
src/
├── components/
│   ├── Auth/              # 认证相关组件
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── DeviceCard/        # 设备卡片组件
│   ├── EnvironmentCard/   # 环境数据卡片
│   ├── EnergyChart/       # 能源图表组件
│   ├── Layout/            # 布局组件
│   └── MetricsCard/       # 指标数据卡片
├── services/              # API服务层
│   ├── api.ts            # API客户端和请求方法
│   ├── type.ts           # API相关类型定义
│   └── index.ts          # 统一导出文件
├── styles/               # 样式文件
├── types/                # 组件相关类型定义
└── App.tsx              # 主应用组件
```

## 使用流程

1. **启动后端服务器**
   ```bash
   cd Smart-Home-Dashboard-Sample-Backend
   python main.py
   ```

2. **启动前端应用**
   ```bash
   cd Smart-Home-Dashboard-Sample
   npm start
   ```

3. **注册/登录**
   - 首次使用需要注册账户
   - 使用注册的账户登录系统

4. **查看数据**
   - 登录后可以查看实时指标数据
   - 数据每30秒自动更新
   - 可以手动点击"刷新数据"按钮

## 主要组件

### 认证组件
- `LoginForm` - 用户登录表单
- `RegisterForm` - 用户注册表单

### 数据展示组件
- `MetricsCard` - 显示从API获取的实时指标数据
- `DeviceCard` - 设备状态管理
- `EnvironmentCard` - 环境数据展示
- `EnergyChart` - 能源使用图表

### API服务
- `authAPI` - 认证相关API调用
- `metricsAPI` - 指标数据API调用
- `apiUtils` - API工具函数

## 技术栈

- **前端框架**: React 19
- **类型检查**: TypeScript
- **UI组件库**: Material-UI (MUI)
- **HTTP客户端**: Axios
- **图表库**: Chart.js + react-chartjs-2
- **样式**: Styled Components + Emotion

## 开发说明

### 添加新的API接口

1. 在 `src/services/type.ts` 中添加相关类型定义
2. 在 `src/services/api.ts` 中添加API调用方法
3. 在组件中使用新的API方法

### 类型定义组织

- `src/services/type.ts` - API相关的类型定义
- `src/types/index.ts` - 组件相关的类型定义

### 自定义样式

项目使用Material-UI主题系统，可以在 `src/styles/` 目录下添加自定义样式。

## 注意事项

- 确保后端API服务器正在运行
- 检查API地址配置是否正确
- 在生产环境中应该使用环境变量管理API地址
- JWT令牌会自动存储在localStorage中
