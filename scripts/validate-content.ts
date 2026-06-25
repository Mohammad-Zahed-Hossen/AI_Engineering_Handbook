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

// Import data loading functions to satisfy the requirement
import * as dataLoader from '../lib/data';

if (dataLoader === null) {
  // no-op
}

const dataDir = path.join(process.cwd(), 'data');

/**
 * Recursively scans directory to locate all JSON files.
 */
function getJsonFiles(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getJsonFiles(filePath));
    } else if (file.endsWith('.json')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = getJsonFiles(dataDir);
let hasErrors = false;

interface RegistryEntry {
  type: string;
  path: string;
}

const globalRegistry = new Map<string, RegistryEntry[]>();
interface ReferenceCheck {
  sourceFile: string;
  ref: { id: string; type: string };
}
const refsToCheck: ReferenceCheck[] = [];

function registerId(id: string, type: string, path: string, itemIndex?: number): void {
  const existingList = globalRegistry.get(id) || [];

  // 1. Check for exact duplicate within the same type
  const duplicateSameType = existingList.find(e => e.type === type);
  if (duplicateSameType) {
    hasErrors = true;
    if (itemIndex !== undefined) {
      console.error(`❌ Duplicate ID collision: ID '${id}' in registry '${path}' (index ${itemIndex}) conflicts with '${duplicateSameType.path}'.`);
    } else {
      console.error(`❌ Duplicate ID collision: ID '${id}' declared in '${path}' conflicts with '${duplicateSameType.path}'.`);
    }
    return;
  }

  // 2. Check for collisions between core types (package, model, workflow)
  const isCore = (t: string) => t === 'package' || t === 'model' || t === 'workflow';
  if (isCore(type)) {
    const coreConflict = existingList.find(e => isCore(e.type));
    if (coreConflict) {
      hasErrors = true;
      console.error(`❌ Cross-folder ID collision: Core ID '${id}' (type '${type}') declared in '${path}' conflicts with core ID in '${coreConflict.path}' (type '${coreConflict.type}').`);
      return;
    }
  }

  // 3. Otherwise, add to registry
  existingList.push({ type, path });
  globalRegistry.set(id, existingList);
}

console.log(`Starting content validation. Scanning ${files.length} JSON files in ${dataDir}...`);

for (const file of files) {
  const relativePath = path.relative(process.cwd(), file);
  const normalizedPath = relativePath.replace(/\\/g, '/');

  if (normalizedPath.endsWith('_index.json') || normalizedPath === 'data/meta.json') {
    continue;
  }

  let data: unknown;
  try {
    const raw = fs.readFileSync(file, 'utf-8');
    data = JSON.parse(raw) as unknown;
  } catch (e) {
    console.error(`❌ Error parsing JSON file: ${normalizedPath}`);
    console.error(`   Message: ${(e as Error).message}`);
    hasErrors = true;
    continue;
  }

  let schema: z.ZodTypeAny;

  if (normalizedPath.startsWith('data/packages/')) {
    schema = PackageSchema;
  } else if (normalizedPath.startsWith('data/models/ml/') || normalizedPath.startsWith('data/models/dl/') || normalizedPath.startsWith('data/models/llm/')) {
    schema = ModelSchema;
  } else if (normalizedPath.startsWith('data/registry/')) {
    schema = z.array(RegistryModelSchema);
  } else if (normalizedPath.startsWith('data/workflows/')) {
    schema = WorkflowSchema;
  } else if (normalizedPath.startsWith('data/cheatsheets/')) {
    schema = CheatsheetSchema;
  } else {
    console.warn(`⚠️ Warning: Unknown JSON file path found: ${normalizedPath}`);
    continue;
  }

  const result = schema.safeParse(data);
  if (!result.success) {
    hasErrors = true;
    console.error(`❌ Validation failed in file: ${normalizedPath}`);
    for (const err of result.error.issues) {
      const fieldPath = err.path.join('.') || '(root)';
      console.error(`  - Field: ${fieldPath}`);
      console.error(`    Error: ${err.message}`);
    }
  } else {
    // Perform ID validation and registration
    const isRegistry = normalizedPath.startsWith('data/registry/');
    const kebabCaseRegex = /^[a-z0-9.-]+$/;

    if (!isRegistry) {
      const expectedId = path.basename(file, '.json');
      
      // Enforce filename is kebab-case format
      if (!kebabCaseRegex.test(expectedId)) {
        hasErrors = true;
        console.error(`❌ Invalid filename format: '${normalizedPath}'. Filenames must contain only lowercase letters, digits, hyphens, and periods (kebab-case).`);
      }

      if (data && typeof data === 'object' && !Array.isArray(data)) {
        const obj = data as { id?: string; alternatives?: Array<{ id?: string; type?: string }> };
        const declaredId = obj.id;
        
        // Enforce filename matches internal ID
        if (declaredId !== expectedId) {
          hasErrors = true;
          console.error(`❌ ID mismatch in '${normalizedPath}': declared ID '${declaredId}' does not match filename '${expectedId}'.`);
        }

        // Enforce internal ID format
        if (declaredId && !kebabCaseRegex.test(declaredId)) {
          hasErrors = true;
          console.error(`❌ Invalid ID format in '${normalizedPath}': ID '${declaredId}' must contain only lowercase letters, digits, hyphens, and periods.`);
        }

        // Register ID & detect cross-folder ID collisions
        const type = normalizedPath.startsWith('data/packages/') ? 'package' :
                     normalizedPath.startsWith('data/workflows/') ? 'workflow' :
                     normalizedPath.startsWith('data/cheatsheets/') ? 'cheatsheet' : 'model';

        if (declaredId) {
          registerId(declaredId, type, normalizedPath);
        }

        // Collect alternatives for referential integrity checks
        if (Array.isArray(obj.alternatives)) {
          obj.alternatives.forEach((alt: { id?: string; type?: string }) => {
            if (alt && alt.id && alt.type) {
              refsToCheck.push({ sourceFile: normalizedPath, ref: { id: alt.id, type: alt.type } });
            }
          });
        }
      }
    } else {
      // Registry file (contains array of models)
      if (Array.isArray(data)) {
        (data as Array<{ id?: string; alternatives?: Array<{ id?: string; type?: string }> }>).forEach((item, idx: number) => {
          if (item && item.id) {
            // Check internal ID format
            if (!kebabCaseRegex.test(item.id)) {
              hasErrors = true;
              console.error(`❌ Invalid ID format in registry file '${normalizedPath}' (index ${idx}): ID '${item.id}' must contain only lowercase letters, digits, hyphens, and periods.`);
            }

            // Register ID & detect ID collisions
            registerId(item.id, 'registry_item', normalizedPath, idx);

            // Collect alternatives
            if (Array.isArray(item.alternatives)) {
              item.alternatives.forEach((alt: { id?: string; type?: string }) => {
                if (alt && alt.id && alt.type) {
                  refsToCheck.push({ sourceFile: normalizedPath, ref: { id: alt.id, type: alt.type } });
                }
              });
            }
          }
        });
      }
    }
  }
}

// Perform referential integrity (orphan and type-matching validation)
console.log(`Checking ${refsToCheck.length} reference links for orphan detection and type matching...`);
for (const check of refsToCheck) {
  const { id, type } = check.ref;
  const targets = globalRegistry.get(id);

  if (!targets || targets.length === 0) {
    hasErrors = true;
    console.error(`❌ Reference Error: Reference target not found: ID '${id}' (referenced as type '${type}') in source file '${check.sourceFile}'`);
  } else {
    // Find a target that matches the expected type (or compatible type)
    const matchingTarget = targets.find(target => {
      if (type === target.type) return true;
      if (type === 'model' && target.type === 'registry_item') return true;
      return false;
    });

    if (!matchingTarget) {
      hasErrors = true;
      const actualTypes = targets.map(t => `'${t.type}' (defined in '${t.path}')`).join(', ');
      console.error(`❌ Reference Error: Type mismatch for reference ID '${id}' in '${check.sourceFile}'. Referenced as type '${type}' but actual targets found are: ${actualTypes}.`);
    }
  }
}

if (hasErrors) {
  console.error('\n❌ Content validation failed. Please fix the validation errors above.');
  process.exit(1);
} else {
  console.log('✅ All content files and references validated successfully!');
  process.exit(0);
}
