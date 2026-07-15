<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Model Not Learning (Loss Not Decreasing)

## Overview

A flat loss curve usually means the training system is failing to propagate a useful update signal, not that the model is “slow.” In production, the highest-probability causes are an ineffective learning rate, vanishing gradients, saturated activations, frozen parameters, or a data pipeline that is not delivering learnable signal; the fastest path is to localize which of those is blocking optimization. Resolution typically comes from a small set of reversible interventions: raise or schedule the learning rate, restore gradient flow, unfreeze the intended parameters, and validate the batch path by overfitting a single batch.[^1][^2][^3][^4][^5]

## Problem

During deep learning training, loss values remain flat or decrease imperceptibly across epochs, indicating the model is failing to learn meaningful patterns and will not converge to a useful state.[^4][^1]

## Overview Card

* **Severity:** High.
* **Frequency:** Common.
* **Typical Stage:** Training.
* **Estimated Fix Time:** 45-180 min.
* **Production Impact:** High.


## Quick Identification

* **Check:** Loss curve is flat across multiple epochs.
    * **Description:** Monitor training logs for loss values that do not trend downward.[^1]
* **Check:** Validation metrics are static or random.
    * **Description:** Accuracy, F1, or task metrics show no improvement over baseline.[^4]
* **Check:** Gradients are near zero.
    * **Description:** Use gradient norm logging to detect vanishing gradient signals.[^3][^5]


## Symptoms

### Symptom 1: Flat Loss Curve

* **Description:** Training loss remains constant or oscillates around the same value for many epochs.
* **Error Message:** No explicit error; loss values are stable but high.
* **Where Appears:** Training loop, loss computation, optimizer step.
* **Frequency:** Always.


### Symptom 2: Uniform or Random Predictions

* **Description:** Model outputs are identical across samples or statistically random.
* **Error Message:** No explicit error; predictions lack discriminative power.
* **Where Appears:** Inference, validation, prediction head.
* **Frequency:** Often.


### Symptom 3: Near-Zero Gradient Norms

* **Description:** Gradient norms are extremely small, indicating no signal backpropagating.
* **Error Message:** No explicit error; gradient inspection reveals vanishing values.
* **Where Appears:** Backward pass, gradient computation.
* **Frequency:** Often.


## Root Causes

### Root Cause 1: Learning Rate Too Low

* **Probability:** High.
* **Explanation:** Insufficient learning rate makes parameter updates too small to escape plateaus or overcome gradient noise; warmup and schedule design matter because learning-rate choice strongly affects early convergence.[^6][^2][^1]
* **Recognition Clues:**
    * Loss decreases by less than 0.001 per epoch.
    * Gradients are small but non-zero.
    * Increasing learning rate causes immediate loss reduction.
* **Typical Environment:** Fine-tuning pretrained models, conservative hyperparameter choices.


### Root Cause 2: Vanishing Gradients

* **Probability:** High.
* **Explanation:** Gradient signals decay through deep stacks, recurrent paths, or saturated nonlinearities, leaving early layers effectively untrained.[^3][^4]
* **Recognition Clues:**
    * Later layers update normally; early layers have near-zero gradients.
    * Sigmoid/tanh-heavy deep networks show poor signal flow.
    * Residual structure or normalization is absent or misconfigured.
* **Typical Environment:** Very deep networks, RNNs, architectures without residual connections.


### Root Cause 3: Dead ReLU / Saturated Activations

* **Probability:** High.
* **Explanation:** ReLU units can become permanently inactive when inputs stay negative, especially after poor initialization or aggressive updates, which blocks useful gradient propagation.[^5][^1]
* **Recognition Clues:**
    * Large percentage of neurons output zero consistently.
    * Loss flatlines after an initial decrease.
    * Replacing ReLU with LeakyReLU resumes learning.
* **Typical Environment:** Networks with poor initialization, aggressive regularization, or unstable early training.


### Root Cause 4: Incorrect Loss Function

* **Probability:** Medium.
* **Explanation:** A mismatch between loss formulation and task can produce weak or misleading gradients, especially with custom reductions, label encoding errors, or framework migration mistakes.[^5][^4]
* **Recognition Clues:**
    * Loss value is orders of magnitude wrong for the task.
    * Gradient direction contradicts expected behavior.
    * Switching loss function immediately changes loss trajectory.
* **Typical Environment:** Multi-task learning, custom loss implementations, framework version migrations.


### Root Cause 5: Frozen or Untrained Layers

