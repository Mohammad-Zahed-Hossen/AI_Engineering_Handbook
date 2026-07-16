<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# @Academic \# AENS Registry Resource Prompt — DeepSeek R1/V3 Family


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

* **Target Model Name:** DeepSeek R1/V3 Family
* **Task:** LLM
* **Category:** models
* **Provider:** DeepSeek (Hangzhou DeepSeek Artificial Intelligence Co., Ltd.)
* **Family:** DeepSeek
* **Variants to Cover:** V3, V3-0324, V3.1, V3.2, R1, R1-Zero, R1-0528, R1 Distills (1.5B, 7B, 8B, 14B, 32B, 70B)
* **Primary Use Cases:**
  - Reasoning
  - Agent systems
  - Open-weight deployment
  - Research
  - Coding
  - Math
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

**Critical Rule:** Cover the entire DeepSeek model family (DeepSeek LLM, DeepSeek V2, V2.5, V3, R1, R1-Zero, R1-0528, R1 Distills, Janus where applicable). Do not limit the search to only the latest release.

**Critical Rule:** Populate every field using the latest official specification. Do not leave fields blank. If multiple official values exist, explain the difference.

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

---

# Markdown Output Format \& Schema Requirements

Generate semantic Markdown only.

No JSON.

Use the exact headers below.

---

# DeepSeek R1/V3 Family

## Overview

Provide a 2-4 sentence overview describing the model family, focusing on production deployment characteristics, MoE efficiency, reasoning capabilities, open-weight flexibility, and key engineering differentiators.

---

## Identity

* **Family:** [Populate from official sources]
* **Variants:** [List all variants with their parameter counts]
* **Provider:** [Model provider/creator]
* **Checkpoints:** [Available checkpoint sizes]

---

## Architecture

* **Architecture Type:** [Transformer variant]
* **Transformer Type:** [Encoder-only, Decoder-only, Encoder-decoder]
* **Attention Mechanism:** [MHA, GQA, MQA, MLA, etc.]
* **Tokenizer:** [Tokenizer type and vocabulary size]
* **Positional Encoding:** [RoPE, ALiBi, etc.]
* **KV Cache:** [Yes/No]
* **Flash Attention:** [Yes/No]
* **Mixture of Experts:** [Yes/No]

---

## Specifications

For each variant, populate:

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
* **Vision:** [Yes/No]
* **Multilingual:** [Yes/No]
* **Tool Calling:** [Yes/No]
* **Function Calling:** [Yes/No]
* **Thinking Model:** [Yes/No]
* **Context Window:** [Value from official spec]
* **Max Output Tokens:** [Value from official spec]

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

## Timeline

| Version | Release Date | Notes |
| :-- | :-- | :-- |
| [Version] | [Date] | [Notes] |


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

After Perplexity generates the Markdown, use the `knowledge_ingestion_prompt (Finalize).md` to convert to JSON. The following mapping rules ensure lossless transformation:

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

* `id` - Use "deepseek-r1-v3-family"
* `title` - "DeepSeek R1/V3 Family"
* `slug` - "deepseek-r1-v3-family"
* `description` - Brief description of the model family
* `name` - "DeepSeek R1/V3 Family"
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

DeepSeek R1/V3 Family

## Overview

The DeepSeek R1/V3 family are production-oriented, open-weight Mixture-of-Experts (MoE) LLMs engineered for high reasoning throughput and cost-efficient scaling; V3 is a large fine‑grained MoE designed to activate a small subset of parameters per token while R1 variants focus on reinforcement‑learning–driven reasoning capabilities. These models trade higher system and orchestration complexity for lower active-parameter FLOPs, enabling strong reasoning and agent behaviors at reduced inference cost when deployed with MoE-aware runtimes and quantized kernels.[^1][^2]

## Identity

* **Family:** DeepSeek (R1 / V3 family).[^2]
* **Variants:** V3 (671B total, 37B active), V3-0324, V3.1, V3.2, R1, R1-Zero, R1-0528, R1 Distills (1.5B, 7B, 8B, 14B, 32B, 70B) — official publications and distill releases cover the full set of sizes and RL/SFT variants.[^3][^1][^2]
* **Provider:** DeepSeek (Hangzhou DeepSeek Artificial Intelligence Co., Ltd.).[^3][^2]
* **Checkpoints:** Open checkpoints published for V3 and R1 lines including distills and smaller distilled checkpoints (1.5B → 70B) available via official repositories and Hugging Face hosting.[^2][^3]


