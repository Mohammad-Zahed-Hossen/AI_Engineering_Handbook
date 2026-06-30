# 03 — Writing Standards

**Stability:** Foundation (changes rarely — update only when a new quality pattern is established across real content)
**Loaded by:** All author skills, Content Auditor

---

## Purpose of this document

This file defines how every field in every content type must be written. It is not about schema structure — that is in `02-content-taxonomy.md`. It is about the specific writing patterns that separate useful AENS content from content that wastes space.

Every rule here is derived from studying real production content in `data/`. When a rule conflicts with intuition, follow the rule. When a rule seems unnecessary, the anti-pattern it prevents is already a real failure mode.

---

## The single most important writing principle

**Write for the engineer who already knows the concept but has forgotten the detail.**

Not for someone learning. Not for someone who needs convincing. For someone mid-task who needs one specific thing retrieved in under 10 seconds.

This shapes every other rule below.

---

## Global rules — apply to every field in every content type

**No markdown fencing in code fields.**
Fields that contain code (`syntax`, `example`, `snippet`, `quick_start`, `install`, `import_as`, `fn`) must be raw strings. No triple backticks. No language tags. The rendering components handle syntax highlighting. Fencing breaks the validator and the renderer.

```
WRONG:  "example": "```python\na = np.array([1, 2, 3])\n```"
RIGHT:  "example": "a = np.array([1, 2, 3])"
```

**No marketing language.**
Words like "powerful," "robust," "state-of-the-art," "cutting-edge," "amazing," "seamless" carry zero information. Every use of them is a sentence that tells the engineer nothing useful. Replace with a specific technical fact or delete.

```
WRONG:  "pros": ["Extremely powerful and flexible"]
RIGHT:  "pros": ["Handles 100k+ token context windows at inference"]
```

**No tutorials inside entries.**
An entry is a reference card, not a lesson. If understanding requires explanation from first principles, the content belongs in official documentation — link to it instead. Content that needs to be read start-to-finish to be useful does not belong in AENS.

**No generic descriptions.**
A description that would apply equally to three other tools is not a description — it is filler. Every sentence must contain a decision, a constraint, a threshold, or a specific technical fact that applies to this tool and not generically to all tools.

```
WRONG:  "use_when": "When you need to work with arrays."
RIGHT:  "use_when": "Converting Python lists to vectorized numeric arrays. Pre-allocating fixed-shape buffers for model outputs or feature matrices."
```

**Sentences over bullet points inside string fields.**
Fields that take a string value (`use_when`, `avoid_when`, `decision_notes`, `overview`, `what`, `decision`, `minimal_notes`, `common_bug`) use complete sentences, not bullet points. Bullet formatting inside a string field will render as literal text with asterisks.

---

## Field-by-field writing rules

### `summary` (Package, Model, Workflow)

One or two sentences. Maximum 150 characters preferred.

Answers: what does this do and why would I reach for it?

Does not repeat information already visible in `name` or `id`. Does not list features. Does not say "library for Python."

```
WRONG:  "A Python library for array operations and numerical computing."
RIGHT:  "N-dimensional array operations, linear algebra, and vectorized math for Python. Foundation of the scientific Python stack."
```

---

### `mental_trigger` (Package task)

Written in first person: "I need to..."

This is the thought that fires in the engineer's head at the moment they need this task. It maps a problem to an entry — not the other way around. Write it as the engineer's internal monologue, not as a description of what the function does.

```
WRONG:  "mental_trigger": "Array creation functions in NumPy"
RIGHT:  "mental_trigger": "I need a typed numeric container from a list, shape, or range"

WRONG:  "mental_trigger": "When you need to reshape"
RIGHT:  "mental_trigger": "I need to change the shape of an array for matrix ops, batching, or model input formatting"
```

The trigger must be specific enough to distinguish this task from adjacent tasks in the same package.

---

### `syntax` (Package task)

Function signatures, not concrete values.

`syntax` shows the shape of the call — what parameters exist and what types they accept. Concrete values with real data go in `example`. These two fields have different jobs and must not be merged.

```
WRONG:  "syntax": "np.array([1, 2, 3])"         ← concrete example, not a signature
RIGHT:  "syntax": "np.array(object, dtype=None)"

WRONG:  "syntax": "arr.reshape(100, -1)"         ← concrete values
RIGHT:  "syntax": "arr.reshape(newshape)"
```

