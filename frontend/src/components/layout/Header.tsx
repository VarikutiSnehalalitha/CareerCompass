'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/theme/ThemeProvider';
import { fetchApi } from '@/lib/api';
import { 
  Compass, Search, Sun, Moon, Sparkles, Trees, 
  Bell, User as UserIcon, CheckCircle2, ChevronDown, 
  ShieldCheck, Briefcase, GraduationCap 
} from 'lucide-react';

export function Header() {
  const router = useRouter();
  const { themeName, themeMode, toggleMode, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>({
    full_name: 'Aarav Sharma',
    role: 'student',
    email: 'student@careercompass.demo'
  });

  useEffect(() => {
    // Load notifications & user
    fetchApi<any[]>('/auth/notifications').then(data => {
      if (data && data.length) setNotifications(data);
    }).catch(() => {
      setNotifications([
        { id: 1, title: 'SSC CGL 2026 Notification Released', message: 'Application window closing in 14 days.', link_url: '/exams/1' },
        { id: 2, title: 'Weekly Grand Test #2 Ready', message: 'Sunday full simulation scheduled for 09:00 AM.', link_url: '/grand-tests' }
      ]);
    });

    fetchApi<any>('/auth/me').then(u => {
      if (u) setCurrentUser(u);
    }).catch(() => {});
  }, []);

  const handleDemoSwitch = async (role: 'student' | 'recruiter' | 'admin') => {
    try {
      const data = await fetchApi<any>(`/auth/demo-login/${role}`, { method: 'POST' });
      localStorage.setItem('careercompass_token', data.access_token);
      setCurrentUser(data.user);
      setShowUserDropdown(false);
      if (role === 'student') router.push('/dashboard');
      else if (role === 'recruiter') router.push('/recruiter');
      else if (role === 'admin') router.push('/admin');
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/exams?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/85 backdrop-blur-md px-4 sm:px-6 py-3 transition-colors duration-200">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Brand Logo & Mobile Trigger */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft transition-transform group-hover:scale-105">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-foreground">CareerCompass</span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {themeName === 'nature' ? '🌿 Nature' : '✨ Galaxy'}
                </span>
              </div>
              <p className="text-[11px] text-foreground-muted hidden sm:block">Exam Prep, Jobs & AI Mentor</p>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exams, govt jobs, PYQs, syllabi..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm bg-surface-elevated border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-foreground-muted"
          />
        </form>

        {/* Right: Theme Switcher & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle (Nature <-> Galaxy) */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${themeName === 'nature' ? 'Galaxy' : 'Nature'} Theme`}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-border bg-surface-elevated hover:bg-surface flex items-center gap-1.5 text-xs font-semibold text-foreground shadow-sm"
          >
            {themeName === 'nature' ? (
              <>
                <Trees className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Nature</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="hidden sm:inline">Galaxy</span>
              </>
            )}
          </button>

          {/* Mode Toggle (Light <-> Dark) */}
          <button
            onClick={toggleMode}
            title={`Switch to ${themeMode === 'light' ? 'Dark' : 'Light'} Mode`}
            className="p-2 rounded-xl border border-border bg-surface-elevated hover:bg-surface text-foreground shadow-sm"
          >
            {themeMode === 'light' ? (
              <Moon className="w-4 h-4 text-indigo-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative p-2 rounded-xl border border-border bg-surface-elevated hover:bg-surface text-foreground shadow-sm"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger animate-ping" />
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-surface border border-border shadow-elevated p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-border mb-2">
                  <h4 className="font-bold text-sm text-foreground">Notifications</h4>
                  <span className="text-[11px] text-foreground-muted">{notifications.length} alerts</span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <Link
                      key={n.id}
                      href={n.link_url || '#'}
                      onClick={() => setShowNotifDropdown(false)}
                      className="block p-2 rounded-lg bg-surface-elevated hover:bg-primary-light transition-colors text-left"
                    >
                      <p className="text-xs font-semibold text-foreground">{n.title}</p>
                      <p className="text-[11px] text-foreground-muted line-clamp-2">{n.message}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Demo Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-border bg-surface-elevated hover:bg-surface text-foreground shadow-sm"
            >
              <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                {currentUser?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold leading-tight text-foreground truncate max-w-[100px]">{currentUser?.full_name}</p>
                <p className="text-[10px] text-foreground-muted capitalize">{currentUser?.role}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-foreground-muted" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-surface border border-border shadow-elevated p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="pb-2.5 border-b border-border mb-2.5">
                  <p className="font-bold text-sm text-foreground">{currentUser?.full_name}</p>
                  <p className="text-xs text-foreground-muted">{currentUser?.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-primary-light text-primary">
                    Active: {currentUser?.role}
                  </span>
                </div>

                {/* Instant Try Demo Switcher */}
                <div className="space-y-1 mb-2.5">
                  <p className="text-[10px] font-bold uppercase text-foreground-muted px-1 tracking-wider">Switch Demo Persona</p>
                  <button
                    onClick={() => handleDemoSwitch('student')}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors ${
                      currentUser?.role === 'student' ? 'bg-primary text-white' : 'hover:bg-surface-elevated text-foreground'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    Student Persona (Aarav)
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('recruiter')}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors ${
                      currentUser?.role === 'recruiter' ? 'bg-primary text-white' : 'hover:bg-surface-elevated text-foreground'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    Recruiter Persona (Pooja)
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('admin')}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors ${
                      currentUser?.role === 'admin' ? 'bg-primary text-white' : 'hover:bg-surface-elevated text-foreground'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin Persona (Dr. Rajesh)
                  </button>
                </div>

                <div className="border-t border-border pt-2 flex flex-col gap-1 text-xs">
                  <Link
                    href="/theme-settings"
                    onClick={() => setShowUserDropdown(false)}
                    className="p-1.5 rounded-lg hover:bg-surface-elevated text-foreground font-medium"
                  >
                    🎨 Theme & Background Settings
                  </Link>
                  <Link
                    href="/study-mode"
                    onClick={() => setShowUserDropdown(false)}
                    className="p-1.5 rounded-lg hover:bg-surface-elevated text-foreground font-medium"
                  >
                    🎯 Distraction-Free Study Mode
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
