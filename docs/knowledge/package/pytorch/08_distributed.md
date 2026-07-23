# **PyTorch Distributed Training & AMP Tasks**

# **08\_distributed.md**

## **Task**

Enable Automatic Mixed Precision (torch.amp.autocast)

## **Problem Solved**

Accelerate neural network execution and reduce GPU memory consumption by automatically casting tensor operations to lower precision formats.

## **Mental Trigger**

I want to speed up model forward passes and fit larger batch sizes on GPU without re-casting tensors manually.

## **Syntax**

`torch.amp.autocast(device_type, enabled=True, dtype=None, cache_enabled=True)`

## **Important Parameters**

> * **device\_type**: String specifying the target accelerator device type (such as 'cuda', 'cpu', or 'mps').  
> * **enabled**: Boolean flag indicating whether autocasting is active within the context block.  
> * **dtype**: The lower-precision target data type (such as torch.float16 or torch.bfloat16).  
> * **cache\_enabled**: Boolean controlling whether intermediate weight/tensor re-casting results are cached for performance.

## **Return Value**

A context manager or decorator that enforces automatic precision selection for operations executed within its scope.

## **Example**

`import torch`  
`import torch.nn as nn`

`# Define model and input on GPU`  
`model = nn.Linear(100, 10).cuda()`  
`x = torch.randn(32, 100, device="cuda")`

`# Execute forward pass under CUDA Automatic Mixed Precision`  
`with torch.amp.autocast(device_type="cuda", dtype=torch.float16):`  
    `output = model(x)`  
    `loss = output.sum()`

`print(f"Output dtype: {output.dtype}")`

## **Use When**

> * Training or evaluating deep learning models on modern GPUs or accelerators supporting float16/bfloat16.  
> * Optimizing GPU memory usage to allow for larger batch sizes or higher input resolutions.

## **Avoid When**

> * Running on legacy hardware that lacks native float16/bfloat16 hardware acceleration.  
> * Performing numerical operations highly sensitive to reduced precision, such as matrix inversions or custom loss functions prone to underflow.

## **Gotchas**

> * Forgetting to scope only the forward pass and loss computation, which can cause unexpected casting issues during optimization.  
> * Assuming operations like Softmax or Loss calculations run in float16 when PyTorch automatically promotes them to float32 for safety.  
> * Using torch.cuda.amp.autocast instead of the modern unified torch.amp.autocast(device\_type="cuda").

## **Performance Notes**

Reduces GPU memory usage up to 50% and improves compute throughput significantly on Tensor Core architectures.

## **Related APIs**

> * torch.amp.GradScaler  
> * torch.cuda.amp.autocast

## **Framework Migration Notes**

Replaces explicit manual model casting or global mixed precision policy contexts used in other frameworks.

## **TensorFlow Equivalent**

`tf.keras.mixed_precision.Policy`

## **Version Compatibility**

PyTorch 2.0 introduced the unified torch.amp.autocast(device\_type=...) API replacing torch.cuda.amp.autocast.

## **Search Metadata**

> * **Aliases**: autocast, torch.cuda.amp.autocast  
> * **Common Search Terms**: pytorch autocast, how to use mixed precision pytorch, amp autocast cuda  
> * **Keywords**: mixed precision, autocast, fp16, bf16, amp  
> * **Frequently Confused With**: torch.inference\_mode, torch.no\_grad

## **Related Models**

resnet, vit, transformer, bert, llama

## **Related Patterns**

mixed-precision, memory-efficient-training

## **Related Workflows**

image-classification-pipeline, production-llm-cost-latency-optimization

## **Related Cheatsheet**

distributed

## **Related Decision Guides**

hardware-selection-guide, precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/amp.html\#torch.amp.autocast](https://www.google.com/search?q=https://pytorch.org/docs/stable/amp.html%23torch.amp.autocast)

## **Task**

Configure Device-Specific Autocast (device\_type, dtype)

## **Problem Solved**

Fine-tune precision selection across different hardware accelerators (CUDA, CPU, MPS) and data types (float16, bfloat16).

## **Mental Trigger**

I need to use bfloat16 on Ampere GPUs or configure autocast specifically for CPU execution.

## **Syntax**

`torch.amp.autocast(device_type, dtype=None)`

## **Important Parameters**

> * **device\_type**: String specifying hardware target ('cuda', 'cpu', 'mps').  
> * **dtype**: Specific lower-precision data type (torch.bfloat16, torch.float16).

## **Return Value**

An accelerator-specific context manager tailored to chosen hardware precision capabilities.

## **Example**

`import torch`  
`import torch.nn as nn`

`model = nn.Linear(50, 10)`  
`x = torch.randn(16, 50)`

`# Configure device-specific autocast for CPU execution using bfloat16`  
`with torch.amp.autocast(device_type="cpu", dtype=torch.bfloat16):`  
    `out = model(x)`

`print(f"CPU Autocast output dtype: {out.dtype}")`

## **Use When**

> * Running models on modern hardware supporting bfloat16 to avoid loss scaling requirements.  
> * Deploying mixed precision inference on CPU or Apple Silicon MPS targets.

## **Avoid When**

> * Requesting bfloat16 on older GPUs that lack hardware acceleration for it, resulting in slow emulation.  
> * Executing float16 on CPU hardware without explicit native FP16 vector support.

## **Gotchas**

> * Requesting float16 on CPU, which is unsupported for efficient computation and may raise errors or fall back slowly.  
> * Mixing device types between model parameters and the autocast context scope.  
> * Expecting bfloat16 to require GradScaler, when bfloat16 dynamic range typically makes loss scaling unnecessary.

## **Performance Notes**

bfloat16 provides the same dynamic range as float32, eliminating underflow issues while delivering lower-precision speeds.

## **Related APIs**

> * torch.amp.autocast  
> * torch.cuda.is\_bf16\_supported

## **Framework Migration Notes**

TensorFlow manages policy globally via set\_global\_policy, whereas PyTorch configures it per context block.

## **TensorFlow Equivalent**

`tf.keras.mixed_precision.Policy("mixed_bfloat16")`

## **Version Compatibility**

CPU bfloat16 autocast stabilized in PyTorch 1.12. MPS device support was added in PyTorch 2.1.

## **Search Metadata**

> * **Aliases**: device autocast, bf16 autocast  
> * **Common Search Terms**: pytorch bfloat16 autocast, autocast device\_type cpu, cuda bf16 autocast  
> * **Keywords**: bfloat16, device\_type, cpu autocast, cuda autocast  
> * **Frequently Confused With**: torch.set\_default\_dtype

## **Related Models**

transformer, gpt, llama, qwen, deepseek

## **Related Patterns**

mixed-precision

## **Related Workflows**

production-llm-cost-latency-optimization

## **Related Cheatsheet**

distributed

## **Related Decision Guides**

hardware-selection-guide, precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/amp.html\#autocasting](https://www.google.com/search?q=https://pytorch.org/docs/stable/amp.html%23autocasting)

## **Task**

Scale Gradients with GradScaler (torch.amp.GradScaler)

## **Problem Solved**

Prevent underflow of float16 small gradient values by multiplying the loss by a scale factor before computing gradients.

## **Mental Trigger**

My float16 training loss becomes NaN or gradients underflow to zero during backpropagation.

## **Syntax**

`torch.amp.GradScaler(device='cuda', init_scale=65536.0, growth_factor=2.0, backoff_factor=0.5, growth_interval=2000, enabled=True)`

## **Important Parameters**

> * **device**: String or device instance specifying hardware target ('cuda').  
> * **init\_scale**: Initial loss scaling factor applied to output loss.  
> * **growth\_factor**: Multiplicative factor used to increase scale when no overflow occurs.  
> * **backoff\_factor**: Multiplicative factor used to reduce scale when gradient overflow occurs.  
> * **growth\_interval**: Number of consecutive steps without overflow before increasing the loss scale.

