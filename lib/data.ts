import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import { Package, PackageTask } from '@/types/package';
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
import { Cheatsheet, CheatsheetEntry } from '@/types/cheatsheet';
import { Pattern } from '@/types/pattern';
import { DebugGuide } from '@/types/debug-guide';
import { DecisionGuide } from '@/types/decision-guide';
import { Principle } from '@/types/principle';
import { ContentRef, RelationshipType } from '@/lib/schemas/base';
import type { CanonicalRelationship } from '@/lib/relationships/types';
import { createDefaultRelationshipResolvers } from '@/lib/relationships/resolveRelationship';
import { createRelationshipRegistry } from '@/lib/relationships/relationshipRegistry';
import { normalizeCheatsheet, normalizePackage } from '@/lib/relationships/normalizeRelationships';
import { resolveGraphNodes as resolveGraphNodesCore, type KnowledgeGraphNode } from '@/lib/relationships/graphResolver';

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

const readPackageRaw = cache(function readPackageRaw(id: string): Package {
  const filePath = path.join(dataDir, 'packages', `${id}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Package not found: ${id}`);
  }
  const raw = readJSON<unknown>(filePath);
  return PackageSchema.parse(raw);
});

const readCheatsheetRaw = cache(function readCheatsheetRaw(id: string): Cheatsheet {
  const filePath = path.join(dataDir, 'cheatsheets', `${id}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Cheatsheet not found: ${id}`);
  }
  const raw = readJSON<unknown>(filePath);
  return CheatsheetSchema.parse(raw);
});

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

const getPackageRelationshipRegistry = cache(function getPackageRelationshipRegistry() {
  return createRelationshipRegistry(getAllPackageIds().map(id => readPackageRaw(id)));
});

export const getDefaultRelationshipResolvers = cache(function getDefaultRelationshipResolvers() {
  return createDefaultRelationshipResolvers(
    getPackageRelationshipRegistry(),
    (type, relationshipId) => {
      const href = getContentPath(type, relationshipId);
      if (!href) return null;

      return {
        id: relationshipId,
        title: getContentName(type, relationshipId),
        slug: relationshipId,
        href,
        type,
      };
    }
  );
});

/**
 * Reads a single package's details from its JSON file.
 * 
 * @param {string} id - The package identifier (e.g. 'numpy')
 * @returns {Package} The package details
 */
export const getPackage = cache(function getPackage(id: string): Package {
  const pkg = readPackageRaw(id);
  return normalizePackage(pkg, getDefaultRelationshipResolvers());
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
  const cheatsheet = readCheatsheetRaw(id);
  return normalizeCheatsheet(cheatsheet, getDefaultRelationshipResolvers());
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

import type { NavItem } from '@/types/nav';
export type { NavItem };


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
  const navPath = path.join(dataDir, 'registry', 'families', '_nav.json');
  if (!fs.existsSync(navPath)) {
    return getAllRegistryFamilyIds().map(id => {
      const family = getRegistryFamily(id);
      return { id: family.id, name: family.name };
    });
  }
  return readJSON<NavItem[]>(navPath);
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

function collectRelatedContent(
  type: ContentRef['type'],
  id: string,
  category?: ModelCategory | string
): ContentRef[] {
  const current = { type, id } as ContentRef;

  if (type === 'package') {
    const pkg = getPackage(id);
    return uniqueExistingRefs([
      ...(pkg.alternatives || []),
    ], current);
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
    ], current);
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

    return uniqueExistingRefs([...typedRefs, ...sharedCategory, ...sharedTools], current);
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

    return uniqueExistingRefs([...packageRef, ...relatedPackages], current);
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
    return uniqueExistingRefs(typedRefs, current);
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
    return uniqueExistingRefs(typedRefs, current);
  }

  if (type === 'decision_guide') {
    const decisionGuide = getDecisionGuide(id);
    const typedRefs = [
      ...(decisionGuide.related_workflows || []).map(id => ({ id, type: 'workflow' as const, relationship_type: 'related_workflows' })),
      ...(decisionGuide.related_packages || []).map(id => ({ id, type: 'package' as const, relationship_type: 'related_packages' })),
      ...(decisionGuide.related_models || []).map(id => ({ id, type: 'model' as const, relationship_type: 'related_models' })),
    ];
    return uniqueExistingRefs(typedRefs, current);
  }

  if (type === 'principle') {
    const principle = getPrinciple(id);
    const typedRefs = [
      ...(principle.referenced_by_patterns || []).map(id => ({ id, type: 'pattern' as const, relationship_type: 'referenced_by_patterns' })),
      ...(principle.referenced_by_models || []).map(id => ({ id, type: 'model' as const, relationship_type: 'referenced_by_models' })),
      ...(principle.referenced_by_workflows || []).map(id => ({ id, type: 'workflow' as const, relationship_type: 'referenced_by_workflows' })),
    ];
    return uniqueExistingRefs(typedRefs, current);
  }

  return [];
}

