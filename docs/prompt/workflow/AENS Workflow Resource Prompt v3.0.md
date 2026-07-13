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