<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Qwen3-235B-A22B (Instruct)

## Overview

Qwen3-235B-A22B (Instruct) is the flagship sparse MoE production variant in the Qwen3 family, designed for hard reasoning, long-context chat, code, math, and complex tool-using agents with a strong emphasis on thinking/non-thinking control. It is operationally much heavier than dense mid-tier Qwen3 models, but its 235B total / 22B active design is the core deployment advantage when quality needs justify multi-GPU inference and MoE routing overhead. For production, the main decision is not whether it can run, but whether your serving stack, memory budget, and latency envelope can absorb a 128K-context MoE model with explicit reasoning behavior.[^1][^2]

Variant differentiation: this is the family’s highest-end instruct MoE checkpoint, and it exists to maximize reasoning quality and agent performance rather than minimize footprint.[^2][^1]

## Identity

* **Family:** Qwen3.[^1][^2]
* **Variant:** 3-235b-a22b-instruct.[^2][^1]
* **Provider:** Alibaba Cloud (Qwen Team).[^1][^2]
* **Size:** 235B parameters, BF16 checkpoint size **Not Published** as a canonical MB figure in the sources reviewed here.[^2]

Variant differentiation: the 235B/22B architecture places this model at the top of the family’s quality-cost curve, with deployment characteristics that are fundamentally closer to cluster-scale serving than to single-node inference.[^1][^2]

## Specifications

* **Parameter Count:** 235B total, 22B activated per token.[^2]
* **Hidden Size:** Not Published.
* **Layers:** 94.[^2]
* **Attention Heads:** 64 Q heads and 4 KV heads (GQA).[^^2]
* **Vocab Size:** Not Published.
* **Training Tokens:** Not Published.
* **Context Window:** 32,768 natively and 131,072 with YaRN in the official model card; later official service cards document 256K for the hosted 2507 service variant, but the reviewed instruct checkpoint card itself states 32K native / 128K YaRN capability.[^3][^2]
* **Max Output Tokens:** 32,768 in the official model card examples; 8K is documented for the hosted Bedrock service card for the 2507 service variant, not the base instruct checkpoint.[^3][^2]

Variant differentiation: the 235B A22B instruct model is the only clearly documented Qwen3 text MoE checkpoint in the reviewed sources with 94 layers, 128 experts, 8 active experts, and GQA split of 64 Q / 4 KV, which makes it the most operationally distinct Qwen3 family member for large-scale reasoning deployment.[^2]

## File Formats

* **Safetensors:** Yes.[^2]
* **GGUF:** Yes — supported through official/local ecosystem distribution and community exports.[^2]
* **AWQ:** Yes — listed in the official Qwen3 download page as a supported quantized distribution path.[^2]
* **GPTQ:** Yes — supported in the Qwen3 ecosystem and community quantized releases.[^2]
* **MLX:** Yes — local-use support is referenced by the official release materials.[^2]
* **ONNX:** Not Published.
* **TensorRT:** Yes — supported through official deployment guidance and downstream inference ecosystems.[^2]

Variant differentiation: unlike dense variants, this checkpoint is commonly served in BF16 plus quantized export forms, and those quantized paths are essential if you want to avoid full-cluster BF16 memory pressure.[^2]

## Hardware Requirements

* **Minimum GPU Memory:** 80 GB+ per GPU is a community recommendation for practical production serving of the unquantized BF16 MoE checkpoint; multi-GPU tensor-parallel or expert-parallel setups are the norm for this class.[^4][^5]
* **Recommended GPU Memory:** 4×80 GB or larger-class multi-GPU nodes are a community recommendation for comfortable serving with long-context headroom and batch concurrency.[^5][^4]
* **Minimum RAM:** 128 GB system RAM is a community recommendation for stable host-side orchestration, checkpoint handling, and larger KV/cache-adjacent workflows.[^4][^5]
* **Recommended RAM:** 256 GB system RAM is a community recommendation for production nodes that also handle long-context batching and serving orchestration.[^5][^4]
* **Disk Space:** Not Published in the official model card as a fixed number; plan around the checkpoint plus quantized variants and cache overhead.
* **Recommended GPU:** NVIDIA H100/H200-class or equivalent multi-GPU infrastructure is a community recommendation for BF16 production serving; for cost-sensitive production, use the strongest available multi-GPU cluster rather than a single consumer card.[^4][^5]

