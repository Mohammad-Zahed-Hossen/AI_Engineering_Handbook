<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

### Perflexity : https://www.perplexity.ai/search/faa24b65-e9b0-4064-9d9d-acbcdf107ace

# DeepSeek Family

## Overview

DeepSeek Family is a production-oriented LLM registry entry covering the V3.x, R1, distilled R1, and DeepSeek-Coder lines, with a strong emphasis on reasoning, agents, coding, and long-context workloads. The family’s main engineering differentiators are Mixture-of-Experts efficiency in V3.x and R1-class models, Multi-Head Latent Attention for KV-cache efficiency, and explicit reasoning / thinking-mode support in the R1 lineage and newer chat variants.[^1][^2][^3]

## Identity

* **Family:** DeepSeek.[^2][^1]
* **Variants:** V3.2 (Chat), V3.1 (Chat/Hybrid), R1 (Reasoner), R1-0528, R1 Distill 7B/8B/14B/32B, DeepSeek-Coder 6.7B/33B.[^4][^5][^6][^7][^1]
* **Provider:** DeepSeek AI.[^1][^2]
* **Checkpoints:** Base and chat/reasoner checkpoints are published for the main family releases; distilled checkpoints are published as dense Qwen/Llama-derived reasoning models.[^7][^1]


## Architecture

* **Architecture Type:** Decoder-only Transformer with MoE and MLA for the V3.x and R1-class family.[^8][^2]
* **Transformer Type:** Decoder-only.[^2][^8]
* **Attention Mechanism:** Multi-Head Latent Attention; DeepSeek-V3 uses MLA and DeepSeekMoE, with 671B total parameters and 37B activated per token in the technical report. R1 inherits the reasoning-oriented family design and the distilled R1 line is dense rather than MoE.[^1][^2]
* **Tokenizer:** Unknown.[^2][^1]
* **Positional Encoding:** RoPE is not explicitly confirmed in the cited family sources here; Not Published in the retrieved official materials.[^1][^2]
* **KV Cache:** Yes.[^8]
* **Flash Attention:** Not Published.
* **Mixture of Experts:** Yes for V3.x and R1-class frontier family members; DeepSeek-V3 reports 671B total parameters with 37B activated per token, and DeepSeekMoE is the sparse routing mechanism referenced in the technical report.[^2]


## File Formats

* **Safetensors:** Yes for Hugging Face-hosted checkpoints in the open releases.[^7][^1]
* **GGUF:** Yes for community-converted deployment paths; community consensus only.[^9]
* **AWQ:** Yes for community deployment paths; community consensus only.[^9]
* **GPTQ:** Yes for community deployment paths; community consensus only.[^9]
* **MLX:** Not Published.
* **ONNX:** Not Published.
* **TensorRT:** Not Published.


## Ecosystem Support

| Framework | Supported | Notes |
| :-- | :-- | :-- |
| Transformers | Yes | Official and community model artifacts are distributed through Hugging Face-compatible checkpoints for the released family members.[^1][^7] |
| vLLM | Yes | vLLM documents DeepSeek-specific renderers/support paths for the family, indicating active inference support.[^10] |
| SGLang | Yes | Community deployment support is established for DeepSeek-family reasoning models; official confirmation not retrieved here. |
| Ollama | Yes | Community-supported model availability exists for distilled and quantized variants; official confirmation not retrieved here. |
| Llama.cpp | Yes | Community conversion and local deployment are widely used for smaller/distilled checkpoints; official confirmation not retrieved here. |
| MLX | No | Not Published. |
| LiteLLM | Yes | Commonly used as an API shim for hosted DeepSeek-compatible endpoints; official confirmation not retrieved here. |
| OpenRouter | Yes | Hosted routing availability is commonly provided for DeepSeek-family models; official confirmation not retrieved here. |
| LM Studio | Yes | Community deployment support exists for local quantized variants; official confirmation not retrieved here. |
| TensorRT-LLM | Yes | Community deployment support exists for compatible checkpoints; official confirmation not retrieved here. |

## References

