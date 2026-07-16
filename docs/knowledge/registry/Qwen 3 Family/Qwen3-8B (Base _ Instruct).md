<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Qwen3-8B (Base / Instruct)

## Overview

Qwen3-8B is the family’s compact dense checkpoint for production chat, RAG, and smaller-agent workloads, with 8.2B parameters, 36 layers, GQA, and native thinking/non-thinking control in the official model card. It is materially easier to deploy than the larger Qwen3 dense and MoE variants while still supporting 32,768 native context and 131,072 with YaRN, which makes it a practical default for local or single-node serving when you can tolerate the model’s smaller capacity ceiling. The main engineering trade-off is that you gain lower memory cost and simpler runtime planning, but lose some headroom versus the larger Qwen3 checkpoints for the hardest reasoning and long-context workloads.[^1][^2]

## Identity

* **Family:** Qwen3.
* **Variant:** 3-8b.
* **Provider:** Alibaba Cloud (Qwen Team).
* **Size:** Not Published as MB in the official sources reviewed here; official model size is 8.2B parameters.[^2][^1]


## Specifications

* **Parameter Count:** 8.2B.[^1][^2]
* **Hidden Size:** Not Published.
* **Layers:** 36.[^2][^1]
* **Attention Heads:** 32 query heads and 8 key-value heads (GQA).[^1][^2]
* **Vocab Size:** Not Published.
* **Training Tokens:** Not Published.
* **Context Window:** 32,768 natively and 131,072 with YaRN.[^2][^1]
* **Max Output Tokens:** 32,768 recommended by the official guidance; 38,912 for highly complex math/programming workloads.[^2]


## File Formats

* **Safetensors:** Yes.[^1][^2]
* **GGUF:** Yes.[^3][^2]
* **AWQ:** Yes.[^2]
* **GPTQ:** Yes.[^2]
* **MLX:** Yes.[^2]
* **ONNX:** Not Published.
* **TensorRT:** Not Published in the reviewed official Qwen3-8B documentation.[^2]


## Hardware Requirements

* **Minimum GPU Memory:** 8 GB is a community recommendation for heavily quantized single-GPU use; this is a recommendation, not an official minimum.[^4][^3]
* **Recommended GPU Memory:** 16–24 GB is a community recommendation for comfortable production serving with quantization and reasonable concurrency; this is a recommendation, not an official requirement.[^3][^4]
* **Minimum RAM:** 16 GB is a community recommendation for local inference workflows; this is a recommendation, not an official requirement.[^4][^3]
* **Recommended RAM:** 32 GB is a community recommendation for stable host memory headroom and longer contexts; this is a recommendation, not an official requirement.[^3][^4]
* **Disk Space:** Not Published officially.
* **Recommended GPU:** NVIDIA RTX 4090 / 3090 / A5000-class or similar high-memory consumer GPU is a community recommendation for quantized production use; this is a recommendation, not an official requirement.[^4][^3]


## Downloads

| Platform | URL | Official | Notes |
| :-- | :-- | :-- | :-- |
| Hugging Face | https://huggingface.co/Qwen/Qwen3-8B | Yes | Official checkpoint and model card.[^2] |
| Qwen download portal | https://qwen-3.com/en/download | Yes | Official Qwen3 download hub with dense and quantized releases.[^2] |
| Hugging Face Qwen3 collection | https://huggingface.co/collections/Qwen/qwen3 | Yes | Official family collection page.[^2] |

## Runtime Compatibility

| Runtime | Supported | Minimum Version | Notes |
| :-- | :-- | :-- | :-- |
| Transformers | Yes | Latest stable / 4.51.0+ | Official docs warn that `transformers<4.51.0` can raise `KeyError: 'qwen3'`.[^1][^2] |
| vLLM | Yes | 0.8.5+ | Official Qwen docs provide a direct serving example; vLLM 0.9.0 adds `qwen3` reasoning parser support.[^2] |
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
    - General-purpose chat and assistant workloads where cost per token matters.[^1][^2]
    - RAG services that need a balanced quality-to-footprint ratio.[^2]
    - Smaller agents and local deployments that benefit from 128K-context capability via YaRN.[^3][^2]
* **Avoid For:**
    - Workloads that justify the larger Qwen3 dense or MoE checkpoints for maximum reasoning headroom.[^1][^2]
    - Long-context production without validating YaRN impact on shorter prompts.[^3][^2]
    - Ultra-low-latency use cases that are better served by much smaller models or domain-specific systems.[^2]
* **Deployment Complexity:** moderate
* **Production Ready:** true
* **Recommended Use Case:** Cost-efficient production chat, RAG, and small-agent serving with optional long-context expansion.[^3][^2]


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
* Quantized serving is the main lever for making this checkpoint economical on a single node, but quality validation is still required before pushing INT4-style deployments into production.[^4][^3][^2]


### Compatibility Notes

