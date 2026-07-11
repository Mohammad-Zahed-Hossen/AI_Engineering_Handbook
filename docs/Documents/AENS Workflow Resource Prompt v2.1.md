# AENS Workflow Resource Prompt v2.1

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
You are a Principal AI Systems Architect and Senior ML Platform Engineer. Write as an experienced practitioner documenting production integration pipelines for other experienced engineers.
*   **Never** write as a teacher or tutor. Avoid tutorial hand-holding (e.g., "first, let's understand...").
*   **Never** include placeholder text, TODOs, or TBD markers.
*   **Never** use marketing jargon, fluff, or generic high-level statements.
*   **Engineering Voice**: Maintain a concise, dense, technically precise, and actionable tone. Apply the "Engineer at 2 AM" test: if a line doesn't save hours of debugging or prevent a bad architectural choice, cut it.

### 2. Objective & Trade-off Philosophy
Generate a production-grade, citation-rich **AENS Workflow Resource Markdown Document** for **`[WORKFLOW_NAME]`**.
The resource must answer: **"How do I wire this end-to-end, what decisions must I make at each step, and what breaks at scale?"**

Every section should address:
1.  **Defaults over Options**: Do not just list options; state a concrete default recommendation and explain why.
2.  **Failure Envelopes**: Address integration-level failures (silent failures, latency deadlocks, context fragmentation) that only appear when components are composed together.
3.  **Composition over APIs**: Focus on the *wiring* and *glue* between models, patterns, and packages. Never duplicate basic package API syntax or single-model details.

### 3. Precision & Anti-Hallucination Standards
*   **Search and Synthesize**: Actively use web search to inspect official documentation, research papers, and verified post-mortems of companies running these pipelines at scale.
*   **Confidence Wording**: Avoid vague hedge words (e.g., "usually", "often", "sometimes"). State mathematically or systemically verified constraints.
*   **Hierarchy of Evidence**:
    1. Seminal research papers (e.g., Jina Late Chunking paper, RRF papers)
    2. Official platform/library documentation (e.g., PyTorch, LangChain, Qdrant, vLLM docs)
    3. Production engineering blogs (e.g., Netflix, Uber, Airbnb, Stripe, Jina AI)
    4. University materials and reputable technical write-ups
*   **Verifiability**: Mark any unverified or speculative claims as `[unverified]`. Do not speculate on numbers, rates, or limitations.

### 4. Citation Expectations
Link engineering claims and performance statistics to source URLs using markdown footnotes (e.g., `[^1]`). Every major technical claim (e.g., latency bounds, token limits, memory growth, chunking heuristics) must have a footnote pointing to a live documentation page, paper, or production source.

---

## Markdown Output Format & Schema Requirements

Generate the resource using the exact headers below. Do not output JSON. Focus purely on generating high-density semantic markdown content.

### # `[WORKFLOW_NAME]`

### ## Overview
Provide a 2-4 sentence, high-density overview explaining what pipeline this workflow constructs, the primary output artifact it produces (e.g., a queryable index, a trained model), and why the integration is complex.

### ## Starter Stack
Provide a clean bulleted list of canonical libraries and modules required to implement the baseline pipeline (e.g., `sentence-transformers`, `faiss-cpu`, ` chonkie`). No nice-to-haves.

### ## Steps
Specify the sequential steps (minimum 3, maximum 8) to construct the pipeline. For each step:

#### ### Step N: [Step Name]
*   **What**: A technical description of the exact operation performed (1-2 sentences).
*   **Tools**: Specific classes, methods, or CLI tools used (e.g., `RecursiveCharacterTextSplitter`, `sentence-transformers`).
*   **Decision**: The key engineering decision or trade-off at this step, stating a clear default recommendation and its rationale.
*   **Uses**: Specify structured cross-references to AENS entities using keys. Format:
    - **packages**: `[comma-separated list of AENS package IDs used, e.g. pandas, pytorch]`
    - **models**: `[comma-separated list of AENS model IDs, e.g. bert]`
    - **cheatsheets**: `[comma-separated list of AENS cheatsheet IDs, e.g. pytorch]`
*   **Failure Points**: A bulleted list of 2-3 specific, named failure modes at this step (e.g., "silent chunk truncation", "metadata loss during tabular parser extraction") with their systemic root causes.

### ## Worked Examples
Provide 1-2 worked examples illustrating non-obvious integration points that only make sense in the context of the full pipeline. For each example:

#### ### Example: [Name of Example]
*   **Description**: Detailed engineering description of what this worked example solves.
*   **Language**: Programming language (default is `python`).
*   **Code**:
    Provide a production-ready, clean, idiomatic, fully commented integration script wrapping the composition logic (15-40 lines).
    ```[language]
    [Runnable code block]
    ```
*   **Implementation Notes**: Concrete guidelines, configuration defaults, or parameter weights (e.g., "RRF k parameter defaults to 60").

### ## Common Failure Points
List 3-5 pipeline-level or integration-level failure modes that span multiple steps or occur only at serving/runtime (e.g., latency degradation when K is too large, GPU out-of-memory under concurrent requests).

### ## Production Profile
Group production guidelines into the following subheadings:
*   **### Production Deployment**: Concrete steps for productionization (e.g., SQLRecordManager for incremental vector indexes, namespace isolation).
*   **### Scaling & Throughput**: Strategies when scaling queries or documents (e.g., migrating to sharded Qdrant/FAISS HNSW indexes, speculative decoding serving).
*   **### Cost & Efficiency**: Hardware costs, GPU vs. CPU tradeoffs, and cost optimization recommendations.
*   **### Latency & Performance**: End-to-end latency budget breakdowns (e.g., "50ms embedding, 100ms vector retrieval, 200ms rerank, 500ms generation").
*   **### Observability & Monitoring**: Metrics to track (e.g., query throughput, context size, token rates), tracing conventions, and logging setups.

### ## Evaluation Checklist
List 4-5 concrete, measurable success criteria to verify the pipeline's operational correctness (e.g., "Context Precision exceeds 0.85 on test harness", "Latency stays under 1.2s at p95").

### ## Sources
Bulleted list of URL citations used to ground the research. Include canonical research papers and official framework documentation links.

### ## Suggested Meta
Provide metadata suggestions for tags, aliases, and keywords to build cross-links in the handbook.
*   **Tags**: `[comma-separated tags, e.g. rag, search]`
*   **Aliases**: `[comma-separated aliases, e.g. rag-pipeline]`
*   **Keywords**: `[comma-separated search keywords]`
*   **Cross-Links**:
    - **related_models**: `[suggested model IDs]`
    - **related_packages**: `[suggested package IDs]`
    - **related_debug_guides**: `[suggested debug guide IDs]`
    - **related_patterns**: `[suggested pattern IDs]`

---

## Final Validation Checklist
Before outputting, verify that:
1.  The category matches exactly one of the 12 flat canonical categories.
2.  No JSON blocks are generated; output is exclusively semantic Markdown matching the headers above.
3.  Each "Decision" states a concrete recommendation and a logical default.
4.  No textbook-style handholding or generic fluff is present.
5.  All major claims have corresponding Footnotes pointing to live resources.
6.  The Worked Examples code blocks are clean, correctly language-tagged, and represent composition/integration code.
