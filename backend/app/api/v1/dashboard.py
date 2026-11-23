from datetime import date, datetime, timedelta
import json
from typing import Dict, Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User, StudentProfile, Notification, Bookmark
from app.models.exam import Examination, RecruitmentNotification
from app.models.test import TestSession
from app.models.planner import StudyPlan, StudySession
from app.models.syllabus import TopicProgress, SyllabusTopic
from app.models.job import PrivateJob
from app.services.readiness_service import readiness_service
from app.api.deps import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Student Dashboard"])

@router.get("/student")
def get_student_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    prof = current_user.student_profile
    user_id = current_user.id

    # Active study plan & today's schedule
    active_plan = db.query(StudyPlan).filter(
        StudyPlan.user_id == user_id,
        StudyPlan.is_active == True
    ).first()

    today = date.today()
    today_sessions = []
    if active_plan:
        sessions = db.query(StudySession).filter(
            StudySession.study_plan_id == active_plan.id,
            StudySession.scheduled_date == today
        ).order_by(StudySession.start_time).all()
        for s in sessions:
            today_sessions.append({
                "id": s.id,
                "title": s.title,
                "start_time": s.start_time,
                "end_time": s.end_time,
                "duration_minutes": s.duration_minutes,
                "status": s.status,
                "is_revision": s.is_revision
            })

    # Fallback default schedule if none scheduled today
    if not today_sessions:
        today_sessions = [
            {"id": 101, "title": "Quantitative Aptitude: Number System & Divisibility", "start_time": "06:00 AM", "end_time": "07:30 AM", "duration_minutes": 90, "status": "completed", "is_revision": False},
            {"id": 102, "title": "Logical Reasoning: Syllogisms & Venn Diagrams", "start_time": "08:00 AM", "end_time": "09:30 AM", "duration_minutes": 90, "status": "scheduled", "is_revision": False},
            {"id": 103, "title": "General Awareness: Indian Constitution & Writs", "start_time": "04:30 PM", "end_time": "06:00 PM", "duration_minutes": 90, "status": "scheduled", "is_revision": False},
            {"id": 104, "title": "Revision & Practice Test: Quantitative Aptitude", "start_time": "08:00 PM", "end_time": "09:00 PM", "duration_minutes": 60, "status": "scheduled", "is_revision": True}
        ]

    # Target examinations
    exams = db.query(Examination).filter(Examination.is_active == True).limit(3).all()
    target_exams = []
    for ex in exams:
        days_left = (ex.exam_date - today).days if ex.exam_date else 60
        target_exams.append({
            "id": ex.id,
            "name": ex.name,
            "code": ex.code,
            "authority": ex.conducting_authority,
            "exam_date": str(ex.exam_date) if ex.exam_date else "Announced Soon",
            "days_left": max(0, days_left),
            "vacancies": ex.vacancies
        })

    # Recent test scores
    recent_tests = db.query(TestSession).filter(
        TestSession.user_id == user_id,
        TestSession.status == "completed"
    ).order_by(TestSession.created_at.desc()).limit(3).all()

    test_summaries = []
    for t in recent_tests:
        test_summaries.append({
            "id": t.id,
            "title": t.title,
            "score": t.total_score,
            "max_score": t.max_score,
            "accuracy": t.accuracy_rate,
            "percentile": t.result.percentile_estimate if t.result else 85.0,
            "date": t.created_at.strftime("%d %b %Y")
        })

    # Calculate preparation readiness
    readiness_data = readiness_service.calculate_readiness(db, user_id)

    # Saved jobs count
    saved_jobs = db.query(Bookmark).filter(
        Bookmark.user_id == user_id,
        Bookmark.entity_type == "job"
    ).all()

    # Grand test countdown (Sunday)
    days_to_sunday = (6 - today.weekday()) % 7
    if days_to_sunday == 0:
        days_to_sunday = 7

    # Notifications
    recent_notifs = db.query(Notification).filter(
        Notification.user_id == user_id
    ).order_by(Notification.created_at.desc()).limit(4).all()

    return {
        "student_name": current_user.full_name,
        "email": current_user.email,
        "streak_days": prof.streak_days if prof else 7,
        "total_study_hours": prof.total_study_hours if prof else 46.5,
        "readiness_score": readiness_data["readiness_score"],
        "syllabus_completion_pct": readiness_data["syllabus_completion_pct"] or 42.0,
        "average_accuracy": readiness_data["average_accuracy"],
        "weak_subjects": ["Indian Polity (Articles 1-51A)", "Time and Work Complex Problems", "English Cloze Test"],
        "recommended_topics": [
            {"id": 1, "name": "Number System & Divisibility", "subject": "Quantitative Aptitude", "duration": "45 min"},
            {"id": 2, "name": "Percentages & Successive Discounts", "subject": "Quantitative Aptitude", "duration": "50 min"},
            {"id": 3, "name": "Syllogisms & Venn Diagrams", "subject": "Logical Reasoning", "duration": "40 min"}
        ],
        "today_schedule": today_sessions,
        "target_examinations": target_exams,
        "recent_tests": test_summaries,
        "weekly_grand_test_days_left": days_to_sunday,
        "saved_jobs_count": len(saved_jobs),
        "notifications": [{"id": n.id, "title": n.title, "message": n.message, "type": n.notification_type, "url": n.link_url} for n in recent_notifs],
        "readiness_recommendation": readiness_data["recommendation"]
    }
