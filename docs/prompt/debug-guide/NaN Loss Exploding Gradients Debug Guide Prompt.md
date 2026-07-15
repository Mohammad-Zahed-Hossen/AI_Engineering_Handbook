---

# AENS Debug Guide Resource Prompt — NaN Loss / Exploding Gradients

---

You are producing gold-standard engineering knowledge for a personal AI engineering reference system (AENS). This is **NOT** a tutorial or introductory documentation. Assume the reader is a **Principal ML Training Engineer** responsible for diagnosing and resolving training instability in production machine learning systems.

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

* **Target Debug Guide Name:** `NaN Loss / Exploding Gradients`
* **Debug Guide Category:** `training`
* **Problem Statement:** Training loss becomes NaN (Not a Number) or gradients explode to infinity, causing model training to fail or produce unstable outputs.
* **Primary Symptoms:**
  * Loss values become NaN or infinity
  * Gradients contain NaN or inf values
  * Model weights become NaN
  * Training diverges instead of converging
* **Common Environments:**
  * Deep learning training loops
  * Large language model fine-tuning
  * Transformer training with mixed precision
  * Distributed training setups

---

# Canonical Reference Implementation

Treat this debug guide as addressing the following baseline training systems:

### PyTorch Training
* **Framework:** PyTorch
* **Common Triggers:** High learning rates, mixed precision instability, gradient accumulation issues
* **Detection:** `torch.isnan(loss)` or `torch.isinf(loss)`

### TensorFlow Training
* **Framework:** TensorFlow/Keras
* **Common Triggers:** Numerical overflow, optimizer state corruption
* **Detection:** `tf.math.is_nan(loss)` or `tf.debugging.check_numerics`

---

# Instructions for Perplexity Content Generation

## 1. Role & Voice

> You are a **Principal ML Training Engineer** responsible for diagnosing and resolving training instability in production machine learning systems.

Document internal training debugging knowledge for experienced ML platform engineers.

**Prioritize knowledge density over completeness. Every paragraph should contain information that helps an experienced ML engineer diagnose, eliminate, or resolve the issue faster. Avoid repeating concepts across sections.**

Never explain:
* what a loss function is
* what gradients are at a basic level
* beginner API concepts
* what NaN means mathematically

If a section cannot contain production-grade engineering knowledge, omit it rather than filling it with generic advice.

---

## 2. Objective & Investigation Philosophy

The resource must answer:

> **"What causes NaN loss or exploding gradients in deep learning training, and how can I systematically identify and resolve the root cause?"**

Every section should address:

### Symptom-First Approach
Start with observable symptoms, not theoretical causes.

### Root Cause Analysis
Generate the most common root causes ranked by observed frequency in production systems. Include additional causes if supported by primary sources.

For each root cause, include:
* **Confidence** - High/Medium/Low based on evidence quality
* **Mechanism** - Why this cause produces NaN/exploding gradients
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
4. Peer-reviewed papers on training stability
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

# NaN Loss / Exploding Gradients

## Overview

Provide a 2-4 sentence overview describing the training instability problem where loss becomes NaN or gradients explode, focusing on detection, root causes, and resolution strategies.

---

## Problem

State the engineering problem: During deep learning training, loss values or gradients can become NaN or infinity, causing training to fail or produce unstable, unusable models.

---

## Overview Card

* **Severity:** Critical
* **Frequency:** Common
* **Typical Stage:** Training
* **Estimated Fix Time:** 30-120 min
* **Production Impact:** Severe

---

## Quick Identification

* **Check:** Loss becomes NaN or inf during training
  * **Description:** Monitor training logs for `nan` or `inf` values in loss
* **Check:** Gradients contain NaN or inf values
  * **Description:** Use gradient clipping or checking to detect unstable gradients
* **Check:** Model weights become NaN after training
  * **Description:** Final model checkpoint contains invalid values

---

## Symptoms

