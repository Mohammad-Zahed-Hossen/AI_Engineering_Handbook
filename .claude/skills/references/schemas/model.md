# Schema Reference — Model

**Stability:** Semi-stable (update when `lib/schemas/model.ts` changes)
**Loaded by:** Model Author, Content Updater, Content Auditor
**Zod source:** `lib/schemas/model.ts` + `lib/schemas/meta.ts`

---

## Overview

A Model entry documents an AI/ML model architecture, algorithm family, or specific hosted model. The question it answers is: **should I use this model for my problem?** — not how it works internally. Architecture explanations belong in papers. Comparative decision rules belong here.

A Model file is a single JSON object. It lives at:

```
data/models/{category}/{id}.json
```

Where `{category}` is exactly one of: `ml` `dl` `llm` — and must match the `category` field inside the file.

---

## Schematic structure

```json
{
  // BaseMeta fields
  "created_at": "YYYY-MM-DD",
  "updated_at": "YYYY-MM-DD",
  "sources": ["https://..."],
  "github_repo": "https://github.com/...",   ← optional

  // Model identity
  "id": "kebab-case",
  "name": "Display Name",
  "category": "ml | dl | llm",
  "problem_types": ["classification", ...],
  "summary": "...",

  // Selection guidance
  "use_when": "...",
  "avoid_when": "...",
  "pros": ["...", "..."],
  "cons": ["...", "..."],

  // Configuration
  "key_hyperparams": [{ "name": "...", "default": ..., "note": "..." }],
  "training_speed": "fast | medium | slow",
  "inference_speed": "fast | medium | slow",
  "memory_usage": "low | medium | high",
  "interpretability": "high | medium | low",

  // Usage
  "quick_start": "raw Python code",
  "alternatives": [{ "id": "...", "type": "..." }],
  "related_workflows": ["workflow-id"],

  // Optional
  "decision_notes": "...",
  "competitors": [{ "id": "...", "type": "..." }]
}
```

---

## BaseMeta fields

Same rules as Package. See `schemas/package.md` BaseMeta section for full detail. Key points:

- `created_at` and `updated_at`: `YYYY-MM-DD`, no timestamps
- `sources`: minimum 1 valid `https://` URL — plain text strings fail validation
- `github_repo`: optional, must start with `https://github.com/` if present, omit entirely if absent

For Model entries, `sources` should include the model card URL and/or the original paper URL. Both are acceptable and encouraged:

```json
"sources": [
  "https://huggingface.co/meta-llama/Meta-Llama-3-8B-Instruct",
  "https://arxiv.org/abs/2407.21783"
]
```

---

## Identity fields

---

### `id`

**Type:** `string` (Zod: `z.string()`)
**Required:** Yes

Kebab-case. Must match the filename exactly (excluding `.json`). Regex: `^[a-z0-9][a-z0-9-]*[a-z0-9]$`.

For architecture families, use the architecture name. For specific model checkpoints with version significance, include the version:

```json
"id": "random-forest"       ← architecture family
"id": "xgboost"             ← named algorithm
"id": "llama-3-8b"          ← specific checkpoint where size is architecturally significant
"id": "gte-large"           ← specific model name
"id": "whisper-large-v3"    ← version matters (v3 has different architecture than v2)
```

Do not include patch versions (`llama-3-8b-1-0`), author prefixes (`meta-llama-3-8b`), or quantization formats (`llama-3-8b-q4`). See `05-naming-conventions.md`.

---

### `name`

**Type:** `string` (Zod: `z.string()`)
**Required:** Yes

Official display name with correct casing. Verify against the model card, official paper title, or vendor documentation.

```json
"name": "Random Forest"
"name": "XGBoost"
"name": "GTE Large"
"name": "Llama 3 8B"
"name": "Whisper Large v3"
```

---

### `category`

**Type:** `string` (Zod: `z.enum(['ml', 'dl', 'llm'])`)
**Required:** Yes

Exactly one of three values. Must match the subfolder the file lives in.

| Value | Subfolder | Covers |
|---|---|---|
| `"ml"` | `data/models/ml/` | Classical ML: Random Forest, SVM, XGBoost, LightGBM, KNN, linear models, clustering algorithms |
| `"dl"` | `data/models/dl/` | Deep learning architectures: CNNs, RNNs, vanilla Transformers, diffusion models, graph neural nets |
| `"llm"` | `data/models/llm/` | Large language models, embedding models, speech models, multimodal models: GPT, LLaMA, BERT, BGE, Whisper, CLIP |

