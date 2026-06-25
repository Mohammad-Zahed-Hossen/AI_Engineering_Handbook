# Senior Staff Engineer Architectural Review
## AI Engineering Handbook — Next.js 15 + Static JSON

**Review Date:** 2026-06-24  
**Assumed Scale:** 100+ models, 50+ packages, 50+ workflows, 25+ cheatsheets, 100+ registry models  
**Time Horizon:** 3+ years maintainability

---

## Executive Summary

The project is structurally sound for its current ~15-entry scale but has **critical architectural deficiencies** that will compound aggressively as content grows. The most dangerous issues are:

1. **O(n) data loading on every page** — no caching, no memoization, no virtualization
2. **Manually maintained index files** — guaranteed to drift and break builds at scale
3. **Search is completely absent** — lib/search.ts referenced but does not exist
4. **Sidebar DOM explosion** — will render 300+ links on every page
5. **Zero referential integrity** — alternatives are string guesses with heuristic slug mapping

The project will become unmaintainable between 50–100 entries unless these are addressed now. Several fixes are cheap (auto-indexing, caching, search) while the project is small. Waiting until 200+ entries makes them expensive.

---

## 1. Future Scalability Problems

### 1.1 Sidebar Renders Entire Dataset as DOM Nodes
**Severity:** Critical  
**Why it matters:** The `Sidebar` component receives `packages`, `mlModels`, `dlModels`, `llmModels`, `registryTasks`, `workflows`, and `cheatsheets` as props and renders every single item as a `<Link>`. At 100+ models + 50 packages + 50 workflows + 25 cheatsheets + 7 registry tasks, the sidebar will emit **300+ DOM nodes** on every page. React reconciliation time, memory footprint, and mobile performance will degrade significantly. The sidebar is a layout component, so this cost is paid on every navigation.

**Recommended fix:**
- Collapse model categories by default; show only active category expanded
- Implement a virtualized or lazy-loaded sidebar for large sections
- Move to an accordion/collapsible pattern with client-side state
- Or: switch to a command palette / search-driven navigation and remove the flat link list

**Fix now or later:** Fix now. The component structure is simple to refactor today.

---

### 1.2 Layout.tsx Loads All Data on Every Page Render
**Severity:** Critical  
**Why it matters:** `app/layout.tsx` calls `getAllPackages()`, `getAllModels('ml')`, `getAllModels('dl')`, `getAllModels('llm')`, `getRegistryTasks()`, `getAllWorkflows()`, and `getAllCheatsheetIds()`. In Next.js App Router, the root layout is re-rendered for every page. With 300+ entries, this means **300+ JSON files are read from disk on every single page request** (or during static generation of every page). There is no memoization, no `React.cache`, no `unstable_cache`. Build times and memory usage scale linearly with content count.

**Recommended fix:**
- Wrap all `getAll*` functions with `React.cache` (or `unstable_cache` for ISR/static)
- Or: load sidebar data once at build time and serialize it into a static JSON manifest that the layout imports directly
- Consider whether the sidebar even needs full objects — it only needs `id`, `name`, and `version` for packages

**Fix now or later:** Fix now. Add one `cache()` wrapper and the problem is solved for the foreseeable future.

---

### 1.3 Model Alternatives Use Brute-Force Cross-Category Scan
**Severity:** High  
**Why it matters:** In `app/models/[category]/[id]/page.tsx`, the `getAltCategory` function calls `getModelIds('ml')`, `getModelIds('dl')`, and `getModelIds('llm')` for **every alternative** in a model. If a model has 5 alternatives and there are 100 models per category, this does 15 index file reads per model detail page. With 300 models, that's 4,500 file reads during static generation of model detail pages alone. No caching.

**Recommended fix:**
- Build a single lookup map (`Map<slug, ModelCategory>`) once at build time and pass it to pages
- Or store `category` in the `alternatives` array instead of bare strings: `alternatives: [{ id: 'xgboost', category: 'ml' }]`

