<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# kv-cache

## Description

KV Cache is a decoding-time memory structure that stores attention keys and values from prior tokens so an autoregressive model can reuse them instead of recomputing them at every step. It solves the shift from compute-heavy full-sequence attention toward memory-bandwidth-limited incremental decoding, which is essential for low-latency LLM serving and high-throughput batching.[^1][^2][^3]

## Concept

KV Cache works by separating the expensive **prefill** phase from the incremental **decode** phase: the model computes and stores key/value states once during prefill, then appends one token’s K/V per layer at each decode step and reuses all previous states for attention over the growing context. This changes the cost profile from recomputing attention over the full prefix to retrieving cached tensors, which is why cached decoding is the standard mechanism for modern autoregressive generation systems.[^2][^3]

For a sequence length $N$, standard self-attention processes the growing prefix repeatedly, giving quadratic scaling in sequence length for full attention computation and memory traffic, while cached decoding reduces the per-token attention work to operating on the new query against stored K/V history. The storage footprint for a decoder-only model is approximately $L \times B \times T \times H \times D \times 2 \times p$, where $L$ is layers, $B$ batch size, $T$ cached tokens, $H$ KV heads, $D$ head dimension, and $p$ bytes per element; the factor of 2 accounts for both keys and values.[^4][^3][^2]

The hardware bottleneck shifts because decode-time computation per token becomes small relative to the data movement needed to read cached K/V from GPU memory, so the limiting factor is often HBM bandwidth rather than FLOPs. Roofline-style analysis applies here: caching lowers arithmetic intensity because each step performs fewer FLOPs per byte transferred, which pushes execution toward the memory-bandwidth ceiling and makes SRAM-to-HBM traffic the dominant performance determinant. In practice, this also exposes cache-miss dynamics, memory fragmentation, and paging-like management issues because KV tensors are large, long-lived, and frequently allocated/deallocated across concurrent requests.[^5][^3][^6][^1][^2]

## Applicability

Use KV Cache when serving autoregressive decoders with moderate to long contexts, especially when latency and throughput matter and repeated prefix computation would otherwise dominate cost. It is especially valuable for batched inference, long-context generation, and workloads where many requests share similar prefix lengths or decoding continues for many steps.[^3][^4][^2]

Avoid KV Cache when sequences are extremely short, the model is non-autoregressive, or the system is fundamentally compute-dominated rather than memory-dominated. It can also be the wrong trade if VRAM is so constrained that the extra memory footprint forces smaller batch sizes or earlier eviction and the resulting throughput loss outweighs the latency savings.[^6][^2][^3]

KV Cache is commonly paired with PagedAttention or vLLM-style virtual memory management when variable-length requests would otherwise fragment GPU memory. It also interacts well with FlashAttention-style IO-aware kernels, quantized KV cache, and MQA/GQA, which reduce bandwidth pressure or shrink the cached footprint without changing the core reuse pattern.[^7][^4][^2][^3][^6]

## Decision Summary

**When to Use**

- Long-context autoregressive decoding where prefix reuse is substantial.[^2][^3]
- Serving workloads with tight per-token latency targets.[^3][^2]
- High-concurrency batching where recomputation would waste GPU time.[^2]
- Models whose decode path is memory-bandwidth-limited rather than compute-limited.[^1][^3]

**Don't Use**

- Very short sequences where caching overhead is not amortized.[^3]
- Non-autoregressive generation systems that do not reuse a growing prefix.[^3]
- Models or deployments with severe VRAM pressure where cache residency limits batch size.[^6][^2]
- Cases where another architecture removes the need for incremental attention state.[^4]

**Tradeoff Summary**
Latency ↓, Memory Overhead ↑, Bandwidth Pressure ↑, System Complexity ↑[^6][^2]

## Pattern Snapshot

- **Primary Goal**: Inference Latency Minimization[^2][^3]
- **Primary Constraint**: VRAM Capacity Bound[^6][^2]
- **Typical Usage**: Autoregressive Decoder LLM Inference Serving[^2]
- **Primary Bottleneck**: HBM Bandwidth[^1][^3]
- **Scaling Dimension**: Sequence Length[^4][^2]
- **Failure Mode**: VRAM Exhaustion[^6][^2]


## Tradeoffs

| Dimension | Effect | Explanation |
| :-- | :-- | :-- |
| Memory | ↑ | Stores keys and values for every cached token across layers, increasing VRAM use linearly with context and batch size [^4][^2]. |
| Compute | ↓ | Avoids recomputing past attention projections at each decode step, lowering per-token FLOPs [^3]. |
| Latency | ↓ | Reuse of cached states reduces decode-time work and improves token generation latency [^2][^3]. |
| Bandwidth | ↑ | Cached decoding becomes dominated by reading K/V from HBM, which raises memory traffic pressure [^1][^3]. |
| Complexity | ↑ | Requires cache allocation, indexing, eviction, fragmentation control, and distributed synchronization logic [^2][^6]. |

