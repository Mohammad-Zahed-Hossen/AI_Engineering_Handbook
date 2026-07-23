00_package.md

Package Information
id: pytorch
title: PyTorch
slug: pytorch
description: A production-grade, Python-first deep learning and tensor computation package focused on flexible imperative programming, high-performance kernels, and a broad ecosystem for model development and deployment.
name: torch
latest stable version: 2.13.0
supported Python versions: 3.8, 3.9, 3.10, 3.11
summary: PyTorch provides multi-device tensor operations, automatic differentiation, neural network primitives, data loading utilities, compilation tooling, and distributed execution support for research and production systems.
install command: pip install torch --index-url https://download.pytorch.org/whl/cu118
import convention: import torch
important namespaces:

- torch
- torch.nn
- torch.nn.functional
- torch.optim
- torch.utils.data
- torch.cuda
- torch.autograd
- torch.amp
- torch.distributed
- torch.fx
- torch.func
- torchvision
official repository: https://github.com/pytorch/pytorch[^1]
official documentation: https://docs.pytorch.org/ (versioned docs available)[^2][^3]
license: BSD-style (BSD + PATENTS where applicable as published in the repository)[^1]
maintainers: PyTorch organization (primary maintainers: Meta AI, AWS, Microsoft, and community contributors as coordinated through the pytorch GitHub org)[^4][^1]
created_at: 2016-09-01
updated_at: 2026-07-21

Installation

- Recommended pip installation: Use the official wheel index and select the appropriate CUDA tag via the PyTorch Get Started selector; example canonical install uses the PyTorch wheel index and appropriate CUDA tag for the target environment.[^5][^2]
- CUDA installation guidance (reference only): Install CUDA-enabled PyTorch builds from the official wheel index matching your CUDA driver and runtime; consult the PyTorch installation selector for binary compatibility and supported CUDA versions.[^2][^5]
- CPU-only installation: Use the official CPU wheels or select the cpu-only option on the official installer to obtain a CPU-only torch wheel.[^5][^2]
- Verification command: Verify the install by importing torch and checking torch.__version__ and torch.cuda.is_available() in the runtime (use the versioned docs to confirm expected version strings).[^2]
- Optional TorchVision and TorchAudio installation: Install torchvision and torchaudio from the same official index with matching versions to ensure binary compatibility with torch; use the official install selector to pick matching pairs.[^4][^5]
- Version compatibility considerations: Match torch, torchvision, and torchaudio to the same minor release series where required; prefer the official binary pairs from the PyTorch installer to avoid ABI or CUDA mismatches.[^5][^2]

Import Convention

- Recommended imports: import torch; import torch.nn as nn; import torch.optim as optim; import torch.utils.data as data.[^2]
- Alias conventions: Use nn for torch.nn, F for torch.nn.functional, optim for torch.optim, and DataLoader/ Dataset names from torch.utils.data; keep aliases short and consistent across the codebase.[^2]
- Common namespace imports: Prefer importing subpackages by namespace (torch, torch.nn, torch.optim, torch.utils.data) rather than large wildcard imports to maintain readability and static analysis.[^2]
- Package organization conventions: Group core imports at module top, keep device and dtype configuration centralized, and maintain a clear separation between model definition modules, data pipeline modules, and training/evaluation orchestration modules.[^2]

Namespace Overview
torch

- Primary responsibility: Core tensor type, multi-device dispatch, primitive numerical operations, and top-level utilities for the package.[^2]
- Common engineering usage: Create and manipulate tensors, move data across devices, access runtime configuration and global helpers.[^2]
- Relationship with other namespaces: Serves as the base for all higher-level APIs (nn, autograd, cuda) and provides primitive operations consumed by other namespaces.[^2]

torch.nn

- Primary responsibility: Modular neural network building blocks and the Module abstraction for composing models.[^2]
- Common engineering usage: Define model components as modules, register parameters and buffers, and organize reusable layers and containers.[^2]
- Relationship with other namespaces: Relies on torch for tensor ops, interacts with torch.autograd for gradients, and pairs with torch.optim for parameter updates.[^2]

torch.nn.functional

- Primary responsibility: Stateless functional implementations of common neural network operations (activation functions, loss functions, etc.).[^2]
- Common engineering usage: Use directly when writing lower-level operations or when needing functional forms inside Modules; prefer for operations that do not require parameter state.[^2]
- Relationship with other namespaces: Complements torch.nn by providing functional alternatives; used by both nn Modules and custom training code.[^2]

