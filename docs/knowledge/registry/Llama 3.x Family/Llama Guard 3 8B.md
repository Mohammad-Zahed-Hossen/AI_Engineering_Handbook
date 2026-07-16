<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Llama Guard 3 8B

## Overview

Llama Guard 3 8B is Meta’s 8B safety-classification checkpoint for moderating LLM inputs and outputs, with explicit support for multilingual policy enforcement and tool-call abuse detection. It is the right choice when you need a guardrail model that is materially stronger than generic prompt rules but still cheap enough to sit in the critical path of production moderation pipelines. The main trade-off is lower false-positive control than a bespoke policy stack in some categories, so it should be deployed as part of a layered safety system rather than as the only enforcement layer.[^1][^2]

## Identity

* **Family:** Llama 3.1.[^1]
* **Variant:** guard-3-8b.[^1]
* **Provider:** Meta AI.[^1]
* **Size:** 8192 MB, based on 8B parameters in BF16 checkpoint form.[^1]


## Specifications

* **Parameter Count:** 8B.[^1]
* **Hidden Size:** Not Published in the accessible model card text.[^1]
* **Layers:** Not Published in the accessible model card text.[^1]
* **Attention Heads:** Not Published in the accessible model card text.[^1]
* **Vocab Size:** Not Published in the accessible model card text.[^1]
* **Training Tokens:** Not Published in the accessible model card text.[^1]
* **Context Window:** 8K context window for the guard model usage path.[^1]
* **Max Output Tokens:** Not Published.

Differentiation: compared with the general-purpose Llama 3.1 8B, this variant is specialized for safety classification, hazard labeling, and moderation decisions, not open-ended generation.[^1]

## File Formats

* **Safetensors:** Yes.[^1]
* **GGUF:** Yes (community conversions exist).[^3]
* **AWQ:** Yes (community quantization support exists).[^3]
* **GPTQ:** Yes (community quantization support exists).[^3]
* **MLX:** Partial / Community.[^3]
* **ONNX:** Partial / Community.[^3]
* **TensorRT:** Yes via ecosystem conversion workflows.[^2][^3]

Differentiation: this checkpoint is often used in inference chains, so format choice matters less for raw throughput than for latency and deployment footprint inside moderation services.[^3][^1]

## Hardware Requirements

(Community recommendations; not official minimums.)

* **Minimum GPU Memory:** Approximately 16 GB GPU memory for practical BF16 or quantized serving. Recommendation, not official.[^3]
* **Recommended GPU Memory:** 24 GB+ for headroom if the guard model is colocated with a primary model or used with batching. Recommendation, not official.[^3]
* **Minimum RAM:** 8 GB system RAM recommended for local or service-side deployment. Recommendation, not official.[^3]
* **Recommended RAM:** 16 GB+ for stable moderation services and cache headroom. Recommendation, not official.[^3]
* **Disk Space:** Official BF16 checkpoint is distributed through the model card; provision several GB for weights and runtime artifacts. Official page does not publish a separate disk figure.[^1]
* **Recommended GPU:** NVIDIA T4/L4/A10/A100-class GPUs are common community deployment targets for guard models. Recommendation, not official.[^3]

Differentiation: the guard model is small enough to colocate with many production systems, which is operationally important because moderation latency often sits on the request critical path.[^3][^1]

## Downloads

| Platform | URL | Official | Notes |
| :-- | :-- | :-- | :-- |
| Hugging Face model card | https://huggingface.co/meta-llama/Llama-Guard-3-8B | Yes | Official checkpoint and license entry point.[^1] |
| Meta Llama downloads | https://ai.meta.com/resources/models-and-libraries/llama-downloads/ | Yes | Official Meta access/download path.[^4] |

Differentiation: the official Hugging Face repo is the canonical artifact, while Meta’s download page is the access-control and license gateway.[^4][^1]

## Runtime Compatibility

| Runtime | Supported | Minimum Version | Notes |
| :-- | :-- | :-- | :-- |
| Hugging Face Transformers | Yes | 4.43+ | Official model card says the model is directly usable with Transformers and is supported since version 4.43.[^1] |
| vLLM | Yes | Latest stable / Not specified | Community/official ecosystem support exists; confirm guard-model chat templating and scoring path in your runtime docs.[^2][^3] |
| llama.cpp | Yes | Latest stable / Not specified | Community support exists for local/quantized deployment; verify exact chat-template behavior before use.[^3] |
| SGLang | Yes | Not specified | Community serving support exists; verify current compatibility against runtime docs.[^3] |
| TensorRT-LLM | Yes | Latest stable / Not specified | Ecosystem conversion path exists for NVIDIA deployments.[^2][^3] |

Differentiation: because the model outputs safety labels rather than free-form assistant responses, runtime compatibility is mostly about preserving prompt-template fidelity and decoding the first-token safety signal correctly.[^1]

## Deployment

* **Supported Runtimes:** Transformers is explicitly documented; Meta release materials also indicate that Llama Guard 3 is part of the Llama 3.1 reference implementations and safety tooling ecosystem.[^2][^1]
* **Recommended Runtime:** Hugging Face Transformers for reference correctness, or vLLM when colocating moderation with GPU inference services and you need lower per-request overhead.[^2][^3][^1]
* **Quantizations:** BF16 native; Meta also publishes an INT8 version, and community ecosystems provide INT4/AWQ/GPTQ-style artifacts.[^3][^1]
* **Recommended Quantization:** Use BF16 when moderation latency budget is acceptable and you want maximum fidelity; use INT8 when reducing service footprint matters and you can validate that false-positive behavior remains acceptable.[^1]
* **CPU Supported:** Yes, especially with quantization for lower-throughput moderation services.[^3]
* **GPU Supported:** Yes.[^2][^1]
* **MPS Supported:** Not Published.

