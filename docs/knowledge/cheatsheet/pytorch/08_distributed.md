# **PyTorch Distributed Training Cheatsheet**

## **Enable Automatic Mixed Precision (torch.amp.autocast)**

### **Trigger**

I need to accelerate model training or inference while lowering memory consumption by running operations in lower-precision formats.

### **Snippet**

import torch

device \= "cuda" if torch.cuda.is\_available() else "cpu"  
model \= torch.nn.Linear(1024, 512).to(device)  
x \= torch.randn(32, 1024, device=device)

with torch.amp.autocast(device\_type=device):  
    output \= model(x)  
    loss \= output.sum()

print(output.dtype)

### **Minimal Notes**

torch.amp.autocast automatically selects the optimal precision (e.g., FP16 or BF16) for ops inside its context manager while leaving precision-sensitive ops in FP32. It should wrap only the forward pass and loss computation, not the backward pass or optimizer step.

### **Common Bug**

**Issue:** Operations inside torch.amp.autocast remain in torch.float32 despite autocast being enabled.

**Cause:** Passing tensors created on CPU or an unsupported device while device\_type is configured for CUDA.

**Quick Fix:** Ensure input tensors and model weights are moved to the matching accelerator device before entering the autocast region.

### **Official Documentation URL**

[https://docs.pytorch.org/docs/stable/amp.html](https://docs.pytorch.org/docs/stable/amp.html)

## **Select AMP Device Type (device\_type="cuda" / "cpu")**

### **Trigger**

I need to configure mixed precision specifically for GPU acceleration or CPU execution across different hardware targets.

### **Snippet**

import torch

cuda\_model \= torch.nn.Linear(256, 128).to("cuda")  
cuda\_input \= torch.randn(16, 256, device="cuda")

with torch.amp.autocast(device\_type="cuda"):  
    cuda\_out \= cuda\_model(cuda\_input)

cpu\_model \= torch.nn.Linear(256, 128).to("cpu")  
cpu\_input \= torch.randn(16, 256, device="cpu")

with torch.amp.autocast(device\_type="cpu", dtype=torch.bfloat16):  
    cpu\_out \= cpu\_model(cpu\_input)

print(cuda\_out.dtype, cpu\_out.dtype)

### **Minimal Notes**

The device\_type parameter explicitly defines the target accelerator or host (cuda, cpu, xpu) for op precision casting rules. CPU autocast typically defaults to torch.bfloat16, whereas CUDA supports both torch.float16 and torch.bfloat16.

### **Common Bug**

**Issue:** RuntimeError: User specified device\_type 'cuda', but CUDA is not available when running on a CPU-only machine.

**Cause:** Hardcoding device\_type="cuda" without dynamically verifying GPU availability.

**Quick Fix:** Extract the device string dynamically via tensor.device.type or torch.cuda.is\_available().

### **Official Documentation URL**

[https://docs.pytorch.org/docs/stable/amp.html](https://docs.pytorch.org/docs/stable/amp.html)

## **Configure AMP Precision (dtype=torch.float16 / torch.bfloat16)**

### **Trigger**

I need to specify whether to use FP16 for speed on older GPUs or BF16 for dynamic range stability on modern accelerators and CPUs.

### **Snippet**

import torch

device \= "cuda" if torch.cuda.is\_available() else "cpu"  
model \= torch.nn.Linear(512, 256).to(device)  
x \= torch.randn(16, 512, device=device)

target\_dtype \= torch.bfloat16 if torch.cuda.is\_bf16\_supported() else torch.float16

with torch.amp.autocast(device\_type=device, dtype=target\_dtype):  
    output \= model(x)

print(f"Executed with precision: {output.dtype}")

### **Minimal Notes**

torch.float16 requires gradient scaling to avoid underflow, while torch.bfloat16 offers higher dynamic range and generally does not require gradient scaling. Modern GPUs (NVIDIA Ampere and newer) and modern CPUs support native BF16 execution.

### **Common Bug**

**Issue:** Training destabilizes with NaN loss values when using torch.float16 without gradient scaling.

**Cause:** FP16 has a narrow dynamic range, causing small gradients to underflow to zero during backward pass.

**Quick Fix:** Use torch.amp.GradScaler when training with torch.float16 or switch to dtype=torch.bfloat16.

### **Official Documentation URL**

[https://docs.pytorch.org/docs/stable/amp.html](https://docs.pytorch.org/docs/stable/amp.html)

## **Scale Gradients (torch.amp.GradScaler)**

### **Trigger**

I need to prevent gradient underflow when training deep neural networks with FP16 automatic mixed precision.

### **Snippet**

import torch

device \= "cuda" if torch.cuda.is\_available() else "cpu"  
model \= torch.nn.Linear(100, 10).to(device)  
optimizer \= torch.optim.SGD(model.parameters(), lr=0.01)  
scaler \= torch.amp.GradScaler(device=device, enabled=(device \== "cuda"))

inputs \= torch.randn(16, 100, device=device)  
targets \= torch.randn(16, 10, device=device)

optimizer.zero\_grad()  
with torch.amp.autocast(device\_type=device, dtype=torch.float16):  
    outputs \= model(inputs)  
    loss \= torch.nn.functional.mse\_loss(outputs, targets)

scaler.scale(loss).backward()  
scaler.step(optimizer)  
scaler.update()

### **Minimal Notes**

GradScaler multiplies the loss by a scale factor prior to backward pass to ensure small gradients do not underflow to zero. Deprecated device-specific aliases like torch.cuda.amp.GradScaler should be replaced with torch.amp.GradScaler(device=...).

### **Common Bug**

**Issue:** Calling loss.backward() directly instead of scaler.scale(loss).backward() causes training divergence.

**Cause:** Gradients remain unscaled, causing FP16 precision loss and gradient underflow.

**Quick Fix:** Pass the loss tensor into scaler.scale(loss) prior to invoking .backward().

### **Official Documentation URL**

[https://docs.pytorch.org/docs/stable/amp.html](https://docs.pytorch.org/docs/stable/amp.html)

## **Unscale Gradients Before Clipping (GradScaler.unscale\_)**

### **Trigger**

I need to inspect or clip model gradients while using gradient scaling during FP16 mixed precision training.

### **Snippet**

import torch

device \= "cuda" if torch.cuda.is\_available() else "cpu"  
model \= torch.nn.Linear(128, 64).to(device)  
optimizer \= torch.optim.Adam(model.parameters(), lr=0.001)  
scaler \= torch.amp.GradScaler(device=device, enabled=(device \== "cuda"))

x \= torch.randn(8, 128, device=device)  
optimizer.zero\_grad()

with torch.amp.autocast(device\_type=device, dtype=torch.float16):  
    loss \= model(x).sum()

scaler.scale(loss).backward()

scaler.unscale\_(optimizer)  
torch.nn.utils.clip\_grad\_norm\_(model.parameters(), max\_norm=1.0)

scaler.step(optimizer)  
scaler.update()

### **Minimal Notes**

GradScaler.unscale\_ multiplies gradients by 1 / scale so that gradient norms accurately reflect actual parameter magnitudes before clipping. It must be called once per optimizer per iteration prior to explicit gradient modification or clipping.

### **Common Bug**

**Issue:** RuntimeError: unscale\_() has already been called on this optimizer since the last update() when calling unscale\_ twice.

**Cause:** Executing scaler.unscale\_(optimizer) explicitly and having scaler.step(optimizer) attempt to unscale again automatically.

**Quick Fix:** Call scaler.unscale\_(optimizer) only once per step before clipping; scaler.step() safely skips unscaling if already unscaled.

### **Official Documentation URL**

[https://docs.pytorch.org/docs/stable/notes/amp\_examples.html](https://docs.pytorch.org/docs/stable/notes/amp_examples.html)

## **Update GradScaler (GradScaler.step / GradScaler.update)**

### **Trigger**

I need to apply optimizer updates and dynamically adjust the gradient scaling factor based on the presence of Inf/NaN gradients.

### **Snippet**

import torch

device \= "cuda" if torch.cuda.is\_available() else "cpu"  
model \= torch.nn.Linear(64, 32).to(device)  
optimizer \= torch.optim.AdamW(model.parameters(), lr=1e-3)  
scaler \= torch.amp.GradScaler(device=device, enabled=(device \== "cuda"))

x \= torch.randn(4, 64, device=device)  
optimizer.zero\_grad()

with torch.amp.autocast(device\_type=device, dtype=torch.float16):  
    loss \= model(x).pow(2).sum()

scaler.scale(loss).backward()  
scaler.step(optimizer)  
scaler.update()

### **Minimal Notes**

scaler.step(optimizer) unscales gradients (if needed) and skips optimizer.step() if Inf/NaN gradients are detected. scaler.update() adjusts the scaling factor up or down for subsequent training iterations based on whether gradients contained non-finite values.

### **Common Bug**

**Issue:** Gradient scale factor rapidly decreases to zero or model weights fail to update.

**Cause:** Skipping scaler.update() at the end of the step, preventing GradScaler from adjusting its internal scale state.

**Quick Fix:** Always call scaler.update() at the end of every optimization iteration after scaler.step(optimizer).

### **Official Documentation URL**

[https://docs.pytorch.org/docs/stable/amp.html](https://docs.pytorch.org/docs/stable/amp.html)

## **Initialize Distributed Process Group (torch.distributed.init\_process\_group)**

### **Trigger**

I need to establish inter-process communication across multiple processes or nodes for distributed training.

### **Snippet**

import os  
import torch  
import torch.distributed as dist

def setup\_distributed():  
    os.environ\["MASTER\_ADDR"\] \= "localhost"  
    os.environ\["MASTER\_PORT"\] \= "29500"  
    backend \= "nccl" if torch.cuda.is\_available() else "gloo"  
    dist.init\_process\_group(  
        backend=backend,  
        rank=int(os.environ.get("RANK", "0")),  
        world\_size=int(os.environ.get("WORLD\_SIZE", "1"))  
    )

if \_\_name\_\_ \== "\_\_main\_\_":  
    setup\_distributed()  
    print(f"Process initialized: rank {dist.get\_rank()}")  
    dist.destroy\_process\_group()

### **Minimal Notes**

init\_process\_group initializes the default distributed process group and sets up collective communication backends (nccl for GPUs, gloo for CPUs). It must be called before executing any distributed communication primitives or initializing DDP/FSDP.

### **Common Bug**

**Issue:** RuntimeError: Default process group has not been initialized when invoking distributed modules.

**Cause:** Attempting to construct DistributedDataParallel or perform collective calls prior to calling init\_process\_group.

**Quick Fix:** Invoke torch.distributed.init\_process\_group(...) at the very beginning of the worker script execution.

### **Official Documentation URL**

[https://docs.pytorch.org/docs/stable/distributed.html](https://docs.pytorch.org/docs/stable/distributed.html)

## **Destroy Process Group (torch.distributed.destroy\_process\_group)**

### **Trigger**

I need to cleanly close distributed communication channels and release network resources upon script completion or teardown.

### **Snippet**

import os  
import torch  
import torch.distributed as dist

def run\_distributed\_job():  
    os.environ\["MASTER\_ADDR"\] \= "localhost"  
    os.environ\["MASTER\_PORT"\] \= "29501"  
    backend \= "nccl" if torch.cuda.is\_available() else "gloo"  
    dist.init\_process\_group(  
        backend=backend,  
        rank=int(os.environ.get("RANK", "0")),  
        world\_size=int(os.environ.get("WORLD\_SIZE", "1"))  
    )  
      
    try:  
        x \= torch.ones(1, device="cuda" if torch.cuda.is\_available() else "cpu")  
        dist.all\_reduce(x)  
    finally:  
        dist.destroy\_process\_group()

if \_\_name\_\_ \== "\_\_main\_\_":  
    run\_distributed\_job()

### **Minimal Notes**

destroy\_process\_group releases backend resources, closes socket handles, and terminates communication contexts. Wrapping distributed workflows in try...finally guarantees proper cleanup even when errors occur during execution.

### **Common Bug**

**Issue:** Training process hangs or leaks memory socket handles after an exception or job completion.

**Cause:** Omitting destroy\_process\_group(), leaving active backend connections open across cluster processes.

**Quick Fix:** Enclose all distributed execution logic in a try...finally block that calls dist.destroy\_process\_group() in finally.

### **Official Documentation URL**

[https://docs.pytorch.org/docs/stable/distributed.html](https://docs.pytorch.org/docs/stable/distributed.html)

## **Synchronize Processes (torch.distributed.barrier)**

### **Trigger**

I need to force all distributed processes to pause execution until every rank in the process group reaches a specific checkpoint.

### **Snippet**

import os  
import torch  
import torch.distributed as dist

def run():  
    os.environ\["MASTER\_ADDR"\] \= "localhost"  
    os.environ\["MASTER\_PORT"\] \= "29502"  
    backend \= "nccl" if torch.cuda.is\_available() else "gloo"  
    dist.init\_process\_group(  
        backend=backend,  
        rank=int(os.environ.get("RANK", "0")),  
        world\_size=int(os.environ.get("WORLD\_SIZE", "1"))  
    )

    rank \= dist.get\_rank()  
    if rank \== 0:  
        with open("/tmp/shared\_dataset.txt", "w") as f:  
            f.write("Dataset ready")  
      
    dist.barrier()  
      
    with open("/tmp/shared\_dataset.txt", "r") as f:  
        data \= f.read()

    dist.destroy\_process\_group()

if \_\_name\_\_ \== "\_\_main\_\_":  
    run()

### **Minimal Notes**

barrier blocks all processes in the target process group until every process has reached the barrier call. It is frequently used to coordinate file I/O operations, dataset downloading, or checkpointing across ranks.

### **Common Bug**

**Issue:** Distributed script deadlocks indefinitely at dist.barrier().

**Cause:** Executing dist.barrier() inside a conditional block (if rank \== 0\) that is not executed by all participating ranks.

**Quick Fix:** Ensure dist.barrier() is called outside process-specific conditional branches so every process executes it simultaneously.

### **Official Documentation URL**

[https://docs.pytorch.org/docs/stable/distributed.html](https://docs.pytorch.org/docs/stable/distributed.html)

## **Query Distributed Environment (get\_rank, get\_world\_size, is\_initialized)**

### **Trigger**

I need to check if distributed training is active and inspect the current process rank and total world size dynamically.

### **Snippet**

import os  
import torch  
import torch.distributed as dist

def inspect\_environment():  
    if not dist.is\_initialized():  
        print("Distributed environment is not active.")  
        return  
      
    rank \= dist.get\_rank()  
    world\_size \= dist.get\_world\_size()  
    print(f"Active distributed process: Rank {rank} of {world\_size}")

if \_\_name\_\_ \== "\_\_main\_\_":  
    os.environ\["MASTER\_ADDR"\] \= "localhost"  
    os.environ\["MASTER\_PORT"\] \= "29503"  
    backend \= "nccl" if torch.cuda.is\_available() else "gloo"  
    dist.init\_process\_group(  
        backend=backend,  
        rank=int(os.environ.get("RANK", "0")),  
        world\_size=int(os.environ.get("WORLD\_SIZE", "1"))  
    )  
      
    inspect\_environment()  
    dist.destroy\_process\_group()

### **Minimal Notes**

is\_initialized() checks whether the process group is active, while get\_rank() and get\_world\_size() return process identity metadata. Querying these utilities allows writing rank-aware logic, such as restricting logging or checkpoint saving exclusively to rank 0\.

### **Common Bug**

**Issue:** RuntimeError: Default process group has not been initialized when calling get\_rank().

**Cause:** Attempting to query get\_rank() or get\_world\_size() before calling init\_process\_group().

**Quick Fix:** Always verify dist.is\_initialized() before calling rank or world size query functions.

### **Official Documentation URL**

[https://docs.pytorch.org/docs/stable/distributed.html](https://docs.pytorch.org/docs/stable/distributed.html)

## **Wrap Model with DistributedDataParallel (torch.nn.parallel.DistributedDataParallel)**

### **Trigger**

I need to parallelize data processing across multiple GPUs by replicating model parameters and synchronizing gradients.

### **Snippet**

import os  
import torch  
import torch.nn as nn  
import torch.distributed as dist  
from torch.nn.parallel import DistributedDataParallel as DDP

def setup\_and\_train():  
    os.environ\["MASTER\_ADDR"\] \= "localhost"  
    os.environ\["MASTER\_PORT"\] \= "29504"  
    local\_rank \= int(os.environ.get("LOCAL\_RANK", "0"))  
      
    if torch.cuda.is\_available():  
        torch.cuda.set\_device(local\_rank)  
        device \= torch.device("cuda", local\_rank)  
        backend \= "nccl"  
    else:  
        device \= torch.device("cpu")  
        backend \= "gloo"  
          
    dist.init\_process\_group(  
        backend=backend,  
        rank=int(os.environ.get("RANK", "0")),  
        world\_size=int(os.environ.get("WORLD\_SIZE", "1"))  
    )

    model \= nn.Linear(10, 5).to(device)  
    if device.type \== "cuda":  
        ddp\_model \= DDP(model, device\_ids=\[local\_rank\], output\_device=local\_rank)  
    else:  
        ddp\_model \= DDP(model)

    x \= torch.randn(4, 10, device=device)  
    loss \= ddp\_model(x).sum()  
    loss.backward()

    dist.destroy\_process\_group()

if \_\_name\_\_ \== "\_\_main\_\_":  
    setup\_and\_train()

### **Minimal Notes**

DistributedDataParallel synchronizes gradients during the backward pass using all-reduce operations across worker processes. Each process must bind to a unique GPU device before constructing DDP to ensure correct memory placement and gradient reduction.

### **Common Bug**

**Issue:** RuntimeError: Expected all tensors to be on the same device or severe slowdown in GPU communication.

**Cause:** Passing model parameters residing on CPU or placing multiple DDP replicas onto a single default GPU without setting device\_ids.

**Quick Fix:** Move the base model to the specific local\_rank GPU via torch.cuda.set\_device(local\_rank) and set device\_ids=\[local\_rank\].

### **Official Documentation URL**

[https://docs.pytorch.org/docs/stable/generated/torch.nn.parallel.DistributedDataParallel.html](https://docs.pytorch.org/docs/stable/generated/torch.nn.parallel.DistributedDataParallel.html)

## **Use DistributedSampler (torch.utils.data.distributed.DistributedSampler)**

### **Trigger**

I need to partition a dataset across multiple distributed workers so that each rank processes a unique, non-overlapping subset per epoch.

### **Snippet**

import os  
import torch  
from torch.utils.data import DataLoader, TensorDataset  
from torch.utils.data.distributed import DistributedSampler  
import torch.distributed as dist

def run\_sampler():  
    os.environ\["MASTER\_ADDR"\] \= "localhost"  
    os.environ\["MASTER\_PORT"\] \= "29505"  
    dist.init\_process\_group(  
        backend="gloo",  
        rank=int(os.environ.get("RANK", "0")),  
        world\_size=int(os.environ.get("WORLD\_SIZE", "1"))  
    )

    dataset \= TensorDataset(torch.arange(100), torch.arange(100))  
    sampler \= DistributedSampler(dataset, shuffle=True)  
    loader \= DataLoader(dataset, batch\_size=10, sampler=sampler)

    for epoch in range(2):  
        sampler.set\_epoch(epoch)  
        for x, y in loader:  
            pass

    dist.destroy\_process\_group()

if \_\_name\_\_ \== "\_\_main\_\_":  
    run\_sampler()

### **Minimal Notes**

DistributedSampler restricts data loading to a subset of the dataset exclusive to the calling rank. Setting sampler.set\_epoch(epoch) at the beginning of each epoch is required to ensure deterministic, epoch-specific shuffling across all processes.

### **Common Bug**

**Issue:** Model sees the exact same sample ordering across every epoch during distributed training.

**Cause:** Forgetting to call sampler.set\_epoch(epoch) prior to iterating over the DataLoader loop.

**Quick Fix:** Call sampler.set\_epoch(epoch) at the start of every epoch loop before fetching batches from DataLoader.

### **Official Documentation URL**

[https://docs.pytorch.org/docs/stable/data.html](https://docs.pytorch.org/docs/stable/data.html)

## **Wrap Model with FullyShardedDataParallel (torch.distributed.fsdp.FullyShardedDataParallel)**

### **Trigger**

I need to train massive parameter models that exceed single GPU memory capacity by sharding model weights, gradients, and optimizer states across processes.

### **Snippet**

import os  
import torch  
import torch.nn as nn  
import torch.distributed as dist  
from torch.distributed.fsdp import FullyShardedDataParallel as FSDP

def run\_fsdp():  
    os.environ\["MASTER\_ADDR"\] \= "localhost"  
    os.environ\["MASTER\_PORT"\] \= "29506"  
    local\_rank \= int(os.environ.get("LOCAL\_RANK", "0"))  
      
    if torch.cuda.is\_available():  
        torch.cuda.set\_device(local\_rank)  
        device \= torch.device("cuda", local\_rank)  
        backend \= "nccl"  
    else:  
        device \= torch.device("cpu")  
        backend \= "gloo"

    dist.init\_process\_group(  
        backend=backend,  
        rank=int(os.environ.get("RANK", "0")),  
        world\_size=int(os.environ.get("WORLD\_SIZE", "1"))  
    )

    model \= nn.Sequential(nn.Linear(2048, 2048), nn.ReLU(), nn.Linear(2048, 1024)).to(device)  
    fsdp\_model \= FSDP(model)

    x \= torch.randn(8, 2048, device=device)  
    output \= fsdp\_model(x)  
    loss \= output.sum()  
    loss.backward()

    dist.destroy\_process\_group()

if \_\_name\_\_ \== "\_\_main\_\_":  
    run\_fsdp()

### **Minimal Notes**

FullyShardedDataParallel (FSDP) shards parameters, gradients, and optimizer states across data-parallel ranks according to ZeRO memory-reduction paradigms. It collects parameters on-demand during forward and backward passes and frees them immediately afterwards.

### **Common Bug**

**Issue:** RuntimeError: FSDP requires the module to be on a CUDA device or high GPU memory overhead on rank 0\.

**Cause:** Passing an un-sharded model on CPU or failing to move the module to the target GPU prior to wrapping with FSDP.

**Quick Fix:** Call torch.cuda.set\_device(local\_rank) and move the module to device before instantiating FSDP.

### **Official Documentation URL**

[https://docs.pytorch.org/docs/stable/fsdp.html](https://docs.pytorch.org/docs/stable/fsdp.html)

## **Save and Load FSDP Checkpoints (State Dict APIs)**

### **Trigger**

I need to aggregate sharded parameter states into a full checkpoint or restore sharded state dicts during FSDP model training.

### **Snippet**

import os  
import torch  
import torch.nn as nn  
import torch.distributed as dist  
from torch.distributed.fsdp import FullyShardedDataParallel as FSDP  
from torch.distributed.fsdp import StateDictType, FullStateDictConfig

def run\_checkpointing():  
    os.environ\["MASTER\_ADDR"\] \= "localhost"  
    os.environ\["MASTER\_PORT"\] \= "29507"  
    local\_rank \= int(os.environ.get("LOCAL\_RANK", "0"))  
      
    if torch.cuda.is\_available():  
        torch.cuda.set\_device(local\_rank)  
        device \= torch.device("cuda", local\_rank)  
        backend \= "nccl"  
    else:  
        device \= torch.device("cpu")  
        backend \= "gloo"

    dist.init\_process\_group(  
        backend=backend,  
        rank=int(os.environ.get("RANK", "0")),  
        world\_size=int(os.environ.get("WORLD\_SIZE", "1"))  
    )

    model \= FSDP(nn.Linear(128, 64).to(device))  
    save\_config \= FullStateDictConfig(offload\_to\_cpu=True, rank0\_only=True)  
      
    with FSDP.state\_dict\_type(model, StateDictType.FULL\_STATE\_DICT, save\_config):  
        state\_dict \= model.state\_dict()  
        if dist.get\_rank() \== 0:  
            torch.save(state\_dict, "/tmp/fsdp\_model.pt")

    dist.destroy\_process\_group()

if \_\_name\_\_ \== "\_\_main\_\_":  
    run\_checkpointing()

### **Minimal Notes**

FSDP.state\_dict\_type configures state dict generation to gather full un-sharded parameters (FULL\_STATE\_DICT) or keep sharded parameter references (SHARDED\_STATE\_DICT). Using offload\_to\_cpu=True and rank0\_only=True prevents GPU Out-Of-Memory errors during full checkpoint gathering.

### **Common Bug**

**Issue:** Out-Of-Memory (OOM) error during model.state\_dict() call on large model instances.

**Cause:** Gathering full parameter tensors onto GPU across all worker processes simultaneously.

**Quick Fix:** Wrap model.state\_dict() within FSDP.state\_dict\_type configured with offload\_to\_cpu=True and rank0\_only=True.

### **Official Documentation URL**

[https://docs.pytorch.org/docs/stable/fsdp.html](https://docs.pytorch.org/docs/stable/fsdp.html)

## **Launch Distributed Training (torchrun)**

### **Trigger**

I need to execute a distributed multi-GPU training script across single or multi-node infrastructure without manual process management.

### **Snippet**

torchrun \--standalone \--nproc-per-node=gpu train\_script.py \--batch-size 32

### **Minimal Notes**

torchrun handles process spawning, rendezvous configuration, environment variable initialization (RANK, LOCAL\_RANK, WORLD\_SIZE), and fault tolerance. Using \--standalone sets up single-node execution using a local rendezvous backend.

### **Common Bug**

**Issue:** torchrun fails with address collision or port binding errors (Address already in use).

**Cause:** Launching multiple distinct torchrun jobs on the same host node using default master ports.

**Quick Fix:** Specify a unique port for each job using \--master-port=29505 or setting MASTER\_PORT.

### **Official Documentation URL**

[https://docs.pytorch.org/docs/stable/elastic/run.html](https://docs.pytorch.org/docs/stable/elastic/run.html)

## **Read Environment Variables (LOCAL\_RANK, RANK, WORLD\_SIZE)**

### **Trigger**

I need to parse topology details provided by distributed launcher frameworks like torchrun to set devices and rank-specific behaviors.

### **Snippet**

import os  
import torch

def parse\_distributed\_env():  
    local\_rank \= int(os.environ.get("LOCAL\_RANK", 0))  
    global\_rank \= int(os.environ.get("RANK", 0))  
    world\_size \= int(os.environ.get("WORLD\_SIZE", 1))

    if torch.cuda.is\_available():  
        torch.cuda.set\_device(local\_rank)  
        device \= torch.device("cuda", local\_rank)  
    else:  
        device \= torch.device("cpu")

    return local\_rank, global\_rank, world\_size, device

if \_\_name\_\_ \== "\_\_main\_\_":  
    l\_rank, g\_rank, w\_size, dev \= parse\_distributed\_env()  
    print(f"Local Rank: {l\_rank}, Global Rank: {g\_rank}, World Size: {w\_size}, Device: {dev}")

### **Minimal Notes**

LOCAL\_RANK indicates the GPU index on the local node, RANK represents global process rank across all nodes, and WORLD\_SIZE gives the total worker count. Reading these variables enables automatic device binding and cluster configuration when launching scripts via torchrun.

### **Common Bug**

**Issue:** KeyError: 'LOCAL\_RANK' when running script directly with python train.py.

**Cause:** Script relies on launcher-injected environment variables without providing default fallback values.

**Quick Fix:** Use os.environ.get("LOCAL\_RANK", "0") with sensible fallback defaults for single-process execution.

### **Official Documentation URL**

[https://docs.pytorch.org/docs/stable/elastic/run.html](https://docs.pytorch.org/docs/stable/elastic/run.html)

## **Configure Multi-GPU Training Script**

### **Trigger**

I need a complete production-grade boilerplate script for multi-GPU distributed training combining DDP, AMP, and DistributedSampler.

### **Snippet**

import os  
import torch  
import torch.nn as nn  
import torch.distributed as dist  
from torch.nn.parallel import DistributedDataParallel as DDP  
from torch.utils.data import DataLoader, TensorDataset  
from torch.utils.data.distributed import DistributedSampler

def main():  
    local\_rank \= int(os.environ.get("LOCAL\_RANK", 0))  
    global\_rank \= int(os.environ.get("RANK", 0))  
    world\_size \= int(os.environ.get("WORLD\_SIZE", 1))

    if torch.cuda.is\_available():  
        torch.cuda.set\_device(local\_rank)  
        device \= torch.device("cuda", local\_rank)  
        backend \= "nccl"  
    else:  
        device \= torch.device("cpu")  
        backend \= "gloo"

    dist.init\_process\_group(backend=backend, rank=global\_rank, world\_size=world\_size)

    dataset \= TensorDataset(torch.randn(100, 10), torch.randn(100, 1))  
    sampler \= DistributedSampler(dataset)  
    loader \= DataLoader(dataset, batch\_size=16, sampler=sampler)

    model \= nn.Linear(10, 1).to(device)  
    model \= DDP(model, device\_ids=\[local\_rank\]) if device.type \== "cuda" else DDP(model)  
    optimizer \= torch.optim.Adam(model.parameters(), lr=1e-3)  
    scaler \= torch.amp.GradScaler(device=device.type, enabled=(device.type \== "cuda"))

    for epoch in range(2):  
        sampler.set\_epoch(epoch)  
        for x, y in loader:  
            x, y \= x.to(device), y.to(device)  
            optimizer.zero\_grad()  
            with torch.amp.autocast(device\_type=device.type, dtype=torch.float16):  
                out \= model(x)  
                loss \= nn.functional.mse\_loss(out, y)  
            scaler.scale(loss).backward()  
            scaler.step(optimizer)  
            scaler.update()

    dist.destroy\_process\_group()

if \_\_name\_\_ \== "\_\_main\_\_":  
    main()

### **Minimal Notes**

This end-to-end boilerplate integrates torch.distributed, DistributedDataParallel, DistributedSampler, and torch.amp. It represents the standard production workflow for multi-GPU scalable deep learning in PyTorch.

### **Common Bug**

**Issue:** Deadlock or hanging at the beginning or end of training loops across multiple processes.

**Cause:** Unbalanced data batches across ranks without proper handling or inconsistent distributed initialization parameters.

**Quick Fix:** Ensure DistributedSampler divides data evenly, wrap forward/backward in torch.amp.autocast, and invoke dist.destroy\_process\_group().

### **Official Documentation URL**

[https://docs.pytorch.org/docs/stable/distributed.html](https://docs.pytorch.org/docs/stable/distributed.html)

---

