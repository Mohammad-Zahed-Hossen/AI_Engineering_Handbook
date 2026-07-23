## Task

Create Tensor from Python Sequence (`torch.tensor`)

## Problem Solved

Construct a new Tensor from Python scalars or nested sequences for immediate computation.

## Mental Trigger

I need a fresh tensor built from Python lists or scalars that does not share memory with the source.

## Syntax

torch.tensor(data, dtype=None, device=None, requires_grad=False, pin_memory=False)

## Important Parameters

- data — Python scalar, list, tuple, or ndarray input.
- dtype — desired tensor dtype.
- device — target device (cpu, cuda).
- requires_grad — whether autograd should track the tensor.
- pin_memory — pin host memory for faster transfer to CUDA.


## Return Value

A newly allocated torch.Tensor with its own storage (always copies input data when data is a Python sequence).

## Example

import torch
t = torch.tensor([1.0, 2.0, 3.0], dtype=torch.float32)

## Use When

You want an independent Tensor created from Python-native data and do not require zero-copy semantics.

## Avoid When

You need to avoid copies (use torch.as_tensor or torch.from_numpy instead).

## Gotchas

- Always copies Python sequences; does not share memory with the source.
- When passed a tensor, behaves like clone().detach(), which can produce a new leaf tensor.
- dtype inference may upcast (e.g., ints → long) depending on input; specify dtype to avoid surprises.
- pin_memory only affects CPU tensors and is ignored on CUDA.


## Performance Notes

Allocates new memory and copies data — use for small construction or when isolation is required; avoid in tight loops where zero-copy is needed.

## Related APIs

torch.as_tensor, torch.from_numpy, torch.clone, torch.empty

## Framework Migration Notes

NumPy users: similar to numpy.array but always copies Python sequences; prefer as_tensor/from_numpy for zero-copy with ndarrays.

## TensorFlow Equivalent

tf.convert_to_tensor(data) — creates a new TensorFlow Tensor (may copy depending on input).

## Version Compatibility

No significant changes in modern PyTorch releases.

## Search Metadata

- Aliases: tensor_constructor
- Common Search Terms: create tensor from list, torch.tensor copy
- Keywords: creation, allocation, copy
- Frequently Confused With: torch.as_tensor, torch.from_numpy


## Related Models

resnet

## Related Patterns

device-placement

## Related Workflows

image-classification-pipeline

## Related Cheatsheet

tensor-creation

## Related Decision Guides

precision-tradeoffs-guide

## Official Documentation

https://docs.pytorch.org/docs/stable/generated/torch.tensor.html

***

## Task

Create Tensor from Existing Data avoiding copies (`torch.as_tensor`)

## Problem Solved

Wrap existing array-like data into a Tensor while avoiding unnecessary copies when possible.

## Mental Trigger

I need a tensor view over existing numeric data without allocating a duplicate buffer.

## Syntax

torch.as_tensor(data, dtype=None, device=None)

## Important Parameters

- data — array-like (tensor, ndarray, sequence).
- dtype — requested dtype (may trigger copy if conversion required).
- device — optional device placement for the returned tensor.


## Return Value

A tensor referencing the input where possible (no copy for tensor inputs; may share memory with NumPy arrays in some cases).

## Example

import torch, numpy as np
a = np.array(, dtype=np.float32)[^1][^2][^3]
t = torch.as_tensor(a)

## Use When

Wrapping existing tensors or NumPy arrays for computation without forcing a copy.

## Avoid When

You need a guaranteed new allocation (use torch.tensor), or when input is read-only NumPy array requiring write access.

## Gotchas

- May still copy if dtype/device conversion is necessary.
- If input is a torch.Tensor, returns a tensor that may share storage — changes may affect original.
- Read-only NumPy arrays may produce undefined behavior if written through the tensor.
- as_tensor with nested Python lists will copy.


## Performance Notes

Preferable to torch.tensor for zero-copy wrapping; minimal overhead when no conversion required.

## Related APIs

torch.tensor, torch.from_numpy, torch.clone

## Framework Migration Notes

NumPy users: closer to numpy.asarray semantics (no copy when possible).

## TensorFlow Equivalent

tf.convert_to_tensor with zero-copy is not guaranteed; tf.constant typically copies.

## Version Compatibility

No significant changes in modern PyTorch releases.

## Search Metadata

- Aliases: as_tensor
- Common Search Terms: wrap numpy to tensor no copy, as_tensor vs tensor
- Keywords: zero-copy, view, adapter
- Frequently Confused With: torch.tensor, torch.from_numpy


## Related Models

vit

## Related Patterns

tensor-broadcasting

## Related Workflows

image-classification-pipeline

## Related Cheatsheet

tensor-creation

## Related Decision Guides

hardware-selection-guide

## Official Documentation

https://docs.pytorch.org/docs/stable/generated/torch.as_tensor.html

***

## Task

Create Tensor from NumPy Array with Zero-Copy (`torch.from_numpy`)

## Problem Solved

Create a Tensor that shares memory with a NumPy ndarray to avoid allocation and copying.

## Mental Trigger

I need a zero-copy tensor view of an ndarray so updates reflect bidirectionally.

## Syntax

torch.from_numpy(ndarray)

## Important Parameters

- ndarray — NumPy ndarray with compatible dtype and writable memory.
- (no other parameters; device/dtype must be handled separately)


## Return Value

A CPU tensor that shares the same underlying memory as the ndarray (no allocation).

## Example

import torch, numpy as np
a = np.array([1.0,2.0], dtype=np.float32)
t = torch.from_numpy(a)

## Use When

Interfacing with NumPy workflows and you need memory-efficient sharing between NumPy and PyTorch.

## Avoid When

Working on CUDA devices (must copy to GPU explicitly) or when the NumPy array is read-only.

## Gotchas

- Returned tensor is CPU-only; moving to CUDA performs a copy.
- Writing to tensor will modify ndarray and vice versa; watch for unintended mutations.
- Using read-only ndarrays is unsupported and may produce undefined behavior.
- Dtype compatibility is limited to supported NumPy dtypes.


## Performance Notes

Zero-copy for CPU paths yields minimal overhead; moving to device causes allocation and copy.

## Related APIs

torch.as_tensor, tensor.numpy, torch.tensor

## Framework Migration Notes

Direct memory sharing unlike most TensorFlow conversions; similar spirit to numpy.asarray but specifically returns a torch.Tensor.

## TensorFlow Equivalent

tf.convert_to_tensor typically copies; no direct zero-copy ndarray-to-tensor mapping guaranteed.

## Version Compatibility

No significant changes in modern PyTorch releases.

## Search Metadata

- Aliases: from_numpy
- Common Search Terms: numpy to torch zero copy, from_numpy shared memory
- Keywords: zero-copy, numpy, interoperability
- Frequently Confused With: torch.as_tensor, torch.tensor


## Related Models

bert

## Related Patterns

device-placement

## Related Workflows

text-classification-pipeline-classical-encoder

## Related Cheatsheet

tensor-creation

## Related Decision Guides

hardware-selection-guide

## Official Documentation

https://docs.pytorch.org/docs/stable/generated/torch.from_numpy.html

***

## Task

Create Zero-Filled Tensor (`torch.zeros` / `torch.zeros_like`)

## Problem Solved

Allocate tensors initialized to zero for weights, masks, or placeholders.

## Mental Trigger

I need a tensor pre-filled with zeros matching a shape or another tensor.

## Syntax

torch.zeros(*size, dtype=None, device=None, requires_grad=False, pin_memory=False)
torch.zeros_like(input, dtype=None, device=None, requires_grad=False, memory_format=torch.preserve_format)

## Important Parameters

- size / input — output shape or reference tensor.
- dtype — data type.
- device — placement device.
- requires_grad — autograd tracking flag.
- pin_memory / memory_format — host memory pinning and format control.


## Return Value

A newly allocated tensor filled with zeros; zeros_like matches input metadata unless overridden.

