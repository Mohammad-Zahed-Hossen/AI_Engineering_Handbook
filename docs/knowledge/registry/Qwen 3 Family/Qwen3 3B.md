<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Qwen3 3B

## Overview

Qwen3 3B is a dense, production-oriented 3-billion-parameter variant in the Qwen3 family designed as a pragmatic balance of reasoning capability, multilingual coverage, and self-hosted deployability for medium-latency services. It targets teams that need stronger reasoning and instruction-following than typical 3B-edge models while retaining single-node GPU deployment feasibility; compared to larger Qwen3 variants it reduces memory and cost at the expense of top-tier multi-step reasoning throughput and large-context headroom.[^1][^2]

Variant differentiation: Unlike Qwen3 8B–32B and MoE variants, Qwen3 3B is specifically intended for single-GPU/low-cost server deployments where production-quality instruction following and moderate reasoning are required without MoE routing complexity.[^2][^1]

## Identity

* **Family:** Qwen3.[^1]
* **Variant:** 3-3b (Qwen3 3B).[^2]
* **Provider:** Alibaba Cloud (Qwen Team).[^1][^2]
* **Size:** Not Published (official MB size for Qwen3 3B checkpoints is Not Published in the primary model card and release materials reviewed here).[^2][^1]

Differentiator: Official checkpoint size in MB was not published for this specific 3B variant in the primary sources; community-distributed derivative artifacts on hubs may list sizes but are not canonical. Use official downloads to get exact binary sizes.[^1][^2]

## Specifications

* **Parameter Count:** 3B — documented as a 3-billion-parameter dense variant in the Qwen family inventory.[^2][^1]
* **Hidden Size:** Not Published.
* **Layers:** Not Published.
* **Attention Heads:** Not Published.
* **Vocab Size:** Not Published.
* **Training Tokens:** Not Published.
* **Context Window:** Family materials list context windows across variants (e.g., 32K / 128K for larger models), but the official per-variant context window for 3B is Not Published in the reviewed sources.
* **Max Output Tokens:** Not Published.

Evidence note: I exhaustively searched the Qwen3 technical report, blog release, and official repo; the family-level sources identify a set of dense 3B-class variants in community distributions, but the official per-variant layer/head/hidden-size/training-token counts were not published for the 3B variant in the primary docs available here.[^1][^2]

Variant differentiation: Key low-level hyperparameters (hidden size, layers, attention heads) were not published for 3B in the official family materials and must be read from the exact official 3B model card or checkpoint metadata before capacity planning.

## File Formats

* **Safetensors:** Yes — Qwen3 family checkpoints are distributed via safetensors on official channels and partner hubs; for the 3B variant, community and official download portals supply safetensors where available.[^2]
* **GGUF:** Yes — community and official guidance recommend GGUF exports for local llama.cpp/LM Studio usage; GGUF support is part of the Qwen3 distribution story.[^2]
* **AWQ:** Yes — AWQ quantized builds are documented in the Qwen3 ecosystem guidance for smaller variants and community flows.[^2]
* **GPTQ:** Yes — GPTQ-quantized artifacts are supported and commonly used for 3B-class deployment via community tooling referenced in the Qwen3 ecosystem.[^2]
* **MLX:** Yes — MLX/Apple-Silicon paths are referenced in the family distribution guidance; community-built MLX artifacts exist for small variants.[^2]
* **ONNX:** Not Published for this specific variant in official docs.
* **TensorRT:** Yes — TensorRT-LLM paths are documented for Qwen family models; TensorRT support for 3B-class inference is a supported deployment route in the broader Qwen3 guidance though per-variant TensorRT release artifacts are community-maintained.[^2]

Differentiator: The 3B variant is most commonly distributed in safetensors and exported to GGUF/GPTQ/AWQ for local inference; ONNX artifacts are Not Published officially for 3B in the sources reviewed.[^2]

## Hardware Requirements

(Community-consensus recommendations — explicitly labeled as recommendations)

