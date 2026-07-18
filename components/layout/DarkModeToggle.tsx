'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPreferredTheme, applyTheme, toggleTheme, STORAGE_KEY, THEME_EVENT, type Theme } from '@/lib/theme';

let currentTheme: Theme | null = null;
const listeners = new Set<() => void>();

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
  if (typeof window === 'undefined') return 'light';
  return currentTheme ?? getPreferredTheme();
}

export default function DarkModeToggle() {
  const theme = useSyncExternalStore<Theme>(subscribe, getSnapshot, () => 'light');

  useEffect(() => {
    const resolvedTheme = getPreferredTheme();
    notifyThemeChange(resolvedTheme);
  }, []);

  const handleToggle = () => {
    const nextTheme = toggleTheme(theme);
    notifyThemeChange(nextTheme);
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  const isDark = theme === 'dark';

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={handleToggle}
      className="h-11 w-11 touch-target shrink-0"
      aria-label={isDark ? 'Use light mode' : 'Use dark mode'}
      title={isDark ? 'Use light mode' : 'Use dark mode'}
      suppressHydrationWarning
    >
      {isDark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
    </Button>
  );
}