## Example

import torch
z = torch.zeros(3,4, dtype=torch.float32)
z2 = torch.zeros_like(z)

## Use When

You need deterministic zero initialization or masks with the same shape as existing tensors.

## Avoid When

You need uninitialized memory for performance (use torch.empty).

## Gotchas

- zeros_like will preserve memory format and device by default; explicit device param may allocate copy.
- Requires explicit dtype to avoid unexpected integer/float choices.
- pin_memory only applies to CPU tensors.
- zeros allocates memory; frequent small zeros calls can be costly.


## Performance Notes

Zero-initialization writes memory; torch.empty+fill_ can be marginally faster for some backends but less explicit.

## Related APIs

torch.empty, torch.ones, torch.full, torch.zeros_like

## Framework Migration Notes

Analogous to numpy.zeros; behavior is familiar to NumPy users.

## TensorFlow Equivalent

tf.zeros / tf.zeros_like

## Version Compatibility

No significant changes in modern PyTorch releases.

## Search Metadata

- Aliases: zeros, zeros_like
- Common Search Terms: create zeros tensor, zeros_like shape
- Keywords: initialization, mask, allocation
- Frequently Confused With: torch.empty, torch.full


## Related Models

resnet

## Related Patterns

tensor-creation

## Related Workflows

image-classification-pipeline

## Related Cheatsheet

tensor-creation

## Related Decision Guides

precision-tradeoffs-guide

## Official Documentation

https://docs.pytorch.org/docs/stable/generated/torch.zeros.html

***

## Task

Create One-Filled Tensor (`torch.ones` / `torch.ones_like`)

## Problem Solved

Allocate tensors filled with ones for scalar bias initializations or masks.

## Mental Trigger

I need a tensor of ones matching a shape or another tensor.

## Syntax

torch.ones(*size, dtype=None, device=None, requires_grad=False, pin_memory=False)
torch.ones_like(input, dtype=None, device=None, requires_grad=False, memory_format=torch.preserve_format)

## Important Parameters

- size / input — shape or reference tensor.
- dtype — output dtype.
- device — placement device.
- requires_grad — autograd flag.
- memory_format / pin_memory — memory layout and pin options.


## Return Value

A newly allocated tensor filled with ones; ones_like mirrors input metadata by default.

## Example

import torch
o = torch.ones(2,3)
o2 = torch.ones_like(o)

## Use When

Creating constant masks or initialization where ones are required.

## Avoid When

You need uninitialized memory for performance reasons.

## Gotchas

- One-fill writes memory and causes allocation overhead.
- ones_like inherits layout/device unless overridden.
- Be explicit with dtype to avoid integer vs float surprises.
- Frequent allocation in tight loops is costly.


## Performance Notes

Same allocation cost as zeros; use in-place operations only when safe.

## Related APIs

torch.zeros, torch.full, torch.empty

## Framework Migration Notes

Matches numpy.ones semantics.

## TensorFlow Equivalent

tf.ones / tf.ones_like

## Version Compatibility

No significant changes in modern PyTorch releases.

## Search Metadata

- Aliases: ones, ones_like
- Common Search Terms: ones tensor, ones_like torch
- Keywords: initialization, mask
- Frequently Confused With: torch.full, torch.zeros


## Related Models

random-forest

## Related Patterns

tensor-creation

## Related Workflows

image-classification-pipeline

## Related Cheatsheet

tensor-creation

## Related Decision Guides

hardware-selection-guide

## Official Documentation

https://docs.pytorch.org/docs/stable/generated/torch.ones.html

***

## Task

Create Uninitialized Tensor Memory (`torch.empty` / `torch.empty_like`)

## Problem Solved

Allocate tensor storage without initializing values for performance-sensitive paths.

## Mental Trigger

I need allocated memory that I will overwrite immediately to avoid initialization cost.

## Syntax

torch.empty(*size, dtype=None, device=None, requires_grad=False, pin_memory=False)
torch.empty_like(input, dtype=None, device=None, requires_grad=False, memory_format=torch.preserve_format)

## Important Parameters

- size / input — shape or reference.
- dtype — dtype of allocated storage.
- device — target device.
- requires_grad — autograd flag.
- memory_format / pin_memory — layout/pinning options.


## Return Value

A tensor with uninitialized (indeterminate) memory; contents are unspecified until written.

## Example

import torch
e = torch.empty(3,3, dtype=torch.float32)

## Use When

Preallocating buffers to be filled by computation, reducing allocation overhead.

## Avoid When

You need deterministic initial values (use zeros/ones/full).

## Gotchas

- Contents are uninitialized and may contain arbitrary data; always overwrite before use.
- On some backends, empty may still zero memory for safety (backend-dependent).
- Using values before assignment yields nondeterministic results.
- empty_like inherits metadata and may produce unexpected layout unless controlled.


## Performance Notes

Avoids initialization cost which can improve startup and tight-loop performance.

## Related APIs

torch.zeros, torch.ones, torch.full

## Framework Migration Notes

Similar to numpy.empty semantics; NumPy users should likewise ensure overwrite before use.

## TensorFlow Equivalent

tf.empty is not a direct API; tf.Variable with uninitialized values is uncommon — TensorFlow generally initializes tensors.

## Version Compatibility

No significant changes in modern PyTorch releases.

## Search Metadata

- Aliases: empty, empty_like
- Common Search Terms: uninitialized tensor, torch.empty usage
- Keywords: allocation, performance, buffer
- Frequently Confused With: torch.zeros, torch.empty_like


## Related Models

gpt

## Related Patterns

memory-efficient-training

## Related Workflows

production-llm-cost-latency-optimization

## Related Cheatsheet

tensor-creation

## Related Decision Guides

precision-tradeoffs-guide

## Official Documentation

https://docs.pytorch.org/docs/stable/generated/torch.empty.html

***

## Task

Create Constant-Filled Tensor (`torch.full` / `torch.full_like`)

## Problem Solved

Allocate tensors initialized to a specified constant value across all elements.

## Mental Trigger

I need a tensor filled with a specific scalar value that matches another tensor's shape or explicit size.

## Syntax

torch.full(size, fill_value, dtype=None, device=None, requires_grad=False, pin_memory=False)
torch.full_like(input, fill_value, dtype=None, device=None, requires_grad=False, memory_format=torch.preserve_format)

## Important Parameters

- size / input — desired shape or reference tensor.
- fill_value — scalar value to fill.
- dtype — output dtype.
- device — placement device.
- requires_grad — autograd behavior.


## Return Value

A newly allocated tensor where all elements equal fill_value.

## Example

import torch
f = torch.full((2,2), 7.0)

## Use When

Initializing bias tensors, masks with non-zero default values, or sentinel arrays.

## Avoid When

You can use broadcasted arithmetic on zeros/ones to compute values without allocation.

## Gotchas

- fill_value will be cast to dtype; ensure compatible dtype to avoid precision loss.
- full_like inherits input metadata unless overridden.
- Allocation cost similar to zeros/ones.
- Using large full allocations can increase memory footprint.


## Performance Notes

Write-initialization of memory incurs allocation cost; consider in-place arithmetic when appropriate.

## Related APIs

torch.zeros, torch.ones, torch.empty

## Framework Migration Notes

Equivalent to numpy.full.

## TensorFlow Equivalent

tf.fill

## Version Compatibility

No significant changes in modern PyTorch releases.

## Search Metadata

- Aliases: full, full_like
- Common Search Terms: constant tensor, fill tensor
- Keywords: initialization, constant
- Frequently Confused With: torch.ones, torch.zeros


## Related Models

bert

## Related Patterns

tensor-creation

## Related Workflows

text-classification-pipeline-classical-encoder

## Related Cheatsheet

tensor-creation

## Related Decision Guides

precision-tradeoffs-guide

## Official Documentation

https://docs.pytorch.org/docs/stable/generated/torch.full.html

***

## Task

