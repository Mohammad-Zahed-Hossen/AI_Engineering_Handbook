---

# AENS Debug Guide Resource Prompt — Model Not Learning (Loss Not Decreasing)

---

You are producing gold-standard engineering knowledge for a personal AI engineering reference system (AENS). This is **NOT** a tutorial or introductory documentation. Assume the reader is a **Principal ML Training Engineer** responsible for diagnosing and resolving training stagnation in production machine learning systems.

Generate the debug guide resource using the exact target specifications, architectural baseline, and instructions below.

---

## AENS Knowledge Ingestion Pipeline Integration

This prompt is designed to work with the AENS Production Knowledge Ingestion Pipeline. After Perplexity generates the Markdown content, use the `knowledge_ingestion_prompt (Finalize).md` to convert it to JSON.

**Schema Mapping Reference:**
* The generated Markdown will be converted to JSON matching `lib/schemas/debug-guide.ts`
* All sections below map directly to schema fields
* Preserve exact structure for lossless JSON transformation

---

# Target Debug Guide Specifications

* **Target Debug Guide Name:** `Model Not Learning (Loss Not Decreasing)`
* **Debug Guide Category:** `training`
* **Problem Statement:** Training loss remains flat or decreases imperceptibly across epochs, indicating the model is failing to learn meaningful patterns from the data.
* **Primary Symptoms:**
  * Loss curve is flat with no downward trend
  * Validation metrics do not improve over time
  * Gradients are near zero (vanishing gradients)
  * Model predictions are uniform or random-like
* **Common Environments:**
  * Deep learning training loops
  * Transfer learning and fine-tuning setups
  * Training with pretrained weights
  * Distributed training with synchronization issues

---

# Canonical Reference Implementation

Treat this debug guide as addressing the following baseline training systems:

### PyTorch Training
* **Framework:** PyTorch
* **Common Triggers:** Vanishing gradients, dead ReLUs, incorrect loss function, frozen layers, learning rate too low
* **Detection:** Monitor `loss.item()` across epochs; check `param.grad` norms

### TensorFlow Training
* **Framework:** TensorFlow/Keras
* **Common Triggers:** Incorrect metric tracking, batch normalization in inference mode during training, corrupted optimizer state
* **Detection:** `model.evaluate()` returns static metrics; `tf.debugging.check_numerics` on gradients

---

# Instructions for Perplexity Content Generation

## 1. Role & Voice

> You are a **Principal ML Training Engineer** responsible for diagnosing and resolving training stagnation in production machine learning systems.

Document internal training debugging knowledge for experienced ML platform engineers.

**Prioritize knowledge density over completeness. Every paragraph should contain information that helps an experienced ML engineer diagnose, eliminate, or resolve the issue faster. Avoid repeating concepts across sections.**

Never explain:
* what a loss function is
* what gradients are at a basic level
* beginner API concepts
* what "learning" means mathematically

If a section cannot contain production-grade engineering knowledge, omit it rather than filling it with generic advice.

---

## 2. Objective & Investigation Philosophy

The resource must answer:

> **"What causes a model to stop learning or fail to decrease loss, and how can I systematically identify and resolve the root cause?"**

Every section should address:

### Symptom-First Approach
Start with observable symptoms, not theoretical causes.

### Root Cause Analysis
Generate the most common root causes ranked by observed frequency in production systems. Include additional causes if supported by primary sources.

For each root cause, include:
* **Confidence** - High/Medium/Low based on evidence quality
* **Mechanism** - Why this cause prevents learning or loss reduction
* **Recognition Clues** - Specific indicators to identify this cause
* **Typical Environment** - Where this cause commonly occurs

**Do not include information that cannot be supported by at least one primary source.**

---

## 3. Precision & Anti-Hallucination Standards

Search and synthesize information using **academic connectors and primary sources only**.

Prefer evidence in this order:
1. Deep learning optimization papers
2. Official PyTorch documentation
3. Official TensorFlow documentation
4. Peer-reviewed papers on training dynamics
5. Conference proceedings
6. University publications
7. Engineering blogs only when authored by framework creators or primary contributors