torch.optim

- Primary responsibility: Optimizer implementations and update rules for parameter optimization.[^2]
- Common engineering usage: Instantiate optimizers with model.parameters(), manage learning-rate schedules, and step optimizers during training loops.[^2]
- Relationship with other namespaces: Consumes parameters registered by torch.nn, often used together with torch.autograd gradient information.[^2]

torch.utils.data

- Primary responsibility: Data loading primitives, Dataset and DataLoader patterns, and I/O utilities for batching and parallel loading.[^2]
- Common engineering usage: Implement Dataset subclasses, create DataLoader instances with samplers and collate functions, and separate data preprocessing from model logic.[^2]
- Relationship with other namespaces: Produces tensors consumed by model and training loops; common integration point for torchvision transforms.[^2]

torch.cuda

- Primary responsibility: Device management, CUDA stream and memory utilities, and device-specific kernels.[^2]
- Common engineering usage: Move tensors and models to devices, manage device contexts, and query CUDA runtime availability and properties.[^2]
- Relationship with other namespaces: Interacts with torch tensors for device placement and with autograd and amp for device-aware computation.[^2]

torch.autograd

- Primary responsibility: Automatic differentiation engine that records operations and computes gradients via backward passes.[^2]
- Common engineering usage: Enable gradient tracking for tensors, inspect computation graphs when necessary, and compute parameter gradients for optimizers.[^2]
- Relationship with other namespaces: Underpins torch.nn training, consumed by torch.optim, and interacts with torch.func and torch.fx tools for transformations.[^2]

torch.amp

- Primary responsibility: Automatic mixed precision utilities (autocast, GradScaler) for performance- and memory-efficient training.[^2]
- Common engineering usage: Wrap forward passes with autocast and scale gradients via GradScaler when using mixed precision on supported devices.[^2]
- Relationship with other namespaces: Works with torch.cuda, torch.autograd, and torch.optim to safely apply lower-precision kernels where appropriate.[^2]

torch.distributed

- Primary responsibility: Distributed training primitives, collective communication, and process group abstractions for multi-process/multi-node execution.[^2]
- Common engineering usage: Initialize process groups, perform collective operations for synchronized training, and integrate with high-level launch and RPC utilities.[^2]
- Relationship with other namespaces: Coordinates model and optimizer state across processes and integrates with serialization and checkpointing workflows.[^2]

torch.fx

- Primary responsibility: Program capture and IR for ephemeral graph transformations and compiler toolchains.[^6]
- Common engineering usage: Trace and transform Python functions or modules into manipulable graphs for optimization, instrumentation, or compilation.[^6]
- Relationship with other namespaces: Consumes torch.nn and torch operations to produce IR; used by compilation and optimization tooling.[^6][^2]

torch.func

- Primary responsibility: Functional-style APIs enabling stateless transforms, composable transformations, and higher-order function utilities.[^2]
- Common engineering usage: Write transforms that accept and return pure functions or stateless callables to integrate with compilation/functional workflows.[^2]
- Relationship with other namespaces: Complements fx by enabling runtime and compile-time function transformations; interoperates with autograd.[^2]

torchvision

- Primary responsibility: Domain-specific vision datasets, models, and transforms that complement core torch data and model workflows.[^4]
- Common engineering usage: Provide datasets, preprocessing pipelines, and reference model implementations for vision tasks that plug into torch training loops.[^4]
- Relationship with other namespaces: Sits in the ecosystem alongside torch, producing DataLoader-ready datasets and models implemented with torch.nn primitives.[^4]

Version Compatibility

- Supported Python versions: Officially supports Python 3.8–3.11 for the 2.13 release series; consult the version selector for exact minor patch support.[^3][^2]
- Latest stable release: 2.13.0 as the current stable 2.x line at the time of this document.[^7][^3]
- Semantic versioning policy: PyTorch follows a minor-release cadence for feature and performance improvements while reserving major version bumps for breaking changes; follow release notes for specific compatibility notes.[^8][^7]
- Backward compatibility expectations: Minor 2.x releases maintain broad backward compatibility for common APIs, but some low-level or deprecated internals may change; consult release notes before upgrading.[^7][^8]
- Important PyTorch 2.x modernization: The 2.x series emphasizes compilation and graph-based transforms (torch.compile, FX/func workflows), improved performance backends, and a consolidation of functional and compile-time tooling.[^6][^2]
- Major deprecated legacy features: Legacy Variable wrapper, use of .data for direct tensor buffer access, legacy AMP (older apex-style wrappers), and older distributed launch utilities are deprecated or replaced in modern 2.x workflows.[^7][^2]
- Migration considerations from older releases: Migrate away from Variable and .data patterns, adopt torch.amp and GradScaler for mixed precision, and transition to the new distributed and launch helpers documented in migration guides.[^7][^2]

