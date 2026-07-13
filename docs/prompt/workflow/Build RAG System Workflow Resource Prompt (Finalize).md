# AENS Workflow Resource Prompt — Build RAG System (Finalized)

---

You are producing gold-standard engineering knowledge for a personal AI engineering reference system (AENS). This is NOT a tutorial or introductory documentation — do not restate basic definitions or explain what an embedding is. Assume the reader is a Senior ML Engineer and AI Systems Architect who needs production-grade, citation-rich decision-making knowledge.

Research and generate the workflow resource using the exact target specifications, architectural baseline, and instructions below.

## Target Workflow Specifications

*   **Target Workflow Name**: `Build RAG System`
*   **Workflow Category**: `rag`
*   **Starter Stack**: `pytorch`, `transformers`, `faiss-cpu`, `sentence-transformers`, `langchain`, `safetensors`, `chonkie`
*   **Core Pipeline Steps**:
    1. **Document Parsing and Metadata Extraction** (Tools: `PyPDFLoader`, `BeautifulSoup`, `LangChain`)
    2. **Document Segmentation and Chunking Strategy** (Tools: `RecursiveCharacterTextSplitter`, `Chonkie`)
    3. **Global Contextualized Embeddings via Late Chunking** (Tools: `sentence-transformers`, `Chonkie`, `pytorch`)
    4. **Vector Store Indexing and Hybrid Setup** (Tools: `FAISS`, `Qdrant`, `Milvus`, `Pinecone`)
    5. **Candidate Reranking with Cross-Encoders** (Tools: `sentence-transformers`, `transformers`)
    6. **Context Injection and Response Generation** (Tools: `transformers`, `vLLM`)
    7. **System Evaluation and Quality Checks** (Tools: `Ragas`, `TruLens`)
*   **Production Profiling Targets**: Sub-second latency budget (50-100ms embedding, 80-200ms vector search, 100-300ms reranking, 500ms-2s generation); parallel batch document ingestion; incremental indexing via `SQLRecordManager`; namespace isolation for multi-tenancy; serving engines (vLLM speculative decoding, dynamic batching, INT8/INT4 quantization).
*   **Worked Examples Focus**:
    - **Hybrid Search RAG with RRF**: Combining BM25 keyword matching with dense BERT vector embeddings using Reciprocal Rank Fusion (RRF).
    - **Late Chunking Implementation**: Applying unpooled token-level embeddings across an 8192-token context window using a model like Jina AI v3 / chonkie, then mean-pooling across boundaries to preserve cross-paragraph referential context.
*   **Canonical Evaluation Criteria**: `Context Precision`, `Context Recall`, `Faithfulness`, `Answer Relevance`.

### Canonical Reference Implementation

Treat this workflow as implementing the following baseline production stack unless there is a compelling engineering reason to deviate.

Framework:
- PyTorch
- Hugging Face Transformers
- sentence-transformers

Orchestration:
- LangChain (orchestration only; avoid using it as the primary abstraction layer)

Document Processing:
- Chonkie
- BeautifulSoup
- PyPDFLoader

Retrieval:
- FAISS as the reference vector index
- BM25 for sparse retrieval
- Reciprocal Rank Fusion (RRF)

Serving:
- vLLM

Evaluation:
- Ragas
- TruLens

Do not replace these with LlamaIndex, Haystack, DSPy, CrewAI, Semantic Kernel, or other frameworks unless the replacement is clearly justified as the default architectural choice.

### Canonical Pipeline Architecture

Assume this workflow implements the following canonical production pipeline.

Documents
→ Parsing
→ Cleaning
→ Metadata Extraction
→ Chunking
→ Embedding
→ Vector Index
→ Hybrid Retrieval
→ Reranking
→ Prompt Assembly
→ Generation
→ Evaluation

Do not reorder, remove, or introduce additional major pipeline stages unless they represent universally accepted production architecture.

---

## Instructions for Perplexity Content Generation

