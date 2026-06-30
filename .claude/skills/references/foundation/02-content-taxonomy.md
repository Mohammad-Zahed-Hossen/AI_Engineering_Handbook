# 02 — Content Taxonomy

**Stability:** Foundation (changes only when a new content type is added to AENS)
**Loaded by:** All author skills, Architecture Advisor, Content Auditor

---

## The five content types

AENS contains exactly five content types. Nothing else belongs.

| Type | File location | Primary question answered |
|---|---|---|
| Package | `data/packages/{id}.json` | How do I perform this task with this library? |
| Model | `data/models/{ml\|dl\|llm}/{id}.json` | Which model should I choose for this problem? |
| Workflow | `data/workflows/{id}.json` | How do I build this kind of system end to end? |
| Cheatsheet | `data/cheatsheets/{id}.json` | What is the exact syntax for this specific operation? |
| Registry | `data/registry/{task}s.json` | Which model ID and config should I use for this task? |

**Source of truth for schemas:** `lib/schemas/*.ts` (Zod). When this document conflicts with a Zod schema, the Zod schema wins. Update this document to match — do not patch the schema to match this document.

---

## Content type decision tree

When a request arrives, walk this tree in order. The first match wins.

```
Does this involve a specific Python library or framework?
└── YES → Does the engineer need to remember task-level syntax and decisions?
    ├── YES → PACKAGE
    └── NO, just quick syntax lookup → CHEATSHEET

Is this about choosing between AI/ML models or architectures?
└── YES → Does it involve a concrete deployable model with a HuggingFace or vendor ID?
    ├── YES → REGISTRY (specific deployment config) + possibly MODEL (architecture understanding)
    └── NO, it's an algorithm/architecture family → MODEL

Does this describe how to build a multi-step AI system?
└── YES → WORKFLOW

Does none of the above fit?
└── It probably does not belong in AENS. Refer to 01-project-philosophy.md.
```

---

## Package

**Purpose:** Task-based implementation reference for a Python library.

**The key insight:** Tasks are more important than functions. Engineers remember problems ("I need to reshape an array for CNN input"), not API names ("np.expand_dims"). Every entry is organized around the engineering task, not around the library's API structure.

**When to create a Package entry:**
- The library is used directly in AI engineering workflows
- The engineer will return to it repeatedly during projects
- It has non-obvious parameters, gotchas, or decision points worth capturing

**When NOT to create a Package entry:**
- The library is trivial to use and fully self-documenting
- Usage is fully covered inside a Workflow's `uses.packages` field
- It's a utility the engineer uses once

**Structure (authoritative — from `lib/schemas/package.ts`):**

```
Package
├── id              kebab-case, matches filename
├── name            official display name
├── version         X.Y.Z, no "v" prefix
├── install         raw pip/conda command, no markdown
├── import_as       canonical import statement, no markdown
├── summary         ≤150 chars, what it does in one sentence
├── tasks[]         one entry per engineering task (see below)
│   ├── task             what the engineer is trying to do
│   ├── mental_trigger   "I need to..." — first-person engineering thought
│   ├── syntax           function signature(s), not concrete examples
│   ├── important_params max 5 entries, only the ones that matter in practice
│   ├── example          raw Python code, no imports, no markdown fencing
│   ├── use_when         concise rule with technical parameters
│   ├── avoid_when       concise rule with technical parameters
│   ├── decision_notes   the non-obvious engineering decision for this task
│   ├── gotchas[]        non-obvious silent failures only
│   ├── official_docs    direct function/method URL, not homepage
│   ├── related_workflows[]   existing workflow IDs that use this task
│   └── related_cheatsheets[] existing cheatsheet IDs covering this task
└── alternatives[]  ContentRef[] — { id, type } pairs
```

**Relationship to Cheatsheet:** A Package entry explains *how and when*. A Cheatsheet entry is emergency recall — the minimum needed to reconstruct the call in a live coding session. They cover the same operations but at different depth. Do not duplicate decision_notes or gotchas inside a Cheatsheet.

---

## Model

**Purpose:** Decision reference for a model architecture or algorithm family.

**The key insight:** The question this answers is "should I use this model for my problem?" — not "how does this model work internally?" Architecture explanations belong in papers. Comparative decision rules belong here.

**When to create a Model entry:**
- It's a named algorithm family (Random Forest, BERT, YOLO) or a specific hosted model where architecture understanding aids selection
- The selection decision involves non-obvious tradeoffs: speed vs. accuracy, memory constraints, interpretability requirements, problem type fit
- There are real alternatives to compare against

**When NOT to create a Model entry:**
- The model is a one-off fine-tune with no architecture novelty — use Registry instead
- The decision is purely about which checkpoint to load — use Registry instead
- You just need a quick-start snippet — the `quick_start` field covers this; no need for a separate entry

