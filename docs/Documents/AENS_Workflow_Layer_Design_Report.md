# AENS Workflow Layer — Design Report (Canonical Freeze Specification)

**Role:** Chief Knowledge Architect / System Architect / Architecture Freeze Guardian
**Date:** July 11, 2026
**Repo inspected:** `Mohammad-Zahed-Hossen/AI_Engineering_Handbook`, branch `feature/repository-foundation-v2`
**Supersedes:** the July 11 "Workflow Content Architecture Proposal" — that document's taxonomy and workflow list are revised and finalized here based on deeper inspection (validation script, sibling schemas, `MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md`). The Perplexity prompt file already produced remains valid; only the category vocabulary and workflow list it feeds from change.

This report resolves every open question needed before Workflow content generation begins. Nothing here is a proposal to discuss — it is a frozen decision set, per Freeze Guardian mode. Where two governing documents disagreed, the resolution is stated explicitly.

---

## Section 1 — Workflow Purpose

**What Workflow owns.** `docs/Documents/MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md` states the ownership hierarchy explicitly and it is the authoritative source: *"Workflow (Process Knowledge)"*, answering *"How do I build this end-to-end?"* — and clarifies the hierarchy list *"is not a navigation path — it represents knowledge ownership only."* Workflow owns: the **sequence** in which independently-owned knowledge (packages, models, patterns) gets composed into a working system, plus the **decision points and integration-level failure modes** that only exist once things are wired together.

**What Workflow must never own** (per the same document's anti-pattern list, directly binding):
- Library API syntax → owned by Package / Cheatsheet. *"Workflow must not duplicate Package APIs."*
- Algorithm selection reasoning → owned by Model / Decision Guide.
- Tool-agnostic engineering concepts (e.g., checkpointing, early stopping as ideas) → owned by Pattern.
- Mathematically-derivable theory → owned by Principle.
- Symptom-first error recovery → owned by Debug Guide (Workflow only points at failure modes; it does not resolve them).
- Deployment/download metadata for assets → owned by Registry.

**Ownership comparison table:**

| Type | Primary Question | Relationship to Workflow |
|---|---|---|
| Package | How do I call this library? | Workflow references it via `steps[].uses.packages`, never re-explains its API |
| Model | Which algorithm should I choose? | Workflow references it via `related_models`/`steps[].uses.models`; Workflow shows *where* it's wired in, not *why* it was chosen (that's Decision Guide) |
| Cheatsheet | What's the syntax again? | Never referenced structurally — a Workflow step may *use* a package whose cheatsheet exists, but Workflow does not link to cheatsheets directly (no such field exists, correctly) |
| Pattern | Which tool-agnostic concept applies? | Workflow references via `related_patterns`; a step's `decision` field may *apply* a pattern (e.g., "early stopping") without re-deriving it |
| Principle | Why does this work fundamentally? | No direct schema link exists (correct — Workflow is Level 3 process knowledge, Principle is Level 1 theory; too distant to link directly, reached transitively via Pattern/Model) |
| Decision Guide | Which option should I choose between alternatives? | Workflow may point to a Decision Guide via `related_content` when a step's decision reflects a documented trade-off (e.g., `build-rag-system` → `rag-vs-fine-tuning`) |
| Debug Guide | Why isn't this working? | Workflow references via `related_debug_guides`; `steps[].failure_points` name the symptom, Debug Guide owns the fix |

**Resolving the one real overlap risk (Pattern vs. Workflow):** `PatternCategorySchema` includes entries like `training_loop`, `checkpointing`, `canary_deployment`, `monitoring` — all of which *sound* like workflow steps. The resolution: **Pattern owns the concept in isolation; Workflow owns the concept positioned inside a specific ordered pipeline, tied to specific tools.** "Checkpointing" the Pattern explains what it is and why, tool-agnostically. A Workflow's step 4 titled "Checkpoint and resume training with PyTorch Lightning" is not a duplicate — it's the composition. This is the same "different question, same words" resolution used for Model vs. Workflow code snippets, and it is now formally the same rule at the concept level, not just the code level.

### Decision
Workflow owns **process knowledge**: ordered steps, per-step decisions/tools/failure points, and pipeline-level integration wisdom (production, scaling, cost, latency, evaluation). It owns nothing that Package, Model, Pattern, Principle, Debug Guide, Decision Guide, or Registry already own — it only sequences and cross-links to them.

