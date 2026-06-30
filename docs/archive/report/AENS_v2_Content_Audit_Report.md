# AENS v2 - Comprehensive Content Audit Report

**Audit Date:** June 29, 2026  
**Audit Scope:** Complete inventory of AENS knowledge system  
**Audit Type:** Read-only inspection

---

## Executive Summary

The AENS knowledge system contains 37 content items across 6 content types:
- 6 Packages
- 21 Models (7 ML, 6 DL, 10 LLM)
- 11 Registry entries
- 3 Workflows
- 5 Cheatsheets

Total JSON files: 46 content files + 8 navigation files = 54 files

---

## 1. Package Library Audit

### Summary Table

| Package | Category | Tasks | Examples | Params | Notes | Warnings | Related Workflows | Related Cheatsheets | JSON Location |
|---------|----------|-------|----------|--------|-------|----------|-------------------|---------------------|---------------|
| CuPy | GPU Computing | 3 | 3 | 2 per task | 0 | 2 per task | 0 | 0 | `data/packages/cupy.json` |
| Dask | Parallel Computing | 3 | 3 | 2 per task | 0 | 2 per task | 0 | 0 | `data/packages/dask.json` |
| JAX | ML Framework | 4 | 4 | 2 per task | 0 | 2 per task | 1 | 0 | `data/packages/jax.json` |
| NumPy | Numerical Computing | 5 | 5 | 4 per task | 0 | 2 per task | 1 | 1 | `data/packages/numpy.json` |
| pandas | Data Manipulation | 5 | 5 | 4 per task | 0 | 2 per task | 3 | 1 | `data/packages/pandas.json` |
| Polars | Data Manipulation | 4 | 4 | 3 per task | 0 | 2 per task | 0 | 0 | `data/packages/polars.json` |

### Detailed Package Breakdown

#### CuPy
- **Version:** 13.0.0
- **Install:** `pip install cupy-cuda12x`
- **Import:** `import cupy as cp`
- **Tasks:** 3 (CPU-GPU transfer, GPU math/linear algebra, GPU FFT)
- **Sections per task:** syntax, important_params, example, use_when, avoid_when, decision_notes, gotchas, official_docs
- **Cross-links:** 2 alternatives (jax, numpy)
- **Schema version:** Standard package schema
- **Missing sections:** None

#### Dask
- **Version:** 2024.1.0
- **Install:** `pip install dask[complete]`
- **Import:** `import dask.dataframe as dd`, `import dask.array as da`
- **Tasks:** 3 (large dataset processing, parallel NumPy, delayed functions)
- **Sections per task:** syntax, important_params, example, use_when, avoid_when, decision_notes, gotchas, official_docs
- **Cross-links:** 3 alternatives (polars, pandas, numpy)
- **Schema version:** Standard package schema
- **Missing sections:** None

#### JAX
- **Version:** 0.4.25
- **Install:** `pip install jax[cuda12]`
- **Import:** `import jax`, `import jax.numpy as jnp`
- **Tasks:** 4 (JIT compilation, gradients, vectorization, random numbers)
- **Sections per task:** syntax, important_params, example, use_when, avoid_when, decision_notes, gotchas, official_docs
- **Cross-links:** 1 workflow (fine-tuning-lora), 2 alternatives (numpy, cupy)
- **Schema version:** Standard package schema
- **Missing sections:** None

#### NumPy
- **Version:** 2.0.0
- **Install:** `pip install numpy`
- **Import:** `import numpy as np`
- **Tasks:** 5 (array creation, reshape/manipulation, indexing/filtering, statistics, linear algebra)
- **Sections per task:** syntax, important_params, example, use_when, avoid_when, decision_notes, gotchas, official_docs
- **Cross-links:** 1 workflow (rag), 1 cheatsheet (numpy-cheatsheet), 2 alternatives (cupy, jax)
- **Additional fields:** aliases (10 aliases for linear algebra task)
- **Schema version:** Standard package schema
- **Missing sections:** None

#### pandas
- **Version:** 2.2.0
- **Install:** `pip install pandas`
- **Import:** `import pandas as pd`
- **Tasks:** 5 (load/save, inspection, selection/filtering, cleaning, aggregation)
- **Sections per task:** syntax, important_params, example, use_when, avoid_when, decision_notes, gotchas, official_docs
- **Cross-links:** 3 workflows (rag, fine-tuning-lora, text-classification), 1 cheatsheet (pandas-cheatsheet), 3 alternatives (polars, dask, numpy)
- **Schema version:** Standard package schema
- **Missing sections:** None

#### Polars
- **Version:** 0.20.0
- **Install:** `pip install polars`
- **Import:** `import polars as pl`
- **Tasks:** 4 (lazy loading, selection/filtering, aggregation, lazy pipelines)
- **Sections per task:** syntax, important_params, example, use_when, avoid_when, decision_notes, gotchas, official_docs
- **Cross-links:** 3 alternatives (pandas, dask, numpy)
- **Schema version:** Standard package schema
- **Missing sections:** None

---

## 2. Machine Learning Models Audit

### Summary Table

| Model | Category | Problem Types | Hyperparams | Implementation Examples | Preprocessing Notes | Evaluation Metrics | Related Workflows | Related Packages | JSON Location |
|-------|----------|---------------|-------------|------------------------|---------------------|-------------------|-------------------|------------------|---------------|
| EasyOCR | ML | detection | 4 | 1 | 0 | 0 | 0 | 0 | `data/models/ml/easyocr.json` |
| Extra Trees Classifier | ML | classification, regression | 4 | 1 | 0 | 0 | 0 | 0 | `data/models/ml/extra-trees-classifier.json` |
| Gradient Boosting Classifier | ML | classification, regression | 5 | 1 | 0 | 0 | 0 | 0 | `data/models/ml/gradient-boosting-classifier.json` |
| LightGBM | ML | classification, regression | 6 | 1 | 0 | 0 | 0 | 0 | `data/models/ml/lightgbm.json` |
| Random Forest | ML | classification, regression | 4 | 1 | 0 | 0 | 0 | 0 | `data/models/ml/random-forest.json` |
| Tesseract OCR | ML | detection | 3 | 1 | 0 | 0 | 0 | 0 | `data/models/ml/tesseract.json` |
| XGBoost | ML | classification, regression | 6 | 1 | 0 | 0 | 0 | 0 | `data/models/ml/xgboost.json` |

### Detailed ML Model Breakdown

#### EasyOCR
- **Problem Types:** detection
- **Key Hyperparams:** 4 (gpu, lang_list, detail, paragraph)
- **Sections:** summary, use_when, avoid_when, pros, cons, key_hyperparams, training_speed, inference_speed, memory_usage, interpretability, quick_start, decision_notes, competitors, alternatives, related_workflows
- **Cross-links:** 1 alternative (tesseract), 1 competitor (tesseract)
- **Architecture documentation:** CRAFT for detection, CRNN for recognition
- **Training notes:** Not documented
- **Inference notes:** GPU acceleration available
- **Tensor shape information:** Not documented
- **Layer documentation:** Not documented