Avoid:
* Medium
* personal blogs
* AI-generated summaries
* SEO articles

Every engineering recommendation must be traceable to a reputable source.

---

## 4. Citation Expectations

Use Markdown footnotes.

Every engineering claim must reference:
* research papers
* official documentation
* conference proceedings
* engineering reports

Every citation must appear exactly once inside **Further Study**.

No orphan citations.

---

## 5. Hard Anti-Pattern Bans

Never include:
* introductions about AI
* beginner explanations
* motivational writing
* API references
* history lessons
* obvious advice
* generic monitoring recommendations
* duplicated documentation

---

## 6. Production Engineering Tradeoffs

For each solution, explicitly address these production engineering dimensions:

* **Implementation Complexity** - How difficult is it to set up and configure?
* **Operational Burden** - What ongoing maintenance is required?
* **Performance Impact** - How does the fix affect training speed?
* **Verification** - How to confirm the fix works?
* **When NOT to use** - Scenarios where this solution is counterproductive

---

## 7. Confidence Levels

For each root cause and solution, include a confidence level:

* **High** - Multiple primary sources agree, reproducible evidence
* **Medium** - Some evidence, but context-dependent or limited studies
* **Low** - Limited evidence, mostly theoretical or anecdotal

---

## 8. Production Ordering

Order every checklist from fastest verification to most expensive investigation. This matches how experienced engineers debug in practice.

---

## 9. Evidence Hierarchy

Prefer evidence in this order:
1. Official documentation
2. Framework maintainers' guidance
3. Research papers
4. Conference talks
5. Engineering reports

For debugging, framework documentation is often more authoritative than papers.

---

# Markdown Output Format & Schema Requirements

Generate semantic Markdown only.

No JSON.

Use the exact headers below.

---

# Model Not Learning (Loss Not Decreasing)

## Overview

Provide a 2-4 sentence overview describing the training stagnation problem where loss fails to decrease, focusing on detection, root causes, and resolution strategies.

---

## Problem

State the engineering problem: During deep learning training, loss values remain flat or decrease imperceptibly across epochs, indicating the model is failing to learn meaningful patterns and will not converge to a useful state.

---

## Overview Card

* **Severity:** High
* **Frequency:** Common
* **Typical Stage:** Training
* **Estimated Fix Time:** 45-180 min
* **Production Impact:** High

---

## Quick Identification

* **Check:** Loss curve is flat across multiple epochs
  * **Description:** Monitor training logs for loss values that do not trend downward
* **Check:** Validation metrics are static or random
  * **Description:** Accuracy, F1, or other metrics show no improvement over baseline
* **Check:** Gradients are near zero
  * **Description:** Use gradient norm logging to detect vanishing gradient signals

---

## Symptoms

### Symptom 1: Flat Loss Curve
* **Description:** Training loss remains constant or oscillates around the same value for many epochs
* **Error Message:** No explicit error; loss values are stable but high
* **Where Appears:** Training loop, loss computation, optimizer step
* **Frequency:** Always

### Symptom 2: Uniform or Random Predictions
* **Description:** Model outputs are identical across samples or statistically random
* **Error Message:** No explicit error; predictions lack discriminative power
* **Where Appears:** Inference, validation, prediction head
* **Frequency:** Often

### Symptom 3: Near-Zero Gradient Norms
* **Description:** Gradient norms are extremely small (<1e-6), indicating no signal backpropagating
* **Error Message:** No explicit error; gradient inspection reveals vanishing values
* **Where Appears:** Backward pass, gradient computation
* **Frequency:** Often

---

## Root Causes

### Root Cause 1: Learning Rate Too Low
* **Probability:** High
* **Explanation:** Insufficient learning rate causes parameter updates to be too small to escape local plateaus or make meaningful progress
* **Recognition Clues:**
  * Loss decreases by <0.001 per epoch
  * Gradients are small but non-zero
  * Increasing learning rate causes immediate loss reduction