**Fix now or later:** Fix now. The data model change is breaking, so doing it later will require a migration script.

---

### 1.4 No Pagination or Virtualization on List Views
**Severity:** High  
**Why it matters:** The registry task page renders all models in a single table, then renders all models again as individual `SectionCard` components below the table. At 100 registry entries, this page will emit **200+ DOM nodes** plus two full traversals of the same dataset. The model category list page renders all models in a table with no pagination. Browser memory and paint time will suffer.

**Recommended fix:**
- Add virtualized tables or paginated lists for registry and model list pages
- Alternatively, switch to a "load more" or virtual scroll pattern for the card section
- For the table, use a lightweight virtualization library or CSS `content-visibility`

**Fix now or later:** Fix when registry entries exceed 30. Monitor the registry page bundle size as a leading indicator.

---

## 2. Content Management Bottlenecks

### 2.1 Manual `_index.json` Files are a Guaranteed Drift Hazard
**Severity:** Critical  
**Why it matters:** Every new entry requires editing two files: the data JSON and the corresponding `_index.json`. This is a manual, error-prone process. At 100+ entries, authors will forget to update indices, leading to build failures or "ghost" entries that appear in lists but have no detail page (or vice versa). There is no CI validation that index files match the filesystem.

**Recommended fix:**
- Generate `_index.json` files at build time using a pre-build script (e.g., `scripts/generate-index.ts`)
- Or generate them dynamically in `lib/data.ts` by scanning directories with `fs.readdirSync()` and filtering `.json` files (excluding `_index.json`)
- Add a CI check that fails if `git status` shows dirty `_index.json` files after running the generator

**Fix now or later:** Fix now. The script is <50 lines. Doing it later requires a migration.

---

### 2.2 `meta.json` is Manually Maintained and Already Stale-Prone
**Severity:** High  
**Why it matters:** `data/meta.json` contains hardcoded counts: `"models_ml": 1`, `"models_dl": 1`, etc. These counts are guaranteed to drift from reality as content is added. With 100+ entries, maintaining this by hand is unsustainable. The dashboard uses these counts for badges, so stale data will mislead users.

**Recommended fix:**
- Delete `meta.json` entirely
- Compute counts dynamically in `getMeta()` by counting actual entries: `getModelIds('ml').length`
- If build-time performance is a concern, memoize the computed meta object

**Fix now or later:** Fix now. This is a one-line refactor in `lib/data.ts`.

---

### 2.3 No Content Validation at the Repository Level
**Severity:** Medium  
**Why it matters:** The Zod schemas validate at runtime, but only when a page is rendered. There is no pre-commit or pre-build script that validates all JSON files against schemas. A malformed JSON file could sit undetected until someone visits the specific page that loads it. With 300+ files, this is a statistical certainty.

**Recommended fix:**
- Add a `npm run validate` script that traverses `data/` and validates every `.json` file against its Zod schema
- Run it in CI and as a pre-commit hook
- This also catches missing `_index.json` references and orphaned files

**Fix now or later:** Fix now. The script is ~30 lines.

---

### 2.4 No Cross-Entity Referential Integrity
**Severity:** High  
**Why it matters:** `alternatives` fields are just strings. A model's alternative might be `"XGBoost"`, but the actual file ID is `"xgboost"`. The detail page attempts a heuristic match (`toLowerCase().replace(/\s+/g, '-')`), which will fail for non-trivial cases (e.g., `"LightGBM (Goss)"` → `"lightgbm-(goss)"` vs `"lightgbm-goss"`). With 100+ entries, manual link maintenance will break.

**Recommended fix:**
- Change `alternatives` from `string[]` to `{ id: string; category?: ModelCategory }[]` in the schema
- Or: maintain a global slug→entity map and validate all references at build time

**Fix now or later:** Fix now. Schema change is breaking; delay makes it harder.

