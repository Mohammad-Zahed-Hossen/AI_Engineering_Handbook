<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# prompt-caching

## Description

Prompt Caching is an inference optimization pattern that reuses precomputed prefix state so repeated prompt prefixes do not pay the full prefill cost on every request. It directly reduces Time-To-First-Token latency by avoiding redundant computation for shared system prompts, repeated context documents, and other common prefixes in multi-turn and batched LLM serving.[^8][^10][^21]

## Concept

The core mechanism is to cache the key-value tensors produced during prefill for a prompt prefix, then reuse that cached prefix state when a later request shares the same leading tokens. On a cache hit, the engine skips recomputing the shared prefix and appends only the new tokens, so the model processes only the delta instead of the entire prompt.[^10][^21][^8]

For a full request with prompt length $N$, prefill attention still has quadratic dependence in the amount of attention work, while cache hits reduce the incremental work to the new-token suffix length $M$ plus lookup overhead for the reused prefix state. In practice, this shifts serving cost from repeated compute over identical prefixes to mostly retrieval and incremental decode, which is especially valuable when many requests share system prompts, templates, or retrieved documents.[^21][^8][^10]

A useful sizing model is the cached prefix footprint per layer and head:

$$
\text{cache\_bytes} \approx \text{layers} \times \text{batch\_size} \times \text{heads} \times \text{prefix\_length} \times \text{head\_dimension} \times 2 \times \text{precision\_bytes}
$$

This grows linearly with prefix length but multiplicatively with layer count, head count, and precision choice, so long shared prefixes can quickly consume HBM even when they save latency.[^8][^10][^21]

The hardware bottleneck shifts from repeated prefill compute to a mix of cached-state memory bandwidth and incremental-token compute, which roofline analysis predicts as a better trade if the reuse rate is high. The arithmetic intensity of the prefix portion drops because the engine reads already-computed KV state instead of regenerating it, while total request throughput rises because batch capacity is no longer wasted recomputing the same tokens.[^10][^21][^8]

Cache management is a first-class systems problem: engines need exact or partial prefix matching, reference counting for in-flight requests, and eviction policies such as LRU or LFU to prevent prefix storage from crowding out active batches. The closest engineering analogy is virtual memory paging, where cached prefix blocks are addressable units and the block table decides whether a request can reuse a physical prefix segment or must materialize a new one.[^8][^10]

## Applicability

Use Prompt Caching when many requests share an identical or highly overlapping prefix, such as system prompts, few-shot templates, fixed RAG context documents, or repeated API instruction blocks. It is especially effective in multi-turn chat serving and batched inference because the same prefix often appears across many sessions, making TTFT savings compound at scale.[^10][^8]

Avoid it when prompts are almost always unique, when prefixes are so short that lookup overhead dominates, or when GPU memory is tight enough that prefix storage reduces usable batch capacity. It is also a weak fit for single-shot inference flows with no repetition, because the cache hit rate will be too low to amortize the memory and bookkeeping cost.[^8][^10]

Prompt Caching composes naturally with KV Cache, PagedAttention, continuous batching, quantized KV storage, and speculative decoding. KV Cache provides per-request token state, PagedAttention-style block tables improve physical sharing and fragmentation control, continuous batching increases reuse opportunities, quantization lowers prefix footprint, and speculative decoding reduces the remaining decode cost after the cached prefix.[^10][^8]

## Decision Summary

**When to Use**

- Multi-turn LLM serving repeats the same system prompt or instruction prefix across sessions.[^8][^10]
- Batched inference includes many requests with a shared document or template prefix.[^10][^8]
- RAG pipelines repeatedly prepend the same retrieved context or policy text.[^8][^10]
- TTFT is dominated by repeated prefill work rather than decode time.[^10][^8]

**Don't Use**

- Most prompts are unique and prefix reuse is rare.[^8][^10]
- Prefixes are too short to justify cache lookup and retention overhead.[^10][^8]
- HBM is so constrained that caching prefixes would reduce batch capacity too much.[^8][^10]
- The serving flow is single-shot with no meaningful prefix repetition.[^10][^8]

