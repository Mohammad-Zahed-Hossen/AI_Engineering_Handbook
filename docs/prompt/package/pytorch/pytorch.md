# Generate Production-Ready AENS Package Resource for PyTorch

I am building an AI Engineering knowledge system (AENS).

This is **NOT** a documentation website.

It is also **NOT** a tutorial.

I need you to generate a **production-ready Markdown file** that I can later convert almost directly into my JSON package format.

The goal is to build a package page that helps engineers quickly find and recall the correct **PyTorch API** while implementing deep learning systems.

---

# Objective

Create a single file:

```
pytorch.md
```

This file should contain approximately **150–180 carefully selected implementation tasks** that cover the APIs responsible for the vast majority of real-world PyTorch usage.

Do **not** attempt to document the entire library.

Follow the **80/20 principle**.

Skip APIs that are:

- experimental
- deprecated
- legacy (e.g., `Variable`, `.data`, legacy distributed launch utilities)
- highly specialized research modules
- rarely used in production

Prioritize APIs engineers repeatedly use in:

- Deep Learning & Neural Network Design
- Model Training & Custom Loops
- Automatic Differentiation (Autograd)
- Distributed & Mixed Precision Training
- Model Serialization & Compilation (PyTorch 2.x)
- Production Inference & Serving
- Computer Vision (TorchVision integration)

*(Note: If Perplexity output limits cause truncation across 150–180 tasks, output category by category in sequential passes while preserving this exact task schema.)*

---

# AENS Ownership Rules (Strict)

This Package owns **implementation knowledge only**.

Include:

- library APIs
- implementation syntax
- parameters
- return values
- engineering usage
- production notes
- package conventions
- package-specific gotchas

Do **NOT** explain or duplicate knowledge owned by:

- Models (e.g., CNN, ResNet, Transformer architecture theory)
- Patterns (e.g., Gradient Accumulation, Training Loop, Checkpointing patterns)
- Workflows (e.g., Transfer Learning, Image Classification Pipelines)
- Principles (e.g., numerical stability, optimization theory)
- Decision Guides (e.g., CPU vs. GPU vs. TPU selection)
- Debug Guides (e.g., debugging NaN loss, out-of-memory errors)

Instead, every task should naturally expose relationships to those resources.

---

# What I Need

First generate package-level information.

Include:

- id (must be `pytorch`)
- title
- slug
- description
- name (must be `torch`)
- latest stable version
- supported Python versions
- summary
- install command
- import convention
- important namespaces
- official repository
- official documentation
- license
- maintainers
- created_at
- updated_at

---

# Package Architecture

Briefly describe the purpose of the major namespaces.

Include:

```
torch

torch.nn

torch.nn.functional

torch.optim

torch.utils.data

torch.cuda

torch.amp

torch.autograd

torch.distributed

torch.fx

torch.func

torchvision
```

Only explain what each namespace is used for.

Do not document every class.

---

# Generate Package Tasks

Generate approximately **150–180 implementation tasks**.

Each task should represent a real engineering operation rather than simply documenting a class.

Prefer action-oriented task names.

Categorize tasks into the following core operational areas:

---

## Core Tensor Operations

Include implementation tasks for:

- Create Tensor from Data / NumPy
- Create Special Tensors (zeros, ones, empty, rand, arange, linspace)
- Inspect Tensor Properties (dtype, shape, device, layout)
- Transfer Tensor Device (CPU, CUDA, MPS)
- Concatenate Tensors (torch.cat)
- Stack Tensors (torch.stack)
- Split Tensor into Chunks (torch.split, torch.chunk)
- Reshape Tensor View (torch.view)
- Reshape Tensor Copy/View (torch.reshape)
- Transpose Dimensions (torch.transpose, torch.permute)
- Squeeze and Unsqueeze Dimensions (torch.squeeze, torch.unsqueeze)
- Flatten Tensor Dimensions (torch.flatten)
- Element-wise Mathematical Operations
- Matrix Multiplication (torch.matmul, bmm)
- Tensor Reduction Operations (sum, mean, max, min, argmax)
- In-place Tensor Operations (add_, copy_)
- Contiguous Memory Layout (torch.contiguous)

---

## Autograd Operations

Include tasks for:

- Compute Tensor Gradients (backward)
- Access Computed Gradients (.grad)
- Detach Tensor from Computation Graph (detach)
- Disable Gradient Calculation (torch.no_grad)
- Inference Mode Execution (torch.inference_mode)
- Create Custom Autograd Function (torch.autograd.Function)
- Register Gradient Hook (register_hook)
- Retain Intermediate Gradients (retain_grad)
- Composable Vectorized Autograd (torch.func.vmap, torch.func.grad)

---

## Neural Network Layers (torch.nn)

Include implementation tasks for:

- Linear Layer (nn.Linear)
- 1D Convolution (nn.Conv1d)
- 2D Convolution (nn.Conv2d)
- 3D Convolution (nn.Conv3d)
- Max Pooling 2D (nn.MaxPool2d)
- Average Pooling 2D (nn.AvgPool2d)
- Adaptive Average Pooling 2D (nn.AdaptiveAvgPool2d)
- Batch Normalization (nn.BatchNorm2d)
- Layer Normalization (nn.LayerNorm)
- Group Normalization (nn.GroupNorm)
- Dropout Layer (nn.Dropout)
- Spatial Dropout (nn.Dropout2d)
- ReLU Activation (nn.ReLU)
- GELU Activation (nn.GELU)
- SiLU Activation (nn.SiLU)
- Softmax Activation (nn.Softmax)
- Scaled Dot-Product Attention (nn.functional.scaled_dot_product_attention)
- LSTM Layer (nn.LSTM)
- GRU Layer (nn.GRU)
- Multihead Attention (nn.MultiheadAttention)
- Transformer Encoder Layer (nn.TransformerEncoderLayer)
- Transformer Encoder (nn.TransformerEncoder)
- Sequential Container (nn.Sequential)
- Module List Container (nn.ModuleList)
- Module Dict Container (nn.ModuleDict)
- Parameter List Container (nn.ParameterList)

---

## Optimizers & Schedulers

Include tasks for:

- Stochastic Gradient Descent (optim.SGD)
- Adam Optimizer (optim.Adam)
- AdamW Optimizer (optim.AdamW)
- RMSprop Optimizer (optim.RMSprop)
- Zero Gradients (optimizer.zero_grad)
- Step Optimizer (optimizer.step)
- Step Learning Rate Scheduler (optim.lr_scheduler.StepLR)
- Exponential LR Scheduler (optim.lr_scheduler.ExponentialLR)
- Cosine Annealing LR Scheduler (optim.lr_scheduler.CosineAnnealingLR)
- Reduce LR On Plateau (optim.lr_scheduler.ReduceLROnPlateau)
- Parameter Groups Optimization

---

## Loss Functions

Include tasks for:

- Cross Entropy Loss (nn.CrossEntropyLoss)
- Binary Cross Entropy with Logits (nn.BCEWithLogitsLoss)
- Negative Log Likelihood Loss (nn.NLLLoss)
- Mean Squared Error Loss (nn.MSELoss)
- L1 Loss (nn.L1Loss)
- Huber Loss (nn.HuberLoss)
- Smooth L1 Loss (nn.SmoothL1Loss)
- Cosine Embedding Loss (nn.CosineEmbeddingLoss)
- CTCLoss (nn.CTCLoss)
- Custom Loss Reduction (reduction='none' / 'mean' / 'sum')

---

## Data Preparation & Loading

Include tasks for:

- Create Custom Map Dataset (utils.data.Dataset)
- Create Custom Iterable Dataset (utils.data.IterableDataset)
- Create DataLoader (utils.data.DataLoader)
- Batch Data Loading
- Parallel Data Loading (num_workers)
- Pin Memory for GPU Transfer (pin_memory)
- Custom Collate Function (collate_fn)
- Weighted Random Sampling (WeightedRandomSampler)
- Random Dataset Split (random_split)
- Subset Dataset (Subset)

---

## Model Training & Validation

Include implementation tasks for:

- Standard Forward-Backward Pass
- Evaluation Mode Toggle (model.eval())
- Training Mode Toggle (model.train())
- Clip Gradient Norm (nn.utils.clip_grad_norm_)
- Clip Gradient Value (nn.utils.clip_grad_value_)
- Manual Learning Rate Adjustment
- Metric Accumulation Loop
- Validation Loop Execution

---

## Mixed Precision Training (AMP)

Include tasks for:

- Automatic Mixed Precision Autocast (torch.amp.autocast with device_type)
- Gradient Scaler Initialization (torch.amp.GradScaler)
- Scaled Gradient Unscaling and Step (scaler.step)
- Scaler Update (scaler.update)
- Scaled Gradient Clipping

---

## Distributed Training