---

## 3. Search Architecture Weaknesses

### 3.1 Search is Completely Missing
**Severity:** Critical  
**Why it matters:** `PROJECT_RULES.md` references `lib/search.ts` (Phase 4) with Fuse.js. The file does not exist. With 100+ entries across 5 entity types, browsing is no longer a viable discovery strategy. Users will need to search by model name, package function, code snippet, or hyperparameter. Without search, the project fails its primary purpose of "quick recall" at scale.

**Recommended fix:**
- Implement client-side search with a pre-built search index
- At build time, generate a single `search-index.json` containing all searchable content (titles, summaries, function names, code snippets)
- Load this index on the dashboard or in a search modal; use `fuse.js` or `minisearch` for fuzzy matching
- Keep the index under ~500KB by limiting indexed fields

**Fix now or later:** Fix now. At 15 entries you can test it cheaply. At 200 entries, the index generation logic becomes harder to validate.

---

### 3.2 No Structured Search or Filtering
**Severity:** High  
**Why it matters:** The only filter in the entire app is `problem_types` on the model list page. There is no way to search for "all models with `memory_usage: low` and `inference_speed: fast`", or "all packages with functions in category `indexing`", or "all registry models under 100MB". At 100+ entries, this becomes a critical UX gap.

**Recommended fix:**
- Add a structured query builder or facet-based filters on list pages
- Or: expose a search syntax in the global search (e.g., `memory:low inference:fast`)

**Fix now or later:** Fix after implementing basic search.

---

### 3.3 No Full-Text Search Within Code Snippets
**Severity:** Medium  
**Why it matters:** `quick_start`, `example`, and `fn` fields contain code. Users will want to search for "`SentenceTransformer`" or "`n_estimators`" across all entries. Without indexing code snippets, the search is incomplete.

**Recommended fix:**
- Include code fields in the search index
- Tokenize code snippets by identifiers and function names

**Fix now or later:** Fix when implementing search.

---

## 4. Static Generation Limitations

### 4.1 `next.config.ts` is Empty — No Static Export Configuration
**Severity:** High  
**Why it matters:** The `next.config.ts` exports a default empty config. There is no `output: 'export'`, no `distDir`, no `generateBuildId`, no `images` optimization config. The project claims to prioritize static generation, but it isn't configured for it. If the intention is to deploy to static hosting (GitHub Pages, S3, etc.), this must be explicit.

**Recommended fix:**
- Add `output: 'export'` and `distDir: 'dist'` if deploying statically
- Configure `images: { unoptimized: true }` if using static export (Next.js Image component requires this)
- Add `trailingSlash: true` for static hosting compatibility

**Fix now or later:** Fix now. One-line change.

---

### 4.2 No Build-Time Caching or Incremental Static Regeneration
**Severity:** Medium  
**Why it matters:** Every content change requires a full rebuild. With 300+ pages and no ISR, even a typo fix in one JSON file rebuilds the entire site. Build times will grow linearly with content count. There is no `unstable_cache` used in `lib/data.ts`.

**Recommended fix:**
- Use `React.cache` for all data loading functions in `lib/data.ts`
- If using a server runtime, add `unstable_cache` around expensive aggregations
- Consider ISR with `revalidate` for pages that don't need immediate updates

**Fix now or later:** Fix now. Adding `cache()` wrappers is trivial at small scale.

---

### 4.3 `generateStaticParams` Reads Disk Synchronously in Nested Loops
**Severity:** Medium  
**Why it matters:** `generateStaticParams` for model details uses `for...of` with `getModelIds(category)` inside, which calls `fs.readFileSync`. At 300 models, this blocks the event loop during build. While Next.js build is generally tolerant, this pattern will slow down as content grows.

**Recommended fix:**
- Use `Promise.all` with async file operations if switching to async fs
- Or: generate static params from a single pre-built manifest file instead of scanning directories

