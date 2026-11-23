from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from app.core.database import Base

class QuestionPaper(Base):
    __tablename__ = "question_papers"

    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("examinations.id", ondelete="CASCADE"), nullable=False, index=True)
    paper_title = Column(String(255), nullable=False)
    year = Column(Integer, nullable=False, index=True)
    stage_tier = Column(String(50), default="Tier-1")
    shift = Column(String(50), default="Shift 1")
    paper_type = Column(String(50), default="official_pyq")  # official_pyq, sample_paper, grand_test
    duration_minutes = Column(Integer, default=60)
    total_marks = Column(Float, default=100.0)
    total_questions = Column(Integer, default=100)
    negative_mark_ratio = Column(Float, default=0.25)
    pdf_file_url = Column(String(500), nullable=True)
    answer_key_file_url = Column(String(500), nullable=True)
    official_source_url = Column(String(500), nullable=True)
    verification_status = Column(String(50), default="verified")  # draft, under_review, verified, published
    has_official_key = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    examination = relationship("Examination", back_populates="question_papers")
    answer_keys = relationship("AnswerKey", back_populates="question_paper", cascade="all, delete-orphan")
    questions = relationship("Question", back_populates="question_paper", cascade="all, delete-orphan")


class AnswerKey(Base):
    __tablename__ = "answer_keys"

    id = Column(Integer, primary_key=True, index=True)
    question_paper_id = Column(Integer, ForeignKey("question_papers.id", ondelete="CASCADE"), nullable=False, index=True)
    key_type = Column(String(50), default="official")  # official, expert, provisional, final
    release_date = Column(Date, nullable=True)
    source_url = Column(String(500), nullable=True)
    is_verified = Column(Boolean, default=True)
    verified_by = Column(String(100), default="Exam Authority Commission")
    created_at = Column(DateTime, default=datetime.utcnow)

    question_paper = relationship("QuestionPaper", back_populates="answer_keys")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    question_paper_id = Column(Integer, ForeignKey("question_papers.id", ondelete="SET NULL"), nullable=True, index=True)
    topic_id = Column(Integer, ForeignKey("syllabus_topics.id", ondelete="SET NULL"), nullable=True, index=True)
    question_text = Column(Text, nullable=False)
    question_type = Column(String(50), default="mcq")  # mcq, numerical, boolean, coding
    difficulty = Column(String(50), default="medium")  # beginner, easy, medium, hard, advanced
    marks = Column(Float, default=1.0)
    negative_marks = Column(Float, default=0.25)
    is_pyq = Column(Boolean, default=False)
    pyq_year = Column(Integer, nullable=True)
    verification_status = Column(String(50), default="verified")  # verified, sample, ai_generated, needs_review
    source_label = Column(String(255), default="Verified Commission Paper")
    created_at = Column(DateTime, default=datetime.utcnow)

    question_paper = relationship("QuestionPaper", back_populates="questions")
    topic = relationship("SyllabusTopic", back_populates="questions")
    options = relationship("QuestionOption", back_populates="question", cascade="all, delete-orphan")
    explanation = relationship("QuestionExplanation", back_populates="question", uselist=False, cascade="all, delete-orphan")


class QuestionOption(Base):
    __tablename__ = "question_options"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False, index=True)
    option_key = Column(String(10), nullable=False)  # A, B, C, D
    option_text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)
    explanation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    question = relationship("Question", back_populates="options")


class QuestionExplanation(Base):
    __tablename__ = "question_explanations"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), unique=True, nullable=False)
    detailed_solution = Column(Text, nullable=False)
    shortcut_technique = Column(Text, nullable=True)
    formula_used = Column(Text, nullable=True)
    common_pitfall = Column(Text, nullable=True)
    verified_by = Column(String(100), default="Subject Matter Expert")
    created_at = Column(DateTime, default=datetime.utcnow)

    question = relationship("Question", back_populates="explanation")
