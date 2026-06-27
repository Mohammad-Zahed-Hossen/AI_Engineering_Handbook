'use client';

const RECENT_KNOWLEDGE_KEY = 'aens-recent-knowledge';
const CONTINUE_READING_KEY = 'aens-continue-reading';
const MAX_RECENT = 8;

export interface RecentItem {
  href: string;
  name: string;
  type: string;
  category?: string;
  timestamp: number;
}

export function recordPageVisit(href: string, name: string, type: string, category?: string) {
  if (typeof window === 'undefined') return;
  try {
    const item: RecentItem = { href, name, type, category, timestamp: Date.now() };

    // Update recent knowledge
    const existing = getRecentKnowledge();
    const filtered = existing.filter(r => r.href !== href);
    const next = [item, ...filtered].slice(0, MAX_RECENT);
    window.localStorage.setItem(RECENT_KNOWLEDGE_KEY, JSON.stringify(next));

    // Update continue reading
    window.localStorage.setItem(CONTINUE_READING_KEY, JSON.stringify(item));
  } catch {
    // Storage full or disabled
  }
}

export function getRecentKnowledge(): RecentItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KNOWLEDGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getContinueReading(): RecentItem | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CONTINUE_READING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearRecentKnowledge() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(RECENT_KNOWLEDGE_KEY);
}

export function clearContinueReading() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(CONTINUE_READING_KEY);
}
