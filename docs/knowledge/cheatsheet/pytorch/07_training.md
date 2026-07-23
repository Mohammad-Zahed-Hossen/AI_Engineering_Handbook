# **PyTorch Training Utilities Cheatsheet**

## **Problem**

Enable Training Mode (model.train)

## **Trigger**

Use this API at the start of each training epoch to enable dropout layers and batch normalization parameter updates.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`class SimpleModel(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.fc = nn.Linear(10, 2)`  
        `self.drop = nn.Dropout(0.5)`

    `def forward(self, x):`  
        `return self.drop(self.fc(x))`

`model = SimpleModel()`  
`model.train()`

`x = torch.randn(4, 10)`  
`output = model(x)`  
`print(f"Training mode active: {model.training}")`

## **Minimal Notes**

Calling model.train() recursively sets the training attribute of all child submodules to True. It does not affect autograd gradient tracking; use torch.no\_grad() separately to control gradient tracking.

## **Common Bug**

**Issue:** Dropout layers continue zeroing out activations during evaluation and testing passes.

**Cause:** Forgetting to call model.eval() before running validation, leaving the model in its default train() state.

**Quick Fix:** Explicitly execute model.eval() before evaluation loops and model.train() before training loops.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.nn.Module.html\#torch.nn.Module.train](https://www.google.com/search?q=https://pytorch.org/docs/stable/generated/torch.nn.Module.html%23torch.nn.Module.train)

## **Problem**

Enable Evaluation Mode (model.eval)

## **Trigger**

Use this API prior to running validation, testing, or inference to disable dropout and freeze batch normalization statistics.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`class SimpleModel(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.fc = nn.Linear(10, 2)`  
        `self.drop = nn.Dropout(0.5)`

    `def forward(self, x):`  
        `return self.drop(self.fc(x))`

`model = SimpleModel()`  
`model.eval()`

`x = torch.randn(4, 10)`  
`with torch.no_grad():`  
    `output = model(x)`

`print(f"Training mode active: {model.training}")`

## **Minimal Notes**

model.eval() is equivalent to model.train(False) and recursively disables training behaviors across all submodules. It does not disable autograd, so pair it with with torch.no\_grad(): for inference.

## **Common Bug**

**Issue:** Model evaluation outputs vary nondeterministically between identical evaluation runs.

**Cause:** Running inference while the model remains in training mode, causing dropout to randomly mask activations.

**Quick Fix:** Always call model.eval() before running evaluation or inference passes.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.nn.Module.html\#torch.nn.Module.eval](https://www.google.com/search?q=https://pytorch.org/docs/stable/generated/torch.nn.Module.html%23torch.nn.Module.eval)

## **Problem**

Clip Gradient Norm (torch.nn.utils.clip\_grad\_norm\_)

## **Trigger**

Use this API to prevent exploding gradients by scaling parameter gradients down when their combined norm exceeds a target threshold.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`model = nn.Linear(10, 2)`  
`optimizer = torch.optim.SGD(model.parameters(), lr=0.1)`  
`x = torch.randn(4, 10)`  
`target = torch.randn(4, 2)`

`loss = nn.functional.mse_loss(model(x), target)`  
`loss.backward()`

`total_norm = torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0, norm_type=2.0)`  
`optimizer.step()`

`print(f"Clipped total gradient norm: {total_norm.item():.4f}")`

## **Minimal Notes**

Call clip\_grad\_norm\_ strictly between loss.backward() and optimizer.step(). The function modifies gradients in-place and returns the unclipped total norm.

## **Common Bug**

**Issue:** clip\_grad\_norm\_ has no effect on training stability or gradient magnitudes.

**Cause:** Calling clip\_grad\_norm\_ before loss.backward() when gradients are None, or after optimizer.step().