* `transformers<4.51.0` can fail on Qwen3 model loading, so standardize on a newer release.[^1][^2]
* llama.cpp support starts at b5092 and the official Qwen guide shows GGUF-based execution with Qwen3-8B.[^3]
* vLLM 0.8.5 supports serving the model, while vLLM 0.9.0 adds `qwen3` reasoning-parser support for cleaner reasoning-content extraction.[^2]


### Common Pitfalls

* Pitfall: enabling YaRN by default for all traffic. Mitigation: apply it only for requests that need long context, because the official docs warn about shorter-text regression.[^3][^2]
* Pitfall: staying on an old Transformers version. Mitigation: move to 4.51.0+ before deployment.[^1][^2]
* Pitfall: treating local quantized serving as interchangeable with BF16 serving. Mitigation: validate task quality after quantization, because the deployment trade-off is quality versus memory, not just file size.[^4][^3][^2]


## Related Models

| ID | Relationship |
| :-- | :-- |
| Qwen3-14B | Larger dense sibling with more capacity and higher serving cost.[^2] |
| Qwen3-4B | Smaller dense sibling for lower-cost and lower-memory deployments.[^2] |
| Qwen3-30B-A3B | MoE sibling with lower active-parameter cost but much larger total checkpoint footprint.[^2] |

## Further Study

### Research Papers

* **Qwen3 Technical Report** - Qwen Team, Alibaba Cloud.[^1]


### Official Documentation

* **Qwen/Qwen3-8B model card** - Qwen Team, Alibaba Cloud.[^2]
* **Qwen3 download portal** - Qwen Team, Alibaba Cloud.[^2]
* **llama.cpp - Qwen** - Qwen documentation.[^3]
* **vLLM - Qwen** - Qwen documentation.[^2]


### Engineering Blogs

* **Qwen3 release and usage guidance** - Qwen Team, Alibaba Cloud.[^2]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23][^24][^25][^26][^27][^28][^29][^30][^31][^32][^33][^34][^35][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://www.semanticscholar.org/paper/d8600afc944f9fbe2414fbebfd86cf32f5c27f6a

[^2]: https://formative.jmir.org/2026/1/e72604

[^3]: https://dl.acm.org/doi/10.1145/3795496.3795712

[^4]: https://arxiv.org/abs/2605.09635

[^5]: https://arxiv.org/abs/2602.04019

[^6]: https://arxiv.org/pdf/2309.16609.pdf

[^7]: https://arxiv.org/pdf/2308.12966.pdf

[^8]: http://arxiv.org/pdf/2405.04532.pdf

[^9]: https://huggingface.co/Qwen/Qwen3-8B

[^10]: https://huggingface.co/Qwen/Qwen3-Embedding-8B

[^11]: https://huggingface.co/collections/Qwen/qwen3

[^12]: https://huggingface.co/jhghar/jh-qwen3-8b

[^13]: https://tomodahinata.com/en/blog/qwen3-8b-awq-self-hosting-reasoning-production-guide

[^14]: https://huggingface.co/ojus1/Qwen3-8B-Instruct

[^15]: https://huggingface.co/Qwen/Qwen3-VL-8B-Instruct

[^16]: https://www.together.ai/models/qwen3-8b

[^17]: https://huggingface.co/melvindave/Qwen3-8B-SFT

[^18]: https://huggingface.co/ISTA-DASLab/Qwen3-8B-MatGPTQ

[^19]: https://arxiv.org/abs/2604.09852

[^20]: https://arxiv.org/abs/2512.02874

[^21]: https://hnuejs.edu.vn/ns/article/view/1284

[^22]: https://ieeexplore.ieee.org/document/11571718/

[^23]: https://arxiv.org/abs/2604.15379

[^24]: https://aacrjournals.org/cancerres/article/86/7_Supplement/2738/778490/Abstract-2738-From-chaos-to-columns-High-accuracy

[^25]: http://medrxiv.org/lookup/doi/10.64898/2026.05.27.26353695

[^26]: https://qwen.readthedocs.io/en/latest/deployment/vllm.html

[^27]: https://huggingface.co/Qwen/Qwen3-8B-GGUF

[^28]: https://qwen.readthedocs.io/en/latest/quantization/llama.cpp.html

[^29]: https://docs.sglang.io/docs/hardware-platforms/ascend-npus/model-tutorials/qwen3-8b

[^30]: https://qwen.readthedocs.io/en/latest/run_locally/llama.cpp.html

[^31]: https://docs.sglang.io/docs/hardware-platforms/ascend-npus/best_practice/qwen3-8b

[^32]: https://huggingface.co/RedHatAI/Qwen3-8B-quantized.w4a16

[^33]: https://huggingface.co/distil-labs/docstring-qwen3-8b?local-app=vllm

[^34]: https://qwen.readthedocs.io/zh-cn/latest/quantization/llama.cpp.html

[^35]: https://lmsysorg.mintlify.app/docs/hardware-platforms/ascend-npus/model-tutorials/qwen3-8b