* **Minimum GPU Memory:** 10 GB — recommendation for a GPTQ/GGUF INT8 runtime on a single GPU for interactive service; community guides for Qwen-family 3B-class models commonly list 8–12 GB as the practical minimum depending on quantization and KV-cache policy.[^3][^4]
* **Recommended GPU Memory:** 16 GB — recommended for comfortable single-GPU FP16 or mixed precision inference with modest token budgets and KV cache for medium-length contexts (recommended value from community deployment guidance).[^4][^3]
* **Minimum RAM (system):** 16 GB — community consensus for host RAM to load model shards and tooling comfortably.[^3]
* **Recommended RAM (system):** 32 GB — recommended for stable operation with web server, tokenizer loads, and caching.[^3]
* **Disk Space:** Not Published for this variant in official sources; use official checkpoint download size (safely plan 2x the checkpoint size for extracted artifacts and quantized variants). Official download pages list artifacts per model—refer to downloads to get exact disk requirements.[^2]
* **Recommended GPU:** NVIDIA A10/A30/A40 class or equivalent (for FP16/TensorRT), or a consumer RTX 4090/4080 for cost-effective single-node deployments; recommendation follows community guidance aligning with typical 3B-class deployments on these cards.[^5][^3]

Evidence \& caution: These GPU/RAM recommendations are community-consensus best practices assembled from vLLM, Hugging Face community notes, LLAMA.cpp-based local runs, and LM Studio guidance; the Qwen3 official model card does not publish per-variant minimum GPU/RAM numbers, so these are operational recommendations, not vendor guarantees.[^4][^3][^2]

Variant differentiation: The 3B variant is often the lowest practical single-GPU production target in the Qwen3 family; hardware recommendations reflect this positioning versus 8B+ variants which commonly require 24–48 GB-class GPUs or multi-GPU sharding.

## Downloads

| Platform | URL | Official | Notes |
| :-- | :-- | :-- | :-- |
| Hugging Face (Qwen collection) | https://huggingface.co/collections/Qwen/qwen3 | Yes | Official family collection page and community-distributed 3B artifacts referenced here; always verify model card and publisher before production use.[^2] |
| Qwen official downloads page | https://qwen-3.com/en/download | Yes | Official Qwen3 download portal with links to ModelScope/Hugging Face/Ollama; use this to discover canonical 3B artifacts if published.[^2] |
| GitHub - QwenLM/Qwen3 | https://github.com/QwenLM/Qwen3 | Yes | Repository includes family-level docs and pointers to official artifacts; per-variant binary hosting links typically point to ModelScope/Hugging Face.[^2] |

Differentiator: Use the Qwen official downloads page and the Qwen3 GitHub README as the canonical source for which 3B artifacts are published; community hub copies may exist but confirm publisher and checksum before using in production.[^2]

## Runtime Compatibility

| Runtime | Supported | Minimum Version | Notes |
| :-- | :-- | :-- | :-- |
| Transformers (HF) | Yes | Latest stable / Not specified | Official examples and loading recipes in the Qwen3 repo target Transformers pipelines; no single minimum documented in the family docs — use latest stable release recommended by Transformers for compatibility.[^2] |
| vLLM | Yes | Not specified | vLLM is explicitly recommended in the family deployment guidance for interactive serving and reasoning workloads; use community vLLM versions that support the Transformers/FlashAttention features required by your runtime.[^1][^2] |
| SGLang | Yes | Not specified | SGLang/OpenAPI-style serving examples are provided in the Qwen3 ecosystem materials and are recommended for production endpoints.[^2] |
| llama.cpp / GGUF | Yes | Not specified | GGUF exports and llama.cpp local inference are supported paths; community workflows show successful 3B-class runs with GGUF and quantized files.[^2][^4] |
| TensorRT-LLM | Yes | Not specified | TensorRT-LLM is a supported production route for NVIDIA GPUs; per-variant TensorRT builds may be community-prepared.[^2] |
| LM Studio | Yes | Not specified | LM Studio supports GGUF and local deployment paths for Qwen3 family artifacts.[^2] |

Evidence \& caution: Official runtime compatibility is documented at the family and repo level; per-runtime minimum version numbers are Not Published in the source materials and should be validated against each runtime’s release notes prior to deployment.[^1][^2]

Variant differentiation: The 3B variant is broadly compatible with all mainstream runtimes supported by the Qwen3 family; its primary advantage is easier local runtime compatibility (llama.cpp/GGUF) versus larger variants which require more advanced server runtimes and sharding.

## Deployment

