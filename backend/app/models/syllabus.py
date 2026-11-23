from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from app.core.database import Base

class ExamSyllabus(Base):
    __tablename__ = "exam_syllabi"

    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("examinations.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    version = Column(String(50), default="2026.1")
    is_active = Column(Boolean, default=True)
    verification_status = Column(String(50), default="verified")  # draft, under_review, verified, published
    source_url = Column(String(500), nullable=True)
    verified_by = Column(String(100), default="Official Notification")
    created_at = Column(DateTime, default=datetime.utcnow)

    examination = relationship("Examination", back_populates="syllabi")
    subjects = relationship("SyllabusSubject", back_populates="syllabus", cascade="all, delete-orphan")


class SyllabusSubject(Base):
    __tablename__ = "syllabus_subjects"

    id = Column(Integer, primary_key=True, index=True)
    syllabus_id = Column(Integer, ForeignKey("exam_syllabi.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    code = Column(String(50), nullable=True)
    weightage_percent = Column(Float, default=25.0)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    syllabus = relationship("ExamSyllabus", back_populates="subjects")
    topics = relationship("SyllabusTopic", back_populates="subject", cascade="all, delete-orphan")


class SyllabusTopic(Base):
    __tablename__ = "syllabus_topics"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("syllabus_subjects.id", ondelete="CASCADE"), nullable=False, index=True)
    parent_topic_id = Column(Integer, ForeignKey("syllabus_topics.id", ondelete="CASCADE"), nullable=True)
    name = Column(String(255), nullable=False)
    unit_name = Column(String(255), nullable=True)
    difficulty_level = Column(String(50), default="medium")  # beginner, easy, medium, hard, advanced
    recommended_hours = Column(Float, default=3.0)
    description = Column(Text, nullable=True)
    study_notes = Column(Text, nullable=True)
    formulas_summary = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    subject = relationship("SyllabusSubject", back_populates="topics")
    subtopics = relationship("SyllabusTopic", backref="parent_topic", remote_side=[id])
    progress_entries = relationship("TopicProgress", back_populates="topic", cascade="all, delete-orphan")
    questions = relationship("Question", back_populates="topic")


class TopicProgress(Base):
    __tablename__ = "topic_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    topic_id = Column(Integer, ForeignKey("syllabus_topics.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String(50), default="not_started")  # not_started, in_progress, completed, needs_revision
    mastery_percentage = Column(Float, default=0.0)
    last_studied_at = Column(DateTime, nullable=True)
    study_time_minutes = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    topic = relationship("SyllabusTopic", back_populates="progress_entries")
