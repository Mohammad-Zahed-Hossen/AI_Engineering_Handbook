# Schema Reference — Package

**Stability:** Semi-stable (update when `lib/schemas/package.ts` changes)
**Loaded by:** Package Author, Content Updater, Content Auditor
**Zod source:** `lib/schemas/package.ts` + `lib/schemas/meta.ts`

---

## Overview

A Package entry documents a Python library from the perspective of the engineering tasks it enables. The unit of organisation is the task — not the API, not the module, not the class hierarchy. An engineer consulting a Package entry has a problem to solve and needs to know whether this library solves it, how to call it, and what will go wrong.

A Package file is a single JSON object. It is not a JSON array. It lives at:

```
data/packages/{id}.json
```

---

## Schematic structure

```
{
  // BaseMeta fields
  created_at
  updated_at
  sources
  github_repo          ← optional

  // Package identity
  id
  name
  version
  install
  import_as
  summary

  // Content
  tasks[]              ← one entry per engineering task
  alternatives[]       ← ContentRef objects
}
```

---

## BaseMeta fields

These four fields come from `BaseMetaSchema` in `meta.ts`. They appear first in every Package file.

---

### `created_at`

**Type:** `string` (Zod: `z.string().date()`)
**Required:** Yes

The date this entry was first created. Format: `YYYY-MM-DD`. No timestamp, no timezone, no relative strings.

Set once at creation. Never change it. If a major rewrite makes the entry substantially new content, update `created_at` to the rewrite date.

```json
"created_at": "2026-06-24"
```

---

### `updated_at`

**Type:** `string` (Zod: `z.string().date()`)
**Required:** Yes

The date of the most recent substantive content change. Format: `YYYY-MM-DD`.

Update this whenever a field value changes for content reasons (version bump, new gotcha, fixed URL). Do not update for formatting-only changes.

Must be equal to or later than `created_at`. Zod does not enforce this ordering — it is a content rule.

```json
"updated_at": "2026-06-26"
```

---

### `sources`

**Type:** `string[]` (Zod: `z.array(z.string().url()).min(1)`)
**Required:** Yes — minimum 1 entry

URLs where this content was researched. Every value must be a valid `https://` URL. Plain text strings like `"NumPy documentation"` fail Zod validation with the message "Invalid source URL."

Typically the library's official documentation homepage and/or its GitHub repository. Does not need to be function-specific — this field documents the research origin, not a navigation target.

```json
"sources": [
  "https://numpy.org",
  "https://github.com/numpy/numpy"
]
```

Common mistake: writing the library name as a string instead of its URL.

```json
WRONG: "sources": ["NumPy official docs"]
RIGHT: "sources": ["https://numpy.org"]
```

---

### `github_repo`

**Type:** `string` (Zod: `z.string().url().startsWith('https://github.com').optional()`)
**Required:** No — omit entirely if absent

The official GitHub repository URL. Must start with `https://github.com`. Points to the repository root, not a specific file, branch, or commit.

Omit this field entirely when the library has no GitHub repository or when the repository is not the official one. Do not set it to `null` or `""`.

```json
"github_repo": "https://github.com/numpy/numpy"
```

---

## Package identity fields

---

### `id`

**Type:** `string` (Zod: `z.string()`)
**Required:** Yes

Kebab-case identifier. Must match the filename exactly (excluding `.json`). Regex: `^[a-z0-9][a-z0-9-]*[a-z0-9]$`.

Derived from the library's common engineering name, not necessarily the PyPI package name. See `05-naming-conventions.md` for derivation rules.

```json
"id": "numpy"
"id": "scikit-learn"
"id": "sentence-transformers"
```

---

### `name`

**Type:** `string` (Zod: `z.string()`)
**Required:** Yes

The official display name with correct casing. This is what appears in the UI. Check official branding before setting.

```json
"name": "NumPy"        ← not "Numpy" or "numpy"
"name": "pandas"       ← lowercase is the official branding
"name": "PyTorch"      ← not "Pytorch" or "pytorch"
"name": "scikit-learn" ← hyphen, all lowercase
```

---

### `version`

**Type:** `string` (Zod: `z.string()`)
**Required:** Yes

