<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Qwen-Coder (latest large, e.g., Qwen3-Coder-MoE)

## Overview

Qwen-Coder latest large is the Qwen code-specialist path for production code generation, agentic coding, and refactoring workloads, with the current official family collection showing 480B and 31B-class releases rather than a single small dense checkpoint. The deployment implication is that this variant sits at the high-capacity end of the Qwen code stack, so it is best used where quality and tool-use reliability justify very large serving footprints and more complex infrastructure. For self-hosted production, the practical trade-off is strong coding capability against heavy GPU memory, multi-node serving complexity, and greater sensitivity to quantization and routing choices than the smaller Qwen3 general models.[^1][^2]

## Identity

* **Family:** Qwen.
* **Variant:** qwen-coder-latest.
* **Provider:** Alibaba Cloud (Qwen Team).
* **Size:** Not Published as MB in the official sources reviewed here; the official Qwen3-Coder collection includes 480B and 31B-class model entries.[^1]


## Specifications

* **Parameter Count:** Not Published for the latest alias in the reviewed sources; the official collection surfaces 480B and 31B-class Qwen3-Coder variants.[^1]
* **Hidden Size:** Not Published.
* **Layers:** Not Published.
* **Attention Heads:** Not Published.
* **Vocab Size:** Not Published.
* **Training Tokens:** Not Published.
* **Context Window:** 262,144 for the official cloud-hosted Qwen3-Coder GA model card surfaced by Google Cloud/Vertex AI and Gemini Enterprise docs.[^3][^4]
* **Max Output Tokens:** 65,536 for the official cloud-hosted Qwen3-Coder GA model card surfaced by Google Cloud/Vertex AI and Gemini Enterprise docs.[^4][^3]


## File Formats

* **Safetensors:** Yes for official open-weight releases in the Qwen3-Coder collection.[^1]
* **GGUF:** Not Published in the official sources reviewed here for the latest alias.
* **AWQ:** Not Published.
* **GPTQ:** Not Published.
* **MLX:** Not Published.
* **ONNX:** Not Published.
* **TensorRT:** Not Published.


## Hardware Requirements

* **Minimum GPU Memory:** Unknown for the latest alias; community quantized 31B-class builds exist, but no authoritative minimum was published in the reviewed official sources.[^1]
* **Recommended GPU Memory:** 80 GB+ class GPU or multi-GPU serving is a community recommendation for the 480B-class code model; this is a recommendation, not an official requirement.[^5][^1]
* **Minimum RAM:** 64 GB is a community recommendation for local orchestration and shard management; this is a recommendation, not an official requirement.[^5][^1]
* **Recommended RAM:** 128 GB+ is a community recommendation for multi-GPU or CPU-offload-heavy serving; this is a recommendation, not an official requirement.[^5][^1]
* **Disk Space:** Not Published officially.
* **Recommended GPU:** NVIDIA H100 / A100 80GB-class or equivalent multi-GPU server is a community recommendation for production serving of the largest Qwen3-Coder releases; this is a recommendation, not an official requirement.[^5][^1]


## Downloads

| Platform | URL | Official | Notes |
| :-- | :-- | :-- | :-- |
| Hugging Face Qwen3-Coder collection | https://huggingface.co/collections/Qwen/qwen3-coder | Yes | Official Qwen collection containing the current Qwen3-Coder releases.[^1] |
| Qwen3-Coder GitHub repository | https://github.com/QwenLM/Qwen3-Coder | Yes | Official project repository for the code-specialized Qwen3 line.[^2] |
| Google Cloud model card | https://docs.cloud.google.com/vertex-ai/generative-ai/docs/maas/qwen/qwen3-coder?hl=ko | Yes | Official managed-service model card for Qwen3-Coder GA.[^3] |
| Gemini Enterprise model card | https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/qwen/qwen3-coder | Yes | Official managed-service model card for Qwen3-Coder GA.[^4] |

## Runtime Compatibility