* **Typical Environment:** Fine-tuning pretrained models, conservative hyperparameter choices

### Root Cause 2: Vanishing Gradients
* **Probability:** High
* **Explanation:** Gradient signals decay exponentially through deep networks or saturated activation functions, preventing weight updates in early layers
* **Recognition Clues:**
  * Later layers update normally; early layers have near-zero gradients
  * Using sigmoid/tanh activations in deep networks
  * Batch normalization absent or misconfigured
* **Typical Environment:** Very deep networks, RNNs, architectures without residual connections

### Root Cause 3: Dead ReLU / Saturated Activations
* **Probability:** High
* **Explanation:** ReLU neurons permanently output zero due to negative bias initialization or extreme weight updates, becoming permanently inactive
* **Recognition Clues:**
  * Large percentage of neurons output zero consistently
  * Loss flatlines after initial decrease
  * Replacing ReLU with LeakyReLU resumes learning
* **Typical Environment:** Networks with high learning rates, poor initialization, or aggressive regularization

### Root Cause 4: Incorrect Loss Function
* **Probability:** Medium
* **Explanation:** Mismatch between loss function and task (e.g., using MSE for classification) or incorrect reduction mode prevents meaningful gradient computation
* **Recognition Clues:**
  * Loss value is orders of magnitude wrong for the task
  * Gradient direction contradicts expected behavior
  * Switching loss function immediately changes loss trajectory
* **Typical Environment:** Multi-task learning, custom loss implementations, framework version migrations

### Root Cause 5: Frozen or Untrained Layers
* **Probability:** Medium
* **Explanation:** Model layers are inadvertently frozen (requires_grad=False) or optimizer only receives a subset of parameters, preventing end-to-end learning
* **Recognition Clues:**
  * Only final layer weights change; backbone is static
  * Loss decreases slightly then plateaus at suboptimal value
  * `model.named_parameters()` shows no gradient accumulation in frozen layers
* **Typical Environment:** Transfer learning, feature extraction mode, partial fine-tuning pipelines

### Root Cause 6: Data Pipeline Corruption
* **Probability:** Medium
* **Explanation:** Training data is not reaching the model (shuffled labels, constant batches, preprocessing collapse) or labels are uninformative
* **Recognition Clues:**
  * Training loss equals validation loss (model cannot distinguish train from val)
  * Data inspection reveals identical batches or shuffled labels
  * Loss is stuck at theoretical random-guess value (e.g., ln(num_classes) for cross-entropy)
* **Typical Environment:** Custom data loaders, distributed sampling bugs, augmentation pipelines that collapse variance

### Root Cause 7: Gradient Accumulation Without Normalization
* **Probability:** Low
* **Explanation:** Accumulated gradients grow with accumulation steps but are not normalized, causing effective learning rate to scale inversely and stall optimization
* **Recognition Clues:**
  * Loss improves with accumulation_steps=1 but flatlines with accumulation_steps>1
  * Effective batch size is large but updates are tiny
  * Loss scales with accumulation step count
* **Typical Environment:** Large-batch simulation via gradient accumulation, memory-constrained training

---

## Investigation Checklist

* **Check:** Check learning rate value
  * **Description:** Verify learning rate is not orders of magnitude too small for the task
* **Check:** Check gradient norms layer-by-layer
  * **Description:** Log gradient norms per layer to detect vanishing gradients
* **Check:** Check activation outputs
  * **Description:** Inspect intermediate layer outputs for dead neurons or saturation
* **Check:** Check loss function configuration
  * **Description:** Verify loss function matches task and reduction mode is correct
* **Check:** Check parameter freezing status
  * **Description:** Verify all intended layers have requires_grad=True and are passed to optimizer
* **Check:** Check data pipeline integrity
  * **Description:** Inspect batches for label correctness, variance, and shuffling
* **Check:** Check gradient accumulation implementation
  * **Description:** Verify gradients are normalized by accumulation steps before optimizer step

---

## Diagnostic Commands

