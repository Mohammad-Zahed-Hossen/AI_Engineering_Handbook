# AENS Registry Resource Prompt — Model Family

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

* **Target Model Name:** Gemma 3 Family
* **Task:** LLM
* **Category:** models
* **Provider:** Google DeepMind
* **Family:** Gemma
* **Variants to Cover:** 1B, 4B, 12B, 27B (plus 270M released Aug 2025)
* **Primary Use Cases:**
  - Small deployment
  - Local inference
  - Multimodal (vision + text)
  - Multilingual
  - Function calling
  - Self-hosting
  - Fine-tuning
  - RAG

---

# Evidence Source Requirements

| Information | Required Source |
|-------------|-----------------|
| Architecture | Official docs/paper |
| Parameters | Official model card |
| License | Official |
| Downloads | Official |
| Context window | Official |
| Runtime support | Official runtime documentation |
| Hardware recommendation | Official if available, otherwise community-maintained docs (vLLM, Ollama, llama.cpp, Hugging Face model card) |
| Recommended quantization | Community consensus is acceptable |
| Recommended runtime | Community consensus is acceptable |
| Deployment notes | Community consensus is acceptable |

---

# Canonical Reference Implementation

Treat this registry entry as documenting the following baseline production LLM system:

### Gemma 3 Family
* **Framework:** PyTorch + Hugging Face Transformers / vLLM / JAX
* **Architecture:** Decoder-only Transformer with 5:1 interleaved local/global attention, GQA, QK-norm, and optional SigLIP vision encoder
* **Precision:** BF16 native, INT8/INT4/SFP8 quantization via QAT
* **Use Case:** Production LLM deployment optimized for single-GPU or single-TPU inference, on-device and edge scenarios, with strong multimodal and multilingual capabilities

---

# Instructions for Perplexity Content Generation

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

Prefer evidence in this order:
1. Official model documentation and technical reports
2. Official model cards and release notes
3. Peer-reviewed papers on model architecture
4. Official inference framework documentation (vLLM, TensorRT-LLM, llama.cpp, etc.)
5. Conference proceedings
6. University publications
7. Engineering blogs only when authored by framework creators or primary contributors

**Critical Rule:** Populate every field using the highest-quality available evidence according to the Evidence Source Requirements table. If an official source does not publish a field, use the approved fallback source rather than stopping or leaving the entry incomplete.

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

---

# Markdown Output Format & Schema Requirements

Generate semantic Markdown only.

No JSON.

Use the exact headers below.

---

# Gemma 3 Family

## Overview

Provide a 2-4 sentence overview describing the model family, focusing on production deployment characteristics, single-GPU/TPU efficiency, multimodal capabilities, multilingual coverage, and key engineering differentiators.

---

## Identity

* **Family:** [Populate from official sources]
* **Variants:** [List all variants with their parameter counts — 1B, 4B, 12B, 27B; include 270M if covering post-launch variants]
* **Provider:** [Model provider/creator]
* **Checkpoints:** [Available checkpoint sizes — pre-trained and instruction-tuned]

---

## Architecture

* **Architecture Type:** [Transformer variant]
* **Transformer Type:** [Encoder-only, Decoder-only, Encoder-decoder]
* **Attention Mechanism:** [MHA, GQA, MQA, etc. — Grouped-Query Attention with 5:1 local/global interleaving]
* **Tokenizer:** [Tokenizer type and vocabulary size — SentencePiece, 262k entries]
* **Positional Encoding:** [RoPE, ALiBi, etc. — RoPE with base frequency 10k (local) and 1M (global)]
* **KV Cache:** [Yes/No — include KV cache reduction from local attention]
* **Flash Attention:** [Yes/No]
* **Mixture of Experts:** [Yes/No]

---

## Specifications

For each variant, populate:
* **Parameter Count:** [From official model card — total and non-embedding]
* **Hidden Size:** [From official specification]
* **Layers:** [From official specification]
* **Attention Heads:** [From official specification]
* **Vocab Size:** [From official specification]
* **Training Tokens:** [From official documentation — 1B: 2T, 4B: 4T, 12B: 12T, 27B: 14T]
* **Context Window:** [From official specification — 1B: 32K, 4B/12B/27B: 128K]
* **Max Output Tokens:** [From official specification — 8192]

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

| Resource | URL | Category | Why Read | Outcome | Time |
|----------|-----|----------|----------|---------|------|
| [Official Documentation] | [URL] | official | [Why this resource matters] | [Expected outcome] | [Minutes] |
| [Model Card] | [URL] | documentation | [Why this resource matters] | [Expected outcome] | [Minutes] |
| [Technical Report] | [URL] | papers | [Why this resource matters] | [Expected outcome] | [Minutes] |
| [Inference Framework] | [URL] | documentation | [Why this resource matters] | [Expected outcome] | [Minutes] |
| [Repository] | [URL] | repositories | [Why this resource matters] | [Expected outcome] | [Minutes] |

**Each reference must answer:**
* **Why should I click this?** - Clear value proposition
* **When should I read this?** - Specific use case
* **Expected outcome** - What you'll learn/achieve
* **Reading time** - Estimated time investment

---

## Related Models

* **Related Models:** [Models sharing the same paradigm]
* **Alternative Models:** [Alternative algorithms for the same task]

---

## Capabilities

* **Instruction Tuned:** [Yes/No]
* **Reasoning:** [Yes/No]
* **Vision:** [Yes/No — include SigLIP 400M encoder, Pan & Scan, 896x896 input, 256 tokens per image]
* **Multilingual:** [Yes/No — include 140+ languages]
* **Tool Calling:** [Yes/No]
* **Function Calling:** [Yes/No — include dedicated function-calling head]
* **Thinking Model:** [Yes/No]
* **Context Window:** [Value from official spec]
* **Max Output Tokens:** [Value from official spec]

