---

# AENS Knowledge Layer Specification

## Version 1.2 (Post-Refactor Release)

> **Status:** Released v1.2  
> **Owner:** AENS  
> **Purpose:** Define the complete knowledge architecture of AENS.
>
> This document is the single source of truth for how knowledge is organized, owned, maintained, retrieved, and evolved within the AI Engineering Navigation System.

---

# 1. Vision

AENS is **not** a documentation website.

It is **not** another AI tutorial platform.

It is **not** a collection of notes.

AENS is a **Knowledge Operating System** designed to help AI Engineers think, build, debug, and ship AI systems more effectively.

Its goal is to reduce the time required to answer engineering questions by transforming scattered knowledge into a structured, interconnected, and maintainable knowledge graph.

The system is optimized for:

* Knowledge retrieval
* Engineering decision making
* Practical implementation
* Long-term maintainability
* Single-maintainer sustainability

Every architectural decision in this document supports these goals.

---

# 2. Core Design Goals

The knowledge layer must satisfy six primary objectives.

## Goal 1 — Single Source of Truth

Every piece of knowledge has exactly one owner.

No duplicated explanations.

No conflicting documentation.

Everything else references the owner.

---

## Goal 2 — Retrieval First

Engineers rarely read documentation from start to finish.

Instead, they search for answers to immediate problems.

The system must optimize for rapid knowledge retrieval rather than sequential reading.

---

## Goal 3 — Engineering Over Theory

AENS prioritizes engineering workflows over academic explanations.

Knowledge should answer:

* What should I build?
* How do I build it?
* Why is it failing?
* What should I choose?

instead of only explaining concepts.

---

## Goal 4 — Stable Architecture

The architecture should remain stable even as AI technologies evolve.

Packages change.

Models improve.

APIs evolve.

Engineering principles change slowly.

The architecture must separate stable knowledge from volatile knowledge.

---

## Goal 5 — Connected Knowledge

Every page is part of a knowledge graph.

No page should exist in isolation.

Each page should guide users toward the next relevant engineering decision.

---

## Goal 6 — Sustainable Maintenance

The system must remain maintainable by a single engineer over many years.

Maintenance effort should scale sub-linearly with content size.

---

# 3. Architectural Philosophy

AENS separates **knowledge ownership** from **knowledge discovery**.

These are fundamentally different concerns.

For this reason, AENS is built upon four independent but interconnected architectures:

1. Knowledge Ownership Architecture
2. Navigation Architecture
3. Knowledge Graph Architecture
4. Knowledge Lifecycle Architecture

Each architecture answers a different question and must remain independent.

---

# 4. Knowledge Ownership Architecture

The Knowledge Ownership Architecture defines where information permanently lives.

It does **not** define how users navigate.

Each content type has a unique responsibility and owns a specific category of knowledge.

```text
Problem Index
      │
      ▼
Workflow
      │
      ▼
Pattern
      │
      ▼
Model
      │
      ▼
Package
      │
      ▼
Cheatsheet
      │
      ▼
Debug Guide
      │
      ▼
Registry
      │
      ▼
Principle
```

This hierarchy represents ownership only.

It must never be interpreted as a navigation path.

### Ownership Responsibilities

| Content Type  | Owns                                    |
| ------------- | --------------------------------------- |
| Problem Index | Engineering problem categorization      |
| Workflow      | End-to-end implementation processes     |
| Pattern       | Tool-independent engineering concepts   |
| Model         | Algorithms and architectures            |
| Package       | Library implementation details          |
| Cheatsheet    | Quick syntax recall                     |
| Debug Guide   | Troubleshooting knowledge             |
| Registry      | Deployment metadata and external assets |
| Principle     | Fundamental why and theoretical foundations |

---

# 5. Navigation Architecture

Unlike ownership, navigation is intentionally non-linear.

Engineers may enter the system from any point depending on their immediate need.

Primary entry points include:

* Global Search
* Sidebar Navigation
* Problem Index
* Dashboard
* Recent Activity
* Favorites
* Collections
* Continue Reading
* Related Content
* Cross References

Navigation views never own knowledge.

They are dynamically generated from the underlying content graph.

---

# 6. Knowledge Graph Architecture

Every content object is represented as a node within a bidirectional knowledge graph.

Relationships between nodes enable contextual discovery, recommendations, and intelligent retrieval.

Example relationships:

* Workflow → uses Pattern
* Workflow → recommends Model
* Model → implemented by Package
* Package → summarized by Cheatsheet
* Debug Guide → related to Package
* Registry → references Model

Relationships are references, not ownership.

---

# 7. Knowledge Lifecycle Architecture

Knowledge evolves over time.

The lifecycle architecture defines how content changes throughout its existence.

Every knowledge object progresses through four stages:

