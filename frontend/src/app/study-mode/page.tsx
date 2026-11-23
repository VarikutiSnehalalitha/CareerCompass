'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/theme/ThemeProvider';
import { fetchApi } from '@/lib/api';
import { 
  Clock, Play, Pause, RotateCcw, CheckCircle2, 
  Sparkles, BookOpen, ArrowLeft, MessageSquare, Send, X, ShieldCheck 
} from 'lucide-react';

export default function StudyModePage() {
  const { setDistractionFree } = useTheme();

  // Focus Timer
  const [timerSeconds, setTimerSeconds] = useState<number>(25 * 60); // 25 min Pomodoro
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showAiDrawer, setShowAiDrawer] = useState<boolean>(false);
  const [aiQuestion, setAiQuestion] = useState<string>('');
  const [aiReply, setAiReply] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  // Automatically enable distraction-free theme mode
  useEffect(() => {
    setDistractionFree(true);
    return () => setDistractionFree(false);
  }, [setDistractionFree]);

  // Timer Tick
  useEffect(() => {
    if (!isRunning || timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          setCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = (mins: number = 25) => {
    setIsRunning(false);
    setTimerSeconds(mins * 60);
    setCompleted(false);
  };

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleAskDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetchApi<any>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ mode: 'doubt_solver', message: aiQuestion })
      });
      setAiReply(res.reply);
      setAiLoading(false);
    } catch {
      setAiReply('A percentage is a fraction out of 100. Profit % is always calculated on the Cost Price: (Profit / CP) * 100.');
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Top Controls */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-xs font-bold text-foreground-muted hover:text-foreground"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Dashboard
        </Link>
        <span className="text-[11px] font-bold text-success bg-success/10 px-3 py-1 rounded-full flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> Distraction-Free Study Mode Active
        </span>
      </div>

      {/* Focus Timer Card */}
      <div className="p-8 rounded-3xl bg-surface border border-border shadow-soft text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Focus Session Timer</span>
        <div className="text-6xl font-black font-mono tracking-tight text-foreground">{timeStr}</div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={toggleTimer}
            className={`px-6 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-soft ${
              isRunning ? 'bg-danger text-white' : 'bg-primary text-white'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            {isRunning ? 'Pause Timer' : 'Start Focus Session'}
          </button>
          <button
            onClick={() => resetTimer(25)}
            className="px-4 py-2.5 rounded-2xl border border-border bg-surface-elevated hover:bg-surface text-foreground text-xs font-semibold"
          >
            25m Pomodoro
          </button>
          <button
            onClick={() => resetTimer(50)}
            className="px-4 py-2.5 rounded-2xl border border-border bg-surface-elevated hover:bg-surface text-foreground text-xs font-semibold"
          >
            50m Deep Block
          </button>
        </div>

        {completed && (
          <div className="p-3 rounded-2xl bg-success/10 border border-success/20 text-xs font-bold text-success">
            🎉 Focus session completed! Great discipline!
          </div>
        )}
      </div>

      {/* High-Yield Study Sheet */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div>
            <span className="text-xs font-bold uppercase text-primary tracking-wider">Active Topic</span>
            <h2 className="text-xl font-black text-foreground">Quantitative Aptitude: Number System & Divisibility</h2>
          </div>
          <button
            onClick={() => setShowAiDrawer(!showAiDrawer)}
            className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-soft flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" /> Ask AI StudyMate
          </button>
        </div>

        {/* Notes Content */}
        <div className="p-5 rounded-2xl bg-surface-elevated border border-border text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-line font-mono">
          {`### Essential Rules for Number System & Divisibility:
1. Divisibility by 7, 11, 13:
   - Make blocks of 3 digits from right to left.
   - Alternate sum of blocks is divisible by 7, 11, or 13.
2. Number of Trailing Zeros:
   - In n!, count factors of 5: [n/5] + [n/25] + [n/125] + ...
3. Cyclicity of Last Digits:
   - Powers of 2, 3, 7, 8 repeat every 4th power.
   - Powers of 4 and 9 repeat every 2nd power.`}
        </div>
      </div>

      {/* In-Session AI Doubt Drawer */}
      {showAiDrawer && (
        <div className="p-6 rounded-3xl bg-surface border-2 border-primary/40 shadow-elevated space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <span className="text-xs font-bold uppercase text-primary flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> StudyMate AI Doubt Solver (In-Study)
            </span>
            <button onClick={() => setShowAiDrawer(false)} className="text-foreground-muted hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleAskDoubt} className="flex gap-2">
            <input
              type="text"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              placeholder="Ask any concept doubt (e.g., 'How to find remainder of 7^84 / 342?')..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={aiLoading}
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-soft flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" /> Ask
            </button>
          </form>

          {aiLoading ? (
            <p className="text-xs text-foreground-muted animate-pulse">StudyMate is preparing step-by-step solution...</p>
          ) : aiReply && (
            <div className="p-4 rounded-2xl bg-primary-light/40 border border-primary/20 text-xs text-foreground whitespace-pre-line font-mono leading-relaxed">
              {aiReply}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
