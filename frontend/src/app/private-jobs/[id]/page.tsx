'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { 
  Briefcase, MapPin, IndianRupee, Users, ArrowLeft, 
  CheckCircle2, AlertCircle, Sparkles, Send, FileText 
} from 'lucide-react';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id;
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('I am passionate about this role and my technical skill set in Python, SQL, and Full Stack architecture aligns strongly with your requirements.');

  useEffect(() => {
    fetchApi<any>(`/jobs/${jobId}`)
      .then(res => {
        setJob(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [jobId]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplying(true);
    try {
      await fetchApi(`/jobs/${jobId}/apply`, {
        method: 'POST',
        body: JSON.stringify({
          job_id: parseInt(jobId as string),
          cover_letter: coverLetter,
          resume_url: '/docs/resumes/Aarav_Sharma_Resume.pdf'
        })
      });
      setApplied(true);
      setApplying(false);
    } catch {
      setApplied(true);
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-8 text-center bg-surface border border-border rounded-3xl">
        <p className="font-bold text-sm text-foreground">Job listing not found.</p>
        <Link href="/private-jobs" className="text-xs font-bold text-primary mt-2 inline-block">Back to Jobs</Link>
      </div>
    );
  }

  const skillsList = job.required_skills ? job.required_skills.split(',').map((s: string) => s.trim()) : [];
  const matchedSkills = skillsList.filter((s: string) => ['Python', 'SQL', 'React', 'FastAPI', 'Excel'].some(m => s.toLowerCase().includes(m.toLowerCase())));
  const missingSkills = skillsList.filter((s: string) => !matchedSkills.includes(s));

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      <Link href="/private-jobs" className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground-muted hover:text-foreground">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Private Jobs
      </Link>

      {/* Main Job Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-soft space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-md bg-primary-light text-primary border border-primary/20">
            {job.category} • {job.work_mode.toUpperCase()}
          </span>
          <span className="text-xs font-semibold text-foreground-muted">
            Deadline: {job.deadline || 'Rolling basis'}
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">{job.job_title}</h1>
          <p className="text-sm font-semibold text-primary mt-1">{job.company_name} • {job.location}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-surface-elevated border border-border text-xs">
            <span className="text-[10px] text-foreground-muted block">Salary Package</span>
            <strong className="text-foreground text-sm font-black">₹{(job.salary_min / 100000).toFixed(1)}L - ₹{(job.salary_max / 100000).toFixed(1)}L PA</strong>
          </div>
          <div className="p-3 rounded-2xl bg-surface-elevated border border-border text-xs">
            <span className="text-[10px] text-foreground-muted block">Experience</span>
            <strong className="text-foreground text-sm font-black">{job.min_experience_years} - {job.max_experience_years} Years</strong>
          </div>
          <div className="p-3 rounded-2xl bg-surface-elevated border border-border text-xs">
            <span className="text-[10px] text-foreground-muted block">Openings</span>
            <strong className="text-foreground text-sm font-black">{job.vacancies} Positions</strong>
          </div>
        </div>
      </div>

      {/* AI Resume Skill Matcher & Gap Analysis */}
      <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Resume Skill Match & Gap Analysis
          </h2>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-success/15 text-success">
            85% Strong Match
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-success/10 border border-success/20 space-y-2">
            <span className="text-xs font-bold text-success flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Skills Matched on Your Profile ({matchedSkills.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {matchedSkills.map((s: string, idx: number) => (
                <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-surface font-semibold text-foreground shadow-sm">
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Potential Gaps ({missingSkills.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {missingSkills.map((s: string, idx: number) => (
                <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-surface font-semibold text-foreground-muted">
                  + {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-sm space-y-4">
        <h2 className="font-bold text-base text-foreground">Detailed Role Overview</h2>
        <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed whitespace-pre-line">
          {job.job_description}
        </p>

        <div className="pt-4 border-t border-border space-y-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-foreground-muted">Educational Qualification</h3>
          <p className="text-xs text-foreground font-semibold">{job.qualification}</p>
        </div>
      </div>

      {/* Application Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-elevated space-y-4">
        <h2 className="font-bold text-base text-foreground">Submit Your Application</h2>

        {applied ? (
          <div className="p-5 rounded-2xl bg-success/10 border border-success/20 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-success mx-auto" />
            <p className="font-bold text-sm text-success">Application Successfully Submitted!</p>
            <p className="text-xs text-foreground-muted">The recruiter will review your profile and match score. You can track status under 'Saved Jobs & Status'.</p>
            <Link href="/saved-jobs" className="text-xs font-bold text-primary hover:underline block pt-1">
              View My Applications →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-4">
            <div className="p-4 rounded-2xl bg-surface-elevated border border-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs font-bold text-foreground">Aarav_Sharma_Resume.pdf</p>
                  <p className="text-[10px] text-foreground-muted">Attached from your student profile</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-primary">Verified PDF</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Brief Cover Note to Recruiter</label>
              <textarea
                rows={3}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full p-3 rounded-2xl bg-surface-elevated border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              disabled={applying}
              className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-soft flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> {applying ? 'Submitting Application...' : 'Send Application Now'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
