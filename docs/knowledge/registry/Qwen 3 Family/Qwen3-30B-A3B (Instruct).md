<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Qwen3-30B-A3B (Instruct)

## Overview

Qwen3-30B-A3B (Instruct) is the cost-efficiency point in Qwen3’s MoE line: 30.5B total parameters with only 3.3B active per token, which makes it materially cheaper to serve than the flagship 235B-A22B while retaining the family’s thinking/non-thinking controls and agent-oriented behavior. It is the variant to choose when you want reasoning-capable production inference on constrained hardware, but cannot justify the memory and throughput cost of the larger MoE checkpoint. The engineering trade-off is straightforward: lower serving cost and easier scaling than the flagship model, but less absolute reasoning headroom and long-context robustness than the top-end checkpoint.[^1][^2]

Variant differentiation: this is the family’s “efficient MoE” checkpoint, and its main value is that it preserves the Qwen3 reasoning/agent contract at a much lower active-parameter footprint than the flagship MoE model.[^2][^1]

## Identity

* **Family:** Qwen3.[^1][^2]
* **Variant:** 3-30b-a3b-instruct.
* **Provider:** Alibaba Cloud (Qwen Team).[^2][^1]
* **Size:** 30.5B parameters total; canonical MB size **Not Published** in the official sources reviewed here.[^2]

Variant differentiation: compared with dense 32B-class variants, this model is MoE-based and therefore materially changes deployment economics by activating only 3.3B parameters per token.[^2]

## Specifications

* **Parameter Count:** 30.5B total, 3.3B activated.[^2]
* **Hidden Size:** Not Published.
* **Layers:** 48.[^2]
* **Attention Heads:** 32 Q heads and 4 KV heads (GQA).[^2]
* **Vocab Size:** Not Published.
* **Training Tokens:** Not Published.
* **Context Window:** 32,768 natively and 131,072 with YaRN.[^2]
* **Max Output Tokens:** 32,768 recommended by the official model card; 38,912 suggested for highly complex math/programming workloads.[^2]

Variant differentiation: the official model card exposes the 48-layer, 128-expert / 8-active-expert MoE configuration, which is the key reason this checkpoint sits in a different serving class than dense Qwen3 models.[^2]

## File Formats

* **Safetensors:** Yes.[^2]
* **GGUF:** Yes.[^2]
* **AWQ:** Yes.[^2]
* **GPTQ:** Yes.[^2]
* **MLX:** Yes.[^2]
* **ONNX:** Not Published.
* **TensorRT:** Yes — supported through the Qwen3 deployment ecosystem and runtime guidance.[^2]

Variant differentiation: GGUF is especially relevant here because the 30B/3B active footprint is small enough to be practical for local quantized workflows, unlike the flagship MoE model that is typically cluster-first.[^2]

## Hardware Requirements

* **Minimum GPU Memory:** 16 GB is a community recommendation for heavily quantized single-GPU inference; BF16 serving generally needs substantially more and is not the recommended production path for this variant.[^3][^4]
* **Recommended GPU Memory:** 24–48 GB is a community recommendation for comfortable production serving with quantization and moderate concurrency; multi-GPU is still preferred for higher throughput or longer contexts.[^4][^3]
* **Minimum RAM:** 32 GB is a community recommendation for stable local or single-node deployment workflows.[^3][^4]
* **Recommended RAM:** 64 GB is a community recommendation for production hosts with caching and long-context workloads.[^4][^3]
* **Disk Space:** Not Published officially; plan for the checkpoint plus quantized variants and local cache overhead.
* **Recommended GPU:** NVIDIA RTX 4090 / A5000 / A6000-class or similar high-memory consumer/workstation GPU is a community recommendation for quantized serving; for BF16 or high-concurrency deployment, use multi-GPU infrastructure.[^3][^4]

Evidence note: these are recommendations from community deployment guidance rather than official minimums; official docs publish context, runtime, and model architecture, but not a hardware bill of materials.[^4][^3][^2]

