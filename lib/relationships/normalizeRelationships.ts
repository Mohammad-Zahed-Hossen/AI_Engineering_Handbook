import type { Cheatsheet } from '@/types/cheatsheet';
import type { Package } from '@/types/package';
import type { CanonicalRelationship, RelationshipContext, RelationshipField, RelationshipResolvers } from './types';
import { resolveRelationship } from './resolveRelationship';

type RelationshipList = readonly string[] | undefined;

function dedupeCanonicalRelationships(relationships: CanonicalRelationship[]): CanonicalRelationship[] {
  const seen = new Set<string>();

  return relationships.filter(relationship => {
    const key = `${relationship.type}:${relationship.id}:${relationship.href}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function normalizeRelationshipList(
  rawIds: RelationshipList,
  relationshipType: RelationshipField,
  resolvers: RelationshipResolvers,
  context?: RelationshipContext,
): CanonicalRelationship[] {
  if (!rawIds?.length) return [];

  const seenRawIds = new Set<string>();
  const resolvedRelationships: CanonicalRelationship[] = [];

  rawIds.forEach(rawId => {
    const trimmedId = rawId.trim();
    if (!trimmedId) return;

    const rawKey = trimmedId.toLowerCase();
    if (seenRawIds.has(rawKey)) return;
    seenRawIds.add(rawKey);

    const resolved = resolveRelationship(trimmedId, relationshipType, resolvers, context);
    if (resolved) {
      resolvedRelationships.push(resolved);
    }
  });

  return dedupeCanonicalRelationships(resolvedRelationships);
}

export type NormalizedPackageTask<T extends {
  related_workflows?: string[];
  related_cheatsheets?: string[];
  related_models?: string[];
  related_patterns?: string[];
  related_decision_guides?: string[];
  related_package_tasks?: string[];
  related_apis?: string[];
}> = T & {
  related_workflow_links: CanonicalRelationship[];
  related_cheatsheet_links: CanonicalRelationship[];
  related_model_links: CanonicalRelationship[];
  related_pattern_links: CanonicalRelationship[];
  related_decision_guide_links: CanonicalRelationship[];
  related_package_task_links: CanonicalRelationship[];
  related_api_links: CanonicalRelationship[];
};

export type NormalizedCheatsheetEntry<T extends {
  related_packages?: string[];
  related_workflows?: string[];
  related_patterns?: string[];
  related_decision_guides?: string[];
  related_apis?: string[];
}> = T & {
  related_package_links: CanonicalRelationship[];
  related_workflow_links: CanonicalRelationship[];
  related_pattern_links: CanonicalRelationship[];
  related_decision_guide_links: CanonicalRelationship[];
  related_api_links: CanonicalRelationship[];
};

export function normalizePackageTask<T extends {
  related_workflows?: string[];
  related_cheatsheets?: string[];
  related_models?: string[];
  related_patterns?: string[];
  related_decision_guides?: string[];
  related_package_tasks?: string[];
  related_apis?: string[];
}>(task: T, resolvers: RelationshipResolvers, context?: RelationshipContext): NormalizedPackageTask<T> {
  return {
    ...task,
    related_workflow_links: normalizeRelationshipList(task.related_workflows, 'related_workflows', resolvers, context),
    related_cheatsheet_links: normalizeRelationshipList(task.related_cheatsheets, 'related_cheatsheets', resolvers, context),
    related_model_links: normalizeRelationshipList(task.related_models, 'related_models', resolvers, context),
    related_pattern_links: normalizeRelationshipList(task.related_patterns, 'related_patterns', resolvers, context),
    related_decision_guide_links: normalizeRelationshipList(task.related_decision_guides, 'related_decision_guides', resolvers, context),
    related_package_task_links: normalizeRelationshipList(task.related_package_tasks, 'related_package_tasks', resolvers, context),
    related_api_links: normalizeRelationshipList(task.related_apis, 'related_apis', resolvers, context),
  };
}

export function normalizeCheatsheetEntry<T extends {
  related_packages?: string[];
  related_workflows?: string[];
  related_patterns?: string[];
  related_decision_guides?: string[];
  related_apis?: string[];
}>(entry: T, resolvers: RelationshipResolvers, context?: RelationshipContext): NormalizedCheatsheetEntry<T> {
  return {
    ...entry,
    related_package_links: normalizeRelationshipList(entry.related_packages, 'related_packages', resolvers, context),
    related_workflow_links: normalizeRelationshipList(entry.related_workflows, 'related_workflows', resolvers, context),
    related_pattern_links: normalizeRelationshipList(entry.related_patterns, 'related_patterns', resolvers, context),
    related_decision_guide_links: normalizeRelationshipList(entry.related_decision_guides, 'related_decision_guides', resolvers, context),
    related_api_links: normalizeRelationshipList(entry.related_apis, 'related_apis', resolvers, context),
  };
}

export function normalizePackage<T extends Package>(pkg: T, resolvers: RelationshipResolvers): T & { tasks: Array<NormalizedPackageTask<T['tasks'][number]>> } {
  return {
    ...pkg,
    tasks: pkg.tasks.map(task => normalizePackageTask(task, resolvers, { packageId: pkg.id })),
  };
}

export function normalizeCheatsheet<T extends Cheatsheet>(cheatsheet: T, resolvers: RelationshipResolvers): T & { entries: Array<NormalizedCheatsheetEntry<T['entries'][number]>> } {
  return {
    ...cheatsheet,
    entries: cheatsheet.entries.map(entry => normalizeCheatsheetEntry(entry, resolvers, { packageId: cheatsheet.package_reference ?? undefined })),
  };
}
