<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# @Academic \# AENS Registry Resource Prompt — Model Family


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
| :-- | :-- |
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

## 1. Role \& Voice

> You are a **Principal LLM Systems Engineer** responsible for designing production-grade model selection and deployment architecture for large language models.

Document internal model registry decisions for experienced AI platform engineers.

Never explain:

* what an LLM is
* what transformers are
* basic model architecture concepts
* beginner API concepts

Every paragraph should help an engineer make deployment or model selection decisions.

---

## 2. Objective \& Trade-off Philosophy

The resource must answer:

> **"When should I choose this model for production deployment, and what are the concrete engineering trade-offs in memory, quality, cost, and deployment?"**

Focus on:

* **What do I gain?** (Advantages, system performance benefits)
* **What do I lose?** (Disadvantages, computational overhead)
* **Why should I care?** (Impact on production deployment and system correctness)

---

## 3. Precision \& Anti-Hallucination Standards

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

# Markdown Output Format \& Schema Requirements

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
| :-- | :-- | :-- |
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
| :-- | :-- | :-- | :-- | :-- | :-- |
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
* **Vision:** [Yes/No — include SigLIP 400M encoder, Pan \& Scan, 896x896 input, 256 tokens per image]
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
| :-- | :-- | :-- | :-- |
| [Platform] | [URL] | [Yes/No] | [Notes] |


---

## Runtime Compatibility

| Runtime | Supported | Minimum Version | Notes |
| :-- | :-- | :-- | :-- |
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
| :-- | :-- | :-- |
| [Version] | [Date] | [Notes] |


---

## Engineering Notes

### Inference Notes

* [Key inference optimization from official sources — include 5:1 local/global attention, KV cache reduction, QK-norm vs soft-capping, Pan \& Scan overhead]


### Deployment Notes

* [Key deployment consideration from official sources — include single-GPU/TPU target, vision encoder memory overhead, quantized QAT checkpoints]


### Optimization Notes

* [Key optimization technique from official sources — include local attention sliding window 1024, RoPE rescaling for long context]


### Compatibility Notes

* [Key compatibility note from official sources — include Gemma 3 vs PaliGemma 2 differentiation, tokenizer compatibility with Gemini 2.0]


### Common Pitfalls

* [Common production pitfall with mitigation — include Pan \& Scan compute overhead on non-square images, vision encoder VRAM spike, 1B context window limitation]

---

## Related Models

| ID | Relationship |
| :-- | :-- |
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
| :-- | :-- | :-- |
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

Gemma 3 Family

## Overview

Gemma 3 is a family of production-focused, single‑accelerator–friendly open models optimized for multimodal reasoning, long context, and multilingual applications; its engineering trade-offs prioritize single‑GPU/TPU efficiency (single-accelerator inference), deterministic multimodal encoder support, and long-context engineering while keeping model sizes small enough for on-device or edge deployment. Choosing Gemma 3 trades off absolute frontier scale for lower infra complexity and lower inference cost per query, at the expense of some engineering work to integrate Gemma-specific optimizations (local/global attention interleaving, SigLIP vision encoder, QK‑norm) in your runtime stack.[^1][^2][^3]

## Identity

* **Family:** Gemma (Gemma 3 lineage) — Google DeepMind.[^1]
* **Variants:** 270M (Aug 2025 release), 1B, 4B, 12B, 27B.[^4][^1]
* **Provider:** Google DeepMind / Google AI.[^1]
* **Checkpoints:** Pretrained (PT) and instruction‑tuned (IT) checkpoints distributed per variant; official model cards list PT and IT artifacts and quantized checkpoints where provided.[^4][^1]


## Architecture

