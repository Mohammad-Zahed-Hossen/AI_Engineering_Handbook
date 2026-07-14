<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# mixed-precision-training

## Description

Mixed Precision Training (AMP) is a training pattern that uses reduced-precision arithmetic for most forward and backward computation while keeping selected values, such as master weights or accumulators, in FP32 to preserve numerical stability. It addresses the gap between high Tensor Core throughput and the lower utilization of full FP32 execution, making large-scale training faster, more memory-efficient, and more scalable on modern accelerators.[^1][^2][^3][^4]

## Concept

AMP is fundamentally a **precision partitioning** strategy: forward and backward passes run largely in FP16 or BF16, while sensitive values are retained in FP32, typically including a master copy of weights and optimizer state updates. Classic mixed-precision training uses loss scaling to prevent FP16 gradient underflow, and BF16 reduces that burden by preserving FP32-like exponent range while sacrificing mantissa bits.[^2][^5][^1]

In complexity terms, AMP does not change the asymptotic algorithmic structure of training, but it changes the effective hardware cost per step by increasing throughput on Tensor Cores and reducing memory traffic. On Tensor Core hardware, mixed-precision matrix multiply-accumulate can deliver multiple-fold higher peak throughput than FP32 execution, with published NVIDIA architectures exposing large FP16/BF16 Tensor Core speedups relative to standard floating-point paths.[^6][^3][^4][^2]

A practical memory model for AMP is approximately: $M \approx P_{fp32} + P_{mp} + O_{opt} + A$, where $P_{fp32}$ is master weights, $P_{mp}$ is reduced-precision model copies, $O_{opt}$ is optimizer state, and $A$ is activation memory. Relative to FP32 training, AMP typically reduces activation storage by about 2x when activations are stored in half precision, but the exact savings depend on checkpointing, optimizer choice, and whether the implementation retains FP32 optimizer state and master weights.[^1][^2]

From a Roofline perspective, AMP increases arithmetic intensity by halving data size for many tensor operands while keeping the same mathematical work, which shifts training toward Tensor Core compute saturation rather than memory-bandwidth limitation. This is why AMP is often a performance enabler on modern GPUs: the same step can deliver more useful FLOPs per byte transferred, especially for GEMM-heavy workloads.[^7][^3][^4]

Numerically, FP16 is vulnerable to underflow and overflow because of its limited exponent range, which is why loss scaling is used to shift gradients into a representable range before backpropagation and then unscale before the optimizer step. BF16 largely avoids this failure mode because it preserves the 8-bit exponent range of FP32, while FP8 pushes the same logic further and requires more aggressive scaling and calibration.[^5][^8][^2][^1]

## Applicability

Use AMP when the model is large enough that memory bandwidth, activation storage, and Tensor Core utilization are central constraints, especially on NVIDIA Volta/Ampere/Hopper-class hardware and comparable accelerator platforms. It is especially valuable when throughput matters more than exact numerical equivalence to FP32 and the training stack can tolerate reduced-precision execution with scaling and monitoring.[^3][^4][^2][^6][^1]

Avoid AMP for very small models where kernel launch overhead and non-matrix operations dominate, or for numerically fragile workloads with large reductions, unstable softmax behavior, or custom ops that have not been validated in reduced precision. It is also a poor fit when strict cross-hardware reproducibility is a hard requirement, because mixed-precision matrix multiply behavior can differ across GPU generations and numerical pathways.[^9][^10][^5][^1]

AMP interacts strongly with gradient accumulation, checkpointing, DDP/FSDP, and optimizer state compression because each of these changes the memory and communication balance of training. In practice, AMP is usually one part of a broader systems strategy rather than a standalone optimization.[^11][^12]

## Decision Summary

**When to Use**

- Training runs are memory-bound or bandwidth-limited on Tensor Core GPUs.[^4][^3]
- Model size or batch size is constrained by VRAM rather than pure compute.[^2][^11]
- Throughput and time-to-train are more important than exact FP32 parity.[^1][^2]
- The architecture has been validated to remain stable under FP16 or BF16 execution.[^5][^1]

**Don't Use**

- The model is too small for reduced precision to amortize overhead.[^11]
- The workload contains unstable reductions or unvalidated custom numeric kernels.[^5][^1]
- The deployment target lacks Tensor Core or comparable low-precision acceleration.[^3][^4]
- Bitwise reproducibility across hardware generations is required.[^10][^9]

**Tradeoff Summary**
Throughput ↑, Memory ↓, Numerical Risk ↑, System Complexity ↑[^2][^11][^1]

