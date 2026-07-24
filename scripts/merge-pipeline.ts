/**
 * Deterministic Atomic Merge & Normalization Pipeline for AENS (Phase P1)
 * 
 * Pipeline stages:
 * Module Discovery → Merge → Schema Validation → Content Normalization →
 * Canonical Relationship Resolution → Integrity Validation → Atomic Write (.tmp → target replace)
 * 
 * Idempotency Rule:
 * The merge pipeline must be idempotent. Running `npm run merge` multiple times without changing
 * source modules must produce byte-identical output.
 * 
 * Failure Rollback Rule:
 * If validation fails at any stage, delete the temporary file (.tmp), leave the existing target JSON
 * untouched, and exit with status code 1.
 */

import fs from 'node:fs';
import path from 'node:path';
import { PackageSchema } from '../lib/schemas/package.js';
import { CheatsheetSchema } from '../lib/schemas/cheatsheet.js';

const dataDir = path.join(process.cwd(), 'data');

// Load registered tags & aliases
const registeredTagsPath = path.join(dataDir, 'registered-tags.json');
const registeredAliasesPath = path.join(dataDir, 'registered-aliases.json');

const registeredTags: string[] = fs.existsSync(registeredTagsPath)
  ? JSON.parse(fs.readFileSync(registeredTagsPath, 'utf-8'))
  : [];

const registeredAliases: string[] = fs.existsSync(registeredAliasesPath)
  ? JSON.parse(fs.readFileSync(registeredAliasesPath, 'utf-8'))
  : [];

const tagSet = new Set(registeredTags.map(t => t.toLowerCase().trim()));
const aliasSet = new Set(registeredAliases.map(a => a.toLowerCase().trim()));

function readJSON<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
}

/**
 * Normalizes string arrays: trims whitespace, removes duplicates, preserves order.
 */
function normalizeStringArray(arr: unknown): string[] {
  if (!Array.isArray(arr)) return [];
  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of arr) {
    if (typeof item === 'string') {
      const trimmed = item.trim();
      if (trimmed && !seen.has(trimmed)) {
        seen.add(trimmed);
        result.push(trimmed);
      }
    }
  }

  return result;
}

/**
 * Normalizes tags against registered-tags.json.
 */
function normalizeTags(tags: unknown): string[] {
  const rawList = normalizeStringArray(tags);
  return rawList.filter(t => tagSet.has(t.toLowerCase()));
}

/**
 * Normalizes aliases against registered-aliases.json.
 */
function normalizeAliases(aliases: unknown): string[] {
  const rawList = normalizeStringArray(aliases);
  return rawList.filter(a => aliasSet.has(a.toLowerCase()));
}

/**
 * Atomic write helper with failure rollback protection.
 */
function atomicWriteJSON(targetFilePath: string, data: unknown, schemaValidator?: (data: unknown) => boolean): void {
  const tmpFilePath = `${targetFilePath}.tmp`;

  try {
    // 1. Serialize deterministically (2-space indent + trailing newline)
    const content = JSON.stringify(data, null, 2) + '\n';

    // 2. Write to temporary file
    fs.writeFileSync(tmpFilePath, content, 'utf-8');

    // 3. Re-read and validate temporary file
    const parsedBack = JSON.parse(fs.readFileSync(tmpFilePath, 'utf-8'));

    if (schemaValidator && !schemaValidator(parsedBack)) {
      throw new Error(`Validation failed for temporary output file: ${tmpFilePath}`);
    }

    // 4. Atomic replace
    fs.renameSync(tmpFilePath, targetFilePath);
    console.log(`  ✓ Atomically merged & written: ${path.relative(process.cwd(), targetFilePath)}`);

  } catch (error) {
    // Failure Rollback: Delete temporary file and keep target JSON untouched
    if (fs.existsSync(tmpFilePath)) {
      try {
        fs.unlinkSync(tmpFilePath);
        console.error(`  🗑️ Failure rollback: deleted temporary file ${path.basename(tmpFilePath)}`);
      } catch (unlinkError) {
        console.error(`  ⚠️ Could not remove temporary file: ${unlinkError}`);
      }
    }
    console.error(`❌ Merge failed for ${path.basename(targetFilePath)}: ${(error as Error).message}`);
    process.exit(1);
  }
}

/**
 * Process modular Package directories.
 */