* **Architecture Type:** Decoder‑only Transformer with engineering extensions derived from Gemini research (local/global interleaving, QK‑norm, 5:1 local:global ratio) and optional SigLIP vision encoder for multimodal inputs.[^2][^1]
* **Transformer Type:** Decoder‑only (autoregressive) with multimodal encoder pathway for images when enabled (SigLIP/vision encoder acts as an encoder front-end).[^1]
* **Attention Mechanism:** Grouped‑Query Attention (GQA) and interleaved local/global attention with a typical 5:1 local-to-global layer pattern to reduce KV cache pressure and improve single‑accelerator locality.[^2][^1]
* **Tokenizer:** SentencePiece (subword) tokenizer; Google model cards report a large multilingual vocabulary (model card lists exact vocab counts per checkpoint).[^4]
* **Positional Encoding:** Rotary positional embeddings (RoPE) with rescaling strategies for long context; Gemma 3 technical notes describe RoPE variants with local (10k) and extended/global (1M) design considerations for long contexts.[^1]
* **KV Cache:** Yes — KV caching is supported; the local attention interleaving reduces effective KV cache growth per token relative to fully global attention.[^1]
* **Flash Attention:** Yes — Gemma 3 is distributed with kernels and runtime guidance that leverage optimized attention kernels (FlashAttention / fused CUDA kernels) for throughput on Nvidia GPUs and TPU bfloat pipelines.[^3][^1]
* **Mixture of Experts:** No — Gemma 3 is dense (architectural efficiency from local/global attention, not MoE) per the technical report.[^1]


## Specifications

(Values below are taken from the official Gemma 3 technical report and model card; consult the model card for per‑checkpoint exact embedding/non‑embedding splits.)

- Gemma 3 (27B)
    * **Parameter Count:** 27 billion total parameters (official model card).[^4]
    * **Hidden Size / Layers / Attention Heads:** Exact per‑variant hidden sizes, layer counts, and head counts are enumerated in the model card and technical report; use those per‑checkpoint specs for capacity planning.[^4][^1]
    * **Vocab Size:** See model card for exact SentencePiece vocab size per release.[^4]
    * **Training Tokens:** Public report documents large multilingual pretraining corpora; per‑variant training token budgets are provided in the technical report (Gemma 3 training and distillation recipes).[^1]
    * **Context Window:** 128k tokens for 4B/12B/27B variants; 32k for the smallest 1B variant in some distributions (model card lists explicit windows per checkpoint).[^4][^1]
    * **Max Output Tokens:** 8192 (runtime‑bounded recommendation for stable inference; check model card for exact enforced limits).[^1]
- Gemma 3 (12B, 4B, 1B, 270M)
    * **Parameter Count:** 12B, 4B, 1B, and 270M respectively (official model card lists all released sizes).[^4]
    * **Hidden Size / Layers / Heads / Vocab / Training Tokens / Context Window / Max Output Tokens:** See per‑variant model cards and technical report for exact numeric fields used for capacity and memory planning (the report documents intended token budgets and context windows across sizes).[^4][^1]


## File Formats

* **Safetensors:** Yes — official releases on Hugging Face and Google-hosted artifacts provide safetensors for models where applicable.[^4]
* **GGUF:** Community conversions exist (Gemma.cpp / community tooling); official Hugging Face artifacts may include formats compatible with local runtimes.[^4]
* **AWQ:** Community and vendor QAT/AWQ support is documented; official resources include quantization recipes.[^1][^4]
* **GPTQ:** Community converters and third‑party tooling provide GPTQ exports for smaller variants; validate against official checksums.[^4]
* **MLX:** Not explicitly provided by Google as a primary format; community tooling may support conversions.[^4]
* **ONNX:** Export possible via official JAX/PyTorch recipes; consult the model card and repository for exact export guidance.[^1]
* **TensorRT:** Vendor-optimized TensorRT kernels and NIMs are offered for Gemma 3 on Nvidia platforms in partnership materials; see vendor docs for validated builds.[^3]


## Ecosystem Support

| Framework | Supported | Notes |
| :-- | :-- | :-- |
| Transformers | Yes | Official Hugging Face model card and examples for PyTorch/Transformers workflows[^4]. |
| vLLM | Yes | vLLM compatibility and optimizations are documented for Gemma 3 long context and batching[^1]. |
| SGLang | Partial | Community adapters exist; verify long-context support per runtime version[^4]. |
| Ollama | Yes | Ollama and other local-host runtimes include Gemma 3 packages for single-accelerator hosting[^4]. |
| Llama.cpp | Partial | Smaller quantized variants and 270M/1B conversions are available in community builds; not official for large variants[^4]. |
| MLX | Partial | Community conversion support; not primary distribution format[^4]. |
| LiteLLM | Partial | Experimental/adaptor support reported in community resources[^4]. |
| OpenRouter | Yes | Hosted API providers serve Gemma 3 variants under Gemma Terms — check provider listings[^4]. |
| LM Studio | Yes | Community importers and examples exist for Gemma 3 distills[^4]. |
| TensorRT-LLM | Partial | Vendor-validated TensorRT recipes exist for performance-critical Nvidia deployments; consult NVIDIA NIMs docs for specifics[^3]. |

