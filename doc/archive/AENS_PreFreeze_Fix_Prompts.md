# AENS Pre-Freeze Fix Prompts
# Run these in order. Each phase is independent and safe.
# After all three are done → architecture is frozen.

---

## Phase F1 — Fix the Duplicate Registry Map

**The problem:**
The registry task → filename mapping exists in two places:
- `lib/data.ts` as `REGISTRY_TASK_FILES`
- `scripts/validate-content.ts` as `FILE_TO_TASK`

They are inverses of each other and must always be kept in sync manually.
Adding a new registry task means editing two files. This is the only real DRY
violation in the codebase that will bite you as content grows.

**Risk: Zero. This is purely a refactor with no behavior change.**

---

```
You are working on the AENS project at D:\Project\ai-engineering-handbook.

This is a small targeted refactor. Do not touch anything outside the files listed below.

## The problem

The registry task-to-file mapping is duplicated in two places:

1. `lib/data.ts` — `REGISTRY_TASK_FILES` constant (maps task name → filename)
   Example: `embedding: 'embeddings.json'`

2. `scripts/validate-content.ts` — `FILE_TO_TASK` constant (maps filename → task name)
   Example: `'embeddings.json': 'embedding'`

These are inverses of the same truth. Adding a new registry task requires
editing both files. This must be fixed before the architecture is frozen.

## What to build

### Step 1 — Create `lib/config/registry.ts`

Create this new file with exactly this content:

```typescript
/**
 * Single source of truth for registry task ↔ filename mapping.
 * To add a new registry task: add ONE entry here. Nowhere else.
 */
export const REGISTRY_TASK_FILES = {
  embedding:  'embeddings.json',
  reranker:   'rerankers.json',
  vision:     'vision.json',
  speech:     'speech.json',
  llm:        'llms.json',
  multimodal: 'multimodal.json',
  ocr:        'ocr.json',
} as const;

export type RegistryTask = keyof typeof REGISTRY_TASK_FILES;

/** Derived reverse map — filename → task name. Never edit this manually. */
export const REGISTRY_FILE_TO_TASK = Object.fromEntries(
  Object.entries(REGISTRY_TASK_FILES).map(([task, file]) => [file, task])
) as Record<string, RegistryTask>;
```

### Step 2 — Update `lib/data.ts`

At the top of the file, add this import (after the existing imports):
```typescript
import { REGISTRY_TASK_FILES, REGISTRY_FILE_TO_TASK } from './config/registry';
import type { RegistryTask } from './config/registry';
```

Remove the existing `REGISTRY_TASK_FILES` constant from lib/data.ts (the one
currently defined inline near the registry section).

Check if `RegistryTask` is currently imported from `@/types/registry`. If so,
replace that import with the one from `./config/registry` above. If RegistryTask
is defined elsewhere and used by other things, keep the other import and just
remove the duplicate type — but ensure the `RegistryTask` used in `lib/data.ts`
functions comes from `lib/config/registry`.

In the `getRegistryTasks()` function, replace the inline `reverseMap` with
`REGISTRY_FILE_TO_TASK`:

Before:
```typescript
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
```

After:
```typescript
return files
  .map(file => REGISTRY_FILE_TO_TASK[file])
  .filter((task): task is RegistryTask => task !== undefined)
  .sort((a, b) => a.localeCompare(b));
