<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Qwen3-1.7B and Qwen3-0.6B (Base / Instruct)

## Overview

Qwen3-1.7B and Qwen3-0.6B are the smallest dense Qwen3 checkpoints in this registry slice, intended for on-device assistants, ultra-low-resource experiments, and latency-critical edge inference where the 32K native context and thinking/non-thinking switch matter more than model capacity. The engineering value is that they preserve the same Qwen3 serving contract as larger siblings while cutting memory and compute enough to make local or single-node deployment realistic on modest hardware. The trade-off is lower reasoning headroom and weaker robustness on difficult tasks, so these are best used when footprint and response time dominate quality goals.[^1][^2]

## Identity

* **Family:** Qwen3.
* **Variant:** 3-1.7b, 3-0.6b.
* **Provider:** Alibaba Cloud (Qwen Team).
* **Size:** Not Published as MB in the official sources reviewed here; official model sizes are 1.7B and 0.6B parameters.[^2]


## Specifications

* **Parameter Count:** 1.7B and 0.6B, respectively.[^2]
* **Hidden Size:** Not Published.
* **Layers:** 28 for Qwen3-1.7B; 28 for Qwen3-0.6B is not explicitly published in the reviewed official sources.[^2]
* **Attention Heads:** 16 query heads and 8 key-value heads (GQA) for Qwen3-1.7B; Qwen3-0.6B is not explicitly published in the reviewed official sources.[^2]
* **Vocab Size:** Not Published.
* **Training Tokens:** Not Published.
* **Context Window:** 32,768.[^2]
* **Max Output Tokens:** 32,768 recommended by the official guidance; 38,912 for highly complex math/programming workloads.[^2]


## File Formats

* **Safetensors:** Yes.[^2]
* **GGUF:** Yes.[^3][^2]
* **AWQ:** Yes.[^2]
* **GPTQ:** Yes.[^2]
* **MLX:** Yes.[^2]
* **ONNX:** Not Published.
* **TensorRT:** Not Published in the reviewed official Qwen3 documentation.[^2]


## Hardware Requirements

* **Minimum GPU Memory:** 2–4 GB is a community recommendation for heavily quantized single-GPU use; this is a recommendation, not an official minimum.[^3]
* **Recommended GPU Memory:** 4–8 GB is a community recommendation for comfortable local serving with quantization; this is a recommendation, not an official requirement.[^3]
* **Minimum RAM:** 4–8 GB is a community recommendation for local inference workflows; this is a recommendation, not an official requirement.[^3]
* **Recommended RAM:** 8–16 GB is a community recommendation for stable host memory headroom; this is a recommendation, not an official requirement.[^3]
* **Disk Space:** Not Published officially.
* **Recommended GPU:** NVIDIA RTX 3050 / 3060-class or similar consumer GPU is a community recommendation for quantized production use; this is a recommendation, not an official requirement.[^3]


## Downloads

| Platform | URL | Official | Notes |
| :-- | :-- | :-- | :-- |
| Hugging Face | https://huggingface.co/Qwen/Qwen3-1.7B | Yes | Official checkpoint and model card for the 1.7B model.[^2] |
| Qwen download portal | https://qwen-3.com/en/download | Yes | Official Qwen3 download hub listing the 1.7B class model.[^2] |
| Hugging Face Qwen3 collection | https://huggingface.co/collections/Qwen/qwen3 | Yes | Official family collection page.[^2] |

## Runtime Compatibility

| Runtime | Supported | Minimum Version | Notes |
| :-- | :-- | :-- | :-- |
| Transformers | Yes | Latest stable / 4.51.0+ | Official docs warn that `transformers<4.51.0` can raise `KeyError: 'qwen3'`.[^2] |
| vLLM | Yes | 0.8.5+ | Official Qwen docs provide a direct serving example; vLLM 0.9.0 adds `qwen3` reasoning-parser support.[^2] |
| SGLang | Yes | 0.4.6.post1+ | Official Qwen docs provide a serving example with `--reasoning-parser qwen3`.[^2] |
| llama.cpp | Yes | b5092+ | Official llama.cpp guidance says Qwen3 support begins at version b5092.[^3] |
| Ollama | Yes | Latest stable | Official Qwen docs list local support.[^2][^3] |
| LM Studio | Yes | Latest stable | Official Qwen docs list local support.[^2][^3] |
| MLX-LM | Yes | Latest stable | Official Qwen docs list local support.[^2] |
| KTransformers | Yes | Latest stable | Official Qwen docs list local support.[^2] |

## Deployment

* **Supported Runtimes:** Transformers, vLLM, SGLang, Ollama, LM Studio, MLX-LM, llama.cpp, KTransformers.[^3][^2]
* **Recommended Runtime:** vLLM for production serving because the official Qwen docs provide a first-class OpenAI-compatible deployment path and reasoning-mode controls.[^2]
* **Quantizations:** BF16 native, FP8, AWQ, GPTQ, GGUF-based quantized variants.[^3][^2]
* **Recommended Quantization:** GGUF for the smallest footprint and broadest local portability; AWQ or FP8 if you need better throughput on supported GPU targets.[^3][^2]
* **CPU Supported:** Yes, primarily through llama.cpp and quantized local execution.[^3]
* **GPU Supported:** Yes, and this is the primary production path.[^3][^2]
* **MPS Supported:** Yes, through MLX-LM / Apple Silicon local workflows.[^3][^2]


## License

* **Name:** Apache 2.0.[^2]
* **Commercial Use:** Yes.
* **Modification:** Yes.
* **Redistribution:** Yes.
* **Attribution Required:** Yes.
* **Notes:** The official Qwen3 distribution materials identify Apache 2.0 licensing for the family; confirm the exact artifact page if you are repackaging derivative weights.[^2]