**Fix now or later:** Fix later, when build time becomes perceptibly slow.

---

## 5. Data Modeling Issues

### 5.1 Dates are Strings, Not Date Objects
**Severity:** Medium  
**Why it matters:** `created_at` and `updated_at` are typed as `string` in TypeScript and validated by regex in Zod. This means you cannot sort, compare, or query by date programmatically. You cannot ask "show me models updated in the last 30 days" or "sort registry models by verification date". The regex validation is also fragile — it accepts invalid dates like `"2024-99-99"`.

**Recommended fix:**
- Use `z.string().date()` (Zod 3.23+) or `z.coerce.date()` for validation
- Update TypeScript types to `Date` or keep as ISO string but use a proper date parser
- Add a utility layer for date operations

**Fix now or later:** Fix now. Schema change is breaking; delay requires migration.

---

### 5.2 `RegistryTask` ↔ Filename Pluralization Convention is Brittle
**Severity:** Medium  
**Why it matters:** `getRegistryByTask` constructs filenames with `${task}s.json`. The `RegistryTask` enum uses singular values (`'embedding'`), but the files are plural (`embeddings.json`). This is a convention, not a rule. If a future task has an irregular plural (e.g., `ocr` → `ocrs` is fine, but `speech` → `speechs` is awkward), the convention breaks. It also means you can't add a task whose plural doesn't fit this pattern.

**Recommended fix:**
- Store the filename mapping explicitly in a registry config object, or
- Rename files to match the enum exactly (singular) and drop the pluralization logic

**Fix now or later:** Fix now. There are only 7 tasks; renaming is cheap.

---

### 5.3 `PackageFunction.category` is Unconstrained `string`
**Severity:** Medium  
**Why it matters:** `PackageFunction.category` is typed as `string` with no enum or validation. This means any arbitrary string can be used, leading to inconsistency (`"creation"`, `"Creation"`, `"create"`, `"array-creation"`). With 50+ packages, this will fragment into inconsistent tagging.

**Recommended fix:**
- Define a `PackageFunctionCategory` enum with canonical values
- Or: validate against a controlled vocabulary in Zod (`z.enum([...])`)

**Fix now or later:** Fix now. Adding an enum is non-breaking if you accept the union of current values.

---

### 5.4 No Foreign Key Relationships Between Entity Types
**Severity:** High  
**Why it matters:** A `Package` (e.g., `scikit-learn`) and a `Model` (e.g., `random-forest`) and a `RegistryModel` (e.g., `BAAI/bge-large-en-v1.5`) are completely isolated. There is no way to navigate from a model to its implementation packages, or from a registry entry to its model documentation. At scale, users expect cross-linking.

**Recommended fix:**
- Add `related_packages?: string[]` to `Model` schema
- Add `related_models?: string[]` to `RegistryModel` schema
- Add `used_in_models?: string[]` to `Package` schema
- Validate these references at build time

**Fix now or later:** Fix later, when the content volume justifies cross-linking. But design the schema slots now.

---

### 5.5 `Workflow.category` is Just `string`
**Severity:** Low  
**Why it matters:** Similar to `PackageFunction.category`, this is an unconstrained string. With 50+ workflows, categories will diverge (`"Fine-Tuning"`, `"fine-tuning"`, `"finetuning"`, `"Transfer Learning"`).

**Recommended fix:**
- Convert to an enum: `WorkflowCategory = 'fine-tuning' | 'inference' | 'evaluation' | ...`

**Fix now or later:** Fix later, when there are enough workflows to see the pattern.

---

## 6. Navigation and UX Problems

### 6.1 Sidebar is a Flat, Non-Collapsible Mega-Menu
**Severity:** Critical  
**Why it matters:** As covered in scalability, but from a UX perspective: with 100+ models, the sidebar becomes an overwhelming wall of text. Users cannot scan it. There are no section dividers that collapse, no scroll-to-section, no search-within-sidebar. The cognitive load is high.

