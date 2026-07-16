'use client';

import Link from 'next/link';
import { RelatedResource } from '@/types/registry';
import { RegistryBadge } from './RegistryBadge';

interface RelatedResourcesProps {
  resources: RelatedResource[];
}

const relationshipLabels: Record<string, string> = {
  recommended_for: 'Recommended For',
  required_for: 'Required For',
  alternative_to: 'Alternative To',
  used_with: 'Used With',
  see_also: 'See Also',
};

const resourceTypeLabels: Record<string, string> = {
  workflow: 'Workflow',
  pattern: 'Pattern',
  package: 'Package',
  decision_guide: 'Decision Guide',
  debug_guide: 'Debug Guide',
  principle: 'Principle',
};

const resourceTypePaths: Record<string, string> = {
  workflow: '/workflows',
  pattern: '/patterns',
  package: '/packages',
  decision_guide: '/decision-guides',
  debug_guide: '/debug-guides',
  principle: '/principles',
};

/**
 * Related Resources component for Registry family pages.
 * Displays rich cross-linking to other AENS content types.
 */
export default function RelatedResources({ resources }: RelatedResourcesProps) {
  if (!resources || resources.length === 0) {
    return null;
  }

  // Group resources by type
  const grouped = resources.reduce<Record<string, RelatedResource[]>>((acc, resource) => {
    const type = resource.resource_type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(resource);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Related AENS Resources</h2>
      <div className="space-y-3">
        {Object.entries(grouped).map(([type, items]) => (
          <div key={type} className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {resourceTypeLabels[type] || type}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {items.map((item, idx) => {
                const href = `${resourceTypePaths[item.resource_type]}/${item.resource_slug}`;
                return (
                  <Link
                    key={idx}
                    href={href}
                    className="inline-flex items-center gap-1"
                  >
                    <RegistryBadge variant="outline" size="xs" className="font-mono">
                      {relationshipLabels[item.relationship] || item.relationship}
                    </RegistryBadge>
                    <span className="text-xs text-foreground hover:underline">
                      {item.resource_slug}
                    </span>
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