# AENS Workflow Resource Prompt — v2.1 → v3.0 Upgrade

Inspected against: `lib/schemas/workflow.ts`, `lib/config/workflows.ts`, `app/workflows/[id]/page.tsx`, `components/shared/WorkflowStepList.tsx`, `CONTENT_QUALITY_STANDARD.md`, `RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md`, `ARCHITECTURE_FREEZE.md`, `AENS_Workflow_Layer_Design_Report.md`. Confirmed: the `worked_examples[].code`/`language` fields and the `WORKFLOW_CATEGORIES` validation-layer enum are both already implemented, and the three page-rendering fixes (steps `uses`, Worked Examples, Production Profile) are live. v2.1 is fully schema-compatible — no correctness bugs found, only generation-quality gaps.

**Scope note on the "do not redesign" constraint:** the "Markdown Output Format & Schema Requirements" section (the `##`/`###` headers that map 1:1 to `WorkflowSchema` fields) is treated as frozen and is unchanged below — same headers, same order, same field names. The instructional sections above it (Role & Voice, Objective, Precision Standards, Citation Expectations, Final Validation Checklist) are the actual subject of this audit, since those are what shape *how well* Perplexity fills in that frozen structure — improving them is the entire point of this exercise.

---

## 1. Prompt Audit

### Structural findings

- **No conflicting instructions found.** The four instructional sections don't contradict each other or the output-format section. Section ordering is logical (voice → objective → evidence standards → citations → output format → validation).
- **One redundancy:** "Never write as a teacher or tutor" (§1) and "Avoid tutorial hand-holding" (§1, same bullet) say the same thing twice inside one bullet. Minor, but easy to tighten.
- **One real completeness gap, not a redesign:** the `## Suggested Meta` section asks for `tags`, `aliases`, `keywords`, and four `related_*` cross-links — but never asks for `difficulty`, `domain`, `engineering_area`, `estimated_reading_time`, `prerequisites`, `recommended_next`, `search_tokens`, or `next_links`. These are all real `BaseMetaSchema`/`WorkflowSchema` fields, and `RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md` explicitly lists most of them as "Recommended (Should Collect)" for Workflow specifically. Today, whoever converts the markdown to JSON has to invent these values separately, off-prompt, which is exactly the kind of consistency gap this upgrade is supposed to close. This is an *addition* of a few bullets under an *existing* header (`## Suggested Meta`), not a structural change — no header is added, removed, or reordered.

### Knowledge quality

- **Engineering decisions:** well-served by the `Decision` field's existing instruction ("state a clear default recommendation and its rationale"), but it doesn't explicitly demand the "when should I change it" half of the brief's own framing — today a model could satisfy the instruction with just a default + rationale and skip the deviation trigger entirely. Worth tightening into an explicit three-part template.
- **Integration/system thinking:** well-served by §2.3 ("Composition over APIs") and the Worked Examples instruction, which already bans trivial API examples. Good as-is.
- **Debugging/failure knowledge:** `Failure Points` and `Common Failure Points` ask for "specific, named failure modes" with "systemic root causes" — good direction, but doesn't require a stated *triggering condition* (the threshold or circumstance under which the failure actually occurs), which is the difference between a searchable failure mode and a vague one. This is the single highest-leverage wording fix in the whole prompt.
- **Architecture reasoning:** adequately covered by Overview + Starter Stack + Steps; no gap.

### Hallucination resistance

- **Biggest real risk, currently unaddressed:** the `Uses` field (per-step) and the `Cross-Links` field (Suggested Meta) both ask Perplexity to output "AENS package IDs" / "AENS model IDs" — but Perplexity has no access to `data/packages/`, `data/models/`, etc. It cannot know which canonical IDs actually exist in this specific AENS instance. Nothing in the current prompt tells it this, so it will confidently emit IDs that look plausible but may not exist, with no signal to the person converting the content that these need verification. This is a hallucination-resistance gap specifically, not a general quality one — it's the exact failure mode the "Verifiability" instruction is designed to prevent, just not applied to this field. Fix: explicit instruction that these are *candidate* names using best-guess AENS naming convention, marked as unverified-by-construction, requiring manual confirmation before being written into `related_*` fields.
- The `[unverified]` mechanism for claims is good and should stay, but nothing currently tells Perplexity to *prefer dropping a claim entirely* over hedging it — right now a model could satisfy the letter of the instruction by tagging everything uncertain `[unverified]` rather than doing the harder work of finding a real source or cutting the claim. Worth an explicit preference order.
- Citation mechanics have a latent consistency risk: footnotes (`[^1]`) and the `## Sources` bulleted list are specified as two separate instructions with no explicit requirement that they reconcile 1:1. In practice this can produce orphan footnotes or unlisted sources. Easy, cheap fix.