---

## Deployment

* **Supported Runtimes:** [List from official documentation]
* **Recommended Runtime:** [Primary recommendation with reason]
* **Quantizations:** [Supported formats from official docs — QAT int4, int4 block=32, SFP8]
* **Recommended Quantization:** [Best practice with justification]
* **CPU Supported:** [Yes/No]
* **GPU Supported:** [Yes/No]
* **MPS Supported:** [Yes/No]

---

## Hardware Requirements

For each variant, populate:
* **Minimum GPU Memory:** [From official documentation]
* **Recommended GPU Memory:** [From official documentation]
* **Minimum RAM:** [From official documentation]
* **Recommended RAM:** [From official documentation]
* **Disk Space:** [From official documentation]
* **Recommended GPU:** [From official documentation]

---

## Downloads

| Platform | URL | Official | Notes |
|----------|-----|----------|-------|
| [Platform] | [URL] | [Yes/No] | [Notes] |

---

## Runtime Compatibility

| Runtime | Supported | Minimum Version | Notes |
|---------|-----------|-----------------|-------|
| [Runtime] | [Yes/No] | [Version] | [Notes] |

---

## License

* **Name:** [License name — Gemma Terms of Use]
* **Commercial Use:** [Yes/No]
* **Modification:** [Yes/No]
* **Redistribution:** [Yes/No]
* **Attribution Required:** [Yes/No]
* **Notes:** [License constraints — note this is NOT Apache 2.0; Gemma 4 is Apache 2.0]

---

## Status

* **Release Date:** [From official release — March 12, 2025]
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

## Timeline

| Version | Release Date | Notes |
|---------|--------------|-------|
| [Version] | [Date] | [Notes] |

---

## Engineering Notes

### Inference Notes
* [Key inference optimization from official sources — include 5:1 local/global attention, KV cache reduction, QK-norm vs soft-capping, Pan & Scan overhead]

### Deployment Notes
* [Key deployment consideration from official sources — include single-GPU/TPU target, vision encoder memory overhead, quantized QAT checkpoints]

### Optimization Notes
* [Key optimization technique from official sources — include local attention sliding window 1024, RoPE rescaling for long context]

### Compatibility Notes
* [Key compatibility note from official sources — include Gemma 3 vs PaliGemma 2 differentiation, tokenizer compatibility with Gemini 2.0]

### Common Pitfalls
* [Common production pitfall with mitigation — include Pan & Scan compute overhead on non-square images, vision encoder VRAM spike, 1B context window limitation]

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

## Suggested Meta

* **Tags:** [Comma-separated tags]
* **Aliases:** [Alternative names]
* **Keywords:** [Search keywords]
* **Search Tokens:** [Search tokens]
* **Difficulty:** [Beginner/Intermediate/Advanced]
* **Domain:** [llm/vision/speech/etc.]
* **Engineering Area:** [deployment/inference/optimization/etc.]
* **Estimated Reading Time:** [Minutes]
* **Prerequisites:** [Required knowledge]
* **Recommended Next:** [Next resource]
* **Cross-Links:**
  * related_models: [model-ids]
  * related_packages: [package-ids]
  * related_workflows: [workflow-ids]
  * related_patterns: [pattern-ids]

---

# Schema Mapping Reference for JSON Conversion

After Perplexity generates the Markdown, use the `knowledge_ingestion_prompt (Finalize).md` to convert it to JSON. The following mapping rules ensure lossless transformation:

## Markdown to JSON Field Mapping

| Markdown Section | JSON Schema Field | Notes |
|------------------|-------------------|-------|
| Identity | `identity` | Object with family, variant, checkpoint, provider |
| Architecture | `architecture` | Object with architecture_type, transformer_type, etc. |
| Specifications | `specifications` | Object with parameter_count, hidden_size, etc. |
| File Formats | `formats` | Object with safetensors, gguf, awq, gptq, etc. |
| Ecosystem Support | `ecosystem` | Object with transformers, vllm, ollama, etc. |
| References | `references[]` | Array of ReferenceSchema objects |
| Related Models | `related_models[]` | Array of RelatedModelSchema objects |
| Capabilities | `capabilities` | Object with instruction_tuned, reasoning, etc. |
| Deployment | `deployment` | Object with supported_runtimes, quantizations, etc. |
| Hardware Requirements | `hardware` | Object with minimum_gpu_memory, etc. |
| Downloads | `downloads[]` | Array of DownloadSchema objects |
| Runtime Compatibility | `runtime_compatibility[]` | Array of RuntimeCompatibilitySchema objects |
| License | `license_info` | Object with name, commercial_use, etc. |
| Status | `status` | Object with release_date, maintenance_status, etc. |
| Engineering Snapshot | `engineering_snapshot` | Object with best_for, avoid_for, etc. |
| Engineering Notes | `engineering_notes` | Object with inference_notes, etc. |
| Timeline | `timeline[]` | Array of TimelineEntrySchema objects |

## Required Base Metadata Fields

The following fields must be populated in the JSON (from RegistryModelSchema):
* `id` - Use "gemma-3-family"
* `title` - "Gemma 3 Family"
* `slug` - "gemma-3-family"
* `description` - Brief description of the model family
* `name` - "Gemma 3 Family"
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
9. All variants are covered with appropriate specifications.
10. References include clear "Why Read" and "Expected Outcome" for each entry.