### Command 1: Check layer-wise gradient norms
* **Purpose:** Detect vanishing gradients by inspecting per-layer gradient magnitude
* **Command:** `for name, param in model.named_parameters(): if param.grad is not None: print(f"{name}: {param.grad.norm().item()}")`
* **Expected Output:** Gradient norms for each layer
* **Interpretation:** Early layers with norms near zero indicate vanishing gradients

### Command 2: Check for dead ReLU neurons
* **Purpose:** Identify what percentage of ReLU activations are permanently zero
* **Command:** `dead_ratio = (activation_output == 0).float().mean().item(); print(f"Dead neurons: {dead_ratio:.2%}")`
* **Expected Output:** Ratio of zero activations
* **Interpretation:** Ratios >50% indicate severe dead ReLU problem

### Command 3: Verify optimizer parameter groups
* **Purpose:** Confirm optimizer is tracking all trainable parameters
* **Command:** `print(f"Optimizer params: {sum(p.numel() for group in optimizer.param_groups for p in group['params'])}")` and compare to `sum(p.numel() for p in model.parameters() if p.requires_grad)`
* **Expected Output:** Parameter count match
* **Interpretation:** Mismatch indicates frozen layers or missing parameters in optimizer

### Command 4: Inspect data batch variance
* **Purpose:** Verify data pipeline is delivering diverse, correctly labeled batches
* **Command:** `print(f"Labels: {labels.unique()}; Batch mean: {data.mean()}; Batch std: {data.std()}")`
* **Expected Output:** Multiple unique labels, non-zero variance
* **Interpretation:** Single label or zero variance indicates pipeline corruption

---

## Diagnostic Tests

### Test 1: Learning rate range test
* **Purpose:** Determine if learning rate is the cause of stagnation
* **Test:** Run training with learning rate increased by 10x and 100x for 10 steps each
* **Command:** `optimizer = AdamW(model.parameters(), lr=lr*10)` and observe loss trajectory
* **Expected Result:** Loss should decrease with higher learning rate (until it explodes)
* **Interpretation:** If loss remains flat across all rates, cause is not learning rate alone
* **Next Action:** If responsive to higher LR, implement LR warmup and scheduler

### Test 2: Gradient flow verification
* **Purpose:** Check if gradients are flowing through all layers
* **Test:** Register backward hooks on each layer and log gradient norms
* **Command:** `layer.register_full_backward_hook(lambda mod, grad_in, grad_out: print(f"{mod.__class__.__name__}: {grad_out[0].norm().item()}"))`
* **Expected Result:** Non-zero gradients in all layers
* **Interpretation:** Zero gradients in specific layers indicate vanishing gradients or blocked flow
* **Next Action:** Add residual connections, batch normalization, or switch activation functions

### Test 3: Data sanity check
* **Purpose:** Verify training data contains learnable signal
* **Test:** Overfit a single batch for 100 steps
* **Command:** `for _ in range(100): loss = model(batch); loss.backward(); optimizer.step()`
* **Expected Result:** Loss should approach zero on a single batch
* **Interpretation:** If loss remains flat, model architecture or loss function is broken; if it overfits, data pipeline is the issue
* **Next Action:** Fix architecture if batch cannot overfit; fix data pipeline if it can

---

## Decision Tree

* **Question:** Is loss completely flat (no change >1e-4 across epochs)?
  * **Yes:**
    * **Question:** Are gradient norms near zero across all layers?
      * **Yes:**
        * **Question:** Are you using ReLU activations?
          * **Yes:**
            * **Result:** Dead ReLU / saturated activations — switch to LeakyReLU, check initialization
          * **No:**
            * **Result:** Vanishing gradients — add skip connections, batch norm, or use residual architecture
      * **No:**
        * **Question:** Is learning rate < 1e-6?
          * **Yes:**
            * **Result:** Learning rate too low — increase by 10x and implement warmup
          * **No:**
            * **Question:** Does overfitting a single batch work?
              * **Yes:**
                * **Result:** Data pipeline corruption — inspect labels, shuffling, augmentation
              * **No:**
                * **Result:** Incorrect loss function or frozen layers — verify loss-reduction mode and parameter freezing
  * **No:**
    * **Question:** Does loss decrease very slowly (<0.01 per epoch)?
      * **Yes:**
        * **Result:** Learning rate too low or gradient accumulation not normalized — increase LR or divide accumulated gradients by step count
      * **No:**
        * **Result:** Model is learning normally but converging slowly — consider longer training or curriculum learning

