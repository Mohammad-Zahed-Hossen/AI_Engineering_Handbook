## Architectural Review — AI Engineering Handbook

---

## Issue 1: Layout Loads All Data on Every Request

**Severity: Critical**

`app/layout.tsx` calls `getAllPackages()`, `getAllModels('ml')`, `getAllModels('dl')`, `getAllModels('llm')`, `getRegistryTasks()`, `getAllWorkflows()`, and `getAllCheatsheetIds()` — seven separate data loading operations — on every single page render to feed the Sidebar.

At 100+ models, 50+ packages, and 50+ workflows, this means every page load reads and parses potentially 200+ JSON files just to render the navigation sidebar. The sidebar only needs `name`, `id`, and `version` from each entry. Instead it loads the complete objects including `pros`, `cons`, `key_hyperparams`, `quick_start`, and everything else.

**Fix now.** Create a dedicated `lib/navigation.ts` that reads only `_index.json` files and constructs lightweight nav items. The sidebar should never receive full data objects.

```typescript
// lib/navigation.ts
export interface NavItem {
  id: string;
  name: string;
  version?: string;
}

export function getNavPackages(): NavItem[] {
  const ids = readIndex('packages');
  return ids.map(id => {
    const raw = readJSON<{ name: string; version: string }>(
      path.join(dataDir, 'packages', `${id}.json`)
    );
    return { id, name: raw.name, version: raw.version };
  });
}
```

Or better: store `name` and `version` directly in `_index.json` as an array of objects instead of strings, so you don't need to open individual files at all.

---

## Issue 2: `meta.json` is Manually Maintained — It Will Desync

**Severity: High**

`meta.json` currently shows counts that must be updated by hand every time you add a JSON entry. It already shows `"cheatsheets": 5` while the cheatsheet data folder is empty. The counts are wrong right now.

At 300+ entries, this will be perpetually out of sync. The dashboard will show stale numbers. You'll forget to update it, the AI coding tool will forget to update it, and it will silently lie to you.

**Fix now.** Delete `meta.json` entirely. Compute counts at build time from the `_index.json` files:

```typescript
// In app/page.tsx (Server Component)
export default function Home() {
  const packageIds = getAllPackageIds();
  const mlIds = getModelIds('ml');
  const dlIds = getModelIds('dl');
  const llmIds = getModelIds('llm');
  // counts are always accurate, derived from source of truth
}
```

The `getMeta()` function and `meta.ts` type can be removed entirely.

---

## Issue 3: Registry File Naming Convention is a Hidden Trap

**Severity: High**

`getRegistryByTask()` in `lib/data.ts` does this:

```typescript
path.join(dataDir, 'registry', `${task}s.json`)
```

It appends `s` to pluralize. So task `"embedding"` maps to `embeddings.json`, task `"llm"` maps to `llms.json`, task `"speech"` maps to `speechs.json`.

`speechs.json` is not a word. `ocrs.json` is not a word. This will silently fail when you add those task types, and the error message will be a cryptic file-not-found, not a helpful type error.

**Fix now.** Use a lookup map instead of string concatenation:

```typescript
const taskToFile: Record<RegistryTask, string> = {
  embedding:  'embeddings.json',
  reranker:   'rerankers.json',
  vision:     'vision.json',
  speech:     'speech.json',
  llm:        'llms.json',
  multimodal: 'multimodal.json',
  ocr:        'ocr.json',
};
```

---

## Issue 4: Zod Validation Runs on Every Request in Production

**Severity: High**

Every call to `getModel()`, `getPackage()`, `getWorkflow()` runs full Zod schema validation through `schema.parse(data)`. This is the right behavior for catching content errors during development. It is expensive overhead in production for a static site where the data never changes after build.

With 300+ entries and every page reload re-validating, this adds measurable latency per request. The data does not change at runtime — there is no reason to validate it at runtime.

**Fix now.** Separate validation from loading. Run Zod validation only during build via a dedicated validation script, not at read time:

```typescript
// lib/data.ts — production reads skip validation
function readJSON<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

// scripts/validate.ts — run this during CI or pre-build only
// Full Zod validation of every JSON file
```

