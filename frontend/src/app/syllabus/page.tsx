'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { Examination } from '@/lib/types';
import { BookOpen, ArrowRight, ShieldCheck, Layers } from 'lucide-react';

export default function SyllabusIndexPage() {
  const [exams, setExams] = useState<Examination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<Examination[]>('/exams/')
      .then(res => {
        setExams(res || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-1">
          <BookOpen className="w-4 h-4" /> Academic Architecture
        </div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Hierarchical Syllabus Explorer</h1>
        <p className="text-sm text-foreground-muted">
          Select an examination to explore its structured breakdown across <strong>Subjects → Units → Topics → Subtopics</strong> with study notes, formula sheets, and topic tests.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((ex) => (
            <div
              key={ex.id}
              className="p-6 rounded-3xl border border-border bg-surface hover:shadow-elevated transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-primary-light text-primary">
                  {ex.code}
                </span>
                <h3 className="font-extrabold text-base text-foreground group-hover:text-primary transition-colors">
                  {ex.name}
                </h3>
                <p className="text-xs text-foreground-muted">{ex.conducting_authority}</p>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-foreground-muted">4 Core Subjects</span>
                <Link
                  href={`/syllabus/${ex.id}`}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-soft flex items-center gap-1 hover:bg-primary-hover"
                >
                  Explore Syllabus <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
