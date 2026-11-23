'use client';

import React from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { 
  Sun, Moon, Trees, Sparkles, Check, Sliders, 
  Eye, ShieldCheck, Palette, Layers, Minimize2 
} from 'lucide-react';

export default function ThemeSettingsPage() {
  const { 
    themeName, themeMode, bgStyle, bgIntensity, distractionFree,
    setThemeName, setThemeMode, setBgStyle, setBgIntensity, setDistractionFree 
  } = useTheme();

  const natureBackgrounds = [
    { id: 'forest', name: 'Forest Landscape', desc: 'Calm organic gradients with subtle forest canopy textures.' },
    { id: 'mountains', name: 'Misty Mountains', desc: 'Serene mountain ridgelines for deep focus and stability.' },
    { id: 'botanical', name: 'Botanical Patterns', desc: 'Minimal leaf textures and peaceful natural accents.' },
    { id: 'minimal', name: 'Minimal Nature', desc: 'Very gentle warm ivory & olive organic hues.' },
    { id: 'plain', name: 'Plain Natural Surface', desc: 'Clean distraction-free warm parchment surface.' },
  ];

  const galaxyBackgrounds = [
    { id: 'nebula', name: 'Nebula Cloudscape', desc: 'Soft violet and indigo cosmic dust gradients.' },
    { id: 'starfield', name: 'Starfield Pattern', desc: 'Subtle twinkling celestial stars on deep space.' },
    { id: 'galaxy', name: 'Galaxy Spiral', desc: 'Futuristic cosmic exploration atmosphere.' },
    { id: 'cosmic', name: 'Cosmic Gradient', desc: 'Muted purple and starlight lavender blends.' },
    { id: 'plain', name: 'Plain Cosmic Canvas', desc: 'Pure midnight or lavender-white clean surface.' },
  ];

  const currentBgOptions = themeName === 'nature' ? natureBackgrounds : galaxyBackgrounds;

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-1">
          <Palette className="w-4 h-4" /> Visual Identity & Personalization
        </div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Theme & Appearance Settings</h1>
        <p className="text-sm text-foreground-muted">
          Customize your study environment. Choose between the peaceful organic <strong>Nature</strong> theme or the inspiring futuristic <strong>Galaxy</strong> theme in both Light and Dark modes.
        </p>
      </div>

      {/* 1. Appearance Mode Selector (Light vs Dark) */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span>1. Appearance Mode</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Light Mode Card */}
          <div
            onClick={() => setThemeMode('light')}
            className={`cursor-pointer p-5 rounded-2xl border-2 transition-all relative ${
              themeMode === 'light'
                ? 'border-primary bg-surface shadow-elevated'
                : 'border-border bg-surface-elevated/60 hover:bg-surface'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">Light Mode</h3>
                  <p className="text-xs text-foreground-muted">Daylight study clarity</p>
                </div>
              </div>
              {themeMode === 'light' && (
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Warm ivory, soft cream, and high-contrast typography optimized for bright ambient conditions.
            </p>
            {/* Miniature Preview */}
            <div className="mt-4 p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-2">
              <div className="w-20 h-2 rounded bg-[#2D5A27]" />
              <div className="w-32 h-2 rounded bg-[#D4A373]/50" />
            </div>
          </div>

          {/* Dark Mode Card */}
          <div
            onClick={() => setThemeMode('dark')}
            className={`cursor-pointer p-5 rounded-2xl border-2 transition-all relative ${
              themeMode === 'dark'
                ? 'border-primary bg-surface shadow-elevated'
                : 'border-border bg-surface-elevated/60 hover:bg-surface'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">Dark Mode</h3>
                  <p className="text-xs text-foreground-muted">Night-time eye comfort</p>
                </div>
              </div>
              {themeMode === 'dark' && (
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Deep moss or midnight purple hues designed for long late-night study sessions without glare.
            </p>
            {/* Miniature Preview */}
            <div className="mt-4 p-3 rounded-xl bg-[#121A13] border border-[#2C3E30] space-y-2">
              <div className="w-20 h-2 rounded bg-[#52B788]" />
              <div className="w-32 h-2 rounded bg-[#74A57F]/50" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Visual Theme Selector (Nature vs Galaxy) */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span>2. Visual Theme</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nature Theme Card */}
          <div
            onClick={() => setThemeName('nature')}
            className={`cursor-pointer p-5 rounded-2xl border-2 transition-all relative ${
              themeName === 'nature'
                ? 'border-primary bg-surface shadow-elevated'
                : 'border-border bg-surface-elevated/60 hover:bg-surface'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Trees className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">Nature Theme</h3>
                  <p className="text-xs text-foreground-muted">Calm, Fresh & Organic</p>
                </div>
              </div>
              {themeName === 'nature' && (
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Inspired by lush forests, mist-covered mountains, and botanical calm. Uses sage, forest emerald, and warm ochre accents.
            </p>
            <div className="mt-4 p-3 rounded-xl bg-primary-light border border-primary/20 flex items-center justify-between text-xs">
              <span className="font-semibold text-primary">Active Mode: {themeMode.toUpperCase()}</span>
              <span className="text-[11px] font-bold text-foreground-muted">Nature {themeMode === 'light' ? 'Light' : 'Dark'}</span>
            </div>
          </div>

          {/* Galaxy Theme Card */}
          <div
            onClick={() => setThemeName('galaxy')}
            className={`cursor-pointer p-5 rounded-2xl border-2 transition-all relative ${
              themeName === 'galaxy'
                ? 'border-primary bg-surface shadow-elevated'
                : 'border-border bg-surface-elevated/60 hover:bg-surface'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">Galaxy Theme</h3>
                  <p className="text-xs text-foreground-muted">Futuristic, Cosmic & Inspiring</p>
                </div>
              </div>
              {themeName === 'galaxy' && (
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Inspired by space exploration, nebulae, and stellar constellations. Uses cosmic indigo, soft lavender, and starlight coral accents.
            </p>
            <div className="mt-4 p-3 rounded-xl bg-primary-light border border-primary/20 flex items-center justify-between text-xs">
              <span className="font-semibold text-primary">Active Mode: {themeMode.toUpperCase()}</span>
              <span className="text-[11px] font-bold text-foreground-muted">Galaxy {themeMode === 'light' ? 'Light' : 'Dark'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Background Texture & Pattern Picker */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            <span>3. Background Style ({themeName === 'nature' ? 'Nature Options' : 'Galaxy Options'})</span>
          </h2>
          <span className="text-xs text-foreground-muted font-medium">Auto-persisted</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {currentBgOptions.map((bg) => (
            <div
              key={bg.id}
              onClick={() => setBgStyle(bg.id)}
              className={`cursor-pointer p-4 rounded-xl border transition-all text-left ${
                bgStyle === bg.id
                  ? 'border-primary bg-primary-light/30 shadow-sm'
                  : 'border-border bg-surface hover:bg-surface-elevated'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-foreground">{bg.name}</span>
                {bgStyle === bg.id && <Check className="w-3.5 h-3.5 text-primary" />}
              </div>
              <p className="text-[11px] text-foreground-muted">{bg.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Background Intensity Slider & Distraction-Free Toggle */}
      <section className="space-y-5 p-6 rounded-2xl border border-border bg-surface">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" /> Background Texture Intensity
            </h3>
            <span className="text-xs font-bold uppercase text-primary px-2 py-0.5 rounded bg-primary-light">
              {bgIntensity}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-2">
            {(['subtle', 'balanced', 'immersive'] as const).map((intensity) => (
              <button
                key={intensity}
                onClick={() => setBgIntensity(intensity)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                  bgIntensity === intensity
                    ? 'border-primary bg-primary text-white shadow-soft'
                    : 'border-border bg-surface-elevated hover:bg-surface text-foreground'
                }`}
              >
                {intensity}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
              <Minimize2 className="w-4 h-4 text-primary" /> Distraction-Free Focus Mode
            </h4>
            <p className="text-xs text-foreground-muted">Automatically mutes decorative backgrounds during exams & timed practice.</p>
          </div>
          <button
            onClick={() => setDistractionFree(!distractionFree)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              distractionFree ? 'bg-primary' : 'bg-border'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
              distractionFree ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
      </section>

      {/* 5. Live Theme Preview Card */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Eye className="w-5 h-5 text-primary" />
          <span>Live Theme Component Preview</span>
        </h2>
        <div className="p-6 rounded-3xl border border-border bg-surface shadow-elevated space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Live Reactivity</span>
              <h3 className="text-base font-extrabold text-foreground">
                Currently Active: {themeName === 'nature' ? '🌿 Nature' : '✨ Galaxy'} {themeMode === 'light' ? 'Light' : 'Dark'}
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-success/15 text-success">
              WCAG Compliant
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-soft">
              Primary Action
            </button>
            <button className="px-4 py-2 rounded-xl bg-secondary text-white text-xs font-bold">
              Secondary Action
            </button>
            <button className="px-4 py-2 rounded-xl border border-border bg-surface-elevated text-foreground text-xs font-bold">
              Outlined Card Action
            </button>
            <span className="px-3 py-1 rounded-full bg-accent/20 text-accent font-bold text-xs">
              Accent Badge
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
