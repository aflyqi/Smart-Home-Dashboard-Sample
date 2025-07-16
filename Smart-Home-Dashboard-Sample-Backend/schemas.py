from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    avatar_url: Optional[str] = None
    background_image: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class UserSettingsUpdate(BaseModel):
    username: Optional[str] = None
    background_image: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "username": "newusername",
                "background_image": "/uploads/backgrounds/bg_1.jpg"
            }
        }

class Token(BaseModel):
    access_token: str
    token_type: str

class MetricsResponse(BaseModel):
    global_active_power: float
    global_reactive_power: float
    voltage: float
    global_intensity: float
    sub_metering_1: float
    sub_metering_2: float
    sub_metering_3: float
    timestamp: datetime

class DeviceResponse(BaseModel):
    id: str
    name: str
    isOn: bool
    devices: int
    powerUsage: float
    powerOnTime: Optional[str] = None

class EnvironmentResponse(BaseModel):
    humidity: int
    temperature: int

class EnergyUsageResponse(BaseModel):
    timestamp: str
    usage: float
    efficiency: float

class DashboardDataResponse(BaseModel):
    devices: List[DeviceResponse]
    environment: EnvironmentResponse
    energyData: List[EnergyUsageResponse] 