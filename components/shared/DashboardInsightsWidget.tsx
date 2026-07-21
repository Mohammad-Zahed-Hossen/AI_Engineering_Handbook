'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, TrendingUp, BookOpen, Shield, Zap, BarChart3 } from 'lucide-react';
import { getHistory, getFavorites, type ContentType } from '@/lib/dashboard-state';

interface Insight {
  id: string;
  text: string;
  icon: React.ElementType;
  type: 'info' | 'tip' | 'warning';
}

export default function DashboardInsightsWidget() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const history = getHistory();
    const favorites = getFavorites();
    
    const newInsights: Insight[] = [];
    
    // Count visits by type
    const visitsByType: Record<ContentType, number> = {} as Record<ContentType, number>;
    const allTypes: ContentType[] = ['package', 'model', 'workflow', 'cheatsheet', 'pattern', 'debug_guide', 'decision_guide', 'principle', 'registry'];
    allTypes.forEach(type => {
      visitsByType[type] = history.filter(h => h.type === type).length;
    });
    
    // Find most visited type
    const mostVisited = Object.entries(visitsByType).reduce((max, entry) => 
      entry[1] > max[1] ? entry : max, ['', 0]
    );
    
    if (mostVisited[1] > 0) {
      const typeLabels: Record<ContentType, string> = {
        package: 'Packages',
        model: 'Models',
        workflow: 'Workflows',
        cheatsheet: 'Cheatsheets',
        pattern: 'Patterns',
        debug_guide: 'Debug Guides',
        decision_guide: 'Decision Guides',
        principle: 'Principles',
        registry: 'Registry',
      };
      
      if (mostVisited[0] === 'model') {
        newInsights.push({
          id: 'ml-focus',
          text: `You've explored mostly ${typeLabels[mostVisited[0] as ContentType]}.`,
          icon: Lightbulb,
          type: 'info',
        });
      } else if (mostVisited[0] === 'workflow') {
        newInsights.push({
          id: 'workflow-focus',
          text: `You're actively studying ${typeLabels[mostVisited[0] as ContentType]}.`,
          icon: TrendingUp,
          type: 'tip',
        });
      }
    }
    
    // Check for unvisited types
    const unvisitedTypes = allTypes.filter(type => visitsByType[type] === 0);
    if (unvisitedTypes.length > 0) {
      const typeLabels: Record<ContentType, string> = {
        package: 'Packages',
        model: 'Models',
        workflow: 'Workflows',
        cheatsheet: 'Cheatsheets',
        pattern: 'Patterns',
        debug_guide: 'Debug Guides',
        decision_guide: 'Decision Guides',
        principle: 'Principles',
        registry: 'Registry',
      };
      
      if (unvisitedTypes.includes('debug_guide')) {
        newInsights.push({
          id: 'no-debug',
          text: `You haven't visited any ${typeLabels['debug_guide']}.`,
          icon: Shield,
          type: 'tip',
        });
      }
    }
    
    // Check for recent activity
    if (history.length > 0) {
      const recentItem = history[0];
      const typeLabels: Record<ContentType, string> = {
        package: 'Package',
        model: 'Model',
        workflow: 'Workflow',
        cheatsheet: 'Cheatsheet',
        pattern: 'Pattern',
        debug_guide: 'Debug Guide',
        decision_guide: 'Decision Guide',
        principle: 'Principle',
        registry: 'Registry',
      };
      
      newInsights.push({
        id: 'recent',
        text: `You recently started learning ${recentItem.name}.`,
        icon: BookOpen,
        type: 'info',
      });
    }
    
    // Check for favorites
    if (favorites.length > 0) {
      newInsights.push({
        id: 'favorites',
        text: `You have ${favorites.length} bookmarked reference${favorites.length !== 1 ? 's' : ''}.`,
        icon: Lightbulb,
        type: 'tip',
      });
    }
    
    setInsights(newInsights);
  }, []);

  if (!isMounted) return null;
  if (insights.length === 0) return null;

  return (
    <section className="rounded-xl border border-border bg-card mobile-card-padding space-y-3">
      <div className="flex items-center gap-1.5 select-none">
        <Lightbulb className="w-4.5 h-4.5 text-primary" />
        <h2 className="text-sm font-bold text-foreground">Dashboard Insights</h2>
      </div>

      <div className="space-y-2">
        {insights.map((insight) => {
          const Icon = insight.icon;
          const bgColor = insight.type === 'warning' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-primary/5 border-primary/20';
          
          return (
            <div key={insight.id} className={`flex items-start gap-2 p-2.5 rounded-lg border ${bgColor}`}>
              <Icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span className="text-xs text-foreground">{insight.text}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}