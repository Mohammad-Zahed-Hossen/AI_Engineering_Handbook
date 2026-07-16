# AENS Registry Resource Prompt — Qwen3 Variant

---

You are producing gold-standard engineering knowledge for a personal AI engineering reference system (AENS). This is **NOT** a tutorial or introductory documentation. Assume the reader is a **Principal LLM Systems Engineer** responsible for making production-grade model selection and deployment architecture decisions.

Generate the registry variant resource using the exact target specifications, architectural baseline, and instructions below.

---

## AENS Knowledge Ingestion Pipeline Integration

This prompt is designed to work with the AENS Production Knowledge Ingestion Pipeline. After Perplexity generates the Markdown content, use the `knowledge_ingestion_prompt (Finalize).md` to convert it to JSON.

**Schema Mapping Reference:**
* The generated Markdown will be converted to JSON matching `lib/schemas/registry.ts`
* All sections below map directly to schema fields
* Preserve exact structure for lossless JSON transformation

---

# Target Registry Specifications

* **Target Model Name:** Qwen3 [VARIANT_NAME]
* **Task:** LLM
* **Category:** models
* **Provider:** Alibaba Cloud (Qwen Team)
* **Family:** Qwen
* **Variant:** [VARIANT_NAME] (e.g., 3-8b, 3-32b, 3-480b)

---

# Evidence Source Requirements

| Information | Required Source |
|-------------|-----------------|
| Specifications | Official model card |
| Hardware | Community consensus (vLLM, llama.cpp, Hugging Face, LM Studio) |
| Downloads | Official |
| Runtime compatibility | Official runtime documentation |
| License | Official |

---

# Canonical Reference Implementation

Treat this registry entry as documenting the following baseline production LLM system:

### Qwen3 [VARIANT_NAME]
* **Framework:** PyTorch + Hugging Face Transformers / vLLM / SGLang
* **Architecture:** Decoder-only Transformer with Grouped-Query Attention (GQA) and native thinking/reasoning support
* **Precision:** FP8 native, INT8/INT4/INT3 quantization support
* **Use Case:** Production LLM deployment for specific variant use cases

---

# Instructions for Perplexity Content Generation

## 0. Execution Instructions

> **Research thoroughly before writing** - Search official documentation, Hugging Face model cards, GitHub repositories, technical reports, vLLM, SGLang, llama.cpp, and TensorRT-LLM documentation before generating the document.

> **Think first, write second** - Perform a complete internal analysis of all sources first. Only after synthesizing the information, generate the final Markdown. Do not stream partial findings.

> **Strict completeness check** - Before returning the answer, verify that every required section is populated. If a value cannot be verified, explicitly write "Unknown", "Not Published", or "Not Available". Never estimate.

## 1. Role & Voice

> You are a **Principal LLM Systems Engineer** responsible for designing production-grade model selection and deployment architecture for large language models.

Document internal model registry decisions for experienced AI platform engineers.

Never explain:
* what an LLM is
* what transformers are
* basic model architecture concepts
* beginner API concepts

Every paragraph should help an engineer make deployment or model selection decisions.

---

## 2. Objective & Trade-off Philosophy

The resource must answer:

> **"When should I choose this specific variant for production deployment, and what are the concrete engineering trade-offs in memory, quality, cost, and deployment?"**

Focus on:
* **What do I gain?** (Advantages, system performance benefits)
* **What do I lose?** (Disadvantages, computational overhead)
* **Why should I care?** (Impact on production deployment and system correctness)

---

## 3. Precision & Anti-Hallucination Standards

Search and synthesize information using **academic connectors and primary sources only**.

**Critical Rule:** Populate every field using the highest-quality available evidence. If an official source does not publish a field, use the approved fallback source rather than stopping or leaving the entry incomplete.

**Unknown Values Rule:** If evidence cannot be found after exhaustive search, write "Unknown", "Not Published", or "Not Available" instead of estimating. Never infer numeric values.

**Contradiction Handling:** If multiple reputable sources disagree, prefer Official Technical Report > Model Card > Release Notes > Community consensus. Mention disagreement only if it affects deployment decisions.

