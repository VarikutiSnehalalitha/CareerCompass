'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { Briefcase, ArrowLeft, Send } from 'lucide-react';

export default function PostJobPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    company_name: 'Apex Technology Innovations',
    job_title: '',
    category: 'IT and software development',
    required_skills: '',
    qualification: "Bachelor's Degree in CS/IT or Engineering",
    min_experience_years: 0,
    max_experience_years: 3,
    salary_min: 600000,
    salary_max: 1200000,
    location: 'Bangalore / Remote',
    work_mode: 'hybrid',
    vacancies: 5,
    job_description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetchApi('/recruiter/post-job', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      router.push('/recruiter');
    } catch {
      router.push('/recruiter');
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-16">
      <Link href="/recruiter" className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground-muted hover:text-foreground">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Recruiter Dashboard
      </Link>

      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-soft space-y-6">
        <div>
          <span className="text-xs font-bold uppercase text-primary tracking-wider">Corporate Recruitment</span>
          <h1 className="text-2xl font-black text-foreground mt-1">Post a New Job Opening</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-foreground">Job Title</label>
              <input
                type="text"
                required
                value={formData.job_title}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                placeholder="e.g. Associate Backend Engineer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="IT and software development">IT and Software Development</option>
                <option value="Data analytics">Data Analytics</option>
                <option value="AI and machine learning">AI and Machine Learning</option>
                <option value="Freshers">Freshers / Campus Placement</option>
                <option value="Engineering">Core Engineering</option>
              </select>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-foreground">Required Skills (Comma separated)</label>
              <input
                type="text"
                required
                value={formData.required_skills}
                onChange={(e) => setFormData({ ...formData, required_skills: e.target.value })}
                placeholder="Python, SQL, React, FastAPI, Docker"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Minimum Salary (₹ PA)</label>
              <input
                type="number"
                value={formData.salary_min}
                onChange={(e) => setFormData({ ...formData, salary_min: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Maximum Salary (₹ PA)</label>
              <input
                type="number"
                value={formData.salary_max}
                onChange={(e) => setFormData({ ...formData, salary_max: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-foreground">Job Description & Responsibilities</label>
            <textarea
              rows={4}
              required
              value={formData.job_description}
              onChange={(e) => setFormData({ ...formData, job_description: e.target.value })}
              placeholder="Outline daily duties, engineering stack, and growth opportunities..."
              className="w-full p-3 rounded-xl bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-soft flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> {submitting ? 'Publishing...' : 'Publish Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}