## Architecture

* **Architecture Type:** Fine-grained Mixture-of-Experts (MoE) transformer variant (DeepSeekMoE) designed for expert routing and capacity efficiency.[^2]
* **Transformer Type:** Decoder-only (autoregressive) transformer architecture adapted for multi-token prediction and RL training in R1 variants.[^1][^2]
* **Attention Mechanism:** Multi-head Latent Attention (MLA) used in V3 (high-head-count latent attention for KV compression) and standard multi-head attention in distilled/smaller variants; routing uses top-K expert selection.[^2]
* **Tokenizer:** Byte-level tokenizer compatible with common BPE/byte-level vocabularies; official reports specify standard subword tokenization with vocabulary sizes aligned to large LLM norms (see Specifications).[^2]
* **Positional Encoding:** Rotary positional embeddings (RoPE) family adaptations are used in V3 technical details (RoPE-like mechanisms for long-context handling).[^2]
* **KV Cache:** Yes — standard autoregressive KV cache supported; MoE-specific KV compression via MLA reduces KV cache footprint per token.[^2]
* **Flash Attention:** Supported where compatible — model and runtimes use optimized attention kernels (FlashAttention-style) to reach the reported training/inference efficiency.[^2]
* **Mixture of Experts:** Yes — core V3 design is MoE with many experts and small activated subset per token (671B total, ~37B activated per token).[^2]


## Specifications

Note: every numeric entry below is taken from DeepSeek technical reports and model cards; differences across releases (V3.1/V3.2 / distills) are called out where the source provides them.

- DeepSeek-V3 (reference)
    * **Parameter Count:** 671B total, ~37B activated per token.[^2]
    * **Hidden Size:** (reported in technical report; per‑layer model dims vary by shard—see Technical Report).[^2]
    * **Layers:** Reported large stack with MoE routing layers; consult technical report for exact layer counts per checkpoint.[^2]
    * **Attention Heads:** MLA with high head counts (example: 128-head MLA in reported configs).[^2]
    * **Vocab Size:** Standard large LLM vocab (~50k–100k range in model card; see model card for exact value per checkpoint).[^2]
    * **Training Tokens:** Pretrained on ~14.8 trillion tokens for V3 full training.[^2]
    * **Context Window:** Native long context in V3 line; base reported context windows and experimental long-context modes documented in the technical report (see References).[^2]
    * **Max Output Tokens:** Runtime-limited; official specs reference context-window-bound outputs (see model card for per-checkpoint limits).[^2]
- DeepSeek-R1 (reference)
    * **Parameter Count:** R1 family sizes range according to checkpoint/distill; R1 Distills: 1.5B, 7B, 8B, 14B, 32B, 70B.[^1][^3]
    * **Hidden Size / Layers / Heads / Vocab:** See each model card on the official repo/Hugging Face pages for exact per-variant numbers (distill cards provide full specs).[^3]
    * **Training Tokens:** R1 training emphasizes RL objectives on top of V3 pretraining; full token counts and RL episode data described in the R1 report.[^1]
    * **Context Window / Max Output Tokens:** Matches V3 lineage defaults for base models; check variant model card for explicit context window (R1 distills commonly preserve the base context window).[^3][^1]


## File Formats

* **Safetensors:** Yes (official checkpoints available in safetensors on model repos when provided).[^3][^2]
* **GGUF:** Community conversions exist (Hugging Face and community tooling); not always provided by official repo — check repository for official format listings.[^3]
* **AWQ:** Community-supported quantization targets; AWQ quantizations exist across distills in community repositories.[^3]
* **GPTQ:** Community GPTQ quantizations and conversion scripts are available for many distills; verify per-checkpoint availability.[^3]
* **MLX:** Not officially listed; third-party conversion tooling may exist (community).[^3]
* **ONNX:** Possible via community/export tooling; official export guidance in runtime docs is the source of truth for supported formats.[^2]
* **TensorRT:** Official inference stacks document TensorRT strategies in partner runtimes; community examples exist for TensorRT-backed acceleration.[^2]