| Runtime | Supported | Minimum Version | Notes |
| :-- | :-- | :-- | :-- |
| Transformers | Yes | Latest stable | Official Qwen3-Coder releases are distributed through the Qwen collection and the broader Qwen software stack.[^1][^2] |
| vLLM | Yes | Latest stable | vLLM maintains native Qwen model-family support in current docs; the latest large code model is intended for high-throughput serving on that path.[^5] |
| SGLang | Yes | Latest stable | Qwen’s deployment ecosystem uses SGLang for supported open-weight serving paths, though a minimum version was not verified in the reviewed sources.[^2] |
| llama.cpp | Not Published | Not specified | Not officially documented for the latest large Qwen3-Coder alias in the reviewed sources.[^1][^2] |
| Ollama | Not Published | Not specified | Not officially documented for the latest large Qwen3-Coder alias in the reviewed sources.[^1][^2] |
| LM Studio | Not Published | Not specified | Not officially documented for the latest large Qwen3-Coder alias in the reviewed sources.[^1][^2] |
| MLX-LM | Not Published | Not specified | Not officially documented for the latest large Qwen3-Coder alias in the reviewed sources.[^1][^2] |

## Deployment

* **Supported Runtimes:** Transformers, vLLM, and SGLang are the supported self-hosted paths visible in the official Qwen ecosystem and official Qwen3-Coder distribution points.[^2][^5][^1]
* **Recommended Runtime:** vLLM for production serving because the model family is intended for high-throughput inference and vLLM is the most operationally mature open-serving path in the reviewed documentation.[^5]
* **Quantizations:** Officially published open-weight distribution via safetensors is confirmed; other quantized artifacts are not officially documented in the reviewed sources for the latest alias.[^1]
* **Recommended Quantization:** Use BF16 or FP8 where available for quality-critical code generation; consider community quantization only after evaluating code-edit correctness and tool-call stability.[^5][^1]
* **CPU Supported:** Not Published.
* **GPU Supported:** Yes, and this is the primary production path.[^3][^1][^5]
* **MPS Supported:** Not Published.


## License

* **Name:** Not Published in the reviewed sources for the latest alias.
* **Commercial Use:** Not Published.
* **Modification:** Not Published.
* **Redistribution:** Not Published.
* **Attribution Required:** Not Published.
* **Notes:** The reviewed official sources did not expose a license block specific enough to safely normalize here; verify the artifact page before redistribution or commercial packaging.[^2][^1]


## Status

* **Release Date:** 2025-08-13 for the managed-service Qwen3-Coder GA release surfaced in official cloud model cards.[^4][^3]
* **Maintenance Status:** production.[^3][^4][^1]


## Engineering Snapshot

* **Best For:**
    - Code generation and autocomplete at high quality thresholds.[^2][^1]
    - Agentic coding workflows that require large context and tool-use reliability.[^4][^3][^1]
    - Refactoring and repository-scale code transformation tasks.[^2][^1]
* **Avoid For:**
    - Small single-GPU deployments with tight VRAM budgets.[^1][^5]
    - Simple code completion tasks that do not justify the serving footprint.[^2][^1]
    - Latency-sensitive edge inference where smaller Qwen3 or Qwen3-Coder siblings are sufficient.[^2][^1]
* **Deployment Complexity:** high
* **Production Ready:** true
* **Recommended Use Case:** Large-scale production coding assistants and agentic developer tooling where the model can be served on high-memory GPU infrastructure.[^3][^4][^5][^1]


## Engineering Notes

### Inference Notes

* The official cloud model cards expose a 262,144-token context length and 65,536-token max output, which materially changes KV-cache sizing and request admission policy compared with smaller coding models.[^4][^3]
* The large code-specialist line is intended for advanced software development tasks, so serving should preserve long-context capacity for repository-level prompts rather than aggressively truncating inputs.[^3][^4]
* For production, throughput-oriented engines such as vLLM are the most practical path when you need batching and concurrent code-agent requests.[^5]


### Deployment Notes

* The official Qwen3-Coder collection currently surfaces multiple large releases, which means variant pinning matters more than family-level selection if you need reproducible behavior across environments.[^1]
* Managed-service deployment via Google Cloud’s model cards is the cleanest path if you want the official 262K/65K limits without owning the full serving stack.[^4][^3]
* Self-hosted deployment should assume multi-GPU planning for the largest releases rather than trying to size them like small dense models.[^5][^1]


