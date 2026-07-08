---
id: numpy
title: NumPy Cheatsheet
slug: numpy-cheatsheet
name: NumPy Cheatsheet
description: High-density syntax reference for NumPy arrays, indexing, reshaping, broadcasting, math, random generation, and IO.
package_reference: numpy
version: 2.5.1
sources:

- https://numpy.org/doc/stable/reference/generated/numpy.array.html
- https://numpy.org/doc/stable/reference/generated/numpy.asarray.html
- https://numpy.org/doc/stable/reference/generated/numpy.empty.html
- https://numpy.org/doc/stable/reference/generated/numpy.zeros.html
- https://numpy.org/doc/stable/reference/generated/numpy.ones.html
- https://numpy.org/doc/stable/reference/generated/numpy.full.html
- https://numpy.org/doc/stable/reference/generated/numpy.arange.html
- https://numpy.org/doc/stable/reference/generated/numpy.linspace.html
- https://numpy.org/doc/stable/reference/generated/numpy.logspace.html
- https://numpy.org/doc/stable/reference/generated/numpy.identity.html
- https://numpy.org/doc/stable/reference/generated/numpy.diag.html
- https://numpy.org/doc/stable/reference/generated/numpy.ndarray.shape.html
- https://numpy.org/doc/stable/reference/generated/numpy.ndarray.ndim.html
- https://numpy.org/doc/stable/reference/generated/numpy.ndarray.size.html
- https://numpy.org/doc/stable/reference/generated/numpy.ndarray.dtype.html
- https://numpy.org/doc/stable/reference/generated/numpy.ndarray.itemsize.html
- https://numpy.org/doc/stable/reference/generated/numpy.ndarray.nbytes.html
- https://numpy.org/doc/stable/reference/generated/numpy.reshape.html
- https://numpy.org/doc/stable/reference/generated/numpy.ndarray.flatten.html
- https://numpy.org/doc/stable/reference/generated/numpy.ravel.html
- https://numpy.org/doc/stable/reference/generated/numpy.squeeze.html
- https://numpy.org/doc/stable/reference/generated/numpy.expand_dims.html
- https://numpy.org/doc/stable/reference/generated/numpy.transpose.html
- https://numpy.org/doc/stable/reference/generated/numpy.swapaxes.html
- https://numpy.org/doc/stable/reference/generated/numpy.moveaxis.html
- https://numpy.org/doc/stable/reference/generated/numpy.concatenate.html
- https://numpy.org/doc/stable/reference/generated/numpy.stack.html
- https://numpy.org/doc/stable/reference/generated/numpy.vstack.html
- https://numpy.org/doc/stable/reference/generated/numpy.hstack.html
- https://numpy.org/doc/stable/reference/generated/numpy.dstack.html
- https://numpy.org/doc/stable/reference/generated/numpy.split.html
- https://numpy.org/doc/stable/reference/generated/numpy.array_split.html
- https://numpy.org/doc/stable/reference/generated/numpy.ndarray.__getitem__.html
- https://numpy.org/doc/stable/reference/generated/numpy.where.html
- https://numpy.org/doc/stable/reference/generated/numpy.nonzero.html
- https://numpy.org/doc/stable/reference/generated/numpy.take.html
- https://numpy.org/doc/stable/reference/generated/numpy.put.html
- https://numpy.org/doc/stable/reference/generated/numpy.sum.html
- https://numpy.org/doc/stable/reference/generated/numpy.mean.html
- https://numpy.org/doc/stable/reference/generated/numpy.std.html
- https://numpy.org/doc/stable/reference/generated/numpy.min.html
- https://numpy.org/doc/stable/reference/generated/numpy.max.html
- https://numpy.org/doc/stable/reference/generated/numpy.argmax.html
- https://numpy.org/doc/stable/reference/generated/numpy.sort.html
- https://numpy.org/doc/stable/reference/generated/numpy.partition.html
- https://numpy.org/doc/stable/reference/generated/numpy.broadcast.html
- https://numpy.org/doc/stable/reference/generated/numpy.matmul.html
- https://numpy.org/doc/stable/reference/generated/numpy.dot.html
- https://numpy.org/doc/stable/reference/generated/numpy.outer.html
- https://numpy.org/doc/stable/reference/generated/numpy.random.default_rng.html
- https://numpy.org/doc/stable/reference/generated/numpy.random.Generator.integers.html
- https://numpy.org/doc/stable/reference/generated/numpy.random.Generator.random.html
- https://numpy.org/doc/stable/reference/generated/numpy.random.Generator.normal.html
- https://numpy.org/doc/stable/reference/generated/numpy.random.Generator.shuffle.html
- https://numpy.org/doc/stable/reference/generated/numpy.save.html
- https://numpy.org/doc/stable/reference/generated/numpy.load.html
- https://numpy.org/doc/stable/reference/generated/numpy.savetxt.html
- https://numpy.org/doc/stable/reference/generated/numpy.loadtxt.html
created_at: 2026-07-06
updated_at: 2026-07-06
***

# NumPy Cheatsheet