### Symptom 1: NaN Loss
* **Description:** Training loss suddenly becomes NaN or infinity, often after a few iterations
* **Error Message:** `loss: nan` or `loss: inf` in training logs
* **Where Appears:** Training loop, loss computation, optimizer step
* **Frequency:** Always

### Symptom 2: Exploding Gradients
* **Description:** Gradient norms grow exponentially, often >1000
* **Error Message:** May not show explicit error, but training diverges
* **Where Appears:** Backward pass, gradient computation
* **Frequency:** Often

### Symptom 3: Model Output Instability
* **Description:** Model produces garbage or highly variable outputs
* **Error Message:** No explicit error, but outputs are nonsensical
* **Where Appears:** Inference, validation
* **Frequency:** Sometimes

---

## Root Causes

### Root Cause 1: Learning Rate Too High
* **Probability:** High
* **Explanation:** Large learning rates cause parameter updates to overshoot optimal values, leading to numerical instability
* **Recognition Clues:**
  * OOM occurs immediately at the start of training
  * Reducing learning rate resolves the issue
  * Loss spikes before becoming NaN
* **Typical Environment:** Training with large models, especially transformers

### Root Cause 2: Mixed Precision Instability
* **Probability:** High
* **Explanation:** FP16 underflow/overflow during gradient computation causes NaN values
* **Recognition Clues:**
  * NaN appears only when AMP is enabled
  * Loss values are very large before NaN
  * Using FP32 resolves the issue
* **Typical Environment:** Mixed precision training with large batch sizes

### Root Cause 3: Gradient Accumulation Issues
* **Probability:** Medium
* **Explanation:** Improper gradient accumulation causes gradient values to compound incorrectly
* **Recognition Clues:**
  * NaN appears after multiple accumulation steps
  * Loss scales with accumulation steps
  * Manual gradient scaling shows correct values
* **Typical Environment:** Training loops with manual gradient accumulation

### Root Cause 4: Data Contamination
* **Probability:** Medium
* **Explanation:** Invalid or extreme values in training data cause loss to explode
* **Recognition Clues:**
  * NaN appears on specific batches
  * Data inspection shows inf/nan values
  * Validation loss is stable
* **Typical Environment:** New datasets, web-scraped data

### Root Cause 5: Numerical Overflow in Loss Computation
* **Probability:** Low
* **Explanation:** Loss function computation overflows for extreme predictions
* **Recognition Clues:**
  * NaN appears in specific loss functions (e.g., cross-entropy with extreme logits)
  * Model predictions are very large before NaN
  * Label smoothing helps
* **Typical Environment:** Classification with extreme logits, regression with outliers

---

## Investigation Checklist

* **Check:** Check learning rate value
  * **Description:** Verify learning rate is appropriate for model and optimizer
* **Check:** Check gradient norms
  * **Description:** Log gradient norms to detect explosion
* **Check:** Check mixed precision settings
  * **Description:** Verify AMP is configured correctly
* **Check:** Check data for invalid values
  * **Description:** Inspect training data for inf/nan values
* **Check:** Check loss function implementation
  * **Description:** Verify loss function handles edge cases
* **Check:** Check optimizer state
  * **Description:** Verify optimizer state is not corrupted

---

## Diagnostic Commands

### Command 1: Check for NaN in loss
* **Purpose:** Detect NaN values in training loss
* **Command:** `print(f"Loss: {loss.item()}")` or `if torch.isnan(loss): print("NaN detected")`
* **Expected Output:** Loss value or NaN warning
* **Interpretation:** NaN indicates numerical instability

### Command 2: Check gradient norms
* **Purpose:** Monitor gradient magnitude
* **Command:** `total_norm = torch.nn.utils.clip_grad_norm_(model.parameters(), float('inf'))`
* **Expected Output:** Gradient norm value
* **Interpretation:** Norms >1000 indicate exploding gradients

### Command 3: Check for inf/nan in data
* **Purpose:** Verify data integrity
* **Command:** `print(torch.isinf(data).sum(), torch.isnan(data).sum())`
* **Expected Output:** Count of invalid values
* **Interpretation:** Any non-zero count indicates data issues

