<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# DeepSeek-Coder 6.7B / 33B

## Overview

DeepSeek-Coder 6.7B / 33B is the code-specialized branch of the DeepSeek family and is the variant to choose when code completion, infill, repository-aware generation, and code-adjacent reasoning need to be productionized rather than treated as a general chat problem. The 6.7B model is the lower-footprint option, while the 33B model is the quality-first option; both were trained on 2T tokens with a 16K window and FIM support, so the deployment trade-off is mainly between cost/latency and code quality rather than feature coverage.[^1][^2]

## Identity

* **Family:** DeepSeek
* **Variant:** 6.7b, 33b
* **Provider:** DeepSeek
* **Size:** 6.7B / 33B parameters, corresponding to the official model-card sizes for the family members.[^2][^1]


## Specifications

* **Parameter Count:** 6.7B and 33B, depending on the chosen variant.[^1][^2]
* **Hidden Size:** 4096 for 6.7B; 7168 for 33B.[^1]
* **Layers:** 32 for 6.7B; 62 for 33B.[^1]
* **Attention Heads:** 32 for 6.7B; 56 for 33B, with 33B using grouped-query attention (group size 8).[^1]
* **Vocab Size:** 32,000.[^1]
* **Training Tokens:** 2T tokens.[^2][^1]
* **Context Window:** 16K native training context; the paper notes the model can be extended to 64K, but 16K is the most reliable operating range.[^1]
* **Max Output Tokens:** Not Published.


## File Formats

* **Safetensors:** Yes.[^2]
* **GGUF:** Not Published.
* **AWQ:** Not Published.
* **GPTQ:** Not Published.
* **MLX:** Not Published.
* **ONNX:** Not Published.
* **TensorRT:** Not Published.


## Hardware Requirements

* **Minimum GPU Memory:** Recommendation; not officially published. Community deployment practice generally treats 6.7B as comfortably single-GPU in 4-bit/8-bit forms, while 33B typically needs a much larger single GPU or multi-GPU setup.[^3][^2]
* **Recommended GPU Memory:** Recommendation; not officially published. For the 33B variant, community guidance strongly favors high-memory GPUs or multi-GPU serving; for 6.7B, a smaller single-GPU footprint is workable with quantization.[^3][^2]
* **Minimum RAM:** Recommendation; not officially published.
* **Recommended RAM:** Recommendation; not officially published.
* **Disk Space:** Not Published in the retrieved official sources.
* **Recommended GPU:** Recommendation; not officially published. 6.7B is the more practical low-latency option, while 33B is the quality-first option for larger GPUs or tensor-parallel serving.[^3][^1]


## Downloads

| Platform | URL | Official | Notes |
| :-- | :-- | :-- | :-- |
| Hugging Face | https://huggingface.co/deepseek-ai/deepseek-coder-6.7b-base | Yes | Official base checkpoint for the 6.7B code model.[^2] |
| DeepSeek GitHub | https://github.com/deepseek-ai/DeepSeek-Coder | Yes | Official repository referenced by the model card and paper.[^1][^2] |
| DeepSeek-Coder paper | https://arxiv.org/pdf/2401.14196.pdf | Yes | Official technical report for the 6.7B/33B family.[^1] |

## Runtime Compatibility

| Runtime | Supported | Minimum Version | Notes |
| :-- | :-- | :-- | :-- |
| vLLM | Yes | Latest stable | vLLM’s recipe index includes DeepSeek-Coder family support as part of its DeepSeek model coverage.[^3] |
| Transformers | Yes | Latest stable | The official Hugging Face model card demonstrates `AutoTokenizer` and `AutoModelForCausalLM` usage.[^2] |
| SGLang | Yes | Latest stable | Canonical serving stack for code LLMs, but no minimum version was published in the retrieved official sources. |
| llama.cpp | Not Published | Not specified | No official compatibility statement was retrieved. |
| TensorRT-LLM | Not Published | Not specified | No official compatibility statement was retrieved. |

## Deployment

* **Supported Runtimes:** Hugging Face Transformers, vLLM, and the official DeepSeek repository/tooling ecosystem.[^3][^2][^1]
* **Recommended Runtime:** vLLM for self-hosted serving, because the community recipes explicitly cover DeepSeek model families and are the clearest operational reference for production deployment.[^3]
* **Quantizations:** FP16/BF16 on the official model card, with community quantization ecosystems available for smaller deployments; the paper itself does not enumerate low-bit formats.[^2][^1]
* **Recommended Quantization:** BF16 for the 33B model when fidelity is the priority; use lower-bit quantization for 6.7B when latency and cost matter more than maximum code quality.[^2][^3]
* **CPU Supported:** No.
* **GPU Supported:** Yes.
* **MPS Supported:** Not Published.


## License

* **Name:** MIT License for the code repository; model use remains subject to the model license stated on the official card.[^2][^1]
* **Commercial Use:** Yes.[^2][^1]
* **Modification:** Yes.[^1][^2]
* **Redistribution:** Yes.[^2][^1]
* **Attribution Required:** Yes.[^1][^2]
* **Notes:** The official paper and model card both state permissive usage, including commercial use, for DeepSeek-Coder models.[^2][^1]


## Status

