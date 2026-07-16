<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Code Llama 34B Instruct

## Overview

Code Llama 34B Instruct is Meta’s instruction-tuned code model for production code completion, refactoring, and code-aware chat, with the capacity to handle larger code contexts than the 7B/13B tiers while retaining the Code Llama family’s code-specialized training. It is the right choice when code quality and instruction-following matter more than latency, but the deployment cost jumps sharply into multi-GPU territory compared with smaller Code Llama variants. The key engineering trade-off is that you buy better code synthesis and broader context handling at the cost of substantially higher memory, serving complexity, and strict English/code-oriented usage constraints.[^1][^2][^3]

## Identity

* **Family:** Code Llama.[^2][^1]
* **Variant:** code-llama-34b-instruct.[^1][^2]
* **Provider:** Meta AI.[^2][^1]
* **Size:** 34,000 MB, based on 34B parameters in BF16 checkpoint form.[^3][^2]


## Specifications

* **Parameter Count:** 34B.[^1][^2]
* **Hidden Size:** 8192.[^3]
* **Layers:** 48.[^3]
* **Attention Heads:** 64.[^3]
* **Vocab Size:** 32000.[^3]
* **Training Tokens:** 500B tokens of code and code-related data.[^2]
* **Context Window:** 16K trained context; Code Llama models provide stable generations with up to 100K tokens of context according to Meta’s release blog.[^2]
* **Max Output Tokens:** Not Published.

Differentiation: the 34B tier is the upper practical quality tier in the original Code Llama family before the 70B jump, so it is the family’s balance point for production code workloads that need more capability than 13B but cannot justify 70B cost.[^1][^2]

## File Formats

* **Safetensors:** Yes.[^2]
* **GGUF:** Yes (community conversions exist).[^4]
* **AWQ:** Yes (community quantization support exists).[^4]
* **GPTQ:** Yes (community quantization support exists).[^4]
* **MLX:** Partial / Community.[^4]
* **ONNX:** Partial / Community.[^4]
* **TensorRT:** Yes via ecosystem conversion workflows.[^4]

Differentiation: Code Llama 34B is often consumed through quantized artifacts because the raw BF16 checkpoint is too large for many single-node deployments.[^3][^4]

## Hardware Requirements

(Community recommendations; not official minimums.)

* **Minimum GPU Memory:** Approximately 48 GB GPU memory for practical BF16 serving. Recommendation, not official.[^4]
* **Recommended GPU Memory:** 64 GB+ for BF16 headroom, batching, and long-context code workflows. Recommendation, not official.[^4]
* **Minimum RAM:** 32 GB system RAM recommended for local orchestration and cache overhead. Recommendation, not official.[^4]
* **Recommended RAM:** 64 GB+ for stable multi-process or sharded serving. Recommendation, not official.[^4]
* **Disk Space:** Official model card distributes the checkpoint through Hugging Face; provision tens of GB for weights and runtime artifacts. Official page does not publish a separate disk figure.[^2]
* **Recommended GPU:** NVIDIA A100/L40S/H100-class GPUs or comparable high-memory accelerators are the common production recommendation. Recommendation, not official.[^4]

Differentiation: 34B is the point where code quality improvements typically require a step up from single-consumer-GPU deployments into datacenter-style memory planning.[^2][^4]

## Downloads

| Platform | URL | Official | Notes |
| :-- | :-- | :-- | :-- |
| Hugging Face model card | https://huggingface.co/codellama/CodeLlama-34b-Instruct-hf | No | Community mirror of the Meta checkpoint; useful for artifact access but not the official organization page.[^2] |
| Meta Llama downloads | https://ai.meta.com/resources/models-and-libraries/llama-downloads/ | Yes | Official Meta license and download entry point for Code Llama.[^2] |

Differentiation: the Hugging Face repo is a community mirror, while Meta’s download page is the official access path and license source of record.[^2]

## Runtime Compatibility

| Runtime | Supported | Minimum Version | Notes |
| :-- | :-- | :-- | :-- |
| Hugging Face Transformers | Yes | 4.32.0+ | The mirrored model card shows `transformers` usage and the config snapshot references 4.32.0.dev0.[^3] |
| vLLM | Yes | Latest stable / Not specified | Community support exists for Code Llama-family serving; confirm current template and quantization support in runtime docs.[^4] |
| llama.cpp | Yes | Latest stable / Not specified | Community support exists through conversion/quantization workflows.[^4] |
| SGLang | Yes | Not specified | Community serving support exists; verify current compatibility against runtime docs.[^4] |
| TensorRT-LLM | Yes | Latest stable / Not specified | Supported through ecosystem conversion workflows.[^4] |

Differentiation: the runtime question is mostly about throughput and memory behavior for long code contexts, not about whether the model can be loaded at all.[^2][^4]

## Deployment

* **Supported Runtimes:** Transformers is the explicitly documented path in the mirrored model card; Meta’s release materials point to the Code Llama GitHub ecosystem and official download path.[^3][^2]
* **Recommended Runtime:** vLLM for production GPU serving when batching and throughput matter, or Transformers for reference correctness and integration testing.[^3][^4]
* **Quantizations:** BF16 native; community INT8/INT4/AWQ/GPTQ-style quantizations exist.[^2][^4]
* **Recommended Quantization:** Use BF16 when code quality and infilling fidelity matter most; use INT4/AWQ or GPTQ only when memory pressure is the gating factor and you have validated code-generation regressions on your target workloads.[^4]
* **CPU Supported:** Yes, mainly via heavily quantized community paths.[^4]
* **GPU Supported:** Yes.[^2]
* **MPS Supported:** Not Published.

