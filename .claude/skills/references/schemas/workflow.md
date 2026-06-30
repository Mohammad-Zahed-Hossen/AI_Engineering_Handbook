# Schema Reference — Workflow

**Stability:** Semi-stable (update when `lib/schemas/workflow.ts` changes)
**Loaded by:** Workflow Author, Content Updater, Content Auditor
**Zod source:** `lib/schemas/workflow.ts` + `lib/schemas/meta.ts`

---

## Overview

A Workflow entry documents how to build a complete AI system or pipeline end to end. It is the only content type in AENS that spans multiple libraries, models, and design decisions simultaneously. The unit of organisation is the step — a concrete stage in building the system.

The most valuable parts of a Workflow entry are not the steps themselves. They are the `decision` field within each step and the `failure_points` arrays. Steps describe what to do. Decisions specify what to choose and why. Failure points capture what goes wrong silently and costs hours to debug. An engineer who has built the system before already knows the steps — they come to AENS for the decisions and the failure modes.

A Workflow file is a single JSON object. It lives at:

```
data/workflows/{id}.json
```

---

## Schematic structure

```json
{
  // BaseMeta fields
  "created_at": "YYYY-MM-DD",
  "updated_at": "YYYY-MM-DD",
  "sources": ["https://..."],
  "github_repo": "https://github.com/...",   ← optional

  // Workflow identity
  "id": "kebab-case",
  "name": "Display Name",
  "type": "pipeline | snippet",
  "category": "Inference",
  "overview": "...",
  "starter_stack": ["LangChain", "ChromaDB", "..."],

  // Steps
  "steps": [
    {
      "step": 1,
      "name": "Step Title",
      "what": "What operation is performed.",
      "tools": ["ToolName", "ClassName"],
      "decision": "Concrete choice with baseline value.",
      "uses": {
        "packages": ["package-id"],
        "models": ["model-id"],
        "cheatsheets": ["cheatsheet-id"]
      },
      "failure_points": ["Silent failure description."]
    }
  ],

  // Cross-cutting content
  "common_failure_points": ["..."],

  // Optional
  "evaluation_checks": ["..."],
  "next_links": ["workflow-id"]
}
```

---

## BaseMeta fields

Same rules as Package and Model. Key points:

- `created_at` and `updated_at`: `YYYY-MM-DD` format
- `sources`: minimum 1 valid `https://` URL — plain text fails validation
- `github_repo`: optional; must start with `https://github.com/` if present

For Workflow entries, `sources` typically includes the primary paper introducing the pattern and/or the primary framework's documentation:

```json
"sources": [
  "https://arxiv.org/abs/2005.11401",
  "https://huggingface.co/docs/peft/conceptual_guides/lora"
]
```

Note: `rag.json` has no `github_repo` — that is correct since RAG is a pattern, not a single repository. `fine-tuning-lora.json` links the PEFT repository as its primary implementation reference. Include `github_repo` when one repository represents the canonical implementation.

---

## Identity fields

---

### `id`

**Type:** `string` (Zod: `z.string()`)
**Required:** Yes

Kebab-case. Must match the filename exactly (excluding `.json`).

Use a short noun phrase naming what the workflow builds. Prefer established engineering abbreviations when they are unambiguous:

```json
"id": "rag"                   ← established abbreviation
"id": "fine-tuning-lora"      ← descriptive, hyphenated
"id": "text-classification"   ← noun phrase
"id": "ocr-pipeline"          ← noun phrase with category
```

Do not use imperative forms (`build-rag`, `train-lora`) or question forms. See `05-naming-conventions.md`.

---

### `name`

**Type:** `string` (Zod: `z.string()`)
**Required:** Yes

Official display name with correct casing. Spelled out in full — the `id` carries the abbreviation, the `name` carries the expanded form:

```json
"name": "Retrieval-Augmented Generation"
"name": "LoRA Fine-Tuning Pipeline"
"name": "Text Classification Pipeline"
```

---

### `type`

**Type:** `string` (Zod: `z.enum(['pipeline', 'snippet'])`)
**Required:** Yes

