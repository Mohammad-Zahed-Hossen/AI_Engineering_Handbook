import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import {
  PackageSchema,
  ModelSchema,
  RegistryModelSchema,
  WorkflowSchema,
  CheatsheetSchema,
} from '../lib/schemas';
import { REGISTRY_FILE_TO_TASK } from '../lib/config/registry';

const dataDir = path.join(process.cwd(), 'data');
const STRICT_MODE = process.env.STRICT_REFERENCE_MODE === 'true';

// ── Constants ───────────────────────────────────────────────

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/;
const VALID_REF_TYPES = new Set(['model', 'package', 'workflow', 'cheatsheet', 'registry']);

const PLACEHOLDER_SUBSTRINGS = [
  'Placeholder',
  'placeholder',
  'TODO',
  'TBD',
  'Coming soon',
  '# Instantiate model here',
  'Use when you need a',
  'Avoid when resources are highly constrained',
  'Well established architecture',
  'Requires modern hardware',
];


// ── State ───────────────────────────────────────────────────

let errorCount = 0;
let warningCount = 0;

const idRegistry = new Map<string, string>();      // "type:id" → file path
const nameRegistry = new Map<string, string>();    // "type:name_lower" → file path

const refsToCheck: Array<{ sourceFile: string; ref: { id: string; type: string } }> = [];
const docsUrlRegistry = new Map<string, string[]>(); // url → array of "file+fn" locations

// ── Helpers ─────────────────────────────────────────────────

function getJsonFiles(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(getJsonFiles(filePath));
    } else if (file.endsWith('.json') && !file.startsWith('_')) {
      results.push(filePath);
    }
  }
  return results;
}

function reportError(message: string): void {
  errorCount++;
  console.error(`❌ ${message}`);
}

function reportWarning(message: string): void {
  warningCount++;
  console.warn(`⚠️ ${message}`);
}

function containsPlaceholder(text: string): boolean {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return PLACEHOLDER_SUBSTRINGS.some(sub => lowerText.includes(sub.toLowerCase()));
}

function checkPlaceholder(file: string, fieldPath: string, value: string | undefined): void {
  if (value && containsPlaceholder(value)) {
    reportError(`Placeholder text in '${file}' field '${fieldPath}': "${value.substring(0, 80)}"`);
  }
}

function detectContentType(normalizedPath: string): string | null {
  if (normalizedPath.startsWith('data/packages/')) return 'package';
  if (normalizedPath.startsWith('data/models/')) return 'model';
  if (normalizedPath.startsWith('data/workflows/')) return 'workflow';
  if (normalizedPath.startsWith('data/cheatsheets/')) return 'cheatsheet';
  if (normalizedPath.startsWith('data/registry/')) return 'registry';
  return null;
}

// ── Main ────────────────────────────────────────────────────

const files = getJsonFiles(dataDir);
console.log(`📊 Starting content validation. Scanning ${files.length} JSON files in ${dataDir}...\n`);

