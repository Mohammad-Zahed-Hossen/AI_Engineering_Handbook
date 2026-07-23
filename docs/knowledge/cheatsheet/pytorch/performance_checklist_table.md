# **PyTorch 2.13.0 Package-Wide Performance Checklists**

## **1\. Inference Checklist**

### **Purpose**

Ensure inference pipelines achieve minimal latency, low memory footprint, and high throughput in production environments.

### **Items**

> * \[ \] Set the model to evaluation mode with model.eval() before executing inference calls.  
> * \[ \] Wrap inference code within torch.inference\_mode() to eliminate autograd memory and computation overhead.  
> * \[ \] Ensure model parameters and input tensors reside on the exact same target device.  
> * \[ \] Execute warm-up forward passes before measuring latency or serving live production traffic.  
> * \[ \] Batch incoming request payloads to maximize hardware parallel processing efficiency.  
> * \[ \] Move input tensors asynchronously using non\_blocking=True to eliminate host transfer blocking.  
> * \[ \] Compile model execution graphs using torch.compile() for reduced operator launch latency.  
> * \[ \] Export optimized models to TensorRT or ONNX Runtime when maximum execution speed is required.

### **Quick Notes**

> * torch.inference\_mode() outperforms torch.no\_grad() by disabling view tracking and tensor version counters.  
> * Warm-up iterations ensure CUDA kernel initialization and initial memory allocations do not skew latency metrics.  
> * Avoid calling .item() or print() during inference loops to prevent forced CPU-GPU synchronization delays.

## **2\. GPU Utilization Checklist**

### **Purpose**

Maximize hardware compute throughput by eliminating CPU-GPU bottlenecks and keeping CUDA streaming multiprocessors saturated.

### **Items**

> * \[ \] Increase batch size to maximum hardware memory limits to maximize parallel CUDA execution.  
> * \[ \] Avoid host-device synchronization calls like item() or cpu() inside active compute loops.  
> * \[ \] Transfer data to GPU asynchronously using non\_blocking=True during data loading steps.  
> * \[ \] Set non-overlapping memory layouts using memory\_format=torch.channels\_last for convolutional networks.  
> * \[ \] Overlap data transfer with compute operations using dedicated CUDA streams where appropriate.  
> * \[ \] Profile kernel execution timelines with PyTorch Profiler to detect hardware idle periods.  
> * \[ \] Avoid frequent small tensor creations by pre-allocating fixed buffers on the GPU.  
> * \[ \] Enable PyTorch 2.13 compilation using torch.compile() to fuse adjacent GPU operators.

### **Quick Notes**

> * Channels-last memory layout significantly improves Tensor Core utilization for Vision models on NVIDIA GPUs.  
> * Unnecessary calls to torch.cuda.synchronize() stall the execution pipeline and lower hardware utilization.  
> * Monitor GPU utilization via nvidia-smi or PyTorch Profiler to ensure compute cores remain saturated.

## **3\. Memory Optimization Checklist**

### **Purpose**

Minimize peak VRAM consumption to prevent out-of-memory errors and enable larger model training workloads.

### **Items**

> * \[ \] Use tensor views instead of clone() or copy() when duplicating data structures.  
> * \[ \] Explicitly delete unneeded tensors with del and invoke garbage collection if necessary.  
> * \[ \] Use in-place operations carefully when memory is tightly constrained across network layers.  
> * \[ \] Avoid calling torch.cuda.empty\_cache() inside main loops as it causes severe performance overhead.  
> * \[ \] Enable gradient checkpointing with torch.utils.checkpoint for deep model architecture training.  
> * \[ \] Set optimizer gradients to None using zero\_grad(set\_to\_none=True) to reduce VRAM footprint.  
> * \[ \] Monitor peak memory usage using torch.cuda.max\_memory\_allocated() during development cycles.  
> * \[ \] Use lower precision floating-point types like bfloat16 to cut weight memory in half.

### **Quick Notes**

> * set\_to\_none=True in zero\_grad() frees memory instead of writing zeros, lowering overall memory bandwidth.  
> * torch.cuda.empty\_cache() releases cached allocator memory back to CUDA but causes expensive CPU-GPU syncs.  
> * Gradient checkpointing trades extra forward compute for dramatic reductions in intermediate activation memory.