Variant differentiation: this is the most deployable Qwen3 MoE checkpoint for cost-sensitive production, and hardware planning is mostly about whether you want quantized single-GPU service or BF16 multi-GPU service.[^3][^4][^2]

## Downloads

| Platform | URL | Official | Notes |
| :-- | :-- | :-- | :-- |
| Hugging Face | https://huggingface.co/Qwen/Qwen3-30B-A3B | Yes | Official checkpoint and model card for the instruct variant.[^2] |
| Qwen official download portal | https://qwen-3.com/en/download | Yes | Official family download portal with links to MoE, dense, and quantized assets.[^2] |
| Qwen collection | https://huggingface.co/collections/Qwen/qwen3 | Yes | Official family collection page for Qwen3 assets.[^2] |

Variant differentiation: use the Hugging Face model card for checkpoint-specific serving notes and the Qwen download portal for canonical distribution paths and quantized artifacts.[^2]

## Runtime Compatibility

| Runtime | Supported | Minimum Version | Notes |
| :-- | :-- | :-- | :-- |
| Transformers | Yes | Latest stable / 4.51.0+ | Official model card says Qwen3-MoE support is in latest Transformers and warns that versions below 4.51.0 can fail with `KeyError: 'qwen3_moe'`.[^2] |
| vLLM | Yes | 0.8.5+ | Official model card provides a vLLM serving example with `--enable-reasoning` and `--reasoning-parser deepseek_r1`.[^2] |
| SGLang | Yes | 0.4.6.post1+ | Official model card provides an SGLang serving example with `--reasoning-parser qwen3`.[^2] |
| llama.cpp | Yes | Latest stable | Official release guidance references local use with llama.cpp; minimum version not specified.[^2] |
| Ollama | Yes | Latest stable | Official release guidance lists Ollama support for local use.[^2] |
| LM Studio | Yes | Latest stable | Official release guidance lists LM Studio support for local use.[^2] |
| MLX-LM | Yes | Latest stable | Official release guidance lists MLX-LM support for local use.[^2] |
| TensorRT-LLM | Yes | Latest stable | Supported in the broader deployment ecosystem; minimum version not specified in the official model card.[^2] |

Variant differentiation: the runtime story is strongest for vLLM and SGLang because the official docs expose reasoning-mode controls directly, which matters for this instruct checkpoint’s behavior contract.[^2]

## Deployment

* **Supported Runtimes:** Transformers, vLLM, SGLang, Ollama, LM Studio, MLX-LM, llama.cpp, TensorRT-LLM.[^2]
* **Recommended Runtime:** vLLM for production serving because the official model card provides a direct OpenAI-compatible serving path and explicit reasoning-mode flags; SGLang is the alternative when you want the official qwen3 reasoning parser path.[^2]
* **Quantizations:** BF16 native, plus ecosystem support for GGUF, AWQ, and GPTQ quantized variants.[^2]
* **Recommended Quantization:** AWQ or GPTQ for production cost reduction when quality validation passes; BF16 only if you can afford the larger memory footprint and need maximum fidelity.[^4][^3][^2]
* **CPU Supported:** Yes, but only as a fallback or for heavily quantized local inference.[^3][^2]
* **GPU Supported:** Yes, and this is the primary production path.[^3][^2]
* **MPS Supported:** Yes for local Apple Silicon workflows via MLX-LM/GGUF, but not a primary production serving target.[^2]

Variant differentiation: the 30B-A3B instruct checkpoint is the best fit when you need reasoning-quality MoE behavior but want a materially smaller active-parameter budget than the flagship model.[^2]

## License

* **Name:** Apache 2.0.[^2]
* **Commercial Use:** Yes.
* **Modification:** Yes.
* **Redistribution:** Yes.
* **Attribution Required:** Yes.
* **Notes:** The official Qwen3 release/download materials identify Apache 2.0 licensing for the family’s released artifacts; verify the exact checkpoint page for derivative copies or repacks.[^2]

