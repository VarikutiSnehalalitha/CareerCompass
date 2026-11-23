import os
import sys

# Ensure backend root is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.database import SessionLocal
from app.models.user import User
from app.models.exam import Examination
from app.api.v1.auth import demo_login
from app.api.v1.exams import get_categories, get_examinations, get_examination_detail
from app.api.v1.syllabi import get_syllabus, get_topic_detail
from app.api.v1.questions import get_question_papers
from app.api.v1.dashboard import get_student_dashboard
from app.api.v1.jobs import get_jobs
from app.api.v1.planner import get_active_plan
from app.services.ai_service import ai_service
from app.services.test_engine_service import test_engine_service
from app.services.readiness_service import readiness_service

def run_all_tests():
    print("🧪 Running CareerCompass direct integration & unit test suite...")
    db = SessionLocal()
    try:
        # 1. User & Demo Login
        login_res = demo_login("student", db)
        assert login_res["access_token"] is not None
        assert login_res["user"].role == "student"
        user = login_res["user"]
        print("✅ 1. Demo Student Login & JWT generation verified.")

        # 2. Exam Categories
        cats = get_categories(db)
        assert len(cats) >= 5
        print(f"✅ 2. Exam Categories verified ({len(cats)} categories active).")

        # 3. Examinations List & Filters
        exams = get_examinations(None, None, None, None, None, None, db)
        assert len(exams) >= 5
        ssc_exam = next((e for e in exams if e.code == "SSC_CGL"), None)
        assert ssc_exam is not None
        print(f"✅ 3. Examinations verified ({len(exams)} examinations, SSC CGL active).")

        # 4. Hierarchical Syllabus
        syl = get_syllabus(ssc_exam.id, db)
        assert len(syl.subjects) >= 4
        quant_sub = next((s for s in syl.subjects if "Quant" in s.name), None)
        assert quant_sub is not None
        assert len(quant_sub.topics) >= 4
        print(f"✅ 4. Hierarchical Syllabus verified ({len(syl.subjects)} subjects, {len(quant_sub.topics)} quant topics).")

        # 5. Question Papers (PYQs)
        papers = get_question_papers(ssc_exam.id, None, None, db)
        assert len(papers) >= 5
        print(f"✅ 5. Question Papers verified ({len(papers)} years available with answer keys).")

        # 6. Student Dashboard
        dash = get_student_dashboard(db, user)
        assert dash["student_name"] == "Aarav Sharma"
        assert dash["readiness_score"] > 0
        assert len(dash["today_schedule"]) >= 1
        print(f"✅ 6. Student Dashboard verified for {dash['student_name']} (Readiness: {dash['readiness_score']}%).")

        # 7. Private Jobs Portal
        jobs = get_jobs(None, None, None, None, db)
        assert len(jobs) >= 3
        print(f"✅ 7. Private Jobs portal verified ({len(jobs)} active corporate positions).")

        # 8. Test Engine & Simulation
        test_session = test_engine_service.start_test_session(
            db=db,
            user_id=user.id,
            test_type="topic_test",
            topic_id=quant_sub.topics[0].id,
            num_questions=5
        )
        assert test_session.id is not None
        assert test_session.total_questions >= 1
        print(f"✅ 8. Test Engine session #{test_session.id} generated with {test_session.total_questions} questions.")

        # 9. AI StudyMate Doubt Solver & Topic Teacher
        ai_doubt = ai_service.doubt_solver("Explain percentage profit calculation for exams")
        assert "reply" in ai_doubt
        assert len(ai_doubt["reply"]) > 50
        ai_teach = ai_service.topic_teacher("Number System", mode="exam_focused")
        assert len(ai_teach["reply"]) > 30
        print("✅ 9. AI StudyMate Doubt Solver & Topic Teacher verified.")

        # 10. Preparation Readiness Engine
        readiness = readiness_service.calculate_readiness(db, user.id)
        assert readiness["readiness_score"] >= 35.0
        assert readiness["recommendation"] is not None
        print(f"✅ 10. AI Smart Preparation Engine verified (Readiness Score: {readiness['readiness_score']}%).")

        print("🎉 ALL 10 INTEGRATION AND UNIT TESTS PASSED WITH 100% SUCCESS!")

    finally:
        db.close()

if __name__ == "__main__":
    run_all_tests()
