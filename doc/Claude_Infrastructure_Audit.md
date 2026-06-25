# Infrastructure Hardening Audit
## AI Engineering Handbook — Pre-Scale Hardening Pass
**Audit Date:** 2026-06-25
**Codebase State:** ~44 JSON content files, transitioning to large-scale content generation
**Auditor:** Senior Staff Engineer review pass

---

## How to Use This Document

Each finding below has:
- **Severity** — Critical / High / Medium / Low
- **Current state** — exactly what exists right now
- **Required state** — exactly what must change
- **Prompt label** — the prompt ID to fix it (H1, H2, etc.)

Execute prompts in order. Run `npm run validate` after every prompt.

---

## PART 1 — METADATA AUDIT

### Finding M1 — `official_docs` and `research_paper` exist in schema but must be removed
**Severity: High**

**Current state:**
- `types/meta.ts` — `BaseMeta` contains `official_docs?: string` and `research_paper?: string`
- `lib/schemas/meta.ts` — `BaseMetaSchema` contains `official_docs: z.string().url().optional()` and `research_paper: z.string().url().optional()`
- JSON content files — most do NOT have these fields yet (only a few have them)
- `OfficialResources.tsx` derives documentation/papers/model cards from `sources[]` via `categorizeSources()`

**Required state:**
- Remove `official_docs` and `research_paper` from `BaseMeta` and `BaseMetaSchema`
- All reference links (docs, papers, model cards) go into `sources[]`
- `github_repo` remains as the only optional external link field
- `OfficialResources.tsx` already handles this correctly via `categorizeSources()` — no change needed there
- Update `content_guidelines.md` to clarify that `sources[]` must contain all external links

**Why:** The `sources[]` array combined with `categorizeSources()` in `lib/resources.ts` already categorizes URLs into documentation, papers, model cards, and external references. Having separate `official_docs` and `research_paper` fields duplicates this and creates two sources of truth. The `OfficialResources` component renders from `sources[]`, not from these fields — making them dead schema weight.

**Fix prompt:** H1

---

### Finding M2 — `github_repo` is inconsistently present across JSON files
**Severity: Medium**

**Current state:**
- `random-forest.json` — has `github_repo` at root level ✓
- `llama3.json` — has `github_repo` at root level ✓
- `transformer.json` — has `github_repo` at root level ✓
- `xgboost.json`, `lightgbm.json`, and all placeholder files — missing `github_repo`
- `types/meta.ts` — `github_repo?: string` is defined as optional ✓
- `lib/schemas/meta.ts` — `github_repo: z.string().url().optional()` ✓

**Required state:**
- `github_repo` remains optional — no schema change needed
- Content files that have a real GitHub repository should include it
- Placeholder files will have it added during content generation
- Validation should warn (not fail) when a model/package has no `github_repo`

**Why:** This is a content completeness issue, not a schema issue. No code change needed — document it as a content generation requirement.

**Fix prompt:** None needed (content generation prompts already include `github_repo`)

---

### Finding M3 — `sources` field accepts non-URL strings but `official_docs` schema requires `.url()`
**Severity: Low**

**Current state:**
- `lib/schemas/meta.ts` — `sources: z.array(z.string()).min(1)` — accepts any string ✓
- JSON files — `sources` contains valid URLs ✓
- After removing `official_docs` and `research_paper` in H1, `sources[]` becomes the sole external link field

**Required state:**
- Keep `sources` as `z.array(z.string()).min(1)` — no change
- `content_guidelines.md` should clarify that sources can include non-URL strings (paper titles, personal notes)

**Fix prompt:** None (already correct after H1)

---

## PART 2 — CONTENTREF AUDIT

### Finding C1 — ContentRef `type` field does not include `'registry'`
**Severity: High**

**Current state:**
- `types/meta.ts` — `ContentRef.type` is `'model' | 'package' | 'workflow' | 'cheatsheet'`
- `lib/schemas/meta.ts` — `ContentRefSchema.type` is `z.enum(['model', 'package', 'workflow', 'cheatsheet'])`
- Registry models reference each other in `alternatives` (e.g. `bge-large-en-v1.5` references `text-embedding-3-large`)
- `text-embedding-3-large` is in `data/models/llm/` — typed as `'model'` ✓
- BUT `bge-large-en-v1.5` is in `data/registry/` — there is no `'registry'` type
- `getContentPath()` in `lib/data.ts` handles types: `'package' | 'model' | 'workflow' | 'cheatsheet'` — no registry handling