## **Return Value**

An instance of GradScaler that wraps loss scaling, step execution, and scale adjustment.

## **Example**

`import torch`  
`import torch.nn as nn`

`model = nn.Linear(10, 2).cuda()`  
`optimizer = torch.optim.SGD(model.parameters(), lr=0.01)`  
`scaler = torch.amp.GradScaler("cuda")`

`x = torch.randn(8, 10, device="cuda")`  
`optimizer.zero_grad()`

`with torch.amp.autocast(device_type="cuda", dtype=torch.float16):`  
    `loss = model(x).sum()`

`scaler.scale(loss).backward()`  
`scaler.step(optimizer)`  
`scaler.update()`

## **Use When**

> * Training models using FP16 precision with torch.amp.autocast.  
> * Protecting low-magnitude gradients from flushing to zero under reduced float16 dynamic range.

## **Avoid When**

> * Training exclusively with bfloat16 or float32, where scale adjustments add unnecessary overhead.

## **Gotchas**

> * Calling optimizer.step() directly instead of scaler.step(optimizer).  
> * Omitting scaler.update() at the end of every training iteration.  
> * Using GradScaler when training with bfloat16 where scaling is not required.  
> * Calling scaler.scale() multiple times on the same loss without gradient accumulation awareness.

## **Performance Notes**

Minimal runtime overhead while preventing FP16 gradient underflow and avoiding numerical instability.

## **Related APIs**

> * torch.amp.autocast  
> * scaler.unscale\_  
> * scaler.step

## **Framework Migration Notes**

Maps directly to TensorFlow's LossScaleOptimizer wrapper.

## **TensorFlow Equivalent**

`tf.keras.mixed_precision.LossScaleOptimizer`

## **Version Compatibility**

PyTorch 2.3 unified torch.cuda.amp.GradScaler into torch.amp.GradScaler(device=...).

## **Search Metadata**

> * **Aliases**: GradScaler, torch.cuda.amp.GradScaler  
> * **Common Search Terms**: pytorch gradscaler, how to use gradscaler, fp16 gradient scaling  
> * **Keywords**: gradscaler, gradient scaling, loss scale, underflow, fp16  
> * **Frequently Confused With**: torch.nn.utils.clip\_grad\_norm\_

## **Related Models**

resnet, vit, yolo, bert, roberta

## **Related Patterns**

mixed-precision, gradient-accumulation

## **Related Workflows**

image-classification-pipeline, text-classification-pipeline-classical-encoder

## **Related Cheatsheet**

distributed

## **Related Decision Guides**

hardware-selection-guide, precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/amp.html\#torch.amp.GradScaler](https://www.google.com/search?q=https://pytorch.org/docs/stable/amp.html%23torch.amp.GradScaler)

## **Task**

Handle Gradient Overflow and Dynamic Loss Scaling (GradScaler.update, unscale\_)

## **Problem Solved**

Inspect unscaled gradients safely, clip them properly, and skip optimizer steps when gradient inf/NaN overflows occur.

## **Mental Trigger**

I need to apply gradient clipping or custom gradient modifications while using GradScaler.

## **Syntax**

`scaler.unscale_(optimizer)`

## **Important Parameters**

> * **optimizer**: The PyTorch optimizer whose parameter gradients need to be unscaled.

## **Return Value**

None. Modifies optimizer parameter gradients in-place by dividing them by the current scale factor.

## **Example**

`import torch`  
`import torch.nn as nn`

`model = nn.Linear(10, 2).cuda()`  
`optimizer = torch.optim.Adam(model.parameters(), lr=0.001)`  
`scaler = torch.amp.GradScaler("cuda")`

`x = torch.randn(8, 10, device="cuda")`  
`optimizer.zero_grad()`

`with torch.amp.autocast(device_type="cuda", dtype=torch.float16):`  
    `loss = model(x).sum()`

`scaler.scale(loss).backward()`

`# Unscale gradients before performing gradient clipping`  
`scaler.unscale_(optimizer)`  
`torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)`

`# Step optimizer safely; skips parameter update if inf/NaN detected`  
`scaler.step(optimizer)`  
`scaler.update()`

## **Use When**

> * Applying gradient clipping (clip\_grad\_norm\_ or clip\_grad\_value\_) during FP16 training with GradScaler.  
> * Inspecting raw gradient magnitudes during FP16 training loops.

## **Avoid When**

> * Calling scaler.unscale\_() twice within the same iteration for the same optimizer, which raises a runtime error.

## **Gotchas**

> * Clipping gradients before calling scaler.unscale\_(), which clips scaled values and ruins threshold logic.  
> * Calling scaler.unscale\_() after scaler.step(optimizer) has already occurred.  
> * Mutating gradients manually without unscaling them first.

## **Performance Notes**

scaler.step(optimizer) checks for inf/NaN in gradients and skips optimizer parameter updates automatically if overflow occurs.

## **Related APIs**

> * torch.amp.GradScaler  
> * torch.nn.utils.clip\_grad\_norm\_

## **Framework Migration Notes**

Equivalent to managing dynamic scale adjustments in custom Keras train steps.

## **TensorFlow Equivalent**

`tf.keras.mixed_precision.LossScaleOptimizer.unscale_gradients`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: unscale\_, gradscaler overflow  
> * **Common Search Terms**: pytorch gradient clipping with gradscaler, scaler unscale\_ optimizer, handle gradient overflow pytorch  
> * **Keywords**: unscale\_, gradient clipping, inf nan overflow, dynamic loss scaling  
> * **Frequently Confused With**: torch.nn.utils.clip\_grad\_norm\_

## **Related Models**

bert, roberta, t5, gpt, llama

## **Related Patterns**

mixed-precision, gradient-accumulation

## **Related Workflows**

text-classification-pipeline-classical-encoder, production-llm-cost-latency-optimization

## **Related Cheatsheet**

distributed

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/amp.html\#gradient-scaling](https://www.google.com/search?q=https://pytorch.org/docs/stable/amp.html%23gradient-scaling)

## **Task**

Initialize Distributed Process Group (torch.distributed.init\_process\_group)

## **Problem Solved**

Establish the communication backend and world configuration required for multi-GPU or multi-node training.

## **Mental Trigger**

I need to connect multiple GPUs or workers together into a single distributed cluster.

## **Syntax**

`torch.distributed.init_process_group(backend, init_method=None, timeout=datetime.timedelta(seconds=1800), world_size=-1, rank=-1, store=None, group_name='', device_id=None)`

## **Important Parameters**

> * **backend**: Communication backend to use ('nccl' for CUDA GPUs, 'gloo' for CPU).  
> * **init\_method**: URL specifying how to discover peers (such as 'env://').  
> * **world\_size**: Total number of processes participating in the group.  
> * **rank**: Unique global integer identifier of the current process.  
> * **timeout**: Timeout duration for operations executed against the process group.

## **Return Value**

None. Initializes the global default distributed process group context.

## **Example**

`import os`  
`import torch`  
`import torch.distributed as dist`

`def setup_distributed():`  
    `os.environ["MASTER_ADDR"] = "localhost"`  
    `os.environ["MASTER_PORT"] = "12355"`  
    `dist.init_process_group(`  
        `backend="nccl" if torch.cuda.is_available() else "gloo",`  
        `rank=0,`  
        `world_size=1`  
    `)`

`setup_distributed()`  
`print(f"Distributed initialized: {dist.is_initialized()}")`  
`dist.destroy_process_group()`

## **Use When**