* **Probability:** Medium.
* **Explanation:** Layers may be inadvertently frozen or omitted from the optimizer, so only a subset of the model can adapt.[^7][^4]
* **Recognition Clues:**
    * Only final layer weights change; backbone is static.
    * Loss decreases slightly then plateaus at a suboptimal value.
    * `named_parameters()` shows no gradient accumulation in intended layers.
* **Typical Environment:** Transfer learning, feature extraction mode, partial fine-tuning pipelines.


### Root Cause 6: Data Pipeline Corruption

* **Probability:** Medium.
* **Explanation:** The model may be receiving constant batches, mislabeled examples, collapsed augmentation, or otherwise unlearnable signal, so optimization converges to a trivial baseline.[^7][^4]
* **Recognition Clues:**
    * Training loss equals validation loss.
    * Data inspection reveals identical batches or shuffled labels.
    * Loss is stuck near random-guess baselines.
* **Typical Environment:** Custom data loaders, distributed sampling bugs, augmentation pipelines that collapse variance.


### Root Cause 7: Gradient Accumulation Without Normalization

* **Probability:** Low.
* **Explanation:** If accumulated gradients are not normalized by accumulation steps, the effective update scale can become inconsistent and make optimization appear stalled or poorly tuned.[^8][^6]
* **Recognition Clues:**
    * Loss improves with `accumulation_steps=1` but flatlines with larger values.
    * Effective batch size is large but updates are tiny.
    * Loss scales with accumulation step count.
* **Typical Environment:** Large-batch simulation via gradient accumulation, memory-constrained training.


## Investigation Checklist

* **Check:** Check learning rate value.
    * **Description:** Verify learning rate is not orders of magnitude too small for the task.[^2][^1]
* **Check:** Check gradient norms layer-by-layer.
    * **Description:** Log gradient norms per layer to detect vanishing gradients.[^3][^5]
* **Check:** Check activation outputs.
    * **Description:** Inspect intermediate layer outputs for dead neurons or saturation.[^5]
* **Check:** Check loss function configuration.
    * **Description:** Verify loss function matches task and reduction mode is correct.[^4][^5]
* **Check:** Check parameter freezing status.
    * **Description:** Verify all intended layers have `requires_grad=True` and are passed to optimizer.[^7][^4]
* **Check:** Check data pipeline integrity.
    * **Description:** Inspect batches for label correctness, variance, and shuffling.[^4][^7]
* **Check:** Check gradient accumulation implementation.
    * **Description:** Verify gradients are normalized by accumulation steps before optimizer step.[^6][^8]


## Diagnostic Commands

### Command 1: Check layer-wise gradient norms

* **Purpose:** Detect vanishing gradients by inspecting per-layer gradient magnitude.
* **Command:** `for name, param in model.named_parameters(): if param.grad is not None: print(f"{name}: {param.grad.norm().item()}")`
* **Expected Output:** Gradient norms for each layer.
* **Interpretation:** Early layers with norms near zero indicate vanishing gradients.[^3]


### Command 2: Check for dead ReLU neurons

* **Purpose:** Identify what percentage of ReLU activations are permanently zero.
* **Command:** `dead_ratio = (activation_output == 0).float().mean().item(); print(f"Dead neurons: {dead_ratio:.2%}")`
* **Expected Output:** Ratio of zero activations.
* **Interpretation:** High ratios indicate a severe dead ReLU problem.[^5]


### Command 3: Verify optimizer parameter groups

* **Purpose:** Confirm optimizer is tracking all trainable parameters.
* **Command:** `print(f"Optimizer params: {sum(p.numel() for group in optimizer.param_groups for p in group['params'])}")` and compare to `sum(p.numel() for p in model.parameters() if p.requires_grad)`
* **Expected Output:** Parameter count match.
* **Interpretation:** Mismatch indicates frozen layers or missing parameters.[^7][^4]


### Command 4: Inspect data batch variance

* **Purpose:** Verify data pipeline is delivering diverse, correctly labeled batches.
* **Command:** `print(f"Labels: {labels.unique()}; Batch mean: {data.mean()}; Batch std: {data.std()}")`
* **Expected Output:** Multiple unique labels, non-zero variance.
* **Interpretation:** Single label or zero variance indicates pipeline corruption.[^7]


## Diagnostic Tests

### Test 1: Learning rate range test

* **Purpose:** Determine if learning rate is the cause of stagnation.
* **Test:** Run training with learning rate increased by 10x and 100x for 10 steps each.
* **Command:** `optimizer = AdamW(model.parameters(), lr=lr*10)` and observe loss trajectory
* **Expected Result:** Loss should decrease with higher learning rate until instability appears.
* **Interpretation:** If loss remains flat across all rates, cause is not learning rate alone.
* **Next Action:** If responsive to higher LR, implement LR warmup and scheduler.[^2][^6][^1]