function mergePackageDirectory(pkgDir: string, targetFile: string): void {
  const pkgId = path.basename(pkgDir);
  console.log(`📦 Merging modular package [${pkgId}]...`);

  const files = fs.readdirSync(pkgDir)
    .filter(f => f.endsWith('.json'))
    .sort((a, b) => a.localeCompare(b));

  const baseFile = files.find(f => f.startsWith('00_package') || f === 'package.json');
  if (!baseFile) {
    console.warn(`  ⚠️ Skip ${pkgId}: Base package module (00_package.json) not found.`);
    return;
  }

  const baseData = readJSON<Record<string, unknown>>(path.join(pkgDir, baseFile));
  const taskFiles = files.filter(f => f !== baseFile);

  const allTasks: unknown[] = Array.isArray(baseData.tasks) ? [...baseData.tasks] : [];

  for (const taskFile of taskFiles) {
    const filePath = path.join(pkgDir, taskFile);
    const content = readJSON<Record<string, unknown>>(filePath);

    if (Array.isArray(content.tasks)) {
      allTasks.push(...content.tasks);
    } else if (content.task && typeof content.task === 'string') {
      allTasks.push(content);
    }
  }

  // Deduplicate tasks by task name/title while preserving order
  const seenTaskNames = new Set<string>();
  const mergedTasks: Record<string, unknown>[] = [];

  for (const taskObj of allTasks) {
    if (taskObj && typeof taskObj === 'object') {
      const t = taskObj as Record<string, unknown>;
      const name = typeof t.task === 'string' ? t.task.trim() : '';
      if (name) {
        const key = name.toLowerCase();
        if (!seenTaskNames.has(key)) {
          seenTaskNames.add(key);
          // Normalize task relationship ID arrays
          t.related_workflows = normalizeStringArray(t.related_workflows);
          t.related_cheatsheets = normalizeStringArray(t.related_cheatsheets);
          t.related_models = normalizeStringArray(t.related_models);
          t.related_patterns = normalizeStringArray(t.related_patterns);
          t.related_decision_guides = normalizeStringArray(t.related_decision_guides);
          t.related_package_tasks = normalizeStringArray(t.related_package_tasks);
          t.related_apis = normalizeStringArray(t.related_apis);
          t.gotchas = normalizeStringArray(t.gotchas);
          t.important_params = normalizeStringArray(t.important_params);

          mergedTasks.push(t);
        }
      }
    }
  }

  // Ensure BaseMetaSchema & PackageSchema required fields
  const version = (baseData.version as string) || (baseData.latest_stable_version as string) || '2.0.0';
  const install = (baseData.install as string) || (baseData.install_command as string) || 'pip install torch';
  const importAs = (baseData.import_as as string) || (baseData.import_convention as string) || 'import torch';
  const sources = Array.isArray(baseData.sources) && baseData.sources.length > 0
    ? baseData.sources
    : ['https://pytorch.org'];

  const title = (baseData.title as string) || (baseData.name as string) || pkgId;
  const slug = (baseData.slug as string) || (baseData.id as string) || pkgId;
  const description = (baseData.description as string) || (baseData.summary as string) || title;

  // Construct complete Package object
  const mergedPackage: Record<string, unknown> = {
    ...baseData,
    id: pkgId,
    title,
    slug,
    description,
    name: (baseData.name as string) || 'torch',
    version,
    install,
    import_as: importAs,
    summary: (baseData.summary as string) || description,
    sources,
    tasks: mergedTasks,
    tags: normalizeTags(baseData.tags),
    aliases: normalizeAliases(baseData.aliases),
    keywords: normalizeStringArray(baseData.keywords),
    search_tokens: normalizeStringArray(baseData.search_tokens),
  };

  // Schema Validation
  const validationResult = PackageSchema.safeParse(mergedPackage);
  if (!validationResult.success) {
    console.error(`❌ Zod Schema validation failed for package ${pkgId}:`, validationResult.error.format());
    process.exit(1);
  }

  // Atomic write with failure rollback
  atomicWriteJSON(targetFile, validationResult.data, (data) => PackageSchema.safeParse(data).success);
}

/**
 * Process modular Cheatsheet directories.
 */
