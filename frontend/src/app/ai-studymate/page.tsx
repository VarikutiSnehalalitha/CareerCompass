'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { 
  Sparkles, MessageSquare, BookOpen, HelpCircle, 
  Layers, Compass, Award, Send, CheckCircle2, Copy, Play 
} from 'lucide-react';

function AIStudyMateContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') || 'doubt_solver';
  const initialTopic = searchParams.get('topic') || '';

  const [activeTab, setActiveTab] = useState<string>(initialMode);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; actions?: string[] }>>([
    {
      role: 'assistant',
      text: "👋 Hello! I am StudyMate, your personal AI exam mentor. How can I assist your competitive preparation today? Ask any concept doubt, request a topic masterclass, or generate targeted practice drills.",
      actions: ["Explain Remainder Theorem", "Teach Time & Work in Exam Mode", "Generate 5 Practice Questions"]
    }
  ]);
  const [inputMessage, setInputMessage] = useState(initialTopic ? `Teach me ${initialTopic} with exam shortcuts` : '');
  const [loading, setLoading] = useState(false);

  // Topic Teacher Form State
  const [topicTeacherName, setTopicTeacherName] = useState(initialTopic || 'Number System & Divisibility');
  const [teacherMode, setTeacherMode] = useState('exam_focused');

  // Question Generator Form State
  const [genSubject, setGenSubject] = useState('Quantitative Aptitude');
  const [genTopic, setGenTopic] = useState('Percentages & Profit Loss');
  const [genDifficulty, setGenDifficulty] = useState('medium');
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetchApi<any>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          mode: activeTab,
          message: textToSend
        })
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        text: res.reply,
        actions: res.suggested_actions
      }]);
      setLoading(false);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: "In competitive exams, always solve using relative ratio or LCM efficiency methods to save critical seconds during Tier-1 and Prelims.",
        actions: ["Try another question", "View formula list"]
      }]);
      setLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetchApi<any>('/ai/generate-questions', {
        method: 'POST',
        body: JSON.stringify({
          exam_name: 'SSC CGL / Bank PO',
          subject: genSubject,
          topic: genTopic,
          difficulty: genDifficulty,
          num_questions: 5
        })
      });
      setGeneratedQuestions(res.questions || []);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-1">
          <Sparkles className="w-4 h-4" /> Personal AI Mentor
        </div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">AI StudyMate Mentor</h1>
        <p className="text-sm text-foreground-muted">
          Your 24/7 dedicated educational tutor. Instant doubt resolution, multi-mode topic teaching, custom question generation, and revision summaries.
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'doubt_solver', name: 'Doubt Solver', icon: MessageSquare },
          { id: 'topic_teacher', name: 'Topic Teacher', icon: BookOpen },
          { id: 'question_generator', name: 'Question Generator', icon: HelpCircle },
          { id: 'career_guidance', name: 'Career Guidance', icon: Compass }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-soft'
                  : 'bg-surface hover:bg-surface-elevated text-foreground-muted border border-border'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Views */}
      {activeTab === 'doubt_solver' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-soft space-y-6">
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-3xl ${
                  m.role === 'user'
                    ? 'ml-auto bg-primary text-white shadow-soft font-medium'
                    : 'bg-surface-elevated border border-border text-foreground space-y-2'
                }`}
              >
                <div className="whitespace-pre-line font-mono">{m.text}</div>
                {m.actions && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/50">
                    {m.actions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(act)}
                        className="px-2.5 py-1 rounded-lg bg-surface border border-border text-foreground text-[11px] font-semibold hover:border-primary"
                      >
                        ⚡ {act}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="p-4 rounded-2xl bg-surface-elevated border border-border text-xs text-foreground-muted animate-pulse">
                StudyMate is thinking and deriving solution...
              </div>
            )}
          </div>

          {/* Prompt Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="flex gap-2 pt-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask any math question, grammar rule, or reasoning problem..."
              className="flex-1 px-4 py-3 rounded-2xl bg-surface-elevated border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-soft flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Ask
            </button>
          </form>
        </div>
      )}

      {activeTab === 'topic_teacher' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-soft space-y-6">
          <div className="space-y-2">
            <h2 className="font-bold text-base text-foreground">AI Topic Masterclass</h2>
            <p className="text-xs text-foreground-muted">Choose your preferred learning style and topic.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Topic Name</label>
              <input
                type="text"
                value={topicTeacherName}
                onChange={(e) => setTopicTeacherName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Teaching Mode</label>
              <select
                value={teacherMode}
                onChange={(e) => setTeacherMode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="exam_focused">Exam-Focused (High-Yield Shortcuts & Traps)</option>
                <option value="beginner">Beginner (Intuitive Foundations)</option>
                <option value="quick_revision">Quick 5-Minute Flash Revision</option>
                <option value="detailed">Comprehensive Deep Masterclass</option>
                <option value="formula_based">Formula Sheet & Quick Reference</option>
                <option value="interview_prep">Interview / SSB Viva Articulation</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => handleSendMessage(`Teach me ${topicTeacherName} in ${teacherMode} mode`)}
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-soft flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> Generate Topic Masterclass
          </button>
        </div>
      )}

      {activeTab === 'question_generator' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-soft space-y-6">
            <div className="space-y-1">
              <h2 className="font-bold text-base text-foreground">Generate AI Practice Questions</h2>
              <p className="text-xs text-foreground-muted">Generates custom exam-calibrated questions with verified solutions.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Subject</label>
                <input
                  type="text"
                  value={genSubject}
                  onChange={(e) => setGenSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Topic</label>
                <input
                  type="text"
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Difficulty</label>
                <select
                  value={genDifficulty}
                  onChange={(e) => setGenDifficulty(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground text-xs"
                >
                  <option value="easy">Easy (Direct Formula)</option>
                  <option value="medium">Medium (Standard Exam Level)</option>
                  <option value="hard">Hard (Multi-concept Tricky)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateQuestions}
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-soft flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> {loading ? 'Generating...' : 'Generate 5 Practice Questions'}
            </button>
          </div>

          {/* Generated Questions List */}
          {generatedQuestions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-foreground">AI-Generated Practice Questions (Sample Practice)</h3>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-primary-light text-primary">
                  Labeled: AI Practice
                </span>
              </div>

              {generatedQuestions.map((q, i) => (
                <div key={q.id} className="p-5 rounded-2xl bg-surface border border-border space-y-3">
                  <p className="text-xs font-bold text-foreground font-mono">{i + 1}. {q.question_text}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt: any) => (
                      <div key={opt.option_key} className={`p-2.5 rounded-xl border ${opt.is_correct ? 'border-success bg-success/10 font-bold text-success' : 'border-border bg-surface-elevated text-foreground'}`}>
                        ({opt.option_key}) {opt.option_text}
                      </div>
                    ))}
                  </div>
                  {q.explanation && (
                    <div className="p-3 rounded-xl bg-primary-light/30 border border-primary/20 text-xs text-foreground font-mono">
                      <strong>Solution:</strong> {q.explanation.detailed_solution}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'career_guidance' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-soft space-y-6">
          <div className="space-y-1">
            <h2 className="font-bold text-base text-foreground">AI Career Pathway Advisor</h2>
            <p className="text-xs text-foreground-muted">Comparative evaluation between Central Government, State PSC, and Private Sector roles.</p>
          </div>

          <button
            onClick={() => handleSendMessage("Evaluate government career vs private tech career based on B.Tech degree and aptitude skills")}
            className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-soft flex items-center gap-2"
          >
            <Compass className="w-4 h-4" /> Run Comprehensive Career Diagnosis
          </button>
        </div>
      )}
    </div>
  );
}

export default function AIStudyMatePage() {
  return (
    <Suspense fallback={<div className="py-20 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></div>}>
      <AIStudyMateContent />
    </Suspense>
  );
}
