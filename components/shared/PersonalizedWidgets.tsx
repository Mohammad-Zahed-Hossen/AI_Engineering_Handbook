'use client';

import ContinueLearningWidget from './ContinueLearningWidget';
import FavoritesWidget from './FavoritesWidget';
import FrequentlyUsedWidget from './FrequentlyUsedWidget';
import RecommendationsWidget from './RecommendationsWidget';
import LearningProgressWidget from './LearningProgressWidget';
import DashboardInsightsWidget from './DashboardInsightsWidget';
import WidgetPreferences from './WidgetPreferences';
import { History } from 'lucide-react';
import { isWidgetEnabled, isWidgetPinned } from '@/lib/dashboard-state';

// Default recommendations to show when no user history exists
const DEFAULT_RECOMMENDATIONS = [
  { id: 'autograd', type: 'package', name: 'Autograd', href: '/packages/autograd' },
  { id: 'optimizer', type: 'package', name: 'Optimizer', href: '/packages/optimizer' },
  { id: 'dataloader', type: 'package', name: 'DataLoader', href: '/packages/dataloader' },
  { id: 'training-loop', type: 'package', name: 'Training Loop', href: '/packages/training-loop' },
];

// Widget order configuration - pinned widgets appear first
const WIDGET_ORDER: Array<{ id: string; render: () => React.ReactNode }> = [
  { 
    id: 'continueLearning', 
    render: () => <ContinueLearningWidget /> 
  },
  { 
    id: 'favorites', 
    render: () => <FavoritesWidget /> 
  },
  { 
    id: 'frequentlyUsed', 
    render: () => <FrequentlyUsedWidget /> 
  },
  { 
    id: 'recommendations', 
    render: () => <RecommendationsWidget recommendations={DEFAULT_RECOMMENDATIONS} /> 
  },
  { 
    id: 'learningProgress', 
    render: () => <LearningProgressWidget /> 
  },
  { 
    id: 'dashboardInsights', 
    render: () => <DashboardInsightsWidget /> 
  },
];

export default function PersonalizedWidgets() {
  // Sort widgets: pinned first, then unpinned in their original order
  const sortedWidgets = [...WIDGET_ORDER].sort((a, b) => {
    const aPinned = isWidgetPinned(a.id);
    const bPinned = isWidgetPinned(b.id);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return 0;
  });

  return (
    <section className="mobile-section-spacing space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 select-none">
          <History className="w-4.5 h-4.5 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Your Workspace</h2>
        </div>
        <WidgetPreferences />
      </div>
      
      {sortedWidgets.map((widget) => {
        if (!isWidgetEnabled(widget.id)) return null;
        return <div key={widget.id}>{widget.render()}</div>;
      })}
    </section>
  );
}
