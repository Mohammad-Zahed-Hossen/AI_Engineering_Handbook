<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Qwen 3.x Family

## Overview

Qwen 3.x is Alibaba Cloud’s open-weight Qwen family for production LLM deployment, designed around hybrid thinking/non-thinking behavior, strong multilingual coverage, and practical self-hosting across common inference stacks. The family spans dense and MoE checkpoints, giving engineers a clear latency-quality-cost ladder for coding, reasoning, agents, RAG, and finetuning workloads.[^1][^2]

For deployment decisions, the main value is controllable reasoning depth and broad runtime support; the main cost is increased operational complexity when enabling thinking mode, long context, or MoE routing at scale.[^2][^1]

## Identity

* **Family:** Qwen3[^1]
* **Variants:** Dense: 0.6B, 1.7B, 4B, 8B, 14B, 32B; MoE: 30B-A3B, 235B-A22B; official 2507 refreshes include 4B, 30B-A3B, and 235B-A22B in Instruct and Thinking forms; Coder variants are officially documented separately under Qwen3-Coder.[^3][^1]
* **Provider:** Qwen team, Alibaba Cloud.[^3][^1]
* **Checkpoints:** Qwen3-Base, Qwen3-Instruct, Qwen3-Thinking, Qwen3-2507 Instruct, Qwen3-2507 Thinking, and Qwen3-Coder checkpoints where applicable.[^3][^1]


## Architecture

* **Architecture Type:** Decoder-only Transformer with dense and MoE variants.[^1]
* **Transformer Type:** Decoder-only.[^1]
* **Attention Mechanism:** Qwen3 dense models use Q/K/V head configurations documented per checkpoint; the MoE models document 128 experts with 8 activated experts per token.[^1]
* **Tokenizer:** Not officially disclosed in the retrieved sources.[^1]
* **Positional Encoding:** Not officially disclosed in the retrieved sources.[^1]
* **KV Cache:** Yes, required by the supported inference runtimes and long-context serving workflows.[^1]
* **Flash Attention:** Yes for supported inference stacks; official deployment examples use vLLM, SGLang, and llama.cpp with fast attention backends.[^1]
* **Mixture of Experts:** Yes for Qwen3-30B-A3B and Qwen3-235B-A22B; 128 total experts, 8 activated experts per token, shared experts not officially disclosed in the retrieved sources.[^1]


## Specifications

### Dense variants

| Variant | Parameter Count | Hidden Size | Layers | Attention Heads | Vocab Size | Training Tokens | Context Window | Max Output Tokens |
| :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| Qwen3-0.6B | 0.6B | Not officially disclosed | 28 | 16 Q / 8 KV | Not officially disclosed | ~36T total pretraining tokens for the family; variant-specific allocation not officially disclosed | 32K | Not officially disclosed [^1] |
| Qwen3-1.7B | 1.7B | Not officially disclosed | 28 | 16 Q / 8 KV | Not officially disclosed | ~36T total pretraining tokens for the family; variant-specific allocation not officially disclosed | 32K | Not officially disclosed [^1] |
| Qwen3-4B | 4B | Not officially disclosed | 36 | 32 Q / 8 KV | Not officially disclosed | ~36T total pretraining tokens for the family; variant-specific allocation not officially disclosed | 32K | Not officially disclosed [^1] |
| Qwen3-8B | 8B | Not officially disclosed | 36 | 32 Q / 8 KV | Not officially disclosed | ~36T total pretraining tokens for the family; variant-specific allocation not officially disclosed | 128K | Not officially disclosed [^1] |
| Qwen3-14B | 14B | Not officially disclosed | 40 | 40 Q / 8 KV | Not officially disclosed | ~36T total pretraining tokens for the family; variant-specific allocation not officially disclosed | 128K | Not officially disclosed [^1] |
| Qwen3-32B | 32B | Not officially disclosed | 64 | 64 Q / 8 KV | Not officially disclosed | ~36T total pretraining tokens for the family; variant-specific allocation not officially disclosed | 128K | Not officially disclosed [^1] |

### MoE variants