When a task involves multiple related functions, list all of them — one per line, no separators:

```
"syntax": "np.array(object, dtype=None)\nnp.zeros(shape)\nnp.ones(shape)\nnp.arange(start, stop, step)"
```

---

### `important_params` (Package task)

Maximum 5 entries. Only parameters that change the outcome in practice.

Each entry is a string in the format: `param_name — what it controls and when to set it`.

Do not list every parameter. Do not include parameters with obvious defaults that are never changed. Focus on the ones that matter: the ones where the wrong value causes a bug or the right value unlocks the feature.

```
WRONG:  "dtype — sets the data type"
RIGHT:  "dtype — e.g. np.float32 to control memory and precision; omitting it silently defaults to float64"

WRONG:  "axis — the axis parameter"
RIGHT:  "axis — 0 for column-wise, 1 for row-wise, None for global"
```

---

### `example` (Package task)

Raw runnable Python. No import statement. No markdown. One to four lines.

The import is already captured in `import_as` at the package level — do not repeat it.

Inline comments are encouraged when they show the shape or value of the result:

```
RIGHT:
"x_flat = x.reshape(100, -1)          # (100, 784)\nx_ch = np.expand_dims(x, axis=1)     # (100, 1, 28, 28) for CNN input"
```

The example must be realistic. It must show the call in a context close to how it is actually used in AI engineering — not a toy demonstration.

---

### `use_when` and `avoid_when` (Package task, Model)

Concrete technical conditions. Measurable thresholds where possible. Not generic advice.

These two fields are decisions. They answer: "given my specific situation, should I use this or not?" A good `use_when` eliminates ambiguity about whether the task or model applies to the engineer's current problem.

```
WRONG:  "use_when": "When you need fast array operations."
RIGHT:  "use_when": "Converting Python lists to vectorized numeric arrays. Pre-allocating fixed-shape buffers for model outputs or feature matrices."

WRONG:  "avoid_when": "When performance is critical."
RIGHT:  "avoid_when": "Data is on GPU — use cupy or torch.tensor instead. Data exceeds RAM — use dask.array or memory-mapped arrays."
```

Name the alternative when the answer is "use something else." "Don't use this here" is half an answer. "Use X instead" is the full answer.

---

### `decision_notes` (Package task, Model — optional)

The one non-obvious engineering insight for this task or model.

Not a summary of what was already said in `use_when`/`avoid_when`. Not a general rule. The specific insight that someone who has used this in production would tell a colleague — the thing that is true but not written in the official docs.

```
WRONG:  "decision_notes": "Use this function for array creation."
RIGHT:  "decision_notes": "np.zeros is safer than np.empty for pre-allocation; empty leaves garbage values that can silently corrupt downstream computations."

WRONG:  "decision_notes": "There are tradeoffs between approaches."
RIGHT:  "decision_notes": "Order matters: dropna → fillna → drop_duplicates → astype. Casting before handling nulls will fail with ValueError on NaN-containing columns."
```

---

### `gotchas` (Package task)

Non-obvious silent failures only.

A gotcha must satisfy all three of these:
1. The bug is not obvious from the function signature or documentation
2. It produces a wrong result or silent failure, not an error (errors are easy to catch)
3. It wastes real debugging time when encountered

```
WRONG:  "gotchas": ["Make sure to import numpy first."]        ← obvious
WRONG:  "gotchas": ["Passing wrong type raises TypeError."]    ← an error, not silent
RIGHT:  "gotchas": ["reshape returns a view when possible; modifying it modifies the original array silently."]
RIGHT:  "gotchas": ["np.argmax returns the first index when multiple elements share the maximum — can bias sampling or evaluation metrics."]
```

Each gotcha is one sentence. The sentence describes what happens — not what to do about it. The `decision_notes` field handles prevention advice.

---

### `official_docs` (Package task), `docs_url` (Cheatsheet entry)

Direct page URL. Not a homepage. Not a section index.

```
WRONG:  "https://numpy.org"
WRONG:  "https://numpy.org/doc/stable/"
RIGHT:  "https://numpy.org/doc/stable/reference/generated/numpy.array.html"

WRONG:  "https://pandas.pydata.org/docs/"
RIGHT:  "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.groupby.html"
```