---

## Solutions

### Solution 1: Increase Learning Rate with Warmup
* **Quick Fix:** Multiply current learning rate by 10
* **Permanent Fix:** Implement linear warmup from 0 to target LR over first 10% of steps, then cosine decay
* **Steps:**
  1. Identify current learning rate in optimizer configuration
  2. Increase by factor of 10 and run 10 steps to verify response
  3. Implement `torch.optim.lr_scheduler.LinearLR` warmup followed by cosine annealing
  4. Monitor loss trajectory for sustained decrease
* **Tradeoffs:**
  * Risk of transient instability during warmup
  * Requires tuning warmup proportion for different batch sizes
* **Performance Impact:** No training slowdown; may require 5-10% more steps to converge
* **Difficulty:** Easy
* **Works For:**
  * All optimizers using adaptive momentum (Adam, AdamW)
  * Fine-tuning scenarios with conservative initial LR
* **Verification:** Loss should show consistent downward trend within 50 steps

### Solution 2: Fix Vanishing Gradients
* **Quick Fix:** Add batch normalization after linear/conv layers
* **Permanent Fix:** Replace plain architecture with residual blocks; use activation functions with non-zero negative slope (LeakyReLU, GELU, Swish)
* **Steps:**
  1. Inspect gradient norms layer-by-layer to identify where gradients vanish
  2. Insert `nn.BatchNorm2d` or `nn.BatchNorm1d` before activations in affected layers
  3. Replace `nn.ReLU()` with `nn.LeakyReLU(0.1)` or `nn.GELU()`
  4. For deep networks, add residual skip connections every 2-3 layers
* **Tradeoffs:**
  * Batch norm adds inference-time statistics dependency
  * Residual connections increase memory footprint slightly
* **Performance Impact:** Batch norm adds ~10-20% compute; residual connections add ~5% memory
* **Difficulty:** Medium
* **Works For:**
  * Deep CNNs and transformers without normalization
  * RNNs and LSTMs with long sequences
  * Any network deeper than 10 layers
* **Verification:** Early-layer gradient norms should be within 1e-3 of final-layer norms

### Solution 3: Resurrect Dead ReLU Neurons
* **Quick Fix:** Replace ReLU with LeakyReLU or PReLU
* **Permanent Fix:** Use Kaiming/He initialization for layers preceding ReLU; add batch normalization to prevent distribution shift
* **Steps:**
  1. Measure dead neuron ratio per layer using forward hooks
  2. Replace `nn.ReLU()` with `nn.LeakyReLU(negative_slope=0.01)` in affected layers
  3. Reinitialize weights using `nn.init.kaiming_normal_(layer.weight, mode='fan_out', nonlinearity='relu')`
  4. Add batch normalization before activation to stabilize input distributions
* **Tradeoffs:**
  * LeakyReLU introduces small negative values that may destabilize some architectures
  * Reinitialization requires restarting training from scratch
* **Performance Impact:** Negligible; LeakyReLU is computationally identical to ReLU
* **Difficulty:** Easy
* **Works For:**
  * Networks with ReLU activations showing >30% dead neurons
  * Architectures with poor weight initialization
  * Training runs that flatline after initial decrease
* **Verification:** Dead neuron ratio should drop below 10% within 100 steps

### Solution 4: Correct Loss Function Configuration
* **Quick Fix:** Verify loss function matches output activation and task type
* **Permanent Fix:** Use task-appropriate loss with correct reduction and label encoding
* **Steps:**
  1. Confirm classification uses `CrossEntropyLoss` (not `MSELoss`) with integer labels
  2. Confirm regression uses `MSELoss` or `L1Loss` with float targets
  3. Verify `reduction='mean'` (not `'sum'`) to prevent scale-dependent gradients
  4. For multi-label, use `BCEWithLogitsLoss` with float targets in [0,1]