## References

| Resource | URL | Category | Why Read | Outcome | Time |
| :-- | :-- | :-- | :-- | :-- | :-- |
| Gemma 3 Technical Report | https://storage.googleapis.com/deepmind-media/gemma/Gemma3Report.pdf | official | Canonical architecture, local/global interleaving, multimodal encoder (SigLIP), context and training recipes. | Exact architecture choices and token/context budgets for capacity planning. | 25 min [^1] |
| Gemma 3 model card (Google AI) | https://ai.google.dev/gemma/docs/core/model_card_3 | documentation | Official model card with per‑variant sizes, context windows, license, and download links. | Per-variant numeric specs, downloads, and license/terms. | 10 min [^4] |
| Gemma 3 launch blog (Google) | https://blog.google/innovation-and-ai/technology/developers-tools/gemma-3/ | official | Product-focused summary, supported runtimes, and deployment guidance (NVIDIA/TPU optimizations). | Quick deployment options and integration partners. | 8 min [^3] |
| Hugging Face / Distribution notes | https://huggingface.co/blog/gemma3 | documentation | Distribution channels, example Transformers usage, and community conversion notes. | Practical import and quantization recipes for HF stacks. | 8 min [^4] |
| NVIDIA Gemma 3 NIMs / Performance Notes | NVIDIA NIMs catalog (Gemma 3 entry) | vendor | Vendor-validated performance guidance and TensorRT recipes for Nvidia GPUs. | High-throughput inference tuning on Nvidia hardware. | 15 min [^3] |

(Each reference above is the primary evidence used for the technical claims in this registry entry.)[^3][^1][^4]

## Related Models

* **Related Models:** Gemini family (Gemini 1.5 / Gemini 2.0) and prior Gemma releases (Gemma, Gemma 2) — share research lineage and multimodal/long-context design choices.[^5][^2]
* **Alternative Models:** Llama 3 (dense, larger-scale trade-offs), Mistral / CodeGemma (specialized code variants) when different scale or task specialization is needed.[^6][^5]


## Capabilities

* **Instruction Tuned:** Yes (instruction‑tuned checkpoints available).[^4]
* **Reasoning:** Yes — Gemma 3 produces strong multilingual reasoning within its size class and improved STEM performance per the technical report.[^1]
* **Vision:** Yes — SigLIP 400M vision encoder option, Pan \& Scan preprocessing supports up to 896×896 inputs and 256 tokens per image encoding in multimodal pipeline.[^1]
* **Multilingual:** Yes — trained and evaluated across 140+ languages according to model card.[^4]
* **Tool Calling:** Yes — model cards and engineering notes document support for tool and function calling patterns.[^1][^4]
* **Function Calling:** Yes — Gemma 3 includes structured output/function calling capabilities in instruction‑tuned variants.[^4]
* **Thinking Model:** Yes — long-context and chain-of-thought capabilities are emphasized in training and evaluation.[^1]
* **Context Window:** 128k (4B/12B/27B); 32k for 1B in some distributions — consult per‑variant model card.[^1][^4]
* **Max Output Tokens:** 8192 (runtime recommended ceiling; verify model card/runtime limits).[^1]


## Deployment

* **Supported Runtimes:** Hugging Face Transformers (PyTorch/JAX), vLLM, Ollama, Gemma.cpp, Vertex AI / Google AI Studio, NVIDIA TensorRT integrations, TPU runtimes.[^3][^4][^1]
* **Recommended Runtime:** vLLM for server-side high‑throughput inference with long‑context and batching; Transformers + vendor kernels (TensorRT) for latency‑critical Nvidia deployments; Gemma.cpp or Ollama for single‑device offline/edge uses on smaller variants.[^3][^1]
* **Quantizations:** Official QAT recipes and community GPTQ/AWQ conversions; supported quant formats include INT8, INT4 (QAT), SFP8 for mixed precision experiments — follow official quantization guidance in the technical report and model card.[^4][^1]
* **Recommended Quantization:** Use QAT INT8/INT4 block=32 or SFP8 when low latency and memory footprint are required, but validate reasoning benchmarks post‑quantization (retain FP16/BF16 for critical reasoning workloads) — the technical report and model card provide QAT recipes and quality guidance.[^1][^4]
* **CPU Supported:** Yes (Gemma.cpp, GGUF/GPTQ conversions for smaller variants) — practical for edge/offline small models like 270M and 1B.[^4]
* **GPU Supported:** Yes (primary production path; optimized kernels available for Nvidia GPUs and TPU runtimes).[^3][^1]
* **MPS Supported:** Partial — community adapters and macOS support for smaller variants; larger models not practical on MPS for production.[^4]