| Variant | Parameter Count | Hidden Size | Layers | Attention Heads | Vocab Size | Training Tokens | Context Window | Max Output Tokens |
| :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| Qwen3-30B-A3B | 30B total / 3B active | Not officially disclosed | 48 | 32 Q / 4 KV | Not officially disclosed | ~36T total pretraining tokens for the family; variant-specific allocation not officially disclosed | 128K | Not officially disclosed [^1] |
| Qwen3-235B-A22B | 235B total / 22B active | Not officially disclosed | 94 | 64 Q / 4 KV | Not officially disclosed | ~36T total pretraining tokens for the family; variant-specific allocation not officially disclosed | 128K | Not officially disclosed [^1] |

## File Formats

* **Safetensors:** Yes.[^3][^1]
* **GGUF:** Yes, via official llama.cpp support and GGUF checkpoints.[^1]
* **AWQ:** Yes, official quantization guidance covers AWQ.[^3]
* **GPTQ:** Yes, official quantization guidance covers GPTQ.[^3]
* **MLX:** Yes, official docs say MLX LM supports Qwen3.[^3][^1]
* **ONNX:** Not officially disclosed in the retrieved sources.[^1]
* **TensorRT:** Yes, via TensorRT-LLM support.[^1]


## Ecosystem Support

| Framework | Supported | Notes |
| :-- | :-- | :-- |
| Transformers | Yes | Official docs require `transformers>=4.51.0`. [^3] |
| vLLM | Yes | Official docs recommend `vllm>=0.9.0`; Qwen3 serving examples use reasoning parsers. [^3] |
| SGLang | Yes | Official docs require `sglang>=0.4.6.post1`. [^3] |
| Ollama | Yes | Official docs recommend Ollama v0.9.0 or higher. [^3] |
| Llama.cpp | Yes | Official docs recommend `llama.cpp>=b5401`. [^3] |
| MLX | Yes | Official docs state `mlx-lm>=0.24.0` supports Qwen3 on Apple Silicon. [^3] |
| LiteLLM | Not officially disclosed | Not officially documented in the retrieved sources. |
| OpenRouter | Not officially disclosed | Not officially documented in the retrieved sources. |
| LM Studio | Yes | Official docs state Qwen3 is supported and can use GGUF files. [^3] |
| TensorRT-LLM | Yes | Official docs recommend `tensorrt_llm>=0.20.0rc3`. [^3] |

## References

