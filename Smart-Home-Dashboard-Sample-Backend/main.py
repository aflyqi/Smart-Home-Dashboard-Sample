from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random
import os
import shutil
from pathlib import Path

from database import SessionLocal, engine, get_db
from models import User, Base
from schemas import (
    UserCreate, UserLogin, UserResponse, Token, MetricsResponse,
    DeviceResponse, EnvironmentResponse, EnergyUsageResponse, DashboardDataResponse,
    UserSettingsUpdate
)
from auth import (
    get_password_hash, 
    authenticate_user, 
    create_access_token, 
    get_current_user,
    get_user_by_username,
    get_user_by_email,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

# 创建上传文件目录
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
AVATARS_DIR = UPLOAD_DIR / "avatars"
AVATARS_DIR.mkdir(exist_ok=True)
BACKGROUNDS_DIR = UPLOAD_DIR / "backgrounds"
BACKGROUNDS_DIR.mkdir(exist_ok=True)

# 创建数据库表
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart Home Dashboard API",
    description="智能家居仪表板后端API",
    version="1.0.0"
)

# 配置静态文件服务，禁用缓存
class NoCache(StaticFiles):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.add_cache_headers = False

    async def get_response(self, path: str, scope):
        response = await super().get_response(path, scope)
        if hasattr(response, 'headers'):
            response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate'
            response.headers['Pragma'] = 'no-cache'
            response.headers['Expires'] = '0'
        return response

# 配置静态文件服务，禁用缓存
app.mount("/uploads", NoCache(directory="uploads"), name="uploads")

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],  # 明确列出允许的方法
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,  # 预检请求的缓存时间
)

# 添加错误处理
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation Error",
            "errors": exc.errors()
        }
    )

# 添加调试日志
@app.post("/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """用户注册接口"""
    try:
        print(f"Registering user: {user.username}")  # 调试日志
        
        # 检查用户名是否已存在
        db_user = get_user_by_username(db, username=user.username)
        if db_user:
            raise HTTPException(
                status_code=400,
                detail="Username already exists"
            )
        
        # 检查邮箱是否已存在
        db_user = get_user_by_email(db, email=user.email)
        if db_user:
            raise HTTPException(
                status_code=400,
                detail="Email already exists"
            )
        
        # 创建新用户
        hashed_password = get_password_hash(user.password)
        db_user = User(
            username=user.username,
            email=user.email,
            hashed_password=hashed_password,
            created_at=datetime.now()
        )
        
        print("Adding user to database")  # 调试日志
        db.add(db_user)
        db.commit()
        print("Database commit successful")  # 调试日志
        db.refresh(db_user)
        
        print(f"User registered successfully: {db_user.username}")  # 调试日志
        return db_user
        
    except Exception as e:
        print(f"Error during registration: {str(e)}")  # 调试日志
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@app.post("/login", response_model=Token)
async def login(user: UserLogin, db: Session = Depends(get_db)):
    """用户登录接口"""
    authenticated_user = authenticate_user(db, user.username, user.password)
    if not authenticated_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": authenticated_user.username}, 
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/metrics", response_model=MetricsResponse)
async def get_metrics(current_user: User = Depends(get_current_user)):
    """获取智能家居指标数据"""
    # 生成随机指标数据
    global_active_power = round(random.uniform(0, 10), 3)
    global_reactive_power = round(random.uniform(0, 1), 3)
    voltage = round(random.uniform(230, 250), 3)
    global_intensity = round(random.uniform(0, 40), 3)
    sub_metering_1 = round(random.uniform(0, 2), 3)
    sub_metering_2 = round(random.uniform(0, 40), 3)
    sub_metering_3 = round(random.uniform(15, 20), 3)
    
    return MetricsResponse(
        global_active_power=global_active_power,
        global_reactive_power=global_reactive_power,
        voltage=voltage,
        global_intensity=global_intensity,
        sub_metering_1=sub_metering_1,
        sub_metering_2=sub_metering_2,
        sub_metering_3=sub_metering_3,
        timestamp=datetime.now()
    )

@app.get("/user/profile", response_model=UserResponse)
async def get_user_profile(current_user: User = Depends(get_current_user)):
    """获取当前用户信息"""
    return current_user

@app.get("/dashboard-data", response_model=DashboardDataResponse)
async def get_dashboard_data(current_user: User = Depends(get_current_user)):
    """获取仪表板数据"""
    # 生成设备数据
    devices = [
        DeviceResponse(
            id="1",
            name="Air Conditioner",
            isOn=True,
            devices=4,
            powerUsage=24.9,
            powerOnTime="14hr 32min"
        ),
        DeviceResponse(
            id="2",
            name="Lamp",
            isOn=True,
            devices=4,
            powerUsage=24.9
        ),
        DeviceResponse(
            id="3",
            name="Audio",
            isOn=True,
            devices=4,
            powerUsage=24.9,
            powerOnTime="2hr"
        ),
        DeviceResponse(
            id="4",
            name="Refrigerator",
            isOn=False,
            devices=4,
            powerUsage=24.9,
            powerOnTime="24hr"
        )
    ]
    
    # 生成环境数据
    environment = EnvironmentResponse(
        humidity=76,
        temperature=24
    )
    
    # 生成能耗数据
    times = ['04:30PM', '05:00PM', '05:30PM', '06:00PM', '06:30PM', '07:00PM', '07:30PM', '08:00PM', '08:30PM']
    energy_data = []
    for time in times:
        energy_data.append(EnergyUsageResponse(
            timestamp=time,
            usage=70 + random.random() * 30,
            efficiency=20 + random.random() * 30
        ))
    
    return DashboardDataResponse(
        devices=devices,
        environment=environment,
        energyData=energy_data
    )

@app.post("/devices/{device_id}/toggle")
async def toggle_device(device_id: str, current_user: User = Depends(get_current_user)):
    """切换设备开关状态"""
    # 这里可以添加实际的设备控制逻辑
    # 目前只是返回成功状态
    return {"message": f"Device {device_id} toggled successfully"}

@app.patch("/user/settings/update", response_model=UserResponse)
async def update_user_settings(
    settings: UserSettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新用户设置"""
    try:
        print(f"Received settings update request for user {current_user.id}")
        print(f"Current settings: {settings.dict()}")
        
        if settings.username is not None:  # 明确检查是否提供了username
            print(f"Attempting to update username from {current_user.username} to {settings.username}")
            if settings.username != current_user.username:
                # 检查新用户名是否已存在
                existing_user = get_user_by_username(db, settings.username)
                if existing_user and existing_user.id != current_user.id:
                    print(f"Username {settings.username} already exists")
                    raise HTTPException(
                        status_code=400,
                        detail="Username already exists"
                    )
                current_user.username = settings.username
                print(f"Username updated successfully to {settings.username}")
            else:
                print("Username unchanged (same as current)")
        else:
            print("No username update requested")
        
        if settings.background_image:
            print(f"Updating background image to {settings.background_image}")
            current_user.background_image = settings.background_image
        
        try:
            db.commit()
            db.refresh(current_user)
            print(f"Settings updated successfully for user {current_user.id}")
            print(f"Updated user data: {current_user.__dict__}")
        except Exception as e:
            print(f"Database error: {str(e)}")
            db.rollback()
            raise
        
        return current_user
    except Exception as e:
        print(f"Error updating settings: {str(e)}")
        if isinstance(e, HTTPException):
            raise
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update settings: {str(e)}"
        )