Create Random Tensor (`torch.rand` / `torch.randn` / `torch.randint`)

## Problem Solved

Generate tensors with samples from common random distributions for initialization or stochastic workflows.

## Mental Trigger

I need random or normally distributed tensors or integer samples for sampling indices.

## Syntax

torch.rand(*size, dtype=None, device=None)
torch.randn(*size, dtype=None, device=None)
torch.randint(low, high, size, dtype=None, device=None)

## Important Parameters

- size — output shape.
- dtype — output dtype (rand/randn returns float dtypes).
- device — placement device.
- low/high (randint) — integer range for sampling.
- generator — optional RNG for reproducibility (not always present in shorthand).


## Return Value

A newly allocated tensor filled with random samples from the specified distribution.

## Example

import torch
r = torch.rand(4,4)
n = torch.randn(3)
i = torch.randint(0, 10, (5,))

## Use When

Parameter initialization, data augmentation randomness, stochastic algorithms.

## Avoid When

A deterministic sequence is required; use manual seeding or deterministic generators.

## Gotchas

- Randomness depends on global RNG state unless a generator is provided.
- Moving random tensors between devices performs allocation/copy.
- Seeding must be managed across processes for distributed reproducibility.
- dtype choices affect supported distributions (rand/randn produce floating types).


## Performance Notes

Random number generation can be a measurable cost at scale; prefer batched generation and reuse generators.

## Related APIs

torch.manual_seed, torch.Generator, torch.rand_like

## Framework Migration Notes

Similar semantics to NumPy's random APIs but integrates with torch's RNG and device semantics.

## TensorFlow Equivalent

tf.random.uniform, tf.random.normal, tf.random.uniform with integer dtype

## Version Compatibility

No significant changes in modern PyTorch releases.

## Search Metadata

- Aliases: rand, randn, randint
- Common Search Terms: random tensor torch, torch.rand vs randn
- Keywords: random, initialization, rng
- Frequently Confused With: torch.randn vs torch.rand


## Related Models

transformer

## Related Patterns

tensor-creation

## Related Workflows

production-llm-cost-latency-optimization

## Related Cheatsheet

tensor-creation

## Related Decision Guides

precision-tradeoffs-guide

## Official Documentation

https://docs.pytorch.org/docs/stable/generated/torch.rand.html

***

## Task

Create Ranged Tensor Sequences (`torch.arange` / `torch.linspace`)

## Problem Solved

Produce 1-D tensors representing arithmetic sequences or evenly spaced samples for indexing or positional encodings.

## Mental Trigger

I need a numeric range or evenly spaced sequence as a tensor.

## Syntax

torch.arange(start=0, end, step=1, dtype=None, device=None)
torch.linspace(start, end, steps=100, dtype=None, device=None)

## Important Parameters

- start, end, step / steps — range specification.
- dtype — output dtype.
- device — placement device.
- inclusive/exclusive behavior — arange end is exclusive.


## Return Value

A 1-D tensor containing the requested sequence.

## Example

import torch
a = torch.arange(0, 10, 2)
l = torch.linspace(0.0, 1.0, steps=5)

## Use When

Index generation, positional encoding, or parameterized sequences.

## Avoid When

You need multi-dimensional grids (use torch.meshgrid) or non-linear spacing.

## Gotchas

- arange with floating steps may produce rounding differences; prefer linspace for stable counts.
- arange end is exclusive; linspace includes both endpoints by definition.
- dtype conversion may truncate values unexpectedly.
- Large ranges allocate significant memory.


## Performance Notes

Efficient for small-to-moderate sequences; generating massive ranges consumes memory.

## Related APIs

torch.linspace, torch.meshgrid, torch.range (deprecated)

## Framework Migration Notes

Similar to numpy.arange / numpy.linspace; watch floating-step rounding differences.

## TensorFlow Equivalent

tf.range, tf.linspace

## Version Compatibility

No significant changes in modern PyTorch releases.

## Search Metadata

- Aliases: arange, linspace
- Common Search Terms: torch.arange vs linspace, create range tensor
- Keywords: sequence, index, positions
- Frequently Confused With: torch.range (deprecated)


## Related Models

transformer

## Related Patterns

tensor-broadcasting

## Related Workflows

image-classification-pipeline

## Related Cheatsheet

tensor-creation

## Related Decision Guides

hardware-selection-guide

## Official Documentation

https://docs.pytorch.org/docs/stable/generated/torch.arange.html

***

## Task

Inspect Tensor Properties (`shape`, `dtype`, `device`, `layout`, `ndim`, `numel`, `stride`, `is_contiguous`)

## Problem Solved

Quickly obtain a tensor's structural and storage metadata for validation and control flow.

## Mental Trigger

I need to verify a tensor's shape, dtype, device, memory layout, and contiguity.

## Syntax

tensor.shape, tensor.dtype, tensor.device, tensor.layout, tensor.ndim, tensor.numel(), tensor.stride(), tensor.is_contiguous()

## Important Parameters

- (accessors; no parameters)
- Use tensor.attribute for metadata reads.


## Return Value

Scalar or tuple metadata values describing tensor shape, type, device, memory format, dimensionality, element count, stride tuple, and contiguity boolean.

## Example

import torch
t = torch.randn(2,3)
print(t.shape, t.dtype, t.device, t.is_contiguous())

## Use When

Validating inputs, selecting code paths based on layout/device, or debugging performance issues.

## Avoid When

You require deep inspection of storage internals beyond public attributes.

## Gotchas

- is_contiguous() depends on memory format and view operations; non-contiguity affects view compatibility.
- stride() order indicates how memory is laid out; misinterpreting strides can cause incorrect reshapes.
- layout can be sparse or strided; many ops only support strided tensors.
- device strings may differ across backends (e.g., 'cuda:0', 'mps').


## Performance Notes

Attribute reads are cheap; however, operations conditioned on these attributes may change execution (e.g., copying to contiguous layout).

## Related APIs

tensor.numel, tensor.element_size, torch.is_tensor

## Framework Migration Notes

NumPy users: shape/ndim/stride concepts align with ndarray; device and layout are PyTorch-specific.

## TensorFlow Equivalent

tf.Tensor.shape, tf.dtypes, tf.device (contextual)

## Version Compatibility

No significant changes in modern PyTorch releases.

## Search Metadata

- Aliases: tensor-metadata
- Common Search Terms: tensor shape dtype device contiguous stride
- Keywords: metadata, layout, inspection
- Frequently Confused With: tensor.size() vs tensor.shape


## Related Models

resnet

## Related Patterns

device-placement

## Related Workflows

image-classification-pipeline

## Related Cheatsheet

tensor-manipulation

## Related Decision Guides

hardware-selection-guide

## Official Documentation

https://docs.pytorch.org/docs/stable/tensor_attributes.html

***

## Task

Reshape Contiguous Tensor View (`torch.view` / `view_as`)

## Problem Solved

Create a new view with a different shape that shares the same memory when the tensor is contiguous.

## Mental Trigger

I need a no-copy reshape of a contiguous tensor for indexing or batch adjustments.

## Syntax

tensor.view(*shape)
torch.view_as(tensor, other)

## Important Parameters

- shape — desired output shape (must be compatible with numel).
- (no device/dtype params for view)
- Use -1 for automatic dimension inference.


## Return Value

A view referencing the same storage as the original tensor when memory layout allows; raises if view cannot be satisfied.

## Example

import torch
t = torch.randn(2,3)
v = t.view(3,2)

## Use When

Reshaping contiguous tensors without allocation for performance and memory efficiency.

## Avoid When

Tensor is non-contiguous due to transposes or slicing (use reshape or contiguous() first).

## Gotchas

- view requires the tensor to be contiguous; otherwise it raises an error.
- Using view on a tensor that was created as a view may still be valid only if strides match.
- In-place modifications affect both view and base tensor.
- Using incorrect shape that mismatches element count raises an error.


## Performance Notes

