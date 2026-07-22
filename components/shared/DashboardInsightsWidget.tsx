'use client';

import { useMemo } from 'react';
import { Lightbulb, ArrowRight, Target } from 'lucide-react';
import { getHistory, type ContentType } from '@/lib/dashboard-state';

interface Insight {
  id: string;
  title: string;
  text: string;
  icon: React.ElementType;
  type: 'focus' | 'next';
  action?: string;
}

export default function DashboardInsightsWidget() {
  const insights = useMemo<Insight[]>(() => {
    const history = getHistory();
    
    const newInsights: Insight[] = [];
    
    // Count visits by type for learning focus
    const visitsByType: Record<ContentType, number> = {} as Record<ContentType, number>;
    const allTypes: ContentType[] = ['package', 'model', 'workflow', 'cheatsheet', 'pattern', 'debug_guide', 'decision_guide', 'principle', 'registry'];
    allTypes.forEach(type => {
      visitsByType[type] = history.filter(h => h.type === type).length;
    });
    
    const totalVisits = history.length;
    
    // Insight 1: Learning Focus
    if (totalVisits > 0) {
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
        
        const percentage = Math.round((mostVisited[1] / totalVisits) * 100);
        newInsights.push({
          id: 'learning-focus',
          title: 'Learning Focus',
          text: `${percentage}% of your recent activity is ${typeLabels[mostVisited[0] as ContentType]}.`,
          icon: Target,
          type: 'focus',
        });
      }
    }
    
    // Insight 2: Next Step (based on most recent item)
    if (history.length > 0) {
      const recentItem = history[0];
      
      // Suggest next content type based on current focus
      if (recentItem.type === 'package') {
        newInsights.push({
          id: 'next-step',
          title: 'Next Step',
          text: `You've learned ${recentItem.name}. Explore related Workflows for practical application.`,
          icon: ArrowRight,
          type: 'next',
          action: 'Explore Workflows',
        });
      } else if (recentItem.type === 'model') {
        newInsights.push({
          id: 'next-step',
          title: 'Next Step',
          text: `You've studied ${recentItem.name}. Check Debug Guides for common implementation issues.`,
          icon: ArrowRight,
          type: 'next',
          action: 'Explore Debug Guides',
        });
      } else if (recentItem.type === 'workflow') {
        newInsights.push({
          id: 'next-step',
          title: 'Next Step',
          text: `You've completed ${recentItem.name}. Review relevant Cheatsheets for quick reference.`,
          icon: ArrowRight,
          type: 'next',
          action: 'Explore Cheatsheets',
        });
      } else if (recentItem.type === 'debug_guide') {
        newInsights.push({
          id: 'next-step',
          title: 'Next Step',
          text: `You've reviewed ${recentItem.name}. Apply the fix in a related Workflow.`,
          icon: ArrowRight,
          type: 'next',
          action: 'Explore Workflows',
        });
      }
    }
    
    return newInsights.slice(0, 4);
  }, []);

  if (insights.length === 0) {
    return (
      <section className="rounded-xl border border-border bg-card mobile-card-padding space-y-3">
        <div className="flex items-center gap-1.5 select-none">
          <div className="p-1 rounded bg-indigo-500/10 border border-indigo-500/20">
            <Lightbulb className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Dashboard Insights</h2>
          </div>
        </div>
        <div className="rounded-lg border border-dashed border-border/60 p-4 text-center select-none">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted/50 mb-2">
            <Lightbulb className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">
            Start exploring the handbook to receive personalized insights and recommendations.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-card mobile-card-padding space-y-3">
      <div className="flex items-center gap-1.5 select-none">
        <div className="p-1 rounded bg-indigo-500/10 border border-indigo-500/20">
          <Lightbulb className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">Dashboard Insights</h2>
          {insights.length > 0 && (
            <p className="text-[9px] text-muted-foreground">{insights.length} actionable insights</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {insights.map((insight) => {
          const Icon = insight.icon;
          const bgColors: Record<string, string> = {
            focus: 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20',
            next: 'bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20',
          };
          
          return (
            <div key={insight.id} className={`flex flex-col gap-1.5 p-3 rounded-lg border ${bgColors[insight.type]} hover:shadow-sm transition-all`}>
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold text-foreground">{insight.title}</span>
              </div>
              <p className="text-xs text-foreground leading-relaxed pl-6">
                {insight.text}
              </p>
              {insight.action && (
                <div className="pl-6 mt-0.5">
                  <span className="text-[10px] font-semibold text-primary">
                    {insight.action}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
