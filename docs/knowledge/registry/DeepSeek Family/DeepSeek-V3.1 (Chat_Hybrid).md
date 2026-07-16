<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# DeepSeek-V3.1 (Chat/Hybrid)

## Overview

DeepSeek-V3.1 (Chat/Hybrid) is the family’s operationally flexible variant: one checkpoint with both thinking and non-thinking modes, plus stronger tool calling and agent behavior than the prior V3 generation. It is the best fit when you want to route some requests through reasoning while keeping standard chat latency for the rest, but you should plan for a frontier-scale 671B/37B MoE serving footprint on the full checkpoint.[^1][^2]

## Identity

* **Family:** DeepSeek
* **Variant:** v3.1-chat-hybrid
* **Provider:** DeepSeek AI
* **Size:** 671B parameters on the official model card.[^1]


## Specifications

* **Parameter Count:** 671B total, 37B activated per token.[^2][^1]
* **Hidden Size:** Not Published.
* **Layers:** Not Published.
* **Attention Heads:** Not Published.
* **Vocab Size:** Not Published.
* **Training Tokens:** 840B tokens continued pretraining for the V3.1 Base long-context extension, as stated in the official release note and model card context.[^2][^1]
* **Context Window:** 128K.[^1][^2]
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

* **Minimum GPU Memory:** Recommendation; not officially published. vLLM’s official recipe shows serving on 8xH200 or H20 GPUs (141GB × 8), which is a practical community/engineering baseline for the full checkpoint.[^3]
* **Recommended GPU Memory:** Recommendation; not officially published. Multi-GPU high-memory setups in the 8xH200 / 8xH20 class are the most directly documented path for production serving.[^3]
* **Minimum RAM:** Recommendation; not officially published.
* **Recommended RAM:** Recommendation; not officially published.
* **Disk Space:** Not Published in the retrieved official sources.
* **Recommended GPU:** Recommendation; not officially published. Community guidance favors H200/H20-class multi-GPU nodes for this full-size checkpoint.[^3]


## Downloads

| Platform | URL | Official | Notes |
| :-- | :-- | :-- | :-- |
| Hugging Face | https://huggingface.co/deepseek-ai/DeepSeek-V3.1 | Yes | Official open-source weights and model card.[^1] |
| Hugging Face | https://huggingface.co/deepseek-ai/DeepSeek-V3.1-Base | Yes | Official base checkpoint referenced by the release note.[^2][^1] |
| DeepSeek API Docs | https://api-docs.deepseek.com/news/news250821/ | Yes | Official release note describing hybrid mode, tool calling, and model updates.[^2] |

## Runtime Compatibility

| Runtime | Supported | Minimum Version | Notes |
| :-- | :-- | :-- | :-- |
| vLLM | Yes | Latest stable | Official vLLM recipe documents dynamic think/non-think switching, tool calling, and a multi-GPU serving configuration.[^3] |
| Transformers | Yes | Latest stable | Official model card shows Transformers loading and chat-template usage.[^1] |
| SGLang | Yes | Latest stable | Supported in the canonical deployment stack, but a minimum version was not published in retrieved sources. |
| llama.cpp | Not Published | Not specified | No official compatibility statement was retrieved. |
| TensorRT-LLM | Not Published | Not specified | No official compatibility statement was retrieved. |

## Deployment

* **Supported Runtimes:** Hugging Face Transformers, vLLM, and DeepSeek’s official API surfaces; the release note also documents chat-template and tool-calling behavior.[^2][^3][^1]
* **Recommended Runtime:** vLLM, because the official vLLM recipe documents per-request switching between thinking and non-thinking modes and shows the recommended multi-GPU serving layout.[^3]
* **Quantizations:** BF16, F8_E4M3, and F32 are explicitly shown on the official model card.[^1]
* **Recommended Quantization:** BF16 for safest fidelity, or F8_E4M3 when the serving stack supports it, because both are officially surfaced and the model is trained with FP8-aware scaling.[^1]
* **CPU Supported:** No.
* **GPU Supported:** Yes.
* **MPS Supported:** Not Published.


## License

* **Name:** MIT License.[^1]
* **Commercial Use:** Yes.[^1]
* **Modification:** Yes.[^1]
* **Redistribution:** Yes.[^1]
* **Attribution Required:** Yes.[^1]
* **Notes:** The official repository and weights are under MIT; downstream hosting terms may still differ on third-party platforms.[^1]


## Status

* **Release Date:** 2025-08-21 from the official DeepSeek release note.[^2]
* **Maintenance Status:** production.[^2][^1]


## Engineering Snapshot

* **Best For:**
    - Production chat systems that need both standard and reasoning paths in one variant.[^2][^1]
    - Agent workloads with tool use and multi-step search or code tasks.[^3][^2]
    - Mixed-quality/performance deployments where you want better price-performance than a reasoning-only model for routine traffic.[^2]
