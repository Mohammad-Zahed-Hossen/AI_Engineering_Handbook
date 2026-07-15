---

# AENS Principle Resource Prompt — Modularity & Composability

---

You are producing gold-standard engineering knowledge for a personal AI engineering reference system (AENS). This is **NOT** a tutorial or introductory documentation. Assume the reader is a **Principal Systems Architect** responsible for designing maintainable, scalable AI engineering systems.

Generate the principle resource using the exact target specifications, architectural baseline, and instructions below.

---

## AENS Knowledge Ingestion Pipeline Integration

This prompt is designed to work with the AENS Production Knowledge Ingestion Pipeline. After Perplexity generates the Markdown content, use the `knowledge_ingestion_prompt (Finalize).md` to convert it to JSON.

**Schema Mapping Reference:**
* The generated Markdown will be converted to JSON matching `lib/schemas/principle.ts`
* All sections below map directly to schema fields
* Preserve exact structure for lossless JSON transformation

---

# Target Principle Specifications

* **Target Principle Name:** `Modularity & Composability`
* **Principle Category:** `systems`
* **Problem Statement:** AI engineering systems become unmaintainable when components are not designed as discrete, interchangeable modules that can be composed into larger systems, leading to monolithic architectures, brittle integrations, and inhibited experimentation.

---

# Instructions for Perplexity Content Generation

## 1. Role & Voice

> You are a **Principal Systems Architect** responsible for designing maintainable, scalable AI engineering systems.

Document internal systems design knowledge for experienced AI platform engineers.

**Do not optimize for completeness. Optimize for signal density. If two sections repeat the same information, rewrite or remove one. Every section must contribute unique engineering knowledge.**

Never explain:
* what modularity means in general
* basic software engineering concepts
* beginner API concepts
* what "composability" is at a basic level

If a section cannot contain production-grade engineering knowledge, omit it rather than filling it with generic advice.

---

## 2. Objective

The resource must answer:

> **"What is the Modularity & Composability principle, why does it matter for AI engineering systems, and how can I identify and apply it correctly?"**

---

## 3. Precision & Anti-Hallucination Standards

Search and synthesize information using **academic connectors and primary sources only**.

Prefer evidence in this order:
1. Seminal papers
2. Books
3. Official architecture documentation
4. Standards/specifications
5. Conference proceedings

Avoid:
* Medium
* personal blogs
* AI-generated summaries
* SEO articles

Cite non-obvious claims, historical facts, empirical statements, and recommendations.

---

## 4. Citation Expectations

Use Markdown footnotes.

Every citation must appear exactly once inside **Further Study**.

No orphan citations.

---

## 5. Hard Anti-Pattern Bans

Never include:
* introductions about software engineering
* beginner explanations
* motivational writing
* API references
* history lessons
* obvious advice
* generic monitoring recommendations
* duplicated documentation

---

# Markdown Output Format & Schema Requirements

Generate semantic Markdown only.

No JSON.

Use the exact headers below.

---

# Modularity & Composability

## Overview

Provide a 2-4 sentence overview describing the Modularity & Composability principle in AI engineering systems, focusing on maintainability, debugging, and scalability benefits.

---

## Problem

State the engineering problem: When AI system components (data loading, model logic, training loop, logging, evaluation) are tightly coupled and not designed as discrete modules, changes to one component require changes to others, making systems brittle and difficult to maintain, extend, or compose into larger pipelines.

---

## Statement

Provide the fundamental principle statement.

---

## Intuition

Provide an intuitive explanation that helps engineers understand why this principle matters.

---

## Engineering Consequences

List the primary engineering consequences of this principle. For each consequence, include:
* **Title** - The engineering impact area
* **Explanation** - Why this consequence matters in practice

---

## Common Violations

Generate the most common violations observed in production AI systems, ranked by frequency. For each violation, include:
* **Violation** - What the violation looks like
* **Symptoms** - Observable indicators
* **Why It Happens** - Root cause of the violation

---

## Appears In

List domains where this principle appears in AI systems. For each domain, include:
* **Domain** - The system domain
* **Examples** - Real-world examples in that domain

---

## Mental Model

Provide a visual ASCII or Mermaid diagram showing how concerns are separated.

---

## Decision Checklist

Provide yes/no questions for applying the principle.

---

## Misconceptions

List common misunderstandings. For each, include:
* **Myth** - The misconception
* **Reality** - The truth

---

## Engineering Heuristic

Provide one memorable takeaway.

---

## Historical Origin

If the historical origin is well established, summarize it. Otherwise state that the concept evolved through software engineering practice.

---

## Tradeoffs

* **Benefits** - What is gained by following this principle
* **Costs** - What is sacrificed or made more complex

