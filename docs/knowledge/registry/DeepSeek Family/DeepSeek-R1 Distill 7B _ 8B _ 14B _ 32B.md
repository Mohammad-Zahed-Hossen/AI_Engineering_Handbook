<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# DeepSeek-R1 Distill 7B / 8B / 14B / 32B

## Overview

DeepSeek-R1 Distill 7B / 8B / 14B / 32B is the distilled reasoning line for teams that want R1-style chain-of-thought behavior without the full 671B MoE serving footprint. The 7B and 8B variants are the practical low-cost endpoints, while 14B and especially 32B are the quality-first choices; all inherit the R1 prompting contract, longer thinking traces, and the need to preserve the model’s reasoning-oriented chat format in production.[^1][^2]

## Identity

* **Family:** DeepSeek
* **Variant:** 7b, 8b, 14b, 32b
* **Provider:** DeepSeek
* **Size:** 7B / 8B / 14B / 32B parameters, with official distilled checkpoints released for each size.[^3][^1]


## Specifications

* **Parameter Count:** 7B, 8B, 14B, and 32B depending on the selected variant.[^1][^3]
* **Hidden Size:** Not Published.
* **Layers:** Not Published.
* **Attention Heads:** Not Published.
* **Vocab Size:** Not Published.
* **Training Tokens:** 800k samples curated with DeepSeek-R1 for the Qwen-based distills; the official release does not publish a token count.[^2]
* **Context Window:** 32,768 maximum generation length used in the official evaluation/run instructions.[^2]
* **Max Output Tokens:** 32,768 maximum generation length in the official run instructions.[^2]


## File Formats

* **Safetensors:** Yes.[^3][^2]
* **GGUF:** Not Published.
* **AWQ:** Not Published.
* **GPTQ:** Not Published.
* **MLX:** Not Published.
* **ONNX:** Not Published.
* **TensorRT:** Not Published.


## Hardware Requirements

* **Minimum GPU Memory:** Recommendation; not officially published. Community practice treats 7B/8B as single-GPU-friendly and 32B as a substantially larger-memory deployment target.[^4][^2]
* **Recommended GPU Memory:** Recommendation; not officially published. 32B is the quality-first endpoint and is commonly served with tensor parallelism; 7B/8B fit far more easily on commodity GPUs.[^4][^2]
* **Minimum RAM:** Recommendation; not officially published.
* **Recommended RAM:** Recommendation; not officially published.
* **Disk Space:** Not Published in the retrieved official sources.
* **Recommended GPU:** Recommendation; not officially published. Community deployment guidance and official examples show 32B as the multi-GPU candidate, while 7B/8B are the easiest to host locally.[^4][^2]


## Downloads

| Platform | URL | Official | Notes |
| :-- | :-- | :-- | :-- |
| Hugging Face | https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-7B | Yes | Official 7B distilled checkpoint.[^2] |
| Hugging Face | https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Llama-8B | Yes | Official 8B distilled checkpoint.[^2] |
| Hugging Face | https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-14B | Yes | Official 14B distilled checkpoint.[^2] |
| Hugging Face | https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-32B | Yes | Official 32B distilled checkpoint.[^2] |

## Runtime Compatibility

| Runtime | Supported | Minimum Version | Notes |
| :-- | :-- | :-- | :-- |
| vLLM | Yes | Latest stable | The official release documents a vLLM serving command for the distilled models.[^2] |
| SGLang | Yes | Latest stable | The official release documents an SGLang serving command for the distilled models.[^2] |
| Transformers | Not Published | Not specified | The release states the distilled models can be used like Qwen or Llama models, but it does not explicitly publish a Transformers compatibility matrix.[^2] |
| llama.cpp | Not Published | Not specified | No official compatibility statement was retrieved. |
| TensorRT-LLM | Not Published | Not specified | No official compatibility statement was retrieved. |

## Deployment

* **Supported Runtimes:** vLLM and SGLang are explicitly documented in the official release; the models are also intended to be used like Qwen or Llama derivatives.[^2]
* **Recommended Runtime:** vLLM for self-hosted deployment, because the official release shows a concrete serving command and multi-GPU configuration for the 32B model.[^2]
* **Quantizations:** FP16/BF16 as the official baseline; the release does not enumerate low-bit formats, but the community ecosystem commonly serves these models in INT8/INT4/INT3 forms.[^2]
* **Recommended Quantization:** BF16 for the 14B/32B variants when reasoning fidelity is the priority, and lower-bit quantization for 7B/8B when cost and latency dominate.[^4][^2]
* **CPU Supported:** No.
* **GPU Supported:** Yes.
* **MPS Supported:** Not Published.


## License

* **Name:** MIT License for the DeepSeek-R1 series repository and weights; downstream base-model licenses still apply to the Qwen- and Llama-derived distills.[^2]
* **Commercial Use:** Yes.[^2]
* **Modification:** Yes.[^2]
* **Redistribution:** Yes.[^2]
* **Attribution Required:** Yes.[^2]
* **Notes:** The official release permits commercial use, modifications, and distillation, while noting that Qwen-derived checkpoints inherit Apache 2.0 lineage and Llama-derived checkpoints inherit Llama licenses.[^2]