Include tasks for:

- Initialize Process Group (distributed.init_process_group)
- Distributed Data Parallel Wrapper (nn.parallel.DistributedDataParallel)
- Distributed Sampler (utils.data.distributed.DistributedSampler)
- Fully Sharded Data Parallel (torch.distributed.fsdp.FullyShardedDataParallel)
- Destroy Process Group (distributed.destroy_process_group)
- Torchrun Launcher Execution

---

## Serialization & Model Persistence

Include tasks for:

- Save Model State Dict (torch.save)
- Load Model State Dict with Safe Defaults (torch.load with weights_only=True)
- Save Checkpoint (Model, Optimizer, Epoch, Loss)
- Load Checkpoint across Devices (map_location)
- Export Model Weights to Safetensors

---

## Compilation & Export (PyTorch 2.x Focus)

Include tasks for:

- Compile Model with torch.compile
- Export Model Graph with torch.export
- Trace Model with torch.jit.trace (Legacy Migration)
- Script Model with torch.jit.script (Legacy Migration)
- Save TorchScript Model

---

## TorchVision Integration (v2 Focus)

Include tasks for:

- Load Pretrained Vision Model (torchvision.models)
- Apply Modern Image Transforms (torchvision.transforms.v2)
- Compose Vision Transforms (transforms.v2.Compose)
- Load ImageFolder Dataset (torchvision.datasets.ImageFolder)
- Modify Pretrained Classification Head

---

## Production Inference & Serving

Include tasks for:

- Model Warmup Pass
- Optimized Inference Execution (torch.inference_mode)
- Export Model to ONNX Format (torch.onnx.export)
- PyTorch Profiler Execution (torch.profiler.profile)
- TorchServe Model Archiver Setup

---

# Every Task Must Follow This Structure

## Task

Use an action-oriented title.

Example:

```
Standardize Numerical Features
```

---

## Problem Solved

One sentence describing the practical engineering problem.

---

## Mental Trigger

One short sentence written from an engineer's perspective.

Example:

> I need to compute gradients automatically during forward execution.

---

## Syntax

Provide the complete API signature.

Example

```python
torch.nn.Linear(in_features, out_features, bias=True, device=None, dtype=None)
```

---

## Important Parameters

List only the parameters engineers commonly modify.

Maximum five.

---

## Return Value

Describe the returned object.

---

## Example

Provide a complete runnable example.

Every example must:

- include imports
- use only PyTorch (plus NumPy/TorchVision where necessary)
- execute successfully
- use modern PyTorch 2.x APIs (`torch.amp.autocast`, `torch.inference_mode`, `torchvision.transforms.v2`, `torch.compile`)
- be copy-paste ready with self-contained mock data creation
- avoid deprecated methods (`Variable`, `.data`, `torch.cuda.amp.autocast`)

---

## Use When

Describe practical engineering situations.

---

## Avoid When

Explain when another API is preferable.

---

## Gotchas

Provide **3–5** implementation-specific pitfalls.

Examples include:

- forgetting `model.eval()` or `model.train()`
- in-place operations breaking autograd graph computation
- tensor device mismatch between inputs and parameters
- forgetting `optimizer.zero_grad()` before `loss.backward()`
- accumulative loss computation causing GPU memory leaks
- `torch.load` security vulnerabilities without `weights_only=True`
- overselling `torch.compile` unsupported dynamic shapes without `dynamic=True`

---

## Performance Notes

Mention:

- memory considerations (CUDA caching, in-place vs allocation)
- GPU/MPS acceleration behavior
- parallelization and dataloader worker interactions (`num_workers`, `pin_memory`)
- distributed scaling behavior
- determinism and reproducibility flags (`torch.use_deterministic_algorithms`)
- thread safety considerations

Only when relevant.

---

## Related APIs

List closely related APIs.

---

## Framework Migration Notes

Provide rich, concrete workflow comparisons for engineers migrating between frameworks. Avoid generic single-sentence statements.

Example:

> Coming from TensorFlow/Keras? PyTorch replaces implicit `model.fit()` callbacks with explicit training loop steps: `optimizer.zero_grad()`, `loss.backward()`, `optimizer.step()`. Replace `tf.data.Dataset` with `torch.utils.data.DataLoader`, and `tf.GradientTape` with `loss.backward()`.

---

## TensorFlow Equivalent

Provide explicit API-to-API mappings.

Example:

```
torch.nn.Linear → tf.keras.layers.Dense
```