Architecture

- Core tensor computation: The package exposes a unified Tensor abstraction that dispatches to device-specific backends (CPU, CUDA, other accelerators) and provides elementwise, linear algebra, and reduction kernels optimized per backend. Higher-level modules and libraries call into these primitives for efficient computation.[^2]
- Automatic differentiation: The autograd engine traces operations and builds a backward graph that computes gradients; this mechanism is the foundation for optimizer updates and integrates with both eager and transformed/compiled execution modes.[^2]
- Neural network construction: The nn.Module abstraction provides stateful composition and parameter management; Modules use core tensor ops and autograd for forward/backward behavior and interoperate with functional counterparts.[^2]
- Optimization: torch.optim provides optimizer algorithms that consume gradients produced by autograd and update registered parameters; scheduling and stateful optimizers are externalized to maintain separation from model definitions.[^2]
- Data loading: torch.utils.data implements Dataset and DataLoader patterns with configurable samplers and multiprocessing workers to decouple I/O and preprocessing from model compute.[^2]
- Distributed execution: torch.distributed provides process groups, collectives, and sharding primitives enabling synchronous and asynchronous multi-process, multi-node training; it coordinates with serialization and checkpointing to maintain consistent model state.[^2]
- Compilation and transforms: torch.fx and torch.func provide program capture and functional transforms that feed into compilation paths (including torch.compile) to generate optimized kernels or graph-lowered code for target backends.[^6][^2]
- Inference: Inference workflows rely on inference-mode contexts, optimized kernels, and optional compilation to minimize runtime overhead; models are typically exported, scripted, or compiled for faster serving paths.[^2]
- Model serialization: State dictionaries and the recommended state_dict()/load_state_dict() pattern provide a stable, portable approach for saving model parameters and optimizer state across environments and release versions.[^2]
- TorchVision integration: TorchVision supplies domain-specific datasets, transforms, and model architectures implemented on torch.nn primitives and designed to be compatible with torch.data pipelines and deployment tooling.[^4]

Package-level Best Practices

- Prefer state_dict() serialization for models and optimizers to maintain portability and avoid pickling internals.[^2]
- Keep tensors on consistent devices during batched operations to avoid implicit copies or device transfers.[^2]
- Use torch.inference_mode() or torch.no_grad() for inference to skip autograd bookkeeping and reduce memory overhead.[^2]
- Use GradScaler and torch.amp.autocast for mixed-precision training on supported hardware to balance speed and numerical stability.[^2]
- Design models as modular nn.Module components to simplify testing, serialization, and reuse.[^2]
- Separate data loading and preprocessing from training loops; encapsulate datasets and collate logic in torch.utils.data components.[^2]
- Prefer deterministic algorithms and set global seeds when reproducibility is required; record environment and library versions.[^2]
- Avoid unnecessary tensor copies; prefer in-place ops only when safe and well-documented to reduce memory churn.[^2]
- Keep device placement explicit and centralize device configuration rather than scattering device.to() calls.[^2]
- Use official binary pairs for torch, torchvision, and torchaudio to ensure ABI and CUDA compatibility.[^5]
- Use the fx/func/compile toolchain for production paths where deterministic, optimized kernels are required.[^6][^2]
- Organize checkpoints with metadata (version, random seeds, hyperparameters) to make upgrades and reproducibility practical.[^2]
- Prefer high-level distributed primitives where possible and isolate low-level communication code to dedicated modules.[^2]
- Validate dtype and device consistency at module boundaries to prevent implicit casts or slow host-device transfers.[^2]
- Use inference-specific contexts and avoid retaining computation graphs during evaluation to reduce peak memory.[^2]

Package-level Gotchas

