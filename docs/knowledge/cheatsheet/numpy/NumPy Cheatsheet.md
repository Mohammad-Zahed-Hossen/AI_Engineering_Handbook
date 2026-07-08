# NumPy Cheatsheet

## Metadata

- id: numpy-cheatsheet
- title: NumPy Cheatsheet
- slug: numpy-cheatsheet
- name: NumPy Cheatsheet
- description: Canonical syntax recall for daily NumPy workflows in scientific computing, data preprocessing, and AI engineering.
- package_reference: numpy
- version: 2.5.0
- sources:
    - https://numpy.org/doc/stable/reference/arrays.ndarray.html
    - https://numpy.org/doc/stable/release.html
    - https://numpy.org/doc/stable/reference/routines.array-creation.html
    - https://numpy.org/doc/stable/reference/routines.ndarray.html
    - https://numpy.org/doc/stable/reference/routines.math.html
    - https://numpy.org/doc/stable/reference/routines.linalg.html
    - https://numpy.org/doc/stable/reference/random/generator.html
    - https://numpy.org/doc/stable/reference/routines.io.html
- created_at: 2026-07-06
- updated_at: 2026-07-06


## Array Creation

| Problem | Trigger | Snippet | Minimal Notes | Common Bug | Official Documentation URL |
| :-- | :-- | :-- | :-- | :-- | :-- |
| Create an array from Python data | You already have lists, tuples, or nested sequences. | ```python |  |  |  |

import numpy as np

a = np.array([[1, 2, 3], [4, 5, 6]], dtype=np.int64)
```| Use `array` when you want NumPy to allocate a new ndarray from Python data. Specify `dtype` when you need predictable numeric behavior. | Forgetting `dtype` can produce object arrays or platform-dependent integer sizes. | [numpy.array](https://numpy.org/doc/stable/reference/generated/numpy.array.html) | | Convert input to an ndarray without forcing a copy | You need NumPy semantics but want to preserve an existing ndarray when possible. |```python
import numpy as np

x = np.arange(6)
a = np.asarray(x, dtype=np.float64)
```| `asarray` avoids copying when the input is already compatible. Use it for input normalization. | Using `array` instead of `asarray` can create unnecessary copies. | [numpy.asarray](https://numpy.org/doc/stable/reference/generated/numpy.asarray.html) | | Make an explicit copy | You need an independent array before mutation. |```python
import numpy as np

x = np.arange(5)
y = np.copy(x)
```| `copy` creates a new array buffer. Use it before in-place updates on shared data. | Mutating a view when you expected isolation can change the original data. | [numpy.copy](https://numpy.org/doc/stable/reference/generated/numpy.copy.html) | | Allocate zeros | You need a numeric buffer with default zero initialization. |```python
import numpy as np

a = np.zeros((3, 4), dtype=np.float32)
```| Good for counters, masks, and preallocated outputs. | Using `empty` when you need initialized values leaves garbage data. | [numpy.zeros](https://numpy.org/doc/stable/reference/generated/numpy.zeros.html) | | Allocate ones | You need a constant-filled array of 1s. |```python
import numpy as np

a = np.ones((2, 3), dtype=np.float32)
```| Useful for weights, baselines, and quick test data. | Forgetting `dtype` can default to floating point when you wanted integers. | [numpy.ones](https://numpy.org/doc/stable/reference/generated/numpy.ones.html) | | Allocate uninitialized memory | You will fill every element immediately after allocation. |```python
import numpy as np

a = np.empty((2, 3), dtype=np.float64)
a.fill(0.0)
```| `empty` is fast but unsafe until overwritten. | Reading before assignment produces unpredictable values. | [numpy.empty](https://numpy.org/doc/stable/reference/generated/numpy.empty.html) | | Fill with a constant | You need repeated scalar initialization. |```python
import numpy as np

a = np.full((2, 3), 7, dtype=np.int32)
```| Use this for sentinels, padding, and defaults. | Using Python loops to fill arrays is slower than `full`. | [numpy.full](https://numpy.org/doc/stable/reference/generated/numpy.full.html) | | Build an identity matrix | You need square identity or matrix-basis structure. |```python
import numpy as np

a = np.eye(4, dtype=np.float64)
```| `eye` is the standard identity constructor. | Using `identity` for non-square shapes is not appropriate. | [numpy.eye](https://numpy.org/doc/stable/reference/generated/numpy.eye.html) | | Build a square identity matrix | You want a strict \(n \times n\) identity. |```python
import numpy as np

a = np.identity(4, dtype=np.float64)
```| `identity` is a convenience wrapper for square matrices. | Passing a non-square shape is not supported. | [numpy.identity](https://numpy.org/doc/stable/reference/generated/numpy.identity.html) | | Build a diagonal array or extract diagonals | You need diagonal structure from values or from a matrix. |```python
import numpy as np

a = np.diag([1, 2, 3])
b = np.diag(a)
```| `diag` is useful for diagonal construction and extraction. | Confusing vector-to-matrix and matrix-to-vector behavior causes shape mistakes. | [numpy.diag](https://numpy.org/doc/stable/reference/generated/numpy.diag.html) | | Build a triangular mask or matrix | You need upper or lower triangular structure. |```python
import numpy as np

a = np.tri(4, 4, k=0, dtype=np.int8)
```| Use `tri` for triangular indexing masks or simple triangular matrices. | Passing the wrong `k` shifts the diagonal unexpectedly. | [numpy.tri](https://numpy.org/doc/stable/reference/generated/numpy.tri.html) | | Create evenly spaced integer steps | You need a sequence with a fixed step. |```python
import numpy as np

a = np.arange(0, 10, 2)
```| Use `arange` for step-based ranges and indexing grids. | Floating step sizes can produce surprising endpoint behavior. | [numpy.arange](https://numpy.org/doc/stable/reference/generated/numpy.arange.html) | | Create evenly spaced values with exact count | You need a fixed number of samples in an interval. |```python
import numpy as np

a = np.linspace(0.0, 1.0, num=5, endpoint=True)
```| Use `linspace` when you care about number of points, not step size. | Using `arange` for exact sampling often misses the expected endpoint. | [numpy.linspace](https://numpy.org/doc/stable/reference/generated/numpy.linspace.html) | | Create logarithmically spaced values | You need values spaced by powers of ten. |```python
import numpy as np

a = np.logspace(0, 3, num=4, base=10.0)

``` | Common for scales, thresholds, and hyperparameter sweeps. | Using linear spacing for log-scale parameters gives poor coverage. | [numpy.logspace](https://numpy.org/doc/stable/reference/generated/numpy.logspace.html) |
| Create geometrically spaced values | You need multiplicative spacing between points. | ```python
import numpy as np

a = np.geomspace(1, 1000, num=4)
``` | Use for growth rates, frequencies, and ratio-based grids. | A zero or sign mismatch can invalidate the geometric sequence. | [numpy.geomspace](https://numpy.org/doc/stable/reference/generated/numpy.geomspace.html) |
| Build values from a function of indices | You want programmatic array construction from coordinates. | ```python
import numpy as np

a = np.fromfunction(lambda i, j: i + j, (3, 4), dtype=int)
``` | `fromfunction` is concise for generated coordinate-based grids. | Forgetting `dtype` can produce floats when you expected integers. | [numpy.fromfunction](https://numpy.org/doc/stable/reference/generated/numpy.fromfunction.html) |
| Build an array from an iterator | You are streaming values and do not want to materialize a list first. | ```python
import numpy as np

a = np.fromiter((i * i for i in range(5)), dtype=np.int64, count=5)
``` | Best for one-pass data sources. | Missing `count` or using the wrong `dtype` can hurt correctness or performance. | [numpy.fromiter](https://numpy.org/doc/stable/reference/generated/numpy.fromiter.html) |
| Create coordinate grids | You need dense mesh coordinates for evaluation or simulation. | ```python
import numpy as np

x = np.linspace(-1, 1, 3)
y = np.linspace(-2, 2, 4)
X, Y = np.meshgrid(x, y, indexing="xy")
``` | `meshgrid` is the standard grid constructor for 2D+ coordinate evaluation. | Forgetting `indexing` can swap axis meaning between plotting and computation. | [numpy.meshgrid](https://numpy.org/doc/stable/reference/generated/numpy.meshgrid.html) |
| Create open and dense grids with slice syntax | You want fast grid construction without writing loops. | ```python
import numpy as np

X, Y = np.mgrid[0:3, 0:4]
u, v = np.ogrid[0:3, 0:4]
``` | Use `mgrid` for dense grids and `ogrid` for open grids. | Confusing dense and open grids can create large unnecessary allocations. | [numpy.mgrid](https://numpy.org/doc/stable/reference/generated/numpy.mgrid.html) |

## Array Properties
| Problem | Trigger | Snippet | Minimal Notes | Common Bug | Official Documentation URL |
|---|---|---|---|---|---|
| Inspect array shape | You need dimensional sizes before reshaping or broadcasting. | ```python
import numpy as np

a = np.arange(6).reshape(2, 3)
shape = a.shape
``` | `shape` is the primary structural descriptor. | Hard-coding shape assumptions causes runtime errors when batch sizes change. | [ndarray.shape](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.shape.html) |
| Inspect number of dimensions | You need rank-dependent logic. | ```python
import numpy as np

a = np.array([1, 2, 3])
rank = a.ndim
``` | `ndim` tells you how many axes the array has. | Treating 1D and 2D arrays the same often breaks indexing logic. | [ndarray.ndim](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.ndim.html) |
| Inspect element count | You need total size for validation or allocation. | ```python
import numpy as np

a = np.arange(12).reshape(3, 4)
n = a.size
``` | `size` is the total number of elements. | Using `shape[^0] * shape[^1]` breaks for higher-rank arrays. | [ndarray.size](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.size.html) |
| Inspect dtype | You need numeric type checks before math or I/O. | ```python
import numpy as np

a = np.arange(3, dtype=np.float32)
dt = a.dtype
``` | `dtype` controls precision, range, and memory use. | Assuming integer and floating behavior are interchangeable causes bugs. | [ndarray.dtype](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.dtype.html) |
| Inspect item size | You need per-element byte size. | ```python
import numpy as np

a = np.arange(3, dtype=np.int64)
itemsize = a.itemsize
``` | `itemsize` is useful for storage estimates and low-level debugging. | Confusing `itemsize` with `nbytes` underestimates total memory. | [ndarray.itemsize](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.itemsize.html) |
| Inspect total bytes | You need memory footprint information. | ```python
import numpy as np

a = np.zeros((100, 100), dtype=np.float32)
bytes_used = a.nbytes
``` | `nbytes` is the data buffer size in bytes. | Counting only Python object overhead misses the true array payload size. | [ndarray.nbytes](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.nbytes.html) |
| Inspect strides | You need memory-step debugging or view analysis. | ```python
import numpy as np

a = np.arange(12).reshape(3, 4)
strides = a.strides
``` | `strides` shows byte steps per axis. | Using a transposed view without noticing changed strides can surprise downstream code. | [ndarray.strides](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.strides.html) |
| Inspect memory flags | You need contiguity and writability checks. | ```python
import numpy as np

a = np.arange(6).reshape(2, 3)
flags = a.flags
``` | `flags` is the quick check for contiguous and writeable state. | Assuming a slice is contiguous can break downstream APIs. | [ndarray.flags](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.flags.html) |
| Transpose with `.T` | You need the reversed-axis view fast. | ```python
import numpy as np

a = np.arange(6).reshape(2, 3)
b = a.T
``` | `.T` is the shortest transpose form. | Expecting a copy instead of a view can lead to shared-data side effects. | [ndarray.T](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.T.html) |
| Access real part | You work with complex-valued arrays and need real components. | ```python
import numpy as np

a = np.array([1 + 2j, 3 + 4j])
real_part = a.real
``` | `.real` is a view-like accessor for the real component. | Assigning complex data into a real array silently discards the imaginary part. | [ndarray.real](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.real.html) |
| Access imaginary part | You work with complex-valued arrays and need imaginary components. | ```python
import numpy as np

a = np.array([1 + 2j, 3 + 4j])
imag_part = a.imag
``` | `.imag` exposes the imaginary component. | Using `.imag` on non-complex data is usually not what you want. | [ndarray.imag](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.imag.html) |

## Indexing and Selection
| Problem | Trigger | Snippet | Minimal Notes | Common Bug | Official Documentation URL |
|---|---|---|---|---|---|
| Slice contiguous ranges | You want a view into a subrange of rows or columns. | ```python
import numpy as np

a = np.arange(12).reshape(3, 4)
sub = a[1:, :2]
``` | Basic slicing is the standard fast selection path. | Assuming the slice is independent when it is actually a view can mutate the source. | [Indexing](https://numpy.org/doc/stable/user/basics.indexing.html) |
| Use integer-array selection | You need explicit row or element gathering by position. | ```python
import numpy as np

a = np.arange(12).reshape(3, 4)
rows = a[[0, 2], [1, 3]]
``` | Advanced indexing returns gathered values. | Shape and broadcasting of index arrays are easy to misread. | [Advanced indexing](https://numpy.org/doc/stable/user/basics.indexing.html#advanced-indexing) |
| Filter with boolean masks | You need conditional row or element selection. | ```python
import numpy as np

a = np.arange(10)
mask = a % 2 == 0
even = a[mask]
``` | Boolean indexing is the usual filtering pattern. | A mask with the wrong shape raises indexing errors. | [Boolean indexing](https://numpy.org/doc/stable/user/basics.indexing.html#boolean-array-indexing) |
| Select with ellipsis | You need to preserve unspecified dimensions. | ```python
import numpy as np

a = np.zeros((2, 3, 4))
tail = a[..., 0]
``` | `...` is useful in rank-agnostic code. | Hard-coding axis positions makes code fragile across shape changes. | [Indexing](https://numpy.org/doc/stable/user/basics.indexing.html) |
| Add a new axis | You need to align shapes for broadcasting or batching. | ```python
import numpy as np

a = np.arange(3)
b = a[:, np.newaxis]
``` | `np.newaxis` inserts a length-1 dimension. | Forgetting this step often leads to broadcasting errors. | [Indexing](https://numpy.org/doc/stable/user/basics.indexing.html) |
| Choose values conditionally | You need branch-free elementwise selection. | ```python
import numpy as np

a = np.array([-2, -1, 0, 1, 2])
b = np.where(a >= 0, a, 0)
``` | `where` is the standard elementwise conditional. | Writing Python `if` logic on arrays causes ambiguity errors. | [numpy.where](https://numpy.org/doc/stable/reference/generated/numpy.where.html) |
| Locate nonzero elements | You need indices of true/nonzero entries. | ```python
import numpy as np

a = np.array([0, 3, 0, 4])
idx = np.nonzero(a)
``` | Use with sparse conditions and mask diagnostics. | Confusing the tuple return shape causes indexing mistakes. | [numpy.nonzero](https://numpy.org/doc/stable/reference/generated/numpy.nonzero.html) |
| Get indices of selected entries | You need coordinates of true elements in an n-D array. | ```python
import numpy as np

a = np.array([[0, 1], [2, 0]])
coords = np.argwhere(a)
``` | `argwhere` is often better for coordinate inspection than `nonzero`. | Treating the output as a flat index array is incorrect. | [numpy.argwhere](https://numpy.org/doc/stable/reference/generated/numpy.argwhere.html) |
| Gather entries by explicit index | You need indexed lookup along one axis. | ```python
import numpy as np

a = np.arange(12).reshape(3, 4)
picked = np.take(a, [0, 2], axis=0)
``` | `take` is useful for axis-aware gathering. | Confusing axis selection changes which dimension is sampled. | [numpy.take](https://numpy.org/doc/stable/reference/generated/numpy.take.html) |
| Filter rows or slices by mask | You need axis-wise mask compression. | ```python
import numpy as np

a = np.arange(12).reshape(3, 4)
mask = np.array([True, False, True])
picked = np.compress(mask, a, axis=0)
``` | `compress` is a compact masked selection tool along an axis. | A mask of the wrong length for the axis fails at runtime. | [numpy.compress](https://numpy.org/doc/stable/reference/generated/numpy.compress.html) |
| Select from multiple choices by index | You need lookup from a small option table. | ```python
import numpy as np

idx = np.array([0, 2, 1])
choices = [np.array([10, 10, 10]), np.array([20, 20, 20]), np.array([30, 30, 30])]
out = np.choose(idx, choices)
``` | `choose` is handy for discrete branch tables. | Index values outside the choice range raise errors. | [numpy.choose](https://numpy.org/doc/stable/reference/generated/numpy.choose.html) |
| Extract condition-matched elements | You need `np.where`-style filtering with explicit condition arrays. | ```python
import numpy as np

a = np.array([1, 2, 3, 4])
out = np.extract(a % 2 == 0, a)
``` | `extract` is a convenience for condition-based flattening. | Using it when you need shape preservation is a mistake. | [numpy.extract](https://numpy.org/doc/stable/reference/generated/numpy.extract.html) |

## Shape Manipulation
| Problem | Trigger | Snippet | Minimal Notes | Common Bug | Official Documentation URL |
|---|---|---|---|---|---|
| Reshape data | You need a new compatible shape without changing values. | ```python
import numpy as np

a = np.arange(12)
b = a.reshape(3, 4)
``` | `reshape` is the standard structural transform. | Using an incompatible element count raises an error. | [numpy.reshape](https://numpy.org/doc/stable/reference/generated/numpy.reshape.html) |
| Flatten to a copy | You need a 1D copy for safe mutation or serialization. | ```python
import numpy as np

a = np.arange(6).reshape(2, 3)
b = a.flatten()
``` | `flatten` always returns a copy. | Expecting view semantics wastes memory and causes confusion. | [ndarray.flatten](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.flatten.html) |
| Flatten to a view when possible | You need a 1D representation with minimal copying. | ```python
import numpy as np

a = np.arange(6).reshape(2, 3)
b = a.ravel()
``` | `ravel` prefers a view when it can. | Modifying the result may affect the original array. | [numpy.ravel](https://numpy.org/doc/stable/reference/generated/numpy.ravel.html) |
| Resize in place | You control the array and want destructive size change. | ```python
import numpy as np

a = np.arange(6)
a.resize((2, 3))
``` | `resize` mutates the array shape in place. | Using it on arrays with shared references can be unsafe. | [ndarray.resize](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.resize.html) |
| Transpose axes | You need to reorder dimensions explicitly. | ```python
import numpy as np

a = np.zeros((2, 3, 4))
b = np.transpose(a, (1, 0, 2))
``` | Use `transpose` for axis permutation. | Wrong axis order silently changes meaning. | [numpy.transpose](https://numpy.org/doc/stable/reference/generated/numpy.transpose.html) |
| Swap two axes | You only need a pairwise axis exchange. | ```python
import numpy as np

a = np.zeros((2, 3, 4))
b = np.swapaxes(a, 0, 2)
``` | `swapaxes` is concise for two-axis swaps. | Swapping the wrong axes breaks downstream shape assumptions. | [numpy.swapaxes](https://numpy.org/doc/stable/reference/generated/numpy.swapaxes.html) |
| Move axes to new positions | You need batch/channel axis rearrangement. | ```python
import numpy as np

a = np.zeros((2, 3, 4))
b = np.moveaxis(a, 0, -1)
``` | `moveaxis` is common in ML preprocessing. | Confusing source and destination axis lists causes shape bugs. | [numpy.moveaxis](https://numpy.org/doc/stable/reference/generated/numpy.moveaxis.html) |
| Remove size-1 axes | You need to drop degenerate dimensions. | ```python
import numpy as np

a = np.zeros((1, 3, 1, 4))
b = np.squeeze(a)
``` | `squeeze` removes axes of length 1. | Accidentally removing an axis you meant to preserve changes rank. | [numpy.squeeze](https://numpy.org/doc/stable/reference/generated/numpy.squeeze.html) |
| Add explicit singleton dimensions | You need to align arrays for broadcasting. | ```python
import numpy as np

a = np.arange(6)
b = np.expand_dims(a, axis=0)
``` | `expand_dims` is the explicit version of `newaxis` insertion. | Picking the wrong axis creates shape mismatches later. | [numpy.expand_dims](https://numpy.org/doc/stable/reference/generated/numpy.expand_dims.html) |
| Stack arrays along a new axis | You have same-shaped arrays and want a new batch axis. | ```python
import numpy as np

a = np.array([1, 2])
b = np.array([3, 4])
c = np.stack([a, b], axis=0)
``` | `stack` adds a new dimension. | Trying to stack mismatched shapes raises errors. | [numpy.stack](https://numpy.org/doc/stable/reference/generated/numpy.stack.html) |
| Concatenate arrays along an existing axis | You need to append arrays with matching non-concatenation axes. | ```python
import numpy as np

a = np.ones((2, 3))
b = np.zeros((2, 3))
c = np.concatenate([a, b], axis=0)
``` | `concatenate` is the standard join operation. | Joining arrays with mismatched shapes on other axes fails. | [numpy.concatenate](https://numpy.org/doc/stable/reference/generated/numpy.concatenate.html) |
| Horizontal stack | You need side-by-side joining for 1D or 2D arrays. | ```python
import numpy as np

a = np.array([1, 2])
b = np.array([3, 4])
c = np.hstack([a, b])
``` | `hstack` is shorthand for common horizontal joins. | For 1D arrays, the result is still 1D, which can surprise code expecting columns. | [numpy.hstack](https://numpy.org/doc/stable/reference/generated/numpy.hstack.html) |
| Vertical stack | You need row-wise joining. | ```python
import numpy as np

a = np.array([1, 2])
b = np.array([3, 4])
c = np.vstack([a, b])
``` | `vstack` is common for sample-wise stacking. | Mixing 1D and 2D inputs can change the output shape unexpectedly. | [numpy.vstack](https://numpy.org/doc/stable/reference/generated/numpy.vstack.html) |
| Depth stack | You need stack-as-third-axis behavior. | ```python
import numpy as np

a = np.array([1, 2])
b = np.array([3, 4])
c = np.dstack([a, b])
``` | `dstack` groups inputs along depth. | 1D inputs are promoted in ways that may not match your mental model. | [numpy.dstack](https://numpy.org/doc/stable/reference/generated/numpy.dstack.html) |
| Split arrays into equal parts | You need segmenting for batch processing. | ```python
import numpy as np

a = np.arange(8)
parts = np.split(a, 4)
``` | `split` expects clean division unless you provide compatible indices. | Uneven lengths cause errors. | [numpy.split](https://numpy.org/doc/stable/reference/generated/numpy.split.html) |
| Split arrays into uneven parts | You need flexible chunking when sizes do not divide evenly. | ```python
import numpy as np

a = np.arange(10)
parts = np.array_split(a, 3)
``` | `array_split` handles uneven partition sizes. | Using `split` on uneven data fails. | [numpy.array_split](https://numpy.org/doc/stable/reference/generated/numpy.array_split.html) |
| Build nested block matrices | You need matrix assembly from subarrays. | ```python
import numpy as np

a = np.ones((2, 2))
b = np.zeros((2, 2))
m = np.block([[a, b], [b, a]])
``` | `block` is ideal for blockwise assembly. | Mismatched block shapes are a common source of errors. | [numpy.block](https://numpy.org/doc/stable/reference/generated/numpy.block.html) |

## Broadcasting
| Problem | Trigger | Snippet | Minimal Notes | Common Bug | Official Documentation URL |
|---|---|---|---|---|---|
| Broadcast arithmetic across dimensions | You want elementwise math between differently shaped arrays. | ```python
import numpy as np

a = np.arange(3)[:, None]
b = np.array([10, 20, 30])
c = a + b
``` | Broadcasting is the standard vectorized expansion mechanism. | Shape mismatch errors happen when trailing dimensions do not align. | [Broadcasting](https://numpy.org/doc/stable/user/basics.broadcasting.html) |
| Force a broadcasted read-only view | You want a repeated view without allocating full repeated storage. | ```python
import numpy as np

a = np.array([1, 2, 3])
b = np.broadcast_to(a, (4, 3))
``` | `broadcast_to` is memory-efficient for read-only expansion. | Writing to the result is not allowed. | [numpy.broadcast_to](https://numpy.org/doc/stable/reference/generated/numpy.broadcast_to.html) |
| Normalize shapes before vectorized math | You need multiple arrays expanded to compatible shapes. | ```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([[^10], [^20]])
x, y = np.broadcast_arrays(a, b)
``` | `broadcast_arrays` helps inspect aligned shapes. | Assuming expansion happens in-place is incorrect. | [numpy.broadcast_arrays](https://numpy.org/doc/stable/reference/generated/numpy.broadcast_arrays.html) |
| Add batch dimensions for broadcasting | You need row-wise or column-wise operations. | ```python
import numpy as np

a = np.array([1, 2, 3])
b = a[np.newaxis, :]
c = a[:, np.newaxis]
``` | Singleton axes are the main broadcasting workflow. | Missing the extra axis forces unwanted Python loops. | [Indexing](https://numpy.org/doc/stable/user/basics.indexing.html) |

## Ufunc Workflows
| Problem | Trigger | Snippet | Minimal Notes | Common Bug | Official Documentation URL |
|---|---|---|---|---|---|
| Perform basic arithmetic safely and vectorized | You need elementwise add, subtract, multiply, divide, floor-divide, or power. | ```python
import numpy as np

a = np.array([1, 2, 3], dtype=np.float64)
b = np.array([4, 5, 6], dtype=np.float64)
sum_ = np.add(a, b)
ratio = np.divide(b, a)
pow_ = np.power(a, 2)
``` | Use ufuncs for predictable vectorized math. | Integer arrays can produce truncation or overflow if the dtype is wrong. | [Ufuncs](https://numpy.org/doc/stable/reference/ufuncs.html) |
| Compare and build masks | You need elementwise comparisons for filtering or branching. | ```python
import numpy as np

a = np.array([1, 2, 3, 4])
mask = np.greater(a, 2)
``` | Comparison ufuncs return boolean arrays. | Using Python `and` / `or` on arrays raises ambiguity errors. | [Comparison ufuncs](https://numpy.org/doc/stable/reference/ufuncs.html#comparison-functions) |
| Combine logical conditions | You need elementwise boolean composition. | ```python
import numpy as np

a = np.array([1, 2, 3, 4])
mask = np.logical_and(a > 1, a < 4)
``` | Logical ufuncs are safer than Python boolean operators on arrays. | `and`/`or` do not work elementwise. | [Logical ufuncs](https://numpy.org/doc/stable/reference/ufuncs.html#logical-functions) |
| Apply trig functions | You need periodic transforms or angle-based computation. | ```python
import numpy as np

x = np.array([0.0, np.pi / 2, np.pi])
s = np.sin(x)
c = np.cos(x)
t = np.tan(x)
``` | Ufunc trig functions operate elementwise. | Passing degrees instead of radians gives wrong results. | [Trigonometric functions](https://numpy.org/doc/stable/reference/ufuncs.html#trigonometric-functions) |
| Apply exponential and logarithmic transforms | You need growth, decay, or log scaling. | ```python
import numpy as np

x = np.array([1.0, 2.0, 10.0])
y = np.exp(x)
z = np.log(x)
``` | Use the paired transforms to move between linear and log domains. | Taking `log` of non-positive values produces invalid results. | [Exponential and logarithmic functions](https://numpy.org/doc/stable/reference/ufuncs.html#exponential-and-logarithmic-functions) |
| Round values and clip ranges | You need quantization or value bounds. | ```python
import numpy as np

x = np.array([1.2, 2.7, -3.1])
rounded = np.round(x, 0)
clipped = np.clip(x, -1.0, 2.0)
``` | `round` and `clip` are common cleanup operations. | Clipping after dtype conversion can hide overflow or truncation errors. | [numpy.round](https://numpy.org/doc/stable/reference/generated/numpy.round.html) |
| Get sign and absolute magnitude | You need polarity and magnitude features. | ```python
import numpy as np

x = np.array([-3, 0, 4])
s = np.sign(x)
a = np.abs(x)
``` | These are basic preprocessing transforms. | Treating `sign` as a magnitude function is a logic bug. | [numpy.sign](https://numpy.org/doc/stable/reference/generated/numpy.sign.html) |
| Compute square roots and general powers | You need root and exponent transforms. | ```python
import numpy as np

x = np.array([1.0, 4.0, 9.0])
root = np.sqrt(x)
square = np.power(x, 2)
``` | Use `sqrt` for nonnegative inputs and `power` for generalized exponents. | Negative inputs to `sqrt` require complex-aware handling. | [numpy.sqrt](https://numpy.org/doc/stable/reference/generated/numpy.sqrt.html) |

## Aggregation
| Problem | Trigger | Snippet | Minimal Notes | Common Bug | Official Documentation URL |
|---|---|---|---|---|---|
| Sum values | You need totals across an axis or entire array. | ```python
import numpy as np

a = np.arange(6).reshape(2, 3)
total = np.sum(a, axis=1)
``` | Use `sum` for totals and axis reductions. | Integer dtype may overflow on large accumulations. | [numpy.sum](https://numpy.org/doc/stable/reference/generated/numpy.sum.html) |
| Compute means | You need average values for features or metrics. | ```python
import numpy as np

a = np.arange(6, dtype=np.float64).reshape(2, 3)
m = np.mean(a, axis=0)
``` | Prefer floating dtypes for averages. | Integer means can surprise when integer casting is involved upstream. | [numpy.mean](https://numpy.org/doc/stable/reference/generated/numpy.mean.html) |
| Compute median | You need a robust central tendency estimate. | ```python
import numpy as np

a = np.array([1, 100, 2, 3])
m = np.median(a)
``` | Median is often better than mean for outlier-heavy data. | Sorting assumptions are unnecessary; let NumPy handle it. | [numpy.median](https://numpy.org/doc/stable/reference/generated/numpy.median.html) |
| Compute standard deviation | You need spread or normalization statistics. | ```python
import numpy as np

a = np.arange(6, dtype=np.float64)
s = np.std(a, ddof=1)
``` | Use `ddof` consistently with your statistical convention. | Mixing population and sample formulas gives wrong metrics. | [numpy.std](https://numpy.org/doc/stable/reference/generated/numpy.std.html) |
| Compute variance | You need variance for dispersion analysis. | ```python
import numpy as np

a = np.arange(6, dtype=np.float64)
v = np.var(a, ddof=1)
``` | Variance is the square of standard deviation. | Forgetting `ddof` can silently change results. | [numpy.var](https://numpy.org/doc/stable/reference/generated/numpy.var.html) |
| Compute product | You need multiplicative aggregation. | ```python
import numpy as np

a = np.array([2, 3, 4])
p = np.prod(a)
``` | Useful for scaling and combinatorial counts. | Overflow is common with integer products. | [numpy.prod](https://numpy.org/doc/stable/reference/generated/numpy.prod.html) |
| Find minimum and maximum | You need extrema for normalization or bounds. | ```python
import numpy as np

a = np.array([3, 1, 9, 2])
mn = np.min(a)
mx = np.max(a)
``` | Use `min` and `max` for basic range extraction. | Empty arrays need special handling. | [numpy.min](https://numpy.org/doc/stable/reference/generated/numpy.min.html) |
| Find argmin and argmax | You need index positions of extrema. | ```python
import numpy as np

a = np.array([3, 1, 9, 2])
i_min = np.argmin(a)
i_max = np.argmax(a)
``` | Use with selection and debugging. | Returning indices from a flattened array may not match your axis intent. | [numpy.argmin](https://numpy.org/doc/stable/reference/generated/numpy.argmin.html) |
| Test any / all conditions | You need boolean reduction across rows or the whole array. | ```python
import numpy as np

a = np.array([True, False, True])
any_true = np.any(a)
all_true = np.all(a)
``` | These are standard validity checks. | Using Python `any` / `all` on arrays is slower and less explicit. | [numpy.any](https://numpy.org/doc/stable/reference/generated/numpy.any.html) |
| Count nonzero entries | You need compact sparsity metrics. | ```python
import numpy as np

a = np.array([0, 2, 0, 3])
n = np.count_nonzero(a)
``` | Handy for masks, sparsity, and occupancy checks. | Counting truthy Python objects instead of numeric zeros can be misleading. | [numpy.count_nonzero](https://numpy.org/doc/stable/reference/generated/numpy.count_nonzero.html) |
| Compute percentiles and quantiles | You need robust distribution cut points. | ```python
import numpy as np

a = np.array([1, 2, 3, 4, 5])
p90 = np.percentile(a, 90)
q = np.quantile(a, 0.9)
``` | Use percentiles for thresholds and quantiles for normalized probability scale. | Confusing percentile units with quantile units causes wrong thresholds. | [numpy.percentile](https://numpy.org/doc/stable/reference/generated/numpy.percentile.html) |

## Sorting and Searching
| Problem | Trigger | Snippet | Minimal Notes | Common Bug | Official Documentation URL |
|---|---|---|---|---|---|
| Sort values | You need ordered data along an axis. | ```python
import numpy as np

a = np.array([3, 1, 2])
b = np.sort(a)
``` | `sort` returns sorted data. | Sorting axis assumptions matter for multidimensional arrays. | [numpy.sort](https://numpy.org/doc/stable/reference/generated/numpy.sort.html) |
| Get sort indices | You need permutation indices rather than sorted values. | ```python
import numpy as np

a = np.array([3, 1, 2])
idx = np.argsort(a)
``` | `argsort` is useful for aligned reordering. | Using the indices directly on the wrong axis breaks alignment. | [numpy.argsort](https://numpy.org/doc/stable/reference/generated/numpy.argsort.html) |
| Sort by multiple keys | You need lexicographic ordering across fields or columns. | ```python
import numpy as np

a = np.array([(1, 2), (1, 1), (0, 3)], dtype=[("x", "i4"), ("y", "i4")])
idx = np.lexsort((a["y"], a["x"]))
``` | `lexsort` is the standard multi-key sort helper. | The key order is easy to reverse accidentally. | [numpy.lexsort](https://numpy.org/doc/stable/reference/generated/numpy.lexsort.html) |
| Find insertion positions | You need to keep a sorted array sorted after insertion. | ```python
import numpy as np

a = np.array([1, 3, 5, 7])
pos = np.searchsorted(a, [0, 4, 8])
``` | `searchsorted` supports sorted lookup and binning workflows. | Using it on unsorted arrays produces meaningless positions. | [numpy.searchsorted](https://numpy.org/doc/stable/reference/generated/numpy.searchsorted.html) |
| Deduplicate values | You need unique elements and optional counts or positions. | ```python
import numpy as np

a = np.array([3, 1, 3, 2])
u = np.unique(a)
``` | `unique` is the standard deduplication API. | Assuming original order is preserved can be wrong without explicit handling. | [numpy.unique](https://numpy.org/doc/stable/reference/generated/numpy.unique.html) |
| Membership test | You need vectorized set membership checks. | ```python
import numpy as np

a = np.array([1, 2, 3, 4])
mask = np.isin(a, [2, 4])
``` | `isin` is a fast array membership filter. | Using Python `in` on arrays checks container membership, not elementwise membership. | [numpy.isin](https://numpy.org/doc/stable/reference/generated/numpy.isin.html) |
| Compute intersections | You need common values between arrays. | ```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([2, 3, 4])
c = np.intersect1d(a, b)
``` | `intersect1d` is the standard 1D intersection helper. | It works on flattened 1D semantics, not arbitrary shape matching. | [numpy.intersect1d](https://numpy.org/doc/stable/reference/generated/numpy.intersect1d.html) |
| Compute unions | You need the combined unique set of values. | ```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([2, 3, 4])
c = np.union1d(a, b)
``` | `union1d` combines and deduplicates. | Order expectations may differ from input order. | [numpy.union1d](https://numpy.org/doc/stable/reference/generated/numpy.union1d.html) |
| Compute set differences | You need values in one array not present in another. | ```python
import numpy as np

a = np.array([1, 2, 3, 4])
b = np.array([2, 4])
c = np.setdiff1d(a, b)
``` | `setdiff1d` is the standard exclusion helper. | Forgetting that results are unique and sorted can break downstream expectations. | [numpy.setdiff1d](https://numpy.org/doc/stable/reference/generated/numpy.setdiff1d.html) |

## Linear Algebra
| Problem | Trigger | Snippet | Minimal Notes | Common Bug | Official Documentation URL |
|---|---|---|---|---|---|
| Multiply matrices | You need matrix product semantics. | ```python
import numpy as np

a = np.arange(6).reshape(2, 3)
b = np.arange(6).reshape(3, 2)
c = a @ b
``` | `@` is the most readable matrix multiplication form. | Using `*` instead of `@` does elementwise multiplication. | [numpy.matmul](https://numpy.org/doc/stable/reference/generated/numpy.matmul.html) |
| Use dot products or legacy-compatible multiplication | You need dot semantics for vectors or matrices. | ```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
d = np.dot(a, b)
``` | `dot` remains common in existing codebases. | Axis behavior changes with rank, so shape checks matter. | [numpy.dot](https://numpy.org/doc/stable/reference/generated/numpy.dot.html) |
| Write tensor contractions | You need concise, explicit multi-axis algebra. | ```python
import numpy as np

a = np.arange(6).reshape(2, 3)
b = np.arange(6).reshape(3, 2)
c = np.einsum("ij,jk->ik", a, b)
``` | `einsum` is ideal for contraction-heavy code. | A wrong subscript string can silently compute the wrong algebra. | [numpy.einsum](https://numpy.org/doc/stable/reference/generated/numpy.einsum.html) |
| Compute cross products | You need 3D vector cross-product operations. | ```python
import numpy as np

a = np.array([1, 0, 0])
b = np.array([0, 1, 0])
c = np.cross(a, b)
``` | `cross` is standard for vector geometry. | Axis-aware cross products need attention in batched data. | [numpy.cross](https://numpy.org/doc/stable/reference/generated/numpy.cross.html) |
| Compute outer products | You need pairwise multiplication table structure. | ```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5])
c = np.outer(a, b)
``` | `outer` is useful for kernels and feature expansions. | Using it for large arrays can explode memory. | [numpy.outer](https://numpy.org/doc/stable/reference/generated/numpy.outer.html) |
| Compute inner products | You need scalar projection or vector similarity. | ```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
c = np.inner(a, b)
``` | `inner` is a compact dot-like helper. | Rank-dependent behavior can surprise you in multidimensional inputs. | [numpy.inner](https://numpy.org/doc/stable/reference/generated/numpy.inner.html) |
| Compute norms | You need vector or matrix magnitude. | ```python
import numpy as np

