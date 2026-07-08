# NumPy Package Resource

## Package Info

- **id:** `numpy`
- **title:** NumPy
- **slug:** `numpy`
- **description:** Core Python package for n-dimensional arrays and numerical computing.
- **name:** `NumPy`
- **current stable version:** `2.5`
- **summary:** NumPy is the standard Python library for fast n-dimensional arrays, vectorized computation, broadcasting, linear algebra, random sampling, and file-based array I/O. It is the default array layer for data science, machine learning, scientific computing, and numerical programming.[^1][^2]
- **install command:** `pip install numpy`
- **standard import:** `import numpy as np`
- **official sources:** [NumPy reference](https://numpy.org/doc/stable/reference/), [NumPy documentation index](https://numpy.org/doc/), [NumPy releases](https://github.com/numpy/numpy/releases)[^2][^3][^1]
- **created_at:** `2026-07-05T22:56:00+06:00`
- **updated_at:** `2026-07-05T22:56:00+06:00`


## Tasks

### 1. Create array from Python data

**Task:** Create Array
**Example:** Create Array From Python List
**Mental Trigger:** I have Python data and need a NumPy array.
**Syntax:** `np.array(object, dtype=None, copy=True, order='K', subok=False, ndmin=0, ndmax=0, like=None)`
**Important Parameters:** `object`, `dtype`, `copy`, `order`, `ndmin`
**Example:**

```python
import numpy as np

x = np.array([1, 2, 3], dtype=np.float32)
print(x, x.dtype)
```

**Use When:**

1. Converting lists, tuples, or nested sequences into arrays.
2. You need to control element type up front.
3. You want a new standalone array object.
**Avoid When:** You already have an array and only want a view or dtype-safe conversion; use `np.asarray`.
**Gotchas:**

- Default copying behavior creates a new array.
- Mixed Python types may upcast the result.
- Nested sequences may produce higher dimensions than expected.
- `dtype=object` changes downstream behavior significantly.
- `ndmin` prepends dimensions on the left.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.array.html


### 2. Convert input with minimal copying

**Task:** Coerce to Array
**Example:** Convert Existing Data Without Unnecessary Copy
**Mental Trigger:** I want NumPy semantics but may already have an array-like input.
**Syntax:** `np.asarray(a, dtype=None, order=None, *, device=None, copy=None, like=None)`
**Important Parameters:** `a`, `dtype`, `copy`, `order`, `like`
**Example:**

```python
import numpy as np

a = np.asarray([1, 2, 3], dtype=np.int64)
print(a, a.dtype)
```

**Use When:**

1. You want an ndarray but do not need a guaranteed copy.
2. You are normalizing inputs in library code.
3. You want to preserve existing array data when possible.
**Avoid When:** You need an independent buffer; use `np.array`.
**Gotchas:**

- May return the original array object.
- Copy behavior depends on the input and requested dtype/order.
- Subclass behavior differs from `np.array`.
- Mutating the result may mutate the input if no copy occurred.
- `copy=None` allows NumPy to decide.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.asarray.html


### 3. Create an uninitialized array

**Task:** Create Empty Array
**Example:** Allocate Buffer Before Filling It
**Mental Trigger:** I will overwrite every value immediately.
**Syntax:** `np.empty(shape, dtype=float, order='C', *, device=None, like=None)`
**Important Parameters:** `shape`, `dtype`, `order`, `like`, `device`
**Example:**

```python
import numpy as np

x = np.empty((2, 3), dtype=np.float64)
x.fill(0.0)
print(x)
```

**Use When:**

1. You need allocation speed and will write all elements.
2. You are building an output array in a loop.
3. You want to avoid zero-initialization overhead.
**Avoid When:** You need safe default values; use `zeros` or `full`.
**Gotchas:**

- Contents are arbitrary until you assign them.
- Reading before writing produces garbage values.
- Shape mistakes can be hard to detect.
- Faster allocation does not mean faster overall code.
- Use only when immediate overwrite is guaranteed.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.empty.html


### 4. Create a zero-filled array

**Task:** Create Zeros
**Example:** Initialize a Model Input Buffer
**Mental Trigger:** I need a clean numeric buffer with default zeros.
**Syntax:** `np.zeros(shape, dtype=float, order='C', *, like=None)`
**Important Parameters:** `shape`, `dtype`, `order`, `like`
**Example:**

```python
import numpy as np

x = np.zeros((2, 3), dtype=np.float32)
print(x)
```

**Use When:**

1. Initializing masks, counters, or feature matrices.
2. Building arrays that will be incrementally updated.
3. You need deterministic default values.
**Avoid When:** Zero is not a meaningful default and performance matters; consider `empty`.
**Gotchas:**

- Default dtype is floating point.
- Large arrays cost time to initialize.
- Use dtype carefully for integer counters.
- Shape is interpreted as dimensions, not total elements.
- `like` can redirect creation to array-API-compatible objects.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.zeros.html


### 5. Create a ones-filled array

**Task:** Create Ones
**Example:** Create a Constant Initialization Array
**Mental Trigger:** I need every element set to one.
**Syntax:** `np.ones(shape, dtype=None, order='C', *, like=None)`
**Important Parameters:** `shape`, `dtype`, `order`, `like`
**Example:**

```python
import numpy as np

x = np.ones((2, 3), dtype=np.int64)
print(x)
```

**Use When:**

1. Building indicator arrays.
2. Creating baseline multiplicative factors.
3. Initializing default weights or masks.
**Avoid When:** You need arbitrary non-one fill values; use `full`.
**Gotchas:**

- Default dtype may not be what you want.
- Integer and float behavior differ downstream.
- Large allocations still incur initialization cost.
- Often used as a building block, not an end state.
- `ones_like` is better when matching an existing array shape.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.ones.html


### 6. Create a constant-filled array

**Task:** Fill Array With Value
**Example:** Create a Sentinel-Value Matrix
**Mental Trigger:** I need every element set to the same specific value.
**Syntax:** `np.full(shape, fill_value, dtype=None, order='C', *, like=None)`
**Important Parameters:** `shape`, `fill_value`, `dtype`, `order`, `like`
**Example:**

```python
import numpy as np

x = np.full((2, 3), 7, dtype=np.int32)
print(x)
```

**Use When:**

1. Creating sentinel-filled buffers.
2. Setting a default class index or padding value.
3. Repeating a scalar across a tensor shape.
**Avoid When:** You need values derived from an existing array; use `full_like`.
**Gotchas:**

- `dtype` controls how `fill_value` is cast.
- Scalar fill values broadcast to the full shape.
- String/object fills can behave differently than numeric fills.
- Useful for padding, but padding semantics are your responsibility.
- Avoid implicit dtype surprises with integers and floats.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.full.html


### 7. Create a range of integers

**Task:** Create Range
**Example:** Build Indexed Integer Features
**Mental Trigger:** I need evenly spaced integers with a fixed step.
**Syntax:** `np.arange([start,] stop[, step,], dtype=None, *, like=None)`
**Important Parameters:** `start`, `stop`, `step`, `dtype`, `like`
**Example:**

```python
import numpy as np

x = np.arange(0, 10, 2)
print(x)
```

**Use When:**

1. Generating index vectors.
2. Creating simple discrete ranges.
3. Building test data quickly.
**Avoid When:** You need a guaranteed number of samples; use `linspace`.
**Gotchas:**

- The stop value is excluded.
- Floating-point steps can accumulate error.
- Integer dtype may overflow for large ranges.
- Shape depends on step size, not count.
- `arange` is not ideal for exact endpoint control.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.arange.html


### 8. Create evenly spaced samples

**Task:** Create Linspace
**Example:** Build a Fixed-Length Numeric Grid
**Mental Trigger:** I need a precise number of values between two endpoints.
**Syntax:** `np.linspace(start, stop, num=50, endpoint=True, retstep=False, dtype=None, axis=0)`
**Important Parameters:** `start`, `stop`, `num`, `endpoint`, `dtype`
**Example:**

```python
import numpy as np

x = np.linspace(0.0, 1.0, 5)
print(x)
```

**Use When:**

1. Sampling continuous intervals.
2. Building plotting axes or evaluation grids.
3. Generating evenly spaced test inputs.
**Avoid When:** You need integer stepping semantics; use `arange`.
**Gotchas:**

- `num` controls count, not spacing.
- `endpoint=True` includes the stop value.
- Floating-point results are approximate.
- Can return the step size with `retstep=True`.
- Do not use it when exact discrete increments matter.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.linspace.html


### 9. Create log-spaced samples

**Task:** Create Logspace
**Example:** Build a Log-Scale Hyperparameter Grid
**Mental Trigger:** I need values spaced evenly on a logarithmic scale.
**Syntax:** `np.logspace(start, stop, num=50, endpoint=True, base=10.0, dtype=None, axis=0)`
**Important Parameters:** `start`, `stop`, `num`, `base`, `endpoint`
**Example:**

```python
import numpy as np

x = np.logspace(0, 3, 4)
print(x)
```

**Use When:**

1. Sweeping learning rates or regularization values.
2. Sampling across orders of magnitude.
3. Creating exponential-axis test data.
**Avoid When:** You need linear spacing; use `linspace`.
**Gotchas:**

- Values are powers of `base`.
- Outputs are always positive for positive bases.
- Great for search grids, not for exact arithmetic intervals.
- `start` and `stop` are exponents, not final values.
- Small changes in exponents can produce large numeric differences.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.logspace.html


### 10. Create an identity matrix

**Task:** Create Identity
**Example:** Build a Square Identity Matrix
**Mental Trigger:** I need diagonal ones with zeros elsewhere.
**Syntax:** `np.eye(N, M=None, k=0, dtype=float, order='C', *, device=None, like=None)`
**Important Parameters:** `N`, `M`, `k`, `dtype`, `like`
**Example:**

```python
import numpy as np

x = np.eye(3, dtype=np.float32)
print(x)
```

**Use When:**

1. Constructing identity matrices for linear algebra.
2. Creating diagonal masks.
3. Building simple matrix benchmarks.
**Avoid When:** You need a diagonal from custom values; use `diag`.
**Gotchas:**

- `M` makes non-square matrices.
- `k` shifts the diagonal.
- Identity matrices are dense, not sparse.
- Often used in solving or regularization contexts.
- Prefer sparse alternatives for large systems.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.eye.html


### 11. Create an identity matrix by size only

**Task:** Create Identity Matrix
**Example:** Build a Square Matrix Quickly
**Mental Trigger:** I only need a square identity matrix.
**Syntax:** `np.identity(n, dtype=None, *, like=None)`
**Important Parameters:** `n`, `dtype`, `like`
**Example:**

```python
import numpy as np

x = np.identity(3, dtype=np.float64)
print(x)
```

**Use When:**

1. You want a square identity matrix.
2. You do not need off-diagonal control.
3. You want concise linear algebra setup.
**Avoid When:** You need shifted or rectangular diagonals; use `eye`.
**Gotchas:**

- Always square.
- Less flexible than `eye`.
- Dense allocation still applies.
- Mainly a convenience function.
- Often interchangeable with `eye(n)`.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.identity.html


### 12. Extract or build a diagonal

**Task:** Work With Diagonal
**Example:** Create a Diagonal Matrix From Values
**Mental Trigger:** I need to move between vector diagonals and matrices.
**Syntax:** `np.diag(v, k=0)`
**Important Parameters:** `v`, `k`
**Example:**

```python
import numpy as np

x = np.diag([1, 2, 3])
print(x)
```

**Use When:**

1. Building a matrix from diagonal values.
2. Reading a diagonal from a 2D array.
3. Shifting diagonals with offsets.
**Avoid When:** You only need a scalar band operation on large matrices; consider specialized routines.
**Gotchas:**

- 1D input creates a matrix.
- 2D input extracts a diagonal vector.
- The `k` offset shifts the diagonal.
- Result depends on input dimensionality.
- It is easy to reverse the intended direction.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.diag.html


### 13. Inspect array shape

**Task:** Read Shape
**Example:** Check Array Dimensions
**Mental Trigger:** I need to know the size of each axis.
**Syntax:** `a.shape`
**Important Parameters:** None
**Example:**

```python
import numpy as np

a = np.zeros((2, 3, 4))
print(a.shape)
```

**Use When:**

1. Validating tensor dimensions.
2. Writing conditional logic around axis sizes.
3. Debugging shape mismatches.
**Avoid When:** You need total element count; use `size`.
**Gotchas:**

- Shape is a tuple of axis lengths.
- Shape changes after reshaping or slicing.
- Zero-length axes are valid.
- Always check shape before broadcasting assumptions.
- Many downstream bugs are shape bugs.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.ndarray.shape.html


### 14. Inspect number of dimensions

**Task:** Read Number of Dimensions
**Example:** Confirm Rank of an Array
**Mental Trigger:** I need to know whether an input is scalar, vector, matrix, or higher rank.
**Syntax:** `a.ndim`
**Important Parameters:** None
**Example:**

```python
import numpy as np

a = np.array([[1, 2], [3, 4]])
print(a.ndim)
```

**Use When:**

1. Branching on scalar versus vector versus matrix input.
2. Guarding APIs that expect fixed rank.
3. Diagnosing accidental extra axes.
**Avoid When:** You need the actual axis lengths; use `shape`.
**Gotchas:**

- Scalars have `ndim == 0`.
- One-dimensional arrays are not row or column vectors.
- Extra singleton axes increase `ndim`.
- Do not infer layout from rank alone.
- Combine with `shape` for full context.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.ndarray.ndim.html


### 15. Inspect total element count

**Task:** Read Size
**Example:** Count Elements in an Array
**Mental Trigger:** I need the total number of values, not the shape.
**Syntax:** `a.size`
**Important Parameters:** None
**Example:**

```python
import numpy as np

a = np.array([[1, 2], [3, 4]])
print(a.size)
```

**Use When:**

1. Checking whether an array is empty.
2. Computing batch lengths.
3. Comparing total data volume across shapes.
**Avoid When:** You need per-axis dimensions; use `shape`.
**Gotchas:**

- Size is the product of dimensions.
- Zero-length axes make size zero.
- Size differs from memory footprint.
- Object arrays can be expensive despite small size.
- Empty arrays still have a valid size attribute.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.ndarray.size.html


### 16. Inspect dtype

**Task:** Read Data Type
**Example:** Check Array Element Type
**Mental Trigger:** I need to know the numeric type of array elements.
**Syntax:** `a.dtype`
**Important Parameters:** None
**Example:**

```python
import numpy as np

a = np.array([1, 2, 3], dtype=np.int32)
print(a.dtype)
```

**Use When:**

1. Debugging precision or casting issues.
2. Enforcing compatibility with downstream code.
3. Validating integer versus floating behavior.
**Avoid When:** You only need container type; use `type(a)`.
**Gotchas:**

- Dtype controls arithmetic behavior.
- Mixing dtypes can trigger upcasting.
- Integer overflow is dtype-dependent.
- Boolean, float, and object dtypes behave very differently.
- Many silent bugs are dtype bugs.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.ndarray.dtype.html


### 17. Inspect item size

**Task:** Read Item Size
**Example:** Check Bytes Per Element
**Mental Trigger:** I need the storage cost of one array element.
**Syntax:** `a.itemsize`
**Important Parameters:** None
**Example:**

```python
import numpy as np

a = np.array([1, 2, 3], dtype=np.int64)
print(a.itemsize)
```

**Use When:**

1. Estimating memory use.
2. Comparing dtype storage costs.
3. Debugging binary I/O layouts.
**Avoid When:** You need total memory footprint; use `nbytes`.
**Gotchas:**

- Depends entirely on dtype.
- Object dtype stores pointers, not object payloads.
- `itemsize` is per element, not per array.
- Useful for memory-sensitive systems.
- Do not confuse bytes per item with bytes per array.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.ndarray.itemsize.html


### 18. Inspect total memory footprint

**Task:** Read Nbytes
**Example:** Estimate Array Memory Use
**Mental Trigger:** I need the array payload size in bytes.
**Syntax:** `a.nbytes`
**Important Parameters:** None
**Example:**

```python
import numpy as np

a = np.zeros((100, 100), dtype=np.float32)
print(a.nbytes)
```

**Use When:**

1. Budgeting memory in data pipelines.
2. Monitoring large tensor allocations.
3. Comparing dtype and shape choices.
**Avoid When:** You need process memory, not just array storage.
**Gotchas:**

- Excludes Python object overhead.
- Object arrays underreport true memory cost.
- Views may share memory but still report their own payload.
- Very large arrays can exhaust RAM quickly.
- Memory planning matters in production pipelines.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.ndarray.nbytes.html


### 19. Reshape an array

**Task:** Reshape Array
**Example:** Change Shape Without Changing Data Order
**Mental Trigger:** I need the same data in a different shape.
**Syntax:** `np.reshape(a, newshape, order='C')`
**Important Parameters:** `a`, `newshape`, `order`, `copy`
**Example:**

```python
import numpy as np

a = np.arange(6)
b = np.reshape(a, (2, 3))
print(b)
```

**Use When:**

1. Converting flat data into batched form.
2. Preparing arrays for matrix operations.
3. Reinterpreting dimensions after loading data.
**Avoid When:** You need a guaranteed copy or flattening semantics; use `copy`-style explicit conversion or `ravel`/`flatten` as appropriate.
**Gotchas:**

- The result may be a view.
- Shape must preserve the element count.
- `order` affects element interpretation.
- Not all reshape requests are possible without copying.
- Do not rely on memory order implicitly.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.reshape.html


### 20. Flatten to a copy

**Task:** Flatten Array
**Example:** Produce a Contiguous 1D Copy
**Mental Trigger:** I need a 1D copy of the data.
**Syntax:** `a.flatten(order='C')`
**Important Parameters:** `order`
**Example:**

```python
import numpy as np

a = np.array([[1, 2], [3, 4]])
b = a.flatten()
print(b)
```

**Use When:**

1. You need an independent flattened array.
2. You are serializing or logging data safely.
3. You want to mutate the flat result without touching the original.
**Avoid When:** You want a view when possible; use `ravel`.
**Gotchas:**

- Always returns a copy.
- Memory cost can be significant for large arrays.
- Order matters.
- Copy semantics make it safer but slower.
- Overuse can create unnecessary allocations.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.ndarray.flatten.html


### 21. Flatten to a view when possible

**Task:** Ravel Array
**Example:** Get a 1D View Without Copying When Possible
**Mental Trigger:** I need a flattened representation for computation.
**Syntax:** `np.ravel(a, order='C')`
**Important Parameters:** `a`, `order`
**Example:**

```python
import numpy as np

a = np.array([[1, 2], [3, 4]])
b = np.ravel(a)
print(b)
```

**Use When:**

1. You want a fast 1D representation.
2. You can tolerate a view or copy depending on layout.
3. You are feeding data into vectorized routines.
**Avoid When:** You need guaranteed independence from the source; use `flatten`.
**Gotchas:**

- May return a view or a copy.
- Memory order affects the result.
- Mutating a view mutates the original.
- Useful for fast linear access patterns.
- Check contiguity assumptions carefully.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.ravel.html


### 22. Remove singleton dimensions

**Task:** Squeeze Array
**Example:** Drop Length-1 Axes
**Mental Trigger:** My array has extra size-1 dimensions I want removed.
**Syntax:** `np.squeeze(a, axis=None)`
**Important Parameters:** `a`, `axis`
**Example:**

```python
import numpy as np

a = np.zeros((1, 3, 1))
b = np.squeeze(a)
print(b.shape)
```

**Use When:**

1. Cleaning model outputs with singleton axes.
2. Normalizing array rank.
3. Removing accidental broadcast dimensions.
**Avoid When:** You need to preserve axis positions; keep the dimensions.
**Gotchas:**

- Only size-1 axes can be removed.
- `axis` can restrict which axes are removed.
- Over-squeezing can break later broadcasting.
- Rank changes can surprise downstream code.
- Singleton axes are sometimes semantically meaningful.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.squeeze.html


### 23. Add a new axis

**Task:** Expand Dimensions
**Example:** Turn a Vector Into a Batch Axis
**Mental Trigger:** I need to insert a length-1 dimension.
**Syntax:** `np.expand_dims(a, axis)`
**Important Parameters:** `a`, `axis`
**Example:**

```python
import numpy as np

a = np.array([1, 2, 3])
b = np.expand_dims(a, axis=0)
print(b.shape)
```

**Use When:**

1. Preparing batch dimensions.
2. Aligning shapes for broadcasting.
3. Standardizing vector inputs.
**Avoid When:** You want repeated data rather than a size-1 axis; use broadcasting or tiling patterns.
**Gotchas:**

- The new axis has length one.
- Axis positions matter for later operations.
- Can be negative-indexed.
- Easier than reshaping for simple axis insertion.
- Often used before stacking or model input formatting.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.expand_dims.html


### 24. Transpose axes

**Task:** Transpose Array
**Example:** Swap Rows and Columns
**Mental Trigger:** I need to reorder axes, often for matrix operations.
**Syntax:** `np.transpose(a, axes=None)`
**Important Parameters:** `a`, `axes`
**Example:**

```python
import numpy as np

a = np.array([[1, 2], [3, 4]])
b = np.transpose(a)
print(b)
```

**Use When:**

1. Switching between row-major and column-major style access.
2. Reordering tensor axes.
3. Preparing matrices for multiplication.
**Avoid When:** You only need a 2D matrix transpose shorthand; `a.T` is simpler.
**Gotchas:**

- For 2D arrays, it swaps rows and columns.
- For higher dimensions, it reorders axes.
- Often returns a view.
- `axes` must specify a valid permutation.
- Do not assume contiguous memory after transpose.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.transpose.html


### 25. Swap two axes

**Task:** Swap Axes
**Example:** Move Axis Order in a Tensor
**Mental Trigger:** I only need to exchange two axes.
**Syntax:** `np.swapaxes(a, axis1, axis2)`
**Important Parameters:** `a`, `axis1`, `axis2`
**Example:**

```python
import numpy as np

a = np.zeros((2, 3, 4))
b = np.swapaxes(a, 0, 2)
print(b.shape)
```

**Use When:**

1. You need a targeted axis swap.
2. You are adjusting tensor layout.
3. You want a simpler alternative to full permutation.
**Avoid When:** You need a more general axis permutation; use `transpose` or `moveaxis`.
**Gotchas:**

- Only swaps two axes.
- Output is often a view.
- Axis confusion is common in 3D+ arrays.
- Check resulting shape carefully.
- Helpful for converting channel order layouts.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.swapaxes.html


### 26. Move axes to new positions

**Task:** Move Axis
**Example:** Reposition Channel Axis
**Mental Trigger:** I need to move one or more axes without manually building a permutation.
**Syntax:** `np.moveaxis(a, source, destination)`
**Important Parameters:** `a`, `source`, `destination`
**Example:**

```python
import numpy as np

a = np.zeros((2, 3, 4))
b = np.moveaxis(a, 0, -1)
print(b.shape)
```

**Use When:**

1. Converting between channel-first and channel-last layouts.
2. Moving batch or feature axes.
3. Simplifying axis reordering code.
**Avoid When:** You want to reverse every axis; use `transpose`.
**Gotchas:**

- Source and destination can be sequences.
- Easier to read than raw axis permutations.
- Does not copy data in the common case.
- Shape changes can be non-obvious.
- Common in deep learning data pipelines.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.moveaxis.html


### 27. Concatenate arrays

**Task:** Concatenate Arrays
**Example:** Join Batches Along an Axis
**Mental Trigger:** I need to combine arrays end-to-end.
**Syntax:** `np.concatenate(arrays, axis=0, out=None, dtype=None, casting=None)`
**Important Parameters:** `arrays`, `axis`, `out`, `dtype`, `casting`
**Example:**

```python
import numpy as np

a = np.array([1, 2])
b = np.array([3, 4])
c = np.concatenate([a, b])
print(c)
```

**Use When:**

1. Appending batches with matching shapes.
2. Merging feature blocks.
3. Joining arrays along an existing axis.
**Avoid When:** You need to add a new axis before joining; use `stack`.
**Gotchas:**

- All arrays must match except along `axis`.
- Default axis is 0.
- Concatenation allocates new memory.
- Shape mismatches are a common failure mode.
- `stack` is different because it creates a new axis.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.concatenate.html


### 28. Stack arrays along a new axis

**Task:** Stack Arrays
**Example:** Build a New Batch Axis
**Mental Trigger:** I need to combine same-shaped arrays into a higher-rank array.
**Syntax:** `np.stack(arrays, axis=0, out=None, *, dtype=None, casting='same_kind')`
**Important Parameters:** `arrays`, `axis`, `dtype`, `casting`
**Example:**

```python
import numpy as np

a = np.array([1, 2])
b = np.array([3, 4])
c = np.stack([a, b], axis=0)
print(c)
```

**Use When:**

1. Creating a batch dimension from multiple samples.
2. Combining same-shaped tensors.
3. Building structured mini-batches.
**Avoid When:** You need axis-preserving joining; use `concatenate`.
**Gotchas:**

- All inputs must share the same shape.
- A new axis is created.
- `axis` controls where the new dimension appears.
- Different from concatenation even when outputs look similar.
- Useful for batching, not for appending.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.stack.html


### 29. Join arrays vertically

**Task:** Vertical Stack
**Example:** Append Rows to a Matrix
**Mental Trigger:** I want row-wise concatenation with a simple API.
**Syntax:** `np.vstack(tup, *, dtype=None, casting='same_kind')`
**Important Parameters:** `tup`, `dtype`, `casting`
**Example:**

```python
import numpy as np

a = np.array([1, 2])
b = np.array([3, 4])
c = np.vstack([a, b])
print(c)
```

**Use When:**

1. Building row batches.
2. Combining 1D inputs as rows.
3. Readable matrix assembly.
**Avoid When:** You need full axis control; use `concatenate`.
**Gotchas:**

- 1D arrays are treated as row vectors.
- Equivalent to concatenation along axis 0 in many cases.
- Can change dimensionality implicitly.
- Readability is the main benefit.
- Be explicit when shape matters.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.vstack.html


### 30. Join arrays horizontally

**Task:** Horizontal Stack
**Example:** Append Columns or 1D Values
**Mental Trigger:** I want column-wise joining with concise syntax.
**Syntax:** `np.hstack(tup, *, dtype=None, casting='same_kind')`
**Important Parameters:** `tup`, `dtype`, `casting`
**Example:**

```python
import numpy as np

a = np.array([1, 2])
b = np.array([3, 4])
c = np.hstack([a, b])
print(c)
```

**Use When:**

1. Combining 1D vectors end-to-end.
2. Building wider 2D feature tables.
3. Writing concise joining code.
**Avoid When:** You need axis-agnostic behavior; use `concatenate`.
**Gotchas:**

- Behavior differs for 1D and 2D inputs.
- Can be confusing when arrays already have multiple axes.
- Often used in feature engineering.
- Readability can hide axis mistakes.
- Check output rank after stacking.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.hstack.html


### 31. Depth stack arrays

**Task:** Depth Stack
**Example:** Combine 2D Arrays Into a 3D Tensor
**Mental Trigger:** I need to stack along a new third axis.
**Syntax:** `np.dstack(tup)`
**Important Parameters:** `tup`
**Example:**

```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
c = np.dstack([a, b])
print(c.shape)
```

**Use When:**

1. Creating channel-like depth dimensions.
2. Combining compatible arrays into 3D form.
3. Working with legacy NumPy stacking conventions.
**Avoid When:** You want explicit axis control; use `stack`.
**Gotchas:**

- The output shape can be unintuitive.
- 1D inputs are promoted before stacking.
- Mostly a convenience function.
- Easy to misuse if axis semantics matter.
- Prefer `stack` for clarity in new code.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.dstack.html


### 32. Split an array evenly

**Task:** Split Array
**Example:** Partition Data Into Equal Chunks
**Mental Trigger:** I need equal-sized pieces from one array.
**Syntax:** `np.split(ary, indices_or_sections, axis=0)`
**Important Parameters:** `ary`, `indices_or_sections`, `axis`
**Example:**

```python
import numpy as np

a = np.arange(6)
parts = np.split(a, 3)
print(parts)
```

**Use When:**

1. Breaking batches into equal pieces.
2. Partitioning data for processing stages.
3. Splitting arrays at known boundaries.
**Avoid When:** The array may not divide evenly; use `array_split`.
**Gotchas:**

- Sections must divide evenly.
- Returns views when possible.
- Shape errors are common if divisibility is wrong.
- Indices can specify exact split points.
- Useful in batch-oriented pipelines.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.split.html


### 33. Split an array unevenly

**Task:** Array Split
**Example:** Split Data Evenly-ish Even When Sizes Differ
**Mental Trigger:** My array may not divide evenly.
**Syntax:** `np.array_split(ary, indices_or_sections, axis=0)`
**Important Parameters:** `ary`, `indices_or_sections`, `axis`
**Example:**

```python
import numpy as np

a = np.arange(7)
parts = np.array_split(a, 3)
print([p.tolist() for p in parts])
```

**Use When:**

1. Partitioning data with uneven sizes.
2. Creating flexible folds.
3. Avoiding hard divisibility constraints.
**Avoid When:** You require exactly equal chunks; use `split`.
**Gotchas:**

- Chunk sizes may differ by one.
- Useful for cross-validation style splits.
- Returned pieces can differ in length.
- Pay attention to order and boundaries.
- Great for uneven batch partitioning.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.array_split.html


### 34. Select elements by condition

**Task:** Boolean Indexing
**Example:** Filter Values Above a Threshold
**Mental Trigger:** I need only elements matching a mask.
**Syntax:** `a[mask]`
**Important Parameters:** `a`, `mask`
**Example:**

```python
import numpy as np

a = np.array([1, 2, 3, 4])
mask = a % 2 == 0
print(a[mask])
```

**Use When:**

1. Filtering rows or elements.
2. Extracting anomalies or positives.
3. Applying condition-based selection.
**Avoid When:** You need positional selection regardless of value; use `take` or integer indexing.
**Gotchas:**

- Mask shape must align.
- Result is flattened across selected elements.
- Chained boolean logic requires parentheses.
- Very common source of shape bugs.
- Masked selection copies data.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.ndarray.__getitem__.html


### 35. Select elements by position list

**Task:** Fancy Indexing
**Example:** Pick Arbitrary Rows by Index
**Mental Trigger:** I need non-contiguous positions from an array.
**Syntax:** `a[index]`
**Important Parameters:** `a`, `index`
**Example:**

```python
import numpy as np

a = np.array([10, 20, 30, 40])
idx = [3, 1]
print(a[idx])
```

**Use When:**

1. Reordering or subsetting by explicit indices.
2. Gathering specific rows or samples.
3. Implementing lookup tables.
**Avoid When:** You are selecting by condition; use boolean masks.
**Gotchas:**

- Returns a copy, not a view.
- Index arrays can change result shape.
- Repeated indices are allowed.
- Great for gather operations.
- Easy to confuse with slicing.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.ndarray.__getitem__.html


### 36. Conditional selection

**Task:** Use Where
**Example:** Choose Between Two Arrays Elementwise
**Mental Trigger:** I need an elementwise if-else.
**Syntax:** `np.where(condition, x, y)`
**Important Parameters:** `condition`, `x`, `y`
**Example:**

```python
import numpy as np

a = np.array([1, 2, 3, 4])
b = np.where(a % 2 == 0, a, -a)
print(b)
```

**Use When:**

1. Replacing values based on a condition.
2. Building piecewise array transforms.
3. Selecting between two computed branches.
**Avoid When:** You need indices of true elements only; use `nonzero`.
**Gotchas:**

- All branches are typically evaluated before selection.
- Broadcasting applies to `condition`, `x`, and `y`.
- Scalar branches are often enough.
- Very common in feature engineering.
- Readability drops with deeply nested conditions.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.where.html


### 37. Find nonzero entries

**Task:** Find Nonzero
**Example:** Get Indices of True or Nonzero Values
**Mental Trigger:** I need positions of selected elements.
**Syntax:** `np.nonzero(a)`
**Important Parameters:** `a`
**Example:**

```python
import numpy as np

a = np.array([0, 1, 0, 2])
print(np.nonzero(a))
```

**Use When:**

1. Locating active mask positions.
2. Finding sparse-like coordinates.
3. Extracting index tuples from conditions.
**Avoid When:** You just need a boolean mask; keep the mask itself.
**Gotchas:**

- Returns index arrays, one per axis.
- For 1D arrays, result is a tuple.
- Often paired with `where(condition)`.
- Results are ordered by scan order.
- Useful for sparse-like workflows.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.nonzero.html


### 38. Gather elements by index

**Task:** Take Elements
**Example:** Pull Values From Specific Positions
**Mental Trigger:** I have index positions and want those values along an axis.
**Syntax:** `np.take(a, indices, axis=None, out=None, mode='raise')`
**Important Parameters:** `a`, `indices`, `axis`, `mode`
**Example:**

```python
import numpy as np

a = np.array([10, 20, 30, 40])
print(np.take(a, [3, 1]))
```

**Use When:**

1. Implementing gather-like selection.
2. Selecting along a known axis.
3. Needing index-based access with explicit mode handling.
**Avoid When:** A plain indexing expression is simpler and sufficient.
**Gotchas:**

- `axis=None` flattens first.
- `mode` controls out-of-bounds behavior.
- Often clearer than advanced indexing in axis-specific code.
- Result shape depends on indices.
- Easy to misuse if axis is omitted.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.take.html


### 39. Write values by index

**Task:** Put Elements
**Example:** Scatter Values Into an Array
**Mental Trigger:** I need to assign values at specified positions.
**Syntax:** `np.put(a, ind, v, mode='raise')`
**Important Parameters:** `a`, `ind`, `v`, `mode`
**Example:**

```python
import numpy as np

a = np.zeros(5, dtype=int)
np.put(a, [1, 3], [7, 9])
print(a)
```

**Use When:**

1. Scattering values into a flat array.
2. Updating positions in-place.
3. Building output buffers from indices.
**Avoid When:** You need structured axis-aware assignment; use direct indexing.
**Gotchas:**

- Works on the flattened version by default.
- Mutates the input array in place.
- `mode` affects out-of-bounds handling.
- Less commonly used than indexing assignment.
- Can be surprising if you expect axis-aware scatter.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.put.html


### 40. Clip values to a range

**Task:** Clip Values
**Example:** Bound Outliers to a Safe Range
**Mental Trigger:** I need to clamp values to minimum and maximum limits.
**Syntax:** `np.clip(a, a_min, a_max, out=None, *, min=None, max=None)`
**Important Parameters:** `a`, `a_min`, `a_max`, `out`, `min`
**Example:**

```python
import numpy as np

a = np.array([-2, 0, 5, 12])
print(np.clip(a, 0, 10))
```

**Use When:**

1. Limiting numeric ranges.
2. Preventing overflow-like extremes.
3. Bounding model inputs or outputs.
**Avoid When:** You need thresholding into categories; use `where` or boolean logic.
**Gotchas:**

- Works elementwise.
- `a_min` and `a_max` define closed bounds.
- Can be done in place with `out`.
- Often used in preprocessing.
- Watch dtype interactions when clipping integers and floats.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.clip.html


### 41. Sum values

**Task:** Sum Array
**Example:** Compute a Total
**Mental Trigger:** I need an aggregate total over one or more axes.
**Syntax:** `np.sum(a, axis=None, dtype=None, out=None, keepdims=False, initial=0)`
**Important Parameters:** `a`, `axis`, `dtype`, `keepdims`, `initial`
**Example:**

```python
import numpy as np

a = np.array([[1, 2], [3, 4]])
print(np.sum(a))
```

**Use When:**

1. Computing totals and reductions.
2. Aggregating features over axes.
3. Summarizing batch values.
**Avoid When:** You need average or spread; use `mean` or `std`.
**Gotchas:**

- Axis selection changes the meaning dramatically.
- `keepdims=True` preserves reduced axes.
- Dtype affects overflow and precision.
- Empty reductions need careful handling.
- Reduction bugs are often axis bugs.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.sum.html


### 42. Compute mean

**Task:** Mean
**Example:** Average Values Across an Axis
**Mental Trigger:** I need the arithmetic average.
**Syntax:** `np.mean(a, axis=None, dtype=None, out=None, keepdims=False)`
**Important Parameters:** `a`, `axis`, `dtype`, `keepdims`, `out`
**Example:**

```python
import numpy as np

a = np.array([[1, 2], [3, 4]])
print(np.mean(a, axis=0))
```

**Use When:**

1. Normalizing data.
2. Summarizing batch statistics.
3. Computing feature averages.
**Avoid When:** You need robustness to outliers; use `median`.
**Gotchas:**

- Sensitive to outliers.
- Integer inputs often produce float outputs.
- Axis choice matters.
- `keepdims` helps broadcasting later.
- Mean is not always the right central tendency.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.mean.html


### 43. Compute median

**Task:** Median
**Example:** Get the Robust Center
**Mental Trigger:** I need a center value that resists outliers.
**Syntax:** `np.median(a, axis=None, out=None, overwrite_input=False, keepdims=False)`
**Important Parameters:** `a`, `axis`, `overwrite_input`, `keepdims`
**Example:**

```python
import numpy as np

a = np.array([1, 100, 2, 3])
print(np.median(a))
```

**Use When:**

1. Summarizing skewed data.
2. Robust feature statistics.
3. Outlier-resistant aggregation.
**Avoid When:** You need differentiable smooth averages; use `mean`.
**Gotchas:**

- More robust than mean.
- Sorting-like cost can be higher than mean.
- `overwrite_input=True` can mutate input.
- Even-sized arrays average the middle pair.
- Axis handling mirrors other reducers.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.median.html


### 44. Compute standard deviation

**Task:** Standard Deviation
**Example:** Measure Spread
**Mental Trigger:** I need dispersion around the mean.
**Syntax:** `np.std(a, axis=None, dtype=None, out=None, ddof=0, keepdims=False)`
**Important Parameters:** `a`, `axis`, `ddof`, `keepdims`, `dtype`
**Example:**

```python
import numpy as np

a = np.array([1, 2, 3, 4])
print(np.std(a))
```

**Use When:**

1. Measuring variability.
2. Standardizing features.
3. Monitoring distribution shifts.
**Avoid When:** You need variance directly for algebraic reasons; use `var`.
**Gotchas:**

- `ddof` changes the denominator.
- Sensitive to outliers.
- Result precision depends on dtype.
- `keepdims` simplifies broadcasting.
- Variance and standard deviation are easy to confuse.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.std.html


### 45. Compute variance

**Task:** Variance
**Example:** Measure Squared Spread
**Mental Trigger:** I need dispersion in squared units.
**Syntax:** `np.var(a, axis=None, dtype=None, out=None, ddof=0, keepdims=False)`
**Important Parameters:** `a`, `axis`, `ddof`, `keepdims`, `dtype`
**Example:**

```python
import numpy as np

a = np.array([1, 2, 3, 4])
print(np.var(a))
```

**Use When:**

1. Computing statistical spread.
2. Building normalization pipelines.
3. Comparing variability across features.
**Avoid When:** You want interpretable units; use `std`.
**Gotchas:**

- In squared units, not original units.
- `ddof` affects sample vs population formulas.
- Can be numerically sensitive for large values.
- Commonly paired with mean.
- Usually not the final metric engineers report.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.var.html


### 46. Find minimum

**Task:** Minimum
**Example:** Find the Smallest Value
**Mental Trigger:** I need the lowest value in an array.
**Syntax:** `np.min(a, axis=None, out=None, keepdims=False, initial=<no value>, where=True)`
**Important Parameters:** `a`, `axis`, `keepdims`, `initial`, `where`
**Example:**

```python
import numpy as np

a = np.array([3, 1, 4])
print(np.min(a))
```

**Use When:**

1. Bounding lower ranges.
2. Checking data quality.
3. Computing extremal statistics.
**Avoid When:** You need the position of the minimum; use `argmin`.
**Gotchas:**

- NaNs can affect results unless handled separately.
- Axis selection changes interpretation.
- `keepdims` helps with broadcasting.
- `initial` is useful for empty-like reductions.
- Minimum and argmin answer different questions.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.min.html


### 47. Find maximum

**Task:** Maximum
**Example:** Find the Largest Value
**Mental Trigger:** I need the highest value in an array.
**Syntax:** `np.max(a, axis=None, out=None, keepdims=False, initial=<no value>, where=True)`
**Important Parameters:** `a`, `axis`, `keepdims`, `initial`, `where`
**Example:**

```python
import numpy as np

a = np.array([3, 1, 4])
print(np.max(a))
```

**Use When:**

1. Computing upper bounds.
2. Measuring peak values.
3. Validating output ranges.
**Avoid When:** You need the index of the maximum; use `argmax`.
**Gotchas:**

- NaNs can propagate or interfere.
- Axis semantics matter.
- `keepdims` preserves dimension structure.
- Useful in normalization and clipping logic.
- Distinguish value extraction from index extraction.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.max.html


### 48. Find index of minimum

**Task:** Argmin
**Example:** Locate the Smallest Element
**Mental Trigger:** I need the position of the minimum value.
**Syntax:** `np.argmin(a, axis=None, out=None, *, keepdims=<no value>)`
**Important Parameters:** `a`, `axis`, `keepdims`, `out`
**Example:**

```python
import numpy as np

a = np.array([3, 1, 4])
print(np.argmin(a))
```

**Use When:**

1. Selecting the lowest-scoring item.
2. Routing to best candidate indices.
3. Finding earliest minimum along an axis.
**Avoid When:** You need the actual minimum value; use `min`.
**Gotchas:**

- Returns an index, not a value.
- Ties resolve to the first occurrence.
- Axis choice changes index interpretation.
- Flattening behavior can surprise you.
- Useful in selection and ranking pipelines.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.argmin.html


### 49. Find index of maximum

**Task:** Argmax
**Example:** Locate the Largest Element
**Mental Trigger:** I need the position of the maximum value.
**Syntax:** `np.argmax(a, axis=None, out=None, *, keepdims=<no value>)`
**Important Parameters:** `a`, `axis`, `keepdims`, `out`
**Example:**

```python
import numpy as np

a = np.array([3, 1, 4])
print(np.argmax(a))
```

**Use When:**

1. Choosing the top-scoring prediction.
2. Selecting best candidates.
3. Finding maximum positions per axis.
**Avoid When:** You need the maximum value itself; use `max`.
**Gotchas:**

- Returns the first maximum on ties.
- Axis selection changes the output shape.
- Common in classification and retrieval logic.
- Flattening can hide axis mistakes.
- Values and indices are different outputs.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.argmax.html


### 50. Compute percentile

**Task:** Percentile
**Example:** Measure a Quantile Threshold
**Mental Trigger:** I need a value at a specific rank percentile.
**Syntax:** `np.percentile(a, q, axis=None, out=None, overwrite_input=False, method='linear', keepdims=False)`
**Important Parameters:** `a`, `q`, `axis`, `method`, `keepdims`
**Example:**

```python
import numpy as np

a = np.array([1, 2, 3, 4, 100])
print(np.percentile(a, 90))
```

**Use When:**

1. Computing thresholds and cutoffs.
2. Describing tail behavior.
3. Robust summary statistics.
**Avoid When:** You need median specifically; use `median`.
**Gotchas:**

- Different methods can change results.
- Percentile is interpolation-based for many inputs.
- Highly sensitive to parameter choice at small sample sizes.
- Useful for clipping and QA thresholds.
- Percentiles are not counts.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.percentile.html


### 51. Compute quantile

**Task:** Quantile
**Example:** Ask for the 0.9 Quantile Directly
**Mental Trigger:** I prefer normalized percentile values between 0 and 1.
**Syntax:** `np.quantile(a, q, axis=None, out=None, overwrite_input=False, method='linear', keepdims=False)`
**Important Parameters:** `a`, `q`, `axis`, `method`, `keepdims`
**Example:**

```python
import numpy as np

a = np.array([1, 2, 3, 4, 100])
print(np.quantile(a, 0.9))
```

**Use When:**

1. Statistical thresholding.
2. Building robust feature rules.
3. Expressing rank-based cutoffs in normalized form.
**Avoid When:** You think in percentages rather than proportions; use `percentile`.
**Gotchas:**

- `q` is between 0 and 1.
- Interpolation method matters.
- Common in outlier handling.
- Often easier to compose programmatically than percentile.
- Easy to confuse with percentile units.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.quantile.html


### 52. Matrix multiply / dot product

**Task:** Matrix Multiply
**Example:** Multiply Compatible Matrices
**Mental Trigger:** I need linear algebra multiplication semantics.
**Syntax:** `np.matmul(x1, x2, /)`
**Important Parameters:** `x1`, `x2`
**Example:**

```python
import numpy as np

a = np.array([[1, 2], [3, 4]])
b = np.array([[^5], [^6]])
print(np.matmul(a, b))
```

**Use When:**

1. Matrix multiplication in ML and scientific computing.
2. Batched linear algebra.
3. Applying linear transforms.
**Avoid When:** You want elementwise multiplication; use `*`.
**Gotchas:**

- Not the same as elementwise multiply.
- Batch dimensions are supported.
- 1D input behaves differently from 2D input.
- Shape compatibility is strict.
- The `@` operator uses the same semantics.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.matmul.html


### 53. Invert a matrix

**Task:** Matrix Inverse
**Example:** Compute the Inverse of a Square Matrix
**Mental Trigger:** I need the inverse of a small, well-conditioned square matrix.
**Syntax:** `np.linalg.inv(a)`
**Important Parameters:** `a`
**Example:**

```python
import numpy as np

a = np.array([[1.0, 2.0], [3.0, 4.0]])
print(np.linalg.inv(a))
```

**Use When:**

1. Solving linear algebra problems explicitly requiring inversion.
2. Testing matrix conditioning.
3. Working with small dense square systems.
**Avoid When:** You can solve a linear system directly; use `solve`.
**Gotchas:**

- Requires a square, invertible matrix.
- Numerically less stable than solving directly.
- Singular matrices fail.
- Inverse is often unnecessary in production code.
- Use with caution on ill-conditioned inputs.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.linalg.inv.html


### 54. Compute determinant

**Task:** Determinant
**Example:** Measure Matrix Volume Scaling
**Mental Trigger:** I need the determinant of a square matrix.
**Syntax:** `np.linalg.det(a)`
**Important Parameters:** `a`
**Example:**

```python
import numpy as np

a = np.array([[1.0, 2.0], [3.0, 4.0]])
print(np.linalg.det(a))
```

**Use When:**

1. Checking invertibility heuristics.
2. Measuring signed volume scaling.
3. Working with characteristic matrix properties.
**Avoid When:** You need a solve step or inverse directly; use those instead.
**Gotchas:**

- Determinant near zero suggests singularity.
- Can be numerically unstable for large matrices.
- Not a general-purpose quality metric.
- Only defined for square matrices.
- Small floating errors can change sign near zero.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.linalg.det.html


### 55. Solve a linear system

**Task:** Solve Linear System
**Example:** Solve $Ax = b$ Without Inverting $A$
**Mental Trigger:** I have coefficients and a right-hand side vector.
**Syntax:** `np.linalg.solve(a, b)`
**Important Parameters:** `a`, `b`
**Example:**

```python
import numpy as np

a = np.array([[3.0, 1.0], [1.0, 2.0]])
b = np.array([9.0, 8.0])
print(np.linalg.solve(a, b))
```

**Use When:**

1. Solving dense linear systems.
2. Replacing explicit inversion.
3. Computing exact coefficients in small systems.
**Avoid When:** You only need a least-squares fit or an over/under-determined system; use `lstsq`.
**Gotchas:**

- `a` must be square and non-singular.
- More stable than `inv(a) @ b`.
- Shape of `b` affects output shape.
- Batched systems are supported in modern NumPy.
- A common source of errors is mismatched dimensions.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.linalg.solve.html


### 56. Compute matrix norm

**Task:** Norm
**Example:** Measure Vector or Matrix Magnitude
**Mental Trigger:** I need a length or size measure for an array.
**Syntax:** `np.linalg.norm(x, ord=None, axis=None, keepdims=False)`
**Important Parameters:** `x`, `ord`, `axis`, `keepdims`
**Example:**

```python
import numpy as np

x = np.array([3.0, 4.0])
print(np.linalg.norm(x))
```

**Use When:**

1. Measuring vector magnitude.
2. Regularizing model parameters.
3. Comparing matrix scale.
**Avoid When:** You need a specific elementwise aggregate; use `sum` or `max`.
**Gotchas:**

- Different `ord` values change the meaning.
- Vector and matrix norms behave differently.
- `axis` can target specific dimensions.
- Default is usually the Euclidean norm.
- Norm choice should match the math, not habit.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.linalg.norm.html


### 57. Compute eigenvalues

**Task:** Eigenvalues
**Example:** Get Eigenvalues of a Square Matrix
**Mental Trigger:** I need spectral information from a dense square matrix.
**Syntax:** `np.linalg.eigvals(a)`
**Important Parameters:** `a`
**Example:**

```python
import numpy as np

a = np.array([[1.0, 2.0], [2.0, 1.0]])
print(np.linalg.eigvals(a))
```

**Use When:**

1. Analyzing matrix spectrum.
2. Studying stability properties.
3. Working with low-dimensional dense matrices.
**Avoid When:** You need full eigenvectors too; use `eig`.
**Gotchas:**

- Only for square matrices.
- Results may be complex even for real matrices.
- Numerical ordering is not guaranteed.
- Eigenvalues can be sensitive to perturbations.
- Often not needed in everyday production code.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.linalg.eigvals.html


### 58. Generate random numbers with a modern generator

**Task:** Use Default RNG
**Example:** Create a Reproducible Random Generator
**Mental Trigger:** I need random numbers with explicit control over state.
**Syntax:** `np.random.default_rng(seed=None)`
**Important Parameters:** `seed`
**Example:**

```python
import numpy as np

rng = np.random.default_rng(42)
print(rng.integers(0, 10, size=5))
```

**Use When:**

1. Building reproducible experiments.
2. Sampling in modern NumPy code.
3. Isolating random state from global RNG.
**Avoid When:** You are using legacy code that depends on global random state; migrate carefully.
**Gotchas:**

- Prefer this over the legacy global generator.
- Seeding controls reproducibility.
- Use one generator per experiment or pipeline stage.
- Random streams differ from older APIs.
- Do not mix old and new random APIs casually.
**Official Documentation:** https://numpy.org/doc/stable/reference/random/generator.html


### 59. Draw random integers

**Task:** Random Integers
**Example:** Sample Integer Classes
**Mental Trigger:** I need uniformly sampled integers.
**Syntax:** `rng.integers(low, high=None, size=None, dtype=np.int64, endpoint=False)`
**Important Parameters:** `low`, `high`, `size`, `dtype`, `endpoint`
**Example:**

```python
import numpy as np

rng = np.random.default_rng(42)
print(rng.integers(0, 10, size=5))
```

**Use When:**

1. Sampling indices.
2. Building synthetic categorical data.
3. Creating randomized test inputs.
**Avoid When:** You need floating-point randomness; use `random` or distribution methods.
**Gotchas:**

- `high` is exclusive by default.
- Works with vectorized sizes.
- Endpoint behavior changes the interval.
- Integer dtype matters for platform compatibility.
- Great for indices, not for continuous values.
**Official Documentation:** https://numpy.org/doc/stable/reference/random/generated/numpy.random.Generator.integers.html


### 60. Sample from a list of choices

**Task:** Random Choice
**Example:** Pick Random Elements From a Population
**Mental Trigger:** I need random selection from a discrete set.
**Syntax:** `rng.choice(a, size=None, replace=True, p=None, axis=0, shuffle=True)`
**Important Parameters:** `a`, `size`, `replace`, `p`, `axis`
**Example:**

```python
import numpy as np

rng = np.random.default_rng(42)
print(rng.choice([10, 20, 30], size=5, replace=True))
```

**Use When:**

1. Sampling labels or items.
2. Bootstrapping data.
3. Building randomized baselines.
**Avoid When:** You need a permutation of all elements; use `permutation`.
**Gotchas:**

- `replace=False` limits repeated items.
- Probabilities in `p` must sum correctly.
- Sampling from arrays can be axis-aware.
- Very common in data resampling workflows.
- Choice semantics depend on replacement and axis.
**Official Documentation:** https://numpy.org/doc/stable/reference/random/generated/numpy.random.Generator.choice.html


### 61. Permute a sequence

**Task:** Random Permutation
**Example:** Shuffle a Range of Indices
**Mental Trigger:** I need a random ordering of all items.
**Syntax:** `rng.permutation(x)`
**Important Parameters:** `x`
**Example:**

```python
import numpy as np

rng = np.random.default_rng(42)
print(rng.permutation(5))
```

**Use When:**

1. Shuffling indices for train-test splits.
2. Randomizing data order.
3. Creating permutations without replacement.
**Avoid When:** You only need an in-place shuffle of an existing array; use `shuffle`.
**Gotchas:**

- Returns a permuted copy.
- Works on integers or arrays.
- Does not preserve order.
- Useful for shuffling labels and indices together.
- Distinguish from sampling with replacement.
**Official Documentation:** https://numpy.org/doc/stable/reference/random/generated/numpy.random.Generator.permutation.html


### 62. Shuffle an array in place

**Task:** Shuffle In Place
**Example:** Randomize Array Order
**Mental Trigger:** I need to reorder an array without allocating a new one.
**Syntax:** `rng.shuffle(x)`
**Important Parameters:** `x`
**Example:**

```python
import numpy as np

rng = np.random.default_rng(42)
a = np.array([1, 2, 3, 4])
rng.shuffle(a)
print(a)
```

**Use When:**

1. Shuffling training data in place.
2. Reducing allocation overhead.
3. Randomizing order before batching.
**Avoid When:** You need the original ordering preserved; use `permutation`.
**Gotchas:**

- Mutates the array.
- Output depends on RNG state.
- Not appropriate when original data must stay unchanged.
- Faster than creating a separate permuted copy.
- Easy to accidentally reuse the shuffled source later.
**Official Documentation:** https://numpy.org/doc/stable/reference/random/generated/numpy.random.Generator.shuffle.html


### 63. Sample from a normal distribution

**Task:** Sample Normal
**Example:** Generate Gaussian Noise
**Mental Trigger:** I need normally distributed random values.
**Syntax:** `rng.normal(loc=0.0, scale=1.0, size=None)`
**Important Parameters:** `loc`, `scale`, `size`
**Example:**

```python
import numpy as np

rng = np.random.default_rng(42)
print(rng.normal(0.0, 1.0, size=5))
```

**Use When:**

1. Creating noise.
2. Simulating measurements.
3. Initializing stochastic experiments.
**Avoid When:** You need bounded values or uniform noise; use `uniform`.
**Gotchas:**

- `scale` is standard deviation.
- Results are unbounded.
- Shape and dtype should be chosen carefully.
- Common in Monte Carlo and ML workflows.
- Random draws vary run to run unless seeded.
**Official Documentation:** https://numpy.org/doc/stable/reference/random/generated/numpy.random.Generator.normal.html


### 64. Sample from a uniform distribution

**Task:** Sample Uniform
**Example:** Generate Random Values in an Interval
**Mental Trigger:** I need values spread evenly across a range.
**Syntax:** `rng.uniform(low=0.0, high=1.0, size=None)`
**Important Parameters:** `low`, `high`, `size`
**Example:**

```python
import numpy as np

rng = np.random.default_rng(42)
print(rng.uniform(0.0, 1.0, size=5))
```

**Use When:**

1. Initializing random baselines.
2. Simulating bounded continuous values.
3. Drawing random inputs for testing.
**Avoid When:** You need integer values; use `integers`.
**Gotchas:**

- Output is half-open on the upper end in practical terms.
- Suitable for bounded continuous ranges.
- Common in synthetic data generation.
- `low` can exceed `high` only if you intend reversed intervals carefully.
- Uniform is not the same as normal noise.
**Official Documentation:** https://numpy.org/doc/stable/reference/random/generated/numpy.random.Generator.uniform.html


### 65. Sort values

**Task:** Sort Array
**Example:** Order Elements Ascending
**Mental Trigger:** I need values sorted along an axis.
**Syntax:** `np.sort(a, axis=-1, kind=None, order=None, *, stable=None)`
**Important Parameters:** `a`, `axis`, `kind`, `order`, `stable`
**Example:**

```python
import numpy as np

a = np.array([3, 1, 2])
print(np.sort(a))
```

**Use When:**

1. Ranking values.
2. Preparing median or percentile-like operations manually.
3. Ordering elements along an axis.
**Avoid When:** You only need the sort permutation; use `argsort`.
**Gotchas:**

- Returns a sorted copy.
- Axis selection matters.
- Stable ordering can matter for ties.
- Sorting object arrays can be slower.
- Do not confuse sorting values with indices.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.sort.html


### 66. Get sorting indices

**Task:** Argsort
**Example:** Compute the Order of Elements
**Mental Trigger:** I need indices that would sort the array.
**Syntax:** `np.argsort(a, axis=-1, kind=None, order=None, *, stable=None)`
**Important Parameters:** `a`, `axis`, `kind`, `order`, `stable`
**Example:**

```python
import numpy as np

a = np.array([3, 1, 2])
print(np.argsort(a))
```

**Use When:**

1. Ranking examples or predictions.
2. Reordering aligned arrays.
3. Building custom top-k logic.
**Avoid When:** You only need sorted values; use `sort`.
**Gotchas:**

- Returns index positions, not sorted data.
- Useful for consistent reordering of multiple arrays.
- Stable ordering can matter for ties.
- Often paired with `take`.
- Axis semantics matter in higher dimensions.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.argsort.html


### 67. Find unique values

**Task:** Unique Values
**Example:** Deduplicate an Array
**Mental Trigger:** I need the distinct items in an array.
**Syntax:** `np.unique(ar, return_index=False, return_inverse=False, return_counts=False, axis=None, equal_nan=True, sorted=True)`
**Important Parameters:** `ar`, `return_counts`, `return_inverse`, `axis`, `equal_nan`
**Example:**

```python
import numpy as np

a = np.array([1, 2, 2, 3, 1])
print(np.unique(a))
```

**Use When:**

1. Deduplicating labels or categories.
2. Counting value frequencies.
3. Building compact encodings.
**Avoid When:** You need first-seen order preserved; handle ordering separately.
**Gotchas:**

- Output is typically sorted.
- Can also return counts and inverse mappings.
- NaN handling has dedicated behavior.
- Often useful in preprocessing and analysis.
- Do not assume input order is preserved.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.unique.html


### 68. Check whether all values satisfy a condition

**Task:** All
**Example:** Verify Every Element Is Positive
**Mental Trigger:** I need a universal truth check over an array.
**Syntax:** `np.all(a, axis=None, out=None, keepdims=False, *, where=True)`
**Important Parameters:** `a`, `axis`, `keepdims`, `where`
**Example:**

```python
import numpy as np

a = np.array([1, 2, 3])
print(np.all(a > 0))
```

**Use When:**

1. Validating that a condition holds everywhere.
2. Checking data quality constraints.
3. Confirming masks are fully satisfied.
**Avoid When:** You need to know whether any element satisfies the condition; use `any`.
**Gotchas:**

- Reduces boolean arrays to one truth value or axis result.
- Empty inputs can produce unintuitive truth values.
- `keepdims` supports later broadcasting.
- Strongly tied to condition validation logic.
- Easy to mix up with Python `all`.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.all.html


### 69. Check whether any value satisfies a condition

**Task:** Any
**Example:** Detect Presence of a Match
**Mental Trigger:** I need to know whether at least one element passes a test.
**Syntax:** `np.any(a, axis=None, out=None, keepdims=False, *, where=True)`
**Important Parameters:** `a`, `axis`, `keepdims`, `where`
**Example:**

```python
import numpy as np

a = np.array([1, 2, 3])
print(np.any(a > 2))
```

**Use When:**

1. Detecting anomalies or sentinel values.
2. Triggering conditional branches.
3. Checking for at least one valid entry.
**Avoid When:** You need every value to satisfy a condition; use `all`.
**Gotchas:**

- Reduces to a truth value or axis result.
- `keepdims` helps preserve shape.
- Often used with masks and missing-data logic.
- Empty-input semantics are easy to overlook.
- Very common in validation code.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.any.html


### 70. Compute logical conjunction

**Task:** Logical And
**Example:** Combine Two Boolean Masks
**Mental Trigger:** I need both conditions to be true.
**Syntax:** `np.logical_and(x1, x2, /, out=None, *, where=True, casting='same_kind', order='K', dtype=None, subok=True)`
**Important Parameters:** `x1`, `x2`, `out`, `where`
**Example:**

```python
import numpy as np

a = np.array([True, False, True])
b = np.array([True, True, False])
print(np.logical_and(a, b))
```

**Use When:**

1. Combining boolean filters.
2. Building compound validation rules.
3. Masking values with multiple conditions.
**Avoid When:** A single chained comparison is enough and readable.
**Gotchas:**

- Parentheses are still needed with comparison expressions.
- Broadcasts like other ufuncs.
- Works on non-boolean inputs via truthiness rules.
- The `&` operator is common but more syntax-sensitive.
- Common source of precedence mistakes.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.logical_and.html


### 71. Compute logical disjunction

**Task:** Logical Or
**Example:** Combine Alternative Boolean Conditions
**Mental Trigger:** I need at least one of two conditions to be true.
**Syntax:** `np.logical_or(x1, x2, /, out=None, *, where=True, casting='same_kind', order='K', dtype=None, subok=True)`
**Important Parameters:** `x1`, `x2`, `out`, `where`
**Example:**

```python
import numpy as np

a = np.array([True, False, True])
b = np.array([False, False, True])
print(np.logical_or(a, b))
```

**Use When:**

1. Merging inclusion rules.
2. Flagging any of multiple conditions.
3. Building fallback masks.
**Avoid When:** You need all conditions to hold; use `logical_and`.
**Gotchas:**

- Broadcasts across shapes.
- Works naturally with boolean arrays.
- Operator precedence can be tricky with `|`.
- Can be combined with masks for data cleaning.
- Easy to accidentally broaden selection too much.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.logical_or.html


### 72. Check for NaN

**Task:** Is NaN
**Example:** Detect Missing Numeric Values
**Mental Trigger:** I need to identify NaN entries.
**Syntax:** `np.isnan(x, /, out=None, *, where=True, casting='same_kind', order='K', dtype=None, subok=True)`
**Important Parameters:** `x`, `out`, `where`
**Example:**

```python
import numpy as np

a = np.array([1.0, np.nan, 3.0])
print(np.isnan(a))
```

**Use When:**

1. Validating numerical data.
2. Finding missing float entries.
3. Building missing-value masks.
**Avoid When:** You want to detect infinities too; use `isfinite`.
**Gotchas:**

- NaN is only relevant for floating types and complex components.
- NaN does not compare equal to itself.
- Common in scientific data pipelines.
- Combine with masking or imputation logic.
- Missing-value handling often starts here.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.isnan.html


### 73. Check for finite values

**Task:** Is Finite
**Example:** Filter Out Inf and NaN
**Mental Trigger:** I need to ensure values are neither NaN nor infinite.
**Syntax:** `np.isfinite(x, /, out=None, *, where=True, casting='same_kind', order='K', dtype=None, subok=True)`
**Important Parameters:** `x`, `out`, `where`
**Example:**

```python
import numpy as np

a = np.array([1.0, np.nan, np.inf, 3.0])
print(np.isfinite(a))
```

**Use When:**

1. Sanitizing numeric data.
2. Validating model inputs.
3. Rejecting invalid arithmetic results.
**Avoid When:** You only care about NaN specifically; use `isnan`.
**Gotchas:**

- Captures both NaN and infinities.
- Useful after divisions or exponentials.
- Works elementwise.
- Often used before saving or feeding models.
- A core data-quality check in production.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.isfinite.html


### 74. Save an array to disk

**Task:** Save Array
**Example:** Persist a Single Array as Binary
**Mental Trigger:** I need to write one array to a file for later loading.
**Syntax:** `np.save(file, arr, allow_pickle=True, fix_imports=<no value>)`
**Important Parameters:** `file`, `arr`, `allow_pickle`
**Example:**

```python
import numpy as np

a = np.array([1, 2, 3])
np.save("array.npy", a)
b = np.load("array.npy")
print(b)
```

**Use When:**

1. Persisting a single ndarray.
2. Caching intermediate numeric results.
3. Sharing arrays between Python runs.
**Avoid When:** You need multiple named arrays in one file; use `savez`.
**Gotchas:**

- Produces NumPy’s binary `.npy` format.
- `allow_pickle` has security implications.
- Best for NumPy arrays, not arbitrary objects.
- Load requires compatible dtype handling.
- Keep versioned file formats in mind for long-term storage.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.save.html


### 75. Load an array from disk

**Task:** Load Array
**Example:** Read a Saved Binary Array
**Mental Trigger:** I need to restore an array saved in `.npy` format.
**Syntax:** `np.load(file, mmap_mode=None, allow_pickle=False, fix_imports=True, encoding='ASCII', *, max_header_size=10000)`
**Important Parameters:** `file`, `mmap_mode`, `allow_pickle`, `encoding`, `max_header_size`
**Example:**

```python
import numpy as np

a = np.array([1, 2, 3])
np.save("array.npy", a)
b = np.load("array.npy")
print(b)
```

**Use When:**

1. Reloading cached arrays.
2. Reading `.npy` and `.npz` files.
3. Memory-mapping large arrays on disk.
**Avoid When:** The data is plain text; use a text parser instead.
**Gotchas:**

- Pickle loading is disabled by default for safety.
- Can load both `.npy` and `.npz` formats.
- `mmap_mode` is useful for large datasets.
- Header limits matter for security and compatibility.
- Validate file trust before enabling pickle.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.load.html


### 76. Save multiple arrays in one archive

**Task:** Savez
**Example:** Store Several Named Arrays Together
**Mental Trigger:** I need one file with multiple arrays.
**Syntax:** `np.savez(file, *args, **kwds)`
**Important Parameters:** `file`, `args`, `kwds`
**Example:**

```python
import numpy as np

x = np.array([1, 2, 3])
y = np.array([4, 5, 6])
np.savez("bundle.npz", x=x, y=y)
data = np.load("bundle.npz")
print(data["x"], data["y"])
```

**Use When:**

1. Packaging related arrays together.
2. Saving datasets with multiple fields.
3. Creating compact experiment artifacts.
**Avoid When:** You only need one array; use `save`.
**Gotchas:**

- Produces a zipped archive.
- Named arrays are accessed by key.
- File size and compression tradeoffs depend on format details.
- Loaded archives act like dict-like objects.
- Useful for dataset snapshots and experiment outputs.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.savez.html


### 77. Save multiple arrays with compression

**Task:** Savez Compressed
**Example:** Compress an Array Archive
**Mental Trigger:** I want multiple arrays saved more compactly.
**Syntax:** `np.savez_compressed(file, *args, **kwds)`
**Important Parameters:** `file`, `args`, `kwds`
**Example:**

```python
import numpy as np

x = np.arange(10)
np.savez_compressed("bundle_compressed.npz", x=x)
data = np.load("bundle_compressed.npz")
print(data["x"])
```

**Use When:**

1. Reducing artifact size.
2. Archiving experiment outputs.
3. Storing large but compressible arrays.
**Avoid When:** You need maximum write throughput and can afford larger files; use `savez`.
**Gotchas:**

- Compression costs CPU time.
- Best for sparse-like or repetitive data.
- Still loads through NumPy’s archive reader.
- Not ideal for performance-critical logging.
- Compression tradeoff depends on data entropy.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.savez_compressed.html


### 78. Compare arrays for elementwise equality

**Task:** Equality Check
**Example:** Build a Boolean Match Mask
**Mental Trigger:** I need to compare values elementwise.
**Syntax:** `a == b`
**Important Parameters:** `a`, `b`
**Example:**

```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([1, 0, 3])
print(a == b)
```

**Use When:**

1. Building masks for matching labels.
2. Validating array contents.
3. Creating exact-match filters.
**Avoid When:** You need approximate floating comparison; use `isclose`.
**Gotchas:**

- Works elementwise with broadcasting.
- Float equality can be fragile.
- Produces a boolean array.
- Common prerequisite for masking.
- `==` on NaN is always false.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.equal.html


### 79. Compare arrays approximately

**Task:** Is Close
**Example:** Check Floating-Point Equality With Tolerance
**Mental Trigger:** I need to compare floats robustly.
**Syntax:** `np.isclose(a, b, rtol=1e-05, atol=1e-08, equal_nan=False)`
**Important Parameters:** `a`, `b`, `rtol`, `atol`, `equal_nan`
**Example:**

```python
import numpy as np

a = np.array([1.0, 2.0])
b = np.array([1.0 + 1e-9, 2.0])
print(np.isclose(a, b))
```

**Use When:**

1. Testing numeric outputs.
2. Comparing floating-point computations.
3. Tolerating roundoff error.
**Avoid When:** You need exact matching for integers or identifiers; use equality.
**Gotchas:**

- Relative and absolute tolerances both matter.
- Symmetry is limited by formula details.
- Default tolerances may be too loose or too strict.
- Highly useful in test assertions.
- NaN handling is configurable.
**Official Documentation:** https://numpy.org/doc/stable/reference/generated/numpy.isclose.html



## Notes

- This resource intentionally focuses on the NumPy 80/20 API surface used in real engineering work, not the full library.[^4][^2]
- The selected tasks emphasize array creation, inspection, reshaping, joining, indexing, reduction, linear algebra, random sampling, sorting, boolean logic, and file I/O because these are the most reusable NumPy workflows for engineering teams.[^5][^4]
- The package-level version is set to the current stable manual release visible in the official NumPy reference.[^2]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23][^7][^8][^9]</span>


