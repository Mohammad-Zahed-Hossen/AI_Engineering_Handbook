# AENS Registry — Principal Architecture Review

**Role:** Principal Staff Software Architect / Freeze Guardian
**Date:** 2026-07-16
**Method:** Direct inspection of `Mohammad-Zahed-Hossen/AI_Engineering_Handbook`, branch `feature/repository-foundation-v2` (fresh clone, not memory or the audit docs alone). Every finding below is cited against an actual file in the repo, not against the plan document's aspirational description of itself.
**Scope reviewed:** `lib/schemas/registry.ts`, `lib/schemas/base.ts`, `lib/data.ts`, `lib/search.ts`, `lib/search-types.ts`, `lib/registry-constants.ts`, `lib/format-registry.ts`, `types/registry.ts`, `scripts/validate-content.ts`, `app/registry/**`, `app/api/registry/search/route.ts`, `components/registry/**`, `data/registry/**`, plus the four documents in `docs/Documents/Registtry Audit/` and `docs/Documents/ARCHITECTURE_FREEZE.md`.

**Important framing note before the review:** the four documents you pointed me to are not one plan under review — they are a *timeline*. `REGISTRY_ARCHITECTURE_AUDIT.md` (Jul 15) diagnosed the old task-based registry. `Registry Page Plan.md` (Jul 15) proposed the Family→Variant fix. `LEGACY_REGISTRY_AUDIT.md` and `LEGACY_REGISTRY_REMOVAL_REPORT.md` (both Jul 16, today) claim the migration is **already built and shipped**, with a green build and "no dead code." I verified that claim against the live code rather than taking the removal report's word for it. The headline finding of this review is that the removal report is wrong on both counts — there is dead code, and the schema has silently regressed on the one axis AENS treats as non-negotiable (`BaseMetaSchema` conformance). Everything below treats the **as-built** Family→Variant architecture as the design under review, not the plan.

---

## 1. Executive Summary

The Family→Variant split itself was the right call and it is real — `data/registry/families/<family>/_index.json` + per-variant files, dedicated routes, dedicated components, and a materially richer search index all exist and work. That part of the July 15–16 rewrite is a genuine improvement over the old monolithic `llms.json`, and it should not be re-litigated.

But the rewrite was scoped as a **storage-layout fix**, not a **schema-governance fix**, and that scoping decision reintroduced — inside a single 48-hour window — the exact defect class the Freeze Guardian review flagged as AENS's *one* accepted architectural exception three days earlier (Model's divergence from `BaseMetaSchema`, `AENS_Architecture_Freeze_Verification_v3_Response.md`, Jul 13). `RegistryFamilySchema` and `RegistryVariantSchema` do not extend `BaseMetaSchema`. Unlike Model, there is no `.transform()` shim reconciling the two. Registry entries have no `lifecycle`, `stability`, `confidence`, `canonical_status`, `engineering_maturity`, `slug`, `title`, `category`, `domain`, or typed `related_content` — the fields every other content type in AENS uses for governance, filtering, and cross-linking. This wasn't a known, documented, cost/risk-justified exception like Model's. It's undocumented drift, three days after a freeze review specifically warned about undocumented base-schema drift.

Layered on top of that: the "no dead code" claim in the removal report is false. A fully-built faceted search API (`app/api/registry/search/route.ts` — pagination, sort, parameter/context/GPU range filters) is called from **zero** frontend code. The UI's own filter component collects `minParams`/`maxParams`/`minContext`/`maxContext`/`minGpu`/`maxGpu`/`sort` into state and displays "active filter" chips for them, but `RegistryFamilyView.tsx` only actually applies three of the ten fields (`productionReady`, `commercialUse`, `family`) to the rendered list — the rest are collected and silently dropped. A user can select "Params: 10–100B," see the chip appear, and get back a completely unfiltered family grid. `_families.json` is a hand-maintained cache that nothing reads, and it's already wrong (`deepseek.variant_count: 0` while the family actually has one variant). `IdentitySchema` and `MissingModelRefSchema` are exported from the schema file and used by nothing. `related_models` on the Llama family points at four family IDs (`llama-2-family`, `qwen-family`, `gemma-family`, `deepseek-family`) that don't exist anywhere in the repo, and because Registry is explicitly exempted from the shared relationship-integrity check in `validate-content.ts` (`isRegistry` short-circuits the block that would have caught this), the dangling references pass validation silently and render as **non-clickable plain-text badges** in the UI regardless.

