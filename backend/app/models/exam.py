from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from app.core.database import Base

class ExamCategory(Base):
    __tablename__ = "exam_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(50), default="award")
    is_active = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    departments = relationship("Department", back_populates="category")
    examinations = relationship("Examination", back_populates="category")


class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    code = Column(String(50), index=True)
    description = Column(Text, nullable=True)
    website_url = Column(String(500), nullable=True)
    state = Column(String(100), default="Central")
    category_id = Column(Integer, ForeignKey("exam_categories.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    category = relationship("ExamCategory", back_populates="departments")
    examinations = relationship("Examination", back_populates="department")


class Examination(Base):
    __tablename__ = "examinations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True, nullable=False)
    code = Column(String(50), index=True, nullable=False)
    conducting_authority = Column(String(255), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id", ondelete="SET NULL"), nullable=True)
    category_id = Column(Integer, ForeignKey("exam_categories.id", ondelete="SET NULL"), nullable=True)
    exam_level = Column(String(50), default="National")  # National, State
    state = Column(String(100), default="All India")
    description = Column(Text, nullable=True)
    qualification_required = Column(String(255), nullable=True)
    min_age = Column(Integer, default=18)
    max_age = Column(Integer, default=32)
    age_relaxation_details = Column(Text, nullable=True)
    nationality_requirements = Column(String(255), default="Indian Citizen")
    vacancies = Column(Integer, default=0)
    salary_min = Column(Float, default=35000.0)
    salary_max = Column(Float, default=95000.0)
    pay_scale = Column(String(100), nullable=True)
    application_fee = Column(Float, default=100.0)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    exam_date = Column(Date, nullable=True)
    selection_process = Column(Text, nullable=True)
    exam_pattern = Column(Text, nullable=True)
    official_notification_url = Column(String(500), nullable=True)
    official_apply_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    verification_status = Column(String(50), default="verified")  # draft, under_review, verified, published
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    category = relationship("ExamCategory", back_populates="examinations")
    department = relationship("Department", back_populates="examinations")
    notifications = relationship("RecruitmentNotification", back_populates="examination", cascade="all, delete-orphan")
    syllabi = relationship("ExamSyllabus", back_populates="examination", cascade="all, delete-orphan")
    question_papers = relationship("QuestionPaper", back_populates="examination", cascade="all, delete-orphan")


class RecruitmentNotification(Base):
    __tablename__ = "recruitment_notifications"

    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("examinations.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    notification_number = Column(String(100), nullable=True)
    release_date = Column(Date, nullable=True)
    apply_last_date = Column(Date, nullable=True)
    exam_start_date = Column(Date, nullable=True)
    pdf_url = Column(String(500), nullable=True)
    official_link = Column(String(500), nullable=True)
    vacancies_count = Column(Integer, default=0)
    status = Column(String(50), default="active")  # upcoming, active, closed
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    examination = relationship("Examination", back_populates="notifications")
