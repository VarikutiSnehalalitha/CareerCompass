from typing import Optional, List
from datetime import date, datetime
from pydantic import BaseModel

class PrivateJobBase(BaseModel):
    company_name: str
    job_title: str
    job_description: str
    required_skills: str
    qualification: str = "Bachelor's Degree"
    min_experience_years: int = 0
    max_experience_years: int = 3
    salary_min: float = 400000.0
    salary_max: float = 1200000.0
    location: str = "Bangalore / Hybrid"
    work_mode: str = "hybrid"
    deadline: Optional[date] = None
    official_apply_link: Optional[str] = None
    category: str = "IT and software development"
    vacancies: int = 5
    is_active: bool = True

class PrivateJobCreate(PrivateJobBase):
    pass

class PrivateJobResponse(PrivateJobBase):
    id: int
    recruiter_id: Optional[int] = None
    created_at: datetime
    match_percentage: Optional[float] = None
    class Config:
        from_attributes = True

class JobApplicationCreate(BaseModel):
    job_id: int
    resume_url: Optional[str] = None
    cover_letter: Optional[str] = None

class JobApplicationResponse(BaseModel):
    id: int
    job_id: int
    user_id: int
    resume_url: Optional[str] = None
    cover_letter: Optional[str] = None
    match_score: float
    status: str
    interview_date: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: datetime
    job: Optional[PrivateJobResponse] = None
    candidate_name: Optional[str] = None
    candidate_email: Optional[str] = None
    class Config:
        from_attributes = True