for (const file of files) {
  const relativePath = path.relative(process.cwd(), file);
  const normalizedPath = relativePath.replace(/\\/g, '/');

  // ── STEP 1: JSON Parse ──────────────────────────────────
  let data: unknown;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf-8')) as unknown;
  } catch (e) {
    reportError(`JSON parse error in '${normalizedPath}': ${(e as Error).message}`);
    continue;
  }

  // ── STEP 2: Schema Validation ─────────────────────────────
  let schema: z.ZodTypeAny | null = null;
  if (normalizedPath.startsWith('data/packages/')) schema = PackageSchema;
  else if (normalizedPath.startsWith('data/models/')) schema = ModelSchema;
  else if (normalizedPath.startsWith('data/registry/')) schema = z.array(RegistryModelSchema);
  else if (normalizedPath.startsWith('data/workflows/')) schema = WorkflowSchema;
  else if (normalizedPath.startsWith('data/cheatsheets/')) schema = CheatsheetSchema;
  else {
    reportWarning(`Unknown file path '${normalizedPath}' — no schema mapping`);
    continue;
  }

  const result = schema.safeParse(data);
  if (!result.success) {
    reportError(`Schema validation failed in '${normalizedPath}'`);
    for (const issue of result.error.issues) {
      const fieldPath = issue.path.join('.') || '(root)';
      console.error(`    - Field: ${fieldPath}`);
      console.error(`      Error: ${issue.message}`);
    }
    continue;
  }

  const isRegistry = normalizedPath.startsWith('data/registry/');

  // ── Non-Registry Files ───────────────────────────────────
  if (!isRegistry && typeof data === 'object' && data !== null && !Array.isArray(data)) {
    const obj = data as Record<string, unknown>;
    const type = detectContentType(normalizedPath);
    if (!type) {
      reportWarning(`Could not determine content type for '${normalizedPath}'`);
      continue;
    }

    const declaredId = obj.id as string | undefined;
    const expectedId = path.basename(file, '.json');

    // ── STEP 3: Slug Format ───────────────────────────────
    if (declaredId && !SLUG_REGEX.test(declaredId)) {
      reportError(`Invalid slug '${declaredId}' in '${normalizedPath}'. Must match /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/`);
    }

    // ── STEP 4: Filename === ID ───────────────────────────
    if (declaredId !== expectedId) {
      reportError(`Filename/ID mismatch in '${normalizedPath}': filename='${expectedId}', declared id='${declaredId}'`);
    }

    // ── STEP 5: Placeholder Detection ───────────────────────
    if (type === 'model') {
      const model = obj as {
        summary?: string;
        quick_start?: string;
        pros?: string[];
        cons?: string[];
      };
      checkPlaceholder(normalizedPath, 'summary', model.summary);
      checkPlaceholder(normalizedPath, 'quick_start', model.quick_start);
      (model.pros ?? []).forEach((pro, idx) => checkPlaceholder(normalizedPath, `pros[${idx}]`, pro));
      (model.cons ?? []).forEach((con, idx) => checkPlaceholder(normalizedPath, `cons[${idx}]`, con));
    } else if (type === 'package') {
      const pkg = obj as { summary?: string };
      checkPlaceholder(normalizedPath, 'summary', pkg.summary);
    } else if (type === 'workflow') {
      const wf = obj as { overview?: string };
      checkPlaceholder(normalizedPath, 'overview', wf.overview);
    }

    // ── STEP 6: Minimum Content Quality ─────────────────────
    if (type === 'model') {
      const model = obj as {
        pros?: string[];
        cons?: string[];
        key_hyperparams?: unknown[];
        problem_types?: string[];
      };
      if (!Array.isArray(model.pros) || model.pros.length < 3) {
        reportError(`Model '${normalizedPath}' has fewer than 3 pros (${model.pros?.length ?? 0})`);
      }
      if (!Array.isArray(model.cons) || model.cons.length < 3) {
        reportError(`Model '${normalizedPath}' has fewer than 3 cons (${model.cons?.length ?? 0})`);
      }
      const isDetectionOnly =
        Array.isArray(model.problem_types) &&
        model.problem_types.length === 1 &&
        model.problem_types[0] === 'detection';
      if (!isDetectionOnly && (!Array.isArray(model.key_hyperparams) || model.key_hyperparams.length < 1)) {
        reportError(`Model '${normalizedPath}' has fewer than 1 key_hyperparams (${model.key_hyperparams?.length ?? 0})`);
      }
    } else if (type === 'package') {
      const pkg = obj as { tasks?: unknown[] };
      if (!Array.isArray(pkg.tasks) || pkg.tasks.length < 1) {
        reportError(`Package '${normalizedPath}' has fewer than 1 tasks (${pkg.tasks?.length ?? 0})`);
      }
    } else if (type === 'workflow') {
      const wf = obj as { steps?: unknown[] };
      if (!Array.isArray(wf.steps) || wf.steps.length < 3) {
        reportError(`Workflow '${normalizedPath}' has fewer than 3 steps (${wf.steps?.length ?? 0})`);
      }
    } else if (type === 'cheatsheet') {
      const cs = obj as { entries?: unknown[] };
      if (!Array.isArray(cs.entries) || cs.entries.length < 1) {
        reportError(`Cheatsheet '${normalizedPath}' has fewer than 1 entries (${cs.entries?.length ?? 0})`);
      }
    }

    // ── STEP 7: Duplicate Detection ─────────────────────────
    const name = obj.name as string | undefined;
    if (declaredId) {
      const idKey = `${type}:${declaredId}`;
      if (idRegistry.has(idKey)) {
        reportError(`Duplicate ID '${declaredId}' (type '${type}') in '${normalizedPath}' — already in '${idRegistry.get(idKey)}'`);
      } else {
        idRegistry.set(idKey, normalizedPath);
      }
    }
    if (name) {
      const nameKey = `${type}:${name.toLowerCase()}`;
      if (nameRegistry.has(nameKey)) {
        reportError(`Duplicate name '${name}' (type '${type}') in '${normalizedPath}' — already in '${nameRegistry.get(nameKey)}'`);
      } else {
        nameRegistry.set(nameKey, normalizedPath);
      }
    }

    // ── STEP 8: Collect Alternatives ──────────────────────
    const alternatives = obj.alternatives as Array<{ id?: string; type?: string }> | undefined;
    if (Array.isArray(alternatives)) {
      for (const alt of alternatives) {
        if (typeof alt === 'string') {
          reportError(`Legacy string alternative in '${normalizedPath}': '${alt}'. Use { id, type } object.`);
          continue;
        }
        if (!alt?.id || !alt?.type) {
          reportError(`Malformed alternative in '${normalizedPath}': missing id or type.`);
          continue;
        }
        if (!VALID_REF_TYPES.has(alt.type)) {
          reportError(`Invalid alternative type '${alt.type}' in '${normalizedPath}'.`);
        }
        refsToCheck.push({ sourceFile: normalizedPath, ref: { id: alt.id, type: alt.type } });
      }
    }
  }

  // ── Registry Files ───────────────────────────────────────
  else if (isRegistry && Array.isArray(data)) {
    const fileName = path.basename(file);
    const expectedTask = REGISTRY_FILE_TO_TASK[fileName];

    if (!expectedTask) {
      reportWarning(`Unknown registry file '${normalizedPath}' — no task mapping for '${fileName}'`);
    }

    if (data.length === 0) {
      reportError(`Registry file '${normalizedPath}' is empty`);
    }

    (data as Array<Record<string, unknown>>).forEach((item, idx) => {
      const itemId = item.id as string | undefined;
      const itemTask = item.task as string | undefined;

      // ── STEP 3: Slug Format ─────────────────────────────
      if (itemId && !SLUG_REGEX.test(itemId)) {
        reportError(`Invalid slug '${itemId}' in '${normalizedPath}[${idx}]'. Must match /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/`);
      }

      // ── STEP 4: Task matches Filename ─────────────────────
      if (expectedTask && itemTask !== expectedTask) {
        reportError(`Task mismatch in '${normalizedPath}[${idx}]': expected '${expectedTask}', got '${itemTask}'`);
      }

      // ── STEP 5: Placeholder Detection ─────────────────────
      // Registry entries are lightweight navigation index - no placeholder checks needed

      // ── STEP 7: Duplicate Detection ───────────────────────
      if (itemId) {
        const idKey = `registry:${itemId}`;
        if (idRegistry.has(idKey)) {
          reportError(`Duplicate registry ID '${itemId}' in '${normalizedPath}[${idx}]' — already in '${idRegistry.get(idKey)}'`);
        } else {
          idRegistry.set(idKey, normalizedPath);
        }
      }
    });
  }
}

