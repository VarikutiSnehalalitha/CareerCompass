from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.exam import Examination, ExamCategory
from app.models.question import QuestionPaper, Question
from app.models.user import User
from app.models.content import ContentSource, ContentVerification
from app.api.deps import require_role

router = APIRouter(prefix="/admin", tags=["Administrator Dashboard & Content Workflow"])

@router.get("/stats")
def get_admin_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    total_users = db.query(User).count()
    total_exams = db.query(Examination).count()
    total_papers = db.query(QuestionPaper).count()
    total_questions = db.query(Question).count()
    verified_sources = db.query(ContentSource).filter(ContentSource.verification_status == "verified").count()

    return {
        "total_users": total_users,
        "total_examinations": total_exams,
        "total_question_papers": total_papers,
        "total_questions": total_questions,
        "verified_content_sources": verified_sources,
        "system_status": "All systems fully operational",
        "verification_workflow_stages": ["Draft", "Under Review", "Verified", "Published"]
    }

@router.post("/verify-content")
def verify_content(
    entity_type: str,
    entity_id: int,
    new_status: str,
    comments: Optional[str] = "Admin review completed",
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    audit = ContentVerification(
        entity_type=entity_type,
        entity_id=entity_id,
        reviewer_id=current_user.id,
        new_status=new_status,
        comments=comments,
        verification_date=datetime.utcnow()
    )
    db.add(audit)
    
    # Update entity if exam or paper
    if entity_type == "exam":
        ex = db.query(Examination).filter(Examination.id == entity_id).first()
        if ex:
            ex.verification_status = new_status
    elif entity_type == "question_paper":
        qp = db.query(QuestionPaper).filter(QuestionPaper.id == entity_id).first()
        if qp:
            qp.verification_status = new_status

    db.commit()
    return {"message": f"Content {entity_type} #{entity_id} moved to status: {new_status}"}