#### Extra Trees Classifier
- **Problem Types:** classification, regression
- **Key Hyperparams:** 4 (n_estimators, max_features, min_samples_split, bootstrap)
- **Sections:** summary, use_when, avoid_when, pros, cons, key_hyperparams, training_speed, inference_speed, memory_usage, interpretability, quick_start, decision_notes, competitors, alternatives, related_workflows
- **Cross-links:** 2 alternatives (random-forest, xgboost), 2 competitors (random-forest, xgboost)
- **Architecture documentation:** Ensemble of decision trees with random split thresholds
- **Training notes:** Faster than Random Forest
- **Inference notes:** Medium speed
- **Tensor shape information:** Not applicable
- **Layer documentation:** Not applicable

#### Gradient Boosting Classifier
- **Problem Types:** classification, regression
- **Key Hyperparams:** 5 (n_estimators, max_depth, learning_rate, subsample, min_samples_leaf)
- **Sections:** summary, use_when, avoid_when, pros, cons, key_hyperparams, training_speed, inference_speed, memory_usage, interpretability, quick_start, decision_notes, competitors, alternatives, related_workflows
- **Cross-links:** 3 alternatives (xgboost, lightgbm, random-forest), 3 competitors (xgboost, lightgbm, random-forest)
- **Architecture documentation:** Sequential tree building with first-order gradients
- **Training notes:** Slow on large datasets
- **Inference notes:** Medium speed
- **Tensor shape information:** Not applicable
- **Layer documentation:** Not applicable

#### LightGBM
- **Problem Types:** classification, regression
- **Key Hyperparams:** 6 (n_estimators, num_leaves, learning_rate, max_depth, min_child_samples, feature_fraction)
- **Sections:** summary, use_when, avoid_when, pros, cons, key_hyperparams, training_speed, inference_speed, memory_usage, interpretability, quick_start, decision_notes, competitors, alternatives, related_workflows
- **Cross-links:** 3 alternatives (xgboost, random-forest, gradient-boosting-classifier), 3 competitors (xgboost, random-forest, gradient-boosting-classifier)
- **Architecture documentation:** Histogram-based gradient boosting with leaf-wise growth
- **Training notes:** Fastest among gradient boosting libraries
- **Inference notes:** Fast
- **Tensor shape information:** Not applicable
- **Layer documentation:** Not applicable

#### Random Forest
- **Problem Types:** classification, regression
- **Key Hyperparams:** 4 (n_estimators, max_depth, max_features, min_samples_leaf)
- **Sections:** summary, use_when, avoid_when, pros, cons, key_hyperparams, training_speed, inference_speed, memory_usage, interpretability, quick_start, decision_notes, competitors, alternatives, related_workflows
- **Cross-links:** 4 alternatives (xgboost, lightgbm, extra-trees-classifier, gradient-boosting-classifier), 4 competitors (xgboost, lightgbm, extra-trees-classifier, gradient-boosting-classifier)
- **Architecture documentation:** Ensemble of decision trees on bootstrap samples
- **Training notes:** Medium speed
- **Inference notes:** Medium speed
- **Tensor shape information:** Not applicable
- **Layer documentation:** Not applicable

#### Tesseract OCR
- **Problem Types:** detection
- **Key Hyperparams:** 3 (lang, config, nice)
- **Sections:** summary, use_when, avoid_when, pros, cons, key_hyperparams, training_speed, inference_speed, memory_usage, interpretability, quick_start, decision_notes, competitors, alternatives, related_workflows
- **Cross-links:** 1 alternative (easyocr), 1 competitor (easyocr)
- **Architecture documentation:** LSTM-based neural networks since version 4
- **Training notes:** Medium speed
- **Inference notes:** Fast on CPU
- **Tensor shape information:** Not documented
- **Layer documentation:** Not documented

#### XGBoost
- **Problem Types:** classification, regression
- **Key Hyperparams:** 6 (n_estimators, max_depth, learning_rate, subsample, colsample_bytree, reg_lambda)
- **Sections:** summary, use_when, avoid_when, pros, cons, key_hyperparams, training_speed, inference_speed, memory_usage, interpretability, quick_start, decision_notes, competitors, alternatives, related_workflows
- **Additional fields:** aliases (5 aliases)
- **Cross-links:** 3 alternatives (lightgbm, random-forest, gradient-boosting-classifier), 3 competitors (lightgbm, random-forest, gradient-boosting-classifier)
- **Architecture documentation:** Gradient boosting with second-order Taylor expansion
- **Training notes:** Medium speed
- **Inference notes:** Fast
- **Tensor shape information:** Not applicable
- **Layer documentation:** Not applicable

---

## 3. Deep Learning Models Audit

### Summary Table

| Model | Category | Problem Types | Hyperparams | Architecture Docs | Training Notes | Inference Notes | Tensor Shapes | Layer Docs | Related Workflows | JSON Location |
|-------|----------|---------------|-------------|-------------------|----------------|-----------------|---------------|------------|-------------------|---------------|
| Faster Whisper | DL | generation | 4 | CTranslate2 optimization | Slow | Fast | Not documented | Not documented | 0 | `data/models/dl/faster-whisper.json` |
| LSTM | DL | classification, generation | 5 | Gated recurrent architecture | Medium | Medium | Not documented | Gate activations documented | 0 | `data/models/dl/lstm.json` |
| Mamba (SSM) | DL | generation, classification | 4 | Selective state space model | Medium | Fast | Not documented | Not documented | 0 | `data/models/dl/mamba.json` |
| ResNet-50 | DL | classification, detection, segmentation | 3 | Skip connections (residual mappings) | Medium | Medium | 224x224 input | Not documented | 0 | `data/models/dl/resnet-50.json` |
| RWKV | DL | generation, classification | 3 | RNN-Transformer hybrid with linear attention | Medium | Fast | Not documented | Not documented | 0 | `data/models/dl/rwkv.json` |
| Transformer | DL | generation, embedding | 2 | Self-attention mechanisms | Slow | Medium | Not documented | Not documented | 0 | `data/models/dl/transformer.json` |

### Detailed DL Model Breakdown

#### Faster Whisper
- **Problem Types:** generation
- **Key Hyperparams:** 4 (model_size, device, compute_type, beam_size)
- **Architecture:** CTranslate2-optimized reimplementation of OpenAI Whisper
- **Training Notes:** No training capability
- **Inference Notes:** Up to 4x faster than original Whisper, int8 quantization
- **Tensor Shapes:** Not documented
- **Layer Documentation:** Not documented
- **Cross-links:** 1 alternative (whisper-large-v3), 1 competitor (whisper-large-v3)

#### LSTM
- **Problem Types:** classification, generation
- **Key Hyperparams:** 5 (input_size, hidden_size, num_layers, dropout, bidirectional)
- **Architecture:** Gated recurrent network with input, forget, and output gates
- **Training Notes:** Cannot parallelize across time dimension
- **Inference Notes:** Lower memory footprint than Transformers
- **Tensor Shapes:** Not documented
- **Layer Documentation:** Gate activations documented (input, forget, output)
- **Cross-links:** 3 alternatives (transformer, rwkv, mamba), 3 competitors (transformer, rwkv, mamba)

