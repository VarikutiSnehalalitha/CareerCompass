import json
from datetime import date, datetime, timedelta
from sqlalchemy.orm import Session
from app.core.security import get_password_hash
from app.models.user import User, StudentProfile, RecruiterProfile, Bookmark, Notification
from app.models.exam import ExamCategory, Department, Examination, RecruitmentNotification
from app.models.syllabus import ExamSyllabus, SyllabusSubject, SyllabusTopic, TopicProgress
from app.models.question import QuestionPaper, AnswerKey, Question, QuestionOption, QuestionExplanation
from app.models.test import TestSession, TestAnswer, TestResult
from app.models.planner import StudyPlan, StudySession, RevisionTask
from app.models.job import PrivateJob, JobApplication
from app.models.content import ContentSource, ContentVerification

def seed_database(db: Session):
    print("🌱 Starting CareerCompass comprehensive seed pipeline...")

    # 1. USERS & PROFILES
    student_user = db.query(User).filter(User.email == "student@careercompass.demo").first()
    if not student_user:
        student_user = User(
            email="student@careercompass.demo",
            hashed_password=get_password_hash("Student@123"),
            full_name="Aarav Sharma",
            role="student",
            is_active=True,
            is_verified=True,
            phone="+91 98765 43210",
            theme_mode="light",
            theme_name="nature",
            bg_style="forest",
            bg_intensity="balanced"
        )
        db.add(student_user)
        db.commit()
        db.refresh(student_user)

        student_prof = StudentProfile(
            user_id=student_user.id,
            qualification="B.Tech Computer Science / Graduate",
            state="Telangana",
            preferred_location="Hyderabad / Bangalore / New Delhi",
            target_score=88.0,
            daily_study_hours=4.5,
            preferred_study_time="morning",
            preparation_level="intermediate",
            rest_days="Sunday",
            streak_days=7,
            total_study_hours=46.5,
            readiness_score=76.5,
            skills="Python, SQL, Quantitative Aptitude, Logical Reasoning, English, General Awareness",
            active_exam_ids="1,2,3"
        )
        db.add(student_prof)

    recruiter_user = db.query(User).filter(User.email == "recruiter@careercompass.demo").first()
    if not recruiter_user:
        recruiter_user = User(
            email="recruiter@careercompass.demo",
            hashed_password=get_password_hash("Recruiter@123"),
            full_name="Pooja Verma",
            role="recruiter",
            is_active=True,
            is_verified=True,
            phone="+91 98111 22334"
        )
        db.add(recruiter_user)
        db.commit()
        db.refresh(recruiter_user)

        recruiter_prof = RecruiterProfile(
            user_id=recruiter_user.id,
            company_name="Apex Technology Innovations",
            company_website="https://apextech.example.com",
            designation="Talent Acquisition Lead",
            verified=True
        )
        db.add(recruiter_prof)

    admin_user = db.query(User).filter(User.email == "admin@careercompass.demo").first()
    if not admin_user:
        admin_user = User(
            email="admin@careercompass.demo",
            hashed_password=get_password_hash("Admin@123"),
            full_name="Dr. Rajesh Menon",
            role="admin",
            is_active=True,
            is_verified=True,
            phone="+91 94444 55667"
        )
        db.add(admin_user)
        db.commit()

    # 2. EXAM CATEGORIES
    categories_data = [
        {"name": "Staff Selection Commission (SSC)", "slug": "ssc", "icon": "briefcase", "description": "Combined Graduate Level, CHSL, MTS, CPO, and Technical Posts"},
        {"name": "UPSC & Civil Services", "slug": "upsc", "icon": "shield-check", "description": "IAS, IPS, IFS, Engineering Services, CDS, and NDA"},
        {"name": "Banking & Insurance", "slug": "banking", "icon": "landmark", "description": "IBPS PO/Clerk, SBI PO/Clerk, RBI Grade B, LIC AAO"},
        {"name": "Railways Recruitment (RRB)", "slug": "railways", "icon": "train", "description": "RRB NTPC, ALP, Group D, Junior Engineer"},
        {"name": "State PSC Recruitment", "slug": "state-psc", "icon": "map-pin", "description": "Telangana TGPSC, APPSC, MPSC, UPPSC, KPSC, TNPSC, BPSC"},
        {"name": "Defence & Paramilitary", "slug": "defence", "icon": "shield", "description": "Indian Army, Navy, Air Force, AFCAT, CAPF, Police SI/Constable"},
        {"name": "Engineering & Technical", "slug": "engineering", "icon": "cpu", "description": "GATE, ESE, ISRO, DRDO, BARC, PSU recruitment"},
        {"name": "Teaching & Academic", "slug": "teaching", "icon": "book-open", "description": "CTET, State TET, UGC NET, Assistant Professor, KVS, NVS"}
    ]

    cat_map = {}
    for c_data in categories_data:
        cat = db.query(ExamCategory).filter(ExamCategory.slug == c_data["slug"]).first()
        if not cat:
            cat = ExamCategory(
                name=c_data["name"],
                slug=c_data["slug"],
                icon=c_data["icon"],
                description=c_data["description"]
            )
            db.add(cat)
            db.commit()
            db.refresh(cat)
        cat_map[c_data["slug"]] = cat.id

    # 3. DEPARTMENTS
    dept_ssc = db.query(Department).filter(Department.code == "SSC_HQ").first()
    if not dept_ssc:
        dept_ssc = Department(
            name="Staff Selection Commission, Government of India",
            code="SSC_HQ",
            state="Central",
            category_id=cat_map["ssc"],
            website_url="https://ssc.gov.in"
        )
        db.add(dept_ssc)
        db.commit()
        db.refresh(dept_ssc)

    dept_upsc = db.query(Department).filter(Department.code == "UPSC_HQ").first()
    if not dept_upsc:
        dept_upsc = Department(
            name="Union Public Service Commission",
            code="UPSC_HQ",
            state="Central",
            category_id=cat_map["upsc"],
            website_url="https://upsc.gov.in"
        )
        db.add(dept_upsc)
        db.commit()
        db.refresh(dept_upsc)

    dept_ibps = db.query(Department).filter(Department.code == "IBPS_HQ").first()
    if not dept_ibps:
        dept_ibps = Department(
            name="Institute of Banking Personnel Selection",
            code="IBPS_HQ",
            state="Central",
            category_id=cat_map["banking"],
            website_url="https://ibps.in"
        )
        db.add(dept_ibps)
        db.commit()
        db.refresh(dept_ibps)

    dept_tspsc = db.query(Department).filter(Department.code == "TGPSC_TEL").first()
    if not dept_tspsc:
        dept_tspsc = Department(
            name="Telangana Public Service Commission",
            code="TGPSC_TEL",
            state="Telangana",
            category_id=cat_map["state-psc"],
            website_url="https://tspsc.gov.in"
        )
        db.add(dept_tspsc)
        db.commit()
        db.refresh(dept_tspsc)

    # 4. EXAMINATIONS
    exams_data = [
        {
            "id": 1,
            "name": "SSC CGL (Combined Graduate Level)",
            "code": "SSC_CGL",
            "conducting_authority": "Staff Selection Commission",
            "category_id": cat_map["ssc"],
            "department_id": dept_ssc.id,
            "exam_level": "National",
            "state": "All India",
            "description": "Recruitment for Group B and Group C Gazetted and Non-Gazetted administrative posts in Ministries, Central Departments, and CAG.",
            "qualification_required": "Bachelor's Degree in any discipline from a recognized University",
            "min_age": 18,
            "max_age": 32,
            "vacancies": 17727,
            "salary_min": 44900.0,
            "salary_max": 142400.0,
            "pay_scale": "Level 4 to Level 8 (7th CPC)",
            "application_fee": 100.0,
            "exam_date": date.today() + timedelta(days=65),
            "selection_process": "Tier-1 Computer Based Exam -> Tier-2 CBE -> Document Verification",
            "exam_pattern": "Tier-1: 100 Qs (200 Marks) in 60 mins. Subjects: Reasoning (25), GA (25), Quant (25), English (25). Negative: -0.50.",
            "official_notification_url": "https://ssc.gov.in/notices/cgl-2026",
            "official_apply_url": "https://ssc.gov.in/apply",
            "verification_status": "verified"
        },
        {
            "id": 2,
            "name": "IBPS PO (Probationary Officers)",
            "code": "IBPS_PO",
            "conducting_authority": "Institute of Banking Personnel Selection",
            "category_id": cat_map["banking"],
            "department_id": dept_ibps.id,
            "exam_level": "National",
            "state": "All India",
            "description": "Recruitment of Probationary Officers and Management Trainees in 11 participating Public Sector Commercial Banks.",
            "qualification_required": "Graduation Degree in any discipline with computer literacy",
            "min_age": 20,
            "max_age": 30,
            "vacancies": 4455,
            "salary_min": 52000.0,
            "salary_max": 85000.0,
            "pay_scale": "Rs. 36,000 - 63,840 plus allowances",
            "application_fee": 850.0,
            "exam_date": date.today() + timedelta(days=90),
            "selection_process": "Prelims Exam -> Mains Exam + Descriptive -> Interview",
            "exam_pattern": "Prelims: English (30 Qs), Quantitative (35 Qs), Reasoning (35 Qs). Total 100 Qs in 60 mins. Sectional timing: 20 min each. Negative: -0.25.",
            "official_notification_url": "https://ibps.in/crp-po-mt-xvi",
            "official_apply_url": "https://ibps.in/apply-po",
            "verification_status": "verified"
        },
        {
            "id": 3,
            "name": "UPSC Civil Services Examination (CSE)",
            "code": "UPSC_CSE",
            "conducting_authority": "Union Public Service Commission",
            "category_id": cat_map["upsc"],
            "department_id": dept_upsc.id,
            "exam_level": "National",
            "state": "All India",
            "description": "India's premier administrative examination for IAS, IPS, IFS, IRS and Group A Central Services.",
            "qualification_required": "Graduate Degree in any discipline",
            "min_age": 21,
            "max_age": 32,
            "vacancies": 1056,
            "salary_min": 56100.0,
            "salary_max": 250000.0,
            "pay_scale": "Junior Scale to Cabinet Secretary Grade (7th CPC)",
            "application_fee": 100.0,
            "exam_date": date.today() + timedelta(days=120),
            "selection_process": "Prelims (GS Paper I + CSAT) -> Mains Written (9 Papers) -> Personality Test (Interview)",
            "exam_pattern": "Prelims GS-1: 100 Qs (200 marks, 2 hrs), CSAT GS-2: 80 Qs (200 marks, 2 hrs, qualifying 33%). Negative: -0.33.",
            "official_notification_url": "https://upsc.gov.in/examinations/civil-services",
            "official_apply_url": "https://upsconline.nic.in",
            "verification_status": "verified"
        },
        {
            "id": 4,
            "name": "Telangana Group I Services (TGPSC)",
            "code": "TGPSC_GRP1",
            "conducting_authority": "Telangana Public Service Commission",
            "category_id": cat_map["state-psc"],
            "department_id": dept_tspsc.id,
            "exam_level": "State",
            "state": "Telangana",
            "description": "Direct recruitment to State Administrative Services: Deputy Collector, DSP, Commercial Tax Officer, RDO.",
            "qualification_required": "Degree of a University in India recognized by UGC",
            "min_age": 18,
            "max_age": 44,
            "vacancies": 563,
            "salary_min": 54220.0,
            "salary_max": 133630.0,
            "pay_scale": "Telangana Revised Pay Scales",
            "application_fee": 200.0,
            "exam_date": date.today() + timedelta(days=80),
            "selection_process": "Preliminary Test (Objective) -> Mains Written Examination -> Final Selection",
            "exam_pattern": "Prelims: General Studies and Mental Ability (150 Qs, 150 marks, 150 mins).",
            "official_notification_url": "https://tspsc.gov.in/notifications/group1",
            "official_apply_url": "https://tspsc.gov.in/apply",
            "verification_status": "verified"
        },
        {
            "id": 5,
            "name": "RRB NTPC (Non-Technical Popular Categories)",
            "code": "RRB_NTPC",
            "conducting_authority": "Railway Recruitment Boards",
            "category_id": cat_map["railways"],
            "department_id": None,
            "exam_level": "National",
            "state": "All India",
            "description": "Station Master, Goods Guard, Senior Clerk cum Typist, Traffic Assistant across Indian Railways.",
            "qualification_required": "Graduation for Level 4-6, 12th (+2) for Level 2-3",
            "min_age": 18,
            "max_age": 36,
            "vacancies": 11558,
            "salary_min": 35400.0,
            "salary_max": 65000.0,
            "pay_scale": "7th CPC Pay Matrix Levels 2 to 6",
            "application_fee": 500.0,
            "exam_date": date.today() + timedelta(days=105),
            "selection_process": "1st Stage CBT -> 2nd Stage CBT -> CBAT/Typing Skill Test -> Document Verification",
            "exam_pattern": "CBT-1: 100 Qs (GA 40, Mathematics 30, Reasoning 30) in 90 mins. Negative: -0.33.",
            "official_notification_url": "https://indianrailways.gov.in/rrb_ntpc",
            "official_apply_url": "https://rrbapply.gov.in",
            "verification_status": "verified"
        },
        {
            "id": 6,
            "name": "GATE Computer Science & Information Technology",
            "code": "GATE_CS",
            "conducting_authority": "IIT / IISc Organising Institute",
            "category_id": cat_map["engineering"],
            "department_id": None,
            "exam_level": "National",
            "state": "All India",
            "description": "Gateway to PSU recruitments (IOCL, NTPC, ONGC, BARC, ISRO) and Master's admissions (M.Tech/PhD) at IITs/IISc.",
            "qualification_required": "B.E. / B.Tech / MCA / M.Sc in relevant branches",
            "min_age": 20,
            "max_age": 40,
            "vacancies": 3500,
            "salary_min": 60000.0,
            "salary_max": 180000.0,
            "pay_scale": "PSU E2/E3 Grade (Basic Rs. 60,000 - 1,80,000)",
            "application_fee": 1800.0,
            "exam_date": date.today() + timedelta(days=75),
            "selection_process": "Computer Based Test (65 Qs, 100 Marks) -> Direct PSU Shortlisting & COAP",
            "exam_pattern": "65 Qs (General Aptitude 15 marks, CS Subjects & Engineering Maths 85 marks). 1-mark & 2-mark MCQs/NATs.",
            "official_notification_url": "https://gate2026.iitr.ac.in",
            "official_apply_url": "https://goaps.iitr.ac.in",
            "verification_status": "verified"
        }
    ]

    exam_obj_map = {}
    for ex_data in exams_data:
        ex = db.query(Examination).filter(Examination.code == ex_data["code"]).first()
        if not ex:
            ex = Examination(**ex_data)
            db.add(ex)
            db.commit()
            db.refresh(ex)
        exam_obj_map[ex.code] = ex

    # 5. DETAILED HIERARCHICAL SYLLABUS FOR SSC CGL
    ssc_exam = exam_obj_map["SSC_CGL"]
    ssc_syl = db.query(ExamSyllabus).filter(ExamSyllabus.exam_id == ssc_exam.id).first()
    if not ssc_syl:
        ssc_syl = ExamSyllabus(
            exam_id=ssc_exam.id,
            title="Official SSC CGL Tier-1 & Tier-2 Comprehensive Syllabus",
            version="2026.1",
            source_url="https://ssc.gov.in/notices/cgl_syllabus_official.pdf",
            verified_by="Staff Selection Commission Commission Rules"
        )
        db.add(ssc_syl)
        db.commit()
        db.refresh(ssc_syl)

        # Subjects
        quant_sub = SyllabusSubject(
            syllabus_id=ssc_syl.id,
            name="Quantitative Aptitude",
            code="QUANT",
            weightage_percent=25.0,
            description="Arithmetic, Elementary Algebra, Geometry, Mensuration, Trigonometry, and Statistical Data Analysis."
        )
        reason_sub = SyllabusSubject(
            syllabus_id=ssc_syl.id,
            name="General Intelligence & Reasoning",
            code="REASON",
            weightage_percent=25.0,
            description="Verbal and non-verbal reasoning, analogies, syllogism, coding-decoding, blood relations, and puzzles."
        )
        eng_sub = SyllabusSubject(
            syllabus_id=ssc_syl.id,
            name="English Comprehension",
            code="ENG",
            weightage_percent=25.0,
            description="Grammar rules, vocabulary, reading comprehension, error spotting, idioms, and cloze tests."
        )
        ga_sub = SyllabusSubject(
            syllabus_id=ssc_syl.id,
            name="General Awareness",
            code="GA",
            weightage_percent=25.0,
            description="Indian Polity, Modern History, Geography, Economics, General Science, and Current Affairs."
        )
        db.add_all([quant_sub, reason_sub, eng_sub, ga_sub])
        db.commit()

        # Detailed Topics for Quantitative Aptitude
        quant_topics = [
            {
                "name": "Number System & Divisibility",
                "unit_name": "Arithmetic Unit I",
                "difficulty_level": "easy",
                "recommended_hours": 3.5,
                "study_notes": (
                    "### Number System Fundamentals\n"
                    "- **Classification:** Natural ($1,2,...$), Whole ($0,1,...$), Integers ($\\mathbb{Z}$), Rational ($\\frac{p}{q}$), Irrational ($\\sqrt{2}, \\pi$).\n"
                    "- **Divisibility Rules:**\n"
                    "  - Divisible by 3: Sum of digits divisible by 3.\n"
                    "  - Divisible by 8: Last 3 digits divisible by 8.\n"
                    "  - Divisible by 11: Difference between sum of odd-place digits and even-place digits is 0 or multiple of 11.\n"
                    "- **Unit Digit Concept:** Cyclicity of powers: 2, 3, 7, 8 have cyclicity 4; 4, 9 have cyclicity 2; 0, 1, 5, 6 remain unchanged."
                ),
                "formulas_summary": (
                    "1. $a^n - b^n$ is always divisible by $(a - b)$.\n"
                    "2. $a^n + b^n$ is divisible by $(a + b)$ when $n$ is odd.\n"
                    "3. Number of factors of $N = p_1^a p_2^b p_3^c$ is $(a+1)(b+1)(c+1)$.\n"
                    "4. Sum of first $n$ natural numbers $= \\frac{n(n+1)}{2}$."
                )
            },
            {
                "name": "Percentage & Successive Discounts",
                "unit_name": "Commercial Arithmetic",
                "difficulty_level": "medium",
                "recommended_hours": 4.0,
                "study_notes": (
                    "### Percentage Conversion & Applications\n"
                    "- Fraction to % table: $\\frac{1}{6} = 16.66\\%$, $\\frac{1}{7} = 14.28\\%$, $\\frac{1}{8} = 12.5\\%$, $\\frac{1}{9} = 11.11\\%$, $\\frac{1}{11} = 9.09\\%$, $\\frac{1}{12} = 8.33\\%$.\n"
                    "- Price $\\times$ Consumption = Expenditure. If price increases by $x\\%$, consumption must decrease by $\\frac{x}{100 + x} \\times 100\\%$ for constant expenditure."
                ),
                "formulas_summary": (
                    "1. Net Change Formula: $x + y + \\frac{xy}{100}$\n"
                    "2. Two successive discounts of $d_1\\%$ and $d_2\\%$ give single equivalent discount: $d_1 + d_2 - \\frac{d_1 d_2}{100}$"
                )
            },
            {
                "name": "Profit, Loss & Marked Price",
                "unit_name": "Commercial Arithmetic",
                "difficulty_level": "medium",
                "recommended_hours": 3.5,
                "study_notes": (
                    "### Profit and Loss Rules\n"
                    "- Cost Price ($CP$), Selling Price ($SP$), Marked Price ($MP$).\n"
                    "- Profit $\\% = \\frac{SP - CP}{CP} \\times 100$.\n"
                    "- Discount $\\% = \\frac{MP - SP}{MP} \\times 100$.\n"
                    "- Relation between $CP$ and $MP$: $\\frac{MP}{CP} = \\frac{100 + P\\%}{100 - D\\%}$."
                ),
                "formulas_summary": (
                    "1. $SP = CP \\times \\frac{100 \\pm \\text{Gain/Loss}\\%}{100}$\n"
                    "2. $\\frac{MP}{CP} = \\frac{100 + \\text{Profit}\\%}{100 - \\text{Discount}\\%}$\n"
                    "3. False Weights: Gain $\\% = \\frac{\\text{Error}}{\\text{True Value} - \\text{Error}} \\times 100$"
                )
            },
            {
                "name": "Time and Work & Efficiency",
                "unit_name": "Arithmetic Unit II",
                "difficulty_level": "medium",
                "recommended_hours": 4.0,
                "study_notes": (
                    "### LCM Method for Work Problems\n"
                    "- Total Work = $\\text{LCM of days taken by individuals}$.\n"
                    "- Efficiency = $\\frac{\\text{Total Work}}{\\text{Days taken}}$.\n"
                    "- Wage Distribution is directly proportional to work done or efficiency ratio when time is equal."
                ),
                "formulas_summary": (
                    "1. Combined Time: $\\frac{ab}{a + b}$ days.\n"
                    "2. $M_1 D_1 H_1 W_2 = M_2 D_2 H_2 W_1$\n"
                    "3. Pipe & Cistern: Inlet is positive rate, drain is negative rate."
                )
            },
            {
                "name": "Time, Speed & Distance (Trains & Boats)",
                "unit_name": "Arithmetic Unit II",
                "difficulty_level": "hard",
                "recommended_hours": 4.5,
                "study_notes": (
                    "### Relative Speed Principles\n"
                    "- Speed conversion: $1\\text{ km/h} = \\frac{5}{18}\\text{ m/s}$; $1\\text{ m/s} = \\frac{18}{5}\\text{ km/h}$.\n"
                    "- Relative speed: Same direction $= S_1 - S_2$; Opposite direction $= S_1 + S_2$.\n"
                    "- Boats & Streams: Downstream speed $D = u + v$; Upstream speed $U = u - v$."
                ),
                "formulas_summary": (
                    "1. Average Speed for equal distances: $\\frac{2 S_1 S_2}{S_1 + S_2}$\n"
                    "2. Boat Speed in still water: $u = \\frac{D + U}{2}$\n"
                    "3. Stream Speed: $v = \\frac{D - U}{2}$"
                )
            }
        ]

        for q_top in quant_topics:
            top_obj = SyllabusTopic(
                subject_id=quant_sub.id,
                name=q_top["name"],
                unit_name=q_top["unit_name"],
                difficulty_level=q_top["difficulty_level"],
                recommended_hours=q_top["recommended_hours"],
                study_notes=q_top["study_notes"],
                formulas_summary=q_top["formulas_summary"]
            )
            db.add(top_obj)
        db.commit()

        # Detailed Topics for Reasoning
        reason_topics = [
            ("Analogy & Classification", "Logical Verbal", "easy", 2.5),
            ("Coding-Decoding & Ciphering", "Logical Verbal", "medium", 3.0),
            ("Syllogisms & Venn Diagrams", "Analytical Reasoning", "medium", 3.5),
            ("Blood Relations & Family Tree", "Analytical Reasoning", "medium", 3.0),
            ("Direction & Distance Sense", "Non-Verbal & Spatial", "easy", 2.0),
            ("Seating Arrangement & Linear Puzzles", "Analytical Reasoning", "hard", 4.5)
        ]
        for r_name, r_unit, r_diff, r_hrs in reason_topics:
            t = SyllabusTopic(
                subject_id=reason_sub.id,
                name=r_name,
                unit_name=r_unit,
                difficulty_level=r_diff,
                recommended_hours=r_hrs,
                study_notes=f"Comprehensive concepts and exam tricks for {r_name} in SSC & Banking recruitment exams.",
                formulas_summary="Core logic templates and 3-step verification methodology."
            )
            db.add(t)
        db.commit()

        # Detailed Topics for English
        eng_topics = [
            ("Reading Comprehension Strategies", "Verbal Aptitude", "medium", 3.5),
            ("Spotting Errors & Subject-Verb Agreement", "Grammar Masterclass", "medium", 3.0),
            ("Direct & Indirect Speech Rules", "Grammar Masterclass", "medium", 2.5),
            ("Active and Passive Voice", "Grammar Masterclass", "easy", 2.5),
            ("High-Frequency Idioms & Phrases", "Vocabulary", "easy", 3.0),
            ("Cloze Test & Sentence Improvement", "Verbal Aptitude", "hard", 4.0)
        ]
        for e_name, e_unit, e_diff, e_hrs in eng_topics:
            t = SyllabusTopic(
                subject_id=eng_sub.id,
                name=e_name,
                unit_name=e_unit,
                difficulty_level=e_diff,
                recommended_hours=e_hrs,
                study_notes=f"Rules, exceptions, and previous 10-year patterns for {e_name}.",
                formulas_summary="Grammar checklist and vocabulary roots."
            )
            db.add(t)
        db.commit()

        # Detailed Topics for General Awareness
        ga_topics = [
            ("Indian Constitution & Fundamental Rights", "Indian Polity", "medium", 3.5),
            ("Modern Indian Freedom Struggle (1857-1947)", "History", "medium", 3.5),
            ("Physical Geography & Indian River Systems", "Geography", "medium", 3.0),
            ("National Income, Inflation & Monetary Policy", "Economics", "hard", 3.5),
            ("General Science: Physics, Chemistry & Biology Basics", "Science", "easy", 4.0),
            ("Current Affairs & National Awards (Annual)", "Current GK", "medium", 3.0)
        ]
        for g_name, g_unit, g_diff, g_hrs in ga_topics:
            t = SyllabusTopic(
                subject_id=ga_sub.id,
                name=g_name,
                unit_name=g_unit,
                difficulty_level=g_diff,
                recommended_hours=g_hrs,
                study_notes=f"High-yield static notes and verified facts for {g_name}.",
                formulas_summary="Quick mnemonic tables and chronological timelines."
            )
            db.add(t)
        db.commit()

    # 6. PREVIOUS YEAR PAPERS & SAMPLE PAPERS
    years = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015]
    for yr in years:
        p_exist = db.query(QuestionPaper).filter(
            QuestionPaper.exam_id == ssc_exam.id,
            QuestionPaper.year == yr
        ).first()
        if not p_exist:
            is_recent = yr >= 2020
            qp = QuestionPaper(
                exam_id=ssc_exam.id,
                paper_title=f"SSC CGL Tier-1 Official Paper {yr} (Shift 1)",
                year=yr,
                stage_tier="Tier-1",
                shift="Shift 1 (09:00 AM - 10:00 AM)",
                paper_type="official_pyq" if is_recent else "sample_paper",
                duration_minutes=60,
                total_marks=200.0,
                total_questions=100,
                negative_mark_ratio=0.50,
                pdf_file_url=f"/docs/papers/SSC_CGL_{yr}_Tier1_Shift1.pdf",
                answer_key_file_url=f"/docs/keys/SSC_CGL_{yr}_Tier1_Key.pdf",
                official_source_url=f"https://ssc.gov.in/past-papers/cgl-{yr}",
                verification_status="verified",
                has_official_key=True
            )
            db.add(qp)
            db.commit()
            db.refresh(qp)

            ak = AnswerKey(
                question_paper_id=qp.id,
                key_type="official",
                source_url=f"https://ssc.gov.in/answer-keys/cgl-{yr}",
                is_verified=True,
                verified_by="Staff Selection Commission Official Key"
            )
            db.add(ak)
            db.commit()

    # Add PYQs for other exams
    for code, ex_item in exam_obj_map.items():
        if code == "SSC_CGL":
            continue
        p_exist = db.query(QuestionPaper).filter(QuestionPaper.exam_id == ex_item.id).first()
        if not p_exist:
            qp = QuestionPaper(
                exam_id=ex_item.id,
                paper_title=f"{ex_item.name} Official Prelims Paper 2024",
                year=2024,
                stage_tier="Prelims",
                shift="Morning Shift",
                paper_type="official_pyq",
                duration_minutes=120 if "UPSC" in code else 60,
                total_marks=200.0,
                total_questions=100,
                negative_mark_ratio=0.33 if "UPSC" in code else 0.25,
                pdf_file_url=f"/docs/papers/{code}_2024_Paper.pdf",
                answer_key_file_url=f"/docs/keys/{code}_2024_Key.pdf",
                official_source_url=ex_item.official_notification_url,
                verification_status="verified",
                has_official_key=True
            )
            db.add(qp)
            db.commit()

    # 7. QUESTION BANK WITH OPTIONS & EXPLANATIONS
    # Get a sample question paper
    target_qp = db.query(QuestionPaper).filter(QuestionPaper.exam_id == ssc_exam.id, QuestionPaper.year == 2024).first()
    quant_first_topic = db.query(SyllabusTopic).filter(SyllabusTopic.name.like("%Number%")).first()
    pct_topic = db.query(SyllabusTopic).filter(SyllabusTopic.name.like("%Percentage%")).first()
    pl_topic = db.query(SyllabusTopic).filter(SyllabusTopic.name.like("%Profit%")).first()
    tw_topic = db.query(SyllabusTopic).filter(SyllabusTopic.name.like("%Time and Work%")).first()
    polity_topic = db.query(SyllabusTopic).filter(SyllabusTopic.name.like("%Constitution%")).first()

    questions_seed = [
        {
            "question_text": "What is the remainder when $7^{84}$ is divided by $342$?",
            "topic_id": quant_first_topic.id if quant_first_topic else None,
            "difficulty": "medium",
            "marks": 2.0,
            "negative_marks": 0.50,
            "is_pyq": True,
            "pyq_year": 2024,
            "source_label": "SSC CGL 2024 Tier-1 Verified",
            "options": [
                ("A", "1", True),
                ("B", "7", False),
                ("C", "341", False),
                ("D", "49", False)
            ],
            "solution": "Notice that $7^3 = 343$. We can express $7^{84} = (7^3)^{28} = 343^{28}$. When $343$ is divided by $342$, remainder is $+1$. Therefore, $1^{28} = 1$.",
            "shortcut": "Write in terms of $(342 + 1)^k$. Remainder is always $1^k = 1$."
        },
        {
            "question_text": "A shopkeeper marks his goods 40% above the cost price and allows a discount of 25% on the marked price. What is his net profit or loss percentage?",
            "topic_id": pl_topic.id if pl_topic else None,
            "difficulty": "easy",
            "marks": 2.0,
            "negative_marks": 0.50,
            "is_pyq": True,
            "pyq_year": 2023,
            "source_label": "SSC CGL 2023 Tier-1 Verified",
            "options": [
                ("A", "5% Profit", True),
                ("B", "15% Profit", False),
                ("C", "5% Loss", False),
                ("D", "10% Profit", False)
            ],
            "solution": "Let CP = 100. Then MP = 140. Discount of 25% on 140 = 35. Therefore SP = 140 - 35 = 105. Profit = 105 - 100 = 5%.",
            "shortcut": "Effective % formula: +40 - 25 - (40*25/100) = +15 - 10 = +5% (Profit)."
        },
        {
            "question_text": "A can complete a piece of work in 12 days and B can complete it in 18 days. They worked together for 4 days, after which A left. How many days will B take alone to finish the remaining work?",
            "topic_id": tw_topic.id if tw_topic else None,
            "difficulty": "medium",
            "marks": 2.0,
            "negative_marks": 0.50,
            "is_pyq": True,
            "pyq_year": 2024,
            "source_label": "SSC CGL 2024 Tier-1 Official",
            "options": [
                ("A", "8 days", True),
                ("B", "6 days", False),
                ("C", "10 days", False),
                ("D", "12 days", False)
            ],
            "solution": "LCM(12, 18) = 36 units (Total Work). Efficiency of A = 36/12 = 3 units/day. Efficiency of B = 36/18 = 2 units/day. In 4 days, (A + B) do 4 * (3 + 2) = 20 units. Remaining work = 36 - 20 = 16 units. Days for B = 16 / 2 = 8 days.",
            "shortcut": "LCM Work Method: $36 - 4(5) = 16$ units remaining. B's rate = 2. Days = $16 / 2 = 8$."
        },
        {
            "question_text": "Under which Article of the Indian Constitution is the 'Right to Constitutional Remedies' guaranteed?",
            "topic_id": polity_topic.id if polity_topic else None,
            "difficulty": "easy",
            "marks": 2.0,
            "negative_marks": 0.50,
            "is_pyq": True,
            "pyq_year": 2024,
            "source_label": "SSC & UPSC Verified Question",
            "options": [
                ("A", "Article 32", True),
                ("B", "Article 21", False),
                ("C", "Article 19", False),
                ("D", "Article 14", False)
            ],
            "solution": "Article 32 grants the right to move the Supreme Court by appropriate proceedings for the enforcement of Fundamental Rights. Dr. B.R. Ambedkar called Article 32 the 'Heart and Soul' of the Constitution.",
            "shortcut": "Article 32: Supreme Court writs; Article 226: High Court writs."
        },
        {
            "question_text": "If the price of petrol increases by 25%, by what percentage must a car owner reduce his consumption so that expenditure on petrol remains unchanged?",
            "topic_id": pct_topic.id if pct_topic else None,
            "difficulty": "easy",
            "marks": 2.0,
            "negative_marks": 0.50,
            "is_pyq": True,
            "pyq_year": 2022,
            "source_label": "SSC CGL Past Question",
            "options": [
                ("A", "20%", True),
                ("B", "25%", False),
                ("C", "16.67%", False),
                ("D", "15%", False)
            ],
            "solution": "Required reduction = [r / (100 + r)] * 100% = [25 / 125] * 100% = (1/5) * 100% = 20%.",
            "shortcut": "Fraction ladder: Increase by 1/4 means reduction must be 1/(4+1) = 1/5 = 20%."
        },
        {
            "question_text": "Two trains running in opposite directions on parallel tracks at 54 km/h and 72 km/h cross each other in 10 seconds. If the length of the first train is 150 m, what is the length of the second train?",
            "topic_id": None,
            "difficulty": "hard",
            "marks": 2.0,
            "negative_marks": 0.50,
            "is_pyq": True,
            "pyq_year": 2024,
            "source_label": "SSC CGL 2024 Shift 2",
            "options": [
                ("A", "200 m", True),
                ("B", "180 m", False),
                ("C", "220 m", False),
                ("D", "250 m", False)
            ],
            "solution": "Relative speed = 54 + 72 = 126 km/h = 126 * (5/18) = 35 m/s. Total distance in 10 sec = 35 * 10 = 350 m. Since distance = L1 + L2: 150 + L2 = 350 => L2 = 200 m.",
            "shortcut": "Opposite direction: Relative Speed = 126 * (5/18) = 35 m/s. Total dist = 350 m. L2 = 350 - 150 = 200 m."
        },
        {
            "question_text": "Select the related letter-cluster from the given alternatives: BCD : GHI :: JKL : ?",
            "topic_id": None,
            "difficulty": "easy",
            "marks": 2.0,
            "negative_marks": 0.50,
            "is_pyq": True,
            "pyq_year": 2023,
            "source_label": "Reasoning Verified Question",
            "options": [
                ("A", "OPQ", True),
                ("B", "MNO", False),
                ("C", "PQR", False),
                ("D", "NOP", False)
            ],
            "solution": "Pattern: B (+5) = G, C (+5) = H, D (+5) = I. Applying +5 to JKL: J(10)+5 = O(15), K(11)+5 = P(16), L(12)+5 = Q(17) => OPQ.",
            "shortcut": "Each letter is shifted forward by 5 positions in the English alphabet."
        },
        {
            "question_text": "In the following sentence, find the part with an error: 'Neither the teacher (A) / nor the students (B) / was present in the auditorium (C) / No error (D)'",
            "topic_id": None,
            "difficulty": "medium",
            "marks": 2.0,
            "negative_marks": 0.50,
            "is_pyq": True,
            "pyq_year": 2024,
            "source_label": "English Verified Question",
            "options": [
                ("A", "Part C ('was present')", True),
                ("B", "Part A ('Neither the teacher')", False),
                ("C", "Part B ('nor the students')", False),
                ("D", "Part D (No error)", False)
            ],
            "solution": "Rule of Proximity: When two subjects are connected by 'Neither... nor', the verb agrees with the subject closer to it. 'The students' is plural, so the verb must be plural 'were present', not 'was present'.",
            "shortcut": "Proximity rule: Nearest subject 'students' is plural -> use 'were'."
        }
    ]

    for q_data in questions_seed:
        q_exist = db.query(Question).filter(Question.question_text == q_data["question_text"]).first()
        if not q_exist:
            q = Question(
                question_paper_id=target_qp.id if target_qp else None,
                topic_id=q_data["topic_id"],
                question_text=q_data["question_text"],
                question_type="mcq",
                difficulty=q_data["difficulty"],
                marks=q_data["marks"],
                negative_marks=q_data["negative_marks"],
                is_pyq=q_data["is_pyq"],
                pyq_year=q_data["pyq_year"],
                verification_status="verified",
                source_label=q_data["source_label"]
            )
            db.add(q)
            db.commit()
            db.refresh(q)

            for key, txt, is_corr in q_data["options"]:
                opt = QuestionOption(
                    question_id=q.id,
                    option_key=key,
                    option_text=txt,
                    is_correct=is_corr
                )
                db.add(opt)

            exp = QuestionExplanation(
                question_id=q.id,
                detailed_solution=q_data["solution"],
                shortcut_technique=q_data["shortcut"],
                verified_by="Commission Expert Key Reviewer"
            )
            db.add(exp)
            db.commit()

    # 8. PRIVATE JOBS DATABASE
    private_jobs_data = [
        {
            "company_name": "CloudScale Systems",
            "job_title": "Full Stack Software Engineer (React / Python)",
            "job_description": "Building high-throughput microservices, real-time data pipelines, and responsive Next.js web applications for global enterprise clients.",
            "required_skills": "Python, FastAPI, TypeScript, React, PostgreSQL, Docker, Tailwind CSS",
            "qualification": "B.Tech / B.E. in CS / IT / Electrical or MCA",
            "min_experience_years": 0,
            "max_experience_years": 2,
            "salary_min": 650000.0,
            "salary_max": 1400000.0,
            "location": "Bangalore / Hyderabad / Hybrid",
            "work_mode": "hybrid",
            "deadline": date.today() + timedelta(days=25),
            "category": "IT and software development",
            "vacancies": 8
        },
        {
            "company_name": "Bharat FinTech Innovations",
            "job_title": "Data Analyst & Business Intelligence Specialist",
            "job_description": "Perform statistical data modeling, SQL queries on large transactions, build executive dashboards in PowerBI/Tableau, and identify business growth vectors.",
            "required_skills": "SQL, Python, Excel, PowerBI, Tableau, Quantitative Aptitude, Statistics",
            "qualification": "Bachelor's Degree in Engineering, Math, Economics, or Statistics",
            "min_experience_years": 0,
            "max_experience_years": 3,
            "salary_min": 550000.0,
            "salary_max": 1100000.0,
            "location": "Mumbai / Pune / Hybrid",
            "work_mode": "hybrid",
            "deadline": date.today() + timedelta(days=20),
            "category": "Data analytics",
            "vacancies": 5
        },
        {
            "company_name": "NexaAI Research Labs",
            "job_title": "Associate AI & Machine Learning Engineer",
            "job_description": "Fine-tuning transformer models, implementing Retrieval-Augmented Generation (RAG) vector pipelines, and optimizing NLP model serving latency.",
            "required_skills": "Python, PyTorch, LangChain, Transformers, Vector DBs, REST APIs",
            "qualification": "B.Tech / M.Tech in CS / AI or relevant experience",
            "min_experience_years": 1,
            "max_experience_years": 4,
            "salary_min": 900000.0,
            "salary_max": 1900000.0,
            "location": "Remote / Hyderabad",
            "work_mode": "remote",
            "deadline": date.today() + timedelta(days=35),
            "category": "AI and machine learning",
            "vacancies": 4
        },
        {
            "company_name": "Tata Infotech Global",
            "job_title": "Graduate Engineering Trainee (GET)",
            "job_description": "Campus recruitment for software development, cloud infrastructure operations, client solutions, and enterprise engineering.",
            "required_skills": "Java, Python, C++, Data Structures, Aptitude, Communication",
            "qualification": "B.Tech 2025/2026 Batch in any engineering branch",
            "min_experience_years": 0,
            "max_experience_years": 1,
            "salary_min": 450000.0,
            "salary_max": 750000.0,
            "location": "Chennai / Bangalore / Pune",
            "work_mode": "on_site",
            "deadline": date.today() + timedelta(days=40),
            "category": "Freshers",
            "vacancies": 25
        },
        {
            "company_name": "Quantum Dynamics",
            "job_title": "DevOps & Cloud Reliability Engineer",
            "job_description": "Managing AWS and Kubernetes infrastructure, CI/CD pipelines, Terraform automation, and 99.99% system availability.",
            "required_skills": "AWS, Linux, Docker, Kubernetes, Terraform, GitHub Actions, Python",
            "qualification": "B.Tech / BCA / MCA",
            "min_experience_years": 1,
            "max_experience_years": 3,
            "salary_min": 700000.0,
            "salary_max": 1500000.0,
            "location": "Bangalore / Remote",
            "work_mode": "remote",
            "deadline": date.today() + timedelta(days=30),
            "category": "Engineering",
            "vacancies": 3
        }
    ]

    for pj_data in private_jobs_data:
        j_exist = db.query(PrivateJob).filter(PrivateJob.job_title == pj_data["job_title"]).first()
        if not j_exist:
            job = PrivateJob(
                recruiter_id=recruiter_user.id,
                **pj_data
            )
            db.add(job)
            db.commit()

    # 9. STUDY PLAN & SCHEDULE FOR STUDENT
    from app.services.timetable_service import timetable_service
    timetable_service.generate_timetable(
        db=db,
        user_id=student_user.id,
        exam_id=ssc_exam.id,
        target_exam_date=date.today() + timedelta(days=65),
        daily_hours=4.5
    )

    # 10. PRE-COMPLETED TEST SESSION FOR DEMO ANALYTICS
    test_exist = db.query(TestSession).filter(TestSession.user_id == student_user.id).first()
    if not test_exist:
        ts = TestSession(
            user_id=student_user.id,
            test_type="grand_test",
            exam_id=ssc_exam.id,
            title="Weekly Grand Test #1 - Tier-1 Full Simulation",
            start_time=datetime.utcnow() - timedelta(days=2),
            end_time=datetime.utcnow() - timedelta(days=2, minutes=-55),
            duration_seconds=3600,
            status="completed",
            total_score=152.0,
            max_score=200.0,
            accuracy_rate=84.2,
            total_questions=100,
            answered_count=92,
            correct_count=78,
            incorrect_count=14,
            unanswered_count=8,
            time_spent_seconds=3300
        )
        db.add(ts)
        db.commit()
        db.refresh(ts)

        tr = TestResult(
            test_session_id=ts.id,
            user_id=student_user.id,
            percentile_estimate=92.4,
            rank_estimate=114,
            subject_breakdown=json.dumps({
                "Quantitative Aptitude": {"score": 42.5, "accuracy": 88.0, "total": 25},
                "Reasoning Ability": {"score": 45.0, "accuracy": 92.0, "total": 25},
                "English Comprehension": {"score": 38.0, "accuracy": 82.0, "total": 25},
                "General Awareness": {"score": 26.5, "accuracy": 74.0, "total": 25}
            }),
            weak_topics=json.dumps(["Indian Polity - Writs & Articles", "Compound Interest Advanced", "Error Detection - Subject Verb Agreement"]),
            strong_topics=json.dumps(["Number System", "Coding-Decoding", "Percentages & Profit-Loss", "Reading Comprehension"]),
            time_management_score=86.5,
            revision_recommendations="Review Indian Polity Fundamental Rights and practice 20 advanced CI problems before next grand test."
        )
        db.add(tr)
        db.commit()

    # 11. NOTIFICATIONS
    notif_data = [
        {"title": "SSC CGL 2026 Tier-1 Application Window Open", "message": "Last date to apply is approaching in 14 days. Ensure your registration is verified.", "type": "exam", "url": "/exams/1"},
        {"title": "Weekly Grand Test #2 Scheduled", "message": "Your Sunday Grand Test opens at 09:00 AM. 100 questions covering all completed topics.", "type": "grand_test", "url": "/grand-tests"},
        {"title": "Study Streak Reached: 7 Days!", "message": "Outstanding discipline! You have completed 46.5 hours of targeted study this month.", "type": "study_reminder", "url": "/study-planner"},
        {"title": "Interview Invitation: CloudScale Systems", "message": "Your profile matched 88% for the Full Stack Engineer role. Check status in My Applications.", "type": "application", "url": "/saved-jobs"}
    ]
    for nd in notif_data:
        n_exist = db.query(Notification).filter(Notification.title == nd["title"]).first()
        if not n_exist:
            n = Notification(
                user_id=student_user.id,
                title=nd["title"],
                message=nd["message"],
                notification_type=nd["type"],
                link_url=nd["url"]
            )
            db.add(n)
    db.commit()

    print("✅ Seed pipeline finished successfully! Database is completely populated with realistic data.")
