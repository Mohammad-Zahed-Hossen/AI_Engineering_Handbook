<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# NaN Loss / Exploding Gradients

## Overview

NaN loss and exploding gradients are usually symptoms of a numerical instability in the training stack, not a single broken model component, and the fastest path to resolution is to localize whether the failure starts in data, loss computation, optimizer state, or mixed precision. In production, the highest-frequency fixes are learning-rate reduction, AMP configuration correction, gradient clipping, and batch-level data isolation, with verification centered on reproducing the failure at the smallest failing step. PyTorch provides direct NaN detection helpers such as `torch.isnan` and AMP tooling for scaling and autocast, while TensorFlow recommends `tf.debugging.check_numerics` and mixed-precision controls for the same class of failures.[^1][^2][^3][^4]

## Problem

During deep learning training, loss values or gradients can become NaN or infinity, causing training to fail or produce unstable, unusable models. This is a training-time numerical debugging problem with symptoms that often surface only after the optimizer step, during backward propagation, or on a specific batch that triggers overflow.[^5][^2][^3]

## Overview Card

* **Severity:** Critical.
* **Frequency:** Common.
* **Typical Stage:** Training.
* **Estimated Fix Time:** 30-120 min.
* **Production Impact:** Severe.


## Quick Identification

* **Check:** Loss becomes NaN or inf during training.
    * **Description:** Monitor training logs for `nan` or `inf` values in loss.[^3][^4]
* **Check:** Gradients contain NaN or inf values.
    * **Description:** Inspect gradient tensors or apply gradient norm checks before the optimizer step; clipping utilities can also expose runaway norms.[^6][^2]
* **Check:** Model weights become NaN after training.
    * **Description:** Validate checkpoints or parameter tensors for non-finite values before save and after optimizer updates.[^4][^3]


## Symptoms

### Symptom 1: NaN Loss

* **Description:** Training loss suddenly becomes NaN or infinity, often after a few iterations.
* **Error Message:** `loss: nan` or `loss: inf` in training logs.
* **Where Appears:** Training loop, loss computation, optimizer step.
* **Frequency:** Always.


### Symptom 2: Exploding Gradients

* **Description:** Gradient norms grow rapidly and eventually destabilize optimization.
* **Error Message:** May not show an explicit error, but training diverges.
* **Where Appears:** Backward pass, gradient computation.
* **Frequency:** Often.


### Symptom 3: Model Output Instability

* **Description:** Model produces garbage or highly variable outputs.
* **Error Message:** No explicit error, but outputs are nonsensical.
* **Where Appears:** Inference, validation.
* **Frequency:** Sometimes.


## Root Causes

### Root Cause 1: Learning Rate Too High

* **Probability:** High.
* **Explanation:** Oversized updates push parameters into regions where activations, loss terms, or optimizer state become numerically unstable; gradient clipping theory and practical guidance both treat uncontrolled step size as a major instability driver.[^7][^6]
* **Recognition Clues:**
    * Loss spikes before becoming NaN.
    * Reducing learning rate by 10x restores stability.
    * Failure appears early and reproducibly across seeds.
* **Typical Environment:** Training with large models, especially transformers.


### Root Cause 2: Mixed Precision Instability

* **Probability:** High.
* **Explanation:** FP16/bfloat16 arithmetic can overflow or underflow intermediate values, and incorrect scaling or autocast usage can turn finite values into NaN/inf during forward or backward passes.[^2][^1]
* **Recognition Clues:**
    * NaN appears only when AMP is enabled.
    * FP32 training is stable.
    * Loss scaling behavior changes the failure point.
* **Typical Environment:** Mixed precision training with large batch sizes.


### Root Cause 3: Gradient Accumulation Issues

* **Probability:** Medium.
* **Explanation:** Accumulation bugs can effectively apply updates at the wrong scale, compound stale gradients, or skip required zeroing/unscaling steps, which amplifies instability over multiple microbatches.
* **Recognition Clues:**
    * NaN appears after multiple accumulation steps.
    * Loss scales with accumulation depth.
    * Manual single-step training is stable.
* **Typical Environment:** Training loops with manual gradient accumulation.


### Root Cause 4: Data Contamination

* **Probability:** Medium.
* **Explanation:** Invalid or extreme input values can drive activations or loss terms out of range, especially when a specific batch contains NaN/inf, extreme outliers, or malformed labels.[^3][^4]
* **Recognition Clues:**
    * NaN appears on specific batches.
    * Data inspection shows inf/nan values.
    * Validation loss is stable while training fails.
