'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'handbook-theme';
const THEME_EVENT = 'handbook-theme-change';

type Theme = 'light' | 'dark';

let currentTheme: Theme | null = null;
const listeners = new Set<() => void>();

function getPreferredTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

function notifyThemeChange(nextTheme: Theme) {
  currentTheme = nextTheme;
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      const nextTheme = event.newValue === 'dark' ? 'dark' : 'light';
      notifyThemeChange(nextTheme);
      applyTheme(nextTheme);
    }
  };
  const onThemeChange = () => {
    callback();
  };

  listeners.add(callback);
  window.addEventListener('storage', onStorage);
  window.addEventListener(THEME_EVENT, onThemeChange);
  mediaQuery.addEventListener('change', onThemeChange);

  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(THEME_EVENT, onThemeChange);
    mediaQuery.removeEventListener('change', onThemeChange);
  };
}

function getSnapshot() {
  if (typeof window === 'undefined') return null;
  return currentTheme ?? getPreferredTheme();
}

export default function DarkModeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, () => null);

  useEffect(() => {
    const resolvedTheme = getPreferredTheme();
    notifyThemeChange(resolvedTheme);
    applyTheme(resolvedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
      applyTheme(nextTheme);
      notifyThemeChange(nextTheme);
      window.dispatchEvent(new Event(THEME_EVENT));
    }
  };

  const isDark = theme === 'dark';

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={toggleTheme}
      aria-label={isDark ? 'Use light mode' : 'Use dark mode'}
      title={isDark ? 'Use light mode' : 'Use dark mode'}
      suppressHydrationWarning
    >
      {theme === null ? <span className="size-3.5" aria-hidden="true" /> : isDark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
    </Button>
  );
}