**Quick Fix:** Place clip\_grad\_norm\_ immediately after loss.backward() and before optimizer.step().

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.nn.utils.clip\_grad\_norm\_.html](https://pytorch.org/docs/stable/generated/torch.nn.utils.clip_grad_norm_.html)

## **Problem**

Clip Gradient Value (torch.nn.utils.clip\_grad\_value\_)

## **Trigger**

Use this API to clamp individual gradient elements within a specified interval to stabilize optimization.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`model = nn.Linear(10, 2)`  
`optimizer = torch.optim.SGD(model.parameters(), lr=0.1)`  
`x = torch.randn(4, 10)`  
`target = torch.randn(4, 2)`

`loss = nn.functional.mse_loss(model(x), target)`  
`loss.backward()`

`torch.nn.utils.clip_grad_value_(model.parameters(), clip_value=0.5)`  
`optimizer.step()`

`grads = [p.grad for p in model.parameters() if p.grad is not None]`  
`print(f"Max grad absolute value: {grads[0].abs().max().item():.4f}")`

## **Minimal Notes**

Clamps gradient values in-place to \[-clip\_value, clip\_value\]. Value clipping alters the direction of the gradient vector, unlike norm clipping which scales the entire vector uniformly.

## **Common Bug**

**Issue:** Optimization trajectory becomes unstable on architecture types reliant on exact gradient directions.

**Cause:** Using gradient value clipping instead of norm clipping on models like Transformers.

**Quick Fix:** Use torch.nn.utils.clip\_grad\_norm\_ when preserving gradient direction is essential.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.nn.utils.clip\_grad\_value\_.html](https://pytorch.org/docs/stable/generated/torch.nn.utils.clip_grad_value_.html)

## **Problem**

Save Model Parameters (torch.save)

## **Trigger**

Use this API to serialize and save learned model weight state dictionaries to disk.

## **Snippet**

`import pathlib`  
`import torch`  
`import torch.nn as nn`

`model = nn.Linear(10, 2)`  
`save_path = pathlib.Path("model_weights.pt")`

`torch.save(model.state_dict(), save_path)`  
`print(f"Saved state dict exists: {save_path.exists()}")`

`if save_path.exists():`  
    `save_path.unlink()`

## **Minimal Notes**

Always save model.state\_dict() rather than the Python model object to prevent coupling saved files to specific source code directory structures. Use .pt or .pth file extensions by convention.

## **Common Bug**

**Issue:** Loading saved weights fails with AttributeError or ModuleNotFoundError when moved to a different directory.

**Cause:** Saving the entire model instance (torch.save(model, path)) which relies on unpickling exact class paths.

**Quick Fix:** Save weight state dictionaries exclusively using torch.save(model.state\_dict(), path).

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.save.html](https://pytorch.org/docs/stable/generated/torch.save.html)

## **Problem**

Load Model Parameters (torch.load \+ load\_state\_dict)

## **Trigger**

Use this API to restore learned weight tensors from a saved state dictionary into an instantiated PyTorch model.

## **Snippet**

`import pathlib`  
`import torch`  
`import torch.nn as nn`

`model = nn.Linear(10, 2)`  
`save_path = pathlib.Path("model_weights.pt")`  
`torch.save(model.state_dict(), save_path)`

`new_model = nn.Linear(10, 2)`  
`state_dict = torch.load(save_path, weights_only=True)`  
`new_model.load_state_dict(state_dict)`

`print("Weights successfully loaded into model")`

`if save_path.exists():`  
    `save_path.unlink()`

## **Minimal Notes**

Pass weights\_only=True to torch.load to prevent arbitrary code execution during unpickling. Set strict=False in load\_state\_dict when performing partial weight loading for fine-tuning.

## **Common Bug**

**Issue:** RuntimeError: Key(s) in state\_dict do not match module keys during state loading.

**Cause:** Loading state dicts saved from a DataParallel model wrapper directly into an unwrapped module without prefix matching.

**Quick Fix:** Strip the module. key prefixes from the state dict dictionary before calling load\_state\_dict().

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.nn.Module.html\#torch.nn.Module.load\_state\_dict](https://www.google.com/search?q=https://pytorch.org/docs/stable/generated/torch.nn.Module.html%23torch.nn.Module.load_state_dict)

## **Problem**

Save Complete Training Checkpoint

## **Trigger**

Use this API to package model weights, optimizer states, epoch indices, and losses into a unified checkpoint artifact for training fault tolerance.

## **Snippet**

`import pathlib`  
`import torch`  
`import torch.nn as nn`

`model = nn.Linear(10, 2)`  
`optimizer = torch.optim.Adam(model.parameters(), lr=0.001)`  
`epoch = 5`  
`loss = 0.25`

`checkpoint = {`  
    `"epoch": epoch,`  
    `"model_state_dict": model.state_dict(),`  
    `"optimizer_state_dict": optimizer.state_dict(),`  
    `"loss": loss,`  
`}`

`save_path = pathlib.Path("checkpoint.pt")`  
`torch.save(checkpoint, save_path)`  
`print(f"Complete checkpoint saved to {save_path}")`

`if save_path.exists():`  
    `save_path.unlink()`

## **Minimal Notes**

Saving optimizer states preserves momentum buffers and adaptive learning rate metrics required for seamless training resumption. Bundle custom training variables like learning rate schedulers into the same dictionary.

## **Common Bug**

**Issue:** Loss spikes or learning rate restarts unexpectedly upon resuming training from a saved checkpoint.

**Cause:** Saving only model.state\_dict() without preserving optimizer.state\_dict().

**Quick Fix:** Save both model and optimizer state dictionaries within a dictionary structure.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.save.html](https://pytorch.org/docs/stable/generated/torch.save.html)

## **Problem**

Resume Training from Checkpoint

## **Trigger**

Use this API to restore model weights, optimizer states, and epoch counters from a saved checkpoint file to resume an interrupted training run.

## **Snippet**

`import pathlib`  
`import torch`  
`import torch.nn as nn`

`model = nn.Linear(10, 2)`  
`optimizer = torch.optim.Adam(model.parameters(), lr=0.001)`  
`save_path = pathlib.Path("checkpoint.pt")`

`torch.save({`  
    `"epoch": 5,`  
    `"model_state_dict": model.state_dict(),`  
    `"optimizer_state_dict": optimizer.state_dict(),`  
    `"loss": 0.25,`  
`}, save_path)`

`checkpoint = torch.load(save_path, weights_only=True)`  
`model.load_state_dict(checkpoint["model_state_dict"])`  
`optimizer.load_state_dict(checkpoint["optimizer_state_dict"])`  
`start_epoch = checkpoint["epoch"] + 1`

`print(f"Resuming training from epoch {start_epoch}")`

`if save_path.exists():`  
    `save_path.unlink()`

## **Minimal Notes**

Move the model to its target compute device before passing saved optimizer state tensors to optimizer.load\_state\_dict(). Use weights\_only=True in torch.load for safe deserialization.

## **Common Bug**

**Issue:** Device mismatch errors when restoring checkpoints across different CPU/GPU environments.

**Cause:** Optimizer state tensors remaining tied to original execution devices recorded during serialization.

**Quick Fix:** Place the model onto its target device prior to restoring optimizer state dicts, or supply map\_location to torch.load.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.load.html](https://pytorch.org/docs/stable/generated/torch.load.html)

## **Problem**

Initialize Xavier Weights (nn.init.xavier\_uniform\_ / xavier\_normal\_)

## **Trigger**

Use this API to apply Glorot/Xavier initialization to layer weight matrices associated with symmetric activation functions like Sigmoid or Tanh.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`class Model(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.fc = nn.Linear(10, 5)`  
        `self._init_weights()`

    `def _init_weights(self):`  
        `nn.init.xavier_uniform_(self.fc.weight, gain=nn.init.calculate_gain('tanh'))`  
        `if self.fc.bias is not None:`  
            `nn.init.zeros_(self.fc.bias)`

`model = Model()`  
`print(f"Weight std: {model.fc.weight.std().item():.4f}")`

## **Minimal Notes**

Designed for network layers using symmetric activation functions to maintain activation variance across layers. Initialization routines with trailing underscores operate in-place on input tensors.

## **Common Bug**

**Issue:** Poor training convergence when using Xavier initialization with ReLU activation layers.

**Cause:** Xavier initialization assumes zero-centered activations and underestimates variance for rectified units.

**Quick Fix:** Use Kaiming (He) initialization (nn.init.kaiming\_uniform\_) for network layers using ReLU or LeakyReLU activations.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/nn.init.html\#torch.nn.init.xavier\_uniform](https://www.google.com/search?q=https://pytorch.org/docs/stable/nn.init.html%23torch.nn.init.xavier_uniform)\_

## **Problem**

Initialize Kaiming Weights (nn.init.kaiming\_uniform\_ / kaiming\_normal\_)

## **Trigger**

Use this API to initialize layer weights preceding rectified activation functions like ReLU or LeakyReLU to prevent vanishing or exploding variance.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`class Model(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.conv = nn.Conv2d(3, 16, kernel_size=3)`  
        `self._init_weights()`

    `def _init_weights(self):`  
        `nn.init.kaiming_normal_(self.conv.weight, mode='fan_out', nonlinearity='relu')`  
        `if self.conv.bias is not None:`  
            `nn.init.zeros_(self.conv.bias)`

`model = Model()`  
`print(f"Conv weight std: {model.conv.weight.std().item():.4f}")`

## **Minimal Notes**

Set mode='fan\_in' to preserve activation variance during forward passes or mode='fan\_out' to preserve variance during backward passes. Match the nonlinearity argument to the specific layer activation.

## **Common Bug**

**Issue:** Incorrect scaling variance leading to early training instability when using LeakyReLU.

**Cause:** Failing to supply nonlinearity='leaky\_relu' or omitting the negative slope argument a.

**Quick Fix:** Pass nonlinearity='leaky\_relu' and the matching a parameter to kaiming\_normal\_.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/nn.init.html\#torch.nn.init.kaiming\_uniform](https://www.google.com/search?q=https://pytorch.org/docs/stable/nn.init.html%23torch.nn.init.kaiming_uniform)\_

## **Problem**

Initialize Constant Values (nn.init.constant\_ / zeros\_ / ones\_)

## **Trigger**

Use this API to set layer parameter tensors—such as bias vectors or normalization weights—to fixed scalar values, zeros, or ones.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`class Model(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.fc = nn.Linear(10, 5)`  
        `self._init_parameters()`

    `def _init_parameters(self):`  
        `nn.init.constant_(self.fc.bias, val=0.01)`  
        `nn.init.ones_(self.fc.weight)`

`model = Model()`  
`print(f"Bias value: {model.fc.bias[0].item():.2f}")`  
`print(f"Weight value: {model.fc.weight[0, 0].item():.2f}")`

## **Minimal Notes**

In-place parameter initialization functions modify parameter tensors directly without autograd history tracking. Constant initialization on weight matrices prevents symmetry breaking across neurons.

## **Common Bug**

**Issue:** Neurons in a hidden layer compute identical feature representations throughout training.

**Cause:** Initializing weight matrices with constant values, preventing network symmetry breaking.

**Quick Fix:** Apply constant initializations strictly to bias vectors or specialized normalizations, using random initializations for weight matrices.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/nn.init.html\#torch.nn.init.constant](https://www.google.com/search?q=https://pytorch.org/docs/stable/nn.init.html%23torch.nn.init.constant)\_

## **Problem**

Set Random Seed for Reproducibility (torch.manual\_seed)

## **Trigger**

Use this API to seed PyTorch CPU and CUDA random number generators to ensure reproducible weight initializations and execution outcomes.

## **Snippet**

`import random`  
`import numpy as np`  
`import torch`

`def set_seed(seed: int = 42) -> None:`  
    `random.seed(seed)`  
    `np.random.seed(seed)`  
    `torch.manual_seed(seed)`  
    `torch.cuda.manual_seed_all(seed)`

`set_seed(42)`  
`tensor_a = torch.randn(2, 2)`

`set_seed(42)`  
`tensor_b = torch.randn(2, 2)`

`print(f"Tensors match: {torch.equal(tensor_a, tensor_b)}")`

## **Minimal Notes**

torch.manual\_seed seeds random generators across both CPU and CUDA devices in PyTorch. Ensure Python built-in random and NumPy seeds are set simultaneously for global reproducibility.

## **Common Bug**

**Issue:** Multiprocess data loading or multi-GPU execution remains non-deterministic across independent runs.

**Cause:** Omitting torch.cuda.manual\_seed\_all() or failing to seed DataLoader worker processes via worker\_init\_fn.

**Quick Fix:** Call torch.cuda.manual\_seed\_all(seed) and pass a seed initialization function to DataLoader's worker\_init\_fn.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.manual\_seed.html](https://pytorch.org/docs/stable/generated/torch.manual_seed.html)

## **Problem**

Enable Deterministic Algorithms (torch.use\_deterministic\_algorithms)

## **Trigger**

Use this API to enforce deterministic operation execution across CUDA backends for strict bitwise run-to-run reproducibility.

## **Snippet**

`import torch`

`torch.manual_seed(42)`  
`torch.use_deterministic_algorithms(True)`  
`torch.backends.cudnn.deterministic = True`  
`torch.backends.cudnn.benchmark = False`

`x = torch.randn(4, 4)`  
`y = torch.matmul(x, x)`  
`print(f"Deterministic mode enabled: {torch.are_deterministic_algorithms_enabled()}")`

## **Minimal Notes**

Enforcing deterministic algorithms can cause runtime errors for operations that lack deterministic GPU kernel variants unless warn\_only=True is provided. Deterministic operations may reduce performance.

## **Common Bug**

**Issue:** RuntimeError: ... does not have a deterministic implementation aborts execution during backward passes.

**Cause:** Executing CUDA operations (such as non-deterministic scatter/gather operations) under strict deterministic enforcement.

**Quick Fix:** Pass warn\_only=True to torch.use\_deterministic\_algorithms(True, warn\_only=True).

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.use\_deterministic\_algorithms.html](https://pytorch.org/docs/stable/generated/torch.use_deterministic_algorithms.html)

## **Problem**

Profile PyTorch Code (torch.profiler.profile)

## **Trigger**

Use this API to measure execution timelines, operation durations, and memory consumption across CPU and CUDA backends.

## **Snippet**

`import torch`  
`import torch.nn as nn`  
`from torch.profiler import profile, ProfilerActivity`

`model = nn.Linear(100, 10)`  
`x = torch.randn(16, 100)`

`with profile(`  
    `activities=[ProfilerActivity.CPU],`  
    `record_shapes=True,`  
    `profile_memory=True`  
`) as prof:`  
    `model(x)`

`print(prof.key_averages().table(sort_by="cpu_time_total", row_limit=5))`

## **Minimal Notes**

Profiling adds execution overhead and memory footprint, so scope profiling context blocks to limited step ranges. Include ProfilerActivity.CUDA when profiling GPU execution.

## **Common Bug**

**Issue:** Profiler tables display zero or unexpectedly small GPU kernel execution durations.

**Cause:** Omitting ProfilerActivity.CUDA from the activities list, capturing CPU dispatch calls while ignoring asynchronous GPU kernel completion.

**Quick Fix:** Include ProfilerActivity.CUDA in the activities argument array when profiling GPU operations.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/profiler.html\#torch.profiler.profile](https://www.google.com/search?q=https://pytorch.org/docs/stable/profiler.html%23torch.profiler.profile)

## **Problem**

Record Execution Regions (torch.profiler.record\_function)

## **Trigger**

Use this API to tag custom code blocks with descriptive labels inside PyTorch profiler execution traces.

## **Snippet**

`import torch`  
`import torch.nn as nn`  
`from torch.profiler import profile, ProfilerActivity, record_function`

`model = nn.Linear(10, 2)`  
`x = torch.randn(4, 10)`

`with profile(activities=[ProfilerActivity.CPU]) as prof:`  
    `with record_function("custom_preprocessing"):`  
        `x_norm = x / x.norm(dim=1, keepdim=True)`

    `with record_function("model_forward"):`  
        `out = model(x_norm)`

`print(prof.key_averages().table(sort_by="cpu_time_total", row_limit=5))`

## **Minimal Notes**

record\_function attaches labelled blocks to profiler tables and trace visualizers. It has negligible execution overhead when the profiler is active and zero overhead when profiling is inactive.

## **Common Bug**

**Issue:** Custom record\_function labels fail to appear in summary profiler output tables.

**Cause:** Executing record\_function blocks outside an active torch.profiler.profile context manager.

**Quick Fix:** Nest record\_function context blocks directly inside an active with profile(...) block.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/profiler.html\#torch.profiler.record\_function](https://www.google.com/search?q=https://pytorch.org/docs/stable/profiler.html%23torch.profiler.record_function)

## **Problem**

Register Forward Hook (register\_forward\_hook)

## **Trigger**

Use this API to inspect, log, or extract intermediate layer feature maps produced during a module's forward pass.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`model = nn.Sequential(`  
    `nn.Linear(10, 5),`  
    `nn.ReLU(),`  
    `nn.Linear(5, 2)`  
`)`

`activations = {}`

`def hook_fn(module, input, output):`  
    `activations["layer_1"] = output.detach()`

`handle = model[0].register_forward_hook(hook_fn)`

`x = torch.randn(2, 10)`  
`out = model(x)`

`print(f"Captured layer output shape: {activations['layer_1'].shape}")`  
`handle.remove()`

## **Minimal Notes**

Forward hooks execute immediately after module.forward() evaluates its output. Call handle.remove() when the hook is no longer required to prevent memory leaks from retained module references.

## **Common Bug**

**Issue:** Memory consumption accumulates across training iterations when recording layer outputs.

**Cause:** Saving output tensors directly inside hook callbacks without calling .detach(), retaining computation graph references.

**Quick Fix:** Call .detach() or .clone() on tensor arguments captured within forward hook callbacks.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.nn.Module.html\#torch.nn.Module.register\_forward\_hook](https://www.google.com/search?q=https://pytorch.org/docs/stable/generated/torch.nn.Module.html%23torch.nn.Module.register_forward_hook)

## **Problem**

Register Forward Pre-Hook (register\_forward\_pre\_hook)

## **Trigger**

Use this API to inspect or modify module inputs immediately before module.forward() executes.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`model = nn.Linear(10, 2)`

`def pre_hook_fn(module, args):`  
    `x = args[0]`  
    `return (x * 2.0,)`

`handle = model.register_forward_pre_hook(pre_hook_fn)`

`x = torch.ones(1, 10)`  
`out = model(x)`

`print(f"Output shape after modified input: {out.shape}")`  
`handle.remove()`

## **Minimal Notes**

Pre-hooks receive module inputs formatted as a tuple and may optionally return modified inputs as a tuple. Returned tuples must match the signature expected by the module's forward implementation.

## **Common Bug**

**Issue:** TypeError or argument unpacking errors inside module forward execution after mutating inputs in a pre-hook.

**Cause:** Returning a standalone tensor instead of a tuple from the forward pre-hook function.

**Quick Fix:** Return modified inputs explicitly wrapped inside a tuple (e.g., return (modified\_x,)).

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.nn.Module.html\#torch.nn.Module.register\_forward\_pre\_hook](https://www.google.com/search?q=https://pytorch.org/docs/stable/generated/torch.nn.Module.html%23torch.nn.Module.register_forward_pre_hook)

## **Problem**

Register Full Backward Hook (register\_full\_backward\_hook)

## **Trigger**

Use this API to inspect or alter parameter and input gradient tensors computed during backward pass execution.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`model = nn.Linear(10, 2)`

`def backward_hook_fn(module, grad_input, grad_output):`  
    `print(f"Grad output shape: {grad_output[0].shape}")`  
    `print(f"Grad input shape: {grad_input[0].shape}")`

`handle = model.register_full_backward_hook(backward_hook_fn)`

`x = torch.randn(2, 10, requires_grad=True)`  
`out = model(x)`  
`loss = out.sum()`  
`loss.backward()`

`handle.remove()`

## **Minimal Notes**

Use register\_full\_backward\_hook instead of legacy register\_backward\_hook APIs. Hook parameters grad\_input and grad\_output are provided as tuples corresponding to layer inputs and outputs.

## **Common Bug**

**Issue:** RuntimeError or unintended behavior when inspecting gradients across complex layer architectures.

**Cause:** Using the deprecated register\_backward\_hook function, which exhibits buggy behavior on multi-input/output modules.

**Quick Fix:** Replace legacy backward hooks with register\_full\_backward\_hook.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.nn.Module.html\#torch.nn.Module.register\_full\_backward\_hook](https://www.google.com/search?q=https://pytorch.org/docs/stable/generated/torch.nn.Module.html%23torch.nn.Module.register_full_backward_hook)

---