<div align="center">⁂</div>



[^1]: https://numpy.org/doc/

[^2]: https://numpy.org/doc/stable/reference/

[^3]: https://github.com/numpy/numpy/releases

[^4]: https://numpy.org/doc/stable/user/basics.creation.html

[^5]: https://numpy.org/doc/2.2/reference/routines.array-creation.html

[^6]: RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md

[^7]: CURRENT_PROJECT_STATE_REPORT.md

[^8]: CONTENT_QUALITY_STANDARD.md

[^9]: ARCHITECTURE_FREEZE.md

[^10]: AENS-Knowledge-Layer-Specification.md

[^11]: https://arxiv.org/pdf/2006.10256.pdf

[^12]: https://dl.acm.org/doi/pdf/10.1145/3581784.3607033

[^13]: https://pmc.ncbi.nlm.nih.gov/articles/PMC7759461/

[^14]: https://arxiv.org/pdf/2503.00279.pdf

[^15]: http://arxiv.org/pdf/2303.08394.pdf

[^16]: http://arxiv.org/pdf/1611.00751.pdf

[^17]: https://arxiv.org/pdf/1901.03771.pdf

[^18]: http://arxiv.org/pdf/2406.03839.pdf

[^19]: https://numpy.org/news/

[^20]: https://numpy.org/doc/stable/release.html

[^21]: https://numpy.org/doc/stable/reference/generated/numpy.array.html

[^22]: https://numpy.org/doc/1.20/numpy-ref.pdf

[^23]: https://numpy.org/doc/stable/release/2.4.0-notes.html

