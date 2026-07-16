<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Llama 3.2-Vision 11B Instruct

## Overview

Llama 3.2-Vision 11B Instruct is Meta’s production multimodal checkpoint for image understanding, document analysis, captioning, and assistant-style question answering over image+text inputs. It is the balanced choice in the Llama 3.2-Vision family when you need materially stronger visual reasoning than compact edge models, but cannot justify the cost envelope of the 90B tier. The engineering trade-off is clear: better multimodal quality than small models, but much higher memory and runtime complexity than text-only 3B/1B deployments.[^1][^2]

## Identity

* **Family:** Llama 3.2.[^1]
* **Variant:** 3.2-vision-11b-instruct.[^1]
* **Provider:** Meta AI.[^1]
* **Size:** 22,000 MB, based on 11B parameters in BF16 checkpoint form.[^3][^1]


## Specifications

* **Parameter Count:** 11B (10.6B effective in the model card table).[^1]
* **Hidden Size:** Not Published in the accessible model card text.[^1]
* **Layers:** Not Published in the accessible model card text.[^1]
* **Attention Heads:** Not Published in the accessible model card text.[^1]
* **Vocab Size:** Not Published in the accessible model card text.[^1]
* **Training Tokens:** 6B image-text pairs for vision pretraining; additional instruction tuning includes more than 3M synthetically generated examples.[^1]
* **Context Window:** 128K.[^1]
* **Max Output Tokens:** Not Published.

Differentiation: this variant is the family’s mid-size vision checkpoint, optimized for image reasoning and doc-style workflows, while remaining substantially easier to serve than 90B.[^2][^1]

## File Formats

* **Safetensors:** Yes.[^1]
* **GGUF:** Yes (community conversions exist).[^3]
* **AWQ:** Yes (community quantization support exists).[^3]
* **GPTQ:** Yes (community quantization support exists).[^3]
* **MLX:** Partial / Community.[^3]
* **ONNX:** Partial / Community.[^3]
* **TensorRT:** Yes via TensorRT-LLM and ecosystem conversion workflows.[^2][^3]

Differentiation: because this is a vision-language model, format support is less universal than text-only Llama checkpoints and often depends on runtime-specific multimodal adapters.[^3][^1]

## Hardware Requirements

(Community recommendations; not official minimums.)

* **Minimum GPU Memory:** Approximately 24 GB GPU memory for practical quantized or tightly optimized serving. Recommendation, not official.[^3]
* **Recommended GPU Memory:** 40 GB+ for BF16 inference with room for image tokens, batching, and cache headroom. Recommendation, not official.[^3]
* **Minimum RAM:** 16 GB system RAM recommended for local or workstation inference. Recommendation, not official.[^3]
* **Recommended RAM:** 32 GB+ for stable multimodal serving and preprocessing overhead. Recommendation, not official.[^3]
* **Disk Space:** Official BF16 checkpoint is distributed through the model card; provision several tens of GB for weights, caches, and runtime artifacts. Official page does not publish a separate disk figure.[^1]
* **Recommended GPU:** NVIDIA L40S/A100-class GPUs or equivalent high-memory accelerators are the common production recommendation. Recommendation, not official.[^3]

Differentiation: 11B vision sits in the “serious single-node multimodal” band — far more feasible than 90B, but still expensive enough that image token handling and KV cache planning matter.[^3][^1]

## Downloads

| Platform | URL | Official | Notes |
| :-- | :-- | :-- | :-- |
| Hugging Face model card | https://huggingface.co/meta-llama/Llama-3.2-11B-Vision-Instruct | Yes | Official checkpoint and license entry point.[^1] |
| Meta Llama downloads | https://ai.meta.com/resources/models-and-libraries/llama-downloads/ | Yes | Official Meta access/download path.[^4] |

Differentiation: the official Hugging Face repo is the practical distribution point, while Meta’s download page governs access and licensing.[^4][^1]

## Runtime Compatibility

| Runtime | Supported | Minimum Version | Notes |
| :-- | :-- | :-- | :-- |
| Hugging Face Transformers | Yes | 4.45.0+ | Official model card shows Transformers usage for image+text input.[^1] |
| torchchat / ExecuTorch | Yes | Latest stable / Not specified | Meta release materials position these as official local/on-device paths for Llama 3.2.[^2] |
| Ollama | Yes | Latest stable / Not specified | Meta release blog lists single-node distribution via Ollama.[^2] |
| vLLM | Yes | Latest stable / Not specified | Community support exists; verify current multimodal compatibility against runtime docs.[^3] |
| TensorRT-LLM | Yes | Latest stable / Not specified | Supported through ecosystem conversion workflows for NVIDIA deployments.[^2][^3] |

Differentiation: this variant requires a runtime that handles both the language model and the vision adapter path; “text-only compatible” is not sufficient.[^2][^1]

## Deployment

* **Supported Runtimes:** Transformers and the original `llama` codebase are explicitly referenced in the model card; Meta release materials also call out torchchat, ExecuTorch, and Ollama.[^2][^1]
* **Recommended Runtime:** Hugging Face Transformers for reference accuracy and integration work, or torchchat/ExecuTorch when the target is local/on-device deployment.[^2][^1]
* **Quantizations:** BF16 native; community INT8/INT4/AWQ/GPTQ-style quantizations exist, but multimodal fidelity must be validated carefully.[^1][^3]
* **Recommended Quantization:** Use BF16 for production image understanding when possible; use quantization only when memory budget is the gating constraint and you have validated image tasks on your target workload.[^3][^1]
* **CPU Supported:** Yes, but mainly through heavily optimized community paths and at reduced throughput.[^3]
* **GPU Supported:** Yes, and preferred for production multimodal serving.[^2][^1]
* **MPS Supported:** Not Published.

