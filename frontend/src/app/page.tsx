'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/theme/ThemeProvider';
import { fetchApi } from '@/lib/api';
import { 
  Compass, Search, ArrowRight, CheckCircle2, ShieldCheck, 
  Sparkles, Award, BookOpen, FileText, Briefcase, 
  GraduationCap, TrendingUp, Users, Clock, Target, Trees, Calendar
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { themeName, themeMode, toggleTheme, toggleMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const handleDemoAccess = async (role: 'student' | 'recruiter' | 'admin' = 'student') => {
    try {
      const data = await fetchApi<any>(`/auth/demo-login/${role}`, { method: 'POST' });
      localStorage.setItem('careercompass_token', data.access_token);
      router.push('/dashboard');
    } catch {
      router.push('/dashboard');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/exams?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl p-8 sm:p-12 lg:p-16 border border-border bg-surface shadow-elevated text-center lg:text-left">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Career & Exam Preparation Ecosystem
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.1]">
            Discover, Prepare & Excel in <span className="text-primary underline decoration-primary/30">Competitive Exams</span> & Careers.
          </h1>

          <p className="text-base sm:text-lg text-foreground-muted leading-relaxed">
            One comprehensive platform combining <strong>10–15 year PYQ libraries</strong>, <strong>intelligent timetables</strong> with overlapping subject deduplication, <strong>CBT grand tests</strong>, and <strong>StudyMate AI mentor</strong>.
          </p>

          {/* Interactive Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 pt-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search SSC CGL, UPSC, Bank PO, TSPSC, GATE..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-surface-elevated border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-soft flex items-center justify-center gap-2"
            >
              Search Exams <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button
              onClick={() => handleDemoAccess('student')}
              className="px-6 py-3 rounded-2xl bg-primary text-white text-sm font-bold shadow-soft hover:opacity-95 flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4" /> Explore Student Demo
            </button>
            <Link
              href="/exams/setup"
              className="px-6 py-3 rounded-2xl border border-border bg-surface-elevated hover:bg-surface text-foreground text-sm font-bold flex items-center gap-2"
            >
              <Target className="w-4 h-4 text-primary" /> Setup Exam Plan
            </Link>
            <Link
              href="/theme-settings"
              className="px-5 py-3 rounded-2xl border border-border bg-surface-elevated hover:bg-surface text-foreground text-xs font-semibold flex items-center gap-1.5"
            >
              🎨 Theme: {themeName === 'nature' ? '🌿 Nature' : '✨ Galaxy'} ({themeMode})
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Examinations Shelf */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-foreground">Popular Examination Pathways</h2>
            <p className="text-sm text-foreground-muted">Select an examination to automatically generate your complete preparation experience.</p>
          </div>
          <Link href="/exams" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            View All 28+ Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { id: 1, title: 'SSC CGL 2026', authority: 'Staff Selection Commission', vacancies: '17,727 Vacancies', tag: 'Group B & C', desc: 'Combined Graduate Level examination for central ministries and inspector roles.' },
            { id: 2, title: 'IBPS PO (CRP-PO XVI)', authority: 'Institute of Banking Personnel', vacancies: '4,455 Posts', tag: 'Banking PO', desc: 'Probationary officer cadre across 11 national public sector commercial banks.' },
            { id: 3, title: 'UPSC Civil Services 2026', authority: 'Union Public Service Commission', vacancies: '1,056 Posts', tag: 'IAS / IPS / IFS', desc: 'Premier civil administrative entrance exam with GS Paper 1 and CSAT.' },
            { id: 4, title: 'Telangana Group I (TGPSC)', authority: 'Telangana PSC', vacancies: '563 Vacancies', tag: 'State Gazetted', desc: 'State administrative officers, DSP, Commercial Tax Officer, and RDO posts.' },
            { id: 5, title: 'RRB NTPC (Railways)', authority: 'Railway Recruitment Boards', vacancies: '11,558 Vacancies', tag: 'Non-Technical', desc: 'Station Master, Goods Guard, Senior Clerk across national railway zones.' },
            { id: 6, title: 'GATE Computer Science', authority: 'IIT / IISc Organising Board', vacancies: '3,500 PSU Seats', tag: 'PSU & M.Tech', desc: 'Direct technical gateway to IOCL, ONGC, NTPC, ISRO, and top master programs.' }
          ].map((ex) => (
            <div key={ex.id} className="p-5 rounded-2xl border border-border bg-surface hover:shadow-elevated transition-all flex flex-col justify-between group">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-primary-light text-primary">{ex.tag}</span>
                  <span className="text-[11px] font-semibold text-foreground-muted">{ex.vacancies}</span>
                </div>
                <h3 className="font-extrabold text-base text-foreground group-hover:text-primary transition-colors">{ex.title}</h3>
                <p className="text-xs text-foreground-muted leading-relaxed">{ex.desc}</p>
              </div>
              <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-xs">
                <span className="text-[11px] text-foreground-muted font-medium">{ex.authority}</span>
                <Link href={`/exams/${ex.id}`} className="font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl border border-border bg-surface space-y-3">
          <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-foreground">Hierarchical Syllabi</h3>
          <p className="text-xs text-foreground-muted leading-relaxed">
            Every exam mapped into Subject → Unit → Topic → Subtopic with verified study notes and formula summaries.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-surface space-y-3">
          <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-foreground">10-15 Year PYQ Library</h3>
          <p className="text-xs text-foreground-muted leading-relaxed">
            Genuine past examination papers with official commission answer keys and expert step-by-step solutions.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-surface space-y-3">
          <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-foreground">Smart Timetable Engine</h3>
          <p className="text-xs text-foreground-muted leading-relaxed">
            Deduplicates overlapping subjects between exams (SSC + Bank) and reschedules missed sessions without overload.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-surface space-y-3">
          <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-foreground">StudyMate AI Mentor</h3>
          <p className="text-xs text-foreground-muted leading-relaxed">
            Instant Doubt Solver, 6-mode Topic Teacher, question generator, and personalized weak area diagnosis.
          </p>
        </div>
      </section>
    </div>
  );
}
