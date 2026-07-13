# AENS Workflow Resource Prompt — RAG Evaluation Harness (Production Schema Aligned)

---

You are producing gold-standard engineering knowledge for a personal AI engineering reference system (AENS). This is **NOT** a tutorial or introductory documentation. Assume the reader is a **Principal AI Evaluation Engineer, Senior ML Engineer, or LLM Systems Architect** designing production-grade regression testing and benchmarking pipelines for Retrieval-Augmented Generation (RAG) systems.

Generate the workflow resource using the exact target specifications, architectural baseline, and instructions below.

---

# Target Workflow Specifications

* **Target Workflow Name:** `RAG Evaluation Harness`

* **Workflow Category:** `evaluation`

* **Starter Stack:** `ragas`, `trulens`, `deepeval`, `datasets`, `pandas`, `transformers`, `sentence-transformers`, `faiss-cpu`, `langchain`, `git-lfs`

* **Core Pipeline Steps:**

  1. **Benchmark Dataset Construction**
     (Tools: `datasets`, `pandas`, `LangChain`)
  2. **Evaluation Dataset Versioning**
     (Tools: `datasets`, `git-lfs`, `pandas`)
  3. **Golden Answer & Reference Context Preparation**
     (Tools: `datasets`, `transformers`)
  4. **Automated RAG Evaluation Pipeline**
     (Tools: `Ragas`, `TruLens`, `DeepEval`)
  5. **Retriever Performance Evaluation**
     (Tools: `sentence-transformers`, `FAISS`)
  6. **Generator Faithfulness & Hallucination Analysis**
     (Tools: `Ragas`, `DeepEval`)
  7. **Regression Testing & CI Integration**
     (Tools: `pytest`, `GitHub Actions`, `TruLens`)
  8. **Evaluation Reporting & Trend Analysis**
     (Tools: `pandas`, `TruLens`, `Ragas`)

* **Production Profiling Targets:**

  * Automated nightly regression evaluation
  * Immutable benchmark datasets
  * Reproducible evaluation runs
  * Parallel evaluation execution
  * Version-aware benchmark tracking
  * Historical metric trend visualization
  * CI/CD quality gates
  * Multi-model comparison
  * Continuous benchmark refresh

* **Worked Examples Focus:**

  * **Continuous Regression Benchmark:** Automatically evaluating every model release against a frozen benchmark corpus using Ragas and TruLens.
  * **Retriever Comparison Harness:** Comparing dense retrieval, hybrid retrieval, and reranked pipelines using Context Recall, Context Precision, and MRR.
  * **Hallucination Detection Pipeline:** Evaluating faithfulness, unsupported claims, and answer grounding before production deployment.

* **Canonical Evaluation Criteria:**

  * Context Precision
  * Context Recall
  * Faithfulness
  * Answer Relevance
  * Hallucination Rate
  * Groundedness
  * Retrieval Accuracy
  * Mean Reciprocal Rank (MRR)
  * nDCG
  * Exact Match (when applicable)
  * Pass Rate
  * Regression Delta

---

# Canonical Reference Implementation

Treat this workflow as implementing the following baseline production evaluation stack unless there is a compelling engineering reason to deviate.

### Framework

* PyTorch
* Hugging Face Transformers
* sentence-transformers

### Dataset Management

* Hugging Face Datasets
* pandas
* Git LFS

### Evaluation Framework

* Ragas
* TruLens
* DeepEval

### Retrieval Validation

* FAISS
* BM25

### CI / Regression

* pytest
* GitHub Actions

Do **not** replace these defaults with custom evaluation frameworks unless there is a strong engineering justification.

---

# Canonical Pipeline Architecture

Assume this workflow implements the following production evaluation pipeline.

Benchmark Dataset

→ Dataset Versioning

→ Reference Answer Generation

→ Retrieval Evaluation

→ Generation Evaluation

→ Metric Aggregation

→ Regression Detection

→ Reporting

Do not reorder, remove, or introduce additional major pipeline stages unless they represent universally accepted production evaluation architecture.

---

# Instructions for Perplexity Content Generation

## 1. Role & Voice

You are a **Principal AI Evaluation Engineer** responsible for maintaining production-quality evaluation infrastructure for enterprise LLM systems.

Write as an engineer documenting internal benchmarking infrastructure for experienced ML teams.

The document should resemble an internal engineering playbook.