#### Mamba (SSM)
- **Problem Types:** generation, classification
- **Key Hyperparams:** 4 (d_model, d_state, d_conv, expand)
- **Architecture:** State Space Model with selective state updates
- **Training Notes:** Linear O(n) complexity
- **Inference Notes:** Fast autoregressive with constant memory per step
- **Tensor Shapes:** Not documented
- **Layer Documentation:** Not documented
- **Cross-links:** 3 alternatives (transformer, rwkv, lstm), 3 competitors (transformer, rwkv, lstm)

#### ResNet-50
- **Problem Types:** classification, detection, segmentation
- **Key Hyperparams:** 3 (pretrained, num_classes, zero_init_residual)
- **Architecture:** 50-layer CNN with skip connections (residual mappings)
- **Training Notes:** Medium speed
- **Inference Notes:** Medium speed
- **Tensor Shapes:** 224x224 input resolution
- **Layer Documentation:** Not documented
- **Cross-links:** 1 alternative (transformer), 1 competitor (transformer)

#### RWKV
- **Problem Types:** generation, classification
- **Key Hyperparams:** 3 (n_layer, n_embd, ctx_len)
- **Architecture:** RNN-Transformer hybrid with Receptance Weighted Key Value formulation
- **Training Notes:** Fully parallelizable across sequence dimension
- **Inference Notes:** Constant O(1) memory per step
- **Tensor Shapes:** Not documented
- **Layer Documentation:** Not documented
- **Cross-links:** 3 alternatives (transformer, mamba, lstm), 3 competitors (transformer, mamba, lstm)

#### Transformer
- **Problem Types:** generation, embedding
- **Key Hyperparams:** 2 (d_model, nhead)
- **Architecture:** Self-attention mechanisms
- **Training Notes:** Slow, quadratic complexity
- **Inference Notes:** Medium speed
- **Tensor Shapes:** Not documented
- **Layer Documentation:** Not documented
- **Cross-links:** 3 alternatives (lstm, mamba, rwkv), 3 competitors (lstm, mamba, rwkv)

---

## 4. LLM Models Audit

### Summary Table

| Model | Problem Types | Prompt Engineering | Fine-tuning | Inference | Context Window | Tokenization | RAG References | Agent References | Serving | Cross-links | JSON Location |
|-------|---------------|-------------------|-------------|-----------|----------------|--------------|-----------------|------------------|---------|-------------|---------------|
| Cohere Rerank v3 | embedding | Not applicable | Not applicable | API-only | Not applicable | Not applicable | Yes (rag) | No | API | 1 workflow (rag) | `data/models/llm/cohere-reranker-v3.json` |
| Gemma 2 | generation | Not documented | Not documented | temperature, top_p, max_new_tokens | 8K | Not documented | No | No | Not documented | 0 workflows, 2 alternatives | `data/models/llm/gemma-2.json` |
| GTE Large | embedding | Not applicable | Fine-tuning possible | batch_size, normalize_embeddings | Not applicable | Not documented | Yes (rag) | No | Self-hosted | 1 workflow (rag), 1 alternative | `data/models/llm/gte-large.json` |
| Llama 3 8B | generation | Not documented | LoRA fine-tuning | temperature, top_p, max_new_tokens, repetition_penalty | 8K | Byte-fallback strategy | Yes (rag) | No | vLLM compatible | 2 workflows (rag, fine-tuning-lora), 3 alternatives | `data/models/llm/llama-3-8b.json` |
| Llama 3 | generation | Not documented | Not documented | temperature, top_p | Not documented | Not documented | No | No | Not documented | 0 workflows, 3 alternatives | `data/models/llm/llama3.json` |
| Mistral 7B | generation | Not documented | LoRA fine-tuning | temperature, top_p, max_new_tokens, sliding_window | 32K | Efficient BPE | Yes (rag) | No | Not documented | 2 workflows (rag, fine-tuning-lora), 2 alternatives | `data/models/llm/mistral-7b.json` |
| PaliGemma | generation, detection | Not documented | Limited fine-tuning | max_new_tokens, image_size | Not documented | Not documented | No | No | Not documented | 0 workflows, 1 alternative | `data/models/llm/paligemma.json` |
| Qwen 2 | generation | Not documented | Not documented | temperature, top_p, max_new_tokens | 128K | Large vocabulary (151K) | No | No | Not documented | 0 workflows, 2 alternatives | `data/models/llm/qwen-2.json` |
| text-embedding-3-large | embedding | Not applicable | Not applicable | dimensions, encoding_format | Not applicable | Not documented | No | No | API | 0 workflows, 1 alternative | `data/models/llm/text-embedding-3-large.json` |
| Whisper Large v3 | generation | Not applicable | Not documented | language, task, temperature, compression_ratio_threshold | Not applicable | Not documented | No | No | Not documented | 0 workflows, 1 alternative | `data/models/llm/whisper-large-v3.json` |

### Detailed LLM Model Breakdown

#### Cohere Rerank v3
- **Problem Types:** embedding
- **Prompt Engineering:** Not applicable
- **Fine-tuning:** Not available (API-only)
- **Inference Parameters:** 3 (top_n, return_documents, max_chunks_per_doc)
- **Context Window:** Not applicable
- **Tokenization:** Not documented
- **RAG References:** Yes (used in rag workflow)
- **Agent References:** No
- **Serving Information:** API-only, no local weights
- **Cross-links:** 1 workflow (rag)

#### Gemma 2
- **Problem Types:** generation
- **Prompt Engineering:** Not documented
- **Fine-tuning:** Not documented
- **Inference Parameters:** 3 (temperature, top_p, max_new_tokens)
- **Context Window:** 8K
- **Tokenization:** Not documented
- **RAG References:** No
- **Agent References:** No
- **Serving Information:** Not documented
- **Cross-links:** 2 alternatives (mistral-7b, llama-3-8b)

#### GTE Large
- **Problem Types:** embedding
- **Prompt Engineering:** Not applicable
- **Fine-tuning:** Possible with contrastive learning
- **Inference Parameters:** 2 (batch_size, normalize_embeddings)
- **Context Window:** Not applicable
- **Tokenization:** Not documented
- **RAG References:** Yes (used in rag workflow)
- **Agent References:** No
- **Serving Information:** Self-hosted, SentenceTransformers compatible
- **Cross-links:** 1 workflow (rag), 1 alternative (text-embedding-3-large)

#### Llama 3 8B
- **Problem Types:** generation
- **Prompt Engineering:** Not documented
- **Fine-tuning:** LoRA fine-tuning supported
- **Inference Parameters:** 4 (temperature, top_p, max_new_tokens, repetition_penalty)
- **Context Window:** 8K
- **Tokenization:** Byte-fallback strategy
- **RAG References:** Yes (used in rag workflow)
- **Agent References:** No
- **Serving Information:** vLLM compatible, quantization support (GPTQ, AWQ, GGUF)
- **Cross-links:** 2 workflows (rag, fine-tuning-lora), 3 alternatives (mistral-7b, gemma-2, llama3)

