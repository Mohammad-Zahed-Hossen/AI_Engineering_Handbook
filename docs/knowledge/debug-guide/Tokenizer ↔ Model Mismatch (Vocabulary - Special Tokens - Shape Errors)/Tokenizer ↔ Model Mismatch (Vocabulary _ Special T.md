<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Tokenizer ↔ Model Mismatch (Vocabulary / Special Tokens / Shape Errors)

## Overview

Tokenizer-model mismatches usually surface as hard runtime failures during embedding lookup or checkpoint load, or as silent semantic corruption when special-token IDs and vocabulary mappings drift out of sync. The fastest reliable diagnosis is to compare tokenizer size, model embedding rows, and special-token IDs, then verify that both artifacts come from the same checkpoint revision and compatible tokenizer format.[^2][^3][^4]

## Problem

During LLM training or inference, the tokenizer produces token IDs that the model cannot process due to vocabulary size mismatch, special token ID misalignment, or embedding dimension incompatibility, resulting in runtime errors or nonsensical outputs.[^3][^4]

## Overview Card

* **Severity:** High.
* **Frequency:** Common.
* **Typical Stage:** Training Initialization / Inference.
* **Estimated Fix Time:** 30-120 min.
* **Production Impact:** High.


## Quick Identification

* **Check:** `tokenizer.vocab_size` differs from `model.config.vocab_size`.
    * **Description:** Compare vocabulary sizes; mismatch indicates incompatible tokenizer-model pair.[^4][^2]
* **Check:** Token IDs exceed model embedding dimensions.
    * **Description:** `max(tokenizer.encode(text)) >= model.get_input_embeddings().weight.shape[^0]`.[^2][^4]
* **Check:** Special token IDs differ between tokenizer and model config.
    * **Description:** Compare `tokenizer.pad_token_id`, `bos_token_id`, `eos_token_id` with `model.config` equivalents.[^4][^2]


## Symptoms

### Symptom 1: IndexError / CUDA Device-Side Assert

* **Description:** Forward pass crashes with index out of bounds in the embedding layer or a CUDA assert triggered by an invalid token ID.[^2][^4]
* **Error Message:** `IndexError: index out of range in self` or `CUDA error: device-side assert triggered`.[^4]
* **Where Appears:** `model(input_ids)` forward pass, training step.[^4]
* **Frequency:** Always, when mismatch exists.[^2][^4]


### Symptom 2: Embedding Shape Mismatch on Load

* **Description:** Loading state dict fails because saved embedding weights have a different shape than the model's embedding layer.[^2][^4]
* **Error Message:** `RuntimeError: Error(s) in loading state_dict: size mismatch for model.embed_tokens.weight`.[^4]
* **Where Appears:** `model.load_state_dict()`, checkpoint restoration.[^4]
* **Frequency:** Often.[^4]


### Symptom 3: Gibberish Generation Despite Correct Prompt

* **Description:** Model generates coherent-looking but semantically wrong tokens; vocabulary mapping is shifted or corrupted.[^2][^4]
* **Error Message:** No explicit error; outputs are nonsensical.[^4]
* **Where Appears:** `model.generate()`, inference pipeline.[^4]
* **Frequency:** Often.[^2][^4]


### Symptom 4: Special Token Recognition Failure

```
* **Description:** Model does not recognize `<pad>`, `<s>`, `</s>`, or other special tokens; they are treated as ordinary subwords.[^2][^4]
```

* **Error Message:** No explicit error; attention mask or generation length is wrong.[^4]
* **Where Appears:** Padding, generation stopping, chat template formatting.[^4]
* **Frequency:** Sometimes.[^4]


## Root Causes

### Root Cause 1: Vocabulary Size Mismatch

* **Probability:** High.
* **Explanation:** The tokenizer vocabulary was extended but the model embedding matrix was not resized, so token IDs map to non-existent embedding rows.[^2][^4]
* **Recognition Clues:**
    * `tokenizer.vocab_size > model.config.vocab_size`.
    * Error occurs immediately on the first forward pass with tokenized input.
    * Mismatch appears after `tokenizer.add_tokens()` or `tokenizer.add_special_tokens()`.[^4]
* **Typical Environment:** Fine-tuning with domain-specific vocabulary, multilingual model adaptation, code model training.[^4]


### Root Cause 2: Cross-Model Tokenizer Loading

* **Probability:** High.
* **Explanation:** `AutoTokenizer.from_pretrained()` loads tokenizer from checkpoint A while `AutoModel.from_pretrained()` loads weights from checkpoint B, so vocabulary mappings differ.[^3][^4]
* **Recognition Clues:**
    * Tokenizer and model are loaded from different paths or repo IDs.
    * `tokenizer.name_or_path != model.name_or_path`.
    * Generation quality degrades after checkpoint swap.[^4]
* **Typical Environment:** Experiment tracking with mixed artifacts, manual checkpoint management, adapter or LoRA loading with base model mismatch.[^3][^4]


### Root Cause 3: Special Token ID Misalignment

* **Probability:** Medium.

```
* **Explanation:** Tokenizer assigns different IDs to `<pad>`, `<s>`, `</s>`, or `<unk>` than the model expects, so the model reads the wrong embeddings for those positions.[^2][^4]
```

* **Recognition Clues:**
    * `tokenizer.pad_token_id != model.config.pad_token_id`.
    * Generation does not stop at `eos_token_id`.
    * Padding is ignored because `pad_token_id` maps to a meaningful token in the model vocabulary.[^4]
* **Typical Environment:** Chat model fine-tuning, custom chat templates, legacy model conversion.[^4]


### Root Cause 4: Embedding Matrix Not Resized After Tokenizer Extension

* **Probability:** Medium.
* **Explanation:** Adding tokens increases vocabulary size, but `model.resize_token_embeddings()` was not called, leaving the embedding matrix with the old dimensions.[^2][^4]
* **Recognition Clues:**
    * `tokenizer.vocab_size` increased after `add_tokens()` but `model.config.vocab_size` did not.
    * Error appears only after tokenizer modification.
    * `model.get_input_embeddings().weight.shape[^0] < tokenizer.vocab_size`.[^4]
* **Typical Environment:** Continual pretraining, domain adaptation, instruction tuning with new special tokens.[^4]


### Root Cause 5: Legacy Tokenizer File with Updated Model

* **Probability:** Low.
* **Explanation:** An old `tokenizer.json` or `vocab.txt` is used with newer model weights, so vocabulary ordering or special-token handling diverges.[^3][^4]
* **Recognition Clues:**
    * The model repo contains multiple tokenizer files.
    * Loading occurs from local paths instead of the Hub.
    * The model was converted between formats.[^4]
* **Typical Environment:** Model format conversions, offline deployments with partial file copies, custom model merges.[^4]


### Root Cause 6: SentencePiece / BPE Vocabulary Alignment Error

* **Probability:** Low.
* **Explanation:** The underlying SentencePiece model file has different vocabulary than the tokenizer JSON config, so token conversion becomes non-idempotent.[^2][^4]
* **Recognition Clues:**
    * `sp_model.get_piece_size()` differs from `len(tokenizer.get_vocab())`.
    * Decoding differs from re-encoding the same text.
    * `convert_tokens_to_ids(convert_ids_to_tokens(id)) != id` for some IDs.[^4]
* **Typical Environment:** Custom SentencePiece training, vocabulary pruning, tokenizer merging from different sources.[^4]


## Investigation Checklist

* **Check:** Check vocabulary size alignment.
    * **Description:** Verify `tokenizer.vocab_size == model.config.vocab_size`.[^2][^4]
* **Check:** Check embedding matrix dimensions.
    * **Description:** Verify `model.get_input_embeddings().weight.shape[^0] == tokenizer.vocab_size`.[^4]
* **Check:** Check special token ID alignment.
    * **Description:** Compare `tokenizer.pad_token_id`, `bos_token_id`, `eos_token_id` with `model.config`.[^4]
* **Check:** Check tokenizer and model source paths.
    * **Description:** Verify both were loaded from the same checkpoint or compatible versions.[^3][^4]
* **Check:** Check for tokenizer modifications without embedding resize.
    * **Description:** Search code for `add_tokens` or `add_special_tokens` without `resize_token_embeddings()`.[^4]
* **Check:** Check SentencePiece model consistency.
    * **Description:** For SPM tokenizers, verify `sp_model` vocabulary matches JSON config.[^4]
* **Check:** Check round-trip encoding and decoding.
    * **Description:** Verify `tokenizer.decode(tokenizer.encode(text)) == text` for sample inputs.[^4]


## Diagnostic Commands

### Command 1: Verify vocabulary size alignment

* **Purpose:** Check if tokenizer and model have the same vocabulary size.
* **Command:** `python -c "from transformers import AutoTokenizer, AutoModel; t = AutoTokenizer.from_pretrained('model_name'); m = AutoModel.from_pretrained('model_name'); print(f'Tokenizer: {len(t)}, Model: {m.config.vocab_size}')"`
* **Expected Output:** Equal numbers.
* **Interpretation:** Mismatch indicates an incompatible tokenizer-model pair.[^3][^4]


### Command 2: Check embedding matrix shape

* **Purpose:** Verify the embedding layer can accommodate all token IDs.
* **Command:** `python -c "import torch; print(f'Embedding rows: {model.get_input_embeddings().weight.shape[^0]}')"`
* **Expected Output:** `Embedding rows: N` where `N >= max token ID`.
* **Interpretation:** If `N < tokenizer vocab size`, resize is needed.[^4]


### Command 3: Inspect special token IDs

* **Purpose:** Compare special token IDs between tokenizer and model config.
* **Command:** `python -c "print(f'Tokenizer pad: {tokenizer.pad_token_id}, Model pad: {model.config.pad_token_id}'); print(f'Tokenizer eos: {tokenizer.eos_token_id}, Model eos: {model.config.eos_token_id}')"`
* **Expected Output:** Matching IDs for all special tokens.
* **Interpretation:** Mismatch causes padding and generation boundary failures.[^4]


### Command 4: Test round-trip encoding

* **Purpose:** Verify tokenizer vocabulary mapping is consistent.
* **Command:** `python -c "text = 'Hello world'; ids = tokenizer.encode(text); decoded = tokenizer.decode(ids); print(f'Round-trip: {text == decoded}'); print(f'Max ID: {max(ids)}, Vocab: {tokenizer.vocab_size}')"`
* **Expected Output:** `Round-trip: True`, max ID less than vocab size.
* **Interpretation:** False or out-of-bounds IDs indicate vocabulary corruption.[^4]


## Diagnostic Tests

### Test 1: Vocabulary intersection test

* **Purpose:** Determine whether tokenizer vocabulary is a subset of model vocabulary.
* **Test:** Encode a sample corpus and check all IDs are within model embedding bounds.
* **Command:** `python -c "ids = tokenizer.encode(corpus, add_special_tokens=False); max_id = max(ids); embed_size = model.get_input_embeddings().weight.shape[^0]; print(f'Max ID: {max_id}, Embed size: {embed_size}, OK: {max_id < embed_size}')"`
* **Expected Result:** `OK: True`.
* **Interpretation:** `False` confirms vocabulary size mismatch.
* **Next Action:** Resize embeddings or reload a matching tokenizer.[^4]


### Test 2: Special token consistency test

* **Purpose:** Verify special tokens map to the same IDs in tokenizer and model.
* **Test:** Compare special token IDs and their decoded representations.

```
* **Command:** `python -c "for tok in ['<pad>', '<s>', '</s>', '<unk>']: tid = tokenizer.convert_tokens_to_ids(tok); mid = getattr(model.config, f'{tok.strip('<>')}_token_id', None); print(f'{tok}: tokenizer={tid}, model={mid}, match={tid==mid}')"`
```

* **Expected Result:** All tokens match.
* **Interpretation:** Mismatches indicate special token misalignment.
* **Next Action:** Synchronize special token IDs or update model config.[^4]


### Test 3: Embedding initialization verification

* **Purpose:** Check whether newly added tokens have valid embeddings.
* **Test:** Inspect mean and standard deviation of embedding weights for the new token range.
* **Command:** `python -c "emb = model.get_input_embeddings().weight; new_start = model.config.vocab_size - num_added; new_embs = emb[new_start:]; print(f'New embed mean: {new_embs.mean():.4f}, std: {new_embs.std():.4f}')"`
* **Expected Result:** Non-zero mean and standard deviation indicating initialized embeddings.
* **Interpretation:** Zero or NaN values indicate failed initialization.
* **Next Action:** Reinitialize new embeddings or re-run resize with proper init.[^4]


## Decision Tree

* **Question:** Does `tokenizer.vocab_size == model.config.vocab_size`?
    * **No:**
        * **Question:** Was tokenizer extended with `add_tokens()` or `add_special_tokens()`?
            * **Yes:**
                * **Result:** Embedding matrix not resized — call `model.resize_token_embeddings(len(tokenizer))`.[^4]
            * **No:**
                * **Result:** Cross-model tokenizer loading — reload tokenizer from the same checkpoint as model.[^3][^4]
    * **Yes:**
        * **Question:** Does forward pass crash with index error?
            * **Yes:**
                * **Question:** Are token IDs from encoding within embedding bounds?
                    * **Yes:**
                        * **Result:** SentencePiece or BPE alignment error — verify `sp_model` vs JSON config consistency.[^4]
                    * **No:**
                        * **Result:** Hidden vocabulary extension — check for `len(tokenizer) > tokenizer.vocab_size`.[^4]
            * **No:**
                * **Question:** Does generation produce gibberish?
                    * **Yes:**
                        * **Question:** Do special token IDs match between tokenizer and model config?
                            * **No:**
                                * **Result:** Special token misalignment — synchronize `pad_token_id`, `eos_token_id`, and `bos_token_id`.[^4]
                            * **Yes:**
                                * **Result:** Legacy tokenizer file — verify tokenizer files match model revision.[^4]
                    * **No:**
                        * **Result:** Model is functional; investigate other causes.


## Solutions

### Solution 1: Resize Token Embeddings After Vocabulary Extension

* **Quick Fix:** Call `model.resize_token_embeddings(len(tokenizer))` immediately after adding tokens.[^4]
* **Permanent Fix:** Wrap tokenizer extension in a utility that automatically resizes embeddings and initializes new tokens.[^4]
* **Steps:**

1. Identify added tokens: `num_added = tokenizer.add_tokens(new_tokens)`.
2. Resize embeddings: `model.resize_token_embeddings(len(tokenizer))`.
3. Initialize new embeddings: `model.get_input_embeddings().weight.data[-num_added:].normal_(mean=0.0, std=0.02)`.
4. Tie weights if applicable: `model.tie_weights()`.
5. Verify: `assert model.get_input_embeddings().weight.shape[^0] == len(tokenizer)`.
* **Tradeoffs:**
    * Increases model parameter count, with minor memory overhead.
    * New tokens start untrained and need sufficient training steps.
* **Performance Impact:** Negligible; only increases embedding matrix size.
* **Difficulty:** Easy.
* **Works For:**
    * Domain-specific vocabulary additions.
    * Multilingual token extensions.
    * Special token additions for instruction tuning.
* **Verification:** `model.get_input_embeddings().weight.shape[^0] == len(tokenizer)`.[^4]


### Solution 2: Reload Matching Tokenizer and Model

* **Quick Fix:** Load both tokenizer and model from the identical checkpoint path.[^3][^4]
* **Permanent Fix:** Use model cards and revision pinning to ensure tokenizer-model consistency.[^4]
* **Steps:**

1. Identify model checkpoint: `model_name_or_path`.
2. Load tokenizer from the same path: `AutoTokenizer.from_pretrained(model_name_or_path)`.
3. Verify alignment: `assert tokenizer.vocab_size == model.config.vocab_size`.
4. For adapters or LoRA, ensure base model and tokenizer come from the same base checkpoint.
5. Pin revision with `from_pretrained(..., revision="abc123")` for reproducibility.
* **Tradeoffs:**
    * May require re-downloading large tokenizer files.
    * Adapter training may need restart if the base model was wrong.
* **Performance Impact:** None; corrects mapping without architectural change.
* **Difficulty:** Easy.
* **Works For:**
    * Mixed checkpoint artifacts.
    * Experiment tracking errors.
    * Manual checkpoint management mistakes.
* **Verification:** `tokenizer.name_or_path == model.name_or_path` and vocab sizes match.[^3][^4]


### Solution 3: Synchronize Special Token IDs

* **Quick Fix:** Manually align special token IDs between tokenizer and model config.[^4]
* **Permanent Fix:** Use `tokenizer.save_pretrained()` and `model.config.save_pretrained()` to persist synchronized state.[^4]
* **Steps:**

1. Inspect current IDs: `tokenizer.pad_token_id`, `model.config.pad_token_id`.
2. Set tokenizer to match model: `tokenizer.pad_token_id = model.config.pad_token_id`.
3. Or set model to match tokenizer: `model.config.pad_token_id = tokenizer.pad_token_id`.
4. Repeat for `bos_token_id`, `eos_token_id`, and `unk_token_id`.
5. Update generation config: `model.generation_config.pad_token_id = tokenizer.pad_token_id`.
6. Save synchronized configs.
* **Tradeoffs:**
    * Changing model config may affect downstream uses.
    * Some models have hardcoded special-token assumptions in the forward pass.
* **Performance Impact:** None; metadata-only change.
* **Difficulty:** Easy.
* **Works For:**
    * Chat template mismatches.
    * Legacy model conversions.
    * Custom fine-tuning with changed special tokens.
* **Verification:** All special token IDs match and generation stops correctly at `eos_token_id`.[^4]


### Solution 4: Reinitialize Tokenizer from Model Hub

* **Quick Fix:** Delete local tokenizer cache and re-download from the Hugging Face Hub.[^3][^4]
* **Permanent Fix:** Use `snapshot_download` with explicit file filtering to ensure complete tokenizer files.[^4]
* **Steps:**

1. Clear cache: `rm -rf ~/.cache/huggingface/hub/models--model-name`.
2. Re-download: `AutoTokenizer.from_pretrained("org/model", force_download=True)`.
3. Verify file completeness: check for `tokenizer.json`, `tokenizer_config.json`, and `special_tokens_map.json`.
4. For SentencePiece, verify the `.model` file exists and matches the JSON config.
5. Compare SHA with model card metadata if available.
* **Tradeoffs:**
    * Requires internet access and re-download time.
    * Cache clearing affects all models from the same namespace.
* **Performance Impact:** None; one-time download cost.
* **Difficulty:** Easy.
* **Works For:**
    * Corrupted local tokenizer files.
    * Partial downloads.
    * Outdated cached tokenizer versions.
* **Verification:** Round-trip encoding works and file hashes match the Hub.[^3][^4]


### Solution 5: Merge Tokenizers with Vocabulary Alignment

* **Quick Fix:** Use the `tokenizers` library to merge vocabularies with explicit ID mapping.[^4]
* **Permanent Fix:** Train a new unified SentencePiece model on a combined corpus.[^4]
* **Steps:**

1. Extract vocabularies: `vocab_a = tokenizer_a.get_vocab()`, `vocab_b = tokenizer_b.get_vocab()`.
2. Create a merged vocabulary with stable ID assignment.
3. Map old IDs to new IDs for both tokenizers.
4. Re-embed model weights using an ID mapping matrix.
5. Save the new tokenizer and remapped model weights.
* **Tradeoffs:**
    * Complex implementation; requires custom mapping logic.
    * May lose subword segmentation efficiency.
* **Performance Impact:** None after one-time remapping.
* **Difficulty:** Hard.
* **Works For:**
    * Multi-model ensembles with a shared tokenizer.
    * Cross-lingual model merging.
    * Domain adaptation with incompatible base tokenizers.
* **Verification:** Both original tokenizers produce valid IDs in the merged vocabulary.[^4]


## Verification Checklist

* **Check:** `tokenizer.vocab_size == model.config.vocab_size`.
    * **Description:** Vocabulary sizes are aligned.[^2][^4]
* **Check:** `model.get_input_embeddings().weight.shape[^0] == len(tokenizer)`.
    * **Description:** Embedding matrix accommodates all tokenizer tokens.[^4]
* **Check:** Special token IDs match between tokenizer and model config.
    * **Description:** `pad`, `bos`, `eos`, `unk` IDs are synchronized.[^4]
* **Check:** Round-trip encoding and decoding is lossless.
    * **Description:** `tokenizer.decode(tokenizer.encode(text)) == text`.[^4]
* **Check:** Forward pass succeeds without index errors.
    * **Description:** Model can process tokenized inputs end to end.[^4]
* **Check:** Generation stops at the correct special token.
    * **Description:** `eos_token_id` triggers proper sequence termination.[^4]


## Prevention

### Development Practices

* Always load tokenizer and model from the identical checkpoint path.[^3][^4]
* Wrap `add_tokens()` calls with automatic `resize_token_embeddings()` in training scripts.[^4]
* Pin model revisions in production configs to prevent silent tokenizer updates.[^4]
* Run a vocabulary alignment check as the first step in training startup.[^4]


### Production Practices

* Validate `tokenizer.vocab_size == model.config.vocab_size` in CI/CD before deployment.[^2][^4]
* Version tokenizer files alongside model weights in the same artifact.
* Use the `transformers` pipeline abstraction only when it preserves tokenizer-model pairing.[^4]
* Log tokenizer and model checkpoint hashes at training start for audit.[^4]


### Monitoring Practices

* Alert when `len(tokenizer) != model.config.vocab_size` in training jobs.[^4]
* Track generation perplexity; sudden spikes can indicate vocabulary misalignment.[^4]
* Monitor for `device-side assert triggered` errors as an early indicator.[^2][^4]
* Compare training loss curves against baselines; flat loss with high norm can suggest embedding issues.[^4]


### Coding Habits

* Never call `tokenizer.add_tokens()` without immediate `model.resize_token_embeddings()`.[^4]
* Always assert special token ID equality before starting the training loop.[^4]
* Use `tokenizer.encode(..., add_special_tokens=True)` consistently with model expectations.[^4]
* Save both tokenizer and model config after any special-token modification.[^4]


## Common Misconceptions

* **Misconception:** `tokenizer.vocab_size` always equals `len(tokenizer)`.
    * **Reality:** `add_tokens()` increases `len(tokenizer)` but not `vocab_size`; use `len(tokenizer)` for embedding resize.[^4]
* **Misconception:** `AutoTokenizer` and `AutoModel` from the same repo name guarantee compatibility.
    * **Reality:** Different revisions, local caches, or adapter loading can silently mismatch; always verify vocab sizes.[^3][^4]
* **Misconception:** Special tokens are just strings, so their IDs do not matter if the string is in vocabulary.
    * **Reality:** Model forward pass and generation logic depend on specific ID values for padding, masking, and stopping criteria.[^4]


## False Positive Cases

* **Case:** CUDA device-side assert from unrelated index error.
    * **Why It Looks Similar:** Same error message as tokenizer mismatch.
    * **How To Distinguish:** Check whether the error occurs in non-embedding layers and validate data-loader indices.
* **Case:** Intentional vocabulary pruning for efficiency.
    * **Why It Looks Similar:** `tokenizer.vocab_size < original`, and model may have larger embeddings.
    * **How To Distinguish:** Pruning is deliberate; embeddings were resized down or unused rows are masked.
* **Case:** Model using adaptive embeddings.
    * **Why It Looks Similar:** Embedding shape differs from vocabulary size.
    * **How To Distinguish:** The model config specifies `tie_word_embeddings=False` and uses adaptive or factorized embeddings.


## Escalation Paths

* **Path:** Retrain Tokenizer from Scratch.
    * **When To Use:** Vocabulary corruption is irreparable; merging failed.
    * **Tradeoffs:**
        * Requires a large corpus for training.
        * All existing checkpoints become incompatible.
* **Path:** Convert to Byte-Fallback BPE.
    * **When To Use:** Frequent out-of-vocabulary issues with the current tokenizer.
    * **Tradeoffs:**
        * Increases sequence length.
        * May degrade performance on some languages.
* **Path:** Contact Model Authors.
    * **When To Use:** Suspected bug in the official model tokenizer pairing.
    * **Tradeoffs:**
        * Requires a minimal reproducible example.
        * Response time varies by project.


## Further Study

## Suggested Meta

* **Tags:** llm, debugging, tokenizer, vocabulary, embedding, special-tokens, huggingface.
* **Aliases:** tokenizer-mismatch, vocab-mismatch, special-token-error, embedding-shape-error.
* **Keywords:** tokenizer, vocab_size, embedding, special_tokens, pad_token_id, eos_token_id, resize_token_embeddings, huggingface.
* **Search Tokens:** tokenizer model mismatch, vocabulary size error, special token misalignment, embedding shape mismatch, tokenizer vocab size.
* **Difficulty:** Advanced.
* **Domain:** deep-learning.
* **Engineering Area:** llm, training, inference.
* **Estimated Reading Time:** 20-25 minutes.
* **Prerequisites:** transformers-basics, tokenization-concepts.
* **Recommended Next:** nan-loss-exploding-gradients, oom-training, fine-tune-llm-lora-qlora.
* **Cross-Links:**
    * related_packages: transformers, tokenizers, sentencepiece.
    * related_workflows: fine-tune-llm-lora-qlora, train-from-scratch.
    * related_patterns: mixed-precision, gradient-accumulation, training-loop.
    * related_models: llama, mistral, gpt2, bert.
<span style="display:none">[^1][^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: AENS-Knowledge-Layer-Specification.md

[^2]: CONTENT_QUALITY_STANDARD.md

[^3]: MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md

[^4]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md

[^5]: ARCHITECTURE_FREEZE.md

[^6]: https://markaicode.com/handle-tokenization-errors-transformers/

[^7]: https://medium.com/data-science/the-art-of-prompt-design-prompt-boundaries-and-token-healing-3b2448b0be38

[^8]: https://github.com/huggingface/transformers/issues/17431

[^9]: https://arxiv.org/html/2601.14658v1

[^10]: https://github.com/openai/harmony/issues/27

[^11]: https://hamel.dev/notes/llm/finetuning/tokenizer_gotchas.html

[^12]: https://adhdecode.com/debugging/ollama/error-tokenizer-vocab-size-mismatch/

[^13]: https://aitoolsguidebook.com/en/articles/local-llm-token-mismatch-tokenizer-drift/

[^14]: https://discuss.huggingface.co/t/sft-of-instruct-model-collapse/170526

[^15]: https://github.com/huggingface/transformers/issues/31513

[^16]: http://arxiv.org/pdf/2010.07878v1.pdf

[^17]: http://arxiv.org/pdf/2410.23684.pdf

[^18]: https://arxiv.org/pdf/2403.08688.pdf

[^19]: https://arxiv.org/pdf/2203.03235.pdf

[^20]: https://aclanthology.org/2021.acl-long.469.pdf

[^21]: http://arxiv.org/pdf/2501.05706.pdf

[^22]: http://arxiv.org/pdf/2405.05417.pdf

[^23]: https://arxiv.org/pdf/2503.04232.pdf

