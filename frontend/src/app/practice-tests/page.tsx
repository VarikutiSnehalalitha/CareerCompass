'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { 
  CheckSquare, Play, Clock, Award, ShieldCheck, 
  ArrowRight, BookOpen, Layers, Flame 
} from 'lucide-react';

function PracticeTestsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicId = searchParams.get('topicId');
  const paperId = searchParams.get('paperId');

  const [starting, setStarting] = useState(false);
  const [numQuestions, setNumQuestions] = useState<number>(10);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('mixed');

  const startNewTest = async (type: string = 'topic_test') => {
    setStarting(true);
    try {
      const res = await fetchApi<any>('/tests/start', {
        method: 'POST',
        body: JSON.stringify({
          test_type: type,
          topic_id: topicId ? parseInt(topicId) : undefined,
          question_paper_id: paperId ? parseInt(paperId) : undefined,
          num_questions: numQuestions,
          difficulty: selectedDifficulty
        })
      });
      router.push(`/practice-tests/${res.id}`);
    } catch (e) {
      console.error(e);
      setStarting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-1">
          <CheckSquare className="w-4 h-4" /> Topic Mastery & Drill System
        </div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Topic-Wise Practice Tests</h1>
        <p className="text-sm text-foreground-muted">
          Generate custom drill sessions across beginner, medium, and hard difficulty with detailed step-by-step solutions and speed analytics.
        </p>
      </div>

      {/* Test Configuration Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-soft space-y-6">
        <h2 className="font-bold text-base text-foreground">Launch New Practice Drill</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground">Select Number of Questions</label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 25].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setNumQuestions(num)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    numQuestions === num 
                      ? 'border-primary bg-primary text-white shadow-soft' 
                      : 'border-border bg-surface-elevated hover:bg-surface text-foreground'
                  }`}
                >
                  {num} Qs
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground">Difficulty Target</label>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'mixed', 'hard'] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`py-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                    selectedDifficulty === diff 
                      ? 'border-primary bg-primary text-white shadow-soft' 
                      : 'border-border bg-surface-elevated hover:bg-surface text-foreground'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => startNewTest('topic_test')}
          disabled={starting}
          className="px-8 py-3.5 rounded-2xl bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-soft flex items-center gap-2"
        >
          <Play className="w-4 h-4 fill-current" /> {starting ? 'Preparing Session...' : 'Start Instant Assessment'}
        </button>
      </div>

      {/* Popular Subject Practice Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">High-Yield Subject Practice Tests</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Quantitative Aptitude', count: '14 Topic Tests', desc: 'Number System, Percentages, Work & Distance' },
            { name: 'Reasoning Ability', count: '12 Topic Tests', desc: 'Syllogism, Analogy, Puzzles & Series' },
            { name: 'English Language', count: '10 Topic Tests', desc: 'Comprehension, Grammar, Cloze Test' },
            { name: 'General Awareness', count: '16 Topic Tests', desc: 'Polity, History, Geography & Current Affairs' }
          ].map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-border bg-surface space-y-2 hover:shadow-soft transition-all">
              <h3 className="font-bold text-sm text-foreground">{item.name}</h3>
              <p className="text-[11px] text-foreground-muted">{item.desc}</p>
              <button
                onClick={() => startNewTest('sectional_mock')}
                className="text-xs font-bold text-primary hover:underline block pt-2"
              >
                Start Drill →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PracticeTestsIndexPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></div>}>
      <PracticeTestsContent />
    </Suspense>
  );
}
