'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { 
  Bookmark, Briefcase, Calendar, CheckCircle2, 
  Clock, ArrowRight, ExternalLink 
} from 'lucide-react';

export default function SavedJobsAndApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchApi<any[]>('/jobs/applications/my'),
      fetchApi<any[]>('/questions/bookmarks')
    ]).then(([apps, bms]) => {
      setApplications(apps || []);
      setBookmarks(bms || []);
      setLoading(false);
    }).catch(() => {
      // Fallback sample data
      setApplications([
        {
          id: 1,
          job: {
            job_title: "Full Stack Software Engineer",
            company_name: "CloudScale Systems",
            location: "Bangalore / Hybrid",
            salary_max: 1400000
          },
          status: "shortlisted",
          match_score: 88.0,
          created_at: "2026-06-15"
        },
        {
          id: 2,
          job: {
            job_title: "Data Analyst & Business Intelligence Specialist",
            company_name: "Bharat FinTech Innovations",
            location: "Mumbai / Pune",
            salary_max: 1100000
          },
          status: "applied",
          match_score: 82.0,
          created_at: "2026-06-18"
        }
      ]);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-1">
          <Bookmark className="w-4 h-4" /> Career Portfolio Tracking
        </div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Saved Jobs & Application Status</h1>
        <p className="text-sm text-foreground-muted">
          Real-time tracking of private job applications, shortlist decisions, interview invitations, and bookmarked questions.
        </p>
      </div>

      {/* Applications Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Submitted Job Applications ({applications.length})</h2>

        {loading ? (
          <div className="py-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="p-8 text-center bg-surface border border-border rounded-3xl">
            <p className="text-xs text-foreground-muted">No applications submitted yet. Browse jobs in the Private Placement Portal!</p>
            <Link href="/private-jobs" className="text-xs font-bold text-primary mt-2 inline-block">Explore Jobs →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-3xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      app.status === 'shortlisted' ? 'bg-success/15 text-success' : 'bg-primary-light text-primary'
                    }`}>
                      {app.status.toUpperCase()}
                    </span>
                    <span className="text-[11px] text-foreground-muted">Match Score: {app.match_score}%</span>
                  </div>
                  <h3 className="font-extrabold text-base text-foreground">{app.job?.job_title}</h3>
                  <p className="text-xs text-foreground-muted">{app.job?.company_name} • {app.job?.location}</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {app.status === 'shortlisted' && (
                    <span className="text-xs font-bold text-success flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Recruiter Shortlisted
                    </span>
                  )}
                  <Link
                    href={`/private-jobs/${app.job_id || 1}`}
                    className="px-4 py-2 rounded-xl bg-surface-elevated hover:bg-surface border border-border text-xs font-bold text-foreground"
                  >
                    View Job Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
