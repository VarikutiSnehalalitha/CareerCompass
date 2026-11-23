from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

class QuestionOptionResponse(BaseModel):
    id: int
    option_key: str
    option_text: str
    is_correct: Optional[bool] = None  # omitted during active tests if needed
    explanation: Optional[str] = None
    class Config:
        from_attributes = True

class QuestionExplanationResponse(BaseModel):
    id: int
    detailed_solution: str
    shortcut_technique: Optional[str] = None
    formula_used: Optional[str] = None
    common_pitfall: Optional[str] = None
    verified_by: Optional[str] = None
    class Config:
        from_attributes = True

class QuestionResponse(BaseModel):
    id: int
    question_paper_id: Optional[int] = None
    topic_id: Optional[int] = None
    question_text: str
    question_type: str
    difficulty: str
    marks: float
    negative_marks: float
    is_pyq: bool
    pyq_year: Optional[int] = None
    verification_status: str
    source_label: Optional[str] = None
    options: List[QuestionOptionResponse] = []
    explanation: Optional[QuestionExplanationResponse] = None
    class Config:
        from_attributes = True

class QuestionPaperResponse(BaseModel):
    id: int
    exam_id: int
    paper_title: str
    year: int
    stage_tier: str
    shift: str
    paper_type: str
    duration_minutes: int
    total_marks: float
    total_questions: int
    negative_mark_ratio: float
    pdf_file_url: Optional[str] = None
    answer_key_file_url: Optional[str] = None
    official_source_url: Optional[str] = None
    verification_status: str
    has_official_key: bool
    created_at: datetime
    class Config:
        from_attributes = True