No allocation when successful — excellent for zero-copy reshaping.

## Related APIs

torch.reshape, tensor.contiguous, tensor.view_as

## Framework Migration Notes

NumPy users: analogous to ndarray.view/reshape but contiguity rules differ.

## TensorFlow Equivalent

tf.reshape (TensorFlow typically returns a new tensor but may avoid copy)

## Version Compatibility

No significant changes in modern PyTorch releases.

## Search Metadata

- Aliases: view, view_as
- Common Search Terms: tensor view reshape torch.view contiguous
- Keywords: view, reshape, contiguous
- Frequently Confused With: torch.reshape


## Related Models

resnet

## Related Patterns

memory-efficient-training

## Related Workflows

image-classification-pipeline

## Related Cheatsheet

tensor-manipulation

## Related Decision Guides

precision-tradeoffs-guide

## Official Documentation

https://docs.pytorch.org/docs/stable/generated/torch.Tensor.view.html

***

## Task

Reshape Tensor with Copy/View Fallback (`torch.reshape` / `reshape_as`)

## Problem Solved

Obtain a tensor with the requested shape, returning a view when possible or a copy otherwise.

## Mental Trigger

I need a reshaped tensor regardless of contiguity details.

## Syntax

torch.reshape(input, shape)
torch.reshape_as(input, other)

## Important Parameters

- input — source tensor.
- shape — desired shape (use -1 to infer).
- device/dtype not accepted here.


## Return Value

A tensor with the requested shape; may be a view (no copy) or a new allocation when view is not possible.

## Example

import torch
t = torch.randn(2,3).t()
r = torch.reshape(t, (3,2))

## Use When

You want a convenient reshape that works across contiguous and non-contiguous tensors.

## Avoid When

You require guaranteed no-copy behavior; use view on known-contiguous tensors.

## Gotchas

- May allocate new memory silently; performance implications if unexpected.
- In-place expectations may break if a copy was created.
- Strides of the returned tensor may differ from source when a copy occurs.
- reshape_as uses other's shape and may trigger copy similarly.


## Performance Notes

Prefer reshape over view when contiguity is uncertain; monitor for unexpected allocations on performance-critical paths.

## Related APIs

torch.view, tensor.contiguous, torch.clone

## Framework Migration Notes

Similar to numpy.reshape; copy semantics are context-dependent.

## TensorFlow Equivalent

tf.reshape

## Version Compatibility

No significant changes in modern PyTorch releases.

## Search Metadata

- Aliases: reshape, reshape_as
- Common Search Terms: torch.reshape copy vs view
- Keywords: reshape, view-fallback
- Frequently Confused With: torch.view


## Related Models

vit

## Related Patterns

tensor-broadcasting

## Related Workflows

image-classification-pipeline

## Related Cheatsheet

tensor-manipulation

## Related Decision Guides

hardware-selection-guide

## Official Documentation

https://docs.pytorch.org/docs/stable/generated/torch.reshape.html

***

## Task

Flatten Tensor Dimensions (`torch.flatten`)

## Problem Solved

Collapse a range of dimensions into a single dimension for vectorization or linear layers.

## Mental Trigger

I need to collapse batch or spatial dimensions into a single feature dimension.

## Syntax

torch.flatten(input, start_dim=0, end_dim=-1)

## Important Parameters

- input — source tensor.
- start_dim — first dimension to flatten.
- end_dim — last dimension to flatten.


## Return Value

A view when possible that presents a flattened shape; may allocate if underlying memory prevents a view.

## Example

import torch
t = torch.randn(2,3,4)
f = torch.flatten(t, start_dim=1)

## Use When

Preparing tensors for linear layers or feature vector extraction.

## Avoid When

You need to preserve original dimensionality; use view/reshape to revert with known shapes.

## Gotchas

- May return a copy if memory layout prevents view.
- start_dim/end_dim handling must match tensor rank (negative indexes allowed).
- In-place operations on flattened view affect underlying tensor.


## Performance Notes

Likely zero-copy for standard layouts; check is_contiguous or test for allocation in tight loops.

## Related APIs

torch.reshape, tensor.view, tensor.flatten

## Framework Migration Notes

Matches numpy.ravel/reshape patterns; TensorFlow uses tf.reshape for flattening.

## TensorFlow Equivalent

tf.reshape(x, [x.shape, -1]) or tf.keras.layers.Flatten

## Version Compatibility

No significant changes in modern PyTorch releases.

## Search Metadata

- Aliases: flatten
- Common Search Terms: flatten tensor torch
- Keywords: flatten, vectorize
- Frequently Confused With: torch.reshape, torch.view


## Related Models

resnet

## Related Patterns

feature-fusion

## Related Workflows

image-classification-pipeline

## Related Cheatsheet

tensor-manipulation

## Related Decision Guides

precision-tradeoffs-guide

## Official Documentation

https://docs.pytorch.org/docs/stable/generated/torch.flatten.html

***

## Task

Squeeze and Unsqueeze Dimensions (`torch.squeeze` / `torch.unsqueeze`)

## Problem Solved

Remove or add singleton dimensions for broadcasting or layout compatibility.

## Mental Trigger

I need to remove size-1 axes or insert new axes to match expected shapes.

## Syntax

torch.squeeze(input, dim=None)
torch.unsqueeze(input, dim)

## Important Parameters

- input — source tensor.
- dim — specific axis to squeeze/unsqueeze; omit dim to remove all size-1 axes.


## Return Value

A tensor view that shares memory with the source when operation is possible.

## Example

import torch
t = torch.randn(3,1,4)
s = torch.squeeze(t, 1)
u = torch.unsqueeze(s, 1)

## Use When

Preparing tensors for broadcasting, ensuring batch dimensions, or aligning shapes.

## Avoid When

Attempting to squeeze non-singleton dimensions (raises error if specific dim mismatched).

## Gotchas

- squeeze without dim removes all size-1 axes and may change intended semantics.
- Unsqueeze indices follow Python indexing rules; negative dims allowed.
- Both are usually views; in-place expectations affect original tensor.
- Using squeeze on tensors where dim !=1 raises error.


## Performance Notes

No allocation for typical cases; cheap shape-change operations.

## Related APIs

torch.reshape, torch.view, torch.permute

## Framework Migration Notes

NumPy users: equivalent to np.squeeze and np.expand_dims.

## TensorFlow Equivalent

tf.squeeze, tf.expand_dims

## Version Compatibility

No significant changes in modern PyTorch releases.

## Search Metadata

- Aliases: squeeze, unsqueeze
- Common Search Terms: remove singleton dimension torch, add axis torch
- Keywords: reshape, axes, singleton
- Frequently Confused With: torch.reshape


## Related Models

yolo

## Related Patterns

tensor-broadcasting

## Related Workflows

object-detection-pipeline

## Related Cheatsheet

tensor-manipulation

## Related Decision Guides

hardware-selection-guide

## Official Documentation

https://docs.pytorch.org/docs/stable/generated/torch.squeeze.html

***

## Task

Permute and Transpose Dimensions (`torch.permute` / `torch.transpose`)

## Problem Solved

Reorder tensor dimensions to match expected memory layout or operator requirements.

## Mental Trigger

I need to swap or reorder axes for convolution, linearization, or layout conversion.

## Syntax

torch.transpose(input, dim0, dim1)
torch.permute(input, dims)

## Important Parameters

- dim0, dim1 / dims — axis indices to swap or the full permutation tuple.
- input — source tensor.


## Return Value

A view with reinterpreted strides; does not copy when possible but may produce non-contiguous tensors.

## Example

import torch
t = torch.randn(2,3,4)
p = torch.permute(t, (0,2,1))
s = torch.transpose(t, 1, 2)

## Use When

Converting between channel-first/channel-last layouts or swapping batch/spatial dims.

## Avoid When

Expecting contiguous memory subsequently; call contiguous() if a contiguous buffer is required.

## Gotchas