## Decision Flow

- **Step 1:** Is the model generating tokens autoregressively over a growing prefix? If Yes -> use KV Cache; If No -> skip KV Cache and optimize the model or kernel path instead.[^3]
- **Step 2:** Is decode latency or throughput a primary production requirement? If Yes -> keep KV Cache and optimize its layout; If No -> prefer simpler memory management.[^1][^2]
- **Step 3:** Is VRAM fragmentation or capacity limiting concurrency? If Yes -> add paging, quantization, or MQA/GQA; If No -> keep a straightforward contiguous cache design.[^7][^4][^2]


## System Interactions

- **Interacts With**: Paged Memory Management / vLLM
    - **Condition**: Variable-length, high-concurrency serving with many live requests.
    - **Effect**: Reduces fragmentation and allows near-zero wasted KV memory through block-based paging.[^2][^6]
- **Interacts With**: FlashAttention / IO-Aware Kernels
    - **Condition**: Decode or long-context attention is limited by HBM traffic.
    - **Effect**: Lowers off-chip memory movement and improves IO efficiency, especially when attention kernel design is bandwidth-sensitive.[^1][^3]
- **Interacts With**: MQA / GQA
    - **Condition**: KV footprint is the dominant VRAM constraint.
    - **Effect**: Shares K/V heads across query heads, shrinking cache size and raising effective concurrency.[^4]
- **Interacts With**: Continuous Batching / Request Scheduling
    - **Condition**: Many requests arrive with different prefix lengths and decode lengths.
    - **Effect**: Improves utilization, but only if cache management avoids fragmentation and per-request bookkeeping overhead.[^6][^2]


## Implementation Notes

Use static pre-allocation when request shapes are bounded and latency predictability matters, but prefer dynamic paging when sequence lengths vary widely or concurrency is high. A common layout is block-contiguous storage with per-request indirection tables because it balances locality with flexible growth, while layer-contiguous layouts simplify indexing and head-contiguous layouts can help kernel coalescing depending on the attention implementation.[^8][^2][^6]

During decoding, append each new token’s K/V at the current sequence position and advance a per-request cache length counter; never rebuild the entire prefix cache on each step because that negates the main benefit. Batch padding must be masked carefully so the cache length reflects real tokens, and position encoding logic must remain consistent across prefill and decode phases to avoid token misalignment.[^8][^3][^2]

In distributed inference, tensor-parallel shards usually split head or projection work, so cache writes must be partitioned consistently with the attention heads owned by each rank; pipeline parallelism requires stage-local cache ownership and strict handoff of the running sequence state between stages. Mixed precision and quantized KV cache can lower bandwidth and capacity cost, but dequantization overhead and numerical error can reduce quality if scaling factors are poorly chosen.[^9][^7][^2]

Common failure modes include off-by-one cache offsets, stale block-table pointers, out-of-bounds appends, silent fragmentation leaks, and inconsistent cache lengths after beam expansion or request cancellation. Treat these as memory-safety and correctness issues, not just performance bugs.[^2][^6]

## Examples

```python
def decode_step(x_t, q_proj, k_proj, v_proj, cache, layer_state, mask, pos):
    q = q_proj(x_t)
    k_new = k_proj(x_t)
    v_new = v_proj(x_t)

    cache.keys[layer_state][pos] = k_new
    cache.values[layer_state][pos] = v_new
    cache.lengths[layer_state] = pos + 1

    k_hist = cache.keys[layer_state][:pos + 1]
    v_hist = cache.values[layer_state][:pos + 1]

    scores = (q @ transpose(k_hist)) / sqrt(dim(q))
    scores = scores + mask[:pos + 1]
    weights = softmax(scores)
    y = weights @ v_hist

    return y, cache
```


## Variations

### Variation 1: Multi-Query Attention (MQA) \& Grouped-Query Attention (GQA)

- **Description**: Share key/value heads across multiple query heads to reduce the number of distinct cached K/V tensors.[^4]
- **Use When**: Memory capacity is the primary constraint.
- **Benefit**: Decreases KV cache memory footprint by 8x for MQA or 4x for GQA in common configurations.[^4]
- **Tradeoff**: Slight drop in modeling capacity or task performance compared with full multi-head attention.[^4]


### Variation 2: PagedAttention (Virtual Memory KV Caching)

- **Description**: Store KV cache in fixed-size blocks with an indirection table so physical memory does not need to remain contiguous.[^6][^2]
- **Use When**: High concurrency serving with dynamic sequence lengths.
- **Benefit**: Eliminates physical memory fragmentation and allows dynamic batch size scaling.[^2][^6]
- **Tradeoff**: Increases lookup overhead and runtime memory-management complexity.[^6][^2]


### Variation 3: Quantized KV Cache