1. Draft
2. Verified
3. Stable
4. Archived

Each object also records:

* Verification date
* Review frequency
* Superseded-by reference
* Version compatibility
* Stability level

Maintenance cadence is determined by stability:

| Stability   | Review Frequency |
| ----------- | ---------------- |
| Stable      | Annually         |
| Semi-Stable | Every 3–6 months |
| Volatile    | Monthly          |

---

# 8. Knowledge Metadata

Metadata enriches every content object without changing ownership.

Core metadata includes:

* Difficulty Level
* Estimated Reading Time
* Prerequisites
* Related Content
* Aliases
* Tags
* Canonical Status
* Confidence Level
* Engineering Maturity
* Content Coverage
* Version Information
* Last Verified Date

These attributes improve discovery, personalization, and maintenance while remaining independent of content semantics.

---

# AENS Knowledge Layer Specification

## Version 1.0 (Freeze Candidate)

**Part 2 — Knowledge Objects**

---

# 9. Design Philosophy of Knowledge Objects

AENS does **not** organize knowledge by folders.

It organizes knowledge by **responsibility**.

Each content type exists because it answers a unique engineering question.

If two content types answer the same question, the architecture has failed.

Therefore, before defining schemas, AENS defines ownership.

---

# Knowledge Ownership Map

| Question                                     | Owner          |
| -------------------------------------------- | -------------- |
| What am I trying to solve?                   | Problem Index  |
| How do I solve it end-to-end?                | Workflow       |
| What reusable engineering principle applies? | Pattern        |
| Which algorithm should I choose?             | Model          |
| How do I implement it with a library?        | Package        |
| What's the syntax again?                     | Cheatsheet     |
| Why is this failing?                         | Debug Guide    |
| Where can I deploy/download it?              | Registry       |
| Which option should I choose?                | Decision Guide |
| Why does this work fundamentally?            | Principle      |

No page may answer another page's primary question.

---

# 8. Principle

## Purpose

Principles are the most stable knowledge type in AENS.

They capture fundamental truths that survive decades of technological change.

Patterns tell **how**.

Principles tell **why**.

---

## Philosophy

This is missing from almost every AI knowledge system.

Engineers focus on implementations and patterns.

They rarely document the underlying principles.

Principles rarely change.

They survive decades.

---

## Principle Categories

### Learning Theory

* Scaling Law
* Information Bottleneck
* Bias Variance Trade-off
* No Free Lunch Theorem
* Universal Approximation

---

### Optimization

* Gradient Descent
* Convexity
* Local Minima
* Convergence Rates
* Regularization Principles

---

### Representation

* Attention Mechanism
* Locality
* Vector Similarity
* Embedding Geometry
* Manifold Hypothesis

---

### Systems

* Distributed Systems Principles
* Caching Principles
* Consistency Models
* CAP Theorem
* Scalability Principles

---

## Principle Owns

* Fundamental why
* Theoretical foundations
* Mathematical underpinnings
* Universal truths
* Long-term invariants

---

## Principle Never Owns

* Implementation details
* Library APIs
* Code examples
* Technology-specific patterns

Instead, Principles are referenced by Patterns, Models, and Workflows to explain the underlying reasoning.

---

# 9. Problem Index

## Purpose

The Problem Index is the primary **discovery layer** of AENS.

It exists solely to help engineers identify the problem they are trying to solve.

It does **not** own engineering knowledge.

It is a generated navigation structure.

---

## Characteristics

* No dedicated schema
* No versioning
* No validation
* No implementation details
* No code examples

Instead, it acts as a curated index.

Example

```
Natural Language Processing

    ├── Text Classification
    ├── Question Answering
    ├── NER
    ├── Translation
    └── Summarization
```

Selecting a problem immediately opens related workflows.

---

## Responsibilities

The Problem Index owns only:

* Problem categorization
* Taxonomy
* Entry points

Everything else is referenced.

---

## Non Responsibilities

Never contains:

* Package APIs
* Model explanations
* Tutorials
* Debugging
* Production notes

---

# 10. Workflow

## Purpose

Workflow is the most important content type in AENS.

It owns the complete engineering process.

It answers:

> "How do I build this?"

---

## Workflow Philosophy

Workflows describe engineering execution.

Not theory.

Not package documentation.

Not algorithm internals.

A workflow represents an executable sequence.

---

Example

```
Build RAG

↓

Collect Documents

↓

Chunk Documents

↓

Generate Embeddings

↓

Store Vector Database

↓

Retrieve

↓

Rerank

↓

Generate Response
```

---

## Workflow Owns

* Engineering pipeline
* Prerequisites
* Ordered execution
* Production notes
* Validation checkpoints
* Failure patterns
* Worked examples
* Scaling notes

---

## Workflow Never Owns