**Tradeoff Summary**
TTFT ↓, Memory Overhead ↑, System Complexity ↑, Cache Hit Rate Dependency ↑[^8][^10]

## Pattern Snapshot

- **Primary Goal**: Time-To-First-Token Reduction for Shared Prefixes.[^10][^8]
- **Primary Constraint**: Prefix Cache Capacity Bound.[^8][^10]
- **Typical Usage**: Multi-Turn LLM API Serving and Shared-Context Batched Inference.[^10][^8]
- **Primary Bottleneck**: HBM Bandwidth for Prefix KV Retrieval.[^8][^10]
- **Scaling Dimension**: Prefix Length / Cache Hit Rate.[^10][^8]
- **Failure Mode**: Cache Miss Storm / Prefix Storage Exhaustion.[^8][^10]


## Tradeoffs

| Dimension | Effect | Explanation |
| :-- | :-- | :-- |
| Memory | ↑ | Shared prefixes must be retained as cached KV state, which grows with prefix length, layers, and heads [^8][^10]. |
| Compute | ↓ | Repeated prefill computation is eliminated on cache hits, so only new tokens need processing [^8][^10]. |
| Latency | ↓ | TTFT improves because the system skips redundant prefix work and starts decoding sooner [^8][^10]. |
| Bandwidth | ↑ / ↓ | Prefix retrieval adds read traffic, but total HBM traffic falls because prefix recomputation is avoided [^8][^10]. |
| Complexity | ↑ | Cache indexing, eviction, reference counting, and partial-prefix handling increase system complexity [^8][^10]. |

## Decision Flow

- **Step 1:** Do many requests share the same leading tokens? If Yes -> enable prefix caching; If No -> use a simpler serving path.[^10][^8]
- **Step 2:** Is TTFT dominated by prefill rather than decode? If Yes -> prioritize shared-prefix reuse; If No -> optimize other bottlenecks first.[^8][^10]
- **Step 3:** Can the HBM budget hold the expected prefix working set? If Yes -> keep hot prefixes resident; If No -> add eviction, quantization, or tiered storage.[^10][^8]


## System Interactions

- **Interacts With**: KV Cache / Attention State Store
    - **Condition**: Multiple requests reuse the same prefix state.
    - **Effect**: Prefix KV tensors can be shared instead of duplicated, reducing prefill cost and improving TTFT.[^8][^10]
- **Interacts With**: PagedAttention / Block-Table Memory Manager
    - **Condition**: Prefixes are stored in fixed-size blocks rather than monolithic buffers.
    - **Effect**: Sharing and eviction become copy-on-write friendly, but block-table management overhead increases.[^10][^8]
- **Interacts With**: Continuous Batching / Dynamic Request Scheduler
    - **Condition**: The server mixes new and cached requests in the same batch.
    - **Effect**: Higher reuse rate and better GPU utilization, but scheduling must respect cache residency and request ordering.[^8][^10]
- **Interacts With**: Tensor Parallelism / Distributed Inference
    - **Condition**: Prefix state is sharded across ranks.
    - **Effect**: Cache hits require synchronized shard availability, otherwise reuse becomes incomplete or inconsistent.[^10][^8]
- **Interacts With**: Speculative Decoding / Draft Model
    - **Condition**: Prefix is reused and only later tokens need acceleration.
    - **Effect**: Prompt caching reduces prefill cost while speculative decoding reduces remaining decode latency, giving multiplicative serving gains.[^8][^10]
- **Interacts With**: Memory Allocator / CUDA Graphs
    - **Condition**: Prefix cache entries are created and evicted frequently.
    - **Effect**: Fragmentation and allocation churn can reduce throughput unless allocation is pooled and graph shapes remain stable.[^10][^8]
