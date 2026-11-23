from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="student", nullable=False)  # student, recruiter, admin
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    phone = Column(String(50), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    
    # Theme & appearance preferences
    theme_mode = Column(String(20), default="light")  # light, dark
    theme_name = Column(String(20), default="nature")  # nature, galaxy
    bg_style = Column(String(50), default="forest")   # forest, mountains, botanical, minimal, plain / nebula, starfield, galaxy, cosmic, plain
    bg_intensity = Column(String(20), default="balanced") # subtle, balanced, immersive
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    recruiter_profile = relationship("RecruiterProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    bookmarks = relationship("Bookmark", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    test_sessions = relationship("TestSession", back_populates="user", cascade="all, delete-orphan")
    study_plans = relationship("StudyPlan", back_populates="user", cascade="all, delete-orphan")
    job_applications = relationship("JobApplication", back_populates="user", cascade="all, delete-orphan")


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    qualification = Column(String(255), nullable=True)
    state = Column(String(100), default="All India")
    preferred_location = Column(String(255), nullable=True)
    target_score = Column(Float, default=85.0)
    daily_study_hours = Column(Float, default=4.0)
    preferred_study_time = Column(String(50), default="morning")  # morning, afternoon, evening, night
    preparation_level = Column(String(50), default="intermediate") # beginner, intermediate, advanced
    rest_days = Column(String(50), default="Sunday")
    streak_days = Column(Integer, default=5)
    total_study_hours = Column(Float, default=38.5)
    readiness_score = Column(Float, default=68.0)
    resume_url = Column(String(500), nullable=True)
    skills = Column(Text, nullable=True) # comma-separated or json
    active_exam_ids = Column(Text, nullable=True) # comma-separated IDs of exams student is preparing for
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="student_profile")


class RecruiterProfile(Base):
    __tablename__ = "recruiter_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    company_name = Column(String(255), nullable=False)
    company_website = Column(String(255), nullable=True)
    designation = Column(String(100), nullable=True)
    company_logo = Column(String(500), nullable=True)
    verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="recruiter_profile")


class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    entity_type = Column(String(50), nullable=False)  # job, exam, question, question_paper, topic
    entity_id = Column(Integer, nullable=False, index=True)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="bookmarks")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), default="exam")  # exam, deadline, study_reminder, grand_test, application
    link_url = Column(String(500), nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")