export const getRelatedContent = cache(function getRelatedContent(
  type: ContentRef['type'],
  id: string,
  category?: ModelCategory | string
): ContentRef[] {
  return collectRelatedContent(type, id, category).slice(0, 6);
});

/**
 * Collects all canonical normalized relationships for a given content entity.
 */
export function getCanonicalRelationshipsForEntity(
  type: string,
  id: string,
  category?: string
): (ContentRef | CanonicalRelationship)[] {
  const items: (ContentRef | CanonicalRelationship)[] = [];

  const baseRelated = collectRelatedContent(type as ContentRef['type'], id, category as ModelCategory);
  items.push(...baseRelated);

  try {
    if (type === 'package') {
      const pkg = getPackage(id);
      if (pkg.tasks) {
        pkg.tasks.forEach((task: PackageTask) => {
          if (task.related_workflow_links) items.push(...task.related_workflow_links);
          if (task.related_cheatsheet_links) items.push(...task.related_cheatsheet_links);
          if (task.related_model_links) items.push(...task.related_model_links);
          if (task.related_pattern_links) items.push(...task.related_pattern_links);
          if (task.related_decision_guide_links) items.push(...task.related_decision_guide_links);
          if (task.related_package_task_links) items.push(...task.related_package_task_links);
          if (task.related_api_links) items.push(...task.related_api_links);
        });
      }
    } else if (type === 'cheatsheet') {
      const cs = getCheatsheet(id);
      if (cs.entries) {
        cs.entries.forEach((entry: CheatsheetEntry) => {
          if (entry.related_package_links) items.push(...entry.related_package_links);
          if (entry.related_workflow_links) items.push(...entry.related_workflow_links);
          if (entry.related_pattern_links) items.push(...entry.related_pattern_links);
          if (entry.related_decision_guide_links) items.push(...entry.related_decision_guide_links);
          if (entry.related_api_links) items.push(...entry.related_api_links);
        });
      }
    }
  } catch {
    // Graceful fallback
  }

  return items;
}

export function resolveGraphNodes(
  rawItems: (ContentRef | CanonicalRelationship | string)[],
  currentType?: string,
  currentId?: string
): KnowledgeGraphNode[] {
  return resolveGraphNodesCore(
    rawItems,
    getDefaultRelationshipResolvers(),
    contentExists,
    getContentPath,
    getContentName,
    currentType,
    currentId
  );
}

/**
 * Reusable helper to determine whether the Knowledge Graph panel provides unique graph nodes
 * beyond what RelatedContent already displays.
 */
export function shouldRenderKnowledgeGraph(
  relatedContent: ContentRef[],
  graphNodes: KnowledgeGraphNode[]
): boolean {
  if (!graphNodes || graphNodes.length === 0) return false;
  const relatedKeys = new Set((relatedContent || []).map(r => `${r.type}:${r.id}`));
  return graphNodes.some(node => !relatedKeys.has(`${node.type}:${node.id}`));
}

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

// ── Dashboard Helpers ─────────────────────────────────────────────

export interface IntentItem {
  intent: string;
  target: string;
  priority: number;
  icon: string;
  description: string;
}

/**
 * Loads developer intent shortcuts from the dashboard configuration.
 */
export const getDashboardIntents = cache(function getDashboardIntents(): IntentItem[] {
  const filePath = path.join(dataDir, 'dashboard', 'intents.json');
  if (!fs.existsSync(filePath)) {
    return [];
  }
  return readJSON<IntentItem[]>(filePath);
});

/**
 * Loads popular search terms from the dashboard configuration.
 */