* **Tradeoffs:**
  * Changing loss function may require retuning hyperparameters
  * Some losses (focal loss) add computational overhead
* **Performance Impact:** None; correct loss often improves convergence speed
* **Difficulty:** Easy
* **Works For:**
  * Any model where loss value seems mismatched to task
  * Custom loss implementations
  * Framework migrations with changed defaults
* **Verification:** Loss value should be in expected range for task (e.g., ~ln(C) for random classification with C classes)

### Solution 5: Unfreeze Layers and Verify Optimizer Scope
* **Quick Fix:** Pass `model.parameters()` to optimizer instead of subset
* **Permanent Fix:** Implement staged unfreezing with discriminative learning rates
* **Steps:**
  1. Run `print([name for name, p in model.named_parameters() if not p.requires_grad])` to find frozen layers
  2. Set `p.requires_grad = True` for all layers intended for training
  3. Reinitialize optimizer with full parameter set: `optimizer = AdamW(model.parameters(), lr=lr)`
  4. For transfer learning, use discriminative LR: backbone at lr/10, head at lr
* **Tradeoffs:**
  * Full fine-tuning requires more compute and risks catastrophic forgetting
  * Discriminative LR adds hyperparameter complexity
* **Performance Impact:** Full fine-tuning is 2-5x slower per epoch than feature extraction
* **Difficulty:** Easy
* **Works For:**
  * Transfer learning pipelines stuck in feature-extraction mode
  * Models where only final layer is updating
  * Distributed training with incorrect parameter synchronization
* **Verification:** All `named_parameters()` should show non-zero gradient norms after backward pass

---

## Verification Checklist

* **Check:** Loss decreases consistently across epochs
  * **Description:** Training loss shows monotonic or oscillating downward trend
* **Check:** Validation metrics improve
  * **Description:** Accuracy, F1, or task-specific metrics increase over time
* **Check:** Gradient norms are non-zero in all layers
  * **Description:** No layer shows vanishing gradient signal
* **Check:** Model overfits a single batch
  * **Description:** Architecture and loss function are capable of memorization
* **Check:** Predictions are diverse across samples
  * **Description:** Output distribution is not uniform or constant

---

## Prevention

### Development Practices
* Start with learning rate finder (LR range test) before full training
* Use batch normalization and residual connections in all networks deeper than 5 layers
* Initialize weights with task-appropriate schemes (Kaiming for ReLU, Xavier for sigmoid/tanh)
* Overfit a single batch as a sanity check before scaling to full dataset

### Production Practices
* Log gradient norms per layer as a standard training metric
* Implement automatic dead neuron detection alerts
* Use learning rate warmup as default for all training jobs
* Version-control data preprocessing pipelines to detect corruption

### Monitoring Practices
* Track loss curvature (second derivative) to detect plateauing early
* Monitor ratio of train loss to validation loss; divergence indicates data or learning rate issues
* Alert when gradient norms fall below 1e-6 for more than 100 consecutive steps
* Compare current training curves against historical baselines for same architecture

### Coding Habits
* Always verify `requires_grad` status when loading pretrained weights
* Use `torchinfo` or similar to confirm all parameters are in optimizer state dict
* Implement data pipeline unit tests that verify label distribution and batch variance
* Add assertions for loss value ranges and gradient norm floors in training loops

---

## Common Misconceptions

* **Misconception:** Flat loss always means the learning rate is too low
  * **Reality:** Vanishing gradients, dead neurons, or data corruption are equally common causes
* **Misconception:** More epochs will eventually fix a flat loss curve
  * **Reality:** If the model cannot learn in 10 epochs, it will not learn in 1000 without architectural or hyperparameter changes
* **Misconception:** Pretrained models never need learning rate tuning
  * **Reality:** Fine-tuning requires careful LR selection; pretrained weights can dominate and mask data issues