**Recommended fix:**
- Add collapsible sections for model categories
- Add a "Jump to..." quick filter in the sidebar
- Or: replace the flat list with a tree view or command palette

**Fix now or later:** Fix now.

---

### 6.2 No Breadcrumbs
**Severity:** Medium  
**Why it matters:** On a model detail page (`/models/ml/random-forest`), there is no breadcrumb trail (Home > Models > ML > Random Forest). Users have no way to navigate up the hierarchy except the browser back button or the sidebar. At 100+ entries, this is a basic navigation expectation.

**Recommended fix:**
- Add a `Breadcrumb` component to detail pages
- Derive crumbs from the route segments and entity names

**Fix now or later:** Fix now. Simple component addition.

---

### 6.3 Mobile Sidebar Uses Checkbox Hack (Not Accessible)
**Severity:** Medium  
**Why it matters:** The mobile sidebar uses `<input type="checkbox" id="sidebar-toggle" className="peer hidden" />` with a `<label>` trigger. This is a CSS hack that:
- Breaks without JavaScript (though the app is mostly static, the toggle relies on CSS `:checked`)
- Is not keyboard accessible
- Has no ARIA attributes (`aria-expanded`, `aria-controls`)
- Fails screen reader expectations

**Recommended fix:**
- Use a proper React state-driven sidebar with `useState` and ARIA attributes
- Or use a `Dialog`/`Sheet` component from shadcn/ui (which is already a dependency)

**Fix now or later:** Fix now.

---

### 6.4 No "Recently Viewed" or Bookmarking
**Severity:** Low  
**Why it matters:** With 100+ entries, users will revisit the same 10–15 items frequently. The app provides no way to track recently viewed pages or bookmark favorites. This is a standard UX feature in knowledge bases.

**Recommended fix:**
- Store recent IDs in `localStorage` and display a "Recent" section in the sidebar or dashboard
- Consider a "Favorites" toggle using `localStorage`

**Fix now or later:** Fix later, when user feedback indicates navigation friction.

---

### 6.5 Registry Table Uses Conditional Column Rendering (`task === 'embedding'`)
**Severity:** Medium  
**Why it matters:** The registry table conditionally renders a "Dimension" column only for the `embedding` task. This is a hardcoded special case. As registry tasks grow, you'll need `task === 'vision' && <th>Resolution</th>`, `task === 'llm' && <th>Context Window</th>`, etc. The table will become a mess of conditional columns. It also breaks table layout consistency across tasks.

**Recommended fix:**
- Define task-specific column schemas in the registry data model
- Or: render a generic properties table with key-value pairs instead of rigid columns

**Fix now or later:** Fix now, before adding more registry tasks with special fields.

---

## 7. Type Safety Gaps

### 7.1 `readJSON` Casts Unvalidated Data with `as T`
**Severity:** High  
**Why it matters:** In `lib/data.ts`, `readJSON<T>` returns `data as T` when no schema is provided. This is a silent `any` escape hatch. The `readIndex` function passes `z.array(z.string())` (good), but any future caller might omit the schema and get a false sense of type safety. Runtime errors will occur at render time, not build time.

**Recommended fix:**
- Make the `schema` parameter **required** in `readJSON`
- Or: remove the `schema` parameter and always require validation
- Ensure every `readJSON` call passes a Zod schema

**Fix now or later:** Fix now. One-line change (make schema required).

---

### 7.2 `getMeta` Returns `Record<string, number>` with No Key Validation
**Severity:** Medium  
**Why it matters:** `getMeta()` reads `meta.json` and validates it as `z.record(z.string(), z.number())`. This accepts any keys. If `meta.json` has a typo like `"model_ml": 5` instead of `"models_ml"`, the dashboard will show `0` with no error. The schema is too permissive.

