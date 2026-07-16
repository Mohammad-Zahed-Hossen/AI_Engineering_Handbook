<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# DeepSeek-V3.2 (Chat)

## Overview

DeepSeek-V3.2 (Chat) is the family’s production chat variant and the first DeepSeek-V3.2 release to integrate thinking directly into tool-use while still supporting non-thinking chat paths. It is the right choice when you want a single deployment target for general chat, mixed reasoning, and agent workflows, and can accommodate a frontier-class 685B-parameter checkpoint with BF16/F8 safetensors distribution and long-context serving requirements.[^1][^2]

## Identity

* **Family:** DeepSeek
* **Variant:** v3.2-chat
* **Provider:** DeepSeek AI
* **Size:** 685B params on the official Hugging Face model card.[^1]


## Specifications

* **Parameter Count:** 685B.[^1]
* **Hidden Size:** Not Published.
* **Layers:** Not Published.
* **Attention Heads:** Not Published.
* **Vocab Size:** Not Published.
* **Training Tokens:** Not Published.
* **Context Window:** 128K on the official Hugging Face model card content available here; some hosted surfaces document different limits, so production code should bind to the specific endpoint limit rather than assume one universal family-wide value.[^3][^1]
* **Max Output Tokens:** Not Published in the retrieved official model card content.[^1]


## File Formats

* **Safetensors:** Yes.[^1]
* **GGUF:** Not Published.
* **AWQ:** Not Published.
* **GPTQ:** Not Published.
* **MLX:** Not Published.
* **ONNX:** Not Published.
* **TensorRT:** Not Published.


## Hardware Requirements

* **Minimum GPU Memory:** Recommendation; not officially published. Community deployment guidance for this class of model typically treats 8x H100 / 8x H200 / 8x B200-class systems as the practical floor for comfortable serving of the full checkpoint.[^4][^5]
* **Recommended GPU Memory:** Recommendation; not officially published. Community guidance favors multi-GPU high-bandwidth setups in the 8xH100 to 8xB200 range for practical throughput and long-context capacity.[^5][^4]
* **Minimum RAM:** Recommendation; not officially published.
* **Recommended RAM:** Recommendation; not officially published.
* **Disk Space:** Not Published in the retrieved official sources.
* **Recommended GPU:** Recommendation; not officially published. Community guidance points to NVIDIA H100/H200/B200-class accelerators for full-size serving, with the exact choice driven by context length and quantization strategy.[^4][^5]


## Downloads

| Platform | URL | Official | Notes |
| :-- | :-- | :-- | :-- |
| Hugging Face | https://huggingface.co/deepseek-ai/DeepSeek-V3.2 | Yes | Official open-weight checkpoint and model card.[^1] |
| DeepSeek API Docs | https://api-docs.deepseek.com/news/news251201/ | Yes | Official release note with links to the open-source model release.[^2] |

## Runtime Compatibility

| Runtime | Supported | Minimum Version | Notes |
| :-- | :-- | :-- | :-- |
| vLLM | Yes | Latest stable | vLLM documents DeepSeek-V3.2 usage recipes and DeepSeek-specific tokenizer/tool-call handling.[^1] |
| Transformers | Yes | Latest stable | The official model card shows Hugging Face/Transformers loading and encoding examples.[^1] |
| SGLang | Yes | Latest stable | Common serving path for agentic LLM deployment; official minimum version not published. |
| llama.cpp | Yes | Latest stable | Commonly used for quantized community deployment; official minimum version not published. |
| TensorRT-LLM | Not Published | Not specified | No official compatibility statement was retrieved. |

## Deployment

* **Supported Runtimes:** Hugging Face Transformers, vLLM, and official DeepSeek API surfaces; the model card also includes local-running guidance and encoding helpers.[^2][^1]
* **Recommended Runtime:** vLLM for self-hosted serving, because DeepSeek publishes vLLM-specific usage guidance and the runtime has DeepSeek-specific tokenizer/tool-call support.[^1]
* **Quantizations:** BF16, F8_E4M3, and F32 are shown on the official model card; community quantized deployments also exist for smaller footprints, but those are not officially enumerated on the card.[^1]
* **Recommended Quantization:** BF16 for highest fidelity, or FP8/F8_E4M3 when the deployment stack and hardware support it, because the official card lists those tensor types directly.[^1]
* **CPU Supported:** No.
* **GPU Supported:** Yes.
* **MPS Supported:** Not Published.


## License

* **Name:** MIT License.[^1]
* **Commercial Use:** Yes.[^1]
* **Modification:** Yes.[^1]
* **Redistribution:** Yes.[^1]
* **Attribution Required:** Yes.[^1]
* **Notes:** The official repository and model weights are licensed under MIT; separate downstream hosting terms may still apply on third-party platforms.[^1]


## Status

* **Release Date:** 2025-12-01 on the official DeepSeek release note.[^2]
* **Maintenance Status:** production.[^2][^1]


## Engineering Snapshot

* **Best For:**
    - General production chat with reasoning-aware behavior.[^2][^1]
    - Tool-using agents that need thinking in tool-use.[^2]
    - Self-hosted high-capacity deployments that can absorb frontier-model memory and serving cost.[^5][^1]
* **Avoid For:**
    - Single-GPU or low-memory deployments of the full checkpoint.[^4][^5]
    - Workloads that require officially published hidden size, layer count, or training token counts before approval.[^1]
    - Environments that cannot support the model’s long-context memory and throughput demands.[^5][^1]
