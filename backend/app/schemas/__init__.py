from app.schemas.user import (
    UserBase, UserCreate, UserLogin, UserUpdate, UserResponse, Token,
    StudentProfileBase, StudentProfileCreate, StudentProfileUpdate,
    RecruiterProfileBase, RecruiterProfileCreate, BookmarkCreate, BookmarkResponse, NotificationResponse
)
from app.schemas.exam import (
    ExamCategoryResponse, DepartmentResponse, RecruitmentNotificationResponse,
    ExaminationBase, ExaminationCreate, ExaminationUpdate, ExaminationResponse
)
from app.schemas.syllabus import (
    SyllabusTopicBase, SyllabusTopicResponse, SyllabusSubjectBase, SyllabusSubjectResponse,
    ExamSyllabusResponse, TopicProgressUpdate
)
from app.schemas.question import (
    QuestionOptionResponse, QuestionExplanationResponse, QuestionResponse, QuestionPaperResponse
)
from app.schemas.test import (
    StartTestRequest, SubmitAnswerRequest, SubmitTestRequest, TestAnswerResponse,
    TestResultResponse, TestSessionResponse
)
from app.schemas.planner import (
    StudySessionBase, StudySessionResponse, StudyPlanCreate, StudyPlanResponse,
    RevisionTaskResponse, TimetableRescheduleRequest
)
from app.schemas.job import (
    PrivateJobBase, PrivateJobCreate, PrivateJobResponse, JobApplicationCreate, JobApplicationResponse
)
from app.schemas.ai import (
    AIChatMessage, AIChatRequest, AIChatResponse, AIQuestionGenRequest, AIRevisionNotesRequest
)
