from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.syllabus import ExamSyllabus, SyllabusSubject, SyllabusTopic, TopicProgress
from app.schemas.syllabus import ExamSyllabusResponse, SyllabusTopicResponse, TopicProgressUpdate
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/syllabi", tags=["Syllabus"])

@router.get("/{exam_id}", response_model=ExamSyllabusResponse)
def get_syllabus(exam_id: int, db: Session = Depends(get_db)):
    syllabus = db.query(ExamSyllabus).filter(
        ExamSyllabus.exam_id == exam_id,
        ExamSyllabus.is_active == True
    ).first()
    if not syllabus:
        raise HTTPException(status_code=404, detail="Syllabus not found for this examination")
    return syllabus

@router.get("/topic/{topic_id}", response_model=SyllabusTopicResponse)
def get_topic_detail(
    topic_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    topic = db.query(SyllabusTopic).filter(SyllabusTopic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    prog = db.query(TopicProgress).filter(
        TopicProgress.topic_id == topic_id,
        TopicProgress.user_id == current_user.id
    ).first()

    resp = SyllabusTopicResponse.from_orm(topic)
    if prog:
        resp.user_status = prog.status
        resp.user_mastery = prog.mastery_percentage
    return resp

@router.post("/topic/{topic_id}/progress")
def update_topic_progress(
    topic_id: int,
    progress_in: TopicProgressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    prog = db.query(TopicProgress).filter(
        TopicProgress.topic_id == topic_id,
        TopicProgress.user_id == current_user.id
    ).first()
    if not prog:
        prog = TopicProgress(
            user_id=current_user.id,
            topic_id=topic_id,
            status=progress_in.status,
            mastery_percentage=progress_in.mastery_percentage or 100.0,
            study_time_minutes=progress_in.study_time_minutes or 45
        )
        db.add(prog)
    else:
        prog.status = progress_in.status
        if progress_in.mastery_percentage is not None:
            prog.mastery_percentage = progress_in.mastery_percentage
        if progress_in.study_time_minutes is not None:
            prog.study_time_minutes += progress_in.study_time_minutes
    db.commit()
    db.refresh(prog)
    return {"message": "Topic progress updated", "status": prog.status, "mastery": prog.mastery_percentage}