* **Typical Environment:** New datasets, web-scraped data.


### Root Cause 5: Numerical Overflow in Loss Computation

* **Probability:** Low.
* **Explanation:** Loss implementations can overflow on extreme logits, invalid probabilities, or poorly bounded regression targets; framework numerics checks exist specifically to catch this class of failure.[^4][^3]
* **Recognition Clues:**
    * NaN appears in a specific loss function.
    * Predictions become very large before NaN.
    * Rewriting the loss in a stable form removes the issue.
* **Typical Environment:** Classification with extreme logits, regression with outliers.


## Investigation Checklist

* **Check:** Check learning rate value.
    * **Description:** Verify the optimizer step size is appropriate for the model, batch size, and schedule.
* **Check:** Check gradient norms.
    * **Description:** Log or inspect global gradient norm before the optimizer step to confirm runaway magnitudes.[^6][^2]
* **Check:** Check mixed precision settings.
    * **Description:** Verify autocast, loss scaling, and unscale-before-clip ordering are correct.[^1][^2]
* **Check:** Check data for invalid values.
    * **Description:** Inspect batches, labels, and masks for NaN/inf or extreme outliers.[^3][^4]
* **Check:** Check loss function implementation.
    * **Description:** Verify the loss is numerically stable under extreme logits, probabilities, or masks.
* **Check:** Check optimizer state.
    * **Description:** Verify momentum, adaptive moments, and scaler state are not corrupted after a failed step.


## Diagnostic Commands

### Command 1: Check for NaN in loss

* **Purpose:** Detect NaN values in training loss.
* **Command:** `print(f"Loss: {loss.item()}")` or `if torch.isnan(loss): print("NaN detected")`
* **Expected Output:** Loss value or NaN warning.
* **Interpretation:** NaN indicates numerical instability.[^4]


### Command 2: Check gradient norms

* **Purpose:** Monitor gradient magnitude.
* **Command:** `total_norm = torch.nn.utils.clip_grad_norm_(model.parameters(), float('inf'))`
* **Expected Output:** Gradient norm value.
* **Interpretation:** Very large norms indicate exploding gradients; clipping infrastructure also gives a direct hook for mitigation.[^2][^6]


### Command 3: Check for inf/nan in data

* **Purpose:** Verify data integrity.
* **Command:** `print(torch.isinf(data).sum(), torch.isnan(data).sum())`
* **Expected Output:** Count of invalid values.
* **Interpretation:** Any non-zero count indicates data issues.[^4]


## Diagnostic Tests

### Test 1: Learning rate sensitivity test

* **Purpose:** Determine if learning rate is the cause.
* **Test:** Run training with 10x smaller learning rate.
* **Command:** `optimizer = AdamW(model.parameters(), lr=lr/10)`
* **Expected Result:** Stable loss with reduced learning rate.
* **Interpretation:** If stable, the learning rate was likely too high.
* **Next Action:** Reduce learning rate or use a warmup schedule.[^7][^6]


### Test 2: Disable mixed precision

* **Purpose:** Check if AMP is causing instability.
* **Test:** Run training without automatic mixed precision.
* **Command:** `with torch.cuda.amp.autocast(enabled=False): ...`
* **Expected Result:** Stable loss in FP32.
* **Interpretation:** If stable, AMP configuration needs adjustment.
* **Next Action:** Adjust AMP settings or use loss scaling.[^1][^2]


## Decision Tree

* **Question:** Does loss become NaN immediately?
    * **Yes:**
        * **Question:** Is learning rate > 1e-3?
            * **Yes:**
                * **Result:** Learning rate too high - reduce by 10x.
            * **No:**
                * **Question:** Is AMP enabled?
                    * **Yes:**
                        * **Result:** Mixed precision instability - disable or adjust.
                    * **No:**
                        * **Result:** Check data for invalid values.
    * **No:**
        * **Question:** Do gradient norms grow over time?
            * **Yes:**
                * **Result:** Gradient accumulation issue - check implementation.
            * **No:**
                * **Question:** Does NaN appear on specific batches?
                    * **Yes:**
                        * **Result:** Data contamination - clean dataset.
                    * **No:**
                        * **Result:** Loss function numerical overflow - add a stable formulation or clipping.


## Solutions

### Solution 1: Reduce Learning Rate

* **Quick Fix:** Halve the learning rate immediately.
* **Permanent Fix:** Implement a learning-rate scheduler with warmup.
* **Steps:**

1. Locate optimizer learning rate initialization.
2. Reduce learning rate by a factor of 10.
3. Add gradient clipping to contain future spikes.
* **Tradeoffs:**
    * Slower convergence.
    * May require more epochs.