a = np.array([3.0, 4.0])
n = np.linalg.norm(a)
``` | `norm` is the standard magnitude API. | Choosing the wrong axis or ord changes the metric. | [numpy.linalg.norm](https://numpy.org/doc/stable/reference/generated/numpy.linalg.norm.html) |
| Solve linear systems | You need \(Ax=b\) rather than explicit inversion. | ```python
import numpy as np

A = np.array([[3.0, 1.0], [1.0, 2.0]])
b = np.array([9.0, 8.0])
x = np.linalg.solve(A, b)
``` | Prefer `solve` over `inv(A) @ b`. | Solving with a singular or near-singular matrix fails or becomes unstable. | [numpy.linalg.solve](https://numpy.org/doc/stable/reference/generated/numpy.linalg.solve.html) |
| Compute inverse | You need the matrix inverse explicitly. | ```python
import numpy as np

A = np.array([[3.0, 1.0], [1.0, 2.0]])
A_inv = np.linalg.inv(A)
``` | Use only when inverse is genuinely required. | Inverting when solving is enough wastes compute and stability. | [numpy.linalg.inv](https://numpy.org/doc/stable/reference/generated/numpy.linalg.inv.html) |
| Compute pseudoinverse | You need least-squares style inversion for non-square or rank-deficient matrices. | ```python
import numpy as np

