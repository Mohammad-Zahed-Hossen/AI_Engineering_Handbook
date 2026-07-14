<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# flash-attention

## Description

FlashAttention is an exact attention algorithm and fused GPU kernel design that computes attention without materializing the full $N \times N$ score matrix in HBM, instead using tiled SRAM-resident blocks and online softmax to keep intermediate state on-chip. It addresses the dominant memory-bandwidth bottleneck of standard attention, where repeated HBM reads and writes of the quadratic score matrix make long-context training and inference slow and memory-heavy.[^6][^7]

## Concept

FlashAttention tiles $Q$, $K$, and $V$ into blocks that fit in SRAM/shared memory, fuses the $QK^T$, softmax, and $PV$ steps into one kernel, and computes softmax with running max and running normalization terms so the full attention matrix never needs to be stored in HBM. This preserves exact attention while reducing HBM traffic from quadratic-sized temporary movement to an $O(N \cdot d)$-style working footprint per head, which is the main reason it is effective for long-context transformers.[^7][^6]

The baseline attention path is dominated by quadratic temporary storage and HBM round-trips for the score matrix, so wall-clock time is often limited by bandwidth rather than math throughput. FlashAttention keeps the same $O(N^2)$ FLOPs, but the HBM footprint becomes linear in sequence length for the working set, and the SRAM bandwidth advantage is decisive because on-chip memory is orders of magnitude faster than HBM.[^6][^7]

A useful traffic model is proportional to batch size $\times$ heads $\times$ sequence length $\times$ head dimension $\times$ precision bytes, with block size determining how much of $Q/K/V$ can be streamed through shared memory at once. In practice, this means FlashAttention replaces the $N \times N$ score materialization cost with tiled load/store traffic, while the KV-cache layout in decoding must still be arranged so blocks can be read efficiently without excessive stride penalties.[^7][^6]

The hardware bottleneck shifts from HBM bandwidth to fused-kernel compute and SRAM capacity, which is exactly where roofline-style analysis predicts gains from higher arithmetic intensity. By reusing each loaded $Q/K/V$ tile for more FLOPs before eviction, FlashAttention saturates Tensor Cores more effectively and reduces idle cycles waiting on memory.[^6][^7]

Tile size is the main tuning knob: too small and kernel-launch overhead and bookkeeping dominate; too large and shared memory overflows or register pressure destroys occupancy. The best-performing kernels also integrate causal masking directly into tile logic, avoid explicit mask tensors, and handle dropout in backward by regenerating the same mask rather than storing it.[^7][^6]

## Applicability

Use FlashAttention when attention is the latency or memory bottleneck, especially for long-context transformer training and inference on modern NVIDIA GPUs with substantial shared memory. It is particularly valuable for autoregressive decoding with causal masking and for workloads where standard attention becomes bandwidth-bound before compute-bound.[^6][^7]

Avoid it for very short sequences where the fused-kernel overhead may outweigh the benefit, on CPU-only systems without equivalent shared-memory tiling, or on hardware that lacks the on-chip memory primitives the algorithm depends on. It is also a poor fit when you need the full attention matrix for analysis, visualization, or specialized post-processing that depends on explicit materialization.[^7][^6]

It composes well with KV-cache systems, especially paged or block-table layouts that keep decoded keys and values accessible in contiguous blocks. It also benefits from FP16/BF16 tensor-core execution, integrates with causal masking and RoPE/ALiBi-style position encodings, and can coexist with block-sparse or local attention variants when approximate structure is acceptable.[^6][^7]

## Decision Summary

**When to Use**

- Long-context attention dominates latency or memory use.[^7][^6]
- Training or inference runs on modern GPUs with shared-memory tiling support.[^6][^7]
- Autoregressive decoding uses causal masking and large KV caches.[^7][^6]
- HBM bandwidth is the limiting resource rather than raw FLOPs.[^6][^7]

**Don't Use**

- Sequences are short enough that fusion overhead outweighs the gains.[^7][^6]
- Execution target is CPU-only or lacks efficient shared-memory kernels.[^6][^7]
- The workflow requires explicit full attention matrices.[^7][^6]
- Hardware or compiler stack cannot sustain the required fused-kernel occupancy.[^6][^7]

