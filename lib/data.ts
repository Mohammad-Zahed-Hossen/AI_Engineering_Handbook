import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import { Package } from '@/types/package';
import { Model, ModelCategory, ModelSubcategory } from '@/types/model';
import { PackageSchema } from '@/lib/schemas/package';
import { ModelSchema } from '@/lib/schemas/model';
import { WorkflowSchema } from '@/lib/schemas/workflow';
import { CheatsheetSchema } from '@/lib/schemas/cheatsheet';
import { PatternSchema } from '@/lib/schemas/pattern';
import { DebugGuideSchema } from '@/lib/schemas/debug-guide';
import { DecisionGuideSchema } from '@/lib/schemas/decision-guide';
import { PrincipleSchema } from '@/lib/schemas/principle';
import { RegistryFamily, RegistryVariant } from '@/types/registry';
import { RegistryFamilySchema, RegistryVariantSchema } from '@/lib/schemas/registry';
import { Workflow } from '@/types/workflow';
import { Cheatsheet } from '@/types/cheatsheet';
import { Pattern } from '@/types/pattern';
import { DebugGuide } from '@/types/debug-guide';
import { DecisionGuide } from '@/types/decision-guide';
import { Principle } from '@/types/principle';
import { ContentRef, RelationshipType } from '@/lib/schemas/base';

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
  try {
    return fs.readdirSync(dirPath)
      .filter(file => file.endsWith('.json') && !file.startsWith('_'))
      .map(file => path.basename(file, '.json'))
      .sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
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
  const filePath = path.join(dataDir, 'packages', `${id}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Package not found: ${id}`);
  }
  const raw = readJSON<unknown>(filePath);
  return PackageSchema.parse(raw);
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
  const filePath = path.join(dataDir, 'models', category, `${id}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Model not found: ${category}/${id}`);
  }
  const raw = readJSON<unknown>(filePath);
  return ModelSchema.parse(raw);
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

/**
 * Reads categories comparison metadata from the categories index file.
 */
export const getModelCategories = cache(function getModelCategories(category: ModelCategory): Record<string, {
  label: string;
  description: string;
  comparison_columns: string[];
  decision_flow?: Array<{ question: string; if_yes: string; if_no: string }>;
  linked_decision_guide?: string | null;
}> {
  const filePath = path.join(dataDir, 'models', category, '_categories.json');
  if (!fs.existsSync(filePath)) {
    return {};
  }
  return readJSON<Record<string, {
    label: string;
    description: string;
    comparison_columns: string[];
    decision_flow?: Array<{ question: string; if_yes: string; if_no: string }>;
    linked_decision_guide?: string | null;
  }>>(filePath);
});

/**
 * Combines metadata and models belonging to a subcategory.
 */
export const getCategoryComparison = cache(function getCategoryComparison(category: ModelCategory, subcategory: ModelSubcategory) {
  const meta = getModelCategories(category)[subcategory] || null;
  const models = getAllModels(category).filter(m => m.subcategory === subcategory);
  return { meta, models };
});

// ── Registry Families (New Structure) ─────────────────────────

/**
 * Retrieves list of all registry family IDs.
 * 
 * @returns {string[]} List of family IDs (e.g. ['llama-3', 'deepseek'])
 */
export const getAllRegistryFamilyIds = cache(function getAllRegistryFamilyIds(): readonly string[] {
  const familiesDir = path.join(dataDir, 'registry', 'families');
  if (!fs.existsSync(familiesDir)) return [];
  
  return fs.readdirSync(familiesDir)
    .filter(file => {
      const stat = fs.statSync(path.join(familiesDir, file));
      return stat.isDirectory();
    })
    .sort((a, b) => a.localeCompare(b));
});

/**
 * Reads a single registry family's details.
 * 
 * @param {string} familyId - Family identifier (e.g. 'llama-3')
 * @returns {RegistryFamily} Family details
 */
export const getRegistryFamily = cache(function getRegistryFamily(familyId: string): RegistryFamily {
  const filePath = path.join(dataDir, 'registry', 'families', familyId, '_index.json');
  if (!fs.existsSync(filePath)) {
    throw new Error(`Registry family not found: ${familyId}`);
  }
  const raw = readJSON<unknown>(filePath);
  return RegistryFamilySchema.parse(raw);
});