## Status

* **Release Date:** 2025-01-20 from the official release note.[^2]
* **Maintenance Status:** production.[^2]


## Engineering Snapshot

* **Best For:**
    - Production reasoning endpoints that need much lower footprint than the full R1 model.[^1][^2]
    - Cost-sensitive agent workflows where explicit reasoning is still valuable.[^2]
    - Local or edge-adjacent deployments for code, math, and logic tasks, especially in 7B/8B form factors.[^2]
* **Avoid For:**
    - Systems that require the full frontier MoE capacity of DeepSeek-R1.[^1][^2]
    - Workloads that cannot tolerate long generation traces or higher token budgets from reasoning.[^2]
    - Ultra-low-latency chat tasks where reasoning overhead is unnecessary.[^2]
* **Deployment Complexity:** moderate
* **Production Ready:** true
* **Recommended Use Case:** Use the 7B/8B variants for cost-efficient reasoning in small deployments, and the 14B/32B variants when you need better reasoning quality and can pay the extra memory and latency cost.[^2]


## Engineering Notes

### Inference Notes

* The official usage recommendations warn against adding a system prompt and advise placing all instructions in the user prompt, which is a deployment-critical difference from many standard chat models.[^2]


### Deployment Notes

* The release recommends enforcing a leading `<think>\n` to keep the model in reasoning mode, which directly affects routing, prompt templates, and output parsing in production.[^2]


### Optimization Notes

* For math tasks, the official recommendation is to request step-by-step reasoning and a boxed final answer, which improves reliability for structured reasoning workloads.[^2]


### Compatibility Notes

* The distilled models are meant to be used like Qwen or Llama models, but the release explicitly says the local run settings and tokenizer/config should follow DeepSeek’s recommended settings rather than generic base-model defaults.[^2]


### Common Pitfalls

* Treating these distills as plain chat checkpoints can reduce reasoning quality or trigger malformed reasoning traces; mitigate this by preserving the R1 prompt contract, using the recommended temperature range, and testing output formatting before launch.[^2]


## Related Models

| ID | Relationship |
| :-- | :-- |
| DeepSeek-R1 | Teacher model used to generate the reasoning traces for distillation.[^2][^1] |
| DeepSeek-R1-0528 | Later R1 update with improved function/tool calling and reasoning behavior.[^5][^6] |
| DeepSeek-Coder 6.7B / 33B | Earlier code-focused sibling; useful when code generation matters more than reasoning traces.[^7] |

## Further Study

### Research Papers

* [DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning](https://arxiv.org/pdf/2501.12948.pdf) - DeepSeek-AI.[^1]


### Official Documentation

* [DeepSeek-R1 Release](https://api-docs.deepseek.com/news/news250120) - DeepSeek AI.[^2]
* [DeepSeek-R1-Distill-Qwen-7B](https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-7B) - DeepSeek AI.[^2]
* [DeepSeek-R1-Distill-Llama-8B](https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Llama-8B) - DeepSeek AI.[^2]
* [DeepSeek-R1-Distill-Qwen-14B](https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-14B) - DeepSeek AI.[^2]
* [DeepSeek-R1-Distill-Qwen-32B](https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-32B) - DeepSeek AI.[^2]


### Engineering Blogs

* [DeepSeek-R1: Model Access / deployment coverage](https://deepwiki.com/deepseek-ai/DeepSeek-R1/3.1-model-access) - DeepWiki.[^8]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^9]</span>

<div align="center">⁂</div>

[^1]: https://arxiv.org/pdf/2501.12948.pdf

[^2]: https://api-docs.deepseek.com/news/news250120

[^3]: https://deepseek-r1.com/deepseek-r1-distill-models/

[^4]: https://recipes.vllm.ai/deepseek-ai

[^5]: https://api-docs.deepseek.com/news/news250528/

[^6]: https://huggingface.co/deepseek-ai/DeepSeek-R1-0528

[^7]: https://arxiv.org/pdf/2401.14196.pdf

[^8]: https://deepwiki.com/deepseek-ai/DeepSeek-R1/3.1-model-access

[^9]: https://arxiv.org/abs/2501.12948

[^10]: https://arxiv.org/pdf/2503.00624.pdf

[^11]: https://arxiv.org/pdf/2503.12524.pdf

[^12]: https://arxiv.org/abs/2502.11164

[^13]: https://arxiv.org/pdf/2503.10460.pdf

[^14]: https://arxiv.org/pdf/2503.17365.pdf

[^15]: https://arxiv.org/html/2502.02523

[^16]: https://huggingface.co/deepseek-ai/DeepSeek-R1

[^17]: https://d-central.tech/ai/model/deepseek-r1/

[^18]: https://deepseeksr1.com/r1/

[^19]: https://deepseekai.guide/models/deepseek-r1-distill/

[^20]: https://gist.github.com/MayurakshaSikdar/fcccca77152af551cd3ed2ddee57e694

[^21]: https://deepseek-usa.ai/models/deepseek-r1/

[^22]: https://ollama.com/library/deepseek-r1:14b

