import type { ContentRef } from '@/lib/schemas/base';
import type { CanonicalRelationship, RelationshipResolvers } from './types';

export interface KnowledgeGraphNode {
  id: string;
  type: string;
  name: string;
  href: string | null;
}

/**
 * Resolves relationship references into canonical, fully-navigable KnowledgeGraphNode objects.
 * 
 * - Reuses canonical relationship resolvers and relationship registry.
 * - Filters out broken IDs (missing content or null href).
 * - Merges duplicate nodes while preserving first-seen order.
 * - Excludes self-referential links back to the current active entity.
 */
export function resolveGraphNodes(
  rawItems: (ContentRef | CanonicalRelationship | string)[],
  resolvers: RelationshipResolvers,
  contentExists: (type: ContentRef['type'], id: string) => boolean,
  getContentPath: (type: ContentRef['type'], id: string) => string | null,
  getContentName: (type: ContentRef['type'], id: string) => string,
  currentType?: string,
  currentId?: string
): KnowledgeGraphNode[] {
  const seenKeys = new Set<string>();
  const seenHrefs = new Set<string>();
  const nodes: KnowledgeGraphNode[] = [];

  const currentKey = currentType && currentId ? `${currentType}:${currentId}` : null;
  const currentPath = currentType && currentId ? getContentPath(currentType as ContentRef['type'], currentId) : null;

  for (const item of rawItems) {
    if (!item) continue;

    let node: KnowledgeGraphNode | null = null;

    if (typeof item === 'string') {
      const trimmed = item.trim();
      if (!trimmed) continue;

      const taskRecord = resolvers.resolvePackageTask(
        trimmed,
        currentType === 'package' ? { packageId: currentId } : undefined
      );

      if (taskRecord && taskRecord.href) {
        node = {
          id: taskRecord.id,
          type: 'package_task',
          name: taskRecord.title,
          href: taskRecord.href,
        };
      } else {
        const contentTypes: ContentRef['type'][] = [
          'package',
          'model',
          'workflow',
          'cheatsheet',
          'pattern',
          'debug_guide',
          'decision_guide',
          'principle',
          'registry',
        ];

        for (const t of contentTypes) {
          if (contentExists(t, trimmed)) {
            const href = getContentPath(t, trimmed);
            if (href) {
              node = {
                id: trimmed,
                type: t,
                name: getContentName(t, trimmed),
                href,
              };
              break;
            }
          }
        }
      }
    } else if (typeof item === 'object') {
      const rawObject = item as Record<string, unknown>;
      const type = rawObject.type as string;
      const id = rawObject.id as string;
      const titleProp = (rawObject.title as string | undefined) || (rawObject.name as string | undefined);
      const hrefProp = rawObject.href as string | undefined;

      if (type && id) {
        if (type === 'package_task' || type === 'related_apis' || type === 'api') {
          const taskRecord = resolvers.resolvePackageTask(
            id,
            currentType === 'package' ? { packageId: currentId } : undefined
          );
          if (taskRecord && taskRecord.href) {
            node = {
              id: taskRecord.id,
              type: 'package_task',
              name: titleProp || taskRecord.title,
              href: taskRecord.href,
            };
          } else if (hrefProp) {
            node = {
              id,
              type: 'package_task',
              name: titleProp || id,
              href: hrefProp,
            };
          }
        } else {
          // Standard content types
          const path = getContentPath(type as ContentRef['type'], id);
          if (path) {
            node = {
              id,
              type,
              name: titleProp || getContentName(type as ContentRef['type'], id),
              href: path,
            };
          }
        }
      } else if (hrefProp && titleProp) {
        node = {
          id: id || titleProp.toLowerCase().replace(/\s+/g, '-'),
          type: type || 'package_task',
          name: titleProp,
          href: hrefProp,
        };
      }
    }

    // Broken IDs -> hidden
    if (!node || !node.href) {
      continue;
    }

    const key = `${node.type}:${node.id}`;

    // Exclude current page item
    if (currentKey && key === currentKey) {
      continue;
    }
    if (currentPath && node.href === currentPath) {
      continue;
    }

    // Duplicate nodes -> merged (order preserved)
    if (seenKeys.has(key) || seenHrefs.has(node.href)) {
      continue;
    }

    seenKeys.add(key);
    seenHrefs.add(node.href);
    nodes.push(node);
  }

  return nodes;
}
