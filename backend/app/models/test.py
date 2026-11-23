from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from app.core.database import Base

class TestSession(Base):
    __tablename__ = "test_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    test_type = Column(String(50), nullable=False)  # topic_test, grand_test, pyq_practice, sectional_mock
    exam_id = Column(Integer, ForeignKey("examinations.id", ondelete="SET NULL"), nullable=True, index=True)
    question_paper_id = Column(Integer, ForeignKey("question_papers.id", ondelete="SET NULL"), nullable=True)
    topic_id = Column(Integer, ForeignKey("syllabus_topics.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), default="Practice Assessment")
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    duration_seconds = Column(Integer, default=3600)
    status = Column(String(50), default="in_progress")  # in_progress, completed, abandoned, paused
    total_score = Column(Float, default=0.0)
    max_score = Column(Float, default=100.0)
    accuracy_rate = Column(Float, default=0.0)
    total_questions = Column(Integer, default=25)
    answered_count = Column(Integer, default=0)
    correct_count = Column(Integer, default=0)
    incorrect_count = Column(Integer, default=0)
    unanswered_count = Column(Integer, default=0)
    time_spent_seconds = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="test_sessions")
    answers = relationship("TestAnswer", back_populates="test_session", cascade="all, delete-orphan")
    result = relationship("TestResult", back_populates="test_session", uselist=False, cascade="all, delete-orphan")


class TestAnswer(Base):
    __tablename__ = "test_answers"

    id = Column(Integer, primary_key=True, index=True)
    test_session_id = Column(Integer, ForeignKey("test_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False, index=True)
    selected_option_key = Column(String(10), nullable=True)  # A, B, C, D
    numerical_answer = Column(Float, nullable=True)
    is_marked_for_review = Column(Boolean, default=False)
    is_correct = Column(Boolean, nullable=True)
    time_spent_seconds = Column(Integer, default=0)
    marks_awarded = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    test_session = relationship("TestSession", back_populates="answers")
    question = relationship("Question")


class TestResult(Base):
    __tablename__ = "test_results"

    id = Column(Integer, primary_key=True, index=True)
    test_session_id = Column(Integer, ForeignKey("test_sessions.id", ondelete="CASCADE"), unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    percentile_estimate = Column(Float, default=78.5)
    rank_estimate = Column(Integer, default=142)
    subject_breakdown = Column(Text, nullable=True)  # JSON string
    weak_topics = Column(Text, nullable=True)        # JSON string
    strong_topics = Column(Text, nullable=True)      # JSON string
    time_management_score = Column(Float, default=80.0)
    revision_recommendations = Column(Text, nullable=True)
    generated_at = Column(DateTime, default=datetime.utcnow)

    test_session = relationship("TestSession", back_populates="result")