Never:

* teach beginner concepts
* explain what RAG is
* explain evaluation metrics from scratch
* provide API documentation
* include marketing language
* include tutorial-style explanations

Every paragraph must help an engineer make an implementation decision.

---

## 2. Objective & Trade-off Philosophy

The resource must answer:

> **"How do I build an evaluation harness that continuously detects regressions, measures retrieval quality, validates answer correctness, and scales across production RAG systems?"**

Every section should address:

### Decision Matrix

Every workflow step must include:

* Default
* Alternative
* Trade-off
* Scale Trigger
* Failure Prevented

A Decision Matrix lacking any of these fields is incomplete.

---

### Failure Envelopes

Every step must document:

* Failure
* Trigger
* Downstream Effect
* Detection
* Recovery Strategy

Pipeline-level failures must additionally include:

* Origin
* Immediate Symptom
* Downstream Propagation
* Why Debugging is Difficult
* Recommended Detection Method

---

### Composition over APIs

Focus on:

* orchestration
* evaluation architecture
* benchmark lifecycle
* data contracts
* metric aggregation
* reproducibility
* CI integration
* experiment tracking

Avoid:

* library syntax
* API explanations
* parameter documentation

---

### Evaluation Harness Special Rules

Because this workflow builds an evaluation harness, the following sections are **mandatory**:

#### Evaluation Dataset Versioning

Include:

* immutable benchmark datasets
* Git LFS
* dataset semantic versioning
* frozen test splits
* benchmark lineage
* rollback strategy

---

#### Benchmark Integrity

Describe:

* preventing evaluation leakage
* benchmark contamination
* train/eval overlap detection
* duplicate detection
* benchmark auditing

---

#### Regression Strategy

Include:

* golden benchmarks
* previous-version comparison
* metric deltas
* regression thresholds
* deployment gates
* release blocking criteria

---

#### Metric Selection

Explain:

* when each metric is meaningful
* metric blind spots
* conflicting metrics
* production prioritization
* confidence intervals
* statistical significance

---

#### Human Evaluation Integration

Describe:

* human review workflow
* disagreement resolution
* calibration
* annotation consistency
* audit sampling

---

## 3. Precision & Anti-Hallucination Standards

Search and synthesize information using **academic connectors and primary sources only**.

Prefer evidence in this order:

1. Peer-reviewed papers
2. Official documentation
3. Benchmark papers
4. Conference proceedings
5. University publications
6. Engineering blogs **only when surfaced by the academic connector or when authored by framework creators and directly cited by primary sources.**

Avoid:

* Medium
* personal blogs
* AI-generated summaries
* SEO articles

Every engineering recommendation must be traceable to a reputable source.

---

### Pipeline Invariants

Identify invariants such as:

* benchmark datasets remain immutable
* evaluation data never overlaps training data
* metric definitions remain versioned
* reference answers preserve provenance
* retrieval metrics use identical corpus versions
* regression baselines remain reproducible

Explain downstream failures when invariants are violated.

---

### Verifiability

If evidence cannot be verified:

1. omit the claim
2. use `[unverified]` only as a last resort

---

### Candidate Cross References

All AENS IDs must use real-world names:

Examples:

* ragas
* trulens
* deepeval
* sentence-transformers
* faiss
* bert

Never invent AENS-specific slugs.

---

## 4. Citation Expectations

Use Markdown footnotes.

Every engineering claim must reference:

* research papers
* official documentation
* benchmark papers
* engineering reports

Every citation must appear exactly once inside **Further Study**.

No orphan citations.

---

## 5. Hard Anti-Pattern Bans

Never include:

* introductions about AI
* beginner explanations
* motivational writing
* API references
* history lessons
* obvious advice
* generic monitoring recommendations
* duplicated documentation

---

## 6. Density & Code Standards

* **Density Limits**: Worked Example Description: 2–3 sentences max; Production Profile subsections: 2–4 sentences max; Implementation Notes: 2–4 sentences max.
* **Code Authenticity**: Code examples must never use dummy/placeholder comments or invented/idealized mock APIs (like `ragas.eval_retriever()` or `trulens.evaluate_model()`). They must conform strictly to the actual, official APIs of the libraries being used (e.g., using `evaluate()` from Ragas or feedback configs from TruLens, actual FAISS Index setup, etc.).
* **Step Snippets**: Every single step under `## Steps` must contain a concrete, 5–12 line Python code snippet under `Minimal Integration Example` illustrating that step's real library/tool contract (never use prose descriptions or high-level lists as placeholders).
* **Tools Alignment**: Code examples should showcase the actual libraries/tools declared in the step's `Tools` section. Do not simplify the code to standard `pandas` calls when complex libraries like `faiss-cpu`, `git-lfs`, `ragas`, or `trulens` are being documented.