export const getPopularSearches = cache(function getPopularSearches(): string[] {
  const filePath = path.join(dataDir, 'dashboard', 'popular-searches.json');
  if (!fs.existsSync(filePath)) {
    return [];
  }
  return readJSON<string[]>(filePath);
});

/**
 * Resolves a popular search term to its canonical destination.
 * Returns the href if a known destination exists, or null to fall back to search.
 */
export function resolvePopularSearch(term: string): string | null {
  const normalized = term.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Map popular search terms to their canonical destinations
  const popularSearchMap: Record<string, string> = {
    // PyTorch → Packages
    pytorch: '/packages/pytorch',
    // Transformer → Models (dl category)
    transformer: '/models/dl/transformer',
    // CUDA → Debug Guide
    cuda: '/debug-guides/cuda-out-of-memory',
    // RAG → Workflow
    rag: '/workflows/build-rag-system',
    // Fine-tuning → Decision Guide
    finetuning: '/decision-guides/rag-vs-fine-tuning',
  };
  
  return popularSearchMap[normalized] || null;
}

/**
 * Loads recommendation mappings for personalized suggestions.
 */
export interface RecommendationMapping {
  recommendations: string[];
}

export const getRecommendations = cache(function getRecommendations(): Record<string, RecommendationMapping> {
  const filePath = path.join(dataDir, 'dashboard', 'recommendations.json');
  if (!fs.existsSync(filePath)) {
    return {};
  }
  return readJSON<Record<string, RecommendationMapping>>(filePath);
});

/**
 * Centralized href resolver for any content item.
 * Returns the correct href for a content item based on its type and id.
 * For models, the category must be provided.
 */
export function getContentHref(
  type: 'package' | 'model' | 'workflow' | 'cheatsheet' | 'pattern' | 'debug_guide' | 'decision_guide' | 'principle' | 'registry',
  id: string,
  category?: string
): string | null {
  if (type === 'package') {
    return contentExists('package', id) ? `/packages/${id}` : null;
  }
  if (type === 'workflow') {
    return contentExists('workflow', id) ? `/workflows/${id}` : null;
  }
  if (type === 'cheatsheet') {
    return contentExists('cheatsheet', id) ? `/cheatsheets/${id}` : null;
  }
  if (type === 'pattern') {
    return contentExists('pattern', id) ? `/patterns/${id}` : null;
  }
  if (type === 'debug_guide') {
    return contentExists('debug_guide', id) ? `/debug-guides/${id}` : null;
  }
  if (type === 'decision_guide') {
    return contentExists('decision_guide', id) ? `/decision-guides/${id}` : null;
  }
  if (type === 'principle') {
    return contentExists('principle', id) ? `/principles/${id}` : null;
  }
  if (type === 'model') {
    const cat = category as ModelCategory | undefined ?? getModelCategoryById(id);
    if (cat) {
      return contentExists('model', id) ? `/models/${cat}/${id}` : null;
    }
    return null;
  }
  if (type === 'registry') {
    // Check if it's a family ID
    const familyIds = getAllRegistryFamilyIds();
    if (familyIds.includes(id)) {
      return `/registry/families/${id}`;
    }
    // Check if it's a variant ID (format: familyId/variantId)
    if (id.includes('/')) {
      const [familyId, variantId] = id.split('/');
      if (familyIds.includes(familyId)) {
        const variantIds = getRegistryVariantIds(familyId);
        if (variantIds.includes(variantId)) {
          return `/registry/families/${familyId}/${variantId}`;
        }
      }
    }
    return null;
  }
  return null;
}

/**
 * Gets recommended content IDs based on a source content ID.
 * Returns up to 4 recommendations that actually exist in the handbook.
 */