---

## Diagnostic Tests

### Test 1: Learning rate sensitivity test
* **Purpose:** Determine if learning rate is the cause
* **Test:** Run training with 10x smaller learning rate
* **Command:** `optimizer = AdamW(model.parameters(), lr=lr/10)`
* **Expected Result:** Stable loss with reduced learning rate
* **Interpretation:** If stable, learning rate was too high
* **Next Action:** Reduce learning rate or use scheduler

### Test 2: Disable mixed precision
* **Purpose:** Check if AMP is causing instability
* **Test:** Run training without automatic mixed precision
* **Command:** `with torch.cuda.amp.autocast(enabled=False): ...`
* **Expected Result:** Stable loss in FP32
* **Interpretation:** If stable, AMP configuration needs adjustment
* **Next Action:** Adjust AMP settings or use loss scaling

---

## Decision Tree

* **Question:** Does loss become NaN immediately?
  * **Yes:**
    * **Question:** Is learning rate > 1e-3?
      * **Yes:**
        * **Result:** Learning rate too high - reduce by 10x
      * **No:**
        * **Question:** Is AMP enabled?
          * **Yes:**
            * **Result:** Mixed precision instability - disable or adjust
          * **No:**
            * **Result:** Check data for invalid values
  * **No:**
    * **Question:** Do gradient norms grow over time?
      * **Yes:**
        * **Result:** Gradient accumulation issue - check implementation
      * **No:**
        * **Question:** Does NaN appear on specific batches?
          * **Yes:**
            * **Result:** Data contamination - clean dataset
          * **No:**
            * **Result:** Loss function numerical overflow - add label smoothing

---

## Solutions

### Solution 1: Reduce Learning Rate
* **Quick Fix:** Halve the learning rate immediately
* **Permanent Fix:** Implement learning rate scheduler with warmup
* **Steps:**
  1. Locate optimizer learning rate initialization
  2. Reduce learning rate by factor of 10
  3. Add gradient clipping to prevent future issues
* **Tradeoffs:**
  * Slower convergence
  * May require more epochs
* **Performance Impact:** Training may be 10-20% slower
* **Difficulty:** Easy
* **Works For:**
  * All deep learning models
  * Quick resolution in development
* **Verification:** Loss should stabilize and decrease normally

### Solution 2: Enable Gradient Clipping
* **Quick Fix:** Add gradient clipping with max_norm=1.0
* **Permanent Fix:** Configure adaptive gradient clipping based on training dynamics
* **Steps:**
  1. Add `torch.nn.utils.clip_grad_norm_` before optimizer step
  2. Set max_norm to 1.0 or 5.0
  3. Monitor gradient norms to tune threshold
* **Tradeoffs:**
  * May slow training slightly
  * Can mask underlying issues
* **Performance Impact:** Minimal overhead
* **Difficulty:** Easy
* **Works For:**
  * All models with unstable gradients
  * RNN and transformer training
* **Verification:** Gradient norms should stay below threshold

### Solution 3: Fix Mixed Precision Configuration
* **Quick Fix:** Disable AMP temporarily
* **Permanent Fix:** Use PyTorch native AMP with proper loss scaling
* **Steps:**
  1. Enable `torch.cuda.amp.GradScaler`
  2. Scale loss before backward pass
  3. Unscale gradients before clipping
* **Tradeoffs:**
  * Slightly more complex code
  * May reduce throughput
* **Performance Impact:** 5-10% throughput reduction
* **Difficulty:** Medium
* **Works For:**
  * Mixed precision training
  * Large batch training
* **Verification:** No NaN with AMP enabled

---

## Verification Checklist

* **Check:** No NaN in loss values
  * **Description:** Training completes without numerical errors
* **Check:** Gradient norms stable
  * **Description:** Gradient norms stay within reasonable bounds