**Recommended fix:**
- Delete `meta.json` and compute dynamically (see 2.2)
- If keeping it, use a strict Zod schema: `z.object({ packages: z.number(), models_ml: z.number(), ... })`

**Fix now or later:** Fix now.

---

### 7.3 `getRegistryTasks` Returns `string[]` Instead of `RegistryTask[]`
**Severity:** Medium  
**Why it matters:** The return type is `string[]`, but the values are actually `RegistryTask` enum values. Downstream code must cast (`task as RegistryTask`) to pass to `getRegistryByTask`, which is an unnecessary type safety hole.

**Recommended fix:**
- Change return type to `RegistryTask[]` and validate with `z.array(RegistryTaskSchema)`

**Fix now or later:** Fix now. One-line change.

---

### 7.4 Route Params Validated with Manual String Checks Instead of Zod
**Severity:** Medium  
**Why it matters:** `ModelCategoryPage` and `ModelDetailPage` manually check `if (category !== 'ml' && category !== 'dl' && category !== 'llm')`. This duplicates the enum definition in Zod. If the enum changes, these pages break silently. There is no shared route param validator.

**Recommended fix:**
- Create a `RouteParams` schema module with Zod validators for every dynamic route segment
- Use `ModelCategorySchema.safeParse(category)` instead of manual checks
- Apply the same pattern to `RegistryTask`, `WorkflowId`, etc.

**Fix now or later:** Fix now.

---

### 7.5 Broad `catch` Blocks Swallow Real Errors
**Severity:** High  
**Why it matters:** `PackageDetailPage` and `ModelDetailPage` use `try { ... } catch (e) { notFound() }`. This catches **all** errors — not just "file not found", but also Zod validation failures, JSON parse errors, and file permission errors. A malformed JSON file will silently 404 instead of failing the build with a clear error message. At 300+ entries, this will make debugging content issues extremely painful.

**Recommended fix:**
- Distinguish between `ENOENT` (file not found) and other errors
- Let Zod validation errors and JSON parse errors throw during build (they should fail the build)
- Only catch file-not-found specifically, or use `fs.existsSync` before reading

**Fix now or later:** Fix now. This is a correctness issue that hides bugs.

---

### 7.6 No Branded Types for IDs
**Severity:** Low  
**Why it matters:** `id: string` is used everywhere. Nothing prevents passing a `Package` ID to a `Model` lookup function. This is a latent bug that becomes more likely as the codebase grows and more utility functions are added.

**Recommended fix:**
- Use branded types: `type PackageId = string & { __brand: 'PackageId' }`
- Or use nominal typing with a helper factory function

**Fix now or later:** Fix later. Not urgent for a solo project.

---

## 8. Build-Time Performance Concerns

### 8.1 Synchronous `fs.readFileSync` in Async Server Components
**Severity:** Medium  
**Why it matters:** `lib/data.ts` uses `fs.readFileSync` exclusively. Server Components in Next.js are async by design. Using synchronous file I/O blocks the thread. While this is acceptable for small datasets, at 300+ file reads per page render during static generation, it will degrade build performance. The Node.js event loop will be blocked waiting for disk I/O.

**Recommended fix:**
- Switch to `fs.promises.readFile` and make all data functions async
- Next.js Server Components can await async functions; this is fully supported

**Fix now or later:** Fix now. The refactor is mechanical and safe.

---

### 8.2 No Data Loading Memoization
**Severity:** Critical  
**Why it matters:** As noted in 1.2, every data function reads from disk on every call. During static generation, `getAllPackages()` might be called by the layout, the dashboard, and individual package pages. Without caching, the same files are read multiple times. With `React.cache`, subsequent calls return the same reference.

**Recommended fix:**
- Add `import { cache } from 'react'` and wrap all `getAll*` and `get*` functions
- For non-React contexts, use a simple in-memory memoization layer

**Fix now or later:** Fix now.

---