export function getRecommendedContent(sourceId: string, limit = 4): Array<{ id: string; type: string; name: string; href: string | null }> {
  const mappings = getRecommendations();
  const mapping = mappings[sourceId];
  
  if (!mapping || !mapping.recommendations) {
    return [];
  }
  
  const recommendations: Array<{ id: string; type: string; name: string; href: string | null }> = [];
  
  for (const recId of mapping.recommendations) {
    // Try to find the content type and path
    let found = false;
    
    // Check packages
    if (contentExists('package', recId)) {
      const pkg = getPackage(recId);
      recommendations.push({ id: recId, type: 'package', name: pkg.name, href: getContentHref('package', recId) });
      found = true;
    }
    // Check workflows
    else if (contentExists('workflow', recId)) {
      const wf = getWorkflow(recId);
      recommendations.push({ id: recId, type: 'workflow', name: wf.name || wf.title, href: getContentHref('workflow', recId) });
      found = true;
    }
    // Check models (need to check all categories)
    else {
      const categories: ModelCategory[] = ['ml', 'dl', 'llm'];
      for (const cat of categories) {
        if (contentExists('model', recId)) {
          const model = getModel(cat, recId);
          recommendations.push({ id: recId, type: 'model', name: model.name || model.title, href: getContentHref('model', recId, cat) });
          found = true;
          break;
        }
      }
    }
    
    if (found && recommendations.length >= limit) break;
  }
  
  return recommendations;
}

/**
 * Gets recently added content based on created_at metadata.
 */
export const getRecentlyAdded = cache(function getRecentlyAdded(limit = 5): RecentContentItem[] {
  // Collect all content with created_at
  const allItems: Array<RecentContentItem & { created_at: string }> = [];
  
  // Packages
  getAllPackageIds().forEach(id => {
    try {
      const p = getPackage(id);
      allItems.push({ id: p.id, name: p.name, type: 'package', updated_at: p.updated_at, created_at: p.created_at });
    } catch {}
  });
  
  // Models
  (['ml', 'dl', 'llm'] as const).forEach(cat => {
    getModelIds(cat).forEach(id => {
      try {
        const m = getModel(cat, id);
        allItems.push({ id: m.id, name: m.name || m.title, type: 'model', updated_at: m.updated_at, created_at: m.created_at, category: cat });
      } catch {}
    });
  });
  
  // Workflows
  getAllWorkflowIds().forEach(id => {
    try {
      const w = getWorkflow(id);
      allItems.push({ id: w.id, name: w.name || w.title, type: 'workflow', updated_at: w.updated_at, created_at: w.created_at });
    } catch {}
  });
  
  // Cheatsheets
  getAllCheatsheetIds().forEach(id => {
    try {
      const cs = getCheatsheet(id);
      allItems.push({ id: cs.id, name: cs.name || cs.title, type: 'cheatsheet', updated_at: cs.updated_at, created_at: cs.created_at });
    } catch {}
  });
  
  // Patterns
  getAllPatternIds().forEach(id => {
    try {
      const p = getPattern(id);
      allItems.push({ id: p.id, name: p.title || p.id, type: 'pattern', updated_at: p.updated_at, created_at: p.created_at });
    } catch {}
  });
  
  // Debug guides
  getAllDebugGuideIds().forEach(id => {
    try {
      const dg = getDebugGuide(id);
      allItems.push({ id: dg.id, name: dg.title || dg.id, type: 'debug_guide', updated_at: dg.updated_at, created_at: dg.created_at });
    } catch {}
  });
  
  // Decision guides
  getAllDecisionGuideIds().forEach(id => {
    try {
      const dg = getDecisionGuide(id);
      allItems.push({ id: dg.id, name: dg.title || dg.id, type: 'decision_guide', updated_at: dg.updated_at, created_at: dg.created_at });
    } catch {}
  });
  
  // Principles
  getAllPrincipleIds().forEach(id => {
    try {
      const principle = getPrinciple(id);
      allItems.push({ id: principle.id, name: principle.title || principle.id, type: 'principle', updated_at: principle.updated_at, created_at: principle.created_at });
    } catch {}
  });
  
  // Sort by created_at descending and return
  return allItems
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, limit) as RecentContentItem[];
});

/**
 * Loads problem categories from the taxonomy file.
 */
export interface ProblemCategory {
  id: string;
  name: string;
  description: string;
}

export const getProblemCategories = cache(function getProblemCategories(): ProblemCategory[] {
  const filePath = path.join(dataDir, 'problem-index', 'taxonomy.json');
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const taxonomy = readJSON<Record<string, { description: string; problems: { id: string; name: string; description: string }[] }>>(filePath);
  const categories: ProblemCategory[] = [];
  
  Object.entries(taxonomy).forEach(([name, data]) => {
    if (data.problems && data.problems.length > 0) {
      categories.push({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name: name,
        description: data.description
      });
    }
  });
  
  return categories;
});

/**
 * Gets preview items for knowledge explorer cards.
 */
