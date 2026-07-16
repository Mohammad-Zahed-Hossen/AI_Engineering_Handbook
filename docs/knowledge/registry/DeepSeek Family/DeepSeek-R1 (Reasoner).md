<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# DeepSeek-R1 (Reasoner)

## Overview

DeepSeek-R1 is the reasoning-first checkpoint in the DeepSeek family and is the variant to choose when chain-of-thought quality, math, and tool-augmented reasoning matter more than chat-style latency or generality. The full model is a frontier-scale 671B/37B MoE deployment target, and the official vLLM recipes show that practical serving is a multi-GPU FP8/FP4 problem rather than a conventional single-node LLM deployment.[^1][^2][^3]

## Identity

* **Family:** DeepSeek
* **Variant:** r1-reasoner
* **Provider:** DeepSeek AI
* **Size:** 671B parameters on the official model page.[^1]


## Specifications

* **Parameter Count:** 671B total, 37B activated per token.[^2][^1]
* **Hidden Size:** Not Published.
* **Layers:** Not Published.
* **Attention Heads:** Not Published.
* **Vocab Size:** Not Published.
* **Training Tokens:** Not Published.
* **Context Window:** 128K.[^4][^1]
* **Max Output Tokens:** Not Published.


## File Formats

* **Safetensors:** Yes.[^1]
* **GGUF:** Not Published.
* **AWQ:** Not Published.
* **GPTQ:** Not Published.
* **MLX:** Not Published.
* **ONNX:** Not Published.
* **TensorRT:** Not Published.


## Hardware Requirements

* **Minimum GPU Memory:** Recommendation; not officially published. Community recipes show 8xH200 for FP8 and 4xB200 for FP4 as verified serving configurations.[^3][^2]
* **Recommended GPU Memory:** Recommendation; not officially published. High-bandwidth multi-GPU nodes are the documented path for production serving of the full checkpoint.[^2][^3]
* **Minimum RAM:** Recommendation; not officially published.
* **Recommended RAM:** Recommendation; not officially published.
* **Disk Space:** Not Published in the retrieved official sources.
* **Recommended GPU:** Recommendation; not officially published. vLLM recipes and browsable serving guidance point to H200- and B200-class accelerators for practical deployment.[^3][^2]


## Downloads

| Platform | URL | Official | Notes |
| :-- | :-- | :-- | :-- |
| Hugging Face | https://huggingface.co/deepseek-ai/DeepSeek-R1 | Yes | Official base reasoning checkpoint and model card.[^1] |
| Hugging Face | https://huggingface.co/deepseek-ai/DeepSeek-R1-0528 | Yes | Official updated reasoning checkpoint used as the 0528 release target.[^5] |
| DeepSeek API Docs | https://api-docs.deepseek.com/news/news250120 | Yes | Official release note for the R1 family launch and license update.[^6] |

## Runtime Compatibility

| Runtime | Supported | Minimum Version | Notes |
| :-- | :-- | :-- | :-- |
| vLLM | Yes | Latest stable | Official recipes document DeepSeek-R1 serving on multi-GPU FP8/FP4 setups.[^2][^3] |
| Transformers | Yes | Latest stable | Official model card provides standard Hugging Face loading metadata.[^1] |
| SGLang | Yes | Latest stable | Part of the canonical deployment stack, but no minimum version was published in retrieved official sources. |
| llama.cpp | Not Published | Not specified | No official compatibility statement was retrieved. |
| TensorRT-LLM | Not Published | Not specified | No official compatibility statement was retrieved. |

## Deployment

* **Supported Runtimes:** Hugging Face Transformers, vLLM, and DeepSeek’s official API/chat surfaces.[^6][^1]
* **Recommended Runtime:** vLLM, because the official recipes provide concrete multi-GPU serving, expert-parallel, and quantized deployment paths for this checkpoint.[^2][^3]
* **Quantizations:** BF16, F8_E4M3, and F32 are explicitly shown on the official model page.[^1]
* **Recommended Quantization:** F8_E4M3 when the hardware supports it, because the official page surfaces FP8 tensors and the vLLM recipes are written around FP8/FP4 deployment efficiency.[^2][^1]
* **CPU Supported:** No.
* **GPU Supported:** Yes.
* **MPS Supported:** Not Published.


## License

* **Name:** MIT License.[^6][^1]
* **Commercial Use:** Yes.[^6][^1]
* **Modification:** Yes.[^6][^1]
* **Redistribution:** Yes.[^1][^6]
* **Attribution Required:** Yes.[^6][^1]
* **Notes:** The official DeepSeek release states the code and model weights are released under MIT, with commercial use and distillation allowed.[^1][^6]


## Status

* **Release Date:** 2025-01-20 from the official release note.[^6]
* **Maintenance Status:** production.[^1][^6]


## Engineering Snapshot

* **Best For:**
    - Math-heavy and multi-step reasoning workloads.[^6][^1]
    - Tool-rich agent pipelines that need explicit thinking behavior.[^7][^6]
    - Research-grade analysis where reasoning quality matters more than raw chat throughput.[^1]
* **Avoid For:**
    - Single-GPU full-checkpoint deployment.[^3][^2]
    - High-volume chat-only workloads that do not need reasoning traces.[^6][^1]
    - Latency-sensitive systems that cannot absorb reasoning-token overhead.[^1]