Exactly one of two values:

| Value | When to use |
|---|---|
| `"pipeline"` | Multi-step end-to-end system with 3+ sequential stages. The engineer builds and deploys this. |
| `"snippet"` | A short self-contained recipe that doesn't fit a Package task entry but is more involved than a cheatsheet entry. |

All three current production workflows are `"pipeline"`. Use `"snippet"` for things like: "how to profile a PyTorch training loop," "how to export a model to ONNX," "how to set up a HuggingFace inference endpoint" — real engineering tasks that need more than a code snippet but do not constitute a full system.

---

### `category`

**Type:** `string` (Zod: `z.string()`)
**Required:** Yes

A capitalised string grouping the workflow by domain. This is a free string, not an enum — but use consistent values across entries to support grouping in the UI.

Current values in production:

```json
"category": "Inference"
"category": "Fine-Tuning"
"category": "NLP"
```

Recommended additional values for consistency:

```
"Training"
"Evaluation"
"Data Processing"
"Deployment"
"Vision"
"Speech"
"Multimodal"
```

Always capitalise the first letter. Do not use lowercase, all-caps, or kebab-case here.

---

### `overview`

**Type:** `string` (Zod: `z.string()`)
**Required:** Yes

Two to four sentences. This is the first thing the engineer reads. It must answer two questions before they read any step:

1. What does this workflow build?
2. When should I use this pattern instead of alternatives?

The overview is the only field in the entire entry that may argue for or against using the workflow. Every other field assumes the engineer has already decided to use it.

```json
WRONG: "This workflow shows how to implement RAG using LangChain."
       ← describes what it is, not when to use it

WRONG: "A comprehensive guide to building retrieval-augmented generation systems."
       ← marketing language, no decision content

RIGHT: "RAG retrieves relevant chunks from a local document index and injects them into a prompt to ground LLM answers in your data. Use when the LLM lacks domain knowledge or you need citations."

RIGHT: "Fine-tune a pretrained LLM on a custom dataset using LoRA adapters. Trains less than 1% of parameters, fits on consumer GPUs, and produces a mergeable adapter file. Use when prompt engineering is insufficient and you have labeled domain data."
```

The second sentence of `overview` should typically begin with "Use when..." — it converts the overview from a description into a decision trigger.

---

### `starter_stack`

**Type:** `string[]` (Zod: `z.array(z.string())`)
**Required:** Yes (array — may be `[]` but should have at least 2 entries for a pipeline)

The primary libraries and models an engineer needs before starting this workflow. Plain display names — not IDs, not package names, not version strings.

This is not a requirements.txt. It is the shopping list the engineer scans before deciding whether they have the prerequisites. Include only tools that appear in `steps[].tools` — do not list utilities, monitoring tools, or infrastructure that is not directly involved in the pipeline steps.

```json
"starter_stack": [
  "LangChain",
  "ChromaDB",
  "SentenceTransformers",
  "PyMuPDF",
  "BAAI/bge-large-en-v1.5"
]
```

Model names in `starter_stack` use their official display name or HuggingFace model ID — not the AENS model entry ID. `starter_stack` is a human-readable list, not a cross-reference.

---

## `steps[]`

**Type:** `WorkflowStepSchema[]` (Zod: `z.array(WorkflowStepSchema)`)
**Required:** Yes

The sequential stages of the workflow. Minimum 3 steps for `type: "pipeline"`. Steps may be any length for `type: "snippet"`.

Steps are numbered from 1 with no gaps. The `step` field value must equal the step's 1-based position in the array. Step 1 is at index 0, step 2 at index 1, and so on.

**Step granularity:** One step per engineering decision point. Not one step per function call. Not one step per library. A good step is a stage where the engineer faces a real choice — where chunking strategy is decided, where the embedding model is selected, where LoRA rank is configured.

Too fine: `"name": "Import libraries"` — no decision, no failure point
Too coarse: `"name": "Build the entire pipeline"` — not actionable
Right: `"name": "Ingestion and Chunking"` — one decision, concrete failure modes