**Model categories (strict enum — `lib/schemas/model.ts`):**

| Category | Folder | Covers |
|---|---|---|
| `ml` | `data/models/ml/` | Classical ML: Random Forest, SVM, XGBoost, linear models, clustering |
| `dl` | `data/models/dl/` | Deep learning architectures: CNNs, RNNs, Transformers, diffusion models |
| `llm` | `data/models/llm/` | Large language and embedding models: GPT, LLaMA, BERT, BGE, Whisper |

The `category` value must match the subfolder. A model in `data/models/ml/` must have `"category": "ml"`.

**Problem types (strict 7-value enum — never invent new values):**

`classification` · `regression` · `clustering` · `generation` · `embedding` · `detection` · `segmentation`

If a model's task doesn't fit these seven, map to the closest one and note the mapping in `decision_notes`.

**Structure (authoritative — from `lib/schemas/model.ts`):**

```
Model
├── id                  kebab-case, matches filename
├── name                display name
├── category            ml | dl | llm (matches subfolder)
├── problem_types[]     subset of the 7-value enum above
├── summary             1-2 sentences on core mechanic
├── use_when            concise rule with measurable thresholds
├── avoid_when          concise rule with measurable thresholds
├── pros[]              specific technical advantages, not marketing claims
├── cons[]              specific technical disadvantages
├── key_hyperparams[]
│   ├── name    parameter name as used in the framework
│   ├── default string | number | null (never a description string)
│   └── note    tuning guidance
├── training_speed      fast | medium | slow
├── inference_speed     fast | medium | slow
├── memory_usage        low | medium | high
├── interpretability    high | medium | low
├── quick_start         raw Python code, no markdown fencing
├── alternatives[]      ContentRef[] — other models to consider
├── related_workflows[] workflow IDs that use this model
├── decision_notes      (optional) why to pick this over alternatives
└── competitors[]       (optional) ContentRef[] — close alternatives
```

---

## Workflow

**Purpose:** Step-by-step map for building a complete AI system or pipeline.

**The key insight:** The most valuable part of a workflow entry is not the happy path — it's `failure_points` and `common_failure_points`. These capture the non-obvious breakdowns that waste hours. The step structure is a navigation scaffold; the failure points are the actual engineering value.

**When to create a Workflow entry:**
- The system involves 3+ sequential stages with real decision points at each stage
- The combination of tools, models, and architectural choices is non-trivial
- There are known failure patterns that aren't obvious until you've built it before

**When NOT to create a Workflow entry:**
- It's a single function call or code snippet — use a Package task entry instead
- It's purely theoretical with no concrete tool choices — it's a concept, not a workflow
- It duplicates an existing workflow with only minor variations — extend the existing entry

**Workflow types (strict 2-value enum):**

| Type | Use when |
|---|---|
| `pipeline` | Multi-step end-to-end system (RAG, fine-tuning, evaluation pipeline) |
| `snippet` | Short self-contained recipe that doesn't fit a Package entry |

**Structure (authoritative — from `lib/schemas/workflow.ts`):**

```
Workflow
├── id                      kebab-case, matches filename
├── name                    descriptive title
├── type                    pipeline | snippet
├── category                Capitalized string (e.g. "Inference", "Training")
├── overview                what this workflow builds and when to use it
├── starter_stack[]         recommended libraries and models for this workflow
├── steps[]                 1-indexed, sequential
│   ├── step                integer starting at 1
│   ├── name                step title
│   ├── what                what operation is performed at this step
│   ├── tools[]             specific packages/classes used at this step
│   ├── decision            the design decision to make here, with concrete baselines
│   ├── uses
│   │   ├── packages[]      package IDs used at this step
│   │   ├── models[]        model IDs used at this step
│   │   └── cheatsheets[]   cheatsheet IDs relevant to this step
│   └── failure_points[]    concrete failure scenarios at this step
├── common_failure_points[] cross-cutting failures not tied to one step
├── evaluation_checks[]     (optional) measurable success criteria
└── next_links[]            (optional) related workflow IDs to explore after this one
```

**The `decision` field is critical.** It must contain a concrete engineering decision with a baseline value, not a description of what the step does. "Choose chunk size" is a description. "Baseline: chunk_size=512, overlap=10%; increase overlap to 20% for dense technical prose" is a decision.

---

## Cheatsheet

**Purpose:** Emergency syntax lookup during active coding. Minimum information to reconstruct a working call without leaving the editor.

**The key insight:** A Cheatsheet entry answers "what was that call again?" at the moment you've forgotten it mid-coding session. It is not a tutorial. It is not a Package reference. It is the smallest possible working example for one specific problem.

**When to create a Cheatsheet entry:**
- The syntax is genuinely easy to forget even when you know the library well
- The operation has a common silent bug worth flagging at lookup time
- The engineer will look this up repeatedly during projects

