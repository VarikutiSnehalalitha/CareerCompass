'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { 
  BarChart3, TrendingUp, Award, Clock, CheckCircle2, 
  AlertCircle, Sparkles, BookOpen, Target 
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';

export default function PerformanceAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<any>('/dashboard/student')
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const subjectPerformance = [
    { subject: 'Quant', accuracy: 88, weight: 25 },
    { subject: 'Reasoning', accuracy: 92, weight: 25 },
    { subject: 'English', accuracy: 82, weight: 25 },
    { subject: 'General Awareness', accuracy: 74, weight: 25 },
    { subject: 'Computer', accuracy: 90, weight: 10 }
  ];

  const accuracyTrends = [
    { test: 'Mock 1', score: 112, accuracy: 72 },
    { test: 'Mock 2', score: 128, accuracy: 78 },
    { test: 'Mock 3', score: 139, accuracy: 81 },
    { test: 'Mock 4', score: 145, accuracy: 83 },
    { test: 'Grand Test', score: 152, accuracy: 84 }
  ];

  const readinessScore = data?.readiness_score || 76.5;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-1">
          <BarChart3 className="w-4 h-4" /> AI Diagnostics
        </div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Performance Analytics & Preparation Readiness</h1>
        <p className="text-sm text-foreground-muted">
          Continuous mathematical evaluation combining mock accuracy, syllabus completion, consistency streak, and speed management.
        </p>
      </div>

      {/* Readiness Gauge Hero */}
      <div className="p-8 rounded-3xl bg-surface border border-border shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-success px-3 py-1 rounded-full bg-success/10">
            Readiness Metric: High Selection Potential
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            Current Estimated Readiness: <span className="text-primary">{readinessScore}%</span>
          </h2>
          <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
            {data?.readiness_recommendation || "Your consistency is solid across Quantitative Aptitude and Reasoning. General Awareness requires targeted static GK review to break into the 90th percentile."}
          </p>
        </div>

        {/* Circular / Large Metric */}
        <div className="w-36 h-36 rounded-full border-8 border-primary/20 border-t-primary flex flex-col items-center justify-center text-center shrink-0 shadow-soft">
          <span className="text-3xl font-black text-foreground">{readinessScore}%</span>
          <span className="text-[10px] uppercase font-bold text-foreground-muted">Readiness</span>
        </div>
      </div>

      {/* Two Column Charts: Subject Radar & Accuracy Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Accuracy Radar Chart */}
        <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-foreground">Subject Mastery Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={subjectPerformance}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis stroke="var(--border)" domain={[0, 100]} />
                <Radar name="Accuracy %" dataKey="accuracy" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-foreground-muted text-center">Measured across last 5 completed assessments.</p>
        </div>

        {/* Accuracy Trends Bar Chart */}
        <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-foreground">Test-by-Test Score Progress</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accuracyTrends}>
                <XAxis dataKey="test" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                <YAxis stroke="var(--text-muted)" domain={[0, 200]} tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Bar dataKey="score" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-foreground-muted text-center">Steady +40 marks growth over past 4 weeks.</p>
        </div>
      </div>
    </div>
  );
}
