from datetime import datetime, date
from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey, Text
from app.core.database import Base

class ContentSource(Base):
    __tablename__ = "content_sources"

    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String(50), nullable=False)  # exam, syllabus, question_paper, answer_key
    entity_id = Column(Integer, nullable=False, index=True)
    official_source_name = Column(String(255), nullable=False)
    official_url = Column(String(500), nullable=False)
    published_date = Column(Date, nullable=True)
    scraped_or_verified_date = Column(Date, default=date.today)
    verification_status = Column(String(50), default="verified")  # draft, under_review, verified, published
    notes = Column(Text, nullable=True)
    verified_by_user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class ContentVerification(Base):
    __tablename__ = "content_verification"

    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String(50), nullable=False)  # exam, syllabus, question_paper, answer_key, question
    entity_id = Column(Integer, nullable=False, index=True)
    reviewer_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    previous_status = Column(String(50), default="draft")
    new_status = Column(String(50), default="verified")  # draft, under_review, verified, published
    comments = Column(Text, nullable=True)
    verification_date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