If no direct equivalent exists, state "No direct equivalent."

---

## Version Compatibility

List exact version milestones, behavioral changes, security updates, and modern replacements. Avoid generic "Stable across 2.x" statements.

Example:

- **Introduced**: Introduced in PyTorch 2.0 (or version X.X)
- **Behavior Changes**: PyTorch 2.6 changed default serialization behavior to `weights_only=True` for security.
- **Deprecated**: `torch.cuda.amp.autocast` and `Variable` are deprecated.
- **Replacement**: Use `torch.amp.autocast(device_type='cuda')` and `torch.inference_mode()`.

---

## Search Metadata

Provide metadata to enhance search indexing:

- **Aliases**: Common alternative names or abbreviations (e.g., `Dense Layer`, `Linear Transformation`)
- **Common Search Terms**: Words engineers type when searching
- **Keywords**: Semantic search tags
- **Frequently Confused With**: Easily confused APIs (e.g., `ModuleList` vs `Sequential`, `torch.view` vs `torch.reshape`)

---

## Related Models

List specific, concrete canonical AENS Model IDs (kebab-case) that utilize this API. Do **not** use generic labels like `cnn` or `mlp`.

Valid Canonical Model IDs include:
- `resnet`
- `vit`
- `transformer`
- `yolo`
- `bert`
- `roberta`
- `t5`
- `bart`
- `gpt`
- `llama`
- `qwen`
- `gemma`
- `deepseek`
- `logistic-regression`
- `random-forest`
- `xgboost`

---

## Related Patterns

List specific canonical AENS Pattern IDs (kebab-case) associated with this API.

Valid Canonical Pattern IDs include:
- `training-loop`
- `validation-loop`
- `checkpointing`
- `gradient-accumulation`
- `mixed-precision`
- `early-stopping`
- `learning-rate-scheduling`
- `kv-cache`
- `speculative-decoding`
- `hyperparameter-search`
- `cross-validation`
- `feature-scaling`
- `feature-selection`

---

## Related Workflows

List specific canonical AENS Workflow IDs (kebab-case) that employ this API. Do **not** use generic labels like `feature-preprocessing`.

Valid Canonical Workflow IDs include:
- `image-classification-pipeline`
- `object-detection-pipeline`
- `transfer-learning-for-vision`
- `text-classification-pipeline-classical-encoder`
- `production-llm-cost-latency-optimization`

---

## Related Cheatsheet

List canonical kebab-case AENS Cheatsheet IDs related to this API.

Valid Canonical Cheatsheet IDs include:
- `pytorch`
- `tensor-operations`
- `autograd`
- `optimizers`
- `loss-functions`

---

## Related Decision Guides

List canonical kebab-case AENS Decision Guide IDs related to this API.

Valid Canonical Decision Guide IDs include:
- `hardware-selection-guide`
- `precision-tradeoffs-guide`
- `model-serving-frameworks`

---

## Official Documentation

Provide the **direct API documentation URL**.

Never use the homepage.

---

# Official Sources

Use the following priority order:

1. Official PyTorch documentation (pytorch.org/docs)
2. Official PyTorch API Reference
3. Official PyTorch Tutorials / User Guide
4. Official GitHub repository
5. Official release notes

Do not rely primarily on blogs or third-party tutorials.

---

# Quality Requirements

- Base all content on the latest stable PyTorch 2.x release.
- Every example must run without modification.
- Use modern APIs only (`torch.compile`, `torch.export`, `torch.amp.autocast`, `torch.inference_mode`, `torchvision.transforms.v2`, `torch.func`).
- Strictly avoid deprecated features (`Variable`, `.data`, legacy AMP).
- Ensure high accuracy on rapidly evolving APIs:
  - Provide realistic `torch.compile` guidance (mention compilation overhead and `dynamic=True` for varying shapes).
  - Clarify `torch.export` as the PyTorch 2.x graph export standard vs `torch.jit` (TorchScript legacy migration).
  - Explicitly recommend `torch.load(weights_only=True)` for security.
- Do not copy official documentation text.
- Write concise, engineer-focused explanations.
- Prioritize production usage over academic examples.
- Keep explanations implementation-focused.
- Avoid long conceptual discussions.
- Avoid machine learning theory.
- Prefer practical engineering examples over toy demonstrations.

---

# Output Format

Use consistent heading hierarchy.

Keep formatting uniform throughout.

Do **not** output JSON.

Do **not** output YAML.

Do **not** explain your reasoning.