Finally, the modality taxonomy is gone and nothing replaced it. The old `RegistryTaskSchema` (`embedding | reranker | vision | speech | llm | multimodal | ocr`) was deleted in the legacy removal, and neither `RegistryFamilySchema` nor `RegistryVariantSchema` has any field that says what *kind* of model a family is. With two LLM families in the data this is invisible. It becomes a launch-blocking problem the day you add the first embedding or vision family, because there will be no schema field, no route segment, and no filter to distinguish it from an LLM.

None of this means start over. The directory structure, the route structure, and the component decomposition are sound and worth keeping. But "Registry: KEEP AS IS" in the Jul 13 freeze verification is now **factually false** for the live code, and this needs to be corrected before anything else is added to the registry.

---

## 2. Strengths

- **Family→Variant separation is real and correctly modeled.** `_index.json` holds shared family metadata (architecture, ecosystem, license, engineering notes, timeline); each variant file holds only variant-specific specs (size, hardware, downloads, runtime compatibility). This is the right normalization and it eliminates the old problem of `size_mb: 0` on a family-shaped "model."
- **Search indexing genuinely improved.** `lib/search.ts` now indexes families and variants separately with structured, weighted fields (`parameter_count`, `context_window`, `min_gpu_memory`, `production_ready`, `commercial_use`) plus extracted keywords from prose — a real fix of the "4-field shallow index" problem the Jul 15 audit correctly identified.
- **Variant inheritance from family is handled explicitly and legibly.** The variant page does `variantData.capabilities || familyData.capabilities`, not a deep-merge black box — an engineer reading the page component can see exactly what falls back to what.
- **Card components are appropriately dense for the stated audience.** `FamilyCard`/`VariantCard` use a compact mono spec grid rather than the old single-card-shows-everything design; this is a genuine scanability win for "experienced AI engineer scanning fast," matching Mode 4 (UX Research) priorities in your own skill file.
- **The faceted search API design (if it were wired up) is competent** — range-based param/context/GPU filters, sort, pagination — this is close to what a production model registry needs. The problem is entirely that it's disconnected, not that it's badly designed.
- **One-file-per-variant is the correct data organization** for the stated future scale (hundreds of families, thousands of variants) and matches the pattern already proven out in `data/models/llm/`.

---

## 3. Weaknesses

- Registry schemas do not extend `BaseMetaSchema` — see §7, the critical finding.
- No modality/task classification field anywhere in the new schema — see §4.
- A fully-built search API route with zero callers.
- A filter UI that silently no-ops on 7 of its 10 fields.
- A hand-maintained denormalized index file (`_families.json`) that nothing reads and that is already stale/wrong.
- Dangling cross-references in `related_models` that validation is structurally incapable of catching for Registry specifically.
- Two dead schema exports (`IdentitySchema`, `MissingModelRefSchema`) left over from a migration that documented itself as leaving "no dead code."
- `related_models` renders as inert badge text with no `href` — the one cross-linking affordance Registry has doesn't link anywhere.
- Registry content is explicitly exempted from the shared content-integrity validation block that every other content type gets.

---

## 4. Critical Design Problems

### 4.1 No modality/task axis (Critical — blocks the stated extensibility goal outright)

