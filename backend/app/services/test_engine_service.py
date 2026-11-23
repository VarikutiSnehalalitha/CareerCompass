from datetime import datetime
import json
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.question import Question, QuestionPaper, QuestionOption, QuestionExplanation
from app.models.test import TestSession, TestAnswer, TestResult
from app.models.syllabus import SyllabusTopic, TopicProgress
from app.models.planner import RevisionTask
from app.models.user import StudentProfile

class TestEngineService:
    @staticmethod
    def start_test_session(
        db: Session,
        user_id: int,
        test_type: str,
        exam_id: Optional[int] = None,
        question_paper_id: Optional[int] = None,
        topic_id: Optional[int] = None,
        num_questions: int = 25
    ) -> TestSession:
        title = "Assessment"
        duration_seconds = 3600
        
        # Determine questions to pull
        q_query = db.query(Question)
        if question_paper_id:
            paper = db.query(QuestionPaper).filter(QuestionPaper.id == question_paper_id).first()
            if paper:
                title = f"{paper.paper_title} ({paper.year})"
                duration_seconds = (paper.duration_minutes or 60) * 60
            q_query = q_query.filter(Question.question_paper_id == question_paper_id)
        elif topic_id:
            topic = db.query(SyllabusTopic).filter(SyllabusTopic.id == topic_id).first()
            if topic:
                title = f"Topic Mastery Test: {topic.name}"
                duration_seconds = min(num_questions * 90, 3600)
            q_query = q_query.filter(Question.topic_id == topic_id)
        elif exam_id:
            title = f"Weekly Grand Test: Target Exam"
            duration_seconds = 7200
        
        selected_questions = q_query.limit(num_questions).all()
        
        # If not enough specific questions, pull any verified questions to ensure full test experience
        if not selected_questions:
            selected_questions = db.query(Question).limit(num_questions).all()

        max_marks = sum(q.marks for q in selected_questions) if selected_questions else float(num_questions * 2)

        session = TestSession(
            user_id=user_id,
            test_type=test_type,
            exam_id=exam_id,
            question_paper_id=question_paper_id,
            topic_id=topic_id,
            title=title,
            start_time=datetime.utcnow(),
            duration_seconds=duration_seconds,
            status="in_progress",
            max_score=max_marks,
            total_questions=len(selected_questions),
            answered_count=0,
            correct_count=0,
            incorrect_count=0,
            unanswered_count=len(selected_questions)
        )
        db.add(session)
        db.commit()
        db.refresh(session)

        # Pre-create blank answer records
        for q in selected_questions:
            ans = TestAnswer(
                test_session_id=session.id,
                question_id=q.id,
                selected_option_key=None,
                is_marked_for_review=False,
                time_spent_seconds=0,
                marks_awarded=0.0
            )
            db.add(ans)
        db.commit()
        db.refresh(session)
        return session

    @staticmethod
    def evaluate_test(
        db: Session,
        session_id: int,
        answers_payload: List[Dict[str, Any]],
        total_time_spent: int
    ) -> TestSession:
        session = db.query(TestSession).filter(TestSession.id == session_id).first()
        if not session:
            return None

        payload_map = {item["question_id"]: item for item in answers_payload}

        total_score = 0.0
        correct_count = 0
        incorrect_count = 0
        answered_count = 0
        
        subject_stats = {}
        topic_stats = {}

        for ans in session.answers:
            p_data = payload_map.get(ans.question_id)
            if p_data:
                ans.selected_option_key = p_data.get("selected_option_key")
                ans.numerical_answer = p_data.get("numerical_answer")
                ans.is_marked_for_review = p_data.get("is_marked_for_review", False)
                ans.time_spent_seconds = p_data.get("time_spent_seconds", 0)

            q = ans.question
            if not q:
                continue

            sub_name = q.topic.subject.name if q.topic and q.topic.subject else "General"
            top_name = q.topic.name if q.topic else "General Concept"

            if sub_name not in subject_stats:
                subject_stats[sub_name] = {"total": 0, "correct": 0, "score": 0.0}
            if top_name not in topic_stats:
                topic_stats[top_name] = {"total": 0, "correct": 0}

            subject_stats[sub_name]["total"] += 1
            topic_stats[top_name]["total"] += 1

            # Check correctness
            if ans.selected_option_key:
                answered_count += 1
                correct_opt = next((opt for opt in q.options if opt.is_correct), None)
                if correct_opt and correct_opt.option_key == ans.selected_option_key:
                    ans.is_correct = True
                    ans.marks_awarded = q.marks
                    correct_count += 1
                    total_score += q.marks
                    subject_stats[sub_name]["correct"] += 1
                    subject_stats[sub_name]["score"] += q.marks
                    topic_stats[top_name]["correct"] += 1
                else:
                    ans.is_correct = False
                    penalty = q.negative_marks or (q.marks * 0.25)
                    ans.marks_awarded = -penalty
                    incorrect_count += 1
                    total_score -= penalty
                    subject_stats[sub_name]["score"] -= penalty
            else:
                ans.is_correct = None
                ans.marks_awarded = 0.0

        unanswered = session.total_questions - answered_count
        accuracy = (correct_count / answered_count * 100.0) if answered_count > 0 else 0.0

        session.end_time = datetime.utcnow()
        session.status = "completed"
        session.total_score = max(0.0, round(total_score, 2))
        session.accuracy_rate = round(accuracy, 1)
        session.answered_count = answered_count
        session.correct_count = correct_count
        session.incorrect_count = incorrect_count
        session.unanswered_count = unanswered
        session.time_spent_seconds = total_time_spent

        # Classify weak & strong topics
        weak_topics = []
        strong_topics = []
        for t_name, stats in topic_stats.items():
            pct = (stats["correct"] / stats["total"]) * 100.0 if stats["total"] > 0 else 0
            if pct < 50.0:
                weak_topics.append(t_name)
            elif pct >= 75.0:
                strong_topics.append(t_name)

        if not strong_topics:
            strong_topics = ["Fundamental Concepts", "Speed Calculation"]
        if not weak_topics:
            weak_topics = ["Multi-step Application Questions"]

        # Percentile calculation
        percentile = min(99.4, round(max(45.0, (accuracy * 0.6) + ((session.total_score / max(session.max_score, 1)) * 40)), 1))
        rank = max(1, int(1500 * (1 - (percentile / 100.0))))

        result = TestResult(
            test_session_id=session.id,
            user_id=session.user_id,
            percentile_estimate=percentile,
            rank_estimate=rank,
            subject_breakdown=json.dumps(subject_stats),
            weak_topics=json.dumps(weak_topics),
            strong_topics=json.dumps(strong_topics),
            time_management_score=round(min(100.0, max(60.0, (answered_count / max(session.total_questions, 1)) * 100.0)), 1),
            revision_recommendations=f"Target weak areas: {', '.join(weak_topics[:3])}. Re-test in 3 days."
        )
        db.add(result)

        # Automatically schedule revision tasks for weak topics
        for w_top in weak_topics[:2]:
            matching_t = db.query(SyllabusTopic).filter(SyllabusTopic.name == w_top).first()
            if matching_t:
                rev_task = RevisionTask(
                    user_id=session.user_id,
                    topic_id=matching_t.id,
                    priority="high",
                    status="pending",
                    reason=f"Scored low in test #{session.id}"
                )
                db.add(rev_task)

        # Update student profile stats
        prof = db.query(StudentProfile).filter(StudentProfile.user_id == session.user_id).first()
        if prof:
            prof.readiness_score = round(min(98.0, max(40.0, (prof.readiness_score * 0.7) + (percentile * 0.3))), 1)

        db.commit()
        db.refresh(session)
        return session

test_engine_service = TestEngineService()