## Core setup

### Create array from Python data

**Problem:** Convert Python sequences into a NumPy array.
**Trigger:** When you have lists, tuples, or nested sequences and need NumPy semantics.
**Snippet:**

```python
import numpy as np

x = np.array([1, 2, 3], dtype=np.float64)
print(x)
```

**Minimal Notes:** Use `dtype` when downstream code depends on precision. `copy=True` is the default.
**Common Bug:** Mixed Python types silently upcast the result.
**Official Documentation URL:** [numpy.array](https://numpy.org/doc/stable/reference/generated/numpy.array.html)

### Convert input with minimal copying

**Problem:** Normalize array-like input without forcing a copy.
**Trigger:** When writing library code that accepts arrays or array-likes.
**Snippet:**

```python
import numpy as np

x = np.asarray([1, 2, 3], dtype=np.int64)
print(x)
```

**Minimal Notes:** Prefer this when you want NumPy semantics but can reuse memory. The result may alias the input.
**Common Bug:** Mutating the result can mutate the original object when no copy occurs.
**Official Documentation URL:** [numpy.asarray](https://numpy.org/doc/stable/reference/generated/numpy.asarray.html)

### Create uninitialized array

**Problem:** Allocate a buffer you will overwrite immediately.
**Trigger:** When performance matters and every element is assigned before read.
**Snippet:**

```python
import numpy as np

x = np.empty((2, 3), dtype=np.float64)
x[:] = 0.0
print(x)
```

**Minimal Notes:** Contents are undefined until assigned. Use only with immediate initialization.
**Common Bug:** Reading values before writing them produces garbage data.
**Official Documentation URL:** [numpy.empty](https://numpy.org/doc/stable/reference/generated/numpy.empty.html)

### Create zero-filled array

**Problem:** Initialize a deterministic numeric buffer.
**Trigger:** When building counters, masks, accumulators, or feature matrices.
**Snippet:**

```python
import numpy as np

x = np.zeros((2, 3), dtype=np.float32)
print(x)
```

**Minimal Notes:** Good default for safe initialization. Choose dtype carefully for integer workflows.
**Common Bug:** Using the default floating dtype when you expected integers.
**Official Documentation URL:** [numpy.zeros](https://numpy.org/doc/stable/reference/generated/numpy.zeros.html)

### Create ones-filled array

**Problem:** Initialize a constant array of ones.
**Trigger:** When building masks, baseline factors, or multiplicative defaults.
**Snippet:**

```python
import numpy as np

x = np.ones((2, 3), dtype=np.int64)
print(x)
```

**Minimal Notes:** Often used as a building block for later scaling or masking.
**Common Bug:** Forgetting that the default dtype may not match the target pipeline.
**Official Documentation URL:** [numpy.ones](https://numpy.org/doc/stable/reference/generated/numpy.ones.html)

### Create constant-filled array

**Problem:** Fill an array with a specific scalar value.
**Trigger:** When you need padding, sentinel values, or repeated constants.
**Snippet:**

```python
import numpy as np

x = np.full((2, 3), 7, dtype=np.int32)
print(x)
```

**Minimal Notes:** Use this for explicit constant initialization. The fill value is cast to the target dtype.
**Common Bug:** Unexpected casting when the dtype cannot represent the fill value exactly.
**Official Documentation URL:** [numpy.full](https://numpy.org/doc/stable/reference/generated/numpy.full.html)

### Create integer range

**Problem:** Build a discrete sequence of values with a fixed step.
**Trigger:** When generating indices, test data, or step-based loops.
**Snippet:**

```python
import numpy as np

x = np.arange(0, 10, 2)
print(x)
```

**Minimal Notes:** The stop value is excluded. Use for stepwise sequences, not exact sample counts.
**Common Bug:** Expecting the stop value to be included.
**Official Documentation URL:** [numpy.arange](https://numpy.org/doc/stable/reference/generated/numpy.arange.html)

### Create evenly spaced samples

**Problem:** Build a fixed-length numeric grid between two endpoints.
**Trigger:** When you need exact sample count for plotting or simulation.
**Snippet:**

```python
import numpy as np

x = np.linspace(0.0, 1.0, 5)
print(x)
```

**Minimal Notes:** Use when the number of points matters more than the step size.
**Common Bug:** Using `arange` when you actually need a fixed number of samples.
**Official Documentation URL:** [numpy.linspace](https://numpy.org/doc/stable/reference/generated/numpy.linspace.html)

### Create log-spaced samples

**Problem:** Build values spaced evenly on a logarithmic scale.
**Trigger:** When sweeping values across orders of magnitude.
**Snippet:**

```python
import numpy as np

x = np.logspace(0, 3, 4)
print(x)
```

**Minimal Notes:** Useful for search grids and scale-sensitive parameters. Exponents define the sequence.
**Common Bug:** Treating the inputs as final values instead of exponents.
**Official Documentation URL:** [numpy.logspace](https://numpy.org/doc/stable/reference/generated/numpy.logspace.html)

### Create identity matrix

**Problem:** Build a square identity matrix.
**Trigger:** When setting up linear algebra, masking, or regularization logic.
**Snippet:**

```python
import numpy as np

x = np.identity(3, dtype=np.float64)
print(x)
```

**Minimal Notes:** This is the square-only convenience constructor.
**Common Bug:** Using it when you need a rectangular or shifted diagonal.
**Official Documentation URL:** [numpy.identity](https://numpy.org/doc/stable/reference/generated/numpy.identity.html)

### Create diagonal matrix

**Problem:** Move between diagonal vectors and matrices.
**Trigger:** When extracting or constructing diagonal values.
**Snippet:**

```python
import numpy as np

x = np.diag([1, 2, 3])
print(x)
```

**Minimal Notes:** 1D input builds a matrix; 2D input extracts a diagonal.
**Common Bug:** Forgetting that the behavior changes with input rank.
**Official Documentation URL:** [numpy.diag](https://numpy.org/doc/stable/reference/generated/numpy.diag.html)

## Shape and dtype

### Read shape

**Problem:** Inspect axis lengths.
**Trigger:** When validating dimensions before reshaping, broadcasting, or concatenation.
**Snippet:**

```python
import numpy as np

a = np.zeros((2, 3, 4))
print(a.shape)
```

**Minimal Notes:** Shape is the axis-length tuple. Check it before any structural transform.
**Common Bug:** Assuming two arrays are compatible without comparing shapes.
**Official Documentation URL:** [numpy.ndarray.shape](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.shape.html)

### Read number of dimensions

**Problem:** Check the array rank.
**Trigger:** When accepting scalar, vector, matrix, or tensor inputs.
**Snippet:**

```python
import numpy as np

a = np.array([1, 2, 3, 4])
print(a.ndim)
```

**Minimal Notes:** Scalars have rank 0. Use with `shape` for full validation.
**Common Bug:** Confusing a 1D array with a row or column vector.
**Official Documentation URL:** [numpy.ndarray.ndim](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.ndim.html)

### Read element count

**Problem:** Get total number of elements.
**Trigger:** When checking emptiness or total data volume.
**Snippet:**

```python
import numpy as np

a = np.array([1, 2, 3, 4])
print(a.size)
```

**Minimal Notes:** This is the product of all axis lengths.
**Common Bug:** Confusing element count with memory usage.
**Official Documentation URL:** [numpy.ndarray.size](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.size.html)

### Read dtype

**Problem:** Inspect element type.
**Trigger:** When debugging precision, casting, or downstream compatibility.
**Snippet:**

```python
import numpy as np

a = np.array([1, 2, 3], dtype=np.int32)
print(a.dtype)
```

**Minimal Notes:** Dtype controls arithmetic behavior and storage layout.
**Common Bug:** Silent upcasting changes performance or precision.
**Official Documentation URL:** [numpy.ndarray.dtype](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.dtype.html)

### Read item size

**Problem:** Check bytes per element.
**Trigger:** When estimating dtype storage costs or binary layout.
**Snippet:**

```python
import numpy as np

a = np.array([1, 2, 3], dtype=np.int64)
print(a.itemsize)
```

**Minimal Notes:** This is per-element storage, not total memory.
**Common Bug:** Using `itemsize` as if it represented the full array footprint.
**Official Documentation URL:** [numpy.ndarray.itemsize](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.itemsize.html)

### Read array bytes

**Problem:** Estimate payload memory usage.
**Trigger:** When budgeting RAM for large tensors or feature matrices.
**Snippet:**

```python
import numpy as np

a = np.zeros((100, 100), dtype=np.float32)
print(a.nbytes)
```

**Minimal Notes:** This reflects the raw array buffer size. It excludes Python object overhead.
**Common Bug:** Assuming `nbytes` captures all memory used by object arrays.
**Official Documentation URL:** [numpy.ndarray.nbytes](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.nbytes.html)

## Reshaping and axes

### Reshape array

**Problem:** Change shape without changing data.
**Trigger:** When converting flat data into batch, matrix, or tensor form.
**Snippet:**

```python
import numpy as np

a = np.arange(6)
b = np.reshape(a, (2, 3))
print(b)
```

**Minimal Notes:** The element count must stay the same. The result may be a view.
**Common Bug:** Requesting a shape that does not preserve total size.
**Official Documentation URL:** [numpy.reshape](https://numpy.org/doc/stable/reference/generated/numpy.reshape.html)

### Flatten array copy

**Problem:** Get a 1D contiguous copy.
**Trigger:** When you need independent flat data for serialization or mutation.
**Snippet:**

```python
import numpy as np

a = np.array([[1, 2], [3, 4]])
b = a.flatten()
print(b)
```

**Minimal Notes:** Always returns a copy. Safe, but more expensive than a view.
**Common Bug:** Using it when a non-copying view would be better.
**Official Documentation URL:** [numpy.ndarray.flatten](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.flatten.html)

### Flatten array view

**Problem:** Get a 1D view when possible.
**Trigger:** When you want fast linear access without guaranteed copying.
**Snippet:**

```python
import numpy as np

a = np.array([[1, 2], [3, 4]])
b = np.ravel(a)
print(b)
```

**Minimal Notes:** May return a view or a copy depending on layout.
**Common Bug:** Mutating the result when you expected independence from the source.
**Official Documentation URL:** [numpy.ravel](https://numpy.org/doc/stable/reference/generated/numpy.ravel.html)

### Remove singleton axes

**Problem:** Drop size-1 dimensions.
**Trigger:** When model outputs or loaded data contain extra singleton axes.
**Snippet:**

```python
import numpy as np

a = np.zeros((1, 3, 1))
b = np.squeeze(a)
print(b.shape)
```

**Minimal Notes:** Only axes of length 1 can be removed.
**Common Bug:** Removing axes that carry semantic meaning in later broadcasting.
**Official Documentation URL:** [numpy.squeeze](https://numpy.org/doc/stable/reference/generated/numpy.squeeze.html)

### Add singleton axis

**Problem:** Insert a length-1 dimension.
**Trigger:** When preparing batch axes or aligning shapes for broadcasting.
**Snippet:**

```python
import numpy as np

a = np.array([1, 2, 3])
b = np.expand_dims(a, axis=0)
print(b.shape)
```

**Minimal Notes:** This is the simplest way to add a batch or channel axis.
**Common Bug:** Inserting the axis in the wrong position and breaking later broadcasting.
**Official Documentation URL:** [numpy.expand_dims](https://numpy.org/doc/stable/reference/generated/numpy.expand_dims.html)

### Transpose array

**Problem:** Reorder axes.
**Trigger:** When switching matrix orientation or changing tensor layout.
**Snippet:**

```python
import numpy as np

a = np.array([[1, 2], [3, 4]])
b = np.transpose(a)
print(b)
```

**Minimal Notes:** For 2D arrays, this swaps rows and columns. For higher dimensions, it permutes axes.
**Common Bug:** Assuming transpose always returns a copy.
**Official Documentation URL:** [numpy.transpose](https://numpy.org/doc/stable/reference/generated/numpy.transpose.html)

### Swap two axes

**Problem:** Exchange two specific axes.
**Trigger:** When you only need one targeted axis swap.
**Snippet:**

```python
import numpy as np

a = np.zeros((2, 3, 4))
b = np.swapaxes(a, 0, 2)
print(b.shape)
```

**Minimal Notes:** Cleaner than a full permutation when only two axes change.
**Common Bug:** Confusing the order of the source and destination axes.
**Official Documentation URL:** [numpy.swapaxes](https://numpy.org/doc/stable/reference/generated/numpy.swapaxes.html)

### Move axis

**Problem:** Reposition one or more axes.
**Trigger:** When converting between channel-first and channel-last layouts.
**Snippet:**

```python
import numpy as np

a = np.zeros((2, 3, 4))
b = np.moveaxis(a, 0, -1)
print(b.shape)
```

**Minimal Notes:** Often easier to read than a manual permutation.
**Common Bug:** Losing track of the resulting axis order in higher-rank arrays.
**Official Documentation URL:** [numpy.moveaxis](https://numpy.org/doc/stable/reference/generated/numpy.moveaxis.html)

## Joining and splitting

### Concatenate arrays

**Problem:** Join arrays along an existing axis.
**Trigger:** When combining batches or feature blocks with matching shapes.
**Snippet:**

```python
import numpy as np

a = np.array([1, 2])
b = np.array([3, 4])
c = np.concatenate((a, b))
print(c)
```

**Minimal Notes:** All dimensions must match except the concatenation axis.
**Common Bug:** Shape mismatch across non-joined axes.
**Official Documentation URL:** [numpy.concatenate](https://numpy.org/doc/stable/reference/generated/numpy.concatenate.html)

### Stack arrays

**Problem:** Join same-shaped arrays along a new axis.
**Trigger:** When building batches from individual samples.
**Snippet:**

```python
import numpy as np

a = np.array([1, 2])
b = np.array([3, 4])
c = np.stack((a, b), axis=0)
print(c)
```

**Minimal Notes:** Use this when you need a new dimension, not just longer data.
**Common Bug:** Using `concatenate` when you actually need a new axis.
**Official Documentation URL:** [numpy.stack](https://numpy.org/doc/stable/reference/generated/numpy.stack.html)

### Vertical stack arrays

**Problem:** Append rows with concise syntax.
**Trigger:** When building matrices row by row.
**Snippet:**

```python
import numpy as np

a = np.array([1, 2])
b = np.array([3, 4])
c = np.vstack((a, b))
print(c)
```

**Minimal Notes:** Convenience wrapper for row-oriented stacking.
**Common Bug:** Forgetting that 1D inputs are treated as rows.
**Official Documentation URL:** [numpy.vstack](https://numpy.org/doc/stable/reference/generated/numpy.vstack.html)

### Horizontal stack arrays

**Problem:** Join arrays side by side.
**Trigger:** When combining vectors or widening feature tables.
**Snippet:**

```python
import numpy as np

a = np.array([1, 2])
b = np.array([3, 4])
c = np.hstack((a, b))
print(c)
```

**Minimal Notes:** Behavior differs for 1D and higher-dimensional inputs.
**Common Bug:** Assuming the output rank stays the same in every case.
**Official Documentation URL:** [numpy.hstack](https://numpy.org/doc/stable/reference/generated/numpy.hstack.html)

### Depth stack arrays

**Problem:** Combine arrays into a depth-like third axis.
**Trigger:** When working with legacy stacking code or channel-like layouts.
**Snippet:**

```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
c = np.dstack((a, b))
print(c.shape)
```

**Minimal Notes:** Convenience wrapper; use `stack` for explicit axis control.
**Common Bug:** Misreading the resulting shape after implicit promotion.
**Official Documentation URL:** [numpy.dstack](https://numpy.org/doc/stable/reference/generated/numpy.dstack.html)

### Split array evenly

**Problem:** Split an array into equal chunks.
**Trigger:** When dividing batches or partitions with exact divisibility.
**Snippet:**

```python
import numpy as np

a = np.arange(6)
parts = np.split(a, 3)
print(parts)
```

**Minimal Notes:** The split count must divide evenly.
**Common Bug:** Assuming NumPy will adjust uneven chunk sizes automatically.
**Official Documentation URL:** [numpy.split](https://numpy.org/doc/stable/reference/generated/numpy.split.html)

### Split array unevenly

**Problem:** Split an array when sizes may differ.
**Trigger:** When partitioning data that does not divide evenly.
**Snippet:**

```python
import numpy as np

a = np.arange(7)
parts = np.array_split(a, 3)
print([p.tolist() for p in parts])
```

**Minimal Notes:** Chunk sizes can differ by at most one.
**Common Bug:** Expecting exact equal-length partitions.
**Official Documentation URL:** [numpy.array_split](https://numpy.org/doc/stable/reference/generated/numpy.array_split.html)

## Indexing and selection

### Boolean indexing

**Problem:** Filter values by a condition mask.
**Trigger:** When keeping only elements that match a threshold or predicate.
**Snippet:**

```python
import numpy as np

a = np.array([1, 2, 3, 4])
mask = a > 2
print(a[mask])
```

**Minimal Notes:** The result is often flattened across selected elements.
**Common Bug:** Mask shape does not align with the target axis.
**Official Documentation URL:** [numpy.ndarray.__getitem__](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.__getitem__.html)

### Fancy indexing

**Problem:** Select arbitrary positions by index array.
**Trigger:** When gathering non-contiguous rows or reordering samples.
**Snippet:**

```python
import numpy as np

a = np.array([10, 20, 30, 40])
idx = [3, 1]
print(a[idx])
```

**Minimal Notes:** Use this for explicit position-based selection.
**Common Bug:** Expecting a view; fancy indexing returns a copy.
**Official Documentation URL:** [numpy.ndarray.__getitem__](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.__getitem__.html)

### Elementwise conditional selection

**Problem:** Choose between two arrays element by element.
**Trigger:** When implementing simple vectorized if-else logic.
**Snippet:**

```python
import numpy as np

a = np.array([1, 2, 3, 4])
b = np.where(a > 2, a, -a)
print(b)
```

**Minimal Notes:** Broadcasting applies to the condition and both branches.
**Common Bug:** Forgetting that both branches may be evaluated before selection.
**Official Documentation URL:** [numpy.where](https://numpy.org/doc/stable/reference/generated/numpy.where.html)

### Find nonzero entries

**Problem:** Get positions of true or nonzero elements.
**Trigger:** When you need coordinate indices rather than a boolean mask.
**Snippet:**

```python
import numpy as np

a = np.array([0, 1, 0, 2])
print(np.nonzero(a))
```

**Minimal Notes:** Returns index arrays, one per axis.
**Common Bug:** Using it when a mask alone would be simpler.
**Official Documentation URL:** [numpy.nonzero](https://numpy.org/doc/stable/reference/generated/numpy.nonzero.html)

### Take elements by index

**Problem:** Gather values from explicit positions along an axis.
**Trigger:** When implementing indexed lookup or gather-like selection.
**Snippet:**

```python
import numpy as np

a = np.array([10, 20, 30, 40])
print(np.take(a, [3, 1]))
```

**Minimal Notes:** Useful when you want axis-aware selection with explicit mode control.
**Common Bug:** Forgetting that `axis=None` flattens the array first.
**Official Documentation URL:** [numpy.take](https://numpy.org/doc/stable/reference/generated/numpy.take.html)

### Put elements by index

**Problem:** Scatter values into selected positions.
**Trigger:** When writing into a flat output buffer from index positions.
**Snippet:**

```python
import numpy as np

a = np.zeros(5, dtype=int)
np.put(a, [1, 3, 4], [7, 8, 9])
print(a)
```

**Minimal Notes:** This mutates in place and works on the flattened array by default.
**Common Bug:** Assuming axis-aware assignment when `put` is actually flat-index based.
**Official Documentation URL:** [numpy.put](https://numpy.org/doc/stable/reference/generated/numpy.put.html)

## Reductions and statistics

### Sum array

**Problem:** Add elements across an axis or the whole array.
**Trigger:** When computing totals, counts, or aggregated features.
**Snippet:**

```python
import numpy as np

a = np.array([[1, 2], [3, 4]])
print(np.sum(a))
```

**Minimal Notes:** Use `axis` for dimensional reductions.
**Common Bug:** Summing over the wrong axis and collapsing the wrong dimension.
**Official Documentation URL:** [numpy.sum](https://numpy.org/doc/stable/reference/generated/numpy.sum.html)

### Mean array

**Problem:** Compute average values.
**Trigger:** When aggregating metrics or normalizing numeric data.
**Snippet:**

```python
import numpy as np

a = np.array([[1, 2], [3, 4]])
print(np.mean(a))
```

**Minimal Notes:** Specify `axis` when you want row-wise or column-wise means.
**Common Bug:** Accidentally averaging over the entire array.
**Official Documentation URL:** [numpy.mean](https://numpy.org/doc/stable/reference/generated/numpy.mean.html)

### Standard deviation

**Problem:** Measure spread of numeric data.
**Trigger:** When summarizing variability or normalizing features.
**Snippet:**

```python
import numpy as np

a = np.array([1, 2, 3, 4])
print(np.std(a))
```

**Minimal Notes:** Use `ddof` only when you need sample-style adjustment.
**Common Bug:** Forgetting that the default is population standard deviation.
**Official Documentation URL:** [numpy.std](https://numpy.org/doc/stable/reference/generated/numpy.std.html)

### Minimum and maximum

**Problem:** Find extrema over an array or axis.
**Trigger:** When clipping ranges, normalizing bounds, or checking outliers.
**Snippet:**

```python
import numpy as np

a = np.array([1, 5, 2, 9])
print(np.min(a), np.max(a))
```

**Minimal Notes:** Use axis-aware calls for per-row or per-column bounds.
**Common Bug:** Reducing over the whole array when you needed axis-wise results.
**Official Documentation URL:** [numpy.min](https://numpy.org/doc/stable/reference/generated/numpy.min.html)

### Argmax and argmin

**Problem:** Find positions of extrema.
**Trigger:** When selecting best-scoring elements or top candidates.
**Snippet:**

```python
import numpy as np

a = np.array([1, 5, 2, 9])
print(np.argmax(a), np.argmin(a))
```

**Minimal Notes:** These return positions, not values.
**Common Bug:** Confusing index outputs with the max or min value itself.
**Official Documentation URL:** [numpy.argmax](https://numpy.org/doc/stable/reference/generated/numpy.argmax.html)

### Sort array

**Problem:** Sort values in place or get sorted order.
**Trigger:** When ranking scores or preparing ordered data.
**Snippet:**

```python
import numpy as np

a = np.array([3, 1, 2])
a.sort()
print(a)
```

**Minimal Notes:** Use `sort` for in-place mutation.
**Common Bug:** Expecting `sort` to return a new array.
**Official Documentation URL:** [numpy.ndarray.sort](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.sort.html)

### Partition array

**Problem:** Partially order values around a pivot.
**Trigger:** When you only need top-k style separation.
**Snippet:**

```python
import numpy as np

a = np.array([3, 1, 4, 2])
print(np.partition(a, 2))
```

**Minimal Notes:** Faster than a full sort when exact ordering is unnecessary.
**Common Bug:** Assuming the entire array is fully sorted after partitioning.
**Official Documentation URL:** [numpy.partition](https://numpy.org/doc/stable/reference/generated/numpy.partition.html)

## Broadcasting and algebra

### Broadcast-compatible shapes

**Problem:** Apply elementwise operations across mismatched but compatible shapes.
**Trigger:** When combining vectors, matrices, or tensors without manual tiling.
**Snippet:**

```python
import numpy as np

a = np.array([[^1], [^2], [^3]])
b = np.array([10, 20, 30])
print(a + b)
```

**Minimal Notes:** Broadcasting aligns dimensions from the right.
**Common Bug:** Assuming incompatible shapes will auto-expand.
**Official Documentation URL:** [numpy.broadcast](https://numpy.org/doc/stable/reference/generated/numpy.broadcast.html)

### Matrix multiplication

**Problem:** Multiply arrays using linear algebra rules.
**Trigger:** When computing dot products, projections, or model layers.
**Snippet:**

```python
import numpy as np

a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6], [7, 8]])
print(np.matmul(a, b))
```

**Minimal Notes:** Use `matmul` for matrix multiplication semantics.
**Common Bug:** Using `*` and getting elementwise multiplication instead.
**Official Documentation URL:** [numpy.matmul](https://numpy.org/doc/stable/reference/generated/numpy.matmul.html)

### Dot product

**Problem:** Compute vector or matrix dot products.
**Trigger:** When doing linear algebra or similarity calculations.
**Snippet:**

```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
print(np.dot(a, b))
```

**Minimal Notes:** Works across vectors and matrices, but semantics vary by rank.
**Common Bug:** Expecting `dot` to behave like `matmul` for all ranks.
**Official Documentation URL:** [numpy.dot](https://numpy.org/doc/stable/reference/generated/numpy.dot.html)

### Outer product

**Problem:** Build all pairwise combinations between two vectors.
**Trigger:** When computing pairwise weights or feature interactions.
**Snippet:**

```python
import numpy as np

a = np.array([1, 2])
b = np.array([3, 4])
print(np.outer(a, b))
```

**Minimal Notes:** Produces a full grid of pairwise products.
**Common Bug:** Using it when you only want an elementwise product.
**Official Documentation URL:** [numpy.outer](https://numpy.org/doc/stable/reference/generated/numpy.outer.html)

## Random and sampling

### Random integers

**Problem:** Generate random integer samples.
**Trigger:** When creating tests, indices, or synthetic categorical data.
**Snippet:**

```python
import numpy as np

rng = np.random.default_rng(42)
x = rng.integers(0, 10, size=5)
print(x)
```

**Minimal Notes:** Prefer `default_rng` for modern random generation.
**Common Bug:** Using legacy global RNG state in new code.
**Official Documentation URL:** [numpy.random.Generator.integers](https://numpy.org/doc/stable/reference/generated/numpy.random.Generator.integers.html)

### Random floats

**Problem:** Sample random floating-point values.
**Trigger:** When building randomized test inputs or simulations.
**Snippet:**

```python
import numpy as np

rng = np.random.default_rng(42)
x = rng.random((2, 3))
print(x)
```

**Minimal Notes:** `default_rng` produces a reusable generator object.
**Common Bug:** Mixing legacy `np.random` calls with Generator-based code.
**Official Documentation URL:** [numpy.random.Generator.random](https://numpy.org/doc/stable/reference/generated/numpy.random.Generator.random.html)

### Normal samples

**Problem:** Draw samples from a normal distribution.
**Trigger:** When simulating noise or initializing random data.
**Snippet:**

```python
import numpy as np

rng = np.random.default_rng(42)
x = rng.normal(loc=0.0, scale=1.0, size=5)
print(x)
```

**Minimal Notes:** Use named parameters for readability and reproducibility.
**Common Bug:** Forgetting to set a seed or generator for repeatable results.
**Official Documentation URL:** [numpy.random.Generator.normal](https://numpy.org/doc/stable/reference/generated/numpy.random.Generator.normal.html)

### Shuffle data

**Problem:** Randomize order in place.
**Trigger:** When preparing training, validation, or test splits.
**Snippet:**

```python
import numpy as np

rng = np.random.default_rng(42)
x = np.array([1, 2, 3, 4, 5])
rng.shuffle(x)
print(x)
```

**Minimal Notes:** This mutates the array directly.
**Common Bug:** Shuffling a view when you expected an independent copy.
**Official Documentation URL:** [numpy.random.Generator.shuffle](https://numpy.org/doc/stable/reference/generated/numpy.random.Generator.shuffle.html)

## Export and IO

### Save array to binary file

**Problem:** Persist an array with NumPy-native binary format.
**Trigger:** When saving intermediate results for fast reload.
**Snippet:**

```python
import numpy as np

a = np.array([1, 2, 3])
np.save("array.npy", a)
```

**Minimal Notes:** Best for NumPy-only workflows.
**Common Bug:** Expecting the file to be human-readable text.
**Official Documentation URL:** [numpy.save](https://numpy.org/doc/stable/reference/generated/numpy.save.html)

### Load array from binary file

**Problem:** Restore a `.npy` array from disk.
**Trigger:** When reusing saved intermediate arrays or model artifacts.
**Snippet:**

```python
import numpy as np

a = np.load("array.npy")
print(a)
```

**Minimal Notes:** Use `allow_pickle=False` unless you explicitly need pickled object arrays.
**Common Bug:** Loading object arrays with unsafe pickle settings.
**Official Documentation URL:** [numpy.load](https://numpy.org/doc/stable/reference/generated/numpy.load.html)

### Save plain text array

**Problem:** Export an array as readable text.
**Trigger:** When sharing small numeric data or debugging values.
**Snippet:**

```python
import numpy as np

a = np.array([[1, 2], [3, 4]])
np.savetxt("array.csv", a, delimiter=",")
```

**Minimal Notes:** Good for inspection and interoperability. Not ideal for large arrays.
**Common Bug:** Using text export for large arrays and paying a big performance penalty.
**Official Documentation URL:** [numpy.savetxt](https://numpy.org/doc/stable/reference/generated/numpy.savetxt.html)

### Load plain text array

**Problem:** Read a text-based numeric file into an array.
**Trigger:** When importing CSV-like numeric data into NumPy.
**Snippet:**

```python
import numpy as np

a = np.loadtxt("array.csv", delimiter=",")
print(a)
```

**Minimal Notes:** Best for simple numeric files with regular structure.
**Common Bug:** Expecting it to handle messy mixed-type text automatically.
**Official Documentation URL:** [numpy.loadtxt](https://numpy.org/doc/stable/reference/generated/numpy.loadtxt.html)

## Quick reference

### Common array constructors

| Task | API | Typical use |
| :-- | :-- | :-- |
| Create from data | `np.array` | Copy or normalize Python data |
| Minimal-copy input | `np.asarray` | Accept array-like input |
| Uninitialized buffer | `np.empty` | Overwrite immediately |
| Zero-filled array | `np.zeros` | Safe initialization |
| Constant-filled array | `np.full` | Padding or sentinel values |
| Integer range | `np.arange` | Discrete indices |
| Evenly spaced values | `np.linspace` | Fixed-length sample grids |
| Log-spaced values | `np.logspace` | Scale sweeps |

### Common array attributes

| Attribute | Meaning |
| :-- | :-- |
| `shape` | Axis lengths |
| `ndim` | Number of dimensions |
| `size` | Total number of elements |
| `dtype` | Element type |
| `itemsize` | Bytes per element |
| `nbytes` | Raw buffer bytes |

### Common transformations

| Task | API |
| :-- | :-- |
| Reshape | `np.reshape` |
| Flatten copy | `a.flatten()` |
| Flatten view when possible | `np.ravel` |
| Remove singleton axes | `np.squeeze` |
| Add singleton axis | `np.expand_dims` |
| Transpose axes | `np.transpose` |
| Swap two axes | `np.swapaxes` |
| Move axes | `np.moveaxis` |

### Common selection tools

| Task | API |
| :-- | :-- |
| Boolean filter | `a[mask]` |
| Gather by positions | `a[idx]` |
| Conditional choose | `np.where` |
| Nonzero positions | `np.nonzero` |
| Take by index | `np.take` |
| Scatter by index | `np.put` |

### Common arithmetic

| Task | API |
| :-- | :-- |
| Sum | `np.sum` |
| Mean | `np.mean` |
| Standard deviation | `np.std` |
| Minimum | `np.min` |
| Maximum | `np.max` |
| Argmax | `np.argmax` |
| Argmin | `np.argmin` |
| Matrix multiply | `np.matmul` |
| Dot product | `np.dot` |
| Outer product | `np.outer` |

## Common errors

| Error | Cause | Solution |
| :-- | :-- | :-- |
| Shape mismatch | Arrays do not align for stacking, concatenation, or broadcasting | Compare `shape` before combining |
| Wrong axis | Reduction or join used the wrong axis index | Verify `axis` against the intended dimension |
| Unexpected copy | Fancy indexing or flattening returned a copy | Use views where possible and confirm semantics |
| Garbage values | Read from `np.empty` before writing | Initialize every element immediately |
| Silent upcast | Mixed types promoted the dtype | Set `dtype` explicitly |
| In-place mutation surprise | `asarray` or slicing reused input memory | Copy when isolation is required |

## Performance checklist

- Prefer vectorized operations over Python loops.
- Use `np.asarray` when you do not need a guaranteed copy.
- Avoid `flatten()` in hot paths when a view is acceptable.
- Use `np.empty` only when immediate overwrite is guaranteed.
- Prefer `default_rng` and reuse one generator instance.
- Avoid repeated concatenation inside loops; collect first, concatenate once.
- Use binary IO for large arrays; use text IO only for small inspection cases.
- Check dtype size before scaling to large datasets.


## Production checklist

- Set `dtype` explicitly when precision matters.
- Validate `shape` and `ndim` at API boundaries.
- Seed random generation for reproducible outputs.
- Prefer explicit axis arguments in reductions and reshaping.
- Confirm whether an operation returns a view or a copy.
- Keep array layouts consistent across pipeline stages.
- Use binary save/load for stable round-tripping.
- Write snippets that are copy-paste ready and deterministic.
<span style="display:none">[^10][^11][^12][^13][^14][^15][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://arxiv.org/pdf/2006.10256.pdf

[^2]: http://arxiv.org/pdf/1102.1523.pdf

[^3]: https://pmc.ncbi.nlm.nih.gov/articles/PMC7759461/

[^4]: http://conference.scipy.org/proceedings/scipy2020/pdfs/jim_pivarski.pdf

[^5]: https://arxiv.org/pdf/1901.03771.pdf

[^6]: https://numpy.org/doc/stable/reference/generated/numpy.array.html

[^7]: https://numpy.org/doc/stable/reference/generated/numpy.ones.html

[^8]: https://numpy.org/doc/stable/reference/generated/numpy.rec.array.html

[^9]: https://numpy.org/doc/stable/reference/generated/numpy.ndarray.html

[^10]: https://numpy.org/doc/stable/reference/generated/numpy.insert.html

[^11]: https://numpy.org/doc/stable/reference/generated/numpy.atleast_1d.html

[^12]: https://numpy.org/doc/stable/reference/generated/numpy.strings.index.html

[^13]: https://numpy.org/doc/stable/reference/generated/numpy.linspace.html

[^14]: https://numpy.org/doc/stable/reference/generated/numpy.add.html

[^15]: https://numpy.org/doc/stable/reference/generated/numpy.reshape.html