**Hardware Requirements Note:** Most companies do NOT publish minimum/recommended GPU/RAM values. Use community consensus from vLLM, llama.cpp, Hugging Face, LM Studio, and community deployment guidance. Clearly indicate when values are recommendations rather than official requirements.

**Runtime Compatibility Note:** If minimum version is not specified, use "Unknown", "Not specified", or "Latest stable" rather than inventing version numbers.

**Benchmark Guidance:** Do not reproduce benchmark leaderboards. Only summarize benchmark implications when they materially change deployment decisions.

**Duplicate Prevention:** Do not duplicate information that belongs in family pages. Focus on variant-specific hardware, deployment, and performance differences. Assume the reader has already read the family page.

**Variant Differentiation:** After every major section, highlight what differentiates this variant from the rest of its family. Avoid repeating information common to all variants. Focus on deployment-relevant differences.

Prefer evidence in this order:
1. Official model documentation and technical reports
2. Official model cards and release notes
3. Official inference framework documentation (vLLM, SGLang, llama.cpp, etc.)
4. Community consensus (vLLM, llama.cpp, Hugging Face, LM Studio)
5. Engineering blogs only when authored by framework creators or primary contributors

Avoid:
* Medium
* personal blogs
* AI-generated summaries
* SEO articles

Every engineering recommendation must be traceable to a reputable source.

---

## 4. Citation Expectations

Use Markdown footnotes.

Every engineering claim must reference:
* research papers
* official documentation
* model cards
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
* ingestion metadata (created_at, updated_at, last_verified)
* **DO NOT invent AENS internal slugs** - If unknown, describe the relationship only. The ingestion pipeline will map them later.

---

# Markdown Output Format & Schema Requirements

Generate semantic Markdown only.

No JSON.

Use the exact headers below.

---

# Qwen3 [VARIANT_NAME]

## Overview

Provide a 2-4 sentence overview describing this specific variant, focusing on production deployment characteristics, hardware requirements, and key engineering differentiators.

---

## Identity

* **Family:** Qwen3
* **Variant:** [VARIANT_NAME]
* **Provider:** Alibaba Cloud (Qwen Team)
* **Size:** [Size in MB]

---

## Specifications

* **Parameter Count:** [From official model card]
* **Hidden Size:** [From official specification]
* **Layers:** [From official specification]
* **Attention Heads:** [From official specification]
* **Vocab Size:** [From official specification]
* **Training Tokens:** [From official documentation]
* **Context Window:** [From official specification]
* **Max Output Tokens:** [From official specification]

---

## File Formats

* **Safetensors:** [Yes/No]
* **GGUF:** [Yes/No]
* **AWQ:** [Yes/No]
* **GPTQ:** [Yes/No]
* **MLX:** [Yes/No]
* **ONNX:** [Yes/No]
* **TensorRT:** [Yes/No]

---

## Hardware Requirements

* **Minimum GPU Memory:** [From community consensus - indicate if recommendation]
* **Recommended GPU Memory:** [From community consensus - indicate if recommendation]
* **Minimum RAM:** [From community consensus - indicate if recommendation]
* **Recommended RAM:** [From community consensus - indicate if recommendation]
* **Disk Space:** [From official documentation]
* **Recommended GPU:** [From community consensus - indicate if recommendation]

---

## Downloads

| Platform | URL | Official | Notes |
|----------|-----|----------|-------|
| [Platform] | [URL] | [Yes/No] | [Notes] |

---

## Runtime Compatibility

| Runtime | Supported | Minimum Version | Notes |
|---------|-----------|-----------------|-------|
| [Runtime] | [Yes/No] | [Version/Unknown/Not specified/Latest stable] | [Notes] |

---

## Deployment

* **Supported Runtimes:** [List from official documentation]
* **Recommended Runtime:** [Primary recommendation with reason]
* **Quantizations:** [Supported formats from official docs]
* **Recommended Quantization:** [Best practice with justification]
* **CPU Supported:** [Yes/No]
* **GPU Supported:** [Yes/No]
* **MPS Supported:** [Yes/No]

---

## License

* **Name:** [License name]
* **Commercial Use:** [Yes/No]
* **Modification:** [Yes/No]
* **Redistribution:** [Yes/No]
* **Attribution Required:** [Yes/No]
* **Notes:** [License constraints]