---

### `steps[].step`

**Type:** `number` (Zod: `z.number()`)
**Required:** Yes

Integer. Starts at 1. Increments by 1. Must equal the step's position in the array (step at index 0 has `"step": 1`, step at index 1 has `"step": 2`).

```json
WRONG: {"step": 0, ...}        ← zero-indexed
WRONG: {"step": "1", ...}      ← string, not number
RIGHT: {"step": 1, ...}
```

---

### `steps[].name`

**Type:** `string` (Zod: `z.string()`)
**Required:** Yes

Short title identifying this stage. Noun phrase or gerund phrase. Must be unique within the workflow — the engineer uses this to navigate directly to a step.

```json
"name": "Ingestion and Chunking"
"name": "Embedding"
"name": "Vector Storage"
"name": "LoRA Configuration"
"name": "Dataset Preparation"
```

---

### `steps[].what`

**Type:** `string` (Zod: `z.string()`)
**Required:** Yes

One sentence describing the operation performed at this step. Answers: what happens here? Not what to choose — that is `decision`. Not what can go wrong — that is `failure_points`.

`what` and `decision` serve completely different roles. A workflow that conflates them produces steps where the engineer cannot tell the difference between a description and a recommendation.

```json
WRONG: "what": "Choose chunk_size=512 with overlap=10%."
       ← that is a decision, not a description

WRONG: "what": "Define the chunking strategy for your document corpus."
       ← vague, no engineering content

RIGHT: "what": "Parse source documents and split text into overlapping chunks for indexing."
RIGHT: "what": "Encode each text chunk into a dense vector using a sentence embedding model."
RIGHT: "what": "Define rank, alpha, target modules, and dropout for the low-rank adapter."
```

---

### `steps[].tools`

**Type:** `string[]` (Zod: `z.array(z.string())`)
**Required:** Yes (array — may be `[]`)

Specific class names, function names, or model names used at this step. Display names, not import paths or IDs.

```json
"tools": ["PyMuPDF", "LangChain RecursiveCharacterTextSplitter"]
"tools": ["SentenceTransformers", "BAAI/bge-large-en-v1.5"]
"tools": ["LoraConfig", "TaskType"]
"tools": ["SFTTrainer", "TrainingArguments", "DataCollatorForLanguageModeling"]
```

`tools` is the list of specific things the engineer will type in code at this step. It differs from `uses.packages` (which links AENS Package entries) — `tools` names the specific class or model being used, not the package it comes from. Both fields exist because they serve different purposes: `tools` is human-readable context, `uses` is machine-readable cross-links.

---

### `steps[].decision`

**Type:** `string` (Zod: `z.string()`)
**Required:** Yes

The most important field in a step entry. Specifies the concrete engineering choice at this stage — what value to use, what threshold to apply, what model to select, and when to deviate from the baseline.

**A decision without a concrete value, threshold, or model name is not a decision.**

The test: does this field contain at least one number, model name, or measurable condition? If not, it needs to be rewritten.

```json
WRONG: "decision": "Choose an appropriate chunk size for your documents."
       ← advice without content

WRONG: "decision": "Consider the tradeoffs between different embedding models."
       ← describes nothing

WRONG: "decision": "Configure LoRA rank based on your dataset size."
       ← no baseline, no threshold

RIGHT: "decision": "Baseline: chunk_size=512, overlap=10%. Increase overlap to 20% for dense technical text where a fact can span a sentence boundary. Decrease chunk size for Q&A over short structured data."

RIGHT: "decision": "BAAI/bge-large-en-v1.5 for accuracy. Downsize to gte-large or enable ONNX quantization if latency per query exceeds 50ms."

RIGHT: "decision": "r=8, lora_alpha=16 for datasets under 10K samples. r=16-32 for datasets above 50K. Target q_proj and v_proj as baseline. Add k_proj and o_proj for reasoning-heavy tasks. Use lora_dropout=0.05 for small datasets."
```

