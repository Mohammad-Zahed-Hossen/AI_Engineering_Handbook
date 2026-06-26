import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import { Package } from '@/types/package';
import { Model, ModelCategory } from '@/types/model';
import { RegistryModel } from '@/types/registry';
import { REGISTRY_TASK_FILES, REGISTRY_FILE_TO_TASK } from './config/registry';
import type { RegistryTask } from './config/registry';
import { Workflow } from '@/types/workflow';
import { Cheatsheet } from '@/types/cheatsheet';
import { ContentRef } from '@/types/meta';

// Core data directory in the project workspace
const dataDir = path.join(process.cwd(), 'data');

/**
 * Generic helper to read and parse a JSON file from disk.
 * 
 * @template T - The expected TypeScript type
 * @param {string} filePath - Absolute path to the JSON file
 * @returns {T} The parsed and typed JSON data
 */
function readJSON<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

/**
 * Scans a subdirectory and returns a list of identifier strings derived from JSON file names.
 * Useful for static pre-rendering (generateStaticParams) and dynamic lists.
 * 
 * @param {string} subPath - The relative path under the data/ folder (e.g. 'packages')
 * @returns {string[]} An array of identifier strings
 */
function scanDirectoryForIds(subPath: string): readonly string[] {
  const dirPath = path.join(dataDir, subPath);
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  return fs.readdirSync(dirPath)
    .filter(file => file.endsWith('.json') && !file.startsWith('_'))
    .map(file => path.basename(file, '.json'))
    .sort((a, b) => a.localeCompare(b));
}

// ── Packages ──────────────────────────────────────────────

/**
 * Retrieves all registered package IDs from the packages index.
 * 
 * @returns {string[]} List of package IDs (e.g. ['numpy', 'pandas'])
 */
export const getAllPackageIds = cache(function getAllPackageIds(): readonly string[] {
  return scanDirectoryForIds('packages');
});

/**
 * Reads a single package's details from its JSON file.
 * 
 * @param {string} id - The package identifier (e.g. 'numpy')
 * @returns {Package} The package details
 */
export const getPackage = cache(function getPackage(id: string): Package {
  return readJSON<Package>(path.join(dataDir, 'packages', `${id}.json`));
});

/**
 * Fetches all packages by mapping over all package IDs.
 * 
 * @returns {Package[]} List of all packages
 */
export const getAllPackages = cache(function getAllPackages(): Package[] {
  return getAllPackageIds().map(id => getPackage(id));
});

// ── Models ─────────────────────────────────────────────────

/**
 * Retrieves all model IDs within a specific category (ml, dl, or llm).
 * 
 * @param {ModelCategory} category - Category prefix ('ml' | 'dl' | 'llm')
 * @returns {string[]} List of model IDs in that category
 */
export const getModelIds = cache(function getModelIds(category: ModelCategory): readonly string[] {
  return scanDirectoryForIds(`models/${category}`);
});

/**
 * Reads a specific model's details from its category folder.
 * 
 * @param {ModelCategory} category - Category folder ('ml' | 'dl' | 'llm')
 * @param {string} id - Model unique ID (e.g. 'random-forest')
 * @returns {Model} Model object
 */
export const getModel = cache(function getModel(category: ModelCategory, id: string): Model {
  return readJSON<Model>(path.join(dataDir, 'models', category, `${id}.json`));
});

/**
 * Fetches all models belonging to a specific category.
 * 
 * @param {ModelCategory} category - Category ('ml' | 'dl' | 'llm')
 * @returns {Model[]} List of models in the category
 */
export const getAllModels = cache(function getAllModels(category: ModelCategory): Model[] {
  return getModelIds(category).map(id => getModel(category, id));
});

// ── Registry ────────────────────────────────────────────────

/**
 * Retrieves list of all task keys available in the registry.
 * 
 * @returns {RegistryTask[]} List of tasks (e.g. ['embedding', 'vision'])
 */
export const getRegistryTasks = cache(function getRegistryTasks(): RegistryTask[] {
  const dirPath = path.join(dataDir, 'registry');
  if (!fs.existsSync(dirPath)) return [];

  const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.json'));

  return files
    .map(file => REGISTRY_FILE_TO_TASK[file])
    .filter((task): task is RegistryTask => task !== undefined)
    .sort((a, b) => a.localeCompare(b));
});