#### Llama 3
- **Problem Types:** generation
- **Prompt Engineering:** Not documented
- **Fine-tuning:** Not documented
- **Inference Parameters:** 2 (temperature, top_p)
- **Context Window:** Not documented
- **Tokenization:** Not documented
- **RAG References:** No
- **Agent References:** No
- **Serving Information:** Not documented
- **Cross-links:** 3 alternatives (mistral-7b, gemma-2, qwen-2)
- **Note:** Family overview entry, prefer llama-3-8b for specific deployment

#### Mistral 7B
- **Problem Types:** generation
- **Prompt Engineering:** Not documented
- **Fine-tuning:** LoRA fine-tuning supported
- **Inference Parameters:** 4 (temperature, top_p, max_new_tokens, sliding_window)
- **Context Window:** 32K (with sliding window)
- **Tokenization:** Efficient byte-pair encoding
- **RAG References:** Yes (used in rag workflow)
- **Agent References:** No
- **Serving Information:** Not documented
- **Cross-links:** 2 workflows (rag, fine-tuning-lora), 2 alternatives (llama-3-8b, gemma-2)

#### PaliGemma
- **Problem Types:** generation, detection
- **Prompt Engineering:** Not documented
- **Fine-tuning:** Limited fine-tuning recipes
- **Inference Parameters:** 2 (max_new_tokens, image_size)
- **Context Window:** Not applicable (multimodal)
- **Tokenization:** Gemma decoder tokenizer
- **RAG References:** No
- **Agent References:** No
- **Serving Information:** Not documented
- **Cross-links:** 1 alternative (gemma-2)

#### Qwen 2
- **Problem Types:** generation
- **Prompt Engineering:** Not documented
- **Fine-tuning:** Not documented
- **Inference Parameters:** 3 (temperature, top_p, max_new_tokens)
- **Context Window:** 128K
- **Tokenization:** Large vocabulary (151K tokens)
- **RAG References:** No
- **Agent References:** No
- **Serving Information:** Not documented
- **Cross-links:** 2 alternatives (mistral-7b, llama-3-8b)

#### text-embedding-3-large
- **Problem Types:** embedding
- **Prompt Engineering:** Not applicable
- **Fine-tuning:** Not available (API-only)
- **Inference Parameters:** 2 (dimensions, encoding_format)
- **Context Window:** Not applicable
- **Tokenization:** Not documented
- **RAG References:** No
- **Agent References:** No
- **Serving Information:** API-only, OpenAI infrastructure
- **Cross-links:** 1 alternative (gte-large)

#### Whisper Large v3
- **Problem Types:** generation
- **Prompt Engineering:** Not applicable
- **Fine-tuning:** Not documented
- **Inference Parameters:** 4 (language, task, temperature, compression_ratio_threshold)
- **Context Window:** Not applicable (speech)
- **Tokenization:** Not documented
- **RAG References:** No
- **Agent References:** No
- **Serving Information:** Not documented
- **Cross-links:** 1 alternative (faster-whisper)

---

## 5. Registry Audit

### Summary Table

| Registry File | Entries | Valid Links | Missing Links | Categories | JSON Location |
|--------------|---------|-------------|---------------|------------|---------------|
| embeddings.json | 1 | 1 | 0 | embedding | `data/registry/embeddings.json` |
| llms.json | 4 | 4 | 0 | llm | `data/registry/llms.json` |
| multimodal.json | 2 | 1 | 1 | multimodal | `data/registry/multimodal.json` |
| ocr.json | 2 | 0 | 2 | ocr | `data/registry/ocr.json` |
| rerankers.json | 1 | 0 | 1 | reranker | `data/registry/rerankers.json` |
| speech.json | 2 | 1 | 1 | speech | `data/registry/speech.json` |
| vision.json | 3 | 1 | 2 | vision | `data/registry/vision.json` |

### Detailed Registry Breakdown

#### embeddings.json
- **Entries:** 1
- **Valid Links:** 1 (bge-large-en-v1-5 → /models/llm/gte-large)
- **Missing Links:** 0
- **Fields per entry:** id, task, size_mb, link
- **Official Documentation:** Not present
- **GitHub:** Not present
- **Paper:** Not present
- **Tutorial Links:** Not present
- **Installation Instructions:** Not present
- **Ecosystem Links:** Not present
- **Community Links:** Not present
- **Release Notes:** Not present
- **Version Information:** Not present
- **Related Content:** Link to model

#### llms.json
- **Entries:** 4
- **Valid Links:** 4 (all link to existing models)
- **Missing Links:** 0
- **Fields per entry:** id, task, size_mb, link
- **Models:** llama-3-8b-instruct, mistral-7b-instruct, qwen2-7b-instruct, gemma-2-9b-it
- **Official Documentation:** Not present
- **GitHub:** Not present
- **Paper:** Not present
- **Tutorial Links:** Not present
- **Installation Instructions:** Not present
- **Ecosystem Links:** Not present
- **Community Links:** Not present
- **Release Notes:** Not present
- **Version Information:** Not present
- **Related Content:** Links to models

#### multimodal.json
- **Entries:** 2
- **Valid Links:** 1 (paligemma-3b-pt-224 → /models/llm/paligemma)
- **Missing Links:** 1 (blip2-opt-2-7b → MISSING_MODEL)
- **Fields per entry:** id, task, size_mb, link
- **Official Documentation:** Not present
- **GitHub:** Not present
- **Paper:** Not present
- **Tutorial Links:** Not present
- **Installation Instructions:** Not present
- **Ecosystem Links:** Not present
- **Community Links:** Not present
- **Release Notes:** Not present
- **Version Information:** Not present
- **Related Content:** Link to model (1 missing)

#### ocr.json
- **Entries:** 2
- **Valid Links:** 0
- **Missing Links:** 2 (trocr-large-printed → MISSING_MODEL, ocr-donut-cord → MISSING_MODEL)
- **Fields per entry:** id, task, size_mb, link
- **Official Documentation:** Not present
- **GitHub:** Not present
- **Paper:** Not present
- **Tutorial Links:** Not present
- **Installation Instructions:** Not present
- **Ecosystem Links:** Not present
- **Community Links:** Not present
- **Release Notes:** Not present
- **Version Information:** Not present
- **Related Content:** No valid links

#### rerankers.json
- **Entries:** 1
- **Valid Links:** 0
- **Missing Links:** 1 (bge-reranker-large → MISSING_MODEL)
- **Fields per entry:** id, task, size_mb, link
- **Official Documentation:** Not present
- **GitHub:** Not present
- **Paper:** Not present
- **Tutorial Links:** Not present
- **Installation Instructions:** Not present
- **Ecosystem Links:** Not present
- **Community Links:** Not present
- **Release Notes:** Not present
- **Version Information:** Not present
- **Related Content:** No valid links

#### speech.json
- **Entries:** 2
- **Valid Links:** 1 (whisper-large-v3 → /models/llm/whisper-large-v3)
- **Missing Links:** 1 (wav2vec2-large-960h → MISSING_MODEL)
- **Fields per entry:** id, task, size_mb, link
- **Official Documentation:** Not present
- **GitHub:** Not present
- **Paper:** Not present
- **Tutorial Links:** Not present
- **Installation Instructions:** Not present
- **Ecosystem Links:** Not present
- **Community Links:** Not present
- **Release Notes:** Not present
- **Version Information:** Not present
- **Related Content:** Link to model (1 missing)

