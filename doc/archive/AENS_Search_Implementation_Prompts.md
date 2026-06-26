# AENS V2 Search — Windsurf Implementation Prompts

Each phase is a self-contained Windsurf prompt. Run them in order.
Each phase compiles, passes validation, and is independently deployable before the next begins.

---

## Phase 1 — Deep Field Indexing

### Goal
Index every nested knowledge field that exists today in the JSON schemas. No new files, no engine changes. This is purely additive to `lib/search.ts` and `lib/search-types.ts`.

### What this fixes
- `np.linalg.inv` — syntax field now fully indexed
- `CUDA out of memory` — gotchas and common_bug now indexed
- `small dataset` — mental_trigger and use_when now indexed
- `optimizer` (partially) — problem_types and summary now indexed

---

```
You are working on the AENS project at D:\Project\ai-engineering-handbook.

## Context

The project is a Next.js 16 + TypeScript knowledge system. Search is handled by:
- `lib/search-types.ts` — defines SearchResult type and createFuse()
- `lib/search.ts` — builds the flat search index using React cache()
- `components/shared/SearchBox.tsx` — the UI (do NOT touch this file)

The current index only captures top-level page fields. Nested knowledge fields — task mental_trigger, syntax, gotchas, cheatsheet entry triggers, model hyperparams — are not indexed at all.

## Your task

Extend the search index depth. All changes stay in `lib/search-types.ts` and `lib/search.ts` only.

### Step 1 — Update SearchResult in `lib/search-types.ts`

Add these optional fields to the existing SearchResult type:

```ts
mental_trigger?: string;
code_context?: string;   // raw syntax or snippet text
keywords?: string;       // space-separated derived keywords
parent_name?: string;    // for task/entry results: which package or cheatsheet they belong to
```

Update the Fuse keys in createFuse() to include the new fields with these weights:
- name: 0.35
- mental_trigger: 0.25
- code_context: 0.15
- summary: 0.12
- keywords: 0.08
- fn_signature: 0.03
- id: 0.02

Keep the same threshold (0.25) and other Fuse options unchanged.

### Step 2 — Extend the package task indexer in `lib/search.ts`

The current task indexer creates one entry per task using only `task.task` and `task.mental_trigger || task.syntax`.

Replace it with a richer entry that populates every new field:

- `name`: task.task (unchanged)
- `summary`: task.mental_trigger (unchanged)  
- `mental_trigger`: task.mental_trigger
- `code_context`: task.syntax (the full multi-line syntax string)
- `keywords`: a single string built by joining with spaces:
    - task.use_when
    - task.avoid_when
    - task.decision_notes
    - task.gotchas.join(' ')
    - task.important_params.join(' ')
- `parent_name`: the parent package name (e.g. "NumPy")
- `fn_signature`: task.task (keep for backward compat)
- `fn_package_id`: pkg.id (keep for backward compat)
- `category`: pkg.name (keep for backward compat)

The href anchor should be generated from task.task lowercased, spaces replaced with hyphens, non-alphanumeric chars removed. Keep this logic identical to what exists today.

### Step 3 — Extend the cheatsheet indexer in `lib/search.ts`

Currently, cheatsheets are indexed as a single page-level entry with 4 problem strings as a summary.

Replace this with TWO types of entries per cheatsheet:

1. Keep the existing page-level entry exactly as is (one entry per cheatsheet file).

2. Add individual entry-level documents — one per cheatsheet entry in cs.entries[]:
   - `type`: 'function' (reuse this type since it supports parent display in the UI)
   - `id`: `${cs.id}::${slugify(entry.problem)}` where slugify = lowercase, spaces→hyphens, strip non-alphanumeric
   - `name`: entry.problem
   - `summary`: entry.trigger
   - `mental_trigger`: entry.trigger
   - `code_context`: entry.snippet
   - `keywords`: entry.minimal_notes + ' ' + entry.common_bug
   - `parent_name`: cs.name
   - `category`: cs.name
   - `href`: `/cheatsheets/${cs.id}` (no anchor needed, page will scroll)
   - `fn_signature`: entry.problem
   - `fn_package_id`: cs.id
   - `updated_at`: cs.updated_at

### Step 4 — Extend the model indexer in `lib/search.ts`

Enrich each model entry with:
- `keywords`: a single string joining:
    - m.use_when
    - m.avoid_when
    - m.pros.join(' ')
    - m.cons.join(' ')
    - m.key_hyperparams.map(h => h.name).join(' ')
    - m.problem_types.join(' ')
    - (m.decision_notes ?? '')

Keep all other model fields unchanged.

### Step 5 — Extend the workflow indexer in `lib/search.ts`

Enrich each workflow entry with:
- `keywords`: a single string joining:
    - w.overview
    - w.starter_stack.join(' ')
    - w.steps.map(s => s.name).join(' ')
    - w.steps.flatMap(s => s.tools).join(' ')
    - w.steps.map(s => s.what).join(' ')
    - w.steps.flatMap(s => s.failure_points).join(' ')

Keep all other workflow fields unchanged.

## Constraints

- Do NOT modify SearchBox.tsx or any component file
- Do NOT add any new npm packages
- Do NOT change the SearchResult.type enum values
- All new fields are optional — existing code that reads SearchResult will continue to work
- The index should still build with React cache() as today
- Run `npm run validate` mentally — the schema files are unchanged so validation will pass
- After your changes, the dev-mode console.log will show a larger index size. That is expected.

## Verification

After implementing, confirm these logical checks pass:
1. A search for "mental_trigger" text like "I need matrix multiply" would match the NumPy linear algebra task
2. A search for "zero_grad" would match the PyTorch cheatsheet training loop entry
3. A search for "n_estimators" would match the XGBoost model
4. The existing page-level cheatsheet entry for "pytorch" still exists alongside the new entry-level entries
```

