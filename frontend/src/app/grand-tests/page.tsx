'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { 
  Award, Calendar, Clock, AlertCircle, ArrowRight, 
  CheckCircle2, ShieldCheck, Flame, Play 
} from 'lucide-react';

export default function GrandTestsPage() {
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const [pastGrandTests, setPastGrandTests] = useState<any[]>([]);

  useEffect(() => {
    fetchApi<any[]>('/tests/history/list')
      .then(res => {
        setPastGrandTests(res || []);
      })
      .catch(() => {});
  }, []);

  const launchGrandTest = async () => {
    setStarting(true);
    try {
      const res = await fetchApi<any>('/tests/start', {
        method: 'POST',
        body: JSON.stringify({
          test_type: 'grand_test',
          exam_id: 1, // SSC CGL default
          num_questions: 25
        })
      });
      router.push(`/practice-tests/${res.id}`);
    } catch {
      setStarting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-md bg-primary-light text-primary border border-primary/20">
              Exam Benchmark Engine
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
              <Award className="w-3.5 h-3.5" /> Full CBT Simulation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">Weekly Grand Test System</h1>
          <p className="text-xs sm:text-sm text-foreground-muted max-w-xl">
            Simulates the exact examination pattern with sectional navigation, negative marking, and real percentile ranking. Your study timetable adapts automatically after each test.
          </p>
        </div>

        <button
          onClick={launchGrandTest}
          disabled={starting}
          className="px-6 py-3.5 rounded-2xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-soft flex items-center gap-2 shrink-0"
        >
          <Play className="w-4 h-4 fill-current" /> {starting ? 'Generating Grand Test...' : 'Start Live Grand Test'}
        </button>
      </div>

      {/* Grand Test Schedule & Structure */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-surface border border-border space-y-2">
          <div className="w-9 h-9 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-foreground">Sunday Scheduled Window</h3>
          <p className="text-xs text-foreground-muted leading-relaxed">
            Every Sunday at 09:00 AM. Includes questions from completed topics, weak areas, and 10-year PYQ archives.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-surface border border-border space-y-2">
          <div className="w-9 h-9 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-foreground">Timed CBT Marking</h3>
          <p className="text-xs text-foreground-muted leading-relaxed">
            Strict negative marking (-0.50 for SSC, -0.25 for Banking, -0.33 for UPSC) and sectional countdown navigation.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-surface border border-border space-y-2">
          <div className="w-9 h-9 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-foreground">Dynamic Timetable Adaptation</h3>
          <p className="text-xs text-foreground-muted leading-relaxed">
            Weak topics scored below 50% are automatically injected into your upcoming week's revision buffer slots.
          </p>
        </div>
      </div>

      {/* Past Grand Tests History */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-soft space-y-4">
        <h2 className="font-bold text-base text-foreground">Past Grand Test Scorecards</h2>

        {pastGrandTests.length > 0 ? (
          <div className="space-y-3">
            {pastGrandTests.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-surface-elevated border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-bold text-sm text-foreground">{t.title}</h4>
                  <p className="text-xs text-foreground-muted">Accuracy: {t.accuracy_rate}% • Score: {t.total_score}/{t.max_score}</p>
                </div>
                <Link
                  href={`/practice-tests/${t.id}`}
                  className="px-4 py-2 rounded-xl bg-surface border border-border hover:bg-surface-elevated text-xs font-bold text-primary self-start sm:self-auto"
                >
                  View Detailed Analysis →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-surface-elevated border border-border text-center space-y-2">
            <p className="text-xs text-foreground-muted">You haven't completed any grand tests yet. Start your first simulation!</p>
          </div>
        )}
      </div>
    </div>
  );
}