#### vision.json
- **Entries:** 3
- **Valid Links:** 1 (detr-resnet-50 → /models/dl/resnet-50)
- **Missing Links:** 2 (clip-vit-large-patch14 → MISSING_MODEL, vit-large-patch16-224 → MISSING_MODEL)
- **Fields per entry:** id, task, size_mb, link
- **Official Documentation:** Not present
- **GitHub:** Not present
- **Paper:** Not present
- **Tutorial Links:** Not present
- **Installation Instructions:** Not present
- **Ecosystem Links:** Not present
- **Community Links:** Not present
- **Release Notes:** Not present
- **Version Information:** Not present
- **Related Content:** Link to model (2 missing)

---

## 6. Workflow Library Audit

### Summary Table

| Workflow | Steps | Implementation Examples | Code Snippets | Diagrams | Related Packages | Related Models | Related Registry | Existing Sections | Cross-links | JSON Location |
|----------|-------|-------------------------|---------------|---------|------------------|----------------|------------------|-------------------|------------|---------------|
| LoRA Fine-Tuning Pipeline | 6 | 1 per step | 1 per step | 0 | 1 (pandas) | 2 (llama-3-8b, mistral-7b) | 0 | 7 | 2 next_links | `data/workflows/fine-tuning-lora.json` |
| Retrieval-Augmented Generation | 6 | 1 per step | 1 per step | 0 | 1 (pandas, numpy) | 2 (gte-large, llama-3-8b, cohere-reranker-v3) | 0 | 8 | 2 next_links | `data/workflows/rag.json` |
| Text Classification Pipeline | 6 | 1 per step | 1 per step | 0 | 1 (pandas) | 3 (gte-large, gradient-boosting-classifier, random-forest) | 0 | 8 | 2 next_links | `data/workflows/text-classification.json` |

### Detailed Workflow Breakdown

#### LoRA Fine-Tuning Pipeline
- **Steps:** 6
- **Step Names:** Dataset Preparation, Base Model Loading with Quantization, LoRA Configuration, PEFT Wrapping and Verification, Training Setup and Execution, Adapter Saving and Optional Merge
- **Implementation Examples:** 1 per step
- **Code Snippets:** 1 per step
- **Diagrams:** 0
- **Related Packages:** pandas (step 1)
- **Related Models:** llama-3-8b, mistral-7b (step 2)
- **Related Registry:** 0
- **Related Cheatsheets:** transformers (steps 2, 3, 4, 5, 6)
- **Existing Sections:** created_at, updated_at, sources, github_repo, id, name, type, category, overview, starter_stack, steps, evaluation_checks, next_links, common_failure_points
- **Cross-links:** 2 next_links (rag, text-classification)
- **Sections per step:** step, name, what, tools, decision, uses (packages, models, cheatsheets), failure_points

#### Retrieval-Augmented Generation
- **Steps:** 6
- **Step Names:** Ingestion and Chunking, Embedding, Vector Storage, Query Embedding and Retrieval, Reranking, Generation
- **Implementation Examples:** 1 per step
- **Code Snippets:** 1 per step
- **Diagrams:** 0
- **Related Packages:** pandas (step 1), numpy (steps 2, 3, 4, 5)
- **Related Models:** gte-large (steps 2, 4), cohere-reranker-v3 (step 5), llama-3-8b (step 6)
- **Related Registry:** 0
- **Related Cheatsheets:** numpy-cheatsheet (step 2), transformers (step 6)
- **Existing Sections:** created_at, updated_at, sources, id, name, type, category, overview, starter_stack, steps, evaluation_checks, next_links, common_failure_points, aliases
- **Cross-links:** 2 next_links (fine-tuning-lora, text-classification)
- **Additional fields:** aliases (5 aliases)
- **Sections per step:** step, name, what, tools, decision, uses (packages, models, cheatsheets), failure_points

#### Text Classification Pipeline
- **Steps:** 6
- **Step Names:** Data Loading and Class Audit, Preprocessing, Feature Extraction, Baseline Model: TF-IDF + LogisticRegression, BERT Fine-Tuning (Escalation Path), Evaluation and Export
- **Implementation Examples:** 1 per step
- **Code Snippets:** 1 per step
- **Diagrams:** 0
- **Related Packages:** pandas (steps 1, 2)
- **Related Models:** gte-large (step 3), gradient-boosting-classifier, random-forest (step 4)
- **Related Registry:** 0
- **Related Cheatsheets:** pandas-cheatsheet (steps 1, 2), sklearn (steps 4, 6), transformers (step 5)
- **Existing Sections:** created_at, updated_at, sources, id, name, type, category, overview, starter_stack, steps, evaluation_checks, next_links, common_failure_points
- **Cross-links:** 2 next_links (rag, fine-tuning-lora)
- **Sections per step:** step, name, what, tools, decision, uses (packages, models, cheatsheets), failure_points

---

## 7. Cheatsheets Audit

### Summary Table

| Cheatsheet | Topic | Syntax Entries | Examples | Notes | Warnings | Related Packages | Related Workflows | Related Models | Existing Sections | JSON Location |
|------------|-------|----------------|----------|-------|----------|------------------|-------------------|----------------|-------------------|---------------|
| NumPy Cheatsheet | NumPy | 5 | 5 | 5 | 5 | 1 (numpy) | 1 (rag) | 0 | 6 | `data/cheatsheets/numpy-cheatsheet.json` |
| Pandas Cheatsheet | Pandas | 5 | 5 | 5 | 5 | 1 (pandas) | 3 (rag, fine-tuning-lora, text-classification) | 0 | 6 | `data/cheatsheets/pandas-cheatsheet.json` |
| PyTorch | PyTorch | 5 | 5 | 5 | 5 | 0 | 0 | 0 | 6 | `data/cheatsheets/pytorch.json` |
| Scikit-Learn | Scikit-Learn | 3 | 3 | 3 | 3 | 0 | 1 (text-classification) | 0 | 6 | `data/cheatsheets/sklearn.json` |
| Transformers | Transformers | 3 | 3 | 3 | 3 | 0 | 2 (fine-tuning-lora, rag) | 0 | 6 | `data/cheatsheets/transformers.json` |

### Detailed Cheatsheet Breakdown

#### NumPy Cheatsheet
- **Topic:** NumPy
- **Syntax Entries:** 5
- **Examples:** 5 (one per entry)
- **Notes:** 5 (minimal_notes per entry)
- **Warnings:** 5 (common_bug per entry)
- **Related Packages:** numpy
- **Related Workflows:** rag
- **Related Models:** 0
- **Existing Sections:** created_at, updated_at, sources, id, name, entries
- **Sections per entry:** problem, trigger, snippet, minimal_notes, common_bug, docs_url