- **Interacts With**: Request Router / Load Balancer
    - **Condition**: Requests with identical prefixes arrive on different workers.
    - **Effect**: Hit rate drops unless routing is prefix-aware or cache state is replicated across workers.[^8][^10]


## Implementation Notes

Prefer pre-allocated prefix cache pools when reuse patterns are stable, and dynamic allocation when prefix popularity changes rapidly or workload mix is unpredictable. Reference counting is required for shared prefixes across concurrent requests so eviction cannot free a block still used by in-flight inference.[^10][^8]

Store prefix KV state contiguously when possible, but block-interleaved layouts are often better for PagedAttention-style sharing because they reduce copy cost and support partial reuse. Head-contiguous layouts can simplify vectorized access, while layer-contiguous layouts can improve locality for per-layer reuse; fragmentation rises when prefixes vary widely in length.[^8][^10]

Prefix lookup can use trie-based exact matching for deterministic prefix reuse, radix trees for common subsequences, or hash-based block IDs for sub-prefix sharing. During generation, the engine must map tokens to blocks dynamically and reconstruct the attention mask so cached tokens and new tokens attend correctly without accidental leakage across partial matches.[^10][^8]

Eviction policy should combine LRU or LFU with TTL-based expiry when prompts age out naturally, plus watermark-based emergency eviction when memory pressure spikes. In-flight reference counts are non-negotiable because race conditions between eviction and access can cause use-after-free bugs or silent correctness failures.[^8][^10]

For long prefixes, quantized prefix caches such as FP8, INT8, or INT4 can expand capacity, but retrieval then needs dequantization and can slightly affect accuracy. In distributed inference, tensor-parallel ranks should populate identical prefix shards, and pipeline-parallel stages need explicit handoff of prefix state so cache hits remain consistent end-to-end.[^10][^8]

Common failures include reference-count leaks, prefix-hash collisions, eviction races, wrong position IDs after cache hits, and incorrect masking for partial-prefix matches. These bugs are often hard to detect because they may improve latency while silently degrading answer quality or corrupting attention semantics.[^8][^10]

## Examples

```python
def infer_with_prompt_cache(request_tokens, cache):
    prefix_len = longest_cached_prefix(request_tokens, cache)
    prefix_state = cache.get(request_tokens[:prefix_len])

    if prefix_state is None:
        prefix_len = 0
        prefix_state = empty_state()

    shared_tokens = request_tokens[:prefix_len]
    new_tokens = request_tokens[prefix_len:]

    state = prefix_state
    if prefix_len == 0:
        state = prefill(shared_tokens, state)

    for t in new_tokens:
        state = append_token_state(state, t)
        state = update_kv_cache(state, t)

    logits = decode_next(state)
    cache.insert(request_tokens, state)
    return logits
```


## Variations

### Variation 1: Exact Prefix Matching (Trie-Based Cache)

- **Description**: A trie over token IDs stores cached KV state at nodes so exact shared prefixes can be retrieved in deterministic time.[^10][^8]
- **Use When**: Prompts are highly templated and exact prefix reuse is common.[^8][^10]
- **Benefit**: Zero false positives and straightforward reference counting per node.[^10][^8]
- **Tradeoff**: No benefit for near-matches, and trie metadata adds pointer overhead.[^8][^10]


### Variation 2: Block-Level Prefix Sharing (RadixAttention / PagedAttention-Style)

- **Description**: Physical KV blocks are shared through a radix tree or block hash table so overlapping prefixes can reuse sub-prompt segments.[^10][^8]
- **Use When**: Many concurrent sessions share partial prefixes or branch from the same conversation.[^8][^10]
- **Benefit**: Avoids physical duplication and supports copy-on-write sharing at block granularity.[^10][^8]
- **Tradeoff**: Block-table lookups and memory management become more complex, and granularity choices affect fragmentation.[^8][^10]


### Variation 3: Hierarchical Multi-Tier Prefix Cache (L1 SRAM / L2 HBM / L3 Host)