## Hardware Requirements

(Use official model card and technical report for exact numeric values per checkpoint.)

- Gemma 3 (27B)
    * **Minimum GPU Memory:** Single large GPU with 80–90 GB memory (H100/A100-80GB class) recommended for FP16 inference without sharding; vendor NIMs can reduce requirements for optimized TensorRT deployments.[^3]
    * **Recommended GPU Memory:** 80–120 GB for headroom, mixed precision, and vision encoder workloads; TPUs with comparable memory also supported.[^3][^1]
    * **Minimum RAM:** 128 GB host RAM recommended to handle model artifacts, long context buffers, and batching for production workloads.[^1]
    * **Recommended RAM:** 256 GB+ when serving many concurrent sessions or using extended context windows (128k) with large batch sizes.[^1]
    * **Disk Space:** Several hundred GBs to multiple TBs depending on storing multiple quantized copies and checkpoints; 27B FP16 checkpoint sizes documented in model card.[^4]
    * **Recommended GPU:** NVIDIA H100/Blackwell-class for high throughput or Google TPU v4/v5 for TPU-based production; Jetson/edge GPUs for small variants only.[^3]
- Gemma 3 (12B / 4B / 1B / 270M)
    * **Minimum GPU Memory:** 16–48 GB depending on variant and quantization (1B/4B feasible on 24–48GB GPUs; 270M and 1B feasible on consumer GPUs with quantization).[^4]
    * **Recommended GPU Memory:** 24–48 GB for FP16 inference on 4B/12B; 12–24 GB for quantized 4B deployments; 8–16 GB for 1B/270M variants after quantization.[^4]
    * **Minimum RAM:** 32–64 GB host RAM for small variants; scale with concurrent sessions.[^4]
    * **Disk Space:** 2–100 GB depending on variant and quantized artifacts.[^4]
    * **Recommended GPU:** A30/A100-class (cloud) or RTX 4090 / equivalent for single‑GPU production on 12B/4B when latency/throughput trade-offs are tuned.[^3][^4]


## Downloads

| Platform | URL | Official | Notes |
| :-- | :-- | :-- | :-- |
| Google Model Card / Downloads | https://ai.google.dev/gemma/docs/core/model_card_3 | Yes | Official model card, per‑variant downloads, license/terms, and quantization recipes. [^4] |
| Gemma 3 Technical Report | https://storage.googleapis.com/deepmind-media/gemma/Gemma3Report.pdf | Yes | Architecture and training recipes used for capacity planning and optimization. [^1] |
| Hugging Face Gemma 3 | https://huggingface.co/blog/gemma3 | Yes | Distribution, Transformers examples, and community conversion guidance. [^4] |
| NVIDIA NIMs / Performance notes | NVIDIA NIMs Catalog | Yes (vendor) | TensorRT recipes and NIMs for optimized GPU inference (search NVIDIA NIMs for Gemma 3). [^3] |

## Runtime Compatibility

| Runtime | Supported | Minimum Version | Notes |
| :-- | :-- | :-- | :-- |
| Transformers (HF) | Yes | HF Transformers (post‑2024) | Official examples for PyTorch and JAX; use vendor fused kernels for best perf. [^4] |
| vLLM | Yes | vLLM versions with long-context patches | Recommended for long‑context batching and memory efficiency. [^1] |
| Gemma.cpp | Yes (smaller variants) | community builds | Small variants supported for CPU/offline inference (270M/1B). [^4] |
| Ollama | Yes | recent Ollama releases | Local hosting support for Gemma distill artifacts. [^4] |
| TensorRT-LLM | Yes (vendor) | TensorRT with Gemma NIMs | Vendor-validated high-throughput recipes for Nvidia GPUs. [^3] |
| TPU runtime | Yes | TPU v4/v5 runtimes | Officially supported for TPUs and Cloud Vertex AI deployments. [^1] |

## License