#### Pandas Cheatsheet
- **Topic:** Pandas
- **Syntax Entries:** 5
- **Examples:** 5 (one per entry)
- **Notes:** 5 (minimal_notes per entry)
- **Warnings:** 5 (common_bug per entry)
- **Related Packages:** pandas
- **Related Workflows:** rag, fine-tuning-lora, text-classification
- **Related Models:** 0
- **Existing Sections:** created_at, updated_at, sources, id, name, entries
- **Sections per entry:** problem, trigger, snippet, minimal_notes, common_bug, docs_url

#### PyTorch
- **Topic:** PyTorch
- **Syntax Entries:** 5
- **Examples:** 5 (one per entry)
- **Notes:** 5 (minimal_notes per entry)
- **Warnings:** 5 (common_bug per entry)
- **Related Packages:** 0
- **Related Workflows:** 0
- **Related Models:** 0
- **Existing Sections:** created_at, updated_at, sources, id, name, entries
- **Sections per entry:** problem, trigger, snippet, minimal_notes, common_bug, docs_url

#### Scikit-Learn
- **Topic:** Scikit-Learn
- **Syntax Entries:** 3
- **Examples:** 3 (one per entry)
- **Notes:** 3 (minimal_notes per entry)
- **Warnings:** 3 (common_bug per entry)
- **Related Packages:** 0
- **Related Workflows:** text-classification
- **Related Models:** 0
- **Existing Sections:** created_at, updated_at, sources, id, name, entries
- **Sections per entry:** problem, trigger, snippet, minimal_notes, common_bug, docs_url

#### Transformers
- **Topic:** Transformers
- **Syntax Entries:** 3
- **Examples:** 3 (one per entry)
- **Notes:** 3 (minimal_notes per entry)
- **Warnings:** 3 (common_bug per entry)
- **Related Packages:** 0
- **Related Workflows:** fine-tuning-lora, rag
- **Related Models:** 0
- **Existing Sections:** created_at, updated_at, sources, id, name, entries
- **Sections per entry:** problem, trigger, snippet, minimal_notes, common_bug, docs_url

---

## 8. Cross-Link Analysis

### Package ↔ Models

**Existing Links:**
- None directly in package files
- Models reference packages in their quick_start code examples

**Missing Links (Factual Observations):**
- No explicit package-to-model cross-links in package JSON files
- No model-to-package cross-links in model JSON files

### Package ↔ Workflows

**Existing Links:**
- numpy → rag (via related_workflows in numpy.json)
- pandas → rag, fine-tuning-lora, text-classification (via related_workflows in pandas.json)
- jax → fine-tuning-lora (via related_workflows in jax.json)

**Missing Links (Factual Observations):**
- cupy → 0 workflows
- dask → 0 workflows
- polars → 0 workflows

### Package ↔ Registry

**Existing Links:**
- None

**Missing Links (Factual Observations):**
- No package-to-registry cross-links
- No registry-to-package cross-links

### Models ↔ Workflows

**Existing Links:**
- gte-large → rag (via related_workflows in gte-large.json)
- cohere-reranker-v3 → rag (via related_workflows in cohere-reranker-v3.json)
- llama-3-8b → rag, fine-tuning-lora (via related_workflows in llama-3-8b.json)
- mistral-7b → rag, fine-tuning-lora (via related_workflows in mistral-7b.json)

**Missing Links (Factual Observations):**
- All ML models → 0 workflows
- All DL models → 0 workflows
- Other LLM models → 0 workflows (gemma-2, llama3, paligemma, qwen-2, text-embedding-3-large, whisper-large-v3)

### Models ↔ Cheatsheets

**Existing Links:**
- None directly in model files
- Cheatsheets reference models in their code examples

**Missing Links (Factual Observations):**
- No model-to-cheatsheet cross-links in model JSON files
- No cheatsheet-to-model cross-links in cheatsheet JSON files

### Registry ↔ Packages

**Existing Links:**
- None

**Missing Links (Factual Observations):**
- No registry-to-package cross-links
- No package-to-registry cross-links

### Registry ↔ Workflows

**Existing Links:**
- None

**Missing Links (Factual Observations):**
- No registry-to-workflow cross-links
- No workflow-to-registry cross-links

### Registry ↔ Models

**Existing Links:**
- embeddings.json: bge-large-en-v1-5 → /models/llm/gte-large
- llms.json: All 4 entries link to existing models
- multimodal.json: paligemma-3b-pt-224 → /models/llm/paligemma
- speech.json: whisper-large-v3 → /models/llm/whisper-large-v3
- vision.json: detr-resnet-50 → /models/dl/resnet-50

**Missing Links (Factual Observations):**
- multimodal.json: blip2-opt-2-7b → MISSING_MODEL
- ocr.json: trocr-large-printed → MISSING_MODEL, ocr-donut-cord → MISSING_MODEL
- rerankers.json: bge-reranker-large → MISSING_MODEL
- speech.json: wav2vec2-large-960h → MISSING_MODEL
- vision.json: clip-vit-large-patch14 → MISSING_MODEL, vit-large-patch16-224 → MISSING_MODEL

### Workflows ↔ Cheatsheets

**Existing Links:**
- fine-tuning-lora → transformers (via uses.cheatsheets in steps)
- rag → numpy-cheatsheet, transformers (via uses.cheatsheets in steps)
- text-classification → pandas-cheatsheet, sklearn, transformers (via uses.cheatsheets in steps)

**Missing Links (Factual Observations):**
- fine-tuning-lora → 0 direct cheatsheet links at workflow level
- rag → 0 direct cheatsheet links at workflow level
- text-classification → 0 direct cheatsheet links at workflow level

---

## 9. Duplicate Content Analysis

### Exact Duplicates

**None identified**

### Near Duplicates

**Model Entries:**
- llama-3-8b and llama3: Both refer to Llama 3 family. llama3 is a family overview entry, llama-3-8b is specific deployment guidance. Not duplicates, but related.

**Registry Missing Model References:**
- 6 registry entries point to "MISSING_MODEL": blip2-opt-2-7b, trocr-large-printed, ocr-donut-cord, bge-reranker-large, wav2vec2-large-960h, clip-vit-large-patch14, vit-large-patch16-224

**Workflow Failure Points:**
- Some failure_points in workflows are repeated in common_failure_points sections (intentional summarization)

### Cross-Content Overlap

**Package Tasks vs Cheatsheet Entries:**
- numpy tasks overlap with numpy-cheatsheet entries (intentional - cheatsheet provides quick reference)
- pandas tasks overlap with pandas-cheatsheet entries (intentional - cheatsheet provides quick reference)

**Model Quick Start vs Cheatsheet Entries:**
- Some model quick_start code examples overlap with cheatsheet snippets (intentional - different depth levels)

---

## 10. Content Density Statistics

### Overall Statistics

**Total Content Items:**
- Total Packages: 6
- Total ML Models: 7
- Total DL Models: 6
- Total LLM Models: 10
- Total Registry Entries: 11
- Total Workflows: 3
- Total Cheatsheets: 5
- **Grand Total: 48 content items**