### Content density

- Field-level length constraints exist for `Overview` (2-4 sentences) and `What` (1-2 sentences), but not for `Description` inside Worked Examples, `Implementation Notes`, or the Production Profile subsections — these are exactly where a model tends to pad. Worth adding explicit caps.
- No instruction currently bounds worked-example code to *only* the tools already declared in Starter Stack / Steps — an easy way for a model to introduce an unlisted dependency mid-example, which both bloats the resource and breaks the "minimal starter stack" principle from `CONTENT_QUALITY_STANDARD.md`.

### Pilot check — Build RAG System / Build Classification Pipeline / Build Regression Pipeline

- **Build RAG System:** already has a real precedent (`build-rag-system.json`) with genuine numeric latency/cost detail. v2.1 handles this well already; the main upside from this upgrade is the strengthened failure-point specificity (e.g., "silent truncation above 512 tokens" instead of "may lose context").
- **Build Classification Pipeline:** higher risk of generic textbook drift than RAG, since classification is a much more commonly-documented topic online — more surface area for Perplexity to default into tutorial-style content (train/test split, accuracy metric explanations) instead of production wisdom (class imbalance handling in production, drift detection, threshold calibration under shifting base rates). The strengthened anti-pattern list and the explicit "no textbook content" reinforcement in §5 (new) directly target this.
- **Build Regression Pipeline:** same risk as classification, plus a specific density risk — regression has fewer "exciting" integration failure modes than RAG/classification, so a model may pad with generic statistical explanation to fill space. The tightened length constraints and the "cut it if it doesn't save 2 AM debugging time" reinforcement in §1 target this directly.

All three are handled by the same set of wording fixes below — no workflow-specific branching was needed in the prompt itself, which is the correct outcome for a single reusable template.

---

## 2. Improved Prompt (v3.0)

