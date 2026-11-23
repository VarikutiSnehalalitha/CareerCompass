# CareerCompass – Complete Competitive Exam, Job Discovery & AI Preparation Platform

CareerCompass is a production-ready career preparation platform combining the features of a **government & private job portal**, **competitive examination preparation platform**, **10–15 year previous-year question paper (PYQ) library**, **intelligent study planner** with cross-exam subject deduplication, **full CBT mock test system**, and **StudyMate AI-powered study mentor**.

---

## 🌟 Key Architecture & Capabilities

### 1. Centralized Theme System (4 Combinations)
CareerCompass supports a theme customization system:
- **Nature Light**: Warm ivory surfaces, sage, forest green, natural textures.
- **Nature Dark**: Deep forest green, dark moss, charcoal olive, soft emerald accents.
- **Galaxy Light**: Soft lavender-white, pale cosmic blue, silver, and starlight coral.
- **Galaxy Dark**: Midnight cosmic purple, dark indigo, and nebula violet.
- **Background Styles**: Forest, Mountains, Botanical, Minimal / Nebula, Starfield, Galaxy, Cosmic.
- **Background Intensity**: Subtle (35%), Balanced (70%), Immersive (100%).
- **Distraction-Free Mode**: Automatically disables background decoration during exams & focused study.

### 2. Multi-Exam Setup & Intelligent Timetable Engine
- Select multiple examinations simultaneously (e.g., **SSC CGL + IBPS PO**).
- **Overlapping Subject Deduplication**: Detects shared subjects (Quantitative Aptitude, Logical Reasoning, English Language, General Awareness) and merges them into unified daily slots to save ~2.5 hours/day.
- **Missed Session Recovery**: Reschedules missed study sessions into subsequent evening revision buffers without overloading the student.

### 3. Hierarchical Syllabus System
- Structure: **Examination → Subject → Unit → Topic → Subtopic**.
- Study notes, high-yield formula sheets, difficulty levels, and completion status.
- Automatic unlocking of 5, 10, 15, or 25-question topic tests upon topic completion.

### 4. 10–15 Year Previous-Year Question Paper Library
- Archive of past examination papers from 2012 to 2026.
- Verified official answer keys vs. expert solutions clearly distinguished.
- Practice Mode and Online Timed Exam Mode.

### 5. Weekly Grand Test System
- Full CBT simulation every Sunday with exam-specific question count, sectional timing, and negative marking (-0.50 for SSC, -0.25 for Banking, -0.33 for UPSC).
- Post-test scorecard with percentage, accuracy rate, simulated rank/percentile, subject breakdown, and auto-scheduled revision tasks.

### 6. AI StudyMate Mentor
- **AI Doubt Solver**: Step-by-step conceptual derivations, formula applications, and trap warnings.
- **AI Topic Teacher**: 6 teaching modes: Beginner, Exam-Focused, Quick Revision, Detailed Masterclass, Formula Sheet, and Interview Prep.
- **AI Question Generator**: Exam-calibrated questions with verified solutions.
- **AI Preparation Engine**: Continuous readiness score calculation based on accuracy trends and syllabus coverage.

### 7. Private Jobs & Placement Portal
- Technology, analytics, engineering, and trainee listings.
- Resume-based skill matching score and gap analysis.
- One-click application tracking and recruiter shortlisting.

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.9+
- Node.js 18+ and npm
- PostgreSQL (or automated SQLite fallback included)
- Redis (optional, memory cache fallback included)

### 1. Database Seeding & Backend Launch

```powershell
# Navigate to backend directory
cd backend

# Populate database with comprehensive realistic examinations, syllabi, PYQs, and jobs
$env:PYTHONPATH="backend"
python -m app.seed_all

# Run backend test suite
python backend/tests/run_tests.py

# Launch FastAPI Backend Server
uvicorn app.main:app --reload --port 8000
```

Backend will be active at:
- **REST APIs**: `http://127.0.0.1:8000/api/v1`
- **Interactive Swagger Docs**: `http://127.0.0.1:8000/api/v1/docs`

### 2. Frontend Launch

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend application will be accessible at:
- `http://localhost:3000`

---

## 🔑 Pre-Seeded Demo Personas (1-Click Switcher in Header)

| Persona | Email | Password | Access / Capabilities |
|---|---|---|---|
| **Student** | `student@careercompass.demo` | `Student@123` | Dashboard, exams, hierarchical syllabus, PYQs, timetables, CBT tests |
| **Recruiter** | `recruiter@careercompass.demo` | `Recruiter@123` | Post jobs, evaluate candidate match scores, schedule interviews |
| **Administrator** | `admin@careercompass.demo` | `Admin@123` | Quality gate: Draft → Under Review → Verified → Published |

---

## 🐳 Docker Deployment

To launch the full stack with PostgreSQL, Redis, FastAPI, and Next.js:

```bash
docker-compose up --build -d
```
