# **PyTorch Tensor Operations Cheatsheet**

### **Tensor Creation**

## **Problem**

Create Tensor from Python Sequence (torch.tensor)

## **Trigger**

I need to convert a Python list or tuple into a PyTorch tensor with an explicit device or data type.

## **Snippet**

`import torch`

`data = [[1.0, 2.0], [3.0, 4.0]]`  
`x = torch.tensor(data, dtype=torch.float32, device="cpu")`  
`print(x)`

## **Minimal Notes**

Always constructs a new tensor by copying the underlying sequence data. Infers data type automatically if dtype is not provided.

## **Common Bug**

**Issue:** Slower performance and high memory overhead when converting large Python lists inside training loops.

**Cause:** Python lists store elements non-contiguously, forcing element-by-element iteration and memory allocation.

**Quick Fix:** Convert the Python list to a NumPy array first or use pre-allocated tensors.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.tensor.html](https://pytorch.org/docs/stable/generated/torch.tensor.html)

## **Problem**

Create Tensor from Existing Data avoiding copies (torch.as\_tensor)

## **Trigger**

I want to wrap an existing array or tensor into a PyTorch tensor while preserving memory layout and avoiding redundant allocation.

## **Snippet**

`import numpy as np`  
`import torch`

`arr = np.array([1, 2, 3])`  
`x = torch.as_tensor(arr, dtype=torch.int64)`  
`print(x)`

## **Minimal Notes**

Avoids memory copy when the input is already a tensor or NumPy array matching target dtype and device. Allocates new memory only if data conversion or device movement is necessary.

## **Common Bug**

**Issue:** Modifying the created tensor unexpectedly mutates the original source data array.

**Cause:** torch.as\_tensor shares underlying memory with NumPy arrays or existing tensors when no conversion occurs.

**Quick Fix:** Call torch.clone() or use torch.tensor() if independent memory storage is required.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.as\_tensor.html](https://pytorch.org/docs/stable/generated/torch.as_tensor.html)

## **Problem**

Create Tensor from NumPy Array with Zero-Copy (torch.from\_numpy)

## **Trigger**

I need to directly wrap a NumPy ndarray into a PyTorch tensor with zero-copy memory sharing.

## **Snippet**

`import numpy as np`  
`import torch`

`np_arr = np.array([1.0, 2.0, 3.0], dtype=np.float32)`  
`x = torch.from_numpy(np_arr)`  
`print(x)`

## **Minimal Notes**

Shares the same memory storage buffer between NumPy and PyTorch. The resulting tensor cannot be resized and is placed on the CPU device.

## **Common Bug**

**Issue:** TypeError or unexpected mutation when passing non-writable or non-contiguous NumPy arrays.

**Cause:** The input NumPy array is read-only or not stored in standard C-contiguous layout.

**Quick Fix:** Pass np.ascontiguousarray(arr) or copy the array prior to calling torch.from\_numpy.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.from\_numpy.html](https://pytorch.org/docs/stable/generated/torch.from_numpy.html)

## **Problem**

Create Zero-Filled Tensor (torch.zeros / torch.zeros\_like)

## **Trigger**

I need to initialize a tensor completely filled with zero values for accumulators or buffers.

## **Snippet**

`import torch`

`x = torch.zeros((2, 3), dtype=torch.float32)`  
`ref = torch.empty((2, 3))`  
`x_like = torch.zeros_like(ref)`  
`print(x)`

## **Minimal Notes**

Explicitly initializes every memory location to zero value. zeros\_like mirrors the target tensor shape, data type, and device placement unless overridden.

## **Common Bug**

**Issue:** High CPU or CUDA overhead when allocating zero buffers repeatedly inside loops.

**Cause:** Instantiating new memory allocations on every iteration causes unnecessary memory fragmentation and kernel launch overhead.

**Quick Fix:** Allocate the zero buffer once outside the loop and call tensor.zero\_() to reset in place.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.zeros.html](https://pytorch.org/docs/stable/generated/torch.zeros.html)

## **Problem**

Create One-Filled Tensor (torch.ones / torch.ones\_like)

## **Trigger**

I need a tensor pre-filled entirely with value 1.0 for masking, scaling, or initialization.

## **Snippet**

`import torch`

`x = torch.ones((2, 3), dtype=torch.float32)`  
`ref = torch.empty((2, 3))`  
`x_like = torch.ones_like(ref)`  
`print(x)`

## **Minimal Notes**

Allocates tensor memory and sets all values to one. Use ones\_like to automatically match another tensor's attributes.

## **Common Bug**

**Issue:** Incompatible data types when combining integer filled ones with floating point tensors.

**Cause:** Default dtype without specification inherits integer type or default float type depending on global configuration.

**Quick Fix:** Specify dtype=torch.float32 explicitly in the creator call.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.ones.html](https://pytorch.org/docs/stable/generated/torch.ones.html)

## **Problem**

Create Uninitialized Tensor Memory (torch.empty / torch.empty\_like)

## **Trigger**

I need fast buffer allocation without paying the cost of memory initialization.

## **Snippet**

`import torch`

`x = torch.empty((2, 3), dtype=torch.float32)`  
`ref = torch.ones((2, 3))`  
`x_like = torch.empty_like(ref)`  
`print(x.shape)`

## **Minimal Notes**

Allocates uninitialized storage memory instantly containing garbage values. Fastest tensor allocation method when you plan to immediately overwrite every entry.

## **Common Bug**

**Issue:** NaN values or non-deterministic calculation results in model forward pass.

**Cause:** Reading or performing math on uninitialized tensor memory before writing data into it.

**Quick Fix:** Ensure every index is overwritten using copy or in-place ops before reading from the tensor.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.empty.html](https://pytorch.org/docs/stable/generated/torch.empty.html)

## **Problem**

Create Constant-Filled Tensor (torch.full / torch.full\_like)

## **Trigger**

I need to allocate a tensor where every entry is initialized to a specific scalar value.

## **Snippet**

`import torch`

`x = torch.full((2, 3), fill_value=3.14, dtype=torch.float32)`  
`ref = torch.empty((2, 3))`  
`x_like = torch.full_like(ref, fill_value=-1.0)`  
`print(x)`

## **Minimal Notes**

Fills all tensor entries with the provided scalar value. Automatically converts fill scalar to match requested tensor dtype.

## **Common Bug**

**Issue:** Scalar truncation or loss of precision when setting floating point fill values.

**Cause:** Default dtype inference when omitted might resolve to an integer tensor matching integer inputs.

**Quick Fix:** Explicitly pass floating point data type like dtype=torch.float32.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.full.html](https://www.google.com/search?q=https://pytorch.org/docs/stable/generated/torch.full.html)

## **Problem**

Create Random Tensor (torch.rand / torch.randn / torch.randint)

## **Trigger**

I need to initialize random tensor values using uniform, normal, or discrete integer distributions.

## **Snippet**

`import torch`

`unif = torch.rand((2, 3))`  
`norm = torch.randn((2, 3))`  
`ints = torch.randint(low=0, high=10, size=(2, 3))`  
`print(unif.shape, norm.shape, ints.shape)`

## **Minimal Notes**

rand samples Uniform(0, 1), randn samples Standard Normal(0, 1), and randint samples discrete integers. Always set PRNG seed for reproducible experiments.

## **Common Bug**

**Issue:** Non-reproducible random initialization across model training runs.

**Cause:** Calling random generation functions without fixing global or local PRNG seeds.

**Quick Fix:** Use torch.manual\_seed(42) or pass a explicit torch.Generator instance.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.rand.html](https://pytorch.org/docs/stable/generated/torch.rand.html)

## **Problem**

Create Ranged Tensor Sequences (torch.arange / torch.linspace)

## **Trigger**

I need to construct 1D sequence tensors with fixed steps or fixed point counts.

## **Snippet**

`import torch`

`seq_step = torch.arange(start=0, end=10, step=2)`  
`seq_line = torch.linspace(start=0.0, end=1.0, steps=5)`  
`print(seq_step, seq_line)`

## **Minimal Notes**

arange generates values in half-open interval \[start, end) using a fixed step. linspace generates steps evenly spaced points across closed interval \[start, end\].

## **Common Bug**

**Issue:** Off-by-one errors or floating point rounding precision bugs when specifying steps in arange.

**Cause:** Floating point accumulation errors can cause the final boundary element to be unexpectedly included or excluded.

**Quick Fix:** Use torch.linspace when specifying exact start, end, and point counts.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.arange.html](https://pytorch.org/docs/stable/generated/torch.arange.html)

### **Inspection**

## **Problem**

Inspect Tensor Properties (shape, dtype, device, layout, ndim, numel, stride, is\_contiguous)

## **Trigger**

I need to inspect tensor metadata including dimensions, data type, storage layout, and memory stride.

## **Snippet**

`import torch`

`x = torch.randn(2, 3, 4)`  
`print(f"Shape: {x.shape}, Dtype: {x.dtype}, Device: {x.device}")`  
`print(f"Dims: {x.ndim}, Elements: {x.numel()}, Strides: {x.stride()}, Contiguous: {x.is_contiguous()}")`

## **Minimal Notes**

shape returns a torch.Size tuple representing dimensions. stride shows memory step sizes required to move along each dimension.

## **Common Bug**

**Issue:** Calling .size without invocation parentheses or treating property as method incorrectly.

**Cause:** x.shape is an attribute property while x.size() is a method call, though both return torch.Size.

**Quick Fix:** Standardize on property attributes like x.shape, x.dtype, and x.device.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/tensors.html](https://pytorch.org/docs/stable/tensors.html)

### **Shape Operations**

## **Problem**

Reshape Contiguous Tensor View (torch.view / view\_as)

## **Trigger**

I need to change tensor dimensions without copying memory or allocating new storage.

## **Snippet**

`import torch`

`x = torch.arange(12)`  
`reshaped = x.view(3, 4)`  
`print(reshaped.shape)`

## **Minimal Notes**

Returns a zero-copy view sharing original memory. Requires tensor to be memory contiguous before execution.

## **Common Bug**

**Issue:** RuntimeError: view size is not compatible with input tensor's size and stride.

**Cause:** Calling .view() on a non-contiguous tensor produced by operations like transpose or permute.

**Quick Fix:** Call .contiguous() before calling .view(), or use torch.reshape().

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.Tensor.view.html](https://pytorch.org/docs/stable/generated/torch.Tensor.view.html)

## **Problem**

Reshape Tensor with Copy/View Fallback (torch.reshape / reshape\_as)

## **Trigger**

I need to change tensor shape reliably regardless of whether underlying memory is contiguous.

## **Snippet**

`import torch`

`x = torch.randn(2, 3).t()`  
`reshaped = torch.reshape(x, (6,))`  
`print(reshaped.shape)`

## **Minimal Notes**

Returns a zero-copy view if tensor is contiguous, otherwise allocates a new contiguous copy. Safe fallback alternative to torch.view.

## **Common Bug**

**Issue:** Invalidation of downstream gradient logic when expecting a shared memory view.

**Cause:** torch.reshape quietly makes a memory copy when input memory is non-contiguous.

**Quick Fix:** Use torch.view if shared memory behavior is required, or explicitly manage contiguity.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.reshape.html](https://pytorch.org/docs/stable/generated/torch.reshape.html)

## **Problem**

Flatten Tensor Dimensions (torch.flatten)

## **Trigger**

I need to collapse a range of tensor dimensions into a single dimension, such as for linear layer inputs.

## **Snippet**

`import torch`

`x = torch.randn(32, 3, 28, 28)`  
`flat = torch.flatten(x, start_dim=1)`  
`print(flat.shape)`

## **Minimal Notes**

Flattens dimensions from start\_dim to end\_dim into a 1D sequence. Preserves batch dimensions when start\_dim=1.

## **Common Bug**

**Issue:** Accidentally flattening the batch dimension into feature vectors.

**Cause:** Omitting start\_dim defaults to flattening from dimension 0, collapsing everything to 1D.

**Quick Fix:** Pass start\_dim=1 when flattening spatial or feature dimensions for neural networks.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.flatten.html](https://pytorch.org/docs/stable/generated/torch.flatten.html)

## **Problem**

Squeeze and Unsqueeze Dimensions (torch.squeeze / torch.unsqueeze)

## **Trigger**

I need to insert or remove dimensions of size 1 for shape alignment or broadcasting.

## **Snippet**

`import torch`

`x = torch.randn(1, 3, 1, 5)`  
`squeezed = torch.squeeze(x)`  
`unsqueezed = torch.unsqueeze(squeezed, dim=0)`  
`print(squeezed.shape, unsqueezed.shape)`

## **Minimal Notes**

squeeze removes size 1 dimensions, while unsqueeze inserts a size 1 dimension at target index. Returns zero-copy views sharing underlying storage.

## **Common Bug**

**Issue:** Unintended squeezing of batch dimensions when batch size dynamically equals 1\.

**Cause:** Calling torch.squeeze() without arguments removes all dimensions of size 1 across the tensor.

**Quick Fix:** Always pass explicit dimension argument, for example torch.squeeze(x, dim=1).

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.squeeze.html](https://pytorch.org/docs/stable/generated/torch.squeeze.html)

## **Problem**

Permute and Transpose Dimensions (torch.permute / torch.transpose)

## **Trigger**

I need to swap tensor axis order for channel alignment or matrix operations.

## **Snippet**

`import torch`

`x = torch.randn(2, 3, 4)`  
`permuted = torch.permute(x, (2, 0, 1))`  
`transposed = torch.transpose(x, 0, 2)`  
`print(permuted.shape, transposed.shape)`

## **Minimal Notes**

transpose swaps exactly two dimensions. permute reorders all tensor dimensions according to provided index tuple. Returns a non-contiguous view.

## **Common Bug**

**Issue:** Downstream memory operations fail after dimension permutation.

**Cause:** Permuting or transposing changes tensor strides, rendering memory non-contiguous.

**Quick Fix:** Chain .contiguous() immediately following .permute() or .transpose() if view operations follow.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.permute.html](https://pytorch.org/docs/stable/generated/torch.permute.html)

### **Manipulation**

## **Problem**

Enforce Memory Contiguity (torch.contiguous)

## **Trigger**

I need to force non-contiguous memory storage into contiguous order in memory.

## **Snippet**

`import torch`

`x = torch.randn(2, 3).t()`  
`print(x.is_contiguous())`  
`x_contig = x.contiguous()`  
`print(x_contig.is_contiguous())`

## **Minimal Notes**

Returns self if tensor is already contiguous, otherwise allocates new memory copy stored sequentially. Required prior to calling operations like .view().

## **Common Bug**

**Issue:** Unnecessary memory allocation and slow performance inside performance critical loops.

**Cause:** Calling .contiguous() on tensors that are already contiguous.

**Quick Fix:** Check x.is\_contiguous() before forcing contiguous calls or use torch.reshape.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.Tensor.contiguous.html](https://pytorch.org/docs/stable/generated/torch.Tensor.contiguous.html)

## **Problem**

Clone Tensor Memory and Storage (torch.clone)

## **Trigger**

I need an independent copy of a tensor that preserves autograd computation graphs.

## **Snippet**

`import torch`

`x = torch.randn(2, 2, requires_grad=True)`  
`y = torch.clone(x)`  
`loss = y.sum()`  
`loss.backward()`  
`print(x.grad)`

## **Minimal Notes**

Allocates fresh underlying memory while preserving gradient flow back to original input tensor. Safer alternative to shallow copies or direct assignments.

## **Common Bug**

**Issue:** Gradients leak into cloned variables or unexpected memory bloat occurs.

**Cause:** Using torch.clone() when gradient tracking is unnecessary or detached memory was intended.

**Quick Fix:** Use .detach().clone() when an isolated tensor completely outside the autograd graph is needed.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.clone.html](https://pytorch.org/docs/stable/generated/torch.clone.html)

## **Problem**

Concatenate Tensors (torch.cat)

## **Trigger**

I need to join multiple existing tensors along a specific existing dimension.

## **Snippet**

`import torch`

`a = torch.randn(2, 3)`  
`b = torch.randn(2, 3)`  
`out = torch.cat([a, b], dim=0)`  
`print(out.shape)`

## **Minimal Notes**

Joins tensors along an existing dimension without creating new dimensions. All tensor shapes except target dim must match exactly.

## **Common Bug**

**Issue:** RuntimeError: Sizes of tensor buffers must match except along dimension.

**Cause:** Attempting to concatenate tensors whose non-concatenated dimensions do not align.

**Quick Fix:** Verify shapes with tensor.shape and align dimensions using unsqueeze or broadcasting first.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.cat.html](https://pytorch.org/docs/stable/generated/torch.cat.html)

## **Problem**

Stack Tensors (torch.stack)

## **Trigger**

I need to combine multiple tensors along a brand new dimension.

## **Snippet**

`import torch`

`a = torch.randn(2, 3)`  
`b = torch.randn(2, 3)`  
`out = torch.stack([a, b], dim=0)`  
`print(out.shape)`

## **Minimal Notes**

Creates a new dimension and stacks tensors along it. All input tensors must have identical shapes.

## **Common Bug**

**Issue:** RuntimeError: stack expects each tensor to be equal size.

**Cause:** Trying to stack tensors with differing shape sizes across any dimension.

**Quick Fix:** Use torch.cat if joining along existing axes, or pad tensors to matching shapes.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.stack.html](https://pytorch.org/docs/stable/generated/torch.stack.html)

## **Problem**

Split Tensor into Chunks (torch.split / torch.chunk)

## **Trigger**

I need to divide a tensor into smaller sub-tensors along a dimension.

## **Snippet**

`import torch`

`x = torch.randn(10, 3)`  
`splits = torch.split(x, split_size_or_sections=4, dim=0)`  
`chunks = torch.chunk(x, chunks=3, dim=0)`  
`print([s.shape for s in splits])`

## **Minimal Notes**

split divides into specific section sizes or uniform chunk sizes. chunk attempts to divide tensor into specified count of pieces. Returns memory views.

## **Common Bug**

**Issue:** Unequal chunk sizes on final tensor slice.

**Cause:** Tensor length along split dimension is not evenly divisible by requested chunk size.

**Quick Fix:** Handle variable length final output chunk or pass explicit slice length list to torch.split.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.split.html](https://pytorch.org/docs/stable/generated/torch.split.html)

## **Problem**

Select and Gather Tensor Values (torch.index\_select / torch.gather / torch.scatter / torch.take\_along\_dim)

## **Trigger**

I need to collect or scatter elements using index tensors along target axes.

## **Snippet**

`import torch`

`x = torch.tensor([[10, 20], [30, 40]])`  
`indices = torch.tensor([[0, 0], [1, 0]])`  
`gathered = torch.gather(x, dim=1, index=indices)`  
`print(gathered)`

## **Minimal Notes**

gather extracts entries along dim specified by index tensor layout. index\_select slices along a single dimension using 1D index array.

## **Common Bug**

**Issue:** IndexError or shape mismatch during gather operations.

**Cause:** Index tensor dimensionality or size does not match target input tensor dimensions.

**Quick Fix:** Ensure index tensor has identical number of dimensions as input tensor before calling gather.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.gather.html](https://pytorch.org/docs/stable/generated/torch.gather.html)

### **Mathematics**

## **Problem**

Element-wise Arithmetic (add, sub, mul, div, add\_)

## **Trigger**

I need to perform basic element-wise mathematical operations with optional in-place modification.

## **Snippet**

`import torch`

`a = torch.tensor([1.0, 2.0])`  
`b = torch.tensor([3.0, 4.0])`  
`c = torch.add(a, b)`  
`a.add_(b)`  
`print(c, a)`

## **Minimal Notes**

Trailing underscores denote in-place ops like add\_() that modify storage directly. Out-of-place operations allocate and return new tensors.

## **Common Bug**

**Issue:** RuntimeError: a view of a leaf Variable that requires grad is being modified in-place.

**Cause:** Executing in-place arithmetic (like add\_) on gradient-tracking leaf tensors.

**Quick Fix:** Use out-of-place operations (c \= a \+ b) or disable gradient calculation when mutating.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.add.html](https://pytorch.org/docs/stable/generated/torch.add.html)

## **Problem**

Matrix Multiplication (torch.matmul / torch.mm / torch.bmm)

## **Trigger**

I need to compute matrix multiplication, batch matrix products, or vector dot products.

## **Snippet**

`import torch`

`a = torch.randn(2, 3)`  
`b = torch.randn(3, 4)`  
`c = torch.matmul(a, b)`

`batch_a = torch.randn(10, 2, 3)`  
`batch_b = torch.randn(10, 3, 4)`  
`batch_c = torch.bmm(batch_a, batch_b)`  
`print(c.shape, batch_c.shape)`

## **Minimal Notes**

mm handles strict 2D matrices, bmm handles 3D batch matrices, and matmul supports broadcasted multi-dimensional matrix products. Prefer matmul or @ operator for general code.

## **Common Bug**

**Issue:** RuntimeError: Expected 2D tensor, got 3D tensor when calling torch.mm.

**Cause:** Passing batched 3D tensors into non-batched matrix multiplication primitive torch.mm.

**Quick Fix:** Use torch.bmm for explicitly 3D batches or torch.matmul for generalized dimension support.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.matmul.html](https://pytorch.org/docs/stable/generated/torch.matmul.html)

## **Problem**

Reduction Operations (torch.sum / torch.mean / torch.max / torch.min / torch.argmax)

## **Trigger**

I need to aggregate tensor values across dimensions or locate extreme values.

## **Snippet**

`import torch`

`x = torch.tensor([[1.0, 2.0], [3.0, 4.0]])`  
`total = torch.sum(x, dim=1, keepdim=True)`  
`max_val, max_idx = torch.max(x, dim=1)`  
`print(total.shape, max_val, max_idx)`

## **Minimal Notes**

Reductions accept dim to collapse specific axes. Pass keepdim=True to retain original dimension rank for clean broadcasting.

## **Common Bug**

**Issue:** Broadcaster shape mismatch following reduction operations.

**Cause:** Dimension reduction collapses target axis by default (keepdim=False), altering tensor rank.

**Quick Fix:** Pass keepdim=True when planning to combine reduced tensor with original shape.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.sum.html](https://pytorch.org/docs/stable/generated/torch.sum.html)

## **Problem**

Conditional Selection (torch.where / torch.meshgrid)

## **Trigger**

I need element-wise conditional evaluation or multi-dimensional coordinate grids.

## **Snippet**

`import torch`

`cond = torch.tensor([True, False, True])`  
`x = torch.tensor([1.0, 2.0, 3.0])`  
`y = torch.tensor([-1.0, -2.0, -3.0])`  
`out = torch.where(cond, x, y)`  
`print(out)`

## **Minimal Notes**

where(condition, x, y) selects elements from x when true, otherwise y. Supports broad element-wise conditions and tensor broadcasting.

## **Common Bug**

**Issue:** Unexpected output data types or device mismatch errors in conditional outputs.

**Cause:** x and y tensors located on differing devices or having unaligned scalar data types.

**Quick Fix:** Move x and y tensors to matching devices and align dtype parameters before calling where.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.where.html](https://pytorch.org/docs/stable/generated/torch.where.html)

### **Broadcasting**

## **Problem**

Expand Tensor without Copy (torch.expand / expand\_as)

## **Trigger**

I need to expand single-dimensional sizes without copying tensor memory.

## **Snippet**

`import torch`

`x = torch.tensor([[1], [2], [3]])`  
`expanded = x.expand(3, 4)`  
`print(expanded.shape)`

## **Minimal Notes**

Creates a new view with expanded singleton dimensions by setting stride values to 0\. Extremely fast with zero memory copy footprint.

## **Common Bug**

**Issue:** RuntimeError: Expanding non-singleton dimension.

**Cause:** Passing target dimension sizes that do not match existing tensor shape at non-singleton axes.

**Quick Fix:** Only expand dimensions that currently have a size of 1, or use repeat for arbitrary copying.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.Tensor.expand.html](https://pytorch.org/docs/stable/generated/torch.Tensor.expand.html)

## **Problem**

Repeat Tensor with Memory Allocation (torch.repeat)

## **Trigger**

I need to duplicate tensor data repeatedly along specified axes by allocating physical memory.

## **Snippet**

`import torch`

`x = torch.tensor([1, 2, 3])`  
`repeated = x.repeat(2, 3)`  
`print(repeated.shape)`

## **Minimal Notes**

Copies tensor data physically along specified repetition counts. Unlike expand, allocates brand new underlying memory storage.

## **Common Bug**

**Issue:** Excessive memory consumption or slow speed on large tensors.

**Cause:** Using .repeat() when zero-copy broadcasting via .expand() or automatic broadcasting is sufficient.

**Quick Fix:** Replace .repeat() with .expand() whenever memory duplication is not explicitly required.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.Tensor.repeat.html](https://pytorch.org/docs/stable/generated/torch.Tensor.repeat.html)

### **Device Management**

## **Problem**

Device Placement and Dtype Conversion (to, cpu, cuda, mps, float, half, bfloat16, non\_blocking)

## **Trigger**

I need to move tensors between devices (CPU/CUDA/MPS) or convert primitive precision data types.

## **Snippet**

`import torch`

`x = torch.randn(2, 3)`  
`device = "cuda" if torch.cuda.is_available() else "cpu"`  
`x_dev = x.to(device=device, dtype=torch.float16, non_blocking=True)`  
`print(x_dev.device, x_dev.dtype)`

## **Minimal Notes**

.to() handles both device transfer and data type casting in a single call. Setting non\_blocking=True enables asynchronous host-to-device memory transfers with pinned memory.

## **Common Bug**

**Issue:** RuntimeError: Expected all tensors to be on the same device.

**Cause:** Performing arithmetic operations between tensors residing on different devices (e.g., CPU and CUDA).

**Quick Fix:** Ensure all operation operands are explicitly transferred to target device via .to(device).

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.Tensor.to.html](https://pytorch.org/docs/stable/generated/torch.Tensor.to.html)

---