The URL must take the engineer to the specific function or method being documented, not to a landing page where they have to search again.

---

### `problem` (Cheatsheet entry)

One line. States the engineering task as a noun phrase, not a question or an instruction.

```
WRONG:  "How do I create an array from a list?"
WRONG:  "Create an array from a list"          ← acceptable but imperative
RIGHT:  "Create array from list / pre-allocate buffer"
RIGHT:  "Reshape array for model input (batch, channel, height, width)"
```

The slash notation (`task A / task B`) is appropriate when two closely related operations share a single entry.

---

### `trigger` (Cheatsheet entry)

The concrete engineering situation that sends the engineer to this entry. More specific than `problem` — it names the actual context.

```
WRONG:  "trigger": "When working with arrays"
RIGHT:  "trigger": "Converting Python data to NumPy or initializing a fixed-shape output"
RIGHT:  "trigger": "Preparing a tensor shape mismatch before a layer forward pass"
RIGHT:  "trigger": "Masking padding tokens, selecting positive predictions, filtering by label"
```

---

### `snippet` (Cheatsheet entry)

Raw runnable Python. No imports. No markdown fencing.

Multiple related calls on separate lines are encouraged — the engineer is looking for quick recall, not a single-function example. Inline comments showing output shapes or behavior are strongly encouraged:

```
RIGHT:
"x = arr.reshape(batch, -1)           # flatten spatial dims\nx = np.expand_dims(arr, axis=1)      # add channel dim: (N,H,W) -> (N,1,H,W)\nx = np.transpose(arr, (0, 2, 1))     # swap last two dims"
```

---

### `minimal_notes` (Cheatsheet entry)

One sentence. The single most critical thing to remember about this operation.

Not a summary of what the snippet does. Not general advice. The one fact that if forgotten causes the bug that `common_bug` describes.

```
WRONG:  "minimal_notes": "This function creates arrays."
WRONG:  "minimal_notes": "Be careful with dtypes and views."    ← too vague
RIGHT:  "minimal_notes": "Use zeros not empty for pre-allocation — empty contains garbage values."
RIGHT:  "minimal_notes": "keepdims=True is essential to broadcast the result back against the original array."
```

---

### `common_bug` (Cheatsheet entry)

One sentence. A specific, non-obvious silent failure for this exact operation.

Same bar as `gotchas` in Package entries: the bug is silent, non-obvious, and wastes real time.

```
WRONG:  "common_bug": "Don't forget to import numpy."
RIGHT:  "common_bug": "Mixed int/float list silently upcasts to float64, doubling memory for large arrays."
RIGHT:  "common_bug": "linalg.inv on near-singular matrix (cond > 1e12) returns garbage silently — check np.linalg.cond first."
```

---

### `overview` (Workflow)

Two to four sentences. Answers: what does this workflow build, and when should I use it instead of alternatives?

The overview is the first thing the engineer reads. It must justify the workflow's existence — not just describe it. It should answer "should I use this pattern?" before the engineer reads any steps.

```
WRONG:  "This workflow shows how to implement RAG."
RIGHT:  "RAG retrieves relevant chunks from a local document index and injects them into a prompt to ground LLM answers in your data. Use when the LLM lacks domain knowledge or you need citations."
```

---

### `decision` (Workflow step)

A concrete engineering decision with a default/baseline value.

`what` describes the operation. `decision` specifies the parameter choices, thresholds, and tradeoffs at this step. These two fields must not contain the same information.

```
WRONG:  "decision": "Choose the right chunk size for your use case."    ← no baseline
WRONG:  "decision": "Parse documents and split into chunks."            ← that's `what`
RIGHT:  "decision": "Baseline: chunk_size=512, overlap=10%. Increase overlap to 20% for dense technical text where a fact can span a sentence boundary. Decrease chunk size for Q&A over short structured data."

WRONG:  "decision": "Use an embedding model."
RIGHT:  "decision": "BAAI/bge-large-en-v1.5 for accuracy. Downsize to gte-large or enable ONNX quantization if latency per query exceeds 50ms."
```

Every `decision` field must name at least one concrete value, threshold, or model name. A decision without a number or a name is not a decision — it is advice.

