# AENS Registry Resource Prompt — Qwen3 Family

---

You are producing gold-standard engineering knowledge for a personal AI engineering reference system (AENS). This is **NOT** a tutorial or introductory documentation. Assume the reader is a **Principal LLM Systems Engineer** responsible for making production-grade model selection and deployment architecture decisions.

Generate the registry resource using the exact target specifications, architectural baseline, and instructions below.

---

## AENS Knowledge Ingestion Pipeline Integration

This prompt is designed to work with the AENS Production Knowledge Ingestion Pipeline. After Perplexity generates the Markdown content, use the `knowledge_ingestion_prompt (Finalize).md` to convert it to JSON.

**Schema Mapping Reference:**
* The generated Markdown will be converted to JSON matching `lib/schemas/registry.ts`
* All sections below map directly to schema fields
* Preserve exact structure for lossless JSON transformation

---

# Target Registry Specifications

* **Target Model Name:** Qwen3 Family
* **Task:** LLM
* **Category:** models
* **Provider:** Alibaba Cloud (Qwen Team)
* **Family:** Qwen
* **Variants to Cover:** 0.6B, 1.7B, 4B, 8B, 14B, 32B, 32B Thinking, 480B (MoE), 480B Thinking (MoE)
* **Primary Use Cases:**
  - Reasoning
  - Agent systems
  - Multilingual
  - Coding
  - Math
  - Self-hosting
  - Fine-tuning
  - RAG
  - Long-context processing

---

# Evidence Source Requirements

| Information | Required Source |
|-------------|-----------------|
| Architecture | Official docs/paper |
| License | Official |
| Runtime support | Official runtime documentation |
| Deployment notes | Community consensus is acceptable |

---

# Canonical Reference Implementation

Treat this registry entry as documenting the following baseline production LLM system:

### Qwen3 Family
* **Framework:** PyTorch + Hugging Face Transformers / vLLM / SGLang
* **Architecture:** Decoder-only Transformer with Grouped-Query Attention (GQA), Mixture-of-Experts (MoE) for 480B variants, and native thinking/reasoning support
* **Precision:** FP8 native, INT8/INT4/INT3 quantization support, QAT for production
* **Use Case:** Production LLM deployment optimized for reasoning tasks, multilingual support, and efficient inference with thinking mode capabilities

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

> **"When should I choose this model for production deployment, and what are the concrete engineering trade-offs in memory, quality, cost, and deployment?"**

Focus on:
* **What do I gain?** (Advantages, system performance benefits)
* **What do I lose?** (Disadvantages, computational overhead)
* **Why should I care?** (Impact on production deployment and system correctness)

---

## 3. Precision & Anti-Hallucination Standards

Search and synthesize information using **academic connectors and primary sources only**.

**Critical Rule:** Cover the entire Qwen3 model family (0.6B, 1.7B, 4B, 8B, 14B, 32B, 32B Thinking, 480B MoE, 480B Thinking MoE). Do not limit the search to only the latest release.

**Critical Rule:** Populate every field using the highest-quality available evidence according to the Evidence Source Requirements table. If an official source does not publish a field, use the approved fallback source rather than stopping or leaving the entry incomplete.

**Unknown Values Rule:** If evidence cannot be found after exhaustive search, write "Unknown", "Not Published", or "Not Available" instead of estimating. Never infer numeric values.

**Contradiction Handling:** If multiple reputable sources disagree, prefer Official Technical Report > Model Card > Release Notes > Community consensus. Mention disagreement only if it affects deployment decisions.

**Hardware Requirements Note:** Most companies do NOT publish minimum/recommended GPU/RAM values. Use community consensus from vLLM, llama.cpp, Hugging Face, LM Studio, and community deployment guidance. Clearly indicate when values are recommendations rather than official requirements.

**Runtime Compatibility Note:** If minimum version is not specified, use "Unknown", "Not specified", or "Latest stable" rather than inventing version numbers.

**Benchmark Guidance:** Do not reproduce benchmark leaderboards. Only summarize benchmark implications when they materially change deployment decisions.