- Permuted tensors are often non-contiguous; many ops require contiguity.
- Subsequent view() calls will fail unless tensor is contiguous.
- In-place operations can be invalid or change underlying storage unexpectedly.
- Repeated permutations can increase code complexity and mistake risk.


## Performance Notes

No immediate allocation, but non-contiguity may force copies in downstream kernels.

## Related APIs

tensor.contiguous, torch.reshape, torch.permute

## Framework Migration Notes

Equivalent to numpy.transpose/permutation; watch for performance implications related to memory layout.

## TensorFlow Equivalent

tf.transpose

## Version Compatibility

No significant changes in modern PyTorch releases.

## Search Metadata

- Aliases: permute, transpose
- Common Search Terms: change axis order torch
- Keywords: layout, transpose, permute
- Frequently Confused With: torch.reshape, torch.view


## Related Models

yolo

## Related Patterns

device-placement

## Related Workflows

object-detection-pipeline

## Related Cheatsheet

tensor-manipulation

## Related Decision Guides

hardware-selection-guide

## Official Documentation

https://docs.pytorch.org/docs/stable/generated/torch.permute.html

***

## Task

Enforce Memory Contiguity (`torch.contiguous`)

## Problem Solved

Produce a contiguous copy of a tensor when kernels require contiguous storage.

## Mental Trigger

I need a contiguous tensor before calling an API that requires contiguous input.

## Syntax

tensor.contiguous(memory_format=torch.contiguous_format)

## Important Parameters

- memory_format — memory layout hint.
- (no device/dtype params)


## Return Value

A tensor that is contiguous in memory; may return the same object if already contiguous, otherwise allocates a copy.

## Example

import torch
t = torch.randn(2,3).t()
tc = t.contiguous()

## Use When

Preparing inputs for C/C++ extensions or kernels expecting contiguous buffers.

## Avoid When

You do not need a contiguous buffer — avoid unnecessary copies.

## Gotchas

- May allocate a new buffer and copy data, causing performance overhead.
- memory_format influences layout and can affect downstream views/strides.
- Calling contiguous repeatedly on already-contiguous tensors is a no-op but adds call overhead.
- In-place expectations may be invalid if a copy was made.


## Performance Notes

Copy cost can be significant for large tensors; minimize by designing layout to avoid forced contiguity.

## Related APIs

torch.permute, tensor.clone, torch.reshape

## Framework Migration Notes

NumPy ndarrays are typically contiguous; PyTorch permute/transpose can produce non-contiguous views requiring contiguous().

## TensorFlow Equivalent

TensorFlow tensors abstract away contiguity; explicit copy operations (tf.identity + reorder) may be required.

## Version Compatibility

No significant changes in modern PyTorch releases.

## Search Metadata

- Aliases: contiguous
- Common Search Terms: make tensor contiguous torch
- Keywords: contiguity, copy, layout
- Frequently Confused With: torch.clone, torch.detach


## Related Models

resnet

## Related Patterns

memory-efficient-training

## Related Workflows

image-classification-pipeline

## Related Cheatsheet

tensor-manipulation

## Related Decision Guides

hardware-selection-guide

## Official Documentation

https://docs.pytorch.org/docs/stable/generated/torch.Tensor.contiguous.html

***

## Task

Clone Tensor Memory and Storage (`torch.clone`)

## Problem Solved

Create an explicit copy of a tensor's data and metadata to avoid shared-storage side effects.

## Mental Trigger

I need an independent copy of tensor contents to mutate without affecting the original.

## Syntax

tensor.clone(memory_format=torch.preserve_format)

## Important Parameters

- memory_format — layout of the cloned tensor.
- (no device/dtype parameters)


## Return Value

A new tensor with copied storage and identical contents to the source.

## Example

import torch
t = torch.randn(2,3)
c = t.clone()

## Use When

Safely copying tensors prior to in-place operations or cross-scope mutations.

## Avoid When

You want zero-copy views (use view/reshape) or when shallow copy semantics suffice.

## Gotchas

- clone always allocates new storage, which increases memory usage.
- Clone of a non-contiguous tensor may produce a contiguous copy depending on memory_format.
- clone preserves requires_grad on the returned tensor by default (autograd semantics apply).
- Large clones can cause peak memory pressure.


## Performance Notes

Costly for large tensors; prefer view-based approaches when safe and valid.

## Related APIs

tensor.detach, torch.tensor (copy on creation), torch.empty + copy_

## Framework Migration Notes

NumPy copy() creates new array similar to clone behavior.

## TensorFlow Equivalent

tf.identity or tf.clone equivalent patterns (copying tensors explicitly)

## Version Compatibility

No significant changes in modern PyTorch releases.

## Search Metadata

- Aliases: clone
- Common Search Terms: copy tensor torch clone
- Keywords: copy, storage, independent
- Frequently Confused With: torch.tensor (copy on construction), tensor.detach


## Related Models

gpt

## Related Patterns

memory-efficient-training

## Related Workflows

production-llm-cost-latency-optimization

## Related Cheatsheet

tensor-manipulation

## Related Decision Guides

precision-tradeoffs-guide

## Official Documentation

https://docs.pytorch.org/docs/stable/generated/torch.Tensor.clone.html

***

## Task

Concatenate Tensors along Existing Dimension (`torch.cat`)

## Problem Solved

Join multiple tensors along an existing axis to form a single tensor for batched processing.

## Mental Trigger

I need to merge a list of tensors along a shared dimension into one tensor.

## Syntax

torch.cat(tensors, dim=0, *, out=None)

## Important Parameters

- tensors — iterable of tensors with matching shapes except at dim.
- dim — axis along which to concatenate.
- out — optional output tensor for storage.


## Return Value

A new tensor representing the concatenation result; may allocate new storage.

## Example

import torch
a = torch.ones(2,3)
b = torch.zeros(1,3)
c = torch.cat([a,b], dim=0)

## Use When

Collating minibatches, merging features, and combining outputs from parallel branches.

## Avoid When

You can use stacking for adding a new dimension, or preallocate and write into buffers to avoid repeated concatenations.

## Gotchas

- All tensors must be on the same device and have compatible dtypes.
- Concatenation allocates new memory proportional to the combined size.
- Frequent repeated concatenation in loops is expensive; prefer list accumulation + single cat.
- Non-contiguous inputs may cause extra copies during cat.


## Performance Notes

Batch concatenation in a single call is efficient; avoid incremental concatenation inside hot loops.

## Related APIs

torch.stack, torch.hstack, torch.vstack, torch.split

## Framework Migration Notes

NumPy users: similar to numpy.concatenate.

## TensorFlow Equivalent

tf.concat

## Version Compatibility

No significant changes in modern PyTorch releases.

## Search Metadata

- Aliases: cat, concatenate
- Common Search Terms: torch.cat batch, concatenate tensors
- Keywords: concat, merge, join
- Frequently Confused With: torch.stack


## Related Models

resnet

## Related Patterns

feature-fusion

## Related Workflows

image-classification-pipeline

## Related Cheatsheet

tensor-manipulation

## Related Decision Guides

hardware-selection-guide

## Official Documentation

https://docs.pytorch.org/docs/stable/generated/torch.cat.html

***

## Task

Stack Tensors along New Dimension (`torch.stack`)

## Problem Solved

Combine tensors by adding a new dimension and stacking entries along it to form a higher-rank tensor.

## Mental Trigger

I need to assemble a list of tensors into a single tensor where each input becomes a slice along a new axis.

## Syntax

torch.stack(tensors, dim=0, *, out=None)

## Important Parameters

- tensors — sequence of tensors with identical shapes.
- dim — index at which to insert the new axis.
- out — optional output tensor.


## Return Value

A newly allocated tensor where input tensors are stacked along a new dimension.

## Example

import torch
a = torch.tensor()[^2][^1]
b = torch.tensor()[^3][^4]
s = torch.stack([a,b], dim=0)  \# shape (2,2)