**Tradeoff Summary**
HBM Traffic ↓, Throughput ↑, SRAM Pressure ↑, Kernel Complexity ↑[^7][^6]

## Pattern Snapshot

- **Primary Goal**: Attention Memory-Bandwidth Elimination and Throughput Maximization[^6][^7]
- **Primary Constraint**: SRAM Capacity and Block Size Tuning[^7][^6]
- **Typical Usage**: Long-Context Transformer Training and Inference on NVIDIA Ampere/Hopper GPUs[^6][^7]
- **Primary Bottleneck**: SRAM Compute Saturation / Shared Memory Bank Conflicts[^7][^6]
- **Scaling Dimension**: Sequence Length / Head Dimension[^6][^7]
- **Failure Mode**: SRAM Overflow from Excessive Block Size / Numerical Instability in Online Softmax / Causal Mask Tiling Edge Cases[^7][^6]


## Tradeoffs

| Dimension | Effect | Explanation |
| :-- | :-- | :-- |
| Memory | ↓ | The full $N \times N$ score matrix is not materialized in HBM, so temporary storage drops sharply [^7][^6]. |
| Compute | ↑ | The kernel performs more fused work and may recompute or serialize some softmax bookkeeping [^7][^6]. |
| Latency | ↓ / ↑ | End-to-end latency usually improves for long sequences, but can worsen on short sequences because kernel overhead becomes visible [^7][^6]. |
| Bandwidth | ↓ | HBM traffic drops because tiles are streamed through SRAM and reused before eviction [^7][^6]. |
| Complexity | ↑ | Correct tiling, masking, and online normalization require careful kernel design and numerical validation [^7][^6]. |

## Decision Flow

- **Step 1:** Is attention bandwidth-bound or memory-bound? If Yes -> use FlashAttention; If No -> a simpler attention path may be sufficient.[^6][^7]
- **Step 2:** Does the target GPU have enough shared memory/SRAM for efficient tiling? If Yes -> tune block size for occupancy; If No -> expect reduced benefit or kernel fallback.[^7][^6]
- **Step 3:** Do you need exact attention without full matrix materialization? If Yes -> FlashAttention fits; If No -> consider sparse, approximate, or analysis-oriented implementations.[^6][^7]


## System Interactions

- **Interacts With**: KV Cache / PagedAttention Block Tables
    - **Condition**: Autoregressive decoding with long-lived key/value history.
    - **Effect**: Block-table layouts can preserve efficient memory access, while poor layout increases stride cost and reduces the benefit of tiled kernels.[^7][^6]
- **Interacts With**: Tensor Cores / GPU MMA Units
    - **Condition**: Head dimension and tile sizes align with MMA-friendly shapes.
    - **Effect**: Occupancy and arithmetic intensity improve, making the kernel compute-efficient instead of memory-stalled.[^6][^7]
- **Interacts With**: Causal Masking / Autoregressive Attention
    - **Condition**: Upper-triangular masking is required.
    - **Effect**: Mask logic can be fused into tile skipping, avoiding explicit mask allocation and reducing HBM traffic.[^7][^6]
- **Interacts With**: Position Encoding / RoPE or ALiBi
    - **Condition**: Positional transforms are applied before or inside attention.
    - **Effect**: These encodings must be integrated without breaking tile locality or numerical equivalence.[^6][^7]
- **Interacts With**: Mixed Precision / FP16-BF16 Tensor Core
    - **Condition**: The attention path runs in reduced precision.
    - **Effect**: Throughput improves, but softmax stability and accumulation order need validation.[^7][^6]
- **Interacts With**: Distributed Training / Sequence Parallelism
    - **Condition**: Sequences exceed single-device practical limits.
    - **Effect**: Sequence-parallel variants can extend FlashAttention across devices, but communication overhead becomes a first-class concern.[^6][^7]
- **Interacts With**: CUDA Graphs / Kernel Launch Capture
    - **Condition**: The runtime captures static execution graphs.
    - **Effect**: Stable tile shapes and static launch parameters help; highly dynamic shapes can reduce graph-capture effectiveness.[^7][^6]