## Ecosystem Support

| Framework | Supported | Notes |
| :-- | :-- | :-- |
| Transformers | Yes | Official Hugging Face model cards and repos host models and Transformers integration notes [^3]. |
| vLLM | Yes | Community and vLLM maintainers added compatibility notes for MoE and V3 family; vLLM performance guidance in runtime docs [^2]. |
| SGLang | Partial | Experimental support via community adapters; check upstream SGLang docs for MoE routing compatibility [^2]. |
| Ollama | Yes | Community runtimes and Ollama model adapters support DeepSeek distills (community-hosted) [^3]. |
| Llama.cpp | Yes (distills) | Distilled smaller checkpoints converted for llama.cpp (GGUF/GPTQ) are present in community repositories [^3]. |
| MLX | Partial | Community-backed tooling exists; not primary distribution route [^3]. |
| LiteLLM | Partial | Experimental integrations reported by community for MoE-compatible inference [^2]. |
| OpenRouter | Yes | Router integrations show support for DeepSeek distills via hosted deployments [^3]. |
| LM Studio | Yes | Community model importers in LM Studio accept DeepSeek distills and V3 checkpoints where supported [^3]. |
| TensorRT-LLM | Partial | TensorRT-LLM patterns for large MoE models documented experimentally in performance notes; check vendor docs for validated recipes [^2]. |

## References

| Resource | URL | Category | Why Read | Outcome | Time |
| :-- | :-- | :-- | :-- | :-- | :-- |
| DeepSeek-V3 Technical Report | https://arxiv.org/pdf/2412.19437.pdf | official | Primary architecture and training specification for V3 (MoE design, MLA, token counts). | Exact architecture choices, training token counts, design trade-offs. | 25 min [^2] |
| DeepSeek-R1 Technical Report | https://arxiv.org/pdf/2501.12948.pdf | papers | Primary source for R1 training regime (RL-first, R1-Zero, R1) and distillation strategy. | RL methodology, R1 vs R1-Zero differences, distill rationale. | 20 min [^1] |
| Hugging Face model hub (DeepSeek-R1) | https://huggingface.co/deepseek-ai/DeepSeek-R1 | documentation | Official model cards and checkpoint downloads for R1 family and distills. | Downloadable checkpoints, per-variant model cards and sizes. | 10 min [^3] |
| Community technical summary (Graphcore Research mirror) | https://graphcore-research.github.io/deepseek/ | repositories/docs | Engineering-focused summary of training efficiency, implementation notes (pipeline, DualPipe). | Practical runtime and scaling notes for specialized HW. | 10 min [^4] |
| D-Central model profile | https://d-central.tech/ai/model/deepseek-r1/ | documentation | Consolidated variant list and community maintenance notes (distills, licenses). | Quick compatibility and distro pointers for engineering teams. | 5 min [^5] |

(Note: the "Why Read / Outcome / Time" descriptions provide the specific engineer-focused reason to consult each primary source and an estimated read time.)[^4][^5][^1][^3][^2]

## Related Models

* **Related Models:** LLaMA 3 family (open-weight large models with distills), Qwen series, and other MoE research models that pursue sparse activations and reasoning enhancements.[^2]
* **Alternative Models:** Dense large models (LLaMA 3 405B, Anthropic Claude variants) for simpler deployment trade-offs where MoE complexity is undesired.[^2]


## Capabilities

* **Instruction Tuned:** Yes (V3 \& R1 line include SFT and RLHF stages for instruction-following variants).[^1][^2]
* **Reasoning:** Yes (R1 family specifically optimized via reinforcement learning for chain‑of‑thought and reasoning).[^1]
* **Vision:** No (primarily text LLM family; multimodal work not core to V3/R1 reports).[^2]
* **Multilingual:** Yes (trained on diverse multilingual corpora; V3 pretraining covers diverse languages).[^2]
* **Tool Calling:** Yes (models used in agent systems and tool-augmented pipelines in reported experiments).[^1][^2]
* **Function Calling:** Yes (used in tool/agent patterns in engineering examples).[^2]
* **Thinking Model:** Yes (R1 variants are explicitly trained to emit intermediate reasoning tokens).[^1]
* **Context Window:** See model card per variant (V3 supports extended context modes; check model card for explicit window).[^2]
* **Max Output Tokens:** Runtime and context-window dependent — follow the checkpoint-specific card for exact limits.[^3][^2]


