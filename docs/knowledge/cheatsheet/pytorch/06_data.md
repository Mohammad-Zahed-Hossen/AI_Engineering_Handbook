# **PyTorch Data Loading Cheatsheet**

## **Problem**

Create Custom Map-Style Dataset (Dataset)

## **Trigger**

Use when you have a random-access dataset with a fixed size and known indices.

## **Snippet**

import torch  
from torch.utils.data import Dataset

class CustomMapDataset(Dataset):  
    def \_\_init\_\_(self, data: torch.Tensor, targets: torch.Tensor):  
        self.data \= data  
        self.targets \= targets

    def \_\_len\_\_(self) \-\> int:  
        return len(self.data)

    def \_\_getitem\_\_(self, index: int):  
        return self.data\[index\], self.targets\[index\]

\# Example usage  
X \= torch.randn(100, 10\)  
y \= torch.randint(0, 2, (100,))  
dataset \= CustomMapDataset(X, y)  
print(len(dataset), dataset\[0\]\[0\].shape)

## **Minimal Notes**

Map-style datasets must implement both \_\_len\_\_ and \_\_getitem\_\_ for index-based access. They allow efficient random access and easy shuffling with DataLoader.

## **Common Bug**

**Issue:** TypeError: CustomMapDataset object is not subscriptable when passing the dataset to a DataLoader or accessing by index.

**Cause:** Forgetting to implement the \_\_getitem\_\_ method in the custom dataset class.

**Quick Fix:** Define def \_\_getitem\_\_(self, index): in your dataset class to return samples by index.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/data.html\#torch.utils.data.Dataset](https://www.google.com/search?q=https://pytorch.org/docs/stable/data.html%23torch.utils.data.Dataset)

## **Problem**

Implement Dataset Length (\_\_len\_\_)

## **Trigger**

Use when defining a map-style dataset to declare the total number of available samples.

## **Snippet**

import torch  
from torch.utils.data import Dataset

class SizedDataset(Dataset):  
    def \_\_init\_\_(self, num\_samples: int):  
        self.num\_samples \= num\_samples  
        self.data \= torch.randn(num\_samples, 8\)

    def \_\_len\_\_(self) \-\> int:  
        return self.num\_samples

    def \_\_getitem\_\_(self, idx: int) \-\> torch.Tensor:  
        return self.data\[idx\]

dataset \= SizedDataset(num\_samples=500)  
print(len(dataset))

## **Minimal Notes**

The \_\_len\_\_ method is called by len() and DataLoader to determine batch boundaries and dataset size. It must return an integer greater than or equal to zero.

## **Common Bug**

**Issue:** TypeError: 'float' object cannot be interpreted as an integer during iteration.

**Cause:** Returning a non-integer value, such as a floating-point calculation result, from \_\_len\_\_.

**Quick Fix:** Wrap the length calculation result with int() inside \_\_len\_\_.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/data.html\#torch.utils.data.Dataset](https://www.google.com/search?q=https://pytorch.org/docs/stable/data.html%23torch.utils.data.Dataset)

## **Problem**

Implement Dataset Item Retrieval (\_\_getitem\_\_)

## **Trigger**

Use when fetching a single sample and its corresponding label at a given index.

## **Snippet**

import torch  
from torch.utils.data import Dataset

class ItemRetrievalDataset(Dataset):  
    def \_\_init\_\_(self, features: torch.Tensor, labels: torch.Tensor):  
        self.features \= features  
        self.labels \= labels

    def \_\_len\_\_(self) \-\> int:  
        return len(self.features)

    def \_\_getitem\_\_(self, idx: int) \-\> dict\[str, torch.Tensor\]:  
        return {  
            "feature": self.features\[idx\],  
            "label": self.labels\[idx\],  
        }

dataset \= ItemRetrievalDataset(torch.randn(10, 4), torch.arange(10))  
sample \= dataset\[3\]  
print(sample\["feature"\], sample\["label"\])

## **Minimal Notes**

\_\_getitem\_\_ handles on-the-fly transformations and sample loading. It can return standard Python data structures like tuples, dictionaries, or custom objects.