### Test 2: Gradient flow verification

* **Purpose:** Check if gradients are flowing through all layers.
* **Test:** Register backward hooks on each layer and log gradient norms.
* **Command:** `layer.register_full_backward_hook(lambda mod, grad_in, grad_out: print(f"{mod.__class__.__name__}: {grad_out[^0].norm().item()}"))`
* **Expected Result:** Non-zero gradients in all layers.
* **Interpretation:** Zero gradients in specific layers indicate vanishing gradients or blocked flow.
* **Next Action:** Add residual connections, batch norm, or switch activation functions.[^3][^5]


### Test 3: Data sanity check

* **Purpose:** Verify training data contains learnable signal.
* **Test:** Overfit a single batch for 100 steps.
* **Command:** `for _ in range(100): loss = model(batch); loss.backward(); optimizer.step()`
* **Expected Result:** Loss should approach zero on a single batch.
* **Interpretation:** If loss remains flat, model architecture or loss function is broken; if it overfits, the data pipeline is the issue.
* **Next Action:** Fix architecture if the batch cannot overfit; fix data pipeline if it can.[^4][^7]


## Decision Tree

* **Question:** Is loss completely flat (no change >1e-4 across epochs)?
    * **Yes:**
        * **Question:** Are gradient norms near zero across all layers?
            * **Yes:**
                * **Question:** Are you using ReLU activations?
                    * **Yes:**
                        * **Result:** Dead ReLU / saturated activations — switch to LeakyReLU, check initialization.
                    * **No:**
                        * **Result:** Vanishing gradients — add skip connections, batch norm, or use residual architecture.
            * **No:**
                * **Question:** Is learning rate < 1e-6?
                    * **Yes:**
                        * **Result:** Learning rate too low — increase by 10x and implement warmup.
                    * **No:**
                        * **Question:** Does overfitting a single batch work?
                            * **Yes:**
                                * **Result:** Data pipeline corruption — inspect labels, shuffling, augmentation.
                            * **No:**
                                * **Result:** Incorrect loss function or frozen layers — verify loss-reduction mode and parameter freezing.
    * **No:**
        * **Question:** Does loss decrease very slowly (<0.01 per epoch)?
            * **Yes:**
                * **Result:** Learning rate too low or gradient accumulation not normalized — increase LR or divide accumulated gradients by step count.
            * **No:**
                * **Result:** Model is learning normally but converging slowly — consider longer training or curriculum learning.


## Solutions

### Solution 1: Increase Learning Rate with Warmup

* **Quick Fix:** Multiply current learning rate by 10.
* **Permanent Fix:** Implement linear warmup from 0 to target LR over the first 10% of steps, then decay.
* **Steps:**

1. Identify current learning rate in optimizer configuration.
2. Increase by a factor of 10 and run 10 steps to verify response.
3. Implement a warmup schedule followed by decay.
4. Monitor loss trajectory for sustained decrease.
* **Tradeoffs:**
    * Risk of transient instability during warmup.
    * Requires tuning warmup proportion for different batch sizes.
* **Performance Impact:** No training slowdown; may require 5-10% more steps to converge.
* **Difficulty:** Easy.
* **Works For:**
    * Adaptive optimizers.
    * Fine-tuning scenarios with conservative initial LR.
* **Verification:** Loss should show a consistent downward trend within 50 steps.[^6][^1][^2]


### Solution 2: Fix Vanishing Gradients

* **Quick Fix:** Add normalization after linear or convolution layers.
* **Permanent Fix:** Replace plain architecture with residual blocks; use activation functions with non-zero negative slope.
* **Steps:**

1. Inspect gradient norms layer-by-layer to identify where gradients vanish.
2. Insert batch normalization in affected layers.
3. Replace `ReLU()` with `LeakyReLU()` or `GELU()`.
4. For deep networks, add residual skip connections every 2-3 layers.
* **Tradeoffs:**
    * Normalization adds runtime overhead.
    * Residual connections increase memory footprint slightly.
* **Performance Impact:** Moderate compute and memory overhead.
* **Difficulty:** Medium.
* **Works For:**
    * Deep CNNs and transformers without normalization.
    * RNNs and LSTMs with long sequences.
    * Any network deeper than 10 layers.
* **Verification:** Early-layer gradient norms should become comparable to later-layer norms.[^5][^3]


### Solution 3: Resurrect Dead ReLU Neurons

* **Quick Fix:** Replace ReLU with LeakyReLU or PReLU.
* **Permanent Fix:** Use Kaiming/He initialization for layers preceding ReLU; add normalization to prevent distribution shift.
* **Steps:**

