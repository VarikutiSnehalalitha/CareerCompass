'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeName, ThemeMode, BgIntensity } from '@/lib/types';
import { fetchApi } from '@/lib/api';

interface ThemeContextType {
  themeName: ThemeName;
  themeMode: ThemeMode;
  bgStyle: string;
  bgIntensity: BgIntensity;
  distractionFree: boolean;
  setThemeName: (name: ThemeName) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setBgStyle: (style: string) => void;
  setBgIntensity: (intensity: BgIntensity) => void;
  setDistractionFree: (val: boolean) => void;
  toggleMode: () => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeNameState] = useState<ThemeName>('nature');
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [bgStyle, setBgStyleState] = useState<string>('forest');
  const [bgIntensity, setBgIntensityState] = useState<BgIntensity>('balanced');
  const [distractionFree, setDistractionFreeState] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    // Read from localStorage on mount
    try {
      const savedTheme = localStorage.getItem('careercompass_theme_name') as ThemeName;
      const savedMode = localStorage.getItem('careercompass_theme_mode') as ThemeMode;
      const savedBg = localStorage.getItem('careercompass_bg_style');
      const savedIntensity = localStorage.getItem('careercompass_bg_intensity') as BgIntensity;

      if (savedTheme) setThemeNameState(savedTheme);
      if (savedMode) setThemeModeState(savedMode);
      if (savedBg) setBgStyleState(savedBg);
      if (savedIntensity) setBgIntensityState(savedIntensity);
    } catch (e) {
      console.warn('Could not read saved theme preferences:', e);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Apply attributes directly to root HTML document element
    const root = document.documentElement;
    root.setAttribute('data-theme', themeName);
    root.setAttribute('data-mode', themeMode);
    root.setAttribute('data-intensity', bgIntensity);
    root.setAttribute('data-distraction-free', distractionFree ? 'true' : 'false');

    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Persist in localStorage
    try {
      localStorage.setItem('careercompass_theme_name', themeName);
      localStorage.setItem('careercompass_theme_mode', themeMode);
      localStorage.setItem('careercompass_bg_style', bgStyle);
      localStorage.setItem('careercompass_bg_intensity', bgIntensity);
    } catch (e) {}

    // Async sync with backend if token exists
    const token = localStorage.getItem('careercompass_token');
    if (token) {
      fetchApi('/auth/preferences', {
        method: 'PUT',
        body: JSON.stringify({
          theme_name: themeName,
          theme_mode: themeMode,
          bg_style: bgStyle,
          bg_intensity: bgIntensity
        })
      }).catch(() => {});
    }
  }, [themeName, themeMode, bgStyle, bgIntensity, distractionFree, mounted]);

  const setThemeName = (name: ThemeName) => {
    setThemeNameState(name);
    // adjust default bg style if switching themes
    if (name === 'nature' && !['forest', 'mountains', 'botanical', 'minimal', 'plain'].includes(bgStyle)) {
      setBgStyleState('forest');
    } else if (name === 'galaxy' && !['nebula', 'starfield', 'galaxy', 'cosmic', 'plain'].includes(bgStyle)) {
      setBgStyleState('nebula');
    }
  };

  const setThemeMode = (mode: ThemeMode) => setThemeModeState(mode);
  const setBgStyle = (style: string) => setBgStyleState(style);
  const setBgIntensity = (intensity: BgIntensity) => setBgIntensityState(intensity);
  const setDistractionFree = (val: boolean) => setDistractionFreeState(val);

  const toggleMode = () => setThemeModeState(prev => prev === 'light' ? 'dark' : 'light');
  const toggleTheme = () => setThemeName(themeName === 'nature' ? 'galaxy' : 'nature');

  return (
    <ThemeContext.Provider value={{
      themeName,
      themeMode,
      bgStyle,
      bgIntensity,
      distractionFree,
      setThemeName,
      setThemeMode,
      setBgStyle,
      setBgIntensity,
      setDistractionFree,
      toggleMode,
      toggleTheme
    }}>
      <div 
        className={`bg-canvas-container min-h-screen transition-colors duration-300 ${
          distractionFree ? '' : (
            themeName === 'nature' 
              ? (bgStyle === 'mountains' ? 'theme-pattern-nature-mountains' : 'theme-pattern-nature-forest')
              : (bgStyle === 'starfield' ? 'theme-pattern-galaxy-starfield' : 'theme-pattern-galaxy-nebula')
          )
        }`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