Add `"validate": "tsx scripts/validate.ts"` to `package.json`. Run it before committing content. Do not run it on every page load.

---

## Issue 5: Sidebar Receives Full TypeScript Objects — Tight Coupling

**Severity: High**

The Sidebar component's prop interface imports `Package`, `Model`, and `Workflow` types:

```typescript
interface SidebarProps {
  packages: Package[];
  mlModels: Model[];
  dlModels: Model[];
  llmModels: Model[];
  registryTasks: string[];
  workflows: Workflow[];
  cheatsheets: string[];
}
```

This means the Sidebar is typed against your full data objects. When you add a field to `Model`, TypeScript will not complain because `Model[]` is still accepted. But it also means you're passing enormous objects through props when the sidebar uses exactly two fields: `id` and `name`.

This creates invisible coupling. Any change to the full `Model` type potentially affects Sidebar's prop interface expectations, and the Sidebar holds references to the full objects in memory unnecessarily.

**Fix now.** Define a narrow `SidebarData` type:

```typescript
interface SidebarNavItem { id: string; name: string; version?: string }

interface SidebarProps {
  packages: SidebarNavItem[];
  mlModels: SidebarNavItem[];
  dlModels: SidebarNavItem[];
  llmModels: SidebarNavItem[];
  registryTasks: string[];
  workflows: SidebarNavItem[];
  cheatsheets: string[];
}
```

---

## Issue 6: `alternatives` Field is an Unresolved String Array With Fragile Resolution Logic

**Severity: High**

In `app/models/[category]/[id]/page.tsx`, alternative model links are resolved by calling `getModelIds()` for all three categories to check if the alternative name exists:

```typescript
const getAltCategory = (altName: string): ModelCategory | null => {
  const slug = altName.toLowerCase().replace(/\s+/g, '-');
  try {
    if (getModelIds('ml').includes(slug)) return 'ml';
    if (getModelIds('dl').includes(slug)) return 'dl';
    if (getModelIds('llm').includes(slug)) return 'llm';
  } catch (e) {}
  return null;
};
```

This runs three `fs.readFileSync` calls per model page render, inside a `try/catch` that silently swallows all errors. At 100 entries with 5 alternatives each, this is 300 additional file reads per model page — all to resolve links that could have been stored correctly in the first place.

The deeper problem is that `alternatives` stores names like `"XGBoost"` but the resolution logic slugifies to `"xgboost"`. If someone writes `"XGBoost v2"` or `"xgboost"` or `"XGBoost (sklearn)"` in the alternatives array, the link silently fails and renders as a dead badge with no error.

**Fix now.** Change `alternatives` from `string[]` to a typed reference:

```typescript
// In types/model.ts
export interface ModelRef {
  name: string;
  id?: string;       // e.g. "xgboost"
  category?: ModelCategory;  // e.g. "ml"
}

// alternatives: ModelRef[]
```

This makes the link either explicit or absent. No fragile slug-matching at render time.

---

## Issue 7: No Cross-Section References

**Severity: High**

A model entry like `transformer.json` in `data/models/dl/` has no way to reference the `transformers` package entry, the RAG workflow that uses it, or the BAAI/bge registry entries related to it. Everything is isolated.

At 300+ entries, you'll constantly be on a model page wanting to jump to the workflow that uses it, or on a workflow page wanting to jump to the registry models it recommends. None of that navigation exists in the data model.

**Fix later, but design for it now.** Add optional `related` fields to each type:

```typescript
// Add to Model type
related_workflows?: string[];   // workflow ids
related_packages?: string[];    // package ids
related_registry?: string[];    // registry model ids
```

These are optional so existing entries don't break. They enable cross-section navigation without changing the core schema.

---

## Issue 8: `WorkflowStep.tools` is a `string[]` of Inconsistent Names

**Severity: Medium**

In workflows, the `tools` field contains strings like `["PyMuPDF", "python-docx", "unstructured"]` in one step and `["LangChain RecursiveCharacterTextSplitter", "LlamaIndex SentenceSplitter"]` in the next. These are inconsistent: some are package names, some are class names, some include the parent library.

