from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.core.database import get_db
from app.models.job import PrivateJob, JobApplication
from app.schemas.job import (
    PrivateJobResponse, PrivateJobCreate, JobApplicationCreate, JobApplicationResponse
)
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/jobs", tags=["Private Jobs & Placement Portal"])

@router.get("/", response_model=List[PrivateJobResponse])
def get_jobs(
    category: Optional[str] = None,
    work_mode: Optional[str] = None,
    location: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    q = db.query(PrivateJob).filter(PrivateJob.is_active == True)
    if category:
        q = q.filter(PrivateJob.category == category)
    if work_mode:
        q = q.filter(PrivateJob.work_mode == work_mode)
    if location:
        q = q.filter(PrivateJob.location.ilike(f"%{location}%"))
    if search:
        q = q.filter(or_(
            PrivateJob.job_title.ilike(f"%{search}%"),
            PrivateJob.company_name.ilike(f"%{search}%"),
            PrivateJob.required_skills.ilike(f"%{search}%")
        ))
    return q.order_by(PrivateJob.created_at.desc()).all()

@router.get("/{job_id}", response_model=PrivateJobResponse)
def get_job_detail(job_id: int, db: Session = Depends(get_db)):
    job = db.query(PrivateJob).filter(PrivateJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.post("/{job_id}/apply", response_model=JobApplicationResponse)
def apply_job(
    job_id: int,
    app_in: JobApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(JobApplication).filter(
        JobApplication.job_id == job_id,
        JobApplication.user_id == current_user.id
    ).first()
    if existing:
        return existing
    
    app_obj = JobApplication(
        job_id=job_id,
        user_id=current_user.id,
        resume_url=app_in.resume_url or current_user.student_profile.resume_url if current_user.student_profile else None,
        cover_letter=app_in.cover_letter,
        match_score=85.0,
        status="applied"
    )
    db.add(app_obj)
    db.commit()
    db.refresh(app_obj)
    return app_obj

@router.get("/applications/my", response_model=List[JobApplicationResponse])
def get_my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    apps = db.query(JobApplication).filter(
        JobApplication.user_id == current_user.id
    ).order_by(JobApplication.created_at.desc()).all()
    return apps