> * Starting any distributed multi-GPU or multi-node PyTorch training session using DDP, FSDP, or collective operations.

## **Avoid When**

> * Running single-process execution on a single hardware device.

## **Gotchas**

> * Using backend nccl on CPU-only machines, which causes initialization failures (use gloo for CPU).  
> * Mismatched world\_size or rank across different launched worker processes.  
> * Forgetting to destroy the process group via dist.destroy\_process\_group() at script teardown.

## **Performance Notes**

nccl backend provides maximum bandwidth utilization over NVLink and InfiniBand inter-connects.

## **Related APIs**

> * torch.distributed.destroy\_process\_group  
> * torch.distributed.is\_initialized

## **Framework Migration Notes**

Replaces tf.distribute.cluster\_resolver.TFClusterResolver initialization routines.

## **TensorFlow Equivalent**

`tf.distribute.MultiWorkerMirroredStrategy`

## **Version Compatibility**

PyTorch 2.0+ supports passing device\_id directly during init to reduce CUDA context initialization overhead.

## **Search Metadata**

> * **Aliases**: init\_process\_group, dist.init\_process\_group  
> * **Common Search Terms**: pytorch init\_process\_group, how to set up pytorch distributed, nccl init process group  
> * **Keywords**: distributed, init\_process\_group, nccl, gloo, process group  
> * **Frequently Confused With**: torch.multiprocessing.spawn

## **Related Models**

resnet, vit, transformer, gpt, llama

## **Related Patterns**

memory-efficient-training

## **Related Workflows**

image-classification-pipeline, production-llm-cost-latency-optimization

## **Related Cheatsheet**

distributed

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/distributed.html\#torch.distributed.init\_process\_group](https://www.google.com/search?q=https://pytorch.org/docs/stable/distributed.html%23torch.distributed.init_process_group)

## **Task**

Configure Distributed Environment Variables (MASTER\_ADDR, MASTER\_PORT, RANK, WORLD\_SIZE)

## **Problem Solved**

Supply networking parameters and process identity to PyTorch processes without hardcoding arguments in code.

## **Mental Trigger**

I need my script to discover its rank, node address, and cluster size automatically from environment variables set by launchers.

## **Syntax**

`import os`

`os.environ["MASTER_ADDR"] = "127.0.0.1"`  
`os.environ["MASTER_PORT"] = "29500"`  
`os.environ["RANK"] = "0"`  
`os.environ["WORLD_SIZE"] = "1"`  
`os.environ["LOCAL_RANK"] = "0"`

## **Important Parameters**

> * **MASTER\_ADDR**: IP address or hostname of the rank 0 master node.  
> * **MASTER\_PORT**: Free TCP port on the master node for communication setup.  
> * **RANK**: Global rank identifier of the process across all nodes.  
> * **WORLD\_SIZE**: Total number of processes executing across the cluster.  
> * **LOCAL\_RANK**: Local GPU index of the process on its current node.

## **Return Value**

None. Configures environment context for auto-detection during process group initialization.

## **Example**

`import os`  
`import torch`  
`import torch.distributed as dist`

`# Set environment variables for single-node local execution test`  
`os.environ["MASTER_ADDR"] = "127.0.0.1"`  
`os.environ["MASTER_PORT"] = "29500"`  
`os.environ["RANK"] = "0"`  
`os.environ["WORLD_SIZE"] = "1"`  
`os.environ["LOCAL_RANK"] = "0"`

`# Reads rank, world_size, master_addr, master_port automatically from environment`  
`dist.init_process_group(backend="gloo")`  
`print(f"Rank {dist.get_rank()} of {dist.get_world_size()} initialized.")`  
`dist.destroy_process_group()`

## **Use When**

> * Launching distributed scripts via torchrun, Slurm, Kubernetes, or custom orchestration tools.

## **Avoid When**

> * Hardcoding fixed IP addresses or rank integers inside reusable application source code.

## **Gotchas**

> * Using an occupied port for MASTER\_PORT, causing bind errors during startup.  
> * Confusing RANK (global rank across all nodes) with LOCAL\_RANK (GPU index on current node).  
> * Forgetting to export variables in multi-node shell scripts before invoking PyTorch.

## **Performance Notes**

Zero runtime performance impact, ensures standard launch orchestration across varied clusters.

## **Related APIs**

> * torch.distributed.init\_process\_group  
> * torchrun

## **Framework Migration Notes**

Similar to setting TF\_CONFIG environment variable in distributed TensorFlow.

## **TensorFlow Equivalent**

`TF_CONFIG`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: MASTER\_ADDR, LOCAL\_RANK, distributed env vars  
> * **Common Search Terms**: pytorch MASTER\_ADDR MASTER\_PORT, pytorch LOCAL\_RANK environment variable, distributed env variables torch  
> * **Keywords**: MASTER\_ADDR, MASTER\_PORT, RANK, WORLD\_SIZE, LOCAL\_RANK  
> * **Frequently Confused With**: CUDA\_VISIBLE\_DEVICES

## **Related Models**

resnet, transformer, llama

## **Related Patterns**

device-placement

## **Related Workflows**

image-classification-pipeline, production-llm-cost-latency-optimization

## **Related Cheatsheet**

distributed

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/distributed.html\#environment-variable-initialization](https://www.google.com/search?q=https://pytorch.org/docs/stable/distributed.html%23environment-variable-initialization)

## **Task**

Synchronize Processes (torch.distributed.barrier)

## **Problem Solved**

Block execution across all distributed worker processes until every process in the group reaches the synchronization barrier.

## **Mental Trigger**

I need process 0 to download a dataset or save a checkpoint before any other worker continues.

## **Syntax**

`torch.distributed.barrier(group=None, async_op=False, device_ids=None)`

## **Important Parameters**

> * **group**: Process group to synchronize. Defaults to global world group.  
> * **async\_op**: Boolean flag indicating whether operation should be non-blocking.  
> * **device\_ids**: List of CUDA device IDs for GPU barrier synchronization under NCCL.

## **Return Value**

A Work handle if async\_op=True, otherwise None.

## **Example**

`import os`  
`import torch`  
`import torch.distributed as dist`

`os.environ["MASTER_ADDR"] = "127.0.0.1"`  
`os.environ["MASTER_PORT"] = "29501"`  
`os.environ["RANK"] = "0"`  
`os.environ["WORLD_SIZE"] = "1"`

`dist.init_process_group(backend="gloo")`

`if dist.get_rank() == 0:`  
    `print("Rank 0 preparing dataset assets...")`

`# Ensure all processes wait for Rank 0 completion`  
`dist.barrier()`  
`print(f"Rank {dist.get_rank()} passed synchronization barrier.")`  
`dist.destroy_process_group()`

## **Use When**

> * Synchronizing file system operations, dataset downloads, or checkpoint creation across distributed processes.

## **Avoid When**

> * Placing barriers inside tight inner training loops, which causes excessive inter-node latency overhead.

## **Gotchas**

> * Placing a barrier inside a conditional block (if rank \== 0: dist.barrier()), which causes infinite deadlocks.  
> * Differing barrier timeout settings across nodes leading to unhandled timeout exceptions.

## **Performance Notes**

Forces execution sync across nodes. Unnecessary calls degrade scaling efficiency.

## **Related APIs**

> * torch.distributed.all\_reduce  
> * torch.distributed.init\_process\_group

## **Framework Migration Notes**

Similar to cross-replica barrier synchronization points in TensorFlow distribution strategies.

## **TensorFlow Equivalent**

`tf.distribute.StrategyExtended.experimental_run_steps_on_step`

## **Version Compatibility**

PyTorch 2.0+ supports device\_ids parameter for GPU-accelerated barrier operations under NCCL.

## **Search Metadata**

