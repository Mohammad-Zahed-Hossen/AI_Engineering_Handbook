<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Llama 3.x Family

## Overview

Llama 3.x is Meta’s open-weight LLM family for self-hosted production deployments where control over weights, fine-tuning, and runtime stack matters more than managed API convenience. The family is especially relevant when you need a dense decoder-only model that can be deployed across a wide range of inference backends and quantization regimes, with Llama 3.2 adding lightweight and vision variants and Llama 3.3 positioning a 70B text model as the recommended upgrade path over Llama 3.1 70B Instruct.[^1][^2]

## Identity

* **Family:** Llama[^2][^1]
* **Variants:** 3.1 includes 8B, 70B, and 405B; 3.2 includes 1B, 3B, 11B Vision, and 90B Vision; 3.3 is represented by the 70B Instruct release.[^3][^1][^2]
* **Provider:** Meta[^1][^2]
* **Checkpoints:** Pretrained and instruction-tuned checkpoints are available across the family; Llama 3.2 also includes quantized lightweight checkpoints and vision checkpoints.[^2][^1]


## Architecture

* **Architecture Type:** Dense Transformer.[^1][^2]
* **Transformer Type:** Decoder-only for the text models; Llama 3.2 also includes multimodal vision models with text output.[^2][^1]
* **Attention Mechanism:** Grouped-Query Attention (GQA).[^4]
* **Tokenizer:** SentencePiece-style tokenizer with official Llama text prompt formatting; the model docs expose special tokens and headers rather than a numeric vocabulary size in the retrieved source.[^1][^2]
* **Positional Encoding:** RoPE.[^2][^1]
* **KV Cache:** Yes.[^1][^2]
* **Flash Attention:** Not officially documented in the retrieved sources.[^2][^1]
* **Mixture of Experts:** No.[^1][^2]


## Specifications

### Llama 3.1

* **Parameter Count:** 8B, 70B, 405B.[^5][^1]
* **Hidden Size:** Not officially documented in the retrieved sources.[^2][^1]
* **Layers:** Not officially documented in the retrieved sources.[^1][^2]
* **Attention Heads:** Not officially documented in the retrieved sources.[^2][^1]
* **Vocab Size:** Not officially documented in the retrieved sources.[^1][^2]
* **Training Tokens:** Not officially documented in the retrieved sources.[^2][^1]
* **Context Window:** 128K tokens.[^6][^5]
* **Max Output Tokens:** 4K for the 405B Instruct model in Bedrock; other variants are not consistently specified in the retrieved official sources.[^5]


### Llama 3.2

* **Parameter Count:** 1B, 3B, 11B Vision, 90B Vision.[^2]
* **Hidden Size:** Not officially documented in the retrieved sources.[^2]
* **Layers:** Not officially documented in the retrieved sources.[^2]
* **Attention Heads:** Not officially documented in the retrieved sources.[^2]
* **Vocab Size:** Not officially documented in the retrieved sources.[^2]
* **Training Tokens:** Not officially documented in the retrieved sources.[^2]
* **Context Window:** The retrieved source confirms long-context and lightweight model behavior, but does not give a single family-wide numeric spec in the fetched text.[^2]
* **Max Output Tokens:** Not officially documented in the retrieved sources.[^2]


### Llama 3.3

* **Parameter Count:** 70B.[^3]
* **Hidden Size:** Not officially documented in the retrieved sources.[^3]
* **Layers:** Not officially documented in the retrieved sources.[^3]
* **Attention Heads:** Not officially documented in the retrieved sources.[^3]
* **Vocab Size:** Not officially documented in the retrieved sources.[^3]
* **Training Tokens:** Not officially documented in the retrieved sources.[^3]
* **Context Window:** 128K tokens.[^3]
* **Max Output Tokens:** 8,192 in the Gemini Enterprise Agent Platform spec for the managed deployment variant.[^7]


## File Formats

* **Safetensors:** Yes, for open-weight Hugging Face-style distribution.[^1][^2]
* **GGUF:** Not officially documented in the retrieved sources.[^1][^2]
* **AWQ:** Not officially documented in the retrieved sources.[^1][^2]
* **GPTQ:** Not officially documented in the retrieved sources.[^1][^2]
* **MLX:** Not officially documented in the retrieved sources.[^1][^2]
* **ONNX:** Not officially documented in the retrieved sources.[^1][^2]
* **TensorRT:** Not officially documented in the retrieved sources.[^1][^2]


