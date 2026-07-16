<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Llama 3.2 3B Instruct

## Overview

Llama 3.2 3B Instruct is Meta’s lightweight instruction-tuned text model for edge and on-device deployment, with 128K context, multilingual support, and a design target centered on latency-sensitive assistants and small agents. It is the practical choice when you need local or near-local inference, but the trade-off is that quality and tool-use depth are materially below the larger 11B/90B and 70B/405B families.[^1][^2]

## Identity

* **Family:** Llama 3.2.[^1]
* **Variant:** 3.2-3b-instruct.[^1]
* **Provider:** Meta AI.[^1]
* **Size:** 3210 MB, based on 3.21B parameters in BF16 checkpoint form.[^3][^1]


## Specifications

* **Parameter Count:** 3.21B.[^1]
* **Hidden Size:** Not Published in the accessible model card text.[^1]
* **Layers:** Not Published in the accessible model card text.[^1]
* **Attention Heads:** Not Published in the accessible model card text.[^1]
* **Vocab Size:** Not Published in the accessible model card text.[^1]
* **Training Tokens:** Up to 9T tokens pretraining data for the Llama 3.2 family text-only models.[^1]
* **Context Window:** 128K.[^2][^1]
* **Max Output Tokens:** Not Published.

Differentiation: the 3B tier is the family’s lowest-friction production entry point for on-device and edge workloads, and Meta explicitly positions it for multilingual dialogue, summarization, rewriting, and agentic retrieval on constrained hardware.[^2][^1]

## File Formats

* **Safetensors:** Yes.[^1]
* **GGUF:** Yes (community conversions exist).[^3]
* **AWQ:** Yes (community quantization support exists).[^3]
* **GPTQ:** Yes (community quantization support exists).[^3]
* **MLX:** Partial / Community.[^3]
* **ONNX:** Partial / Community.[^3]
* **TensorRT:** Yes via TensorRT-LLM conversion workflows and broader ecosystem support.[^2][^3]

Differentiation: unlike the 70B/405B tiers, 3B is routinely converted into compact on-device formats, so format choice has a first-order impact on whether you can ship to mobile/edge at all.[^2][^3][^1]

## Hardware Requirements

(Community recommendations; not official minimums.)

* **Minimum GPU Memory:** Approximately 8 GB GPU memory for BF16 or modest quantized serving in practical community deployments. Recommendation, not official.[^3]
* **Recommended GPU Memory:** 16 GB+ for comfortable headroom, batching, and longer prompts. Recommendation, not official.[^3]
* **Minimum RAM:** 8 GB system RAM recommended for local inference workflows. Recommendation, not official.[^3]
* **Recommended RAM:** 16 GB+ for stable local serving and cache headroom. Recommendation, not official.[^3]
* **Disk Space:** Official model card downloads are BF16 checkpoints; provision at least several GB for weights plus runtime cache. Official page does not publish a separate disk figure.[^1]
* **Recommended GPU:** Consumer GPUs such as RTX 3060/4060-class or Apple Silicon/Mobile NPUs in accelerated local runtimes are common community targets; exact platform choice depends on runtime and quantization. Recommendation, not official.[^2][^3]

Differentiation: 3B is the first Llama 3.2 tier where edge deployment is a primary design goal rather than a compressed fallback, so memory planning is about fitting within device constraints more than maximizing throughput.[^2][^1]

## Downloads

| Platform | URL | Official | Notes |
| :-- | :-- | :-- | :-- |
| Hugging Face model card | https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct | Yes | Official checkpoint and license entry point.[^1] |
| Meta Llama downloads | https://ai.meta.com/resources/models-and-libraries/llama-downloads/ | Yes | Official Meta download/access path.[^4] |

Differentiation: the Hugging Face checkpoint is the canonical serving artifact, while Meta’s download page is the access-control and license gateway.[^4][^1]

## Runtime Compatibility