> * **Aliases**: dist.barrier, process barrier  
> * **Common Search Terms**: pytorch distributed barrier, dist.barrier deadlock, synchronize processes pytorch  
> * **Keywords**: barrier, synchronization, deadlock, process sync  
> * **Frequently Confused With**: torch.cuda.synchronize

## **Related Models**

resnet, transformer, llama

## **Related Patterns**

memory-efficient-training

## **Related Workflows**

image-classification-pipeline

## **Related Cheatsheet**

distributed

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/distributed.html\#torch.distributed.barrier](https://www.google.com/search?q=https://pytorch.org/docs/stable/distributed.html%23torch.distributed.barrier)

## **Task**

Wrap Models with DistributedDataParallel (torch.nn.parallel.DistributedDataParallel)

## **Problem Solved**

Replicate a model across multiple processes and automatically synchronize gradients during the backward pass using efficient all-reduce operations.

## **Mental Trigger**

I need to scale my training across multiple GPUs by distributing distinct data batches to each GPU.

## **Syntax**

`torch.nn.parallel.DistributedDataParallel(module, device_ids=None, output_device=None, dim=0, broadcast_buffers=True, find_unused_parameters=False)`

## **Important Parameters**

> * **module**: The PyTorch nn.Module to be parallelized across processes.  
> * **device\_ids**: List of CUDA device IDs for target process (such as \[local\_rank\]).  
> * **output\_device**: Target device location for forward pass outputs.  
> * **find\_unused\_parameters**: Traverses computation graph to find uncomputed parameters (set True only for dynamic graphs).  
> * **broadcast\_buffers**: Enables synchronizing module buffers (like BatchNorm statistics) at step start.

## **Return Value**

A wrapped DistributedDataParallel module transparently synchronizing gradients during backward().

## **Example**

`import os`  
`import torch`  
`import torch.nn as nn`  
`import torch.distributed as dist`  
`from torch.nn.parallel import DistributedDataParallel as DDP`

`os.environ["MASTER_ADDR"] = "127.0.0.1"`  
`os.environ["MASTER_PORT"] = "29502"`  
`os.environ["RANK"] = "0"`  
`os.environ["WORLD_SIZE"] = "1"`

`dist.init_process_group(backend="gloo")`

`model = nn.Linear(10, 2)`  
`ddp_model = DDP(model)`

`x = torch.randn(4, 10)`  
`loss = ddp_model(x).sum()`  
`loss.backward()`

`print("DDP forward and backward pass executed successfully.")`  
`dist.destroy_process_group()`

## **Use When**

> * Scaling data-parallel model training across single-node or multi-node GPUs.

## **Avoid When**

> * Models do not fit into single GPU VRAM (use FSDP instead), or single-threaded single-GPU training.

## **Gotchas**

> * Setting find\_unused\_parameters=True unnecessarily, which incurs substantial performance overhead.  
> * Accessing model custom attributes directly on ddp\_model instead of ddp\_model.module.  
> * Using DataParallel (DP) instead of DistributedDataParallel (DDP) for multi-GPU training.

## **Performance Notes**

Overlaps gradient communication with backward computation using bucketed all-reduce for linear scaling.

## **Related APIs**

> * torch.nn.DataParallel  
> * torch.distributed.fsdp.FullyShardedDataParallel

## **Framework Migration Notes**

Direct replacement for tf.distribute.MirroredStrategy or MultiWorkerMirroredStrategy.

## **TensorFlow Equivalent**

`tf.distribute.MultiWorkerMirroredStrategy`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: DDP, DistributedDataParallel  
> * **Common Search Terms**: pytorch DDP example, how to use DistributedDataParallel, ddp vs dataparallel  
> * **Keywords**: DDP, DistributedDataParallel, all-reduce, data parallel  
> * **Frequently Confused With**: torch.nn.DataParallel

## **Related Models**

resnet, vit, yolo, bert, roberta

## **Related Patterns**

memory-efficient-training, device-placement

## **Related Workflows**

image-classification-pipeline, text-classification-pipeline-classical-encoder

## **Related Cheatsheet**

