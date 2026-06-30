# 05 — Naming Conventions

**Stability:** Foundation (changes only if a new content type or identifier category is added)
**Loaded by:** All author skills, Content Auditor, Link Integrity Auditor

---

## Purpose of this document

Every identifier in AENS — IDs, filenames, field values, cross-reference keys — follows a consistent naming pattern. This document defines those patterns. Consistency here is not aesthetic. A misnamed ID breaks cross-links, breaks auto-discovery, and breaks `npm run validate` silently by producing a file that validates in isolation but is never found by `scanDirectoryForIds()`.

---

## The universal ID rule

All content IDs follow one rule with no exceptions:

```
^[a-z0-9][a-z0-9-]*[a-z0-9]$
```

- Lowercase letters, digits, and hyphens only
- Must start and end with a letter or digit (no leading or trailing hyphen)
- No underscores, no spaces, no dots, no uppercase

The `id` field value must be identical to the filename without the `.json` extension.

```
data/packages/scikit-learn.json   →   "id": "scikit-learn"
data/models/ml/random-forest.json →   "id": "random-forest"
data/cheatsheets/numpy-cheatsheet.json → "id": "numpy-cheatsheet"
```

If they do not match exactly, `scanDirectoryForIds()` finds the file but the data loader returns the wrong record.

---

## ID derivation rules by content type

### Package IDs

Use the PyPI package name, lowercased, with underscores replaced by hyphens.

| Package | PyPI name | AENS ID |
|---|---|---|
| NumPy | numpy | `numpy` |
| scikit-learn | scikit-learn | `scikit-learn` |
| PyTorch | torch | `pytorch` |
| sentence-transformers | sentence-transformers | `sentence-transformers` |
| LangChain | langchain | `langchain` |

When the PyPI name and the common name differ significantly (e.g. PyPI is `torch` but everyone says "PyTorch"), use the common engineering name — the name an engineer would type into the search box. The PyPI name goes in `install`, not in `id`.

Single-word packages with no ambiguity: use the word directly (`numpy`, `pandas`, `jax`).

### Model IDs (data/models/)

Use the architecture or model family name in kebab-case. This is the algorithm or architecture name, not the HuggingFace model ID (that belongs in Registry).

| Model | AENS ID |
|---|---|
| Random Forest | `random-forest` |
| BERT | `bert` |
| LLaMA 3 | `llama-3` |
| GTE Large | `gte-large` |
| YOLO v8 | `yolo-v8` |
| GPT-4 | `gpt-4` |

Version numbers in IDs: include only when the version meaningfully distinguishes architectures (LLaMA 2 vs. LLaMA 3 have different context lengths and capabilities — distinguish them). Do not include patch versions (`llama-3`, not `llama-3-8b-1-0`).

### Workflow IDs

Use a short noun phrase describing what the workflow builds, not what it does.

| Workflow | AENS ID |
|---|---|
| Retrieval-Augmented Generation | `rag` |
| LoRA Fine-Tuning | `fine-tuning-lora` |
| OCR Pipeline | `ocr-pipeline` |
| Text Classification | `text-classification` |
| Evaluation Pipeline | `eval-pipeline` |

Prefer the established engineering abbreviation when one exists and is unambiguous (`rag`, not `retrieval-augmented-generation`). Avoid abbreviations that are ambiguous or not widely used.

### Cheatsheet IDs

Always suffix with `-cheatsheet` to distinguish cheatsheet files from package files with the same library name.

```
numpy-cheatsheet
pandas-cheatsheet
pytorch-cheatsheet
sklearn-cheatsheet
transformers-cheatsheet
```

This suffix is mandatory. Without it, a search for "numpy" would surface both the Package entry and the Cheatsheet entry with identical IDs, causing a routing collision.

### Registry entry IDs

Use the model's canonical version-specific identifier in kebab-case. This is the one place where version suffixes are expected and required, because Registry entries represent specific checkpoints, not architecture families.

