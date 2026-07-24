import type { ContentRef } from '@/lib/schemas/base';

export const RELATIONSHIP_FIELDS = [
  'related_packages',
  'related_models',
  'related_patterns',
  'related_workflows',
  'related_cheatsheets',
  'related_decision_guides',
  'related_package_tasks',
  'related_apis',
] as const;

export type RelationshipField = typeof RELATIONSHIP_FIELDS[number];

export type RelationshipTargetType = ContentRef['type'] | 'package_task' | 'problem';

export interface CanonicalRelationship {
  id: string;
  title: string;
  slug: string;
  href: string;
  type: RelationshipTargetType;
}

export interface RelationshipContext {
  packageId?: string;
  currentType?: string;
  currentId?: string;
}

export interface RelationshipResolvers {
  resolveContent: (type: ContentRef['type'], id: string) => CanonicalRelationship | null;
  resolvePackageTask: (id: string, context?: RelationshipContext) => CanonicalRelationship | null;
  resolveCanonicalId?: (rawId: string, expectedType?: RelationshipTargetType, context?: RelationshipContext) => CanonicalRelationship | null;
}