**Duplicate Prevention:** Do not duplicate information that belongs in variant pages. Focus on family-wide architecture, ecosystem maturity, and cross-variant deployment patterns.

Prefer evidence in this order:
1. Official model documentation and technical reports
2. Official model cards and release notes
3. Peer-reviewed papers on model architecture
4. Official inference framework documentation (vLLM, SGLang, llama.cpp, etc.)
5. Conference proceedings
6. University publications
7. Engineering blogs only when authored by framework creators or primary contributors

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

# Qwen3 Family

## Overview

Provide a 2-4 sentence overview describing the model family, focusing on production deployment characteristics, reasoning capabilities, multilingual support, MoE efficiency for 480B variants, and key engineering differentiators.

---

## Identity

* **Family:** [Populate from official sources]
* **Variants:** [List all variants with their parameter counts — 0.6B, 1.7B, 4B, 8B, 14B, 32B, 32B Thinking, 480B (MoE), 480B Thinking (MoE)]
* **Provider:** [Model provider/creator]
* **Checkpoints:** [Available checkpoint sizes — base and instruct for most variants]

---

## Architecture

* **Architecture Type:** [Transformer variant — Decoder-only with GQA and optional MoE]
* **Transformer Type:** [Encoder-only, Decoder-only, Encoder-decoder]
* **Attention Mechanism:** [MHA, GQA, MQA, etc. — Grouped-Query Attention; include MoE details for 480B variants]
* **Tokenizer:** [Tokenizer type and vocabulary size]
* **Positional Encoding:** [RoPE, ALiBi, etc.]
* **KV Cache:** [Yes/No]
* **Flash Attention:** [Yes/No]
* **Mixture of Experts:** [Yes/No — include total experts, activated experts per token, shared experts, routing mechanism for 480B variants]

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

## Ecosystem Support

| Framework | Supported | Notes |
|-----------|-----------|-------|
| Transformers | [Yes/No] | [Notes from official docs] |
| vLLM | [Yes/No] | [Notes from official docs] |
| SGLang | [Yes/No] | [Notes from official docs] |
| Ollama | [Yes/No] | [Notes from official docs] |
| Llama.cpp | [Yes/No] | [Notes from official docs] |
| MLX | [Yes/No] | [Notes from official docs] |
| LiteLLM | [Yes/No] | [Notes from official docs] |
| OpenRouter | [Yes/No] | [Notes from official docs] |
| LM Studio | [Yes/No] | [Notes from official docs] |
| TensorRT-LLM | [Yes/No] | [Notes from official docs] |

---

## References

| Resource | URL | Category | Why Read | Outcome | Time | Confidence |
|----------|-----|----------|----------|---------|------|------------|
| [Official Documentation] | [URL] | official | [Why this resource matters] | [Expected outcome] | [Minutes] | Official |
| [Model Card] | [URL] | documentation | [Why this resource matters] | [Expected outcome] | [Minutes] | Official |
| [Technical Report] | [URL] | papers | [Why this resource matters] | [Expected outcome] | [Minutes] | Research |
| [Inference Framework] | [URL] | documentation | [Why this resource matters] | [Expected outcome] | [Minutes] | Community |
| [Repository] | [URL] | repositories | [Why this resource matters] | [Expected outcome] | [Minutes] | Official |

**Each reference must answer:**
* **Why should I click this?** - Clear value proposition
* **When should I read this?** - Specific use case
* **Expected outcome** - What you'll learn/achieve
* **Reading time** - Estimated time investment
* **Confidence** - Official / Research / Community Consensus

---

## Related Models

* **Related Models:** [Models sharing the same paradigm]
* **Alternative Models:** [Alternative algorithms for the same task]

---

## Capabilities

* **Instruction Tuned:** [Yes/No]
* **Reasoning:** [Yes/No — include native thinking mode support]
* **Vision:** [Yes/No]
* **Multilingual:** [Yes/No — include language count and coverage]
* **Tool Calling:** [Yes/No]
* **Function Calling:** [Yes/No]
* **Thinking Model:** [Yes/No — include thinking mode capabilities]
* **Context Window:** [Value from official spec]
* **Max Output Tokens:** [Value from official spec]

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

