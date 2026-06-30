# 09 — Quality Checklist

**Stability:** Foundation (add items when a new failure pattern is observed in production content; never remove items)
**Loaded by:** All author skills, Content Auditor

---

## Purpose of this document

This checklist is the final gate before any content is written to disk. It is not a style guide — that is `03-writing-standards.md`. It is not a schema reference — that is `02-content-taxonomy.md`. It is the consolidated set of pass/fail questions that catch every class of error observed across all content types.

Every authoring skill runs through the relevant sections of this checklist before producing final output. The Content Auditor runs through the full checklist when reviewing existing entries.

A single failing item means the content is not ready. Fix the failure, then re-check.

---

## How to use this checklist

1. Identify which content type is being produced or audited
2. Run Section 1 (universal) for every entry without exception
3. Run the section for the specific content type
4. Run Section 7 (cross-links) for any entry that contains cross-link fields
5. Only after all applicable items pass: produce or approve the output

Do not skip sections because the content "looks right." Checklist items exist because content that looked right failed in exactly the way the item describes.

---

## Section 1 — Universal (all content types)

### Identity and structure

- [ ] `id` is kebab-case, matches the filename exactly (excluding `.json`)
- [ ] `name` uses official casing (NumPy not Numpy, scikit-learn not Scikit-Learn)
- [ ] `created_at` is `YYYY-MM-DD` format with no timestamp or timezone
- [ ] `updated_at` is `YYYY-MM-DD` format, equal to or later than `created_at`
- [ ] `sources` contains at least one entry and every entry is a valid `https://` URL
- [ ] `github_repo`, if present, starts with `https://github.com/` and points to the repository root

### JSON formatting

- [ ] Field order matches the canonical order in `04-json-conventions.md`
- [ ] 2-space indentation throughout, no tabs
- [ ] No trailing commas anywhere in the file
- [ ] No markdown in any string field (no backticks, no `**bold**`, no `# headings`)
- [ ] No triple backticks in any code field (`syntax`, `example`, `snippet`, `quick_start`, `install`, `import_as`)
- [ ] Multi-line code strings use `\n` escape sequences, not literal line breaks
- [ ] No trailing `\n` at the end of any code string
- [ ] Optional fields that have no value are omitted entirely — not set to `null` or `""`
- [ ] Required array fields that are empty use `[]`, not `null`

### Content quality

- [ ] No marketing language anywhere (`powerful`, `robust`, `seamless`, `cutting-edge`, `state-of-the-art`)
- [ ] No tutorial-style explanation that requires reading from start to finish to be useful
- [ ] Every sentence passes the summary test: it could not be written unchanged about a different tool
- [ ] All URLs present in the file resolve to the correct page (not 404, not redirected to a homepage)

---

## Section 2 — Package

- [ ] `version` is `X.Y.Z` format, no `v` prefix, matches current PyPI release
- [ ] `install` is the raw pip or conda command with no markdown formatting
- [ ] `import_as` is the canonical import statement used in production code
- [ ] `summary` is ≤ 150 characters and answers "what does this do and why reach for it?"
- [ ] At least one `tasks[]` entry exists
- [ ] `alternatives[]` entries use ContentRef format `{"id": "...", "type": "..."}`

### Per task entry

Run for every item in `tasks[]`:

- [ ] `task` is a noun phrase describing the engineering goal, not a function name
- [ ] `mental_trigger` starts with "I need to" and describes a specific engineering thought
- [ ] `mental_trigger` is specific enough to distinguish this task from other tasks in the same package
- [ ] `syntax` shows function signatures with parameter names, not concrete example values
- [ ] `syntax` includes all primary functions relevant to this task (not just one)
- [ ] `important_params` has at most 5 entries
- [ ] Each `important_params` entry uses em dash format: `param_name — explanation`
- [ ] Each `important_params` entry explains what the parameter controls and when to set it, not just its name
- [ ] `example` contains raw runnable Python with no import statement and no markdown fencing
- [ ] `example` uses realistic variable names and shows the result shape where relevant
- [ ] `use_when` contains at least one specific technical condition, not a generic statement
- [ ] `avoid_when` names a specific alternative when recommending against this task
- [ ] `decision_notes`, if present, contains a non-obvious insight not already covered by `use_when`/`avoid_when`
- [ ] Each `gotchas` entry describes a silent failure (wrong result, not an error)
- [ ] Each `gotchas` entry is non-obvious from the function signature or documentation
- [ ] `official_docs` is a direct function/method page URL, not a library homepage
- [ ] `official_docs` URL resolves to a page whose heading matches the function being documented
- [ ] `related_workflows` contains only IDs that exist in `data/workflows/`
- [ ] `related_cheatsheets` contains only IDs that exist in `data/cheatsheets/`