## **4\. Training Performance Checklist**

### **Purpose**

Accelerate neural network training iterations through efficient compilation, batch management, and profiler-guided bottleneck removal.

### **Items**

> * \[ \] Clear model gradients using optimizer.zero\_grad(set\_to\_none=True) before every backpropagation pass.  
> * \[ \] Compile model computation graphs using torch.compile() with mode="reduce-overhead" for speed.  
> * \[ \] Select power-of-two batch sizes to maximize Tensor Core alignment and execution efficiency.  
> * \[ \] Apply gradient clipping using clip\_grad\_norm\_() only when training stability strictly requires it.  
> * \[ \] Asynchronously save model checkpoints to prevent blocking the primary training thread loop.  
> * \[ \] Use PyTorch Profiler to identify execution bottlenecks in model forward and backward steps.  
> * \[ \] Ensure data loading pipelines maintain higher throughput than model forward execution speed.  
> * \[ \] Enable automatic mixed precision using torch.amp.autocast() to accelerate floating point math.

### **Quick Notes**

> * Power-of-two matrix dimensions and batch sizes unlock optimal hardware acceleration on NVIDIA Tensor Cores.  
> * torch.compile() in PyTorch 2.13 fuses point-wise operations and reduces Python interpreter overhead significantly.  
> * Profile early in development to ensure training time is spent on GPU compute rather than data preparation.

## **5\. DataLoader Performance Checklist**

### **Purpose**

Eliminate input pipeline starvation by optimizing asynchronous worker counts, memory pinning, and data prefetching.

### **Items**

> * \[ \] Tune num\_workers based on CPU core availability to keep GPU queues saturated.  
> * \[ \] Enable pin\_memory=True when transfering host CPU tensors to CUDA accelerator devices.  
> * \[ \] Set persistent\_workers=True to prevent re-creating worker processes between training epochs.  
> * \[ \] Configure prefetch\_factor to overlap data fetching with model compute execution seamlessly.  
> * \[ \] Move heavy data transformations out of **getitem**() into pre-computed offline storage caches.  
> * \[ \] Store dataset files on fast local SSDs or shared memory backends.  
> * \[ \] Use non\_blocking=True when moving loaded batches from host memory to target GPUs.  
> * \[ \] Set drop\_last=True to maintain consistent batch sizes and avoid dynamic graph recompilations.

### **Quick Notes**

> * pin\_memory=True enables fast Direct Memory Access (DMA) transfers from host RAM to GPU VRAM.  
> * persistent\_workers=True reduces worker process creation overhead between epoch transitions.  
> * Setting drop\_last=True prevents small final batches that trigger graph recompilations in torch.compile().

## **6\. Mixed Precision Checklist**

### **Purpose**

Accelerate execution and reduce memory overhead using Automatic Mixed Precision while maintaining strict numerical stability.

### **Items**

> * \[ \] Enclose forward operations inside torch.amp.autocast(device\_type='cuda') for automatic precision scaling.  
> * \[ \] Prefer device\_type='cuda', dtype=torch.bfloat16 on modern GPU architectures for stability.  
> * \[ \] Use GradScaler when training with float16 to prevent underflow of small gradient values.  
> * \[ \] Omit GradScaler when using bfloat16 precision as dynamic range scaling is unnecessary.  
> * \[ \] Verify numerical stability by auditing loss curves for non-finite values or NaNs.  
> * \[ \] Benchmark overall speed and memory throughput gains after enabling mixed precision execution.  
> * \[ \] Keep loss computation and sensitive operations in float32 precision when necessary.  
> * \[ \] Fall back to standard float32 precision if gradient scaling fails to prevent instabilities.

### **Quick Notes**

> * bfloat16 shares the dynamic range of float32, eliminating the need for GradScaler in most cases.  
> * float16 requires GradScaler to scale small gradients and avoid numerical underflow during backpropagation.  
> * Modern PyTorch uses torch.amp.autocast("cuda") instead of the legacy torch.cuda.amp.autocast().

---

