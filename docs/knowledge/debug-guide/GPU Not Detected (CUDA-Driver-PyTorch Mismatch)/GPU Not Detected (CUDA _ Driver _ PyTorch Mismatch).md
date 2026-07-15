<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# GPU Not Detected (CUDA / Driver / PyTorch Mismatch)

## Overview

When `nvidia-smi` sees hardware but PyTorch or TensorFlow cannot enumerate GPUs, the failure is usually in the compatibility boundary between driver, CUDA runtime, framework build, or container/runtime wiring rather than in the GPU itself. The fastest path is to verify host visibility, framework build metadata, and shared-library linkage, then isolate container, driver, or environment mismatch before touching application code.[^1][^2][^3][^4][^5]

## Problem

During ML workload execution, PyTorch or TensorFlow fails to detect available NVIDIA GPUs and falls back to CPU execution, causing training throughput to degrade by 10-100x and potentially exhausting host memory.[^3][^5]

## Overview Card

* **Severity:** Critical.
* **Frequency:** Common.
* **Typical Stage:** Environment Setup / Training Launch.
* **Estimated Fix Time:** 15-90 min.
* **Production Impact:** Severe.


## Quick Identification

* **Check:** `torch.cuda.is_available()` returns `False`.
    * **Description:** PyTorch cannot access any CUDA device.[^3]
* **Check:** `nvidia-smi` shows GPUs but framework reports none.
    * **Description:** Hardware is visible to the driver but not to the ML framework.[^2][^5]
* **Check:** Training falls back to CPU with `device='cpu'`.
    * **Description:** Workload executes on CPU despite GPU hardware presence.[^3]


## Symptoms

### Symptom 1: Framework CUDA Unavailable

* **Description:** `torch.cuda.is_available()` or `tf.config.list_physical_devices('GPU')` returns empty or `False`.
* **Error Message:** No explicit error; silent fallback to CPU.
* **Where Appears:** Training script initialization, device selection code.
* **Frequency:** Always.


### Symptom 2: `nvidia-smi` / Framework Mismatch

* **Description:** `nvidia-smi` lists GPUs with a valid driver version, but the framework cannot see them.
* **Error Message:** No explicit error; disconnect between system and framework visibility.
* **Where Appears:** Environment setup, container runtime, virtual environment.
* **Frequency:** Often.


### Symptom 3: ImportError on CUDA Libraries

* **Description:** Runtime fails with missing `libcudart.so` or `libcuda.so` shared libraries.
* **Error Message:** `ImportError: libcuda.so.1: cannot open shared object file: No such file or directory`.
* **Where Appears:** Import time, first CUDA operation.
* **Frequency:** Sometimes.


### Symptom 4: Wrong CUDA Version Error

* **Description:** Framework reports CUDA version mismatch or incompatible runtime behavior.
* **Error Message:** `The NVIDIA driver on your system is too old` or `CUDA error: no kernel image is available`.
* **Where Appears:** Runtime, first GPU tensor operation.
* **Frequency:** Sometimes.


## Root Causes

### Root Cause 1: PyTorch/TensorFlow CUDA Version Mismatch

* **Probability:** High.
* **Explanation:** The framework wheel was compiled against a different CUDA toolkit version than the runtime libraries available on the system, breaking binary compatibility at `libcudart` or related linkage points.[^5][^1][^3]
* **Recognition Clues:**
    * `torch.version.cuda` does not match the expected CUDA build.
    * `nvidia-smi` driver version and framework build metadata disagree.
    * The environment was installed via pip or conda without a pinned CUDA-specific package set.
* **Typical Environment:** Conda environments, pip installs on shared clusters, manual PyPI installations.


### Root Cause 2: NVIDIA Driver Too Old for CUDA Toolkit

* **Probability:** High.
* **Explanation:** The installed driver does not satisfy the minimum version required by the CUDA runtime expected by the framework, so the runtime cannot initialize GPU execution.[^4][^1][^2]
* **Recognition Clues:**
    * Driver version shown by `nvidia-smi` is below the documented minimum.
    * The error explicitly says the driver is too old.
    * The host uses a conservative OS repository driver package.