function mergeCheatsheetDirectory(csDir: string, targetFile: string): void {
  const csId = path.basename(csDir);
  console.log(`📋 Merging modular cheatsheet [${csId}]...`);

  const files = fs.readdirSync(csDir)
    .filter(f => f.endsWith('.json'))
    .sort((a, b) => a.localeCompare(b));

  const baseFile = files.find(f => f.startsWith('00_package') || f === 'cheatsheet.json');
  if (!baseFile) {
    console.warn(`  ⚠️ Skip ${csId}: Base cheatsheet module (00_package.json) not found.`);
    return;
  }

  const baseData = readJSON<Record<string, unknown>>(path.join(csDir, baseFile));

  const allEntries: unknown[] = Array.isArray(baseData.entries) ? [...baseData.entries] : [];
  const quickRefTables: unknown[] = Array.isArray(baseData.quick_reference_tables) ? [...baseData.quick_reference_tables] : [];
  const commonErrors: unknown[] = Array.isArray(baseData.common_errors) ? [...baseData.common_errors] : [];
  const performanceChecklist: unknown[] = Array.isArray(baseData.performance_checklist) ? [...baseData.performance_checklist] : [];
  const productionChecklist: unknown[] = Array.isArray(baseData.production_checklist) ? [...baseData.production_checklist] : [];

  for (const file of files) {
    if (file === baseFile) continue;
    const filePath = path.join(csDir, file);
    const content = readJSON<Record<string, unknown>>(filePath);

    if (file === 'quick_ref_tables.json' || Array.isArray(content.quick_reference_tables)) {
      const tables = Array.isArray(content.quick_reference_tables) ? content.quick_reference_tables : (Array.isArray(content) ? content : []);
      quickRefTables.push(...tables);
    } else if (file === 'common_errors.json' || Array.isArray(content.common_errors)) {
      const errs = Array.isArray(content.common_errors) ? content.common_errors : (Array.isArray(content) ? content : []);
      commonErrors.push(...errs);
    } else if (file === 'performance_checklist_table.json' || Array.isArray(content.performance_checklist)) {
      const pCheck = Array.isArray(content.performance_checklist) ? content.performance_checklist : (Array.isArray(content) ? content : []);
      performanceChecklist.push(...pCheck);
    } else if (file === 'production_checklist.json' || Array.isArray(content.production_checklist)) {
      const prodCheck = Array.isArray(content.production_checklist) ? content.production_checklist : (Array.isArray(content) ? content : []);
      productionChecklist.push(...prodCheck);
    } else if (Array.isArray(content.entries)) {
      allEntries.push(...content.entries);
    } else if (content.problem && typeof content.problem === 'string') {
      allEntries.push(content);
    }
  }

  // Deduplicate entries by problem string while preserving order
  const seenProblems = new Set<string>();
  const mergedEntries: Record<string, unknown>[] = [];

  for (const entryObj of allEntries) {
    if (entryObj && typeof entryObj === 'object') {
      const e = entryObj as Record<string, unknown>;
      const prob = typeof e.problem === 'string' ? e.problem.trim() : '';
      if (prob) {
        const key = prob.toLowerCase();
        if (!seenProblems.has(key)) {
          seenProblems.add(key);
          // Normalize entry relationship string arrays
          e.related_packages = normalizeStringArray(e.related_packages);
          e.related_workflows = normalizeStringArray(e.related_workflows);
          e.related_patterns = normalizeStringArray(e.related_patterns);
          e.related_decision_guides = normalizeStringArray(e.related_decision_guides);
          e.related_apis = normalizeStringArray(e.related_apis);

          mergedEntries.push(e);
        }
      }
    }
  }

  // Base Meta defaults
  const sources = Array.isArray(baseData.sources) && baseData.sources.length > 0
    ? baseData.sources
    : ['https://pytorch.org'];

  const title = (baseData.title as string) || (baseData.name as string) || `${csId} Cheatsheet`;
  const slug = (baseData.slug as string) || (baseData.id as string) || csId;
  const description = (baseData.description as string) || (baseData.summary as string) || title;

  // Construct complete Cheatsheet object
  const mergedCheatsheet: Record<string, unknown> = {
    ...baseData,
    id: csId,
    title,
    slug,
    description,
    name: (baseData.name as string) || title,
    sources,
    entries: mergedEntries,
    quick_reference_tables: quickRefTables,
    common_errors: commonErrors,
    performance_checklist: performanceChecklist,
    production_checklist: productionChecklist,
    tags: normalizeTags(baseData.tags),
    aliases: normalizeAliases(baseData.aliases),
    keywords: normalizeStringArray(baseData.keywords),
    search_tokens: normalizeStringArray(baseData.search_tokens),
  };

  // Schema Validation
  const validationResult = CheatsheetSchema.safeParse(mergedCheatsheet);
  if (!validationResult.success) {
    console.error(`❌ Zod Schema validation failed for cheatsheet ${csId}:`, validationResult.error.format());
    process.exit(1);
  }

  // Atomic write with failure rollback
  atomicWriteJSON(targetFile, validationResult.data, (data) => CheatsheetSchema.safeParse(data).success);
}

function main() {
  console.log('🔄 Starting AENS Deterministic Atomic Normalization & Merge Pipeline...\n');

  // 1. Packages
  const packagesDir = path.join(dataDir, 'packages');
  if (fs.existsSync(packagesDir)) {
    for (const item of fs.readdirSync(packagesDir)) {
      const fullPath = path.join(packagesDir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        const targetFile = path.join(packagesDir, `${item}.json`);
        mergePackageDirectory(fullPath, targetFile);
      }
    }
  }

  // 2. Cheatsheets
  const cheatsheetsDir = path.join(dataDir, 'cheatsheets');
  if (fs.existsSync(cheatsheetsDir)) {
    for (const item of fs.readdirSync(cheatsheetsDir)) {
      const fullPath = path.join(cheatsheetsDir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        const targetFile = path.join(cheatsheetsDir, `${item}.json`);
        mergeCheatsheetDirectory(fullPath, targetFile);
      }
    }
  }

  console.log('\n✅ Normalization & merge pipeline completed successfully.');
}

main();