Evidence note: these are recommendations from community deployment guidance rather than official minimums; the official model card publishes architecture and context data but not a hard hardware bill of materials.[^5][^4][^2]

Variant differentiation: hardware is the defining difference for this variant — it is not a “big single GPU” model, and most deployment mistakes come from underestimating the memory needed for MoE routing plus 128K-context KV cache.

## Downloads

| Platform | URL | Official | Notes |
| :-- | :-- | :-- | :-- |
| Hugging Face | https://huggingface.co/Qwen/Qwen3-235B-A22B | Yes | Official model card and checkpoint page for the instruct checkpoint.[^2] |
| Qwen official download portal | https://qwen-3.com/en/download | Yes | Official Qwen download page with family download links and quantization pointers.[^2] |
| Qwen collection | https://huggingface.co/collections/Qwen/qwen3 | Yes | Official family collection page linking dense and MoE checkpoints.[^2] |

Variant differentiation: use the Hugging Face model card as the canonical source for checkpoint-specific specs, and the Qwen official download portal when you need the family’s supported distribution paths and quantized artifacts.[^2]

## Runtime Compatibility

| Runtime | Supported | Minimum Version | Notes |
| :-- | :-- | :-- | :-- |
| Transformers | Yes | Latest stable / 4.51.0+ | Official model card says Qwen3-MoE support is in latest Transformers and warns that versions below 4.51.0 can raise `KeyError: 'qwen3_moe'`.[^2] |
| vLLM | Yes | 0.8.5+ | Official model card explicitly recommends vLLM and gives a serving command with `--enable-reasoning` and `--reasoning-parser deepseek_r1`.[^2] |
| SGLang | Yes | 0.4.6.post1+ | Official model card explicitly recommends SGLang and shows `--reasoning-parser qwen3` plus tensor-parallel deployment.[^2] |
| llama.cpp | Yes | Latest stable | Official release materials and downstream ecosystem guidance support local GGUF serving; exact minimum version is not specified.[^2] |
| Ollama | Yes | Latest stable | Official release materials say Ollama support is available for local use.[^2] |
| LM Studio | Yes | Latest stable | Official release materials say LM Studio supports Qwen3 local use.[^2] |
| MLX-LM | Yes | Latest stable | Official release materials mention MLX-LM support for local use.[^2] |
| TensorRT-LLM | Yes | Latest stable | Supported through deployment ecosystem guidance, but the official model card does not publish a minimum version.[^2] |

Variant differentiation: this checkpoint’s documented runtime support is strongest in Transformers, vLLM, and SGLang; the model card also shows exact switching behavior for thinking mode, which matters more here than for smaller Qwen3 variants.[^2]

## Deployment

* **Supported Runtimes:** Transformers, vLLM, SGLang, Ollama, LM Studio, MLX-LM, llama.cpp, TensorRT-LLM.[^2]
* **Recommended Runtime:** vLLM for production serving when you need OpenAI-compatible endpoints, reasoning-mode support, and high-throughput batching; SGLang is the other official recommendation when you want explicit reasoning-parser control and structured serving configuration.[^2]
* **Quantizations:** BF16 native, plus community/official ecosystem support for AWQ, GPTQ, GGUF, and other quantized forms.[^2]
* **Recommended Quantization:** BF16 for maximum fidelity if you can afford the memory footprint; AWQ or GPTQ for production cost reduction when you have validated that reasoning quality remains acceptable.[^4][^2]
* **CPU Supported:** Yes, but only for non-latency-critical use cases or heavily quantized local inference.[^4][^2]
* **GPU Supported:** Yes, and this is the primary deployment path.[^4][^2]
* **MPS Supported:** Yes for local Apple Silicon workflows via MLX-LM/GGUF routes, but not a primary path for production serving.[^2]

Variant differentiation: the instruct MoE checkpoint is best treated as a service-tier model, not a local development model; the recommended deployment path is multi-GPU serving with explicit reasoning controls preserved end to end.[^2]

## License

