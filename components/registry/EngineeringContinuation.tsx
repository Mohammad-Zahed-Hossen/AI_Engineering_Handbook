'use client';

import Link from 'next/link';
import { RelatedResource } from '@/types/registry';
import { RegistryBadge } from './RegistryBadge';
import { Wrench, Bug, BookOpen, GitCompare, Package, Cog } from 'lucide-react';

interface EngineeringContinuationProps {
  resources: RelatedResource[];
}

const intentIcons: Record<string, React.ReactNode> = {
  deploy: <Wrench className="h-3 w-3" />,
  debug: <Bug className="h-3 w-3" />,
  learn: <BookOpen className="h-3 w-3" />,
  select: <GitCompare className="h-3 w-3" />,
  implement: <Package className="h-3 w-3" />,
  optimize: <Cog className="h-3 w-3" />,
};

const intentLabels: Record<string, string> = {
  deploy: 'Deploy',
  debug: 'Debug',
  learn: 'Learn',
  select: 'Select',
  implement: 'Implement',
  optimize: 'Optimize',
};

const resourceTypePaths: Record<string, string> = {
  workflow: '/workflows',
  pattern: '/patterns',
  package: '/packages',
  decision_guide: '/decision-guides',
  debug_guide: '/debug-guides',
  principle: '/principles',
};

const resourceTypeLabels: Record<string, string> = {
  workflow: 'Workflow',
  pattern: 'Pattern',
  package: 'Package',
  decision_guide: 'Guide',
  debug_guide: 'Debug',
  principle: 'Principle',
};

/**
 * Engineering Continuation component for Registry pages.
 * Answers: What should I do next?
 * Replaces generic "Related Resources" with intent-based navigation.
 */
export default function EngineeringContinuation({ resources }: EngineeringContinuationProps) {
  if (!resources || resources.length === 0) return null;

  // Group resources by intent (derive from relationship or use default)
  const grouped = resources.reduce<Record<string, RelatedResource[]>>((acc, resource) => {
    // Map relationship to intent
    const intentMap: Record<string, string> = {
      recommended_for: 'deploy',
      required_for: 'implement',
      used_with: 'implement',
      see_also: 'learn',
    };
    
    const intent = intentMap[resource.relationship] || 'learn';
    if (!acc[intent]) acc[intent] = [];
    acc[intent].push(resource);
    return acc;
  }, {});

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-foreground">Next Actions</h2>
      
      <div className="grid gap-2">
        {Object.entries(grouped).map(([intent, items]) => (
          <div key={intent} className="border border-border rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              {intentIcons[intent]}
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                {intentLabels[intent] || intent}
              </span>
            </div>
            
            <div className="flex flex-col gap-1">
              {items.map((item, idx) => {
                const href = `${resourceTypePaths[item.resource_type]}/${item.resource_slug}`;
                return (
                  <Link
                    key={idx}
                    href={href}
                    className="flex items-center gap-1.5 group"
                  >
                    <RegistryBadge variant="outline" size="xs" className="font-mono shrink-0">
                      {resourceTypeLabels[item.resource_type] || item.resource_type}
                    </RegistryBadge>
                    <span className="text-xs text-foreground group-hover:underline">
                      {item.resource_slug}
                    </span>
                    {item.reason && (
                      <span className="text-[10px] text-muted-foreground truncate">
                        — {item.reason}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}