There is no relationship between these strings and your actual package entries. When you have a `pymupdf.json` package entry and a workflow that mentions `"PyMuPDF"`, there is no link between them. You cannot click from a workflow step to the package reference.

**Fix later.** For now, enforce a naming convention in `content_guidelines.md`: tools must be written as `package_name.ClassName` when referring to a class, or just `package_name` when referring to a package. This at least makes future linking possible.

---

## Issue 9: `BaseMeta.sources` Requires URLs — Blocks Offline/Private Entries

**Severity: Medium**

The `BaseMetaSchema` requires:

```typescript
sources: z.array(z.string().url()).min(1)
```

This means every entry must have at least one valid HTTP URL. You cannot add an entry based on your own research notes, a paper that's behind a paywall, a local PDF you read, or just your own experience. Zod will reject it at validation time.

For a personal knowledge system, this requirement is too strict. It's also the most likely field to contain stale URLs as documentation sites restructure over time.

**Fix now.** Relax the schema:

```typescript
sources: z.array(z.string()).min(1)
// Allow any string, not just URLs. You can still use URLs, but aren't forced to.
```

---

## Issue 10: `fuse.js` is Installed But Has No Implementation

**Severity: Medium**

`fuse.js` appears in `package.json` dependencies. No `lib/search.ts` file exists. No search UI exists in `TopBar.tsx`. This is dead weight in the bundle.

It is also not a build-time concern — Fuse.js builds a search index at runtime in the browser. With 300+ entries, each with `summary`, `use_when`, `pros`, `cons` fields, the serialized search index passed to the client could exceed 500KB.

**Fix later, but plan now.** When you implement search:
- Build the Fuse index from a **stripped** dataset, not full data objects
- Index only `name`, `id`, `summary`, `use_when`, `category` — not `pros`, `cons`, `key_hyperparams`
- Either remove `fuse.js` from dependencies now or create a stub `lib/search.ts` so the import is at least real

---

## Issue 11: `generateStaticParams` Silently Swallows Errors

**Severity: Medium**

In `app/models/[category]/[id]/page.tsx`:

```typescript
export async function generateStaticParams() {
  for (const category of categories) {
    try {
      const ids = getModelIds(category);
      // ...
    } catch (e) {
      // Safely ignore missing category index configurations
    }
  }
}
```

The comment says "safely ignore." What actually happens: if `_index.json` is missing, corrupt, or has a malformed entry, the entire category is silently dropped from static generation. Those pages return 404 in production with no build-time warning. You will not know until you visit the URL.

**Fix now.** Remove the try/catch or replace it with explicit logging:

```typescript
} catch (e) {
  console.error(`[generateStaticParams] Failed to load index for category: ${category}`, e);
}
```

At minimum the build output should tell you something went wrong.

---

## Issue 12: `ModelCategory` is Duplicated Between Types and Schemas

**Severity: Medium**

`ModelCategory` is defined in `types/model.ts` as a TypeScript union type. `ModelCategorySchema` is defined in `lib/schemas/model.ts` as a Zod enum. These two definitions must be kept in sync manually. Right now they match. In 6 months, someone (or an AI tool) adds `'multimodal'` to `ModelCategory` in the types file and forgets to add it to `ModelCategorySchema`. The type system says it's valid, Zod rejects it at runtime.

**Fix now.** Derive the TypeScript type from the Zod schema, not the other way around:

```typescript
// lib/schemas/model.ts
export const ModelCategorySchema = z.enum(['ml', 'dl', 'llm']);
export type ModelCategory = z.infer<typeof ModelCategorySchema>;
```

Then remove `ModelCategory` from `types/model.ts` and import it from the schema. Single source of truth.

---

## Issue 13: Dashboard Re-Loads All Full Objects to Render Quick Links

**Severity: Medium**

`app/page.tsx` calls `getAllPackages()`, `getAllModels('ml')`, etc. to render lists of clickable links. It uses `pkg.name`, `pkg.id`, `pkg.version` from the full Package object, ignoring everything else. Same for models.