/**
 * Reads all registry families.
 * 
 * @returns {RegistryFamily[]} List of all families
 */
export const getAllRegistryFamilies = cache(function getAllRegistryFamilies(): RegistryFamily[] {
  return getAllRegistryFamilyIds().map(id => getRegistryFamily(id));
});

/**
 * Retrieves list of all variant IDs for a given family.
 * 
 * @param {string} familyId - Family identifier
 * @returns {string[]} List of variant IDs
 */
export const getRegistryVariantIds = cache(function getRegistryVariantIds(familyId: string): readonly string[] {
  const familyDir = path.join(dataDir, 'registry', 'families', familyId);
  if (!fs.existsSync(familyDir)) return [];
  
  return fs.readdirSync(familyDir)
    .filter(file => file.endsWith('.json') && file !== '_index.json')
    .map(file => path.basename(file, '.json'))
    .sort((a, b) => a.localeCompare(b));
});

/**
 * Reads a single registry variant's details.
 * 
 * @param {string} familyId - Family identifier
 * @param {string} variantId - Variant identifier (e.g. '3-3-70b')
 * @returns {RegistryVariant} Variant details
 */
export const getRegistryVariant = cache(function getRegistryVariant(familyId: string, variantId: string): RegistryVariant {
  const filePath = path.join(dataDir, 'registry', 'families', familyId, `${variantId}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Registry variant not found: ${familyId}/${variantId}`);
  }
  const raw = readJSON<unknown>(filePath);
  return RegistryVariantSchema.parse(raw);
});

/**
 * Reads all variants for a given family.
 * 
 * @param {string} familyId - Family identifier
 * @returns {RegistryVariant[]} List of variants
 */
export const getRegistryVariantsByFamily = cache(function getRegistryVariantsByFamily(familyId: string): RegistryVariant[] {
  return getRegistryVariantIds(familyId).map(id => getRegistryVariant(familyId, id));
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
  const filePath = path.join(dataDir, 'workflows', `${id}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Workflow not found: ${id}`);
  }
  const raw = readJSON<unknown>(filePath);
  return WorkflowSchema.parse(raw);
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
  const filePath = path.join(dataDir, 'cheatsheets', `${id}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Cheatsheet not found: ${id}`);
  }
  const raw = readJSON<unknown>(filePath);
  return CheatsheetSchema.parse(raw);
});

/**
 * Fetches all cheatsheets by mapping over all cheatsheet IDs.
 * 
 * @returns {Cheatsheet[]} List of all cheatsheets
 */
export const getAllCheatsheets = cache(function getAllCheatsheets(): Cheatsheet[] {
  return getAllCheatsheetIds().map(id => getCheatsheet(id));
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
  registry_families: number;
} {
  return {
    packages: getAllPackageIds().length,
    models_ml: getModelIds('ml').length,
    models_dl: getModelIds('dl').length,
    models_llm: getModelIds('llm').length,
    workflows: getAllWorkflowIds().length,
    cheatsheets: getAllCheatsheetIds().length,
    registry_families: getAllRegistryFamilyIds().length,
  };
});

// ── Navigation ──────────────────────────────────────────────

export interface NavItem {
  id: string;
  name: string;
  version?: string;
  category?: string;
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

/**
 * Lightweight navigation retriever for registry families.
 */
export const getRegistryNavItems = cache(function getRegistryNavItems(): NavItem[] {
  return getAllRegistryFamilyIds().map(id => {
    const family = getRegistryFamily(id);
    return { id: family.id, name: family.name };
  });
});

// ── Patterns ───────────────────────────────────────────────

/**
 * Retrieves all pattern IDs from the patterns index.
 */
export const getAllPatternIds = cache(function getAllPatternIds(): readonly string[] {
  return scanDirectoryForIds('patterns');
});

/**
 * Reads a single pattern's details from its JSON file.
 */
export const getPattern = cache(function getPattern(id: string): Pattern {
  const filePath = path.join(dataDir, 'patterns', `${id}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Pattern not found: ${id}`);
  }
  const raw = readJSON<unknown>(filePath);
  return PatternSchema.parse(raw);
});

/**
 * Fetches all patterns by mapping over all pattern IDs.
 */
