const STORAGE_KEY = 'handbook-theme';
const THEME_EVENT = 'handbook-theme-change';

export type Theme = 'light' | 'dark';

export function getPreferredTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function toggleTheme(theme: Theme) {
  const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!prefersReducedMotion) {
    // Add transition class for smooth cross-fade
    document.documentElement.classList.add('theme-transitioning');
  }
  
  window.localStorage.setItem(STORAGE_KEY, nextTheme);
  applyTheme(nextTheme);
  
  if (!prefersReducedMotion) {
    // Remove transition class after animation completes
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 200);
  }
  
  return nextTheme;
}

export { STORAGE_KEY, THEME_EVENT };
