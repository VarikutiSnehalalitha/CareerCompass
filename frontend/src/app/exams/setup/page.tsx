'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { Examination } from '@/lib/types';
import { 
  Target, Sparkles, Check, CheckCircle2, AlertCircle, 
  Clock, Calendar, Award, ArrowRight, ShieldCheck 
} from 'lucide-react';

export default function ExamSetupWizardPage() {
  const router = useRouter();
  const [exams, setExams] = useState<Examination[]>([]);
  const [selectedExamIds, setSelectedExamIds] = useState<number[]>([1]); // default SSC CGL
  const [dailyHours, setDailyHours] = useState<number>(4.5);
  const [targetDate, setTargetDate] = useState<string>('2026-09-15');
  const [preferredTime, setPreferredTime] = useState<string>('morning');
  const [prepLevel, setPrepLevel] = useState<string>('intermediate');
  const [targetScore, setTargetScore] = useState<number>(85);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchApi<Examination[]>('/exams/')
      .then(res => {
        setExams(res || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleExam = (id: number) => {
    if (selectedExamIds.includes(id)) {
      if (selectedExamIds.length > 1) {
        setSelectedExamIds(selectedExamIds.filter(x => x !== id));
      }
    } else {
      setSelectedExamIds([...selectedExamIds, id]);
    }
  };

  const hasOverlap = selectedExamIds.length > 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetchApi('/planner/setup', {
        method: 'POST',
        body: JSON.stringify({
          exam_id: selectedExamIds[0],
          target_exam_date: targetDate,
          daily_hours: dailyHours,
          current_level: prepLevel,
          target_score: targetScore,
          common_subjects_deduped: true
        })
      });
      router.push('/study-planner');
    } catch (err) {
      console.error(err);
      router.push('/study-planner');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-1">
          <Target className="w-4 h-4" /> Personalization Engine
        </div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Exam Preparation Setup Wizard</h1>
        <p className="text-sm text-foreground-muted">
          Select your target examinations and study constraints. Our engine will construct an intelligent timetable deduplicating shared subjects.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Select Examinations (Multiple Allowed) */}
        <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-foreground">1. Select Target Examination(s)</h2>
            <span className="text-xs text-foreground-muted font-medium">Select one or multiple</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {exams.map((ex) => {
              const isSelected = selectedExamIds.includes(ex.id);
              return (
                <div
                  key={ex.id}
                  onClick={() => toggleExam(ex.id)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                    isSelected 
                      ? 'border-primary bg-primary-light/40 shadow-soft' 
                      : 'border-border bg-surface-elevated hover:bg-surface'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-primary">{ex.code}</span>
                      {isSelected && <Check className="w-4 h-4 text-primary" />}
                    </div>
                    <h3 className="font-bold text-xs text-foreground">{ex.name}</h3>
                  </div>
                  <p className="text-[10px] text-foreground-muted mt-2">{ex.conducting_authority}</p>
                </div>
              );
            })}
          </div>

          {/* Overlapping Subject Deduplication Alert */}
          {hasOverlap && (
            <div className="p-4 rounded-2xl border border-primary/30 bg-primary-light/50 flex items-start gap-3 animate-in fade-in">
              <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-primary">Overlapping Subjects Intelligently Combined!</p>
                <p className="text-xs text-foreground leading-relaxed">
                  You selected multiple examinations (e.g. SSC & Banking). Common subjects: <strong>Quantitative Aptitude, Logical Reasoning, English, General Awareness</strong> have been merged into unified daily study blocks to avoid duplicate sessions, saving ~2.5 hours per day!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Time Constraints & Level */}
        <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-6">
          <h2 className="font-bold text-base text-foreground">2. Study Availability & Parameters</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Daily Hours */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground">Daily Available Study Time</label>
                <span className="text-xs font-black text-primary px-2.5 py-0.5 rounded-full bg-primary-light">
                  {dailyHours} Hours / day
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="10"
                step="0.5"
                value={dailyHours}
                onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-foreground-muted">
                <span>2 hrs (Working Professional)</span>
                <span>6 hrs</span>
                <span>10 hrs (Full-time)</span>
              </div>
            </div>

            {/* Target Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">Target Exam Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Preferred Study Time */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">Preferred Focus Window</label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="morning">Early Morning (06:00 AM - 10:00 AM)</option>
                <option value="afternoon">Afternoon (01:00 PM - 05:00 PM)</option>
                <option value="evening">Evening (05:00 PM - 09:00 PM)</option>
                <option value="night">Night Owl (09:00 PM - 01:00 AM)</option>
              </select>
            </div>

            {/* Current Preparation Level */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">Current Preparation Baseline</label>
              <select
                value={prepLevel}
                onChange={(e) => setPrepLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="beginner">Beginner (Starting foundational concepts)</option>
                <option value="intermediate">Intermediate (Familiar with syllabus, needs mock test speed)</option>
                <option value="advanced">Advanced (Targeting top percentile rank & speed tricks)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 rounded-2xl bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-soft flex items-center gap-2"
          >
            {submitting ? 'Generating AI Timetable...' : 'Generate Personalized Timetable'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