```

### Step 3 — Update `scripts/validate-content.ts`

Add this import at the top of the file (after existing imports):
```typescript
import { REGISTRY_FILE_TO_TASK } from '../lib/config/registry';
```

Remove the existing `FILE_TO_TASK` constant from validate-content.ts.

Find every usage of `FILE_TO_TASK` in validate-content.ts and replace it
with `REGISTRY_FILE_TO_TASK`. The variable name changes, the behavior is identical.

### Step 4 — Check `types/registry.ts`

Open `types/registry.ts`. If it defines `RegistryTask` as a type or z.enum,
that is fine — leave it. The Zod schema for validation is separate from our
config map. Just make sure `lib/data.ts` is not importing a conflicting
`RegistryTask` from two places. If there is a conflict, prefer the one from
`lib/config/registry.ts` in data.ts, and keep the Zod-derived one only in the
schema/type files.

## Constraints

- Do NOT change any behavior. This is a pure refactor.
- Do NOT touch any component files, page files, or JSON data files.
- Do NOT add any npm packages.
- `npm run validate` must pass after this change.
- `npm run build` must pass after this change.

## Verification

After implementing:
1. `lib/config/registry.ts` exists and exports `REGISTRY_TASK_FILES`,
   `REGISTRY_FILE_TO_TASK`, and `RegistryTask`.
2. The word `FILE_TO_TASK` no longer appears in `validate-content.ts`
   (replaced by `REGISTRY_FILE_TO_TASK`).
3. There is no inline `REGISTRY_TASK_FILES` object literal remaining in `lib/data.ts`.
4. `npm run validate` passes with no errors.
5. Adding a new registry task in the future requires editing only
   `lib/config/registry.ts` and creating the data file. Nothing else.
```

---

## Phase F2 — Fix the Navigation Loading

**The problem:**
`app/layout.tsx` calls `getPackageNavItems()`, `getModelNavItems()` (×3),
`getWorkflowNavItems()`, and `getCheatsheetNavItems()`. Each of these reads
every JSON file in its directory to extract just `id` and `name`. At 6 packages
this is fine. At 500 packages, this means parsing 500 full JSON files on every
build just to get names for the sidebar.

The fix is a single lightweight `_nav.json` index per directory. One file read
instead of N file reads. The sidebar stays exactly the same — no pagination,
no lazy loading, no UX change.

**Risk: Low. The nav behavior is identical. Only the data source changes.**

---

```
You are working on the AENS project at D:\Project\ai-engineering-handbook.

This is a targeted performance fix for the navigation data loading.
Do not touch any component, page, or schema file.

## The problem

`app/layout.tsx` loads navigation data by calling functions that read every
content JSON file individually just to extract `id` and `name`:

- `getPackageNavItems()` → reads packages/numpy.json, packages/pandas.json, etc.
- `getModelNavItems('ml')` → reads models/ml/xgboost.json, etc.
- `getWorkflowNavItems()` → reads workflows/rag.json, etc.
- `getCheatsheetNavItems()` → reads cheatsheets/pytorch.json, etc.

At 500 packages this means parsing 500 large JSON files just to get names.
The fix: each directory gets a `_nav.json` index file containing only the
lightweight nav data. One file read instead of N.

## Step 1 — Create `scripts/build-nav-index.ts`

This script generates `_nav.json` files for each content directory.
Run it manually when content changes, or it will be wired into `prebuild`.

```typescript
/**
 * Generates lightweight _nav.json index files for each content directory.
 * Run with: npx tsx scripts/build-nav-index.ts
 * 
 * Each _nav.json contains only the fields needed for sidebar navigation:
 * id, name, and version (for packages only).
 * 
 * These files are committed to Git alongside content files.
 */
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

interface NavEntry {
  id: string;
  name: string;
  version?: string;
}

function readJSON<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
}

function buildNavIndex(dirPath: string, versionField = false): NavEntry[] {
  if (!fs.existsSync(dirPath)) return [];
  
  return fs.readdirSync(dirPath)
    .filter(f => f.endsWith('.json') && !f.startsWith('_'))
    .sort()
    .map(file => {
      const data = readJSON<Record<string, string>>(path.join(dirPath, file));
      const entry: NavEntry = { id: data.id, name: data.name };
      if (versionField && data.version) entry.version = data.version;
      return entry;
    });
}

function writeNavIndex(dirPath: string, entries: NavEntry[]) {
  const outPath = path.join(dirPath, '_nav.json');
  fs.writeFileSync(outPath, JSON.stringify(entries, null, 2));
  console.log(`  ✓ ${outPath.replace(process.cwd(), '.')} (${entries.length} entries)`);
}

console.log('Building nav indexes...');

// Packages (include version)
writeNavIndex(
  path.join(dataDir, 'packages'),
  buildNavIndex(path.join(dataDir, 'packages'), true)
);