export const getAllPatterns = cache(function getAllPatterns(): Pattern[] {
  return getAllPatternIds().map(id => getPattern(id));
});

/**
 * Lightweight navigation retriever for patterns.
 */
export const getPatternNavItems = cache(function getPatternNavItems(): NavItem[] {
  const navPath = path.join(dataDir, 'patterns', '_nav.json');
  if (!fs.existsSync(navPath)) {
    return getAllPatternIds().map(id => {
      const data = readJSON<{ id: string; name?: string; title?: string }>(
        path.join(dataDir, 'patterns', `${id}.json`)
      );
      return { id: data.id, name: data.title || data.name || data.id };
    });
  }
  return readJSON<NavItem[]>(navPath);
});

// ── Debug Guides ───────────────────────────────────────────

/**
 * Retrieves all debug guide IDs from the debug-guides index.
 */
export const getAllDebugGuideIds = cache(function getAllDebugGuideIds(): readonly string[] {
  return scanDirectoryForIds('debug-guides');
});

/**
 * Reads a single debug guide's details from its JSON file.
 */
export const getDebugGuide = cache(function getDebugGuide(id: string): DebugGuide {
  const filePath = path.join(dataDir, 'debug-guides', `${id}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Debug Guide not found: ${id}`);
  }
  const raw = readJSON<unknown>(filePath);
  return DebugGuideSchema.parse(raw);
});

/**
 * Fetches all debug guides by mapping over all debug guide IDs.
 */
export const getAllDebugGuides = cache(function getAllDebugGuides(): DebugGuide[] {
  return getAllDebugGuideIds().map(id => getDebugGuide(id));
});

/**
 * Lightweight navigation retriever for debug guides.
 */
export const getDebugGuideNavItems = cache(function getDebugGuideNavItems(): NavItem[] {
  const navPath = path.join(dataDir, 'debug-guides', '_nav.json');
  if (!fs.existsSync(navPath)) {
    return getAllDebugGuideIds().map(id => {
      const data = readJSON<{ id: string; name?: string; title?: string }>(
        path.join(dataDir, 'debug-guides', `${id}.json`)
      );
      return { id: data.id, name: data.title || data.name || data.id };
    });
  }
  return readJSON<NavItem[]>(navPath);
});

// ── Decision Guides ───────────────────────────────────────

/**
 * Retrieves all decision guide IDs from the decision-guides index.
 */
export const getAllDecisionGuideIds = cache(function getAllDecisionGuideIds(): readonly string[] {
  return scanDirectoryForIds('decision-guides');
});

/**
 * Reads a single decision guide's details from its JSON file.
 */
export const getDecisionGuide = cache(function getDecisionGuide(id: string): DecisionGuide {
  const filePath = path.join(dataDir, 'decision-guides', `${id}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Decision Guide not found: ${id}`);
  }
  const raw = readJSON<unknown>(filePath);
  return DecisionGuideSchema.parse(raw);
});

/**
 * Fetches all decision guides by mapping over all decision guide IDs.
 */
export const getAllDecisionGuides = cache(function getAllDecisionGuides(): DecisionGuide[] {
  return getAllDecisionGuideIds().map(id => getDecisionGuide(id));
});

/**
 * Lightweight navigation retriever for decision guides.
 */
export const getDecisionGuideNavItems = cache(function getDecisionGuideNavItems(): NavItem[] {
  const navPath = path.join(dataDir, 'decision-guides', '_nav.json');
  if (!fs.existsSync(navPath)) {
    return getAllDecisionGuideIds().map(id => {
      const data = readJSON<{ id: string; name?: string; title?: string }>(
        path.join(dataDir, 'decision-guides', `${id}.json`)
      );
      return { id: data.id, name: data.title || data.name || data.id };
    });
  }
  return readJSON<NavItem[]>(navPath);
});

// ── Principles ──────────────────────────────────────────────

/**
 * Retrieves all principle IDs from the principles index.
 */
export const getAllPrincipleIds = cache(function getAllPrincipleIds(): readonly string[] {
  return scanDirectoryForIds('principles');
});

/**
 * Reads a single principle's details from its JSON file.
 */