### 8.3 `tsconfig.json` Targets ES2017
**Severity:** Low  
**Why it matters:** The project uses Next.js 15, React 19, and modern features. `target: "ES2017"` is unnecessarily conservative. It won't affect functionality, but it bloats the output with transpiled polyfills for features that are natively supported in all modern browsers. Next.js handles browser targeting via its own Babel config, but the TypeScript target still affects type checking and `tsc` output.

**Recommended fix:**
- Change to `"ES2022"` or `"ESNext"` to match the Next.js 15 baseline

**Fix now or later:** Fix later. Low impact.

---

### 8.4 `tsconfig.tsbuildinfo` is 130KB and Growing
**Severity:** Low  
**Why it matters:** The incremental build info file is already large for a small project. This is a symptom of `incremental: true` in `tsconfig.json` with many generated types (`.next/types/`). It's not a problem yet, but indicates that the type surface area is larger than expected.

**Recommended fix:**
- Add `tsconfig.tsbuildinfo` to `.gitignore` if not already present
- Verify `include` array doesn't pull in unnecessary files

**Fix now or later:** Fix now. Add to `.gitignore`.

---

## 9. Missing Features That Will Become Painful After 100+ Entries

### 9.1 Global Search (Already Covered)
**Severity:** Critical  
**Fix now.** See Section 3.1.

---

### 9.2 Auto-Generated Indices and Meta
**Severity:** Critical  
**Fix now.** See Section 2.1 and 2.2.

---

### 9.3 Cross-Entity Tagging and Relationships
**Severity:** High  
**Why it matters:** Users will want to find "all things related to PyTorch" — packages, models that use it, cheatsheets, workflows. Currently, each entity is an island. With 100+ entries, this siloing makes the knowledge base feel disconnected.

**Recommended fix:**
- Add a `tags: string[]` field to all entity types
- Generate a tag index at build time
- Add tag pages (`/tags/pytorch`) that aggregate across entity types

**Fix now or later:** Fix later. But reserve the schema field now.

---

### 9.4 Comparison Views
**Severity:** Medium  
**Why it matters:** Users will want to compare two models side-by-side, or two registry embeddings, or two packages. The current architecture only supports single-entity detail pages.

**Recommended fix:**
- Add a `/compare` route that accepts query params (e.g., `?type=model&ids=random-forest,xgboost`)
- Render a split-pane comparison table

**Fix now or later:** Fix later. Not urgent until users request it.

---

### 9.5 Content Versioning / Changelog
**Severity:** Medium  
**Why it matters:** With 100+ entries maintained by potentially multiple contributors (or the same author over 3 years), tracking what changed and when is important. `updated_at` exists but doesn't tell you *what* changed. A model's hyperparameters or a package's version might change, and there's no audit trail.

**Recommended fix:**
- Store JSON data in a Git repository (already done) — the commit history is the changelog
- Add a script that generates a changelog page from Git history (`git log -- data/models/ml/random-forest.json`)
- Or add a `changelog: { date: string; note: string }[]` field to schemas

**Fix now or later:** Fix later. Git history is sufficient for now.

---

### 9.6 No Error Boundaries or 404 Page
**Severity:** Medium  
**Why it matters:** With 300+ pages and manual indices, 404s will happen. There is no `not-found.tsx` in the app root, and no `error.tsx` to catch rendering failures. A single malformed JSON can crash an entire page with no graceful fallback.

**Recommended fix:**
- Add `app/not-found.tsx` with a styled 404 message and navigation links
- Add `app/error.tsx` to catch unexpected errors and show a recovery UI
- Add `app/[...entity]/error.tsx` for entity-specific error handling

**Fix now or later:** Fix now. Simple and important.

---

### 9.7 No Content Preview / Draft Mode
**Severity:** Low  
**Why it matters:** As the content grows, authors will want to preview changes before committing. With static JSON files, the only way to preview is to run the dev server. There is no "draft" or "unpublished" state.