1. Measure dead neuron ratio per layer using forward hooks.
2. Replace `ReLU()` with `LeakyReLU(negative_slope=0.01)` in affected layers.
3. Reinitialize weights using a ReLU-appropriate scheme.
4. Add normalization before activation to stabilize input distributions.
* **Tradeoffs:**
    * Reinitialization may require restarting training from scratch.
    * Leaky activations slightly alter model behavior.
* **Performance Impact:** Negligible.
* **Difficulty:** Easy.
* **Works For:**
    * ReLU networks showing a high dead-neuron ratio.
    * Architectures with poor weight initialization.
    * Training runs that flatline after initial decrease.
* **Verification:** Dead neuron ratio should drop sharply within 100 steps.[^1][^5]


### Solution 4: Correct Loss Function Configuration

* **Quick Fix:** Verify loss function matches output activation and task type.
* **Permanent Fix:** Use task-appropriate loss with correct reduction and label encoding.
* **Steps:**

1. Confirm classification uses a classification loss with integer labels.
2. Confirm regression uses a regression loss with float targets.
3. Verify reduction mode is correct to avoid scale-dependent gradients.
4. For multi-label tasks, use a loss intended for independent binary targets.
* **Tradeoffs:**
    * Changing the loss can require hyperparameter retuning.
    * Some stable formulations add compute overhead.
* **Performance Impact:** None; correct loss often improves convergence speed.
* **Difficulty:** Easy.
* **Works For:**
    * Custom loss implementations.
    * Framework migrations with changed defaults.
    * Multi-task setups with mixed targets.
* **Verification:** Loss should fall into the expected range for the task and begin decreasing reliably.[^4][^5]


### Solution 5: Unfreeze Layers and Verify Optimizer Scope

* **Quick Fix:** Pass all intended trainable parameters to the optimizer.
* **Permanent Fix:** Implement staged unfreezing with discriminative learning rates.
* **Steps:**

1. List parameters with `requires_grad=False`.
2. Set intended layers to trainable.
3. Rebuild the optimizer with the full trainable parameter set.
4. For transfer learning, use lower LR for backbone and higher LR for head.
* **Tradeoffs:**
    * Full fine-tuning is more expensive and can cause forgetting.
    * Discriminative LR adds hyperparameter complexity.
* **Performance Impact:** Full fine-tuning is slower per epoch than feature extraction.
* **Difficulty:** Easy.
* **Works For:**
    * Transfer learning pipelines stuck in feature-extraction mode.
    * Models where only the final layer updates.
    * Distributed training with incorrect parameter synchronization.
* **Verification:** Intended trainable parameters should show non-zero gradient norms after backward pass.[^7][^4]


## Verification Checklist

* **Check:** Loss decreases consistently across epochs.
    * **Description:** Training loss shows a monotonic or oscillating downward trend.
* **Check:** Validation metrics improve.
    * **Description:** Accuracy, F1, or task-specific metrics increase over time.
* **Check:** Gradient norms are non-zero in all layers.
    * **Description:** No layer shows vanishing gradient signal.
* **Check:** Model overfits a single batch.
    * **Description:** Architecture and loss function are capable of memorization.
* **Check:** Predictions are diverse across samples.
    * **Description:** Output distribution is not uniform or constant.


## Prevention

### Development Practices

* Start with a learning-rate finder before full training.[^6][^1]
* Use normalization and residual connections in deep networks.[^3][^5]
* Initialize weights with task-appropriate schemes.
* Overfit a single batch as a sanity check before scaling to the full dataset.[^7]


### Production Practices

* Log gradient norms per layer as a standard training metric.
* Implement automatic dead neuron detection alerts.
* Use learning-rate warmup as default for jobs with unstable early optimization.[^2][^1]
* Version-control data preprocessing pipelines to detect corruption.


### Monitoring Practices

* Track loss curvature to detect plateauing early.
* Monitor the train/validation loss gap for optimization and data issues.
* Alert when gradient norms fall below a floor for many consecutive steps.
* Compare current curves against historical baselines for the same architecture.


### Coding Habits

* Always verify `requires_grad` status when loading pretrained weights.
* Confirm all parameters are present in the optimizer state dict.
* Implement data pipeline tests that verify label distribution and batch variance.
* Add assertions for loss value ranges and gradient norm floors in training loops.


## Common Misconceptions

* **Misconception:** Flat loss always means the learning rate is too low.
    * **Reality:** Vanishing gradients, dead neurons, frozen parameters, and data corruption are equally common causes.[^3][^4][^7]