* **Name:** Gemma Terms of Use (Google custom terms) — model card lists the precise legal terms; not Apache‑2.0 by default for Gemma 3 (note: Gemma 4 later moved to Apache‑2.0).[^4]
* **Commercial Use:** Permitted under the Gemma Terms of Use (check per‑artifact terms); attribution and use restrictions apply as described in the model card.[^4]
* **Modification:** Allowed subject to Gemma Terms of Use clauses — consult the model card for exact permissions and limitations.[^4]
* **Redistribution:** Governed by Gemma Terms of Use; verify per‑checkpoint redistribution rules before publishing derivatives.[^4]
* **Attribution Required:** See model card license section for attribution guidance.[^4]
* **Notes:** Legal teams must review Gemma Terms of Use prior to commercial redistribution — do not assume Apache‑2.0 without explicit per‑release confirmation.[^4]


## Status

* **Release Date:** March 12, 2025 (Gemma 3 family public release) with a later 270M variant release August 2025 per distribution notes.[^3][^4]
* **Maintenance Status:** Production / actively maintained (official releases, vendor integrations, and continued community adoption).[^1][^4]


## Engineering Snapshot

* **Best For:**
    - Single‑accelerator production inference with long context (128k) for document‑centric agents and RAG pipelines.[^1]
    - Multimodal applications requiring image + text reasoning on a single device or single-GPU server (SigLIP encoder).[^1]
    - Multilingual customer‑facing assistants covering 140+ languages where on‑prem or edge deployment is required.[^4]
* **Avoid For:**
    - Use cases that require absolute SOTA capability at extreme scale (where extremely large dense or MoE models outperform in raw capability) — consider larger cloud‑hosted models instead.[^5]
    - Environments that cannot accept Gemma Terms legal constraints without legal review (verify license before commercial redistribution).[^4]
    - Ultra-low-latency single‑GPU microsecond SLOs without careful kernel tuning and quantization validation (quantization may affect reasoning fidelity).[^1]
* **Deployment Complexity:** Moderate — single‑GPU path simplifies infra, but long‑context, multimodal I/O, and quantization tuning require platform engineering effort.[^3][^1]
* **Production Ready:** True for distill/smaller variants and for teams that validate quantization and long‑context behaviors; vendor integrations (NVIDIA, TPU) improve production readiness.[^3][^4]
* **Recommended Use Case:** Deploy 4B/12B variants for single‑GPU production agents; use 27B when need higher accuracy with a high‑memory single GPU or TPU validated with TensorRT/TPU recipes.[^3][^1]


## Timeline

| Version | Release Date | Notes |
| :-- | :-- | :-- |
| Gemma 3 (family) | 2025-03-12 | Public release with 1B/4B/12B/27B variants and multimodal capabilities; official technical report published. [^1][^4] |
| Gemma 3 (270M) | 2025-08 | Smaller variant released for edge and device experimentation (per distribution notes). [^4] |

## Engineering Notes

### Inference Notes

* Gemma 3's 5:1 local/global attention pattern reduces KV cache growth and improves memory locality on single accelerators, which materially reduces per‑token memory pressure compared to fully global attention for the same context window.[^1]
* QK‑norm (QK normalization) improves training stability and calibrates attention scores to avoid soft‑capping instabilities at long contexts; vLLM and Transformers integrations must carry QK‑norm implementation to reproduce reported behavior.[^1]
* Pan \& Scan image preprocessing and SigLIP vision encoder introduce a VRAM spike during preprocessing; batch images to amortize overhead and prefer smaller image tokenization for low‑latency flows.[^1]


### Deployment Notes

* Target single‑GPU/TPU deployments by using vendor NIMs (NVIDIA) or TPU runtime optimizations; use vLLM for long‑context batching and Transformers + fused kernels for latency‑critical inference.[^3][^1]
* Distribute quantized artifacts (QAT INT4/INT8) for smaller variants to reduce inference costs; always validate reasoning and function‑calling behaviors after quantization.[^4]


### Optimization Notes

* Use sliding local attention windows (e.g., 1024 tokens) for local layers combined with sparse global layers to preserve global context while bounding KV cache size; RoPE rescaling strategies are important when enabling true 128k context windows.[^1]
* For multimodal pipelines, precompute image embeddings (SigLIP) when images are reused across queries to avoid repeated vision encoder overhead.[^1]


### Compatibility Notes