A = np.array([[1.0, 2.0], [2.0, 4.0]])
A_pinv = np.linalg.pinv(A)
``` | `pinv` is safer than `inv` for singular systems. | Treating a pseudoinverse like an exact inverse is mathematically wrong. | [numpy.linalg.pinv](https://numpy.org/doc/stable/reference/generated/numpy.linalg.pinv.html) |
| Compute eigenvalues and eigenvectors | You need spectral decomposition for square matrices. | ```python
import numpy as np

A = np.array([[2.0, 0.0], [0.0, 3.0]])
vals, vecs = np.linalg.eig(A)
``` | `eig` handles general square matrices. | Forgetting that eigenvectors are column-wise can cause confusion. | [numpy.linalg.eig](https://numpy.org/doc/stable/reference/generated/numpy.linalg.eig.html) |
| Compute Hermitian eigen decomposition | You work with symmetric or Hermitian matrices. | ```python
import numpy as np

A = np.array([[2.0, 1.0], [1.0, 3.0]])
vals, vecs = np.linalg.eigh(A)
``` | `eigh` is preferred for symmetric/Hermitian inputs. | Using `eig` on symmetric matrices is less efficient. | [numpy.linalg.eigh](https://numpy.org/doc/stable/reference/generated/numpy.linalg.eigh.html) |
| Compute singular value decomposition | You need low-rank structure or dimensionality reduction. | ```python
import numpy as np