/**
 * Reads the list of registry models associated with a task.
 * 
 * @param {RegistryTask} task - Task name (e.g. 'embedding')
 * @returns {RegistryModel[]} Array of registry models
 */
export const getRegistryByTask = cache(function getRegistryByTask(task: RegistryTask): RegistryModel[] {
  return readJSON<RegistryModel[]>(
    path.join(dataDir, 'registry', REGISTRY_TASK_FILES[task])
  );
});

// ── Workflows ───────────────────────────────────────────────

/**
 * Retrieves all workflow IDs from the workflows index.
 * 
 * @returns {string[]} List of workflow IDs (e.g. ['rag'])
 */
export const getAllWorkflowIds = cache(function getAllWorkflowIds(): readonly string[] {
  return scanDirectoryForIds('workflows');
});

/**
 * Reads a single workflow spec.
 * 
 * @param {string} id - The workflow identifier
 * @returns {Workflow} workflow details
 */
export const getWorkflow = cache(function getWorkflow(id: string): Workflow {
  return readJSON<Workflow>(path.join(dataDir, 'workflows', `${id}.json`));
});

/**
 * Fetches all workflows from disk.
 * 
 * @returns {Workflow[]} List of all workflows
 */
export const getAllWorkflows = cache(function getAllWorkflows(): Workflow[] {
  return getAllWorkflowIds().map(id => getWorkflow(id));
});

// ── Cheatsheets ─────────────────────────────────────────────

/**
 * Retrieves all cheatsheet IDs from the cheatsheets index.
 * 
 * @returns {string[]} List of cheatsheet IDs (e.g. ['pytorch'])
 */
export const getAllCheatsheetIds = cache(function getAllCheatsheetIds(): readonly string[] {
  return scanDirectoryForIds('cheatsheets');
});

/**
 * Reads a single cheatsheet's group/syntax mappings.
 * 
 * @param {string} id - Cheatsheet name (e.g. 'pytorch')
 * @returns {Cheatsheet} cheatsheet details
 */
export const getCheatsheet = cache(function getCheatsheet(id: string): Cheatsheet {
  return readJSON<Cheatsheet>(path.join(dataDir, 'cheatsheets', `${id}.json`));
});

// ── Meta (dashboard) ────────────────────────────────────────

/**
 * Computes dashboard counts dynamically from the actual index files.
 * 
 * Approach: index-based counting.
 * We count elements in `_index.json` files (e.g. `packages/_index.json`, `models/ml/_index.json`)
 * rather than scanning and parsing every content file on disk. This provides an O(1) file-read
 * operation relative to total catalog size, ensuring zero latency.
 * 
 * Future Scalability (Recent Activity):
 * To add a "Recently Added" or "Recently Updated" feature in the future without major refactoring:
 * 1. Define a helper function `getAllContentMeta()` that scans and parses the metadata (`created_at`, `updated_at`)
 *    of all files using a lightweight schema (only validating the `BaseMeta` properties).
 * 2. Return sorted items based on dates.
 * 3. Add `recently_added` and `recently_updated` fields to the returned object of `getDashboardCounts()`, or
 *    rename it to `getDashboardData()` at that time.
 * 
 * @returns {{ packages: number; models_ml: number; models_dl: number; models_llm: number; workflows: number; cheatsheets: number; registry_tasks: number }}
 */
export const getDashboardCounts = cache(function getDashboardCounts(): {
  packages: number;
  models_ml: number;
  models_dl: number;
  models_llm: number;
  workflows: number;
  cheatsheets: number;
  registry_tasks: number;
} {
  return {
    packages: getAllPackageIds().length,
    models_ml: getModelIds('ml').length,
    models_dl: getModelIds('dl').length,
    models_llm: getModelIds('llm').length,
    workflows: getAllWorkflowIds().length,
    cheatsheets: getAllCheatsheetIds().length,
    registry_tasks: getRegistryTasks().length,
  };
});

// ── Navigation ──────────────────────────────────────────────

export interface NavItem {
  id: string;
  name: string;
  version?: string;
}

/**
 * Lightweight navigation retriever for python packages.
 */