* Package APIs
* Model benchmarks
* Library installation
* Syntax references
* Troubleshooting databases

Instead, it links to them.

---

## Typical Workflow Categories

### Machine Learning

* Classification Pipeline
* Regression Pipeline
* Clustering Pipeline
* Recommendation Pipeline
* Time Series Pipeline

---

### Computer Vision

* Image Classification
* Object Detection
* Segmentation
* OCR
* Image Generation

---

### LLM

* Prompt Engineering
* RAG
* Agent
* Fine-tuning
* Evaluation

---

### MLOps

* Experiment Tracking
* CI/CD
* Model Serving
* Monitoring
* Deployment

---

# Worked Examples

Cookbooks are embedded within workflows.

Example

```
Workflow

Build RAG

↓

Worked Examples

• PDF RAG

• Multi PDF RAG

• Hybrid Search

• GraphRAG

• Multi-Agent RAG
```

No standalone Cookbook exists.

---

# 11. Pattern

## Purpose

Patterns capture reusable engineering knowledge.

Patterns survive technology changes.

Libraries evolve.

Patterns rarely do.

---

## Pattern answers

> "Which engineering principle applies here?"

---

## Pattern Characteristics

Tool agnostic

Implementation independent

Reusable

Stable

Concept focused

---

## Pattern Categories

### Data

* EDA
* Data Validation
* Data Cleaning
* Dataset Split
* Feature Engineering
* Feature Scaling
* Feature Selection

---

### Training

* Training Loop
* Validation Loop
* Checkpointing
* Resume Training
* Early Stopping
* Gradient Accumulation
* Mixed Precision

---

### Optimization

* Hyperparameter Search
* Cross Validation
* Learning Rate Scheduling
* Regularization
* Class Balancing
* Knowledge Distillation

---

### Inference

* Batch Inference
* Streaming Inference
* Online Inference
* KV Cache
* Speculative Decoding
* Prompt Caching

---

### Deployment

* Canary Deployment
* Shadow Deployment
* Blue Green Deployment
* Autoscaling
* Monitoring
* Rollback

---

## Pattern Never Owns

* Package APIs
* Code syntax
* Installation
* Library specific examples

Instead

```
Pattern

↓

Related Packages

↓

Related Workflows
```

---

# 12. Model

## Purpose

Model pages own algorithm knowledge.

They answer:

> "Which algorithm should I use?"

---

## Model Owns

* Architecture
* Strengths
* Weaknesses
* Benchmarks
* Evaluation
* Alternatives
* Computational requirements
* Research background
* Quick Start production-ready implementation snippet (canonical code example)
* Curated external learning resources (educational references)

---

## Model Never Owns

* Exhaustive package implementation or framework API documentation (beyond a single Quick Start snippet)
* Installation instructions
* Full production workflows

---

## Visual Presentation Standards

Model pages must conform to a premium developer experience visual layout:

1. **Header & Decision Strip**:
   - Model summary is displayed directly as prominent introduction prose without text clamping or collapse expanders.
   - The decision strip features four status badges: Difficulty, Stability, Confidence, and Maturity, decorated with Lucide icons (`Gauge`, `Activity`, `CheckCircle2`, `Shield`).
   - Badges are colored semantically (e.g. emerald/cyan for stable/easy, amber/rose for intermediate/complex).
   - Detailed `interpretability` explanations are extracted from status badges and rendered as a separate full-width explainability callout with an `Eye` icon below the strip.

2. **Unified Decision & Tradeoffs Board**:
   - "Use When", "Avoid When", "Strengths", and "Limitations" are unified into a cohesive 2x2 grid.
   - Specific icons and tints are applied to each quadrant (green checkmark for Use When, amber alert for Avoid When, blue chevron for Strengths, rose shield-alert for Limitations).
   - Parent elements must retain original IDs (`decision-guide` and `pros-cons`) to support sticky TOC scroll triggers.

3. **Core Understanding Spec-Sheet**:
   - Complexities, scalability, and structural assumptions are displayed as a structured 3-column specs sheet.
   - Uses distinct icons (`Clock` for time complexity, `Database` for memory, `TrendingUp` for scalability, `Activity` for training, etc.).
   - Formulas and formulations are styled in a clean, code-like monospace callout block.

4. **Grouped Engineering Considerations**:
   - Dense bullet lists are grouped into three distinct, structured sub-sections:
     - **Data & Preprocessing** (Feature scaling, class imbalance, datasets)
     - **Runtime & Scalability** (Parallelization, latency, training cost)
     - **Pipeline Fit & Robustness** (Outlier behavior, pipeline position)
   - "Common Limitations" is highlighted in a rose warning banner.