// Models (three categories)
for (const cat of ['ml', 'dl', 'llm']) {
  writeNavIndex(
    path.join(dataDir, 'models', cat),
    buildNavIndex(path.join(dataDir, 'models', cat))
  );
}

// Workflows
writeNavIndex(
  path.join(dataDir, 'workflows'),
  buildNavIndex(path.join(dataDir, 'workflows'))
);

// Cheatsheets
writeNavIndex(
  path.join(dataDir, 'cheatsheets'),
  buildNavIndex(path.join(dataDir, 'cheatsheets'))
);

console.log('Done.');
```

## Step 2 — Run the script immediately

After creating the script, run it:
```
npx tsx scripts/build-nav-index.ts
```

This will create these files (commit them to Git):
- `data/packages/_nav.json`
- `data/models/ml/_nav.json`
- `data/models/dl/_nav.json`
- `data/models/llm/_nav.json`
- `data/workflows/_nav.json`
- `data/cheatsheets/_nav.json`

Verify that each `_nav.json` was created and contains the correct entries
by opening one and checking it looks like:
```json
[
  { "id": "numpy", "name": "NumPy", "version": "2.0.0" },
  { "id": "pandas", "name": "Pandas", "version": "2.0.0" }
]
```

## Step 3 — Update `lib/data.ts` nav functions

Replace the four nav item functions with versions that read `_nav.json`:

Replace `getPackageNavItems`:
```typescript
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
```

Replace `getModelNavItems`:
```typescript
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
```

Replace `getWorkflowNavItems`:
```typescript
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
```

Replace `getCheatsheetNavItems`:
```typescript
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
```

## Step 4 — Wire the script into package.json

In `package.json`, update the `prebuild` script so that nav indexes are
regenerated before every build:

Before:
```json
"prebuild": "npm run validate"
```

After:
```json
"prebuild": "npm run validate && npx tsx scripts/build-nav-index.ts"
```

Also add a standalone script for manual use:
```json
"build:nav": "npx tsx scripts/build-nav-index.ts"
```

## Step 5 — Update `scripts/validate-content.ts` to skip `_nav.json`

The validate script scans directories for JSON files. `_nav.json` files are
generated artifacts and should not be validated as content.

Find the place in validate-content.ts where JSON files are collected
(likely using `readdirSync` or `getJsonFiles`). Add a filter to skip
files starting with `_`:

```typescript
// In getJsonFiles() or wherever directory scanning happens:
.filter(file => file.endsWith('.json') && !file.startsWith('_'))
```

## Constraints

- Do NOT change the Sidebar component or any component file.
- Do NOT change the NavItem interface.
- Do NOT change app/layout.tsx.
- The fallback in each function ensures the app still works even if
  someone runs `npm run dev` before running `build-nav-index`.
- `_nav.json` files are committed to Git — they are not gitignored.
- `npm run validate` must pass after this change.
- `npm run build` must pass after this change.

## Verification

1. All six `_nav.json` files exist and contain correct data.
2. The sidebar renders identically to before.
3. `npm run validate` does not try to validate `_nav.json` as content.
4. `npm run build` runs build-nav-index before validating.
5. Adding a new package in the future requires: add the JSON file,
   run `npm run build:nav` (or just `npm run build`), done.
```

---

## Phase F3 — Fix the `getRecentContent` Full Scan

**The problem:**
`getRecentContent()` in `lib/data.ts` loads every single content JSON file
from every directory just to read `updated_at` and sort by date. At 2,000
files this is the slowest function in the codebase.

The fix: the `_nav.json` files created in Phase F2 already contain `id` and
`name`. We extend them to also include `updated_at`. Then `getRecentContent`
reads 6 small index files instead of 2,000 large content files.

**Risk: Very low. Behavior is identical. Just reads from the new index.**

---