**Required state:**
- Add `'registry'` to `ContentRef.type` enum in `types/meta.ts`
- Add `'registry'` to `ContentRefSchema` in `lib/schemas/meta.ts`
- Update `getContentPath()` in `lib/data.ts` to resolve registry references: `/registry/${task}` — but registry is grouped by task, not by model id, so this requires scanning task files
- Update `getContentName()` in `lib/data.ts` to resolve registry model names
- Update `validate-content.ts` to check registry targets

**Fix prompt:** H2

---

### Finding C2 — Broken ContentRef targets due to placeholder files
**Severity: High**

**Current state:**
- `llama3.json` alternatives: `[{"id":"mistral-7b","type":"model"}, {"id":"gemma-2","type":"model"}, {"id":"qwen-2","type":"model"}]`
- `data/models/llm/mistral-7b.json` EXISTS but is a placeholder with `"Placeholder model for Mistral-7B"` in summary
- `data/registry/rerankers.json` alternatives: `[{"id":"cohere-reranker-v3","type":"model"}]`
- `data/models/llm/cohere-reranker-v3.json` EXISTS (placeholder)
- `validate-content.ts` WARNS about these but does not fail in non-strict mode

**Required state:**
- These references are technically valid (files exist) — the problem is content quality, not structural integrity
- After content generation (Prompts C1-C9), these will resolve to real content
- `STRICT_REFERENCE_MODE=true` should be set in the validate script after content generation completes

**Fix prompt:** None immediately — resolved by content generation. Set `STRICT_REFERENCE_MODE=true` after all content is generated.

---

### Finding C3 — ContentRef in registry `alternatives` mixes registry models and llm model folder entries
**Severity: Medium**

**Current state:**
- `data/registry/embeddings.json` — alternatives: `[{"id":"text-embedding-3-large","type":"model"}, {"id":"gte-large","type":"model"}]`
- `text-embedding-3-large` is in `data/models/llm/` → resolves as a model ✓
- `gte-large` is in `data/models/llm/` → resolves as a model ✓
- BUT `BAAI/bge-large-en-v1.5` (registry) cannot reference another registry entry without `type:'registry'`

**Required state:**
- Fixed by H2 (adding `'registry'` to ContentRef type)

**Fix prompt:** H2 (covers this)

---

## PART 3 — VALIDATION HARDENING

### Finding V1 — Missing slug validation in `validate-content.ts`
**Severity: High**

**Current state:**
- `scripts/validate-content.ts` validates: JSON parsing, schema compliance, ContentRef integrity
- Does NOT validate: ID slug format (`^[a-z0-9-]+$`)
- Does NOT validate: `filename === id` match
- Allows IDs like `RandomForest`, `random_forest`, `bge-large-en-v1.5` (this last one IS valid)

**Required state:**
- Add slug regex validation: every `id` field must match `^[a-z0-9][a-z0-9-]*[a-z0-9]$` or single char `^[a-z0-9]$`
- Add filename match: `path.basename(file, '.json') === data.id`
- Fail build (exit 1) on violation

**Fix prompt:** H3

---

### Finding V2 — Missing placeholder detection
**Severity: Critical**

**Current state:**
- `xgboost.json` summary: `"Placeholder model for XGBoost."` — this would PASS current validation
- `cupy.json` summary: `"Placeholder package for cupy."` — passes
- `lightgbm.json` summary: `"Placeholder model for LightGBM."` — passes
- `validate-content.ts` has NO check for placeholder text

**Required state:**
- Add placeholder detection that fails validation if these strings appear in content fields:
  `"Placeholder"`, `"placeholder"`, `"TODO"`, `"TBD"`, `"Coming soon"`, `"# Instantiate model here"`
- Check in: `summary`, `overview`, `notes`, `pros[]`, `cons[]`, `quick_start`
- Fail build on detection

**Fix prompt:** H3

---

### Finding V3 — Missing minimum content quality thresholds
**Severity: High**

**Current state:**
- `xgboost.json` has `pros: ["Well established architecture"]` — 1 item
- `lightgbm.json` has `cons: ["Requires modern hardware"]` — 1 item
- `numpy.json` has 1 section, `pandas.json` has 1 section
- `rag.json` has 1 step
- No minimum count validation exists