export const getPackageNavItems = cache(function getPackageNavItems(): NavItem[] {
  const navPath = path.join(dataDir, 'packages', '_nav.json');
  if (!fs.existsSync(navPath)) {
    // Fallback: rebuild from full files (first run before script executes)
    return getAllPackageIds().map(id => {
      const data = readJSON<{ id: string; name: string; version: string }>(
        path.join(dataDir, 'packages', `${id}.json`)
      );
      return { id: data.id, name: data.name, version: data.version };
    });
  }
  return readJSON<NavItem[]>(navPath);
});

/**
 * Lightweight navigation retriever for models.
 */
export const getModelNavItems = cache(function getModelNavItems(category: ModelCategory): NavItem[] {
  const navPath = path.join(dataDir, 'models', category, '_nav.json');
  if (!fs.existsSync(navPath)) {
    return getModelIds(category).map(id => {
      const data = readJSON<{ id: string; name: string }>(
        path.join(dataDir, 'models', category, `${id}.json`)
      );
      return { id: data.id, name: data.name };
    });
  }
  return readJSON<NavItem[]>(navPath);
});

/**
 * Lightweight navigation retriever for workflows.
 */
export const getWorkflowNavItems = cache(function getWorkflowNavItems(): NavItem[] {
  const navPath = path.join(dataDir, 'workflows', '_nav.json');
  if (!fs.existsSync(navPath)) {
    return getAllWorkflowIds().map(id => {
      const data = readJSON<{ id: string; name: string }>(
        path.join(dataDir, 'workflows', `${id}.json`)
      );
      return { id: data.id, name: data.name };
    });
  }
  return readJSON<NavItem[]>(navPath);
});

/**
 * Lightweight navigation retriever for cheatsheets.
 */
export const getCheatsheetNavItems = cache(function getCheatsheetNavItems(): NavItem[] {
  const navPath = path.join(dataDir, 'cheatsheets', '_nav.json');
  if (!fs.existsSync(navPath)) {
    return getAllCheatsheetIds().map(id => {
      const data = readJSON<{ id: string; name: string }>(
        path.join(dataDir, 'cheatsheets', `${id}.json`)
      );
      return { id: data.id, name: data.name };
    });
  }
  return readJSON<NavItem[]>(navPath);
});

export interface RecentContentItem {
  id: string;
  name: string;
  type: 'package' | 'model' | 'workflow' | 'cheatsheet' | 'registry';
  updated_at: string;
  category?: string;
}

/**
 * Resolves a model's category dynamically by checking which subfolder contains its JSON file.
 * This lookup is fast because scanDirectoryForIds is React cached.
 */
export const getModelCategoryById = cache(function getModelCategoryById(id: string): ModelCategory | null {
  if (scanDirectoryForIds('models/ml').includes(id)) return 'ml';
  if (scanDirectoryForIds('models/dl').includes(id)) return 'dl';
  if (scanDirectoryForIds('models/llm').includes(id)) return 'llm';
  return null;
});

/**
 * Centralized exist check for handbook content entities.
 */
export function contentExists(type: 'model' | 'package' | 'workflow' | 'cheatsheet' | 'registry', id: string): boolean {
  if (type === 'package') {
    return fs.existsSync(path.join(dataDir, 'packages', `${id}.json`));
  }
  if (type === 'model') {
    return getModelCategoryById(id) !== null;
  }
  if (type === 'workflow') {
    return fs.existsSync(path.join(dataDir, 'workflows', `${id}.json`));
  }
  if (type === 'cheatsheet') {
    return fs.existsSync(path.join(dataDir, 'cheatsheets', `${id}.json`));
  }
  if (type === 'registry') {
    for (const task of getRegistryTasks()) {
      const models = getRegistryByTask(task);
      if (models.some(m => m.id === id)) return true;
    }
  }
  return false;
}

/**
 * Centralized metadata lookup utility for any handbook content type.
 */
