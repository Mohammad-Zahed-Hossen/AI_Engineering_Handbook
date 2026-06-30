# 08 — Cross-Linking

**Stability:** Foundation (changes only if a new content type or cross-link field is added to the schema)
**Loaded by:** All author skills, Link Integrity Auditor, Content Auditor

---

## Purpose of this document

Cross-links are the connective tissue of AENS. They let the engineer move from a Package task to the Workflow that uses it, from a Workflow step to the Model it recommends, from a Cheatsheet entry to the Package that explains the full context. Done well, cross-links turn five isolated content types into a navigable system. Done poorly, they create broken references, circular noise, and maintenance debt.

This document defines which links are allowed, which are forbidden, how to decide whether a link belongs, and how to format every link correctly.

---

## The fundamental rule

**A cross-link must represent a genuine navigation need.**

A link belongs if an engineer reading the source entry would naturally want to jump to the target entry to continue their work. A link does not belong just because two entries share a topic, keyword, or library name.

Ask before adding any cross-link:

> "Would an engineer reading this entry actually click this link to continue their current task?"

If the answer is "maybe" or "for completeness," do not add the link.

---

## Cross-link fields by content type

### Package → other content

| Field | Target type | Cardinality | Purpose |
|---|---|---|---|
| `tasks[].related_workflows` | Workflow | 0–3 per task | Workflows that use this specific task |
| `tasks[].related_cheatsheets` | Cheatsheet | 0–2 per task | Cheatsheets covering this specific operation |
| `alternatives[]` | Any | 0–5 total | Other packages to consider instead |

### Model → other content

| Field | Target type | Cardinality | Purpose |
|---|---|---|---|
| `alternatives[]` | Model, Package | 0–5 | Other models or approaches to consider |
| `related_workflows[]` | Workflow | 0–3 | Workflows that use this model |
| `competitors[]` | Model | 0–3 | Direct alternatives for the same task |

### Workflow → other content

| Field | Target type | Cardinality | Purpose |
|---|---|---|---|
| `steps[].uses.packages` | Package | 0–∞ per step | Packages used at this step |
| `steps[].uses.models` | Model | 0–∞ per step | Models used at this step |
| `steps[].uses.cheatsheets` | Cheatsheet | 0–3 per step | Cheatsheets useful at this step |
| `next_links[]` | Workflow | 0–3 | Workflows to explore after completing this one |

### Cheatsheet → other content

Cheatsheet entries have `docs_url` (external URL only) and no ContentRef cross-link fields. Cheatsheets do not link back to Packages or Workflows — the navigation flows the other way.

### Registry → other content

Registry entries have a `link` field pointing to an internal app route for a Model entry. This is the only cross-link Registry entries make, and it uses a path string rather than a ContentRef.

---

## Allowed link directions

```
Package ──────────→ Workflow        (task uses this workflow)
Package ──────────→ Cheatsheet      (task has a cheatsheet)
Package ──────────→ Package         (alternatives only)

Model ────────────→ Workflow        (model is used in this workflow)
Model ────────────→ Model           (alternatives / competitors)

Workflow ─────────→ Package         (step uses this package)
Workflow ─────────→ Model           (step uses this model)
Workflow ─────────→ Cheatsheet      (step references this cheatsheet)
Workflow ─────────→ Workflow        (next_links only)

Registry ─────────→ Model           (link field, path string)
```

---

## Forbidden link directions

These create circular navigation, semantic confusion, or maintenance problems.

**Cheatsheet → anything via ContentRef**
Cheatsheets are terminal reference cards. An engineer using a cheatsheet is in the middle of coding — they need the snippet, not a navigation chain. Cheatsheet entries have `docs_url` for external documentation only.

**Package → Model via ContentRef**
A Package entry documents a library. Recommending a specific model from inside a library entry conflates the tool with the model. The correct pattern: the Workflow that combines them holds the `uses.packages` and `uses.models` links.

**Model → Package via ContentRef** (in most cases)
A Model entry documents an architecture or algorithm. If the model is implemented in a specific library, the implementation note belongs in `quick_start` prose, not as a ContentRef. Exception: `alternatives[]` may include a Package if a Package is genuinely a direct alternative to using a Model (e.g. a classical algorithm package as an alternative to a neural architecture).

**Registry → Registry**
Registry entries are lookup rows. They do not cross-reference other registry entries.

**Workflow → Workflow via `uses`**
`uses.packages`, `uses.models`, and `uses.cheatsheets` are for resources used within a step. A Workflow that builds on another Workflow uses `next_links[]` instead.

**Anything → a non-existent ID**
The most important forbidden link. A cross-link to an ID that does not exist in `data/` is a broken link. It will not be caught by the Zod validator — only by the Link Integrity Auditor or by the engineer clicking it. Always verify the target exists before adding the link.

---

## The `alternatives[]` field

`alternatives[]` uses `ContentRef` objects: `{ "id": "...", "type": "..." }`.

**When to add an alternative:**
- The engineer making a decision about the current entry would genuinely consider the alternative
- The alternative solves a meaningfully overlapping problem
- The engineer might not know the alternative exists

**When not to add an alternative:**
- The alternative is in a completely different problem category (e.g., listing every ML library as an alternative to NumPy)
- The alternative is already listed in `competitors[]` — do not duplicate across both fields
- You are listing alternatives for completeness rather than because the engineer would actually consider them

**Cardinality:** 0–5 entries. If you find yourself wanting more than 5 alternatives, the entry's `use_when` / `avoid_when` fields are probably not doing their job — tighten those first.