### 1. Role & Voice
You are a Principal AI Systems Architect and Senior ML Platform Engineer. Write as an experienced practitioner documenting production integration pipelines for other experienced engineers. The document should read like the internal playbook they keep open in a side window while building, not a chapter from a textbook.
*   **Never** write as a teacher or tutor (no "first, let's understand...", no motivational framing, no historical background on why the technology exists).
*   **Never** include placeholder text, TODOs, or TBD markers.
*   **Never** use marketing jargon, fluff, generic high-level statements, or restated official documentation.
*   **Engineering Voice**: Concise, dense, technically precise, actionable. Apply the "Engineer at 2 AM" test to every sentence: if it doesn't save hours of debugging or prevent a bad architectural decision, cut it entirely.

### 2. Objective & Trade-off Philosophy
The resource must answer: **"How do I wire this RAG pipeline end-to-end, what decisions must I make at each step, and what breaks at scale?"**

Every section should address:
1.  **Decision Matrix over Options**: Every step must include a Decision Matrix detailing:
    • **Default**: The concrete default recommendation.
    • **Alternative**: The primary alternative architectural choice.
    • **Trade-off**: The key trade-offs between the default and the alternative.
    • **Scale Trigger**: Under what workload or scale threshold the recommendation should change (the deviation trigger).
    • **Failure Prevented**: Which production failure this decision prevents.
    A decision matrix that only states an option without a default, or a default without a deviation/scale trigger, is incomplete.
2.  **Failure Envelopes**: Address integration-level failures (silent failures, latency deadlocks, context fragmentation) that only appear when components are composed together.
    *   For **step-level failures**, require five fields: (a) Failure, (b) Trigger, (c) Downstream Effect, (d) Detection, and (e) Recovery Strategy.
    *   For **pipeline-level Common Failure Points**, require a detailed seven-field analysis: (a) Origin, (b) Trigger, (c) Immediate Symptom, (d) Downstream Propagation, (e) Why debugging is difficult, (f) Recommended detection method, and (g) Recovery Strategy.
    *   Every failure trigger must name the triggering condition (a threshold, a scale point, a specific input shape) that causes it, not just the symptom. "May lose context on long documents" is not acceptable; "silently truncates above 512 tokens when the embedding model's context window is exceeded" is.
3.  **Composition over APIs**: Focus on the *wiring* and *glue* between models, patterns, and packages.
    *   **Avoid implementation trivia**: Do not explain APIs, do not explain method signatures, and do not describe library syntax.
    *   Describe component interactions, contracts, data flow, and architectural reasoning instead.
    *   If a sentence would be true and useful even without the surrounding pipeline, it belongs in a Package or Model resource, not here.
4.  **RAG Evaluation Harness Special Rule**: If the target workflow is evaluation-focused (e.g., `RAG Evaluation Harness`), you must include an explicit mandatory step for **Evaluation Dataset Versioning** (Tools: `datasets`, `pandas`, `git-lfs`). Reason: An evaluation harness without immutable benchmark versioning is not production-grade; this is a distinct concern from dataset construction and is fundamental to reproducible regression testing.

### 3. Precision & Anti-Hallucination Standards
*   **Search and Synthesize**: Actively use web search to inspect official documentation, research papers, and verified post-mortems of companies running these pipelines at scale.
*   **Confidence Wording**: Avoid vague hedge words ("usually", "often", "sometimes", "might", "could potentially", "in general"). State systemically verified constraints, not impressions.
*   **Source Preference & Hierarchy of Evidence**:
    Prefer sources in the following order:
    1. Peer-reviewed papers
    2. Official documentation
    3. Benchmark papers
    4. Conference proceedings
    5. University publications
    6. Engineering blogs **only when surfaced by the academic connector or when authored by framework creators and directly cited by primary sources.**
    Avoid Medium, personal blogs, and AI-generated summaries unless they reference primary sources.
*   **Pipeline Invariants**: Identify pipeline invariants whenever applicable. Examples include:
    • Query and document embeddings must share the same embedding space.
    • Chunk metadata must survive every pipeline stage.
    • Retrieval must preserve document provenance.
    • Reranking must preserve candidate ordering semantics.
    • Evaluation datasets must remain isolated from training data.
    Explain how violating an invariant propagates through later stages.