**Required state:**
- Models: `pros.length >= 3`, `cons.length >= 3`, `key_hyperparams.length >= 2` (except for models where hyperparams don't apply)
- Packages: `sections.length >= 2`, each section `functions.length >= 2`
- Workflows: `steps.length >= 3`
- Cheatsheets: `groups.length >= 1`, each group `items.length >= 3`

**Fix prompt:** H3

---

## PART 4 — DUPLICATE DETECTION

### Finding D1 — No cross-section duplicate ID detection
**Severity: High**

**Current state:**
- `validate-content.ts` does not track IDs seen across the entire dataset
- A `model/random-forest` and `package/random-forest` could coexist silently
- No check for duplicate IDs within the same section either

**Required state:**
- Build a global ID registry during validation
- Track as `type:id` pairs (e.g. `model:random-forest`)
- Fail if same type+id appears twice
- Warn (not fail) if same id appears across different types

**Fix prompt:** H3

---

### Finding D2 — No duplicate name detection (case-insensitive)
**Severity: Medium**

**Current state:**
- `llama3.json` name: `"Llama 3"` and `llama-3-8b.json` name: `"Llama 3 8B"` — different, fine
- But `"Transformer"` and `"transformer"` would both pass
- No case-insensitive name deduplication exists

**Required state:**
- Track all `name` values lowercase during validation
- Fail if exact case-insensitive match found (same type, same name)

**Fix prompt:** H3

---

### Finding D3 — No registry `model_id` duplicate detection
**Severity: High**

**Current state:**
- `data/registry/embeddings.json` — one entry with `model_id: "BAAI/bge-large-en-v1.5"` ✓
- `data/registry/llms.json` — one entry with `model_id: "mistralai/Mistral-7B-v0.1"`
- As registry grows to 50+ entries across 7 files, same `model_id` could appear in different task files
- No cross-file `model_id` uniqueness check exists

**Required state:**
- During validation, collect all `model_id` values from all registry files
- Fail if the same `model_id` appears more than once across all registry task files

**Fix prompt:** H3

---

## PART 5 — SEARCH AUDIT

### Finding S1 — Registry models not indexed in search
**Severity: High**

**Current state:**
- `lib/search.ts` indexes: packages, models (ml/dl/llm), workflows, cheatsheets
- Registry models (`data/registry/*.json`) are NOT indexed
- A user searching for `"bge-large-en-v1.5"` or `"embedding model"` gets no results

**Required state:**
- Add registry models to `buildSearchIndex()`
- Each registry entry: `type: 'registry'`, `id`, `name` (from `model_id`), `summary` (from `use_case`), `href: /registry/${task}`, `updated_at`, `category: task`
- Update `SearchResult` type to include `'registry'` as a valid type

**Fix prompt:** H4

---

### Finding S2 — Cheatsheet search summary is synthetic and useless
**Severity: Medium**

**Current state:**
```typescript
results.push({
  type: 'cheatsheet',
  summary: `${cs.name} syntax reference.`,  // fake summary
  ...
});
```
- `"PyTorch syntax reference."` tells a user nothing about what's inside
- Cheatsheet has no `summary` field in the schema

**Required state:**
- Generate a meaningful summary from cheatsheet content: join the group names
- Example: `"Groups: Tensor Creation, Tensor Operations, Autograd, Neural Network, Optimizers"`
- Or concatenate first 3-4 group names + item count

**Fix prompt:** H4

---

### Finding S3 — Fuse.js `threshold: 0.3` is too permissive for short queries
**Severity: Low**

**Current state:**
- `threshold: 0.3` means 30% fuzzy tolerance
- Searching for `"rf"` could match `"Random Forest"` and dozens of other things
- No minimum query length enforced

**Required state:**
- Lower threshold to `0.25` for tighter matching
- Add `minMatchCharLength: 2` to Fuse options
- Keep `includeScore: true` to allow UI to show relevance

**Fix prompt:** H4

---

## PART 6 — RECENT UPDATES AUDIT

### Finding R1 — Registry models excluded from recent content
**Severity: Medium**

**Current state:**
- `getRecentContent()` covers: packages, models (ml/dl/llm), workflows, cheatsheets
- Registry files are arrays of models — not individual items with their own `updated_at`
- Registry entries DO have `updated_at` at the individual model level

**Required state:**
- Add registry models to `getRecentContent()`
- Iterate all registry tasks, read each file, iterate each model entry, push with `type: 'registry'`
- `href` for registry entries: `/registry/${entry.task}` (links to the task page, not individual model)
- Use `entry.updated_at` for sorting

**Fix prompt:** H5

---

### Finding R2 — `getRecentContent()` has broad `try/catch` that silently skips entries
**Severity: Medium**

**Current state:**
```typescript
try {
  const p = getPackage(id);
  items.push(...);
} catch {
  // ignore  ← silently drops entries
}
```
- A malformed JSON file causes its entry to disappear from the dashboard silently
- No indication to the developer that an entry was skipped

**Required state:**
- Replace empty catch with `console.warn` logging:
  `console.warn('[getRecentContent] Failed to load ${type}/${id}:', e);`
- Do not throw — recent content is non-critical and should degrade gracefully
- But at least surface the error during dev/build

**Fix prompt:** H5

---

## PART 7 — UI/UX AUDIT

### Finding U1 — Sidebar is a flat non-collapsible list — will break at 100+ entries
**Severity: Critical**

**Current state:**
- `components/layout/Sidebar.tsx` renders all ML models, DL models, LLM models, packages, workflows, cheatsheets as flat `<Link>` lists
- At current 44 files: ~35 links in sidebar
- At 300+ entries: 200+ links, no grouping, no collapse, no scroll affordance
- No visual distinction between active section and inactive sections

**Required state:**
- Add collapsible accordion sections for each category
- Default state: collapsed for all sections except the one matching current route
- Use `useState` for collapse state (client component)
- Show item count badge next to each section header: `ML Models (7)`
- Keep total DOM nodes under 50 regardless of content count

**Fix prompt:** H6

---

### Finding U2 — Sidebar cheatsheet links display raw IDs instead of names
**Severity: Low**

**Current state:**
```tsx
{cheatsheets.map((csId) => (
  <Link href={`/cheatsheets/${csId}`}>{csId}</Link>  // renders "pytorch", "sklearn"
))}
```
- Displays `pytorch` instead of `PyTorch`, `sklearn` instead of `Scikit-learn`
- `getAllCheatsheetIds()` returns `string[]`, not `NavItem[]`

**Required state:**
- Add `getCheatsheetNavItems(): NavItem[]` to `lib/data.ts`
- Use it in `layout.tsx` instead of `getAllCheatsheetIds()`
- Update `Sidebar.tsx` to accept and render `NavItem[]` for cheatsheets

**Fix prompt:** H6 (include in sidebar overhaul)

---

### Finding U3 — Registry sidebar displays `"embeddings"` (task + 's') instead of proper label
**Severity: Low**

**Current state:**
```tsx
{registryTasks.map((task) => (
  <Link href={`/registry/${task}`}>{task}s</Link>  // renders "embeddings", "llms"
))}
```
- `task` is `"embedding"` → displays as `"embeddings"` (appends 's')
- `"llm"` → `"llms"` — looks bad
- `"ocr"` → `"ocrs"` — incorrect

**Required state:**
- Define a display label map for registry tasks
- `embedding → Embeddings`, `reranker → Rerankers`, `vision → Vision`, `speech → Speech`, `llm → LLMs`, `multimodal → Multimodal`, `ocr → OCR`

**Fix prompt:** H6

---

### Finding U4 — `app/not-found.tsx` does not exist
**Severity: High**

**Current state:**
- No `app/not-found.tsx`
- No `app/error.tsx`
- A 404 shows Next.js default error page with no navigation back

**Required state:**
- `app/not-found.tsx` — styled, shows clear message, links to dashboard and all sections
- `app/error.tsx` — client component, shows error.message, reset button, link to dashboard

**Fix prompt:** H7

---

### Finding U5 — `MobileSidebarTrigger.tsx` existence unconfirmed — check and verify
**Severity: Medium**

**Current state:**
- `TopBar.tsx` imports `MobileSidebarTrigger` from `./MobileSidebarTrigger`
- File listing shows the import exists
- Cannot confirm if it uses proper `Sheet` from shadcn or checkbox hack

**Required state:**
- Must use shadcn `Sheet` component (not checkbox/CSS hack)
- Must have `aria-label` on trigger button
- Sheet content must receive nav data as props (not re-fetch)

**Fix prompt:** H7 (verify and fix if needed)

---

### Finding U6 — `eslint.ignoreDuringBuilds` not set — `next.config.ts` incomplete
**Severity: Medium**

**Current state:**
```typescript
const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: false },
  // eslint missing
};
```
- ESLint errors during build are not configured to fail
- TypeScript errors ARE configured to fail ✓

**Required state:**
```typescript
eslint: { ignoreDuringBuilds: false }
```
- ESLint errors should also fail the build

**Fix prompt:** H8

---

## PART 8 — ADDITIONAL FINDINGS

### Finding A1 — `PROJECT_RULES.md` is out of date
**Severity: Medium**

**Current state:**
- `doc/PROJECT_RULES.md` still references old architecture:
  - `_index.json` files (removed — now auto-discovered)
  - `meta.json` (removed — now computed dynamically)
  - Old type definitions that don't match current types
  - Missing mention of `lib/schemas/`, `lib/route-params.ts`, `lib/search.ts`, `lib/resources.ts`

**Required state:**
- Update folder structure section
- Remove all `_index.json` and `meta.json` references
- Add new lib files to the explanation
- Update "Current task" placeholder to reflect actual project state

**Fix prompt:** H8

---

### Finding A2 — `scripts/validate-content.ts` has a stray closing brace syntax error
**Severity: Critical**

**Current state:**
- Last 3 lines of `scripts/validate-content.ts`:
```typescript
console.log('✅ All content files validated successfully!');
process.exit(0);
}   ← this closing brace is orphaned — syntax error
```
- The file has an orphaned `}` at the end that makes it syntactically invalid
- `npm run validate` will fail immediately with a parse error

**Required state:**
- Remove the orphaned `}` on the last line
- The `console.log` and `process.exit(0)` are also duplicated (appear before and after the `if (hasErrors)` block)
- Clean up to single exit path

**Fix prompt:** H3 (fix during validation hardening rewrite)

---

## Prompt Execution Order

```
H1  → Remove official_docs and research_paper from schema
H2  → Add 'registry' to ContentRef type
H3  → Rewrite validate-content.ts with all missing checks
H4  → Fix search index (add registry, fix cheatsheet summary, tune Fuse)
H5  → Fix getRecentContent (add registry, fix silent errors)
H6  → Overhaul Sidebar (collapsible, nav items, display labels)
H7  → Add not-found.tsx, error.tsx, verify MobileSidebarTrigger
H8  → Fix next.config.ts, update PROJECT_RULES.md

After H8: Run npm run validate
After H8: Run npm run build
After build passes: Proceed to content generation
```

---

## Issues Summary Table

| ID | Finding | Severity | Prompt |
|----|---------|----------|--------|
| M1 | Remove official_docs/research_paper from schema | High | H1 |
| M2 | github_repo inconsistency across files | Medium | Content gen |
| C1 | ContentRef missing 'registry' type | High | H2 |
| C2 | Broken refs due to placeholder files | High | Content gen |
| C3 | Registry alternatives cross-type confusion | Medium | H2 |
| V1 | Missing slug + filename validation | High | H3 |
| V2 | No placeholder text detection | Critical | H3 |
| V3 | No minimum content quality thresholds | High | H3 |
| D1 | No cross-section duplicate ID detection | High | H3 |
| D2 | No case-insensitive duplicate name detection | Medium | H3 |
| D3 | No registry model_id deduplication | High | H3 |
| A2 | validate-content.ts has orphaned brace syntax error | Critical | H3 |
| S1 | Registry models not indexed in search | High | H4 |
| S2 | Cheatsheet summary is fake/useless | Medium | H4 |
| S3 | Fuse.js threshold too permissive | Low | H4 |
| R1 | Registry excluded from recent content | Medium | H5 |
| R2 | Silent error swallowing in getRecentContent | Medium | H5 |
| U1 | Sidebar flat list will break at 100+ entries | Critical | H6 |
| U2 | Cheatsheet sidebar shows raw IDs | Low | H6 |
| U3 | Registry sidebar appends 's' to task names | Low | H6 |
| U4 | No not-found.tsx or error.tsx | High | H7 |
| U5 | MobileSidebarTrigger needs verification | Medium | H7 |
| U6 | eslint.ignoreDuringBuilds not set | Medium | H8 |
| A1 | PROJECT_RULES.md is out of date | Medium | H8 |