distributed

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.parallel.DistributedDataParallel.html](https://pytorch.org/docs/stable/generated/torch.nn.parallel.DistributedDataParallel.html)

## **Task**

Configure Distributed Sampler for DDP (DistributedSampler)

## **Problem Solved**

Partition a dataset into non-overlapping chunks across distributed processes to ensure each process sees distinct samples per epoch.

## **Mental Trigger**

I need each GPU in my DDP cluster to process a unique subset of the dataset without overlapping.

## **Syntax**

`torch.utils.data.distributed.DistributedSampler(dataset, num_replicas=None, rank=None, shuffle=True, seed=0, drop_last=False)`

## **Important Parameters**

> * **dataset**: The PyTorch Dataset instance to be partitioned.  
> * **num\_replicas**: Total process count (defaults to world size).  
> * **rank**: Current process rank (defaults to current global rank).  
> * **shuffle**: Boolean flag enabling dataset index shuffling each epoch.  
> * **drop\_last**: Drops tail data samples to ensure equal division across ranks.

## **Return Value**

A sampler instance that yields dataset indices assigned to the current process rank.

## **Example**

`import torch`  
`from torch.utils.data import TensorDataset, DataLoader`  
`from torch.utils.data.distributed import DistributedSampler`

`dataset = TensorDataset(torch.arange(100))`

`# Simulating worker rank 0 out of 2 replicas`  
`sampler = DistributedSampler(dataset, num_replicas=2, rank=0, shuffle=True)`  
`loader = DataLoader(dataset, batch_size=10, sampler=sampler)`

`# Must set epoch in training loop for proper shuffling`  
`sampler.set_epoch(0)`  
`for batch in loader:`  
    `pass`

`print(f"Number of batches for rank 0: {len(loader)}")`

## **Use When**

> * Feeding data to DataLoader instances in multi-GPU DDP/FSDP training setups.

## **Avoid When**

> * Running single-process data loading, or using custom iterable datasets that manage sharding internally.

## **Gotchas**

> * Forgetting to call sampler.set\_epoch(epoch) at the start of every epoch, causing identical data ordering each epoch.  
> * Setting shuffle=True in both DataLoader and DistributedSampler (causes conflicting errors; disable shuffle in DataLoader when using a sampler).

## **Performance Notes**

Zero memory overhead, ensures balanced workload distribution across workers.

## **Related APIs**

> * torch.utils.data.DataLoader  
> * torch.nn.parallel.DistributedDataParallel

## **Framework Migration Notes**

Replaces tf.data.Dataset.shard() in distributed TensorFlow pipelines.

## **TensorFlow Equivalent**

`tf.data.Dataset.shard`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: DistributedSampler, sampler.set\_epoch  
> * **Common Search Terms**: pytorch DistributedSampler set\_epoch, how to partition dataset pytorch ddp, distributed data loading  
> * **Keywords**: DistributedSampler, set\_epoch, data partitioning, sharding  
> * **Frequently Confused With**: RandomSampler

## **Related Models**

resnet, vit, bert, roberta

## **Related Patterns**

memory-efficient-training

## **Related Workflows**

image-classification-pipeline, text-classification-pipeline-classical-encoder

## **Related Cheatsheet**

distributed

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/data.html\#torch.utils.data.distributed.DistributedSampler](https://www.google.com/search?q=https://pytorch.org/docs/stable/data.html%23torch.utils.data.distributed.DistributedSampler)

## **Task**

Save and Restore DDP Checkpoints

## **Problem Solved**

Save model weights and optimizer states safely from rank 0 without corrupting checkpoints or causing I/O race conditions across ranks.

## **Mental Trigger**

I need to save a single checkpoint during distributed training and reload it cleanly.

## **Syntax**

`torch.save(ddp_model.module.state_dict(), filepath)`  
`model.load_state_dict(torch.load(filepath, map_location=device))`

## **Important Parameters**

> * **state\_dict**: Model state dictionary obtained from underlying module (ddp\_model.module.state\_dict()).  
> * **filepath**: Target file path for disk saving/loading.  
> * **map\_location**: String or dict mapping tensor storage locations upon reloading.

## **Return Value**

None. Performs serial file I/O operations for model serialization.

## **Example**

`import os`  
`import torch`  
`import torch.nn as nn`  
`import torch.distributed as dist`  
`from torch.nn.parallel import DistributedDataParallel as DDP`

`os.environ["MASTER_ADDR"] = "127.0.0.1"`  
`os.environ["MASTER_PORT"] = "29503"`  
`os.environ["RANK"] = "0"`  
`os.environ["WORLD_SIZE"] = "1"`

`dist.init_process_group(backend="gloo")`  
`model = nn.Linear(5, 2)`  
`ddp_model = DDP(model)`

`# Save checkpoint from rank 0 using underlying module`  
`if dist.get_rank() == 0:`  
    `checkpoint = {"model_state": ddp_model.module.state_dict()}`  
    `torch.save(checkpoint, "checkpoint.pt")`

`dist.barrier()`

`# Load checkpoint on specific device map`  
`if os.path.exists("checkpoint.pt"):`  
    `ckpt = torch.load("checkpoint.pt", map_location="cpu")`  
    `ddp_model.module.load_state_dict(ckpt["model_state"])`  
    `if dist.get_rank() == 0:`  
        `os.remove("checkpoint.pt")`

`dist.destroy_process_group()`

## **Use When**

> * Saving training progress, best model metrics, or optimizer states in multi-GPU DDP training setups.

## **Avoid When**

> * Working with sharded model architectures like FSDP where state dicts must be gathered or saved asynchronously (use torch.distributed.checkpoint for FSDP).

## **Gotchas**

> * Saving ddp\_model.state\_dict() directly instead of ddp\_model.module.state\_dict(), causing state keys to be prefixed with module..  
> * Writing files concurrently from every rank, leading to disk write race conditions and corrupted files.  
> * Failing to pass map\_location when reloading weights on devices with different GPU indices.

## **Performance Notes**

Saving from rank 0 only avoids disk I/O bottlenecks across multi-node filesystems.

## **Related APIs**

> * torch.save  
> * torch.load  
> * DistributedDataParallel.module

## **Framework Migration Notes**

Similar to tf.train.Checkpoint saving from worker 0 only.

## **TensorFlow Equivalent**

`tf.train.CheckpointManager`

## **Version Compatibility**

torch.distributed.checkpoint (DCP) was introduced in PyTorch 2.0 as an alternative unified checkpointing API.

## **Search Metadata**

> * **Aliases**: DDP checkpoint, ddp model saving  
> * **Common Search Terms**: how to save ddp model pytorch, pytorch save ddp state\_dict, ddp module state\_dict  
> * **Keywords**: checkpoint, ddp.module, map\_location, state\_dict  
> * **Frequently Confused With**: torch.distributed.checkpoint

## **Related Models**

resnet, vit, bert, roberta

## **Related Patterns**

memory-efficient-training

## **Related Workflows**

image-classification-pipeline

## **Related Cheatsheet**

distributed

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/notes/ddp.html\#save-load-checkpoints](https://www.google.com/search?q=https://pytorch.org/docs/stable/notes/ddp.html%23save-load-checkpoints)

## **Task**

Wrap Models with FullyShardedDataParallel (torch.distributed.fsdp.FullyShardedDataParallel)

## **Problem Solved**

Shard model parameters, gradients, and optimizer states across distributed workers to train giant models exceeding single GPU VRAM.

## **Mental Trigger**

My model parameters and optimizer states are too large to fit on a single GPU even with FP16/BF16 precision.

## **Syntax**

`torch.distributed.fsdp.FullyShardedDataParallel(module, sharding_strategy=None, cpu_offload=None, auto_wrap_policy=None, device_id=None)`

## **Important Parameters**

> * **module**: Target neural network module to wrap and shard.  
> * **sharding\_strategy**: Defines sharding behavior (FULL\_SHARD, SHARD\_GRAD\_OP, HYBRID\_SHARD).  
> * **cpu\_offload**: Configures parameter offloading to CPU RAM (CPUOffload(offload\_params=True)).  
> * **auto\_wrap\_policy**: Policy dictating recursive sub-module layer wrapping rules.  
> * **device\_id**: Target CUDA device for process placement.

## **Return Value**

An FSDP wrapped module that dynamically shards and gathers layers during forward and backward passes.

## **Example**

`import os`  
`import torch`  
`import torch.nn as nn`  
`import torch.distributed as dist`  
`from torch.distributed.fsdp import FullyShardedDataParallel as FSDP`

`os.environ["MASTER_ADDR"] = "127.0.0.1"`  
`os.environ["MASTER_PORT"] = "29504"`  
`os.environ["RANK"] = "0"`  
`os.environ["WORLD_SIZE"] = "1"`

`dist.init_process_group(backend="gloo")`

`model = nn.Sequential(nn.Linear(100, 100), nn.ReLU(), nn.Linear(100, 10))`  
`fsdp_model = FSDP(model)`

`x = torch.randn(8, 100)`  
`output = fsdp_model(x)`  
`loss = output.sum()`  
`loss.backward()`

`print("FSDP forward and backward execution complete.")`  
`dist.destroy_process_group()`

## **Use When**

> * Training large language models (LLMs) or large vision transformers that exceed individual GPU memory limits.

## **Avoid When**

> * Small models that fit easily on a single GPU with standard DDP (DDP incurs less communication overhead for small models).

## **Gotchas**

> * Wrapping large models without an auto\_wrap\_policy, causing the entire network to be treated as a single monolithic block and preventing layered memory savings.  
> * Attempting to access sub-module parameters directly before unsharding them with FSDP.summon\_full\_params.

## **Performance Notes**

Reduces memory consumption proportionally to world size (1/*N*), enabling multi-billion parameter model training with modest network overhead.

## **Related APIs**

> * torch.nn.parallel.DistributedDataParallel  
> * torch.distributed.fsdp.ShardingStrategy

## **Framework Migration Notes**

Equivalent to DeepSpeed ZeRO stage 3 or Jax/Flax mesh parallelism strategies.

## **TensorFlow Equivalent**

`No direct equivalent.`

## **Version Compatibility**

PyTorch 2.0+ significantly improved FSDP performance, memory efficiency, and native transformer auto-wrap policies.

## **Search Metadata**

> * **Aliases**: FSDP, FullyShardedDataParallel  
> * **Common Search Terms**: pytorch FSDP example, how to use FullyShardedDataParallel, fsdp auto wrap policy  
> * **Keywords**: FSDP, FullyShardedDataParallel, ZeRO-3, sharding, llm training  
> * **Frequently Confused With**: DistributedDataParallel

## **Related Models**

transformer, t5, gpt, llama, qwen, gemma, deepseek

## **Related Patterns**

memory-efficient-training, device-placement

## **Related Workflows**

production-llm-cost-latency-optimization

## **Related Cheatsheet**

distributed

## **Related Decision Guides**

hardware-selection-guide, precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/fsdp.html](https://pytorch.org/docs/stable/fsdp.html)

## **Task**

Configure FSDP Sharding Strategies

## **Problem Solved**

Choose the ideal trade-off between communication frequency and VRAM memory footprint by configuring FSDP sharding modes.

## **Mental Trigger**

I need to optimize training throughput by choosing between full sharding, gradient-only sharding, or hybrid node sharding.

## **Syntax**

`from torch.distributed.fsdp import FullyShardedDataParallel as FSDP, ShardingStrategy`

`fsdp_model = FSDP(model, sharding_strategy=ShardingStrategy.FULL_SHARD)`

## **Important Parameters**

> * **sharding\_strategy**: Strategy enum choice (FULL\_SHARD, SHARD\_GRAD\_OP, NO\_SHARD, HYBRID\_SHARD).  
> * **cpu\_offload**: CPU parameter offload settings.  
> * **backward\_prefetch**: Overlaps backward computation with parameter gathering (BackwardPrefetch.BACKWARD\_PRE or BACKWARD\_POST).

## **Return Value**

Configured FSDP module instance operating under the selected sharding behavior.

## **Example**

`import os`  
`import torch`  
`import torch.nn as nn`  
`import torch.distributed as dist`  
`from torch.distributed.fsdp import (`  
    `FullyShardedDataParallel as FSDP,`  
    `ShardingStrategy,`  
`)`

`os.environ["MASTER_ADDR"] = "127.0.0.1"`  
`os.environ["MASTER_PORT"] = "29505"`  
`os.environ["RANK"] = "0"`  
`os.environ["WORLD_SIZE"] = "1"`

`dist.init_process_group(backend="gloo")`

`model = nn.Linear(20, 10)`  
`# SHARD_GRAD_OP shards gradients and optimizer states, keeping weights intact during forward`  
`fsdp_model = FSDP(model, sharding_strategy=ShardingStrategy.SHARD_GRAD_OP)`

`print(f"Configured strategy: {fsdp_model.sharding_strategy}")`  
`dist.destroy_process_group()`

## **Use When**

> * Tuning large-scale training performance on high-bandwidth or low-bandwidth node interconnects.

## **Avoid When**

> * Single-GPU setups or when standard DDP provides higher throughput without memory bottlenecks.

## **Gotchas**

> * Using FULL\_SHARD on slow network interconnects (e.g., standard Ethernet), causing severe communication bottlenecks.  
> * Misconfiguring HYBRID\_SHARD without setting proper process groups across intra-node and inter-node boundaries.

## **Performance Notes**

FULL\_SHARD minimizes memory (ZeRO-3 equivalent). SHARD\_GRAD\_OP reduces communication overhead by retaining parameters in forward pass (ZeRO-2 equivalent).

## **Related APIs**

> * torch.distributed.fsdp.ShardingStrategy  
> * FullyShardedDataParallel

## **Framework Migration Notes**

Maps to DeepSpeed ZeRO stages: FULL\_SHARD \= ZeRO-3, SHARD\_GRAD\_OP \= ZeRO-2, NO\_SHARD \= DDP.

## **TensorFlow Equivalent**

`No direct equivalent.`

## **Version Compatibility**

HYBRID\_SHARD was stabilized in PyTorch 2.0 to optimize multi-node setups with fast intra-node NVLink and slower inter-node networking.

## **Search Metadata**

> * **Aliases**: ShardingStrategy, FULL\_SHARD, SHARD\_GRAD\_OP  
> * **Common Search Terms**: pytorch fsdp sharding strategy, FULL\_SHARD vs SHARD\_GRAD\_OP, hybrid shard fsdp  
> * **Keywords**: sharding strategy, FULL\_SHARD, SHARD\_GRAD\_OP, HYBRID\_SHARD, ZeRO  
> * **Frequently Confused With**: torch.distributed.tensor.parallel

## **Related Models**

transformer, gpt, llama, qwen, deepseek

## **Related Patterns**

memory-efficient-training

## **Related Workflows**

production-llm-cost-latency-optimization

## **Related Cheatsheet**

distributed

## **Related Decision Guides**

hardware-selection-guide, precision-tradeoffs-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/fsdp.html\#torch.distributed.fsdp.ShardingStrategy](https://www.google.com/search?q=https://pytorch.org/docs/stable/fsdp.html%23torch.distributed.fsdp.ShardingStrategy)

## **Task**

Save and Load FSDP Checkpoints

## **Problem Solved**

Gather distributed parameter shards into a unified full state dict or manage sharded state dicts efficiently for saving and resuming FSDP training.

## **Mental Trigger**

I need to save a trained FSDP model checkpoint either as a consolidated file or directly in distributed sharded format.

## **Syntax**

`from torch.distributed.fsdp import FullyShardedDataParallel as FSDP, StateDictType, FullStateDictConfig`

`save_policy = FullStateDictConfig(offload_to_cpu=True, rank0_only=True)`  
`with FSDP.state_dict_type(fsdp_model, StateDictType.FULL_STATE_DICT, save_policy):`  
    `cpu_state = fsdp_model.state_dict()`

## **Important Parameters**

> * **fsdp\_model**: The wrapped FSDP module.  
> * **state\_dict\_type**: Type enum (FULL\_STATE\_DICT, LOCAL\_STATE\_DICT, SHARDED\_STATE\_DICT).  
> * **state\_dict\_config**: Configuration class (FullStateDictConfig or ShardedStateDictConfig).

## **Return Value**

Context manager configuring state dictionary extraction mode.

## **Example**

`import os`  
`import torch`  
`import torch.nn as nn`  
`import torch.distributed as dist`  
`from torch.distributed.fsdp import (`  
    `FullyShardedDataParallel as FSDP,`  
    `StateDictType,`  
    `FullStateDictConfig,`  
`)`

`os.environ["MASTER_ADDR"] = "127.0.0.1"`  
`os.environ["MASTER_PORT"] = "29506"`  
`os.environ["RANK"] = "0"`  
`os.environ["WORLD_SIZE"] = "1"`

`dist.init_process_group(backend="gloo")`

`model = nn.Linear(10, 2)`  
`fsdp_model = FSDP(model)`

`save_policy = FullStateDictConfig(offload_to_cpu=True, rank0_only=True)`  
`with FSDP.state_dict_type(fsdp_model, StateDictType.FULL_STATE_DICT, save_policy):`  
    `cpu_state = fsdp_model.state_dict()`  
    `if dist.get_rank() == 0:`  
        `torch.save(cpu_state, "fsdp_model.pt")`

`if os.path.exists("fsdp_model.pt") and dist.get_rank() == 0:`  
    `os.remove("fsdp_model.pt")`

`dist.destroy_process_group()`

## **Use When**

> * Saving multi-billion parameter FSDP models for deployment or multi-node training resumes.

## **Avoid When**

> * Standard non-sharded PyTorch modules (use standard torch.save instead).

## **Gotchas**

> * Calling fsdp\_model.state\_dict() without setting FSDP.state\_dict\_type, leading to OOM or incomplete parameter states.  
> * Gathering FULL\_STATE\_DICT on GPU without setting offload\_to\_cpu=True, causing immediate Host/GPU OOM crashes for large models.  
> * Forgetting rank0\_only=True when saving full state dicts, causing all nodes to write redundant files simultaneously.

## **Performance Notes**

SHARDED\_STATE\_DICT combined with torch.distributed.checkpoint (DCP) allows fast, non-blocking parallel I/O across multi-node clusters.

## **Related APIs**

> * torch.distributed.checkpoint  
> * torch.distributed.fsdp.StateDictType

## **Framework Migration Notes**

Replaces custom parameter gathering code used in older distributed frameworks.

## **TensorFlow Equivalent**

`No direct equivalent.`

## **Version Compatibility**

torch.distributed.checkpoint (DCP) became the recommended approach for FSDP sharded checkpointing in PyTorch 2.1+.

## **Search Metadata**

> * **Aliases**: fsdp save checkpoint, FullStateDictConfig  
> * **Common Search Terms**: how to save FSDP model pytorch, fsdp state\_dict\_type, FSDP offload\_to\_cpu rank0\_only  
> * **Keywords**: FSDP, FULL\_STATE\_DICT, SHARDED\_STATE\_DICT, checkpointing, offload\_to\_cpu  
> * **Frequently Confused With**: torch.save

## **Related Models**

transformer, gpt, llama, qwen, deepseek

## **Related Patterns**

memory-efficient-training

## **Related Workflows**

production-llm-cost-latency-optimization

## **Related Cheatsheet**

distributed

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/fsdp.html\#saving-and-loading-process](https://www.google.com/search?q=https://pytorch.org/docs/stable/fsdp.html%23saving-and-loading-process)

## **Task**

Launch Distributed Training with torchrun

## **Problem Solved**

Automatically handle process creation, environment variable assignment, and process failure recovery for multi-GPU training jobs.

## **Mental Trigger**

I want to launch a distributed script across 4 GPUs on my machine without manually writing multiprocessing spawn code.

## **Syntax**

`torchrun --nnodes=1 --nproc_per_node=NUM_GPUS script.py [args...]`

## **Important Parameters**

> * **\--nproc\_per\_node**: Number of worker processes to spawn per compute node (typically equals GPU count).  
> * **\--nnodes**: Total number of physical compute nodes involved in execution.  
> * **\--rdzv\_backend**: Rendezvous backend for worker process discovery ('c10d').  
> * **\--rdzv\_endpoint**: IP address and port of the rendezvous coordinator.  
> * **\--max\_restarts**: Maximum number of automatic worker restart attempts upon failure.

## **Return Value**

Command line utility execution process spawning worker instances.

## **Example**

`# Running the launcher from command line:`  
`# torchrun --standalone --nproc_per_node=4 train.py --batch_size 32`

`import os`  
`import torch`  
`import torch.distributed as dist`

`def main():`  
    `# Environment variables set automatically by torchrun`  
    `dist.init_process_group(backend="gloo")`  
    `local_rank = int(os.environ.get("LOCAL_RANK", 0))`  
    `print(f"Running worker process on local rank {local_rank}")`  
    `dist.destroy_process_group()`

`if __name__ == "__main__":`  
    `main()`

## **Use When**

> * Launching any production DDP or FSDP script on single-node or multi-node clusters.

## **Avoid When**

> * Interactive debugging in Jupyter notebooks where torch.multiprocessing.spawn or manual process initiation is required.

## **Gotchas**

> * Hardcoding RANK or WORLD\_SIZE inside dist.init\_process\_group() when using torchrun, overriding torchrun environment variables.  
> * Using deprecated python \-m torch.distributed.launch instead of torchrun.  
> * Forgetting to bind LOCAL\_RANK to torch.cuda.set\_device(local\_rank).

## **Performance Notes**

Eliminates Python GIL limitations by executing independent OS processes for each GPU.

## **Related APIs**

> * torch.distributed.init\_process\_group  
> * torch.multiprocessing.spawn

## **Framework Migration Notes**

Replaces tf.estimator or torch.distributed.launch CLI utilities.

## **TensorFlow Equivalent**

`tf.distribute.run`

## **Version Compatibility**

torchrun fully replaced torch.distributed.launch in PyTorch 1.10+.

## **Search Metadata**

> * **Aliases**: torchrun, torch.distributed.launch  
> * **Common Search Terms**: how to use torchrun, torchrun nproc\_per\_node, launch pytorch ddp script  
> * **Keywords**: torchrun, nproc\_per\_node, distributed launch, standalone  
> * **Frequently Confused With**: python \-m torch.distributed.launch

## **Related Models**

resnet, vit, transformer, gpt, llama

## **Related Patterns**

device-placement

## **Related Workflows**

image-classification-pipeline, production-llm-cost-latency-optimization

## **Related Cheatsheet**

distributed

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/elastic/run.html](https://pytorch.org/docs/stable/elastic/run.html)

## **Task**

Configure Multi-Node Training (torchrun rendezvous options)

## **Problem Solved**

Coordinate distributed process initialization across multiple distinct compute nodes using dynamic rendezvous protocols.

## **Mental Trigger**

I need to expand my training job from 1 node (8 GPUs) to 4 nodes (32 GPUs) across my network cluster.

## **Syntax**

`torchrun --nnodes=NUM_NODES --nproc_per_node=GPUS_PER_NODE --node_rank=NODE_INDEX --rdzv_id=JOB_ID --rdzv_backend=c10d --rdzv_endpoint=MASTER_NODE_IP:29500 script.py`

## **Important Parameters**

> * **\--nnodes**: Total number of physical machines in the cluster.  
> * **\--nproc\_per\_node**: Number of processes to spawn on each individual node.  
> * **\--node\_rank**: Unique index identifier for current node (0 to NUM\_NODES \- 1).  
> * **\--rdzv\_id**: Unique string or integer job identifier.  
> * **\--rdzv\_endpoint**: Host IP and port of primary coordinator node (MASTER\_IP:PORT).

## **Return Value**

Multi-node process coordinator managing node auto-discovery and fault tolerance.

## **Example**

`# Execute on Master Node (Node 0, IP: 192.168.1.100):`  
`torchrun \`  
    `--nnodes=2 \`  
    `--nproc_per_node=8 \`  
    `--node_rank=0 \`  
    `--rdzv_id=12345 \`  
    `--rdzv_backend=c10d \`  
    `--rdzv_endpoint=192.168.1.100:29500 \`  
    `train.py`

`# Execute on Worker Node (Node 1):`  
`torchrun \`  
    `--nnodes=2 \`  
    `--nproc_per_node=8 \`  
    `--node_rank=1 \`  
    `--rdzv_id=12345 \`  
    `--rdzv_backend=c10d \`  
    `--rdzv_endpoint=192.168.1.100:29500 \`  
    `train.py`

## **Use When**

> * Running large-scale training jobs across clusters of multiple GPU servers.

## **Avoid When**

> * Single-node training setups (use \--standalone option instead).

## **Gotchas**

> * Network firewalls blocking communication on the specified \--rdzv\_endpoint port.  
> * Discrepancies in \--rdzv\_id or network arguments across nodes causing rendezvous timeout failures.  
> * Differing code or PyTorch package versions across master and worker nodes.

## **Performance Notes**

Enables elastic fault tolerance and efficient multi-node scaling when paired with high-speed InfiniBand networking.

## **Related APIs**

> * torchrun  
> * torch.distributed.init\_process\_group

## **Framework Migration Notes**

Similar to configuring multi-worker cluster specs in Slurm or Kubernetes.

## **TensorFlow Equivalent**

`TF_CONFIG`

## **Version Compatibility**

Modern PyTorch c10d rendezvous backend replaced etcd dependency for reliable serverless dynamic discovery.

## **Search Metadata**

> * **Aliases**: multi-node torchrun, rdzv\_endpoint  
> * **Common Search Terms**: pytorch multi node training torchrun, rdzv\_endpoint torchrun, multi node ddp setup  
> * **Keywords**: multi-node, rendezvous, rdzv\_endpoint, c10d, torchrun  
> * **Frequently Confused With**: Single-node torchrun \--standalone

## **Related Models**

transformer, gpt, llama, qwen, deepseek

## **Related Patterns**

memory-efficient-training

## **Related Workflows**

production-llm-cost-latency-optimization

## **Related Cheatsheet**

distributed

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/elastic/run.html\#multinode-launch](https://www.google.com/search?q=https://pytorch.org/docs/stable/elastic/run.html%23multinode-launch)

## **Task**

Perform Collective Communication (all\_reduce, broadcast, all\_gather)

## **Problem Solved**

Share, aggregate, or synchronize tensor data directly across distributed workers without passing through a central server.

## **Mental Trigger**

I need to average loss values or aggregate evaluation metrics across all GPUs during training.

## **Syntax**

`torch.distributed.all_reduce(tensor, op=torch.distributed.ReduceOp.SUM, group=None, async_op=False)`  
`torch.distributed.broadcast(tensor, src=0, group=None, async_op=False)`  
`torch.distributed.all_gather(tensor_list, tensor, group=None, async_op=False)`

## **Important Parameters**

> * **tensor**: Target tensor to communicate or reduce.  
> * **op**: Reduction operation enum (ReduceOp.SUM, ReduceOp.PRODUCT, ReduceOp.MIN, ReduceOp.MAX).  
> * **src**: Source rank integer for broadcast operation.  
> * **tensor\_list**: Destination list of tensors to hold gathered outputs for all\_gather.  
> * **async\_op**: Boolean flag indicating whether the operation is non-blocking.

## **Return Value**

Work object if async\_op=True, else None. Modifies tensors in-place.

## **Example**

`import os`  
`import torch`  
`import torch.distributed as dist`

`os.environ["MASTER_ADDR"] = "127.0.0.1"`  
`os.environ["MASTER_PORT"] = "29507"`  
`os.environ["RANK"] = "0"`  
`os.environ["WORLD_SIZE"] = "1"`

`dist.init_process_group(backend="gloo")`

`# All-Reduce example: Summing values across ranks`  
`tensor = torch.tensor([1.0, 2.0])`  
`dist.all_reduce(tensor, op=dist.ReduceOp.SUM)`

`# All-Gather example: Gathering tensors from all ranks`  
`tensor_list = [torch.zeros_like(tensor) for _ in range(dist.get_world_size())]`  
`dist.all_gather(tensor_list, tensor)`

`print(f"Gathered tensors: {tensor_list}")`  
`dist.destroy_process_group()`

## **Use When**

> * Aggregating evaluation metrics, broadcasting initial hyperparameter seeds, or implementing custom parallel primitives.

## **Avoid When**

> * Standard gradient synchronization handled automatically by DDP or FSDP.

## **Gotchas**

> * Forgetting that all\_reduce modifies the input tensor in-place.  
> * Mismatched tensor shapes across ranks during all\_gather operations, leading to segmentation faults or collective hangs.  
> * Executing collective operations in different orders across different processes, leading to deadlocks.

## **Performance Notes**

Implemented via highly optimized NCCL ring and tree algorithms to maximize NVLink interconnect bandwidth.

## **Related APIs**

> * torch.distributed.all\_reduce  
> * torch.distributed.all\_gather\_into\_tensor  
> * torch.distributed.broadcast

## **Framework Migration Notes**

Maps directly to MPI or Horovod collective operations.

## **TensorFlow Equivalent**

`tf.distribute.StrategyExtended.reduce_to`

## **Version Compatibility**

all\_gather\_into\_tensor was introduced in PyTorch 1.12 to replace all\_gather with higher efficiency memory allocation.

## **Search Metadata**

> * **Aliases**: all\_reduce, all\_gather, dist.broadcast  
> * **Common Search Terms**: pytorch all\_reduce example, how to all\_gather tensors pytorch, pytorch collective communication  
> * **Keywords**: all\_reduce, all\_gather, broadcast, collective communication, NCCL  
> * **Frequently Confused With**: torch.gather

## **Related Models**

resnet, vit, transformer, bert, llama

## **Related Patterns**

memory-efficient-training

## **Related Workflows**

image-classification-pipeline, production-llm-cost-latency-optimization

## **Related Cheatsheet**

distributed

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/distributed.html\#collective-functions](https://www.google.com/search?q=https://pytorch.org/docs/stable/distributed.html%23collective-functions)

## **Task**

Debug and Monitor Distributed Training Failures

## **Problem Solved**

Identify network hangs, unhandled process exceptions, host timeouts, or silent deadlocks during distributed training executions.

## **Mental Trigger**

My distributed job freezes indefinitely without printing an error message or throwing a stack trace.

## **Syntax**

`import os`

`os.environ["TORCH_DISTRIBUTED_DEBUG"] = "DETAIL"`  
`os.environ["TORCH_CPP_LOG_LEVEL"] = "INFO"`  
`os.environ["NCCL_DEBUG"] = "INFO"`

## **Important Parameters**

> * **TORCH\_DISTRIBUTED\_DEBUG**: Controls PyTorch distributed debug logging ('OFF', 'INFO', 'DETAIL').  
> * **NCCL\_DEBUG**: Controls underlying NVIDIA NCCL library log verbosity ('WARN', 'INFO').  
> * **NCCL\_DEBUG\_SUBSYS**: Specifies sub-components to monitor ('INIT', 'COLL', 'ENV').  
> * **TORCH\_NCCL\_ASYNC\_ERROR\_HANDLING**: Toggles async error handling behavior for failed GPU kernels.

## **Return Value**

Diagnostic log traces emitted to standard stdout/stderr streams.

## **Example**

`import os`  
`import torch`  
`import torch.distributed as dist`

`# Enable detailed distributed tracing before process group initialization`  
`os.environ["TORCH_DISTRIBUTED_DEBUG"] = "DETAIL"`  
`os.environ["NCCL_DEBUG"] = "INFO"`

`os.environ["MASTER_ADDR"] = "127.0.0.1"`  
`os.environ["MASTER_PORT"] = "29508"`  
`os.environ["RANK"] = "0"`  
`os.environ["WORLD_SIZE"] = "1"`

`dist.init_process_group(backend="gloo")`  
`print("Distributed process group initialized with debug logging active.")`  
`dist.destroy_process_group()`

## **Use When**

> * Diagnosing deadlocks, hangs, NCCL ring initialization failures, or unused parameter warnings in DDP.

## **Avoid When**

> * Running high-throughput production jobs where verbose NCCL debug logs saturate console output.

## **Gotchas**

> * Leaving TORCH\_DISTRIBUTED\_DEBUG=DETAIL enabled during production runs, which adds overhead to graph analysis.  
> * Ignoring NCCL network interface selection flags (NCCL\_SOCKET\_IFNAME) on multi-interface clusters.

## **Performance Notes**

Diagnostic logging increases latency slightly. Turn off debug environment variables after issue resolution.

## **Related APIs**

> * torch.distributed.monitored\_barrier  
> * torch.distributed.init\_process\_group

## **Framework Migration Notes**

Similar to TF\_CPP\_MIN\_LOG\_LEVEL debugging in TensorFlow distributed setups.

## **TensorFlow Equivalent**

`TF_CPP_MIN_LOG_LEVEL`

## **Version Compatibility**

PyTorch 2.0+ introduced TORCH\_NCCL\_ASYNC\_ERROR\_HANDLING=1 enabled by default to prevent indefinite hangs on CUDA errors.

## **Search Metadata**

> * **Aliases**: TORCH\_DISTRIBUTED\_DEBUG, NCCL\_DEBUG, debug distributed pytorch  
> * **Common Search Terms**: pytorch distributed freeze debug, TORCH\_DISTRIBUTED\_DEBUG detail, nccl debug info  
> * **Keywords**: debugging, TORCH\_DISTRIBUTED\_DEBUG, NCCL\_DEBUG, deadlock, hangs  
> * **Frequently Confused With**: torch.autograd.set\_detect\_anomaly

## **Related Models**

resnet, transformer, llama

## **Related Patterns**

memory-efficient-training

## **Related Workflows**

production-llm-cost-latency-optimization

## **Related Cheatsheet**

distributed

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/distributed.html\#troubleshooting](https://www.google.com/search?q=https://pytorch.org/docs/stable/distributed.html%23troubleshooting)

---