- **Description**: Compress key and value tensors using lower-precision formats such as FP8 or integer quantization.[^9][^7]
- **Use When**: Memory bandwidth dominates inference and raw capacity limits concurrency.
- **Benefit**: Increases batch concurrency and reduces HBM bandwidth pressure; stronger compression can enable longer contexts within the same VRAM budget.[^9][^7]
- **Tradeoff**: Slight quality degradation; lower precision usually needs scaling factors and adds dequantization work in the attention kernel.[^7][^9]


## Anti-Patterns

- **Wrong**: Recomputing the entire prefix attention state at every decode step instead of appending to cache.[^3]
    - **Impact**: Restores quadratic-style redundant work and destroys latency gains.[^3]
    - **Fix**: Persist per-layer K/V state and update only the new token position.[^3][^2]
- **Wrong**: Using a contiguous cache allocator for highly variable workloads without fragmentation control.[^2][^6]
    - **Impact**: Wastes VRAM, lowers batch size, and can trigger avoidable OOMs.[^6][^2]
    - **Fix**: Use paging or block tables when request lengths vary widely.[^2][^6]
- **Wrong**: Ignoring cache precision and assuming full-precision KV always fits the serving budget.[^9][^7]
    - **Impact**: Bandwidth and capacity blow up as context length grows, reducing concurrency.[^7][^9]
    - **Fix**: Evaluate quantized KV cache, MQA/GQA, or shorter retention policies when memory is the bottleneck.[^7][^4]
- **Wrong**: Letting position and mask indices drift between prefill and decode.[^8][^2]
    - **Impact**: Produces corrupted attention alignment and hard-to-debug generation errors.[^8][^2]
    - **Fix**: Make cache length, position IDs, and masks derive from one canonical sequence counter.[^8]
- **Wrong**: Treating KV cache as a pure optimization and not a distributed systems object.[^2]
    - **Impact**: Causes synchronization bugs in tensor-parallel or pipeline-parallel serving.[^2]
    - **Fix**: Define explicit ownership, sharding, and handoff rules for every rank and stage.[^2]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23][^24][^25][^26][^27][^28][^29][^30][^31][^32][^33][^34][^35][^36][^37][^38][^39][^40]</span>

<div align="center">⁂</div>

[^1]: http://www.proceedings.com/068431-1189.html

[^2]: https://arxiv.org/abs/2309.06180

[^3]: https://arxiv.org/abs/2205.14135

[^4]: https://arxiv.org/pdf/2405.12981.pdf

[^5]: https://link.springer.com/10.1007/s11227-024-05890-8

[^6]: https://developers.redhat.com/articles/2025/07/24/how-pagedattention-resolves-memory-waste-llm-systems

[^7]: https://docs.vllm.ai/en/latest/features/quantization/quantized_kvcache/

[^8]: https://huggingface.co/docs/transformers/en/paged_attention

[^9]: https://arxiv.org/pdf/2410.03111.pdf

[^10]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md

[^11]: MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md

[^12]: CONTENT_QUALITY_STANDARD.md

[^13]: ARCHITECTURE_FREEZE.md

[^14]: AENS-Knowledge-Layer-Specification.md

[^15]: https://arxiv.org/pdf/2309.06180.pdf

[^16]: https://arxiv.org/pdf/2405.04437.pdf

[^17]: https://arxiv.org/pdf/2409.15012.pdf

[^18]: http://arxiv.org/pdf/2310.01801.pdf

[^19]: https://arxiv.org/html/2411.06680v1

[^20]: https://arxiv.org/pdf/2412.05496.pdf

[^21]: https://arxiv.org/pdf/2606.09864.pdf

[^22]: https://arxiv.org/html/2406.09297v2

[^23]: https://arxiv.org/pdf/2305.13245.pdf

[^24]: https://arxiv.org/html/2606.03458v1

[^25]: https://arxiv.org/pdf/2506.07311.pdf

[^26]: https://arxiv.org/pdf/2603.04427.pdf

[^27]: https://arxiv.org/html/2503.09579v3

[^28]: https://arxiv.org/abs/2603.05451

[^29]: https://dl.acm.org/doi/10.1145/3742872.3757072

[^30]: https://ieeexplore.ieee.org/document/11565905/

[^31]: https://ijaibdcms.org/index.php/ijaibdcms/article/view/598/

[^32]: https://arxiv.org/abs/2602.09721

[^33]: https://arxiv.org/abs/2604.02110

[^34]: https://arxiv.org/html/2405.04437v2

[^35]: https://arxiv.org/html/2603.05451v1

[^36]: https://yobitel.com/knowledge-base/paged-attention

[^37]: https://huggingface.co/datasets/attention-wiki/knowledge-base/commit/a4a1c762609282a09f0d96474442072a749bd7a0

[^38]: https://www.cs.toronto.edu/~cmaddis/courses/csc2541_w25/presentations/ng_tang_pagedattention.pdf

[^39]: https://llmsystem.github.io/llmsystem2025spring/assets/files/llmsys-22-vLLM_woosuk_kwon-1f34697dbb1a1fb5b798daf6eff14b67.pdf

[^40]: https://datasciencedojo.com/blog/understanding-paged-attention/