---

## Phase 2 — Tokenizer and Config File

### Goal
Add a code tokenizer that breaks dot-notation, CamelCase, and abbreviations into searchable tokens. Add a config file for field weights. No change to the search engine yet — the tokenizer output feeds into the existing index fields.

---

```
You are working on the AENS project at D:\Project\ai-engineering-handbook.

## Context

Phase 1 has been completed. The search index now includes mental_trigger, code_context, and keywords fields. The system still uses Fuse.js exclusively.

In this phase you will:
1. Create `lib/search/tokenizer.ts` — a pure utility with no dependencies
2. Create `data/search/search.config.json` — field weights as editable config
3. Apply tokenizer output to enrich `code_context` fields in `lib/search.ts`

## File 1 — Create `lib/search/tokenizer.ts`

This is a pure TypeScript module with no imports except built-in types.

Export one function:

```ts
export function tokenizeCodeField(input: string): string
```

This function takes a raw string (a syntax block, task name, or snippet) and returns a space-separated string of all derived tokens that should be searchable.

### Tokenization rules (apply in order, collect all tokens):

**Rule 1 — Dot split**
Split on `.` to get namespace segments.
`"np.linalg.inv"` → `["np", "linalg", "inv"]`

**Rule 2 — Prefix segments**
For each dot-separated symbol, also include all prefix joins:
`"np.linalg.inv"` → also add `"np.linalg"`, `"np.linalg.inv"`

**Rule 3 — Package alias expansion**
Replace known short aliases with their full package names. Use this hardcoded map:
```
np → numpy
torch → pytorch
pd → pandas
sk → sklearn
tf → tensorflow
jnp → jax
cp → cupy
```
If a token matches a key, add the expanded value as an additional token.

**Rule 4 — CamelCase split**
For tokens that contain uppercase letters (e.g., `CrossEntropyLoss`, `DataLoader`),
split at uppercase boundaries:
`"CrossEntropyLoss"` → `["Cross", "Entropy", "Loss"]` → lowercased → `["cross", "entropy", "loss"]`

**Rule 5 — Snake/underscore split**
Split tokens on `_` and `-`:
`"learning_rate"` → `["learning", "rate"]`
`"max-depth"` → `["max", "depth"]`

**Rule 6 — Abbreviation expansion**
Expand known abbreviations. Use this hardcoded map:
```
inv → inverse
svd → singular value decomposition
pca → principal component analysis
fft → fast fourier transform
relu → rectified linear unit
lr → learning rate
oom → out of memory
ce → cross entropy
kl → kullback leibler
mse → mean squared error
mae → mean absolute error
gd → gradient descent
sgd → stochastic gradient descent
bn → batch normalization
ln → layer normalization
mha → multi head attention
mlp → multi layer perceptron
```
If a token matches a key, add the expansion as a string (not split further).

**Rule 7 — Collect and deduplicate**
Combine all original tokens and derived tokens. Lowercase everything. Remove empty strings and tokens shorter than 2 characters. Deduplicate. Return as space-separated string.

### Example

Input: `"np.linalg.inv\nnp.linalg.solve(A, b)\nnp.linalg.svd(A)"`

Expected output tokens (order doesn't matter):
`np numpy linalg inv inverse np.linalg np.linalg.inv solve np.linalg.solve svd singular value decomposition np.linalg.svd`

Do NOT parse function call syntax — just treat parentheses and commas as token boundaries (include them in Rule 5 splitting logic: also split on `(`, `)`, `,`, `\n`, space).

## File 2 — Create `data/search/search.config.json`

```json
{
  "_comment": "Field weights for AENS search ranking. Higher = more important. Edit here, not in engine code.",
  "field_weights": {
    "aliases": 100,
    "code_tokens": 95,
    "name": 90,
    "concept_groups": 80,
    "mental_trigger": 75,
    "keywords": 70,
    "title": 65,
    "use_when": 55,
    "summary": 40,
    "code_context": 30,
    "gotchas": 20
  },
  "fuse_options": {
    "threshold": 0.25,
    "min_match_char_length": 2
  }
}
```

## File 3 — Update `lib/search.ts` to apply tokenizer

Import the new tokenizer at the top:
```ts
import { tokenizeCodeField } from './search/tokenizer';
```

In the package task indexer, update the `code_context` field:
```ts
code_context: tokenizeCodeField(task.syntax),
```

In the cheatsheet entry indexer, update the `code_context` field:
```ts
code_context: tokenizeCodeField(entry.snippet),
```

For cheatsheet entries, also enrich the `name` field with tokenized output appended to the existing keywords. Update `keywords`:
```ts
keywords: entry.minimal_notes + ' ' + entry.common_bug + ' ' + tokenizeCodeField(entry.snippet),
```

Do NOT apply tokenizer to model or workflow entries — their content is prose, not code.

## Constraints

- `lib/search/tokenizer.ts` must be a pure function with zero imports
- The tokenizer must not throw on any string input including empty string
- Do NOT modify SearchBox.tsx, any schema file, or any component
- Do NOT add any npm packages
- `data/search/search.config.json` is config only — it is not imported anywhere yet (that comes in Phase 3)
- After your changes, search for "fft" should now surface NumPy FFT-related tasks because tokenizeCodeField will have added "fft" and "fast fourier transform" to their code_context

## Verification

Write a small inline test as a comment at the bottom of tokenizer.ts showing:
```
// tokenizeCodeField("np.linalg.inv") 
// → includes: "np", "numpy", "linalg", "inv", "inverse", "np.linalg"
//
// tokenizeCodeField("CrossEntropyLoss")
// → includes: "cross", "entropy", "loss", "crossentropyloss"
//
// tokenizeCodeField("torch.nn.CrossEntropyLoss")
// → includes: "torch", "pytorch", "nn", "cross", "entropy", "loss"
```
```

