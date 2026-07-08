
---

# AENS Canonical Package Task Taxonomy (v1)

Every Package page should reuse these tasks whenever applicable.

Some packages may skip certain tasks (e.g., CUDA packages won't have "Text Generation"), but the taxonomy remains stable.

---

# 1. Installation

Answers

> How do I install this package?

Include

* pip
* uv
* conda
* source install
* Docker
* nightly builds
* CUDA builds
* version compatibility

---

# 2. Environment Setup

Include

* Python versions
* CUDA versions
* cuDNN
* virtual environment
* dependencies
* verification commands

---

# 3. Import & Initialization

Include

```python
import torch

torch.manual_seed(42)

device = ...
```

---

# 4. Core Data Structures

Examples

PyTorch

* Tensor
* Storage
* Device
* Dtype

Transformers

* Tokenizer
* BatchEncoding

Pandas

* DataFrame
* Series

---

# 5. Common Operations

Examples

Tensor creation

reshape

concatenate

broadcast

clone

detach

transpose

etc.

---

# 6. Data Loading

Include

* Dataset
* DataLoader
* batching
* shuffling
* multiprocessing
* streaming

---

# 7. Model Construction

Examples

```python
nn.Module

Sequential

Custom Modules
```

---

# 8. Training

Include

* forward
* backward
* optimizer
* scheduler
* loss
* epoch
* batch

---

# 9. Validation & Evaluation

Include

```text
evaluation mode

metrics

accuracy

precision

recall

F1

ROC

etc.
```

---

# 10. Inference

Production inference

batch inference

streaming inference

GPU inference

CPU inference

---

# 11. Saving & Loading

Include

checkpoint

weights

state_dict

serialization

safe loading

version compatibility

---

# 12. GPU & Hardware Usage

Include

CUDA

MPS

CPU

multi-GPU

device placement

pin memory

---

# 13. Performance Optimization

Include

mixed precision

torch.compile

batch size

prefetching

workers

memory pinning

benchmarking

profiling

---

# 14. Distributed Computing

Include

DDP

FSDP

DeepSpeed

Ray

Accelerate

---

# 15. Deployment

Include

TorchScript

ONNX

TensorRT

Docker

Serving

FastAPI

vLLM

Triton

---

# 16. Debugging

Examples

shape mismatch

gradient issues

CUDA

NaN

deadlock

OOM

device mismatch

---

# 17. Best Practices

Real engineering advice.

Not theory.

---

# 18. Common Mistakes

Examples

forgetting

```python
model.eval()
```

wrong device

memory leak

grad accumulation

etc.

---

# 19. Ecosystem

Related packages

Examples

PyTorch

↓

TorchVision

TorchAudio

TorchText

Lightning

Accelerate

DeepSpeed

Transformers

PEFT

TRL

Safetensors

Datasets

Evaluate

etc.

---

# 20. Production Checklist

Example

✓ version pinned

✓ deterministic seed

✓ logging

✓ monitoring

✓ checkpointing

✓ tests

✓ reproducibility

✓ profiling

✓ deployment verified

---

# 21. Official Resources

Include

Official Docs

GitHub

Tutorials

Release Notes

API Docs

Community

RFCs

Research Papers (if relevant)

---

# 22. Version & Compatibility

Include

Python

CUDA

OS

Breaking Changes

Migration

Supported Hardware

Known Issues

---

# Engineering Hierarchy

Now your Package page becomes extremely predictable.

```
Package

│

├── Overview

├── Installation

├── Environment Setup

├── Import & Initialization

├── Core Data Structures

├── Common Operations

├── Data Loading

├── Model Construction

├── Training

├── Validation

├── Inference

├── Saving & Loading

├── GPU & Hardware

├── Performance Optimization

├── Distributed Computing

├── Deployment

├── Debugging

├── Best Practices

├── Common Mistakes

├── Ecosystem

├── Production Checklist

├── Compatibility

└── Official Resources
```

---