---

### `failure_points` (Workflow step) and `common_failure_points` (Workflow root)

Concrete failure scenarios. Each item describes what goes wrong and why, not what to do about it.

`failure_points` are step-specific failures. `common_failure_points` are cross-cutting failures that can arise anywhere in the workflow.

```
WRONG:  "failure_points": ["Be careful with chunk size."]
WRONG:  "failure_points": ["Make sure to use the right embedding model."]
RIGHT:  "failure_points": ["Using a different embedding model at query time than at index time — produces incompatible vector spaces and zero relevant hits."]
RIGHT:  "failure_points": ["Embedding model max token length (typically 512) silently truncates long chunks, losing the tail of the text."]
```

The failure must be specific: what breaks, what it produces instead of the correct result, and what makes it non-obvious. "Be careful" and "make sure" are not failure descriptions.

---

### `pros` and `cons` (Model)

Specific technical facts. Not opinions. Not marketing.

Each entry answers "compared to what?" even if that comparison is implicit. Generic advantages that apply to all models in a category are not pros.

```
WRONG:  "pros": ["Fast inference", "Easy to use", "Well documented"]
RIGHT:  "pros": ["No GPU required — CPU inference is fast enough for ≤10k samples", "High interpretability — feature importances are directly inspectable"]

WRONG:  "cons": ["Can be slow with large datasets"]
RIGHT:  "cons": ["Training time scales linearly with n_estimators × n_samples — impractical beyond ~1M samples without subsampling"]
```

---

### `use_when` and `avoid_when` (Model)

Same rules as Package task fields. Must include measurable thresholds or specific problem characteristics.

Reference VRAM requirements, dataset size ranges, latency targets, accuracy benchmarks, or structural constraints (tabular vs. text vs. image). Generic conditions ("when you need high accuracy") carry no information.

```
WRONG:  "use_when": "When you need a good embedding model for retrieval."
RIGHT:  "use_when": "English-only semantic search with latency budget > 100ms and accuracy as the primary concern."

WRONG:  "avoid_when": "When speed is important."
RIGHT:  "avoid_when": "Multilingual queries — use BAAI/bge-m3 instead. Latency budget < 50ms — use a quantized or smaller model."
```

---

### `quick_start` (Model, Registry)

Raw multi-line Python. No markdown fencing.

Must show the minimal working pattern: import, load, run. Not a toy example — should use realistic variable names and show the actual output shape or format where helpful.

```
WRONG:
"quick_start": "```python\nfrom sklearn.ensemble import RandomForestClassifier\nclf = RandomForestClassifier()\nclf.fit(X, y)\n```"

RIGHT:
"quick_start": "from sklearn.ensemble import RandomForestClassifier\n\nclf = RandomForestClassifier(n_estimators=100, random_state=42)\nclf.fit(X_train, y_train)\n\npreds = clf.predict(X_test)\nprobs = clf.predict_proba(X_test)   # shape: (n_samples, n_classes)"
```

---

## What a passing entry looks like vs. a failing entry

### Package task — passing

```json
{
  "task": "Compute statistics and reductions along axes",
  "mental_trigger": "I need per-row, per-column, or global aggregation: sum, mean, std, max, argmax",
  "syntax": "np.sum(a, axis)\nnp.mean(a, axis)\nnp.std(a, axis)\nnp.argmax(a, axis)\nnp.linalg.norm(x, ord)",
  "important_params": [
    "axis — 0 for column-wise, 1 for row-wise, None for global",
    "keepdims — True to preserve shape for broadcasting back",
    "ord — norm order: 1 (L1), 2 (L2), np.inf (max)"
  ],
  "example": "preds = np.argmax(scores, axis=1)\nnorms = np.linalg.norm(X, ord=2, axis=1, keepdims=True)",
  "use_when": "Computing per-batch loss statistics, normalizing embedding vectors, finding predicted class indices from logit arrays.",
  "avoid_when": "Aggregating over very large arrays on CPU — prefer CuPy or PyTorch tensor ops which fuse reduction kernels on GPU.",
  "decision_notes": "keepdims=True is essential when you need to broadcast the result back against the original array. Forgetting it produces a shape mismatch that is hard to debug.",
  "gotchas": [
    "np.mean on integer dtype arrays silently truncates fractional parts in NumPy < 2.0; cast to float first.",
    "np.argmax returns the first index when multiple elements share the maximum — can bias sampling or evaluation metrics."
  ],
  "official_docs": "https://numpy.org/doc/stable/reference/generated/numpy.mean.html",
  "related_workflows": [],
  "related_cheatsheets": ["numpy-cheatsheet"]
}
```