---

## Phase 3 — Inverted Index Engine

### Goal
Replace Fuse.js as the primary matching engine with a token-based inverted index. Fuse.js stays as the fuzzy fallback for typo tolerance. The UI component (SearchBox.tsx) is not touched.

---

```
You are working on the AENS project at D:\Project\ai-engineering-handbook.

## Context

Phase 1 and Phase 2 are complete. The index now contains rich fields: mental_trigger, code_context (tokenized), keywords, parent_name. The tokenizer lives at lib/search/tokenizer.ts.

In this phase you will build the core search engine as a drop-in replacement for the current createFuse() + fuse.search() pattern.

## What to build

### File 1 — Create `lib/search/inverted-index.ts`

This module builds and queries an in-memory inverted index from an array of SearchResult.

```ts
import { SearchResult } from '@/lib/search-types';

export interface InvertedIndex {
  // token (lowercase) → set of SearchResult._id values
  tokenMap: Map<string, Set<string>>;
  // _id → SearchResult (for fast lookup after matching)
  docMap: Map<string, SearchResult>;
}

export function buildInvertedIndex(docs: SearchResult[]): InvertedIndex
```

**buildInvertedIndex logic:**

For each document, extract tokens from these fields and add doc._id to each token's set:
- `name` — split on whitespace, lowercase each word
- `id` — split on `-` and `::`, lowercase
- `mental_trigger` — split on whitespace, lowercase, skip stop words
- `code_context` — split on whitespace (already tokenized by Phase 2)
- `keywords` — split on whitespace, lowercase
- `summary` — split on whitespace, lowercase, skip stop words
- `category` — as single token
- `fn_signature` — split on whitespace and `.`, lowercase
- `parent_name` — split on whitespace, lowercase

Stop words to skip (hardcoded array):
`["i", "a", "an", "the", "is", "are", "was", "for", "to", "in", "of", "and", "or", "not", "on", "at", "by", "be", "it", "do", "if", "my", "me", "we", "you", "he", "she", "they", "this", "that", "with", "from", "into", "any", "all", "need", "want", "when", "where", "how", "what", "which", "have", "has", "can", "will", "use", "used", "using"]`

Also export a query function:

```ts
export function queryInvertedIndex(
  index: InvertedIndex,
  queryTokens: string[]
): Array<{ id: string; matchedTokenCount: number; totalQueryTokens: number }>
```

This function takes an array of query tokens (already lowercased and split by the caller) and returns matched documents with a count of how many query tokens matched.

Logic:
1. For each query token, look it up in tokenMap. Collect all matching doc IDs.
2. Also do prefix matching: for each query token, find all tokenMap keys that START WITH the query token, and include those docs too (with a prefix match flag).
3. Count how many distinct query tokens matched for each doc.
4. Return sorted descending by matchedTokenCount.

Prefix matching should count as 0.7 of a full token match (e.g., "ada" matching "adam" = 0.7 tokens matched).

### File 2 — Create `lib/search/engine.ts`

This is the main search orchestrator that combines token matching with Fuse.js fallback.

```ts
import Fuse from 'fuse.js';
import { SearchResult, createFuse } from '@/lib/search-types';
import { InvertedIndex, buildInvertedIndex, queryInvertedIndex } from './inverted-index';