The current stable version at time of writing. Format: `X.Y.Z`. No `v` prefix. No `latest`, no wildcards, no range specifiers.

Source: the PyPI page for this package. See `07-research-guidelines.md`.

```json
"version": "2.0.0"     ← not "v2.0.0" or "2.0" or "latest"
```

Update `updated_at` whenever this changes. A stale version number is the highest-frequency failure in Package entries.

---

### `install`

**Type:** `string` (Zod: `z.string()`)
**Required:** Yes

The raw pip or conda install command. No markdown formatting, no backticks, no `$` shell prompt.

For packages with optional extras, include the most common production extra:

```json
"install": "pip install numpy"
"install": "pip install jax[cuda12]"
"install": "pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121"
```

For packages where install differs significantly between CPU and GPU, include the GPU command — that is the AI engineering use case. Note the CPU alternative in `summary` or a task's `decision_notes` if relevant.

---

### `import_as`

**Type:** `string` (Zod: `z.string()`)
**Required:** Yes

The canonical import statement used in production code. No markdown fencing. Use `\n` for multi-line imports.

```json
"import_as": "import numpy as np"
"import_as": "import pandas as pd"
"import_as": "import jax\nimport jax.numpy as jnp"
"import_as": "from sklearn.ensemble import RandomForestClassifier"
```

Use the alias that engineers actually use (`np`, `pd`, `jnp`). For libraries without a universal alias convention, use the most common import form seen in the library's own documentation and examples.

---

### `summary`

**Type:** `string` (Zod: `z.string()`)
**Required:** Yes

One or two sentences. Answers: what does this library do and why would an engineer reach for it over alternatives?

Target ≤ 150 characters but do not truncate useful information to hit the limit.

Must not:
- Repeat the library name (it is already in `name`)
- Say "Python library for X" — that is given
- List features as bullets
- Use marketing language

Must contain at least one specific technical fact that distinguishes this library from generic alternatives.

```json
WRONG: "A powerful library for array operations and numerical computing in Python."
RIGHT: "N-dimensional array operations, linear algebra, and vectorized math for Python. Foundation of the scientific Python stack."

WRONG: "A robust and flexible data manipulation library."
RIGHT: "Tabular data manipulation library for Python. Standard tool for CSV/Parquet I/O, column-level transformations, groupby aggregation, and time-series resampling."
```

---

## `tasks[]`

**Type:** `PackageTaskSchema[]` (Zod: `z.array(PackageTaskSchema)`)
**Required:** Yes — at least 1 task

The core content of a Package entry. Each task represents one engineering goal the library serves. Tasks are the primary navigation target — the engineer looks for the task that matches their current problem.

**Task granularity:** One task per engineering goal. Not one task per function. Not one task per module. A single task entry commonly covers 3–6 related functions that serve the same engineering purpose.

Too broad: `"task": "All array operations"` — covers too many distinct problems
Too narrow: `"task": "np.zeros"` — organised by API, not by engineering goal
Right: `"task": "Create arrays from data or shape"` — one goal, several functions

**Task ordering:** Order by frequency of use in AI engineering workflows. The most commonly needed task comes first. Do not order alphabetically or by API structure.

---

### `tasks[].task`

**Type:** `string` (Zod: `z.string()`)
**Required:** Yes

A noun phrase describing the engineering goal. Not a function name. Not a question.

```json
WRONG: "np.reshape"                                      ← function name
WRONG: "How to reshape arrays"                           ← question format
WRONG: "Reshaping"                                       ← too vague
RIGHT: "Reshape, transpose, and manipulate array dimensions"
RIGHT: "Clean data: handle nulls, duplicates, types, and column names"
RIGHT: "Compute gradients of arbitrary functions"
```

The task name appears in the UI as a header. It must be scannable at a glance.

---

### `tasks[].mental_trigger`

**Type:** `string` (Zod: `z.string()`)
**Required:** Yes

First-person, present tense. Starts with "I need to..." or "I need...". Describes the exact thought an engineer has at the moment they need this task.

This is the most important field for search and navigation. It maps from the engineer's problem space to the library's solution space. Writing it in third-person documentation style ("Array creation with NumPy") misses engineers who are thinking "I need a typed container for my feature matrix."