```markdown
# AENS Workflow Resource Prompt v3.0

## Target Workflow Specifications
*Before running this prompt, replace the bracketed placeholders below with details for the target workflow.*

*   **Target Workflow Name**: `[WORKFLOW_NAME]` (e.g., Build RAG System)
*   **Workflow Category**: `[CATEGORY]` (Must be exactly one of: `classical-ml`, `deep-learning`, `computer-vision`, `nlp`, `llm-engineering`, `rag`, `agentic-systems`, `fine-tuning`, `evaluation`, `mlops`, `data-engineering`, `production-systems`)
*   **Starter Stack**: `[STARTER_STACK]` (e.g., PyTorch, sentence-transformers, FAISS)
*   **Core Pipeline Steps**: `[PIPELINE_STEPS]` (e.g., Parsing, Chunking, Late Chunking, Indexing, Reranking, Generation, Evaluation)
*   **Production Profiling Targets**: `[PRODUCTION_PROFILE_TARGETS]` (e.g., sub-second latency budget, quantized embeddings, sharded vector index, speculative decoding)
*   **Worked Examples Focus**: `[WORKED_EXAMPLES_FOCUS]` (e.g., RRF Hybrid Search fusion, Late Chunking mean pooling extraction)
*   **Canonical Evaluation Criteria**: `[CANONICAL_EVALUATION]` (e.g., Context Precision, Context Recall, Faithfulness, Answer Relevance)

---

## Instructions for Perplexity Content Generation

### 1. Role & Voice
You are a Principal AI Systems Architect and Senior ML Platform Engineer. Write as an experienced practitioner documenting production integration pipelines for other experienced engineers — the document should read like the internal playbook they keep open in a side window while building, not a chapter from a textbook or an article written to be read once.
*   **Never** write as a teacher or tutor (no "first, let's understand...", no motivational framing, no historical background on why the technology exists).
*   **Never** include placeholder text, TODOs, or TBD markers.
*   **Never** use marketing jargon, fluff, generic high-level statements, or restated official documentation.
*   **Engineering Voice**: Concise, dense, technically precise, actionable. Apply the "Engineer at 2 AM" test to every sentence: if it doesn't save hours of debugging or prevent a bad architectural decision, cut it — don't soften it, cut it entirely.

### 2. Objective & Trade-off Philosophy
Generate a production-grade, citation-rich **AENS Workflow Resource Markdown Document** for **`[WORKFLOW_NAME]`**.
The resource must answer: **"How do I wire this end-to-end, what decisions must I make at each step, and what breaks at scale?"**

Every section should address:
1.  **Defaults over Options**: For every decision point, state (a) the concrete default recommendation, (b) why it's the default, and (c) the specific condition under which an experienced engineer would deviate from it. A decision that only states an option without a stated default, or a default without a stated deviation trigger, is incomplete.
2.  **Failure Envelopes**: Address integration-level failures (silent failures, latency deadlocks, context fragmentation) that only appear when components are composed together — not isolated single-library errors. Every failure mode must name the triggering condition (a threshold, a scale point, a specific input shape) that causes it, not just the symptom. "May lose context on long documents" is not acceptable; "silently truncates above 512 tokens when the embedding model's context window is exceeded" is.
3.  **Composition over APIs**: Focus on the *wiring* and *glue* between models, patterns, and packages. Never duplicate basic package API syntax or single-model details — if a sentence would be true and useful even without the surrounding pipeline, it belongs in a Package or Model resource, not here.

### 3. Precision & Anti-Hallucination Standards
*   **Search and Synthesize**: Actively use web search to inspect official documentation, research papers, and verified post-mortems of companies running these pipelines at scale.
*   **Confidence Wording**: Avoid vague hedge words ("usually", "often", "sometimes", "might", "could potentially", "in general"). State systemically verified constraints, not impressions.
*   **Hierarchy of Evidence**:
    1. Seminal research papers (e.g., Jina Late Chunking paper, RRF papers)
    2. Official platform/library documentation (e.g., PyTorch, LangChain, Qdrant, vLLM docs)
    3. Production engineering blogs from teams that actually run the pipeline described (e.g., Netflix, Uber, Airbnb, Stripe, Jina AI) — not marketing pages from vendors selling the technology
    4. University materials and reputable technical write-ups
*   **Verifiability, in priority order**: (1) find a credible source, (2) if none exists, omit the claim entirely, (3) only if the claim is genuinely useful and no better alternative exists, mark it `[unverified]`. Do not use `[unverified]` as a substitute for doing the research — it is a last resort, not a convenience.
*   **AENS cross-reference IDs are candidates, not verified facts.** Perplexity has no access to AENS's internal `data/` directory and cannot know which package, model, cheatsheet, pattern, or debug-guide IDs actually exist in this specific instance. Every ID produced in a `Uses` field or in `Suggested Meta → Cross-Links` must:
    - use the tool/library/model's real, well-known common name in lowercase-kebab-case (e.g. `sentence-transformers`, `bert`, not an invented AENS-specific slug),
    - never be presented as confirmed to exist in AENS — these are candidates for the person to verify against `data/packages/`, `data/models/`, `data/cheatsheets/`, `data/patterns/`, and `data/debug-guides/` before being written into any `related_*` field.

### 4. Citation Expectations
Link engineering claims and performance statistics to source URLs using markdown footnotes (e.g., `[^1]`). Every major technical claim (e.g., latency bounds, token limits, memory growth, chunking heuristics) must have a footnote pointing to a live documentation page, paper, or production source. The `## Sources` list and the footnotes must reconcile exactly: every footnote number must appear once in `## Sources`, and every URL in `## Sources` must be referenced by at least one footnote. No orphan citations, no unlisted sources.

