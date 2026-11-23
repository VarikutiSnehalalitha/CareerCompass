'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { QuestionPaper, Examination } from '@/lib/types';
import { 
  FileText, Search, ShieldCheck, Download, Play, 
  Clock, Award, Calendar, ExternalLink, ArrowRight, BookOpen 
} from 'lucide-react';

function QuestionPapersContent() {
  const searchParams = useSearchParams();
  const initialExamId = searchParams.get('examId');

  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [exams, setExams] = useState<Examination[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>(initialExamId || 'all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchApi<QuestionPaper[]>('/questions/papers'),
      fetchApi<Examination[]>('/exams/')
    ]).then(([pList, exList]) => {
      setPapers(pList || []);
      setExams(exList || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015];

  const filtered = papers.filter(p => {
    if (selectedExamId !== 'all' && p.exam_id !== parseInt(selectedExamId)) return false;
    if (selectedYear !== 'all' && p.year !== parseInt(selectedYear)) return false;
    return true;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-1">
          <FileText className="w-4 h-4" /> 10–15 Year Archives
        </div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Previous-Year Question Paper Library</h1>
        <p className="text-sm text-foreground-muted">
          Legally verified past examination papers with official commission answer keys, detailed explanations, and online timed simulation mode.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border shadow-sm flex flex-wrap items-center gap-4">
        {/* Exam Select */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-foreground-muted block">Examination</label>
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="px-3.5 py-2 rounded-xl text-xs bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Examinations ({exams.length})</option>
            {exams.map((ex) => (
              <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
          </select>
        </div>

        {/* Year Select */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-foreground-muted block">Year Range (10-15 Years)</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3.5 py-2 rounded-xl text-xs bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Years (2015 - 2025)</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => { setSelectedExamId('all'); setSelectedYear('all'); }}
          className="self-end px-3 py-2 rounded-xl text-xs font-semibold text-foreground-muted hover:text-foreground bg-surface-elevated hover:bg-surface border border-border"
        >
          Reset Filters
        </button>
      </div>

      {/* Question Papers List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center bg-surface border border-border rounded-3xl">
          <p className="text-sm font-bold text-foreground">No question papers found for the selected filter combination.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((paper) => (
            <div
              key={paper.id}
              className="p-6 rounded-3xl border border-border bg-surface hover:shadow-elevated transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black px-2.5 py-1 rounded-md bg-primary-light text-primary">
                    Year {paper.year}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" /> Official Commission Key
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-foreground group-hover:text-primary transition-colors leading-tight">
                    {paper.paper_title}
                  </h3>
                  <p className="text-xs text-foreground-muted mt-1">{paper.shift} • {paper.stage_tier}</p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 text-[11px] pt-1 text-center">
                  <div className="p-2 rounded-xl bg-surface-elevated border border-border">
                    <span className="text-foreground-muted block text-[10px]">Duration</span>
                    <strong className="text-foreground">{paper.duration_minutes}m</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-surface-elevated border border-border">
                    <span className="text-foreground-muted block text-[10px]">Questions</span>
                    <strong className="text-foreground">{paper.total_questions}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-surface-elevated border border-border">
                    <span className="text-foreground-muted block text-[10px]">Neg. Mark</span>
                    <strong className="text-danger font-bold">-{paper.negative_mark_ratio}</strong>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                <Link
                  href={`/question-papers/${paper.id}`}
                  className="px-3.5 py-2 rounded-xl border border-border bg-surface-elevated hover:bg-surface text-foreground font-semibold text-xs flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-primary" /> View Paper & Key
                </Link>
                <Link
                  href={`/practice-tests?paperId=${paper.id}`}
                  className="px-3.5 py-2 rounded-xl bg-primary text-white font-bold text-xs shadow-soft flex items-center gap-1.5 hover:bg-primary-hover"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Timed Test
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function QuestionPapersPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></div>}>
      <QuestionPapersContent />
    </Suspense>
  );
}
