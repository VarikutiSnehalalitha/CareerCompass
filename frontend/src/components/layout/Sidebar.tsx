'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Compass, Landmark, Briefcase, BookOpen, 
  FileText, CheckSquare, Award, Calendar, Sparkles, 
  BarChart3, Bookmark, Palette, Target, Shield, Users
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Explore Exams', href: '/exams', icon: Compass },
  { name: 'Government Jobs', href: '/government-jobs', icon: Landmark },
  { name: 'Private Jobs', href: '/private-jobs', icon: Briefcase },
  { name: 'Syllabus Explorer', href: '/syllabus', icon: BookOpen },
  { name: 'Question Papers (PYQ)', href: '/question-papers', icon: FileText },
  { name: 'Practice Tests', href: '/practice-tests', icon: CheckSquare },
  { name: 'Weekly Grand Tests', href: '/grand-tests', icon: Award },
  { name: 'Study Planner', href: '/study-planner', icon: Calendar },
  { name: 'Focus Study Mode', href: '/study-mode', icon: Target },
  { name: 'AI StudyMate', href: '/ai-studymate', icon: Sparkles },
  { name: 'Performance Analytics', href: '/performance', icon: BarChart3 },
  { name: 'Saved Jobs & Status', href: '/saved-jobs', icon: Bookmark },
  { name: 'Theme Settings', href: '/theme-settings', icon: Palette },
  { name: 'Recruiter Portal', href: '/recruiter', icon: Users },
  { name: 'Admin Workflow', href: '/admin', icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-surface/75 backdrop-blur-sm hidden md:flex flex-col shrink-0 min-h-[calc(100vh-65px)] p-4 transition-colors duration-200">
      <nav className="space-y-1.5 flex-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-soft scale-[1.01]'
                  : 'text-foreground-muted hover:bg-surface-elevated hover:text-foreground'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-primary'}`} />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Preparation Status Card */}
      <div className="mt-4 p-3.5 rounded-2xl bg-surface-elevated border border-border shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-foreground">Active Goal: SSC CGL</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-success/15 text-success font-bold">Tier-1</span>
        </div>
        <div className="w-full bg-border/40 h-2 rounded-full overflow-hidden mb-1.5">
          <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: '68%' }} />
        </div>
        <p className="text-[10px] text-foreground-muted">68% Syllabus Mastery • 65 days left</p>
      </div>
    </aside>
  );
}