| Resource | URL | Category | Why Read | Outcome | Time |
| :-- | :-- | :-- | :-- | :-- | :-- |
| Official Documentation | [Qwen3: Think Deeper, Act Faster](https://qwenlm.github.io/blog/qwen3/) | official | Read this for the canonical family-level spec, model sizes, context windows, multilingual scope, and deployment recommendations. | You will extract the authoritative deployment envelope and capability profile. | 15-20 min |
| Model Card | [Qwen/Qwen3-4B-Instruct-2507](https://huggingface.co/Qwen/Qwen3-4B-Instruct-2507) | documentation | Read this for a current checkpoint example and model-card metadata. | You will verify current release naming and checkpoint structure. | 5-10 min |
| Technical Report | [Qwen3 Technical Report](https://arxiv.org/abs/2505.09388) | papers | Read this for the architecture, training recipe, and benchmark framing. | You will understand the reasoning, data, and system trade-offs behind the family. | 20-30 min |
| Inference Framework | [Qwen3 GitHub repository](https://github.com/QwenLM/Qwen3) | documentation | Read this for framework versions, supported runtimes, and deployment examples. | You will get concrete serving and local-run constraints. | 15-20 min |
| Repository | [QwenLM/Qwen3](https://github.com/QwenLM/Qwen3) | repositories | Read this for the release history, runtime matrix, and official usage snippets. | You will confirm which checkpoints and runtimes are currently documented. | 10-15 min |

## Related Models

* **Related Models:** Qwen2.5, Qwen3-Coder, Qwen3-VL, Qwen3-Omni, Qwen3-TTS, Qwen3-ASR.[^3][^1]
* **Alternative Models:** DeepSeek-R1, Llama 3.1/3.3, Mistral Large-class open models, and other open-weight reasoning-capable decoder-only LLMs.[^1]


## Capabilities

* **Instruction Tuned:** Yes.[^3][^1]
* **Reasoning:** Yes — hybrid thinking mode supports explicit thinking and non-thinking operation, with budget control via chat template and mode switches.[^3][^1]
* **Vision:** Yes for the Qwen3-VL family, but not for the base Qwen3 text-only family.[^3][^1]
* **Multilingual:** Yes — 119 languages and dialects are documented.[^1]
* **Tool Calling:** Yes.[^3][^1]
* **Function Calling:** Yes.[^3][^1]
* **Thinking Model:** Yes — official docs describe thinking mode, non-thinking mode, `/think`, `/no_think`, and `enable_thinking`.[^3][^1]
* **Context Window:** 32K for 0.6B/1.7B/4B; 128K for 8B/14B/32B/30B-A3B/235B-A22B.[^1]
* **Max Output Tokens:** Not officially disclosed in the retrieved sources.[^3][^1]


## Deployment

* **Supported Runtimes:** Transformers, ModelScope, llama.cpp, Ollama, LM Studio, ExecuTorch, MNN, MLX LM, OpenVINO, SGLang, vLLM, TensorRT-LLM, MindIE.[^3][^1]
* **Recommended Runtime:** vLLM or SGLang for server deployment; official docs recommend them for OpenAI-compatible serving, with vLLM positioned for high-throughput and memory-efficient inference.[^3]
* **Quantizations:** GPTQ, AWQ, GGUF, and official quantized variants are documented; family-level quantization guidance is provided in the repository.[^3]
* **Recommended Quantization:** GGUF for local CPU/edge workflows and AWQ/GPTQ for production compression when GPU memory is constrained.[^3]
* **CPU Supported:** Yes.[^1][^3]
* **GPU Supported:** Yes.[^1][^3]
* **MPS Supported:** Yes, via MLX on Apple Silicon.[^3]


## Hardware Requirements

### Dense variants

| Variant | Minimum GPU Memory | Recommended GPU Memory | Minimum RAM | Recommended RAM | Disk Space | Recommended GPU |
| :-- | --: | --: | --: | --: | --: | :-- |
| Qwen3-0.6B | Not officially disclosed | Not officially disclosed | Not officially disclosed | Not officially disclosed | Not officially disclosed | Not officially disclosed [^1][^3] |
| Qwen3-1.7B | Not officially disclosed | Not officially disclosed | Not officially disclosed | Not officially disclosed | Not officially disclosed | Not officially disclosed [^1][^3] |
| Qwen3-4B | Not officially disclosed | Not officially disclosed | Not officially disclosed | Not officially disclosed | Not officially disclosed | Not officially disclosed [^1][^3] |
| Qwen3-8B | Not officially disclosed | Not officially disclosed | Not officially disclosed | Not officially disclosed | Not officially disclosed | Not officially disclosed [^1][^3] |
| Qwen3-14B | Not officially disclosed | Not officially disclosed | Not officially disclosed | Not officially disclosed | Not officially disclosed | Not officially disclosed [^1][^3] |
| Qwen3-32B | Not officially disclosed | Not officially disclosed | Not officially disclosed | Not officially disclosed | Not officially disclosed | Not officially disclosed [^1][^3] |

### MoE variants

| Variant | Minimum GPU Memory | Recommended GPU Memory | Minimum RAM | Recommended RAM | Disk Space | Recommended GPU |
| :-- | --: | --: | --: | --: | --: | :-- |
| Qwen3-30B-A3B | Not officially disclosed | Not officially disclosed | Not officially disclosed | Not officially disclosed | Not officially disclosed | Not officially disclosed [^1][^3] |
| Qwen3-235B-A22B | Not officially disclosed | Not officially disclosed | Not officially disclosed | Not officially disclosed | Not officially disclosed | Not officially disclosed [^1][^3] |

## Downloads

| Platform | URL | Official | Notes |
| :-- | :-- | :-- | :-- |
| GitHub | [QwenLM/Qwen3](https://github.com/QwenLM/Qwen3) | Yes | Official repository and documentation hub. [^3] |
| Hugging Face | [Qwen/Qwen3-4B-Instruct-2507](https://huggingface.co/Qwen/Qwen3-4B-Instruct-2507) | Yes | Official model hosting for released checkpoints. [^4] |
| ModelScope | [Qwen3 documentation](https://qwenlm.github.io/blog/qwen3/) | Yes | Official docs recommend ModelScope for downloads in some regions. [^3] |

## Runtime Compatibility

| Runtime | Supported | Minimum Version | Notes |
| :-- | :-- | :-- | :-- |
| Transformers | Yes | 4.51.0 | Officially required for Qwen3 inference. [^3] |
| vLLM | Yes | 0.9.0 | Recommended for high-throughput serving. [^3] |
| SGLang | Yes | 0.4.6.post1 | Recommended for OpenAI-compatible serving. [^3] |
| llama.cpp | Yes | b5401 | Official docs recommend this baseline for full support. [^3] |
| Ollama | Yes | 0.9.0 | Official docs recommend this baseline. [^3] |
| MLX LM | Yes | 0.24.0 | Apple Silicon support. [^3] |
| TensorRT-LLM | Yes | 0.20.0rc3 | NVIDIA serving path with PyTorch backend support. [^3] |
| OpenVINO | Yes | Not officially disclosed | Official docs state support but do not give a minimum version in the retrieved sources. [^3] |
| ExecuTorch | Yes | Not officially disclosed | Official docs mention export and run support. [^3] |
| MNN | Yes | Not officially disclosed | Official docs mention mobile support. [^3] |

## License

* **Name:** Apache 2.0 for all open-weight Qwen3 models.[^3]
* **Commercial Use:** Yes.[^3]
* **Modification:** Yes.[^3]
* **Redistribution:** Yes.[^3]
* **Attribution Required:** Yes.[^3]
* **Notes:** The retrieved official documentation states that all open-weight Qwen3 models are Apache 2.0 licensed; no variant-specific MAU threshold or alternative license was disclosed in the sources retrieved here.[^3]


## Status

* **Release Date:** 2025-04-29 for Qwen3; 2025-07-21 to 2025-08-08 for the Qwen3-2507 refreshes.[^3]
* **Maintenance Status:** Production.[^3]


## Engineering Snapshot

* **Best For:**
    - Production chat and reasoning systems that need controllable thinking depth.[^1][^3]
    - Multilingual assistants with broad language coverage.[^1]
    - Self-hosted serving stacks that need open weights and multiple runtime options.[^3]
* **Avoid For:**
    - Workloads that require fully specified hardware sizing from official docs only, because variant-level memory guidance is not officially disclosed in the retrieved sources.[^1][^3]
    - Deployments that cannot tolerate extra latency from thinking mode or MoE routing.[^1]
    - Use cases requiring multimodal vision features from the base text-only family.[^1][^3]
* **Deployment Complexity:** High.[^1][^3]
* **Production Ready:** true.[^3]
* **Recommended Use Case:** Self-hosted production LLM serving with hybrid reasoning control and multilingual generalist capability.[^1][^3]


## Timeline

| Version | Release Date | Notes |
| :-- | :-- | :-- |
| Qwen3 (Qwen3-2504) | 2025-04-29 | Initial Qwen3 release with dense and MoE checkpoints. [^3] |
| Qwen3-2507 | 2025-07-21 to 2025-08-08 | Updated Instruct and Thinking variants with longer-context and quality improvements. [^3] |

## Engineering Notes

### Inference Notes

* Use thinking mode only when the task benefits from explicit reasoning depth; the official docs expose `/think`, `/no_think`, and `enable_thinking` as the control surface.[^1][^3]
* For MoE checkpoints, plan around active-parameter efficiency rather than total parameter count alone, because official positioning is based on 3B or 22B active parameters.[^1]
* For high-throughput serving, the official guidance favors vLLM and SGLang, with reasoning parsers required for thought-enabled deployments.[^3]


### Deployment Notes

* Apache 2.0 applies to the open-weight family in the retrieved official docs; no alternate license distinction was documented here for different Qwen3 checkpoints.[^3]
* The 2507 refresh introduces Instruct and Thinking splits for selected sizes, so production routing should treat them as distinct serving artifacts.[^3]


### Optimization Notes

* Official docs emphasize context-length-aware serving, quantized local runtimes, and explicit reasoning parsers for supported engines.[^3]
* For local deployments, llama.cpp, Ollama, and MLX are the documented low-friction paths.[^3]


### Compatibility Notes

* The repository documents support across Transformers, ModelScope, llama.cpp, Ollama, LM Studio, ExecuTorch, MNN, MLX LM, OpenVINO, SGLang, vLLM, TensorRT-LLM, and MindIE.[^3]
* For multi-step tool use with thinking models, the official docs warn that SGLang and vLLM request preprocessing may drop `reasoning_content`, which can reduce quality unless handled carefully.[^3]


### Common Pitfalls

* Treating the thinking and non-thinking checkpoints as interchangeable can break latency or reasoning expectations; choose the checkpoint type explicitly.[^3]
* Using default short contexts in Ollama or llama.cpp can cause problems for Qwen3’s long-context configurations; set context parameters intentionally.[^3]
* Ignoring official parser requirements for reasoning-capable serving stacks can degrade tool-use quality in production.[^3]


## Related Models

| ID | Relationship |
| :-- | :-- |
| qwen-2-5-family | predecessor family |
| qwen3-coder | specialized coding offshoot |
| qwen3-vl | multimodal extension |
| qwen3-omni | multimodal generalist extension |
| qwen3-asr | speech-adjacent extension |
| qwen3-tts | speech generation extension |

## Further Study

### Research Papers

* Qwen3 Technical Report - Qwen Team, Alibaba Cloud[^1]


### Official Documentation

* Qwen3: Think Deeper, Act Faster - Qwen Team, Alibaba Cloud[^1]
* QwenLM/Qwen3 repository - Qwen Team, Alibaba Cloud[^3]


### Engineering Blogs

* Qwen3 release blog - Qwen Team, Alibaba Cloud[^1]


## Suggested Meta

* **Tags:** llm, qwen, alibaba-cloud, open-weight, reasoning, multilingual, moe, self-hosting, agents, finetuning, rag
* **Aliases:** Qwen 3, Qwen3, Qwen 3.x
* **Keywords:** Qwen3, Qwen 3 family, Alibaba Cloud Qwen, hybrid thinking, MoE, multilingual LLM, open-weight LLM
* **Search Tokens:** qwen3 family, qwen3 instruct, qwen3 thinking, qwen3 moe, qwen3 coder, alibaba qwen
* **Difficulty:** Advanced
* **Domain:** llm
* **Engineering Area:** deployment, inference, optimization
* **Estimated Reading Time:** 20
* **Prerequisites:** production LLM serving, inference runtimes, quantization, context management, MoE trade-offs
* **Recommended Next:** Qwen3-Coder
* **Cross-Links:**
    * related_models: qwen-2-5-family, qwen3-coder, qwen3-vl, qwen3-omni, qwen3-asr, qwen3-tts
    * related_packages: transformers, vllm, sglang, llama-cpp, ollama
    * related_workflows: llm-serving, rag-deployment, agentic-tool-use
    * related_patterns: hybrid-thinking-routing, moe-serving, long-context-serving
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://qwenlm.github.io/blog/qwen3/

[^2]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md

[^3]: https://github.com/qwenLM/qwen3

[^4]: https://huggingface.co/Qwen/Qwen3-4B-Instruct-2507

[^5]: https://arxiv.org/pdf/2309.16609.pdf

[^6]: https://arxiv.org/pdf/2308.12966.pdf

[^7]: https://arxiv.org/pdf/2409.12186.pdf

[^8]: https://arxiv.org/pdf/2501.15383.pdf

[^9]: https://arxiv.org/pdf/2502.13923.pdf

[^10]: https://docs.aws.amazon.com/en_us/bedrock/latest/userguide/model-card-qwen-qwen3-235b-a22b-2507.html

[^11]: https://docs.aws.amazon.com/de_de/bedrock/latest/userguide/model-card-qwen-qwen3-235b-a22b-2507.md

[^12]: https://docs.aws.amazon.com/id_id/bedrock/latest/userguide/model-card-qwen-qwen3-235b-a22b-2507.html

[^13]: https://docs.aws.amazon.com/ko_kr/bedrock/latest/userguide/model-card-qwen-qwen3-235b-a22b-2507.html

[^14]: https://docs.aws.amazon.com/fr_fr/bedrock/latest/userguide/model-card-qwen-qwen3-coder-30b-a3b-instruct.md

[^15]: https://developer.puter.com/ai/qwen/qwen3-30b-a3b-instruct-2507/

[^16]: https://docs.aws.amazon.com/zh_cn/bedrock/latest/userguide/model-card-qwen-qwen3-coder-30b-a3b-instruct.html

[^17]: https://github.com/QwenLM/Qwen3/blob/main/README.md