## Implementation Notes

Tile size should be chosen to fit the GPU’s shared-memory budget while keeping enough work per block to sustain occupancy; square tiles are common, but row/column tiling may fit irregular sequence lengths better. Head dimensions should align with warp-friendly and Tensor-Core-friendly boundaries, otherwise the kernel may fall back to less efficient SIMT execution.[^6][^7]

Memory layout matters: contiguous $Q/K/V$ layouts are preferred because non-standard strides increase load inefficiency and can negate some SRAM reuse gains. Interleaved or split-head layouts can work, but only if the kernel’s access pattern still coalesces well enough to keep tile loads efficient.[^7][^6]

Online softmax must track a running maximum and rescaled exponential sum so each tile contributes exactly to the final normalized result without storing intermediate scores. The correction term must be numerically stable in FP16/BF16 settings, and FP32 accumulator buffers are often used for the softmax state to avoid drift across long sequences.[^6][^7]

Causal masking should be fused as tile-level skipping rather than explicit triangular tensor creation, especially for non-power-of-two lengths and batched variable-length inference. Backward kernels often recompute attention weights rather than store them, and dropout masks must be regenerated consistently to preserve gradient correctness.[^7][^6]

For very long contexts, head-parallelism across warps and sequence-parallel ring attention are the main scaling extensions, but they add communication cost and scheduling complexity. Tensor-parallel all-gather boundaries should be placed so they do not break the fused attention pipeline or force unnecessary synchronization.[^6][^7]

Common failures include block sizes that exceed SRAM capacity, incorrect online-softmax accumulation, causal-mask boundary errors on irregular lengths, head-dimension mismatches that trigger slower paths, and dropout-mask mismatch in backward. These are correctness and performance failures, not just optimization issues, because they can silently degrade results or crash kernels.[^7][^6]

## Examples

```python
def flash_attention_forward(Q, K, V, causal=False):
    N = len(Q)
    d = len(Q[^0])
    B = choose_block_size(N, d)
    O = zeros(N, d)

    for i0 in range(0, N, B):
        i1 = min(i0 + B, N)
        Qi = load_tile(Q, i0, i1)

        m = fill(-inf, i1 - i0)
        l = zeros(i1 - i0)
        acc = zeros(i1 - i0, d)

        for j0 in range(0, N, B):
            j1 = min(j0 + B, N)
            if causal and j0 > i1 - 1:
                continue

            Kj = load_tile(K, j0, j1)
            Vj = load_tile(V, j0, j1)

            S = Qi @ transpose(Kj)
            if causal:
                S = apply_causal_mask(S, i0, i1, j0, j1)

            m_new = rowwise_max(m, rowwise_max(S))
            exp_scale = exp(m - m_new)
            P = exp(S - m_new)
            l_new = l * exp_scale + rowwise_sum(P)
            acc = acc * expand(exp_scale, d) + P @ Vj

            m = m_new
            l = l_new

        O[i0:i1] = acc / expand(l, d)

    return O
```


## Variations

### Variation 1: FlashAttention-2 (Algorithmic Optimizations)

- **Description**: Improves work partitioning across warps and thread blocks, reduces non-matmul overhead, and increases parallelism over the sequence dimension.[^6][^7]
- **Use When**: Maximum throughput is needed on A100/H100-class GPUs and the first-generation kernel leaves Tensor Cores underutilized.[^7][^6]
- **Benefit**: Higher occupancy and lower softmax serialization can materially improve speed, especially at larger head dimensions.[^6][^7]
- **Tradeoff**: Custom-kernel complexity rises, and reordering can slightly change numerical behavior.[^7][^6]


### Variation 2: FlashAttention with Variable-Length Sequences

- **Description**: Uses cumulative sequence lengths and block tables so ragged batches can be processed without padding overhead.[^6][^7]
- **Use When**: Serving or training batches contain highly variable sequence lengths and padding waste would otherwise be large.[^7][^6]
- **Benefit**: Avoids wasted compute on padded tokens and improves batching efficiency.[^6][^7]
- **Tradeoff**: Load balancing becomes harder and launch configuration becomes batch-dependent.[^7][^6]