---

## The `competitors[]` field (Model only)

`competitors[]` is for models that directly compete for the same task and are closely matched enough that the choice between them is non-trivial.

`alternatives[]` is broader — it includes different approaches. `competitors[]` is narrower — direct head-to-head substitutes.

```
Model: bge-large-en
alternatives: [gte-large, text-embedding-3-small]   ← similar task, different approach
competitors:  [bge-base-en, bge-small-en]            ← same family, size tradeoff
```

Do not populate `competitors[]` if all the close alternatives are already in `alternatives[]`. Use one or the other, not both, for the same target entry.

---

## `next_links[]` (Workflow only)

`next_links[]` points to Workflows an engineer would naturally build or explore after completing the current one. It is not a "related" list — it is a directed "what comes next" pointer.

```
rag → fine-tuning-lora    ← after building a RAG system, you might fine-tune a retriever
fine-tuning-lora → eval-pipeline  ← after fine-tuning, evaluate the result
```

Limit to 0–3 entries. If you cannot articulate why an engineer who just completed this workflow would go to the target next, do not add the link.

---

## Step-level `uses` links (Workflow)

`uses.packages`, `uses.models`, and `uses.cheatsheets` within a workflow step are the most important cross-links in the system — they are how the engineer navigates from a high-level workflow step to the detailed reference they need.

**Rules:**
- Only link packages, models, and cheatsheets that are actually used at this specific step — not all tools used in the entire workflow
- A package that is imported at step 1 and used at step 3 belongs in step 3's `uses`, not step 1's
- If a tool is used across multiple steps, list it in `uses` for the step where it performs its primary function
- Do not list packages that are utilities (logging, config parsing) unless they are central to the AI engineering decision at that step

**Cheatsheet links within steps are high value.** If step 3 of a RAG workflow uses NumPy for vector normalization, and a numpy-cheatsheet entry covers vector normalization, linking it there is exactly the kind of navigation shortcut AENS is designed to provide.

---

## Reciprocal links — when to add them and when not to

Some cross-links are naturally bidirectional. Others are one-way by design.

**Naturally bidirectional (maintain both sides):**
- A Package task links `related_workflows: ["rag"]` → the RAG Workflow step should include `uses.packages: ["numpy"]`
- A Model links `related_workflows: ["rag"]` → the RAG Workflow step should include `uses.models: ["bge-large-en"]`

When you add a link from A → B, check whether a corresponding link from B → A makes sense and add it if so.

**One-way by design (do not add the reverse):**
- Workflow → Cheatsheet (`uses.cheatsheets`) is one-way. Cheatsheets do not link back to Workflows.
- Registry → Model (`link` field) is one-way. Model entries do not link back to Registry entries.
- Package → Package (`alternatives`) should generally be mirrored — if numpy lists polars as an alternative, polars should list numpy as an alternative — but check whether the reverse is genuinely useful before adding it.

**Avoid reflexive links:** An entry must never reference itself.

---

## Cardinality limits — why they exist

The limits in the field table above are not arbitrary. They reflect the engineer's cognitive load at lookup time.

An engineer looking up a Package task to solve an immediate problem can absorb 1–2 workflow links and 1 cheatsheet link. Ten links in `related_workflows` means the engineer has to evaluate ten options to decide where to go next — which defeats the purpose of having a navigation system.

When you find yourself wanting more links than the limit allows:
1. The entry's `use_when` / `avoid_when` fields are probably not specific enough — tighten them
2. Some of the links are "for completeness" rather than genuine navigation needs — remove those first
3. If genuine navigation needs genuinely exceed the limit, the entry may be too broad and should be split

---

## Formatting ContentRef objects

All ContentRef cross-links use this exact format:

```json
{"id": "rag", "type": "workflow"}
{"id": "numpy", "type": "package"}
{"id": "random-forest", "type": "model"}
{"id": "numpy-cheatsheet", "type": "cheatsheet"}
```

Valid `type` values: `"model"` `"package"` `"workflow"` `"cheatsheet"` `"registry"`

Field order within the object: `id` first, `type` second.

Arrays of ContentRef:

```json
"alternatives": [
  {"id": "polars", "type": "package"},
  {"id": "dask", "type": "package"}
]
```

String-only cross-link arrays (`related_workflows`, `related_cheatsheets`, `uses.packages`, `uses.models`, `uses.cheatsheets`, `next_links`) contain plain ID strings, not ContentRef objects:

```json
"related_workflows": ["rag", "fine-tuning-lora"]
"uses": {
  "packages": ["numpy", "faiss"],
  "models": ["bge-large-en"],
  "cheatsheets": ["numpy-cheatsheet"]
}
```

Never mix the two formats. `alternatives[]` and `competitors[]` use ContentRef objects. All other cross-link fields use plain strings.

---

## Pre-output checklist for cross-links

Before finalising any content item:

- [ ] Every referenced ID exists in `data/` — verified, not assumed
- [ ] No entry references itself
- [ ] Cheatsheet entries contain no ContentRef fields
- [ ] `alternatives[]` and `competitors[]` use ContentRef objects `{"id": "...", "type": "..."}`
- [ ] `related_workflows`, `related_cheatsheets`, `uses.*`, `next_links` use plain string arrays
- [ ] Field order within ContentRef objects is `id` then `type`
- [ ] Cardinality limits respected (max 3 related_workflows per task, max 5 alternatives, max 3 next_links)
- [ ] Reciprocal links checked — if A links to B, verify whether B should link to A
- [ ] No links added "for completeness" — every link passes the genuine navigation need test