## Use When

Creating batched tensors from separate elements or assembling per-sample outputs.

## Avoid When

You want to concatenate along an existing axis (use torch.cat).

## Gotchas

- All inputs must have identical shapes and dtypes.
- Stack always allocates new memory.
- Inputs must be on the same device.
- Frequent stacking can be less efficient than preallocating a buffer.


## Performance Notes

Single stack call is efficient for moderate lists; for large collections, preallocate and assign for best performance.

## Related APIs

torch.cat, torch.unsqueeze, torch.stack

## Framework Migration Notes

NumPy equivalent is numpy.stack.

## TensorFlow Equivalent

tf.stack

## Version Compatibility

No significant changes in modern PyTorch releases.

## Search Metadata

- Aliases: stack
- Common Search Terms: torch.stack vs cat, stack tensors
- Keywords: stack, new-dim, batch
- Frequently Confused With: torch.cat


## Related Models

vit

## Related Patterns

tensor-broadcasting

## Related Workflows

image-classification-pipeline

## Related Cheatsheet

tensor-manipulation

## Related Decision Guides

hardware-selection-guide

## Official Documentation

https://docs.pytorch.org/docs/stable/generated/torch.stack.html

***

## Task

Split Tensor into Chunks or Sections (`torch.split` / `torch.chunk`)

## Problem Solved

Partition a tensor into smaller tensors by sizes or evenly into N chunks for parallel processing or batching.

## Mental Trigger

I need to divide a tensor into parts either by explicit sizes or equal chunks.

## Syntax

torch.split(tensor, split_size_or_sections, dim=0)
torch.chunk(tensor, chunks, dim=0)

## Important Parameters

- split_size_or_sections / chunks — sizes or number of parts.
- dim — axis to split along.


## Return Value

A tuple of tensors representing each partition; may be views when possible.

## Example

import torch
t = torch.arange(8)
parts = torch.split(t, )[^5][^3]

## Use When

Sharding workloads, mini-batching, or dividing data for parallel pipelines.

## Avoid When

You require complex non-contiguous slicing patterns; consider index_select or advanced indexing.

## Gotchas

- split with uneven sections behaves as specified; chunk with non-divisible sizes yields smaller last chunk.
- May return views which share storage — mutating outputs may affect the original.
- All resulting tensors must be used carefully with device and dtype considerations.
- Large number of small splits can cause overhead.


## Performance Notes

View-based splits are cheap; copying splits is costlier if layout requires it.

## Related APIs

torch.narrow, torch.index_select, torch.chunk

## Framework Migration Notes

Similar to numpy.split and numpy.array_split.

## TensorFlow Equivalent

tf.split

## Version Compatibility

No significant changes in modern PyTorch releases.

## Search Metadata

- Aliases: split, chunk
- Common Search Terms: split tensor torch, chunk tensor
- Keywords: partition, shard, split
- Frequently Confused With: torch.narrow


## Related Models

resnet

## Related Patterns

feature-fusion

## Related Workflows

image-classification-pipeline

## Related Cheatsheet

tensor-manipulation

## Related Decision Guides

hardware-selection-guide

## Official Documentation

https://docs.pytorch.org/docs/stable/generated/torch.split.html

***

## Task

Select and Gather Tensors (`torch.index_select` / `torch.gather` / `torch.scatter` / `torch.take_along_dim`)

## Problem Solved

Perform indexed selection, gather elements along an axis, scatter values by index, or take elements along a dimension for advanced indexing and rearrangement.

## Mental Trigger

I need fine-grained selection or scatter semantics using index tensors.

## Syntax

torch.index_select(input, dim, index)
torch.gather(input, dim, index)
torch.scatter(input, dim, index, src)
torch.take_along_dim(input, indices, dim)

## Important Parameters

- input — source tensor.
- dim — axis for operation.
- index / indices — integer tensors specifying positions.
- src — source values for scatter.


## Return Value

New tensors representing selected/gathered results or mutated tensor for scatter (scatter may be in-place when using underscore variants).

## Example

import torch
t = torch.tensor([,])[^4][^1][^2][^3]
idx = torch.tensor()[^1]
g = torch.gather(t, 1, idx.unsqueeze(0))

## Use When

Implementing advanced indexing, batched gather operations, or scatter-accumulate patterns.

## Avoid When

Simple slicing or boolean indexing suffices; these APIs are for index-driven operations.

## Gotchas

- Shapes of index and input must align per API contract — mismatches raise errors.
- gather/scatter semantics differ subtly; gather reads from input, scatter writes into output.
- scatter may be in-place and can overwrite data unexpectedly.
- take_along_dim introduced for clearer semantics in some versions — check compatibility.


## Performance Notes

Index-heavy operations can be memory- and compute-intensive; try to batch indices and minimize Python-level loops.

## Related APIs

torch.index_put_, torch.masked_select, advanced indexing

## Framework Migration Notes

NumPy: numpy.take_along_axis and advanced indexing map closely; TensorFlow has tf.gather, tf.scatter_nd analogs.

## TensorFlow Equivalent

tf.gather, tf.gather_nd, tf.scatter_nd

## Version Compatibility

No significant changes in modern PyTorch releases.

## Search Metadata

- Aliases: gather, scatter, index_select, take_along_dim
- Common Search Terms: gather torch, scatter torch, index_select usage
- Keywords: gather, scatter, index, advanced-indexing
- Frequently Confused With: boolean indexing, mask select


## Related Models

transformer

## Related Patterns

feature-fusion

## Related Workflows

image-classification-pipeline

## Related Cheatsheet

tensor-manipulation

## Related Decision Guides

precision-tradeoffs-guide

## Official Documentation

https://docs.pytorch.org/docs/stable/generated/torch.gather.html

***

## Task

Element-wise Arithmetic and In-place Operations (`add`, `sub`, `mul`, `div`, `add_`)

## Problem Solved

Perform elementwise arithmetic with options for functional or in-place updates for memory efficiency.

## Mental Trigger

I need to compute arithmetic between tensors or update tensors in-place to reduce allocations.

## Syntax

torch.add(input, other, *, out=None) / torch.Tensor.add
torch.add_(tensor, other)  \# in-place variant
(similar for sub, mul, div and their in-place counterparts)

## Important Parameters

- input/other — operands (tensor or scalar).
- out — optional preallocated output.
- alpha / broadcasting rules — scale factor for some ops.
- dtype promotion behavior — implicit casting rules.


## Return Value

A tensor containing elementwise results; in-place variants modify the left-hand operand.

## Example

import torch
a = torch.ones(3)
b = torch.tensor()[^2][^3][^1]
c = a + b
a.add_(b)

## Use When

Basic arithmetic, incremental updates to buffers, and avoiding intermediate allocations.

## Avoid When

Autograd history must be preserved in specific ways — in-place ops can complicate gradient computation.

## Gotchas

- In-place ops can break autograd when they modify values needed for gradient computation.
- Broadcasting rules may cause implicit expansion leading to larger allocations.
- Dtype promotion can silently change dtype (e.g., int + float → float).
- Using out= with overlapping memory may produce undefined behavior.


## Performance Notes

In-place operations reduce allocations but must be used cautiously with autograd and view-sharing semantics.

## Related APIs

torch.add, torch.sub, torch.mul, torch.div, tensor.add_, tensor.mul_

## Framework Migration Notes

NumPy users: in-place operators (+=) behave similarly but watch broadcasting and dtype rules.

## TensorFlow Equivalent

tf.add, tf.math.add, in-place semantics are not typical in TensorFlow; use variables with assign_add for mutation.

## Version Compatibility

No significant changes in modern PyTorch releases.

## Search Metadata

- Aliases: add_, sub_, mul_, div_
- Common Search Terms: in-place tensor add, torch.add_ vs torch.add
- Keywords: arithmetic, in-place, broadcasting
- Frequently Confused With: torch.add (functional) vs tensor.add_ (in-place)


