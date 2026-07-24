import type { RelationshipContext } from './types';

interface PackageTaskSource {
  id: string;
  name: string;
  tasks: Array<{
    task: string;
    resource_id?: string;
    syntax?: string;
  }>;
}

interface PackageTaskRecord {
  packageId: string;
  packageName: string;
  task: string;
  slug: string;
  href: string;
  aliases: string[];
}

export interface RelationshipRegistry {
  resolvePackageTask: (id: string, context?: RelationshipContext) => PackageTaskRecord | null;
}

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function normalizeLookupKey(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/^`|`$/g, '')
    .replace(/[()]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+$/, '');
}

function cleanActionPrefix(value: string): string {
  return value.replace(/^(create|draw|plot|show|make|build|get|use|render|compute|calculate|generate)\s+/i, '');
}

function extractBacktickedValues(value: string): string[] {
  const matches = value.match(/`([^`]+)`/g) ?? [];
  return matches.map(match => match.slice(1, -1));
}

function buildAliases(task: PackageTaskSource['tasks'][number]): string[] {
  const aliasSet = new Set<string>();

  const addAlias = (value?: string) => {
    if (!value) return;
    const normalized = normalizeLookupKey(value);
    if (normalized) aliasSet.add(normalized);
  };

  addAlias(task.task);
  addAlias(cleanActionPrefix(task.task));
  addAlias(slugify(task.task));
  addAlias(task.resource_id);

  const syntaxName = task.syntax?.split('(')[0]?.trim();
  addAlias(syntaxName);

  extractBacktickedValues(task.task).forEach(addAlias);

  return Array.from(aliasSet);
}

export function createRelationshipRegistry(packages: PackageTaskSource[]): RelationshipRegistry {
  const packageTaskIndex = new Map<string, PackageTaskRecord[]>();
  const packageScopedIndex = new Map<string, Map<string, PackageTaskRecord[]>>();

  packages.forEach(pkg => {
    pkg.tasks.forEach(task => {
      const record: PackageTaskRecord = {
        packageId: pkg.id,
        packageName: pkg.name,
        task: task.task,
        slug: slugify(task.task),
        href: `/packages/${pkg.id}#${slugify(task.task)}`,
        aliases: buildAliases(task),
      };

      const scopedIndex = packageScopedIndex.get(pkg.id) ?? new Map<string, PackageTaskRecord[]>();
      record.aliases.forEach(alias => {
        const scopedRecords = scopedIndex.get(alias) ?? [];
        scopedRecords.push(record);
        scopedIndex.set(alias, scopedRecords);

        const globalRecords = packageTaskIndex.get(alias) ?? [];
        globalRecords.push(record);
        packageTaskIndex.set(alias, globalRecords);
      });

      packageScopedIndex.set(pkg.id, scopedIndex);
    });
  });

  const resolveFromIndex = (
    index: Map<string, PackageTaskRecord[]>,
    lookupId: string,
  ): PackageTaskRecord | null => {
    const normalizedLookup = normalizeLookupKey(lookupId);
    if (!normalizedLookup) return null;

    const records = index.get(normalizedLookup);
    return records?.[0] ?? null;
  };

  return {
    resolvePackageTask(id: string, context?: RelationshipContext) {
      if (context?.packageId) {
        const scopedIndex = packageScopedIndex.get(context.packageId);
        if (scopedIndex) {
          const scopedMatch = resolveFromIndex(scopedIndex, id);
          if (scopedMatch) return scopedMatch;
        }
      }

      return resolveFromIndex(packageTaskIndex, id);
    },
  };
}
