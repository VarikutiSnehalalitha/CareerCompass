'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { ExamSyllabus, SyllabusSubject, SyllabusTopic } from '@/lib/types';
import { 
  BookOpen, CheckCircle2, Clock, Award, ShieldCheck, 
  ArrowLeft, ArrowRight, Play, Sparkles, HelpCircle, ChevronDown, ChevronUp 
} from 'lucide-react';

export default function ExamSyllabusDetailPage() {
  const params = useParams();
  const examId = params.examId;
  const [syllabus, setSyllabus] = useState<ExamSyllabus | null>(null);
  const [activeSubjectIndex, setActiveSubjectIndex] = useState<number>(0);
  const [selectedTopic, setSelectedTopic] = useState<SyllabusTopic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<ExamSyllabus>(`/syllabi/${examId}`)
      .then(res => {
        setSyllabus(res);
        if (res?.subjects?.length && res.subjects[0].topics?.length) {
          setSelectedTopic(res.subjects[0].topics[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [examId]);

  const updateTopicStatus = async (topicId: number, status: string) => {
    try {
      await fetchApi(`/syllabi/topic/${topicId}/progress`, {
        method: 'POST',
        body: JSON.stringify({ status, mastery_percentage: status === 'completed' ? 100 : 50 })
      });
      // update state
      if (selectedTopic && selectedTopic.id === topicId) {
        setSelectedTopic({ ...selectedTopic, user_status: status as any });
      }
      if (syllabus) {
        setSyllabus({
          ...syllabus,
          subjects: syllabus.subjects.map(sub => ({
            ...sub,
            topics: sub.topics.map(t => t.id === topicId ? { ...t, user_status: status as any } : t)
          }))
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!syllabus) {
    return (
      <div className="p-8 text-center bg-surface border border-border rounded-3xl">
        <p className="font-bold text-sm text-foreground">Syllabus not available for this exam.</p>
        <Link href="/syllabus" className="text-xs font-bold text-primary mt-2 inline-block">Back to Syllabi</Link>
      </div>
    );
  }

  const activeSubject: SyllabusSubject = syllabus.subjects[activeSubjectIndex] || syllabus.subjects[0];
  const totalTopics = syllabus.subjects.reduce((acc, s) => acc + s.topics.length, 0);
  const completedTopics = syllabus.subjects.reduce(
    (acc, s) => acc + s.topics.filter(t => t.user_status === 'completed').length, 0
  );
  const progressPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <Link href="/syllabus" className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground-muted hover:text-foreground">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to All Syllabi
      </Link>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-md bg-primary-light text-primary border border-primary/20">
              Official Syllabus v{syllabus.version}
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" /> {syllabus.verified_by || 'Commission Verified'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">{syllabus.title}</h1>
          <p className="text-xs sm:text-sm text-foreground-muted">
            Hierarchical structure: Subject → Unit → Topic with study notes, formula sheets, and linked topic tests.
          </p>
        </div>

        {/* Syllabus Completion Meter */}
        <div className="p-4 rounded-2xl bg-surface-elevated border border-border min-w-[200px] text-center space-y-1.5">
          <span className="text-[10px] font-bold uppercase text-foreground-muted">Syllabus Completion</span>
          <div className="text-2xl font-black text-foreground">{progressPct}%</div>
          <div className="w-full bg-border/40 h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="text-[10px] text-foreground-muted">{completedTopics} of {totalTopics} topics mastered</span>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {syllabus.subjects.map((sub, idx) => (
          <button
            key={sub.id}
            onClick={() => {
              setActiveSubjectIndex(idx);
              if (sub.topics.length) setSelectedTopic(sub.topics[0]);
            }}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeSubjectIndex === idx
                ? 'bg-primary text-white shadow-soft'
                : 'bg-surface hover:bg-surface-elevated text-foreground-muted border border-border'
            }`}
          >
            <span>{sub.name}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
              activeSubjectIndex === idx ? 'bg-white/20 text-white' : 'bg-primary-light text-primary'
            }`}>
              {sub.weightage_percent}% Weight
            </span>
          </button>
        ))}
      </div>

      {/* Main Two-Column View: Topic List (Left) & Topic Study Sheet (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Topics in Active Subject */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="font-bold text-sm text-foreground">Topics ({activeSubject.topics.length})</h3>
            <span className="text-xs text-foreground-muted">{activeSubject.description}</span>
          </div>

          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {activeSubject.topics.map((t) => {
              const isSelected = selectedTopic?.id === t.id;
              const isDone = t.user_status === 'completed';
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTopic(t)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all text-left flex items-start justify-between gap-3 ${
                    isSelected 
                      ? 'border-primary bg-primary-light/35 shadow-soft ring-1 ring-primary/30' 
                      : 'border-border bg-surface hover:bg-surface-elevated'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider block truncate">
                      {t.unit_name || 'Unit'}
                    </span>
                    <h4 className="font-extrabold text-xs text-foreground truncate">{t.name}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-foreground-muted pt-0.5">
                      <span className="capitalize">{t.difficulty_level}</span>
                      <span>•</span>
                      <span>{t.recommended_hours} hrs</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    isDone ? 'bg-success/15 text-success' : (t.user_status === 'in_progress' ? 'bg-amber-500/15 text-amber-600' : 'bg-border/60 text-foreground-muted')
                  }`}>
                    {t.user_status ? t.user_status.replace('_', ' ') : 'not started'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Topic Detailed Learning & Study Sheet */}
        <div className="lg:col-span-7">
          {selectedTopic ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-elevated space-y-6">
              {/* Topic Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
                <div>
                  <span className="text-xs font-bold uppercase text-primary tracking-wider">{selectedTopic.unit_name}</span>
                  <h2 className="text-xl sm:text-2xl font-black text-foreground mt-0.5">{selectedTopic.name}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/practice-tests?topicId=${selectedTopic.id}`}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-soft flex items-center gap-1.5 hover:bg-primary-hover"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Take Topic Test
                  </Link>
                </div>
              </div>

              {/* Status Selector Bar */}
              <div className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-surface-elevated border border-border text-xs">
                <span className="font-bold text-foreground">Mark Status:</span>
                <div className="flex items-center gap-1.5">
                  {(['not_started', 'in_progress', 'completed', 'needs_revision'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => updateTopicStatus(selectedTopic.id, st)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all ${
                        selectedTopic.user_status === st 
                          ? 'bg-primary text-white shadow-sm' 
                          : 'hover:bg-surface text-foreground-muted'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Study Notes */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" /> Comprehensive Study Notes
                </h3>
                <div className="p-5 rounded-2xl bg-surface-elevated border border-border text-xs sm:text-sm text-foreground-muted leading-relaxed whitespace-pre-line font-mono">
                  {selectedTopic.study_notes || 'Core theoretical breakdown, historical patterns, and commission exam guidelines.'}
                </div>
              </div>

              {/* High-Yield Formulas Summary */}
              {selectedTopic.formulas_summary && (
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" /> Key Formulas & Shortcut Techniques
                  </h3>
                  <div className="p-5 rounded-2xl bg-primary-light/30 border border-primary/20 text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-line font-mono">
                    {selectedTopic.formulas_summary}
                  </div>
                </div>
              )}

              {/* AI Topic Teacher Prompt Action */}
              <div className="p-4 rounded-2xl border border-primary/20 bg-primary-light/40 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Sparkles className="w-4 h-4" /> Want StudyMate AI to teach this topic?
                </div>
                <Link
                  href={`/ai-studymate?mode=topic_teacher&topic=${encodeURIComponent(selectedTopic.name)}`}
                  className="px-3.5 py-1.5 rounded-xl bg-primary text-white font-bold text-xs shrink-0 shadow-sm"
                >
                  Ask AI Teacher →
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-surface border border-border rounded-3xl">
              <p className="text-xs text-foreground-muted">Select a topic from the left to view detailed study notes and launch topic tests.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