*   **Verifiability, in priority order**: (1) find a credible source, (2) if none exists, omit the claim entirely, (3) only if the claim is genuinely useful and no better alternative exists, mark it `[unverified]`. Do not use `[unverified]` as a substitute for doing the research — it is a last resort, not a convenience.
*   **AENS cross-reference IDs are candidates, not verified facts.** Every ID produced in a `Uses` field or in `Suggested Meta → Cross-Links` must:
    - use the tool/library/model's real, well-known common name in lowercase-kebab-case (e.g. `sentence-transformers`, `bert`, not an invented AENS-specific slug),
    - never be presented as confirmed to exist in AENS — these are candidates for the person to verify against `data/packages/`, `data/models/`, `data/cheatsheets/`, `data/patterns/`, and `data/debug-guides/` before being written into any `related_*` field.

### 4. Citation Expectations
Link engineering claims and performance statistics to source URLs using markdown footnotes (e.g., `[^1]`). Every major technical claim (e.g., latency bounds, token limits, memory growth, chunking heuristics) must have a footnote pointing to a live documentation page, paper, or production source. The `## Further Study` list and the footnotes must reconcile exactly: every footnote number must appear once in `## Further Study` (in the relevant category list), and every URL in `## Further Study` must be referenced by at least one footnote. No orphan citations, no unlisted sources.

### 5. Hard Anti-Pattern Bans
The following must never appear anywhere in the output:
*   Generic introductions ("In today's AI landscape...", "As AI systems become more complex...")
*   Motivational or evangelizing language about the technology
*   Beginner-tutorial explanations of concepts assumed known by the target reader (e.g., explaining what an embedding is)
*   Excessive theory disconnected from an implementation decision (theory is welcome only when it directly justifies a stated default)
*   Content that restates official documentation or Package/Model/Cheatsheet knowledge instead of the composition-level knowledge unique to this workflow
*   API reference material (parameter-by-parameter documentation)
*   Filler transitions, throat-clearing, or restating the section header in prose
*   Obvious statements that provide zero decision-making value ("Testing is important", "Monitoring helps catch issues")
*   Unnecessary history or background on why a technology was created

### 6. Density & Code Standards
*   **Density Limits**: Worked Example `Description`: 2-3 sentences max; `Implementation Notes` (per worked example) and each Production Profile subsection: 2-4 sentences max, written as dense technical statements, not paragraphs of explanation.
*   **Code Authenticity**: Code examples must never use dummy/placeholder comments or invented/idealized mock APIs (like `ragas.eval_retriever()` or `trulens.evaluate_model()`). They must conform strictly to the actual, official APIs of the libraries being used (e.g. using correct text splitters from Chonkie/LangChain, actual FAISS Index setup, correct SentenceTransformer/vLLM classes, and official Ragas metrics).
*   **Step Snippets**: Every single step under `## Steps` must contain a concrete, 5–12 line Python code snippet under `Minimal Integration Example` illustrating that step's real library/tool contract (never use prose descriptions or high-level lists as placeholders).
*   **Tools Alignment**: Code examples should showcase the actual libraries/tools declared in the step's `Tools` section. Do not simplify the code to standard `pandas` calls when complex libraries like `faiss-cpu`, `sentence-transformers`, `ragas`, or `trulens` are being documented.

---

## Markdown Output Format & Schema Requirements

Generate the resource using the exact headers below. Do not output JSON. Focus purely on generating high-density semantic markdown content.

### # Build RAG System

### ## Overview
Provide a 2-4 sentence, high-density overview explaining what pipeline this workflow constructs, the primary output artifact it produces (e.g., a queryable index, a trained model), and why the integration is complex.

### ## Starter Stack
Provide a clean bulleted list of canonical libraries and modules required to implement the baseline pipeline (e.g., `sentence-transformers`, `faiss-cpu`, `chonkie`). No nice-to-haves.

