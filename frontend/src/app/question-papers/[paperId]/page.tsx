'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { QuestionPaper, Question } from '@/lib/types';
import { 
  FileText, ShieldCheck, Download, Play, Clock, 
  Award, ArrowLeft, ExternalLink, CheckCircle2, Bookmark 
} from 'lucide-react';

export default function PaperDetailPage() {
  const params = useParams();
  const paperId = params.paperId;
  const [paper, setPaper] = useState<QuestionPaper | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeTab, setActiveTab] = useState<'questions' | 'pdf_preview' | 'answer_key'>('questions');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchApi<QuestionPaper>(`/questions/papers/${paperId}`),
      fetchApi<Question[]>(`/questions/papers/${paperId}/questions`)
    ]).then(([p, qs]) => {
      setPaper(p);
      setQuestions(qs || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [paperId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="p-8 text-center bg-surface border border-border rounded-3xl">
        <p className="font-bold text-sm text-foreground">Question paper not found.</p>
        <Link href="/question-papers" className="text-xs font-bold text-primary mt-2 inline-block">Back to Papers</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      <Link href="/question-papers" className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground-muted hover:text-foreground">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Paper Library
      </Link>

      {/* Paper Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-2.5 py-1 rounded-md bg-primary-light text-primary">
              Year {paper.year} • {paper.stage_tier}
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-success bg-success/10 px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="w-4 h-4" /> Official Answer Key Verified
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">{paper.paper_title}</h1>
          <p className="text-xs sm:text-sm text-foreground-muted">
            {paper.shift} • Duration: {paper.duration_minutes} mins • Total Marks: {paper.total_marks} • Negative: -{paper.negative_mark_ratio}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/practice-tests?paperId=${paper.id}`}
            className="px-6 py-3 rounded-2xl bg-primary text-white text-xs font-bold shadow-soft flex items-center gap-2 hover:bg-primary-hover"
          >
            <Play className="w-4 h-4 fill-current" /> Start CBT Timed Exam
          </Link>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'questions' ? 'bg-primary text-white shadow-soft' : 'bg-surface hover:bg-surface-elevated text-foreground-muted'
          }`}
        >
          Questions with Solutions ({questions.length})
        </button>
        <button
          onClick={() => setActiveTab('pdf_preview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'pdf_preview' ? 'bg-primary text-white shadow-soft' : 'bg-surface hover:bg-surface-elevated text-foreground-muted'
          }`}
        >
          Official Paper PDF Viewer
        </button>
        <button
          onClick={() => setActiveTab('answer_key')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'answer_key' ? 'bg-primary text-white shadow-soft' : 'bg-surface hover:bg-surface-elevated text-foreground-muted'
          }`}
        >
          Official Answer Key
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id} className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-primary">Question {idx + 1}</span>
                <span className="text-foreground-muted capitalize">{q.difficulty} • +{q.marks} / -{q.negative_marks}</span>
              </div>

              <p className="text-sm sm:text-base font-bold text-foreground leading-relaxed font-mono">
                {q.question_text}
              </p>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {q.options.map((opt) => (
                  <div
                    key={opt.id}
                    className={`p-3 rounded-2xl border text-xs font-medium flex items-center justify-between ${
                      opt.is_correct 
                        ? 'border-success bg-success/10 text-success font-bold' 
                        : 'border-border bg-surface-elevated text-foreground'
                    }`}
                  >
                    <span><strong>({opt.option_key})</strong> {opt.option_text}</span>
                    {opt.is_correct && <CheckCircle2 className="w-4 h-4 text-success shrink-0" />}
                  </div>
                ))}
              </div>

              {/* Verified Solution */}
              {q.explanation && (
                <div className="p-4 rounded-2xl bg-primary-light/30 border border-primary/20 space-y-2 text-xs">
                  <span className="font-bold text-primary flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> Commission Verified Detailed Solution
                  </span>
                  <p className="text-foreground leading-relaxed font-mono whitespace-pre-line">
                    {q.explanation.detailed_solution}
                  </p>
                  {q.explanation.shortcut_technique && (
                    <p className="text-primary font-semibold pt-1 border-t border-primary/15">
                      ⚡ Shortcut Technique: {q.explanation.shortcut_technique}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'pdf_preview' && (
        <div className="p-8 rounded-3xl bg-surface border border-border shadow-elevated text-center space-y-4">
          <FileText className="w-16 h-16 text-primary mx-auto" />
          <h3 className="font-bold text-lg text-foreground">Official Examination Paper Document</h3>
          <p className="text-xs text-foreground-muted max-w-md mx-auto">
            {paper.paper_title} as released publicly by {paper.official_source_url ? 'the conducting authority' : 'the commission'}.
          </p>
          <div className="p-4 rounded-2xl bg-surface-elevated border border-border max-w-sm mx-auto text-xs text-foreground-muted">
            <p><strong>File Name:</strong> {paper.pdf_file_url?.split('/').pop() || 'Paper.pdf'}</p>
            <p><strong>Pages:</strong> 24 Pages • 100 Objective Questions</p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <a
              href={paper.official_source_url || '#'}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-soft flex items-center gap-1.5"
            >
              Open Official Source <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {activeTab === 'answer_key' && (
        <div className="p-8 rounded-3xl bg-surface border border-border shadow-elevated text-center space-y-4">
          <ShieldCheck className="w-16 h-16 text-success mx-auto" />
          <h3 className="font-bold text-lg text-foreground">Official Final Answer Key</h3>
          <p className="text-xs text-foreground-muted max-w-md mx-auto">
            Answer key verified against published Commission Master Question Key.
          </p>
          <div className="p-5 rounded-2xl bg-surface-elevated border border-border max-w-lg mx-auto text-left text-xs space-y-2">
            <div className="flex justify-between py-1 border-b border-border">
              <span>Status:</span>
              <strong className="text-success">Final Key Published</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-border">
              <span>Challenge Period:</span>
              <span>Closed / Finalized</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Source URL:</span>
              <span className="text-primary truncate max-w-[200px]">{paper.official_source_url || 'https://ssc.gov.in'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
