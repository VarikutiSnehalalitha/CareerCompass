import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1.auth import router as auth_router
from app.api.v1.exams import router as exams_router
from app.api.v1.syllabi import router as syllabi_router
from app.api.v1.questions import router as questions_router
from app.api.v1.tests import router as tests_router
from app.api.v1.planner import router as planner_router
from app.api.v1.jobs import router as jobs_router
from app.api.v1.ai import router as ai_router
from app.api.v1.recruiter import router as recruiter_router
from app.api.v1.admin import router as admin_router
from app.api.v1.dashboard import router as dashboard_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("careercompass")

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="CareerCompass – Complete Competitive Exam, Job Discovery & AI Preparation Platform API",
    version="2.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if settings.CORS_ORIGINS != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(exams_router, prefix=settings.API_V1_STR)
app.include_router(syllabi_router, prefix=settings.API_V1_STR)
app.include_router(questions_router, prefix=settings.API_V1_STR)
app.include_router(tests_router, prefix=settings.API_V1_STR)
app.include_router(planner_router, prefix=settings.API_V1_STR)
app.include_router(jobs_router, prefix=settings.API_V1_STR)
app.include_router(ai_router, prefix=settings.API_V1_STR)
app.include_router(recruiter_router, prefix=settings.API_V1_STR)
app.include_router(admin_router, prefix=settings.API_V1_STR)
app.include_router(dashboard_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": "2.0.0",
        "status": "operational",
        "docs": f"{settings.API_V1_STR}/docs"
    }

@app.get("/health")
def healthcheck():
    return {"status": "healthy", "service": "CareerCompass Backend"}
