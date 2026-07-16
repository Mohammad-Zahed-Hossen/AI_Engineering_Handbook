<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# DeepSeek-R1-0528

## Overview

DeepSeek-R1-0528 is the updated R1 reasoning checkpoint and the variant to choose when you need stronger tool calling, lower hallucination risk, and production reasoning behavior rather than the more balanced chat orientation of V3.1/V3.2. The official release explicitly adds JSON output and function calling support, while the full checkpoint remains a frontier-scale 685B model that should be treated as a multi-GPU serving problem, not a single-node deployment.[^1][^2]

## Identity

* **Family:** DeepSeek
* **Variant:** r1-0528
* **Provider:** DeepSeek AI
* **Size:** 685B params on the official model page.[^1]


## Specifications

* **Parameter Count:** 685B.[^1]
* **Hidden Size:** Not Published.
* **Layers:** Not Published.
* **Attention Heads:** Not Published.
* **Vocab Size:** Not Published.
* **Training Tokens:** Not Published.
* **Context Window:** 128K on the official hosted references; the model card also states a maximum generation length of 64K tokens for evaluation settings, so deployment should use the endpoint-specific limit rather than assume a universal cap.[^3][^1]
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

* **Minimum GPU Memory:** Recommendation; not officially published. Community serving guidance points to 4- or 8-GPU FP8/FP4-class configurations for practical deployment.[^4]
* **Recommended GPU Memory:** Recommendation; not officially published. High-bandwidth multi-GPU systems are the most realistic choice for the full checkpoint.[^4]
* **Minimum RAM:** Recommendation; not officially published.
* **Recommended RAM:** Recommendation; not officially published.
* **Disk Space:** Not Published in the retrieved official sources.
* **Recommended GPU:** Recommendation; not officially published. vLLM guidance highlights 8xH200 with FP8 and 4xB200 with FP4 as preferred serving profiles, with 4- or 8-GPU Expert Parallel variants documented.[^4]


## Downloads

| Platform | URL | Official | Notes |
| :-- | :-- | :-- | :-- |
| Hugging Face | https://huggingface.co/deepseek-ai/DeepSeek-R1-0528 | Yes | Official open-source weights and model card.[^1] |
| DeepSeek API Docs | https://api-docs.deepseek.com/news/news250528/ | Yes | Official release note with open-source weights link and behavior changes.[^2] |
| Google Cloud Vertex AI | https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/deepseek/r1-0528 | Yes | Official hosted model listing for the 0528 variant.[^3] |

## Runtime Compatibility

| Runtime | Supported | Minimum Version | Notes |
| :-- | :-- | :-- | :-- |
| vLLM | Yes | Latest stable | Official vLLM recipes document serving DeepSeek-R1-0528 with tensor-parallel and expert-parallel configurations.[^4] |
| Transformers | Yes | Latest stable | Official model page provides standard HF loading path and model card metadata.[^1] |
| SGLang | Yes | Latest stable | Part of the canonical deployment stack, but no minimum version was published in retrieved official sources. |
| llama.cpp | Not Published | Not specified | No official compatibility statement was retrieved. |
| TensorRT-LLM | Not Published | Not specified | No official compatibility statement was retrieved. |

## Deployment

* **Supported Runtimes:** Hugging Face Transformers, vLLM, and DeepSeek’s official web/API surfaces; the release note also states API usage does not change from the prior thinking-mode interface.[^2][^1]
* **Recommended Runtime:** vLLM, because the official recipes document concrete multi-GPU deployment patterns and expert-parallel serving for this checkpoint.[^4]
* **Quantizations:** BF16, F8_E4M3, and F32 are explicitly listed on the official model page.[^1]
* **Recommended Quantization:** F8_E4M3 for hardware that supports it, or BF16 when you want the safer default, because both are officially exposed and the community serving recipes explicitly optimize around FP8/FP4 hardware paths.[^4][^1]
* **CPU Supported:** No.
* **GPU Supported:** Yes.
* **MPS Supported:** Not Published.


## License

* **Name:** MIT License.[^2][^1]
* **Commercial Use:** Yes.[^1]
* **Modification:** Yes.[^1]
* **Redistribution:** Yes.[^1]
* **Attribution Required:** Yes.[^1]
* **Notes:** The official repository states the code and DeepSeek-R1 series weights are under MIT and allow commercial use and distillation.[^1]


## Status

* **Release Date:** 2025-05-28 from the official release note.[^2]
* **Maintenance Status:** production.[^2][^1]


## Engineering Snapshot

* **Best For:**
    - Reasoning-first agent pipelines that benefit from explicit thinking behavior.[^2][^1]
    - Function-calling and JSON-output workflows where structured outputs matter.[^2]
    - Code, math, and multi-step logic tasks where reasoning depth matters more than chat latency.[^1]