* **Typical Environment:** Enterprise Linux distributions, long-running servers, VM images with stale drivers.


### Root Cause 3: Missing or Broken NVIDIA Container Runtime

* **Probability:** Medium.
* **Explanation:** Containerized workloads cannot see `/dev/nvidia*` devices unless the NVIDIA container runtime or equivalent GPU passthrough is configured, so the framework can only enumerate CPU devices.[^5][^3]
* **Recognition Clues:**
    * `nvidia-smi` works on the host but not inside the container.
    * GPU flags were omitted from the container invocation.
    * The container runtime is plain `runc` rather than the NVIDIA-enabled path.
* **Typical Environment:** Docker, Kubernetes, CI/CD runners, GPU-enabled container images.


### Root Cause 4: Missing cuDNN or CUDA Shared Libraries

* **Probability:** Medium.
* **Explanation:** The framework imports successfully but cannot load required runtime libraries, causing either explicit `ImportError` or silent fallback when the GPU backend cannot initialize.[^1][^3]
* **Recognition Clues:**
    * `ldd` on framework libraries shows missing CUDA-related `.so` files.
    * TensorFlow reports no GPU devices despite a CUDA build.
    * Base images are minimal and omit runtime libraries.
* **Typical Environment:** Stripped-down Docker images, custom CUDA installs, minimal OS images.


### Root Cause 5: WSL2 GPU Support Misconfigured

* **Probability:** Medium.
* **Explanation:** WSL2 depends on Windows-host driver support and a compatible userspace CUDA path; standard Linux driver assumptions do not apply cleanly.[^3]
* **Recognition Clues:**
    * GPU is visible on the Windows host but not inside WSL2.
    * WSL2 lacks the expected CUDA library path or kernel-facing support.
    * The installed driver is not WSL2-capable.
* **Typical Environment:** Windows development workstations, WSL2-based ML workflows.


### Root Cause 6: Permission or Group Membership Issue

* **Probability:** Low.
* **Explanation:** The process cannot access `/dev/nvidia*` due to device permissions, so device enumeration fails even though the driver is present.
* **Recognition Clues:**
    * `nvidia-smi` works as root but fails as the user.
    * Device nodes have restrictive permissions.
    * The user is missing the expected device-access group.
* **Typical Environment:** Shared servers, HPC clusters, restricted containers.


### Root Cause 7: PCIe Link or Power-State Failure

* **Probability:** Low.
* **Explanation:** The GPU exists at the driver layer but is not reliably initialized at the hardware link or power-management layer, so framework initialization fails after device discovery.[^2]
* **Recognition Clues:**
    * `nvidia-smi` shows error states, `N/A` fields, or intermittent device visibility.
    * Kernel logs show PCIe or NVIDIA initialization errors.
    * The issue appears after suspend/resume or chassis maintenance.
* **Typical Environment:** Desktop workstations, systems after hardware changes, nodes with unstable power management.


## Investigation Checklist

* **Check:** Check `nvidia-smi` output on host.
    * **Description:** Verify driver version, GPU visibility, and GPU memory state.[^4][^2]
* **Check:** Check framework CUDA version.
    * **Description:** Run `torch.version.cuda` or TensorFlow build metadata to identify the compiled CUDA target.[^3]
* **Check:** Check driver-CUDA compatibility matrix.
    * **Description:** Compare driver version against NVIDIA-supported minimums for the target CUDA runtime.[^1][^2][^4]
* **Check:** Check container runtime configuration.
    * **Description:** Verify GPU passthrough is enabled in Docker or Kubernetes.[^5][^3]
* **Check:** Check shared library dependencies.
    * **Description:** Use `ldd` on framework libraries to find missing CUDA or cuDNN dependencies.[^1][^3]
* **Check:** Check user permissions on `/dev/nvidia*`.
    * **Description:** Verify user has read/write access to GPU device files.
* **Check:** Check WSL2 driver compatibility.
    * **Description:** Confirm WSL2-capable NVIDIA driver support on the Windows host.[^3]


## Diagnostic Commands

### Command 1: Verify PyTorch CUDA stack