Differentiation: Code Llama 34B is meaningfully better suited to code generation than general-purpose Llama siblings, so the serving stack should be chosen around code-specific prompt/stop behavior and long-context memory use.[^3][^2]

## License

* **Name:** Code Llama custom commercial license / Llama 2-derived community license terms.[^2]
* **Commercial Use:** Yes, subject to the license and acceptable-use policy.[^2]
* **Modification:** Yes.[^2]
* **Redistribution:** Yes, with required notices and conditions.[^2]
* **Attribution Required:** Yes.[^2]
* **Notes:** Meta’s blog states Code Llama is released under the same community license as Llama 2, and the model card points to the Meta license page for full terms.[^2]

Differentiation: code assistants often ship inside commercial development tools, so license review is a launch requirement, not an afterthought.[^2]

## Status

* **Release Date:** August 24, 2023.[^2]
* **Maintenance Status:** legacy.[^2]

Differentiation: this is an older but still deployable code-specialized release; the main risk is ecosystem drift rather than model immaturity.[^3][^2]

## Engineering Snapshot

* **Best For:**
    - Code completion and infilling in IDE or editor-integrated services.[^1][^2]
    - Code-aware chat for refactoring, debugging, and explanation workflows.[^1][^2]
    - Internal developer tooling where code specialization matters more than open-ended general chat quality.[^2]
* **Avoid For:**
    - Non-code general-purpose chat, where a newer instruct model is a better fit.[^2]
    - Ultra-low-latency autocomplete on single small GPUs.
    - Deployments that require broad multilingual or general-reasoning strength over code specialization.[^2]
* **Deployment Complexity:** high.
* **Production Ready:** true.
* **Recommended Use Case:** production code assistant serving where the code-specialized training signal is worth the multi-GPU memory and latency cost.[^4][^2]

Differentiation: the main question is not capability in the abstract, but whether the code specialization materially improves developer productivity enough to justify the serving footprint.[^2]

## Engineering Notes

### Inference Notes

* Meta states Code Llama 34B is trained on 500B code/code-related tokens and supports stable generations with up to 100K tokens of context, which makes long-context codebase-assisted workflows the natural inference target.[^2]


### Deployment Notes

* The release blog explicitly says 34B and 70B “return the best results,” but smaller sizes are faster for low-latency use cases, so 34B should be selected when code quality is the first-order requirement.[^2]


### Optimization Notes

* Use quantization only after validating code-specific regressions, because code completion and infilling tasks are more sensitive to small distribution shifts than general chat.[^4]


### Compatibility Notes

* The model is documented as using text-only input and text-only output in the mirrored model card, so integrations should not expect multimodal behavior or image handling.[^3]


### Common Pitfalls

* A common failure mode is deploying the 34B variant as if it were a latency-first autocomplete model; mitigate by reserving it for higher-value code synthesis and pairing it with a smaller fallback model for fast path suggestions.[^4][^2]

Differentiation: 34B is the Code Llama family’s quality-biased production tier, and the right deployment pattern is usually a tiered system rather than a single universal model.[^4][^2]

## Related Models

| ID | Relationship |
| :-- | :-- |
| CodeLlama-13b-Instruct | Smaller sibling; lower cost and latency, reduced code quality. |
| CodeLlama-70b-Instruct | Larger sibling; higher quality, much higher serving cost. |
| Llama-3.1-70B-Instruct | General-purpose sibling; useful as a non-code baseline reference. |

## Further Study

### Research Papers

* Code Llama: Open Foundation Models for Code - Meta AI.[^2]


### Official Documentation

* Introducing Code Llama, a state-of-the-art large language model for coding - Meta AI.[^2]
* CodeLlama-34b-Instruct-hf model card - Hugging Face (community mirror of the official checkpoint).[^3]
* Download Llama - Meta AI.[^2]


### Engineering Blogs

* Introducing Code Llama, a state-of-the-art large language model for coding - Meta AI.[^2]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://arxiv.org/abs/2402.12348

[^2]: https://arxiv.org/pdf/2308.12950.pdf

[^3]: https://arxiv.org/pdf/2404.01226.pdf

[^4]: https://arxiv.org/pdf/2406.12793.pdf

[^5]: https://arxiv.org/pdf/2312.02120.pdf

[^6]: http://arxiv.org/pdf/2502.19852.pdf

[^7]: https://arxiv.org/pdf/2406.11409.pdf

[^8]: http://arxiv.org/pdf/2409.13928.pdf

[^9]: https://huggingface.co/codellama

[^10]: https://huggingface.co/codellama/CodeLlama-34b-Instruct-hf

[^11]: https://huggingface.co/codellama/CodeLlama-34b-Instruct-hf/discussions/13

[^12]: https://huggingface.co/codellama/CodeLlama-34b-Instruct-hf/blob/main/config.json

[^13]: https://huggingface.co/codellama/CodeLlama-34b-Instruct-hf/tree/main

[^14]: https://huggingface.co/codellama/CodeLlama-34b-Instruct-hf/commit/cebb11eacbeecb9189e910d57a8faeadb949978f

[^15]: https://ai.meta.com/blog/code-llama-large-language-model-coding/

[^16]: https://ai.meta.com/research/publications/code-llama-open-foundation-models-for-code/

[^17]: https://ai.meta.com/people/944324703766315/baptiste-roziere/

[^18]: https://huggingface.co/codellama/CodeLlama-34b-hf/commit/dd4b7972963ff10e2ab8ea50230ea819f807ee80

