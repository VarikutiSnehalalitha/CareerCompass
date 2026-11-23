from typing import Optional, List
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.ai import (
    AIChatRequest, AIChatResponse, AIQuestionGenRequest, AIRevisionNotesRequest
)
from app.services.ai_service import ai_service
from app.api.deps import get_current_user
from app.models.user import User
from app.models.ai import AIConversation, AIUsageLog

router = APIRouter(prefix="/ai", tags=["AI StudyMate Mentor"])

@router.post("/chat", response_model=AIChatResponse)
def ai_chat(
    req: AIChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session_id = req.session_id or str(uuid.uuid4())
    mode = req.mode or "doubt_solver"

    if mode == "doubt_solver":
        result = ai_service.doubt_solver(req.message)
    elif mode == "topic_teacher":
        result = ai_service.topic_teacher(req.message, mode="exam_focused")
    elif mode == "career_guidance":
        result = {
            "reply": (
                "### CareerCompass Tailored Recommendation:\n"
                "Based on your preparation in Quantitative Aptitude and Computer Science background:\n"
                "1. **Government Path:** SSC CGL (Assistant Section Officer / Income Tax Inspector) and IBPS PO provide strong job security and high starting basic pay.\n"
                "2. **Technical Path:** Full-Stack & AI Engineering in Private Sector (CloudScale Systems, NexaAI Labs) match your programming skills with high market compensation.\n"
                "3. **Dual Strategy:** Continue core aptitude & reasoning prep daily; it serves both competitive government exam Prelims and campus/private recruitment aptitude rounds simultaneously!"
            ),
            "mode": "career_guidance",
            "suggested_actions": ["Explore SSC CGL Syllabus", "View Matching Private Jobs", "Generate Combined Timetable"]
        }
    else:
        result = ai_service.doubt_solver(req.message)

    # Log usage
    log = AIUsageLog(
        user_id=current_user.id,
        prompt_tokens=len(req.message.split()) * 2,
        completion_tokens=len(result["reply"].split()) * 2,
        feature_used=mode
    )
    db.add(log)
    db.commit()

    return AIChatResponse(
        reply=result["reply"],
        mode=result["mode"],
        session_id=session_id,
        suggested_actions=result.get("suggested_actions", [])
    )

@router.post("/generate-questions")
def generate_questions(
    req: AIQuestionGenRequest,
    current_user: User = Depends(get_current_user)
):
    qs = ai_service.generate_questions(
        exam_name=req.exam_name,
        subject=req.subject,
        topic=req.topic,
        difficulty=req.difficulty,
        count=req.num_questions
    )
    return {"questions": qs, "topic": req.topic, "exam": req.exam_name}

@router.post("/revision-notes")
def generate_revision_notes(
    req: AIRevisionNotesRequest,
    current_user: User = Depends(get_current_user)
):
    notes = ai_service.topic_teacher(req.topic_name, mode="quick_revision")
    return {"notes": notes["reply"], "topic": req.topic_name}
