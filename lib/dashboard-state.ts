'use client';

// Dashboard state version for future migrations
const DASHBOARD_VERSION = 1;
const DASHBOARD_KEY = 'aens-dashboard';

// Content types supported for favorites/history
export type ContentType = 
  | 'package' 
  | 'model' 
  | 'workflow' 
  | 'cheatsheet' 
  | 'pattern' 
  | 'debug_guide' 
  | 'decision_guide' 
  | 'principle' 
  | 'registry';

export interface FavoriteItem {
  type: ContentType;
  id: string;
  name: string;
  href: string;
  timestamp: number;
}

export interface HistoryItem {
  type: ContentType;
  id: string;
  name: string;
  href: string;
  timestamp: number;
  visitCount: number;
}

export interface WidgetPreferences {
  [widgetId: string]: {
    enabled: boolean;
    pinned: boolean;
  };
}

export interface DashboardState {
  version: typeof DASHBOARD_VERSION;
  favorites: FavoriteItem[];
  history: HistoryItem[];
  widgetPreferences: WidgetPreferences;
}

// Default state
const defaultState: DashboardState = {
  version: DASHBOARD_VERSION,
  favorites: [],
  history: [],
  widgetPreferences: {
    continueLearning: { enabled: true, pinned: true },
    favorites: { enabled: true, pinned: true },
    frequentlyUsed: { enabled: true, pinned: true },
    recommendations: { enabled: true, pinned: true },
    recentlyAdded: { enabled: true, pinned: false },
    learningProgress: { enabled: true, pinned: false },
    dashboardInsights: { enabled: true, pinned: false },
  },
};

// Get state from localStorage
export function getDashboardState(): DashboardState {
  if (typeof window === 'undefined') return defaultState;
  
  try {
    const raw = window.localStorage.getItem(DASHBOARD_KEY);
    if (!raw) return defaultState;
    
    const parsed = JSON.parse(raw) as DashboardState;
    
    // Version check for future migrations
    if (parsed.version !== DASHBOARD_VERSION) {
      // Future: add migration logic here
      return defaultState;
    }
    
    return {
      ...defaultState,
      ...parsed,
      widgetPreferences: {
        ...defaultState.widgetPreferences,
        ...parsed.widgetPreferences,
      },
    };
  } catch {
    return defaultState;
  }
}

// Save state to localStorage
export function saveDashboardState(state: DashboardState): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.setItem(DASHBOARD_KEY, JSON.stringify(state));
  } catch {
    // Storage full or disabled
  }
}

// Favorites operations
export function addFavorite(item: Omit<FavoriteItem, 'timestamp'>): void {
  const state = getDashboardState();
  const exists = state.favorites.some(f => f.href === item.href);
  
  if (!exists) {
    const favorite: FavoriteItem = {
      ...item,
      timestamp: Date.now(),
    };
    state.favorites = [favorite, ...state.favorites];
    saveDashboardState(state);
  }
}

export function removeFavorite(href: string): void {
  const state = getDashboardState();
  state.favorites = state.favorites.filter(f => f.href !== href);
  saveDashboardState(state);
}

export function isFavorited(href: string): boolean {
  const state = getDashboardState();
  return state.favorites.some(f => f.href === href);
}

export function getFavorites(): FavoriteItem[] {
  return getDashboardState().favorites;
}

// History operations
export function recordVisit(item: {
  type: ContentType;
  id: string;
  name: string;
  href: string;
}): void {
  const state = getDashboardState();
  const existing = state.history.find(h => h.href === item.href);
  
  if (existing) {
    existing.visitCount += 1;
    existing.timestamp = Date.now();
  } else {
    state.history.push({
      ...item,
      timestamp: Date.now(),
      visitCount: 1,
    });
  }
  
  // Keep only last 50 items
  state.history = state.history.slice(0, 50);
  saveDashboardState(state);
}

export function getHistory(): HistoryItem[] {
  return getDashboardState().history;
}

export function getFrequentlyUsed(limit = 5): HistoryItem[] {
  const history = getHistory();
  const now = Date.now();
  const DAYS_TO_MS = 24 * 60 * 60 * 1000;
  
  // Calculate recency-weighted score for each item
  // score = visitCount * recencyWeight
  // recencyWeight decays over time (recent visits get higher weight)
  const scored = history.map(item => {
    const daysSinceVisit = (now - item.timestamp) / DAYS_TO_MS;
    // Exponential decay: weight = e^(-days/30)
    // Items visited within last 30 days get high weight
    // Items visited 6 months ago get very low weight
    const recencyWeight = Math.exp(-daysSinceVisit / 30);
    const score = item.visitCount * recencyWeight;
    return { ...item, score };
  });
  
  // Sort by score (descending)
  scored.sort((a, b) => b.score - a.score);
  
  // Return top items without the score property
  return scored.slice(0, limit);
}

// Widget preferences operations
export function getWidgetPreferences(): WidgetPreferences {
  return getDashboardState().widgetPreferences;
}

export function updateWidgetPreference(
  widgetId: string, 
  updates: Partial<{ enabled: boolean; pinned: boolean }>
): void {
  const state = getDashboardState();
  state.widgetPreferences[widgetId] = {
    ...state.widgetPreferences[widgetId],
    ...updates,
  };
  saveDashboardState(state);
}

export function isWidgetEnabled(widgetId: string): boolean {
  return getWidgetPreferences()[widgetId]?.enabled ?? true;
}

export function isWidgetPinned(widgetId: string): boolean {
  return getWidgetPreferences()[widgetId]?.pinned ?? false;
}