## Status

* **Release Date:** 2025-04-28.[^2]
* **Maintenance Status:** production.[^2]


## Engineering Snapshot

* **Best For:**
    - On-device assistants where RAM and VRAM budgets are tight.[^1][^2]
    - Ultra-low-resource experimentation and rapid prototyping.[^1][^2]
    - Latency-critical edge inference with 32K context and controllable thinking mode.[^1][^2]
* **Avoid For:**
    - Tasks that need the reasoning headroom of larger Qwen3 checkpoints.[^1][^2]
    - Long-context production that depends on YaRN without validating shorter-text behavior.[^3][^2]
    - Deployments where the model will be asked to do complex agentic work at high accuracy with minimal prompt scaffolding.[^2]
* **Deployment Complexity:** low
* **Production Ready:** true
* **Recommended Use Case:** Small-footprint production chat, local assistants, and edge deployments with strict latency or memory ceilings.[^3][^2]


## Engineering Notes

### Inference Notes

```
* The official model card recommends `enable_thinking=True` by default and documents the `<think>...</think>` output split for reasoning-mode parsing.[^2]
```

* For thinking mode, the official defaults are `Temperature=0.6`, `TopP=0.95`, `TopK=20`, and `MinP=0`; the docs explicitly warn against greedy decoding because it can degrade quality and repetition behavior.[^2]
* The recommended output budget is 32,768 tokens for typical use and 38,912 for hard math/programming tasks.[^2]


### Deployment Notes

* vLLM and SGLang are the official deployment targets in the Qwen docs, with concrete serving examples for both.[^2]
* The Qwen docs recommend enabling YaRN only for workloads that need it, because static YaRN can hurt shorter-text performance.[^3][^2]
* Official docs emphasize that `enable_thinking` must be preserved correctly through the serving stack if you want faithful reasoning-mode behavior.[^2]


### Optimization Notes

* Use GGUF when the primary requirement is minimal footprint and local portability; use AWQ or FP8 when throughput on GPU is more important than maximal compression.[^3][^2]
* Keep `max-model-len` aligned with actual workload needs rather than defaulting to the widest setting, because vLLM notes that overprovisioning increases OOM risk.[^2]
* Quantized serving is the principal way to make these small models economically useful on commodity hardware, but quantization validation remains necessary for reasoning tasks.[^3][^2]


### Compatibility Notes

* `transformers<4.51.0` can fail on Qwen3 model loading, so standardize on a newer release.[^2]
* llama.cpp support starts at b5092 and the official Qwen guide shows GGUF-based execution with Qwen3.[^3]
* vLLM 0.8.5 supports serving the model, while vLLM 0.9.0 adds `qwen3` reasoning-parser support for cleaner reasoning-content extraction.[^2]


### Common Pitfalls

* Pitfall: enabling YaRN by default for all traffic. Mitigation: apply it only for requests that need long context, because the official docs warn about shorter-text regression.[^3][^2]
* Pitfall: staying on an old Transformers version. Mitigation: move to 4.51.0+ before deployment.[^2]
* Pitfall: assuming the 0.6B and 1.7B variants are interchangeable. Mitigation: validate each variant separately, because they sit at different quality and latency points even when the deployment pattern looks similar.[^2]


## Related Models

| ID | Relationship |
| :-- | :-- |
| Qwen3-4B | Larger sibling with more capacity and higher serving cost.[^2] |
| Qwen3-8B | Larger sibling with additional headroom for harder tasks.[^2] |
| Qwen3-0.6B | Smaller sibling optimized for the most constrained deployments.[^2] |

## Further Study

### Research Papers

* **Qwen3 Technical Report** - Qwen Team, Alibaba Cloud.[^1]


### Official Documentation

* **Qwen/Qwen3-1.7B model card** - Qwen Team, Alibaba Cloud.[^2]
* **Qwen/Qwen3-0.6B model card** - Qwen Team, Alibaba Cloud.[^2]
* **Qwen3 download portal** - Qwen Team, Alibaba Cloud.[^2]
* **llama.cpp - Qwen** - Qwen documentation.[^3]
* **vLLM - Qwen** - Qwen documentation.[^2]


### Engineering Blogs

* **Qwen3 release and usage guidance** - Qwen Team, Alibaba Cloud.[^2]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://arxiv.org/abs/2601.04210

[^2]: https://dl.acm.org/doi/10.1145/3788731.3788750

[^3]: https://www.semanticscholar.org/paper/7c98a0ca749f35d8f3b5a43fac06edaa244d1602

[^4]: https://arxiv.org/abs/2602.11089

[^5]: https://arxiv.org/pdf/2309.16609.pdf

[^6]: https://arxiv.org/pdf/2308.12966.pdf

[^7]: http://arxiv.org/pdf/2410.18505.pdf

[^8]: https://arxiv.org/pdf/2412.15115.pdf

[^9]: https://huggingface.co/Qwen/Qwen3-1.7B

[^10]: https://huggingface.co/Qwen/Qwen3-ASR-1.7B

[^11]: https://huggingface.co/VocalNet/VocalNet-Qwen3-1.7B

[^12]: https://huggingface.co/willcb/Qwen3-1.7B

[^13]: https://qwen-3.com/en/download

[^14]: https://huggingface.co/models?library=qwen3_tts

[^15]: https://github.com/QwenLM/Qwen3

[^16]: https://huggingface.co/models?other=qwen3_asr

[^17]: https://huggingface.co/castorini/first_qwen3_1.7b

[^18]: https://www.together.ai/models/qwen3-1-7b

