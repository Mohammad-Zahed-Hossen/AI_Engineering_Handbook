'use client';

import { useState, useEffect } from 'react';
import { BarChart3, CheckCircle2, BookOpen, Workflow, Cpu, Code, Lightbulb, FileCode2, Shield, Zap, Terminal } from 'lucide-react';
import { getHistory, getFavorites, type ContentType } from '@/lib/dashboard-state';

interface ProgressStats {
  visited: number;
  favorited: number;
}

const CONTENT_TYPES: { type: ContentType; label: string; icon: React.ElementType }[] = [
  { type: 'package', label: 'Packages', icon: Code },
  { type: 'model', label: 'Models', icon: Cpu },
  { type: 'workflow', label: 'Workflows', icon: Workflow },
  { type: 'cheatsheet', label: 'Cheatsheets', icon: FileCode2 },
  { type: 'pattern', label: 'Patterns', icon: Zap },
  { type: 'debug_guide', label: 'Debug Guides', icon: Shield },
  { type: 'decision_guide', label: 'Decision Guides', icon: BarChart3 },
  { type: 'principle', label: 'Principles', icon: Lightbulb },
  { type: 'registry', label: 'Registry', icon: Terminal },
];

export default function LearningProgressWidget() {
  const [stats, setStats] = useState<Record<ContentType, ProgressStats>>({} as Record<ContentType, ProgressStats>);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const history = getHistory();
    const favorites = getFavorites();
    
    const newStats: Record<ContentType, ProgressStats> = {} as Record<ContentType, ProgressStats>;
    
    CONTENT_TYPES.forEach(({ type }) => {
      newStats[type] = {
        visited: history.filter(h => h.type === type).length,
        favorited: favorites.filter(f => f.type === type).length,
      };
    });
    
    setStats(newStats);
  }, []);

  if (!isMounted) return null;

  const totalVisited = Object.values(stats).reduce((sum, s) => sum + s.visited, 0);
  const totalFavorited = Object.values(stats).reduce((sum, s) => sum + s.favorited, 0);

  if (totalVisited === 0 && totalFavorited === 0) return null;

  return (
    <section className="rounded-xl border border-border bg-card mobile-card-padding space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 select-none">
          <BarChart3 className="w-4.5 h-4.5 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Learning Progress</h2>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground select-none">
          {totalVisited} visited · {totalFavorited} favorited
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {CONTENT_TYPES.map(({ type, label, icon: Icon }) => {
          const typeStats = stats[type] || { visited: 0, favorited: 0 };
          if (typeStats.visited === 0 && typeStats.favorited === 0) return null;
          
          return (
            <div key={type} className="rounded-lg border border-border bg-muted/20 p-2 text-center">
              <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
              <div className="text-xs font-bold text-foreground">{label}</div>
              <div className="text-[9px] text-muted-foreground">
                {typeStats.visited} visited
              </div>
              {typeStats.favorited > 0 && (
                <div className="text-[9px] text-primary flex items-center justify-center gap-0.5 mt-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  {typeStats.favorited} favorited
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}