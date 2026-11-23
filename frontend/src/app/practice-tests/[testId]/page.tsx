'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { TestSession, Question } from '@/lib/types';
import { useTheme } from '@/components/theme/ThemeProvider';
import { 
  Clock, CheckCircle2, Bookmark, ArrowRight, ArrowLeft, 
  Award, TrendingUp, AlertCircle, RotateCcw, ShieldCheck 
} from 'lucide-react';

export default function CBTTestInterfacePage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.testId;
  const { setDistractionFree } = useTheme();

  const [session, setSession] = useState<any>(null);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, { optionKey?: string; markedForReview: boolean }>>({});
  const [timeLeft, setTimeLeft] = useState<number>(1800);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [resultData, setResultData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Automatically enable distraction-free background during exam
  useEffect(() => {
    setDistractionFree(true);
    return () => setDistractionFree(false);
  }, [setDistractionFree]);

  useEffect(() => {
    fetchApi<any>(`/tests/${testId}`)
      .then(res => {
        setSession(res);
        if (res.status === 'completed') {
          setIsSubmitted(true);
          setResultData(res);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [testId]);

  // Timer Countdown
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, timeLeft]);

  const handleSelectOption = (qId: number, key: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        optionKey: key
      }
    }));
  };

  const handleToggleMarkReview = (qId: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        markedForReview: !prev[qId]?.markedForReview
      }
    }));
  };

  const handleSubmitTest = async () => {
    if (isSubmitted) return;
    try {
      const answersList = session.answers.map((a: any) => {
        const u = userAnswers[a.question_id];
        return {
          question_id: a.question_id,
          selected_option_key: u?.optionKey || null,
          is_marked_for_review: u?.markedForReview || false,
          time_spent_seconds: 45
        };
      });

      const res = await fetchApi<any>(`/tests/${testId}/submit`, {
        method: 'POST',
        body: JSON.stringify({
          answers: answersList,
          time_spent_seconds: 1800 - timeLeft
        })
      });
      setResultData(res);
      setIsSubmitted(true);
    } catch (e) {
      console.error(e);
      setIsSubmitted(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // 1. Post-Submission Result Scorecard
  if (isSubmitted && resultData) {
    const res = resultData;
    const resultObj = res.result || {};
    let weakList = [];
    let strongList = [];
    try { weakList = JSON.parse(resultObj.weak_topics || '[]'); } catch {}
    try { strongList = JSON.parse(resultObj.strong_topics || '[]'); } catch {}

    return (
      <div className="space-y-8 max-w-4xl mx-auto pb-16">
        <div className="p-8 rounded-3xl bg-surface border border-border shadow-elevated text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-success/15 text-success flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-success px-3 py-1 rounded-full bg-success/10">
            Assessment Completed
          </span>
          <h1 className="text-3xl font-black text-foreground">{res.title}</h1>

          {/* 4 Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-4 text-center">
            <div className="p-4 rounded-2xl bg-surface-elevated border border-border">
              <span className="text-[10px] text-foreground-muted uppercase font-bold block">Total Score</span>
              <strong className="text-2xl font-black text-foreground">{res.total_score}</strong>
              <span className="text-[10px] text-foreground-muted block">/ {res.max_score}</span>
            </div>
            <div className="p-4 rounded-2xl bg-surface-elevated border border-border">
              <span className="text-[10px] text-foreground-muted uppercase font-bold block">Accuracy Rate</span>
              <strong className="text-2xl font-black text-success">{res.accuracy_rate}%</strong>
              <span className="text-[10px] text-foreground-muted block">{res.correct_count} correct</span>
            </div>
            <div className="p-4 rounded-2xl bg-surface-elevated border border-border">
              <span className="text-[10px] text-foreground-muted uppercase font-bold block">Percentile</span>
              <strong className="text-2xl font-black text-primary">{resultObj.percentile_estimate || 88.5}%</strong>
              <span className="text-[10px] text-foreground-muted block">Simulated Rank: #{resultObj.rank_estimate || 142}</span>
            </div>
            <div className="p-4 rounded-2xl bg-surface-elevated border border-border">
              <span className="text-[10px] text-foreground-muted uppercase font-bold block">Speed Management</span>
              <strong className="text-2xl font-black text-foreground">{resultObj.time_management_score || 85}%</strong>
              <span className="text-[10px] text-foreground-muted block">Pacing score</span>
            </div>
          </div>
        </div>

        {/* Diagnosis & Action Plan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-surface border border-border space-y-3">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" /> Strong Topics
            </h3>
            <div className="space-y-1.5">
              {strongList.length > 0 ? (
                strongList.map((item: string, i: number) => (
                  <div key={i} className="p-2.5 rounded-xl bg-success/10 text-xs font-semibold text-foreground">
                    ✓ {item}
                  </div>
                ))
              ) : (
                <p className="text-xs text-foreground-muted">Solid foundation maintained.</p>
              )}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-surface border border-border space-y-3">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2 text-danger">
              <AlertCircle className="w-4 h-4 text-danger" /> Topics Requiring Revision Drill
            </h3>
            <div className="space-y-1.5">
              {weakList.length > 0 ? (
                weakList.map((item: string, i: number) => (
                  <div key={i} className="p-2.5 rounded-xl bg-danger/10 text-xs font-semibold text-danger flex items-center justify-between">
                    <span>• {item}</span>
                    <span className="text-[10px] font-bold underline">Auto-added to revision</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-foreground-muted">No critical weak areas detected.</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-2xl bg-primary text-white font-bold text-xs shadow-soft"
          >
            Back to Student Dashboard
          </Link>
          <Link
            href="/practice-tests"
            className="px-6 py-3 rounded-2xl border border-border bg-surface hover:bg-surface-elevated text-foreground font-bold text-xs"
          >
            Take Another Test
          </Link>
        </div>
      </div>
    );
  }

  // 2. Active CBT Examination Interface
  const questionsList = session.answers?.map((a: any) => a.question).filter(Boolean) || [];
  const currentQ = questionsList[currentIdx];
  const totalQ = questionsList.length;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* CBT Top Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border shadow-sm flex items-center justify-between gap-4">
        <div>
          <h2 className="font-extrabold text-sm sm:text-base text-foreground truncate max-w-md">{session.title}</h2>
          <span className="text-xs text-foreground-muted">Computer Based Test (CBT) Simulation</span>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-elevated border border-border text-foreground font-mono font-bold text-sm">
          <Clock className={`w-4 h-4 ${timeLeft < 300 ? 'text-danger animate-pulse' : 'text-primary'}`} />
          <span className={timeLeft < 300 ? 'text-danger' : 'text-foreground'}>{timerDisplay}</span>
        </div>

        <button
          onClick={handleSubmitTest}
          className="px-5 py-2 rounded-xl bg-danger hover:bg-danger/90 text-white font-bold text-xs shadow-soft"
        >
          Submit Test
        </button>
      </div>

      {/* Main CBT Split: Question Panel (Left) & Question Palette (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Question */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-soft flex flex-col justify-between space-y-6 min-h-[480px]">
          {currentQ ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3 text-xs">
                <span className="font-extrabold text-primary">Question {currentIdx + 1} of {totalQ}</span>
                <span className="text-foreground-muted">Marking: +{currentQ.marks} / -{currentQ.negative_marks}</span>
              </div>

              <div className="p-4 rounded-2xl bg-surface-elevated border border-border">
                <p className="text-sm sm:text-base font-bold text-foreground leading-relaxed font-mono">
                  {currentQ.question_text}
                </p>
              </div>

              {/* Options Selector */}
              <div className="space-y-2.5 pt-2">
                {currentQ.options?.map((opt: any) => {
                  const isSelected = userAnswers[currentQ.id]?.optionKey === opt.option_key;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(currentQ.id, opt.option_key)}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all text-xs flex items-center justify-between ${
                        isSelected 
                          ? 'border-primary bg-primary-light/40 shadow-soft text-foreground font-bold' 
                          : 'border-border bg-surface hover:bg-surface-elevated text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isSelected ? 'bg-primary text-white' : 'bg-surface-elevated border border-border text-foreground-muted'
                        }`}>
                          {opt.option_key}
                        </div>
                        <span>{opt.option_text}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-xs text-foreground-muted">Loading question...</p>
          )}

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => currentQ && handleToggleMarkReview(currentQ.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  currentQ && userAnswers[currentQ.id]?.markedForReview 
                    ? 'bg-purple-600 text-white border-purple-600' 
                    : 'bg-surface-elevated hover:bg-surface border-border text-foreground'
                }`}
              >
                Mark for Review
              </button>
              <button
                onClick={() => currentQ && handleSelectOption(currentQ.id, '')}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-foreground-muted hover:text-foreground bg-surface-elevated border border-border"
              >
                Clear Response
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className="px-4 py-2 rounded-xl border border-border bg-surface-elevated hover:bg-surface text-foreground font-bold text-xs disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentIdx(prev => Math.min(totalQ - 1, prev + 1))}
                className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-soft"
              >
                Save & Next
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: CBT Question Palette */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-surface border border-border shadow-soft space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">Question Palette</h3>

          {/* Status Legend */}
          <div className="grid grid-cols-2 gap-2 text-[10px] text-foreground-muted pb-2 border-b border-border">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-success" /> Answered</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-danger" /> Not Answered</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-purple-600" /> Marked for Review</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-border" /> Not Visited</div>
          </div>

          {/* Palette Grid */}
          <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
            {questionsList.map((q: any, i: number) => {
              const u = userAnswers[q.id];
              let colorClass = 'bg-surface-elevated border border-border text-foreground';
              if (u?.markedForReview) {
                colorClass = 'bg-purple-600 text-white font-bold';
              } else if (u?.optionKey) {
                colorClass = 'bg-success text-white font-bold';
              } else if (i === currentIdx) {
                colorClass = 'bg-danger text-white font-bold ring-2 ring-primary';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(i)}
                  className={`h-9 rounded-xl text-xs flex items-center justify-center transition-all ${colorClass}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-border">
            <button
              onClick={handleSubmitTest}
              className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-soft"
            >
              Submit & View Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