Differentiation: multimodal serving introduces image preprocessing, adapter execution, and image-token memory overhead, so deployment risk is higher than for text-only checkpoints of similar size.[^2][^1][^3]

## License

* **Name:** Llama 3.2 Community License.[^1]
* **Commercial Use:** Yes, subject to the license and acceptable-use policy.[^1]
* **Modification:** Yes.[^1]
* **Redistribution:** Yes, with required notices and conditions.[^1]
* **Attribution Required:** Yes.[^1]
* **Notes:** The license governs multimodal use, redistribution, required attribution, and the commercial threshold; the model card also notes an EU restriction for multimodal models.[^1]

Differentiation: because this is multimodal, the license has extra deployment implications beyond the text-only family, especially for geographic and product distribution policy.[^1]

## Status

* **Release Date:** September 25, 2024.[^2][^1]
* **Maintenance Status:** production.[^2][^1]

Differentiation: this is a released production checkpoint with explicit multimodal support, not an experimental adapter demo.[^2][^1]

## Engineering Snapshot

* **Best For:**
    - Document understanding workflows with charts, tables, and layout-heavy images.[^2][^1]
    - Visual question answering and captioning services.[^2][^1]
    - Multimodal assistants that need image+text input and text output in production.[^2][^1]
* **Avoid For:**
    - Text-only chat where a smaller Llama text checkpoint will meet quality needs.[^2][^3]
    - Ultra-low-memory edge devices that cannot handle a vision adapter and image tokens.
    - High-throughput pipelines that do not need image understanding and would pay unnecessary multimodal overhead.[^3]
* **Deployment Complexity:** high.
* **Production Ready:** true.
* **Recommended Use Case:** production multimodal inference for image understanding and document-centric assistants.[^2][^1]

Differentiation: the main decision is not just model size but whether you need a vision stack at all; if yes, 11B is the family’s most practical quality/feasibility balance.[^2][^1]

## Engineering Notes

### Inference Notes

* The model uses a separately trained vision adapter with cross-attention into the base Llama 3.1 language model, so image-token handling is part of the inference cost model and not an optional feature.[^2][^1]


### Deployment Notes

* Meta positions 11B Vision for local, on-prem, cloud, and on-device distributions through Llama Stack, ExecuTorch, and partner ecosystems, which means deployment planning should include both accelerator choice and adapter-compatible runtime selection.[^2]


### Optimization Notes

* The release notes recommend device-specific distribution paths and note BF16 weights; quantized variants were discussed as future work, so compression should be treated as an optimization layer rather than the baseline deployment mode.[^2]


### Compatibility Notes

* The model card documents image+text prompting with Transformers 4.45.0+, and the release blog notes that only English is officially supported for image+text applications, which affects international deployment scope.[^2][^1]


### Common Pitfalls

* A common failure mode is attempting multi-image or unsupported multilingual image workflows without validating quality; mitigate by constraining inputs to the officially supported image+text usage pattern and testing on your actual document/image distribution.[^1]

Differentiation: 11B Vision is the first Llama 3.2 tier where multimodal correctness is a core product risk, so input policy and runtime validation matter as much as raw model selection.[^2][^1]

## Related Models

| ID | Relationship |
| :-- | :-- |
| Llama-3.2-90B-Vision-Instruct | Larger sibling; higher multimodal quality and much higher serving cost. |
| Llama-3.2-3B-Instruct | Text-only sibling; far lower footprint, no image input. |
| Llama-3.1-70B-Instruct | Text-only sibling backbone; useful as the base family reference. |

## Further Study

### Research Papers

* The Llama 3 Herd of Models - Meta AI.[^5]


### Official Documentation

* meta-llama/Llama-3.2-11B-Vision-Instruct model card - Hugging Face.[^1]
* Llama 3.2: Revolutionizing edge AI and vision with open, customizable models - Meta AI.[^2]
* Download Llama - Meta AI.[^4]


### Engineering Blogs

* Llama 3.2: Revolutionizing edge AI and vision with open, customizable models - Meta AI.[^2]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://ecios.org/DOIx.php?id=10.4055/cios25183

[^2]: https://ieeexplore.ieee.org/document/11084278/

[^3]: https://ieeexplore.ieee.org/document/11240166/

[^4]: https://arxiv.org/abs/2504.14098

[^5]: https://ijsrcseit.com/home/article/view/CSEIT25111238

[^6]: https://arxiv.org/html/2504.00557v1

[^7]: https://arxiv.org/pdf/2304.15010.pdf

[^8]: https://arxiv.org/pdf/2403.05525.pdf

[^9]: https://huggingface.co/meta-llama/Llama-3.2-11B-Vision-Instruct

[^10]: https://huggingface.co/meta-llama/Llama-3.2-11B-Vision-Instruct/blob/main/README.md

[^11]: https://huggingface.co/meta-llama

[^12]: https://huggingface.co/meta-llama/Llama-3.2-11B-Vision-Instruct/discussions/23

[^13]: https://huggingface.co/meta-llama/Llama-3.2-11B-Vision-Instruct/discussions/85

[^14]: https://ai.meta.com/resources/models-and-libraries/llama-downloads/

[^15]: https://huggingface.co/meta-llama/Llama-3.2-11B-Vision-Instruct/blob/refs%2Fpr%2F74/README.md

[^16]: https://huggingface.co/meta-llama/Llama-3.2-11B-Vision-Instruct/discussions/43

[^17]: https://huggingface.co/meta-llama/Llama-3.2-11B-Vision-Instruct/discussions/37

[^18]: https://ai.meta.com/llama/get-started/