## Ecosystem Support

| Framework | Supported | Notes |
| :-- | :-- | :-- |
| Transformers | Yes | Official prompt-format docs reference Hugging Face-style usage and model-card guidance. [^1][^2] |
| vLLM | Not officially documented | No official family page in the retrieved sources explicitly names vLLM support. [^1][^2] |
| Ollama | Not officially documented | No official family page in the retrieved sources explicitly names Ollama support. [^1][^2] |
| Llama.cpp | Not officially documented | No official family page in the retrieved sources explicitly names llama.cpp support. [^1][^2] |
| MLX | Not officially documented | No official family page in the retrieved sources explicitly names MLX support. [^2] |
| LiteLLM | Not officially documented | No official family page in the retrieved sources explicitly names LiteLLM support. [^1][^2] |
| OpenRouter | Not officially documented | No official family page in the retrieved sources explicitly names OpenRouter support. [^1][^2] |
| LM Studio | Not officially documented | No official family page in the retrieved sources explicitly names LM Studio support. [^1][^2] |
| TensorRT-LLM | Not officially documented | No official family page in the retrieved sources explicitly names TensorRT-LLM support. [^1][^2] |

## References

| Resource | URL | Category | Why Read | Outcome | Time |
| :-- | :-- | :-- | :-- | :-- | :-- |
| [Official Documentation] | [Llama 3.1 | Model Cards and Prompt formats](https://www.llama.com/docs/model-cards-and-prompt-formats/llama3_1/) | official | Canonical prompt format, tool-calling tokens, and family guidance for 3.1. | Validate prompt templates and deployment-side chat formatting. |
| [Model Card] | [Llama 3.2 | Model Cards and Prompt formats](https://www.llama.com/docs/model-cards-and-prompt-formats/llama3_2/) | documentation | Canonical source for lightweight and vision variants plus quantization guidance. | Decide whether 3.2 fits edge, multimodal, or memory-constrained deployment. |
| [Technical Report] | [The Llama 3 Herd of Models](http://arxiv.org/pdf/2407.21783.pdf) | papers | Primary technical report for the family’s design and scaling behavior. | Understand the architectural and evaluation context behind the release line. | 30 |
| [Inference Framework] | [Llama 3.3 | Model Cards and Prompt formats](https://www.llama.com/docs/model-cards-and-prompt-formats/llama3_3/) | documentation | Canonical 3.3 prompt format and recommended upgrade guidance from 3.1 70B Instruct. | Confirm compatibility and prompt migration expectations. |
| [Repository] | [meta-llama/llama-models](https://github.com/meta-llama/llama-models) | repositories | Source repository for model cards and prompt-format assets. | Trace model-card details back to the maintained upstream artifacts. | 20 |

## Related Models

* **Related Models:** Llama 3.1, Llama 3.2, Llama 3.3, Llama 2, Llama Guard.[^1][^2]
* **Alternative Models:** Qwen, Gemma, DeepSeek, Mistral, Phi.[^2]


## Capabilities

* **Instruction Tuned:** Yes, for the Instruct releases.[^3][^1][^2]
* **Reasoning:** Yes, especially in the 3.1 and 3.3 instruction-tuned family line.[^3][^1]
* **Vision:** Yes, in Llama 3.2 Vision.[^2]
* **Multilingual:** Yes.[^8][^1]
* **Tool Calling:** Yes, via the official prompt format and tool-call tokens.[^1][^2]
* **Function Calling:** Yes, supported in the documented prompt formats.[^1][^2]
* **Thinking Model:** No official “thinking model” designation in the retrieved sources.[^1][^2]
* **Context Window:** 128K tokens for Llama 3.1 and Llama 3.3.[^5][^3]
* **Max Output Tokens:** 8,192 for the managed 3.3 70B deployment spec; 4K is documented for the 3.1 405B Bedrock deployment.[^7][^5]


## Deployment

* **Supported Runtimes:** PyTorch, Hugging Face Transformers, managed model-hosting endpoints, and partner-model deployment environments.[^7][^5][^2][^1]
* **Recommended Runtime:** PyTorch + Hugging Face Transformers for open-weight self-hosting because it is the canonical ecosystem implied by the official model-card and prompt-format docs.[^2][^1]
* **Quantizations:** BF16/FP16 native on the base family, plus quantized lightweight variants and downstream INT8/INT4 deployment paths through external runtimes.[^2]
* **Recommended Quantization:** BF16 when quality matters; use quantized variants when memory or power is the primary constraint.[^2]
* **CPU Supported:** Not officially documented.[^1][^2]
* **GPU Supported:** Yes.[^1][^2]
* **MPS Supported:** Not officially documented.[^1][^2]


## Hardware Requirements

### Llama 3.1

* **Minimum GPU Memory:** Not officially documented in the retrieved sources.[^2][^1]
* **Recommended GPU Memory:** Not officially documented in the retrieved sources.[^1][^2]
* **Minimum RAM:** Not officially documented in the retrieved sources.[^2][^1]
* **Recommended RAM:** Not officially documented in the retrieved sources.[^1][^2]
* **Disk Space:** Not officially documented in the retrieved sources.[^2][^1]
* **Recommended GPU:** Not officially documented in the retrieved sources.[^1][^2]


### Llama 3.2

* **Minimum GPU Memory:** Not officially documented in the retrieved sources.[^2]
* **Recommended GPU Memory:** Not officially documented in the retrieved sources.[^2]
* **Minimum RAM:** Not officially documented in the retrieved sources.[^2]
* **Recommended RAM:** Not officially documented in the retrieved sources.[^2]
* **Disk Space:** Not officially documented in the retrieved sources.[^2]
* **Recommended GPU:** Not officially documented in the retrieved sources.[^2]


### Llama 3.3

* **Minimum GPU Memory:** Not officially documented in the retrieved sources.[^3]
* **Recommended GPU Memory:** Not officially documented in the retrieved sources.[^3]
* **Minimum RAM:** Not officially documented in the retrieved sources.[^3]
* **Recommended RAM:** Not officially documented in the retrieved sources.[^3]
* **Disk Space:** Not officially documented in the retrieved sources.[^3]
* **Recommended GPU:** Not officially documented in the retrieved sources.[^3]


## Downloads

| Platform | URL | Official | Notes |
| :-- | :-- | :-- | :-- |
| Meta / Llama docs | [Llama 3.1 | Model Cards and Prompt formats](https://www.llama.com/docs/model-cards-and-prompt-formats/llama3_1/) | Yes |
| Meta / Llama docs | [Llama 3.2 | Model Cards and Prompt formats](https://www.llama.com/docs/model-cards-and-prompt-formats/llama3_2/) | Yes |
| Meta / Llama docs | [Llama 3.3 | Model Cards and Prompt formats](https://www.llama.com/docs/model-cards-and-prompt-formats/llama3_3/) | Yes |

## Runtime Compatibility

| Runtime | Supported | Minimum Version | Notes |
| :-- | :-- | :-- | :-- |
| Hugging Face Transformers | Yes | Not officially documented | Canonical self-hosting stack implied by official docs. [^1][^2] |
| PyTorch | Yes | Not officially documented | Canonical framework baseline in the target specification. [^1][^2] |
| Partner managed runtimes | Yes | Not officially documented | Documented for deployed 3.3 and 3.1 variants in managed environments. [^7][^5] |
| llama-stack-apps | Yes | Not officially documented | Official docs show tool-calling flows in stack-integrated examples. [^1] |

## License

* **Name:** Llama Community License / Meta Llama terms.[^1][^2]
* **Commercial Use:** Yes, subject to the license terms.[^1][^2]
* **Modification:** Yes, subject to the license terms.[^1][^2]
* **Redistribution:** Yes, subject to the license terms.[^1][^2]
* **Attribution Required:** Yes.[^1][^2]
* **Notes:** Rights and restrictions are governed by the official Llama license terms associated with the model release.[^1][^2]


## Status

* **Release Date:** Llama 3.1 launched in July 2024; Llama 3.3 70B Instruct released on April 29, 2025 in the managed deployment spec and December 2024 in the public release line.[^7][^5]
* **Maintenance Status:** production.[^3][^2][^1]


## Engineering Snapshot

* **Best For:**
    - Open-weight production deployments where the platform team needs control over weights, quantization, and runtime stack.[^2][^1]
    - Fine-tuning and RAG systems that benefit from long context and strong open-model quality.[^3][^1][^2]
    - Agentic systems that need tool-calling and structured prompt control.[^1][^2]
* **Avoid For:**
    - Teams that want a fully managed closed API with no model hosting burden.[^2]
    - Ultra-low-memory edge deployment without a quantized or lightweight variant.[^2]
    - Workloads that require officially documented ONNX/TensorRT/llama.cpp/MLX support from the vendor docs alone.[^1][^2]
* **Deployment Complexity:** high.[^1][^2]
* **Production Ready:** true.[^2][^1]
* **Recommended Use Case:** Self-hosted open-weight LLM deployment with fine-tuning, RAG, and agent tooling.[^1][^2]


## Timeline

| Version | Release Date | Notes |
| :-- | :-- | :-- |
| 3.1 | 2024-07 | Expanded context and flagship open-weight text models. [^1][^5] |
| 3.2 | 2024-09 | Added lightweight and vision variants plus quantization-focused deployment options. [^2] |
| 3.3 | 2024-12 | 70B text model positioned as the upgrade path for 3.1 70B Instruct. [^1][^3] |

## Engineering Notes

### Inference Notes

* Use the official prompt format and tool-call tokens exactly as documented; the 3.1 docs explicitly define system/user/assistant/ipython roles and tool-call signaling.[^1]
* Llama 3.2 quantized variants are explicitly optimized for lower memory footprint and power consumption while retaining near-BF16 accuracy.[^2]
* For 3.3, Meta’s docs direct developers to prefer the new 3.3 70B Instruct model over 3.1 70B Instruct when upgrading.[^1]


### Deployment Notes

* Treat 3.1/3.3 as long-context dense models that need KV-cache-aware serving and GPU-first deployment planning.[^3][^1]
* Use the lightweight 3.2 family when memory and power are the dominant constraints, especially on phones, tablets, and other edge devices.[^2]
* Managed deployment specs for 3.3 70B document 128K context and 8,192 max output tokens, which should be treated as the ceiling for that service configuration.[^7]


### Optimization Notes

* Quantization-aware training and SpinQuant are explicitly documented for Llama 3.2, making the family a better fit than many open models for constrained-device inference when quality must stay close to BF16.[^2]
* The official docs state that quantized 3.2 models are substantially faster than BF16 counterparts and consume less memory and power.[^2]


### Compatibility Notes

* The official Llama docs preserve prompt compatibility across 3.1 and 3.2 while recommending the updated format for best results.[^1][^2]
* The 3.1 docs call out the canonical text-prompt-format file in the meta-llama repository, which is the safest source for integration behavior.[^1]
* The official docs distinguish text-only, vision, and tool-calling behavior by model line, so runtime selection must match the checkpoint family rather than assuming uniform capabilities.[^2][^1]


### Common Pitfalls

* Mixing prompt formats across family generations can silently degrade quality; mitigate by using the exact official prompt templates for the target variant.[^1][^2]
* Assuming all variants share the same deployment footprint is risky; 3.2 quantized and edge-oriented checkpoints are materially different from 3.1/3.3 large text models.[^3][^2]
* Treating unsupported formats such as ONNX or TensorRT as officially sanctioned can create portability assumptions that the vendor docs do not confirm.[^2][^1]


## Related Models

| ID | Relationship |
| :-- | :-- |
| llama-2-family | Earlier Meta open-weight family. [^2] |
| qwen-family | Alternative open-weight family for the same deployment class. [^2] |
| gemma-family | Alternative open-weight family for the same deployment class. [^2] |
| deepseek-family | Alternative open-weight family for the same deployment class. [^2] |

## Further Study

### Research Papers

* **The Llama 3 Herd of Models** - Meta AI Research.[^6]
* **Extending Context Window of Large Language Models via Positional Interpolation** - Meta-adjacent foundational context-window work relevant to RoPE-based long-context models.[^10]
* **Applying Refusal-Vector Ablation to Llama 3.1 70B Agents** - Academic agent-safety analysis using Llama 3.1.[^11]


### Official Documentation

* **Llama 3.1 | Model Cards and Prompt formats**. [^1]
* **Llama 3.2 | Model Cards and Prompt formats**. [^2]
* **Llama 3.3 | Model Cards and Prompt formats**. [^9]
* **meta-llama/llama-models repository**.[^4]


### Engineering Blogs

* **Introducing Llama 3.1: Our most capable models to date** - Meta AI.[^8]


## Suggested Meta

* **Tags:** llm, models, meta, llama, open-weight, self-hosting, fine-tuning, rag, agents, decoder-only
* **Aliases:** Meta Llama 3.x, Llama 3 Family, Llama 3.1, Llama 3.2, Llama 3.3
* **Keywords:** Llama 3, Llama 3.1, Llama 3.2, Llama 3.3, Meta Llama, open-weight LLM, self-hosted LLM, instruction tuning, long context, GQA
* **Search Tokens:** llama 3.x family, llama 3.1, llama 3.2, llama 3.3, meta llama, open-weight llm, self-hosted llm, rag agents
* **Difficulty:** Advanced
* **Domain:** llm
* **Engineering Area:** deployment, inference, optimization
* **Estimated Reading Time:** 25
* **Prerequisites:** LLM serving, quantization, prompt formatting, fine-tuning, RAG, GPU memory planning
* **Recommended Next:** Llama Guard, Llama 2, Qwen family
* **Cross-Links:**
    * related_models: llama-2-family, qwen-family, gemma-family
    * related_packages: transformers, pytorch, vllm, llama-cpp
    * related_workflows: rag-workflow, agent-workflow, fine-tuning-workflow
    * related_patterns: kv-cache-pattern, prompt-format-pattern, quantization-pattern
<span style="display:none">[^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23][^24][^25][^26][^27][^28][^29][^30][^31][^32][^33][^34][^35][^36][^37][^38][^39]</span>

<div align="center">⁂</div>

[^1]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md

[^2]: MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md

[^3]: https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-meta-llama-3-3-70b-instruct.html

[^4]: https://github.com/meta-llama/llama-models/blob/main/models/llama3_3/MODEL_CARD.md

[^5]: https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-meta-llama-3-1-405b-instruct.html

[^6]: http://arxiv.org/pdf/2407.21783.pdf

[^7]: https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/partner-models/llama/llama3-3

[^8]: https://ai.meta.com/blog/meta-llama-3-1/

[^9]: https://www.llama.com/docs/model-cards-and-prompt-formats/llama3_3/

[^10]: https://arxiv.org/pdf/2306.15595.pdf

[^11]: https://arxiv.org/abs/2410.10871

[^12]: CONTENT_QUALITY_STANDARD.md

[^13]: ARCHITECTURE_FREEZE.md

[^14]: AENS-Knowledge-Layer-Specification.md

[^15]: https://scipublication.com/index.php/AIMLR/article/view/416

[^16]: https://journals.sagepub.com/doi/10.1177/18747655251388901

[^17]: https://aclanthology.org/2025.arabicnlp-sharedtasks.84

[^18]: https://arxiv.org/abs/2502.03460

[^19]: https://www.mdpi.com/2076-3417/15/13/7134

[^20]: https://www.semanticscholar.org/paper/25cac0ca4a1a7872f300ff1b491d1acd7a8d09bd

[^21]: https://formative.jmir.org/2026/1/e72604

[^22]: https://www.llama.com/docs/model-cards-and-prompt-formats/llama3_1/

[^23]: https://github.com/meta-llama/llama-models/blob/main/models/llama3_1/MODEL_CARD.md

[^24]: https://www.llama.com/docs/model-cards-and-prompt-formats/

[^25]: https://d-central.tech/ai/model/llama-3-1/

[^26]: https://www.llama.com/docs/model-cards-and-prompt-formats/llama3_2/

[^27]: https://d-central.tech/ai/model/llama-3-3/

[^28]: https://www.imanagerpublications.com/article/21243

[^29]: https://journals.sagepub.com/doi/10.1177/09557490251378736

[^30]: https://ieeexplore.ieee.org/document/11423855/

[^31]: https://onlinelibrary.wiley.com/doi/book/10.1002/0470083980

[^32]: https://www.taylorfrancis.com/books/9780203303566

[^33]: http://arxiv.org/pdf/2407.14482.pdf

[^34]: https://apxml.com/models/llama-3-3-70b

[^35]: https://developer.puter.com/ai/meta-llama/llama-3.3-70b-instruct/

[^36]: https://chatforest.com/reviews/meta-llama-3-3-70b-efficient-open-weight-llm-review/

[^37]: https://deepwiki.com/meta-llama/llama-models/9.2-llama-3.2

[^38]: https://www.mindstudio.ai/models/llama-3-3-70b-versatile-groq

[^39]: https://d-central.tech/ai/model/llama-3-2/