* **Deployment Complexity:** high
* **Production Ready:** true
* **Recommended Use Case:** Use as the primary reasoning endpoint when you need the strongest DeepSeek thinking behavior and can support frontier-scale multi-GPU inference.[^2][^6]


## Engineering Notes

### Inference Notes

* DeepSeek-R1 is explicitly a reasoning model, so serving policy should preserve thinking-mode behavior rather than collapsing it into plain chat output.[^6][^1]


### Deployment Notes

* The vLLM recipe shows verified FP8 and FP4 deployments with expert parallelism, which means shard placement and GPU topology are central to capacity planning.[^3][^2]


### Optimization Notes

* FP8 on H200 or FP4 on B200 is the documented performance path, making low-precision serving hardware a primary optimization lever rather than an optional tweak.[^3][^2]


### Compatibility Notes

* The model family is exposed through Hugging Face and DeepSeek’s API surfaces, so integration should target the official tokenizer/model-card contract rather than ad hoc prompt formatting.[^1][^6]


### Common Pitfalls

* Using the model as a general chat substitute can produce unnecessary reasoning overhead and cost; mitigate by routing only tasks that actually benefit from explicit reasoning traces to this checkpoint.[^6][^1]


## Related Models

| ID | Relationship |
| :-- | :-- |
| DeepSeek-R1-0528 | Updated reasoning sibling with the 0528 release and enhanced function/tool behavior.[^8][^5] |
| DeepSeek-V3.1 | Hybrid chat sibling with lighter reasoning emphasis.[^9][^10] |
| DeepSeek-V3.2 | Newer chat-focused sibling with broader agent orientation.[^11][^12] |
| DeepSeek-R1-Distill series | Smaller reasoning descendants for lower-cost deployment.[^6][^1] |

## Further Study

### Research Papers

* [DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning](https://arxiv.org/pdf/2501.12948.pdf) - DeepSeek-AI.[^13]


### Official Documentation

* [DeepSeek-R1 Release](https://api-docs.deepseek.com/news/news250120) - DeepSeek AI.[^6]
* [deepseek-ai/DeepSeek-R1](https://huggingface.co/deepseek-ai/DeepSeek-R1) - DeepSeek AI.[^1]
* [DeepSeek-R1-0528](https://huggingface.co/deepseek-ai/DeepSeek-R1-0528) - DeepSeek AI.[^5]
* [DeepSeek-R1 | vLLM Recipes](https://recipes.vllm.ai/deepseek-ai/DeepSeek-R1) - vLLM contributors.[^2]
* [DeepSeek on vLLM — 9 recipes](https://recipes.vllm.ai/browse) - vLLM contributors.[^3]
* [DeepSeek-R1-0528 Release](https://api-docs.deepseek.com/news/news250528/) - DeepSeek AI.[^8]


### Engineering Blogs

* [How we optimized vLLM for DeepSeek-R1](https://developers.redhat.com/articles/2025/03/19/how-we-optimized-vllm-deepseek-r1) - Red Hat.[^14]
<span style="display:none">[^15][^16][^17][^18][^19][^20][^21][^22][^23][^24][^25]</span>

<div align="center">⁂</div>

[^1]: https://huggingface.co/deepseek-ai/DeepSeek-R1

[^2]: https://recipes.vllm.ai/deepseek-ai/DeepSeek-R1

[^3]: https://recipes.vllm.ai/deepseek-ai

[^4]: https://deepwiki.com/deepseek-ai/DeepSeek-R1/3.1-model-access

[^5]: https://huggingface.co/deepseek-ai/DeepSeek-R1-0528

[^6]: https://api-docs.deepseek.com/news/news250120

[^7]: https://build.nvidia.com/deepseek-ai/deepseek-r1/modelcard

[^8]: https://api-docs.deepseek.com/news/news250528/

[^9]: https://api-docs.deepseek.com/news/news250821/

[^10]: https://huggingface.co/deepseek-ai/DeepSeek-V3.1-Base

[^11]: https://api-docs.deepseek.com/news/news251201/

[^12]: https://docs.vllm.ai/projects/recipes/en/latest/DeepSeek/DeepSeek-V3_2.html

[^13]: https://arxiv.org/pdf/2501.12948.pdf

[^14]: https://developers.redhat.com/articles/2025/03/19/how-we-optimized-vllm-deepseek-r1

[^15]: https://ieeexplore.ieee.org/document/11118878/

[^16]: https://www.emerald.com/tcj/article/22/3/515/1341068/DeepSeek-s-innovative-breakthroughs-and-choice

[^17]: https://arxiv.org/abs/2504.02670

[^18]: https://arxiv.org/abs/2505.08311

[^19]: https://arxiv.org/abs/2505.14464

[^20]: https://www.semanticscholar.org/paper/689927cfad91105e50de44a4bf73978ff872afe0

[^21]: https://www.semanticscholar.org/paper/b06b91637892b0c5e13da6c3dc0dde5c374ce971

[^22]: https://arxiv.org/abs/2604.04937

[^23]: https://huggingface.co/collections/deepseek-ai/deepseek-r1

[^24]: https://huggingface.co/nvidia/DeepSeek-R1-NVFP4

[^25]: https://recipes.vllm.ai/browse

