from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from app.core.database import Base

class StudyPlan(Base):
    __tablename__ = "study_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    exam_id = Column(Integer, ForeignKey("examinations.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    start_date = Column(Date, default=date.today)
    target_exam_date = Column(Date, nullable=False)
    daily_hours = Column(Float, default=4.0)
    current_level = Column(String(50), default="intermediate")
    target_score = Column(Float, default=85.0)
    is_active = Column(Boolean, default=True)
    common_subjects_deduped = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="study_plans")
    sessions = relationship("StudySession", back_populates="study_plan", cascade="all, delete-orphan")


class StudySession(Base):
    __tablename__ = "study_sessions"

    id = Column(Integer, primary_key=True, index=True)
    study_plan_id = Column(Integer, ForeignKey("study_plans.id", ondelete="CASCADE"), nullable=False, index=True)
    topic_id = Column(Integer, ForeignKey("syllabus_topics.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    scheduled_date = Column(Date, nullable=False, index=True)
    start_time = Column(String(20), default="06:00 AM")
    end_time = Column(String(20), default="07:30 AM")
    duration_minutes = Column(Integer, default=90)
    status = Column(String(50), default="scheduled")  # scheduled, completed, missed, rescheduled
    notes = Column(Text, nullable=True)
    is_revision = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    study_plan = relationship("StudyPlan", back_populates="sessions")
    topic = relationship("SyllabusTopic")


class RevisionTask(Base):
    __tablename__ = "revision_tasks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    topic_id = Column(Integer, ForeignKey("syllabus_topics.id", ondelete="CASCADE"), nullable=False, index=True)
    scheduled_date = Column(Date, default=date.today)
    priority = Column(String(50), default="medium")  # low, medium, high
    status = Column(String(50), default="pending")   # pending, done
    reason = Column(String(255), default="Grand test weak area follow-up")
    created_at = Column(DateTime, default=datetime.utcnow)

    topic = relationship("SyllabusTopic")