export const getPrinciple = cache(function getPrinciple(id: string): Principle {
  const filePath = path.join(dataDir, 'principles', `${id}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Principle not found: ${id}`);
  }
  const raw = readJSON<unknown>(filePath);
  return PrincipleSchema.parse(raw);
});

/**
 * Fetches all principles by mapping over all principle IDs.
 */
export const getAllPrinciples = cache(function getAllPrinciples(): Principle[] {
  return getAllPrincipleIds().map(id => getPrinciple(id));
});

/**
 * Lightweight navigation retriever for principles.
 */
export const getPrincipleNavItems = cache(function getPrincipleNavItems(): NavItem[] {
  const navPath = path.join(dataDir, 'principles', '_nav.json');
  if (!fs.existsSync(navPath)) {
    return getAllPrincipleIds().map(id => {
      const data = readJSON<{ id: string; name?: string; title?: string }>(
        path.join(dataDir, 'principles', `${id}.json`)
      );
      return { id: data.id, name: data.title || data.name || data.id };
    });
  }
  return readJSON<NavItem[]>(navPath);
});

/**
 * Resolves a display name (e.g., "Logistic Regression") to a model slug and checks if it exists.
 * Used for cross-linking "Also Worth Knowing" chips to actual model pages.
 * 
 * @param displayName - The display name to resolve (e.g., "Logistic Regression")
 * @param category - The model category to search within
 * @returns The model slug if found, null otherwise
 */
export function resolveModelByName(displayName: string, category: ModelCategory): string | null {
  const slug = displayName.toLowerCase().replace(/\s+/g, '-');
  const modelIds = getModelIds(category);
  if (modelIds.includes(slug)) {
    return slug;
  }
  return null;
}