export function loadContentMeta(
  type: 'model' | 'package' | 'workflow' | 'cheatsheet' | 'registry',
  id: string
): { name: string; updated_at: string } {
  try {
    if (type === 'package') {
      const p = getPackage(id);
      return { name: p.name, updated_at: p.updated_at };
    }
    if (type === 'model') {
      const cat = getModelCategoryById(id);
      if (cat) {
        const m = getModel(cat, id);
        return { name: m.name, updated_at: m.updated_at };
      }
    }
    if (type === 'workflow') {
      const w = getWorkflow(id);
      return { name: w.name, updated_at: w.updated_at };
    }
    if (type === 'cheatsheet') {
      const cs = getCheatsheet(id);
      return { name: cs.name, updated_at: cs.updated_at };
    }
    if (type === 'registry') {
      for (const task of getRegistryTasks()) {
        const models = getRegistryByTask(task);
        const model = models.find(m => m.id === id);
        if (model) return { name: model.id, updated_at: '' };
      }
    }
  } catch {
    // Graceful fallback
  }
  return {
    name: id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    updated_at: '',
  };
}

/**
 * Resolves the name of any content reference.
 * If the reference is not found in the content database, falls back to a start-cased version of the ID.
 */
export function getContentName(type: 'model' | 'package' | 'workflow' | 'cheatsheet' | 'registry', id: string): string {
  return loadContentMeta(type, id).name;
}

/**
 * Resolves the path of any content reference, checking if the file actually exists first.
 * Returns null if the target content has not yet been cataloged.
 */
export function getContentPath(type: 'model' | 'package' | 'workflow' | 'cheatsheet' | 'registry', id: string): string | null {
  if (!contentExists(type, id)) return null;
  if (type === 'package') return `/packages/${id}`;
  if (type === 'workflow') return `/workflows/${id}`;
  if (type === 'cheatsheet') return `/cheatsheets/${id}`;
  if (type === 'model') {
    const cat = getModelCategoryById(id);
    if (cat) return `/models/${cat}/${id}`;
  }
  if (type === 'registry') {
    for (const task of getRegistryTasks()) {
      const models = getRegistryByTask(task);
      if (models.some(m => m.id === id)) return `/registry/${task}`;
    }
  }
  return null;
}