* **Misconception:** More epochs will eventually fix a flat loss curve.
    * **Reality:** If the model cannot learn in a short diagnostic run, more epochs usually just waste compute.
* **Misconception:** Pretrained models never need learning rate tuning.
    * **Reality:** Fine-tuning requires careful LR selection; pretrained weights can mask data and optimizer issues.[^1][^6]


## False Positive Cases

* **Case:** Loss is flat but validation improves.
    * **Why It Looks Similar:** Training metric appears stagnant.
    * **How To Distinguish:** Validation metrics are improving; training loss may be noisy or regularized.
* **Case:** Loss decreases slowly due to large dataset.
    * **Why It Looks Similar:** Apparent stagnation in early epochs.
    * **How To Distinguish:** Loss decreases consistently but gradually.
* **Case:** Intentional regularization causing a higher loss floor.
    * **Why It Looks Similar:** Loss plateaus at non-zero value.
    * **How To Distinguish:** Label smoothing, heavy dropout, or mixup intentionally prevent zero training loss.


## Escalation Paths

* **Path:** Architecture Redesign.
    * **When To Use:** Current architecture is fundamentally incapable of learning the task.
    * **Tradeoffs:**
        * Requires significant engineering effort.
        * May invalidate previous hyperparameter tuning.
* **Path:** Advanced Optimization (Second-Order Methods).
    * **When To Use:** First-order methods consistently fail to escape plateaus or saddle regions.
    * **Tradeoffs:**
        * Memory requirements increase substantially.
        * Per-step compute cost increases.
* **Path:** Curriculum Learning.
    * **When To Use:** Task is inherently difficult; model may learn from simplified subtasks.
    * **Tradeoffs:**
        * Requires manual curriculum design.
        * Training pipeline complexity increases.


## Further Study

## Suggested Meta

* **Tags:** training, debugging, loss, stagnation, vanishing-gradients, dead-relu, learning-rate.
* **Aliases:** loss-not-decreasing, model-not-learning, flat-loss, training-stagnation.
* **Keywords:** pytorch, tensorflow, learning-rate, vanishing-gradients, dead-relu, batch-normalization, residual-connections.
* **Search Tokens:** loss not decreasing, model not learning, flat loss curve, training plateau, vanishing gradient.
* **Difficulty:** Advanced.
* **Domain:** deep-learning.
* **Engineering Area:** training, optimization.
* **Estimated Reading Time:** 25-30 minutes.
* **Prerequisites:** training-loop, backpropagation.
* **Recommended Next:** nan-loss-exploding-gradients, oom-training, overfitting.
* **Cross-Links:**
    * related_packages: pytorch, tensorflow.
    * related_workflows: fine-tune-llm-lora-qlora, train-from-scratch.
    * related_patterns: gradient-accumulation, mixed-precision, training-loop, early-stopping.
    * related_models: llama, mistral, resnet.
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23][^9]</span>

<div align="center">⁂</div>

[^1]: https://arxiv.org/abs/2406.09405

[^2]: https://pytorch.org/ignite/generated/ignite.handlers.param_scheduler.create_lr_scheduler_with_warmup.html

[^3]: https://arxiv.org/abs/1905.11881

[^4]: AENS-Knowledge-Layer-Specification.md

[^5]: CONTENT_QUALITY_STANDARD.md

[^6]: https://www.semanticscholar.org/paper/7ebaa5235ad519a7fad2a0e070228180b6628d80

[^7]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md

[^8]: MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md

[^9]: https://arxiv.org/abs/2508.01483

[^10]: https://ieeexplore.ieee.org/document/9930853/

[^11]: https://arxiv.org/abs/2502.15938

[^12]: https://arxiv.org/abs/2509.07972

[^13]: https://arxiv.org/abs/2505.23420

[^14]: https://arxiv.org/abs/2507.17634

[^15]: https://tony-y.github.io/pytorch_warmup/

[^16]: https://discuss.pytorch.org/t/using-both-learning-rate-warm-up-and-a-learning-rate-scheduler/177767

[^17]: https://docs.pytorch.org/cppdocs/api/optim/schedulers.html

[^18]: https://pytorch-accelerated.readthedocs.io/en/latest/schedulers.html

[^19]: https://github.com/lehduong/torch-warmup-lr/blob/master/README.md

[^20]: https://stackoverflow.com/questions/67136333/learning-rate-scheduler-in-pytorch

[^21]: https://pytorch-optimizers.readthedocs.io/en/v3.6.1/lr_scheduler/

[^22]: https://github.com/developer0hye/Torch-Warmup

[^23]: https://github.com/LEFTeyex/warmup