## Pattern Snapshot

- **Primary Goal**: Training Throughput Maximization[^4][^2]
- **Primary Constraint**: Tensor Core Availability and Numerical Stability[^3][^1]
- **Typical Usage**: Large Neural Network Training on NVIDIA Ampere/Hopper GPUs[^6][^4]
- **Primary Bottleneck**: Tensor Core Compute Saturation[^7][^4]
- **Scaling Dimension**: Batch Size / Model Width[^11][^2]
- **Failure Mode**: Gradient Underflow / Loss Scaling Divergence[^1][^5]


## Tradeoffs

| Dimension | Effect | Explanation |
| :-- | :-- | :-- |
| Memory | ↓ | Reduced-precision activations and tensor intermediates lower memory pressure, though FP32 master weights and optimizer state still consume space [^2][^1]. |
| Compute | ↑ | Tensor Cores execute matrix operations at much higher throughput than FP32 paths, increasing effective training speed [^3][^4]. |
| Latency | ↓ | Faster step execution reduces wall-clock time per iteration when the workload is GEMM-dominated [^2][^4]. |
| Bandwidth | ↓ | Half-precision data transfers cut bytes moved for many operands and improve effective arithmetic intensity [^4][^7]. |
| Complexity | ↑ | Requires loss scaling, precision policy management, and careful handling of numerically sensitive ops [^1][^5]. |

## Decision Flow

- **Step 1:** Is the target hardware Tensor Core-capable and is training dominated by matrix-heavy operations? If Yes -> enable AMP; If No -> stay in FP32 or use a hardware-specific alternative.[^4][^3]
- **Step 2:** Do gradients or activations show underflow/overflow risk in reduced precision? If Yes -> use BF16 or dynamic loss scaling; If No -> keep the simpler precision policy.[^5][^1]
- **Step 3:** Is VRAM or step time still the bottleneck after AMP? If Yes -> combine with checkpointing, accumulation, or sharding; If No -> avoid adding extra complexity.[^12][^11]


## System Interactions

- **Interacts With**: Gradient Scaler / Loss Scaling Engine
    - **Condition**: FP16 training with small gradients or deep networks.
    - **Effect**: Prevents gradient underflow and stabilizes optimization; bad scale choice can cause inf/nan divergence.[^1][^5]
- **Interacts With**: Distributed Data Parallel / All-Reduce Communication
    - **Condition**: Multi-GPU training with large gradient buckets.
    - **Effect**: Communication may remain FP16 or be upcast for stability; overlap with compute becomes critical to preserve throughput.[^12][^11]
- **Interacts With**: Tensor Core / GPU MMA Units
    - **Condition**: GEMM- and convolution-heavy workloads on supported hardware.
    - **Effect**: AMP routes work to high-throughput mixed-precision matrix units, improving utilization and lowering time per step.[^6][^3][^4]
- **Interacts With**: Activation Checkpointing / Memory Trade-off Engine
    - **Condition**: Training very large models where activations dominate memory.
    - **Effect**: AMP reduces precision-related memory, while checkpointing reduces stored activations; combined, they enable larger batches or longer sequences.[^11]
- **Interacts With**: 8-bit Optimizer / Low-Precision State
    - **Condition**: Optimizer state dominates memory after AMP.
    - **Effect**: Further reduces memory pressure, but can compound numeric and implementation risk.[^13][^11]
- **Interacts With**: CUDA Graphs / Kernel Launch Optimization
    - **Condition**: Repeated fixed-shape training loops.
    - **Effect**: Lowers launch overhead and helps preserve the gains from mixed precision on small or medium batches.[^11]
- **Interacts With**: FSDP / Sharded Data Parallel
    - **Condition**: Model or optimizer state exceeds single-GPU VRAM.
    - **Effect**: Sharding amplifies the memory benefit of AMP but adds precision coordination and communication complexity.[^12]


## Implementation Notes

Maintain FP32 master weights for standard AMP unless the architecture has been explicitly validated for pure half-precision or BF16-only training, because the master copy protects update fidelity. The memory overhead equation is typically dominated by model weights, optimizer state, and activations, so precision reductions in activations and selected intermediates must be evaluated against the persistent FP32 state cost.[^2][^1][^11]

Tensor Core efficiency depends on shape alignment, so dimensions should usually be padded to multiples of 8 or 16 for FP16/BF16 paths to preserve MMA efficiency and avoid fallback kernels. Non-contiguous layouts, irregular slices, or poor bucket packing can silently erode the performance gains that AMP is supposed to unlock.[^12][^3][^4]