### Variation 3: Ring Attention / Sequence-Parallel FlashAttention

- **Description**: Distributes KV blocks across devices in a ring so attention can scale beyond a single device’s memory limits.[^6][^7]
- **Use When**: Contexts are so long that even $O(N)$ working footprints are too large for one GPU.[^7][^6]
- **Benefit**: Maintains exact attention while extending capacity across a cluster.[^6][^7]
- **Tradeoff**: Communication overhead and scheduling complexity increase substantially.[^7][^6]


## Anti-Patterns

- **Wrong**: Using FlashAttention for very short sequences just because it is “faster.”
    - **Impact**: Kernel-launch and fusion overhead can erase the gain and may make throughput worse.[^6][^7]
    - **Fix**: Use a simpler attention path when sequence length is too small to amortize the fused kernel.[^7][^6]
- **Wrong**: Choosing a block size that does not fit shared memory comfortably.
    - **Impact**: The kernel may overflow SRAM, lose occupancy, or fail to launch efficiently.[^6][^7]
    - **Fix**: Tune block size to architecture-specific shared-memory limits and head dimension.[^7][^6]
- **Wrong**: Ignoring layout constraints for $Q/K/V$ and KV cache.
    - **Impact**: Non-contiguous strides can destroy coalescing and reduce the bandwidth savings that FlashAttention depends on.[^6][^7]
    - **Fix**: Keep attention tensors contiguous or use layouts specifically designed for the fused kernel.[^7][^6]
- **Wrong**: Materializing masks or attention scores inside the kernel path.
    - **Impact**: This reintroduces the HBM traffic FlashAttention is designed to eliminate.[^6][^7]
    - **Fix**: Fuse masking and online normalization into the tile loop.[^7][^6]
- **Wrong**: Regenerating dropout or softmax state inconsistently in backward.
    - **Impact**: Gradient mismatch can appear even when the forward pass seems correct.[^6][^7]
    - **Fix**: Make backward recomputation deterministic and preserve the necessary random state.[^7][^6]
<span style="display:none">[^1][^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^2][^20][^21][^22][^3][^4][^5][^8][^9]</span>

<div align="center">⁂</div>

[^1]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md

[^2]: MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md

[^3]: AENS-Knowledge-Layer-Specification.md

[^4]: CONTENT_QUALITY_STANDARD.md

[^5]: https://openreview.net/pdf?id=Zihqr7qqpg

[^6]: https://www.21medien.de/en/library/gradient-checkpointing

[^7]: https://www.vldb.org/pvldb/vol18/p1551-guan.pdf

[^8]: https://www.machinelearningatscale.com/blog/production-ml-antipatterns/

[^9]: https://arxiv.org/html/2607.08511v1

[^10]: https://troisinh.com/docs/ai-tech-decoded/level-0/training-at-scale/gradient-checkpointing

[^11]: https://lyceum.technology/magazine/gradient-checkpointing-memory-savings/

[^12]: https://mcpanalytics.ai/articles/early-stopping-practical-guide-for-data-driven-decisions

[^13]: https://buildai.substack.com/p/activation-recomputation-strategies

[^14]: https://medium.com/@aiyuswa/gradient-checkpointing-part-1-4c63cfd27423

[^15]: https://www.irjiet.com/common_src/article_file/1728369746_469e25fc18_8_irjiet.pdf

[^16]: https://www.tandfonline.com/doi/full/10.1080/00207543.2025.2479831

[^17]: http://biorxiv.org/lookup/doi/10.1101/2025.09.26.676459

[^18]: https://www.semanticscholar.org/paper/0d570bc0b7dce00440bba2f7f9240314f4eb47a5

[^19]: https://www.grid.uns.ac.rs/symposium/download/2024/91.pdf

[^20]: https://asmedigitalcollection.asme.org/MSEC/proceedings/MSEC2025/89022/V002T20A001/1223023

[^21]: https://ieeexplore.ieee.org/document/11542389/

[^22]: https://iopscience.iop.org/article/10.1088/2631-8695/add9e7

