import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import {
  PackageSchema,
  ModelSchema,
  RegistryModelSchema,
  WorkflowSchema,
  CheatsheetSchema,
  PatternSchema,
  DebugGuideSchema,
  DecisionGuideSchema,
  PrincipleSchema,
} from '../lib/schemas/index.js';
import { REGISTRY_FILE_TO_TASK } from '../lib/config/registry';
import type { VisualizationEquivalent } from '../types/package';

const dataDir = path.join(process.cwd(), 'data');
const STRICT_MODE = process.env.STRICT_REFERENCE_MODE === 'true';

// ── Constants ───────────────────────────────────────────────

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/;
const VALID_REF_TYPES = new Set(['model', 'package', 'workflow', 'cheatsheet', 'registry', 'pattern', 'debug_guide', 'decision_guide', 'principle']);

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

const refsToCheck: Array<{ sourceFile: string; ref: { id: string; type: string; relationship_type?: string } }> = [];
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
  if (normalizedPath.startsWith('data/patterns/')) return 'pattern';
  if (normalizedPath.startsWith('data/debug-guides/')) return 'debug_guide';
  if (normalizedPath.startsWith('data/decision-guides/')) return 'decision_guide';
  if (normalizedPath.startsWith('data/principles/')) return 'principle';
  if (normalizedPath.startsWith('data/problem-index/')) return 'problem_index'; // No schema - generated navigation
  return null;
}

// ── Main ────────────────────────────────────────────────────

const files = getJsonFiles(dataDir);
console.log(`📊 Starting content validation. Scanning ${files.length} JSON files in ${dataDir}...\n`);