* **Check:** Model converges
  * **Description:** Loss decreases over epochs
* **Check:** Validation metrics improve
  * **Description:** Model quality improves on validation set

---

## Prevention

### Development Practices
* Start with conservative learning rates (1e-5 to 1e-4)
* Use gradient clipping by default
* Profile loss values before scaling to full training

### Production Practices
* Set up alerts for NaN/inf in training metrics
* Use learning rate schedulers with automatic adjustment
* Implement automatic restart on numerical instability

### Monitoring Practices
* Log gradient norms every step
* Track loss distribution over time
* Set up early stopping on NaN detection

### Coding Habits
* Always check for NaN in custom loss functions
* Use `torch.clamp` for extreme values
* Implement gradient checking in training loops

---

## Common Misconceptions

* **Misconception:** NaN always means the model is broken
  * **Reality:** Often caused by learning rate or data issues, not model architecture
* **Misconception:** Gradient clipping always fixes exploding gradients
  * **Reality:** It's a band-aid; root cause should be addressed
* **Misconception:** Lower learning rate always helps
  * **Reality:** Too low can cause slow convergence or getting stuck

---

## False Positive Cases

* **Case:** Loss plateau (not NaN)
  * **Why It Looks Similar:** Training appears stuck
  * **How To Distinguish:** Loss is finite but not decreasing
* **Case:** Validation loss increase
  * **Why It Looks Similar:** Model appears to diverge
  * **How To Distinguish:** Training loss is stable, validation is increasing
* **Case:** Logging error
  * **Why It Looks Similar:** NaN appears in logs
  * **How To Distinguish:** Actual loss values are valid, logging format is wrong

---

## Escalation Paths

* **Path:** Learning Rate Range Test
  * **When To Use:** Need to find optimal learning rate
  * **Tradeoffs:**
    * Requires additional training run
    * May not generalize across batch sizes
* **Path:** Advanced Optimizers (Lion, Sophia)
  * **When To Use:** Standard optimizers unstable
  * **Tradeoffs:**
    * Less battle-tested
    * May have different hyperparameters
* **Path:** Distributed Training with Gradient Averaging
  * **When To Use:** Single GPU training unstable
  * **Tradeoffs:**
    * Adds infrastructure complexity
    * Network overhead

---

## Further Study

### Research Papers
* "On Large-Batch Training of LLMs" - Google Research
* "Understanding the Difficulty of Training Transformers" - OpenAI
* "Gradient Clipping in Deep Learning" - Various authors

### Official Documentation
* PyTorch Training Best Practices
* TensorFlow Mixed Precision Guide
* Hugging Face Training Documentation

### Engineering Blogs
* "Debugging NaN in Deep Learning" - PyTorch Blog
* "LLM Training Stability Guide" - Hugging Face

### Videos
* "Training Stability Deep Dive" - Conference talks

---

## Suggested Meta

* **Tags:** training, debugging, nan, gradients, loss, stability
* **Aliases:** nan-loss, exploding-gradients, training-instability
* **Keywords:** pytorch, tensorflow, mixed-precision, gradient-clipping, learning-rate
* **Search Tokens:** nan loss, exploding gradients, training instability, gradient clipping
* **Difficulty:** Advanced
* **Domain:** deep-learning
* **Engineering Area:** training, optimization
* **Estimated Reading Time:** 25-30 minutes
* **Prerequisites:** pytorch, training-loop
* **Recommended Next:** oom-training, tokenizer-mismatch
* **Cross-Links:**
  * related_packages: pytorch, tensorflow
  * related_workflows: fine-tune-llm-lora-qlora
  * related_patterns: gradient-accumulation, mixed-precision, training-loop
  * related_models: llama, mistral

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
* `id` - Use "nan-loss-exploding-gradients"
* `title` - "NaN Loss / Exploding Gradients"
* `slug` - "nan-loss-exploding-gradients"
* `description` - Brief description of the debug guide
* `name` - "NaN Loss / Exploding Gradients"
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