**Detailed Metrics:**
- Total Syntax Entries (packages): 24 tasks across 6 packages
- Total Examples (packages): 24 examples across 6 packages
- Total Parameter Explanations (packages): ~84 parameters across 6 packages
- Total Notes (packages): 0 notes field (gotchas serve as warnings)
- Total Warnings/Gotchas (packages): 48 gotchas across 6 packages
- Total References (packages): 6 sources arrays, 6 github_repo fields
- Total Official Documentation Links (packages): 24 official_docs across 6 packages
- Total GitHub Links (packages): 6 github_repo fields
- Total Cross-links (packages): 8 alternatives, 5 related_workflows, 2 related_cheatsheets

- Total Hyperparameters (ML models): 32 hyperparams across 7 models
- Total Hyperparameters (DL models): 21 hyperparams across 6 models
- Total Hyperparameters (LLM models): 27 hyperparams across 10 models
- **Total Hyperparameters (all models): 80**

- Total Workflow Steps: 18 steps across 3 workflows
- Total Workflow Code Snippets: 18 code snippets across 3 workflows
- Total Workflow Failure Points: 18 failure_points + 15 common_failure_points = 33

- Total Cheatsheet Entries: 21 entries across 5 cheatsheets
- Total Cheatsheet Code Snippets: 21 snippets across 5 cheatsheets
- Total Cheatsheet Notes: 21 minimal_notes across 5 cheatsheets
- Total Cheatsheet Warnings: 21 common_bug across 5 cheatsheets

### Averages

**Average APIs/Tasks per Package:** 4.0
**Average Examples per Package:** 4.0
**Average Parameters per Package Task:** 3.5
**Average Hyperparameters per ML Model:** 4.6
**Average Hyperparameters per DL Model:** 3.5
**Average Hyperparameters per LLM Model:** 2.7
**Average Workflow Steps:** 6.0
**Average Cheatsheet Entries:** 4.2
**Average Cross-links per Package:** 2.5

### File Size Distribution

**Largest Content Files:**
- pandas.json: 10,377 bytes
- numpy.json: 9,411 bytes
- jax.json: 8,028 bytes
- polars.json: 8,014 bytes
- dask.json: 6,274 bytes

**Smallest Content Files:**
- embeddings.json: 133 bytes
- rerankers.json: 125 bytes
- sklearn.json: 2,644 bytes
- transformers.json: 2,275 bytes
- tesseract.json: 3,115 bytes

---

## 11. Schema Inspection

### Package Schema

**Shared Fields:**
- created_at (string, date)
- updated_at (string, date)
- sources (array of strings)
- github_repo (string)
- id (string)
- name (string)
- version (string)
- install (string)
- import_as (string)
- summary (string)

**Package-Specific Fields:**
- tasks (array of task objects)
- alternatives (array of alternative objects)

**Task Object Fields:**
- task (string)
- mental_trigger (string)
- syntax (string)
- important_params (array of strings)
- example (string)
- use_when (string)
- avoid_when (string)
- decision_notes (string)
- gotchas (array of strings)
- official_docs (string)
- related_workflows (array of strings)
- related_cheatsheets (array of strings)

**Optional Fields:**
- aliases (array of strings) - present in numpy.json, xgboost.json

**Required Fields:**
- All fields listed above appear to be required based on consistency across files

**Content Consistency:**
- All 6 packages follow the same schema
- Field order is consistent
- Data types are consistent

**Validation Consistency:**
- No validation errors observed
- All arrays are properly formatted
- All strings are properly quoted

### Model Schema (ML/DL/LLM)

**Shared Fields:**
- created_at (string, date)
- updated_at (string, date)
- sources (array of strings)
- github_repo (string) - optional, not present in all models
- id (string)
- name (string)
- category (string)
- problem_types (array of strings)
- summary (string)
- use_when (string)
- avoid_when (string)
- pros (array of strings)
- cons (array of strings)
- key_hyperparams (array of hyperparam objects)
- training_speed (string)
- inference_speed (string)
- memory_usage (string)
- interpretability (string)
- quick_start (string)
- decision_notes (string)
- alternatives (array of alternative objects)
- competitors (array of competitor objects)
- related_workflows (array of strings)

**Hyperparam Object Fields:**
- name (string)
- default (string or number)
- note (string)

**Alternative/Competitor Object Fields:**
- id (string)
- type (string)

**Optional Fields:**
- github_repo - not present in cohere-reranker-v3.json, text-embedding-3-large.json
- aliases - present in xgboost.json, llama3.json, rag.json

**Required Fields:**
- All fields except github_repo appear to be required

**Content Consistency:**
- All 21 models follow the same schema
- Field order is consistent
- Data types are consistent
- ML, DL, and LLM models use identical schema

**Validation Consistency:**
- No validation errors observed
- All arrays are properly formatted
- All strings are properly quoted

### Workflow Schema

**Shared Fields:**
- created_at (string, date)
- updated_at (string, date)
- sources (array of strings)
- github_repo (string) - optional
- id (string)
- name (string)
- type (string)
- category (string)
- overview (string)
- starter_stack (array of strings)
- steps (array of step objects)
- evaluation_checks (array of strings)
- next_links (array of strings)
- common_failure_points (array of strings)

**Step Object Fields:**
- step (number)
- name (string)
- what (string)
- tools (array of strings)
- decision (string)
- uses (object with packages, models, cheatsheets arrays)
- failure_points (array of strings)

**Optional Fields:**
- github_repo - not present in rag.json
- aliases - present in rag.json

**Required Fields:**
- All fields except github_repo appear to be required

**Content Consistency:**
- All 3 workflows follow the same schema
- Field order is consistent
- Data types are consistent

**Validation Consistency:**
- No validation errors observed
- All arrays are properly formatted
- All strings are properly quoted

### Cheatsheet Schema

**Shared Fields:**
- created_at (string, date)
- updated_at (string, date)
- sources (array of strings)
- id (string)
- name (string)
- entries (array of entry objects)

**Entry Object Fields:**
- problem (string)
- trigger (string)
- snippet (string)
- minimal_notes (string)
- common_bug (string)
- docs_url (string)

**Optional Fields:**
- None identified

**Required Fields:**
- All fields appear to be required

**Content Consistency:**
- All 5 cheatsheets follow the same schema
- Field order is consistent
- Data types are consistent

**Validation Consistency:**
- No validation errors observed
- All arrays are properly formatted
- All strings are properly quoted

### Registry Schema

**Shared Fields:**
- id (string)
- task (string)
- size_mb (number)
- link (string)

**Optional Fields:**
- None identified

**Required Fields:**
- All fields appear to be required

**Content Consistency:**
- All 7 registry files follow the same schema
- Field order is consistent
- Data types are consistent

**Validation Consistency:**
- No validation errors observed
- All arrays are properly formatted
- All strings are properly quoted

### Navigation Schema

**Package Navigation (_nav.json):**
- id (string)
- name (string)
- type (string)
- updated_at (string, date)
- version (string)

**Model Navigation (_nav.json):**
- id (string)
- name (string)
- type (string)
- updated_at (string, date)
- category (string)

**Workflow Navigation (_nav.json):**
- id (string)
- name (string)
- type (string)
- updated_at (string, date)

**Cheatsheet Navigation (_nav.json):**
- id (string)
- name (string)
- type (string)
- updated_at (string, date)

**Content Consistency:**
- All 8 navigation files follow consistent schemas
- Field order is consistent within each type
- Data types are consistent

