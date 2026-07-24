import type { ContentRef } from '@/lib/schemas/base';
import type { CanonicalRelationship, RelationshipContext, RelationshipTargetType, RelationshipResolvers } from './types';

/**
 * Resource Type Registry Configuration.
 * Centralizes path and display rules for all supported canonical resource types.
 */
export interface ResourceTypeConfig {
  type: RelationshipTargetType;
  label: string;
  getPath: (id: string) => string;
}

export const RESOURCE_TYPE_REGISTRY: Record<RelationshipTargetType, ResourceTypeConfig> = {
  package: {
    type: 'package',
    label: 'Package',
    getPath: (id) => `/packages/${id}`,
  },
  cheatsheet: {
    type: 'cheatsheet',
    label: 'Cheatsheet',
    getPath: (id) => `/cheatsheets/${id}`,
  },
  workflow: {
    type: 'workflow',
    label: 'Workflow',
    getPath: (id) => `/workflows/${id}`,
  },
  pattern: {
    type: 'pattern',
    label: 'Pattern',
    getPath: (id) => `/patterns/${id}`,
  },
  model: {
    type: 'model',
    label: 'Model',
    getPath: (id) => `/models/${id}`,
  },
  decision_guide: {
    type: 'decision_guide',
    label: 'Decision Guide',
    getPath: (id) => `/decision-guides/${id}`,
  },
  debug_guide: {
    type: 'debug_guide',
    label: 'Debug Guide',
    getPath: (id) => `/debug-guides/${id}`,
  },
  principle: {
    type: 'principle',
    label: 'Principle',
    getPath: (id) => `/principles/${id}`,
  },
  registry: {
    type: 'registry',
    label: 'Registry',
    getPath: (id) => (id.includes('/') ? `/registry/families/${id}` : `/registry/families/${id}`),
  },
  problem: {
    type: 'problem',
    label: 'Problem',
    getPath: (id) => `/problem-index#${id}`,
  },
  package_task: {
    type: 'package_task',
    label: 'Package Task',
    getPath: (id) => `/packages/${id}`,
  },
};

/**
 * Deterministically normalizes relationship alias keys.
 */
export function normalizeAliasKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/^`|`$/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/g, '');
}

/**
 * Canonical Relationship Resolver
 * 
 * - Accepts raw relationship value (string or object ref)
 * - Normalizes aliases against registered mappings
 * - Resolves canonical IDs via provided resolvers
 * - Verifies entity existence
 * - Strips self-referential links
 * - Returns typed CanonicalRelationship object or null if invalid/missing
 */
export class CanonicalRelationshipResolver {
  private aliasMap: Map<string, string>;

  constructor(registeredAliases: string[] = []) {
    this.aliasMap = new Map<string, string>();
    registeredAliases.forEach((alias) => {
      const normalized = normalizeAliasKey(alias);
      if (normalized) {
        this.aliasMap.set(normalized, alias);
      }
    });
  }

  /**
   * Resolves a raw relationship value into a CanonicalRelationship object.
   */
  public resolve(
    rawRef: string | ContentRef | unknown,
    resolvers: RelationshipResolvers,
    expectedType?: RelationshipTargetType,
    context?: RelationshipContext
  ): CanonicalRelationship | null {
    if (!rawRef) return null;

    let targetId = '';
    let targetType: RelationshipTargetType | undefined = expectedType;

    if (typeof rawRef === 'string') {
      targetId = rawRef.trim();
    } else if (typeof rawRef === 'object' && rawRef !== null) {
      const obj = rawRef as Record<string, unknown>;
      if (typeof obj.id === 'string') targetId = obj.id.trim();
      if (typeof obj.type === 'string' && obj.type in RESOURCE_TYPE_REGISTRY) {
        targetType = obj.type as RelationshipTargetType;
      }
    }

    if (!targetId) return null;

    // Self-reference check
    if (context?.currentId && context?.currentType) {
      if (context.currentId === targetId && context.currentType === targetType) {
        return null; // Exclude self-referential link
      }
    }

    // Attempt Package Task resolution if expectedType is package_task
    if (targetType === 'package_task' || expectedType === 'package_task') {
      const taskRecord = resolvers.resolvePackageTask(targetId, context);
      if (taskRecord) return taskRecord;
    }

    // Try content resolution across registered types
    if (targetType && targetType !== 'package_task' && targetType !== 'problem') {
      const resolved = resolvers.resolveContent(targetType as ContentRef['type'], targetId);
      if (resolved) return resolved;
    }

    // Search all content types as fallback
    const contentTypes: ContentRef['type'][] = [
      'package',
      'cheatsheet',
      'workflow',
      'pattern',
      'model',
      'decision_guide',
      'debug_guide',
      'principle',
      'registry',
    ];

    for (const t of contentTypes) {
      const resolved = resolvers.resolveContent(t, targetId);
      if (resolved) return resolved;
    }

    // Try resolving package task as secondary fallback
    const taskRecord = resolvers.resolvePackageTask(targetId, context);
    if (taskRecord) return taskRecord;

    return null;
  }
}