| Resource | URL | Category | Why Read | Outcome | Time | Confidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| [Official Documentation] | [DeepSeek API Docs](https://api-docs.deepseek.com/updates/) | official | Confirms current model naming, API compatibility, and release behavior across DeepSeek-family endpoints. | Understand current hosted model surface and API-level deployment constraints. | 10 minutes | Official |
| [Model Card] | [Amazon Bedrock DeepSeek V3.2](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-deepseek-deepseek-v3-2.html) | documentation | Provides the hosted model-card view for V3.2, including context and output limits. | Extract deployment-relevant runtime parameters for the latest chat variant. | 10 minutes | Official |
| [Technical Report] | [DeepSeek-V3 Technical Report](https://arxiv.org/pdf/2412.19437.pdf) | papers | The primary source for the MoE + MLA architecture and activated-parameter profile. | Learn the family’s core efficiency design and inference implications. | 20 minutes | Research |
| [Technical Report] | [DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning](https://arxiv.org/pdf/2501.12948.pdf) | papers | The primary source for the reasoning line, including the distilled R1 releases. | Understand reasoning-oriented training and distillation strategy. | 20 minutes | Research |
| [Technical Report] | [DeepSeek-Coder: When the Large Language Model Meets Programming -- The Rise of Code Intelligence](https://arxiv.org/pdf/2401.14196.pdf) | papers | The primary source for the coder family’s code-centric design and scale. | Understand the coding-oriented checkpoint line and its deployment fit. | 15 minutes | Research |
| [Inference Framework] | [vLLM DeepSeek renderer docs](https://docs.vllm.ai/en/latest/api/vllm/renderers/deepseek_v4/) | documentation | Confirms ecosystem-level inference support for DeepSeek-family architectures. | Validate runtime compatibility and serving integration paths. | 10 minutes | Community |
| [Repository] | [DeepSeek-R1 GitHub](https://github.com/deepseek-ai/DeepSeek-R1) | repositories | Useful for official release artifacts and family-relevant implementation notes. | Locate open checkpoints, usage notes, and release context. | 10 minutes | Official |

## Related Models

* **Related Models:** DeepSeek-V2, DeepSeek-V3, DeepSeek-R1, DeepSeek-R1-Distill, DeepSeek-Coder-V2, and other DeepSeek open-weight family members sharing the same sparse-efficiency lineage.[^6][^8][^7][^2]
* **Alternative Models:** Qwen3, Llama 3.x, Mixtral, and Gemini-class hosted reasoning models for teams comparing open-weight reasoning and coding deployments.[^11][^9]


## Capabilities

* **Instruction Tuned:** Yes.[^5][^4]
* **Reasoning:** Yes; the R1 line is explicitly a reasoning model and V3.1/V3.2-hosted surfaces expose reasoning-oriented chat behavior.[^3][^4][^5]
* **Vision:** No.
* **Multilingual:** Yes; broad multilingual capability is implied across family releases, but the exact language count is Not Published in the retrieved sources.[^1][^2]
* **Tool Calling:** Yes; V3.1/V3.2 family positioning and API docs describe agent-oriented usage and tool-friendly integration surfaces.[^12][^3]
* **Function Calling:** Yes; supported through API-compatible hosted surfaces.[^3]
* **Thinking Model:** Yes; explicitly supported in R1 and in hybrid chat/reasoning variants.[^13][^5][^3]
* **Context Window:** 164K tokens for DeepSeek V3.2 on Bedrock; R1 is documented at 128K in the official hosted card, while R1-0528 is described in official Chinese docs as 64K on first-party surfaces.[^14][^4][^5]
* **Max Output Tokens:** 8K on the retrieved hosted cards.[^4][^5]


## Engineering Snapshot

* **Best For:**
    - Reasoning-heavy agent systems that benefit from explicit thinking mode and tool use.[^5][^3]
    - Code generation and code intelligence workloads, especially when compared against general-purpose chat models.[^6][^7]
    - Self-hosted or hybrid deployments that need strong capability per active token and long-context efficiency.[^8][^2]
* **Avoid For:**
    - Tiny-memory deployments that cannot tolerate large-model or multi-GPU serving overhead for frontier variants.[^8][^2]
    - Workloads that require fully specified tokenizer/format behavior from official sources when the deployment chain has not been validated.[^2][^1]
    - Teams that need only a simple, small, non-reasoning chat model and would not benefit from thinking-mode overhead.[^5][^3]
* **Deployment Complexity:** high
* **Production Ready:** true
* **Recommended Use Case:** Use V3.2 or V3.1 for hosted agent/chat systems, R1 or R1-0528 for deliberate reasoning pipelines, and distilled R1 or DeepSeek-Coder for cost-constrained self-hosted deployments.[^4][^6][^5][^1]


## Engineering Decision

### Choose If

* You need a reasoning-first or agent-first LLM with explicit thinking-mode behavior, strong code and math performance, and a deployment path that can exploit sparse computation efficiency.[^3][^5][^2]


### Avoid If

* You need a fully transparent, small-footprint model with minimal serving complexity and no special handling for reasoning overhead or MoE routing.[^8][^2]


### Watch Out For

* Thinking-mode variants increase latency and token consumption relative to non-thinking chat paths, so the serving policy must control when reasoning is enabled.[^5][^3]
* MoE routing makes capacity planning sensitive to active-parameter behavior rather than total parameter count alone.[^2]
* Distilled R1 models are dense and more practical for single-GPU serving, but they are not the same operational profile as frontier MoE variants.[^1]
* Long-context deployment should be treated as a memory-capacity problem first and a model-quality problem second because KV-cache savings from MLA materially affect feasible batch size and throughput.[^8]


### Best Deployment Scenario

* Deploy V3.2/V3.1 on a managed hosted endpoint for agentic chat, or deploy R1/R1-0528 behind a selective reasoning gate when the application needs multi-step deliberation and can tolerate additional latency.[^4][^3][^5]


### Alternatives

* Qwen3 for broadly comparable open-weight reasoning/coding deployment trade-offs, Llama 3.x for ecosystem breadth, and hosted frontier reasoning APIs when operational simplicity matters more than model ownership.[^11][^9]


### Performance Dimensions

| Dimension | Rating | Notes | Recommendation Source |
| :-- | :-- | :-- | :-- |
| Reasoning quality | excellent | R1 is explicitly a reasoning model and V3.2 is positioned for reasoning-first agent use.[^5][^12] | Official |
| Coding | excellent | DeepSeek-Coder and the broader family target code intelligence and coding tasks directly.[^7][^6] | Research |
| Memory efficiency | good | MLA reduces KV-cache burden, improving feasible long-context serving.[^8][^2] | Research |
| Throughput efficiency | good | Sparse MoE activation means only a fraction of total parameters are active per token.[^2] | Research |
| Deployment simplicity | fair | Frontier variants need careful runtime and hardware planning; distilled variants are simpler but less capable.[^1][^2] | Community Consensus |
| Tool/agent fit | excellent | Official positioning emphasizes agent-era and tool-friendly behavior in newer releases.[^12][^3] | Official |

### Deployment Profiles

| Profile | Recommended Variant | Expected Experience | Notes | Recommendation Source |
| :-- | :-- | :-- | :-- | :-- |
| Small edge deployment | R1 Distill 7B or 8B | Usable reasoning with tight memory budgets | Best fit when local inference is mandatory and quality trade-offs are acceptable.[^1] | Research |
| Medium server deployment | R1 Distill 14B or 32B | Strong balance of quality and deployability | Practical self-hosted choice for many production apps.[^1] | Research |
| Enterprise deployment | V3.2 or V3.1 | Best hosted quality for agentic chat and tool use | Prefer managed endpoints when latency/ops matter more than model ownership.[^4][^3] | Official |
| Reasoning deployment | R1 or R1-0528 | Highest reasoning emphasis | Use when multi-step deliberation is central to correctness.[^5][^15] | Official |
| Coding deployment | DeepSeek-Coder 33B | Strong code intelligence | Prefer the larger coder checkpoint when code quality dominates cost.[^7] | Research |
| Long-context deployment | V3.2 | Best family option in retrieved hosted sources | MLA and hosted context support make it the most deployment-friendly long-context choice here.[^4][^8] | Official |
| Distilled reasoning deployment | R1 Distill 7B/8B/14B/32B | Lower-cost reasoning with better local runtime fit | Dense checkpoints are simpler to serve than frontier MoE models.[^1] | Research |
| Tool-enhanced reasoning deployment | V3.1 or V3.2 | Best balance of reasoning and tool-use behavior | Official release positioning frames these as agent-era models.[^3][^12] | Official |

### Runtime Matrix

| Runtime | Supports | Official | Priority | Notes | Recommendation Source |
| :-- | :-- | :-- | :-- | :-- | :-- |
| Transformers | Base checkpoint loading | Yes | recommended | Primary ecosystem for open checkpoints and fine-tuning workflows.[^1][^7] | Official |
| vLLM | Serving / rendering support | Yes | recommended | DeepSeek-specific renderer support is documented in vLLM.[^10] | Community |
| SGLang | Serving / agent pipelines | Yes | supported | Commonly used for reasoning and tool-using deployments; official confirmation not retrieved here. | Community Consensus |
| Hugging Face | Checkpoint distribution | Yes | recommended | Official open artifacts are distributed through HF-compatible releases.[^1][^7] | Official |
| Bedrock | Hosted inference | Yes | recommended | Managed DeepSeek V3.2 and R1 surfaces are documented by AWS.[^4][^5] | Official |
| Vertex AI | Hosted inference | Yes | supported | Google documents DeepSeek model access paths on Vertex AI.[^13] | Community |
| GitHub | Official repository access | Yes | supported | Official repositories provide release context and artifacts.[^16] | Official |

## Timeline

| Version | Release Date | Notes |
| :-- | :-- | :-- |
| DeepSeek-Coder | 2024-01-26 | Code-intelligence family introduced with 1.3B to 33B checkpoints.[^7] |
| DeepSeek-V2 | 2024-06-19 | Established the MLA + DeepSeekMoE efficiency direction.[^8] |
| DeepSeek-V3 | 2025-02-18 | Reported 671B total parameters and 37B active per token.[^2] |
| DeepSeek-R1 | 2025-01-22 | Introduced reasoning-focused RL training and distillation line.[^1] |
| DeepSeek-R1-0528 | 2025-05-28 | Official incremental reasoning release.[^15] |
| DeepSeek-V3.1 | 2025-08-21 | Agent-era positioning with hybrid thinking / non-thinking behavior.[^17][^3] |
| DeepSeek-V3.2 | 2025-12-01 | Hosted model-card release date on Bedrock.[^4] |

## Engineering Notes

### Inference Notes

* MLA materially reduces KV-cache pressure compared with conventional attention, which improves long-context feasibility and helps preserve throughput under higher sequence lengths.[^8]
* MoE routing means total parameter count is a poor proxy for per-token compute; active parameters per token are the more relevant serving metric.[^2]
* Thinking-mode paths should be treated as a separate latency tier because reasoning tokens increase response time and budget consumption.[^3][^5]


### Deployment Notes

* Frontier V3.x and R1-class deployments are better suited to multi-GPU or managed hosted setups, while distilled R1 checkpoints are the practical choice when single-node or local serving matters.[^1][^2]
* Hosted API and self-hosted checkpoints are both viable, but API-backed deployments reduce serving complexity while sacrificing direct control over routing and quantization choices.[^4][^3]
* Use reasoning gating in production so the model only enters thinking mode for tasks that justify the extra compute.[^5][^3]


### Optimization Notes

* Quantization is most attractive on distilled dense checkpoints because the operational compromise is easier to manage than on frontier MoE models; community analysis shows the family is frequently deployed with 4-bit variants in practice.[^9]
* For long-context use, prioritize KV-cache compression effects from MLA before chasing larger batch sizes.[^8]
* Distillation is a valid deployment strategy when the main objective is to reduce serving cost while retaining a usable subset of R1 behavior.[^1]


### Compatibility Notes

* Hosted DeepSeek API compatibility is designed to align with OpenAI/Anthropic-style interfaces, which lowers integration friction for agents and SDKs.[^3]
* The family’s reasoning surfaces are not all identical: R1 emphasizes explicit thinking, while V3.1/V3.2 introduce hybrid chat behavior with agent-oriented positioning.[^12][^5][^3]
* Context limits and output caps vary by hosted surface and version, so deployment code should not assume one universal limit across the family.[^14][^4][^5]


### Migration Notes

* From DeepSeek-V2, expect the core shift to be improved sparse efficiency and long-context behavior driven by MLA and MoE refinements.[^2][^8]
* From Llama-family deployments, expect better reasoning-specialized behavior in R1 but a less universal ecosystem footprint than the most common open models.[^9][^1]
* From Qwen3-style reasoning stacks, DeepSeek’s strongest differentiator is the explicit reasoning lineage plus the V3.x MoE/MLA architecture combo.[^1][^2]


### Common Pitfalls

* Enabling thinking mode indiscriminately increases latency and cost; mitigate by routing only hard tasks into reasoning mode.[^5][^3]
* Treating total parameter count as the serving cost is misleading for MoE models; use activated-parameter and context-length metrics instead.[^2]
* Over-quantizing reasoning checkpoints can erode answer quality on hard math and code tasks; validate on domain-specific evals before production rollout.[^9]
* Assuming every variant shares the same context window or output cap will cause deployment bugs; verify limits per specific hosted endpoint.[^14][^4][^5]


## Related Models

| ID | Relationship |
| :-- | :-- |
| DeepSeek-V2 | Prior efficiency baseline for MLA and sparse MoE design.[^8] |
| DeepSeek-V3 | Core frontier MoE/MLA family member.[^2] |
| DeepSeek-R1 | Reasoning-first family member with explicit thinking behavior.[^1][^5] |
| DeepSeek-R1-Distill | Dense reasoning distillations for smaller-scale deployment.[^1] |
| DeepSeek-Coder-V2 | Coding-specialized predecessor for code intelligence.[^6] |
| Qwen3 | Alternative open-weight reasoning/coding family for deployment comparisons.[^9] |
| Llama 3.x | Alternative ecosystem-heavy open-weight family for serving and fine-tuning.[^9] |

## Further Study

### Research Papers

* [DeepSeek-V3 Technical Report](https://arxiv.org/pdf/2412.19437.pdf) — DeepSeek AI.[^2]
* [DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning](https://arxiv.org/pdf/2501.12948.pdf) — DeepSeek AI.[^1]
* [DeepSeek-Coder: When the Large Language Model Meets Programming -- The Rise of Code Intelligence](https://arxiv.org/pdf/2401.14196.pdf) — DeepSeek AI.[^7]
* [DeepSeek-V2: A Strong, Economical, and Efficient Mixture-of-Experts Language Model](https://arxiv.org/pdf/2405.04434.pdf) — DeepSeek AI.[^8]


### Official Documentation

* [DeepSeek API Docs](https://api-docs.deepseek.com/updates/) — DeepSeek AI.[^3]
* [DeepSeek-R1-0528 Release](https://api-docs.deepseek.com/news/news250528/) — DeepSeek AI.[^15]
* [DeepSeek-V3.1 Release](https://api-docs.deepseek.com/news/news250821/) — DeepSeek AI.[^17]
* [Amazon Bedrock DeepSeek V3.2 Model Card](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-deepseek-deepseek-v3-2.html) — AWS.[^4]
* [Amazon Bedrock DeepSeek R1 Model Card](https://docs.aws.amazon.com/zh_cn/bedrock/latest/userguide/model-card-deepseek-deepseek-r1.html) — AWS.[^5]


### Engineering Blogs

* [V3.1-Terminus Comparison Testing](https://api-docs.deepseek.com/guides/comparison_testing) — DeepSeek AI.[^18]
* [vLLM DeepSeek renderer docs](https://docs.vllm.ai/en/latest/api/vllm/renderers/deepseek_v4/) — vLLM contributors.[^10]
<span style="display:none">[^19][^20][^21][^22][^23][^24][^25][^26][^27][^28][^29][^30][^31][^32][^33][^34][^35][^36][^37][^38][^39][^40][^41][^42][^43][^44][^45][^46][^47][^48][^49][^50][^51]</span>

<div align="center">⁂</div>

[^1]: https://arxiv.org/pdf/2501.12948.pdf

[^2]: https://arxiv.org/pdf/2412.19437.pdf

[^3]: https://api-docs.deepseek.com/updates

[^4]: https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-deepseek-deepseek-v3-2.html

[^5]: https://docs.aws.amazon.com/zh_cn/bedrock/latest/userguide/model-card-deepseek-deepseek-r1.html

[^6]: https://arxiv.org/pdf/2406.11931.pdf

[^7]: https://arxiv.org/pdf/2401.14196.pdf

[^8]: https://arxiv.org/pdf/2405.04434.pdf

[^9]: https://arxiv.org/abs/2502.11164

[^10]: https://docs.vllm.ai/en/latest/api/vllm/renderers/deepseek_v4/

[^11]: https://arxiv.org/abs/2605.02821

[^12]: https://api-docs.deepseek.com/news/news251201/

[^13]: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/maas/deepseek?hl=zh-cn

[^14]: https://api-docs.deepseek.com/zh-cn/news/news250528/

[^15]: https://api-docs.deepseek.com/news/news250528/

[^16]: https://github.com/deepseek-ai/DeepSeek-R1/commit/7ca5e1e7f75e12a1c561fffaa6aa686708f881ae

[^17]: https://api-docs.deepseek.com/news/news250821/

[^18]: https://api-docs.deepseek.com/guides/comparison_testing

[^19]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md

[^20]: MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md

[^21]: CONTENT_QUALITY_STANDARD.md

[^22]: ARCHITECTURE_FREEZE.md

[^23]: AENS-Knowledge-Layer-Specification.md

[^24]: https://www.semanticscholar.org/paper/432565386c994cfaa73f30de5d9a4c464da54963

[^25]: https://www.nature.com/articles/s41598-026-61419-4

[^26]: https://www.frontiersin.org/articles/10.3389/fpubh.2026.1818821/full

[^27]: https://www.jmir.org/2026/1/e91222

[^28]: https://www.nature.com/articles/s41598-026-62380-y

[^29]: https://aclanthology.org/2026.semeval-1.355

[^30]: https://medinform.jmir.org/2026/1/e93054

[^31]: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/maas/deepseek/deepseek-v32

[^32]: https://docs.aws.amazon.com/fr_fr/bedrock/latest/userguide/model-card-deepseek-deepseek-v3-2.md

[^33]: https://docs.aws.amazon.com/ko_kr/bedrock/latest/userguide/model-card-deepseek-deepseek-v3-2.html

[^34]: https://build.nvidia.com/deepseek-ai/deepseek-v3_2/modelcard

[^35]: https://api-docs.deepseek.com/news/news250929

[^36]: https://docs.aws.amazon.com/zh_cn/bedrock/latest/userguide/model-card-deepseek-deepseek-v3-2.md

[^37]: https://d-central.tech/ai/model/deepseek-r1/

[^38]: https://arxiv.org/html/2503.16529

[^39]: https://arxiv.org/html/2502.02523

[^40]: https://arxiv.org/pdf/2503.00624.pdf

[^41]: https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/deepseek?hl=pt-br

[^42]: https://api-docs.deepseek.com/news/news250528

[^43]: https://api-docs.deepseek.com/updates/

[^44]: https://api-docs.deepseek.com/api/list-models

[^45]: https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/deepseek?hl=zh-tw

[^46]: https://docs.aws.amazon.com/bedrock/latest/userguide/model-cards-deepseek.md

[^47]: https://arxiv.org/html/2503.15092v1

[^48]: https://api-docs.deepseek.com/zh-cn/news/news250922

[^49]: https://api-docs.deepseek.com/news/news250922

[^50]: https://api-docs.deepseek.com/zh-cn/updates/

[^51]: https://api-docs.deepseek.com/zh-cn/news/news250821/