## Related Models

gpt

## Related Patterns

memory-efficient-training

## Related Workflows

production-llm-cost-latency-optimization

## Related Cheatsheet

tensor-math

## Related Decision Guides

precision-tradeoffs-guide

## Official Documentation

https://docs.pytorch.org/docs/stable/generated/torch.add.html

***

## Task

Matrix Multiplication Operations (`torch.matmul` / `torch.mm` / `torch.bmm`)

## Problem Solved

Perform matrix and batch-matrix multiplications with appropriate dispatch for 2D and batched tensors.

## Mental Trigger

I need efficient dense matrix or batched matrix multiplication on tensors.

## Syntax

torch.matmul(input, other)
torch.mm(mat1, mat2)  \# 2-D only
torch.bmm(batch1, batch2)  \# 3-D batched matmul

## Important Parameters

- input/mat1/batch1 — left operand.
- other/mat2/batch2 — right operand.
- out — optional preallocated output in some variants.
- dtype/device — implicit from inputs.


## Return Value

A tensor with product results; implementations dispatch to optimized BLAS/CUDA kernels.

## Example

import torch
a = torch.randn(3,4)
b = torch.randn(4,5)
c = torch.matmul(a,b)

## Use When

Linear algebra, dense layers, and batched linear operations.

## Avoid When

Sparse-dense matmul needed; use specialized sparse APIs.

## Gotchas

- Dimension mismatch errors are common if ranks/shapes are incorrect.
- matmul semantics differ across 1-D/2-D/ND inputs (e.g., vector-matrix behavior).
- Data layout and dtype (float16 vs float32) affect kernel availability and performance.
- Large batched matmul may require memory planning to avoid OOM.


## Performance Notes

Dispatches to highly-optimized BLAS/CUDA kernels; ensure correct dtype/device to utilize GPU backends.

## Related APIs

torch.einsum, torch.mm, torch.bmm, torch.linalg

## Framework Migration Notes

NumPy: numpy.matmul and numpy.dot map closely; TensorFlow: tf.matmul.

## TensorFlow Equivalent

tf.matmul, tf.linalg.matmul

## Version Compatibility

No significant changes in modern PyTorch releases.

## Search Metadata

- Aliases: matmul, mm, bmm
- Common Search Terms: matrix multiply torch, batched matmul torch
- Keywords: matmul, batch-matmul, linear-algebra
- Frequently Confused With: torch.einsum


## Related Models

transformer

## Related Patterns

feature-fusion

## Related Workflows

production-llm-cost-latency-optimization

## Related Cheatsheet

tensor-math

## Related Decision Guides

hardware-selection-guide

## Official Documentation

https://docs.pytorch.org/docs/stable/generated/torch.matmul.html

***

## Task

Tensor Reduction Operations (`torch.sum` / `torch.mean` / `torch.max` / `torch.min` / `torch.argmax`)

## Problem Solved

Compute reductions across specified axes to produce aggregated statistics or indices.

## Mental Trigger

I need sums, means, extrema, or argmax across dimensions for metrics or pooling.

## Syntax

torch.sum(input, dim=None, keepdim=False)
torch.mean(input, dim=None, keepdim=False)
torch.max(input, dim=None, keepdim=False)
torch.min(input, dim=None, keepdim=False)
torch.argmax(input, dim=None, keepdim=False)

## Important Parameters

- input — tensor to reduce.
- dim — axis or axes for reduction.
- keepdim — whether to retain reduced dims.
- dtype — optional accumulation dtype.


## Return Value

Scalar or tensor reduced along requested dimensions; dtype may be promoted during accumulation.

## Example

import torch
t = torch.randn(3,4)
s = torch.sum(t, dim=1)

## Use When

Metric computation, pooling, and statistical summaries.

## Avoid When

You need elementwise outputs; reductions change tensor rank.

## Gotchas

- Accumulation dtype can overflow for narrow integer types; specify dtype for safety.
- max/min return values and indices variants have different signatures.
- Reductions on non-contiguous tensors work but may incur copies.
- argmax returns indices with dtype torch.long.


## Performance Notes

Reductions are implemented efficiently but can be memory-bound on large tensors; prefer in-place reductions over materializing intermediate large tensors.

## Related APIs

torch.mean, torch.sum, torch.amax, torch.amin, torch.argmax

## Framework Migration Notes

Matches NumPy reduce semantics; TensorFlow equivalents exist via tf.reduce_* functions.

## TensorFlow Equivalent

tf.reduce_sum, tf.reduce_mean, tf.argmax

## Version Compatibility

No significant changes in modern PyTorch releases.

## Search Metadata

- Aliases: reduce-ops
- Common Search Terms: torch.sum dim, torch.argmax usage
- Keywords: reduction, pooling, metrics
- Frequently Confused With: torch.max (value vs index variants)


## Related Models

resnet

## Related Patterns

feature-fusion

## Related Workflows

image-classification-pipeline

## Related Cheatsheet

tensor-math

## Related Decision Guides

precision-tradeoffs-guide

## Official Documentation

https://docs.pytorch.org/docs/stable/generated/torch.sum.html

***

## Task

Conditional Selection and Coordinate Grids (`torch.where` / `torch.meshgrid`)

## Problem Solved

Select elements conditionally or construct coordinate grids for indexing and positional encodings.

## Mental Trigger

I need to pick values by condition or build coordinate matrices for spatial operations.

## Syntax

torch.where(condition, x, y)
torch.meshgrid(*tensors, indexing='xy')

## Important Parameters

- condition — boolean tensor.
- x, y — tensors or scalars for selection.
- tensors — 1-D tensors for meshgrid.
- indexing — 'xy' or 'ij' to control axis ordering.


## Return Value

torch.where returns a tensor selected elementwise from x or y; meshgrid returns N-D coordinate tensors.

## Example

import torch
cond = torch.tensor([True, False])
out = torch.where(cond, torch.tensor(), torch.tensor())[^1]
x = torch.linspace(0,1,3)
X,Y = torch.meshgrid(x, x, indexing='xy')

## Use When

Masking, conditional computation, or building coordinate frames for image ops.

## Avoid When

You only need boolean indexing (use masked_select) or simple broadcasting arithmetic.

## Gotchas

- where requires shapes compatible for broadcasting.
- meshgrid indexing parameter changes axis order; mismatches cause subtle bugs.
- where with mixed dtypes may upcast results.
- Large meshgrids allocate O(N^2) memory for 2D cases.


## Performance Notes

where is efficient for elementwise selection; meshgrid can be memory-intensive for high-resolution grids.

## Related APIs

torch.masked_select, torch.nonzero, torch.arange

## Framework Migration Notes

NumPy equivalents: numpy.where, numpy.meshgrid; TensorFlow has tf.where and tf.meshgrid.

## TensorFlow Equivalent

tf.where, tf.meshgrid

## Version Compatibility

No significant changes in modern PyTorch releases.

## Search Metadata

- Aliases: where, meshgrid
- Common Search Terms: torch.where usage, torch.meshgrid indexing
- Keywords: conditional, mask, coordinates
- Frequently Confused With: masked_select, nonzero


## Related Models

yolo

## Related Patterns

tensor-broadcasting

## Related Workflows

object-detection-pipeline

## Related Cheatsheet

tensor-math

## Related Decision Guides

precision-tradeoffs-guide

## Official Documentation

https://docs.pytorch.org/docs/stable/generated/torch.where.html

***

## Task

Expand Tensor Dimensions without Copying (`torch.expand` / `expand_as`)

## Problem Solved

Create a view that broadcasts an existing tensor across larger dimensions without allocating new storage.

## Mental Trigger

I need to broadcast a smaller tensor to a larger shape without copying data.

## Syntax

tensor.expand(*sizes)
tensor.expand_as(other)

## Important Parameters

- sizes — desired expanded shape (must be compatible via broadcasting).
- other — tensor to match shape.


## Return Value