* **Name:** Apache 2.0.[^2]
* **Commercial Use:** Yes.
* **Modification:** Yes.
* **Redistribution:** Yes.
* **Attribution Required:** Yes.
* **Notes:** The official Qwen3 release/download pages identify Apache 2.0 licensing for the released family artifacts; verify the exact checkpoint card for any derivative or repackaged copy.[^2]

Variant differentiation: the license posture is straightforward and not the reason to choose or reject this variant; deployment feasibility is the real gating factor.

## Status

* **Release Date:** 2025-04-28.[^3][^2]
* **Maintenance Status:** production.[^3][^2]

Variant differentiation: the hosted service lifecycle is active, and the checkpoint remains positioned as a production-grade flagship MoE model rather than a research-only release.[^3]

## Engineering Snapshot

* **Best For:**
    - Hard reasoning workloads where quality matters enough to justify MoE serving cost.[^1][^2]
    - Complex tool-using agents that benefit from native thinking mode and explicit reasoning parser support.[^2]
    - High-end chat and long-context enterprise deployments with 128K-class workflows.[^3][^2]
* **Avoid For:**
    - Small single-GPU deployments where latency and memory are tight.[^5][^4]
    - Teams that cannot operate multi-GPU MoE infrastructure or long-context KV-cache-heavy workloads.[^5][^4]
    - Cases where a dense 7B–32B model already meets quality requirements at much lower cost.[^1][^2]
* **Deployment Complexity:** high
* **Production Ready:** true
* **Recommended Use Case:** Cluster-scale reasoning and agent serving with explicit thinking-mode control and long-context support.[^3][^2]


## Engineering Notes

### Inference Notes

* The official model card recommends `enable_thinking=True` by default and documents separate thinking and non-thinking modes; for thinking mode, it recommends `Temperature=0.6`, `TopP=0.95`, `TopK=20`, `MinP=0`, and warns against greedy decoding because it can degrade quality and induce repetition.[^2]
* The model card also recommends `max_new_tokens=32768` for standard use and up to `38912` for especially hard math/programming benchmarks, which is a strong signal that output-length policy is part of the serving contract for this model.[^2]
* MoE routing plus long-context KV cache makes this variant materially more sensitive to batching and memory policy than dense family members.[^4][^2]


### Deployment Notes

* The official model card recommends vLLM and SGLang deployments, including explicit example commands with reasoning parsers; use those paths if you need production OpenAI-compatible serving with thinking-mode fidelity.[^2]
* For long contexts, the official guidance recommends YaRN and notes that static YaRN can hurt shorter-text performance, so only enable it when the workload actually needs >32K context.[^2]
* If you must serve this model in production, plan for multi-GPU sharding from day one; treating it like a large dense checkpoint is a common failure mode in practice.[^5][^4]


### Optimization Notes

* Use YaRN only when the application needs long-context inference; the model card warns that it can degrade short-text performance if enabled unnecessarily.[^2]
* Use quantization only after task validation, because the model’s main value is reasoning quality and aggressive compression can reduce that advantage.[^4][^2]
* For serving efficiency, preserve the model’s separate thinking/non-thinking behavior rather than flattening it into one generic chat path.[^2]


### Compatibility Notes

* The model card says `transformers<4.51.0` can fail with `KeyError: 'qwen3_moe'`, so the minimum safe compatibility target is at least Transformers 4.51.0.[^2]
* The official examples use `tokenizer.apply_chat_template(..., enable_thinking=True/False)`, so prompt formatting is not optional glue code; it is part of correct behavior.[^2]
* The model card states that both vLLM and SGLang expose `enable_thinking` controls, which means middleware must preserve those semantics end to end.[^2]


### Common Pitfalls

* Pitfall: enabling long-context scaling globally when most requests are short. Mitigation: enable YaRN only for workloads that need it, because the official model card warns about degraded short-text performance.[^2]
* Pitfall: underprovisioning memory for BF16 MoE serving. Mitigation: use multi-GPU planning and quantize only after measuring quality on your own tasks.[^5][^4]
* Pitfall: using a Transformers version older than 4.51.0. Mitigation: upgrade before deployment to avoid the documented `qwen3_moe` key error.[^2]


## Related Models