A = np.array([[1.0, 2.0], [3.0, 4.0]])
U, S, Vh = np.linalg.svd(A)
``` | `svd` is the standard factorization for rectangular matrices. | Misreading `Vh` as `V` causes reconstruction mistakes. | [numpy.linalg.svd](https://numpy.org/doc/stable/reference/generated/numpy.linalg.svd.html) |
| Compute determinant | You need a scalar invertibility indicator. | ```python
import numpy as np

A = np.array([[3.0, 1.0], [1.0, 2.0]])
d = np.linalg.det(A)
``` | Useful for diagnostics, not for routine solving. | Determinants are numerically unstable for large matrices. | [numpy.linalg.det](https://numpy.org/doc/stable/reference/generated/numpy.linalg.det.html) |
| Estimate matrix rank | You need numerical rank under tolerance. | ```python
import numpy as np

A = np.array([[1.0, 2.0], [2.0, 4.0]])
r = np.linalg.matrix_rank(A)
``` | `matrix_rank` is useful for detecting degeneracy. | Rank depends on tolerance, so be explicit in critical code. | [numpy.linalg.matrix_rank](https://numpy.org/doc/stable/reference/generated/numpy.linalg.matrix_rank.html) |
| Compute Cholesky factorization | You need a fast decomposition for positive-definite matrices. | ```python
import numpy as np

