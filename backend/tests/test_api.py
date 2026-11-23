import os
import sys
import pytest
from fastapi.testclient import TestClient

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_demo_login_student():
    response = client.post("/api/v1/auth/demo-login/student")
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "student"

def test_get_exam_categories():
    response = client.get("/api/v1/exams/categories")
    assert response.status_code == 200
    cats = response.json()
    assert len(cats) >= 5
    slugs = [c["slug"] for c in cats]
    assert "ssc" in slugs
    assert "upsc" in slugs

def test_get_examinations():
    response = client.get("/api/v1/exams/")
    assert response.status_code == 200
    exams = response.json()
    assert len(exams) >= 5
    codes = [e["code"] for e in exams]
    assert "SSC_CGL" in codes

def test_get_syllabus():
    # SSC CGL exam id is 1
    response = client.get("/api/v1/syllabi/1")
    assert response.status_code == 200
    data = response.json()
    assert "subjects" in data
    assert len(data["subjects"]) >= 4

def test_get_question_papers():
    response = client.get("/api/v1/questions/papers")
    assert response.status_code == 200
    papers = response.json()
    assert len(papers) >= 5

def test_student_dashboard():
    response = client.get("/api/v1/dashboard/student")
    assert response.status_code == 200
    dash = response.json()
    assert "student_name" in dash
    assert "readiness_score" in dash
    assert "today_schedule" in dash
    assert len(dash["today_schedule"]) >= 1

def test_private_jobs():
    response = client.get("/api/v1/jobs/")
    assert response.status_code == 200
    jobs = response.json()
    assert len(jobs) >= 3

def test_ai_doubt_solver():
    response = client.post("/api/v1/ai/chat", json={
        "mode": "doubt_solver",
        "message": "Explain how to calculate percentage profit when cost price is 400 and selling price is 500"
    })
    assert response.status_code == 200
    res = response.json()
    assert "reply" in res
    assert "Profit" in res["reply"] or "25%" in res["reply"]