The file path and the `category` field must agree. A file at `data/models/ml/xgboost.json` with `"category": "dl"` is a validation-passing but semantically broken entry — the UI router uses the folder, not the field.

When a model is ambiguous (e.g. a shallow neural network), choose the folder that best reflects how an AI engineer would look for it: someone searching for a BERT-based embedding model looks in `llm`, not `dl`.

---

### `problem_types`

**Type:** `string[]` (Zod: `z.array(ProblemTypeSchema)`)
**Required:** Yes — minimum 1

Array of problem types this model addresses. Every value must be from the strict 7-value enum:

```
"classification"
"regression"
"clustering"
"generation"
"embedding"
"detection"
"segmentation"
```

No other values are accepted. Zod will reject anything outside this set.

A model may have multiple problem types:

```json
"problem_types": ["classification", "regression"]   ← Random Forest
"problem_types": ["embedding"]                       ← GTE Large
"problem_types": ["generation"]                      ← Llama 3 8B
"problem_types": ["detection", "segmentation"]       ← YOLO-style models
```

**Mapping guidance** when the task doesn't fit neatly:

- Reranking → `"classification"` (scores a pair as relevant/not-relevant)
- Named entity recognition → `"classification"` (per-token classification)
- Text-to-image → `"generation"`
- Summarisation / translation → `"generation"`
- Anomaly detection → `"classification"` (binary: normal / anomalous)
- Dimensionality reduction (PCA, UMAP) → `"embedding"`

If a mapping is non-obvious, note it in `decision_notes`.

---

### `summary`

**Type:** `string` (Zod: `z.string()`)
**Required:** Yes

Two to three sentences maximum. Describes the core mechanism and the primary differentiator — not a feature list.

The summary answers: what makes this model distinct from others in its category? An engineer who reads only the summary should understand whether to keep reading.

```json
WRONG: "A powerful and versatile machine learning model for classification and regression tasks."

RIGHT: "Ensemble of decision trees trained on bootstrap samples and random feature subsets. Reduces variance and overfitting by averaging individual tree estimators."

WRONG: "GTE Large is a large text embedding model that is very good."

RIGHT: "GTE Large is Alibaba's General Text Embeddings large model, producing 1024-dimensional dense vectors trained on a large-scale corpus of relevance pairs. Achieves strong performance on the MTEB benchmark and is fully open-weight, allowing self-hosted deployment without API dependencies."
```

Do not state the number of parameters unless it is directly relevant to the deployment decision (as with LLMs where parameter count determines VRAM requirements). Do not use marketing language.

---

## Selection guidance fields

---

### `use_when`

**Type:** `string` (Zod: `z.string()`)
**Required:** Yes

One to three sentences. Concrete technical conditions where this model is the right choice. Must contain measurable thresholds, specific problem characteristics, or named deployment constraints.

Generic conditions ("when you need good accuracy") carry no information. Specific conditions ("tabular datasets with heterogeneous features where L1/L2 regularization is critical") give the engineer a clear match criterion.

```json
WRONG: "use_when": "When you need a good model for tabular data."

RIGHT: "use_when": "Tabular datasets. High-cardinality feature sets requiring automated importances. Serves as a robust non-linear baseline."

WRONG: "use_when": "When deploying embedding models."

RIGHT: "use_when": "Self-hosted semantic search and retrieval-augmented generation pipelines where data privacy prohibits API usage. Fine-tuning on domain-specific corpora using contrastive learning on labeled relevance pairs."
```

---

### `avoid_when`

**Type:** `string` (Zod: `z.string()`)
**Required:** Yes

When not to use this model. Must name a specific alternative or quantified constraint, not just a general condition.

```json
WRONG: "avoid_when": "When speed is important."

RIGHT: "avoid_when": "High-dimensional sparse data like text tf-idf or pixel images. Low latency production requirements. Massive scaling where LightGBM/XGBoost are faster."

WRONG: "avoid_when": "When you need better performance."

RIGHT: "avoid_when": "Applications requiring cutting-edge MTEB performance where OpenAI's text-embedding-3-large or Cohere models hold the top positions. Environments where GPU inference is unavailable and CPU embedding of long documents becomes a bottleneck."
```