Every `decision` field should follow this pattern:
1. State the baseline (the safe default the engineer should start with)
2. State when to deviate (the measurable condition that triggers a change)
3. State what to deviate to (the alternative value or model)

---

### `steps[].uses`

**Type:** object with three arrays (Zod: `z.object({packages, models, cheatsheets})`)
**Required:** Yes

Cross-references to AENS content used at this step. All three sub-arrays are required (may be `[]`). Values are plain ID strings — not ContentRef objects, not display names.

```json
"uses": {
  "packages": ["pandas", "numpy"],
  "models": ["gte-large"],
  "cheatsheets": ["numpy-cheatsheet"]
}
```

---

#### `uses.packages`

IDs of Package entries used at this step. Every ID must exist in `data/packages/`.

Only packages that perform a primary function at this step. Not utilities, not packages used at other steps. If `pandas` is imported once at step 1 but does its real work at step 3, it belongs in step 3's `uses.packages`.

```json
"packages": ["pandas"]         ← used for CSV loading at this step
"packages": ["numpy"]          ← used for embedding normalisation at this step
"packages": []                 ← step uses no Package entries
```

---

#### `uses.models`

IDs of Model entries used at this step. Every ID must exist in `data/models/` (any subfolder).

```json
"models": ["gte-large"]               ← embedding model used at this step
"models": ["llama-3-8b"]              ← generation model used at this step
"models": ["cohere-reranker-v3"]      ← reranker used at this step
"models": []                          ← step uses no Model entries
```

---

#### `uses.cheatsheets`

IDs of Cheatsheet entries relevant to this step. Every ID must exist in `data/cheatsheets/`. Maximum 3 per step — only when a cheatsheet directly accelerates the engineer's work at this step.

```json
"cheatsheets": ["numpy-cheatsheet"]       ← vector normalisation code
"cheatsheets": ["transformers"]           ← model loading / tokenizer setup
"cheatsheets": ["pandas-cheatsheet"]      ← data formatting
"cheatsheets": []
```

---

### `steps[].failure_points`

**Type:** `string[]` (Zod: `z.array(z.string())`)
**Required:** Yes (array — minimum 1 entry for any non-trivial step)

The second most important field in a step entry. Describes what goes wrong at this step silently — producing wrong results rather than raised errors.

Each entry must satisfy:
1. Specific to this step, not a generic warning
2. Non-obvious — something that wastes real debugging time
3. Describes the failure, not the prevention (prevention belongs in `decision`)
4. Produces a wrong outcome, not just a raised exception

```json
WRONG: ["Make sure to install all dependencies."]
       ← obvious

WRONG: ["Embedding model may fail to load if not installed."]
       ← an error, not a silent failure

WRONG: ["Be careful with chunk size."]
       ← too vague

RIGHT: [
  "Chunk boundaries split sentences mid-fact — the retriever finds the chunk but the answer is in the adjacent half.",
  "PDF extraction misses tables and inline equations — extract these separately or use a structured PDF parser."
]

RIGHT: [
  "Using a different embedding model at query time than at index time — produces incompatible vector spaces and zero relevant hits.",
  "Embedding model max token length (typically 512) silently truncates long chunks, losing the tail of the text."
]

RIGHT: [
  "Rank too high for dataset size — adapter memorizes training examples and overfits without generalizing.",
  "Wrong target_modules for the model architecture — each model (Llama, Mistral, Gemma) uses different projection names; check model.named_modules() to verify."
]
```

Minimum 1 failure point per step for any step involving external models, file I/O, API calls, or numerical operations. Steps that are purely configuration (e.g. setting up a Python object) may have 0 failure points if there is genuinely no non-obvious silent failure.

---

## `common_failure_points`

**Type:** `string[]` (Zod: `z.array(z.string())`)
**Required:** Yes — minimum 2 entries

Cross-cutting failure modes that are not tied to a single step but can manifest anywhere in the workflow.

These are the failures an engineer only discovers after completing the entire pipeline and finding the end-to-end output is wrong. They typically involve mismatches between steps, version incompatibilities, or assumptions that propagate silently through the pipeline.

