from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.test import TestSession, TestAnswer, TestResult
from app.schemas.test import (
    StartTestRequest, SubmitTestRequest, TestSessionResponse, TestResultResponse
)
from app.services.test_engine_service import test_engine_service
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/tests", tags=["Tests & Mock Exam Engine"])

@router.post("/start", response_model=TestSessionResponse)
def start_test(
    req: StartTestRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = test_engine_service.start_test_session(
        db=db,
        user_id=current_user.id,
        test_type=req.test_type,
        exam_id=req.exam_id,
        question_paper_id=req.question_paper_id,
        topic_id=req.topic_id,
        num_questions=req.num_questions or 25
    )
    return session

@router.get("/{session_id}", response_model=TestSessionResponse)
def get_test_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = db.query(TestSession).filter(
        TestSession.id == session_id,
        TestSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Test session not found")
    return session

@router.post("/{session_id}/submit", response_model=TestSessionResponse)
def submit_test(
    session_id: int,
    sub_data: SubmitTestRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = db.query(TestSession).filter(
        TestSession.id == session_id,
        TestSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Test session not found")
    
    answers_dicts = [a.dict() for a in sub_data.answers]
    eval_session = test_engine_service.evaluate_test(
        db=db,
        session_id=session_id,
        answers_payload=answers_dicts,
        total_time_spent=sub_data.time_spent_seconds
    )
    return eval_session

@router.get("/history/list", response_model=List[TestSessionResponse])
def get_test_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tests = db.query(TestSession).filter(
        TestSession.user_id == current_user.id,
        TestSession.status == "completed"
    ).order_by(TestSession.created_at.desc()).all()
    return tests