export interface KnowledgePreviewItem {
  id: string;
  name: string;
  tasks?: number;
  steps?: number;
}

export const getKnowledgeExplorerPreview = cache(function getKnowledgeExplorerPreview(
  type: 'package' | 'model' | 'workflow',
  limit: number
): KnowledgePreviewItem[] {
  if (type === 'package') {
    return getAllPackages()
      .sort((a, b) => (b.tasks?.length || 0) - (a.tasks?.length || 0))
      .slice(0, limit)
      .map(p => ({
        id: p.id,
        name: p.name,
        tasks: p.tasks?.length
      }));
  }
  
  if (type === 'model') {
    const allModels = [...getAllModels('ml'), ...getAllModels('dl'), ...getAllModels('llm')];
    return allModels
      .slice(0, limit)
      .map(m => ({
        id: m.id,
        name: m.name || m.title
      }));
  }
  
  if (type === 'workflow') {
    return getAllWorkflows()
      .sort((a, b) => (b.steps?.length || 0) - (a.steps?.length || 0))
      .slice(0, limit)
      .map(w => ({
        id: w.id,
        name: w.name || w.title,
        steps: w.steps?.length
      }));
  }
  
  return [];
});

/**
 * Gets knowledge distribution counts by content type.
 */
export const getKnowledgeDistribution = cache(function getKnowledgeDistribution(): {
  packages: number;
  models_ml: number;
  models_dl: number;
  models_llm: number;
  workflows: number;
  cheatsheets: number;
  registry_families: number;
  decision_guides: number;
  debug_guides: number;
  patterns: number;
  principles: number;
} {
  return {
    packages: getAllPackageIds().length,
    models_ml: getModelIds('ml').length,
    models_dl: getModelIds('dl').length,
    models_llm: getModelIds('llm').length,
    workflows: getAllWorkflowIds().length,
    cheatsheets: getAllCheatsheetIds().length,
    registry_families: getAllRegistryFamilyIds().length,
    decision_guides: getAllDecisionGuideIds().length,
    debug_guides: getAllDebugGuideIds().length,
    patterns: getAllPatternIds().length,
    principles: getAllPrincipleIds().length,
  };
});

/**
 * Gets featured collections with smart ranking based on canonical_status, engineering_maturity, and confidence.
 * Falls back to task/step count if metadata is not available.
 */
const MATURITY_SCORE: Record<string, number> = {
  production_ready: 4,
  stable: 3,
  emerging: 2,
  experimental: 1,
  research: 0,
};

const CANONICAL_SCORE: Record<string, number> = {
  canonical: 3,
  reference: 2,
  generated: 1,
};

const CONFIDENCE_SCORE: Record<string, number> = {
  production_proven: 3,
  verified: 2,
  community_accepted: 1,
  experimental: 0,
  research: 0,
};

function getFeaturedScore(item: {
  canonical_status?: string;
  engineering_maturity?: string;
  confidence?: string;
  tasks?: number;
  steps?: number;
}): number {
  // Prefer metadata-based scoring
  const canonicalScore = item.canonical_status ? (CANONICAL_SCORE[item.canonical_status] || 0) : 0;
  const maturityScore = item.engineering_maturity ? (MATURITY_SCORE[item.engineering_maturity] || 0) : 0;
  const confidenceScore = item.confidence ? (CONFIDENCE_SCORE[item.confidence] || 0) : 0;
  
  // If we have metadata, use it; otherwise fall back to task/step count
  if (canonicalScore > 0 || maturityScore > 0 || confidenceScore > 0) {
    return canonicalScore * 100 + maturityScore * 10 + confidenceScore;
  }
  
  // Fallback: use task/step count
  return (item.tasks || 0) + (item.steps || 0);
}

