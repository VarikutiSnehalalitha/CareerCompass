from typing import Optional, List
from datetime import date, datetime
from pydantic import BaseModel

class StudySessionBase(BaseModel):
    topic_id: Optional[int] = None
    title: str
    scheduled_date: date
    start_time: str = "06:00 AM"
    end_time: str = "07:30 AM"
    duration_minutes: int = 90
    status: str = "scheduled" # scheduled, completed, missed, rescheduled
    notes: Optional[str] = None
    is_revision: bool = False

class StudySessionResponse(StudySessionBase):
    id: int
    study_plan_id: int
    topic_name: Optional[str] = None
    subject_name: Optional[str] = None
    class Config:
        from_attributes = True

class StudyPlanCreate(BaseModel):
    exam_id: int
    target_exam_date: date
    daily_hours: float = 4.0
    current_level: str = "intermediate"
    target_score: float = 85.0
    selected_subjects: Optional[List[str]] = None
    common_subjects_deduped: bool = True

class StudyPlanResponse(BaseModel):
    id: int
    user_id: int
    exam_id: int
    exam_name: Optional[str] = None
    title: str
    start_date: date
    target_exam_date: date
    daily_hours: float
    current_level: str
    target_score: float
    is_active: bool
    common_subjects_deduped: bool
    sessions: List[StudySessionResponse] = []
    created_at: datetime
    class Config:
        from_attributes = True

class RevisionTaskResponse(BaseModel):
    id: int
    topic_id: int
    topic_name: Optional[str] = None
    scheduled_date: date
    priority: str
    status: str
    reason: str
    class Config:
        from_attributes = True

class TimetableRescheduleRequest(BaseModel):
    missed_session_id: int
    reason: Optional[str] = "Missed session redistribution"
