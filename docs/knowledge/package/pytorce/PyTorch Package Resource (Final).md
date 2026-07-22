<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# PyTorch Package Resource

## Package Info

- **id:** pytorch
- **title:** PyTorch
- **slug:** pytorch
- **description:** Production-focused package reference for implementing deep learning systems with PyTorch.
- **name:** torch
- **latest stable version:** 2.x stable line
- **supported Python versions:** Python 3.9+
- **summary:** PyTorch is a tensor and deep learning library for building, training, compiling, and serving neural networks with CPU and GPU acceleration.[^6]
- **install command:** `pip install torch torchvision`
- **import convention:** `import torch`
- **important namespaces:** `torch`, `torch.nn`, `torch.nn.functional`, `torch.optim`, `torch.utils.data`, `torch.cuda`, `torch.amp`, `torch.autograd`, `torch.distributed`, `torch.fx`, `torch.func`, `torchvision`
- **official repository:** [pytorch/pytorch](https://github.com/pytorch/pytorch)
- **official documentation:** [PyTorch documentation](https://docs.pytorch.org/docs/stable/index.html)
- **license:** BSD-style license
- **maintainers:** PyTorch Core Team
- **created_at:** 2026-07-22
- **updated_at:** 2026-07-22


## Package Architecture

- `torch`: Core tensor library, tensor creation, math, device management, autograd, compilation, serialization, and low-level runtime APIs.[^6]
- `torch.nn`: Neural network layers, modules, containers, losses, normalization, recurrent layers, and utilities for building models.
- `torch.nn.functional`: Stateless functional forms of neural network operations, activations, losses, and attention primitives.
- `torch.optim`: Optimizers and learning rate schedulers for parameter updates during training.
- `torch.utils.data`: Dataset and DataLoader utilities for input pipelines, batching, shuffling, sampling, and multiprocessing data loading.
- `torch.cuda`: CUDA device utilities, GPU visibility, memory, streams, and device-specific runtime behavior.
- `torch.amp`: Automatic mixed precision autocasting and gradient scaling for modern AMP workflows.
- `torch.autograd`: Automatic differentiation internals, custom gradient functions, hooks, and graph control.
- `torch.distributed`: Multi-process distributed training, process group setup, and distributed parallelism utilities.
- `torch.fx`: Symbolic tracing and graph transformations for model inspection and program rewriting.
- `torch.func`: Composable function transforms such as `vmap` and `grad` for vectorized and functional-style differentiation.
- `torchvision`: Vision datasets, pretrained models, and image transform utilities commonly paired with PyTorch.


## Task List

### Core Tensor Operations

#### Create Tensor from Data / NumPy

**Task**
Create Tensor from Python data or NumPy arrays

**Problem Solved**
Converts external numeric data into a PyTorch tensor for model input or downstream tensor operations.

**Mental Trigger**
I need to turn raw data into a tensor I can compute on.

**Syntax**

```python
torch.tensor(data, dtype=None, device=None, requires_grad=False)
```

**Important Parameters**

- `data`
- `dtype`
- `device`
- `requires_grad`

**Return Value**
Returns a new `torch.Tensor`.

**Example**

```python
import numpy as np
import torch

arr = np.array([[1.0, 2.0], [3.0, 4.0]], dtype=np.float32)
x = torch.tensor(arr, dtype=torch.float32)

print(x)
```

**Use When**
Use when you need to convert lists, tuples, or NumPy arrays into tensors.

**Avoid When**
Avoid when you need a view into existing memory; prefer `torch.from_numpy()`.

**Gotchas**

- `torch.tensor()` copies data by default.
- NumPy dtype may not match model expectations.
- Device placement must be explicit for GPU use.
- Gradients are off unless `requires_grad=True`.
- Copy semantics can hide performance issues for large arrays.

**Performance Notes**
Use `torch.from_numpy()` when zero-copy behavior is desirable on CPU.

**Related APIs**
`torch.from_numpy`, `torch.as_tensor`, `torch.Tensor`

**Framework Migration Notes**
Coming from NumPy-centric code, `torch.tensor()` is the direct conversion step before you use modules, losses, or optimizers.

**TensorFlow Equivalent**
`tf.convert_to_tensor`

**Version Compatibility**

- **Introduced**: Core API in early PyTorch releases.
- **Modern replacement**: Prefer explicit `dtype` and `device` in 2.x code.
- **Behavior note**: Copies by default.

**Search Metadata**

- **Aliases**: Tensor constructor, array to tensor
- **Common Search Terms**: create tensor from numpy, torch tensor list
- **Keywords**: tensor, conversion, numpy, copy
- **Frequently Confused With**: `torch.from_numpy`, `torch.as_tensor`

**Related Models**
`logistic-regression`, `resnet`, `transformer`

**Related Patterns**
`training-loop`, `feature-scaling`

**Related Workflows**
`image-classification-pipeline`

**Related Cheatsheet**
`pytorch`, `tensor-operations`

**Related Decision Guides**
`hardware-selection-guide`

**Official Documentation**
https://pytorch.org/docs/stable/generated/torch.tensor.html

#### Create Special Tensors

**Task**
Create zeros, ones, empty, random, arange, and linspace tensors

**Problem Solved**
Initializes tensors for weights, buffers, masks, positions, and synthetic inputs.

**Mental Trigger**
I need a tensor with a known initialization pattern.

**Syntax**

```python
torch.zeros(*size, out=None, dtype=None, layout=torch.strided, device=None, requires_grad=False)
torch.ones(*size, out=None, dtype=None, layout=torch.strided, device=None, requires_grad=False)
torch.empty(*size, out=None, dtype=None, layout=torch.strided, device=None, requires_grad=False)
torch.rand(*size, out=None, dtype=None, layout=torch.strided, device=None, requires_grad=False)
torch.arange(start=0, end=None, step=1, *, out=None, dtype=None, layout=torch.strided, device=None, requires_grad=False)
torch.linspace(start, end, steps, *, out=None, dtype=None, layout=torch.strided, device=None, requires_grad=False)
```

**Important Parameters**

- `size`
- `dtype`
- `device`
- `requires_grad`
- `steps`

**Return Value**
Returns a tensor filled according to the requested initializer.

**Example**

```python
import torch

a = torch.zeros(2, 3)
b = torch.ones(2, 3)
c = torch.rand(2, 3)
d = torch.arange(0, 5)
e = torch.linspace(0, 1, steps=5)

print(a, b, c, d, e, sep="\n")
```

**Use When**
Use for initializing buffers, masks, toy data, and coordinate grids.

**Avoid When**
Avoid `torch.empty()` unless you immediately fill the tensor.

**Gotchas**

- `torch.empty()` contains uninitialized memory.
- Random initialization is nondeterministic unless seeded.
- Integer tensors do not support all float-style operations.
- `linspace` and `arange` differ in endpoint semantics.
- Device and dtype must match downstream modules.

**Performance Notes**
Prefer factory functions over Python loops for large tensors.

**Related APIs**
`torch.full`, `torch.randn`, `torch.empty_like`, `torch.zeros_like`

**Framework Migration Notes**
Use these factories instead of manual list construction when building model inputs or initialization values.

**TensorFlow Equivalent**
`tf.zeros`, `tf.ones`, `tf.random.uniform`, `tf.range`, `tf.linspace`

**Version Compatibility**

- **Introduced**: Core APIs.
- **Modern replacement**: Use device-aware factory functions directly in 2.x.

**Search Metadata**

- **Aliases**: Factory tensors, initializer tensors
- **Common Search Terms**: torch zeros ones arange linspace
- **Keywords**: initialization, random, factory, tensor
- **Frequently Confused With**: `torch.full`, `torch.randn`

**Related Models**
`resnet`, `transformer`, `vit`

**Related Patterns**
`training-loop`, `checkpointing`

**Related Workflows**
`image-classification-pipeline`

**Related Cheatsheet**
`pytorch`, `tensor-operations`

**Related Decision Guides**
`hardware-selection-guide`

**Official Documentation**
https://pytorch.org/docs/stable/torch.html

#### Inspect Tensor Properties

**Task**
Inspect tensor dtype, shape, device, layout, and rank

**Problem Solved**
Helps confirm tensor compatibility before computation or module forwarding.

**Mental Trigger**
I need to verify what kind of tensor I am working with.

**Syntax**

```python
tensor.dtype
tensor.shape
tensor.device
tensor.layout
tensor.ndim
```

**Important Parameters**

- None

**Return Value**
Returns tensor metadata through attributes.

**Example**

```python
import torch

x = torch.randn(2, 3, 4, device="cpu")
print(x.dtype)
print(x.shape)
print(x.device)
print(x.layout)
print(x.ndim)
```

**Use When**
Use when debugging shape mismatches or device placement issues.

**Avoid When**
Avoid repeated metadata checks inside hot inner loops.

**Gotchas**

- `shape` returns a `torch.Size` object.
- `ndim` is often easier than `len(tensor.shape)`.
- `layout` is usually `torch.strided` in standard workflows.
- Device mismatch causes runtime errors during ops or module calls.
- Shape ranks often differ between batched and unbatched inputs.

**Performance Notes**
Metadata access is cheap, but avoid excessive logging in production inference loops.

**Related APIs**
`tensor.size()`, `tensor.stride()`, `tensor.is_contiguous()`

**Framework Migration Notes**
PyTorch makes tensor metadata explicit and inspectable, which helps catch mismatches early.

**TensorFlow Equivalent**
`tensor.dtype`, `tensor.shape`, `tensor.device`, `tf.rank`

**Version Compatibility**

- **Introduced**: Core tensor attributes.
- **Modern replacement**: Use `tensor.ndim` and `tensor.device` directly.

**Search Metadata**

- **Aliases**: Tensor introspection, metadata inspection
- **Common Search Terms**: pytorch tensor shape dtype device
- **Keywords**: metadata, rank, layout, shape
- **Frequently Confused With**: `tensor.size`, `tensor.stride`

**Related Models**
`resnet`, `bert`, `transformer`

**Related Patterns**
`training-loop`, `validation-loop`

**Related Workflows**
`image-classification-pipeline`, `text-classification-pipeline-classical-encoder`

**Related Cheatsheet**
`pytorch`, `tensor-operations`

**Related Decision Guides**
`hardware-selection-guide`

**Official Documentation**
https://pytorch.org/docs/stable/tensors.html

#### Transfer Tensor Device

**Task**
Move tensors across CPU, CUDA, and MPS devices

**Problem Solved**
Places tensors on the correct accelerator or back on CPU for preprocessing and I/O.

**Mental Trigger**
I need this tensor on the same device as the model.

**Syntax**

```python
tensor.to(device=None, dtype=None, non_blocking=False, copy=False, memory_format=torch.preserve_format)
```

**Important Parameters**

- `device`
- `dtype`
- `non_blocking`
- `copy`
- `memory_format`

**Return Value**
Returns a tensor on the requested device or dtype.

**Example**

```python
import torch

x = torch.randn(2, 3)
device = "cuda" if torch.cuda.is_available() else "cpu"
y = x.to(device)
print(y.device)
```

**Use When**
Use before forward passes, especially when model parameters live on GPU.

**Avoid When**
Avoid unnecessary transfers inside tight loops.

**Gotchas**

- Input and parameter devices must match.
- `non_blocking=True` is most useful with pinned memory.
- Moving between devices allocates and may be expensive.
- MPS and CUDA have different backend behaviors.
- `.to()` may also cast dtype unintentionally if requested.

**Performance Notes**
Batch transfers and use pinned memory for faster CPU-to-GPU input pipelines.

**Related APIs**
`tensor.cuda()`, `tensor.cpu()`, `tensor.mps()`, `module.to()`

**Framework Migration Notes**
In PyTorch, device placement is explicit and usually managed once per batch rather than hidden inside the runtime.

**TensorFlow Equivalent**
`tf.device` placement scope

**Version Compatibility**

- **Introduced**: Core API.
- **Modern replacement**: Use `tensor.to(device)` over backend-specific ad hoc paths.

**Search Metadata**

- **Aliases**: Move tensor to GPU, device transfer
- **Common Search Terms**: pytorch tensor to cuda cpu mps
- **Keywords**: device, transfer, cuda, mps
- **Frequently Confused With**: `module.to`, `tensor.type`

**Related Models**
`resnet`, `transformer`, `gpt`

**Related Patterns**
`training-loop`, `mixed-precision`

**Related Workflows**
`image-classification-pipeline`, `production-llm-cost-latency-optimization`

**Related Cheatsheet**
`pytorch`, `tensor-operations`

**Related Decision Guides**
`hardware-selection-guide`, `precision-tradeoffs-guide`

**Official Documentation**
https://pytorch.org/docs/stable/generated/torch.Tensor.to.html

#### Concatenate Tensors

**Task**
Concatenate tensors along a selected dimension

**Problem Solved**
Combines matching tensors into a larger batch or feature representation.

**Mental Trigger**
I need to join tensors end to end along one axis.

**Syntax**

```python
torch.cat(tensors, dim=0, *, out=None)
```

**Important Parameters**

- `tensors`
- `dim`
- `out`

**Return Value**
Returns a concatenated tensor.

**Example**

```python
import torch

a = torch.randn(2, 3)
b = torch.randn(4, 3)
x = torch.cat([a, b], dim=0)
print(x.shape)
```

**Use When**
Use when tensors share all dimensions except the concatenation axis.

**Avoid When**
Avoid when you need a new stack dimension; prefer `torch.stack()`.

**Gotchas**

- Non-concatenated dimensions must match.
- Concatenating inside loops can create extra allocations.
- Concatenation is not the same as stacking.
- `dim` must be chosen carefully for batch vs feature joins.
- Shape errors are common when mixing sequence lengths.

**Performance Notes**
Repeated `cat` operations in loops are expensive; accumulate in lists first.

**Related APIs**
`torch.stack`, `torch.split`, `torch.chunk`

**Framework Migration Notes**
Equivalent to concatenation operations in other frameworks, but dimension semantics must be checked carefully.

**TensorFlow Equivalent**
`tf.concat`

**Version Compatibility**

- **Introduced**: Core API.
- **Modern replacement**: Same in 2.x.

**Search Metadata**

- **Aliases**: Join tensors, concatenate batches
- **Common Search Terms**: torch cat dim concatenate
- **Keywords**: concatenate, batch, axis, shape
- **Frequently Confused With**: `torch.stack`

**Related Models**
`resnet`, `transformer`

**Related Patterns**
`training-loop`

**Related Workflows**
`image-classification-pipeline`

**Related Cheatsheet**
`pytorch`, `tensor-operations`

**Related Decision Guides**
`hardware-selection-guide`

**Official Documentation**
https://pytorch.org/docs/stable/generated/torch.cat.html

#### Stack Tensors

**Task**
Stack tensors along a new dimension

**Problem Solved**
Combines tensors with identical shapes into a batched tensor with an added axis.

**Mental Trigger**
I need a new dimension for a batch or collection.

**Syntax**

```python
torch.stack(tensors, dim=0, out=None)
```

**Important Parameters**

- `tensors`
- `dim`
- `out`

**Return Value**
Returns a stacked tensor.

**Example**

```python
import torch

a = torch.randn(3)
b = torch.randn(3)
x = torch.stack([a, b], dim=0)
print(x.shape)
```

**Use When**
Use when you want to build a tensor with one extra dimension.

**Avoid When**
Avoid when tensors have different shapes; use padding or concatenation instead.

**Gotchas**

- All tensors must have the same shape.
- `stack` inserts a dimension, unlike `cat`.
- Stacking can increase memory use.
- Choosing the wrong `dim` changes model input rank.
- DataLoader collation often uses stacking implicitly.

**Performance Notes**
Prefer stacking once after collecting tensors rather than repeated incremental stacking.

**Related APIs**
`torch.cat`, `torch.unbind`, `torch.unsqueeze`

**Framework Migration Notes**
Use when converting a Python list of same-shaped samples into a batch tensor.

**TensorFlow Equivalent**
`tf.stack`

**Version Compatibility**

- **Introduced**: Core API.
- **Modern replacement**: Same in 2.x.

**Search Metadata**

- **Aliases**: Add batch dimension, tensor batchify
- **Common Search Terms**: torch stack new dimension
- **Keywords**: stack, batch, dimension, tensor
- **Frequently Confused With**: `torch.cat`

**Related Models**
`resnet`, `transformer`

**Related Patterns**
`training-loop`, `gradient-accumulation`

**Related Workflows**
`image-classification-pipeline`

**Related Cheatsheet**
`pytorch`, `tensor-operations`

**Related Decision Guides**
`hardware-selection-guide`

**Official Documentation**
https://pytorch.org/docs/stable/generated/torch.stack.html

#### Split Tensor into Chunks

**Task**
Split tensors into equal or size-based chunks

**Problem Solved**
Breaks large tensors into smaller pieces for batching, parallelism, or sequence handling.

**Mental Trigger**
I need to partition this tensor into smaller parts.

**Syntax**

```python
torch.split(tensor, split_size_or_sections, dim=0)
torch.chunk(input, chunks, dim=0)
```

**Important Parameters**

- `split_size_or_sections`
- `chunks`
- `dim`

**Return Value**
Returns a tuple of tensor chunks.

**Example**

```python
import torch

x = torch.arange(10)
parts = torch.split(x, 3)
chunks = torch.chunk(x, 4)
print([p.tolist() for p in parts])
print([c.tolist() for c in chunks])
```

**Use When**
Use for slicing batches, sequence segments, or uneven splits.

**Avoid When**
Avoid when you need a view with custom indexing logic; use slicing directly.

**Gotchas**

- `split` and `chunk` have different split semantics.
- Chunk sizes may differ if the tensor is not divisible.
- Splitting along the wrong dimension changes meaning.
- Returned pieces may share storage.
- Shape assumptions can break downstream code.

**Performance Notes**
These are lightweight compared to copying large tensors, but follow with care when modifying views.

**Related APIs**
`torch.cat`, `torch.unbind`, slicing

**Framework Migration Notes**
Useful when converting batch-processing logic that expects fixed-size sub-batches.

**TensorFlow Equivalent**
`tf.split`

**Version Compatibility**

- **Introduced**: Core APIs.

**Search Metadata**

- **Aliases**: Slice tensor, partition tensor
- **Common Search Terms**: torch split chunk
- **Keywords**: split, chunk, partition, sequence
- **Frequently Confused With**: `torch.cat`, `torch.stack`

**Related Models**
`transformer`, `lstm`

**Related Patterns**
`training-loop`, `gradient-accumulation`

**Related Workflows**
`text-classification-pipeline-classical-encoder`

**Related Cheatsheet**
`pytorch`, `tensor-operations`

**Related Decision Guides**
`hardware-selection-guide`

**Official Documentation**
https://pytorch.org/docs/stable/generated/torch.split.html

#### Reshape Tensor View

**Task**
Create a view with `torch.view`

**Problem Solved**
Reinterprets tensor dimensions without copying when storage is compatible.

**Mental Trigger**
I need to reshape this tensor without allocating new memory.

**Syntax**

```python
tensor.view(*shape)
```

**Important Parameters**

- `shape`

**Return Value**
Returns a view of the original tensor.

**Example**

```python
import torch

x = torch.randn(2, 3, 4)
y = x.view(6, 4)
print(y.shape)
```

**Use When**
Use when the tensor is contiguous and you need a cheap reshape.

**Avoid When**
Avoid when the tensor may be non-contiguous; use `reshape()`.

**Gotchas**

- Works best on contiguous tensors.
- Non-contiguous tensors may error.
- View semantics can reflect in-place changes.
- Wrong shape inference breaks downstream layers.
- Do not assume it copies data.

**Performance Notes**
A view is memory-efficient, but only when storage layout allows it.

**Related APIs**
`torch.reshape`, `tensor.contiguous`

**Framework Migration Notes**
Similar to reshape in other frameworks, but with stronger storage-layout constraints.

**TensorFlow Equivalent**
`tf.reshape`

**Version Compatibility**

- **Introduced**: Core API.
- **Modern replacement**: Use `reshape()` when layout is uncertain.

**Search Metadata**

- **Aliases**: View reshape, cheap reshape
- **Common Search Terms**: pytorch view contiguous
- **Keywords**: view, reshape, storage, contiguous
- **Frequently Confused With**: `torch.reshape`

**Related Models**
`resnet`, `transformer`

**Related Patterns**
`training-loop`

**Related Workflows**
`image-classification-pipeline`

**Related Cheatsheet**
`pytorch`, `tensor-operations`

**Related Decision Guides**
`hardware-selection-guide`

**Official Documentation**
https://pytorch.org/docs/stable/tensors.html\#torch.Tensor.view

#### Reshape Tensor Copy/View

**Task**
Reshape tensors with `torch.reshape`

**Problem Solved**
Changes tensor shape while choosing a view or copy depending on memory layout.

**Mental Trigger**
I need a reshape that works even if the tensor is not contiguous.

**Syntax**

```python
torch.reshape(input, shape)
```

**Important Parameters**

- `input`
- `shape`

**Return Value**
Returns a tensor with the requested shape.

**Example**

```python
import torch

x = torch.randn(2, 3, 4).transpose(1, 2)
y = torch.reshape(x, (2, 12))
print(y.shape)
```

**Use When**
Use when reshaping tensors produced by transposes or other layout-changing ops.

**Avoid When**
Avoid when you specifically require zero-copy view semantics.

**Gotchas**

- May return a copy rather than a view.
- Shape inference can hide memory behavior.
- Do not depend on storage aliasing.
- Non-contiguous tensors often trigger copies.
- Check performance if used repeatedly.

**Performance Notes**
Use `view()` when you can guarantee contiguity; use `reshape()` when correctness matters more than aliasing.

**Related APIs**
`tensor.view`, `tensor.contiguous`

**Framework Migration Notes**
This is the safer reshape choice for most application code.

**TensorFlow Equivalent**
`tf.reshape`

**Version Compatibility**

- **Introduced**: Core API.
- **Modern replacement**: Common default reshape choice in 2.x code.

**Search Metadata**

- **Aliases**: Safe reshape, dynamic reshape
- **Common Search Terms**: pytorch reshape non contiguous
- **Keywords**: reshape, copy, view, layout
- **Frequently Confused With**: `torch.view`

**Related Models**
`resnet`, `transformer`

**Related Patterns**
`training-loop`

**Related Workflows**
`image-classification-pipeline`

**Related Cheatsheet**
`pytorch`, `tensor-operations`

**Related Decision Guides**
`hardware-selection-guide`

**Official Documentation**
https://pytorch.org/docs/stable/generated/torch.reshape.html

#### Transpose Dimensions

**Task**
Transpose or permute tensor dimensions

**Problem Solved**
Reorders tensor axes for convolution, attention, sequence, and layout conversion tasks.

**Mental Trigger**
I need to reorder axes before a layer or reduction.

**Syntax**

```python
torch.transpose(input, dim0, dim1)
torch.permute(input, dims)
```

**Important Parameters**

- `dim0`
- `dim1`
- `dims`

**Return Value**
Returns a tensor with reordered dimensions.

**Example**

```python
import torch

x = torch.randn(2, 3, 4)
y = torch.transpose(x, 1, 2)
z = torch.permute(x, (0, 2, 1))
print(y.shape, z.shape)
```

**Use When**
Use for channel-last/first conversion, sequence reshaping, or matrix axis swaps.

**Avoid When**
Avoid confusing `transpose` for full permutation; use `permute` for multiple axes.

**Gotchas**

- `transpose` only swaps two dimensions.
- `permute` needs the full dimension order.
- Returned tensors are often non-contiguous.
- Follow with `contiguous()` if a view-only op is required.
- Axis mistakes are a common source of silent logic bugs.

**Performance Notes**
Axis reordering itself is cheap, but follow-up `.contiguous()` may allocate memory.

**Related APIs**
`torch.swapdims`, `tensor.contiguous`, `tensor.view`

**Framework Migration Notes**
Axis order changes are common when moving between image and sequence formats.

**TensorFlow Equivalent**
`tf.transpose`

**Version Compatibility**

- **Introduced**: Core API.
- **Modern replacement**: Use `permute` for explicit multi-axis reordering.

**Search Metadata**

- **Aliases**: Axis swap, dimension reorder
- **Common Search Terms**: pytorch transpose permute dimensions
- **Keywords**: transpose, permute, axes, layout
- **Frequently Confused With**: `torch.reshape`, `torch.view`

**Related Models**
`resnet`, `vit`, `transformer`

**Related Patterns**
`training-loop`

**Related Workflows**
`image-classification-pipeline`

**Related Cheatsheet**
`pytorch`, `tensor-operations`

**Related Decision Guides**
`hardware-selection-guide`

**Official Documentation**
https://pytorch.org/docs/stable/generated/torch.transpose.html

#### Squeeze and Unsqueeze Dimensions

**Task**
Remove or add size-1 dimensions

**Problem Solved**
Adjusts tensor rank for batching, broadcasting, and layer input compatibility.

**Mental Trigger**
I need to add or remove a singleton dimension.

**Syntax**

```python
torch.squeeze(input, dim=None)
torch.unsqueeze(input, dim)
```

**Important Parameters**

- `dim`
- `input`

**Return Value**
Returns a tensor with singleton dimensions removed or added.

**Example**

```python
import torch

x = torch.randn(1, 3, 1, 4)
y = torch.squeeze(x)
z = torch.unsqueeze(y, dim=0)
print(y.shape, z.shape)
```

**Use When**
Use when preparing inputs for layers expecting a specific rank.

**Avoid When**
Avoid `squeeze()` without `dim` when a size-1 batch dimension must be preserved.

**Gotchas**

- `squeeze()` can remove unintended dimensions.
- `unsqueeze()` changes axis positions.
- Broadcasting assumptions may change after shape edits.
- Accidentally removing batch dimensions causes downstream errors.
- Rank changes can confuse loss functions and metrics.

**Performance Notes**
These are lightweight metadata-style operations and usually do not copy data.

**Related APIs**
`torch.flatten`, `torch.stack`, `torch.cat`

**Framework Migration Notes**
Equivalent shape manipulation is often needed when porting models between frameworks with different batch conventions.

**TensorFlow Equivalent**
`tf.squeeze`, `tf.expand_dims`

**Version Compatibility**

- **Introduced**: Core API.

**Search Metadata**

- **Aliases**: Add axis, remove axis
- **Common Search Terms**: pytorch squeeze unsqueeze
- **Keywords**: rank, singleton, axis, broadcast
- **Frequently Confused With**: `torch.flatten`, `torch.reshape`

**Related Models**
`resnet`, `transformer`

**Related Patterns**
`training-loop`

**Related Workflows**
`image-classification-pipeline`

**Related Cheatsheet**
`pytorch`, `tensor-operations`

**Related Decision Guides**
`hardware-selection-guide`

**Official Documentation**
https://pytorch.org/docs/stable/generated/torch.unsqueeze.html

#### Flatten Tensor Dimensions

**Task**
Flatten tensor dimensions into a single axis or range of axes

**Problem Solved**
Converts feature maps or sequences into vector inputs for linear layers or pooling heads.

**Mental Trigger**
I need to collapse dimensions before a classifier head.

**Syntax**

```python
torch.flatten(input, start_dim=0, end_dim=-1)
```

**Important Parameters**

- `start_dim`
- `end_dim`

**Return Value**
Returns a flattened tensor.

**Example**

```python
import torch

x = torch.randn(2, 3, 4, 5)
y = torch.flatten(x, start_dim=1)
print(y.shape)
```

**Use When**
Use before dense heads or when converting multi-dimensional features into vectors.

**Avoid When**
Avoid when the dimension structure is semantically meaningful for later layers.

**Gotchas**

- Flattening from the wrong axis destroys structure.
- Batch dimension is often preserved with `start_dim=1`.
- Non-contiguous tensors may require extra handling.
- Flattening sequences can break token alignment.
- Downstream layers may expect a specific rank.

**Performance Notes**
Can be cheap on contiguous tensors, but layout changes may force copies.

**Related APIs**
`torch.view`, `torch.reshape`, `torch.nn.Flatten`

**Framework Migration Notes**
Common replacement for manual reshape logic in dense classifier heads.

**TensorFlow Equivalent**
`tf.reshape`, `tf.keras.layers.Flatten`

**Version Compatibility**

- **Introduced**: Core API.

**Search Metadata**

- **Aliases**: Collapse dimensions, vectorize features
- **Common Search Terms**: pytorch flatten start_dim
- **Keywords**: flatten, vector, features, rank
- **Frequently Confused With**: `torch.reshape`, `torch.view`

**Related Models**
`resnet`, `mlp`, `bert`

**Related Patterns**
`training-loop`

**Related Workflows**
`image-classification-pipeline`, `text-classification-pipeline-classical-encoder`

**Related Cheatsheet**
`pytorch`, `tensor-operations`

**Related Decision Guides**
`hardware-selection-guide`

**Official Documentation**
https://pytorch.org/docs/stable/generated/torch.flatten.html

#### Element-wise Mathematical Operations

**Task**
Apply element-wise arithmetic and transcendental operations

**Problem Solved**
Computes nonlinear transforms, normalization steps, and feature transformations on tensors.

**Mental Trigger**
I need to transform every value in this tensor independently.

**Syntax**

```python
torch.add(input, other, *, alpha=1, out=None)
torch.mul(input, other, *, out=None)
torch.exp(input, *, out=None)
torch.log(input, *, out=None)
torch.sqrt(input, *, out=None)
```

**Important Parameters**

- `input`
- `other`
- `alpha`
- `out`

**Return Value**
Returns a tensor with element-wise results.

**Example**

```python
import torch

x = torch.tensor([1.0, 2.0, 3.0])
y = torch.add(x, 2.0)
z = torch.exp(x)
print(y, z)
```

**Use When**
Use for activation-like transforms, feature preprocessing, and scalar-tensor arithmetic.

**Avoid When**
Avoid when a reduction or matrix operation is required instead.

**Gotchas**

- Broadcasting may hide shape mismatches.
- `log()` requires positive inputs.
- Division by zero and overflow can produce invalid values.
- In-place variants can interfere with autograd.
- Type promotion can change dtype unexpectedly.

**Performance Notes**
Vectorized ops are far faster than Python loops and typically fuse well on accelerators.

**Related APIs**
`torch.sub`, `torch.div`, `torch.pow`, `torch.clamp`

**Framework Migration Notes**
Direct tensor arithmetic is the standard PyTorch way to write numerical transformations.

**TensorFlow Equivalent**
`tf.add`, `tf.multiply`, `tf.exp`, `tf.math.log`

**Version Compatibility**

- **Introduced**: Core API.
- **Modern replacement**: Use vectorized tensor ops instead of Python-side loops.

**Search Metadata**

- **Aliases**: Pointwise ops, scalar ops
- **Common Search Terms**: pytorch elementwise add mul exp log
- **Keywords**: arithmetic, broadcast, nonlinear, pointwise
- **Frequently Confused With**: reduction ops, matrix ops

**Related Models**
`mlp`, `resnet`, `transformer`

**Related Patterns**
`training-loop`

**Related Workflows**
`image-classification-pipeline`

**Related Cheatsheet**
`pytorch`, `tensor-operations`

**Related Decision Guides**
`precision-tradeoffs-guide`

**Official Documentation**
https://pytorch.org/docs/stable/torch.html

#### Matrix Multiplication

**Task**
Perform matrix and batched matrix multiplication

**Problem Solved**
Computes dense linear algebra for linear layers, projections, attention, and batched inference.

**Mental Trigger**
I need to combine features with a learned projection.

**Syntax**

```python
torch.matmul(input, other, *, out=None)
torch.bmm(input, mat2, *, out=None)
```

**Important Parameters**

- `input`
- `other`
- `mat2`
- `out`

**Return Value**
Returns the matrix or batched matrix product.

**Example**

```python
import torch

x = torch.randn(2, 3)
w = torch.randn(3, 4)
y = torch.matmul(x, w)

bx = torch.randn(5, 2, 3)
bw = torch.randn(5, 3, 4)
by = torch.bmm(bx, bw)

print(y.shape, by.shape)
```

**Use When**
Use for linear projections, attention logits, and batched feature transforms.

**Avoid When**
Avoid using `bmm` for non-batched inputs; use `matmul`.

**Gotchas**

- Shape rules differ between `matmul` and `bmm`.
- Broadcasting can change result rank.
- Mixed dtypes may trigger implicit promotion.
- Large batched products can be memory intensive.
- Wrong transpose order changes semantics.

**Performance Notes**
Use accelerator-backed linear algebra kernels when available; batch sizes can strongly affect throughput.

**Related APIs**
`torch.mm`, `torch.bmm`, `torch.einsum`, `torch.nn.Linear`

**Framework Migration Notes**
This is the core primitive behind dense layers and attention projections.

**TensorFlow Equivalent**
`tf.matmul`

**Version Compatibility**

- **Introduced**: Core API.

**Search Metadata**

- **Aliases**: GEMM, dot product, projection
- **Common Search Terms**: pytorch matmul bmm
- **Keywords**: matrix, batched, projection, linear algebra
- **Frequently Confused With**: `torch.mm`, `torch.einsum`

**Related Models**
`mlp`, `transformer`, `bert`, `gpt`

**Related Patterns**
`training-loop`, `mixed-precision`

**Related Workflows**
`image-classification-pipeline`, `production-llm-cost-latency-optimization`

**Related Cheatsheet**
`pytorch`, `tensor-operations`

**Related Decision Guides**
`hardware-selection-guide`, `precision-tradeoffs-guide`

**Official Documentation**
https://pytorch.org/docs/stable/generated/torch.matmul.html

#### Tensor Reduction Operations

**Task**
Compute sums, means, extrema, and argmax-style reductions

**Problem Solved**
Aggregates tensor values for losses, pooling, metrics, and predictions.

**Mental Trigger**
I need one value or index summary from a tensor.

**Syntax**

```python
torch.sum(input, dim=None, keepdim=False, dtype=None)
torch.mean(input, dim=None, keepdim=False, dtype=None)
torch.max(input, dim=None, keepdim=False)
torch.min(input, dim=None, keepdim=False)
torch.argmax(input, dim=None)
```

**Important Parameters**

- `dim`
- `keepdim`
- `dtype`
- `input`

**Return Value**
Returns a reduced tensor or an index tensor for `argmax`.

**Example**

```python
import torch

x = torch.tensor([[1.0, 3.0], [2.0, 4.0]])
print(torch.sum(x))
print(torch.mean(x, dim=0))
print(torch.argmax(x, dim=1))
```

**Use When**
Use for metrics, pooling, class prediction, and loss aggregation.

**Avoid When**
Avoid reducing over the wrong axis when batch and feature dimensions differ.

**Gotchas**

- `argmax` returns indices, not values.
- `keepdim=True` is often useful for broadcasting.
- Integer tensors and float tensors behave differently in reductions.
- Reductions over large tensors can be numerically sensitive.
- Dimensionality mistakes are common in classification heads.

**Performance Notes**
Reductions are efficient on accelerators, but precision matters for large accumulations.

**Related APIs**
`torch.amax`, `torch.amin`, `torch.max`, `torch.topk`

**Framework Migration Notes**
These are common replacements for framework-level metric aggregation and pooling operations.

**TensorFlow Equivalent**
`tf.reduce_sum`, `tf.reduce_mean`, `tf.argmax`

**Version Compatibility**

- **Introduced**: Core API.
- **Modern replacement**: Use `keepdim` intentionally for later broadcasting.

**Search Metadata**

- **Aliases**: Reduce, aggregate, pool
- **Common Search Terms**: pytorch sum mean max argmax
- **Keywords**: reduction, pooling, metric, aggregate
- **Frequently Confused With**: `torch.topk`, `torch.amax`

**Related Models**
`resnet`, `bert`, `transformer`

**Related Patterns**
`validation-loop`, `training-loop`

**Related Workflows**
`image-classification-pipeline`, `text-classification-pipeline-classical-encoder`

**Related Cheatsheet**
`pytorch`, `tensor-operations`

**Related Decision Guides**
`hardware-selection-guide`

**Official Documentation**
https://pytorch.org/docs/stable/generated/torch.sum.html

#### In-place Tensor Operations

**Task**
Modify tensor values in place with `add_` and `copy_`

**Problem Solved**
Updates tensor contents without allocating a new tensor, often for performance or state mutation.

**Mental Trigger**
I need to update this tensor buffer directly.

**Syntax**

```python
tensor.add_(other, alpha=1)
tensor.copy_(src, non_blocking=False)
```

**Important Parameters**

- `other`
- `alpha`
- `src`
- `non_blocking`

**Return Value**
Returns the modified tensor.

**Example**

```python
import torch

x = torch.zeros(3)
x.add_(1)
y = torch.ones(3)
x.copy_(y)
print(x)
```

**Use When**
Use for buffer updates, state tensors, and controlled performance optimizations.

**Avoid When**
Avoid in-place updates on tensors tracked by autograd unless you understand graph constraints.

**Gotchas**

- In-place ops can break autograd history.
- Aliasing can produce hard-to-debug side effects.
- `copy_` may fail across incompatible devices.
- Mutating shared tensors can affect unexpected consumers.
- In-place ops often make code less composable.

**Performance Notes**
In-place updates can reduce allocations, but may increase correctness risk in training code.

**Related APIs**
`tensor.add`, `tensor.clone`, `tensor.detach`

**Framework Migration Notes**
Use in-place operations sparingly compared with functional updates.

**TensorFlow Equivalent**
No direct equivalent.

**Version Compatibility**

- **Introduced**: Core API.
- **Modern replacement**: Prefer functional ops unless memory pressure justifies mutation.

**Search Metadata**

- **Aliases**: In-place update, mutate tensor
- **Common Search Terms**: pytorch add_ copy_
- **Keywords**: inplace, mutation, copy, buffer
- **Frequently Confused With**: `tensor.add`, `tensor.clone`

**Related Models**
`resnet`, `transformer`

**Related Patterns**
`checkpointing`

**Related Workflows**
`production-llm-cost-latency-optimization`

**Related Cheatsheet**
`pytorch`, `tensor-operations`

**Related Decision Guides**
`precision-tradeoffs-guide`

**Official Documentation**
https://pytorch.org/docs/stable/tensors.html

#### Contiguous Memory Layout

**Task**
Convert a tensor to contiguous memory layout

**Problem Solved**
Restores storage layout compatibility after transpose, permute, or slicing operations.

**Mental Trigger**
I need a tensor with contiguous storage for a later view or kernel.

**Syntax**

```python
tensor.contiguous(memory_format=torch.contiguous_format)
```

**Important Parameters**

- `memory_format`

**Return Value**
Returns a contiguous tensor, possibly copying data.

**Example**

```python
import torch

x = torch.randn(2, 3, 4).transpose(1, 2)
y = x.contiguous()
print(y.is_contiguous())
```

**Use When**
Use before `view()` or when a downstream op requires contiguous storage.

**Avoid When**
Avoid calling it blindly if you do not need a contiguous copy.

**Gotchas**

- It may allocate a copy.
- Non-contiguous tensors are common after axis reordering.
- Contiguity matters for some low-level kernels.
- Do not assume all ops preserve contiguity.
- Excess copies can increase memory pressure.

**Performance Notes**
Use only when needed; unnecessary copies can reduce throughput.

**Related APIs**
`torch.view`, `torch.reshape`, `tensor.is_contiguous`

**Framework Migration Notes**
Layout fixes are often required when porting models with frequent axis changes.

**TensorFlow Equivalent**
No direct equivalent.

**Version Compatibility**

- **Introduced**: Core API.

**Search Metadata**

- **Aliases**: Make contiguous, contiguous copy
- **Common Search Terms**: pytorch contiguous view
- **Keywords**: contiguous, layout, copy, storage
- **Frequently Confused With**: `torch.reshape`, `torch.view`

**Related Models**
`resnet`, `vit`, `transformer`

**Related Patterns**
`training-loop`

**Related Workflows**
`image-classification-pipeline`

**Related Cheatsheet**
`pytorch`, `tensor-operations`

**Related Decision Guides**
`hardware-selection-guide`

**Official Documentation**
https://pytorch.org/docs/stable/tensors.html

***

### Autograd Operations

#### Compute Tensor Gradients

**Task**  
Run backward propagation to compute gradients

**Problem Solved**  
Computes derivatives for tensors involved in a scalar loss so parameters can be updated.

**Mental Trigger**  
I need gradients from a loss value.

**Syntax**  
```python
tensor.backward(gradient=None, retain_graph=None, create_graph=False, inputs=None)
```

**Important Parameters**
- `gradient`
- `retain_graph`
- `create_graph`
- `inputs`

**Return Value**  
Returns `None`; gradients are accumulated into leaf tensors with `requires_grad=True`.

**Example**  
```python
import torch

x = torch.tensor(2.0, requires_grad=True)
y = x * x + 3 * x
y.backward()
print(x.grad)
```

**Use When**  
Use after loss computation in custom training loops.

**Avoid When**  
Avoid when you only need forward execution; prefer `torch.inference_mode()`.

**Gotchas**
- `backward()` requires a scalar output unless you pass `gradient`.
- Gradients accumulate unless you clear them.
- Calling backward twice on the same graph needs `retain_graph=True`.
- Non-leaf tensors do not store `.grad` unless retained.
- In-place ops can invalidate the graph.

**Performance Notes**  
Backward is the dominant training cost; minimize graph retention and unnecessary tensor saves.

**Related APIs**  
`torch.autograd.backward`, `torch.no_grad`, `torch.amp.GradScaler`

**Framework Migration Notes**  
Coming from TensorFlow, this replaces `tf.GradientTape().gradient(...)` in explicit training code.

**TensorFlow Equivalent**  
`tf.GradientTape`

**Version Compatibility**
- **Introduced**: Core autograd API.
- **Modern replacement**: Use `torch.inference_mode()` for inference-only execution.
- **Deprecated behavior to avoid**: Retaining graphs unnecessarily.

**Search Metadata**
- **Aliases**: backprop, backward pass
- **Common Search Terms**: pytorch backward grad
- **Keywords**: autograd, gradient, loss, backward
- **Frequently Confused With**: `torch.autograd.grad`

**Related Models**  
`resnet`, `bert`, `transformer`, `gpt`

**Related Patterns**  
`training-loop`, `gradient-accumulation`

**Related Workflows**  
`image-classification-pipeline`, `text-classification-pipeline-classical-encoder`

**Related Cheatsheet**  
`pytorch`, `autograd`

**Related Decision Guides**  
`precision-tradeoffs-guide`

**Official Documentation**  
https://pytorch.org/docs/stable/generated/torch.Tensor.backward.html

#### Access Computed Gradients

**Task**  
Read gradients from leaf tensors

**Problem Solved**  
Retrieves parameter or input gradients after backward execution for inspection or optimization.

**Mental Trigger**  
I need the gradient value that was just computed.

**Syntax**  
```python
tensor.grad
```

**Important Parameters**
- None

**Return Value**  
Returns a tensor gradient or `None`.

**Example**  
```python
import torch

x = torch.tensor(2.0, requires_grad=True)
y = x * 5
y.backward()
print(x.grad)
```

**Use When**  
Use to inspect or manually apply gradient-based updates.

**Avoid When**  
Avoid assuming `.grad` exists before backward or on non-leaf tensors.

**Gotchas**
- `.grad` is populated only after backward.
- Gradients accumulate across steps unless reset.
- Non-leaf tensors need `retain_grad()` to keep gradients.
- `None` is not an error by itself.
- Mixed precision may require unscaled gradients before inspection.

**Performance Notes**  
Avoid storing gradient tensors longer than necessary in large models.

**Related APIs**  
`tensor.backward`, `retain_grad`, `optimizer.zero_grad`

**Framework Migration Notes**  
This is the direct equivalent of reading accumulated gradients after tape execution.

**TensorFlow Equivalent**  
No direct equivalent.

**Version Compatibility**
- **Introduced**: Core autograd attribute.
- **Modern replacement**: Reset gradients explicitly in each iteration.

**Search Metadata**
- **Aliases**: gradient buffer, parameter grad
- **Common Search Terms**: pytorch tensor grad
- **Keywords**: gradient, leaf tensor, backward
- **Frequently Confused With**: `register_hook`, `retain_grad`

**Related Models**  
`resnet`, `transformer`

**Related Patterns**  
`training-loop`, `gradient-accumulation`

**Related Workflows**  
`image-classification-pipeline`

**Related Cheatsheet**  
`pytorch`, `autograd`

**Related Decision Guides**  
`precision-tradeoffs-guide`

**Official Documentation**  
https://pytorch.org/docs/stable/generated/torch.Tensor.grad.html

#### Detach Tensor from Computation Graph

**Task**  
Detach a tensor from autograd tracking

**Problem Solved**  
Stops gradient tracking so the tensor can be reused for inference, logging, or branching logic.

**Mental Trigger**  
I need to stop gradients from flowing through this tensor.

**Syntax**  
```python
tensor.detach()
tensor.detach_()
```

**Important Parameters**
- None

**Return Value**  
Returns a tensor disconnected from the computation graph.

**Example**  
```python
import torch

x = torch.tensor(2.0, requires_grad=True)
y = x * 3
z = y.detach()
print(z.requires_grad)
```

**Use When**  
Use for logging, target tensors, and manual control over graph boundaries.

**Avoid When**  
Avoid detaching tensors that still need to contribute to training.

**Gotchas**
- Detached tensors share storage unless copied.
- Detach does not move data or clone by itself.
- In-place changes may affect the original storage.
- Detach breaks gradient flow intentionally.
- Use carefully in multi-branch models.

**Performance Notes**  
Detaching is cheap and useful for reducing autograd graph size.

**Related APIs**  
`torch.no_grad`, `torch.inference_mode`, `tensor.clone`

**Framework Migration Notes**  
This is similar to stopping gradient flow in other frameworks, but the storage sharing behavior matters.

**TensorFlow Equivalent**  
`tf.stop_gradient`

**Version Compatibility**
- **Introduced**: Core autograd API.

**Search Metadata**
- **Aliases**: stop gradient, detach graph
- **Common Search Terms**: pytorch detach tensor
- **Keywords**: autograd, graph, stop-gradient, inference
- **Frequently Confused With**: `clone`, `no_grad`

**Related Models**  
`resnet`, `bert`, `transformer`

**Related Patterns**  
`training-loop`, `validation-loop`

**Related Workflows**  
`production-llm-cost-latency-optimization`

**Related Cheatsheet**  
`pytorch`, `autograd`

**Related Decision Guides**  
`precision-tradeoffs-guide`

**Official Documentation**  
https://pytorch.org/docs/stable/generated/torch.Tensor.detach.html

#### Disable Gradient Calculation

**Task**  
Disable gradient tracking in a code block

**Problem Solved**  
Prevents graph construction during evaluation, preprocessing, or metrics computation.

**Mental Trigger**  
I need this block to run without autograd overhead.

**Syntax**  
```python
torch.no_grad()
```

**Important Parameters**
- None

**Return Value**  
Returns a context manager.

**Example**  
```python
import torch

x = torch.randn(2, 3, requires_grad=True)
with torch.no_grad():
    y = x * 2
print(y.requires_grad)
```

**Use When**  
Use during validation, metrics, and non-training tensor transforms.

**Avoid When**  
Avoid when computing losses intended for backward propagation.

**Gotchas**
- Only affects operations inside the context.
- It does not change existing tensors’ `requires_grad` flags.
- Nested contexts can be confusing in shared utility functions.
- Inference-only code may benefit more from `inference_mode()`.
- Accidentally wrapping training code stops gradient flow.

**Performance Notes**  
Reduces autograd memory overhead compared with training mode.

**Related APIs**  
`torch.inference_mode`, `tensor.detach`

**Framework Migration Notes**  
Use in places where TensorFlow code would use inference-only execution or detached tensors.

**TensorFlow Equivalent**  
No direct equivalent.

**Version Compatibility**
- **Introduced**: Core API.
- **Modern replacement**: Prefer `torch.inference_mode()` for pure inference paths.

**Search Metadata**
- **Aliases**: no grad, inference guard
- **Common Search Terms**: pytorch no_grad
- **Keywords**: autograd, evaluation, inference, context
- **Frequently Confused With**: `torch.inference_mode`

**Related Models**  
`resnet`, `transformer`, `gpt`

**Related Patterns**  
`validation-loop`, `training-loop`

**Related Workflows**  
`image-classification-pipeline`, `production-llm-cost-latency-optimization`

**Related Cheatsheet**  
`pytorch`, `autograd`

**Related Decision Guides**  
`model-serving-frameworks`

**Official Documentation**  
https://pytorch.org/docs/stable/generated/torch.no_grad.html

#### Inference Mode Execution

**Task**  
Run inference with autograd fully disabled

**Problem Solved**  
Executes forward passes with lower overhead than regular no-grad evaluation.

**Mental Trigger**  
I need the fastest safe inference path.

**Syntax**  
```python
torch.inference_mode()
```

**Important Parameters**
- None

**Return Value**  
Returns a context manager.

**Example**  
```python
import torch
import torch.nn as nn

model = nn.Linear(4, 2)
x = torch.randn(3, 4)

with torch.inference_mode():
    y = model(x)
print(y.shape)
```

**Use When**  
Use for production inference, warmup passes, and evaluation without gradient tracking.

**Avoid When**  
Avoid when you need to re-enter autograd on tensors created inside the block.

**Gotchas**
- Tensors created here are inference tensors with stricter semantics.
- It is not a drop-in replacement for training code.
- Some mutation patterns are restricted.
- Do not use when gradients are required later.
- It can expose latent stateful bugs in custom modules.

**Performance Notes**  
Usually lower overhead than `no_grad()` for inference workloads.

**Related APIs**  
`torch.no_grad`, `torch.compile`, `torch.jit.script`

**Framework Migration Notes**  
This is the preferred inference guard in modern PyTorch deployment code.

**TensorFlow Equivalent**  
No direct equivalent.

**Version Compatibility**
- **Introduced**: Modern PyTorch inference API.
- **Replacement**: Prefer over `torch.no_grad()` for pure inference in 2.x code.

**Search Metadata**
- **Aliases**: inference guard, inference-only mode
- **Common Search Terms**: pytorch inference_mode
- **Keywords**: inference, autograd, fast-path, serving
- **Frequently Confused With**: `torch.no_grad`

**Related Models**  
`resnet`, `transformer`, `gpt`, `llama`

**Related Patterns**  
`validation-loop`, `checkpointing`

**Related Workflows**  
`production-llm-cost-latency-optimization`, `image-classification-pipeline`

**Related Cheatsheet**  
`pytorch`, `autograd`

**Related Decision Guides**  
`model-serving-frameworks`

**Official Documentation**  
https://pytorch.org/docs/stable/generated/torch.inference_mode.html

#### Create Custom Autograd Function

**Task**  
Define a custom forward and backward gradient rule

**Problem Solved**  
Implements differentiable operations with custom gradient behavior.

**Mental Trigger**  
I need to override how gradients are computed for this operation.

**Syntax**  
```python
torch.autograd.Function
```

**Important Parameters**
- None

**Return Value**  
Subclassing and calling `.apply()` returns tensors produced by the custom operation.

**Example**  
```python
import torch

class SquareFn(torch.autograd.Function):
    @staticmethod
    def forward(ctx, x):
        ctx.save_for_backward(x)
        return x * x

    @staticmethod
    def backward(ctx, grad_output):
        (x,) = ctx.saved_tensors
        return grad_output * 2 * x

x = torch.tensor(3.0, requires_grad=True)
y = SquareFn.apply(x)
y.backward()
print(x.grad)
```

**Use When**  
Use for custom ops, numerical shortcuts, or wrapping nonstandard kernels.

**Avoid When**  
Avoid when built-in autograd already covers the operation cleanly.

**Gotchas**
- Backward must return one gradient per input.
- Save only tensors needed for backward.
- Non-tensor inputs usually return `None` gradients.
- Incorrect backward logic silently produces wrong training.
- Custom functions are harder to compile and debug.

**Performance Notes**  
Minimize saved tensors to reduce memory use.

**Related APIs**  
`torch.autograd.grad`, `save_for_backward`, `register_hook`

**Framework Migration Notes**  
This is the escape hatch when framework primitives do not match your required gradient behavior.

**TensorFlow Equivalent**  
Custom gradient via `tf.custom_gradient`

**Version Compatibility**
- **Introduced**: Core autograd extension point.

**Search Metadata**
- **Aliases**: custom backward, custom gradient
- **Common Search Terms**: pytorch custom autograd function
- **Keywords**: autograd, function, backward, custom
- **Frequently Confused With**: `register_hook`, `torch.func.grad`

**Related Models**  
`transformer`, `resnet`

**Related Patterns**  
`training-loop`, `mixed-precision`

**Related Workflows**  
`production-llm-cost-latency-optimization`

**Related Cheatsheet**  
`pytorch`, `autograd`

**Related Decision Guides**  
`precision-tradeoffs-guide`

**Official Documentation**  
https://pytorch.org/docs/stable/autograd.html#torch.autograd.Function

#### Register Gradient Hook

**Task**  
Attach a hook to inspect or modify gradients

**Problem Solved**  
Allows runtime inspection, logging, clipping, or transformation of gradients during backpropagation.

**Mental Trigger**  
I need to observe or adjust the gradient as it flows.

**Syntax**  
```python
tensor.register_hook(hook)
```

**Important Parameters**
- `hook`

**Return Value**  
Returns a hook handle.

**Example**  
```python
import torch

x = torch.tensor(2.0, requires_grad=True)

def hook_fn(grad):
    return grad * 0.5

x.register_hook(hook_fn)
y = x * 4
y.backward()
print(x.grad)
```

**Use When**  
Use for gradient logging, custom scaling, or debugging training dynamics.

**Avoid When**  
Avoid when a simpler optimizer or loss formulation can express the same behavior.

**Gotchas**
- Hook runs during backward, not forward.
- Returned gradients replace the original gradient.
- Hooks add runtime overhead.
- Multiple hooks can interact in order-sensitive ways.
- Hooks on non-leaf tensors require careful graph handling.

**Performance Notes**  
Use sparingly in large-scale training due to backward overhead.

**Related APIs**  
`retain_grad`, `torch.autograd.Function`, `clip_grad_norm_`

**Framework Migration Notes**  
Equivalent functionality often requires custom gradient tape logic in other frameworks.

**TensorFlow Equivalent**  
No direct equivalent.

**Version Compatibility**
- **Introduced**: Core autograd hook API.

**Search Metadata**
- **Aliases**: grad hook, backward hook
- **Common Search Terms**: pytorch register_hook gradient
- **Keywords**: autograd, hook, gradient, inspect
- **Frequently Confused With**: `retain_grad`, module hooks

**Related Models**  
`transformer`, `bert`

**Related Patterns**  
`training-loop`, `debugging`

**Related Workflows**  
`production-llm-cost-latency-optimization`

**Related Cheatsheet**  
`pytorch`, `autograd`

**Related Decision Guides**  
`precision-tradeoffs-guide`

**Official Documentation**  
https://pytorch.org/docs/stable/generated/torch.Tensor.register_hook.html

#### Retain Intermediate Gradients

**Task**  
Keep gradients for non-leaf tensors

**Problem Solved**  
Makes intermediate gradient values available for debugging or custom analyses.

**Mental Trigger**  
I need gradients for an intermediate tensor, not just parameters.

**Syntax**  
```python
tensor.retain_grad()
```

**Important Parameters**
- None

**Return Value**  
Returns `None`.

**Example**  
```python
import torch

x = torch.tensor(2.0, requires_grad=True)
y = x * 3
y.retain_grad()
z = y * 4
z.backward()
print(y.grad)
```

**Use When**  
Use when inspecting hidden states, activations, or intermediate tensors.

**Avoid When**  
Avoid in production unless the extra memory cost is justified.

**Gotchas**
- Works only on tensors participating in autograd.
- Increases memory usage.
- Can slow backward on large graphs.
- Non-leaf tensors normally drop `.grad`.
- Often unnecessary outside debugging.

**Performance Notes**  
Use only for targeted inspection because retained gradients increase memory pressure.

**Related APIs**  
`register_hook`, `.grad`, `backward`

**Framework Migration Notes**  
Useful when debugging gradient flow in complex custom graphs.

**TensorFlow Equivalent**  
No direct equivalent.

**Version Compatibility**
- **Introduced**: Core autograd feature.

**Search Metadata**
- **Aliases**: keep intermediate grad, retain activation grad
- **Common Search Terms**: pytorch retain_grad
- **Keywords**: autograd, intermediate, gradient, debug
- **Frequently Confused With**: `register_hook`, `.grad`

**Related Models**  
`transformer`, `bert`, `gpt`

**Related Patterns**  
`training-loop`, `debugging`

**Related Workflows**  
`production-llm-cost-latency-optimization`

**Related Cheatsheet**  
`pytorch`, `autograd`

**Related Decision Guides**  
`precision-tradeoffs-guide`

**Official Documentation**  
https://pytorch.org/docs/stable/generated/torch.Tensor.retain_grad.html

#### Composable Vectorized Autograd

**Task**  
Compute vectorized gradients and batched transforms with `torch.func`

**Problem Solved**  
Applies gradient and vectorization transforms to functions without manual looped autograd code.

**Mental Trigger**  
I need to batch gradient computations or transform a pure function.

**Syntax**  
```python
torch.func.grad(func, argnums=0)
torch.func.vmap(func, in_dims=0, out_dims=0)
```

**Important Parameters**
- `func`
- `argnums`
- `in_dims`
- `out_dims`

**Return Value**  
Returns transformed callables.

**Example**  
```python
import torch

def f(x):
    return (x ** 2).sum()

g = torch.func.grad(f)
x = torch.randn(5)
print(g(x))

batched = torch.func.vmap(lambda t: t * 2)
print(batched(torch.randn(3, 4)).shape)
```

**Use When**  
Use for batched per-sample gradients, vectorized evaluation, and functional-style modeling.

**Avoid When**  
Avoid if your code depends heavily on mutable module state.

**Gotchas**
- Functions should be as pure as possible.
- State mutation can break transforms.
- Shape mismatches become harder to debug.
- Not every Python side effect is compatible with vectorization.
- Some custom ops may not compose cleanly.

**Performance Notes**  
Can significantly reduce Python overhead for batched transforms.

**Related APIs**  
`torch.autograd.grad`, `torch.vmap`, `functional_call`

**Framework Migration Notes**  
This is the closest PyTorch equivalent to combining gradient tape logic with vectorized mapping.

**TensorFlow Equivalent**  
No direct equivalent.

**Version Compatibility**
- **Introduced**: Modern functional API in PyTorch 2.x.
- **Replacement**: Prefer over older functorch-style code.

**Search Metadata**
- **Aliases**: functional autograd, vectorized grad
- **Common Search Terms**: pytorch func grad vmap
- **Keywords**: autograd, vectorization, functional, batching
- **Frequently Confused With**: `torch.autograd.grad`, manual loops

**Related Models**  
`resnet`, `transformer`, `bert`

**Related Patterns**  
`training-loop`, `hyperparameter-search`

**Related Workflows**  
`image-classification-pipeline`

**Related Cheatsheet**  
`pytorch`, `autograd`

**Related Decision Guides**  
`precision-tradeoffs-guide`

**Official Documentation**  
https://pytorch.org/docs/stable/func.html

### Neural Network Layers

#### Linear Layer

**Task**  
Apply an affine transformation with `nn.Linear`

**Problem Solved**  
Projects feature vectors into a new representation for classifiers, regressors, and attention blocks.

**Mental Trigger**  
I need a dense projection layer.

**Syntax**  
```python
torch.nn.Linear(in_features, out_features, bias=True, device=None, dtype=None)
```

**Important Parameters**
- `in_features`
- `out_features`
- `bias`
- `device`
- `dtype`

**Return Value**  
Returns an `nn.Module` that maps inputs of shape `(*, in_features)` to `(*, out_features)`.

**Example**  
```python
import torch
import torch.nn as nn

layer = nn.Linear(4, 2)
x = torch.randn(3, 4)
y = layer(x)
print(y.shape)
```

**Use When**  
Use in classifier heads, MLP blocks, and projection layers.

**Avoid When**  
Avoid when spatial structure should be preserved; use convolution instead.

**Gotchas**
- Input feature dimension must match `in_features`.
- Weights are initialized automatically, not zeroed.
- Works on the last dimension of the input.
- Mismatched dtype or device causes runtime errors.
- Bias can be disabled explicitly.

**Performance Notes**  
Linear layers benefit strongly from GPU acceleration and fused kernels.

**Related APIs**  
`nn.LazyLinear`, `torch.matmul`, `nn.Sequential`

**Framework Migration Notes**  
This is the direct analog of a fully connected layer in most frameworks.

**TensorFlow Equivalent**  
`tf.keras.layers.Dense`

**Version Compatibility**
- **Introduced**: Core module API.
- **Modern replacement**: Same in 2.x; use explicit device/dtype where needed.

**Search Metadata**
- **Aliases**: Dense layer, fully connected layer
- **Common Search Terms**: pytorch linear layer
- **Keywords**: dense, projection, affine, module
- **Frequently Confused With**: `nn.LazyLinear`, `torch.matmul`

**Related Models**  
`resnet`, `bert`, `gpt`, `logistic-regression`

**Related Patterns**  
`training-loop`

**Related Workflows**  
`image-classification-pipeline`, `text-classification-pipeline-classical-encoder`

**Related Cheatsheet**  
`pytorch`

**Related Decision Guides**  
`hardware-selection-guide`

**Official Documentation**  
https://pytorch.org/docs/stable/generated/torch.nn.Linear.html

#### 1D Convolution

**Task**  
Apply a 1D convolution with `nn.Conv1d`

**Problem Solved**  
Processes sequential or signal-like inputs with learnable local filters.

**Mental Trigger**  
I need a convolution over a 1D sequence.

**Syntax**  
```python
torch.nn.Conv1d(in_channels, out_channels, kernel_size, stride=1, padding=0, dilation=1, groups=1, bias=True, padding_mode='zeros', device=None, dtype=None)
```

**Important Parameters**
- `in_channels`
- `out_channels`
- `kernel_size`
- `stride`
- `padding`

**Return Value**  
Returns an `nn.Module` producing 1D feature maps.

**Example**  
```python
import torch
import torch.nn as nn

conv = nn.Conv1d(4, 8, kernel_size=3, padding=1)
x = torch.randn(2, 4, 16)
y = conv(x)
print(y.shape)
```

**Use When**  
Use for text, audio, sensor streams, or compact temporal feature extraction.

**Avoid When**  
Avoid when the input is image-like and should preserve two spatial axes; use `Conv2d`.

**Gotchas**
- Input shape is `(N, C, L)`.
- Channel count must match `in_channels`.
- Padding and stride change output length.
- `groups` changes how channels are connected.
- Sequence length may shrink unexpectedly.

**Performance Notes**  
Convolutions are highly optimized on GPU, but small batches may underutilize hardware.

**Related APIs**  
`nn.Conv2d`, `nn.Conv3d`, `nn.MaxPool1d`

**Framework Migration Notes**  
Use when replacing recurrent feature extractors with local temporal convolutions.

**TensorFlow Equivalent**  
`tf.keras.layers.Conv1D`

**Version Compatibility**
- **Introduced**: Core module API.

**Search Metadata**
- **Aliases**: temporal conv, 1D conv
- **Common Search Terms**: pytorch conv1d
- **Keywords**: convolution, sequence, channels, kernel
- **Frequently Confused With**: `nn.Conv2d`, `nn.Conv3d`

**Related Models**  
`transformer`, `bert`

**Related Patterns**  
`training-loop`

**Related Workflows**  
`text-classification-pipeline-classical-encoder`

**Related Cheatsheet**  
`pytorch`

**Related Decision Guides**  
`hardware-selection-guide`

**Official Documentation**  
https://pytorch.org/docs/stable/generated/torch.nn.Conv1d.html

#### 2D Convolution

**Task**  
Apply a 2D convolution with `nn.Conv2d`

**Problem Solved**  
Extracts local spatial features from images and feature maps.

**Mental Trigger**  
I need a convolution over height and width.

**Syntax**  
```python
torch.nn.Conv2d(in_channels, out_channels, kernel_size, stride=1, padding=0, dilation=1, groups=1, bias=True, padding_mode='zeros', device=None, dtype=None)
```

**Important Parameters**
- `in_channels`
- `out_channels`
- `kernel_size`
- `stride`
- `padding`

**Return Value**  
Returns an `nn.Module` that maps 4D image-like tensors to 4D outputs.

**Example**  
```python
import torch
import torch.nn as nn

conv = nn.Conv2d(3, 16, kernel_size=3, padding=1)
x = torch.randn(2, 3, 32, 32)
y = conv(x)
print(y.shape)
```

**Use When**  
Use for image backbones, detectors, and feature extractors.

**Avoid When**  
Avoid when the problem is purely sequential; use 1D layers or attention.

**Gotchas**
- Input shape is `(N, C, H, W)`.
- Channel order mistakes are common.
- Output size depends on stride, padding, and dilation.
- Grouped convolutions change weight layout.
- Non-contiguous layout can affect downstream ops.

**Performance Notes**  
Convolution throughput is sensitive to tensor layout and accelerator backend choice.

**Related APIs**  
`nn.Conv1d`, `nn.MaxPool2d`, `nn.BatchNorm2d`

**Framework Migration Notes**  
This is the core building block for most vision backbones.

**TensorFlow Equivalent**  
`tf.keras.layers.Conv2D`

**Version Compatibility**
- **Introduced**: Core module API.

**Search Metadata**
- **Aliases**: spatial conv, image conv
- **Common Search Terms**: pytorch conv2d
- **Keywords**: convolution, image, spatial, feature map
- **Frequently Confused With**: `nn.Conv1d`, `nn.Conv3d`

**Related Models**  
`resnet`, `yolo`, `vit`

**Related Patterns**  
`training-loop`

**Related Workflows**  
`image-classification-pipeline`, `object-detection-pipeline`

**Related Cheatsheet**  
`pytorch`

**Related Decision Guides**  
`hardware-selection-guide`

**Official Documentation**  
https://pytorch.org/docs/stable/generated/torch.nn.Conv2d.html

#### 3D Convolution

**Task**  
Apply a 3D convolution with `nn.Conv3d`

**Problem Solved**  
Processes volumetric or spatiotemporal inputs with learnable 3D kernels.

**Mental Trigger**  
I need a convolution over depth, height, and width.

**Syntax**  
```python
torch.nn.Conv3d(in_channels, out_channels, kernel_size, stride=1, padding=0, dilation=1, groups=1, bias=True, padding_mode='zeros', device=None, dtype=None)
```

**Important Parameters**
- `in_channels`
- `out_channels`
- `kernel_size`
- `stride`
- `padding`

**Return Value**  
Returns an `nn.Module` for 5D input tensors.

**Example**  
```python
import torch
import torch.nn as nn

conv = nn.Conv3d(1, 4, kernel_size=3, padding=1)
x = torch.randn(2, 1, 8, 16, 16)
y = conv(x)
print(y.shape)
```

**Use When**  
Use for videos, medical volumes, or 3D feature grids.

**Avoid When**  
Avoid when 2D spatial structure is sufficient; 3D convolutions are more expensive.

**Gotchas**
- Input shape is `(N, C, D, H, W)`.
- Memory usage grows quickly with volume size.
- Output shape calculations are easy to misread.
- Channel and depth dimensions are distinct.
- Small batch sizes may reduce GPU efficiency.

**Performance Notes**  
3D convolution is memory intensive and often requires careful batch sizing.

**Related APIs**  
`nn.Conv2d`, `nn.MaxPool3d`

**Framework Migration Notes**  
Use when extending vision pipelines to volumetric data.

**TensorFlow Equivalent**  
`tf.keras.layers.Conv3D`

**Version Compatibility**
- **Introduced**: Core module API.

**Search Metadata**
- **Aliases**: volumetric conv, 3D conv
- **Common Search Terms**: pytorch conv3d
- **Keywords**: convolution, volume, video, spatiotemporal
- **Frequently Confused With**: `nn.Conv2d`

**Related Models**  
`resnet`

**Related Patterns**  
`training-loop`

**Related Workflows**  
`object-detection-pipeline`

**Related Cheatsheet**  
`pytorch`

**Related Decision Guides**  
`hardware-selection-guide`

**Official Documentation**  
https://pytorch.org/docs/stable/generated/torch.nn.Conv3d.html

#### Max Pooling 2D

**Task**  
Downsample spatial features with max pooling

**Problem Solved**  
Reduces feature-map resolution while preserving strong activations.

**Mental Trigger**  
I need to shrink spatial size by taking local maxima.

**Syntax**  
```python
torch.nn.MaxPool2d(kernel_size, stride=None, padding=0, dilation=1, return_indices=False, ceil_mode=False)
```

**Important Parameters**
- `kernel_size`
- `stride`
- `padding`
- `ceil_mode`

**Return Value**  
Returns pooled feature maps, and optionally indices.

**Example**  
```python
import torch
import torch.nn as nn

pool = nn.MaxPool2d(2)
x = torch.randn(2, 3, 8, 8)
y = pool(x)
print(y.shape)
```

**Use When**  
Use to reduce resolution in CNN backbones.

**Avoid When**  
Avoid when average behavior is more appropriate for feature aggregation.

**Gotchas**
- Spatial dimensions shrink based on kernel and stride.
- `ceil_mode` changes output sizing.
- Indices are only returned if requested.
- Pooling can discard fine detail.
- Shape calculation errors are common.

**Performance Notes**  
Pooling is cheap compared with convolutions, but still affects memory traffic.

**Related APIs**  
`nn.AvgPool2d`, `nn.AdaptiveAvgPool2d`

**Framework Migration Notes**  
This is a standard spatial downsampling primitive in vision models.

**TensorFlow Equivalent**  
`tf.keras.layers.MaxPool2D`

**Version Compatibility**
- **Introduced**: Core module API.

**Search Metadata**
- **Aliases**: max pool, spatial pooling
- **Common Search Terms**: pytorch maxpool2d
- **Keywords**: pooling, downsample, spatial, max
- **Frequently Confused With**: `nn.AvgPool2d`

**Related Models**  
`resnet`, `yolo`

**Related Patterns**  
`training-loop`

**Related Workflows**  
`image-classification-pipeline`

**Related Cheatsheet**  
`pytorch`

**Related Decision Guides**  
`hardware-selection-guide`

**Official Documentation**  
https://pytorch.org/docs/stable/generated/torch.nn.MaxPool2d.html

#### Average Pooling 2D

**Task**  
Downsample spatial features with average pooling

**Problem Solved**  
Aggregates local neighborhoods by averaging values instead of taking maxima.

**Mental Trigger**  
I need smooth spatial downsampling.

**Syntax**  
```python
torch.nn.AvgPool2d(kernel_size, stride=None, padding=0, ceil_mode=False, count_include_pad=True, divisor_override=None)
```

**Important Parameters**
- `kernel_size`
- `stride`
- `padding`
- `count_include_pad`

**Return Value**  
Returns pooled feature maps.

**Example**  
```python
import torch
import torch.nn as nn

pool = nn.AvgPool2d(2)
x = torch.randn(2, 3, 8, 8)
y = pool(x)
print(y.shape)
```

**Use When**  
Use for smoothing or controlled downsampling.

**Avoid When**  
Avoid when you need activation-preserving downsampling; prefer max pooling.

**Gotchas**
- Padding behavior affects the average.
- Output size still depends on kernel and stride.
- `count_include_pad` changes results.
- Poorly chosen parameters can blur useful signals.
- Often not interchangeable with max pooling.

**Performance Notes**  
Typically inexpensive and straightforward on accelerators.

**Related APIs**  
`nn.MaxPool2d`, `nn.AdaptiveAvgPool2d`

**Framework Migration Notes**  
Use where the model benefits from averaging rather than peak selection.

**TensorFlow Equivalent**  
`tf.keras.layers.AveragePooling2D`

**Version Compatibility**
- **Introduced**: Core module API.

**Search Metadata**
- **Aliases**: avg pool, mean pooling
- **Common Search Terms**: pytorch avgpool2d
- **Keywords**: pooling, downsample, average, spatial
- **Frequently Confused With**: `nn.MaxPool2d`

**Related Models**  
`resnet`, `vit`

**Related Patterns**  
`training-loop`

**Related Workflows**  
`image-classification-pipeline`

**Related Cheatsheet**  
`pytorch`

**Related Decision Guides**  
`hardware-selection-guide`

**Official Documentation**  
https://pytorch.org/docs/stable/generated/torch.nn.AvgPool2d.html

#### Adaptive Average Pooling 2D

**Task**  
Convert spatial maps to a fixed output size with adaptive average pooling

**Problem Solved**  
Produces a consistent spatial output regardless of input resolution.

**Mental Trigger**  
I need a fixed-size feature map from variable-size images.

**Syntax**  
```python
torch.nn.AdaptiveAvgPool2d(output_size)
```

**Important Parameters**
- `output_size`

**Return Value**  
Returns a tensor with the requested spatial size.

**Example**  
```python
import torch
import torch.nn as nn

pool = nn.AdaptiveAvgPool2d((1, 1))
x = torch.randn(2, 3, 11, 17)
y = pool(x)
print(y.shape)
```

**Use When**  
Use before classifier heads or global pooling stages.

**Avoid When**  
Avoid when input resolution is already fixed and a normal pooling layer is sufficient.

**Gotchas**
- Output size is enforced exactly.
- Works well for variable-resolution inputs.
- Usually follows convolutional feature extraction.
- Can hide resolution-dependent assumptions.
- Misusing it can flatten useful spatial detail too early.

**Performance Notes**  
Useful for reducing feature size before linear heads.

**Related APIs**  
`nn.AvgPool2d`, `torch.flatten`

**Framework Migration Notes**  
This is a common replacement for hardcoded reshape logic before dense heads.

**TensorFlow Equivalent**  
`tf.keras.layers.GlobalAveragePooling2D` for `(1,1)` style usage

**Version Compatibility**
- **Introduced**: Core module API.

**Search Metadata**
- **Aliases**: global average pooling, adaptive pool
- **Common Search Terms**: pytorch adaptiveavgpool2d
- **Keywords**: pooling, fixed output, global, spatial
- **Frequently Confused With**: `nn.AvgPool2d`

**Related Models**  
`resnet`, `vit`

**Related Patterns**  
`training-loop`

**Related Workflows**  
`image-classification-pipeline`

**Related Cheatsheet**  
`pytorch`

**Related Decision Guides**  
`hardware-selection-guide`

**Official Documentation**  
https://pytorch.org/docs/stable/generated/torch.nn.AdaptiveAvgPool2d.html


<span style="display:none">[^1][^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^2][^20][^21][^22][^3][^4][^5][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: AENS-Knowledge-Layer-Specification.md

[^2]: directory_structure.md

[^3]: AI_CONTEXT.md

[^4]: AENS_CANONICAL_SPECIFICATION.md

[^5]: MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md

[^6]: https://docs.pytorch.org/docs/stable/index.html

[^7]: https://docs.pytorch.org/tutorials/index.html

[^8]: https://docs.pytorch.org/

[^9]: https://pytorch.org/resources/

[^10]: https://docs.pytorch.org/docs/stable/pytorch-api.html

[^11]: https://docs.pytorch.org/docs/versions.html

[^12]: https://github.com/pytorch/pytorch/wiki

[^13]: https://docs.pytorch.org/rl/main/reference/index.html

[^14]: https://github.com/pytorch/pytorch/tree/main/docs

[^15]: https://docs.pytorch.org/docs/main/pytorch-api.html

[^16]: https://arxiv.org/abs/2409.12682

[^17]: https://arxiv.org/abs/2510.09108

[^18]: https://semantics.knu.ua//article/view/4591

[^19]: https://kbsu.ru/nauchnye-izdaniya/zhurnal-kavkazologiya/kavkazologija-2024-3-soderzhanie/kavkazologija-2024-3-kushhabiev-a-v-zhurtova-a-a-alhasova-d-m/

[^20]: https://kp-journal.ru/педагогические-условия-формировани-4

[^21]: http://v-khsac.in.ua/article/view/307534

[^22]: https://techniumscience.com/index.php/socialsciences/article/view/11477

[^1]: AENS_CANONICAL_SPECIFICATION.md

[^2]: AI_CONTEXT.md

[^3]: MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md

[^4]: AENS-Knowledge-Layer-Specification.md

[^5]: https://docs.pytorch.org/tutorials/beginner/blitz/autograd_tutorial.html

[^6]: https://docs.pytorch.org/tutorials/beginner/introyt/autogradyt_tutorial.html

[^7]: https://docs.pytorch.org/docs/stable/generated/torch.nn.Module

[^8]: https://docs.pytorch.org/docs/stable/autograd.html

[^9]: https://medium.com/@hammadfarooq470/autograd-in-pytorch-the-little-engine-that-powers-deep-learning-df3565b59a5f

[^10]: https://developers.redhat.com/articles/2026/03/03/optimize-pytorch-training-autograd-engine

[^11]: https://docs.pytorch.org/cppdocs/api/nn/index.html

[^12]: https://docs.pytorch.org/docs/2.9/notes/autograd.html

[^13]: https://pytorch-cn.readthedocs.io/zh/stable/package_references/torch-nn/

[^14]: https://medium.com/@piyushkashyap045/understanding-pytorch-autograd-a-complete-guide-for-deep-learning-practitioners-f5dd1f43b417

[^15]: https://resmilitaris.net/index.php/resmilitaris/article/view/4434

[^16]: https://ieeexplore.ieee.org/document/11359604/

[^17]: https://ijesty.org/index.php/ijesty/article/view/955

[^18]: https://link.springer.com/10.1007/978-3-030-66770-2_14

[^19]: https://www.semanticscholar.org/paper/9f6d673c4c37a036ff63b7b20cb4ca5198d30134

[^20]: https://ieeexplore.ieee.org/document/11240802/

[^21]: https://upsjournals.com/jcsee/article/view/935

[^22]: https://ojs.bbwpublisher.com/index.php/JERA/article/view/13900

[^6]: https://docs.pytorch.org/docs/stable/index.html

[^7]: https://www.youtube.com/watch?v=KnbVBXsbyxg

[^8]: https://mcpservers.org/agent-skills/factory-ai/wiki

[^9]: https://docs.pytorch.org/tutorials/index.html

[^10]: https://github.com/wanshuiyin/Auto-claude-code-research-in-sleep/blob/main/skills/paper-write/SKILL.md

[^11]: https://www.codecademy.com/resources/docs/pytorch

[^12]: https://github.com/pytorch/pytorch

[^13]: https://www.reddit.com/r/opensource/comments/hx3nxh/i_created_a_contributingmd_generator_and_need/

[^14]: https://github.com/pytorch/pytorch/blob/main/CONTRIBUTING.md

[^15]: https://www.glukhov.org/de/documentation-tools/markdown/markdown-cheatsheet/

[^16]: https://arxiv.org/pdf/2207.05987.pdf

[^17]: http://arxiv.org/pdf/1707.02275v1.pdf

[^18]: https://www.aclweb.org/anthology/D19-1546.pdf

[^19]: https://aclanthology.org/2023.findings-emnlp.89.pdf

[^20]: http://arxiv.org/pdf/2412.04478.pdf

[^21]: https://arxiv.org/pdf/2306.16307.pdf

[^22]: http://arxiv.org/pdf/2407.08597.pdf

[^23]: https://pmc.ncbi.nlm.nih.gov/articles/PMC10495961/