```json
WRONG: "mental_trigger": "Array creation functions in NumPy"
WRONG: "mental_trigger": "When you need to create arrays"
RIGHT: "mental_trigger": "I need a typed numeric container from a list, shape, or range"

WRONG: "mental_trigger": "Data cleaning operations"
RIGHT: "mental_trigger": "I need to fix missing values, deduplicate rows, cast column types, or rename columns before modeling"

WRONG: "mental_trigger": "JAX gradient computation"
RIGHT: "mental_trigger": "I need the gradient of a loss function with respect to parameters for a custom training loop"
```

Each trigger must be specific enough to distinguish this task from other tasks in the same package. If two tasks in the same package could share the same trigger, one of them is not specific enough.

---

### `tasks[].syntax`

**Type:** `string` (Zod: `z.string()`)
**Required:** Yes

Function signatures with parameter names. Not concrete example values. Multiple related functions separated by `\n`.

`syntax` shows the shape of the call — what exists and what it accepts. `example` shows it in use. These two fields have completely different jobs.

```json
WRONG: "syntax": "np.array([1, 2, 3])"           ← concrete values, not a signature
WRONG: "syntax": "arr.reshape(100, -1)"           ← concrete values
RIGHT: "syntax": "np.array(object, dtype=None)\nnp.zeros(shape)\nnp.ones(shape)\nnp.arange(start, stop, step)"

WRONG: "syntax": "df.groupby('region').agg({'sales': 'sum'})"  ← example, not signature
RIGHT: "syntax": "df.groupby(by)[col].agg(func)\ndf.pivot_table(values, index, columns, aggfunc)"
```

Include all primary functions that serve this task — not just the most famous one. An engineer reading `syntax` should see the full set of tools available for this goal.

---

### `tasks[].important_params`

**Type:** `string[]` (Zod: `z.array(z.string()).max(5)`)
**Required:** Yes — Zod enforces max 5

Maximum 5 entries. Only parameters that change the outcome in practice and are non-obvious from the function name alone.

Each entry is a string in the format: `param_name — explanation`

The separator is an em dash with spaces on each side: ` — `. Not a hyphen, not a colon.

The explanation answers: what does this parameter control and when would I change it from the default?

```json
WRONG: ["dtype", "axis", "keepdims"]              ← no explanations, just names
WRONG: ["dtype — sets the data type"]             ← explanation adds nothing
RIGHT: [
  "dtype — e.g. np.float32 to control memory and precision; omitting it silently defaults to float64",
  "axis — 0 for column-wise, 1 for row-wise, None for global",
  "keepdims — True to preserve shape for broadcasting back"
]
```

Do not list every parameter. Parameters with obvious defaults that are never changed in practice do not belong here.

---

### `tasks[].example`

**Type:** `string` (Zod: `z.string()`)
**Required:** Yes

Raw runnable Python. No import statement (the import is already in `import_as`). No markdown fencing. No backticks.

Use realistic variable names — not `x`, `a`, `b` unless those are the idiom. Show the result shape in an inline comment when it is non-obvious or critical for downstream use.

```json
WRONG: "example": "```python\nimport numpy as np\na = np.array([1, 2, 3])\n```"
WRONG: "example": "result = func(x)"
RIGHT: "example": "a = np.array([[1, 2], [3, 4]], dtype=np.float32)\nz = np.zeros((3, 4))\nr = np.arange(0, 10, 2)  # [0, 2, 4, 6, 8]"

RIGHT: "example": "x = np.zeros((100, 28, 28))\nx_flat = x.reshape(100, -1)          # (100, 784)\nx_ch = np.expand_dims(x, axis=1)     # (100, 1, 28, 28) for CNN input"
```

One to six lines. Long enough to show real context, short enough to scan instantly.

---

### `tasks[].use_when`

**Type:** `string` (Zod: `z.string()`)
**Required:** Yes

One or two sentences describing when to reach for this task. Must contain at least one specific technical condition — a problem characteristic, a data size, a pipeline stage, a downstream use case.