## **Common Bug**

**Issue:** IndexError: index out of range when accessing dataset elements via DataLoader.

**Cause:** \_\_len\_\_ returns a number larger than the actual underlying data container length.

**Quick Fix:** Ensure \_\_len\_\_ precisely matches the size of the underlying data lists or tensors.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/data.html\#torch.utils.data.Dataset](https://www.google.com/search?q=https://pytorch.org/docs/stable/data.html%23torch.utils.data.Dataset)

## **Problem**

Create Streaming Dataset (IterableDataset)

## **Trigger**

Use when reading sequential, streaming, or ultra-large data that does not fit in memory or support random access.

## **Snippet**

import torch  
from torch.utils.data import IterableDataset, DataLoader  
from typing import Iterator

class StreamDataset(IterableDataset):  
    def \_\_init\_\_(self, start: int, end: int):  
        self.start \= start  
        self.end \= end

    def \_\_iter\_\_(self) \-\> Iterator\[torch.Tensor\]:  
        for i in range(self.start, self.end):  
            yield torch.tensor(\[i\], dtype=torch.float32)

dataset \= StreamDataset(start=0, end=10)  
loader \= DataLoader(dataset, batch\_size=2)  
for batch in loader:  
    print(batch)

## **Minimal Notes**

IterableDataset requires implementing \_\_iter\_\_ to yield samples sequentially. It does not implement \_\_len\_\_ or \_\_getitem\_\_.

## **Common Bug**

**Issue:** Duplicate data returned when using num\_workers \> 1\.

**Cause:** Each worker process receives a full copy of the iterator without work-splitting logic.

**Quick Fix:** Partition the stream across workers using torch.utils.data.get\_worker\_info().

## **Official Documentation URL**