### 5. Hard Anti-Pattern Bans
The following must never appear anywhere in the output, regardless of what section they'd otherwise fit in:
*   Generic introductions ("In today's AI landscape...", "As AI systems become more complex...")
*   Motivational or evangelizing language about the technology
*   Beginner-tutorial explanations of concepts assumed known by the target reader (e.g., explaining what an embedding is, what a train/test split is)
*   Excessive theory disconnected from an implementation decision (theory is welcome only when it directly justifies a stated default)
*   Content that restates official documentation or Package/Model/Cheatsheet knowledge instead of the composition-level knowledge unique to this workflow
*   API reference material (parameter-by-parameter documentation) — that belongs to Package/Cheatsheet, not here
*   Filler transitions, throat-clearing, or restating the section header in prose
*   Obvious statements that provide zero decision-making value ("Testing is important", "Monitoring helps catch issues")
*   Unnecessary history or background on why a technology was created

### 6. Density Constraints
*   Worked Example `Description`: 2-3 sentences max.
*   `Implementation Notes` (per worked example) and each Production Profile subsection: 2-4 sentences max, written as dense technical statements, not paragraphs of explanation.
*   Worked Example code must use **only** tools already named in Starter Stack or in a Step's `Tools` field — do not introduce a new unlisted dependency mid-example. If the integration genuinely requires a tool not yet listed, add it to Starter Stack rather than introducing it silently.

---

## Markdown Output Format & Schema Requirements

Generate the resource using the exact headers below. Do not output JSON. Focus purely on generating high-density semantic markdown content.

### # `[WORKFLOW_NAME]`

### ## Overview
Provide a 2-4 sentence, high-density overview explaining what pipeline this workflow constructs, the primary output artifact it produces (e.g., a queryable index, a trained model), and why the integration is complex.

### ## Starter Stack
Provide a clean bulleted list of canonical libraries and modules required to implement the baseline pipeline (e.g., `sentence-transformers`, `faiss-cpu`, `chonkie`). No nice-to-haves.

### ## Steps
Specify the sequential steps (minimum 3, maximum 8) to construct the pipeline. For each step:

#### ### Step N: [Step Name]
*   **What**: A technical description of the exact operation performed (1-2 sentences).
*   **Tools**: Specific classes, methods, or CLI tools used (e.g., `RecursiveCharacterTextSplitter`, `sentence-transformers`).
*   **Decision**: The key engineering decision at this step: state the default recommendation, why it's the default, and the specific condition under which to deviate from it.
*   **Uses**: Structured cross-references to AENS entities, as candidate IDs for later verification (see §3). Format:
    - **packages**: `[comma-separated list of candidate AENS package IDs, e.g. pandas, pytorch]`
    - **models**: `[comma-separated list of candidate AENS model IDs, e.g. bert]`
    - **cheatsheets**: `[comma-separated list of candidate AENS cheatsheet IDs, e.g. pytorch]`
*   **Failure Points**: A bulleted list of 2-3 specific, named failure modes at this step, each stating the triggering condition and the systemic root cause (e.g., "silent chunk truncation — occurs when input exceeds the tokenizer's max sequence length and the loader doesn't validate length before splitting").

### ## Worked Examples
Provide 1-2 worked examples illustrating non-obvious integration points that only make sense in the context of the full pipeline. For each example:

#### ### Example: [Name of Example]
*   **Description**: Detailed engineering description of what this worked example solves (2-3 sentences max).
*   **Language**: Programming language (default is `python`).
*   **Code**:
    Provide a production-ready, clean, idiomatic, fully commented integration script wrapping the composition logic (15-40 lines), using only tools already declared in Starter Stack or Steps.
    ```[language]
    [Runnable code block]
    ```
*   **Implementation Notes**: Concrete guidelines, configuration defaults, or parameter weights (e.g., "RRF k parameter defaults to 60"), 2-4 sentences max.

### ## Common Failure Points
List 3-5 pipeline-level or integration-level failure modes that span multiple steps or occur only at serving/runtime, each stating the triggering condition (e.g., "latency degradation when K exceeds ~50 concurrent reranking candidates", "GPU out-of-memory under concurrent requests above the batch size the KV cache was sized for").