export const getRelatedKnowledgeResolver = cache(function getRelatedKnowledgeResolver() {
  const map = new Map<string, string>();
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

  // 1. Principles
  getAllPrinciples().forEach(p => {
    const url = `/principles/${p.id}`;
    if (p.id) map.set(`principle:${normalize(p.id)}`, url);
    if (p.slug) map.set(`principle:${normalize(p.slug)}`, url);
    if (p.name) map.set(`principle:${normalize(p.name)}`, url);
    if (p.title) map.set(`principle:${normalize(p.title)}`, url);
    if (Array.isArray(p.aliases)) {
      p.aliases.forEach(a => map.set(`principle:${normalize(a)}`, url));
    }
  });

  // 2. Workflows
  getAllWorkflows().forEach(w => {
    const url = `/workflows/${w.id}`;
    if (w.id) map.set(`workflow:${normalize(w.id)}`, url);
    if (w.slug) map.set(`workflow:${normalize(w.slug)}`, url);
    if (w.name) map.set(`workflow:${normalize(w.name)}`, url);
    if (w.title) map.set(`workflow:${normalize(w.title)}`, url);
    if (Array.isArray(w.aliases)) {
      w.aliases.forEach(a => map.set(`workflow:${normalize(a)}`, url));
    }
  });

  // 3. Patterns
  getAllPatterns().forEach(p => {
    const url = `/patterns/${p.id}`;
    if (p.id) map.set(`pattern:${normalize(p.id)}`, url);
    if (p.slug) map.set(`pattern:${normalize(p.slug)}`, url);
    if (p.name) map.set(`pattern:${normalize(p.name)}`, url);
    if (p.title) map.set(`pattern:${normalize(p.title)}`, url);
    if (Array.isArray(p.aliases)) {
      p.aliases.forEach(a => map.set(`pattern:${normalize(a)}`, url));
    }
  });

  // 4. Packages
  getAllPackages().forEach(p => {
    const url = `/packages/${p.id}`;
    if (p.id) map.set(`package:${normalize(p.id)}`, url);
    if (p.slug) map.set(`package:${normalize(p.slug)}`, url);
    if (p.name) map.set(`package:${normalize(p.name)}`, url);
    if (p.title) map.set(`package:${normalize(p.title)}`, url);
    if (Array.isArray(p.aliases)) {
      p.aliases.forEach(a => map.set(`package:${normalize(a)}`, url));
    }
  });

  // 5. Guides (check debug guides, decision guides, and cheatsheets)
  getAllDebugGuides().forEach(g => {
    const url = `/debug-guides/${g.id}`;
    if (g.id) map.set(`guide:${normalize(g.id)}`, url);
    if (g.slug) map.set(`guide:${normalize(g.slug)}`, url);
    if (g.name) map.set(`guide:${normalize(g.name)}`, url);
    if (g.title) map.set(`guide:${normalize(g.title)}`, url);
    if (Array.isArray(g.aliases)) {
      g.aliases.forEach(a => map.set(`guide:${normalize(a)}`, url));
    }
  });
  getAllDecisionGuides().forEach(g => {
    const url = `/decision-guides/${g.id}`;
    if (g.id) map.set(`guide:${normalize(g.id)}`, url);
    if (g.slug) map.set(`guide:${normalize(g.slug)}`, url);
    if (g.name) map.set(`guide:${normalize(g.name)}`, url);
    if (g.title) map.set(`guide:${normalize(g.title)}`, url);
    if (Array.isArray(g.aliases)) {
      g.aliases.forEach(a => map.set(`guide:${normalize(a)}`, url));
    }
  });
  getAllCheatsheetIds().forEach(id => {
    const url = `/cheatsheets/${id}`;
    map.set(`guide:${normalize(id)}`, url);
    try {
      const c = getCheatsheet(id);
      if (c.slug) map.set(`guide:${normalize(c.slug)}`, url);
      if (c.name) map.set(`guide:${normalize(c.name)}`, url);
      if (c.title) map.set(`guide:${normalize(c.title)}`, url);
      if (Array.isArray(c.aliases)) {
        c.aliases.forEach(a => map.set(`guide:${normalize(a)}`, url));
      }
    } catch {}
  });

  // 6. Registry (check families and variants)
  getAllRegistryFamilies().forEach(f => {
    const url = `/registry/families/${f.id}`;
    if (f.id) map.set(`registry:${normalize(f.id)}`, url);
    if (f.slug) map.set(`registry:${normalize(f.slug)}`, url);
    if (f.name) map.set(`registry:${normalize(f.name)}`, url);
    if (f.title) map.set(`registry:${normalize(f.title)}`, url);
    if (Array.isArray(f.aliases)) {
      f.aliases.forEach(a => map.set(`registry:${normalize(a)}`, url));
    }

    const variantIds = getRegistryVariantIds(f.id);
    variantIds.forEach(vid => {
      const vurl = `/registry/families/${f.id}/${vid}`;
      map.set(`registry:${normalize(vid)}`, vurl);
      try {
        const v = getRegistryVariant(f.id, vid);
        if (v.slug) map.set(`registry:${normalize(v.slug)}`, vurl);
        if (v.name) map.set(`registry:${normalize(v.name)}`, vurl);
        if (v.title) map.set(`registry:${normalize(v.title)}`, vurl);
        if (Array.isArray(v.aliases)) {
          v.aliases.forEach(a => map.set(`registry:${normalize(a)}`, vurl));
        }
      } catch {}
    });
  });

  // 7. Models
  const categories: ModelCategory[] = ['ml', 'dl', 'llm'];
  categories.forEach(cat => {
    getAllModels(cat).forEach(m => {
      const url = `/models/${cat}/${m.id}`;
      if (m.id) map.set(`model:${normalize(m.id)}`, url);
      if (m.slug) map.set(`model:${normalize(m.slug)}`, url);
      if (m.name) map.set(`model:${normalize(m.name)}`, url);
      if (m.title) map.set(`model:${normalize(m.title)}`, url);
      if (Array.isArray(m.aliases)) {
        m.aliases.forEach(a => map.set(`model:${normalize(a)}`, url));
      }
    });
  });

  return {
    resolve: (type: 'model' | 'principle' | 'workflow' | 'pattern' | 'package' | 'guide' | 'registry', name: string): string | null => {
      const norm = normalize(name);
      return map.get(`${type}:${norm}`) || null;
    }
  };
});