---

### `pros`

**Type:** `string[]` (Zod: `z.array(z.string())`)
**Required:** Yes — minimum 2

Specific technical advantages. Each entry must describe something true about this model that is not generically true of all models in its category.

The summary test applies directly: "Could this pro be written unchanged about a different model?" If yes, it is not a pro — it is filler.

```json
WRONG: ["Good performance", "Easy to use", "Well-supported"]

RIGHT: [
  "Resilient to scaling issues, no normalization required",
  "Handles missing values and categorical data structures natively",
  "Outputs impurity-based or permutation-based feature importances",
  "Reduced overfitting risk relative to individual decision trees"
]

WRONG: ["Strong benchmark performance", "Open source"]

RIGHT: [
  "Fully open weights enabling self-hosted deployment, fine-tuning, and complete control over inference infrastructure and data privacy",
  "1024-dimensional output strikes a balance between representational quality and vector database storage efficiency",
  "Native SentenceTransformers compatibility simplifies integration with existing RAG pipelines, ChromaDB, and FAISS indexing workflows"
]
```

---

### `cons`

**Type:** `string[]` (Zod: `z.array(z.string())`)
**Required:** Yes — minimum 2

Specific technical disadvantages with measurable impact where possible. Same standard as `pros` — no generic cons that apply to all models of this type.

```json
WRONG: ["Can be slow", "Hard to tune", "Requires data"]

RIGHT: [
  "Slow real-time inference due to traversing multiple deep trees",
  "High VRAM/RAM footprint for large number of estimators",
  "Lacks extrapolation capabilities beyond the training range boundaries"
]

RIGHT: [
  "Requires 16GB+ VRAM for full-precision inference or careful quantization to run on consumer hardware",
  "Struggles with complex mathematical reasoning and long-horizon planning compared to frontier models like GPT-4 and Claude 3",
  "Meta's commercial license has usage restrictions for organizations exceeding 700 million monthly active users"
]
```

---

## `key_hyperparams[]`

**Type:** `HyperParameterSchema[]` (Zod: `z.array(HyperParameterSchema)`)
**Required:** Yes (array — may be `[]` for models with no meaningful hyperparameters, but at minimum 2 entries for any trainable or configurable model)

The 2–5 hyperparameters that most affect performance in practice and are most likely to need tuning. Not every configurable parameter — the ones that matter.

Each entry is an object with three fields:

---

### `key_hyperparams[].name`

**Type:** `string`
**Required:** Yes

The parameter name exactly as used in the framework — matching case, spelling, and underscores. This is what the engineer types.

```json
"name": "n_estimators"       ← scikit-learn exact name
"name": "learning_rate"      ← XGBoost exact name
"name": "normalize_embeddings"
"name": "temperature"
```

---

### `key_hyperparams[].default`

**Type:** `string | number | null` (Zod: `z.union([z.string(), z.number(), z.null()])`)
**Required:** Yes

The framework's actual default value. Three valid types:

- **`number`** when the default is a numeric value: `100`, `0.3`, `6`, `1`
- **`string`** when the default is a string option: `"sqrt"`, `"auto"`, `"true"`, `"gzip"`
- **`null`** when the framework default is `None` / null / no default

```json
{"name": "n_estimators",  "default": 100,    "note": "..."}   ← number
{"name": "max_features",  "default": "sqrt", "note": "..."}   ← string
{"name": "max_depth",     "default": null,   "note": "..."}   ← None in Python
{"name": "temperature",   "default": 0.6,    "note": "..."}   ← number
```

**Critical:** Never put a description in `default`. The field must be the actual value, not an explanation of it:

```json
WRONG: {"name": "n_estimators", "default": "100 trees by default"}
WRONG: {"name": "max_depth",    "default": "No limit by default"}
RIGHT: {"name": "n_estimators", "default": 100}
RIGHT: {"name": "max_depth",    "default": null}
```

The `note` field is where descriptions and tuning guidance go. `default` is a value only.

Verify defaults from the current library documentation or source code — they change between major versions. `n_estimators` changed from 10 to 100 in scikit-learn 0.22. Do not use a value from memory.

---

### `key_hyperparams[].note`

**Type:** `string`
**Required:** Yes