### Optimization Notes

* Keep prompt budgets large enough to preserve repository context; the official context window is one of the main reasons to choose this class.[^3][^4]
* Use quantization only after evaluating correctness on code-edit tasks, because code models are often more sensitive to quantization-induced regressions than chat models.[^1][^5]
* Route short completion requests to smaller siblings if you need to protect capacity for long-context agentic jobs.[^2][^1]


### Compatibility Notes

* The official Qwen3-Coder collection and official cloud model cards are the best source of truth for supported artifacts; the reviewed sources did not verify a full local-runtime matrix for GGUF, Ollama, or LM Studio.[^4][^3][^1]
* vLLM is the clearest verified self-hosting target among open runtimes in the reviewed material.[^5]
* Because official sources did not surface a per-artifact license section in the reviewed excerpts, verify licensing before mirroring or repackaging weights.[^2][^1]


### Common Pitfalls

* Pitfall: underprovisioning KV-cache for 262K-context jobs. Mitigation: size memory for the maximum realistic repository prompt rather than average prompt length.[^3][^4]
* Pitfall: assuming the latest large code model can be deployed like a small dense model. Mitigation: plan for multi-GPU or managed service deployment from the start.[^1][^5]
* Pitfall: treating quantized builds as drop-in replacements. Mitigation: validate patch correctness, tool-use behavior, and agent loop stability after quantization.[^5][^1]


## Related Models

| ID | Relationship |
| :-- | :-- |
| Qwen3-1.7B | Smaller dense sibling for lightweight local inference.[^1] |
| Qwen3-4B | Mid-size dense sibling with lower serving cost.[^1] |
| qwen3-coder-480b-a35b-instruct-maas | Managed-service deployment target for the largest official Qwen3-Coder release.[^3][^4] |

## Further Study

### Research Papers

* **Qwen3-Coder technical report** - Qwen Team, Alibaba Cloud.[^2]


### Official Documentation

* **Qwen3-Coder collection**[^1]
* **Qwen3-Coder GitHub repository**[^2]
* **Qwen3 Coder model card** - Google Cloud Vertex AI.[^3]
* **Qwen3 Coder model card** - Google Cloud Gemini Enterprise Agent Platform.[^4]
* **vLLM Qwen documentation**[^5]


### Engineering Blogs

* **Qwen3-Coder release and usage guidance** - Qwen Team, Alibaba Cloud.[^2][^1]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://ieeexplore.ieee.org/document/10333220/

[^2]: https://ieeexplore.ieee.org/document/11596975/

[^3]: https://arxiv.org/abs/2603.08640

[^4]: https://arxiv.org/abs/2604.01151

[^5]: https://ieeexplore.ieee.org/document/11515632/

[^6]: https://arxiv.org/abs/2603.09701

[^7]: https://www.semanticscholar.org/paper/e66fa51a53930d96633ac91a457adbeac1c453b2

[^8]: https://arxiv.org/abs/2605.31238

[^9]: https://huggingface.co/collections/Qwen/qwen3-coder

[^10]: https://huggingface.co/collections/mlx-community/qwen3-coder-moe

[^11]: https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/qwen/qwen3-coder

[^12]: https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-qwen-qwen3-coder-30b-a3b-instruct.html

[^13]: https://github.com/QwenLM/Qwen3-Coder

[^14]: https://cloud.google.com/vertex-ai/generative-ai/docs/maas/qwen/qwen3-coder?hl=ko

[^15]: https://docs.aws.amazon.com/zh_cn/bedrock/latest/userguide/model-cards-qwen.md

[^16]: https://huggingface.co/FreedomAISVR/Qwen3-Coder-30B-A3B-MXFP4-MOE-GGUF

[^17]: https://build.nvidia.com/qwen/qwen3-coder-480b-a35b-instruct/modelcard

[^18]: https://huggingface.co/unsloth/Qwen3-Coder-Next-GGUF/blame/80fcc02b816afc907fef49c9a0dc1cca4f84b75d/Qwen3-Coder-Next-MXFP4_MOE.gguf

