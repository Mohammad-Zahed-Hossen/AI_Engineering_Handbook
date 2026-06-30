# 04 — JSON Conventions

**Stability:** Foundation (changes only if the build toolchain or Zod version changes in a way that affects formatting)
**Loaded by:** All author skills, Content Auditor

---

## Purpose of this document

This file defines every formatting decision for AENS JSON content files. It covers structure, ordering, types, whitespace, and string formatting. It does not cover what to write — that is `03-writing-standards.md`. It covers how to format what you write so that every file looks consistent, passes `npm run validate`, and produces no rendering surprises.

The source of truth for type correctness is always `lib/schemas/*.ts`. This document covers formatting conventions that the Zod schemas cannot enforce.

---

## Indentation and whitespace

Use 2-space indentation. No tabs.

Arrays and objects on separate lines. No single-line objects except empty arrays (`[]`).

```json
WRONG:
{"id": "numpy", "name": "NumPy", "version": "2.0.0"}

RIGHT:
{
  "id": "numpy",
  "name": "NumPy",
  "version": "2.0.0"
}
```

Empty arrays stay on one line:

```json
"related_workflows": [],
"related_cheatsheets": []
```

Non-empty arrays: opening bracket on the same line as the key, each item on its own line, closing bracket on its own line:

```json
"gotchas": [
  "reshape returns a view when possible; modifying it modifies the original array silently.",
  "np.empty() allocates without zeroing — never assume its values are zero."
]
```

---

## Field ordering

Fields must appear in the order defined by the Zod schema for that content type. The canonical orders are:

**All content types — BaseMeta fields come first:**

```
created_at
updated_at
sources
github_repo          ← optional, omit if absent
```

**Package** (after BaseMeta):

```
id
name
version
install
import_as
summary
tasks
alternatives
```

**Package task object** (within `tasks[]`):

```
task
mental_trigger
syntax
important_params
example
use_when
avoid_when
decision_notes
gotchas
official_docs
related_workflows
related_cheatsheets
```

**Model** (after BaseMeta):

```
id
name
category
problem_types
summary
use_when
avoid_when
pros
cons
key_hyperparams
training_speed
inference_speed
memory_usage
interpretability
quick_start
alternatives
related_workflows
decision_notes      ← optional
competitors         ← optional
```

**HyperParameter object** (within `key_hyperparams[]`):

```
name
default
note
```

**Workflow** (after BaseMeta):

```
id
name
type
category
overview
starter_stack
steps
common_failure_points
evaluation_checks    ← optional
next_links           ← optional
```

**WorkflowStep object** (within `steps[]`):

```
step
name
what
tools
decision
uses
failure_points
```

**WorkflowStep `uses` object:**

```
packages
models
cheatsheets
```

**Cheatsheet** (after BaseMeta):

```
id
name
entries
```

**CheatsheetEntry object** (within `entries[]`):

```
problem
trigger
snippet
minimal_notes
common_bug
docs_url
```

**Registry entry** (within a task array file):

```
id
task
size_mb
link
```

**ContentRef object** (used in `alternatives[]` across types):

```
id
type
```

---

## String conventions

**Dates** — always `YYYY-MM-DD`. No timestamps, no timezone suffixes, no relative strings.

```json
WRONG:  "created_at": "2026-06-24T02:19:44Z"
WRONG:  "created_at": "today"
RIGHT:  "created_at": "2026-06-24"
```

**Versions** — always `X.Y.Z`. No `v` prefix, no `latest`, no wildcards.

```json
WRONG:  "version": "v2.0.0"
WRONG:  "version": "latest"
RIGHT:  "version": "2.0.0"
```

**IDs** — always kebab-case. Regex: `^[a-z0-9][a-z0-9-]*[a-z0-9]$`. No underscores, no uppercase.

```json
WRONG:  "id": "RandomForest"
WRONG:  "id": "random_forest"
RIGHT:  "id": "random-forest"
```

**URLs** — always full `https://` URLs. No relative paths except in the `link` field of Registry entries which uses an internal app route (e.g. `"/models/llm/gte-large"`).

```json
WRONG:  "official_docs": "numpy.org/doc/stable/..."
WRONG:  "sources": ["the numpy docs"]
RIGHT:  "official_docs": "https://numpy.org/doc/stable/reference/generated/numpy.array.html"
```

**`sources` array** — Zod requires all values to be valid URLs (`z.string().url()`). Plain text strings like `"NumPy documentation"` or `"Internal notes"` will fail validation. Every source must be a full `https://` URL.

```json
WRONG:  "sources": ["NumPy documentation", "Internal notes"]
RIGHT:  "sources": ["https://numpy.org", "https://arxiv.org/abs/2005.11401"]
```

---

## Multi-line strings

Python code fields (`syntax`, `example`, `snippet`, `quick_start`, `import_as`, `install`) use `\n` for line breaks within a single JSON string. They are never split across multiple JSON strings.

```json
WRONG:
"syntax": [
  "np.array(object, dtype=None)",
  "np.zeros(shape)"
]

RIGHT:
"syntax": "np.array(object, dtype=None)\nnp.zeros(shape)\nnp.ones(shape)"
```

No trailing `\n` at the end of a multi-line code string:

```json
WRONG:  "example": "a = np.array([1, 2, 3])\n"
RIGHT:  "example": "a = np.array([1, 2, 3])"
```

---

## Numeric types

Fields defined as `number` in Zod must be JSON numbers, never strings.