### Package task — failing (and why)

```json
{
  "task": "Statistics",
  "mental_trigger": "Computing statistics with NumPy",              ← not first-person, not specific
  "syntax": "np.mean(arr)",                                         ← only one function, no params shown
  "important_params": ["axis", "keepdims", "ord", "out", "where"], ← no explanations, just names
  "example": "```python\nresult = np.mean(arr)\n```",              ← markdown fencing, trivial example
  "use_when": "When you need statistics.",                          ← generic, useless
  "avoid_when": "When performance matters.",                        ← generic, useless
  "decision_notes": "NumPy provides many statistical functions.",   ← describes nothing
  "gotchas": ["Make sure to import numpy.", "Pass the right axis."],← obvious, not silent
  "official_docs": "https://numpy.org/doc/stable/"                  ← homepage, not function page
}
```

---

### Cheatsheet entry — passing

```json
{
  "problem": "Solve linear system or decompose matrix (SVD, eig)",
  "trigger": "PCA, least-squares regression, normalizing embeddings, computing cosine similarity",
  "snippet": "x = np.linalg.solve(A, b)\nU, s, Vh = np.linalg.svd(X, full_matrices=False)\nw, v = np.linalg.eigh(M)",
  "minimal_notes": "Never use linalg.inv to solve Ax=b — use linalg.solve. Use eigh not eig for symmetric matrices.",
  "common_bug": "linalg.inv on near-singular matrix (cond > 1e12) returns garbage silently — check np.linalg.cond first.",
  "docs_url": "https://numpy.org/doc/stable/reference/routines.linalg.html"
}
```

### Cheatsheet entry — failing (and why)

```json
{
  "problem": "How to solve linear systems?",                        ← question format, not noun phrase
  "trigger": "When doing math",                                     ← not specific
  "snippet": "```python\nimport numpy as np\nx = np.linalg.solve(A, b)\n```", ← fencing + import
  "minimal_notes": "NumPy has linalg functions for matrix operations.",  ← describes nothing
  "common_bug": "Make sure A is square.",                           ← obvious from the error message
  "docs_url": "https://numpy.org"                                   ← homepage
}
```

---

### Workflow `decision` field — passing vs. failing

```
PASSING:
"decision": "Baseline: chunk_size=512, overlap=10%. Increase overlap to 20% for dense technical text where a fact can span a sentence boundary."

FAILING:
"decision": "Choose an appropriate chunk size based on your documents."
```

The passing version has a number (`512`), a percentage (`10%`), and a condition (`dense technical text`). The failing version has none of these — it is advice without content.

---

## Completeness rules by content type

### Package tasks

Every task entry must have all 12 required fields populated. No empty arrays except `related_workflows` and `related_cheatsheets` when no cross-links genuinely exist. `gotchas` must have at least one entry for any non-trivial task.

### Cheatsheet entries

All 6 fields required. `snippet` must contain at least one code line. `docs_url` must be a specific function URL, validated.

### Workflow steps

All 7 fields required per step (`step`, `name`, `what`, `tools`, `decision`, `uses`, `failure_points`). `uses.packages`, `uses.models`, `uses.cheatsheets` may be empty arrays when nothing applies. `failure_points` must contain at least one entry per non-trivial step.

### Model

`use_when` and `avoid_when` must each contain at least one technical threshold or specific condition. `pros` and `cons` must each have at least two entries. `key_hyperparams` must include the two to four parameters most likely to be tuned in practice.

---

## The summary test

Before finalising any field value, apply this test:

> "Could this sentence have been written about a different tool without changing a single word?"

If YES → the sentence is generic. Rewrite it with a specific technical fact, number, or condition that is true of this tool and not universally true.

If NO → the sentence is specific enough. Keep it.

This test catches marketing language, filler descriptions, and advice that belongs in official documentation rather than AENS.