* **Purpose:** Check PyTorch CUDA availability and version alignment.
* **Command:** `python -c "import torch; print(f'CUDA available: {torch.cuda.is_available()}'); print(f'CUDA version: {torch.version.cuda}'); print(f'cuDNN: {torch.backends.cudnn.version()}')"`
* **Expected Output:** `CUDA available: True`, matching CUDA version, non-`None` cuDNN version.
* **Interpretation:** `False` or version mismatch indicates binary incompatibility.[^3]


### Command 2: Verify TensorFlow GPU stack

* **Purpose:** Check TensorFlow GPU device visibility.
* **Command:** `python -c "import tensorflow as tf; print(tf.config.list_physical_devices('GPU')); print(tf.test.is_built_with_cuda())"`
* **Expected Output:** List of GPU devices, `True` for CUDA build.
* **Interpretation:** Empty list or `False` indicates build or runtime issue.[^3]


### Command 3: Check library linkage

* **Purpose:** Identify missing CUDA shared libraries.
* **Command:** `ldd $(python -c "import torch; import os; print(os.path.join(os.path.dirname(torch.__file__), 'lib', 'libtorch_python.so'))") | grep "not found"`
* **Expected Output:** No `not found` entries.
* **Interpretation:** Missing libraries indicate incomplete CUDA or cuDNN installation.[^1][^3]


### Command 4: Inspect NVIDIA driver details

* **Purpose:** Verify driver version and loaded kernel modules.
* **Command:** `cat /proc/driver/nvidia/version && lsmod | grep nvidia`
* **Expected Output:** Driver version string and NVIDIA kernel modules loaded.
* **Interpretation:** Missing `nvidia_uvm` can prevent CUDA runtime initialization.[^2]


## Diagnostic Tests

### Test 1: CUDA compatibility matrix check

