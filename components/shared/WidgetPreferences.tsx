'use client';

import { useState, useEffect, useRef } from 'react';
import { Settings, Eye, Pin, PinOff } from 'lucide-react';
import {
  getWidgetPreferences,
  updateWidgetPreference,
  type WidgetPreferences,
} from '@/lib/dashboard-state';

interface WidgetPreferencesProps {
  onPreferencesChange?: () => void;
}

const WIDGET_LABELS: Record<string, string> = {
  continueLearning: 'Continue Learning',
  favorites: 'Favorites',
  frequentlyUsed: 'Frequently Used',
  recommendations: 'Recommendations',
  recentlyAdded: 'Recently Added',
  learningProgress: 'Learning Progress',
  dashboardInsights: 'Dashboard Insights',
};

export default function WidgetPreferences({ onPreferencesChange }: WidgetPreferencesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState<WidgetPreferences>(() => getWidgetPreferences());
  const [isMounted, setIsMounted] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleToggleEnabled = (widgetId: string) => {
    const current = preferences[widgetId];
    updateWidgetPreference(widgetId, { enabled: !current?.enabled });
    setPreferences(getWidgetPreferences());
    onPreferencesChange?.();
  };

  const handleTogglePinned = (widgetId: string) => {
    const current = preferences[widgetId];
    updateWidgetPreference(widgetId, { pinned: !current?.pinned });
    setPreferences(getWidgetPreferences());
    onPreferencesChange?.();
  };

  if (!isMounted) return null;

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
        aria-label="Widget preferences"
      >
        <Settings className="w-4 h-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-border bg-card shadow-lg z-50 p-3 space-y-2">
          <h3 className="text-xs font-bold text-foreground mb-2">Dashboard Widgets</h3>
          
          {Object.entries(WIDGET_LABELS).map(([widgetId, label]) => {
            const pref = preferences[widgetId] || { enabled: true, pinned: false };
            return (
              <div key={widgetId} className="flex items-center justify-between">
                <span className="text-xs text-foreground">{label}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleTogglePinned(widgetId)}
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      pref.pinned ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                    }`}
                    aria-label={pref.pinned ? 'Unpin widget' : 'Pin widget'}
                  >
                    {pref.pinned ? <Pin className="w-3.5 h-3.5" /> : <PinOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleToggleEnabled(widgetId)}
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      pref.enabled ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                    }`}
                    aria-label={pref.enabled ? 'Hide widget' : 'Show widget'}
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}