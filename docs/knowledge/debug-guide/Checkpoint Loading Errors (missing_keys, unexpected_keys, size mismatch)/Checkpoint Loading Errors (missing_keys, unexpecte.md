<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Checkpoint Loading Errors (missing_keys, unexpected_keys, size mismatch)

## Overview

Checkpoint load failures usually come from a mismatch between the saved parameter graph and the target module graph, not from the checkpoint file itself. The fastest path is to compare key sets, tensor shapes, and wrapper conventions such as DDP prefixes or sharded checkpoint formats before attempting any remediation.[^1][^2][^3]

## Problem

During model initialization or training resumption, loading a saved state dict fails due to key naming mismatches, missing parameters, or tensor shape incompatibilities, preventing weight restoration and blocking training or inference.[^2][^3][^1]

## Overview Card

* **Severity:** Critical.
* **Frequency:** Common.
* **Typical Stage:** Training Initialization / Resume.
* **Estimated Fix Time:** 30-120 min.
* **Production Impact:** High.


## Quick Identification

* **Check:** `load_state_dict()` raises `RuntimeError` with `missing_keys`.
    * **Description:** Checkpoint is missing parameters present in the model.[^3][^1]
* **Check:** `load_state_dict()` raises `RuntimeError` with `unexpected_keys`.
    * **Description:** Checkpoint contains parameters not present in the model.[^1][^3]
* **Check:** `load_state_dict()` raises `RuntimeError` with `size mismatch`.
    * **Description:** Checkpoint tensor shape differs from the model parameter shape.[^3][^1]
* **Check:** Model loads with `strict=False` but outputs are wrong.
    * **Description:** Silent partial load leaves some layers at initialization.[^4][^5]


## Symptoms

### Symptom 1: Missing Keys Error

* **Description:** `RuntimeError` lists keys present in the model but absent from the checkpoint state dict.
* **Error Message:** `RuntimeError: Error(s) in loading state_dict: Missing key(s) in state_dict: "layer.weight", "layer.bias"`.[^1][^3]
* **Where Appears:** `model.load_state_dict(checkpoint)`, `from_pretrained()`.[^3][^1]
* **Frequency:** Often.


### Symptom 2: Unexpected Keys Error

* **Description:** `RuntimeError` lists keys present in the checkpoint but absent from the model.
* **Error Message:** `RuntimeError: Error(s) in loading state_dict: Unexpected key(s) in state_dict: "module.layer.weight"`.[^1][^3]
* **Where Appears:** `model.load_state_dict(checkpoint)`, distributed training resume.[^2][^1]
* **Frequency:** Often.


### Symptom 3: Size Mismatch Error

* **Description:** Tensor shape in the checkpoint does not match the model parameter shape.
* **Error Message:** `RuntimeError: Error(s) in loading state_dict: size mismatch for layer.weight: copying a param with shape torch.Size([768, 512]) from checkpoint, the shape in current model is torch.Size([1024, 512])`.[^3][^1]
* **Where Appears:** Architecture modifications, vocabulary extensions, pruning.[^1][^3]
* **Frequency:** Often.


### Symptom 4: Silent Partial Load

* **Description:** Checkpoint loads with `strict=False`, but some layers retain random initialization.
* **Error Message:** No explicit error; model outputs are degraded or random.[^5][^4]
* **Where Appears:** Inference, evaluation, fine-tuning start.[^4][^5]
* **Frequency:** Sometimes.


## Root Causes

### Root Cause 1: DDP `module.` Prefix Mismatch

* **Probability:** High.
* **Explanation:** `DistributedDataParallel` wraps the model in a `module.` namespace; a checkpoint saved from DDP includes that prefix, and loading into a non-DDP model produces key mismatches.[^3][^1]
* **Recognition Clues:**
    * Unexpected keys all start with `module.`.
    * Checkpoint was saved from DDP training and loaded for single-GPU inference.
    * `missing_keys` and `unexpected_keys` are symmetric with and without `module.`.[^1][^3]
* **Typical Environment:** Distributed training checkpoints loaded for single-GPU inference, DDP to non-DDP transitions.[^2][^1]


### Root Cause 2: Architecture Modification Without Checkpoint Adaptation

* **Probability:** High.
* **Explanation:** The model structure changed after the checkpoint was saved, so the state dict no longer matches the parameter graph.[^3][^1]
* **Recognition Clues:**
    * `size mismatch` on specific modified layers.
    * Missing keys for newly added layers.
    * Model config differs from checkpoint config, such as `hidden_size` changes.[^1][^3]
* **Typical Environment:** Fine-tuning with custom heads, pruning, distillation, progressive resizing.[^3][^1]


### Root Cause 3: Sharded vs. Full State Dict Mismatch

* **Probability:** Medium.
* **Explanation:** FSDP or DeepSpeed may save sharded checkpoints per rank, but the loader expects a full state dict, or the reverse.[^6][^2]
* **Recognition Clues:**
    * Checkpoint directory contains multiple rank-suffixed `.pt` files.
    * `load_state_dict()` fails with file-not-found or partial key errors.
    * World size differs between save and load.[^6][^2]
* **Typical Environment:** FSDP with sharded state dicts, DeepSpeed ZeRO-3, multi-node training resume.[^6][^2]


### Root Cause 4: Optimizer State Mismatch on Resume

* **Probability:** Medium.
* **Explanation:** Model weights load successfully, but optimizer state dict keys or parameter groups no longer match the current training setup.[^1][^3]
* **Recognition Clues:**
    * `optimizer.load_state_dict()` fails after the model loads.
    * Errors mention `param_groups` or `state`.
    * Scheduler state no longer matches the current step count.[^3][^1]
* **Typical Environment:** Resume after hyperparameter changes, optimizer swaps, warm restarts.[^1][^3]


### Root Cause 5: Framework Version Migration

* **Probability:** Medium.
* **Explanation:** Framework upgrades can change state dict conventions, hook behavior, or serialization expectations across versions.[^7][^3]
* **Recognition Clues:**
    * Missing keys follow a systematic naming pattern.
    * Checkpoint was saved with an older framework version.
    * Release notes or migration guidance mention state dict behavior changes.[^7][^3]
* **Typical Environment:** PyTorch 1.x to 2.x migrations, Transformers 3.x to 4.x upgrades, model hub downloads with outdated format.[^3][^1]


### Root Cause 6: Adapter or LoRA Checkpoint with Wrong Base Model

* **Probability:** Low.
* **Explanation:** A PEFT adapter checkpoint is paired with a different base model architecture, so adapter and base keys do not align.[^1][^3]
* **Recognition Clues:**
    * `load_adapter()` fails with missing keys.
    * `base_model_name_or_path` differs from the loaded base.
    * LoRA ranks or target modules do not match.[^3][^1]
* **Typical Environment:** Multi-adapter serving, adapter merging, cross-model adapter transfer.[^1][^3]


### Root Cause 7: Corrupted or Partial Checkpoint File

* **Probability:** Low.
* **Explanation:** The checkpoint write was interrupted, producing a truncated or corrupted file that cannot be read correctly.[^3][^1]
* **Recognition Clues:**
    * File size is unexpectedly small.
    * `torch.load()` raises `pickle.UnpicklingError` or `EOFError`.
    * The checkpoint was written before a crash or preemption.[^1][^3]
* **Typical Environment:** Spot instances, preemptible VMs, checkpointing under memory pressure.[^3][^1]


## Investigation Checklist

* **Check:** Check checkpoint key names vs. model keys.
    * **Description:** Compare `checkpoint.keys()` with `model.state_dict().keys()`.[^1][^3]
* **Check:** Check for `module.` prefix discrepancy.
    * **Description:** Verify whether the checkpoint has a `module.` wrapper and the target model does not, or vice versa.[^3][^1]
* **Check:** Check model config against checkpoint config.
    * **Description:** Compare `model.config` with the saved config for architecture divergence.[^1][^3]
* **Check:** Check checkpoint sharding status.
    * **Description:** Determine whether the checkpoint is sharded via FSDP or DeepSpeed, or stored as a full state dict.[^2][^6]
* **Check:** Check framework versions at save vs. load.
    * **Description:** Compare PyTorch and Transformers versions across save and load events.[^3][^1]
* **Check:** Check optimizer state dict compatibility.
    * **Description:** If resuming training, verify the optimizer state matches the model parameter graph.[^1][^3]
* **Check:** Check checkpoint file integrity.
    * **Description:** Verify file size and attempt `torch.load()` before attaching it to a model.[^3][^1]


## Diagnostic Commands

### Command 1: Compare state dict keys

* **Purpose:** Identify exact key differences between checkpoint and model.
* **Command:** `python -c "ckpt = torch.load('checkpoint.pt'); model_keys = set(model.state_dict().keys()); ckpt_keys = set(ckpt.keys()); print(f'Missing: {model_keys - ckpt_keys}'); print(f'Unexpected: {ckpt_keys - model_keys}')"`
* **Expected Output:** Empty sets for an exact match.
* **Interpretation:** Non-empty sets indicate key naming or architecture mismatch.[^1][^3]


### Command 2: Inspect checkpoint metadata

* **Purpose:** Determine checkpoint format and saving context.
* **Command:** `python -c "ckpt = torch.load('checkpoint.pt', map_location='cpu'); print(ckpt.keys() if isinstance(ckpt, dict) else type(ckpt)); print(f'Model keys: {len(ckpt.get(\"model\", ckpt))}')"`
* **Expected Output:** A dictionary with `model`, `optimizer`, and `scheduler` keys for training checkpoints.
* **Interpretation:** Unexpected structure indicates a custom checkpoint format or corruption.[^3][^1]


### Command 3: Check tensor shapes

* **Purpose:** Identify specific layers with shape mismatches.
* **Command:** `python -c "for k in ckpt: if k in model.state_dict(): print(f'{k}: ckpt={ckpt[k].shape}, model={model.state_dict()[k].shape}')"`
* **Expected Output:** Matching shapes for all shared keys.
* **Interpretation:** Mismatched shapes indicate architecture modification.[^1][^3]


### Command 4: Verify checkpoint file integrity

* **Purpose:** Detect truncated or corrupted checkpoint files.
* **Command:** `python -c "import os; size = os.path.getsize('checkpoint.pt'); print(f'Size: {size} bytes'); ckpt = torch.load('checkpoint.pt', map_location='cpu'); print('Load OK')"`
* **Expected Output:** A reasonable file size and no exceptions.
* **Interpretation:** `EOFError` or `UnpicklingError` indicates corruption.[^3][^1]


## Diagnostic Tests

### Test 1: Prefix stripping test

* **Purpose:** Determine whether `module.` prefixing is the cause.
* **Test:** Strip `module.` from checkpoint keys and attempt reload.
* **Command:** `python -c "ckpt = torch.load('checkpoint.pt'); stripped = {k.replace('module.', ''): v for k, v in ckpt.items()}; model.load_state_dict(stripped, strict=False)"`
* **Expected Result:** Load succeeds with no missing or unexpected keys.
* **Interpretation:** If load succeeds, DDP prefixing was the issue.
* **Next Action:** Save with `model.module.state_dict()` in future.[^1][^3]


### Test 2: Config diff test

* **Purpose:** Identify architecture changes between checkpoint and model.
* **Test:** Compare saved config with current model config.
* **Command:** `python -c "import json; saved_cfg = json.load(open('config.json')); curr_cfg = model.config.to_dict(); diff = {k: (saved_cfg.get(k), curr_cfg.get(k)) for k in set(saved_cfg) | set(curr_cfg) if saved_cfg.get(k) != curr_cfg.get(k)}; print(diff)"`
* **Expected Result:** Empty diff for identical configs.
* **Interpretation:** Non-empty diff shows architecture divergence causing size mismatch.
* **Next Action:** Revert config changes or implement selective weight loading.[^3][^1]


### Test 3: Partial load verification

* **Purpose:** Check whether silent partial load is occurring with `strict=False`.
* **Test:** Load with `strict=False` and inspect missing and unexpected keys.
* **Command:** `python -c "missing, unexpected = model.load_state_dict(ckpt, strict=False); print(f'Missing: {len(missing)}, Unexpected: {len(unexpected)}'); print(f'Missing layers: {missing}')"`
* **Expected Result:** Empty missing and unexpected lists.
* **Interpretation:** Non-empty lists indicate layers using random initialization.
* **Next Action:** Fix key mapping or explicitly initialize missing layers.[^5][^4]


## Decision Tree

* **Question:** Does the error mention `Missing key(s) in state_dict`?
    * **Yes:**
        * **Question:** Do missing keys follow the pattern `module.X` while the model has `X`?
            * **Yes:**
                * **Result:** DDP `module.` prefix mismatch — strip the prefix or load into the DDP wrapper.[^1][^3]
            * **No:**
                * **Question:** Are missing keys newly added layers that are not in the checkpoint?
                    * **Yes:**
                        * **Result:** Architecture modification — initialize missing layers manually or use `strict=False` with explicit init.[^3][^1]
                    * **No:**
                        * **Question:** Did the framework version change between save and load?
                            * **Yes:**
                                * **Result:** Version migration naming change — implement key remapping.[^7][^1][^3]
                            * **No:**
                                * **Result:** Corrupted or wrong checkpoint — verify the checkpoint source.[^1][^3]
    * **No:**
        * **Question:** Does the error mention `Unexpected key(s) in state_dict`?
            * **Yes:**
                * **Question:** Do unexpected keys follow the pattern `module.X`?
                    * **Yes:**
                        * **Result:** Loading a DDP checkpoint into a non-DDP model — strip `module.` prefix.[^3][^1]
                    * **No:**
                        * **Result:** Checkpoint has extra parameters such as optimizer state or EMA — filter keys or load with `strict=False`.[^1][^3]
            * **No:**
                * **Question:** Does the error mention `size mismatch`?
                    * **Yes:**
                        * **Question:** Is the mismatch in the embedding layer?
                            * **Yes:**
                                * **Result:** Vocabulary size change — resize embeddings or remap token IDs.[^3][^1]
                            * **No:**
                                * **Result:** Architecture dimension change such as `hidden_size` or `num_heads` — load compatible layers only and reinitialize changed layers.[^1][^3]
                    * **No:**
                        * **Question:** Does `torch.load()` itself fail?
                            * **Yes:**
                                * **Result:** Checkpoint corruption — restore from backup or retrain.[^3][^1]
                            * **No:**
                                * **Result:** Unknown issue — inspect checkpoint structure manually.[^1][^3]


## Solutions

### Solution 1: Strip DDP `module.` Prefix

* **Quick Fix:** Remove the `module.` prefix from checkpoint keys before loading.[^3][^1]
* **Permanent Fix:** Save checkpoints from `model.module.state_dict()` when using DDP.[^1][^3]
* **Steps:**

1. Identify the prefix: `all(k.startswith('module.') for k in checkpoint.keys())`.
2. Strip the prefix: `checkpoint = {k.replace('module.', ''): v for k, v in checkpoint.items()}`.
3. Load the stripped checkpoint: `model.load_state_dict(checkpoint)`.
4. For future runs, modify the save hook to unwrap DDP before state dict extraction.[^3][^1]
* **Tradeoffs:**
    * One-time key transformation is fast.
    * Forgetting to strip causes repeated failures.
* **Performance Impact:** None; metadata-only transformation.
* **Difficulty:** Easy.
* **Works For:**
    * DDP to non-DDP checkpoint transfers.
    * Single-GPU inference from distributed training checkpoints.[^2][^1]
* **Verification:** `model.load_state_dict(checkpoint, strict=True)` succeeds.[^1][^3]


### Solution 2: Load with `strict=False` and Initialize Missing Layers

* **Quick Fix:** Use `strict=False` and manually initialize layers not present in the checkpoint.[^5][^1]
* **Permanent Fix:** Implement selective loading with explicit initialization logic.[^3][^1]
* **Steps:**

1. Load with permissive mode: `missing, unexpected = model.load_state_dict(ckpt, strict=False)`.
2. Identify missing layers: `print(missing)`.
3. Initialize missing layers with the model’s default init or module-specific init.
4. For changed dimensions, load compatible sub-tensors via slicing or interpolation.
5. Log loaded versus initialized parameters for audit.[^4][^5]
* **Tradeoffs:**
    * Silent failures if unexpected keys are actually important.
    * New layers start from scratch and may need more training.
* **Performance Impact:** None for loading; may need longer fine-tuning.
* **Difficulty:** Medium.
* **Works For:**
    * Architecture modifications.
    * Progressive resizing or pruning.
    * Transfer learning with custom top layers.[^1][^3]
* **Verification:** All model parameters have non-zero gradients after the first backward pass.[^8][^4]


### Solution 3: Remap Keys for Framework Version Migration

* **Quick Fix:** Create a key mapping dictionary and transform the checkpoint.[^7][^3]
* **Permanent Fix:** Use built-in migration utilities or conversion scripts where provided.[^3][^1]
* **Steps:**

1. Identify naming changes from release notes.
2. Build a mapping dictionary such as `key_map = {'old_name': 'new_name', ...}`.
3. Transform the checkpoint using that mapping.
4. Handle split or merged parameters such as combined QKV.
5. Validate shapes after remapping.[^7][^1][^3]
* **Tradeoffs:**
    * Requires understanding of framework-internal naming conventions.
    * May not cover all edge cases in custom architectures.
* **Performance Impact:** None; one-time transformation.
* **Difficulty:** Medium.
* **Works For:**
    * PyTorch version migrations.
    * Transformers library upgrades.
    * Custom model format conversions.[^1][^3]
* **Verification:** All keys load without missing or unexpected entries after remapping.[^3][^1]


### Solution 4: Convert Sharded to Full State Dict

* **Quick Fix:** Use FSDP full-state-dict settings before loading.[^6][^2]
* **Permanent Fix:** Standardize on full state dicts for checkpoints that must move across environments.[^6][^2]
* **Steps:**

1. For FSDP, configure full-state-dict behavior before saving or loading.
2. Save the resulting full state dict.
3. Load it with standard `model.load_state_dict()`.
4. For DeepSpeed, use the provided conversion script to obtain a consolidated model checkpoint.[^2][^6]
* **Tradeoffs:**
    * Full state dict requires enough CPU RAM to hold the entire model.
    * Sharded checkpoints are faster to save and load in distributed settings.[^6][^2]
* **Performance Impact:** Higher memory usage during save and load; no training impact.[^2][^6]
* **Difficulty:** Medium.
* **Works For:**
    * FSDP or DeepSpeed checkpoints loaded on a single GPU.
    * Cross-world-size training resume.
    * Model extraction for inference deployment.[^6][^2]
* **Verification:** A single checkpoint loads successfully on a non-distributed setup.[^2][^6]


### Solution 5: Load Compatible Layers Only with Slicing

* **Quick Fix:** Load matching shapes and slice or interpolate mismatched tensors.[^1][^3]
* **Permanent Fix:** Implement custom loading logic for known architecture variants.[^3][^1]
* **Steps:**

1. Iterate over checkpoint keys.
2. If a shape matches, copy it directly.
3. If a shape differs, slice the overlapping dimensions or interpolate where appropriate.
4. For attention heads, reshape and load compatible subsets.
5. Log which layers were sliced versus fully loaded.[^1][^3]
* **Tradeoffs:**
    * Complex and error-prone.
    * Sliced layers may not preserve full representational capacity.
* **Performance Impact:** None for loading; may affect model capacity.
* **Difficulty:** Hard.
* **Works For:**
    * Embedding resizing.
    * Changing `num_attention_heads` while keeping `hidden_size`.
    * Progressive model growth.[^3][^1]
* **Verification:** Loaded layers have expected values and newly sized dimensions are properly initialized.[^1][^3]


## Verification Checklist

* **Check:** `model.load_state_dict(checkpoint, strict=True)` succeeds.
    * **Description:** Checkpoint loads without errors.[^3][^1]
* **Check:** All model parameters have non-zero values.
    * **Description:** No layers remain at initialization.[^8][^4]
* **Check:** Model produces the same output as before save.
    * **Description:** Forward pass on a fixed input matches pre-save output.[^4][^1]
* **Check:** Optimizer state loads correctly if resuming training.
    * **Description:** `optimizer.load_state_dict()` succeeds and step count is preserved.[^1][^3]
* **Check:** Training loss matches the pre-checkpoint trajectory.
    * **Description:** Loss curve is continuous across the checkpoint boundary.[^8][^4]


## Prevention

### Development Practices

* Always save checkpoints from unwrapped models, such as `model.module.state_dict()` in DDP.[^3][^1]
* Include model config alongside the checkpoint for architecture verification.[^1][^3]
* Version-pin PyTorch and Transformers in training environments.[^3][^1]
* Use `safetensors` when corruption resistance is important.[^1][^3]


### Production Practices

* Save both full and sharded checkpoints if cross-environment loading is expected.[^6][^2]
* Validate checkpoint integrity immediately after save by attempting a reload in the same job.[^3][^1]
* Store checkpoint metadata such as framework versions, git commit, and config hash.[^1][^3]
* Use `torch.save()` with robust serialization settings appropriate to your PyTorch version.[^3][^1]


### Monitoring Practices

* Alert when checkpoint load fails in the inference pipeline.[^4][^1]
* Track checkpoint save success and failure rates.[^8][^4]
* Monitor checkpoint file sizes for anomalies such as unexpected shrinkage.[^4][^1]
* Log key counts and parameter counts at save and load time.[^1][^3]


### Coding Habits

* Never use `strict=False` without explicitly inspecting missing and unexpected keys.[^5][^4]
* Implement checkpoint loading wrappers that validate config compatibility.[^3][^1]
* Add `try/except` around `load_state_dict()` with informative error messages.[^1][^3]
* Use `model.save_pretrained()` and `from_pretrained()` for Hugging Face models instead of manual state dict management when applicable.[^3][^1]


## Common Misconceptions

* **Misconception:** `strict=False` is a safe way to load any checkpoint.
    * **Reality:** It silently skips mismatches, so layers may remain randomly initialized without warning.[^5][^4]
* **Misconception:** DDP checkpoints are incompatible with single-GPU inference.
    * **Reality:** Only the `module.` prefix differs, and it can be stripped or avoided by saving the unwrapped model.[^1][^3]
* **Misconception:** Checkpoint corruption always causes immediate load failure.
    * **Reality:** Partial corruption may load but still produce wrong outputs, so outputs should be validated after load.[^8][^4]


## False Positive Cases

* **Case:** Intentional partial load for layer freezing.
    * **Why It Looks Similar:** Missing keys appear during loading.
    * **How To Distinguish:** Code explicitly filters keys for frozen layers and sets `requires_grad=False`.
* **Case:** EMA weights in the checkpoint are not needed for inference.
    * **Why It Looks Similar:** Unexpected keys such as `ema_model.*`.
    * **How To Distinguish:** EMA keys are expected and can be filtered out or used for inference.
* **Case:** Quantized model loading into a non-quantized architecture.
    * **Why It Looks Similar:** Size mismatch or unexpected keys.
    * **How To Distinguish:** Keys have quantization-specific suffixes and require a matching quantization config.


## Escalation Paths

* **Path:** Reconstruct from Raw Weights.
    * **When To Use:** The checkpoint is corrupted but raw parameter files still exist.
    * **Tradeoffs:**
        * Requires manual tensor reconstruction.
        * May lose optimizer state and training metadata.
* **Path:** Retrain from Earlier Checkpoint.
    * **When To Use:** No recoverable state exists and corruption is severe.
    * **Tradeoffs:**
        * Loss of training progress.
        * May require reproducing hyperparameters.
* **Path:** Contact Framework Support.
    * **When To Use:** A bug is suspected in `load_state_dict()` or `from_pretrained()`.
    * **Tradeoffs:**
        * Requires a minimal reproducible example.
        * Fix may not be available until a later release.


## Further Study

## Suggested Meta

* **Tags:** training, debugging, checkpoint, state-dict, distributed-training, pytorch, huggingface.
* **Aliases:** checkpoint-load-error, missing-keys, unexpected-keys, size-mismatch, state-dict-error.
* **Keywords:** checkpoint, load_state_dict, missing_keys, unexpected_keys, size mismatch, DDP, FSDP, DeepSpeed, module prefix.
* **Search Tokens:** checkpoint loading error, missing keys state dict, unexpected keys checkpoint, size mismatch model weights, DDP module prefix.
* **Difficulty:** Advanced.
* **Domain:** deep-learning.
* **Engineering Area:** training, infrastructure.
* **Estimated Reading Time:** 25-30 minutes.
* **Prerequisites:** pytorch-basics, distributed-training.
* **Recommended Next:** nan-loss-exploding-gradients, oom-training, gpu-not-detected.
* **Cross-Links:**
    * related_packages: pytorch, transformers, deepspeed, accelerate.
    * related_workflows: fine-tune-llm-lora-qlora, distributed-training-ddp.
    * related_patterns: gradient-accumulation, mixed-precision, checkpointing.
    * related_models: llama, mistral, gpt2.
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^9]</span>