export interface SearchEngine {
  search(query: string, limit?: number): SearchResult[];
}

export function createSearchEngine(docs: SearchResult[]): SearchEngine
```

**createSearchEngine logic:**

Build once at creation time:
- `const invertedIndex = buildInvertedIndex(docs)`
- `const fuse = createFuse(docs)` (keep existing Fuse instance for fallback)

**search(query, limit = 8) logic:**

Step 1 — Tokenize query:
Split query on: whitespace, `.`, `_`, `-`, `(`, `)`. Lowercase. Remove tokens < 2 chars.

Step 2 — Token match (Pass A):
Call `queryInvertedIndex(invertedIndex, queryTokens)`.
Convert each hit to a score:
`score = (matchedTokenCount / totalQueryTokens) * 0.95`

Step 3 — Fuzzy match (Pass B):
Call `fuse.search(query, { limit: limit * 2 })`.
Convert each Fuse hit to a score:
`score = (1 - (fuseResult.score ?? 0.5)) * 0.45`
(Fuse returns 0 = perfect match, so invert it. Cap the fuzzy score at 0.45 so it never outranks token matches.)

Step 4 — Merge:
Combine hits from Pass A and Pass B by doc id.
When a doc appears in both passes, take the MAXIMUM score (not sum).
This prevents double-boosting while ensuring the best signal wins.

Step 5 — Sort and return:
Sort by score descending.
Map doc IDs back to SearchResult using invertedIndex.docMap.
Return top `limit` results as plain SearchResult[] (not wrapped in Fuse result objects).

**Important:** The return type is `SearchResult[]`, not `FuseResult<SearchResult>[]`. This is the breaking change from the current API that SearchBox.tsx needs to handle. See File 3.

### File 3 — Update `components/shared/SearchBox.tsx`

The current SearchBox uses Fuse result objects which have `.item`, `.score`, and `.matches` (for highlight). The new engine returns plain SearchResult[].

Update SearchBox to:
1. Accept an optional `engine` prop of type `SearchEngine | null` alongside the existing `index` prop
2. When `engine` is provided, use `engine.search(query, limit)` which returns `SearchResult[]`
3. When `engine` is null (fallback), use the existing Fuse path unchanged

The Highlight component currently uses `FuseResultMatch` data. When using the engine path, matches will be undefined — the Highlight component should gracefully render plain text when match data is not available (it already has this fallback: `if (!match?.indices.length) return <span>{text}</span>`).

The results array shape changes:
- Fuse path: `fuse.search()` returns `Array<{item: SearchResult, matches?: FuseResultMatch[]}>`
- Engine path: `engine.search()` returns `SearchResult[]`

Adapt the render loop to handle both shapes. Extract a helper:

```ts
function getResultItem(r: SearchResult | { item: SearchResult }): SearchResult {
  return 'item' in r ? r.item : r;
}
```

### File 4 — Update `lib/search.ts` (export engine)

At the bottom of lib/search.ts, add:

```ts
import { createSearchEngine } from './search/engine';

export const buildSearchEngine = cache(function buildSearchEngine(): ReturnType<typeof createSearchEngine> {
  return createSearchEngine(buildSearchIndex());
});
```

## How the engine gets wired into pages

Do NOT modify any page files. Instead, document in a comment at the top of lib/search/engine.ts:

```ts
// Usage in page components:
// import { buildSearchEngine } from '@/lib/search';
// const engine = buildSearchEngine();  // server-side, cached
// <SearchBox index={[]} engine={engine} />
// (pass empty index when engine is provided — engine has its own copy)
```

The actual page wiring can be done separately. This phase only builds and exports the engine.

## Constraints

- Do NOT break the existing createFuse() export in search-types.ts (other pages may use it directly)
- Do NOT modify any schema files or data files
- Do NOT add any npm packages — Fuse.js is already installed
- The engine must handle empty query gracefully (return [])
- All new files go under lib/search/
- inverted-index.ts must have zero imports from outside the project (only @/lib/search-types)

## Verification

Confirm these behavioral properties are true after implementation:
1. Searching "linalg" returns NumPy linear algebra task (token match in code_context)
2. Searching "tranformer" (typo) still returns Transformer results (Fuse.js fallback)
3. Searching "ada" returns Adam, AdamW results (prefix match)
4. engine.search("") returns []
5. A result cannot score above 0.95 from token match alone (cap enforced)
6. A result cannot score above 0.45 from fuzzy match alone (cap enforced)
```