```
You are working on the AENS project at D:\Project\ai-engineering-handbook.

Phase F2 has been completed. `_nav.json` index files exist in each content
directory and are generated by `scripts/build-nav-index.ts`.

This phase extends those index files to also carry `updated_at`, which allows
`getRecentContent()` to stop loading all content files just to sort by date.

## Step 1 — Update `scripts/build-nav-index.ts`

Update the `NavEntry` interface to include `updated_at` and `type`:

```typescript
interface NavEntry {
  id: string;
  name: string;
  version?: string;
  updated_at?: string;
  type: 'package' | 'model' | 'workflow' | 'cheatsheet';
  category?: string; // for models: 'ml' | 'dl' | 'llm'
}
```

Update `buildNavIndex` to accept a `type` and optional `category` parameter
and include them in each entry:

```typescript
function buildNavIndex(
  dirPath: string,
  type: NavEntry['type'],
  options: { versionField?: boolean; category?: string } = {}
): NavEntry[] {
  if (!fs.existsSync(dirPath)) return [];

  return fs.readdirSync(dirPath)
    .filter(f => f.endsWith('.json') && !f.startsWith('_'))
    .sort()
    .map(file => {
      const data = readJSON<Record<string, string>>(path.join(dirPath, file));
      const entry: NavEntry = {
        id: data.id,
        name: data.name,
        type,
        updated_at: data.updated_at ?? '',
      };
      if (options.versionField && data.version) entry.version = data.version;
      if (options.category) entry.category = options.category;
      return entry;
    });
}
```

Update all the `writeNavIndex` calls to pass the new arguments:

```typescript
// Packages
writeNavIndex(
  path.join(dataDir, 'packages'),
  buildNavIndex(path.join(dataDir, 'packages'), 'package', { versionField: true })
);

// Models
for (const cat of ['ml', 'dl', 'llm'] as const) {
  writeNavIndex(
    path.join(dataDir, 'models', cat),
    buildNavIndex(path.join(dataDir, 'models', cat), 'model', { category: cat })
  );
}

// Workflows
writeNavIndex(
  path.join(dataDir, 'workflows'),
  buildNavIndex(path.join(dataDir, 'workflows'), 'workflow')
);

// Cheatsheets
writeNavIndex(
  path.join(dataDir, 'cheatsheets'),
  buildNavIndex(path.join(dataDir, 'cheatsheets'), 'cheatsheet')
);
```

After editing the script, re-run it to regenerate all `_nav.json` files:
```
npx tsx scripts/build-nav-index.ts
```

Verify that `data/packages/_nav.json` now contains entries like:
```json
[
  { "id": "numpy", "name": "NumPy", "version": "2.0.0", "type": "package", "updated_at": "2026-06-24" }
]
```

## Step 2 — Update `lib/data.ts` — replace `getRecentContent`

The current `getRecentContent()` loads every content file from every
directory. Replace it with a version that reads from the `_nav.json` indexes.

Replace the entire `getRecentContent` function with this:

```typescript
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
```

Then add this private fallback function just above `getRecentContent` (not exported):

```typescript
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
```

## Constraints

- Do NOT change the `RecentContentItem` interface or its exported shape.
- Do NOT change the dashboard page or any component.
- The fallback function ensures the dashboard still works on a fresh clone
  before `build-nav-index` has been run.
- `_nav.json` files are re-committed after this step since they now contain
  `type` and `updated_at` fields they didn't have before.
- `npm run validate` must pass.
- `npm run build` must pass.

## Verification

1. Re-run `npx tsx scripts/build-nav-index.ts` and confirm the output
   `_nav.json` files now contain `type` and `updated_at` for every entry.
2. The dashboard "Recent" section shows the same items as before.
3. `getRecentContent` no longer loads individual package/model/workflow/
   cheatsheet JSON files — it only reads the 6 nav index files.
4. Adding a new content file and running `npm run build` automatically
   updates the nav index and makes it appear in Recent.
```

---

## After Phase F3 — Architecture is frozen.

The three fixes address every real issue identified in the audit:

| Fix | What it solves |
|---|---|
| F1 — Registry config | Registry task map duplicated in 2 files → 1 file |
| F2 — Nav index | Sidebar loads N JSON files → loads 1 small index file |
| F3 — Recent content | Dashboard scans all files → reads 6 small index files |

From this point, adding any content requires only:
1. Create the JSON file
2. Run `npm run build` (which auto-runs validate + build-nav-index)

Nothing else needs to change.