| Runtime | Supported | Minimum Version | Notes |
| :-- | :-- | :-- | :-- |
| Hugging Face Transformers | Yes | 4.43.0+ | Official model card explicitly documents Transformers loading and generation usage.[^1] |
| llama.cpp | Yes | Latest stable / Not specified | Community-supported for local and quantized deployment; common for edge and desktop use.[^3] |
| vLLM | Yes | Latest stable / Not specified | Community/official ecosystem support for GPU serving; useful when you want batching on small GPU nodes.[^2][^3] |
| SGLang | Yes | Not specified | Community serving support exists; verify current compatibility against runtime docs.[^3] |
| TensorRT-LLM | Yes | Latest stable / Not specified | Supported through ecosystem conversion/serving workflows for NVIDIA deployments.[^2][^3] |

Differentiation: 3B has broad runtime flexibility because it sits at the boundary between server and device deployment, so your runtime choice should follow the target device class first.[^2][^3][^1]

## Deployment

* **Supported Runtimes:** Transformers and the original Llama codebase are explicitly referenced in the model card; the release blog also calls out ExecuTorch, Ollama, and partner ecosystem deployment paths.[^2][^1]
* **Recommended Runtime:** llama.cpp for desktop/offline local deployment, or Transformers/vLLM for server-side GPU serving, because 3B is intended to span both edge and datacenter-adjacent use cases.[^2][^3][^1]
* **Quantizations:** BF16 native; Meta documents quantized variants for 1B/3B and community ecosystems provide INT8/INT4/AWQ/GPTQ style artifacts.[^2][^3][^1]
* **Recommended Quantization:** Use BF16 when quality matters and device memory allows it; use the official/partner quantized paths when shipping to constrained devices because Meta explicitly designed 3B for such environments.[^2][^1]
* **CPU Supported:** Yes, especially via quantized local runtimes.[^3][^2]
* **GPU Supported:** Yes.[^2][^1]
* **MPS Supported:** Yes, in practice through community desktop runtimes; official minimum/version details are not specified.[^3]

Differentiation: 3B is uniquely sensitive to quantization policy because quantization is often the difference between “fits on device” and “does not ship,” which is not usually true for the larger Llama variants.[^1][^2]

## License

* **Name:** Llama 3.2 Community License.[^1]
* **Commercial Use:** Yes, subject to the license and acceptable-use policy.[^1]
* **Modification:** Yes.[^1]
* **Redistribution:** Yes, with required notices and conditions.[^1]
* **Attribution Required:** Yes.[^1]
* **Notes:** Meta requires acceptance of the community license and adherence to the acceptable-use policy; distribution obligations and the 700M MAU commercial threshold apply.[^1]

Differentiation: because 3B is likely to be embedded in shipped products, the license requirements affect product packaging and attribution workflows directly.[^1]

## Status

* **Release Date:** September 25, 2024.[^2][^1]
* **Maintenance Status:** production.[^2][^1]

Differentiation: 3B is a released, production-intent checkpoint optimized for practical deployment, not a research-only model.[^2][^1]

## Engineering Snapshot

* **Best For:**
    - On-device or edge assistants with strong privacy requirements.[^2][^1]
    - Latency-sensitive chat and rewriting workloads on constrained hardware.[^2][^1]
    - Lightweight agentic retrieval and summarization systems where local execution matters.[^2][^1]
* **Avoid For:**
    - Premium reasoning workloads that require the strongest possible model quality.[^3][^2]
    - Heavy multi-step tool use where 70B/405B quality is worth the added cost.[^3]
    - Deployments that cannot tolerate quantization-induced quality loss on narrow tasks.[^3][^1]
* **Deployment Complexity:** moderate.
* **Production Ready:** true.
* **Recommended Use Case:** local or edge production assistants that need multilingual coverage, 128K context, and low-latency inference.[^2][^1]