---

## Phase 4 — Synonym and Concept Group System

### Goal
Make conceptual searches return all relevant members. `optimizer` returns all optimizers. `tree-based` returns XGBoost, LightGBM, Random Forest. `rag` returns the RAG workflow plus related tools.

---

```
You are working on the AENS project at D:\Project\ai-engineering-handbook.

## Context

Phases 1–3 are complete. The search engine (lib/search/engine.ts) runs multi-pass token + fuzzy matching. This phase adds synonym expansion and concept group resolution as a pre-processing step before the existing passes.

## File 1 — Create `data/search/synonyms.json`

This file maps any search term to a list of equivalent terms that should be searched alongside it.

```json
{
  "_comment": "Add synonyms here. Key = what user might type. Values = what to also search for.",
  "optimizer": ["optimiser", "optimization", "gradient descent", "weight update", "learning algorithm"],
  "optimiser": ["optimizer"],
  "classification": ["classifier", "categorization", "label prediction", "multiclass", "binary classification"],
  "regression": ["continuous output", "value prediction", "numerical prediction"],
  "embedding": ["vector representation", "dense vector", "semantic vector", "encode", "vectorize"],
  "transformer": ["attention mechanism", "self-attention", "encoder decoder", "attention is all you need"],
  "fine-tuning": ["finetuning", "fine tune", "domain adaptation", "lora", "qlora", "instruction tuning"],
  "rag": ["retrieval augmented generation", "retrieval-augmented", "document qa", "grounding"],
  "inference": ["prediction", "forward pass", "serving", "deployment", "model serving"],
  "oom": ["cuda out of memory", "out of memory", "memory error", "gpu memory"],
  "cuda out of memory": ["oom", "gpu memory error", "memory error", "out of memory"],
  "small dataset": ["few samples", "low data", "limited data", "sample efficient", "data scarce"],
  "tabular": ["structured data", "csv", "dataframe", "table", "feature matrix"],
  "np": ["numpy", "numerical python"],
  "torch": ["pytorch"],
  "pd": ["pandas"],
  "inv": ["inverse", "matrix inverse"],
  "svd": ["singular value decomposition"],
  "pca": ["principal component analysis", "dimensionality reduction"],
  "fft": ["fast fourier transform", "frequency domain"],
  "loss function": ["criterion", "objective function", "training loss"],
  "gradient boosting": ["xgboost", "lightgbm", "gbm", "boosted trees"],
  "tree based": ["xgboost", "lightgbm", "random forest", "decision tree", "extra trees"],
  "neural network": ["deep learning", "mlp", "feedforward", "backpropagation"],
  "overfitting": ["regularization", "dropout", "weight decay", "early stopping", "generalization"],
  "batch normalization": ["batchnorm", "bn", "layer norm", "normalization layer"],
  "tokenizer": ["tokenization", "bpe", "wordpiece", "sentencepiece"]
}
```

## File 2 — Create `data/search/concept-groups.json`

This file maps a concept name to the list of doc IDs (matching SearchResult.id values) that belong to that concept. When a query exactly matches a concept key, all member IDs receive a score boost.

```json
{
  "_comment": "Concept key → array of SearchResult IDs. IDs must match what buildSearchIndex() produces.",
  "optimizer": ["adam", "adamw", "sgd", "lion", "rmsprop", "adagrad", "lamb"],
  "loss function": ["crossentropyloss", "mseloss", "bcewithlogitsloss", "huberloss", "nllloss"],
  "tree-based": ["xgboost", "lightgbm", "random-forest", "extra-trees-classifier", "gradient-boosting-classifier"],
  "ensemble": ["xgboost", "lightgbm", "random-forest", "extra-trees-classifier", "gradient-boosting-classifier"],
  "tabular model": ["xgboost", "lightgbm", "random-forest", "extra-trees-classifier"],
  "embedding model": ["gte-large", "bge-large", "e5", "sentence-transformers"],
  "reranker": ["bge-reranker", "cross-encoder"],
  "workflow": ["rag", "fine-tuning-lora", "text-classification"],
  "rag": ["rag"],
  "fft": ["numpy::fft", "scipy::fft", "torch::fft"]
}
```

Note: The IDs in concept-groups.json must match actual SearchResult.id values from your index. Review what buildSearchIndex() produces and adjust these IDs to match. The ones above are best-guess approximations — verify against actual data.

## File 3 — Create `lib/search/synonym-expander.ts`

```ts
import synonymsData from '@/data/search/synonyms.json';
import conceptGroupsData from '@/data/search/concept-groups.json';