```json
RIGHT: [
  "Using a different embedding model at query time than at indexing time, producing incompatible vector spaces and zero relevant hits.",
  "Retrieving outdated document versions because the vector store lacks a versioning or timestamp filter.",
  "Hallucination when the LLM ignores the provided context and falls back on parametric knowledge due to a weakly structured prompt.",
  "Context window overflow because the combined prompt and retrieved chunks exceed the LLM's maximum token limit, causing silent truncation of the system prompt."
]
```

Note that some failures appear in both `steps[].failure_points` and `common_failure_points` — this is intentional. A failure that is both step-specific (occurs at step 2) and cross-cutting (can also manifest at step 4) belongs in both places.

Do not use `common_failure_points` for failures that are clearly step-specific. If a failure obviously belongs at step 3, put it in `steps[2].failure_points`, not here.

---

## `evaluation_checks` ← optional

**Type:** `string[]` (Zod: `z.array(z.string()).optional()`)
**Required:** No — omit entirely if absent

Measurable success criteria the engineer can run to verify the pipeline is working before moving to production. Not test descriptions — actual pass/fail criteria with numbers.

```json
WRONG: ["Test the retrieval system"]
WRONG: ["Make sure results are good"]

RIGHT: [
  "Retrieval precision@5 >= 0.70 on a held-out question set",
  "Answer groundedness: no claims in the answer absent from the retrieved context",
  "End-to-end latency <= 2s for typical 5-chunk retrieval + generation"
]

RIGHT: [
  "Trainable parameters < 1% of total model parameters after PEFT wrapping",
  "Validation loss decreasing or stable through training — not diverging from training loss",
  "Inference output format matches expected chat template on 10 held-out examples before full evaluation"
]
```

Each entry should contain a measurable threshold (`>= 0.70`, `< 1%`, `<= 2s`) or a binary check with clear pass/fail criteria. Include when there are genuine quality gates an engineer should check. Omit entirely (do not include as `[]`) when the workflow has no meaningful intermediate checkpoints.

---

## `next_links` ← optional

**Type:** `string[]` (Zod: `z.array(z.string()).optional()`)
**Required:** No — omit entirely if absent

IDs of Workflow entries the engineer would naturally build or explore after completing this one. Maximum 3. Directed "what comes next" pointers — not a general "related" list.

```json
"next_links": ["fine-tuning-lora", "text-classification"]
"next_links": ["rag", "text-classification"]
```

Every ID must exist in `data/workflows/`. Omit entirely (do not include as `[]`) when there is no natural successor workflow.

The link must represent a genuine workflow progression, not just thematic similarity. `rag` → `fine-tuning-lora` is valid because after building a RAG pipeline an engineer often fine-tunes a retriever or generator. `rag` → `text-classification` is less compelling — include it only if there is a real engineering path from one to the other.

---

## Unknown and non-schema fields

`aliases` appears in `rag.json` — same undocumented pattern observed in Package and Model entries. Not in `WorkflowSchema`. Has no runtime effect. Do not add to new entries.

---

## The `what` vs `decision` distinction — extended guidance

This is the most commonly violated rule in Workflow authoring. The two fields look similar but serve opposite purposes.

| Field | Question it answers | Contains |
|---|---|---|
| `what` | What happens at this step? | Description of the operation |
| `decision` | What should I choose at this step? | Concrete values, thresholds, model names |

An engineer who has built RAG before knows that step 2 is embedding. They do not need `what` to tell them this. They need `decision` to tell them which embedding model, at what batch size, with what latency threshold before switching.

An engineer who has never built RAG needs `what` to understand what step 2 is before they can read the decision.

Both fields earn their place. The failure mode is when authors write a `decision` field that contains only description:

```json
"what": "Encode each text chunk into a dense vector.",
"decision": "Choose an appropriate embedding model and batch size for your use case."
```

Both sentences are descriptions. Neither tells the engineer what to actually do. The corrected version:

