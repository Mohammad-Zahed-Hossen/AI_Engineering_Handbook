# **TensorFlow Tensor Operations Quick Reference**

## **Problem**

> 1. Create Constant Tensor (tf.constant)

## **Trigger**

I need to create an immutable tensor from Python lists or NumPy arrays to represent static model inputs or constants.

## **Primary APIs**

> * tf.constant

## **Snippet**

`import tensorflow as tf`

`tensor = tf.constant([[1.0, 2.0], [3.0, 4.0]], dtype=tf.float32)`  
`print(tensor)`

## **Minimal Notes**

Returns an immutable tf.Tensor stored in host or device memory. Preserves the specified dtype or infers it directly from input Python types.

## **Common Bug**

**Issue:** TypeError or unexpected loss of floating-point precision during tensor operations.

**Cause:** Passing mixed Python types forces automatic inference to tf.int32 or tf.float64 rather than the intended target type.

**Quick Fix:** Explicitly set the dtype parameter, such as dtype=tf.float32, during initialization.

## **Best Practice**

Always set dtype explicitly when creating constant tensors to avoid implicit type promotion issues in model operations.

## **Related Tasks**

> *   
  2. Create Mutable Tensor Variable (tf.Variable)  
> *   
  3. Convert Existing Data to Tensor (tf.convert\_to\_tensor)  
> *   
  6. Create Constant-Filled Tensor (tf.fill)

## **Official Documentation URL**

