# Package Information

- id: tensorflow
- title: TensorFlow Package
- slug: tensorflow
- description: TensorFlow is a general-purpose machine learning framework centered on `tf.keras`, `tf.data`, `tf.distribute`, and deployment-oriented model serialization.[^1][^2]
- name: TensorFlow
- latest stable version: 2.21.0[^3][^2]
- supported Python versions: 3.10, 3.11, 3.12, 3.13[^1][^3]
- summary: Production ML framework for tensor computation, model building, training, distribution, and deployment across CPU, GPU, and edge targets.[^2][^1]
- install command: `pip install tensorflow` for CPU or `pip install tensorflow[and-cuda]` for supported Linux/WSL2 GPU installs.[^3][^1]
- import convention: `import tensorflow as tf`; use `tf.keras` for modern Keras-based model code.[^1]
- important namespaces: `tensorflow`, `tf.keras`, `tf.data`, `tf.distribute`, `tf.random`, `tf.linalg`, `tf.math`, `tf.image`, `tf.io`, `tf.saved_model`, `tf.lite`, `keras.applications`.[^1]
- official repository: [tensorflow/tensorflow](https://github.com/tensorflow/tensorflow).[^2]
- official documentation: [TensorFlow documentation](https://www.tensorflow.org/).[^4][^1]
- license: Apache License 2.0.[^5][^2]
- maintainers: Google TensorFlow team and contributors; the project’s package metadata lists `packages@tensorflow.org` in ecosystem indexes.[^6][^7]
- created_at: 2015-11-06.[^2]
- updated_at: 2026-03-12.[^1]


# Installation

Recommended installation is the current stable pip package after upgrading `pip`, with `tensorflow` for CPU-only environments and `tensorflow[and-cuda]` for supported Linux and WSL2 GPU environments.[^1]
For production environments that need CPU-only isolation, `tensorflow` is the standard package; for macOS, the official guide currently shows CPU installation only and notes no official GPU support.[^1]
Verification is typically done by importing TensorFlow and checking either a numeric tensor result or visible GPU devices, depending on the target environment.[^1]

Optional ecosystem packages commonly paired with TensorFlow include TensorBoard, TensorFlow Datasets, TensorFlow Hub, and TensorFlow Probability; these are official TensorFlow ecosystem components, while `tf.lite` is part of deployment tooling rather than a separate package.[^1]
Version compatibility should be managed carefully because TensorFlow 2.21 removes Python 3.9 support, and package compatibility is strongest when ecosystem add-ons are aligned to the same TensorFlow minor series.[^8][^1]

# Import Convention

The standard project-level import style is `import tensorflow as tf`, with `tf.keras` as the primary application-building namespace in modern TensorFlow 2.x projects.[^1]
Common organization patterns keep core framework imports in one module, model code in `tf.keras`-centric files, input pipelines in `tf.data` modules, and deployment/serialization code separate from training logic.[^1]
Alias conventions should stay simple and conventional; avoid inventing alternate aliases for the main framework import unless there is a strong local reason.[^1]

# Namespace Overview

`tensorflow` is the root package that ties together tensor operations, execution, distribution, serialization, and deployment across the full TensorFlow stack. It is the coordination layer for the rest of the namespaces and is the entry point for most production code.[^1]

`tf.keras` is the high-level model-building and training namespace for modern TensorFlow 2.x. It is the center of current TensorFlow application development and connects naturally to layers, models, losses, and optimizers.[^1]

`tf.keras.layers` provides reusable building blocks for model construction. It is used together with `tf.keras.models` and the rest of `tf.keras` to define architectures without dropping into lower-level tensor plumbing.[^1]

`tf.keras.models` manages model composition, persistence, and lifecycle-level model organization. It works with `tf.keras.layers` for construction and with SavedModel-oriented export paths for deployment.[^1]

`tf.keras.losses` contains training objective definitions used during model optimization. It sits between model outputs and optimizer updates, and is typically paired with `tf.keras.optimizers` inside `tf.keras` workflows.[^1]

`tf.keras.optimizers` contains parameter update logic for training. It is used in `tf.keras` training loops and usually depends on gradient information produced by TensorFlow’s automatic differentiation stack.[^1]

`tf.data` is TensorFlow’s input pipeline namespace for building performant, composable data pipelines. It is the standard bridge between raw datasets and model execution, especially for scalable training and distribution.[^1]

`tf.distribute` provides distributed training and multi-device execution strategies. It interacts closely with `tf.keras` and `tf.data` so models and input pipelines can scale across devices and machines.[^1]

`tf.random` provides random-number generation utilities used for initialization, sampling, and reproducibility-sensitive workflows. It is often paired with `tf.keras` and `tf.data` code when deterministic behavior matters.[^1]

`tf.linalg` groups linear algebra operations used throughout numerical model code. It supports lower-level tensor computation that underpins many higher-level `tf.keras` and training behaviors.[^1]

`tf.math` contains core mathematical tensor operations used across preprocessing, loss computation, metrics, and model internals. It is one of the fundamental building blocks beneath higher-level framework namespaces.[^1]

`tf.image` provides image tensor processing utilities for vision-oriented pipelines. It usually appears in `tf.data` preprocessing flows and feeds directly into `tf.keras` models.[^1]

`tf.io` covers input/output primitives for files, serialization formats, and data interchange. It commonly supports `tf.data` pipelines, SavedModel workflows, and deployment-related asset handling.[^1]

`tf.saved_model` is the serialization and export namespace for TensorFlow models intended for transport and serving. It bridges `tf.keras` model artifacts with deployment systems and long-term model interchange.[^1]

`tf.lite` is the deployment namespace for TensorFlow Lite conversion and on-device inference workflows. It is the primary path for edge-oriented exports from TensorFlow models.[^1]

`keras.applications` provides ready-made application architectures and pretrained model families associated with Keras. It complements `tf.keras` by offering standardized model families for transfer-learning-oriented workflows.[^1]

# Version Compatibility

TensorFlow 2.21.0 is the current stable release and supports Python 3.10 through 3.13.[^3][^2]
TensorFlow follows semantic versioning within the 2.x line, so minor releases are expected to preserve most user-facing compatibility while still allowing focused deprecations and ecosystem updates.[^8][^1]
Backward compatibility is strongest when staying on modern `tf.keras`, `tf.data`, `tf.distribute`, and SavedModel-based workflows rather than relying on legacy TensorFlow 1.x patterns.[^1]

Major TensorFlow 1.x features such as Sessions, placeholder-driven graphs, and Estimators are legacy concerns in the 2.x era and should be treated as migration topics rather than default design choices.[^1]
`tf.compat.v1` remains the main compatibility surface for older code, but it is not the preferred architecture for new TensorFlow projects.[^1]
A notable modernization shift is the move toward integrated `tf.keras`-centric workflows rather than standalone Keras as a separate primary integration model.[^1]

# Architecture

TensorFlow is organized around tensor computation, where the root package coordinates numeric operations, device placement, execution control, and serialization across the stack.[^1]
In modern TensorFlow 2.x, eager execution is the default development model, while graph execution is introduced through tracing and compilation boundaries when performance or portability is needed.[^1]
`tf.function` sits at the center of this bridge, converting Python-defined computation into traced graphs that can be optimized and reused by the runtime.[^1]

Automatic differentiation supports model training by connecting tensor operations to gradient computation, which then feeds optimizer updates in `tf.keras` workflows.[^1]
`tf.data` handles pipeline construction outside the model, letting input work stream efficiently into training and inference.[^1]
`tf.distribute` scales the same conceptual model across multiple devices or replicas, while mixed precision and backend optimizations help the runtime balance speed, memory use, and numerical cost.[^1]

Model serialization and deployment are centered on SavedModel and TensorFlow Lite, which move trained models from development-time `tf.keras` structures into serving, edge, or embedded environments.[^1]
The ecosystem is intentionally layered: low-level numeric namespaces support Keras model logic, Keras drives most application code, and serialization or deployment namespaces handle downstream delivery.[^1]

# TensorFlow Ecosystem

Keras is the main high-level modeling interface in TensorFlow 2.x and the default choice for most production model code. It provides the model construction layer that most TensorFlow projects build around.[^1]
TensorFlow Datasets supplies ready-to-use datasets that integrate cleanly with TensorFlow input pipelines. It is most useful when you want standard dataset loading behavior that fits `tf.data` workflows.[^1]
TensorBoard is the official visualization suite for inspecting training, metrics, graphs, and performance behavior. It complements TensorFlow development rather than replacing core modeling code.[^1]

TensorFlow Hub is the official repository and distribution mechanism for reusable model components and pretrained assets. It is useful when a project needs reusable building blocks rather than training everything from scratch.[^1]
TensorFlow Lite is the official edge and mobile deployment runtime path for TensorFlow models. It is focused on model conversion and compact inference rather than training.[^1]
TensorFlow Serving is the official production serving system for deploying models at scale. It complements SavedModel by providing a server-side inference layer.[^1]

TensorFlow Probability adds probabilistic modeling and uncertainty-aware computation on top of TensorFlow. It is an extension library rather than a core runtime component.[^1]
Keras Applications provides standard pretrained application families that are aligned with Keras and TensorFlow’s modern model stack. It is commonly used as a starting point for transfer learning and baseline architectures.[^1]

# Execution Modes

Eager execution is the default mode and makes TensorFlow behave like an imperative numerical programming system during development. It is the most direct model for debugging, inspection, and stepwise reasoning.[^1]
Graph execution is the traced, optimized execution form used when TensorFlow compiles Python-defined computation into reusable runtime graphs. It is most relevant for performance, portability, and deployment-oriented workflows.[^1]

`tf.function` is the primary mechanism that connects eager-style code to graph execution. It automatically traces Python control flow and tensor operations into graph form when the runtime sees a stable enough execution pattern.[^1]
Performance typically improves when repeated computation can be traced once and reused, but overly dynamic code can reduce tracing efficiency or cause repeated graph creation.[^1]

# Package-level Best Practices

- Prefer `tf.keras` as the default modeling surface for new TensorFlow code.[^1]
- Keep model definition, input pipeline, and deployment logic in separate modules.[^1]
- Use `tf.data` for production input pipelines instead of ad hoc Python iteration.[^1]
- Favor eager execution during development, then introduce `tf.function` where repetition or latency matters.[^1]
- Use SavedModel as the primary long-term model export format.[^1]
- Use `tf.distribute` when training needs more than one device or replica.[^1]
- Treat mixed precision as a performance and memory optimization, not a default assumption.[^1]
- Keep random seed handling consistent across TensorFlow and surrounding libraries.[^1]
- Align TensorFlow, Keras ecosystem packages, and deployment targets to compatible versions.[^1]
- Prefer stable, documented namespaces over legacy `tf.compat.v1` paths for new work.[^1]
- Choose `keras.applications` for standard pretrained backbones instead of reimplementing common model families.[^1]
- Keep serialization and inference artifacts separate from training-only checkpoints when possible.[^1]
- Validate tensor shapes and dtypes at module boundaries to reduce downstream breakage.[^1]
- Use `tf.io` and `tf.saved_model` for structured model/data interchange rather than custom ad hoc formats.[^1]


# Package-level Gotchas

- Eager code and graph-traced code can differ in control flow behavior, so logic that works interactively may behave differently once traced.[^1]
- `tf.function` can retrace too often when input shapes, dtypes, or Python-side control changes too much.[^1]
- Tensor shape mismatches often surface late in graph-heavy code, especially when model inputs are partially dynamic.[^1]
- Dtype inconsistencies can silently affect numerical behavior, memory use, and device compatibility.[^1]
- Device placement may not match intuition when TensorFlow moves tensors or ops across CPU and accelerator devices.[^1]
- `tf.data` pipelines can become the bottleneck when preprocessing, caching, or batching choices are suboptimal.[^1]
- Serialization formats are not always interchangeable across legacy and modern TensorFlow code paths.[^1]
- Mixed precision can introduce numeric instability if it is enabled without consistent type handling.[^1]
- Checkpoint and model compatibility can break when versions or export formats are mixed carelessly.[^1]
- Hidden memory growth may appear when graphs are retraced, datasets are recreated, or large tensors stay referenced longer than expected.[^1]
- Legacy TensorFlow 1.x code paths can behave differently from modern TensorFlow 2.x defaults and should not be assumed equivalent.[^1]
- `tf.compat.v1` can keep old code running, but it may obscure the intended 2.x architecture and complicate migration.[^1]
- Standalone Keras integration changes mean older code assumptions about package boundaries may no longer hold.[^1]


# Official Resources

- Official Documentation: [TensorFlow](https://www.tensorflow.org/).[^1]
- API Reference: [TensorFlow API docs](https://www.tensorflow.org/api_docs).[^1]
- Get Started Guide: [Install TensorFlow](https://www.tensorflow.org/install).[^1]
- Installation Guide: [Install TensorFlow with pip](https://www.tensorflow.org/install/pip).[^1]
- Tutorials: [TensorFlow tutorials](https://www.tensorflow.org/tutorials).[^1]
- TensorFlow Guide: [TensorFlow Guide](https://www.tensorflow.org/guide).[^1]
- GitHub Repository: [tensorflow/tensorflow](https://github.com/tensorflow/tensorflow).[^2]
- Release Notes: [TensorFlow releases](https://github.com/tensorflow/tensorflow/releases).[^2]
- Migration Guide: [TensorFlow migration guide](https://www.tensorflow.org/guide/migrate).[^1]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23][^24][^25][^26][^27][^9]</span>

<div align="center">⁂</div>

[^1]: https://arxiv.org/pdf/1712.06139.pdf

[^2]: https://github.com/tensorflow/tensorflow

[^3]: https://www.tensorflow.org/install/pip

[^4]: https://www.tensorflow.org/install

[^5]: https://github.com/tensorflow/runtime/blob/master/LICENSE

[^6]: https://repology.org/project/tensorflow/information

[^7]: https://pypistats.org/packages/tensorflow

[^8]: https://github.com/tensorflow/tensorflow/releases

[^9]: https://digital-library.theiet.org/content/conferences/10.1049/ic_20040212

[^10]: https://arxiv.org/pdf/1901.05350.pdf

[^11]: https://arxiv.org/pdf/1605.08695.pdf

[^12]: http://arxiv.org/pdf/2406.07944.pdf

[^13]: https://www.mdpi.com/2504-4990/4/4/45/pdf?version=1664984522

[^14]: https://dl.acm.org/doi/pdf/10.1145/3611643.3616364

[^15]: https://pmc.ncbi.nlm.nih.gov/articles/PMC10192349/

[^16]: https://pypi.org/project/tensorflow/

[^17]: https://www.tensorflow.org/versions

[^18]: https://docs.hpc.qmul.ac.uk/apps/ml/tensorflow/

[^19]: https://chromium.googlesource.com/external/github.com/tensorflow/tensorflow/+/refs/heads/upstream/exported_pr_863087508/RELEASE.md

[^20]: https://www.tensorflow.org/install/pip?hl=zh-tw

[^21]: https://tf.wiki/en/basic/installation.html

[^22]: https://engineering.purdue.edu/ECN/Support/KB/Docs/setup-tensorflow-in-windows-server-with-gpu

[^23]: http://arxiv.org/pdf/1612.04251.pdf

[^24]: https://arxiv.org/pdf/2306.16307.pdf

[^25]: https://arxiv.org/pdf/2302.08436.pdf

[^26]: https://libraries.io/pypi/tensorflow

[^27]: https://summary.ecosyste.ms/projects/371330

