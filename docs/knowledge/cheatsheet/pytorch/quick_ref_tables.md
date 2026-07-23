# **PyTorch Cheatsheet: Production Tables**

## **Tensor Creation Matrix**

### **Purpose**

Guide API selection for creating PyTorch tensors based on memory allocation and source data semantics.

### **Columns**

> * API  
> * Best Use  
> * Copies Data  
> * Shares Memory  
> * Typical Scenario

### **Table Content**

| API | Best Use | Copies Data | Shares Memory | Typical Scenario |
| :---- | :---- | :---- | :---- | :---- |
| torch.tensor | Convert Python sequences or scalars | Yes (Always) | No | Constructing small ground-truth or scalar tensors |
| torch.as\_tensor | Efficient array or tensor conversion | Conditional | Conditional | Converting data while avoiding redundant copies |
| torch.from\_numpy | Zero-copy conversion from NumPy | No | Yes | Interfacing CPU NumPy arrays with PyTorch |
| torch.zeros | Allocate tensor initialized to zeros | N/A (New) | No | Initializing accumulators, masks, or hidden states |
| torch.ones | Allocate tensor initialized to ones | N/A (New) | No | Creating multiplier masks or baseline inputs |
| torch.empty | Allocate uninitialized memory buffer | N/A (New) | No | Allocating output buffers prior to in-place ops |
| torch.full | Allocate tensor filled with constant | N/A (New) | No | Populating attention masks with sentinel values |
| torch.rand | Allocate uniform random data \[0, 1\) | N/A (New) | No | Initializing weights or generating dummy inputs |
| torch.randn | Allocate standard normal random data | N/A (New) | No | Initializing neural network parameters or noise |
| torch.randint | Allocate random integers in range | N/A (New) | No | Sampling categorical target labels or indices |
| torch.arange | Step-based integer sequence creation | N/A (New) | No | Generating 1D position indices or step arrays |
| torch.linspace | Evenly spaced float sequence creation | N/A (New) | No | Constructing interpolation grids or time steps |

### **Quick Notes**

> * torch.as\_tensor reuses existing memory if device and dtype already match the source data.  
> * torch.empty avoids zero-fill memory overhead but contains uninitialized garbage data.  
> * torch.from\_numpy requires CPU host memory and shares storage bidirectionally with NumPy arrays.

## **Tensor Shape Operations Matrix**

### **Purpose**

Compare shape manipulation APIs to choose operations matching memory contiguousness constraints.

### **Columns**

> * API  
> * Changes Shape  
> * View or Copy  
> * Requires Contiguous  
> * Best Use

### **Table Content**

| API | Changes Shape | View or Copy | Requires Contiguous | Best Use |
| :---- | :---- | :---- | :---- | :---- |
| view | Yes | View | Yes | Reshaping contiguous tensors without memory allocation |
| reshape | Yes | View (if possible) or Copy | No | Safe reshaping when memory layout is uncertain |
| flatten | Yes | View (if possible) or Copy | No | Collapsing spatial dimensions into feature vectors |
| squeeze | Yes | View | No | Removing dimensions of size 1 |
| unsqueeze | Yes | View | No | Inserting singleton dimensions for broadcasting |
| permute | Yes | View | No | Reordering arbitrary tensor dimensions |
| transpose | Yes | View | No | Swapping exactly two tensor axes |
| expand | Yes | View | No | Zero-copy broadcasting along singleton axes |
| repeat | Yes | Copy | No | Physical memory duplication across dimensions |

### **Quick Notes**

> * reshape attempts view first, falling back to a copy if the input tensor is non-contiguous.  
> * expand uses a zero stride to broadcast without allocating extra GPU/CPU memory.  
> * permute and transpose yield non-contiguous tensors that require .contiguous() before view.

## **Tensor Memory Behavior**

### **Purpose**

Define exact memory allocation and underlying storage sharing characteristics for core tensor ops.

### **Columns**

> * Operation  
> * Allocates Memory  
> * Shares Storage  
> * Writable  
> * Notes

### **Table Content**

| Operation | Allocates Memory | Shares Storage | Writable | Notes |
| :---- | :---- | :---- | :---- | :---- |
| view | No | Yes | Yes | In-place edits mutate original tensor storage |
| reshape | Conditional | Conditional | Yes | Allocates new block only if non-contiguous |
| clone | Yes | No | Yes | Duplicates data and records autograd history |
| contiguous | Conditional | Conditional | Yes | Returns self if already contiguous in memory |
| expand | No | Yes | Read-only | Multiple indices point to identical physical memory |
| repeat | Yes | No | Yes | Allocates fresh memory for duplicated elements |
| from\_numpy | No | Yes | Yes | Direct pointer share with host NumPy buffer |
| as\_tensor | Conditional | Conditional | Yes | Avoids allocation when input meets target specs |

### **Quick Notes**

> * Mutating a tensor view in-place automatically alters the underlying base tensor.  
> * In-place writes on expanded tensors cause undefined behavior due to zero-stride memory overlaps.  
> * Combine .detach().clone() to safely copy data while severing the autograd computation graph.

## **Device Transfer Matrix**

### **Purpose**

Select optimal data movement pathways across CPU, CUDA, and Apple Silicon MPS devices.

### **Columns**

> * API  
> * Target Device  
> * Creates Copy  
> * Typical Use

### **Table Content**

| API | Target Device | Creates Copy | Typical Use |
| :---- | :---- | :---- | :---- |
| .to() | CPU / CUDA / MPS | Conditional | Unified device and precision conversion |
| .cpu() | Host CPU | Conditional | Fetching tensors back for CPU processing or I/O |
| .cuda() | NVIDIA GPU | Conditional | Direct offloading to explicit CUDA accelerator |
| .mps() | Apple Silicon GPU | Conditional | Direct offloading to Metal Performance Shaders |
| non\_blocking=True | Async Device Transfer | No (Async Queue) | Overlapping host-to-device transfers with compute |