// ── STEP 8: ContentRef Integrity ────────────────────────────
console.log(`\n📊 Checking ${refsToCheck.length} reference links for integrity...`);

for (const check of refsToCheck) {
  const { id, type } = check.ref;
  const idKey = `${type}:${id}`;

  if (!idRegistry.has(idKey)) {
    const message = `Broken reference: ID '${id}' (type '${type}') not found, referenced from '${check.sourceFile}'`;
    if (STRICT_MODE) {
      reportError(message);
    } else {
      reportWarning(message);
    }
  }
}

// ── STEP 9: docs_url Uniqueness Check ───────────────────────
console.log(`\n📊 Checking ${docsUrlRegistry.size} unique docs_url values for duplicates...`);

for (const [url, locations] of docsUrlRegistry.entries()) {
  if (locations.length > 1) {
    reportWarning(`Duplicate docs_url '${url}' found in ${locations.length} locations: ${locations.join(', ')}`);
  }
}

// ── STEP 10: Report and Exit ───────────────────────────────
console.log(`\n📊 Validation Summary`);
console.log(`   Files checked: ${files.length}`);
console.log(`   Errors:        ${errorCount}`);
console.log(`   Warnings:      ${warningCount}`);

if (errorCount > 0) {
  console.error(`\n❌ Content validation failed with ${errorCount} error(s).`);
  process.exit(1);
}

console.log('\n✅ All content files and references validated successfully!');
process.exit(0);