### ## Steps
For each step, after "Failure Points", include:

**Production Metrics**:
• Primary Metric
• Expected Range
• Alert Threshold

**Minimal Integration Example**:
• 5–12 lines
• Demonstrate only the interface contract implemented by this step
• Not a complete runnable script
• No project scaffolding
• No installation code
• Use only libraries declared in Starter Stack or this Step

---

Specify the sequential steps (minimum 3, maximum 8) to construct the pipeline. For each step:

#### ### Step N: [Step Name]
*   **What**: A technical description of the exact operation performed (1-2 sentences).
    *   **Input Interface Contract**:
        • **Artifact**: `[The input artifact name]`
        • **Type**: `[The data type or shape]`
        • **Ownership**: `[The component or module that owns this input]`
        • **Persistence**: `[The persistence guarantees: ephemeral, in-memory, disk-backed, etc.]`
        • **Consumer**: `[Which pipeline step or component consumes this]`
    *   **Output Interface Contract**:
        • **Artifact**: `[The output artifact name]`
        • **Type**: `[The data type or shape]`
        • **Ownership**: `[The component or module that owns this output]`
        • **Persistence**: `[The persistence guarantees: ephemeral, in-memory, disk-backed, etc.]`
        • **Consumer**: `[Which pipeline step or component consumes this]`
    *   **Required Metadata**: `[Metadata required or propagated at this stage]`
    *   **Pipeline Contract**: `[Core architectural contract enforced by this step]`
*   **Tools**: Specific classes, methods, or CLI tools used (e.g., `RecursiveCharacterTextSplitter`, `sentence-transformers`).
*   **Decision Matrix**: The key engineering decision at this step. Detail:
    • **Default**: The default architectural choice.
    • **Alternative**: The primary alternative architectural choice.
    • **Trade-off**: The key trade-offs between the default and the alternative.
    • **Scale Trigger**: Under what workload or scale threshold the recommendation should change (the deviation trigger).
    • **Failure Prevented**: Which production failure this decision prevents.
*   **Uses**: Structured cross-references to AENS entities, as candidate IDs for later verification. Format:
    - **packages**: `[comma-separated list of candidate AENS package IDs, e.g. pandas, pytorch]`
    - **models**: `[comma-separated list of candidate AENS model IDs, e.g. bert]`
    - **cheatsheets**: `[comma-separated list of candidate AENS cheatsheet IDs, e.g. pytorch]`
*   **Failure Points**: A bulleted list of 2-3 specific, named failure modes at this step. For every failure, describe:
    • **Failure**: Description of the failure mode
    • **Trigger**: Circumstance, threshold, or input condition that fires the failure
    • **Downstream Effect**: How this error propagates through later pipeline stages
    • **Detection**: How to monitor or catch this error in logs, metrics, or validation checks
    • **Recovery Strategy**: How the system should automatically recover or the operator should mitigate the failure
*   **Production Metrics**:
    • **Primary Metric**: `[Name of primary metric, e.g., Embedding latency]`
    • **Expected Range**: `[Expected range, e.g., 40–80 ms]`
    • **Alert Threshold**: `[Threshold for alerts, e.g., >150 ms]`
*   **Minimal Integration Example**:
    Provide a concise (5–12 lines) production-oriented code snippet illustrating only the interface contract implemented by this stage.
    Requirements:
    • Demonstrate the composition boundary of the step.
    • Do not include project scaffolding, CLI code, installation, or environment setup.
    • Do not explain APIs.
    • Use only libraries declared in Starter Stack or this Step.
    • Keep the snippet focused on data flow between adjacent pipeline stages.
    Example:
    ```python
    docs = PyPDFLoader(path).load()
    chunks = splitter.split_documents(docs)
    return chunks
    ```

