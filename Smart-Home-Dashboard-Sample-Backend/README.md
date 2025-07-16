# Smart Home Dashboard Backend

这是一个基于FastAPI的智能家居仪表板后端API，提供用户认证和指标数据获取功能。

## 功能特性

- 用户注册和登录
- JWT令牌认证
- 智能家居指标数据获取
- SQLite数据库存储
- CORS支持

## 安装和运行

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 运行服务器

```bash
python main.py
```

或者使用uvicorn：

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

服务器将在 `http://localhost:8000` 上运行。

## API接口

### 1. 根路径
- **GET** `/` - 返回API欢迎信息

### 2. 用户认证

#### 注册
- **POST** `/register`
- 请求体：
```json
{
  "username": "your_username",
  "email": "your_email@example.com",
  "password": "your_password"
}
```

#### 登录
- **POST** `/login`
- 请求体：
```json
{
  "username": "your_username",
  "password": "your_password"
}
```
- 返回：
```json
{
  "access_token": "jwt_token_here",
  "token_type": "bearer"
}
```

### 3. 受保护的接口

#### 获取指标数据
- **GET** `/metrics`
- 需要在Header中包含：`Authorization: Bearer {access_token}`
- 返回：
```json
{
  "global_active_power": 5.234,
  "global_reactive_power": 0.567,
  "voltage": 240.123,
  "global_intensity": 25.678,
  "sub_metering_1": 1.234,
  "sub_metering_2": 30.567,
  "sub_metering_3": 17.890,
  "timestamp": "2024-01-01T12:00:00"
}
```

#### 获取用户信息
- **GET** `/user/profile`
- 需要在Header中包含：`Authorization: Bearer {access_token}`

## 数据库

项目使用SQLite数据库，数据库文件 `smart_home.db` 将在首次运行时自动创建。

## API文档

启动服务器后，可以访问以下地址查看自动生成的API文档：

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 项目结构

```
Smart-Home-Dashboard-Sample-Backend/
├── main.py          # 主应用程序
├── database.py      # 数据库配置
├── models.py        # 数据库模型
├── schemas.py       # Pydantic模型
├── auth.py          # 认证相关功能
├── requirements.txt # 依赖管理
└── README.md        # 项目说明
```

## 使用示例

### 1. 注册用户
```bash
curl -X POST "http://localhost:8000/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpassword"
  }'
```

### 2. 用户登录
```bash
curl -X POST "http://localhost:8000/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpassword"
  }'
```

### 3. 获取指标数据
```bash
curl -X GET "http://localhost:8000/metrics" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 注意事项

- 在生产环境中，请修改 `auth.py` 中的 `SECRET_KEY` 为一个安全的随机字符串
- 建议使用环境变量来管理敏感配置
- CORS配置在生产环境中应该限制为特定的域名 