[https://www.tensorflow.org/api\_docs/python/tf/constant](https://www.tensorflow.org/api_docs/python/tf/constant)

## **Problem**

> 2. Create Mutable Tensor Variable (tf.Variable)

## **Trigger**

I need an in-memory mutable tensor buffer to hold trainable neural network parameters or changing state.

## **Primary APIs**

> * tf.Variable

## **Snippet**

`import tensorflow as tf`

`var = tf.Variable([[1.0, 2.0], [3.0, 4.0]], dtype=tf.float32)`  
`var.assign_add([[0.5, 0.5], [0.5, 0.5]])`  
`print(var)`

## **Minimal Notes**

Creates a persistent, mutable variable wrapper around an underlying tensor memory buffer. In-place updates require explicit methods like assign, assign\_add, or assign\_sub.

## **Common Bug**

**Issue:** ValueError when calling assign with a value of a different shape or data type.

**Cause:** tf.Variable enforces strict shape and dtype invariance across updates by default.

**Quick Fix:** Pass validate\_shape=False during assignment if shape changes are required, or cast input data to match the variable's original dtype.

## **Best Practice**

Reserve tf.Variable strictly for trainable parameters and stateful optimizer metrics, using standard immutable tensors for intermediate values.

## **Related Tasks**

> *   
  1. Create Constant Tensor (tf.constant)  
> *   
  3. Convert Existing Data to Tensor (tf.convert\_to\_tensor)  
> *   
  28. Device Placement and Dtype Conversion (tf.device, tf.cast, tf.identity)

## **Official Documentation URL**

[https://www.tensorflow.org/api\_docs/python/tf/Variable](https://www.tensorflow.org/api_docs/python/tf/Variable)

## **Problem**

> 3. Convert Existing Data to Tensor (tf.convert\_to\_tensor)

## **Trigger**

I need to convert arbitrary Python objects, lists, or NumPy arrays into a TensorFlow tensor without making redundant copies if the object is already a tensor.

## **Primary APIs**

> * tf.convert\_to\_tensor

## **Snippet**

`import tensorflow as tf`  
`import numpy as np`

`data = np.array([1.0, 2.0, 3.0], dtype=np.float32)`  
`tensor = tf.convert_to_tensor(data, dtype=tf.float32)`  
`print(tensor)`

## **Minimal Notes**

Converts compatible Python inputs into a standard tensor while avoiding memory copies if the input is already a tf.Tensor. Accepts lists, tuples, NumPy arrays, and existing tensors.

## **Common Bug**

**Issue:** Memory overhead or unintended type mismatch when converting double-precision NumPy arrays.

**Cause:** NumPy defaults floating numbers to float64, whereas deep learning frameworks typically require float32.

**Quick Fix:** Provide dtype=tf.float32 directly inside tf.convert\_to\_tensor during conversion.

## **Best Practice**

Use tf.convert\_to\_tensor at public function boundaries to normalize incoming arguments safely without unnecessary copying.

## **Related Tasks**

> *   
  1. Create Constant Tensor (tf.constant)  
> *   
  10. Inspect Tensor Properties (shape, dtype, device, ndim, numpy())  
> *   
  28. Device Placement and Dtype Conversion (tf.device, tf.cast, tf.identity)

## **Official Documentation URL**

[https://www.tensorflow.org/api\_docs/python/tf/convert\_to\_tensor](https://www.tensorflow.org/api_docs/python/tf/convert_to_tensor)

## **Problem**

> 4. Create Zero-Filled Tensor (tf.zeros / tf.zeros\_like)

## **Trigger**

I need to allocate a tensor filled completely with zeros given an explicit shape or matching another tensor's dimensions.

## **Primary APIs**

> * tf.zeros  
> * tf.zeros\_like

## **Snippet**

`import tensorflow as tf`

`zeros = tf.zeros(shape=(2, 3), dtype=tf.float32)`  
`zeros_like = tf.zeros_like(zeros)`  
`print(zeros_like)`

## **Minimal Notes**

Allocates contiguous memory initialized to scalar zero across the given shape or target tensor layout. Supports integer, floating-point, boolean, and complex data types.

## **Common Bug**

**Issue:** TypeError when passing a tensor directly into tf.zeros instead of its shape tuple.

**Cause:** tf.zeros expects a shape sequence, while tf.zeros\_like expects a tensor object.

**Quick Fix:** Use tf.zeros\_like(tensor) when matching another tensor's shape and dtype.

## **Best Practice**

Prefer tf.zeros\_like over manual shape retrieval (tf.zeros(tensor.shape)) to maintain graph traceability and automatic dtype inheritance.

## **Related Tasks**

> *   
  5. Create One-Filled Tensor (tf.ones / tf.ones\_like)  
> *   
  6. Create Constant-Filled Tensor (tf.fill)  
> *   
  7. Create Identity Matrix (tf.eye)

## **Official Documentation URL**

[https://www.tensorflow.org/api\_docs/python/tf/zeros](https://www.tensorflow.org/api_docs/python/tf/zeros)

## **Problem**

> 5. Create One-Filled Tensor (tf.ones / tf.ones\_like)

## **Trigger**

I need to instantiate a tensor where every element is set to 1, such as for multiplicative masks or unit initializations.

## **Primary APIs**

> * tf.ones  
> * tf.ones\_like

## **Snippet**

`import tensorflow as tf`

`ones = tf.ones(shape=(2, 3), dtype=tf.float32)`  
`ones_like = tf.ones_like(ones)`  
`print(ones_like)`

## **Minimal Notes**

Allocates a tensor filled entirely with ones matching a specified shape or reference tensor. Default dtype is tf.float32 unless specified otherwise.

## **Common Bug**

**Issue:** Unexpected tf.float32 data type when creating boolean masks with tf.ones.

**Cause:** Omitting the dtype argument causes tf.ones to default to tf.float32.

**Quick Fix:** Specify dtype=tf.bool explicitly when creating logical masks.

## **Best Practice**

Use tf.ones\_like to construct unit masks directly from dynamic intermediate tensors in custom layers.

## **Related Tasks**

> *   
  4. Create Zero-Filled Tensor (tf.zeros / tf.zeros\_like)  
> *   
  6. Create Constant-Filled Tensor (tf.fill)  
> *   
  25. Conditional Selection (tf.where)

## **Official Documentation URL**

[https://www.tensorflow.org/api\_docs/python/tf/ones](https://www.tensorflow.org/api_docs/python/tf/ones)

## **Problem**

> 6. Create Constant-Filled Tensor (tf.fill)

## **Trigger**

I need to initialize a tensor of arbitrary shape filled entirely with a single scalar value.

## **Primary APIs**

> * tf.fill

## **Snippet**

`import tensorflow as tf`

`filled = tf.fill(dims=(2, 3), value=7.0)`  
`print(filled)`

## **Minimal Notes**

Constructs a tensor matching dims and assigns value to every element. The output dtype is derived directly from the scalar argument passed to value.

## **Common Bug**

**Issue:** TypeError when trying to pass a non-scalar tensor as the value argument.

**Cause:** tf.fill requires a 0-D scalar value; passing multi-dimensional tensors is invalid.

**Quick Fix:** Pass a python scalar or zero-dimensional tensor, or use tf.broadcast\_to for non-scalar fills.

## **Best Practice**

Use tf.fill instead of tf.ones(...) \* scalar to eliminate redundant tensor multiplication operations during graph execution.

## **Related Tasks**

> *   
  4. Create Zero-Filled Tensor (tf.zeros / tf.zeros\_like)  
> *   
  5. Create One-Filled Tensor (tf.ones / tf.ones\_like)  
> *   
  26. Tensor Broadcasting Rules (implicit broadcasting)

## **Official Documentation URL**

[https://www.tensorflow.org/api\_docs/python/tf/fill](https://www.tensorflow.org/api_docs/python/tf/fill)

## **Problem**

> 7. Create Identity Matrix (tf.eye)

## **Trigger**

I need a 2D identity matrix or a batch of identity matrices with ones along the main diagonal and zeros elsewhere.

## **Primary APIs**

> * tf.eye

## **Snippet**

`import tensorflow as tf`

`identity = tf.eye(num_rows=3, num_columns=3, dtype=tf.float32)`  
`batch_identity = tf.eye(num_rows=2, batch_shape=[2], dtype=tf.float32)`  
`print(identity)`

## **Minimal Notes**

Generates 2D or batched identity matrices. Accepts optional rectangular dimensions via num\_columns and batch expansion via batch\_shape.

## **Common Bug**

**Issue:** ValueError when attempting matrix multiplication with non-matching batch dimensions.

**Cause:** Omitting batch\_shape produces a single 2D matrix that fails to broadcast cleanly over batched 3D matrix operations.

**Quick Fix:** Pass batch\_shape explicitly to match the leading batch dimensions of your target tensor.

## **Best Practice**

Specify batch\_shape directly inside tf.eye to avoid extra memory tile operations when constructing batched square matrices.

## **Related Tasks**

> *   
  4. Create Zero-Filled Tensor (tf.zeros / tf.zeros\_like)  
> *   
  23. Matrix Multiplication (tf.matmul)  
> *   
  26. Tensor Broadcasting Rules (implicit broadcasting)

## **Official Documentation URL**

[https://www.tensorflow.org/api\_docs/python/tf/eye](https://www.tensorflow.org/api_docs/python/tf/eye)

## **Problem**

> 8. Create Random Tensor (tf.random.uniform / tf.random.normal)

## **Trigger**

I need to generate stochastic values from uniform or normal distributions for parameter initialization or noise injection.

## **Primary APIs**

> * tf.random.uniform  
> * tf.random.normal

## **Snippet**

`import tensorflow as tf`

`tf.random.set_seed(42)`  
`uniform = tf.random.uniform(shape=(2, 2), minval=0.0, maxval=1.0, dtype=tf.float32)`  
`normal = tf.random.normal(shape=(2, 2), mean=0.0, stddev=1.0, dtype=tf.float32)`  
`print(uniform)`

## **Minimal Notes**

Draws random samples from specified probability distributions into a tensor of target shape. Accepts global and operation-level seeds for reproducible randomness.

## **Common Bug**

**Issue:** Non-reproducible random outputs across multiple execution runs despite setting seed.

**Cause:** Global runtime seeds are sensitive to operation ordering; local seeds behave differently across eager and graph modes.

**Quick Fix:** Use tf.random.set\_seed(seed) globally or employ tf.random.Generator objects for stateful, seed-safe generation.

## **Best Practice**

Use tf.random.Generator instances rather than functional random calls to ensure thread-safe determinism across distributed pipelines.

## **Related Tasks**

> *   
  1. Create Constant Tensor (tf.constant)  
> *   
  4. Create Zero-Filled Tensor (tf.zeros / tf.zeros\_like)  
> *   
  9. Create Ranged Tensor Sequences (tf.range / tf.linspace)

## **Official Documentation URL**

[https://www.tensorflow.org/api\_docs/python/tf/random/uniform](https://www.tensorflow.org/api_docs/python/tf/random/uniform)

## **Problem**

> 9. Create Ranged Tensor Sequences (tf.range / tf.linspace)

## **Trigger**

I need to construct a 1D tensor filled with linearly spaced numbers or evenly stepped sequence intervals.

## **Primary APIs**

> * tf.range  
> * tf.linspace

## **Snippet**

`import tensorflow as tf`

`ranged = tf.range(start=0, limit=10, delta=2, dtype=tf.int32)`  
`linear = tf.linspace(start=0.0, stop=1.0, num=5)`  
`print(ranged)`  
`print(linear)`

## **Minimal Notes**

tf.range creates sequence steps defined by delta up to but excluding limit. tf.linspace generates num evenly spaced points including both start and stop endpoints.

## **Common Bug**

**Issue:** InvalidArgumentError due to type mismatches between start, limit, and delta.

**Cause:** tf.range requires all numerical boundary arguments to share the exact same scalar data type.

**Quick Fix:** Cast all scalar inputs (start, limit, delta) to matching types or specify dtype explicitly.

## **Best Practice**

Use tf.linspace over tf.range when floating-point precision endpoint inclusion is required to prevent precision drift errors.

## **Related Tasks**

> *   
  1. Create Constant Tensor (tf.constant)  
> *   
  8. Create Random Tensor (tf.random.uniform / tf.random.normal)  
> *   
  17. Gather Tensor Elements (tf.gather)

## **Official Documentation URL**

[https://www.tensorflow.org/api\_docs/python/tf/range](https://www.tensorflow.org/api_docs/python/tf/range)

## **Problem**

> 10. Inspect Tensor Properties (shape, dtype, device, ndim, numpy())

## **Trigger**

I need to query tensor metadata or extract its underlying data as a standard NumPy array.

## **Primary APIs**

> * tf.Tensor.shape  
> * tf.Tensor.dtype  
> * tf.Tensor.device  
> * tf.Tensor.ndim  
> * tf.Tensor.numpy

## **Snippet**

`import tensorflow as tf`

`tensor = tf.constant([[1.0, 2.0], [3.0, 4.0]], dtype=tf.float32)`  
`print("Shape:", tensor.shape)`  
`print("Dtype:", tensor.dtype)`  
`print("Device:", tensor.device)`  
`print("NDim:", tensor.ndim)`  
`print("NumPy:", tensor.numpy())`

## **Minimal Notes**

Retrieves static structural properties via properties and returns memory placement via device. Calling .numpy() extracts a synchronous copy of tensor data as a NumPy array.

## **Common Bug**

**Issue:** AttributeError or execution failure when calling .numpy() inside symbolic graph functions (@tf.function).

**Cause:** Symbolic execution graphs do not possess actual runtime numpy backing arrays during graph compilation.

**Quick Fix:** Use TensorFlow operations instead of .numpy() when writing execution code within compiled functions.

## **Best Practice**

Avoid calling .numpy() during training loops to prevent costly CPU-GPU memory synchronization bottlenecks.

## **Related Tasks**

> *   
  3. Convert Existing Data to Tensor (tf.convert\_to\_tensor)  
> *   
  11. Reshape Tensor (tf.reshape)  
> *   
  28. Device Placement and Dtype Conversion (tf.device, tf.cast, tf.identity)

## **Official Documentation URL**

[https://www.tensorflow.org/api\_docs/python/tf/Tensor](https://www.tensorflow.org/api_docs/python/tf/Tensor)

## **Problem**

> 11. Reshape Tensor (tf.reshape)

## **Trigger**

I need to reconfigure tensor dimension sizes without altering element values or fundamental data layout.

## **Primary APIs**

> * tf.reshape

## **Snippet**

`import tensorflow as tf`

`x = tf.constant([1, 2, 3, 4, 5, 6])`  
`reshaped = tf.reshape(x, shape=(2, 3))`  
`print(reshaped)`

## **Minimal Notes**

Returns a new tensor with updated dimensions while leaving internal row-major memory order unchanged. Allows a single inferred axis using dimension size \-1.

## **Common Bug**

**Issue:** InvalidArgumentError when total target element count does not match original element count.

**Cause:** Reshaping requires the product of target shape dimensions to equal the exact total length of the original tensor.

**Quick Fix:** Verify total element count or place \-1 at a single unknown dimension position for automatic calculation.

## **Best Practice**

Use \-1 for dynamic batch dimensions ((-1, feature\_dim)) to allow code to generalize across varying batch sizes.

## **Related Tasks**

> *   
  12. Flatten Tensor Dimensions (tf.reshape)  
> *   
  13. Expand and Squeeze Dimensions (tf.expand\_dims / tf.squeeze)  
> *   
  14. Transpose Tensor Dimensions (tf.transpose)

## **Official Documentation URL**

[https://www.tensorflow.org/api\_docs/python/tf/reshape](https://www.tensorflow.org/api_docs/python/tf/reshape)

## **Problem**

> 12. Flatten Tensor Dimensions (tf.reshape)

## **Trigger**

I need to collapse a multi-dimensional tensor into a 1D vector or flatten spatial features into 2D batch matrices.

## **Primary APIs**

> * tf.reshape

## **Snippet**

`import tensorflow as tf`

`x = tf.constant([[[1, 2], [3, 4]], [[5, 6], [7, 8]]])`  
`flattened_1d = tf.reshape(x, shape=[-1])`  
`flattened_batch = tf.reshape(x, shape=[x.shape[0], -1])`  
`print(flattened_1d)`  
`print(flattened_batch)`

## **Minimal Notes**

Collapses contiguous dimensions into single vector representation using \[-1\] or \[batch\_size, \-1\]. Preserves original data order without copying underlying buffers when possible.

## **Common Bug**

**Issue:** Unintended swapping or corruption of spatial elements when flattening spatial tensors without prior axis transposition.

**Cause:** tf.reshape flattens in row-major order; flattening channels-first data directly can scramble feature spatial mappings.

**Quick Fix:** Transpose axes with tf.transpose to contiguous target ordering prior to calling tf.reshape.

## **Best Practice**

Specify shape=\[tf.shape(x)\[0\], \-1\] dynamically when flattening layer outputs to handle dynamic inference batch sizes correctly.

## **Related Tasks**

> *   
  11. Reshape Tensor (tf.reshape)  
> *   
  13. Expand and Squeeze Dimensions (tf.expand\_dims / tf.squeeze)  
> *   
  14. Transpose Tensor Dimensions (tf.transpose)

## **Official Documentation URL**

[https://www.tensorflow.org/api\_docs/python/tf/reshape](https://www.tensorflow.org/api_docs/python/tf/reshape)

## **Problem**

> 13. Expand and Squeeze Dimensions (tf.expand\_dims / tf.squeeze)

## **Trigger**

I need to insert a outer batch axis or eliminate redundant singleton dimensions of size 1\.

## **Primary APIs**

> * tf.expand\_dims  
> * tf.squeeze

## **Snippet**

`import tensorflow as tf`

`x = tf.constant([1.0, 2.0, 3.0])`  
`expanded = tf.expand_dims(x, axis=0)`  
`squeezed = tf.squeeze(expanded, axis=0)`  
`print("Expanded Shape:", expanded.shape)`  
`print("Squeezed Shape:", squeezed.shape)`

## **Minimal Notes**

tf.expand\_dims inserts a length-1 axis at axis. tf.squeeze removes all or explicitly listed length-1 dimensions from the tensor shape.

## **Common Bug**

**Issue:** InvalidArgumentError when calling tf.squeeze on an axis whose dimension length is greater than 1\.

**Cause:** Axis targeted for squeezing is not a single-element dummy dimension at runtime.

**Quick Fix:** Provide explicit axis parameters to tf.squeeze and verify tensor shape metadata beforehand.

## **Best Practice**

Explicitly pass targeted axis arguments to tf.squeeze instead of removing all single-dimension axes blindly.

## **Related Tasks**

> *   
  11. Reshape Tensor (tf.reshape)  
> *   
  14. Transpose Tensor Dimensions (tf.transpose)  
> *   
  15. Concatenate and Stack Dimensions (tf.concat / tf.stack)

## **Official Documentation URL**

[https://www.tensorflow.org/api\_docs/python/tf/expand\_dims](https://www.tensorflow.org/api_docs/python/tf/expand_dims)

## **Problem**

> 14. Transpose Tensor Dimensions (tf.transpose)

## **Trigger**

I need to reorder or permute specific axes of a multi-dimensional tensor, such as converting between NCHW and NHWC formats.

## **Primary APIs**

> * tf.transpose

## **Snippet**

`import tensorflow as tf`

`x = tf.constant([[[1, 2]], [[3, 4]]])  # Shape (2, 1, 2)`  
`transposed = tf.transpose(x, perm=[0, 2, 1])`  
`print("Transposed Shape:", transposed.shape)`

## **Minimal Notes**

Permutes dimensions according to the index order specified in perm. Reverses all dimensions completely if perm is omitted.

## **Common Bug**

**Issue:** Silent bugs or incorrect spatial calculation results following shape modification.

**Cause:** Confusing tf.transpose (reordering underlying data layout) with tf.reshape (reinterpreting existing dimensions).

**Quick Fix:** Use tf.transpose when physical axis ordering must change, and tf.reshape strictly for view alterations.

## **Best Practice**

Keep track of axis indices using explicit comments or axis constants when calling tf.transpose on rank-4 or rank-5 tensors.

## **Related Tasks**

> *   
  11. Reshape Tensor (tf.reshape)  
> *   
  13. Expand and Squeeze Dimensions (tf.expand\_dims / tf.squeeze)  
> *   
  21. Tile Tensor (tf.tile)

## **Official Documentation URL**

[https://www.tensorflow.org/api\_docs/python/tf/transpose](https://www.tensorflow.org/api_docs/python/tf/transpose)

## **Problem**

> 15. Concatenate and Stack Dimensions (tf.concat / tf.stack)

## **Trigger**

I need to combine multiple tensors along an existing axis or join them along a brand new dimension.

## **Primary APIs**

> * tf.concat  
> * tf.stack

## **Snippet**

`import tensorflow as tf`

`a = tf.constant([[1, 2]])`  
`b = tf.constant([[3, 4]])`  
`concatenated = tf.concat([a, b], axis=0)`  
`stacked = tf.stack([a, b], axis=0)`  
`print("Concat Shape:", concatenated.shape)`  
`print("Stack Shape:", stacked.shape)`

## **Minimal Notes**

tf.concat joins tensors along an existing axis without changing total rank. tf.stack creates a new axis at specified axis, increasing total rank by 1\.

## **Common Bug**

**Issue:** InvalidArgumentError due to mismatched dimension sizes among input tensors.

**Cause:** tf.concat requires all non-concatenated dimensions to match exactly; tf.stack requires all shapes to be identical.

**Quick Fix:** Check input tensor shapes and adjust non-matching dimensions using padding or slicing before joining.

## **Best Practice**

Use tf.concat for appending features along existing axes, and tf.stack when creating batched representations from list elements.

## **Related Tasks**

> *   
  13. Expand and Squeeze Dimensions (tf.expand\_dims / tf.squeeze)  
> *   
  16. Split Tensor (tf.split)  
> *   
  20. Pad Tensor (tf.pad)

## **Official Documentation URL**

[https://www.tensorflow.org/api\_docs/python/tf/concat](https://www.tensorflow.org/api_docs/python/tf/concat)

## **Problem**

> 16. Split Tensor (tf.split)

## **Trigger**

I need to divide a single tensor into multiple equal or custom-sized sub-tensors along a targeted dimension.

## **Primary APIs**

> * tf.split

## **Snippet**

`import tensorflow as tf`

`x = tf.constant([10, 20, 30, 40, 50, 60])`  
`splits = tf.split(x, num_or_size_splits=3, axis=0)`  
`print(splits)`

## **Minimal Notes**

Splits value into sub-tensors along axis. Accepts an integer count for equal splits or a 1D list of sizes for custom lengths.

## **Common Bug**

**Issue:** InvalidArgumentError when passing an integer split count that does not divide target axis length evenly.

**Cause:** Passing integer N requires the target dimension length to be evenly divisible by N.

**Quick Fix:** Pass a list of specific integer split lengths (num\_or\_size\_splits=\[2, 4\]) if split sizes are unequal.

## **Best Practice**

Use list-based split sizes to handle variable length sequence inputs safely when splitting dynamic dynamic tensors.

## **Related Tasks**

> *   
  15. Concatenate and Stack Dimensions (tf.concat / tf.stack)  
> *   
  17. Gather Tensor Elements (tf.gather)  
> *   
  19. Slice Tensor (tf.slice / tensor slicing)

## **Official Documentation URL**

[https://www.tensorflow.org/api\_docs/python/tf/split](https://www.tensorflow.org/api_docs/python/tf/split)

## **Problem**

> 17. Gather Tensor Elements (tf.gather)

## **Trigger**

I need to look up or select specific slices from a tensor using integer index slices along a specified axis.

## **Primary APIs**

> * tf.gather

## **Snippet**

`import tensorflow as tf`

`params = tf.constant([[10, 20], [30, 40], [50, 60]])`  
`indices = tf.constant([0, 2])`  
`gathered = tf.gather(params, indices, axis=0)`  
`print(gathered)`

## **Minimal Notes**

Gathers slices from params along axis according to integer indices. Output shape combines index dimensions with remaining non-gathered param dimensions.

## **Common Bug**

**Issue:** InvalidArgumentError or runtime crash due to out-of-bounds indices.

**Cause:** Index values equal or exceed the size of the target dimension along specified axis.

**Quick Fix:** Ensure index elements remain strictly within \[0, params.shape\[axis\] \- 1\] bounds before gathering.

## **Best Practice**

Prefer tf.gather over manual loop indexing for efficient GPU-accelerated sparse lookups and embedding retrieval.

## **Related Tasks**

> *   
  18. Scatter Tensor Updates (tf.tensor\_scatter\_nd\_update)  
> *   
  19. Slice Tensor (tf.slice / tensor slicing)  
> *   
  25. Conditional Selection (tf.where)

## **Official Documentation URL**

[https://www.tensorflow.org/api\_docs/python/tf/gather](https://www.tensorflow.org/api_docs/python/tf/gather)

## **Problem**

> 18. Scatter Tensor Updates (tf.tensor\_scatter\_nd\_update)

## **Trigger**

I need to insert updated values into specific multi-dimensional slice indices of an existing immutable tensor.

## **Primary APIs**

> * tf.tensor\_scatter\_nd\_update

## **Snippet**

`import tensorflow as tf`

`tensor = tf.constant([1, 2, 3, 4, 5])`  
`indices = tf.constant([[1], [3]])`  
`updates = tf.constant([20, 40])`  
`updated = tf.tensor_scatter_nd_update(tensor, indices, updates)`  
`print(updated)`

## **Minimal Notes**

Returns a new tensor with values at indices replaced by values in updates. Does not mutate the original input tensor in memory.

## **Common Bug**

**Issue:** InvalidArgumentError caused by mismatched shape between updates and target indices locations.

**Cause:** Outer dimensions of updates must match leading dimensions of indices, and trailing dimensions must match sliced target rank.

**Quick Fix:** Ensure updates.shape matches indices.shape\[:-1\] \+ tensor.shape\[indices.shape\[-1\]:\].

## **Best Practice**

Use tf.tensor\_scatter\_nd\_update for functional graph-compatible tensor modifications instead of attempting direct item assignments.

## **Related Tasks**

> *   
  17. Gather Tensor Elements (tf.gather)  
> *   
  19. Slice Tensor (tf.slice / tensor slicing)  
> *   
  25. Conditional Selection (tf.where)

## **Official Documentation URL**

[https://www.tensorflow.org/api\_docs/python/tf/tensor\_scatter\_nd\_update](https://www.tensorflow.org/api_docs/python/tf/tensor_scatter_nd_update)

## **Problem**

> 19. Slice Tensor (tf.slice / tensor slicing)

## **Trigger**

I need to extract a continuous sub-tensor using start indices and explicit size lengths or standard Python slicing syntax.

## **Primary APIs**

> * tf.slice

## **Snippet**

`import tensorflow as tf`

`x = tf.constant([[1, 2, 3], [4, 5, 6]])`  
`sliced_func = tf.slice(x, begin=[0, 1], size=[2, 2])`  
`sliced_syntax = x[0:2, 1:3]`  
`print(sliced_func)`

## **Minimal Notes**

Extracts a continuous sub-region starting at begin of length size. Passing \-1 inside size extracts all remaining elements along that axis.

## **Common Bug**

**Issue:** InvalidArgumentError when begin\[i\] \+ size\[i\] exceeds dimension bounds.

**Cause:** Requested slice offsets and extent lengths go outside tensor shape limits.

**Quick Fix:** Use standard Python indexing syntax (x\[start:stop\]) or pass \-1 in size to slice automatically to dimension ends.

## **Best Practice**

Use Python slicing notation (x\[..., 0:10\]) for cleaner code readability unless functional graph primitives are required explicitly.

## **Related Tasks**

> *   
  16. Split Tensor (tf.split)  
> *   
  17. Gather Tensor Elements (tf.gather)  
> *   
  20. Pad Tensor (tf.pad)

## **Official Documentation URL**

[https://www.tensorflow.org/api\_docs/python/tf/slice](https://www.tensorflow.org/api_docs/python/tf/slice)

## **Problem**

> 20. Pad Tensor (tf.pad)

## **Trigger**

I need to extend tensor outer boundaries with zeros or custom constants for sequence alignment or spatial convolutions.

## **Primary APIs**

> * tf.pad

## **Snippet**

`import tensorflow as tf`

`x = tf.constant([[1, 2], [3, 4]])`  
`paddings = tf.constant([[1, 1], [2, 2]])`  
`padded = tf.pad(x, paddings, mode="CONSTANT", constant_values=0)`  
`print(padded)`

## **Minimal Notes**

Extends tensor axes using explicit boundary pairs defined in paddings. Supports modes CONSTANT, REFLECT, and SYMMETRIC.

## **Common Bug**

**Issue:** InvalidArgumentError due to incorrect paddings shape configuration.

**Cause:** paddings tensor must have rank 2 with dimensions (N, 2), where N matches target tensor rank exactly.

**Quick Fix:** Ensure paddings contains exactly one \[before, after\] length pair for every dimension in the target tensor.

## **Best Practice**

Specify constant\_values explicitly when padding non-zero default feature tensors to prevent unexpected value corruption.

## **Related Tasks**

> *   
  15. Concatenate and Stack Dimensions (tf.concat / tf.stack)  
> *   
  19. Slice Tensor (tf.slice / tensor slicing)  
> *   
  21. Tile Tensor (tf.tile)

## **Official Documentation URL**

[https://www.tensorflow.org/api\_docs/python/tf/pad](https://www.tensorflow.org/api_docs/python/tf/pad)

## **Problem**

> 21. Tile Tensor (tf.tile)

## **Trigger**

I need to construct a larger tensor by repeatedly replicating an existing tensor along its dimensions.

## **Primary APIs**

> * tf.tile

## **Snippet**

`import tensorflow as tf`

`x = tf.constant([[1, 2], [3, 4]])`  
`tiled = tf.tile(x, multiples=[2, 3])`  
`print(tiled)`

## **Minimal Notes**

Constructs a new tensor by copying input data multiples\[i\] times along dimension i. Output shape dimension i becomes input.shape\[i\] \* multiples\[i\].

## **Common Bug**

**Issue:** Excessive memory allocation or runtime slowdown during execution.

**Cause:** Tiling physically duplicates data buffers in memory, consuming extensive bandwidth compared to implicit broadcasting.

**Quick Fix:** Use implicit broadcasting or tf.broadcast\_to instead of physical memory tiling where possible.

## **Best Practice**

Prefer broadcasting semantics over tf.tile to avoid unnecessarily allocating duplicated memory buffers on accelerator devices.

## **Related Tasks**

> *   
  14. Transpose Tensor Dimensions (tf.transpose)  
> *   
  20. Pad Tensor (tf.pad)  
> *   
  27. Repeat Tensor Values (tf.repeat)

## **Official Documentation URL**

[https://www.tensorflow.org/api\_docs/python/tf/tile](https://www.tensorflow.org/api_docs/python/tf/tile)

## **Problem**

> 22. Element-wise Arithmetic (tf.add, tf.subtract, tf.multiply, tf.divide)

## **Trigger**

I need to execute fundamental element-by-element arithmetic operations across two input tensors.

## **Primary APIs**

> * tf.add  
> * tf.subtract  
> * tf.multiply  
> * tf.divide

## **Snippet**

`import tensorflow as tf`

`a = tf.constant([10.0, 20.0])`  
`b = tf.constant([2.0, 4.0])`  
`add_res = tf.add(a, b)`  
`sub_res = tf.subtract(a, b)`  
`mul_res = tf.multiply(a, b)`  
`div_res = tf.divide(a, b)`  
`print(add_res)`  
`print(div_res)`

## **Minimal Notes**

Performs point-wise arithmetic matching standard Python operators (+, \-, \*, /). Implicitly broadcasts compatible operand shapes automatically.

## **Common Bug**

**Issue:** TypeError when performing arithmetic between tensors with mismatched data types.

**Cause:** TensorFlow does not perform implicit type casting between different numerical types like float32 and int32.

**Quick Fix:** Cast operands to matching data types using tf.cast(x, dtype) prior to arithmetic calls.

## **Best Practice**

Use standard Python math operators (a \+ b, a \* b) for code clarity, as TensorFlow maps them directly to functional API calls.

## **Related Tasks**

> *   
  23. Matrix Multiplication (tf.matmul)  
> *   
  24. Reduction Operations (tf.reduce\_sum, tf.reduce\_mean, tf.reduce\_max, tf.argmax)  
> *   
  26. Tensor Broadcasting Rules (implicit broadcasting)

## **Official Documentation URL**

[https://www.tensorflow.org/api\_docs/python/tf/math/add](https://www.tensorflow.org/api_docs/python/tf/math/add)

## **Problem**

> 23. Matrix Multiplication (tf.matmul)

## **Trigger**

I need to perform linear algebra matrix products or batched matrix multiplications between compatible 2D or higher rank tensors.

## **Primary APIs**

> * tf.matmul

## **Snippet**

`import tensorflow as tf`

`a = tf.constant([[1.0, 2.0], [3.0, 4.0]])`  
`b = tf.constant([[5.0, 6.0], [7.0, 8.0]])`  
`product = tf.matmul(a, b)`  
`print(product)`

## **Minimal Notes**

Computes the matrix product of a and b. Supports internal transposition flags transpose\_a and transpose\_b for optimized computations without explicit extra transpose calls.

## **Common Bug**

**Issue:** InvalidArgumentError caused by inner matrix dimension mismatches.

**Cause:** Matrix multiplication requires trailing dimension of a to equal leading inner dimension of b ((..., M, K) @ (..., K, N)).

**Quick Fix:** Adjust dimensions or toggle boolean flags transpose\_a=True or transpose\_b=True within tf.matmul.

## **Best Practice**

Use transpose\_b=True inside tf.matmul when multiplying by transposed weight matrices to save explicit memory rearrangement ops.

## **Related Tasks**

> *   
  7. Create Identity Matrix (tf.eye)  
> *   
  14. Transpose Tensor Dimensions (tf.transpose)  
> *   
  22. Element-wise Arithmetic (tf.add, tf.subtract, tf.multiply, tf.divide)

## **Official Documentation URL**

[https://www.tensorflow.org/api\_docs/python/tf/linalg/matmul](https://www.tensorflow.org/api_docs/python/tf/linalg/matmul)

## **Problem**

> 24. Reduction Operations (tf.reduce\_sum, tf.reduce\_mean, tf.reduce\_max, tf.argmax)

## **Trigger**

I need to compute aggregate summary statistics or locate extremum indices across specified tensor axes.

## **Primary APIs**

> * tf.reduce\_sum  
> * tf.reduce\_mean  
> * tf.reduce\_max  
> * tf.argmax

## **Snippet**

`import tensorflow as tf`

`x = tf.constant([[1.0, 2.0], [3.0, 4.0]])`  
`total_sum = tf.reduce_sum(x, axis=1)`  
`mean_val = tf.reduce_mean(x)`  
`max_idx = tf.argmax(x, axis=1)`  
`print("Sum:", total_sum)`  
`print("Mean:", mean_val)`  
`print("Argmax:", max_idx)`

## **Minimal Notes**

Reduces tensor rank across specified axes by applying summary functions. Setting keepdims=True retains reduced axes as size 1 for easy downstream broadcasting.

## **Common Bug**

**Issue:** Shape misalignment errors when combining reduced statistics back with original unreduced tensors.

**Cause:** Reduction operations drop target axes by default, altering total output tensor rank.

**Quick Fix:** Pass keepdims=True in reduction calls to preserve original tensor dimensionality for easy broadcast operations.

## **Best Practice**

Specify axis explicitly in all reduction calls to ensure consistent results across varying tensor ranks.

## **Related Tasks**

> *   
  22. Element-wise Arithmetic (tf.add, tf.subtract, tf.multiply, tf.divide)  
> *   
  25. Conditional Selection (tf.where)  
> *   
  26. Tensor Broadcasting Rules (implicit broadcasting)

## **Official Documentation URL**

[https://www.tensorflow.org/api\_docs/python/tf/math/reduce\_sum](https://www.tensorflow.org/api_docs/python/tf/math/reduce_sum)

## **Problem**

> 25. Conditional Selection (tf.where)

## **Trigger**

I need to choose tensor values conditionally based on a boolean mask or gather coordinates of true elements.

## **Primary APIs**

> * tf.where

## **Snippet**

`import tensorflow as tf`

`condition = tf.constant([True, False, True])`  
`x = tf.constant([10, 20, 30])`  
`y = tf.constant([100, 200, 300])`  
`selected = tf.where(condition, x, y)`  
`print(selected)`

## **Minimal Notes**

Selects values from x or y based on condition. If only condition is passed, returns the multi-dimensional integer indices of all True entries.

## **Common Bug**

**Issue:** InvalidArgumentError when condition, x, and y shapes cannot broadcast together cleanly.

**Cause:** All non-None inputs to tf.where must share identical shapes or follow valid broadcasting rules.

**Quick Fix:** Verify operand shapes or use tf.broadcast\_to to align shapes prior to conditional selection.

## **Best Practice**

Use tf.where with scalar fallbacks for safe thresholding and gradient-safe conditional operations in custom loss functions.

## **Related Tasks**

> *   
  17. Gather Tensor Elements (tf.gather)  
> *   
  18. Scatter Tensor Updates (tf.tensor\_scatter\_nd\_update)  
> *   
  24. Reduction Operations (tf.reduce\_sum, tf.reduce\_mean, tf.reduce\_max, tf.argmax)

## **Official Documentation URL**

[https://www.tensorflow.org/api\_docs/python/tf/where](https://www.tensorflow.org/api_docs/python/tf/where)

## **Problem**

> 26. Tensor Broadcasting Rules (implicit broadcasting)

## **Trigger**

I need to execute element-wise operations between tensors of differing shapes without manually replicating data buffers.

## **Primary APIs**

> * Implicit broadcasting in TensorFlow operations (tf.add, tf.multiply, etc.)

## **Snippet**

`import tensorflow as tf`

`a = tf.constant([[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]])  # Shape (2, 3)`  
`b = tf.constant([10.0, 20.0, 30.0])                   # Shape (3,)`  
`result = a + b  # b is implicitly broadcast across rows of a`  
`print(result)`

## **Minimal Notes**

Automatically expands trailing dimensions of size 1 or missing leading axes to match larger operand shapes without allocating duplicate memory. Dimensions match if they are equal or if one is 1\.

## **Common Bug**

**Issue:** InvalidArgumentError during element-wise operations on incompatible tensor shapes.

**Cause:** Dimensions compared from right-to-left are neither equal nor equal to 1\.

**Quick Fix:** Use tf.expand\_dims to add missing size-1 axes until right-aligned dimensions satisfy broadcasting rules.

## **Best Practice**

Rely on implicit broadcasting rather than explicit tiling calls (tf.tile) to minimize memory allocation and maximize performance on accelerators.

## **Related Tasks**

> *   
  13. Expand and Squeeze Dimensions (tf.expand\_dims / tf.squeeze)  
> *   
  21. Tile Tensor (tf.tile)  
> *   
  22. Element-wise Arithmetic (tf.add, tf.subtract, tf.multiply, tf.divide)

## **Official Documentation URL**

[https://www.tensorflow.org/guide/tensor\#broadcasting](https://www.google.com/search?q=https://www.tensorflow.org/guide/tensor%23broadcasting)

## **Problem**

> 27. Repeat Tensor Values (tf.repeat)

## **Trigger**

I need to duplicate individual elements of a tensor sequentially along a targeted axis.

## **Primary APIs**

> * tf.repeat

## **Snippet**

`import tensorflow as tf`

`x = tf.constant([[1, 2], [3, 4]])`  
`repeated = tf.repeat(x, repeats=2, axis=0)`  
`print(repeated)`

## **Minimal Notes**

Duplicates elements along axis sequentially repeats times. Unlike tf.tile which replicates the entire block, tf.repeat duplicates each item inline.

## **Common Bug**

**Issue:** Confusing tf.repeat with tf.tile resulting in incorrect element ordering.

**Cause:** tf.repeat duplicates elements contiguously (\[A, A, B, B\]), whereas tf.tile duplicates entire structure sequences (\[A, B, A, B\]).

**Quick Fix:** Use tf.repeat for inline element replication and tf.tile for whole-tensor block tiling.

## **Best Practice**

Use tf.repeat for expanding label sequences or unspooling batch items to match dynamic target lengths.

## **Related Tasks**

> *   
  21. Tile Tensor (tf.tile)  
> *   
  26. Tensor Broadcasting Rules (implicit broadcasting)  
> *   
  28. Device Placement and Dtype Conversion (tf.device, tf.cast, tf.identity)

## **Official Documentation URL**

[https://www.tensorflow.org/api\_docs/python/tf/repeat](https://www.tensorflow.org/api_docs/python/tf/repeat)

## **Problem**

> 28. Device Placement and Dtype Conversion (tf.device, tf.cast, tf.identity)

## **Trigger**

I need to convert a tensor's precision or place its memory explicitly on a specific hardware device.

## **Primary APIs**

> * tf.cast  
> * tf.device  
> * tf.identity

## **Snippet**

`import tensorflow as tf`

`x = tf.constant([1, 2, 3], dtype=tf.int32)`  
`x_float = tf.cast(x, dtype=tf.float32)`

`with tf.device("/CPU:0"):`  
    `y = tf.identity(x_float)`

`print(y.dtype)`  
`print(y.device)`

## **Minimal Notes**

tf.cast converts numeric precision. tf.device scopes device allocation, and tf.identity forces tensor copying or explicit placement binding.

## **Common Bug**

**Issue:** Device placement contexts silently ignored for standard constant initializations.

**Cause:** Some operations default to host CPU placement regardless of surrounding tf.device scopes if device kernel implementations are absent.

**Quick Fix:** Wrap variables or compute ops inside tf.device and use tf.identity to enforce explicit target placement copies.

## **Best Practice**

Perform precision casting (tf.cast) explicitly before passing tensors to ops to prevent unexpected implicit conversion overhead.

## **Related Tasks**

> *   
  1. Create Constant Tensor (tf.constant)  
> *   
  3. Convert Existing Data to Tensor (tf.convert\_to\_tensor)  
> *   
  10. Inspect Tensor Properties (shape, dtype, device, ndim, numpy())

## **Official Documentation URL**

[https://www.tensorflow.org/api\_docs/python/tf/cast](https://www.tensorflow.org/api_docs/python/tf/cast)

---