| ID | Relationship |
| :-- | :-- |
| Qwen3-30B-A3B | Smaller MoE sibling with lower active-parameter cost and easier deployment footprint.[^1][^2] |
| Qwen3-32B | Dense large-model alternative with simpler serving characteristics but lower top-end reasoning capacity than the flagship MoE checkpoint.[^1][^2] |
| DeepSeek-R1 | Alternative reasoning-first family for comparison when choosing a flagship reasoning model.[^1][^2] |

## Further Study

### Research Papers

* **Qwen3 Technical Report** - Qwen Team, Alibaba Cloud.[^1]
* **Qwen3-235B-A22B model card / checkpoint page** - Qwen Team, Alibaba Cloud.[^2]


### Official Documentation

* **Qwen3-235B-A22B Hugging Face model card**[^2]
* **Qwen3 download portal**[^2]
* **Amazon Bedrock model card for Qwen3 235B A22B 2507**[^3]


### Engineering Blogs

* **Qwen3 official release and usage guidance** - Qwen Team, Alibaba Cloud.[^2]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23][^24][^25][^26][^27][^28][^29][^30][^31][^32][^33][^34][^35][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://arxiv.org/abs/2511.21631

[^2]: https://arxiv.org/abs/2507.09104

[^3]: https://arxiv.org/abs/2505.08311

[^4]: https://arxiv.org/abs/2505.14464

[^5]: https://arxiv.org/abs/2603.18567

[^6]: https://linkinghub.elsevier.com/retrieve/pii/S0720048X25004024

[^7]: https://arxiv.org/abs/2508.16889

[^8]: https://linkinghub.elsevier.com/retrieve/pii/S2589004225019510

[^9]: https://huggingface.co/Qwen/Qwen3-235B-A22B

[^10]: https://huggingface.co/Qwen/Qwen3-235B-A22B/tree/main

[^11]: https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-qwen-qwen3-235b-a22b-2507.html

[^12]: https://docs.aws.amazon.com/id_id/bedrock/latest/userguide/model-card-qwen-qwen3-235b-a22b-2507.html

[^13]: https://huggingface.co/Qwen/Qwen3-VL-235B-A22B-Thinking

[^14]: https://qwen-3.com/en/download

[^15]: https://www.codesota.com/model/qwen3-235b-a22b

[^16]: https://developer.puter.com/ai/qwen/qwen3-235b-a22b/

[^17]: https://docs.aws.amazon.com/de_de/bedrock/latest/userguide/model-card-qwen-qwen3-235b-a22b-2507.md

[^18]: https://awsdocs-neuron.readthedocs-hosted.com/en/latest/libraries/nxd-inference/models/qwen3/qwen3_moe_235b.html

[^19]: https://arxiv.org/abs/2604.09613

[^20]: https://arxiv.org/abs/2604.08075

[^21]: https://arxiv.org/pdf/2309.16609.pdf

[^22]: https://arxiv.org/pdf/2308.12966.pdf

[^23]: https://arxiv.org/pdf/2412.15115.pdf

[^24]: http://arxiv.org/pdf/2409.12191.pdf

[^25]: http://arxiv.org/pdf/2406.10816.pdf

[^26]: https://arxiv.org/pdf/2502.13923.pdf

[^27]: https://docs.vllm.ai/projects/ascend/en/latest/tutorials/models/Qwen3-235B-A22B.html

[^28]: https://docs.vllm.ai/projects/ascend/en/releases-v0.20.2rc/tutorials/models/Qwen3-235B-A22B.html

[^29]: https://docs.vllm.ai/projects/ascend/zh-cn/latest/tutorials/models/Qwen3-235B-A22B.html

[^30]: https://docs.vllm.com.cn/projects/ascend/en/latest/tutorials/Qwen3-235B-A22B.html

[^31]: https://huggingface.co/AmpereComputing/qwen-3-a22b-235b-gguf

[^32]: https://github.com/vllm-project/vllm-ascend/blob/main/docs/source/tutorials/models/Qwen3-235B-A22B.md

[^33]: https://docs.sglang.io/docs/hardware-platforms/ascend-npus/best_practice/qwen3_235b_a22b

[^34]: https://docs.sglang.io/docs/hardware-platforms/ascend-npus/model-tutorials/qwen3_235b_a22b

[^35]: https://lmsysorg.mintlify.app/docs/hardware-platforms/ascend-npus/model-tutorials/qwen3_235b_a22b