export interface RecentContentItem {
  id: string;
  name: string;
  type: 'package' | 'model' | 'workflow' | 'cheatsheet' | 'registry' | 'pattern' | 'debug_guide' | 'decision_guide' | 'principle';
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
export function contentExists(type: 'model' | 'package' | 'workflow' | 'cheatsheet' | 'registry' | 'pattern' | 'debug_guide' | 'decision_guide' | 'principle', id: string): boolean {
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
  if (type === 'pattern') {
    return fs.existsSync(path.join(dataDir, 'patterns', `${id}.json`));
  }
  if (type === 'debug_guide') {
    return fs.existsSync(path.join(dataDir, 'debug-guides', `${id}.json`));
  }
  if (type === 'decision_guide') {
    return fs.existsSync(path.join(dataDir, 'decision-guides', `${id}.json`));
  }
  if (type === 'principle') {
    return fs.existsSync(path.join(dataDir, 'principles', `${id}.json`));
  }
  if (type === 'registry') {
    // Check if it's a family ID
    const familyIds = getAllRegistryFamilyIds();
    if (familyIds.includes(id)) return true;
    
    // Check if it's a variant ID (format: familyId/variantId)
    if (id.includes('/')) {
      const [familyId, variantId] = id.split('/');
      if (familyIds.includes(familyId)) {
        const variantIds = getRegistryVariantIds(familyId);
        if (variantIds.includes(variantId)) return true;
      }
    }
  }
  return false;
}

/**
 * Centralized metadata lookup utility for any handbook content type.
 */
export function loadContentMeta(
  type: 'model' | 'package' | 'workflow' | 'cheatsheet' | 'registry' | 'pattern' | 'debug_guide' | 'decision_guide' | 'principle',
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
        return { name: m.name || m.title, updated_at: m.updated_at };
      }
    }
    if (type === 'workflow') {
      const w = getWorkflow(id);
      return { name: w.name || w.title, updated_at: w.updated_at };
    }
    if (type === 'cheatsheet') {
      const cs = getCheatsheet(id);
      return { name: cs.name || cs.title, updated_at: cs.updated_at };
    }
    if (type === 'pattern') {
      const pattern = getPattern(id);
      return { name: pattern.title || pattern.id, updated_at: pattern.updated_at };
    }
    if (type === 'debug_guide') {
      const dg = getDebugGuide(id);
      return { name: dg.title || dg.id, updated_at: dg.updated_at };
    }
    if (type === 'decision_guide') {
      const dg = getDecisionGuide(id);
      return { name: dg.title || dg.id, updated_at: dg.updated_at };
    }
    if (type === 'principle') {
      const principle = getPrinciple(id);
      return { name: principle.title || principle.id, updated_at: principle.updated_at };
    }
    if (type === 'registry') {
      // Check if it's a family ID
      const familyIds = getAllRegistryFamilyIds();
      if (familyIds.includes(id)) {
        const family = getRegistryFamily(id);
        return { name: family.name, updated_at: family.updated_at };
      }
      
      // Check if it's a variant ID (format: familyId/variantId)
      if (id.includes('/')) {
        const [familyId, variantId] = id.split('/');
        if (familyIds.includes(familyId)) {
          const variantIds = getRegistryVariantIds(familyId);
          if (variantIds.includes(variantId)) {
            const variant = getRegistryVariant(familyId, variantId);
            return { name: variant.name, updated_at: variant.updated_at };
          }
        }
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
export function getContentName(type: 'model' | 'package' | 'workflow' | 'cheatsheet' | 'registry' | 'pattern' | 'debug_guide' | 'decision_guide' | 'principle', id: string): string {
  return loadContentMeta(type, id).name;
}

/**
 * Resolves the path of any content reference, checking if the file actually exists first.
 * Returns null if the target content has not yet been cataloged.
 */
export function getContentPath(type: 'model' | 'package' | 'workflow' | 'cheatsheet' | 'registry' | 'pattern' | 'debug_guide' | 'decision_guide' | 'principle', id: string): string | null {
  if (!contentExists(type, id)) return null;
  if (type === 'package') return `/packages/${id}`;
  if (type === 'workflow') return `/workflows/${id}`;
  if (type === 'cheatsheet') return `/cheatsheets/${id}`;
  if (type === 'pattern') return `/patterns/${id}`;
  if (type === 'debug_guide') return `/debug-guides/${id}`;
  if (type === 'decision_guide') return `/decision-guides/${id}`;
  if (type === 'principle') return `/principles/${id}`;
  if (type === 'model') {
    const cat = getModelCategoryById(id);
    if (cat) return `/models/${cat}/${id}`;
  }
  if (type === 'registry') {
    // Check if it's a family ID
    const familyIds = getAllRegistryFamilyIds();
    if (familyIds.includes(id)) return `/registry/families/${id}`;
    
    // Check if it's a variant ID (format: familyId/variantId)
    if (id.includes('/')) {
      const [familyId, variantId] = id.split('/');
      if (familyIds.includes(familyId)) {
        const variantIds = getRegistryVariantIds(familyId);
        if (variantIds.includes(variantId)) return `/registry/families/${familyId}/${variantId}`;
      }
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

/**
 * Resolves workflow step cross-references into a lookup map.
 * Extracted from page.tsx to enable testing and reuse.
 */
export function resolveWorkflowStepLinks(workflow: Workflow): Record<string, Record<string, { name: string; href: string | null }>> {
  const resolvedLinks: Record<string, Record<string, { name: string; href: string | null }>> = {};
  const typeMap: Record<string, 'package' | 'model' | 'cheatsheet' | 'pattern' | 'debug_guide' | 'decision_guide' | 'principle'> = {
    packages: 'package',
    models: 'model',
    cheatsheets: 'cheatsheet',
    patterns: 'pattern',
    debug_guides: 'debug_guide',
    decision_guides: 'decision_guide',
    principles: 'principle',
  };

  workflow.steps.forEach(step => {
    if (step.uses) {
      Object.entries(step.uses).forEach(([key, ids]) => {
        if (!Array.isArray(ids)) return;
        const contentType = typeMap[key] || (key.endsWith('s') ? key.slice(0, -1) : key);
        if (!resolvedLinks[contentType]) {
          resolvedLinks[contentType] = {};
        }
        ids.forEach(id => {
          if (typeof id === 'string' && contentExists(contentType, id)) {
            resolvedLinks[contentType][id] = {
              name: getContentName(contentType, id),
              href: getContentPath(contentType, id),
            };
          }
        });
      });
    }
  });

  return resolvedLinks;
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
      ...(pkg.alternatives || []),
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

    const relatedRefs = (model.relatedcontent || []).map(ref => ({
      id: ref.id,
      type: ref.type as ContentRef['type'],
      relationship_type: ref.relationship as RelationshipType,
    }));

    return uniqueExistingRefs([
      ...relatedRefs,
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

    const typedRefs = [
      ...(workflow.related_patterns || []).map(id => ({ id, type: 'pattern' as const })),
      ...(workflow.related_models || []).map(id => ({ id, type: 'model' as const })),
      ...(workflow.related_packages || []).map(id => ({ id, type: 'package' as const })),
      ...(workflow.related_debug_guides || []).map(id => ({ id, type: 'debug_guide' as const })),
    ];

    return uniqueExistingRefs([...typedRefs, ...sharedCategory, ...sharedTools], current).slice(0, 6);
  }

  if (type === 'cheatsheet') {
    const packageRef: ContentRef[] = contentExists('package', id)
      ? [{ type: 'package', id }]
      : [];
    const relatedPackages = packageRef.length
      ? Array.isArray(getPackage(id).alternatives)
        ? getPackage(id).alternatives
        : []
      : [];

    return uniqueExistingRefs([...packageRef, ...relatedPackages], current).slice(0, 6);
  }

  if (type === 'pattern') {
    const pattern = getPattern(id);
    const typedRefs = [
      ...(pattern.related_workflows || []).map(id => ({ id, type: 'workflow' as const, relationship_type: 'related_workflows' })),
      ...(pattern.related_models || []).map(id => ({ id, type: 'model' as const, relationship_type: 'related_models' })),
      ...(pattern.related_packages || []).map(id => ({ id, type: 'package' as const, relationship_type: 'related_packages' })),
      ...(pattern.related_principles || []).map(id => ({ id, type: 'principle' as const, relationship_type: 'related_principles' })),
      ...(pattern.related_debug_guides || []).map(id => ({ id, type: 'debug_guide' as const, relationship_type: 'related_debug_guides' })),
      ...((pattern as { related_patterns?: string[] }).related_patterns || []).map((id: string) => ({ id, type: 'pattern' as const, relationship_type: 'related_patterns' })),
    ];
    return uniqueExistingRefs(typedRefs, current).slice(0, 6);
  }

  if (type === 'debug_guide') {
    const debugGuide = getDebugGuide(id);
    const typedRefs = [
      ...(debugGuide.related_packages || []).map(id => ({ id, type: 'package' as const, relationship_type: 'related_packages' })),
      ...(debugGuide.related_workflows || []).map(id => ({ id, type: 'workflow' as const, relationship_type: 'related_workflows' })),
      ...(debugGuide.related_patterns || []).map(id => ({ id, type: 'pattern' as const, relationship_type: 'related_patterns' })),
      ...(debugGuide.related_models || []).map(id => ({ id, type: 'model' as const, relationship_type: 'related_models' })),
      ...(debugGuide.related_registry || []).map(id => ({ id, type: 'registry' as const, relationship_type: 'related_registry' })),
    ];
    return uniqueExistingRefs(typedRefs, current).slice(0, 6);
  }

  if (type === 'decision_guide') {
    const decisionGuide = getDecisionGuide(id);
    const typedRefs = [
      ...(decisionGuide.related_workflows || []).map(id => ({ id, type: 'workflow' as const, relationship_type: 'related_workflows' })),
      ...(decisionGuide.related_packages || []).map(id => ({ id, type: 'package' as const, relationship_type: 'related_packages' })),
      ...(decisionGuide.related_models || []).map(id => ({ id, type: 'model' as const, relationship_type: 'related_models' })),
    ];
    return uniqueExistingRefs(typedRefs, current).slice(0, 6);
  }

  if (type === 'principle') {
    const principle = getPrinciple(id);
    const typedRefs = [
      ...(principle.referenced_by_patterns || []).map(id => ({ id, type: 'pattern' as const, relationship_type: 'referenced_by_patterns' })),
      ...(principle.referenced_by_models || []).map(id => ({ id, type: 'model' as const, relationship_type: 'referenced_by_models' })),
      ...(principle.referenced_by_workflows || []).map(id => ({ id, type: 'workflow' as const, relationship_type: 'referenced_by_workflows' })),
    ];
    return uniqueExistingRefs(typedRefs, current).slice(0, 6);
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
        items.push({ id: m.id, name: m.name || m.title, type: 'model', updated_at: m.updated_at, category: cat });
      } catch { /* skip */ }
    });
  });

  getAllWorkflowIds().forEach(id => {
    try {
      const w = getWorkflow(id);
      items.push({ id: w.id, name: w.name || w.title, type: 'workflow', updated_at: w.updated_at });
    } catch { /* skip */ }
  });

  getAllCheatsheetIds().forEach(id => {
    try {
      const cs = getCheatsheet(id);
      items.push({ id: cs.id, name: cs.name || cs.title, type: 'cheatsheet', updated_at: cs.updated_at });
    } catch { /* skip */ }
  });

  getAllPatternIds().forEach(id => {
    try {
      const pattern = getPattern(id);
      items.push({ id: pattern.id, name: pattern.title || pattern.id, type: 'pattern', updated_at: pattern.updated_at });
    } catch { /* skip */ }
  });

  getAllDebugGuideIds().forEach(id => {
    try {
      const dg = getDebugGuide(id);
      items.push({ id: dg.id, name: dg.title || dg.id, type: 'debug_guide', updated_at: dg.updated_at });
    } catch { /* skip */ }
  });

  getAllDecisionGuideIds().forEach(id => {
    try {
      const dg = getDecisionGuide(id);
      items.push({ id: dg.id, name: dg.title || dg.id, type: 'decision_guide', updated_at: dg.updated_at });
    } catch { /* skip */ }
  });

  getAllPrincipleIds().forEach(id => {
    try {
      const principle = getPrinciple(id);
      items.push({ id: principle.id, name: principle.title || principle.id, type: 'principle', updated_at: principle.updated_at });
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
    path.join(dataDir, 'patterns', '_nav.json'),
    path.join(dataDir, 'debug-guides', '_nav.json'),
    path.join(dataDir, 'decision-guides', '_nav.json'),
    path.join(dataDir, 'principles', '_nav.json'),
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
        type: 'package' | 'model' | 'workflow' | 'cheatsheet' | 'pattern' | 'debug_guide' | 'decision_guide' | 'principle';
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