A = np.array([[4.0, 2.0], [2.0, 3.0]])
L = np.linalg.cholesky(A)
``` | Cholesky is efficient for symmetric positive-definite matrices. | Using it on non-positive-definite matrices raises an error. | [numpy.linalg.cholesky](https://numpy.org/doc/stable/reference/generated/numpy.linalg.cholesky.html) |
| Compute QR factorization | You need orthogonal-triangular decomposition. | ```python
import numpy as np

A = np.array([[1.0, 2.0], [3.0, 4.0]])
Q, R = np.linalg.qr(A)
``` | QR is common in least squares and orthogonalization. | Interpreting the shapes of `Q` and `R` incorrectly causes downstream mismatches. | [numpy.linalg.qr](https://numpy.org/doc/stable/reference/generated/numpy.linalg.qr.html) |

## Random Numbers
| Problem | Trigger | Snippet | Minimal Notes | Common Bug | Official Documentation URL |
|---|---|---|---|---|---|
| Create a modern random generator | You need reproducible random numbers with the Generator API. | ```python
import numpy as np

rng = np.random.default_rng(42)
``` | `default_rng` is the modern entry point. | Using legacy global random state makes reproducibility harder. | [numpy.random.default_rng](https://numpy.org/doc/stable/reference/random/default_rng.html) |
| Draw random integers | You need bounded integer samples. | ```python
import numpy as np