[https://pytorch.org/docs/stable/data.html\#torch.utils.data.IterableDataset](https://www.google.com/search?q=https://pytorch.org/docs/stable/data.html%23torch.utils.data.IterableDataset)

## **Problem**

Split Iterable Dataset Across Workers (get\_worker\_info)

## **Trigger**

Use when streaming data with multi-process DataLoaders to prevent workers from yielding duplicate items.

## **Snippet**

import math  
import torch  
from torch.utils.data import IterableDataset, DataLoader, get\_worker\_info  
from typing import Iterator

class WorkerSplitDataset(IterableDataset):  
    def \_\_init\_\_(self, start: int, end: int):  
        self.start \= start  
        self.end \= end

    def \_\_iter\_\_(self) \-\> Iterator\[torch.Tensor\]:  
        worker\_info \= get\_worker\_info()  
        if worker\_info is None:  
            iter\_start \= self.start  
            iter\_end \= self.end  
        else:  
            per\_worker \= int(math.ceil((self.end \- self.start) / float(worker\_info.num\_workers)))  
            worker\_id \= worker\_info.id  
            iter\_start \= self.start \+ worker\_id \* per\_worker  
            iter\_end \= min(iter\_start \+ per\_worker, self.end)

        for i in range(iter\_start, iter\_end):  
            yield torch.tensor(\[i\], dtype=torch.float32)

dataset \= WorkerSplitDataset(start=0, end=20)  
loader \= DataLoader(dataset, batch\_size=2, num\_workers=2)  
for batch in loader:  
    print(batch)

## **Minimal Notes**

get\_worker\_info() returns None in the main process and worker details inside subprocesses. Splitting range logic inside \_\_iter\_\_ guarantees distinct partitions per worker.

## **Common Bug**

**Issue:** Unbalanced workload or empty worker streams leading to early iterator termination.

**Cause:** Naive integer division that skips remainder samples across worker partitions.

**Quick Fix:** Use math.ceil or strided range splitting (range(start \+ worker\_id, end, num\_workers)) to distribute remainder items evenly.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/data.html\#torch.utils.data.get\_worker\_info](https://www.google.com/search?q=https://pytorch.org/docs/stable/data.html%23torch.utils.data.get_worker_info)

## **Problem**

Create DataLoader (DataLoader)

## **Trigger**

Use when combining a dataset with batching, shuffling, and multi-threaded loading options.

## **Snippet**

import torch  
from torch.utils.data import TensorDataset, DataLoader

X \= torch.randn(100, 10\)  
y \= torch.randint(0, 2, (100,))  
dataset \= TensorDataset(X, y)

dataloader \= DataLoader(  
    dataset=dataset,  
    batch\_size=16,  
    shuffle=True,  
    num\_workers=0,  
    drop\_last=False  
)

for batch\_x, batch\_y in dataloader:  
    print(batch\_x.shape, batch\_y.shape)  
    break

## **Minimal Notes**

DataLoader abstracts batch formation, iteration control, and multiprocess data fetching. It works with both map-style and iterable datasets.

## **Common Bug**

**Issue:** ValueError: sampler option is mutually exclusive with shuffle.

**Cause:** Setting shuffle=True while simultaneously passing a custom sampler.

**Quick Fix:** Remove shuffle=True or set it to False when providing a custom sampler argument.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/data.html\#torch.utils.data.DataLoader](https://www.google.com/search?q=https://pytorch.org/docs/stable/data.html%23torch.utils.data.DataLoader)

## **Problem**

Shuffle Dataset (shuffle)

## **Trigger**

Use when randomizing sample order every epoch to prevent model bias and correlation during training.

## **Snippet**

import torch  
from torch.utils.data import TensorDataset, DataLoader

dataset \= TensorDataset(torch.arange(10))  
loader \= DataLoader(dataset, batch\_size=5, shuffle=True)

print("Epoch 1:")  
for batch in loader:  
    print(batch\[0\].tolist())

print("Epoch 2:")  
for batch in loader:  
    print(batch\[0\].tolist())

## **Minimal Notes**

Setting shuffle=True internally creates a RandomSampler for map-style datasets. It reshuffles the dataset indices at the start of each iteration loop.

## **Common Bug**

**Issue:** Data order remains identical across training runs despite shuffle=True.

**Cause:** Deterministic seeding without resetting seeds or using a fixed generator state across runs.

**Quick Fix:** Omit manual seed calls inside the training loop or manage generator objects properly.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/data.html\#torch.utils.data.DataLoader](https://www.google.com/search?q=https://pytorch.org/docs/stable/data.html%23torch.utils.data.DataLoader)

## **Problem**

Drop Incomplete Batches (drop\_last)

## **Trigger**

Use when your model requires fixed batch sizes or to prevent training instability on tiny tail batches.

## **Snippet**

import torch  
from torch.utils.data import TensorDataset, DataLoader

dataset \= TensorDataset(torch.randn(10, 4))  
loader \= DataLoader(dataset, batch\_size=3, drop\_last=True)

for batch in loader:  
    print(batch\[0\].shape)  
\# Yields 3 batches of size 3, drops the final sample of size 1

## **Minimal Notes**

When drop\_last=True, any final batch smaller than batch\_size is ignored. This guarantees uniform shape across all iterations.

## **Common Bug**

**Issue:** Tensor shape error in BatchNorm layers during training step.

**Cause:** The final batch has a size of 1, causing BatchNorm to crash during mean and variance calculation.

**Quick Fix:** Set drop\_last=True in DataLoader to discard incomplete tail batches.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/data.html\#torch.utils.data.DataLoader](https://www.google.com/search?q=https://pytorch.org/docs/stable/data.html%23torch.utils.data.DataLoader)

## **Problem**

Customize Batch Collation (collate\_fn)

## **Trigger**

Use when custom logic is needed to stack individual dataset samples into a mini-batch.

## **Snippet**

import torch  
from torch.utils.data import DataLoader, TensorDataset

def custom\_collate(batch: list\[tuple\[torch.Tensor, torch.Tensor\]\]):  
    inputs \= torch.stack(\[item\[0\] for item in batch\])  
    targets \= torch.stack(\[item\[1\] for item in batch\])  
    return {"inputs": inputs, "targets": targets}

dataset \= TensorDataset(torch.randn(20, 5), torch.ones(20))  
loader \= DataLoader(dataset, batch\_size=4, collate\_fn=custom\_collate)

for batch in loader:  
    print(batch\["inputs"\].shape, batch\["targets"\].shape)  
    break

## **Minimal Notes**

collate\_fn accepts a list of samples returned by \_\_getitem\_\_ and combines them. Default collation converts lists of tensors to a single stacked tensor.

## **Common Bug**

**Issue:** RuntimeError: stack expects each tensor to be equal size.

**Cause:** Default collate\_fn uses torch.stack, which fails when batch tensors have varying dimensions or lengths.

**Quick Fix:** Supply a custom collate\_fn to pad sequences or return lists/dictionaries.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/data.html\#torch.utils.data.DataLoader](https://www.google.com/search?q=https://pytorch.org/docs/stable/data.html%23torch.utils.data.DataLoader)

## **Problem**

Enable Persistent Workers (persistent\_workers)

## **Trigger**

Use when multi-worker DataLoader overhead is high due to repeated worker process creation each epoch.

## **Snippet**

import torch  
from torch.utils.data import TensorDataset, DataLoader

dataset \= TensorDataset(torch.randn(100, 8))  
loader \= DataLoader(  
    dataset,  
    batch\_size=10,  
    num\_workers=2,  
    persistent\_workers=True  
)

for epoch in range(2):  
    for batch in loader:  
        pass

## **Minimal Notes**

persistent\_workers=True keeps worker processes alive after a dataset has been consumed once. Requires num\_workers \> 0\.

## **Common Bug**

**Issue:** ValueError: persistent\_workers option requires num\_workers \> 0\.

**Cause:** Setting persistent\_workers=True while num\_workers=0 (default single-process mode).

**Quick Fix:** Ensure num\_workers is set to 1 or higher when persistent\_workers=True.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/data.html\#torch.utils.data.DataLoader](https://www.google.com/search?q=https://pytorch.org/docs/stable/data.html%23torch.utils.data.DataLoader)

## **Problem**

Enable Prefetching (prefetch\_factor)

## **Trigger**

Use when worker processes are slow at loading data and GPU utilization suffers from batch retrieval latency.

## **Snippet**

import torch  
from torch.utils.data import TensorDataset, DataLoader

dataset \= TensorDataset(torch.randn(1000, 16))  
loader \= DataLoader(  
    dataset,  
    batch\_size=32,  
    num\_workers=2,  
    prefetch\_factor=4  
)

for batch in loader:  
    pass

## **Minimal Notes**

prefetch\_factor defines how many batches are pre-loaded in advance by each worker process. Requires num\_workers \> 0\.

## **Common Bug**

**Issue:** Excessive CPU RAM consumption or OutOfMemoryError.

**Cause:** Setting prefetch\_factor too high with large batch sizes, causing queued batches to exhaust system memory.

**Quick Fix:** Lower prefetch\_factor (for example, to 2\) or reduce batch\_size.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/data.html\#torch.utils.data.DataLoader](https://www.google.com/search?q=https://pytorch.org/docs/stable/data.html%23torch.utils.data.DataLoader)

## **Problem**

Sample with Custom Sampler (Sampler)

## **Trigger**

Use when custom index sampling logic is needed, such as custom sequence ordering or domain-specific grouping.

## **Snippet**

import torch  
from torch.utils.data import Sampler, TensorDataset, DataLoader  
from typing import Iterator

class ReverseSampler(Sampler\[int\]):  
    def \_\_init\_\_(self, data\_source):  
        self.data\_source \= data\_source

    def \_\_iter\_\_(self) \-\> Iterator\[int\]:  
        return iter(range(len(self.data\_source) \- 1, \-1, \-1))

    def \_\_len\_\_(self) \-\> int:  
        return len(self.data\_source)

dataset \= TensorDataset(torch.arange(5))  
sampler \= ReverseSampler(dataset)  
loader \= DataLoader(dataset, batch\_size=1, sampler=sampler)

for batch in loader:  
    print(batch\[0\].item())

## **Minimal Notes**

A custom Sampler defines how indices are selected for dataset lookup. Inheriting classes must implement \_\_iter\_\_ yielding sequence indices.

## **Common Bug**

**Issue:** TypeError: 'CustomSampler' object is not iterable or incomplete epoch sampling.

**Cause:** Returning something other than an iterator from \_\_iter\_\_, or length mismatch in \_\_len\_\_.

**Quick Fix:** Ensure \_\_iter\_\_ returns a valid iterator yielding integer index values.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/data.html\#torch.utils.data.Sampler](https://www.google.com/search?q=https://pytorch.org/docs/stable/data.html%23torch.utils.data.Sampler)

## **Problem**

Sample with WeightedRandomSampler (WeightedRandomSampler)

## **Trigger**

Use when training on imbalanced datasets to sample underrepresented classes more frequently.

## **Snippet**

import torch  
from torch.utils.data import TensorDataset, DataLoader, WeightedRandomSampler

\# Imbalanced target labels: 8 zeros, 2 ones  
targets \= torch.tensor(\[0, 0, 0, 0, 0, 0, 0, 0, 1, 1\])  
class\_counts \= torch.bincount(targets)  
class\_weights \= 1.0 / class\_counts.float()  
sample\_weights \= class\_weights\[targets\]

sampler \= WeightedRandomSampler(  
    weights=sample\_weights,  
    num\_samples=len(sample\_weights),  
    replacement=True  
)

dataset \= TensorDataset(targets)  
loader \= DataLoader(dataset, batch\_size=2, sampler=sampler)

for batch in loader:  
    print(batch\[0\].tolist())

## **Minimal Notes**

WeightedRandomSampler samples elements with specified probabilities using input tensor weights. replacement=True allows drawing the same sample multiple times per epoch.

## **Common Bug**

**Issue:** IndexError or unexpected sampling behavior when calculating sample weights.

**Cause:** Passing class weights directly instead of mapping individual sample weights for each dataset index.

**Quick Fix:** Map class weights back to every element: sample\_weights \= class\_weights\[targets\].

## **Official Documentation URL**

[https://pytorch.org/docs/stable/data.html\#torch.utils.data.WeightedRandomSampler](https://www.google.com/search?q=https://pytorch.org/docs/stable/data.html%23torch.utils.data.WeightedRandomSampler)

## **Problem**

Batch Samples with BatchSampler (BatchSampler)

## **Trigger**

Use when you need precise control over batching index groups, such as grouping samples by dynamic sequence length.

## **Snippet**

import torch  
from torch.utils.data import SequentialSampler, BatchSampler, TensorDataset, DataLoader

dataset \= TensorDataset(torch.arange(10))  
base\_sampler \= SequentialSampler(dataset)  
batch\_sampler \= BatchSampler(base\_sampler, batch\_size=3, drop\_last=False)

loader \= DataLoader(dataset, batch\_sampler=batch\_sampler)

for batch in loader:  
    print(batch\[0\].tolist())

## **Minimal Notes**

BatchSampler wraps another Sampler and yields lists of index batches. When using batch\_sampler, do not set batch\_size, shuffle, sampler, or drop\_last on DataLoader.

## **Common Bug**

**Issue:** ValueError: batch\_sampler option is mutually exclusive with batch\_size, shuffle, sampler, and drop\_last.

**Cause:** Explicitly passing batch\_size or shuffle alongside batch\_sampler in DataLoader.

**Quick Fix:** Omit batch\_size, shuffle, sampler, and drop\_last from DataLoader when providing batch\_sampler.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/data.html\#torch.utils.data.BatchSampler](https://www.google.com/search?q=https://pytorch.org/docs/stable/data.html%23torch.utils.data.BatchSampler)

## **Problem**

Use DistributedSampler (DistributedSampler)

## **Trigger**

Use when distributing map-style dataset samples across multiple processes or GPUs during Distributed Data Parallel (DDP) training.

## **Snippet**

import torch  
from torch.utils.data import TensorDataset, DataLoader  
from torch.utils.data.distributed import DistributedSampler

dataset \= TensorDataset(torch.randn(100, 4))  
\# Simulated DDP environment parameters  
world\_size \= 2  
rank \= 0

sampler \= DistributedSampler(  
    dataset,  
    num\_replicas=world\_size,  
    rank=rank,  
    shuffle=True  
)

loader \= DataLoader(dataset, batch\_size=10, sampler=sampler)

\# Set epoch before every iteration to ensure proper shuffling across GPUs  
sampler.set\_epoch(0)  
for batch in loader:  
    print(batch\[0\].shape)  
    break

## **Minimal Notes**

DistributedSampler partitions indices into 1 / world\_size chunks per rank process. You must call sampler.set\_epoch(epoch) before each epoch to maintain proper shuffling.

## **Common Bug**

**Issue:** Identical mini-batches produced across epochs during multi-GPU training.

**Cause:** Forgetting to invoke sampler.set\_epoch(epoch) at the beginning of each epoch loop.

**Quick Fix:** Add sampler.set\_epoch(epoch) inside your training loop prior to dataset iteration.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/data.html\#torch.utils.data.distributed.DistributedSampler](https://www.google.com/search?q=https://pytorch.org/docs/stable/data.html%23torch.utils.data.distributed.DistributedSampler)

## **Problem**

Configure Multiple DataLoader Workers (num\_workers)

## **Trigger**

Use when asynchronous parallel process loading is needed to eliminate CPU data preparation bottlenecks.

## **Snippet**

import torch  
from torch.utils.data import TensorDataset, DataLoader

dataset \= TensorDataset(torch.randn(500, 10))  
loader \= DataLoader(  
    dataset,  
    batch\_size=32,  
    num\_workers=4,  
    pin\_memory=True  
)

for batch in loader:  
    pass

## **Minimal Notes**

num\_workers \> 0 spawns subprocesses to fetch data asynchronously. Balance num\_workers against CPU core availability to prevent context-switching overhead.

## **Common Bug**

**Issue:** Program hangs indefinitely during initialization or epoch end on Windows or macOS.

**Cause:** Spawning worker subprocesses without using if \_\_name\_\_ \== '\_\_main\_\_': entry point protection.

**Quick Fix:** Wrap main script execution code inside if \_\_name\_\_ \== '\_\_main\_\_':.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/data.html\#torch.utils.data.DataLoader](https://www.google.com/search?q=https://pytorch.org/docs/stable/data.html%23torch.utils.data.DataLoader)

## **Problem**

Initialize Worker Seeds (worker\_init\_fn)

## **Trigger**

Use when worker subprocesses generate random transformations that require deterministic or unique seeding per worker.

## **Snippet**

import random  
import numpy as np  
import torch  
from torch.utils.data import TensorDataset, DataLoader

def seed\_worker(worker\_id: int) \-\> None:  
    worker\_seed \= torch.initial\_seed() % 2\*\*32  
    np.random.seed(worker\_seed)  
    random.seed(worker\_seed)

g \= torch.Generator()  
g.manual\_seed(42)

dataset \= TensorDataset(torch.randn(50, 4))  
loader \= DataLoader(  
    dataset,  
    batch\_size=10,  
    num\_workers=2,  
    worker\_init\_fn=seed\_worker,  
    generator=g  
)

for batch in loader:  
    pass

## **Minimal Notes**

worker\_init\_fn executes in each worker process prior to data loading. It ensures non-PyTorch random generators (like NumPy or Python random) are properly seeded per worker.

## **Common Bug**

**Issue:** Identical random transformations produced across different worker processes.

**Cause:** Non-PyTorch random state generators retain identical initial seeds across spawned worker processes.

**Quick Fix:** Set Python and NumPy seeds inside worker\_init\_fn using torch.initial\_seed().

## **Official Documentation URL**

[https://pytorch.org/docs/stable/data.html\#torch.utils.data.DataLoader](https://www.google.com/search?q=https://pytorch.org/docs/stable/data.html%23torch.utils.data.DataLoader)

## **Problem**

Batch Variable-Length Data (collate\_fn)

## **Trigger**

Use when handling sequences or images of differing sizes that require padding to form uniform tensors.

## **Snippet**

import torch  
from torch.utils.data import DataLoader  
from torch.nn.utils.rnn import pad\_sequence

def pad\_collate(batch: list\[torch.Tensor\]) \-\> torch.Tensor:  
    return pad\_sequence(batch, batch\_first=True, padding\_value=0.0)

\# Dataset returning variable-length 1D tensors  
samples \= \[  
    torch.tensor(\[1.0, 2.0\]),  
    torch.tensor(\[3.0, 4.0, 5.0\]),  
    torch.tensor(\[6.0\]),  
\]  
loader \= DataLoader(samples, batch\_size=3, collate\_fn=pad\_collate)

for batch in loader:  
    print(batch.shape)  \# torch.Size(\[3, 3\])

## **Minimal Notes**

pad\_sequence combines dynamic-length 1D tensors into a padded rectangular tensor batch. Use batch\_first=True to output batch dimensions at index 0\.

## **Common Bug**

**Issue:** RuntimeError: pad\_sequence expects a list of 1D Tensors.

**Cause:** Passing multidimensional tensors without flattening or incorrectly structured items to pad\_sequence.

**Quick Fix:** Squeeze or reshape individual items into 1D tensors before calling pad\_sequence.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/data.html\#torch.utils.data.DataLoader](https://www.google.com/search?q=https://pytorch.org/docs/stable/data.html%23torch.utils.data.DataLoader)

## **Problem**

Enable Pinned Memory (pin\_memory)

## **Trigger**

Use when accelerating host CPU memory to GPU device memory data transfers.

## **Snippet**

import torch  
from torch.utils.data import TensorDataset, DataLoader

dataset \= TensorDataset(torch.randn(100, 10))  
loader \= DataLoader(  
    dataset,  
    batch\_size=16,  
    pin\_memory=True,  
    num\_workers=2  
)

for batch\_x, in loader:  
    if torch.cuda.is\_available():  
        batch\_x \= batch\_x.to("cuda", non\_blocking=True)  
    print(batch\_x.is\_pinned())  
    break

## **Minimal Notes**

pin\_memory=True copies batch tensors into CUDA page-locked (pinned) memory on the CPU. Pinned memory enables direct DMA transfer to the GPU with non\_blocking=True.

## **Common Bug**

**Issue:** System slowdown or host RAM allocation failure.

**Cause:** Pinning memory on systems with insufficient host RAM or allocating extremely large batches.

**Quick Fix:** Ensure sufficient system RAM is available before enabling pin\_memory=True.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/data.html\#torch.utils.data.DataLoader](https://www.google.com/search?q=https://pytorch.org/docs/stable/data.html%23torch.utils.data.DataLoader)

## **Problem**

Transfer Batches Efficiently to Device (non\_blocking=True)

## **Trigger**

Use when transferring pinned CPU host memory tensors to GPU asynchronously to overlap data copy with GPU computation.

## **Snippet**

import torch  
from torch.utils.data import TensorDataset, DataLoader

device \= torch.device("cuda" if torch.cuda.is\_available() else "cpu")  
dataset \= TensorDataset(torch.randn(100, 10), torch.randint(0, 2, (100,)))

loader \= DataLoader(dataset, batch\_size=20, pin\_memory=True)

for inputs, targets in loader:  
    inputs \= inputs.to(device, non\_blocking=True)  
    targets \= targets.to(device, non\_blocking=True)  
    print(inputs.device, targets.device)  
    break

## **Minimal Notes**

non\_blocking=True performs asynchronous memory transfers only when the CPU tensor is pinned (pin\_memory=True). Non-pinned tensors fall back to synchronous copies.

## **Common Bug**

**Issue:** non\_blocking=True provides no speedup during host-to-device transfers.

**Cause:** The source CPU tensors were not created in or converted to pinned memory prior to to().

**Quick Fix:** Set pin\_memory=True in your DataLoader configuration.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.Tensor.to.html](https://pytorch.org/docs/stable/generated/torch.Tensor.to.html)

---

