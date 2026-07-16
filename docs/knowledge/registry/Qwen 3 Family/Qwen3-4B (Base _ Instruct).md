<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Qwen3-4B (Base / Instruct)

## Overview

Qwen3-4B is the compact dense checkpoint in the Qwen3 family for production chat, RAG, and latency-sensitive assistant workloads, with 4.0B parameters, 36 layers, GQA, and native thinking/non-thinking control in the official model card. It is the variant to choose when you need the Qwen3 reasoning contract and 32,768 native context on constrained hardware, but cannot afford the footprint or latency overhead of the 8B and larger checkpoints. The main engineering trade-off is favorable memory and deployment simplicity versus lower capacity headroom for the hardest reasoning and long-context jobs.[^1][^2]

## Identity

* **Family:** Qwen3.
* **Variant:** 3-4b.
* **Provider:** Alibaba Cloud (Qwen Team).
* **Size:** Not Published as MB in the official sources reviewed here; official model size is 4.0B parameters.[^2]


## Specifications

* **Parameter Count:** 4.0B.[^2]
* **Hidden Size:** Not Published.
* **Layers:** 36.[^2]
* **Attention Heads:** 32 query heads and 8 key-value heads (GQA).[^2]
* **Vocab Size:** Not Published.
* **Training Tokens:** Not Published.
* **Context Window:** 32,768 natively and 131,072 with YaRN.[^2]
* **Max Output Tokens:** 32,768 recommended by the official guidance; 38,912 for highly complex math/programming workloads.[^2]


## File Formats

* **Safetensors:** Yes.[^2]
* **GGUF:** Yes.[^3][^2]
* **AWQ:** Yes.[^2]
* **GPTQ:** Yes.[^2]
* **MLX:** Yes.[^2]
* **ONNX:** Not Published.
* **TensorRT:** Not Published in the reviewed official Qwen3-4B documentation.[^2]


## Hardware Requirements

* **Minimum GPU Memory:** 4–6 GB is a community recommendation for heavily quantized single-GPU use; this is a recommendation, not an official minimum.[^3]
* **Recommended GPU Memory:** 8–12 GB is a community recommendation for comfortable production serving with quantization and moderate concurrency; this is a recommendation, not an official requirement.[^3]
* **Minimum RAM:** 8 GB is a community recommendation for local inference workflows; this is a recommendation, not an official requirement.[^3]
* **Recommended RAM:** 16 GB is a community recommendation for stable host memory headroom and longer contexts; this is a recommendation, not an official requirement.[^3]
* **Disk Space:** Not Published officially.
* **Recommended GPU:** NVIDIA RTX 3060 / 4060 / 4070-class or similar consumer GPU is a community recommendation for quantized production use; this is a recommendation, not an official requirement.[^3]


## Downloads

| Platform | URL | Official | Notes |
| :-- | :-- | :-- | :-- |
| Hugging Face | https://huggingface.co/Qwen/Qwen3-4B | Yes | Official checkpoint and model card.[^2] |
| Qwen download portal | https://qwen-3.com/en/download | Yes | Official Qwen3 download hub with dense and quantized releases.[^2] |
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
* **Recommended Quantization:** AWQ or FP8 for production if your hardware supports it; GGUF is the practical choice for local and edge-style deployment where portability matters most.[^3][^2]
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
    - Edge and low-resource assistants where memory footprint matters more than maximum model capacity.[^1][^2]
    - Lightweight RAG services that need 32K native context and predictable serving cost.[^2]
    - Latency-sensitive production deployments that benefit from smaller dense-model routing and quantization.[^3][^2]
* **Avoid For:**
    - Workloads that justify the larger Qwen3 dense or MoE checkpoints for more capacity headroom.[^1][^2]
    - Long-context production without validating YaRN impact on shorter prompts.[^3][^2]
    - High-throughput multi-tenant deployments that need the broader serving headroom of larger models.[^3][^2]