Differentiation: this model is intended to be deployed alongside other Llama systems, so the best runtime is usually the one that minimizes cross-model operational friction rather than the one that maximizes standalone benchmark throughput.[^2]

## License

* **Name:** Llama 3.1 Community License.[^1]
* **Commercial Use:** Yes, subject to the license and acceptable-use policy.[^1]
* **Modification:** Yes.[^1]
* **Redistribution:** Yes, with required notices and conditions.[^1]
* **Attribution Required:** Yes.[^1]
* **Notes:** The 700M MAU commercial threshold applies, and redistributed copies must include the required attribution and the license text.[^1]

Differentiation: because guardrails are usually embedded in customer-facing systems, license obligations should be treated as part of the safety architecture, not just legal review.[^1]

## Status

* **Release Date:** July 23, 2024.[^2][^1]
* **Maintenance Status:** production.[^2][^1]

Differentiation: this is a released production safety checkpoint, not a research artifact, and Meta explicitly positions it for use with Llama 3.1 systems.[^2][^1]

## Engineering Snapshot

* **Best For:**
    - LLM input moderation in production chat systems.[^1]
    - Response filtering and policy enforcement for assistant outputs.[^1]
    - Tool-call and code-interpreter abuse screening in agent pipelines.[^1]
* **Avoid For:**
    - Open-ended assistant generation.
    - Single-point safety dependency without fallback policy logic.[^1]
    - Highly specialized domains that require always-current external facts for correctness-sensitive categories.[^1]
* **Deployment Complexity:** moderate.
* **Production Ready:** true.
* **Recommended Use Case:** inline safety moderation and guardrail enforcement around Llama and other LLM services.[^2][^1]

Differentiation: the core question is not “is it a good model?” but “is it a good control point?” — for most production stacks, the answer is yes if the model is used as one layer in a broader moderation system.[^1]

## Engineering Notes

### Inference Notes

* The model is an LLM that emits a safety decision and category labels; the model card notes that classifier scores can be derived from the first token probability, which makes calibration and thresholding the central inference concern.[^1]


### Deployment Notes

* Meta recommends deploying Llama Guard 3 together with Llama 3.1, which makes colocation and shared serving infrastructure the natural deployment pattern for production moderation.[^2][^1]


### Optimization Notes

* Meta’s quantized INT8 release is explicitly intended to reduce deployment cost while keeping behavior close to the BF16 checkpoint, so INT8 is the first compression step to consider when moderation capacity is the constraint.[^1]


### Compatibility Notes

* The model card states support in Transformers since 4.43, which is the safest reference path for correctness-sensitive moderation workflows.[^1]


### Common Pitfalls

* A common failure mode is assuming the guard model is a true classifier rather than a generative model; mitigate by using the first-token score or a tightly specified output parser and by validating threshold behavior on your own policy set.[^1]

Differentiation: Llama Guard 3’s quality is only useful if the post-processing layer correctly turns generative output into deterministic moderation decisions.[^1]

## Related Models

| ID | Relationship |
| :-- | :-- |
| Llama-3.1-8B-Instruct | Base family sibling; general-purpose assistant model. |
| Llama-Guard-3-8B-INT8 | Quantized sibling; lower-footprint deployment variant. |
| Llama Guard 3 Vision | Multimodal sibling for image+text safety screening. |

## Further Study

### Research Papers

* The Llama 3 Herd of Models - Meta AI.[^2]
* Llama Guard: LLM-based Input-Output Safeguard for Human-AI Conversations - Meta AI.[^5]


### Official Documentation

* meta-llama/Llama-Guard-3-8B model card - Hugging Face.[^1]
* Download Llama - Meta AI.[^4]


### Engineering Blogs

* Introducing Llama 3.1: Our most capable models to date - Meta AI.[^2]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://arxiv.org/pdf/2312.06674.pdf

[^2]: https://arxiv.org/html/2406.16330v1

[^3]: http://arxiv.org/pdf/2407.21783.pdf

[^4]: https://arxiv.org/pdf/2406.12793.pdf

[^5]: http://arxiv.org/pdf/2411.10414.pdf

[^6]: http://arxiv.org/pdf/2501.08335.pdf

[^7]: http://arxiv.org/pdf/2406.08478.pdf

[^8]: https://arxiv.org/html/2501.18492v1

[^9]: https://huggingface.co/meta-llama/Llama-Guard-3-8B

[^10]: https://huggingface.co/meta-llama

[^11]: https://ai.meta.com/llama/purple-llama

[^12]: https://huggingface.co/meta-llama/Llama-Guard-3-8B/discussions/21

[^13]: https://ai.meta.com/blog/meta-llama-3-1/

[^14]: https://huggingface.co/meta-llama/Llama-Guard-3-8B/tree/refs%2Fpr%2F16

[^15]: https://ai.meta.com/resources/models-and-libraries/llama-downloads/

[^16]: https://ai.meta.com/static-resource/responsible-use-guide/

[^17]: https://ai.meta.com/llama/get-started/

[^18]: https://huggingface.co/meta-llama/Llama-Guard-3-8B/discussions/12