5. **Comparative Hyperparameter Guide**:
   - Features global **Expand All** and **Collapse All** button controls next to priority selectors.
   - Shows both the human-readable concept and the exact library API parameter key (e.g., `n_estimators`, `max_depth`) in monospace tags.
   - Side-by-side comparative layout (columns) for "Effect of Increasing" and "Effect of Decreasing" parameter behaviors, with custom green/red tinted panels.

6. **Alternative Comparison Cards**:
   - Model comparisons are styled as side-by-side cards with prominent "VS" badges.
   - Options specify explicit "Choose [Model] When", "Prefer [Alternative] When", and "Tradeoffs" segments.

---

## Categories

### Machine Learning

* Random Forest
* XGBoost
* LightGBM
* Logistic Regression
* SVM

---

### Vision

* CNN
* ResNet
* EfficientNet
* Vision Transformer
* YOLO

---

### NLP

* BERT
* RoBERTa
* T5
* BART
* DistilBERT

---

### Foundation Models

* GPT
* Llama
* Qwen
* Gemma
* DeepSeek

---

### Embedding

* BGE
* E5
* Voyage
* Jina
* Nomic

---

# Decision Strategy

Every model page includes

Use when

Avoid when

Alternatives

Trade-offs

Benchmark summary


---

# 13. Package

## Purpose

Package pages own implementation knowledge.

Question answered

> "How do I implement this using a specific library?"

---

## Package Owns

Installation

Common APIs

Examples

Common Tasks

Version Compatibility

Package-specific Debugging

Migration Notes

Breaking Changes

---

## Package Categories

### Data

NumPy

Pandas

Polars

PyArrow

SciPy

---

### Visualization

Matplotlib

Seaborn

Plotly

Altair

Bokeh

---

### ML

Scikit Learn

XGBoost

LightGBM

CatBoost

Optuna

---

### Deep Learning

PyTorch

Lightning

TensorFlow

Keras

timm

---

### Hugging Face

Transformers

Datasets

Accelerate

PEFT

TRL

---

### Serving

FastAPI

vLLM

BentoML

Ray Serve

Ollama

---

### Data Engineering

DuckDB

Spark

Dask

Airflow

Prefect

---

### Vector Databases

FAISS

Milvus

Qdrant

Weaviate

Chroma

---

## Package Never Owns

Algorithms

Engineering concepts

Workflows

Theory

Benchmarks

Deployment strategy

---

# Package Design Principle

Every package page should answer

> "If I open only this page while coding, can I finish today's task?"

If not,

the package page is incomplete.

---
# AENS Knowledge Layer Specification

## Version 1.0 (Freeze Candidate)

**Part 3 — Retrieval Layer, Knowledge Graph & Cross-System Rules**

---

# 14. Cheatsheet

## Purpose

The Cheatsheet is the **fastest retrieval layer** in AENS.

It exists for one reason:

> **Instant recall.**

A user should be able to find an API or syntax in less than five seconds.

---

## Question Answered

> "What's the syntax again?"

Nothing else.

---

## Philosophy

A cheatsheet is **not documentation**.

It is **not a tutorial**.

It is **not an explanation**.

It is memory augmentation.

---

## Characteristics

* Extremely lightweight
* Readable in seconds
* API-first
* Copy-paste friendly
* Linked back to the Package page

---

## Owns

* Syntax
* Short examples
* One-line descriptions
* Common argument patterns
* Quick command references

---

## Never Owns

* Explanations
* Best practices
* Engineering concepts
* Debugging
* Comparisons
* Production notes

---

## Categories

### Python

* List Comprehension
* Datetime
* Regex
* Collections
* AsyncIO

---

### NumPy

* Array Creation
* Reshaping
* Indexing
* Broadcasting
* Statistics

---

### Pandas

* Read CSV
* Filtering
* GroupBy
* Merge
* Pivot
* Missing Values

---

### PyTorch

* Tensor Creation
* Autograd
* Optimizer
* Loss Functions
* DataLoader
* Device Transfer

---

### Transformers

* Tokenizer
* Pipeline
* Trainer
* Generate
* PEFT

---

### FastAPI

* Routes
* Dependencies
* Middleware
* Response Models
* Streaming

---

### Docker

* Build
* Compose
* Volumes
* GPU
* Networking

---

### Linux

* grep
* find
* awk
* sed
* ssh
* rsync

---

# Cheatsheet Design Rules

Maximum 60 entries.

Maximum one-line explanation.

Always links back to Package.

---

# 15. Debug Guide

## Purpose

Debug Guide is one of the highest-value content types in AENS.

Engineers spend a significant portion of their time debugging rather than writing new code.

The Debug Guide captures troubleshooting knowledge in a structured and searchable format.

---

## Question Answered

> "Why isn't this working?"

---

## Philosophy

Debugging should begin with the symptom.

Not the technology.

Engineers usually search:

