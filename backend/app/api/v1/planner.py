from typing import Optional, List
from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.planner import StudyPlan, StudySession, RevisionTask
from app.schemas.planner import (
    StudyPlanCreate, StudyPlanResponse, StudySessionResponse,
    RevisionTaskResponse, TimetableRescheduleRequest
)
from app.services.timetable_service import timetable_service
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/planner", tags=["Intelligent Study Planner"])

@router.post("/setup", response_model=StudyPlanResponse)
def setup_study_plan(
    plan_in: StudyPlanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plan = timetable_service.generate_timetable(
        db=db,
        user_id=current_user.id,
        exam_id=plan_in.exam_id,
        target_exam_date=plan_in.target_exam_date,
        daily_hours=plan_in.daily_hours,
        current_level=plan_in.current_level
    )
    return plan

@router.get("/my-plan", response_model=Optional[StudyPlanResponse])
def get_active_plan(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plan = db.query(StudyPlan).filter(
        StudyPlan.user_id == current_user.id,
        StudyPlan.is_active == True
    ).first()
    return plan

@router.post("/session/{session_id}/status")
def update_session_status(
    session_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sess = db.query(StudySession).filter(StudySession.id == session_id).first()
    if not sess:
        raise HTTPException(status_code=404, detail="Study session not found")
    sess.status = status
    db.commit()
    return {"message": f"Session marked as {status}", "session_id": session_id}

@router.post("/reschedule")
def reschedule_missed(
    req: TimetableRescheduleRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = timetable_service.reschedule_missed_session(db, req.missed_session_id)
    if not res:
        raise HTTPException(status_code=404, detail="Session could not be rescheduled")
    return {"message": "Session smoothly redistributed into next study buffer without overload."}

@router.get("/revision-tasks", response_model=List[RevisionTaskResponse])
def get_revision_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tasks = db.query(RevisionTask).filter(
        RevisionTask.user_id == current_user.id,
        RevisionTask.status == "pending"
    ).all()
    return tasks
