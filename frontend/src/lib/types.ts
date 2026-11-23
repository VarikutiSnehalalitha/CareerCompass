export type ThemeMode = 'light' | 'dark';
export type ThemeName = 'nature' | 'galaxy';
export type BgIntensity = 'subtle' | 'balanced' | 'immersive';
export type UserRole = 'student' | 'recruiter' | 'admin';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  theme_mode?: ThemeMode;
  theme_name?: ThemeName;
  bg_style?: string;
  bg_intensity?: BgIntensity;
  created_at?: string;
}

export interface StudentProfile {
  qualification?: string;
  state?: string;
  preferred_location?: string;
  target_score?: number;
  daily_study_hours?: number;
  preferred_study_time?: string;
  preparation_level?: string;
  rest_days?: string;
  streak_days?: number;
  total_study_hours?: number;
  readiness_score?: number;
  resume_url?: string;
  skills?: string;
}

export interface ExamCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  is_active: boolean;
  display_order: number;
}

export interface Examination {
  id: number;
  name: string;
  code: string;
  conducting_authority: string;
  category_id?: number;
  department_id?: number;
  exam_level: string;
  state: string;
  description?: string;
  qualification_required?: string;
  min_age: number;
  max_age: number;
  vacancies: number;
  salary_min: number;
  salary_max: number;
  pay_scale?: string;
  application_fee: number;
  exam_date?: string;
  selection_process?: string;
  exam_pattern?: string;
  official_notification_url?: string;
  official_apply_url?: string;
  verification_status: string;
}

export interface SyllabusTopic {
  id: number;
  subject_id: number;
  parent_topic_id?: number;
  name: string;
  unit_name?: string;
  difficulty_level: string;
  recommended_hours: number;
  description?: string;
  study_notes?: string;
  formulas_summary?: string;
  user_status?: 'not_started' | 'in_progress' | 'completed' | 'needs_revision';
  user_mastery?: number;
}

export interface SyllabusSubject {
  id: number;
  syllabus_id: number;
  name: string;
  code?: string;
  weightage_percent: number;
  description?: string;
  topics: SyllabusTopic[];
}

export interface ExamSyllabus {
  id: number;
  exam_id: number;
  title: string;
  version: string;
  source_url?: string;
  verified_by?: string;
  subjects: SyllabusSubject[];
}

export interface QuestionPaper {
  id: number;
  exam_id: number;
  paper_title: string;
  year: number;
  stage_tier: string;
  shift: string;
  paper_type: string;
  duration_minutes: number;
  total_marks: number;
  total_questions: number;
  negative_mark_ratio: number;
  pdf_file_url?: string;
  answer_key_file_url?: string;
  official_source_url?: string;
  verification_status: string;
  has_official_key: boolean;
}

export interface QuestionOption {
  id: number;
  option_key: string;
  option_text: string;
  is_correct?: boolean;
}

export interface QuestionExplanation {
  detailed_solution: string;
  shortcut_technique?: string;
  formula_used?: string;
}

export interface Question {
  id: number;
  question_paper_id?: number;
  topic_id?: number;
  question_text: string;
  question_type: string;
  difficulty: string;
  marks: number;
  negative_marks: number;
  is_pyq: boolean;
  pyq_year?: number;
  verification_status: string;
  source_label?: string;
  options: QuestionOption[];
  explanation?: QuestionExplanation;
}

export interface TestSession {
  id: number;
  user_id: number;
  test_type: string;
  exam_id?: number;
  question_paper_id?: number;
  topic_id?: number;
  title: string;
  start_time: string;
  duration_seconds: number;
  status: string;
  total_score: number;
  max_score: number;
  accuracy_rate: number;
  total_questions: number;
  answered_count: number;
  correct_count: number;
  incorrect_count: number;
  unanswered_count: number;
  time_spent_seconds: number;
  answers: any[];
  result?: TestResult;
  questions?: Question[];
}

export interface TestResult {
  percentile_estimate: number;
  rank_estimate: number;
  subject_breakdown?: string;
  weak_topics?: string;
  strong_topics?: string;
  time_management_score: number;
  revision_recommendations?: string;
}

export interface StudySession {
  id: number;
  topic_id?: number;
  title: string;
  scheduled_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  status: string;
  notes?: string;
  is_revision: boolean;
}

export interface StudyPlan {
  id: number;
  user_id: number;
  exam_id: number;
  title: string;
  start_date: string;
  target_exam_date: string;
  daily_hours: number;
  current_level: string;
  target_score: number;
  sessions: StudySession[];
}

export interface PrivateJob {
  id: number;
  company_name: string;
  job_title: string;
  job_description: string;
  required_skills: string;
  qualification: string;
  min_experience_years: number;
  max_experience_years: number;
  salary_min: number;
  salary_max: number;
  location: string;
  work_mode: string;
  deadline?: string;
  category: string;
  vacancies: number;
}
