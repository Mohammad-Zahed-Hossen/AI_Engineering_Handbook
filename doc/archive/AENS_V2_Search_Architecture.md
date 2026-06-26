# AENS V2 Search Architecture Design

**System:** AI Engineering Navigation System  
**Document:** Search Architecture — Complete Design  
**Date:** 2026-06-26  
**Status:** Pre-implementation Design  

---

## Table of Contents

1. [Diagnosis of the Current System](#1-diagnosis-of-the-current-system)
2. [Overall Architecture](#2-overall-architecture)
3. [Index Schema](#3-index-schema)
4. [Tokenization Strategy](#4-tokenization-strategy)
5. [Synonym and Alias System](#5-synonym-and-alias-system)
6. [Search Pipeline](#6-search-pipeline)
7. [Ranking Algorithm](#7-ranking-algorithm)
8. [Search Flow Diagram](#8-search-flow-diagram)
9. [Data Structures](#9-data-structures)
10. [Performance Analysis](#10-performance-analysis)
11. [Memory Analysis](#11-memory-analysis)
12. [Scalability Analysis](#12-scalability-analysis)
13. [Trade-offs](#13-trade-offs)
14. [Implementation Roadmap](#14-implementation-roadmap)

---

## 1. Diagnosis of the Current System

### What exists today

The current system (`lib/search.ts` + `lib/search-types.ts`) uses Fuse.js with five weighted keys against a flat list of `SearchResult` objects. The index has two granularity levels:

- **Page-level entries** — one entry per package, model, workflow, cheatsheet, registry item
- **Task-level entries** (partially added) — one entry per package task, using `task.task` as the name and `task.mental_trigger || task.syntax` as the summary

The Fuse.js configuration:

```
name: 0.4 | summary: 0.3 | fn_signature: 0.15 | id: 0.1 | category: 0.05
threshold: 0.25 | minMatchCharLength: 2
```

### Root failure modes

**Failure 1 — Shallow indexing of nested content.**  
`np.linalg.inv` fails because the syntax field (`np.linalg.solve`, `np.linalg.svd`, etc.) is placed in `summary` as a truncated string. The Fuse.js fuzzy match on a multi-line syntax block is unreliable and the dot notation is never tokenized.

**Failure 2 — No code tokenization.**  
`np.linalg.inv` is treated as a single opaque string. It is never split into `np`, `linalg`, `inv`, `numpy`, or `inverse`. A search for `linalg` alone cannot match.

**Failure 3 — Missing semantic fields.**  
`mental_trigger`, `keywords`, `gotchas`, `use_when`, `avoid_when`, `decision_notes`, `problem_types`, `pros`, `cons`, `key_hyperparams`, `steps[].name`, `steps[].tools`, `entries[].trigger`, and `entries[].common_bug` are all absent from the index. These are exactly the fields users search by.

**Failure 4 — No alias system.**  
"inverse matrix" → `np.linalg.inv` requires a synonym mapping that does not exist. "optimizer" → Adam, AdamW, SGD requires concept-level groupings.

**Failure 5 — Single Fuse instance over heterogeneous records.**  
A workflow summary, a cheatsheet problem, and a function syntax string are weighted identically. There is no per-type search tuning.

**Failure 6 — Cheatsheet entries are indexed only as a summary snippet.**  
`cs.entries.map(e => e.problem).slice(0, 4).join(', ')` — only 4 problem strings per cheatsheet, no trigger, snippet, or common_bug.

---

## 2. Overall Architecture

### Design philosophy

The architecture is built on four principles derived from studying VS Code's symbol search, Obsidian's global search, and JetBrains "Search Everywhere":

1. **Index at the knowledge-block level, not the page level.** Every discrete piece of knowledge — a task card, a cheatsheet entry, a workflow step — becomes an independent search document. Pages are discovered through their blocks.

2. **Tokenize code as code.** Dot-notation identifiers, camelCase names, and underscore-separated names are broken into their components at index time. The user never needs to know the exact namespace.

3. **Explicit signals beat implicit fuzzy matching.** `mental_trigger`, `keywords`, `aliases`, and `use_when` are high-fidelity signals that deserve priority. Fuzzy matching is a fallback, not a foundation.

4. **The index is a build artifact, not a runtime computation.** The index is generated once at build time (or whenever data changes), serialized to JSON, and loaded as a static asset. No database, no server-side search endpoint.

### Architectural layers

```
┌─────────────────────────────────────────────────────────┐
│                    DATA LAYER (JSON files)               │
│  packages/  models/  workflows/  cheatsheets/  registry/ │
└─────────────────────────┬───────────────────────────────┘
                          │  build-time
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  INDEX BUILDER                           │
│  Extractor → Tokenizer → Alias Expander → Serializer     │
└─────────────────────────┬───────────────────────────────┘
                          │  outputs
                          ▼
┌─────────────────────────────────────────────────────────┐
│              SEARCH INDEX (static JSON)                  │
│  search-index.json  +  synonym-map.json                  │
└─────────────────────────┬───────────────────────────────┘
                          │  loaded at startup
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  SEARCH ENGINE (client)                  │
│  Query Parser → Multi-pass Matcher → Ranker → Renderer  │
└─────────────────────────────────────────────────────────┘
```

### Technology choices

| Need | Choice | Reason |
|---|---|---|
| Fuzzy matching | Fuse.js (retained) | Already in project; adequate for fuzzy fallback |
| Exact / prefix / token matching | Custom trie + inverted index | Built-in, no dependency, fast for 50k tokens |
| Synonym expansion | Static JSON map | Git-managed, zero runtime cost, readable |
| Index storage | Static JSON file | Survives Next.js static export, no server needed |
| Build trigger | `next build` hook or separate script | Keeps data and index in sync |

---

## 3. Index Schema

### 3.1 Index document types

The index contains **six document types**, each corresponding to a discrete knowledge unit:

#### `TaskDoc` — A function/operation within a package

Sourced from: `data/packages/*.json → tasks[]`

```typescript
interface TaskDoc {
  _type: 'task';
  _id: string;                // "numpy::linalg-solve"
  _score_boost: number;       // 1.0 baseline

  // Navigation
  href: string;               // "/packages/numpy#linear-algebra"
  parent_id: string;          // "numpy"
  parent_name: string;        // "NumPy"

  // Primary match fields (highest weight)
  title: string;              // "Perform linear algebra operations on matrices"
  code_tokens: string[];      // ["np","linalg","solve","inv","svd","eigh","norm","numpy"]
  aliases: string[];          // ["inverse matrix","matrix inverse","solve linear system"]
  mental_trigger: string;     // "I need matrix multiply, inverse, eigenvalues..."

  // Secondary match fields
  keywords: string[];         // extracted from use_when, mental_trigger
  syntax_raw: string;         // "A @ B\nnp.linalg.solve(A, b)..."
  use_when: string;
  avoid_when: string;
  decision_notes: string;
  gotchas: string[];          // ["np.linalg.inv on near-singular..."]

  // Relations
  related_workflows: string[];
  related_cheatsheets: string[];
}
```

#### `CheatsheetEntryDoc` — A single cheatsheet entry

Sourced from: `data/cheatsheets/*.json → entries[]`

```typescript
interface CheatsheetEntryDoc {
  _type: 'cheatsheet_entry';
  _id: string;                // "pytorch::training-loop"
  _score_boost: number;

  href: string;               // "/cheatsheets/pytorch#training-loop"
  parent_id: string;          // "pytorch"
  parent_name: string;        // "PyTorch"

  title: string;              // "Write the training loop correctly"
  trigger: string;            // "Custom training — any time you are not using HuggingFace Trainer"
  code_tokens: string[];      // ["model","train","optimizer","zero_grad","backward","step"]
  snippet_raw: string;        // the code block
  minimal_notes: string;
  common_bug: string;
  keywords: string[];
}
```

#### `ModelDoc` — An ML/DL/LLM model

Sourced from: `data/models/**/*.json`

```typescript
interface ModelDoc {
  _type: 'model';
  _id: string;                // "xgboost"
  _score_boost: number;

  href: string;               // "/models/ml/xgboost"
  category: string;           // "ml"

  name: string;               // "XGBoost"
  aliases: string[];          // ["xgb","extreme gradient boosting","gbm"]
  summary: string;
  problem_types: string[];    // ["classification","regression"]
  use_when: string;
  avoid_when: string;
  keywords: string[];         // extracted from pros, cons, use_when
  concept_groups: string[];   // ["tree-based","ensemble","gradient-boosting","tabular"]
  hyperparam_names: string[]; // ["n_estimators","max_depth","learning_rate"]
}
```

#### `WorkflowDoc` — A workflow with steps

Sourced from: `data/workflows/*.json`

```typescript
interface WorkflowDoc {
  _type: 'workflow';
  _id: string;                // "rag"
  _score_boost: number;

  href: string;               // "/workflows/rag"

  name: string;               // "Retrieval-Augmented Generation"
  aliases: string[];          // ["retrieval augmented generation","rag pipeline"]
  overview: string;
  category: string;           // "Inference"
  step_names: string[];       // ["Ingestion and Chunking","Embedding","Vector Storage"]
  step_tools: string[];       // ["PyMuPDF","ChromaDB","SentenceTransformers"]
  starter_stack: string[];
  keywords: string[];
}
```

#### `PackageDoc` — A top-level package page

Sourced from: `data/packages/*.json` (page-level, for when user wants the package overview)

```typescript
interface PackageDoc {
  _type: 'package';
  _id: string;                // "numpy"
  _score_boost: number;

  href: string;               // "/packages/numpy"

  name: string;               // "NumPy"
  aliases: string[];          // ["np","numerical python"]
  summary: string;
  import_as: string;          // "import numpy as np"
  install: string;            // "pip install numpy"
  keywords: string[];
}
```

#### `RegistryDoc` — A registry model entry

Sourced from: `data/registry/*.json`

```typescript
interface RegistryDoc {
  _type: 'registry';
  _id: string;
  _score_boost: number;
  href: string;
  task: string;               // "embedding", "reranker", etc.
  name: string;
  keywords: string[];
}
```

### 3.2 Field weight table

These weights are applied during scoring, not inside Fuse.js (explained in §7):

| Field | Weight | Rationale |
|---|---|---|
| `aliases[]` exact match | 1.00 | User typed exactly what this is called |
| `code_tokens[]` exact match | 0.95 | User knows the API symbol |
| `name` exact match | 0.90 | Direct name lookup |
| `concept_groups[]` / `problem_types[]` | 0.80 | Conceptual lookup ("optimizer", "classification") |
| `mental_trigger` substring | 0.75 | User describes what they want to do |
| `keywords[]` match | 0.70 | Curated secondary terms |
| `title` / `step_names[]` match | 0.65 | Structural names |
| `use_when` / `trigger` substring | 0.55 | Contextual description |
| `summary` / `overview` fuzzy | 0.40 | General description |
| `syntax_raw` / `snippet_raw` fuzzy | 0.30 | Code content, last resort |
| `gotchas[]` / `common_bug` fuzzy | 0.20 | Error-driven search |

---

## 4. Tokenization Strategy

### 4.1 Code tokenization

Code identifiers must be decomposed into all plausible user search terms. The tokenizer runs at index build time and emits a flat `code_tokens[]` array per document.

**Rules, in order:**

1. **Dot-split** — `np.linalg.inv` → `["np", "linalg", "inv"]`
2. **Prefix segments** — `["np.linalg", "np.linalg.inv"]` (for prefix-aware search)
3. **Package alias expansion** — `np` → also `numpy`; `torch` → also `pytorch`
4. **CamelCase split** — `CrossEntropyLoss` → `["Cross", "Entropy", "Loss", "cross", "entropy", "loss"]`
5. **Snake/kebab split** — `learning_rate`, `max-depth` → individual words
6. **Abbreviation expansion** (via alias map) — `inv` → `["inverse"]`; `svd` → `["singular value decomposition"]`
7. **Deduplicate and lowercase** — all tokens stored lowercase

**Example — `np.linalg.inv`:**

```
Input:  "np.linalg.solve(A, b)\nnp.linalg.svd(A)\nnp.linalg.eigh(A)\nnp.linalg.norm(x)"

Emits code_tokens: [
  "np", "numpy", "linalg", "linear", "algebra",
  "solve", "svd", "eigh", "norm", "inv",
  "np.linalg", "np.linalg.solve",
  "singular", "value", "decomposition",
  "eigenvalue", "inverse"
]
```

**Example — `CrossEntropyLoss`:**

```
Input: "torch.nn.CrossEntropyLoss"

Emits code_tokens: [
  "torch", "pytorch", "nn", "neural", "network",
  "cross", "entropy", "loss",
  "crossentropyloss",
  "classification", "loss function"
]
```

### 4.2 Keyword extraction from prose fields

At build time, the index builder also extracts implicit keywords from prose fields using a simple stop-word-filtered word list. These feed into `keywords[]`:

- Strip stop words: "I", "need", "a", "to", "the", "is", "for", "or", "when", "you", etc.
- Lowercase, deduplicate
- Include multi-word noun phrases that match a curated technical vocabulary list (`optimizer`, `gradient`, `batch`, `epoch`, `loss`, etc.)

This means `mental_trigger: "I need matrix multiply, inverse, eigenvalues, SVD"` extracts `["matrix", "multiply", "inverse", "eigenvalues", "svd"]` as searchable keywords automatically, without manual curation per entry.

### 4.3 Query tokenization (at search time)

The user's query goes through the same tokenizer before matching:

```
"np.linalg.inv" → ["np", "numpy", "linalg", "inv", "np.linalg", "np.linalg.inv"]
"cross entropy"  → ["cross", "entropy", "crossentropy"]
"optimizer"      → ["optimizer"] + synonym expansion → ["optimiser","optimization","gradient descent"]
"tranformer"     → fuzzy fallback → "transformer"
```

---

## 5. Synonym and Alias System

### 5.1 Two-tier structure

**Tier 1 — Aliases (per document, in the JSON data)**

Aliases live inside each knowledge object and are Git-managed alongside the content:

```json
// In numpy.json, the linalg task:
{
  "task": "Perform linear algebra operations on matrices",
  "aliases": ["inverse matrix", "matrix inverse", "solve Ax=b", "eigendecomposition", "SVD"],
  ...
}
```

These are indexed directly into `TaskDoc.aliases[]`. An exact alias match scores 1.00.

**Tier 2 — Global synonym map (a single JSON file)**

`data/search/synonyms.json` — a flat map where any key expands to a set of equivalent terms:

```json
{
  "optimizer": ["optimiser", "optimization algorithm", "gradient descent", "weight update"],
  "classification": ["classifier", "categorization", "label prediction", "multiclass"],
  "regression": ["continuous output", "value prediction", "numerical prediction"],
  "embedding": ["vector representation", "dense vector", "semantic vector", "encode"],
  "transformer": ["attention mechanism", "self-attention", "encoder decoder"],
  "fine-tuning": ["finetuning", "fine tune", "domain adaptation", "lora", "qlora"],
  "rag": ["retrieval augmented generation", "retrieval-augmented", "document qa"],
  "inference": ["prediction", "forward pass", "serving", "deployment"],
  "cuda out of memory": ["oom", "gpu memory error", "memory error", "out of memory"],
  "small dataset": ["few samples", "low data", "limited data", "sample efficient"],
  "tabular": ["structured data", "csv", "dataframe", "table"],
  "np": ["numpy", "numerical python"],
  "torch": ["pytorch"],
  "inv": ["inverse"],
  "svd": ["singular value decomposition"],
  "pca": ["principal component analysis", "dimensionality reduction"]
}
```

At query time, the query is checked against the synonym map. Every synonym for a matching key is added as additional search terms. This is additive — synonym expansion widens the search, does not replace it.

### 5.2 Concept groups

A third concept-grouping mechanism handles "show me all things of type X" queries. This is distinct from synonyms:

```json
// data/search/concept-groups.json
{
  "optimizer": ["adam", "adamw", "sgd", "lion", "rmsprop", "adagrad", "lamb"],
  "loss function": ["crossentropyloss", "mseloss", "bcewithlogitsloss", "huberloss"],
  "tree-based": ["xgboost", "lightgbm", "random-forest", "extra-trees-classifier", "gradient-boosting-classifier"],
  "embedding model": ["gte-large", "bge-large", "e5", "sentence-transformers"],
  "vector database": ["chromadb", "faiss", "pinecone", "weaviate", "qdrant"]
}
```

When a user searches `optimizer`, the concept group lookup adds all members as boosted candidates. This guarantees that conceptual searches never miss members of a known group.

### 5.3 Maintenance model

Both `synonyms.json` and `concept-groups.json` are:
- Versioned in Git alongside data files
- Human-editable plain JSON
- Loaded at build time by the index builder
- Never auto-generated — always intentionally curated

The only time they need updating is when a new concept is added that doesn't naturally appear in existing prose.

---

## 6. Search Pipeline

The pipeline runs entirely in the browser (client-side) after the index is loaded. There is no search API.

### Stage 1: Query parsing

```
raw_query: "np.linalg.inv"

→ normalized_query:     "np linalg inv"
→ query_tokens:         ["np", "numpy", "linalg", "inv", "np.linalg", "np.linalg.inv"]
→ synonym_expansions:   ["np" → "numpy"]
→ concept_hits:         []  (not a concept group key)
→ is_code_query:        true  (contains dots or known code prefixes)
→ is_fuzzy_candidate:   false (exact tokens found)
```

### Stage 2: Multi-pass matching

Three passes run in parallel, each returning a scored candidate list:

**Pass A — Exact / Token Match**

Check each index document's `code_tokens[]`, `aliases[]`, and `keywords[]` against `query_tokens`. This is an O(n × k) lookup where n is the number of documents and k is the token set size. For the projected scale (50,000 documents, 200 tokens average), this is trivially fast.

Score for each document = sum of matched field weights (from §3.2).

**Pass B — Prefix Match**

For each query token, find documents whose `code_tokens[]` or `name` starts with that token. Useful for `ada` → `adam`, `adamw`, `adagrad`.

**Pass C — Fuzzy Match (Fuse.js)**

Run the existing Fuse.js instance over a subset of fields: `name`, `title`, `mental_trigger`, `summary`. This handles typos and partial phrase matches. Fuse.js remains in the architecture as the fuzzy fallback layer, not the primary layer.

### Stage 3: Concept expansion

If the normalized query exactly matches a key in `concept-groups.json`, all member IDs receive a flat score bonus (0.80) and are merged into the candidate list. This ensures `optimizer` returns all optimizers regardless of Fuse.js behavior.

### Stage 4: Synonym expansion re-match

Any synonym expansions from Stage 1 are re-run through Passes A and B. This is usually a single extra token lookup.

### Stage 5: Deduplication and merge

Candidates from all passes are merged by `_id`. When the same document appears in multiple passes, scores are combined (weighted maximum, not sum, to prevent artificial inflation).

### Stage 6: Ranking

See §7.

### Stage 7: Result grouping

Results are grouped by `_type` for display:
- Code symbols / tasks appear first
- Models (when concept search)
- Workflows (when workflow terms detected)
- Cheatsheet entries
- Package / registry pages last

---

## 7. Ranking Algorithm

### Priority order with rationale

```
Rank 1: Exact alias match            score: 1.00
Rank 2: Exact code_token match       score: 0.95
Rank 3: Exact name match             score: 0.90
Rank 4: Concept group member         score: 0.80
Rank 5: mental_trigger substring     score: 0.75
Rank 6: keywords[] match             score: 0.70
Rank 7: title / step_names match     score: 0.65
Rank 8: use_when / trigger substring score: 0.55
Rank 9: summary / overview fuzzy     score: 0.40
Rank 10: syntax_raw / snippet fuzzy  score: 0.30
Rank 11: gotchas / common_bug fuzzy  score: 0.20
```

**Why this order?**

- **Aliases rank first** because an alias is a deliberate authorial decision that "this term means this thing." It is the highest-confidence signal available.
- **Code tokens rank second** because when a user types a code symbol, they want the exact API, not an approximate prose match.
- **Name before concept group** because exact name lookup (`Adam`) should rank the Adam optimizer page above all other optimizer pages, even though all optimizers are members of the `optimizer` concept group.
- **Mental trigger before keywords** because `mental_trigger` is a curated description of the scenario that causes a user to need this tool. It is written specifically to match user intent. Auto-extracted keywords are lower confidence.
- **use_when before summary** because `use_when` is a structured, precise field. Summary is prose written for reading, not for search matching.
- **Gotchas last** because a user searching `CUDA out of memory` wants the solution page, not every page that mentions the error in a warning.

### Tiebreaking

When two results share the same score:
1. `_score_boost` (set per document type and content quality — see §3.1)
2. `updated_at` descending (more recently updated content wins)
3. `parent_name` alphabetical (stable sort)

### Score decay for partial matches

When only some query tokens match (e.g., 2 of 3 tokens in query):

```
final_score = base_score × (matched_token_count / total_query_tokens) ^ 0.5
```

The square root softens the penalty — a 2-of-3 token match still surfaces the result, but lower than a complete match.

---

## 8. Search Flow Diagram

```
USER TYPES QUERY
       │
       ▼
┌──────────────────────┐
│   Query Normalizer   │  lowercase, trim, detect type (code/prose/concept)
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Tokenizer          │  dot-split, camelCase split, prefix segments
└──────────┬───────────┘
           │
           ├──────────────────────────────────┐
           ▼                                  ▼
┌─────────────────────┐             ┌─────────────────────┐
│  Synonym Expander   │             │  Concept Lookup      │
│  synonyms.json      │             │  concept-groups.json │
└──────────┬──────────┘             └──────────┬──────────┘
           │                                   │
           └──────────────┬────────────────────┘
                          ▼
           ┌──────────────────────────────────────┐
           │         MULTI-PASS MATCHING           │
           │                                      │
           │  Pass A: Token Match (inverted index) │
           │  Pass B: Prefix Match (trie)          │
           │  Pass C: Fuzzy Match (Fuse.js)        │
           └──────────────┬───────────────────────┘
                          │
                          ▼
           ┌──────────────────────────────────────┐
           │         Merge + Deduplication         │
           │  (weighted-max score per _id)         │
           └──────────────┬───────────────────────┘
                          │
                          ▼
           ┌──────────────────────────────────────┐
           │         Ranker                        │
           │  field-weight scoring + tiebreak      │
           └──────────────┬───────────────────────┘
                          │
                          ▼
           ┌──────────────────────────────────────┐
           │         Result Grouper                │
           │  task → model → workflow → cheatsheet │
           └──────────────┬───────────────────────┘
                          │
                          ▼
                    RESULTS DISPLAYED
```

---

## 9. Data Structures

### 9.1 In-memory inverted index

```typescript
// Built once at startup from search-index.json
interface InvertedIndex {
  // token → set of document IDs that contain this token in high-weight fields
  tokenToIds: Map<string, Set<string>>;
  
  // document ID → full document
  docs: Map<string, SearchDoc>;
  
  // concept group name → array of document IDs
  conceptGroups: Map<string, string[]>;
  
  // synonym key → array of synonym strings
  synonyms: Map<string, string[]>;
}
```

**Construction time:** O(D × T) where D = documents, T = average tokens per document  
**Query time (token lookup):** O(Q × 1) per token (hash map lookup) = O(Q) per query

### 9.2 Trie for prefix search

```typescript
interface TrieNode {
  children: Map<string, TrieNode>;
  docIds: Set<string>;   // documents that have a token matching the prefix to this node
  isTerminal: boolean;
}
```

A single shared Trie is built over all `code_tokens[]` and `aliases[]`. Prefix query `ada` traverses the trie to the node for `ada` and returns all `docIds` in the subtree.

**Construction time:** O(D × T × L) where L = average token length  
**Query time:** O(L + R) where L = query length, R = result count

### 9.3 Serialized index format

`public/search-index.json` (loaded as a static asset):

```typescript
interface SearchIndexFile {
  version: number;           // bump to invalidate stale cached indexes
  built_at: string;          // ISO timestamp
  doc_count: number;
  docs: SearchDoc[];         // flat array
  tokens: {                  // serialized inverted index
    [token: string]: string[]; // token → doc _id list
  };
  concept_groups: {
    [concept: string]: string[];
  };
  // Trie is NOT serialized — rebuilt in O(ms) from tokens at startup
}
```

### 9.4 Runtime search state

```typescript
interface SearchEngine {
  index: InvertedIndex;      // the hot structure
  fuse: Fuse<SearchDoc>;     // for fuzzy fallback
  
  search(query: string): SearchResult[];
}
```

---

## 10. Performance Analysis

### Index build time (Node.js, at build)

| Operation | Complexity | Projected time (2000 docs) |
|---|---|---|
| Read all JSON files | O(F) files | ~50ms |
| Tokenize all fields | O(D × T) | ~20ms |
| Build inverted index | O(D × T) | ~10ms |
| Build trie | O(D × T × L) | ~15ms |
| Serialize to JSON | O(D × F) | ~30ms |
| **Total build** | | **~125ms** |

This runs once at `next build` or when data changes. It is not part of request handling.

### Search latency (browser, per query)

| Pass | Operation | Time estimate |
|---|---|---|
| Query parse + tokenize | O(Q × L) | < 1ms |
| Synonym + concept lookup | O(Q) hash lookup | < 1ms |
| Pass A: token match | O(Q × 1) hash lookups | 1–3ms |
| Pass B: prefix match | O(L) trie traverse | 1–2ms |
| Pass C: Fuse.js fuzzy | O(D) linear scan | 5–15ms |
| Merge + rank | O(R log R) | < 1ms |
| **Total per query** | | **8–22ms** |

This is well within the 100ms threshold for perceived instant response. For keystroke-by-keystroke search (as the user types), a 50ms debounce eliminates redundant queries.

### At scale (500 packages, 300 models, 1000 cheatsheets, 200 workflows)

Estimating average tasks/entries per document:
- Package (avg 8 tasks) × 500 = 4,000 TaskDocs
- Cheatsheet (avg 8 entries) × 1000 = 8,000 CheatsheetEntryDocs
- Model × 300 = 300 ModelDocs
- Workflow (avg 6 steps) × 200 = 200 WorkflowDocs (indexed at workflow level, steps embedded)
- Registry × 200 = 200 RegistryDocs

**Total: ~12,700 documents**

Token cardinality estimate: 12,700 docs × 40 avg tokens = ~500,000 token entries in the inverted index. This is a Map with 500k entries — trivial in modern JavaScript.

Pass A query time at this scale: O(Q) = still sub-millisecond.  
Pass C (Fuse.js) at this scale: 12,700 documents at ~5μs each = ~64ms. This is still acceptable but should be kept as a fallback, not a primary pass.

---

## 11. Memory Analysis

### Index file size

Estimated serialized JSON size:
- 12,700 documents × ~600 bytes avg = ~7.6 MB raw
- After gzip (90% compression typical for repetitive JSON): **~760 KB**

This is loaded once as a static asset and cached by the browser. It fits comfortably in memory.

### Runtime in-memory structures

| Structure | Size estimate |
|---|---|
| `docs` Map (12,700 entries) | ~15 MB |
| `tokenToIds` inverted index (500k token entries × ~30 bytes) | ~15 MB |
| Trie structure | ~20 MB |
| Fuse.js internal index | ~10 MB |
| **Total runtime** | **~60 MB** |

60 MB is within acceptable bounds for a modern browser tab running a developer tool. A user loading AENS has accepted this kind of memory profile (VS Code uses 200MB+ in the browser).

### Optimization options (if needed)

If memory becomes a concern at scale:
1. **Split the index by type** — load TaskDocs only when in a package context, etc. Reduces initial load to ~15 MB.
2. **Token-level compression** — use integer IDs for doc references instead of string `_id`s. Reduces inverted index by ~50%.
3. **Skip the Trie** — use a prefix-filtered Map scan instead. Slower but saves ~20 MB.

---

## 12. Scalability Analysis

### Content growth projections

The proposed architecture is designed to remain unmodified through the projected scale of 500 packages / 300 models / 1000 cheatsheets / 200 workflows and beyond. Here is why each component scales:

**Index builder** — A Node.js script reading JSON files. Adding a new file adds one more iteration to each loop. Time is linear in file count.

**Inverted index** — Hash map lookup is O(1) regardless of index size. Adding 10,000 more documents does not slow queries.

**Fuse.js** — This is the weak point. Fuse.js is O(D) linear scan. At 50,000 documents, it would take ~250ms per query, which is too slow. **Mitigation:** Fuse.js should only be run over a candidate set pre-filtered by Pass A/B, not over all documents. If Pass A returns 200 candidates, Fuse.js runs in 1ms.

**Trie** — O(L) traversal. Adding more tokens does not slow prefix queries, only increases memory slightly.

**Synonym and concept maps** — Static lookups. O(1) after build.

### New content types

Adding a new content type (e.g., "Architecture Patterns") requires:
1. Define a new `Doc` interface extending the base schema
2. Add an extractor function in the index builder
3. Add it as a search result group in the renderer

No changes to the matching or ranking logic.

### New search capabilities

The multi-pass architecture makes new capabilities additive:
- Adding semantic search (vector similarity) = add Pass D
- Adding filter-by-type = add a pre-filter before Pass A
- Adding "recently updated" boost = add a recency multiplier in the ranker

---

## 13. Trade-offs

### Trade-off 1: Build-time index vs. runtime indexing

**Chosen:** Build-time index serialized to static JSON.  
**Alternative:** Build the index in the browser from raw data files on first load.

**Why build-time:**
- Zero user-facing latency for index construction
- Index can be inspected, diffed in Git, and validated before deployment
- Works in a fully static Next.js export
- Any build-time bugs are caught before deployment

**Cost:** Index must be regenerated when data changes. Acceptable because data changes only on `git push`, which already triggers a build.

### Trade-off 2: Custom token matching + Fuse.js vs. replacing Fuse.js entirely

**Chosen:** Hybrid — custom for token/prefix, Fuse.js for fuzzy.  
**Alternative:** Replace Fuse.js with a custom edit-distance implementation.

**Why hybrid:**
- Fuse.js is already in the project and well-tested
- Writing a custom edit-distance search adds maintenance burden with minimal gain
- The fuzzy layer is a fallback for typos, not the primary path — Fuse.js performance is adequate when run on pre-filtered candidates

**Cost:** Two search systems to understand. Mitigated by clear API boundaries.

### Trade-off 3: Granular document-per-block vs. page-level entries

**Chosen:** Block-level (task, cheatsheet entry, workflow step).  
**Alternative:** Page-level with rich embedded fields.

**Why block-level:**
- `np.linalg.inv` is findable directly, not buried in a NumPy page summary
- Users land on the right anchor within a page, not just the page
- Each block can have its own aliases and mental trigger
- Ranking works at the block level, not the page level

**Cost:** ~10× more index documents. Mitigated by the performance analysis in §10 — the system handles this comfortably.

### Trade-off 4: JSON synonym map vs. embedding-based semantic search

**Chosen:** Curated JSON synonym map.  
**Alternative:** Vector embeddings over document content, semantic similarity at query time.

**Why JSON map:**
- No external service, no model to load, no GPU requirement
- Fully local, Git-managed, human-readable
- Zero latency overhead
- For an engineering reference system with stable technical vocabulary, curated synonyms outperform embeddings in precision

**Cost:** Synonyms must be maintained manually. This is acceptable — the technical vocabulary of AI engineering is finite and relatively stable. A new framework does not create a new synonym; it gets added to the concept group when it is added to the data.

---

## 14. Implementation Roadmap

The roadmap is divided into four phases. Each phase is independently deployable and improves search immediately without requiring the next phase.

---

### Phase 1 — Deep indexing (highest impact, 1–2 days)

**Goal:** Fix the core problem — missing nested fields in the index.

**What to build:**

1. Extend `buildSearchIndex()` in `lib/search.ts` to index all task fields from packages:
   - `mental_trigger`, `keywords[]` (extract from `use_when`), `gotchas[]`, `aliases[]` (add field to JSON schema)
   - `syntax` → split into raw syntax string

2. Index all cheatsheet entries individually (not just 4 problem strings):
   - One `SearchResult` per `entry` with `trigger`, `snippet`, `common_bug`, `minimal_notes`

3. Index model fields:
   - `use_when`, `avoid_when`, `problem_types[]`, `key_hyperparams[].name`

4. Index workflow steps:
   - `step_names[]`, `step_tools[]` merged into workflow-level document

5. Update `search-types.ts` to add fields to `SearchResult`:
   ```typescript
   mental_trigger?: string;
   aliases?: string[];
   code_tokens?: string[];
   keywords?: string[];
   ```

6. Update Fuse.js keys to include new fields with appropriate weights.

**Expected outcome:** Searching `np.linalg.inv`, `optimizer`, `cross entropy`, `CUDA out of memory`, `small dataset` all return relevant results.

**Risk:** Low. This is additive to existing code with no architectural change.

---

### Phase 2 — Token matching engine (1–2 days)

**Goal:** Replace Fuse.js as the primary engine with the token-based inverted index. Keep Fuse.js as fuzzy fallback.

**What to build:**

1. **`lib/search/tokenizer.ts`** — Code tokenizer: dot-split, camelCase split, prefix segments, package alias expansion.

2. **`lib/search/index-builder.ts`** — Build-time script that reads all data files, tokenizes fields, and writes `public/search-index.json`.

3. **`lib/search/inverted-index.ts`** — In-memory inverted index built from `search-index.json` at app startup. Exposes `lookup(token: string): string[]`.

4. **`lib/search/engine.ts`** — Multi-pass search: Pass A (token), Pass B (prefix), Pass C (Fuse.js), merge, rank.

5. Wire into existing search hook/component — same interface, drop-in replacement.

**Expected outcome:** `np.linalg.inv`, `linalg`, `inv` all individually find the NumPy linear algebra task. `ada` prefix finds Adam, AdamW, AdaGrad.

---

### Phase 3 — Synonym and concept system (1 day)

**Goal:** Concept searches return all relevant members.

**What to build:**

1. **`data/search/synonyms.json`** — Initial synonym map (start with 30–50 high-value entries: common abbreviations, British/American spellings, concept terms).

2. **`data/search/concept-groups.json`** — Initial concept groups (optimizers, loss functions, tree-based models, embedding models, etc.).

3. Extend `engine.ts` with synonym expansion (Stage 1) and concept lookup (Stage 3) from the pipeline.

**Expected outcome:** `optimizer` → Adam, AdamW, SGD, Lion, RMSProp. `rag` → workflow + all referenced tools. `fft` → NumPy FFT task, PyTorch FFT, SciPy FFT.

---

### Phase 4 — Schema enrichment (ongoing)

**Goal:** Make the JSON data richer to power better search without changing the engine.

**What to add to JSON schemas:**

1. **`aliases[]` field** on every Task, Model, Workflow, CheatsheetEntry:
   ```json
   { "task": "...", "aliases": ["inverse matrix", "solve Ax=b"] }
   ```

2. **`keywords[]` field** on Models — explicit search terms beyond what prose extraction captures.

3. **`concept_groups[]` field** on Models — which groups this model belongs to:
   ```json
   { "id": "xgboost", "concept_groups": ["tree-based", "ensemble", "gradient-boosting", "tabular"] }
   ```

4. **`error_messages[]` field** on CheatsheetEntries — for error-driven search.

5. **`related_packages[]` on Workflows** — explicit cross-references for workflow → package discovery.

This phase is owned by the content team (whoever maintains the JSON files) and can proceed in parallel with Phase 1–3.

---

### Summary timeline

| Phase | Effort | Impact | Risk |
|---|---|---|---|
| 1 — Deep indexing | 1–2 days | High (fixes 80% of failures) | Low |
| 2 — Token engine | 1–2 days | High (makes code search reliable) | Medium |
| 3 — Synonyms | 1 day | Medium (concept search) | Low |
| 4 — Schema enrichment | Ongoing | Compounds over time | Low |

Phases 1 and 2 together resolve every failure case listed in the problem statement. Phases 3 and 4 are quality-of-life improvements that make the system continuously better as content grows.

---

## Appendix A: Alias field additions (starter list)

These aliases are ready to add to existing data files in Phase 4. They represent the highest-value additions based on common search patterns:

**NumPy linear algebra task:**
```json
"aliases": ["matrix inverse", "inverse matrix", "solve Ax=b", "solve linear system",
             "eigenvalues", "SVD", "singular value decomposition", "least squares",
             "matrix multiply", "dot product"]
```

**XGBoost:**
```json
"aliases": ["xgb", "extreme gradient boosting", "gradient boosted trees",
             "gbm", "boosted trees"]
```

**RAG workflow:**
```json
"aliases": ["retrieval augmented generation", "document qa", "document question answering",
             "knowledge base chat", "local llm with documents"]
```

**PyTorch training loop:**
```json
"aliases": ["training loop", "custom training", "backward pass", "gradient update",
             "optimizer step", "zero_grad"]
```

---

## Appendix B: Files to create

```
lib/
  search/
    tokenizer.ts          # Code and prose tokenizer
    inverted-index.ts     # In-memory inverted index
    trie.ts               # Prefix trie
    engine.ts             # Multi-pass search orchestrator
    ranker.ts             # Scoring and ranking
    index-builder.ts      # Build-time index generation script

data/
  search/
    synonyms.json         # Global synonym map
    concept-groups.json   # Concept → member ID map

public/
  search-index.json       # Generated artifact (gitignored or committed)

scripts/
  build-search-index.ts   # CLI: npx ts-node scripts/build-search-index.ts
```

The existing `lib/search.ts` and `lib/search-types.ts` can be refactored incrementally — the new engine exposes the same `search(query: string): SearchResult[]` interface, making the UI layer unchanged.

---

*End of AENS V2 Search Architecture Design*