rng = np.random.default_rng(42)
x = rng.integers(0, 10, size=5)
``` | Use `integers` for discrete sampling. | Confusing inclusive/exclusive bounds causes off-by-one bugs. | [Generator.integers](https://numpy.org/doc/stable/reference/random/generated/numpy.random.Generator.integers.html) |
| Draw uniform random samples | You need continuous values over an interval. | ```python
import numpy as np

rng = np.random.default_rng(42)
x = rng.uniform(0.0, 1.0, size=(2, 3))
``` | `uniform` is standard for continuous random initialization. | Mixing up interval endpoints changes sampling range. | [Generator.uniform](https://numpy.org/doc/stable/reference/random/generated/numpy.random.Generator.uniform.html) |
| Draw normal random samples | You need Gaussian noise or initialization. | ```python
import numpy as np

rng = np.random.default_rng(42)
x = rng.normal(loc=0.0, scale=1.0, size=5)
``` | `normal` is the standard normal-distribution API. | Forgetting `scale` is standard deviation, not variance, is a common mistake. | [Generator.normal](https://numpy.org/doc/stable/reference/random/generated/numpy.random.Generator.normal.html) |
| Sample with replacement or weighted choice | You need categorical sampling from a population. | ```python
import numpy as np

rng = np.random.default_rng(42)
x = rng.choice([10, 20, 30], size=5, replace=True, p=[0.2, 0.3, 0.5])
``` | `choice` covers most sampling workflows. | Probability vectors must match the population size. | [Generator.choice](https://numpy.org/doc/stable/reference/random/generated/numpy.random.Generator.choice.html) |
| Generate a permutation | You need shuffled ordering without in-place mutation. | ```python
import numpy as np

rng = np.random.default_rng(42)
p = rng.permutation(10)
``` | `permutation` returns a permuted copy. | Expecting the original data to change is incorrect. | [Generator.permutation](https://numpy.org/doc/stable/reference/random/generated/numpy.random.Generator.permutation.html) |
| Shuffle in place | You need to permute an array destructively. | ```python
import numpy as np

rng = np.random.default_rng(42)
a = np.arange(5)
rng.shuffle(a)
``` | `shuffle` mutates the input array. | Forgetting it is in-place can destroy ordering you still need. | [Generator.shuffle](https://numpy.org/doc/stable/reference/random/generated/numpy.random.Generator.shuffle.html) |
| Sample multinomial outcomes | You need counts from categorical trials. | ```python
import numpy as np

rng = np.random.default_rng(42)
x = rng.multinomial(10, [0.2, 0.3, 0.5])
``` | Useful for simulation and probabilistic counting. | Probabilities must sum to 1.0 in practice. | [Generator.multinomial](https://numpy.org/doc/stable/reference/random/generated/numpy.random.Generator.multinomial.html) |
| Sample binomial outcomes | You need repeated success/failure counts. | ```python
import numpy as np

rng = np.random.default_rng(42)
x = rng.binomial(n=10, p=0.3, size=5)
``` | `binomial` is a common discrete simulation primitive. | Passing probability outside \([0, 1]\) is invalid. | [Generator.binomial](https://numpy.org/doc/stable/reference/random/generated/numpy.random.Generator.binomial.html) |
| Sample Poisson counts | You need event-count simulation. | ```python
import numpy as np

rng = np.random.default_rng(42)
x = rng.poisson(lam=3.0, size=5)
``` | `poisson` is common for count-process modeling. | Negative rate parameters are invalid. | [Generator.poisson](https://numpy.org/doc/stable/reference/random/generated/numpy.random.Generator.poisson.html) |

## Missing Values
| Problem | Trigger | Snippet | Minimal Notes | Common Bug | Official Documentation URL |
|---|---|---|---|---|---|
| Detect NaNs | You need missing-value masks. | ```python
import numpy as np

a = np.array([1.0, np.nan, 3.0])
mask = np.isnan(a)
``` | `isnan` is the standard NaN detector. | Comparing to `np.nan` with `==` does not detect missing values. | [numpy.isnan](https://numpy.org/doc/stable/reference/generated/numpy.isnan.html) |
| Detect finite values | You need validity masks for cleaning data. | ```python
import numpy as np