---

## False Positive Cases

* **Case:** Loss is flat but validation improves
  * **Why It Looks Similar:** Training metric appears stagnant
  * **How To Distinguish:** Validation metrics are improving; training loss may be noisy or regularized
* **Case:** Loss decreases slowly due to large dataset
  * **Why It Looks Similar:** Apparent stagnation in early epochs
  * **How To Distinguish:** Loss decreases consistently but gradually; per-step improvement is small due to data scale
* **Case:** Intentional regularization causing high loss floor
  * **Why It Looks Similar:** Loss plateaus at non-zero value
  * **How To Distinguish:** Label smoothing, heavy dropout, or mixup intentionally prevent zero training loss

---

## Escalation Paths

* **Path:** Architecture Redesign
  * **When To Use:** Current architecture is fundamentally incapable of learning the task (e.g., linear model for non-linear data)
  * **Tradeoffs:**
    * Requires significant engineering effort
    * May invalidate previous hyperparameter tuning
* **Path:** Advanced Optimization (Second-Order Methods)
  * **When To Use:** First-order methods consistently fail to escape saddle points
  * **Tradeoffs:**
    * Memory requirements increase 3-5x
    * Per-step compute cost increases substantially
* **Path:** Curriculum Learning
  * **When To Use:** Task is inherently difficult; model may learn from simplified subtasks
  * **Tradeoffs:**
    * Requires manual curriculum design
    * Training pipeline complexity increases

---

## Further Study

### Research Papers
* "Delving Deep into Rectifiers: Surpassing Human-Level Performance on ImageNet Classification" - He et al., 2015 (Kaiming initialization)
* "Batch Normalization: Accelerating Deep Network Training by Reducing Internal Covariate Shift" - Ioffe & Szegedy, 2015
* "Deep Residual Learning for Image Recognition" - He et al., 2016 (residual connections)
* "On the Difficulty of Training Recurrent Neural Networks" - Pascanu et al., 2013 (vanishing gradients)
* "One Cycle Policy" - Smith, 2017 (learning rate range testing)

### Official Documentation
* PyTorch Optimizer Documentation — Learning Rate Schedulers
* PyTorch `torch.nn.init` — Weight Initialization Schemes
* TensorFlow Keras Callbacks — Learning Rate Scheduling
* Hugging Face Transformers — Fine-Tuning Best Practices

### Engineering Blogs
* "How to Debug Neural Networks" — Andrej Karpathy
* "A Recipe for Training Neural Networks" — Andrej Karpathy
* "Troubleshooting Deep Neural Networks" — Josh Tobin

### Videos
* "Training Tips for the Transformer Model" — Various conference talks

---

## Suggested Meta

* **Tags:** training, debugging, loss, stagnation, vanishing-gradients, dead-relu, learning-rate
* **Aliases:** loss-not-decreasing, model-not-learning, flat-loss, training-stagnation
* **Keywords:** pytorch, tensorflow, learning-rate, vanishing-gradients, dead-relu, batch-normalization, residual-connections
* **Search Tokens:** loss not decreasing, model not learning, flat loss curve, training plateau, vanishing gradient
* **Difficulty:** Advanced
* **Domain:** deep-learning
* **Engineering Area:** training, optimization
* **Estimated Reading Time:** 25-30 minutes
* **Prerequisites:** training-loop, backpropagation
* **Recommended Next:** nan-loss-exploding-gradients, oom-training, overfitting
* **Cross-Links:**
  * related_packages: pytorch, tensorflow
  * related_workflows: fine-tune-llm-lora-qlora, train-from-scratch
  * related_patterns: gradient-accumulation, mixed-precision, training-loop, early-stopping
  * related_models: llama, mistral, resnet

---

---

# Schema Mapping Reference for JSON Conversion

After Perplexity generates the Markdown, use the `knowledge_ingestion_prompt (Finalize).md` to convert to JSON. The following mapping rules ensure lossless transformation:

## Markdown to JSON Field Mapping