```json
"what": "Encode each text chunk into a dense vector using a sentence embedding model.",
"decision": "BAAI/bge-large-en-v1.5 for accuracy. Downsize to gte-large or enable ONNX quantization if latency per query exceeds 50ms."
```

Now `what` describes, `decision` decides.

---

## Common mistakes across all Workflow entries

**1. `decision` fields with no concrete value.**
Any `decision` field that contains no number, model name, or measurable threshold must be rewritten. Advice without content ("consider the tradeoffs") belongs in blog posts, not in AENS.

**2. `failure_points` describing obvious errors.**
"Make sure to install the package" and "import errors may occur" are not failure points. A failure point is a silent wrong result that the engineer will spend hours debugging. Raised exceptions are never failure points — they are visible immediately.

**3. `what` and `decision` containing the same information.**
If `what` says "choose chunk size" and `decision` says "choose chunk size of 512," the `what` field is wrong — it should describe the operation (parsing and splitting), not the parameter choice.

**4. `uses.*` arrays containing IDs that don't exist.**
This is the highest-severity cross-link failure. `uses.packages: ["langchain"]` when there is no `data/packages/langchain.json` creates a broken link that the Link Integrity Auditor must catch. Always verify IDs exist before including them.

**5. `common_failure_points` repeating step-level content word for word.**
`common_failure_points` is for cross-cutting failures — things that span multiple steps or manifest at the end. Copying a `steps[].failure_points` entry verbatim without adding cross-cutting context is redundant. Either rephrase it to show the cross-step manifestation or keep it only in the step-level field.

**6. `overview` describing what the workflow is without saying when to use it.**
Every `overview` must contain a "use when" sentence. A description without a decision trigger is incomplete.

**7. `starter_stack` listing infrastructure rather than the pipeline's primary tools.**
Docker, Kubernetes, cloud providers, monitoring tools, and logging libraries do not belong in `starter_stack`. Only the libraries and models that appear in `steps[].tools`.

---

## Minimal valid Workflow entry

```json
{
  "created_at": "2026-06-29",
  "updated_at": "2026-06-29",
  "sources": ["https://arxiv.org/abs/2005.11401"],
  "id": "example-pipeline",
  "name": "Example Pipeline",
  "type": "pipeline",
  "category": "Inference",
  "overview": "One sentence describing what this builds. Use when the engineer has X problem and Y conditions are true.",
  "starter_stack": ["PrimaryLibrary", "ModelName"],
  "steps": [
    {
      "step": 1,
      "name": "First Stage",
      "what": "One sentence describing the operation performed at this stage.",
      "tools": ["SpecificClassName", "SpecificFunctionName"],
      "decision": "Baseline: param=value. Increase to X when condition Y. Decrease to Z when condition W.",
      "uses": {
        "packages": [],
        "models": [],
        "cheatsheets": []
      },
      "failure_points": [
        "A specific non-obvious silent failure that produces a wrong result at this step."
      ]
    },
    {
      "step": 2,
      "name": "Second Stage",
      "what": "One sentence describing the operation at this stage.",
      "tools": ["AnotherClassName"],
      "decision": "ModelName for use case A. Switch to AlternativeModel if latency exceeds Xms.",
      "uses": {
        "packages": ["existing-package-id"],
        "models": ["existing-model-id"],
        "cheatsheets": []
      },
      "failure_points": [
        "A cross-stage failure: if step 1 used format A and step 2 expects format B, the mismatch produces wrong outputs silently."
      ]
    },
    {
      "step": 3,
      "name": "Third Stage",
      "what": "One sentence describing the final operation.",
      "tools": ["OutputClassName"],
      "decision": "Limit output to N items. Increase to M only when condition X is verified.",
      "uses": {
        "packages": [],
        "models": [],
        "cheatsheets": []
      },
      "failure_points": [
        "A configuration mismatch that only manifests after all three steps run — not detectable by inspecting any single step."
      ]
    }
  ],
  "common_failure_points": [
    "A cross-cutting failure that can manifest at any step in the pipeline.",
    "A configuration mismatch between steps that only becomes visible in the final output."
  ]
}
```
