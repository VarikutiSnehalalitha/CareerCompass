from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

class SyllabusTopicBase(BaseModel):
    name: str
    unit_name: Optional[str] = None
    difficulty_level: str = "medium"
    recommended_hours: float = 3.0
    description: Optional[str] = None
    study_notes: Optional[str] = None
    formulas_summary: Optional[str] = None
    display_order: int = 0

class SyllabusTopicResponse(SyllabusTopicBase):
    id: int
    subject_id: int
    parent_topic_id: Optional[int] = None
    is_active: bool
    user_status: Optional[str] = "not_started"
    user_mastery: Optional[float] = 0.0
    class Config:
        from_attributes = True

class SyllabusSubjectBase(BaseModel):
    name: str
    code: Optional[str] = None
    weightage_percent: float = 25.0
    description: Optional[str] = None
    display_order: int = 0

class SyllabusSubjectResponse(SyllabusSubjectBase):
    id: int
    syllabus_id: int
    topics: List[SyllabusTopicResponse] = []
    class Config:
        from_attributes = True

class ExamSyllabusResponse(BaseModel):
    id: int
    exam_id: int
    title: str
    version: str
    is_active: bool
    verification_status: str
    source_url: Optional[str] = None
    verified_by: Optional[str] = None
    subjects: List[SyllabusSubjectResponse] = []
    class Config:
        from_attributes = True

class TopicProgressUpdate(BaseModel):
    status: str # not_started, in_progress, completed, needs_revision
    mastery_percentage: Optional[float] = None
    study_time_minutes: Optional[int] = None
