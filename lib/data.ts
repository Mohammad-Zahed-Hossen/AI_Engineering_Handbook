import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import { Package } from '@/types/package';
import { Model, ModelCategory } from '@/types/model';
import { RegistryModel, RegistryTask } from '@/types/registry';
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
    .filter(file => file.endsWith('.json'))
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

const REGISTRY_TASK_FILES: Record<RegistryTask, string> = {
  embedding: 'embeddings.json',
  reranker: 'rerankers.json',
  vision: 'vision.json',
  speech: 'speech.json',
  llm: 'llms.json',
  multimodal: 'multimodal.json',
  ocr: 'ocr.json',
};

/**
 * Retrieves list of all task keys available in the registry.
 * 
 * @returns {RegistryTask[]} List of tasks (e.g. ['embedding', 'vision'])
 */
export const getRegistryTasks = cache(function getRegistryTasks(): RegistryTask[] {
  const dirPath = path.join(dataDir, 'registry');
  if (!fs.existsSync(dirPath)) return [];

  const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.json'));

  const reverseMap: Record<string, RegistryTask> = {
    'embeddings.json': 'embedding',
    'rerankers.json': 'reranker',
    'vision.json': 'vision',
    'speech.json': 'speech',
    'llms.json': 'llm',
    'multimodal.json': 'multimodal',
    'ocr.json': 'ocr',
  };

  return files
    .map(file => reverseMap[file])
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
  return getAllPackageIds().map(id => {
    const data = readJSON<{ id: string; name: string; version: string }>(
      path.join(dataDir, 'packages', `${id}.json`)
    );
    return { id: data.id, name: data.name, version: data.version };
  });
});

/**
 * Lightweight navigation retriever for models.
 */
export const getModelNavItems = cache(function getModelNavItems(category: ModelCategory): NavItem[] {
  return getModelIds(category).map(id => {
    const data = readJSON<{ id: string; name: string }>(
      path.join(dataDir, 'models', category, `${id}.json`)
    );
    return { id: data.id, name: data.name };
  });
});

/**
 * Lightweight navigation retriever for workflows.
 */
export const getWorkflowNavItems = cache(function getWorkflowNavItems(): NavItem[] {
  return getAllWorkflowIds().map(id => {
    const data = readJSON<{ id: string; name: string }>(
      path.join(dataDir, 'workflows', `${id}.json`)
    );
    return { id: data.id, name: data.name };
  });
});

/**
 * Lightweight navigation retriever for cheatsheets.
 */
export const getCheatsheetNavItems = cache(function getCheatsheetNavItems(): NavItem[] {
  return getAllCheatsheetIds().map(id => {
    const data = readJSON<{ id: string; name: string }>(
      path.join(dataDir, 'cheatsheets', `${id}.json`)
    );
    return { id: data.id, name: data.name };
  });
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
        if (model) return { name: model.model_id || model.id, updated_at: model.updated_at };
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

const PACKAGE_LEARNING_PATHS: Record<string, ContentRef[]> = {
  numpy: [
    { type: 'package', id: 'pandas' },
    { type: 'package', id: 'polars' },
    { type: 'package', id: 'dask' },
  ],
  pandas: [
    { type: 'package', id: 'numpy' },
    { type: 'package', id: 'polars' },
    { type: 'package', id: 'dask' },
  ],
  polars: [
    { type: 'package', id: 'pandas' },
    { type: 'package', id: 'dask' },
    { type: 'package', id: 'numpy' },
  ],
  dask: [
    { type: 'package', id: 'pandas' },
    { type: 'package', id: 'polars' },
    { type: 'package', id: 'numpy' },
  ],
  pytorch: [
    { type: 'package', id: 'jax' },
    { type: 'package', id: 'numpy' },
  ],
  jax: [
    { type: 'package', id: 'numpy' },
    { type: 'package', id: 'cupy' },
  ],
};

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
      ...(PACKAGE_LEARNING_PATHS[id] ?? []),
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

/**
 * Retrieves the most recently created or updated entries across packages, models, workflows, cheatsheets, and registry items.
 */
export const getRecentContent = cache(function getRecentContent(limit = 6): RecentContentItem[] {
  const items: RecentContentItem[] = [];

  // Packages
  getAllPackageIds().forEach(id => {
    try {
      const p = getPackage(id);
      items.push({
        id: p.id,
        name: p.name,
        type: 'package',
        updated_at: p.updated_at,
      });
    } catch (e) {
      console.warn(`[getRecentContent] Failed to load package/${id}:`, e);
    }
  });

  // Models
  (['ml', 'dl', 'llm'] as const).forEach(cat => {
    getModelIds(cat).forEach(id => {
      try {
        const m = getModel(cat, id);
        items.push({
          id: m.id,
          name: m.name,
          type: 'model',
          updated_at: m.updated_at,
          category: cat,
        });
      } catch (e) {
        console.warn(`[getRecentContent] Failed to load model/${cat}/${id}:`, e);
      }
    });
  });

  // Workflows
  getAllWorkflowIds().forEach(id => {
    try {
      const w = getWorkflow(id);
      items.push({
        id: w.id,
        name: w.name,
        type: 'workflow',
        updated_at: w.updated_at,
      });
    } catch (e) {
      console.warn(`[getRecentContent] Failed to load workflow/${id}:`, e);
    }
  });

  // Cheatsheets
  getAllCheatsheetIds().forEach(id => {
    try {
      const cs = getCheatsheet(id);
      items.push({
        id: cs.id,
        name: cs.name,
        type: 'cheatsheet',
        updated_at: cs.updated_at,
      });
    } catch (e) {
      console.warn(`[getRecentContent] Failed to load cheatsheet/${id}:`, e);
    }
  });

  // Registry
  getRegistryTasks().forEach(task => {
    try {
      const models = getRegistryByTask(task);
      models.forEach(entry => {
        items.push({
          id: entry.id,
          name: entry.model_id,
          type: 'registry',
          updated_at: entry.updated_at,
          category: task,
        });
      });
    } catch (e) {
      console.warn(`[getRecentContent] Failed to load registry task '${task}':`, e);
    }
  });

  // Sort by updated_at descending, then name ascending
  return items
    .sort((a, b) => {
      const dateCompare = b.updated_at.localeCompare(a.updated_at);
      if (dateCompare !== 0) return dateCompare;
      return a.name.localeCompare(b.name);
    })
    .slice(0, limit);
});