* **Avoid For:**
    - Single-GPU full-checkpoint deployments.[^4]
    - Generic chat use cases where you do not need explicit reasoning or tool behavior.[^2][^1]
    - Workloads that cannot afford the latency and token overhead of reasoning-heavy inference.[^1]
* **Deployment Complexity:** high
* **Production Ready:** true
* **Recommended Use Case:** Use when the application needs a reasoning-centric endpoint with improved function calling and structured-output behavior, and the infrastructure can support frontier-scale MoE serving.[^4][^2]


## Engineering Notes

### Inference Notes

* The release notes say R1-0528 improves reasoning depth and supports JSON output plus function calling, so inference policy should preserve the thinking-mode contract rather than stripping it away.[^2][^1]


### Deployment Notes

* The official vLLM recipes show this checkpoint as a multi-GPU Expert Parallel deployment, which means scheduling, shard placement, and all-reduce behavior are central to capacity planning.[^4]


### Optimization Notes

* The community serving guidance emphasizes FP8 and FP4 paths on modern GPUs, so deployment performance is best when the hardware stack matches the model’s native low-precision path.[^4][^1]


### Compatibility Notes

* The model page says the tokenizer configuration matches the R1-0528 family conventions and that system prompts are now supported, which changes integration behavior relative to older R1 usage patterns.[^1]


### Common Pitfalls

* Treating R1-0528 like a plain chat model can break structured outputs or reasoning routing; the mitigation is to use the official thinking-mode and function-calling paths and validate output format end to end before production rollout.[^2][^1]


## Related Models

| ID | Relationship |
| :-- | :-- |
| DeepSeek-R1 | Prior reasoning baseline and direct predecessor.[^5][^1] |
| DeepSeek-V3.1 | Hybrid chat sibling with more balanced chat behavior.[^6][^7] |
| DeepSeek-V3.2 | Newer chat-first sibling with agent-oriented deployment positioning.[^8][^9] |
| DeepSeek-R1-0528-Qwen3-8B | Distilled sibling sharing the 0528 reasoning trace for smaller-scale deployment.[^1] |

## Further Study

### Research Papers

* [DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning](https://arxiv.org/pdf/2501.12948.pdf) - DeepSeek-AI.[^5]


### Official Documentation

* [DeepSeek-R1-0528 Release](https://api-docs.deepseek.com/news/news250528/) - DeepSeek AI.[^2]
* [deepseek-ai/DeepSeek-R1-0528](https://huggingface.co/deepseek-ai/DeepSeek-R1-0528) - DeepSeek AI.[^1]
* [DeepSeek R1 (0528) | Generative AI on Vertex AI](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/deepseek/r1-0528) - Google Cloud.[^3]
* [DeepSeek-V3 (R1) Usage Guide - vLLM Recipes](https://docs.vllm.ai/projects/recipes/en/latest/DeepSeek/DeepSeek-V3.html) - vLLM contributors.[^4]


### Engineering Blogs

* [How we optimized vLLM for DeepSeek-R1](https://developers.redhat.com/articles/2025/03/19/how-we-optimized-vllm-deepseek-r1) - Red Hat.[^10]
<span style="display:none">[^11][^12][^13][^14][^15][^16]</span>

<div align="center">⁂</div>

[^1]: https://huggingface.co/deepseek-ai/DeepSeek-R1-0528

[^2]: https://api-docs.deepseek.com/news/news250528/

[^3]: https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/deepseek/r1-0528

[^4]: https://docs.vllm.ai/projects/recipes/en/latest/DeepSeek/DeepSeek-V3.html

[^5]: https://arxiv.org/pdf/2501.12948.pdf

[^6]: https://api-docs.deepseek.com/news/news250821/

[^7]: https://huggingface.co/deepseek-ai/DeepSeek-V3.1-Base

[^8]: https://api-docs.deepseek.com/news/news251201/

[^9]: https://docs.vllm.ai/projects/recipes/en/latest/DeepSeek/DeepSeek-V3_2.html

[^10]: https://developers.redhat.com/articles/2025/03/19/how-we-optimized-vllm-deepseek-r1

[^11]: https://arxiv.org/pdf/2503.00624.pdf

[^12]: https://huggingface.co/deepseek-ai/DeepSeek-R1

[^13]: https://huggingface.co/unsloth/DeepSeek-R1-0528-GGUF/tree/main/UD-Q4_K_XL

[^14]: https://huggingface.co/nvidia/DeepSeek-R1-0528-NVFP4/commit/880c74034d5f3d7e98d4d7d937e6e6ec0f692363

[^15]: https://docs.vllm.ai/projects/ascend/en/latest/tutorials/models/DeepSeek-R1.html

[^16]: https://deepseeksai.com/r1/