const synonyms = synonymsData as Record<string, string[]>;
const conceptGroups = conceptGroupsData as Record<string, string[]>;

/**
 * Given a raw query, returns expanded query tokens and any concept group hits.
 */
export function expandQuery(query: string): {
  expandedTokens: string[];
  conceptGroupIds: string[];  // doc IDs that match a concept group
} {
  const normalizedQuery = query.toLowerCase().trim();
  const baseTokens = normalizedQuery.split(/[\s._()\-,]+/).filter(t => t.length >= 2);

  // Synonym expansion: for each token, add synonyms
  const expandedTokens = new Set<string>(baseTokens);
  for (const token of baseTokens) {
    const syns = synonyms[token] ?? [];
    syns.forEach(s => {
      // Add synonym as both whole string and individual words
      expandedTokens.add(s);
      s.split(/\s+/).forEach(w => expandedTokens.add(w));
    });
  }

  // Also check the full query as a phrase (for multi-word synonyms like "cuda out of memory")
  const fullQuerySyns = synonyms[normalizedQuery] ?? [];
  fullQuerySyns.forEach(s => {
    expandedTokens.add(s);
    s.split(/\s+/).forEach(w => expandedTokens.add(w));
  });

  // Concept group resolution: check if query exactly matches a concept key
  const conceptGroupIds: string[] = [];
  if (conceptGroups[normalizedQuery]) {
    conceptGroupIds.push(...conceptGroups[normalizedQuery]);
  }
  // Also check individual tokens
  for (const token of baseTokens) {
    if (conceptGroups[token]) {
      conceptGroupIds.push(...conceptGroups[token]);
    }
  }

  return {
    expandedTokens: Array.from(expandedTokens).filter(t => t.length >= 2),
    conceptGroupIds: [...new Set(conceptGroupIds)],
  };
}
```

Note: Importing JSON with `@/data/search/synonyms.json` requires the tsconfig to have `"resolveJsonModule": true`. Check `tsconfig.json` — if this is missing, add it. If direct JSON import causes issues with the build, use `fs.readFileSync` with `JSON.parse` instead, following the same pattern as `lib/data.ts`.

## File 4 — Update `lib/search/engine.ts`

Import the expander:
```ts
import { expandQuery } from './synonym-expander';
```

Update the `search()` method to run expansion before matching:

```ts
search(query: string, limit = 8): SearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  // Step 1: Expand query with synonyms and concept groups
  const { expandedTokens, conceptGroupIds } = expandQuery(trimmed);

  // Step 2: Token match using expandedTokens (not just base tokens)
  const tokenHits = queryInvertedIndex(invertedIndex, expandedTokens);
  // ... (existing scoring logic from Phase 3)

  // Step 3: Concept group injection
  // Add concept group members as high-confidence hits (score 0.80)
  const conceptHits = new Map<string, number>();
  for (const id of conceptGroupIds) {
    conceptHits.set(id, 0.80);
  }

  // Step 4: Fuzzy match (unchanged from Phase 3)
  // ...

  // Step 5: Merge all three sources (token hits, concept hits, fuzzy hits)
  // For each doc, take the MAXIMUM score across all sources
  const mergedScores = new Map<string, number>();
  
  // Apply token hits
  for (const hit of tokenHits) {
    const score = (hit.matchedTokenCount / hit.totalQueryTokens) * 0.95;
    mergedScores.set(hit.id, Math.max(mergedScores.get(hit.id) ?? 0, score));
  }
  
  // Apply concept hits (these bypass token matching entirely)
  for (const [id, score] of conceptHits) {
    mergedScores.set(id, Math.max(mergedScores.get(hit.id) ?? 0, score));  // fix: use id not hit.id
  }
  
  // Apply fuzzy hits
  for (const fuseResult of fuseHits) {
    const score = (1 - (fuseResult.score ?? 0.5)) * 0.45;
    const id = fuseResult.item.id;
    mergedScores.set(id, Math.max(mergedScores.get(id) ?? 0, score));
  }

  // Sort and return
  return Array.from(mergedScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => invertedIndex.docMap.get(id))
    .filter((doc): doc is SearchResult => doc !== undefined);
}
```

## Constraints

- `data/search/` is a new directory — create it
- synonyms.json and concept-groups.json must be valid JSON (no trailing commas)
- Do NOT modify any schema Zod files
- Do NOT modify SearchBox.tsx
- The concept group IDs in concept-groups.json must be verified against actual SearchResult.id values from buildSearchIndex(). Where an exact match isn't certain (like optimizer members that may not be in the data yet), leave the array but note with a comment that IDs are placeholders
- After this phase, `engine.search("optimizer")` must return all indexed optimizer-related results even if the word "optimizer" doesn't appear in their name or summary

## Verification

1. `engine.search("optimizer")` — returns all members listed in the optimizer concept group that exist in the index
2. `engine.search("rag")` — returns the RAG workflow (both via concept group and token match)
3. `engine.search("OOM")` — synonym expands to "cuda out of memory", matches PyTorch cheatsheet entries
4. `engine.search("np")` — synonym expands to "numpy", returns NumPy package and tasks
5. `engine.search("tree based")` — concept group hit returns XGBoost, LightGBM, Random Forest
```

