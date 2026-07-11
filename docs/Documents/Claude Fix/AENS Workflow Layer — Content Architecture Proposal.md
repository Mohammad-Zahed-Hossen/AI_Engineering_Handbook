# AENS Workflow Layer — Content Architecture Proposal

**Mode:** Freeze Guardian + Knowledge Architect + Prompt Architect
**Date:** July 11, 2026
**Status of AENS at inspection time:** Architecture Freeze v1.2 (July 9, 2026), scope capped at ~200 canonical resources, `workflow_max_steps: 8` (aens.config.json)
**Inspected:** `feature/repository-foundation-v2` branch — `lib/schemas/workflow.ts`, `lib/schemas/base.ts`, `app/workflows/**`, `components/shared/WorkflowStepList.tsx`, `data/workflows/build-rag-system.json`, `docs/Documents/ARCHITECTURE_FREEZE.md`, `CONTENT_QUALITY_STANDARD.md`, `RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md`, `docs/guides/adding-workflow.md`

---

## 0. Governing Finding — Read This First

**The Workflow schema is already architecturally complete.** `WorkflowSchema` (extending `BaseMetaSchema`) already contains every field the brief's "Required Output §3" asks for:

| Brief asked for | Already exists as |
|---|---|
| Metadata | `BaseMetaSchema` (id, tags, aliases, difficulty, prerequisites, lifecycle, stability, confidence...) |
| Overview / when to use | `overview`, `description` |
| Prerequisites | `prerequisites` |
| Architecture / step-by-step pipeline | `steps[]` (name, what, tools, decision, uses, failure_points) |
| Tools | `steps[].tools`, `starter_stack` |
| Model/library references | `related_models`, `related_packages`, `steps[].uses` |
| Code snippets | `worked_examples[]` |
| Production considerations | `production_notes`, `scaling_notes`, `cost_notes`, `latency_notes`, `observability_notes` |
| Common mistakes | `common_failure_points`, `steps[].failure_points` |
| Optimization strategies | `scaling_notes` |
| Related resources | `related_content`, `related_patterns`, `related_debug_guides`, `next_links` |

Only **one** currently-live workflow exists (`build-rag-system`), and it already uses ~90% of the schema's surface correctly. This means **this proposal is a curation and taxonomy document, not a schema redesign** — per Freeze Guardian rules, the correct move is additive population of content, not architectural rework.

**One legitimate, additive gap found** (see §3.1): `worked_examples[]` has no structured `code` field, so code currently has nowhere to live except prose inside `implementation_notes`. This is flagged as a candidate sign-off item, not applied.

Everything below is written to fit inside the frozen schema as-is.

---

## 1. Workflow Layer Vision

**Purpose.** Every other content type in AENS owns a slice of knowledge (Package = implementation syntax, Model = algorithm selection, Pattern = concept, Debug Guide = error recovery). Workflow is the only type that owns **sequence** — the order in which those slices get assembled into a working system. It is the "what do I actually do, in what order, right now" layer.

**Target user.** A single AI engineer (Zahed) mid-build, not mid-study. The workflow page gets opened while a terminal is open in the other window.

**Daily usage scenario.** "I'm about to build/rebuild an X. Which steps, in which order, using which starter stack, and where have I historically gotten stuck?" — answered in under 60 seconds of reading.

**Why this layer is disproportionately valuable.** It is the only place where cross-type knowledge (packages + models + cheatsheets + debug guides) gets composed into an executable sequence. Without it, the other 8 content types are a reference library; with it, AENS becomes a build companion.

---

## 2. Workflow Taxonomy

The `category` field is currently a free string (no registry, unlike `tags`/`aliases` which are validation-enforced against a registry). At 1 workflow this is invisible; at 25–30 it will silently drift ("llm" vs "LLM" vs "llm-apps"). Recommend treating the list below as a **closed, documented vocabulary** enforced by convention (and optionally added to the tag-registry validation pattern already used elsewhere — additive, no schema change required since `category: z.string()` already accepts any of these values).

```
Workflow Categories (canonical, closed set)
├── classical-ml           — traditional ML model lifecycle work
├── deep-learning          — DL training/experimentation workflows
├── computer-vision        — CV-specific pipelines
├── nlp                    — non-LLM NLP pipelines (classical + encoder-only)
├── llm-engineering        — building applications on top of LLMs
├── rag                    — retrieval-augmented generation systems
├── agentic-systems        — tool-using / multi-step agent systems
├── fine-tuning            — adapting pretrained models
├── evaluation             — testing, benchmarking, eval-harness workflows
├── mlops                  — training/serving infra, CI/CD for models
├── data-engineering       — data pipelines feeding AI systems
└── production-systems     — deployment, scaling, systems-design workflows
```

