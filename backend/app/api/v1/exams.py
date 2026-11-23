from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.core.database import get_db
from app.models.exam import Examination, ExamCategory, Department, RecruitmentNotification
from app.schemas.exam import ExaminationResponse, ExamCategoryResponse, DepartmentResponse, RecruitmentNotificationResponse

router = APIRouter(prefix="/exams", tags=["Examinations"])

@router.get("/categories", response_model=List[ExamCategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(ExamCategory).filter(ExamCategory.is_active == True).order_by(ExamCategory.display_order).all()

@router.get("/departments", response_model=List[DepartmentResponse])
def get_departments(state: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(Department)
    if state:
        q = q.filter(Department.state == state)
    return q.all()

@router.get("/", response_model=List[ExaminationResponse])
def get_examinations(
    category_id: Optional[int] = None,
    state: Optional[str] = None,
    qualification: Optional[str] = None,
    search: Optional[str] = None,
    salary_min: Optional[float] = None,
    age: Optional[int] = None,
    db: Session = Depends(get_db)
):
    q = db.query(Examination).filter(Examination.is_active == True)
    if category_id:
        q = q.filter(Examination.category_id == category_id)
    if state and state != "All India":
        q = q.filter(or_(Examination.state == state, Examination.state == "All India"))
    if qualification:
        q = q.filter(Examination.qualification_required.ilike(f"%{qualification}%"))
    if search:
        q = q.filter(or_(
            Examination.name.ilike(f"%{search}%"),
            Examination.code.ilike(f"%{search}%"),
            Examination.conducting_authority.ilike(f"%{search}%")
        ))
    if salary_min:
        q = q.filter(Examination.salary_max >= salary_min)
    if age:
        q = q.filter(Examination.min_age <= age, Examination.max_age >= age)
    return q.order_by(Examination.name).all()

@router.get("/notifications", response_model=List[RecruitmentNotificationResponse])
def get_all_notifications(db: Session = Depends(get_db)):
    return db.query(RecruitmentNotification).order_by(RecruitmentNotification.release_date.desc()).all()

@router.get("/{exam_id}", response_model=ExaminationResponse)
def get_examination_detail(exam_id: int, db: Session = Depends(get_db)):
    exam = db.query(Examination).filter(Examination.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Examination not found")
    return exam