* **Deployment Complexity:** moderate
* **Production Ready:** true
* **Recommended Use Case:** Cost-efficient production chat, RAG, and small-agent serving on constrained hardware.[^3][^2]


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

* Use YaRN only when your workload genuinely requires >32K context; otherwise keep the native context path to avoid unnecessary performance loss on shorter inputs.[^3][^2]
* For vLLM, keep `max-model-len` aligned with your actual workload rather than leaving the default at its widest setting, because the docs note that overprovisioning can drive OOM risk.[^2]
* Quantized serving is the main lever for making this checkpoint economical on a single node, but quality validation is still required before pushing INT4-style deployments into production.[^3][^2]


### Compatibility Notes

* `transformers<4.51.0` can fail on Qwen3 model loading, so standardize on a newer release.[^2]
* llama.cpp support starts at b5092 and the official Qwen guide shows GGUF-based execution with Qwen3-4B.[^3]
* vLLM 0.8.5 supports serving the model, while vLLM 0.9.0 adds `qwen3` reasoning-parser support for cleaner reasoning-content extraction.[^2]


### Common Pitfalls

* Pitfall: enabling YaRN by default for all traffic. Mitigation: apply it only for requests that need long context, because the official docs warn about shorter-text regression.[^3][^2]
* Pitfall: staying on an old Transformers version. Mitigation: move to 4.51.0+ before deployment.[^2]
* Pitfall: treating local quantized serving as interchangeable with BF16 serving. Mitigation: validate task quality after quantization, because the deployment trade-off is quality versus memory, not just file size.[^3][^2]


## Related Models

| ID | Relationship |
| :-- | :-- |
| Qwen3-8B | Larger dense sibling with more capacity and higher serving cost.[^2] |
| Qwen3-0.6B | Smaller sibling for ultra-low-resource deployments.[^2] |
| Qwen3-14B | Larger dense sibling for higher-capacity production workloads.[^2] |

## Further Study

### Research Papers

* **Qwen3 Technical Report** - Qwen Team, Alibaba Cloud.[^1]


### Official Documentation

* **Qwen/Qwen3-4B model card** - Qwen Team, Alibaba Cloud.[^2]
* **Qwen3 download portal** - Qwen Team, Alibaba Cloud.[^2]
* **llama.cpp - Qwen** - Qwen documentation.[^3]
* **vLLM - Qwen** - Qwen documentation.[^2]


### Engineering Blogs

* **Qwen3 release and usage guidance** - Qwen Team, Alibaba Cloud.[^2]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://ieeexplore.ieee.org/document/11580611/

[^2]: https://ieeexplore.ieee.org/document/11596975/

[^3]: https://formative.jmir.org/2026/1/e72604

[^4]: https://arxiv.org/abs/2603.08640

[^5]: https://www.semanticscholar.org/paper/6a93794edeba9943ad90767e55b808357c6855ba

[^6]: https://arxiv.org/abs/2601.18077

[^7]: https://aclanthology.org/2026.semeval-1.355

[^8]: https://arxiv.org/abs/2605.09635

[^9]: https://huggingface.co/Qwen/Qwen3-4B

[^10]: https://huggingface.co/Qwen/Qwen3-4B-Instruct-2507

[^11]: https://huggingface.co/Qwen/Qwen3-Embedding-4B

[^12]: https://huggingface.co/abhishekchohan/Qwen3-4B-AWQ

[^13]: https://huggingface.co/collections/Qwen/qwen3

[^14]: https://huggingface.co/RiiShin/Mio-Qwen3-4B

[^15]: https://huggingface.co/Qwen/Qwen3-VL-4B-Instruct

[^16]: https://huggingface.co/SeaFill2025/Qwen3-4B-SFT

[^17]: https://apxml.com/models/qwen3-4b

[^18]: https://dev.co/ai/llms/qwen3-4b

