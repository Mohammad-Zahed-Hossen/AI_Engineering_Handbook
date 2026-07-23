## Before Training

## Purpose
Verify dataset, environment, and model configurations prior to launching training jobs.

## Items
- [ ] Verify dataset integrity and validate train/validation/test split isolation
- [ ] Set global random seeds for PyTorch, NumPy, and CUDA reproducibility
- [ ] Confirm target compute device allocation and available GPU VRAM headroom
- [ ] Check parameter initialization and load baseline weights if fine-tuning
- [ ] Configure optimizer, learning rate schedule, and loss function parameters
- [ ] Verify checkpoint directory path, output write permissions, and disk space
- [ ] Initialize experiment tracker, metric loggers, and artifact store connections

## Quick Notes
- Enable `torch.backends.cudnn.benchmark = True` when input tensor dimensions remain constant.
- Configure DataLoader `pin_memory=True` and tune `num_workers` to eliminate CPU-GPU bottleneck.
- Verify loss computation numerical bounds early to prevent early training divergence or NaNs.

---

## Before Validation

## Purpose
Ensure evaluation environment isolates parameter states and prevents accidental gradient updates.

## Items
- [ ] Set model to evaluation mode using `model.eval()` to freeze layers
- [ ] Wrap validation loop inside `torch.no_grad()` or `torch.inference_mode()` context
- [ ] Verify validation dataset preprocessing aligns strictly with evaluation targets
- [ ] Confirm parameter gradients and optimizer states remain completely frozen
- [ ] Collect and aggregate evaluation metrics consistently across all validation batches
- [ ] Restore training mode using `model.train()` before resuming gradient steps

## Quick Notes
- `model.eval()` toggles Dropout and BatchNorm behavior but does not stop gradient calculations.
- Using `torch.no_grad()` during validation prevents unneeded activation memory retention.
- Ensure validation metric reduction correctly handles variable batch sizes at dataset tail.

---

## Before Inference

## Purpose
Validate inference runtime setup for fast, deterministic, and safe real-time predictions.

## Items
- [ ] Ensure model is explicitly placed in evaluation mode via `model.eval()`
- [ ] Enclose inference forward pass execution inside `torch.inference_mode()` context block
- [ ] Validate input tensor shapes, data types, and normalization value ranges
- [ ] Verify input tensor device placement matches model parameter device placement
- [ ] Confirm post-processing logic and output tensor decoding operate numerically stable
- [ ] Verify loaded checkpoint version, architecture definition, and serving metadata match

## Quick Notes
- `torch.inference_mode()` disables autograd view tracking, offering better speed than `torch.no_grad()`.
- Inputs moved to GPU/MPS must match model parameter precision (e.g., `torch.bfloat16`).
- Warm up model with dummy inputs to complete CUDA initialization prior to serving traffic.

---

## Before Export

## Purpose
Confirm model state, dynamic behavior, and operator compatibility prior to graph serialization.

## Items
- [ ] Load final optimized weight checkpoint using `load_state_dict()` cleanly
- [ ] Ensure model state is strictly set to `model.eval()` mode
- [ ] Validate static and dynamic input dimension bounds for runtime target
- [ ] Confirm target serialization mechanism compatibility, such as `torch.export` or ONNX
- [ ] Compare exported model predictions against native PyTorch outputs using dummy inputs
- [ ] Verify all custom ops and layers are supported by target runtime

## Quick Notes
- `torch.export` is the standard PyTorch 2.x mechanism for producing out-of-Python artifacts.
- Eliminate dynamic Python control flow in forward methods unless handled by dynamic shapes.
- Test numerical outputs between native PyTorch and exported artifacts within strict tolerance limits.

---

## Before Deployment

## Purpose
Verify system integration, runtime dependencies, and error handling before production deployment.

## Items
- [ ] Match PyTorch runtime, CUDA drivers, and native dependencies in deployment image
- [ ] Bundle trained model weights, tokenizer configs, and required pre/post-processing code
- [ ] Verify weight artifact availability, download integrity, and checksum in registry
- [ ] Register model version, tags, and configuration manifests in release management system
- [ ] Configure serving layer logging, health checks, error handling, and latency metrics
- [ ] Establish automated fallback strategies and rapid rollback triggers for runtime failures
- [ ] Validate serving container memory limits and thread pool settings under load

## Quick Notes
- Lock exact PyTorch 2.13.0 runtime builds and platform dependencies in production containers.
- Match PyTorch thread count via `torch.set_num_threads()` to target container CPU allocation.
- Execute stress tests at peak concurrency to detect potential CUDA Out-Of-Memory failures.

---

## Production Readiness Checklist

## Purpose
Perform final operational verification before declaring model release ready for production traffic.

## Items
- [ ] Complete end-to-end functional regression tests across representative production test suites
- [ ] Benchmark inference latency, throughput, and memory footprint against target SLAs
- [ ] Enable real-time telemetry monitoring for prediction drift, error rates, and VRAM
- [ ] Ensure model code, pipeline configurations, and serialized artifacts are fully versioned
- [ ] Verify automated zero-downtime deployment and instant rollback capabilities are active
- [ ] Confirm model weights and serialization files reside in secure, immutable storage
- [ ] Complete operational runbooks, system documentation, and obtain deployment sign-off

## Quick Notes
- Store model artifacts as immutable objects tagged with semantic versioning and SHA checksums.
- Monitor active VRAM usage continuously to spot memory leaks during prolonged serving runs.
- Ensure serving layer yields standard HTTP error codes when inputs fail schema validation.