### Rationale
This is not a new decision — it is the existing, already-documented architecture (`ARCHITECTURE_FREEZE.md` Knowledge Ownership section + the ML Integration Audit). Restating it here as binding prevents drift once 25+ workflows are being written by different research passes.

### Impact
- **Schema:** none.
- **UI:** none.
- **Content:** every workflow's `overview` and `steps[].what` must be reviewed for accidental re-explanation of Package/Model/Pattern knowledge before acceptance (see Section 6 checklist).

---

## Section 2 — Workflow Granularity

**Question:** does one workflow = a task, a system, a pipeline, or a project?

**Answer: a pipeline** — a single, named, verifiable end-to-end process producing one coherent output artifact (a trained model, a deployed service, a validated dataset, an evaluation report). Not a task (too small — that's a Package task or Pattern). Not a project (too large, unbounded scope — AENS is a knowledge base, not a project tracker).

**Build vs. Evaluate vs. Deploy — objective split rule** (this resolves the brief's explicit example):

Split into separate workflows when **any** of the following hold:
1. Combining the phases would exceed the schema's hard cap of 8 steps.
2. The phases are triggered at genuinely different times by the engineer (build happens once per system; evaluation and redeployment happen repeatedly afterward, on a different cadence).
3. The phase has enough independent decision points and failure modes to pass the acceptance checklist (Section 6) on its own — i.e., it would be a legitimate flagship resource by itself, not a thin stub.

Keep as one workflow when the phases are always performed together in a single sitting **and** the combined step count stays at or under 8.

**Applied to the brief's example:** Build RAG / Evaluate RAG / Deploy RAG →
- **Build RAG** and **Evaluate RAG** split (rule 2 and 3: evaluation is re-run continuously after every retrieval-strategy change, has its own tooling — RAGAS, golden sets, LLM-as-judge — and is a complete resource on its own).
- **Deploy RAG** does *not* need to be a separate workflow by default — production concerns for RAG already live inside `build-rag-system.production_notes`/`scaling_notes`. It only earns a separate workflow if deployment develops enough independent decision complexity (e.g., multi-region serving, canary rollout for retrieval index updates) to pass the checklist on its own. For the v1 library (Section 10), it does not yet.

**Minimum scope:** ≥3 steps, each involving a real decision or trade-off (not just "run this command"). A single API call is not a workflow — that's a Package task or Cheatsheet entry.

**Maximum scope:** 8 steps (schema-enforced), one named output artifact. A workflow titled generically after an entire discipline ("MLOps Workflow", "Production AI System Design Workflow") fails this test — it has no single output artifact and cannot fit in 8 steps without becoming a table of contents rather than a pipeline. These are rejected as workflow titles (already excluded in the prior list; formally re-confirmed here).

### Decision
One workflow = one end-to-end pipeline with one coherent output artifact, 3–8 steps. Split build/evaluate when they run on different cadences or evaluation stands alone under the acceptance checklist; keep deploy folded into build unless deployment complexity independently earns flagship status.

### Rationale
This is an objective, repeatable test rather than a case-by-case judgment call, which is what a frozen specification requires — anyone (including a future Perplexity research pass) can apply it without re-litigating scope per workflow.

### Impact
- **Schema:** none — `workflow_max_steps: 8` in `aens.config.json` already enforces the ceiling.
- **UI:** none.
- **Content:** directly determines the Section 10 workflow list (evaluation workflows are separated out; deployment is not, for the current batch).

---

## Section 3 — Workflow Taxonomy

**Top-level categories (closed vocabulary, 12 categories):**

```
classical-ml · deep-learning · computer-vision · nlp · llm-engineering ·
rag · agentic-systems · fine-tuning · evaluation · mlops ·
data-engineering · production-systems
```

**Subcategories:** not needed. At a 25–30 workflow ceiling, a second classification axis adds a maintenance surface (two things to keep in sync) for no discoverability gain — `tags[]` already exists for cross-cutting search (e.g. a `rag` workflow can carry `tags: ["evaluation", "vector-search"]` without needing a formal subcategory).

**Relationship with tags/aliases/search:** unchanged from existing `BaseMetaSchema` conventions. `category` = single primary classification (which taxonomy bucket). `tags[]` = cross-cutting facets for search/filter. `aliases[]` = alternate names a search might use (e.g. `"rag-pipeline"` as an alias of `build-rag-system`). No new relationship needed between these — the existing pattern (already used correctly by `build-rag-system.json`) is sufficient.

**Enforcement mechanism (resolves a real gap found during inspection):** unlike Pattern, Principle, Debug Guide, Decision Guide, and Registry — all of which enforce `category` as a Zod `z.enum([...])` — Workflow's `category` is `z.string()` (matching Model's approach, which also keeps `category` as free string and uses a separate structured `domain`/subcategory system instead). Converting Workflow's `category` to a hard enum is unnecessary schema churn for a field that's currently only ever set once. Instead: **enforce the 12-category list at the validation-script level**, the same mechanism already used for the tag registry (`allow_unregistered_tags: false` in `aens.config.json`). This gets the drift protection without a schema change.

### Decision
12 flat categories as listed above, enforced by validation-script allow-list (not a Zod enum), no subcategories.

### Rationale
Matches the two existing precedents in the codebase (Model keeps category as free string; the tag registry already enforces a closed vocabulary at the validation layer rather than the type layer) — this is the "fewer moving parts" choice, not a new pattern.

### Impact
- **Schema:** none.
- **UI:** none.
- **Content:** every future workflow's `category` must be one of the 12 values; `build-rag-system.json`'s current `category: "llm"` is relabeled to `"rag"` (Section 11, immediate next steps).
- **Validation:** one additive check recommended for `scripts/validate-content.ts` — a category allow-list for `data/workflows/*`, mirroring the existing tag-registry check. Optional, low-effort, not blocking.

---

## Section 4 — Workflow Knowledge Architecture (page block design)

This section reviews **actual rendering**, not just schema — and this is where the most important finding of this report lives.

**Finding:** the current `app/workflows/[id]/page.tsx` renders: header/metadata, starter stack, official resources, `WorkflowStepList` (steps with `what`/`decision`/`failure_points` — but **not** `steps[].uses`), common failure points, evaluation checklist, next-workflow links, related content. It does **not** render: `worked_examples`, `production_notes`, `scaling_notes`, `cost_notes`, `latency_notes`, `observability_notes`, or `steps[].uses`.

This matters because `build-rag-system.json` already has real, populated content in `production_notes` and `scaling_notes` (verified by direct inspection) that is **currently invisible to the reader** — the schema and the content exist, but the page silently drops them. If 25 more workflows are researched and written into these fields via the Perplexity pipeline without fixing this, that research effort produces content nobody ever sees. This is a required UI fix, not an optional one, and it must land before or alongside the first content batch — not after.

**Complete, frozen page block list** (in render order):

| Block | Source field(s) | Mandatory? | Owner (why it belongs to Workflow) |
|---|---|---|---|
| Header + metadata badges | `BaseMeta` | Mandatory | Identity |
| Starter stack | `starter_stack` | Mandatory | Minimum tools to begin |
| Official resources | `sources`, `github_repo` | Mandatory | Primary source grounding |
| Workflow steps (sequence) | `steps[]` including `uses` (**UI fix required** — currently unrendered) | Mandatory | The core process knowledge |
| Worked examples (**UI fix required** — currently unrendered) | `worked_examples[]` | Optional (render only if non-empty) | Non-obvious integration code (Section 7) |
| Common failure points | `common_failure_points` | Mandatory if non-empty | Pipeline-level integration risk, distinct from per-step risk |
| **Production Profile panel (new, grouped)** (**UI fix required**) | `production_notes`, `scaling_notes`, `cost_notes`, `latency_notes`, `observability_notes` | Optional (render only if any populated); grouped into one panel, not five | Production wisdom this workflow specifically requires |
| Evaluation checklist | `evaluation_checks` | Optional (render only if non-empty) | Verifiable completion criteria |
| Next workflow / related content | `next_links`, `related_content`, `related_*` | Mandatory (existing) | Navigation and cross-linking |

**Blocks explicitly rejected** (not added): a separate "Checklist" block distinct from Evaluation (redundant — `evaluation_checks` already is the checklist); a "Project Structure" / "Configuration" block (this is Package/Cheatsheet territory — a workflow references *which* package provides scaffolding, it doesn't restate a `tree` output); an "Alternatives" block (this is Decision Guide territory, reached via `related_content`); an "Evolution" block (speculative, no engineering value at 2 AM, rejected per Section 6 anti-patterns).

**Grouping rule for the new Production Profile panel:** the five production-adjacent fields must render as one panel with sub-labels, not five separate cards — this directly follows the same anti-fragmentation lesson already applied in the v1.2 Metadata Badges redesign (`CONTENT_QUALITY_STANDARD.md` change log), and reuses the existing `SectionCard`/`CollapsibleRow` primitives rather than introducing a new component.

### Decision
Freeze the 9-block page structure above. Three UI fixes are required (steps[].uses, worked_examples, Production Profile panel) — these are additive UI wiring of already-existing schema fields, not new design.

### Rationale
The schema was already right; the page just never finished catching up to it. Freezing the block list now, before 25 more workflows are written, prevents a second wave of "populated but invisible" content.

### Impact
- **Schema:** none.
- **UI:** three additive rendering fixes to `app/workflows/[id]/page.tsx`, reusing existing shared components (`SectionCard`, `CollapsibleRow`). No new component library needed.
- **Content:** none — existing `build-rag-system.json` content becomes visible for free once the UI fix ships.

---

## Section 5 — Workflow Schema Audit

**Does the current schema support the frozen architecture above?** Yes, in full, with one already-flagged optional exception.

**Audited fields, confirmed sufficient as-is:** `overview`, `starter_stack`, `steps[]` (including `uses`), `common_failure_points`, `evaluation_checks`, `next_links`, `production_notes`, `scaling_notes`, `cost_notes`, `latency_notes`, `observability_notes`, `related_patterns`/`related_models`/`related_packages`/`related_debug_guides`, `worked_examples[]` (structure only — see below).

**One candidate additive change, still pending explicit sign-off (carried over from the prior report, not yet approved or applied):**

```ts
export const WorkedExampleSchema = z.object({
  name: z.string(),
  description: z.string(),
  code: z.string().optional(),        // candidate addition
  language: z.string().optional(),    // candidate addition
  implementation_notes: z.string().optional(),
});
```

- **Problem solved:** today, code has no structured home in a Workflow resource — it can only live as prose inside `implementation_notes`, which the Content Quality Standard's writing style rules (short paragraphs, no markdown headers within content) make awkward for actual code blocks.
- **Migration cost:** zero. Both new fields are optional; `build-rag-system.json`'s two existing `worked_examples` entries validate unchanged.
- **Implementation effort:** trivial (two-field Zod addition, one UI template update to render a code block when `code` is present).
- **Future benefit:** gives every future workflow's worked examples a real, renderable code block instead of prose-embedded pseudo-code.

**No other schema changes are needed or recommended.** Category stays `z.string()` (Section 3). No new content type is needed. No new top-level Workflow fields beyond the one above.

### Decision
**Schema Freeze Recommendation: the Workflow schema is frozen as-is**, with exactly one optional, additive, zero-migration-cost field pair (`worked_examples[].code`, `worked_examples[].language`) awaiting explicit sign-off before being applied. No other schema work is authorized.

### Rationale
Per Freeze Guardian principles: recommend changes only where they fix a real correctness/usability gap (this one does — code has nowhere to live) and only when additive. Everything else audited is already correct; redesigning it would violate "prefer stability over novelty."

### Impact
- **Schema:** one pending optional change, not yet applied.
- **UI:** if approved, one small template addition (render a code block inside the Worked Examples section when `code` is present).
- **Content:** none until approved.

---

## Section 6 — Workflow Content Standard

**Writing style:** direct, technical, practical, concise — per `CONTENT_QUALITY_STANDARD.md`'s general writing rules, applied without modification (short paragraphs, bullets over prose, code blocks always language-tagged).

**Content depth:** Level 2–4 only (Understanding / Practice / Wisdom), per `RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md`'s knowledge hierarchy. Level 1 facts (API signatures, install commands) are explicitly out of scope — that's what Package/Cheatsheet already own, and restating it here would violate Section 1's ownership boundary.

**Technical level / audience:** practicing AI engineer already comfortable with the domain, needing a build companion, not a learner needing first-principles explanation. Apply the "Engineer at 2 AM" test to every sentence: if the only value is "this tells you what the API does," cut it.

**Source quality:** peer-reviewed papers and production engineering write-ups from teams that actually run the system described, prioritizing the last 24 months unless a foundational paper is still canonical. Reject marketing pages, unverified blog posts, and SEO content farms.

**Anti-patterns — must never appear:**
- Hedging language ("might", "could potentially") in place of a stated default recommendation.
- Placeholder text, TODO/TBD markers (already a hard validation failure per existing pipeline).
- Tutorial-style hand-holding ("first, let's understand what an embedding is").
- Toy/synthetic examples where a production-representative one is available.
- Re-explained Package/Model/Pattern knowledge (Section 1 violation).
- A workflow whose steps could be replaced by "see the official docs" — if that's all it is, it's not canonical.

**Workflow Acceptance Checklist** (used before any workflow resource is approved for merge):

1. 3–8 steps (schema-enforced), each individually actionable, each stating a real decision with a default recommendation.
2. Category is one of the 12 closed values (Section 3).
3. Passes the granularity test (Section 2) — one coherent output artifact, correctly split from adjacent build/evaluate/deploy phases.
4. At least one `worked_examples` entry covering a non-obvious integration point (Section 7).
5. At least one production-adjacent field (`production_notes`/`scaling_notes`/`cost_notes`/`latency_notes`) populated if the workflow has any deployment/serving component.
6. `evaluation_checks` populated if the workflow produces a verifiable artifact (true for nearly all workflows).
7. At least one bidirectional cross-link to an existing Model, Package, Pattern, or Debug Guide (`npm run validate` already enforces reciprocity for typed relationships).
8. No ownership violation (Section 1) — spot-checked against the "must never own" list.
9. No anti-pattern from the list above present.
10. Passes `npm run validate` with zero errors before merge.

### Decision
Adopt the above as the binding Workflow-specific extension of `CONTENT_QUALITY_STANDARD.md`. This checklist is the final gate before any workflow JSON is committed.

### Rationale
A checklist that references the report's own frozen decisions (granularity, taxonomy, ownership) is self-consistent and catches drift at review time rather than after 25 workflows have already been written inconsistently.

### Impact
- **Schema:** none.
- **UI:** none.
- **Content:** every workflow produced from the Perplexity pipeline is checked against this list before conversion to JSON is considered final.

---

## Section 7 — Code Strategy

**Ownership boundary** (frozen, restated from the prior report, now formally tied to Section 1's ownership table):

| Type | Owns |
|---|---|
| Package | Syntax-level snippet for one API call |
| Model | Quick-start: minimal code to instantiate/train one model in isolation |
| Cheatsheet | Copy-paste single-purpose snippet, no narrative |
| **Workflow** | **Composition code** — glue that only makes sense with the surrounding pipeline; wiring between two components that don't belong to any single package |

**Test:** if a snippet would be identical whether or not the surrounding workflow existed, it belongs to Package/Model/Cheatsheet. If it only makes sense given the previous and next step, it belongs in `worked_examples`.

**Volume:** 1–3 worked examples per workflow. Each must cover a genuinely non-obvious integration point — not a re-implementation of every step. (`build-rag-system` currently has 2: hybrid-RRF fusion, late-chunking pooling — this is the calibration reference for future workflows.)

**Quality requirement:** if the pending `code`/`language` fields (Section 5) are approved, code must be runnable with minimal modification, consistent with the Model schema's existing `quickstart` code-quality bar (production-ready, canonical-library best practices). Until approved, code stays as clearly-delimited prose inside `implementation_notes`.

### Decision
Workflow code = composition/integration glue only, 1–3 examples per workflow, gated on the Section 5 sign-off for structured code storage.

### Rationale
This is the direct, unavoidable consequence of the Section 1 ownership freeze — restating it here as a standalone frozen decision so content writers don't have to re-derive it per workflow.

### Impact
- **Schema:** depends on Section 5 sign-off (no schema impact if declined).
- **UI:** depends on Section 5 sign-off.
- **Content:** every workflow's worked examples are checked against the "would this exist without the workflow" test during review.

---

## Section 8 — Diagram Strategy

**Inspected:** no diagram/Mermaid/Graphviz rendering capability exists anywhere in the current codebase (`components/`, `lib/`, `app/` — zero references). Adding one would mean a new rendering dependency, a new schema field, a new component, and — critically — a second representation of the same sequence that the `steps[]` array already encodes, which must then be kept in sync manually forever.

**Assessed against each diagram type from the brief:**

| Diagram type | Usefulness at ≤8 linear steps | Maintenance burden | Verdict |
|---|---|---|---|
| Architecture diagram | Low — `starter_stack` + `steps[].tools` already convey this in text | New dependency + new field | Reject for v1 |
| Pipeline diagram | Low — `WorkflowStepList` already renders the sequence clearly | Duplicate-truth risk | Reject for v1 |
| Sequence diagram | Low — no workflow in the v1 library has true concurrent/async branching | New dependency | Reject for v1 |
| Decision tree | Medium, but `steps[].decision` already states the default recommendation in prose | New dependency + new field | Reject for v1 |
| Lifecycle diagram | Low — workflows are pipelines, not stateful lifecycles (that's a Registry/Model concern) | N/A | Reject for v1 |

### Decision
**No diagrams in Workflow v1.** Text-based sequential rendering via the existing `WorkflowStepList` is sufficient for the ≤8-step, single-artifact pipelines this layer is scoped to produce.

### Rationale
Directly follows "fewer moving parts" and "avoid unnecessary complexity" — a diagram is only justified once workflows exist with genuine parallel/branching structure that text cannot convey, and none of the 26 workflows in Section 10 require that. Introducing rendering infrastructure speculatively is exactly the kind of theoretical-perfection optimization the working principles reject.

### Impact
- **Schema:** none.
- **UI:** none.
- **Content:** none.
- **Deferred trigger:** revisit only if a future workflow genuinely has parallel/branching execution that the linear `steps[]` array cannot represent honestly — and even then, prefer a single Mermaid-syntax *string* field over a diagramming tool, to keep the "fewer moving parts" property.

---

## Section 9 — Cross-Link Strategy

**Required links:** at least one of `related_models` or `related_packages` populated (Section 6, checklist item 7) — a workflow must ground itself in at least one concrete, existing resource, not float unattached.

**Optional links:** `related_patterns`, `related_debug_guides`, `next_links`, `related_content` (inherited from `BaseMetaSchema`) for Decision Guides/Principles reached transitively.

**Automatic vs. manual:** all links are manual today — no auto-suggestion engine exists in the repository, and none is being introduced here (would violate "avoid speculative architecture"). The Perplexity prompt's "Suggested Cross-Links" output is a starting point only; every suggested ID must be manually verified to exist in `data/models/`, `data/packages/`, etc. before being written into a `ContentRefSchema` entry.

**Relationship direction & validation:** `steps[].uses`, `related_patterns`, `related_models`, `related_packages`, and `related_debug_guides` all use the typed `ContentRefSchema` (`{ id, type, relationship_type? }`), which is what `scripts/validate-content.ts` actually parses to enforce bidirectional integrity (confirmed by direct inspection of the relationship-map logic). **Any relationship_type other than `related_to` requires a reciprocal entry on the target resource in the same change**, or `npm run validate` fails the build — this is already enforced, not a new rule, but must be planned per-workflow: when a workflow adds `related_models: [{ id: "bert", type: "model", relationship_type: "uses" }]`, the Model's own file must add the reciprocal `used_by` (or equivalent) back to the workflow.

**A deferred, out-of-scope inconsistency found (documented, not fixed here):** `Pattern`, `Principle`, and parts of `DebugGuide`'s relationship fields (`related_workflows`, `referenced_by_workflows`) are typed as plain `z.array(z.string())`, not `ContentRefSchema`. This means the bidirectional-integrity checker — which reads structured `{id, type, relationship_type}` objects — cannot fully verify reciprocity across those specific fields. This is a real, pre-existing inconsistency, but fixing it means touching Pattern/Principle/DebugGuide schemas, which is out of scope for a Workflow-only freeze and risks exactly the "redesign the whole application" trap this report is instructed to avoid. It is recorded here as a **deferred decision** (Section 11) for a future, separate schema pass — not solved now.

### Decision
Cross-linking uses only the existing `ContentRefSchema` mechanism, manually curated, with at least one required grounding link per workflow. The Pattern/Principle/DebugGuide plain-string-array inconsistency is acknowledged but explicitly deferred.

### Rationale
This is the existing, already-validated mechanism — no new cross-link infrastructure is needed or justified for Workflow specifically.

### Impact
- **Schema:** none for Workflow. A future, separate, non-Workflow-scoped pass may eventually convert Pattern/Principle/DebugGuide's string-array relationship fields to `ContentRefSchema` — deferred.
- **UI:** none.
- **Content:** every workflow's cross-links must be verified to exist and to have their reciprocal added before merge (checklist item 7).

---

## Section 10 — Initial Workflow Library (26 workflows, frozen)

Revised from the prior report using the Section 2 granularity rule and real precedent found in `MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md` (which explicitly names "Build Classification Pipeline," "Build Regression Pipeline," "Build Clustering Pipeline," and "Hyperparameter Tuning" as canonical ML workflows — these replace the previous, too-broad "Tabular ML Model Development Lifecycle" entry, since classification/regression/clustering have genuinely different evaluation methods and thus fail the "one coherent output artifact" test if merged).

**Priority tiers:** P0 = implement first (highest engineering value, unblocks others via `next_links`/dependency). P1 = second wave. P2 = third wave.

| # | Workflow | Category | Priority | Engineering Value | Dependency |
|---|---|---|---|---|---|
| 1 | Build RAG System | rag | P0 (exists) | High — most-referenced pattern in modern LLM apps | none |
| 2 | RAG Evaluation Harness | evaluation | P0 | High — every RAG change needs re-evaluation | depends on #1 conceptually, standalone resource |
| 3 | Vector Database Setup & Indexing Strategy | rag | P0 | High — reusable across #1 and future retrieval workflows | feeds #1 |
| 4 | Tabular Classification Pipeline | classical-ml | P0 | High — most common ML task in practice | none |
| 5 | Tabular Regression Pipeline | classical-ml | P0 | High — second most common | none |
| 6 | Hyperparameter Optimization Workflow | classical-ml | P0 | High — cross-cuts #4/#5/#7 | pairs with #4, #5 |
| 7 | Model Selection & Baseline Benchmarking | classical-ml | P0 | High — precedes any serious modeling effort | feeds #4, #5 |
| 8 | Agentic Tool-Use System | agentic-systems | P0 | High — fastest-growing LLM application pattern | none |
| 9 | Deep Learning Experiment Lifecycle | deep-learning | P0 | High — foundational for #11–15 | none |
| 10 | LLM Application Serving | llm-engineering | P0 | High — most teams need this before anything fancier | none |
| 11 | Clustering Pipeline | classical-ml | P1 | Medium-high — distinct eval methodology from #4/#5 | none |
| 12 | Multi-Agent Orchestration | agentic-systems | P1 | Medium-high | builds on #8 |
| 13 | Prompt Evaluation & Regression Testing | evaluation | P1 | High | pairs with #10 |
| 14 | Fine-Tune an LLM with LoRA/QLoRA | fine-tuning | P1 | High | builds on #9 |
| 15 | Transfer Learning for Vision | computer-vision | P1 | Medium-high | builds on #9 |
| 16 | Image Classification Pipeline | computer-vision | P1 | Medium-high | builds on #15 |
| 17 | Text Classification Pipeline (classical + encoder) | nlp | P1 | Medium-high | none |
| 18 | Feature Engineering Pipeline | data-engineering | P1 | High — feeds #4, #5, #6 | precedes #4, #5 |
| 19 | Model Deployment (Batch + Real-Time) | mlops | P1 | High | none |
| 20 | Model Monitoring & Observability | mlops | P1 | High | pairs with #19 |
| 21 | Full Fine-Tuning a Pretrained Transformer | fine-tuning | P2 | Medium — contrast case to #14 | builds on #9 |
| 22 | Instruction Tuning / Alignment (DPO) | fine-tuning | P2 | Medium | builds on #14 |
| 23 | Object Detection Pipeline | computer-vision | P2 | Medium | builds on #15 |
| 24 | Named Entity Recognition Pipeline | nlp | P2 | Medium | builds on #17 |
| 25 | Data Validation & Drift Detection | data-engineering | P2 | Medium-high | pairs with #20 |
| 26 | Production LLM Cost & Latency Optimization | production-systems | P2 | Medium-high | builds on #10 |

**Excluded from v1 (deprioritized, per Section 2 granularity rule):** any workflow named after a whole discipline ("MLOps Workflow," "Production AI System Design Workflow") — too broad to fit 8 steps or produce one output artifact; CI/CD for ML Models as a *separate* workflow (folded into #19's production notes unless independent complexity emerges — same rule as RAG deploy in Section 2).

### Decision
The 26-workflow table above is the frozen v1 library, in the stated priority order.

### Rationale
Every entry passes the Section 2 granularity test and the Section 6 checklist's category requirement; the classification/regression/clustering split corrects a real granularity error in the prior report using the repo's own precedent document.

### Impact
- **Schema:** none.
- **UI:** none.
- **Content:** this is the direct input list for the Perplexity research pipeline, run in priority order.

---

## Section 11 — Final Freeze Summary

### Decisions Accepted
1. Workflow owns process knowledge only (sequence, decisions, integration failure modes, production wisdom) — never algorithm theory, library syntax, tool-agnostic concepts, or symptom-first troubleshooting (Section 1).
2. Granularity = one pipeline, one output artifact, 3–8 steps, objective build/evaluate/deploy split rule (Section 2).
3. 12-category closed taxonomy, enforced at validation-script level, no subcategories, no Zod enum change (Section 3).
4. Nine-block page architecture frozen, including three required UI wiring fixes for already-existing schema fields (Section 4).
5. Schema is frozen as-is; zero required changes (Section 5).
6. Content standard and 10-item acceptance checklist adopted as binding (Section 6).
7. Code ownership: Workflow owns composition/integration glue only, 1–3 worked examples per workflow (Section 7).
8. No diagrams in v1 (Section 8).
9. Cross-linking uses existing `ContentRefSchema` mechanism only, manually curated, one required grounding link per workflow (Section 9).
10. 26-workflow v1 library frozen in priority order (Section 10).

### Decisions Deferred
1. `worked_examples[].code`/`language` optional fields — drafted, zero-migration-cost, **awaiting explicit sign-off**, not yet applied (Section 5, Section 7).
2. Pattern/Principle/DebugGuide relationship fields using plain string arrays instead of `ContentRefSchema` — a real, pre-existing inconsistency that limits bidirectional-validation coverage for those specific fields. Out of scope for this Workflow-only freeze; deferred to a future, separately-scoped schema pass (Section 9).
3. Mermaid-string diagram field — deferred until a workflow with genuine parallel/branching execution exists; not authorized now (Section 8).

### Required Schema Changes
**None required.** One optional, pending-sign-off change exists (`worked_examples[].code`, `worked_examples[].language`) — do not apply without explicit approval.

### Required UI Changes
Three additive rendering fixes to `app/workflows/[id]/page.tsx`, all reusing existing shared components (no new component library):
1. Render `steps[].uses` (packages/models/cheatsheets) inside the existing `WorkflowStepList` step body.
2. Add a "Worked Examples" section (currently unrendered entirely).
3. Add a grouped "Production Profile" panel for `production_notes`/`scaling_notes`/`cost_notes`/`latency_notes`/`observability_notes` (currently unrendered entirely).

### Required Content Changes
1. Relabel `build-rag-system.json`'s `category` from `"llm"` to `"rag"`.
2. Populate the 26-workflow v1 library (Section 10) via the existing Perplexity research prompt, updated to reference the 12-category vocabulary (Section 3) and the revised workflow list (Section 10) in place of the prior draft list.

### Immediate Next Steps (in order)
1. **Decide** on the pending `worked_examples[].code`/`language` schema addition (yes/no) — this is the only open architectural question left.
2. **Ship the three UI fixes** (Section 4) before or alongside the first content batch, so that research effort is not invisible on arrival.
3. **Relabel** `build-rag-system.json`'s category to `"rag"`.
4. **Run the Perplexity prompt** for workflows #1–10 (P0 tier, Section 10), convert to JSON, run through the Section 6 acceptance checklist, then `npm run validate`.
5. **Proceed to P1 and P2 tiers** once P0 is merged and validated.

**This report is now the canonical Workflow Layer specification. No further architectural discussion is required before content generation begins.**