* **Release Date:** 2024-01-26 from the official technical report.[^1]
* **Maintenance Status:** research.[^2][^1]


## Engineering Snapshot

* **Best For:**
    - Code completion and code infill in developer tools.[^1][^2]
    - Repository-aware generation where 16K context is enough for local file neighborhoods.[^1]
    - Code-heavy workflows that need better quality than general-purpose chat models at the same size class.[^1]
* **Avoid For:**
    - Non-code workloads where a general chat model would be more cost-efficient.[^1]
    - Very long repository contexts that exceed the model’s reliable 16K operating range.[^1]
    - Small deployment targets that cannot absorb the 33B memory footprint without heavy quantization or multi-GPU partitioning.[^3][^1]
* **Deployment Complexity:** moderate
* **Production Ready:** true
* **Recommended Use Case:** Use the 6.7B variant for cost-sensitive code assistants and the 33B variant when code quality justifies a much larger inference footprint.[^3][^1]


## Engineering Notes

### Inference Notes

* The model was trained with Fill-In-the-Middle and next-token prediction, so serving should preserve infill-aware prompting and not collapse the model into plain left-to-right completion only.[^1]


### Deployment Notes

* The 33B model uses grouped-query attention with group size 8, which is the main architectural difference that matters for serving efficiency and memory behavior relative to the 6.7B variant.[^1]


### Optimization Notes

* The paper recommends FIM-aware prompting and notes that CoT-style prompting can improve difficult coding tasks, especially for instruction-tuned variants, so prompt policy has material quality impact.[^1]


### Compatibility Notes

* The official model card shows standard Hugging Face loading with `trust_remote_code=True`, so production integration should assume custom model code rather than a generic, architecture-agnostic loader path.[^2]


### Common Pitfalls

* Treating 33B as a drop-in replacement for 6.7B without resizing the deployment footprint usually causes memory pressure and throughput collapse; mitigate this by selecting the 6.7B model for interactive serving and reserving 33B for higher-value code paths.[^3][^1]


## Related Models

| ID | Relationship |
| :-- | :-- |
| DeepSeek-Coder 1.3B | Smaller sibling in the same code-focused family.[^1] |
| DeepSeek-Coder-Instruct 6.7B | Instruction-tuned sibling for chatty or agentic coding workflows.[^1] |
| DeepSeek-Coder-Instruct 33B | Highest-quality code sibling in the same generation.[^1] |
| DeepSeek-V2.5 | Later DeepSeek family release that merges chat and coder capabilities.[^4] |

## Further Study

### Research Papers

* [DeepSeek-Coder: When the Large Language Model Meets Programming — The Rise of Code Intelligence](https://arxiv.org/pdf/2401.14196.pdf) - DeepSeek-AI.[^1]
* [Revisiting VerilogEval: A Year of Improvements in Large-Language Models for Hardware Code Generation](https://dl.acm.org/doi/10.1145/3718088) - ACM.[^5]
* [Let the Code LLM Edit Itself When You Edit the Code](https://arxiv.org/abs/2407.03157) - Research authors.[^6]
* [Structured Chain-of-Thought Prompting for Code Generation](https://dl.acm.org/doi/10.1145/3690635) - ACM.[^7]


### Official Documentation

* [deepseek-ai/deepseek-coder-6.7b-base](https://huggingface.co/deepseek-ai/deepseek-coder-6.7b-base) - DeepSeek AI.[^2]
* [DeepSeek-Coder repository](https://github.com/deepseek-ai/DeepSeek-Coder) - DeepSeek AI.[^8][^1]
* [vLLM Recipes](https://docs.vllm.ai/projects/recipes/en/stable/) - vLLM contributors.[^3]


### Engineering Blogs

* [DeepSeek’s innovative breakthroughs and choice between open versus closed-source] - Emerald.[^9]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19]</span>

<div align="center">⁂</div>

[^1]: https://arxiv.org/pdf/2401.14196.pdf

[^2]: https://huggingface.co/deepseek-ai/deepseek-coder-6.7b-base

[^3]: https://docs.vllm.ai/projects/recipes/en/stable/

[^4]: https://api-docs.deepseek.com/news/news0905

[^5]: https://dl.acm.org/doi/10.1145/3718088

[^6]: https://arxiv.org/abs/2407.03157

[^7]: https://dl.acm.org/doi/10.1145/3690635

[^8]: https://github.com/deepseek-ai/awesome-deepseek-coder

[^9]: https://www.emerald.com/tcj/article/22/3/515/1341068/DeepSeek-s-innovative-breakthroughs-and-choice

[^10]: https://arxiv.org/abs/2408.11053

[^11]: https://arxiv.org/pdf/2501.12948.pdf

[^12]: https://arxiv.org/pdf/2412.19437.pdf

[^13]: http://arxiv.org/pdf/2401.02954v1.pdf

[^14]: https://recipes.vllm.ai/deepseek-ai

[^15]: https://en.wikipedia.org/wiki/DeepSeek

[^16]: https://blog.csdn.net/ken2232/article/details/145393502

[^17]: https://ollama.com/library/deepseek-coder:6.7b-base-q8_0/blobs/ccfee4895df0

[^18]: https://github.com/vllm-project/recipes

[^19]: https://huggingface.co/deepseek-ai/DeepSeek-Coder-V2-Instruct

