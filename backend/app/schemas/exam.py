from typing import Optional, List
from datetime import date, datetime
from pydantic import BaseModel

class ExamCategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    icon: str
    is_active: bool
    display_order: int
    class Config:
        from_attributes = True

class DepartmentResponse(BaseModel):
    id: int
    name: str
    code: Optional[str] = None
    description: Optional[str] = None
    website_url: Optional[str] = None
    state: str
    category_id: Optional[int] = None
    class Config:
        from_attributes = True

class RecruitmentNotificationResponse(BaseModel):
    id: int
    exam_id: int
    title: str
    notification_number: Optional[str] = None
    release_date: Optional[date] = None
    apply_last_date: Optional[date] = None
    exam_start_date: Optional[date] = None
    pdf_url: Optional[str] = None
    official_link: Optional[str] = None
    vacancies_count: int
    status: str
    is_verified: bool
    created_at: datetime
    class Config:
        from_attributes = True

class ExaminationBase(BaseModel):
    name: str
    code: str
    conducting_authority: str
    department_id: Optional[int] = None
    category_id: Optional[int] = None
    exam_level: str = "National"
    state: str = "All India"
    description: Optional[str] = None
    qualification_required: Optional[str] = None
    min_age: int = 18
    max_age: int = 32
    age_relaxation_details: Optional[str] = None
    nationality_requirements: str = "Indian Citizen"
    vacancies: int = 0
    salary_min: float = 35000.0
    salary_max: float = 95000.0
    pay_scale: Optional[str] = None
    application_fee: float = 100.0
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    exam_date: Optional[date] = None
    selection_process: Optional[str] = None
    exam_pattern: Optional[str] = None
    official_notification_url: Optional[str] = None
    official_apply_url: Optional[str] = None
    is_active: bool = True
    verification_status: str = "verified"

class ExaminationCreate(ExaminationBase):
    pass

class ExaminationUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    vacancies: Optional[int] = None
    exam_date: Optional[date] = None
    official_notification_url: Optional[str] = None
    official_apply_url: Optional[str] = None
    verification_status: Optional[str] = None

class ExaminationResponse(ExaminationBase):
    id: int
    created_at: datetime
    updated_at: datetime
    category: Optional[ExamCategoryResponse] = None
    department: Optional[DepartmentResponse] = None
    notifications: List[RecruitmentNotificationResponse] = []
    class Config:
        from_attributes = True