Rationale for this list over the brief's original 11 categories: it collapses "Machine Learning Development Lifecycle" and "Deep Learning Experiment Workflow" into two categories that map cleanly onto the same axis used by `models/ml` vs `models/dl` in the existing `data/models/` directory (so `related_models` cross-links resolve naturally), and it separates `rag` and `agentic-systems` out of `llm-engineering` because those two already justify multiple flagship workflows each and are search terms in their own right (this mirrors how the current single workflow, `build-rag-system`, is tagged `rag`/`late-chunking`/`hybrid-search` — those are category-adjacent, not generic-LLM).

**Rejected:** a deeper nested taxonomy (sub-categories per category). At 25–30 total workflows, one flat category field plus `tags[]` for cross-cutting search (e.g. a workflow can be `category: rag` and carry `tags: [evaluation, vector-search]`) gives full discoverability without adding a second classification axis the Freeze doc would have to track.

---

## 3. Workflow Resource Schema — Assessment, Not Redesign

**No new required fields.** The schema stands as-is. What follows is *usage guidance* for fields that exist but are underused in the one live example, plus one flagged candidate addition.

### 3.1 Candidate additive field (requires sign-off, not applied)

`WorkedExampleSchema` currently has `{ name, description, implementation_notes? }` — no field for actual code. Today code can only live as prose. Given §5 below requires workflows to carry runnable snippets, recommend (pending explicit sign-off, per Freeze process):

```ts
export const WorkedExampleSchema = z.object({
  name: z.string(),
  description: z.string(),
  code: z.string().optional(),        // NEW — optional, backward compatible
  language: z.string().optional(),    // NEW — optional, e.g. "python"
  implementation_notes: z.string().optional(),
});
```

This is additive-only (optional fields, `.default([])` untouched, zero migration burden on `build-rag-system.json`), directly analogous to the precedent already set when the Model schema gained `quickstart` in v1.1. **Do not apply this without explicit sign-off** — flagging only.

### 3.2 Fields that exist but are currently unused — usage rules going forward

- `cost_notes` / `latency_notes` / `observability_notes`: present in schema, `null` in the only live workflow. For the next batch, populate these whenever a workflow has a production deployment step — this is exactly the "Level 3/4 wisdom" the knowledge-requirements report prioritizes over API facts.
- `evaluation_checks`: optional but should be populated for every workflow that has a verifiable output (most of them) — it's what differentiates a workflow from a tutorial.
- `next_links`: use for genuine pipeline sequencing (e.g. `build-rag-system → rag-evaluation-harness`), not just related reading — that job belongs to `related_content`.

---

## 4. Workflow Page UX Structure

Current page (`app/workflows/[id]/page.tsx`) already implements: breadcrumbs, ToC (Overview / Steps / Failure Points / Evaluation), `MetadataBadges`, `ExpandableText` overview, starter-stack chips, `OfficialResources`, `WorkflowStepList`, failure-points callout, evaluation checklist, `next_links` pills, `RelatedContent`. This is sound and matches the "low cognitive load, progressive disclosure" principle in the Chief Architect skill — **no structural UI change recommended.**

Two low-effort additive UX notes for when `worked_examples[]` starts getting populated at scale (currently rendered nowhere in the page — confirm before next content batch):
- Add a "Worked Examples" `SectionCard` below Workflow Steps, using the same collapsible-row primitive already standardized across Model/Cheatsheet/Package pages (`components/shared/CollapsibleRow.tsx`) — this is a pure reuse, not a new component.
- If `cost_notes` / `latency_notes` / `observability_notes` get populated, group them into one "Production Profile" panel rather than three separate blocks, to avoid re-introducing the badge-fragmentation problem that the v1.2 Metadata Badges redesign just fixed.

Both are implementation details for a future Windsurf prompt once content exists — not required for this content pass.

---

## 5. Code Snippet Strategy

