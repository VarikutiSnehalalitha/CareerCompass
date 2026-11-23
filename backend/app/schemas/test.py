from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel
from app.schemas.question import QuestionResponse

class StartTestRequest(BaseModel):
    test_type: str # topic_test, grand_test, pyq_practice, sectional_mock
    exam_id: Optional[int] = None
    question_paper_id: Optional[int] = None
    topic_id: Optional[int] = None
    num_questions: Optional[int] = 25
    difficulty: Optional[str] = "mixed"

class SubmitAnswerRequest(BaseModel):
    question_id: int
    selected_option_key: Optional[str] = None
    numerical_answer: Optional[float] = None
    is_marked_for_review: bool = False
    time_spent_seconds: int = 0

class SubmitTestRequest(BaseModel):
    answers: List[SubmitAnswerRequest]
    time_spent_seconds: int

class TestAnswerResponse(BaseModel):
    id: int
    question_id: int
    selected_option_key: Optional[str] = None
    numerical_answer: Optional[float] = None
    is_marked_for_review: bool
    is_correct: Optional[bool] = None
    time_spent_seconds: int
    marks_awarded: float
    question: Optional[QuestionResponse] = None
    class Config:
        from_attributes = True

class TestResultResponse(BaseModel):
    id: int
    test_session_id: int
    user_id: int
    percentile_estimate: float
    rank_estimate: int
    subject_breakdown: Optional[str] = None
    weak_topics: Optional[str] = None
    strong_topics: Optional[str] = None
    time_management_score: float
    revision_recommendations: Optional[str] = None
    generated_at: datetime
    class Config:
        from_attributes = True

class TestSessionResponse(BaseModel):
    id: int
    user_id: int
    test_type: str
    exam_id: Optional[int] = None
    question_paper_id: Optional[int] = None
    topic_id: Optional[int] = None
    title: str
    start_time: datetime
    end_time: Optional[datetime] = None
    duration_seconds: int
    status: str
    total_score: float
    max_score: float
    accuracy_rate: float
    total_questions: int
    answered_count: int
    correct_count: int
    incorrect_count: int
    unanswered_count: int
    time_spent_seconds: int
    created_at: datetime
    answers: List[TestAnswerResponse] = []
    result: Optional[TestResultResponse] = None
    questions: Optional[List[QuestionResponse]] = None
    class Config:
        from_attributes = True
