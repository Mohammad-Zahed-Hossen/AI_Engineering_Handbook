
---

# AENS Skill Design Specification (SDS)

**Version:** 1.0 — Pre-Implementation  
**Status:** Architecture Design Phase  
**Scope:** Claude Skill ecosystem for AENS content generation and maintenance

---

## Part 1 — Preliminary: Challenging Your Proposed Pipeline

Before designing anything, I need to address a flaw in your proposed pipeline.

Your pipeline is:

```
Idea → Content Planning → Research Collection → Dependency Discovery
  → Content Authoring → Cross-Linking → Quality Review → Validation → Done
```

**The problem:** This is a waterfall. It looks clean on paper but it breaks in practice for two reasons.

First, Research Collection and Dependency Discovery are not sequential. You cannot discover dependencies before you understand the content shape, and you cannot finalize the content shape before you know what cross-links exist. These two stages are circular and must be treated as a single concurrent phase.

Second, Cross-Linking is not a separate stage. It happens during authoring. The `related_workflows`, `related_cheatsheets`, `uses.packages`, `uses.models` fields are embedded inside each content item. Making cross-linking a post-authoring step means the author has to go back and edit already-written JSON, which creates schema violations and double-work.

**Revised pipeline:**

```
Idea
 ↓
Content Planning          ← Scope, content type, ID, placement decision
 ↓
Research + Discovery      ← Research + dependency scan happen together
 ↓
Authoring                 ← Write JSON with cross-links inline
 ↓
Schema Validation         ← Automated: npm run validate
 ↓
Knowledge Integration     ← Registry update + nav consistency check
 ↓
Done
```

This is the pipeline the Skill ecosystem will implement.

---

## Part 2 — Content Type Inventory

Based on actual file inspection of your project, AENS has exactly 5 primary content types and 1 secondary content type:

| Type | Location | Zod Schema File | Auto-discovered |
|---|---|---|---|
| Package | `data/packages/*.json` | `lib/schemas/package.ts` | Yes |
| Model | `data/models/{ml\|dl\|llm}/*.json` | `lib/schemas/model.ts` | Yes |
| Workflow | `data/workflows/*.json` | `lib/schemas/workflow.ts` | Yes |
| Cheatsheet | `data/cheatsheets/*.json` | `lib/schemas/cheatsheet.ts` | Yes |
| Registry Entry | `data/registry/{task}.json` (arrays) | `lib/schemas/registry.ts` | No (manual append) |

The Registry is architecturally different from the other four. Packages, Models, Workflows, and Cheatsheets are each a standalone JSON file. Registry entries are elements appended to an existing task-specific array file. This distinction has direct consequences for Skill design.

---

## Part 3 — Skill Architecture Decision

### 3.1 The Core Design Question

Your proposed 8-skill list has a structural problem: **Package Author**, **Model Author**, **Workflow Author**, and **Cheatsheet Author** are four skills that do nearly the same job with different schemas. If you implement them as four separate skills, you are duplicating:

- The research methodology
- The cross-link resolution logic  
- The validation instructions
- The writing quality rules
- The gotcha/failure-point authoring guidance

That is a maintenance burden. When you change a writing rule, you change it in four places.

The alternative extreme, a single "Content Author" skill, is too broad. It cannot fit all four schemas in one SKILL.md without blowing past the 500-line limit, and it forces Claude to load schema details it does not need for a given task.

**Decision: Two-tier architecture.**

- **Tier 1: Orchestrator Skills** — Receive intent, make decisions, coordinate.
- **Tier 2: Schema Skills** — Know exactly one content type's schema and how to write it well.

Tier 1 skills are general. Tier 2 skills are narrow. Claude loads only what it needs.

### 3.2 Final Skill List

After analyzing the actual schemas, content examples, and maintenance requirements, here is the final skill roster:

| Skill | Tier | Responsibility |
|---|---|---|
| `aens-content-planner` | Orchestrator | Classify intent, validate placement, assign the right authoring skill |
| `aens-research-collector` | Shared Tool | Research a package/model/workflow and return structured research notes |
| `aens-package-author` | Schema Skill | Write a complete, valid Package JSON |
| `aens-model-author` | Schema Skill | Write a complete, valid Model JSON |
| `aens-workflow-author` | Schema Skill | Write a complete, valid Workflow JSON |
| `aens-cheatsheet-author` | Schema Skill | Write a complete, valid Cheatsheet JSON |
| `aens-registry-manager` | Schema Skill | Append a valid entry to the correct registry task array |
| `aens-content-reviewer` | Quality Gate | Review any authored content against shared quality rules before output |
| `aens-cross-link-resolver` | Shared Tool | Scan existing content and return valid IDs for cross-link fields |

**Total: 9 skills.** I added `aens-cross-link-resolver` because cross-linking requires scanning `data/` directories, which is a concrete repeatable operation that every Schema Skill needs. It belongs in its own skill rather than duplicated across four authoring skills.

I eliminated "Registry Manager" as a standalone post-authoring step and absorbed it as a dedicated Schema Skill, because registry entries require their own distinct schema (`RegistryTask` enum, `model_id` format, `last_verified`, `dimension`, etc.) and cannot be generated by the Package or Model author skills.

---