* **Purpose:** Determine if the driver supports the framework’s CUDA version.
* **Test:** Compare `nvidia-smi` driver version against NVIDIA compatibility tables.
* **Command:** `nvidia-smi | grep "Driver Version"` then cross-reference with the NVIDIA CUDA compatibility documentation [https://docs.nvidia.com/datacenter/tesla/drivers/cuda-toolkit-driver-and-architecture-matrix.html](https://docs.nvidia.com/datacenter/tesla/drivers/cuda-toolkit-driver-and-architecture-matrix.html).
* **Expected Result:** Driver version meets or exceeds the minimum required for the framework’s CUDA build.
* **Interpretation:** If the driver is too old, upgrade the driver or reinstall the framework with a matching CUDA build.[^4][^2][^1]
* **Next Action:** Install a newer NVIDIA driver or reinstall the framework with the correct CUDA channel.


### Test 2: Container GPU passthrough test

* **Purpose:** Verify container runtime can access GPUs.
* **Test:** Run `nvidia-smi` inside the container versus on the host.
* **Command:** `docker run --rm --gpus all nvidia/cuda:12.1-base nvidia-smi`
* **Expected Result:** Same output as host `nvidia-smi`.
* **Interpretation:** Failure indicates missing container runtime configuration.
* **Next Action:** Install `nvidia-container-toolkit` and restart the Docker daemon.[^5][^3]


### Test 3: Minimal CUDA kernel launch test

* **Purpose:** Verify CUDA runtime can execute kernels beyond device enumeration.
* **Test:** Run a minimal PyTorch tensor operation on GPU.
* **Command:** `python -c "import torch; x = torch.randn(10, 10).cuda(); print(x @ x)"`
* **Expected Result:** A 10x10 tensor prints without error.
* **Interpretation:** A runtime error indicates driver, library, or hardware initialization failure.
* **Next Action:** Check kernel logs for NVIDIA driver errors if this fails.[^2][^1]


## Decision Tree

* **Question:** Does `nvidia-smi` work on the host?
    * **No:**
        * **Question:** Is this a physical server or VM?
            * **Physical:**
                * **Result:** Hardware or driver installation issue — reinstall NVIDIA driver, check PCIe seating.
            * **VM:**
                * **Result:** GPU passthrough is not configured — enable PCI passthrough in the hypervisor.
    * **Yes:**
        * **Question:** Does `torch.cuda.is_available()` return `True`?
            * **Yes:**
                * **Question:** Does a minimal CUDA tensor operation succeed?
                    * **Yes:**
                        * **Result:** GPU is functional; issue is in application code.
                    * **No:**
                        * **Result:** Runtime CUDA error — check kernel logs and library linkage.
            * **No:**
                * **Question:** Are you inside a container?
                    * **Yes:**
                        * **Question:** Does `docker run --gpus all nvidia/cuda:12.1-base nvidia-smi` work?
                            * **Yes:**
                                * **Result:** Container runtime is OK; framework CUDA version mismatch — reinstall the framework with matching CUDA.
                            * **No:**
                                * **Result:** NVIDIA Container Toolkit is not installed or misconfigured.
                    * **No:**
                        * **Question:** Does `torch.version.cuda` match system CUDA?
                            * **Yes:**
                                * **Result:** Permission issue or missing cuDNN — check `/dev/nvidia*` permissions and missing libraries.
                            * **No:**
                                * **Result:** Framework built for the wrong CUDA version — reinstall with the correct CUDA channel.


## Solutions

### Solution 1: Reinstall PyTorch with Correct CUDA Version

* **Quick Fix:** Uninstall current PyTorch and reinstall with the matching CUDA index URL.
* **Permanent Fix:** Pin CUDA version in environment specifications and use lockfiles.
* **Steps:**

1. Run `python -c "import torch; print(torch.version.cuda)"` to identify the expected CUDA build.
2. Run `nvcc --version` or `nvidia-smi` to identify system capability.
3. Uninstall current PyTorch packages.
4. Reinstall with the matching CUDA-specific index URL.
5. Verify `torch.cuda.is_available()`.
* **Tradeoffs:**
    * Requires package source alignment.
    * Can conflict with packages expecting a different PyTorch build.
* **Performance Impact:** None; correct build enables GPU acceleration.
* **Difficulty:** Easy.
* **Works For:**
    * Pip-installed PyTorch environments with CUDA mismatch.
    * Conda environments where CUDA packages conflict.
* **Verification:** `torch.cuda.is_available()` returns `True` and `torch.version.cuda` matches system capability.[^4][^1][^3]


### Solution 2: Upgrade NVIDIA Driver

* **Quick Fix:** Install a driver version that satisfies the CUDA compatibility matrix.
* **Permanent Fix:** Pin driver management in OS packaging or image build workflows.
* **Steps:**

1. Identify current driver with `nvidia-smi`.
2. Check the minimum supported driver for the target CUDA version.
3. Install a newer NVIDIA driver from the official repository.
4. Reboot and verify `nvidia-smi`.
* **Tradeoffs:**
    * Requires downtime.
    * New drivers can expose regressions on older GPUs.
* **Performance Impact:** None; may improve stability on newer hardware.
* **Difficulty:** Medium.
* **Works For:**
    * Bare-metal servers with outdated drivers.
    * VMs with GPU passthrough but stale host drivers.
* **Verification:** Driver version meets or exceeds the CUDA runtime minimum.[^2][^4][^1]


### Solution 3: Configure NVIDIA Container Toolkit

* **Quick Fix:** Install `nvidia-container-toolkit` and restart Docker.
* **Permanent Fix:** Configure the container runtime as the default GPU-aware runtime.
* **Steps:**

1. Install the NVIDIA container toolkit.
2. Configure Docker runtime integration.
3. Restart Docker.
4. Test GPU visibility inside a CUDA container.
5. For Kubernetes, verify the NVIDIA device plugin is running.
* **Tradeoffs:**
    * Adds runtime dependency.
    * Requires daemon restarts.
* **Performance Impact:** None; enables passthrough.
* **Difficulty:** Medium.
* **Works For:**
    * Docker deployments.
    * Kubernetes clusters.
    * GPU-based CI runners.
* **Verification:** Container `nvidia-smi` matches host output.[^5][^3]


### Solution 4: Install Missing cuDNN / CUDA Libraries

* **Quick Fix:** Install the missing runtime libraries or use a CUDA image that already includes them.
* **Permanent Fix:** Use NVIDIA base images with validated CUDA and cuDNN stacks.
* **Steps:**

1. Identify missing library dependencies with `ldd`.
2. Install cuDNN or CUDA runtime packages.
3. Set `LD_LIBRARY_PATH` if needed.
4. Prefer base images that include the full runtime stack.
* **Tradeoffs:**
    * Increases image size.
    * Adds dependency management overhead.
* **Performance Impact:** None; these libraries are required for GPU execution.
* **Difficulty:** Medium.
* **Works For:**
    * Minimal Docker images.
    * Custom CUDA installations.
    * Module-based HPC environments.
* **Verification:** `torch.backends.cudnn.version()` or TensorFlow GPU listing succeeds.[^1][^3]


### Solution 5: Fix WSL2 GPU Support

* **Quick Fix:** Install a WSL2-capable NVIDIA driver on the Windows host.
* **Permanent Fix:** Use native Linux for production GPU workloads.
* **Steps:**

1. Verify the host driver is WSL2-capable.
2. Confirm the WSL2 userspace library path is available.
3. Verify the CUDA library symlink if needed.
4. Test GPU detection from inside WSL2.
* **Tradeoffs:**
    * Best-effort environment rather than a production-grade target.
    * Typically slower than native Linux.
* **Performance Impact:** Slight overhead relative to native Linux.
* **Difficulty:** Medium.
* **Works For:**
    * Windows development workstations.
    * Prototyping environments.
* **Verification:** `nvidia-smi` and framework GPU detection work inside WSL2.[^3]


## Verification Checklist

* **Check:** `torch.cuda.is_available()` returns `True`.
    * **Description:** PyTorch can enumerate CUDA devices.
* **Check:** `nvidia-smi` output matches inside and outside container.
    * **Description:** Container runtime correctly passes through GPU devices.
* **Check:** Minimal CUDA kernel executes without error.
    * **Description:** Runtime libraries are correctly linked and functional.
* **Check:** Framework CUDA version matches system capability.
    * **Description:** No binary incompatibility between framework build and driver.
* **Check:** Training utilizes GPU memory and compute.
    * **Description:** `nvidia-smi` shows GPU utilization during training.


## Prevention

### Development Practices

* Pin CUDA version in `requirements.txt` or `environment.yml` and use lockfiles.
* Always specify the CUDA-specific PyTorch wheel index for pip installs.
* Test GPU detection in CI before launching full training jobs.
* Use NVIDIA CUDA base images for reproducible environments.


### Production Practices

* Maintain a golden container image with a validated driver-CUDA-framework stack.
* Pin NVIDIA driver versions in image or OS lifecycle management.
* Run host and framework GPU preflight checks in job schedulers.
* Document the CUDA compatibility matrix for each GPU node pool.


### Monitoring Practices

* Alert when framework GPU detection is `False` on GPU-enabled nodes.
* Track driver version drift across cluster nodes.
* Monitor container runtime health on GPU worker nodes.
* Log GPU utilization; zero utilization on GPU jobs indicates detection failure.


### Coding Habits

* Always assert GPU availability before moving models to GPU.
* Use explicit device selection with logging rather than silent fallback.
* Fail fast instead of silently training on CPU.
* Add environment validation to training script entrypoints.


## Common Misconceptions

* **Misconception:** `nvidia-smi` working means CUDA is fully functional.
    * **Reality:** `nvidia-smi` uses a different code path than CUDA runtime; the driver can be present while the framework build remains incompatible.[^2][^1]
* **Misconception:** Installing CUDA toolkit is required for PyTorch GPU support.
    * **Reality:** PyTorch wheels often bundle the runtime they need; the problem is usually build/runtime mismatch, not a missing toolkit alone.[^3]
* **Misconception:** Latest driver always works with all CUDA versions.
    * **Reality:** Compatibility is bounded by supported driver/toolkit matrices.[^4][^2]


## False Positive Cases

* **Case:** Intentional CPU fallback for debugging.
    * **Why It Looks Similar:** `torch.cuda.is_available()` is `False` or unused.
    * **How To Distinguish:** Code explicitly sets `device='cpu'`; `CUDA_VISIBLE_DEVICES=""` is set.
* **Case:** Multi-GPU system where only some GPUs are allocated.
    * **Why It Looks Similar:** `torch.cuda.device_count()` is less than the physical count.
    * **How To Distinguish:** `CUDA_VISIBLE_DEVICES` is set to a subset; `nvidia-smi` shows all GPUs.
* **Case:** GPU is in exclusive-process mode and occupied by another process.
    * **Why It Looks Similar:** Framework cannot acquire GPU.
    * **How To Distinguish:** `nvidia-smi` shows GPU in use by another process.


## Escalation Paths

* **Path:** NVIDIA Developer Support.
    * **When To Use:** Suspected hardware defect or driver bug.
    * **Tradeoffs:**
        * Requires NVIDIA developer account.
        * Response time may be several business days.
* **Path:** Framework Issue Tracker.
    * **When To Use:** Confirmed framework CUDA binding bug after isolation.
    * **Tradeoffs:**
        * Requires a minimal reproducible example.
        * Fix may not be available until a later release.
* **Path:** Bare-Metal Reinstallation.
    * **When To Use:** Environment is irreparably corrupted by mixed installs or broken symlinks.
    * **Tradeoffs:**
        * Removes installed packages and configuration.
        * Time-intensive but yields a clean state.


## Further Study

## Suggested Meta

* **Tags:** gpu, cuda, debugging, driver, pytorch, tensorflow, container, nvidia.
* **Aliases:** gpu-not-detected, cuda-mismatch, driver-issue, pytorch-cuda, nvidia-smi.
* **Keywords:** nvidia-smi, cuda, driver, cudatoolkit, cudnn, nvidia-container-toolkit, wsl2, gpu-passthrough.
* **Search Tokens:** gpu not detected, cuda not available, torch cuda false, nvidia driver mismatch, container gpu.
* **Difficulty:** Advanced.
* **Domain:** deep-learning.
* **Engineering Area:** infrastructure, gpu, deployment.
* **Estimated Reading Time:** 20-25 minutes.
* **Prerequisites:** linux-basics, docker-basics.
* **Recommended Next:** cuda-oom, mixed-precision-failure, distributed-training-setup.
* **Cross-Links:**
    * related_packages: pytorch, tensorflow, nvidia-cuda.
    * related_workflows: train-on-gpu, distributed-training-ddp.
    * related_patterns: mixed-precision, gradient-accumulation.
    * related_models: llama, mistral, stable-diffusion.
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://docs.nvidia.com/deploy/pdf/CUDA_Compatibility.pdf

[^2]: https://docs.nvidia.com/datacenter/tesla/drivers/cuda-toolkit-driver-and-architecture-matrix.html

[^3]: https://www.tensorflow.org/guide/gpu

[^4]: https://docs.nvidia.com/datacenter/tesla/drivers/supported-drivers-and-cuda-toolkit-versions.html

[^5]: https://docs.nvidia.com/deeplearning/frameworks/support-matrix/index.html

[^6]: https://jurnal.itscience.org/index.php/brilliance/article/view/6794

[^7]: https://www.semanticscholar.org/paper/176e7efdd20fb5def8781cd3e24d9f6c239a1c59

[^8]: https://ieeexplore.ieee.org/document/10029468/

[^9]: https://linkinghub.elsevier.com/retrieve/pii/S0141933112000038

[^10]: https://arxiv.org/pdf/2206.07896.pdf

[^11]: https://arxiv.org/pdf/2309.05445.pdf

[^12]: https://arxiv.org/pdf/2403.00232.pdf

[^13]: https://arxiv.org/html/2405.17322v1

[^14]: https://docs.nvidia.com/deeplearning/cudnn/backend/latest/reference/support-matrix.html

[^15]: https://www.tensorflow.org/install/gpu?hl=es-419

[^16]: https://datascience.stackexchange.com/questions/17578/using-tensorflow-with-intel-gpu

[^17]: https://medium.com/@cjcrobin/how-to-setting-up-compatible-pytorch-with-the-right-cuda-windows-setup-guide-23121807cdd6

[^18]: https://www.geeksforgeeks.org/python/tensorflow-system-requirements/