A view that behaves as if expanded to target shape; does not allocate storage but may restrict writable semantics.

## Example

import torch
t = torch.tensor()[^3][^2][^1]
e = t.expand(3,3)

## Use When

Broadcasting constants or parameters across batch dimensions cheaply.

## Avoid When

You need a real allocated tensor (use repeat) or need to write to the expanded tensor.

## Gotchas

- Expanded tensors are **views** with stride 0 in expanded dims; in-place writes are not allowed.
- expand cannot add new memory-backed dimensions that require distinct storage.
- Using expand on non-broadcast-compatible shapes raises errors.
- Some ops do not accept expanded tensors as writable outputs.


## Performance Notes

No allocation; very cheap and ideal for read-only broadcasted operations.

## Related APIs

torch.repeat, torch.broadcast_to (alias), broadcasting semantics

## Framework Migration Notes

NumPy's broadcasting uses views implicitly; expand provides an explicit view API in PyTorch.

## TensorFlow Equivalent

tf.broadcast_to

## Version Compatibility

No significant changes in modern PyTorch releases.

## Search Metadata

- Aliases: expand, expand_as
- Common Search Terms: torch.expand vs repeat, broadcast without copy
- Keywords: expand, broadcast, view
- Frequently Confused With: torch.repeat


## Related Models

resnet

## Related Patterns

tensor-broadcasting

## Related Workflows

image-classification-pipeline

## Related Cheatsheet

device-management

## Related Decision Guides

precision-tradeoffs-guide

## Official Documentation

https://docs.pytorch.org/docs/stable/generated/torch.Tensor.expand.html

***

## Task

Repeat Tensor Elements with Allocation (`torch.repeat`)

## Problem Solved

Create a new tensor by repeating elements along specified dimensions, allocating new storage.

## Mental Trigger

I need a fully materialized repeated tensor for indexing or writable buffers.

## Syntax

tensor.repeat(*sizes)

## Important Parameters

- sizes — repeat multipliers for each dimension.


## Return Value

A newly allocated tensor with repeated copies of the original data.

## Example

import torch
t = torch.tensor()[^2][^1]
r = t.repeat(2,1)  \# shape (2,2)

## Use When

You require explicit allocation of repeated patterns or writable repeated data.

## Avoid When

You only need read-only broadcast behavior (use expand).

## Gotchas

- repeat allocates memory proportional to the repeated size — can be large.
- Repeated data is independent copies; modifying result does not affect source.
- Using repeat with large multipliers may cause OOM.
- repeat requires matching ranks or prepending singleton dims as needed.


## Performance Notes

Memory and allocation heavy compared to expand; avoid when expand suffices.

## Related APIs

torch.expand, torch.tile (alias), broadcasting

## Framework Migration Notes

NumPy: numpy.repeat and numpy.tile provide related functionality.

## TensorFlow Equivalent

tf.repeat, tf.tile

## Version Compatibility

No significant changes in modern PyTorch releases.

## Search Metadata

- Aliases: repeat, tile
- Common Search Terms: torch.repeat vs expand, repeat tensor
- Keywords: repeat, allocate, tile
- Frequently Confused With: torch.expand


## Related Models

vit

## Related Patterns

tensor-broadcasting

## Related Workflows

image-classification-pipeline

## Related Cheatsheet

tensor-manipulation

## Related Decision Guides

hardware-selection-guide

## Official Documentation

https://docs.pytorch.org/docs/stable/generated/torch.Tensor.repeat.html

***

## Task

Device Placement and Precision Casting (`to`, `cpu`, `cuda`, `mps`, `float`, `half`, `bfloat16`, `non_blocking`)

## Problem Solved

Move tensors across devices and change numeric precision for performance or device compatibility.

## Mental Trigger

I need to place tensors on a specific device or change dtype/precision for compute.

## Syntax

tensor.to(device=None, dtype=None, non_blocking=False, copy=False)
tensor.cpu(), tensor.cuda(device=None, non_blocking=False), tensor.to(torch.float32), tensor.half(), tensor.to(torch.bfloat16)

## Important Parameters

- device — target device (cpu, cuda:X, mps).
- dtype — target dtype (torch.float32, torch.float16, torch.bfloat16, etc.).
- non_blocking — whether copy may be asynchronous for pinned memory.
- copy — force a copy even if already matching dtype/device.


## Return Value

A tensor on the requested device and dtype; may be a view when only dtype/format-preserving operations are performed but usually returns a new tensor when moving devices or changing dtype.

## Example

import torch
t = torch.randn(3,3)
g = t.cuda()
f = g.float()
h = f.to('cpu', non_blocking=True)

## Use When

Preparing tensors for device-specific computation, optimizing memory footprint with lower precision, or converting for interoperability.

## Avoid When

Automatic implicit device moves are cheaper for prototyping but expensive in production; prefer explicit placement.

## Gotchas

- to(cuda) performs a device transfer that allocates GPU memory; ensure device has capacity.
- non_blocking only helps when source is pinned host memory.
- Casting to lower precision can change numerical behavior and support of kernels.
- Using .cuda() without specifying device in multi-GPU contexts can target unexpected GPU.


## Performance Notes

Device transfers and dtype casts are expensive; minimize host-device copies and prefer appropriate dtype and placement from creation time.

## Related APIs

torch.as_tensor(..., device=), torch.set_default_device (experimental), tensor.to

## Framework Migration Notes

NumPy has no device semantics; TensorFlow uses device contexts and tf.cast for dtype conversion.

## TensorFlow Equivalent

tf.cast, with device placement via with tf.device(...)

## Version Compatibility

No significant changes in modern PyTorch releases.

## Search Metadata

- Aliases: to(device), .cuda, .cpu, astype(torch.float)
- Common Search Terms: move tensor to gpu torch, cast to half torch
- Keywords: device, dtype, cast, transfer
- Frequently Confused With: torch.cuda.is_available, torch.set_default_dtype


## Related Models

gpt

## Related Patterns

device-placement

## Related Workflows

production-llm-cost-latency-optimization

## Related Cheatsheet

device-management

## Related Decision Guides

hardware-selection-guide

## Official Documentation

https://docs.pytorch.org/docs/stable/generated/torch.Tensor.to.html
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: AENS Knowledge Layer Specification.md

[^2]: directory_structure.md

[^3]: AI_CONTEXT.md

[^4]: AENS_CANONICAL_SPECIFICATION.md

[^5]: MACHINE_LEARNING_INTEGRATION_ARCHITECTURE_AUDIT.md

[^6]: https://ieeexplore.ieee.org/document/11030010/

[^7]: https://arxiv.org/pdf/1912.01703.pdf

[^8]: https://arxiv.org/pdf/2306.08595.pdf

[^9]: https://arxiv.org/pdf/1803.07416.pdf

[^10]: http://arxiv.org/pdf/2408.02010.pdf

[^11]: https://arxiv.org/pdf/1905.01330.pdf

[^12]: https://arxiv.org/pdf/2003.04696.pdf

[^13]: https://pmc.ncbi.nlm.nih.gov/articles/PMC10055035/

[^14]: https://docs.pytorch.org/docs/stable/tensors.html

[^15]: https://docs.pytorch.org/tutorials/beginner/blitz/tensor_tutorial.html

[^16]: https://alband.github.io/doc_view/tensors.html

[^17]: https://docs.pytorch.org/docs/2.8/generated/torch.from_numpy.html

[^18]: https://docs.pytorch.org/docs/stable/generated/torch.Tensor.view.html

[^19]: https://docs.pytorch.org/docs/stable/torch.html

[^20]: https://github.com/PyTorch/pytorch/blob/main/torch/_tensor_docs.py

[^21]: https://docs.pytorch.org/docs/stable/tensor_attributes.html

[^22]: https://alband.github.io/doc_view/generated/torch.tensor.html

[^23]: https://docs.pytorch.org/tutorials/beginner/introyt/tensors_deeper_tutorial.html