| Markdown Section | JSON Schema Field | Notes |
|------------------|-------------------|-------|
| Overview | `one_sentence_summary` | Single sentence summary |
| Problem | `problem` | The engineering problem |
| Overview Card | `overview` | Object with severity, frequency, etc. |
| Quick Identification | `quick_identification[]` | Each with `check`, `description` |
| Symptoms | `symptoms[]` | Each with `symptom`, `description`, `error_message`, `where_appears`, `frequency` |
| Root Causes | `root_causes[]` | Each with `cause`, `probability`, `explanation`, `recognition_clues[]`, `typical_environment` |
| Investigation Checklist | `investigation_checklist[]` | Each with `check`, `description` |
| Diagnostic Commands | `diagnostic_commands[]` | Each with `purpose`, `command`, `expected_output`, `interpretation` |
| Diagnostic Tests | `diagnostic_tests[]` | Each with `purpose`, `test`, `command`, `expected_result`, `interpretation`, `next_action` |
| Decision Tree | `decision_tree` | Recursive object with `question`, `yes`, `no`, `result` |
| Solutions | `solutions[]` | Each with `solution`, `steps[]`, `quick_fix`, `permanent_fix`, `tradeoffs[]`, `performance_impact`, `difficulty`, `works_for[]`, `verification` |
| Verification Checklist | `verification_checklist[]` | Each with `check`, `description` |
| Prevention | `prevention[]` | Each with `category`, `practices[]` |
| Common Misconceptions | `common_misconceptions[]` | Each with `misconception`, `reality` |
| False Positive Cases | `false_positive_cases[]` | Each with `case`, `why_it_looks_similar`, `how_to_distinguish` |
| Escalation Paths | `escalation_paths[]` | Each with `path`, `when_to_use`, `tradeoffs[]` |

## Required Base Metadata Fields

The following fields must be populated in the JSON (from BaseMetaSchema):
* `id` - Use "model-not-learning-loss-not-decreasing"
* `title` - "Model Not Learning (Loss Not Decreasing)"
* `slug` - "model-not-learning-loss-not-decreasing"
* `description` - Brief description of the debug guide
* `name` - "Model Not Learning (Loss Not Decreasing)"
* `category` - "training"
* `created_at` - Current date (YYYY-MM-DD)
* `updated_at` - Current date (YYYY-MM-DD)
* `sources` - Array of source URLs (minimum 1)
* `tags` - Array of tags
* `keywords` - Array of keywords
* `search_tokens` - Array of search tokens
* `domain` - "deep-learning"
* `difficulty` - "advanced"
* `engineering_area` - "training"
* `estimated_reading_time` - Number in minutes
* `prerequisites` - Array of prerequisite workflow IDs
* `last_verified` - Date
* `review_frequency` - "quarterly"
* `canonical_status` - "canonical"
* `lifecycle` - "stable"
* `stability` - "stable"
* `confidence` - "production_proven"
* `engineering_maturity` - "production_ready"

## JSON Conversion Rules

1. **Tables:** Convert markdown tables to JSON objects/arrays preserving all rows and columns
2. **Lists:** Convert bulleted lists to JSON string arrays
3. **Code Blocks:** Preserve exactly as-is, only JSON-escape necessary characters
4. **URLs:** Copy exactly, no modification
5. **No Invention:** Do not create data not present in Markdown
6. **No Omission:** Do not omit any information from Markdown
7. **Order Preservation:** Maintain original order of array items

---

# Final Validation Checklist

Before outputting, verify that:

1. Debug guide category is exactly **training**.
2. Output is semantic Markdown only.
3. At least 1 symptom is present with complete information.
4. At least 1 root cause is present with probability and clues.
5. Decision tree is present and complete.
6. At least 1 solution is provided with steps.
7. Prevention section has all 4 categories.
8. Every engineering claim is footnoted.
9. Every footnote appears exactly once in **Further Study**.
10. All suggested AENS IDs use real-world common naming.
11. The output focuses on production training debugging rather than API documentation or introductory explanations.