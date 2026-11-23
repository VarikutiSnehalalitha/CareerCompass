'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { 
  Flame, Clock, CheckCircle2, AlertCircle, ArrowRight, 
  Calendar, Award, BookOpen, Target, Sparkles, Bookmark, 
  TrendingUp, Play, Bell, ChevronRight 
} from 'lucide-react';

export default function StudentDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<any>('/dashboard/student')
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load dashboard:', err);
        setLoading(false);
      });
  }, []);

  const toggleSession = async (sessionId: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'scheduled' : 'completed';
    try {
      await fetchApi(`/planner/session/${sessionId}/status?status=${nextStatus}`, { method: 'POST' });
      setData((prev: any) => ({
        ...prev,
        today_schedule: prev.today_schedule.map((s: any) => s.id === sessionId ? { ...s, status: nextStatus } : s)
      }));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  const d = data || {
    student_name: 'Aarav Sharma',
    streak_days: 7,
    total_study_hours: 46.5,
    readiness_score: 76.5,
    syllabus_completion_pct: 42.0,
    average_accuracy: 84.2,
    today_schedule: [],
    target_examinations: [],
    recent_tests: [],
    weak_subjects: ['Indian Polity', 'Time and Work'],
    recommended_topics: [],
    weekly_grand_test_days_left: 3,
    saved_jobs_count: 4,
    notifications: []
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Student Dashboard</span>
            <span className="w-1.5 h-1.5 rounded-full bg-border" />
            <span className="text-xs text-foreground-muted">Academic Cycle 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Welcome back, {d.student_name}! 👋
          </h1>
          <p className="text-sm text-foreground-muted max-w-xl">
            You are on a <strong className="text-foreground">{d.streak_days}-day study streak</strong>. Today you have {d.today_schedule.length} scheduled study sessions lined up.
          </p>
        </div>

        {/* Prominent Continue Preparation Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <Link
            href="/study-mode"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-soft flex items-center justify-center gap-2 group transition-all"
          >
            <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
            Continue Preparation
          </Link>
          <Link
            href="/grand-tests"
            className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-border bg-surface-elevated hover:bg-surface text-foreground font-semibold text-xs flex items-center justify-center gap-1.5"
          >
            <Award className="w-4 h-4 text-primary" /> Weekly Grand Test ({d.weekly_grand_test_days_left}d)
          </Link>
        </div>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 rounded-2xl border border-border bg-surface shadow-sm space-y-1">
          <div className="flex items-center justify-between text-foreground-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Study Streak</span>
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground">{d.streak_days} <span className="text-xs font-semibold text-foreground-muted">Days</span></div>
          <p className="text-[11px] text-success font-semibold">Consistent daily progress 🔥</p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-surface shadow-sm space-y-1">
          <div className="flex items-center justify-between text-foreground-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Study Time</span>
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground">{d.total_study_hours} <span className="text-xs font-semibold text-foreground-muted">Hours</span></div>
          <p className="text-[11px] text-foreground-muted">Across 3 active goals</p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-surface shadow-sm space-y-1">
          <div className="flex items-center justify-between text-foreground-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Syllabus Covered</span>
            <BookOpen className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground">{d.syllabus_completion_pct}%</div>
          <div className="w-full bg-border/40 h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-primary h-full rounded-full" style={{ width: `${d.syllabus_completion_pct}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-surface shadow-sm space-y-1">
          <div className="flex items-center justify-between text-foreground-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Readiness Estimate</span>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground">{d.readiness_score}%</div>
          <p className="text-[11px] text-success font-semibold">Selection readiness high 🎯</p>
        </div>
      </div>

      {/* Main Grid: Today's Schedule & Target Examinations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Study Timetable */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">Today's Study Schedule</h2>
              <p className="text-xs text-foreground-muted">Intelligently deduplicated across your active exams.</p>
            </div>
            <Link href="/study-planner" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              Full Planner <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {d.today_schedule.map((session: any) => {
              const isDone = session.status === 'completed';
              return (
                <div
                  key={session.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    isDone 
                      ? 'bg-surface-elevated/50 border-border/60 opacity-80' 
                      : 'bg-surface border-border hover:shadow-soft'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <button
                      onClick={() => toggleSession(session.id, session.status)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                        isDone ? 'bg-success text-white border-success' : 'border-border hover:border-primary text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 fill-current" />
                    </button>
                    <div className="min-w-0">
                      <p className={`text-sm font-bold truncate ${isDone ? 'line-through text-foreground-muted' : 'text-foreground'}`}>
                        {session.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-foreground-muted mt-0.5">
                        <span className="font-semibold text-primary">{session.start_time} - {session.end_time}</span>
                        <span>•</span>
                        <span>{session.duration_minutes} mins</span>
                        {session.is_revision && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-[10px]">Revision</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/study-mode"
                    className="px-3.5 py-1.5 rounded-xl border border-border bg-surface-elevated hover:bg-surface text-xs font-bold text-primary shrink-0"
                  >
                    Start Session
                  </Link>
                </div>
              );
            })}
          </div>

          {/* AI Smart Preparation Recommendation Card */}
          <div className="p-5 rounded-2xl border border-primary/20 bg-primary-light/40 space-y-2.5">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              AI StudyMate Preparation Engine Diagnostic
            </div>
            <p className="text-xs text-foreground leading-relaxed">
              {d.readiness_recommendation || "Your consistency is solid across Quantitative Aptitude. Target Indian Polity articles and time-speed-distance drills this week."}
            </p>
          </div>
        </div>

        {/* Right 1 Col: Goals, Weak Topics, & Tests */}
        <div className="space-y-6">
          {/* Target Examinations */}
          <div className="p-5 rounded-2xl border border-border bg-surface shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">Target Examinations</h3>
              <Link href="/exams/setup" className="text-[11px] font-bold text-primary hover:underline">+ Add Goal</Link>
            </div>
            <div className="space-y-3">
              {d.target_examinations.slice(0, 3).map((ex: any) => (
                <div key={ex.id} className="p-3 rounded-xl bg-surface-elevated border border-border flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-foreground truncate max-w-[150px]">{ex.name}</h4>
                    <p className="text-[10px] text-foreground-muted">{ex.authority}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-primary">{ex.days_left}d</span>
                    <p className="text-[10px] text-foreground-muted">Remaining</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weak Topics Diagnostic */}
          <div className="p-5 rounded-2xl border border-border bg-surface shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">Weak Areas (Grand Test)</h3>
              <span className="text-[10px] text-danger font-bold uppercase">Needs Drill</span>
            </div>
            <div className="space-y-2">
              {d.weak_subjects.map((item: string, idx: number) => (
                <div key={idx} className="p-2.5 rounded-lg bg-danger/10 border border-danger/20 flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{item}</span>
                  <Link href={`/practice-tests?search=${encodeURIComponent(item)}`} className="text-[11px] font-bold text-danger hover:underline">
                    Drill 5 Qs →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Mock Test Scores */}
          <div className="p-5 rounded-2xl border border-border bg-surface shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">Recent Test Scores</h3>
              <Link href="/performance" className="text-[11px] font-bold text-primary hover:underline">Analytics</Link>
            </div>
            {d.recent_tests.length > 0 ? (
              d.recent_tests.map((t: any) => (
                <div key={t.id} className="p-3 rounded-xl bg-surface-elevated border border-border flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-foreground">{t.title}</p>
                    <p className="text-[10px] text-foreground-muted">{t.date} • Accuracy: {t.accuracy}%</p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-sm text-foreground">{t.score}</span>
                    <span className="text-[10px] text-foreground-muted">/{t.max_score}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-foreground-muted text-center py-2">No recent test records. Take your first grand test!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
