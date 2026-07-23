# **PyTorch Model Export and Deployment**

# **09\_export.md**

## **Task**

Compile Models with torch.compile

## **Problem Solved**

Speeds up PyTorch model inference and training execution without requiring model architecture rewrites by compiling PyTorch code into optimized C++ or Triton kernels using TorchDynamo and Inductor.

## **Mental Trigger**

I want to accelerate my PyTorch 2.x model execution on GPU or CPU using a single decorator or wrapper function.

## **Syntax**

`torch.compile(`  
    `model=None,`  
    `*,`  
    `fullgraph=False,`  
    `dynamic=None,`  
    `backend="inductor",`  
    `mode=None,`  
    `options=None,`  
    `disable=False`  
`)`

## **Important Parameters**

> * **model** (Callable or nn.Module): The PyTorch module or function to compile.  
> * **fullgraph** (bool): If True, requires the model to compile into a single unified graph with zero graph breaks; throws an error if Python control flow causes a split.  
> * **dynamic** (bool or None): Enables or disables dynamic shape tracking. If None, automatically detects dynamic dimensions when shape changes occur.  
> * **backend** (str or Callable): Specifies the compilation backend. Default is "inductor", which generates fast C++/Triton kernels.  
> * **mode** (str or None): Preset optimization targets such as "default", "reduce-overhead", or "max-autotune".

## **Return Value**

Returns an OptimizedModule instance that wraps the original module and transparently compiles graphs during execution.

## **Example**

`import torch`  
`import torch.nn as nn`

`class ToyModel(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.fc1 = nn.Linear(10, 20)`  
        `self.relu = nn.ReLU()`  
        `self.fc2 = nn.Linear(20, 5)`

    `def forward(self, x):`  
        `return self.fc2(self.relu(self.fc1(x)))`

`model = ToyModel().eval()`  
`x = torch.randn(2, 10)`

`compiled_model = torch.compile(model)`

`with torch.inference_mode():`  
    `output = compiled_model(x)`

`print("Output shape:", output.shape)`

## **Use When**

> * Deploying PyTorch 2.x models in Python environments where high throughput and low execution latency are needed.  
> * Training large deep learning models where kernel fusion reduces memory bandwidth pressure.  
> * Eliminating Python interpreter overhead in complex network loops.

## **Avoid When**

> * Deploying into non-Python environments like C++ bare-metal binaries or edge embedded devices without Python runtimes (use torch.export or ONNX instead).  
> * Executing rapid single-pass interactive scripts where compilation overhead outweighs runtime savings.

## **Gotchas**

> * Cold-start latency occurs during the first forward pass while Triton or C++ compilation takes place.  
> * Graph breaks happen when code encounters unsupported Python constructs, printing warnings and falling back to eager evaluation.  
> * Re-compilations trigger if input shapes change unpredictably and dynamic is set to False.  
> * CUDA memory usage temporarily spikes during graph generation and autotuning passes.

## **Performance Notes**

> * mode="max-autotune" provides maximum latency reduction but increases initial warm-up compile time substantially.  
> * Kernel fusion combines multiple element-wise operations into single GPU kernels, dramatically saving DRAM bandwidth.

## **Related APIs**

> * torch.export.export  
> * torch.jit.trace  
> * torch.inference\_mode

## **Framework Migration Notes**

When migrating from TensorFlow tf.function or JAX jax.jit, torch.compile provides similar execution tracing and kernel fusion. Unlike older PyTorch tracing, it seamlessly falls back to Python when non-traceable constructs appear rather than crashing or silently failing.

## **TensorFlow Equivalent**

`torch.compile → tf.function (approximate)`

## **Version Compatibility**

Introduced in PyTorch 2.0. In PyTorch 2.1+, dynamic shape support and Triton kernel codegen stability were significantly improved.

## **Search Metadata**

> * **Aliases**: torch.compile, TorchDynamo, TorchInductor  
> * **Common Search Terms**: PyTorch 2.0 compile, speed up model inference, fuse kernels PyTorch  
> * **Keywords**: compile, inductor, dynamo, JIT, graph fusion  
> * **Frequently Confused With**: torch.compile vs torch.jit.script, torch.compile vs torch.export

## **Related Models**

resnet, vit, transformer, yolo, bert, roberta, t5, gpt, llama

## **Related Patterns**

device-placement, mixed-precision

## **Related Workflows**

image-classification-pipeline, production-llm-cost-latency-optimization

## **Related Cheatsheet**

deployment

## **Related Decision Guides**