**When NOT to create a Cheatsheet entry:**
- The operation is so simple that looking it up takes more time than typing it (e.g., `len(arr)`)
- The content duplicates a Package task entry exactly — the Cheatsheet must be leaner
- There is no common bug or non-obvious element — just a function call

**Structure (authoritative — from `lib/schemas/cheatsheet.ts`):**

```
Cheatsheet
├── id          kebab-case, matches filename (e.g. "numpy-cheatsheet")
├── name        display title
└── entries[]
    ├── problem       the engineering problem being solved (one line)
    ├── trigger       the exact situation that sends the engineer here
    ├── snippet       raw runnable Python, no imports, no markdown fencing
    ├── minimal_notes the single most critical thing to remember (one sentence)
    ├── common_bug    a real non-obvious silent failure for this operation
    └── docs_url      direct function documentation URL (not homepage)
```

**Relationship to Package:** A Package `task` entry explains the full context — when to use it, parameters, decision notes. A Cheatsheet `entry` is the condensed recall card — just the snippet and the one thing most likely to go wrong. They can cover the same operation at different depths. If they conflict, the Package entry is authoritative.

---

## Registry

**Purpose:** Lookup table for concrete deployable model IDs and their minimal metadata.

**The key insight:** Registry answers a different question than Model. Model says "use an embedding model for this problem." Registry says "specifically use `BAAI/bge-large-en-v1.5`, which is 1340 MB, and here's the link to its details." Registry entries are deployment coordinates, not architecture discussions.

**When to create a Registry entry:**
- You have a specific deployable model with a concrete ID (HuggingFace, API endpoint)
- You want it to appear in the task-specific comparison table
- Size and task classification matter for selection

**When NOT to create a Registry entry:**
- You want to discuss the model's architecture or tradeoffs — use a Model entry
- The model doesn't have a concrete deployable ID yet

**Registry tasks (strict 7-value enum — file names are pluralised):**

| Task value | File | Covers |
|---|---|---|
| `embedding` | `data/registry/embeddings.json` | Text embedding models |
| `reranker` | `data/registry/rerankers.json` | Reranking models |
| `vision` | `data/registry/vision.json` | Vision and image models |
| `speech` | `data/registry/speech.json` | Speech-to-text / TTS models |
| `llm` | `data/registry/llms.json` | Large language models |
| `multimodal` | `data/registry/multimodal.json` | Multimodal models |
| `ocr` | `data/registry/ocr.json` | OCR models |

**Critical:** The `task` field value is singular (`"embedding"`) but the filename is plural (`embeddings.json`). Never pluralise the task enum value.

**Structure (authoritative — from `lib/schemas/registry.ts`):**

```
RegistryModel
├── id       kebab-case identifier
├── task     one of the 7 enum values above (singular)
├── size_mb  number (megabytes, not gigabytes, not a string)
└── link     string path to model detail page, OR MissingModelRef
```

**MissingModelRef** (when the model page doesn't exist yet):
```json
{ "type": "missing", "id": "some-model-id", "reason": "not yet added" }
```

Registry entries are appended to an existing array file. They do not create new files.

---

## ContentRef — cross-linking format

When any content type references another content item, use `ContentRef`:

```json
{ "id": "rag", "type": "workflow" }
{ "id": "numpy", "type": "package" }
{ "id": "random-forest", "type": "model" }
{ "id": "numpy-cheatsheet", "type": "cheatsheet" }
```

Valid `type` values: `model` · `package` · `workflow` · `cheatsheet` · `registry`

Never reference an ID that does not exist in `data/`. An invalid cross-link is worse than no cross-link.

---

## ID format rules

All IDs follow the same rule across all content types:

- Kebab-case only: `^[a-z0-9][a-z0-9-]*[a-z0-9]$`
- No underscores, no uppercase, no spaces
- Must match the filename exactly (excluding `.json`)
- Examples: `random-forest`, `numpy-cheatsheet`, `bge-large-en-v1-5`, `rag`

The `name` field holds the properly cased display name (e.g., `"NumPy"`, `"Random Forest"`). The `id` is always lowercase kebab.

---

## When something doesn't fit

If a request doesn't map cleanly to one of the five types, apply these rules in order:

1. **It's a concept or theory** (how transformers work, what attention is) → Does not belong. LLMs explain this better on demand.
2. **It's a blog post, tutorial, or course note** → Does not belong. Store the official docs URL inside a relevant Package or Model entry instead.
3. **It's a tool comparison without implementation details** → Belongs as `alternatives[]` inside an existing entry, not as a standalone entry.
4. **It's a new content type that genuinely has no home** → Raise it as an architecture decision before creating anything. Do not invent a sixth content type without deliberate review.
