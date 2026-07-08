import type { VisualizationEquivalent } from '@/types/package';

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
  const targetPackage = packages.find(pkg => pkg.id === equivalent.package);
  if (!targetPackage) return null;

  const targetTask = targetPackage.tasks.find(task => {
    const normalizedTarget = slugify(equivalent.task);
    const taskResourceId = task.resource_id ? slugify(task.resource_id) : '';
    const taskTitleSlug = slugify(task.task);

    const cleanSlug = (s: string) => s.replace(/^(create|draw|plot|show)-/, '');
    const cleanTarget = cleanSlug(normalizedTarget);
    const cleanTitle = cleanSlug(taskTitleSlug);
    const cleanResource = taskResourceId ? cleanSlug(taskResourceId) : '';

    return (
      taskResourceId === normalizedTarget ||
      taskTitleSlug === normalizedTarget ||
      task.task === equivalent.task ||
      task.resource_id === equivalent.task ||
      (cleanResource && cleanResource === cleanTarget) ||
      cleanTitle === cleanTarget
    );
  });

  if (!targetTask) return null;

  return {
    ...equivalent,
    task: targetTask.task,
    href: `/packages/${targetPackage.id}#${slugify(targetTask.task)}`,
    targetLabel: targetTask.task,
    targetAnchor: slugify(targetTask.task),
    packageName: targetPackage.name,
    isLocal: targetPackage.id === currentPackageId,
    type: 'equivalent',
    target: equivalent.task,
  };
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