---

## Limitations

List scenarios where this principle doesn't apply or may be counterproductive.

---

## Related Concepts

List related principles or concepts.

---

## Further Study

### Seminal Papers
List foundational papers on this principle.

### Books
List authoritative books.

### Official Documentation
List official documentation or standards.

---

## Suggested Meta

* **Tags:** architecture, systems, design-principles, modularity, composability
* **Aliases:** modular-design, component-composition, plug-and-play-architecture
* **Keywords:** architecture, modularity, composability, systems-design, component-based
* **Search Tokens:** modularity, composability, modular design, component composition, system design
* **Difficulty:** Intermediate
* **Domain:** systems
* **Engineering Area:** architecture
* **Estimated Reading Time:** 15-20 minutes
* **Prerequisites:** None
* **Recommended Next:** single-source-of-truth, separation-of-concerns
* **Cross-Links:**
  * referenced_by_patterns: training-loop, gradient-accumulation, kv-cache, mixed-precision, checkpointing, early-stopping, gradient-checkpointing, flash-attention, prompt-caching, streaming-inference, batch-inference
  * referenced_by_models: llama, mistral, bert
  * referenced_by_workflows: build-rag-system, fine-tune-llm-lora-qlora

---

---

# Schema Mapping Reference for JSON Conversion

After Perplexity generates the Markdown, use the `knowledge_ingestion_prompt (Finalize).md` to convert to JSON. The following mapping rules ensure lossless transformation:

## Markdown to JSON Field Mapping

| Markdown Section | JSON Schema Field | Notes |
|------------------|-------------------|-------|
| Overview | `one_sentence_summary` | Single sentence summary |
| Problem | `problem` | The engineering problem |
| Statement | `statement` | The fundamental principle |
| Intuition | `intuition` | Intuitive explanation |
| Engineering Consequences | `engineering_consequences[]` | Each with `title`, `explanation` |
| Common Violations | `common_violations[]` | Each with `violation`, `symptoms`, `why_it_happens` |
| Appears In | `appears_in[]` | Each with `domain`, `examples[]` |
| Mental Model | `mental_model` | ASCII/Mermaid diagram |
| Decision Checklist | `decision_checklist[]` | Array of question strings |
| Misconceptions | `misconceptions[]` | Each with `myth`, `reality` |
| Engineering Heuristic | `engineering_heuristic` | One memorable takeaway |
| Historical Origin | `historical_origin` | Where principle originated |
| Tradeoffs | `tradeoffs` | Object with `benefits[]`, `costs[]` |
| Limitations | `limitations[]` | Array of limitation strings |
| Related Concepts | `related_concepts[]` | Array of concept strings |

## Required Base Metadata Fields

The following fields must be populated in the JSON (from BaseMetaSchema):
* `id` - Use "modularity-composability"
* `title` - "Modularity & Composability"
* `slug` - "modularity-composability"
* `description` - Brief description of the principle
* `name` - "Modularity & Composability"
* `category` - "systems"
* `created_at` - Current date (YYYY-MM-DD)
* `updated_at` - Current date (YYYY-MM-DD)
* `sources` - Array of source URLs (minimum 1)
* `tags` - Array of tags
* `keywords` - Array of keywords
* `search_tokens` - Array of search tokens
* `domain` - "systems"
* `difficulty` - "intermediate"
* `engineering_area` - "architecture"
* `estimated_reading_time` - Number in minutes
* `prerequisites` - Array of prerequisite workflow IDs
* `last_verified` - Date
* `review_frequency` - "annually"
* `canonical_status` - "canonical"
* `lifecycle` - "stable"
* `stability` - "stable"
* `confidence` - "production_proven"
* `engineering_maturity` - "production_ready"

## JSON Conversion Rules

1. **Tables:** Convert markdown tables to JSON objects/arrays preserving all rows and columns
2. **Lists:** Convert bulleted lists to JSON string arrays
3. **Code Blocks:** Preserve exactly as-is, only JSON-escape necessary characters
4. **URLs:** Copy exactly, no modification
5. **No Invention:** Do not create data not present in Markdown
6. **No Omission:** Do not omit any information from Markdown
7. **Order Preservation:** Maintain original order of array items

---

# Final Validation Checklist

Before outputting, verify that:

1. Principle category is exactly **systems**.
2. Output is semantic Markdown only.
3. Statement is present and clear.
4. Intuition is provided.
5. At least 1 engineering consequence is present.
6. At least 1 common violation is present.
7. Appears in section has at least 1 domain.
8. Decision checklist has at least 1 question.
9. Every citation appears exactly once in **Further Study**.
10. All suggested AENS IDs use real-world common naming.
11. The output focuses on the principle rather than implementation details.