## Part 4 — Individual Skill Specifications

---

### Skill 1: `aens-content-planner`

**Tier:** Orchestrator  
**Purpose:** The entry point for all content requests. It does not write content. It decides what type of content is being requested, whether it belongs in AENS, where it goes, and which downstream skill should handle it.

**Responsibilities:**
- Parse the user's intent (natural language request)
- Classify the request into one of: Package, Model, Workflow, Cheatsheet, Registry Entry, or Invalid
- For Model requests: determine the correct subcategory (`ml`, `dl`, `llm`)
- For Registry requests: determine the correct task enum (`embedding`, `reranker`, `vision`, `speech`, `llm`, `multimodal`, `ocr`)
- Validate that the proposed ID does not conflict with existing files
- Confirm the kebab-case ID before authoring begins
- Hand off to the correct authoring skill with a structured planning brief

**Non-responsibilities:**
- Does NOT write any JSON
- Does NOT conduct research
- Does NOT validate schemas
- Does NOT assess content quality

**Inputs:**
- User's natural language request (e.g., "Add scikit-learn as a package", "Add Phi-3 Mini as a model")
- Optional: user-specified ID, version, category hint

**Outputs:**
A structured Planning Brief containing:
```
content_type: package | model | workflow | cheatsheet | registry
proposed_id: kebab-case string
file_path: exact relative path to create or append
subcategory: ml | dl | llm (model only)
task: embedding | reranker | ... (registry only)
skill_to_invoke: aens-package-author | aens-model-author | ...
research_needed: true | false
notes: any edge cases the authoring skill should know
```

**Trigger conditions:**
- User says "add X", "create a new entry for Y", "I want to document Z"
- User asks where a new tool/model/workflow should go
- User asks for help starting a new AENS content item

**Interactions with other skills:**
- Calls `aens-cross-link-resolver` to check for ID conflicts and retrieve existing related IDs
- Produces the brief that `aens-research-collector` and the relevant authoring skill consume

**Required reference documents:**
- `doc/PROJECT_RULES.md` (content types and folder structure)
- `doc/CONTENT_ADDING.md` (placement rules)
- `doc/content_guidelines.md` (ID format rules)
- Shared reference: `skills/references/content-taxonomy.md` (see Part 5)

**Required checklists:**
- ID format validation: matches `^[a-z0-9][a-z0-9-]*[a-z0-9]$`
- ID conflict check: proposed ID does not exist in any `data/` subdirectory
- Category correctness check: model subcategory matches ProblemType

**Failure cases:**
- Request is ambiguous (e.g., "add transformers" — package or cheatsheet?)
  - Action: Ask one clarifying question
- Proposed ID already exists
  - Action: Report conflict, suggest alternative or ask if this is an update
- Content type is invalid (e.g., user wants to add a blog post, tutorial, or dataset)
  - Action: Explain AENS scope, decline

**Success criteria:**
- Planning Brief is produced with all fields populated
- Correct authoring skill is identified
- No downstream skill receives ambiguous or incomplete inputs

---

### Skill 2: `aens-research-collector`

**Tier:** Shared Tool  
**Purpose:** Conduct focused research on a single package, model, or workflow and return structured research notes that the authoring skills can consume directly.

**Responsibilities:**
- Search for current, accurate technical information about the subject
- Identify the official documentation URL
- Identify the official GitHub repository URL (if it exists)
- Find the current stable version (for packages)
- Find the Hugging Face model ID (for models and registry entries)
- Identify the size in MB and embedding dimension (for registry entries)
- Extract core use cases, gotchas, and failure modes from documentation
- Produce research notes in a structured format tied to the target schema