function uniqueExistingRefs(refs: ContentRef[], current?: ContentRef): ContentRef[] {
  const seen = new Set<string>();

  return refs.filter(ref => {
    const key = `${ref.type}:${ref.id}`;
    const isCurrent = current?.type === ref.type && current.id === ref.id;

    if (isCurrent || seen.has(key) || !contentExists(ref.type, ref.id)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export const getRelatedContent = cache(function getRelatedContent(
  type: ContentRef['type'],
  id: string,
  category?: ModelCategory | string
): ContentRef[] {
  const current = { type, id } as ContentRef;

  if (type === 'package') {
    const pkg = getPackage(id);
    return uniqueExistingRefs([
      ...pkg.alternatives,
    ], current).slice(0, 6);
  }

  if (type === 'model') {
    const modelCategory = (category as ModelCategory | undefined) ?? getModelCategoryById(id);
    if (!modelCategory) return [];

    const model = getModel(modelCategory, id);
    const sameCategory = getAllModels(modelCategory)
      .filter(candidate => candidate.id !== id)
      .map(candidate => ({ type: 'model', id: candidate.id } satisfies ContentRef));
    const sameProblemType = getAllModels(modelCategory)
      .filter(candidate =>
        candidate.id !== id &&
        candidate.problem_types.some(problemType => model.problem_types.includes(problemType))
      )
      .map(candidate => ({ type: 'model', id: candidate.id } satisfies ContentRef));

    return uniqueExistingRefs([
      ...model.alternatives,
      ...sameCategory,
      ...sameProblemType,
    ], current).slice(0, 6);
  }

  if (type === 'workflow') {
    const workflow = getWorkflow(id);
    const allWorkflows = getAllWorkflows().filter(candidate => candidate.id !== id);
    const sharedCategory = allWorkflows
      .filter(candidate => candidate.category === workflow.category)
      .map(candidate => ({ type: 'workflow', id: candidate.id } satisfies ContentRef));
    const workflowTools = new Set(workflow.starter_stack);
    workflow.steps.forEach(step => step.tools.forEach(tool => workflowTools.add(tool)));
    const sharedTools = allWorkflows
      .filter(candidate => {
        const candidateTools = new Set(candidate.starter_stack);
        candidate.steps.forEach(step => step.tools.forEach(tool => candidateTools.add(tool)));
        return [...candidateTools].some(tool => workflowTools.has(tool));
      })
      .map(candidate => ({ type: 'workflow', id: candidate.id } satisfies ContentRef));

    return uniqueExistingRefs([...sharedCategory, ...sharedTools], current).slice(0, 6);
  }

  if (type === 'cheatsheet') {
    const packageRef: ContentRef[] = contentExists('package', id)
      ? [{ type: 'package', id }]
      : [];
    const relatedPackages = packageRef.length ? getPackage(id).alternatives : [];

    return uniqueExistingRefs([...packageRef, ...relatedPackages], current).slice(0, 6);
  }

  return [];
});

/** Fallback for when _nav.json indexes have not been built yet. */
function getRecentContentFallback(limit: number): RecentContentItem[] {
  const items: RecentContentItem[] = [];

  getAllPackageIds().forEach(id => {
    try {
      const p = getPackage(id);
      items.push({ id: p.id, name: p.name, type: 'package', updated_at: p.updated_at });
    } catch { /* skip */ }
  });

  (['ml', 'dl', 'llm'] as const).forEach(cat => {
    getModelIds(cat).forEach(id => {
      try {
        const m = getModel(cat, id);
        items.push({ id: m.id, name: m.name, type: 'model', updated_at: m.updated_at, category: cat });
      } catch { /* skip */ }
    });
  });

  getAllWorkflowIds().forEach(id => {
    try {
      const w = getWorkflow(id);
      items.push({ id: w.id, name: w.name, type: 'workflow', updated_at: w.updated_at });
    } catch { /* skip */ }
  });

  getAllCheatsheetIds().forEach(id => {
    try {
      const cs = getCheatsheet(id);
      items.push({ id: cs.id, name: cs.name, type: 'cheatsheet', updated_at: cs.updated_at });
    } catch { /* skip */ }
  });

  const normalizeDate = (v?: string) => typeof v === 'string' ? v : '';
  return items
    .sort((a, b) => {
      const d = normalizeDate(b.updated_at).localeCompare(normalizeDate(a.updated_at));
      return d !== 0 ? d : a.name.localeCompare(b.name);
    })
    .slice(0, limit);
}

/**
 * Retrieves the most recently updated entries by reading lightweight _nav.json
 * index files instead of all content files.
 * 
 * Falls back to the full file scan if _nav.json files are missing (e.g. first
 * run before build-nav-index has been executed).
 */
export const getRecentContent = cache(function getRecentContent(limit = 6): RecentContentItem[] {
  const navPaths = [
    path.join(dataDir, 'packages', '_nav.json'),
    path.join(dataDir, 'models', 'ml', '_nav.json'),
    path.join(dataDir, 'models', 'dl', '_nav.json'),
    path.join(dataDir, 'models', 'llm', '_nav.json'),
    path.join(dataDir, 'workflows', '_nav.json'),
    path.join(dataDir, 'cheatsheets', '_nav.json'),
  ];

  const allNavFilesExist = navPaths.every(p => fs.existsSync(p));

  if (!allNavFilesExist) {
    // Fallback: original full-scan implementation for first run
    return getRecentContentFallback(limit);
  }

  const items: RecentContentItem[] = [];

  for (const navPath of navPaths) {
    try {
      const entries = readJSON<Array<{
        id: string;
        name: string;
        type: 'package' | 'model' | 'workflow' | 'cheatsheet';
        updated_at?: string;
        category?: string;
      }>>(navPath);

      for (const entry of entries) {
        items.push({
          id: entry.id,
          name: entry.name,
          type: entry.type,
          updated_at: entry.updated_at ?? '',
          category: entry.category,
        });
      }
    } catch (e) {
      console.warn(`[getRecentContent] Failed to read nav index: ${navPath}`, e);
    }
  }

  const normalizeDate = (value?: string) => typeof value === 'string' ? value : '';

  return items
    .sort((a, b) => {
      const dateCompare = normalizeDate(b.updated_at).localeCompare(normalizeDate(a.updated_at));
      if (dateCompare !== 0) return dateCompare;
      return a.name.localeCompare(b.name);
    })
    .slice(0, limit);
});