```
CUDA OOM

NaN Loss

Shape mismatch
```

not

```
PyTorch
```

Therefore debugging is symptom-first.

---

## Debug Page Structure

Every Debug page contains:

### Symptoms

Observable failures.

---

### Root Causes

Possible reasons.

Ordered by probability.

---

### Diagnosis

How to verify each cause.

---

### Solutions

Step-by-step fixes.

---

### Prevention

How to avoid it next time.

---

### Related Content

Related Packages

Related Workflows

Related Patterns

Related Models

Related Registry Assets

---

## Categories

### Training

* NaN Loss
* Overfitting
* Underfitting
* Gradient Explosion
* Gradient Vanishing
* Dead ReLU

---

### GPU

* CUDA OOM
* Device Mismatch
* NCCL Timeout
* CUDA Driver Error
* Mixed Precision Failure

---

### Data

* Shape Mismatch
* Data Leakage
* Wrong Labels
* Feature Leakage
* Missing Values
* Distribution Shift

---

### LLM

* Hallucination
* Prompt Injection
* Tokenizer Mismatch
* Context Overflow
* Tool Failure
* RAG Failure

---

### Python

* ImportError
* ModuleNotFoundError
* Circular Import
* Dependency Conflict
* Version Conflict

---

## Debug Design Rules

Every fix should be actionable.

Every cause should be verifiable.

Every page must reference related workflows.

---

# 16. Registry

## Purpose

Registry is **not** a learning layer.

It is a deployment catalog.

Registry answers:

> "Where can I obtain or deploy this asset?"

---

## Philosophy

Registry stores metadata only.

It never explains anything.

Knowledge belongs elsewhere.

---

## Owns

Deployment metadata

Hardware requirements

Download locations

Official resources

Licenses

Supported tasks

Version compatibility

---

## Registry Categories

### Models

Foundation models, embedding models, vision models, speech models.

---

### Datasets

Training datasets, evaluation datasets, benchmark datasets.

---

### Benchmarks

Evaluation benchmarks, leaderboards, performance metrics.

---

### Services

APIs, hosting platforms, inference services.

---

### Leaderboards

Model rankings, task-specific leaderboards.

---

### MCP Servers

Model Context Protocol servers and configurations.

---

### Repos

Code repositories, model repositories, data repositories.

---

## Registry Design Rules

No tutorials.

No implementation.

Only metadata.

---

# 17. Decision Guides

## Purpose

Decision Guides capture engineering trade-offs.

They help engineers choose between competing technologies.

---

## Question Answered

> "Which option should I choose?"

---

## Philosophy

Decision Guides are **special pages**.

They are not a core content type.

They are intentionally limited to high-value engineering decisions.

---

## Categories

### Models

Random Forest vs XGBoost

YOLO vs DETR

CNN vs Vision Transformer

BERT vs RoBERTa

GPT vs Llama

---

### Frameworks

PyTorch vs TensorFlow

LangChain vs LlamaIndex

FastAPI vs Flask

MLflow vs Weights & Biases

---

### LLM

RAG vs Fine-Tuning

LoRA vs QLoRA

Dense vs Sparse Retrieval

Single Agent vs Multi-Agent

---

### Infrastructure

FAISS vs Qdrant

vLLM vs Ollama

Docker vs Kubernetes

CPU vs GPU Inference

---

## Decision Guide Structure

Problem

Evaluation Criteria

Comparison Table

Recommendations

Use Cases

Related Workflows

Related Packages

Related Models

---

# 18. Cross-Link Architecture

Knowledge is valuable only when connected.

Every page participates in the graph.

---

## Automatic Links

Every page exposes:

* Related Problems
* Related Workflows
* Related Patterns
* Related Models
* Related Packages
* Related Cheatsheets
* Related Debug Guides
* Related Registry Entries
* Official Resources

---

## Contextual Links

Examples

Workflow

↓

Related Models

↓

Related Packages

↓

Related Debug Guides

↓

Worked Examples

---

Model

↓

Alternatives

↓

Benchmarks

↓

Packages

↓

Registry

---

Package

↓

Cheatsheet

↓

Debug Guide

↓

Official Docs

↓

Related Workflows

---

Debug Guide

↓

Common Causes

↓

Packages

↓

Workflows

↓

Patterns

↓

Registry

---

# 19. Knowledge Graph

Internally every page becomes a graph node.

Relationships are typed even if the UI displays them simply as "Related Content."

## Relationship Types

```text
uses

implements

requires

depends_on

alternative_to

extends

built_with

optimized_by

benchmarked_by

debugged_by

deployed_with

references

supersedes

related_to
```

---

## Why Typed Relationships?

Typed relationships enable:

* Better semantic search
* AI-powered recommendations
* Graph traversal
* Intelligent "next page" suggestions
* Future graph visualization
* Agentic reasoning over the knowledge base

