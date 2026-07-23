# **PyTorch Export & Deployment Cheatsheet**

## **Problem**

Compile Model for Optimized Execution (torch.compile)

## **Trigger**

I need to accelerate PyTorch model execution in production with JIT compilation.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`class MyModel(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.linear = nn.Linear(10, 5)`

    `def forward(self, x):`  
        `return self.linear(x)`

`model = MyModel()`  
`compiled_model = torch.compile(model)`  
`x = torch.randn(2, 10)`  
`output = compiled_model(x)`

## **Minimal Notes**

torch.compile optimizes model graphs using TorchDynamo to capture graphs and generate optimized kernels. The first forward pass incurs a compilation warm-up overhead, but subsequent executions run significantly faster.

## **Common Bug**

**Issue:** High initial latency or temporary freezing during the first forward pass.

**Cause:** PyTorch JIT compiles model graphs on the first forward invocation.

**Quick Fix:** Run a warm-up forward pass with dummy inputs during service initialization before exposing the model to live traffic.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.compile.html](https://pytorch.org/docs/stable/generated/torch.compile.html)

## **Problem**

Configure Compilation Backend (backend)

## **Trigger**

I need to select a specific compiler backend like Inductor or TensorRT for custom target hardware execution.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`class MyModel(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.fc = nn.Linear(10, 5)`

    `def forward(self, x):`  
        `return self.fc(x)`

`model = MyModel()`  
`compiled_model = torch.compile(model, backend="inductor")`  
`x = torch.randn(4, 10)`  
`output = compiled_model(x)`

## **Minimal Notes**

The default inductor backend targets Triton for NVIDIA/AMD GPUs and C++/OpenMP for CPUs. Alternative backends such as aot\_eager or cudagraphs offer different trade-offs between compilation time and execution speed.

## **Common Bug**

**Issue:** BackendNotSupportedError or build failure when selecting specialized backends.

**Cause:** Required system dependencies or third-party compiler toolchains (such as Triton or TensorRT) are missing from the environment.

**Quick Fix:** Install the missing compiler libraries or fall back to supported backends like backend="inductor" or backend="aot\_eager".

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.compile.html](https://pytorch.org/docs/stable/generated/torch.compile.html)

## **Problem**

Configure Compilation Mode (mode)

## **Trigger**

I need to balance compilation time against runtime execution speed or memory overhead during deployment.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`class MyModel(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.conv = nn.Conv2d(3, 16, kernel_size=3)`

    `def forward(self, x):`  
        `return self.conv(x)`

`model = MyModel()`  
`compiled_model = torch.compile(model, mode="max-autotune")`  
`x = torch.randn(1, 3, 32, 32)`  
`output = compiled_model(x)`

## **Minimal Notes**

mode="default" provides balanced compilation, mode="reduce-overhead" uses CUDA graphs to minimize Python invocation overhead, and mode="max-autotune" generates the fastest kernels at the cost of prolonged compile times. Use reduce-overhead for small batch latency-critical workloads.

## **Common Bug**

**Issue:** Out-of-memory (OOM) errors during inference when using mode="reduce-overhead".

**Cause:** CUDA graphs allocate static memory buffers that remain reserved throughout the runtime lifecycle.

**Quick Fix:** Use mode="default" or mode="max-autotune" if memory capacity is tightly constrained.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.compile.html](https://pytorch.org/docs/stable/generated/torch.compile.html)

## **Problem**

Export Computation Graph (torch.export.export)

## **Trigger**

I need a clean, framework-agnostic IR graph representation of my model for non-Python or C++ deployment runtimes.

## **Snippet**

`import torch`  
`import torch.nn as nn`  
`from torch.export import export`

`class MyModel(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.fc = nn.Linear(8, 4)`

    `def forward(self, x):`  
        `return self.fc(x)`

`model = MyModel().eval()`  
`example_inputs = (torch.randn(1, 8),)`  
`exported_program = export(model, example_inputs)`

## **Minimal Notes**

torch.export.export extracts a sound ExportedProgram computational graph with explicit input and output schemas. Unlike torch.compile, it generates a portable artifact meant to run independently outside Python runtime environments.

## **Common Bug**

**Issue:** UserError stating graph capture failed due to dynamic control flow or un-guardable side effects.

**Cause:** The model contains standard Python control flow statements dependent on concrete tensor values (such as if x.item() \> 0:).

**Quick Fix:** Refactor dynamic conditional logic using torch.cond or avoid unwrapping scalar tensor values during graph capture.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/export.html](https://pytorch.org/docs/stable/export.html)

## **Problem**

Save and Load ExportedProgram (torch.export.save / torch.export.load)

## **Trigger**

I need to serialize an exported PyTorch computation graph to disk and reload it in a separate production process.

## **Snippet**

`import torch`  
`import torch.nn as nn`  
`from torch.export import export, save, load`

`class MyModel(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.fc = nn.Linear(4, 2)`

    `def forward(self, x):`  
        `return self.fc(x)`

`model = MyModel().eval()`  
`example_inputs = (torch.randn(1, 4),)`  
`exported_program = export(model, example_inputs)`

`save(exported_program, "model.pt2")`  
`loaded_program = load("model.pt2")`  
`output = loaded_program.module()(example_inputs[0])`

## **Minimal Notes**

torch.export.save and torch.export.load operate on .pt2 binary archives containing graph structure, weights, and extra metadata. Loaded artifacts do not require the original model source code to run inference.

## **Common Bug**

**Issue:** TypeError or execution error when invoking the loaded object directly.

**Cause:** Calling loaded\_program(x) directly instead of accessing the callable graph via loaded\_program.module().

**Quick Fix:** Pass input tensors to loaded\_program.module()(\*inputs).

## **Official Documentation URL**

[https://pytorch.org/docs/stable/export.html\#saving-and-loading-an-exportedprogram](https://www.google.com/search?q=https://pytorch.org/docs/stable/export.html%23saving-and-loading-an-exportedprogram)

## **Problem**

Script a Model (torch.jit.script)

## **Trigger**

I need to convert Python control flow (loops, branches) into a TorchScript module for deployment without Python.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`class DynamicModel(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.fc = nn.Linear(5, 5)`

    `def forward(self, x):`  
        `if x.sum() > 0:`  
            `return self.fc(x)`  
        `return x`

`model = DynamicModel().eval()`  
`scripted_model = torch.jit.script(model)`  
`output = scripted_model(torch.randn(1, 5))`

## **Minimal Notes**

torch.jit.script parses Python source code AST to preserve conditional statements and dynamic loops in TorchScript IR. It allows model execution in C++ LibTorch runtimes without tracing sample execution paths.

## **Common Bug**

**Issue:** TorchScriptTypeInferenceError during the scripting step.

**Cause:** Untyped variables or dynamic Python collections used inside the module methods.

**Quick Fix:** Add explicit Python type hints (such as x: torch.Tensor or List\[torch.Tensor\]) to all class method signatures.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.jit.script.html](https://www.google.com/search?q=https://pytorch.org/docs/stable/generated/torch.jit.script.html)

## **Problem**

Trace a Model (torch.jit.trace)

## **Trigger**

I need to convert a model without dynamic control flow into TorchScript by recording sample inputs.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`class StaticModel(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.fc = nn.Linear(10, 2)`

    `def forward(self, x):`  
        `return self.fc(x)`

`model = StaticModel().eval()`  
`example_input = torch.randn(1, 10)`  
`traced_model = torch.jit.trace(model, example_input)`  
`output = traced_model(example_input)`

## **Minimal Notes**

torch.jit.trace runs sample inputs through the model and records every executed operation. Dynamic control flow statements (like if statements) are hardcoded into whichever path was taken during the single trace run.

## **Common Bug**

**Issue:** Silent execution errors or incorrect output values when input branching conditions change during inference.

**Cause:** Tracing flattens conditional logic based entirely on the example inputs provided during recording.

**Quick Fix:** Use torch.jit.script instead of torch.jit.trace if your model relies on input-dependent conditional logic.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.jit.trace.html](https://www.google.com/search?q=https://pytorch.org/docs/stable/generated/torch.jit.trace.html)

## **Problem**

Save and Load TorchScript Model (torch.jit.save / torch.jit.load)

## **Trigger**

I need to save a scripted or traced model to disk and reload it in Python or C++ runtime environments.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`class MyModel(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.fc = nn.Linear(4, 2)`

    `def forward(self, x):`  
        `return self.fc(x)`

`model = torch.jit.script(MyModel().eval())`  
`torch.jit.save(model, "model.pt")`

`loaded_model = torch.jit.load("model.pt")`  
`output = loaded_model(torch.randn(1, 4))`

## **Minimal Notes**

TorchScript .pt archives contain bytecode, network parameters, and class definitions bundled together. They can be executed in C++ using LibTorch without importing Python libraries or source code files.

## **Common Bug**

**Issue:** RuntimeError: Expected all tensors to be on the same device when invoking the loaded module.

**Cause:** The loaded TorchScript module and input tensors reside on different target hardware devices (such as CPU vs CUDA).

**Quick Fix:** Explicitly transfer the loaded model to the target device using loaded\_model.to("cuda").

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.jit.save.html](https://www.google.com/search?q=https://pytorch.org/docs/stable/generated/torch.jit.save.html)

## **Problem**

Export Model to ONNX (torch.onnx.export)

## **Trigger**

I need to convert a PyTorch model into ONNX format for deployment with TensorRT, ONNX Runtime, or OpenVINO.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`class MyModel(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.fc = nn.Linear(10, 5)`

    `def forward(self, x):`  
        `return self.fc(x)`

`model = MyModel().eval()`  
`dummy_input = torch.randn(1, 10)`

`torch.onnx.export(`  
    `model,`  
    `dummy_input,`  
    `"model.onnx",`  
    `input_names=["input"],`  
    `output_names=["output"],`  
    `opset_version=17`  
`)`

## **Minimal Notes**

torch.onnx.export builds an ONNX computational graph by tracing sample inputs or parsing graph representations. Explicitly declare opset\_version (such as 17 or higher) to ensure operator compatibility with downstream target runtimes.

## **Common Bug**

**Issue:** Unsupported ONNX opset version or missing operator conversion errors.

**Cause:** The model utilizes newer PyTorch ops that are absent in default or legacy ONNX opset versions.

**Quick Fix:** Set opset\_version=17 or higher in torch.onnx.export.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/onnx.html](https://pytorch.org/docs/stable/onnx.html)

## **Problem**

Configure Dynamic Shapes for ONNX Export

## **Trigger**

I need an exported ONNX model to accept variable batch sizes or sequence lengths at inference time.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`class MyModel(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.fc = nn.Linear(10, 5)`

    `def forward(self, x):`  
        `return self.fc(x)`

`model = MyModel().eval()`  
`dummy_input = torch.randn(1, 10)`

`dynamic_axes = {`  
    `"input": {0: "batch_size"},`  
    `"output": {0: "batch_size"}`  
`}`

`torch.onnx.export(`  
    `model,`  
    `dummy_input,`  
    `"dynamic_model.onnx",`  
    `input_names=["input"],`  
    `output_names=["output"],`  
    `dynamic_axes=dynamic_axes,`  
    `opset_version=17`  
`)`

## **Minimal Notes**

Providing dynamic\_axes explicitly designates specific tensor dimensions as dynamic variables instead of fixed integers. This allows ONNX engines to accept inputs with dynamic shape dimensions without throwing shape mismatch exceptions.

## **Common Bug**

**Issue:** ONNX Runtime throws invalid shape errors when passing batch sizes different from the dummy input.

**Cause:** Non-specified dynamic dimensions default to static shapes captured during the export trace pass.

**Quick Fix:** Declare all variable dimensions (such as batch size or sequence length) inside the dynamic\_axes mapping dictionary.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/onnx.html\#dynamic-axes](https://www.google.com/search?q=https://pytorch.org/docs/stable/onnx.html%23dynamic-axes)

## **Problem**

Save Model Weights (torch.save \+ state\_dict)

## **Trigger**

I need to save model parameters safely without locking the saved file to exact Python class definitions.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`class MyModel(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.fc = nn.Linear(10, 2)`

    `def forward(self, x):`  
        `return self.fc(x)`

`model = MyModel()`  
`torch.save(model.state_dict(), "model_weights.pt")`

## **Minimal Notes**

model.state\_dict() returns a Python dictionary mapping layer names to their corresponding weight and bias tensors. Saving parameter dictionaries is the official recommended practice over saving full class instances directly.

## **Common Bug**

**Issue:** AttributeError or ModuleNotFoundError when deserializing a model saved using torch.save(model).

**Cause:** Direct module serialization relies on exact Python class paths, module directory structures, and pickle definitions.

**Quick Fix:** Save weight dictionaries using torch.save(model.state\_dict(), path) rather than serializing whole objects.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.save.html](https://pytorch.org/docs/stable/generated/torch.save.html)

## **Problem**

Load Model Weights (torch.load \+ load\_state\_dict)

## **Trigger**

I need to load a saved weight dictionary into an instantiated model architecture.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`class MyModel(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.fc = nn.Linear(10, 2)`

    `def forward(self, x):`  
        `return self.fc(x)`

`model = MyModel()`  
`state_dict = torch.load("model_weights.pt", weights_only=True)`  
`model.load_state_dict(state_dict)`

## **Minimal Notes**

Always set weights\_only=True in torch.load to guard against arbitrary code execution security risks. The model structure must be instantiated before populating parameter tensors via load\_state\_dict().

## **Common Bug**

**Issue:** Missing key(s) in state\_dict or Unexpected key(s) error upon calling load\_state\_dict().

**Cause:** Key name mismatches, often occurring when saving wrapped DataParallel or DistributedDataParallel models (which prepend a module. prefix).

**Quick Fix:** Strip the module. prefix from state dictionary key names or save using model.module.state\_dict().

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.nn.Module.html\#torch.nn.Module.load\_state\_dict](https://www.google.com/search?q=https://pytorch.org/docs/stable/generated/torch.nn.Module.html%23torch.nn.Module.load_state_dict)

## **Problem**

Save and Load Training Checkpoint

## **Trigger**

I need to save and restore complete training progress including model parameters, optimizer states, loss, and epoch count.

## **Snippet**

`import torch`  
`import torch.nn as nn`  
`import torch.optim as optim`

`model = nn.Linear(10, 2)`  
`optimizer = optim.Adam(model.parameters(), lr=0.001)`

`# Save checkpoint`  
`checkpoint = {`  
    `"epoch": 10,`  
    `"model_state_dict": model.state_dict(),`  
    `"optimizer_state_dict": optimizer.state_dict(),`  
    `"loss": 0.15,`  
`}`  
`torch.save(checkpoint, "checkpoint.pt")`

`# Load checkpoint`  
`checkpoint = torch.load("checkpoint.pt", weights_only=True)`  
`model.load_state_dict(checkpoint["model_state_dict"])`  
`optimizer.load_state_dict(checkpoint["optimizer_state_dict"])`  
`epoch = checkpoint["epoch"]`

## **Minimal Notes**

Checkpoints capture state dictionaries across multiple training components inside a single structure. Preserving optimizer states preserves momentum and learning rate scheduling states upon resuming execution.

## **Common Bug**

**Issue:** Training behaves erratically or resets learning rate momentum after restoring a checkpoint.

**Cause:** Only saving model.state\_dict() while omitting optimizer.state\_dict().

**Quick Fix:** Store and load both model.state\_dict() and optimizer.state\_dict() in the dictionary payload.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/notes/serialization.html\#saving-loading-a-general-checkpoint-for-inference-or-resuming-training](https://www.google.com/search?q=https://pytorch.org/docs/stable/notes/serialization.html%23saving-loading-a-general-checkpoint-for-inference-or-resuming-training)

## **Problem**

Enable Inference Mode (torch.inference\_mode)

## **Trigger**

I need maximum inference performance and minimal memory usage by disabling autograd and view tracking overhead.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`class MyModel(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.fc = nn.Linear(10, 2)`

    `def forward(self, x):`  
        `return self.fc(x)`

`model = MyModel().eval()`  
`x = torch.randn(1, 10)`

`with torch.inference_mode():`  
    `output = model(x)`

## **Minimal Notes**

torch.inference\_mode completely disables autograd tracking, tensor version counters, and graph bookkeeping. It yields superior execution efficiency compared to torch.no\_grad().

## **Common Bug**

**Issue:** RuntimeError: Inference tensors do not track version counter when performing in-place mutations outside the block.

**Cause:** Tensors produced inside inference\_mode cannot be mutated in-place outside of the active inference context block.

**Quick Fix:** Avoid applying in-place modifications to tensors created within a torch.inference\_mode() context.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.inference\_mode.html](https://www.google.com/search?q=https://pytorch.org/docs/stable/generated/torch.inference_mode.html)

## **Problem**

Optimize Model for Inference (model.eval)

## **Trigger**

I need to configure non-deterministic layers like Dropout and BatchNorm into deterministic evaluation mode.

## **Snippet**

`import torch`  
`import torch.nn as nn`

`class Classifier(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.drop = nn.Dropout(0.5)`  
        `self.bn = nn.BatchNorm1d(10)`  
        `self.fc = nn.Linear(10, 2)`

    `def forward(self, x):`  
        `return self.fc(self.drop(self.bn(x)))`

`model = Classifier()`  
`model.eval()`

`x = torch.randn(4, 10)`  
`output = model(x)`

## **Minimal Notes**

model.eval() disables random element dropping in Dropout layers and forces BatchNorm layers to use frozen running statistics. It does not turn off gradient computation—use torch.inference\_mode() alongside it.

## **Common Bug**

**Issue:** Inconsistent or non-deterministic inference predictions across identical evaluation inputs.

**Cause:** Forgetting to invoke model.eval() leaves Dropout layers active during inference passes.

**Quick Fix:** Always explicitly execute model.eval() prior to running inference or exporting models.

## **Official Documentation URL**

[https://pytorch.org/docs/stable/generated/torch.nn.Module.html\#torch.nn.Module.eval](https://www.google.com/search?q=https://pytorch.org/docs/stable/generated/torch.nn.Module.html%23torch.nn.Module.eval)

## **Problem**

Package Model for TorchServe (torch-model-archiver)

## **Trigger**

I need to bundle model weights, custom handler logic, and architecture definitions into a deployable .mar file.

## **Snippet**

`torch-model-archiver \`  
  `--model-name my_model \`  
  `--version 1.0 \`  
  `--serialized-file model_weights.pt \`  
  `--model-file model.py \`  
  `--handler image_classifier \`  
  `--export-path model_store`

## **Minimal Notes**

The torch-model-archiver CLI packages serialized weights, Python model definitions, and pre/post-processing handlers into a .mar model archive. Output archives are saved directly into the target \--export-path directory.

## **Common Bug**

**Issue:** TorchServe fails to load the archive with ModuleNotFoundError during server startup.

**Cause:** Custom Python dependencies or submodules referenced in model.py were not included in the archiver command.

**Quick Fix:** Pass additional helper scripts or custom Python dependencies using \--extra-files path/to/helpers.py.

## **Official Documentation URL**

[https://pytorch.org/serve/model\_archiver.html](https://www.google.com/search?q=https://pytorch.org/serve/model_archiver.html)

## **Problem**

Serve Model with TorchServe

## **Trigger**

I need to launch a production TorchServe instance with inference and management HTTP endpoints.

## **Snippet**

`torchserve \`  
  `--start \`  
  `--model-store model_store \`  
  `--models my_model=my_model.mar \`  
  `--ncs`

## **Minimal Notes**

torchserve initializes worker processes to handle prediction requests on port 8080 and management REST APIs on port 8081\. The \--ncs flag disables snapshot creation to minimize filesystem overhead during lightweight deployments.

## **Common Bug**

**Issue:** Address already in use error during TorchServe initialization.

**Cause:** Default HTTP ports (8080, 8081, or 8082\) are occupied by other running processes on the host machine.

**Quick Fix:** Define custom port numbers in a config.properties file or terminate the conflicting processes occupying those ports.

## **Official Documentation URL**

[https://pytorch.org/serve/getting\_started.html](https://pytorch.org/serve/getting_started.html)

---