`RegistryFamilySchema` and `RegistryVariantSchema` contain zero fields for classifying *what kind* of model something is. The old `RegistryTaskSchema` enum (`embedding, reranker, vision, speech, llm, multimodal, ocr`) was deleted wholesale during the legacy removal and nothing took its place — not even a free-text `category` field survived (I grepped `lib/schemas/registry.ts`, `types/registry.ts`, and `lib/registry-constants.ts` for `modality`/`task`/any of the seven old enum values: zero matches).

This is invisible today because both families in the data are LLMs. It stops being invisible the instant you add an embedding model, a reranker, or a vision model — at that point there is no schema field to record the distinction, no way to filter "show me embedding models," no way to group the registry home page by modality, and no way to keep an embedding model from being rendered through the same "parameter count / context window / quantization" lens that only makes sense for generative LLMs. You explicitly listed LLMs, embeddings, vision, speech, multimodal, video, reasoning, MoE as required future extensibility targets in your review prompt — the schema currently supports exactly one of those (LLM) as a first-class concept, and it doesn't even name it.

**This is the single highest-priority fix.** It's also the cheapest one to do now, while there are only two families, and the most expensive one to retrofit later once dozens of families assume LLM-shaped fields.

### 4.2 Registry schemas silently diverge from `BaseMetaSchema` (Critical — governance regression, not a UI bug)

Confirmed by direct comparison of `lib/schemas/base.ts` against `lib/schemas/registry.ts`:

| Field | In `BaseMetaSchema` | In `RegistryFamilySchema` / `RegistryVariantSchema` |
|---|---|---|
| `slug`, `title` | Yes | No |
| `domain`, `category`, `difficulty`, `engineering_area` | Yes | No |
| `lifecycle`, `stability`, `confidence`, `canonical_status`, `engineering_maturity` | Yes | No |
| `related_content` (typed `ContentRefSchema[]`) | Yes | No — Registry has its own untyped `RelatedModelSchema { id, relationship }` instead |
| `prerequisites`, `recommended_next` | Yes | No |
| `review_frequency`, `last_verified`, `verified_against`, `compatible_versions`, `breaking_changes` | Yes | Partial (`last_verified` exists only nested inside `status`, not at top level) |
| `owner`, `github_repo` | Yes | No |
| `created_at`/`updated_at` date validation (`.date()` format-checked) | Yes | No — Registry uses bare `z.string()`, unvalidated |

This is worse than the Model schema exception your Jul 13 freeze verification flagged and explicitly accepted, for two reasons. First, Model at least has a `.transform()` that normalizes its divergent field names back to `BaseMetaSchema`-compatible output for every downstream consumer — Registry has no equivalent, so nothing downstream can treat a Registry entry the way it treats any other content type. Second, Model's exception was *investigated, documented, and accepted as a permanent, cost/risk-justified exception* with a checklist and a code comment. Registry's divergence has none of that — it's undocumented, it happened three days after the review that would have caught it, and `ARCHITECTURE_FREEZE.md`/the Jul 13 verification still assert Registry uses the shared base, which is no longer true.

