from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "student"
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    theme_mode: Optional[str] = "light"
    theme_name: Optional[str] = "nature"
    bg_style: Optional[str] = "forest"
    bg_intensity: Optional[str] = "balanced"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    theme_mode: Optional[str] = None
    theme_name: Optional[str] = None
    bg_style: Optional[str] = None
    bg_intensity: Optional[str] = None

class StudentProfileBase(BaseModel):
    qualification: Optional[str] = None
    state: Optional[str] = "All India"
    preferred_location: Optional[str] = None
    target_score: Optional[float] = 85.0
    daily_study_hours: Optional[float] = 4.0
    preferred_study_time: Optional[str] = "morning"
    preparation_level: Optional[str] = "intermediate"
    rest_days: Optional[str] = "Sunday"
    streak_days: Optional[int] = 5
    total_study_hours: Optional[float] = 38.5
    readiness_score: Optional[float] = 68.0
    resume_url: Optional[str] = None
    skills: Optional[str] = None
    active_exam_ids: Optional[str] = None

class StudentProfileCreate(StudentProfileBase):
    pass

class StudentProfileUpdate(StudentProfileBase):
    pass

class RecruiterProfileBase(BaseModel):
    company_name: str
    company_website: Optional[str] = None
    designation: Optional[str] = None
    company_logo: Optional[str] = None
    verified: Optional[bool] = True

class RecruiterProfileCreate(RecruiterProfileBase):
    pass

class UserResponse(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    created_at: datetime
    student_profile: Optional[StudentProfileBase] = None
    recruiter_profile: Optional[RecruiterProfileBase] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class BookmarkCreate(BaseModel):
    entity_type: str
    entity_id: int
    note: Optional[str] = None

class BookmarkResponse(BookmarkCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    notification_type: str
    link_url: Optional[str] = None
    is_read: bool
    created_at: datetime
    class Config:
        from_attributes = True