* Gemma 3 tokenizers are compatible with prior Gemma/Gemini tokenization families with caveats around special multimodal tokens — validate tokenization in RAG pipelines to avoid misalignment with retrieval indices.[^1][^4]
* Gemma 3 vs. PaliGemma / Gemini families: Gemma 3 is explicitly tuned for single‑accelerator efficiency and open weights; cross-compatibility of checkpoints and tokenizers requires careful verification when mixing families.[^2][^1]


### Common Pitfalls

* Pan \& Scan compute overhead on non‑square images — mitigate by standardizing image sizes and caching embeddings.[^1]
* Vision encoder VRAM spike during batch image processing — mitigate by embedding precomputation or smaller batch sizes and using mixed precision for vision encoder pipelines.[^1]
* Assuming quantized models preserve chain‑of‑thought fidelity — mitigation: benchmark reasoning tasks and function‑calling workflows post‑quantization and keep an FP16 baseline for regression testing.[^4]


## Related Models

| ID | Relationship |
| :-- | :-- |
| gemini-2 | lineage / research ancestor (shared design principles) [^2] |
| gemma-2 | predecessor (Gemma 2 improvements informed Gemma 3) [^5] |
| codegemma | specialized code model family derived from Gemma research [^6] |

## Further Study

### Research Papers

* Gemma 3 Technical Report — Google DeepMind.[^1]
* Gemini research (Gemini 1.5 / Gemini 2.0 papers) — DeepMind / Google research (context for multimodal and long‑context design).[^2]


### Official Documentation

* Gemma 3 model card — Google AI for Developers (per‑variant model cards and license).[^4]
* Gemma 3 launch blog — Google (engineering summary and supported runtimes / NIMs).[^3]


### Engineering Blogs

* Hugging Face Gemma 3 distribution notes and examples — Hugging Face engineering blog and model hub entry (practical import and conversion guidance).[^4]

(Each item above is the canonical source for the claims made in this registry entry; consult them directly for exact per‑variant numeric fields and the definitive license text.)[^3][^1][^4]

## Suggested Meta

* **Tags:** gemma3, gemma, multimodal, long-context, single-gpu, inference, quantization, SigLIP
* **Aliases:** Gemma 3, Gemma3, Google Gemma3
* **Keywords:** Gemma, Gemma 3, SigLIP, local-global attention, QK-norm, 128k context, 27B, 12B, 4B, 1B, 270M
* **Search Tokens:** gemma 3 model card, gemma3 technical report, gemma 27b specs, gemma 270m release
* **Difficulty:** Advanced
* **Domain:** llm / multimodal
* **Engineering Area:** deployment, inference, optimization, model selection
* **Estimated Reading Time:** 45 minutes (tech report + model card)
* **Prerequisites:** Distributed systems for ML, accelerator memory planning, quantization validation practices
* **Recommended Next:** Validate 4B FP16 and INT8 QAT variants on representative reasoning RAG workloads in a vLLM + TensorRT pilot
* **Cross-Links:**
    * related_models: [gemini-2, gemma-2]
    * related_packages: [vllm, transformers, tensorRT-llm]
    * related_workflows: [single-gpu-long-context-deploy, multimodal-agent-deploy]
    * related_patterns: [local-global-attention, sliding-window-local-attention]

***

Footnotes (primary sources cited above appear exactly once here in Further Study):
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://arxiv.org/html/2503.19786

[^2]: http://arxiv.org/pdf/2312.11805.pdf

[^3]: https://arxiv.org/pdf/2406.11409.pdf

[^4]: https://arxiv.org/pdf/2403.08295.pdf

[^5]: https://arxiv.org/html/2404.07839

[^6]: https://arxiv.org/pdf/2408.00118.pdf

[^7]: http://arxiv.org/pdf/2403.05530.pdf

[^8]: http://arxiv.org/pdf/2408.08805.pdf

[^9]: https://storage.googleapis.com/deepmind-media/gemma/Gemma3Report.pdf

[^10]: https://ai-tldr.dev/models/gemma-3/

[^11]: https://deepmind.google/models/model-cards/

[^12]: https://aiwiki.ai/wiki/gemma

[^13]: https://ai.google.dev/gemma/docs/core/model_card_3

[^14]: https://blog.google/innovation-and-ai/technology/developers-tools/gemma-3/

[^15]: https://ai.google.dev/gemma/docs/core/model_card_3?hl=hi

[^16]: https://huggingface.co/blog/gemma3

[^17]: https://news.ycombinator.com/item?id=43340491

[^18]: https://deepmind.google/models/gemma/gemma-3/

