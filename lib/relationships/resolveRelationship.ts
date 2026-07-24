import type { ContentRef } from '@/lib/schemas/base';
import type { RelationshipRegistry } from './relationshipRegistry';
import type { CanonicalRelationship, RelationshipContext, RelationshipField, RelationshipResolvers } from './types';

const CONTENT_RELATIONSHIP_TARGETS: Record<Extract<RelationshipField, 'related_packages' | 'related_models' | 'related_patterns' | 'related_workflows' | 'related_cheatsheets' | 'related_decision_guides'>, ContentRef['type']> = {
  related_packages: 'package',
  related_models: 'model',
  related_patterns: 'pattern',
  related_workflows: 'workflow',
  related_cheatsheets: 'cheatsheet',
  related_decision_guides: 'decision_guide',
};

const PACKAGE_TASK_RELATIONSHIP_TYPES = new Set<RelationshipField>(['related_package_tasks', 'related_apis']);

export function resolveRelationship(
  rawId: string,
  relationshipType: RelationshipField,
  resolvers: RelationshipResolvers,
  context?: RelationshipContext,
): CanonicalRelationship | null {
  if (!rawId.trim()) return null;

  if (relationshipType in CONTENT_RELATIONSHIP_TARGETS) {
    const contentType = CONTENT_RELATIONSHIP_TARGETS[relationshipType as keyof typeof CONTENT_RELATIONSHIP_TARGETS];
    return resolvers.resolveContent(contentType, rawId);
  }

  if (PACKAGE_TASK_RELATIONSHIP_TYPES.has(relationshipType)) {
    return resolvers.resolvePackageTask(rawId, context);
  }

  return null;
}

export function createDefaultRelationshipResolvers(
  registry: RelationshipRegistry,
  resolveContent: RelationshipResolvers['resolveContent'],
): RelationshipResolvers {
  return {
    resolveContent,
    resolvePackageTask: (id: string, context?: RelationshipContext) => {
      const record = registry.resolvePackageTask(id, context);
      if (!record) return null;

      return {
        id,
        title: record.task,
        slug: record.slug,
        href: record.href,
        type: 'package_task',
      };
    },
  };
}