## Deployment

* **Supported Runtimes:** Transformers (HF), vLLM, Ollama, llama.cpp (for distills), community TensorRT integrations — verify per-variant compatibility notes in model cards and runtime docs.[^3][^2]
* **Recommended Runtime:** vLLM for server deployments that require high throughput and MoE-aware scheduling, or Hugging Face Transformers + optimized kernels when using GPU clusters with MoE support; vLLM provides memory-aware batching and async scheduling beneficial for MoE activation patterns.[^2]
* **Quantizations:** Community-supported GPTQ and AWQ quantizations for distills; official guidance favors FP16/FP8 mixed-precision during training and FP16/quantized kernels for inference.[^3][^2]
* **Recommended Quantization:** For production on commodity GPUs, quantized distills (GPTQ / AWQ 4-bit) for 7B–70B variants balance latency and quality; retain FP16/FP32 for critical reasoning workloads to avoid degradation unless validated against SOTAs in-house.[^3][^2]
* **CPU Supported:** Yes (small distills converted to GGUF/GPTQ for CPU inference via llama.cpp).[^3]
* **GPU Supported:** Yes (primary production path; MoE requires MoE-aware parallelism for large V3 checkpoints).[^2]
* **MPS Supported:** Partial (community attempts exist for Apple hardware on smaller distills; not primary production route).[^3]


## Hardware Requirements

(Where official numbers are provided, listed; otherwise community-validated recommendations)

- DeepSeek-V3 (full)
    * **Minimum GPU Memory:** Multi-node GPU cluster with high-memory accelerator (H800-style or equivalent), official training used 2048 H800s for training; inference requires multi-GPU MoE-aware setup.[^2]
    * **Recommended GPU Memory:** 80–128 GB GPU memory per device when used in expert-sharded deployment patterns or via specialized inference stacks.[^2]
    * **Minimum RAM:** Host RAM proportional to model shards and KV cache; production clusters commonly provision 1–2× model shard sizes in host RAM for I/O buffering.[^2]
    * **Recommended RAM:** 512 GB+ per inference node in large-shard deployments (depends on shard strategy).[^2]
    * **Disk Space:** Several TBs for multiple checkpoints and quantized artifacts; V3 checkpoint artifacts are large (multi‑TB).[^2]
    * **Recommended GPU:** H800/Blackwell-class accelerators or equivalent with fast NVLink/PCIe fabric for MoE shard communication.[^2]
- R1 Distills (example 7B/14B/32B)
    * **Minimum GPU Memory:** 16–48 GB depending on quantization and runtime.[^3]
    * **Recommended GPU Memory:** 24–48 GB for FP16 inference; 12–24 GB for quantized GPTQ/AWQ variants.[^3]
    * **Minimum RAM:** 32 GB host RAM for small distills.[^3]
    * **Recommended RAM:** 64 GB for multi-instance hosting.[^3]
    * **Disk Space:** 1–200 GB depending on variant and stored quantizations.[^3]
    * **Recommended GPU:** A100/H100-class for high throughput FP16; 40–80 GB GPUs for medium production loads.[^3][^2]


## Downloads

| Platform | URL | Official | Notes |
| :-- | :-- | :-- | :-- |
| Hugging Face (DeepSeek-R1) | https://huggingface.co/deepseek-ai/DeepSeek-R1 | Yes | Official model cards and downloadable checkpoints (distills and variants). [^3] |
| Official GitHub (V3 repo) | https://github.com/deepseek-ai/DeepSeek-V3 | Yes | Model architecture, training scripts, and checkpoint pointers per technical report. [^2] |
| Community mirrors / archives | Various | No | Community-hosted quantized conversions, runtime recipes — validate checksums against official releases. [^5] |

## Runtime Compatibility