---

## Section 3 — Model

- [ ] `category` is exactly one of: `ml` `dl` `llm` — matches the subfolder the file is in
- [ ] `problem_types` contains at least one value from the 7-value enum
- [ ] Every value in `problem_types` is from the enum: `classification` `regression` `clustering` `generation` `embedding` `detection` `segmentation`
- [ ] `summary` describes the core mechanism, not a list of features
- [ ] `use_when` contains at least one measurable threshold or specific problem characteristic
- [ ] `avoid_when` names a specific alternative model or approach
- [ ] `pros` has at least 2 entries, each describing a specific technical advantage
- [ ] `cons` has at least 2 entries, each describing a specific technical disadvantage
- [ ] No entry in `pros` or `cons` would apply equally to most models in the same category
- [ ] `key_hyperparams` covers the 2–4 parameters most likely to be tuned in practice
- [ ] Each `key_hyperparams[].default` is the correct type: number, string, or null — not a description
- [ ] `training_speed`, `inference_speed`, `memory_usage`, `interpretability` are all present and use correct enum values
- [ ] `quick_start` is raw multi-line Python with no markdown fencing and no placeholder values
- [ ] `alternatives[]` uses ContentRef format
- [ ] `related_workflows` contains only IDs that exist in `data/workflows/`
- [ ] `competitors[]`, if present, uses ContentRef format and does not duplicate `alternatives[]`
- [ ] `decision_notes`, if present, explains why to choose this model over the entries in `alternatives[]`

---

## Section 4 — Workflow

- [ ] `type` is exactly one of: `pipeline` `snippet`
- [ ] `category` is a capitalised string matching the workflow's domain (e.g. `"Inference"`, `"Training"`)
- [ ] `overview` is 2–4 sentences and justifies when to use this workflow over alternatives
- [ ] `starter_stack` lists the primary packages and models used across the entire workflow
- [ ] Steps are numbered from 1 with no gaps
- [ ] At least 3 steps exist for `pipeline` type workflows
- [ ] `common_failure_points` has at least 2 entries covering cross-cutting failures

### Per step entry

Run for every item in `steps[]`:

- [ ] `step` matches the step's position in the array (step 1 is index 0, step 2 is index 1)
- [ ] `name` is a short title that identifies the step unambiguously
- [ ] `what` describes the operation performed, not the decision to be made
- [ ] `tools` lists the specific classes or functions used at this step
- [ ] `decision` contains at least one concrete value, threshold, or model name
- [ ] `decision` is not a restatement of `what`
- [ ] `uses.packages` contains only IDs that exist in `data/packages/`
- [ ] `uses.models` contains only IDs that exist in `data/models/` (any subfolder)
- [ ] `uses.cheatsheets` contains only IDs that exist in `data/cheatsheets/`
- [ ] `failure_points` has at least 1 entry for any step involving an external model, API, or file I/O
- [ ] Each `failure_points` entry describes what goes wrong and why, not what to do about it
- [ ] Each `failure_points` entry describes a non-obvious failure (not "make sure to install the library")

### Workflow root fields

- [ ] `next_links`, if present, contains only IDs that exist in `data/workflows/`
- [ ] `next_links` has at most 3 entries, each representing a genuine "what comes next" relationship

---

## Section 5 — Cheatsheet

- [ ] `id` ends with `-cheatsheet`
- [ ] At least 5 entries exist (a cheatsheet with fewer entries is not useful as a reference card)
- [ ] Entries are ordered by frequency of use, not by API structure or alphabetical order

### Per entry

Run for every item in `entries[]`:

- [ ] `problem` is a noun phrase, not a question and not an imperative instruction
- [ ] `problem` is specific enough to distinguish this entry from adjacent entries in the same cheatsheet
- [ ] `trigger` names the specific engineering situation, not just the general topic
- [ ] `snippet` is raw runnable Python with no import statement and no markdown fencing
- [ ] `snippet` shows at least one complete, realistic call (not just a function name)
- [ ] Inline comments in `snippet` show output shapes or clarify non-obvious behaviour where useful
- [ ] `minimal_notes` is exactly one sentence
- [ ] `minimal_notes` states the single most important thing to remember — not a summary of the snippet
- [ ] `common_bug` describes a specific silent failure, not an obvious error
- [ ] `common_bug` is different from what `minimal_notes` already covers
- [ ] `docs_url` is a specific function/method page URL, not a homepage
- [ ] `docs_url` URL resolves correctly