**Recommended fix:**
- Add a `published: boolean` field to `BaseMetaSchema`
- Filter unpublished entries from production builds but show them in dev
- Or use `process.env.NODE_ENV` to control visibility

**Fix now or later:** Fix later. Not critical for a solo project.

---

## 10. Technical Debt That Should Be Fixed Now Rather Than Later

### 10.1 Auto-Generate `_index.json` and `meta.json`
**Priority:** Highest  
**Effort:** Low  
**Why now:** The longer you wait, the more manual entries you have to migrate. The fix is a 20-line script. Run it once, add it to `npm run build`, and never think about indices again.

---

### 10.2 Add `React.cache` to `lib/data.ts`
**Priority:** Highest  
**Effort:** Low  
**Why now:** This is a single import and a few `cache()` wrappers. It eliminates redundant disk I/O immediately and makes the app ready for scale.

---

### 10.3 Implement `lib/search.ts` with Build-Time Index Generation
**Priority:** High  
**Effort:** Medium  
**Why now:** At 15 entries, the search index is tiny and easy to test. At 200 entries, you won't know if the indexing logic is correct until it's too late to redesign. Also, the `PROJECT_RULES.md` explicitly references this file as Phase 4 — it's part of the approved architecture that hasn't been built.

---

### 10.4 Refactor Error Handling in Detail Pages
**Priority:** High  
**Effort:** Low  
**Why now:** Broad `catch` blocks are hiding bugs today. Making them specific will surface content issues immediately, while the dataset is small and easy to audit.

---

### 10.5 Add Route Param Validation with Zod
**Priority:** Medium  
**Effort:** Low  
**Why now:** Duplicated string checks in every dynamic route are brittle. Centralizing them in a `route-params.ts` module makes the codebase more maintainable and prevents silent breaks when enums change.

---

### 10.6 Fix Mobile Sidebar Accessibility
**Priority:** Medium  
**Effort:** Low  
**Why now:** The checkbox hack is a small amount of technical debt that will accumulate CSS workarounds. Replacing it with a proper shadcn/ui `Sheet` component is a one-time fix that solves accessibility and mobile UX permanently.

---

### 10.7 Add a `npm run validate` Build Script
**Priority:** Medium  
**Effort:** Low  
**Why now:** Catching malformed JSON at build time prevents broken pages from being deployed. With only ~15 entries, you can validate the entire dataset in milliseconds. This script will pay dividends as the dataset grows.

---

## Appendix: Risk Heat Map

| Issue | Severity | Effort | Fix Now? |
|-------|----------|--------|----------|
| Sidebar DOM explosion | Critical | Low | ✅ Yes |
| Layout data loading (no cache) | Critical | Low | ✅ Yes |
| Missing search | Critical | Medium | ✅ Yes |
| Manual `_index.json` | Critical | Low | ✅ Yes |
| Manual `meta.json` | High | Low | ✅ Yes |
| Alternatives brute-force scan | High | Low | ✅ Yes |
| No referential integrity | High | Medium | ✅ Yes |
| Broad catch blocks | High | Low | ✅ Yes |
| Empty `next.config.ts` | High | Low | ✅ Yes |
| Registry conditional columns | Medium | Low | ✅ Yes |
| Date string modeling | Medium | Low | ✅ Yes |
| No error/404 pages | Medium | Low | ✅ Yes |
| No build validation script | Medium | Low | ✅ Yes |
| Mobile sidebar checkbox hack | Medium | Low | ✅ Yes |
| Synchronous fs reads | Medium | Low | ✅ Yes |
| No pagination/virtualization | High | Medium | ⏳ Later |
| No cross-entity tags | High | Medium | ⏳ Later |
| No comparison views | Medium | High | ⏳ Later |
| No breadcrumbs | Medium | Low | ⏳ Later |
| No branded types | Low | Low | ⏳ Later |
| ES2017 target | Low | Low | ⏳ Later |

---

*End of review.*