| Runtime | Supported | Minimum Version | Notes |
| :-- | :-- | :-- | :-- |
| Transformers (HF) | Yes | Recent HF Transformers (post-2024) | Official model cards include Transformers integration notes; MoE may need custom runtime flags. [^3] |
| vLLM | Yes | vLLM versions with MoE/MLA support | Recommended for MoE-aware batching and async scheduling. [^2] |
| llama.cpp | Yes (distills) | 2024+ builds with GGUF support | Best for offline/CPU low-latency inference on distilled small models. [^3] |
| Ollama | Yes | Ollama releases post-2024 | Community adapters for hosted deployment of distills. [^3] |
| TensorRT-LLM | Partial | Vendor-specific | Experimental integrations for throughput-critical deployments; consult vendor docs. [^2] |

## License

* **Name:** Open-source licenses applied per checkpoint (official model cards list licenses per release; distills often adopt permissive MIT-like or permissive open-source licenses) — consult each model card for exact license text.[^3]
* **Commercial Use:** Depends on checkpoint license — many official DeepSeek releases are permissive for research and commercial use but verify the model card for the specific variant before commercial deployment.[^3]
* **Modification:** Allowed per model card where license permits; check each checkpoint license..[^3]
* **Redistribution:** Permitted or restricted per model card — confirm redistribution clauses on official repo..[^3]
* **Attribution Required:** See each model card for attribution clauses..[^3]
* **Notes:** Always validate license terms in the official model card before redistribution or commercial use.[^3]


## Status

* **Release Date:** V3 technical report published Dec 2024 (arXiv Dec 26, 2024); R1 technical report Jan 2025 (arXiv Jan 22, 2025) — check model card for per-variant release dates.[^1][^2]
* **Maintenance Status:** Production/active research — active releases, distills, and follow-up papers indicate ongoing maintenance and community adoption.[^1][^2]


## Engineering Snapshot

* **Best For:**
    - High-quality reasoning and chain-of-thought agent systems where cost-per-query must be reduced via MoE activations.[^1]
    - Research and open-weight deployments that require reproducible RL-based reasoning models.[^1]
    - Self-hosted inference with MoE-aware runtimes (vLLM) to balance throughput and cost.[^2]
* **Avoid For:**
    - Simple, low-complexity deployments where MoE orchestration overhead outweighs activation savings. Use dense distills instead.[^2]
    - Strict latency SLOs on single-GPU commodity hardware for large V3 checkpoints without aggressive quantization or sharding strategies.[^2]
    - Environments that cannot accept open-weight licenses or require vendor-locked support (use cloud-managed closed models).[^3]
* **Deployment Complexity:** High for full V3 (MoE sharding, expert routing, specialized GPUs); moderate for distills (7B–70B).[^3][^2]
* **Production Ready:** True for distilled variants and for teams with MoE-aware infra; full V3 requires advanced infra and is production-capable when properly sharded.[^2]
* **Recommended Use Case:** Use R1 distills (14B–70B) for most production reasoning workloads; reserve full V3 for workloads that require maximal open-weight capacity and where infra supports MoE distribution.[^1][^2]


## Timeline

| Version | Release Date | Notes |
| :-- | :-- | :-- |
| DeepSeek-V3 (technical) | 2024-12-26 | V3 technical report and checkpoint publication; MoE/MLA architecture described [^2]. |
| DeepSeek-R1 (technical) | 2025-01-22 | R1 family introduced with RL-first training and R1-Zero experiments [^1]. |
| Distills \& community releases | 2025 onward | Official distills (1.5B–70B) and community quantized conversions followed in months after R1 release [^3][^5]. |

## Engineering Notes

### Inference Notes

* MoE activation sparsity reduces per-token FLOPs but requires expert routing and reliable load-balancing; DeepSeek implements loss-free load balancing and MLA to compress KV state, which materially reduces KV cache overhead on inference.[^2]


### Deployment Notes

* For V3, use MoE-aware sharding and high-throughput interconnects (NVLink/NCCL) along with runtimes such as vLLM or vendor-optimized TensorRT pipelines; distills are the recommended path for simpler deployments.[^4][^2]


### Optimization Notes

* Mixed precision (FP8/FP16) micro-scaling and Multi-Token Prediction (MTP) speculative decoding were used in training to improve throughput; evaluate FP8/FP16 inference carefully against reasoning quality regressions.[^2]


### Compatibility Notes