@app.post("/user/avatar", response_model=UserResponse)
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """上传用户头像"""
    try:
        print(f"Starting avatar upload for user {current_user.id}")  # 添加日志
        
        # 确保上传目录存在
        AVATARS_DIR.mkdir(exist_ok=True, parents=True)
        print(f"Avatar directory confirmed: {AVATARS_DIR}")  # 添加日志
        
        # 生成文件名
        file_extension = file.filename.split('.')[-1].lower()
        if file_extension not in ['jpg', 'jpeg', 'png', 'gif']:
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Only jpg, jpeg, png, and gif are allowed."
            )
        
        filename = f"avatar_{current_user.id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.{file_extension}"
        file_path = AVATARS_DIR / filename
        print(f"Generated file path: {file_path}")  # 添加日志
        
        # 保存文件
        try:
            with file_path.open("wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            print(f"File saved successfully")  # 添加日志
            
            # 设置文件权限
            os.chmod(file_path, 0o644)
            print(f"File permissions set")  # 添加日志
        except Exception as e:
            print(f"Error saving file: {str(e)}")  # 添加日志
            raise
        
        # 更新数据库中的头像URL
        avatar_url = f"/uploads/avatars/{filename}"
        print(f"New avatar URL: {avatar_url}")  # 添加日志
        
        # 删除旧头像文件
        if current_user.avatar_url:
            old_filename = current_user.avatar_url.split('/')[-1]
            old_file_path = AVATARS_DIR / old_filename
            try:
                if old_file_path.exists():
                    old_file_path.unlink()
                    print(f"Old avatar file deleted: {old_file_path}")  # 添加日志
            except Exception as e:
                print(f"Error deleting old avatar: {str(e)}")  # 添加日志
                # 不抛出异常，继续处理
        
        current_user.avatar_url = avatar_url
        db.commit()
        db.refresh(current_user)
        print(f"Database updated successfully")  # 添加日志
        
        return current_user
    except Exception as e:
        print(f"Error uploading avatar: {str(e)}")
        if isinstance(e, HTTPException):
            raise
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload avatar: {str(e)}"
        )

@app.post("/user/background", response_model=UserResponse)
async def upload_background(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """上传用户背景图片"""
    try:
        # 确保上传目录存在
        BACKGROUNDS_DIR.mkdir(exist_ok=True)
        
        # 生成文件名
        file_extension = file.filename.split('.')[-1]
        filename = f"bg_{current_user.id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.{file_extension}"
        file_path = BACKGROUNDS_DIR / filename
        
        # 保存文件
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # 更新数据库中的背景图片URL
        background_url = f"/uploads/backgrounds/{filename}"
        current_user.background_image = background_url
        db.commit()
        db.refresh(current_user)
        
        return current_user
    except Exception as e:
        print(f"Error uploading background: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload background: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 