One to two sentences of tuning guidance. Answers: what does this parameter control, what is the typical production range, and when would I change it from the default?

```json
WRONG: "note": "Number of trees."
WRONG: "note": "Controls the number of estimators in the ensemble."
RIGHT: "note": "Number of trees in forest. Scales linearly with training/inference latency. Usually stable at 200-500."

WRONG: "note": "Learning rate parameter."
RIGHT: "note": "Shrinkage factor applied to each new tree's contribution. Lower to 0.01-0.1 and increase n_estimators proportionally for better generalization and smoother convergence."
```

Include a concrete range where helpful (`0.01-0.1`, `200-500`, `8-15`). An abstract note without a range forces the engineer back to documentation.

---

## Rating fields

Four fields that characterise the model's resource and interpretability profile. All are required. All use strict enums.

---

### `training_speed`

**Type:** `string` (Zod: `z.enum(['fast', 'medium', 'slow'])`)
**Required:** Yes

Time to train to convergence on a typical dataset for this model's category.

| Value | Rough interpretation |
|---|---|
| `"fast"` | Minutes on CPU; seconds on GPU |
| `"medium"` | Hours on CPU; minutes on GPU |
| `"slow"` | Days on GPU; impractical on CPU |

Rate relative to peers in the same category and problem type. A model that takes 2 hours to train is `"fast"` for an LLM fine-tune but `"slow"` for a Random Forest on 10k rows.

For models that are not trained by the user (pre-trained only), rate the time required to fine-tune on a representative dataset.

---

### `inference_speed`

**Type:** `string` (Zod: `z.enum(['fast', 'medium', 'slow'])`)
**Required:** Yes

Latency for a single forward pass or prediction at typical batch sizes, relative to peers.

| Value | Rough interpretation |
|---|---|
| `"fast"` | Sub-10ms per batch on appropriate hardware |
| `"medium"` | 10-100ms per batch |
| `"slow"` | 100ms+ per sample; noticeable latency in interactive applications |

---

### `memory_usage`

**Type:** `string` (Zod: `z.enum(['low', 'medium', 'high'])`)
**Required:** Yes

RAM or VRAM required to run inference, relative to peers in the same category.

| Value | Rough interpretation |
|---|---|
| `"low"` | Fits on CPU RAM or ≤4GB VRAM |
| `"medium"` | 4-16GB VRAM or significant CPU RAM |
| `"high"` | 16GB+ VRAM; multiple GPUs for full-precision |

---

### `interpretability`

**Type:** `string` (Zod: `z.enum(['high', 'medium', 'low'])`)
**Required:** Yes

How easily the model's predictions can be explained to a non-technical stakeholder or audited by an engineer.

| Value | Examples |
|---|---|
| `"high"` | Decision trees, linear models, rule-based systems — predictions follow traceable logic |
| `"medium"` | Random Forest with feature importances, XGBoost with SHAP — explanations are approximate |
| `"low"` | Deep neural networks, LLMs, embedding models — internal representations are opaque |

---

## `quick_start`

**Type:** `string` (Zod: `z.string()`)
**Required:** Yes

Raw multi-line Python code showing the minimal working pattern: import, load/initialise, fit or encode, predict or generate. No markdown fencing. Uses `\n` for line breaks.

Must show:
1. The import statement
2. Model initialisation with the most important non-default parameters shown
3. A fit/encode/generate call with realistic variable names
4. The output or a comment showing output shape

```json
RIGHT:
"quick_start": "from sklearn.ensemble import RandomForestClassifier\n\nclf = RandomForestClassifier(\n    n_estimators=200,\n    max_depth=12,\n    max_features='sqrt',\n    min_samples_leaf=2,\n    random_state=42,\n    n_jobs=-1\n)\nclf.fit(X_train, y_train)\nimportances = clf.feature_importances_"

RIGHT:
"quick_start": "from sentence_transformers import SentenceTransformer\n\nmodel = SentenceTransformer('thenlper/gte-large')\n\nsentences = [\n    'This is an example sentence',\n    'Each sentence is converted to an embedding'\n]\nembeddings = model.encode(sentences, normalize_embeddings=True, batch_size=32)\nprint(embeddings.shape)  # (2, 1024)"
```

Show production-ready parameter choices, not default everything. An engineer copying `quick_start` should get something that works well out of the box, not something that requires immediate tuning to be useful.

