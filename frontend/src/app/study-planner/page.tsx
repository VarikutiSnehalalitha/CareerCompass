'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { StudyPlan, StudySession } from '@/lib/types';
import { 
  Calendar, Clock, CheckCircle2, RotateCcw, Sparkles, 
  ArrowRight, Target, Play, AlertCircle, Plus 
} from 'lucide-react';

export default function StudyPlannerPage() {
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [rescheduling, setRescheduling] = useState(false);

  useEffect(() => {
    fetchApi<StudyPlan>('/planner/my-plan')
      .then(res => {
        setPlan(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleToggleSession = async (sessionId: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'scheduled' : 'completed';
    try {
      await fetchApi(`/planner/session/${sessionId}/status?status=${nextStatus}`, { method: 'POST' });
      if (plan) {
        setPlan({
          ...plan,
          sessions: plan.sessions.map(s => s.id === sessionId ? { ...s, status: nextStatus } : s)
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRescheduleMissed = async (sessionId: number) => {
    setRescheduling(true);
    try {
      await fetchApi('/planner/reschedule', {
        method: 'POST',
        body: JSON.stringify({ missed_session_id: sessionId })
      });
      // reload plan
      const updated = await fetchApi<StudyPlan>('/planner/my-plan');
      setPlan(updated);
      setRescheduling(false);
    } catch {
      setRescheduling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const sessions = plan?.sessions || [];
  const completedCount = sessions.filter(s => s.status === 'completed').length;
  const progress = sessions.length > 0 ? Math.round((completedCount / sessions.length) * 100) : 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-md bg-primary-light text-primary border border-primary/20">
              Intelligent Timetable Engine
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" /> Common Subjects Deduplicated
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            {plan?.title || 'Personalized Study Timetable'}
          </h1>
          <p className="text-xs sm:text-sm text-foreground-muted">
            Daily availability: {plan?.daily_hours || 4.5} hours • Target Exam Date: {plan?.target_exam_date || 'Upcoming'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/study-mode"
            className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-soft flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" /> Open Focus Study Mode
          </Link>
          <Link
            href="/exams/setup"
            className="px-4 py-3 rounded-2xl border border-border bg-surface-elevated hover:bg-surface text-foreground text-xs font-bold"
          >
            Adjust Plan
          </Link>
        </div>
      </div>

      {/* Deduplication Callout */}
      <div className="p-4 sm:p-5 rounded-2xl bg-primary-light/40 border border-primary/20 flex items-start gap-3.5 text-xs text-foreground">
        <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-primary font-bold">Smart Cross-Exam Optimization Active:</strong>
          <p className="text-foreground leading-relaxed">
            Quantitative Aptitude, Logical Reasoning, English, and General Awareness sessions are combined into unified learning slots. Overlapping study sessions between multiple goals are eliminated, saving ~2.5 hours every day.
          </p>
        </div>
      </div>

      {/* View Switcher & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'daily' ? 'bg-primary text-white shadow-soft' : 'bg-surface hover:bg-surface-elevated text-foreground-muted border border-border'
            }`}
          >
            Daily View
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'weekly' ? 'bg-primary text-white shadow-soft' : 'bg-surface hover:bg-surface-elevated text-foreground-muted border border-border'
            }`}
          >
            14-Day Timeline View
          </button>
        </div>

        <div className="text-xs text-foreground-muted flex items-center gap-2 font-medium">
          <span>{completedCount} of {sessions.length} sessions completed ({progress}%)</span>
          <div className="w-24 bg-border/40 h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Timetable Sessions List */}
      <div className="space-y-3">
        {sessions.length === 0 ? (
          <div className="p-8 text-center bg-surface border border-border rounded-3xl">
            <p className="text-xs text-foreground-muted">No sessions generated. Run the Exam Setup Wizard to create your schedule.</p>
            <Link href="/exams/setup" className="text-xs font-bold text-primary mt-2 inline-block">Setup Plan →</Link>
          </div>
        ) : (
          sessions.map((sess) => {
            const isDone = sess.status === 'completed';
            const isMissed = sess.status === 'missed';
            return (
              <div
                key={sess.id}
                className={`p-4 sm:p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isDone 
                    ? 'bg-surface-elevated/50 border-border/60 opacity-80' 
                    : (isMissed ? 'bg-danger/10 border-danger/30' : 'bg-surface border-border hover:shadow-soft')
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <button
                    onClick={() => handleToggleSession(sess.id, sess.status)}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border transition-colors mt-0.5 sm:mt-0 ${
                      isDone ? 'bg-success text-white border-success' : 'border-border hover:border-primary text-transparent'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 fill-current" />
                  </button>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">{sess.scheduled_date}</span>
                      {sess.is_revision && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-[10px]">
                          Revision & PYQ Drill
                        </span>
                      )}
                    </div>
                    <h3 className={`font-extrabold text-sm sm:text-base truncate ${isDone ? 'line-through text-foreground-muted' : 'text-foreground'}`}>
                      {sess.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-foreground-muted">
                      <span className="font-semibold text-primary">{sess.start_time} - {sess.end_time}</span>
                      <span>•</span>
                      <span>{sess.duration_minutes} mins</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {sess.status !== 'completed' && (
                    <button
                      onClick={() => handleRescheduleMissed(sess.id)}
                      disabled={rescheduling}
                      className="px-3 py-1.5 rounded-xl border border-border bg-surface-elevated hover:bg-surface text-foreground-muted hover:text-foreground text-xs font-semibold flex items-center gap-1"
                      title="Smoothly move to next study buffer without overload"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reschedule
                    </button>
                  )}
                  <Link
                    href="/study-mode"
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-soft flex items-center gap-1.5 hover:bg-primary-hover"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Study Now
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
