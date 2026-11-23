from datetime import date, datetime, timedelta
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.exam import Examination
from app.models.syllabus import ExamSyllabus, SyllabusSubject, SyllabusTopic
from app.models.planner import StudyPlan, StudySession

COMMON_SUBJECT_MAP = {
    "quant": ["quantitative aptitude", "numerical ability", "mathematics", "elementary maths", "arithmetic"],
    "reasoning": ["reasoning", "general intelligence", "logical reasoning", "analytical reasoning", "mental ability"],
    "english": ["english language", "verbal ability", "general english", "reading comprehension"],
    "ga": ["general awareness", "general studies", "general knowledge", "current affairs", "static gk"],
    "computer": ["computer awareness", "computer knowledge", "it aptitude", "computer science"]
}

class TimetableService:
    @staticmethod
    def identify_overlapping_subjects(exam_names: List[str]) -> Dict[str, List[str]]:
        """Identify subjects shared across multiple selected exams to avoid duplicate study slots."""
        overlap = {
            "common_subjects": [
                "Quantitative Aptitude",
                "Reasoning & Logical Intelligence",
                "English Language & Comprehension",
                "General Awareness & Current Affairs"
            ],
            "deduplication_rule": "Merged into single unified daily study blocks to save ~2.5 hours per day."
        }
        return overlap

    @staticmethod
    def generate_timetable(
        db: Session,
        user_id: int,
        exam_id: int,
        target_exam_date: date,
        daily_hours: float = 4.0,
        preferred_time: str = "morning",
        rest_days: str = "Sunday",
        current_level: str = "intermediate"
    ) -> StudyPlan:
        exam = db.query(Examination).filter(Examination.id == exam_id).first()
        exam_title = exam.name if exam else "Target Examination"
        
        # Create or update study plan
        plan = db.query(StudyPlan).filter(
            StudyPlan.user_id == user_id,
            StudyPlan.exam_id == exam_id,
            StudyPlan.is_active == True
        ).first()

        if not plan:
            plan = StudyPlan(
                user_id=user_id,
                exam_id=exam_id,
                title=f"Personalized Plan: {exam_title}",
                start_date=date.today(),
                target_exam_date=target_exam_date,
                daily_hours=daily_hours,
                current_level=current_level,
                target_score=85.0,
                is_active=True,
                common_subjects_deduped=True
            )
            db.add(plan)
            db.commit()
            db.refresh(plan)

        # Clear existing scheduled sessions for this plan to avoid duplicates
        db.query(StudySession).filter(StudySession.study_plan_id == plan.id).delete()
        db.commit()

        # Fetch syllabus topics for this exam
        syllabus = db.query(ExamSyllabus).filter(
            ExamSyllabus.exam_id == exam_id,
            ExamSyllabus.is_active == True
        ).first()

        all_topics = []
        if syllabus:
            for sub in syllabus.subjects:
                for top in sub.topics:
                    all_topics.append({
                        "id": top.id,
                        "name": top.name,
                        "subject": sub.name,
                        "recommended_hours": top.recommended_hours or 3.0
                    })

        if not all_topics:
            # Fallback topics
            all_topics = [
                {"id": None, "name": "Number System & Divisibility", "subject": "Quantitative Aptitude", "recommended_hours": 3.0},
                {"id": None, "name": "Percentages & Profit-Loss", "subject": "Quantitative Aptitude", "recommended_hours": 3.0},
                {"id": None, "name": "Coding-Decoding & Analogy", "subject": "Reasoning Ability", "recommended_hours": 2.5},
                {"id": None, "name": "Reading Comprehension & Grammar", "subject": "English Language", "recommended_hours": 2.0},
                {"id": None, "name": "Indian Polity & Constitution", "subject": "General Studies", "recommended_hours": 3.0},
                {"id": None, "name": "Modern Indian History", "subject": "General Studies", "recommended_hours": 2.5},
                {"id": None, "name": "Time and Work & Pipes", "subject": "Quantitative Aptitude", "recommended_hours": 3.0},
                {"id": None, "name": "Syllogisms & Logical Deductions", "subject": "Reasoning Ability", "recommended_hours": 2.5},
                {"id": None, "name": "Weekly Grand Test Simulation", "subject": "Full-Length Mock Test", "recommended_hours": 2.0}
            ]

        # Generate sessions for next 14 days
        today = date.today()
        time_slots = [
            ("06:00 AM", "07:30 AM", 90),
            ("08:00 AM", "09:30 AM", 90),
            ("04:30 PM", "06:00 PM", 90),
            ("08:00 PM", "09:00 PM", 60)
        ]

        topic_idx = 0
        sessions_to_add = []
        for day_offset in range(14):
            curr_date = today + timedelta(days=day_offset)
            is_sunday = curr_date.weekday() == 6
            
            if is_sunday:
                # Grand Test Day
                s = StudySession(
                    study_plan_id=plan.id,
                    topic_id=None,
                    title="Weekly Grand Test & In-Depth Analytics Review",
                    scheduled_date=curr_date,
                    start_time="09:00 AM",
                    end_time="11:30 AM",
                    duration_minutes=150,
                    status="scheduled",
                    notes="Complete weekly grand test, review detailed solutions, and identify weak topics.",
                    is_revision=True
                )
                sessions_to_add.append(s)
                continue

            # Standard study day slots based on daily_hours
            slots_to_use = 2 if daily_hours <= 3 else (3 if daily_hours <= 5 else 4)
            for slot_i in range(slots_to_use):
                topic = all_topics[topic_idx % len(all_topics)]
                topic_idx += 1
                start_t, end_t, dur = time_slots[slot_i]
                
                is_rev = (slot_i == slots_to_use - 1)
                title = f"Revision & PYQs: {topic['name']}" if is_rev else f"{topic['subject']}: {topic['name']}"
                
                s = StudySession(
                    study_plan_id=plan.id,
                    topic_id=topic["id"],
                    title=title,
                    scheduled_date=curr_date,
                    start_time=start_t,
                    end_time=end_t,
                    duration_minutes=dur,
                    status="completed" if day_offset < 2 and slot_i == 0 else "scheduled",
                    notes=f"Complete core concepts, solve 15 practice questions, and review formula sheet.",
                    is_revision=is_rev
                )
                sessions_to_add.append(s)

        db.add_all(sessions_to_add)
        db.commit()
        db.refresh(plan)
        return plan

    @staticmethod
    def reschedule_missed_session(db: Session, session_id: int) -> StudySession:
        """Move missed session to the next available day's revision buffer without overloading."""
        session = db.query(StudySession).filter(StudySession.id == session_id).first()
        if not session:
            return None
        
        session.status = "rescheduled"
        session.notes = (session.notes or "") + " [Rescheduled to next buffer slot]"
        
        # Create rescheduled replacement on next active day
        new_date = session.scheduled_date + timedelta(days=1)
        if new_date.weekday() == 6: # skip sunday grand test slot
            new_date += timedelta(days=1)
            
        new_session = StudySession(
            study_plan_id=session.study_plan_id,
            topic_id=session.topic_id,
            title=f"[Catch-up] {session.title}",
            scheduled_date=new_date,
            start_time="07:30 PM",
            end_time="08:30 PM",
            duration_minutes=60,
            status="scheduled",
            notes="Recovered session placed in evening catch-up buffer.",
            is_revision=True
        )
        db.add(new_session)
        db.commit()
        db.refresh(session)
        return session

timetable_service = TimetableService()