No markdown fencing — this is the same rule as Package `example`. No ```` ```python ```` wrapper.

---

## `alternatives[]`

**Type:** `ContentRefSchema[]` (Zod: `z.array(ContentRefSchema)`)
**Required:** Yes (array — may be `[]`)

Other models or approaches an engineer would consider instead. Uses ContentRef objects: `{"id": "...", "type": "..."}`.

`alternatives[]` is the broader set — different approaches to the same problem class.
`competitors[]` is the narrower set — direct head-to-head substitutes in the same architecture family.

**Do not duplicate between `alternatives[]` and `competitors[]`.** If an entry appears in `competitors[]`, it does not also belong in `alternatives[]`. The current `random-forest.json` violates this rule — all four competitors appear in both arrays. This is redundant and creates noise for the engineer.

The correct pattern:

```json
"alternatives": [
  {"id": "xgboost",  "type": "model"},
  {"id": "lightgbm", "type": "model"}
],
"competitors": [
  {"id": "extra-trees-classifier",        "type": "model"},
  {"id": "gradient-boosting-classifier",  "type": "model"}
]
```

Where `alternatives` covers the broader "consider these instead" set and `competitors` covers the "these do exactly the same thing, here is the tradeoff" set.

Maximum 5 entries in `alternatives[]`. Every ID must exist in `data/models/`.

---

## `related_workflows[]`

**Type:** `string[]` (Zod: `z.array(z.string())`)
**Required:** Yes (array — may be `[]`)

IDs of Workflow entries that use this model. Plain string IDs — not ContentRef objects.

Only workflows that use this model at a specific step. Every ID must exist in `data/workflows/`.

```json
"related_workflows": ["rag", "fine-tuning-lora"]
"related_workflows": []
```

---

## `decision_notes` ← optional

**Type:** `string` (Zod: `z.string().optional()`)
**Required:** No — omit entirely if absent

The one-sentence tiebreaker: given the alternatives and competitors, when do I choose this model specifically?

Unlike Package where `decision_notes` is required by Zod, Model `decision_notes` is genuinely optional. Omit it when `use_when` / `avoid_when` / `competitors` already make the decision clear without repetition.

When present, it should add information not already in the other fields:

```json
WRONG: "decision_notes": "Good model for tabular data."   ← restates summary
WRONG: "decision_notes": "Use this when it performs best." ← says nothing