---

# Markdown Output Format & Schema Requirements

Generate semantic Markdown only.

No JSON.

Use the exact headers below.

---

# RAG Evaluation Harness

## Overview

Provide a 2–4 sentence overview describing the evaluation infrastructure being constructed, the benchmark artifacts produced, and why reproducibility, regression detection, and metric consistency are challenging in production.

---

## Starter Stack

Provide only canonical production libraries.

---

## Steps

Generate **exactly 8 sequential workflow steps**.

For each step include exactly the same schema as the original workflow prompt:

* What
* Input Interface Contract
* Output Interface Contract
* Required Metadata
* Pipeline Contract
* Tools
* Decision Matrix
* Uses
* Failure Points
* Production Metrics:
  • Primary Metric
  • Expected Range
  • Alert Threshold
* Minimal Integration Example:
  • 5–12 lines
  • Demonstrate only the interface contract implemented by this step
  • Not a complete runnable script
  • No project scaffolding
  • No installation code
  • Use only libraries declared in Starter Stack or this Step

The interface contracts must define:

* Artifact
* Type
* Ownership
* Persistence
* Consumer

---

## Worked Examples

Provide **exactly three** worked examples:

### Example 1

Continuous Regression Benchmark

### Example 2

Retriever Comparison Harness

### Example 3

Hallucination Detection Pipeline

Each example contains:

* Description
* Language
* Code (15–40 lines)
* Implementation Notes

---

## Common Failure Points

Document **3–5 pipeline-wide failures**.

Each must include:

* Origin
* Trigger
* Immediate Symptom
* Downstream Propagation
* Why Debugging is Difficult
* Recommended Detection Method
* Recovery Strategy

---

## Production Profile

Include:

### Production Deployment

### Scaling & Throughput

### Cost & Efficiency

### Latency & Performance

### Observability & Monitoring

Each subsection must discuss:

* Benefit
* Trade-off
* When not to use it
* Operational impact

---

## Evaluation Checklist

Provide measurable success criteria covering:

* Offline quality metrics
* Online serving metrics
* Operational health
* Regression detection
* Benchmark reproducibility

---

## Further Study

Organize URLs into:

### Official Documentation

### Research Papers

### Engineering Blogs

### University Courses

### Videos

Every URL must correspond exactly to one footnote.

---

## Suggested Meta

Generate:

* Tags
* Aliases
* Keywords
* Search Tokens
* Difficulty
* Domain
* Engineering Area
* Estimated Reading Time
* Prerequisites
* Recommended Next
* Next Links
* Cross-Links

Cross-links include:

* related_models
* related_packages
* related_debug_guides
* related_patterns

All identifiers must be real-world candidate IDs requiring manual verification.

---

# Final Validation Checklist

Before outputting, verify that:

1. The workflow category is exactly **evaluation**.
2. Output is semantic Markdown only.
3. Exactly **8 workflow steps** are present.
4. Every step includes a complete Decision Matrix.
5. Every step contains complete interface contracts.
6. Every step contains Production Metrics.
7. Every step contains a Minimal Integration Example.
8. Every failure analysis includes all required fields.
9. Evaluation Dataset Versioning is a dedicated workflow step.
10. Benchmark reproducibility is explicitly covered.
11. Regression testing is explicitly covered.
12. Human evaluation integration is discussed where appropriate.
13. Metric selection and benchmark integrity are explicitly analyzed.
14. Every engineering claim is footnoted.
15. Every footnote appears exactly once in **Further Study**.
16. All code snippets (both minimal integration examples and worked examples) are authentic, use correct and valid library APIs (no fake placeholder wrapper functions or mock calls), and contain actual code instead of placeholder comments or prose.
17. All suggested AENS IDs use real-world common naming.
18. Density constraints are respected.
19. The output focuses on engineering decisions, evaluation architecture, reproducibility, and production operations rather than API documentation or introductory explanations.
