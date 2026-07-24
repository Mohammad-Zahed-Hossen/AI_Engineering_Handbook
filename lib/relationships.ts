import type { VisualizationEquivalent } from '@/types/package';
import { createRelationshipRegistry } from '@/lib/relationships/relationshipRegistry';

export type VisualizationEquivalentItem = VisualizationEquivalent;

export interface ResolvedRelationship {
  href: string;
  targetLabel: string;
  targetAnchor: string;
  packageName: string;
  isLocal: boolean;
  package: string;
  task: string;
  reason: string;
  type?: string;
  target?: string;
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function getVisualizationEquivalentHref(packageId: string, task: string) {
  return `/packages/${packageId}#${slugify(task)}`;
}

export function getRelationshipSectionLabel(type?: string): string {
  switch (type) {
    case 'interactive_equivalent':
      return 'Interactive Equivalent';
    case 'static_equivalent':
      return 'Static Equivalent';
    case 'advanced_version':
      return 'Advanced Version';
    case 'simpler_version':
      return 'Simpler Version';
    case 'used_with':
      return 'Used With';
    case 'migration_target':
      return 'Migration Target';
    case 'alternative':
      return 'Alternative';
    default:
      return 'Equivalent';
  }
}

export function resolvePackageRelationship(
  equivalent: Pick<VisualizationEquivalent, 'package' | 'task' | 'reason'>,
  currentPackageId: string,
  packages: Array<{ id: string; name: string; tasks: Array<{ task: string; resource_id?: string }> }>
): ResolvedRelationship | null {
  const registry = createRelationshipRegistry(packages);
  const targetTask = registry.resolvePackageTask(equivalent.task, { packageId: equivalent.package });

  if (!targetTask) return null;

  return {
    ...equivalent,
    task: targetTask.task,
    href: targetTask.href,
    targetLabel: targetTask.task,
    targetAnchor: targetTask.slug,
    packageName: targetTask.packageName,
    isLocal: targetTask.packageId === currentPackageId,
    type: 'equivalent',
    target: equivalent.task,
  };
}

/**
 * Get the href for any entity type based on its type and ID.
 * Server-compatible pure function.
 */
export function getEntityHref(type: string, id: string): string | null {
  if (type === 'package') return `/packages/${id}`;
  if (type === 'cheatsheet') return `/cheatsheets/${id}`;
  if (type === 'workflow') return `/workflows/${id}`;
  if (type === 'pattern') return `/patterns/${id}`;
  if (type === 'model') return `/models/ml/${id}`;
  if (type === 'debug_guide') return `/debug-guides/${id}`;
  if (type === 'decision_guide') return `/decision-guides/${id}`;
  if (type === 'principle') return `/principles/${id}`;
  return null;
}

export interface EntityLink {
  type: string;
  label: string;
  href: string | null;
}

const TYPE_LABEL_MAP: Record<string, string> = {
  package: 'Package',
  cheatsheet: 'Cheatsheet',
  workflow: 'Workflow',
  pattern: 'Pattern',
  model: 'Model',
  debug_guide: 'Debug Guide',
  decision_guide: 'Decision Guide',
  principle: 'Principle',
};

/**
 * Build entity navigation links for cross-entity navigation.
 * Server-compatible pure function.
 */
export function buildEntityLinks(
  currentType: string,
  currentId: string,
  relatedCheatsheet?: string | null,
  relatedPackage?: string | null
): EntityLink[] {
  const links: EntityLink[] = [];

  if (currentType === 'package') {
    links.push({
      type: 'package',
      label: `Open ${currentId.charAt(0).toUpperCase() + currentId.slice(1)} Package`,
      href: `/packages/${currentId}`,
    });
    if (relatedCheatsheet) {
      links.push({
        type: 'cheatsheet',
        label: `Open Cheatsheet`,
        href: `/cheatsheets/${relatedCheatsheet}`,
      });
    }
  } else if (currentType === 'cheatsheet') {
    links.push({
      type: 'cheatsheet',
      label: `Open ${currentId.charAt(0).toUpperCase() + currentId.slice(1)} Cheatsheet`,
      href: `/cheatsheets/${currentId}`,
    });
    if (relatedPackage) {
      links.push({
        type: 'package',
        label: `Open Package`,
        href: `/packages/${relatedPackage}`,
      });
    }
  } else {
    const label = TYPE_LABEL_MAP[currentType] || currentType;
    const href = getEntityHref(currentType, currentId);
    if (href) {
      links.push({
        type: currentType,
        label: `Open ${label}`,
        href,
      });
    }
  }

  return links;
}

export function getRelationshipSearchKeywords(equivalents: Array<Pick<VisualizationEquivalent, 'package' | 'task' | 'reason'>> | undefined): string[] {
  if (!equivalents?.length) return [];

  const keywordSet = new Set<string>();
  equivalents.forEach(equivalent => {
    [equivalent.package, equivalent.task, equivalent.reason]
      .filter(Boolean)
      .forEach(value => {
        const tokens = String(value)
          .toLowerCase()
          .replace(/[_-]+/g, ' ')
          .match(/[a-z0-9]+/g) ?? [];

        tokens.forEach(token => {
          if (token.length >= 2) keywordSet.add(token);
        });
      });
  });

  return Array.from(keywordSet);
}

export * from './relationships/index';