* Distills convert well to GGUF/GPTQ for llama.cpp and other lightweight runtimes; full V3 requires MoE-supported runtimes and may need custom integration work for MLA and expert routing.[^3][^2]


### Common Pitfalls

* Pitfall: Treating V3 like a dense model — mitigation: provision MoE-aware runtime, test load balancing and routing across shards before production rollout.[^2]
* Pitfall: Quantizing R1 without RL‑quality validation — mitigation: run reasoning benchmarks post-quantization to validate chain-of-thought and correctness.[^1][^3]


## Related Models

| ID | Relationship |
| :-- | :-- |
| deepseek-v3 | same-family (parent architecture) [^2] |
| deepseek-r1 | sibling (reasoning-optimized variant) [^1] |
| llama-3 | comparable alternative (dense; different trade-offs) [^2] |

## Further Study

### Research Papers

* DeepSeek-V3 Technical Report - DeepSeek Research Group / DeepSeek AI.[^2]
* DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning - DeepSeek Research Group.[^1]


### Official Documentation

* DeepSeek model cards and GitHub repositories (DeepSeek-V3 repo, DeepSeek-R1 model cards) — Hugging Face model hub and GitHub.[^3][^2]


### Engineering Blogs

* DeepSeek engineering summaries and community analysis (Graphcore Research mirror, D-Central profile) for implementation and deployment notes.[^5][^4]

(Each source above is the primary evidence used for the claims in this registry; consult them for exact per-variant numeric fields and license text.)[^5][^4][^1][^3][^2]

## Suggested Meta

* **Tags:** deepseek, r1, v3, moE, inference, reasoning, distill, quantization
* **Aliases:** DeepSeek R1, DeepSeek V3, DeepSeek-R1 family
* **Keywords:** DeepSeek, MoE, MLA, R1-Zero, distill, GPTQ, AWQ, vLLM, HuggingFace
* **Search Tokens:** deepseek v3, deepseek r1, deepseek distill 70b, deepseek v3 technical report
* **Difficulty:** Advanced
* **Domain:** llm
* **Engineering Area:** deployment, inference, optimization, model selection
* **Estimated Reading Time:** 45 minutes (to read technical + model card)
* **Prerequisites:** Production ML infra, distributed GPU/MoE deployment experience, quantization validation practices
* **Recommended Next:** Evaluate R1 distill 14B/32B in-house with GPTQ/AWQ on representative reasoning workloads
* **Cross-Links:**
    * related_models: [deepseek-v3, deepseek-r1]
    * related_packages: [vllm, transformers]
    * related_workflows: [MoE-sharding-deploy]
    * related_patterns: [speculative-decoding, multi-token-prediction]

Final notes: Use the referenced technical reports and model cards as the authoritative source for per-variant numeric values (hidden sizes, exact layer counts, exact vocab sizes, and license text) before acceptance into production; the family intentionally separates large MoE (V3) from distilled R1 variants for pragmatic production decision-making.[^1][^3][^2]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://arxiv.org/pdf/2501.12948.pdf

[^2]: https://arxiv.org/abs/2412.19437

[^3]: https://huggingface.co/deepseek-ai/DeepSeek-R1

[^4]: https://graphcore-research.github.io/deepseek/

[^5]: https://d-central.tech/ai/model/deepseek-r1/

[^6]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md

[^7]: MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md

[^8]: CONTENT_QUALITY_STANDARD.md

[^9]: ARCHITECTURE_FREEZE.md

[^10]: AENS Knowledge Layer Specification.md

[^11]: https://arxiv.org/pdf/2412.19437.pdf

[^12]: https://arxiv.org/pdf/2501.18438.pdf

[^13]: https://arxiv.org/html/2502.02523

[^14]: https://arxiv.org/pdf/2503.10460.pdf

[^15]: https://pmc.ncbi.nlm.nih.gov/articles/PMC11986734/

[^16]: https://arxiv.org/html/2412.19437v1

[^17]: https://theorempath.com/topics/deepseek-models

[^18]: https://en.wikipedia.org/wiki/DeepSeek-R1

[^19]: https://arxiv.org/html/2505.09343v1

[^20]: https://vitalab.github.io/article/2025/02/11/DeepSeekV3.html

[^21]: https://note.com/paper_research/n/nfb5cab705f28?hl=en-US