export const getFeaturedCollections = cache(function getFeaturedCollections(): {
  packages: Array<{ id: string; name: string; tasks?: number; difficulty?: string; estimated_reading_time?: number }>;
  workflows: Array<{ id: string; name: string; steps?: number; difficulty?: string; estimated_reading_time?: number }>;
  models: Array<{ id: string; name: string; category?: string; difficulty?: string; estimated_reading_time?: number }>;
} {
  // Featured packages - ranked by metadata, then task count
  const packages = getAllPackages()
    .sort((a, b) => {
      const scoreA = getFeaturedScore({
        canonical_status: a.canonical_status,
        engineering_maturity: a.engineering_maturity,
        confidence: a.confidence,
        tasks: a.tasks?.length,
      });
      const scoreB = getFeaturedScore({
        canonical_status: b.canonical_status,
        engineering_maturity: b.engineering_maturity,
        confidence: b.confidence,
        tasks: b.tasks?.length,
      });
      return scoreB - scoreA;
    })
    .slice(0, 3)
    .map(p => ({
      id: p.id,
      name: p.name,
      tasks: p.tasks?.length,
      difficulty: p.difficulty,
      estimated_reading_time: p.estimated_reading_time
    }));

  // Featured workflows - ranked by metadata, then step count
  const workflows = getAllWorkflows()
    .sort((a, b) => {
      const scoreA = getFeaturedScore({
        canonical_status: a.canonical_status,
        engineering_maturity: a.engineering_maturity,
        confidence: a.confidence,
        steps: a.steps?.length,
      });
      const scoreB = getFeaturedScore({
        canonical_status: b.canonical_status,
        engineering_maturity: b.engineering_maturity,
        confidence: b.confidence,
        steps: b.steps?.length,
      });
      return scoreB - scoreA;
    })
    .slice(0, 3)
    .map(w => ({
      id: w.id,
      name: w.name || w.title,
      steps: w.steps?.length,
      difficulty: w.difficulty,
      estimated_reading_time: w.estimated_reading_time
    }));

  // Featured models - ranked by metadata, then task count
  // Note: Model uses engineeringmaturity (camelCase) and doesn't have canonical_status
  const allModels = [...getAllModels('ml'), ...getAllModels('dl'), ...getAllModels('llm')];
  const models = allModels
    .sort((a, b) => {
      // Model uses camelCase field names
      const maturityA = a.engineeringmaturity ? (MATURITY_SCORE[a.engineeringmaturity] || 0) : 0;
      const maturityB = b.engineeringmaturity ? (MATURITY_SCORE[b.engineeringmaturity] || 0) : 0;
      const confidenceA = a.confidence ? (CONFIDENCE_SCORE[a.confidence] || 0) : 0;
      const confidenceB = b.confidence ? (CONFIDENCE_SCORE[b.confidence] || 0) : 0;
      return (maturityB * 10 + confidenceB) - (maturityA * 10 + confidenceA);
    })
    .slice(0, 3)
    .map(m => ({
      id: m.id,
      name: m.name || m.title,
      category: m.category,
      difficulty: m.difficulty,
      estimated_reading_time: m.estimatedreadingtime
    }));

  return { packages, workflows, models };
});

/**
 * Orchestrator function that returns all dashboard data.
 */
export const getDashboardData = cache(function getDashboardData() {
  const counts = getDashboardCounts();
  const distribution = getKnowledgeDistribution();
  const featured = getFeaturedCollections();
  const intents = getDashboardIntents();
  const problemCategories = getProblemCategories();
  const popularSearches = getPopularSearches();
  const recent = getRecentContent(6);

  return {
    counts,
    distribution,
    featured,
    intents,
    problemCategories,
    popularSearches,
    recent
  };
});

/**
 * Resolves a summary for a content item.
 */
export function getSummaryForItem(item: RecentContentItem): string | null {
  try {
    if (item.type === 'package') {
      const p = getPackage(item.id);
      return p.summary || p.description || null;
    }
    if (item.type === 'model') {
      const cat = item.category as ModelCategory;
      if (cat) {
        const m = getModel(cat, item.id);
        return m.description || null;
      }
    }
    if (item.type === 'workflow') {
      const w = getWorkflow(item.id);
      return w.description || null;
    }
    if (item.type === 'cheatsheet') {
      const cs = getCheatsheet(item.id);
      return cs.description || null;
    }
    if (item.type === 'pattern') {
      const p = getPattern(item.id);
      return p.description || null;
    }
    if (item.type === 'debug_guide') {
      const dg = getDebugGuide(item.id);
      return dg.description || null;
    }
    if (item.type === 'decision_guide') {
      const dg = getDecisionGuide(item.id);
      return dg.description || null;
    }
    if (item.type === 'principle') {
      const principle = getPrinciple(item.id);
      return principle.description || null;
    }
  } catch {
    // Graceful fallback
  }
  return null;
}