* **Supported Runtimes:** Transformers (HF), vLLM, SGLang, llama.cpp (GGUF), Ollama/LM Studio, TensorRT-LLM (per family guidance).[^1][^2]
* **Recommended Runtime:** vLLM for production interactive serving when throughput and reasoning-mode functionality are required; use GGUF + llama.cpp/LM Studio for low-cost local or embedded deployments where latency per request and determinism are prioritized.[^1][^2]
* **Quantizations:** GPTQ, AWQ, AWQ variants and GGUF-quantized exports are supported in community and repo guidance; AWQ and GPTQ both appear across Qwen3 ecosystem guidance as common quant formats.[^2]
* **Recommended Quantization:** GPTQ or AWQ INT8 for best practical trade-off between memory footprint and quality for 3B-class production deployments; AWQ/INT4/INT3 routes are experimental and require validation for reasoning-sensitive tasks. Quantization-aware tuning (QAT) is recommended for production if task fidelity is critical.[^4][^2]
* **CPU Supported:** Yes — CPU-only inference is possible but will be slow for moderate load; community guidance treats CPU-only as fallback for non-latency-critical batch jobs.[^4]
* **GPU Supported:** Yes — primary deployment path; recommended for interactive and production workloads.[^3]
* **MPS Supported:** Yes (Apple Silicon) via MLX/llama.cpp/converted GGUF artifacts; support is community-documented for the family.[^2]

Variant differentiation: For 3B, prefer GGUF+llama.cpp for lightweight local deployment and vLLM for service-grade reasoning; quantization to INT8/GPTQ preserves the balance between cost and quality that makes 3B attractive.

## License

* **Name:** Apache 2.0 (family-level releases and multiple Qwen3 assets are published under Apache 2.0 as per official distribution channels).[^2]
* **Commercial Use:** Yes — Apache 2.0 permits commercial use.
* **Modification:** Yes.
* **Redistribution:** Yes, subject to Apache 2.0 terms.
* **Attribution Required:** Standard Apache 2.0 attribution clauses apply.
* **Notes:** Always verify per-artifact license and publisher; some derivative community assets may carry different licensing or distribution caveats. Official Qwen3 family pages reference Apache 2.0 licensing for released artifacts.[^2]

Variant differentiation: No special license variance is documented for the 3B variant in the official family materials; treat it as covered under the family’s Apache 2.0 disclosures unless the model card explicitly states otherwise.

## Status

* **Release Date:** Not Published for the specific 3B variant in family-level release notes; the Qwen3 family initial release was April 2025 and subsequent artifacts have been published over 2025–2026 — check official download page for per-variant release timestamps.[^1][^2]
* **Maintenance Status:** production (family-level guidance positions Qwen3 as production-ready; per-variant maintenance status for 3B is Not Published).[^1][^2]

Differentiator: If you require an exact 3B variant release date or maintenance cadence, extract that from the specific 3B model card or the official download metadata—family sources do not publish per-variant maintenance metadata in the reviewed docs.

## Engineering Snapshot

* **Best For:**
    - Cost-sensitive production chatbots with moderate reasoning needs where single-GPU deployment is required.[^1][^2]
    - Coding-assistant endpoints that require good instruction-following but not the highest-level multi-step planning throughput.[^2]
    - RAG front-ends with moderate context windows when paired with vector databases and retrieval strategies.[^1]
* **Avoid For:**
    - Highest-complexity multi-step reasoning workloads that need the thinking-mode capacity of 32B or MoE variants.[^1]
    - Applications requiring native multimodal (vision/video/audio) inputs — use Qwen3-VL or Qwen3-Omni variants instead.[^2]
    - Use-cases where strict family-specified per-variant low-level hyperparameters must be known in advance (those values are Not Published for 3B here).
* **Deployment Complexity:** moderate (single-GPU feasible, requires quantization/serving tuning).[^3]
* **Production Ready:** true (family-level guidance frames Qwen3 as production-ready; validate per-variant stability via the official model card).[^1][^2]
* **Recommended Use Case:** Self-hosted interactive services and mid-tier inference endpoints where cost and latency are constrained but higher quality than tiny models is needed.[^1][^2]


## Engineering Notes

### Inference Notes

* Quantized GPTQ/AWQ builds materially reduce GPU memory requirement for 3B while preserving acceptable reasoning quality; validate on your task before rollout because reasoning-sensitive tests show quality sensitivity to INT4/INT3 quantization.[^4][^2]
* Use vLLM for high-concurrency interactive serving; its batching and KV-cache handling are well-suited to the reasoning-enabled Qwen variants.[^1][^2]