Differentiation: this is the family’s “deploy everywhere” variant, and its main value proposition is not absolute capability but the best balance of capability, footprint, and device reach.[^2][^1]

## Engineering Notes

### Inference Notes

* Meta explicitly states that the 1B/3B models are designed for constrained environments and that the released weights are BF16, with quantized variants intended for faster on-device inference.[^2]


### Deployment Notes

* The model card and release blog both point to edge/mobile deployments and on-device partner enablement, so device-specific runtime validation is a core launch task rather than an optimization afterthought.[^1][^2]


### Optimization Notes

* Quantized deployment is central to the 3B value proposition; Meta’s release describes 4-bit groupwise weight quantization and 8-bit activation handling for on-device inference paths.[^1]


### Compatibility Notes

* Transformers 4.43.0+ is the documented server-side path in the model card, while the release materials also emphasize ExecuTorch and partner runtimes for device deployment.[^2][^1]


### Common Pitfalls

* The main failure mode is treating 3B like a shrunken server model instead of an edge-first model; mitigate by validating the exact target runtime, tokenizer/template, and quantization on the actual device class before rollout.[^3][^1][^2]

Differentiation: 3B’s engineering center of gravity is portability, not peak quality, so deployment correctness depends heavily on choosing the right runtime and compression regime.[^3][^1][^2]

## Related Models

| ID | Relationship |
| :-- | :-- |
| Llama-3.2-1B-Instruct | Smaller sibling; lower memory and latency, lower capability. |
| Llama-3.1-8B-Instruct | Larger sibling; stronger quality, higher footprint. |
| Llama Guard 3-1B | Safety companion model for constrained environments. |

## Further Study

### Research Papers

* The Llama 3 Herd of Models - Meta AI.[^5]


### Official Documentation

* meta-llama/Llama-3.2-3B-Instruct model card - Hugging Face.[^1]
* Llama 3.2: Revolutionizing edge AI and vision with open, customizable models - Meta AI.[^2]
* Download Llama - Meta AI.[^4]


### Engineering Blogs

* Llama 3.2: Revolutionizing edge AI and vision with open, customizable models - Meta AI.[^2]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23][^24][^25][^26][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://arxiv.org/pdf/2302.13971.pdf

[^2]: https://arxiv.org/pdf/2411.17713.pdf

[^3]: https://arxiv.org/pdf/2308.12950.pdf

[^4]: http://arxiv.org/pdf/2407.21783.pdf

[^5]: http://arxiv.org/pdf/2406.08478.pdf

[^6]: https://arxiv.org/pdf/2304.15010.pdf

[^7]: http://arxiv.org/pdf/2411.10414.pdf

[^8]: http://arxiv.org/pdf/2304.08177.pdf

[^9]: https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct

[^10]: https://huggingface.co/meta-llama

[^11]: https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct/discussions/19

[^12]: https://ai.meta.com/llama/get-started/

[^13]: https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct/discussions/247

[^14]: https://ai.meta.com/resources/models-and-libraries/llama-downloads/

[^15]: https://ai.meta.com/blog/llama-3-2-connect-2024-vision-edge-mobile-devices/

[^16]: https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct/discussions/13

[^17]: https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct/discussions

[^18]: https://ai.meta.com/blog/meta-llama-quantized-lightweight-models/

[^19]: https://arxiv.org/pdf/2504.02489.pdf

[^20]: https://arxiv.org/pdf/2504.01054.pdf

[^21]: https://arxiv.org/html/2406.16330v1

[^22]: https://ai.meta.com/blog/meta-llama-3/

[^23]: https://ai.meta.com/research/publications/the-llama-3-herd-of-models/

[^24]: https://ai.meta.com/blog/meta-llama-3-meta-ai-responsibility/

[^25]: https://ai.meta.com/blog/responsible-ai-connect-2024/

[^26]: https://ai.meta.com/blog/large-language-model-llama-meta-ai/