- **Description**: Hot prefixes live in the fastest tier, warm prefixes in HBM, and cold prefixes in host memory or disk with promotion and demotion logic.[^10][^8]
- **Use When**: Prefix working sets exceed GPU memory or fleet-level reuse is very uneven.[^8][^10]
- **Benefit**: Extends cacheable capacity far beyond a single GPU and keeps hot items near compute.[^10][^8]
- **Tradeoff**: Tier promotion can saturate PCIe bandwidth and add large miss latency.[^8][^10]


## Anti-Patterns

- **Wrong**: Caching every prompt prefix without measuring reuse.
    - **Impact**: Memory fills with cold entries, reducing batch capacity and increasing eviction churn.[^10][^8]
    - **Fix**: Cache only prefixes with sufficient hit rate and add TTL or popularity thresholds.[^8][^10]
- **Wrong**: Treating partial prefix overlap as if it were exact reuse.
    - **Impact**: Attention masks and position IDs can become incorrect, producing wrong outputs.[^10][^8]
    - **Fix**: Require exact block identity or verify overlap semantics before reuse.[^8][^10]
- **Wrong**: Ignoring reference counting for shared KV blocks.
    - **Impact**: Eviction can free memory still in use by active requests, causing crashes or silent corruption.[^10][^8]
    - **Fix**: Tie every cached block to lifecycle-managed ownership and only evict when counts reach zero.[^8][^10]
- **Wrong**: Using a cache layout that fragments badly under variable-length prefixes.
    - **Impact**: Memory waste rises and lookup overhead can erase latency gains.[^10][^8]
    - **Fix**: Use block-based layouts, coalescing policies, and compaction-aware allocators.[^8][^10]
- **Wrong**: Over-quantizing prefix cache state without validating quality.
    - **Impact**: Retrieval becomes cheaper but attention accuracy may drift, especially for long prefixes.[^10][^8]
    - **Fix**: Validate FP8/INT8/INT4 compression on target workloads and keep critical tiers at higher precision.[^8][^10]
<span style="display:none">[^1][^11][^12][^13][^14][^15][^16][^17][^18][^19][^2][^20][^22][^3][^4][^5][^6][^7][^9]</span>

<div align="center">⁂</div>

[^1]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md

[^2]: MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md

[^3]: AENS-Knowledge-Layer-Specification.md

[^4]: CONTENT_QUALITY_STANDARD.md

[^5]: https://journalcenter.org/index.php/jupumi/article/view/7320

[^6]: http://jurnal.umsu.ac.id/index.php/LIAB/article/view/6782

[^7]: https://advanced.onlinelibrary.wiley.com/doi/10.1002/adpr.202200091

[^8]: https://arxiv.org/abs/2409.15097

[^9]: https://link.springer.com/10.1007/s00396-025-05546-w

[^10]: https://arxiv.org/abs/2306.01160

[^11]: http://www.proceedings.com/075280-2613.html

[^12]: https://www.tandfonline.com/doi/full/10.1080/14790726.2025.2490240

[^13]: https://arxiv.org/pdf/1808.00079v5.pdf

[^14]: https://www.reddit.com/r/deeplearning/comments/1aukmkp/reduce_5060_memory_usage_while_training_neural/

[^15]: https://www.linkedin.com/posts/harsha-nandihalli-672b43241_machinelearning-pytorch-llmfinetuning-activity-7445973874607009792-2ED1

[^16]: https://www.getmonetizely.com/articles/the-ai-gradient-checkpointing-premium-memory-efficiency-vs-training-speed

[^17]: https://lyceum.technology/magazine/gradient-checkpointing-memory-savings/

[^18]: https://github.com/cybertronai/gradient-checkpointing

[^19]: https://arxiv.org/html/2406.02290v1

[^20]: https://arxiv.org/html/2412.11810v1

[^21]: https://arxiv.org/abs/2205.14135

[^22]: https://github.com/Dao-AILab/flash-attention