a = np.array([1.0, np.inf, np.nan])
mask = np.isfinite(a)
``` | `isfinite` checks both NaN and infinity. | Using only `isnan` misses infinities. | [numpy.isfinite](https://numpy.org/doc/stable/reference/generated/numpy.isfinite.html) |
| Detect infinities | You need to isolate overflow or sentinel infinities. | ```python
import numpy as np

a = np.array([1.0, np.inf, -np.inf])
mask = np.isinf(a)
``` | `isinf` is useful for stability checks. | Treating large finite values as infinity is incorrect. | [numpy.isinf](https://numpy.org/doc/stable/reference/generated/numpy.isinf.html) |
| Replace NaN and infinities | You need to sanitize arrays before downstream consumers. | ```python
import numpy as np

a = np.array([1.0, np.nan, np.inf, -np.inf])
b = np.nan_to_num(a, nan=0.0, posinf=1e6, neginf=-1e6)
``` | `nan_to_num` is the standard cleanup helper. | Default replacement values may not match your application. | [numpy.nan_to_num](https://numpy.org/doc/stable/reference/generated/numpy.nan_to_num.html) |
| Compute mean ignoring NaNs | You need averages from partially missing data. | ```python
import numpy as np

a = np.array([1.0, np.nan, 3.0])
m = np.nanmean(a)
``` | NaN-aware reductions are essential for data cleaning. | Using plain `mean` propagates NaNs. | [numpy.nanmean](https://numpy.org/doc/stable/reference/generated/numpy.nanmean.html) |
| Compute median ignoring NaNs | You need robust central tendency with missing data. | ```python
import numpy as np

a = np.array([1.0, np.nan, 3.0])
m = np.nanmedian(a)
``` | `nanmedian` avoids NaN poisoning. | Plain `median` can return NaN when any NaN is present. | [numpy.nanmedian](https://numpy.org/doc/stable/reference/generated/numpy.nanmedian.html) |
| Compute std ignoring NaNs | You need spread metrics on incomplete data. | ```python
import numpy as np

a = np.array([1.0, np.nan, 3.0])
s = np.nanstd(a)
``` | Use NaN-aware statistics when missing values are expected. | Dropping NaNs manually and forgetting axis alignment causes subtle bugs. | [numpy.nanstd](https://numpy.org/doc/stable/reference/generated/numpy.nanstd.html) |
| Compute percentile ignoring NaNs | You need robust thresholds on incomplete data. | ```python
import numpy as np

a = np.array([1.0, np.nan, 3.0, 4.0])
p = np.nanpercentile(a, 75)
``` | `nanpercentile` is common in data cleanup and feature scaling. | Plain `percentile` may propagate NaNs. | [numpy.nanpercentile](https://numpy.org/doc/stable/reference/generated/numpy.nanpercentile.html) |

## Input and Output
| Problem | Trigger | Snippet | Minimal Notes | Common Bug | Official Documentation URL |
|---|---|---|---|---|---|
| Save a single array in binary form | You want compact NumPy-native persistence. | ```python
import numpy as np

a = np.arange(6)
np.save("array.npy", a)
``` | `.npy` is the simplest exact-array format. | Loading text files as binary or vice versa breaks data. | [numpy.save](https://numpy.org/doc/stable/reference/generated/numpy.save.html) |
| Load a binary NumPy array | You need exact restoration of saved ndarray data. | ```python
import numpy as np

a = np.load("array.npy")
``` | `load` reads `.npy` and `.npz` files. | Forgetting `allow_pickle=False` is a security concern for untrusted files. | [numpy.load](https://numpy.org/doc/stable/reference/generated/numpy.load.html) |
| Save multiple arrays | You need a single archive of named arrays. | ```python
import numpy as np

a = np.arange(3)
b = np.arange(4)
np.savez("bundle.npz", a=a, b=b)
``` | `savez` stores several arrays in one archive. | Losing array names makes multi-array loads awkward. | [numpy.savez](https://numpy.org/doc/stable/reference/generated/numpy.savez.html) |
| Save compressed archives | You need smaller files and can trade CPU for compression. | ```python
import numpy as np

a = np.arange(3)
b = np.arange(4)
np.savez_compressed("bundle.npz", a=a, b=b)
``` | Good for storage and transfer. | Compression slows writes and reads. | [numpy.savez_compressed](https://numpy.org/doc/stable/reference/generated/numpy.savez_compressed.html) |
| Load text data | You need whitespace- or delimiter-separated numeric input. | ```python
import numpy as np

a = np.loadtxt("data.csv", delimiter=",")
``` | `loadtxt` is the standard simple text loader. | Mixed types and malformed rows often require `genfromtxt` instead. | [numpy.loadtxt](https://numpy.org/doc/stable/reference/generated/numpy.loadtxt.html) |
| Save text data | You need human-readable numeric output. | ```python
import numpy as np

a = np.arange(6).reshape(2, 3)
np.savetxt("data.csv", a, delimiter=",", fmt="%.6f")
``` | `savetxt` is convenient for debugging and interop. | Default formatting may lose precision. | [numpy.savetxt](https://numpy.org/doc/stable/reference/generated/numpy.savetxt.html) |
| Read raw binary data | You need fast file ingestion for fixed-format numeric buffers. | ```python
import numpy as np

a = np.fromfile("data.bin", dtype=np.float32)
``` | `fromfile` is for raw binary formats, not portable text. | Wrong dtype or endianness corrupts data interpretation. | [numpy.fromfile](https://numpy.org/doc/stable/reference/generated/numpy.fromfile.html) |
| Write raw binary data | You need fast raw serialization of an array buffer. | ```python
import numpy as np

a = np.arange(6, dtype=np.float32)
a.tofile("data.bin")
``` | `tofile` writes the raw data buffer. | It does not store metadata like dtype or shape. | [ndarray.tofile](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.tofile.html) |
| Use memory-mapped arrays | You need out-of-core access to large numeric files. | ```python
import numpy as np

mm = np.memmap("data.dat", dtype=np.float32, mode="w+", shape=(1000, 1000))
mm[0, 0] = 1.0
mm.flush()
``` | `memmap` is the standard large-file workflow. | Forgetting to flush can delay persistence. | [numpy.memmap](https://numpy.org/doc/stable/reference/generated/numpy.memmap.html) |

## Performance
| Problem | Trigger | Snippet | Minimal Notes | Common Bug | Official Documentation URL |
|---|---|---|---|---|---|
| Vectorize Python loops | You are doing elementwise work in Python. | ```python
import numpy as np

a = np.arange(1000)
b = a * 2 + 1
``` | Prefer array expressions over explicit Python loops. | Looping over elements in Python is usually the slow path. | [NumPy arrays](https://numpy.org/doc/stable/reference/arrays.ndarray.html) |
| Update arrays in place | You want to reduce allocations and temporary arrays. | ```python
import numpy as np

a = np.arange(5, dtype=np.float64)
a += 1.0
``` | In-place ops can reduce memory traffic. | In-place arithmetic can silently cast or truncate. | [ndarray arithmetic](https://numpy.org/doc/stable/reference/arrays.ndarray.html) |
| Prefer views over copies | You only need a window or rearranged view. | ```python
import numpy as np

a = np.arange(12).reshape(3, 4)
b = a[:, :2]
``` | Views avoid extra allocations. | Calling `copy()` too early wastes memory. | [NumPy arrays](https://numpy.org/doc/stable/reference/arrays.ndarray.html) |
| Choose memory-efficient dtypes | You need to control RAM use and numeric range. | ```python
import numpy as np

a = np.array([1, 2, 3], dtype=np.int32)
b = np.array([1.0, 2.0, 3.0], dtype=np.float32)
``` | Use the smallest dtype that still preserves correctness. | Overusing `float64` or `int64` increases memory pressure. | [Data types](https://numpy.org/doc/stable/reference/arrays.scalars.html) |
| Keep arrays contiguous when needed | You pass data to code expecting contiguous buffers. | ```python
import numpy as np