Loss scaling should be applied before backpropagation and removed before gradient clipping or optimizer updates; dynamic scaling is usually safer than static scaling because it can adapt to changing activation and gradient magnitudes over training. When gradient accumulation is used, scaling and unscaling must be consistent across accumulation steps so that overflow detection and clipping are not applied to partially scaled states.[^5][^1]

When switching from FP32 to AMP, re-check learning-rate schedules, gradient clipping thresholds, and warmup behavior because the effective numeric noise profile changes even if the architecture is unchanged. Distributed systems need special attention: gradient reduction precision, bucket sizing, and compute-communication overlap can all erase performance if mixed precision causes smaller buckets or extra casting.[^12][^1][^11]

FP16 is usually the highest-risk but highest-throughput choice; BF16 trades a bit of mantissa precision for much better range and is therefore safer on supported hardware; FP8 can push throughput further but requires explicit scaling policies and tighter validation. Common implementation bugs include master-weight desynchronization, inf/nan propagation in optimizer state, underflow in attention and normalization layers, and padding mistakes that break Tensor Core alignment.[^8][^9][^10][^1][^5]

## Examples

```python
def mixed_precision_train_step(batch, model, optimizer, scaler, precision_policy, accum_state):
    loss_scale = scaler.current_scale()
    outputs = model.forward(batch.inputs, precision_policy)
    loss = compute_loss(outputs, batch.targets)

    scaled_loss = loss * loss_scale
    scaled_grads = model.backward(scaled_loss)

    if accum_state.enabled:
        accum_state.add(scaled_grads)
        if not accum_state.ready():
            return {"loss": loss, "updated": False}

        grads = accum_state.value()
        accum_state.reset()
    else:
        grads = scaled_grads

    grads = grads / loss_scale
    grads = clip_gradients(grads, batch.clip_threshold)

    if has_inf_or_nan(grads):
        scaler.backoff()
        optimizer.zero_grad()
        return {"loss": loss, "updated": False}

    optimizer.apply_gradients(grads, precision_policy.master_weights)
    precision_policy.master_weights = sync_master_weights(precision_policy.master_weights)
    scaler.update(grads)
    optimizer.zero_grad()

    return {"loss": loss, "updated": True}
```


## Variations

### Variation 1: BF16 Mixed Precision (Brain Floating Point)

- **Description**: BF16 keeps FP32-like exponent range while reducing mantissa precision, which greatly reduces underflow risk and often removes the need for loss scaling.[^5]
- **Use When**: Training large transformers where gradient underflow is a primary risk and Ampere+ hardware is available.[^4][^5]
- **Benefit**: Removes loss scaling complexity; wider exponent range prevents underflow; often matches FP32 convergence.[^5]
- **Tradeoff**: Lower mantissa precision can increase rounding error in accumulation-heavy layers; requires supported hardware.[^4][^5]


### Variation 2: FP8 Mixed Precision (H100/ Hopper Native)

- **Description**: FP8 training uses per-tensor or per-block scaling for E4M3/E5M2 formats and relies on hardware-native FP8 Tensor Core paths.[^14][^8]
- **Use When**: Maximum throughput is required on Hopper-generation hardware and the model is validated for FP8 stability.[^8][^14]
- **Benefit**: Doubles Tensor Core throughput again over FP16/BF16 and reduces HBM traffic and activation footprint.[^14][^8]
- **Tradeoff**: Narrow dynamic range requires aggressive scaling and calibration; accuracy risk and hardware dependence are high.[^8][^14]


### Variation 3: Pure FP16 / Full Half-Precision Training (No Master Weights)

- **Description**: Train with weights, activations, gradients, and optimizer states all stored in FP16, eliminating the FP32 master copy overhead.[^2][^1]
- **Use When**: VRAM is the absolute hard constraint and the model is empirically stable in pure FP16.[^1][^2]
- **Benefit**: Maximum memory reduction and potentially the largest batch size on limited hardware.[^2]
- **Tradeoff**: High underflow risk, optimizer precision loss, and a strong need for numerical auditing.[^1][^5]


## Anti-Patterns

- **Wrong**: Applying AMP without validating unstable layers such as softmax-heavy attention blocks or large reductions.[^1][^5]
    - **Impact**: Can trigger silent accuracy loss, underflow, or inf/nan cascades.[^1]
    - **Fix**: Keep sensitive ops in higher precision or switch to BF16 where supported.[^5]
