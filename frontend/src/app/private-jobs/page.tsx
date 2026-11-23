'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { PrivateJob } from '@/lib/types';
import { 
  Briefcase, Search, MapPin, IndianRupee, Users, 
  Clock, ArrowRight, Bookmark, CheckCircle2, Sparkles, Filter 
} from 'lucide-react';

export default function PrivateJobsPage() {
  const [jobs, setJobs] = useState<PrivateJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    fetchApi<PrivateJob[]>('/jobs/')
      .then(res => {
        setJobs(res || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const categories = ['All', 'IT and software development', 'Data analytics', 'AI and machine learning', 'Freshers', 'Engineering'];

  const filtered = jobs.filter(j => {
    if (selectedCategory !== 'All' && j.category !== selectedCategory) return false;
    if (selectedWorkMode !== 'All' && j.work_mode !== selectedWorkMode) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = j.job_title.toLowerCase().includes(q);
      const matchCompany = j.company_name.toLowerCase().includes(q);
      const matchSkills = j.required_skills.toLowerCase().includes(q);
      if (!matchTitle && !matchCompany && !matchSkills) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-1">
            <Briefcase className="w-4 h-4" /> Corporate Recruitment & Campus Placements
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Private Sector Jobs & Placement Opportunities</h1>
          <p className="text-sm text-foreground-muted">
            Curated technology, analytics, engineering, and trainee roles with automatic resume skill-matching.
          </p>
        </div>
        <Link
          href="/saved-jobs"
          className="px-5 py-2.5 rounded-2xl border border-border bg-surface-elevated hover:bg-surface text-foreground text-xs font-bold flex items-center gap-2 self-start md:self-auto shrink-0"
        >
          <Bookmark className="w-4 h-4 text-primary" /> Track My Applications
        </Link>
      </div>

      {/* Filter Ribbon */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by title, company or skill (e.g. Python, SQL)..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <select
            value={selectedWorkMode}
            onChange={(e) => setSelectedWorkMode(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="All">All Work Modes</option>
            <option value="remote">Remote Only</option>
            <option value="hybrid">Hybrid</option>
            <option value="on_site">On-site</option>
          </select>

          <button
            onClick={() => { setSelectedCategory('All'); setSelectedWorkMode('All'); setSearch(''); }}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-foreground-muted hover:text-foreground bg-surface-elevated hover:bg-surface border border-border"
          >
            Clear Filters
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === c 
                  ? 'bg-primary text-white shadow-soft' 
                  : 'bg-surface-elevated hover:bg-surface text-foreground-muted border border-border'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center bg-surface border border-border rounded-3xl">
          <p className="text-sm font-bold text-foreground">No private jobs match your current search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((job) => (
            <div
              key={job.id}
              className="p-6 rounded-3xl border border-border bg-surface hover:shadow-elevated transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-md bg-primary-light text-primary border border-primary/20">
                    {job.work_mode.toUpperCase()}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3.5 h-3.5" /> 88% Match
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-foreground group-hover:text-primary transition-colors leading-tight">
                    {job.job_title}
                  </h3>
                  <p className="text-xs text-foreground-muted font-medium mt-0.5">{job.company_name}</p>
                </div>

                <div className="flex items-center gap-3 text-xs text-foreground-muted">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                </div>

                <div className="p-3 rounded-2xl bg-surface-elevated border border-border text-xs">
                  <span className="text-[10px] text-foreground-muted block font-semibold">Compensation Package</span>
                  <strong className="text-foreground text-sm">₹{(job.salary_min / 100000).toFixed(1)}L - ₹{(job.salary_max / 100000).toFixed(1)}L PA</strong>
                </div>

                {/* Skills tags */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-foreground-muted">Required Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {job.required_skills.split(',').slice(0, 4).map((sk, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-surface-elevated border border-border text-foreground font-medium">
                        {sk.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-[11px] text-foreground-muted">{job.vacancies} openings</span>
                <Link
                  href={`/private-jobs/${job.id}`}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-soft flex items-center gap-1 hover:bg-primary-hover"
                >
                  View & Apply <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
