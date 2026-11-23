from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import User, StudentProfile, RecruiterProfile, Bookmark, Notification
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token, UserUpdate
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists"
        )
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role or "student",
        phone=user_in.phone,
        avatar_url=user_in.avatar_url,
        theme_mode=user_in.theme_mode or "light",
        theme_name=user_in.theme_name or "nature",
        bg_style=user_in.bg_style or "forest",
        bg_intensity=user_in.bg_intensity or "balanced"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    if user.role == "student":
        sp = StudentProfile(user_id=user.id, target_score=85.0, daily_study_hours=4.0)
        db.add(sp)
    elif user.role == "recruiter":
        rp = RecruiterProfile(user_id=user.id, company_name="Recruiter Organization")
        db.add(rp)
    db.commit()
    db.refresh(user)

    token = create_access_token(subject=user.id, role=user.role)
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    token = create_access_token(subject=user.id, role=user.role)
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.post("/demo-login/{role}", response_model=Token)
def demo_login(role: str = "student", db: Session = Depends(get_db)):
    role_email_map = {
        "student": "student@careercompass.demo",
        "recruiter": "recruiter@careercompass.demo",
        "admin": "admin@careercompass.demo"
    }
    email = role_email_map.get(role, "student@careercompass.demo")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Demo account not found. Run seed script.")
    token = create_access_token(subject=user.id, role=user.role)
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/preferences", response_model=UserResponse)
def update_preferences(
    prefs: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if prefs.theme_mode is not None:
        current_user.theme_mode = prefs.theme_mode
    if prefs.theme_name is not None:
        current_user.theme_name = prefs.theme_name
    if prefs.bg_style is not None:
        current_user.bg_style = prefs.bg_style
    if prefs.bg_intensity is not None:
        current_user.bg_intensity = prefs.bg_intensity
    if prefs.full_name is not None:
        current_user.full_name = prefs.full_name
    if prefs.phone is not None:
        current_user.phone = prefs.phone
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/notifications")
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notifs = db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(Notification.created_at.desc()).all()
    return notifs