* **Performance Impact:** Moderate slowdown from extra steps to convergence.
* **Difficulty:** Easy.
* **Works For:**
    * Transformer and large-model training.
    * Early-epoch instability.
* **Verification:** Loss stabilizes and decreases normally.


### Solution 2: Enable Gradient Clipping

* **Quick Fix:** Add gradient clipping with `max_norm=1.0`.
* **Permanent Fix:** Tune clipping threshold against observed gradient distributions.
* **Steps:**

1. Add `torch.nn.utils.clip_grad_norm_` before the optimizer step.
2. Set `max_norm` to 1.0 or 5.0.
3. Monitor gradient norms to tune the threshold.
* **Tradeoffs:**
    * May slow training slightly.
    * Can hide an underlying optimizer or data bug.
* **Performance Impact:** Minimal overhead.
* **Difficulty:** Easy.
* **Works For:**
    * Unstable gradients in transformers and RNNs.
    * Long-sequence training.
* **Verification:** Gradient norms remain below the clipping threshold and loss stops diverging.[^8][^6]


### Solution 3: Fix Mixed Precision Configuration

* **Quick Fix:** Disable AMP temporarily.
* **Permanent Fix:** Use native AMP with proper scaling and unscale-before-clip ordering.
* **Steps:**

1. Enable `torch.cuda.amp.GradScaler`.
2. Scale loss before backward pass.
3. Unscale gradients before clipping.
* **Tradeoffs:**
    * More implementation complexity.
    * Slightly reduced throughput versus pure AMP.
* **Performance Impact:** Small throughput reduction relative to unstable mixed-precision runs.
* **Difficulty:** Medium.
* **Works For:**
    * Mixed precision training.
    * Large batch training.
* **Verification:** No NaN appears with AMP enabled, and loss-scaling behavior is stable.[^2][^1]


## Verification Checklist

* **Check:** No NaN in loss values.
    * **Description:** Training completes without numerical errors.
* **Check:** Gradient norms stable.
    * **Description:** Gradient norms stay within reasonable bounds.
* **Check:** Model converges.
    * **Description:** Loss decreases over epochs.
* **Check:** Validation metrics improve.
    * **Description:** Model quality improves on the validation set.


## Prevention

### Development Practices

* Start with conservative learning rates.
* Use gradient clipping by default.
* Profile loss values before scaling to full training.


### Production Practices

* Set up alerts for NaN/inf in training metrics.
* Use learning-rate schedulers with warmup and decay.
* Implement automatic restart or job fail-fast on numerical instability.


### Monitoring Practices

* Log gradient norms every step.
* Track loss distribution over time.
* Stop or quarantine runs on first non-finite value.


### Coding Habits

* Always check for NaN in custom loss functions.
* Use numerically stable primitives for softmax, log, and ratio computations.
* Add gradient checks in training loops.


## Common Misconceptions

* **Misconception:** NaN always means the model is broken.
    * **Reality:** It is often caused by learning rate, AMP, data, or loss formulation issues rather than architecture.[^2][^3]
* **Misconception:** Gradient clipping always fixes exploding gradients.
    * **Reality:** It reduces damage but does not remove the underlying root cause.[^8][^6]
* **Misconception:** Lower learning rate always helps.
    * **Reality:** Too low can cause slow convergence or optimization stagnation.[^6]


## False Positive Cases

* **Case:** Loss plateau, not NaN.
    * **Why It Looks Similar:** Training appears stuck.
    * **How To Distinguish:** Loss remains finite but does not decrease.
* **Case:** Validation loss increase.
    * **Why It Looks Similar:** Model appears to diverge.
    * **How To Distinguish:** Training loss is stable, validation is increasing.
* **Case:** Logging error.
    * **Why It Looks Similar:** NaN appears in logs.
    * **How To Distinguish:** Actual loss values are valid; logging format is wrong.


## Escalation Paths

* **Path:** Learning Rate Range Test.
    * **When To Use:** Need to find a stable operating range fast.
    * **Tradeoffs:**
        * Requires an additional training run.
        * May not generalize across batch sizes.
* **Path:** Advanced Optimizers (Lion, Sophia).
    * **When To Use:** Standard optimizers remain unstable after basic fixes.
    * **Tradeoffs:**
        * Less battle-tested in every workload.
        * Requires re-tuning hyperparameters.