| Model | HuggingFace ID | Registry ID |
|---|---|---|
| BGE Large EN v1.5 | BAAI/bge-large-en-v1.5 | `bge-large-en-v1-5` |
| GTE Large | thenlper/gte-large | `gte-large` |
| text-embedding-3-large | text-embedding-3-large | `text-embedding-3-large` |

Dots in version strings become hyphens (`v1.5` → `v1-5`). Slashes from HuggingFace author prefixes are dropped (`BAAI/bge-large` → `bge-large`).

---

## `name` field — display names

The `name` field holds the human-readable display name. It is not subject to the kebab-case rule. Use official casing.

| ID | name |
|---|---|
| `numpy` | `"NumPy"` |
| `scikit-learn` | `"scikit-learn"` |
| `pytorch` | `"PyTorch"` |
| `random-forest` | `"Random Forest"` |
| `llama-3` | `"LLaMA 3"` |
| `rag` | `"Retrieval-Augmented Generation"` |
| `numpy-cheatsheet` | `"NumPy Cheatsheet"` |

Check official branding before setting `name`. pandas is lowercase. NumPy capitalises the N and P. PyTorch capitalises P and T. Getting this wrong is low-severity but creates inconsistency that compounds across hundreds of entries.

---

## Cross-reference IDs

When one content item references another via `ContentRef`, `related_workflows`, `related_cheatsheets`, `uses.packages`, `uses.models`, or `uses.cheatsheets`, the value must be the exact `id` of the target item — not its `name`, not a description, not a partial match.

```json
WRONG:  "related_cheatsheets": ["NumPy Cheatsheet"]
WRONG:  "related_cheatsheets": ["numpy"]
RIGHT:  "related_cheatsheets": ["numpy-cheatsheet"]

WRONG:  "alternatives": [{"id": "Random Forest", "type": "model"}]
RIGHT:  "alternatives": [{"id": "random-forest", "type": "model"}]
```

A cross-reference to a non-existent ID is worse than no cross-reference. Always verify the target ID exists in `data/` before including it.

---

## Enum values as identifiers

Enum fields are identifiers, not labels. They follow the same lowercase exact-match rule. See `04-json-conventions.md` for the full enum tables.

The Registry `task` field deserves special mention because the enum value and the filename differ:

| `task` value (singular) | filename (plural) |
|---|---|
| `"embedding"` | `embeddings.json` |
| `"reranker"` | `rerankers.json` |
| `"vision"` | `vision.json` |
| `"speech"` | `speech.json` |
| `"llm"` | `llms.json` |
| `"multimodal"` | `multimodal.json` |
| `"ocr"` | `ocr.json` |

The `task` value is always singular. The filename is the plural form (or the same word when it doesn't pluralise cleanly, like `vision` and `ocr`). Never put the plural form in the `task` field.

---

## Collision avoidance

Before assigning any ID, verify it does not already exist in any `data/` subdirectory. The same ID in two different content types does not cause a Zod error but will cause cross-link ambiguity and confuse the search index.

Specific cases to watch:

- A package and its cheatsheet must have different IDs: `numpy` and `numpy-cheatsheet`, not `numpy` and `numpy`.
- A model architecture and a registry entry for a specific checkpoint of that model may share a similar name but must have different IDs: `gte-large` (model) and `gte-large` (registry) would collide — prefer `gte-large-en` or the full versioned name for the registry entry.
- Workflow IDs must not match package IDs: if a package named `rag` ever existed, it would collide with the `rag` workflow. Prefer full-phrase IDs for workflows when abbreviations are ambiguous.

---

## What never appears in an ID

- Version patch numbers: `numpy-2-0-0` → use `numpy`
- Author prefixes: `baai-bge-large` → use `bge-large`
- Descriptive adjectives: `fast-random-forest` → use `random-forest`
- Content type suffixes (except `-cheatsheet`): `numpy-package`, `rag-workflow` → never
- Underscores: `random_forest` → `random-forest`
- Uppercase: `RandomForest` → `random-forest`