Users may only see **Related Content**, but the underlying graph retains semantic meaning.

---

# 20. Canonical Ownership Rules

Every engineering concept has exactly **one canonical owner**.

Examples:

| Knowledge                          | Canonical Owner |
| ---------------------------------- | --------------- |
| End-to-end RAG implementation      | Workflow        |
| Early Stopping concept             | Pattern         |
| YOLO architecture                  | Model           |
| `ultralytics` API usage            | Package         |
| `model.train()` syntax             | Cheatsheet      |
| CUDA Out of Memory troubleshooting | Debug Guide     |
| YOLO model download metadata       | Registry        |

No duplication is allowed. Other pages summarize and link back to the canonical source.

---

## Canonical Rules

Every page must be one of

```
Canonical

Reference

Generated
```

---

### Canonical

Owns information.

---

### Reference

Summarizes.

Links.

---

### Generated

Created dynamically.

Examples

Dashboard

Collections

Recent

Favorites

Search Results

---

# 21. Retrieval Philosophy

AENS supports multiple retrieval modes:

1. **Problem-first:** "I need object detection."
2. **Workflow-first:** "How do I build a RAG system?"
3. **Tool-first:** "How do I use PyTorch?"
4. **Syntax-first:** "What's the `groupby()` syntax?"
5. **Debug-first:** "Why am I getting CUDA OOM?"
6. **Decision-first:** "Should I use LoRA or QLoRA?"
7. **Asset-first:** "Which embedding model should I deploy?"

All retrieval modes converge on the same underlying knowledge graph rather than duplicating content.

---

# AENS Knowledge Layer Specification

## Version 1.0 (Freeze Candidate)

**Part 4 — Governance, Lifecycle, Quality & Future Evolution**

---

# 22. Knowledge Lifecycle

## Purpose

Knowledge is not static.

Libraries evolve.

Models become obsolete.

Best practices change.

The Knowledge Lifecycle ensures that AENS evolves without accumulating outdated or conflicting information.

Every knowledge object follows the same lifecycle.

---

## Lifecycle States

```text
Draft
    │
    ▼
Verified
    │
    ▼
Stable
    │
    ▼
Deprecated
    │
    ▼
Archived
```

---

### Draft

Characteristics

* Recently created
* Not fully reviewed
* May contain placeholders
* Internal use only

Search Visibility

❌ Hidden from normal users

---

### Verified

Characteristics

* Reviewed
* Tested
* Sources verified
* Safe for publishing

---

### Stable

Characteristics

* Mature
* Trusted
* Well-tested
* Recommended

Most content should eventually reach this state.

---

### Deprecated

Characteristics

* Still useful
* Better alternatives exist
* No longer recommended

Example

```
TensorFlow Estimator
```

---

### Archived

Characteristics

Historical only.

Hidden from search by default.

Used for

* legacy projects
* historical references
* migration documentation

---

# 23. Stability Classification

Lifecycle and Stability are different concepts.

Lifecycle describes content maturity.

Stability describes how frequently knowledge changes.

---

## Stable

Examples

* Binary Search
* Cross Validation
* CNN
* Logistic Regression
* Early Stopping

Review

Every 12 months.

---

## Semi Stable

Examples

* PyTorch
* Hugging Face
* FastAPI
* LangChain

Review

Every 3–6 months.

---

## Volatile

Examples

* LLM APIs
* Foundation models
* Benchmarks
* Package versions
* Inference engines

Review

Monthly.

---

# 24. Knowledge Metadata

Every knowledge object contains standardized metadata.

Metadata never owns knowledge.

It enhances retrieval, personalization, maintenance, and governance.

---

## Identity

* ID
* Title
* Slug
* Description

---

## Discovery

* Tags
* Aliases
* Keywords
* Search Tokens

---

## Classification

* Domain
* Category
* Difficulty
* Engineering Area

---

## Learning

* Estimated Reading Time
* Prerequisites
* Recommended Next
* Related Content

---

## Maintenance

* Created At
* Updated At
* Last Verified
* Review Frequency

---

## Versioning

* Verified Against
* Compatible Versions
* Breaking Changes

---

## Governance

* Owner
* Canonical Status
* Lifecycle
* Stability
* Confidence

---

# 25. Confidence Levels

Not all engineering knowledge has equal certainty.

AENS exposes confidence explicitly.

---

## Verified

Industry standard.

Widely accepted.

Examples

```
Cross Validation

Batch Normalization

Adam Optimizer
```

---

## Production Proven

Successfully deployed.

Battle tested.

---

## Community Accepted

Large community agreement.

May lack formal benchmarks.

---

## Experimental

Rapidly evolving.

Research driven.

Examples

```
GraphRAG

Agent Swarms

Speculative Decoding
```