a = np.ascontiguousarray(np.arange(12).reshape(3, 4).T)
``` | Use contiguous conversion only when required. | Unnecessary copying can hurt performance. | [numpy.ascontiguousarray](https://numpy.org/doc/stable/reference/generated/numpy.ascontiguousarray.html) |
| Avoid needless broadcast materialization | You need repeated values without allocating full tiled arrays. | ```python
import numpy as np

a = np.arange(3)
b = np.broadcast_to(a, (1000, 3))
``` | Broadcasted views often beat manual tiling. | Calling `tile` for simple repetition usually wastes memory. | [numpy.broadcast_to](https://numpy.org/doc/stable/reference/generated/numpy.broadcast_to.html) |

## Quick Reference Tables
### Array creation functions
| Task | Function |
|---|---|
| From Python data | `array`, `asarray`, `copy` |
| Zero/one/full buffers | `zeros`, `ones`, `empty`, `full` |
| Structured matrices | `eye`, `identity`, `diag`, `tri` |
| Range generation | `arange`, `linspace`, `logspace`, `geomspace` |
| Programmatic construction | `fromfunction`, `fromiter`, `meshgrid`, `mgrid`, `ogrid` |

### Shape manipulation APIs
| Task | Function |
|---|---|
| Reshape and flatten | `reshape`, `flatten`, `ravel`, `resize` |
| Axis reordering | `transpose`, `swapaxes`, `moveaxis`, `squeeze`, `expand_dims` |
| Combine arrays | `stack`, `concatenate`, `hstack`, `vstack`, `dstack`, `block` |
| Split arrays | `split`, `array_split` |

### Indexing patterns
| Pattern | Tool |
|---|---|
| Basic slices | `a[start:stop:step]` |
| Boolean mask | `a[mask]` |
| Advanced integer indexing | `a[[...]]` |
| Ellipsis | `...` |
| New axis | `np.newaxis` |
| Conditional selection | `where` |
| Nonzero positions | `nonzero`, `argwhere` |
| Axis-aware gather | `take`, `compress` |
| Choice tables | `choose`, `extract` |

### Broadcasting rules
| Rule | Reminder |
|---|---|
| Compare from the trailing axes | Right-align shapes. |
| Size must match or be 1 | Singleton dimensions expand. |
| Use singleton axes intentionally | `newaxis` / `expand_dims` / reshape. |
| Prefer views over explicit repeats | `broadcast_to` over materialization. |

### Common ufunc groups
| Group | Examples |
|---|---|
| Arithmetic | `add`, `subtract`, `multiply`, `divide`, `power` |
| Comparison | `equal`, `not_equal`, `greater`, `less`, `greater_equal`, `less_equal` |
| Logical | `logical_and`, `logical_or`, `logical_not`, `logical_xor` |
| Trigonometric | `sin`, `cos`, `tan` |
| Exponential / log | `exp`, `log`, `log10`, `log1p` |
| Rounding / clipping | `round`, `floor`, `ceil`, `clip` |
| Sign / magnitude | `sign`, `abs`, `sqrt` |

### Aggregation functions
| Task | Function |
|---|---|
| Totals | `sum`, `prod` |
| Central tendency | `mean`, `median` |
| Dispersion | `std`, `var` |
| Extremes | `min`, `max`, `argmin`, `argmax` |
| Boolean reduction | `any`, `all`, `count_nonzero` |
| Robust thresholds | `percentile`, `quantile` |

### Linear algebra APIs
| Task | Function |
|---|---|
| Matrix multiply | `matmul`, `dot`, `einsum` |
| Vector geometry | `cross`, `outer`, `inner` |
| Norms | `norm` |
| Solvers | `solve`, `inv`, `pinv` |
| Decompositions | `eig`, `eigh`, `svd`, `cholesky`, `qr` |
| Matrix diagnostics | `det`, `matrix_rank` |

### Random Generator methods
| Task | Method |
|---|---|
| Generator creation | `default_rng` |
| Integers | `integers` |
| Continuous sampling | `uniform`, `normal` |
| Discrete sampling | `choice`, `multinomial`, `binomial`, `poisson` |
| Permutation | `permutation`, `shuffle` |

### Data types and layout
| Topic | Examples |
|---|---|
| Common numeric dtypes | `bool_`, `int32`, `int64`, `float32`, `float64`, `complex64`, `complex128` |
| Memory layout checks | `shape`, `ndim`, `strides`, `flags`, `itemsize`, `nbytes` |
| Common order flags | C-contiguous, F-contiguous, writeable, aligned |

### I/O formats
| Format | APIs |
|---|---|
| Native binary | `save`, `load` |
| Multi-array archive | `savez`, `savez_compressed` |
| Text | `loadtxt`, `savetxt` |
| Raw binary | `fromfile`, `tofile` |
| Out-of-core | `memmap` |

### Axis conventions
| Convention | Meaning |
|---|---|
| `axis=0` | First dimension, often rows or batch. |
| `axis=1` | Second dimension, often columns or features. |
| `axis=-1` | Last dimension, often channels or coordinates. |
| `keepdims=True` | Preserve reduced axes as size-1 dimensions. |

### Common Errors
| Error | Cause | Solution |
|---|---|---|
| shape mismatch | Arrays differ on non-singleton trailing dimensions. | Insert singleton axes or reshape to align shapes. |
| broadcasting error | Dimensions cannot expand together. | Right-align shapes and ensure each pair matches or is 1. |
| unexpected copies | Used `array`, `copy`, or a non-view operation unnecessarily. | Prefer `asarray`, slicing, and view-based transforms. |
| dtype overflow | Integer accumulation exceeds dtype range. | Promote dtype before reduction or use floating accumulation. |
| integer division mistakes | Integer dtype truncates results. | Cast to floating dtype before division. |
| axis errors | Wrong axis passed to reductions or concatenation. | Check axis meaning before coding. |
| object dtype problems | Mixed Python objects entered numeric arrays. | Normalize inputs and specify numeric dtype explicitly. |

### Performance Checklist
- Use vectorized expressions instead of Python loops.
- Prefer broadcasting over `tile` and manual repetition.
- Reuse arrays in place when safe.
- Avoid unnecessary copies after slicing or reshaping.
- Choose `float32` or `int32` when precision allows.
- Keep arrays contiguous when passing to performance-sensitive code.
- Use `memmap` for large files instead of loading everything into RAM.
- Use binary formats for exact round-trips and faster I/O.

### Production Checklist
- Verify shape expectations before every reduction or join.
- Pin `dtype` for numerically sensitive pipelines.
- Use seeded `default_rng` for reproducibility.
- Handle NaN and infinity explicitly.
- Prefer `solve` over `inv(A) @ b`.
- Confirm broadcasting intent with singleton axes.
- Avoid silent copies in memory-sensitive code.
- Keep snippets and file formats consistent across the pipeline.
<span style="display:none">[^11][^12][^13][^14][^15][^16][^17][^18][^19][^2][^3][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md
[^2]: CURRENT_PROJECT_STATE_REPORT.md
[^3]: CONTENT_QUALITY_STANDARD.md
[^4]: ARCHITECTURE_FREEZE.md
[^5]: AENS-Knowledge-Layer-Specification.md
[^6]: https://dl.acm.org/doi/pdf/10.1145/3581784.3607033
[^7]: https://pmc.ncbi.nlm.nih.gov/articles/PMC7759461/
[^8]: https://arxiv.org/pdf/2503.00279.pdf
[^9]: https://arxiv.org/pdf/1901.03771.pdf
[^10]: https://numpy.org/doc/stable/release.html
[^11]: https://numpy.org/doc/1.24/release.html
[^12]: https://numpy.org/news/
[^13]: https://numpy.org/doc/stable/release/2.2.3-notes.html
[^14]: https://github.com/numpy/numpy/releases
[^15]: https://numpy.org/doc/stable/release/1.15.1-notes.html
[^16]: https://numpy.org/doc/stable/release/1.26.0-notes.html
[^17]: https://numpy.org/doc/stable/reference/arrays.ndarray.html
[^18]: https://numpy.org/doc/1.25/reference/generated/numpy.ndarray.__new__.html
[^19]: https://numpy.org/doc/stable/release/1.19.0-notes.html```