---

## Phase 5 — Wire Engine into Pages + Add `aliases[]` to JSON Schema

### Goal
Connect the engine to actual page components. Add `aliases[]` as an optional field to data schemas. Wire the engine so pages pass it to SearchBox.

---

```
You are working on the AENS project at D:\Project\ai-engineering-handbook.

## Context

Phases 1–4 are complete. The search engine is built and exported from lib/search.ts as buildSearchEngine(). SearchBox.tsx already accepts an optional engine prop. The engine is not yet passed into SearchBox from any page.

## Task 1 — Add `aliases[]` to JSON schemas (optional field)

In `lib/schemas/package.ts`, add to PackageTaskSchema:
```ts
aliases: z.array(z.string()).optional(),
```

In `lib/schemas/model.ts`, add to ModelSchema:
```ts
aliases: z.array(z.string()).optional(),
concept_groups: z.array(z.string()).optional(),
```

In `lib/schemas/workflow.ts`, add to WorkflowSchema:
```ts
aliases: z.array(z.string()).optional(),
```

In `lib/schemas/cheatsheet.ts`, add to CheatsheetEntrySchema:
```ts
aliases: z.array(z.string()).optional(),
```

These fields are optional — no existing JSON file needs to change. The field will be populated gradually over time.

## Task 2 — Index aliases in `lib/search.ts`

In the package task indexer, update `keywords`:
```ts
keywords: [
  task.use_when,
  task.avoid_when,
  task.decision_notes,
  task.gotchas.join(' '),
  task.important_params.join(' '),
  ...(task.aliases ?? []),  // ADD THIS
].join(' '),
```

In the model indexer, update `keywords` similarly:
```ts
keywords: [
  m.use_when,
  m.avoid_when,
  m.pros.join(' '),
  m.cons.join(' '),
  m.key_hyperparams.map(h => h.name).join(' '),
  m.problem_types.join(' '),
  m.decision_notes ?? '',
  ...(m.aliases ?? []),        // ADD THIS
  ...(m.concept_groups ?? []), // ADD THIS
].join(' '),
```

In the workflow indexer, update `keywords` similarly:
```ts
keywords: [
  w.overview,
  w.starter_stack.join(' '),
  w.steps.map(s => s.name).join(' '),
  w.steps.flatMap(s => s.tools).join(' '),
  w.steps.map(s => s.what).join(' '),
  w.steps.flatMap(s => s.failure_points).join(' '),
  ...(w.aliases ?? []),  // ADD THIS
].join(' '),
```

## Task 3 — Find where SearchBox is used and pass engine

Find all usages of `<SearchBox` in the codebase. For each usage:
1. Import `buildSearchEngine` from `@/lib/search`
2. Call `const engine = buildSearchEngine()` (server component, so no hooks needed)
3. Pass it as a prop: `<SearchBox index={[]} engine={engine} />`

When `engine` is passed, the `index` prop is not used by the engine path (engine has its own copy). Pass `index={[]}` to satisfy the TypeScript prop type.

If SearchBox is used inside a client component where server-side functions can't be called:
- Pass the engine from the nearest server component parent down as a prop
- If that's not feasible, pass the index as today and leave engine={null} — the Fuse fallback still works

## Task 4 — Add aliases to 3 high-value JSON data files

To demonstrate the alias system working immediately, add aliases to these specific entries:

**`data/packages/numpy.json`** — find the linear algebra task and add:
```json
"aliases": ["matrix inverse", "inverse matrix", "solve Ax=b", "solve linear system", "eigenvalues", "SVD", "matrix multiply", "dot product"]
```

**`data/models/ml/xgboost.json`** — add to the root model object:
```json
"aliases": ["xgb", "extreme gradient boosting", "gradient boosted trees", "gbm"],
"concept_groups": ["tree-based", "ensemble", "tabular model", "gradient boosting"]
```

**`data/workflows/rag.json`** — add to the root workflow object:
```json
"aliases": ["retrieval augmented generation", "document qa", "document question answering", "knowledge base chat", "grounding llm"]
```

## Constraints

- Schema changes are all optional fields — `npm run validate` must still pass on all existing JSON files
- Do NOT add required fields to any schema
- Do NOT modify any component other than the SearchBox wiring
- If TypeScript complains about the engine prop type after schema changes, fix the type in search-types.ts
- After this phase, run `npm run build` mentally — there should be no new type errors

## Verification

1. `npm run validate` passes (all existing JSON valid against updated schemas with optional new fields)
2. SearchBox in at least one page now receives the engine prop
3. Searching "matrix inverse" returns the NumPy linear algebra task (alias match)
4. Searching "xgb" returns XGBoost (alias in keywords)
5. Searching "grounding" returns the RAG workflow (alias expansion)
```