### ## Production Profile
Group production guidelines into the following subheadings (2-4 sentences max each):
*   **### Production Deployment**: Concrete steps for productionization (e.g., SQLRecordManager for incremental vector indexes, namespace isolation).
*   **### Scaling & Throughput**: Strategies when scaling queries or documents (e.g., migrating to sharded Qdrant/FAISS HNSW indexes, speculative decoding serving).
*   **### Cost & Efficiency**: Hardware costs, GPU vs. CPU tradeoffs, and cost optimization recommendations.
*   **### Latency & Performance**: End-to-end latency budget breakdowns (e.g., "50ms embedding, 100ms vector retrieval, 200ms rerank, 500ms generation").
*   **### Observability & Monitoring**: Metrics to track (e.g., query throughput, context size, token rates), tracing conventions, and logging setups.

### ## Evaluation Checklist
List 4-5 concrete, measurable success criteria to verify the pipeline's operational correctness (e.g., "Context Precision exceeds 0.85 on test harness", "Latency stays under 1.2s at p95").

### ## Sources
Bulleted list of URL citations used to ground the research, reconciled 1:1 with footnote markers used above (see §4). Include canonical research papers and official framework documentation links.

### ## Suggested Meta
Provide metadata suggestions to complete the AENS content record. All IDs and slugs suggested here are candidates for manual verification, not confirmed AENS entries (see §3).
*   **Tags**: `[comma-separated tags, e.g. rag, search]`
*   **Aliases**: `[comma-separated aliases, e.g. rag-pipeline]`
*   **Keywords**: `[comma-separated search keywords]`
*   **Search Tokens**: `[comma-separated alternate search terms/phrasings a practitioner might use]`
*   **Difficulty**: `[one of: beginner, intermediate, advanced, expert]`
*   **Domain**: `[e.g. llm, ml, dl, cv]`
*   **Engineering Area**: `[e.g. orchestration, retrieval, inference, training]`
*   **Estimated Reading Time**: `[integer, minutes]`
*   **Prerequisites**: `[comma-separated candidate IDs of workflows/models/packages a reader should already know]`
*   **Recommended Next**: `[comma-separated candidate IDs of what to learn after this workflow]`
*   **Next Links**: `[comma-separated candidate workflow IDs that form a natural pipeline sequence after this one, e.g. an evaluation-harness workflow]`
*   **Cross-Links**:
    - **related_models**: `[candidate model IDs]`
    - **related_packages**: `[candidate package IDs]`
    - **related_debug_guides**: `[candidate debug guide IDs]`
    - **related_patterns**: `[candidate pattern IDs]`

---