```json
WRONG: "use_when": "When you need to work with arrays."
WRONG: "use_when": "Useful for data science tasks."
RIGHT: "use_when": "Converting Python lists to vectorized numeric arrays. Pre-allocating fixed-shape buffers for model outputs or feature matrices."
RIGHT: "use_when": "Filtering training data by label class, selecting feature columns before model input, extracting validation splits."
```

---

### `tasks[].avoid_when`

**Type:** `string` (Zod: `z.string()`)
**Required:** Yes

When not to use this task. Must name a specific alternative when recommending against. "When performance is critical" without naming what to use instead is half an answer.

```json
WRONG: "avoid_when": "When performance matters."
WRONG: "avoid_when": "For large datasets."
RIGHT: "avoid_when": "Data is on GPU — use cupy or torch.tensor instead. Data exceeds RAM — use dask.array or memory-mapped arrays."
RIGHT: "avoid_when": "Files exceed available RAM — use polars lazy API or dask."
```

---

### `tasks[].decision_notes`

**Type:** `string` (Zod: `z.string()`)
**Required:** Yes (Zod — but see note below)

The one non-obvious engineering insight for this task. The thing a senior engineer would say that is not in the official documentation.

Not a summary of `use_when`/`avoid_when`. Not general advice. A specific, actionable insight.

```json
WRONG: "decision_notes": "Use these functions for array creation."
WRONG: "decision_notes": "There are tradeoffs between different approaches."
RIGHT: "decision_notes": "np.zeros is safer than np.empty for pre-allocation; empty leaves garbage values that can silently corrupt downstream computations."
RIGHT: "decision_notes": "Order matters: dropna → fillna → drop_duplicates → astype. Casting before handling nulls will fail with ValueError on NaN-containing columns."
```

**Schema note:** The Zod schema marks `decision_notes` as a required `z.string()`, meaning it must be present and non-empty. If there is genuinely no non-obvious insight for a task, write a short clarifying note that helps distinguish this task from adjacent ones. Do not leave it empty.

---

### `tasks[].gotchas`

**Type:** `string[]` (Zod: `z.array(z.string())`)
**Required:** Yes (array — may be empty, but non-trivial tasks should have at least 1)

Non-obvious silent failures only. Each entry must satisfy all three:
1. Not obvious from the function signature or documentation
2. Produces a wrong result or silent failure — not a raised exception
3. Costs real debugging time when encountered

Each gotcha is one sentence. It describes what happens — not what to do about it. Prevention advice belongs in `decision_notes`.

```json
WRONG: ["Make sure to import numpy first."]               ← obvious
WRONG: ["Passing wrong shape raises ValueError."]         ← an error, not silent
WRONG: ["Be careful with dtypes."]                        ← too vague
RIGHT: [
  "reshape returns a view when possible; modifying it modifies the original array silently.",
  "np.argmax returns the first index when multiple elements share the maximum — can bias sampling or evaluation metrics."
]
```

---

### `tasks[].official_docs`

**Type:** `string` (Zod: `z.string().url()`)
**Required:** Yes

A valid URL to the specific function or method documentation page. Not the library homepage. Not a section index.

The URL must resolve to a page whose heading matches the primary function being documented. If a task covers multiple functions, link to the most important one — the others can be discovered from that page.

```json
WRONG: "official_docs": "https://numpy.org"
WRONG: "official_docs": "https://numpy.org/doc/stable/reference/routines.html"
RIGHT: "official_docs": "https://numpy.org/doc/stable/reference/generated/numpy.array.html"

WRONG: "official_docs": "https://pandas.pydata.org/docs/"
RIGHT: "official_docs": "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.groupby.html"
```

---

### `tasks[].related_workflows`

**Type:** `string[]` (Zod: `z.array(z.string())`)
**Required:** Yes (array — may be `[]`)

IDs of Workflow entries that use this specific task. Plain string IDs — not ContentRef objects.

Only include workflows that genuinely use this task at a specific step. Do not include workflows that merely import the package.

Maximum 3 per task. Every ID must exist in `data/workflows/`.

```json
"related_workflows": ["rag", "fine-tuning-lora"]
"related_workflows": []
```

---

### `tasks[].related_cheatsheets`

**Type:** `string[]` (Zod: `z.array(z.string())`)
**Required:** Yes (array — may be `[]`)