Variant differentiation: license terms do not materially distinguish this variant from the rest of the family; deployment economics are the differentiator.

## Status

* **Release Date:** 2025-04-28.[^2]
* **Maintenance Status:** production.[^2]

Variant differentiation: this checkpoint is released as an active production model, not a research-only artifact, and remains part of the current Qwen3 deployment stack.[^2]

## Engineering Snapshot

* **Best For:**
    - Cost-efficient reasoning services with explicit thinking/non-thinking behavior.[^1][^2]
    - Tool-using agents where lower active-parameter cost matters more than flagship-model headroom.[^2]
    - Quantized single-node or small-cluster deployment where budget is constrained but quality still matters.[^4][^3][^2]
* **Avoid For:**
    - Highest-stakes reasoning workloads that justify the flagship 235B-A22B MoE model.[^1][^2]
    - Ultra-low-latency workloads that need a tiny dense model instead of MoE routing.[^2]
    - Teams that cannot validate quantization effects on reasoning quality before rollout.[^4][^3]
* **Deployment Complexity:** moderate
* **Production Ready:** true
* **Recommended Use Case:** Production reasoning and agent serving with constrained compute budgets.[^2]


## Engineering Notes

### Inference Notes

* The official model card recommends `enable_thinking=True` by default and documents the `<think>...</think>` output structure for reasoning mode.[^2]
* For thinking mode, the official defaults are `Temperature=0.6`, `TopP=0.95`, `TopK=20`, `MinP=0`, and the model card explicitly warns against greedy decoding because it can degrade performance and cause repetition.[^2]
* The official model card recommends `max_new_tokens=32768` for most queries and up to `38912` for especially hard math/programming tasks.[^2]


### Deployment Notes

* The official model card recommends vLLM and SGLang as deployment targets, and provides concrete serving flags for both.[^2]
* YaRN is supported for long contexts, but the official docs warn that static YaRN can degrade shorter-text performance; only enable it when your workload needs >32K context.[^2]
* In practice, this checkpoint rewards careful output-length and KV-cache planning more than dense 30B-class models because MoE serving amplifies configuration mistakes.[^3][^4][^2]


### Optimization Notes

* Use YaRN only when long-context workloads require it; for short prompts it can reduce performance according to the official guidance.[^2]
* Prefer quantized serving for cost control, but validate reasoning-sensitive tasks before promoting INT4/INT3-style reductions to production.[^4][^3][^2]
* Preserve the model’s thinking/non-thinking switch in your middleware so you do not collapse the performance/latency trade-off the family was designed to expose.[^2]


### Compatibility Notes

* `transformers<4.51.0` can raise `KeyError: 'qwen3_moe'`, so treat 4.51.0+ as the minimum safe target for this checkpoint.[^2]
* The official prompt template uses `enable_thinking` plus `/think` and `/no_think` controls, so prompt middleware must preserve these semantics end to end.[^2]
* The official docs say vLLM and SGLang both expose reasoning-parser support, which is important for faithful deployment of instruct behavior.[^2]


### Common Pitfalls

* Pitfall: enabling YaRN by default for all traffic. Mitigation: only apply long-context scaling to requests that need it, because the official docs warn about degraded short-text performance.[^2]
* Pitfall: using an outdated Transformers release. Mitigation: standardize on 4.51.0+ before deployment.[^2]
* Pitfall: treating this as a dense-model memory problem. Mitigation: plan for MoE routing and quantization strategy early, because the active-parameter count is low but the checkpoint remains large and context-heavy.[^3][^4][^2]


## Related Models

| ID | Relationship |
| :-- | :-- |
| Qwen3-235B-A22B | Larger flagship MoE sibling with higher reasoning headroom and much heavier serving requirements.[^1][^2] |
| Qwen3-32B | Dense alternative with simpler deployment mechanics but no MoE efficiency benefit.[^1][^2] |
| Qwen3-14B | Smaller dense sibling for lower-cost deployments where 30B-A3B is too heavy.[^2] |

## Further Study