## Engineering Decision

### Choose If
* [Condition when this model is the right choice]

### Avoid If
* [Condition when this model should be avoided]

### Watch Out For
* [Critical deployment considerations]

### Best Deployment Scenario
* [Primary deployment recommendation]

### Alternatives
* [Alternative model families]

### Performance Dimensions
| Dimension | Rating | Notes | Recommendation Source |
|-----------|--------|-------|----------------------|
| [dimension] | [excellent/good/fair/poor] | [Notes] | [Official/Research/Community Consensus] |

### Deployment Profiles
| Profile | Recommended Variant | Expected Experience | Notes | Recommendation Source |
|---------|-------------------|-------------------|-------|----------------------|
| Small edge deployment | [variant] | [experience] | [notes] | [Official/Research/Community Consensus] |
| Medium server deployment | [variant] | [experience] | [notes] | [Official/Research/Community Consensus] |
| Enterprise deployment | [variant] | [experience] | [notes] | [Official/Research/Community Consensus] |
| Reasoning deployment | [variant] | [experience] | [notes] | [Official/Research/Community Consensus] |
| Coding deployment | [variant] | [experience] | [notes] | [Official/Research/Community Consensus] |
| Long-context deployment | [variant] | [experience] | [notes] | [Official/Research/Community Consensus] |

### Runtime Matrix
| Runtime | Supports | Official | Priority | Notes | Recommendation Source |
|---------|----------|----------|----------|-------|----------------------|
| [runtime] | [features] | [Yes/No] | [recommended/supported/community/experimental] | [notes] | [Official/Research/Community Consensus] |

---

## Timeline

| Version | Release Date | Notes |
|---------|--------------|-------|
| [Version] | [Date] | [Notes] |

---

## Engineering Notes

### Inference Notes
* [Key inference optimization from official sources — include thinking mode overhead, MoE routing efficiency, quantization impact]

### Deployment Notes
* [Key deployment consideration from official sources — include single-GPU target for smaller variants, multi-GPU for 480B, thinking mode configuration]

### Optimization Notes
* [Key optimization technique from official sources — include context window scaling, quantization strategies, thinking mode optimization]

### Compatibility Notes
* [Key compatibility note from official sources — include tokenizer compatibility, prompt format, thinking mode API]

### Migration Notes
* [Migration considerations from Qwen2.5, Llama 3, DeepSeek, or other similar models]

### Common Pitfalls
* [Common production pitfall with mitigation — include thinking mode memory overhead, MoE load balancing, quantization quality trade-offs]

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
| Architecture | `architecture` | Object with architecture_type, transformer_type, etc. |
| File Formats | `formats` | Object with safetensors, gguf, awq, gptq, etc. |
| Ecosystem Support | `ecosystem` | Object with transformers, vllm, ollama, etc. |
| References | `references[]` | Array of ReferenceSchema objects |
| Related Models | `related_models[]` | Array of RelatedModelSchema objects |
| Capabilities | `capabilities` | Object with instruction_tuned, reasoning, etc. |
| Engineering Snapshot | `engineering_snapshot` | Object with best_for, avoid_for, etc. |
| Engineering Decision | `engineering_decision` | Object with choose_if, avoid_if, watch_out_for, etc. (includes recommendation_source) |
| Engineering Notes | `engineering_notes` | Object with inference_notes, etc. |
| Timeline | `timeline[]` | Array of TimelineEntrySchema objects |

## Required Base Metadata Fields

The following fields must be populated in the JSON (from RegistryModelSchema):
* `id` - Use "qwen3-family"
* `title` - "Qwen3 Family"
* `slug` - "qwen3-family"
* `description` - Brief description of the model family
* `name` - "Qwen3 Family"
* `task` - "llm"
* `category` - "models"
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
9. References include clear "Why Read" and "Expected Outcome" for each entry.
10. **Do not invent AENS internal slugs** - describe relationships only, ingestion will map them.