### **Quick Notes**

> * Target transfers via .to(device) avoid memory duplication if device and dtype match current state.  
> * Asynchronous transfer with non\_blocking=True requires source host tensors in pinned memory via .pin\_memory().  
> * MPS device ops must be verified for layer support, falling back to CPU via environment variables if needed.

## **dtype Conversion Matrix**

### **Purpose**

Evaluate numerical precision options to balance model memory usage, speed, and numerical stability.

### **Columns**

> * dtype  
> * Precision  
> * Memory  
> * Typical Use  
> * GPU Support

### **Table Content**

| dtype | Precision | Memory | Typical Use | GPU Support |
| :---- | :---- | :---- | :---- | :---- |
| float64 | High (64-bit) | 8 bytes | Scientific computing and precise loss terms | Universal |
| float32 | Standard (32-bit) | 4 bytes | Standard baseline for weights and activations | Universal |
| float16 | Medium (16-bit) | 2 bytes | AMP training on older Tensor Core hardware | Tensor Cores |
| bfloat16 | Dynamic Range (16-bit) | 2 bytes | Modern LLM and Transformer training or inference | Ampere+ / MPS / CPU |
| int64 | Integral (64-bit) | 8 bytes | Target labels, embedding indices, counters | Universal |
| int32 | Integral (32-bit) | 4 bytes | Memory-efficient index tensors and sparse layouts | Universal |
| bool | Logical (8-bit) | 1 byte | Attention masking and conditional tensor indexing | Universal |

### **Quick Notes**

> * bfloat16 matches float32 dynamic range, preventing underflow without needing loss scaling.  
> * float16 requires torch.amp.GradScaler during backward passes to handle gradient underflow.  
> * Recommended default: store master weights in float32 and wrap forward passes with torch.amp.autocast.

## **Training Mode Matrix**

### **Purpose**

Determine operational state behavior for layers like Dropout and BatchNorm during training and evaluation.

### **Columns**

> * Feature  
> * Training  
> * Evaluation  
> * Tracks Gradients  
> * Updates BatchNorm  
> * Dropout Active  
> * Recommended Use

### **Table Content**

| Feature | Training | Evaluation | Tracks Gradients | Updates BatchNorm | Dropout Active | Recommended Use |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| model.train() | Active | Disabled | Yes | Yes | Yes | Forward pass during gradient updates |
| model.eval() | Disabled | Active | Yes (unless disabled) | No | No | Validation and evaluation evaluation loops |
| torch.no\_grad() | Independent | Independent | No | Unchanged | Unchanged | Validation steps where autograd is unneeded |
| torch.inference\_mode() | Independent | Independent | No | Unchanged | Unchanged | High-performance inference and production serve |

### **Quick Notes**

> * model.eval() modifies layer behavior (BatchNorm/Dropout) but does NOT turn off gradient calculation.  
> * torch.inference\_mode() outperforms torch.no\_grad() by completely disabling autograd view tracking.  
> * Standard production inference pattern: wrap model evaluation with model.eval() and torch.inference\_mode().

## **Export Format Comparison**

### **Purpose**

Compare production deployment, compilation, and graph serialization options for PyTorch models.

### **Columns**

> * Format  
> * Primary Use  
> * Recommended  
> * Production Status  
> * Notes

### **Table Content**

| Format | Primary Use | Recommended | Production Status | Notes |
| :---- | :---- | :---- | :---- | :---- |
| torch.compile | Python In-Process JIT Acceleration | Yes (Python) | PyTorch 2.x Standard | JIT compiles graphs using Triton and Inductor |
| torch.export | Out-of-Python Serialization | Yes (AOT/C++) | Production Standard | Generates clean ExportedProgram for C++ runtimes |
| TorchScript | Legacy C++ Deployment | No | Legacy | Replaced by torch.export for modern pipelines |
| ONNX | Cross-Framework Interoperability | Yes (Vendor) | Industry Standard | Export target for TensorRT, ONNX Runtime, OpenVINO |
| state\_dict | Native Weight Storage | Yes (Weights) | Standard Weights | Python dictionary mapping parameters to tensors |

### **Quick Notes**

> * torch.compile accelerates model execution within Python environments without changing code logic.  
> * torch.export creates sound, fully traced dynamic graphs targeted at non-Python backends like ExecuTorch.  
> * TorchScript is now in maintenance mode and should be avoided for new model export architectures.

## **TorchVision Weight Selection**

### **Purpose**

Navigate modern TorchVision weight loading options and associated preprocessing pipelines.

### **Columns**

> * Option  
> * Best Use  
> * Automatically Applies Transforms  
> * Recommended

### **Table Content**

| Option | Best Use | Automatically Applies Transforms | Recommended |
| :---- | :---- | :---- | :---- |
| Weights.DEFAULT | Obtaining highest-accuracy pre-trained weights | No (Query via .transforms()) | Yes (Best Practice) |
| Weights.\<ENUM\_NAME\> | Pinning explicit model weight versions | No (Query via .transforms()) | Yes (Reproducibility) |
| pretrained=True | Legacy model weight initialization | No | No (Deprecated) |
| weights=None | Initializing model architecture from scratch | No | Yes (Custom Training) |

### **Quick Notes**

> * Weights.DEFAULT automatically points to the newest, most accurate checkpoint for the target architecture.  
> * Call weights.transforms() on the selected weight enum to retrieve the exact input transform pipeline.  
> * Passing boolean pretrained=True is deprecated and will trigger runtime warnings in modern TorchVision.

---