**Non-responsibilities:**
- Does NOT write the final JSON
- Does NOT enforce schema constraints (that is the authoring skill's job)
- Does NOT make cross-linking decisions
- Does NOT validate IDs

**Inputs:**
- Planning Brief from `aens-content-planner`
- Target content type (to know what fields need research)

**Outputs:**
Structured Research Notes containing:
```
subject: string
content_type: package | model | workflow | cheatsheet | registry
official_docs_url: string
github_repo: string | null
version: string (packages only)
model_id: string (models and registry only)
size_mb: number (registry only)
dimension: number | null (registry embeddings only)
summary: string (1-2 sentences)
use_cases: string[]
avoid_cases: string[]
key_gotchas: string[]
sources: string[] (verified URLs)
raw_notes: string (freeform research)
```

**Trigger conditions:**
- Invoked by `aens-content-planner` when `research_needed: true`
- User explicitly says "research X before writing it"
- User provides a URL and asks to extract content from it

**Interactions with other skills:**
- Feeds directly into: `aens-package-author`, `aens-model-author`, `aens-workflow-author`, `aens-cheatsheet-author`, `aens-registry-manager`

**Required reference documents:**
- Shared reference: `skills/references/research-standards.md` (see Part 5)

**Required checklists:**
- Sources must contain at least one valid URL
- `official_docs_url` must be the direct documentation page, not the homepage
- Version string must match `X.Y.Z` (no `v` prefix)
- `model_id` must match HuggingFace Hub format (`Author/ModelName`) or vendor naming convention

**Failure cases:**
- Subject cannot be found online (obscure or internal tool)
  - Action: Return partial research notes, flag fields that are missing, ask user to supply them manually
- Documentation URL redirects to a deprecated page
  - Action: Flag in notes, provide best available URL

**Success criteria:**
- All fields the target authoring skill needs are populated or explicitly flagged as missing
- All sources are valid, working URLs

---

### Skill 3: `aens-package-author`

**Tier:** Schema Skill  
**Purpose:** Generate a complete, schema-valid Package JSON file for `data/packages/{id}.json`.

**Responsibilities:**
- Produce the full Package JSON matching `lib/schemas/package.ts` exactly
- Write `tasks[]` array entries that follow the task-based schema (not the old `sections[]` schema)
- For each task: populate all 11 required fields (`task`, `mental_trigger`, `syntax`, `important_params`, `example`, `use_when`, `avoid_when`, `decision_notes`, `gotchas`, `official_docs`, `related_workflows`, `related_cheatsheets`)
- Ensure `syntax` uses multi-line function signature format, not concrete examples
- Ensure `example` is raw Python code without markdown fencing
- Ensure `important_params` has at most 5 entries
- Populate cross-link fields using IDs from `aens-cross-link-resolver`
- Include `alternatives` as `ContentRef[]` objects

**Non-responsibilities:**
- Does NOT conduct research (that is `aens-research-collector`'s job)
- Does NOT write registry entries for the package
- Does NOT modify existing files

**Inputs:**
- Planning Brief (from `aens-content-planner`)
- Research Notes (from `aens-research-collector`)
- Cross-link map (from `aens-cross-link-resolver`)

**Outputs:**
- Complete Package JSON string, ready to save as `data/packages/{id}.json`
- File path annotation: `# Save as: data/packages/{id}.json`

**Trigger conditions:**
- Planning Brief has `content_type: package`
- User says "write the package JSON for X"

**Interactions with other skills:**
- Consumes: `aens-research-collector`, `aens-cross-link-resolver`
- Sends output to: `aens-content-reviewer`

**Required reference documents:**
- `lib/schemas/package.ts` (Zod schema — authoritative)
- Shared reference: `skills/references/writing-standards.md`
- Shared reference: `skills/references/schema-field-guide.md` (package section)

**Required checklists:**
- All 11 `PackageTaskSchema` fields present per task
- No markdown fencing in `example`, `syntax`, `install`, `import_as`
- `important_params` count <= 5
- `official_docs` is a direct function/module URL, not a homepage
- `id` matches kebab-case regex
- `version` matches `X.Y.Z` without `v` prefix
- `alternatives` uses `ContentRef` format `{ id: string, type: string }`
- `sources` has at least one URL
- `created_at` and `updated_at` are `YYYY-MM-DD`

**Failure cases:**
- Research notes are incomplete for a required field
  - Action: Flag the gap and generate a placeholder comment, do not invent data
- Cross-link IDs are invalid (not found in existing content)
  - Action: Leave `related_workflows: []`, `related_cheatsheets: []` rather than use invalid IDs

**Success criteria:**
- Output passes `npm run validate` without errors
- All `tasks[]` entries have concrete, engineering-accurate content (not generic descriptions)
- `mental_trigger` is phrased as "I need to..." (first-person engineering thought)

---

### Skill 4: `aens-model-author`

**Tier:** Schema Skill  
**Purpose:** Generate a complete, schema-valid Model JSON file for `data/models/{ml|dl|llm}/{id}.json`.

**Responsibilities:**
- Produce the full Model JSON matching `lib/schemas/model.ts`
- Determine correct `category` from `ModelCategorySchema`: `ml`, `dl`, or `llm`
- Populate `problem_types[]` strictly from the 7-value enum: `classification`, `regression`, `clustering`, `generation`, `embedding`, `detection`, `segmentation`
- Write engineering-accurate `pros[]` and `cons[]` (not marketing claims)
- Write `use_when` and `avoid_when` as concise decision rules, not generic descriptions
- Populate `key_hyperparams[]` with correct default types (string, number, or null — never descriptions)
- Write `quick_start` as raw Python code without markdown fencing
- Populate `related_workflows[]` with existing workflow IDs
- Set `training_speed`, `inference_speed` from `SpeedRatingSchema`: `fast`, `medium`, `slow`
- Set `memory_usage` from `SizeRatingSchema`: `low`, `medium`, `high`
- Set `interpretability` from `InterpretabilityRatingSchema`: `high`, `medium`, `low`

**Non-responsibilities:**
- Does NOT create registry entries (that requires `aens-registry-manager`)
- Does NOT write cheatsheet content for the model's library

**Inputs:**
- Planning Brief
- Research Notes
- Cross-link map

**Outputs:**
- Complete Model JSON string, ready to save as `data/models/{category}/{id}.json`

**Required reference documents:**
- `lib/schemas/model.ts` (authoritative)
- Shared reference: `skills/references/schema-field-guide.md` (model section)
- Shared reference: `skills/references/writing-standards.md`

**Required checklists:**
- `category` is exactly `ml`, `dl`, or `llm`
- `problem_types[]` values are within the 7-element enum
- `training_speed`, `inference_speed` values are `fast | medium | slow`
- `memory_usage` is `low | medium | high`
- `interpretability` is `high | medium | low`
- `key_hyperparams[].default` is a string, number, or null (never a description string)
- `quick_start` has no markdown fencing
- `alternatives[]` uses `ContentRef` format

**Failure cases:**
- Model has a problem type not in the enum (e.g., ranking, translation)
  - Action: Map to closest enum value, note the mapping in `decision_notes`
- Model category is ambiguous (e.g., a fine-tuned LLM for classification)
  - Action: Default to the primary architecture type, not the task

**Success criteria:**
- Output passes `npm run validate`
- `use_when` and `avoid_when` contain measurable thresholds (VRAM, latency, accuracy benchmarks), not vague language

---

### Skill 5: `aens-workflow-author`

**Tier:** Schema Skill  
**Purpose:** Generate a complete, schema-valid Workflow JSON file for `data/workflows/{id}.json`.

**Responsibilities:**
- Produce the full Workflow JSON matching `lib/schemas/workflow.ts`
- Write `steps[]` as 1-indexed sequential integers (never 0-indexed)
- For each step: populate `step`, `name`, `what`, `tools`, `decision`, `uses`, `failure_points`
- Write `uses` cross-links using real IDs from `aens-cross-link-resolver`
- Write `decision` fields as engineering decision rules, not descriptions of what the step does
- Write `failure_points[]` as concrete failure scenarios with root causes
- Write `common_failure_points[]` as top-level cross-cutting failures not specific to one step
- Populate `evaluation_checks[]` if the workflow has measurable success criteria
- Set `type` from `WorkflowTypeSchema`: `pipeline` or `snippet`

**Non-responsibilities:**
- Does NOT write package pages for tools mentioned in the workflow
- Does NOT create model pages for models referenced in the workflow

**Inputs:**
- Planning Brief
- Research Notes
- Cross-link map

**Outputs:**
- Complete Workflow JSON string, ready to save as `data/workflows/{id}.json`

**Required reference documents:**
- `lib/schemas/workflow.ts` (authoritative)
- Shared reference: `skills/references/schema-field-guide.md` (workflow section)
- Shared reference: `skills/references/writing-standards.md`

**Required checklists:**
- `steps[]` starts at 1 and increments without gaps
- `uses.packages[]`, `uses.models[]`, `uses.cheatsheets[]` contain valid existing IDs (or empty arrays)
- `decision` field is a decision rule, not a step description (different from `what`)
- `type` is exactly `pipeline` or `snippet`
- `failure_points[]` has at least one entry per step for non-trivial steps

**Failure cases:**
- Workflow has more than 10 steps
  - Action: Flag for review — consider splitting into sub-workflows or ask if this is intentional
- Cross-link IDs reference content that does not exist yet
  - Action: Leave the array empty, add a note that the cross-link should be added once the referenced content is created

**Success criteria:**
- Output passes `npm run validate`
- `decision` fields contain measurable baselines (e.g., "chunk_size=512, overlap=10%")

---

### Skill 6: `aens-cheatsheet-author`

**Tier:** Schema Skill  
**Purpose:** Generate a complete, schema-valid Cheatsheet JSON file for `data/cheatsheets/{id}.json`.

**Responsibilities:**
- Produce the full Cheatsheet JSON matching `lib/schemas/cheatsheet.ts`
- Write `entries[]` with all required fields: `problem`, `trigger`, `snippet`, `minimal_notes`, `common_bug`, `docs_url`
- Write `problem` as an engineering task description ("Create array from list / pre-allocate buffer")
- Write `trigger` as an engineering scenario ("Converting Python data to NumPy or initializing a fixed-shape output")
- Write `snippet` as raw, runnable code without markdown fencing
- Write `minimal_notes` as the single most critical thing to remember (one sentence)
- Write `common_bug` as a real, non-obvious silent failure
- Write `docs_url` as the direct function documentation URL

**Non-responsibilities:**
- Does NOT duplicate Package content — the Cheatsheet is a fast-reference companion, not a replacement
- Does NOT include `import` statements in snippets (the package `import_as` covers this)

**Inputs:**
- Planning Brief
- Research Notes (especially `key_gotchas` section)
- Existing Package JSON for the same library (to align coverage without duplication)

**Outputs:**
- Complete Cheatsheet JSON string, ready to save as `data/cheatsheets/{id}.json`

**Required reference documents:**
- `lib/schemas/cheatsheet.ts` (authoritative)
- Shared reference: `skills/references/schema-field-guide.md` (cheatsheet section)
- Shared reference: `skills/references/writing-standards.md`

**Required checklists:**
- No markdown fencing in `snippet`
- No `import` statements in `snippet`
- `common_bug` describes a real silent failure, not an obvious syntax error
- `docs_url` is a direct function/method URL

**Failure cases:**
- A cheatsheet entry would duplicate a Package task entry word-for-word
  - Action: Keep the cheatsheet entry shorter and more condensed — it is a quick-reference card, not a detailed guide

**Success criteria:**
- Output passes `npm run validate`
- Every `snippet` is self-contained and runnable without the import line
- `common_bug` entries are non-obvious (not "you forgot to import numpy")

---

### Skill 7: `aens-registry-manager`

**Tier:** Schema Skill  
**Purpose:** Generate a valid Registry entry object and append it to the correct `data/registry/{task}.json` array file.

This skill is architecturally different from the other authoring skills. It does not create a new file. It appends to an existing array.

**Responsibilities:**
- Produce a single `RegistryModel` object matching `lib/schemas/registry.ts`
- Determine the correct task enum: `embedding`, `reranker`, `vision`, `speech`, `llm`, `multimodal`, `ocr`
- Populate `model_id` in HuggingFace format (`Author/ModelName`) or vendor format for API models
- Populate `dimension` (number, not string) for embedding models; omit for others
- Populate `size_mb` as a number (megabytes, not gigabytes, not strings)
- Set `status` from `ModelStatus`: `active`, `experimental`, `deprecated`
- Write `quick_start` as raw Python code without markdown fencing
- Populate `alternatives[]` as `ContentRef[]`
- Set `last_verified` as today's `YYYY-MM-DD` date
- Output the JSON object and specify exactly which array file to append it to

**Non-responsibilities:**
- Does NOT create a `data/models/` entry — Registry and Models are separate concepts
- Does NOT modify any other file besides the target registry array

**Inputs:**
- Planning Brief (must include resolved `task` field)
- Research Notes (must include `model_id`, `size_mb`, `dimension` if applicable)

**Outputs:**
- Registry entry JSON object
- Instruction: "Append this object to `data/registry/{task}.json`"

**Required reference documents:**
- `lib/schemas/registry.ts` (authoritative)
- Shared reference: `skills/references/schema-field-guide.md` (registry section)

**Required checklists:**
- `task` matches exactly one of the 7 `RegistryTask` enum values (not pluralized)
- `size_mb` is a raw number, not a string
- `dimension` is a raw number or omitted (never `"768 dimensions"`)
- `model_id` follows HuggingFace `Author/ModelName` format or vendor convention
- `status` is exactly `active`, `experimental`, or `deprecated`
- `last_verified` is today's date in `YYYY-MM-DD`
- `quick_start` has no markdown fencing

**Failure cases:**
- `task` enum cannot be determined from the model type
  - Action: Present the 7 options to the user, ask them to select
- The `dimension` for an embedding model is not findable
  - Action: Flag it, ask the user to verify from the model card

**Success criteria:**
- The output object, when manually appended to the correct array file, passes `npm run validate`

---

### Skill 8: `aens-cross-link-resolver`

**Tier:** Shared Tool  
**Purpose:** Scan the existing content in `data/` and return valid IDs for cross-link fields, and check for ID conflicts.

**Responsibilities:**
- Scan `data/packages/` and return all existing package IDs
- Scan `data/models/{ml,dl,llm}/` and return all existing model IDs
- Scan `data/workflows/` and return all existing workflow IDs
- Scan `data/cheatsheets/` and return all existing cheatsheet IDs
- Scan all `data/registry/*.json` arrays and return all existing registry IDs
- Given a proposed new ID, check for conflicts
- Given a list of candidate IDs (from research notes), validate which ones actually exist
- Return a structured cross-link map ready for authoring skills to consume

**Non-responsibilities:**
- Does NOT write anything
- Does NOT read file content, only file names (for ID discovery)
- Does NOT make cross-link recommendations — it only validates

**Inputs:**
- Proposed new content ID (for conflict detection)
- List of candidate related IDs from research (for validation)

**Outputs:**
```
id_conflict: true | false
existing_ids: {
  packages: string[]
  models: string[]
  workflows: string[]
  cheatsheets: string[]
  registry: string[]
}
validated_cross_links: {
  related_workflows: string[]   (only IDs that actually exist)
  related_cheatsheets: string[] (only IDs that actually exist)
  uses_packages: string[]
  uses_models: string[]
  alternatives: ContentRef[]
}
```

**Trigger conditions:**
- Always invoked by `aens-content-planner` at the start of every content request
- Invoked by authoring skills before finalizing cross-link fields

**Required reference documents:**
- `doc/PROJECT_RULES.md` (folder structure reference)

**Failure cases:**
- A candidate cross-link ID does not exist in any content directory
  - Action: Exclude it from `validated_cross_links`, add to a `missing_ids[]` list so the user knows to create that content later

**Success criteria:**
- No invalid IDs appear in any cross-link field of authored content
- No two content items in the same directory share an ID

---

### Skill 9: `aens-content-reviewer`

**Tier:** Quality Gate  
**Purpose:** Review any authored JSON content against shared quality rules before it is presented to the user as final output. This is the last step before "Done".

**Responsibilities:**
- Check schema compliance (field presence, types, enum values)
- Check content quality (gotchas are non-obvious, decisions contain measurable baselines, `use_when`/`avoid_when` have technical parameters)
- Check writing standards (no markdown fencing in code fields, first-person `mental_trigger`, decision language in `decision` fields)
- Check cross-link integrity (all referenced IDs are valid)
- Check metadata completeness (`created_at`, `updated_at`, `sources`)
- Report issues by severity: Critical (schema violation), High (quality issue), Low (style)
- Output a Reviewer Report alongside the reviewed content

**Non-responsibilities:**
- Does NOT rewrite content — it reports issues for the authoring skill to fix
- Does NOT run `npm run validate` — it approximates that check for Claude-side pre-validation

**Inputs:**
- Authored JSON content from any Schema Skill
- Content type (to apply the correct checklist)

**Outputs:**
```
status: pass | pass_with_warnings | fail
critical_issues: string[]   (schema violations — must fix before output)
high_issues: string[]       (quality problems — strongly recommended to fix)
low_issues: string[]        (style issues — optional to fix)
reviewed_content: string    (the JSON as reviewed, with inline comments if issues found)
```

**Trigger conditions:**
- Called by every authoring skill before it returns its final output
- Can be called directly by the user ("review this JSON before I commit it")

**Required reference documents:**
- Shared reference: `skills/references/quality-standards.md`
- Shared reference: `skills/references/schema-field-guide.md`
- Shared reference: `skills/references/writing-standards.md`

**Failure cases:**
- Critical issues found
  - Action: Return `status: fail`, list critical issues, do not output the JSON as final
  - The relevant authoring skill should fix the issues and re-submit to the reviewer

**Success criteria:**
- `status: pass` means the content is ready for `npm run validate`
- No critical issues in any output that reaches the user

---

## Part 5 — Shared Reference Documents

These are files that multiple skills reference. They encode all shared knowledge so it does not need to be repeated in each skill's SKILL.md body.

### 5.1 Folder Structure

```
.claude/
  skills/
    aens-content-planner/
      SKILL.md
    aens-research-collector/
      SKILL.md
    aens-package-author/
      SKILL.md
    aens-model-author/
      SKILL.md
    aens-workflow-author/
      SKILL.md
    aens-cheatsheet-author/
      SKILL.md
    aens-registry-manager/
      SKILL.md
    aens-cross-link-resolver/
      SKILL.md
    aens-content-reviewer/
      SKILL.md
    references/
      content-taxonomy.md
      schema-field-guide.md
      writing-standards.md
      research-standards.md
      quality-standards.md
```

The `references/` directory is shared. No skill duplicates information that lives there.

### 5.2 Reference File: `content-taxonomy.md`

Contents:
- The 5 content types and their file locations
- The ID format rule with regex
- The `ContentRef` format
- The `RegistryTask` enum values and which file each maps to
- The `ModelCategory` enum and which subdirectory each maps to
- Rules for when content belongs in AENS vs. does not

### 5.3 Reference File: `schema-field-guide.md`

Contents:
- Per-field guidance for every content type (condensed from `content_guidelines.md`)
- Common AI mistakes per field
- Field type rules (enums, number vs. string, array constraints)
- Cross-reference: which fields are authoritative (Zod schema) vs. advisory (guidelines doc)

This reference will have a table of contents because it will exceed 300 lines covering all 5 content types.

### 5.4 Reference File: `writing-standards.md`

Contents:
- No markdown fencing in code fields (the rule and why)
- `mental_trigger` must be phrased as "I need to..." (first-person engineer)
- `decision` vs. `what` distinction in workflow steps
- `gotchas` and `common_bug` must be non-obvious silent failures
- `use_when` and `avoid_when` must contain measurable technical parameters
- `pros` and `cons` must be specific technical statements, not marketing claims
- `summary` must be ≤150 characters
- Sources must be direct documentation URLs, not homepages

### 5.5 Reference File: `research-standards.md`

Contents:
- How to find the official stable version of a package
- How to find the HuggingFace model ID
- How to find embedding dimension from a model card
- How to find model size in MB
- How to identify the correct `RegistryTask` from a model description
- URL verification checklist (does the URL resolve? Is it the doc page or the homepage?)
- How to handle models with multiple size variants

### 5.6 Reference File: `quality-standards.md`

Contents:
- The full quality checklist used by `aens-content-reviewer`
- Severity definitions: Critical (breaks build), High (degrades usefulness), Low (style)
- Examples of passing and failing content for each quality dimension
- The 5-point validation checklist from `content_guidelines.md` (schema, metadata, no fencing, enum matching, numeric types)

---

## Part 6 — Architecture Diagrams

### 6.1 Overall Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     AENS Skill Ecosystem                        │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │                  ORCHESTRATION LAYER                    │  │
│   │                                                         │  │
│   │              aens-content-planner                       │  │
│   │         (entry point, classification, routing)          │  │
│   └─────────────────────────────────────────────────────────┘  │
│              │                          │                       │
│   ┌──────────▼───────────┐  ┌──────────▼────────────────┐     │
│   │  SHARED TOOLS LAYER  │  │  SHARED TOOLS LAYER       │     │
│   │                      │  │                           │     │
│   │ aens-research-       │  │ aens-cross-link-          │     │
│   │ collector            │  │ resolver                  │     │
│   └──────────┬───────────┘  └──────────┬────────────────┘     │
│              │                          │                       │
│   ┌──────────▼──────────────────────────▼────────────────────┐ │
│   │                    SCHEMA SKILLS LAYER                    │ │
│   │                                                           │ │
│   │  aens-package-    aens-model-    aens-workflow-           │ │
│   │  author           author         author                   │ │
│   │                                                           │ │
│   │  aens-cheatsheet- aens-registry-                         │ │
│   │  author           manager                                │ │
│   └──────────────────────────┬────────────────────────────── ┘ │
│                               │                                 │
│   ┌───────────────────────────▼──────────────────────────────┐ │
│   │                    QUALITY GATE LAYER                    │ │
│   │                                                          │ │
│   │                  aens-content-reviewer                   │ │
│   └──────────────────────────────────────────────────────────┘ │
│                               │                                 │
│                           Final Output                          │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Skill Interaction Diagram

```
User Request
     │
     ▼
aens-content-planner
     ├──────────────────────► aens-cross-link-resolver
     │                              │
     │                     existing IDs + conflict check
     │                              │
     │◄─────────────────────────────┘
     │
     ├──► (research_needed=true) ──► aens-research-collector
     │                                       │
     │                               Research Notes
     │                                       │
     │◄──────────────────────────────────────┘
     │
     ├──► Planning Brief + Research Notes + Cross-link Map
     │                    │
     │         ┌──────────┴────────────┐
     │         │    (by content_type)  │
     │         ▼                       ▼
     │   aens-package-author      aens-model-author
     │   aens-workflow-author     aens-cheatsheet-author
     │   aens-registry-manager
     │         │
     │         │  (authored JSON)
     │         ▼
     │   aens-content-reviewer
     │         │
     │    status=pass?
     │    ├── yes ──► Output JSON to user
     │    └── no  ──► Report issues, fix, re-review
     │
     ▼
  Done
```

### 6.3 End-to-End Execution Flow

Concrete example: "Add scikit-learn as a package"

```
Step 1  User: "Add scikit-learn as a package"
        → aens-content-planner triggers

Step 2  aens-content-planner
        → Classifies: content_type=package, proposed_id=scikit-learn
        → Calls aens-cross-link-resolver
          → Scans data/packages/ — no conflict found
          → Returns existing_ids for packages, models, workflows, cheatsheets
        → Checks: research_needed=true (no existing content)
        → Produces Planning Brief

Step 3  aens-research-collector
        → Searches: scikit-learn current version, official docs, GitHub
        → Extracts: version=1.5.2, docs=scikit-learn.org/stable, github=github.com/scikit-learn/scikit-learn
        → Identifies key tasks: fit, predict, cross_val_score, Pipeline, GridSearchCV, etc.
        → Produces Research Notes

Step 4  aens-package-author
        → Reads: Planning Brief + Research Notes + Cross-link map
        → Writes tasks[] array with mental_trigger, syntax, example, gotchas, etc.
        → Populates cross-links: related_workflows=["text-classification"], related_cheatsheets=["sklearn"]
        → Produces complete Package JSON

Step 5  aens-content-reviewer
        → Checks schema: all PackageTaskSchema fields present
        → Checks quality: gotchas are non-obvious, mental_triggers are first-person
        → Checks cross-links: "text-classification" and "sklearn" exist in data/
        → status: pass

Step 6  Output: Complete scikit-learn.json
        Instruction: Save as data/packages/scikit-learn.json
        Run: npm run validate
```

---

## Part 7 — Implementation Order

**Phase 1 — Foundation (implement first)**

1. `references/content-taxonomy.md` — Every skill depends on this
2. `references/schema-field-guide.md` — Every authoring skill depends on this
3. `references/writing-standards.md` — Every authoring skill depends on this
4. `aens-cross-link-resolver` — Needed by both planner and authoring skills

**Phase 2 — Orchestration**

5. `aens-content-planner` — Entry point for all requests

**Phase 3 — Research**

6. `references/research-standards.md` — Needed by research collector
7. `aens-research-collector` — Feeds into all authoring skills

**Phase 4 — Schema Skills (implement in priority order)**

8. `aens-package-author` — Highest content volume, test the pattern here first
9. `aens-model-author` — Second highest volume, shares pattern with package
10. `aens-workflow-author` — Most complex schema (step cross-links, uses{} object)
11. `aens-cheatsheet-author` — Simplest schema, implement last

**Phase 5 — Registry**

12. `aens-registry-manager` — Architecturally different (append not create), implement separately

**Phase 6 — Quality Gate**

13. `references/quality-standards.md`
14. `aens-content-reviewer` — Implement last, after you have real output from steps 8-12 to test against

**Rationale:** You cannot write a good reviewer without real authoring output to review. Build the authors first, generate 2-3 real content items with each, then build the reviewer checklist from actual defects found.

---

## Part 8 — Testing Strategy

### 8.1 Unit Testing (per skill)

For each Schema Skill, create 3 test prompts:

**Test A — Happy path:** Well-known library/model with complete online documentation  
**Test B — Edge case:** Obscure or recent library with limited documentation  
**Test C — Cross-link test:** Content that references existing AENS items (verify IDs are valid)

### 8.2 Integration Testing

Test the full pipeline end-to-end for each content type. After each pipeline run:
1. Save the output JSON to the correct `data/` location
2. Run `npm run validate`
3. Run `npm run build`
4. Verify the page renders correctly in the app

A skill is only considered stable when its output passes `npm run build` without manual correction.

### 8.3 Regression Testing

After modifying any skill, re-run all existing test prompts for that skill. Because the SKILL.md changes can affect behavior across all content types that skill touches.

### 8.4 Cross-link Integrity Testing

After adding any new content item, verify that all `related_workflows`, `related_cheatsheets`, `uses.packages`, `uses.models`, and `alternatives` fields reference IDs that actually exist in `data/`. The `npm run validate` script should ideally catch this — if it does not, that is a gap in the validator that should be fixed at the code level, not compensated for in the skills.

---

## Part 9 — Maintenance Strategy

### 9.1 Schema Evolution

When `lib/schemas/*.ts` changes (new fields, removed fields, changed enums), the corresponding `skills/references/schema-field-guide.md` section must be updated. This is the only place the schema rules live for the Skill ecosystem. Do not duplicate them in individual SKILL.md files.

### 9.2 Content Guidelines Evolution

When `doc/content_guidelines.md` changes, update `skills/references/schema-field-guide.md` and `skills/references/writing-standards.md`. The references are the abstraction layer between the project docs and the skills.

### 9.3 New Content Types

If a new content type is added to AENS (e.g., `data/papers/`, `data/tools/`):
1. Add the type to `references/content-taxonomy.md`
2. Add a section to `references/schema-field-guide.md`
3. Create a new Schema Skill (e.g., `aens-paper-author`)
4. Update `aens-content-planner` to recognize and route the new type
5. Update `aens-cross-link-resolver` to scan the new directory
6. Update `aens-content-reviewer` to include the new content type's quality checklist

The orchestration and shared tool skills are designed to be extended, not rewritten.

### 9.4 Skill Versioning

When a skill's SKILL.md changes significantly, note the change at the top of the file with a date. Do not create separate versioned skill folders — AENS is a solo system, not a multi-team product. A simple change log comment in the frontmatter is sufficient.

---

## Part 10 — Self-Critique

Here is an honest assessment of where this design has weaknesses.

**Problem 1: The reviewer cannot actually run `npm run validate`**

`aens-content-reviewer` approximates schema validation by reading the schema field guide. It cannot execute TypeScript/Zod. This means it can miss subtle validation failures — especially enum value mismatches, numeric type violations, and regex failures. The reviewer is a useful pre-check, not a replacement for `npm run validate`. If you ever have a CI pipeline, the real gate is always `npm run build`.

**Mitigation:** Make the reviewer's output explicitly say "pass this to `npm run validate` before committing." Never frame the reviewer as the final gate.

**Problem 2: `aens-cross-link-resolver` reads filenames, not content**

The cross-link resolver scans directory listings to find existing IDs. It does not read file content. This means it cannot verify that a cross-link makes semantic sense — only that the ID exists. A workflow could reference a `related_cheatsheet` for an unrelated topic, and the resolver would not catch it.

**Mitigation:** This is acceptable. Semantic cross-link quality is a writing standards problem, not a validation problem. The quality reviewer can spot obvious semantic mismatches during its content review.

**Problem 3: Research collector accuracy depends on Claude's web access**

`aens-research-collector` relies on Claude having web search access. Without it, research notes will be based on training data, which may be outdated — especially for model sizes, current versions, and recently released libraries.

**Mitigation:** The research standards reference should include a checklist of fields that must be verified online vs. fields that can be inferred from training data. Always flag version numbers and model sizes as "verify online."

**Problem 4: The orchestrator is a single point of failure**

All requests flow through `aens-content-planner`. If its classification logic is wrong or the skill fails to trigger, the whole pipeline stalls. An experienced user can bypass it by calling authoring skills directly, but a wrong classification could waste significant effort.

**Mitigation:** The planner should always confirm its classification before proceeding. It should output the Planning Brief and say "Does this look right before I proceed?" rather than routing silently.

**Problem 5: Registry entries are orphaned from Model entries**

The design currently treats Registry entries as separate from Model entries. In practice, many models appear in both `data/models/` and `data/registry/`. There is no enforced link between them, and nothing prevents them from diverging (different descriptions, different IDs). This is an existing AENS architecture issue, not something introduced by the skills, but the skills should not make it worse.

**Mitigation:** In `aens-registry-manager`, include a step that checks whether a `data/models/` entry exists for the same model, and if so, ensures the registry `id` and the model `id` use consistent naming. Flag divergences for manual review.

**Problem 6: No update workflow**

This SDS covers creating new content. It does not cover updating existing content. What happens when NumPy releases version 3.0 and the numpy.json needs updating? The current design has no `aens-content-updater` skill. The authoring skills are designed to create from scratch.

**Mitigation:** This is out of scope for v1. But document it as a gap. When update workflows become necessary, a dedicated `aens-content-updater` skill should be designed — do not stretch the authoring skills to cover updates, because the update process (read existing content, diff changes, patch fields) is architecturally different from the creation process.

---

## Summary

The AENS Skill ecosystem consists of 9 skills across 4 layers: one orchestrator, two shared tools, five schema skills, and one quality gate. They communicate through structured intermediate artifacts (Planning Brief, Research Notes, Cross-link Map, Reviewer Report). All shared knowledge lives in 5 reference files, not duplicated across skill bodies. The reference files are the primary maintenance surface.

The architecture favors maintainability over automation. It does not try to make everything automatic. It makes every step explicit, verifiable, and correctable by a single developer working alone over many years.

Implementation should start with the reference files, not the skills. The references are the foundation. Build those first, then the skills will be straightforward to write.