**Ownership boundary (this answers the brief's duplication question directly):**

| Content Type | Owns |
|---|---|
| **Package** | Syntax-level snippet for one API call ("how do I call `AutoTokenizer.from_pretrained`") |
| **Model** | Quick-start: minimal code to instantiate/train *one* model in isolation |
| **Cheatsheet** | Copy-paste single-purpose snippet, no narrative |
| **Workflow** | **Composition** — code that only makes sense in the context of the full pipeline (e.g. "wiring the reranker output into the generator prompt"), plus non-obvious glue code that doesn't belong to any single package |

This is not harmful duplication under the existing philosophy (ARCHITECTURE_FREEZE.md "Knowledge Ownership") because a Model's quickstart shows the model in isolation while a Workflow's worked example shows it wired into a system — different question, different reader intent.

**Rule of thumb:** if a snippet would be identical whether or not the surrounding workflow existed, it belongs to Package/Model/Cheatsheet, not Workflow. If the snippet only makes sense given the previous and next step, it belongs in `worked_examples`.

**Volume guidance:** 1–3 worked examples per workflow, each covering a genuinely non-obvious integration point (per `build-rag-system`'s current 2: hybrid-RRF fusion, late-chunking pooling) — not a full re-implementation of every step.

---

## 6. Initial Workflow Library Recommendation (25 workflows)

Sized to the Freeze doc's ~200-total-resource budget: Workflow is 1 of 9 content types, so ~25–30 is proportionate (roughly matching the existing package/model counts) rather than the brief's upper bound of 30.

| # | Workflow | Category | Notes |
|---|---|---|---|
| 1 | Build RAG System | rag | **exists** — keep, verify against new taxonomy label |
| 2 | RAG Evaluation Harness | evaluation | direct `next_links` target from #1 |
| 3 | Agentic Tool-Use System | agentic-systems | ReAct/function-calling loop |
| 4 | Multi-Agent Orchestration | agentic-systems | planner/worker pattern |
| 5 | LLM Application Serving | llm-engineering | prompt templating → guardrails → streaming response |
| 6 | Prompt Evaluation & Regression Testing | evaluation | golden-set + LLM-as-judge |
| 7 | Fine-Tune an LLM with LoRA/QLoRA | fine-tuning | parameter-efficient adaptation end-to-end |
| 8 | Full Fine-Tuning a Pretrained Transformer | fine-tuning | contrast case vs #7 |
| 9 | Instruction Tuning / RLHF-lite (DPO) | fine-tuning | alignment workflow |
| 10 | Deep Learning Experiment Lifecycle | deep-learning | dataset → training loop → checkpointing → tracking |
| 11 | Transfer Learning for Vision | computer-vision | pretrained CNN/ViT backbone adaptation |
| 12 | Image Classification Pipeline | computer-vision | end-to-end CV baseline |
| 13 | Object Detection Pipeline | computer-vision | data → augmentation → training → inference |
| 14 | Text Classification Pipeline (Classical + Encoder) | nlp | TF-IDF/BERT-encoder baseline |
| 15 | Named Entity Recognition Pipeline | nlp | sequence-labeling workflow |
| 16 | Tabular ML Model Development Lifecycle | classical-ml | EDA → feature eng → model selection → tuning |
| 17 | Model Selection & Baseline Benchmarking | classical-ml | systematic baseline-before-complexity workflow |
| 18 | Hyperparameter Optimization Workflow | classical-ml | search-strategy-agnostic tuning pipeline |
| 19 | Feature Engineering Pipeline | data-engineering | raw data → model-ready features |
| 20 | Data Validation & Drift Detection | data-engineering | schema checks + drift monitoring |
| 21 | Model Deployment (Batch + Real-Time) | mlops | packaging, serving pattern selection |
| 22 | Model Monitoring & Observability | mlops | drift, latency, quality metrics in production |
| 23 | CI/CD for ML Models | mlops | training/eval/deploy automation |
| 24 | Vector Database Setup & Indexing Strategy | rag | standalone indexing decisions (feeds into #1) |
| 25 | Production LLM Cost & Latency Optimization | production-systems | quantization, batching, caching, routing |

**Explicitly excluded from v1** (available on request, deprioritized): generic "MLOps Workflow" (too vague — split into #21–23 instead), "Production AI System Design Workflow" (too broad — covered by #25 + cross-links), toy/tutorial-only pipelines (violates "canonical, not comprehensive").

---

## 7. Quality Standard (Workflow-Specific Acceptance Criteria)

A workflow is added only if it passes all of:

1. **3–8 real steps** (schema hard limit), each individually actionable — not sub-tasks of a single step.
2. **At least 1 worked example** covering a non-obvious integration point (see §5).
3. **At least 1 populated production consideration** (`production_notes`/`scaling_notes`/`cost_notes`/`latency_notes`) if the workflow has a deployment/serving component.
4. **`evaluation_checks` populated** if the workflow produces a verifiable artifact.
5. **No category collision** — must map to exactly one taxonomy category from §2.
6. **Bidirectional cross-links** to at least one existing Model, Package, or Debug Guide (enforced by `npm run validate` already).
7. **Passes the "Engineer at 2 AM" test** from `RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md`: every step must teach a decision or failure mode, not just restate what's in the official docs.

---

## 8. Migration Strategy for `build-rag-system`

No structural migration needed — it already conforms to the frozen schema at v1.2. Recommended (non-breaking) touch-ups only:

1. Confirm `category: "llm"` should become `category: "rag"` under the new closed taxonomy (§2) — one-field edit, no schema change.
2. Add `next_links: ["rag-evaluation-harness"]` once workflow #2 exists (currently only `recommended_next` at BaseMeta level points to `rag-vs-fine-tuning`, which is a Decision Guide, not a Workflow — that's correct and should stay separate from `next_links`).
3. No other changes required.

---

## Summary for the Person

The workflow schema you already have is not a prototype limitation — it's the finished architecture. The actual work ahead is **content**, not **structure**: agree the 12-category taxonomy, greenlight (or reject) the one optional `code` field on `worked_examples`, and start producing the 25 workflows above in priority order. The Perplexity research prompt in the companion file is built to output content that drops directly into the existing schema with zero rework.