* **Deployment Complexity:** high
* **Production Ready:** true
* **Recommended Use Case:** Use as the primary DeepSeek chat endpoint when you need one model to cover chat, mixed reasoning, and tool-using agents with official open-weight availability.[^2][^1]


## Engineering Notes

### Inference Notes

* DeepSeek-V3.2 introduces “thinking in tool-use,” so production inference must handle both reasoning and non-reasoning paths instead of treating the model as a plain chat checkpoint.[^2][^1]


### Deployment Notes

* The official release positions V3.2 as the balanced daily-driver model, while the API-only Speciale variant is reserved for deeper reasoning; this makes V3.2 the operational default for production chat + agent systems.[^2]


### Optimization Notes

* Use BF16 or FP8-capable infrastructure when possible, since the official checkpoint exposes BF16 and F8_E4M3 tensor types and the community recipes emphasize sparse-attention efficiency for long-context serving.[^4][^1]


### Compatibility Notes

* The official model card includes custom encoding helpers rather than a Jinja chat template, so integration code should follow the provided encoding/parse utilities instead of assuming a standard template path.[^1]


### Common Pitfalls

* Treating V3.2 as a drop-in generic chat model can break tool-call behavior; the mitigation is to implement the DeepSeek-specific prompt/encoding path and explicitly test thinking-mode tool-use flows before rollout.[^2][^1]


## Related Models

| ID | Relationship |
| :-- | :-- |
| DeepSeek-V3.2-Speciale | Higher-compute reasoning sibling; API-only at release time.[^2] |
| DeepSeek-V3.2-Exp | Immediate predecessor and local-running reference for the architecture and deployment flow.[^2][^1] |
| DeepSeek-V3.1 | Earlier agent-era chat sibling in the same family.[^6][^7] |
| DeepSeek-R1 | Reasoning-first sibling for cases where explicit reasoning behavior is more important than balanced chat throughput.[^8][^9] |

## Further Study

### Research Papers

* [DeepSeek-V3.2: Pushing the Frontier of Open Large Language Models](https://huggingface.co/deepseek-ai/DeepSeek-V3.2/resolve/main/assets/paper.pdf) - DeepSeek-AI.[^2][^1]


### Official Documentation

* [DeepSeek-V3.2 Release](https://api-docs.deepseek.com/news/news251201/) - DeepSeek AI.[^2]
* [deepseek-ai/DeepSeek-V3.2](https://huggingface.co/deepseek-ai/DeepSeek-V3.2) - DeepSeek AI.[^1]
* [DeepSeek-V3.2 Usage Guide - vLLM Recipes](https://docs.vllm.ai/projects/recipes/en/latest/DeepSeek/DeepSeek-V3_2.html) - vLLM contributors.[^1]
* [DeepSeek-V3.2-Exp in vLLM: Fine-Grained Sparse Attention in Action](https://vllm.ai/blog/2025-09-29-deepseek-v3-2) - vLLM contributors.[^10]
* [DeepSeek with vLLM: Run and Serve DeepSeek Models Locally](https://chat-deep.ai/guide/deepseek-with-vllm/) - community deployment guide.[^11]


### Engineering Blogs

* [DeepSeek-V3.2-Exp on vLLM, Day 0: Sparse Attention for long-context inference](https://developers.redhat.com/articles/2025/10/03/deepseek-v32-exp-vllm-day-0-sparse-attention-long-context-inference) - Red Hat.[^4]
<span style="display:none">[^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23]</span>

<div align="center">⁂</div>

[^1]: https://docs.vllm.ai/projects/recipes/en/latest/DeepSeek/DeepSeek-V3_2.html

[^2]: https://api-docs.deepseek.com/news/news251201/

[^3]: https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-deepseek-deepseek-v3-2.html

[^4]: https://developers.redhat.com/articles/2025/10/03/deepseek-v32-exp-vllm-day-0-sparse-attention-long-context-inference

[^5]: https://app.daily.dev/posts/deepseek-v3-2-exp-in-vllm-fine-grained-sparse-attention-in-action-fbicpjq0j

[^6]: https://api-docs.deepseek.com/updates

[^7]: https://api-docs.deepseek.com/news/news250821/

[^8]: https://docs.aws.amazon.com/zh_cn/bedrock/latest/userguide/model-card-deepseek-deepseek-r1.html

[^9]: https://arxiv.org/pdf/2501.12948.pdf

[^10]: https://vllm.ai/blog/2025-09-29-deepseek-v3-2

[^11]: https://chat-deep.ai/guide/deepseek-with-vllm/

[^12]: https://www.nature.com/articles/s41598-026-61013-8

[^13]: https://journal.apsiri.com/jass/article/view/47

[^14]: https://arxiv.org/abs/2601.02023

[^15]: https://www.semanticscholar.org/paper/31ab0b39fbf13054d828e047d3cf83bb3e151309

[^16]: https://www.mdpi.com/2076-3417/16/11/5314

[^17]: https://link.springer.com/10.1007/s44163-026-01207-1

[^18]: https://link.springer.com/10.1208/s12248-025-01199-3

[^19]: https://ieeexplore.ieee.org/document/11348502/

[^20]: https://x.com/vllm_project/status/1996760535908642986

[^21]: https://docs.vllm.ai/projects/ascend/en/main/tutorials/models/DeepSeek-V3.2.html

[^22]: https://longbridge.com/en/news/268065762

[^23]: https://api-docs.deepseek.com/news/news250929