### Research Papers

* **Qwen3 Technical Report** - Qwen Team, Alibaba Cloud.[^1]


### Official Documentation

* **Qwen/Qwen3-30B-A3B model card** - Qwen Team, Alibaba Cloud.[^2]
* **Qwen3 download portal** - Qwen Team, Alibaba Cloud.[^2]


### Engineering Blogs

* **Qwen3 official release and usage guidance** - Qwen Team, Alibaba Cloud.[^2]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23][^24][^25][^26][^27][^28][^29][^30][^31][^32][^33][^34][^35][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://arxiv.org/abs/2511.21631

[^2]: https://arxiv.org/abs/2604.07035

[^3]: https://arxiv.org/abs/2603.13406

[^4]: https://arxiv.org/abs/2509.17765

[^5]: https://arxiv.org/abs/2512.20848

[^6]: https://www.semanticscholar.org/paper/f1f49f1dc0c4b9826484e86a777e44f353203a8a

[^7]: https://innovations.bmj.com/lookup/doi/10.1136/bmjinnov-2025-001529

[^8]: https://informatics.bmj.com/lookup/doi/10.1136/bmjhci-2025-101956

[^9]: https://huggingface.co/Qwen/Qwen3-30B-A3B

[^10]: https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-qwen-qwen3-coder-30b-a3b-instruct.html

[^11]: https://docs.aws.amazon.com/fr_fr/bedrock/latest/userguide/model-card-qwen-qwen3-coder-30b-a3b-instruct.md

[^12]: https://developer.puter.com/ai/qwen/qwen3-30b-a3b/

[^13]: https://huggingface.co/Qwen/Qwen3-Omni-30B-A3B-Instruct

[^14]: https://huggingface.co/Qwen/Qwen3-VL-30B-A3B-Thinking

[^15]: https://huggingface.co/lmstudio-community/Qwen3-30B-A3B-GGUF

[^16]: https://huggingface.co/Qwen/Qwen3-30B-A3B/tree/main

[^17]: https://docs.aws.amazon.com/zh_cn/bedrock/latest/userguide/model-cards-qwen.md

[^18]: https://docs.aws.amazon.com/zh_tw/bedrock/latest/userguide/model-card-qwen-qwen3-coder-30b-a3b-instruct.md

[^19]: https://www.semanticscholar.org/paper/a66bf00df696327d8dd2699c80f178262e2692d9

[^20]: https://dl.acm.org/doi/10.1145/3774904.3792953

[^21]: https://arxiv.org/abs/2603.08065

[^22]: https://arxiv.org/abs/2509.06346

[^23]: https://arxiv.org/pdf/2309.16609.pdf

[^24]: https://arxiv.org/pdf/2308.12966.pdf

[^25]: https://arxiv.org/pdf/2412.15115.pdf

[^26]: http://arxiv.org/pdf/2409.12191.pdf

[^27]: https://docs.vllm.ai/projects/ascend/en/latest/tutorials/models/Qwen3-30B-A3B.html

[^28]: https://docs.vllm.ai/projects/ascend/en/latest/tutorials/models/Qwen3-VL-30B-A3B-Instruct.html

[^29]: https://huggingface.co/ReallyFloppyPenguin/Qwen3-30B-A3B-GGUF

[^30]: https://docs.vllm.ai/projects/ascend/zh-cn/latest/tutorials/models/Qwen3-VL-30B-A3B-Instruct.html

[^31]: https://huggingface.co/Antigma/Qwen3-30B-A3B-GGUF

[^32]: https://huggingface.co/typhoon-ai/typhoon2.5-qwen3-30b-a3b-gguf

[^33]: https://docs.sglang.io/docs/hardware-platforms/ascend-npus/model-tutorials/qwen3_30b_a3b

[^34]: https://vllm-vacc.vastaitech.com/Qwen/Qwen3-30B-A3B

[^35]: https://docs.sglang.io/docs/hardware-platforms/ascend-npus/best_practice/qwen3_30b_a3b