<div align="center">⁂</div>

[^1]: https://docs.pytorch.org/tutorials/beginner/saving_loading_models.html

[^2]: https://docs.pytorch.org/docs/stable/fsdp.html

[^3]: https://docs.pytorch.org/tutorials/recipes/recipes/module_load_state_dict_tips.html

[^4]: https://ieeexplore.ieee.org/document/10589839/

[^5]: https://discuss.pytorch.org/t/does-model-load-state-dict-strict-false-ignore-new-parameters-introduced-in-my-models-constructor/84539

[^6]: https://docs.pytorch.org/tutorials/intermediate/FSDP_tutorial.html

[^7]: https://github.com/pytorch/pytorch/issues/75287

[^8]: https://ieeexplore.ieee.org/document/10824945/

[^9]: https://arxiv.org/abs/2508.04035

[^10]: https://arxiv.org/abs/2310.14400

[^11]: https://arxiv.org/abs/2304.14226

[^12]: https://arxiv.org/abs/2311.16670

[^13]: https://www.mdpi.com/2076-3417/15/8/4263

[^14]: https://dl.acm.org/doi/10.1145/3798048

[^15]: https://docs.pytorch.org/tutorials/beginner/basics/saveloadrun_tutorial.html

[^16]: https://theneuralbase.com/pytorch/learn/intermediate/model-load-state-dict-restoring-weights/

[^17]: https://torch.mlverse.org/docs/reference/load_state_dict.html

[^18]: https://notes.kodekloud.com/docs/PyTorch/Building-and-Training-Models/Saving-and-loading-models/page