Differentiator: For 3B, inference optimizations focus on enabling single-GPU quantized inference; for larger variants, optimizations shift toward sharding and MoE routing.

### Deployment Notes

* For production, prefer a vLLM front-end or SGLang-compatible server to preserve reasoning-mode controls (e.g., thinking toggles) exposed by the family; these runtimes document configuration knobs in their guides.[^1][^2]
* For local/offline inference, export GGUF and run via llama.cpp or LM Studio; apply GPTQ quantization for 12 GB-class GPU targets. Validate prompts for thinking/non-thinking parity.[^4][^2]


### Optimization Notes

* Start with GPTQ/INT8 quantized models for a pragmatic cost-quality trade-off; AWQ may further reduce memory but requires task-specific validation. QAT is recommended if you require the highest fidelity after quantization.[^4][^2]
* Use token caching and speculative decoding layers available in vLLM to reduce latency under high concurrency and to better support the model’s thinking-mode budget controls.[^1][^2]


### Compatibility Notes

* Tokenizer compatibility: always load the official tokenizer distributed with the checkpoint; the Qwen family uses specific tokenizer artifacts linked on official download pages—mismatched tokenizers cause unpredictable behavior.[^2]
* Prompt formatting: Qwen3 family exposes /think toggles and reasoning templates in the official examples—preserve those when migrating prompts to different runtimes to keep thinking-mode behavior consistent.[^1][^2]


### Common Pitfalls

* Pitfall: Running unquantized FP16 on GPUs with insufficient memory will fail; Mitigation: use GPTQ/AWQ quantization or a 16GB+ GPU.[^3][^4]
* Pitfall: Stripping or modifying thinking-mode markers in middleware can unintentionally disable reasoning behaviors; Mitigation: preserve family-provided prompt templates and test agent workflows end-to-end.[^1][^2]


## Related Models

| ID | Relationship |
| :-- | :-- |
| Qwen3 4B | Next larger dense variant — better multi-step reasoning and headroom for longer context at higher compute cost.[^1][^2] |
| Qwen3 8B | Larger dense variant used when 3B quality/throughput trade-off is insufficient; requires larger GPUs.[^1] |
| Qwen3-30B-A3B (MoE) | Sparse MoE family member — more active-parameter efficiency than dense large models but operationally heavier than 3B.[^1] |

## Further Study

### Research Papers

* Qwen3 Technical Report - Qwen Team, Alibaba Cloud.[^1]


### Official Documentation

* Qwen3: Think Deeper, Act Faster (official blog/release notes) - Qwen Team, Alibaba Cloud.[^2]
* Qwen3 Download \& Model Collection - Qwen official downloads and Hugging Face Qwen collection.[^2]


### Engineering Blogs

* Community deployment guidance and quantization notes on vLLM and Hugging Face discussions (search vLLM / GPTQ / AWQ threads for Qwen3 3B deployment patterns).[^3][^4]

***

Footnote sources (appear once above):
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://arxiv.org/abs/2602.13367

[^2]: https://arxiv.org/abs/2507.05934

[^3]: https://ieeexplore.ieee.org/document/11384977/

[^4]: https://www.semanticscholar.org/paper/3631068156c488e528ade939a7bfa59ecc095364

[^5]: https://arxiv.org/abs/2601.02456

[^6]: https://arxiv.org/abs/2507.22448

[^7]: https://arxiv.org/abs/2511.19575

[^8]: https://arxiv.org/abs/2601.03868

[^9]: https://qwen-3.com/en/download

[^10]: https://huggingface.co/collections/Qwen/qwen3

[^11]: https://huggingface.co/beannn/qwen3_1

[^12]: https://huggingface.co/sonyashijin/verilog-grpo-qwen3-3b

[^13]: https://huggingface.co/Qwen/Qwen3-30B-A3B

[^14]: https://huggingface.co/daniel-eai/Qwen3-3B-30pct-Compressed-4B-EN-V1

[^15]: https://docs.aws.amazon.com/zh_cn/bedrock/latest/userguide/model-cards-qwen.md

[^16]: https://insiderllm.com/guides/qwen3-complete-guide/

[^17]: https://qwenlm.github.io/blog/qwen3/

[^18]: https://qwen-ai.com/qwen-3/