**Validation Consistency:**
- No validation errors observed
- All arrays are properly formatted
- All strings are properly quoted

---

## 12. File Organization

### Folder Structure

```
data/
├── packages/
│   ├── _nav.json
│   ├── cupy.json
│   ├── dask.json
│   ├── jax.json
│   ├── numpy.json
│   ├── pandas.json
│   └── polars.json
├── models/
│   ├── ml/
│   │   ├── _nav.json
│   │   ├── easyocr.json
│   │   ├── extra-trees-classifier.json
│   │   ├── gradient-boosting-classifier.json
│   │   ├── lightgbm.json
│   │   ├── random-forest.json
│   │   ├── tesseract.json
│   │   └── xgboost.json
│   ├── dl/
│   │   ├── _nav.json
│   │   ├── faster-whisper.json
│   │   ├── lstm.json
│   │   ├── mamba.json
│   │   ├── resnet-50.json
│   │   ├── rwkv.json
│   │   └── transformer.json
│   └── llm/
│       ├── _nav.json
│       ├── cohere-reranker-v3.json
│       ├── gemma-2.json
│       ├── gte-large.json
│       ├── llama-3-8b.json
│       ├── llama3.json
│       ├── mistral-7b.json
│       ├── paligemma.json
│       ├── qwen-2.json
│       ├── text-embedding-3-large.json
│       └── whisper-large-v3.json
├── registry/
│   ├── embeddings.json
│   ├── llms.json
│   ├── multimodal.json
│   ├── ocr.json
│   ├── rerankers.json
│   ├── speech.json
│   └── vision.json
├── workflows/
│   ├── _nav.json
│   ├── fine-tuning-lora.json
│   ├── rag.json
│   └── text-classification.json
└── cheatsheets/
    ├── _nav.json
    ├── numpy-cheatsheet.json
    ├── pandas-cheatsheet.json
    ├── pytorch.json
    ├── sklearn.json
    └── transformers.json
```

### JSON Organization

**Naming Convention:**
- Content files: kebab-case (e.g., `fine-tuning-lora.json`, `text-embedding-3-large.json`)
- Navigation files: `_nav.json`
- Model subdirectories: `ml`, `dl`, `llm` (lowercase abbreviations)

**Naming Consistency:**
- Consistent kebab-case across all content files
- Navigation files consistently named `_nav.json`
- Model categories use standard abbreviations

### File Size Distribution

**Package Files:**
- Largest: pandas.json (10,377 bytes)
- Smallest: cupy.json (6,032 bytes)
- Average: 8,020 bytes
- Total: 48,140 bytes

**ML Model Files:**
- Largest: lightgbm.json (5,137 bytes)
- Smallest: tesseract.json (3,115 bytes)
- Average: 4,296 bytes
- Total: 30,074 bytes

**DL Model Files:**
- Largest: lstm.json (4,768 bytes)
- Smallest: transformer.json (2,135 bytes)
- Average: 4,030 bytes
- Total: 24,180 bytes

**LLM Model Files:**
- Largest: llama-3-8b.json (4,634 bytes)
- Smallest: llama3.json (2,196 bytes)
- Average: 4,088 bytes
- Total: 40,880 bytes

**Registry Files:**
- Largest: llms.json (494 bytes)
- Smallest: rerankers.json (125 bytes)
- Average: 254 bytes
- Total: 1,781 bytes

**Workflow Files:**
- Largest: fine-tuning-lora.json (7,618 bytes)
- Smallest: rag.json (7,152 bytes)
- Average: 7,487 bytes
- Total: 22,461 bytes

**Cheatsheet Files:**
- Largest: pytorch.json (4,227 bytes)
- Smallest: sklearn.json (2,644 bytes)
- Average: 3,421 bytes
- Total: 17,106 bytes

**Navigation Files:**
- Largest: models/llm/_nav.json (1,367 bytes)
- Smallest: workflows/_nav.json (405 bytes)
- Average: 688 bytes
- Total: 5,506 bytes

**Total Data Directory Size:** ~190 KB

---

## 13. Observations and Findings

### Content Completeness

**Strengths:**
- Comprehensive coverage of core ML/DL/LLM libraries
- Detailed hyperparameter documentation for all models
- Consistent schema across all content types
- Rich decision_notes and gotchas sections
- Strong cross-linking between workflows and related content

**Gaps (Factual Observations):**
- Registry has 6 entries pointing to "MISSING_MODEL"
- No architecture documentation for most DL models
- No tensor shape information for most models
- No layer documentation for most models
- Limited prompt engineering documentation for LLMs
- No agent references in LLM models
- No serving information for most models
- No official documentation, GitHub, paper, tutorial, installation, ecosystem, community, release notes, or version information in registry entries

### Cross-Link Coverage

**Well-Connected:**
- pandas → 3 workflows
- numpy → 1 workflow, 1 cheatsheet
- jax → 1 workflow
- llama-3-8b → 2 workflows
- mistral-7b → 2 workflows
- gte-large → 1 workflow
- cohere-reranker-v3 → 1 workflow

**Poorly Connected:**
- cupy → 0 workflows, 0 cheatsheets
- dask → 0 workflows, 0 cheatsheets
- polars → 0 workflows, 0 cheatsheets
- All ML models → 0 workflows
- All DL models → 0 workflows
- 6 LLM models → 0 workflows
- PyTorch cheatsheet → 0 packages, 0 workflows
- Registry → 0 packages, 0 workflows

### Schema Consistency

**Strengths:**
- Highly consistent schemas within each content type
- Clear separation between content types
- Standardized field names across similar content
- Navigation files follow predictable patterns

**Variations:**
- github_repo is optional in models (not present in API-only models)
- aliases field appears in only some files (numpy, xgboost, llama3, rag)
- Registry schema is minimal compared to other content types

### File Organization

**Strengths:**
- Logical hierarchical structure
- Clear separation by content type
- Consistent naming conventions
- Navigation files in each directory

**Areas for Note:**
- Model subdirectories use abbreviations (ml, dl, llm)
- Some registry entries have missing model links
- No search directory content inspected (3 items in search/ not audited)

---

## 14. Audit Conclusion

This audit provides a complete inventory of the AENS knowledge system as of June 29, 2026. The system contains 48 content items across 6 content types, with consistent schemas and generally high-quality documentation.

**Key Statistics:**
- 6 Packages with 24 total tasks
- 21 Models with 80 total hyperparameters documented
- 11 Registry entries (6 with missing model links)
- 3 Workflows with 18 total steps
- 5 Cheatsheets with 21 total entries

**Cross-Link Status:**
- 15 package-to-workflow links
- 4 model-to-workflow links
- 5 registry-to-model links (valid)
- 6 registry-to-model links (missing)
- 5 workflow-to-cheatsheet links
- 2 package-to-cheatsheet links

The system is well-structured with consistent schemas, but has opportunities for improved cross-linking and completion of missing registry entries.

---

**Audit Completed:** June 29, 2026  
**Audit Type:** Read-only inspection  
**Next Steps:** This report serves as the baseline for AENS v2 architecture redesign.