* **Avoid For:**
    - Single-GPU full-checkpoint serving.[^3]
    - Environments that require fully published internal dimensions before approval.[^1]
    - Workloads that need a pure reasoning-only model and can tolerate less chat flexibility.[^2]
* **Deployment Complexity:** high
* **Production Ready:** true
* **Recommended Use Case:** Use as the default DeepSeek deployment when the application needs both chat latency and selective thinking-mode capability without moving to a reasoning-only endpoint.[^3][^2]


## Engineering Notes

### Inference Notes

* V3.1’s main operational difference is mode switching: the same model supports both thinking and non-thinking behavior, and vLLM exposes that as a per-request toggle.[^3][^2]


### Deployment Notes

* The official vLLM recipe recommends an 8xH200 or H20 multi-GPU serving setup, which makes the full checkpoint a multi-node or high-end single-node deployment problem rather than a workstation model.[^3]


### Optimization Notes

* The model card states training with UE8M0 FP8 scale data format on weights and activations, which makes FP8-capable serving infrastructure especially relevant.[^1]


### Compatibility Notes

* DeepSeek V3.1 uses an updated tokenizer and chat template; the official release note explicitly points to the tokenizer config, so integrations should not assume the V3 template is drop-in identical.[^2][^1]


### Common Pitfalls

* Treating V3.1 as a generic chat model can break the think/non-think contract or tool-call formatting; mitigate by using the official chat template and validating both modes in your serving harness before production cutover.[^3][^2][^1]


## Related Models

| ID | Relationship |
| :-- | :-- |
| DeepSeek-V3.1-Base | Base checkpoint used for the hybrid chat release.[^2][^1] |
| DeepSeek-V3 | Prior generation predecessor with the same efficiency lineage.[^2][^1] |
| DeepSeek-V3.2 | Successor family member with the newer reasoning-first chat direction.[^4][^5] |
| DeepSeek-R1-0528 | Reasoning-heavy sibling used as the comparison target for V3.1 thinking mode.[^2][^1] |

## Further Study

### Research Papers

* [DeepSeek-V3 Technical Report](https://arxiv.org/pdf/2412.19437.pdf) - DeepSeek-AI.[^6]


### Official Documentation

* [DeepSeek-V3.1 Release](https://api-docs.deepseek.com/news/news250821/) - DeepSeek AI.[^2]
* [deepseek-ai/DeepSeek-V3.1](https://huggingface.co/deepseek-ai/DeepSeek-V3.1) - DeepSeek AI.[^1]
* [deepseek-ai/DeepSeek-V3.1-Base](https://huggingface.co/deepseek-ai/DeepSeek-V3.1-Base) - DeepSeek AI.[^1]
* [DeepSeek-V3.1 Usage Guide - vLLM Recipes](https://docs.vllm.ai/projects/recipes/en/latest/DeepSeek/DeepSeek-V3_1.html) - vLLM contributors.[^3]
* [DeepSeek-V3.1 | Generative AI on Vertex AI](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/deepseek/deepseek-v31) - Google Cloud.[^7]


### Engineering Blogs

* [Exciting news: DeepSeek-V3.1 from @deepseek_ai now runs on vLLM](https://x.com/vllm_project/status/1958580047658491947) - vLLM Project.[^8]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^9]</span>

<div align="center">⁂</div>

[^1]: https://huggingface.co/deepseek-ai/DeepSeek-V3.1-Base

[^2]: https://api-docs.deepseek.com/news/news250821/

[^3]: https://docs.vllm.ai/projects/recipes/en/latest/DeepSeek/DeepSeek-V3_1.html

[^4]: https://api-docs.deepseek.com/news/news251201/

[^5]: https://docs.vllm.ai/projects/recipes/en/latest/DeepSeek/DeepSeek-V3_2.html

[^6]: https://arxiv.org/pdf/2412.19437.pdf

[^7]: https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/deepseek/deepseek-v31

[^8]: https://x.com/vllm_project/status/1958580047658491947

[^9]: http://biorxiv.org/lookup/doi/10.64898/2026.02.03.703467

[^10]: https://arxiv.org/pdf/2401.14196.pdf

[^11]: https://arxiv.org/pdf/2403.05525.pdf

[^12]: https://docs.aws.amazon.com/he_il/bedrock/latest/userguide/model-card-deepseek-deepseek-v3-1.md

[^13]: https://huggingface.co/nvidia/DeepSeek-V3.1-NVFP4

[^14]: https://docs.vllm.ai/projects/ascend/zh-cn/latest/tutorials/models/DeepSeek-V3.1.html

[^15]: https://docs.vllm.ai/projects/ascend/en/main/user_guide/support_matrix/supported_models.html

[^16]: https://docs.vllm.ai/en/latest/features/reasoning_outputs/