Concretely, this means: Registry entries cannot be marked `draft`/`verified`/`stable`/`deprecated`/`archived` like every other piece of knowledge in AENS; cannot carry a `confidence` or `engineering_maturity` rating for decision support (ironic, since "deployment and model-selection knowledge" is the Registry's entire reason to exist per your own review prompt); and cannot participate in the typed relationship graph (`ContentRefSchema` + `RelationshipTypeSchema`) that Pattern, Workflow, Debug Guide, and Decision Guide all use to cross-link to each other. Registry is architecturally an island relative to the other eight content types.

### 4.3 `related_models` is untyped, unvalidated, and doesn't link anywhere (High)

Three compounding problems in one field:

1. **Schema:** `RelatedModelSchema = { id: string, relationship: string }` — no `type` discriminator, no enum-constrained `relationship` (contrast with `RelationshipTypeSchema`'s 26-value enum used everywhere else), and no reference-existence check.
2. **Validation:** `scripts/validate-content.ts` has `const isRegistry = normalizedPath.startsWith('data/registry/')`, and the entire block that performs relationship/reference-integrity checking (`related_models`, `related_packages`, etc., lines ~460–475 and the `collectStringRelationships` calls per content type) is gated to run only when `!isRegistry`. Registry never gets checked. This is exactly how `llama-3/_index.json` currently ships with four `related_models` entries (`llama-2-family`, `qwen-family`, `gemma-family`, `deepseek-family`) pointing at families that don't exist anywhere in `data/registry/families/` (which contains only `llama-3` and `deepseek` — note even `deepseek-family` doesn't match the real id `deepseek`) — and the build stays green.
3. **UI:** even if the references were valid, `app/registry/families/[family]/[variant]/page.tsx` renders `familyData.related_models.map(rel => <RegistryBadge>{rel.id}</RegistryBadge>)` with no `<Link>`, no `href`. It's decorative text. A user cannot click from Llama 3 to DeepSeek even when both sides of the relationship exist.

### 4.4 Faceted search is built twice and wired up zero times (High — scope/effort waste, not a correctness bug per se, but a maintainability trap)

`app/api/registry/search/route.ts` implements a complete faceted search endpoint: query + range filters on params/context/GPU + production/commercial booleans + family filter + six sort modes + pagination. `RegistryFilter.tsx` implements a full client-side control surface for the same filter set, including `PARAMETER_RANGES`/`CONTEXT_RANGES`/`GPU_RANGES` constants shared between the two. Neither is connected to the other, and neither is fully connected to what the user actually sees:

- I grepped the entire repo for calls to `/api/registry/search` outside the route file itself: **zero results.** The API is unreachable from any UI.
- `RegistryFamilyView.tsx`'s `filteredFamilies` `useMemo` only reads `filters.productionReady`, `filters.commercialUse`, and `filters.family` from the `RegistryFilters` object the filter component produces. `minParams`, `maxParams`, `minContext`, `maxContext`, `minGpu`, `maxGpu`, and `sort` are all present in the `RegistryFilters` interface, populated by the UI, shown in the "active filters" chip list (`getActiveFilterLabels()` explicitly handles the params/context ranges) — and then never read by the component that renders the actual list. Selecting a parameter-count range visibly does nothing to the results.
- Separately, even a correctly-wired version of this filter would be a **category error**: parameter count, context window, and GPU memory are *variant-level* fields. `RegistryFamilyView` filters a list of **families**. There is no aggregation logic ("does any variant in this family have 70B+ params") anywhere — the filter was designed for variant-grain data and bolted onto a family-grain list.

This is two engineering efforts (API + UI controls) that produce zero net user-facing capability, plus a live, silent bug in what capability the UI does claim to offer.

### 4.5 `_families.json` is a dead, already-incorrect denormalized cache (Medium-High — this is the exact failure mode the migration was supposed to eliminate)

`data/registry/_families.json` duplicates `id`, `name`, `provider`, `description`, `variant_count`, `production_ready`, `commercial_use` for each family. I grepped every `.ts`/`.tsx` file in the repo for references to it: the only two hits are `registry_families: getAllRegistryFamilyIds().length` in `lib/data.ts` (which doesn't read the file, just counts directory entries) and a display label in `app/page.tsx`. **Nothing loads `_families.json` at runtime.** It's pure dead weight, hand-maintained, and it's already wrong: it says `"deepseek": { "variant_count": 0 }`, while `deepseek/_index.json` correctly lists `"variants": ["r1-70b"]` and the file `deepseek/r1-70b.json` exists on disk. This is precisely the "monolithic file that drifts from the source of truth" failure pattern that `REGISTRY_ARCHITECTURE_AUDIT.md` (§4.2, "why all models are in one file") identified as the root cause of the *previous* architecture's problems — reintroduced, in miniature, by the fix for that problem.

### 4.6 Incomplete cleanup contradicts the removal report's own claims (Medium)

`LEGACY_REGISTRY_REMOVAL_REPORT.md` states under "Verification Results": *"No dead code: ✅ All removed functions/types no longer referenced."* Two schema exports contradict this directly:

- `IdentitySchema` (`family`/`variant`/`checkpoint`/`provider`) is defined in `lib/schemas/registry.ts` and exported through `types/registry.ts`, but is not referenced by `RegistryFamilySchema`, `RegistryVariantSchema`, or any component. It's a leftover from the old `RegistryModelSchema.identity` nested object.
- `MissingModelRefSchema` — explicitly commented `"Structured missing model reference for graph completeness"` — is likewise exported and used nowhere. Notably, this is *exactly* the mechanism that should have been used to mark the four dangling `related_models` entries in §4.3 as intentionally-missing placeholders rather than silently-broken references. It was built and then not wired to the one place it was needed.

---

## 5. Scalability Risks

| Scale point | Current behavior | Risk |
|---|---|---|
| 100 families | `RegistryFamilyView` loads all families client-side, filters/paginates in a `useMemo`. Fine — this is small data, no network round-trip needed. | Low |
| 500 families, 3,000 variants | Every family page still does `getAllRegistryFamilyIds()` → full directory scan + full `_index.json` read per `generateStaticParams()` build pass (this is fine, standard SSG). But `app/registry/page.tsx` has **no pagination on the family grid itself** — `RegistryFamilyView` paginates internally via `DEFAULT_PAGE_SIZES.registryFamilies`, so this is actually handled. However: the search index (`buildSearchIndex()`) is rebuilt by iterating every family and every variant on every call per `lib/search.ts` — confirm this is memoized/cached at build time, not per-request, before this scales past a few hundred entries. | Medium — verify caching, not confirmed broken |
| Multiple modalities | No schema support (§4.1). This isn't a performance risk, it's a hard correctness wall — the app will render an embedding model through parameter-count/context-window/quantization UI built exclusively for LLMs. | Critical |
| Community contributions | Zero validation coverage for Registry cross-references (§4.3) means bad data — dangling relations, mismatched family/variant IDs — will merge silently. At 2 families this is cosmetic; at 100+ families with external contributors, this becomes a steady trickle of undetected broken links. | High |
| Daily updates | `_families.json` requires manual maintenance and nothing enforces it stays in sync (it's already out of sync at n=2). If anything ever starts reading it, it will silently serve stale counts. | Low today, will bite the first time someone wires it up "because it's already there" |

---

## 6. UI/UX Problems

- **Faceted filters that don't filter** (§4.4) is the single worst UX defect in the system today — worse than a missing feature, because it actively misleads the user into believing a query executed correctly.
- **`related_models` badges look interactive but aren't** — mono-font badges styled identically to every other clickable badge on the page, with no visual or behavioral cue that they're inert. This violates basic affordance consistency: everything else that looks like a `RegistryBadge` in this codebase (provider, license, runtime) is either informational-only by clear convention or a link; this one looks like the former but represents relationship data that should be the latter.
- **No indication of "why is this list empty"** distinction: `RegistryFamilyView` shows "No families match the selected filters" whether the mismatch is because a filter genuinely excluded everything or (per §4.4) because the filter silently no-op'd and the underlying data itself is just sparse. At n=2 families this is low-stakes; it will confuse users once the catalog is larger and filters are trusted to work.
- **Family page reference splitting logic is unnecessarily rigid**: `familyData.references.slice(0, 5)` as "Quick Links" and `.slice(5)` as "All References" is an arbitrary cutoff with no indication of priority/category — the schema already has `priority` and `category` fields on `ReferenceSchema` that go completely unused for this grouping. An engineer scanning for "the official docs" has to read a flat alphabetical-by-insertion list instead of official-first.
- **No breadcrumb-level indication of modality** (can't have one — see §4.1) — once non-LLM families exist, `Home → Registry → Llama 3` and `Home → Registry → some-embedding-model` will be visually indistinguishable in navigation despite being fundamentally different artifact types a user is trying to find.

None of these are cosmetic critiques — each one is a specific, demonstrated case of the UI claiming a capability (filtering, cross-linking, prioritized references) that the underlying data/behavior doesn't actually deliver.

---

## 7. Schema Problems

Consolidating and prioritizing what's spread across §4:

1. **No `BaseMetaSchema` extension** (§4.2) — the defining schema problem. Fix this before adding a third family.
2. **No modality/task field** (§4.1) — the defining extensibility problem.
3. **`related_models` uses an ad hoc, untyped shape** instead of `ContentRefSchema`/`RelationshipTypeSchema` (§4.3).
4. **Unvalidated date strings.** `BaseMetaSchema` enforces `.date()` format on `created_at`/`updated_at`; Registry's copies are bare `z.string()`. Cheap to fix, currently a silent data-quality hole (nothing stops `"created_at": "last week"` from validating).
5. **Two dead exports** (`IdentitySchema`, `MissingModelRefSchema`) inflating the schema file with no runtime value (§4.6).
6. **`size_mb` required on every variant** even though the old audit already flagged `size_mb: 0` as meaningless for entries where size genuinely isn't known or applicable (e.g., an API-only/closed-weight model you still want to catalog for comparison purposes — a real future case given "commercial_use," "license," and hosted-service fields already exist in the schema). It should be optional with a documented "unknown" convention rather than implicitly encouraging `0` as a stand-in for "not applicable."
7. **`variants: z.array(z.string()).default([])` on the family, duplicating what a directory listing already tells you** (`getRegistryVariantIds()` scans the filesystem). This is a second, in-band place the variant list can drift from disk truth — lower severity than `_families.json` since at least it's inside the file that's actually read, but the same failure class: two sources of truth for one fact.

---

## 8. Knowledge Architecture Problems

- **Registry doesn't own model-selection knowledge as cleanly as the audit intended.** The `engineering_snapshot` (`best_for`/`avoid_for`/`deployment_complexity`/`recommended_use_case`) duplicates territory that, per your own frozen content-type boundaries, plausibly belongs to Decision Guide. Nothing in the current schema or docs states which one wins when they disagree, and Registry's `engineering_snapshot` has no `related_content` link back to a canonical Decision Guide entry to resolve that ambiguity (it can't — no typed relations, per §4.2).
- **Deployment/runtime knowledge is duplicated across Registry and Pattern/Workflow territory without a stated boundary.** `deployment_notes`/`optimization_notes`/`compatibility_notes` in `EngineeringNotesSchema` read like Debug Guide or Workflow content (step-like operational guidance) rather than reference metadata. This is exactly the kind of "does the Registry clearly own deployment knowledge, or does it duplicate another resource" question your review prompt asked — and the honest answer from the schema is: it's not clearly demarcated, it's just wherever the migration author happened to put it.
- **No canonical-source-of-truth statement for Registry vs. Model content types.** `data/models/llm/*.json` (Model content type) and `data/registry/families/**` (Registry content type) both describe the same real-world models with overlapping fields (`context_window`, capabilities, provider). The original `REGISTRY_ARCHITECTURE_AUDIT.md` flagged this duplication as Problem #2 ("No canonical source of truth") and it is **not resolved** by the Family→Variant migration — the migration fixed the internal shape of Registry data, not its boundary against Model. This is a knowledge-architecture problem that survived the entire refactor untouched.

---

## 9. Search Problems

- **Facets exist in the index but aren't user-reachable** (§4.4) — the deepest search problem, already covered.
- **`capabilities` (vision/reasoning/tool_calling/multilingual) aren't indexed as filterable facets at all**, despite being exactly the kind of query your review prompt calls out as a target ("70B models with vision support"). The search index only carries `parameter_count`, `context_window`, `min_gpu_memory`, `production_ready`, `commercial_use` — capability booleans are absent from `SearchResult` in `lib/search-types.ts` entirely. Even a fully-wired filter UI couldn't answer that query today because the field doesn't exist in the index.
- **No semantic search.** Fuse.js (fuzzy lexical matching with weighted keys) is what exists, which is appropriate for a personal single-user tool at this scale — but worth stating plainly rather than leaving implicit, since it will not handle "models similar to X for RAG use cases" style queries no matter how the facets are tuned. This is a reasonable trade-off for a second-brain tool, not a defect — flagged here only because your review prompt explicitly asked "should semantic search be supported."

---

## 10. Recommended Improvements (Prioritized)

**Must — fix before adding a third family:**
1. Add a `modality` (or `task`) enum field to `RegistryFamilySchema`, required, with values covering at minimum `llm | embedding | reranker | vision | speech | multimodal`. Backfill `llama-3` and `deepseek` as `llm`. This is the cheapest it will ever be to add (2 files to backfill today vs. dozens later).
2. Extend `RegistryFamilySchema` and `RegistryVariantSchema` from `BaseMetaSchema`, mapping `name`→ keep, add `title`/`slug`, add `lifecycle`/`stability`/`confidence`/`engineering_maturity`/`canonical_status`, replace `RelatedModelSchema` usage with `ContentRefSchema` + `RelationshipTypeSchema`. Given there are only 3 data files total right now, this migration costs a fraction of what the equivalent Model-schema migration was correctly rejected for in the Jul 13 freeze verification — do it now while it's still cheap, don't let it calcify into a second permanent, undocumented exception.
3. Remove the `isRegistry` exemption in `scripts/validate-content.ts` so Registry gets the same relationship-integrity checking every other content type gets; fix or remove the four dangling `related_models` entries in `llama-3/_index.json` as part of the same change.
4. Make `related_models` render as actual `<Link>`s to `/registry/families/{id}` when the target exists, and use `MissingModelRefSchema` (already built, currently unused) to explicitly and validly represent "we know this related family exists but haven't catalogued it yet" instead of a silently-dangling plain string.

**Should — fix before the filter UI is trusted for anything beyond 2 families:**
5. Either wire `RegistryFilter`'s param/context/GPU range filters into `RegistryFamilyView`'s actual filtering logic (with correct family-vs-variant aggregation), or remove those controls from the UI until they do something. Showing a filter chip for a filter that doesn't filter is worse than not having the filter.
6. Decide whether `/api/registry/search` is meant to be the long-term faceted search surface (in which case, wire the UI to call it and delete the parallel client-side filtering logic) or delete the route. Don't maintain both indefinitely — that's the same "two sources of truth" pattern as `_families.json`.
7. Delete `_families.json`, or make it a genuinely generated build artifact (written by a script from `getAllRegistryFamilies()` output) if something external actually needs a flat JSON export. Right now it's neither generated nor consumed — pure liability.
8. Delete `IdentitySchema` if it stays unused after (2) above; it's superseded by `BaseMetaSchema`'s identity fields once that migration lands.
9. Add `capabilities` booleans (vision/reasoning/tool_calling/multilingual) to the search index so the capability-based queries your review prompt names as a goal are actually answerable.

**Nice-to-have:**
10. Sort family "Quick Links" by `reference.priority`/`reference.category` instead of array-order `.slice(0, 5)`.
11. Add a short "Model vs. Registry" boundary statement to whatever doc governs content-type boundaries, resolving the duplication flagged in §8.

---

## 11. Future-Proofing Recommendations

- **Freeze the modality enum deliberately, not implicitly.** Once §10.1 lands, treat it the way `RelationshipTypeSchema` is treated — a closed, reviewed enum, not something individual data files invent ad hoc.
- **Adopt a standing rule: any new Registry field that duplicates something derivable from the filesystem (a count, a list of child IDs) must be marked either "computed at build time, never hand-edited" or removed.** `_families.json` and `RegistryFamilySchema.variants` are both instances of the same anti-pattern; a rule prevents the third instance.
- **Treat Registry the same as the other eight content types going forward — no separate validation carve-out, no separate relationship schema.** The moment Registry got its own bespoke `RelatedModelSchema` and its own `isRegistry`-gated validation path was the moment it started drifting from the rest of AENS. Closing that gap now, while the data volume is trivial, is far cheaper than the "large-cost, high-risk" migration the Jul 13 review correctly declined to force onto Model.
- **When embeddings/vision/speech families are eventually added, expect the variant-level schema fields to need modality-specific optional sub-schemas** (e.g., an embedding variant cares about `embedding_dimensions`/`similarity_metric`, not `context_window`/`quantizations` in the LLM sense). Plan for `SpecificationsSchema` to grow modality-conditional optional fields rather than staying LLM-shaped with everything else awkwardly reusing or ignoring LLM fields.
- **Re-run the Freeze Verification specifically for Registry** once the Must-priority items land, and correct `ARCHITECTURE_FREEZE.md`'s per-content-type table (currently still says Registry: KEEP AS IS, schema unchanged since Jul 13 — no longer true).

---

## 12. Final Architecture Score: **5.5 / 10**

The directory/route/component decomposition (the part visible in the "Registry Page Plan") is genuinely good, arguably an 8. But architecture score has to account for the schema's relationship to the rest of the system, and on that axis Registry is currently the weakest-governed content type in AENS — weaker than Model, which at least has a documented, accepted exception. A score above 6 isn't earned until the `BaseMetaSchema` and modality gaps close.

## 13. Production Readiness Score: **4 / 10**

Two families, three variants, and it already has: a stale denormalized cache, silently-dropped filters presented as working, dangling cross-references that validation can't catch by construction, and dead schema exports contradicting the migration's own "no dead code" verification claim. None of this is visible at n=2. All of it will be visible and costly at n=50.

## 14. Long-Term Maintainability Score: **5 / 10**

Good bones (file-per-variant, clean component boundaries, legible inheritance logic in the variant page) held back by exactly the failure modes AENS's own governance process exists to prevent: undocumented schema drift, an exempted validation path, and a rewrite that shipped three days after — and without re-triggering — the review process that would have caught it.

---

## 15. If I were designing AENS Registry from scratch today

1. **Registry extends `BaseMetaSchema` from day one** — no separate identity/lifecycle/relationship model, full stop. It's a content type in AENS, not a special case.
2. **`modality` is a required, top-level, closed-enum field on the family from the first line of schema code** — not bolted on after the fact. Everything else (which optional spec sub-schema applies, which UI treatment renders, which route grouping applies) keys off it.
3. **One relationship model everywhere**: `related_content: ContentRefSchema[]` at the family level (and optionally the variant level for variant-specific relationships like "this exact quantization supersedes that one"), rendered through a single shared `RelatedContentList` component already used by the other eight content types — not a bespoke Registry-only badge list.
4. **No hand-maintained index files.** If a flat family-summary artifact is genuinely needed (e.g., for an external API or a static sitemap), it's generated by a build script from the canonical per-family files and checked for staleness in CI/`validate-content.ts`, never hand-edited.
5. **Search facets and UI filters share one contract from the start** — a single `RegistryFilters` type consumed identically by both the API route and the client component, with a test (even a trivial one) asserting that every field in the type actually narrows the result set. That single test would have caught the current bug on day one.
6. **A written, one-paragraph boundary statement between Registry and Model** committed alongside the schema, not left implicit — resolving §8 before it has a chance to become "which of these two files do I edit" folklore.

Everything else — the family/variant file layout, the route structure, the card-based scannable UI — is close enough to right that I'd keep it as designed.
