import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import {
  PackageSchema,
  ModelSchema,
  RegistryFamilySchema,
  RegistryVariantSchema,
  WorkflowSchema,
  CheatsheetSchema,
  PatternSchema,
  DebugGuideSchema,
  DecisionGuideSchema,
  PrincipleSchema,
} from '../lib/schemas/index.js';
import { WORKFLOW_CATEGORIES } from '../lib/config/workflows';
import type { VisualizationEquivalent } from '../types/package';

const dataDir = path.join(process.cwd(), 'data');
const STRICT_MODE = process.env.STRICT_REFERENCE_MODE === 'true';
const SUPPRESS_BROKEN_REF_WARNINGS = process.env.SUPPRESS_BROKEN_REF_WARNINGS === 'true' || process.argv.includes('--quiet');

// Load config limits & rules
const configPath = path.join(process.cwd(), 'aens.config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
const sizeBudgets = config.size_budgets;
const validationRules = config.validation_rules;

// Load tags & aliases registries
const registeredTagsPath = path.join(process.cwd(), 'data', 'registered-tags.json');
const registeredAliasesPath = path.join(process.cwd(), 'data', 'registered-aliases.json');

let registeredTags = new Set<string>();
let registeredAliases = new Set<string>();

if (fs.existsSync(registeredTagsPath)) {
  registeredTags = new Set(JSON.parse(fs.readFileSync(registeredTagsPath, 'utf-8')));
}
if (fs.existsSync(registeredAliasesPath)) {
  registeredAliases = new Set(JSON.parse(fs.readFileSync(registeredAliasesPath, 'utf-8')));
}

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
  else if (normalizedPath.startsWith('data/registry/families/')) {
    // New family/variant structure
    if (file.endsWith('_index.json')) {
      schema = RegistryFamilySchema;
    } else {
      schema = RegistryVariantSchema;
    }
  }
  else if (normalizedPath.startsWith('data/registry/')) {
    // Legacy registry files are no longer supported - skip validation
    reportWarning(`Legacy registry file detected at '${normalizedPath}' — no longer supported`);
    continue;
  }
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
      if (Array.isArray(pkg.tasks) && pkg.tasks.length > sizeBudgets.package_max_common_tasks) {
        reportWarning(`Package '${normalizedPath}' has tasks count (${pkg.tasks.length}) exceeding maximum budget of ${sizeBudgets.package_max_common_tasks}`);
      }
    } else if (type === 'workflow') {
      const wf = obj as { steps?: unknown[]; category?: string };
      if (!Array.isArray(wf.steps) || wf.steps.length < 3) {
        reportError(`Workflow '${normalizedPath}' has fewer than 3 steps (${wf.steps?.length ?? 0})`);
      }
      if (Array.isArray(wf.steps) && wf.steps.length > sizeBudgets.workflow_max_steps) {
        reportWarning(`Workflow '${normalizedPath}' has steps count (${wf.steps.length}) exceeding maximum budget of ${sizeBudgets.workflow_max_steps}`);
      }
      if (!wf.category) {
        reportError(`Workflow '${normalizedPath}' is missing required 'category' field`);
      } else if (!(WORKFLOW_CATEGORIES as readonly string[]).includes(wf.category)) {
        reportError(`Invalid workflow category '${wf.category}' in '${normalizedPath}'. Must be one of: ${WORKFLOW_CATEGORIES.join(', ')}`);
      }
    } else if (type === 'cheatsheet') {
      const cs = obj as { entries?: unknown[] };
      if (!Array.isArray(cs.entries) || cs.entries.length < 1) {
        reportError(`Cheatsheet '${normalizedPath}' has fewer than 1 entries (${cs.entries?.length ?? 0})`);
      }
      if (Array.isArray(cs.entries) && cs.entries.length > sizeBudgets.cheatsheet_max_entries) {
        reportWarning(`Cheatsheet '${normalizedPath}' has entries count (${cs.entries.length}) exceeding maximum budget of ${sizeBudgets.cheatsheet_max_entries}`);
      }
    } else if (type === 'pattern') {
      const pattern = obj as { 
        concept?: string; 
        applicability?: string; 
        examples?: string[]; 
        lifecycle?: string; 
        stability?: string; 
        difficulty?: string; 
        domain?: string; 
        engineering_area?: string;
        decision_summary?: unknown;
        tradeoffs?: unknown[];
        decision_flow?: unknown[];
        anti_patterns?: unknown[];
        implementation_notes?: string;
        system_interactions?: unknown[];
        sources?: string[];
      };
      if (!pattern.concept) {
        reportError(`Pattern '${normalizedPath}' is missing 'concept' field`);
      }
      if (!pattern.applicability) {
        reportError(`Pattern '${normalizedPath}' is missing 'applicability' field`);
      }
      // Examples contract checks
      if (Array.isArray(pattern.examples)) {
        const frameworkPatterns = [
          /import\s+/,
          /require\s*\(/,
          /\.to\(\s*device\s*\)/,
          /optimizer\./,
          /nn\.Module/,
          /tf\.keras/,
          /sklearn\./,
        ];
        pattern.examples.forEach((example, idx) => {
          for (const regex of frameworkPatterns) {
            if (regex.test(example)) {
              reportWarning(`Pattern '${normalizedPath}' example ${idx + 1} contains framework-specific code matching pattern ${regex.toString()}. Patterns must contain only implementation-independent pseudocode.`);
              break;
            }
          }
        });
      }
      // Metadata warnings for stable patterns
      const isStableOrProd = pattern.lifecycle === 'stable' || pattern.stability === 'stable';
      if (isStableOrProd) {
        if (!pattern.difficulty) {
          reportWarning(`Pattern '${normalizedPath}' is stable/production-ready but is missing 'difficulty' metadata badge.`);
        }
        if (!pattern.domain) {
          reportWarning(`Pattern '${normalizedPath}' is stable/production-ready but is missing 'domain' metadata badge.`);
        }
        if (!pattern.engineering_area) {
          reportWarning(`Pattern '${normalizedPath}' is stable/production-ready but is missing 'engineering_area' metadata badge.`);
        }
      }
      // Production-quality pattern warnings
      if (isStableOrProd) {
        if (!pattern.decision_summary) {
          reportWarning(`Pattern '${normalizedPath}' is stable/production-ready but is missing 'decision_summary' field.`);
        }
        if (!pattern.tradeoffs || !Array.isArray(pattern.tradeoffs) || pattern.tradeoffs.length === 0) {
          reportWarning(`Pattern '${normalizedPath}' is stable/production-ready but is missing 'tradeoffs' field.`);
        } else if (pattern.tradeoffs.length < 3) {
          reportWarning(`Pattern '${normalizedPath}' has fewer than 3 tradeoff dimensions (${pattern.tradeoffs.length}).`);
        }
        if (!pattern.decision_flow || !Array.isArray(pattern.decision_flow) || pattern.decision_flow.length === 0) {
          reportWarning(`Pattern '${normalizedPath}' is stable/production-ready but is missing 'decision_flow' field.`);
        } else if (pattern.decision_flow.length < 2) {
          reportWarning(`Pattern '${normalizedPath}' decision flow has fewer than 2 steps (${pattern.decision_flow.length}).`);
        }
        if (!pattern.examples || !Array.isArray(pattern.examples) || pattern.examples.length < 1) {
          reportWarning(`Pattern '${normalizedPath}' is stable/production-ready but has fewer than 1 implementation example.`);
        }
        if (!pattern.anti_patterns || !Array.isArray(pattern.anti_patterns) || pattern.anti_patterns.length === 0) {
          reportWarning(`Pattern '${normalizedPath}' is stable/production-ready but is missing 'anti_patterns' field.`);
        } else {
          // Check for legacy string format in anti_patterns
          pattern.anti_patterns.forEach((antiPattern, idx) => {
            if (typeof antiPattern === 'string') {
              reportWarning(`Pattern '${normalizedPath}' anti_pattern ${idx + 1} uses legacy string format. Use structured object format with 'wrong', 'impact', 'fix' fields.`);
            }
          });
        }
        if (!pattern.implementation_notes) {
          reportWarning(`Pattern '${normalizedPath}' is stable/production-ready but is missing 'implementation_notes' field.`);
        }
        if (!pattern.system_interactions || !Array.isArray(pattern.system_interactions) || pattern.system_interactions.length === 0) {
          reportWarning(`Pattern '${normalizedPath}' is stable/production-ready but is missing 'system_interactions' field.`);
        }
        if (!pattern.sources || !Array.isArray(pattern.sources) || pattern.sources.length === 0) {
          reportWarning(`Pattern '${normalizedPath}' is stable/production-ready but is missing 'sources' (references) field.`);
        }
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

    // Enforce registered tags/aliases (validation_rules from aens.config.json)
    if (!validationRules.allow_unregistered_tags && Array.isArray(obj.tags)) {
      for (const tag of obj.tags) {
        if (typeof tag === 'string' && !registeredTags.has(tag)) {
          reportError(`Unregistered tag '${tag}' found in '${normalizedPath}'. Add it to 'data/registered-tags.json' or allow unregistered tags in config.`);
        }
      }
    }
    if (!validationRules.allow_unregistered_aliases && Array.isArray(obj.aliases)) {
      for (const alias of obj.aliases) {
        if (typeof alias === 'string' && !registeredAliases.has(alias)) {
          reportError(`Unregistered alias '${alias}' found in '${normalizedPath}'. Add it to 'data/registered-aliases.json' or allow unregistered aliases in config.`);
        }
      }
    }

    // Validate relationship budgets and duplicate relationships
    const relationshipFields = [
      'related_workflows',
      'related_models',
      'related_packages',
      'related_principles',
      'related_debug_guides',
      'related_patterns',
      'related_registry',
      'referenced_by_patterns',
      'referenced_by_models',
      'referenced_by_workflows',
      'alternatives',
      'related_content',
      'relatedcontent'
    ];
    let totalRelationshipsCount = 0;
    for (const field of relationshipFields) {
      const rels = obj[field];
      if (Array.isArray(rels)) {
        const relCount = rels.length;
        totalRelationshipsCount += relCount;
        
        // Check per-type budget
        if (relCount > sizeBudgets.max_relationships_per_type) {
          reportWarning(`Resource '${normalizedPath}' field '${field}' has ${relCount} relationships, exceeding max_relationships_per_type budget of ${sizeBudgets.max_relationships_per_type}`);
        }
        
        // Check duplicate relationships
        const seen = new Set<string>();
        rels.forEach((rel, idx) => {
          let idStr = '';
          if (typeof rel === 'string') {
            idStr = rel;
          } else if (typeof rel === 'object' && rel !== null) {
            const r = rel as { id?: string; type?: string };
            if (r.id) idStr = `${r.type || ''}:${r.id}`;
          }
          if (idStr) {
            if (seen.has(idStr)) {
              reportError(`Duplicate relationship to '${idStr}' in '${normalizedPath}' field '${field}' at index ${idx}`);
            } else {
              seen.add(idStr);
            }
          }
        });
      }
    }
    if (totalRelationshipsCount > sizeBudgets.max_total_relationships) {
      reportWarning(`Resource '${normalizedPath}' has ${totalRelationshipsCount} total relationships, exceeding max_total_relationships budget of ${sizeBudgets.max_total_relationships}`);
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

    // ── Architecture v3: Type-specific relationship fields ──
    function collectStringRelationships(field: string, expectedType: string, relationshipType: string): void {
      const ids = obj[field] as string[] | undefined;
      if (Array.isArray(ids)) {
        for (const id of ids) {
          if (typeof id !== 'string') {
            reportError(`Invalid ID in '${normalizedPath}' field '${field}': expected string, got ${typeof id}`);
            continue;
          }
          refsToCheck.push({
            sourceFile: normalizedPath,
            ref: {
              id,
              type: expectedType,
              relationship_type: relationshipType
            }
          });
        }
      }
    }

    if (type === 'pattern') {
      collectStringRelationships('related_workflows', 'workflow', 'related_workflows');
      collectStringRelationships('related_models', 'model', 'related_models');
      collectStringRelationships('related_packages', 'package', 'related_packages');
      collectStringRelationships('related_principles', 'principle', 'related_principles');
      collectStringRelationships('related_debug_guides', 'debug_guide', 'related_debug_guides');
    } else if (type === 'workflow') {
      collectStringRelationships('related_patterns', 'pattern', 'related_patterns');
      collectStringRelationships('related_models', 'model', 'related_models');
      collectStringRelationships('related_packages', 'package', 'related_packages');
      collectStringRelationships('related_debug_guides', 'debug_guide', 'related_debug_guides');
    } else if (type === 'debug_guide') {
      collectStringRelationships('related_workflows', 'workflow', 'related_workflows');
      collectStringRelationships('related_patterns', 'pattern', 'related_patterns');
      collectStringRelationships('related_models', 'model', 'related_models');
      collectStringRelationships('related_packages', 'package', 'related_packages');
      collectStringRelationships('related_registry', 'registry', 'related_registry');
    } else if (type === 'decision_guide') {
      collectStringRelationships('related_workflows', 'workflow', 'related_workflows');
      collectStringRelationships('related_models', 'model', 'related_models');
      collectStringRelationships('related_packages', 'package', 'related_packages');
    } else if (type === 'principle') {
      collectStringRelationships('referenced_by_patterns', 'pattern', 'referenced_by_patterns');
      collectStringRelationships('referenced_by_models', 'model', 'referenced_by_models');
      collectStringRelationships('referenced_by_workflows', 'workflow', 'referenced_by_workflows');
    }
  }
}

// ── STEP 8: ContentRef Integrity ────────────────────────────
if (SUPPRESS_BROKEN_REF_WARNINGS) {
  console.log(`\n📊 Skipping broken reference check (SUPPRESS_BROKEN_REF_WARNINGS=true)`);
} else {
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
}

// ── STEP 8.5: Bidirectional Relationship Validation ─────────
console.log(`\n📊 Checking bidirectional relationship consistency...`);
console.log(`ℹ️ [Info] Relationship integrity not checked for related_models/related_packages — documented exception, see ARCHITECTURE_FREEZE.md`);

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

// Check bidirectional consistency for Architecture v3 fields
for (const [sourceKey, relationships] of relationshipMap.entries()) {
  const sourceType = sourceKey.split(':')[0];
  
  for (const rel of relationships) {
    if (!rel.relationshipType) continue; // Skip legacy related_content without explicit type

    const targetKey = `${rel.targetType}:${rel.targetId}`;
    const targetRelationships = relationshipMap.get(targetKey);

    if (!targetRelationships) {
      // Target exists but has no relationships at all
      continue;
    }

    // Determine expected reciprocal based on source type and relationship field
    let expectedReciprocalField: string | undefined;
    
    if (sourceType === 'pattern' && rel.relationshipType === 'related_workflows') {
      expectedReciprocalField = 'related_patterns';
    } else if (sourceType === 'pattern' && rel.relationshipType === 'related_debug_guides') {
      expectedReciprocalField = 'related_patterns';
    } else if (sourceType === 'workflow' && rel.relationshipType === 'related_patterns') {
      expectedReciprocalField = 'related_workflows';
    } else if (sourceType === 'workflow' && rel.relationshipType === 'related_debug_guides') {
      expectedReciprocalField = 'related_workflows';
    } else if (sourceType === 'debug_guide' && rel.relationshipType === 'related_workflows') {
      expectedReciprocalField = 'related_debug_guides';
    } else if (sourceType === 'debug_guide' && rel.relationshipType === 'related_patterns') {
      expectedReciprocalField = 'related_debug_guides';
    } else if (sourceType === 'pattern' && rel.relationshipType === 'related_principles') {
      expectedReciprocalField = 'referenced_by_patterns';
    } else if (sourceType === 'principle' && rel.relationshipType === 'referenced_by_patterns') {
      expectedReciprocalField = 'related_principles';
    }

    if (!expectedReciprocalField) continue; // Skip unmapped relationship types

    // Check if target has the specific reciprocal relationship
    const hasReciprocal = targetRelationships.some(targetRel => {
      const targetSourceKey = `${targetRel.targetType}:${targetRel.targetId}`;
      return targetSourceKey === sourceKey && targetRel.relationshipType === expectedReciprocalField;
    });

    if (!hasReciprocal) {
      reportError(`Relationship integrity violation: '${sourceKey}' has '${rel.relationshipType}' → '${targetKey}', but '${targetKey}' does not have reciprocal '${expectedReciprocalField}' back to '${sourceKey}'. Bidirectional relationships are required for Architecture v3.`);
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
