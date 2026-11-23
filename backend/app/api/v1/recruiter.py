from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.job import PrivateJob, JobApplication
from app.models.user import User
from app.schemas.job import PrivateJobCreate, PrivateJobResponse, JobApplicationResponse
from app.api.deps import get_current_user, require_role

router = APIRouter(prefix="/recruiter", tags=["Recruiter Portal"])

@router.get("/jobs", response_model=List[PrivateJobResponse])
def get_recruiter_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["recruiter", "admin"]))
):
    return db.query(PrivateJob).filter(PrivateJob.recruiter_id == current_user.id).all()

@router.post("/post-job", response_model=PrivateJobResponse)
def post_job(
    job_in: PrivateJobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["recruiter", "admin"]))
):
    job = PrivateJob(
        recruiter_id=current_user.id,
        **job_in.dict()
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job

@router.get("/applications", response_model=List[JobApplicationResponse])
def get_applicants(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["recruiter", "admin"]))
):
    apps = db.query(JobApplication).join(PrivateJob).filter(
        PrivateJob.recruiter_id == current_user.id
    ).order_by(JobApplication.created_at.desc()).all()
    
    # Enrich with candidate info
    res = []
    for a in apps:
        item = JobApplicationResponse.from_orm(a)
        if a.user:
            item.candidate_name = a.user.full_name
            item.candidate_email = a.user.email
        res.append(item)
    return res

@router.post("/application/{app_id}/status")
def update_application_status(
    app_id: int,
    status: str,
    interview_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["recruiter", "admin"]))
):
    app = db.query(JobApplication).filter(JobApplication.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    app.status = status
    if interview_date:
        app.interview_date = interview_date
    db.commit()
    return {"message": f"Status updated to {status}", "application_id": app_id}