---

## Phase 6 — Related Search (Discovery Feature)

### Goal
When a user selects a result, show "Related" items below or alongside it. This turns AENS search from a lookup tool into a discovery tool. Based on the reviewer's recommendation.

---

```
You are working on the AENS project at D:\Project\ai-engineering-handbook.

## Context

Phases 1–5 are complete. Search now returns rich, deep results via the engine. This phase adds a "Related" feature that fires a secondary search when the user highlights or navigates to a result.

## What to build

### File 1 — Add `getRelatedSearchResults()` to `lib/search/engine.ts`

Add a method to SearchEngine:

```ts
getRelated(doc: SearchResult, limit = 5): SearchResult[]
```

Logic:
1. Collect seed terms from the result:
   - doc.category (e.g. "ml", "NumPy")
   - doc.problem_types (if present)
   - doc.parent_name (if present)
   - First 3 words of doc.summary
2. Run a token search using these seed terms
3. Filter out the source doc itself (by id)
4. Return top `limit` results

### File 2 — Update `components/shared/SearchBox.tsx`

When the user highlights a result (via arrow key or hover):

1. Call `engine.getRelated(highlightedResult, 4)` to get related docs
2. Show a "Related" section below the main results list

UI spec:
- Show related results only when there are ≥ 2 of them
- Label: `<span className="text-[10px] uppercase tracking-wide text-muted-foreground px-3 pt-2 block">Related</span>`
- Related items render with the same Link structure as main results, but without the ContentTypeBadge
- Related items do NOT affect keyboard navigation (arrow keys only navigate main results)
- Related items are clickable with mouse/touch

### Implementation notes

- `getRelated` is synchronous (no async) — engine.search() is already synchronous
- Only show related items when the user is actively hovering or has arrow-keyed to a result (i.e., activeIndex >= 0 and results.length > 0)
- The related section should appear visually separated from main results with a thin border-t border-border/50

## Constraints

- Do NOT change keyboard navigation behavior for main results
- Do NOT add any npm packages
- Related results must be genuinely useful — if getRelated returns poor quality results (< 2 results), show nothing
- This feature is additive — if engine prop is null (Fuse fallback path), skip related entirely

## Verification

1. Hovering over "XGBoost" in results shows related: LightGBM, Random Forest, Gradient Boosting Classifier
2. Hovering over "NumPy" package shows related: CuPy, JAX, Dask (other packages)
3. Hovering over "RAG" workflow shows related: other workflows and embedding-related tools
4. Related section is absent when main results list is empty
5. Related section does not appear on the Fuse fallback path (engine=null)
```

---

## Summary of phases

| Phase | Files Changed | Risk | Impact |
|---|---|---|---|
| 1 — Deep indexing | `lib/search-types.ts`, `lib/search.ts` | Low | Highest — fixes 80% of failures |
| 2 — Tokenizer + config | `lib/search/tokenizer.ts` (new), `data/search/search.config.json` (new), `lib/search.ts` | Low | High — code search now works |
| 3 — Inverted index engine | `lib/search/inverted-index.ts` (new), `lib/search/engine.ts` (new), `lib/search.ts`, `SearchBox.tsx` | Medium | High — replaces Fuse as primary |
| 4 — Synonyms + concepts | `data/search/synonyms.json` (new), `data/search/concept-groups.json` (new), `lib/search/synonym-expander.ts` (new), `lib/search/engine.ts` | Low | High — concept search works |
| 5 — Wire + aliases schema | schema files, `lib/search.ts`, page files, 3 JSON data files | Low | Medium — aliases live |
| 6 — Related search | `lib/search/engine.ts`, `SearchBox.tsx` | Low | Medium — discovery feature |

Run phases in order. After each phase, confirm the app builds and search works before proceeding.
