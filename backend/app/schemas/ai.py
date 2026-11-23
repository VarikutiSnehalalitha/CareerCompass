from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel

class AIChatMessage(BaseModel):
    role: str # user, assistant, system
    content: str
    timestamp: Optional[datetime] = None

class AIChatRequest(BaseModel):
    mode: str = "doubt_solver" # doubt_solver, topic_teacher, question_generator, study_planner, performance_analyzer, revision_assistant, career_guidance
    message: str
    session_id: Optional[str] = None
    exam_id: Optional[int] = None
    topic_id: Optional[int] = None
    extra_context: Optional[Dict[str, Any]] = None

class AIChatResponse(BaseModel):
    reply: str
    mode: str
    session_id: str
    suggested_actions: List[str] = []
    generated_content: Optional[Dict[str, Any]] = None

class AIQuestionGenRequest(BaseModel):
    exam_name: str
    subject: str
    topic: str
    difficulty: str = "medium"
    num_questions: int = 5
    question_type: str = "mcq"

class AIRevisionNotesRequest(BaseModel):
    topic_name: str
    exam_target: str
    detail_level: str = "high_yield"
