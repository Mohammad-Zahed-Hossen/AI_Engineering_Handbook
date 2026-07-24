export interface CommandPaletteItem {
  id: string;
  label: string;
  description?: string;
  href: string;
  type: string;
  pinned?: boolean;
  recent?: boolean;
  favorite?: boolean;
}

const RECENT_KEY = 'aens-recent-searches';
const PINNED_KEY = 'aens-pinned';
const FAVORITES_KEY = 'aens-favorites';
const MAX_RECENT = 8;

export function loadRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRecentSearch(query: string) {
  if (typeof window === 'undefined') return;
  const trimmed = query.trim().toLowerCase();
  if (!trimmed || trimmed.length < 2) return;
  const existing = loadRecentSearches();
  const next = [trimmed, ...existing.filter(s => s !== trimmed)];
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next.slice(0, MAX_RECENT)));
  } catch {
    // ignore storage errors
  }
}

export function loadPinned(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(PINNED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function togglePinned(id: string) {
  if (typeof window === 'undefined') return;
  const current = loadPinned();
  const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
  try {
    window.localStorage.setItem(PINNED_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

export function loadFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(id: string) {
  if (typeof window === 'undefined') return;
  const current = loadFavorites();
  const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
  try {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

export function rankItems(items: CommandPaletteItem[]): CommandPaletteItem[] {
  const pinned = new Set(loadPinned());
  const favorites = new Set(loadFavorites());
  const recent = new Set(loadRecentSearches());

  return [...items].sort((a, b) => {
    const aPinned = pinned.has(a.id) ? 1 : 0;
    const bPinned = pinned.has(b.id) ? 1 : 0;
    if (aPinned !== bPinned) return bPinned - aPinned;

    const aFav = favorites.has(a.id) ? 1 : 0;
    const bFav = favorites.has(b.id) ? 1 : 0;
    if (aFav !== bFav) return bFav - aFav;

    const aRecent = recent.has(a.id) ? 1 : 0;
    const bRecent = recent.has(b.id) ? 1 : 0;
    if (aRecent !== bRecent) return bRecent - aRecent;

    return a.label.localeCompare(b.label);
  });
}