'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { Examination, ExamCategory } from '@/lib/types';
import { 
  Compass, Search, Filter, ShieldCheck, Calendar, 
  Award, ArrowRight, IndianRupee, Users, CheckCircle2, 
  MapPin, BookOpen, FileText 
} from 'lucide-react';

function ExamExplorerContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [exams, setExams] = useState<Examination[]>([]);
  const [categories, setCategories] = useState<ExamCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedState, setSelectedState] = useState<string>('All India');
  const [selectedQualification, setSelectedQualification] = useState<string>('');
  const [search, setSearch] = useState<string>(initialSearch);

  useEffect(() => {
    Promise.all([
      fetchApi<ExamCategory[]>('/exams/categories'),
      fetchApi<Examination[]>('/exams/')
    ]).then(([cats, exList]) => {
      setCategories(cats || []);
      setExams(exList || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const filteredExams = exams.filter(ex => {
    if (selectedCategory && ex.category_id !== selectedCategory) return false;
    if (selectedState !== 'All India' && ex.state !== 'All India' && ex.state !== selectedState) return false;
    if (selectedQualification && !ex.qualification_required?.toLowerCase().includes(selectedQualification.toLowerCase())) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = ex.name.toLowerCase().includes(q);
      const matchCode = ex.code.toLowerCase().includes(q);
      const matchAuth = ex.conducting_authority.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchAuth) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-1">
            <Compass className="w-4 h-4" /> Comprehensive Recruitment Directory
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Explore Examinations & Government Recruitment</h1>
          <p className="text-sm text-foreground-muted">
            National, State PSC, Defence, Banking, Railway and Technical recruitments with verified syllabi and official notifications.
          </p>
        </div>
        <Link
          href="/exams/setup"
          className="px-5 py-2.5 rounded-2xl bg-primary text-white text-xs font-bold shadow-soft flex items-center gap-2 self-start md:self-auto shrink-0"
        >
          Setup Exam Prep Plan →
        </Link>
      </div>

      {/* Filter Ribbon */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by exam or commission..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* State Filter */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="All India">All India / Central</option>
            <option value="Telangana">Telangana (TGPSC)</option>
            <option value="Andhra Pradesh">Andhra Pradesh (APPSC)</option>
            <option value="Maharashtra">Maharashtra (MPSC)</option>
            <option value="Uttar Pradesh">Uttar Pradesh (UPPSC)</option>
            <option value="Bihar">Bihar (BPSC)</option>
            <option value="Karnataka">Karnataka (KPSC)</option>
            <option value="Tamil Nadu">Tamil Nadu (TNPSC)</option>
          </select>

          {/* Qualification Filter */}
          <select
            value={selectedQualification}
            onChange={(e) => setSelectedQualification(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Any Qualification</option>
            <option value="Graduate">Bachelor's Degree (Any Discipline)</option>
            <option value="Engineering">B.Tech / B.E. (Engineering)</option>
            <option value="12th">12th Standard (+2)</option>
            <option value="10th">10th Standard (Matriculation)</option>
          </select>

          {/* Reset Filters */}
          <button
            onClick={() => { setSelectedCategory(null); setSelectedState('All India'); setSelectedQualification(''); setSearch(''); }}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-foreground-muted hover:text-foreground bg-surface-elevated hover:bg-surface border border-border"
          >
            Reset Filters
          </button>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === null 
                ? 'bg-primary text-white shadow-soft' 
                : 'bg-surface-elevated hover:bg-surface text-foreground-muted border border-border'
            }`}
          >
            All Categories ({exams.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id 
                  ? 'bg-primary text-white shadow-soft' 
                  : 'bg-surface-elevated hover:bg-surface text-foreground-muted border border-border'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Examinations Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredExams.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl bg-surface border border-border space-y-3">
          <p className="font-bold text-sm text-foreground">No examinations match your current filters.</p>
          <button
            onClick={() => { setSelectedCategory(null); setSelectedState('All India'); setSelectedQualification(''); setSearch(''); }}
            className="text-xs font-bold text-primary hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((ex) => (
            <div
              key={ex.id}
              className="p-6 rounded-3xl border border-border bg-surface hover:shadow-elevated transition-all flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-md bg-primary-light text-primary border border-primary/20">
                    {ex.exam_level} • {ex.state}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>

                <div>
                  <h3 className="font-black text-lg text-foreground group-hover:text-primary transition-colors leading-tight">
                    {ex.name}
                  </h3>
                  <p className="text-xs text-foreground-muted mt-0.5">{ex.conducting_authority}</p>
                </div>

                <p className="text-xs text-foreground-muted line-clamp-2 leading-relaxed">
                  {ex.description}
                </p>

                {/* Key Spec Badges */}
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="p-2 rounded-xl bg-surface-elevated border border-border">
                    <span className="text-foreground-muted block text-[10px]">Vacancies</span>
                    <strong className="text-foreground">{ex.vacancies ? ex.vacancies.toLocaleString('en-IN') : 'Announced Soon'}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-surface-elevated border border-border">
                    <span className="text-foreground-muted block text-[10px]">Salary Scale</span>
                    <strong className="text-foreground">₹{Math.round(ex.salary_min / 1000)}k - ₹{Math.round(ex.salary_max / 1000)}k</strong>
                  </div>
                </div>

                <div className="text-[11px] text-foreground-muted">
                  <strong>Eligibility:</strong> {ex.qualification_required} (Age: {ex.min_age}-{ex.max_age} yrs)
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                <Link
                  href={`/syllabus/${ex.id}`}
                  className="px-3 py-1.5 rounded-xl border border-border bg-surface-elevated hover:bg-surface text-foreground font-semibold text-xs flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5 text-primary" /> Syllabus
                </Link>
                <Link
                  href={`/question-papers?examId=${ex.id}`}
                  className="px-3 py-1.5 rounded-xl border border-border bg-surface-elevated hover:bg-surface text-foreground font-semibold text-xs flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5 text-primary" /> PYQs
                </Link>
                <Link
                  href={`/exams/${ex.id}`}
                  className="p-2 rounded-xl bg-primary text-white hover:bg-primary-hover shadow-soft"
                  title="View Exam Details"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExamExplorerPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></div>}>
      <ExamExplorerContent />
    </Suspense>
  );
}