---

## Section 6 — Registry

- [ ] The file is a JSON array `[...]` at the top level, not an object
- [ ] `task` value is singular and from the enum: `embedding` `reranker` `vision` `speech` `llm` `multimodal` `ocr`
- [ ] `task` value matches the file it is in (embedding entries in `embeddings.json`, etc.)
- [ ] `size_mb` is a JSON number (integer), not a string
- [ ] `size_mb` was calculated from the actual model file sizes, not from a rounded estimate
- [ ] `link` is either a valid internal app route (starting with `/`) or a `MissingModelRef` object
- [ ] If `link` is a path, the model page it points to exists in `data/models/`
- [ ] If `link` is a `MissingModelRef`, the object has `type`, `id`, and `reason` fields

---

## Section 7 — Cross-links (all content types)

Run this section for any entry that contains cross-link fields.

### ID validity

- [ ] Every ID in every cross-link field exists in `data/` — verified by checking the actual directory, not assumed
- [ ] No entry references its own ID in any cross-link field

### Format correctness

- [ ] `alternatives[]` entries use ContentRef objects: `{"id": "...", "type": "..."}`
- [ ] `competitors[]` entries use ContentRef objects: `{"id": "...", "type": "..."}`
- [ ] `related_workflows`, `related_cheatsheets`, `next_links`, `uses.packages`, `uses.models`, `uses.cheatsheets` use plain string arrays
- [ ] ContentRef `type` values are from the enum: `model` `package` `workflow` `cheatsheet` `registry`
- [ ] ContentRef field order is `id` first, `type` second

### Link quality

- [ ] Every cross-link represents a genuine navigation need (the engineer would actually click it)
- [ ] No cross-links added for completeness — each one was justified before being added
- [ ] `alternatives[]` and `competitors[]` do not contain the same target ID
- [ ] Reciprocal links checked: if this entry links to B, verified whether B should link back
- [ ] Cardinality limits respected:
  - `related_workflows` per task: ≤ 3
  - `related_cheatsheets` per task: ≤ 2
  - `alternatives[]` total: ≤ 5
  - `competitors[]` total: ≤ 3
  - `next_links[]` total: ≤ 3

---

## Section 8 — Before committing

Run once after all per-entry checks pass:

- [ ] The file passes `npm run validate` with no errors
- [ ] The filename matches the `id` field exactly
- [ ] The file is in the correct subdirectory for its content type and category
- [ ] For Model entries: the subfolder (`ml/`, `dl/`, `llm/`) matches the `category` field
- [ ] For Registry entries: the filename (plural) matches the `task` field (singular) per the mapping in `05-naming-conventions.md`
- [ ] No existing cross-links in other files were broken by this addition (check `related_workflows`, `related_cheatsheets`, `uses.*` in other files that reference this entry's ID)
- [ ] If `updated_at` was changed, the change reflects a substantive content update, not a formatting fix

---

## Failure severity reference

Not all failures are equal. When auditing existing content, prioritise fixes in this order:

**Critical — fix before the entry is usable:**
- Broken cross-link IDs (point to non-existent entries)
- Wrong enum values (will cause rendering failures)
- Markdown fencing in code fields (renders as literal characters)
- `sources` containing non-URL strings (fails Zod validation)
- `official_docs` or `docs_url` pointing to a homepage instead of a specific page

**High — fix before the next content update cycle:**
- Stale version numbers (misleads the engineer about API compatibility)
- Generic `use_when` / `avoid_when` with no technical specifics
- `mental_trigger` not in first-person or not specific to this task
- `decision` fields in workflow steps with no concrete values or thresholds
- `common_bug` describing an obvious error rather than a silent failure

**Medium — fix during routine maintenance:**
- Missing reciprocal cross-links
- `important_params` entries with no explanation (just the parameter name)
- `gotchas` entries that describe errors rather than silent failures
- `quick_start` using placeholder variable names instead of realistic ones

**Low — fix when the entry is next updated for other reasons:**
- Field ordering not matching canonical order
- `name` casing not matching official branding exactly
- `summary` slightly over 150 characters
- Missing optional cross-links that would be genuinely useful
