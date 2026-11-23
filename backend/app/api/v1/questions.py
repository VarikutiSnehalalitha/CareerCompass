from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.question import QuestionPaper, Question
from app.models.user import Bookmark
from app.schemas.question import QuestionPaperResponse, QuestionResponse
from app.schemas.user import BookmarkCreate, BookmarkResponse
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/questions", tags=["Questions & Question Papers"])

@router.get("/papers", response_model=List[QuestionPaperResponse])
def get_question_papers(
    exam_id: Optional[int] = None,
    year: Optional[int] = None,
    paper_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    q = db.query(QuestionPaper)
    if exam_id:
        q = q.filter(QuestionPaper.exam_id == exam_id)
    if year:
        q = q.filter(QuestionPaper.year == year)
    if paper_type:
        q = q.filter(QuestionPaper.paper_type == paper_type)
    return q.order_by(QuestionPaper.year.desc()).all()

@router.get("/papers/{paper_id}", response_model=QuestionPaperResponse)
def get_paper_detail(paper_id: int, db: Session = Depends(get_db)):
    paper = db.query(QuestionPaper).filter(QuestionPaper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Question paper not found")
    return paper

@router.get("/papers/{paper_id}/questions", response_model=List[QuestionResponse])
def get_paper_questions(paper_id: int, db: Session = Depends(get_db)):
    questions = db.query(Question).filter(Question.question_paper_id == paper_id).all()
    if not questions:
        # Fallback to general question bank
        questions = db.query(Question).limit(25).all()
    return questions

@router.post("/bookmark", response_model=BookmarkResponse)
def create_bookmark(
    bm: BookmarkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(Bookmark).filter(
        Bookmark.user_id == current_user.id,
        Bookmark.entity_type == bm.entity_type,
        Bookmark.entity_id == bm.entity_id
    ).first()
    if existing:
        return existing
    new_bm = Bookmark(
        user_id=current_user.id,
        entity_type=bm.entity_type,
        entity_id=bm.entity_id,
        note=bm.note
    )
    db.add(new_bm)
    db.commit()
    db.refresh(new_bm)
    return new_bm

@router.get("/bookmarks", response_model=List[BookmarkResponse])
def get_user_bookmarks(
    entity_type: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    q = db.query(Bookmark).filter(Bookmark.user_id == current_user.id)
    if entity_type:
        q = q.filter(Bookmark.entity_type == entity_type)
    return q.order_by(Bookmark.created_at.desc()).all()