---

## Status

* **Release Date:** [From official release]
* **Maintenance Status:** [production/experimental/deprecated/research/legacy]

---

## Engineering Snapshot

* **Best For:**
  - [Production use case 1]
  - [Production use case 2]
  - [Production use case 3]

* **Avoid For:**
  - [Scenario to avoid 1]
  - [Scenario to avoid 2]
  - [Scenario to avoid 3]

* **Deployment Complexity:** [low/moderate/high]
* **Production Ready:** [true/false]
* **Recommended Use Case:** [Primary recommendation]

---

## Engineering Notes

### Inference Notes
* [Key inference optimization from official sources]

### Deployment Notes
* [Key deployment consideration from official sources]

### Optimization Notes
* [Key optimization technique from official sources]

### Compatibility Notes
* [Key compatibility note from official sources]

### Common Pitfalls
* [Common production pitfall with mitigation]

---

## Related Models

| ID | Relationship |
|----|--------------|
| [model-id] | [relationship] |

---

## Further Study

### Research Papers
* [Paper title] - [Author/Organization]

### Official Documentation
* [Documentation title]

### Engineering Blogs
* [Blog title] - [Author/Organization]

---

# Schema Mapping Reference for JSON Conversion

After Perplexity generates the Markdown, use the `knowledge_ingestion_prompt (Finalize).md` to convert to JSON. The following mapping rules ensure lossless transformation:

## Markdown to JSON Field Mapping

| Markdown Section | JSON Schema Field | Notes |
|------------------|-------------------|-------|
| Identity | `identity` | Object with family, variant, checkpoint, provider |
| Specifications | `specifications` | Object with parameter_count, hidden_size, etc. |
| File Formats | `formats` | Object with safetensors, gguf, awq, gptq, etc. |
| Hardware Requirements | `hardware` | Object with minimum_gpu_memory, etc. |
| Downloads | `downloads[]` | Array of DownloadSchema objects |
| Runtime Compatibility | `runtime_compatibility[]` | Array of RuntimeCompatibilitySchema objects |
| Deployment | `deployment` | Object with supported_runtimes, quantizations, etc. |
| License | `license_info` | Object with name, commercial_use, etc. |
| Status | `status` | Object with release_date, maintenance_status, etc. |
| Engineering Snapshot | `engineering_snapshot` | Object with best_for, avoid_for, etc. |
| Engineering Notes | `engineering_notes` | Object with inference_notes, etc. |

## Required Base Metadata Fields

The following fields must be populated in the JSON (from RegistryVariantSchema):
* `id` - Use "[variant-id]" (e.g., "3-8b", "3-32b")
* `title` - "Qwen3 [VARIANT_NAME]"
* `slug` - "qwen3-[variant-name]"
* `description` - Brief description of this variant
* `name` - "Qwen3 [VARIANT_NAME]"
* `family_id` - "qwen3-family"
* `size_mb` - Number in MB
* `sources` - Array of source URLs
* `tags` - Array of tags
* `keywords` - Array of keywords
* `search_tokens` - Array of search tokens

**Note:** `created_at`, `updated_at`, and `last_verified` are populated by the ingestion pipeline, not by Perplexity.

## JSON Conversion Rules

1. **Tables:** Convert markdown tables to JSON objects/arrays preserving all rows and columns
2. **Lists:** Convert bulleted lists to JSON string arrays
3. **URLs:** Copy exactly, no modification
4. **No Invention:** Do not create data not present in Markdown
5. **No Omission:** Do not omit any information from Markdown
6. **Order Preservation:** Maintain original order of array items

---

# Final Validation Checklist

Before outputting, verify that:

1. Model task is exactly **llm**.
2. Model category is exactly **models**.
3. Output is semantic Markdown only.
4. All required schema fields are present.
5. Every engineering claim is footnoted.
6. Every footnote appears exactly once in **Further Study**.
7. The output focuses on production deployment and model selection decisions.
8. Quantitative values are retrieved from primary sources, not assumed.
9. **Do not invent AENS internal slugs** - describe relationships only, ingestion will map them.
10. Hardware values are clearly marked as recommendations when from community sources.