## Final Validation Checklist
Before outputting, verify that:
1.  The category matches exactly one of the 12 flat canonical categories.
2.  No JSON blocks are generated; output is exclusively semantic Markdown matching the headers above.
3.  Every `Decision` states a default, its rationale, and its deviation trigger — not just a default.
4.  Every named failure mode (per-step and pipeline-level) states a triggering condition, not just a symptom.
5.  No item from the §5 Hard Anti-Pattern Bans list is present anywhere in the output.
6.  All major claims have corresponding footnotes pointing to live resources, and every footnote/`## Sources` entry reconciles 1:1 with no orphans.
7.  Worked Example code blocks are clean, correctly language-tagged, represent composition/integration logic, and use only tools already declared in Starter Stack or Steps.
8.  Every AENS ID suggested (`Uses`, Cross-Links, Prerequisites, Recommended Next, Next Links) uses real-world common naming, not an invented AENS-specific slug, and is understood as a candidate requiring manual verification.
9.  Density constraints (§6) are respected — no field exceeds its stated sentence limit.
```

---

## 3. Change Log

| # | Change | Why it improves generation | Expected effect on Perplexity output |
|---|---|---|---|
| 1 | §1: removed duplicated "never write as a teacher/avoid hand-holding" phrasing, folded into one instruction; added explicit "playbook, not article" framing | Redundant instructions dilute emphasis rather than reinforcing it; a single clear framing image ("the doc they keep open while building") is more steerable than two overlapping bans | Slightly tighter voice consistency; no functional change in coverage |
| 2 | §2.1: "Defaults over Options" now explicitly requires a three-part answer (default / rationale / deviation trigger) instead of two parts | The brief's own stated goal ("why is this the default, when should I change it, what tradeoff exists") wasn't fully encoded in the instruction — a model could satisfy the old wording with just default+rationale | Every `Decision` field gains an explicit "change this when..." clause, which is the single highest-value addition for engineering-decision quality |
| 3 | §2.2: "Failure Envelopes" now requires a stated triggering condition per failure mode, with a concrete good/bad example pair | This was the single largest hallucination-resistance and specificity gap: "may lose context" vs. "silently truncates above 512 tokens" is the difference between decoration and a debugging aid | Failure Points and Common Failure Points become searchable, specific, and testable rather than generic warnings |
| 4 | §3: added explicit rule that AENS `Uses`/Cross-Link IDs are unverified candidates, with naming convention guidance (real common name, lowercase-kebab-case, no invented slugs) | Perplexity has no visibility into AENS's actual `data/` directory; without this instruction it silently fabricates plausible-looking IDs with no signal to the person converting content that verification is required | Removes a real hallucination-into-production risk; makes the manual-verification step (already required by the Workflow Design Report's cross-link strategy) explicit at generation time instead of being a downstream, easy-to-forget step |
| 5 | §3: "Verifiability" rewritten as a priority order (find source → omit → `[unverified]` as last resort) instead of a single flat instruction | The old wording let a model satisfy the letter of the rule by tagging everything `[unverified]` instead of doing the harder work of sourcing or cutting the claim | Fewer `[unverified]` tags overall; the ones that remain are genuinely load-bearing rather than a shortcut |
| 6 | §4: added explicit footnote/`## Sources` 1:1 reconciliation requirement | Two independently-specified citation mechanisms with no cross-check between them is a latent consistency bug that produces orphan footnotes in practice | Cleaner, fully-traceable sourcing; easier to spot-check during human review |
| 7 | New §5, "Hard Anti-Pattern Bans" — consolidated, explicit list (generic intros, motivational language, tutorials, excess theory, restated docs, API reference content, filler, obvious statements, unnecessary history) | The brief explicitly asked to "strengthen anti-patterns"; the old prompt scattered a subset of these across §1 with no single authoritative list a reviewer (or Perplexity) can check against | Directly reduces textbook-style drift, especially on well-documented topics like classification/regression pipelines where generic content is the path of least resistance |
| 8 | New §6, "Density Constraints" — explicit sentence caps on Worked Example `Description`, `Implementation Notes`, and each Production Profile subsection; explicit rule that worked-example code may only use already-declared tools | Two real density leaks existed: unbounded prose fields, and no constraint preventing a worked example from silently introducing a new dependency (which both bloats the resource and violates the "minimal starter stack" principle) | Shorter, denser Implementation Notes and Production Profile text; worked examples stay internally consistent with the declared stack |
| 9 | `## Suggested Meta` (output-format section): added `Search Tokens`, `Difficulty`, `Domain`, `Engineering Area`, `Estimated Reading Time`, `Prerequisites`, `Recommended Next`, `Next Links` as additional bullets under the *same, existing* header — no header added/removed/reordered | These are real `WorkflowSchema`/`BaseMetaSchema` fields explicitly listed as "Recommended (Should Collect)" for Workflow in `RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md`, but the v2.1 prompt never elicited them — leaving them to be invented off-prompt during JSON conversion, which is the exact inconsistency-across-workflows risk this upgrade exists to close | Every generated resource now arrives with a complete metadata set ready for JSON conversion, instead of requiring a second, unprompted research pass per workflow just to fill in classification/navigation fields |
| 10 | Final Validation Checklist: added checks for deviation-trigger presence (item 3), failure-mode triggering-condition presence (item 4), anti-pattern absence (item 5), citation reconciliation (item 6), code-dependency consistency (item 7), and candidate-ID framing (item 8) | The old checklist (6 items) didn't check for any of the new §2/§3/§5/§6 requirements, so a model could pass validation while still violating the strengthened instructions | Checklist now actually gates every substantive change made above, rather than only the original v2.1 requirements |

**Not changed, and why:** the `## Overview` / `## Starter Stack` / `## Steps` (core fields) / `## Common Failure Points` / `## Production Profile` (subheadings) / `## Evaluation Checklist` / `## Sources` headers, field names, and ordering are identical to v2.1 — all audited and found already correct, matching the frozen `WorkflowSchema` and the rendering fixes already live in `app/workflows/[id]/page.tsx`. Per Freeze Guardian principle, correct existing design is kept, not redesigned.
