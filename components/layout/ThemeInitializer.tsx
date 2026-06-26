'use client';

import { useLayoutEffect } from 'react';

const STORAGE_KEY = 'handbook-theme';

type Theme = 'light' | 'dark';

function getPreferredTheme(): Theme {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export default function ThemeInitializer() {
  useLayoutEffect(() => {
    applyTheme(getPreferredTheme());
  }, []);

  return null;
}
