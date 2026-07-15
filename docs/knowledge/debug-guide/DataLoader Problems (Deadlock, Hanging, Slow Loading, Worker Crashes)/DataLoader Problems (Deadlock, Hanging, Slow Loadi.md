<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# DataLoader Problems (Deadlock, Hanging, Slow Loading, Worker Crashes)

## Overview

PyTorch `DataLoader` failures usually come from worker-process lifecycle issues, serialization constraints, memory pressure, or storage bottlenecks rather than the model itself. The fastest diagnosis is to isolate whether the failure only appears with `num_workers > 0`, then check shared memory, picklability, start method, and I/O latency in that order.[^1][^2]

## Problem

During training, the PyTorch `DataLoader` stalls indefinitely, crashes worker processes, or loads batches at a fraction of storage bandwidth, causing GPU starvation, training timeouts, or job failures in production pipelines.[^3][^2][^1]

## Overview Card

* **Severity:** High.
* **Frequency:** Common.
* **Typical Stage:** Training.
* **Estimated Fix Time:** 30-120 min.
* **Production Impact:** High.


## Quick Identification

* **Check:** Training loop hangs at batch iteration.
    * **Description:** `next(iter(dataloader))` or `for batch in dataloader` never returns.[^2][^1]
* **Check:** Worker processes crash with signal errors.
    * **Description:** `RuntimeError: DataLoader worker (pid X) is killed by signal: Killed` or `SIGSEGV`.[^1][^2]
* **Check:** Batch loading latency is >10x expected.
    * **Description:** Time `next(dataloader_iter)` and compare to compute step time.[^3][^1]
* **Check:** GPU utilization drops to 0% periodically.
    * **Description:** `nvidia-smi dmon` shows GPU-Util cycling between high and idle states while workers fetch data.[^3][^1]


## Symptoms

### Symptom 1: Training Hang / Deadlock

* **Description:** Training freezes indefinitely at data loading with no forward progress and no explicit exception.
* **Error Message:** No explicit error; the process appears stuck.[^2][^1]
* **Where Appears:** `next(iter(dataloader))`, `enumerate(dataloader)`, worker initialization.[^1][^2]
* **Frequency:** Often.


### Symptom 2: Worker Crash

* **Description:** Worker processes terminate with segmentation fault or bus error.
* **Error Message:** `RuntimeError: DataLoader worker (pid X) is killed by signal: Segmentation fault` or `Bus error`.[^2][^1]
* **Where Appears:** Worker spawn, batch collation, shared memory access.[^1][^2]
* **Frequency:** Often.


### Symptom 3: Worker OOM Kill

* **Description:** The OS OOM killer terminates worker processes due to excessive memory consumption.
* **Error Message:** `RuntimeError: DataLoader worker (pid X) is killed by signal: Killed`.[^2][^1]
* **Where Appears:** Worker processes with large per-worker memory footprint.[^1][^2]
* **Frequency:** Often.


### Symptom 4: Slow Batch Loading

* **Description:** Batches load slowly despite fast storage, and the GPU sits idle between steps.
* **Error Message:** No explicit error; training throughput is far below the compute-bound baseline.[^3][^1]
* **Where Appears:** Data loading pipeline, storage I/O, preprocessing.[^3][^1]
* **Frequency:** Sometimes.


## Root Causes

### Root Cause 1: Insufficient Shared Memory (`/dev/shm`) in Containers

* **Probability:** High.
* **Explanation:** Multi-worker `DataLoader` transfers batch data through shared memory, and container defaults can exhaust `/dev/shm`, causing hangs or worker kills.[^2][^1]
* **Recognition Clues:**
    * `df -h /dev/shm` shows near-100% usage.
    * The issue appears only inside Docker or Kubernetes.
    * Increasing `num_workers` makes the problem worse.
    * The hang occurs at collation or worker transfer, not in `__getitem__`.[^1][^2]
* **Typical Environment:** Docker containers, Kubernetes pods, CI runners.[^2][^1]


### Root Cause 2: Fork-Safe Violations in Dataset

* **Probability:** High.
* **Explanation:** Forking after CUDA initialization, open file handles, or lock creation can deadlock or corrupt child workers; PyTorch documents platform-specific start-method behavior and recommends careful multiprocessing design.[^1][^2]
* **Recognition Clues:**
    * The issue occurs only with `num_workers > 0`.
    * Switching to `spawn` or `forkserver` resolves it.
    * Dataset construction opens files, creates CUDA tensors, or initializes thread pools.
    * Worker logs mention CUDA initialization or serialization failures.[^2][^1]
* **Typical Environment:** Custom datasets with initialization side effects, GPU preprocessing, Linux multiprocessing workflows.[^1][^2]


### Root Cause 3: Excessive `num_workers` Relative to CPU or Memory

* **Probability:** High.
* **Explanation:** Too many workers increase context switching, memory replication, and I/O contention; PyTorch warns that worker processes can consume as much CPU memory as the parent process for Python objects they access.[^2][^1]
* **Recognition Clues:**
    * `htop` shows all CPUs saturated and memory pressure rising with worker count.
    * Throughput improves at first, then plateaus or regresses as workers increase.
    * Swap usage or RSS growth tracks worker count.[^1][^2]
* **Typical Environment:** CPU-constrained instances, memory-limited containers, expensive preprocessing pipelines.[^3][^1]


### Root Cause 4: Slow Storage or Network-Attached Filesystems

* **Probability:** Medium.
* **Explanation:** High-latency storage such as NFS, EFS, or S3-backed mounts throttles random reads across workers, making the input pipeline I/O-bound.[^4][^3]
* **Recognition Clues:**
    * `iostat -x 1` shows high `await` or near-saturated device utilization.
    * Copying data to local SSD removes the issue.
    * Worker traces spend time in `read()` or filesystem calls.[^4][^3]
* **Typical Environment:** Cloud NFS, object-storage mounts, HPC shared filesystems.[^4][^3]


### Root Cause 5: Non-Picklable Dataset or Collate Function

* **Probability:** Medium.
* **Explanation:** Worker processes need serialized dataset and callback objects; lambdas, closures, open handles, or unpicklable third-party objects fail when workers are spawned.[^2][^1]
* **Recognition Clues:**
    * `AttributeError: Can't pickle local object` or `TypeError: cannot pickle`.
    * `num_workers=0` works, but `num_workers>0` fails immediately.
    * Failure occurs during worker startup rather than sample fetching.[^1][^2]
* **Typical Environment:** Custom datasets, inline transforms, notebook-defined functions.[^2][^1]


### Root Cause 6: Deadlock in Custom `collate_fn` or `__getitem__`

* **Probability:** Low.
* **Explanation:** Locks, database connections, or nested parallelism inside dataset or collation code can deadlock when multiple workers contend.[^1][^2]
* **Recognition Clues:**
    * Hang occurs at the same batch index or data pattern.
    * Profilers show workers blocked on `acquire` or `futex`.
    * `num_workers=0` works but multi-worker loading hangs.[^2][^1]
* **Typical Environment:** On-the-fly database access, locking augmentations, custom batch assembly.[^1][^2]


### Root Cause 7: Distributed Training Stragglers

* **Probability:** Low.
* **Explanation:** In DDP, uneven dataset lengths or uneven per-rank work can create stragglers that stall collective synchronization and trigger timeouts.[^5][^1]
* **Recognition Clues:**
    * `NCCL timeout` or elastic-agent worker death.
    * Some ranks finish early while others still iterate.
    * `drop_last=False` or imperfect sharding produces rank imbalance.[^5][^1]
* **Typical Environment:** Distributed training with custom sharding or uneven sample counts.[^5][^1]


## Investigation Checklist

* **Check:** Check `/dev/shm` usage in containers.
    * **Description:** Run `df -h /dev/shm` to verify shared memory availability.[^2][^1]
* **Check:** Check worker spawn method.
    * **Description:** Verify the multiprocessing start method and prefer safer methods when fork-safety is questionable.[^1][^2]
* **Check:** Check `num_workers` versus CPU core count.
    * **Description:** Verify `num_workers` does not exceed the host’s practical CPU budget.[^2][^1]
* **Check:** Check storage I/O latency.
    * **Description:** Use `iostat` or a read benchmark to measure bandwidth and tail latency.[^4][^3]
* **Check:** Check dataset picklability.
    * **Description:** Test `pickle.dumps(dataset)` or equivalent serialization of worker inputs.[^1][^2]
* **Check:** Check for CUDA context in dataset.
    * **Description:** Verify no CUDA calls occur in dataset initialization or sample retrieval.[^2][^1]
* **Check:** Check distributed dataset length balance.
    * **Description:** Verify ranks see comparable sample counts and epoch boundaries.[^5][^1]


## Diagnostic Commands

### Command 1: Inspect shared memory usage

* **Purpose:** Check whether `/dev/shm` exhaustion is causing hangs.
* **Command:** `df -h /dev/shm && ls -la /dev/shm/ | wc -l`
* **Expected Output:** Available space comfortably exceeds per-worker batch buffering needs.
* **Interpretation:** Near-zero available space indicates shared memory exhaustion.[^1][^2]


### Command 2: Check worker process state

* **Purpose:** Identify whether workers are stuck, crashed, or saturating resources.
* **Command:** `ps aux | grep "DataLoader worker" | grep -v grep && top -b -n1 | grep "python"`
* **Expected Output:** Active worker processes with moderate CPU and memory usage.
* **Interpretation:** Missing processes indicate crashes; high CPU wait suggests I/O bottlenecks.[^2][^1]


### Command 3: Profile DataLoader iteration time

* **Purpose:** Measure batch loading latency against expected throughput.
* **Command:** `python -c "import time; t0 = time.time(); batch = next(iter(dataloader)); print(f'Batch load time: {time.time()-t0:.2f}s')"`
* **Expected Output:** Sub-second for light pipelines, and only a few seconds for heavy preprocessing.
* **Interpretation:** Sustained >10s latency indicates storage or preprocessing bottlenecks.[^3][^1]


### Command 4: Check for pickling and fork-safety issues

* **Purpose:** Detect dataset serialization failures or fork-unsafe initialization.
* **Command:** `python -c "import pickle; ds = MyDataset(); pickle.dumps(ds)"`
* **Expected Output:** No exception.
* **Interpretation:** `PicklingError` indicates non-serializable dataset state; CUDA-related failures point to fork-safety violations.[^1][^2]


## Diagnostic Tests

### Test 1: Shared memory isolation test

* **Purpose:** Determine whether container shared memory is the bottleneck.
* **Test:** Run the same job with larger container shared memory and compare behavior.[^2][^1]
* **Command:** `docker run --shm-size=8g my-training-image`
* **Expected Result:** Hang or crash disappears with increased shared memory.
* **Interpretation:** If fixed, `/dev/shm` exhaustion was the cause.[^1][^2]
* **Next Action:** Increase container shm allocation or mount host `/dev/shm`.[^2][^1]


### Test 2: Spawn versus fork comparison

* **Purpose:** Determine whether fork-safety violations are causing hangs or crashes.
* **Test:** Set the multiprocessing start method to `spawn` before constructing the `DataLoader`.[^1][^2]
* **Command:** `python -c "import torch.multiprocessing as mp; mp.set_start_method('spawn'); dl = DataLoader(ds, num_workers=4); next(iter(dl))"`
* **Expected Result:** Workers spawn successfully without CUDA or pickling errors.
* **Interpretation:** If fixed, fork-safety was the issue.[^2][^1]
* **Next Action:** Refactor dataset to be fork-safe or use `spawn` permanently.[^1][^2]


### Test 3: Worker count scaling test

* **Purpose:** Find the worker count that maximizes throughput without oversubscription.
* **Test:** Benchmark throughput across several `num_workers` values.[^2][^1]
* **Command:** `for n in 0 2 4 8 16; do python benchmark.py --num_workers=$n; done`
* **Expected Result:** Throughput rises and then plateaus.
* **Interpretation:** The peak identifies the practical worker budget; regression at higher counts indicates oversubscription.[^1][^2]
* **Next Action:** Set `num_workers` to the best observed value, then re-benchmark after preprocessing changes.[^2][^1]


## Decision Tree

* **Question:** Does the hang or crash occur only with `num_workers > 0`?
    * **No:**
        * **Question:** Does it occur with `num_workers=0` too?
            * **Yes:**
                * **Result:** The issue is in `__getitem__` or storage; profile sample retrieval and I/O latency.[^1][^2]
            * **No:**
                * **Result:** Intermittent race condition; inspect for locks or shared mutable state.[^2][^1]
    * **Yes:**
        * **Question:** Is this running inside a container?
            * **Yes:**
                * **Question:** Does `df -h /dev/shm` show low available space?
                    * **Yes:**
                        * **Result:** Shared memory exhaustion; increase container shm or use a memory-backed mount.[^1][^2]
                    * **No:**
                        * **Question:** Does switching to `spawn` fix it?
                            * **Yes:**
                                * **Result:** Fork-safety violation; refactor dataset or keep `spawn`.[^2][^1]
                            * **No:**
                                * **Result:** Check worker count oversubscription or storage I/O bottlenecks.[^1][^2]
            * **No:**
                * **Question:** Does `pickle.dumps(dataset)` fail?
                    * **Yes:**
                        * **Result:** Non-picklable dataset; remove lambdas, closures, or unpicklable objects.[^2][^1]
                    * **No:**
                        * **Question:** Does `htop` show CPU saturation with high I/O wait?
                            * **Yes:**
                                * **Result:** Storage bottleneck; cache data locally or reduce preprocessing.[^4][^3]
                            * **No:**
                                * **Question:** Are you using DDP with uneven dataset lengths?
                                    * **Yes:**
                                        * **Result:** Distributed straggler; use balanced sharding and appropriate sampler settings.[^5][^1]
                                    * **No:**
                                        * **Result:** Custom deadlock in `collate_fn` or `__getitem__`; inspect with a profiler for lock contention.[^1][^2]


## Solutions

### Solution 1: Increase Container Shared Memory

* **Quick Fix:** Add `--shm-size=8g` to the Docker run command.[^2][^1]
* **Permanent Fix:** Mount host `/dev/shm` or use a `tmpfs`-backed memory volume in Kubernetes.[^1][^2]
* **Steps:**

1. Check current usage: `df -h /dev/shm`.
2. Estimate required capacity from batch size, worker count, and sample size.
3. Increase shm allocation in Docker or Kubernetes.
4. Re-run the pipeline and confirm stable worker behavior.
5. Verify that `/dev/shm` headroom remains under peak throughput.[^2][^1]
* **Tradeoffs:**
    * Consumes host RAM and can compete with training memory.
    * Memory-backed volumes are constrained by pod or node limits.[^1][^2]
* **Performance Impact:** Eliminates shm-related hangs; no inherent training slowdown.
* **Difficulty:** Easy.
* **Works For:**
    * Containerized training.
    * Multi-worker `DataLoader` with pinned-memory transfer.[^2][^1]
* **Verification:** Training proceeds without worker crashes or deadlocks.[^1][^2]


### Solution 2: Use Spawn Instead of Fork

* **Quick Fix:** Set `multiprocessing.set_start_method('spawn')` at script entry.[^2][^1]
* **Permanent Fix:** Restructure the dataset so initialization is fork-safe and fully serializable.[^1][^2]
* **Steps:**

1. Call `set_start_method('spawn', force=True)` before any worker creation.
2. Move file opens out of `__init__` and into lazy code paths.
3. Remove CUDA calls from dataset code.
4. Validate serialization with `pickle.dumps(dataset)`.
5. Keep `__main__`-guarded entry points so worker import does not rerun setup code.[^2][^1]
* **Tradeoffs:**
    * Slower worker startup than `fork`.
    * Requires stricter serialization discipline.[^1][^2]
* **Performance Impact:** Slightly slower startup, but usually stable steady-state throughput.
* **Difficulty:** Easy.
* **Works For:**
    * CUDA-related worker crashes.
    * Datasets with open file descriptors in initialization.
    * Linux workflows that otherwise rely on `fork`.[^2][^1]
* **Verification:** Workers spawn without CUDA initialization or serialization failures.[^1][^2]


### Solution 3: Tune `num_workers` and `pin_memory`

* **Quick Fix:** Start with `num_workers = cpu_count() // 2` and `pin_memory = True` for GPU training.[^2][^1]
* **Permanent Fix:** Benchmark and standardize on a worker count that matches CPU, RAM, and preprocessing cost.[^1][^2]
* **Steps:**

1. Benchmark several worker counts.
2. Select the point where throughput stops improving.
3. Keep `pin_memory=True` when the output goes to CUDA devices.
4. Use `persistent_workers=True` for repeated epochs when worker startup is expensive.
5. Re-evaluate after preprocessing or storage changes.[^2][^1]
* **Tradeoffs:**
    * Too many workers increase context switching and memory pressure.
    * Persistent workers increase baseline memory use.[^1][^2]
* **Performance Impact:** Often improves throughput substantially when the initial setting is suboptimal.
* **Difficulty:** Easy.
* **Works For:**
    * CPU-bound preprocessing.
    * General multi-worker pipelines.
    * GPU training with host-to-device transfer bottlenecks.[^2][^1]
* **Verification:** GPU utilization stays high and batch latency stays below compute time.[^3][^1]


### Solution 4: Cache Data to Local NVMe

* **Quick Fix:** Copy datasets to local SSD before training starts.[^4][^3]
* **Permanent Fix:** Add a staging layer that prefetches hot shards to local storage.[^4][^3]
* **Steps:**

1. Confirm the bottleneck with `iostat` or a simple read benchmark.
2. Sync data to local NVMe or equivalent local disk.
3. Point the dataset path to the local copy.
4. For very large datasets, prefetch the next shard in the background.
5. Re-measure end-to-end throughput.[^4][^3]
* **Tradeoffs:**
    * Requires local disk capacity.
    * Adds job startup time for staging.[^3][^4]
* **Performance Impact:** Can dramatically improve I/O-bound pipelines when network storage is the limit.
* **Difficulty:** Medium.
* **Works For:**
    * NFS, EFS, Filestore, and object-storage mounts.[^4][^3]
* **Verification:** `iostat` shows lower latency and throughput approaches local-disk baseline.[^3][^4]


### Solution 5: Fix Picklability and Remove CUDA from Dataset

* **Quick Fix:** Remove lambdas, nested functions, and CUDA tensors from dataset state.[^1][^2]
* **Permanent Fix:** Keep dataset `__init__` minimal and serializable, with only safe Python objects.[^2][^1]
* **Steps:**

1. Replace lambda transforms with module-level callables.
2. Move CUDA operations to the training loop.
3. Avoid storing unpicklable library objects in dataset state.
4. Re-test with `pickle.dumps(dataset)`.
5. If needed, implement custom `__getstate__` and `__setstate__`.[^1][^2]
* **Tradeoffs:**
    * May require restructuring preprocessing code.
    * Some third-party objects are not safe to serialize.[^2][^1]
* **Performance Impact:** Usually neutral; may slightly increase code complexity.
* **Difficulty:** Medium.
* **Works For:**
    * Complex custom datasets.
    * Inline notebook code.
    * Any dataset failing serialization checks.[^1][^2]
* **Verification:** `pickle.dumps(dataset)` succeeds and workers start normally.[^2][^1]


## Verification Checklist

* **Check:** DataLoader iteration completes without hangs.
    * **Description:** `for batch in dataloader` runs to completion.[^1][^2]
* **Check:** Worker processes remain stable.
    * **Description:** No crashes or OOM kills during a full epoch.[^2][^1]
* **Check:** GPU utilization is consistently high.
    * **Description:** GPU idle time no longer dominates the training step.[^3][^1]
* **Check:** Batch loading latency is within budget.
    * **Description:** Input pipeline time stays below compute time per step.[^3][^1]
* **Check:** Training throughput matches the expected maximum.
    * **Description:** Samples per second is close to the compute-bound baseline.[^4][^3]


## Prevention

### Development Practices

* Test datasets with `num_workers > 0` before scaling to full training.[^1][^2]
* Keep dataset initialization minimal and serializable; defer I/O to worker-side paths.[^2][^1]
* Profile data loading independently from model training.[^4][^3]
* Use `persistent_workers=True` and `prefetch_factor=2` where repeated epochs justify the memory cost.[^1][^2]


### Production Practices

* Provision enough shared memory for multi-worker loading in containers.[^2][^1]
* Treat `num_workers` as a tuned parameter, not a constant default.[^1][^2]
* Stage remote datasets to local disk when I/O latency dominates.[^4][^3]
* Set distributed timeout policies that reflect expected data-staging latency.[^5][^1]


### Monitoring Practices

* Log per-batch data loading time.[^3][^1]
* Alert on prolonged GPU starvation.[^3][^1]
* Monitor `/dev/shm` usage in containerized jobs.[^2][^1]
* Track worker crash rates and restart counts.[^1][^2]


### Coding Habits

* Never call CUDA from dataset code.[^2][^1]
* Avoid lambdas and closures in dataset transforms.[^1][^2]
* Implement `__getstate__` and `__setstate__` for datasets with non-picklable state.[^2][^1]
* Keep custom `collate_fn` implementations free of hidden locks and blocking I/O.[^1][^2]


## Common Misconceptions

* **Misconception:** More `num_workers` always improves throughput.
    * **Reality:** Throughput eventually regresses due to context switching, memory contention, and I/O saturation.[^2][^1]
* **Misconception:** `pin_memory=True` causes hangs.
    * **Reality:** Problems usually arise when pinned-memory loading combines with insufficient shared memory in containers.[^1][^2]
* **Misconception:** `fork` is always faster and therefore always better.
    * **Reality:** `fork` starts quickly but is fragile with CUDA and thread-using code; safer start methods can be the right tradeoff.[^2][^1]


## False Positive Cases

* **Case:** Intentional synchronization delay.
    * **Why It Looks Similar:** The job appears to hang during loading.
    * **How To Distinguish:** Code explicitly waits on barriers or sleeps; GPU idle time is expected.
* **Case:** `torch.compile` first-iteration overhead.
    * **Why It Looks Similar:** The first batch takes much longer than later batches.
    * **How To Distinguish:** The delay is in model execution, not the data pipeline.
* **Case:** Dynamic batching or bucketing.
    * **Why It Looks Similar:** Batch latency varies widely.
    * **How To Distinguish:** Latency correlates with sequence length or sample complexity, not worker failure.


## Escalation Paths

* **Path:** Implement custom data loading with Ray or DALI.
    * **When To Use:** PyTorch `DataLoader` cannot meet throughput requirements.
    * **Tradeoffs:**
        * Adds significant infrastructure complexity.
        * Requires rewriting preprocessing.
* **Path:** Use WebDataset or `IterableDataset` for streaming.
    * **When To Use:** The dataset is too large for local staging.
    * **Tradeoffs:**
        * Requires format conversion.
        * Reduces random-access flexibility.
* **Path:** Shard data and preprocess offline.
    * **When To Use:** Preprocessing is the dominant bottleneck and can be amortized.
    * **Tradeoffs:**
        * Requires extra storage for shards.
        * Reduces flexibility for augmentation changes.


## Further Study

## Suggested Meta

* **Tags:** data, debugging, dataloader, multiprocessing, deadlock, performance, pytorch.
* **Aliases:** dataloader-hang, worker-crash, slow-loading, shared-memory, deadlock.
* **Keywords:** dataloader, num_workers, pin_memory, shared memory, fork, spawn, multiprocessing, deadlock.
* **Search Tokens:** dataloader hanging, worker killed signal, slow batch loading, shared memory exhausted, num_workers crash.
* **Difficulty:** Advanced.
* **Domain:** deep-learning.
* **Engineering Area:** data, training, infrastructure.
* **Estimated Reading Time:** 20-25 minutes.
* **Prerequisites:** pytorch-basics, multiprocessing.
* **Recommended Next:** gpu-not-detected, nan-loss-exploding-gradients, oom-training.
* **Cross-Links:**
    * related_packages: pytorch, torchvision, nvidia-dali.
    * related_workflows: train-from-scratch, distributed-training-ddp.
    * related_patterns: gradient-accumulation, mixed-precision.
    * related_models: llama, mistral, resnet.
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://docs.pytorch.org/docs/stable/data.html

[^2]: https://docs.pytorch.org/docs/2.9/notes/multiprocessing.html

[^3]: https://arxiv.org/pdf/2211.04908.pdf

[^4]: http://arxiv.org/pdf/2209.13705.pdf

[^5]: https://docs.pytorch.org/tutorials/beginner/data_loading_tutorial.html

[^6]: https://arxiv.org/abs/2508.04035

[^7]: https://arxiv.org/abs/2510.09108

[^8]: https://arxiv.org/abs/2409.12682

[^9]: http://radiotec.ru/en/journal/Dynamics_of_Difficult_Systems–XXI_century/number/2026-1/article/25805

[^10]: https://arxiv.org/pdf/1909.06576.pdf

[^11]: https://linkinghub.elsevier.com/retrieve/pii/S0169260721003102

[^12]: https://docs.pytorch.org/tutorials/beginner/basics/data_tutorial.html

[^13]: https://docs.pytorch.org/cppdocs/api/data/dataloader.html

[^14]: https://docs.pytorch.org/docs/stable/notes/multiprocessing.html

[^15]: https://github.com/pytorch/pytorch/blob/main/torch/utils/data/dataloader.py

[^16]: https://www.geeksforgeeks.org/deep-learning/pytorch-dataloader/

[^17]: https://github.com/pytorch/pytorch/blob/0b868b19063645afed59d6d49aff1e43d1665b88/torch/utils/data/dataloader.py

[^18]: https://discuss.pytorch.org/t/large-memory-copy-leak-when-using-dataloaders-with-dictionaries-and-workers-0/34671