RIGHT: "decision_notes": "Choose Random Forest for robust baseline with feature importance. Use XGBoost or LightGBM for better accuracy on large datasets. Use Extra Trees for faster training."
RIGHT: "decision_notes": "Choose GTE Large for self-hosted embedding with strong MTEB performance. Use OpenAI text-embedding-3-large for top-tier accuracy when API dependency is acceptable."
```

The pattern "Choose X for A. Use Y for B. Use Z for C." is effective because it converts the field into a one-glance decision matrix.

---

## `competitors[]` ← optional

**Type:** `ContentRefSchema[]` (Zod: `z.array(ContentRefSchema).optional()`)
**Required:** No — omit entirely if absent

Direct head-to-head alternatives in the same architecture family or for the same specific task. Uses ContentRef objects.

`competitors[]` is for models where the choice between them is non-trivial and the engineer would genuinely need to compare them before deciding. Not every alternative belongs here — only the closest substitutes.

```json
"competitors": [
  {"id": "lightgbm",                   "type": "model"},
  {"id": "gradient-boosting-classifier", "type": "model"}
]
```

Maximum 3 entries. Omit entirely (do not include as `[]`) when all close alternatives are already in `alternatives[]`.

Field order within each ContentRef: `id` first, `type` second.

---

## Unknown and non-schema fields

`aliases` appears in `data/models/ml/xgboost.json` — same undocumented pattern as in Package entries. This field is not in `ModelSchema` and has no runtime effect. Do not add it to new entries.

---

## The `alternatives` / `competitors` duplication antipattern

The most common structural mistake in current Model entries: populating `alternatives[]` with the same IDs that appear in `competitors[]`.

From `random-forest.json`:
```json
"competitors": [
  {"id": "xgboost", ...},
  {"id": "lightgbm", ...},
  {"id": "extra-trees-classifier", ...},
  {"id": "gradient-boosting-classifier", ...}
],
"alternatives": [
  {"id": "xgboost", ...},
  {"id": "lightgbm", ...},
  {"id": "extra-trees-classifier", ...},
  {"id": "gradient-boosting-classifier", ...}
]
```

Both arrays are identical. This is redundant. The UI renders both. The engineer sees eight links where four would suffice.

The correct separation:
- `competitors[]`: the two or three models that are the closest direct substitutes — an engineer choosing between this model and its competitors needs to read the decision notes carefully
- `alternatives[]`: a broader set that may include competitors but more usefully includes different approaches — e.g. for Random Forest, `alternatives` might include a deep learning approach for tabular data alongside the classical competitors

When in doubt: populate `competitors[]` with the closest 2-3 substitutes and leave `alternatives[]` empty or with non-competitor alternatives. Never populate both with the same entries.

---

## Common mistakes across all Model entries

**1. `category` not matching the subfolder.**
A file at `data/models/llm/` with `"category": "ml"` will pass Zod validation but break the UI router. Always verify that the subfolder and field agree.

**2. `problem_types` using values outside the 7-value enum.**
"retrieval", "ranking", "NLP", "text" are not valid values. Map to the closest valid enum member and note the mapping if non-obvious.

**3. `key_hyperparams[].default` containing a description string.**
`"default": "100 by default"` is wrong. `"default": 100` is correct. The `note` field carries the explanation.

**4. `pros` and `cons` containing generic statements.**
"Good performance" and "Can be slow" describe every model ever built. Each entry must contain a specific technical claim that is true of this model specifically.

**5. `quick_start` showing only default parameters.**
A quick start that initialises `RandomForestClassifier()` with no arguments is not useful — it does not show the engineer which parameters to set. Show production-ready defaults for the most important parameters.

**6. Duplicating `competitors[]` into `alternatives[]`.**
Described above. Do not populate both arrays with the same entries.

**7. `avoid_when` without naming an alternative.**
"Avoid when you need high accuracy" leaves the engineer with no path forward. Name the model they should use instead.

---

## Minimal valid Model entry

```json
{
  "created_at": "2026-06-29",
  "updated_at": "2026-06-29",
  "sources": ["https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVC.html"],
  "id": "svm",
  "name": "Support Vector Machine",
  "category": "ml",
  "problem_types": ["classification", "regression"],
  "summary": "Margin-maximising classifier that finds the hyperplane separating classes with the largest margin. Kernel trick extends it to non-linear boundaries without explicit feature mapping.",
  "use_when": "Small-to-medium datasets (< 100k samples) with clear class separation. High-dimensional feature spaces like text tf-idf where linear kernel is effective. When margin-based decision boundary is theoretically motivated.",
  "avoid_when": "Large datasets (> 100k samples) where training is O(n^2-n^3) and impractical. Datasets requiring probabilistic outputs — use RandomForest or LogisticRegression with predict_proba instead.",
  "pros": [
    "Effective in high-dimensional spaces where n_features > n_samples, unlike tree-based methods",
    "Kernel trick provides flexible non-linear decision boundaries without feature engineering"
  ],
  "cons": [
    "Training complexity O(n^2) to O(n^3) makes it impractical beyond 100k samples",
    "No native probabilistic output — requires Platt scaling which adds calibration cost"
  ],
  "key_hyperparams": [
    {
      "name": "C",
      "default": 1.0,
      "note": "Regularization parameter. Lower values increase margin width at cost of misclassifications. Tune via cross-validation in range 0.01-100."
    },
    {
      "name": "kernel",
      "default": "rbf",
      "note": "Kernel function. 'linear' for high-dimensional sparse text data. 'rbf' for moderate-dimensional continuous features. 'poly' rarely needed."
    }
  ],
  "training_speed": "slow",
  "inference_speed": "medium",
  "memory_usage": "medium",
  "interpretability": "low",
  "quick_start": "from sklearn.svm import SVC\n\nclf = SVC(\n    C=1.0,\n    kernel='rbf',\n    probability=True,\n    random_state=42\n)\nclf.fit(X_train, y_train)\nprobs = clf.predict_proba(X_test)  # (n_samples, n_classes)",
  "alternatives": [
    {"id": "random-forest", "type": "model"},
    {"id": "xgboost",       "type": "model"}
  ],
  "related_workflows": []
}
```
