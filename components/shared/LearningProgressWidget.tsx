'use client';

import { useEffect, useState } from 'react';
import { BarChart3, CheckCircle2, Workflow, Cpu, Code, Lightbulb, FileCode2, Shield, Zap, Terminal, TrendingUp } from 'lucide-react';
import { getHistory, getFavorites, type ContentType } from '@/lib/dashboard-state';

interface ProgressStats {
  visited: number;
  favorited: number;
}

const CONTENT_TYPES: { type: ContentType; label: string; icon: React.ElementType; color: string }[] = [
  { type: 'package', label: 'Packages', icon: Code, color: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30' },
  { type: 'model', label: 'Models', icon: Cpu, color: 'from-violet-500/20 to-violet-500/5 border-violet-500/30' },
  { type: 'workflow', label: 'Workflows', icon: Workflow, color: 'from-blue-500/20 to-blue-500/5 border-blue-500/30' },
  { type: 'cheatsheet', label: 'Cheatsheets', icon: FileCode2, color: 'from-amber-500/20 to-amber-500/5 border-amber-500/30' },
  { type: 'pattern', label: 'Patterns', icon: Zap, color: 'from-orange-500/20 to-orange-500/5 border-orange-500/30' },
  { type: 'debug_guide', label: 'Debug Guides', icon: Shield, color: 'from-red-500/20 to-red-500/5 border-red-500/30' },
  { type: 'decision_guide', label: 'Decision Guides', icon: BarChart3, color: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30' },
  { type: 'principle', label: 'Principles', icon: Lightbulb, color: 'from-purple-500/20 to-purple-500/5 border-purple-500/30' },
  { type: 'registry', label: 'Registry', icon: Terminal, color: 'from-rose-500/20 to-rose-500/5 border-rose-500/30' },
];

export default function LearningProgressWidget() {
  const [stats, setStats] = useState<Record<ContentType, ProgressStats>>({} as Record<ContentType, ProgressStats>);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const history = getHistory();
    const favorites = getFavorites();

    const newStats: Record<ContentType, ProgressStats> = {} as Record<ContentType, ProgressStats>;
    
    CONTENT_TYPES.forEach(({ type }) => {
      newStats[type] = {
        visited: history.filter(h => h.type === type).length,
        favorited: favorites.filter(f => f.type === type).length,
      };
    });
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStats(newStats);
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const totalVisited = Object.values(stats).reduce((sum, s) => sum + s.visited, 0);
  const totalFavorited = Object.values(stats).reduce((sum, s) => sum + s.favorited, 0);

  const maxVisited = Math.max(...Object.values(stats).map(s => s.visited), 1);

  return (
    <section className="rounded-xl border border-border bg-card mobile-card-padding space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 select-none">
          <div className="p-1 rounded bg-green-500/10 border border-green-500/20">
            <TrendingUp className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Learning Progress</h2>
            <p className="text-[9px] text-muted-foreground">
              {totalVisited} content types explored · {totalFavorited} bookmarked
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-green-600 dark:text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded select-none">
            {Object.values(stats).filter(s => s.visited > 0).length}/{CONTENT_TYPES.length} types
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {CONTENT_TYPES.map(({ type, label, icon: Icon, color }) => {
          const typeStats = stats[type] || { visited: 0, favorited: 0 };
          const visitPercent = maxVisited > 0 ? (typeStats.visited / maxVisited) * 100 : 0;
          
          return (
            <div
              key={type}
              className={`rounded-lg border bg-gradient-to-br ${color} p-2.5 flex flex-col gap-1.5 transition-all hover:shadow-sm`}
            >
              <div className="flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-foreground shrink-0" />
                <span className="text-[10px] font-bold text-foreground truncate">{label}</span>
              </div>
              
              {/* Visit count bar */}
              <div className="w-full h-1 rounded-full bg-muted/40 overflow-hidden">
                <div
                  className="h-full rounded-full bg-foreground/30 transition-all duration-500"
                  style={{ width: `${Math.max(visitPercent, 2)}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between text-[9px]">
                <span className="font-mono text-muted-foreground">
                  {typeStats.visited} visited
                </span>
                {typeStats.favorited > 0 && (
                  <span className="flex items-center gap-0.5 text-primary font-medium">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    {typeStats.favorited}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}