### ## Worked Examples
Provide 2-3 worked examples illustrating non-obvious integration points that only make sense in the context of the full pipeline. For each example, ensure they cover:
- One standard production integration (happy path).
- One advanced scalable production deployment or evaluation/regression workflow.
- One debugging, failure recovery, or complex multi-component workflow.

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
List 3-5 pipeline-level or integration-level failure modes that span multiple steps or occur only at serving/runtime. For every failure, describe:
• **Origin**: Where the failure begins
• **Trigger**: Circumstance that fires the failure
• **Immediate symptom**: The direct, visible error state
• **Downstream propagation**: How this propagates through later stages
• **Why debugging is difficult**: Obstacles to identifying the root cause
• **Recommended detection method**: How to monitor or catch this error
• **Recovery Strategy**: Actionable recovery steps or mitigation path for production

### ## Production Profile
Group production guidelines into the following subheadings. Every recommendation should include: **Benefit**, **Trade-off**, **When not to use it**, and **Operational impact** (2-4 sentences max each):
*   **### Production Deployment**: Concrete steps for productionization (e.g., SQLRecordManager for incremental vector indexes, namespace isolation).
*   **### Scaling & Throughput**: Strategies when scaling queries or documents (e.g., migrating to sharded Qdrant/FAISS HNSW indexes, speculative decoding serving).
*   **### Cost & Efficiency**: Hardware costs, GPU vs. CPU tradeoffs, and cost optimization recommendations.
*   **### Latency & Performance**: End-to-end latency budget breakdowns (e.g., "50ms embedding, 100ms vector retrieval, 200ms rerank, 500ms generation").
*   **### Observability & Monitoring**: Metrics to track (e.g., query throughput, context size, token rates), tracing conventions, and logging setups.

### ## Evaluation Checklist
List 4-5 concrete, measurable success criteria to verify the pipeline's operational correctness. Cover these four categories:
• **Offline quality metrics** (e.g. Context Precision)
• **Online serving metrics** (e.g. latency bounds)
• **Operational health metrics** (e.g. OOM prevention)
• **Regression detection metrics** (e.g. golden datasets testing)

### ## Further Study
Provide a bulleted list of high-quality verified URLs for further research, reconciled 1:1 with footnote markers used above (see §4). Organize the bullet points under these categories:
*   **### Official Documentation**: [List of URLs, one per bullet]
*   **### Research Papers**: [List of URLs, one per bullet]
*   **### Engineering Blogs**: [List of URLs, one per bullet]
*   **### University Courses**: [List of URLs, one per bullet]
*   **### Videos**: [List of URLs, one per bullet]

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
*   **Next Links**: `[comma-separated candidate workflow IDs that form a natural pipeline sequence after this one]`
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
3.  Every step contains a **Decision Matrix** stating a Default, Alternative, Trade-off, Scale Trigger, and Failure Prevented.
4.  Every per-step failure mode is fully analyzed across: Failure, Trigger, Downstream Effect, Detection, and Recovery Strategy. Every pipeline-level common failure point is fully analyzed across: Origin, Trigger, Immediate symptom, Downstream propagation, Debugging difficulty, Detection method, and Recovery Strategy.
5.  No item from the §5 Hard Anti-Pattern Bans list is present anywhere in the output.
6.  All major claims have corresponding footnotes pointing to live resources, and every footnote/`## Further Study` entry reconciles 1:1 with no orphans.
7.  Each step under `## Steps` is enriched with Interface Contracts for both Input and Output (Artifact, Type, Ownership, Persistence, Consumer) written inside the description block, along with Required Metadata and Pipeline Contract.
8.  All code snippets (both minimal integration examples and worked examples) are authentic, use correct and valid library APIs (no fake placeholder wrapper functions or mock calls), and contain actual code instead of placeholder comments or prose.
9.  Every AENS ID suggested (`Uses`, Cross-Links, Prerequisites, Recommended Next, Next Links) uses real-world common naming, not an invented AENS-specific slug, and is understood as a candidate requiring manual verification.
10. Density constraints (§6) are respected — no field exceeds its stated sentence limit.
11. Each step contains **Production Metrics** (Primary Metric, Expected Range, Alert Threshold) and a **Minimal Integration Example** (5–12 lines) illustrating only the interface contract.