- CPU/GPU device mismatch: Passing tensors on different devices into the same operation triggers runtime errors or implicit host-device transfers that degrade performance; ensure device consistency before compute.[^2]
- dtype inconsistency: Mixing dtypes (float32, float16, bfloat16) across operations can produce implicit casts, numerical instability, or unsupported kernel dispatches; manage dtypes explicitly.[^2]
- Forgetting model.eval(): Failing to switch models to evaluation mode leaves certain modules (dropout, batchnorm) in training behavior which changes inference results and metrics.[^2]
- Forgetting optimizer.zero_grad(): Omitting gradient clearing accumulates gradients across steps, leading to incorrect updates unless accumulation is intentional and managed.[^2]
- Non-deterministic training behavior: Certain CUDA kernels and algorithm selections are non-deterministic by default; deterministic mode or algorithm selection is required for reproducible runs.[^2]
- Hidden memory growth: Retaining references to computation graph-temporaries or storing tensors in lists can silently increase GPU memory usage over time.[^2]
- Serialization compatibility: Unversioned pickles or saving entire model objects may break across PyTorch releases; prefer state_dict-based serialization for long-term compatibility.[^2]
- Mixed precision misuse: Applying autocast incorrectly or scaling gradients improperly can produce NaNs or silent training collapse; pair autocast with GradScaler where applicable.[^2]
- Legacy API usage: Relying on deprecated constructs such as Variable, .data, or legacy AMP wrappers can produce subtle bugs and incompatibilities with modern tooling.[^2]
- Inconsistent optimizer/model state: Saving and restoring checkpoints without consistent mapping between model parameters and optimizer state can lead to mismatched state and failed resumes.[^2]
- Distributed setup mismatches: Mismatched environment variables, backend selection, or process group initialization can produce deadlocks or incorrect all-reduce behavior.[^2]
- Implicit autograd retention: Holding onto tensors that require grad outside a training step can retain computation graphs and increase memory pressure.[^2]
- Overuse of in-place ops: In-place operations can break gradient computation when views or saved tensors are expected by autograd.[^2]
- Version-specific binary incompatibility: Mixing binaries built for different CUDA/toolkit versions or different PyTorch minor releases can cause runtime failures or subtle correctness issues.[^8][^5]
- Excessive multiprocessing in DataLoader: Using too many worker processes without tuning can harm stability in some platforms and increase complexity for debugging.[^2]

Official Resources

- Official Documentation: PyTorch Documentation (versioned) — https://docs.pytorch.org/[^3][^2]
- API Reference: PyTorch API Reference (within official docs) — https://docs.pytorch.org/[^2]
- Tutorials: Official PyTorch Tutorials (Get started and domain tutorials) — https://pytorch.org/tutorials/[^2]
- Get Started Guide: PyTorch Get Started / Installation and Basics (official installer and selector) — https://pytorch.org/get-started/[^5]
- Installation Guide: Installation Instructions and Wheels (official platform selector) — https://pytorch.org/get-started/previous-versions/ and installer pages[^5]
- GitHub Repository: pytorch/pytorch — https://github.com/pytorch/pytorch[^1]
- Release Notes: Official Release Notes and announcements (PyTorch dev-discuss and GitHub releases) — https://github.com/pytorch/pytorch/releases and release announcements[^8][^7]
- Migration Guide: Official migration notes and deprecation notices in the docs and release notes (see versioned docs and release announcements) — https://docs.pytorch.org/ and release notes pages[^7][^2]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^9]</span>

<div align="center">⁂</div>

[^1]: https://github.com/pytorch/pytorch

[^2]: https://docs.pytorch.org/docs/main/

[^3]: https://docs.pytorch.org/docs/versions.html

[^4]: https://github.com/pytorch

[^5]: https://pytorch.org/get-started/previous-versions/

[^6]: https://arxiv.org/pdf/2112.08429.pdf

[^7]: https://dev-discuss.pytorch.org/c/release-announcements/27

[^8]: https://github.com/pytorch/pytorch/releases

[^9]: AENS Knowledge Layer Specification.md

[^10]: directory_structure.md

[^11]: AI_CONTEXT.md

[^12]: AENS_CANONICAL_SPECIFICATION.md

[^13]: MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md

[^14]: https://arxiv.org/pdf/1912.01703.pdf

[^15]: http://arxiv.org/pdf/2412.04478.pdf

[^16]: https://arxiv.org/pdf/2304.14226.pdf

[^17]: https://arxiv.org/pdf/2412.18271.pdf

[^18]: https://arxiv.org/pdf/2503.13795.pdf

[^19]: https://pmc.ncbi.nlm.nih.gov/articles/PMC8542803/

[^20]: https://github.com/pytorch/pytorch.github.io

[^21]: https://github.com/pytorch/pytorch?search=1

[^22]: https://docs.pytorch.org/