This is the same problem as Issue 1 but on the dashboard page specifically. At 50 packages each with 10+ sections of functions, loading all packages just to show their names in a list is wasteful.

**Fix now** as part of the same `lib/navigation.ts` solution from Issue 1. The dashboard and the sidebar should both read from the same lightweight nav index.

---

## Issue 14: No Build-Time Validation Enforced in CI or Pre-Build Script

**Severity: Medium**

The Zod schemas exist. The validation runs at request time (see Issue 4). But there is no `prebuild` script that validates all JSON files before `next build` runs. This means a malformed JSON file will cause a runtime 500 error on the deployed page, not a build failure.

For a static site, this is backwards. You want the build to fail, not the page.

**Fix now.** Add to `package.json`:

```json
"scripts": {
  "validate": "tsx scripts/validate.ts",
  "prebuild": "npm run validate",
  "build": "next build"
}
```

The validate script reads every JSON file through its Zod schema and exits with code 1 on any failure. The build never runs if validation fails.

---

## Issue 15: `CheatsheetItem` Has No `example` Field

**Severity: Low**

`CheatsheetItem` only has `fn` and `purpose`. For a cheatsheet, the thing you actually want is a quick usage example — the one-liner showing how to call it. The `fn` field is supposed to be a signature like `torch.zeros(*size)`, which is already the function definition. There's nowhere to put `torch.zeros(3, 4)` as a concrete example.

Compare this to `PackageFunction` which has both `fn` (signature) and `example` (concrete usage). The cheatsheet type is strictly less useful than the package type for the same information.

**Fix later.** Add `example?: string` to `CheatsheetItem` as an optional field. Optional so existing entries don't break.

---

## Issue 16: Registry `_index.json` Contains Task Names, Not File References

**Severity: Low**

`data/registry/_index.json` will contain `["embedding", "reranker", "vision", ...]`. These are task names. But the registry structure is different from other sections: each file is an array of models, not a single model. The index pattern doesn't cleanly express this difference.

When you want to add a "cross-task" registry page showing all active models regardless of task, you have no clean way to load all registry entries without knowing all task names and reading each file.

**Fix later.** For now, document this in `PROJECT_RULES.md`. When you add cross-task search, you'll need a `getAllRegistryModels()` function that iterates all tasks.

---

## Summary Table

| # | Issue | Severity | Fix When |
|---|---|---|---|
| 1 | Layout loads full objects for sidebar navigation | Critical | Now |
| 2 | `meta.json` manually maintained, already desynced | High | Now |
| 3 | Registry filename pluralization breaks on `speech`, `ocr` | High | Now |
| 4 | Zod validation runs at request time, not build time | High | Now |
| 5 | Sidebar receives full data objects instead of nav items | High | Now |
| 6 | `alternatives` resolved via fragile slug-matching | High | Now |
| 7 | No cross-section references between entries | High | Design now, implement later |
| 8 | `workflow.steps.tools` strings are inconsistent and unlinkable | Medium | Later |
| 9 | `sources` requires valid URLs, too strict for personal notes | Medium | Now |
| 10 | `fuse.js` installed but unimplemented, search index will be large | Medium | Later |
| 11 | `generateStaticParams` silently drops categories on error | Medium | Now |
| 12 | `ModelCategory` defined in two places, can desync | Medium | Now |
| 13 | Dashboard loads full objects for link rendering | Medium | Now (same fix as #1) |
| 14 | No pre-build validation script, malformed JSON causes runtime 500 | Medium | Now |
| 15 | `CheatsheetItem` missing `example` field | Low | Later |
| 16 | Registry `_index.json` structure doesn't reflect array-per-file nature | Low | Later |

---

**Fix now (before adding more content):** Issues 1, 2, 3, 4, 5, 6, 9, 11, 12, 13, 14. These are architectural problems that compound as you add entries. Fixing them at 5 entries takes 2 hours. Fixing them at 200 entries requires touching every JSON file and every page.