* **Path:** Distributed Training with Gradient Averaging.
    * **When To Use:** Single-GPU training remains unstable and scale-out diagnosis is needed.
    * **Tradeoffs:**
        * Adds infrastructure complexity.
        * Introduces network and synchronization overhead.


## Further Study

## Suggested Meta

* **Tags:** training, debugging, nan, gradients, loss, stability.
* **Aliases:** nan-loss, exploding-gradients, training-instability.
* **Keywords:** pytorch, tensorflow, mixed-precision, gradient-clipping, learning-rate.
* **Search Tokens:** nan loss, exploding gradients, training instability, gradient clipping.
* **Difficulty:** Advanced.
* **Domain:** deep-learning.
* **Engineering Area:** training, optimization.
* **Estimated Reading Time:** 25-30 minutes.
* **Prerequisites:** pytorch, training-loop.
* **Recommended Next:** oom-training, tokenizer-mismatch.
* **Cross-Links:**
    * related_packages: pytorch, tensorflow.
    * related_workflows: fine-tune-llm-lora-qlora.
    * related_patterns: gradient-accumulation, mixed-precision, training-loop.
    * related_models: llama, mistral.
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23][^24][^25][^26][^27][^28][^29][^30][^31][^32][^33][^34][^35][^36][^37][^38][^39][^40][^9]</span>

<div align="center">⁂</div>

[^1]: https://www.tensorflow.org/guide/mixed_precision

[^2]: https://docs.pytorch.org/tutorials/recipes/recipes/amp_recipe.html

[^3]: https://www.tensorflow.org/api_docs/python/tf/debugging/check_numerics

[^4]: https://docs.pytorch.org/docs/stable/generated/torch.isnan.html

[^5]: AENS-Knowledge-Layer-Specification.md

[^6]: https://arxiv.org/abs/1905.11881

[^7]: https://mitibmwatsonailab.mit.edu/research/blog/why-gradient-clipping-accelerates-training-for-neural-networks/

[^8]: https://huggingface.co/papers/2305.01588

[^9]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md

[^10]: MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md

[^11]: CONTENT_QUALITY_STANDARD.md

[^12]: ARCHITECTURE_FREEZE.md

[^13]: https://arxiv.org/abs/2404.01897

[^14]: https://www.semanticscholar.org/paper/ac70a12af704972a55c287b4d0cb15ecaec3e354

[^15]: https://ieeexplore.ieee.org/document/9467293/

[^16]: https://ieeexplore.ieee.org/document/9156614/

[^17]: https://academic.oup.com/jas/article/102/Supplement_1/32/7617918

[^18]: https://academic.oup.com/jas/article/101/Supplement_3/528/7372799

[^19]: http://arxiv.org/pdf/2304.11692.pdf

[^20]: http://arxiv.org/pdf/1811.04142.pdf

[^21]: https://www.scitepress.org/Papers/2023/116780/116780.pdf

[^22]: https://arxiv.org/abs/2404.08624

[^23]: https://papers.nips.cc/paper/2020/hash/9ecff5455677b38d19f49ce658ef0608-Abstract.html

[^24]: https://arxiv.org/abs/2602.10584

[^25]: https://discuss.pytorch.org/t/loss-is-nan-vanishing-exploding-gradients/162130

[^26]: https://proceedings.neurips.cc/paper/2020/file/b282d1735283e8eea45bce393cefe265-Paper.pdf

[^27]: https://arxiv.org/pdf/2110.15018.pdf

[^28]: https://joss.theoj.org/papers/10.21105/joss.05035.pdf

[^29]: https://arxiv.org/pdf/2112.08429.pdf

[^30]: http://arxiv.org/pdf/2406.01821.pdf

[^31]: https://arxiv.org/pdf/2211.13184.pdf

[^32]: https://arxiv.org/pdf/2003.04696.pdf

[^33]: https://arxiv.org/pdf/2412.18271.pdf

[^34]: https://docs.pytorch.org/docs/1.10.0/_sources/notes/amp_examples.rst.txt

[^35]: https://docs.pytorch.org/docs/stable/_sources/amp.md.txt

[^36]: https://pytorch.cadn.net.cn/docs/2.6/notes.amp_examples.html

[^37]: https://discuss.pytorch.org/t/gradscaler-for-cpu-with-amp/202883

[^38]: https://apxml.com/courses/pytorch-for-tensorflow-developers/chapter-6-advanced-pytorch-features-tf-users/pytorch-mixed-precision-amp

[^39]: https://docs.pytorch.org/docs/2.9/generated/torch.isnan.html

[^40]: https://torchjs.org/docs/torch.js/generated/torch.isnan