IDs of Cheatsheet entries that cover this specific operation at recall-card depth. Plain string IDs — not ContentRef objects.

Maximum 2 per task. Every ID must exist in `data/cheatsheets/`.

```json
"related_cheatsheets": ["numpy-cheatsheet"]
"related_cheatsheets": []
```

---

## `alternatives[]`

**Type:** `ContentRefSchema[]` (Zod: `z.array(ContentRefSchema)`)
**Required:** Yes (array — may be `[]`)

Other packages an engineer might use instead. Uses ContentRef format — objects with `id` and `type` fields — not plain strings.

Valid `type` values: `"package"` (most common for alternatives), `"model"`, `"workflow"`, `"cheatsheet"`, `"registry"`

Maximum 5 entries. Only include libraries the engineer would genuinely consider as alternatives for the primary use case of this package. Not every library that overlaps in any way.

```json
"alternatives": [
  {"id": "polars", "type": "package"},
  {"id": "dask",   "type": "package"},
  {"id": "numpy",  "type": "package"}
]

"alternatives": []
```

Field order within each ContentRef object: `id` first, `type` second.

---

## Unknown and non-schema fields

The Zod schema does not use `.strict()` mode, which means extra fields are not rejected at validation time — they are silently ignored. However, fields not in the schema are never rendered by the UI components.

**Known undocumented field:** The `aliases` key appears on one task entry in `data/packages/numpy.json` (the linear algebra task). This field is not in `PackageTaskSchema` and has no effect at runtime. Do not add `aliases` to new entries. If the field is later added to the schema, existing content will be picked up automatically.

---

## Common mistakes across all Package entries

**1. Tasks organised by API rather than by engineering goal.**
A task named `"np.linalg functions"` is an API index. A task named `"Perform linear algebra operations on matrices"` is an engineering goal. Always start from the problem the engineer is solving.

**2. `syntax` containing concrete values.**
`"arr.reshape(100, -1)"` is an example, not a syntax signature. `"arr.reshape(newshape)"` is a signature. When in doubt: does the field show what parameters exist, or how the function was called once? Signatures go in `syntax`, concrete calls go in `example`.

**3. `important_params` listing every parameter.**
The max-5 limit exists to force selection. If you find yourself wanting 8 parameters, tighten the list to the 5 that matter most in production. Parameters the engineer will never change from the default are not important.

**4. `gotchas` containing obvious errors.**
"Passing a string where a number is required raises TypeError" is not a gotcha — it is an error the interpreter catches immediately. A gotcha produces a wrong result silently. The bar is: would an experienced engineer get caught by this?

**5. `official_docs` pointing to a homepage.**
The most common failure in this field. Run the full URL in a browser before including it. If it resolves to the library's front page or documentation landing page, find the specific function page.

**6. `sources` containing plain text instead of URLs.**
"pandas official documentation" fails Zod validation. `"https://pandas.pydata.org"` passes. Every entry in `sources` must be a parseable URL.

---

## Minimal valid Package entry

The smallest Package entry that passes `npm run validate`:

```json
{
  "created_at": "2026-06-29",
  "updated_at": "2026-06-29",
  "sources": ["https://example-library.readthedocs.io"],
  "id": "example-lib",
  "name": "ExampleLib",
  "version": "1.0.0",
  "install": "pip install example-lib",
  "import_as": "import example_lib as el",
  "summary": "One sentence describing what this library does and why to use it.",
  "tasks": [
    {
      "task": "Primary engineering task this library solves",
      "mental_trigger": "I need to solve this specific problem",
      "syntax": "el.primary_function(param_a, param_b=None)",
      "important_params": [
        "param_a — what it controls and when to set it"
      ],
      "example": "result = el.primary_function(input_data)",
      "use_when": "Specific technical condition where this is the right choice.",
      "avoid_when": "Specific condition where an alternative is better — use other-lib instead.",
      "decision_notes": "The non-obvious insight an engineer needs before using this task in production.",
      "gotchas": [
        "A silent failure that produces a wrong result without raising an exception."
      ],
      "official_docs": "https://example-library.readthedocs.io/en/stable/api/primary_function.html",
      "related_workflows": [],
      "related_cheatsheets": []
    }
  ],
  "alternatives": []
}
```
