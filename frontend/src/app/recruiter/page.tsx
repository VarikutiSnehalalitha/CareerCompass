'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { 
  Users, Briefcase, Plus, CheckCircle2, Clock, 
  Calendar, FileText, ArrowRight, ShieldCheck 
} from 'lucide-react';

export default function RecruiterPortalPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchApi<any[]>('/recruiter/jobs'),
      fetchApi<any[]>('/recruiter/applications')
    ]).then(([jList, aList]) => {
      setJobs(jList || []);
      setApplicants(aList || []);
      setLoading(false);
    }).catch(() => {
      setJobs([
        { id: 1, job_title: 'Full Stack Software Engineer', category: 'IT and software development', vacancies: 8, location: 'Bangalore / Hybrid' },
        { id: 2, job_title: 'Data Analyst & BI Specialist', category: 'Data analytics', vacancies: 5, location: 'Mumbai / Pune' }
      ]);
      setApplicants([
        { id: 101, candidate_name: 'Aarav Sharma', candidate_email: 'student@careercompass.demo', match_score: 88.0, status: 'shortlisted', job_id: 1 },
        { id: 102, candidate_name: 'Priya Sundaram', candidate_email: 'priya.s@example.com', match_score: 82.0, status: 'applied', job_id: 1 }
      ]);
      setLoading(false);
    });
  }, []);

  const updateStatus = async (appId: number, status: string) => {
    try {
      await fetchApi(`/recruiter/application/${appId}/status?status=${status}`, { method: 'POST' });
      setApplicants(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-md bg-primary-light text-primary border border-primary/20">
              Recruiter Dashboard
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" /> Corporate Talent Suite
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">Talent Acquisition & Placements</h1>
          <p className="text-xs sm:text-sm text-foreground-muted">
            Manage your corporate listings, evaluate candidate skill-match scores, and schedule interviews.
          </p>
        </div>

        <Link
          href="/recruiter/post-job"
          className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-soft flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Post New Job
        </Link>
      </div>

      {/* Posted Listings */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Your Posted Job Listings ({jobs.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((j) => (
            <div key={j.id} className="p-5 rounded-2xl bg-surface border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-primary px-2 py-0.5 rounded bg-primary-light">
                  {j.category}
                </span>
                <span className="text-xs text-foreground-muted">{j.vacancies} Openings</span>
              </div>
              <h3 className="font-extrabold text-sm text-foreground">{j.job_title}</h3>
              <p className="text-xs text-foreground-muted">{j.location}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Candidate Applications */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Recent Candidate Applicants ({applicants.length})</h2>
        <div className="space-y-3">
          {applicants.map((a) => (
            <div
              key={a.id}
              className="p-5 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-foreground">{a.candidate_name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-success/15 text-success">
                    {a.match_score}% Skill Match
                  </span>
                </div>
                <p className="text-xs text-foreground-muted">{a.candidate_email}</p>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded inline-block ${
                  a.status === 'shortlisted' ? 'bg-success/20 text-success' : 'bg-primary-light text-primary'
                }`}>
                  Status: {a.status}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {a.status !== 'shortlisted' && (
                  <button
                    onClick={() => updateStatus(a.id, 'shortlisted')}
                    className="px-3.5 py-1.5 rounded-xl bg-success text-white text-xs font-bold shadow-sm"
                  >
                    Shortlist
                  </button>
                )}
                <button
                  onClick={() => updateStatus(a.id, 'interview_scheduled')}
                  className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow-sm"
                >
                  Schedule Interview
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