if (files.length === 0) {
  console.log('ℹ️  No content files found in data directory. Skipping validation.');
  process.exit(0);
}

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
  else if (normalizedPath.startsWith('data/patterns/')) schema = PatternSchema;
  else if (normalizedPath.startsWith('data/debug-guides/')) schema = DebugGuideSchema;
  else if (normalizedPath.startsWith('data/decision-guides/')) schema = DecisionGuideSchema;
  else if (normalizedPath.startsWith('data/principles/')) schema = PrincipleSchema;
  else if (normalizedPath.startsWith('data/problem-index/')) {
    // Problem Index has no schema per specification - skip validation
    continue;
  }
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
      const model = obj as Record<string, unknown> & {
        decisionsummary?: {
          summary?: string;
          strengths?: string[];
          limitations?: string[];
        };
      };
      const summary = model.decisionsummary?.summary;
      const strengths = model.decisionsummary?.strengths ?? [];
      const limitations = model.decisionsummary?.limitations ?? [];
      checkPlaceholder(normalizedPath, 'decisionsummary.summary', summary);
      strengths.forEach((str: string, idx: number) => checkPlaceholder(normalizedPath, `decisionsummary.strengths[${idx}]`, str));
      limitations.forEach((lim: string, idx: number) => checkPlaceholder(normalizedPath, `decisionsummary.limitations[${idx}]`, lim));
    } else if (type === 'package') {
      const pkg = obj as { summary?: string; id?: string; tasks?: Array<{ visualization_equivalents?: VisualizationEquivalent[] }> };
      checkPlaceholder(normalizedPath, 'summary', pkg.summary);

      if (Array.isArray(pkg.tasks)) {
        pkg.tasks.forEach((task, taskIndex) => {
          const equivalents = Array.isArray(task.visualization_equivalents) ? task.visualization_equivalents : [];
          const seen = new Set<string>();

          equivalents.forEach((equivalent, relIndex) => {
            const key = `${equivalent.package}:${equivalent.task}`;
            if (seen.has(key)) {
              reportWarning(`Duplicate visualization equivalent '${key}' in package '${normalizedPath}' task ${taskIndex + 1}`);
            } else {
              seen.add(key);
            }

            if (equivalent.package === pkg.id) {
              reportWarning(`Self-referential visualization equivalent in package '${normalizedPath}' task ${taskIndex + 1}`);
            }

            if (!equivalent.task || !equivalent.reason) {
              reportError(`Incomplete visualization equivalent at '${normalizedPath}' task ${taskIndex + 1} equivalent ${relIndex + 1}`);
            }
          });
        });
      }
    } else if (type === 'workflow') {
      const wf = obj as { overview?: string };
      checkPlaceholder(normalizedPath, 'overview', wf.overview);
    }

    // ── STEP 6: Minimum Content Quality ─────────────────────
    if (type === 'model') {
      const model = obj as Record<string, unknown> & {
        decisionsummary?: {
          strengths?: string[];
          limitations?: string[];
        };
        hyperparameters?: unknown[];
        problemtypes?: string[];
        category?: string;
      };
      const strengths = model.decisionsummary?.strengths;
      const limitations = model.decisionsummary?.limitations;
      const hyperparameters = model.hyperparameters;
      const problemtypes = model.problemtypes;
      const category = model.category;

      if (!Array.isArray(strengths) || strengths.length < 3) {
        reportError(`Model '${normalizedPath}' has fewer than 3 strengths (${strengths?.length ?? 0})`);
      }
      if (!Array.isArray(limitations) || limitations.length < 3) {
        reportError(`Model '${normalizedPath}' has fewer than 3 limitations (${limitations?.length ?? 0})`);
      }
      const isDetectionOnly =
        Array.isArray(problemtypes) &&
        problemtypes.length === 1 &&
        problemtypes[0] === 'detection';
      if (!isDetectionOnly && (!Array.isArray(hyperparameters) || hyperparameters.length < 1)) {
        reportError(`Model '${normalizedPath}' has fewer than 1 hyperparameters (${hyperparameters?.length ?? 0})`);
      }
      if (!category) {
        reportError(`Model '${normalizedPath}' is missing required 'category' field`);
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
    } else if (type === 'pattern') {
      const pattern = obj as { concept?: string; applicability?: string };
      if (!pattern.concept) {
        reportError(`Pattern '${normalizedPath}' is missing 'concept' field`);
      }
      if (!pattern.applicability) {
        reportError(`Pattern '${normalizedPath}' is missing 'applicability' field`);
      }
    } else if (type === 'debug_guide') {
      const dg = obj as { symptoms?: unknown[]; root_causes?: unknown[]; solutions?: unknown[] };
      if (!Array.isArray(dg.symptoms) || dg.symptoms.length < 1) {
        reportError(`Debug Guide '${normalizedPath}' has fewer than 1 symptoms (${dg.symptoms?.length ?? 0})`);
      }
      if (!Array.isArray(dg.root_causes) || dg.root_causes.length < 1) {
        reportError(`Debug Guide '${normalizedPath}' has fewer than 1 root_causes (${dg.root_causes?.length ?? 0})`);
      }
      if (!Array.isArray(dg.solutions) || dg.solutions.length < 1) {
        reportError(`Debug Guide '${normalizedPath}' has fewer than 1 solutions (${dg.solutions?.length ?? 0})`);
      }
    } else if (type === 'decision_guide') {
      const dg = obj as { options?: unknown[]; evaluation_criteria?: unknown[] };
      if (!Array.isArray(dg.options) || dg.options.length < 2) {
        reportError(`Decision Guide '${normalizedPath}' has fewer than 2 options (${dg.options?.length ?? 0})`);
      }
      if (!Array.isArray(dg.evaluation_criteria) || dg.evaluation_criteria.length < 1) {
        reportError(`Decision Guide '${normalizedPath}' has fewer than 1 evaluation_criteria (${dg.evaluation_criteria?.length ?? 0})`);
      }
    } else if (type === 'principle') {
      const principle = obj as { statement?: string };
      if (!principle.statement) {
        reportError(`Principle '${normalizedPath}' is missing 'statement' field`);
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

    // ── STEP 8: Collect Relationships ──────────────────────
    const alternatives = type !== 'model' ? (obj.alternatives as Array<{ id?: string; type?: string; relationship_type?: string }> | undefined) : undefined;
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
        refsToCheck.push({ sourceFile: normalizedPath, ref: { id: alt.id, type: alt.type, relationship_type: alt.relationship_type } });
      }
    }

    interface ValidationRef {
      id?: string;
      type?: string;
      relationship_type?: string;
      relationship?: string;
    }
    let relatedContentList: ValidationRef[] = [];
    if (type === 'model') {
      relatedContentList = (obj as { relatedcontent?: ValidationRef[] }).relatedcontent || [];
    } else {
      relatedContentList = (obj as { related_content?: ValidationRef[] }).related_content || [];
    }

    if (Array.isArray(relatedContentList)) {
      for (const ref of relatedContentList) {
        if (typeof ref === 'string') {
          reportError(`Legacy string reference in '${normalizedPath}': '${ref}'. Use { id, type } object.`);
          continue;
        }
        if (!ref?.id || !ref?.type) {
          reportError(`Malformed reference in '${normalizedPath}': missing id or type.`);
          continue;
        }
        if (!VALID_REF_TYPES.has(ref.type)) {
          reportError(`Invalid reference type '${ref.type}' in '${normalizedPath}'.`);
        }
        refsToCheck.push({
          sourceFile: normalizedPath,
          ref: {
            id: ref.id,
            type: ref.type,
            relationship_type: ref.relationship || ref.relationship_type
          }
        });
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

// ── STEP 8.5: Bidirectional Relationship Validation ─────────
console.log(`\n📊 Checking bidirectional relationship consistency...`);

// Build a map of all relationships: "sourceType:sourceId" -> Array of { targetType, targetId, relationshipType }
const relationshipMap = new Map<string, Array<{ targetType: string; targetId: string; relationshipType?: string }>>();

for (const check of refsToCheck) {
  const sourceType = detectContentType(check.sourceFile);
  if (!sourceType) continue;

  const sourceId = check.sourceFile.split('/').pop()?.replace('.json', '');
  if (!sourceId) continue;

  const sourceKey = `${sourceType}:${sourceId}`;
  const relationships = relationshipMap.get(sourceKey) || [];
  relationships.push({
    targetType: check.ref.type,
    targetId: check.ref.id,
    relationshipType: check.ref.relationship_type,
  });
  relationshipMap.set(sourceKey, relationships);
}

// Check bidirectional consistency
for (const [sourceKey, relationships] of relationshipMap.entries()) {
  for (const rel of relationships) {
    const targetKey = `${rel.targetType}:${rel.targetId}`;
    const targetRelationships = relationshipMap.get(targetKey);

    if (!targetRelationships) {
      // Target exists (we checked earlier) but has no relationships back to source
      continue;
    }

    // Check if target has a reciprocal relationship
    const hasReciprocal = targetRelationships.some(targetRel => {
      const targetSourceKey = `${targetRel.targetType}:${targetRel.targetId}`;
      return targetSourceKey === sourceKey;
    });

    if (!hasReciprocal && rel.relationshipType) {
      // Only error for explicit relationship types, not generic 'related_to'
      if (rel.relationshipType !== 'related_to') {
        reportError(`Relationship integrity violation: '${sourceKey}' → '${targetKey}' (type: '${rel.relationshipType}') has no reciprocal relationship. Bidirectional relationships are required.`);
      }
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

// ── STEP 10: Double-Escaped Newline Check ─────────────────────
console.log(`\n📊 Checking for double-escaped newlines (literal \\n) in content fields...`);

function checkForDoubleEscapedNewlines(obj: any, filePath: string, path: string = ''): void {
  if (typeof obj === 'string') {
    // Check for literal \n (backslash followed by n) that appears to be used as line breaks
    if (obj.includes('\\n')) {
      const lines = obj.split('\\n');
      if (lines.length > 1) {
        reportError(`Double-escaped newline found in '${filePath}' field '${path}': literal \\n used where actual newlines should be`);
      }
    }
  } else if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      // Exclude programming code/example fields which naturally contain literal \n characters
      if (key === 'code' || key === 'example' || key === 'snippet') continue;
      const newPath = path ? `${path}.${key}` : key;
      checkForDoubleEscapedNewlines(obj[key], filePath, newPath);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, idx) => {
      const newPath = `${path}[${idx}]`;
      checkForDoubleEscapedNewlines(item, filePath, newPath);
    });
  }
}

// Re-scan all files for double-escaped newlines
for (const file of files) {
  const relativePath = path.relative(process.cwd(), file).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf-8');
  const data = JSON.parse(content);
  checkForDoubleEscapedNewlines(data, relativePath);
}

// ── STEP 11: Report and Exit ───────────────────────────────
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