---

## Research

Paper-backed.

Limited production validation.

---

# 26. Engineering Maturity

Different from confidence.

Measures production readiness.

---

## Research

Mostly academic.

---

## Experimental

Early production.

---

## Emerging

Growing adoption.

---

## Production Ready

Recommended.

---

## Legacy

Still works.

Not recommended for new projects.

---

# 27. Canonical Knowledge Rules

Every engineering fact exists once.

Example

```
Early Stopping
```

Canonical Owner

```
Pattern
```

Workflow

References Pattern.

Package

References Pattern.

Debug Guide

References Pattern.

No duplication.

---

## Canonical Rules

Every page must be one of

```
Canonical

Reference

Generated
```

---

### Canonical

Owns information.

---

### Reference

Summarizes.

Links.

---

### Generated

Created dynamically.

Examples

Dashboard

Collections

Recent

Favorites

Search Results

---

# 28. Knowledge Quality Standards

Every page must satisfy minimum quality.

---

## Workflow

Required

✓ Pipeline

✓ Prerequisites

✓ Failure Patterns

✓ Production Notes

✓ Worked Example

---

## Pattern

Required

✓ Concept

✓ Applicability

✓ Anti-patterns

✓ Related Workflows

---

## Model

Required

✓ Architecture

✓ Strengths

✓ Weaknesses

✓ Benchmarks

✓ Alternatives

---

## Package

Required

✓ Installation

✓ Common Tasks

✓ Examples

✓ Debugging

✓ Version Notes

---

## Cheatsheet

Required

✓ Syntax

✓ One-liner

✓ Package Link

---

## Debug Guide

Required

✓ Symptoms

✓ Root Causes

✓ Diagnosis

✓ Solutions

✓ Prevention

---

## Registry

Required

✓ Metadata

✓ Download

✓ License

✓ Tasks

---

# 29. Content Completeness Score

Every page internally tracks completeness.

Purpose

Help maintainers prioritize improvements.

---

Example

```
Overall

82%
```

---

Breakdown

```
Examples

Complete

Benchmarks

Missing

Debugging

Complete

Sources

Complete

Version

Outdated
```

Users do not see this score.

It is a maintenance tool.

---

# 30. Search Architecture

Search is the primary interface.

Everything is optimized for retrieval.

---

## Search Modes

Problem Search

```
object detection
```

---

Workflow Search

```
rag
```

---

Tool Search

```
pytorch
```

---

Syntax Search

```
train_test_split
```

---

Debug Search

```
cuda oom
```

---

Decision Search

```
xgboost vs random forest
```

---

Registry Search

```
llama 3.3
```

---

## Ranking Priority

Search should prioritize

1.

Exact matches

↓

2.

Canonical pages

↓

3.

Related pages

↓

4.

Reference pages

↓

5.

Generated pages

---

# 31. AI Integration

The knowledge graph is designed to become an AI-native knowledge system.

Future AI features include:

---

## Semantic Search

Meaning-based retrieval.

---

## Context-Aware Recommendations

Example

Reading

```
RAG
```

Automatically suggests

* FAISS
* BGE
* Hybrid Search
* Reranking
* GraphRAG

---

## AI Summaries

Every page can generate

* TL;DR
* Key Takeaways
* Prerequisites
* Next Steps

without changing canonical content.

---

## AI Tutor

Future agents should answer only from canonical pages.

Never invent information.

---

## AI Knowledge Graph Traversal

Future reasoning engines can traverse typed relationships.

Example

```
Problem

↓

Workflow

↓

Pattern

↓

Package

↓

Debug Guide
```

This enables explainable AI assistance.

---

# 32. Governance Rules

These rules are non-negotiable.

---

## Rule 1

One Fact.

One Owner.

---

## Rule 2

Views never own knowledge.

---

## Rule 3

Generated content is disposable.

Canonical content is permanent.

---

## Rule 4

No duplicated explanations.

Reference instead.

---

## Rule 5

Every page must answer one engineering question.

---

## Rule 6

Every page must connect to the graph.

---

## Rule 7

Prefer stable concepts over volatile implementations.

---

## Rule 8

Official documentation remains the source of truth for rapidly changing APIs.

AENS provides engineering context, not a replacement for vendor documentation.

---

# 33. Six-Month Build Roadmap

## Phase 1

Foundation

* Package Library
* Shared Components
* Search
* Navigation

---

## Phase 2

Engineering

* Workflow Library
* Pattern Library
* Cross-links

---

## Phase 3

Retrieval

* Cheatsheets
* Debug Guides
* Problem Index

---

## Phase 4

Decision Support

* Model Library
* Decision Guides

---

## Phase 5

Deployment

* Registry
* Benchmarks
* Services

---

## Phase 6

Intelligence

