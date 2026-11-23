from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from app.core.database import Base

class PrivateJob(Base):
    __tablename__ = "private_jobs"

    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    company_name = Column(String(255), nullable=False, index=True)
    job_title = Column(String(255), nullable=False, index=True)
    job_description = Column(Text, nullable=False)
    required_skills = Column(Text, nullable=False)  # comma separated
    qualification = Column(String(255), default="Bachelor's Degree")
    min_experience_years = Column(Integer, default=0)
    max_experience_years = Column(Integer, default=3)
    salary_min = Column(Float, default=400000.0)
    salary_max = Column(Float, default=1200000.0)
    location = Column(String(255), default="Bangalore / Remote")
    work_mode = Column(String(50), default="hybrid")  # remote, hybrid, on_site
    deadline = Column(Date, nullable=True)
    official_apply_link = Column(String(500), nullable=True)
    category = Column(String(100), default="IT and software development")
    vacancies = Column(Integer, default=5)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    applications = relationship("JobApplication", back_populates="job", cascade="all, delete-orphan")


class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("private_jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    resume_url = Column(String(500), nullable=True)
    cover_letter = Column(Text, nullable=True)
    match_score = Column(Float, default=80.0)
    status = Column(String(50), default="applied")  # applied, reviewing, shortlisted, rejected, interview_scheduled
    interview_date = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    job = relationship("PrivateJob", back_populates="applications")
    user = relationship("User", back_populates="job_applications")