| Field | Type | Wrong | Right |
|---|---|---|---|
| `size_mb` | number | `"1340"` | `1340` |
| `dimension` | number | `"768"` | `768` |
| `step` | number | `"1"` | `1` |
| `key_hyperparams[].default` | string \| number \| null | — | `100` or `"sqrt"` or `null` |

`key_hyperparams[].default` accepts three types. Use the type that matches the framework's actual default:

```json
{"name": "n_estimators", "default": 100, "note": "..."}
{"name": "max_features", "default": "sqrt", "note": "..."}
{"name": "random_state", "default": null, "note": "..."}
```

Never put a description or explanation in the `default` field:

```json
WRONG:  {"name": "n_estimators", "default": "100 trees by default"}
RIGHT:  {"name": "n_estimators", "default": 100}
```

---

## Null and omission

**Optional fields** — omit them entirely when they have no value. Do not include them as `null` or `""`.

```json
WRONG:
{
  "decision_notes": null,
  "competitors": null,
  "github_repo": ""
}

RIGHT — omit the field entirely:
{
  "id": "random-forest",
  "name": "Random Forest"
}
```

Exception: `key_hyperparams[].default` may be `null` when the framework's actual default is `None`:

```json
{"name": "random_state", "default": null, "note": "Set to an integer for reproducibility."}
```

**Required array fields** — use `[]` when empty, never `null`:

```json
WRONG:  "related_workflows": null
RIGHT:  "related_workflows": []
```

---

## Enum values

All enum fields are lowercase exact strings. No uppercase, no plurals, no custom values.

| Field | Valid values |
|---|---|
| `category` (Model) | `"ml"` `"dl"` `"llm"` |
| `problem_types[]` | `"classification"` `"regression"` `"clustering"` `"generation"` `"embedding"` `"detection"` `"segmentation"` |
| `training_speed` | `"fast"` `"medium"` `"slow"` |
| `inference_speed` | `"fast"` `"medium"` `"slow"` |
| `memory_usage` | `"low"` `"medium"` `"high"` |
| `interpretability` | `"high"` `"medium"` `"low"` |
| `type` (Workflow) | `"pipeline"` `"snippet"` |
| `task` (Registry) | `"embedding"` `"reranker"` `"vision"` `"speech"` `"llm"` `"multimodal"` `"ocr"` |
| `type` (ContentRef) | `"model"` `"package"` `"workflow"` `"cheatsheet"` `"registry"` |

Any value not in these lists will fail `npm run validate`. Do not invent new enum values.

---

## No markdown inside JSON strings

No backticks, no triple backticks, no `**bold**`, no `_italic_`, no `# headings` inside any JSON string value.

This applies to every field without exception. The rendering components handle formatting. Markdown inside a string value renders as literal characters.

```json
WRONG:  "summary": "**NumPy** is a library for `array` operations."
WRONG:  "example": "```python\na = np.array([1, 2, 3])\n```"
RIGHT:  "summary": "N-dimensional array operations, linear algebra, and vectorized math for Python."
RIGHT:  "example": "a = np.array([1, 2, 3])"
```

---

## Registry file structure

Registry files are arrays, not objects. The top-level structure is `[...]`, not `{...}`.

```json
WRONG:
{
  "entries": [
    {"id": "bge-large-en-v1-5", "task": "embedding", "size_mb": 1340, "link": "/models/llm/gte-large"}
  ]
}

RIGHT:
[
  {"id": "bge-large-en-v1-5", "task": "embedding", "size_mb": 1340, "link": "/models/llm/gte-large"}
]
```

Registry entries are appended to an existing array — they do not create a new file. When adding an entry, insert it at the end of the array before the closing `]`.

The `link` field in a Registry entry is an internal app route, not a full URL:

```json
WRONG:  "link": "https://ai-engineering-handbook.com/models/llm/gte-large"
RIGHT:  "link": "/models/llm/gte-large"
```

When the linked model page does not exist yet, use a MissingModelRef object:

```json
"link": {"type": "missing", "id": "some-model-id", "reason": "not yet added"}
```

---

## `important_params` string format

Each entry in `important_params` is a single string in the format:

```
param_name — explanation
```

The separator is an em dash (` — `) with a space on each side, not a hyphen or colon.

```json
WRONG:  "dtype: sets the data type"
WRONG:  "dtype - sets the data type"
RIGHT:  "dtype — e.g. np.float32 to control memory and precision"
```

---

## Trailing commas and JSON validity

JSON does not allow trailing commas. The last item in any array or object must not have a trailing comma.

```json
WRONG:
{
  "id": "numpy",
  "name": "NumPy",
}

RIGHT:
{
  "id": "numpy",
  "name": "NumPy"
}
```

---

## Pre-output checklist

Before producing any JSON content, verify:

- [ ] Field order matches the canonical order for this content type
- [ ] `created_at` and `updated_at` are `YYYY-MM-DD` with no timezone
- [ ] `sources` contains at least one valid `https://` URL
- [ ] No markdown fencing in any code field
- [ ] All enum values are lowercase and match exactly
- [ ] Numeric fields (`size_mb`, `dimension`, `step`) are JSON numbers, not strings
- [ ] Optional fields are omitted entirely when empty, not set to `null` or `""`
- [ ] Required array fields use `[]` when empty, not `null`
- [ ] No trailing commas
- [ ] `version` has no `v` prefix
- [ ] All IDs are kebab-case
- [ ] `official_docs` and `docs_url` are specific function page URLs, not homepages
- [ ] Multi-line code strings use `\n`, not actual line breaks in the JSON
- [ ] Registry `task` values are singular (`"embedding"`, not `"embeddings"`)
