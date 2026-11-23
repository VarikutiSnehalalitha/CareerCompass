'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { Examination } from '@/lib/types';
import { 
  ShieldCheck, Calendar, Users, IndianRupee, ExternalLink, 
  BookOpen, FileText, CheckCircle2, ArrowLeft, Target 
} from 'lucide-react';

export default function ExamDetailPage() {
  const params = useParams();
  const examId = params.id;
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<any>(`/exams/${examId}`)
      .then(res => {
        setExam(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [examId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="p-8 text-center bg-surface border border-border rounded-3xl">
        <h2 className="font-bold text-lg text-foreground">Examination Not Found</h2>
        <Link href="/exams" className="text-xs font-bold text-primary mt-2 inline-block">Back to Exams</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      <Link href="/exams" className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground-muted hover:text-foreground">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Exam Explorer
      </Link>

      {/* Main Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-soft space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-md bg-primary-light text-primary border border-primary/20">
              {exam.exam_level} • {exam.state}
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-success bg-success/10 px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="w-4 h-4" /> Official Commission Verified
            </span>
          </div>

          <div className="flex items-center gap-2">
            {exam.official_apply_url && (
              <a
                href={exam.official_apply_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-soft flex items-center gap-1.5 hover:bg-primary-hover"
              >
                Official Apply Link <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <Link
              href={`/exams/setup?examId=${exam.id}`}
              className="px-4 py-2 rounded-xl border border-border bg-surface-elevated hover:bg-surface text-foreground text-xs font-bold flex items-center gap-1.5"
            >
              <Target className="w-3.5 h-3.5 text-primary" /> Start Prep Plan
            </Link>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">{exam.name}</h1>
          <p className="text-sm text-foreground-muted mt-1">{exam.conducting_authority}</p>
        </div>

        <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
          {exam.description}
        </p>

        {/* 4 Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border">
            <span className="text-[10px] uppercase font-bold text-foreground-muted">Total Vacancies</span>
            <p className="text-base font-black text-foreground">{exam.vacancies?.toLocaleString('en-IN') || 'Announced'}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border">
            <span className="text-[10px] uppercase font-bold text-foreground-muted">Pay Scale</span>
            <p className="text-base font-black text-foreground">₹{Math.round(exam.salary_min / 1000)}k - ₹{Math.round(exam.salary_max / 1000)}k</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border">
            <span className="text-[10px] uppercase font-bold text-foreground-muted">Age Limits</span>
            <p className="text-base font-black text-foreground">{exam.min_age} - {exam.max_age} Years</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border">
            <span className="text-[10px] uppercase font-bold text-foreground-muted">Target Exam Date</span>
            <p className="text-base font-black text-foreground">{exam.exam_date || 'Upcoming'}</p>
          </div>
        </div>
      </div>

      {/* Selection Process & Exam Pattern */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-3">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" /> Selection Process
          </h3>
          <p className="text-xs text-foreground-muted leading-relaxed">
            {exam.selection_process || 'Preliminary Computer Based Test -> Mains Written Examination -> Personality Test.'}
          </p>
          <div className="text-xs text-foreground-muted pt-2 border-t border-border">
            <strong>Nationality:</strong> {exam.nationality_requirements || 'Citizen of India'}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-3">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" /> Examination Pattern & Marking
          </h3>
          <p className="text-xs text-foreground-muted leading-relaxed">
            {exam.exam_pattern || '100 Questions, 200 Marks, 60 minutes duration. Negative marking: 0.50 per incorrect response.'}
          </p>
          <div className="text-xs text-foreground-muted pt-2 border-t border-border">
            <strong>Application Fee:</strong> ₹{exam.application_fee} (Fee exemption for reserved categories as per rules)
          </div>
        </div>
      </div>

      {/* Quick Launch Buttons */}
      <div className="p-6 rounded-3xl bg-surface-elevated border border-border flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm text-foreground">Ready to start studying?</h4>
          <p className="text-xs text-foreground-muted">View the complete hierarchical syllabus or download previous year question papers.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/syllabus/${exam.id}`}
            className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-soft flex items-center gap-1.5 hover:bg-primary-hover"
          >
            <BookOpen className="w-4 h-4" /> Open Full Syllabus
          </Link>
          <Link
            href={`/question-papers?examId=${exam.id}`}
            className="px-5 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-elevated text-foreground text-xs font-bold flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-primary" /> 10-Year Question Papers
          </Link>
        </div>
      </div>
    </div>
  );
}