* AI Recommendations
* Semantic Search
* Knowledge Graph APIs
* Personalization

---

# 34. Future Expansion Policy

To preserve architectural integrity, new content types should be added only when they satisfy all of the following conditions:

1. They answer a **new engineering question** that no existing content type owns.
2. They do not duplicate existing ownership responsibilities.
3. They provide long-term value rather than documenting a temporary trend.
4. They fit naturally into the knowledge graph through typed relationships.
5. They remain maintainable by a single contributor.

If a proposed feature can be represented as metadata, a generated view, or a relationship, it **must not** become a new content type.

---

# 35. Freeze Rules (Non-Negotiable)

The following rules define the architectural contract for AENS v1.0:

1. **One Fact, One Owner.** No duplication of canonical knowledge.
2. **Navigation is independent of ownership.** Users may enter from any point.
3. **Every page participates in the knowledge graph.**
4. **Canonical pages are immutable sources of truth; generated views never own data.**
5. **Patterns remain tool-agnostic.**
6. **Packages own implementation, not concepts.**
7. **Workflows own end-to-end execution, including worked examples.**
8. **Cheatsheets remain lightweight syntax references only.**
9. **Debug Guides are symptom-first, not technology-first.**
10. **Registry stores metadata, not explanations.**
11. **Decision Guides are curated comparison pages, not a foundational content type.**
12. **Every content object includes lifecycle, stability, and metadata for long-term governance.**
13. **Architecture changes require an explicit revision of this specification.**

---

# Final Architecture Summary

The completed AENS Knowledge Layer is built on **four independent architectures**:

1. **Knowledge Ownership Architecture** — defines where information permanently lives.
2. **Navigation Architecture** — defines how users discover information.
3. **Knowledge Graph Architecture** — defines semantic relationships between knowledge objects.
4. **Knowledge Lifecycle Architecture** — governs evolution, maintenance, and deprecation.

Within these architectures, the system consists of:

* **Problem Index** (navigation entry point)
* **Workflow** (execution knowledge)
* **Pattern** (reusable engineering concepts)
* **Model** (algorithm knowledge)
* **Package** (implementation knowledge)
* **Cheatsheet** (rapid syntax recall)
* **Debug Guide** (symptom-first troubleshooting)
* **Registry** (deployment metadata)
* **Decision Guides** (curated engineering trade-offs)
* **Principle** (fundamental why and theoretical foundations)

Together, these components form a **knowledge operating system** rather than a documentation site. They separate ownership from navigation, emphasize retrieval over reading, minimize duplication through canonical ownership, and provide a scalable foundation that can support AI-assisted search, recommendations, and graph reasoning while remaining sustainable for a single maintainer over the long term. This specification is suitable as the baseline for freezing the AENS knowledge architecture and guiding implementation over the coming development phases.

---

# Implementation Status

## Model Detail Page UX Refactor (v1.2)

**Status:** ✅ Complete

The Model Detail Page has been refactored to implement premium developer experience visual standards:

### Completed Features

1. **Shared Prose/Math Rendering Primitive** - `Prose.tsx` component with `react-markdown`, `remark-gfm`, `remark-math`, `rehype-katex` for rendering markdown and LaTeX content
2. **Quick Start Syntax Highlighting** - `CodeBlock.tsx` with Shiki's `codeToHtml` for server-side syntax highlighting
3. **Relative Time Formatting** - `formatRelativeTime` in `lib/format-date.ts` for human-readable timestamps
4. **Section Defaults & Typography** - Core Understanding collapsed by default, `content-prose` width applied, inline code styling
5. **Shiki Build-Time Rendering** - CodeBlock moved to async Server Component, eliminating client-side performance regression
6. **Double-Escaped Newline Fix** - `normalizeContent` function in `Prose.tsx` handles literal `\n` sequences
7. **KaTeX Typography Scoping** - CSS override `body .katex { font-size: 1em !important; }` for consistent sizing
8. **Core Understanding Teaser** - Computed summary teaser instead of raw field concatenation
9. **Interpretability Prose Rendering** - `ModelDecisionStrip.tsx` uses `ProseInline` for LaTeX/math rendering
10. **Code Block Background Fix** - Scoped CSS override for Shiki's inline background
11. **Collapse Scroll Compensation** - `useLayoutEffect` with `getBoundingClientRect` tracking
12. **Also Worth Knowing Cross-Linking** - Links to real pages where available
13. **Accessibility Attributes** - `aria-expanded` and `aria-controls` added to interactive elements

### Build Verification

- `npm run build` completed successfully
- 0 errors, 23 warnings (only missing content references)
- All 40 static pages generated
- Validation script includes double-escaped newline checking

### Git Status

- Pushed to `feature/repository-foundation-v2` branch
- Commit `7af1f7a` with all changes