precision-tradeoffs-guide, hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.compile.html](https://pytorch.org/docs/stable/generated/torch.compile.html)

## **Task**

Configure Compilation Backends and Modes (backend, mode, dynamic, fullgraph)

## **Problem Solved**

Allows precise control over PyTorch compilation strategies to balance initial compile-time latency, runtime memory consumption, and dynamic batch execution across different deployment hardware.

## **Mental Trigger**

I need to configure torch.compile to optimize latency versus memory or handle dynamic batch sizes without triggering repeated re-compilations.

## **Syntax**

`torch.compile(`  
    `model,`  
    `backend="inductor",`  
    `mode="default",`  
    `dynamic=True,`  
    `fullgraph=False,`  
    `options=None`  
`)`

## **Important Parameters**

> * **backend** (str): Target execution backend (for example, "inductor", "aot\_eager", "cudagraphs", or "onnxrt").  
> * **mode** (str): Tuning presets ("default", "reduce-overhead", "max-autotune", or "max-autotune-no-cudagraphs").  
> * **dynamic** (bool): Forces dynamic shape tracing to prevent re-compilation when tensor dimensions change across batches.  
> * **fullgraph** (bool): Raises an error if any graph break occurs, ensuring the graph is completely captured.  
> * **options** (dict): Backend-specific key-value flags passed directly to Inductor or compiler backends.

## **Return Value**

An OptimizedModule configured with specified backend compilation passes and graph capture constraints.

## **Example**

`import torch`  
`import torch.nn as nn`

`class ConvNet(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.conv = nn.Conv2d(3, 16, 3, padding=1)`  
        `self.bn = nn.BatchNorm2d(16)`  
        `self.relu = nn.ReLU()`

    `def forward(self, x):`  
        `return self.relu(self.bn(self.conv(x)))`

`model = ConvNet().eval()`

`compiled_model = torch.compile(`  
    `model,`  
    `backend="inductor",`  
    `mode="max-autotune",`  
    `dynamic=True,`  
    `fullgraph=False`  
`)`

`x = torch.randn(4, 3, 32, 32)`  
`with torch.inference_mode():`  
    `out = compiled_model(x)`

`print("Compiled inference successful, output shape:", out.shape)`

## **Use When**

> * Handling real-world production serving pipelines where input batch sizes or token lengths vary per request.  
> * Eliminating framework overhead in small model inference using CUDA Graphs via mode="reduce-overhead".  
> * Benchmarking ceiling throughput across different hardware targets.

## **Avoid When**

> * Prototyping model architectures interactively where fast feedback loops are required.  
> * Running on resource-constrained host machines with limited CPU RAM for autotuning.

## **Gotchas**

> * mode="reduce-overhead" uses CUDA Graphs, which requires static memory allocation and can cause high GPU memory footprint.  
> * Setting fullgraph=True on models containing third-party library calls or unsupported Python features will throw UserError.  
> * Extreme autotuning (max-autotune) can significantly lengthen deployment build times.

## **Performance Notes**

> * dynamic=True trades off a small amount of static shape optimization quality to avoid runtime re-compilation penalties when input shapes fluctuate.  
> * CUDA Graph modes eliminate CPU launcher latency completely, yielding massive speedups for small batch sizes.

## **Related APIs**

> * torch.compile  
> * torch.\_dynamo.list\_backends

## **Framework Migration Notes**

mode="reduce-overhead" in PyTorch functions similarly to XLA compilation modes in TensorFlow where CPU launch overhead is removed by building static execution schedules.

## **TensorFlow Equivalent**

`torch.compile(..., mode="max-autotune") → tf.function(experimental_compile=True)`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: Inductor modes, dynamic compilation, fullgraph compilation  
> * **Common Search Terms**: torch.compile dynamic shapes, reduce-overhead torch.compile, fullgraph PyTorch  
> * **Keywords**: inductor, backend, mode, dynamic, fullgraph, cudagraphs  
> * **Frequently Confused With**: dynamic=True vs static shape exports

## **Related Models**

resnet, vit, yolo, bert, llama, deepseek

## **Related Patterns**

device-placement, mixed-precision, kv-cache

## **Related Workflows**

image-classification-pipeline, production-llm-cost-latency-optimization

## **Related Cheatsheet**

deployment

## **Related Decision Guides**

precision-tradeoffs-guide, hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.compile.html](https://pytorch.org/docs/stable/generated/torch.compile.html)

## **Task**

Export Stable Graphs with torch.export.export

## **Problem Solved**

Captures a fully traced, hardware-agnostic intermediate representation (ExportedProgram) of a PyTorch model for out-of-Python deployment in C++ or mobile runtimes.

## **Mental Trigger**

I need a clean graph export of my model with guaranteed dynamic shapes for export to C++, mobile, or edge environments.

## **Syntax**

`torch.export.export(`  
    `mod,`  
    `args,`  
    `kwargs=None,`  
    `*,`  
    `dynamic_shapes=None,`  
    `strict=True`  
`)`

## **Important Parameters**

> * **mod** (nn.Module or Callable): The module or function to trace into a stable graph.  
> * **args** (Tuple\[Any, ...\]): Example positional input arguments.  
> * **kwargs** (Dict\[str, Any\] or None): Example keyword input arguments.  
> * **dynamic\_shapes** (Dict or Tuple or None): Specifications mapping input dimensions to dynamic range symbols (Dim).  
> * **strict** (bool): If True, enforces strict tracing without non-PyTorch side effects.

## **Return Value**

An ExportedProgram object containing the underlying torch.fx.GraphModule, model parameters, buffers, and explicit input or output schemas.

## **Example**

`import torch`  
`import torch.nn as nn`  
`from torch.export import export, Dim`

`class Classifier(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.fc = nn.Linear(16, 4)`

    `def forward(self, x):`  
        `return self.fc(x)`

`model = Classifier().eval()`

`batch_size = Dim("batch", min=1, max=1024)`  
`dynamic_shapes = {"x": {0: batch_size}}`

`example_input = (torch.randn(2, 16),)`  
`exported_program = export(model, example_input, dynamic_shapes=dynamic_shapes)`

`print("ExportedProgram successfully created:")`  
`print(type(exported_program))`

## **Use When**

> * Target runtimes do not support Python dependencies (for example, Executorch, C++ LibTorch, ONNX converters).  
> * Sound mathematical graph extraction with functionalized ops and explicitly tracked parameters is required.  
> * Validating graph structure prior to custom compiler backend lowerings.

## **Avoid When**

> * Quick, in-process Python optimization is sufficient (use torch.compile instead).  
> * Working with legacy PyTorch codebases that rely heavily on TorchScript constructs.

## **Gotchas**

> * Unlike torch.compile, torch.export does not allow graph breaks; uncaptured Python side effects cause export failures.  
> * Inputs and outputs must be PyTorch Tensors or primitive types structured inside standard Python containers.  
> * Guard violations occur during runtime execution if dynamic inputs exceed defined Dim constraints.

## **Performance Notes**

> * ExportedProgram functionalizes parameters and buffers, creating clean entry points for memory planning and custom execution graphs.  
> * Enables downstream edge compilers to perform memory reuse analysis before model deployment.

## **Related APIs**

> * torch.export.save  
> * torch.export.load  
> * torch.export.Dim

## **Framework Migration Notes**

torch.export.export serves as PyTorch 2.x's modern counterpart to TensorFlow's SavedModel export, producing a standardized, sound graph representation without requiring Python execution.

## **TensorFlow Equivalent**

`torch.export.export → SavedModel export`

## **Version Compatibility**

Introduced in PyTorch 2.1 as the foundational export API for PyTorch 2.x ecosystem targets.

## **Search Metadata**

> * **Aliases**: torch.export, ExportedProgram, PT2 Export  
> * **Common Search Terms**: export PyTorch graph without Python, PyTorch export stable graph, ExportedProgram  
> * **Keywords**: export, dynamic\_shapes, Dim, sound graph, functionalization  
> * **Frequently Confused With**: torch.export vs TorchScript, torch.export vs torch.compile

## **Related Models**

resnet, vit, transformer, bert, llama

## **Related Patterns**

device-placement

## **Related Workflows**

image-classification-pipeline, production-llm-cost-latency-optimization

## **Related Cheatsheet**

deployment

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/export.html](https://pytorch.org/docs/stable/export.html)

## **Task**

Save and Load Exported Programs (torch.export.save / torch.export.load)

## **Problem Solved**

Persists and reloads exported PyTorch graphs (ExportedProgram artifacts) to and from disk for deployment across non-Python runtime environments or independent microservices.

## **Mental Trigger**

I need to serialize my exported PyTorch 2.x program artifact to disk and load it back safely in production.

## **Syntax**

`torch.export.save(exported_program, f)`  
`torch.export.load(f)`

## **Important Parameters**

> * **exported\_program** (ExportedProgram): The program instance produced by torch.export.export.  
> * **f** (str, pathlib.Path, or file-like object): Destination or source file path (typically with .pt2 extension).

## **Return Value**

torch.export.save returns None. torch.export.load returns an ExportedProgram instance.

## **Example**

`import pathlib`  
`import torch`  
`import torch.nn as nn`  
`from torch.export import export, save, load`

`class SimpleModule(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.layer = nn.Linear(8, 8)`

    `def forward(self, x):`  
        `return self.layer(x)`

`model = SimpleModule().eval()`  
`example_input = (torch.randn(1, 8),)`  
`exported_prog = export(model, example_input)`

`file_path = pathlib.Path("exported_model.pt2")`

`save(exported_prog, file_path)`

`loaded_prog = load(file_path)`  
`res = loaded_prog.module()(torch.randn(1, 8))`

`print("Loaded module inference shape:", res.shape)`

`if file_path.exists():`  
    `file_path.unlink()`

## **Use When**

> * Saving model graph representations produced in CI/CD pipelines for decoupled production deployment.  
> * Shipping pre-compiled export graphs to edge runtimes like ExecuTorch.  
> * Archiving functionalized graph structures alongside trained parameter states.

## **Avoid When**

> * Storing uncompiled PyTorch checkpoint files during intermediate training epochs (use torch.save state dictionaries instead).  
> * Working with legacy TorchScript runtime loaders.

## **Gotchas**

> * Loading a .pt2 file requires a PyTorch runtime version compatible with the schema version used during export.  
> * Standard torch.load cannot read .pt2 archives generated by torch.export.save.

## **Performance Notes**

> * The .pt2 format packages graph structure, parameter weights, and custom metadata into an efficient zip container to minimize disk footprint and load latency.

## **Related APIs**

> * torch.export.export  
> * torch.save  
> * torch.load

## **Framework Migration Notes**

Compares directly to loading a TensorFlow SavedModel folder or .pb graph definition file.

## **TensorFlow Equivalent**

`torch.export.save → tf.saved_model.save`  
`torch.export.load → tf.saved_model.load`

## **Version Compatibility**

Introduced in PyTorch 2.1. File format schemas are stabilized for PyTorch 2.x releases.

## **Search Metadata**

> * **Aliases**: torch.export.save, torch.export.load, .pt2 format  
> * **Common Search Terms**: save ExportedProgram, load pt2 file, serialize PyTorch export  
> * **Keywords**: export, save, load, pt2, ExportedProgram  
> * **Frequently Confused With**: torch.save vs torch.export.save

## **Related Models**

resnet, vit, transformer, bert, llama

## **Related Patterns**

device-placement

## **Related Workflows**

image-classification-pipeline, production-llm-cost-latency-optimization

## **Related Cheatsheet**

deployment

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/export.html\#saving-and-loading-an-exportedprogram](https://www.google.com/search?q=https://pytorch.org/docs/stable/export.html%23saving-and-loading-an-exportedprogram)

## **Task**

Script Models with torch.jit.script

## **Problem Solved**

Converts PyTorch module code with dynamic Python control flow (such as if statements or for loops) into a TorchScript ScriptModule using static AST inspection without requiring explicit dummy trace inputs.

## **Mental Trigger**

My model contains data-dependent Python loops or if/else branches that must be preserved when exporting to a C++ deployment runtime.

## **Syntax**

`torch.jit.script(obj, optimize=None, _frames_up=0)`

## **Important Parameters**

> * **obj** (nn.Module or Callable): The module, function, or class to inspect and compile into TorchScript IR.  
> * **optimize** (bool or None): Enables default TorchScript JIT optimization passes.

## **Return Value**

A ScriptModule or ScriptFunction containing the compiled TorchScript Intermediate Representation (IR).

## **Example**

`import torch`  
`import torch.nn as nn`

`class DynamicControlFlowModel(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.fc = nn.Linear(5, 5)`

    `def forward(self, x, flag: bool):`  
        `if flag:`  
            `return self.fc(x) * 2.0`  
        `return self.fc(x)`

`model = DynamicControlFlowModel().eval()`  
`scripted_model = torch.jit.script(model)`

`x = torch.randn(1, 5)`  
`out_true = scripted_model(x, True)`  
`out_false = scripted_model(x, False)`

`print("Scripted output (True):", out_true.shape)`  
`print("Scripted output (False):", out_false.shape)`

## **Use When**

> * Preserving dynamic Python control flow (if, while, for) inside the exported module graph.  
> * Deploying legacy models to LibTorch C++ environments where PyTorch 2.x torch.export is not available.

## **Avoid When**

> * Deploying modern PyTorch 2.x models where torch.compile or torch.export is supported.  
> * Compiling code relying on unsupported Python libraries (for example, NumPy or SciPy) inside forward().

## **Gotchas**

> * TorchScript implements a subset of Python; unsupported Python features or dynamic typing cause compilation errors.  
> * Type annotations (for example, x: torch.Tensor, flag: bool) are strictly enforced in function signatures.  
> * Modifying Python dictionary types with mixed value types inside forward() can trigger AST parser failures.

## **Performance Notes**

> * ScriptModule eliminates Python interpreter overhead in C++ hosting applications.  
> * JIT optimization passes perform operator fusion and dead-code elimination automatically.

## **Related APIs**

> * torch.jit.trace  
> * torch.jit.save  
> * torch.jit.freeze

## **Framework Migration Notes**

TorchScript scripting inspects Python AST code directly. This differs from TensorFlow 1.x graph construction while offering functionality similar to @tf.function AutoGraph parsing.

## **TensorFlow Equivalent**

`torch.jit.script → No direct equivalent.`

## **Version Compatibility**

Legacy TorchScript stack is fully supported for backwards compatibility, but PyTorch 2.x recommends torch.compile and torch.export for new deployments.

## **Search Metadata**

> * **Aliases**: torch.jit.script, ScriptModule, TorchScript scripting  
> * **Common Search Terms**: script PyTorch model, TorchScript dynamic control flow, JIT script  
> * **Keywords**: jit, script, control flow, AST, ScriptModule  
> * **Frequently Confused With**: torch.jit.script vs torch.jit.trace, torch.jit.script vs torch.compile

## **Related Models**

transformer, bert, roberta, t5, bart, gpt

## **Related Patterns**

device-placement

## **Related Workflows**

text-classification-pipeline-classical-encoder

## **Related Cheatsheet**

deployment

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.jit.script.html](https://www.google.com/search?q=https://pytorch.org/docs/stable/generated/torch.jit.script.html)

## **Task**

Trace Models with torch.jit.trace

## **Problem Solved**

Records exact tensor operations executed during a forward pass with dummy inputs to create a TorchScript static computation graph.

## **Mental Trigger**

I need a lightweight TorchScript graph for a feed-forward model without dynamic control flow for deployment in C++.

## **Syntax**

`torch.jit.trace(`  
    `func,`  
    `example_inputs,`  
    `check_trace=True,`  
    `check_tolerance=1e-05,`  
    `check_inputs=None,`  
    `strict=True`  
`)`

## **Important Parameters**

> * **func** (Callable or nn.Module): The module or function to trace.  
> * **example\_inputs** (Tuple or Tensor): Example tensor inputs passed to record operations.  
> * **check\_trace** (bool): Verifies whether the traced graph matches execution outputs on second evaluation.  
> * **check\_tolerance** (float): Numerical comparison threshold used during trace verification.  
> * **strict** (bool): Forces tracer to warn or fail when non-tensor variables or side effects are present.

## **Return Value**

A ScriptModule containing the traced static computation graph.

## **Example**

`import torch`  
`import torch.nn as nn`

`class FeedForward(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.net = nn.Sequential(`  
            `nn.Linear(10, 20),`  
            `nn.ReLU(),`  
            `nn.Linear(20, 2)`  
        `)`

    `def forward(self, x):`  
        `return self.net(x)`

`model = FeedForward().eval()`  
`dummy_input = torch.randn(1, 10)`

`traced_model = torch.jit.trace(model, dummy_input)`

`out = traced_model(torch.randn(4, 10))`  
`print("Traced inference shape:", out.shape)`

## **Use When**

> * Exporting standard feed-forward networks, CNNs, or static transformer layers with zero control flow branching.  
> * Generating quick JIT graphs without adding strict Python type annotations.

## **Avoid When**

> * Models contain input-dependent if conditions or dynamic loops (the tracer ignores unexecuted branches silently).  
> * Tracing operations that depend on non-Tensor Python primitives (for example, len(x) or int(x\[0\])).

## **Gotchas**

> * Dynamic control flow is silently baked into static constants based on the dummy input values provided during tracing.  
> * Tensor shape dimensions can become hardcoded unless written cleanly with dynamic tensor indexing.  
> * TracerWarning is suppressed by default in some environments, masking silently broken dynamic behavior.

## **Performance Notes**

> * Traced graphs remove Python runtime latency and enable LibTorch execution in C++ host environments.

## **Related APIs**

> * torch.jit.script  
> * torch.jit.save  
> * torch.onnx.export

## **Framework Migration Notes**

Functions identically to tracing behaviors in older TensorFlow tf.compat.v1.keras.backend.get\_session() graph extraction pipelines.

## **TensorFlow Equivalent**

`torch.jit.trace → tf.function (tracing mode)`

## **Version Compatibility**

Legacy API maintained for backwards compatibility across all PyTorch releases.

## **Search Metadata**

> * **Aliases**: torch.jit.trace, JIT tracing  
> * **Common Search Terms**: trace PyTorch model, torch.jit.trace dummy input, ScriptModule trace  
> * **Keywords**: jit, trace, static graph, dummy\_inputs, ScriptModule  
> * **Frequently Confused With**: torch.jit.trace vs torch.jit.script

## **Related Models**

resnet, vit, yolo, logistic-regression

## **Related Patterns**

device-placement

## **Related Workflows**

image-classification-pipeline, transfer-learning-for-vision

## **Related Cheatsheet**

deployment

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.jit.trace.html](https://www.google.com/search?q=https://pytorch.org/docs/stable/generated/torch.jit.trace.html)

## **Task**

Save and Load TorchScript Models (torch.jit.save / torch.jit.load)

## **Problem Solved**

Persists TorchScript models (ScriptModule) to standalone disk files and reloads them in Python or C++ LibTorch applications.

## **Mental Trigger**

I need to write my scripted or traced TorchScript model to disk and load it in a C++ deployment binary or Python inference service.

## **Syntax**

`torch.jit.save(m, f, _extra_files=None)`  
`torch.jit.load(f, map_location=None, _extra_files=None)`

## **Important Parameters**

> * **m** (ScriptModule): The TorchScript module to serialize.  
> * **f** (str, pathlib.Path, or file-like object): Output or input file path (typically .pt or .pth).  
> * **map\_location** (str, torch.device, or dict): Remaps storage locations (for example, "cpu", "cuda:0").  
> * **\_extra\_files** (dict): Map of filename keys to byte buffers for attaching custom metadata during serialization.

## **Return Value**

torch.jit.save returns None. torch.jit.load returns a ScriptModule object.

## **Example**

`import pathlib`  
`import torch`  
`import torch.nn as nn`

`class SimpleNet(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.fc = nn.Linear(4, 2)`

    `def forward(self, x):`  
        `return self.fc(x)`

`model = SimpleNet().eval()`  
`traced = torch.jit.trace(model, torch.randn(1, 4))`

`file_path = pathlib.Path("model_jit.pt")`

`torch.jit.save(traced, file_path)`

`loaded_jit = torch.jit.load(file_path, map_location="cpu")`  
`out = loaded_jit(torch.randn(2, 4))`

`print("Inference on loaded TorchScript model successful:", out.shape)`

`if file_path.exists():`  
    `file_path.unlink()`

## **Use When**

> * Archiving traced or scripted TorchScript models for C++ deployment.  
> * Serving models via legacy TorchServe versions or LibTorch wrappers.

## **Avoid When**

> * Loading standard Python module weights stored as raw state\_dict dictionaries (use torch.load instead).  
> * Working with new PyTorch 2.x ExportedProgram artifacts (use torch.export.load instead).

## **Gotchas**

> * Loading a TorchScript model on a system without a GPU requires explicitly specifying map\_location="cpu".  
> * Unpickling errors occur if the saved .pt file was produced by standard torch.save(model) rather than torch.jit.save.

## **Performance Notes**

> * Saved TorchScript models bundle weight tensors and graph bytecode together into a single zip file for simple deployment distribution.

## **Related APIs**

> * torch.jit.script  
> * torch.jit.trace  
> * torch.jit.freeze

## **Framework Migration Notes**

Maps directly to loading serialized C++ models in TensorFlow (SavedModel or frozen graph .pb files).

## **TensorFlow Equivalent**

`torch.jit.save → tf.saved_model.save`  
`torch.jit.load → tf.saved_model.load`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: torch.jit.save, torch.jit.load, ScriptModule save  
> * **Common Search Terms**: save TorchScript model, load pt file LibTorch, torch.jit.save extra files  
> * **Keywords**: jit, save, load, ScriptModule, archive  
> * **Frequently Confused With**: torch.jit.save vs torch.save

## **Related Models**

resnet, vit, yolo, bert

## **Related Patterns**

device-placement

## **Related Workflows**

image-classification-pipeline, text-classification-pipeline-classical-encoder

## **Related Cheatsheet**

deployment

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.jit.save.html](https://www.google.com/search?q=https://pytorch.org/docs/stable/generated/torch.jit.save.html)

## **Task**

Freeze TorchScript Models (torch.jit.freeze)

## **Problem Solved**

Inlines model parameters and attributes as immutable constants into the ScriptModule graph structure, enabling aggressive compiler optimizations like constant folding and dead-code elimination.

## **Mental Trigger**

I want to turn module weight parameters into graph constants to optimize TorchScript model latency and reduce overhead.

## **Syntax**

`torch.jit.freeze(`  
    `mod,`  
    `preserved_attrs=None,`  
    `optimize_numerics=True`  
`)`

## **Important Parameters**

> * **mod** (ScriptModule): The TorchScript module to freeze.  
> * **preserved\_attrs** (List\[str\] or None): Names of module attributes or submodules that must remain modifiable.  
> * **optimize\_numerics** (bool): Enables numerical optimizations such as fusing adjacent linear operations.

## **Return Value**

A frozen ScriptModule with parameter weights baked in as immutable graph constants.

## **Example**

`import torch`  
`import torch.nn as nn`

`class FrozenModel(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.fc = nn.Linear(8, 4)`

    `def forward(self, x):`  
        `return self.fc(x)`

`model = FrozenModel().eval()`  
`scripted = torch.jit.script(model)`

`frozen_scripted = torch.jit.freeze(scripted)`

`out = frozen_scripted(torch.randn(2, 8))`  
`print("Frozen ScriptModule output shape:", out.shape)`

## **Use When**

> * Finalizing a TorchScript model for production inference where weight updates will never occur.  
> * Shrinking graph execution overhead in real-time edge or server deployment pipelines.

## **Avoid When**

> * Further fine-tuning, training, or online adaptation of weights is needed.  
> * Module attributes must be updated dynamically during inference.

## **Gotchas**

> * Once frozen, module weights cannot be updated via load\_state\_dict().  
> * Accessing non-preserved internal attributes after freezing throws an exception.

## **Performance Notes**

> * Enables conv-batchnorm folding and constant propagation across graph nodes, reducing runtime latency and memory consumption.

## **Related APIs**

> * torch.jit.script  
> * torch.jit.trace

## **Framework Migration Notes**

Equivalent to freezing variables into constants in TensorFlow 1.x (freeze\_graph.py) or converting variables to constants in TensorFlow 2.x (tf.compat.v1.graph\_util.convert\_variables\_to\_constants\_v2).

## **TensorFlow Equivalent**

`torch.jit.freeze → tf.compat.v1.graph_util.convert_variables_to_constants_v2`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: torch.jit.freeze, freeze TorchScript  
> * **Common Search Terms**: optimize TorchScript model, freeze PyTorch parameters, fold batchnorm TorchScript  
> * **Keywords**: jit, freeze, constants, constant folding, conv-batchnorm fusion  
> * **Frequently Confused With**: torch.jit.freeze vs model.eval()

## **Related Models**

resnet, vit, yolo, bert

## **Related Patterns**

device-placement

## **Related Workflows**

image-classification-pipeline

## **Related Cheatsheet**

deployment

## **Related Decision Guides**

precision-tradeoffs-guide, hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.jit.freeze.html](https://www.google.com/search?q=https://pytorch.org/docs/stable/generated/torch.jit.freeze.html)

## **Task**

Export Models to ONNX (torch.onnx.export)

## **Problem Solved**

Converts PyTorch models into Open Neural Network Exchange (ONNX) format for deployment on third-party inference engines like ONNX Runtime, TensorRT, or OpenVINO.

## **Mental Trigger**

I need to export my PyTorch model to ONNX format to run on ONNX Runtime or TensorRT.

## **Syntax**

`torch.onnx.export(`  
    `model,`  
    `args,`  
    `f,`  
    `export_params=True,`  
    `verbose=False,`  
    `training=torch.onnx.TrainingMode.EVAL,`  
    `input_names=None,`  
    `output_names=None,`  
    `operator_export_type=torch.onnx.OperatorExportTypes.ONNX,`  
    `opset_version=None,`  
    `do_constant_folding=True,`  
    `dynamic_axes=None,`  
    `keep_initializers_as_inputs=None,`  
    `custom_opsets=None,`  
    `export_modules_as_functions=False`  
`)`

## **Important Parameters**

> * **model** (nn.Module, torch.jit.ScriptModule, or torch.export.ExportedProgram): Model to export.  
> * **args** (Tuple or Tensor): Dummy input tensors matching forward arguments.  
> * **f** (str, pathlib.Path, or file-like object): Destination file path (for example, model.onnx).  
> * **opset\_version** (int): Target ONNX operator set version (for example, 17).  
> * **do\_constant\_folding** (bool): Fuses pre-calculable constant expressions during export.

## **Return Value**

None. Writes the ONNX protobuf representation to file destination f.

## **Example**

`import pathlib`  
`import torch`  
`import torch.nn as nn`

`class VisionBlock(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.conv = nn.Conv2d(3, 16, kernel_size=3, padding=1)`  
        `self.relu = nn.ReLU()`

    `def forward(self, x):`  
        `return self.relu(self.conv(x))`

`model = VisionBlock().eval()`  
`dummy_input = torch.randn(1, 3, 224, 224)`  
`onnx_path = pathlib.Path("model.onnx")`

`torch.onnx.export(`  
    `model,`  
    `dummy_input,`  
    `onnx_path,`  
    `opset_version=17,`  
    `input_names=["input"],`  
    `output_names=["output"],`  
    `do_constant_folding=True`  
`)`

`print("ONNX model generated successfully:", onnx_path.exists())`

`if onnx_path.exists():`  
    `onnx_path.unlink()`

## **Use When**

> * Cross-platform production serving using ONNX Runtime across diverse hardware (CPU, CUDA, DirectML, OpenVINO).  
> * Converting models to NVIDIA TensorRT or Apple CoreML formats.

## **Avoid When**

> * Deploying purely within PyTorch-native Python or C++ LibTorch infrastructure.  
> * Working with complex custom C++ CUDNN ops without registered ONNX mappings.

## **Gotchas**

> * Failing to set model.eval() before export bakes training-mode dropout and batchnorm behavior into the ONNX graph.  
> * Choosing an outdated opset\_version causes missing operator mapping errors for modern layers.  
> * Dynamic control flow branches can be collapsed into static execution if traced naively.

## **Performance Notes**

> * do\_constant\_folding=True reduces graph execution overhead by computing static node math prior to serialization.

## **Related APIs**

> * torch.onnx.dynamo\_export  
> * torch.jit.trace

## **Framework Migration Notes**

Equivalent to exporting Keras/TensorFlow models to ONNX using tf2onnx.

## **TensorFlow Equivalent**

`torch.onnx.export → tf2onnx / ONNX export`

## **Version Compatibility**

PyTorch 2.1+ introduced torch.onnx.dynamo\_export based on TorchDynamo analysis, complementing traditional TorchScript-based ONNX export.

## **Search Metadata**

> * **Aliases**: torch.onnx.export, ONNX export, PyTorch to ONNX  
> * **Common Search Terms**: export PyTorch to ONNX, ONNX opset version, PyTorch ONNX export example  
> * **Keywords**: onnx, export, opset, constant\_folding, protobuf  
> * **Frequently Confused With**: torch.onnx.export vs torch.export.export

## **Related Models**

resnet, vit, yolo, bert, roberta

## **Related Patterns**

device-placement, mixed-precision

## **Related Workflows**

image-classification-pipeline, object-detection-pipeline, transfer-learning-for-vision

## **Related Cheatsheet**

deployment

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/onnx.html](https://pytorch.org/docs/stable/onnx.html)

## **Task**

Configure Dynamic Shapes and Export Options

## **Problem Solved**

Configures ONNX models to accept dynamic batch sizes, variable sequence lengths, or changing spatial image dimensions at inference time using dynamic\_axes.

## **Mental Trigger**

My ONNX model needs to process variable input batch sizes or text sequence lengths during serving without fixed shape constraints.

## **Syntax**

`torch.onnx.export(`  
    `model,`  
    `dummy_input,`  
    `onnx_path,`  
    `opset_version=17,`  
    `input_names=["input"],`  
    `output_names=["output"],`  
    `dynamic_axes={`  
        `"input": {0: "batch_size", 1: "seq_len"},`  
        `"output": {0: "batch_size"}`  
    `}`  
`)`

## **Important Parameters**

> * **dynamic\_axes** (Dict\[str, Dict\[int, str\]\] or Dict\[str, List\[int\]\]): Mapping of input/output names to dictionary indices specifying dynamic dimension labels.  
> * **input\_names** (List\[str\]): List of input tensor names used in the output graph.  
> * **output\_names** (List\[str\]): List of output tensor names used in the output graph.  
> * **opset\_version** (int): Target ONNX specification release number.

## **Return Value**

None. Generates an ONNX model protobuf file containing parameterized shape symbols.

## **Example**

`import pathlib`  
`import torch`  
`import torch.nn as nn`

`class TextEncoder(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.embedding = nn.Embedding(1000, 32)`  
        `self.fc = nn.Linear(32, 16)`

    `def forward(self, x):`  
        `return self.fc(self.embedding(x))`

`model = TextEncoder().eval()`  
`dummy_input = torch.randint(0, 1000, (2, 16))`  
`onnx_path = pathlib.Path("dynamic_text.onnx")`

`torch.onnx.export(`  
    `model,`  
    `dummy_input,`  
    `onnx_path,`  
    `opset_version=17,`  
    `input_names=["input_ids"],`  
    `output_names=["logits"],`  
    `dynamic_axes={`  
        `"input_ids": {0: "batch_size", 1: "sequence_length"},`  
        `"logits": {0: "batch_size", 1: "sequence_length"}`  
    `}`  
`)`

`print("Dynamic ONNX model created:", onnx_path.exists())`

`if onnx_path.exists():`  
    `onnx_path.unlink()`

## **Use When**

> * Microservices require dynamic batching across incoming user requests.  
> * NLP transformers process sentences with varying token sequence lengths.  
> * Vision pipelines process images of arbitrary input resolution.

## **Avoid When**

> * Deploying on hardware targets (like some edge DSPs or fixed FPGA runtimes) that strictly require fixed static memory layouts.

## **Gotchas**

> * Dynamic axes configurations must match corresponding output shape relationships or runtime shape mismatch errors occur.  
> * Unspecified dynamic axes remain hardcoded to the shape dimensions of the dummy tensor provided during export.

## **Performance Notes**

> * Engines like TensorRT require optimization profiles specifying minimum, optimal, and maximum shape bounds for dynamic dimensions.

## **Related APIs**

> * torch.onnx.export  
> * torch.export.Dim

## **Framework Migration Notes**

Maps directly to dynamic shape dimensions specified in TensorFlow TensorSpec(shape=\[None, ...\]) exports.

## **TensorFlow Equivalent**

`dynamic_axes → tf.TensorSpec(shape=[None, ...])`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: ONNX dynamic\_axes, dynamic batching ONNX  
> * **Common Search Terms**: PyTorch ONNX dynamic shapes, variable batch size ONNX export, dynamic\_axes example  
> * **Keywords**: onnx, dynamic\_axes, batch\_size, sequence\_length, variable shapes  
> * **Frequently Confused With**: dynamic\_axes in ONNX vs dynamic\_shapes in torch.export

## **Related Models**

bert, roberta, t5, bart, gpt, yolo

## **Related Patterns**

device-placement

## **Related Workflows**

text-classification-pipeline-classical-encoder, object-detection-pipeline

## **Related Cheatsheet**

deployment

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/onnx.html\#onnx-export-options](https://www.google.com/search?q=https://pytorch.org/docs/stable/onnx.html%23onnx-export-options)

## **Task**

Validate ONNX Models with ONNX Runtime

## **Problem Solved**

Verifies graph validity, numerical parity, and output precision matching between exported ONNX artifacts and original PyTorch models using onnxruntime.InferenceSession.

## **Mental Trigger**

I need to test my exported ONNX model in ONNX Runtime and verify its outputs match PyTorch within acceptable tolerance.

## **Syntax**

`import onnxruntime as ort`

`session = ort.InferenceSession(`  
    `path_or_bytes,`  
    `providers=["CPUExecutionProvider"]`  
`)`  
`outputs = session.run(output_names, input_feed)`

## **Important Parameters**

> * **path\_or\_bytes** (str, pathlib.Path, or bytes): Path to exported .onnx file.  
> * **providers** (List\[str\]): List of execution backends (for example, \['CUDAExecutionProvider', 'CPUExecutionProvider'\]).  
> * **input\_feed** (Dict\[str, np.ndarray\]): Dictionary mapping input layer names to NumPy array inputs.  
> * **output\_names** (List\[str\] or None): List of target output node names; None retrieves all outputs.

## **Return Value**

A list of NumPy arrays corresponding to model output nodes.

## **Example**

`import pathlib`  
`import numpy as np`  
`import torch`  
`import torch.nn as nn`  
`import onnxruntime as ort`

`class Classifier(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.fc = nn.Linear(10, 2)`

    `def forward(self, x):`  
        `return self.fc(x)`

`model = Classifier().eval()`  
`x_torch = torch.randn(1, 10)`  
`onnx_file = pathlib.Path("test_val.onnx")`

`torch.onnx.export(`  
    `model,`  
    `x_torch,`  
    `onnx_file,`  
    `opset_version=17,`  
    `input_names=["input"],`  
    `output_names=["output"]`  
`)`

`session = ort.InferenceSession(str(onnx_file), providers=["CPUExecutionProvider"])`  
`ort_inputs = {session.get_inputs()[0].name: x_torch.numpy()}`  
`ort_outs = session.run(None, ort_inputs)`

`torch_out = model(x_torch).detach().numpy()`  
`np.testing.assert_allclose(torch_out, ort_outs[0], rtol=1e-03, atol=1e-05)`

`print("ONNX model numerical parity validated successfully!")`

`if onnx_file.exists():`  
    `onnx_file.unlink()`

## **Use When**

> * Automated CI/CD testing pipelines validating exported ONNX model correctness.  
> * Catching precision drift or operator divergence prior to production serving.

## **Avoid When**

> * Rapidly iterating on pure PyTorch code without immediate ONNX deployment goals.

## **Gotchas**

> * Input names passed in input\_feed must match the string names specified during torch.onnx.export.  
> * ONNX Runtime expects standard NumPy arrays rather than PyTorch CUDA tensors.  
> * Minor floating point differences (for example, 10−5) can occur due to operator fusion or reordered floating-point math.

## **Performance Notes**

> * InferenceSession initialization overhead can be high; reuse session instances across requests in production serving.

## **Related APIs**

> * torch.onnx.export

## **Framework Migration Notes**

Uses standard ONNX Runtime Python APIs applicable across TensorFlow, PyTorch, and JAX exports.

## **TensorFlow Equivalent**

`onnxruntime.InferenceSession → tf.lite.Interpreter (conceptually)`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: ONNX validation, onnxruntime.InferenceSession, ONNX parity testing  
> * **Common Search Terms**: validate ONNX model Python, ONNX Runtime PyTorch output check, assert\_allclose ONNX  
> * **Keywords**: onnx, onnxruntime, InferenceSession, parity, testing  
> * **Frequently Confused With**: ONNX model validation vs onnx.check\_model graph check

## **Related Models**

resnet, vit, yolo, bert

## **Related Patterns**

device-placement

## **Related Workflows**

image-classification-pipeline, text-classification-pipeline-classical-encoder

## **Related Cheatsheet**

deployment

## **Related Decision Guides**

precision-tradeoffs-guide

## **Official Documentation**

[https://onnxruntime.ai/docs/api/python/api\_summary.html](https://onnxruntime.ai/docs/api/python/api_summary.html)

## **Task**

Save and Load Model Weights (torch.save / torch.load)

## **Problem Solved**

Persists model parameters (state\_dict) or complete Python module instances to disk and restores them safely across Python environments.

## **Mental Trigger**

I need to save my model's trained weight parameters to a file and load them into a fresh model instance later.

## **Syntax**

`torch.save(`  
    `obj,`  
    `f,`  
    `pickle_module=pickle,`  
    `pickle_protocol=DEFAULT_PROTOCOL,`  
    `_use_new_zipfile_serialization=True`  
`)`

`torch.load(`  
    `f,`  
    `map_location=None,`  
    `weights_only=True`  
`)`

## **Important Parameters**

> * **obj** (Object): State dictionary or Python object to serialize.  
> * **f** (str, pathlib.Path, or file-like object): Output file path (.pt or .pth).  
> * **map\_location** (str, torch.device, or Callable): Re-maps storage allocations (for example, "cpu" or "cuda:0").  
> * **weights\_only** (bool): Restricts unpickling to tensors, primitive types, and dictionaries to prevent arbitrary code execution vulnerabilities.

## **Return Value**

torch.save returns None. torch.load returns deserialized objects or state dictionaries.

## **Example**

`import pathlib`  
`import torch`  
`import torch.nn as nn`

`class Net(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.fc = nn.Linear(5, 2)`

    `def forward(self, x):`  
        `return self.fc(x)`

`model = Net()`  
`file_path = pathlib.Path("weights.pt")`

`torch.save(model.state_dict(), file_path)`

`new_model = Net()`  
`state_dict = torch.load(file_path, map_location="cpu", weights_only=True)`  
`new_model.load_state_dict(state_dict)`

`print("Model weights loaded successfully!")`

`if file_path.exists():`  
    `file_path.unlink()`

## **Use When**

> * Saving trained model parameter weights for deployment or fine-tuning.  
> * Always favor saving model.state\_dict() over pickling entire nn.Module classes.

## **Avoid When**

> * Serialization targets out-of-Python deployments (use torch.export or ONNX instead).

## **Gotchas**

> * Pickling full models (torch.save(model)) breaks if source class definitions or package file paths are refactored.  
> * Setting weights\_only=False when loading untrusted checkpoint files poses security risks via unpickling vulnerabilities.  
> * Loading GPU checkpoints without setting map\_location="cpu" fails on CPU-only instances.

## **Performance Notes**

> * \_use\_new\_zipfile\_serialization=True (default since PyTorch 1.6) uses a ZIP container to allow memory-mapped tensor loading.

## **Related APIs**

> * torch.nn.Module.state\_dict  
> * torch.nn.Module.load\_state\_dict

## **Framework Migration Notes**

Maps to saving weight files in TensorFlow (model.save\_weights).

## **TensorFlow Equivalent**

`torch.save → tf.train.Checkpoint / model.save_weights`

## **Version Compatibility**

PyTorch 2.4+ changed default loading behavior to enforce weights\_only=True for improved security.

## **Search Metadata**

> * **Aliases**: torch.save, torch.load, weight serialization  
> * **Common Search Terms**: save model state\_dict, load PyTorch weights safely, weights\_only PyTorch load  
> * **Keywords**: save, load, state\_dict, weights\_only, map\_location  
> * **Frequently Confused With**: torch.save vs torch.jit.save, full model save vs state\_dict save

## **Related Models**

resnet, vit, transformer, yolo, bert, llama

## **Related Patterns**

device-placement

## **Related Workflows**

image-classification-pipeline, transfer-learning-for-vision

## **Related Cheatsheet**

deployment

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.save.html](https://pytorch.org/docs/stable/generated/torch.save.html)

## **Task**

Save and Restore Training Checkpoints

## **Problem Solved**

Captures complete, multi-component training state snapshots (epoch, model state, optimizer state, scheduler state, loss history) for fault-tolerant training resumes.

## **Mental Trigger**

I need to save a complete training checkpoint containing model weights, optimizer state, epoch count, and loss metrics to resume training seamlessly.

## **Syntax**

`checkpoint = {`  
    `"epoch": epoch,`  
    `"model_state_dict": model.state_dict(),`  
    `"optimizer_state_dict": optimizer.state_dict(),`  
    `"loss": loss`  
`}`  
`torch.save(checkpoint, filepath)`

`checkpoint = torch.load(filepath, map_location=device, weights_only=True)`

## **Important Parameters**

> * **obj** (dict): Structured dictionary containing all state tracking components.  
> * **f** (str or Path): Checkpoint archive destination.  
> * **map\_location** (str or device): Target computing device for tensor deserialization.  
> * **weights\_only** (bool): Restricts unpickling to standard metadata collections and tensors.

## **Return Value**

Serialized checkpoint archive written to disk.

## **Example**

`import pathlib`  
`import torch`  
`import torch.nn as nn`  
`import torch.optim as optim`

`model = nn.Linear(10, 2)`  
`optimizer = optim.SGD(model.parameters(), lr=0.01)`  
`checkpoint_path = pathlib.Path("checkpoint.pt")`

`checkpoint = {`  
    `"epoch": 5,`  
    `"model_state_dict": model.state_dict(),`  
    `"optimizer_state_dict": optimizer.state_dict(),`  
    `"loss": 0.245`  
`}`  
`torch.save(checkpoint, checkpoint_path)`

`loaded_ckpt = torch.load(checkpoint_path, map_location="cpu", weights_only=True)`  
`model.load_state_dict(loaded_ckpt["model_state_dict"])`  
`optimizer.load_state_dict(loaded_ckpt["optimizer_state_dict"])`  
`start_epoch = loaded_ckpt["epoch"]`

`print(f"Resumed successfully from epoch {start_epoch}")`

`if checkpoint_path.exists():`  
    `checkpoint_path.unlink()`

## **Use When**

> * Long-running distributed training jobs vulnerable to preemptions or cloud instance spot terminations.  
> * Interrupted multi-stage training workflows requiring exact state reconstruction.

## **Avoid When**

> * Preparing finalized model artifacts solely for inference serving (strip optimizer states to minimize file size).

## **Gotchas**

> * Forgetting to save learning rate scheduler or loss scaler state dicts causes subtle training discrepancies upon resumption.  
> * Loading optimizer state dicts across different device types without proper map\_location handling triggers CUDA errors.

## **Performance Notes**

> * Saving full checkpoints including Adam momentum buffers doubles file storage requirements relative to raw model weights.

## **Related APIs**

> * torch.save  
> * torch.load  
> * torch.optim.Optimizer.state\_dict

## **Framework Migration Notes**

Provides exact structural equivalence to TensorFlow tf.train.Checkpoint dictionary management.

## **TensorFlow Equivalent**

`torch.save(checkpoint_dict) → tf.train.Checkpoint`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: PyTorch training checkpoints, checkpointing  
> * **Common Search Terms**: save resume training PyTorch, save optimizer state dict, complete training checkpoint  
> * **Keywords**: checkpoint, optimizer\_state\_dict, model\_state\_dict, resume, epoch  
> * **Frequently Confused With**: Model weights saving vs full training checkpoint saving

## **Related Models**

resnet, vit, transformer, bert, llama, deepseek

## **Related Patterns**

device-placement, memory-efficient-training

## **Related Workflows**

image-classification-pipeline, transfer-learning-for-vision

## **Related Cheatsheet**

deployment

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/notes/serialization.html\#saving-loading-a-general-checkpoint-for-inference-or-resuming-training](https://www.google.com/search?q=https://pytorch.org/docs/stable/notes/serialization.html%23saving-loading-a-general-checkpoint-for-inference-or-resuming-training)

## **Task**

Manage state\_dict for Models and Optimizers

## **Problem Solved**

Provides mechanisms to inspect, filter, rename, or transfer module weight dictionaries (state\_dict) for fine-tuning, transfer learning, and parameter manipulation.

## **Mental Trigger**

I need to extract parameter dictionaries, strip module. key prefixes from DistributedDataParallel models, or remap layer weights.

## **Syntax**

`state_dict = model.state_dict(destination=None, prefix="", keep_vars=False)`  
`missing_keys, unexpected_keys = model.load_state_dict(state_dict, strict=True)`

## **Important Parameters**

> * **strict** (bool): Enforces exact name matching between state dictionary keys and target module parameters.  
> * **prefix** (str): String prefix prepended to all dictionary parameter keys during extraction.  
> * **keep\_vars** (bool): Returns internal torch.Tensor parameters directly instead of detached copies.

## **Return Value**

state\_dict() returns an OrderedDict mapping layer key names to parameter tensors. load\_state\_dict() returns a NamedTuple containing missing\_keys and unexpected\_keys.

## **Example**

`import torch`  
`import torch.nn as nn`

`class Baseline(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.feature_extractor = nn.Linear(10, 8)`  
        `self.classifier = nn.Linear(8, 2)`

    `def forward(self, x):`  
        `return self.classifier(self.feature_extractor(x))`

`model = Baseline()`  
`raw_state_dict = model.state_dict()`

`# Simulate removing DDP 'module.' prefix from parameter keys`  
`prefixed_dict = {f"module.{k}": v for k, v in raw_state_dict.items()}`  
`clean_dict = {k.replace("module.", ""): v for k, v in prefixed_dict.items()}`

`new_model = Baseline()`  
`missing, unexpected = new_model.load_state_dict(clean_dict, strict=True)`

`print("Missing keys:", missing)`  
`print("Unexpected keys:", unexpected)`

## **Use When**

> * Removing parameter key prefixes added by torch.nn.DataParallel or DistributedDataParallel.  
> * Performing transfer learning where backbone layers are remapped while classification heads are replaced.  
> * Selectively loading parameter subsets during warm-starting experiments.

## **Avoid When**

> * Serializing full TorchScript graphs where parameter weights are already embedded within graph structures.

## **Gotchas**

> * Setting strict=False suppresses missing or unexpected key errors, potentially leaving target weights uninitialized.  
> * Incompatible tensor shapes between saved dictionary parameters and newly initialized module layers throw runtime errors during loading.

## **Performance Notes**

> * Modifying dictionary references in-place prevents duplicating memory footprints when remapping giant parameters across LLMs.

## **Related APIs**

> * torch.nn.Module.load\_state\_dict  
> * torch.save

## **Framework Migration Notes**

PyTorch state\_dict objects are standard Python OrderedDict instances containing raw tensors, offering more direct flexibility than TensorFlow variable trackable trees.

## **TensorFlow Equivalent**

`model.state_dict() → model.get_weights() / tf.train.Checkpoint`

## **Version Compatibility**

No significant changes in modern PyTorch releases.

## **Search Metadata**

> * **Aliases**: state\_dict, PyTorch state dictionary, parameter dictionary  
> * **Common Search Terms**: remove module prefix state\_dict, load\_state\_dict strict False, inspect model state\_dict  
> * **Keywords**: state\_dict, load\_state\_dict, strict, missing\_keys, unexpected\_keys  
> * **Frequently Confused With**: state\_dict vs model.parameters()

## **Related Models**

resnet, vit, transformer, yolo, bert, llama

## **Related Patterns**

device-placement

## **Related Workflows**

transfer-learning-for-vision, image-classification-pipeline

## **Related Cheatsheet**

deployment

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.nn.Module.html\#torch.nn.Module.state\_dict](https://www.google.com/search?q=https://pytorch.org/docs/stable/generated/torch.nn.Module.html%23torch.nn.Module.state_dict)

## **Task**

Build Production Inference Pipeline (model.eval \+ torch.inference\_mode)

## **Problem Solved**

Disables autograd engine overhead, disables dropout layers, and switches batch normalization to evaluation mode for low-latency production inference.

## **Mental Trigger**

I need to set up a production inference context that completely disables gradient tracking and configures modules like dropout and batchnorm for evaluation.

## **Syntax**

`model.eval()`

`with torch.inference_mode():`  
    `outputs = model(inputs)`

## **Important Parameters**

> * **mode** (bool): Flag enabling or disabling inference mode (defaults to True).

## **Return Value**

model.eval() returns the module instance. torch.inference\_mode() context manager or decorator yields zero-autograd execution scope.

## **Example**

`import torch`  
`import torch.nn as nn`

`class InferenceNet(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.drop = nn.Dropout(0.5)`  
        `self.fc = nn.Linear(10, 2)`

    `def forward(self, x):`  
        `return self.fc(self.drop(x))`

`model = InferenceNet()`  
`model.eval()`

`input_data = torch.randn(4, 10)`

`with torch.inference_mode():`  
    `logits = model(input_data)`

`print("Inference output shape:", logits.shape)`  
`print("Requires grad:", logits.requires_grad)`

## **Use When**

> * Running model inference in production environments.  
> * Prefer torch.inference\_mode over torch.no\_grad for better latency and memory optimization.

## **Avoid When**

> * Computing gradients for input optimization, adversarial attacks, or saliency map creation.

## **Gotchas**

> * model.eval() and torch.inference\_mode() perform distinct tasks: model.eval() changes layer execution behavior (for example, dropout rate to 0), whereas torch.inference\_mode() turns off autograd tracking. Both are required.  
> * Tensors created inside torch.inference\_mode() cannot be mutated outside the context block or used in subsequent autograd computations.

## **Performance Notes**

> * torch.inference\_mode() provides lower computational overhead than torch.no\_grad() by disabling view tracking and version counter updates completely.

## **Related APIs**

> * torch.no\_grad  
> * torch.enable\_grad

## **Framework Migration Notes**

Combines the functionality of setting training flags false in Keras (learning\_phase=0) with tf.stop\_gradient evaluation contexts.

## **TensorFlow Equivalent**

`model.eval() + torch.inference_mode() → model(x, training=False)`

## **Version Compatibility**

torch.inference\_mode was introduced in PyTorch 1.9 to supersede torch.no\_grad for dedicated inference workloads.

## **Search Metadata**

> * **Aliases**: torch.inference\_mode, model.eval(), PyTorch inference context  
> * **Common Search Terms**: PyTorch inference pipeline, difference model.eval and inference\_mode, speed up inference PyTorch  
> * **Keywords**: inference\_mode, eval, no\_grad, autograd, dropout  
> * **Frequently Confused With**: model.eval() vs torch.no\_grad(), torch.inference\_mode() vs torch.no\_grad()

## **Related Models**

resnet, vit, transformer, yolo, bert, llama, deepseek

## **Related Patterns**

device-placement, mixed-precision

## **Related Workflows**

image-classification-pipeline, text-classification-pipeline-classical-encoder, production-llm-cost-latency-optimization

## **Related Cheatsheet**

deployment

## **Related Decision Guides**

precision-tradeoffs-guide, hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/generated/torch.inference\_mode.html](https://www.google.com/search?q=https://pytorch.org/docs/stable/generated/torch.inference_mode.html)

## **Task**

Optimize Inference Device Placement and Precision

## **Problem Solved**

Maximizes inference throughput and minimizes GPU memory footprint using Automatic Mixed Precision (torch.autocast) alongside optimized asynchronous memory transfers.

## **Mental Trigger**

I want to optimize my inference pipeline by running half-precision arithmetic (FP16 or BF16) and placing tensors efficiently on compute devices.

## **Syntax**

`x = x.to(device, non_blocking=True)`

`with torch.autocast(device_type=device.type, dtype=torch.float16):`  
    `output = model(x)`

## **Important Parameters**

> * **device\_type** (str): Target accelerator computing device (for example, "cuda", "cpu", or "mps").  
> * **dtype** (torch.dtype): Reduced precision computational format (torch.float16 or torch.bfloat16).  
> * **non\_blocking** (bool): When True, attempts asynchronous host-to-device transfers overlapping with CPU computation.

## **Return Value**

Context manager establishing mixed precision casting rules across matrix operations within the scope block.

## **Example**

`import torch`  
`import torch.nn as nn`

`device = torch.device("cuda" if torch.cuda.is_available() else "cpu")`

`class HeavyModel(nn.Module):`  
    `def __init__(self):`  
        `super().__init__()`  
        `self.fc = nn.Linear(128, 64)`

    `def forward(self, x):`  
        `return self.fc(x)`

`model = HeavyModel().to(device).eval()`  
`inputs = torch.randn(8, 128, device=device)`

`with torch.inference_mode():`  
    `with torch.autocast(device_type=device.type, dtype=torch.float16, enabled=(device.type == "cuda")):`  
        `outputs = model(inputs)`

`print("Output tensor device:", outputs.device)`  
`print("Output tensor dtype:", outputs.dtype)`

## **Use When**

> * Deploying memory-intensive deep learning models on modern GPU architectures with Tensor Cores (NVIDIA Ampere, Hopper, Ada Lovelace).  
> * Increasing serving throughput by halving GPU VRAM bandwidth footprint.

## **Avoid When**

> * Deploying legacy hardware lacking hardware-accelerated FP16/BF16 matrix execution units.  
> * Operating models highly sensitive to underflow or numerical precision loss in output heads.

## **Gotchas**

> * non\_blocking=True requires source host tensors to be stored in pinned host memory via .pin\_memory().  
> * Executing FP16 on older GPU architectures without Tensor Cores can lead to slower execution compared to FP32.

## **Performance Notes**

> * Using BF16 or FP16 cuts memory bandwidth saturation by 50% and doubles available Tensor Core execution ops per second.

## **Related APIs**

> * torch.autocast  
> * torch.Tensor.pin\_memory  
> * torch.Tensor.to

## **Framework Migration Notes**

Corresponds to Keras mixed precision policies (tf.keras.mixed\_precision.set\_global\_policy('mixed\_float16')).

## **TensorFlow Equivalent**

`torch.autocast → tf.keras.mixed_precision.Policy`

## **Version Compatibility**

Unified torch.autocast(device\_type=...) syntax introduced in PyTorch 1.10, replacing deprecated device-specific autocast calls.

## **Search Metadata**

> * **Aliases**: torch.autocast, mixed precision inference, device placement  
> * **Common Search Terms**: PyTorch mixed precision inference, autocast FP16 PyTorch, non\_blocking CUDA transfer  
> * **Keywords**: autocast, float16, bfloat16, non\_blocking, pin\_memory  
> * **Frequently Confused With**: FP16 autocast vs full FP16 model casting (model.half())

## **Related Models**

resnet, vit, transformer, yolo, bert, llama, qwen, gemma, deepseek

## **Related Patterns**

device-placement, mixed-precision, kv-cache

## **Related Workflows**

image-classification-pipeline, production-llm-cost-latency-optimization

## **Related Cheatsheet**

deployment

## **Related Decision Guides**

precision-tradeoffs-guide, hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/docs/stable/amp.html](https://pytorch.org/docs/stable/amp.html)

## **Task**

Deploy Models with TorchServe

## **Problem Solved**

Packages PyTorch models into standardized Model Archive (.mar) files and serves them with REST and gRPC endpoints, dynamic batching, logging, and worker lifecycle management using TorchServe.

## **Mental Trigger**

I need to bundle my model into a .mar archive and serve it on TorchServe for enterprise REST or gRPC serving pipelines.

## **Syntax**

`torch-model-archiver \`  
  `--model-name <name> \`  
  `--version <ver> \`  
  `--model-file <file.py> \`  
  `--serialized-file <weights.pt> \`  
  `--handler <handler.py> \`  
  `--export-path <dir>`

`torchserve --start --model-store <dir> --models <name>=<name>.mar`

## **Important Parameters**

> * **\--model-name** (str): Service identifier for generated .mar archive.  
> * **\--version** (str): Version string for model tracking.  
> * **\--model-file** (str): Path to model class architecture Python script.  
> * **\--serialized-file** (str): Path to trained parameter weights (.pt or .pth).  
> * **\--handler** (str): Path to custom request handler script or built-in handler name (for example, "image\_classifier").

## **Return Value**

A serialized .mar file consumable by TorchServe runtime instances.

## **Example**

`# Custom TorchServe Handler Example (handler.py)`  
`import torch`  
`from ts.torch_handler.base_handler import BaseHandler`

`class ProductionHandler(BaseHandler):`  
    `def __init__(self):`  
        `super().__init__()`

    `def preprocess(self, data):`  
        `tensor_list = []`  
        `for row in data:`  
            `input_bytes = row.get("data") or row.get("body")`  
            `if isinstance(input_bytes, (bytes, bytearray)):`  
                `tensor = torch.randn(1, 10)`  
            `else:`  
                `tensor = torch.randn(1, 10)`  
            `tensor_list.append(tensor)`  
        `return torch.cat(tensor_list, dim=0)`

    `def inference(self, model_input):`  
        `with torch.inference_mode():`  
            `return self.model(model_input)`

    `def postprocess(self, inference_output):`  
        `return inference_output.tolist()`

## **Use When**

> * Deploying production-ready microservices managed via enterprise Kubernetes clusters or AWS SageMaker.  
> * Requiring built-in metrics, multi-worker scaling, dynamic request batching, and management endpoints out-of-the-box.

## **Avoid When**

> * Deploying simple single-process embedded applications where lightweight FastAPI wrappers are sufficient.  
> * Exporting standalone client-side applications on mobile or edge devices.

## **Gotchas**

> * Custom handlers must properly format output types into JSON-serializable Python lists or dictionaries.  
> * Mismatches between Python package dependencies in the host environment and .mar archiver build environments lead to runtime module import errors.

## **Performance Notes**

> * TorchServe supports worker-level parallelism across multi-GPU nodes and configures dynamic batching intervals to maximize batch utilization under heavy request loads.

## **Related APIs**

> * torch.save  
> * torch.jit.save

## **Framework Migration Notes**

TorchServe is PyTorch's official production serving engine, serving a role equivalent to TensorFlow Serving in the TF ecosystem.

## **TensorFlow Equivalent**

`TorchServe → TensorFlow Serving`

## **Version Compatibility**

Maintained as an independent open-source project co-developed by AWS and the PyTorch Foundation.

## **Search Metadata**

> * **Aliases**: TorchServe, torch-model-archiver, .mar archive  
> * **Common Search Terms**: deploy PyTorch model TorchServe, torch-model-archiver example, custom handler TorchServe  
> * **Keywords**: torchserve, mar, model-archiver, handler, rest, grpc  
> * **Frequently Confused With**: TorchServe vs FastAPI custom serving wrapper

## **Related Models**

resnet, vit, yolo, bert, roberta

## **Related Patterns**

device-placement

## **Related Workflows**

image-classification-pipeline, text-classification-pipeline-classical-encoder

## **Related Cheatsheet**

deployment

## **Related Decision Guides**

hardware-selection-guide

## **Official Documentation**

[https://pytorch.org/serve/](https://pytorch.org/serve/)

---