- **Wrong**: Skipping loss scaling in FP16 training because the model “seems to work” on small batches.[^2][^1]
    - **Impact**: Gradients can underflow as scale increases or training evolves, causing late-stage divergence.[^5][^1]
    - **Fix**: Use dynamic loss scaling or BF16 if available.[^1][^5]
- **Wrong**: Clipping gradients before unscaling them.[^1]
    - **Impact**: Clipping operates on distorted magnitudes and can severely alter optimizer behavior.[^1]
    - **Fix**: Unscale first, then clip, then apply the optimizer step.[^1]
- **Wrong**: Ignoring alignment and layout constraints when packing tensors for Tensor Cores.[^3][^4]
    - **Impact**: Falls back to less efficient kernels and loses the main performance benefit of AMP.[^3][^4]
    - **Fix**: Pad and layout tensors to preserve MMA-friendly shapes and contiguity.[^3][^4]
- **Wrong**: Treating all optimizers and communication paths as precision-agnostic.[^11][^12]
    - **Impact**: Master weights, optimizer state, and all-reduce precision mismatches can destabilize training or negate speedups.[^12][^11]
    - **Fix**: Define explicit precision policies for gradients, optimizer states, and distributed reductions.[^11][^12]
<span style="display:none">[^15][^16][^17][^18][^19][^20][^21][^22][^23][^24][^25][^26][^27][^28][^29][^30][^31][^32][^33][^34][^35]</span>

<div align="center">⁂</div>

[^1]: https://arxiv.org/pdf/1910.12385.pdf

[^2]: https://arxiv.org/pdf/1710.03740.pdf

[^3]: https://www.nas.nasa.gov/hecc/support/kb/basics-on-nvidia-gpu-hardware-architecture_704.html

[^4]: https://www.nvidia.com/content/dam/en-zz/Solutions/Data-Center/a100/pdf/nvidia-a100-datasheet.pdf

[^5]: https://arxiv.org/abs/1910.12385

[^6]: https://arxiv.org/html/2512.07004v2

[^7]: https://images.nvidia.com/aem-dam/en-zz/Solutions/data-center/nvidia-ampere-architecture-whitepaper.pdf

[^8]: https://arxiv.org/html/2511.05811v1

[^9]: https://arxiv.org/abs/2512.07004

[^10]: https://arxiv.org/pdf/2403.00232.pdf

[^11]: https://arxiv.org/html/2312.10024

[^12]: https://arxiv.org/pdf/2409.15241.pdf

[^13]: https://arxiv.org/pdf/2311.14114.pdf

[^14]: https://arxiv.org/pdf/2501.12084.pdf

[^15]: https://arxiv.org/pdf/2206.07137.pdf

[^16]: https://arxiv.org/html/2504.07835v2

[^17]: http://arxiv.org/pdf/2409.07853.pdf

[^18]: https://arxiv.org/html/2511.02302v1

[^19]: https://arxiv.org/html/2412.19437v2

[^20]: https://www.workatafrontierlab.com/lessons/foundations/numerical-stability

[^21]: https://research.colfax-intl.com/deepseek-r1-and-fp8-mixed-precision-training/

[^22]: https://yobitel.com/knowledge-base/mixed-precision-fp16-bf16

[^23]: https://arxiv.org/html/2507.03312v1

[^24]: https://ar5iv.labs.arxiv.org/html/1710.03740

[^25]: https://docs.pytorch.org/docs/2.13/notes/amp_examples.html

[^26]: https://royalsocietypublishing.org/doi/pdf/10.1098/rspa.2020.0110

[^27]: https://arxiv.org/pdf/2305.10947.pdf

[^28]: https://journals.sagepub.com/doi/pdf/10.1177/10943420221084657

[^29]: https://arxiv.org/html/2410.20399v1

[^30]: https://arxiv.org/pdf/2106.02679.pdf

[^31]: https://forums.developer.nvidia.com/t/ncu-tensor-core-roofline-metric/371939

[^32]: https://learnaivisually.com/tracks/gpu-cuda/tensor-cores

[^33]: https://forums.developer.nvidia.com/t/how-to-calculate-the-tensor-core-fp16-performance-of-h100/244727

[^34]: https://forums.developer.nvidia.com/t/tensorcore-roofline/300315

[^35]: https://developer.download.nvidia.com/video/gputechconf/gtc/2020/presentations/s22082-training-neural-networks-with-tensor-core.pdf

